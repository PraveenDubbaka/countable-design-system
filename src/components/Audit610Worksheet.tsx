import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext, } from "@/hooks/useEngagementContext";
import { loadRisks520, overallRisk520 } from "@/lib/audit520Bridge";
import { formatCurrency } from "@/lib/engagementContext";
import {
  WorksheetHeader, LinkedRisksCard, SignOffCard, ConcludeBar, type SignOffData,
} from "@/components/audit/WorksheetShell";

// ─── Sample-plan calculator (mirrors the spreadsheet on pages 1-3 of the source workbook) ──
type Method = "statistical" | "non-statistical";

interface SamplePlan {
  fsArea: string;
  assertions: string;
  purpose: string;
  populationDesc: string;
  controlsTested: string;
  riskLevel: "Low" | "Moderate" | "High";
  totalValue: string;         // A
  numberOfItems: string;
  keyItemsNature: string;
  keyItemsValue: string;      // B
  keyItemsCount: string;
  performanceMateriality: string; // D
  confidenceFactor: string;       // E (statistical only)
  method: Method;
}

interface TestResultItem {
  id: string;
  originalValue: string;
  auditedValue: string;
  reason: string;
}

interface Data610 {
  plan: SamplePlan;
  documentation: string;
  replacements: string;
  anomalies: string;
  results: TestResultItem[];
  testObjectivesMet: "Y" | "N" | "";
  testObjectivesMetExplain: string;
  deviationsOtherAreas: "Y" | "N" | "";
  deviationsOtherAreasExplain: string;
  conclusion: string;
  signOff: SignOffData;
  concluded: boolean; concludedOn: string;
}

function num(v: string): number { const n = parseFloat(String(v).replace(/[^0-9.\-]/g, "")); return isNaN(n) ? 0 : n; }

function newRow(): TestResultItem { return { id: Math.random().toString(36).slice(2), originalValue: "", auditedValue: "", reason: "" }; }

function buildDefault(initialPM: number): Data610 {
  return {
    plan: {
      fsArea: "", assertions: "", purpose: "", populationDesc: "", controlsTested: "",
      riskLevel: "Moderate",
      totalValue: "", numberOfItems: "",
      keyItemsNature: "", keyItemsValue: "0", keyItemsCount: "0",
      performanceMateriality: initialPM ? String(Math.round(initialPM)) : "",
      confidenceFactor: "1.6",
      method: "statistical",
    },
    documentation: "",
    replacements: "",
    anomalies: "",
    results: Array.from({ length: 5 }, newRow),
    testObjectivesMet: "", testObjectivesMetExplain: "",
    deviationsOtherAreas: "", deviationsOtherAreasExplain: "",
    conclusion: "",
    signOff: { preparedBy: "", preparedDate: "", reviewedBy: "", reviewedDate: "" },
    concluded: false, concludedOn: "",
  };
}

