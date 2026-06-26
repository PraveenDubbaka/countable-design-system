import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Plus, Trash2 } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

// ── Types ──────────────────────────────────────────────────────────────────────

type YSN = "Y" | "S" | "N" | "";
type YN = "Y" | "N" | "NA" | "";
type Assertion = "C" | "E" | "AV" | "P";

interface RiskFactorRow {
  id: string;
  description: string;          // What can go wrong
  assertions: Assertion[];      // C / E / AV / P
  isSignificantRisk: YN;
}

interface ControlRow {
  id: string;
  riskFactorId: string;         // links to a risk factor (or 'all')
  description: string;
  controlType: string;          // Preventive/Detective/Manual/Automated/ITGC
  frequency: string;
  designEffective: YSN;         // Y/S/N
  implemented: YN;              // Y/N
  relyOnControl: YN;            // plan to test operating effectiveness
  wpRef: RefDoc[];
  comments: string;
}

interface CycleBlock {
  id: string;
  cycle: string;                // SCOTABD / business cycle
  riskFactors: RiskFactorRow[];
  controls: ControlRow[];
  designConclusion: YSN;        // overall for cycle
  conclusionRationale: string;
}

interface Data540 {
  cycles: CycleBlock[];
  overallConclusion: YSN;
  overallNotes: string;
  notes: string;
  concluded: boolean;
  concludedOn: string;
}

// ── Reference data ─────────────────────────────────────────────────────────────

const ASSERTION_LABELS: Record<Assertion, string> = {
  C: "Completeness",
  E: "Existence / Occurrence",
  AV: "Accuracy / Valuation",
  P: "Presentation",
};

const CONTROL_TYPES = [
  "Preventive — Manual",
  "Preventive — Automated",
  "Detective — Manual",
  "Detective — Automated",
  "IT-dependent manual",
  "IT general control (ITGC)",
];

const FREQUENCIES = ["Per transaction", "Daily", "Weekly", "Monthly", "Quarterly", "Annually", "Ad hoc"];

