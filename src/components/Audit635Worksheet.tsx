import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface EstimateRow {
  id: string;
  estimate: string;
  amount: string;
  approach: string;
  proceduresPerformed: string;
  auditorsEstimate: string;
  difference: string;
  withinRange: string;
  conclusion: string;
}

interface Data635 {
  rows: EstimateRow[];
  overallConclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const APPROACH_OPTIONS = ['Review of events after the balance sheet date', 'Test management\'s process', 'Develop an independent estimate', 'All three approaches'];
const YN_OPTIONS = ['Yes', 'No'];
const CONC_OPTIONS = ['Reasonable', 'Reasonable — with disclosure', 'Potentially misstated — investigate further', 'Misstated — proposed adjustment'];

function newRow(): EstimateRow {
  return { id: Math.random().toString(36).slice(2), estimate: '', amount: '', approach: '', proceduresPerformed: '', auditorsEstimate: '', difference: '', withinRange: '', conclusion: '' };
}

function buildDefault(): Data635 {
  return { rows: [newRow(), newRow()], overallConclusion: '', preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '', concluded: false, concludedOn: '' };
}

export function Audit635Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-635-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const [data, setData] = useState<Data635>(() => readJsonFromLocalStorage<Data635>(storageKey, buildDefault()) ?? buildDefault());

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const upd = (id: string, field: keyof EstimateRow, value: string) =>
    setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, [field]: value } : r) }));

  const td = "border border-border px-2 py-1.5 text-xs align-top";
  const th = "border border-border bg-muted px-2 py-1.5 text-xs font-medium text-left align-middle whitespace-nowrap";

  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objective</p>
        <p className="text-sm">Document further audit procedures performed on significant accounting estimates, assess whether estimates are reasonable, and conclude on any differences between management's estimates and the auditor's point estimate or range (CAS 540).</p>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Accounting Estimates — Further Audit Procedures</h3>
          {!locked && <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setData(d => ({ ...d, rows: [...d.rows, newRow()] }))}><Plus className="h-3 w-3" /> Add Estimate</Button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead><tr>
              <th className={th} style={{ width: 130 }}>Estimate / Account</th>
              <th className={th} style={{ width: 90 }}>Management's Amount $</th>
              <th className={th} style={{ width: 140 }}>Audit Approach</th>
              <th className={th}>Procedures Performed</th>
              <th className={th} style={{ width: 100 }}>Auditor's Estimate $</th>
              <th className={th} style={{ width: 90 }}>Difference $</th>
              <th className={th} style={{ width: 80 }}>Within Acceptable Range?</th>
              <th className={th} style={{ width: 130 }}>Conclusion</th>
              {!locked && <th className={th} style={{ width: 32 }}></th>}
            </tr></thead>
            <tbody>{data.rows.map(row => (
              <tr key={row.id} className="hover:bg-muted/30">
                <td className={td}><Textarea disabled={locked} value={row.estimate} onChange={e => upd(row.id, 'estimate', e.target.value)} className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="e.g. AR allowance" /></td>
                <td className={td}><Input disabled={locked} value={row.amount} onChange={e => upd(row.id, 'amount', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Select disabled={locked} value={row.approach} onValueChange={v => upd(row.id, 'approach', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Select…" /></SelectTrigger><SelectContent>{APPROACH_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                <td className={td}><Textarea disabled={locked} value={row.proceduresPerformed} onChange={e => upd(row.id, 'proceduresPerformed', e.target.value)} className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Describe procedures" /></td>
                <td className={td}><Input disabled={locked} value={row.auditorsEstimate} onChange={e => upd(row.id, 'auditorsEstimate', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0 or range" /></td>
                <td className={td}><Input disabled={locked} value={row.difference} onChange={e => upd(row.id, 'difference', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Select disabled={locked} value={row.withinRange} onValueChange={v => upd(row.id, 'withinRange', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Y/N" /></SelectTrigger><SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                <td className={td}><Select disabled={locked} value={row.conclusion} onValueChange={v => upd(row.id, 'conclusion', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Select…" /></SelectTrigger><SelectContent>{CONC_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                {!locked && <td className={td + " text-center"}><button onClick={() => setData(d => ({ ...d, rows: d.rows.filter(r => r.id !== row.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <h3 className="text-sm font-semibold">Overall Conclusion</h3>
        <Textarea disabled={locked} value={data.overallConclusion} onChange={e => setData(d => ({ ...d, overallConclusion: e.target.value }))} className="text-xs min-h-[72px]" placeholder="Summarize conclusions on all significant estimates tested." />
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <h3 className="text-sm font-semibold mb-3">Sign-off</h3>
        <div className="grid grid-cols-2 gap-3">
          {[['Prepared by', 'preparedBy', 'preparedDate'], ['Reviewed by', 'reviewedBy', 'reviewedDate']].map(([label, nk, dk]) => (
            <div key={nk} className="space-y-1.5"><p className="text-xs font-medium text-muted-foreground">{label}</p><div className="flex gap-2"><Input disabled={locked} value={(data as unknown as Record<string, string>)[nk]} onChange={e => setData(d => ({ ...d, [nk]: e.target.value }))} className="h-7 text-xs flex-1" placeholder="Name" /><Input disabled={locked} type="date" value={(data as unknown as Record<string, string>)[dk]} onChange={e => setData(d => ({ ...d, [dk]: e.target.value }))} className="h-7 text-xs w-32" /></div></div>
          ))}
        </div>
      </div>
      {locked ? <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-800 font-medium">Concluded on {data.concludedOn}</div> : (
        <div className="flex justify-end"><Button size="sm" onClick={() => { const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) }; setData(u); writeJsonToLocalStorage(storageKey, u); }}>Conclude Worksheet</Button></div>
      )}
    </div>
  );
}
