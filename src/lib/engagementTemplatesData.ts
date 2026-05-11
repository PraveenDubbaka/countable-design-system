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

export interface EditableTemplateRow {
  id: string;
  section: string;
  category: CategoryType;
  mappedTemplate: string;
  isPending?: boolean; // newly added, not yet named
}

export interface EditableTemplateSection {
  id: string;
  name: string;
  rows: EditableTemplateRow[];
}

export interface MyEngagementTemplate {
  id: string;
  name: string;
  folderId: string;
  folderName: string;
  sections: EditableTemplateSection[];
  subtitle?: string;
  standardsBanner?: {
    label: string;
    standards: string;
    badge: string;
    color: "blue" | "green" | "red";
  };
  sourceTemplateId?: string;
  createdAt: string;
  updatedAt: string;
}

export function templateViewToMyTemplate(
  view: TemplateView,
  folderId: string,
  folderName: string,
  id?: string
): MyEngagementTemplate {
  const now = new Date().toISOString();
  return {
    id: id || `my-eng-${Date.now()}`,
    name: view.title,
    folderId,
    folderName,
    sections: view.sections.map((s, si) => ({
      id: `sec-${si}-${Date.now()}`,
      name: s.name,
      rows: s.rows.map((r, ri) => ({
        id: `row-${si}-${ri}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        section: r.section,
        category: r.category,
        mappedTemplate: r.mappedTemplate,
      })),
    })),
    subtitle: view.subtitle,
    standardsBanner: view.standardsBanner,
    sourceTemplateId: view.id,
    createdAt: now,
    updatedAt: now,
  };
}

export const categoryConfig: Record<CategoryType, { icon: string; label: string; className: string }> = {
  checklist: { icon: "☐", label: "Checklists", className: "bg-[#fef3ee] text-[#c4500a] border-[#e8843a]" },
  worksheet: { icon: "⊞", label: "Worksheets", className: "bg-[#eef1fb] text-[#4553c4] border-[#7b8ad4]" },
  letter: { icon: "✉", label: "Letters", className: "bg-[#eef1fb] text-[#4553c4] border-[#7b8ad4]" },
  folder: { icon: "📁", label: "Folders", className: "bg-[#f3f4f6] text-[#475569] border-[#9ca3af]" },
  module: { icon: "⊞", label: "Modules", className: "bg-[#fef9eb] text-[#b45309] border-[#e8a830]" },
  "financial-statement": { icon: "📄", label: "Financial Statements", className: "bg-[#eff6ff] text-[#2563eb] border-[#60a5fa]" },
  report: { icon: "📋", label: "Reports", className: "bg-[#fdf2f8] text-[#be185d] border-[#ec4899]" },
};

// ── Tree structure ──
export const templateTree: TreeItem[] = [
  {
    id: "compilation",
    label: "Compilation",
    type: "folder",
    children: [
      { id: "comp4200", label: "Compilation — CSRS 4200", type: "file" },
    ],
  },
  {
    id: "review",
    label: "Review",
    type: "folder",
    children: [
      { id: "rev2400", label: "Review — CSRE 2400", type: "file" },
    ],
  },
  {
    id: "audit",
    label: "Audit",
    type: "folder",
    children: [
      {
        id: "audit-ca", label: "Canada", type: "folder", children: [
          { id: "audit5100", label: "CAS / ASPE — Private (5100)", type: "file" },
          { id: "audit5101", label: "CAS / NFP — ASNPO (5101)", type: "file" },
        ],
      },
      {
        id: "audit-us", label: "United States", type: "folder", children: [
          { id: "audit6100", label: "GAAS / US GAAP — Private (6100)", type: "file" },
          { id: "audit6200", label: "PCAOB / SOX Public (6200)", type: "file" },
        ],
      },
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

// ── Compilation Section 4200 ──
const comp4200: TemplateView = {
  id: "comp4200",
  title: "Compilation Section 4200",
  subtitle: "CSRS 4200 — Compilation Engagement",
  standardsBanner: {
    label: "Standard:",
    standards: "CSRS 4200 – Compilation Engagements",
    badge: "CPA Canada",
    color: "blue",
  },
  sections: [
    {
      name: "Client Onboarding",
      rows: [
        { section: "New engagement acceptance", category: "checklist", mappedTemplate: "New engagement acceptance Section 4200" },
        { section: "Existing engagement continuance", category: "checklist", mappedTemplate: "Existing engagement continuance Section 4200" },
        { section: "Engagement Letter", category: "letter", mappedTemplate: "Compilation engagement letter Section 4200" },
        { section: "Independence", category: "checklist", mappedTemplate: "Independence Section 4200" },
      ],
    },
    {
      name: "Planning",
      rows: [
        { section: "Knowledge of the Business", category: "checklist", mappedTemplate: "Knowledge of the business Section 4200" },
        { section: "Understanding the entity - Basics", category: "checklist", mappedTemplate: "Understanding the entity basics Section 4200" },
        { section: "Engagement Planning", category: "checklist", mappedTemplate: "Engagement Planning Section 4200" },
        { section: "Withdrawal", category: "checklist", mappedTemplate: "Withdrawal Section 4200" },
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
      name: "Financial Statements",
      rows: [
        { section: "Financial Statement Docs", category: "financial-statement", mappedTemplate: "Compilation template" },
        { section: "Cover Page", category: "financial-statement", mappedTemplate: "Compilation template" },
        { section: "Table of Contents", category: "financial-statement", mappedTemplate: "Compilation template" },
        { section: "Compilation Report", category: "report", mappedTemplate: "Compilation Report Section 4200" },
        { section: "Balance Sheet", category: "financial-statement", mappedTemplate: "Compilation template" },
        { section: "Statement of Income (Loss) and Retained Earnings (Deficit)", category: "financial-statement", mappedTemplate: "Compilation template" },
        { section: "Notes to Financial Statements", category: "financial-statement", mappedTemplate: "Compilation template" },
      ],
    },
    {
      name: "Completion & Signoffs",
      rows: [
        { section: "Completion Checklist", category: "checklist", mappedTemplate: "Completion Section 4200" },
        { section: "Partner/Manager Review", category: "checklist", mappedTemplate: "Review sign-off Section 4200" },
      ],
    },
  ],
};

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

// ─────────────────────────────────────────────────────────
// Canada — 300–399 Completion Documents
// ─────────────────────────────────────────────────────────
const ca305: TemplateView = {
  id: "ca-305", title: "305 — Independence Declaration",
  subtitle: "CAS 220 · CSQC 1 — Independence Confirmation at File Completion",
  standardsBanner: { label: "Standard:", standards: "CAS 220 · CSAS 5100 · CSQC 1", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Independence Declaration", rows: [
    { section: "Partner / Principal independence declaration", category: "checklist", mappedTemplate: "Independence declaration — partner" },
    { section: "Engagement team independence declarations", category: "checklist", mappedTemplate: "Independence declaration — team" },
    { section: "Financial interests & relationships disclosure", category: "checklist", mappedTemplate: "Financial interests disclosure" },
    { section: "Threats & safeguards assessment", category: "checklist", mappedTemplate: "Threats & safeguards checklist" },
  ]}],
};
const ca306: TemplateView = {
  id: "ca-306", title: "306 — Engagement Quality Review",
  subtitle: "CAS 220 · CSQC 1 — Engagement Quality Control Review",
  standardsBanner: { label: "Standard:", standards: "CAS 220 · CSQC 1 (EQCR)", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "EQCR Checklist", rows: [
    { section: "EQCR — Significant judgments and conclusions", category: "checklist", mappedTemplate: "EQCR significant judgments" },
    { section: "EQCR — Financial statement review", category: "checklist", mappedTemplate: "EQCR financial statement review" },
    { section: "EQCR — Auditor's report review", category: "checklist", mappedTemplate: "EQCR auditor's report" },
    { section: "EQCR reviewer sign-off", category: "checklist", mappedTemplate: "EQCR sign-off" },
  ]}],
};
const ca310: TemplateView = {
  id: "ca-310", title: "310 — File Completion Checklist",
  subtitle: "CAS 230 · CSAS 5100 — Audit Documentation Completion",
  standardsBanner: { label: "Standard:", standards: "CAS 230 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "File Completion", rows: [
    { section: "All working papers signed and dated", category: "checklist", mappedTemplate: "WP sign-off checklist" },
    { section: "Significant matters documented", category: "checklist", mappedTemplate: "Significant matters documentation" },
    { section: "File assembly & archiving", category: "checklist", mappedTemplate: "File assembly checklist" },
    { section: "60-day assembly deadline confirmed", category: "checklist", mappedTemplate: "Assembly deadline" },
  ]}],
};
const ca312: TemplateView = {
  id: "ca-312", title: "312 — Financial Statement Review Checklist",
  subtitle: "CAS 700 · ASPE — Financial Statement Presentation Review",
  standardsBanner: { label: "Standard:", standards: "CAS 700 · ASPE Handbook Part II", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "FS Presentation Checklist", rows: [
    { section: "Balance sheet presentation & classification", category: "checklist", mappedTemplate: "BS presentation checklist" },
    { section: "Income statement presentation", category: "checklist", mappedTemplate: "IS presentation checklist" },
    { section: "Notes disclosure checklist — ASPE", category: "checklist", mappedTemplate: "ASPE disclosure checklist" },
    { section: "Comparative figures & prior period", category: "checklist", mappedTemplate: "Comparative figures review" },
    { section: "Subsequent events disclosure", category: "checklist", mappedTemplate: "Subsequent events disclosure" },
  ]}],
};
const ca313: TemplateView = {
  id: "ca-313", title: "313 — Audit Opinion / Reporting",
  subtitle: "CAS 700–706 — Forming an Opinion and Reporting",
  standardsBanner: { label: "Standard:", standards: "CAS 700 · CAS 705 · CAS 706 · CAS 720", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Auditor's Report", rows: [
    { section: "Unmodified opinion — standard report", category: "report", mappedTemplate: "Unmodified auditor's report ASPE" },
    { section: "Modified opinion — qualified (CAS 705)", category: "report", mappedTemplate: "Qualified opinion report" },
    { section: "Modified opinion — adverse (CAS 705)", category: "report", mappedTemplate: "Adverse opinion report" },
    { section: "Emphasis of matter / other matter paragraphs (CAS 706)", category: "report", mappedTemplate: "Emphasis of matter paragraph" },
    { section: "Reporting on comparative information (CAS 710)", category: "checklist", mappedTemplate: "Comparative information checklist" },
  ]}],
};
const ca314: TemplateView = {
  id: "ca-314", title: "314 — Summary of Uncorrected Misstatements",
  subtitle: "CAS 450 — Evaluation of Misstatements Identified During the Audit",
  standardsBanner: { label: "Standard:", standards: "CAS 450 · CAS 320 — Materiality", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Accumulation of Identified Misstatements (AIM)", rows: [
    { section: "AIM schedule — factual misstatements", category: "worksheet", mappedTemplate: "AIM factual misstatements" },
    { section: "AIM schedule — judgmental misstatements", category: "worksheet", mappedTemplate: "AIM judgmental misstatements" },
    { section: "AIM schedule — projected misstatements from sampling", category: "worksheet", mappedTemplate: "AIM projected misstatements" },
    { section: "Materiality comparison & threshold analysis", category: "worksheet", mappedTemplate: "Materiality threshold analysis" },
    { section: "Management communication of misstatements", category: "letter", mappedTemplate: "Misstatements communication letter" },
    { section: "Management response — corrected / waived", category: "checklist", mappedTemplate: "Management waiver checklist" },
  ]}],
};

// ─────────────────────────────────────────────────────────
// Canada — 400–499 Planning
// ─────────────────────────────────────────────────────────
const ca408: TemplateView = {
  id: "ca-408", title: "408 — Engagement Letter",
  subtitle: "CAS 210 — Agreeing the Terms of the Audit Engagement",
  standardsBanner: { label: "Standard:", standards: "CAS 210 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Engagement Letter", rows: [
    { section: "Engagement letter — new client", category: "letter", mappedTemplate: "New client audit engagement letter" },
    { section: "Engagement letter — recurring client", category: "letter", mappedTemplate: "Recurring client audit engagement letter" },
    { section: "Changes to engagement terms (CAS 210.14)", category: "letter", mappedTemplate: "Engagement terms change letter" },
  ]}],
};
const ca410: TemplateView = {
  id: "ca-410", title: "410 — Engagement Acceptance Checklist",
  subtitle: "CAS 220 · CSQC 1 — Quality Control for Acceptance & Continuance",
  standardsBanner: { label: "Standard:", standards: "CAS 220 · CSQC 1", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Acceptance & Continuance", rows: [
    { section: "New engagement acceptance checklist", category: "checklist", mappedTemplate: "New engagement acceptance CAS" },
    { section: "Existing engagement continuance checklist", category: "checklist", mappedTemplate: "Engagement continuance CAS" },
    { section: "Client integrity & background assessment", category: "checklist", mappedTemplate: "Client integrity assessment" },
    { section: "Firm competency & resources confirmation", category: "checklist", mappedTemplate: "Competency resources check" },
  ]}],
};
const ca420: TemplateView = {
  id: "ca-420", title: "420 — Independence & Ethics",
  subtitle: "CAS 220 · IESBA Code — Independence, Ethics & Quality Considerations",
  standardsBanner: { label: "Standard:", standards: "CAS 220 · IESBA Code of Ethics · CSQC 1", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Independence & Ethics", rows: [
    { section: "Independence identification & threats", category: "checklist", mappedTemplate: "Independence threats checklist" },
    { section: "Safeguards applied to threats", category: "checklist", mappedTemplate: "Safeguards assessment" },
    { section: "Non-assurance services — independence impact", category: "checklist", mappedTemplate: "Non-assurance services independence" },
    { section: "Fee arrangements & contingency fee review", category: "checklist", mappedTemplate: "Fee independence review" },
    { section: "Rotation requirements (CAS 220)", category: "checklist", mappedTemplate: "Partner rotation checklist" },
  ]}],
};
const ca428: TemplateView = {
  id: "ca-428", title: "428 — Predecessor Auditor Communication",
  subtitle: "CAS 510 — Initial Audit Engagements — Opening Balances",
  standardsBanner: { label: "Standard:", standards: "CAS 510 · CAS 300", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Predecessor Auditor", rows: [
    { section: "Request to access predecessor's working papers", category: "letter", mappedTemplate: "Predecessor access request letter" },
    { section: "Opening balances — audit procedures (CAS 510)", category: "checklist", mappedTemplate: "Opening balances checklist" },
    { section: "Prior year audit opinion review", category: "checklist", mappedTemplate: "Prior year opinion review" },
  ]}],
};
const ca430: TemplateView = {
  id: "ca-430", title: "430 — Understanding the Entity",
  subtitle: "CAS 315 — Identifying and Assessing Risks of Material Misstatement",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [
    { name: "Entity & Environment", rows: [
      { section: "Industry, regulatory & external factors", category: "checklist", mappedTemplate: "Industry & external factors" },
      { section: "Nature of entity — operations, ownership, governance", category: "checklist", mappedTemplate: "Nature of entity checklist" },
      { section: "Entity objectives, strategies & business risks", category: "checklist", mappedTemplate: "Objectives & strategies" },
      { section: "Financial performance measurement & review", category: "checklist", mappedTemplate: "Financial performance metrics" },
    ]},
    { name: "Internal Control Components", rows: [
      { section: "Control environment", category: "checklist", mappedTemplate: "Control environment assessment" },
      { section: "Entity's risk assessment process", category: "checklist", mappedTemplate: "Entity risk assessment process" },
      { section: "Information systems & communication", category: "checklist", mappedTemplate: "Information systems checklist" },
      { section: "Monitoring of controls", category: "checklist", mappedTemplate: "Controls monitoring checklist" },
    ]},
  ],
};
const ca436: TemplateView = {
  id: "ca-436", title: "436 — Preliminary Analytical Procedures",
  subtitle: "CAS 315 · CAS 520 — Analytical Procedures in Planning",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · CAS 520", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Preliminary Analytics", rows: [
    { section: "Year-over-year balance sheet comparison", category: "worksheet", mappedTemplate: "YoY balance sheet analytics" },
    { section: "Income statement trend analysis", category: "worksheet", mappedTemplate: "Income statement analytics" },
    { section: "Key ratios & financial metrics", category: "worksheet", mappedTemplate: "Financial ratios worksheet" },
    { section: "Identified fluctuations requiring further investigation", category: "worksheet", mappedTemplate: "Fluctuation analysis" },
  ]}],
};
const ca440: TemplateView = {
  id: "ca-440", title: "440 — Planning Materiality",
  subtitle: "CAS 320 — Materiality in Planning and Performing an Audit",
  standardsBanner: { label: "Standard:", standards: "CAS 320 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Materiality", rows: [
    { section: "Overall planning materiality calculation", category: "worksheet", mappedTemplate: "Planning materiality worksheet" },
    { section: "Performance materiality determination", category: "worksheet", mappedTemplate: "Performance materiality worksheet" },
    { section: "Clearly trivial threshold", category: "worksheet", mappedTemplate: "Clearly trivial worksheet" },
    { section: "Materiality basis selection & rationale", category: "checklist", mappedTemplate: "Materiality basis documentation" },
  ]}],
};
const ca450: TemplateView = {
  id: "ca-450", title: "450 — Overall Audit Strategy",
  subtitle: "CAS 300 — Planning an Audit of Financial Statements",
  standardsBanner: { label: "Standard:", standards: "CAS 300 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Audit Strategy", rows: [
    { section: "Scope — applicable financial reporting framework", category: "checklist", mappedTemplate: "Scope AFRF documentation" },
    { section: "Reporting objectives & timing", category: "checklist", mappedTemplate: "Reporting timing checklist" },
    { section: "Significant audit areas & planned approach", category: "worksheet", mappedTemplate: "Significant areas worksheet" },
    { section: "Direction, supervision & review plan", category: "checklist", mappedTemplate: "Team supervision plan" },
    { section: "Consideration of specialists & experts", category: "checklist", mappedTemplate: "Specialists consideration" },
  ]}],
};
const ca451: TemplateView = {
  id: "ca-451", title: "451 — Audit Plan / Approach",
  subtitle: "CAS 300 — Nature, Timing and Extent of Planned Procedures",
  standardsBanner: { label: "Standard:", standards: "CAS 300 · CAS 330 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Audit Plan", rows: [
    { section: "Planned risk assessment procedures", category: "checklist", mappedTemplate: "Planned risk assessment procedures" },
    { section: "Planned further audit procedures — controls testing", category: "checklist", mappedTemplate: "Controls testing plan" },
    { section: "Planned substantive procedures by area", category: "checklist", mappedTemplate: "Substantive procedures plan" },
    { section: "Staff allocation & time budget", category: "worksheet", mappedTemplate: "Staff allocation worksheet" },
  ]}],
};

// ─────────────────────────────────────────────────────────
// Canada — 500–599 Risk Assessment
// ─────────────────────────────────────────────────────────
const ca500: TemplateView = {
  id: "ca-500", title: "500 — Fraud Risk Assessment",
  subtitle: "CAS 240 — The Auditor's Responsibilities Relating to Fraud",
  standardsBanner: { label: "Standard:", standards: "CAS 240 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Fraud Risk Assessment", rows: [
    { section: "Fraud risk factors — management override", category: "checklist", mappedTemplate: "Management override risk" },
    { section: "Fraud risk factors — misappropriation of assets", category: "checklist", mappedTemplate: "Misappropriation risk factors" },
    { section: "Revenue recognition as fraud risk (CAS 240)", category: "checklist", mappedTemplate: "Revenue recognition fraud risk" },
    { section: "Engagement team fraud discussion (CAS 315)", category: "checklist", mappedTemplate: "Team fraud discussion" },
    { section: "Journal entry testing — risk identification", category: "checklist", mappedTemplate: "JE fraud risk assessment" },
  ]}],
};
const ca501: TemplateView = {
  id: "ca-501", title: "501 — Risk Assessment Summary",
  subtitle: "CAS 315 — Risk of Material Misstatement at Financial Statement & Assertion Level",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · CAS 330 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Risk Assessment Summary", rows: [
    { section: "Financial statement level risks", category: "worksheet", mappedTemplate: "FS level risk summary" },
    { section: "Assertion level risks by significant account", category: "worksheet", mappedTemplate: "Assertion level risk worksheet" },
    { section: "Significant risks identified (CAS 315.27)", category: "worksheet", mappedTemplate: "Significant risks register" },
    { section: "Linkage to planned audit procedures", category: "worksheet", mappedTemplate: "Risk-procedure linkage" },
  ]}],
};
const ca520: TemplateView = {
  id: "ca-520", title: "520 — Going Concern Assessment",
  subtitle: "CAS 570 — Going Concern — Initial Planning Assessment",
  standardsBanner: { label: "Standard:", standards: "CAS 570 · ASPE 1400", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Going Concern", rows: [
    { section: "Going concern indicators — financial", category: "checklist", mappedTemplate: "GC financial indicators" },
    { section: "Going concern indicators — operational", category: "checklist", mappedTemplate: "GC operational indicators" },
    { section: "Management's assessment review", category: "checklist", mappedTemplate: "Management GC assessment" },
    { section: "Cash flow projections & forecasts", category: "worksheet", mappedTemplate: "GC cash flow projections" },
    { section: "Mitigating factors & management plans", category: "checklist", mappedTemplate: "GC mitigating factors" },
  ]}],
};
const ca525: TemplateView = {
  id: "ca-525", title: "525 — Related Parties",
  subtitle: "CAS 550 — Related Parties",
  standardsBanner: { label: "Standard:", standards: "CAS 550 · ASPE 3840", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Related Parties", rows: [
    { section: "Identification of related parties", category: "checklist", mappedTemplate: "Related party identification" },
    { section: "Related party transactions register", category: "worksheet", mappedTemplate: "RPT register" },
    { section: "Arms-length assessment — significant RPTs", category: "checklist", mappedTemplate: "Arms-length assessment" },
    { section: "Disclosure review — ASPE 3840", category: "checklist", mappedTemplate: "RPT disclosure review" },
  ]}],
};
const ca530: TemplateView = {
  id: "ca-530", title: "530 — Internal Controls Overview",
  subtitle: "CAS 315 — Understanding the Entity's Internal Controls",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Internal Controls", rows: [
    { section: "Control environment assessment", category: "checklist", mappedTemplate: "Control environment checklist" },
    { section: "Entity risk assessment process", category: "checklist", mappedTemplate: "Entity risk process" },
    { section: "Information systems — relevant to financial reporting", category: "checklist", mappedTemplate: "IS financial reporting controls" },
    { section: "Control activities — overview", category: "checklist", mappedTemplate: "Control activities overview" },
    { section: "Monitoring of controls", category: "checklist", mappedTemplate: "Monitoring controls checklist" },
  ]}],
};
const ca535: TemplateView = {
  id: "ca-535", title: "535 — Financial Reporting Controls",
  subtitle: "CAS 315 — Controls Relevant to the Audit",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Financial Reporting Controls", rows: [
    { section: "Period-end financial reporting process", category: "checklist", mappedTemplate: "Period-end controls" },
    { section: "Journal entry process & authorization", category: "checklist", mappedTemplate: "JE controls assessment" },
    { section: "Accounting estimates process & controls", category: "checklist", mappedTemplate: "Estimates controls" },
    { section: "Financial statement preparation controls", category: "checklist", mappedTemplate: "FS preparation controls" },
  ]}],
};
const ca540: TemplateView = {
  id: "ca-540", title: "540 — Revenue / Sales Cycle (SCOT)",
  subtitle: "CAS 315 — Summary of Controls over Transactions: Revenue",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · ASPE 3400", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Revenue / Sales Cycle SCOT", rows: [
    { section: "Revenue recognition policy documentation", category: "checklist", mappedTemplate: "Revenue recognition policy" },
    { section: "Order-to-cash process controls", category: "checklist", mappedTemplate: "Order-to-cash controls" },
    { section: "Credit & collections controls", category: "checklist", mappedTemplate: "Credit collections controls" },
    { section: "Cut-off controls & procedures", category: "checklist", mappedTemplate: "Revenue cut-off controls" },
    { section: "Control risk assessment — revenue", category: "worksheet", mappedTemplate: "Revenue control risk" },
  ]}],
};
const ca550: TemplateView = {
  id: "ca-550", title: "550 — Purchase / Expenditure Cycle (SCOT)",
  subtitle: "CAS 315 — Summary of Controls over Transactions: Purchases",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Purchase Cycle SCOT", rows: [
    { section: "Procurement & authorization controls", category: "checklist", mappedTemplate: "Procurement controls" },
    { section: "Purchase order & invoice matching", category: "checklist", mappedTemplate: "PO invoice matching controls" },
    { section: "Vendor management & approval", category: "checklist", mappedTemplate: "Vendor management controls" },
    { section: "Payment authorization & disbursement controls", category: "checklist", mappedTemplate: "Payment controls" },
    { section: "Control risk assessment — purchases", category: "worksheet", mappedTemplate: "Purchases control risk" },
  ]}],
};
const ca551: TemplateView = {
  id: "ca-551", title: "551 — Payroll Cycle (SCOT)",
  subtitle: "CAS 315 — Summary of Controls over Transactions: Payroll",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Payroll Cycle SCOT", rows: [
    { section: "Hiring & HR authorization controls", category: "checklist", mappedTemplate: "Hiring authorization controls" },
    { section: "Time recording & payroll calculation controls", category: "checklist", mappedTemplate: "Payroll calculation controls" },
    { section: "Payroll payment & distribution controls", category: "checklist", mappedTemplate: "Payroll payment controls" },
    { section: "CRA remittance & compliance controls", category: "checklist", mappedTemplate: "CRA remittance controls" },
    { section: "Control risk assessment — payroll", category: "worksheet", mappedTemplate: "Payroll control risk" },
  ]}],
};
const ca575: TemplateView = {
  id: "ca-575", title: "575 — Treasury & Financing",
  subtitle: "CAS 315 — Controls over Treasury, Debt & Financing Transactions",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · ASPE 3856", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Treasury & Financing Controls", rows: [
    { section: "Cash management & banking controls", category: "checklist", mappedTemplate: "Cash management controls" },
    { section: "Debt & borrowing authorization controls", category: "checklist", mappedTemplate: "Debt authorization controls" },
    { section: "Covenant compliance monitoring", category: "checklist", mappedTemplate: "Covenant monitoring controls" },
    { section: "Interest rate & foreign exchange risk controls", category: "checklist", mappedTemplate: "Treasury risk controls" },
  ]}],
};
const ca580: TemplateView = {
  id: "ca-580", title: "580 — Investments",
  subtitle: "CAS 315 — Controls over Investment Transactions",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · ASPE 3856 · ASPE 3051", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Investment Controls", rows: [
    { section: "Investment policy & authorization", category: "checklist", mappedTemplate: "Investment policy controls" },
    { section: "Portfolio valuation & monitoring", category: "checklist", mappedTemplate: "Investment valuation controls" },
    { section: "Income recognition controls (dividends / interest)", category: "checklist", mappedTemplate: "Investment income controls" },
    { section: "Control risk assessment — investments", category: "worksheet", mappedTemplate: "Investment control risk" },
  ]}],
};
const ca582: TemplateView = {
  id: "ca-582", title: "582 — Other Processes",
  subtitle: "CAS 315 — Controls over Other Significant Processes",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Other Processes", rows: [
    { section: "IT general controls (ITGC) assessment", category: "checklist", mappedTemplate: "ITGC assessment" },
    { section: "Fixed asset management controls", category: "checklist", mappedTemplate: "Fixed asset controls" },
    { section: "Tax compliance & reporting controls", category: "checklist", mappedTemplate: "Tax controls" },
    { section: "Other process — control risk assessment", category: "worksheet", mappedTemplate: "Other process risk worksheet" },
  ]}],
};
const ca590: TemplateView = {
  id: "ca-590", title: "590 — Risk Assessment Summary",
  subtitle: "CAS 315 / CAS 330 — Summary of Assessed Risks & Planned Responses",
  standardsBanner: { label: "Standard:", standards: "CAS 315 · CAS 330 · CAS 240", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Risk & Response Summary", rows: [
    { section: "Consolidated risk register — all significant accounts", category: "worksheet", mappedTemplate: "Consolidated risk register" },
    { section: "Overall response to FS-level risks", category: "checklist", mappedTemplate: "FS level response" },
    { section: "Assertion-level planned procedures summary", category: "worksheet", mappedTemplate: "Assertion procedures summary" },
    { section: "Significant risks — specific procedures", category: "worksheet", mappedTemplate: "Significant risk procedures" },
  ]}],
};

// ─────────────────────────────────────────────────────────
// Canada — 600–699 Response to Assessed Risks
// ─────────────────────────────────────────────────────────
const ca605: TemplateView = {
  id: "ca-605", title: "605 — Responding to Risk at the Financial Statement Level",
  subtitle: "CAS 330 — Overall Response to Assessed Risks",
  standardsBanner: { label: "Standard:", standards: "CAS 330.5 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "FS-Level Response", rows: [
    { section: "Overall response — nature, timing, extent changes", category: "checklist", mappedTemplate: "Overall FS response" },
    { section: "Unpredictability in planned procedures", category: "checklist", mappedTemplate: "Audit unpredictability" },
    { section: "Effect on tests of details & substantive analytics", category: "worksheet", mappedTemplate: "FS response procedures" },
  ]}],
};
const ca606: TemplateView = {
  id: "ca-606", title: "606 — Audit Plan (Blank)",
  subtitle: "CAS 300 — Customizable Audit Plan Template",
  standardsBanner: { label: "Standard:", standards: "CAS 300 · CAS 330", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Audit Plan", rows: [
    { section: "Audit plan — blank / customizable", category: "worksheet", mappedTemplate: "Audit plan blank template" },
    { section: "Procedure allocation by team member", category: "worksheet", mappedTemplate: "Procedure allocation worksheet" },
  ]}],
};
const ca610: TemplateView = {
  id: "ca-610", title: "610 — Sampling — Tests of Details",
  subtitle: "CAS 530 — Audit Sampling for Tests of Details",
  standardsBanner: { label: "Standard:", standards: "CAS 530 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Sampling — Tests of Details", rows: [
    { section: "Sample size determination — statistical / non-statistical", category: "worksheet", mappedTemplate: "Sample size ToD" },
    { section: "Sample selection method & documentation", category: "worksheet", mappedTemplate: "Sample selection ToD" },
    { section: "Projection of misstatements to population", category: "worksheet", mappedTemplate: "Misstatement projection" },
    { section: "Evaluation of sample results", category: "checklist", mappedTemplate: "Sample results evaluation" },
  ]}],
};
const ca614: TemplateView = {
  id: "ca-614", title: "614 — Substantive Analytical Procedures",
  subtitle: "CAS 520 — Analytical Procedures as Substantive Testing",
  standardsBanner: { label: "Standard:", standards: "CAS 520 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Substantive Analytical Procedures", rows: [
    { section: "Expectation development — basis & data reliability", category: "worksheet", mappedTemplate: "SAP expectation development" },
    { section: "Threshold determination for investigation", category: "worksheet", mappedTemplate: "SAP threshold" },
    { section: "Comparison & explanation of differences", category: "worksheet", mappedTemplate: "SAP differences explanation" },
    { section: "Corroboration of explanations", category: "checklist", mappedTemplate: "SAP corroboration checklist" },
  ]}],
};
const ca615: TemplateView = {
  id: "ca-615", title: "615 — Sampling — Tests of Controls",
  subtitle: "CAS 530 — Audit Sampling for Tests of Controls",
  standardsBanner: { label: "Standard:", standards: "CAS 530 · CAS 330 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Sampling — Tests of Controls", rows: [
    { section: "Control to be tested & deviations definition", category: "worksheet", mappedTemplate: "Control testing objective" },
    { section: "Sample size — control testing", category: "worksheet", mappedTemplate: "Sample size ToC" },
    { section: "Deviations found & evaluation", category: "worksheet", mappedTemplate: "Control deviations evaluation" },
    { section: "Impact on control reliance & substantive testing", category: "checklist", mappedTemplate: "Control reliance conclusion" },
  ]}],
};
const ca620: TemplateView = {
  id: "ca-620", title: "620 — Evaluating the Work of an Auditor's Expert",
  subtitle: "CAS 620 — Using the Work of an Auditor's Expert",
  standardsBanner: { label: "Standard:", standards: "CAS 620 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Auditor's Expert", rows: [
    { section: "Competence, capabilities & objectivity assessment", category: "checklist", mappedTemplate: "Expert competence assessment" },
    { section: "Agreement with the expert — scope & work", category: "checklist", mappedTemplate: "Expert agreement documentation" },
    { section: "Evaluation of expert's work and conclusions", category: "checklist", mappedTemplate: "Expert work evaluation" },
  ]}],
};
const ca625: TemplateView = {
  id: "ca-625", title: "625 — Going-Concern Evaluation",
  subtitle: "CAS 570 — Going Concern — Final Evaluation",
  standardsBanner: { label: "Standard:", standards: "CAS 570 · ASPE 1400", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Going Concern — Final", rows: [
    { section: "Events or conditions raising significant doubt", category: "checklist", mappedTemplate: "GC significant doubt indicators" },
    { section: "Management's plans — feasibility assessment", category: "checklist", mappedTemplate: "GC management plans" },
    { section: "Cash flow projections — review & sensitivity", category: "worksheet", mappedTemplate: "GC cash flow review" },
    { section: "Disclosure adequacy review (CAS 570)", category: "checklist", mappedTemplate: "GC disclosure review" },
    { section: "Impact on auditor's report", category: "checklist", mappedTemplate: "GC audit report impact" },
  ]}],
};
const ca630: TemplateView = {
  id: "ca-630", title: "630 — Summary of External Confirmations",
  subtitle: "CAS 505 — External Confirmations",
  standardsBanner: { label: "Standard:", standards: "CAS 505 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "External Confirmations", rows: [
    { section: "Bank confirmations — sent & received", category: "worksheet", mappedTemplate: "Bank confirmation log" },
    { section: "Accounts receivable confirmations", category: "worksheet", mappedTemplate: "AR confirmation log" },
    { section: "Accounts payable confirmations", category: "worksheet", mappedTemplate: "AP confirmation log" },
    { section: "Legal confirmations (lawyers' letters)", category: "worksheet", mappedTemplate: "Legal confirmation log" },
    { section: "Non-responses & alternative procedures", category: "checklist", mappedTemplate: "Non-response alternative procedures" },
  ]}],
};
const ca635: TemplateView = {
  id: "ca-635", title: "635 — Accounting Estimates — Further Audit Procedures",
  subtitle: "CAS 540 — Auditing Accounting Estimates and Related Disclosures",
  standardsBanner: { label: "Standard:", standards: "CAS 540 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Accounting Estimates", rows: [
    { section: "Identification of significant accounting estimates", category: "checklist", mappedTemplate: "Estimates identification" },
    { section: "Review management's estimation process", category: "checklist", mappedTemplate: "Management estimation process" },
    { section: "Test of management's point estimate or range", category: "worksheet", mappedTemplate: "Estimate testing worksheet" },
    { section: "Retrospective review of prior estimates", category: "worksheet", mappedTemplate: "Retrospective review worksheet" },
    { section: "Adequacy of disclosure — ASPE estimates", category: "checklist", mappedTemplate: "Estimates disclosure review" },
  ]}],
};
const ca637: TemplateView = {
  id: "ca-637", title: "637 — Sales Tax Reasonability",
  subtitle: "Reasonability analysis of HST/GST/PST balances",
  standardsBanner: { label: "Standard:", standards: "CAS 520 · ETA (Canada) · Provincial Tax Acts", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Sales Tax Reasonability", rows: [
    { section: "HST/GST collected — reasonability calculation", category: "worksheet", mappedTemplate: "GST collected reasonability" },
    { section: "HST/GST ITCs — reasonability calculation", category: "worksheet", mappedTemplate: "GST ITC reasonability" },
    { section: "PST/QST reasonability (if applicable)", category: "worksheet", mappedTemplate: "PST reasonability" },
    { section: "Net tax remittance reconciliation", category: "worksheet", mappedTemplate: "Net tax reconciliation" },
  ]}],
};
const ca645: TemplateView = {
  id: "ca-645", title: "645 — Litigation, Claims & Non-Compliance",
  subtitle: "CAS 250 · CAS 501 — Legal Matters and Regulatory Compliance",
  standardsBanner: { label: "Standard:", standards: "CAS 250 · CAS 501 · ASPE 3290", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Litigation & Compliance", rows: [
    { section: "Management inquiry — litigation & claims (CAS 501)", category: "checklist", mappedTemplate: "Litigation management inquiry" },
    { section: "Legal counsel confirmation (CAS 501)", category: "letter", mappedTemplate: "Legal counsel confirmation letter" },
    { section: "Non-compliance with laws & regulations (CAS 250)", category: "checklist", mappedTemplate: "Non-compliance checklist" },
    { section: "Contingent liability disclosure review", category: "checklist", mappedTemplate: "Contingency disclosure review" },
  ]}],
};
const ca650: TemplateView = {
  id: "ca-650", title: "650 — Subsequent Events",
  subtitle: "CAS 560 — Subsequent Events",
  standardsBanner: { label: "Standard:", standards: "CAS 560 · ASPE 3820", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Subsequent Events", rows: [
    { section: "Subsequent events inquiry of management", category: "checklist", mappedTemplate: "Subsequent events inquiry" },
    { section: "Subsequent events procedures — period review", category: "checklist", mappedTemplate: "Subsequent events procedures" },
    { section: "Board minutes review post year-end", category: "checklist", mappedTemplate: "Board minutes subsequent events" },
    { section: "Type I & Type II events classification", category: "checklist", mappedTemplate: "Subsequent events classification" },
  ]}],
};
const ca655: TemplateView = {
  id: "ca-655", title: "655 — Final Analytical Procedures",
  subtitle: "CAS 520 — Analytical Procedures at or Near Completion",
  standardsBanner: { label: "Standard:", standards: "CAS 520 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Final Analytics", rows: [
    { section: "Final balance sheet analytical review", category: "worksheet", mappedTemplate: "Final BS analytics" },
    { section: "Final income statement analytical review", category: "worksheet", mappedTemplate: "Final IS analytics" },
    { section: "Ratios & trends — final assessment", category: "worksheet", mappedTemplate: "Final ratios assessment" },
    { section: "Consistency with overall audit conclusions", category: "checklist", mappedTemplate: "Final analytics consistency" },
  ]}],
};
const ca666: TemplateView = {
  id: "ca-666", title: "666 — Related-Party Transactions",
  subtitle: "CAS 550 — Related Parties — Substantive Procedures",
  standardsBanner: { label: "Standard:", standards: "CAS 550 · ASPE 3840", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Related-Party Substantive Testing", rows: [
    { section: "Related party transaction listing — completeness", category: "worksheet", mappedTemplate: "RPT completeness" },
    { section: "Arms-length testing for significant RPTs", category: "worksheet", mappedTemplate: "RPT arms-length testing" },
    { section: "Board / management approval of RPTs", category: "checklist", mappedTemplate: "RPT approval review" },
    { section: "Disclosure completeness — ASPE 3840", category: "checklist", mappedTemplate: "RPT disclosure completeness" },
  ]}],
};
const ca670: TemplateView = {
  id: "ca-670", title: "670 — Use of Journal Entries",
  subtitle: "CAS 240 — Journal Entry Testing (Fraud Risk)",
  standardsBanner: { label: "Standard:", standards: "CAS 240.32 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Journal Entry Testing", rows: [
    { section: "Journal entry population — completeness", category: "worksheet", mappedTemplate: "JE population worksheet" },
    { section: "Risk criteria for JE selection", category: "worksheet", mappedTemplate: "JE selection criteria" },
    { section: "JE testing — selected entries", category: "worksheet", mappedTemplate: "JE testing worksheet" },
    { section: "Unusual / top-sided entries investigation", category: "checklist", mappedTemplate: "Unusual JE investigation" },
  ]}],
};
const ca675: TemplateView = {
  id: "ca-675", title: "675 — Library of Sample Audit Procedures",
  subtitle: "Reference library of standard audit procedures by area",
  standardsBanner: { label: "Standard:", standards: "CAS 330 · CSAS 5100 — Reference Library", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Procedure Library", rows: [
    { section: "Sample procedures — balance sheet accounts", category: "worksheet", mappedTemplate: "Sample BS procedures library" },
    { section: "Sample procedures — income statement accounts", category: "worksheet", mappedTemplate: "Sample IS procedures library" },
    { section: "Sample procedures — disclosures & notes", category: "worksheet", mappedTemplate: "Sample disclosure procedures" },
  ]}],
};
const ca680: TemplateView = {
  id: "ca-680", title: "680 — ASPE Supplementary Audit Procedures",
  subtitle: "Supplementary procedures specific to ASPE financial reporting",
  standardsBanner: { label: "Standard:", standards: "ASPE Handbook Part II · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "ASPE Supplementary Procedures", rows: [
    { section: "ASPE accounting policy elections review", category: "checklist", mappedTemplate: "ASPE policy elections" },
    { section: "ASPE-specific disclosure requirements", category: "checklist", mappedTemplate: "ASPE disclosure checklist" },
    { section: "Measurement & recognition differences — ASPE vs IFRS", category: "checklist", mappedTemplate: "ASPE IFRS differences" },
  ]}],
};

// ─────────────────────────────────────────────────────────
// Canada — Assets (A–Z)
// ─────────────────────────────────────────────────────────
const caA100: TemplateView = {
  id: "ca-a100", title: "A100 — Cash — Audit Procedures",
  subtitle: "CAS 500 · CAS 530 — Cash & Bank Balances",
  standardsBanner: { label: "Standard:", standards: "CAS 500 · CAS 505 · ASPE 3855", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Cash — Audit Procedures", rows: [
    { section: "Bank confirmation — year-end", category: "worksheet", mappedTemplate: "Bank confirmation A100" },
    { section: "Bank reconciliation review", category: "worksheet", mappedTemplate: "Bank reconciliation A100" },
    { section: "Reconciling items — outstanding cheques & deposits", category: "worksheet", mappedTemplate: "Reconciling items A100" },
    { section: "Petty cash count & reconciliation", category: "worksheet", mappedTemplate: "Petty cash count A100" },
    { section: "Kiting test (if applicable)", category: "worksheet", mappedTemplate: "Kiting test A100" },
    { section: "Restricted cash disclosure review", category: "checklist", mappedTemplate: "Restricted cash A100" },
  ]}],
};
const caA110: TemplateView = {
  id: "ca-a110", title: "A110 — Bank Reconciliation Procedures",
  subtitle: "Detailed bank reconciliation testing procedures",
  standardsBanner: { label: "Standard:", standards: "CAS 500 · CAS 501 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Bank Reconciliation", rows: [
    { section: "Book balance to bank statement reconciliation", category: "worksheet", mappedTemplate: "Book-to-bank reconciliation" },
    { section: "Outstanding cheques — subsequent clearing", category: "worksheet", mappedTemplate: "Outstanding cheques testing" },
    { section: "Deposits in transit — subsequent clearing", category: "worksheet", mappedTemplate: "Deposits in transit testing" },
    { section: "Bank errors & adjustments", category: "worksheet", mappedTemplate: "Bank errors testing" },
  ]}],
};
const caA115: TemplateView = {
  id: "ca-a115", title: "A115 — Cash Count Procedures",
  subtitle: "Physical cash count observation & reconciliation",
  standardsBanner: { label: "Standard:", standards: "CAS 501 — Attendance at Physical Inventory", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Cash Count", rows: [
    { section: "Cash count observation — date & instructions", category: "checklist", mappedTemplate: "Cash count observation" },
    { section: "Cash count sheet — denominations", category: "worksheet", mappedTemplate: "Cash count sheet" },
    { section: "Reconciliation to general ledger", category: "worksheet", mappedTemplate: "Cash count reconciliation" },
  ]}],
};
const caB100: TemplateView = {
  id: "ca-b100", title: "B100 — Investments (Short-term) — Audit Procedures",
  subtitle: "ASPE 3856 · ASPE 3051 — Financial Instruments & Investments",
  standardsBanner: { label: "Standard:", standards: "ASPE 3856 · ASPE 3051 · CAS 500", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Investments — Audit Procedures", rows: [
    { section: "Investment schedule — completeness & accuracy", category: "worksheet", mappedTemplate: "Investment schedule B100" },
    { section: "Existence — confirmation / custodian statements", category: "worksheet", mappedTemplate: "Investment existence B100" },
    { section: "Valuation — quoted prices or valuation model", category: "worksheet", mappedTemplate: "Investment valuation B100" },
    { section: "Income recognition — interest / dividends", category: "worksheet", mappedTemplate: "Investment income B100" },
    { section: "Classification & disclosure — ASPE 3856", category: "checklist", mappedTemplate: "Investment disclosure B100" },
  ]}],
};
const caC100: TemplateView = {
  id: "ca-c100", title: "C100 — Accounts Receivable — Audit Procedures",
  subtitle: "CAS 500 · CAS 505 · ASPE 3856 — Trade Receivables",
  standardsBanner: { label: "Standard:", standards: "CAS 505 · ASPE 3856 · ASPE 3400", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Accounts Receivable", rows: [
    { section: "AR aged trial balance — reconciliation to GL", category: "worksheet", mappedTemplate: "AR aged TB reconciliation" },
    { section: "AR confirmations — positive / negative", category: "worksheet", mappedTemplate: "AR confirmations C100" },
    { section: "Allowance for doubtful accounts — adequacy", category: "worksheet", mappedTemplate: "Allowance adequacy testing" },
    { section: "Revenue cut-off testing", category: "worksheet", mappedTemplate: "Revenue cut-off C100" },
    { section: "Collection of subsequent receipts", category: "worksheet", mappedTemplate: "Subsequent receipts C100" },
    { section: "Related party receivables identification", category: "checklist", mappedTemplate: "RP receivables C100" },
  ]}],
};
const caC110: TemplateView = {
  id: "ca-c110", title: "C110 — AR Confirmation — Supplementary Procedures",
  subtitle: "CAS 505 — External Confirmations — Supplementary Procedures",
  standardsBanner: { label: "Standard:", standards: "CAS 505 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "AR Confirmation Supplementary", rows: [
    { section: "Non-responses — alternative procedures", category: "worksheet", mappedTemplate: "AR non-response alternatives" },
    { section: "Exceptions / disagreements resolution", category: "worksheet", mappedTemplate: "AR confirmation exceptions" },
    { section: "Confirmation control log", category: "worksheet", mappedTemplate: "AR confirmation log C110" },
  ]}],
};
const caD100: TemplateView = {
  id: "ca-d100", title: "D100 — Inventory — Audit Procedures",
  subtitle: "CAS 501 · ASPE 3031 — Inventory Existence & Valuation",
  standardsBanner: { label: "Standard:", standards: "CAS 501 · ASPE 3031 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Inventory", rows: [
    { section: "Inventory count attendance — planning", category: "checklist", mappedTemplate: "Inventory count planning" },
    { section: "Inventory count — test counts & roll-forward", category: "worksheet", mappedTemplate: "Test counts D100" },
    { section: "Inventory valuation — cost vs NRV", category: "worksheet", mappedTemplate: "Inventory valuation D100" },
    { section: "Cost method verification (FIFO / weighted average)", category: "checklist", mappedTemplate: "Cost method D100" },
    { section: "Slow-moving & obsolete inventory assessment", category: "worksheet", mappedTemplate: "Obsolete inventory D100" },
    { section: "Cut-off — purchases & cost of sales", category: "worksheet", mappedTemplate: "Inventory cut-off D100" },
  ]}],
};
const caD110: TemplateView = {
  id: "ca-d110", title: "D110 — Inventory Count Checklist",
  subtitle: "CAS 501 — Instructions for Physical Inventory Count Attendance",
  standardsBanner: { label: "Standard:", standards: "CAS 501 · ASPE 3031", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Inventory Count Procedures", rows: [
    { section: "Count date & location confirmation", category: "checklist", mappedTemplate: "Count date D110" },
    { section: "Management count procedures review", category: "checklist", mappedTemplate: "Management count review" },
    { section: "Test count recording — tag control", category: "worksheet", mappedTemplate: "Test count recording D110" },
    { section: "Consignment & third-party inventory", category: "checklist", mappedTemplate: "Third-party inventory D110" },
  ]}],
};
const caE100: TemplateView = {
  id: "ca-e100", title: "E100 — Loans & Advances Receivable",
  subtitle: "ASPE 3856 — Financial Instruments — Loans Receivable",
  standardsBanner: { label: "Standard:", standards: "ASPE 3856 · CAS 500", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Loans Receivable", rows: [
    { section: "Loan schedule — completeness & terms review", category: "worksheet", mappedTemplate: "Loans schedule E100" },
    { section: "Loan agreements — key terms verification", category: "checklist", mappedTemplate: "Loan agreement review E100" },
    { section: "Interest receivable calculation", category: "worksheet", mappedTemplate: "Interest receivable E100" },
    { section: "Collectability assessment — allowance adequacy", category: "worksheet", mappedTemplate: "Collectability E100" },
    { section: "Related party loan disclosure (ASPE 3840)", category: "checklist", mappedTemplate: "RP loan disclosure E100" },
  ]}],
};
const caL100: TemplateView = {
  id: "ca-l100", title: "L100 — Prepaid Expenses & Other Assets",
  subtitle: "ASPE — Prepaid Expenses & Other Current Assets",
  standardsBanner: { label: "Standard:", standards: "ASPE Handbook · CAS 500", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Prepaid Expenses", rows: [
    { section: "Prepaid schedule — listing & reconciliation", category: "worksheet", mappedTemplate: "Prepaid schedule L100" },
    { section: "Verification of prepaid amounts — invoices", category: "worksheet", mappedTemplate: "Prepaid verification L100" },
    { section: "Amortization / expense-in-period review", category: "worksheet", mappedTemplate: "Prepaid amortization L100" },
    { section: "Other current assets — nature & recoverability", category: "checklist", mappedTemplate: "Other assets L100" },
  ]}],
};
const caN100: TemplateView = {
  id: "ca-n100", title: "N100 — Long-Term Investments",
  subtitle: "ASPE 3051 · ASPE 3856 — Long-Term Portfolio & Equity-Method Investments",
  standardsBanner: { label: "Standard:", standards: "ASPE 3051 · ASPE 3856 · CAS 500", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Long-Term Investments", rows: [
    { section: "Investment schedule — cost / equity method", category: "worksheet", mappedTemplate: "LT investment schedule N100" },
    { section: "Cost / equity method application — assessment", category: "checklist", mappedTemplate: "Method application N100" },
    { section: "Impairment assessment — significant or prolonged decline", category: "worksheet", mappedTemplate: "Impairment assessment N100" },
    { section: "Equity pickup — financial statements review", category: "worksheet", mappedTemplate: "Equity pickup N100" },
    { section: "Disclosure — ASPE 3051 / 3856", category: "checklist", mappedTemplate: "LT investment disclosure N100" },
  ]}],
};
const caU100: TemplateView = {
  id: "ca-u100", title: "U100 — Property, Plant & Equipment",
  subtitle: "ASPE 3061 — Property, Plant & Equipment Roll-forward",
  standardsBanner: { label: "Standard:", standards: "ASPE 3061 · CAS 500 · CAS 501", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "PP&E", rows: [
    { section: "PP&E continuity schedule (opening + additions – disposals)", category: "worksheet", mappedTemplate: "PP&E continuity U100" },
    { section: "Additions — authorization & capitalization policy", category: "worksheet", mappedTemplate: "PP&E additions testing U100" },
    { section: "Disposals — proceeds & gain/loss calculation", category: "worksheet", mappedTemplate: "PP&E disposals U100" },
    { section: "Depreciation calculation review", category: "worksheet", mappedTemplate: "Depreciation review U100" },
    { section: "Physical inspection / existence — major assets", category: "checklist", mappedTemplate: "PP&E existence U100" },
    { section: "Impairment indicators assessment", category: "checklist", mappedTemplate: "PP&E impairment U100" },
  ]}],
};
const caW100: TemplateView = {
  id: "ca-w100", title: "W100 — Intangibles & Goodwill",
  subtitle: "ASPE 3064 · ASPE 1582 — Intangible Assets & Business Combinations",
  standardsBanner: { label: "Standard:", standards: "ASPE 3064 · ASPE 1582 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Intangibles & Goodwill", rows: [
    { section: "Intangibles continuity schedule", category: "worksheet", mappedTemplate: "Intangibles continuity W100" },
    { section: "Goodwill — impairment test (ASPE 1582)", category: "worksheet", mappedTemplate: "Goodwill impairment W100" },
    { section: "Amortization — useful life review & calculation", category: "worksheet", mappedTemplate: "Intangibles amortization W100" },
    { section: "Internally generated vs. acquired intangibles", category: "checklist", mappedTemplate: "Intangibles classification W100" },
    { section: "Disclosure review — ASPE 3064", category: "checklist", mappedTemplate: "Intangibles disclosure W100" },
  ]}],
};

// ─────────────────────────────────────────────────────────
// Canada — Liabilities & Equity (AA–ZZ)
// ─────────────────────────────────────────────────────────
const caAA100: TemplateView = {
  id: "ca-aa100", title: "AA100 — Bank Indebtedness",
  subtitle: "ASPE 3856 — Bank Operating Lines & Overdrafts",
  standardsBanner: { label: "Standard:", standards: "ASPE 3856 · CAS 505 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Bank Indebtedness", rows: [
    { section: "Bank confirmation — line of credit balance", category: "worksheet", mappedTemplate: "Bank LOC confirmation AA100" },
    { section: "Credit facility agreement — terms review", category: "checklist", mappedTemplate: "Credit facility review AA100" },
    { section: "Interest expense accrual — year-end", category: "worksheet", mappedTemplate: "Interest accrual AA100" },
    { section: "Covenant compliance check", category: "checklist", mappedTemplate: "Covenant compliance AA100" },
  ]}],
};
const caBB100: TemplateView = {
  id: "ca-bb100", title: "BB100 — Notes Payable & Bank Debt",
  subtitle: "ASPE 3856 — Long-Term Notes Payable & Loan Agreements",
  standardsBanner: { label: "Standard:", standards: "ASPE 3856 · CAS 505 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Notes Payable & Bank Debt", rows: [
    { section: "Debt schedule — principal balance & terms", category: "worksheet", mappedTemplate: "Debt schedule BB100" },
    { section: "Loan agreement review — key terms", category: "checklist", mappedTemplate: "Loan agreement BB100" },
    { section: "Interest expense — accrual & reconciliation", category: "worksheet", mappedTemplate: "Interest expense BB100" },
    { section: "Repayment schedule & current portion", category: "worksheet", mappedTemplate: "Repayment schedule BB100" },
    { section: "Covenant compliance review", category: "checklist", mappedTemplate: "Covenant BB100" },
    { section: "Disclosure review — ASPE 3856", category: "checklist", mappedTemplate: "Disclosure BB100" },
  ]}],
};
const caCC100: TemplateView = {
  id: "ca-cc100", title: "CC100 — Accounts Payable & Accrued Liabilities",
  subtitle: "ASPE — Trade Payables & Accrued Liabilities Testing",
  standardsBanner: { label: "Standard:", standards: "CAS 500 · CAS 505 · ASPE Handbook", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Accounts Payable", rows: [
    { section: "AP aged trial balance — reconciliation to GL", category: "worksheet", mappedTemplate: "AP aged TB reconciliation" },
    { section: "AP search for unrecorded liabilities", category: "worksheet", mappedTemplate: "Unrecorded liabilities search" },
    { section: "Major vendor confirmations", category: "worksheet", mappedTemplate: "AP confirmations CC100" },
    { section: "Purchase cut-off — year-end", category: "worksheet", mappedTemplate: "Purchase cut-off CC100" },
    { section: "Accrued liabilities — completeness & accuracy", category: "worksheet", mappedTemplate: "Accruals review CC100" },
    { section: "Related party payables disclosure", category: "checklist", mappedTemplate: "RP payables CC100" },
  ]}],
};
const caCC110: TemplateView = {
  id: "ca-cc110", title: "CC110 — AP Confirmation Checklist",
  subtitle: "CAS 505 — Accounts Payable External Confirmations",
  standardsBanner: { label: "Standard:", standards: "CAS 505 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "AP Confirmation", rows: [
    { section: "Vendor selection — high risk & zero / small balance", category: "worksheet", mappedTemplate: "AP confirmation selection" },
    { section: "Confirmation log — sent, received, reconciled", category: "worksheet", mappedTemplate: "AP confirmation log CC110" },
    { section: "Non-responses & alternative procedures", category: "checklist", mappedTemplate: "AP non-response CC110" },
  ]}],
};
const caFF100: TemplateView = {
  id: "ca-ff100", title: "FF100 — Income Taxes — Audit Procedures",
  subtitle: "ASPE 3465 — Income Taxes",
  standardsBanner: { label: "Standard:", standards: "ASPE 3465 · ITA (Canada) · CAS 500", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Income Taxes", rows: [
    { section: "Current income tax payable calculation review", category: "worksheet", mappedTemplate: "Current tax FF100" },
    { section: "Deferred income tax — temporary differences", category: "worksheet", mappedTemplate: "Deferred tax FF100" },
    { section: "Effective tax rate reconciliation", category: "worksheet", mappedTemplate: "ETR reconciliation FF100" },
    { section: "Loss carryforwards — recoverability assessment", category: "checklist", mappedTemplate: "Loss carryforward FF100" },
    { section: "CRA assessments & notices review", category: "checklist", mappedTemplate: "CRA assessments FF100" },
    { section: "Disclosure — ASPE 3465", category: "checklist", mappedTemplate: "Tax disclosure FF100" },
  ]}],
};
const caGG100: TemplateView = {
  id: "ca-gg100", title: "GG100 — Loans & Advances Payable",
  subtitle: "ASPE 3856 — Loans Payable to Related Parties & Third Parties",
  standardsBanner: { label: "Standard:", standards: "ASPE 3856 · ASPE 3840 · CAS 500", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Loans Payable", rows: [
    { section: "Loans payable schedule — terms & balances", category: "worksheet", mappedTemplate: "Loans payable schedule GG100" },
    { section: "Loan agreements — key terms review", category: "checklist", mappedTemplate: "Loan agreements GG100" },
    { section: "Interest expense accrual", category: "worksheet", mappedTemplate: "Interest payable GG100" },
    { section: "Related party loan disclosure (ASPE 3840)", category: "checklist", mappedTemplate: "RP loan payable disclosure GG100" },
  ]}],
};
const caKK100: TemplateView = {
  id: "ca-kk100", title: "KK100 — Long-Term Debt",
  subtitle: "ASPE 3856 — Long-Term Debt Roll-forward & Covenant Compliance",
  standardsBanner: { label: "Standard:", standards: "ASPE 3856 · CAS 505 · CSAS 5100", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Long-Term Debt", rows: [
    { section: "Long-term debt continuity schedule", category: "worksheet", mappedTemplate: "LTD continuity KK100" },
    { section: "Debt issuance / repayment — verification", category: "worksheet", mappedTemplate: "LTD transactions KK100" },
    { section: "Current portion reclassification", category: "worksheet", mappedTemplate: "Current portion KK100" },
    { section: "Interest expense & effective interest rate", category: "worksheet", mappedTemplate: "Interest EIR KK100" },
    { section: "Covenant compliance — all covenants", category: "worksheet", mappedTemplate: "Covenant testing KK100" },
    { section: "Debt maturity schedule disclosure", category: "checklist", mappedTemplate: "Maturity schedule KK100" },
  ]}],
};
const caUU100: TemplateView = {
  id: "ca-uu100", title: "UU100 — Equity (Corporate) — Audit Procedures",
  subtitle: "ASPE 3240 · ASPE 3251 — Share Capital & Retained Earnings",
  standardsBanner: { label: "Standard:", standards: "ASPE 3240 · ASPE 3251 · CBCA", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Corporate Equity", rows: [
    { section: "Share capital — continuity & authorized amounts", category: "worksheet", mappedTemplate: "Share capital UU100" },
    { section: "Retained earnings roll-forward", category: "worksheet", mappedTemplate: "Retained earnings UU100" },
    { section: "Dividends declared — authorization & recording", category: "worksheet", mappedTemplate: "Dividends UU100" },
    { section: "Corporate minute book review — equity changes", category: "checklist", mappedTemplate: "Minute book equity UU100" },
    { section: "Disclosure — ASPE 3240 / 3251", category: "checklist", mappedTemplate: "Equity disclosure UU100" },
  ]}],
};
const caUU110: TemplateView = {
  id: "ca-uu110", title: "UU110 — Equity (Partnership) — Audit Procedures",
  subtitle: "ASPE — Partnership Capital Accounts",
  standardsBanner: { label: "Standard:", standards: "ASPE Handbook · CAS 500 · Partnership Act", badge: "CPA Canada", color: "blue" },
  sections: [{ name: "Partnership Equity", rows: [
    { section: "Partners' capital accounts — continuity", category: "worksheet", mappedTemplate: "Partners capital UU110" },
    { section: "Drawings & allocations per partnership agreement", category: "worksheet", mappedTemplate: "Drawings UU110" },
    { section: "Partnership agreement review — capital provisions", category: "checklist", mappedTemplate: "Partnership agreement UU110" },
    { section: "Income allocation — agreement vs. financial statements", category: "worksheet", mappedTemplate: "Income allocation UU110" },
  ]}],
};

// ─────────────────────────────────────────────────────────
// US — AWP Forms (Pre-engagement & Planning)
// ─────────────────────────────────────────────────────────
const usAwp41: TemplateView = {
  id: "us-awp41", title: "AWP 4.1 — Assessing Acceptability of Financial Reporting Framework",
  subtitle: "AU-C 210 — Agreeing the Terms of an Audit Engagement",
  standardsBanner: { label: "Standard:", standards: "AU-C 210 · AICPA ET §1.200", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "FRF Acceptability", rows: [
    { section: "Financial reporting framework identification", category: "checklist", mappedTemplate: "FRF identification US" },
    { section: "Acceptability of FRF for the entity", category: "checklist", mappedTemplate: "FRF acceptability US" },
    { section: "Special-purpose framework considerations", category: "checklist", mappedTemplate: "Special purpose FRF US" },
  ]}],
};
const usAwp42: TemplateView = {
  id: "us-awp42", title: "AWP 4.2 — Team Competency Matrix",
  subtitle: "AU-C 220 — Quality Control — Engagement Team Competencies",
  standardsBanner: { label: "Standard:", standards: "AU-C 220 · SQCS No. 8", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Team Competency", rows: [
    { section: "Engagement team member listing & roles", category: "worksheet", mappedTemplate: "Team roster US" },
    { section: "Competency requirements by role", category: "checklist", mappedTemplate: "Competency matrix US" },
    { section: "Specialists identified & assessed", category: "checklist", mappedTemplate: "Specialists US" },
  ]}],
};
const usAwp43: TemplateView = {
  id: "us-awp43", title: "AWP 4.3 — Code of Ethics",
  subtitle: "ET §1.000–2.000 — AICPA Code of Professional Conduct",
  standardsBanner: { label: "Standard:", standards: "AICPA ET §1.000 · SEC Rules · PCAOB Ethics", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Code of Ethics", rows: [
    { section: "Ethical principles acknowledgment", category: "checklist", mappedTemplate: "Ethical principles US" },
    { section: "Conflicts of interest identification", category: "checklist", mappedTemplate: "Conflicts of interest US" },
    { section: "Confidentiality & data protection", category: "checklist", mappedTemplate: "Confidentiality US" },
  ]}],
};
const usAwp44: TemplateView = {
  id: "us-awp44", title: "AWP 4.4 — Declaration: Conflict of Interest",
  subtitle: "ET §1.200 — Independence — Conflict of Interest Declaration",
  standardsBanner: { label: "Standard:", standards: "ET §1.200 · AU-C 220", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Conflict of Interest Declaration", rows: [
    { section: "Financial interest in client — declaration", category: "checklist", mappedTemplate: "Financial interest declaration US" },
    { section: "Family / personal relationships disclosure", category: "checklist", mappedTemplate: "Relationships disclosure US" },
    { section: "Conflict description & safeguards applied", category: "worksheet", mappedTemplate: "Conflict safeguards US" },
  ]}],
};
const usAwp45: TemplateView = {
  id: "us-awp45", title: "AWP 4.5 — Declaration: No Conflict of Interest",
  subtitle: "ET §1.200 — Independence Confirmation — No Conflicts",
  standardsBanner: { label: "Standard:", standards: "ET §1.200 · AU-C 220", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "No Conflict Declaration", rows: [
    { section: "Independence confirmation — partner & team", category: "checklist", mappedTemplate: "Independence confirmation US" },
    { section: "Prohibited relationships & interests — none identified", category: "checklist", mappedTemplate: "No prohibited relationships US" },
  ]}],
};
const usAwp46: TemplateView = {
  id: "us-awp46", title: "AWP 4.6 — Ethical Threats & Safeguards",
  subtitle: "ET §1.000–2.000 — Threats to Independence & Safeguards",
  standardsBanner: { label: "Standard:", standards: "ET §1.200 · AU-C 220 · SQCS No. 8", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Threats & Safeguards", rows: [
    { section: "Threats identification — self-interest, familiarity, advocacy", category: "checklist", mappedTemplate: "Independence threats US" },
    { section: "Safeguards applied — effectiveness assessment", category: "worksheet", mappedTemplate: "Safeguards assessment US" },
    { section: "Non-audit / consulting services — impact", category: "checklist", mappedTemplate: "NAS independence US" },
  ]}],
};
const usAwp47: TemplateView = {
  id: "us-awp47", title: "AWP 4.7 — Audit Engagement Letter",
  subtitle: "AU-C 210 — Terms of Engagement",
  standardsBanner: { label: "Standard:", standards: "AU-C 210 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Engagement Letter", rows: [
    { section: "Engagement letter — new client", category: "letter", mappedTemplate: "New client engagement letter US" },
    { section: "Engagement letter — recurring client", category: "letter", mappedTemplate: "Recurring client engagement letter US" },
    { section: "Scope, responsibilities & fee arrangements", category: "checklist", mappedTemplate: "Engagement terms US" },
  ]}],
};
const usAwp51: TemplateView = {
  id: "us-awp51", title: "AWP 5.1 — Understanding the Entity",
  subtitle: "AU-C 315 / SAS 145 — Understanding the Entity and Its Environment",
  standardsBanner: { label: "Standard:", standards: "AU-C 315 · SAS No. 145 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [
    { name: "Entity & Environment", rows: [
      { section: "Industry, regulatory & competitive factors", category: "checklist", mappedTemplate: "Industry factors US" },
      { section: "Nature of entity — operations, ownership, structure", category: "checklist", mappedTemplate: "Entity nature US" },
      { section: "Financial reporting & measurement", category: "checklist", mappedTemplate: "Financial reporting US" },
    ]},
    { name: "Internal Control", rows: [
      { section: "COSO 2013 — control environment", category: "checklist", mappedTemplate: "Control environment US" },
      { section: "Risk assessment process", category: "checklist", mappedTemplate: "Risk assessment process US" },
      { section: "Control activities & monitoring", category: "checklist", mappedTemplate: "Control activities US" },
    ]},
  ],
};
const usAwp51a: TemplateView = {
  id: "us-awp51a", title: "AWP 5.1a — Annex A: Understanding Internal Audit",
  subtitle: "AU-C 610 — Using the Work of Internal Auditors",
  standardsBanner: { label: "Standard:", standards: "AU-C 610 · IIA Standards", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Internal Audit Function", rows: [
    { section: "IA function — objectivity & competence assessment", category: "checklist", mappedTemplate: "IA objectivity US" },
    { section: "IA scope & planned work review", category: "checklist", mappedTemplate: "IA scope review US" },
    { section: "Use of IA work — coordination plan", category: "worksheet", mappedTemplate: "IA coordination US" },
  ]}],
};
const usAwp51b: TemplateView = {
  id: "us-awp51b", title: "AWP 5.1b — Annex B: Direct Assistance from Internal Audit",
  subtitle: "AU-C 610 — Direct Assistance from Internal Auditors",
  standardsBanner: { label: "Standard:", standards: "AU-C 610 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Direct IA Assistance", rows: [
    { section: "Direct assistance scope & procedures assigned", category: "worksheet", mappedTemplate: "IA direct assistance scope US" },
    { section: "Supervision & review requirements", category: "checklist", mappedTemplate: "IA supervision US" },
    { section: "Quality review of IA-performed work", category: "checklist", mappedTemplate: "IA work review US" },
  ]}],
};
const usAwp51c: TemplateView = {
  id: "us-awp51c", title: "AWP 5.1c — Annex C: Agreement for Direct Assistance",
  subtitle: "AU-C 610 — Formal Agreement for IA Direct Assistance",
  standardsBanner: { label: "Standard:", standards: "AU-C 610 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "IA Agreement", rows: [
    { section: "Formal agreement — direct assistance terms", category: "letter", mappedTemplate: "IA agreement letter US" },
    { section: "Independence & objectivity safeguards", category: "checklist", mappedTemplate: "IA independence US" },
  ]}],
};
const usAwp52: TemplateView = {
  id: "us-awp52", title: "AWP 5.2 — Evaluation of Control Environment",
  subtitle: "AU-C 315 — Control Environment (COSO Principle 1–5)",
  standardsBanner: { label: "Standard:", standards: "AU-C 315 · SAS 145 · COSO 2013", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Control Environment", rows: [
    { section: "Tone at the top — management integrity & ethics", category: "checklist", mappedTemplate: "Tone at top US" },
    { section: "Board oversight & governance structure", category: "checklist", mappedTemplate: "Board oversight US" },
    { section: "Organizational structure & authority", category: "checklist", mappedTemplate: "Org structure US" },
    { section: "Commitment to competence", category: "checklist", mappedTemplate: "Competence commitment US" },
    { section: "Accountability & performance management", category: "checklist", mappedTemplate: "Accountability US" },
  ]}],
};
const usAwp53: TemplateView = {
  id: "us-awp53", title: "AWP 5.3 — Process Flow",
  subtitle: "AU-C 315 — Significant Business Process Flowcharts",
  standardsBanner: { label: "Standard:", standards: "AU-C 315 · SAS 145 · COSO 2013", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Process Flows", rows: [
    { section: "Revenue / order-to-cash process flow", category: "worksheet", mappedTemplate: "Revenue process flow US" },
    { section: "Procure-to-pay process flow", category: "worksheet", mappedTemplate: "P2P process flow US" },
    { section: "Payroll process flow", category: "worksheet", mappedTemplate: "Payroll process flow US" },
    { section: "Financial close & reporting process flow", category: "worksheet", mappedTemplate: "Close process flow US" },
  ]}],
};
const usAwp54: TemplateView = {
  id: "us-awp54", title: "AWP 5.4 — Risk Register",
  subtitle: "AU-C 315 / SAS 145 — Risk of Material Misstatement Register",
  standardsBanner: { label: "Standard:", standards: "AU-C 315 · SAS No. 145 · AU-C 240", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Risk Register", rows: [
    { section: "Inherent risk factors by assertion", category: "worksheet", mappedTemplate: "Inherent risk US" },
    { section: "Control risk assessment by account", category: "worksheet", mappedTemplate: "Control risk US" },
    { section: "Risk of material misstatement summary", category: "worksheet", mappedTemplate: "RMM summary US" },
    { section: "Significant risks — identification & basis", category: "worksheet", mappedTemplate: "Significant risks US" },
  ]}],
};
const usAwp55: TemplateView = {
  id: "us-awp55", title: "AWP 5.5 — Log of Control Activities",
  subtitle: "AU-C 315 — Documenting Key Control Activities",
  standardsBanner: { label: "Standard:", standards: "AU-C 315 · SAS 145 · COSO 2013", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Control Activities Log", rows: [
    { section: "Key controls matrix — by assertion & account", category: "worksheet", mappedTemplate: "Key controls matrix US" },
    { section: "Control design effectiveness assessment", category: "checklist", mappedTemplate: "Control design US" },
    { section: "Controls selected for testing", category: "worksheet", mappedTemplate: "Controls to test US" },
  ]}],
};
const usAwp56: TemplateView = {
  id: "us-awp56", title: "AWP 5.6 — Determining Materiality",
  subtitle: "AU-C 320 — Materiality in Planning and Performing an Audit",
  standardsBanner: { label: "Standard:", standards: "AU-C 320 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Materiality", rows: [
    { section: "Overall materiality — calculation & basis", category: "worksheet", mappedTemplate: "Overall materiality US" },
    { section: "Performance materiality determination", category: "worksheet", mappedTemplate: "Performance materiality US" },
    { section: "Clearly trivial threshold", category: "worksheet", mappedTemplate: "Clearly trivial US" },
    { section: "Component materiality (if applicable)", category: "worksheet", mappedTemplate: "Component materiality US" },
  ]}],
};
const usAwp57: TemplateView = {
  id: "us-awp57", title: "AWP 5.7 — Risk Assessment",
  subtitle: "AU-C 315 / SAS 145 — Identifying & Assessing Risks of Material Misstatement",
  standardsBanner: { label: "Standard:", standards: "AU-C 315 · SAS No. 145 · AU-C 240", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Risk Assessment", rows: [
    { section: "Risk assessment procedures performed", category: "checklist", mappedTemplate: "RAP US" },
    { section: "Financial statement level risks", category: "worksheet", mappedTemplate: "FS level risks US" },
    { section: "Assertion level risks — significant accounts", category: "worksheet", mappedTemplate: "Assertion risks US" },
    { section: "Fraud risk factors (AU-C 240)", category: "checklist", mappedTemplate: "Fraud risk US" },
    { section: "Risks requiring special audit consideration", category: "worksheet", mappedTemplate: "Special consideration risks US" },
  ]}],
};
const usAwp58: TemplateView = {
  id: "us-awp58", title: "AWP 5.8 — Risk Response",
  subtitle: "AU-C 330 — Performing Audit Procedures in Response to Assessed Risks",
  standardsBanner: { label: "Standard:", standards: "AU-C 330 · AU-C 500 · SAS No. 145", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Risk Response", rows: [
    { section: "Overall response — FS level risks", category: "checklist", mappedTemplate: "Overall response US" },
    { section: "Planned tests of controls", category: "worksheet", mappedTemplate: "Planned ToC US" },
    { section: "Planned substantive procedures by area", category: "worksheet", mappedTemplate: "Planned substantive US" },
    { section: "Risk-procedure linkage matrix", category: "worksheet", mappedTemplate: "Risk procedure linkage US" },
  ]}],
};

// US Conducting, Completion, Reporting, Follow-Up
const usAwp61: TemplateView = {
  id: "us-awp61", title: "AWP 6.1 — Tests of Controls",
  subtitle: "AU-C 330 — Tests of the Operating Effectiveness of Controls",
  standardsBanner: { label: "Standard:", standards: "AU-C 330 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Tests of Controls", rows: [
    { section: "Control testing procedures — inquiry & observation", category: "checklist", mappedTemplate: "ToC inquiry US" },
    { section: "Control testing — reperformance & inspection", category: "worksheet", mappedTemplate: "ToC reperformance US" },
    { section: "Deviations noted & evaluation", category: "worksheet", mappedTemplate: "Deviations US" },
    { section: "Impact on control reliance conclusion", category: "checklist", mappedTemplate: "Reliance conclusion US" },
  ]}],
};
const usAwp62: TemplateView = {
  id: "us-awp62", title: "AWP 6.2 — Substantive Analytical Procedures",
  subtitle: "AU-C 520 — Analytical Procedures",
  standardsBanner: { label: "Standard:", standards: "AU-C 520 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Substantive Analytics", rows: [
    { section: "Expectation development & data reliability", category: "worksheet", mappedTemplate: "SAP expectation US" },
    { section: "Variance analysis & threshold", category: "worksheet", mappedTemplate: "SAP variance US" },
    { section: "Explanations & corroboration", category: "checklist", mappedTemplate: "SAP corroboration US" },
  ]}],
};
const usAwp63: TemplateView = {
  id: "us-awp63", title: "AWP 6.3 — Tests of Details — Revenue",
  subtitle: "AU-C 330 · ASC 606 — Revenue Recognition Testing",
  standardsBanner: { label: "Standard:", standards: "AU-C 330 · ASC 606 · AU-C 240", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Revenue Testing", rows: [
    { section: "Revenue sample selection — population & approach", category: "worksheet", mappedTemplate: "Revenue sample US" },
    { section: "Revenue recognition — 5-step model compliance", category: "worksheet", mappedTemplate: "ASC 606 testing US" },
    { section: "Revenue cut-off testing", category: "worksheet", mappedTemplate: "Revenue cut-off US" },
    { section: "Deferred revenue accuracy", category: "worksheet", mappedTemplate: "Deferred revenue US" },
  ]}],
};
const usAwp64: TemplateView = {
  id: "us-awp64", title: "AWP 6.4 — Tests of Details — Expenses",
  subtitle: "AU-C 330 — Substantive Testing of Expense Accounts",
  standardsBanner: { label: "Standard:", standards: "AU-C 330 · AICPA · ASC", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Expense Testing", rows: [
    { section: "Expense sample — selection & testing", category: "worksheet", mappedTemplate: "Expense sample US" },
    { section: "Cut-off — purchases & expense accruals", category: "worksheet", mappedTemplate: "Expense cut-off US" },
    { section: "Search for unrecorded liabilities", category: "worksheet", mappedTemplate: "Unrecorded liabilities US" },
  ]}],
};
const usAwp65: TemplateView = {
  id: "us-awp65", title: "AWP 6.5 — External Confirmations",
  subtitle: "AU-C 505 — External Confirmations",
  standardsBanner: { label: "Standard:", standards: "AU-C 505 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "External Confirmations", rows: [
    { section: "Bank confirmations — sent & received", category: "worksheet", mappedTemplate: "Bank confirmations US" },
    { section: "AR confirmations — sent & received", category: "worksheet", mappedTemplate: "AR confirmations US" },
    { section: "Debt & credit facility confirmations", category: "worksheet", mappedTemplate: "Debt confirmations US" },
    { section: "Legal confirmations (attorneys' letters)", category: "worksheet", mappedTemplate: "Legal confirmations US" },
    { section: "Non-responses — alternative procedures", category: "checklist", mappedTemplate: "Non-response alternatives US" },
  ]}],
};
const usAwp66: TemplateView = {
  id: "us-awp66", title: "AWP 6.6 — Sampling Worksheet",
  subtitle: "AU-C 530 — Audit Sampling",
  standardsBanner: { label: "Standard:", standards: "AU-C 530 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Sampling", rows: [
    { section: "Sample size determination — statistical / judgmental", category: "worksheet", mappedTemplate: "Sample size US" },
    { section: "Sample selection method documentation", category: "worksheet", mappedTemplate: "Sample selection US" },
    { section: "Sample results & misstatement projection", category: "worksheet", mappedTemplate: "Sample results US" },
  ]}],
};
const usAwp71: TemplateView = {
  id: "us-awp71", title: "AWP 7.1 — Accumulation of Misstatements (AIM)",
  subtitle: "AU-C 450 — Evaluation of Misstatements",
  standardsBanner: { label: "Standard:", standards: "AU-C 450 · AU-C 320 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "AIM Schedule", rows: [
    { section: "AIM — factual misstatements by account", category: "worksheet", mappedTemplate: "AIM factual US" },
    { section: "AIM — judgmental misstatements", category: "worksheet", mappedTemplate: "AIM judgmental US" },
    { section: "AIM — projected misstatements from sampling", category: "worksheet", mappedTemplate: "AIM projected US" },
    { section: "Comparison to materiality & evaluation", category: "worksheet", mappedTemplate: "Materiality comparison US" },
  ]}],
};
const usAwp72: TemplateView = {
  id: "us-awp72", title: "AWP 7.2 — Going Concern — Final Assessment",
  subtitle: "AU-C 570 — Going Concern",
  standardsBanner: { label: "Standard:", standards: "AU-C 570 · ASU 2014-15 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Going Concern Final", rows: [
    { section: "Substantial doubt indicators — final evaluation", category: "checklist", mappedTemplate: "GC doubt US" },
    { section: "Management's mitigation plans — feasibility", category: "checklist", mappedTemplate: "GC plans US" },
    { section: "Disclosure adequacy review", category: "checklist", mappedTemplate: "GC disclosure US" },
    { section: "Impact on auditor's report", category: "checklist", mappedTemplate: "GC report US" },
  ]}],
};
const usAwp73: TemplateView = {
  id: "us-awp73", title: "AWP 7.3 — Subsequent Events Checklist",
  subtitle: "AU-C 560 — Subsequent Events and Subsequently Discovered Facts",
  standardsBanner: { label: "Standard:", standards: "AU-C 560 · ASC 855 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Subsequent Events", rows: [
    { section: "Management inquiry — subsequent events", category: "checklist", mappedTemplate: "Subsequent events inquiry US" },
    { section: "Minutes review — post year-end board meetings", category: "checklist", mappedTemplate: "Board minutes US" },
    { section: "Type I & Type II event classification", category: "checklist", mappedTemplate: "Events classification US" },
    { section: "Disclosure — ASC 855", category: "checklist", mappedTemplate: "Subsequent events disclosure US" },
  ]}],
};
const usAwp74: TemplateView = {
  id: "us-awp74", title: "AWP 7.4 — Management Representation Letter",
  subtitle: "AU-C 580 — Written Representations",
  standardsBanner: { label: "Standard:", standards: "AU-C 580 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Management Rep Letter", rows: [
    { section: "Management representation letter — standard", category: "letter", mappedTemplate: "Mgmt rep letter US standard" },
    { section: "Additional representations — specific areas", category: "letter", mappedTemplate: "Mgmt rep additional US" },
    { section: "Dating & signing confirmation", category: "checklist", mappedTemplate: "Mgmt rep dating US" },
  ]}],
};
const usAwp75: TemplateView = {
  id: "us-awp75", title: "AWP 7.5 — Completion Checklist",
  subtitle: "AU-C 220 — Quality Control for an Audit of Financial Statements",
  standardsBanner: { label: "Standard:", standards: "AU-C 220 · SQCS No. 8 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Completion Checklist", rows: [
    { section: "All significant procedures completed", category: "checklist", mappedTemplate: "Procedures completion US" },
    { section: "Review points cleared", category: "checklist", mappedTemplate: "Review points US" },
    { section: "Significant matters documented", category: "checklist", mappedTemplate: "Significant matters US" },
    { section: "File assembly within 60-day period", category: "checklist", mappedTemplate: "File assembly US" },
    { section: "US GAAP disclosure checklist completed", category: "checklist", mappedTemplate: "GAAP disclosure US" },
  ]}],
};
const usAwp81: TemplateView = {
  id: "us-awp81", title: "AWP 8.1 — Independent Auditor's Report (AU-C 700)",
  subtitle: "AU-C 700 / SAS 134 — Forming an Opinion and Reporting",
  standardsBanner: { label: "Standard:", standards: "AU-C 700 · SAS No. 134 · AU-C 705 · AU-C 706", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Auditor's Report", rows: [
    { section: "Unmodified opinion — standard report (SAS 134)", category: "report", mappedTemplate: "Unmodified report SAS 134" },
    { section: "Modified opinion — qualified (AU-C 705)", category: "report", mappedTemplate: "Qualified report US" },
    { section: "Emphasis of matter / other matter paragraphs", category: "report", mappedTemplate: "Emphasis other matter US" },
    { section: "Comparative information (AU-C 710)", category: "checklist", mappedTemplate: "Comparative info US" },
  ]}],
};
const usAwp82: TemplateView = {
  id: "us-awp82", title: "AWP 8.2 — Communication with Those Charged with Governance",
  subtitle: "AU-C 260 — Communication with Those Charged with Governance",
  standardsBanner: { label: "Standard:", standards: "AU-C 260 · AU-C 265 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Governance Communication", rows: [
    { section: "Audit findings & significant matters letter", category: "letter", mappedTemplate: "Governance communication US" },
    { section: "Significant accounting policies discussion", category: "checklist", mappedTemplate: "Accounting policies communication US" },
    { section: "Significant difficulties & disagreements", category: "checklist", mappedTemplate: "Difficulties US" },
  ]}],
};
const usAwp83: TemplateView = {
  id: "us-awp83", title: "AWP 8.3 — Internal Control Deficiency Letter (AU-C 265)",
  subtitle: "AU-C 265 — Communicating Internal Control Related Matters",
  standardsBanner: { label: "Standard:", standards: "AU-C 265 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "IC Deficiency Communication", rows: [
    { section: "Material weaknesses identified — description", category: "letter", mappedTemplate: "Material weakness letter US" },
    { section: "Significant deficiencies — description", category: "letter", mappedTemplate: "Significant deficiency letter US" },
    { section: "Management response & remediation plans", category: "checklist", mappedTemplate: "Management response US" },
  ]}],
};
const usAwp91: TemplateView = {
  id: "us-awp91", title: "AWP 9.1 — Follow-Up on Prior Year Findings",
  subtitle: "AU-C 265 — Follow-Up on Prior Period Deficiencies",
  standardsBanner: { label: "Standard:", standards: "AU-C 265 · AU-C 300 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Prior Year Follow-Up", rows: [
    { section: "Prior year findings listing", category: "worksheet", mappedTemplate: "Prior findings list US" },
    { section: "Status of remediation — resolved / outstanding", category: "worksheet", mappedTemplate: "Remediation status US" },
    { section: "Re-testing of remediated controls", category: "checklist", mappedTemplate: "Remediation testing US" },
  ]}],
};
const usAwp92: TemplateView = {
  id: "us-awp92", title: "AWP 9.2 — Client Action Items & Responses",
  subtitle: "Post-Audit Client Action Items and Management Responses",
  standardsBanner: { label: "Standard:", standards: "AU-C 265 · AICPA", badge: "AICPA / US GAAS", color: "green" },
  sections: [{ name: "Client Action Items", rows: [
    { section: "Management letter points — all findings", category: "worksheet", mappedTemplate: "Management letter points US" },
    { section: "Client response & committed timeline", category: "worksheet", mappedTemplate: "Client response US" },
    { section: "Follow-up schedule", category: "worksheet", mappedTemplate: "Follow-up schedule US" },
  ]}],
};

// ── Tax stubs ──
const taxT1: TemplateView = {
  id: "tax-t1",
  title: "T1 Personal Return",
  subtitle: "CRA T1 — Individual Income Tax Return",
  standardsBanner: { label: "Standard:", standards: "ITA — Income Tax Act (Canada) · CRA T1 General", badge: "CPA Canada", color: "blue" },
  sections: [
    { name: "Client Intake & Onboarding", rows: [
      { section: "Engagement letter (T1)", category: "letter", mappedTemplate: "T1 engagement letter" },
      { section: "Prior-year return & carryforward amounts", category: "checklist", mappedTemplate: "T1 prior year checklist" },
      { section: "Personal information & SIN confirmation", category: "checklist", mappedTemplate: "T1 personal info checklist" },
    ]},
    { name: "Income Slips & Receipts", rows: [
      { section: "Employment income (T4)", category: "checklist", mappedTemplate: "T4 income checklist" },
      { section: "Investment income (T3, T5, T5008)", category: "checklist", mappedTemplate: "Investment income checklist" },
      { section: "Self-employment / business income (T2125)", category: "worksheet", mappedTemplate: "Self-employment worksheet" },
      { section: "Rental income (T776)", category: "worksheet", mappedTemplate: "Rental income worksheet" },
      { section: "Other income (pension, CPP, OAS, EI)", category: "checklist", mappedTemplate: "Other income checklist" },
    ]},
    { name: "Deductions & Credits", rows: [
      { section: "RRSP contributions & deduction limit", category: "worksheet", mappedTemplate: "RRSP worksheet" },
      { section: "Charitable donations (T2500 series)", category: "checklist", mappedTemplate: "Charitable donations checklist" },
      { section: "Medical expenses", category: "checklist", mappedTemplate: "Medical expenses checklist" },
      { section: "Child care expenses (T778)", category: "checklist", mappedTemplate: "Child care checklist" },
      { section: "Home office expenses (T2200)", category: "checklist", mappedTemplate: "Home office checklist" },
      { section: "Capital gains / losses (Schedule 3)", category: "worksheet", mappedTemplate: "Capital gains worksheet" },
    ]},
    { name: "Review & Filing", rows: [
      { section: "T1 review checklist", category: "checklist", mappedTemplate: "T1 review checklist" },
      { section: "Balance owing / refund confirmation", category: "worksheet", mappedTemplate: "T1 balance worksheet" },
      { section: "EFILE / NetFile transmission", category: "checklist", mappedTemplate: "T1 EFILE checklist" },
      { section: "Client copy & signed T183", category: "checklist", mappedTemplate: "T183 authorization checklist" },
    ]},
  ],
};

const taxT2: TemplateView = {
  id: "tax-t2",
  title: "T2 Corporate Return",
  subtitle: "CRA T2 — Corporation Income Tax Return",
  standardsBanner: { label: "Standard:", standards: "ITA — Income Tax Act (Canada) · CRA T2 · CBCA", badge: "CPA Canada", color: "blue" },
  sections: [
    { name: "Engagement & Intake", rows: [
      { section: "Engagement letter (T2)", category: "letter", mappedTemplate: "T2 engagement letter" },
      { section: "Corporate profile & year-end confirmation", category: "checklist", mappedTemplate: "T2 corporate profile checklist" },
      { section: "Prior-year T2 & GIFI review", category: "checklist", mappedTemplate: "T2 prior year checklist" },
    ]},
    { name: "Financial Statement Tie-in", rows: [
      { section: "GIFI code mapping — Balance Sheet", category: "worksheet", mappedTemplate: "GIFI balance sheet worksheet" },
      { section: "GIFI code mapping — Income Statement", category: "worksheet", mappedTemplate: "GIFI income statement worksheet" },
      { section: "Reconciliation: accounting income → taxable income (S1)", category: "worksheet", mappedTemplate: "Schedule 1 reconciliation" },
    ]},
    { name: "Tax Schedules", rows: [
      { section: "Capital cost allowance (Schedule 8)", category: "worksheet", mappedTemplate: "CCA schedule worksheet" },
      { section: "Shareholder loans & related party (Schedule 11)", category: "worksheet", mappedTemplate: "Schedule 11 worksheet" },
      { section: "Small business deduction (Schedule 7)", category: "worksheet", mappedTemplate: "Small business deduction worksheet" },
      { section: "Investment tax credits (T2038)", category: "checklist", mappedTemplate: "ITC checklist" },
      { section: "Dividends paid (Schedule 3 / T5)", category: "worksheet", mappedTemplate: "Dividend worksheet" },
      { section: "GRIP / LRIP calculations", category: "worksheet", mappedTemplate: "GRIP LRIP worksheet" },
    ]},
    { name: "Review & Filing", rows: [
      { section: "T2 review checklist", category: "checklist", mappedTemplate: "T2 review checklist" },
      { section: "Balance owing / instalment confirmation", category: "worksheet", mappedTemplate: "T2 balance worksheet" },
      { section: "CRA NET File transmission", category: "checklist", mappedTemplate: "T2 NET File checklist" },
      { section: "Corporate minutes & signed authorization", category: "checklist", mappedTemplate: "T2 authorization checklist" },
    ]},
  ],
};

export const allTemplateViews: Record<string, TemplateView> = {
  comp4200,
  rev2400: review2400,
  audit5100,
  audit5101,
  audit6100,
  audit6200,
  // Canada Completion (300–399)
  "ca-305": ca305,
  "ca-306": ca306,
  "ca-310": ca310,
  "ca-312": ca312,
  "ca-313": ca313,
  "ca-314": ca314,
  // Canada Planning (400–499)
  "ca-408": ca408,
  "ca-410": ca410,
  "ca-420": ca420,
  "ca-428": ca428,
  "ca-430": ca430,
  "ca-436": ca436,
  "ca-440": ca440,
  "ca-450": ca450,
  "ca-451": ca451,
  // Canada Risk Assessment (500–599)
  "ca-500": ca500,
  "ca-501": ca501,
  "ca-520": ca520,
  "ca-525": ca525,
  "ca-530": ca530,
  "ca-535": ca535,
  "ca-540": ca540,
  "ca-550": ca550,
  "ca-551": ca551,
  "ca-575": ca575,
  "ca-580": ca580,
  "ca-582": ca582,
  "ca-590": ca590,
  // Canada Response (600–699)
  "ca-605": ca605,
  "ca-606": ca606,
  "ca-610": ca610,
  "ca-614": ca614,
  "ca-615": ca615,
  "ca-620": ca620,
  "ca-625": ca625,
  "ca-630": ca630,
  "ca-635": ca635,
  "ca-637": ca637,
  "ca-645": ca645,
  "ca-650": ca650,
  "ca-655": ca655,
  "ca-666": ca666,
  "ca-670": ca670,
  "ca-675": ca675,
  "ca-680": ca680,
  // Canada Assets (A–Z)
  "ca-a100": caA100,
  "ca-a110": caA110,
  "ca-a115": caA115,
  "ca-b100": caB100,
  "ca-c100": caC100,
  "ca-c110": caC110,
  "ca-d100": caD100,
  "ca-d110": caD110,
  "ca-e100": caE100,
  "ca-l100": caL100,
  "ca-n100": caN100,
  "ca-u100": caU100,
  "ca-w100": caW100,
  // Canada Liabilities & Equity (AA–ZZ)
  "ca-aa100": caAA100,
  "ca-bb100": caBB100,
  "ca-cc100": caCC100,
  "ca-cc110": caCC110,
  "ca-ff100": caFF100,
  "ca-gg100": caGG100,
  "ca-kk100": caKK100,
  "ca-uu100": caUU100,
  "ca-uu110": caUU110,
  // US Pre-engagement
  "us-awp41": usAwp41,
  "us-awp42": usAwp42,
  "us-awp43": usAwp43,
  "us-awp44": usAwp44,
  "us-awp45": usAwp45,
  "us-awp46": usAwp46,
  "us-awp47": usAwp47,
  // US Planning
  "us-awp51": usAwp51,
  "us-awp51a": usAwp51a,
  "us-awp51b": usAwp51b,
  "us-awp51c": usAwp51c,
  "us-awp52": usAwp52,
  "us-awp53": usAwp53,
  "us-awp54": usAwp54,
  "us-awp55": usAwp55,
  "us-awp56": usAwp56,
  "us-awp57": usAwp57,
  "us-awp58": usAwp58,
  // US Conducting
  "us-awp61": usAwp61,
  "us-awp62": usAwp62,
  "us-awp63": usAwp63,
  "us-awp64": usAwp64,
  "us-awp65": usAwp65,
  "us-awp66": usAwp66,
  // US Completion
  "us-awp71": usAwp71,
  "us-awp72": usAwp72,
  "us-awp73": usAwp73,
  "us-awp74": usAwp74,
  "us-awp75": usAwp75,
  // US Reporting
  "us-awp81": usAwp81,
  "us-awp82": usAwp82,
  "us-awp83": usAwp83,
  // US Follow-Up
  "us-awp91": usAwp91,
  "us-awp92": usAwp92,
  // Tax
  "tax-t1": taxT1,
  "tax-t2": taxT2,
};
