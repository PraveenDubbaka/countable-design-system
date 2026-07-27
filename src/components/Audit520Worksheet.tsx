import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AttributedComment } from "@/components/ui/AttributedComment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Info, BookOpen, X } from "lucide-react";
import { AutomationStateChip } from "@/components/demo/AutomationStateChip";
import { LukaStatusBar } from "@/components/demo/LukaStatusBar";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { cn } from "@/lib/utils";
import { buildAutoFillRows, mergeAutoFill } from "@/lib/audit520AutoFill";
import { WorksheetSignOff, ConcludedRow } from "@/components/WorksheetSignOff";

// ── Types ─────────────────────────────────────────────────────────────────────

type YN = "Y" | "N" | "";
type HML = "H" | "M" | "L" | "";

interface PartARow {
 id: string;
 wpRefSource: RefDoc[];
 rmmIdentified: string;
 fraudRisk: YN;
 rmmAssessment: HML;
 auditResponse: string;
 wpRef: RefDoc[];
}

interface PartBRow {
 id: string;
 wpRefSource: RefDoc[];
 rmmIdentified: string;
 scotabd: string;
 balanceValue: string;
 assertions: string[];
 irFactors: string;
 fraudRisk: YN;
 irLikelihood: HML;
 irMagnitude: HML;
 inherentRisk: HML;
 significantRisk: YN;
 substantiveSufficient: YN;
 procedures: string[];
}

interface Data520 {
 partARows: PartARow[];
 partBRows: PartBRow[];
 conclusion: string;
 concluded: boolean;
 concludedOn: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);
const HML_OPTIONS: HML[] = ["H", "M", "L"];
const YN_OPTIONS: YN[] = ["Y", "N"];
const ASSERTION_OPTIONS = ["C", "AV", "E", "P"] as const;

const SCOTABD_OPTIONS = [
 "Cash and cash equivalents",
 "Accounts receivable",
 "Inventories",
 "Short-term investments",
 "Loans and notes receivable",
 "Other current assets",
 "Property, plant and equipment",
 "Long-term investments",
 "Accounts payable",
 "Taxes payable",
 "Short-term debt",
 "Other long-term liabilities",
 "Long-term debt",
 "Equity",
 "Revenue",
 "Cost of sales",
 "Expenses",
 "Other expenses (income)",
 "Related-party transactions",
 "Disclosures",
];
interface RiskLibraryEntry {
 id: string;
 name: string;
 scotabd: string;
 assertions: string[];
 irFactors: string;
 procedures: string[];
}

