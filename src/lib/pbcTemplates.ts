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
    label: "540 Memo — Control Assessment and Documentation",
    wpRef: "540",
    generate: ({ clientName, engagementId, yearEnd, wpNumbers }) => `# Control Assessment and Documentation — PBC Request
**Client:** ${clientName}  |  **Engagement:** ${engagementId}  |  **Period:** ${yearEnd}${wpNumbers.length ? `  |  **Working Papers:** ${wpNumbers.join(", ")}` : ""}

---

## Objective
Please provide documentation to support our control assessment over the financial reporting process for the period ended ${yearEnd}.

---

## Documents Required

| # | Document | Description | Due Date |
|---|----------|-------------|----------|
| 1 | Organization chart | Reporting lines for financial reporting controls | TBD |
| 2 | Policies & procedures | Written policies for key financial processes | TBD |
| 3 | Management review evidence | Signed approvals, review logs for the period | TBD |
| 4 | IT access control listing | Active users with financial system access | TBD |
| 5 | Month-end checklist | Completed month-end procedures for all periods | TBD |
| 6 | Account reconciliations | Completed reconciliations for the period | TBD |
| 7 | Journal entry approvals | JE approval policy and evidence of application | TBD |
| 8 | Segregation of duties matrix | Current duties assignment by employee | TBD |

---

## Control Areas

### Financial Close Process
- Month-end checklist with preparer/reviewer initials
- Evidence of management review and approval
- Adjusting journal entries log with approvals

### Account Reconciliations
- Reconciliation templates for all material accounts
- Evidence of timely preparation and independent review

### IT General Controls
- User access listing for financial systems
- Privileged access report
- Recent change management log

---

## Instructions

Please upload all documents to the client portal by the due date indicated above. Label each file clearly with the document number and description from the table above.

Contact us if you have any questions regarding the scope or format of the documents requested.`,
  },
  {
    id: "it-questionnaire",
    label: "IT Information Questionnaire (PBC)",
    wpRef: "IT",
    generate: ({ clientName, engagementId, yearEnd }) => `# IT Information Questionnaire — Prepared by Client
**Client:** ${clientName}  |  **Engagement:** ${engagementId}  |  **Period:** ${yearEnd}

Please complete the following questionnaire. Where applicable, attach supporting documentation.

---

## Section 1 — IT Environment Overview

1. How many financial systems does the organization use? ___________

2. List the primary accounting / ERP system(s) in use:
   ___________________________________________________________

3. Are financial systems hosted on-premise or in the cloud?
   ☐ On-premise   ☐ Cloud (SaaS)   ☐ Hybrid   ☐ Other: ___________

4. What operating systems are used on workstations and servers?
   ___________________________________________________________

---

## Section 2 — Access Controls

5. How many users currently have access to the financial system? ___________

6. Is multi-factor authentication (MFA) enabled?   ☐ Yes   ☐ No

7. How often are user access rights formally reviewed?
   ☐ Monthly   ☐ Quarterly   ☐ Annually   ☐ Other: ___________

8. Who is responsible for approving new user access requests?
   ___________________________________________________________

9. Is there a formal process for removing access when employees leave?   ☐ Yes   ☐ No
   If yes, describe: __________________________________________

---

## Section 3 — Change Management

10. Is there a formal change management process for system updates?   ☐ Yes   ☐ No

11. Who approves changes to the financial system before deployment?
    ___________________________________________________________

12. Are changes tested in a non-production environment before deployment?   ☐ Yes   ☐ No

13. Is there a change log maintained for all financial system updates?   ☐ Yes   ☐ No

---

## Section 4 — Backup & Recovery

14. How frequently are financial system backups performed?
    ☐ Daily   ☐ Weekly   ☐ Other: ___________

15. When was the last backup restoration test completed?
    Date: ___________

16. What is the recovery time objective (RTO) for the financial system?
    ___________________________________________________________

---

## Section 5 — IT Security Policy

17. Does the organization have a written IT security policy?   ☐ Yes   ☐ No

18. When was the IT security policy last reviewed and updated?
    Date: ___________

19. Has the organization experienced any cybersecurity incidents in the past year?   ☐ Yes   ☐ No
    If yes, please describe: ____________________________________

---

**Completed by:** ___________________________  **Date:** ___________

**Title:** ___________________________  **Signature:** ___________`,
  },
  {
    id: "memo-510",
    label: "510 — Prepared by Client Memo",
    wpRef: "510",
    generate: ({ clientName, engagementId, yearEnd, wpNumbers }) => `# Prepared by Client — Document Request Memo
**Client:** ${clientName}  |  **Engagement:** ${engagementId}  |  **Period:** ${yearEnd}${wpNumbers.length ? `  |  **Working Papers:** ${wpNumbers.join(", ")}` : ""}

---

## Purpose

This memo outlines the documents and information required from management to support the audit of the financial statements for the period ended **${yearEnd}**.

---

## Financial Records

| ☐ | Document | Notes |
|---|----------|-------|
| ☐ | General ledger (full trial balance export) | As at period end |
| ☐ | Bank statements — all accounts | Full period |
| ☐ | Accounts receivable aged listing | As at period end |
| ☐ | Accounts payable aged listing | As at period end |
| ☐ | Fixed asset continuity schedule | Including additions, disposals, depreciation |
| ☐ | Inventory listing / count sheets | As at period end (if applicable) |

---

## Supporting Schedules

| ☐ | Document | Notes |
|---|----------|-------|
| ☐ | Prepaid expenses schedule | With supporting invoices |
| ☐ | Accrued liabilities schedule | With calculation details |
| ☐ | Deferred revenue schedule | If applicable |
| ☐ | Loan / debt continuity schedule | With lender statements |
| ☐ | Shareholder equity continuity | Retained earnings reconciliation |

---

## Agreements & Contracts

| ☐ | Document | Notes |
|---|----------|-------|
| ☐ | New material contracts | Entered into during the period |
| ☐ | Lease agreements | New or modified during the period |
| ☐ | Board / management minutes | For the full period |
| ☐ | Shareholder agreements (if changed) | Current version |

---

## Representations Required

Management will be asked to provide a signed **Management Representation Letter** at the conclusion of the audit confirming the completeness and accuracy of all information provided.

---

## Submission Instructions

Please upload all documents to the **client portal** by **[DUE DATE]**.

- Label each file clearly with the document name
- Group documents by category where possible
- Contact your audit team if any document is unavailable or requires clarification

**Questions?** Contact your engagement manager at ${clientName}.`,
  },
];
