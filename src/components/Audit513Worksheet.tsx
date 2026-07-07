import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Info, AlertTriangle } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { cn } from "@/lib/utils";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { WorksheetSignOff } from "@/components/WorksheetSignOff";

// ── Types ──────────────────────────────────────────────────────────────────────

type YN = "Y" | "N" | "";

interface EstimateRow {
  id: string;
  name: string;
  isPreset: boolean;
  selected: boolean;
  fsArea: string;
  scotabd: YN;
  complex: YN;
}

interface Data513 {

  // Part A
  partAPsc: string;
  partAWpRef: RefDoc[];
  partAResponse: string;
  estimates: EstimateRow[];

  // Part B
  partBWpRef: RefDoc[];
  partBPsc: string;
  partBDeficiencies: string;
  controlEnvironment: string;
  riskAssessmentProcess: string;
  specializedSkills: string;
  monitoringOutcomes: string;
  monitoringPolicies: string;

  // Evaluation
  evaluation: string;

  // Sign-off
  concluded: boolean;
  concludedOn: string;
}

// ── Pre-populated estimates ────────────────────────────────────────────────────

const PRESET_ESTIMATES = [
  "Allowance for doubtful accounts",
  "Impairment in goodwill",
  "Inventory obsolescence",
  "Impairment of long-lived assets",
  "Useful lives / depreciation rate of PP&E",
  "Accruals (warranty)",
  "Related-party transactions",
  "Stock-based compensation",
  "Fair value measurements",
  "Pension plans and other post-retirement benefits",
  "Fair value disclosures",
  "Non-monetary transactions",
  "Redemption value of preferred shares",
  "Revenue recognition",
  "Other measurements / disclosures (e.g., business combinations)",
];

const uid = () => Math.random().toString(36).slice(2, 9);

/** Pre-seed estimates with realistic shipping-industry context (CA/US). */
function buildDefaultEstimates(isUS: boolean): EstimateRow[] {
  // Map preset name -> seed (selected, F/S area, SCOTABD, complex)
  const seed: Record<string, Partial<EstimateRow>> = {
    "Allowance for doubtful accounts": {
      selected: true, scotabd: "Y", complex: "N",
      fsArea: "Trade receivables — freight & demurrage",
    },
    "Inventory obsolescence": {
      selected: true, scotabd: "Y", complex: "N",
      fsArea: isUS ? "Bunker fuel & spare parts inventory" : "Bunker fuel & vessel spares inventory",
    },
    "Useful lives / depreciation rate of PP&E": {
      selected: true, scotabd: "Y", complex: "N",
      fsArea: isUS ? "Vessels, containers & terminal equipment" : "Vessels, containers & shore equipment",
    },
    "Impairment of long-lived assets": {
      selected: true, scotabd: "Y", complex: "Y",
      fsArea: isUS ? "Vessel CGU — long-lived asset group (ASC 360)" : "Vessel CGU (IAS 36 / ASPE 3063)",
    },
    "Revenue recognition": {
      selected: true, scotabd: "Y", complex: "Y",
      fsArea: isUS ? "Voyage revenue — performance obligation over time (ASC 606)" : "Voyage revenue — percentage-of-completion at period end",
    },
    "Fair value measurements": {
      selected: isUS, scotabd: isUS ? "Y" : "", complex: isUS ? "Y" : "",
      fsArea: isUS ? "Bunker fuel derivative hedges (ASC 815/820)" : "",
    },
    "Pension plans and other post-retirement benefits": {
      selected: !isUS, scotabd: !isUS ? "Y" : "", complex: !isUS ? "Y" : "",
      fsArea: !isUS ? "Defined-benefit pension obligation — seafarers' plan" : "",
    },
    "Accruals (warranty)": {
      selected: false, scotabd: "N", complex: "N",
    },
    "Impairment in goodwill": {
      selected: isUS, scotabd: isUS ? "Y" : "", complex: isUS ? "Y" : "",
      fsArea: isUS ? "Goodwill — CoastLine Drayage acquisition (2024)" : "",
    },
  };
  return PRESET_ESTIMATES.map(name => ({
    id: uid(), name, isPreset: true,
    selected: false, fsArea: "", scotabd: "", complex: "",
    ...seed[name],
  }));
}

