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
          mkRow("Required", "Inspection",
            "1. Preparation (Part 2 - A)\na. Obtain details of cash and bank balances at the period end and agree it to the general ledger.\nb. Obtain details of, and document, any covenants, withdrawal restrictions or minimum balance requirements regarding the use or withdrawal of cash and cash equivalents."),
          mkRow("Required", "Inspection",
            "2. Finalize the audit plan (Part 2 - A)\na. Review the assessed risks being addressed by this audit plan (by assertion) and ensure the planned procedures (including relevant procedures contained in other audit programs) provide an appropriate response.\nb. Review the identified estimates (Form 513), and ensure that the planned procedures (including the relevant procedures on Form 635) provide an appropriate response.\nc. Where necessary, add additional audit procedures, change existing procedures and eliminate redundant procedures."),
          mkRow("Required", "Analytics",
            "3. Analytical procedures (Part 2 - A)\nDevelop and document expectations for cash balances based on information obtained from understanding the entity.\nInvestigate and document significant variances between the expectations developed and the actual cash balances. Address the following:\na. Cash and cash equivalents balance compared to the previous period.\nb. The reasonableness of interest paid/received on a month-to-month or quarterly basis."),
          mkRow("Required", "Inquiries",
            "4. Accounting policies (Part 2 - A)\na. Have there been any changes to accounting policies affecting cash balances for this period? If so, describe the reasons why.\nb. Ensure the accounting policies in use are appropriate and consistently applied."),
        ],
      },
      {
        title: "COMPLETENESS",
        rows: [
          mkRow("Required", "Inquiries",
            "1. Unrecorded cash and bank accounts (Part 2 - A)\na. Ask personnel familiar with or handling cash transactions whether they are aware of any cash balances or bank accounts that are not recorded in the accounting records.\nb. Review correspondence or other evidence available to ensure that accounts used in previous periods have indeed been closed."),
          mkRow("Required", "Inquiries",
            "2. Unrecorded cash transactions (Part 2 - A)\na. Ask personnel familiar with or handling cash transactions whether they are aware of any unrecorded cash transfers, receipts or expenditures (such as cash in unrecorded loan, cash in transit or cash held in a safe).\nb. Based on our understanding of the entity and assessment of risks, design risk-specific procedures (as necessary) to respond to the potential for unrecorded cash transactions as a result of fraud."),
          mkRow("Required", "Inquiries",
            "3. Significant cash transactions (Part 2 - A)\nIdentify the nature and extent of cash transactions (cash deposits and payments) through inquiry, review of cash deposits, cash disbursements and any cheques made out to cash. If cash transactions are significant:\na. Count the material cash funds or undeposited receipts at, or close to, period end (Form A.115). If counting is not possible, examine other evidence (such as deposits, invoices or vouchers) in the subsequent period to validate the existence of the cash balance at period end.\nb. Understand the rationale for the extent of such transactions and ensure they were properly authorized."),
          mkRow("Optional", "",
            "4. Risk-specific procedures (Part 2 - B)\nInsert procedures as required."),
          mkRow("Optional", "Analytics",
            "5. Substantive analytical procedures (Part 2 - C)\nInsert procedures as required."),
          mkRow("Optional", "",
            "6. Sampling procedures (Part 2 - D)\na. Tests of details (Form 610)\nb. Tests of controls (Where appropriate - Form 615)\nSelect a sample of _______ and ensure ________"),
        ],
      },
      {
        title: "ACCURACY / VALUATION",
        rows: [
          mkRow("Required", "Inspection",
            "1. Bank reconciliations (Part 2 - A)\nObtain copies of the bank reconciliations at period end and:\na. Review the reconciliations for accuracy and agree balances to bank statements and the accounting records.\nb. Ensure there are no stale-dated cheques included.\nc. Obtain explanations for very large, any old or unusual items.\nAlso consider the procedures on Form A.110."),
          mkRow("Required", "Inquiries",
            "2. Compliance with agreements and restrictions (Part 2 - A)\na. Review compliance with any bank covenants, withdrawal restrictions or minimum balance requirements during the period.\nb. Document any violations and plans (if any) for their resolution. Also consider the impact on the entity (i.e., going concern), the need for note disclosure and the need to confirm management representations received directly with the lending institution."),
          mkRow("Required", "Inspection",
            "3. Classification (Part 2 - A)\nEnsure that cheques prepared but unissued at the period end are reclassified (if material) as accounts payable, rather than outstanding cheques, for financial statement purposes."),
          mkRow("Required", "Inspection",
            "4. Cut-off (Part 2 - A)\na. Document the entity's procedures to ensure cash receipts and disbursements are recorded in the correct accounting period.\nb. Select _____ cash receipts and ___cash disbursements, both before and after the period end, and ensure the transactions were recorded in the appropriate period.\n(In determining the extent of this procedure, consider the work performed in other parts of the transaction stream.)"),
          mkRow("Required", "Inspection",
            "5. Bank transfers (Part 2 - A)\nIdentify and document transfers between bank accounts, including those with branches or component entities, for five days before and after period end. Ensure both sides of these transfers have been recorded on the same day. (If a transfer appears as an outstanding cheque in one component, it would be an outstanding deposit in the other component.)"),
          mkRow("Required", "Inspection",
            "6. Translation (Part 2 - A)\nEnsure all cash and bank balances in other currencies have been translated into Canadian funds at the appropriate period-end exchange rate."),
          mkRow("Optional", "",
            "7. Risk-specific procedures (Part 2 - B)\nInsert procedures as required."),
          mkRow("Optional", "Analytics",
            "8. Substantive analytical procedures (Part 2 - C)\nInsert procedures as required."),
          mkRow("Optional", "",
            "9. Sampling procedures (Part 2 - D)\na. Tests of details (Form 610)\nb. Tests of controls (Where appropriate - Form 615)\nSelect a sample of _______ and ensure ________"),
        ],
      },
      {
        title: "EXISTENCE",
        rows: [
          mkRow("Required", "Inquiries",
            "1. Validity (Part 2 - A)\nSelect bank accounts to confirm the period-end balance directly with the bank. Consider size of balance, number of transactions and any fraud risk identified.\nSend out bank confirmation for all accounts selected in Point a above, and agree details to the bank reconciliations.\nEnsure control of the confirmation process is maintained and verify confirmation details (e.g., contact name, address and fax number).\nFor accounts not confirmed, perform alternative procedures (such as reviewing copies of bank statements, correspondence, cheques and deposits).\nCount any material cash balances."),
          mkRow("Optional", "",
            "2. Risk-specific procedures (Part 2 - B)\nInsert procedures as required."),
          mkRow("Optional", "Analytics",
            "3. Substantive analytical procedures (Part 2 - C)\nInsert procedures as required."),
          mkRow("Optional", "",
            "4. Sampling procedures (Part 2 - D)\nTests of details (Form 610)\nTests of controls (Where appropriate - Form 615)\nSelect a sample of _______ and ensure _______"),
        ],
      },
      {
        title: "PRESENTATION",
        rows: [
          mkRow("Required", "Inspection",
            "Classification\nHave the balances been appropriately classified, aggregated or disaggregated and characterized in accordance with the applicable financial reporting framework?"),
          mkRow("Required", "Inspection",
            "Disclosures\nDo the notes to the financial statements include disclosures required by the applicable financial reporting framework? (See FRF 900 series of forms for additional guidance.)"),
          mkRow("Required", "Inspection",
            "Relevant information\nHas the overall presentation of the financial statements been undermined by including information that is not relevant or that obscures a proper understanding of the matters disclosed?"),
        ],
      },
      {
        title: "OTHER",
        rows: [
          mkRow("Optional", "",
            "Other procedures (specify)"),
        ],
      },
      {
        title: "AUDIT PLAN COMPLETION",
        rows: [
          mkRow("Required", "",
            "1. An appropriate level of professional skepticism was used in evaluating audit evidence obtained."),
          mkRow("Required", "Inquiries",
            "2. Evaluate whether any of management's judgments or decisions (either individually or as a whole) are indicators of possible management bias.\nWhere indicators of possible management bias are identified, record the risk on Form 520 and evaluate the implications for the audit."),
          mkRow("Required", "",
            "3. Misstatements identified (other than those deemed trivial) have been recorded on Form 335 or equivalent."),
          mkRow("Required", "",
            "4. New risk factors identified (and revised assessments of existing risks) were documented, assessed (such as on Forms 520 or 590) and addressed through the procedures performed above."),
        ],
      },
      {
        title: "AUDIT CONCLUSIONS",
        rows: [
          mkRow("Required", "",
            "The audit evidence obtained is sufficient and appropriate to reduce the risk of material misstatement to an acceptably low level."),
        ],
      },
    ],

    cashCountProcedures: [
      {
        title: "CASH ON HAND",
        rows: [
          mkRow("Required", "Observation",
            "1. Cash on hand\na. Identify the sources of cash that are or should be on the entity's premises, in transit or at other locations. Also consider any fraud risk identified that could affect cash balances.\nb. Determine what cash funds should be counted. Consider performing some counts on a surprise basis."),
        ],
      },
      {
        title: "CASH COUNTS",
        rows: [
          mkRow("Required", "Observation",
            "2. Cash counts\na. For funds selected to be counted, ensure the count is performed in the presence of the custodian who should be asked to sign a representation that \"cash funds of $                     were counted in my presence and returned to me intact on (insert date).\"\nb. Obtain explanations for any differences between cash counted and the accounting records.\nc. Inquire into and obtain explanations for any unusual items, such as older documents, IOUs and expenses that do not appear to be in the normal course of business.\nd. Record details of the last cash sales/cheques at period end (particularly if large) and ensure they were properly recorded in the accounting records and in the correct period."),
        ],
      },
      {
        title: "FOLLOW UP",
        rows: [
          mkRow("Required", "Inspection",
            "3. Follow up the cash counts by:\na. Tracing large undeposited receipts to bank deposits and the bank statement.\nb. Investigating any cheques subsequently dishonoured."),
        ],
      },
    ],

    bankRecProcedures: [
      {
        title: "BANK RECONCILIATION",
        rows: [
          mkRow("Required", "Inspection",
            "1. Obtain copies of the bank reconciliations and agree the details to:\na. Bank confirmations.\nb. Bank statement.\nc. General ledger.\nd. Supporting detail (e.g., list of outstanding cheques)."),
          mkRow("Required", "Recalculation",
            "2. Check the arithmetic accuracy of the bank reconciliation."),
          mkRow("Required", "Inspection",
            "3. Obtain directly from the bank, a copy of the bank statement (or an \"on line\" bank statement) for an immediate period (e.g., two weeks or one month) subsequent to the period-end date.\na. Agree a sample of cheques dated prior to or as at period-end date to the list of outstanding cheques and cash disbursements journal. Investigate reasons for any cheques returned but not listed as outstanding.\nb. Agree a sample of deposits on bank statement to list of outstanding deposits. Compare date of deposit noted in the books with date entered in the bank statement. Investigate unusual time delays.\nc. Examine bank debit and credit notes. Ensure that these notes have been properly recorded in the cash journals in the appropriate period.\nd. Agree opening bank statement balance to bank reconciliation.\ne. Scrutinize a sample of cheques for authorized signatures and proper endorsement. Investigate alterations and propriety of cheques made to cash or entity officials.\nf. Inquire about the reason for large, unusual or stale-dated outstanding cheques that have not been returned by the bank. Agree such cheques to original supporting documentation (e.g., purchase invoices). Recommend reversal of long-outstanding cheques. If an adequate explanation is not received, record details on Form 330 for further consideration."),
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

  function conclude() {
    setData(d => ({
      ...d,
      concluded: true,
      concludedOn: new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" }),
    }));
  }

  return { data, locked: data.concluded, setHeader, handleRowField, conclude };
}

export function AuditCashWorksheet() {
  const { data, locked, setHeader, handleRowField, conclude } = useCashStore();
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
        <ProcTable docKey="auditProcedures" sections={data.auditProcedures} locked={locked} onRowField={handleRowField} />
      </WorksheetSection>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn} onConclude={conclude} />
    </WorksheetLayout>
  );
}

export function AuditCashBankRecWorksheet() {
  const { data, locked, handleRowField, conclude } = useCashStore();
  return (
    <WorksheetLayout objective="Perform bank reconciliation procedures to verify that the bank statement balances agree to the general ledger and that reconciling items are valid and properly recorded.">
      <WorksheetSection title="A.110 · Bank Reconciliation Procedures" bodyClassName="p-0">
        <ProcTable docKey="bankRecProcedures" sections={data.bankRecProcedures} locked={locked} onRowField={handleRowField} />
      </WorksheetSection>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn} onConclude={conclude} />
    </WorksheetLayout>
  );
}

export function AuditCashCountWorksheet() {
  const { data, locked, handleRowField, conclude } = useCashStore();
  return (
    <WorksheetLayout objective="Count cash on hand to verify existence and completeness of cash balances at the period end date.">
      <WorksheetSection title="A.115 · Cash Count Procedures" bodyClassName="p-0">
        <ProcTable docKey="cashCountProcedures" sections={data.cashCountProcedures} locked={locked} onRowField={handleRowField} />
      </WorksheetSection>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn} onConclude={conclude} />
    </WorksheetLayout>
  );
}
