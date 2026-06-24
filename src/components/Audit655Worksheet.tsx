import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface AnalyticalRow {
  id: string;
  account: string;
  currentYear: string;
  priorYear: string;
  budget: string;
  variance: string;
  variancePct: string;
  expectation: string;
  explanation: string;
  conclusion: string;
}

interface Data655 {
  rows: AnalyticalRow[];
  overallConclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const CONC_OPTIONS = ['Consistent with expectation', 'Explained — no further action', 'Unexplained — requires further investigation', 'Potential misstatement identified'];

function newRow(): AnalyticalRow {
  return { id: Math.random().toString(36).slice(2), account: '', currentYear: '', priorYear: '', budget: '', variance: '', variancePct: '', expectation: '', explanation: '', conclusion: '' };
}

function buildDefault(): Data655 {
  return { rows: [newRow(), newRow(), newRow()], overallConclusion: '', preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '', concluded: false, concludedOn: '' };
}

export function Audit655Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-655-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const [data, setData] = useState<Data655>(() => readJsonFromLocalStorage<Data655>(storageKey, buildDefault()) ?? buildDefault());

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const upd = (id: string, field: keyof AnalyticalRow, value: string) =>
    setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, [field]: value } : r) }));

  const td = "border border-border px-2 py-1.5 text-xs align-top";
  const th = "border border-border bg-muted px-2 py-1.5 text-xs font-medium text-left align-middle whitespace-nowrap";

  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objective</p>
        <p className="text-sm">Perform final analytical review procedures as an overall review of the financial statements near the end of the audit to identify any unusual or unexpected relationships that may indicate a risk of material misstatement not previously identified (CAS 520).</p>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Final Analytical Procedures</h3>
          {!locked && <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setData(d => ({ ...d, rows: [...d.rows, newRow()] }))}><Plus className="h-3 w-3" /> Add Row</Button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead><tr>
              <th className={th} style={{ width: 130 }}>Account / Area</th>
              <th className={th} style={{ width: 90 }}>Current Year $</th>
              <th className={th} style={{ width: 90 }}>Prior Year $</th>
              <th className={th} style={{ width: 90 }}>Budget $</th>
              <th className={th} style={{ width: 90 }}>Variance $</th>
              <th className={th} style={{ width: 70 }}>Variance %</th>
              <th className={th}>Expectation</th>
              <th className={th}>Explanation of Variances</th>
              <th className={th} style={{ width: 130 }}>Conclusion</th>
              {!locked && <th className={th} style={{ width: 32 }}></th>}
            </tr></thead>
            <tbody>{data.rows.map(row => (
              <tr key={row.id} className="hover:bg-muted/30">
                <td className={td}><Input disabled={locked} value={row.account} onChange={e => upd(row.id, 'account', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Account" /></td>
                <td className={td}><Input disabled={locked} value={row.currentYear} onChange={e => upd(row.id, 'currentYear', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Input disabled={locked} value={row.priorYear} onChange={e => upd(row.id, 'priorYear', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Input disabled={locked} value={row.budget} onChange={e => upd(row.id, 'budget', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Input disabled={locked} value={row.variance} onChange={e => upd(row.id, 'variance', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Input disabled={locked} value={row.variancePct} onChange={e => upd(row.id, 'variancePct', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0%" /></td>
                <td className={td}><Textarea disabled={locked} value={row.expectation} onChange={e => upd(row.id, 'expectation', e.target.value)} className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="What did we expect?" /></td>
                <td className={td}><Textarea disabled={locked} value={row.explanation} onChange={e => upd(row.id, 'explanation', e.target.value)} className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Explain variances" /></td>
                <td className={td}><Select disabled={locked} value={row.conclusion} onValueChange={v => upd(row.id, 'conclusion', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Select…" /></SelectTrigger><SelectContent>{CONC_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                {!locked && <td className={td + " text-center"}><button onClick={() => setData(d => ({ ...d, rows: d.rows.filter(r => r.id !== row.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <h3 className="text-sm font-semibold">Overall Conclusion</h3>
        <Textarea disabled={locked} value={data.overallConclusion} onChange={e => setData(d => ({ ...d, overallConclusion: e.target.value }))} className="text-xs min-h-[72px]" placeholder="State whether the final analytical review raised any concerns or confirmed prior audit conclusions." />
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
