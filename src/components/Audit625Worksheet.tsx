import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { loadRisks520, overallRisk520, filterRisks, type Risk520Row } from "@/lib/audit520Bridge";
import { REPORT_IMPLICATION_LABEL, type ReportImplication, type YN, type YNNA } from "@/lib/audit625Bridge";
import {
  WorksheetLayout, WorksheetSection, LinkedRisksCard, ProcedureTable, ConcludeBar, makeProcRow,
  type ProcRow,
} from "@/components/audit/WorksheetShell";

// ── Types ─────────────────────────────────────────────────────────────────────

type Strategy = "sale-of-assets" | "borrow-restructure" | "new-capital" | "operational" | "";

interface CommunicationRow {
  id: string;
  topic: string;
  communicated: boolean;
  audience: string; // Management / TCWG / Both
  date: string;
  wpRef: RefDoc[];
}

interface Data625 {
  // Pre-section — events & conditions snapshot
  eventsSummary: string;
  eventsRefs: RefDoc[];

  // Procedure tables (1-4 + 8 + strategy)
  planProcedures: ProcRow[];        // 1a, 1b
  feasibilityProcedures: ProcRow[]; // 2
  forecastProcedures: ProcRow[];    // 3a-f
  evaluateProcedures: ProcRow[];    // 4
  keyStrategy: Strategy;
  strategyProcedures: ProcRow[];    // 5/6/7 (dynamic)
  subsequentProcedures: ProcRow[];  // 8

  // 9 — Conclusion
  materialUncertainty: YN;
  goingConcernBasisAppropriate: YN;
  conclusionRationale: string;

  // 10 — Presentation & disclosure
  disclosuresAdequate: YNNA;
  disclosureNotes: string;

  // 11 — Auditor's report
  reportImplication: ReportImplication;
  reportRationale: string;
  considerKAM: boolean;
  kamNotes: string;

  // 12 — Reporting / communication
  communication: CommunicationRow[];

  // Audit conclusion
  evidenceSufficient: YN;
  evidenceRationale: string;

  concluded: boolean; concludedOn: string;
}

// ── Strategy procedures (from doc §5/6/7) ────────────────────────────────────

const STRATEGY_OPTIONS: { value: Exclude<Strategy, "">; label: string; section: string }[] = [
  { value: "sale-of-assets",     label: "Sale of assets",                       section: "5 · Key strategy — Sale of assets" },
  { value: "borrow-restructure", label: "Borrow more / restructure debt",       section: "6 · Key strategy — Borrow more / restructure debt" },
  { value: "new-capital",        label: "Additional / new sources of capital",  section: "7 · Key strategy — Additional / new sources of capital" },
  { value: "operational",        label: "Operational restructuring / other",    section: "Key strategy — Operational restructuring / other" },
];

function strategyTitle(s: Exclude<Strategy, "">) {
  return STRATEGY_OPTIONS.find(o => o.value === s)!.section;
}

function strategyRows(s: Exclude<Strategy, "">): ProcRow[] {
  switch (s) {
    case "sale-of-assets": return [
      makeProcRow("a. Assess the marketability of the assets management plans to sell.", "AV / E"),
      makeProcRow("b. Review loan agreements, mortgages, credit facilities and liens for restrictions on disposing of the assets.", "C / P"),
      makeProcRow("c. Assess the effect of the planned disposal on the entity's remaining operations.", "GC"),
    ];
    case "borrow-restructure": return [
      makeProcRow("a. Assess availability of debt financing and the entity's capacity to borrow; review covenants restricting additional borrowing.", "C / P"),
      makeProcRow("b. Assess whether the entity has sufficient collateral (AR, inventory, PP&E, third-party guarantees).", "AV"),
      makeProcRow("c. Determine the feasibility of obtaining required guarantees from third parties.", "GC"),
      makeProcRow("d. Assess the impact of new financing on operations and timing of cash flows.", "GC"),
    ];
    case "new-capital": return [
      makeProcRow("a. Confirm the expected capital investment will be sufficient to address needs for the next 12 months.", "GC"),
      makeProcRow("b. Consider terms associated with new capital (new management, operational changes, restructuring).", "GC"),
      makeProcRow("c. Assess whether the planned sources have the financial resources and timing required.", "GC"),
      makeProcRow("d. Assess the effect on existing shareholders and any approvals required.", "P"),
    ];
    case "operational": return [
      makeProcRow("a. Assess feasibility of the operational changes (cost reductions, new markets, head-count actions).", "GC"),
      makeProcRow("b. Corroborate planned actions with documented evidence (board minutes, contracts, communications).", "E"),
      makeProcRow("c. Sensitivity-test the impact of the changes on the 12-month forecast.", "AV"),
    ];
  }
}

