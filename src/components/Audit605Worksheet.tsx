import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { loadRisks520, overallRisk520 } from "@/lib/audit520Bridge";
import {
  WorksheetHeader, LinkedRisksCard, ProcedureTable, SignOffCard, ConcludeBar, makeProcRow,
  type ProcRow, type SignOffData,
} from "@/components/audit/WorksheetShell";

interface Data605 {
  fsLevelControlWeaknesses: string;
  rationale: string;
  sections: { title: string; rows: ProcRow[] }[];
  signOff: SignOffData;
  concluded: boolean; concludedOn: string;
}

function buildDefault(overallRisk: "High" | "Moderate" | "Low"): Data605 {
  const sections = [
    {
      title: "B · Overall responses that apply to all audits",
      rows: [
        makeProcRow("1a. Assign staff with specialized knowledge, experience and skills sufficient to address the identified risks. Document the rationale for the composition of the engagement team."),
        makeProcRow("1b. Provide additional supervision of staff commensurate with the assessed risks. Set expectations for review depth and frequency."),
        makeProcRow("2a. Reinforce professional skepticism across the engagement team in planning meetings and throughout fieldwork."),
        makeProcRow("2b. Direct the team to stay alert for undisclosed related parties and unusual transactions outside the normal course of business."),
        makeProcRow("2c. Revenue recognition presumed fraud risk — evaluate which revenue streams, transactions and accounting policies could give rise to fraud risk and design a responsive approach.", "C, AV"),
        makeProcRow("2d. Design procedures addressing identified fraud risks: specific scenarios, management override, revenue cut-off, related parties, bias in estimates, and journal-entry testing."),
        makeProcRow("2e. Introduce unpredictability — select procedures on accounts not previously tested, vary timing/sampling methods, perform unannounced procedures where appropriate."),
      ],
    },
  ];
  if (overallRisk !== "Low") {
    sections.push({
      title: "C · Responses when overall risk is moderate or high",
      rows: [
        makeProcRow("3a. Retain an auditor's expert where specialised skills (valuation, IT, actuarial, tax) are required to address an assessed risk."),
        makeProcRow("3b. Use data-analytics tools (CAATs) to extract / analyse 100 % of the population where relevant."),
        makeProcRow("3c-i. Add more elements of unpredictability in procedure selection (e.g. rotating samples, new sub-populations)."),
        makeProcRow("3c-ii. Perform more extensive procedures over cut-off, journal entries, related parties and estimates."),
        makeProcRow("3c-iii. Increase the extent of substantive testing over revenues, expenses, inventories, receivables and other significant balances."),
        makeProcRow("3c-iv. Verify title to assets pledged as collateral."),
        makeProcRow("3c-v. Obtain additional written representations from management for sensitive areas."),
        makeProcRow("3c-vi. Place less reliance on internal controls and perform substantive procedures."),
        makeProcRow("3c-vii. Perform substantive procedures at period-end rather than at an interim date."),
        makeProcRow("3c-viii. Extend coverage of entity locations included in the audit scope."),
        makeProcRow("3d. Other responses (specify in the comments column)."),
      ],
    });
  }
  return {
    fsLevelControlWeaknesses: "",
    rationale: "",
    sections,
    signOff: { preparedBy: "", preparedDate: "", reviewedBy: "", reviewedDate: "" },
    concluded: false, concludedOn: "",
  };
}

export function Audit605Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const risks = useMemo(() => loadRisks520(engagementId), [engagementId]);
  const overall = useMemo(() => overallRisk520(risks), [risks]);
  const fsRisks = useMemo(() => risks.filter(r => r.source === "A" || r.fraudRisk === "Y" || r.significantRisk === "Y"), [risks]);

  const storageKey = `audit-605-data-${engagementId ?? "default"}`;
  const [data, setData] = useState<Data605>(() => readJsonFromLocalStorage<Data605>(storageKey, buildDefault(overall)) ?? buildDefault(overall));

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const updateRow = (si: number, rowId: string, field: keyof ProcRow, value: string) =>
    setData(d => ({
      ...d,
      sections: d.sections.map((s, i) =>
        i === si ? { ...s, rows: s.rows.map(r => r.id === rowId ? { ...r, [field]: value } : r) } : s
      ),
    }));

  return (
    <div className="p-4 space-y-4">
      <WorksheetHeader
        ctx={ctx}
        formNo="605"
        title="Responding to Risk at the Financial-Statement Level"
        standard={`${ctx.standardPrefix} 330.5`}
        overallRisk={overall}
        objective="Design overall responses to address risks of material misstatement at the financial-statement level. Responses are based on the assessment of risk recorded on Form 520."
      />

      <LinkedRisksCard risks={fsRisks} emptyHint="No FS-level or significant risks have been flagged in Form 520." />

      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">A · Control weaknesses at the financial-statement level</label>
        <Textarea disabled={locked} value={data.fsLevelControlWeaknesses}
          onChange={e => setData(d => ({ ...d, fsLevelControlWeaknesses: e.target.value }))}
          className="text-xs min-h-[72px]"
          placeholder="Summarise FS-level control weaknesses identified during the audit (e.g. weak governance, lack of segregation of duties, management override exposure)…" />
      </div>

      <ProcedureTable sections={data.sections} locked={locked} onChange={updateRow} />

      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rationale / overall conclusion</label>
        <Textarea disabled={locked} value={data.rationale}
          onChange={e => setData(d => ({ ...d, rationale: e.target.value }))}
          className="text-xs min-h-[80px]"
          placeholder="Explain why the overall responses are appropriate given the assessed FS-level risk and the team composition / supervision approach…" />
      </div>

      <SignOffCard data={data.signOff} locked={locked} onChange={(k, v) => setData(d => ({ ...d, signOff: { ...d.signOff, [k]: v } }))} />

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn}
        onConclude={() => {
          const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) };
          setData(u); writeJsonToLocalStorage(storageKey, u);
        }} />
    </div>
  );
}
