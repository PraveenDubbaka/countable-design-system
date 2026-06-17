import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface RPTRow {
  id: string;
  relatedParty: string;
  relationship: string;
  transactionType: string;
  amount: string;
  terms: string;
  armLength: string;
  authorized: string;
  disclosed: string;
  auditResponse: string;
  wpRef: string;
}

interface Data666 {
  rows: RPTRow[];
  overallConclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const ARM_OPTIONS = ['Yes — arm\'s length terms', 'No — non-arm\'s length', 'Unable to determine'];
const YN_OPTIONS = ['Yes', 'No', 'NA'];

function newRow(): RPTRow {
  return { id: Math.random().toString(36).slice(2), relatedParty: '', relationship: '', transactionType: '', amount: '', terms: '', armLength: '', authorized: '', disclosed: '', auditResponse: '', wpRef: '' };
}

function buildDefault(): Data666 {
  return { rows: [newRow(), newRow()], overallConclusion: '', preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '', concluded: false, concludedOn: '' };
}

export function Audit666Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-666-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const [data, setData] = useState<Data666>(() => readJsonFromLocalStorage<Data666>(storageKey) ?? buildDefault());

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const upd = (id: string, field: keyof RPTRow, value: string) =>
    setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, [field]: value } : r) }));

  const td = "border border-border px-2 py-1.5 text-xs align-top";
  const th = "border border-border bg-muted px-2 py-1.5 text-xs font-medium text-left align-middle whitespace-nowrap";

  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objective</p>
        <p className="text-sm">Document all significant related party transactions, assess whether they are conducted on arm's length terms, verify authorization and appropriate disclosure in the financial statements (CAS 550).</p>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Related Party Transactions</h3>
          {!locked && <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setData(d => ({ ...d, rows: [...d.rows, newRow()] }))}><Plus className="h-3 w-3" /> Add Transaction</Button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead><tr>
              <th className={th} style={{ width: 120 }}>Related Party</th>
              <th className={th} style={{ width: 110 }}>Relationship</th>
              <th className={th} style={{ width: 110 }}>Transaction Type</th>
              <th className={th} style={{ width: 90 }}>Amount $</th>
              <th className={th}>Terms / Conditions</th>
              <th className={th} style={{ width: 120 }}>Arm's Length?</th>
              <th className={th} style={{ width: 80 }}>Authorized?</th>
              <th className={th} style={{ width: 80 }}>Disclosed?</th>
              <th className={th}>Audit Response</th>
              <th className={th} style={{ width: 70 }}>WP Ref</th>
              {!locked && <th className={th} style={{ width: 32 }}></th>}
            </tr></thead>
            <tbody>{data.rows.map(row => (
              <tr key={row.id} className="hover:bg-muted/30">
                <td className={td}><Textarea disabled={locked} value={row.relatedParty} onChange={e => upd(row.id, 'relatedParty', e.target.value)} className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Name" /></td>
                <td className={td}><Textarea disabled={locked} value={row.relationship} onChange={e => upd(row.id, 'relationship', e.target.value)} className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Describe relationship" /></td>
                <td className={td}><Input disabled={locked} value={row.transactionType} onChange={e => upd(row.id, 'transactionType', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="e.g. Management fees" /></td>
                <td className={td}><Input disabled={locked} value={row.amount} onChange={e => upd(row.id, 'amount', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Textarea disabled={locked} value={row.terms} onChange={e => upd(row.id, 'terms', e.target.value)} className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Terms and conditions" /></td>
                <td className={td}><Select disabled={locked} value={row.armLength} onValueChange={v => upd(row.id, 'armLength', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Select…" /></SelectTrigger><SelectContent>{ARM_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                <td className={td}><Select disabled={locked} value={row.authorized} onValueChange={v => upd(row.id, 'authorized', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Y/N" /></SelectTrigger><SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                <td className={td}><Select disabled={locked} value={row.disclosed} onValueChange={v => upd(row.id, 'disclosed', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Y/N" /></SelectTrigger><SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                <td className={td}><Textarea disabled={locked} value={row.auditResponse} onChange={e => upd(row.id, 'auditResponse', e.target.value)} className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Procedures performed" /></td>
                <td className={td}><Input disabled={locked} value={row.wpRef} onChange={e => upd(row.id, 'wpRef', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="WP ref" /></td>
                {!locked && <td className={td + " text-center"}><button onClick={() => setData(d => ({ ...d, rows: d.rows.filter(r => r.id !== row.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <h3 className="text-sm font-semibold">Overall Conclusion</h3>
        <Textarea disabled={locked} value={data.overallConclusion} onChange={e => setData(d => ({ ...d, overallConclusion: e.target.value }))} className="text-xs min-h-[72px]" placeholder="Conclude on whether related party transactions are appropriately disclosed and there are no undisclosed transactions." />
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
