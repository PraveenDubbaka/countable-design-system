import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { loadRisks520, overallRisk520, filterRisks } from "@/lib/audit520Bridge";
import {
  WorksheetLayout, WorksheetHeader, LinkedRisksCard, ProcedureTable, ConcludeBar, makeProcRow,
  type ProcRow, type SignOffData,
} from "@/components/audit/WorksheetShell";

type Strategy = "sale-of-assets" | "borrow-restructure" | "new-capital" | "operational" | "";

interface Data625 {
  managementPlan: string;
  feasibilityConcerns: string;
  forecastEvaluation: string;
  keyStrategy: Strategy;
  strategyProcedures: { title: string; rows: ProcRow[] }[];
  subsequentEvents: string;
  conclusionMaterial: "Y" | "N" | "";
  conclusionGoingConcernAppropriate: "Y" | "N" | "";
  disclosureAdequate: "Y" | "N" | "N/A" | "";
  auditorReportImplication: string;
  communication: string;
  signOff: SignOffData;
  concluded: boolean; concludedOn: string;
}

const STRATEGY_LABEL: Record<Exclude<Strategy, "">, string> = {
  "sale-of-assets": "5 · Key strategy — SALE OF ASSETS",
  "borrow-restructure": "6 · Key strategy — BORROW MORE / RESTRUCTURE DEBT",
  "new-capital": "7 · Key strategy — ADDITIONAL / NEW SOURCES OF CAPITAL",
  "operational": "Key strategy — OPERATIONAL RESTRUCTURING / OTHER",
};

function strategyRows(s: Exclude<Strategy, "">): ProcRow[] {
  switch (s) {
    case "sale-of-assets": return [
      makeProcRow("a. Assess the marketability of the assets management plans to sell."),
      makeProcRow("b. Review loan agreements, mortgages, credit facilities and liens for restrictions on disposing of the assets."),
      makeProcRow("c. Assess the effect of the planned disposal on the entity's remaining operations."),
    ];
    case "borrow-restructure": return [
      makeProcRow("a. Assess the availability of debt financing and the entity's capacity to borrow; review covenants restricting additional borrowing."),
      makeProcRow("b. Assess whether the entity has sufficient collateral (AR, inventory, PP&E, third-party guarantees)."),
      makeProcRow("c. Determine the feasibility of obtaining required guarantees from third parties."),
      makeProcRow("d. Assess the impact of new financing on operations and timing of cash flows."),
    ];
    case "new-capital": return [
      makeProcRow("a. Confirm the expected capital investment will be sufficient to address needs for the next 12 months."),
      makeProcRow("b. Consider terms associated with new capital (new management, operational changes, restructuring)."),
      makeProcRow("c. Assess whether the planned sources have the financial resources and timing required."),
      makeProcRow("d. Assess the effect on existing shareholders and any approvals required."),
    ];
    case "operational": return [
      makeProcRow("a. Assess feasibility of the operational changes (cost reductions, new markets, head-count actions)."),
      makeProcRow("b. Corroborate planned actions with documented evidence (board minutes, contracts, communications)."),
      makeProcRow("c. Sensitivity-test the impact of the changes on the 12-month forecast."),
    ];
  }
}

function buildDefault(): Data625 {
  return {
    managementPlan: "",
    feasibilityConcerns: "",
    forecastEvaluation: "",
    keyStrategy: "",
    strategyProcedures: [],
    subsequentEvents: "",
    conclusionMaterial: "",
    conclusionGoingConcernAppropriate: "",
    disclosureAdequate: "",
    auditorReportImplication: "",
    communication: "",
    signOff: { preparedBy: "", preparedDate: "", reviewedBy: "", reviewedDate: "" },
    concluded: false, concludedOn: "",
  };
}