// ── Defaults (mirror the source document, §1-§12) ────────────────────────────

function defaultPlanProcedures(): ProcRow[] {
  return [
    makeProcRow("1a. Obtain management's plan of action — future sales, expenses and a cash-flow forecast covering a minimum of 12 months from the date of the financial statements."),
    makeProcRow("1b. Where management lacks the resources or capability, discuss medium / long-term financing and key strategies for survival, then inspect supporting documentation (financing sources, restructurings, asset disposals, future sales, expenses and investments)."),
  ];
}

function defaultFeasibilityProcedures(): ProcRow[] {
  return [
    makeProcRow("2. Based on understanding of the entity and the assessed risks (Form 520), identify matters that cast doubt on feasibility — financing turn-downs, deteriorating operations, customer loss, uncompetitive products/services, near-term debt maturities, covenant breaches, litigation or non-compliance."),
  ];
}

function defaultForecastProcedures(): ProcRow[] {
  return [
    makeProcRow("3a. Evaluate the reliability of the data used to generate the forecast."),
    makeProcRow("3b. Check the arithmetic accuracy of the information and computations."),
    makeProcRow("3c. Ensure the information is internally consistent (entity can physically generate the products/services in the sales forecast)."),
    makeProcRow("3d. Compare the forecast to actual prior-period experience and assess reasonableness (cash generated/used in operations, debt repayments, investing activities and other known cash requirements)."),
    makeProcRow("3e. Assess whether assumptions about the economy, interest rates, industry trends, costs, staffing, sales and general market conditions are reasonable."),
    makeProcRow("3f. Assess management's assessment of any legal actions and financial implications; where forecast includes the outcome, confirm with legal counsel."),
  ];
}

function defaultEvaluateProcedures(): ProcRow[] {
  return [
    makeProcRow("4. Identify the key strategy management plans to use; perform the relevant procedures in §5-§7. Where more than one strategy is planned, use professional judgment to determine the audit procedures required."),
  ];
}

function defaultSubsequentProcedures(): ProcRow[] {
  return [
    makeProcRow("8a. Where additional facts/events arise that were not addressed in management's plan, ask management to extend its assessment and obtain updated representations."),
    makeProcRow("8b. Evaluate the implications of subsequent events on the going-concern conclusion and on financial-statement disclosures."),
  ];
}

function defaultCommunication(): CommunicationRow[] {
  return [
    { id: "c-mu",   topic: "Whether events or conditions constitute a material uncertainty.", communicated: false, audience: "", date: "", wpRef: [] },
    { id: "c-gc",   topic: "Whether the use of the going-concern basis of accounting is appropriate.", communicated: false, audience: "", date: "", wpRef: [] },
    { id: "c-disc", topic: "Whether the related disclosures in the financial statements are adequate.", communicated: false, audience: "", date: "", wpRef: [] },
    { id: "c-rpt",  topic: "Implications for the auditor's report (where applicable).", communicated: false, audience: "", date: "", wpRef: [] },
  ];
}

