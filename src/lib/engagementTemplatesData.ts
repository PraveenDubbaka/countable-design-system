// ── Engagement Templates Data ──
// All template views for the Engagement Templates page

export type CategoryType = "checklist" | "worksheet" | "letter" | "folder" | "module" | "financial-statement" | "report";

export interface TemplateRow {
  section: string;
  category: CategoryType;
  mappedTemplate: string;
}

export interface TemplateSection {
  name: string;
  rows: TemplateRow[];
}

export interface TemplateView {
  id: string;
  title: string;
  subtitle?: string;
  standardsBanner?: {
    label: string;
    standards: string;
    badge: string;
    color: "blue" | "green" | "red";
  };
  sections: TemplateSection[];
}

export interface TreeItem {
  id: string;
  label: string;
  type: "folder" | "file";
  children?: TreeItem[];
  
  isNew?: boolean;
}

export const categoryConfig: Record<CategoryType, { icon: string; label: string; className: string }> = {
  checklist: { icon: "☐", label: "Checklists", className: "bg-[#fff0eb] text-[#c4500a] border-[#fdd0b8]" },
  worksheet: { icon: "⊞", label: "Worksheets", className: "bg-[#eef0fb] text-[#4553c4] border-[#c8cdf5]" },
  letter: { icon: "✉", label: "Letters", className: "bg-[#f3eefb] text-[#7c3aed] border-[#d8c8f5]" },
  folder: { icon: "📁", label: "Folders", className: "bg-[#f1f5f9] text-[#475569] border-[#cbd5e0]" },
  module: { icon: "⚡", label: "Modules", className: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]" },
  "financial-statement": { icon: "📑", label: "Financial Statements", className: "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]" },
  report: { icon: "📋", label: "Reports", className: "bg-[#fdf2f8] text-[#9d174d] border-[#f5d0e8]" },
};

// ── Tree structure ──
export const templateTree: TreeItem[] = [
  {
    id: "compilation",
    label: "Compilation",
    type: "folder",
    children: [
      { id: "comp4200", label: "Compilation Section 4200", type: "file" },
    ],
  },
  {
    id: "review",
    label: "Review",
    type: "folder",
    children: [
      { id: "rev2400", label: "Review Section 2400", type: "file" },
    ],
  },
  {
    id: "audit",
    label: "Audit",
    type: "folder",
    isNew: true,
    children: [
      { id: "audit-ca", label: "Canada", type: "folder", children: [
        { id: "audit5100", label: "CAS / ASPE (5100)", type: "file" },
        { id: "audit5101", label: "CAS / NFP – ASNPO (5101)", type: "file" },
      ]},
      { id: "audit-us", label: "United States", type: "folder", children: [
        { id: "audit6100", label: "GAAS / US GAAP (6100)", type: "file" },
        { id: "audit6200", label: "PCAOB / SOX Public (6200)", type: "file" },
      ]},
    ],
  },
  {
    id: "tax",
    label: "Tax",
    type: "folder",
    children: [
      { id: "tax-t1", label: "T1 Personal Return", type: "file" },
      { id: "tax-t2", label: "T2 Corporate Return", type: "file" },
    ],
  },
];

