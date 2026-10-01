import { allTemplateViews, type TreeItem } from "@/lib/engagementTemplatesData";

export interface GlobalTemplate {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: GlobalTemplate[];
  isExpanded?: boolean;
  suggested?: boolean;
}

export const initialGlobalTemplates: GlobalTemplate[] = [
  {
    id: "global-1",
    name: "Compilation",
    type: "folder",
    isExpanded: true,
    children: [
      { id: "global-1-1", name: "Client Acceptance and Continuance", type: "file" },
      { id: "global-1-2", name: "Independence", type: "file" },
      { id: "global-1-3", name: "Knowledge of the Business", type: "file" },
      { id: "global-1-4", name: "Planning", type: "file" },
      { id: "global-1-5", name: "Withdrawal", type: "file" },
      { id: "global-1-6", name: "Completion", type: "file" },
    ],
  },
  {
    id: "global-2",
    name: "Review",
    type: "folder",
    isExpanded: false,
    children: [
      { id: "global-2-1", name: "New engagement acceptance", type: "file" },
      { id: "global-2-2", name: "Existing engagement continuance", type: "file" },
      { id: "global-2-3", name: "Understanding the entity - Basics", type: "file" },
      { id: "global-2-4", name: "Engagement Planning", type: "file" },
      { id: "global-2-5", name: "Completion", type: "file" },
      { id: "global-2-6", name: "Subsequent events", type: "file" },
      { id: "global-2-7", name: "Withdrawal", type: "file" },
      { id: "global-2-8", name: "Understanding the entity - Systems", type: "file" },
      { id: "global-2-9", name: "ASPE - General - Disclosure checklist", type: "file" },
      { id: "global-2-10", name: "ASPE - Income taxes - Disclosure checklist", type: "file" },
      { id: "global-2-11", name: "ASPE - Leases - Disclosure checklist", type: "file" },
      { id: "global-2-12", name: "ASPE - Goodwill and intangible assets - Disclosure checklist", type: "file" },
      { id: "global-2-13", name: "ASPE - Employee future benefits - Disclosure checklist", type: "file" },
      { id: "global-2-14", name: "ASPE - Supplementary - Disclosure checklist", type: "file" },
      { id: "global-2-15", name: "ASPE - Agriculture - Disclosure checklist", type: "file" },
      { id: "global-2-16", name: "Specific Circumstances", type: "file" },
    ],
  },
  {
    id: "global-3",
    name: "Tax",
    type: "folder",
    isExpanded: false,
    children: [
      { id: "global-3-1", name: "Completion", type: "file" },
    ],
  },
  {
    id: "global-4",
    name: "Audit",
    type: "folder",
    isExpanded: false,
    children: [
      {
        id: "global-4-ca",
        name: "Canada",
        type: "folder",
        isExpanded: false,
        children: [
          { id: "gca-cl-408", name: "408 Initial Audit Engagements", type: "file" },
          { id: "gca-cl-410", name: "410 New/Existing Engagement — Acceptance/Continuance", type: "file" },
          { id: "gca-cl-500", name: "500 Observation & Inspection", type: "file" },
          { id: "gca-cl-501a", name: "501-B Preliminary Analytical", type: "file" },
          { id: "gca-cl-505", name: "505 Mgmt Inquiries", type: "file" },
          { id: "gca-cl-525", name: "525 Going Concern", type: "file" },
          { id: "gca-cl-530", name: "530 Pervasive Risks", type: "file" },
          { id: "gca-cl-iar", name: "Independent Auditor's Report", type: "file" },
          { id: "gca-cl-aim", name: "AIM Misstatements", type: "file" },
          { id: "gca-cl-far", name: "FAR Final Analytical Review", type: "file" },
          { id: "gca-cl-se", name: "SE Subsequent Events", type: "file" },
          { id: "gca-cl-gc", name: "GC Going Concern (Final Assessment)", type: "file" },
          { id: "gca-cl-mr", name: "MR Management Representation Letter", type: "file" },
          { id: "gca-cl-disc", name: "DC Disclosure Checklist", type: "file" },
        ],
      },
      {
        id: "global-4-us",
        name: "United States",
        type: "folder",
        isExpanded: false,
        children: [
          {
            id: "global-4-us-1",
            name: "Pre-Engagement",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "global-4-us-1-1", name: "Assessing Acceptability of Financial Reporting Framework", type: "file" },
              { id: "global-4-us-1-2", name: "Audit Team Competency Matrix", type: "file" },
              { id: "global-4-us-1-3", name: "Auditor's Declaration — Code of Ethics", type: "file" },
              { id: "global-4-us-1-4", name: "Declaration of Conflict of Interest", type: "file" },
              { id: "global-4-us-1-5", name: "Declaration of NO Conflict of Interest", type: "file" },
              { id: "global-4-us-1-6", name: "Assessment of Ethical Threats and Safeguards", type: "file" },
              { id: "global-4-us-1-7", name: "Audit Engagement Letter", type: "file" },
            ],
          },
          {
            id: "global-4-us-2",
            name: "Audit Planning",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "global-4-us-2-1", name: "Understanding the Entity and Its Environment", type: "file" },
              { id: "global-4-us-2-2", name: "Determining Materiality", type: "file" },
              { id: "global-4-us-2-3", name: "Overall Audit Strategy and Audit Plan", type: "file" },
              { id: "global-4-us-2-4", name: "Direct Assistance — Internal Auditors Agreement", type: "file" },
            ],
          },
          {
            id: "global-4-us-3",
            name: "Completion & Review",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "global-4-us-3-1", name: "Evaluating Misstatements", type: "file" },
              { id: "global-4-us-3-2", name: "Analytical Procedures — End of Audit", type: "file" },
              { id: "global-4-us-3-3", name: "Management Representation Letter", type: "file" },
            ],
          },
          {
            id: "global-4-us-4",
            name: "Reporting",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "global-4-us-4-1", name: "Auditor's Report — Fair Presentation Framework", type: "file" },
              { id: "global-4-us-4-2", name: "Auditor's Report — Compliance Framework", type: "file" },
              { id: "global-4-us-4-3", name: "Qualified Opinion — Material Misstatement (Fair Presentation)", type: "file" },
              { id: "global-4-us-4-4", name: "Qualified Opinion — Material Misstatement (Compliance)", type: "file" },
              { id: "global-4-us-4-5", name: "Qualified Opinion — Insufficient Evidence", type: "file" },
              { id: "global-4-us-4-6", name: "Adverse Opinion", type: "file" },
              { id: "global-4-us-4-7", name: "Disclaimer of Opinion", type: "file" },
              { id: "global-4-us-4-8", name: "Auditor's Report with Key Audit Matters and Emphasis of Matter", type: "file" },
              { id: "global-4-us-4-9", name: "Qualified Opinion with Emphasis of Matter", type: "file" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "global-5",
    name: "Compilation 2026",
    type: "folder",
    isExpanded: false,
    children: [
      { id: "global-5-1", name: "Client Acceptance and Continuance", type: "file" },
    ],
  },
];