// Suggested risk factors library (from Note 2 of Form 540)
const SUGGESTED_RISK_FACTORS: { text: string; assertions: Assertion[] }[] = [
  { text: "Sales/services are recorded in the wrong accounting period", assertions: ["C", "E", "AV"] },
  { text: "Fictitious sales/sales credits are recorded in the accounts", assertions: ["E"] },
  { text: "Goods shipped/services performed are not invoiced", assertions: ["C"] },
  { text: "No allowance is recorded for doubtful or uncollectable balances", assertions: ["AV"] },
  { text: "Duplicate payments are made", assertions: ["E"] },
  { text: "Payments made for goods/services not received", assertions: ["E"] },
  { text: "Expenses are recorded in the wrong accounting period", assertions: ["C", "E", "AV"] },
  { text: "Unsupported or duplicate journal entries are made", assertions: ["E", "AV"] },
  { text: "Spreadsheets used contain logic, amount or calculation errors", assertions: ["AV"] },
  { text: "Estimates, fair market values or valuations contain bias", assertions: ["C", "E"] },
  { text: "Missing, inaccurate or misleading financial statement disclosures", assertions: ["P"] },
  { text: "Fictitious personnel are on the payroll", assertions: ["E"] },
  { text: "Terminated employees not removed from the payroll", assertions: ["E"] },
  { text: "Unauthorized changes to pay rates or benefits", assertions: ["AV"] },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function uid(): string { return Math.random().toString(36).slice(2, 9); }

function emptyRiskFactor(): RiskFactorRow {
  return { id: uid(), description: "", assertions: [], isSignificantRisk: "" };
}
function emptyControl(riskFactorId = "all"): ControlRow {
  return {
    id: uid(), riskFactorId, description: "", controlType: "", frequency: "",
    designEffective: "", implemented: "", relyOnControl: "", wpRef: [], comments: "",
  };
}
function emptyCycle(): CycleBlock {
  return {
    id: uid(), cycle: "",
    riskFactors: [emptyRiskFactor()],
    controls: [emptyControl()],
    designConclusion: "", conclusionRationale: "",
  };
}

function buildDefault(): Data540 {
  return {
    cycles: [emptyCycle()],
    overallConclusion: "",
    overallNotes: "",
    notes: "",
    concluded: false, concludedOn: "",
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Audit540Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-540-data-${engagementId ?? "default"}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const [data, setData] = useState<Data540>(() => {
    const saved = readJsonFromLocalStorage<Data540 | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    return {
      ...def,
      ...saved,
      cycles: saved.cycles?.length ? saved.cycles : def.cycles,
    };
  });

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  // ── Mutators ────────────────────────────────────────────────────────────────
  function patchCycle(cid: string, patch: Partial<CycleBlock>) {
    setData(d => ({ ...d, cycles: d.cycles.map(c => c.id === cid ? { ...c, ...patch } : c) }));
  }
  function addCycle() { setData(d => ({ ...d, cycles: [...d.cycles, emptyCycle()] })); }
  function removeCycle(cid: string) {
    setData(d => ({ ...d, cycles: d.cycles.length > 1 ? d.cycles.filter(c => c.id !== cid) : d.cycles }));
  }

  function setRiskFactor(cid: string, rid: string, patch: Partial<RiskFactorRow>) {
    setData(d => ({
      ...d,
      cycles: d.cycles.map(c => c.id !== cid ? c : {
        ...c, riskFactors: c.riskFactors.map(r => r.id === rid ? { ...r, ...patch } : r),
      }),
    }));
  }
  function addRiskFactor(cid: string, preset?: { text: string; assertions: Assertion[] }) {
    setData(d => ({
      ...d,
      cycles: d.cycles.map(c => c.id !== cid ? c : {
        ...c,
        riskFactors: [...c.riskFactors, preset
          ? { id: uid(), description: preset.text, assertions: preset.assertions, isSignificantRisk: "" }
          : emptyRiskFactor()],
      }),
    }));
  }
  function removeRiskFactor(cid: string, rid: string) {
    setData(d => ({
      ...d,
      cycles: d.cycles.map(c => c.id !== cid ? c : {
        ...c,
        riskFactors: c.riskFactors.length > 1 ? c.riskFactors.filter(r => r.id !== rid) : c.riskFactors,
        controls: c.controls.map(ctrl => ctrl.riskFactorId === rid ? { ...ctrl, riskFactorId: "all" } : ctrl),
      }),
    }));
  }
  function toggleAssertion(cid: string, rid: string, a: Assertion) {
    setData(d => ({
      ...d,
      cycles: d.cycles.map(c => c.id !== cid ? c : {
        ...c,
        riskFactors: c.riskFactors.map(r => r.id !== rid ? r : {
          ...r,
          assertions: r.assertions.includes(a) ? r.assertions.filter(x => x !== a) : [...r.assertions, a],
        }),
      }),
    }));
  }

  function setControl(cid: string, ctlId: string, patch: Partial<ControlRow>) {
    setData(d => ({
      ...d,
      cycles: d.cycles.map(c => c.id !== cid ? c : {
        ...c, controls: c.controls.map(ct => ct.id === ctlId ? { ...ct, ...patch } : ct),
      }),
    }));
  }
  function addControl(cid: string) {
    setData(d => ({
      ...d,
      cycles: d.cycles.map(c => c.id !== cid ? c : { ...c, controls: [...c.controls, emptyControl()] }),
    }));
  }
  function removeControl(cid: string, ctlId: string) {
    setData(d => ({
      ...d,
      cycles: d.cycles.map(c => c.id !== cid ? c : {
        ...c, controls: c.controls.length > 1 ? c.controls.filter(ct => ct.id !== ctlId) : c.controls,
      }),
    }));
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">
      {/* Objective banner */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-3 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          To identify controls that address the risk of material misstatement at the assertion level and evaluate whether
          the controls have been designed effectively and have been implemented (CAS 315).
          <span className="block mt-1.5 text-[11px]">
            <span className="font-semibold text-foreground">Legend: </span>
            Assertions: <b>C</b> = Completeness, <b>E</b> = Existence/Occurrence, <b>AV</b> = Accuracy/Valuation, <b>P</b> = Presentation. &nbsp;
            Control design: <b>Y</b> = Mitigated, <b>S</b> = Some treatment, <b>N</b> = Significant deficiency. &nbsp;
            SCOTABD = Significant class of transactions, account balances and disclosures.
          </span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Cycles */}
        {data.cycles.map((cycle, cIdx) => (
          <div key={cycle.id} className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">SCOTABD #{cIdx + 1}</span>
                <Input disabled={locked} value={cycle.cycle}
                  onChange={e => patchCycle(cycle.id, { cycle: e.target.value })}
                  placeholder="Business cycle (e.g., Revenue, receivables and receipts)"
                  className="h-8 text-xs max-w-xl" />
              </div>
              {!locked && data.cycles.length > 1 && (
                <button onClick={() => removeCycle(cycle.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Risk Factors */}
            <div className="border-b border-border">
              <div className="px-6 py-2.5 bg-muted/40 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Risk factors — what can go wrong
                </span>
                {!locked && (
                  <div className="flex gap-2">
                    <Select onValueChange={v => {
                      const preset = SUGGESTED_RISK_FACTORS.find(p => p.text === v);
                      if (preset) addRiskFactor(cycle.id, preset);
                    }}>
                      <SelectTrigger className="h-7 text-xs w-44"><SelectValue placeholder="Insert from library…" /></SelectTrigger>
                      <SelectContent className="max-h-80">
                        {SUGGESTED_RISK_FACTORS.map(p => (
                          <SelectItem key={p.text} value={p.text} className="text-xs">{p.text}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => addRiskFactor(cycle.id)}>
                      <Plus className="h-3.5 w-3.5" /> Add risk
                    </Button>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/20 border-b border-border">
                      <th className="px-4 py-2 text-center font-semibold uppercase tracking-wider w-10">#</th>
                      <th className="px-4 py-2 text-left font-semibold uppercase tracking-wider" style={{ minWidth: 320 }}>Risk factor</th>
                      <th className="px-4 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 220 }}>Assertions impacted</th>
                      <th className="px-4 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 130 }}>Significant risk?</th>
                      {!locked && <th className="w-10"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cycle.riskFactors.map((r, i) => (
                      <tr key={r.id} className="hover:bg-muted/30 align-top">
                        <td className="px-4 py-2 text-center font-mono text-foreground">{i + 1}</td>
                        <td className="px-4 py-2">
                          <Textarea disabled={locked} value={r.description}
                            onChange={e => setRiskFactor(cycle.id, r.id, { description: e.target.value })}
                            placeholder="Describe what can go wrong…"
                            className="min-h-[52px] text-xs resize-none rounded-[10px]" />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {(Object.keys(ASSERTION_LABELS) as Assertion[]).map(a => {
                              const active = r.assertions.includes(a);
                              return (
                                <button key={a} type="button" disabled={locked}
                                  onClick={() => toggleAssertion(cycle.id, r.id, a)}
                                  title={ASSERTION_LABELS[a]}
                                  className={`h-7 min-w-[36px] px-2 rounded-md border text-[11px] font-semibold transition-colors ${
                                    active ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-input hover:bg-muted"
                                  } ${locked ? "opacity-60 cursor-not-allowed" : ""}`}>
                                  {a}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <Select disabled={locked} value={r.isSignificantRisk}
                            onValueChange={v => setRiskFactor(cycle.id, r.id, { isSignificantRisk: v as YN })}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Y" className="text-xs">Yes</SelectItem>
                              <SelectItem value="N" className="text-xs">No</SelectItem>
                              <SelectItem value="NA" className="text-xs">N/A</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        {!locked && (
                          <td className="px-2 py-2 text-center">
                            <button onClick={() => removeRiskFactor(cycle.id, r.id)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Controls */}
            <div>
              <div className="px-6 py-2.5 bg-muted/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Control activities — design &amp; implementation
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Map each control to a risk factor and document the design / implementation conclusion.
                  </p>
                </div>
                {!locked && (
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => addControl(cycle.id)}>
                    <Plus className="h-3.5 w-3.5" /> Add control
                  </Button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/20 border-b border-border">
                      <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider w-10">#</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider" style={{ width: 150 }}>Risk addressed</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider" style={{ minWidth: 260 }}>Control description</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider" style={{ width: 150 }}>Type</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider" style={{ width: 120 }}>Frequency</th>
                      <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 100 }}>Design (Y/S/N)</th>
                      <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 110 }}>Implemented?</th>
                      <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 100 }}>Plan to test?</th>
                      <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider" style={{ minWidth: 220 }}>Comments</th>
                      <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 90 }}>W/P ref.</th>
                      {!locked && <th className="w-10"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cycle.controls.map((ct, i) => (
                      <tr key={ct.id} className="hover:bg-muted/30 align-top">
                        <td className="px-3 py-2 text-center font-mono">{i + 1}</td>
                        <td className="px-3 py-2">
                          <Select disabled={locked} value={ct.riskFactorId || "all"}
                            onValueChange={v => setControl(cycle.id, ct.id, { riskFactorId: v })}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all" className="text-xs">All / cycle-wide</SelectItem>
                              {cycle.riskFactors.map((r, idx) => (
                                <SelectItem key={r.id} value={r.id} className="text-xs">
                                  R{idx + 1} — {r.description ? r.description.slice(0, 60) : "(unnamed)"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2">
                          <Textarea disabled={locked} value={ct.description}
                            onChange={e => setControl(cycle.id, ct.id, { description: e.target.value })}
                            placeholder="Describe the control activity and who performs it…"
                            className="min-h-[60px] text-xs resize-none rounded-[10px]" />
                        </td>
                        <td className="px-3 py-2">
                          <Select disabled={locked} value={ct.controlType}
                            onValueChange={v => setControl(cycle.id, ct.id, { controlType: v })}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                            <SelectContent>
                              {CONTROL_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2">
                          <Select disabled={locked} value={ct.frequency}
                            onValueChange={v => setControl(cycle.id, ct.id, { frequency: v })}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                            <SelectContent>
                              {FREQUENCIES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Select disabled={locked} value={ct.designEffective}
                            onValueChange={v => setControl(cycle.id, ct.id, { designEffective: v as YSN })}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Y" className="text-xs">Y — Mitigated</SelectItem>
                              <SelectItem value="S" className="text-xs">S — Some treatment</SelectItem>
                              <SelectItem value="N" className="text-xs">N — Deficiency</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Select disabled={locked} value={ct.implemented}
                            onValueChange={v => setControl(cycle.id, ct.id, { implemented: v as YN })}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Y" className="text-xs">Yes</SelectItem>
                              <SelectItem value="N" className="text-xs">No</SelectItem>
                              <SelectItem value="NA" className="text-xs">N/A</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Select disabled={locked} value={ct.relyOnControl}
                            onValueChange={v => setControl(cycle.id, ct.id, { relyOnControl: v as YN })}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Y" className="text-xs">Yes</SelectItem>
                              <SelectItem value="N" className="text-xs">No</SelectItem>
                              <SelectItem value="NA" className="text-xs">N/A</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 py-2">
                          <Textarea disabled={locked} value={ct.comments}
                            onChange={e => setControl(cycle.id, ct.id, { comments: e.target.value })}
                            placeholder="Walkthrough / inspection results, deficiencies, planned response…"
                            className="min-h-[60px] text-xs resize-none rounded-[10px]" />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <RefButton
                            reference={ct.wpRef}
                            onAttach={doc => setControl(cycle.id, ct.id, { wpRef: [...ct.wpRef, doc] })}
                            onRemove={idx => setControl(cycle.id, ct.id, { wpRef: ct.wpRef.filter((_, i2) => i2 !== idx) })}
                          />
                        </td>
                        {!locked && (
                          <td className="px-2 py-2 text-center">
                            <button onClick={() => removeControl(cycle.id, ct.id)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Per-cycle conclusion */}
            <div className="px-6 py-4 bg-muted/20 border-t border-border grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Cycle conclusion — design</label>
                <Select disabled={locked} value={cycle.designConclusion}
                  onValueChange={v => patchCycle(cycle.id, { designConclusion: v as YSN })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y" className="text-xs">Y — Controls mitigate risks</SelectItem>
                    <SelectItem value="S" className="text-xs">S — Some treatment, residual risk</SelectItem>
                    <SelectItem value="N" className="text-xs">N — Significant deficiency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Rationale / impact on Form 550 (control risk)</label>
                <Input disabled={locked} value={cycle.conclusionRationale}
                  onChange={e => patchCycle(cycle.id, { conclusionRationale: e.target.value })}
                  placeholder="Briefly support the conclusion and link to Form 550."
                  className="h-8 text-xs" />
              </div>
            </div>
          </div>
        ))}

        {!locked && (
          <div>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={addCycle}>
              <Plus className="h-3.5 w-3.5" /> Add SCOTABD / business cycle
            </Button>
          </div>
        )}

        {/* Required-controls reminder (Note 1) */}
        <div className="bg-primary/[0.03] border border-primary/15 rounded-md p-4 text-xs text-foreground/85 space-y-1.5">
          <p className="font-semibold text-foreground">Required controls to identify and test (CAS 315 — Note 1):</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Controls that address a risk determined to be a significant risk.</li>
            <li>Controls over journal entries, including non-standard entries used to record non-recurring, unusual transactions or adjustments.</li>
            <li>Controls for which the auditor plans to test operating effectiveness in determining NTE of substantive testing, including controls that address risks for which substantive procedures alone do not provide sufficient appropriate audit evidence.</li>
            <li>Other controls the auditor considers appropriate based on professional judgment.</li>
          </ol>
        </div>

        {/* Overall conclusion */}
        <div className="bg-card border border-border rounded-md p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Overall audit conclusion</h3>
          <p className="text-xs text-muted-foreground">
            Based on the work above, conclude on the overall design and implementation of controls over the cycles assessed.
            Carry control risk assessments forward to Form 550 and communicate significant deficiencies on Form 575.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Overall conclusion</label>
              <Select disabled={locked} value={data.overallConclusion}
                onValueChange={v => setData(d => ({ ...d, overallConclusion: v as YSN }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y" className="text-xs">Y — Controls suitably designed &amp; implemented</SelectItem>
                  <SelectItem value="S" className="text-xs">S — Partial reliance / residual risk</SelectItem>
                  <SelectItem value="N" className="text-xs">N — Significant deficiencies identified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Supporting rationale</label>
              <Input disabled={locked} value={data.overallNotes}
                onChange={e => setData(d => ({ ...d, overallNotes: e.target.value }))}
                placeholder="Briefly support the overall conclusion."
                className="h-8 text-xs" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-md p-5 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Notes</h3>
          <Textarea disabled={locked} value={data.notes}
            onChange={e => setData(d => ({ ...d, notes: e.target.value }))}
            placeholder="Additional observations, follow-ups, or cross-references…"
            className="min-h-[90px] text-sm resize-none rounded-[10px]" />
        </div>

        {locked ? (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-800 font-medium">
            Concluded on {data.concludedOn}
          </div>
        ) : (
          <div className="flex justify-end">
            <Button size="sm" onClick={() => {
              const today = new Date().toISOString().slice(0, 10);
              const updated = { ...data, concluded: true, concludedOn: today };
              setData(updated);
              writeJsonToLocalStorage(storageKey, updated);
            }}>
              Conclude Worksheet
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
