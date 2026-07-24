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

interface ARRow {
 id: string;
 nature: Nature;
 type: ProcType;
 description: string;
 comments: string;
 wpRef: RefDoc[];
}

interface ARSection {
 title: string;
 rows: ARRow[];
}

interface DataAR {
 auditProcedures: ARSection[];
 confirmationProcedures: ARSection[];
 concluded: boolean;
 concludedOn: string;
}

function mkRow(nature: Nature, type: ProcType, description: string): ARRow {
 return { id: Math.random().toString(36).slice(2, 11), nature, type, description, comments: "", wpRef: [] };
}

function buildDefault(): DataAR {
 return {
 auditProcedures: [
 {
 title: "BASIC",
 rows: [
 mkRow("Required", "Inspection", "Preparation — Obtain a detailed (and aged) listing of trade accounts and other accounts receivable at the period end."),
 mkRow("Required", "Inspection", "Preparation — Obtain an understanding of the standard terms of sale, revenue recognition and credit and collection policies."),
 mkRow("Required", "Inspection", "Finalize the audit plan — Review the assessed risks being addressed by this audit plan (by assertion) and ensure the planned procedures (including relevant procedures contained in other audit programs) provide an appropriate response."),
 mkRow("Required", "Inspection", "Finalize the audit plan — Review the identified estimates, and ensure that the planned procedures (including the relevant procedures) provide an appropriate response."),
 mkRow("Required", "Inspection", "Finalize the audit plan — Where necessary, add additional audit procedures, change existing procedures and eliminate redundant procedures."),
 mkRow("Required", "Analytics", "Analytical procedures — Accounts receivable balance compared to the previous period."),
 mkRow("Required", "Analytics", "Analytical procedures — Aging of accounts receivable by customer and aging category (e.g., current, 30-60, 60-90, etc.) compared to the previous period."),
 mkRow("Required", "Analytics", "Analytical procedures — Number of days' sales in accounts receivable compared to the previous period."),
 mkRow("Required", "Analytics", "Analytical procedures — Credit balances in accounts receivable."),
 mkRow("Optional", "Analytics", "Analytical procedures — Other unexpected variations (explain)."),
 mkRow("Optional", "Analytics", "Analytical procedures — Other (non-trade receivables)."),
 mkRow("Required", "Inquiries", "Accounting policies — Have there been any changes to accounting policies affecting accounts receivable balances for this period? If so, describe the reasons why."),
 mkRow("Required", "Inspection", "Accounting policies — Ensure the accounting policies in use are appropriate and consistently applied."),
 ],
 },
 {
 title: "COMPLETENESS",
 rows: [
 mkRow("Required", "Inquiries", "Unrecorded or missing receivables — Identify personnel responsible for, or familiar with, accounts receivables and ask whether they are aware of any unrecorded or missing receivables as a result of: Inconsistent application of accounting policies. Sales in the current period being recorded in a subsequent period. Unusual journal entries. Unrecorded receivables with related parties or other customers."),
 mkRow("Required", "Inspection", "Subsequent receipts testing — Based on the assessment of the risks of material misstatement (fraud and error), obtain a listing of invoices paid after the period end to the date of the auditor's report to see if any goods or services should have been recognized in revenue in the period currently being audited. Document and resolve any exceptions."),
 mkRow("Required", "Inspection", "Coordination with revenue testing — Consider the impact of the audit procedures planned for the revenue cycle to ensure the procedures are sufficient to address revenue completeness."),
 mkRow("Optional", "", "Risk-specific procedures — Insert procedures as required."),
 mkRow("Optional", "", "Substantive analytical procedures — Insert procedures as required."),
 mkRow("Optional", "Inspection", "Sampling procedures — Tests of details: i. Obtain a listing of sales invoices paid after the period end. ii. Review the listing for large or unusual amounts. iii. Select a sample of paid sales invoices in addition to material invoices paid subsequent to period end. iv. Review the shipping/transaction date to see if goods or services have been recognized in the appropriate period. v. Review the sales journal or accounts receivable listing to ensure the amount was recorded in revenue."),
 mkRow("Optional", "Inspection", "Sampling procedures — Tests of controls: Select a sample of _______ and ensure ________."),
 ],
 },
 {
 title: "ACCURACY / VALUATION",
 rows: [
 mkRow("Required", "Recalculation", "Accuracy of listing and aging — Check arithmetic accuracy of the accounts receivable listing (adds and cross-adds) and agree to the general ledger balance."),
 mkRow("Required", "Inspection", "Accuracy of listing and aging — Based on the assessment of the risks of material misstatement, consider testing the accuracy of the aged accounts receivable listing."),
 mkRow("Required", "Inspection", "Classification — Investigate and document the reasons for material credit balances in accounts receivable. Consider confirmation and reclassification to accounts payable. Where the entity has significant unapplied payments, consider the impact on the A/R aging and risk of fraud or error, and consider whether additional audit procedures are necessary."),
 mkRow("Required", "Inspection", "Cut-off — Document the entity's procedures to ensure accounts receivable balances are recorded in the correct accounting period at period end."),
 mkRow("Required", "Inspection", "Cut-off — Select sales invoices, both before and after the period end, and ensure the transactions were recorded in the appropriate period. (In determining the extent of this procedure, consider the work performed in other parts of the transaction stream, such as revenue/receivables/receipts.)"),
 mkRow("Required", "Inspection", "Component entities and related parties — Document transactions and ending balances with component entities or related parties. Review the detailed accounts receivable sub-ledger to ensure all related parties have been identified."),
 mkRow("Required", "Inspection", "Allowance for doubtful accounts — a. Review the aged accounts receivable trial balance and compare it to the preceding year or periods. Review the payments received subsequent to period end."),
 mkRow("Required", "Inspection", "Allowance for doubtful accounts — b. For all significant or material accounts over 90 days that have not been paid subsequent to period end, obtain the invoice date to determine exactly how old the invoice is. Obtain documentation for each invoice supporting when the good was shipped or service was provided."),
 mkRow("Required", "Inspection", "Allowance for doubtful accounts — c. Review any analysis or assumptions used in preparing the allowance for doubtful accounts provision, and agree the amount to the general ledger. Note any changes in the assumptions or methodology used in calculating the allowance."),
 mkRow("Required", "Inspection", "Allowance for doubtful accounts — d. Agree bad debt expenses and related bad debt write-offs to supporting documentation (e.g., letter from trustees in bankruptcy), and ensure proper approval of write-offs."),
 mkRow("Required", "Inquiries", "Allowance for doubtful accounts — e. Discuss with management key assumptions used in preparing the allowance. Document results of the conversation, including the individuals interviewed and the date."),
 mkRow("Required", "Inspection", "Translation — Ensure all account balances are translated into Canadian funds at the period-end exchange rate."),
 mkRow("Optional", "", "Risk-specific procedures — Insert procedures as required."),
 mkRow("Optional", "", "Substantive analytical procedures — Insert procedures as required."),
 mkRow("Optional", "Inspection", "Sampling procedures — Tests of details: Select a sample of accounts receivable invoices. Review the invoice date, balance, etc., and calculate the number of days the invoice is outstanding since the period end. Ensure the classification of the invoice on the aging is appropriate and the invoice details match what is on the listing."),
 mkRow("Optional", "Inspection", "Sampling procedures — Tests of controls: Select a sample of _______ and ensure ________."),
 ],
 },
 {
 title: "EXISTENCE",
 rows: [
 mkRow("Required", "Inquiries", "Invalid receivables — Identify personnel responsible for, or familiar with, accounts receivables and ask whether they are aware of any recorded receivables that are invalid as a result of: Inconsistent application of accounting policies. Sales from a subsequent period being recorded in the current period. Sales to related parties or others in the current period that were returned after period end."),
 mkRow("Required", "Inspection", "Unusual or large balances — Review the composition of the sub-ledger balances, and look for unusual items (e.g., even dollar amounts, unapplied payments, unusual entity names and known related parties, and foreign suppliers). Identify and document how unusual items and exceptions were investigated."),
 mkRow("Required", "Inspection", "Validation of accounts receivable — Determine what (if any) accounts receivable balances to confirm or whether alternative procedures would be sufficient. Consider: nature and composition of accounts receivable, significant balances, related parties, previous confirmation response rates, length of time between the period end and the field work."),
 mkRow("Required", "Inspection", "Validation — Confirmation: Where confirmations are deemed to be effective (based on the assessment of risks of material misstatement), perform the procedures outlined in Form C.110."),
 mkRow("Required", "Inspection", "Validation — Confirmations unlikely to be effective: Select a sample of accounts receivable invoices or balances. Agree the invoices or balances to supporting documentation (such as packing slip and shipping advice)."),
 mkRow("Required", "Inspection", "Validation — Alternative to confirmation: Where a significant amount of time has elapsed since the period end, consider extending the testing of subsequent receipts instead of confirming accounts receivable."),
 mkRow("Required", "Inspection", "Coordination with revenue testing — Consider the impact of the audit procedures planned for the revenue cycle to ensure the procedures are sufficient to address revenue existence and accuracy."),
 mkRow("Optional", "", "Risk-specific procedures — Insert procedures as required."),
 mkRow("Optional", "", "Substantive analytical procedures — Insert procedures as required."),
 mkRow("Optional", "Inspection", "Sampling procedures — Tests of details: Confirmations — Select a sample of accounts receivable for confirmation. Document how the sample was selected (i.e., level of assurance required) and how the items were selected (i.e., judgmental or using monetary unit sampling). Perform the procedures outlined in Form C.110."),
 mkRow("Optional", "Inspection", "Sampling procedures — Tests of controls: Select a sample of _______ and ensure _______."),
 ],
 },
 {
 title: "PRESENTATION",
 rows: [
 mkRow("Required", "Inspection", "Classification — Have the balances been appropriately classified, aggregated or disaggregated and characterized in accordance with the applicable financial reporting framework?"),
 mkRow("Required", "Inspection", "Disclosures — Do the notes to the financial statements include disclosures required by the applicable financial reporting framework?"),
 mkRow("Required", "Inspection", "Relevant information — Has the overall presentation of the financial statements been undermined by including information that is not relevant or that obscures a proper understanding of the matters disclosed?"),
 ],
 },
 {
 title: "OTHER",
 rows: [
 mkRow("Optional", "", "Other procedures (specify)"),
 ],
 },
 ],
 confirmationProcedures: [
 {
 title: "CONFIRMATION PROCEDURES",
 rows: [
 mkRow("Required", "Inspection", "Obtain a copy of the accounts receivable sub-ledger/trial balance as at the confirmation date — a. Agree the balances to general ledger."),
 mkRow("Required", "Inspection", "Obtain a copy of the accounts receivable sub-ledger — b. Identify the large and unusual items."),
 mkRow("Required", "Inspection", "Obtain a copy of the accounts receivable sub-ledger — c. Select a sample of accounts receivable invoices or balances for confirmation including the large and unusual items."),
 mkRow("Required", "Inspection", "Obtain a copy of the accounts receivable sub-ledger — d. Document how the sample of accounts receivable was chosen (i.e., judgmental or using monetary unit sampling). Include the desired percentage of coverage, starting point and intervals."),
 mkRow("Optional", "Inspection", "Obtain a copy of the accounts receivable sub-ledger — e. Where a fraud risk exists or where confirmations will be sent by fax, consider agreeing names and addresses on confirmations on a test basis to telephone directories or trade publications to ensure accounts are not fictitious."),
 mkRow("Required", "Inquiries", "Management refusal — Where management refuses to allow the auditor to send a confirmation request(s): obtain explanations for management's refusal, obtain audit evidence as to their validity, and determine what alternative procedures can be performed."),
 mkRow("Required", "Inspection", "Prepare the confirmation requests and maintain control over the requests until they are mailed."),
 mkRow("Required", "Inspection", "Second request — After _____ days, with no reply received, mail a second request."),
 mkRow("Required", "Inspection", "Differences — When confirmation replies indicate that a difference exists: ask management for assistance in reconciling the differences, and assess whether the explanations provided are satisfactory."),
 mkRow("Required", "Inspection", "Alternative procedures — Where confirmations are not returned or results are not satisfactory, perform alternative auditing procedures: a. Agree subsequent payments to the account and to duplicate deposit slips. b. Agree shipping records and sales invoices to the account. c. Examine other supporting documentation. d. Consider whether the test results may be indicative of a previously unidentified fraud risk."),
 mkRow("Required", "Inspection", "Complete confirmation statistics summary and determine whether the test objectives have been met."),
 mkRow("Required", "Inspection", "Ensure that auditing procedures in related areas (e.g., sales, receipts, etc.) are coordinated where necessary."),
 ],
 },
 ],
 concluded: false,
 concludedOn: "",
 };
}