export const engPickerTreeCA: TreeItem[] = [
  { id: "compilation", label: "Compilation", type: "folder", children: [
    { id: "comp4200", label: "Compilation CSRS 4200", type: "file", suggested: true },
  ]},
  { id: "review", label: "Review", type: "folder", children: [
    { id: "rev2400", label: "Review Section 2400", type: "file", suggested: true },
  ]},
  { id: "audit", label: "Audit", type: "folder", children: [
    { id: "audit5100", label: "CAS / ASPE — Private (5100)", type: "file", suggested: true },
    { id: "audit5101", label: "CAS / NFP — ASNPO (5101)", type: "file" },
  ]},
  { id: "tax", label: "Tax", type: "folder", children: [
    { id: "tax-t2", label: "T2 (Corporations)", type: "file" },
  ]},
];

export const engPickerTreeUS: TreeItem[] = [
  { id: "compilation-us", label: "Compilation", type: "folder", children: [
    { id: "comp-us-ssars21", label: "SSARS 21 — Compilation of Financial Statements", type: "file", suggested: true },
    { id: "comp-us-arc80", label: "AR-C 80 Compilation Engagement", type: "file" },
  ]},
  { id: "review-us", label: "Review", type: "folder", children: [
    { id: "rev-us-ssars21", label: "SSARS 21 — Review of Financial Statements", type: "file", suggested: true },
    { id: "rev-us-arc90", label: "AR-C 90 Review Engagement", type: "file" },
  ]},
  { id: "audit-us-root", label: "Audit", type: "folder", children: [
    { id: "audit6100", label: "GAAS / US GAAP — Private (6100)", type: "file", suggested: true },
    { id: "audit6200", label: "PCAOB / SOX Public (6200)", type: "file" },
  ]},
  { id: "tax-us", label: "Tax", type: "folder", children: [
    { id: "tax-us-1120", label: "Form 1120 (C-Corporations)", type: "file", suggested: true },
    { id: "tax-us-1120s", label: "Form 1120-S (S-Corporations)", type: "file" },
    { id: "tax-us-1065", label: "Form 1065 (Partnerships)", type: "file" },
  ]},
];

