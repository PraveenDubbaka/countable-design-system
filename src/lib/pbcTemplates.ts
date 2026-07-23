export interface PBCTemplate {
 id: string;
 label: string;
 wpRef: string;
 generate: (ctx: {
 clientName: string;
 engagementId: string;
 yearEnd: string;
 wpNumbers: string[];
 }) => string;
}

export const PBC_TEMPLATES: PBCTemplate[] = [
 {
 id: "memo-540",
 label: "Control Assessment and Documentation",
 wpRef: "540",
 generate: ({ clientName, engagementId, yearEnd }) => `# Control Assessment and Documentation

**FOR CLIENT TO COMPLETE**

**Client:** ${clientName} | **Engagement:** ${engagementId} | **Period:** ${yearEnd}

---

**Who:** ______________________________

**When:** ______________________________

**Where:** ______________________________

---

## Control Documentation

### Entity Level Controls

Company allocates tasks to different staffs on an ad hoc basis to management / consultants with the most related expertise. Management is also provided with funding to ensure their responsibilities can be carried out effectively.

The Company does not have any formal performance review and does not have any compensation for any of its management nor consultants. The level of work is assessed based on everyday observations.

Management monitors internal controls based on daily observation. The Company does not have a formal review and assessment of internal control effectiveness.

---

### IT General Controls

The Company does not have a formal IT department. Bookkeeping is performed by __________________ in __________________. The access to __________________ is not password protected. Access to __________________'s computer is password protected and only he as the CFO has access to the file.

---

### Financial Reporting Process

The Company does not have a formal financial reporting process. __________________ does bookkeeping for the Company in __________________. Invoices and supporting documents are sent to __________________ for processing and recording. Only the non-recurring journal entries entered by __________________ are reviewed by __________________.

Financial statements are prepared by __________________ in Microsoft Word using the trial balance generated from __________________. __________________ and __________________ review the financial statements and note disclosure. Final approval on financial statements will be obtained from audit committee/Board of Directors.

---

### Revenue

Explain revenue processes / controls (examples — sales order processing / recording shipping / sales receipts entry / credit control). Explain processes / controls to ensure revenue is reported in the correct period.

________________________________________________________________________________

________________________________________________________________________________

---

### Expenses, Disbursements, and A/P

To be revised as required. Explain processes relating to purchasing (examples — order initiating, receiving, payment etc.). Explain processes / controls to ensure expenditure is recorded in the correct period.

There are no formal policies relating to selection of vendors. New Vendors are selected based on directors' experience and the service required. Further, there are no purchase orders used in the process. The directors will contact vendors directly for work to be performed. All directors have the ability to initiate the purchases. For significant transactions, at the discretion of directors, they will have to be discussed and approved in the directors' resolutions.

Due to the limited number of transactions, directors are able to ensure all goods and services are received prior to payment. There is no bill of landing or initial to indicate goods ordered are received before recording / payments made. The directors will pay each vendor when funds are made available. There is no approval of invoices.

Two signatures are required on cheques. __________________, __________________ and __________________ have signing authority over the bank.

---

### Treasury Controls

Equity transactions are initiated through a directors' resolution for approval. Subscription agreements are prepared by __________________ in consult with legal, which are submitted by the Company to the transfer agent to issue share certificates. The Company uses __________________ to maintain its capital records.`,
 },
 {
 id: "it-questionnaire",
 label: "Questionnaire",
 wpRef: "IT",
 generate: ({ clientName, engagementId, yearEnd, wpNumbers }) => {
 const forms = wpNumbers && wpNumbers.length > 0 ? wpNumbers : ["511"];
 const formLabel = forms.join(", ");
 const blank = "\n\n________________________________________________________________________________\n";

 const SECTIONS: Record<string, { title: string; questions: string[] }> = {
 "505": {
 title: "Management Inquiries (WP 505)",
 questions: [
 "Describe management's process for identifying and assessing risks that could affect the financial statements.",
 "What are the significant changes to the Company's business, operations, or financial condition since the prior year?",
 "How does management monitor compliance with laws, regulations, and contractual obligations?",
 "Describe the process by which management reviews and approves journal entries, estimates, and judgments in the financial statements.",
 "Are there any matters management wishes to bring to the auditor's attention that may affect the audit?",
 ],
 },
 "506": {
 title: "Fraud Risk (WP 506)",
 questions: [
 "What controls are in place to prevent or detect fraud or error within the Company?",
 "Is management aware of any alleged, suspected, or actual fraud, misappropriation of assets, or irregularities involving any employee or management?",
 "Has the Company, or any officer or director, been subject to an investigation or received any communications from a regulatory authority?",
 "Describe the controls in place around the authorization of payments, expense claims, and journal entries to prevent unauthorized transactions.",
 "What is management's assessment of the Company's susceptibility to fraud, including management override of controls?",
 ],
 },
 "507": {
 title: "Governance Minutes (WP 507)",
 questions: [
 "How often does the Board of Directors / Audit Committee meet, and who is responsible for preparing and maintaining meeting minutes?",
 "What significant decisions or resolutions were approved by the Board during the year? Please provide a list.",
 "Describe the role of the Audit Committee in overseeing the financial reporting process and the external audit.",
 "Were there any changes to the composition of the Board or Audit Committee during the year? If so, please describe.",
 "How are significant transactions (e.g., acquisitions, disposals, major contracts) approved by the Board?",
 ],
 },
 "510": {
 title: "Entity Understanding (WP 510)",
 questions: [
 "What does the Company do and in which geographic markets does it operate?",
 "Please describe the Company's organizational structure, including subsidiaries and ownership percentages.",
 "Who are the key management personnel and what are their roles and responsibilities in financial reporting?",
 "What are the Company's primary revenue sources and describe the revenue recognition process?",
 "What significant changes occurred in the Company's business, industry, or regulatory environment during the year?",
 "Who are the Company's key customers, suppliers, and business partners, and does the Company rely on any single party for a significant portion of revenue or supply?",
 ],
 },
 "511": {
 title: "IT Environment (WP 511)",
 questions: [
 "Describe the software and key applications, including spreadsheets, that the Company uses to prepare financial information and reports (e.g., QuickBooks, Sage, Navision).",
 "Is the software an \"off the shelf\" program or has it been customized? Describe any customization, change management procedures, or automated controls.",
 "Did a system changeover occur during the year? If so, describe the transition including controls over the conversion and any post-implementation review.",
 "Describe the controls related to password protection and prevention of unauthorized access, including how access levels are commensurate with roles.",
 "Describe the controls to authorize new users, modify existing access, and remove access upon termination or transfer.",
 "Describe controls over physical access to data and hardware, including data back-up location, frequency, and integrity oversight.",
 "Indicate how transactions are initiated and recorded through the Company's information system and incorporated into the general ledger.",
 "Describe the Company's cybersecurity policies, controls, and oversight. Has the Company experienced any cybersecurity incidents?",
 "Describe policies and procedures relating to the selection and use of third-party IT service providers, including data security and monitoring of service levels.",
 ],
 },
 "513": {
 title: "Accounting Estimates (WP 513)",
 questions: [
 "What are the significant accounting estimates and judgments the Company made during the year (e.g., allowances, impairment, provisions, fair values)?",
 "Describe the process used by management to develop each significant estimate, including the key assumptions and data sources relied upon.",
 "How does management assess the sensitivity of significant estimates to changes in key assumptions?",
 "Were there any changes in accounting estimates from the prior year? If so, describe the nature of the changes and the reason for them.",
 "Who reviews and approves significant estimates, and how is the review documented?",
 ],
 },
 "514": {
 title: "Prior Period Estimates (WP 514)",
 questions: [
 "For each significant prior period estimate, please describe the actual outcome or revised estimate and any difference from the amount recorded in the prior year financial statements.",
 "Were any prior period errors identified and corrected during the current year? If so, describe the nature of the errors and the impact on the financial statements.",
 "Describe any changes in accounting policies or estimates applied during the current year relative to the prior year.",
 "Have any prior period adjustments been reflected in the opening balances for the current year?",
 ],
 },
 "515": {
 title: "Related Parties (WP 515)",
 questions: [
 "Please list all persons and entities considered to be related parties of the Company, including directors, officers, significant shareholders, close family members, and companies under common control.",
 "For each related party, describe the nature and terms of all transactions during the year, including amounts, balances, and whether the transactions were conducted at arm's length.",
 "Describe the controls that exist around approval of significant related party transactions.",
 "Are there any undisclosed related party relationships or transactions management is aware of?",
 "What procedures are in place to ensure all related party transactions are identified, authorized, and appropriately disclosed in the financial statements?",
 ],
 },
 "520": {
 title: "Risk Register (WP 520)",
 questions: [
 "What does management consider to be the Company's most significant financial reporting risks, and how are these risks monitored?",
 "Describe the process by which management identifies and updates the Company's risk register or risk assessment.",
 "What mitigating controls are in place for each significant identified risk?",
 "Have any new or emerging risks been identified during the year that could affect the financial statements?",
 "How does management evaluate whether its risk mitigation strategies are effective?",
 ],
 },
 "525": {
 title: "Going Concern (WP 525)",
 questions: [
 "Describe any events or conditions that may cast significant doubt on the Company's ability to continue as a going concern.",
 "What is management's assessment of the Company's ability to meet its financial obligations for at least the next 12 months?",
 "If there are going concern concerns, what plans does management have to address them (e.g., refinancing, asset sales, capital raises)?",
 "Describe the Company's current liquidity position, including available credit facilities, cash reserves, and upcoming debt maturities.",
 ],
 },
 "530": {
 title: "Pervasive Risks (WP 530)",
 questions: [
 "Describe any business, industry, or economic conditions that may give rise to significant risks of material misstatement in the financial statements.",
 "Are there any significant pressures on management to achieve financial results that could create incentives for earnings manipulation?",
 "Describe how management assesses and responds to risks arising from the complexity of the Company's transactions, estimates, or financial reporting requirements.",
 "Are there any significant regulatory, legal, or compliance risks that could affect the financial statements?",
 ],
 },
 "535": {
 title: "Information System (WP 535)",
 questions: [
 "Describe how financial and operational information flows from initiation of a transaction through to recording in the general ledger and reporting in the financial statements.",
 "What systems and processes are in place to capture, process, and disclose events and conditions other than routine transactions?",
 "Describe the controls in place to ensure completeness and accuracy of data entered into financial reporting systems.",
 "How are manual journal entries and adjustments controlled, reviewed, and authorized?",
 "Describe the human resources responsible for financial reporting, including their competence, adequacy of resources, and any segregation of duties concerns.",
 ],
 },
 "540": {
 title: "Control Design (WP 540)",
 questions: [
 "Describe the design of key internal controls over financial reporting, including preventive and detective controls.",
 "For each significant process area (revenue, purchasing, payroll, treasury), describe the key controls in place and who performs them.",
 "How does management evaluate the design effectiveness of internal controls?",
 "Were there any changes to the design of key internal controls during the year? If so, describe the nature of the changes.",
 "Are there any identified control gaps or weaknesses management is aware of? If so, describe the compensating controls or remediation plans.",
 ],
 },
 "550": {
 title: "Control Activities (WP 550)",
 questions: [
 "Describe the control activities in place for each of the following areas: authorization of transactions, segregation of duties, reconciliations, physical safeguarding of assets, and management review.",
 "How does management monitor the operating effectiveness of control activities on an ongoing basis?",
 "Were any control deficiencies identified during the year, and if so, what remediation actions have been taken?",
 "Describe the process for approving and reviewing account reconciliations, and who is responsible for each significant account.",
 ],
 },
 "551": {
 title: "General IT Controls (WP 551)",
 questions: [
 "Describe the controls over IT operations, including change management, incident management, and system availability.",
 "What procedures are in place to manage and approve changes to production applications and systems?",
 "Describe the controls over logical access to systems, including user provisioning, access reviews, and privileged access management.",
 "How is data integrity ensured during processing and transmission between systems?",
 "Describe the disaster recovery and business continuity plans for key IT systems.",
 ],
 },
 };

 const DEFAULT_SECTION: { title: string; questions: string[] } = {
 title: "General Questionnaire",
 questions: [
 "Please describe the relevant processes, controls, and procedures for this area.",
 "Are there any changes from the prior year that the audit team should be aware of?",
 "Who is responsible for this area, and how are activities reviewed and approved?",
 ],
 };

 let qNum = 1;
 const body = forms.map(form => {
 const section = SECTIONS[form] ?? { ...DEFAULT_SECTION, title: `Working Paper ${form}` };
 const qs = section.questions.map(q => `**${qNum++}.** ${q}${blank}`).join("\n");
 return `## ${section.title}\n\n${qs}\n---`;
 }).join("\n\n");

 return `# Consolidated Audit Questionnaire

**To:** ${clientName} (the "Company")

**Subject:** Audit Questionnaire — Forms ${formLabel}

**Engagement:** ${engagementId} | **Period:** ${yearEnd}

---

**Name of person completing questionnaire:** ______________________________

**Date completed:** ______________________________

---

Please provide complete and accurate responses to all questions below. These responses will assist in planning and executing the audit. Where a question is not applicable, please indicate "N/A" and briefly explain. **Please provide answers in bold or in alternate colour.**

---

${body}`;
 },
 },
 {
 id: "memo-510",
 label: "Memo",
 wpRef: "510",
 generate: ({ clientName, engagementId, yearEnd }) => `# Prepared by Client Memo

**MEMO**

---

**Company:** ${clientName}

**Engagement:** ${engagementId}

**Year end:** ${yearEnd}

---

The questions below are designed to help us understand your operations in preparation for the upcoming audit.

---

## Understanding the Company's Operations

**1.** What does the Company do and where does it operate?

________________________________________________________________________________

**2.** Please list the names of the Company's subsidiaries and the country in which they are located. *(Please email D&Co staff current corporate organizational chart.)*

________________________________________________________________________________

**3.** Please discuss the Company's ownership and governance. *(Consider public or private, major shareholders, structure of board of directors and audit committee, management and key decision makers.)*

________________________________________________________________________________

**4.** What are the Company's most significant risks and what steps, if any, does the Company take to mitigate these risks? *(Consider accounting, business, regulatory, political, economic, environment, commodity prices, foreign exchange, etc.)*

________________________________________________________________________________

**5.** What changes occurred within the Company since the beginning of the fiscal year? *(Consider significant transactions, new or amended agreements, disposals, write-offs, changes in management, etc.)*

________________________________________________________________________________

**6.** Does the Company rely on one or more vendors, customers, or suppliers?

________________________________________________________________________________

**7.** Who are the Company's key advisors and what is their contact information (lawyers, transfer agent, etc.)?

________________________________________________________________________________

**8.** Has the Company changed or adopted new accounting policies during the year?

________________________________________________________________________________

**9.** What are the significant estimates and judgments the Company performed during the year in preparation of the financial statements? *(Consider share-based payments, income taxes, impairment, accruals, going concern, etc.)*

________________________________________________________________________________

---

## Fraud Assessment

**10.** What controls are in place to prevent or detect fraud within the Company?

________________________________________________________________________________

**11.** What is the Company's assessment of its susceptibility to fraud?

________________________________________________________________________________

**12.** Has the Company, or any senior member of the Company, received any communications from a regulatory body? If so, please summarize the communications received.

________________________________________________________________________________

**13.** Is management aware of any alleged, suspected, or actual fraud within the Company?

________________________________________________________________________________

---

## Related Parties

For the purposes of the audit we consider related parties to include: directors and officers of the Company, close family members, companies controlled by directors/officers or close family members, significant shareholders, and other key decision makers.

**14.** Please list all persons who are related parties and their relationship to the Company:

| Name of Related Party | Relationship to Company | Nature of Transactions |
|---|---|---|
| | | |
| | | |
| | | |
| | | |
| | | |

**15.** Please list any directors/officers who were appointed or who resigned since the beginning of the year being audited.

________________________________________________________________________________

**16.** Discuss the controls that exist around approval of significant related party transactions.

________________________________________________________________________________

**17.** What controls/procedures are in place to ensure all transactions with related parties are accounted for in accordance with the applicable financial reporting framework?

________________________________________________________________________________

---

## Corporate Level — Internal Controls

**18.** How are transactions/purchases initiated?

________________________________________________________________________________

**19.** How are invoices authorized for payment, including who performs this function and what is their position?

________________________________________________________________________________

**20.** Who is authorized to sign cheques?

________________________________________________________________________________

**21.** Who makes the deposits for the Company?

________________________________________________________________________________

**22.** Please describe the Company's IT and accounting system/controls. *(Consider type of software used, use of passwords, backups, etc.)*

________________________________________________________________________________

**23.** Who is responsible for recording transactions in the accounting system and what is their position?

________________________________________________________________________________

**24.** Discuss the review of accounting entries including who performs this process and when it is completed.

________________________________________________________________________________

**25.** How does the Company ensure all transactions are entered into the accounting system?

________________________________________________________________________________

**26.** Discuss who has access to the Company's accounting system.

________________________________________________________________________________

**27.** Who is responsible for preparing the consolidation working paper of the entity?

________________________________________________________________________________

**28.** Discuss the process of preparing the consolidation working paper including personnel involved, what schedules are received from where, timing in relation to period end and controls over consolidation and consolidation entries.

________________________________________________________________________________

**29.** Who is responsible for preparing the financial statements for the Company?

________________________________________________________________________________

**30.** Discuss the review of financial statements including who performs this process and when it is completed.

________________________________________________________________________________

**31.** What role do the board of directors and audit committee have in financial reporting? *(Consider how often they meet, what transactions require their approval, and how interim and annual financial statements are approved.)*

________________________________________________________________________________

**32.** Discuss the Company's use of budgets.

________________________________________________________________________________

**33.** Are specific approvals required for expenditures over a certain amount? Please discuss. *(Consider the need for management or board approval.)*

________________________________________________________________________________

**34.** Who has authority to enter into contracts on behalf of the Company?

________________________________________________________________________________`,
 },
];
