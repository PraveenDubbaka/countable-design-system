import { useState, useEffect, useRef } from "react";
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
  entity: string;
  periodEnded: string;
  performanceMateriality: string;

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
  preparedBy: string;
  preparedDate: string;
  reviewedBy: string;
  reviewedDate: string;
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

function buildDefaultEstimates(): EstimateRow[] {
  return PRESET_ESTIMATES.map(name => ({
    id: uid(), name, isPreset: true, selected: false, fsArea: "", scotabd: "", complex: "",
  }));
}

function buildDefault(): Data513 {
  return {
    entity: "", periodEnded: "", performanceMateriality: "",
    partAPsc: "", partAWpRef: [], partAResponse: "",
    estimates: buildDefaultEstimates(),
    partBWpRef: [], partBPsc: "", partBDeficiencies: "",
    controlEnvironment: "", riskAssessmentProcess: "", specializedSkills: "",
    monitoringOutcomes: "", monitoringPolicies: "",
    evaluation: "",
    preparedBy: "", preparedDate: "", reviewedBy: "", reviewedDate: "",
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

export function Audit513Worksheet({ isUS = false }: { isUS?: boolean }) {
  const storageKey = `audit-513-data-${isUS ? "us" : "ca"}`;

  const [data, setData] = useState<Data513>(() => {
    const saved = readJsonFromLocalStorage<Data513 | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    // Merge saved estimates with defaults (preserve preset order, add custom at end)
    const presetIds = new Set(def.estimates.map(e => e.name));
    const savedCustom = (saved.estimates ?? []).filter(e => !e.isPreset);
    const mergedPresets = def.estimates.map(def_e => {
      const found = (saved.estimates ?? []).find(s => s.name === def_e.name && s.isPreset);
      return found ? { ...def_e, ...found } : def_e;
    });
    return { ...def, ...saved, estimates: [...mergedPresets, ...savedCustom] };
    void presetIds;
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const locked = data.concluded;

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
        <div className="p-6 space-y-6 max-w-6xl">

          {/* ── Header fields ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-md px-4 py-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Entity</p>
              <Input disabled={locked} value={data.entity} onChange={e => patch("entity", e.target.value)}
                placeholder="Entity name" className="h-8 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent font-medium" />
            </div>
            <div className="bg-card border border-border rounded-md px-4 py-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Period Ended</p>
              <Input disabled={locked} value={data.periodEnded} onChange={e => patch("periodEnded", e.target.value)}
                placeholder="YYYY-MM-DD" className="h-8 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent font-medium" />
            </div>
            <div className="bg-card border border-border rounded-md px-4 py-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Performance Materiality</p>
              <Input disabled={locked} value={data.performanceMateriality} onChange={e => patch("performanceMateriality", e.target.value)}
                placeholder="$" className="h-8 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent font-medium" />
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
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-[40%]">Procedure</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Response / Comments</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-28">PSC? (Y/N)</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-24">W/P Ref.</th>
                  </tr>
                </thead>
                <tbody>
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
                        className="min-h-[72px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
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
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-muted border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
                    <th className="px-4 py-2.5 text-center w-10">In scope</th>
                    <th className="px-4 py-2.5 text-left border-l border-border">Nature of Estimate</th>
                    <th className="px-4 py-2.5 text-left border-l border-border w-40">F/S Area</th>
                    <th className="px-4 py-2.5 text-center border-l border-border w-28">SCOTABD?</th>
                    <th className="px-4 py-2.5 text-center border-l border-border w-28">Complex?</th>
                    <th className="px-4 py-2.5 text-center border-l border-border w-28">Use form</th>
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
                      <td className="px-4 py-2.5 border-l border-border">
                        {est.isPreset ? (
                          <span className={cn("text-sm", est.selected ? "text-foreground font-medium" : "text-muted-foreground")}>{est.name}</span>
                        ) : (
                          <Input
                            disabled={locked}
                            value={est.name}
                            onChange={e => updateEstimate(est.id, { name: e.target.value })}
                            placeholder="Describe estimate…"
                            className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent font-medium"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2.5 border-l border-border w-40">
                        <Input
                          disabled={locked || !est.selected}
                          value={est.fsArea}
                          onChange={e => updateEstimate(est.id, { fsArea: e.target.value })}
                          placeholder={est.selected ? "F/S line item…" : "—"}
                          className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-4 py-2.5 border-l border-border w-28">
                        <Select
                          value={est.scotabd}
                          onValueChange={v => updateEstimate(est.id, { scotabd: v as "Y" | "N" })}
                          disabled={locked || !est.selected}
                        >
                          <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 border-l border-border w-28">
                        <Select
                          value={est.complex}
                          onValueChange={v => updateEstimate(est.id, { complex: v as "Y" | "N" })}
                          disabled={locked || !est.selected}
                        >
                          <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 border-l border-border w-28 text-center">
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
                <div className="px-4 py-2.5 border-t border-border">
                  <button onClick={addCustomEstimate} className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                    <Plus className="h-3 w-3" /> Add custom estimate
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
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-[40%]">Control Component</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Control Deficiencies Identified & Audit Implications</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-28">PSC? (Y/N)</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-24">W/P Ref.</th>
                  </tr>
                </thead>
                <tbody>
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
                        className="min-h-[72px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
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
          <SectionCard title="Sign-off">
            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Prepared by</p>
                  <Input disabled={locked} value={data.preparedBy} onChange={e => patch("preparedBy", e.target.value)}
                    placeholder="Name" className="h-8 text-sm bg-background" />
                  <Input disabled={locked} value={data.preparedDate} onChange={e => patch("preparedDate", e.target.value)}
                    placeholder="Date (YYYY-MM-DD)" className="h-8 text-sm bg-background" />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reviewed by</p>
                  <Input disabled={locked} value={data.reviewedBy} onChange={e => patch("reviewedBy", e.target.value)}
                    placeholder="Name" className="h-8 text-sm bg-background" />
                  <Input disabled={locked} value={data.reviewedDate} onChange={e => patch("reviewedDate", e.target.value)}
                    placeholder="Date (YYYY-MM-DD)" className="h-8 text-sm bg-background" />
                </div>
              </div>

              {data.concluded && (
                <div className="rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-800 dark:text-green-300">
                  Concluded on {data.concludedOn}
                </div>
              )}
              <div className="flex justify-end">
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
              </div>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}