const RISK_LIBRARY: RiskLibraryEntry[] = [
 {
 id: "mgmt-override",
 name: "Management override of controls",
 scotabd: "Revenue",
 assertions: ["C", "AV", "E"],
 irFactors: "Presumed fraud risk. Management is in a unique position to perpetuate fraud by overriding controls that otherwise appear to be operating effectively.",
 procedures: [
 "Test appropriateness of journal entries recorded in the general ledger, focusing on unusual, complex, or after-close entries.",
 "Review accounting estimates for management bias; evaluate whether the cumulative effect of estimates indicates a bias toward the desired outcome.",
 "Evaluate the business rationale for significant transactions outside the normal course of business.",
 "Test completeness of the journal entry population obtained from management.",
 ],
 },
 {
 id: "rev-cutoff",
 name: "Revenue recognition — incorrect cut-off at period-end",
 scotabd: "Revenue",
 assertions: ["C", "AV"],
 irFactors: "Revenue may be recognized in the wrong period due to timing differences at year-end. Risk is heightened for term contracts spanning the reporting date.",
 procedures: [
 "Obtain listing of revenue transactions recorded in the final 10 business days of the period and first 10 business days after period-end.",
 "Trace a sample to underlying contracts, invoices, and delivery/service completion evidence to verify the period of recognition.",
 "Reconcile revenue per the general ledger to the revenue listing and investigate significant variances.",
 "Test a sample of credit notes issued after period-end to identify reversals of improperly recognized revenue.",
 "Review manual and unusual journal entries posted to revenue accounts near year-end.",
 ],
 },
 {
 id: "rev-existence",
 name: "Revenue — fictitious or unsupported transactions",
 scotabd: "Revenue",
 assertions: ["E", "AV"],
 irFactors: "Risk of fictitious revenue recording, particularly for transactions with related parties, unusual customers, or performance-based arrangements.",
 procedures: [
 "Select a sample of revenue transactions and trace to executed contracts, invoices, and evidence of goods/services delivered.",
 "Confirm significant revenue transactions directly with customers.",
 "Perform analytical procedures comparing revenue by product/service line and period; investigate significant variances.",
 "Review material contracts for side agreements, return clauses, or contingencies that would preclude recognition.",
 ],
 },
 {
 id: "inv-overstatement",
 name: "Inventory — overstatement due to inadequate obsolescence provision",
 scotabd: "Inventories",
 assertions: ["AV", "E"],
 irFactors: "Inventory valuation requires management judgment in assessing slow-moving and obsolete stock. Provision calculations may not be systematically supported.",
 procedures: [
 "Attend the physical inventory count; observe procedures, perform test counts, and trace results to the final inventory listing.",
 "Test the mathematical accuracy of the inventory listing and agree the total to the general ledger.",
 "Test inventory unit costs by reference to recent supplier invoices and compare to standard costs.",
 "Obtain management's obsolescence provision schedule and test assumptions (aging thresholds, turnover rates).",
 "Identify slow-moving or zero-movement items and assess adequacy of the provision.",
 "Compare net realizable value to cost for a sample of inventory items.",
 ],
 },
 {
 id: "ar-collectibility",
 name: "Accounts receivable — collectibility (allowance for doubtful accounts)",
 scotabd: "Accounts receivable",
 assertions: ["AV"],
 irFactors: "Allowance for doubtful accounts requires estimation; management may be incentivized to understate the allowance to improve reported results.",
 procedures: [
 "Obtain the aged accounts receivable listing and agree the total to the general ledger.",
 "Review subsequent cash receipts to assess collectibility of amounts outstanding at period-end.",
 "Circularize (confirm) a sample of significant and/or unusual receivable balances.",
 "Evaluate the reasonableness of the allowance by comparing historical write-offs to prior provisions.",
 "Identify and investigate long-outstanding balances and assess the adequacy of provisions.",
 ],
 },
 {
 id: "ppe-valuation",
 name: "Property, plant and equipment — overstatement or impairment",
 scotabd: "Property, plant and equipment",
 assertions: ["AV", "E"],
 irFactors: "PPE balances may be overstated through improper capitalization of repairs/maintenance or inadequate impairment assessment.",
 procedures: [
 "Agree the PPE continuity schedule to prior period and trace additions, disposals, and ending balances to the general ledger.",
 "Test a sample of current-period additions to supporting documentation and verify proper capitalization criteria are met.",
 "Test a sample of repairs and maintenance expense items to confirm they are not capital in nature.",
 "Review disposals for completeness; trace proceeds and removal of net book value.",
 "Assess depreciation rates and methods for reasonableness; recalculate depreciation for a sample of assets.",
 "Evaluate whether indicators of impairment exist and review management's impairment assessment.",
 ],
 },
 {
 id: "ap-completeness",
 name: "Accounts payable — understatement (unrecorded liabilities)",
 scotabd: "Accounts payable",
 assertions: ["C"],
 irFactors: "Management may have an incentive to understate liabilities. Cut-off errors may result in payables being recorded in the subsequent period.",
 procedures: [
 "Perform a search for unrecorded liabilities: review subsequent disbursements and invoices received after period-end for goods received before year-end.",
 "Circularize (confirm) significant vendor balances.",
 "Reconcile supplier statements to the accounts payable listing for significant vendors.",
 "Test cut-off by reviewing purchases recorded in the final days of the period and first days of the subsequent period.",
 ],
 },
 {
 id: "related-party",
 name: "Related-party transactions — incomplete or non-arm's-length",
 scotabd: "Related-party transactions",
 assertions: ["C", "AV"],
 irFactors: "In owner-managed entities, undisclosed related-party transactions and non-arm's-length pricing are a significant risk. Management controls related-party information.",
 procedures: [
 "Obtain and review the entity's listing of identified related parties; compare to prior year and assess completeness.",
 "Inquire of management and those charged with governance regarding related-party transactions during the period.",
 "Review board minutes, shareholder agreements, and contracts for references to related parties.",
 "Identify significant transactions outside the normal course of business and assess whether they involve related parties.",
 "Test a sample of identified related-party transactions for authorization, proper recording, and adequate disclosure.",
 ],
 },
 {
 id: "acctg-estimates",
 name: "Accounting estimates — management bias",
 scotabd: "Other current assets",
 assertions: ["AV"],
 irFactors: "Accounting estimates require management judgment and may be subject to intentional or unintentional bias. Complexity and subjectivity increase susceptibility.",
 procedures: [
 "Obtain management's listing of significant accounting estimates and assess whether all material estimates are identified.",
 "For each significant estimate, evaluate the appropriateness of the valuation method and the reasonableness of key assumptions.",
 "Develop an independent expectation (or range) for significant estimates and compare to management's estimates.",
 "Test the underlying data used in the estimation process for accuracy, completeness, and relevance.",
 "Review prior-period estimates for indications of management bias by comparing estimates to actual outcomes.",
 ],
 },
 {
 id: "going-concern",
 name: "Going concern — material uncertainty in continuity",
 scotabd: "Long-term debt",
 assertions: ["AV"],
 irFactors: "Events or conditions may indicate material uncertainty about the entity's ability to continue as a going concern.",
 procedures: [
 "Obtain management's going concern assessment and review the assumptions and period covered.",
 "Review cash flow forecasts for reasonableness; compare projected cash flows to historical results.",
 "Review compliance with debt covenants and identify any breaches or waiver requirements.",
 "Confirm outstanding loan facilities and review maturity dates and renewal terms.",
 "Review post-period events for evidence that either alleviates or exacerbates going concern indicators.",
 ],
 },
 {
 id: "ltd-completeness",
 name: "Long-term debt — completeness and proper disclosure",
 scotabd: "Long-term debt",
 assertions: ["C", "AV"],
 irFactors: "Debt arrangements may not be fully disclosed, covenants may not be properly reflected, or debt may be improperly classified between current and long-term.",
 procedures: [
 "Obtain a continuity schedule of long-term debt and agree opening balances to prior period working papers.",
 "Confirm outstanding debt balances, terms, interest rates, and covenants directly with lenders.",
 "Review loan agreements for restrictive covenants and confirm compliance at period-end.",
 "Recalculate interest expense for a sample of debt instruments and agree to general ledger.",
 "Assess appropriateness of current vs. non-current classification based on maturity dates and covenant compliance.",
 ],
 },
 {
 id: "equity-completeness",
 name: "Equity — completeness and proper authorization",
 scotabd: "Equity",
 assertions: ["C", "AV"],
 irFactors: "Share capital transactions may not be properly authorized or recorded; retained earnings rollforward may contain errors.",
 procedures: [
 "Obtain the equity continuity schedule and agree opening balances to prior period audited financial statements.",
 "Review articles of incorporation and minute book for authorized share capital and any changes during the period.",
 "Verify share issuances or repurchases to supporting documentation and confirm proper board authorization.",
 "Agree dividends declared to board approval and trace payment to bank statements.",
 "Recalculate retained earnings rollforward (opening + net income ± OCI − dividends).",
 ],
 },
];