function buildDefault(isUS = false): Data513 {
  const entity = isUS ? "Harbor Freight LLC" : "Shipping Line Inc.";
  const framework = isUS ? "US GAAP (ASC)" : "ASPE";
  return {
    partAPsc: "Y",
    partAWpRef: [],
    partAResponse:
      `Estimates were identified through (i) review of Form 510 understanding of ${entity}'s operations ` +
      `(vessel-asset intensive, voyages crossing the period-end, ${isUS ? "USD-denominated bunker hedges, ASC 606 over-time recognition" : "ASPE measurement bases and CRA tax positions"}), ` +
      `(ii) inquiries of the CFO and Controller about transactions, events and conditions giving rise to estimates ` +
      `(impairment indicators on older tonnage, voyage cut-off, ${isUS ? "fuel-hedge MTM, goodwill from the CoastLine Drayage acquisition" : "seafarer pension actuarial assumptions"}), ` +
      `and (iii) review of ${framework} disclosure requirements. All estimates expected in the F/S are tabled below.`,
    estimates: buildDefaultEstimates(isUS),
    partBWpRef: [],
    partBPsc: "Y",
    partBDeficiencies:
      `Management's process is largely informal — estimates are prepared by the Controller and reviewed by the CFO at month-end ` +
      `without a documented estimation policy. No periodic look-back of prior estimate outcomes is performed. ` +
      `Audit implication: increased reliance on substantive procedures over key estimates (impairment, voyage cut-off${isUS ? ", fuel-hedge fair value, goodwill" : ", pension actuarial assumptions"}); consider Form 530 control deficiency report.`,
    controlEnvironment:
      `${isUS ? "The Audit Committee (3 independent directors)" : "TCWG (owner-managed board, 2 external advisors)"} reviews estimates quarterly. ` +
      `Oversight is appropriate at the entity level but the CFO prepares and reviews most estimates — segregation of duties is limited.`,
    riskAssessmentProcess:
      `Risks relating to estimates are identified informally during the year-end close. No documented risk register for estimation uncertainty. ` +
      `Significant estimates (vessel impairment, voyage revenue cut-off) are revisited each period but without a structured risk-assessment template.`,
    specializedSkills:
      isUS
        ? "Management engaged an external valuation specialist (Duff & Phelps) for the 2024 goodwill impairment test on the CoastLine Drayage CGU, and uses the bunker broker's MTM reports for fuel-derivative valuation. We will evaluate competence and objectivity per AU-C 500."
        : "Management uses an external actuary (Mercer) for the seafarers' defined-benefit plan and a marine surveyor for residual-value estimates on the older container fleet. We will evaluate competence and objectivity per CAS 500.",
    monitoringOutcomes:
      `Look-back: the FY${isUS ? "23" : "23"} allowance for doubtful accounts was over-stated by ~12% versus actual write-offs; useful-life review on two vessels was deferred. ` +
      `Management has not formally documented these outcomes — recommend introducing an annual estimate look-back schedule.`,
    monitoringPolicies:
      `No written estimation policy. Monitoring is performed via month-end variance reviews by the CFO. ` +
      `Estimates are recomputed each period from underlying schedules (AR aging, vessel register, voyage logs${isUS ? ", hedge ledger" : ", actuarial report"}) rather than rolled forward without challenge.`,
    evaluation:
      `Overall, ${entity}'s process for preparing accounting estimates is appropriate to the size and complexity of the entity, ` +
      `but improvements are needed in (a) documented estimation policies, (b) formal look-back of prior outcomes, and (c) segregation between estimate preparation and review. ` +
      `Significant estimates (impairment of vessel CGU, voyage revenue cut-off${isUS ? ", fuel-derivative fair value, goodwill impairment" : ", seafarer pension obligation"}) ` +
      `will be addressed through targeted procedures on Forms 513-1 / 513-2. Control deficiencies will be communicated to TCWG via Form 575.`,
    concluded: false, concludedOn: "",
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
      <div className="px-6 py-3.5 bg-card border-b border-border">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function PartHeader({ letter, title, description }: { letter: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 pb-1">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-primary text-white text-xs font-bold shrink-0 mt-0.5">
        {letter}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ControlRow({ label, question, value, locked, onChange }: {
  label: string; question: string; value: string; locked: boolean; onChange: (v: string) => void;
}) {
  return (
    <div className="py-3.5 border-b border-border/60 last:border-0">
      <div className="flex items-start gap-3 mb-2">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-muted text-muted-foreground text-[10px] font-bold shrink-0 mt-0.5">
          {label}
        </span>
        <p className="text-sm text-foreground leading-relaxed">{question}</p>
      </div>
      <div className="pl-8">
        <Textarea
          disabled={locked}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter response…"
          className="min-h-[64px] text-sm resize-none bg-background"
        />
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function Audit513Worksheet({ isUS: isUSProp }: { isUS?: boolean } = {}) {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const isUS = isUSProp ?? ctx.isUS;
  const storageKey = `audit-513-data-v2-${engagementId ?? (isUS ? "us" : "ca")}`;

  const [data, setData] = useState<Data513>(() => {
    const saved = readJsonFromLocalStorage<Data513 | null>(storageKey, null);
    const def = buildDefault(isUS);
    if (!saved) return def;
    // Merge saved estimates with defaults (preserve preset order, add custom at end)
    const savedCustom = (saved.estimates ?? []).filter(e => !e.isPreset);
    const mergedPresets = def.estimates.map(def_e => {
      const found = (saved.estimates ?? []).find(s => s.name === def_e.name && s.isPreset);
      return found ? { ...def_e, ...found } : def_e;
    });
    return { ...def, ...saved, estimates: [...mergedPresets, ...savedCustom] };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const locked = data.concluded;

  const matKey = `audit-materiality-data-${isUS ? "us" : "ca"}`;
  // Fallback default mirrors AuditMaterialityWorksheet defaults:
  // profitBeforeTax × 5% (benchmark) × 70% (PM%) — used when Form PL1 hasn't been opened yet.
  const defaultPm = (() => {
    const pbt = isUS ? 1003000 : 460000;
    const pm = pbt * 0.05 * 0.70;
    return pm.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  })();
  const readPm = () =>
    readJsonFromLocalStorage<{ performanceMateriality?: string }>(matKey, null)?.performanceMateriality || defaultPm;
  const [pmFromMateriality, setPmFromMateriality] = useState<string | null>(readPm);
  useEffect(() => {
    const read = () => setPmFromMateriality(readPm());
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === matKey) read(); };
    const onFocus = () => read();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    const id = window.setInterval(read, 1500);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matKey]);


  function patch<K extends keyof Data513>(key: K, val: Data513[K]) {
    setData(d => ({ ...d, [key]: val }));
  }

  function updateEstimate(id: string, partial: Partial<EstimateRow>) {
    setData(d => ({
      ...d,
      estimates: d.estimates.map(e => e.id === id ? { ...e, ...partial } : e),
    }));
  }

  function addCustomEstimate() {
    setData(d => ({
      ...d,
      estimates: [...d.estimates, { id: uid(), name: "", isPreset: false, selected: true, fsArea: "", scotabd: "", complex: "" }],
    }));
  }

  function deleteCustomEstimate(id: string) {
    setData(d => ({ ...d, estimates: d.estimates.filter(e => e.id !== id) }));
  }

  const selectedEstimates = data.estimates.filter(e => e.selected);

  return (
    <div className="flex flex-col h-full">
      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Obtain an understanding of accounting estimates and related disclosures to provide an appropriate basis for the assessment of the risk of material misstatement at the financial statement and assertion levels.
        </p>
      </div>

      {/* Abbreviations */}
      <div className="px-6 py-2 border-b border-border bg-card shrink-0 flex items-center gap-3 flex-wrap">
        {[
          ["F/S", "Financial statements"],
          ["PSC", "Procedure successfully completed"],
          ["SCOTABD", "Significant classes of transactions, account balances or disclosures"],
          ["AFRF", "Applicable financial reporting framework"],
          ["TCWG", "Those charged with governance"],
        ].map(([abbr, meaning]) => (
          <span key={abbr} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">{abbr}</span> = {meaning}
          </span>
        ))}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-6">
          {/* ── Header — Performance Materiality (auto-populated) ──────────── */}
          <div className="bg-card border border-border rounded-md px-4 py-3 flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Performance Materiality</p>
              {pmFromMateriality ? (
                <p className="text-sm font-semibold text-foreground">${pmFromMateriality}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">— Complete Form PL1 (Materiality) to auto-populate</p>
              )}
            </div>
            
          </div>

          {/* ── PART A ─────────────────────────────────────────────────────── */}
          <PartHeader
            letter="A"
            title="Identify Accounting Estimates"
            description="Perform risk assessment procedures to identify accounting estimates and related disclosures expected to be in the F/S."
          />

          {/* Part A procedure row */}
          <SectionCard title="A. Risk Assessment Procedures">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-[40%]">Procedure</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Response / Comments</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-28">PSC? (Y/N)</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-24">W/P Ref.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30 transition-colors align-top">
                    <td className="px-5 py-3 text-sm text-foreground">
                      <span className="font-medium">Identify and describe accounting estimates and related disclosures expected to be in the F/S by:</span>
                      <ul className="mt-1.5 space-y-0.5 list-disc list-inside">
                        <li className="text-xs text-muted-foreground">Reviewing the results of understanding the entity and its environment (Form 510).</li>
                        <li className="text-xs text-muted-foreground">Inquiring about transactions, events and conditions that give rise to accounting estimates.</li>
                        <li className="text-xs text-muted-foreground">Considering requirements of the AFRF and regulatory factors.</li>
                        <li className="text-xs text-muted-foreground">Recording all estimates identified in the table below.</li>
                      </ul>
                    </td>
                    <td className="px-4 py-3">
                      <Textarea
                        disabled={locked}
                        value={data.partAResponse}
                        onChange={e => patch("partAResponse", e.target.value)}
                        placeholder="Document how estimates were identified…"
                        className="min-h-[72px] text-sm bg-background resize-none"
                      />
                    </td>
                    <td className="px-4 py-3 w-28">
                      <Select value={data.partAPsc} onValueChange={v => patch("partAPsc", v)} disabled={locked}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-center w-24">
                      <RefButton
                        reference={data.partAWpRef}
                        onAttach={doc => patch("partAWpRef", [...data.partAWpRef, doc])}
                        onRemove={i => patch("partAWpRef", data.partAWpRef.filter((_, idx) => idx !== i))}
                        disabled={locked}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Estimates table */}
          <SectionCard
            title="A. Estimates and Related Disclosures"
            subtitle="Select all applicable estimates. Complexity involves the use of complex models, unobservable inputs, or significant assumptions/judgments."
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="bg-muted border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
                    <th className="px-4 py-2.5 text-center w-10">In scope</th>
                    <th className="px-4 py-2.5 text-left">Nature of Estimate</th>
                    <th className="px-4 py-2.5 text-left w-40">F/S Area</th>
                    <th className="px-4 py-2.5 text-center w-28">SCOTABD?</th>
                    <th className="px-4 py-2.5 text-center w-28">Complex?</th>
                    <th className="px-4 py-2.5 text-center w-28">Use form</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.estimates.map(est => (
                    <tr
                      key={est.id}
                      className={cn(
                        "group transition-colors align-middle",
                        est.selected ? "bg-primary/[0.02] hover:bg-primary/[0.04]" : "hover:bg-muted/30 opacity-60",
                      )}
                    >
                      <td className="px-4 py-2.5 text-center">
                        <Checkbox
                          checked={est.selected}
                          onCheckedChange={v => updateEstimate(est.id, { selected: !!v })}
                          disabled={locked}
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        {est.isPreset ? (
                          <span className={cn("text-sm", est.selected ? "text-foreground font-medium" : "text-muted-foreground")}>{est.name}</span>
                        ) : (
                          <Input
                            disabled={locked}
                            value={est.name}
                            onChange={e => updateEstimate(est.id, { name: e.target.value })}
                            placeholder="Describe estimate…"
                            className="h-8 text-sm bg-background font-medium"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2.5 w-40">
                        <Input
                          disabled={locked || !est.selected}
                          value={est.fsArea}
                          onChange={e => updateEstimate(est.id, { fsArea: e.target.value })}
                          placeholder={est.selected ? "F/S line item…" : "—"}
                          className="h-8 text-sm bg-background"
                        />
                      </td>
                      <td className="px-4 py-2.5 w-28">
                        <Select
                          value={est.scotabd}
                          onValueChange={v => updateEstimate(est.id, { scotabd: v as "Y" | "N" })}
                          disabled={locked || !est.selected}
                        >
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 w-28">
                        <Select
                          value={est.complex}
                          onValueChange={v => updateEstimate(est.id, { complex: v as "Y" | "N" })}
                          disabled={locked || !est.selected}
                        >
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 w-28 text-center">
                        {est.selected && est.complex === "Y" && (
                          <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20">
                            Form 513-2
                          </Badge>
                        )}
                        {est.selected && est.complex === "N" && (
                          <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5">
                            Form 513-1
                          </Badge>
                        )}
                      </td>
                      <td className="px-2 py-2 text-center w-8">
                        {!est.isPreset && !locked && (
                          <button onClick={() => deleteCustomEstimate(est.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 transition-all">
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!locked && (
                <div className="px-6 py-3 border-t border-border">
                  <button onClick={addCustomEstimate} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <Plus className="h-4 w-4" /> Add custom estimate
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Selected summary */}
          {selectedEstimates.length > 0 && (
            <div className="rounded-md border border-border bg-card px-4 py-3 flex items-start gap-3">
              <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">
                  {selectedEstimates.length} estimate{selectedEstimates.length > 1 ? "s" : ""} in scope
                  {selectedEstimates.filter(e => e.complex === "Y").length > 0 && (
                    <span className="ml-2 text-amber-700 dark:text-amber-400">
                      · {selectedEstimates.filter(e => e.complex === "Y").length} complex (Form 513-2)
                    </span>
                  )}
                  {selectedEstimates.filter(e => e.complex === "N").length > 0 && (
                    <span className="ml-2 text-primary">
                      · {selectedEstimates.filter(e => e.complex === "N").length} less complex (Form 513-1)
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Use a separate Form 513-1 or 513-2 for each estimate. Document risk factors on Form 520.</p>
              </div>
            </div>
          )}

          {/* ── PART B ─────────────────────────────────────────────────────── */}
          <PartHeader
            letter="B"
            title="Estimate Preparation"
            description="Review risks and control deficiencies identified on Form 530 and determine their impact on the preparation of accounting estimates and related disclosures."
          />

          {/* Control deficiencies row */}
          <SectionCard title="B. Understand Management's Estimate Preparation Process">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-[40%]">Control Component</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Control Deficiencies Identified & Audit Implications</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-28">PSC? (Y/N)</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-24">W/P Ref.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30 transition-colors align-top">
                    <td className="px-5 py-3 text-sm text-foreground">
                      <p className="font-medium mb-1">Understand estimate preparation</p>
                      <p className="text-xs text-muted-foreground">Understand management's process for preparing estimates and making F/S disclosures. Consider responses to entity-level risks and controls on Form 530.</p>
                    </td>
                    <td className="px-4 py-3">
                      <Textarea
                        disabled={locked}
                        value={data.partBDeficiencies}
                        onChange={e => patch("partBDeficiencies", e.target.value)}
                        placeholder="Describe any control deficiencies and audit implications…"
                        className="min-h-[72px] text-sm bg-background resize-none"
                      />
                    </td>
                    <td className="px-4 py-3 w-28">
                      <Select value={data.partBPsc} onValueChange={v => patch("partBPsc", v)} disabled={locked}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Y">Y</SelectItem>
                          <SelectItem value="N">N</SelectItem>
                          <SelectItem value="N/A">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-center w-24">
                      <RefButton
                        reference={data.partBWpRef}
                        onAttach={doc => patch("partBWpRef", [...data.partBWpRef, doc])}
                        onRemove={i => patch("partBWpRef", data.partBWpRef.filter((_, idx) => idx !== i))}
                        disabled={locked}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Control components detail */}
          <SectionCard title="B. Control Components — Estimate Preparation" subtitle="Address each control component below and document your findings.">
            <div className="px-6 py-2">
              <ControlRow
                label="CE"
                question="Control environment — Is the nature and extent of oversight and governance over management's financial reporting process appropriate for the preparation of accounting estimates?"
                value={data.controlEnvironment}
                locked={locked}
                onChange={v => patch("controlEnvironment", v)}
              />
              <ControlRow
                label="RA"
                question="Risk assessment — Does the entity's risk assessment process identify and address risks relating to estimates?"
                value={data.riskAssessmentProcess}
                locked={locked}
                onChange={v => patch("riskAssessmentProcess", v)}
              />
              <ControlRow
                label="RA"
                question="Risk assessment — Does management identify the need for, or apply, specialized skills or knowledge, including the use of a management's expert?"
                value={data.specializedSkills}
                locked={locked}
                onChange={v => patch("specializedSkills", v)}
              />
              <ControlRow
                label="MO"
                question="Monitoring — Does management review the outcome(s) of previous accounting estimates and respond to the findings?"
                value={data.monitoringOutcomes}
                locked={locked}
                onChange={v => patch("monitoringOutcomes", v)}
              />
              <ControlRow
                label="MO"
                question="Monitoring — How does management ensure that accounting estimates are being prepared in accordance with stated policies?"
                value={data.monitoringPolicies}
                locked={locked}
                onChange={v => patch("monitoringPolicies", v)}
              />
            </div>
          </SectionCard>

          {/* ── EVALUATION ─────────────────────────────────────────────────── */}
          <SectionCard title="Evaluation">
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-foreground font-medium">
                Based on the understanding obtained, evaluate and explain whether the entity's process for preparing estimates and related disclosures in the F/S is appropriate in the circumstances, considering the nature and complexity of the entity.
              </p>
              <Textarea
                disabled={locked}
                value={data.evaluation}
                onChange={e => patch("evaluation", e.target.value)}
                placeholder="Document your evaluation of the entity's estimate preparation process…"
                className="min-h-[100px] text-sm resize-none bg-background"
              />
              <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  Communicate significant control deficiencies in writing to TCWG on a timely basis — consider using <span className="font-semibold">Form 575</span>.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* ── SIGN-OFF ───────────────────────────────────────────────────── */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Sign-off</span>
            </div>
            <WorksheetSignOff worksheetKey="audit-513" engagementId={engagementId} />
            <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3 bg-muted/20">
              {data.concluded ? (
                <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-xs text-green-800 font-medium">
                  Concluded on {data.concludedOn}
                </div>
              ) : (
                <Button
                  disabled={locked}
                  onClick={() => {
                    const now = new Date().toISOString().slice(0, 10);
                    setData(d => {
                      const next = { ...d, concluded: true, concludedOn: now };
                      writeJsonToLocalStorage(storageKey, next);
                      return next;
                    });
                  }}
                >
                  Conclude worksheet
                </Button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
