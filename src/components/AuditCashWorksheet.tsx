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
  auditProcedures: CashSection[];
  cashCountProcedures: CashSection[];
  bankRecProcedures: CashSection[];
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

    auditProcedures: [
      {
        title: "BASIC",
        rows: [
          mkRow("Required", "Inspection", "Preparation — Obtain details of cash and bank balances at the period end and agree it to the general ledger."),
          mkRow("Required", "Inspection", "Preparation — Obtain details of, and document, any covenants, withdrawal restrictions or minimum balance requirements regarding the use or withdrawal of cash and cash equivalents."),
          mkRow("Required", "Inspection", "Finalize the audit plan — Review the assessed risks being addressed by this audit plan (by assertion) and ensure the planned procedures (including relevant procedures contained in other audit programs) provide an appropriate response."),
          mkRow("Required", "Inspection", "Finalize the audit plan — Review the identified estimates (Form 513), and ensure that the planned procedures (including the relevant procedures on Form 635) provide an appropriate response."),
          mkRow("Required", "Inspection", "Finalize the audit plan — Where necessary, add additional audit procedures, change existing procedures and eliminate redundant procedures."),
          mkRow("Required", "Analytics", "Analytical procedures — Develop and document expectations for cash balances based on information obtained from understanding the entity. Investigate and document significant variances between the expectations developed and the actual cash balances."),
          mkRow("Required", "Analytics", "Analytical procedures — Cash and cash equivalents balance compared to the previous period."),
          mkRow("Required", "Analytics", "Analytical procedures — The reasonableness of interest paid/received on a month-to-month or quarterly basis."),
          mkRow("Required", "Inquiries", "Accounting policies — Have there been any changes to accounting policies affecting cash balances for this period? If so, describe the reasons why."),
          mkRow("Required", "Inquiries", "Accounting policies — Ensure the accounting policies in use are appropriate and consistently applied."),
        ],
      },
      {
        title: "COMPLETENESS",
        rows: [
          mkRow("Required", "Inquiries", "Unrecorded cash and bank accounts — Ask personnel familiar with or handling cash transactions whether they are aware of any cash balances or bank accounts that are not recorded in the accounting records."),
          mkRow("Required", "Inquiries", "Unrecorded cash and bank accounts — Review correspondence or other evidence available to ensure that accounts used in previous periods have indeed been closed."),
          mkRow("Required", "Inquiries", "Unrecorded cash transactions — Ask personnel familiar with or handling cash transactions whether they are aware of any unrecorded cash transfers, receipts or expenditures (such as cash in unrecorded loan, cash in transit or cash held in a safe)."),
          mkRow("Required", "Inquiries", "Unrecorded cash transactions — Based on our understanding of the entity and assessment of risks, design risk-specific procedures (as necessary) to respond to the potential for unrecorded cash transactions as a result of fraud."),
          mkRow("Required", "Inquiries", "Significant cash transactions — Identify the nature and extent of cash transactions (cash deposits and payments) through inquiry, review of cash deposits, cash disbursements and any cheques made out to cash."),
          mkRow("Required", "Inquiries", "Significant cash transactions — Count the material cash funds or undeposited receipts at, or close to, period end (Form A.115). If counting is not possible, examine other evidence (such as deposits, invoices or vouchers) in the subsequent period to validate the existence of the cash balance at period end."),
          mkRow("Required", "Inquiries", "Significant cash transactions — Understand the rationale for the extent of such transactions and ensure they were properly authorized."),
          mkRow("Optional", "", "Risk-specific procedures — Insert procedures as required."),
          mkRow("Optional", "Analytics", "Substantive analytical procedures — Insert procedures as required."),
          mkRow("Optional", "", "Sampling procedures — Tests of details (Form 610). Tests of controls (Where appropriate - Form 615). Select a sample of _______ and ensure ________"),
        ],
      },
      {
        title: "ACCURACY / VALUATION",
        rows: [
          mkRow("Required", "Inspection", "Bank reconciliations — Review the reconciliations for accuracy and agree balances to bank statements and the accounting records."),
          mkRow("Required", "Inspection", "Bank reconciliations — Ensure there are no stale-dated cheques included."),
          mkRow("Required", "Inspection", "Bank reconciliations — Obtain explanations for very large, any old or unusual items. Also consider the procedures on Form A.110."),
          mkRow("Required", "Inquiries", "Compliance with agreements and restrictions — Review compliance with any bank covenants, withdrawal restrictions or minimum balance requirements during the period."),
          mkRow("Required", "Inquiries", "Compliance with agreements and restrictions — Document any violations and plans (if any) for their resolution. Also consider the impact on the entity (i.e., going concern), the need for note disclosure and the need to confirm management representations received directly with the lending institution."),
          mkRow("Required", "Inspection", "Classification — Ensure that cheques prepared but unissued at the period end are reclassified (if material) as accounts payable, rather than outstanding cheques, for financial statement purposes."),
          mkRow("Required", "Inspection", "Cut-off — Document the entity's procedures to ensure cash receipts and disbursements are recorded in the correct accounting period."),
          mkRow("Required", "Inspection", "Cut-off — Select cash receipts and cash disbursements, both before and after the period end, and ensure the transactions were recorded in the appropriate period. (In determining the extent of this procedure, consider the work performed in other parts of the transaction stream.)"),
          mkRow("Required", "Inspection", "Bank transfers — Identify and document transfers between bank accounts, including those with branches or component entities, for five days before and after period end. Ensure both sides of these transfers have been recorded on the same day."),
          mkRow("Required", "Inspection", "Translation — Ensure all cash and bank balances in other currencies have been translated into Canadian funds at the appropriate period-end exchange rate."),
          mkRow("Optional", "", "Risk-specific procedures — Insert procedures as required."),
          mkRow("Optional", "Analytics", "Substantive analytical procedures — Insert procedures as required."),
          mkRow("Optional", "", "Sampling procedures — Tests of details (Form 610). Tests of controls (Where appropriate - Form 615). Select a sample of _______ and ensure ________"),
        ],
      },
      {
        title: "EXISTENCE",
        rows: [
          mkRow("Required", "Inquiries", "Validity — Select bank accounts to confirm the period-end balance directly with the bank. Consider size of balance, number of transactions and any fraud risk identified."),
          mkRow("Required", "Inquiries", "Validity — Send out bank confirmation for all accounts selected and agree details to the bank reconciliations. Ensure control of the confirmation process is maintained and verify confirmation details (e.g., contact name, address and fax number)."),
          mkRow("Required", "Inquiries", "Validity — For accounts not confirmed, perform alternative procedures (such as reviewing copies of bank statements, correspondence, cheques and deposits). Count any material cash balances."),
          mkRow("Optional", "", "Risk-specific procedures — Insert procedures as required."),
          mkRow("Optional", "Analytics", "Substantive analytical procedures — Insert procedures as required."),
          mkRow("Optional", "", "Sampling procedures — Tests of details (Form 610). Tests of controls (Where appropriate - Form 615). Select a sample of _______ and ensure _______"),
        ],
      },
      {
        title: "PRESENTATION",
        rows: [
          mkRow("Required", "Inspection", "Classification — Have the balances been appropriately classified, aggregated or disaggregated and characterized in accordance with the applicable financial reporting framework?"),
          mkRow("Required", "Inspection", "Disclosures — Do the notes to the financial statements include disclosures required by the applicable financial reporting framework? (See FRF 900 series of forms for additional guidance.)"),
          mkRow("Required", "Inspection", "Relevant information — Has the overall presentation of the financial statements been undermined by including information that is not relevant or that obscures a proper understanding of the matters disclosed?"),
        ],
      },
      {
        title: "OTHER",
        rows: [
          mkRow("Optional", "", "Other procedures (specify)"),
        ],
      },
      {
        title: "AUDIT PLAN COMPLETION",
        rows: [
          mkRow("Required", "", "An appropriate level of professional skepticism was used in evaluating audit evidence obtained."),
          mkRow("Required", "Inquiries", "Management bias — Evaluate whether any of management's judgments or decisions (either individually or as a whole) are indicators of possible management bias. Where indicators of possible management bias are identified, record the risk on Form 520 and evaluate the implications for the audit."),
          mkRow("Required", "", "Misstatements identified (other than those deemed trivial) have been recorded on Form 335 or equivalent."),
          mkRow("Required", "", "New risk factors identified (and revised assessments of existing risks) were documented, assessed (such as on Forms 520 or 590) and addressed through the procedures performed above."),
        ],
      },
      {
        title: "AUDIT CONCLUSIONS",
        rows: [
          mkRow("Required", "", "The audit evidence obtained is sufficient and appropriate to reduce the risk of material misstatement to an acceptably low level."),
        ],
      },
    ],

    cashCountProcedures: [
      {
        title: "CASH ON HAND",
        rows: [
          mkRow("Required", "Observation", "Cash on hand — Identify the sources of cash that are or should be on the entity's premises, in transit or at other locations. Also consider any fraud risk identified that could affect cash balances."),
          mkRow("Required", "Observation", "Cash on hand — Determine what cash funds should be counted. Consider performing some counts on a surprise basis."),
        ],
      },
      {
        title: "CASH COUNTS",
        rows: [
          mkRow("Required", "Observation", "Cash counts — For funds selected to be counted, ensure the count is performed in the presence of the custodian who should be asked to sign a representation that \"cash funds of $ were counted in my presence and returned to me intact on (insert date).\""),
          mkRow("Required", "Observation", "Cash counts — Obtain explanations for any differences between cash counted and the accounting records."),
          mkRow("Required", "Observation", "Cash counts — Inquire into and obtain explanations for any unusual items, such as older documents, IOUs and expenses that do not appear to be in the normal course of business."),
          mkRow("Required", "Observation", "Cash counts — Record details of the last cash sales/cheques at period end (particularly if large) and ensure they were properly recorded in the accounting records and in the correct period."),
        ],
      },
      {
        title: "FOLLOW UP",
        rows: [
          mkRow("Required", "Inspection", "Follow up — Trace large undeposited receipts to bank deposits and the bank statement."),
          mkRow("Required", "Inspection", "Follow up — Investigate any cheques subsequently dishonoured."),
        ],
      },
    ],

    bankRecProcedures: [
      {
        title: "BANK RECONCILIATION",
        rows: [
          mkRow("Required", "Inspection", "Obtain copies of bank reconciliations — Agree the bank reconciliation details to bank confirmations."),
          mkRow("Required", "Inspection", "Obtain copies of bank reconciliations — Agree the bank reconciliation details to the bank statement."),
          mkRow("Required", "Inspection", "Obtain copies of bank reconciliations — Agree the bank reconciliation details to the general ledger."),
          mkRow("Required", "Inspection", "Obtain copies of bank reconciliations — Agree the bank reconciliation details to supporting detail (e.g., list of outstanding cheques)."),
          mkRow("Required", "Recalculation", "Arithmetic check — Check the arithmetic accuracy of the bank reconciliation."),
          mkRow("Required", "Inspection", "Subsequent bank statement — Obtain directly from the bank a copy of the bank statement (or an \"on line\" bank statement) for an immediate period (e.g., two weeks or one month) subsequent to the period-end date."),
          mkRow("Required", "Inspection", "Subsequent bank statement — Agree a sample of cheques dated prior to or as at period-end date to the list of outstanding cheques and cash disbursements journal. Investigate reasons for any cheques returned but not listed as outstanding."),
          mkRow("Required", "Inspection", "Subsequent bank statement — Agree a sample of deposits on bank statement to list of outstanding deposits. Compare date of deposit noted in the books with date entered in the bank statement. Investigate unusual time delays."),
          mkRow("Required", "Inspection", "Subsequent bank statement — Examine bank debit and credit notes. Ensure that these notes have been properly recorded in the cash journals in the appropriate period."),
          mkRow("Required", "Inspection", "Subsequent bank statement — Agree opening bank statement balance to bank reconciliation."),
          mkRow("Required", "Inspection", "Subsequent bank statement — Scrutinize a sample of cheques for authorized signatures and proper endorsement. Investigate alterations and propriety of cheques made to cash or entity officials."),
          mkRow("Required", "Inspection", "Subsequent bank statement — Inquire about the reason for large, unusual or stale-dated outstanding cheques that have not been returned by the bank. Agree such cheques to original supporting documentation (e.g., purchase invoices). Recommend reversal of long-outstanding cheques. If an adequate explanation is not received, record details on Form 330 for further consideration."),
        ],
      },
    ],

    concluded: false,
    concludedOn: "",
  };
}

