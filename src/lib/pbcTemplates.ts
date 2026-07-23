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
 generate: ({ clientName, engagementId, yearEnd }) => `# IT Controls Questionnaire

**To:** ${clientName} (the "Company")

**Subject:** IT Controls Questionnaire

**Engagement:** ${engagementId} | **Period:** ${yearEnd}

---

**Name of person completing questionnaire:** ______________________________

**Date:** ______________________________

---

Please provide as much detail as possible in response to the following questions concerning IT controls and processes in place at the Company. Please include in your responses consideration of all IT controls and processes in place for the Company and all of its subsidiaries. Where appropriate, forward a copy of this questionnaire for completion to responsible persons with knowledge of the Company's subsidiaries IT systems.

**Please provide answers in bold or in alternate colour.**

---

## Section 1 — Software and Key Applications

**1.** Describe the software and key applications including spreadsheets (i.e., name) that the Company uses to prepare financial information and reports (e.g. QuickBooks, Sage, Navision etc.).

________________________________________________________________________________

**2.** Is the software considered to be an "off the shelf" program or more complex (if more complex, please describe customization, change management procedures, automated controls, third party access)?

________________________________________________________________________________

**3.** Do you utilize the online or desktop version of the software?

________________________________________________________________________________

**4.** Provide a description of spreadsheets used in the preparation of financial reporting.

________________________________________________________________________________

**5.** Did a system changeover occur during the year? Discuss if you have changed software or key applications during the year, including what you were using, what you changed to, who was responsible for overseeing the transition, the date of the transition, controls around the transition/conversion, whether systems were run in parallel or you used direct changeover, and the results of any post-implementation review conducted.

________________________________________________________________________________

---

## Section 2 — Third-Party Service Providers

**6.** Describe policies and procedures relating to the selection and use of third-party service providers such as IT consultants or service providers (organizations that you rely on for accounting and administration, for instance payroll service providers like ADP). Identify the providers and the services. Consider the terms of contract, monitoring of service levels, performance indicators, data security, and controls over processing integrity.

________________________________________________________________________________

---

## Section 3 — Access Controls

**7.** Describe the controls related to password protection and prevention of unauthorized access, and how this is monitored and enforced (consider operating environment, server access, accounting program and spreadsheet applications).

________________________________________________________________________________

**8.** Describe the oversight process that ensures that the access levels to key IT applications and spreadsheets are commensurate with the roles and responsibilities of the user.

________________________________________________________________________________

**9.** Describe the controls to authorize new users and modifications to existing user's access to servers, accounting program, spreadsheets.

________________________________________________________________________________

**10.** Describe the controls to remove user access upon termination or transfer. Are there any super users (users with privileged access and/or overall control)? If yes, please provide list of users and job title.

________________________________________________________________________________

---

## Section 4 — Physical Access and Data Backup

**11.** Describe controls over physical access to data and hardware including data back-up location and frequency of back-up. Describe the controls applicable to the access and integrity of data as well as the oversight process to review and monitor these controls.

________________________________________________________________________________

---

## Section 5 — Information Flow

**12.** Indicate how information flows through the entity's information system, including how:

**a.** Transactions are initiated, and how information about them is recorded, processed, corrected as necessary, incorporated in the general ledger and reported in the financial statements.

________________________________________________________________________________

**b.** Information about how events and conditions, other than transactions, is captured, processed and disclosed in the financial statements.

________________________________________________________________________________

**c.** Information about the human resources involved that may be relevant to understanding risks to the integrity of the information system, including: the competence of the individuals undertaking the work; whether there are adequate resources; and whether there is appropriate segregation of duties.

________________________________________________________________________________

---

## Section 6 — Cybersecurity

**13.** Describe the Company's policies, controls and oversight over cybersecurity. Has the Company experienced any cybersecurity incidents — if so please describe.

________________________________________________________________________________

---

## Section 7 — Communication

**14.** Describe how the Company communicates significant matters in connection with preparation of financial statements and the related reporting responsibilities: (i) between people within the entity, including how financial reporting roles and responsibilities are communicated; (ii) between management and those charged with governance; and (iii) with external parties, such as those with regulatory authorities.

________________________________________________________________________________

**15.** How does the Company's information system and communication appropriately support the preparation of the entity's financial statements in accordance with the applicable financial reporting framework?

________________________________________________________________________________

**16.** Is there anything else we should be aware of regarding the Company's IT systems?

________________________________________________________________________________`,
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
