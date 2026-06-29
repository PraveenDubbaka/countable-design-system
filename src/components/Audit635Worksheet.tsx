import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { loadRisks520, overallRisk520, filterRisks } from "@/lib/audit520Bridge";
import {
  WorksheetLayout, WorksheetHeader, LinkedRisksCard, ProcedureTable, ConcludeBar, makeProcRow,
  type ProcRow, type SignOffData,
} from "@/components/audit/WorksheetShell";

type SectionKey = "A" | "B" | "C";

interface Data635 {
  estimateName: string;
  estimateAmount: string;
  managementMethod: string;
  // approach selection
  approachA: boolean; // Subsequent events
  approachB: boolean; // Testing management's process
  approachC: boolean; // Auditor's point estimate / range
  sections: Record<SectionKey, { title: string; rows: ProcRow[] }>;
  testsOfControlsApplicable: boolean;
  testsOfControls: string;
  pointEstimateRange: string;
  managementBias: string;
  presentationConclusion: string;
  overallConclusion: string;
  signOff: SignOffData;
  concluded: boolean; concludedOn: string;
}

const SECTION_A: ProcRow[] = [
  makeProcRow("1. Actual outcomes — obtain evidence subsequent to the balance-sheet date for actual outcomes; investigate differences and propose adjustments where applicable.", "AV (C E)"),
  makeProcRow("2. Changes in circumstances — inquire about any changes in conditions since the measurement date that may affect the estimate.", "AV (C E)"),
];
const SECTION_B: ProcRow[] = [
  makeProcRow("1. Methods — evaluate whether management's method is appropriate under the AFRF and consistent with prior periods; assess any change in method.", "AV (C E)"),
  makeProcRow("2. Management bias — evaluate whether judgments made in selecting the method indicate possible bias.", "AV (C E)"),
  makeProcRow("3. Mathematical accuracy — recompute the estimate and verify accuracy of the calculations.", "AV"),
  makeProcRow("4. Management's use of experts — assess competency / objectivity, obtain engagement letter, review report; review assumptions, methods and data.", "AV (C E)"),
  makeProcRow("5. Complex modelling — where modelling is used, evaluate design, changes from prior model and reasonableness of adjustments to outputs.", "AV"),
  makeProcRow("6. Management's point estimate — understand how estimation uncertainty was addressed and how related disclosures were developed.", "AV (C E)"),
  makeProcRow("7. Assumptions — evaluate reasonableness of significant assumptions, including sensitivity to changes and bias indicators.", "AV"),
];
const SECTION_C: ProcRow[] = [
  makeProcRow("1. Point estimate — develop the auditor's point estimate to evaluate management's estimate; record differences on Form 335.", "AV"),
  makeProcRow("2. Range estimate — develop a range supported by audit evidence and reasonable under the AFRF; perform procedures over disclosure of estimation uncertainty.", "AV"),
  makeProcRow("3. Use of auditor's expert — assess competency / objectivity, obtain engagement letter, review report.", "AV"),
];

function buildDefault(): Data635 {
  return {
    estimateName: "", estimateAmount: "", managementMethod: "",
    approachA: true, approachB: true, approachC: false,
    sections: {
      A: { title: "A · Evaluating subsequent events", rows: SECTION_A },
      B: { title: "B · Testing management's accounting estimate", rows: SECTION_B },
      C: { title: "C · Developing the auditor's point estimate or range", rows: SECTION_C },
    },
    testsOfControlsApplicable: false,
    testsOfControls: "",
    pointEstimateRange: "",
    managementBias: "",
    presentationConclusion: "",
    overallConclusion: "",
    signOff: { preparedBy: "", preparedDate: "", reviewedBy: "", reviewedDate: "" },
    concluded: false, concludedOn: "",
  };
}