function buildDefault(): Data625 {
  return {
    eventsSummary: "",
    eventsRefs: [{ name: "525" }],
    planProcedures: defaultPlanProcedures(),
    feasibilityProcedures: defaultFeasibilityProcedures(),
    forecastProcedures: defaultForecastProcedures(),
    evaluateProcedures: defaultEvaluateProcedures(),
    keyStrategy: "",
    strategyProcedures: [],
    subsequentProcedures: defaultSubsequentProcedures(),
    materialUncertainty: "",
    goingConcernBasisAppropriate: "",
    conclusionRationale: "",
    disclosuresAdequate: "",
    disclosureNotes: "",
    reportImplication: "",
    reportRationale: "",
    considerKAM: false,
    kamNotes: "",
    communication: defaultCommunication(),
    evidenceSufficient: "",
    evidenceRationale: "",
    concluded: false, concludedOn: "",
  };
}

// ── Auto-recommend report implication from conclusions ───────────────────────

function recommendImplication(d: Pick<Data625, "materialUncertainty" | "goingConcernBasisAppropriate" | "disclosuresAdequate">): ReportImplication {
  if (d.goingConcernBasisAppropriate === "N") return "adverse";
  if (d.materialUncertainty === "Y") {
    if (d.disclosuresAdequate === "Y") return "unmodified-mu-paragraph";
    if (d.disclosuresAdequate === "N") return "qualified";
  }
  if (d.materialUncertainty === "N" && d.goingConcernBasisAppropriate === "Y") return "unmodified";
  return "";
}

// ── Events summary builder from 520 risks ───────────────────────────────────

function buildEventsSummaryFromRisks(rows: Risk520Row[], entity: string): string {
  if (rows.length === 0) return "";
  const bullets = rows.map(r => `• ${r.scotabd ? `[${r.scotabd}] ` : ""}${r.rmmIdentified} (Ref ${r.ref})`).join("\n");
  return `Going-concern events/conditions identified for ${entity} (per Form 520 / Form 525):\n${bullets}`;
}

// ── Main component ──────────────────────────────────────────────────────────

