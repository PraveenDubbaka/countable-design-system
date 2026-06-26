import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Info } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type YN = "Y" | "N" | "";
type HML = "H" | "M" | "L" | "";

interface PartARow {
  id: string;
  wpRefSource: RefDoc[];
  rmmIdentified: string;
  fraudRisk: YN;
  rmmAssessment: HML;
  auditResponse: string;
  wpRef: RefDoc[];
}

interface PartBRow {
  id: string;
  wpRefSource: RefDoc[];
  rmmIdentified: string;
  scotabd: string;
  assertions: string;
  irFactors: string;
  fraudRisk: YN;
  irLikelihood: HML;
  irMagnitude: HML;
  inherentRisk: HML;
  significantRisk: YN;
  substantiveSufficient: YN;
}

interface Data520 {
  partARows: PartARow[];
  partBRows: PartBRow[];
  conclusion: string;
  concluded: boolean;
  concludedOn: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);
const HML_OPTIONS: HML[] = ["H", "M", "L"];
const YN_OPTIONS: YN[] = ["Y", "N"];

function newPartARow(): PartARow {
  return { id: uid(), wpRefSource: [], rmmIdentified: "", fraudRisk: "", rmmAssessment: "", auditResponse: "", wpRef: [] };
}

function newPartBRow(): PartBRow {
  return { id: uid(), wpRefSource: [], rmmIdentified: "", scotabd: "", assertions: "", irFactors: "", fraudRisk: "", irLikelihood: "", irMagnitude: "", inherentRisk: "", significantRisk: "", substantiveSufficient: "" };
}