// ── Review 2400 ──
const review2400: TemplateView = {
  id: "rev2400",
  title: "Review Section 2400",
  sections: [
    {
      name: "Client Onboarding",
      rows: [
        { section: "New engagement acceptance", category: "checklist", mappedTemplate: "New engagement acceptance Section 2400" },
        { section: "Existing engagement continuance", category: "checklist", mappedTemplate: "Existing engagement continuance Section 2400" },
        { section: "Engagement Letter", category: "letter", mappedTemplate: "Engagement review section 2400" },
      ],
    },
    {
      name: "Planning",
      rows: [
        { section: "Understanding the entity - Basics", category: "checklist", mappedTemplate: "Understanding the entity basics Section 2400" },
        { section: "Understanding the entity - Systems", category: "checklist", mappedTemplate: "Understanding the entity systems Section 2400" },
        { section: "Materiality", category: "worksheet", mappedTemplate: "Materiality Section 2400" },
        { section: "Engagement Scope", category: "worksheet", mappedTemplate: "Engagement scope section 2400" },
        { section: "Engagement Planning", category: "checklist", mappedTemplate: "Engagement Planning Section 2400" },
      ],
    },
    {
      name: "Documents",
      rows: [
        { section: "Shareholders Agreements", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Rental/Lease Agreements", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Incorporation Documents", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Banking Agreements", category: "folder", mappedTemplate: "No Selection required" },
      ],
    },
    {
      name: "Trial Balance & Adjusting entries",
      rows: [
        { section: "Trial Balance & Adjusting entries", category: "module", mappedTemplate: "Automated" },
      ],
    },
    {
      name: "Procedures",
      rows: [
        { section: "Procedures", category: "module", mappedTemplate: "Automated" },
      ],
    },
    {
      name: "Financial Statements",
      rows: [
        { section: "Financial Statement Docs", category: "financial-statement", mappedTemplate: "Review template" },
        { section: "Cover Page", category: "financial-statement", mappedTemplate: "Review template" },
        { section: "Table of Contents", category: "financial-statement", mappedTemplate: "Review template" },
        { section: "Review Engagement Report", category: "report", mappedTemplate: "Review Engagement Report Section 2400" },
        { section: "Balance Sheet", category: "financial-statement", mappedTemplate: "Review template" },
        { section: "Statement of Income (Loss) and Retained Earnings (Deficit)", category: "financial-statement", mappedTemplate: "Review template" },
        { section: "Statement of Cash Flows", category: "financial-statement", mappedTemplate: "Review template" },
        { section: "Notes to Financial Statements", category: "financial-statement", mappedTemplate: "Review template" },
      ],
    },
    {
      name: "Completion & Signoffs",
      rows: [
        { section: "Accumulation of Identified Misstatements (AIM)", category: "worksheet", mappedTemplate: "AIM Section 2400" },
        { section: "Management representation letter", category: "letter", mappedTemplate: "Management representation Section 2400" },
        { section: "Completion", category: "checklist", mappedTemplate: "Final Completion Section 2400" },
        { section: "Subsequent events", category: "checklist", mappedTemplate: "Subsequent events Section 2400" },
        { section: "Disclosure", category: "checklist", mappedTemplate: "ASPE -General - Disclosure checklist" },
        { section: "Signoffs", category: "module", mappedTemplate: "Automated" },
        { section: "Final Review", category: "module", mappedTemplate: "Automated" },
      ],
    },
  ],
};

// ── Audit 5100 (Canada CAS/ASPE) ──
const audit5100: TemplateView = {
  id: "audit5100",
  title: "Audit Section 5100",
  sections: [
    {
      name: "Client Onboarding",
      rows: [
        { section: "New engagement acceptance", category: "checklist", mappedTemplate: "New engagement acceptance Section 5100" },
        { section: "Existing engagement continuance", category: "checklist", mappedTemplate: "Existing engagement continuance Section 5100" },
        { section: "Independence & Ethical Requirements", category: "checklist", mappedTemplate: "Independence Section 5100" },
        { section: "Engagement Letter", category: "letter", mappedTemplate: "Audit engagement letter Section 5100" },
        { section: "Anti-Money Laundering (AML) Compliance", category: "checklist", mappedTemplate: "AML compliance Section 5100" },
      ],
    },
    {
      name: "Planning (400)",
      rows: [
        { section: "Understanding the entity - Basics", category: "checklist", mappedTemplate: "Understanding entity basics Section 5100" },
        { section: "Understanding the entity - Systems & Controls", category: "checklist", mappedTemplate: "Understanding entity systems Section 5100" },
        { section: "Understanding the entity - Industry & Environment", category: "checklist", mappedTemplate: "Industry environment Section 5100" },
        { section: "Materiality", category: "worksheet", mappedTemplate: "Materiality Section 5100" },
        { section: "Engagement Scope", category: "worksheet", mappedTemplate: "Engagement scope Section 5100" },
        { section: "Preliminary Analytical Procedures", category: "worksheet", mappedTemplate: "Preliminary analytics Section 5100" },
        { section: "Audit Strategy Memorandum", category: "checklist", mappedTemplate: "Audit strategy memo Section 5100" },
        { section: "Engagement Planning", category: "checklist", mappedTemplate: "Engagement planning Section 5100" },
        { section: "Staffing & Time Budget", category: "worksheet", mappedTemplate: "Staffing and budget Section 5100" },
        { section: "Communication with Those Charged with Governance", category: "letter", mappedTemplate: "TCWG planning communication Section 5100" },
      ],
    },
    {
      name: "Documents",
      rows: [
        { section: "Shareholders Agreements", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Rental/Lease Agreements", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Incorporation Documents", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Banking Agreements", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Contracts & Material Agreements", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Corporate Minute Book", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Regulatory & Compliance Filings", category: "folder", mappedTemplate: "No Selection required" },
      ],
    },
    {
      name: "Trial Balance & Adjusting Entries",
      rows: [
        { section: "Trial Balance & Adjusting Entries", category: "module", mappedTemplate: "Automated" },
        { section: "Audit Adjustments & Reclassifications", category: "worksheet", mappedTemplate: "AJE worksheet Section 5100" },
      ],
    },
    {
      name: "Risk Assessment (500)",
      rows: [
        { section: "Risk Assessment Procedures", category: "checklist", mappedTemplate: "Risk assessment Section 5100" },
        { section: "Understanding Internal Controls", category: "checklist", mappedTemplate: "Internal controls Section 5100" },
        { section: "IT General Controls (ITGC)", category: "checklist", mappedTemplate: "ITGC Section 5100" },
        { section: "Fraud Risk Assessment (CAS 240)", category: "checklist", mappedTemplate: "Fraud risk Section 5100" },
        { section: "Significant Risks Register", category: "worksheet", mappedTemplate: "Significant risks worksheet Section 5100" },
        { section: "Risk of Material Misstatement (RMM)", category: "worksheet", mappedTemplate: "RMM worksheet Section 5100" },
        { section: "SCOT – Revenue Cycle", category: "checklist", mappedTemplate: "SCOT revenue Section 5100" },
        { section: "SCOT – Expenditure Cycle", category: "checklist", mappedTemplate: "SCOT expenditure Section 5100" },
        { section: "SCOT – Payroll Cycle", category: "checklist", mappedTemplate: "SCOT payroll Section 5100" },
        { section: "Going Concern (Initial Assessment)", category: "checklist", mappedTemplate: "Going concern Section 5100" },
      ],
    },
    {
      name: "Response to Assessed Risks (600)",
      rows: [
        { section: "Overall Audit Response", category: "checklist", mappedTemplate: "Overall response Section 5100" },
        { section: "Test of Controls", category: "module", mappedTemplate: "Automated" },
        { section: "Substantive Analytical Procedures", category: "worksheet", mappedTemplate: "SAP Section 5100" },
        { section: "Test of Details – Revenue", category: "worksheet", mappedTemplate: "ToD revenue Section 5100" },
        { section: "Test of Details – Expenses", category: "worksheet", mappedTemplate: "ToD expenses Section 5100" },
        { section: "Audit Procedures Summary", category: "module", mappedTemplate: "Automated" },
      ],
    },
    {
      name: "Working Papers – Assets (A–Z)",
      rows: [
        { section: "A – Cash & Bank Reconciliation", category: "worksheet", mappedTemplate: "Cash Section 5100" },
        { section: "B – Accounts Receivable & Confirmations", category: "worksheet", mappedTemplate: "AR Section 5100" },
        { section: "C – Inventory & Observation", category: "worksheet", mappedTemplate: "Inventory Section 5100" },
        { section: "D – Prepaid Expenses", category: "worksheet", mappedTemplate: "Prepaid Section 5100" },
        { section: "E – Other Current Assets", category: "worksheet", mappedTemplate: "Other current assets Section 5100" },
        { section: "F – Long-Term Assets / PP&E Roll-forward", category: "worksheet", mappedTemplate: "PP&E roll-forward Section 5100" },
        { section: "G – Intangible Assets & Goodwill", category: "worksheet", mappedTemplate: "Intangibles Section 5100" },
        { section: "H – Investments", category: "worksheet", mappedTemplate: "Investments Section 5100" },
      ],
    },
    {
      name: "Working Papers – Liabilities & Equity (AA–ZZ)",
      rows: [
        { section: "AA – Accounts Payable & Accrued Liabilities", category: "worksheet", mappedTemplate: "AP accruals Section 5100" },
        { section: "BB – Long-Term Debt & Covenant Compliance", category: "worksheet", mappedTemplate: "LTD covenants Section 5100" },
        { section: "CC – Deferred Revenue", category: "worksheet", mappedTemplate: "Deferred revenue Section 5100" },
        { section: "DD – Income Taxes & Deferred Tax", category: "worksheet", mappedTemplate: "Income taxes Section 5100" },
        { section: "EE – Other Liabilities & Provisions", category: "worksheet", mappedTemplate: "Other liabilities Section 5100" },
        { section: "FF – Share Capital & Equity Roll-forward", category: "worksheet", mappedTemplate: "Equity Section 5100" },
        { section: "GG – Related Party Transactions", category: "worksheet", mappedTemplate: "RPT Section 5100" },
      ],
    },
    {
      name: "Working Papers – Income Statement (700–799)",
      rows: [
        { section: "700 – Revenue Testing", category: "worksheet", mappedTemplate: "Revenue Section 5100" },
        { section: "710 – Cost of Sales / COGS", category: "worksheet", mappedTemplate: "COGS Section 5100" },
        { section: "720 – Payroll & Benefits", category: "worksheet", mappedTemplate: "Payroll Section 5100" },
        { section: "730 – Operating Expenses", category: "worksheet", mappedTemplate: "OpEx Section 5100" },
        { section: "740 – Depreciation & Amortization", category: "worksheet", mappedTemplate: "D&A Section 5100" },
        { section: "750 – Interest & Finance Costs", category: "worksheet", mappedTemplate: "Finance costs Section 5100" },
        { section: "760 – Other Income & Gains", category: "worksheet", mappedTemplate: "Other income Section 5100" },
      ],
    },
    {
      name: "Financial Statements",
      rows: [
        { section: "Financial Statement Docs", category: "financial-statement", mappedTemplate: "Audit template" },
        { section: "Cover Page", category: "financial-statement", mappedTemplate: "Audit template" },
        { section: "Table of Contents", category: "financial-statement", mappedTemplate: "Audit template" },
        { section: "Independent Auditor's Report", category: "report", mappedTemplate: "Auditor's Report Section 5100" },
        { section: "Balance Sheet", category: "financial-statement", mappedTemplate: "Audit template" },
        { section: "Statement of Income (Loss) and Retained Earnings (Deficit)", category: "financial-statement", mappedTemplate: "Audit template" },
        { section: "Statement of Cash Flows", category: "financial-statement", mappedTemplate: "Audit template" },
        { section: "Statement of Changes in Equity", category: "financial-statement", mappedTemplate: "Audit template" },
        { section: "Notes to Financial Statements", category: "financial-statement", mappedTemplate: "Audit template" },
      ],
    },
    {
      name: "Completion & Signoffs (300)",
      rows: [
        { section: "Accumulation of Identified Misstatements (AIM)", category: "worksheet", mappedTemplate: "AIM Section 5100" },
        { section: "Final Analytical Review", category: "worksheet", mappedTemplate: "Final analytical review Section 5100" },
        { section: "Subsequent Events", category: "checklist", mappedTemplate: "Subsequent events Section 5100" },
        { section: "Going Concern (Final Assessment)", category: "checklist", mappedTemplate: "Going concern final Section 5100" },
        { section: "Management Representation Letter", category: "letter", mappedTemplate: "Management representation Section 5100" },
        { section: "Communication with Those Charged with Governance", category: "letter", mappedTemplate: "TCWG final communication Section 5100" },
        { section: "Completion Checklist", category: "checklist", mappedTemplate: "Final completion Section 5100" },
        { section: "Disclosure Checklist", category: "checklist", mappedTemplate: "ASPE – General disclosure checklist" },
        { section: "Quality Control Review", category: "checklist", mappedTemplate: "EQCR checklist Section 5100" },
        { section: "Signoffs", category: "module", mappedTemplate: "Automated" },
        { section: "Final Review", category: "module", mappedTemplate: "Automated" },
        { section: "Archive & Lock File", category: "module", mappedTemplate: "Automated" },
      ],
    },
  ],
};

// ── Audit 5101 (Canada NFP/ASNPO) ──
const audit5101: TemplateView = {
  id: "audit5101",
  title: "Audit Section 5101",
  subtitle: "🇨🇦 Canada · CAS (Canadian Auditing Standards) · ASNPO (Not-for-Profit)",
  standardsBanner: {
    label: "📋 Standards covered:",
    standards: "CAS 200–810 · ASNPO (Handbook Part III) · CSAS 5100 · CAS 700 Auditor's Report",
    badge: "NFP Specific",
    color: "blue",
  },
  sections: [
    {
      name: "Client Onboarding",
      rows: [
        { section: "New engagement acceptance", category: "checklist", mappedTemplate: "New engagement acceptance Section 5101" },
        { section: "Independence & Ethical Requirements (APES equivalent)", category: "checklist", mappedTemplate: "Independence Section 5101" },
        { section: "Engagement Letter", category: "letter", mappedTemplate: "NFP audit engagement letter Section 5101" },
        { section: "Understanding of NFP Governance Structure", category: "checklist", mappedTemplate: "NFP governance Section 5101" },
        { section: "Grant & Funding Source Identification", category: "folder", mappedTemplate: "No Selection required" },
      ],
    },
    {
      name: "Planning (400)",
      rows: [
        { section: "Understanding the Entity – NFP Operations", category: "checklist", mappedTemplate: "NFP understanding Section 5101" },
        { section: "Materiality (ASNPO basis)", category: "worksheet", mappedTemplate: "Materiality Section 5101" },
        { section: "Fund Accounting & Restricted Net Assets", category: "checklist", mappedTemplate: "Fund accounting Section 5101" },
        { section: "Audit Strategy Memorandum", category: "checklist", mappedTemplate: "Audit strategy memo Section 5101" },
        { section: "Preliminary Analytical Procedures", category: "worksheet", mappedTemplate: "Preliminary analytics Section 5101" },
      ],
    },
    {
      name: "Documents",
      rows: [
        { section: "Grant Agreements & Funding Letters", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Board Minutes & Resolutions", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Charitable Registration & Compliance Filings (T3010)", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Bylaws & Constitution", category: "folder", mappedTemplate: "No Selection required" },
      ],
    },
    {
      name: "Trial Balance & Adjusting Entries",
      rows: [
        { section: "Trial Balance & Adjusting Entries", category: "module", mappedTemplate: "Automated" },
        { section: "Fund Segregation & Inter-fund Transfers", category: "worksheet", mappedTemplate: "Fund worksheet Section 5101" },
      ],
    },
    {
      name: "Risk Assessment (500)",
      rows: [
        { section: "Risk Assessment Procedures (CAS 315)", category: "checklist", mappedTemplate: "Risk assessment Section 5101" },
        { section: "Fraud Risk Assessment (CAS 240)", category: "checklist", mappedTemplate: "Fraud risk Section 5101" },
        { section: "Significant Risks Register", category: "worksheet", mappedTemplate: "Significant risks Section 5101" },
        { section: "Revenue & Grant Recognition Risk (ASNPO s.4210)", category: "checklist", mappedTemplate: "Grant revenue risk Section 5101" },
        { section: "Internal Controls – Volunteer Environment", category: "checklist", mappedTemplate: "IC volunteer Section 5101" },
      ],
    },
    {
      name: "Working Papers – Assets, Liabilities & NFP-Specific Areas",
      rows: [
        { section: "A – Cash & Bank Reconciliation", category: "worksheet", mappedTemplate: "Cash Section 5101" },
        { section: "B – Grants Receivable & Pledges", category: "worksheet", mappedTemplate: "Grants receivable Section 5101" },
        { section: "C – Restricted & Endowment Funds (ASNPO s.4400)", category: "worksheet", mappedTemplate: "Restricted funds Section 5101" },
        { section: "D – Capital Assets (ASNPO s.4431)", category: "worksheet", mappedTemplate: "Capital assets Section 5101" },
        { section: "E – Deferred Revenue & Contributions (ASNPO s.4210)", category: "worksheet", mappedTemplate: "Deferred contributions Section 5101" },
        { section: "F – Accounts Payable & Accrued Liabilities", category: "worksheet", mappedTemplate: "AP Section 5101" },
        { section: "G – Grant & Government Funding Revenue Testing", category: "worksheet", mappedTemplate: "Grant revenue Section 5101" },
        { section: "H – Donation & Fundraising Revenue", category: "worksheet", mappedTemplate: "Donation revenue Section 5101" },
      ],
    },
    {
      name: "Financial Statements (ASNPO)",
      rows: [
        { section: "Financial Statement Docs", category: "financial-statement", mappedTemplate: "NFP audit template" },
        { section: "Independent Auditor's Report (CAS 700)", category: "report", mappedTemplate: "Auditor's Report NFP Section 5101" },
        { section: "Statement of Financial Position", category: "financial-statement", mappedTemplate: "NFP audit template" },
        { section: "Statement of Operations", category: "financial-statement", mappedTemplate: "NFP audit template" },
        { section: "Statement of Changes in Net Assets", category: "financial-statement", mappedTemplate: "NFP audit template" },
        { section: "Statement of Cash Flows", category: "financial-statement", mappedTemplate: "NFP audit template" },
        { section: "Notes to Financial Statements", category: "financial-statement", mappedTemplate: "NFP audit template" },
      ],
    },
    {
      name: "Completion & Signoffs (300)",
      rows: [
        { section: "Accumulation of Identified Misstatements (CAS 450)", category: "worksheet", mappedTemplate: "AIM Section 5101" },
        { section: "Subsequent Events (CAS 560)", category: "checklist", mappedTemplate: "Subsequent events Section 5101" },
        { section: "Going Concern (CAS 570)", category: "checklist", mappedTemplate: "Going concern Section 5101" },
        { section: "Management Representation Letter (CAS 580)", category: "letter", mappedTemplate: "Management representation Section 5101" },
        { section: "Charitable Compliance & T3010 Review", category: "checklist", mappedTemplate: "T3010 compliance Section 5101" },
        { section: "Completion Checklist", category: "checklist", mappedTemplate: "Final completion Section 5101" },
        { section: "ASNPO Disclosure Checklist", category: "checklist", mappedTemplate: "ASNPO disclosure checklist" },
        { section: "Signoffs", category: "module", mappedTemplate: "Automated" },
        { section: "Final Review", category: "module", mappedTemplate: "Automated" },
      ],
    },
  ],
};

// ── Audit 6100 (US GAAS / US GAAP) ──
const audit6100: TemplateView = {
  id: "audit6100",
  title: "Audit Section 6100",
  subtitle: "🇺🇸 United States · GAAS (AU-C Sections) · US GAAP (ASC) · Private Companies",
  standardsBanner: {
    label: "📋 Standards covered:",
    standards: "AICPA AU-C 200–810 · US GAAP / ASC · SAS No. 145 (Risk) · SAS No. 142 (Audit Evidence) · SSAE 18",
    badge: "Private / Non-Issuer",
    color: "green",
  },
  sections: [
    {
      name: "Client Onboarding",
      rows: [
        { section: "Client Acceptance & Continuance (AU-C 210)", category: "checklist", mappedTemplate: "Client acceptance Section 6100" },
        { section: "Independence Confirmation (ET §1.200)", category: "checklist", mappedTemplate: "Independence Section 6100" },
        { section: "Engagement Letter / Terms of Engagement (AU-C 210)", category: "letter", mappedTemplate: "Engagement letter Section 6100" },
        { section: "Anti-Money Laundering (BSA / FinCEN Compliance)", category: "checklist", mappedTemplate: "AML BSA Section 6100" },
        { section: "Prior Auditor Communication (AU-C 510)", category: "letter", mappedTemplate: "Prior auditor communication Section 6100" },
      ],
    },
    {
      name: "Planning (AU-C 300)",
      rows: [
        { section: "Understanding Entity & Environment (AU-C 315 / SAS 145)", category: "checklist", mappedTemplate: "Entity understanding Section 6100" },
        { section: "Understanding Internal Control – COSO Framework (AU-C 315)", category: "checklist", mappedTemplate: "IC COSO Section 6100" },
        { section: "IT Systems & General Controls (AU-C 315)", category: "checklist", mappedTemplate: "IT controls Section 6100" },
        { section: "Materiality & Performance Materiality (AU-C 320)", category: "worksheet", mappedTemplate: "Materiality Section 6100" },
        { section: "Engagement Team Discussion / Brainstorming (AU-C 240)", category: "checklist", mappedTemplate: "Team discussion Section 6100" },
        { section: "Audit Plan (AU-C 300)", category: "checklist", mappedTemplate: "Audit plan Section 6100" },
        { section: "Preliminary Analytical Procedures (AU-C 520)", category: "worksheet", mappedTemplate: "Preliminary analytics Section 6100" },
        { section: "Staffing & Time Budget", category: "worksheet", mappedTemplate: "Staffing budget Section 6100" },
      ],
    },
    {
      name: "Documents",
      rows: [
        { section: "Shareholder / Operating Agreements", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Articles of Incorporation & Bylaws", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Debt Agreements & Loan Covenants", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Lease Agreements (ASC 842)", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Material Contracts & Agreements", category: "folder", mappedTemplate: "No Selection required" },
        { section: "Bank & Financial Institution Confirmations", category: "folder", mappedTemplate: "No Selection required" },
      ],
    },
    {
      name: "Trial Balance & Adjusting Entries",
      rows: [
        { section: "Trial Balance & Adjusting Entries", category: "module", mappedTemplate: "Automated" },
        { section: "Proposed Audit Adjustments & Reclassifications", category: "worksheet", mappedTemplate: "AJE worksheet Section 6100" },
      ],
    },
    {
      name: "Risk Assessment (AU-C 315 / SAS 145)",
      rows: [
        { section: "Risk Assessment Procedures (AU-C 315)", category: "checklist", mappedTemplate: "Risk assessment Section 6100" },
        { section: "Inherent Risk & Risk of Material Misstatement", category: "worksheet", mappedTemplate: "RMM worksheet Section 6100" },
        { section: "Fraud Risk Assessment (AU-C 240 / SAS 122)", category: "checklist", mappedTemplate: "Fraud risk Section 6100" },
        { section: "Revenue Recognition – Significant Risk (ASC 606 / AU-C 240)", category: "checklist", mappedTemplate: "Revenue recognition risk Section 6100" },
        { section: "Going Concern – Initial Assessment (AU-C 570)", category: "checklist", mappedTemplate: "Going concern Section 6100" },
        { section: "SCOT – Revenue & Accounts Receivable Cycle", category: "checklist", mappedTemplate: "SCOT revenue Section 6100" },
        { section: "SCOT – Purchases, Payables & Disbursements", category: "checklist", mappedTemplate: "SCOT purchases Section 6100" },
        { section: "SCOT – Payroll & Human Resources", category: "checklist", mappedTemplate: "SCOT payroll Section 6100" },
        { section: "SCOT – Inventory & Cost of Sales", category: "checklist", mappedTemplate: "SCOT inventory Section 6100" },
        { section: "Significant Risks Register", category: "worksheet", mappedTemplate: "Significant risks Section 6100" },
      ],
    },
    {
      name: "Response to Assessed Risks (AU-C 330)",
      rows: [
        { section: "Overall Response to Assessed Risks (AU-C 330)", category: "checklist", mappedTemplate: "Overall response Section 6100" },
        { section: "Test of Controls (AU-C 330)", category: "module", mappedTemplate: "Automated" },
        { section: "Substantive Analytical Procedures (AU-C 520)", category: "worksheet", mappedTemplate: "SAP Section 6100" },
        { section: "Test of Details – Revenue (ASC 606)", category: "worksheet", mappedTemplate: "ToD revenue Section 6100" },
        { section: "Test of Details – Expenses & Disbursements", category: "worksheet", mappedTemplate: "ToD expenses Section 6100" },
        { section: "External Confirmations (AU-C 505)", category: "letter", mappedTemplate: "Confirmation letters Section 6100" },
        { section: "Audit Procedures Summary", category: "module", mappedTemplate: "Automated" },
      ],
    },
    {
      name: "Working Papers – Balance Sheet (ASC)",
      rows: [
        { section: "A – Cash & Cash Equivalents (ASC 230)", category: "worksheet", mappedTemplate: "Cash Section 6100" },
        { section: "B – Accounts Receivable & Allowances (ASC 310)", category: "worksheet", mappedTemplate: "AR Section 6100" },
        { section: "C – Inventory (ASC 330)", category: "worksheet", mappedTemplate: "Inventory Section 6100" },
        { section: "D – Prepaid Expenses & Other Current Assets", category: "worksheet", mappedTemplate: "Prepaid Section 6100" },
        { section: "E – Property, Plant & Equipment (ASC 360)", category: "worksheet", mappedTemplate: "PP&E Section 6100" },
        { section: "F – Goodwill & Intangible Assets (ASC 350)", category: "worksheet", mappedTemplate: "Goodwill Section 6100" },
        { section: "G – Right-of-Use Assets & Lease Liabilities (ASC 842)", category: "worksheet", mappedTemplate: "Leases ASC 842 Section 6100" },
        { section: "H – Investments (ASC 320 / 321 / 323)", category: "worksheet", mappedTemplate: "Investments Section 6100" },
        { section: "I – Accounts Payable & Accrued Liabilities", category: "worksheet", mappedTemplate: "AP accruals Section 6100" },
        { section: "J – Long-Term Debt & Credit Facilities (ASC 470)", category: "worksheet", mappedTemplate: "LTD Section 6100" },
        { section: "K – Income Taxes & Deferred Tax (ASC 740)", category: "worksheet", mappedTemplate: "Income taxes ASC 740 Section 6100" },
        { section: "L – Stockholders' Equity & Share Capital", category: "worksheet", mappedTemplate: "Equity Section 6100" },
        { section: "M – Related Party Transactions (ASC 850)", category: "worksheet", mappedTemplate: "RPT Section 6100" },
        { section: "N – Commitments & Contingencies (ASC 450)", category: "worksheet", mappedTemplate: "Contingencies Section 6100" },
      ],
    },
    {
      name: "Working Papers – Income Statement (ASC)",
      rows: [
        { section: "700 – Revenue (ASC 606)", category: "worksheet", mappedTemplate: "Revenue ASC 606 Section 6100" },
        { section: "710 – Cost of Revenue / COGS", category: "worksheet", mappedTemplate: "COGS Section 6100" },
        { section: "720 – Payroll & Benefits", category: "worksheet", mappedTemplate: "Payroll Section 6100" },
        { section: "730 – Stock-Based Compensation (ASC 718)", category: "worksheet", mappedTemplate: "SBC ASC 718 Section 6100" },
        { section: "740 – R&D Expenses (ASC 730)", category: "worksheet", mappedTemplate: "R&D Section 6100" },
        { section: "750 – Operating Expenses (SG&A)", category: "worksheet", mappedTemplate: "OpEx Section 6100" },
        { section: "760 – Interest & Other Income / Expense", category: "worksheet", mappedTemplate: "Other income Section 6100" },
      ],
    },
    {
      name: "Financial Statements (US GAAP)",
      rows: [
        { section: "Financial Statement Docs", category: "financial-statement", mappedTemplate: "US GAAP audit template" },
        { section: "Cover Page", category: "financial-statement", mappedTemplate: "US GAAP audit template" },
        { section: "Independent Auditor's Report (AU-C 700 / SAS 134)", category: "report", mappedTemplate: "Auditor's Report US GAAS Section 6100" },
        { section: "Balance Sheet", category: "financial-statement", mappedTemplate: "US GAAP audit template" },
        { section: "Income Statement", category: "financial-statement", mappedTemplate: "US GAAP audit template" },
        { section: "Statement of Comprehensive Income", category: "financial-statement", mappedTemplate: "US GAAP audit template" },
        { section: "Statement of Cash Flows (ASC 230)", category: "financial-statement", mappedTemplate: "US GAAP audit template" },
        { section: "Statement of Stockholders' Equity", category: "financial-statement", mappedTemplate: "US GAAP audit template" },
        { section: "Notes to Financial Statements", category: "financial-statement", mappedTemplate: "US GAAP audit template" },
      ],
    },
    {
      name: "Completion & Signoffs (AU-C 700–810)",
      rows: [
        { section: "Accumulation of Misstatements (AU-C 450)", category: "worksheet", mappedTemplate: "AIM Section 6100" },
        { section: "Final Analytical Review (AU-C 520)", category: "worksheet", mappedTemplate: "Final analytical review Section 6100" },
        { section: "Subsequent Events (AU-C 560 / ASC 855)", category: "checklist", mappedTemplate: "Subsequent events Section 6100" },
        { section: "Going Concern – Final Assessment (AU-C 570)", category: "checklist", mappedTemplate: "Going concern final Section 6100" },
        { section: "Management Representation Letter (AU-C 580)", category: "letter", mappedTemplate: "Management rep letter Section 6100" },
        { section: "Communication with Those Charged with Governance (AU-C 265 / 260)", category: "letter", mappedTemplate: "TCWG communication Section 6100" },
        { section: "Communicating Internal Control Deficiencies (AU-C 265)", category: "letter", mappedTemplate: "IC deficiency letter Section 6100" },
        { section: "Completion Checklist (AU-C 220)", category: "checklist", mappedTemplate: "Final completion Section 6100" },
        { section: "US GAAP Disclosure Checklist", category: "checklist", mappedTemplate: "US GAAP disclosure checklist" },
        { section: "Engagement Quality Review (EQR) (AU-C 220)", category: "checklist", mappedTemplate: "EQR checklist Section 6100" },
        { section: "Signoffs", category: "module", mappedTemplate: "Automated" },
        { section: "Final Review", category: "module", mappedTemplate: "Automated" },
      ],
    },
  ],
};

// ── Audit 6200 (US PCAOB / SOX) ──
const audit6200: TemplateView = {
  id: "audit6200",
  title: "Audit Section 6200",
  subtitle: "🇺🇸 United States · PCAOB Auditing Standards · SOX Compliance · SEC Issuers / Public Companies",
  standardsBanner: {
    label: "📋 Standards covered:",
    standards: "PCAOB AS 1000–9000 · SOX §302 / §404 · SEC Rules · AS 2201 (ICFR) · AS 3101 (CAMs) · AS 2415 (Going Concern)",
    badge: "Public / SEC Issuer",
    color: "red",
  },
  sections: [
    {
      name: "Client Onboarding & Independence",
      rows: [
        { section: "Client Acceptance & Continuance (AS 2101)", category: "checklist", mappedTemplate: "Client acceptance PCAOB Section 6200" },
        { section: "Independence – SEC & PCAOB Rules (Rule 3500T)", category: "checklist", mappedTemplate: "Independence PCAOB Section 6200" },
        { section: "Engagement Letter / Terms of Engagement", category: "letter", mappedTemplate: "Engagement letter PCAOB Section 6200" },
        { section: "Audit Committee Pre-Approval & Communication", category: "letter", mappedTemplate: "Audit committee communication Section 6200" },
        { section: "Prior Auditor Communication (AS 2610)", category: "letter", mappedTemplate: "Prior auditor Section 6200" },
      ],
    },
    {
      name: "Planning (AS 2101)",
      rows: [
        { section: "Understanding the Company & Business (AS 2110)", category: "checklist", mappedTemplate: "Entity understanding PCAOB Section 6200" },
        { section: "Understanding ICFR – COSO 2013 Framework (AS 2201)", category: "checklist", mappedTemplate: "ICFR planning Section 6200" },
        { section: "Materiality (AS 2105)", category: "worksheet", mappedTemplate: "Materiality PCAOB Section 6200" },
        { section: "Audit Planning Memorandum (AS 2101)", category: "checklist", mappedTemplate: "Audit plan PCAOB Section 6200" },
        { section: "Preliminary Analytical Procedures (AS 2110)", category: "worksheet", mappedTemplate: "Preliminary analytics PCAOB Section 6200" },
        { section: "Engagement Team & Specialists", category: "checklist", mappedTemplate: "Team structure Section 6200" },
      ],
    },
    {
      name: "Internal Control over Financial Reporting (AS 2201 / SOX §404)",
      rows: [
        { section: "Scoping – Significant Accounts & Disclosures (AS 2201)", category: "worksheet", mappedTemplate: "ICFR scoping Section 6200" },
        { section: "Entity-Level Controls Assessment (AS 2201)", category: "checklist", mappedTemplate: "ELC assessment Section 6200" },
        { section: "IT General Controls – SOX ITGC (AS 2201)", category: "checklist", mappedTemplate: "ITGC SOX Section 6200" },
        { section: "Control Testing – Design & Operating Effectiveness", category: "module", mappedTemplate: "Automated" },
        { section: "SOX §302 – Sub-Certifications (CEO/CFO)", category: "checklist", mappedTemplate: "SOX 302 certifications Section 6200" },
        { section: "SOX §404(b) – Management Assessment Review", category: "worksheet", mappedTemplate: "SOX 404 assessment Section 6200" },
        { section: "Control Deficiency Classification (SD / MW)", category: "worksheet", mappedTemplate: "Control deficiency Section 6200" },
      ],
    },
    {
      name: "Risk Assessment (AS 2110)",
      rows: [
        { section: "Risk Assessment – Significant Accounts (AS 2110)", category: "checklist", mappedTemplate: "Risk assessment PCAOB Section 6200" },
        { section: "Fraud Risk Assessment (AS 2401)", category: "checklist", mappedTemplate: "Fraud risk PCAOB Section 6200" },
        { section: "Revenue Recognition Risk (ASC 606 / AS 2401)", category: "checklist", mappedTemplate: "Revenue recognition PCAOB Section 6200" },
        { section: "Significant Risks Register & Assertions", category: "worksheet", mappedTemplate: "Significant risks PCAOB Section 6200" },
      ],
    },
    {
      name: "Substantive Procedures & Working Papers",
      rows: [
        { section: "A – Cash & Cash Equivalents (ASC 230)", category: "worksheet", mappedTemplate: "Cash PCAOB Section 6200" },
        { section: "B – Accounts Receivable (ASC 310 / ASC 326 CECL)", category: "worksheet", mappedTemplate: "AR CECL Section 6200" },
        { section: "C – Inventory (ASC 330)", category: "worksheet", mappedTemplate: "Inventory Section 6200" },
        { section: "D – PP&E (ASC 360) & Impairment", category: "worksheet", mappedTemplate: "PP&E Section 6200" },
        { section: "E – Goodwill & Intangibles (ASC 350) & Impairment Testing", category: "worksheet", mappedTemplate: "Goodwill impairment Section 6200" },
        { section: "F – Right-of-Use Assets (ASC 842)", category: "worksheet", mappedTemplate: "ROU assets Section 6200" },
        { section: "G – Revenue (ASC 606) – 5-Step Model Testing", category: "worksheet", mappedTemplate: "Revenue ASC 606 Section 6200" },
        { section: "H – Income Taxes (ASC 740) & Uncertain Tax Positions", category: "worksheet", mappedTemplate: "Tax ASC 740 Section 6200" },
        { section: "I – Stock-Based Compensation (ASC 718)", category: "worksheet", mappedTemplate: "SBC ASC 718 Section 6200" },
        { section: "J – Equity & Earnings Per Share (ASC 260)", category: "worksheet", mappedTemplate: "EPS Section 6200" },
        { section: "K – Debt & Covenants (ASC 470)", category: "worksheet", mappedTemplate: "Debt Section 6200" },
        { section: "L – Segment Reporting (ASC 280)", category: "worksheet", mappedTemplate: "Segments Section 6200" },
        { section: "M – Related Party Transactions (ASC 850)", category: "worksheet", mappedTemplate: "RPT Section 6200" },
        { section: "N – Fair Value Measurements (ASC 820)", category: "worksheet", mappedTemplate: "Fair value Section 6200" },
      ],
    },
    {
      name: "Financial Statements (US GAAP / SEC)",
      rows: [
        { section: "Financial Statement Docs", category: "financial-statement", mappedTemplate: "PCAOB audit template" },
        { section: "Independent Auditor's Report (AS 3101 + CAMs)", category: "report", mappedTemplate: "Auditor's Report PCAOB Section 6200" },
        { section: "Report on ICFR (AS 2201)", category: "report", mappedTemplate: "ICFR Report Section 6200" },
        { section: "Balance Sheet", category: "financial-statement", mappedTemplate: "PCAOB audit template" },
        { section: "Income Statement", category: "financial-statement", mappedTemplate: "PCAOB audit template" },
        { section: "Statement of Comprehensive Income", category: "financial-statement", mappedTemplate: "PCAOB audit template" },
        { section: "Statement of Cash Flows", category: "financial-statement", mappedTemplate: "PCAOB audit template" },
        { section: "Statement of Stockholders' Equity", category: "financial-statement", mappedTemplate: "PCAOB audit template" },
        { section: "Notes to Financial Statements", category: "financial-statement", mappedTemplate: "PCAOB audit template" },
      ],
    },
    {
      name: "Completion & Signoffs (AS 1215 / AS 1301)",
      rows: [
        { section: "Accumulation of Misstatements (AS 2810)", category: "worksheet", mappedTemplate: "AIM PCAOB Section 6200" },
        { section: "Final Analytical Review", category: "worksheet", mappedTemplate: "Final analytical PCAOB Section 6200" },
        { section: "Subsequent Events (AS 2801)", category: "checklist", mappedTemplate: "Subsequent events PCAOB Section 6200" },
        { section: "Going Concern (AS 2415)", category: "checklist", mappedTemplate: "Going concern PCAOB Section 6200" },
        { section: "Management Representation Letter (AS 2805)", category: "letter", mappedTemplate: "Management rep PCAOB Section 6200" },
        { section: "Communication with Audit Committee (AS 1301)", category: "letter", mappedTemplate: "Audit committee final Section 6200" },
        { section: "Communicating Control Deficiencies (AS 1305)", category: "letter", mappedTemplate: "Control deficiency letter Section 6200" },
        { section: "Critical Audit Matters (CAMs) Documentation (AS 3101)", category: "checklist", mappedTemplate: "CAMs documentation Section 6200" },
        { section: "Completion Checklist", category: "checklist", mappedTemplate: "Final completion PCAOB Section 6200" },
        { section: "PCAOB Inspection Readiness Checklist", category: "checklist", mappedTemplate: "PCAOB inspection readiness Section 6200" },
        { section: "Engagement Quality Review (EQR) (AS 1220)", category: "checklist", mappedTemplate: "EQR PCAOB Section 6200" },
        { section: "Signoffs", category: "module", mappedTemplate: "Automated" },
        { section: "Final Review", category: "module", mappedTemplate: "Automated" },
        { section: "Archive & Lock File", category: "module", mappedTemplate: "Automated" },
      ],
    },
  ],
};

export const allTemplateViews: Record<string, TemplateView> = {
  rev2400: review2400,
  audit5100,
  audit5101,
  audit6100,
  audit6200,
};