export function Audit635Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const risks = useMemo(() => loadRisks520(engagementId), [engagementId]);
  const overall = useMemo(() => overallRisk520(risks), [risks]);
  const estimateRisks = useMemo(() => filterRisks(risks, ["estimate", "allowance", "provision", "valuation", "impairment", "obsolesc"]), [risks]);

  const storageKey = `audit-635-data-${engagementId ?? "default"}`;
  const [data, setData] = useState<Data635>(() => readJsonFromLocalStorage<Data635>(storageKey, buildDefault()) ?? buildDefault());

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  const sectionsToShow: { title: string; rows: ProcRow[] }[] = [];
  if (data.approachA) sectionsToShow.push(data.sections.A);
  if (data.approachB) sectionsToShow.push(data.sections.B);
  if (data.approachC) sectionsToShow.push(data.sections.C);

  const updateProcRow = (siVisible: number, rowId: string, field: keyof ProcRow, value: string) => {
    // map visible index back to section key
    const order: SectionKey[] = [];
    if (data.approachA) order.push("A");
    if (data.approachB) order.push("B");
    if (data.approachC) order.push("C");
    const key = order[siVisible];
    setData(d => ({
      ...d,
      sections: {
        ...d.sections,
        [key]: { ...d.sections[key], rows: d.sections[key].rows.map(r => r.id === rowId ? { ...r, [field]: value } : r) },
      },
    }));
  };

  return (
    <WorksheetLayout
      objective="Document further audit procedures to obtain evidence about the reasonableness of accounting estimates (including fair value) and whether financial-statement disclosures are adequate. Use this form for ONE estimate at a time."
      standard={`${ctx.standardPrefix} 540`}
    >
      <WorksheetHeader
        ctx={ctx}
        formNo="635"
        title="Accounting Estimates — Further Audit Procedures"
        standard={`${ctx.standardPrefix} 540`}
        overallRisk={overall}
      />


      <LinkedRisksCard overallRisk={overall} risks={estimateRisks} emptyHint="No estimate-related risks tagged in Form 520." />

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border"><h3 className="text-sm font-semibold">Estimate addressed by this worksheet</h3></div>
        <div className="p-4 grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-[11px] font-medium text-muted-foreground">Estimate (from Form 520)</label>
            <Input disabled={locked} value={data.estimateName} onChange={e => setData(d => ({ ...d, estimateName: e.target.value }))} className="h-8 text-xs" placeholder="e.g. Allowance for doubtful accounts" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Estimate amount $</label>
            <Input disabled={locked} value={data.estimateAmount} onChange={e => setData(d => ({ ...d, estimateAmount: e.target.value }))} className="h-8 text-xs" placeholder="0" />
          </div>
          <div className="col-span-3">
            <label className="text-[11px] font-medium text-muted-foreground">Method used by management to prepare the estimate</label>
            <Textarea disabled={locked} value={data.managementMethod} onChange={e => setData(d => ({ ...d, managementMethod: e.target.value }))} className="text-xs min-h-[56px]" placeholder="Describe the method, key assumptions and any model / expert used." />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Testing approach (1 — select one or more)</p>
        <div className="flex flex-wrap gap-4 text-xs">
          {([
            ["approachA", "A · Evaluating subsequent events"],
            ["approachB", "B · Testing management's accounting estimate"],
            ["approachC", "C · Developing a point estimate or range"],
          ] as const).map(([k, label]) => (
            <label key={k} className="flex items-center gap-2">
              <Checkbox disabled={locked} checked={data[k] as boolean} onCheckedChange={v => setData(d => ({ ...d, [k]: !!v }))} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {sectionsToShow.length > 0 && <ProcedureTable sections={sectionsToShow} locked={locked} onChange={updateProcRow} />}

      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Performing tests of controls</h3>
          <label className="flex items-center gap-2 text-xs"><Checkbox disabled={locked} checked={data.testsOfControlsApplicable} onCheckedChange={v => setData(d => ({ ...d, testsOfControlsApplicable: !!v }))} /> Applicable</label>
        </div>
        {data.testsOfControlsApplicable && (
          <Textarea disabled={locked} value={data.testsOfControls} onChange={e => setData(d => ({ ...d, testsOfControls: e.target.value }))} className="text-xs min-h-[56px]" placeholder="Describe controls tested at the assertion level (where assessment of control risk is other than maximum, or substantive procedures alone are insufficient)." />
        )}
      </div>

      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-3">
        <h3 className="text-sm font-semibold">Overall evaluation</h3>
        <div>
          <label className="text-[11px] font-medium text-muted-foreground">Auditor's point estimate / range vs management's estimate</label>
          <Textarea disabled={locked} value={data.pointEstimateRange} onChange={e => setData(d => ({ ...d, pointEstimateRange: e.target.value }))} className="text-xs min-h-[64px]" placeholder="Document the point estimate or range, the difference vs management's estimate, and whether the difference is within performance materiality." />
        </div>
        <div>
          <label className="text-[11px] font-medium text-muted-foreground">Indicators of management bias</label>
          <Textarea disabled={locked} value={data.managementBias} onChange={e => setData(d => ({ ...d, managementBias: e.target.value }))} className="text-xs min-h-[56px]" placeholder="Where identified, record the risk on Form 520 and evaluate the implications for the audit." />
        </div>
        <div>
          <label className="text-[11px] font-medium text-muted-foreground">Presentation &amp; disclosure conclusion</label>
          <Textarea disabled={locked} value={data.presentationConclusion} onChange={e => setData(d => ({ ...d, presentationConclusion: e.target.value }))} className="text-xs min-h-[56px]" placeholder="Conclude on whether classification, aggregation, terminology and disclosure about estimation uncertainty are appropriate under the AFRF." />
        </div>
        <div>
          <label className="text-[11px] font-medium text-muted-foreground">Overall conclusion (CAS 540)</label>
          <Textarea disabled={locked} value={data.overallConclusion} onChange={e => setData(d => ({ ...d, overallConclusion: e.target.value }))} className="text-xs min-h-[64px]" placeholder="The audit evidence obtained is sufficient and appropriate to reduce the risk of material misstatement due to this estimate to an acceptably low level." />
        </div>
      </div>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn}
        onConclude={() => { const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) }; setData(u); writeJsonToLocalStorage(storageKey, u); }} />
    </WorksheetLayout>
  );
}
