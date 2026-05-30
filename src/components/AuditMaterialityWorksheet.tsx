import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Plus, X } from "lucide-react";
import { AddToMyTemplatesDialog } from "@/components/AddToMyTemplatesDialog";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

interface IntendedUser {
  id: string;
  name: string;
  relationship: string;
}

interface QualitativeItem {
  id: string;
  consideration: string;
  impact: string;
}

interface SpecificMaterialityItem {
  id: string;
  area: string;
  threshold: string;
  rationale: string;
}

interface WorksheetData {
  // Period & entity
  periodStart: string;
  periodEnd: string;
  entityType: "profit" | "nonprofit" | "";
  reportingFramework: string;

  // Benchmark
  basisLabel: string;
  basisAmount: string;
  benchmarkPct: string;

  // Prior year
  materialityPY: string;

  // Performance materiality
  pmPct: string;
  pmRationale: string;

  // Clearly trivial
  ctPct: string;
  ctRationale: string;

  // Specific materiality
  specificItems: SpecificMaterialityItem[];

  // Revision
  revised: "yes" | "no" | "na" | "";
  revisionDetail: string;

  // Intended users
  intendedUsers: IntendedUser[];

  // Qualitative considerations
  qualitative: QualitativeItem[];

  // Additional comments
  additionalComments: string;

  // Conclusion
  conclusion: string;
  concludedBy: string;
  concludedDate: string;
  preparedBy: string;
  preparedDate: string;
  reviewedBy: string;
  reviewedDate: string;
}

const BASIS_OPTIONS = [
  "Total revenues",
  "Total assets",
  "Gross profit",
  "Net income / profit before tax",
  "Total expenses",
  "Net assets / equity",
  "Normalized profit before tax",
  "Other",
];