export function Audit610Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const risks = useMemo(() => loadRisks520(engagementId), [engagementId]);
  const overall = useMemo(() => overallRisk520(risks), [risks]);

  const storageKey = `audit-610-data-${engagementId ?? "default"}`;
  const [data, setData] = useState<Data610>(() => readJsonFromLocalStorage<Data610>(storageKey, buildDefault(ctx.performanceMateriality)) ?? buildDefault(ctx.performanceMateriality));

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const p = data.plan;

  // Derived calculations (matches the source spreadsheet)
  const A = num(p.totalValue);
  const B = num(p.keyItemsValue);
  const C = Math.max(A - B, 0);                           // remaining population
  const D = num(p.performanceMateriality);
  const E = num(p.confidenceFactor) || 0;
  const F = E > 0 ? D / E : 0;                            // sampling interval
  const G = F > 0 ? Math.ceil(C / F) : 0;                 // sample size

  // Projected misstatements
  const projected = data.results.reduce((acc, r) => {
    const ov = num(r.originalValue), av = num(r.auditedValue);
    const m = ov - av;
    const pctMis = ov !== 0 ? m / ov : 0;
    const proj = data.plan.method === "statistical" ? pctMis * F : m;
    return acc + proj;
  }, 0);

  const upd = <K extends keyof SamplePlan>(k: K, v: SamplePlan[K]) =>
    setData(d => ({ ...d, plan: { ...d.plan, [k]: v } }));

  const updResult = (id: string, field: keyof TestResultItem, value: string) =>
    setData(d => ({ ...d, results: d.results.map(r => r.id === id ? { ...r, [field]: value } : r) }));

  const Label = ({ children, hint }: { children: React.ReactNode; hint?: string }) => (
    <label className="text-[11px] font-medium text-muted-foreground block">{children}{hint && <span className="text-muted-foreground/70 font-normal"> · {hint}</span>}</label>
  );
  const Stat = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
    <div className="rounded-md border border-border bg-muted/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );

  const td = "border-b border-border px-2 py-1.5 text-xs align-top";

  return (
    <div className="p-4 space-y-4">
      <WorksheetHeader
        ctx={ctx}
        formNo="610"
        title="Sampling — Tests of Details"
        standard={`${ctx.standardPrefix} 530`}
        overallRisk={overall}
        objective="Use statistical or non-statistical (judgmental) sampling to provide a reasonable basis for conclusions about the population from which the sample is selected."
      />

      <LinkedRisksCard risks={risks.filter(r => r.source === "B")} emptyHint="Add assertion-level risks in Form 520 to scope this sample." />

      {/* ── Plan inputs ── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border"><h3 className="text-sm font-semibold">1 · Sample design</h3></div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <div><Label>Financial-statement area</Label><Input disabled={locked} value={p.fsArea} onChange={e => upd("fsArea", e.target.value)} className="h-8 text-xs" placeholder="e.g. Accounts Receivable" /></div>
          <div><Label>Assertion(s) addressed</Label><Input disabled={locked} value={p.assertions} onChange={e => upd("assertions", e.target.value)} className="h-8 text-xs" placeholder="e.g. C, AV, E" /></div>
          <div className="col-span-2"><Label>Purpose of the audit procedure</Label><Textarea disabled={locked} value={p.purpose} onChange={e => upd("purpose", e.target.value)} className="text-xs min-h-[52px]" placeholder="Describe what the test is intended to detect or substantiate" /></div>
          <div className="col-span-2"><Label>Population characteristics</Label><Textarea disabled={locked} value={p.populationDesc} onChange={e => upd("populationDesc", e.target.value)} className="text-xs min-h-[52px]" placeholder="e.g. all customer invoices issued during the period, excluding intercompany" /></div>
          <div className="col-span-2"><Label>Controls also tested (if any) and cross-reference</Label><Textarea disabled={locked} value={p.controlsTested} onChange={e => upd("controlsTested", e.target.value)} className="text-xs min-h-[40px]" placeholder="None / describe and reference WP" /></div>
          <div>
            <Label>Assessed RMM (Form 520)</Label>
            <Select disabled={locked} value={p.riskLevel} onValueChange={(v: SamplePlan["riskLevel"]) => upd("riskLevel", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Low" className="text-xs">Low</SelectItem><SelectItem value="Moderate" className="text-xs">Moderate</SelectItem><SelectItem value="High" className="text-xs">High</SelectItem></SelectContent>
            </Select>
          </div>
          <div>
            <Label>Evaluation method</Label>
            <Select disabled={locked} value={p.method} onValueChange={(v: Method) => upd("method", v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="statistical" className="text-xs">Statistical (MUS)</SelectItem><SelectItem value="non-statistical" className="text-xs">Non-statistical</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Sizing ── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border"><h3 className="text-sm font-semibold">2 · Population, key items &amp; sample size</h3></div>
        <div className="p-4 grid grid-cols-3 gap-3">
          <div><Label hint="A">Total monetary value $</Label><Input disabled={locked} value={p.totalValue} onChange={e => upd("totalValue", e.target.value)} className="h-8 text-xs" placeholder="0" /></div>
          <div><Label>Number of physical items</Label><Input disabled={locked} value={p.numberOfItems} onChange={e => upd("numberOfItems", e.target.value)} className="h-8 text-xs" placeholder="0" /></div>
          <div><Label hint="from Form 420">Performance materiality $ (D)</Label><Input disabled={locked} value={p.performanceMateriality} onChange={e => upd("performanceMateriality", e.target.value)} className="h-8 text-xs" placeholder={String(Math.round(ctx.performanceMateriality))} /></div>
          <div className="col-span-3"><Label>Nature of key items removed and tested separately</Label><Textarea disabled={locked} value={p.keyItemsNature} onChange={e => upd("keyItemsNature", e.target.value)} className="text-xs min-h-[40px]" placeholder="e.g. balances ≥ $100K, related-party items" /></div>
          <div><Label hint="B">Value of key items $</Label><Input disabled={locked} value={p.keyItemsValue} onChange={e => upd("keyItemsValue", e.target.value)} className="h-8 text-xs" placeholder="0" /></div>
          <div><Label>Number of key items</Label><Input disabled={locked} value={p.keyItemsCount} onChange={e => upd("keyItemsCount", e.target.value)} className="h-8 text-xs" placeholder="0" /></div>
          {p.method === "statistical" && (
            <div><Label hint="E · e.g. 1.6 (95 %)">Confidence factor</Label><Input disabled={locked} value={p.confidenceFactor} onChange={e => upd("confidenceFactor", e.target.value)} className="h-8 text-xs" /></div>
          )}
        </div>
        <div className="px-4 pb-4 grid grid-cols-4 gap-3">
          <Stat label="Remaining population (C = A−B)" value={formatCurrency(C)} mono />
          {p.method === "statistical" ? <>
            <Stat label="Sampling interval (F = D ÷ E)" value={F ? formatCurrency(F) : "—"} mono />
            <Stat label="Suggested sample size (G = C ÷ F)" value={G > 0 ? String(G) : "—"} mono />
            <Stat label="Confidence" value={`${E}x`} />
          </> : <>
            <Stat label="Performance materiality" value={D ? formatCurrency(D) : "—"} mono />
            <Stat label="Risk-based sample size" value={p.riskLevel === "High" ? "60" : p.riskLevel === "Moderate" ? "35" : "20"} />
            <Stat label="Coverage of population" value={A ? `${((B / A) * 100).toFixed(1)} % key + sample` : "—"} />
          </>}
        </div>
      </div>

      {/* ── Test results ── */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">3 · Test results &amp; projected misstatement</h3>
          {!locked && <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setData(d => ({ ...d, results: [...d.results, newRow()] }))}><Plus className="h-3 w-3" /> Add item</Button>}
        </div>
        <div className="p-4 space-y-3">
          <div><label className="text-[11px] font-medium text-muted-foreground">Documentation of items selected (W/P cross-reference)</label><Textarea disabled={locked} value={data.documentation} onChange={e => setData(d => ({ ...d, documentation: e.target.value }))} className="text-xs min-h-[48px]" /></div>
          <div><label className="text-[11px] font-medium text-muted-foreground">Replacements (count and reason)</label><Textarea disabled={locked} value={data.replacements} onChange={e => setData(d => ({ ...d, replacements: e.target.value }))} className="text-xs min-h-[40px]" /></div>
          <div><label className="text-[11px] font-medium text-muted-foreground">Anomalies identified</label><Textarea disabled={locked} value={data.anomalies} onChange={e => setData(d => ({ ...d, anomalies: e.target.value }))} className="text-xs min-h-[40px]" /></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-muted/60">
              <th className="text-left px-2 py-2 font-medium border-b border-border w-[40px]">#</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border">Original value $</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border">Audited value $</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border">Misstatement $</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border">Projected $</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border">Reason for misstatement</th>
              {!locked && <th className="border-b border-border w-[32px]"></th>}
            </tr></thead>
            <tbody>
              {data.results.map((r, i) => {
                const ov = num(r.originalValue), av = num(r.auditedValue), mis = ov - av;
                const pct = ov !== 0 ? mis / ov : 0;
                const proj = data.plan.method === "statistical" ? pct * F : mis;
                return (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className={`${td} text-muted-foreground`}>{i + 1}</td>
                    <td className={td}><Input disabled={locked} value={r.originalValue} onChange={e => updResult(r.id, "originalValue", e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                    <td className={td}><Input disabled={locked} value={r.auditedValue} onChange={e => updResult(r.id, "auditedValue", e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                    <td className={`${td} font-mono`}>{mis ? formatCurrency(mis) : "—"}</td>
                    <td className={`${td} font-mono`}>{proj ? formatCurrency(proj) : "—"}</td>
                    <td className={td}><Textarea disabled={locked} value={r.reason} onChange={e => updResult(r.id, "reason", e.target.value)} className="min-h-[48px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" /></td>
                    {!locked && <td className={td + " text-center"}><button onClick={() => setData(d => ({ ...d, results: d.results.filter(x => x.id !== r.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>}
                  </tr>
                );
              })}
              <tr className="bg-muted/40">
                <td colSpan={4} className={`${td} text-right font-medium`}>Projected misstatement (record on Form 335)</td>
                <td className={`${td} font-mono font-semibold`}>{projected ? formatCurrency(projected) : "—"}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Conclusion ── */}
      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-3">
        <h3 className="text-sm font-semibold">4 · Conclusion</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Were the test objectives achieved?</label>
            <Select disabled={locked} value={data.testObjectivesMet} onValueChange={(v: "Y" | "N" | "") => setData(d => ({ ...d, testObjectivesMet: v }))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent><SelectItem value="Y" className="text-xs">Yes</SelectItem><SelectItem value="N" className="text-xs">No</SelectItem></SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Deviations with possible effect on other audit areas?</label>
            <Select disabled={locked} value={data.deviationsOtherAreas} onValueChange={(v: "Y" | "N" | "") => setData(d => ({ ...d, deviationsOtherAreas: v }))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent><SelectItem value="Y" className="text-xs">Yes</SelectItem><SelectItem value="N" className="text-xs">No</SelectItem></SelectContent>
            </Select>
          </div>
          {data.testObjectivesMet === "N" && <div className="col-span-2"><Textarea disabled={locked} value={data.testObjectivesMetExplain} onChange={e => setData(d => ({ ...d, testObjectivesMetExplain: e.target.value }))} className="text-xs min-h-[48px]" placeholder="Explain and describe further procedures planned" /></div>}
          {data.deviationsOtherAreas === "Y" && <div className="col-span-2"><Textarea disabled={locked} value={data.deviationsOtherAreasExplain} onChange={e => setData(d => ({ ...d, deviationsOtherAreasExplain: e.target.value }))} className="text-xs min-h-[48px]" placeholder="Describe the effect; update the audit strategy accordingly" /></div>}
        </div>
        <div>
          <label className="text-[11px] font-medium text-muted-foreground">Overall sampling conclusion</label>
          <Textarea disabled={locked} value={data.conclusion} onChange={e => setData(d => ({ ...d, conclusion: e.target.value }))} className="text-xs min-h-[64px]" placeholder="Conclude on whether the population is fairly stated within performance materiality." />
        </div>
      </div>

      <SignOffCard data={data.signOff} locked={locked} onChange={(k, v) => setData(d => ({ ...d, signOff: { ...d.signOff, [k]: v } }))} />
      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn}
        onConclude={() => { const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) }; setData(u); writeJsonToLocalStorage(storageKey, u); }} />
    </div>
  );
}
