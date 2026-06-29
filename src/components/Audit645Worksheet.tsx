import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { loadRisks520, overallRisk520, filterRisks } from "@/lib/audit520Bridge";
import { formatCurrency } from "@/lib/engagementContext";
import {
  WorksheetLayout, WorksheetHeader, LinkedRisksCard, ProcedureTable, ConcludeBar, makeProcRow,
  type ProcRow, type SignOffData,
} from "@/components/audit/WorksheetShell";

interface Data645 {
  performanceMateriality: string;
  sections: { title: string; rows: ProcRow[] }[];
  otherProcedures: string;
  nonComplianceCommunication: string;
  overallConclusion: string;
  signOff: SignOffData;
  concluded: boolean; concludedOn: string;
}

function buildDefault(pm: number): Data645 {
  return {
    performanceMateriality: pm ? formatCurrency(pm) : "",
    sections: [
      { title: "Preparation",
        rows: [
          makeProcRow("Review and understand the reasoning for the assessed risk of material misstatement resulting from litigation, claims and non-compliance (Forms 520 and 590)."),
        ],
      },
      { title: "Completeness",
        rows: [
          makeProcRow("1a. Inquire of management and others within the entity about actual or threatened litigation or claims, and non-compliance with laws and regulations.", "C (AV E)"),
          makeProcRow("1b. Review minutes of meetings of those charged with governance and correspondence between the entity and external legal counsel.", "C (AV E)"),
          makeProcRow("1c. Review legal expense accounts for items suggesting unrecorded claims or fines.", "C (AV E)"),
          makeProcRow("1d. Review correspondence with relevant regulatory, licensing and taxation authorities.", "C (AV E)"),
          makeProcRow("1e. Consider results of other audit procedures for indications of non-compliance or suspected non-compliance.", "C (AV E)"),
          makeProcRow("2a. Communicate directly with the entity's external legal counsel (letter of inquiry prepared by management, reply direct to the auditor) and/or meet with counsel — where assessed risk is high or material litigation may exist.", "C (AV E)"),
          makeProcRow("2b. Where management refuses permission to send a legal letter, perform alternative procedures or assess the implications for the auditor's report.", "C (AV E)"),
        ],
      },
      { title: "Accuracy / Valuation",
        rows: [
          makeProcRow("1a. Discuss identified or suspected non-compliance with management and TCWG; obtain sufficient information to assess the financial-statement impact.", "AV"),
          makeProcRow("1b. Consider obtaining legal advice where doubt exists and the effect may be material.", "AV"),
          makeProcRow("1c. Where it is not possible to determine whether material non-compliance has occurred, modify the auditor's report accordingly.", "AV"),
          makeProcRow("2. Impact on estimates — consider whether information obtained provides new evidence about the valuation of litigation, claims (Form 635) or fines / penalties payable for non-compliance.", "AV (C)"),
        ],
      },
      { title: "Existence — insurance coverage",
        rows: [
          makeProcRow("a. Review the entity's insurance coverage for adequate protection against normal business risks.", "E (AV)"),
          makeProcRow("b. Inquire whether claims already made or expected may not be covered; estimate the extent and the potential financial-statement effect.", "E (AV)"),
          makeProcRow("c. Where claims are handled by an insurer, consider obtaining written confirmation of outstanding claims from the insurer's law firm.", "E (AV)"),
        ],
      },
      { title: "Presentation",
        rows: [
          makeProcRow("1. Disclosures — confirm notes to the financial statements include disclosures required by the AFRF (refer to the 900-series forms).", "P"),
          makeProcRow("2. Relevant information — ensure overall presentation is not undermined by irrelevant information that obscures a proper understanding of the matters disclosed.", "P"),
        ],
      },
      { title: "Communicating &amp; reporting — non-compliance",
        rows: [
          makeProcRow("a. Document any suspected or identified non-compliance for communication and discussion with those charged with governance."),
          makeProcRow("b. Determine whether there is responsibility to report non-compliance to an authority outside of the entity. Where intentional management non-compliance is believed to exist, communicate directly with TCWG."),
        ],
      },
    ],
    otherProcedures: "",
    nonComplianceCommunication: "",
    overallConclusion: "",
    signOff: { preparedBy: "", preparedDate: "", reviewedBy: "", reviewedDate: "" },
    concluded: false, concludedOn: "",
  };
}

export function Audit645Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const risks = useMemo(() => loadRisks520(engagementId), [engagementId]);
  const overall = useMemo(() => overallRisk520(risks), [risks]);
  const lcncRisks = useMemo(() => filterRisks(risks, ["litigation", "claim", "legal", "compliance", "regulator", "fine", "penalt"]), [risks]);

  const storageKey = `audit-645-data-${engagementId ?? "default"}`;
  const [data, setData] = useState<Data645>(() => readJsonFromLocalStorage<Data645>(storageKey, buildDefault(ctx.performanceMateriality)) ?? buildDefault(ctx.performanceMateriality));

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  const updateProcRow = (si: number, rowId: string, field: keyof ProcRow, value: string) =>
    setData(d => ({
      ...d,
      sections: d.sections.map((s, i) => i === si ? { ...s, rows: s.rows.map(r => r.id === rowId ? { ...r, [field]: value } : r) } : s),
    }));

  return (
    <WorksheetLayout
      objective="Identify and respond appropriately to litigation, claims and instances of non-compliance with laws and regulations that may be material to the financial statements."
      standard={`${ctx.standardPrefix} 250 / ${ctx.standardPrefix} 501`}
    >
      <WorksheetHeader
        ctx={ctx}
        formNo="645"
        title="Litigation, Claims and Non-Compliance"
        standard={`${ctx.standardPrefix} 250 / ${ctx.standardPrefix} 501`}
        overallRisk={overall}
      />

      <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md px-6 py-4 grid grid-cols-3 gap-3 items-center">
        <div className="col-span-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Performance materiality (Form 420)</div>
        <div className="col-span-2 text-sm font-mono">{data.performanceMateriality || formatCurrency(ctx.performanceMateriality)}</div>
      </div>

      <LinkedRisksCard risks={lcncRisks} emptyHint="No litigation, claims or non-compliance risks tagged in Form 520." />

      <ProcedureTable sections={data.sections} locked={locked} onChange={updateProcRow} />

      <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border"><h3 className="text-sm font-semibold">Other procedures (specify)</h3></div>
        <div className="p-6"><Textarea disabled={locked} value={data.otherProcedures} onChange={e => setData(d => ({ ...d, otherProcedures: e.target.value }))} className="text-sm min-h-[72px]" /></div>
      </div>

      <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border"><h3 className="text-sm font-semibold">Non-compliance — communications log</h3></div>
        <div className="p-6"><Textarea disabled={locked} value={data.nonComplianceCommunication} onChange={e => setData(d => ({ ...d, nonComplianceCommunication: e.target.value }))} className="text-sm min-h-[80px]" placeholder="Summarise what was communicated, to whom (management / TCWG / external authority), and on what date." /></div>
      </div>

      <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border"><h3 className="text-sm font-semibold">Overall audit conclusion</h3></div>
        <div className="p-6"><Textarea disabled={locked} value={data.overallConclusion} onChange={e => setData(d => ({ ...d, overallConclusion: e.target.value }))} className="text-sm min-h-[88px]"
          placeholder="The audit evidence obtained is sufficient and appropriate to reduce the risk of material misstatement from litigation, claims and non-compliance to an acceptably low level." /></div>
      </div>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn}
        onConclude={() => { const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) }; setData(u); writeJsonToLocalStorage(storageKey, u); }} />
    </WorksheetLayout>
  );
}