export function Audit625Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const risks = useMemo(() => loadRisks520(engagementId), [engagementId]);
  const overall = useMemo(() => overallRisk520(risks), [risks]);
  const gcRisks = useMemo(() => filterRisks(risks, ["going concern", "going-concern", "liquidity", "debt", "covenant", "financing"]), [risks]);

  const storageKey = `audit-625-data-${engagementId ?? "default"}`;
  const [data, setData] = useState<Data625>(() => readJsonFromLocalStorage<Data625>(storageKey, buildDefault()) ?? buildDefault());

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  const setStrategy = (s: Strategy) => {
    setData(d => ({
      ...d, keyStrategy: s,
      strategyProcedures: s === "" ? [] : [{ title: STRATEGY_LABEL[s], rows: strategyRows(s) }],
    }));
  };

  const updateProcRow = (si: number, rowId: string, field: keyof ProcRow, value: string) =>
    setData(d => ({
      ...d,
      strategyProcedures: d.strategyProcedures.map((s, i) => i === si ? { ...s, rows: s.rows.map(r => r.id === rowId ? { ...r, [field]: value } : r) } : s),
    }));

  const yn = (v: string, set: (v: "Y" | "N" | "") => void, withNA = false) => (
    <Select disabled={locked} value={v} onValueChange={(x: string) => set(x as "Y" | "N" | "")}>
      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="Y" className="text-xs">Yes</SelectItem>
        <SelectItem value="N" className="text-xs">No</SelectItem>
        {withNA && <SelectItem value="N/A" className="text-xs">N/A</SelectItem>}
      </SelectContent>
    </Select>
  );

  return (
    <WorksheetLayout
      objective="Evaluate management's plan of action to address identified events or conditions that cast doubt on the entity's ability to continue as a going concern. Part 1 is on Form 525."
      standard={`${ctx.standardPrefix} 570`}
    >
      <WorksheetHeader
        ctx={ctx}
        formNo="625"
        title="Going-Concern Evaluation (Part 2)"
        standard={`${ctx.standardPrefix} 570`}
        overallRisk={overall}
      />


      <LinkedRisksCard risks={gcRisks} emptyHint="No going-concern related risks tagged in Form 520." />

      <Card title="1 · Management's plan of action">
        <Textarea disabled={locked} value={data.managementPlan} onChange={e => setData(d => ({ ...d, managementPlan: e.target.value }))}
          className="text-xs min-h-[80px]" placeholder="Summarise management's plan: future sales, expenses, cash-flow forecast over at least 12 months. Where no plan exists, summarise medium / long-term financing and key strategies for survival, with supporting documentation references…" />
      </Card>

      <Card title="2 · Overall feasibility of the plan">
        <Textarea disabled={locked} value={data.feasibilityConcerns} onChange={e => setData(d => ({ ...d, feasibilityConcerns: e.target.value }))}
          className="text-xs min-h-[72px]" placeholder="Identify matters casting doubt on feasibility: financing turn-downs, deteriorating operations, customer loss, near-term debt maturities, covenant breaches, litigation or non-compliance…" />
      </Card>

      <Card title="3 · Review of management's forecast">
        <Textarea disabled={locked} value={data.forecastEvaluation} onChange={e => setData(d => ({ ...d, forecastEvaluation: e.target.value }))}
          className="text-xs min-h-[96px]" placeholder="Document: (a) reliability of source data; (b) arithmetic accuracy; (c) internal consistency; (d) comparison to prior-period actuals; (e) reasonableness of macro / industry assumptions; (f) treatment of pending litigation outcomes…" />
      </Card>

      <Card title="4 · Evaluate plan strategy">
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-muted-foreground">Key strategy management plans to use</label>
          <Select disabled={locked} value={data.keyStrategy} onValueChange={(v) => setStrategy(v as Strategy)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select primary strategy" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sale-of-assets" className="text-xs">Sale of assets</SelectItem>
              <SelectItem value="borrow-restructure" className="text-xs">Borrow more / restructure debt</SelectItem>
              <SelectItem value="new-capital" className="text-xs">Additional / new sources of capital</SelectItem>
              <SelectItem value="operational" className="text-xs">Operational restructuring / other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {data.strategyProcedures.length > 0 && (
        <ProcedureTable sections={data.strategyProcedures} locked={locked} onChange={updateProcRow} />
      )}

      <Card title="8 · Subsequent events">
        <Textarea disabled={locked} value={data.subsequentEvents} onChange={e => setData(d => ({ ...d, subsequentEvents: e.target.value }))}
          className="text-xs min-h-[64px]" placeholder="Note any subsequent facts / events not addressed in management's plan and the procedures performed to extend the assessment." />
      </Card>

      <Card title="9-11 · Conclusion, disclosure &amp; auditor's report">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="text-[11px] font-medium text-muted-foreground">Material uncertainty exists?</label>{yn(data.conclusionMaterial, v => setData(d => ({ ...d, conclusionMaterial: v })))}</div>
          <div><label className="text-[11px] font-medium text-muted-foreground">Going-concern basis appropriate?</label>{yn(data.conclusionGoingConcernAppropriate, v => setData(d => ({ ...d, conclusionGoingConcernAppropriate: v })))}</div>
          <div><label className="text-[11px] font-medium text-muted-foreground">Disclosures adequate?</label>
            <Select disabled={locked} value={data.disclosureAdequate} onValueChange={(v: Data625["disclosureAdequate"]) => setData(d => ({ ...d, disclosureAdequate: v }))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Y" className="text-xs">Yes</SelectItem>
                <SelectItem value="N" className="text-xs">No</SelectItem>
                <SelectItem value="N/A" className="text-xs">N/A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-[11px] font-medium text-muted-foreground">Implication for the auditor's report</label>
          <Textarea disabled={locked} value={data.auditorReportImplication} onChange={e => setData(d => ({ ...d, auditorReportImplication: e.target.value }))}
            className="text-xs min-h-[72px]" placeholder="State the report outcome: Unmodified opinion / Material Uncertainty Related to Going Concern section / Qualified or Adverse opinion. Reference key audit matters where applicable." />
        </div>
      </Card>

      <Card title="12 · Communication with management and TCWG">
        <Textarea disabled={locked} value={data.communication} onChange={e => setData(d => ({ ...d, communication: e.target.value }))}
          className="text-xs min-h-[64px]" placeholder="Describe what was communicated, to whom, and on what date." />
      </Card>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn}
        onConclude={() => { const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) }; setData(u); writeJsonToLocalStorage(storageKey, u); }} />
    </WorksheetLayout>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border"><h3 className="text-sm font-semibold">{title}</h3></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