const formatRefList = (refs: RefDoc[]) => refs.map(r => r.name).join(", ") || "—";

function bestLibraryMatch(scotabd: string, rmmText?: string): RiskLibraryEntry | null {
  // 1. SCOTABD exact / first-word match
  if (scotabd) {
    const norm = scotabd.toLowerCase().trim();
    const hit = RISK_LIBRARY.find(e => {
      const en = e.scotabd.toLowerCase();
      return en === norm || en.split(" ")[0] === norm.split(" ")[0];
    });
    if (hit) return hit;
  }
  // 2. RMM text keyword fallback
  if (rmmText) {
    const r = rmmText.toLowerCase();
    if (r.includes("inventory") || r.includes("obsolesc")) return RISK_LIBRARY.find(e => e.id === "inv-overstatement") ?? null;
    if (r.includes("revenue") && (r.includes("cut-off") || r.includes("cutoff") || r.includes("recognition"))) return RISK_LIBRARY.find(e => e.id === "rev-cutoff") ?? null;
    if (r.includes("revenue")) return RISK_LIBRARY.find(e => e.id === "rev-existence") ?? null;
    if (r.includes("related-party") || r.includes("related party")) return RISK_LIBRARY.find(e => e.id === "related-party") ?? null;
    if (r.includes("accounting estimate") || r.includes("estimates")) return RISK_LIBRARY.find(e => e.id === "acctg-estimates") ?? null;
    if (r.includes("going concern")) return RISK_LIBRARY.find(e => e.id === "going-concern") ?? null;
    if (r.includes("long-term debt") || r.includes("long term debt")) return RISK_LIBRARY.find(e => e.id === "ltd-completeness") ?? null;
    if (r.includes("payable") || r.includes("unrecorded liabilit")) return RISK_LIBRARY.find(e => e.id === "ap-completeness") ?? null;
    if (r.includes("receivable") || r.includes("collectib")) return RISK_LIBRARY.find(e => e.id === "ar-collectibility") ?? null;
    if (r.includes("property") || r.includes("plant") || r.includes("equipment")) return RISK_LIBRARY.find(e => e.id === "ppe-valuation") ?? null;
    if (r.includes("management override") || r.includes("journal entr")) return RISK_LIBRARY.find(e => e.id === "mgmt-override") ?? null;
    if (r.includes("equity") || r.includes("share capital")) return RISK_LIBRARY.find(e => e.id === "equity-completeness") ?? null;
  }
  return null;
}

function newPartARow(): PartARow {
 return { id: uid(), wpRefSource: [{ name: "510" }], rmmIdentified: "", fraudRisk: "", rmmAssessment: "", auditResponse: "", wpRef: [] };
}

function newPartBRow(): PartBRow {
 return { id: uid(), wpRefSource: [], rmmIdentified: "", scotabd: "", balanceValue: "", assertions: [], irFactors: "", fraudRisk: "", irLikelihood: "", irMagnitude: "", inherentRisk: "", significantRisk: "", substantiveSufficient: "", procedures: [] };
}

