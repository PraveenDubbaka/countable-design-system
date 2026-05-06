import { Checklist, Section, Question } from '@/types/checklist';

// Client Acceptance and Continuance template data
export const generateClientAcceptanceContinuanceChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[]): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer: '', ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-cac-1',
      title: '1. Quality Management',
      questions: [
        q('cac-q1', '<p>Determine whether accepting this engagement would contravene any of the firm\'s quality management policies.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac-2',
      title: '2. Engagement Risk Factors',
      questions: [
        q('cac-q2a', '<p><strong>New Clients</strong> — Indicate who in the firm has knowledge about the prospective client and whether they recommend that this entity be accepted as a new client.</p>'),
        q('cac-q2b', '<p><strong>New Clients</strong> — Contact the predecessor practitioner to inquire about any reasons the engagement should not be accepted. If no response is received, explain what alternative procedures were performed.</p>'),
        q('cac-q2c', '<p><strong>All Clients</strong> — Make inquiries and perform web searches for any new or emerging engagement risks that would impact the decision to accept or continue with this engagement.</p>'),
        q('cac-q2d', '<p><strong>All Clients</strong> — Consider any risk factors identified from other sources.</p>'),
        q('cac-q2e', '<p><strong>All Clients</strong> — Based on preliminary understanding, is there any indication that the financial information will be misleading?</p>'),
        q('cac-q2f', '<p><strong>All Clients</strong> — Does management understand the limited nature of the engagement?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac-3',
      title: '3. Intended Use of FI',
      questions: [
        q('cac-q3', '<p>Inquire of management about:</p>', [
          q('cac-q3a', '<p>Intended use of the FI.</p>'),
          q('cac-q3b', '<p>Whether the FI is intended to be used by a third party.</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac-4',
      title: '4. Expected basis of accounting; Discuss the expected basis of accounting with management and obtain management\'s acknowledgement that it is appropriate in the circumstances.',
      note: 'Use of a general purpose framework is considered rare (such as ASPE). In such cases, consideration should be given to whether an audit or review engagement would be more appropriate.',
      questions: [
        q('cac-q4a', '<p>A written communication (e.g., paper or electronic).</p>'),
        q('cac-q4b', '<p>An oral communication documented in the working paper file.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac-5',
      title: '5. Third-Party Use of the FI',
      questions: [
        q('cac-q5', '<p>If the FI is intended to be used by a third party, inquire of management about:</p>', [
          q('cac-q5a', '<p>The ability of the third party to request and obtain additional information.</p>'),
          q('cac-q5b', '<p>Whether the third party agrees with the basis of accounting.</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac-6',
      title: '6. Engagement Quality Review',
      questions: [
        q('cac-q6', '<p>Are there any circumstances that would require this engagement to be subject to an engagement quality review?</p>'),
        q('cac-q6b', '<p>If so, has a reviewer been appointed?</p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-client-acceptance',
    title: 'Client Acceptance and Continuance',
    description: 'A comprehensive checklist for evaluating new client acceptance and continuing client relationships.',
    objective: `This checklist ensures proper evaluation of:
• Quality management policies
• Engagement risk factors
• Intended use of financial information
• Expected basis of accounting
• Third-party use considerations
• Engagement quality review`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Independence template data
export const generateIndependenceChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-independence',
      title: 'Independence Assessment',
      questions: [
        {
          id: 'ind-q1',
          text: '<p><strong>Are there any significant "threats" to independence that should be disclosed?</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: true,
          answer: '',
          subQuestions: [
            { id: 'ind-q1a', text: '<p>Self-interest.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q1b', text: '<p>Self-review.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q1c', text: '<p>Advocacy.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q1d', text: '<p>Familiarity.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q1e', text: '<p>Intimidation.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'ind-q2',
          text: '<p><strong>Do any of the following conditions apply to the firm or any staff member who will be performing the engagement? (One yes or no) and then comment section to add details. Also capability to add document references as needed.</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: true,
          answer: '',
          subQuestions: [
            { id: 'ind-q2a', text: '<p>Having a financial interest in a client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q2b', text: '<p>Loans and guarantees to/from client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q2c', text: '<p>Close business relationships with client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q2d', text: '<p>Family and personal relationships with client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q2e', text: '<p>Recent employment with client serving as officer, director or company secretary of client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q2f', text: '<p>Acceptance of significant gifts or hospitality from client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q2g', text: '<p>Fee quote that is considerably less than the previous accountant (charitable work excluded).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'ind-q2h', text: '<p>Other: Making key decisions on behalf of a client, significant journal entries or adjustments without client approval.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'ind-q3',
          text: '<p><strong>Have we identified any impairment of independence under the Code of Professional Conduct / Code of Ethics? (If yes, it should be disclosed in the compilation engagement report.)</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: true,
          answer: ''
        },
        {
          id: 'ind-q4',
          text: '<p><strong>Where a prohibition exists or where safeguards will not reduce a threat to an acceptable level, have we disclosed the activity, interest or relationship that impairs our independence?</strong></p><p>(Note: The nature and extent of lack of independence are required disclosures in the compilation engagement report.)</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: true,
          answer: ''
        }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-independence',
    title: 'Independence',
    description: 'Evaluate independence requirements and identify potential threats.',
    objective: `Evaluate threats and impairments.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Knowledge of Client Business template data
export const generateKnowledgeOfClientBusinessChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-general-info',
      title: 'General Information',
      questions: [
        { id: 'kcb-q1', text: '<p><strong>Type of entity</strong></p>', answerType: 'long-answer', options: [], required: true, answer: '' },
        { id: 'kcb-q2', text: '<p><strong>Jurisdiction of incorporation (statue, date)</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-q3', text: '<p><strong>Corporate structure (ownership, investments, including any related group(s))</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-q4', text: '<p><strong>Governance And Key Management</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-q5', text: '<p><strong>Key advisors to the entity (e.g., lawyer and bank)</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'kcb-q6',
          text: '<p><strong>Users of the FI (including any third-party users)</strong></p>',
          answerType: 'multiple-choice',
          options: ['Management', 'Shareholders', 'Lenders', 'TCWG', 'Investors', 'For the bank/lender', 'Other (describe)'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-business-operations',
      title: 'Business And Operations',
      questions: [
        { id: 'kcb-bo-q1', text: '<p><strong>The industry and the nature of the entity\'s operations.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-bo-q2', text: '<p><strong>The entity\'s products and/or services.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-bo-q3', text: '<p><strong>The size of the entity (e.g., revenue, assets or number of employees).</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-bo-q4', text: '<p><strong>Key business arrangements</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-bo-q5', text: '<p><strong>Significant changes from a prior period.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-accounting-practices',
      title: 'Accounting System and Records',
      questions: [
        { id: 'kcb-ap-q1', text: '<p><strong>Who inputs data and prepares the accounting records?</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'kcb-ap-q2',
          text: '<p><strong>Primary accounting software used:</strong></p>',
          answerType: 'multiple-choice',
          options: ['Sage 50', 'QuickBooks Online', 'QuickBooks', 'Other (explain in additional explanation area)'],
          required: false,
          answer: ''
        },
        { id: 'kcb-ap-q3', text: '<p><strong>Describe how the entity processes transactions for the major transaction cycles:</strong></p><p>Cash/Bank;<br/>Sales/Accounts receivable;<br/>How transactions are recorded, used for bank reconciliations;<br/>Any systems/software used in addition to the primary accounting software.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-ap-q4', text: '<p><strong>Financial reporting (e.g., how the financial information is compiled and summarized, any estimates, etc.)</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-ap-q5', text: '<p><strong>Revenue: includes any complex (e.g., source of revenue and nature of receivable)</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-ap-q6', text: '<p><strong>Purchases, payments, payables (e.g., major suppliers and transactions)</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-ap-q7', text: '<p><strong>Payroll (e.g., number of employees, how prepared and signature and approved)</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-ap-q8', text: '<p><strong>Other transactions (e.g., investments, inventory, and property, plant and equipment)</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-ap-q9', text: '<p><strong>Describe the period-end adjustments expected to be made to the FI on behalf of the entity.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'kcb-ap-q10', text: '<p><strong>Describe any matters that require adjustments in prior periods.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-financial-reporting',
      title: 'Basis of Accounting',
      questions: [
        { id: 'kcb-fr-q1', text: '<p><strong>Describe management\'s final basis of accounting and, where applicable, accounting policies used to recognize and measure specific items in the FI.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-areas-of-concern',
      title: 'Areas of Complexity Identified',
      questions: [
        { id: 'kcb-ac-q1', text: '<p><strong>Describe significant or complex factors within the FI identified from understanding the entity (e.g., transactions outside normal course of business, foreign currency transactions, unusual related-party transactions and complex tax matters).</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-knowledge-client-business',
    title: 'Knowledge of the Business',
    description: 'Document understanding of the client\'s business.',
    objective: `Capture essential knowledge.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Planning template data
export const generatePlanningChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-planning',
      title: 'Planning Assessment',
      questions: [
        {
          id: 'plan-q1',
          text: '<p><strong>Minimum threshold amount which does not require any further investigation or reconciliation by the firm</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'plan-q2',
          text: '<p><strong>Document any discussions between client throughout the year regarding their business, major operations or any other information that may be relevant to this engagement.</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'plan-q3',
          text: '<p><strong>Any additional comments or thoughts for planning (To provide space for team to write comments)</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-planning',
    title: 'Planning',
    description: 'Plan the engagement procedures.',
    objective: `Define planning strategy.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Engagement Letter — rendered by LetterView, single HTML blob
export const generateEngagementLetterChecklist = (): Checklist => {
  const html = `
    <p class="text-sm text-foreground">${formatTodayLong()}</p>
    <p class="mt-6 text-sm text-foreground">Entity Name<br/>Complete address</p>
    <p class="mt-6 text-sm text-foreground">Dear First Name,</p>
    <p class="mt-4 text-sm text-foreground">
      You have requested that we compile the financial information of <strong>Entity Name</strong> for the
      <strong>Period Ended</strong>. We are pleased to confirm our acceptance and understanding of this
      compilation engagement by means of this letter.
    </p>
    <p class="mt-4 text-sm text-foreground">
      The objective of our engagement is to assist management in the preparation and presentation of compiled
      financial information based on information provided by management.
    </p>
    <p class="mt-4 text-sm text-foreground">
      The compiled financial information is intended to be used by <strong>Intended Users</strong> for
      <strong>Intended Purpose</strong>. The compiled financial information may not be suitable for another purpose.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We will perform the compilation engagement in accordance with <strong>Canadian Standard on Related
      Services (CSRS) 4200, Compilation Engagements</strong>. A compilation engagement is substantially less
      in scope than an audit or review engagement and we will not provide any form of assurance on the
      compiled financial information.
    </p>
    <p class="mt-4 text-sm text-foreground">
      If the contents of this letter are in accordance with your understanding of the terms of the engagement,
      please sign the attached copy of this letter and return it to us.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,<br/>ON BEHALF OF Firm Name</p>
  `;

  return {
    id: 'global-template-engagement-letter',
    title: 'Engagement Letter',
    description: 'Compilation engagement letter outlining terms, responsibilities, and acceptance.',
    objective: 'Establish the terms of the engagement.',
    sections: [
      {
        id: 'section-el-letter',
        title: 'Engagement Letter',
        isExpanded: true,
        questions: [
          {
            id: 'el-letter-body',
            text: html,
            answerType: 'none',
            options: [],
            required: false,
            answer: '',
          } as Question,
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

function formatTodayLong(): string {
  const d = new Date();
  return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
}

// Management Responsibility and Acknowledgement template data
export const generateManagementResponsibilityChecklist = (): Checklist => {
  const html = `
    <p class="text-sm text-foreground">${formatTodayLong()}</p>
    <p class="mt-6 text-sm text-foreground">Entity Name<br/>Complete address</p>
    <p class="mt-6 text-sm text-foreground">Dear First Name,</p>
    <p class="mt-4 text-sm text-foreground">
      Further to the engagement letter dated
      <span class="letter-placeholder" data-field="engagement-letter-date">Engagement Letter Date</span>,
      management acknowledges that it is responsible for:
    </p>
    <p class="mt-3 text-sm text-foreground">a. The compiled financial information;</p>
    <p class="mt-3 text-sm text-foreground">
      b. Selecting the basis of accounting to be applied in the preparation of the compiled financial
      information that is appropriate for the intended use;
    </p>
    <p class="mt-3 text-sm text-foreground">
      c. The accuracy and completeness of the information provided to Firm Name; and
    </p>
    <p class="mt-3 text-sm text-foreground">
      d. Attaching the compilation engagement report when distributing or reproducing the compiled
      financial information.
    </p>
    <p class="mt-4 text-sm text-foreground">
      If there are any questions about the contents of this letter, please raise them with the Engagement
      Partner. Please sign and return the attached copy of this letter to indicate management's
      acknowledgement of, and agreement with, its responsibilities for the compilation engagement.
    </p>
    <p class="mt-4 text-sm text-foreground">
      Firm Name appreciates the opportunity of continuing to be of service to Entity Name.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,<br/>ON BEHALF OF Firm Name</p>
  `;

  return {
    id: 'global-template-management-responsibility',
    title: 'Management responsibility and acknowledgement',
    description: 'Management acknowledgement of responsibilities for the compilation engagement.',
    objective: 'Document management acknowledgement.',
    sections: [
      {
        id: 'section-mr-letter',
        title: 'Management responsibility and acknowledgement',
        isExpanded: true,
        questions: [
          {
            id: 'mr-letter-body',
            text: html,
            answerType: 'none',
            options: [],
            required: false,
            answer: '',
          } as Question,
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Withdrawal template data
export const generateWithdrawalChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-withdrawal',
      title: 'Withdrawal Assessment',
      questions: [
        {
          id: 'wd-q1',
          text: '<p><strong>Identify which of the following situations is the reason for your withdrawal; and document the reasoning, actions taken and discussions with management</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'wd-q1-i',
              text: '<p>Management has not provided the records, documents, explanations or other information needed to prepare the FI.</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'wd-q1-ii',
              text: '<p>A correction is necessary, and management has not provided the additional or corrected information necessary to ensure the FI does not appear misleading.</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'wd-q1-iii',
              text: '<p>New Information has become known after engagement acceptance that, if known at the date of the compilation engagement report, would have been cause for the engagement not to have been accepted or continued. For example:</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: '',
              subQuestions: [
                {
                  id: 'wd-q1-iii-a',
                  text: '<p>Inappropriate use by management of the firm name.</p>',
                  answerType: 'yes-no-na',
                  options: ['Yes', 'No', 'NA'],
                  required: false,
                  answer: ''
                },
                {
                  id: 'wd-q1-iii-b',
                  text: '<p>Significant misrepresentations made by management to:</p><ul><li>Our partners or staff</li><li>Third parties about the work performed by our firm</li></ul>',
                  answerType: 'yes-no-na',
                  options: ['Yes', 'No', 'NA'],
                  required: false,
                  answer: ''
                },
                {
                  id: 'wd-q1-iii-c',
                  text: '<p>Disagreements over billing.</p>',
                  answerType: 'yes-no-na',
                  options: ['Yes', 'No', 'NA'],
                  required: false,
                  answer: ''
                }
              ]
            }
          ]
        }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-withdrawal',
    title: 'Withdrawal',
    description: 'Document withdrawal reasoning and actions taken.',
    objective: `Identify withdrawal situations and document reasoning.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Completion template data
export const generateCompletionChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-completion',
      title: 'Completion Assessment',
      questions: [
        {
          id: 'comp-q1',
          text: '<p><strong>Change in intended use</strong> – Has there been a change in the intended use of the FI? If so, discuss with management whether the intended basis of accounting applied is appropriate.</p><p><em>Note: Consider obtaining a revised engagement letter. (See Form Client acceptance and continuance.)</em></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'comp-q2',
          text: '<p><strong>Prepare the FI</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q2-a',
              text: '<p>Has the FI been prepared in accordance with the acknowledged basis of accounting documented on Form Knowledge of client business?</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'comp-q2-b',
              text: '<p>Does the FI disclose the basis of accounting used, and where applicable, accounting policies used to recognize and measure specific items?</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q3',
          text: '<p><strong>Significant judgments made</strong>, where assistance was provided to management in making significant judgments, have those judgments been discussed with management (and documented) to ensure they</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q3-a',
              text: '<p>Understand the impact of the judgments on the FI?</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'comp-q3-b',
              text: '<p>Accept responsibility for the FI?</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            }
          ],
          explanation: '',
          note: 'Consider:\n• Determination of the basis of accounting.\n• Selection/application of accounting policies.\n• Estimates required (e.g., allowances for doubtful accounts, inventory obsolescence, accounts payable and accruals).'
        },
        {
          id: 'comp-q4',
          text: '<p><strong>When completed:</strong></p><p>Determine whether any matters exist that would cause the FI to appear misleading.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q4-a',
              text: '<p>Read the FI, taking into consideration knowledge of the entity and the basis of accounting applied.</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'comp-q4-b',
              text: '<p>Determine whether any matters exist that would cause the FI to appear misleading.</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q5',
          text: '<p><strong>When matters exist that cause the FI to appear misleading:</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q5-a',
              text: '<p>Document such matter(s).</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'comp-q5-b',
              text: '<p>Discuss with management and request additional or corrected information.</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'comp-q5-c',
              text: '<p>Indicate and document how each matter was resolved.</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q6',
          text: '<p><strong>Reconciliation to accounting records</strong> – Have the accounting records been reconciled to the final FI, including any adjusting journal entries or other amendments that the practitioner has agreed with management?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'comp-q7',
          text: '<p><strong>Acknowledgement of responsibility</strong> – Has acknowledgement been obtained from management or those charged with governance, as appropriate, that they have taken responsibility for the final version of the FI, including the basis of accounting?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q7-a',
              text: '<p>A signature on the final version of the FI.</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'comp-q7-b',
              text: '<p>A written communication (paper or electronic form).</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'comp-q7-c',
              text: '<p>An oral acknowledgement documented in the working paper file.</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q8',
          text: '<p><strong>Compilation engagement report</strong></p><p>Has the compilation engagement report been:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q8-a',
              text: '<p>Appropriately worded, including any disclosure of impairment of independence (in accordance with the provincial Code of Professional Conduct / Code of Ethics)?</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'comp-q8-b',
              text: '<p>Dated when the compilation has been completed in compliance with CSRS 4200?</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            },
            {
              id: 'comp-q8-c',
              text: '<p>Included as documentation in the working papers?</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'NA'],
              required: false,
              answer: ''
            }
          ]
        }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-completion',
    title: 'Completion',
    description: 'Completion procedures for the compilation engagement.',
    objective: 'Document completion steps including FI preparation, reconciliation, acknowledgement, and engagement report.',
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// New Engagement Acceptance template data (Review folder)
export const generateNewEngagementAcceptanceChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-nea-objective',
      title: 'Quality assurance manual',
      questions: [
        {
          id: 'nea-obj-1',
          text: '<p>Determine whether accepting this engagement would contravene any of the firm\'s quality management policies. Also consider related services provided, such as those addressed by CSRS 4460 (Reports on Supplementary Matters Arising from an Audit or Review Engagement) and other advisory and tax planning services.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-risk-factors',
      title: 'Engagement Risk Factors',
      questions: [
        {
          id: 'nea-rf-a',
          text: '<p>a. Indicate who in the firm has knowledge about, or contacts with, the prospective client and whether they recommend that this entity be accepted as a new client.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'nea-rf-b',
          text: '<p>b. Contact the predecessor practitioner to inquire about any reasons the engagement should not be accepted. If no response is received, explain what alternative procedures were performed.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'nea-rf-c',
          text: '<p>c. Request a review of the predecessor\'s working papers. If not permitted, explain why and consider the potential engagement risk factors. If permitted, perform a review and describe any risk factors identified.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'nea-rf-d',
          text: '<p>d. Indicate what other procedures were performed (including results and conclusions) to identify engagement risk factors that would cause us to decline the engagement. Consider procedures such as:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'nea-rf-d-i', text: '<p>I. Inquiries of management/TCWG about:</p>', answerType: 'long-answer', options: [], required: false, answer: '',
              subQuestions: [
                { id: 'nea-rf-d-i-a', text: '<p>A. The reason for the change in accountants.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
                { id: 'nea-rf-d-i-b', text: '<p>B. Whether another accounting firm(s) has recently declined the engagement. If so, why?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
                { id: 'nea-rf-d-i-c', text: '<p>C. Other engagement risk factors (see Appendix A).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
              ]
            },
            { id: 'nea-rf-d-iii', text: '<p>III. Review of relevant communications between the previous accountants and management/TCWG.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'nea-rf-d-iv', text: '<p>IV. Obtaining permission from the prospective client to perform a credit check and to make inquiries with bankers, other advisors, regulators, etc.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'nea-rf-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-integrity',
      title: 'Management\'s Integrity',
      questions: [
        {
          id: 'nea-int-1',
          text: '<p>Based on previous contact (if any) with key entity personnel and the results of procedures performed in Step 2 above, determine whether any concern has been identified that might cause us to doubt or distrust the management representations/assertions that we will be requesting and relying upon if the engagement is accepted. Consider:</p><ul><li>Observed disregard for telling the truth;</li><li>Criminal convictions and regulatory sanctions;</li><li>History or suspicions of unethical actions, illegal acts or management override controls;</li><li>Negative publicity;</li><li>Close association with people/companies with reputations for questionable ethics.</li></ul>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'nea-int-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-data',
      title: 'Unavailable or Unreliable Data',
      questions: [
        {
          id: 'nea-data-1',
          text: '<p>Based on preliminary understanding, is there any indication that the information needed to perform the engagement will be unavailable or unreliable?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'nea-data-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-opening',
      title: 'Opening balances',
      questions: [
        {
          id: 'nea-ob-1',
          text: '<p>A. Identify whether the opening balances have been reviewed.</p><p>B. Make inquiries and reach a conclusion on whether there is sufficient evidence available on opening balances to identify:</p><ul><li>Misstatements that could materially affect the current period\'s financial statements, and</li><li>Inconsistent application of accounting policies (reflected in the opening balances) in the current period\'s financial statements.</li></ul>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'nea-ob-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-competencies',
      title: 'Firm competencies',
      questions: [
        {
          id: 'nea-fc-1',
          text: '<p>Assess whether the firm has the necessary skills/resources to perform the engagement on a timely basis. Address the following:</p><ul><li>a. The availability of staff/resources with the appropriate level of experience, relevant industry/subject matter knowledge, and any required regulatory and reporting experience.</li><li>b. The availability of specialists (where required).</li></ul>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'nea-fc-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-independence-prohibition',
      title: 'Independence prohibition',
      questions: [
        {
          id: 'nea-ip-1',
          text: '<p>Identify and describe any potential independence prohibitions that could occur and provide reasons why they do or do not preclude the firm or particular staff members from performing the engagement. Address each of the prohibitions listed below:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'nea-ip-1-svc', text: '<p><strong>Services performed</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '',
              subQuestions: [
                { id: 'nea-ip-1a', text: '<p>a. Recording journal entries or changing account classifications without first obtaining management\'s approval.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
                { id: 'nea-ip-1b', text: '<p>b. Providing tax planning or other tax advisory services that may have a material impact on the financial statements.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
                { id: 'nea-ip-1c', text: '<p>c. Providing legal services that involve dispute resolution.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
                { id: 'nea-ip-1d', text: '<p>d. Preparing source documents for the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
                { id: 'nea-ip-1e', text: '<p>e. Performing management functions for the client (such as decision making on transactions).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
                { id: 'nea-ip-1f', text: '<p>f. Serving as an officer or director of the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
                { id: 'nea-ip-1g', text: '<p>g. Temporary loaning of staff (except in certain situations).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
              ]
            },
            { id: 'nea-ip-1-rel', text: '<p><strong>Relationships</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '',
              subQuestions: [
                { id: 'nea-ip-1h', text: '<p>a. Close business relationships with the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
                { id: 'nea-ip-1i', text: '<p>b. Family and personal relationships with the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
                { id: 'nea-ip-1j', text: '<p>c. Firm personnel that have accepted a position or have had recent employment with the client as an officer, director or company secretary.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
              ]
            },
            { id: 'nea-ip-1-fin', text: '<p><strong>Financial interests</strong></p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'nea-ip-note', text: '<p>Refer to the provincial Code of Professional Conduct / Code of Ethics for guidance, interpretations and additional independence prohibitions for listed entities.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'nea-ip-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-independence-threats',
      title: '8. Independence threats',
      questions: [
        {
          id: 'nea-it-1',
          text: '<p>Identify and describe any significant threats to independence and the safeguards (if any) to reduce each threat to an acceptable level. Address each of the following threats in relation to the firm and any member of the engagement team:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'nea-it-1a', text: '<p>a. Self-interest (i.e., where the firm is economically dependent on the client fees or where judgments may be influenced by the desire to retain the client).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'nea-it-1b', text: '<p>b. Self-review (i.e., assisting the client in preparing the financial statements, providing bookkeeping services and making judgments for the client that will later need to be evaluated in reaching conclusions).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'nea-it-1c', text: '<p>c. Advocacy (i.e., acting as a client advocate in matters involving taxes, litigation or share promotion, which could result in being too sympathetic to the client\'s interests).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'nea-it-1d', text: '<p>d. Intimidation (i.e., where the client makes threats, such as to replace our firm unless we agree to certain scope limitations or to accept management positions without question, on accounting matters).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'nea-it-note', text: '<p>Refer to the provincial Code of Professional Conduct / Code of Ethics for guidance and interpretations.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'nea-it-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-purpose',
      title: 'Purpose of the review engagement',
      questions: [
        {
          id: 'nea-pur-1',
          text: '<p>What is the entity\'s intention for having a review engagement? Ensure:</p><ul><li>A. There is a rational purpose for the engagement.</li><li>B. A review engagement would be appropriate in the circumstances.</li><li>C. Consider:</li></ul>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'nea-pur-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-preconditions',
      title: '10. Engagement preconditions',
      questions: [
        {
          id: 'nea-pre-a',
          text: '<p>a. Determine whether the financial reporting framework to be applied in the preparation of the financial statements is appropriate.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'nea-pre-b',
          text: '<p>b. Ensure that management has acknowledged its understanding and responsibility for:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'nea-pre-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-appendix-a',
      title: 'Appendix A - Entity operations',
      questions: [
        { id: 'nea-aa-1', text: '<p>Doubts in place about the entity\'s ability to continue as a going concern.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-2', text: '<p>Poor sales outlook or intense competition.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-3', text: '<p>Entity has high debt levels and/or poor cash flow.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-4', text: '<p>Bank covenant or other contractual violations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-5', text: '<p>Non-compliance with industry laws/regulations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-6', text: '<p>Potential litigation.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-7', text: '<p>Questionable management/TCWG ethics.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-8', text: '<p>High media interest in the entity and management.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-9', text: '<p>Entity engages in high-risk activities.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-10', text: '<p>Entity operates in or does business with unstable governments/countries.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-11', text: '<p>Entity participates in high-risk business ventures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-aa-12', text: '<p>Unusual transactions not in the ordinary course of business.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-appendix-a-engagement',
      title: 'Appendix A - The engagement',
      questions: [
        { id: 'nea-ae-1', text: '<p>Poor cooperation from management, such as misleading representations and delays in obtaining the necessary evidence.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-2', text: '<p>Firm has limited experience in the entity\'s industry.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-3', text: '<p>Reporting timeframes are unrealistic based on time available or firm resources.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-4', text: '<p>Poor control environment, leadership and staff morale.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-5', text: '<p>Incompetence of senior accounting personnel.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-6', text: '<p>Entity unable or unwilling to pay a fair fee.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-7', text: '<p>Poor/inadequate/missing accounting systems and records.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-8', text: '<p>Complex IT environments.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-9', text: '<p>Lack of paper trail for certain transactions/events.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-10', text: '<p>Experts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-11', text: '<p>Estimates involve a high degree of estimation uncertainty.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-12', text: '<p>Extensive related-party transactions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-13', text: '<p>Entity chooses aggressive/controversial accounting policies.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-14', text: '<p>Significant adjustments are required.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'nea-ae-15', text: '<p>Unusual transactions or overly complex corporate/operational structures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-conclusion',
      title: 'Conclusion',
      questions: [
        {
          id: 'nea-conc-1',
          text: '<p><strong>Based on the information and risk factors identified above, this engagement is assessed as follows:</strong></p>',
          answerType: 'multiple-choice',
          options: ['High Risk', 'Low Risk', 'Moderate Risk', 'Not Accepted'],
          required: false,
          answer: ''
        },
        { id: 'nea-conc-1-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'nea-conc-2',
          text: '<p><strong>Is an EQR required on this engagement (select one)?</strong></p><p>This decision should be based on the engagement risk identified above and the firm\'s criteria for when an EQR is required.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'nea-conc-2-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-new-engagement-acceptance',
    title: 'New engagement acceptance',
    description: 'Document the considerations and conclusions reached in deciding whether to accept a new review engagement.',
    objective: `This form covers:
• Quality assurance manual
• Engagement Risk Factors
• Management's Integrity
• Unavailable or Unreliable Data
• Opening balances
• Firm competencies
• Independence prohibition
• Independence threats
• Purpose of the review engagement
• Engagement preconditions
• Appendix A – Entity operations
• Appendix A – The engagement
• Conclusion`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Existing Engagement Continuance template data (Review folder)
export const generateExistingEngagementContinuanceChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-eec-qam',
      title: 'Quality assurance manual',
      questions: [
        {
          id: 'eec-qam-1',
          text: '<p>Determine whether accepting this engagement would contravene any of the firm\'s quality assurance policies. Also consider related services provided, such as addressed by CSRS 4460 (Reports on Supplementary Matters Arising from an Audit or Review Engagement) and other advisory and tax planning services.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-risk',
      title: 'Engagement risk factors',
      questions: [
        {
          id: 'eec-rf-a',
          text: '<p>a. Make inquiries and perform web searches for any new or emerging engagement risks that would impact the decision to continue with this engagement. See Appendix A for a list of possible engagement risk factors.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'eec-rf-b',
          text: '<p>b. Consider any risk factors identified from other assignments performed for the entity.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-integrity',
      title: 'Management\'s integrity',
      questions: [
        {
          id: 'eec-int-1',
          text: '<p>Based on previous contact (if any) with key entity personnel and the results of procedures performed in Step 2 above, determine whether any concern has been identified that might cause us to doubt or distrust the management representations/assertions that we will be requesting and relying upon if the engagement is accepted. Consider:</p><ul><li>Observed disregard for telling the truth;</li><li>Criminal convictions and regulatory sanctions;</li><li>Negative publicity; and</li><li>Ethics.</li></ul>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-data',
      title: 'Unavailable or unreliable data',
      questions: [
        {
          id: 'eec-data-1',
          text: '<p>Based on preliminary understanding, is there any indication that the information needed to perform the engagement will be unavailable or unreliable?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-competencies',
      title: 'Firm competencies',
      questions: [
        {
          id: 'eec-fc-1',
          text: '<p>Assess whether the firm has the necessary skills/resources to perform the engagement on a timely basis. Address the following:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'eec-fc-1a', text: '<p>a. The availability of staff/resources with appropriate level of experience, relevant industry/subject matter knowledge, and any required regulatory and reporting experience.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-fc-1b', text: '<p>b. The need for external experts and component practitioners.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-fc-1c', text: '<p>c. The need for an EQR (where required).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-independence-prohibitions',
      title: 'Independence prohibitions',
      questions: [
        {
          id: 'eec-ip-1',
          text: '<p>Identify and describe any potential independence prohibitions that could occur and provide reasons why they do or do not preclude the firm or particular staff members from performing the engagement. Address each of the prohibitions listed below:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'eec-ip-1a', text: '<p>Obtaining management\'s approval.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-ip-1b', text: '<p>Providing tax planning or other tax advisory services that may have a material impact on the financial statements.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-ip-1c', text: '<p>Providing other non-assurance services, such as IT services, corporate finance or legal services that involve dispute resolution.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-ip-1d', text: '<p>Preparing source documents for the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-ip-1e', text: '<p>Performing management functions for the client (such as decision making).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-ip-1f', text: '<p>Serving as an officer or director of the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-ip-1g', text: '<p>Temporary loaning of staff (except in certain situations).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'eec-ip-rel',
          text: '<p><strong>Relationships</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'eec-ip-rel-a', text: '<p>Close business relationships with the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-ip-rel-b', text: '<p>Family and personal relationships with the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-ip-rel-c', text: '<p>Firm personnel that have accepted a position or have had recent employment with the client as an officer, director or company secretary.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'eec-ip-fin',
          text: '<p><strong>Financial interests</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'eec-ip-fin-a', text: '<p>Performing the engagement for a fee quote that is considerably less than market price.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-ip-fin-b', text: '<p>Holding financial interests in entity.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-ip-fin-c', text: '<p>Accepting gifts or hospitality from client (if not clearly insignificant).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-independence-threats',
      title: 'Independence threats',
      questions: [
        {
          id: 'eec-it-1',
          text: '<p>Identify and describe any significant threats to independence and the safeguards (if any) to reduce each threat to an acceptable level. Address each of the following threats in relation to the firm and any member of the engagement team:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'eec-it-1a', text: '<p>Client fees or where judgments may be influenced by the desire to retain the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-it-1b', text: '<p>Self-review (i.e., assisting the client in preparing the financial statements, providing bookkeeping services and making judgments for the client that will later need to be evaluated in reaching conclusions).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-it-1c', text: '<p>Advocacy (i.e., acting as a client advocate in matters involving tax, litigation or share promotion).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-it-1d', text: '<p>Familiarity (i.e., close, family or long-time relationships with the client that could result in being too sympathetic to the client\'s interests).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'eec-it-1e', text: '<p>Intimidation (i.e., where the client makes threats, such as to replace our firm unless we agree to certain scope limitations or to accept management positions, without question, on accounting matters).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-purpose',
      title: 'Purpose of the review engagement',
      questions: [
        {
          id: 'eec-pur-1',
          text: '<p>Has the entity\'s purpose for having a review engagement changed from the prior period? Ensure:</p><ul><li>a. There is a rational purpose for the engagement.</li><li>b. A review engagement would be appropriate in the circumstances.</li></ul><p>Consider:</p><ul><li>Any significant scope limitations expected.</li><li>Any intent to inappropriately associate the firm\'s name with the financial statements.</li><li>Any laws or regulations that require an audit rather than a review.</li></ul>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-preconditions',
      title: 'Engagement preconditions',
      questions: [
        {
          id: 'eec-pre-1',
          text: '<p>Determine whether the financial reporting framework to be applied in the preparation of the financial statements is appropriate.</p><p>Ensure that management has acknowledged its understanding and responsibility for:</p><ul><li>The preparation of financial statements in accordance with the applicable financial reporting framework.</li><li>Such internal controls as management determines necessary to enable the preparation of financial statements that are free from material misstatement (whether due to fraud or error).</li><li>Providing the practitioners with access to all information.</li></ul>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-partner',
      title: 'Partner/practitioner assessment',
      questions: [
        {
          id: 'eec-pa-1',
          text: '<p>I have read the responses to the questions above and declare that I am not aware of any other independence prohibitions, unmitigated independence threats, breaches of other ethical requirements or risk factors that would prevent the firm or any member of the engagement team from performing this assignment.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'eec-pa-comments', text: '<p>Comments:</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-appendix-a-entity',
      title: 'Appendix A - Entity operations',
      questions: [
        { id: 'eec-aa-1', text: '<p>Doubts in place about entity\'s ability to continue as a going concern.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-2', text: '<p>Poor sales outlook or intense competition.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-3', text: '<p>Entity has high debt levels and/or poor cash flow.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-4', text: '<p>Bank covenant or other contractual violations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-5', text: '<p>Non-compliance with industry laws/regulations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-6', text: '<p>Potential litigation.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-7', text: '<p>Questionable management/TCWG ethics.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-8', text: '<p>High media interest in the entity and management.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-9', text: '<p>Entity engages in high-risk activities.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-10', text: '<p>Entity operates in or does business with unstable governments/countries.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-11', text: '<p>Entity operates in multiple locations or conducts operations overseas.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-12', text: '<p>Entity participates in high-risk business ventures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-aa-13', text: '<p>Unusual transactions not in the ordinary course of business.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-appendix-a-engagement',
      title: 'Appendix A - The engagement',
      questions: [
        { id: 'eec-ae-1', text: '<p>Poor cooperation from management, such as misleading representations and delays in obtaining the necessary evidence.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-2', text: '<p>Firm has limited experience in the entity\'s industry.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-3', text: '<p>Reporting timeframes are unrealistic based on time available or firm resources.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-4', text: '<p>Poor control environment, leadership and staff morale.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-5', text: '<p>Incompetence of senior accounting personnel.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-6', text: '<p>Poor/inadequate/missing accounting systems and records.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-7', text: '<p>Complex IT environments.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-8', text: '<p>Lack of paper trail for certain transactions/events.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-9', text: '<p>Experts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-10', text: '<p>Estimates involve a high degree of estimation uncertainty.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-11', text: '<p>Entity chooses aggressive/controversial accounting policies.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'eec-ae-12', text: '<p>Unusual transactions or overly complex corporate/operational structures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-conclusion',
      title: 'Conclusion',
      questions: [
        {
          id: 'eec-conc-1',
          text: '<p><strong>Based on the information identified and documented above, the engagement risk to the firm is assessed as follows (check one):</strong></p>',
          answerType: 'multiple-choice',
          options: ['High Risk', 'Low Risk', 'Moderate Risk', 'Not Accepted'],
          required: false,
          answer: ''
        },
        { id: 'eec-conc-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'eec-conc-eqcr',
          text: '<p><strong>Is an EQCR required on this engagement (Select one)?</strong></p><p>This decision should be based on the engagement risk identified above and the firm\'s criteria for when an EQCR is required.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'eec-conc-basis', text: '<p>Basis for decision:</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-existing-engagement-continuance',
    title: 'Existing engagement continuance',
    description: 'Document the considerations and conclusions reached in deciding whether to continue an existing review engagement.',
    objective: `This form covers:
• Quality assurance manual
• Engagement risk factors
• Management's integrity
• Unavailable or unreliable data
• Firm competencies
• Independence prohibitions
• Independence threats
• Purpose of the review engagement
• Engagement preconditions
• Partner/practitioner assessment
• Appendix A – Entity operations
• Appendix A – The engagement
• Conclusion`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Understanding the Entity - Basics template data (Review folder)
export const generateUnderstandingEntityBasicsChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-ueb-general',
      title: 'General information',
      questions: [
        { id: 'ueb-gen-1', text: '<p><strong>Legal name (if different from above):</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-gen-2', text: '<p><strong>Approximate number of employees:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'ueb-gen-3',
          text: '<p><strong>Type of entity:</strong></p>',
          answerType: 'multiple-choice',
          options: ['Crown corporation', 'General partnership', 'Joint arrangement', 'Limited partnership', 'Not-for-profit organization', 'Private company', 'Public company', 'Unincorporated business or division'],
          required: false,
          answer: ''
        },
        { id: 'ueb-gen-4', text: '<p><strong>Jurisdiction of incorporation:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-gen-5', text: '<p><strong>Describe the governing legislation and other relevant laws and regulations:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-gen-6', text: '<p><strong>Locations</strong> (e.g., head office, warehouses, divisions, plants and stores)</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-gen-7', text: '<p><strong>Investments and related companies</strong> (e.g., parent, subsidiaries, joint arrangements and others)</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-gen-8', text: '<p><strong>Describe the corporate structure</strong> and identify whether the entity is part of a related group. If the entity is part of a group, describe the group reporting requirements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-gen-9', text: '<p><strong>Key advisors to the entity</strong> (e.g., legal, actuaries, stockbroker and insurance brokers)</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-gen-10', text: '<p><strong>Primary sources of financing</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ueb-misstatements-general',
      title: 'Areas where material misstatements are likely to arise',
      questions: [
        { id: 'ueb-ms-1', text: '<p>Entity operates in a high-risk industry, or management regularly takes high financial risks.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-ms-2', text: '<p>Negative cash flows during the period or anticipated future cash flow problems.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-ms-3', text: '<p>Any inability to obtain new financing.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-ms-4', text: '<p>Unrecorded changes have been made in terms of financing or equity.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-ms-5', text: '<p>Significant changes have been made to the terms/conditions of financing agreements, including amendments to bank covenants or equity.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-ms-6', text: '<p>Investments held are subject to possible impairment.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-ms-7', text: '<p>Significant accounting and reporting implications exist as a result of the entity being part of a group.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-ms-nature', text: '<p><strong>Nature of likely misstatements</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ueb-oversight',
      title: 'Understanding oversight',
      questions: [
        { id: 'ueb-ov-1', text: '<p><strong>Person(s) interviewed:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ov-2', text: '<p><strong>Describe the culture (tone at the top) of the entity</strong> through which it addresses risks relating to its obligations and financial reporting (e.g., commitment to integrity, risk appetite and attitude toward control in general).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ov-3', text: '<p>Describe any actual, suspected or alleged fraud, illegal acts, or non-compliance with laws and regulations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ueb-governance',
      title: 'Governance',
      questions: [
        { id: 'ueb-gov-1', text: '<p><strong>Those charged with governance:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-gov-2', text: '<p>Lack of management emphasis on, or enforcement of, the need for integrity/ethics.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-gov-3', text: '<p>Any unethical business practices or any actual, suspected, or alleged fraud or illegal acts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-gov-4', text: '<p>Lack of competence of key personnel.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-gov-5', text: '<p>Lack of monitoring of financial results (e.g., actual results are not being compared to budget or the variances are not being explained).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-gov-6', text: '<p>Pressures on management to meet internal/external performance targets.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-gov-7', text: '<p>Any non-compliance with laws and regulations that could materially impact F/S.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-gov-nature', text: '<p><strong>Nature of likely misstatements</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ueb-operations',
      title: 'Understanding operations',
      questions: [
        { id: 'ueb-ops-1', text: '<p><strong>Person(s) interviewed:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ops-2', text: '<p><strong>Describe the industry and the nature of the entity\'s operations.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'ueb-ops-3',
          text: '<p><strong>Describe the entity\'s geographical sales.</strong> Indicate export countries where applicable.</p>',
          answerType: 'multiple-choice',
          options: ['Both domestic and export', 'Primarily domestic', 'Primarily for export', 'Very localized'],
          required: false,
          answer: ''
        },
        {
          id: 'ueb-ops-4',
          text: '<p><strong>Describe the overall state of the industry.</strong></p>',
          answerType: 'multiple-choice',
          options: ['Declining industry', 'Growing industry', 'Static industry'],
          required: false,
          answer: ''
        },
        { id: 'ueb-ops-5', text: '<p><strong>Describe any external factors that impact the entity</strong> (e.g., exchange rates, interest rates, commodity prices, competition and new government regulations).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ops-6', text: '<p><strong>Describe any measures taken by management to oversee external factors</strong> (e.g., foreign exchange contracts and interest rate swaps).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ops-7', text: '<p><strong>Summarize the entity\'s key objectives and strategies</strong> (e.g., business plans or planned changes to current operations).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ops-8', text: '<p><strong>Describe any non-compliance with government regulations or contractual commitments,</strong> and the consequences.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ops-9', text: '<p><strong>Describe major changes in business operations</strong> (e.g., expansion, sale, purchase or discontinuance of business elements, new products/services or locations, investments, customers or suppliers).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ops-10', text: '<p><strong>Describe the nature and extent of the investments</strong> that the entity is planning.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ops-11', text: '<p><strong>Describe key changes or losses in personnel,</strong> and the implications.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ops-12', text: '<p><strong>Describe new or revised material contracts.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'ueb-ops-13', text: '<p><strong>Describe new, pending or threatened litigation.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ueb-ops-misstatements',
      title: 'Operations - Areas where material misstatements are likely to arise',
      questions: [
        { id: 'ueb-opsm-1', text: '<p>Changes in business operations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-opsm-2', text: '<p>Changes in roles/competence of key personnel.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-opsm-3', text: '<p>Implications relating to the rise or decline of the state of the industry.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'ueb-opsm-nature', text: '<p><strong>Nature of likely misstatements</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-understanding-entity-basics',
    title: 'Understanding the entity - Basics',
    description: 'Document the understanding of the entity\'s general information, governance, and operations for a review engagement.',
    objective: `This form covers:
• General information
• Areas where material misstatements are likely to arise
• Understanding oversight
• Governance
• Understanding operations
• Operations – Areas where material misstatements are likely to arise`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Engagement Planning template data (Review folder)
export const generateEngagementPlanningChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-ep-scope',
      title: 'Scope of assignment',
      questions: [
        {
          id: 'ep-scope-1',
          text: '<p><strong>Scope of assignment</strong> (any additional work requested, such as CSRS 4460, tax filings and other specified procedures)</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-changes',
      title: 'Changes from previous periods',
      questions: [
        {
          id: 'ep-changes-1',
          text: '<p><strong>Changes from previous periods</strong> (nature of business, personnel, financial reporting, significant developments, etc.)</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-strategy',
      title: 'Engagement strategy',
      questions: [
        {
          id: 'ep-strategy-1',
          text: '<p><strong>Engagement strategy</strong> (comments on overall approach, specific inquiries/procedures, areas to consider, etc.)</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-other',
      title: 'Other considerations',
      questions: [
        {
          id: 'ep-other-1',
          text: '<p><strong>Other considerations</strong> (need for subject matter experts, group requirements, etc.)</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-engagement-planning',
    title: 'Engagement Planning',
    description: 'Document the engagement planning for a review engagement.',
    objective: `This form covers:
• Scope of assignment
• Changes from previous periods
• Engagement strategy
• Other considerations`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Completion (Review) template data
export const generateReviewCompletionChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-rc-engagement-mgmt',
      title: 'Engagement Management',
      questions: [
        {
          id: 'rc-em-qm',
          text: '<p><strong>Quality management</strong></p><p>Was the engagement performed in accordance with the firm\'s quality?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'rc-em-info',
          text: '<p><strong>Has any information come to our attention during the engagement to indicate:</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'rc-em-info-i', text: '<p>i. There is no longer a rational purpose for the engagement?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'rc-em-info-ii', text: '<p>ii. A review engagement would no longer be appropriate in the circumstances?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'rc-em-info-iii', text: '<p>iii. Were all ethical requirements met, including any independence prohibitions or threats identified? If yes, explain how they were addressed.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'rc-em-info-d', text: '<p>d. Has the time spent on the engagement been recorded and the significant variances from the budget explained?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-scoping',
      title: 'Scoping',
      questions: [
        {
          id: 'rc-sc-1',
          text: '<p>Was our understanding of the entity and its environment and our engagement scoping inquiries sufficient to obtain an understanding of the entity and the applicable financial reporting framework necessary to:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'rc-sc-1a', text: '<p>a. Identify areas in the F/S where material misstatements are likely to arise?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'rc-sc-1b', text: '<p>b. Provide a basis for designing appropriate procedures to address those areas?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-procedures',
      title: 'Procedures performed',
      questions: [
        {
          id: 'rc-pp-1',
          text: '<p>Were the performed and documented procedures sufficient to obtain appropriate evidence with respect to all material items in the F/S?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-findings',
      title: 'Findings',
      questions: [
        {
          id: 'rc-find-1',
          text: '<p>Where we became aware of matters that caused us to believe the F/S may be materially misstated, did we perform sufficient additional procedures to conclude that the F/S are either not likely or likely to be materially misstated?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-subsequent',
      title: 'Subsequent events',
      questions: [
        { id: 'rc-se-1', text: '<p>Have subsequent events been considered and appropriately addressed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-going-concern',
      title: 'Going Concern',
      questions: [
        {
          id: 'rc-gc-1',
          text: '<p>Where there is significant doubt about the entity\'s ability to continue as a going concern:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'rc-gc-1a', text: '<p>a. Have appropriate disclosures been made in the F/S in accordance with the applicable financial reporting framework?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'rc-gc-1b', text: '<p>b. Has the wording of our review engagement report been amended?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'rc-gc-1c', text: '<p>c. Where the going-concern basis of accounting remains appropriate but a material uncertainty exists, has the Emphasis of Matter paragraph highlighted the existence of the material uncertainty and drawn attention to the note in the F/S that discloses the matter?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-misstatements',
      title: 'Identified Misstatements',
      questions: [
        {
          id: 'rc-im-1',
          text: '<p>a. Was management and/or TCWG asked to correct identified misstatements other than those considered clearly trivial?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'rc-im-2',
          text: '<p>b. If management declined to correct any of the identified misstatements, were the reasons provided acceptable?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-conclusions',
      title: 'Conclusions',
      questions: [
        {
          id: 'rc-cl-1',
          text: '<p>a. Have all planned inquiries, analyses and any additional procedures required been completed?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'rc-cl-2',
          text: '<p>b. Have the results and conclusions reached been documented in the working papers?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-documentation',
      title: 'Documentation',
      questions: [
        {
          id: 'rc-doc-1',
          text: '<p>a. Have all working papers been reviewed, initialed and dated?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'rc-doc-2',
          text: '<p>b. Have the file reviewer\'s queries been cleared within the file and then removed?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'rc-doc-3',
          text: '<p>c. Have all engagement issues/questions been addressed and the details documented?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-communication',
      title: 'Communication',
      questions: [
        {
          id: 'rc-comm-1',
          text: '<p>a. Have discussions of relevant engagement findings with management or TCWG, as appropriate, been documented along with details of any decisions made?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-fs',
      title: 'Financial statements',
      questions: [
        {
          id: 'rc-fs-1',
          text: '<p>a. Has evidence been obtained that demonstrates the F/S agree with the entity\'s underlying accounting records?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'rc-fs-2', text: '<p>b. Is there any imprecise, qualifying or limiting language?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'rc-fs-3', text: '<p>c. Is the terminology used, including the title of each F/S, appropriate?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'rc-fs-4', text: '<p>d. Is the overall presentation, structure and content of the F/S in accordance with the applicable financial reporting framework?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'rc-fs-5', text: '<p>e. Are the F/S and notes accurately cross-referenced?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'rc-fs-6', text: '<p>f. Are the accounting policies and assumptions used in preparation of the F/S appropriate and consistent with F/S disclosures?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'rc-fs-7', text: '<p>g. Is it necessary to include any additional disclosures beyond those specifically required by the applicable financial reporting framework?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'rc-fs-8', text: '<p>h. Do the F/S and disclosures appear to be relevant, reliable, comparable and understandable?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-report',
      title: 'Review Engagement Report',
      questions: [
        {
          id: 'rc-rep-1',
          text: '<p>a. Has sufficient appropriate evidence been obtained to issue an unmodified conclusion on the F/S as a whole? If not, has the conclusion been appropriately modified and a basis of conclusion prepared?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        { id: 'rc-rep-2', text: '<p>b. Is the form, content and date of the review engagement report in accordance with the requirements of CSRE 2400?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'rc-rep-3', text: '<p>c. If there was a modified conclusion on the prior period\'s F/S involving a still-unresolved matter that affects the comparability of current and comparative figures, does the report refer to both the current and the prior period?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'rc-rep-4', text: '<p>d. Where applicable, has the engagement quality reviewer signed off on the file?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'rc-rep-5', text: '<p>e. Has approval of the final F/S by a recognized authority (e.g., governance board)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-emphasis',
      title: 'Emphasis of Matter paragraph',
      questions: [
        {
          id: 'rc-emp-1',
          text: '<p>Significant disclosures in the F/S that should be brought to the users\' attention? Consider where the F/S have been prepared for special-purpose users. An Emphasis of Matter paragraph may be used to highlight a note to the F/S that describes the reason for amendments to the F/S and to an earlier report.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rc-other-matter',
      title: 'Other Matter paragraph',
      questions: [
        {
          id: 'rc-om-1',
          text: '<p>Significant matters not presented or disclosed in the F/S? An Other Matter paragraph may be used to:</p><ul><li>Highlight prior period F/S that were subject to a review or audit engagement prepared by the predecessor accountant or prior period F/S that were not subject to a review or audit engagement.</li><li>Highlight restrictions on the distribution of the report.</li></ul>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-review-completion',
    title: 'Completion',
    description: 'Completion procedures for a review engagement.',
    objective: `This form covers:
• Engagement Management
• Scoping
• Procedures performed
• Findings
• Subsequent events
• Going Concern
• Identified Misstatements
• Conclusions
• Documentation
• Communication
• Financial statements
• Review Engagement Report
• Emphasis of Matter paragraph
• Other Matter paragraph`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Subsequent Events template
export const generateSubsequentEventsChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-se-inquiry',
      title: 'Management Inquiry',
      questions: [
        {
          id: 'q-se-inquiry-1',
          text: '<p>Inquire of management and those charged with governance about whether any events have occurred between the period end and the anticipated report date that might affect the financial statements.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-inquiry-2',
          text: '<p>Inquire about the current status of items that were accounted for on the basis of preliminary or inconclusive data.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-se-identified',
      title: 'Subsequent Events Identified',
      questions: [
        {
          id: 'q-se-identified-1',
          text: '<p>Where subsequent events are identified, obtain and review details of each event, and determine whether the event is appropriately reflected in the financial statements in accordance with the applicable financial reporting framework.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-se-facts',
      title: 'Facts Discovered After Report Date',
      questions: [
        {
          id: 'q-se-facts-1',
          text: '<p>Discuss the matter with management and, where appropriate, those charged with governance.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-facts-2',
          text: '<p>Determine whether the financial statements need amendment. If so, inquire how management intends to address the matter in the financial statements.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-se-presentation',
      title: 'Presentation and Disclosure',
      questions: [
        {
          id: 'q-se-presentation-1',
          text: '<p>Determine whether subsequent events have been appropriately recorded, presented and disclosed in accordance with the applicable financial reporting framework. Complete the relevant section(s) of the applicable financial reporting framework disclosure forms (the FRF 900 series of forms).</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-se-indicators',
      title: 'Indicators That Subsequent Events May Have Occurred',
      questions: [
        {
          id: 'q-se-ind-1',
          text: '<p>New commitments, borrowings or guarantees.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-ind-2',
          text: '<p>Significant new contracts.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-ind-3',
          text: '<p>Actual / planned sales / acquisitions of assets and business units.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-ind-4',
          text: '<p>Increases in capital or issuance of debt instruments.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-ind-5',
          text: '<p>Assets destroyed (e.g., through fire or flood) or appropriated by government.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-ind-6',
          text: '<p>New contingencies (including litigation) or new developments regarding existing contingencies.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-ind-7',
          text: '<p>Any unusual accounting adjustments either made or being contemplated.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-ind-8',
          text: '<p>Any events that would question the appropriateness of the accounting policies being used.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-ind-9',
          text: '<p>Any events relevant to the measurement of estimates or provisions made in the financial statements.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-ind-10',
          text: '<p>Any events relevant to the recoverability of assets or the existence of new liabilities.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        },
        {
          id: 'q-se-ind-11',
          text: '<p>Any events or circumstances that would question the validity of the going-concern basis of accounting.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'subsequent-events',
    title: 'Subsequent Events',
    objective: `This form covers:
• Management Inquiry
• Subsequent Events Identified
• Facts Discovered After Report Date
• Presentation and Disclosure
• Indicators That Subsequent Events May Have Occurred`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Withdrawal (Review) template
export const generateReviewWithdrawalChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-rw-reasons',
      title: 'Reason for Withdrawal',
      questions: [
        {
          id: 'q-rw-reasons-1',
          text: '<p>Document the reason for your withdrawal, the actions taken and discussions with management, including any of the following situations:</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-rw-reasons-1a', text: '<p>Limited assurance cannot be obtained and a qualified conclusion in the practitioner\'s report is insufficient, or the practitioner did not disclaim a conclusion. (CSRE 2400.13)</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-rw-reasons-1b', text: '<p>There is sufficient doubt about the integrity of management such that the written representations are not reliable. (CSRE 2400.72(a))</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-rw-reasons-1c', text: '<p>Management does not provide the required written representations. (CSRE 2400.72(b))</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-rw-reasons-1d', text: '<p>Management imposed a limitation on scope and, as a result, limited assurance cannot be obtained.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rw-permitted',
      title: 'Permission to Withdraw',
      questions: [
        {
          id: 'q-rw-permitted-1',
          text: '<p>Document whether the firm is permitted to withdraw from the engagement for the reason above based on:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-rw-permitted-1a', text: '<p>The applicable provincial Code of Professional Conduct / Code of Ethics.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-rw-permitted-1b', text: '<p>The firm\'s quality management policies and procedures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-rw-communication',
      title: 'Communication',
      questions: [
        {
          id: 'q-rw-comm-1',
          text: '<p>Communicate the reason(s) for withdrawing from the engagement to management. Include a copy of the communication in the working papers along with management\'s response, if any.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'review-withdrawal',
    title: 'Withdrawal',
    objective: `This form covers:
• Reason for Withdrawal
• Permission to Withdraw
• Communication with Management`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Understanding the Entity - Systems template
export const generateUnderstandingEntitySystemsChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-ues-financial',
      title: 'Part A — Understanding Financial Accounting/Reporting Systems',
      questions: [
        { id: 'q-ues-fin-1', text: '<p>Identify the individual(s) responsible for the day-to-day accounting, and describe the experience they have.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-fin-2', text: '<p>Describe the key financial reports produced on a regular basis (e.g., income statement, balance sheet and budget to actual comparison).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-fin-3', text: '<p>Describe the key indicators management uses to measure and assess performance (e.g., sales per square foot and gross margins).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-fin-4', text: '<p>Describe the financial reports (if any) that are regularly provided to third parties, such as banks.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-fin-5',
          text: '<p>Describe the accounting applications used by the entity.</p>',
          answerType: 'multiple-choice',
          options: ['None (manual or spreadsheet ledgers used)', 'QuickBooks', 'QuickBooks Online', 'Sage 50', 'Other (specify)'],
          required: false,
          answer: ''
        },
        { id: 'q-ues-fin-6', text: '<p>Describe the nature of any external accounting services provided (e.g., bookkeeping).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-fin-7', text: '<p>Describe any significant transactions occurring or recognized near the end of the reporting period.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-fin-8', text: '<p>Describe any material non-monetary transactions or transactions for no consideration.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-fin-9', text: '<p>Describe the results of any government audits (HST, GT or corporate) that occurred during the period.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-fin-10',
          text: '<p>Describe significant accounting policies (if any) that are:</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-fin-10a', text: '<p>Not usually used in the entity\'s industry.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-fin-10b', text: '<p>Not consistently applied.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-fin-10c', text: '<p>Considered controversial.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-fin-10d', text: '<p>Not appropriate or consistent with the applicable financial reporting framework.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-fin-11', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-fin-12',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-fin-12a', text: '<p>Extensive reliance placed on spreadsheets (including consolidations) to prepare financial reports.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-fin-12b', text: '<p>Use of third-party processing of transactions without any evaluation of controls.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-fin-12c', text: '<p>Significant judgments made in the application of accounting policies.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-fin-12d', text: '<p>Changes made to significant accounting policies this period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-fin-12e', text: '<p>Non-monetary transactions used during the period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-fin-12f', text: '<p>Inconsistent application of, and/or changes in, accounting policies during the period (e.g., revenue recognition).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-fin-12g', text: '<p>Lack of consultation with subject matter experts regarding the recording of complex transactions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-fin-13', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-tech',
      title: 'Understanding General Technology',
      questions: [
        { id: 'q-ues-tech-1', text: '<p>Indicate the individual(s) responsible for managing the IT applications in the entity. If the person responsible is not an employee, describe the contractual arrangement in place.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-tech-2', text: '<p>Describe the current technology systems (e.g., hardware, software and data storage, such as server or cloud).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-tech-3', text: '<p>Describe the process for authorizing and making changes (if any) to financial applications.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-tech-4', text: '<p>Describe the applications used to capture, process, record and report financial information.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-tech-5',
          text: '<p>Describe how the entity restricts access to data and applications to authorized personnel, such as:</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-tech-5a', text: '<p>Physical security.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-tech-5b', text: '<p>Data stored with third parties.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-tech-5c', text: '<p>Data stored on the cloud.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-tech-5d', text: '<p>Remote access.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-tech-5e', text: '<p>Passwords for applications.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-tech-5f', text: '<p>Virus and malware protection.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-tech-5g', text: '<p>Data backup and data recovery procedures.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-tech-6', text: '<p>Describe any modifications to the technology systems during the period.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-tech-7', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-tech-8',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-tech-8a', text: '<p>Unauthorized physical access to IT facilities and equipment.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-tech-8b', text: '<p>Unauthorized access to the network, major applications and related data.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-tech-8c', text: '<p>Outdated, overly complex, or inadequate IT hardware and infrastructure.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-tech-8d', text: '<p>Significant dependence on technology to capture, process, record and report financial information.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-tech-8e', text: '<p>Unauthorized changes to accounting programs and/or data.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-tech-8f', text: '<p>New or modified accounting software, or other significant changes in technology systems.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-tech-8g', text: '<p>Data loss due to inadequate backup or other security procedures, such as virus protection.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-tech-9', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-cash',
      title: 'Understanding Cash Processes',
      questions: [
        {
          id: 'q-ues-cash-1',
          text: '<p>Describe how the entity manages its banking facilities, such as:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-cash-1a', text: '<p>Electronic banking policies (e.g., Internet transfers and wire payments).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-cash-1b', text: '<p>Authorization of corporate credit cards.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-cash-1c', text: '<p>Cheque signing policies.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-cash-2', text: '<p>Describe the procedures for ensuring that cash transactions are recorded in the appropriate period.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-cash-3', text: '<p>Describe the entity\'s processes for the preparation and review of monthly bank reconciliations.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-cash-4', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-cash-5',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-cash-5a', text: '<p>Entity handles large amounts of cash on a regular basis.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-cash-5b', text: '<p>Potential exists for cash sales to go unrecorded in the accounting records.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-cash-5c', text: '<p>Weak physical controls over cash balances held.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-cash-6', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-revenue',
      title: 'Understanding Revenue Transactions',
      questions: [
        {
          id: 'q-ues-rev-1',
          text: '<p>Describe the entity\'s customer base:</p>',
          answerType: 'multiple-choice',
          options: ['Many customers', 'Primarily a few significant customers', 'Many customers, including one or more significant customers listed below'],
          required: false,
          answer: ''
        },
        { id: 'q-ues-rev-2', text: '<p>Name of significant customers.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-rev-3', text: '<p>Describe how revenue transactions are initiated (e.g., phone, email or internet).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-rev-4',
          text: '<p>Indicate at what point in the sales process revenue transactions are recorded in the general ledger.</p>',
          answerType: 'multiple-choice',
          options: ['Invoicing', 'Percentage of completion', 'Shipment', 'Other'],
          required: false,
          answer: ''
        },
        { id: 'q-ues-rev-5', text: '<p>Describe any complexities in revenue recognition (e.g., multiple revenue streams, rights of return and contractual terms).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-rev-6', text: '<p>Describe how management ensures that all revenue transactions are recorded and included in the correct period (cut-off).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-rev-7',
          text: '<p>Indicate the entity\'s normal sales terms.</p>',
          answerType: 'multiple-choice',
          options: ['< 30 days', '30-60 days', '60-90 days', '> 90 days'],
          required: false,
          answer: ''
        },
        { id: 'q-ues-rev-8', text: '<p>Describe any special terms, conditions, discounts, etc., on sales.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-rev-9', text: '<p>Describe how proceeds from revenue transactions are collected (cash sales %, credit card sales %, credit sales %).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-rev-10', text: '<p>Describe the extent of online sales.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-rev-11',
          text: '<p>Describe the entity\'s procedures for determining the allowance for doubtful accounts.</p>',
          answerType: 'multiple-choice',
          options: ['Specific account identification', 'General provision based on aging', 'Combination of specific account and general provision'],
          required: false,
          answer: ''
        },
        { id: 'q-ues-rev-12', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-rev-13',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-rev-13a', text: '<p>History of misstatements in revenue recognition.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-rev-13b', text: '<p>Sales of goods/services provided to customers with poor credit.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-rev-13c', text: '<p>Weak controls over cut-off at period end.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-rev-14', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-purchase',
      title: 'Understanding Purchase / Disposal Transactions',
      questions: [
        {
          id: 'q-ues-pur-1',
          text: '<p>Identify the entity\'s suppliers, and specify the significant suppliers.</p>',
          answerType: 'multiple-choice',
          options: ['Many suppliers', 'Many suppliers, including the significant suppliers described below', 'Primarily a few significant suppliers'],
          required: false,
          answer: ''
        },
        { id: 'q-ues-pur-2', text: '<p>Name of significant suppliers.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-pur-3', text: '<p>Describe how purchase and disposal transactions are initiated (e.g., purchase orders, online orders, phone calls or emails).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-pur-4', text: '<p>Document how purchase and disposal transactions are recorded in the general ledger.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-pur-5', text: '<p>Describe how management ensures that all goods and services and disposals are recorded in the proper period.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-pur-6',
          text: '<p>Indicate the entity\'s usual payment terms.</p>',
          answerType: 'multiple-choice',
          options: ['< 30 days', '30-60 days', '60-90 days', '> 90 days'],
          required: false,
          answer: ''
        },
        { id: 'q-ues-pur-7', text: '<p>Describe any purchases and disposals outside the normal course of business.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-pur-8', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-pur-9',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-pur-9a', text: '<p>Weak controls over cut-off at period end.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-pur-9b', text: '<p>History of misstatements in the purchase of goods and services.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-pur-9c', text: '<p>Personal expenses charged to the business.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-pur-10', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-payroll',
      title: 'Understanding Payroll Transactions',
      questions: [
        {
          id: 'q-ues-pay-1',
          text: '<p>Identify the entity\'s personnel:</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-pay-1a', text: '<p>Management (number).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-pay-1b', text: '<p>Supervisors (number).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-pay-1c', text: '<p>Office staff (number).</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-pay-1d', text: '<p>Operations (number).</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-pay-2', text: '<p>Describe how new hires/terminations are added to/removed from the payroll.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-pay-3', text: '<p>Document how payroll transactions are recorded in the general ledger.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-pay-4', text: '<p>Describe how rates of pay and payroll deductions are authorized and updated in the payroll system.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-pay-5',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-pay-5a', text: '<p>Rates of pay and payroll deductions not properly authorized or updated.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-pay-5b', text: '<p>History of misstatements in payroll.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-pay-5c', text: '<p>Unauthorized personnel (e.g., family members) included on the payroll.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-pay-6', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-inventory',
      title: 'Understanding Inventory',
      questions: [
        {
          id: 'q-ues-inv-1',
          text: '<p>Describe the type of inventory systems maintained by the entity.</p>',
          answerType: 'multiple-choice',
          options: ['Perpetual', 'Periodic', 'Other (specify)'],
          required: false,
          answer: ''
        },
        { id: 'q-ues-inv-2', text: '<p>Document whether any inventory is held with third parties or at other locations.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-inv-3', text: '<p>Document whether a physical count of the inventory is performed at period end. If so, attach or cross-reference a copy of the count instructions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        {
          id: 'q-ues-inv-4',
          text: '<p>Describe the entity\'s policy for the costing of inventory, and note any inconsistencies with prior periods.</p>',
          answerType: 'multiple-choice',
          options: ['Job costing', 'Standard costing', 'Weighted average costing', 'Retail method', 'Specific identification'],
          required: false,
          answer: ''
        },
        { id: 'q-ues-inv-5', text: '<p>Describe how the entity determines the costs for work in process (including raw materials, labour and overhead) and the extent of completion.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-inv-6',
          text: '<p>Describe the entity\'s policy for the transfer of inventory to cost of sales, and note any inconsistencies with prior periods.</p>',
          answerType: 'multiple-choice',
          options: ['Ending inventory based on physical count with an adjustment to cost of sale', 'First in, first out', 'Percentage of completion accounting', 'Specific identification', 'Other (specify)'],
          required: false,
          answer: ''
        },
        { id: 'q-ues-inv-7', text: '<p>Describe how the inventory sub-ledger is updated for goods received/sold.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-inv-8', text: '<p>Describe how inventory transactions are recorded in the general ledger.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-inv-9', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-inv-10',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-inv-10a', text: '<p>Unreconciled differences between physical and book amounts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-inv-10b', text: '<p>Weak controls over the physical location of inventory or inventory cut-off.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-inv-10c', text: '<p>History of misstatements with regard to inventory balances and the assessment of impairments for slow-moving and obsolete goods.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-inv-11', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-estimates',
      title: 'Part B — Understanding Accounting Estimates',
      questions: [
        {
          id: 'q-ues-est-1',
          text: '<p>Describe any significant accounting estimates, the manner in which they are prepared and the key assumptions used, including (but not limited to):</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-est-1a', text: '<p>Inventory obsolescence.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-est-1b', text: '<p>Allowance for doubtful accounts.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-est-1c', text: '<p>Loan impairments.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-est-1d', text: '<p>Fair values.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-est-1e', text: '<p>Useful lives of assets.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-est-1f', text: '<p>Other estimates.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-est-2', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-est-3',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-est-3a', text: '<p>Significant accounting estimates used in financial reporting.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-est-3b', text: '<p>Unreliable or inappropriate management assumptions/calculations used in preparing accounting estimates.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-est-3c', text: '<p>Significant accounting estimates not prepared in accordance with the applicable financial reporting framework.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-est-4', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-related',
      title: 'Understanding Related Parties',
      questions: [
        {
          id: 'q-ues-rel-1',
          text: '<p>Inquire about:</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-rel-1a', text: '<p>A list of related parties.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-rel-1b', text: '<p>The nature of related-party relationships.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'q-ues-rel-1c', text: '<p>The nature of related-party transactions occurring in the period.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-rel-2', text: '<p>Describe how the entity ensures that transactions occurring around period end have been recorded in the correct period.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-rel-3', text: '<p>Describe any related-party transactions outside the normal course of business during the reporting period.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-rel-4', text: '<p>Describe the effects or possible implications of the entity\'s transactions/relationships with related parties.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-rel-5', text: '<p>Describe any indicators of possible payment or amount receivable from related parties.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-rel-6', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-rel-7',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-rel-7a', text: '<p>History of undisclosed related-party transactions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-rel-7b', text: '<p>No obvious purpose for some related-party relationships.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-rel-7c', text: '<p>Related-party transactions outside of the normal course of business.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-rel-7d', text: '<p>Related-party transactions that occurred prior to period end are reversed after the period end.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-rel-8', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-journal',
      title: 'Understanding Journal Entries/Adjustments',
      questions: [
        { id: 'q-ues-jrn-1', text: '<p>Describe how non-recurring journal entries or adjustments are initiated and authorized.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-jrn-2', text: '<p>Describe any significant journal entries or adjustments made during the period.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-jrn-3', text: '<p>Describe any matters that required adjustments in the F/S of prior periods.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-ues-jrn-4', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-jrn-5',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-jrn-5a', text: '<p>History of inappropriate/unauthorized journal entries/adjustments during the period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-jrn-5b', text: '<p>History of journal entries being made to unusual or seldom-used accounts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-jrn-5c', text: '<p>Prior period uncorrected misstatements remain uncorrected in the current period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-jrn-6', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-going-concern',
      title: 'Understanding Going-Concern Uncertainties',
      questions: [
        { id: 'q-ues-gc-1', text: '<p>Inquire whether management has made an assessment of its ability to continue as a going concern. If so, document the assessment period used by management.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-gc-2',
          text: '<p>Inquire about any other events or uncertainties that could cause doubt about the entity\'s ability to continue as a going concern. Consider:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-gc-2a', text: '<p>Financing/cash flow challenges.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-gc-2b', text: '<p>Adverse market conditions, trends or events.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-gc-2c', text: '<p>Regulatory or legal challenges.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-gc-3', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'q-ues-gc-4',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: '',
          subQuestions: [
            { id: 'q-ues-gc-4a', text: '<p>Bias in management estimates.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-gc-4b', text: '<p>Unrecorded accruals.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-ues-gc-4c', text: '<p>Unremitted payroll deductions/government remittances.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-ues-gc-5', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'understanding-entity-systems',
    title: 'Understanding the Entity - Systems',
    objective: `This form covers:
• Part A — Understanding Financial Accounting/Reporting Systems
• Understanding General Technology
• Understanding Cash Processes
• Understanding Revenue Transactions
• Understanding Purchase / Disposal Transactions
• Understanding Payroll Transactions
• Understanding Inventory
• Part B — Understanding Accounting Estimates
• Understanding Related Parties
• Understanding Journal Entries/Adjustments
• Understanding Going-Concern Uncertainties`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// ASPE - General - Disclosure Checklist template
export const generateASPEGeneralDisclosureChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-aspe-gen-presentation',
      title: 'General Financial Statement Presentation',
      questions: [
        { id: 'q-aspe-gen-1', text: '<p>Do the financial statements present fairly in accordance with GAAP the financial position, results of operations and cash flows? Consider: (a) GAAP applied appropriately; (b) sufficient information; (c) clear and understandable.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gen-2', text: '<p>Do the notes to the financial statements prominently disclose that the financial statements have been prepared in accordance with ASPE?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gen-3', text: '<p>When management is aware of material uncertainties related to events or conditions that may cast significant doubt on the entity\'s ability to continue as a going concern, have these uncertainties been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gen-4', text: '<p>Are the footnotes and supporting schedules clearly cross-referenced to/from the financial statements?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gen-5', text: '<p>Are comparative figures shown (unless the comparative information is not meaningful or other standards permit otherwise)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gen-6', text: '<p>Has there been a change in the allocation or grouping of financial statement items? If so, have the comparative numbers been changed to reflect this change?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gen-7', text: '<p>Is this the first year of adoption for ASPE? If so, complete Form FRF 907.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gen-8', text: '<p>Is there a clear and concise description of the entity\'s significant accounting policies? Consider: (1) areas where judgment is required; (2) selection from alternative acceptable principles; (3) methods peculiar to the industry.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gen-9', text: '<p>Have the entity\'s significant accounting policies been presented in one summary note titled "Summary of Accounting Policies" or "Accounting Policies" and presented as one of the first notes?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gen-10', text: '<p>Where there has been a change in an accounting policy or an accounting estimate, or where there has been the correction of an error, has the appropriate section of Form FRF 913 been completed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gen-11', text: '<p>If the financial statements are not the entity\'s general purpose financial statements, has a note which makes reference to the general purpose statements been added?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-fi-general',
      title: 'Financial Instruments — General',
      questions: [
        { id: 'q-aspe-fi-1', text: '<p>Do the financial statements disclose entity-specific information that enables users to evaluate the significance of financial instruments to its financial position and performance?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-fi-2', text: '<p>Has the entity disclosed the carrying amounts of each category of financial instruments: (a) measured at amortized cost; (b) measured at fair value; and (c) impairment?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-fi-3', text: '<p>Have financial instruments with indexing features disclosed information that enables users to understand the nature, terms and effects of the indexing feature?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-fi-4', text: '<p>Have financial assets and liabilities only been offset and reported as a net amount when the entity: (a) has a legally enforceable right to set off; and (b) intends to settle on a net basis?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-fi-5', text: '<p>For each significant risk arising from financial instruments, has the entity disclosed: (a) exposures to risk and how they arise; and (b) any change from the previous period? Including credit, currency, interest rate, liquidity, market and other price risk.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-fi-6', text: '<p>For each type of risk, has the entity disclosed the concentrations of risk?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-fi-transfer',
      title: 'Financial Instruments — Transfer of Receivables',
      questions: [
        { id: 'q-aspe-fit-1', text: '<p>Has the entity disclosed the following for transfers of financial assets accounted for as a sale: (1) gain/loss; (2) accounting policies for retained interest; (3) description of continuing involvement?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-fit-2', text: '<p>Has the entity disclosed the following for transfers that do not qualify for de-recognition: (1) nature and carrying amount; (2) nature of risks; (3) carrying amount of liabilities assumed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-related',
      title: 'Related-Party Transactions',
      questions: [
        { id: 'q-aspe-rp-1', text: '<p>Have all related parties been identified and documented (including the nature of the relationship, nature and purpose of the transaction, measurement basis, etc.) on Form 510 or 515?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-rp-2', text: '<p>Where there are transactions with related parties, do the financial statements disclose: (a) recognized amount and measurement basis; (b) balances with description, amount and terms; (c) contractual obligations separately; (d) contingencies separately?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-rp-3', text: '<p>Where an entity recognizes the forgiveness of a related-party financial asset, has it been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-rp-4', text: '<p>Where an entity recognizes the extinguishment of a financial liability in a related-party transaction in net income, has that fact and nature been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-measurement',
      title: 'Measurement Uncertainty',
      questions: [
        { id: 'q-aspe-mu-1', text: '<p>Do the financial statements disclose the nature of a material measurement uncertainty, including: (a) description of circumstances; and (b) relevant information about anticipated resolution?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-mu-2', text: '<p>Do the financial statements disclose the extent of a measurement uncertainty near term?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-mu-3', text: '<p>Do the financial statements disclose the recognized amount of the item subject to measurement uncertainty? If non-disclosure would have a significant adverse effect, have the reasons been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-economic',
      title: 'Economic Dependence',
      questions: [
        { id: 'q-aspe-ed-1', text: '<p>Do the financial statements disclose and explain economic dependence when the ongoing operations depend on a significant volume of business with another party?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-cash',
      title: 'Cash and Cash Equivalents',
      questions: [
        { id: 'q-aspe-cash-1', text: '<p>Have cash balances subject to restrictions that prevent their use for current purposes been excluded from current assets and disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-cash-2', text: '<p>Have cash and cash equivalents appropriated for other than current purposes been excluded from current assets unless such cash offsets a current liability?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-cash-3', text: '<p>Does the entity disclose the policy that it adopted in determining the composition of cash and cash equivalents?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-ar',
      title: 'Accounts Receivable, Trade and Other',
      questions: [
        { id: 'q-aspe-ar-1', text: '<p>Have accounts and notes receivable been segregated into: (a) trade accounts; (b) amounts owing by related parties; and (c) other unusual items of significant amounts?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ar-2', text: '<p>When practicable, have the amounts and maturity dates of the accounts maturing beyond one year been disclosed separately?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ar-3', text: '<p>Have all pledges of, or encumbrances on, accounts receivable been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ar-4', text: '<p>For amounts receivable (other than current trade receivables), has the carrying amount of impaired financial assets and the related allowance been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ar-5', text: '<p>For current trade receivables, has the amount of any allowance for impairment been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-inventory',
      title: 'Inventories',
      questions: [
        { id: 'q-aspe-inv-1', text: '<p>Have the accounting policies adopted for measuring inventories, including the cost formula (FIFO or weighted average), been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-inv-2', text: '<p>Does the entity\'s accounting policy distinguish between spare parts and standby equipment (property, plant, and equipment)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-inv-3', text: '<p>Has the total carrying amount of inventories and the carrying amount by major categories been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-inv-4', text: '<p>Has the amount of inventories recognized as an expense during the period, including any write-down or reversal, been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-inv-5', text: '<p>Where there are pledges of, or encumbrances on, inventory, has the carrying amount pledged as security for liabilities been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-loans',
      title: 'Loans and Advances Receivable',
      questions: [
        { id: 'q-aspe-loan-1', text: '<p>Have only those loans and advances receivable due within a year been included in current assets?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-loan-2', text: '<p>Have the terms and conditions (interest rates, repayment requirements and maturity dates) been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-loan-3', text: '<p>Have the carrying amount and related allowance for any impaired loans and advances been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-prepaid',
      title: 'Prepaid Expenses and Other Assets',
      questions: [
        { id: 'q-aspe-pre-1', text: '<p>Have prepaid expenses been classified as current assets where they are ordinarily realizable within one year?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-pre-2', text: '<p>Have other assets been classified correctly between current and non-current assets?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-pre-3', text: '<p>Does the entity have intangibles or goodwill? If so, complete Form FRF 911.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-ppe',
      title: 'Property, Plant and Equipment',
      questions: [
        { id: 'q-aspe-ppe-1', text: '<p>Do the financial statements disclose: (1) cost and accumulated amortization by major category; (2) method and period/rate of amortization; (3) net carrying amount not being amortized; (4) pledges or encumbrances; (5) amortization charged to income?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ppe-2', text: '<p>Where an impairment loss has been recognized, has the description of the impaired asset and the amount of the loss been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ppe-3', text: '<p>Where an entity has disposed of a long-lived asset other than by sale, has the "Discontinued operations" section in Form FRF 913 been completed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ppe-4', text: '<p>If a decision has been made not to dispose of an asset previously classified as held for sale, has the change in accounting treatment been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ppe-5', text: '<p>Where the entity has received government assistance/investment tax credits during the period, has the "government assistance" section in Form FRF 913 been completed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-bank',
      title: 'Bank Indebtedness',
      questions: [
        { id: 'q-aspe-bank-1', text: '<p>Has disclosure been made of the terms and conditions of any bank indebtedness, including: (a) title/description; (b) interest rate; (c) maturity date; (d) amount outstanding; (e) currency; (f) repayment terms; (g) unused credit facility?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bank-2', text: '<p>For secured bank indebtedness, has the carrying amount and terms of assets pledged as collateral been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bank-3', text: '<p>Has the entity disclosed the aggregate amount of estimated payments required in each of the next five years?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bank-4', text: '<p>Do the financial statements disclose, as a subsequent event, the nature and consequences of any covenant violations after the balance sheet date?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bank-5', text: '<p>Has the entity disclosed whether the bank indebtedness was in default or in demand, and whether the default was remedied or terms renegotiated?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-ap',
      title: 'Accounts Payable and Accrued Liabilities',
      questions: [
        { id: 'q-aspe-ap-1', text: '<p>Have accounts payable and accrued liabilities been segregated into: (a) trade accounts; (b) amounts owing to related parties; (c) other unusual items of significant amounts?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ap-2', text: '<p>Has government remittances payable been either presented separately on the balance sheet or included in the notes?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-notes-payable',
      title: 'Notes Payable and Bank Debt',
      questions: [
        { id: 'q-aspe-np-1', text: '<p>Has disclosure been made of the terms and conditions of any notes payable and bank debt, including: (a) title/description; (b) interest rate; (c) maturity date; (d) amount outstanding; (e) currency; (f) repayment terms; (g) unused credit facility?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-np-2', text: '<p>For secured financial liabilities, has the carrying amount of secured liabilities, assets pledged and terms been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-np-3', text: '<p>Has the entity disclosed the aggregate amount of estimated payments required in each of the next five years?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-np-4', text: '<p>Where long-term notes were in default or breach, has disclosure been made and has the debt been presented as a current liability where appropriate?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-np-5', text: '<p>Has capitalized interest been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-ltd',
      title: 'Long-Term Debt',
      questions: [
        { id: 'q-aspe-ltd-1', text: '<p>Has disclosure been made of the terms and conditions of any long-term debt, including: (a) title/description; (b) interest rate; (c) maturity date; (d) amount outstanding; (e) currency; (f) repayment terms; (g) unused credit facility?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ltd-2', text: '<p>For secured financial liabilities, has the carrying amount, assets pledged and terms been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ltd-3', text: '<p>Has the entity disclosed the aggregate amount of estimated payments required in each of the next five years?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ltd-4', text: '<p>Where long-term debt was in default or breach, has disclosure been made and has the debt been presented appropriately?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ltd-5', text: '<p>Has capitalized interest been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-other-liab',
      title: 'Other Financial Liabilities',
      questions: [
        { id: 'q-aspe-ofl-1', text: '<p>Have financial instruments been classified as a liability or equity in accordance with the substance of the contractual arrangement?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ofl-2', text: '<p>For secured other financial liabilities, have the carrying amount, assets pledged and terms been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ofl-3', text: '<p>For tax planning arrangements classified as a financial liability, has appropriate disclosure been made?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ofl-4', text: '<p>Have financial instruments containing both a liability and equity element disclosed: (a) exercise dates; (b) maturity/expiration; (c) conditions precedent; (d) other terms?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ofl-5', text: '<p>Have we ensured that any of the entity\'s own securities purchased and not yet cancelled are properly disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-equity',
      title: 'Equity — Corporate',
      questions: [
        { id: 'q-aspe-eq-1', text: '<p>Do the financial statements disclose issued share capital (number and amount for each class of shares)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-eq-2', text: '<p>Has contributed surplus been properly disclosed (surplus cannot be set up or increased by charges made in arriving at net income)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-eq-3', text: '<p>Have changes in reserves for the period been presented separately?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-eq-4', text: '<p>Have capital transactions been excluded from the determination of net income and shown separately?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-eq-5', text: '<p>Have changes in equity been separately presented: (a) net income; (b) other changes in retained earnings; (c) contributed surplus; (d) share capital; (e) reserves; (f) other?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-eq-6', text: '<p>Have the components of equity been separately presented: (a) retained earnings; (b) contributed surplus; (c) share capital; (d) reserves; (e) exchange gains/losses; (f) non-controlling interests; (g) other?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-eq-7', text: '<p>Has the entity disclosed for retractable or mandatorily redeemable shares in tax planning arrangements classified as equity: (a) total redemption amount; (b) aggregate redemption by class; (c) description of arrangement?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-eq-8', text: '<p>Has disclosure been made of: (a) elimination of deficit by reduction of share capital; (b) conditions restricting distribution; (c) share purchase loan receivables; (d) statutory designations?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-revenue',
      title: 'Revenue',
      questions: [
        { id: 'q-aspe-rev-1', text: '<p>Has the entity disclosed its revenue recognition policy for all revenue streams, including non-monetary sales and multiple element sales transactions?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-rev-2', text: '<p>Do the financial statements disclose separately the major categories of revenue recognized during the period?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-income',
      title: 'Income Statement',
      questions: [
        { id: 'q-aspe-is-1', text: '<p>Have required items been presented on the face of the income statement: revenue, investment income, income tax expense, discontinued operations, net income, and attribution to parent/non-controlling interests?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-is-2', text: '<p>Have required items been presented on the face of the income statement or disclosed in the notes (major categories of revenue, amortization, impairment losses, compensation costs, exchange gains/losses, interest income/expense, etc.)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-bs',
      title: 'Balance Sheet',
      questions: [
        { id: 'q-aspe-bs-1', text: '<p>Does the balance sheet distinguish between: current assets, long-term assets, total assets, current liabilities, long-term liabilities, total liabilities, equity, and total liabilities and equity?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bs-2', text: '<p>Have required assets been separately presented on the face of the balance sheet (cash, receivables, prepaid expenses, inventories, investments, intangible assets)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bs-3', text: '<p>Have additional assets been disclosed in the notes or supporting schedules (government assistance receivable, PP&E, assets under capital leases, defined benefit assets)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bs-4', text: '<p>Do current assets include only those ordinarily realizable within one year or the normal operating cycle?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bs-5', text: '<p>Have cash subject to restrictions and future income tax assets been excluded from current assets?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bs-6', text: '<p>Have required liabilities been separately presented on the face of the balance sheet (bank indebtedness, accounts payable, current portion of long-term debt, dividends payable, etc.)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bs-7', text: '<p>Have additional liabilities been disclosed in the notes (obligations under capital leases, defined benefit liabilities, asset retirement obligations, other)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-bs-8', text: '<p>Have liabilities been segregated into current and long-term where current includes only amounts payable within one year or the normal operating cycle?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-cf',
      title: 'Cash Flow Statement',
      questions: [
        { id: 'q-aspe-cf-1', text: '<p>Has a cash flow statement been presented for each period for which financial statements are prepared?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-cf-2', text: '<p>Have cash flows been classified by operating, investing and financing activities with proper presentation of interest, dividends, and business combinations?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-cf-3', text: '<p>Has the following been disclosed for business combinations and disposals: (1) total consideration; (2) portion in cash; (3) cash acquired/disposed; (4) total assets and liabilities?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-cf-4', text: '<p>Have the components of cash and cash equivalents been disclosed, including reconciliation to the balance sheet?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-cf-5', text: '<p>Has the effect of exchange rate changes on cash denominated in foreign currency been presented separately?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-cf-6', text: '<p>Have non-cash transactions been disclosed with: (1) nature; (2) basis of measurement; (3) amount; (4) related gains or losses?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'aspe-general-disclosure',
    title: 'ASPE - General - Disclosure Checklist',
    objective: `This checklist covers ASPE general disclosure requirements including:
• General Financial Statement Presentation
• Financial Instruments
• Related-Party Transactions
• Measurement Uncertainty
• Cash and Cash Equivalents
• Accounts Receivable
• Inventories
• Property, Plant and Equipment
• Bank Indebtedness and Debt
• Equity
• Revenue and Income Statement
• Balance Sheet
• Cash Flow Statement`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// ASPE - Income Taxes - Disclosure Checklist
export const generateASPEIncomeTaxesDisclosureChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-aspe-it-general',
      title: 'General Information',
      questions: [
        { id: 'q-aspe-it-gen-1', text: '<p>Ensure entity has disclosed an accounting policy choice to account for income taxes using either the income taxes payable method or the future income taxes payable method.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-it-specific',
      title: 'Specific Circumstances',
      questions: [
        { id: 'q-aspe-it-sc-1', text: '<p>Has income tax expense included in the determination of net income or loss before discontinued operations been presented on the face of the income statement?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-it-payable',
      title: 'Income Taxes Payable Method',
      questions: [
        {
          id: 'q-aspe-it-pay-1',
          text: '<p>When an enterprise applies the taxes payable method of accounting for income taxes, do the financial statements disclose:</p>',
          answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-it-pay-1a', text: '<p>A reconciliation of the income tax rate or expense related to income or loss for the period before discontinued operations to the statutory income tax rate or dollar amount?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-it-pay-1b', text: '<p>The amount of unused income tax losses carried forward and unused income tax credits?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-it-pay-1c', text: '<p>The portion of income tax expense (benefit) related to transactions charged (or credited) to equity?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-it-future',
      title: 'Future Income Taxes Payable Method',
      questions: [
        {
          id: 'q-aspe-it-fut-1',
          text: '<p>When an enterprise applies the future income taxes method, do the financial statements disclose:</p>',
          answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-it-fut-1a', text: '<p>The future income tax expense (benefit) included in the determination of income or loss before discontinued operations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-it-fut-1b', text: '<p>The portion of the cost (benefit) of current and future income taxes related to capital transactions or other items that are charged or credited to equity.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-it-fut-1c', text: '<p>The total amount of unused tax losses and income tax reductions, and the amount of deductible temporary differences, for which no future income tax asset has been recognized.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-it-fut-1d', text: '<p>In respect of each type of temporary difference for each period presented.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-it-assets-liab',
      title: 'Income Tax Assets and Liabilities',
      questions: [
        { id: 'q-aspe-it-al-1', text: '<p>Have future income tax assets and future income tax liabilities been classified as non-current when an enterprise segregates assets and liabilities between current and non-current?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-it-al-2', text: '<p>Have current income tax liabilities and current income tax assets been presented separately from future income tax liabilities and future income tax assets?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-it-al-3', text: '<p>Have current income tax liabilities and current income tax assets, as well as future income tax liabilities and future income tax assets, been offset only when they relate to the same taxable entity and the same taxation authority?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-it-al-4', text: '<p>When entities in a group are taxed separately by the same taxation authority, has the future income tax asset recognized by one entity been offset against a future income tax liability of another entity only when tax planning strategies could be implemented?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-it-al-5', text: '<p>Has the net charge or recovery of refundable dividend taxes been disclosed separately?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'aspe-income-taxes-disclosure',
    title: 'ASPE - Income Taxes - Disclosure Checklist',
    objective: `This checklist covers ASPE income taxes disclosure requirements including:\n• General Information\n• Income Taxes Payable Method\n• Future Income Taxes Payable Method\n• Income Tax Assets and Liabilities`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// ASPE - Leases - Disclosure Checklist
export const generateASPELeasesDisclosureChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-aspe-lease-obj',
      title: 'Objective',
      questions: [
        { id: 'q-aspe-lease-obj-1', text: '<p>Have all significant leases that transfer substantially all of the benefits and risks of ownership related to the leased property from the lessor to the lessee been accounted for as a capital lease by the lessee and as a sales-type or direct financing lease by the lessor?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-lease-cap-lessee',
      title: 'Capital Leases — Lessee',
      questions: [
        { id: 'q-aspe-lease-cl-1', text: '<p>Have assets leased under capital leases been presented separately from other assets?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-lease-cl-2', text: '<p>Has the following been disclosed for each major category of leased property, plant and equipment: (a) Cost; (b) Accumulated amortization; (c) The amortization method used, including the amortization period or rate?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-lease-cl-3', text: '<p>For obligations under a capital lease: (a) Obligations presented separately from other long-term obligations; (b) Interest expense related to lease obligations presented separately?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-lease-cl-4', text: '<p>Have the following been disclosed for obligations under a capital lease: (a) Details including interest rates, maturity dates, amounts outstanding and security; (b) Any portion payable within a year; (c) Aggregate payments estimated in each of the next five years?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-lease-cl-5', text: '<p>Where the liability under a capital lease was removed from the balance sheet, have the requirements under paragraph 3856.A49-A61 for extinguishment or discharge been met?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-lease-op-lessee',
      title: 'Operating Leases — Lessee',
      questions: [
        { id: 'q-aspe-lease-ol-1', text: '<p>Under operating leases with initial terms of greater than one year: (1) Disclosure of the future minimum lease payments, in the aggregate and for each of the next five years; (2) Disclosure of the nature of other commitments under operating leases?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-lease-df-lessor',
      title: 'Direct Financing Leases — Lessor',
      questions: [
        { id: 'q-aspe-lease-df-1', text: '<p>Have initial direct costs at the inception of the lease been expensed and has a portion of unearned income equal to initial direct costs been recognized as income?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        {
          id: 'q-aspe-lease-df-2', text: '<p>Has the following been disclosed:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-lease-df-2a', text: '<p>Net investment in the lease.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-df-2b', text: '<p>Interest rate implicit in the lease.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-df-2c', text: '<p>Net investment segregated between current and long-term portions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-df-2d', text: '<p>Total minimum lease payments receivable by year less unearned income and executory costs.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-df-2e', text: '<p>Accounting policy note that finance income is recognized at a constant rate of return.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-df-2f', text: '<p>Carrying amount of impaired lease and amount of any related allowance for impairment.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-aspe-lease-df-3', text: '<p>Where income tax factors have been taken into consideration, has the net investment been adjusted for investment tax credit and future income taxes?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-lease-st-lessor',
      title: 'Sales-Type Leases — Lessor',
      questions: [
        { id: 'q-aspe-lease-st-1', text: '<p>Have initial direct costs at the inception of the lease been expensed and has the manufacturer\'s or dealer\'s profit or loss on the sale been recognized at the time of the transaction?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        {
          id: 'q-aspe-lease-st-2', text: '<p>Has the following been disclosed:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-lease-st-2a', text: '<p>Net investment in the lease.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-st-2b', text: '<p>Net investment segregated between current and long-term portions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-st-2c', text: '<p>Total minimum lease payments receivable by year less unearned income.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-st-2d', text: '<p>Accounting policy note that finance income is recognized at a constant rate of return.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-st-2e', text: '<p>Allowance for impairment.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-aspe-lease-st-3', text: '<p>Where income tax factors have been taken into consideration, has the net investment been adjusted for investment tax credit and future income taxes?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-lease-st-4', text: '<p>Has the lease been reclassified to a direct financing lease?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-lease-op-lessor',
      title: 'Operating Leases — Lessor',
      questions: [
        {
          id: 'q-aspe-lease-opl-1', text: '<p>Has the following been disclosed:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-lease-opl-1a', text: '<p>The cost of property, plant and equipment held for leasing purposes and the amount of accumulated amortization.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-opl-1b', text: '<p>Initial direct costs recognized as an asset and amortized over the lease term in proportion to rental income.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-lease-opl-1c', text: '<p>Determination of net income over the lease term on a straight-line basis or another systematic and rational basis.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-aspe-lease-opl-2', text: '<p>Has rental income been disclosed separately from operating lease income?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-lease-opl-3', text: '<p>If at the end of a reporting period there is an impairment in the operating lease receivable, has the entity disclosed the amount of any related allowance for impairment and the amount of any impairment loss or reversal?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-lease-third',
      title: 'Participation by a Third Party — Lessor',
      questions: [
        { id: 'q-aspe-lease-tp-1', text: '<p>Where the entity has assigned payments due under an operating lease to a third party: (a) Have the assigned payments been accounted for as a loan; (b) Have payments made by the lessee been recorded as revenue; (c) Has interest expense been recorded for an appropriate portion of the rent payment?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'aspe-leases-disclosure',
    title: 'ASPE - Leases - Disclosure Checklist',
    objective: `This checklist covers ASPE leases disclosure requirements including:\n• Capital Leases — Lessee\n• Operating Leases — Lessee\n• Direct Financing Leases — Lessor\n• Sales-Type Leases — Lessor\n• Operating Leases — Lessor`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// ASPE - Goodwill and Intangible Assets - Disclosure Checklist
export const generateASPEGoodwillIntangiblesDisclosureChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-aspe-gi-general',
      title: 'General',
      questions: [
        { id: 'q-aspe-gi-1', text: '<p>Do the financial statements disclose the basis of accounting for internally-generated intangible assets?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-gi-2', text: '<p>Have the aggregate amounts of goodwill and intangible assets been presented as separate line items on the balance sheet?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-gi-amortized',
      title: 'Intangible Assets Subject to Amortization',
      questions: [
        { id: 'q-aspe-gi-am-1', text: '<p>For intangible assets subject to amortization, do the financial statements disclose: (a) The net carrying amount in total and by major class; (b) The aggregate amortization expense for the period; (c) The amortization method used, including the amortization period or rate?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-gi-not-amortized',
      title: 'Intangible Assets Not Subject to Amortization',
      questions: [
        { id: 'q-aspe-gi-na-1', text: '<p>For intangible assets not subject to amortization, do the financial statements disclose the carrying amount: (a) In total; (b) By major intangible assets?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-gi-goodwill-impairment',
      title: 'Goodwill Impairment',
      questions: [
        { id: 'q-aspe-gi-gwi-1', text: '<p>For each goodwill impairment loss recognized, do the financial statements disclose: (a) A description of the facts and circumstances leading to the impairment; (b) The amount of the impairment loss presented as a separate line on the income statement?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-gi-intangible-impairment',
      title: 'Intangible Asset Impairment',
      questions: [
        { id: 'q-aspe-gi-iai-1', text: '<p>For each impairment loss recognized related to an intangible asset, do the financial statements disclose: (a) A description of the facts and circumstances leading to the impairment; (b) The amount of the impairment loss; (c) The caption in the income statement in which the impairment loss is included?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'aspe-goodwill-intangibles-disclosure',
    title: 'ASPE - Goodwill and Intangible Assets - Disclosure Checklist',
    objective: `This checklist covers ASPE goodwill and intangible assets disclosure requirements including:\n• Internally-generated intangible assets\n• Intangible assets subject to and not subject to amortization\n• Goodwill and intangible asset impairment`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// ASPE - Employee Future Benefits - Disclosure Checklist
export const generateASPEEmployeeFutureBenefitsDisclosureChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-aspe-efb-dc',
      title: 'A — Defined Contribution Plans',
      questions: [
        { id: 'q-aspe-efb-dc-1', text: '<p>Has the entity disclosed a description of the nature of each plan including its types of benefits, and the cost recognized for the period?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-efb-me',
      title: 'B — Multi-Employer Plans',
      questions: [
        {
          id: 'q-aspe-efb-me-1', text: '<p>Do the notes to the financial statements disclose a general description of the plan, which includes:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-efb-me-1a', text: '<p>Whether it is a pension plan or other than a pension plan.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-me-1b', text: '<p>Whether the plan is a defined contribution plan or a defined benefit plan.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'q-aspe-efb-me-2', text: '<p>If the plan is a multi-employer defined benefit plan but sufficient information is not available to use defined benefit plan accounting, have the financial statements disclosed:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-efb-me-2a', text: '<p>The fact that the plan is a defined benefit plan.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-me-2b', text: '<p>The reason why it is being accounted for as a defined contribution plan.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-me-2c', text: '<p>Any available information about the plan\'s surplus or deficit.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-me-2d', text: '<p>The nature and effect of significant changes in the contractual elements of the plan.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-efb-db',
      title: 'C — Defined Benefit Plans',
      questions: [
        {
          id: 'q-aspe-efb-db-1', text: '<p>Have the financial statements disclosed:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-efb-db-1a', text: '<p>A general description of the plan.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-db-1b', text: '<p>Whether the plan is a pension plan or other than a pension plan.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-db-1c', text: '<p>That the plan is a defined benefit plan.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-db-1d', text: '<p>The benefit obligation at the end of the period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-db-1e', text: '<p>The fair value of plan assets at the end of the period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-db-1f', text: '<p>The plan surplus or deficit at the end of the period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-db-1g', text: '<p>An explanation of any differences between the amount recognized in the balance sheet and the plan surplus or deficit (valuation allowance).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-db-1h', text: '<p>The effective date of the most recent actuarial valuation used in determining the obligation.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-db-1i', text: '<p>The nature and effect of significant changes in the contractual elements of the plans during the period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-db-1j', text: '<p>Whether the accrued benefit obligation is measured using a funding valuation or an accounting valuation.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-efb-db-1k', text: '<p>The amount of remeasurements and other items for the period if not presented separately on the face of the income statement.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-efb-tb',
      title: 'D — Termination Benefits',
      questions: [
        { id: 'q-aspe-efb-tb-1', text: '<p>Do the financial statements disclose the nature and effect of any termination benefits provided in the period if not presented on the face of the income statement?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'aspe-employee-future-benefits-disclosure',
    title: 'ASPE - Employee Future Benefits - Disclosure Checklist',
    objective: `This checklist covers ASPE employee future benefits disclosure requirements including:\n• Defined Contribution Plans\n• Multi-Employer Plans\n• Defined Benefit Plans\n• Termination Benefits`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// ASPE - Agriculture - Disclosure Checklist
export const generateASPEAgricultureDisclosureChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-aspe-ag-inv',
      title: 'Agricultural Inventories',
      questions: [
        { id: 'q-aspe-ag-inv-1', text: '<p>Have the amounts of agricultural inventories been presented as a separate line item on the balance sheet?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        {
          id: 'q-aspe-ag-inv-2', text: '<p>Do the financial statements disclose for each major category of agricultural inventories:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-ag-inv-2a', text: '<p>A qualitative description of each major category.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-ag-inv-2b', text: '<p>The quantities held, when readily determinable.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-ag-inv-2c', text: '<p>The accounting policies adopted for measuring agricultural inventories.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-ag-inv-2d', text: '<p>The total carrying amount for each major category.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-aspe-ag-inv-3', text: '<p>When the cost model is being used, do the financial statements also disclose: (a) Accounting policies adopted for measuring costs; (b) The cost formula used?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ag-inv-4', text: '<p>When the cost of agricultural inventories is determined using only input costs, has this been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ag-inv-5', text: '<p>When the net realizable value model is used, do the financial statements disclose: (a) A description of the methodology used to determine net realizable value; (b) Changes in the carrying amount and, if not separately presented, the caption in the income statement?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ag-inv-6', text: '<p>Has the amount of agricultural inventories recognized as an expense during the period been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ag-inv-7', text: '<p>Where there are pledges and encumbrances in inventory, has the carrying amount of inventory pledged as security for liabilities been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-ag-bio',
      title: 'Productive Biological Assets',
      questions: [
        { id: 'q-aspe-ag-bio-1', text: '<p>Have the amounts of productive biological assets been presented as a separate line item on the balance sheet?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        {
          id: 'q-aspe-ag-bio-2', text: '<p>Do the financial statements disclose for each major category of productive biological assets:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-ag-bio-2a', text: '<p>A qualitative description.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-ag-bio-2b', text: '<p>The quantities held, when readily determinable.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-ag-bio-2c', text: '<p>For each major category being amortized: cost, accumulated amortization, method, amount charged to income.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-ag-bio-2d', text: '<p>For each major category not being amortized, the carrying amount.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-aspe-ag-bio-3', text: '<p>Where there has been a sale or disposal of a productive biological asset, has disclosure been made of the aggregate of gains and losses recognized and, if not separately presented, the caption in the income statement?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ag-bio-4', text: '<p>Where an impairment loss has been recognized during the period, has the entity disclosed: (a) A description of the facts and circumstances leading to the impairment; (b) The amount of the impairment loss and the caption in the income statement?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-ag-bio-5', text: '<p>Where there are pledges of, or encumbrances on, productive biological assets, has the carrying amount of assets pledged as security for liabilities been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'aspe-agriculture-disclosure',
    title: 'ASPE - Agriculture - Disclosure Checklist',
    objective: `This checklist covers ASPE agriculture disclosure requirements including:\n• Agricultural Inventories\n• Productive Biological Assets`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// ASPE - Supplementary - Disclosure Checklist
export const generateASPESupplementaryDisclosureChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-aspe-supp-ac',
      title: 'Accounting Changes',
      questions: [
        {
          id: 'q-aspe-supp-ac-1', text: '<p>For the current period, has the entity disclosed for a change in accounting policy required by a primary source of GAAP:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-supp-ac-1a', text: '<p>Title of the primary source of GAAP.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ac-1b', text: '<p>Its transitional provisions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ac-1c', text: '<p>The nature of the change in accounting policy.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ac-1d', text: '<p>A description of the transitional provisions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ac-1e', text: '<p>The amount of the adjustment for each financial statement line item affected for the prior period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ac-1f', text: '<p>The amount of the adjustment relating to periods before those presented.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ac-1g', text: '<p>How and from when the change has been applied.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'q-aspe-supp-ac-2', text: '<p>Where a voluntary change in accounting policy was made, has the entity disclosed:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-supp-ac-2a', text: '<p>Nature of the change.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ac-2b', text: '<p>Relevant information or explanation of why the entity made the choice.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ac-2c', text: '<p>The amount of the adjustment for each line item affected for prior periods.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ac-2d', text: '<p>The amount relating to periods before those presented.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ac-2e', text: '<p>If retrospective application is impracticable, the circumstances and a description of how and from when the change has been applied.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-aspe-supp-ac-3', text: '<p>Has the entity made a change in an accounting estimate that has an effect on the current period? If so, has the entity disclosed the nature and amount of the change?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-supp-ac-4', text: '<p>Has a prior period error been corrected retrospectively with restatement, and disclosure of: (a) Nature of the prior period error; (b) The amount of the correction at the beginning of the earliest period presented?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-supp-unincorp',
      title: 'Unincorporated Businesses/Partnerships',
      questions: [
        {
          id: 'q-aspe-supp-ui-1', text: '<p>Do the financial statements clearly disclose:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-supp-ui-1a', text: '<p>Name under which business is conducted.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ui-1b', text: '<p>That the business is unincorporated and the financial statements do not include all assets, liabilities, revenues and expenses of the owners.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ui-1c', text: '<p>That the business is not subject to income taxes because its income is taxed directly to its owners.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ui-1d', text: '<p>Any salaries, interest or similar items accruing to the owners.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-ui-1e', text: '<p>Statement of changes in equity showing contributions, income/losses, and withdrawals.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-supp-aro',
      title: 'Asset Retirement Obligations',
      questions: [
        {
          id: 'q-aspe-supp-aro-1', text: '<p>Where an entity has asset retirement obligations, have the following been disclosed:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-supp-aro-1a', text: '<p>General description of the asset retirement obligations and associated long-lived assets.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-aro-1b', text: '<p>Amount of the obligation at the end of the period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-aro-1c', text: '<p>Total amount paid towards the liability during the period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-aro-1d', text: '<p>Fair value or carrying amount of assets legally restricted for settling the obligations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-aro-1e', text: '<p>Where a reasonable estimate cannot be made, has that fact and the reasons been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-supp-cog',
      title: 'Contractual Obligations and Guarantees',
      questions: [
        {
          id: 'q-aspe-supp-cog-1', text: '<p>Do the financial statements disclose contractual obligations significant in relation to the current financial position or future operations:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-supp-cog-1a', text: '<p>Commitments involving a high degree of speculative risk.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-cog-1b', text: '<p>Commitments abnormal in relation to the financial position or usual business operations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-cog-1c', text: '<p>Contractual obligations involving related parties disclosed per Section 3840.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'q-aspe-supp-cog-2', text: '<p>For guarantees, has the entity disclosed:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-aspe-supp-cog-2a', text: '<p>The nature of the guarantee.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-cog-2b', text: '<p>The maximum potential amount of future payments (undiscounted).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-cog-2c', text: '<p>The current carrying amount of the liability.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-cog-2d', text: '<p>The nature of any recourse provisions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-aspe-supp-cog-2e', text: '<p>The nature of any assets held as collateral by third parties.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-supp-cont',
      title: 'Contingent Gains or Losses',
      questions: [
        { id: 'q-aspe-supp-cont-1', text: '<p>Where a contingent loss exists, has the entity disclosed: the nature of the contingency; an estimate of the amount or statement that an estimate cannot be made; and any exposure to loss in excess of the amount accrued?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-supp-cont-2', text: '<p>When it is likely a future event will confirm that an asset had been acquired (or a liability reduced), has the entity disclosed the existence of a contingent gain including nature and estimate?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-supp-discop',
      title: 'Discontinued Operations',
      questions: [
        { id: 'q-aspe-supp-discop-1', text: '<p>For long-lived assets classified as held for sale, has disclosure been made of: (a) Description of facts and circumstances; (b) Expected manner and timing of disposal; (c) Gain or loss recognized; (d) Revenue and pre-tax profit or loss in discontinued operations?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-supp-discop-2', text: '<p>In the period sold or classified as held for sale, has the entity disclosed: (a) Description of facts and circumstances; (b) Gain or loss; (c) Revenue and pre-tax profit or loss?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-supp-discop-3', text: '<p>Have the results of discontinued operations, less applicable income taxes, been presented separately?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-supp-discop-4', text: '<p>Has the entity presented long-lived assets classified as held for sale separately in the balance sheet?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aspe-supp-discop-5', text: '<p>Has the entity presented assets and liabilities of a disposal group classified as held for sale separately in the asset and liability sections of the balance sheet?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-supp-gov',
      title: 'Government Assistance',
      questions: [
        { id: 'q-aspe-supp-gov-1', text: '<p>For assistance received or receivable during the period, has appropriate disclosure been made?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-supp-subseq',
      title: 'Subsequent Events',
      questions: [
        { id: 'q-aspe-supp-subseq-1', text: '<p>Have events occurring between the date of the financial statements and the date of their completion that do not require adjustment been disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-aspe-supp-nm',
      title: 'Non-Monetary Transactions',
      questions: [
        { id: 'q-aspe-supp-nm-1', text: '<p>Where a non-monetary transaction has occurred, has the entity disclosed: (1) The nature of the transaction; (2) The transaction\'s basis of measurement; (3) The amount; (4) Related gains and losses?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'aspe-supplementary-disclosure',
    title: 'ASPE - Supplementary - Disclosure Checklist',
    objective: `This checklist covers ASPE supplementary disclosure requirements including:\n• Accounting Changes\n• Unincorporated Businesses/Partnerships\n• Asset Retirement Obligations\n• Contractual Obligations and Guarantees\n• Contingent Gains or Losses\n• Discontinued Operations\n• Government Assistance\n• Subsequent Events\n• Non-Monetary Transactions`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Specific Circumstances checklist
export const generateSpecificCircumstancesChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-sc-related',
      title: 'Related Parties',
      questions: [
        { id: 'q-sc-rp-1', text: '<p>Have related-party transactions been identified and appropriately disclosed?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-sc-fraud',
      title: 'Fraud and Non-Compliance with Laws or Regulations',
      questions: [
        {
          id: 'q-sc-fraud-1', text: '<p>Where inconsistent or contradictory information has been obtained during the course of the review, or where there is an indication of fraud or non-compliance:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-sc-fraud-1a', text: '<p>Design and perform additional procedures as necessary to be able to conclude on the matter.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-fraud-1b', text: '<p>Request management to assess the effects, if any, on the financial statements.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-fraud-1c', text: '<p>Consider management\'s assessment and the effect it may have on the financial statements or the review engagement report.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-sc-gc',
      title: 'Going-Concern Uncertainties',
      questions: [
        {
          id: 'q-sc-gc-1', text: '<p>If events or conditions have come to your attention that may cast significant doubt regarding the entity\'s ability to continue as a going concern:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-sc-gc-1a', text: '<p>Inquire whether management has identified any material uncertainty.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-gc-1b', text: '<p>Inquire about management\'s plan of action.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-gc-1c', text: '<p>Assess the feasibility of such a plan.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-gc-1d', text: '<p>Whether management believes the outcome of the plan will resolve the situation.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-sc-gc-2', text: '<p>If management has not developed a plan, discuss the nature of the uncertainty and request that a plan of action be developed.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        {
          id: 'q-sc-gc-3', text: '<p>Evaluate management\'s response, and consider whether:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-sc-gc-3a', text: '<p>Appropriate disclosures have been made in the financial statements.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-gc-3b', text: '<p>An Emphasis of Matter paragraph is required in the review report.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-gc-3c', text: '<p>The going-concern assumption remains appropriate for preparing the financial statements.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-sc-others',
      title: 'Use of Work Performed by Others',
      questions: [
        {
          id: 'q-sc-others-1', text: '<p>When reliance has been placed on work performed by others in order to issue a review engagement conclusion:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-sc-others-1a', text: '<p>Assess and evaluate their competence, capabilities and objectivity.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-others-1b', text: '<p>Obtain an agreement outlining their respective roles and responsibilities.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-others-1c', text: '<p>Review the adequacy of their work, including relevance and reasonableness of assumptions, methods, findings and conclusions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-sc-commitments',
      title: 'Material Commitments, Contractual Obligations and Contingencies',
      questions: [
        { id: 'q-sc-commit-1', text: '<p>Inquire about the current status or resolution of legal matters, material commitments, contractual obligations and contingencies noted in the prior period\'s files.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        {
          id: 'q-sc-commit-2', text: '<p>Inquire about the existence of the following:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-sc-commit-2a', text: '<p>Pending litigation or litigation threats.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-commit-2b', text: '<p>Covenants and conditions on borrowings, including contingencies for repayment of government assistance.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-commit-2c', text: '<p>Material forward-purchase contracts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-commit-2d', text: '<p>Material capital expenditures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-commit-2e', text: '<p>Performance guarantees or warranties on sales.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-commit-2f', text: '<p>Any obligation to re-purchase goods sold.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-commit-2g', text: '<p>Leases (other than those capitalized) for premises, vehicles and equipment.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-commit-2h', text: '<p>Income or other taxes in dispute.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-sc-commit-2i', text: '<p>Possible liabilities through guarantees of others or through joint ventures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-sc-commit-3', text: '<p>Consider whether: (1) Other undisclosed contingencies or commitments exist; (2) Any contingency identified is already a liability (and accrued where the amount can be estimated). Determine whether material commitments, contractual obligations and contingencies have been appropriately recorded, presented and disclosed.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-sc-journal',
      title: 'Use of Journal Entries — Analysis',
      questions: [
        { id: 'q-sc-journal-1', text: '<p>Consider whether: (1) Prior period adjusting entries have been properly recorded in the opening balances; (2) All standard journal entries (e.g., month-end accruals, amortization) and non-routine journal entries have a valid rationale and appropriate support.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-sc-records',
      title: 'Underlying Records',
      questions: [
        { id: 'q-sc-records-1', text: '<p>Obtain evidence that the final financial statements agree with, or reconcile to, the entity\'s underlying accounting records.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'specific-circumstances',
    title: 'Specific Circumstances',
    objective: `This checklist covers specific circumstances including:\n• Related Parties\n• Fraud and Non-Compliance\n• Going-Concern Uncertainties\n• Use of Work Performed by Others\n• Material Commitments, Contractual Obligations and Contingencies\n• Journal Entries Analysis\n• Underlying Records`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Worksheet - Going Concern
export const generateWorksheetGoingConcernChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-wgc-identification',
      title: 'Identification of Adverse Events and Conditions',
      questions: [
        {
          id: 'q-wgc-id-1', text: '<p><strong>Financing/cash flow challenges:</strong></p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-wgc-id-1a', text: '<p>Insufficient equity or working capital / net current liability position.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-id-1b', text: '<p>Inability to obtain or refinance borrowings.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-id-1c', text: '<p>Indications of withdrawal of financial support by creditors or owners.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-id-1d', text: '<p>Negative operating cash flows indicated in historical or prospective statements.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-id-1e', text: '<p>Inability to comply with the terms of loan agreements.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'q-wgc-id-2', text: '<p><strong>Adverse market conditions, trends or events:</strong></p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-wgc-id-2a', text: '<p>Management intentions to liquidate the entity or to cease operations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-id-2b', text: '<p>Loss of key management or employees without replacement.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-id-2c', text: '<p>Loss of a major market, key customer(s), franchise license or principal supplier(s).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-id-2d', text: '<p>Emergence of a highly successful competitor.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-id-2e', text: '<p>Sustaining the ability to generate cash flows.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        { id: 'q-wgc-id-3', text: '<p><strong>Regulatory or legal challenges.</strong></p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-wgc-id-4', text: '<p>If adverse events and conditions are identified, inquire of management about their impact on future operations. Document the response.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-wgc-assess',
      title: 'Assess Management\'s Response',
      questions: [
        { id: 'q-wgc-assess-1', text: '<p>Determine whether a management action plan is necessary to provide a detailed response to the concerns identified. If a management plan is considered necessary, request that management prepare.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-wgc-plan',
      title: 'Assessment of Management\'s Plan of Action',
      questions: [
        {
          id: 'q-wgc-plan-1', text: '<p><strong>1. Management\'s plans to dispose of assets:</strong></p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-wgc-plan-1a', text: '<p>Ensure there are no restrictions on the entity\'s ability to sell the assets.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-plan-1b', text: '<p>Assess effect of planned disposal on the entity\'s remaining operations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-plan-1c', text: '<p>Review any cash flow reports or forecasts that are available.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'q-wgc-plan-2', text: '<p><strong>2. Management plans to borrow money or restructure debt:</strong></p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-wgc-plan-2a', text: '<p>Assess availability of debt financing and capacity to borrow.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-plan-2b', text: '<p>Assess whether entity has sufficient collateral to obtain new financing.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-plan-2c', text: '<p>Assess the impact of new financing, the interest payable and repayment terms on operations and cash flows.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'q-wgc-plan-3', text: '<p><strong>3. Management plans to reduce or delay expenditures:</strong></p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-wgc-plan-3a', text: '<p>Review the feasibility of the proposed cost reductions or delayed expenditures and any additional costs involved.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-plan-3b', text: '<p>Assess the impact that reducing or delaying expenditures will have on ongoing operations and cash flows.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'q-wgc-plan-4', text: '<p><strong>4. Management plans to obtain additional or new capital contributions:</strong></p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-wgc-plan-4a', text: '<p>Review the likelihood of obtaining new financing within the time frames required and whether the amount will be sufficient.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-plan-4b', text: '<p>Assess the effect of the plan on existing shareholders.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        },
        {
          id: 'q-wgc-plan-5', text: '<p><strong>5. Where management has prepared an action plan (such as a cash flow or earnings forecast):</strong></p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-wgc-plan-5a', text: '<p>Ensure the information is consistent with other information known about the entity.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-plan-5b', text: '<p>Assess industry and market conditions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wgc-plan-5c', text: '<p>Compare amounts to prior periods and assess the reasonableness of management\'s forecast.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-wgc-conclusion',
      title: 'Conclusion',
      questions: [
        { id: 'q-wgc-concl-1', text: '<p>Based on the results of the above procedures, assess whether management\'s action plan is feasible and provides mitigation in relation to the adverse events and conditions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-wgc-concl-2', text: '<p>Consider obtaining written representations from management regarding their plans and actions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-wgc-disclosure',
      title: 'Financial Statement Presentation and Disclosure',
      questions: [
        { id: 'q-wgc-disc-1', text: '<p>Ensure adequate disclosure is made about going-concern issues. If not, modify the review engagement report.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-wgc-disc-2', text: '<p>Complete the relevant section(s) of the applicable financial disclosure forms (the FRF 900 series of forms).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'worksheet-going-concern',
    title: 'Worksheet - Going Concern',
    objective: `This worksheet covers going concern assessment including:\n• Identification of Adverse Events and Conditions\n• Assessment of Management's Response\n• Assessment of Management's Plan of Action\n• Financial Statement Presentation and Disclosure`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Worksheet - Accounting Estimates (Including Fair Values)
export const generateWorksheetAccountingEstimatesChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-wae-identification',
      title: 'Identification',
      questions: [
        { id: 'q-wae-id-1', text: '<p>Review the financial statements, and make inquiries about the existence, need and nature of accounting estimates.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-wae-preparation',
      title: 'Estimate Preparation',
      questions: [
        {
          id: 'q-wae-prep-1', text: '<p>Inquire about management\'s policies and procedures for preparing significant accounting estimates and FVM. Consider how:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-wae-prep-1a', text: '<p>Management identifies where estimates or FVM are required.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wae-prep-1b', text: '<p>The appropriate data is gathered and evaluated.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wae-prep-1c', text: '<p>Specialists or valuation experts are used.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wae-prep-1d', text: '<p>Assumptions and estimates are developed.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wae-prep-1e', text: '<p>Calculations are reviewed and approved.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wae-prep-1f', text: '<p>Management ensures estimates or FVM are reasonable and consistent with management\'s intentions or business plans.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wae-prep-1g', text: '<p>Management ensures disclosures are adequate.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-wae-completeness',
      title: 'Completeness',
      questions: [
        {
          id: 'q-wae-comp-1', text: '<p>Using your understanding of the entity, the results of inquiries made and your previous experience, consider whether:</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '',
          subQuestions: [
            { id: 'q-wae-comp-1a', text: '<p>Assumptions used are reasonable.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wae-comp-1b', text: '<p>Assumptions used are consistent with management\'s intentions or business plans.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wae-comp-1c', text: '<p>Methods used have been applied consistently.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wae-comp-1d', text: '<p>Previous estimates were reasonable when compared to actual results.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
            { id: 'q-wae-comp-1e', text: '<p>Calculations are arithmetically accurate.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-wae-bias',
      title: 'Bias',
      questions: [
        { id: 'q-wae-bias-1', text: '<p>Consider the possibility that management biases may exist (e.g., to maximize profits or achieve a bonus threshold level).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-wae-subseq',
      title: 'Subsequent Events',
      questions: [
        { id: 'q-wae-subseq-1', text: '<p>Review subsequent events, and assess whether there is any impact on management\'s assumptions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    },
    {
      id: 'section-wae-disclosure',
      title: 'Presentation and Disclosure',
      questions: [
        { id: 'q-wae-disc-1', text: '<p>Complete the relevant section(s) of the applicable financial reporting disclosure forms (the FRF 900 series of forms) for each type of estimate or FVM (e.g., allowance for doubtful accounts, inventory obsolescence, asset retirement obligations, and goodwill and intangibles).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'worksheet-accounting-estimates',
    title: 'Worksheet - Accounting Estimates (Including Fair Values)',
    objective: `This worksheet covers accounting estimates assessment including:\n• Identification\n• Estimate Preparation\n• Completeness\n• Bias\n• Subsequent Events\n• Presentation and Disclosure`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const generateTaxCompletionChecklist = (): Checklist => {
  const s = (id: string, title: string, questions: Question[]) => ({ id, title, questions, isExpanded: true });
  const q = (id: string, text: string): Question => ({ id, text, answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '', subQuestions: [] });
  return {
    id: 'tax-completion',
    title: 'Completion',
    sections: [
      s('tc-s1', 'Knowledge of the Business', [
        q('tc-1-1', 'Has online authorization with CRA been obtained?'),
        q('tc-1-2', 'Have the financial statements been obtained and reviewed?'),
        q('tc-1-3', 'Is the corporation subject to the proposed mandatory reporting of uncertain tax treatments? If so, the filing for this is due on the corporation\'s filing due date.\n\nNote: The proposed mandatory reporting rules for reportable transactions and notifiable transactions (currently under consultation) are due 45 days after the transaction.'),
        q('tc-1-4', 'Has the nature of the operations been documented in the file?'),
        q('tc-1-5', 'If applicable, are transactions with related parties (e.g., associated, related and corporations owned by the shareholders) documented in the file?'),
      ]),
      s('tc-s2', 'Corporate Information Review', [
        q('tc-2-1', 'Is there an organization chart available for the corporation? If not, has one been created? If yes, has it been updated as needed?'),
        q('tc-2-2', 'Have there been any significant or unusual transactions in the year that impact the tax return (e.g., reorganization, acquisition of control, debt refinancing, issuance of shares)?'),
        q('tc-2-3', 'Have there been any changes to the following:\n• Products/services provided by the client?\n• Activities?\n• Industry changes that could impact the operations?'),
        q('tc-2-4', 'Corporate Identification – any of the following:\n• Requested year-end change?\n• Acquisition of control?\n• Amalgamation?\n• Change in Canadian-controlled private corporation (CCPC) status?\n• Dissolution?'),
        q('tc-2-5', 'Has the corporation\'s jurisdiction been confirmed? Obtain a copy of the articles of incorporation. Is the client aware of its obligations to file annual returns with the relevant jurisdictions?'),
        q('tc-2-6', 'Has there been a change to their address? If so, has CRA been notified?'),
        q('tc-2-7', 'Ensure that the NAICS code and description of the product/services of the business is accurate and up to date.'),
        q('tc-2-8', 'Has there been a change to the name and/or telephone number of the authorized signing officer? Did you confirm with the client that the listed person is authorized?'),
        q('tc-2-9', 'Have the reporting items required for the GIFI schedule been completed as accurately as possible (within reason)?'),
        q('tc-2-10', 'Special attention should be given to the following items on the financial statements:\n1. Assets: holdbacks, work in progress, due from shareholders, investments in partnerships/joint ventures, value of life insurance policies.\n2. Liabilities: bonus payable, deferred revenue.\n3. Income: investment income types, gains and losses, foreign exchange, income from partnerships/joint ventures, COVID-19 subsidies.\n4. Expenses: donations, meals and entertainment, non-deductible club dues and fees, depreciation/amortization, life insurance on executives, professional fees, bonuses, management fees.'),
        q('tc-2-11', 'Has the Notes Checklist (G141) been accurately completed?\n\nNote: G141 has been updated to allow for bookkeeping service that is not a compilation, review or audit engagement.'),
        q('tc-2-12', 'If there are notes to the financial statements, have they been included in the GIFI notes section?'),
      ]),
      s('tc-s3', 'Schedule 1 - Net Income for Tax Purposes', [
        q('tc-3-1', 'Review a copy of the financial statements, trial balance and/or GL detail to obtain a better understanding of the business as well as to identify any unusual transactions and significant year-over-year changes.'),
        q('tc-3-2', 'Consider if the corporation had any of the following non-deductible items that need to be adjusted for on Schedule 1:\n1. Non-deductible interest and penalties on taxes.\n2. Meals and entertainment (50%).\n3. Non-deductible club dues and fees.\n4. Most life insurance premiums.\n5. Charitable donations.\n6. Capital items that were expensed for accounting.\n7. Expenses related to contingent liabilities.\n8. Write-down of investments or other assets.\n9. Unpaid but accrued amounts – bonus not paid within 180 days or other unpaid amounts under Section 78.\n10. Non-deductible employee stock options.\n11. Non-deductible reserves.'),
        q('tc-3-3', 'Does the corporation have an interest in a partnership and/or joint venture? If so, has the income been added back or deducted?'),
        q('tc-3-4', 'Did the corporation have any foreign exchange gains or losses on income or expense? If so, consider:\na. Was it on account of income or capital?\nb. Was it realized or unrealized?'),
        q('tc-3-5', 'Did the corporation have any professional fees in the year? If so, consider deductibility:\na. Incorporation fees > $3,000.\nb. Expenses to acquire depreciable/capital property.\nc. Reorganization costs.\nd. Financing costs.'),
        q('tc-3-6', 'Did the corporation have any foreign taxes reported against their foreign income? If so, determine if an addback is required.'),
        q('tc-3-7', 'Did the corporation have any financing fees deductible pursuant to ITA 20(1)(e) (deductible over five years)?'),
        q('tc-3-8', 'Is the basis for inventory valuation acceptable for tax purposes?'),
        q('tc-3-9', 'Ensure mutual fund/ETF/REIT income distributions booked for accounting are adjusted for income tax purposes.'),
        q('tc-3-10', 'Did the client receive any COVID-19 financial relief? If yes, has it been accounted for properly?\na. CEBA – 25% forgivable of first $40,000, plus 50% forgivable of next $20,000.\nc. CEWS.\nd. THRP.\ne. HBRP.\n\nNote: CERS, CEWS, THRP and HBRP are included as taxable income immediately before the end of the qualifying period.'),
      ]),
      s('tc-s4', 'Schedule 2 - Charitable Donations', [
        q('tc-4-1', 'Did the corporation make charitable donations in the year?'),
        q('tc-4-2', 'Have the donations been made to "qualified donees"?'),
        q('tc-4-3', 'If this is a new client, confirm whether there are any donations carrying forward from prior years.'),
        q('tc-4-4', 'Were any of the donations gifts of public securities? If so, have they been disclosed separately on Schedule 6 with a nil capital gain?'),
      ]),
      s('tc-s5', 'Schedule 3 - Dividends', [
        q('tc-5-1', 'Did the corporation receive dividend income or pay dividends during the year?'),
        q('tc-5-2', 'Confirm dividends received are from Canadian corporations. Do not include dividends received from foreign non-affiliates on Schedule 3 (report on Schedule 7).'),
        q('tc-5-3', 'Confirm if dividends are from a connected corporation. If so, obtain:\na. Business number and taxation year.\nb. Total taxable dividends of the payor corporation.\nc. Dividend refund and which pool (ERDTOH, NERDTOH or both).'),
        q('tc-5-4', 'Were any of the dividends received eligible dividends?'),
        q('tc-5-5', 'Were any of the dividends received non-taxable under Section 83 (paid from a Capital Dividend Account)? If so, ensure properly reported on Schedule 3 and Schedule 89.'),
        q('tc-5-6', 'Of the dividends paid in the year, confirm if any were paid to connected corporations. If yes:\na. Obtain the business number and taxation year.\nb. Report the total amount and eligible dividend designation.'),
        q('tc-5-7', 'Were there any deemed dividends resulting from changes to the share structure, including redemption of shares? If so, ensure appropriately reported.'),
        q('tc-5-8', 'For dividends paid to individuals and trusts, does tax on split income (TOSI) apply?'),
        q('tc-5-9', 'Were there dividends paid out of the capital dividend account? If so, has Form T2054 been prepared and filed with CRA?'),
      ]),
      s('tc-s6', 'Schedule 4 - Corporation Loss Continuity and Application', [
        q('tc-6-1', 'Have the capital and non-capital losses carried forward from prior year been confirmed with CRA either online or through the prior year notice of assessment?'),
        q('tc-6-2', 'If applicable, have the non-capital and net capital losses in the year been carried back to a previous year?'),
        q('tc-6-3', 'If requesting a loss carryback, has the pre-adjusted taxable income or capital gains been confirmed? If the corporation earns investment income, consider the impact on prior dividend refunds.'),
        q('tc-6-4', 'Has there been a wind-up or amalgamation? If so, consider if the loss balances should be updated to include the transferred losses.'),
        q('tc-6-5', 'Was there any debt forgiveness in the current year? If so, consider if the grinding of loss balances is applicable.'),
      ]),
      s('tc-s7', 'Schedule 5 - Tax Calculation Supplementary', [
        q('tc-7-1', 'Does the corporation have a permanent establishment in more than one province?'),
        q('tc-7-2', 'Have the gross revenues and salaries been allocated appropriately between the provinces?'),
      ]),
      s('tc-s8', 'Schedule 6 - Dispositions of Capital Property', [
        q('tc-8-1', 'Was there a disposition of capital property in the year?'),
        q('tc-8-2', 'Confirm the adjusted cost base of the property if different from the accounting cost.'),
        q('tc-8-3', 'Were there any outlays and expenses as a result of the disposition?'),
        q('tc-8-4', 'Were there any dispositions of real estate? Ensure the outlays include mortgage break fees.'),
        q('tc-8-5', 'Are there any gains and losses as a result of realized foreign exchange on account of capital? If so, report them in Part 4.'),
        q('tc-8-6', 'Were there any capital gain distributions from mutual funds/ETFs? If so, include them on line 875.'),
        q('tc-8-7', 'Has it been indicated whether the disposition of capital property is a foreign source or passive source?'),
        q('tc-8-8', 'Ensure Schedule 89 is updated for capital gains and losses and other capital dividend amounts.'),
        q('tc-8-9', 'If there was a capital loss on a disposition to an affiliated person or on redemption of shares, have the stop-loss rules been considered?'),
        q('tc-8-10', 'Has a deemed disposition election been made pursuant to s. 50(1), if applicable?'),
        q('tc-8-11', 'For losses on debt, consider if such loss meets the definition of an allowable business investment loss. If so, report them in Part 7.'),
        q('tc-8-12', 'Is there any disposition related to deemed disposition designated under designation?'),
      ]),
      s('tc-s9', 'Schedule 7 - Aggregate Investment Income and Schedule 8 - CCA', [
        q('tc-9-1', 'Ensure the investment income (e.g., dividends, interest, capital gains and rent) and expenses are reported in Part 1, 2 and 3. Ensure interest income has been recorded under the accrual method.'),
        q('tc-9-2', 'Complete the specified partnership income section (Table 1 of Part 4).'),
        q('tc-9-3', 'If a member of the partnership is assigning the small business deduction to the company, complete Table 2 of Part 4.'),
        q('tc-9-4', 'Has the corporation earned foreign business income? If so, report the foreign net income on line 500 of Part 6.'),
        q('tc-9-5', 'If the specified corporate income rules apply to income earned by the corporation, has it been reported?'),
        q('tc-9-6', 'If this is a new client, ensure opening UCC balances agree to ending UCC balances from prior year return or through CRA online.'),
        q('tc-9-7', 'Has the corporation incurred any incorporation costs greater than $3,000 that should be added to Class 14.1?'),
        q('tc-9-8', 'Has the corporation received any government grants, subsidies, forgivable loans, leasehold inducements or similar payments that should be deducted from the UCC?'),
        q('tc-9-9', 'Has the corporation earned rental income from real property? If so, consider the restriction to CCA deductions unless the principal business activity is rental.'),
        q('tc-9-10', 'For acquisitions of depreciable property during the year, consider:\n1. Are all additions on Schedule 8 available for use?\n2. Has the capitalization policy been reviewed for tax purposes?\n3. Have leases recorded as capital leases been reviewed for tax treatment?\n4. Have all additions been added to pooled CCA classes?\n5. Have any passenger vehicles been acquired (Class 10.1)?\n6. Do the additions qualify for the accelerated investment incentive?\n7. Has UCC of non-arm\'s length transactions been adjusted?\n8. Have the new immediate expensing rules for CCPCs been considered?'),
        q('tc-9-11', 'Have proceeds been determined net of any outlays?'),
        q('tc-9-12', 'Have all disposals reported on the financial statements been reconciled to the T2?'),
        q('tc-9-13', 'Has the CCA class been reduced by the lower of cost or net proceeds? If net proceeds exceed cost, has a capital gain been reported on Schedule 6?'),
        q('tc-9-14', 'Is there an opportunity to defer tax on the recapture of CCA by electing to include property in a prescribed class (ITR 1103)?'),
        q('tc-9-15', 'Are any disposals eligible for a tax-deferred rollover, including s.85 elections?'),
        q('tc-9-16', 'For terminal losses on a disposition to an affiliated party, have the stop-loss rules been considered?'),
      ]),
      s('tc-s10', 'Schedule 9 - Related and Associated Corporations', [
        q('tc-10-1', 'Has the organization chart been reviewed to ensure that all related or associated corporations have been reported on Schedule 9?'),
        q('tc-10-2', 'For associated corporations, have we reported the current year and prior year amounts for:\na. Taxable capital?\nb. Adjusted aggregate investment income?\nc. Taxable income?\nd. Expenditure limit?\nf. Immediate expensing limit allocation on Schedule 8?'),
      ]),
      s('tc-s11', 'Schedule 13 - Continuity of Reserves', [
        q('tc-11-1', 'Have we identified and reported non-deductible reserves, including:\na. Warranty reserves?\nb. Reserve for doubtful accounts (general)?'),
        q('tc-11-2', 'Have we identified and reported tax-deductible reserves, including:\na. Capital gains reserve (ITA s. 40(1)(a)(ii))?\nb. Reserve for doubtful accounts (specific) (ITA s. 20(1)(l))?\nc. Reserve for undelivered goods and services (ITA s. 20(1)(m))?\nd. Reserve for unpaid amounts (ITA s. 20(1)(n))?'),
        q('tc-11-3', 'Ensure any opening amounts agree to the prior year ending amounts that are on file with CRA.'),
      ]),
      s('tc-s12', 'Schedule 21 - Federal Provincial Foreign Tax Credits', [
        q('tc-12-1', 'Ensure that we have properly classified the foreign tax credit as non-business (investment income) in Part 1 or business in Part 2.'),
        q('tc-12-2', 'Has the foreign tax credit been reported on a country-by-country basis?'),
        q('tc-12-3', 'Consider a deduction under 20(12) if the foreign tax credit cannot be claimed (i.e., loss position).'),
        q('tc-12-4', 'For business income tax paid, consider utilizing unused credits from a previous year or carrying back a credit to a prior year.'),
      ]),
      s('tc-s13', 'Schedule 23 - Allocation of the Small Business Deduction', [
        q('tc-13-1', 'Make sure we optimize the allocation of the small business deduction (SBD) between the corporate group. Allocate only what is needed by the reporting entity.'),
        q('tc-13-2', 'Make sure the allocation is consistently reported in all of the tax returns in the group.'),
        q('tc-13-3', 'If we have changed the allocation from a previously filed Schedule 23 in the group, check off the box to indicate that it is an amended agreement.'),
      ]),
      s('tc-s14', 'Schedule 33 - Calculation of Taxable Capital', [
        q('tc-14-1', 'Have all additions to taxable capital been reported with special attention to loans/advances, non-deductible reserves, future tax liabilities and the taxpayer\'s pro rata share of any partnership/co-tenancy capital?'),
        q('tc-14-2', 'Has the investment allowance been completed to include shares, bonds and loans in corporations (excluding mutual fund trusts, REITs and ETFs) and the taxpayer\'s pro rata share of any partnership/co-tenancy investment allowance?'),
      ]),
      s('tc-s15', 'Schedule 50 - Shareholder Information', [
        q('tc-15-1', 'Have we reviewed the shareholder register, the minute book and the organization chart, and noted any changes in shareholders? Have we included the tax account numbers (SIN, BN, trust) for all listed shareholders?'),
        q('tc-15-2', 'Have we determined whether changes in the shareholders could impact:\na. Change associated/related corporations reported in Schedule 23?\nb. Change in type of corporation (e.g., CCPC)?\nc. Acquisition of control?\nd. Changes to the share structure as a result of a redemption of shares and any potential deemed dividend on Schedule 3?'),
      ]),
      s('tc-s16', 'Schedule 53 - General Rate Income Pool (GRIP) Calculation', [
        q('tc-16-1', 'Has the GRIP balance carried forward from prior year been confirmed with CRA either online or through the prior year notice of assessment?'),
        q('tc-16-2', 'Were there any eligible dividends received? If so, ensure these have been included.'),
        q('tc-16-3', 'Have there been any wind-up or amalgamations? If so, consider if the GRIP balances should be updated. Consider whether completion of Parts 3 and 4 are applicable.'),
        q('tc-16-4', 'Review the available GRIP balance to ensure that no excessive eligible dividend was paid in the current year. Consider if excessive eligible dividend election is necessary.'),
        q('tc-16-5', 'Did the corporation become a CCPC this year? If so, complete Part 4.'),
        q('tc-16-6', 'Did the corporation cease to be a CCPC this year? If so, complete Schedule 54.'),
      ]),
      s('tc-s17', 'Small Business Deduction (SBD) Considerations', [
        q('tc-17-1', 'Was the corporation a Canadian-controlled private corporation (CCPC) throughout the taxation year? Consider the control issues in ITA 251(5).'),
        q('tc-17-2', 'Are there any associated corporations that have active business income? Consider:\n1. Has the prior year taxable capital been calculated? For tax years after April 6, 2022, the range has been extended to $10M to $50M.\n2. Has the prior year AAII been calculated?\n3. Is there an SBD limitation as a result of the taxable capital or AAII grind?'),
        q('tc-17-3', 'Was the corporation a designated member of a partnership?'),
        q('tc-17-4', 'Did the corporation earn income to which the specified corporate income rules would apply?'),
        q('tc-17-5', 'Did the corporation have more than one taxation year ending in the calendar year or a taxation year of less than 51 weeks?'),
        q('tc-17-6', 'If the corporation\'s principal purpose is to derive income from property (real estate rentals), did it have more than five full-time employees throughout the year?'),
        q('tc-17-7', 'Did the corporation earn rent or interest from an associated corporation carrying on an active business (deemed active rule)?'),
        q('tc-17-8', 'Does the corporation earn income in foreign countries that needs to be excluded from income eligible for the small business deduction?'),
      ]),
      s('tc-s18', 'Shareholders, Related Parties and Employees', [
        q('tc-18-1', 'Have reasonable interest and/or repayment terms been established to avoid the application of ITA 80.4(2)? 15(2)?'),
        q('tc-18-2', 'If any dividends or bonuses have been paid or declared during the year:\n1. Have appropriate actions been taken to ensure source deductions are remitted on time?\n2. Has an EI exempt status been considered for non-arm\'s length employees?\n3. Have the related T4 or T5 returns been prepared or noted for preparation?\n4. Were the dividends or bonuses recorded in the corporate minutes?\n5. Were the bonuses paid within 180 days of the corporation\'s taxation year-end?\n6. Were other non-arm\'s length accruals paid within two years?'),
        q('tc-18-3', 'If shares were redeemed, has the related T5 return been prepared for the consideration of any capital loss to the shareholder arising from the adjusted cost base of the redeemed shares?'),
        q('tc-18-4', 'Have taxable benefits (and any related GST/HST and/or PST liabilities) been considered and reported for:\na. Payments made on behalf of employees or shareholders?\nb. Assets provided for personal use?\nc. Automobile standby charges?\nd. Board, lodging and other benefits?\ne. Payment of taxable employee insurance plan premiums?\nf. Employee or shareholder loan forgiveness?'),
      ]),
      s('tc-s19', 'Transactions with Non-Residents', [
        q('tc-19-1', 'Did the corporation have any transactions with non-residents? If so, consider:\na. Withholding tax requirements? NR4s and T4A-NRs required?\nb. Is Schedule 29 applicable?\nc. Information return requirements (T1135, T1134, T1141, T1142)?\nd. Thin capitalization rules?\ne. Proper documentation of transactions?'),
        q('tc-19-2', 'Does a non-resident shareholder own any class of shares? If so, complete Schedule 19 and consider if this affects CCPC status.'),
        q('tc-19-3', 'Did the corporation transact with a non-arm\'s length non-resident person? If so, is the transfer pricing adequately supported and documented? Confirm if a T106 slip is required.'),
      ]),
      s('tc-s20', 'Intercorporate Transactions', [
        q('tc-20-1', 'Are there any intercorporate transactions (e.g., management fees, rent and interest)? Are they reasonable?'),
      ]),
      s('tc-s21', 'Debts', [
        q('tc-21-1', 'Have any debts of the corporation been forgiven during the year, or has the corporation forgiven any debts? If so, consider the tax effect of the debt forgiveness rules.'),
      ]),
      s('tc-s22', 'Corporate Reorganizations', [
        q('tc-22-1', 'Did the corporation undergo a reorganization during the year? If so:\na. Have all elections been filed or noted for filing prior to the deadline?\nb. Have information returns been completed or noted for completion?\nc. Has Schedule 50 been updated for any changes in ownership?'),
      ]),
      s('tc-s23', 'GST/HST', [
        q('tc-23-1', 'Has the corporation considered GST/HST requirements for all its business transactions?'),
        q('tc-23-2', 'Has the corporation considered:\na. Registering for GST/HST?\nb. Electing to use a simplified accounting method?\nc. GST/HST instalment requirements for annual filers?\nd. Electing to file returns more often than required?\ne. Electing for nil consideration for transactions within a closely related group?\nf. Whether it has only claimed ITCs that it is entitled to?'),
      ]),
      s('tc-s24', 'Provincial Sales Tax (PST) Requirements', [
        q('tc-24-1', 'Has the corporation considered provincial sales tax (PST) requirements for all its business transactions?'),
        q('tc-24-2', 'Has the corporation considered registering for PST in each applicable jurisdiction?'),
      ]),
      s('tc-s25', 'Other Taxes', [
        q('tc-25-1', 'Has the corporation considered other applicable taxes, such as:\na. Underused housing tax?\nb. Logging taxes?\nc. Resource taxes?\nd. Branch taxes – Schedule 20?\ne. Taxes imposed by the Excise Tax Act?\nf. Other?'),
      ]),
      s('tc-s26', 'Final Checks', [
        q('tc-26-1', 'Ensure any changes in tax rates or rules after the release date of the tax preparation program have been appropriately reflected in the return.'),
        q('tc-26-2', 'Have tax assessments and any reassessments been reviewed? Have any resulting changes in carryforward balances been recorded? Ensure that CRA has received prior year returns.'),
        q('tc-26-3', 'Have all tax balances been confirmed with CRA, including:\na. NERDTOH/ERDTOH?\nb. GRIP?\nc. Non-capital losses?\nd. Instalments?'),
        q('tc-26-4', 'Have the diagnostics of the tax software been reviewed to ensure there are no outstanding issues or missing items?'),
        q('tc-26-5', 'Have we reviewed prior years\' information in the tax software and compared with this year? Follow up on any significant differences.'),
        q('tc-26-6', 'Have we completed a reasonability check of the calculation of taxes owing (active versus passive income accounted for correctly, etc.)?'),
        q('tc-26-7', 'Has the instalment schedule been prepared and reviewed for next taxation year?'),
      ]),
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Audit Completion (310) template
export const generateAuditCompletionChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[]): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer: '', ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-ac-1',
      title: 'Preliminary Activities',
      questions: [
        q('ac-q3', '<p>Does the audit file contain appropriate documentation related to relevant ethical requirements, and acceptance and continuance of the audit engagement? The appointment of an engagement quality control reviewer, where applicable?</p>'),
        q('ac-q6', '<p>Are the terms of engagement agreed with management and is a signed engagement letter included in the audit file?</p>', [
          q('ac-q6a', '<p>Terms of engagement (engagement letter)?</p>'),
          q('ac-q6b', '<p>The following communications with TCWG? Where applicable, the planned scope and timing of the audit, including significant risks identified?</p>'),
          q('ac-q6c', '<p>A description of the audit team\'s responsibilities?</p>'),
          q('ac-q6d', '<p>The form, timing and expected general content of communications?</p>'),
          q('ac-q6e', '<p>Relevant ethical requirements (including those related to independence) applied?</p>'),
          q('ac-q6f', '<p>For listed entities, an independence letter?</p>'),
          q('ac-q6g', '<p>Where applicable, a letter of instructions to a component auditor or to the auditor\'s expert?</p>'),
        ]),
        q('ac-q9', '<p>If applicable, is the agreement with the auditor\'s expert signed and included in the audit file?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-2',
      title: 'Planning and Risk Assessment',
      questions: [
        q('ac-q15', '<p>Have the overall audit strategy and audit plan been documented, reflecting matters raised in audit team discussions?</p>'),
        q('ac-q18', '<p>Have overall materiality, performance materiality, materiality for specific circumstances (if applicable) and the clearly trivial misstatement threshold been documented, including the factors considered in determining materiality amounts?</p>'),
        q('ac-q24', '<p>Have all the planned risk assessment procedures been performed and results documented, including the understanding of:</p>', [
          q('ac-q24a', '<p>The entity and its environment, the AFRF and how inherent risk factors affect susceptibility of assertions to misstatement?</p>'),
          q('ac-q24b', '<p>The entity\'s control environment?</p>'),
          q('ac-q24c', '<p>The entity\'s risk assessment process?</p>'),
          q('ac-q24d', '<p>The entity\'s process for monitoring the system of internal control?</p>'),
          q('ac-q24e', '<p>The entity\'s information system and communication?</p>'),
        ]),
        q('ac-q27', '<p>Have the following been documented:</p>', [
          q('ac-q27a', '<p>Engagement team discussion, including decisions reached regarding fraud?</p>'),
          q('ac-q27b', '<p>If applicable, rebuttal of presumed fraud risk related to revenue recognition?</p>'),
          q('ac-q27c', '<p>The assessment of RMMs (due to fraud and error) identified at the F/S level and at the assertion level?</p>'),
          q('ac-q27d', '<p>The evaluation of identified controls in the control activities component, including that address RMMs due to fraud?</p>'),
          q('ac-q27e', '<p>The rationale for significant judgments made?</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-3',
      title: 'Responding to Risk',
      questions: [
        q('ac-q30', '<p>Have the planned further audit procedures been performed and the results documented, including:</p>', [
          q('ac-q30a', '<p>The overall responses to the RMMs, including fraud, at the F/S level?</p>'),
          q('ac-q30b', '<p>The linkage between the overall responses to the RMMs, including fraud, at the assertion level?</p>'),
          q('ac-q30c', '<p>The nature, timing and extent of further procedures performed, including those designed to address the risk of management override of controls and significant risks?</p>'),
          q('ac-q30d', '<p>The linkage of the further audit procedures to the RMMs at the assertion level?</p>'),
          q('ac-q30e', '<p>Unpredictable procedures addressing fraud risks?</p>'),
          q('ac-q30f', '<p>Procedures addressing identified or suspected non-compliance with laws and regulations, including significant professional judgments and conclusions reached?</p>'),
          q('ac-q30g', '<p>Response(s) if management has not taken appropriate steps to understand and address estimation uncertainty?</p>'),
          q('ac-q30h', '<p>Evaluation of the implications of any indicators of possible management bias related to accounting estimates?</p>'),
          q('ac-q30i', '<p>Significant judgments made relating to whether accounting estimates and related disclosures are reasonable?</p>'),
          q('ac-q30j', '<p>How any inconsistencies regarding a significant matter were addressed?</p>'),
          q('ac-q30k', '<p>The reasoning for departures from CAS requirements and how alternative procedures performed achieved the required objective?</p>'),
        ]),
        q('ac-q40', '<p>Where deviations were found in substantive (sampling) tests, was the nature and cause investigated?</p>'),
        q('ac-q50', '<p>If audit evidence about the operating effectiveness of controls obtained in previous audits was used in the current period audit, does the audit documentation include the conclusions reached about relying on those controls?</p>'),
        q('ac-q55', '<p>Have all identified related parties and the nature of the related party relationships been included in the audit documentation?</p>'),
        q('ac-q60', '<p>If fraud was identified or suspected, has it been determined whether law, regulation or relevant ethical requirements:</p>', [
          q('ac-q60a', '<p>Require reporting to an appropriate authority outside the entity?</p>'),
          q('ac-q60b', '<p>Establish responsibilities under which reporting to an appropriate authority outside the entity may be appropriate in the circumstances?</p>'),
        ]),
        q('ac-q65', '<p>Have any consultations undertaken during the engagement been documented, including the relevant nature, scope, conclusions and implementation of those conclusions?</p>'),
        q('ac-q66', '<p>If the work of the entity\'s internal audit function was used, have the documentation requirements in CAS 610.36-37 been reviewed and included in the audit file?</p>'),
        q('ac-q67', '<p>If any possible material misstatements in the comparative information were discovered, have additional audit procedures been performed to obtain sufficient appropriate audit evidence to determine whether a material misstatement exists?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-4',
      title: 'Communications with Those Charged with Governance, Management and Others',
      questions: [
        q('ac-q71', '<p>Have the following been communicated to management, TCWG, regulators and others:</p>', [
          q('ac-q71a', '<p>Identified fraud or indications of fraud?</p>'),
          q('ac-q71b', '<p>Identified or suspected non-compliance with laws and regulations?</p>'),
          q('ac-q71c', '<p>Other significant audit matters?</p>'),
        ]),
        q('ac-q73', '<p>Have the following been communicated to management:</p>', [
          q('ac-q73a', '<p>Significant deficiencies in internal control (in writing)?</p>'),
          q('ac-q73b', '<p>Other deficiencies in internal control identified during the audit?</p>'),
          q('ac-q73c', '<p>Identified misstatements and has management been asked to correct all identified misstatements (other than those clearly trivial), including those in F/S disclosures?</p>'),
        ]),
        q('ac-q75', '<p>Planning — Have copies of the following communications with TCWG been included in the audit file?</p>', [
          q('ac-q75a', '<p>The planned scope and timing of the audit, including significant risks identified?</p>'),
          q('ac-q75b', '<p>A description of the audit team\'s responsibilities?</p>'),
          q('ac-q75c', '<p>The form, timing and expected general content of communications?</p>'),
          q('ac-q75d', '<p>Relevant ethical requirements (including independence) applied?</p>'),
        ]),
        q('ac-q77', '<p>Internal control — Significant deficiencies in internal control (in writing)?</p>'),
        q('ac-q79', '<p>Audit results — Views about significant qualitative aspects of the entity\'s accounting practices?</p>', [
          q('ac-q79a', '<p>Circumstances of the entity?</p>'),
          q('ac-q79b', '<p>Significant difficulties, if any, encountered during the audit?</p>'),
          q('ac-q79c', '<p>Any circumstances that affect the form and content of the auditor\'s report?</p>'),
          q('ac-q79d', '<p>Any other significant matters that are relevant to the oversight of the financial reporting process?</p>'),
          q('ac-q79e', '<p>Misstatements not corrected by management — have TCWG been informed of the effect, requested to correct, and informed of the effect of uncorrected prior period misstatements?</p>'),
          q('ac-q79f', '<p>Unless all of TCWG are involved in managing the entity: significant matters arising during the audit discussed or subject to correspondence with management, and requested written representations?</p>'),
        ]),
        q('ac-q81', '<p>Has there been timely and adequate two-way communication? If not, were the reasons evaluated and appropriate action taken?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-5',
      title: 'Subsequent Changes',
      questions: [
        q('ac-q84', '<p>Has the reasoning for any significant changes made to the original audit strategy been documented?</p>'),
        q('ac-q87', '<p>Have the RMMs been updated to reflect changes resulting from the audit procedures performed, including when misstatements that were not expected when assessing the RMMs are detected at an interim date?</p>'),
        q('ac-q93', '<p>Have any revisions to overall materiality, performance materiality and materiality for specific circumstances (if applicable) been documented?</p>'),
        q('ac-q95', '<p>If after the engagement was accepted, management imposed a limitation on the scope of the audit that is likely to result in a qualified or disclaimer of opinion, was a request made that management remove the limitation?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-6',
      title: 'Overall Evaluation',
      questions: [
        q('ac-q101', '<p>Have working papers been signed off and dated by the preparer and reviewer, prepared on a timely basis and do they include appropriate details such that an auditor with no previous connection to the audit engagement could understand the procedures performed, results, findings and conclusions reached?</p>'),
        q('ac-q107', '<p>When performing the final analytical procedures, were any inconsistencies identified, and was the information obtained and documented in the engagement file explained and resolved?</p>'),
        q('ac-q110', '<p>Based on the audit procedures performed and audit evidence obtained:</p>', [
          q('ac-q110a', '<p>Are the risk assessments (including RMM at the assertion level) still appropriate, including when management bias has been identified?</p>'),
          q('ac-q110b', '<p>Are management\'s decisions relating to recognition, measurement, presentation and disclosure (including accounting estimates) in accordance with the AFRF?</p>'),
          q('ac-q110c', '<p>Has sufficient appropriate evidence been obtained to form an opinion on if the F/S are prepared, in all material respects, in accordance with the AFRF?</p>'),
          q('ac-q110d', '<p>Is the going concern basis of accounting appropriate and supported by sufficient appropriate audit evidence?</p>'),
          q('ac-q110e', '<p>Did the engagement team remain alert throughout the audit for audit evidence of events or conditions that may cast significant doubt on the entity\'s ability to continue as a going concern?</p>'),
        ]),
        q('ac-q117', '<p>Do the F/S, including disclosures, agree with or reconcile to the underlying accounting records?</p>'),
        q('ac-q124', '<p>In forming an audit opinion as to whether the F/S are prepared, in all material respects, in accordance with the AFRF, is/are the:</p>', [
          q('ac-q124a', '<p>AFRF adequately referred to or described?</p>'),
          q('ac-q124b', '<p>Entity\'s accounting practices, including management\'s judgments, free from any indicators of possible management bias?</p>'),
          q('ac-q124c', '<p>Significant accounting policies appropriately disclosed?</p>'),
          q('ac-q124d', '<p>Accounting policies consistent with the AFRF and appropriate?</p>'),
          q('ac-q124e', '<p>Accounting estimates and related disclosures reasonable?</p>'),
          q('ac-q124f', '<p>Information presented in the F/S relevant, reliable, comparable and understandable?</p>'),
          q('ac-q124g', '<p>Disclosures adequate to enable the intended users to understand the effect of material transactions and events on the information conveyed in the F/S?</p>'),
          q('ac-q124h', '<p>Terminology used in the F/S, including title of each F/S, appropriate?</p>'),
          q('ac-q124i', '<p>Identified related party relationships and transactions appropriately accounted for and disclosed?</p>'),
          q('ac-q124j', '<p>If the F/S achieve fair presentation through the overall presentation, structure and content of the F/S?</p>'),
          q('ac-q124k', '<p>Whether the F/S represent the underlying transactions and events in a manner that achieves fair presentation?</p>'),
          q('ac-q124l', '<p>Whether the effects of the related party relationships and transactions prevent the F/S from achieving fair presentation?</p>'),
          q('ac-q124m', '<p>For compliance frameworks: whether the effects of the related party relationships and transactions cause the F/S to be misleading?</p>'),
        ]),
        q('ac-q127', '<p>If the answer is "No" to any of the questions in procedure 124 and the F/S are materially misstated, or sufficient appropriate audit evidence cannot be obtained, has the audit opinion been modified in accordance with CAS 705?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-7',
      title: 'Reporting',
      questions: [
        q('ac-q130', '<p>Identified misstatements — Have the following been documented:</p>', [
          q('ac-q130a', '<p>All misstatements accumulated during the audit, and whether they have been corrected?</p>'),
          q('ac-q130b', '<p>The conclusion as to whether uncorrected misstatements are material, individually or in aggregate, and the basis for that conclusion?</p>'),
        ]),
        q('ac-q135', '<p>Subsequent events — Have subsequent events procedures been performed up to the report date?</p>'),
        q('ac-q136', '<p>Have subsequent events that may require adjustment of, or disclosure in, the F/S been identified and addressed?</p>'),
        q('ac-q137', '<p>If there is a significant delay in the approval of the F/S by management or TCWG after the date of the F/S, have inquiries been made regarding the reasons for the delay?</p>'),
        q('ac-q138', '<p>Has Form 625 been completed if the delay is believed to be related to events or conditions relating to the going concern assessment?</p>'),
        q('ac-q139', '<p>Is a signed management representation letter (dated on or before date of audit report) included in the audit file?</p>'),
        q('ac-q140', '<p>Where applicable, was the engagement quality review completed and the approval evidenced in the file (signed off) on or before the audit report was dated?</p>'),
        q('ac-q141', '<p>Has Form 305 been completed to ensure the form and content of the auditor\'s report are appropriate?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-8',
      title: 'Audit Procedures After the Audit Report Date',
      questions: [
        q('ac-q150', '<p>If, in exceptional circumstances, new or additional audit procedures were performed or new conclusions drawn after the date of the auditor\'s report, have the following been documented:</p>', [
          q('ac-q150a', '<p>The circumstances encountered?</p>'),
          q('ac-q150b', '<p>The new or additional audit procedures performed, audit evidence obtained, and conclusions reached, and their effect on the auditor\'s report?</p>'),
          q('ac-q150c', '<p>When and by whom the resulting changes to audit documentation were made and reviewed?</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-9',
      title: 'File Assembly and Archival',
      questions: [
        q('ac-q160', '<p>Has all audit documentation been assembled in the audit file on a timely basis after the date of the auditor\'s report (usually not more than 60 days after)?</p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-completion',
    title: 'Checklist — Audit Completion',
    description: 'A comprehensive checklist to determine if the CAS requirements have been fulfilled before issuing the auditor\'s report.',
    objective: `To determine if the CAS requirements have been fulfilled before issuing the auditor's report.

AFRF = Applicable financial reporting framework.
D&I = Design and implementation.
F/S = Financial statements.
OE = Operating effectiveness.
PSC = Procedure successfully completed.
RMM(s) = Risk(s) of material misstatement.
TCWG = Those charged with governance.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Engagement Partner Checklist — Audit Completion (312) template
export const generateEngagementPartnerAuditCompletionChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[]): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer: '', ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-ep-1',
      title: 'Audit Engagement Quality (CAS 220.13-15, 23, 24, 40(b))',
      questions: [
        q('ep-q1', '<p>Have you created an environment for the engagement that emphasizes the firm\'s culture and expected behaviour of engagement team members by:</p>', [
          q('ep-q1a', '<p>Being sufficiently and appropriately involved in the audit?</p>'),
          q('ep-q1b', '<p>Emphasizing the following to all engagement team members: management and achievement of quality, importance of professional ethics, values and attitudes, importance of open and robust communication within the team, and exercising professional skepticism throughout the engagement?</p>'),
          q('ep-q1c', '<p>Supervising, directing and reviewing work of engagement team members who designed or performed procedures to comply with the requirements of CAS 220?</p>'),
        ]),
        q('ep-q2', '<p>Have you taken into account information obtained in the acceptance and continuance process in planning and performing the audit engagement?</p>'),
        q('ep-q3', '<p>If you or the engagement team became aware of information that may have caused the firm to decline the audit engagement had that information been known prior to accepting or continuing, did you communicate that information promptly to the firm?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-2',
      title: 'Relevant Ethical Requirements, Independence and Compliance (CAS 220.17-21)',
      questions: [
        q('ep-q4', '<p>Have you made inquiries of the engagement team to ensure that:</p>', [
          q('ep-q4a', '<p>The team understands the relevant ethical requirements, including those related to independence?</p>'),
          q('ep-q4b', '<p>The team maintained their independence throughout the engagement?</p>'),
          q('ep-q4c', '<p>Any potential breaches of ethical requirements, independence, or compliance with laws and regulations were communicated to you?</p>'),
          q('ep-q4d', '<p>Where a potential breach was identified, the threat was evaluated, appropriate actions taken and conclusions documented, and firm policies were adhered to?</p>'),
        ]),
        q('ep-q5', '<p>Were you alert throughout the engagement for breaches of relevant ethical requirements or the firm\'s related policies or procedures by members of the engagement team?</p>'),
        q('ep-q6', '<p>If you or the engagement team became aware of information that may have caused the firm to decline the audit engagement, did you communicate that information promptly to the firm?</p>'),
        q('ep-q7', '<p>Prior to dating the auditor\'s report have you determined whether relevant ethical requirements, including those related to independence, have been fulfilled?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-3',
      title: 'Engagement Resources',
      questions: [
        q('ep-q8', '<p>Were sufficient and appropriate staffing, technological and intellectual resources made available to the engagement team? (CAS 220.25)</p>'),
        q('ep-q9', '<p>Did you ensure that the engagement team, including any external resources, had the appropriate competence and capabilities (including sufficient time) to perform the engagement? (CAS 220.26)</p>'),
        q('ep-q10', '<p>Where changes in staffing or timing were necessary, did you take appropriate actions to ensure that additional resources were made available to the team? (CAS 220.27)</p>'),
        q('ep-q11', '<p>Have you utilized the resources assigned or made available to the engagement team appropriately, given the nature and circumstances of the audit engagement? (CAS 220.28)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-4',
      title: 'Engagement Performance',
      questions: [
        q('ep-q12', '<p>When planning and performing the engagement, was information obtained in the engagement acceptance and continuance process taken into account?</p>'),
        q('ep-q13', '<p>Were you sufficiently involved throughout the engagement to ensure that the audit procedures were:</p>', [
          q('ep-q13a', '<p>Planned and performed in accordance with the firm\'s policies and professional standards, and any applicable legal and regulatory requirements? (CAS 220.30(a))</p>'),
          q('ep-q13b', '<p>Appropriate given the nature and circumstances of the engagement, including significant judgments made and conclusions reached? (CAS 220.30(b), 40(a))</p>'),
        ]),
        q('ep-q14', '<p>Did you perform a timely review of audit evidence at appropriate stages in the audit, including documentation related to:</p>', [
          q('ep-q14a', '<p>Significant matters? (CAS 220.31(a))</p>'),
          q('ep-q14b', '<p>Significant judgments, including those related to difficult or contentious matters? (CAS 220.31(b))</p>'),
          q('ep-q14c', '<p>Significant risks and the results of the audit response?</p>'),
          q('ep-q14d', '<p>Other matters that, in your judgment, are relevant to fulfilling your role as the engagement partner? (CAS 220.31(c))</p>'),
          q('ep-q14e', '<p>The draft F/S? (CAS 220.33)</p>'),
          q('ep-q14f', '<p>The proposed auditor\'s report? (CAS 220.33)</p>'),
          q('ep-q14g', '<p>Any formal written communications to management/TCWG, including deficiencies in internal control or potential key audit matters, or to regulatory authorities? (CAS 220.34)</p>'),
        ]),
        q('ep-q15', '<p>Did you take responsibility for the engagement team undertaking any consultations on the engagement?</p>', [
          q('ep-q15a', '<p>The engagement team has undertaken appropriate consultation during the engagement?</p>'),
          q('ep-q15b', '<p>The nature and scope of, and conclusions resulting from, such consultations are agreed with the party consulted?</p>'),
          q('ep-q15c', '<p>Conclusions agreed to have been implemented?</p>'),
        ]),
        q('ep-q16', '<p>Where the proposed auditor\'s report is modified, did you ensure that the wording is appropriate and in accordance with professional standards?</p>', [
          q('ep-q16a', '<p>There is sufficient documentation and audit evidence to support the modification?</p>'),
          q('ep-q16b', '<p>Where applicable, firm consultation policies for modified opinions were followed?</p>'),
        ]),
        q('ep-q17', '<p>Where differences of opinion arose within the engagement team, or between EQR reviewers or other firm members, were:</p>', [
          q('ep-q17a', '<p>The differences of opinion addressed and resolved in accordance with the firm\'s policies? (CAS 220.37)</p>'),
          q('ep-q17b', '<p>The conclusions reached adequately documented and implemented prior to the date of the audit report? (CAS 220.38)</p>'),
        ]),
        q('ep-q18', '<p>Where the results of firm monitoring or external inspections could have affected this engagement, were they taken into consideration when planning and performing the engagement? (CAS 220.39)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-5',
      title: 'Engagement Quality Reviewer',
      questions: [
        q('ep-q19', '<p>Where an engagement quality review is required, are you satisfied that: (CAS 220.36)</p>', [
          q('ep-q19a', '<p>An engagement quality reviewer (EQR) has been appointed?</p>'),
          q('ep-q19b', '<p>The engagement team and you have cooperated with the EQR?</p>'),
          q('ep-q19c', '<p>Significant matters and significant judgements arising during the audit have been discussed with the EQR?</p>'),
          q('ep-q19d', '<p>The EQR has been completed before the date of the auditor\'s report?</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-6',
      title: 'Overall Evaluation and Conclusions',
      questions: [
        q('ep-q20', '<p>Based on my review of audit documentation and discussions with the engagement team, I take ultimate responsibility and am satisfied that:</p>', [
          q('ep-q20a', '<p>The audit was conducted in accordance with Canadian Auditing Standards. (CAS 220.9)</p>'),
          q('ep-q20b', '<p>I have an understanding of the relevant ethical requirements, including those related to independence, that are applicable given the nature and circumstances of the audit engagement. (CAS 220.16)</p>'),
          q('ep-q20c', '<p>Relevant ethical requirements, including those related to independence, have been fulfilled. (CAS 220.20-21)</p>'),
          q('ep-q20d', '<p>I have directed and supervised the engagement team and the review of their work. (CAS 220.29)</p>'),
          q('ep-q20e', '<p>I have reviewed the changes made to the original overall audit strategy and audit plan. (CAS 300.11)</p>'),
          q('ep-q20f', '<p>Significant judgments made and conclusions reached by the engagement team are appropriate given the nature and circumstances of the engagement. (CAS 220.40(a))</p>'),
          q('ep-q20g', '<p>The nature and circumstances of the audit engagement, including any changes, and the firm\'s policies or procedures have been taken into account to manage and achieve audit quality. (CAS 220.40(b))</p>'),
          q('ep-q20h', '<p>No restrictions in scope were imposed on us. (CAS 700.17(b))</p>'),
          q('ep-q20i', '<p>The audit evidence obtained is sufficient, appropriate and adequately documented to provide a basis for our audit opinion, including the F/S and disclosures. (CAS 220.32)</p>'),
          q('ep-q20j', '<p>The F/S are presented fairly, in all material respects, in accordance with the applicable financial reporting framework. (CAS 700.16)</p>'),
          q('ep-q20k', '<p>The auditor\'s report is appropriately worded.</p>'),
        ]),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-engagement-partner-audit-completion',
    title: 'Engagement Partner Checklist — Audit Completion',
    description: 'To ensure the engagement partner and engagement team\'s responsibilities related to quality management at the engagement level are fulfilled and documented.',
    objective: `To ensure the engagement partner and engagement team's responsibilities related to quality management at the engagement level are fulfilled and documented (CAS 220.41).

PSC = Procedure successfully completed.
AFRF = Applicable financial reporting framework.
F/S = Financial statements.
TCWG = Those charged with governance.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
// Checklist — Auditor's Report (305) template
export const generateAuditorsReportChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[]): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer: '', ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-ar305-1',
      title: '1. Audit Reporting',
      questions: [
        q('ar305-q1', '<p>Has the checklist in Appendix A been reviewed to ensure the auditor\'s report addresses the requirements of CAS 700.20–48?</p><p><em>Note: If an auditor\'s report template (that has been created in accordance with CAS 700) is used as a starting point when drafting the auditor\'s report, completing the checklist in Appendix A is not necessary. However, it is recommended to review it to ensure all required details are captured.</em></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-2',
      title: '2. Modifications to the Opinion',
      questions: [
        q('ar305-q2', '<p>Are any of the following applicable which may result in a modified opinion:</p>', [
          q('ar305-q2a', '<p>An inability to meet any relevant CAS objectives or requirements? (CAS 200.24)</p>'),
          q('ar305-q2b', '<p>Conflicts between financial reporting standards and legal or regulatory requirements? (CAS 210.18)</p>'),
          q('ar305-q2c', '<p>Non-compliance with laws and regulations or limitations on obtaining sufficient appropriate audit evidence regarding non-compliance? (CAS 250.21, 26–28)</p>'),
          q('ar305-q2d', '<p>An inability to obtain sufficient appropriate audit evidence for any relevant assertions/SCOTABDs? (CAS 330.27)</p>'),
          q('ar305-q2e', '<p>An inability to obtain sufficient appropriate audit evidence regarding services provided by a service organization? (CAS 402.20)</p>'),
          q('ar305-q2f', '<p>An inability to attend a physical inventory count or obtain sufficient appropriate audit evidence about the existence and condition of inventory? (CAS 501.7)</p>'),
          q('ar305-q2g', '<p>An inability to obtain sufficient appropriate audit evidence about litigation and claims from alternative procedures performed because management refused to provide access to the entity\'s external legal counsel or a response was not received/appropriate? (CAS 501.11)</p>'),
          q('ar305-q2h', '<p>Management\'s refusal to send confirmation requests or lack of sufficient response to confirmation requests? (CAS 505.9, 13)</p>'),
          q('ar305-q2i', '<p>In an initial audit engagement: (CAS 510.10–13)</p>', [
            q('ar305-q2i-i', '<p>An inability to obtain sufficient appropriate audit evidence regarding opening balances?</p>'),
            q('ar305-q2i-ii', '<p>Misstatements in opening balances that materially affect the current period F/S and have not been appropriately accounted for or adequately presented or disclosed?</p>'),
            q('ar305-q2i-iii', '<p>Accounting policies incorrectly applied in opening balances, or changes in accounting policies incorrectly accounted for, presented or disclosed?</p>'),
            q('ar305-q2i-iv', '<p>A predecessor auditor\'s modification to the opinion that remains relevant and material to the current period\'s F/S?</p>'),
          ]),
          q('ar305-q2j', '<p>An inability to obtain sufficient appropriate audit evidence regarding accounting estimates? (CAS 540.34)</p>'),
          q('ar305-q2k', '<p>Management does not amend the F/S when facts become known after the date of the auditor\'s report but before the F/S are issued or the auditor\'s report has been provided to the entity? (CAS 560.13(a))</p>'),
          q('ar305-q2l', '<p>Going concern: (CAS 570.21, 23(a), 24; 700.29)</p>', [
            q('ar305-q2l-i', '<p>Inappropriate use of the going concern basis?</p>'),
            q('ar305-q2l-ii', '<p>Inadequate financial statement disclosure about a material uncertainty that may cast significant doubt on the entity\'s ability to continue as a going concern?</p>'),
            q('ar305-q2l-iii', '<p>Management\'s unwillingness to make or extend a going concern assessment?</p>'),
          ]),
          q('ar305-q2m', '<p>Unreliable written representations from management or lack of willingness to provide requested written representations? (CAS 580.20)</p>'),
          q('ar305-q2n', '<p>In a group audit: uncorrected misstatements, restrictions imposed by group management or other circumstances resulting in the inability to obtain sufficient appropriate audit evidence? (CAS 600.21(b)(ii), 52)</p>'),
          q('ar305-q2o', '<p>F/S do not achieve fair presentation (and are prepared in accordance with a fair presentation framework)? (CAS 700.18)</p>'),
          q('ar305-q2p', '<p>Management-imposed limitation of scope resulting in the inability to obtain sufficient appropriate audit evidence? (CAS 705.13)</p>'),
        ]),
        q('ar305-q3', '<p>If a modified opinion is required due to circumstances applicable in procedure 2 above, or if either of the below circumstances apply, has Form 306 been completed to ensure the auditor\'s report appropriately reflects the modified opinion?</p><p>• Based on the audit evidence obtained, the F/S as a whole are not free from material misstatement; or</p><p>• Sufficient appropriate audit evidence cannot be obtained to conclude that the F/S as a whole are free from material misstatement. (CAS 705.6)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-3',
      title: '3. Emphasis of Matter & Other Matter',
      questions: [
        q('ar305-q4', '<p>If there is a need to draw attention to a matter presented/disclosed that is fundamental to the users\' understanding of the F/S, has a section with the heading "Emphasis of Matter" been added to the auditor\'s report:</p>', [
          q('ar305-q4a', '<p>Including a clear reference to the matter being emphasized, and where the relevant disclosures fully describing the matter can be found in the F/S?</p>'),
          q('ar305-q4b', '<p>Indicating that the auditor\'s opinion is not modified in respect of the matter emphasized?</p>'),
        ]),
        q('ar305-q5', '<p>If there is a need to draw attention to a matter relevant to the users\' understanding of the audit, the auditor\'s responsibilities or the auditor\'s report, has a section with the heading "Other Matter" been added to the auditor\'s report? (CAS 706.10–11)</p>'),
        q('ar305-q6', '<p>If an "Emphasis of Matter" and/or "Other Matter" section is expected to be included in the auditor\'s report, has the expected wording of the section(s) been communicated with TCWG? (CAS 706.12)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-4',
      title: '4. Comparative Information — Corresponding Figures',
      questions: [
        q('ar305-q7', '<p>Have one of the following approaches to comparative information been selected:</p>', [
          q('ar305-q7a', '<p>Corresponding figures (auditor\'s opinion on the F/S refers to the current period only)?</p>'),
          q('ar305-q7b', '<p>Comparative F/S (auditor\'s opinion refers to each period for which F/S are presented)?</p>'),
        ]),
        q('ar305-q8', '<p>Does the comparative information agree with amounts and other disclosures presented in the prior period (or restated, if appropriate)? (CAS 710.7(a))</p>'),
        q('ar305-q9', '<p>Does the comparative information consistently reflect the accounting policies applied in the current period? If there have been changes in accounting policies, have those changes been properly accounted for and adequately presented and disclosed? (CAS 710.7(b))</p>'),
        q('ar305-q10', '<p>Does the opinion in the auditor\'s report only refer to the current period (not corresponding figures), unless:</p>', [
          q('ar305-q10a', '<p>A modified opinion was issued in the prior period and the matter that gave rise to the modification is unresolved?</p>'),
          q('ar305-q10b', '<p>A material misstatement is discovered in the prior period F/S on which an unmodified opinion was previously issued?</p>'),
          q('ar305-q10c', '<p>The prior period F/S were not audited?</p>'),
        ]),
        q('ar305-q11', '<p>If a modified opinion was issued in the prior period and the matter is unresolved, does the Basis for Opinion section of the auditor\'s report either:</p>', [
          q('ar305-q11a', '<p>Refer to both the current period\'s figures and the corresponding figures in the description of the matter giving rise to the modification?</p>'),
          q('ar305-q11b', '<p>Explain that the audit opinion has been modified because of the effects or possible effects of the unresolved matter on the comparability of the current period\'s figures and the corresponding figures?</p>'),
        ]),
        q('ar305-q12', '<p>If a material misstatement was discovered in the prior period F/S on which an unmodified opinion was previously issued, and the corresponding figures have not been properly restated or adequate disclosures made, has a qualified or adverse opinion been expressed on the current period F/S, modified with respect to the corresponding figures? (CAS 710.12)</p>'),
        q('ar305-q13', '<p>If the prior period F/S were not audited, has an "Other Matter" section been included in the auditor\'s report, stating that the corresponding figures are unaudited? (CAS 710.14)</p>'),
        q('ar305-q14', '<p>If the prior period F/S were audited by a predecessor auditor, has an "Other Matter" section been included in the auditor\'s report, stating:</p>', [
          q('ar305-q14a', '<p>That the F/S of the prior period were audited by a predecessor auditor?</p>'),
          q('ar305-q14b', '<p>The type of opinion expressed by the predecessor auditor and, if the opinion was modified, the reasons for the modification?</p>'),
          q('ar305-q14c', '<p>The date of the predecessor auditor\'s report?</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-5',
      title: '5. Comparative Information — Comparative F/S',
      questions: [
        q('ar305-q15', '<p>Does the comparative information agree with amounts and other disclosures presented in the prior period (or restated, if appropriate)? (CAS 710.7(a))</p>'),
        q('ar305-q16', '<p>Does the comparative information consistently reflect the accounting policies applied in the current period? If there have been changes in accounting policies, have those changes been properly accounted for and adequately presented and disclosed? (CAS 710.7(b))</p>'),
        q('ar305-q17', '<p>Does the opinion in the auditor\'s report refer to each period for which F/S are presented (and on which an audit opinion is expressed)? (CAS 710.15)</p>'),
        q('ar305-q18', '<p>If the opinion on the prior period F/S differs from the opinion previously expressed, has an "Other Matter" section been included in the auditor\'s report that discloses the substantive reasons for the different opinion? (CAS 710.16)</p>'),
        q('ar305-q19', '<p>If the prior period F/S were audited by a predecessor auditor, has an "Other Matter" section been included in the auditor\'s report, stating:</p>', [
          q('ar305-q19a', '<p>That the F/S of the prior period were audited by a predecessor auditor?</p>'),
          q('ar305-q19b', '<p>The type of opinion expressed by the predecessor auditor and, if the opinion was modified, the reasons for the modification?</p>'),
          q('ar305-q19c', '<p>The date of the predecessor auditor\'s report?</p>'),
        ]),
        q('ar305-q20', '<p>If the prior period F/S were audited by a predecessor auditor (upon which an unmodified opinion was expressed), and the audit team discovers a material misstatement that affects the prior period F/S:</p>', [
          q('ar305-q20a', '<p>Has the misstatement been communicated with the appropriate level of management and TCWG, requesting that the predecessor auditor be informed?</p>'),
          q('ar305-q20b', '<p>If the prior period F/S are amended and the predecessor auditor issues a new auditor\'s report on the prior period F/S, has the current auditor\'s report been amended to only report on the current period?</p>'),
        ]),
        q('ar305-q21', '<p>If the prior period F/S were not audited, has an "Other Matter" section been included in the auditor\'s report, stating that the comparative F/S are unaudited? (CAS 710.19)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-6',
      title: '6. Use of Auditor\'s Expert',
      questions: [
        q('ar305-q22', '<p>If the auditor\'s report refers to the work of an auditor\'s expert, does the report indicate that the reference does not reduce the auditor\'s responsibility for the opinion? (CAS 620.14–15)</p><p><em>Note: The auditor\'s report should not refer to the work of an auditor\'s expert unless required by law or regulation, or the auditor\'s report contains a modified opinion and the work of the auditor\'s expert is relevant to explain the nature of the modification.</em></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-7',
      title: '7. Key Audit Matters',
      questions: [
        q('ar305-q23', '<p>If the engagement is for a listed entity (or the engagement partner determines it is appropriate), has a "Key Audit Matters" section been included in the auditor\'s report? (CAS 701.5, 13)</p>'),
        q('ar305-q24', '<p>If Key Audit Matters are to be communicated, have the following been addressed:</p>', [
          q('ar305-q24a', '<p>Matters communicated with TCWG, significant risks, and significant auditor judgments considered?</p>'),
          q('ar305-q24b', '<p>Each key audit matter described with reference to the related disclosure(s) in the F/S?</p>'),
          q('ar305-q24c', '<p>Why the matter was considered to be one of most significance and how the matter was addressed in the audit?</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-8',
      title: '8. Going Concern',
      questions: [
        q('ar305-q25', '<p>If a material uncertainty related to going concern has been adequately disclosed in the F/S, has a section with the heading "Material Uncertainty Related to Going Concern" been included in the auditor\'s report? (CAS 570.22)</p>'),
        q('ar305-q26', '<p>If no material uncertainty exists but close-call events or conditions have been identified, has the adequacy of F/S disclosures been evaluated and has a determination been made whether to include an Emphasis of Matter paragraph? (CAS 570.25)</p>'),
        q('ar305-q27', '<p>If the going concern basis of accounting is used inappropriately, has the opinion been modified? (CAS 570.21)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-9',
      title: '9. Group Audit',
      questions: [
        q('ar305-q28', '<p>If a group audit, has the auditor\'s report been appropriately worded in accordance with CAS 600? (CAS 600.50–52)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-10',
      title: '10. Other Reporting Responsibilities',
      questions: [
        q('ar305-q29', '<p>If other reporting responsibilities (in addition to the auditor\'s responsibilities under the CASs) are addressed in the auditor\'s report, have these other reporting responsibilities been:</p>', [
          q('ar305-q29a', '<p>Included in a separate section in the report with a heading titled "Report on Other Legal and Regulatory Requirements" (or as appropriate)?</p>'),
          q('ar305-q29b', '<p>If presented in the same section, clearly differentiated from the reporting required by the CASs?</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-11',
      title: '11. Auditor\'s Report Prescribed by Law or Regulation',
      questions: [
        q('ar305-q30', '<p>If law or regulation of a specific jurisdiction requires the use of a specific layout or wording of the auditor\'s report, has CAS 700.50 been reviewed to ensure the minimum required elements have been included in the report? (CAS 700.50)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-12',
      title: '12. Auditing Standards of a Specific Jurisdiction',
      questions: [
        q('ar305-q31', '<p>If the audit has been conducted in accordance with the CASs but is also required to be conducted in accordance with the auditing standards of a specific jurisdiction:</p>', [
          q('ar305-q31a', '<p>Has an evaluation been completed to ensure there is no conflict between the requirements?</p>'),
          q('ar305-q31b', '<p>Does the auditor\'s report include, at a minimum, all elements listed in CAS 700.50?</p>'),
          q('ar305-q31c', '<p>If the auditor\'s report refers to both the national auditing standards and Canadian GAAS, does the report identify the jurisdiction of origin?</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-13',
      title: '13. Auditor\'s Report Date',
      questions: [
        q('ar305-q32', '<p>Is the auditor\'s report dated no earlier than the date on which sufficient appropriate audit evidence has been obtained, including evidence that:</p>', [
          q('ar305-q32a', '<p>All the statements and disclosures that comprise the F/S have been prepared?</p>'),
          q('ar305-q32b', '<p>Those with the recognized authority have asserted that they have taken responsibility for those F/S?</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-14',
      title: '14. Supplementary Information & Other Information',
      questions: [
        q('ar305-q33', '<p>If supplementary information is presented with the F/S, complete Form 313 and update the auditor\'s report as required. (CAS 700.53–54)</p>'),
        q('ar305-q34', '<p>If other information is included in the entity\'s annual report, complete Form 313 and update the auditor\'s report as required. (CAS 700.32)</p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-auditors-report',
    title: 'Checklist — Auditor\'s Report',
    description: 'Checklist to ensure the auditor\'s report addresses all CAS requirements.',
    objective: 'To form an opinion on the financial statements based on an evaluation of the conclusions drawn from the audit evidence obtained, and to check that the content of the auditor\'s report appropriately reflects that opinion.',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Checklist — Modified Opinion (306) template
export const generateModifiedOpinionChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[]): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer: '', ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-mo306-1',
      title: '1. Qualified Opinion',
      questions: [
        q('mo306-q1', '<p>Has the "Opinion" heading been modified to "Qualified Opinion"? (CAS 705.16)</p>'),
        q('mo306-q2', '<p>Has the Qualified Opinion section been amended to include the appropriate wording? (CAS 705.17)</p><p><em>"In our opinion, except for the effects of the matter(s) described in the Basis for Qualified Opinion section of our report, the accompanying financial statements…"</em></p><p><em>OR if the modification arises from an inability to obtain sufficient appropriate audit evidence: "In our opinion, except for the possible effects of the matter(s) described in the Basis for Qualified Opinion section of our report, the accompanying financial statements…"</em></p>'),
        q('mo306-q3', '<p>Has the "Basis for Opinion" heading been modified to "Basis for Qualified Opinion"? (CAS 705.20(a))</p>'),
        q('mo306-q4', '<p>Has the matter giving rise to the qualified opinion been described, including the reason(s) for the inability to obtain sufficient appropriate audit evidence (if applicable)? (CAS 705.20(b), 24)</p>'),
        q('mo306-q5', '<p>If there is a material misstatement that relates to specific amounts or quantitative disclosures, does the Basis for Qualified Opinion section:</p>', [
          q('mo306-q5a', '<p>Include a description and quantification of the financial effects of the misstatement?</p>'),
          q('mo306-q5b', '<p>State that it is not practicable to quantify those effects? (CAS 705.21)</p>'),
        ]),
        q('mo306-q6', '<p>If there is a material misstatement that relates to qualitative disclosures, has an explanation been provided of how the disclosures are misstated? (CAS 705.22)</p>'),
        q('mo306-q7', '<p>If there is a material misstatement that relates to non-disclosure of information required to be disclosed, does the Basis for Qualified Opinion section:</p>', [
          q('mo306-q7a', '<p>Describe the nature of the omitted information? (CAS 705.23(b))</p>'),
          q('mo306-q7b', '<p>Include the omitted disclosure (unless prohibited by law or regulation, if it is practicable to do so, and if sufficient appropriate audit evidence has been obtained)? (CAS 705.23(c))</p>'),
        ]),
        q('mo306-q8', '<p>If the qualified opinion is due to inadequate disclosure about the material uncertainty related to going concern, is a statement included disclosing that a material uncertainty exists? (CAS 570.23(b); 700.29)</p>'),
        q('mo306-q9', '<p>Has the concluding sentence of the Basis for Qualified Opinion section been amended to refer to the "qualified opinion"? (CAS 705.25)</p>'),
        q('mo306-q10', '<p>Have the following been communicated with TCWG?</p>', [
          q('mo306-q10a', '<p>The circumstances that led to the qualified opinion? (CAS 705.30)</p>'),
          q('mo306-q10b', '<p>The modified wording of the Qualified Opinion and Basis for Qualified Opinion sections? (CAS 705.30)</p>'),
          q('mo306-q10c', '<p>Any material misstatement related to an omitted disclosure? (CAS 705.23(a))</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-mo306-2',
      title: '2. Adverse Opinion',
      questions: [
        q('mo306-q11', '<p>Has the "Opinion" heading been modified to "Adverse Opinion"? (CAS 705.16)</p>'),
        q('mo306-q12', '<p>Has the opinion paragraph been amended to include the appropriate wording? (CAS 705.18)</p><p><em>"In our opinion, because of the significance of the matter(s) described in the Basis for Adverse Opinion section of our report, the accompanying financial statements [do not present fairly or have not been prepared, in all material respects]…"</em></p>'),
        q('mo306-q13', '<p>Has the "Basis for Opinion" heading been modified to "Basis for Adverse Opinion"? (CAS 705.20(a))</p>'),
        q('mo306-q14', '<p>Has the matter giving rise to the adverse opinion been described? (CAS 705.20(b))</p>'),
        q('mo306-q15', '<p>Although an adverse opinion has been expressed on the financial statements, are there any other matters that would have required a modification to the opinion? If so, does the Basis for Adverse Opinion section also describe the reasons and the effects of those matters? (CAS 705.27)</p>'),
        q('mo306-q16', '<p>If there is a material misstatement that relates to specific amounts or quantitative disclosures, does the Basis for Adverse Opinion section:</p>', [
          q('mo306-q16a', '<p>Include a description and quantification of the financial effects of the misstatement?</p>'),
          q('mo306-q16b', '<p>State that it is not practicable to quantify those effects? (CAS 705.21)</p>'),
        ]),
        q('mo306-q17', '<p>If there is a material misstatement that relates to qualitative disclosures, has an explanation been provided of how the disclosures are misstated? (CAS 705.22)</p>'),
        q('mo306-q18', '<p>If there is a material misstatement that relates to non-disclosure of information required to be disclosed, does the Basis for Adverse Opinion section:</p>', [
          q('mo306-q18a', '<p>Describe the nature of the omitted information? (CAS 705.23(b))</p>'),
          q('mo306-q18b', '<p>Include the omitted disclosure (unless prohibited by law or regulation, if it is practicable to do so, and if sufficient appropriate audit evidence has been obtained)? (CAS 705.23(c))</p>'),
        ]),
        q('mo306-q19', '<p>If the adverse opinion is due to inadequate disclosure about the material uncertainty related to going concern, is a statement included disclosing that a material uncertainty exists? (CAS 570.23(b))</p>'),
        q('mo306-q20', '<p>Has the concluding sentence of the Basis for Adverse Opinion section been amended to refer to the "adverse opinion"? (CAS 705.25)</p>'),
        q('mo306-q21', '<p>Have the following been communicated with TCWG?</p>', [
          q('mo306-q21a', '<p>The circumstances that led to the adverse opinion? (CAS 705.30)</p>'),
          q('mo306-q21b', '<p>The modified wording of the Adverse Opinion and Basis for Adverse Opinion sections? (CAS 705.30)</p>'),
          q('mo306-q21c', '<p>Any material misstatement related to an omitted disclosure? (CAS 705.23(a))</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-mo306-3',
      title: '3. Disclaimer of Opinion',
      questions: [
        q('mo306-q22', '<p>Has the "Opinion" heading been modified to "Disclaimer of Opinion"? (CAS 705.16)</p>'),
        q('mo306-q23', '<p>Has the opening sentence of the Disclaimer of Opinion section been amended from "We have audited" to "We were engaged to audit"? (CAS 705.19(c))</p>'),
        q('mo306-q24', '<p>Has the opinion paragraph been amended to state that an opinion is not being expressed and that sufficient appropriate audit evidence has not been obtained? (CAS 705.19(a)–(b))</p>'),
        q('mo306-q25', '<p>Has the "Basis for Opinion" heading been modified to "Basis for Disclaimer of Opinion"? (CAS 705.20(a))</p>'),
        q('mo306-q26', '<p>Has the matter giving rise to the disclaimer of opinion been described, including the reason(s) for the inability to obtain sufficient appropriate audit evidence? (CAS 705.20(b), 24)</p>'),
        q('mo306-q27', '<p>Although an opinion has been disclaimed on the financial statements, are there any other matters that would have required a modification to the opinion? If so, does the Basis for Disclaimer of Opinion section also describe the reasons and the effects of those matters? (CAS 705.27)</p>'),
        q('mo306-q28', '<p>If there is a material misstatement that relates to specific amounts or quantitative disclosures, does the Basis for Disclaimer of Opinion section:</p>', [
          q('mo306-q28a', '<p>Include a description and quantification of the financial effects of the misstatement? (CAS 705.21)</p>'),
          q('mo306-q28b', '<p>State that it is not practicable to quantify those effects?</p>'),
        ]),
        q('mo306-q29', '<p>If there is a material misstatement that relates to qualitative disclosures, has an explanation been provided of how the disclosures are misstated? (CAS 705.22)</p>'),
        q('mo306-q30', '<p>If there is a material misstatement that relates to non-disclosure of information required to be disclosed, does the Basis for Disclaimer of Opinion section:</p>', [
          q('mo306-q30a', '<p>Describe the nature of the omitted information? (CAS 705.23(b))</p>'),
          q('mo306-q30b', '<p>Include the omitted disclosure (unless prohibited by law or regulation, if it is practicable to do so, and if sufficient appropriate audit evidence has been obtained)? (CAS 705.23(c))</p>'),
        ]),
        q('mo306-q31', '<p>Have the following been removed from the Basis for Disclaimer of Opinion section:</p>', [
          q('mo306-q31a', '<p>Reference to the section of the auditor\'s report that describes the auditor\'s responsibilities under the Canadian Auditing Standards? (CAS 705.26(a))</p>'),
          q('mo306-q31b', '<p>The statement that the auditor believes that the audit evidence obtained is sufficient and appropriate to provide a basis for the auditor\'s opinion? (CAS 705.26(b))</p>'),
        ]),
        q('mo306-q32', '<p>When the disclaimer of opinion is due to the inability to obtain sufficient appropriate audit evidence, has the Auditor\'s Responsibilities section been amended to only include the required statement? (CAS 705.28–29)</p>'),
        q('mo306-q33', '<p>Have the following been communicated with TCWG?</p>', [
          q('mo306-q33a', '<p>The circumstances that led to the disclaimer of opinion? (CAS 705.30)</p>'),
          q('mo306-q33b', '<p>The modified wording of the Disclaimer of Opinion and Basis for Disclaimer of Opinion sections? (CAS 705.30)</p>'),
          q('mo306-q33c', '<p>Any material misstatement related to an omitted disclosure? (CAS 705.23(a))</p>'),
        ]),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-modified-opinion',
    title: 'Checklist — Modified Opinion',
    description: 'Checklist to ensure the opinion is appropriately modified in the auditor\'s report.',
    objective: 'To check that the opinion is appropriately modified in the auditor\'s report when: (a) The auditor has concluded that, based on the audit evidence obtained, the financial statements as a whole are not free from material misstatement; or (b) The auditor is unable to obtain sufficient appropriate audit evidence to conclude that the financial statements as a whole are free from material misstatement.',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Checklist — Supplementary and Other Information (313) template
export const generateSupplementaryInfoChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[]): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer: '', ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-si313-1',
      title: '1. Supplementary Information',
      questions: [
        q('si313-q1', '<p>If supplementary information that is not required by the AFRF is presented with the audited F/S, has an evaluation been made regarding if this information is an integral part of the F/S due to its nature or how it is presented? (CAS 700.53)</p><p><em>Note: See CAS 700.A79–A85 for guidance and examples of supplementary information.</em></p>'),
        q('si313-q2', '<p>If the supplementary information is an integral part of the F/S, has this information been covered by the auditor\'s opinion? (CAS 700.53)</p>'),
        q('si313-q3', '<p>If the supplementary information is not considered an integral part of the F/S:</p>', [
          q('si313-q3a', '<p>Is the supplementary information presented in a way that sufficiently and clearly differentiates it from the audited F/S (or has management been requested to change the presentation to differentiate it)? (CAS 700.54)</p>'),
          q('si313-q3b', '<p>If not, and management refuses to change it, does the auditor\'s report identify the supplementary information and explain that it has not been audited? (CAS 700.54)</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-si313-2',
      title: '2. Other Information',
      questions: [
        q('si313-q4', '<p>Has a discussion with management occurred to determine which document(s) comprise the annual report and the timing of its planned issuance? (CAS 720.13(a))</p>'),
        q('si313-q5', '<p>Has the other information been obtained in a timely manner (final version obtained prior to the date of the auditor\'s report, if possible)? (CAS 720.13(b))</p>'),
        q('si313-q6', '<p>If some or all of the other information will not be available until after the date of the auditor\'s report, has management been requested to provide a written representation that the final version will be provided when available, and prior to its issuance by the entity? (CAS 720.13(c))</p>'),
        q('si313-q7', '<p>Has the other information been read to ensure consistency with the F/S and knowledge obtained in the audit, and to ensure there are no indications that other information not related to the F/S is materially misstated? (CAS 720.14–16)</p><p>If a material inconsistency exists, discuss with management and perform procedures to determine whether:</p>', [
          q('si313-q7a', '<p>A material misstatement of other information exists?</p>'),
          q('si313-q7b', '<p>A material misstatement of the F/S exists?</p>'),
          q('si313-q7c', '<p>If the understanding of the entity and its environment needs to be updated?</p>'),
        ]),
        q('si313-q8', '<p>If other information is obtained <strong>before</strong> the date of the auditor\'s report and a material misstatement of the other information exists, have the following actions been taken?</p>', [
          q('si313-q8a', '<p>Request management to make the correction and determine the correction has been made?</p>'),
          q('si313-q8b', '<p>If management refuses to make the correction, communicate with TCWG and request the correction?</p>'),
          q('si313-q8c', '<p>If the correction is not made: consider the implications for the auditor\'s report and communicate with TCWG; or withdraw from the audit? (CAS 720.17–18)</p>'),
        ]),
        q('si313-q9', '<p>If other information is obtained <strong>after</strong> the date of the auditor\'s report and a material misstatement of the other information exists, have the following actions been taken?</p>', [
          q('si313-q9a', '<p>Request management to make the correction and determine the correction has been made?</p>'),
          q('si313-q9b', '<p>If management refuses to make the correction, communicate with TCWG and request the correction?</p>'),
          q('si313-q9c', '<p>If the correction is not made, consider the firm\'s legal rights and obligations to seek to have the uncorrected material misstatement appropriately brought to the attention of users? (CAS 720.17, 19)</p>'),
        ]),
        q('si313-q10', '<p>If one of the following circumstances applies at the date of the audit report, does the audit report include a separate section with the heading "Other Information" and the details required in CAS 720.22?</p>', [
          q('si313-q10a', '<p>For an audit of F/S of a listed entity, the auditor has obtained, or expects to obtain, the other information?</p>'),
          q('si313-q10b', '<p>For an audit of F/S of an entity other than a listed entity, the auditor has obtained some or all of the other information?</p>'),
        ]),
        q('si313-q11', '<p>When the auditor\'s report is required to include an Other Information section, has the following been included?</p>', [
          q('si313-q11a', '<p>A statement that management is responsible for the other information?</p>'),
          q('si313-q11b', '<p>An identification of the other information obtained by the auditor prior to the date of the auditor\'s report?</p>'),
          q('si313-q11c', '<p>A statement that the auditor\'s opinion does not cover the other information?</p>'),
          q('si313-q11d', '<p>A description of the auditor\'s responsibilities relating to reading, considering and reporting on other information?</p>'),
          q('si313-q11e', '<p>When other information has been obtained prior to the date of the auditor\'s report, either a statement that the auditor has nothing to report, or a statement describing the uncorrected material misstatement? (CAS 720.22–23)</p>'),
        ]),
        q('si313-q12', '<p>If law or regulation requires specific layout or wording for the other information in the auditor\'s report, does the report include, at a minimum, identification of the other information, a description of the auditor\'s responsibilities, and an explicit statement addressing the outcome? (CAS 720.24)</p>'),
        q('si313-q13', '<p>Has the final version of the other information on which work has been performed been included in the audit file? (CAS 720.25(b))</p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-supplementary-info',
    title: 'Checklist — Supplementary and Other Information',
    description: 'Checklist for documenting audit procedures related to supplementary information presented with the audited financial statements and other information included in an entity\'s annual report.',
    objective: 'To document the audit procedures required in relation to supplementary information presented with the audited financial statements (CAS 700.53–54) and other information included in an entity\'s annual report (CAS 720.25(a)).',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Checklist — Management Representations (314) template
export const generateManagementRepresentationsChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[]): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer: '', ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-mr314-1',
      title: '1. General Requirements',
      questions: [
        q('mr314-q1', '<p>Is the letter addressed to the auditor? (CAS 580.15)</p>'),
        q('mr314-q2', '<p>Is the letter dated on or before the date of the auditor\'s report? (CAS 580.14)</p><p><em>Note: The date should not be after the date of the audit report, but can be before, but as near as practicable as possible. If the representation letter is not dated the same as the audit report, documentation should be included to explain the situation, or obtaining a new representation letter should be considered.</em></p>'),
        q('mr314-q3', '<p>Have any written representations that support other audit evidence relevant to the F/S or one or more specific assertions in the F/S been obtained? (CAS 580.13)</p>'),
        q('mr314-q4', '<p>Have representations that relate to all periods and F/S referred to in the auditor\'s opinion and report been obtained? (CAS 580.14; 710.9)</p>'),
        q('mr314-q5', '<p>Has a summary of uncorrected misstatements been included in, or attached to, the management representation letter? (CAS 450.14)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-2',
      title: '2. Management\'s Responsibilities',
      questions: [
        q('mr314-q6', '<p>Have the required written management representations been obtained from management with the appropriate responsibilities for the F/S and knowledge of the matters concerned stating that management:</p>', [
          q('mr314-q6a', '<p>Has fulfilled its responsibility for the preparation of the F/S in accordance with the AFRF, including, where relevant, their fair presentation, as set out in the terms of the audit engagement?</p>'),
          q('mr314-q6b', '<p>Has provided all relevant information and access as agreed in the terms of the audit engagement?</p>'),
          q('mr314-q6c', '<p>Has recorded and reflected all transactions in the F/S? (CAS 580.9–12)</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-3',
      title: '3. Representations Required by Other CASs',
      questions: [
        q('mr314-q7', '<p><strong>Fraud</strong> — Have the required written management representations been obtained from management and, where appropriate, TCWG that they:</p>', [
          q('mr314-q7a', '<p>Acknowledge their responsibility for the design, implementation and maintenance of internal control to prevent and detect fraud?</p>'),
          q('mr314-q7b', '<p>Have disclosed the results of management\'s assessment of the risk that the F/S may be materially misstated as a result of fraud?</p>'),
          q('mr314-q7c', '<p>Have disclosed their knowledge of fraud, or suspected fraud, affecting the entity involving: management; employees who have significant roles in internal control; or others where the fraud could have a material effect on the F/S?</p>'),
          q('mr314-q7d', '<p>Have disclosed their knowledge of any allegations of fraud, or suspected fraud, affecting the entity\'s F/S communicated by employees, former employees, analysts, regulators or others? (CAS 240.40)</p>'),
        ]),
        q('mr314-q8', '<p><strong>Non-compliance with laws and regulations</strong> — Have disclosed all known instances of non-compliance or suspected non-compliance with laws and regulations whose effects should be considered when preparing F/S? (CAS 250.17)</p>'),
        q('mr314-q9', '<p><strong>Litigation and claims</strong> — Have disclosed all known actual or possible litigation and claims whose effects should be considered when preparing the F/S and they have been accounted for and disclosed in accordance with the AFRF? (CAS 501.12)</p>'),
        q('mr314-q10', '<p><strong>Related parties</strong> — Have the required representations been obtained that management:</p>', [
          q('mr314-q10a', '<p>Has disclosed the identity of the entity\'s related parties and all the related party relationships and transactions of which they are aware?</p>'),
          q('mr314-q10b', '<p>Has appropriately accounted for and disclosed such relationships and transactions in accordance with the requirements of the framework? (CAS 550.26)</p>'),
        ]),
        q('mr314-q11', '<p><strong>Accounting estimates</strong> — Have used methods, significant assumptions and data in the accounting estimates and the related disclosures that are appropriate to achieve recognition, measurement or disclosure in accordance with the AFRF? (CAS 540.37)</p>'),
        q('mr314-q12', '<p><strong>Uncorrected misstatements</strong> — Believe the effects of uncorrected misstatements are immaterial, individually and in aggregate, to the F/S as a whole? (CAS 450.14)</p>'),
        q('mr314-q13', '<p><strong>Subsequent events</strong> — Have adjusted or disclosed all events occurring subsequent to the date of the F/S that require adjustment or disclosure per the AFRF? (CAS 560.9)</p>'),
        q('mr314-q14', '<p><strong>Going concern</strong> — Have the required representations been obtained that management:</p>', [
          q('mr314-q14a', '<p>Confirms the use of the going concern basis of accounting in the preparation of the F/S is appropriate?</p>'),
          q('mr314-q14b', '<p>Has used a method, significant assumptions and data in their assessment of going concern and any related disclosures that is appropriate in the context of the AFRF?</p>'),
          q('mr314-q14c', '<p>In the assessment of going concern, has reflected all events or conditions that may cast significant doubt on the entity\'s ability to continue as a going concern?</p>'),
          q('mr314-q14d', '<p>Has disclosed any events or conditions identified above to the audit team?</p>'),
          q('mr314-q14e', '<p>Has adequately disclosed all matters relevant to going concern in the F/S? (CAS 570.39–40)</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-4',
      title: '4. Comparative Information',
      questions: [
        q('mr314-q15', '<p>Have specific written representations regarding any restatement made to correct a material misstatement in prior period F/S that affect the comparative information been obtained? (CAS 710.9)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-5',
      title: '5. Other Information',
      questions: [
        q('mr314-q16', '<p>As noted on Form 313, if some or all of the other information will not be available until after the date of the auditor\'s report, has management been requested to provide a written representation that the final version will be provided when available, and prior to its issuance by the entity? (CAS 720.13(c))</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-6',
      title: '6. Concerns About Management or Written Representations',
      questions: [
        q('mr314-q17', '<p>Are there any concerns about the competence, integrity, ethical values or diligence of management, or about its commitment to or enforcement of them? If so, has the effect that such concerns may have on the reliability of representations (oral or written) and audit evidence in general been determined? (CAS 580.16)</p>'),
        q('mr314-q18', '<p>Are any written representations inconsistent with other audit evidence? If so, have audit procedures been performed to attempt to resolve the matter? (CAS 580.17)</p><p><em>Note: If the matter remains unresolved, the audit team should reconsider the assessment of the competence, integrity, ethical values or diligence of management, and determine the effect on the reliability of representations and audit evidence in general.</em></p>'),
        q('mr314-q19', '<p>If management has not provided all requested written representations:</p>', [
          q('mr314-q19a', '<p>Has the matter been discussed with management?</p>'),
          q('mr314-q19b', '<p>Has the integrity of management and the effect on the reliability of representations and audit evidence been assessed?</p>'),
          q('mr314-q19c', '<p>Have appropriate actions been taken, including determining the possible effect on the audit opinion? (CAS 580.19)</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-7',
      title: '7. Audit Opinion',
      questions: [
        q('mr314-q20', '<p>If the written representations are determined not to be reliable, has the possible effect on the opinion in the auditor\'s report been determined in accordance with CAS 705 (use Form 306 if the opinion is modified)? (CAS 580.18)</p>'),
        q('mr314-q21', '<p>Has the opinion on the F/S been disclaimed in accordance with CAS 705 (use Form 306) if:</p>', [
          q('mr314-q21a', '<p>There is sufficient doubt about the integrity of management such that the written representations required by procedure 6 are not reliable?</p>'),
          q('mr314-q21b', '<p>Management does not provide the written representations required by procedure 6? (CAS 580.20)</p>'),
        ]),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-management-representations',
    title: 'Checklist — Management Representations',
    description: 'Checklist to check that the CAS requirements related to management representations have been fulfilled prior to issuing the auditor\'s report.',
    objective: 'To check that the CAS requirements related to management representations have been fulfilled prior to issuing the auditor\'s report.',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// ============================================================
// Compilation 2026 — Client Acceptance and Continuance (C1-10)
// Based on the 2026 latest PEG Forms document
// ============================================================
export const generateClientAcceptanceContinuance2026Checklist = (): Checklist => {
  const q = (id: string, text: string, answerType: Question['answerType'] = 'yes-no-na', subQuestions?: Question[]): Question => ({
    id, text, answerType, options: answerType === 'yes-no-na' ? ['Yes', 'No', 'NA'] : answerType === 'yes-no' ? ['Yes', 'No'] : [],
    required: false, answer: '', ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-cac26-header',
      title: 'Engagement Information',
      questions: [
        { id: 'cac26-h1', text: '<p><strong>Prospective entity</strong></p>', answerType: 'long-answer', options: [], required: true, answer: '' },
        { id: 'cac26-h2', text: '<p><strong>Period ended</strong></p>', answerType: 'date', options: [], required: true, answer: '' },
        { id: 'cac26-h3', text: '<p><strong>Nature of basic assignment</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        {
          id: 'cac26-h4',
          text: '<p><strong>Engagement type</strong></p>',
          answerType: 'multiple-choice',
          options: ['New engagement', 'Recurring engagement'],
          required: true,
          answer: ''
        },
        { id: 'cac26-h5', text: '<p><strong>Deadline for completion</strong></p>', answerType: 'date', options: [], required: false, answer: '' },
        { id: 'cac26-h6', text: '<p><strong>Other assignments requested/performed</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
      ],
      isExpanded: true
    },
    {
      id: 'section-cac26-inquiries',
      title: 'Inquiries Made of Management',
      questions: [
        { id: 'cac26-inq1', text: '<p><strong>Name</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '',
          subQuestions: [
            { id: 'cac26-inq1-pos', text: '<p>Position</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'cac26-inq1-date', text: '<p>Date</p>', answerType: 'date', options: [], required: false, answer: '' },
          ]
        },
        { id: 'cac26-inq2', text: '<p><strong>Name</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '',
          subQuestions: [
            { id: 'cac26-inq2-pos', text: '<p>Position</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'cac26-inq2-date', text: '<p>Date</p>', answerType: 'date', options: [], required: false, answer: '' },
          ]
        },
        { id: 'cac26-inq3', text: '<p><strong>Name</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '',
          subQuestions: [
            { id: 'cac26-inq3-pos', text: '<p>Position</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
            { id: 'cac26-inq3-date', text: '<p>Date</p>', answerType: 'date', options: [], required: false, answer: '' },
          ]
        },
      ],
      isExpanded: true,
      note: 'PSC = Procedure successfully completed. FI = Compiled financial information.'
    },
    {
      id: 'section-cac26-1',
      title: '1. Quality Management',
      questions: [
        q('cac26-q1', '<p>Determine whether accepting this engagement would contravene any of the firm\'s quality management policies.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac26-2',
      title: '2. Engagement Risk Factors',
      questions: [
        q('cac26-q2', '<p><strong>New Clients</strong></p>', 'none', [
          q('cac26-q2a', '<p>Indicate who in the firm has knowledge about the prospective client and whether they recommend that this entity be accepted as a new client.</p>'),
          q('cac26-q2b', '<p>Contact the predecessor practitioner to inquire about any reasons the engagement should not be accepted. If no response is received, explain what alternative procedures were performed.</p>'),
        ]),
        q('cac26-q2c', '<p><strong>All Clients</strong></p>', 'none', [
          q('cac26-q2c1', '<p>Make inquiries and perform web searches for any new or emerging engagement risks that would impact the decision to accept or continue with this engagement.</p>'),
          q('cac26-q2c2', '<p>Consider any risk factors identified from other sources.</p>'),
          q('cac26-q2c3', '<p>Based on preliminary understanding, is there any indication that the financial information will be misleading?</p>'),
          q('cac26-q2c4', '<p>Does management understand the limited nature of the engagement?</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac26-3',
      title: '3. Intended Use of FI',
      questions: [
        q('cac26-q3', '<p>Inquire of management about:</p>', 'none', [
          q('cac26-q3a', '<p>Intended use of the FI.</p>'),
          q('cac26-q3b', '<p>Whether the FI is intended to be used by a third party.</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac26-4',
      title: '4. Expected Basis of Accounting',
      questions: [
        q('cac26-q4', '<p>Discuss the expected basis of accounting with management, and obtain management\'s acknowledgement that it is appropriate in the circumstances.</p><p>This acknowledgement is in one of the following forms:</p>', 'none', [
          q('cac26-q4a', '<p>A written communication (e.g., paper or electronic).</p>'),
          q('cac26-q4b', '<p>An oral communication documented in the working paper file.</p>'),
        ]),
      ],
      isExpanded: true,
      note: 'Note: Use of a general purpose framework is considered rare (such as ASPE). In such cases, consideration should be given to whether an audit or review engagement would be more appropriate.'
    },
    {
      id: 'section-cac26-5',
      title: '5. Third-Party Use of the FI',
      questions: [
        q('cac26-q5', '<p>If the FI is intended to be used by a third party, inquire of management about one of the following:</p>', 'none', [
          q('cac26-q5a', '<p>The ability of the third party to request and obtain additional information.</p>'),
          q('cac26-q5b', '<p>Whether the third party agrees with the basis of accounting.</p>'),
        ]),
      ],
      isExpanded: true,
      note: 'Note: If neither a. nor b. above are met, the engagement cannot be accepted unless a general purpose financial reporting framework is used (e.g., Accounting Standards for Private Enterprises). See the note above regarding the use of a general purpose framework.'
    },
    {
      id: 'section-cac26-6',
      title: '6. Agreement of the Terms of Engagement',
      questions: [
        q('cac26-q6', '<p><strong>Has management agreed the terms of engagement, which includes the items discussed in 3. and 4. above?</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac26-7',
      title: '7. Engagement Letter',
      questions: [
        q('cac26-q7a', '<p><strong>New engagements</strong></p><p>Obtain a signed engagement letter before commencing any work on the engagement.</p><p>Ensure that the letter is properly formatted in cases where there are:</p>', 'none', [
          q('cac26-q7a-i', '<p>Anticipated third parties.</p>'),
          q('cac26-q7a-ii', '<p>Third-party access to additional information as per 3. and 5. above.</p>'),
        ]),
        q('cac26-q7b', '<p><strong>Recurring engagements</strong></p><p>Evaluate whether a new engagement letter should be obtained, such as when there has been:</p>', 'none', [
          q('cac26-q7b-i', '<p>An indication that management misunderstands the objective and scope of the engagement.</p>'),
          q('cac26-q7b-ii', '<p>Any revised or special terms of the engagement.</p>'),
          q('cac26-q7b-iii', '<p>A recent change of management or those charged with governance of the entity.</p>'),
          q('cac26-q7b-iv', '<p>A significant change in ownership of the entity.</p>'),
          q('cac26-q7b-v', '<p>A significant change in nature or size of the entity\'s business.</p>'),
          q('cac26-q7b-vi', '<p>A change in legal, regulatory or contractual provisions affecting the entity.</p>'),
          q('cac26-q7b-vii', '<p>An expected change in the use of the compiled financial information.</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac26-8',
      title: '8. Engagement Quality Review',
      questions: [
        q('cac26-q8a', '<p>Are there any circumstances that would require this engagement to be subject to an engagement quality review?</p>'),
        q('cac26-q8b', '<p>If so, has a reviewer been appointed?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-cac26-9',
      title: '9. Other Procedures (Specify)',
      questions: [
        { id: 'cac26-q9', text: '<p><strong>Document any other procedures performed as part of the acceptance/continuance assessment.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
      ],
      isExpanded: true
    },
    {
      id: 'section-cac26-conclusion',
      title: 'Conclusion',
      questions: [
        q('cac26-conc1', '<p>I am satisfied that there are no reasons why we should not accept or retain this client.</p>'),
        q('cac26-conc2', '<p>I am satisfied that any impairment of independence (if any) will be included in our Compilation Engagement Report.</p>'),
        { id: 'cac26-conc-practitioner', text: '<p><strong>Practitioner</strong></p>', answerType: 'long-answer', options: [], required: true, answer: '' },
        { id: 'cac26-conc-pdate', text: '<p><strong>Practitioner Date</strong></p>', answerType: 'date', options: [], required: true, answer: '' },
        { id: 'cac26-conc-prepared', text: '<p><strong>Prepared by</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'cac26-conc-prepdate', text: '<p><strong>Prepared by Date</strong></p>', answerType: 'date', options: [], required: false, answer: '' },
        { id: 'cac26-conc-reviewed', text: '<p><strong>Reviewed by</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'cac26-conc-revdate', text: '<p><strong>Reviewed by Date</strong></p>', answerType: 'date', options: [], required: false, answer: '' },
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-client-acceptance-2026',
    title: 'Client Acceptance and Continuance (2026)',
    description: 'Engagement acceptance/continuance checklist (C1-10) based on the 2026 PEG Forms — Compilations.',
    objective: `Objective: To decide whether the firm can perform the compilation engagement.

This checklist covers:
• Quality management policies
• Engagement risk factors (new and recurring clients)
• Intended use of the financial information (FI)
• Expected basis of accounting
• Third-party use of the FI
• Agreement of terms of engagement
• Engagement letter requirements (new and recurring)
• Engagement quality review
• Conclusion and sign-off`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT-SPECIFIC GENERATORS (CAS / CSQM)
// ─────────────────────────────────────────────────────────────────────────────

// Audit Independence Checklist — CAS 220 / CSQM 1
export const generateAuditIndependenceChecklist = (): Checklist => {
  const q = (id: string, text: string, sub?: Question[]): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer: '', ...(sub ? { subQuestions: sub } : {})
  });
  const la = (id: string, text: string): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer: ''
  });

  const sections: Section[] = [
    {
      id: 'aud-ind-s1',
      title: '1. CSQM 1 Firm-Level Independence Policies',
      questions: [
        q('aud-ind-1a', '<p>Has the firm\'s independence compliance system been reviewed to confirm that accepting this engagement does not contravene any firm-level independence policies under CSQM 1?</p>'),
        q('aud-ind-1b', '<p>Has a conflict-of-interest check been performed using the firm\'s client database (including all related entities, subsidiaries, and affiliated parties)?</p>'),
        q('aud-ind-1c', '<p>Are there any independence issues identified from other assurance or non-assurance services provided by the firm to this client or a related party?</p>'),
        la('aud-ind-1-exp', '<p><strong>Additional Explanation</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s2',
      title: '2. Network Firm Independence',
      questions: [
        q('aud-ind-2a', '<p>Is the firm part of a network as defined in the CPA Canada Code of Professional Conduct?</p>'),
        q('aud-ind-2b', '<p>If yes, have independence requirements been extended to all network firms for this engagement?</p>'),
        q('aud-ind-2c', '<p>Have inquiries been made of all network offices to identify any threats to independence with respect to this client?</p>'),
        la('aud-ind-2-exp', '<p><strong>Additional Explanation</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s3',
      title: '3. Financial Interests in the Client',
      note: 'CPA Canada Code of Professional Conduct — Rule 204.4',
      questions: [
        q('aud-ind-3a', '<p>Do any members of the engagement team (or their immediate family members) hold direct financial interests in the client?</p>'),
        q('aud-ind-3b', '<p>Do any members of the engagement team (or their immediate family members) hold indirect financial interests (through mutual funds, investment funds, or pension funds) in the client that are material to their net worth?</p>'),
        q('aud-ind-3c', '<p>Does the firm hold any financial interest in the client?</p>'),
        q('aud-ind-3d', '<p>Have all identified financial interest threats been evaluated and appropriate safeguards applied (or the individual removed from the engagement team)?</p>'),
        la('aud-ind-3-exp', '<p><strong>Additional Explanation — describe interests identified and safeguards applied</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s4',
      title: '4. Employment and Business Relationships',
      questions: [
        q('aud-ind-4a', '<p>Has any member of the engagement team recently been employed by the client in a key management position (within the past two years)?</p>'),
        q('aud-ind-4b', '<p>Is there any employment negotiation or actual employment offer from the client to a member of the engagement team currently underway?</p>'),
        q('aud-ind-4c', '<p>Are there any close business relationships between members of the engagement team (or their immediate family) and the client or its management?</p>'),
        q('aud-ind-4d', '<p>Do any engagement team members serve on the board of directors or in any governance capacity of the client?</p>'),
        la('aud-ind-4-exp', '<p><strong>Additional Explanation</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s5',
      title: '5. Family and Personal Relationships',
      questions: [
        q('aud-ind-5a', '<p>Does any member of the engagement team have an immediate family member who is a director, officer, or employee of the client in a position to exert significant influence over the financial statements?</p>'),
        q('aud-ind-5b', '<p>Does any member of the engagement team have a close personal relationship with a member of client management or TCWG that could create a familiarity or intimidation threat?</p>'),
        la('aud-ind-5-exp', '<p><strong>Additional Explanation</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s6',
      title: '6. Non-Assurance Services (Self-Review Threat)',
      note: 'CAS 220.16 — The engagement partner shall remain alert throughout the audit for evidence of non-compliance with relevant ethical requirements.',
      questions: [
        q('aud-ind-6a', '<p>Does the firm provide bookkeeping, accounting, or financial statement preparation services to the client?</p>'),
        q('aud-ind-6b', '<p>Does the firm provide internal audit services to the client?</p>'),
        q('aud-ind-6c', '<p>Does the firm provide valuation services, appraisals, or fairness opinions that are material to the financial statements?</p>'),
        q('aud-ind-6d', '<p>Does the firm provide IT systems design or implementation services for systems that generate information forming part of the financial statements?</p>'),
        q('aud-ind-6e', '<p>Does the firm provide legal services, HR or payroll services, or corporate finance advisory services that could create a management participation or advocacy threat?</p>'),
        q('aud-ind-6f', '<p>For all non-assurance services identified above: have safeguards been applied that reduce the self-review threat to an acceptable level (e.g., separate teams, independent review)?</p>'),
        la('aud-ind-6-exp', '<p><strong>Describe non-assurance services provided and safeguards applied</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s7',
      title: '7. Fees, Gifts, and Hospitality',
      questions: [
        q('aud-ind-7a', '<p>Are audit fees overdue from prior periods? If yes, has this been evaluated as a self-interest threat?</p>'),
        q('aud-ind-7b', '<p>Do fees from this client (or client group) exceed 15% of total firm revenues? If yes, have appropriate safeguards (e.g., pre-issuance review by external party) been applied?</p>'),
        q('aud-ind-7c', '<p>Are any fee arrangements contingent on the outcome of the engagement or a transaction (e.g., success fees)?</p>'),
        q('aud-ind-7d', '<p>Have any gifts or hospitality been received from the client that are more than clearly insignificant in value?</p>'),
        la('aud-ind-7-exp', '<p><strong>Additional Explanation</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s8',
      title: '8. Long Association (Familiarity Threat)',
      note: 'CAS 220 / CSQM 1 — Particularly relevant for listed entities and public interest entities.',
      questions: [
        q('aud-ind-8a', '<p>Has the engagement partner been involved with this client for 7 or more consecutive years?</p>'),
        q('aud-ind-8b', '<p>Has the key audit partner rotation requirement been met (where applicable under CSQM 1 or regulatory requirements)?</p>'),
        q('aud-ind-8c', '<p>Has the Senior Manager on the file been involved for an extended period (5+ years) without rotation?</p>'),
        q('aud-ind-8d', '<p>Have any safeguards been applied to address familiarity threat arising from long association (e.g., independent partner review, EQC review)?</p>'),
        la('aud-ind-8-exp', '<p><strong>Additional Explanation</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s9',
      title: '9. Independence Declarations — Engagement Team',
      questions: [
        q('aud-ind-9a', '<p>Has each member of the engagement team completed and signed the firm\'s annual independence declaration for the current year?</p>'),
        q('aud-ind-9b', '<p>Has each member of the engagement team confirmed independence with respect to this specific client (client-specific independence confirmation)?</p>'),
        q('aud-ind-9c', '<p>Has the Engagement Quality Control Reviewer (EQCR), if applicable, confirmed independence with respect to this client?</p>'),
        la('aud-ind-9-exp', '<p><strong>List all engagement team members and their confirmation dates</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s10',
      title: '10. Conclusion',
      questions: [
        q('aud-ind-conc1', '<p>Based on the assessment above, I am satisfied that the firm and all members of the engagement team are independent of the client and that no independence threats exist that have not been adequately addressed by safeguards.</p>'),
        q('aud-ind-conc2', '<p>Any identified independence matters have been communicated to the appropriate level within the firm (e.g., Risk Management Partner, Ethics Partner) and have been resolved satisfactorily.</p>'),
        { id: 'aud-ind-ep', text: '<p><strong>Engagement Partner</strong></p>', answerType: 'long-answer' as const, options: [], required: true, answer: '' },
        { id: 'aud-ind-ep-date', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: true, answer: '' },
        { id: 'aud-ind-prepared', text: '<p><strong>Prepared by</strong></p>', answerType: 'long-answer' as const, options: [], required: false, answer: '' },
        { id: 'aud-ind-prepdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: false, answer: '' },
        { id: 'aud-ind-reviewed', text: '<p><strong>Reviewed by (EQCR)</strong></p>', answerType: 'long-answer' as const, options: [], required: false, answer: '' },
        { id: 'aud-ind-revdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: false, answer: '' },
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-independence',
    title: 'Independence & Ethical Requirements (Audit)',
    description: 'Independence checklist for audit engagements — CAS 220, CSQM 1, CPA Canada Code of Professional Conduct.',
    objective: `Objective: To identify, evaluate, and document any threats to independence and confirm that all members of the engagement team are independent of the client.

This checklist addresses:
• CSQM 1 firm-level independence policies
• Network firm independence
• Financial interests in the client
• Employment and business relationships
• Family and personal relationships
• Non-assurance services (self-review threat)
• Fees, gifts, and hospitality
• Long association / familiarity threat
• Engagement team independence declarations`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// AML Compliance Checklist — PCMLTFA / FINTRAC (Canada)
export const generateAMLComplianceChecklist = (): Checklist => {
  const q = (id: string, text: string, sub?: Question[]): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer: '', ...(sub ? { subQuestions: sub } : {})
  });
  const la = (id: string, text: string): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer: ''
  });

  const sections: Section[] = [
    {
      id: 'aud-aml-s1',
      title: '1. Applicability Determination',
      note: 'Public accountants in Canada are reporting entities under PCMLTFA when providing specific services.',
      questions: [
        q('aud-aml-1a', '<p>Is the firm a reporting entity under the Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA) for this engagement?</p>'),
        q('aud-aml-1b', '<p>Is the client a federally or provincially regulated financial institution, or otherwise exempt from FINTRAC reporting obligations?</p>'),
        la('aud-aml-1-exp', '<p><strong>Additional Explanation</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s2',
      title: '2. Client Identification and Verification (PCMLTFA s. 9.1)',
      questions: [
        q('aud-aml-2a', '<p>Has the client\'s legal name been verified using acceptable identification documents or a reliable independent source?</p>'),
        q('aud-aml-2b', '<p>If the client is a corporation: has a certificate of corporate status (or equivalent) been obtained and reviewed to confirm legal existence, registered name, and address?</p>'),
        q('aud-aml-2c', '<p>If the client is a trust, partnership, or other entity: has the applicable governing document (trust deed, partnership agreement) been reviewed?</p>'),
        q('aud-aml-2d', '<p>Has the identity of the individual(s) authorizing the engagement on behalf of the client been verified?</p>'),
        la('aud-aml-2-exp', '<p><strong>Describe identification documents obtained and verification method used</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s3',
      title: '3. Beneficial Ownership Identification (PCMLTFA Reg. 11.1)',
      questions: [
        q('aud-aml-3a', '<p>Have all individuals who own or control, directly or indirectly, 25% or more of the client entity been identified?</p>'),
        q('aud-aml-3b', '<p>Have the identities of all beneficial owners been verified using reliable and independent sources?</p>'),
        q('aud-aml-3c', '<p>Where ownership is through a chain of entities, has the chain been traced to identify the ultimate beneficial owner(s)?</p>'),
        q('aud-aml-3d', '<p>Has the information regarding beneficial ownership been documented in the working papers?</p>'),
        la('aud-aml-3-exp', '<p><strong>List beneficial owners (≥25%) and verification method</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s4',
      title: '4. Politically Exposed Persons (PEP) and Heads of International Organizations (HIO)',
      note: 'PCMLTFA Regulations — accountants must make reasonable measures to determine PEP/HIO status.',
      questions: [
        q('aud-aml-4a', '<p>Have reasonable measures been taken to determine whether the client, beneficial owner(s), or controlling party is a Politically Exposed Domestic Person (PEDP)?</p>'),
        q('aud-aml-4b', '<p>Have reasonable measures been taken to determine whether the client is a Politically Exposed Foreign Person (PEFP) or Head of an International Organization (HIO)?</p>'),
        q('aud-aml-4c', '<p>If a PEP or HIO has been identified: has senior management approval been obtained and enhanced due diligence applied?</p>'),
        la('aud-aml-4-exp', '<p><strong>Document PEP/HIO screening results and source used</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s5',
      title: '5. Sanctions Screening',
      questions: [
        q('aud-aml-5a', '<p>Has the client and its beneficial owner(s) been screened against the OSFI Consolidated Canadian Autonomous Sanctions List?</p>'),
        q('aud-aml-5b', '<p>Has the client and its beneficial owner(s) been screened against the United Nations Security Council (UNSC) consolidated sanctions list?</p>'),
        q('aud-aml-5c', '<p>Are there any matches to sanctions lists? If yes, has the engagement been declined and the matter escalated to the firm\'s Risk Management Partner?</p>'),
        la('aud-aml-5-exp', '<p><strong>Document screening method, date performed, and results</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s6',
      title: '6. Risk Assessment (FINTRAC Risk-Based Approach)',
      questions: [
        q('aud-aml-6a', '<p>Has a risk assessment been completed for this client, considering: industry/sector risk, geographic risk, client risk factors, and the nature of transactions?</p>'),
        q('aud-aml-6b', '<p>Is the source of the client\'s funds/revenue consistent with the stated business purpose?</p>'),
        q('aud-aml-6c', '<p>Is the client operating in a high-risk jurisdiction (as identified by FATF or FINTRAC guidance)?</p>'),
        la('aud-aml-6-rating', '<p><strong>Overall ML/TF risk rating: Low / Medium / High</strong></p>'),
        la('aud-aml-6-rationale', '<p><strong>Rationale for risk rating</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s7',
      title: '7. Enhanced Due Diligence (High-Risk Clients)',
      note: 'Required for PEPs, HIOs, clients in high-risk jurisdictions, and clients assessed as high risk.',
      questions: [
        q('aud-aml-7a', '<p>Has Enhanced Due Diligence (EDD) been applied where required?</p>'),
        q('aud-aml-7b', '<p>For EDD: Has additional information been obtained regarding the source of funds/wealth and nature of business activities?</p>'),
        q('aud-aml-7c', '<p>For EDD: Has senior management approval been documented for accepting or continuing the engagement?</p>'),
        la('aud-aml-7-exp', '<p><strong>Describe EDD measures applied</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s8',
      title: '8. Record-Keeping and STR Obligations',
      questions: [
        q('aud-aml-8a', '<p>Have all client identification and verification records been retained in the file (minimum 5-year retention under PCMLTFA s. 6)?</p>'),
        q('aud-aml-8b', '<p>Have any transactions been identified that give rise to reasonable grounds to suspect money laundering or terrorist financing?</p>'),
        q('aud-aml-8c', '<p>If yes: has a Suspicious Transaction Report (STR) been filed with FINTRAC and escalated to the firm\'s Compliance Officer?</p>'),
        la('aud-aml-8-exp', '<p><strong>Document any STR considerations or filings</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s9',
      title: '9. Conclusion',
      questions: [
        q('aud-aml-conc1', '<p>All required AML/ATF procedures under PCMLTFA and FINTRAC guidance have been performed and documented for this engagement.</p>'),
        q('aud-aml-conc2', '<p>No suspicious transactions or unresolved high-risk indicators have been identified that would preclude acceptance or continuance of this engagement.</p>'),
        { id: 'aud-aml-ep', text: '<p><strong>Engagement Partner / CAMLO</strong></p>', answerType: 'long-answer' as const, options: [], required: true, answer: '' },
        { id: 'aud-aml-epdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: true, answer: '' },
        { id: 'aud-aml-prepared', text: '<p><strong>Prepared by</strong></p>', answerType: 'long-answer' as const, options: [], required: false, answer: '' },
        { id: 'aud-aml-prepdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: false, answer: '' },
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-aml',
    title: 'Anti-Money Laundering (AML) Compliance',
    description: 'AML/ATF compliance checklist for audit engagements — PCMLTFA, FINTRAC, and CPA Canada AML guidance.',
    objective: `Objective: To fulfill the firm's obligations as a reporting entity under the Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA).

This checklist addresses:
• Client identification and verification (PCMLTFA s. 9.1)
• Beneficial ownership determination
• PEP/HIO screening
• Sanctions screening (OSFI / UNSC)
• Risk assessment (FINTRAC risk-based approach)
• Enhanced Due Diligence (EDD) for high-risk clients
• Record-keeping (minimum 5-year retention)
• Suspicious Transaction Reporting (STR) obligations`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Audit Materiality Worksheet — CAS 320 / CAS 450
export const generateAuditMaterialityChecklist = (): Checklist => {
  const q = (id: string, text: string): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer: ''
  });
  const la = (id: string, text: string): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer: ''
  });

  const sections: Section[] = [
    {
      id: 'aud-mat-s1',
      title: '1. Benchmark Selection and Justification (CAS 320.A3–A6)',
      note: 'Select the benchmark most appropriate to the financial statements taken as a whole, considering the nature and circumstances of the entity and the primary users of the financial statements.',
      questions: [
        la('aud-mat-1-primary', '<p><strong>Primary benchmark selected</strong> (e.g., profit before tax, total revenues, total assets, total expenses, net assets)</p>'),
        la('aud-mat-1-justification', '<p><strong>Justification for selected benchmark</strong> — explain why this benchmark is appropriate for the primary users of the financial statements:</p>'),
        q('aud-mat-1a', '<p>Is the benchmark consistently applied from the prior year? If not, has the change been documented and approved?</p>'),
        q('aud-mat-1b', '<p>Is profit/income volatile or subject to unusual one-time items? If yes, has an adjusted or normalized figure been used?</p>'),
        la('aud-mat-1-adj', '<p><strong>Describe any adjustments made to normalize the benchmark (e.g., excluding one-time items, averaging)</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s2',
      title: '2. Overall Materiality (CAS 320.10)',
      questions: [
        la('aud-mat-2-benchmark-value', '<p><strong>Benchmark figure — $ amount</strong></p>'),
        la('aud-mat-2-percentage', '<p><strong>Percentage applied to benchmark</strong> (e.g., 5% of PBT, 0.5%–1% of revenues, 1%–2% of total assets)</p>'),
        la('aud-mat-2-overall', '<p><strong>Overall materiality — calculated amount ($)</strong></p>'),
        q('aud-mat-2a', '<p>Is overall materiality consistent with the prior year? If not, has the change been documented and the impact on audit scope assessed?</p>'),
        la('aud-mat-2-prior', '<p><strong>Prior year overall materiality ($) — for reference</strong></p>'),
        la('aud-mat-2-rationale', '<p><strong>Additional rationale for overall materiality determination</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s3',
      title: '3. Performance Materiality (CAS 320.11)',
      note: 'Performance materiality reduces the risk that the aggregate of uncorrected and undetected misstatements exceeds overall materiality. Typically set at 50–75% of overall materiality.',
      questions: [
        la('aud-mat-3-percentage', '<p><strong>Performance materiality percentage applied to overall materiality (e.g., 75%)</strong></p>'),
        la('aud-mat-3-amount', '<p><strong>Performance materiality — calculated amount ($)</strong></p>'),
        la('aud-mat-3-rationale', '<p><strong>Rationale for the percentage selected</strong> — consider prior year uncorrected misstatements, audit risk assessment, and complexity of the entity:</p>'),
        q('aud-mat-3a', '<p>Were there significant uncorrected misstatements in the prior year that support a lower performance materiality?</p>'),
        q('aud-mat-3b', '<p>Are there higher inherent risk areas (e.g., complex transactions, estimates) that support a lower performance materiality?</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s4',
      title: '4. Clearly Trivial Threshold (CAS 450.A2)',
      note: 'Misstatements below the clearly trivial threshold are not accumulated. Typically set at 3–5% of overall materiality.',
      questions: [
        la('aud-mat-4-percentage', '<p><strong>Clearly trivial percentage applied to overall materiality (e.g., 5%)</strong></p>'),
        la('aud-mat-4-amount', '<p><strong>Clearly trivial threshold — calculated amount ($)</strong></p>'),
        la('aud-mat-4-rationale', '<p><strong>Rationale for clearly trivial threshold</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s5',
      title: '5. Specific Materiality for Sensitive Areas (CAS 320.A13)',
      note: 'Specific materiality may be set for particular classes of transactions, account balances, or disclosures where misstatements of lesser amounts could reasonably be expected to influence user decisions.',
      questions: [
        q('aud-mat-5a', '<p>Are there account balances, transactions, or disclosures for which a lower specific materiality is appropriate (e.g., related party transactions, regulatory thresholds, executive compensation)?</p>'),
        la('aud-mat-5-areas', '<p><strong>Identify specific materiality areas and amounts:</strong></p><p>Area 1: _______________ Amount: $_______________</p><p>Area 2: _______________ Amount: $_______________</p><p>Area 3: _______________ Amount: $_______________</p>'),
        la('aud-mat-5-rationale', '<p><strong>Rationale for specific materiality determinations</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s6',
      title: '6. Materiality Summary',
      questions: [
        la('aud-mat-6-summary', '<p><strong>Complete the materiality summary:</strong></p><p>Benchmark selected: _______________</p><p>Benchmark amount: $_______________</p><p>Overall Materiality: $_______________</p><p>Performance Materiality: $_______________ (___% of OM)</p><p>Clearly Trivial Threshold: $_______________ (___% of OM)</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s7',
      title: '7. Revision of Materiality During the Audit (CAS 320.12–14)',
      questions: [
        q('aud-mat-7a', '<p>Has materiality been revised during the audit due to new information or significant changes in circumstances?</p>'),
        q('aud-mat-7b', '<p>If revised downward: has the impact on the nature, timing, and extent of audit procedures been reassessed?</p>'),
        la('aud-mat-7-detail', '<p><strong>If revised: document the reason for revision, new amounts, and impact on audit procedures</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s8',
      title: '8. Sign-Off',
      questions: [
        q('aud-mat-conc1', '<p>I am satisfied that the materiality amounts determined above are appropriate for this engagement based on the entity\'s financial profile, risk assessment, and the needs of the primary users.</p>'),
        { id: 'aud-mat-ep', text: '<p><strong>Engagement Partner</strong></p>', answerType: 'long-answer' as const, options: [], required: true, answer: '' },
        { id: 'aud-mat-epdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: true, answer: '' },
        { id: 'aud-mat-prepared', text: '<p><strong>Prepared by</strong></p>', answerType: 'long-answer' as const, options: [], required: false, answer: '' },
        { id: 'aud-mat-prepdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: false, answer: '' },
        { id: 'aud-mat-reviewed', text: '<p><strong>Reviewed by</strong></p>', answerType: 'long-answer' as const, options: [], required: false, answer: '' },
        { id: 'aud-mat-revdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: false, answer: '' },
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-materiality',
    title: 'Materiality (CAS 320)',
    description: 'Materiality determination worksheet for audit engagements — CAS 320 and CAS 450.',
    objective: `Objective: To establish overall materiality, performance materiality, and the clearly trivial threshold for the audit, and to document the rationale for each determination.

This worksheet addresses:
• Benchmark selection and justification (CAS 320.A3–A6)
• Overall materiality (CAS 320.10)
• Performance materiality (CAS 320.11)
• Clearly trivial threshold (CAS 450.A2)
• Specific materiality for sensitive areas (CAS 320.A13)
• Revision of materiality during the audit (CAS 320.12–14)`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Audit Engagement Letter — CAS 210 (Letter format — rendered by LetterView)
export const generateAuditEngagementLetterChecklist = (): Checklist => {
  const la = (id: string, text: string): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer: ''
  });
  const q = (id: string, text: string): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'], required: false, answer: ''
  });

  const sections: Section[] = [
    {
      id: 'aud-el-header',
      title: 'Letter Header',
      questions: [
        la('aud-el-date', '<p><strong>Date of Letter</strong></p>'),
        la('aud-el-addressee', '<p><strong>Addressed To</strong> (name and title of management representative or TCWG)</p>'),
        la('aud-el-entity', '<p><strong>Entity Name</strong></p>'),
        la('aud-el-address', '<p><strong>Entity Address</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-s1',
      title: '1. Objective and Scope of the Audit (CAS 210.10(a))',
      questions: [
        la('aud-el-1-period', '<p><strong>Audit period:</strong> Financial statements for the year ended _______________</p>'),
        la('aud-el-1-framework', '<p><strong>Applicable financial reporting framework</strong> (e.g., ASPE, IFRS, Public Sector Accounting Standards)</p>'),
        la('aud-el-1-scope', '<p><strong>Scope of the audit:</strong></p><p>We will audit the financial statements of [Entity Name] which comprise the statement of financial position as at [Year End], and the statements of income, retained earnings, and cash flows for the year then ended, and notes to the financial statements. Our audit will be conducted in accordance with Canadian Auditing Standards (CAS).</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-s2',
      title: '2. Auditor\'s Responsibilities (CAS 210.10(b))',
      questions: [
        la('aud-el-2-resp', '<p><strong>Auditor\'s responsibilities:</strong></p><p>Our responsibility is to express an opinion on these financial statements based on our audit. We will conduct our audit in accordance with Canadian Auditing Standards (CAS). Those standards require that we comply with ethical requirements and plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement, whether due to fraud or error.</p><p>An audit involves performing procedures to obtain audit evidence about the amounts and disclosures in the financial statements. The procedures selected depend on our judgment, including the assessment of the risks of material misstatement, whether due to fraud or error. We also evaluate the appropriateness of accounting policies used, the reasonableness of accounting estimates made by management, and the overall presentation of the financial statements.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-s3',
      title: '3. Management\'s Responsibilities (CAS 210.10(c))',
      questions: [
        la('aud-el-3-mgmt', '<p><strong>Management\'s responsibilities:</strong></p><p>Our audit will be conducted on the basis that management acknowledges and understands that it has the responsibility:</p><p>(a) For the preparation and fair presentation of the financial statements in accordance with [applicable framework];</p><p>(b) For such internal control as management determines is necessary to enable the preparation of financial statements that are free from material misstatement, whether due to fraud or error; and</p><p>(c) To provide us with: (i) access to all information relevant to the preparation of the financial statements; (ii) additional information we may request; and (iii) unrestricted access to persons from whom we determine it necessary to obtain audit evidence.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-s4',
      title: '4. Inherent Limitations of the Audit',
      questions: [
        la('aud-el-4-limit', '<p><strong>Inherent limitations statement:</strong></p><p>Because of the inherent limitations of an audit, together with the inherent limitations of internal control, there is an unavoidable risk that some material misstatements may not be detected, even though the audit is properly planned and performed in accordance with CAS.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-s5',
      title: '5. Form of the Auditor\'s Report',
      questions: [
        la('aud-el-5-report', '<p><strong>Expected form of the auditor\'s report:</strong></p><p>In circumstances where we are able to express an unmodified opinion, our report will be in the standard form for an audit of financial statements prepared in accordance with [applicable framework]. We draw your attention to the fact that our opinion is not a guarantee; it provides reasonable but not absolute assurance.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-s6',
      title: '6. Fees and Billing Arrangements',
      questions: [
        la('aud-el-6-fees', '<p><strong>Fee arrangement:</strong></p><p>Our fees for the audit services will be based on [time spent at our standard hourly rates / a fixed fee of $___________]. We will provide an estimate before commencing work and will advise you promptly if we believe the estimate will be exceeded. Out-of-pocket expenses will be billed separately.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-s7',
      title: '7. Other Services and Matters',
      questions: [
        q('aud-el-7a', '<p>Is this engagement subject to an Engagement Quality Control Review (EQCR)?</p>'),
        la('aud-el-7-other', '<p><strong>Other services / other matters to address</strong> (e.g., tax returns, use of specialists, component auditors, predecessor auditor, restriction on use of the report):</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-closing',
      title: '8. Signatures and Agreement',
      questions: [
        la('aud-el-close', '<p><strong>Closing paragraph:</strong></p><p>Please sign and return the attached copy of this letter to indicate your acknowledgement of, and agreement with, the arrangements for our audit of the financial statements including our respective responsibilities.</p>'),
        la('aud-el-firm', '<p><strong>Firm name and engagement partner signature</strong></p>'),
        la('aud-el-firmdate', '<p><strong>Date</strong></p>'),
        la('aud-el-mgmt', '<p><strong>Acknowledged and agreed on behalf of [Entity Name]</strong></p><p>Name: _______________ Title: _______________</p>'),
        la('aud-el-mgmtdate', '<p><strong>Date acknowledged by management</strong></p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-engagement-letter',
    title: 'Engagement Letter — Audit',
    description: 'Audit engagement letter — CAS 210 (Agreeing the Terms of Audit Engagements).',
    objective: `Objective: To establish the terms of the audit engagement in writing, documenting the objective and scope, the auditor's and management's responsibilities, and the form of the auditor's report.

Reference: CAS 210 — Agreeing the Terms of Audit Engagements.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// TCWG Planning Communication — CAS 260 (Letter format — rendered by LetterView)
export const generateTCWGPlanningCommunicationChecklist = (): Checklist => {
  const la = (id: string, text: string): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer: ''
  });
  const q = (id: string, text: string): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'], required: false, answer: ''
  });

  const sections: Section[] = [
    {
      id: 'aud-tcwg-pl-header',
      title: 'Letter Header',
      questions: [
        la('tcwg-pl-date', '<p><strong>Date of Communication</strong></p>'),
        la('tcwg-pl-addressee', '<p><strong>Addressed To</strong> (Those Charged with Governance — Board of Directors / Audit Committee)</p>'),
        la('tcwg-pl-entity', '<p><strong>Entity Name</strong></p>'),
        la('tcwg-pl-period', '<p><strong>Audit period — financial statements for the year ended:</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s1',
      title: '1. Purpose of Communication (CAS 260.14)',
      questions: [
        la('tcwg-pl-1-purpose', '<p><strong>Purpose statement:</strong></p><p>CAS 260 requires us to communicate with those charged with governance our overall audit approach and strategy before the audit begins. This letter fulfills that requirement and is intended to provide transparency about our planned audit scope, timing, and focus areas.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s2',
      title: '2. Our Responsibilities as Auditors',
      questions: [
        la('tcwg-pl-2-resp', '<p><strong>Our responsibilities:</strong></p><p>Our objective is to obtain reasonable assurance about whether the financial statements are free from material misstatement, whether due to fraud or error, and to issue an auditor\'s report that includes our opinion. Reasonable assurance is a high level of assurance, but is not a guarantee that an audit conducted in accordance with CASs will always detect a material misstatement when it exists. Our audit opinion is not a guarantee of the accuracy or completeness of the financial statements.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s3',
      title: '3. Overall Audit Approach and Engagement Team',
      questions: [
        la('tcwg-pl-3-approach', '<p><strong>Audit approach:</strong></p><p>Our audit approach is [risk-based / substantive / combined]. We will obtain an understanding of the entity and its environment, identify and assess risks of material misstatement, and design and perform audit procedures responsive to those risks.</p>'),
        la('tcwg-pl-3-team', '<p><strong>Engagement team:</strong></p><p>Engagement Partner: _______________</p><p>Senior Manager / Manager: _______________</p><p>Staff: _______________</p><p>EQCR (if applicable): _______________</p>'),
        la('tcwg-pl-3-timeline', '<p><strong>Planned timeline:</strong></p><p>Interim procedures: _______________</p><p>Year-end fieldwork: _______________</p><p>Expected report issuance: _______________</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s4',
      title: '4. Significant Audit Focus Areas',
      questions: [
        la('tcwg-pl-4-focus', '<p><strong>Key areas of audit focus identified during planning:</strong></p><p>1. _______________</p><p>2. _______________</p><p>3. _______________</p><p>4. _______________</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s5',
      title: '5. Materiality',
      questions: [
        la('tcwg-pl-5-mat', '<p><strong>Materiality for planning purposes:</strong></p><p>Overall materiality: $_______________</p><p>Performance materiality: $_______________</p><p>Clearly trivial threshold: $_______________</p><p>Benchmark: _______________</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s6',
      title: '6. Fraud Risk Inquiries (CAS 240.20)',
      questions: [
        la('tcwg-pl-6-fraud', '<p><strong>CAS 240 requires us to inquire of TCWG regarding:</strong></p><p>(a) Your assessment of the risk that the financial statements may be materially misstated due to fraud;</p><p>(b) Your knowledge of any actual, suspected, or alleged fraud affecting the entity;</p><p>(c) The procedures management performs to prevent and detect fraud.</p>'),
        q('tcwg-pl-6-fraud-q', '<p>Are you aware of any fraud or suspected fraud that we should know about?</p>'),
        la('tcwg-pl-6-fraud-exp', '<p><strong>TCWG response regarding fraud risk</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s7',
      title: '7. Going Concern and Independence',
      questions: [
        q('tcwg-pl-7-gc', '<p>Are you aware of any events or conditions that may cast significant doubt on the entity\'s ability to continue as a going concern?</p>'),
        la('tcwg-pl-7-gc-exp', '<p><strong>TCWG response regarding going concern</strong></p>'),
        la('tcwg-pl-8-ind', '<p><strong>Independence confirmation:</strong></p><p>We confirm that we are independent of the entity in accordance with the CPA Canada Code of Professional Conduct. We are not aware of any relationships or interests that may reasonably be thought to bear on our independence.</p>'),
        la('tcwg-pl-8-ind-matters', '<p><strong>Independence matters to disclose to TCWG (if any)</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-closing',
      title: '8. Closing',
      questions: [
        la('tcwg-pl-closing', '<p>We welcome the opportunity to discuss our audit approach and focus areas. Please contact [Engagement Partner] at [phone/email] if you require further information prior to the commencement of our audit.</p>'),
        la('tcwg-pl-firm', '<p><strong>Firm name and engagement partner signature</strong></p>'),
        la('tcwg-pl-firmdate', '<p><strong>Date</strong></p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-tcwg-planning',
    title: 'Communication with Those Charged with Governance — Planning',
    description: 'Pre-audit communication with those charged with governance — CAS 260.',
    objective: `Objective: To communicate with TCWG the planned scope, timing, and significant matters before the audit commences.

Reference: CAS 260 — Communication with Those Charged with Governance.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// TCWG Final Communication — CAS 260 (Letter format — rendered by LetterView)
export const generateTCWGFinalCommunicationChecklist = (): Checklist => {
  const la = (id: string, text: string): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer: ''
  });
  const q = (id: string, text: string): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'], required: false, answer: ''
  });

  const sections: Section[] = [
    {
      id: 'aud-tcwg-fin-header',
      title: 'Letter Header',
      questions: [
        la('tcwg-fin-date', '<p><strong>Date of Communication</strong></p>'),
        la('tcwg-fin-addressee', '<p><strong>Addressed To</strong> (Those Charged with Governance)</p>'),
        la('tcwg-fin-entity', '<p><strong>Entity Name</strong></p>'),
        la('tcwg-fin-period', '<p><strong>Audit period:</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-s1',
      title: '1. Audit Opinion',
      questions: [
        la('tcwg-fin-1-opinion', '<p><strong>Audit opinion issued:</strong></p><p>We have issued an [unmodified / qualified / adverse / disclaimer of] opinion on the financial statements of [Entity Name] for the year ended [date].</p>'),
        q('tcwg-fin-1-modified', '<p>If modified: has the nature and reason for the modification been communicated to TCWG?</p>'),
        la('tcwg-fin-1-kem', '<p><strong>Key audit matters (if applicable):</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-s2',
      title: '2. Significant Accounting Policies and Estimates (CAS 260.14(b))',
      questions: [
        la('tcwg-fin-2-policies', '<p><strong>Significant accounting policies applied:</strong></p><p>1. _______________</p><p>2. _______________</p><p>3. _______________</p>'),
        q('tcwg-fin-2-policies-q', '<p>Are all significant accounting policies appropriate and consistently applied?</p>'),
        la('tcwg-fin-2-estimates', '<p><strong>Significant accounting estimates requiring significant judgment:</strong></p><p>1. _______________</p><p>2. _______________</p>'),
        la('tcwg-fin-2-changes', '<p><strong>Changes in accounting policies or estimates during the year (if any):</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-s3',
      title: '3. Significant Audit Findings (CAS 260.14(c))',
      questions: [
        la('tcwg-fin-3-findings', '<p><strong>Significant audit findings and observations:</strong></p><p>1. _______________</p><p>2. _______________</p><p>3. _______________</p>'),
        la('tcwg-fin-3-uncorrected', '<p><strong>Uncorrected misstatements (management has determined these are immaterial):</strong></p>'),
        la('tcwg-fin-3-corrected', '<p><strong>Corrected misstatements that were individually significant:</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-s4',
      title: '4. Internal Control and Fraud (CAS 265 / CAS 240)',
      questions: [
        q('tcwg-fin-4-deficiencies', '<p>Were any significant deficiencies or material weaknesses in internal control identified during the audit?</p>'),
        la('tcwg-fin-4-ic-detail', '<p><strong>Description of significant deficiencies / material weaknesses and management\'s response:</strong></p>'),
        q('tcwg-fin-4-fraud', '<p>Were any indicators of fraud identified during the audit requiring communication to TCWG?</p>'),
        la('tcwg-fin-4-fraud-detail', '<p><strong>Fraud matters to communicate (if any)</strong></p>'),
        q('tcwg-fin-4-gc', '<p>Were any going concern events or conditions identified during the audit?</p>'),
        la('tcwg-fin-4-gc-detail', '<p><strong>Going concern matters (if any)</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-s5',
      title: '5. Independence Confirmation (CAS 260.14(e))',
      questions: [
        la('tcwg-fin-5-ind', '<p><strong>Independence confirmation:</strong></p><p>We confirm that as of the date of this communication, we are independent of the entity in accordance with ethical requirements relevant to our audit in Canada.</p>'),
        la('tcwg-fin-5-ind-matters', '<p><strong>Independence matters identified during the audit (if any):</strong></p>'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-closing',
      title: '6. Closing',
      questions: [
        la('tcwg-fin-closing', '<p>We thank you for your cooperation during the audit. Please contact [Engagement Partner] at [phone/email] with any questions or comments.</p>'),
        la('tcwg-fin-firm', '<p><strong>Firm name and engagement partner signature</strong></p>'),
        la('tcwg-fin-firmdate', '<p><strong>Date</strong></p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-tcwg-final',
    title: 'Communication with Those Charged with Governance — Completion',
    description: 'Post-audit communication with those charged with governance — CAS 260.',
    objective: `Objective: To communicate with TCWG the results of the audit, significant findings, and other matters arising from the audit.

Reference: CAS 260 — Communication with Those Charged with Governance.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const getGlobalTemplateChecklist = (templateId: string): Checklist | null => {
  switch (templateId) {
    case 'client-acceptance':
    case 'global-template-client-acceptance':
    case 'global-1-1':
      return generateClientAcceptanceContinuanceChecklist();
    case 'independence':
    case 'global-template-independence':
    case 'global-1-2':
      return generateIndependenceChecklist();
    case 'knowledge-client-business':
    case 'global-template-knowledge-client-business':
    case 'global-1-3':
      return generateKnowledgeOfClientBusinessChecklist();
    case 'planning':
    case 'global-template-planning':
    case 'global-1-4':
      return generatePlanningChecklist();
    case 'withdrawal':
    case 'global-template-withdrawal':
    case 'global-1-5':
      return generateWithdrawalChecklist();
    case 'completion':
    case 'global-template-completion':
    case 'global-1-6':
      return generateCompletionChecklist();
    case 'new-engagement-acceptance':
    case 'global-template-new-engagement-acceptance':
    case 'global-2-1':
      return generateNewEngagementAcceptanceChecklist();
    case 'existing-engagement-continuance':
    case 'global-template-existing-engagement-continuance':
    case 'global-2-2':
      return generateExistingEngagementContinuanceChecklist();
    case 'understanding-entity-basics':
    case 'global-template-understanding-entity-basics':
    case 'global-2-3':
      return generateUnderstandingEntityBasicsChecklist();
    case 'engagement-planning':
    case 'global-template-engagement-planning':
    case 'global-2-4':
      return generateEngagementPlanningChecklist();
    case 'review-completion':
    case 'global-template-review-completion':
    case 'global-2-5':
      return generateReviewCompletionChecklist();
    case 'subsequent-events':
    case 'global-template-subsequent-events':
    case 'global-2-6':
      return generateSubsequentEventsChecklist();
    case 'review-withdrawal':
    case 'global-template-review-withdrawal':
    case 'global-2-7':
      return generateReviewWithdrawalChecklist();
    case 'understanding-entity-systems':
    case 'global-template-understanding-entity-systems':
    case 'global-2-8':
      return generateUnderstandingEntitySystemsChecklist();
    case 'aspe-general-disclosure':
    case 'global-template-aspe-general-disclosure':
    case 'global-2-9':
      return generateASPEGeneralDisclosureChecklist();
    case 'aspe-income-taxes-disclosure':
    case 'global-template-aspe-income-taxes-disclosure':
    case 'global-2-10':
      return generateASPEIncomeTaxesDisclosureChecklist();
    case 'aspe-leases-disclosure':
    case 'global-template-aspe-leases-disclosure':
    case 'global-2-11':
      return generateASPELeasesDisclosureChecklist();
    case 'aspe-goodwill-intangibles-disclosure':
    case 'global-template-aspe-goodwill-intangibles-disclosure':
    case 'global-2-12':
      return generateASPEGoodwillIntangiblesDisclosureChecklist();
    case 'aspe-employee-future-benefits-disclosure':
    case 'global-template-aspe-employee-future-benefits-disclosure':
    case 'global-2-13':
      return generateASPEEmployeeFutureBenefitsDisclosureChecklist();
    case 'aspe-agriculture-disclosure':
    case 'global-template-aspe-agriculture-disclosure':
    case 'global-2-14':
      return generateASPEAgricultureDisclosureChecklist();
    case 'aspe-supplementary-disclosure':
    case 'global-template-aspe-supplementary-disclosure':
    case 'global-2-15':
      return generateASPESupplementaryDisclosureChecklist();
    case 'specific-circumstances':
    case 'global-template-specific-circumstances':
    case 'global-2-16':
      return generateSpecificCircumstancesChecklist();
    case 'worksheet-accounting-estimates':
    case 'global-template-worksheet-accounting-estimates':
    case 'global-2-17':
      return generateWorksheetAccountingEstimatesChecklist();
    case 'worksheet-going-concern':
    case 'global-template-worksheet-going-concern':
    case 'global-2-18':
      return generateWorksheetGoingConcernChecklist();
    case 'tax-completion':
    case 'global-template-tax-completion':
    case 'global-3-1':
      return generateTaxCompletionChecklist();
    case 'audit-completion':
    case 'global-template-audit-completion':
    case 'global-4-1':
      return generateAuditCompletionChecklist();
    case 'engagement-partner-audit-completion':
    case 'global-template-engagement-partner-audit-completion':
    case 'global-4-2':
      return generateEngagementPartnerAuditCompletionChecklist();
    case 'auditors-report':
    case 'global-template-auditors-report':
    case 'global-4-3':
      return generateAuditorsReportChecklist();
    case 'modified-opinion':
    case 'global-template-modified-opinion':
    case 'global-4-4':
      return generateModifiedOpinionChecklist();
    case 'supplementary-info':
    case 'global-template-supplementary-info':
    case 'global-4-5':
      return generateSupplementaryInfoChecklist();
    case 'management-representations':
    case 'global-template-management-representations':
    case 'global-4-6':
      return generateManagementRepresentationsChecklist();
    case 'client-acceptance-2026':
    case 'global-template-client-acceptance-2026':
    case 'global-5-1':
      return generateClientAcceptanceContinuance2026Checklist();
    default:
      return null;
  }
};