const FRAMEWORK_OPTIONS = [
  "ASPE",
  "IFRS",
  "ASNPO",
  "Public Sector Accounting Standards (PSAS)",
  "US GAAP",
  "Other",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCAD(val: string): string {
  const n = parseFloat(val.replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return "";
  return n.toLocaleString("en-CA", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function calcAmount(amount: string, pct: string): string {
  const a = parseFloat(amount.replace(/[^0-9.]/g, ""));
  const p = parseFloat(pct.replace(/[^0-9.]/g, ""));
  if (isNaN(a) || isNaN(p)) return "";
  return formatCAD(String((a * p) / 100));
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
      <div className="px-6 py-3.5 bg-card border-b border-border flex items-start gap-3">
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      {note && (
        <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2">
          <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
        </div>
      )}
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  );
}

function RowLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-sm text-foreground font-medium mb-1">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}

function ReadonlyCalc({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="h-9 px-3 flex items-center bg-muted/60 border border-border rounded-md text-sm font-semibold text-foreground">
        {value ? `$${value}` : <span className="text-muted-foreground font-normal">—</span>}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 rounded-md ${
        highlight ? "bg-primary/[0.06] border border-primary/20" : "bg-muted/40"
      }`}
    >
      <span className="text-sm text-foreground">{label}</span>
      <span
        className={`text-sm font-semibold tabular-nums ${
          highlight ? "text-primary" : "text-foreground"
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface AuditMaterialityWorksheetProps {
  isUS?: boolean;
}

export function AuditMaterialityWorksheet({ isUS = false }: AuditMaterialityWorksheetProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [concluded, setConcluded] = useState(false);

  const [data, setData] = useState<WorksheetData>({
    periodStart: "",
    periodEnd: "",
    entityType: "",
    reportingFramework: isUS ? "US GAAP" : "ASPE",

    basisLabel: "",
    basisAmount: "",
    benchmarkPct: "",

    materialityPY: "",

    pmPct: "70",
    pmRationale: "",

    ctPct: "5",
    ctRationale: "",

    specificItems: [
      { id: uid(), area: "", threshold: "", rationale: "" },
    ],

    revised: "",
    revisionDetail: "",

    intendedUsers: [
      { id: uid(), name: "", relationship: "" },
    ],

    qualitative: [
      { id: uid(), consideration: "", impact: "" },
    ],

    additionalComments: "",
    conclusion: "",
    concludedBy: "",
    concludedDate: "",
    preparedBy: "",
    preparedDate: "",
    reviewedBy: "",
    reviewedDate: "",
  });

  const update = useCallback(<K extends keyof WorksheetData>(key: K, value: WorksheetData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Derived calculations
  const omAmount = calcAmount(data.basisAmount, data.benchmarkPct);
  const pmAmount = calcAmount(omAmount, data.pmPct);
  const ctAmount = calcAmount(omAmount, data.ctPct);

  const standardRef = isUS ? "AS 2101 / AU-C 320" : "CAS 320 / CAS 450";
  const title = isUS ? "Materiality — US GAAS" : "Materiality — CAS 320";

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b bg-card px-6 py-3 flex items-center justify-between shrink-0">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add to My Templates
        </Button>
      </div>

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Establish overall materiality, performance materiality, and the clearly trivial threshold
          for the audit and document the rationale for each determination. ({standardRef})
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* ── Section 1: Engagement Information ── */}
          <SectionCard title="1. Engagement Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <RowLabel label="Period start date" />
                <Input
                  type="date"
                  value={data.periodStart}
                  onChange={(e) => update("periodStart", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <RowLabel label="Period end date" />
                <Input
                  type="date"
                  value={data.periodEnd}
                  onChange={(e) => update("periodEnd", e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <RowLabel label="Entity type" />
                <Select
                  value={data.entityType}
                  onValueChange={(v) => update("entityType", v as WorksheetData["entityType"])}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profit">Profit Oriented</SelectItem>
                    <SelectItem value="nonprofit">Not-for-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <RowLabel label="Financial reporting framework" />
                <Select
                  value={data.reportingFramework}
                  onValueChange={(v) => update("reportingFramework", v)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAMEWORK_OPTIONS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          {/* ── Section 2: Benchmark Selection ── */}
          <SectionCard
            title="2. Benchmark Selection and Justification"
            note={
              isUS
                ? "Select the benchmark most appropriate to the financial statements, considering the nature and circumstances of the entity and the primary users. (AU-C 320.A4–A8)"
                : "Select the benchmark most appropriate to the financial statements, considering the nature and circumstances of the entity and the primary users. (CAS 320.A3–A6)"
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <RowLabel label="Basis for calculations" required />
                <Select
                  value={data.basisLabel}
                  onValueChange={(v) => update("basisLabel", v)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select benchmark…" />
                  </SelectTrigger>
                  <SelectContent>
                    {BASIS_OPTIONS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <RowLabel label="Benchmark amount ($)" required />
                <Input
                  placeholder="e.g. 12500000"
                  value={data.basisAmount}
                  onChange={(e) => update("basisAmount", e.target.value.replace(/[^0-9.]/g, ""))}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Section 3: Overall Materiality ── */}
          <SectionCard
            title="3. Overall Materiality"
            note={isUS ? "(AU-C 320.10)" : "(CAS 320.10)"}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <RowLabel label="Benchmark applied %" required />
                <Input
                  placeholder="e.g. 1"
                  value={data.benchmarkPct}
                  onChange={(e) => update("benchmarkPct", e.target.value.replace(/[^0-9.]/g, ""))}
                  className="h-9 text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Typical ranges: revenue 0.5–2%, assets 0.5–1%, PBT 3–7%
                </p>
              </div>
              <ReadonlyCalc label="Materiality CY ($) — calculated" value={omAmount} />
              <div>
                <RowLabel label="Materiality PY ($) — for reference" />
                <Input
                  placeholder="e.g. 112000"
                  value={data.materialityPY}
                  onChange={(e) => update("materialityPY", e.target.value.replace(/[^0-9.]/g, ""))}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Section 4: Performance Materiality ── */}
          <SectionCard
            title="4. Performance Materiality"
            note={
              (isUS ? "(AU-C 320.11)" : "(CAS 320.11)") +
              " — Reduces the risk that aggregate uncorrected and undetected misstatements exceed overall materiality. Typically 50–75% of overall materiality."
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <RowLabel label="Performance materiality %" required />
                <Input
                  placeholder="e.g. 70"
                  value={data.pmPct}
                  onChange={(e) => update("pmPct", e.target.value.replace(/[^0-9.]/g, ""))}
                  className="h-9 text-sm"
                />
              </div>
              <ReadonlyCalc label="Performance materiality ($) — calculated" value={pmAmount} />
              <div className="sm:col-span-3">
                <RowLabel label="Rationale for performance materiality %" />
                <Textarea
                  placeholder="Explain why this percentage was selected — consider prior year uncorrected misstatements, audit risk assessment, complexity of the entity…"
                  value={data.pmRationale}
                  onChange={(e) => update("pmRationale", e.target.value)}
                  className="min-h-[80px] text-sm resize-none bg-background"
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Section 5: Clearly Trivial Threshold ── */}
          <SectionCard
            title="5. Clearly Trivial Threshold"
            note={
              (isUS ? "(AU-C 450.A2)" : "(CAS 450.A2)") +
              " — Misstatements below the clearly trivial threshold are not accumulated. Typically 3–5% of overall materiality."
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <RowLabel label="Clearly trivial %" required />
                <Input
                  placeholder="e.g. 5"
                  value={data.ctPct}
                  onChange={(e) => update("ctPct", e.target.value.replace(/[^0-9.]/g, ""))}
                  className="h-9 text-sm"
                />
              </div>
              <ReadonlyCalc label="Clearly trivial amount ($) — calculated" value={ctAmount} />
              <div className="sm:col-span-3">
                <RowLabel label="Rationale" />
                <Textarea
                  placeholder="Document your rationale for the clearly trivial threshold selected…"
                  value={data.ctRationale}
                  onChange={(e) => update("ctRationale", e.target.value)}
                  className="min-h-[60px] text-sm resize-none bg-background"
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Section 6: Specific Materiality ── */}
          <SectionCard
            title="6. Specific Materiality for Sensitive Areas"
            note={
              (isUS ? "(AU-C 320.A15)" : "(CAS 320.A13)") +
              " — Specific materiality may be set for particular classes of transactions, account balances, or disclosures where misstatements of lesser amounts could reasonably be expected to influence user decisions."
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-1/3">Area / account balance</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-1/6">Specific threshold ($)</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Rationale</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.specificItems.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g. Related-party transactions"
                          value={item.area}
                          onChange={(e) =>
                            update(
                              "specificItems",
                              data.specificItems.map((i) =>
                                i.id === item.id ? { ...i, area: e.target.value } : i
                              )
                            )
                          }
                          className="h-8 text-sm border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g. 25000"
                          value={item.threshold}
                          onChange={(e) =>
                            update(
                              "specificItems",
                              data.specificItems.map((i) =>
                                i.id === item.id ? { ...i, threshold: e.target.value.replace(/[^0-9.]/g, "") } : i
                              )
                            )
                          }
                          className="h-8 text-sm border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Textarea
                          placeholder="Explain why a lower materiality applies…"
                          value={item.rationale}
                          onChange={(e) =>
                            update(
                              "specificItems",
                              data.specificItems.map((i) =>
                                i.id === item.id ? { ...i, rationale: e.target.value } : i
                              )
                            )
                          }
                          className="min-h-[36px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {data.specificItems.length > 1 && (
                          <button
                            onClick={() =>
                              update(
                                "specificItems",
                                data.specificItems.filter((i) => i.id !== item.id)
                              )
                            }
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                update("specificItems", [
                  ...data.specificItems,
                  { id: uid(), area: "", threshold: "", rationale: "" },
                ])
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add row
            </Button>
          </SectionCard>

          {/* ── Section 7: Materiality Summary ── */}
          <SectionCard title="7. Materiality Summary">
            <div className="space-y-2">
              <SummaryRow
                label={`Benchmark — ${data.basisLabel || "Not selected"}`}
                value={data.basisAmount ? `$${formatCAD(data.basisAmount)}` : "—"}
              />
              <SummaryRow
                label={`Overall materiality (${data.benchmarkPct ? data.benchmarkPct + "%" : "—"} of benchmark)`}
                value={omAmount ? `$${omAmount}` : "—"}
                highlight
              />
              <SummaryRow
                label={`Performance materiality (${data.pmPct ? data.pmPct + "%" : "—"} of OM)`}
                value={pmAmount ? `$${pmAmount}` : "—"}
              />
              <SummaryRow
                label={`Clearly trivial threshold (${data.ctPct ? data.ctPct + "%" : "—"} of OM)`}
                value={ctAmount ? `$${ctAmount}` : "—"}
              />
              {data.materialityPY && (
                <SummaryRow
                  label="Prior year overall materiality"
                  value={`$${formatCAD(data.materialityPY)}`}
                />
              )}
            </div>
          </SectionCard>

          {/* ── Section 8: Revision During the Audit ── */}
          <SectionCard
            title="8. Revision of Materiality During the Audit"
            note={isUS ? "(AU-C 320.12–14)" : "(CAS 320.12–14)"}
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <RowLabel label="Has materiality been revised during the audit?" />
                <Select
                  value={data.revised}
                  onValueChange={(v) => update("revised", v as WorksheetData["revised"])}
                >
                  <SelectTrigger className="h-9 text-sm w-64">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No — materiality unchanged</SelectItem>
                    <SelectItem value="yes">Yes — materiality was revised</SelectItem>
                    <SelectItem value="na">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {data.revised === "yes" && (
                <div>
                  <RowLabel label="Detail the reason for revision, new amounts, and impact on audit procedures" />
                  <Textarea
                    placeholder="Document the reason for the revision…"
                    value={data.revisionDetail}
                    onChange={(e) => update("revisionDetail", e.target.value)}
                    className="min-h-[80px] text-sm resize-none bg-background"
                  />
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── Section 9: Intended Users ── */}
          <SectionCard title="9. Intended Users">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-1/3">Name / group</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Relationship to entity</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.intendedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g. Bank lenders"
                          value={u.name}
                          onChange={(e) =>
                            update(
                              "intendedUsers",
                              data.intendedUsers.map((x) =>
                                x.id === u.id ? { ...x, name: e.target.value } : x
                              )
                            )
                          }
                          className="h-8 text-sm border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          placeholder="e.g. Primary lender — covenant compliance"
                          value={u.relationship}
                          onChange={(e) =>
                            update(
                              "intendedUsers",
                              data.intendedUsers.map((x) =>
                                x.id === u.id ? { ...x, relationship: e.target.value } : x
                              )
                            )
                          }
                          className="h-8 text-sm border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {data.intendedUsers.length > 1 && (
                          <button
                            onClick={() =>
                              update(
                                "intendedUsers",
                                data.intendedUsers.filter((x) => x.id !== u.id)
                              )
                            }
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                update("intendedUsers", [
                  ...data.intendedUsers,
                  { id: uid(), name: "", relationship: "" },
                ])
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add user
            </Button>
          </SectionCard>

          {/* ── Section 10: Qualitative Considerations ── */}
          <SectionCard title="10. Qualitative Considerations">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-1/2">Qualitative consideration</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Impact on materiality determination</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.qualitative.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2">
                        <Textarea
                          placeholder="e.g. Management compensation disclosures are sensitive to users"
                          value={item.consideration}
                          onChange={(e) =>
                            update(
                              "qualitative",
                              data.qualitative.map((x) =>
                                x.id === item.id ? { ...x, consideration: e.target.value } : x
                              )
                            )
                          }
                          className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Textarea
                          placeholder="e.g. Lower specific materiality applied to this area"
                          value={item.impact}
                          onChange={(e) =>
                            update(
                              "qualitative",
                              data.qualitative.map((x) =>
                                x.id === item.id ? { ...x, impact: e.target.value } : x
                              )
                            )
                          }
                          className="min-h-[52px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {data.qualitative.length > 1 && (
                          <button
                            onClick={() =>
                              update(
                                "qualitative",
                                data.qualitative.filter((x) => x.id !== item.id)
                              )
                            }
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() =>
                update("qualitative", [
                  ...data.qualitative,
                  { id: uid(), consideration: "", impact: "" },
                ])
              }
            >
              <Plus className="h-4 w-4 mr-1" />
              Add row
            </Button>
          </SectionCard>

          {/* ── Additional Comments ── */}
          <SectionCard title="Additional Comments">
            <Textarea
              placeholder="Any additional comments or context not captured above…"
              value={data.additionalComments}
              onChange={(e) => update("additionalComments", e.target.value)}
              className="min-h-[80px] text-sm resize-none bg-background"
            />
          </SectionCard>

          {/* ── Conclusion ── */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Conclusion</span>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <RowLabel label="Conclusion statement" />
                <Textarea
                  placeholder="I am satisfied that the materiality amounts determined above are appropriate for this engagement based on the entity's financial profile, risk assessment, and the needs of the primary users…"
                  value={data.conclusion}
                  onChange={(e) => update("conclusion", e.target.value)}
                  className="min-h-[80px] text-sm resize-none bg-background"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <RowLabel label="Engagement partner" />
                  <Input
                    placeholder="Name, designation"
                    value={data.concludedBy}
                    onChange={(e) => update("concludedBy", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <RowLabel label="Date" />
                  <Input
                    type="date"
                    value={data.concludedDate}
                    onChange={(e) => update("concludedDate", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div />
                <div>
                  <RowLabel label="Prepared by" />
                  <Input
                    placeholder="Name, designation"
                    value={data.preparedBy}
                    onChange={(e) => update("preparedBy", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <RowLabel label="Date" />
                  <Input
                    type="date"
                    value={data.preparedDate}
                    onChange={(e) => update("preparedDate", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div />
                <div>
                  <RowLabel label="Reviewed by" />
                  <Input
                    placeholder="Name, designation"
                    value={data.reviewedBy}
                    onChange={(e) => update("reviewedBy", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <RowLabel label="Date" />
                  <Input
                    type="date"
                    value={data.reviewedDate}
                    onChange={(e) => update("reviewedDate", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  onClick={() => {
                    setConcluded(true);
                    toast.success("Materiality worksheet concluded");
                  }}
                  disabled={concluded}
                >
                  {concluded ? "Worksheet concluded" : "Conclude worksheet"}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Dialog */}
      <AddToMyTemplatesDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        checklist={{
          id: isUS ? "aud-us-mat-worksheet" : "aud-mat-worksheet",
          title,
          sections: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
        checklistName={title}
      />
    </div>
  );
}
