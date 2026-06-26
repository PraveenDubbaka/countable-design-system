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
type IR = "H" | "M" | "L" | "";
type Assertion = "C" | "E" | "AV" | "P";
type AutoManual = "Manual" | "Automated" | "IT-dependent manual" | "";
type PrevDet = "Preventive" | "Detective" | "";

interface ControlRow {
  id: string;
  description: string;
  inherentRisk: IR;
  assertions: Assertion[];
  automated: AutoManual;
  controlType: string;       // e.g. Reconciliation, Authorization, Review, Segregation, IT-dependent
  frequency: string;
  prevDet: PrevDet;
  otherCharacteristics: string;
  designEffective: YSN;      // Y / S / N
  implemented: YN;           // Y / N / NA  (Note 3 — at least one procedure beyond inquiry)
  supportingDocs: RefDoc[];  // W/P ref for walkthrough / inspection
  gitcSupports: YN;          // GITC supports the automated control (Note 1)
  oeTestPlanned: YN;         // Operating effectiveness testing planned?
  controlRisk: IR;           // H / M / L
  testRef: RefDoc[];         // Reference to where controls will be tested
}

interface RiskBlock {
  id: string;
  description: string;       // Description of risk of material misstatement
  controls: ControlRow[];
}

type CategoryKey = "journalEntries" | "significantRisks" | "operatingEffectiveness" | "other";

interface CategoryBlock {
  key: CategoryKey;
  title: string;
  hint: string;
  risks: RiskBlock[];
}

interface Data550 {
  categories: CategoryBlock[];
  overallConclusion: YSN;
  overallRationale: string;
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
  "Authorization / Approval",
  "Reconciliation",
  "Review of performance",
  "Segregation of duties",
  "Physical / logical access",
  "IT-dependent manual",
  "Automated application control",
  "IT general control (ITGC)",
];

const FREQUENCIES = ["Per transaction", "Daily", "Weekly", "Monthly", "Quarterly", "Annually", "Ad hoc"];

