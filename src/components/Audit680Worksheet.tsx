import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface SupplementRow {
  id: string;
  area: string;
  requirement: string;
  procedurePerformed: string;
  finding: string;
  conclusion: string;
  wpRef: string;
}

interface Data680 {
  entityName: string;
  periodEnd: string;
  rows: SupplementRow[];
  overallConclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const CONC_OPTIONS = ['Compliant', 'Not applicable', 'Requires disclosure', 'Non-compliance identified'];

const DEFAULT_AREAS = [
  { area: 'Capital disclosures', requirement: 'ASPE 3251 — Disclose objectives, policies and processes for managing capital; quantitative data about what the entity regards as capital.' },
  { area: 'Financial instruments', requirement: 'ASPE 3856 — Fair value disclosure; risk exposure disclosure (credit, liquidity, market risk); classification of instruments.' },
  { area: 'Government assistance', requirement: 'ASPE 3800 — Disclose nature and amounts of government assistance recognized; unfulfilled conditions; contingencies.' },
  { area: 'Employee future benefits', requirement: 'ASPE 3462 — Disclose plan details; benefit obligations; plan assets; significant assumptions.' },
  { area: 'Income taxes', requirement: 'ASPE 3465 — Disclose income tax expense; deferred tax balances; temporary differences.' },
];

function newRow(area = '', requirement = ''): SupplementRow {
  return { id: Math.random().toString(36).slice(2), area, requirement, procedurePerformed: '', finding: '', conclusion: '', wpRef: '' };
}

function buildDefault(): Data680 {
  return {
    entityName: '', periodEnd: '',
    rows: DEFAULT_AREAS.map(d => newRow(d.area, d.requirement)),
    overallConclusion: '',
    preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '',
    concluded: false, concludedOn: '',
  };
}

export function Audit680Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-680-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const [data, setData] = useState<Data680>(() => readJsonFromLocalStorage<Data680>(storageKey) ?? buildDefault());

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const upd = (id: string, field: keyof SupplementRow, value: string) =>
    setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, [field]: value } : r) }));

  const td = "border border-border px-2 py-1.5 text-xs align-top";
  const th = "border border-border bg-muted px-2 py-1.5 text-xs font-medium text-left align-middle whitespace-nowrap";

  return (
    <div className="p-4 space-y-4 text-sm">
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objective</p>
        <p className="text-sm">Document additional audit procedures required for supplementary ASPE disclosure requirements, confirm compliance, and identify any areas requiring disclosure or adjustment.</p>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Entity Name</label><Input disabled={locked} value={data.entityName} onChange={e => setData(d => ({ ...d, entityName: e.target.value }))} className="h-7 text-xs" placeholder="Entity name" /></div>
          <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Period End Date</label><Input disabled={locked} type="date" value={data.periodEnd} onChange={e => setData(d => ({ ...d, periodEnd: e.target.value }))} className="h-7 text-xs" /></div>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">ASPE Supplementary Audit Procedures</h3>
          {!locked && <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setData(d => ({ ...d, rows: [...d.rows, newRow()] }))}><Plus className="h-3 w-3" /> Add Area</Button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead><tr>
              <th className={th} style={{ width: 130 }}>Area</th>
              <th className={th} style={{ width: 200 }}>ASPE Requirement</th>
              <th className={th}>Procedure Performed</th>
              <th className={th}>Finding</th>
              <th className={th} style={{ width: 130 }}>Conclusion</th>
              <th className={th} style={{ width: 70 }}>WP Ref</th>
              {!locked && <th className={th} style={{ width: 32 }}></th>}
            </tr></thead>
            <tbody>{data.rows.map(row => (
              <tr key={row.id} className="hover:bg-muted/30">
                <td className={td}><Input disabled={locked} value={row.area} onChange={e => upd(row.id, 'area', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent font-medium" placeholder="Area" /></td>
                <td className={td}><Textarea disabled={locked} value={row.requirement} onChange={e => upd(row.id, 'requirement', e.target.value)} className="min-h-[72px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="ASPE requirement" /></td>
                <td className={td}><Textarea disabled={locked} value={row.procedurePerformed} onChange={e => upd(row.id, 'procedurePerformed', e.target.value)} className="min-h-[72px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Describe procedures" /></td>
                <td className={td}><Textarea disabled={locked} value={row.finding} onChange={e => upd(row.id, 'finding', e.target.value)} className="min-h-[72px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Document findings" /></td>
                <td className={td}><Select disabled={locked} value={row.conclusion} onValueChange={v => upd(row.id, 'conclusion', v)}><SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="Select…" /></SelectTrigger><SelectContent>{CONC_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent></Select></td>
                <td className={td}><Input disabled={locked} value={row.wpRef} onChange={e => upd(row.id, 'wpRef', e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="WP ref" /></td>
                {!locked && <td className={td + " text-center"}><button onClick={() => setData(d => ({ ...d, rows: d.rows.filter(r => r.id !== row.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <h3 className="text-sm font-semibold">Overall Conclusion</h3>
        <Textarea disabled={locked} value={data.overallConclusion} onChange={e => setData(d => ({ ...d, overallConclusion: e.target.value }))} className="text-xs min-h-[72px]" placeholder="Conclude on whether all required ASPE supplementary disclosures are complete and adequate." />
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