export function Audit625Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const risks = useMemo(() => loadRisks520(engagementId), [engagementId]);
  const overall = useMemo(() => overallRisk520(risks), [risks]);
  const gcRisks = useMemo(
    () => filterRisks(risks, ["going concern", "going-concern", "liquidity", "debt", "covenant", "financing", "solvency", "cash flow"]),
    [risks],
  );

  const storageKey = `audit-625-data-${engagementId ?? "default"}`;
  const [data, setData] = useState<Data625>(() => {
    const def = buildDefault();
    const stored = readJsonFromLocalStorage<Partial<Data625>>(storageKey, def) ?? def;
    return { ...def, ...stored } as Data625;
  });

  // Auto-seed events summary the first time, from 520 going-concern risks
  useEffect(() => {
    if (!data.eventsSummary && gcRisks.length > 0) {
      setData(d => ({ ...d, eventsSummary: buildEventsSummaryFromRisks(gcRisks, ctx.entityName) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gcRisks.length, ctx.entityName]);

  // Persist (debounced)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const recommended = recommendImplication(data);

  // ── Procedure-row updaters ─────────────────────────────────────────────────

  function updateProcRow(
    section: keyof Pick<Data625, "planProcedures" | "feasibilityProcedures" | "forecastProcedures" | "evaluateProcedures" | "strategyProcedures" | "subsequentProcedures">,
    rowId: string, field: keyof ProcRow, value: string | RefDoc[],
  ) {
    setData(d => ({
      ...d,
      [section]: d[section].map(r => r.id === rowId ? { ...r, [field]: value } : r),
    }));
  }

  const makeProcChangeHandler = (rows: ProcRow[], section: keyof Pick<Data625, "planProcedures" | "feasibilityProcedures" | "forecastProcedures" | "evaluateProcedures" | "strategyProcedures" | "subsequentProcedures">) =>
    (sectionIdx: number, rowId: string, field: keyof ProcRow, value: string | RefDoc[]) => {
      void sectionIdx; void rows;
      updateProcRow(section, rowId, field, value);
    };

  function setStrategy(s: Strategy) {
    setData(d => ({
      ...d, keyStrategy: s,
      strategyProcedures: s === "" ? [] : strategyRows(s),
    }));
  }

  function updateCommunication(id: string, field: keyof CommunicationRow, value: string | boolean | RefDoc[]) {
    setData(d => ({
      ...d,
      communication: d.communication.map(r => r.id === id ? { ...r, [field]: value } as CommunicationRow : r),
    }));
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const YNSelect = ({ value, onChange, withNA = false }: { value: string; onChange: (v: string) => void; withNA?: boolean }) => (
    <Select disabled={locked} value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="Y">Yes</SelectItem>
        <SelectItem value="N">No</SelectItem>
        {withNA && <SelectItem value="N/A">N/A</SelectItem>}
      </SelectContent>
    </Select>
  );

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">{children}</label>
  );

  return (
    <WorksheetLayout
      objective={`Evaluate management's plan of action to address identified events or conditions that cast doubt on the entity's ability to continue as a going concern (Part 2 — Part 1 is on Form 525).`}
      standard={`${ctx.standardPrefix} 570`}
    >
      {/* Linked 520 going-concern risks (with FS-level chip) */}
      <LinkedRisksCard overallRisk={overall} risks={gcRisks} emptyHint="No going-concern related risks tagged in Form 520. Add or tag risks in Form 520 to auto-populate this evaluation." />

      {/* A — Identified events & conditions (from Form 525) */}
      <WorksheetSection
        title="Identified events & conditions"
        right={
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">Auto-populated from Form 525 / Form 520</span>
            <RefButton
              reference={data.eventsRefs}
              disabled={locked}
              onAttach={(doc) => setData(d => ({ ...d, eventsRefs: [...d.eventsRefs, doc] }))}
              onRemove={(idx) => setData(d => ({ ...d, eventsRefs: d.eventsRefs.filter((_, j) => j !== (idx ?? -1)) }))}
            />
          </div>
        }
      >
        <Label>Summary of events / conditions that cast doubt on going concern</Label>
        <Textarea
          disabled={locked}
          value={data.eventsSummary}
          onChange={e => setData(d => ({ ...d, eventsSummary: e.target.value }))}
          className="text-sm min-h-[96px]"
          placeholder="Summarise the going-concern events/conditions identified in Form 525 and the related assessed risks from Form 520."
        />
      </WorksheetSection>

      {/* §1 — Management's plan of action */}
      <WorksheetSection title="1 · Request management's plan of action" bodyClassName="p-0">
        <ProcedureTable
          sections={[{ title: "Plan procurement", rows: data.planProcedures }]}
          locked={locked}
          onChange={makeProcChangeHandler(data.planProcedures, "planProcedures")}
        />
      </WorksheetSection>

      {/* §2 — Overall feasibility of plan */}
      <WorksheetSection title="2 · Overall feasibility of the plan" bodyClassName="p-0">
        <ProcedureTable
          sections={[{ title: "Feasibility assessment", rows: data.feasibilityProcedures }]}
          locked={locked}
          onChange={makeProcChangeHandler(data.feasibilityProcedures, "feasibilityProcedures")}
        />
      </WorksheetSection>

      {/* §3 — Review management's forecast */}
      <WorksheetSection title="3 · Review of management's forecast" bodyClassName="p-0">
        <ProcedureTable
          sections={[{ title: "Forecast review procedures (a–f)", rows: data.forecastProcedures }]}
          locked={locked}
          onChange={makeProcChangeHandler(data.forecastProcedures, "forecastProcedures")}
        />
      </WorksheetSection>

      {/* §4 — Evaluate plan strategy */}
      <WorksheetSection title="4 · Evaluate plan strategy">
        <ProcedureTable
          sections={[{ title: "Strategy identification", rows: data.evaluateProcedures }]}
          locked={locked}
          onChange={makeProcChangeHandler(data.evaluateProcedures, "evaluateProcedures")}
        />
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border bg-muted/20">
          <div>
            <Label>Key strategy management plans to use</Label>
            <Select disabled={locked} value={data.keyStrategy} onValueChange={(v) => setStrategy(v as Strategy)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select primary strategy" /></SelectTrigger>
              <SelectContent>
                {STRATEGY_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground self-end leading-relaxed">
            Selecting a strategy loads the corresponding §5–§7 procedures below. Use professional judgment to add procedures if more than one strategy is planned.
          </p>
        </div>
      </WorksheetSection>

      {/* §5/6/7 — Strategy procedures (dynamic) */}
      {data.keyStrategy && (
        <WorksheetSection title={strategyTitle(data.keyStrategy)} bodyClassName="p-0">
          <ProcedureTable
            sections={[{ title: "Strategy-specific procedures", rows: data.strategyProcedures }]}
            locked={locked}
            onChange={makeProcChangeHandler(data.strategyProcedures, "strategyProcedures")}
          />
        </WorksheetSection>
      )}

      {/* §8 — Subsequent events */}
      <WorksheetSection title="8 · Subsequent events" bodyClassName="p-0">
        <ProcedureTable
          sections={[{ title: "Events after management's assessment date", rows: data.subsequentProcedures }]}
          locked={locked}
          onChange={makeProcChangeHandler(data.subsequentProcedures, "subsequentProcedures")}
        />
      </WorksheetSection>

      {/* §9 — Conclusion */}
      <WorksheetSection title="9 · Conclusion">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>(a) Material uncertainty exists?</Label>
            <YNSelect value={data.materialUncertainty} onChange={(v) => setData(d => ({ ...d, materialUncertainty: v as YN }))} />
          </div>
          <div>
            <Label>(b) Going-concern basis of accounting appropriate?</Label>
            <YNSelect value={data.goingConcernBasisAppropriate} onChange={(v) => setData(d => ({ ...d, goingConcernBasisAppropriate: v as YN }))} />
          </div>
        </div>
        <div className="mt-4">
          <Label>Rationale supporting the conclusion</Label>
          <Textarea
            disabled={locked}
            value={data.conclusionRationale}
            onChange={e => setData(d => ({ ...d, conclusionRationale: e.target.value }))}
            className="text-sm min-h-[80px]"
            placeholder="Summarise the evidence and judgment supporting the conclusions above."
          />
        </div>
      </WorksheetSection>

      {/* §10 — Presentation & disclosure */}
      <WorksheetSection title="10 · Presentation and disclosure">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Disclosures adequate?</Label>
            <YNSelect value={data.disclosuresAdequate} onChange={(v) => setData(d => ({ ...d, disclosuresAdequate: v as YNNA }))} withNA />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {data.materialUncertainty === "Y"
                ? "Material uncertainty exists — disclosure adequacy must be evaluated."
                : "Required only if a material uncertainty exists."}
            </p>
          </div>
          <div className="md:col-span-2">
            <Label>Disclosure evaluation notes</Label>
            <Textarea
              disabled={locked}
              value={data.disclosureNotes}
              onChange={e => setData(d => ({ ...d, disclosureNotes: e.target.value }))}
              className="text-sm min-h-[72px]"
              placeholder={data.goingConcernBasisAppropriate === "N"
                ? "Going-concern basis deemed inappropriate — confirm the financial statements have NOT been prepared on the going-concern basis."
                : "Describe whether the nature and implications of any material uncertainty are adequately disclosed under the applicable framework."}
            />
          </div>
        </div>
      </WorksheetSection>

      {/* §11 — Auditor's report */}
      <WorksheetSection
        title="11 · Auditor's report"
        right={recommended && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium">
            Suggested: {REPORT_IMPLICATION_LABEL[recommended]}
          </span>
        )}
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Auditor's report implication</Label>
            <Select disabled={locked} value={data.reportImplication} onValueChange={(v) => setData(d => ({ ...d, reportImplication: v as ReportImplication }))}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select implication" /></SelectTrigger>
              <SelectContent>
                {(Object.keys(REPORT_IMPLICATION_LABEL) as Exclude<ReportImplication, "">[]).map(k => (
                  <SelectItem key={k} value={k}>{REPORT_IMPLICATION_LABEL[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Reasoning &amp; cross-reference to report wording</Label>
            <Textarea
              disabled={locked}
              value={data.reportRationale}
              onChange={e => setData(d => ({ ...d, reportRationale: e.target.value }))}
              className="text-sm min-h-[72px]"
              placeholder="Reference the Material Uncertainty paragraph, Basis-for-opinion modification, or other report sections affected (cross-reference Form 700)."
            />
          </div>
          <div className="rounded-md border border-border bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={data.considerKAM}
                disabled={locked}
                onCheckedChange={(v) => setData(d => ({ ...d, considerKAM: !!v }))}
                id="kam"
              />
              <div className="flex-1">
                <label htmlFor="kam" className="text-sm font-medium text-foreground cursor-pointer">
                  Going concern is a Key Audit Matter (KAM)
                </label>
                <p className="text-[11px] text-muted-foreground mt-0.5">Tick where applicable (listed entities / engagements applying KAMs).</p>
                {data.considerKAM && (
                  <Textarea
                    disabled={locked}
                    value={data.kamNotes}
                    onChange={e => setData(d => ({ ...d, kamNotes: e.target.value }))}
                    className="text-sm min-h-[60px] mt-2"
                    placeholder="Describe how going concern was addressed as a Key Audit Matter."
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </WorksheetSection>

      {/* §12 — Communication */}
      <WorksheetSection title="12 · Reporting / communication with management and TCWG" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-10">#</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Topic communicated</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-[90px]">Done</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-[150px]">Audience</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-[140px]">Date</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-[110px]">W/P ref.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.communication.map((c, i) => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs align-top">{i + 1}</td>
                  <td className="px-4 py-3 text-sm align-top leading-snug">{c.topic}</td>
                  <td className="px-4 py-3 text-center align-top">
                    <Checkbox
                      checked={c.communicated}
                      disabled={locked}
                      onCheckedChange={(v) => updateCommunication(c.id, "communicated", !!v)}
                    />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Select disabled={locked || !c.communicated} value={c.audience} onValueChange={(v) => updateCommunication(c.id, "audience", v)}>
                      <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="TCWG">TCWG</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Input
                      type="date"
                      disabled={locked || !c.communicated}
                      value={c.date}
                      onChange={e => updateCommunication(c.id, "date", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    <RefButton
                      reference={c.wpRef}
                      disabled={locked}
                      onAttach={(doc) => updateCommunication(c.id, "wpRef", [...c.wpRef, doc])}
                      onRemove={(idx) => updateCommunication(c.id, "wpRef", c.wpRef.filter((_, j) => j !== (idx ?? -1)))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WorksheetSection>

      {/* Audit conclusion */}
      <WorksheetSection title="Audit conclusion (based on professional judgment)">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start">
          <div>
            <Label>Evidence sufficient &amp; appropriate?</Label>
            <YNSelect value={data.evidenceSufficient} onChange={(v) => setData(d => ({ ...d, evidenceSufficient: v as YN }))} />
          </div>
          <div>
            <Label>Rationale</Label>
            <Textarea
              disabled={locked}
              value={data.evidenceRationale}
              onChange={e => setData(d => ({ ...d, evidenceRationale: e.target.value }))}
              className="text-sm min-h-[64px]"
              placeholder="Confirm the audit evidence obtained is sufficient and appropriate to reduce the risk of material misstatement related to going concern to an acceptably low level."
            />
          </div>
        </div>
      </WorksheetSection>

      <ConcludeBar
        concluded={data.concluded}
        concludedOn={data.concludedOn}
        onConclude={() => {
          const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) };
          setData(u);
          writeJsonToLocalStorage(storageKey, u);
        }}
      />
    </WorksheetLayout>
  );
}