function buildDefault(): Data520 {
 return {
 partARows: [
 {
 id: uid(),
 wpRefSource: [{ name: "510" }],
 rmmIdentified: "Management override of controls",
 fraudRisk: "Y",
 rmmAssessment: "H",
 auditResponse: "1. Test appropriateness of journal entries recorded in the general ledger and other adjustments.\n2. Review accounting estimates for biases and evaluate whether any bias represents an RMM due to fraud.\n3. Evaluate whether significant transactions outside the normal course of business suggest fraudulent financial reporting or concealment of misappropriation.",
 wpRef: [{ name: "670" }],
 },
 ],
 partBRows: [
 {
 id: uid(),
 wpRefSource: [{ name: "510-5" }],
 rmmIdentified: "Inventory value could be overstated due to inadequate obsolescence provision",
 scotabd: "Inventories",
 balanceValue: "",
 assertions: ["AV"],
 irFactors: "Inventory provision for obsolescence is subject to moderate estimate uncertainty and complexity. Management judgment is required in assessing slow-moving and obsolete stock. No automated controls over provision calculation.",
 fraudRisk: "N",
 irLikelihood: "M",
 irMagnitude: "M",
 inherentRisk: "M",
 significantRisk: "N",
 substantiveSufficient: "Y",
 procedures: [
 "Attend the physical inventory count; observe procedures, perform test counts, and trace results to the final inventory listing.",
 "Test inventory unit costs by reference to recent supplier invoices and compare to standard costs.",
 "Obtain management's obsolescence provision schedule and test assumptions (aging thresholds, turnover rates).",
 "Identify slow-moving or zero-movement items and assess adequacy of the provision.",
 "Compare net realizable value to cost for a sample of inventory items.",
 ],
 },
 {
 id: uid(),
 wpRefSource: [{ name: "510-3" }],
 rmmIdentified: "Revenue recognition may be misstated due to incorrect cut-off of vessel charter agreements at year-end",
 scotabd: "Revenue",
 balanceValue: "",
 assertions: ["C", "AV"],
 irFactors: "Charter revenue is recognised over the contract period; cut-off risk exists at year-end for contracts spanning the period boundary. Low complexity but requires consistent application of revenue recognition policy.",
 fraudRisk: "N",
 irLikelihood: "M",
 irMagnitude: "M",
 inherentRisk: "M",
 significantRisk: "N",
 substantiveSufficient: "Y",
 procedures: [
 "Obtain listing of revenue transactions recorded in the final 10 business days of the period and first 10 business days after period-end.",
 "Trace a sample to underlying contracts and service completion evidence to verify the period of recognition.",
 "Review manual and unusual journal entries posted to revenue accounts near year-end.",
 ],
 },
 {
 id: uid(),
 wpRefSource: [{ name: "515-5" }],
 rmmIdentified: "Related-party transactions may be incomplete or not disclosed on arm's length terms",
 scotabd: "Related-party transactions",
 balanceValue: "",
 assertions: ["C", "AV"],
 irFactors: "Owner-managed entity — risk of undisclosed related-party transactions or non-arm's-length pricing. Moderate subjectivity in management's determination of market rates. Significant management involvement increases susceptibility to management bias.",
 fraudRisk: "Y",
 irLikelihood: "M",
 irMagnitude: "H",
 inherentRisk: "H",
 significantRisk: "Y",
 substantiveSufficient: "N",
 procedures: [
 "Obtain and review the entity's listing of identified related parties; compare to prior year and assess completeness.",
 "Inquire of management and those charged with governance regarding related-party transactions during the period.",
 "Review board minutes, shareholder agreements, and contracts for references to related parties.",
 "Test a sample of identified related-party transactions for authorization, proper recording, and adequate disclosure.",
 ],
 },
 ],
 conclusion: "",
 concluded: false,
 concludedOn: "",
 };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
 return (
 <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
 <div className="px-6 py-3.5 bg-card border-b border-border">
 <span className="text-sm font-semibold text-foreground">{title}</span>
 </div>
 {children}
 </div>
 );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function Audit520Worksheet() {
 const { engagementId } = useParams<{ engagementId: string }>();
 const storageKey = `audit-520-data-${engagementId ?? "default"}`;

 const [data, setData] = useState<Data520>(() => {
 const saved = readJsonFromLocalStorage<Data520 | null>(storageKey, null);
 const toRefDocs = (v: unknown): RefDoc[] => {
 if (Array.isArray(v)) return v as RefDoc[];
 if (typeof v === "string" && v) return [{ name: v }];
 return [];
 };
 const base: Data520 = saved
 ? {
...buildDefault(),
...saved,
 partARows: saved.partARows.map(r => ({
...r,
 wpRefSource: toRefDocs(r.wpRefSource),
 wpRef: toRefDocs(r.wpRef),
 })),
 partBRows: saved.partBRows.map(r => ({
 procedures: [] as string[],
 balanceValue: "",
...r,
 wpRefSource: toRefDocs(r.wpRefSource),
 })),
 }
 : buildDefault();
 const auto = buildAutoFillRows(engagementId ?? "default");
 const merged = mergeAutoFill(base, auto);
 return {...base,...merged } as Data520;
 });

 const firstRender = useRef(true);
 useEffect(() => {
 if (firstRender.current) { firstRender.current = false; return; }
 const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
 return () => clearTimeout(t);
 }, [data, storageKey]);

 // Auto-populate procedures and normalize SCOTABD for rows missing either
 useEffect(() => {
 setData(d => {
 let changed = false;
 const partBRows = d.partBRows.map(row => {
 const hasProcs = (row.procedures ?? []).length > 0;
 const validScotabd = SCOTABD_OPTIONS.includes(row.scotabd);
 if (hasProcs && validScotabd) return row;
 const match = bestLibraryMatch(row.scotabd, row.rmmIdentified);
 if (!match) return row;
 const updates: Partial<PartBRow> = {};
 if (!hasProcs) updates.procedures = [...match.procedures];
 if (!validScotabd) updates.scotabd = match.scotabd;
 if (Object.keys(updates).length === 0) return row;
 changed = true;
 return { ...row, ...updates };
 });
 return changed ? { ...d, partBRows } : d;
 });
 }, []); // eslint-disable-line react-hooks/exhaustive-deps

 const locked = data.concluded;
 const isDemoEngagement = engagementId === 'AUD-NPM-Dec312025';

 function updatePartA(id: string, field: keyof PartARow, val: string) {
 setData(d => ({...d, partARows: d.partARows.map(r => r.id === id ? {...r, [field]: val } : r) }));
 }
 function setPartAWpRef(id: string, wpRef: RefDoc[]) {
 setData(d => ({...d, partARows: d.partARows.map(r => r.id === id ? {...r, wpRef } : r) }));
 }
 function updatePartB(id: string, field: keyof PartBRow, val: string) {
 setData(d => ({...d, partBRows: d.partBRows.map(r => r.id === id ? {...r, [field]: val } : r) }));
 }
 function toggleAssertionB(id: string, a: string) {
 setData(d => ({...d, partBRows: d.partBRows.map(r => {
 if (r.id !== id) return r;
 const has = r.assertions.includes(a);
 return {...r, assertions: has ? r.assertions.filter(x => x !== a) : [...r.assertions, a] };
 }) }));
 }

 const [showLibraryPicker, setShowLibraryPicker] = useState(false);
 const [editingProcsRowId, setEditingProcsRowId] = useState<string | null>(null);
 const [pickerForRowId, setPickerForRowId] = useState<string | null>(null);

 function loadLibraryForRow(rowId: string, entry: RiskLibraryEntry) {
 setData(d => ({...d, partBRows: d.partBRows.map(r =>
 r.id !== rowId ? r : {...r, procedures: [...entry.procedures], scotabd: r.scotabd || entry.scotabd, assertions: r.assertions.length ? r.assertions : entry.assertions }
 ) }));
 setPickerForRowId(null);
 setEditingProcsRowId(null);
 }

 function addFromLibrary(entry: RiskLibraryEntry) {
 const newRow: PartBRow = { id: uid(), wpRefSource: [], rmmIdentified: entry.name, scotabd: entry.scotabd, balanceValue: "", assertions: entry.assertions, irFactors: entry.irFactors, fraudRisk: "", irLikelihood: "", irMagnitude: "", inherentRisk: "", significantRisk: "", substantiveSufficient: "", procedures: [...entry.procedures] };
 setData(d => ({...d, partBRows: [...d.partBRows, newRow] }));
 setShowLibraryPicker(false);
 }

 function updateProcedure(rowId: string, index: number, value: string) {
 setData(d => ({...d, partBRows: d.partBRows.map(r => {
 if (r.id !== rowId) return r;
 const procs = [...(r.procedures ?? [])];
 procs[index] = value;
 return {...r, procedures: procs };
 }) }));
 }

 function addProcedure(rowId: string) {
 setData(d => ({...d, partBRows: d.partBRows.map(r =>
 r.id !== rowId ? r : {...r, procedures: [...(r.procedures ?? []), ""] }
 ) }));
 }

 function removeProcedure(rowId: string, index: number) {
 setData(d => ({...d, partBRows: d.partBRows.map(r => {
 if (r.id !== rowId) return r;
 return {...r, procedures: (r.procedures ?? []).filter((_, i) => i !== index) };
 }) }));
 }

 return (
 <div className="flex flex-col h-full">

 {/* ── Objective bar ─────────────────────────────────────────────── */}
 <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
 <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
 <p className="text-sm text-foreground leading-relaxed">
 <span className="font-semibold text-primary">Objective: </span>
 To document and assess identified risks of material misstatement at the financial statement level and assess inherent risk(s) at the assertion level, including significant risks, to be used as a basis for designing and implementing the appropriate audit response.
 </p>
 </div>

 {/* ── Legend bar ────────────────────────────────────────────────── */}
 <div className="px-6 py-1.5 border-b border-border bg-muted/20 shrink-0">
 <p className="text-[10.5px] text-muted-foreground">
 <span className="font-medium">F/S</span> = Financial statements &nbsp;·&nbsp;
 <span className="font-medium">RMM</span> = Risk of material misstatement &nbsp;·&nbsp;
 <span className="font-medium">SCOTABD</span> = Significant class of transactions, account balance, or disclosure &nbsp;·&nbsp;
 <span className="font-medium">IR</span> = Inherent risk &nbsp;·&nbsp;
 <span className="font-medium">H</span> = High &nbsp;·&nbsp;
 <span className="font-medium">M</span> = Medium &nbsp;·&nbsp;
 <span className="font-medium">L</span> = Low
 </p>
 </div>

 <LukaStatusBar
   isActive={isDemoEngagement}
   message="Luka is populating risk register from connected QBO data, prior file, and risk library…"
 />

 {/* ── Scrollable body ────────────────────────────────────────────── */}
 <div className="flex-1 overflow-y-auto bg-muted/30">
 <div className="p-6 space-y-6">

 {/* ── Part A ────────────────────────────────────────────────── */}
 <SectionCard title="Part A — Identify and Assess RMMs at the Financial Statement Level">
 <div className="px-6 py-2 border-b border-border bg-muted/20">
 <p className="text-sm text-muted-foreground">Document the risks identified that relate to the financial statements as a whole. Complete Part A before Part B, as FSL risks can impact assertion-level risks.</p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-24">Risk Source<br /><span className="font-normal normal-case text-muted-foreground">(W/P Ref.)</span></th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">RMM Identified</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-20">Fraud Risk<br /><span className="font-normal normal-case text-muted-foreground">(Y/N)</span></th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-24">Assess RMM<br /><span className="font-normal normal-case text-muted-foreground">(H/M/L)</span></th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider">Overall Audit Response</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-20">W/P Ref.</th>
 <th className="w-8" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {data.partARows.map(row => (
 <tr key={row.id} className="hover:bg-muted/50 transition-colors">
 <td className="px-4 py-2.5 align-top w-28">
 <div className="h-8 flex items-center px-2 text-sm text-foreground bg-muted/40 rounded-md border border-border/60 whitespace-nowrap">
 {formatRefList(row.wpRefSource)}
 </div>
 {isDemoEngagement && (
   <div className="mt-1">
     <AutomationStateChip state={row.rmmIdentified ? 'luka-drafted' : 'needs-input'} />
   </div>
 )}
 </td>
 <td className="px-4 py-2.5 align-top min-w-[240px]">
 <AttributedComment value={row.rmmIdentified} onChange={v => updatePartA(row.id, "rmmIdentified", v)} storageKey={`520-${engagementId ?? "def"}-pA-rmm-${row.id}`} placeholder="Describe the risk of material misstatement…" disabled={locked} className="min-h-[72px] text-sm resize-none bg-background" />
 </td>
 <td className="px-4 py-2.5 align-top w-20">
 <Select disabled={locked} value={row.fraudRisk} onValueChange={v => updatePartA(row.id, "fraudRisk", v as YN)}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
 </Select>
 </td>
 <td className="px-4 py-2.5 align-top w-24">
 <Select disabled={locked} value={row.rmmAssessment} onValueChange={v => updatePartA(row.id, "rmmAssessment", v as HML)}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>{HML_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
 </Select>
 </td>
 <td className="px-4 py-2.5 align-top min-w-[260px]">
 <AttributedComment value={row.auditResponse} onChange={v => updatePartA(row.id, "auditResponse", v)} storageKey={`520-${engagementId ?? "def"}-pA-resp-${row.id}`} placeholder="Document overall audit response…" disabled={locked} className="min-h-[72px] text-sm resize-none bg-background" />
 </td>
 <td className="px-4 py-2.5 align-top w-28">
 <RefButton
 reference={row.wpRef}
 onAttach={doc => setPartAWpRef(row.id, [...row.wpRef, doc])}
 onRemove={i => setPartAWpRef(row.id, row.wpRef.filter((_, idx) => idx !== i))}
 disabled={locked}
 />
 </td>
 {!locked && (
 <td className="px-2 py-2.5 align-middle text-center">
 <button onClick={() => setData(d => ({...d, partARows: d.partARows.filter(r => r.id !== row.id) }))} className="text-muted-foreground hover:text-destructive transition-colors">
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </td>
 )}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 {!locked && (
 <div className="border-t border-border px-4 py-3">
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => setData(d => ({...d, partARows: [...d.partARows, newPartARow()] }))}>
 <Plus className="h-3 w-3" /> Add Risk
 </Button>
 </div>
 )}
 </SectionCard>

 {/* ── Part B ────────────────────────────────────────────────── */}
 <SectionCard title="Part B — Identify RMMs and Assess Inherent Risk at the Assertion Level">
 <div className="px-6 py-2 border-b border-border bg-muted/20">
 <p className="text-sm text-muted-foreground">
 Document risks at the assertion level and assess inherent risk (IR), including significant risks.&nbsp;
 <span className="font-medium text-foreground">Assertions:</span> C = Completeness · AV = Accuracy &amp; Valuation · E = Existence · P = Presentation
 </p>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full">
 <thead className="sticky top-0 z-10">
 <tr className="bg-muted border-b border-border">
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider min-w-[260px]">Procedures</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider w-20">Risk Source<br /><span className="font-normal normal-case text-muted-foreground">(W/P Ref.)</span></th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider min-w-[180px]">RMM Identified</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider min-w-[140px]">SCOTABD<br /><span className="font-normal normal-case text-muted-foreground">Impacted</span></th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-20">F/S<br />Assertions</th>
 <th className="px-4 py-3 text-left text-sm font-semibold text-foreground uppercase tracking-wider min-w-[200px]">IR Factors &amp; Susceptibility</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-16">Fraud<br />Risk</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-16">IR<br />Likelihood</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-16">IR<br />Magnitude</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-16">Assess<br />IR</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-20">Significant<br />Risk</th>
 <th className="px-4 py-3 text-center text-sm font-semibold text-foreground uppercase tracking-wider w-24">Substantive<br />Sufficient</th>
 <th className="w-8" />
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {data.partBRows.map(row => (
 <tr key={row.id} className={cn("transition-colors", row.significantRisk === "Y" ? "bg-amber-50/40 dark:bg-amber-950/10 hover:bg-amber-50/60" : "hover:bg-muted/50")}>
 <td className="px-4 py-2.5 align-top min-w-[260px]">
 {(() => {
 const procs = row.procedures ?? [];
 const isEditing = editingProcsRowId === row.id;
 const isPicking = pickerForRowId === row.id;
 const suggestion = bestLibraryMatch(row.scotabd, row.rmmIdentified);

 if (procs.length === 0 && !isEditing) {
 return (
 <div className="space-y-1.5">
 <span className="text-sm text-muted-foreground italic">No procedures documented</span>
 {!locked && (
 <div className="flex flex-wrap items-center gap-2">
 <button onClick={() => setPickerForRowId(isPicking ? null : row.id)} className="text-xs text-primary hover:underline flex items-center gap-0.5">
 <BookOpen className="h-3 w-3" /> Load from library
 </button>
 <span className="text-muted-foreground text-xs">·</span>
 <button onClick={() => { addProcedure(row.id); setEditingProcsRowId(row.id); }} className="text-xs text-primary hover:underline flex items-center gap-0.5">
 <Plus className="h-3 w-3" /> Add manually
 </button>
 </div>
 )}
 {suggestion && !locked && !isPicking && (
 <div className="flex items-center gap-1.5 mt-0.5 px-2 py-1.5 rounded-md bg-primary/[0.06] border border-primary/20">
 <span className="text-sm text-muted-foreground">Suggested:</span>
 <button onClick={() => loadLibraryForRow(row.id, suggestion)} className="text-xs text-primary hover:underline text-left leading-snug">
 {suggestion.name}
 </button>
 </div>
 )}
 {isPicking && (
 <div className="mt-0.5 border border-border rounded-md overflow-hidden bg-popover shadow-lg">
 <div className="px-2 py-1.5 border-b border-border bg-muted/30 flex items-center justify-between">
 <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Risk Library</span>
 <button onClick={() => setPickerForRowId(null)} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
 </div>
 <div className="max-h-48 overflow-y-auto divide-y divide-border/50">
 {RISK_LIBRARY.map(entry => (
 <button key={entry.id} onClick={() => loadLibraryForRow(row.id, entry)} className="w-full text-left px-2 py-1.5 hover:bg-muted transition-colors">
 <div className="text-xs font-medium text-foreground leading-snug">{entry.name}</div>
 <div className="text-[11px] text-muted-foreground">{entry.scotabd} · {entry.assertions.join(", ")}</div>
 </button>
 ))}
 </div>
 </div>
 )}
 </div>
 );
 }

 if (isEditing) {
 return (
 <div className="space-y-1">
 {procs.map((proc, i) => (
 <div key={i} className="flex items-start gap-1 group">
 <span className="text-muted-foreground text-xs w-5 shrink-0 pt-2 select-none">{i + 1}.</span>
 <textarea
 value={proc}
 onChange={e => updateProcedure(row.id, i, e.target.value)}
 rows={1}
 className="flex-1 text-sm py-1.5 px-0 bg-transparent border-0 border-b border-border focus:outline-none focus:border-primary resize-none leading-snug"
 />
 <button onClick={() => removeProcedure(row.id, i)} className="text-muted-foreground hover:text-destructive shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
 <X className="h-3 w-3" />
 </button>
 </div>
 ))}
 <div className="flex items-center gap-3 pt-1 border-t border-border/40 mt-1">
 <button onClick={() => addProcedure(row.id)} className="text-xs text-primary hover:underline flex items-center gap-0.5">
 <Plus className="h-3 w-3" /> Add
 </button>
 <button onClick={() => setPickerForRowId(isPicking ? null : row.id)} className="text-xs text-primary hover:underline flex items-center gap-0.5">
 <BookOpen className="h-3 w-3" /> From library
 </button>
 <button onClick={() => { setEditingProcsRowId(null); setPickerForRowId(null); }} className="text-sm text-muted-foreground hover:text-foreground ml-auto border border-border rounded px-2 py-0.5">
 Done
 </button>
 </div>
 {isPicking && (
 <div className="mt-1 border border-border rounded-md overflow-hidden bg-popover shadow-lg">
 <div className="max-h-40 overflow-y-auto divide-y divide-border/50">
 {RISK_LIBRARY.map(entry => (
 <button key={entry.id} onClick={() => loadLibraryForRow(row.id, entry)} className="w-full text-left px-2 py-1.5 hover:bg-muted transition-colors">
 <div className="text-xs font-medium text-foreground">{entry.name}</div>
 <div className="text-[11px] text-muted-foreground">{entry.scotabd}</div>
 </button>
 ))}
 </div>
 </div>
 )}
 </div>
 );
 }

 return (
 <div>
 <ol className="space-y-1.5">
 {procs.slice(0, 4).map((proc, i) => (
 <li key={i} className="flex items-start gap-1.5 text-sm">
 <span className="text-muted-foreground text-xs shrink-0 w-5 pt-0.5 select-none">{i + 1}.</span>
 <span className="text-foreground leading-snug line-clamp-2">{proc}</span>
 </li>
 ))}
 </ol>
 {procs.length > 4 && (
 <p className="text-sm text-muted-foreground mt-1 pl-5">…and {procs.length - 4} more</p>
 )}
 {!locked && (
 <button onClick={() => setEditingProcsRowId(row.id)} className="mt-2 text-xs text-primary hover:underline flex items-center gap-0.5 pl-5">
 ✏ Edit procedures
 </button>
 )}
 </div>
 );
 })()}
 </td>
 <td className="px-4 py-2.5 align-top w-28">
 <div className="h-8 flex items-center px-2 text-sm text-foreground bg-muted/40 rounded-md border border-border/60 whitespace-nowrap">
 {formatRefList(row.wpRefSource)}
 </div>
 {isDemoEngagement && (
   <div className="mt-1">
     <AutomationStateChip state={row.rmmIdentified ? 'luka-drafted' : 'needs-input'} />
   </div>
 )}
 </td>
 <td className="px-4 py-2.5 align-top min-w-[180px]">
 <AttributedComment value={row.rmmIdentified} onChange={v => updatePartB(row.id, "rmmIdentified", v)} storageKey={`520-${engagementId ?? "def"}-pB-rmm-${row.id}`} placeholder="Describe the RMM…" disabled={locked} className="min-h-[72px] text-sm resize-none bg-background" />
 </td>
 <td className="px-4 py-2.5 align-top min-w-[140px]">
 <Select value={row.scotabd} onValueChange={v => updatePartB(row.id, "scotabd", v)} disabled={locked}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
 <SelectContent>{SCOTABD_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
 </Select>
 <input
 type="text"
 value={row.balanceValue ?? ""}
 onChange={e => updatePartB(row.id, "balanceValue", e.target.value)}
 placeholder="Balance ($)"
 disabled={locked}
 className="mt-1 w-full h-7 px-2 text-xs bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
 />
 </td>
 <td className="px-4 py-2.5 align-top text-center w-20">
 <div className="flex flex-wrap gap-1 justify-center">
 {ASSERTION_OPTIONS.map(a => {
 const active = (Array.isArray(row.assertions) ? row.assertions : []).includes(a);
 return (
 <button key={a} type="button" disabled={locked} onClick={() => toggleAssertionB(row.id, a)}
 className={`px-2 py-0.5 rounded-md border text-[11px] font-mono transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-muted"}`}>
 {a}
 </button>
 );
 })}
 </div>
 </td>
 <td className="px-4 py-2.5 align-top min-w-[200px]">
 <AttributedComment value={row.irFactors} onChange={v => updatePartB(row.id, "irFactors", v)} storageKey={`520-${engagementId ?? "def"}-pB-ir-${row.id}`} placeholder="Document how IR factors affect susceptibility to misstatement…" disabled={locked} className="min-h-[72px] text-sm resize-none bg-background" />
 </td>
 <td className="px-4 py-2.5 align-top w-16">
 <Select disabled={locked} value={row.fraudRisk} onValueChange={v => updatePartB(row.id, "fraudRisk", v as YN)}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
 </Select>
 </td>
 <td className="px-4 py-2.5 align-top w-16">
 <Select disabled={locked} value={row.irLikelihood} onValueChange={v => updatePartB(row.id, "irLikelihood", v as HML)}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>{HML_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
 </Select>
 </td>
 <td className="px-4 py-2.5 align-top w-16">
 <Select disabled={locked} value={row.irMagnitude} onValueChange={v => updatePartB(row.id, "irMagnitude", v as HML)}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>{HML_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
 </Select>
 </td>
 <td className="px-4 py-2.5 align-top w-16">
 <Select disabled={locked} value={row.inherentRisk} onValueChange={v => updatePartB(row.id, "inherentRisk", v as HML)}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>{HML_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
 </Select>
 </td>
 <td className="px-4 py-2.5 align-top w-20">
 <Select disabled={locked} value={row.significantRisk} onValueChange={v => updatePartB(row.id, "significantRisk", v as YN)}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
 </Select>
 </td>
 <td className="px-4 py-2.5 align-top w-24">
 <Select disabled={locked} value={row.substantiveSufficient} onValueChange={v => updatePartB(row.id, "substantiveSufficient", v as YN)}>
 <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
 <SelectContent>{YN_OPTIONS.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
 </Select>
 </td>
 {!locked && (
 <td className="px-2 py-2.5 align-middle text-center">
 <button onClick={() => setData(d => ({...d, partBRows: d.partBRows.filter(r => r.id !== row.id) }))} className="text-muted-foreground hover:text-destructive transition-colors">
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </td>
 )}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 {!locked && (
 <div className="border-t border-border px-4 py-3 flex items-center gap-2">
 <div className="relative">
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => setShowLibraryPicker(v => !v)}>
 <BookOpen className="h-3 w-3" /> From Library
 </Button>
 {showLibraryPicker && (
 <div className="absolute bottom-9 left-0 z-30 w-[340px] bg-popover border border-border rounded-md shadow-xl overflow-hidden">
 <div className="px-3 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
 <span className="text-xs font-semibold text-foreground">Risk Library — select to auto-populate</span>
 <button onClick={() => setShowLibraryPicker(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
 </div>
 <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
 {RISK_LIBRARY.map(entry => (
 <button key={entry.id} className="w-full flex flex-col items-start px-3 py-2 hover:bg-muted text-left transition-colors" onClick={() => addFromLibrary(entry)}>
 <span className="text-sm text-foreground leading-snug">{entry.name}</span>
 <span className="text-sm text-muted-foreground mt-0.5">{entry.scotabd} · {entry.assertions.join(", ")}</span>
 </button>
 ))}
 </div>
 </div>
 )}
 </div>
 <Button size="sm" variant="secondary" className="h-7 text-xs gap-1" onClick={() => setData(d => ({...d, partBRows: [...d.partBRows, newPartBRow()] }))}>
 <Plus className="h-3 w-3" /> Add manually
 </Button>
 </div>
 )}
 </SectionCard>

 {/* ── Conclusion ─────────────────────────────────────────────── */}
 <SectionCard title="Overall Conclusion">
 <div className="px-6 py-5 space-y-4">
 <p className="text-sm text-muted-foreground">
 RMMs at the financial statement level and inherent risk at the assertion level have been appropriately identified and assessed.
 </p>
 <Textarea
 disabled={locked}
 value={data.conclusion}
 onChange={e => setData(d => ({...d, conclusion: e.target.value }))}
 placeholder="Document your conclusion…"
 className="min-h-[120px] text-sm resize-none bg-background"
 />
 </div>
 </SectionCard>

 <WorksheetSignOff worksheetKey="audit-520" engagementId={engagementId} />

 {locked
 ? <ConcludedRow concludedOn={data.concludedOn} onReopen={() => { setData(d => { const next = {...d, concluded: false, concludedOn: '' }; writeJsonToLocalStorage(storageKey, next); return next; }); }} />
 : <div className="flex justify-end"><Button onClick={() => { const now = new Date().toISOString(); setData(d => { const next = {...d, concluded: true, concludedOn: now }; writeJsonToLocalStorage(storageKey, next); return next; }); }}>Conclude Worksheet</Button></div>
 }

 </div>
 </div>
 </div>
 );
}