export const engPickerLabelById: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  const walk = (items: TreeItem[]) => items.forEach(i => {
    if (i.type === "folder") walk(i.children ?? []);
    else map[i.id] = i.label;
  });
  walk(engPickerTreeCA);
  walk(engPickerTreeUS);
  return map;
})();

const engPickerViewFallback: Record<string, string> = {
  "comp-us-ssars21": "comp4200",
  "comp-us-arc80": "comp4200",
  "rev-us-ssars21": "rev2400",
  "rev-us-arc90": "rev2400",
  "tax-us-1120": "tax-t2",
  "tax-us-1120s": "tax-t2",
  "tax-us-1065": "tax-t2",
};

export function getEngPickerTemplateView(id: string) {
  const direct = allTemplateViews[id];
  if (direct) return direct;
  const fallbackId = engPickerViewFallback[id];
  const base = fallbackId ? allTemplateViews[fallbackId] : undefined;
  if (!base) return null;
  return { ...base, title: engPickerLabelById[id] || base.title };
}

export const initialGlobalWorksheets: GlobalTemplate[] = [
  {
    id: "gws-review",
    name: "Review",
    type: "folder",
    isExpanded: true,
    children: [
      { id: "global-2-17", name: "Accounting Estimates (including Fair Values)", type: "file" },
      { id: "global-2-18", name: "Going Concern", type: "file" },
    ],
  },
  {
    id: "gws-audit",
    name: "Audit",
    type: "folder",
    isExpanded: true,
    children: [
      {
        id: "gws-audit-ca",
        name: "Canada",
        type: "folder",
        isExpanded: true,
        children: [
          { id: "gca-ws-mat", name: "420 Materiality", type: "file" },
          { id: "gca-ws-sae", name: "428 Auditor's Expert", type: "file" },
          { id: "gca-ws-asm", name: "430 Overall Audit Strategy", type: "file" },
          { id: "gca-ws-plan", name: "436 Team Planning Discussions", type: "file" },
          { id: "gca-ws-tt", name: "450 Time Tracker", type: "file" },
          { id: "gca-ws-501b", name: "501-A Preliminary Analytical", type: "file" },
          { id: "gca-ws-507", name: "507 Governance Minutes", type: "file" },
          { id: "gca-ws-510", name: "510 Entity Understanding", type: "file" },
          { id: "gca-ws-511", name: "511 IT Environment", type: "file" },
          { id: "gca-ws-514", name: "514 Prior Period Estimates", type: "file" },
          { id: "gca-ws-506", name: "506 Fraud", type: "file" },
          { id: "gca-ws-513", name: "513 Accounting Estimates", type: "file" },
          { id: "gca-ws-515", name: "515 Related Parties", type: "file" },
          { id: "gca-ws-580", name: "580 Revenue Recognition", type: "file" },
          { id: "gca-ws-520", name: "520 Risk Register", type: "file" },
          { id: "gca-ws-590", name: "590 Engagement Scoping", type: "file" },
          { id: "gca-ws-535", name: "535 Info System", type: "file" },
          { id: "gca-ws-540", name: "540 Control Design", type: "file" },
          { id: "gca-ws-550", name: "550 Control Activities", type: "file" },
          { id: "gca-ws-551", name: "551 General IT Controls", type: "file" },
          { id: "gca-ws-575", name: "575 Control Deficiencies", type: "file" },
          { id: "gca-ws-605", name: "605 Risk Responses", type: "file" },
          { id: "gca-ws-610", name: "610 Sampling — Tests of Details", type: "file" },
          { id: "gca-ws-625", name: "625 Going Concern", type: "file" },
          { id: "gca-ws-630", name: "630 Confirmations", type: "file" },
          { id: "gca-ws-635", name: "635 Accounting Estimates", type: "file" },
          { id: "gca-ws-645", name: "645 Litigation, Claims and Non-Compliance", type: "file" },
          { id: "gca-ws-650", name: "650 Subsequent Events", type: "file" },
          { id: "gca-ws-655", name: "655 Final Analytics", type: "file" },
          { id: "gca-ws-666", name: "666 Related Parties", type: "file" },
          { id: "gca-ws-670", name: "670 Use of Journal Entries", type: "file" },
          { id: "gca-ws-680", name: "680 ASPE Supplementary Audit Procedures", type: "file" },
          {
            id: "gca-ws-proc",
            name: "Procedures",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "gca-ws-proc-cash-grp", name: "Cash", type: "folder", isExpanded: false, children: [
                { id: "gca-ws-proc-cash", name: "Audit Procedures", type: "file" },
                { id: "gca-ws-proc-cash-bank", name: "Bank Reconciliation", type: "file" },
                { id: "gca-ws-proc-cash-count", name: "Cash Count", type: "file" },
              ]},
              { id: "gca-ws-proc-ar-grp", name: "Accounts Receivable", type: "folder", isExpanded: false, children: [
                { id: "gca-ws-proc-ar", name: "Audit Procedures", type: "file" },
                { id: "gca-ws-proc-ar-conf", name: "Confirmation Procedures", type: "file" },
              ]},
              { id: "gca-ws-proc-inv", name: "Inventory", type: "file" },
              { id: "gca-ws-proc-invest", name: "Investments", type: "file" },
              { id: "gca-ws-proc-lr", name: "Loans & Advances Receivable", type: "file" },
              { id: "gca-ws-proc-rp", name: "Related party", type: "file" },
              { id: "gca-ws-proc-ppe", name: "Property, Plant and Equipment", type: "file" },
              { id: "gca-ws-proc-intang", name: "Intangibles and Goodwill", type: "file" },
              { id: "gca-ws-proc-ltinv", name: "Other Investments", type: "file" },
              { id: "gca-ws-proc-bankdebt", name: "Bank indebtedness", type: "file" },
              { id: "gca-ws-proc-ap", name: "Accounts Payable and Accrued Liability", type: "file" },
              { id: "gca-ws-proc-tax", name: "Income Taxes", type: "file" },
              { id: "gca-ws-proc-notedebt", name: "Note Payable and Bank Debt", type: "file" },
              { id: "gca-ws-proc-lp", name: "Loans & Advances Payable", type: "file" },
              { id: "gca-ws-proc-ltd", name: "Long term debt", type: "file" },
              { id: "gca-ws-proc-equity", name: "Equity", type: "file" },
              { id: "gca-ws-proc-rev", name: "Revenue", type: "file" },
              { id: "gca-ws-proc-cos", name: "Cost of Sales", type: "file" },
              { id: "gca-ws-proc-payroll", name: "Payroll", type: "file" },
              { id: "gca-ws-proc-exp", name: "Other Expenses", type: "file" },
            ],
          },
        ],
      },
      {
        id: "gws-audit-us",
        name: "United States",
        type: "folder",
        isExpanded: true,
        children: [
          { id: "global-us-4-1", name: "Withdrawal", type: "file" },
          { id: "global-us-4-2", name: "Notes on Significant Audit Decisions", type: "file" },
          { id: "global-us-4-3", name: "Key Audit Matters (AU-C 701)", type: "file" },
          { id: "global-us-4-4", name: "Audit Findings and Matters for Discussion", type: "file" },
          { id: "global-us-4-5", name: "Accumulation of Identified Misstatements (AIM)", type: "file" },
          { id: "global-us-4-6", name: "Matters Communicated to Those Charged with Governance (AU-C 260)", type: "file" },
          { id: "global-us-4-7", name: "Matters for Future Consideration", type: "file" },
          { id: "global-us-4-8", name: "Documenting Consultation", type: "file" },
          {
            id: "gus-ws-proc",
            name: "Procedures",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "gus-ws-proc-cash", name: "Cash", type: "file" },
              { id: "gus-ws-proc-ar", name: "Accounts Receivable", type: "file" },
              { id: "gus-ws-proc-inv", name: "Inventory", type: "file" },
              { id: "gus-ws-proc-invest", name: "Investments", type: "file" },
              { id: "gus-ws-proc-lr", name: "Loans & Advances Receivable", type: "file" },
              { id: "gus-ws-proc-rp", name: "Related party", type: "file" },
              { id: "gus-ws-proc-ppe", name: "Property, Plant and Equipment", type: "file" },
              { id: "gus-ws-proc-intang", name: "Intangibles and Goodwill", type: "file" },
              { id: "gus-ws-proc-ltinv", name: "Other Investments", type: "file" },
              { id: "gus-ws-proc-bankdebt", name: "Bank indebtedness", type: "file" },
              { id: "gus-ws-proc-ap", name: "Accounts Payable and Accrued Liability", type: "file" },
              { id: "gus-ws-proc-tax", name: "Income Taxes", type: "file" },
              { id: "gus-ws-proc-notedebt", name: "Note Payable and Bank Debt", type: "file" },
              { id: "gus-ws-proc-lp", name: "Loans & Advances Payable", type: "file" },
              { id: "gus-ws-proc-ltd", name: "Long term debt", type: "file" },
              { id: "gus-ws-proc-equity", name: "Equity", type: "file" },
              { id: "gus-ws-proc-rev", name: "Revenue", type: "file" },
              { id: "gus-ws-proc-cos", name: "Cost of Sales", type: "file" },
              { id: "gus-ws-proc-payroll", name: "Payroll", type: "file" },
              { id: "gus-ws-proc-exp", name: "Other Expenses", type: "file" },
            ],
          },
        ],
      },
    ],
  },
];