const CATEGORY_DEFS: { key: CategoryKey; title: string; hint: string }[] = [
  {
    key: "journalEntries",
    title: "Controls over journal entries",
    hint: "Required by CAS 315. Includes non-standard, non-recurring entries and adjustments.",
  },
  {
    key: "significantRisks",
    title: "Controls that address significant risks",
    hint: "For each risk assessed as significant on Form 520 (e.g., fraud, management override, revenue).",
  },
  {
    key: "operatingEffectiveness",
    title: "Controls for which the auditor plans to test operating effectiveness",
    hint: "Including controls addressing risks for which substantive procedures alone are insufficient.",
  },
  {
    key: "other",
    title: "Other controls that the auditor considers appropriate",
    hint: "Controls processed by service organizations, reconciliations to GL, or those addressing higher inherent risks.",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function uid(): string { return Math.random().toString(36).slice(2, 9); }

function emptyControl(): ControlRow {
  return {
    id: uid(), description: "", inherentRisk: "", assertions: [],
    automated: "", controlType: "", frequency: "", prevDet: "", otherCharacteristics: "",
    designEffective: "", implemented: "",
    supportingDocs: [], gitcSupports: "", oeTestPlanned: "", controlRisk: "", testRef: [],
  };
}
function emptyRisk(): RiskBlock {
  return { id: uid(), description: "", controls: [emptyControl()] };
}
function buildDefault(): Data550 {
  return {
    categories: CATEGORY_DEFS.map(c => ({ ...c, risks: [emptyRisk()] })),
    overallConclusion: "",
    overallRationale: "",
    notes: "",
    concluded: false, concludedOn: "",
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Audit550Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-550-data-${engagementId ?? "default"}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const [data, setData] = useState<Data550>(() => {
    const saved = readJsonFromLocalStorage<Data550 | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    // Reconcile categories by key so we always show the four required buckets
    const categories = def.categories.map(d => {
      const found = saved.categories?.find(c => c.key === d.key);
      return found ? { ...d, risks: found.risks?.length ? found.risks : [emptyRisk()] } : d;
    });
    return { ...def, ...saved, categories };
  });

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  // ── Mutators ────────────────────────────────────────────────────────────────
  function patchCategory(key: CategoryKey, mut: (c: CategoryBlock) => CategoryBlock) {
    setData(d => ({ ...d, categories: d.categories.map(c => c.key === key ? mut(c) : c) }));
  }
  function addRisk(key: CategoryKey) {
    patchCategory(key, c => ({ ...c, risks: [...c.risks, emptyRisk()] }));
  }
  function removeRisk(key: CategoryKey, rid: string) {
    patchCategory(key, c => ({ ...c, risks: c.risks.length > 1 ? c.risks.filter(r => r.id !== rid) : c.risks }));
  }
  function setRisk(key: CategoryKey, rid: string, patch: Partial<RiskBlock>) {
    patchCategory(key, c => ({ ...c, risks: c.risks.map(r => r.id === rid ? { ...r, ...patch } : r) }));
  }
  function addControl(key: CategoryKey, rid: string) {
    patchCategory(key, c => ({
      ...c,
      risks: c.risks.map(r => r.id === rid ? { ...r, controls: [...r.controls, emptyControl()] } : r),
    }));
  }
  function removeControl(key: CategoryKey, rid: string, ctlId: string) {
    patchCategory(key, c => ({
      ...c,
      risks: c.risks.map(r => r.id !== rid ? r : {
        ...r,
        controls: r.controls.length > 1 ? r.controls.filter(ct => ct.id !== ctlId) : r.controls,
      }),
    }));
  }
  function setControl(key: CategoryKey, rid: string, ctlId: string, patch: Partial<ControlRow>) {
    patchCategory(key, c => ({
      ...c,
      risks: c.risks.map(r => r.id !== rid ? r : {
        ...r, controls: r.controls.map(ct => ct.id === ctlId ? { ...ct, ...patch } : ct),
      }),
    }));
  }
  function toggleAssertion(key: CategoryKey, rid: string, ctlId: string, a: Assertion) {
    patchCategory(key, c => ({
      ...c,
      risks: c.risks.map(r => r.id !== rid ? r : {
        ...r,
        controls: r.controls.map(ct => ct.id !== ctlId ? ct : {
          ...ct,
          assertions: ct.assertions.includes(a) ? ct.assertions.filter(x => x !== a) : [...ct.assertions, a],
        }),
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
          To identify controls that address risks of material misstatement at the assertion level, evaluate whether
          those controls have been designed effectively and implemented, and assess control risk where operating
          effectiveness is to be tested (CAS 315).
          <span className="block mt-1.5 text-[11px]">
            <span className="font-semibold text-foreground">Legend: </span>
            Assertions: <b>C</b> = Completeness, <b>E</b> = Existence/Occurrence, <b>AV</b> = Accuracy/Valuation, <b>P</b> = Presentation. &nbsp;
            Design: <b>Y</b> = Mitigated, <b>S</b> = Some treatment, <b>N</b> = Significant deficiency. &nbsp;
            Control risk: <b>H</b>/<b>M</b>/<b>L</b>. &nbsp; GITC = General IT controls.
          </span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Categories */}
        {data.categories.map((cat) => (
          <div key={cat.key} className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{cat.title}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{cat.hint}</p>
              </div>
              {!locked && (
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1 shrink-0" onClick={() => addRisk(cat.key)}>
                  <Plus className="h-3.5 w-3.5" /> Add risk
                </Button>
              )}
            </div>

            <div className="divide-y divide-border">
              {cat.risks.map((risk, rIdx) => (
                <div key={risk.id} className="p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-muted-foreground mt-2 shrink-0 w-6">{rIdx + 1}.</span>
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Description of risk
                      </label>
                      <Textarea disabled={locked} value={risk.description}
                        onChange={e => setRisk(cat.key, risk.id, { description: e.target.value })}
                        placeholder="Describe the risk of material misstatement (link to Form 520 / 535 where applicable)…"
                        className="min-h-[56px] text-xs resize-none rounded-[10px]" />
                    </div>
                    {!locked && cat.risks.length > 1 && (
                      <button onClick={() => removeRisk(cat.key, risk.id)}
                        className="text-muted-foreground hover:text-destructive mt-2"
                        title="Remove risk">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Controls table */}
                  <div className="overflow-x-auto rounded-md border border-border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border">
                          <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider w-10">#</th>
                          <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider" style={{ minWidth: 240 }}>Control</th>
                          <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 90 }}>Inherent risk</th>
                          <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 170 }}>Assertions</th>
                          <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider" style={{ width: 150 }}>Auto / Manual<sup>(1)</sup></th>
                          <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider" style={{ width: 180 }}>Characteristics<sup>(2)</sup></th>
                          <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 110 }}>Design (Y/S/N)</th>
                          <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 110 }}>Implemented<sup>(3)</sup></th>
                          <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 90 }}>W/P ref.</th>
                          <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 90 }}>GITC supports</th>
                          <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 100 }}>OE test planned</th>
                          <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 90 }}>Control risk</th>
                          <th className="px-3 py-2 text-center font-semibold uppercase tracking-wider" style={{ width: 90 }}>Tested at</th>
                          {!locked && <th className="w-10"></th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {risk.controls.map((ct, i) => (
                          <tr key={ct.id} className="hover:bg-muted/30 align-top">
                            <td className="px-3 py-2 text-center font-mono">{i + 1}</td>
                            <td className="px-3 py-2">
                              <Textarea disabled={locked} value={ct.description}
                                onChange={e => setControl(cat.key, risk.id, ct.id, { description: e.target.value })}
                                placeholder="Describe the control activity, owner, and how it operates…"
                                className="min-h-[64px] text-xs resize-none rounded-[10px]" />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <Select disabled={locked} value={ct.inherentRisk}
                                onValueChange={v => setControl(cat.key, risk.id, ct.id, { inherentRisk: v as IR })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="H" className="text-xs">H</SelectItem>
                                  <SelectItem value="M" className="text-xs">M</SelectItem>
                                  <SelectItem value="L" className="text-xs">L</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex flex-wrap gap-1 justify-center">
                                {(Object.keys(ASSERTION_LABELS) as Assertion[]).map(a => {
                                  const active = ct.assertions.includes(a);
                                  return (
                                    <button key={a} type="button" disabled={locked}
                                      onClick={() => toggleAssertion(cat.key, risk.id, ct.id, a)}
                                      title={ASSERTION_LABELS[a]}
                                      className={`h-7 min-w-[34px] px-2 rounded-md border text-[11px] font-semibold transition-colors ${
                                        active ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-input hover:bg-muted"
                                      } ${locked ? "opacity-60 cursor-not-allowed" : ""}`}>
                                      {a}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <Select disabled={locked} value={ct.automated}
                                onValueChange={v => setControl(cat.key, risk.id, ct.id, { automated: v as AutoManual })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Manual" className="text-xs">Manual</SelectItem>
                                  <SelectItem value="Automated" className="text-xs">Automated</SelectItem>
                                  <SelectItem value="IT-dependent manual" className="text-xs">IT-dependent manual</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-3 py-2 space-y-1.5">
                              <Select disabled={locked} value={ct.controlType}
                                onValueChange={v => setControl(cat.key, risk.id, ct.id, { controlType: v })}>
                                <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Type…" /></SelectTrigger>
                                <SelectContent>
                                  {CONTROL_TYPES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Select disabled={locked} value={ct.frequency}
                                onValueChange={v => setControl(cat.key, risk.id, ct.id, { frequency: v })}>
                                <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Frequency…" /></SelectTrigger>
                                <SelectContent>
                                  {FREQUENCIES.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              <Select disabled={locked} value={ct.prevDet}
                                onValueChange={v => setControl(cat.key, risk.id, ct.id, { prevDet: v as PrevDet })}>
                                <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Prev / Det…" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Preventive" className="text-xs">Preventive</SelectItem>
                                  <SelectItem value="Detective" className="text-xs">Detective</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <Select disabled={locked} value={ct.designEffective}
                                onValueChange={v => setControl(cat.key, risk.id, ct.id, { designEffective: v as YSN })}>
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
                                onValueChange={v => setControl(cat.key, risk.id, ct.id, { implemented: v as YN })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Y" className="text-xs">Yes</SelectItem>
                                  <SelectItem value="N" className="text-xs">No</SelectItem>
                                  <SelectItem value="NA" className="text-xs">N/A</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <RefButton
                                reference={ct.supportingDocs}
                                onAttach={doc => setControl(cat.key, risk.id, ct.id, { supportingDocs: [...ct.supportingDocs, doc] })}
                                onRemove={idx => setControl(cat.key, risk.id, ct.id, { supportingDocs: ct.supportingDocs.filter((_, i2) => i2 !== idx) })}
                              />
                            </td>
                            <td className="px-3 py-2 text-center">
                              <Select disabled={locked} value={ct.gitcSupports}
                                onValueChange={v => setControl(cat.key, risk.id, ct.id, { gitcSupports: v as YN })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Y" className="text-xs">Yes</SelectItem>
                                  <SelectItem value="N" className="text-xs">No</SelectItem>
                                  <SelectItem value="NA" className="text-xs">N/A</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <Select disabled={locked} value={ct.oeTestPlanned}
                                onValueChange={v => setControl(cat.key, risk.id, ct.id, { oeTestPlanned: v as YN })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Y" className="text-xs">Yes</SelectItem>
                                  <SelectItem value="N" className="text-xs">No</SelectItem>
                                  <SelectItem value="NA" className="text-xs">N/A</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <Select disabled={locked} value={ct.controlRisk}
                                onValueChange={v => setControl(cat.key, risk.id, ct.id, { controlRisk: v as IR })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="H" className="text-xs">H</SelectItem>
                                  <SelectItem value="M" className="text-xs">M</SelectItem>
                                  <SelectItem value="L" className="text-xs">L</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <RefButton
                                reference={ct.testRef}
                                onAttach={doc => setControl(cat.key, risk.id, ct.id, { testRef: [...ct.testRef, doc] })}
                                onRemove={idx => setControl(cat.key, risk.id, ct.id, { testRef: ct.testRef.filter((_, i2) => i2 !== idx) })}
                              />
                            </td>
                            {!locked && (
                              <td className="px-2 py-2 text-center">
                                <button onClick={() => removeControl(cat.key, risk.id, ct.id)} className="text-muted-foreground hover:text-destructive">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {!locked && (
                    <div>
                      <Button size="sm" variant="ghost" className="h-7 text-xs gap-1"
                        onClick={() => addControl(cat.key, risk.id)}>
                        <Plus className="h-3.5 w-3.5" /> Add control
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Notes (1-3) reminder */}
        <div className="bg-primary/[0.03] border border-primary/15 rounded-md p-4 text-xs text-foreground/85 space-y-1.5">
          <p className="font-semibold text-foreground">Form 550 — Notes:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li><b>Note 1:</b> If a control is automated, identify risks arising from the use of IT and the GITCs that support its operation (Form 551).</li>
            <li><b>Note 2:</b> Documentation of control characteristics (type, frequency, prev/det) is optional for design but useful when planning to test operating effectiveness.</li>
            <li><b>Note 3:</b> Implementation cannot be determined by inquiry alone — combine with at least one other procedure (observation, inspection, walkthrough, reperformance).</li>
          </ol>
        </div>

        {/* Overall conclusion */}
        <div className="bg-card border border-border rounded-md p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Overall conclusion</h3>
          <p className="text-xs text-muted-foreground">
            Based on the work done, conclude on whether control design and implementation — and control risk where applicable —
            have been appropriately assessed. Carry forward to Form 575 (significant deficiencies) and the response plan.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Overall conclusion</label>
              <Select disabled={locked} value={data.overallConclusion}
                onValueChange={v => setData(d => ({ ...d, overallConclusion: v as YSN }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y" className="text-xs">Y — Suitably designed &amp; implemented</SelectItem>
                  <SelectItem value="S" className="text-xs">S — Partial reliance / residual risk</SelectItem>
                  <SelectItem value="N" className="text-xs">N — Significant deficiencies identified</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Supporting rationale</label>
              <Input disabled={locked} value={data.overallRationale}
                onChange={e => setData(d => ({ ...d, overallRationale: e.target.value }))}
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
            placeholder="Additional observations, follow-ups, communication to TCWG, or cross-references…"
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
