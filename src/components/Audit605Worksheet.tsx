import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { loadRisks520, overallRisk520 } from "@/lib/audit520Bridge";
import {
  WorksheetLayout, WorksheetHeader, LinkedRisksCard, ProcedureTable, ConcludeBar, makeProcRow,
  type ProcRow, type SignOffData,
} from "@/components/audit/WorksheetShell";

interface Data605 {
  fsLevelControlWeaknesses: string;
  sections: { title: string; rows: ProcRow[] }[];
  signOff: SignOffData;
  concluded: boolean; concludedOn: string;
}

function buildDefault(overallRisk: "High" | "Moderate" | "Low"): Data605 {
  const sections = [
    {
      title: "B · Overall responses — 1. Composition of audit team",
      rows: [
        makeProcRow(
          "1a. Is there a need to assign staff with specialized knowledge, experience, skills and ability to address the risks identified? If so, explain."
        ),
        makeProcRow(
          "1b. Is there a need for additional supervision of staff to address the risks identified? If so, explain."
        ),
      ],
    },
    {
      title: "B · Overall responses — 2. Responding to fraud risk",
      rows: [
        makeProcRow(
          "2a. Has the need to maintain professional skepticism throughout the audit been communicated to staff?"
        ),
        makeProcRow(
          "2b. Has the audit team been asked to stay alert for undisclosed related parties?"
        ),
        makeProcRow(
          "2c. Revenue recognition is a presumed fraud risk. Have we evaluated which types of revenue, transactions and accounting policies could give rise to fraud risks?"
        ),
        makeProcRow(
          "2d. Have audit procedures been designed to address the identified fraud risks?\n\nConsider:\n  • Specific fraud scenarios.\n  • Management override.\n  • Revenue recognition.\n  • Inappropriate use of related parties.\n  • Bias in estimates.\n  • Inappropriate journal entries."
        ),
        makeProcRow(
          "2e. Has some element of unpredictability been considered to address fraud risks?\n\nConsider:\n  • Specific procedures on selected account balances/assertions.\n  • Adjusting timing of audit procedures.\n  • Using different sampling methods.\n  • Performing audit procedures at different locations or at locations on an unannounced basis."
        ),
      ],
    },
  ];

  if (overallRisk !== "Low") {
    sections.push({
      title: "C · Additional responses for moderate / high risk — 3. Steps to address higher risk",
      rows: [
        makeProcRow(
          "3a. Retain an auditor's expert where specialised knowledge, skills and experience are required to address an assessed risk."
        ),
        makeProcRow(
          "3b. Use electronic data analysis tools to extract/analyze information."
        ),
        makeProcRow(
          "3c. Perform additional procedures at the assertion level to address the higher risks involved.\n\nConsider:\n  • Adding more elements of unpredictability in the selection of procedures.\n  • Performing further, more extensive audit procedures in relation to cut-off, journal entries, related parties and estimates.\n  • Performing additional testing of revenues, expenses, inventories, receivables and other major assets/liabilities.\n  • Verifying title to assets used as collateral.\n  • Verifying more of management's representations.\n  • Relying less on relevant internal controls.\n  • Performing procedures at period end rather than at an interim date.\n  • Increasing the number of entity locations included in the audit scope."
        ),
        makeProcRow(
          "3d. Other responses (specify in the comments column)."
        ),
      ],
    });
  }

  return {
    fsLevelControlWeaknesses: "",
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
  const [data, setData] = useState<Data605>(() => {
    const saved = readJsonFromLocalStorage<Data605>(storageKey, buildDefault(overall));
    return saved ?? buildDefault(overall);
  });

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const updateRow = (si: number, rowId: string, field: keyof ProcRow, value: string | import("@/components/RefButton").RefDoc[]) =>
    setData(d => ({
      ...d,
      sections: d.sections.map((s, i) =>
        i === si ? { ...s, rows: s.rows.map(r => r.id === rowId ? { ...r, [field]: value } : r) } : s
      ),
    }));

  return (
    <WorksheetLayout
      heading="Canada > Worksheets"
      objective="Design overall responses to address risks of material misstatement at the financial-statement level. Responses are based on the assessment of risk recorded on Form 520."
      standard={`${ctx.standardPrefix} 330.5`}
    >
      <WorksheetHeader
        ctx={ctx}
        formNo="605"
        title="Responding to Risk at the Financial-Statement Level"
        standard={`${ctx.standardPrefix} 330.5`}
        overallRisk={overall}
      />

      <LinkedRisksCard overallRisk={overall} risks={fsRisks} storageKey={`audit-605-risks-${engagementId ?? "default"}`} locked={locked} emptyHint="No FS-level or significant risks have been flagged in Form 520." />

      <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
        <div className="px-6 py-3.5 border-b border-border">
          <h3 className="text-sm font-semibold">A · Control weaknesses at the financial-statement level</h3>
        </div>
        <div className="p-6">
          <Textarea
            disabled={locked}
            value={data.fsLevelControlWeaknesses}
            onChange={e => setData(d => ({ ...d, fsLevelControlWeaknesses: e.target.value }))}
            className="text-sm min-h-[88px]"
            placeholder="Summarise any control weaknesses at the financial-statement level identified during the audit (e.g. weak governance, lack of segregation of duties, management override exposure)…"
          />
        </div>
      </div>

      <ProcedureTable sections={data.sections} locked={locked} onChange={updateRow} showPsa={false} showNumbers={false} />

      <ConcludeBar
        worksheetKey="audit-605"
        engagementId={engagementId}
        concluded={data.concluded}
        concludedOn={data.concludedOn}
        onConclude={() => {
          const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) };
          setData(u); writeJsonToLocalStorage(storageKey, u);
        }}
      />
    </WorksheetLayout>
  );
}
