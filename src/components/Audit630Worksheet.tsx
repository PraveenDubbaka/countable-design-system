import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface ConfirmRow {
  id: string;
  confirmee: string;
  type: string;
  amountRequested: string;
  sentDate: string;
  receivedDate: string;
  amountConfirmed: string;
  difference: string;
  differenceExplained: string;
  conclusion: string;
}

interface Data630 {
  rows: ConfirmRow[];
  overallConclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const TYPE_OPTIONS = ['Bank balance', 'Accounts receivable', 'Accounts payable', 'Legal letter', 'Loan balance', 'Investment', 'Other'];
const CONC_OPTIONS = ['Confirmed — no difference', 'Confirmed — difference resolved', 'No response — alternative procedures performed', 'Unresolved difference'];

function newRow(): ConfirmRow {
  return { id: Math.random().toString(36).slice(2), confirmee: '', type: '', amountRequested: '', sentDate: '', receivedDate: '', amountConfirmed: '', difference: '', differenceExplained: '', conclusion: '' };
}

function buildDefault(): Data630 {
  return { rows: [newRow(), newRow(), newRow()], overallConclusion: '', preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '', concluded: false, concludedOn: '' };
}

export function Audit630Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-630-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const [data, setData] = useState<Data630>(() => readJsonFromLocalStorage<Data630>(storageKey) ?? buildDefault());

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const upd = (id: string, field: keyof ConfirmRow, value: string) =>
    setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, [field]: value } : r) }));

  const td = "border border-border px-2 py-1.5 text-xs align-top";
  const th = "border border-border bg-muted px-2 py-1.5 text-xs font-medium text-left align-middle whitespace-nowrap";

  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objective</p>
        <p className="text-sm">Summarize all external confirmations sent and received, document differences and their resolution, and conclude on the sufficiency of evidence obtained from confirmation procedures (CAS 505).</p>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">External Confirmations Summary</h3>
          {!locked && <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setData(d => ({ ...d, rows: [...d.rows, newRow()] }))}><Plus className="h-3 w-3" /> Add Row</Button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead><tr>
              <th className={th}>Confirmee / Respondent</th>
              <th className={th} style={{ width: 110 }}>Confirmation Type</th>
              <th className={th} style={{ width: 90 }}>Amount Requested $</th>
              <th className={th} style={{ width: 85 }}>Date Sent</th>
              <th className={th} style={{ width: 90 }}>Date Received</th>
              <th className={th} style={{ width: 100 }}>Amount Confirmed $</th>
              <th className={th} style={{ width: 90 }}>Difference $</th>
              <th className={th}>Difference Explanation</th>
              <th className={th} style={{ width: 120 }}>Conclusion</th>
              {!locked && <th className={th} style={{ width: 32 }}></th>}
            </tr></thead>
            <tbody>{data.rows.map(row => (
              <tr key={row.id} className="hover:bg-muted/30">
                <td className={td}><Textarea disabled={locked} value={row.confirmee} onChange={e => upd(row.id, 'confirmee', e.target.value)} className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Name of party" /></td>
                <td className={td}><Select disabled={locked} value={row.type} onValueChange={v => upd(row.id, 'type', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Select…" /></SelectTrigger><SelectContent>{TYPE_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                <td className={td}><Input disabled={locked} value={row.amountRequested} onChange={e => upd(row.id, 'amountRequested', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Input disabled={locked} type="date" value={row.sentDate} onChange={e => upd(row.id, 'sentDate', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" /></td>
                <td className={td}><Input disabled={locked} type="date" value={row.receivedDate} onChange={e => upd(row.id, 'receivedDate', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" /></td>
                <td className={td}><Input disabled={locked} value={row.amountConfirmed} onChange={e => upd(row.id, 'amountConfirmed', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Input disabled={locked} value={row.difference} onChange={e => upd(row.id, 'difference', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Textarea disabled={locked} value={row.differenceExplained} onChange={e => upd(row.id, 'differenceExplained', e.target.value)} className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Explain any difference" /></td>
                <td className={td}><Select disabled={locked} value={row.conclusion} onValueChange={v => upd(row.id, 'conclusion', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Select…" /></SelectTrigger><SelectContent>{CONC_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                {!locked && <td className={td + " text-center"}><button onClick={() => setData(d => ({ ...d, rows: d.rows.filter(r => r.id !== row.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <h3 className="text-sm font-semibold">Overall Conclusion</h3>
        <Textarea disabled={locked} value={data.overallConclusion} onChange={e => setData(d => ({ ...d, overallConclusion: e.target.value }))} className="text-xs min-h-[72px]" placeholder="Summarize the confirmation results and overall audit conclusion." />
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <h3 className="text-sm font-semibold mb-3">Sign-off</h3>
        <div className="grid grid-cols-2 gap-3">
          {[['Prepared by', 'preparedBy', 'preparedDate'], ['Reviewed by', 'reviewedBy', 'reviewedDate']].map(([label, nk, dk]) => (
            <div key={nk} className="space-y-1.5"><p className="text-xs font-medium text-muted-foreground">{label}</p><div className="flex gap-2"><Input disabled={locked} value={(data as Record<string, string>)[nk]} onChange={e => setData(d => ({ ...d, [nk]: e.target.value }))} className="h-7 text-xs flex-1" placeholder="Name" /><Input disabled={locked} type="date" value={(data as Record<string, string>)[dk]} onChange={e => setData(d => ({ ...d, [dk]: e.target.value }))} className="h-7 text-xs w-32" /></div></div>
          ))}
        </div>
      </div>
      {locked ? <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-800 font-medium">Concluded on {data.concludedOn}</div> : (
        <div className="flex justify-end"><Button size="sm" onClick={() => { const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) }; setData(u); writeJsonToLocalStorage(storageKey, u); }}>Conclude Worksheet</Button></div>
      )}
    </div>
  );
}