export const initialGlobalLetters: GlobalTemplate[] = [
  { id: "glt-compilation", name: "Compilation", type: "folder", isExpanded: true, children: [
    { id: "glt-1-1", name: "Engagement Letter — Compilation (Corp)", type: "file" },
    { id: "glt-1-2", name: "Management Responsibility & Acknowledgement CSRS 4200 (Corp)", type: "file" },
  ]},
  { id: "glt-review", name: "Review", type: "folder", isExpanded: true, children: [
    { id: "glt-2-1", name: "Engagement Letter Review — Master (Corp)", type: "file" },
    { id: "glt-2-2", name: "Management Representation Letter Review (Corp)", type: "file" },
    { id: "glt-2-3", name: "Review Findings Letter (Corp)", type: "file" },
    { id: "glt-2-4", name: "Letter to a Predecessor (Corp)", type: "file" },
    { id: "glt-2-5", name: "Letter to a Successor (Corp)", type: "file" },
    { id: "glt-2-6", name: "Request for Management Assistance (Corp)", type: "file" },
  ]},
  { id: "glt-tax", name: "Tax", type: "folder", isExpanded: false, children: [
    { id: "glt-3-1", name: "Tax Engagement Letter", type: "file" },
  ]},
  { id: "glt-additional", name: "Additional Letters", type: "folder", isExpanded: false, children: [
    { id: "glt-4-1", name: "Closing Cover Letter", type: "file" },
    { id: "glt-4-2", name: "Letter to Lawyer (Long Form)", type: "file" },
    { id: "glt-4-3", name: "Letter to Lawyer (Short Form)", type: "file" },
    { id: "glt-4-4", name: "Letter to Predecessor Accountant", type: "file" },
    { id: "glt-4-5", name: "Letter to Successor Accountant", type: "file" },
  ]},
  { id: "glt-audit", name: "Audit", type: "folder", isExpanded: true, children: [
    { id: "glt-audit-ca", name: "Canada", type: "folder", isExpanded: true, children: [
      { id: "glt-ca-1", name: "Audit Engagement Letter (CAS/ASPE)", type: "file" },
      { id: "glt-ca-2", name: "Audit Engagement Letter (CAS/ASNPO)", type: "file" },
      { id: "glt-ca-3", name: "Management Representation Letter (CAS 580)", type: "file" },
      { id: "glt-ca-4", name: "Communication with Those Charged with Governance — Planning (CAS 260)", type: "file" },
      { id: "glt-ca-5", name: "Communication with Those Charged with Governance — Final (CAS 260)", type: "file" },
      { id: "glt-ca-6", name: "Inquiry to Legal Counsel (Lawyer's Letter)", type: "file" },
      { id: "glt-ca-7", name: "Communication to Predecessor Auditor", type: "file" },
      { id: "glt-ca-8", name: "Letter to Management — Significant Deficiencies (CAS 265)", type: "file" },
      { id: "glt-ca-9", name: "Letter to a predecessor accounting firm", type: "file" },
    ]},
    { id: "glt-audit-us", name: "United States", type: "folder", isExpanded: true, children: [
      { id: "glt-us-1", name: "Audit Engagement Letter (GAAS/US GAAP)", type: "file" },
      { id: "glt-us-2", name: "Management Representation Letter (AU-C 580)", type: "file" },
      { id: "glt-us-3", name: "Communication with Those Charged with Governance — Planning (AU-C 260)", type: "file" },
      { id: "glt-us-4", name: "Communication with Those Charged with Governance — Final (AU-C 260)", type: "file" },
      { id: "glt-us-5", name: "Inquiry to Legal Counsel", type: "file" },
      { id: "glt-us-6", name: "Letter to Management — Significant Deficiencies (AU-C 265)", type: "file" },
      { id: "glt-us-7", name: "Communication to Predecessor Auditor (AU-C 210)", type: "file" },
    ]},
  ]},
];

