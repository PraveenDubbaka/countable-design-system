import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface SampleRow {
  id: string;
  account: string;
  population: string;
  samplingMethod: string;
  sampleSize: string;
  tolerableError: string;
  itemsTested: string;
  errorsFound: string;
  projectedError: string;
  conclusion: string;
}

interface Data610 {
  objective: string;
  rows: SampleRow[];
  overallConclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const SAMPLING_OPTIONS = ['Random', 'Systematic', 'Stratified random', 'Monetary unit sampling (MUS)', 'Haphazard', 'Judgmental'];
const CONCLUSION_OPTIONS = ['No misstatement', 'Misstatement within tolerable error', 'Misstatement exceeds tolerable error — further action required'];

function newRow(): SampleRow {
  return { id: Math.random().toString(36).slice(2), account: '', population: '', samplingMethod: '', sampleSize: '', tolerableError: '', itemsTested: '', errorsFound: '', projectedError: '', conclusion: '' };
}

function buildDefault(): Data610 {
  return { objective: '', rows: [newRow(), newRow()], overallConclusion: '', preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '', concluded: false, concludedOn: '' };
}

export function Audit610Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-610-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const [data, setData] = useState<Data610>(() => readJsonFromLocalStorage<Data610>(storageKey, buildDefault()) ?? buildDefault());

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const updateRow = (id: string, field: keyof SampleRow, value: string) =>
    setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, [field]: value } : r) }));

  const td = "border border-border px-2 py-1.5 text-xs align-top";
  const th = "border border-border bg-muted px-2 py-1.5 text-xs font-medium text-left align-middle whitespace-nowrap";

  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objective</p>
        <p className="text-sm">Document the design, execution and evaluation of audit sampling for tests of details, including the sampling method, sample size, results and projected error.</p>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Sampling objective / scope</label>
        <Textarea disabled={locked} value={data.objective} onChange={e => setData(d => ({ ...d, objective: e.target.value }))} className="text-xs min-h-[56px]" placeholder="Describe the audit objective for which sampling is being used" />
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Sampling — Tests of Details</h3>
          {!locked && <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setData(d => ({ ...d, rows: [...d.rows, newRow()] }))}><Plus className="h-3 w-3" /> Add Row</Button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead><tr>
              <th className={th} style={{ width: 120 }}>Account / Area</th>
              <th className={th} style={{ width: 90 }}>Population $</th>
              <th className={th} style={{ width: 120 }}>Sampling Method</th>
              <th className={th} style={{ width: 70 }}>Sample Size</th>
              <th className={th} style={{ width: 90 }}>Tolerable Error $</th>
              <th className={th} style={{ width: 70 }}>Items Tested</th>
              <th className={th} style={{ width: 90 }}>Errors Found $</th>
              <th className={th} style={{ width: 100 }}>Projected Error $</th>
              <th className={th}>Conclusion</th>
              {!locked && <th className={th} style={{ width: 32 }}></th>}
            </tr></thead>
            <tbody>{data.rows.map(row => (
              <tr key={row.id} className="hover:bg-muted/30">
                <td className={td}><Input disabled={locked} value={row.account} onChange={e => updateRow(row.id, 'account', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Account" /></td>
                <td className={td}><Input disabled={locked} value={row.population} onChange={e => updateRow(row.id, 'population', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Select disabled={locked} value={row.samplingMethod} onValueChange={v => updateRow(row.id, 'samplingMethod', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Select…" /></SelectTrigger><SelectContent>{SAMPLING_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                <td className={td}><Input disabled={locked} value={row.sampleSize} onChange={e => updateRow(row.id, 'sampleSize', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="n" /></td>
                <td className={td}><Input disabled={locked} value={row.tolerableError} onChange={e => updateRow(row.id, 'tolerableError', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Input disabled={locked} value={row.itemsTested} onChange={e => updateRow(row.id, 'itemsTested', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="n" /></td>
                <td className={td}><Input disabled={locked} value={row.errorsFound} onChange={e => updateRow(row.id, 'errorsFound', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Input disabled={locked} value={row.projectedError} onChange={e => updateRow(row.id, 'projectedError', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                <td className={td}><Select disabled={locked} value={row.conclusion} onValueChange={v => updateRow(row.id, 'conclusion', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Select…" /></SelectTrigger><SelectContent>{CONCLUSION_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                {!locked && <td className={td + " text-center"}><button onClick={() => setData(d => ({ ...d, rows: d.rows.filter(r => r.id !== row.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <h3 className="text-sm font-semibold">Overall Conclusion</h3>
        <Textarea disabled={locked} value={data.overallConclusion} onChange={e => setData(d => ({ ...d, overallConclusion: e.target.value }))} className="text-xs min-h-[72px]" placeholder="Summarize the overall sampling results and their impact on audit conclusions." />
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