type DocKey = "auditProcedures" | "cashCountProcedures" | "bankRecProcedures";

type RowSetter = (docKey: DocKey, sectionIdx: number, rowId: string, field: keyof CashRow, value: string | RefDoc[]) => void;

const TD = "border-b border-border px-3 py-2.5 text-xs align-top";

function ProcTable({ docKey, sections, locked, onRowField }: {
  docKey: DocKey;
  sections: CashSection[];
  locked: boolean;
  onRowField: RowSetter;
}) {
  return (
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
          {sections.map((s, si) => (
            <Fragment key={`${docKey}-s-${si}`}>
              <tr className="bg-primary/[0.06]">
                <td colSpan={6} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-primary border-b border-border">{s.title}</td>
              </tr>
              {s.rows.map(r => (
                <tr key={r.id} className="hover:bg-muted/20">
                  <td className={TD}>
                    <Select disabled={locked} value={r.nature} onValueChange={v => onRowField(docKey, si, r.id, "nature", v)}>
                      <SelectTrigger className="h-8 text-xs min-w-0"><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Required" className="text-xs">Required</SelectItem>
                        <SelectItem value="Optional" className="text-xs">Optional</SelectItem>
                        <SelectItem value="Additional Procedure" className="text-xs">Additional Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={TD}>
                    <Select disabled={locked} value={r.type} onValueChange={v => onRowField(docKey, si, r.id, "type", v)}>
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
                  <td className={TD}><span className="block whitespace-pre-wrap leading-snug">{r.description}</span></td>
                  <td className={TD}>
                    <Textarea
                      disabled={locked}
                      value={r.comments}
                      onChange={e => onRowField(docKey, si, r.id, "comments", e.target.value)}
                      className="min-h-[56px] text-xs resize-none"
                      placeholder="—"
                    />
                  </td>
                  <td className={`${TD} text-center`}>
                    <RefButton
                      reference={r.wpRef}
                      disabled={locked}
                      onAttach={doc => onRowField(docKey, si, r.id, "wpRef", [...r.wpRef, doc])}
                      onRemove={idx => onRowField(docKey, si, r.id, "wpRef", r.wpRef.filter((_, j) => j !== (idx ?? -1)))}
                    />
                  </td>
                  <td className={TD}>
                    <Select disabled={locked} value={r.status} onValueChange={v => onRowField(docKey, si, r.id, "status", v)}>
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
  );
}

function useCashStore() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-cash-v2-${engagementId ?? "global"}`;

  const [data, setData] = useState<DataCash>(() =>
    readJsonFromLocalStorage<DataCash>(storageKey, buildDefault()) ?? buildDefault()
  );

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  function setHeader(field: "lsName" | "lsAccountBalance" | "materiality", value: string) {
    setData(d => ({ ...d, [field]: value }));
  }

  const handleRowField: RowSetter = (docKey, sectionIdx, rowId, field, value) => {
    setData(d => ({
      ...d,
      [docKey]: (d[docKey] as CashSection[]).map((s, si) =>
        si !== sectionIdx ? s : {
          ...s,
          rows: s.rows.map(r => r.id !== rowId ? r : { ...r, [field]: value }),
        }
      ),
    }));
  };

  function addRow(docKey: DocKey, sectionIdx: number) {
    setData(d => ({
      ...d,
      [docKey]: (d[docKey] as CashSection[]).map((s, si) =>
        si !== sectionIdx ? s : { ...s, rows: [...s.rows, mkRow("Optional", "", "")] }
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

  return { data, locked: data.concluded, setHeader, handleRowField, addRow, conclude };
}

export function AuditCashWorksheet() {
  const { data, locked, setHeader, handleRowField, addRow, conclude } = useCashStore();
  return (
    <WorksheetLayout
      heading="A Cash > Audit Procedures"
      onAdd={locked ? undefined : () => addRow("auditProcedures", 5)}
      objective="Obtain sufficient appropriate audit evidence that cash and cash equivalents exist, are complete, are accurately valued, are properly classified, and are adequately disclosed in the financial statements."
    >
      <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden p-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">LS Name</label>
            <Select disabled value="Cash">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash" className="text-xs">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">LS Account Balance</label>
            <Input disabled value="" className="h-8 text-xs" placeholder="Automated" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Materiality</label>
            <Input disabled value="" className="h-8 text-xs" placeholder="Automated" />
          </div>
        </div>
      </div>

      <WorksheetSection title="Audit Procedures" bodyClassName="p-0">
        <ProcTable docKey="auditProcedures" sections={data.auditProcedures} locked={locked} onRowField={handleRowField} />
      </WorksheetSection>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn} onConclude={conclude} />
    </WorksheetLayout>
  );
}

export function AuditCashBankRecWorksheet() {
  const { data, locked, handleRowField, addRow, conclude } = useCashStore();
  return (
    <WorksheetLayout
      heading="A Cash > Bank Reconciliation"
      onAdd={locked ? undefined : () => addRow("bankRecProcedures", 0)}
      objective="Perform bank reconciliation procedures to verify that the bank statement balances agree to the general ledger and that reconciling items are valid and properly recorded."
    >
      <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden p-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">LS Name</label>
            <Select disabled value="Cash">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash" className="text-xs">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">LS Account Balance</label>
            <Input disabled value="" className="h-8 text-xs" placeholder="Automated" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Materiality</label>
            <Input disabled value="" className="h-8 text-xs" placeholder="Automated" />
          </div>
        </div>
      </div>

      <WorksheetSection title="A.110 · Bank Reconciliation Procedures" bodyClassName="p-0">
        <ProcTable docKey="bankRecProcedures" sections={data.bankRecProcedures} locked={locked} onRowField={handleRowField} />
      </WorksheetSection>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn} onConclude={conclude} />
    </WorksheetLayout>
  );
}

export function AuditCashCountWorksheet() {
  const { data, locked, handleRowField, addRow, conclude } = useCashStore();
  return (
    <WorksheetLayout
      heading="A Cash > Cash Count"
      onAdd={locked ? undefined : () => addRow("cashCountProcedures", 2)}
      objective="Count cash on hand to verify existence and completeness of cash balances at the period end date."
    >
      <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden p-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">LS Name</label>
            <Select disabled value="Cash">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash" className="text-xs">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">LS Account Balance</label>
            <Input disabled value="" className="h-8 text-xs" placeholder="Automated" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Materiality</label>
            <Input disabled value="" className="h-8 text-xs" placeholder="Automated" />
          </div>
        </div>
      </div>

      <WorksheetSection title="A.115 · Cash Count Procedures" bodyClassName="p-0">
        <ProcTable docKey="cashCountProcedures" sections={data.cashCountProcedures} locked={locked} onRowField={handleRowField} />
      </WorksheetSection>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn} onConclude={conclude} />
    </WorksheetLayout>
  );
}