export const initialGlobalReports: GlobalTemplate[] = [
  {
    id: "grpt-compilation",
    name: "Compilation",
    type: "folder",
    isExpanded: true,
    children: [
      { id: "grpt-1-1", name: "Engagement Report", type: "file" },
    ],
  },
  {
    id: "grpt-review",
    name: "Review",
    type: "folder",
    isExpanded: true,
    children: [
      { id: "grpt-2-1", name: "Unqualified Report (ASPE)", type: "file" },
      { id: "grpt-2-2", name: "Modified Report (ASPE)", type: "file" },
      { id: "grpt-2-3", name: "Unqualified Report (ASNPO)", type: "file" },
      { id: "grpt-2-4", name: "Modified Report (ASNPO)", type: "file" },
      { id: "grpt-2-5", name: "Special purpose unqualified report", type: "file" },
      { id: "grpt-2-6", name: "Special purpose modified report", type: "file" },
    ],
  },
  {
    id: "grpt-audit",
    name: "Audit",
    type: "folder",
    isExpanded: true,
    children: [
      {
        id: "grpt-audit-ca",
        name: "Canada",
        type: "folder",
        isExpanded: true,
        children: [
          { id: "grpt-ca-1", name: "Unqualified Auditor's Report (ASPE)", type: "file" },
          { id: "grpt-ca-2", name: "Unqualified Auditor's Report (ASNPO)", type: "file" },
          { id: "grpt-ca-3", name: "Qualified Opinion — Material Misstatement", type: "file" },
          { id: "grpt-ca-4", name: "Qualified Opinion — Insufficient Evidence", type: "file" },
          { id: "grpt-ca-5", name: "Adverse Opinion", type: "file" },
          { id: "grpt-ca-6", name: "Disclaimer of Opinion", type: "file" },
          { id: "grpt-ca-7", name: "Auditor's Report — Emphasis of Matter", type: "file" },
          { id: "grpt-ca-8", name: "Auditor's Report — Other Matter Paragraph", type: "file" },
        ],
      },
      {
        id: "grpt-audit-us",
        name: "United States",
        type: "folder",
        isExpanded: true,
        children: [
          { id: "grpt-us-1", name: "Auditor's Report — Fair Presentation Framework (AU-C 700)", type: "file" },
          { id: "grpt-us-2", name: "Auditor's Report — Compliance Framework (AU-C 800)", type: "file" },
          { id: "grpt-us-3", name: "Qualified Opinion — Material Misstatement (Fair Presentation)", type: "file" },
          { id: "grpt-us-4", name: "Qualified Opinion — Material Misstatement (Compliance)", type: "file" },
          { id: "grpt-us-5", name: "Qualified Opinion — Insufficient Evidence", type: "file" },
          { id: "grpt-us-6", name: "Adverse Opinion", type: "file" },
          { id: "grpt-us-7", name: "Disclaimer of Opinion", type: "file" },
          { id: "grpt-us-8", name: "Auditor's Report with Key Audit Matters and Emphasis of Matter", type: "file" },
          { id: "grpt-us-9", name: "Qualified Opinion with Emphasis of Matter", type: "file" },
        ],
      },
    ],
  },
];