type DocKey = "auditProcedures" | "confirmationProcedures";

type RowSetter = (docKey: DocKey, sectionIdx: number, rowId: string, field: keyof ARRow, value: string | RefDoc[]) => void;

const TD = "border-b border-border px-3 py-2.5 text-xs align-top";

function ProcTable({ docKey, sections, locked, onRowField }: {
 docKey: DocKey;
 sections: ARSection[];
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
 <span className="text-sm text-muted-foreground px-1">—</span>
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

function useARStore() {
 const { engagementId } = useParams<{ engagementId: string }>();
 const storageKey = `audit-ar-v1-${engagementId ?? "global"}`;

 const [data, setData] = useState<DataAR>(() =>
 readJsonFromLocalStorage<DataAR>(storageKey, buildDefault()) ?? buildDefault()
 );

 const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const first = useRef(true);
 useEffect(() => {
 if (first.current) { first.current = false; return; }
 if (saveTimer.current) clearTimeout(saveTimer.current);
 saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 500);
 return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
 }, [data, storageKey]);

 function handleRowField(docKey: DocKey, sectionIdx: number, rowId: string, field: keyof ARRow, value: string | RefDoc[]) {
 setData(d => ({
...d,
 [docKey]: (d[docKey] as ARSection[]).map((s, si) =>
 si !== sectionIdx ? s : {
...s,
 rows: s.rows.map(r => r.id !== rowId ? r : {...r, [field]: value }),
 }
 ),
 }));
 }

 function addRow(docKey: DocKey, sectionIdx: number) {
 setData(d => ({
...d,
 [docKey]: (d[docKey] as ARSection[]).map((s, si) =>
 si !== sectionIdx ? s : {...s, rows: [...s.rows, mkRow("Optional", "", "")] }
 ),
 }));
 }

 function conclude() {
 setData(d => ({...d, concluded: true, concludedOn: new Date().toISOString() }));
 }
 function reopen() {
 setData(d => ({...d, concluded: false, concludedOn: "" }));
 }

 return { data, locked: data.concluded, handleRowField, addRow, conclude, reopen };
}

const INFO_CARD = "bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden p-6";

function ARInfoBlock() {
 return (
 <div className={INFO_CARD}>
 <div className="grid grid-cols-3 gap-4">
 <div>
 <label className="text-xs font-medium text-muted-foreground mb-1 block">LS Name</label>
 <Select disabled value="Accounts Receivable">
 <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
 <SelectContent>
 <SelectItem value="Accounts Receivable" className="text-xs">Accounts Receivable</SelectItem>
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
 );
}

export function AuditARWorksheet() {
 const { data, locked, handleRowField, addRow, conclude, reopen } = useARStore();
 return (
 <WorksheetLayout
 heading="B Accounts Receivable > Audit Procedures"
 onAdd={locked ? undefined : () => addRow("auditProcedures", 5)}
 objective="To respond appropriately to assessed risks at the assertion level through the design and performance of further audit procedures for accounts receivable, trade and other."
 >
 <ARInfoBlock />

 <WorksheetSection title="Audit Procedures" bodyClassName="p-0">
 <ProcTable docKey="auditProcedures" sections={data.auditProcedures} locked={locked} onRowField={handleRowField} />
 </WorksheetSection>

 <ConcludeBar worksheetKey="audit-ar" engagementId={engagementId} concluded={data.concluded} concludedOn={data.concludedOn} onConclude={conclude} onReopen={reopen} />
 </WorksheetLayout>
 );
}

export function AuditARConfirmationWorksheet() {
 const { data, locked, handleRowField, addRow, conclude, reopen } = useARStore();
 return (
 <WorksheetLayout
 heading="B Accounts Receivable > Confirmation Procedures"
 onAdd={locked ? undefined : () => addRow("confirmationProcedures", 0)}
 objective="Perform accounts receivable confirmation procedures to obtain sufficient appropriate audit evidence regarding the existence and accuracy of recorded receivable balances."
 >
 <ARInfoBlock />

 <WorksheetSection title="C.110 · Confirmation Supplementary Procedures" bodyClassName="p-0">
 <ProcTable docKey="confirmationProcedures" sections={data.confirmationProcedures} locked={locked} onRowField={handleRowField} />
 </WorksheetSection>

 <ConcludeBar worksheetKey="audit-ar" engagementId={engagementId} concluded={data.concluded} concludedOn={data.concludedOn} onConclude={conclude} onReopen={reopen} />
 </WorksheetLayout>
 );
}
