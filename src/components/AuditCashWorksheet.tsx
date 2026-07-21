import { Fragment, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { RefButton, type RefDoc } from "@/components/RefButton";
import { WorksheetLayout, WorksheetSection, ConcludeBar } from "@/components/audit/WorksheetShell";

type Nature = "Required" | "Optional" | "Additional Procedure" | "";
type ProcType = "Inquiries" | "Analytics" | "Observation" | "Inspection" | "Recalculation" | "Other" | "";
type RowStatus = "Complete" | "N/A" | "";

interface CashRow {
  id: string;
  nature: Nature;
  type: ProcType;
  description: string;
  comments: string;
  wpRef: RefDoc[];
  status: RowStatus;
}

interface CashSection {
  title: string;
  rows: CashRow[];
}

interface DataCash {
  lsName: string;
  lsAccountBalance: string;
  materiality: string;
  sections: CashSection[];
  concluded: boolean;
  concludedOn: string;
}

function mkRow(nature: Nature, type: ProcType, description: string): CashRow {
  return { id: Math.random().toString(36).slice(2, 11), nature, type, description, comments: "", wpRef: [], status: "" };
}

function buildDefault(): DataCash {
  return {
    lsName: "",
    lsAccountBalance: "",
    materiality: "",
    sections: [
      {
        title: "Basic Procedures",
        rows: [
          mkRow("Required", "Inquiries", "Obtain a list of all bank accounts and cash funds; note any pledged or restricted amounts; document in working papers."),
          mkRow("Required", "Inspection", "Review the prior-year audit plan and adjust for current-year changes."),
          mkRow("Required", "Analytics", "Perform analytical procedures: compare current vs. prior period cash balances; assess the reasonableness of interest earned/paid relative to average balances."),
          mkRow("Required", "Inquiries", "Review and document client's accounting policies for cash and bank."),
        ],
      },
      {
        title: "Completeness",
        rows: [
          mkRow("Required", "Inquiries", "Inquire whether all bank accounts and cash funds have been disclosed to the audit team."),
          mkRow("Required", "Inquiries", "Inquire about unrecorded cash transactions (e.g., undisclosed accounts, informal cash arrangements)."),
          mkRow("Optional", "Observation", "Cash on hand (if material): Count all material cash funds in the custodian's presence; obtain a signed representation from the custodian. Understand the rationale for large cash holdings; note any segregation of duties concerns."),
          mkRow("Optional", "", "Risk-specific additional procedures."),
          mkRow("Optional", "Analytics", "Additional analytical procedures."),
          mkRow("Optional", "", "Sampling."),
        ],
      },
      {
        title: "Accuracy / Valuation",
        rows: [
          mkRow("Required", "Inspection", "Bank reconciliations: Perform or review bank reconciliations. Agree outstanding cheques greater than 30 days and investigate stale-dated items. Obtain explanations for all reconciling items."),
          mkRow("Required", "Inquiries", "Verify compliance with bank agreements and any restrictions on the use of cash."),
          mkRow("Required", "Inspection", "Classification: Verify that unissued cheques are not deducted from the cash balance."),
          mkRow("Required", "Inspection", "Cut-off — receipts: Trace cash receipt entries on either side of year-end to source records to confirm proper period recording."),
          mkRow("Required", "Inspection", "Cut-off — disbursements: Obtain evidence that disbursements are recorded in the proper period."),
          mkRow("Required", "Inspection", "Bank transfers: Identify all bank transfers within 5 business days before and after year-end; verify consistent recording in both the disbursing and receiving accounts in the same period."),
          mkRow("Required", "Inspection", "Translation: Convert foreign currency bank balances at the year-end exchange rate; record any resulting translation gains or losses."),
          mkRow("Optional", "", "Risk-specific additional procedures."),
          mkRow("Optional", "Analytics", "Additional analytical procedures."),
          mkRow("Optional", "", "Sampling."),
        ],
      },
      {
        title: "Bank Reconciliation Procedures",
        rows: [
          mkRow("Required", "Inspection", "Obtain bank reconciliations for each bank account."),
          mkRow("Required", "Inspection", "Agree the bank balance to the bank confirmation letter and/or bank statement."),
          mkRow("Required", "Inspection", "Agree the book balance to the general ledger and to supporting detail (sub-ledger, schedules)."),
          mkRow("Required", "Recalculation", "Check the arithmetic of each bank reconciliation."),
          mkRow("Required", "Inspection", "Obtain the subsequent-period bank statement and use it to verify reconciling items."),
          mkRow("Required", "Inspection", "Agree all outstanding cheques to the subsequent bank statement; note any that do not clear."),
          mkRow("Required", "Inspection", "Agree deposits in transit to the subsequent bank statement."),
          mkRow("Required", "Inspection", "Examine all debit and credit notes on the bank statement; verify they are properly recorded in the general ledger."),
          mkRow("Required", "Inspection", "Agree the opening balance of the bank reconciliation to prior-year working papers."),
          mkRow("Required", "Inspection", "Scrutinize cancelled cheques for authorized signatures and correct amounts."),
          mkRow("Required", "Inquiries", "Inquire about any large, unusual, or stale-dated outstanding items."),
        ],
      },
      {
        title: "Cash Count Procedures (if applicable)",
        rows: [
          mkRow("Optional", "Observation", "Identify and list all petty cash funds and cash receipts on hand at the count date."),
          mkRow("Optional", "Inspection", "Determine which cash funds are material and should be counted."),
          mkRow("Optional", "Observation", "Count each selected fund in the custodian's presence; obtain a signed representation from the custodian."),
          mkRow("Optional", "Inspection", "Investigate differences between the count and the book balance; note and follow up on any unusual items."),
          mkRow("Optional", "Inspection", "Record the number and date of the last cash sales/receipts document and cash disbursements document at the time of the count."),
          mkRow("Optional", "Inspection", "Follow up: trace count proceeds to the next bank deposit; investigate any dishonoured cheques."),
        ],
      },
      {
        title: "Existence",
        rows: [
          mkRow("Required", "Inquiries", "Bank confirmations: Select bank accounts to confirm (consider confirming all accounts); send standard confirmation letters directly to financial institutions; agree confirmed balances to bank reconciliations; apply alternative procedures for any non-confirmed accounts."),
          mkRow("Optional", "", "Risk-specific additional procedures."),
          mkRow("Optional", "Analytics", "Additional analytical procedures."),
          mkRow("Optional", "", "Sampling."),
        ],
      },
      {
        title: "Presentation",
        rows: [
          mkRow("Required", "Inspection", "Verify that cash is properly classified (current assets vs. restricted cash or long-term deposits)."),
          mkRow("Required", "Inspection", "Review the adequacy of disclosures relating to bank accounts (restrictions, pledges, compensating balances, foreign currency)."),
          mkRow("Required", "Inquiries", "Ensure all relevant information has been communicated to client management."),
        ],
      },
      {
        title: "Audit Plan Completion",
        rows: [
          mkRow("Required", "", "Maintain professional skepticism throughout the cash procedures; consider the risk of management bias in disclosures and estimates."),
          mkRow("Required", "Inspection", "Document all accumulated misstatements identified during cash procedures (refer to Form 335)."),
          mkRow("Required", "Inquiries", "Assess whether any new risk factors relating to cash have arisen since the last risk assessment; update the audit plan if necessary."),
        ],
      },
      {
        title: "Audit Conclusions",
        rows: [
          mkRow("Required", "", "Conclude that sufficient and appropriate audit evidence has been obtained to support the audit opinion on cash and cash equivalents."),
        ],
      },
    ],
    concluded: false,
    concludedOn: "",
  };
}

export function AuditCashWorksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-cash-data-${engagementId ?? "global"}`;

  const [data, setData] = useState<DataCash>(() => {
    return readJsonFromLocalStorage<DataCash>(storageKey, buildDefault()) ?? buildDefault();
  });

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  function setHeader(field: "lsName" | "lsAccountBalance" | "materiality", value: string) {
    setData(d => ({ ...d, [field]: value }));
  }

  function setRowField(sectionIdx: number, rowId: string, field: keyof CashRow, value: string | RefDoc[]) {
    setData(d => ({
      ...d,
      sections: d.sections.map((s, si) =>
        si !== sectionIdx ? s : {
          ...s,
          rows: s.rows.map(r => r.id !== rowId ? r : { ...r, [field]: value }),
        }
      ),
    }));
  }

  function conclude() {
    setData(d => ({
      ...d,
      concluded: true,
      concludedOn: new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" }),
    }));
  }

  const td = "border-b border-border px-3 py-2.5 text-xs align-top";

  return (
    <WorksheetLayout objective="Obtain sufficient appropriate audit evidence that cash and cash equivalents exist, are complete, are accurately valued, are properly classified, and are adequately disclosed in the financial statements.">
      <WorksheetSection title="A · Cash and Cash Equivalents — Work Program">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">LS Name</label>
            <Input disabled={locked} value={data.lsName} onChange={e => setHeader("lsName", e.target.value)} className="h-8 text-xs" placeholder="Lead schedule name" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">LS Account Balance</label>
            <Input disabled={locked} value={data.lsAccountBalance} onChange={e => setHeader("lsAccountBalance", e.target.value)} className="h-8 text-xs" placeholder="Balance" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Materiality</label>
            <Input disabled={locked} value={data.materiality} onChange={e => setHeader("materiality", e.target.value)} className="h-8 text-xs" placeholder="Materiality amount" />
          </div>
        </div>
      </WorksheetSection>

      <WorksheetSection title="Audit Procedures" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[140px]">Nature</th>
                <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[150px]">Type</th>
                <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[300px]">Description</th>
                <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[300px]">Comments</th>
                <th className="text-center px-3 py-2.5 font-medium border-b border-border w-[80px]">W/P Ref</th>
                <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[120px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.sections.map((s, si) => (
                <Fragment key={`section-${si}`}>
                  <tr className="bg-primary/[0.06]">
                    <td colSpan={6} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-primary border-b border-border">{s.title}</td>
                  </tr>
                  {s.rows.map(r => (
                    <tr key={r.id} className="hover:bg-muted/20">
                      <td className={td}>
                        <Select disabled={locked} value={r.nature} onValueChange={v => setRowField(si, r.id, "nature", v)}>
                          <SelectTrigger className="h-8 text-xs min-w-0"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Required" className="text-xs">Required</SelectItem>
                            <SelectItem value="Optional" className="text-xs">Optional</SelectItem>
                            <SelectItem value="Additional Procedure" className="text-xs">Additional Procedure</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className={td}>
                        <Select disabled={locked} value={r.type} onValueChange={v => setRowField(si, r.id, "type", v)}>
                          <SelectTrigger className="h-8 text-xs min-w-0"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inquiries" className="text-xs">Inquiries</SelectItem>
                            <SelectItem value="Analytics" className="text-xs">Analytics</SelectItem>
                            <SelectItem value="Observation" className="text-xs">Observation</SelectItem>
                            <SelectItem value="Inspection" className="text-xs">Inspection</SelectItem>
                            <SelectItem value="Recalculation" className="text-xs">Recalculation</SelectItem>
                            <SelectItem value="Other" className="text-xs">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className={td}><span className="block whitespace-pre-wrap leading-snug">{r.description}</span></td>
                      <td className={td}>
                        <Textarea
                          disabled={locked}
                          value={r.comments}
                          onChange={e => setRowField(si, r.id, "comments", e.target.value)}
                          className="min-h-[56px] text-xs resize-none"
                          placeholder="—"
                        />
                      </td>
                      <td className={`${td} text-center`}>
                        <RefButton
                          reference={r.wpRef}
                          disabled={locked}
                          onAttach={doc => setRowField(si, r.id, "wpRef", [...r.wpRef, doc])}
                          onRemove={idx => setRowField(si, r.id, "wpRef", r.wpRef.filter((_, j) => j !== (idx ?? -1)))}
                        />
                      </td>
                      <td className={td}>
                        <Select disabled={locked} value={r.status} onValueChange={v => setRowField(si, r.id, "status", v)}>
                          <SelectTrigger className="h-8 text-xs min-w-0"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Complete" className="text-xs">Complete</SelectItem>
                            <SelectItem value="N/A" className="text-xs">N/A</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </WorksheetSection>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn} onConclude={conclude} />
    </WorksheetLayout>
  );
}
