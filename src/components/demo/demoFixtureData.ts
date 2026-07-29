export const DEMO_CLIENT = {
  id: 'DEMO-NPM',
  legalName: 'Northline Precision Manufacturing Inc.',
  shortName: 'Northline Precision',
  entityType: 'Corporation (CCPC)',
  province: 'Ontario',
  fiscalYearEnd: 'December 31, 2025',
  framework: 'ASPE',
  standard: 'CAS',
  accountingSystem: 'QuickBooks Online',
  priorYearBasis: 'Review (CSRE 2400)',
  firstYearAudit: true,
};

export const DEMO_FINANCIALS = {
  revenue: 14_200_000,
  totalAssets: 9_617_340,
  netIncomeBeforeTax: 1_140_000,
  headcount: 62,
  locations: ['Mississauga plant', 'Barrie warehouse'],
};

export const DEMO_MATERIALITY = {
  overall: 142_000,
  performance: 92_300,
  clearlyTrivial: 7_100,
  benchmark: 'Revenue',
  percentage: 1.0,
};

export const DEMO_TEAM = {
  partner: 'R. Chandra',
  manager: 'S. Whitfield',
  senior: 'D. Okonkwo',
  agent: 'Luka',
};

export const DEMO_ENGAGEMENT_ID = 'AUD-NPM-Dec312025';

export const DEMO_PROVENANCE = {
  revenue: {
    value: '$14,200,000',
    source: 'Xero GL, account 4000 (Revenue) · 4,211 transactions · pulled 2026-07-20 14:02',
    logic: 'Sum of all credit entries to account 4000 for the period Jan 1 – Dec 31, 2025.',
    confidence: 'High' as const,
  },
  materiality: {
    value: '$142,000 (1% of revenue)',
    source: 'Derived from Xero trial balance · revenue benchmark selected',
    logic: 'Manufacturing entity; revenue selected as benchmark because earnings are volatile across the 3-year window and primary users are the lender and shareholder.',
    confidence: 'High' as const,
  },
  businessNumber: {
    value: '123456789 RC0001',
    source: 'Ontario Business Registry · retrieved 2026-07-20',
    logic: 'Auto-populated from corporate registry lookup using the legal entity name.',
    confidence: 'High' as const,
  },
  warrantyProvision: {
    value: '$87,400',
    source: 'Prior-year review file · Note 6 (Warranty provision) · page 14',
    logic: 'Carried forward from prior-year review file; flagged for re-evaluation under CAS 540 as a management estimate.',
    confidence: 'Medium' as const,
  },
  relatedParty: {
    value: 'Northline Holdings Inc. — shareholder-owned holdco',
    source: 'Xero GL counterparty matching · Ontario Business Registry · Cap table',
    logic: 'Rent payments to Northline Holdings Inc. identified via GL counterparty analysis; corporate registry confirms common directorship with Northline Precision.',
    confidence: 'High' as const,
  },
  covenantRatio: {
    value: 'DSCR 1.42× (covenant minimum: 1.25×)',
    source: 'Term loan agreement · Schedule B · clause 6.3 · p.18 · extracted 2026-07-21',
    logic: 'Debt service coverage ratio calculated from audited EBITDA and scheduled principal/interest payments per the loan agreement.',
    confidence: 'Medium' as const,
  },
};

export const DEMO_LUKA_PROC_ACTIONS: Record<string, { sources: string[]; actions: { label: string; description: string }[] }> = {
  "gca-ws-proc-cash": {
    sources: ["Xero bank feed", "TB cash accounts"],
    actions: [
      { label: "Bank reconciliation work paper", description: "Populate from connected bank feed and TB cash accounts" },
      { label: "Cash count sheet", description: "Generate count sheet from petty cash balance in TB" },
    ],
  },
  "gca-ws-proc-cash-bank": {
    sources: ["Xero bank feed", "TB cash accounts"],
    actions: [
      { label: "Bank reconciliation work paper", description: "Populate from connected bank feed and TB cash accounts" },
    ],
  },
  "gca-ws-proc-ar": {
    sources: ["Xero AR subledger", "Post year-end receipts"],
    actions: [
      { label: "Confirmation letter — stratified sample", description: "Generate confirmation letters from AR subledger" },
      { label: "Aged AR schedule", description: "Pull aging buckets from Xero AR report" },
      { label: "Subsequent receipts testing", description: "Match post year-end receipts against year-end AR balance" },
    ],
  },
  "gca-ws-proc-ar-conf": {
    sources: ["Xero AR subledger"],
    actions: [
      { label: "Confirmation letter — stratified sample", description: "Generate confirmation letters from AR subledger" },
    ],
  },
};

export const DEMO_LUKA_ACTIONS = {
  riskAssessment: {
    sources: ["Prior file (2024 Review)", "Xero GL", "Risk library"],
    actions: [
      { label: "Populate risks from prior file", description: "Carry forward identified risks from 2024 review file" },
      { label: "Flag significant risks", description: "Auto-mark risks above High inherent threshold" },
      { label: "Cross-reference to 520", description: "Link identified risks to risk register" },
    ],
  },
  procedures: {
    sources: ["Engagement scope", "590 procedure library"],
    actions: [
      { label: "Load procedures from engagement scope", description: "Pull 590 procedure library into this worksheet" },
      { label: "Mark automatable procedures", description: "Flag procedures Luka can initiate work papers for" },
    ],
  },
  completion: {
    sources: ["Signed-off worksheets", "Prior file"],
    actions: [
      { label: "Populate from signed-off sections", description: "Pull conclusions from completed risk and procedure worksheets" },
      { label: "Flag open items", description: "Identify sections still requiring auditor judgment" },
    ],
  },
  generic: {
    sources: ["Prior file", "Xero GL"],
    actions: [
      { label: "Auto-populate from prior file", description: "Carry forward and flag for re-evaluation" },
    ],
  },
};