function buildDefault(): Data520 {
  return {
    partARows: [
      {
        id: uid(),
        wpRefSource: [],
        rmmIdentified: "Management override of controls",
        fraudRisk: "Y",
        rmmAssessment: "H",
        auditResponse: "1. Test appropriateness of journal entries recorded in the general ledger and other adjustments (Form 670).\n2. Review accounting estimates for biases and evaluate whether any bias represents an RMM due to fraud (Form 513).\n3. Evaluate whether significant transactions outside the normal course of business suggest fraudulent financial reporting or concealment of misappropriation.",
        wpRef: [{ name: "670" }],
      },
    ],
    partBRows: [
      {
        id: uid(),
        wpRefSource: [{ name: "510-5" }],
        rmmIdentified: "Inventory value could be overstated due to inadequate obsolescence provision",
        scotabd: "Inventory",
        assertions: "AV",
        irFactors: "Inventory provision for obsolescence is subject to moderate estimate uncertainty and complexity. Management judgment is required in assessing slow-moving and obsolete stock. No automated controls over provision calculation.",
        fraudRisk: "N",
        irLikelihood: "M",
        irMagnitude: "M",
        inherentRisk: "M",
        significantRisk: "N",
        substantiveSufficient: "Y",
      },
      {
        id: uid(),
        wpRefSource: [{ name: "510-3" }],
        rmmIdentified: "Revenue recognition may be misstated due to incorrect cut-off of vessel charter agreements at year-end",
        scotabd: "Revenue",
        assertions: "C, AV",
        irFactors: "Charter revenue is recognised over the contract period; cut-off risk exists at year-end for contracts spanning the period boundary. Low complexity but requires consistent application of revenue recognition policy.",
        fraudRisk: "N",
        irLikelihood: "M",
        irMagnitude: "M",
        inherentRisk: "M",
        significantRisk: "N",
        substantiveSufficient: "Y",
      },
      {
        id: uid(),
        wpRefSource: [{ name: "515-5" }],
        rmmIdentified: "Related-party transactions may be incomplete or not disclosed on arm's length terms",
        scotabd: "Related party disclosures",
        assertions: "C, AV",
        irFactors: "Owner-managed entity — risk of undisclosed related-party transactions or non-arm's-length pricing. Moderate subjectivity in management's determination of market rates. Significant management involvement increases susceptibility to management bias.",
        fraudRisk: "Y",
        irLikelihood: "M",
        irMagnitude: "H",
        inherentRisk: "H",
        significantRisk: "Y",
        substantiveSufficient: "N",
      },
    ],
    conclusion: "",
    concluded: false,
    concludedOn: "",
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
      <div className="px-6 py-3.5 bg-card border-b border-border">
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      {children}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function Audit520Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-520-data-${engagementId ?? "default"}`;

  const [data, setData] = useState<Data520>(() => {
    const saved = readJsonFromLocalStorage<Data520 | null>(storageKey, null);
    if (!saved) return buildDefault();
    const toRefDocs = (v: unknown): RefDoc[] => {
      if (Array.isArray(v)) return v as RefDoc[];
      if (typeof v === "string" && v) return [{ name: v }];
      return [];
    };
    const migrated: Data520 = {
      ...saved,
      partARows: saved.partARows.map(r => ({
        ...r,
        wpRefSource: toRefDocs(r.wpRefSource),
        wpRef: toRefDocs(r.wpRef),
      })),
      partBRows: saved.partBRows.map(r => ({
        ...r,
        wpRefSource: toRefDocs(r.wpRefSource),
      })),
    };
    return { ...buildDefault(), ...migrated };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const locked = data.concluded;

  function updatePartA(id: string, field: keyof PartARow, val: string) {
    setData(d => ({ ...d, partARows: d.partARows.map(r => r.id === id ? { ...r, [field]: val } : r) }));
  }
  function setPartAWpRefSource(id: string, wpRefSource: RefDoc[]) {
    setData(d => ({ ...d, partARows: d.partARows.map(r => r.id === id ? { ...r, wpRefSource } : r) }));
  }
  function setPartAWpRef(id: string, wpRef: RefDoc[]) {
    setData(d => ({ ...d, partARows: d.partARows.map(r => r.id === id ? { ...r, wpRef } : r) }));
  }
  function updatePartB(id: string, field: keyof PartBRow, val: string) {
    setData(d => ({ ...d, partBRows: d.partBRows.map(r => r.id === id ? { ...r, [field]: val } : r) }));
  }
  function setPartBWpRefSource(id: string, wpRefSource: RefDoc[]) {
    setData(d => ({ ...d, partBRows: d.partBRows.map(r => r.id === id ? { ...r, wpRefSource } : r) }));
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Objective bar ─────────────────────────────────────────────── */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground leading-relaxed">
          <span className="font-semibold text-primary">Objective: </span>
          To document and assess identified risks of material misstatement at the financial statement level and assess inherent risk(s) at the assertion level, including significant risks, to be used as a basis for designing and implementing the appropriate audit response.
        </p>
      </div>

      {/* ── Legend bar ────────────────────────────────────────────────── */}
      <div className="px-6 py-1.5 border-b border-border bg-muted/20 shrink-0">
        <p className="text-[10.5px] text-muted-foreground">
          <span className="font-medium">F/S</span> = Financial statements &nbsp;·&nbsp;
          <span className="font-medium">RMM</span> = Risk of material misstatement &nbsp;·&nbsp;
          <span className="font-medium">SCOTABD</span> = Significant class of transactions, account balance, or disclosure &nbsp;·&nbsp;
          <span className="font-medium">IR</span> = Inherent risk &nbsp;·&nbsp;
          <span className="font-medium">H</span> = High &nbsp;·&nbsp;
          <span className="font-medium">M</span> = Medium &nbsp;·&nbsp;
          <span className="font-medium">L</span> = Low
        </p>
      </div>

      {/* ── Scrollable body ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-6 max-w-[1400px]">

          {/* ── Part A ────────────────────────────────────────────────── */}
          <SectionCard title="Part A — Identify and Assess RMMs at the Financial Statement Level">
            <div className="px-6 py-2 border-b border-border bg-muted/20">
              <p className="text-xs text-muted-foreground">Document the risks identified that relate to the financial statements as a whole. Complete Part A before Part B, as FSL risks can impact assertion-level risks.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-24">Risk Source<br /><span className="font-normal normal-case text-muted-foreground">(W/P Ref.)</span></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">RMM Identified</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-20">Fraud Risk<br /><span className="font-normal normal-case text-muted-foreground">(Y/N)</span></th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-24">Assess RMM<br /><span className="font-normal normal-case text-muted-foreground">(H/M/L)</span></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Overall Audit Response<br /><span className="font-normal normal-case text-muted-foreground">Consider using Form 605</span></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-20">W/P Ref.</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.partARows.map(row => (
                    <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-2.5 align-top w-24">
                        <Input disabled={locked} value={row.wpRefSource} onChange={e => updatePartA(row.id, "wpRefSource", e.target.value)} placeholder="—" className="h-8 text-sm" />
                      </td>
                      <td className="px-4 py-2.5 align-top min-w-[240px]">
                        <Textarea disabled={locked} value={row.rmmIdentified} onChange={e => updatePartA(row.id, "rmmIdentified", e.target.value)} placeholder="Describe the risk of material misstatement…" className="min-h-[72px] text-sm resize-none bg-background" />
                      </td>
                      <td className="px-4 py-2.5 align-top w-20">
                        <Select disabled={locked} value={row.fraudRisk} onValueChange={v => updatePartA(row.id, "fraudRisk", v as YN)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 align-top w-24">
                        <Select disabled={locked} value={row.rmmAssessment} onValueChange={v => updatePartA(row.id, "rmmAssessment", v as HML)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>{HML_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 align-top min-w-[260px]">
                        <Textarea disabled={locked} value={row.auditResponse} onChange={e => updatePartA(row.id, "auditResponse", e.target.value)} placeholder="Document overall audit response…" className="min-h-[72px] text-sm resize-none bg-background" />
                      </td>
                      <td className="px-4 py-2.5 align-top w-28">
                        <RefButton
                          reference={row.wpRef}
                          onAttach={doc => setPartAWpRef(row.id, [...row.wpRef, doc])}
                          onRemove={i => setPartAWpRef(row.id, row.wpRef.filter((_, idx) => idx !== i))}
                          disabled={locked}
                        />
                      </td>
                      {!locked && (
                        <td className="px-2 py-2.5 align-middle text-center">
                          <button onClick={() => setData(d => ({ ...d, partARows: d.partARows.filter(r => r.id !== row.id) }))} className="text-muted-foreground hover:text-destructive transition-colors">
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
              <div className="border-t border-border px-4 py-3">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setData(d => ({ ...d, partARows: [...d.partARows, newPartARow()] }))}>
                  <Plus className="h-3 w-3" /> Add Risk
                </Button>
              </div>
            )}
          </SectionCard>

          {/* ── Part B ────────────────────────────────────────────────── */}
          <SectionCard title="Part B — Identify RMMs and Assess Inherent Risk at the Assertion Level">
            <div className="px-6 py-2 border-b border-border bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Document risks at the assertion level and assess inherent risk (IR), including significant risks.&nbsp;
                <span className="font-medium text-foreground">Assertions:</span> C = Completeness · AV = Accuracy &amp; Valuation · E = Existence · P = Presentation
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-20">Risk Source<br /><span className="font-normal normal-case text-muted-foreground">(W/P Ref.)</span></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider min-w-[180px]">RMM Identified</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider min-w-[120px]">SCOTABD<br /><span className="font-normal normal-case text-muted-foreground">Impacted</span></th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-20">F/S<br />Assertions</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider min-w-[200px]">IR Factors &amp; Susceptibility</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-16">Fraud<br />Risk</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-16">IR<br />Likelihood</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-16">IR<br />Magnitude</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-16">Assess<br />IR</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-20">Significant<br />Risk</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-24">Substantive<br />Sufficient</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.partBRows.map(row => (
                    <tr key={row.id} className={cn("transition-colors", row.significantRisk === "Y" ? "bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50/60" : "hover:bg-muted/50")}>
                      <td className="px-4 py-2.5 align-top w-20">
                        <Input disabled={locked} value={row.wpRefSource} onChange={e => updatePartB(row.id, "wpRefSource", e.target.value)} placeholder="—" className="h-8 text-sm" />
                      </td>
                      <td className="px-4 py-2.5 align-top min-w-[180px]">
                        <Textarea disabled={locked} value={row.rmmIdentified} onChange={e => updatePartB(row.id, "rmmIdentified", e.target.value)} placeholder="Describe the RMM…" className="min-h-[72px] text-sm resize-none bg-background" />
                      </td>
                      <td className="px-4 py-2.5 align-top min-w-[120px]">
                        <Input disabled={locked} value={row.scotabd} onChange={e => updatePartB(row.id, "scotabd", e.target.value)} placeholder="e.g. Revenue" className="h-8 text-sm" />
                      </td>
                      <td className="px-4 py-2.5 align-top text-center w-20">
                        <Input disabled={locked} value={row.assertions} onChange={e => updatePartB(row.id, "assertions", e.target.value)} placeholder="AV…" className="h-8 text-sm text-center" />
                      </td>
                      <td className="px-4 py-2.5 align-top min-w-[200px]">
                        <Textarea disabled={locked} value={row.irFactors} onChange={e => updatePartB(row.id, "irFactors", e.target.value)} placeholder="Document how IR factors affect susceptibility to misstatement…" className="min-h-[72px] text-sm resize-none bg-background" />
                      </td>
                      <td className="px-4 py-2.5 align-top w-16">
                        <Select disabled={locked} value={row.fraudRisk} onValueChange={v => updatePartB(row.id, "fraudRisk", v as YN)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 align-top w-16">
                        <Select disabled={locked} value={row.irLikelihood} onValueChange={v => updatePartB(row.id, "irLikelihood", v as HML)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>{HML_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 align-top w-16">
                        <Select disabled={locked} value={row.irMagnitude} onValueChange={v => updatePartB(row.id, "irMagnitude", v as HML)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>{HML_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 align-top w-16">
                        <Select disabled={locked} value={row.inherentRisk} onValueChange={v => updatePartB(row.id, "inherentRisk", v as HML)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>{HML_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 align-top w-20">
                        <Select disabled={locked} value={row.significantRisk} onValueChange={v => updatePartB(row.id, "significantRisk", v as YN)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2.5 align-top w-24">
                        <Select disabled={locked} value={row.substantiveSufficient} onValueChange={v => updatePartB(row.id, "substantiveSufficient", v as YN)}>
                          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      {!locked && (
                        <td className="px-2 py-2.5 align-middle text-center">
                          <button onClick={() => setData(d => ({ ...d, partBRows: d.partBRows.filter(r => r.id !== row.id) }))} className="text-muted-foreground hover:text-destructive transition-colors">
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
              <div className="border-t border-border px-4 py-3">
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setData(d => ({ ...d, partBRows: [...d.partBRows, newPartBRow()] }))}>
                  <Plus className="h-3 w-3" /> Add Risk
                </Button>
              </div>
            )}
          </SectionCard>

          {/* ── Conclusion ─────────────────────────────────────────────── */}
          <SectionCard title="Conclusion">
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                RMMs at the financial statement level and inherent risk at the assertion level have been appropriately identified and assessed.
              </p>
              <Textarea
                disabled={locked}
                value={data.conclusion}
                onChange={e => setData(d => ({ ...d, conclusion: e.target.value }))}
                placeholder="Document your conclusion…"
                className="min-h-[120px] text-sm resize-none bg-background"
              />
            </div>
          </SectionCard>

          {/* ── Conclude button ─────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3">
            {data.concluded && (
              <span className="text-sm text-green-700 dark:text-green-400">Concluded on {data.concludedOn}</span>
            )}
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
              Conclude Worksheet
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
