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
          answer: 'Yes',
          explanation: '<p>Firm quality management policies were reviewed. Accepting this engagement for Shipping Line Inc. does not contravene any firm policies. No related CSRS 4460 services are being provided.</p>',
          reference: 'W/P Ref: AC-01'
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
          answer: 'Yes',
          explanation: '<p>Engagement partner J. Williams has prior knowledge of Shipping Line Inc. through industry contacts. The client was referred by a trusted business advisor and is recommended for acceptance.</p>',
          reference: 'W/P Ref: AC-02'
        },
        {
          id: 'nea-rf-b',
          text: '<p>b. Contact the predecessor practitioner to inquire about any reasons the engagement should not be accepted. If no response is received, explain what alternative procedures were performed.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'Yes',
          explanation: '<p>Predecessor practitioner was contacted by letter dated March 15, 2024. Response received March 20, 2024 — no concerns or reasons to decline were communicated. Fee arrangements with predecessor were settled.</p>',
          reference: 'W/P Ref: AC-03'
        },
        {
          id: 'nea-rf-c',
          text: '<p>c. Request a review of the predecessor\'s working papers. If not permitted, explain why and consider the potential engagement risk factors. If permitted, perform a review and describe any risk factors identified.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'Yes',
          explanation: '<p>Permission to review predecessor working papers was granted. Review performed April 2, 2024. No significant risk factors or unusual items were identified. Opening balances appear complete and properly supported.</p>',
          reference: 'W/P Ref: AC-04'
        },
        {
          id: 'nea-rf-d',
          text: '<p>d. Indicate what other procedures were performed (including results and conclusions) to identify engagement risk factors that would cause us to decline the engagement. Consider procedures such as:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'Yes',
          explanation: '<p>Additional procedures including web searches, management inquiries, and credit check were performed. No adverse findings noted.</p>',
          subQuestions: [
            { id: 'nea-rf-d-i', text: '<p>I. Inquiries of management/TCWG about:</p>', answerType: 'long-answer', options: [], required: false, answer: '',
              subQuestions: [
                { id: 'nea-rf-d-i-a', text: '<p>A. The reason for the change in accountants.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: '<p>Management indicated the change was due to the prior firm being acquired and the resulting conflict of interest with a competitor client. No professional issues were cited.</p>' },
                { id: 'nea-rf-d-i-b', text: '<p>B. Whether another accounting firm(s) has recently declined the engagement. If so, why?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Management confirmed no other firm has recently declined this engagement.</p>' },
                { id: 'nea-rf-d-i-c', text: '<p>C. Other engagement risk factors (see Appendix A).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: '<p>Inquiries made regarding Appendix A risk factors. No material risk factors identified beyond normal industry operating risks associated with marine shipping.</p>' }
              ]
            },
            { id: 'nea-rf-d-iii', text: '<p>III. Review of relevant communications between the previous accountants and management/TCWG.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: '<p>Management letters from prior auditor reviewed. No significant control deficiencies or unresolved matters were noted.</p>' },
            { id: 'nea-rf-d-iv', text: '<p>IV. Obtaining permission from the prospective client to perform a credit check and to make inquiries with bankers, other advisors, regulators, etc.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: '<p>Client permission obtained. Credit check performed — satisfactory results. RBC confirmed banking relationship in good standing. No regulatory sanctions noted.</p>' }
          ]
        },
        { id: 'nea-rf-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'All engagement risk factor procedures completed satisfactorily. No factors identified that would cause us to decline the engagement.' }
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
          answer: 'No',
          explanation: '<p>No concerns identified regarding management integrity. Web searches and inquiries with bankers and advisors returned no adverse findings. Management has operated Shipping Line Inc. with a consistent reputation in the marine freight sector.</p>',
          reference: 'W/P Ref: AC-05'
        },
        { id: 'nea-int-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'No integrity concerns identified. Management team led by CEO with 15+ years in marine logistics. No criminal convictions, regulatory sanctions, or negative publicity found.' }
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
          answer: 'No',
          explanation: '<p>Management confirmed full access to accounting records, vessel logs, voyage documentation, and supporting schedules. Accounting system (Sage 300) is in use and records appear well-maintained.</p>',
          reference: 'W/P Ref: AC-06'
        },
        { id: 'nea-data-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'No limitations on data availability identified. Management is cooperative and has committed to providing all requested information on a timely basis.' }
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
          answer: 'Yes',
          explanation: '<p>Opening balances as at April 1, 2023 were reviewed through inspection of predecessor working papers. Accounting policies are consistently applied. No material misstatements in opening balances identified.</p>',
          reference: 'W/P Ref: OB-01'
        },
        { id: 'nea-ob-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'Opening balances reviewed and agreed to prior year signed financial statements. Depreciation methods and vessel useful lives are consistent with prior period.' }
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
          answer: 'Yes',
          explanation: '<p>Engagement partner J. Williams has prior experience in marine transportation audits. The engagement team includes S. Chen (manager) with transportation industry background. No external specialists required for this engagement.</p>',
          reference: 'W/P Ref: AC-07'
        },
        { id: 'nea-fc-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'Firm has sufficient resources and marine industry knowledge. Year-end fieldwork scheduled April 14–25, 2024 is achievable with planned staffing.' }
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
          answer: 'No',
          explanation: '<p>No independence prohibitions identified. All engagement team members confirmed independence from Shipping Line Inc. and its related parties.</p>',
          reference: 'W/P Ref: IND-01',
          subQuestions: [
            { id: 'nea-ip-1-svc', text: '<p><strong>Services performed</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '',
              subQuestions: [
                { id: 'nea-ip-1a', text: '<p>a. Recording journal entries or changing account classifications without first obtaining management\'s approval.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>The firm does not record journal entries on behalf of the client. All adjusting entries are proposed to and approved by management.</p>' },
                { id: 'nea-ip-1b', text: '<p>b. Providing tax planning or other tax advisory services that may have a material impact on the financial statements.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>No tax advisory services are provided by the audit firm to this client.</p>' },
                { id: 'nea-ip-1c', text: '<p>c. Providing legal services that involve dispute resolution.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
                { id: 'nea-ip-1d', text: '<p>d. Preparing source documents for the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
                { id: 'nea-ip-1e', text: '<p>e. Performing management functions for the client (such as decision making on transactions).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
                { id: 'nea-ip-1f', text: '<p>f. Serving as an officer or director of the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
                { id: 'nea-ip-1g', text: '<p>g. Temporary loaning of staff (except in certain situations).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' }
              ]
            },
            { id: 'nea-ip-1-rel', text: '<p><strong>Relationships</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '',
              subQuestions: [
                { id: 'nea-ip-1h', text: '<p>a. Close business relationships with the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>No close business relationships between engagement team members and the client identified.</p>' },
                { id: 'nea-ip-1i', text: '<p>b. Family and personal relationships with the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
                { id: 'nea-ip-1j', text: '<p>c. Firm personnel that have accepted a position or have had recent employment with the client as an officer, director or company secretary.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' }
              ]
            },
            { id: 'nea-ip-1-fin', text: '<p><strong>Financial interests</strong></p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>No financial interests in Shipping Line Inc. held by the firm or any engagement team member or their immediate family.</p>' }
          ]
        },
        { id: 'nea-ip-note', text: '<p>Refer to the provincial Code of Professional Conduct / Code of Ethics for guidance, interpretations and additional independence prohibitions for listed entities.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Reviewed CPA Ontario Code of Professional Conduct — no additional prohibitions apply to this private company engagement.' },
        { id: 'nea-ip-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'No independence prohibitions identified. Engagement team independence declarations on file.' }
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
          answer: 'No',
          explanation: '<p>No significant independence threats identified for this new engagement. All four threat categories assessed below.</p>',
          reference: 'W/P Ref: IND-02',
          subQuestions: [
            { id: 'nea-it-1a', text: '<p>a. Self-interest (i.e., where the firm is economically dependent on the client fees or where judgments may be influenced by the desire to retain the client).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Fees from Shipping Line Inc. represent less than 2% of firm revenues. No economic dependence on this client.</p>' },
            { id: 'nea-it-1b', text: '<p>b. Self-review (i.e., assisting the client in preparing the financial statements, providing bookkeeping services and making judgments for the client that will later need to be evaluated in reaching conclusions).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>The firm does not provide bookkeeping or financial statement preparation services. Management prepares its own financial statements.</p>' },
            { id: 'nea-it-1c', text: '<p>c. Advocacy (i.e., acting as a client advocate in matters involving taxes, litigation or share promotion, which could result in being too sympathetic to the client\'s interests).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
            { id: 'nea-it-1d', text: '<p>d. Intimidation (i.e., where the client makes threats, such as to replace our firm unless we agree to certain scope limitations or to accept management positions without question, on accounting matters).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>No intimidation threats noted. Management is cooperative and has not sought to impose scope limitations.</p>' }
          ]
        },
        { id: 'nea-it-note', text: '<p>Refer to the provincial Code of Professional Conduct / Code of Ethics for guidance and interpretations.</p>', answerType: 'long-answer', options: [], required: false, answer: 'CPA Ontario Code reviewed. No additional threats identified beyond those addressed above.' },
        { id: 'nea-it-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'No significant independence threats identified. Engagement may proceed.' }
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
          answer: 'Yes',
          explanation: '<p>An audit engagement is required by the company\'s banking covenant with RBC and is appropriate given the entity size (~$12.5M revenue, $18.2M total assets). No scope limitations anticipated.</p>',
          reference: 'W/P Ref: AC-08'
        },
        { id: 'nea-pur-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'Audit required under RBC loan covenant. An audit is appropriate and no laws or regulations preclude this engagement type.' }
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
          answer: 'Yes',
          explanation: '<p>ASPE is the applicable financial reporting framework. Confirmed appropriate for Shipping Line Inc. as a privately held Canadian company with no public accountability obligations.</p>',
          reference: 'W/P Ref: AC-09'
        },
        {
          id: 'nea-pre-b',
          text: '<p>b. Ensure that management has acknowledged its understanding and responsibility for:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'Yes',
          explanation: '<p>Management acknowledgement obtained via signed engagement letter dated April 5, 2024. CEO confirmed responsibilities for financial statement preparation, internal controls, and providing full access to information.</p>',
          reference: 'W/P Ref: EL-01'
        },
        { id: 'nea-pre-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'All engagement preconditions satisfied. Signed engagement letter on file.' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-appendix-a',
      title: 'Appendix A - Entity operations',
      questions: [
        { id: 'nea-aa-1', text: '<p>Doubts in place about the entity\'s ability to continue as a going concern.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>No going concern indicators. Entity reported net income of $847K with positive operating cash flows.</p>' },
        { id: 'nea-aa-2', text: '<p>Poor sales outlook or intense competition.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Revenue ~$12.5M consistent with prior year. Established route contracts provide revenue stability.</p>' },
        { id: 'nea-aa-3', text: '<p>Entity has high debt levels and/or poor cash flow.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Long-term debt of $4.8M is manageable relative to total assets of $18.2M. Cash flows from operations are positive.</p>' },
        { id: 'nea-aa-4', text: '<p>Bank covenant or other contractual violations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-aa-5', text: '<p>Non-compliance with industry laws/regulations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Transport Canada compliance inquiries returned no violations. Vessels hold current certificates of inspection.</p>' },
        { id: 'nea-aa-6', text: '<p>Potential litigation.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Management confirmed no pending or threatened litigation. Legal counsel corroboration obtained.</p>' },
        { id: 'nea-aa-7', text: '<p>Questionable management/TCWG ethics.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-aa-8', text: '<p>High media interest in the entity and management.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-aa-9', text: '<p>Entity engages in high-risk activities.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Marine freight involves normal operating risks managed through adequate insurance and established safety protocols.</p>' },
        { id: 'nea-aa-10', text: '<p>Entity operates in or does business with unstable governments/countries.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Operations primarily in Canadian coastal waters with some US east coast routes. No exposure to politically unstable jurisdictions.</p>' },
        { id: 'nea-aa-11', text: '<p>Entity participates in high-risk business ventures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-aa-12', text: '<p>Unusual transactions not in the ordinary course of business.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' }
      ],
      isExpanded: true
    },
    {
      id: 'section-nea-appendix-a-engagement',
      title: 'Appendix A - The engagement',
      questions: [
        { id: 'nea-ae-1', text: '<p>Poor cooperation from management, such as misleading representations and delays in obtaining the necessary evidence.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Management has been cooperative during planning. All requested information provided promptly.</p>' },
        { id: 'nea-ae-2', text: '<p>Firm has limited experience in the entity\'s industry.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Engagement partner J. Williams has prior experience with marine transportation clients.</p>' },
        { id: 'nea-ae-3', text: '<p>Reporting timeframes are unrealistic based on time available or firm resources.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Fieldwork scheduled April 14–25, 2024. Timeline is achievable with planned staffing.</p>' },
        { id: 'nea-ae-4', text: '<p>Poor control environment, leadership and staff morale.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-ae-5', text: '<p>Incompetence of senior accounting personnel.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>CFO is a CPA with 12 years of marine industry experience. Accounting records appear well-maintained.</p>' },
        { id: 'nea-ae-6', text: '<p>Entity unable or unwilling to pay a fair fee.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-ae-7', text: '<p>Poor/inadequate/missing accounting systems and records.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Entity uses Sage 300 ERP. Records appear complete and well-maintained during preliminary review.</p>' },
        { id: 'nea-ae-8', text: '<p>Complex IT environments.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-ae-9', text: '<p>Lack of paper trail for certain transactions/events.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-ae-10', text: '<p>Experts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-ae-11', text: '<p>Estimates involve a high degree of estimation uncertainty.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Key estimates include vessel depreciation and voyage completion revenue cutoff. These are manageable with appropriate audit procedures.</p>' },
        { id: 'nea-ae-12', text: '<p>Extensive related-party transactions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Related-party transactions limited to shareholder loans and management compensation, which are routine and disclosed.</p>' },
        { id: 'nea-ae-13', text: '<p>Entity chooses aggressive/controversial accounting policies.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-ae-14', text: '<p>Significant adjustments are required.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'nea-ae-15', text: '<p>Unusual transactions or overly complex corporate/operational structures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' }
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
          answer: 'Low Risk'
        },
        { id: 'nea-conc-1-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'All risk factors assessed. No material risk factors identified. Engagement is assessed as Low Risk. Client accepted.' },
        {
          id: 'nea-conc-2',
          text: '<p><strong>Is an EQR required on this engagement (select one)?</strong></p><p>This decision should be based on the engagement risk identified above and the firm\'s criteria for when an EQR is required.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>EQR not required. Engagement assessed as Low Risk. Entity is a private company with no public interest considerations and no elevated risk factors.</p>'
        },
        { id: 'nea-conc-2-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'EQR not required per firm criteria. Engagement accepted. Engagement letter issued April 5, 2024.' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-new-engagement-acceptance',
    title: 'New Engagement Acceptance',
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
          answer: 'Yes',
          explanation: '<p>Firm quality assurance policies reviewed. Continuing this engagement for Shipping Line Inc. (AUD-SL-Mar312024) does not contravene any firm policies. No CSRS 4460 services are being provided.</p>',
          reference: 'W/P Ref: AC-01'
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
          answer: 'Yes',
          explanation: '<p>Web searches and management inquiries performed. No new or emerging risk factors identified that would impact the continuation decision. Marine freight industry operating conditions remain stable.</p>',
          reference: 'W/P Ref: AC-02'
        },
        {
          id: 'eec-rf-b',
          text: '<p>b. Consider any risk factors identified from other assignments performed for the entity.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'Yes',
          explanation: '<p>No other assignments performed for this entity. This is the first year of the engagement. No carryforward risk factors from prior work.</p>'
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
          answer: 'No',
          explanation: '<p>No concerns regarding management integrity. Management has been cooperative and forthcoming during the engagement. No adverse findings from web searches or inquiries.</p>',
          reference: 'W/P Ref: AC-05'
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
          answer: 'No',
          explanation: '<p>All required information is available. Management has confirmed access to Sage 300 records, voyage logs, vessel schedules, and supporting documentation for the year ended March 31, 2024.</p>'
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
          answer: 'Yes',
          explanation: '<p>Firm has sufficient resources. Engagement team: J. Williams (EP), S. Chen (Manager), two staff seniors. Marine industry experience confirmed.</p>',
          subQuestions: [
            { id: 'eec-fc-1a', text: '<p>a. The availability of staff/resources with appropriate level of experience, relevant industry/subject matter knowledge, and any required regulatory and reporting experience.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: '<p>J. Williams and S. Chen both have marine transportation audit experience. Two senior staff members assigned.</p>' },
            { id: 'eec-fc-1b', text: '<p>b. The need for external experts and component practitioners.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>No external experts required. Vessel valuations will be assessed using management depreciation schedules and industry benchmarks.</p>' },
            { id: 'eec-fc-1c', text: '<p>c. The need for an EQR (where required).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Engagement assessed as low risk. EQR not required under firm criteria for this private company engagement.</p>' }
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
          answer: 'No',
          explanation: '<p>No independence prohibitions identified. All engagement team members confirmed independence from Shipping Line Inc.</p>',
          reference: 'W/P Ref: IND-01',
          subQuestions: [
            { id: 'eec-ip-1a', text: '<p>Obtaining management\'s approval.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>The firm does not record entries without management approval. All adjustments are proposed and approved by management.</p>' },
            { id: 'eec-ip-1b', text: '<p>Providing tax planning or other tax advisory services that may have a material impact on the financial statements.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
            { id: 'eec-ip-1c', text: '<p>Providing other non-assurance services, such as IT services, corporate finance or legal services that involve dispute resolution.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
            { id: 'eec-ip-1d', text: '<p>Preparing source documents for the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
            { id: 'eec-ip-1e', text: '<p>Performing management functions for the client (such as decision making).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
            { id: 'eec-ip-1f', text: '<p>Serving as an officer or director of the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
            { id: 'eec-ip-1g', text: '<p>Temporary loaning of staff (except in certain situations).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' }
          ]
        },
        {
          id: 'eec-ip-rel',
          text: '<p><strong>Relationships</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          subQuestions: [
            { id: 'eec-ip-rel-a', text: '<p>Close business relationships with the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
            { id: 'eec-ip-rel-b', text: '<p>Family and personal relationships with the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
            { id: 'eec-ip-rel-c', text: '<p>Firm personnel that have accepted a position or have had recent employment with the client as an officer, director or company secretary.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' }
          ]
        },
        {
          id: 'eec-ip-fin',
          text: '<p><strong>Financial interests</strong></p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          subQuestions: [
            { id: 'eec-ip-fin-a', text: '<p>Performing the engagement for a fee quote that is considerably less than market price.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Fee arrangement is at standard market rates. Agreed upon in the engagement letter.</p>' },
            { id: 'eec-ip-fin-b', text: '<p>Holding financial interests in entity.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
            { id: 'eec-ip-fin-c', text: '<p>Accepting gifts or hospitality from client (if not clearly insignificant).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' }
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
          answer: 'No',
          explanation: '<p>No significant independence threats identified. All five threat categories assessed and found not applicable.</p>',
          reference: 'W/P Ref: IND-02',
          subQuestions: [
            { id: 'eec-it-1a', text: '<p>Client fees or where judgments may be influenced by the desire to retain the client.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Fees from this client represent less than 2% of firm revenues. No economic dependence.</p>' },
            { id: 'eec-it-1b', text: '<p>Self-review (i.e., assisting the client in preparing the financial statements, providing bookkeeping services and making judgments for the client that will later need to be evaluated in reaching conclusions).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>The firm does not prepare financial statements or provide bookkeeping services. No self-review threat.</p>' },
            { id: 'eec-it-1c', text: '<p>Advocacy (i.e., acting as a client advocate in matters involving tax, litigation or share promotion).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
            { id: 'eec-it-1d', text: '<p>Familiarity (i.e., close, family or long-time relationships with the client that could result in being too sympathetic to the client\'s interests).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>First year of engagement. No long association threat. Partner rotation policy does not yet apply.</p>' },
            { id: 'eec-it-1e', text: '<p>Intimidation (i.e., where the client makes threats, such as to replace our firm unless we agree to certain scope limitations or to accept management positions, without question, on accounting matters).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' }
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
          answer: 'No',
          explanation: '<p>Purpose of the engagement has not changed. Audit required under RBC banking covenant. Scope is unchanged from prior engagement. No laws require a different form of engagement.</p>'
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
          answer: 'Yes',
          explanation: '<p>ASPE remains the appropriate framework. Management has acknowledged responsibilities via signed engagement letter dated April 5, 2024. Full access to information confirmed.</p>',
          reference: 'W/P Ref: EL-01'
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
          answer: 'Yes',
          explanation: '<p>Engagement partner J. Williams, CPA has reviewed all responses. No independence prohibitions, threats, or ethical breaches identified. Engagement may proceed.</p>',
          reference: 'W/P Ref: AC-10'
        },
        { id: 'eec-pa-comments', text: '<p>Comments:</p>', answerType: 'long-answer', options: [], required: false, answer: 'All engagement acceptance/continuance procedures completed. Engagement accepted. No significant risks or independence matters identified. Engagement letter signed April 5, 2024.' }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-appendix-a-entity',
      title: 'Appendix A - Entity operations',
      questions: [
        { id: 'eec-aa-1', text: '<p>Doubts in place about entity\'s ability to continue as a going concern.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>No going concern indicators. Entity reported net income of $847K with positive operating cash flows for year ended March 31, 2024.</p>' },
        { id: 'eec-aa-2', text: '<p>Poor sales outlook or intense competition.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-aa-3', text: '<p>Entity has high debt levels and/or poor cash flow.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Long-term debt of $4.8M manageable relative to $18.2M total assets. Positive operating cash flows.</p>' },
        { id: 'eec-aa-4', text: '<p>Bank covenant or other contractual violations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-aa-5', text: '<p>Non-compliance with industry laws/regulations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-aa-6', text: '<p>Potential litigation.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-aa-7', text: '<p>Questionable management/TCWG ethics.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-aa-8', text: '<p>High media interest in the entity and management.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-aa-9', text: '<p>Entity engages in high-risk activities.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-aa-10', text: '<p>Entity operates in or does business with unstable governments/countries.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-aa-11', text: '<p>Entity operates in multiple locations or conducts operations overseas.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Operations primarily in Canadian coastal waters with some US east coast routes, all managed from the Halifax head office.</p>' },
        { id: 'eec-aa-12', text: '<p>Entity participates in high-risk business ventures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-aa-13', text: '<p>Unusual transactions not in the ordinary course of business.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' }
      ],
      isExpanded: true
    },
    {
      id: 'section-eec-appendix-a-engagement',
      title: 'Appendix A - The engagement',
      questions: [
        { id: 'eec-ae-1', text: '<p>Poor cooperation from management, such as misleading representations and delays in obtaining the necessary evidence.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-ae-2', text: '<p>Firm has limited experience in the entity\'s industry.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-ae-3', text: '<p>Reporting timeframes are unrealistic based on time available or firm resources.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-ae-4', text: '<p>Poor control environment, leadership and staff morale.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-ae-5', text: '<p>Incompetence of senior accounting personnel.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-ae-6', text: '<p>Poor/inadequate/missing accounting systems and records.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-ae-7', text: '<p>Complex IT environments.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-ae-8', text: '<p>Lack of paper trail for certain transactions/events.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-ae-9', text: '<p>Experts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-ae-10', text: '<p>Estimates involve a high degree of estimation uncertainty.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: '<p>Key estimates (vessel depreciation, voyage cutoff) are routine for the industry and manageable with standard procedures.</p>' },
        { id: 'eec-ae-11', text: '<p>Entity chooses aggressive/controversial accounting policies.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' },
        { id: 'eec-ae-12', text: '<p>Unusual transactions or overly complex corporate/operational structures.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No' }
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
          answer: 'Low Risk'
        },
        { id: 'eec-conc-extra', text: '<p>Additional Explanation</p>', answerType: 'long-answer', options: [], required: false, answer: 'All risk factors assessed as low or not applicable. No significant independence threats or prohibitions identified. Engagement accepted and continued for year ended March 31, 2024.' },
        {
          id: 'eec-conc-eqcr',
          text: '<p><strong>Is an EQCR required on this engagement (Select one)?</strong></p><p>This decision should be based on the engagement risk identified above and the firm\'s criteria for when an EQCR is required.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>EQCR not required. Engagement assessed as Low Risk. Private company, no public interest considerations, no elevated risk factors identified.</p>'
        },
        { id: 'eec-conc-basis', text: '<p>Basis for decision:</p>', answerType: 'long-answer', options: [], required: false, answer: 'Engagement risk assessed as Low Risk based on all factors reviewed. EQCR not required under firm policy for low-risk private company engagements.' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-existing-engagement-continuance',
    title: 'Existing Engagement Continuance',
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
        { id: 'ueb-gen-1', text: '<p><strong>Legal name (if different from above):</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'Shipping Line Inc. (same as above)' },
        { id: 'ueb-gen-2', text: '<p><strong>Approximate number of employees:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: '94 full-time employees as at March 31, 2024.' },
        {
          id: 'ueb-gen-3',
          text: '<p><strong>Type of entity:</strong></p>',
          answerType: 'multiple-choice',
          options: ['Crown corporation', 'General partnership', 'Joint arrangement', 'Limited partnership', 'Not-for-profit organization', 'Private company', 'Public company', 'Unincorporated business or division'],
          required: false,
          answer: 'Private company'
        },
        { id: 'ueb-gen-4', text: '<p><strong>Jurisdiction of incorporation:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'Federally incorporated under the Canada Business Corporations Act. Head office in Vancouver, British Columbia.' },
        { id: 'ueb-gen-5', text: '<p><strong>Describe the governing legislation and other relevant laws and regulations:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'Canada Business Corporations Act (federal incorporation), Canada Shipping Act 2001 (vessel operations and safety), Transport Canada marine licensing requirements, MARPOL environmental regulations for vessel emissions, and Canadian income tax legislation.' },
        { id: 'ueb-gen-6', text: '<p><strong>Locations</strong> (e.g., head office, warehouses, divisions, plants and stores)</p>', answerType: 'long-answer', options: [], required: false, answer: 'Head office: Vancouver, BC. Port operations: Vancouver (primary), Prince Rupert (secondary). Vessels operate on trans-Pacific and coastal trade routes.' },
        { id: 'ueb-gen-7', text: '<p><strong>Investments and related companies</strong> (e.g., parent, subsidiaries, joint arrangements and others)</p>', answerType: 'long-answer', options: [], required: false, answer: 'No subsidiaries, parent company, or joint arrangements. The entity is independently owned by the founding shareholders.' },
        { id: 'ueb-gen-8', text: '<p><strong>Describe the corporate structure</strong> and identify whether the entity is part of a related group. If the entity is part of a group, describe the group reporting requirements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Single corporate entity. Not part of a group. Owned by two founding shareholders (60%/40% split). No group reporting requirements.' },
        { id: 'ueb-gen-9', text: '<p><strong>Key advisors to the entity</strong> (e.g., legal, actuaries, stockbroker and insurance brokers)</p>', answerType: 'long-answer', options: [], required: false, answer: 'Legal: Henderson & Associates LLP (Vancouver). Insurance broker: Pacific Marine Insurance Brokers. Banking: RBC Commercial Banking. Auditors: current engagement firm.' },
        { id: 'ueb-gen-10', text: '<p><strong>Primary sources of financing</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'Long-term bank debt (RBC term facility, $4.8M outstanding). Operating line of credit (RBC, $1.5M authorized). Retained earnings fund ongoing operations.' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ueb-misstatements-general',
      title: 'Areas where material misstatements are likely to arise',
      questions: [
        { id: 'ueb-ms-1', text: '<p>Entity operates in a high-risk industry, or management regularly takes high financial risks.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Maritime freight is subject to commodity price volatility (fuel), foreign currency risk (USD), and cyclical demand patterns. Management operates conservatively but inherent industry risks are elevated relative to other industries.', reference: 'W/P Ref: UEI-01' },
        { id: 'ueb-ms-2', text: '<p>Negative cash flows during the period or anticipated future cash flow problems.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Operating cash flows are positive and the entity meets all debt service obligations. No anticipated cash flow problems.' },
        { id: 'ueb-ms-3', text: '<p>Any inability to obtain new financing.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'RBC credit facility is current and in good standing. No financing difficulties identified.' },
        { id: 'ueb-ms-4', text: '<p>Unrecorded changes have been made in terms of financing or equity.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No unrecorded changes to financing or equity identified. All financing transactions are recorded in the general ledger.' },
        { id: 'ueb-ms-5', text: '<p>Significant changes have been made to the terms/conditions of financing agreements, including amendments to bank covenants or equity.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No amendments to the RBC credit facility terms during the year. Covenant terms remain unchanged from prior year.' },
        { id: 'ueb-ms-6', text: '<p>Investments held are subject to possible impairment.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Vessel fleet ($8.2M PP&E) is assessed for impairment indicators at each year-end. Management performed an impairment assessment; no impairment indicated given current freight rates and fleet utilization. Reviewed as part of audit procedures.', reference: 'W/P Ref: RA-01' },
        { id: 'ueb-ms-7', text: '<p>Significant accounting and reporting implications exist as a result of the entity being part of a group.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'NA', explanation: 'Entity is not part of a group. Not applicable.' },
        { id: 'ueb-ms-nature', text: '<p><strong>Nature of likely misstatements</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'Vessel impairment (PP&E $8.2M); revenue cut-off for voyages in progress; USD foreign currency translation errors.' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ueb-oversight',
      title: 'Understanding oversight',
      questions: [
        { id: 'ueb-ov-1', text: '<p><strong>Person(s) interviewed:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'CEO (M. Patel), CFO (L. Thompson), Controller (R. Nguyen). Interviews conducted April 14–15, 2024.' },
        { id: 'ueb-ov-2', text: '<p><strong>Describe the culture (tone at the top) of the entity</strong> through which it addresses risks relating to its obligations and financial reporting (e.g., commitment to integrity, risk appetite and attitude toward control in general).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Management demonstrates a commitment to integrity and ethical business practices. The CEO emphasizes compliance with regulatory requirements and accurate financial reporting. Risk appetite is conservative — management avoids speculative ventures and focuses on established trade routes. No concerns regarding tone at the top identified.' },
        { id: 'ueb-ov-3', text: '<p>Describe any actual, suspected or alleged fraud, illegal acts, or non-compliance with laws and regulations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Management confirmed no actual, suspected, or alleged fraud, illegal acts, or non-compliance with laws and regulations during the year.', reference: 'W/P Ref: FRA-01' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ueb-governance',
      title: 'Governance',
      questions: [
        { id: 'ueb-gov-1', text: '<p><strong>Those charged with governance:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'Board of Directors: M. Patel (CEO/Director), J. Singh (Director), and one independent director (K. Robertson, CPA). Board meets quarterly.' },
        { id: 'ueb-gov-2', text: '<p>Lack of management emphasis on, or enforcement of, the need for integrity/ethics.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Management demonstrates a strong commitment to integrity. CEO regularly communicates expectations of ethical conduct to employees.' },
        { id: 'ueb-gov-3', text: '<p>Any unethical business practices or any actual, suspected, or alleged fraud or illegal acts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No unethical practices or fraud identified. TCWG confirmed no knowledge of fraud or illegal acts.' },
        { id: 'ueb-gov-4', text: '<p>Lack of competence of key personnel.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'CFO and Controller are experienced accounting professionals. CFO holds CPA designation with 15 years in maritime industry. No competence concerns identified.' },
        { id: 'ueb-gov-5', text: '<p>Lack of monitoring of financial results (e.g., actual results are not being compared to budget or the variances are not being explained).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Monthly management accounts are prepared and actual results are compared to budget. Variances are reviewed by the CFO and discussed with the board quarterly.' },
        { id: 'ueb-gov-6', text: '<p>Pressures on management to meet internal/external performance targets.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Banking covenant (DSCR minimum 1.20) creates some external pressure. However, actual DSCR of 1.42 provides comfortable headroom. Assessed as a low fraud risk factor.', reference: 'W/P Ref: RA-02' },
        { id: 'ueb-gov-7', text: '<p>Any non-compliance with laws and regulations that could materially impact F/S.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No non-compliance with laws or regulations identified. All Transport Canada licenses are current and in good standing.' },
        { id: 'ueb-gov-nature', text: '<p><strong>Nature of likely misstatements</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'No governance-related misstatement risks identified. Tone at the top is appropriate and oversight by TCWG is effective.' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ueb-operations',
      title: 'Understanding operations',
      questions: [
        { id: 'ueb-ops-1', text: '<p><strong>Person(s) interviewed:</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'CFO (L. Thompson), Controller (R. Nguyen), Operations Manager (D. Park). Interviews conducted April 14–16, 2024.' },
        { id: 'ueb-ops-2', text: '<p><strong>Describe the industry and the nature of the entity\'s operations.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'Shipping Line Inc. operates in the marine freight transportation industry, providing container and bulk freight services primarily on trans-Pacific trade routes between Canada and Asia-Pacific ports. The entity owns and operates a small fleet of vessels and generates revenue through freight charges billed per voyage or per container (TEU).' },
        {
          id: 'ueb-ops-3',
          text: '<p><strong>Describe the entity\'s geographical sales.</strong> Indicate export countries where applicable.</p>',
          answerType: 'multiple-choice',
          options: ['Both domestic and export', 'Primarily domestic', 'Primarily for export', 'Very localized'],
          required: false,
          answer: 'Both domestic and export'
        },
        {
          id: 'ueb-ops-4',
          text: '<p><strong>Describe the overall state of the industry.</strong></p>',
          answerType: 'multiple-choice',
          options: ['Declining industry', 'Growing industry', 'Static industry'],
          required: false,
          answer: 'Growing industry'
        },
        { id: 'ueb-ops-5', text: '<p><strong>Describe any external factors that impact the entity</strong> (e.g., exchange rates, interest rates, commodity prices, competition and new government regulations).</p>', answerType: 'long-answer', options: [], required: false, answer: 'USD/CAD exchange rate (approximately 65% of revenue billed in USD). Bunker fuel prices (significant cost driver, up ~12% year-over-year). Interest rates (variable rate component on RBC facility). IMO environmental regulations for vessel emissions.' },
        { id: 'ueb-ops-6', text: '<p><strong>Describe any measures taken by management to oversee external factors</strong> (e.g., foreign exchange contracts and interest rate swaps).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Management uses fuel surcharge clauses in freight contracts to partially offset bunker price increases. No formal hedging instruments are in place for foreign currency or interest rate risk. Management monitors FX rates and adjusts billing frequency to manage exposure.' },
        { id: 'ueb-ops-7', text: '<p><strong>Summarize the entity\'s key objectives and strategies</strong> (e.g., business plans or planned changes to current operations).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Key objectives: grow freight revenue through additional contract wins, maintain high fleet utilization (target >85%), and manage costs tightly. Strategy is organic growth on established trade routes; no major acquisitions or fleet expansion planned for the near term.' },
        { id: 'ueb-ops-8', text: '<p><strong>Describe any non-compliance with government regulations or contractual commitments,</strong> and the consequences.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No instances of non-compliance with government regulations or contractual commitments identified. All Transport Canada operating licenses are current.' },
        { id: 'ueb-ops-9', text: '<p><strong>Describe major changes in business operations</strong> (e.g., expansion, sale, purchase or discontinuance of business elements, new products/services or locations, investments, customers or suppliers).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Two new freight contracts entered into during the year. No vessel acquisitions or disposals. No new locations or business line changes. Operations are consistent with prior year with incremental growth.' },
        { id: 'ueb-ops-10', text: '<p><strong>Describe the nature and extent of the investments</strong> that the entity is planning.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No material capital investments planned in the near term. Routine dry-dock maintenance capital expenditures are expected to continue at approximately $180K per year.' },
        { id: 'ueb-ops-11', text: '<p><strong>Describe key changes or losses in personnel,</strong> and the implications.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No key personnel changes during the year. Headcount increased from 89 to 94 due to additional crew hired for the two new freight contracts. No impact on financial reporting competence.' },
        { id: 'ueb-ops-12', text: '<p><strong>Describe new or revised material contracts.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'Two new freight contracts: (1) 12-month contract with Pacific Imports Ltd. for monthly container shipments (estimated annual revenue $890K), and (2) 18-month spot charter agreement with Asia Freight Co. Ltd. (estimated annual revenue $640K). Both contracts include standard freight terms and force majeure provisions.' },
        { id: 'ueb-ops-13', text: '<p><strong>Describe new, pending or threatened litigation.</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'No new, pending, or threatened litigation. Management and legal counsel confirmed no outstanding claims as at March 31, 2024.' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ueb-ops-misstatements',
      title: 'Operations - Areas where material misstatements are likely to arise',
      questions: [
        { id: 'ueb-opsm-1', text: '<p>Changes in business operations.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Two new freight contracts represent incremental changes in operations. Impact on audit approach is limited — additional revenue cut-off procedures planned for new contracts.', reference: 'W/P Ref: RA-01' },
        { id: 'ueb-opsm-2', text: '<p>Changes in roles/competence of key personnel.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No changes in key financial reporting personnel. CFO and Controller positions are stable and filled by experienced professionals.' },
        { id: 'ueb-opsm-3', text: '<p>Implications relating to the rise or decline of the state of the industry.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Post-pandemic normalization of freight rates is relevant to vessel carrying values and revenue per voyage. Impairment assessment of vessel fleet has been identified as a significant audit risk.', reference: 'W/P Ref: RA-01' },
        { id: 'ueb-opsm-nature', text: '<p><strong>Nature of likely misstatements</strong></p>', answerType: 'long-answer', options: [], required: false, answer: 'Revenue cut-off for new contracts; vessel impairment assessment; USD foreign currency translation on new contract revenue.' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'global-template-understanding-entity-basics',
    title: 'Understanding the Entity — Basics',
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
          answer: 'Audit of the financial statements of Shipping Line Inc. for the year ended March 31, 2024, prepared under ASPE. No additional services requested. Engagement reference: AUD-SL-Mar312024.'
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
          answer: 'Two new freight contracts signed during the year. No changes to financial reporting framework or accounting policies. Headcount increased from 89 to 94. MarineTrack software upgraded to v4.2 for digital bill-of-lading. No changes to key financial reporting personnel.'
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
          answer: 'Primarily substantive approach. Key risks: revenue recognition (voyage cut-off), vessel impairment ($8.2M PP&E), and USD foreign currency transactions. Specific procedures: voyage log reconciliation, impairment indicator analysis, USD translation testing. Year-end fieldwork April 14-25, 2024.'
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
          answer: 'No specialists required. No group reporting requirements. TCWG planning communication issued to board of directors February 28, 2024. Bank covenant compliance to be confirmed as part of long-term debt procedures.'
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
          answer: 'Yes',
          explanation: '<p>Management and the CFO were inquired on April 25, 2024 about subsequent events. Management confirmed no events had occurred between March 31 and April 25, 2024 that would require adjustment or disclosure.</p>',
          reference: 'W/P Ref: SE-01'
        },
        {
          id: 'q-se-inquiry-2',
          text: '<p>Inquire about the current status of items that were accounted for on the basis of preliminary or inconclusive data.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'Yes',
          explanation: '<p>Management confirmed the status of all items accounted for on preliminary data (accrued liabilities, deferred revenue) were finalized with no material changes required.</p>',
          reference: 'W/P Ref: SE-01'
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
          answer: 'NA',
          explanation: '<p>No subsequent events requiring adjustment or disclosure were identified. The subsequent events review period was March 31 to May 2, 2024 (date of audit report).</p>',
          reference: 'W/P Ref: SE-01'
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
          answer: 'NA',
          explanation: '<p>No facts discovered after the report date. Not applicable as no events requiring adjustment were identified.</p>'
        },
        {
          id: 'q-se-facts-2',
          text: '<p>Determine whether the financial statements need amendment. If so, inquire how management intends to address the matter in the financial statements.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'NA',
          explanation: '<p>Financial statements did not require amendment for subsequent events.</p>'
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
          answer: 'Yes',
          explanation: '<p>Confirmed no subsequent events require recording, presentation or disclosure in the March 31, 2024 financial statements.</p>',
          reference: 'W/P Ref: SE-02'
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
          answer: 'No',
          explanation: '<p>No new commitments, borrowings, or guarantees identified in the subsequent events review period.</p>'
        },
        {
          id: 'q-se-ind-2',
          text: '<p>Significant new contracts.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>No significant new contracts executed between March 31 and May 2, 2024.</p>'
        },
        {
          id: 'q-se-ind-3',
          text: '<p>Actual / planned sales / acquisitions of assets and business units.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>No sales or acquisitions of assets or business units in the subsequent events period.</p>'
        },
        {
          id: 'q-se-ind-4',
          text: '<p>Increases in capital or issuance of debt instruments.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>No increases in capital or issuance of debt instruments subsequent to year-end.</p>'
        },
        {
          id: 'q-se-ind-5',
          text: '<p>Assets destroyed (e.g., through fire or flood) or appropriated by government.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>No assets destroyed or appropriated by government subsequent to year-end.</p>'
        },
        {
          id: 'q-se-ind-6',
          text: '<p>New contingencies (including litigation) or new developments regarding existing contingencies.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>No new contingencies or material developments regarding existing contingencies identified.</p>'
        },
        {
          id: 'q-se-ind-7',
          text: '<p>Any unusual accounting adjustments either made or being contemplated.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>No unusual accounting adjustments made or being contemplated subsequent to year-end.</p>'
        },
        {
          id: 'q-se-ind-8',
          text: '<p>Any events that would question the appropriateness of the accounting policies being used.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>No events identified that would question the appropriateness of the accounting policies applied in the financial statements.</p>'
        },
        {
          id: 'q-se-ind-9',
          text: '<p>Any events relevant to the measurement of estimates or provisions made in the financial statements.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>No events relevant to the measurement of estimates or provisions made in the financial statements.</p>'
        },
        {
          id: 'q-se-ind-10',
          text: '<p>Any events relevant to the recoverability of assets or the existence of new liabilities.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>No events relevant to the recoverability of assets or existence of new liabilities identified.</p>'
        },
        {
          id: 'q-se-ind-11',
          text: '<p>Any events or circumstances that would question the validity of the going-concern basis of accounting.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: '<p>No events or circumstances that would question the validity of the going-concern basis of accounting. Entity continues to operate normally.</p>'
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
        { id: 'q-ues-fin-1', text: '<p>Identify the individual(s) responsible for the day-to-day accounting, and describe the experience they have.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Controller: R. Nguyen, CPA (8 years experience, 4 years with entity). Supported by one AP clerk and one AR clerk. CFO L. Thompson, CPA provides oversight and reviews monthly financials.' },
        { id: 'q-ues-fin-2', text: '<p>Describe the key financial reports produced on a regular basis (e.g., income statement, balance sheet and budget to actual comparison).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Monthly: income statement, balance sheet, cash flow statement, budget-to-actual variance report. Quarterly: board reports and bank covenant compliance certificates. Annual: audited financial statements.' },
        { id: 'q-ues-fin-3', text: '<p>Describe the key indicators management uses to measure and assess performance (e.g., sales per square foot and gross margins).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Revenue per voyage, fleet utilization rate (%), gross margin %, on-time delivery %, and debt service coverage ratio.' },
        { id: 'q-ues-fin-4', text: '<p>Describe the financial reports (if any) that are regularly provided to third parties, such as banks.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Quarterly covenant compliance certificates to RBC. Annual audited financial statements to RBC within 120 days of year-end per the credit facility agreement.' },
        {
          id: 'q-ues-fin-5',
          text: '<p>Describe the accounting applications used by the entity.</p>',
          answerType: 'multiple-choice',
          options: ['None (manual or spreadsheet ledgers used)', 'QuickBooks', 'QuickBooks Online', 'Sage 50', 'Other (specify)'],
          required: false,
          answer: 'Other (specify)'
        },
        { id: 'q-ues-fin-6', text: '<p>Describe the nature of any external accounting services provided (e.g., bookkeeping).</p>', answerType: 'long-answer', options: [], required: false, answer: 'No external bookkeeping services. All accounting performed in-house. Tax preparation handled by external tax advisors.' },
        { id: 'q-ues-fin-7', text: '<p>Describe any significant transactions occurring or recognized near the end of the reporting period.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Several voyages in progress at March 31, 2024. Revenue recognition at voyage completion creates a cut-off risk. Management accrues revenue for voyages substantially complete at year-end.' },
        { id: 'q-ues-fin-8', text: '<p>Describe any material non-monetary transactions or transactions for no consideration.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No material non-monetary transactions or transactions for no consideration identified.' },
        { id: 'q-ues-fin-9', text: '<p>Describe the results of any government audits (HST, GT or corporate) that occurred during the period.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No government audits occurred during the year. Last CRA audit was three years ago with no material adjustments.' },
        {
          id: 'q-ues-fin-10',
          text: '<p>Describe significant accounting policies (if any) that are:</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: 'None identified. All significant accounting policies are appropriate under ASPE and consistently applied.',
          subQuestions: [
            { id: 'q-ues-fin-10a', text: '<p>Not usually used in the entity\'s industry.</p>', answerType: 'long-answer', options: [], required: false, answer: 'None identified. All significant accounting policies are standard for the maritime freight industry.' },
            { id: 'q-ues-fin-10b', text: '<p>Not consistently applied.</p>', answerType: 'long-answer', options: [], required: false, answer: 'None identified. All accounting policies applied consistently with prior year.' },
            { id: 'q-ues-fin-10c', text: '<p>Considered controversial.</p>', answerType: 'long-answer', options: [], required: false, answer: 'None identified.' },
            { id: 'q-ues-fin-10d', text: '<p>Not appropriate or consistent with the applicable financial reporting framework.</p>', answerType: 'long-answer', options: [], required: false, answer: 'None identified. All accounting policies are appropriate under ASPE.' }
          ]
        },
        { id: 'q-ues-fin-11', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Revenue cut-off (voyage completion); USD foreign currency translation; vessel PP&E carrying value and depreciation.' },
        {
          id: 'q-ues-fin-12',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'Yes', explanation: 'Some risk factors apply — see sub-questions below.',
          subQuestions: [
            { id: 'q-ues-fin-12a', text: '<p>Extensive reliance placed on spreadsheets (including consolidations) to prepare financial reports.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Extensive reliance on Excel spreadsheets for voyage revenue tracking and USD conversion calculations.' },
            { id: 'q-ues-fin-12b', text: '<p>Use of third-party processing of transactions without any evaluation of controls.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No third-party transaction processing used. All transactions processed in-house.' },
            { id: 'q-ues-fin-12c', text: '<p>Significant judgments made in the application of accounting policies.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Judgment required for voyage completion percentages at year-end, vessel useful lives, and allowance for doubtful accounts.' },
            { id: 'q-ues-fin-12d', text: '<p>Changes made to significant accounting policies this period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No changes to significant accounting policies. Consistent application with prior year confirmed.' },
            { id: 'q-ues-fin-12e', text: '<p>Non-monetary transactions used during the period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No non-monetary transactions identified during the year.' },
            { id: 'q-ues-fin-12f', text: '<p>Inconsistent application of, and/or changes in, accounting policies during the period (e.g., revenue recognition).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Accounting policies applied consistently with prior year. No changes in revenue recognition or other significant policies.' },
            { id: 'q-ues-fin-12g', text: '<p>Lack of consultation with subject matter experts regarding the recording of complex transactions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No complex transactions requiring specialist input identified. Management consults with the audit team for significant accounting questions.' }
          ]
        },
        { id: 'q-ues-fin-13', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Revenue cut-off errors for voyages in progress at year-end; USD translation differences on AR and revenue.' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-tech',
      title: 'Understanding General Technology',
      questions: [
        { id: 'q-ues-tech-1', text: '<p>Indicate the individual(s) responsible for managing the IT applications in the entity. If the person responsible is not an employee, describe the contractual arrangement in place.</p>', answerType: 'long-answer', options: [], required: false, answer: 'IT managed by Controller R. Nguyen with support from external IT service provider TechSupport Solutions Inc. under a monthly service contract.' },
        { id: 'q-ues-tech-2', text: '<p>Describe the current technology systems (e.g., hardware, software and data storage, such as server or cloud).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Accounting system: Sage 300 ERP (on-premise server). Voyage management: MarineTrack. Data stored on local server with nightly cloud backups to Azure. Office productivity via Microsoft 365.' },
        { id: 'q-ues-tech-3', text: '<p>Describe the process for authorizing and making changes (if any) to financial applications.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Changes to Sage 300 require written authorization from CFO. Changes tested by Controller before deployment. Vendor patches applied after review by IT service provider.' },
        { id: 'q-ues-tech-4', text: '<p>Describe the applications used to capture, process, record and report financial information.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Sage 300 ERP: GL, AR, AP, fixed assets. MarineTrack: voyage management and freight billing. ADP Workforce Now: payroll. Financial reporting via Excel export from Sage 300.' },
        {
          id: 'q-ues-tech-5',
          text: '<p>Describe how the entity restricts access to data and applications to authorized personnel, such as:</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: 'Yes',
          explanation: 'Entity restricts access through documented policies for physical security, cloud storage, remote access, passwords, and virus protection.',
          subQuestions: [
            { id: 'q-ues-tech-5a', text: '<p>Physical security.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Server room access restricted to Controller and IT service provider via key card. Head office is secured with alarm system outside business hours.' },
            { id: 'q-ues-tech-5b', text: '<p>Data stored with third parties.</p>', answerType: 'long-answer', options: [], required: false, answer: 'ADP hosts payroll data. Azure cloud stores nightly backups. Both providers have industry-standard security certifications.' },
            { id: 'q-ues-tech-5c', text: '<p>Data stored on the cloud.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Nightly backups to Microsoft Azure. Microsoft 365 used for email and office applications. Data residency is Canadian data centres.' },
            { id: 'q-ues-tech-5d', text: '<p>Remote access.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Remote access to Sage 300 via VPN with user ID and password. VPN access is restricted to authorized employees with approval from the Controller.' },
            { id: 'q-ues-tech-5e', text: '<p>Passwords for applications.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Sage 300 enforces minimum 8-character passwords with expiry every 90 days. Shared passwords are not permitted.' },
            { id: 'q-ues-tech-5f', text: '<p>Virus and malware protection.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Microsoft Defender antivirus installed on all workstations and updated automatically. IT service provider monitors for threats.' },
            { id: 'q-ues-tech-5g', text: '<p>Data backup and data recovery procedures.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Daily incremental backups and weekly full backups to Azure. Recovery tests performed monthly by IT service provider. Recovery time objective is 4 hours.' }
          ]
        },
        { id: 'q-ues-tech-6', text: '<p>Describe any modifications to the technology systems during the period.</p>', answerType: 'long-answer', options: [], required: false, answer: 'MarineTrack upgraded to v4.2 in November 2023 for digital bill-of-lading. Sage 300 updated with vendor patches. No changes to core accounting functionality.' },
        { id: 'q-ues-tech-7', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Interface between MarineTrack (voyage billing) and Sage 300 (GL) is a key IT risk area for revenue completeness.' },
        {
          id: 'q-ues-tech-8',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: 'No significant IT risk factors identified that would affect the reliability of financial information.',
          subQuestions: [
            { id: 'q-ues-tech-8a', text: '<p>Unauthorized physical access to IT facilities and equipment.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Server room has restricted physical access (key card). No unauthorized physical access concerns identified.' },
            { id: 'q-ues-tech-8b', text: '<p>Unauthorized access to the network, major applications and related data.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Access to Sage 300 is restricted by user ID and password. User access review performed by Controller annually.' },
            { id: 'q-ues-tech-8c', text: '<p>Outdated, overly complex, or inadequate IT hardware and infrastructure.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'IT infrastructure is current and adequately maintained by the external IT service provider.' },
            { id: 'q-ues-tech-8d', text: '<p>Significant dependence on technology to capture, process, record and report financial information.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Significant dependence on Sage 300 and MarineTrack for capturing and reporting financial information. Completeness and accuracy of these systems is an audit focus.' },
            { id: 'q-ues-tech-8e', text: '<p>Unauthorized changes to accounting programs and/or data.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No unauthorized changes to accounting programs identified. Change management process is in place.' },
            { id: 'q-ues-tech-8f', text: '<p>New or modified accounting software, or other significant changes in technology systems.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'MarineTrack upgraded during the year. The upgrade has been assessed and does not affect the fundamental accounting data transfer functionality.' },
            { id: 'q-ues-tech-8g', text: '<p>Data loss due to inadequate backup or other security procedures, such as virus protection.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Daily backups to Azure cloud with monthly recovery tests performed by IT service provider.' }
          ]
        },
        { id: 'q-ues-tech-9', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Revenue completeness/accuracy errors from MarineTrack-to-Sage 300 interface; spreadsheet errors in USD conversion calculations.' }
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
          answer: 'Yes',
          explanation: 'Banking facilities managed with documented policies for electronic transfers, credit cards, and cheque signing. Controls confirmed as adequate.',
          subQuestions: [
            { id: 'q-ues-cash-1a', text: '<p>Electronic banking policies (e.g., Internet transfers and wire payments).</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Electronic banking policies are documented. Internet transfers require dual authorization. Wire payments over $50K require CFO approval.' },
            { id: 'q-ues-cash-1b', text: '<p>Authorization of corporate credit cards.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Corporate credit cards issued to CEO and CFO. Monthly statements reviewed and approved by the other party.' },
            { id: 'q-ues-cash-1c', text: '<p>Cheque signing policies.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Cheques require dual signatures. Signing authority limits documented and communicated to the bank.' }
          ]
        },
        { id: 'q-ues-cash-2', text: '<p>Describe the procedures for ensuring that cash transactions are recorded in the appropriate period.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Cash receipts deposited daily and recorded in Sage 300 same day. Cutoff reviewed by Controller at month-end. Bank reconciliations prepared monthly and reviewed by CFO.' },
        { id: 'q-ues-cash-3', text: '<p>Describe the entity\'s processes for the preparation and review of monthly bank reconciliations.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Monthly bank reconciliations prepared by AR clerk within 5 business days of month-end. Reviewed and signed off by Controller. CFO reviews reconciling items >$5,000.' },
        { id: 'q-ues-cash-4', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Timing differences for large USD remittances near year-end. Cash controls otherwise assessed as adequate.' },
        {
          id: 'q-ues-cash-5',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: 'No significant cash control risk factors identified. Entity does not handle physical cash in operations.',
          subQuestions: [
            { id: 'q-ues-cash-5a', text: '<p>Entity handles large amounts of cash on a regular basis.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Entity does not handle cash in operations. All receipts are electronic (EFT or wire transfer).' },
            { id: 'q-ues-cash-5b', text: '<p>Potential exists for cash sales to go unrecorded in the accounting records.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No cash sales. All revenue is invoiced and collected via EFT.' },
            { id: 'q-ues-cash-5c', text: '<p>Weak physical controls over cash balances held.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No physical cash balances. Petty cash maintained at $500 with proper controls.' }
          ]
        },
        { id: 'q-ues-cash-6', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'USD bank account translation differences at year-end; timing of large wire transfers near year-end cutoff.' }
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
          answer: 'Many customers, including one or more significant customers listed below'
        },
        { id: 'q-ues-rev-2', text: '<p>Name of significant customers.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Pacific Imports Ltd. (~23% of revenue), Asia Freight Co. Ltd. (~18% of revenue), West Coast Trading Corp. (~17% of revenue). Combined approximately 58% of total revenue.' },
        { id: 'q-ues-rev-3', text: '<p>Describe how revenue transactions are initiated (e.g., phone, email or internet).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Freight bookings initiated via email or through the MarineTrack online booking portal. Each booking confirmed with a signed freight agreement from the customer.' },
        {
          id: 'q-ues-rev-4',
          text: '<p>Indicate at what point in the sales process revenue transactions are recorded in the general ledger.</p>',
          answerType: 'multiple-choice',
          options: ['Invoicing', 'Percentage of completion', 'Shipment', 'Other'],
          required: false,
          answer: 'Percentage of completion'
        },
        { id: 'q-ues-rev-5', text: '<p>Describe any complexities in revenue recognition (e.g., multiple revenue streams, rights of return and contractual terms).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Revenue recognized on voyage completion basis. For voyages in progress at period end, management estimates percentage of completion based on voyage days elapsed. USD-denominated revenue translated at rates prevailing on invoice date.' },
        { id: 'q-ues-rev-6', text: '<p>Describe how management ensures that all revenue transactions are recorded and included in the correct period (cut-off).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Controller reviews voyage log at year-end to identify all voyages completed or in progress. Revenue accrued for voyages >80% complete at period end. Procedure reviewed by CFO as part of year-end close.' },
        {
          id: 'q-ues-rev-7',
          text: '<p>Indicate the entity\'s normal sales terms.</p>',
          answerType: 'multiple-choice',
          options: ['< 30 days', '30-60 days', '60-90 days', '> 90 days'],
          required: false,
          answer: '30-60 days'
        },
        { id: 'q-ues-rev-8', text: '<p>Describe any special terms, conditions, discounts, etc., on sales.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Fuel surcharge clauses in all freight contracts. Volume discounts of 2-3% for top customers. Force majeure provisions standard in all contracts.' },
        { id: 'q-ues-rev-9', text: '<p>Describe how proceeds from revenue transactions are collected (cash sales %, credit card sales %, credit sales %).</p>', answerType: 'long-answer', options: [], required: false, answer: '100% credit sales collected via EFT wire transfer. No cash or credit card sales. Approximately 65% of collections received in USD and converted to CAD.' },
        { id: 'q-ues-rev-10', text: '<p>Describe the extent of online sales.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Approximately 30% of new freight bookings initiated through the MarineTrack online portal. All bookings follow the same invoicing and collection process.' },
        {
          id: 'q-ues-rev-11',
          text: '<p>Describe the entity\'s procedures for determining the allowance for doubtful accounts.</p>',
          answerType: 'multiple-choice',
          options: ['Specific account identification', 'General provision based on aging', 'Combination of specific account and general provision'],
          required: false,
          answer: 'Combination of specific account and general provision'
        },
        { id: 'q-ues-rev-12', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Revenue cut-off for voyages in progress; accuracy of USD translation; completeness of freight billings.' },
        {
          id: 'q-ues-rev-13',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'Yes',
          explanation: 'Weak cut-off controls over voyage revenue at period end identified as a risk factor.',
          subQuestions: [
            { id: 'q-ues-rev-13a', text: '<p>History of misstatements in revenue recognition.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No history of misstatements in revenue recognition identified in prior audit files.' },
            { id: 'q-ues-rev-13b', text: '<p>Sales of goods/services provided to customers with poor credit.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'All customers are established businesses with credit histories. No significant overdue AR balances.' },
            { id: 'q-ues-rev-13c', text: '<p>Weak controls over cut-off at period end.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Voyage cut-off controls rely on manual review of voyage logs; some risk of cut-off errors at year-end.' }
          ]
        },
        { id: 'q-ues-rev-14', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Revenue recognized in incorrect period due to voyage cut-off; USD translation errors; deferred revenue classification errors.' }
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
          answer: 'Many suppliers, including the significant suppliers described below'
        },
        { id: 'q-ues-pur-2', text: '<p>Name of significant suppliers.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Pacific Bunker Supply Ltd. (fuel, ~$1.8M annually), Port Metro Vancouver (port fees, ~$620K annually), Marine Parts & Service Co. (maintenance supplies, ~$280K annually).' },
        { id: 'q-ues-pur-3', text: '<p>Describe how purchase and disposal transactions are initiated (e.g., purchase orders, online orders, phone calls or emails).</p>', answerType: 'long-answer', options: [], required: false, answer: 'Purchases initiated via purchase orders in Sage 300. Fuel orders placed by Operations Manager with CFO approval for orders >$50K. Routine supplies ordered by department managers within pre-approved budgets.' },
        { id: 'q-ues-pur-4', text: '<p>Document how purchase and disposal transactions are recorded in the general ledger.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Vendor invoices entered into Sage 300 AP module by AP clerk, coded to appropriate GL account, approved by Controller before payment. Sage 300 posts to GL upon AP invoice approval.' },
        { id: 'q-ues-pur-5', text: '<p>Describe how management ensures that all goods and services and disposals are recorded in the proper period.</p>', answerType: 'long-answer', options: [], required: false, answer: 'AP clerk reconciles vendor statements for major suppliers at year-end. Controller reviews for unrecorded invoices. Accruals for services received but not yet invoiced are recorded at month-end based on purchase orders.' },
        {
          id: 'q-ues-pur-6',
          text: '<p>Indicate the entity\'s usual payment terms.</p>',
          answerType: 'multiple-choice',
          options: ['< 30 days', '30-60 days', '60-90 days', '> 90 days'],
          required: false,
          answer: '30-60 days'
        },
        { id: 'q-ues-pur-7', text: '<p>Describe any purchases and disposals outside the normal course of business.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No purchases or disposals outside the normal course of business during the year. No vessel acquisitions or disposals.' },
        { id: 'q-ues-pur-8', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: 'AP cut-off for large fuel invoices near year-end; accuracy of accruals for port fees and maintenance services.' },
        {
          id: 'q-ues-pur-9',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: 'No significant risk factors identified in purchase transaction controls based on procedures performed.',
          subQuestions: [
            { id: 'q-ues-pur-9a', text: '<p>Weak controls over cut-off at period end.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'AP cut-off procedures are in place; vendor statement reconciliations performed at year-end.' },
            { id: 'q-ues-pur-9b', text: '<p>History of misstatements in the purchase of goods and services.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No history of misstatements in purchase transactions. Prior year audit found no AP misstatements.' },
            { id: 'q-ues-pur-9c', text: '<p>Personal expenses charged to the business.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No personal expenses charged to the business identified.' }
          ]
        },
        { id: 'q-ues-pur-10', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Unrecorded AP liabilities for fuel deliveries near year-end; AP cut-off errors for USD-denominated supplier invoices.' }
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
          answer: '94 total employees',
          subQuestions: [
            { id: 'q-ues-pay-1a', text: '<p>Management (number).</p>', answerType: 'long-answer', options: [], required: false, answer: '8' },
            { id: 'q-ues-pay-1b', text: '<p>Supervisors (number).</p>', answerType: 'long-answer', options: [], required: false, answer: '6' },
            { id: 'q-ues-pay-1c', text: '<p>Office staff (number).</p>', answerType: 'long-answer', options: [], required: false, answer: '12' },
            { id: 'q-ues-pay-1d', text: '<p>Operations (number).</p>', answerType: 'long-answer', options: [], required: false, answer: '68 (vessel crew, port operations, maintenance technicians)' }
          ]
        },
        { id: 'q-ues-pay-2', text: '<p>Describe how new hires/terminations are added to/removed from the payroll.</p>', answerType: 'long-answer', options: [], required: false, answer: 'New hires added to ADP payroll upon receipt of signed employment contract and HR authorization form approved by CFO. Terminations removed on effective date; Controller verifies removal on next payroll run.' },
        { id: 'q-ues-pay-3', text: '<p>Document how payroll transactions are recorded in the general ledger.</p>', answerType: 'long-answer', options: [], required: false, answer: 'ADP generates a payroll journal uploaded to Sage 300 by the Controller after each pay run. Payroll expenses coded by department. Controller reviews payroll totals before upload.' },
        { id: 'q-ues-pay-4', text: '<p>Describe how rates of pay and payroll deductions are authorized and updated in the payroll system.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Rate changes require a signed authorization form approved by CFO. Changes entered into ADP by HR administrator and reviewed by Controller before next payroll run. Annual adjustments approved by the board.' },
        {
          id: 'q-ues-pay-5',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: 'No payroll risk factors identified. Controls over rates, deductions, and payroll authorization are adequate.',
          subQuestions: [
            { id: 'q-ues-pay-5a', text: '<p>Rates of pay and payroll deductions not properly authorized or updated.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Pay rate authorization process documented and requires CFO approval.' },
            { id: 'q-ues-pay-5b', text: '<p>History of misstatements in payroll.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No history of payroll misstatements. Prior year audit found payroll to be accurate.' },
            { id: 'q-ues-pay-5c', text: '<p>Unauthorized personnel (e.g., family members) included on the payroll.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No unauthorized personnel on payroll. Employee listing reviewed quarterly against HR records.' }
          ]
        },
        { id: 'q-ues-pay-6', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Payroll cut-off for final pay period of the fiscal year. Risk assessed as low based on controls reviewed.' }
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
          answer: 'Other (specify)'
        },
        { id: 'q-ues-inv-2', text: '<p>Document whether any inventory is held with third parties or at other locations.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Not applicable. Shipping Line Inc. is a service entity and does not carry merchandise inventory.' },
        { id: 'q-ues-inv-3', text: '<p>Document whether a physical count of the inventory is performed at period end. If so, attach or cross-reference a copy of the count instructions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'NA', explanation: 'Not applicable — entity does not carry merchandise inventory.' },
        {
          id: 'q-ues-inv-4',
          text: '<p>Describe the entity\'s policy for the costing of inventory, and note any inconsistencies with prior periods.</p>',
          answerType: 'multiple-choice',
          options: ['Job costing', 'Standard costing', 'Weighted average costing', 'Retail method', 'Specific identification'],
          required: false,
          answer: 'Other (not applicable — service entity)'
        },
        { id: 'q-ues-inv-5', text: '<p>Describe how the entity determines the costs for work in process (including raw materials, labour and overhead) and the extent of completion.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Not applicable — entity does not carry work in process inventory.' },
        {
          id: 'q-ues-inv-6',
          text: '<p>Describe the entity\'s policy for the transfer of inventory to cost of sales, and note any inconsistencies with prior periods.</p>',
          answerType: 'multiple-choice',
          options: ['Ending inventory based on physical count with an adjustment to cost of sale', 'First in, first out', 'Percentage of completion accounting', 'Specific identification', 'Other (specify)'],
          required: false,
          answer: 'Other (specify)'
        },
        { id: 'q-ues-inv-7', text: '<p>Describe how the inventory sub-ledger is updated for goods received/sold.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Not applicable — entity does not maintain an inventory sub-ledger.' },
        { id: 'q-ues-inv-8', text: '<p>Describe how inventory transactions are recorded in the general ledger.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Not applicable — entity is a service business without merchandise inventory.' },
        { id: 'q-ues-inv-9', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Not applicable — entity does not carry material inventory.' },
        {
          id: 'q-ues-inv-10',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'NA',
          explanation: 'Not applicable — entity does not carry merchandise inventory.',
          subQuestions: [
            { id: 'q-ues-inv-10a', text: '<p>Unreconciled differences between physical and book amounts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'NA', explanation: 'Not applicable — no inventory held.' },
            { id: 'q-ues-inv-10b', text: '<p>Weak controls over the physical location of inventory or inventory cut-off.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'NA', explanation: 'Not applicable — no inventory held.' },
            { id: 'q-ues-inv-10c', text: '<p>History of misstatements with regard to inventory balances and the assessment of impairments for slow-moving and obsolete goods.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'NA', explanation: 'Not applicable — no inventory held.' }
          ]
        },
        { id: 'q-ues-inv-11', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Not applicable. Entity does not carry material inventory balances.' }
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
          answer: 'See sub-questions below for significant accounting estimates used in financial reporting.',
          subQuestions: [
            { id: 'q-ues-est-1a', text: '<p>Inventory obsolescence.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Not applicable — entity does not carry merchandise inventory.' },
            { id: 'q-ues-est-1b', text: '<p>Allowance for doubtful accounts.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Allowance estimated using specific identification for balances >90 days and 1.5% general provision on remaining AR. Total allowance at March 31, 2024: $46K.' },
            { id: 'q-ues-est-1c', text: '<p>Loan impairments.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Not applicable — entity does not hold loan receivables.' },
            { id: 'q-ues-est-1d', text: '<p>Fair values.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Not applicable — entity has no financial instruments measured at fair value.' },
            { id: 'q-ues-est-1e', text: '<p>Useful lives of assets.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Vessels depreciated on straight-line basis over 20-25 years with residual values of 10% of cost. No changes to useful life estimates this year.' },
            { id: 'q-ues-est-1f', text: '<p>Other estimates.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Accrued revenue for voyages in progress at year-end estimated based on percentage of voyage days elapsed. Accrued dry-dock maintenance costs estimated based on scheduled dry-dock events.' }
          ]
        },
        { id: 'q-ues-est-2', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Accrued revenue for voyages in progress (cut-off risk); vessel useful lives and impairment; allowance for doubtful accounts.' },
        {
          id: 'q-ues-est-3',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'Yes',
          explanation: 'Significant estimates used in financial reporting — see sub-questions below.',
          subQuestions: [
            { id: 'q-ues-est-3a', text: '<p>Significant accounting estimates used in financial reporting.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'Yes', explanation: 'Significant estimates: accrued revenue (voyage cut-off), vessel depreciation and impairment, allowance for doubtful accounts.' },
            { id: 'q-ues-est-3b', text: '<p>Unreliable or inappropriate management assumptions/calculations used in preparing accounting estimates.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Management assumptions appear reasonable and consistent with prior year. No indication of bias.' },
            { id: 'q-ues-est-3c', text: '<p>Significant accounting estimates not prepared in accordance with the applicable financial reporting framework.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Estimates prepared in accordance with ASPE. No unusual departures from the applicable framework.' }
          ]
        },
        { id: 'q-ues-est-4', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Overstatement of accrued revenue at year-end; vessel depreciation errors; inadequate allowance for doubtful accounts.' }
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
          answer: 'See sub-questions for related party details.',
          subQuestions: [
            { id: 'q-ues-rel-1a', text: '<p>A list of related parties.</p>', answerType: 'long-answer', options: [], required: false, answer: 'M. Patel (CEO/Director, 60% shareholder), J. Singh (Director, 40% shareholder), Patel Holdings Inc. (company owned by M. Patel).' },
            { id: 'q-ues-rel-1b', text: '<p>The nature of related-party relationships.</p>', answerType: 'long-answer', options: [], required: false, answer: 'M. Patel: CEO and majority shareholder. J. Singh: Director and minority shareholder. Patel Holdings Inc. owns the head office premises leased to Shipping Line Inc.' },
            { id: 'q-ues-rel-1c', text: '<p>The nature of related-party transactions occurring in the period.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Rental payments to Patel Holdings Inc. for head office premises: $120K for the year ($10K/month). Terms confirmed as at market rates.' }
          ]
        },
        { id: 'q-ues-rel-2', text: '<p>Describe how the entity ensures that transactions occurring around period end have been recorded in the correct period.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Rent payments are made monthly on a consistent basis. No unusual related-party transactions near year-end identified.' },
        { id: 'q-ues-rel-3', text: '<p>Describe any related-party transactions outside the normal course of business during the reporting period.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No related-party transactions outside the normal course of business. All transactions relate to the ongoing head office lease.' },
        { id: 'q-ues-rel-4', text: '<p>Describe the effects or possible implications of the entity\'s transactions/relationships with related parties.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Rent expense of $120K per year at market terms. Disclosure required under ASPE. No unusual implications on financial reporting.' },
        { id: 'q-ues-rel-5', text: '<p>Describe any indicators of possible payment or amount receivable from related parties.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No amounts receivable from related parties. All related-party obligations are current.' },
        { id: 'q-ues-rel-6', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Completeness of related-party disclosures; accuracy of rent expense and related party payable balance.' },
        {
          id: 'q-ues-rel-7',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: 'No related-party risk factors identified. Related-party transactions are transparent, at market terms, and appropriately disclosed.',
          subQuestions: [
            { id: 'q-ues-rel-7a', text: '<p>History of undisclosed related-party transactions.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Management provided a complete list of related parties. No undisclosed transactions identified.' },
            { id: 'q-ues-rel-7b', text: '<p>No obvious purpose for some related-party relationships.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'All related-party relationships have a clear business purpose (head office premises lease at market terms).' },
            { id: 'q-ues-rel-7c', text: '<p>Related-party transactions outside of the normal course of business.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'All related-party transactions are within the normal course of business.' },
            { id: 'q-ues-rel-7d', text: '<p>Related-party transactions that occurred prior to period end are reversed after the period end.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No year-end related-party transactions reversed in subsequent periods.' }
          ]
        },
        { id: 'q-ues-rel-8', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Incomplete disclosure of related-party transactions in the notes to the financial statements.' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-journal',
      title: 'Understanding Journal Entries/Adjustments',
      questions: [
        { id: 'q-ues-jrn-1', text: '<p>Describe how non-recurring journal entries or adjustments are initiated and authorized.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Non-recurring journal entries prepared by Controller with supporting documentation and reviewed and approved by CFO before posting. All entries require description of purpose and preparer/approver sign-off.' },
        { id: 'q-ues-jrn-2', text: '<p>Describe any significant journal entries or adjustments made during the period.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Three adjusting journal entries proposed by audit team: (1) accrued revenue cut-off $45K, (2) depreciation correction $12K, (3) deferred revenue reclassification $28K. All accepted by management.' },
        { id: 'q-ues-jrn-3', text: '<p>Describe any matters that required adjustments in the F/S of prior periods.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No prior period restatements. Prior year audit resulted in three immaterial corrected misstatements, all addressed in current year procedures.' },
        { id: 'q-ues-jrn-4', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Year-end accrual entries for voyage revenue and dry-dock costs; USD translation adjustments.' },
        {
          id: 'q-ues-jrn-5',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: 'No journal entry risk factors identified. Authorization controls over journal entries are adequate.',
          subQuestions: [
            { id: 'q-ues-jrn-5a', text: '<p>History of inappropriate/unauthorized journal entries/adjustments during the period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Authorization process for journal entries is documented and reviewed. No inappropriate entries identified.' },
            { id: 'q-ues-jrn-5b', text: '<p>History of journal entries being made to unusual or seldom-used accounts.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Journal entries made to standard accounts. No entries to unusual accounts identified.' },
            { id: 'q-ues-jrn-5c', text: '<p>Prior period uncorrected misstatements remain uncorrected in the current period.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'Prior year misstatements were corrected. No uncorrected misstatements remain.' }
          ]
        },
        { id: 'q-ues-jrn-6', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Incorrect period allocation of accrual entries; USD translation errors in year-end adjustments.' }
      ],
      isExpanded: true
    },
    {
      id: 'section-ues-going-concern',
      title: 'Understanding Going-Concern Uncertainties',
      questions: [
        { id: 'q-ues-gc-1', text: '<p>Inquire whether management has made an assessment of its ability to continue as a going concern. If so, document the assessment period used by management.</p>', answerType: 'long-answer', options: [], required: false, answer: 'Management assessed ability to continue as going concern for minimum 12 months from March 31, 2025. Concluded no material uncertainty exists, supported by positive operating cash flows, comfortable covenant headroom, and confirmed credit facility availability.' },
        {
          id: 'q-ues-gc-2',
          text: '<p>Inquire about any other events or uncertainties that could cause doubt about the entity\'s ability to continue as a going concern. Consider:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: 'No going concern events or uncertainties identified. Entity is financially stable.',
          subQuestions: [
            { id: 'q-ues-gc-2a', text: '<p>Financing/cash flow challenges.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No financing or cash flow challenges. Entity has positive operating cash flows and undrawn credit line.' },
            { id: 'q-ues-gc-2b', text: '<p>Adverse market conditions, trends or events.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No adverse market conditions that cast doubt on the entity going concern status.' },
            { id: 'q-ues-gc-2c', text: '<p>Regulatory or legal challenges.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No regulatory or legal challenges. All licenses current and no proceedings outstanding.' }
          ]
        },
        { id: 'q-ues-gc-3', text: '<p>Identify any areas in the F/S where material misstatements are likely to arise.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No going concern concerns identified. All going concern indicators assessed and found to be absent.' },
        {
          id: 'q-ues-gc-4',
          text: '<p>Indicate (based on inquiries made and understanding obtained) if any of the following apply:</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'NA'],
          required: false,
          answer: 'No',
          explanation: 'No going concern risk factors identified based on procedures performed.',
          subQuestions: [
            { id: 'q-ues-gc-4a', text: '<p>Bias in management estimates.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No bias in management estimates. Estimates prepared consistently with prior year.' },
            { id: 'q-ues-gc-4b', text: '<p>Unrecorded accruals.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'No unrecorded accruals identified. Year-end accrual review completed.' },
            { id: 'q-ues-gc-4c', text: '<p>Unremitted payroll deductions/government remittances.</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: 'No', explanation: 'CRA payroll remittances are current. No outstanding government remittances.' }
          ]
        },
        { id: 'q-ues-gc-5', text: '<p>Nature of likely misstatements.</p>', answerType: 'long-answer', options: [], required: false, answer: 'No going concern related misstatement risks identified. Entity is financially stable with positive operating cash flows.' }
      ],
      isExpanded: true
    }
  ];

  return {
    id: 'understanding-entity-systems',
    title: 'Understanding the Entity — Systems & Controls',
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
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-ac-1',
      title: 'Preliminary Activities',
      questions: [
        q('ac-q3', '<p>Does the audit file contain appropriate documentation related to relevant ethical requirements, and acceptance and continuance of the audit engagement? The appointment of an engagement quality control reviewer, where applicable?</p>', undefined, 'Yes', '<p>Audit file contains signed independence confirmations, client acceptance checklist, and engagement letter. No EQCR required for this engagement.</p>', 'W/P Ref: AC-01'),
        q('ac-q6', '<p>Are the terms of engagement agreed with management and is a signed engagement letter included in the audit file?</p>', [
          q('ac-q6a', '<p>Terms of engagement (engagement letter)?</p>', undefined, 'Yes', '<p>Signed engagement letter on file, dated March 1, 2024, signed by the CEO of Shipping Line Inc. and the engagement partner J. Williams.</p>', 'W/P Ref: AC-02'),
          q('ac-q6b', '<p>The following communications with TCWG? Where applicable, the planned scope and timing of the audit, including significant risks identified?</p>', undefined, 'Yes', '<p>Planning communication delivered to the Board of Directors on April 7, 2024, including planned scope, timing, significant risks identified (revenue recognition, vessel impairment, FX), and partner responsibility.</p>', 'W/P Ref: AC-03'),
          q('ac-q6c', '<p>A description of the audit team\'s responsibilities?</p>', undefined, 'Yes'),
          q('ac-q6d', '<p>The form, timing and expected general content of communications?</p>', undefined, 'Yes'),
          q('ac-q6e', '<p>Relevant ethical requirements (including those related to independence) applied?</p>', undefined, 'Yes'),
          q('ac-q6f', '<p>For listed entities, an independence letter?</p>', undefined, 'NA', '<p>Shipping Line Inc. is not a listed entity. Independence letter not required.</p>'),
          q('ac-q6g', '<p>Where applicable, a letter of instructions to a component auditor or to the auditor\'s expert?</p>', undefined, 'NA', '<p>No component auditor or auditor\'s expert used in this engagement.</p>'),
        ]),
        q('ac-q9', '<p>If applicable, is the agreement with the auditor\'s expert signed and included in the audit file?</p>', undefined, 'NA', '<p>No auditor\'s expert engaged for this audit.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-2',
      title: 'Planning and Risk Assessment',
      questions: [
        q('ac-q15', '<p>Have the overall audit strategy and audit plan been documented, reflecting matters raised in audit team discussions?</p>', undefined, 'Yes', '<p>Overall audit strategy and audit plan documented and approved by J. Williams (partner) prior to fieldwork. Includes responses to three significant risks identified.</p>', 'W/P Ref: PL-01'),
        q('ac-q18', '<p>Have overall materiality, performance materiality, materiality for specific circumstances (if applicable) and the clearly trivial misstatement threshold been documented, including the factors considered in determining materiality amounts?</p>', undefined, 'Yes', '<p>Materiality documented: overall $125,000 (1% of revenue $12.5M), performance materiality $87,500, clearly trivial threshold $6,250. Rationale for benchmark selection documented.</p>', 'W/P Ref: MAT-01'),
        q('ac-q24', '<p>Have all the planned risk assessment procedures been performed and results documented, including the understanding of:</p>', [
          q('ac-q24a', '<p>The entity and its environment, the AFRF and how inherent risk factors affect susceptibility of assertions to misstatement?</p>', undefined, 'Yes', '<p>Understanding of Shipping Line Inc.\'s maritime freight business, ASPE framework, and inherent risk factors (revenue recognition, vessel values, USD exposure) documented in RA working papers.</p>', 'W/P Ref: RA-01'),
          q('ac-q24b', '<p>The entity\'s control environment?</p>', undefined, 'Yes', '<p>Control environment documented through management inquiry, walkthrough of key control activities, and review of organizational structure and oversight by the Board.</p>', 'W/P Ref: RA-02'),
          q('ac-q24c', '<p>The entity\'s risk assessment process?</p>', undefined, 'Yes'),
          q('ac-q24d', '<p>The entity\'s process for monitoring the system of internal control?</p>', undefined, 'Yes'),
          q('ac-q24e', '<p>The entity\'s information system and communication?</p>', undefined, 'Yes'),
        ]),
        q('ac-q27', '<p>Have the following been documented:</p>', [
          q('ac-q27a', '<p>Engagement team discussion, including decisions reached regarding fraud?</p>', undefined, 'Yes', '<p>Engagement team discussion held April 7, 2024. Fraud risk considered — management override identified as relevant risk. Revenue recognition presumed risk evaluated and not rebutted.</p>', 'W/P Ref: RA-03'),
          q('ac-q27b', '<p>If applicable, rebuttal of presumed fraud risk related to revenue recognition?</p>', undefined, 'No', '<p>Revenue recognition fraud risk not rebutted — treated as significant risk throughout the audit with specific substantive procedures designed to address it.</p>'),
          q('ac-q27c', '<p>The assessment of RMMs (due to fraud and error) identified at the F/S level and at the assertion level?</p>', undefined, 'Yes', '<p>RMM assessment documented at F/S level (management override) and assertion level (revenue completeness/cutoff, vessel impairment valuation, USD translation accuracy).</p>', 'W/P Ref: RA-04'),
          q('ac-q27d', '<p>The evaluation of identified controls in the control activities component, including that address RMMs due to fraud?</p>', undefined, 'Yes'),
          q('ac-q27e', '<p>The rationale for significant judgments made?</p>', undefined, 'Yes', '<p>Significant judgment rationale documented for: vessel impairment assessment, revenue cutoff determination, and allowance for doubtful accounts estimation.</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-3',
      title: 'Responding to Risk',
      questions: [
        q('ac-q30', '<p>Have the planned further audit procedures been performed and the results documented, including:</p>', [
          q('ac-q30a', '<p>The overall responses to the RMMs, including fraud, at the F/S level?</p>', undefined, 'Yes'),
          q('ac-q30b', '<p>The linkage between the overall responses to the RMMs, including fraud, at the assertion level?</p>', undefined, 'Yes'),
          q('ac-q30c', '<p>The nature, timing and extent of further procedures performed, including those designed to address the risk of management override of controls and significant risks?</p>', undefined, 'Yes', '<p>NTE of all further audit procedures documented in working papers. Journal entry testing and unpredictability measures documented to address management override risk.</p>'),,
          q('ac-q30d', '<p>The linkage of the further audit procedures to the RMMs at the assertion level?</p>', undefined, 'Yes'),
          q('ac-q30e', '<p>Unpredictable procedures addressing fraud risks?</p>', undefined, 'Yes', '<p>Unannounced inventory observation (February 2024) and expansion of AR confirmation scope documented as unpredictable procedures.</p>', 'W/P Ref: PL-02'),
          q('ac-q30f', '<p>Procedures addressing identified or suspected non-compliance with laws and regulations, including significant professional judgments and conclusions reached?</p>', undefined, 'Yes', '<p>Management inquired regarding compliance with Transport Canada regulations and environmental requirements. No non-compliance identified during the audit.</p>'),
          q('ac-q30g', '<p>Response(s) if management has not taken appropriate steps to understand and address estimation uncertainty?</p>', undefined, 'NA', '<p>Management has taken appropriate steps to understand and address estimation uncertainty for all significant estimates, particularly vessel useful lives and depreciation rates.</p>'),
          q('ac-q30h', '<p>Evaluation of the implications of any indicators of possible management bias related to accounting estimates?</p>', undefined, 'Yes', '<p>No indicators of management bias identified. Vessel depreciation rates, allowance for doubtful accounts, and revenue estimates assessed as reasonable and consistent with industry norms.</p>'),
          q('ac-q30i', '<p>Significant judgments made relating to whether accounting estimates and related disclosures are reasonable?</p>', undefined, 'Yes'),
          q('ac-q30j', '<p>How any inconsistencies regarding a significant matter were addressed?</p>', undefined, 'NA', '<p>No significant inconsistencies identified during the audit.</p>'),
          q('ac-q30k', '<p>The reasoning for departures from CAS requirements and how alternative procedures performed achieved the required objective?</p>', undefined, 'NA', '<p>No departures from CAS requirements in this engagement.</p>'),
        ]),
        q('ac-q40', '<p>Where deviations were found in substantive (sampling) tests, was the nature and cause investigated?</p>', undefined, 'Yes', '<p>One deviation found in AP three-way match TOC testing. Nature and cause investigated — isolated clerical error, not indicative of fraud or systemic control failure. No sampling deviations in substantive tests.</p>'),
        q('ac-q50', '<p>If audit evidence about the operating effectiveness of controls obtained in previous audits was used in the current period audit, does the audit documentation include the conclusions reached about relying on those controls?</p>', undefined, 'NA', '<p>No reliance placed on prior year control testing. All controls tested in the current year.</p>'),
        q('ac-q55', '<p>Have all identified related parties and the nature of the related party relationships been included in the audit documentation?</p>', undefined, 'Yes', '<p>Related parties documented: majority shareholder (individual), related management services company, and related vessel charter company. All relationships and transactions documented in RPT working papers.</p>', 'W/P Ref: RPT-01'),
        q('ac-q60', '<p>If fraud was identified or suspected, has it been determined whether law, regulation or relevant ethical requirements:</p>', [
          q('ac-q60a', '<p>Require reporting to an appropriate authority outside the entity?</p>', undefined, 'NA', '<p>No fraud identified or suspected during the audit. This question is not applicable.</p>'),
          q('ac-q60b', '<p>Establish responsibilities under which reporting to an appropriate authority outside the entity may be appropriate in the circumstances?</p>', undefined, 'NA', '<p>No fraud identified or suspected. Not applicable.</p>'),
        ]),
        q('ac-q65', '<p>Have any consultations undertaken during the engagement been documented, including the relevant nature, scope, conclusions and implementation of those conclusions?</p>', undefined, 'NA', '<p>No formal consultations undertaken during this engagement. All matters resolved by the engagement team and partner.</p>'),
        q('ac-q66', '<p>If the work of the entity\'s internal audit function was used, have the documentation requirements in CAS 610.36-37 been reviewed and included in the audit file?</p>', undefined, 'NA', '<p>Shipping Line Inc. does not have an internal audit function. CAS 610 not applicable.</p>'),
        q('ac-q67', '<p>If any possible material misstatements in the comparative information were discovered, have additional audit procedures been performed to obtain sufficient appropriate audit evidence to determine whether a material misstatement exists?</p>', undefined, 'NA', '<p>No possible material misstatements in the comparative information (March 31, 2023) were identified.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-4',
      title: 'Communications with Those Charged with Governance, Management and Others',
      questions: [
        q('ac-q71', '<p>Have the following been communicated to management, TCWG, regulators and others:</p>', [
          q('ac-q71a', '<p>Identified fraud or indications of fraud?</p>', undefined, 'NA', '<p>No fraud identified during the audit.</p>'),
          q('ac-q71b', '<p>Identified or suspected non-compliance with laws and regulations?</p>', undefined, 'NA', '<p>No non-compliance with laws or regulations identified during the audit.</p>'),
          q('ac-q71c', '<p>Other significant audit matters?</p>', undefined, 'Yes', '<p>Three adjusting journal entries communicated to management and included in TCWG final communication letter.</p>'),,
        ]),
        q('ac-q73', '<p>Have the following been communicated to management:</p>', [
          q('ac-q73a', '<p>Significant deficiencies in internal control (in writing)?</p>', undefined, 'NA', '<p>No significant deficiencies identified. One minor observation (AP three-way match isolated error) communicated verbally and included in management letter as a minor recommendation.</p>'),
          q('ac-q73b', '<p>Other deficiencies in internal control identified during the audit?</p>', undefined, 'Yes', '<p>One minor control observation communicated to management: isolated AP three-way match deviation. Included in management letter with a recommendation to reinforce staff training.</p>'),
          q('ac-q73c', '<p>Identified misstatements and has management been asked to correct all identified misstatements (other than those clearly trivial), including those in F/S disclosures?</p>', undefined, 'Yes', '<p>Three AJEs communicated to management. Management agreed to record all three adjustments. Final financial statements confirmed as reflecting all corrections.</p>', 'W/P Ref: MIS-02'),
        ]),
        q('ac-q75', '<p>Planning — Have copies of the following communications with TCWG been included in the audit file?</p>', [
          q('ac-q75a', '<p>The planned scope and timing of the audit, including significant risks identified?</p>', undefined, 'Yes', '<p>Planning communication to Board on file, dated April 7, 2024.</p>', 'W/P Ref: AC-03'),
          q('ac-q75b', '<p>A description of the audit team\'s responsibilities?</p>', undefined, 'Yes'),
          q('ac-q75c', '<p>The form, timing and expected general content of communications?</p>', undefined, 'Yes'),
          q('ac-q75d', '<p>Relevant ethical requirements (including independence) applied?</p>', undefined, 'Yes'),
        ]),
        q('ac-q77', '<p>Internal control — Significant deficiencies in internal control (in writing)?</p>', undefined, 'NA', '<p>No significant deficiencies identified. Not applicable.</p>'),
        q('ac-q79', '<p>Audit results — Views about significant qualitative aspects of the entity\'s accounting practices?</p>', [
          q('ac-q79a', '<p>Circumstances of the entity?</p>', undefined, 'Yes', '<p>TCWG informed of significant qualitative aspects including: voyage completion revenue policy assessment, vessel impairment assessment, and AJEs identified and corrected.</p>', 'W/P Ref: AC-04'),
          q('ac-q79b', '<p>Significant difficulties, if any, encountered during the audit?</p>', undefined, 'NA', '<p>No significant difficulties encountered during the audit.</p>'),
          q('ac-q79c', '<p>Any circumstances that affect the form and content of the auditor\'s report?</p>', undefined, 'NA', '<p>No circumstances affect the form and content of the auditor\'s report. An unmodified opinion is issued.</p>'),
          q('ac-q79d', '<p>Any other significant matters that are relevant to the oversight of the financial reporting process?</p>', undefined, 'Yes', '<p>Three AJEs communicated: revenue cutoff ($45K), depreciation correction ($12K), deferred revenue reclassification ($28K). All corrected by management. No uncorrected misstatements.</p>'),
          q('ac-q79e', '<p>Misstatements not corrected by management — have TCWG been informed of the effect, requested to correct, and informed of the effect of uncorrected prior period misstatements?</p>', undefined, 'NA', '<p>All identified misstatements corrected by management. No uncorrected misstatements to communicate.</p>'),
          q('ac-q79f', '<p>Unless all of TCWG are involved in managing the entity: significant matters arising during the audit discussed or subject to correspondence with management, and requested written representations?</p>', undefined, 'Yes', '<p>TCWG are not all involved in managing the entity (Board includes independent directors). Significant matters communicated to TCWG. Written representations obtained from management.</p>'),
        ]),
        q('ac-q81', '<p>Has there been timely and adequate two-way communication? If not, were the reasons evaluated and appropriate action taken?</p>', undefined, 'Yes', '<p>Timely and adequate two-way communication maintained throughout the engagement. Management was responsive to all audit queries. TCWG provided feedback on the planning communication.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-5',
      title: 'Subsequent Changes',
      questions: [
        q('ac-q84', '<p>Has the reasoning for any significant changes made to the original audit strategy been documented?</p>', undefined, 'NA', '<p>No significant changes made to the original audit strategy. Audit proceeded as planned.</p>'),
        q('ac-q87', '<p>Have the RMMs been updated to reflect changes resulting from the audit procedures performed, including when misstatements that were not expected when assessing the RMMs are detected at an interim date?</p>', undefined, 'Yes', '<p>RMMs updated upon identification of revenue cutoff misstatement. Additional procedures performed on revenue cutoff; overall risk assessment remained consistent with original assessment.</p>'),
        q('ac-q93', '<p>Have any revisions to overall materiality, performance materiality and materiality for specific circumstances (if applicable) been documented?</p>', undefined, 'NA', '<p>No revisions to materiality required. Actual revenue was consistent with planning estimate.</p>'),
        q('ac-q95', '<p>If after the engagement was accepted, management imposed a limitation on the scope of the audit that is likely to result in a qualified or disclaimer of opinion, was a request made that management remove the limitation?</p>', undefined, 'NA', '<p>No scope limitations imposed by management.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-6',
      title: 'Overall Evaluation',
      questions: [
        q('ac-q101', '<p>Have working papers been signed off and dated by the preparer and reviewer, prepared on a timely basis and do they include appropriate details such that an auditor with no previous connection to the audit engagement could understand the procedures performed, results, findings and conclusions reached?</p>', undefined, 'Yes', '<p>All working papers signed off and dated by preparer and reviewer. Documentation is sufficient for an informed third party to understand procedures performed, evidence obtained, and conclusions reached.</p>', 'W/P Ref: SUM-01'),
        q('ac-q107', '<p>When performing the final analytical procedures, were any inconsistencies identified, and was the information obtained and documented in the engagement file explained and resolved?</p>', undefined, 'Yes', '<p>Final analytical procedures completed. Revenue trend explained by new contracts in Q4 ($120K). No unexplained inconsistencies remained at completion of audit.</p>', 'W/P Ref: FAR-01'),
        q('ac-q110', '<p>Based on the audit procedures performed and audit evidence obtained:</p>', [
          q('ac-q110a', '<p>Are the risk assessments (including RMM at the assertion level) still appropriate, including when management bias has been identified?</p>', undefined, 'Yes'),
          q('ac-q110b', '<p>Are management\'s decisions relating to recognition, measurement, presentation and disclosure (including accounting estimates) in accordance with the AFRF?</p>', undefined, 'Yes', '<p>All accounting policies and estimates assessed as compliant with ASPE. Three AJEs corrected — remaining presentation and disclosure assessed as appropriate.</p>'),
          q('ac-q110c', '<p>Has sufficient appropriate evidence been obtained to form an opinion on if the F/S are prepared, in all material respects, in accordance with the AFRF?</p>', undefined, 'Yes', '<p>Sufficient appropriate audit evidence obtained across all significant assertions. Unmodified opinion supported.</p>'),
          q('ac-q110d', '<p>Is the going concern basis of accounting appropriate and supported by sufficient appropriate audit evidence?</p>', undefined, 'Yes', '<p>Going concern assessed as appropriate. No indicators of going concern doubt identified. Entity has positive net income, adequate working capital, and an established credit facility with availability.</p>'),
          q('ac-q110e', '<p>Did the engagement team remain alert throughout the audit for audit evidence of events or conditions that may cast significant doubt on the entity\'s ability to continue as a going concern?</p>', undefined, 'Yes'),
        ]),
        q('ac-q117', '<p>Do the F/S, including disclosures, agree with or reconcile to the underlying accounting records?</p>', undefined, 'Yes', '<p>Financial statements agreed to the trial balance and supporting schedules. Disclosures cross-referenced to supporting working papers. No unexplained differences identified.</p>', 'W/P Ref: FS-01'),
        q('ac-q124', '<p>In forming an audit opinion as to whether the F/S are prepared, in all material respects, in accordance with the AFRF, is/are the:</p>', [
          q('ac-q124a', '<p>AFRF adequately referred to or described?</p>', undefined, 'Yes'),
          q('ac-q124b', '<p>Entity\'s accounting practices, including management\'s judgments, free from any indicators of possible management bias?</p>', undefined, 'Yes'),
          q('ac-q124c', '<p>Significant accounting policies appropriately disclosed?</p>', undefined, 'Yes'),
          q('ac-q124d', '<p>Accounting policies consistent with the AFRF and appropriate?</p>', undefined, 'Yes'),
          q('ac-q124e', '<p>Accounting estimates and related disclosures reasonable?</p>', undefined, 'Yes'),
          q('ac-q124f', '<p>Information presented in the F/S relevant, reliable, comparable and understandable?</p>', undefined, 'Yes'),
          q('ac-q124g', '<p>Disclosures adequate to enable the intended users to understand the effect of material transactions and events on the information conveyed in the F/S?</p>', undefined, 'Yes'),
          q('ac-q124h', '<p>Terminology used in the F/S, including title of each F/S, appropriate?</p>', undefined, 'Yes'),
          q('ac-q124i', '<p>Identified related party relationships and transactions appropriately accounted for and disclosed?</p>', undefined, 'Yes', '<p>Related party transactions ($185K revenue, $125K management fees, $240K charter fees) appropriately disclosed in Note 12.</p>', 'W/P Ref: RPT-02'),
          q('ac-q124j', '<p>If the F/S achieve fair presentation through the overall presentation, structure and content of the F/S?</p>', undefined, 'Yes'),
          q('ac-q124k', '<p>Whether the F/S represent the underlying transactions and events in a manner that achieves fair presentation?</p>', undefined, 'Yes'),
          q('ac-q124l', '<p>Whether the effects of the related party relationships and transactions prevent the F/S from achieving fair presentation?</p>', undefined, 'No'),
          q('ac-q124m', '<p>For compliance frameworks: whether the effects of the related party relationships and transactions cause the F/S to be misleading?</p>', undefined, 'NA'),
        ]),
        q('ac-q127', '<p>If the answer is "No" to any of the questions in procedure 124 and the F/S are materially misstated, or sufficient appropriate audit evidence cannot be obtained, has the audit opinion been modified in accordance with CAS 705?</p>', undefined, 'NA', '<p>No modifications required. An unmodified audit opinion is issued on the March 31, 2024 financial statements of Shipping Line Inc.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-7',
      title: 'Reporting',
      questions: [
        q('ac-q130', '<p>Identified misstatements — Have the following been documented:</p>', [
          q('ac-q130a', '<p>All misstatements accumulated during the audit, and whether they have been corrected?</p>', undefined, 'Yes', '<p>All three AJEs documented in the misstatement summary and confirmed as corrected by management in the final financial statements.</p>', 'W/P Ref: MIS-01'),
          q('ac-q130b', '<p>The conclusion as to whether uncorrected misstatements are material, individually or in aggregate, and the basis for that conclusion?</p>', undefined, 'Yes', '<p>No uncorrected misstatements. All identified misstatements corrected. Projected misstatements of $30K are below performance materiality — concluded as not material.</p>', 'W/P Ref: MIS-02'),
        ]),
        q('ac-q135', '<p>Subsequent events — Have subsequent events procedures been performed up to the report date?</p>', undefined, 'Yes', '<p>Subsequent events procedures completed through May 2, 2024 (date of audit report). Management inquiry conducted on April 25, 2024. No subsequent events requiring adjustment or disclosure identified.</p>', 'W/P Ref: SE-01'),
        q('ac-q136', '<p>Have subsequent events that may require adjustment of, or disclosure in, the F/S been identified and addressed?</p>', undefined, 'No', '<p>No subsequent events identified requiring adjustment or disclosure.</p>'),
        q('ac-q137', '<p>If there is a significant delay in the approval of the F/S by management or TCWG after the date of the F/S, have inquiries been made regarding the reasons for the delay?</p>', undefined, 'NA', '<p>No significant delay in approval. Financial statements approved by management on May 2, 2024 (32 days after year-end).</p>'),
        q('ac-q138', '<p>Has Form 625 been completed if the delay is believed to be related to events or conditions relating to the going concern assessment?</p>', undefined, 'NA', '<p>No delay attributable to going concern issues. Going concern is not in doubt.</p>'),
        q('ac-q139', '<p>Is a signed management representation letter (dated on or before date of audit report) included in the audit file?</p>', undefined, 'Yes', '<p>Signed management representation letter dated April 25, 2024 (before audit report date of May 2, 2024) is included in the audit file. Signed by CEO and CFO of Shipping Line Inc.</p>', 'W/P Ref: MRL-01'),
        q('ac-q140', '<p>Where applicable, was the engagement quality review completed and the approval evidenced in the file (signed off) on or before the audit report was dated?</p>', undefined, 'NA', '<p>EQCR not required for this engagement.</p>'),
        q('ac-q141', '<p>Has Form 305 been completed to ensure the form and content of the auditor\'s report are appropriate?</p>', undefined, 'Yes', '<p>Auditor\'s report checklist (Form 305) completed. Unmodified opinion issued in accordance with CAS 700. Report date: May 2, 2024.</p>', 'W/P Ref: AR-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-8',
      title: 'Audit Procedures After the Audit Report Date',
      questions: [
        q('ac-q150', '<p>If, in exceptional circumstances, new or additional audit procedures were performed or new conclusions drawn after the date of the auditor\'s report, have the following been documented:</p>', [
          q('ac-q150a', '<p>The circumstances encountered?</p>', undefined, 'NA'),
          q('ac-q150b', '<p>The new or additional audit procedures performed, audit evidence obtained, and conclusions reached, and their effect on the auditor\'s report?</p>', undefined, 'NA'),
          q('ac-q150c', '<p>When and by whom the resulting changes to audit documentation were made and reviewed?</p>', undefined, 'NA', '<p>No post-report procedures were required.</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ac-9',
      title: 'File Assembly and Archival',
      questions: [
        q('ac-q160', '<p>Has all audit documentation been assembled in the audit file on a timely basis after the date of the auditor\'s report (usually not more than 60 days after)?</p>', undefined, 'Yes', '<p>Audit file assembly completed by June 30, 2024 — within 60 days of the May 2, 2024 audit report date.</p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-completion',
    title: 'Audit Completion Checklist',
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
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-ep-1',
      title: 'Audit Engagement Quality (CAS 220.13-15, 23, 24, 40(b))',
      questions: [
        q('ep-q1', '<p>Have you created an environment for the engagement that emphasizes the firm\'s culture and expected behaviour of engagement team members by:</p>', [
          q('ep-q1a', '<p>Being sufficiently and appropriately involved in the audit?</p>', undefined, 'Yes', '<p>J. Williams was involved throughout the engagement including: planning meeting (April 7), mid-fieldwork review (April 19), and final file review (May 2, 2024).</p>'),
          q('ep-q1b', '<p>Emphasizing the following to all engagement team members: management and achievement of quality, importance of professional ethics, values and attitudes, importance of open and robust communication within the team, and exercising professional skepticism throughout the engagement?</p>', undefined, 'Yes', '<p>Quality expectations and professional skepticism emphasized at the April 7, 2024 planning meeting. Specific emphasis on revenue recognition risk and vessel impairment assessment.</p>'),
          q('ep-q1c', '<p>Supervising, directing and reviewing work of engagement team members who designed or performed procedures to comply with the requirements of CAS 220?</p>', undefined, 'Yes'),
        ]),
        q('ep-q2', '<p>Have you taken into account information obtained in the acceptance and continuance process in planning and performing the audit engagement?</p>', undefined, 'Yes', '<p>Client continuance assessment reviewed prior to planning. No integrity or risk concerns noted. Information incorporated into audit plan and risk assessment.</p>'),
        q('ep-q3', '<p>If you or the engagement team became aware of information that may have caused the firm to decline the audit engagement had that information been known prior to accepting or continuing, did you communicate that information promptly to the firm?</p>', undefined, 'NA', '<p>No such information came to the attention of the engagement team during the audit.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-2',
      title: 'Relevant Ethical Requirements, Independence and Compliance (CAS 220.17-21)',
      questions: [
        q('ep-q4', '<p>Have you made inquiries of the engagement team to ensure that:</p>', [
          q('ep-q4a', '<p>The team understands the relevant ethical requirements, including those related to independence?</p>', undefined, 'Yes', '<p>Independence confirmations obtained from all engagement team members at planning. Team confirmed understanding of independence requirements applicable to this engagement.</p>', 'W/P Ref: IND-01'),
          q('ep-q4b', '<p>The team maintained their independence throughout the engagement?</p>', undefined, 'Yes', '<p>No independence breaches identified. All team members confirmed maintained independence through to the date of the audit report.</p>'),
          q('ep-q4c', '<p>Any potential breaches of ethical requirements, independence, or compliance with laws and regulations were communicated to you?</p>', undefined, 'Yes', '<p>No potential breaches communicated by any engagement team member during the engagement.</p>'),
          q('ep-q4d', '<p>Where a potential breach was identified, the threat was evaluated, appropriate actions taken and conclusions documented, and firm policies were adhered to?</p>', undefined, 'NA', '<p>No potential breaches identified. Not applicable.</p>'),
        ]),
        q('ep-q5', '<p>Were you alert throughout the engagement for breaches of relevant ethical requirements or the firm\'s related policies or procedures by members of the engagement team?</p>', undefined, 'Yes'),
        q('ep-q6', '<p>If you or the engagement team became aware of information that may have caused the firm to decline the audit engagement, did you communicate that information promptly to the firm?</p>', undefined, 'NA', '<p>No such information identified during the engagement.</p>'),
        q('ep-q7', '<p>Prior to dating the auditor\'s report have you determined whether relevant ethical requirements, including those related to independence, have been fulfilled?</p>', undefined, 'Yes', '<p>Independence and ethical requirements confirmed as fulfilled prior to dating the audit report on May 2, 2024.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-3',
      title: 'Engagement Resources',
      questions: [
        q('ep-q8', '<p>Were sufficient and appropriate staffing, technological and intellectual resources made available to the engagement team? (CAS 220.25)</p>', undefined, 'Yes', '<p>Engagement team of four (partner, manager, senior, staff) was appropriate for the size and complexity of this engagement. No resource constraints encountered.</p>'),
        q('ep-q9', '<p>Did you ensure that the engagement team, including any external resources, had the appropriate competence and capabilities (including sufficient time) to perform the engagement? (CAS 220.26)</p>', undefined, 'Yes', '<p>Team competencies assessed as appropriate. S. Chen has 8 years audit experience including prior year on this engagement. Team had familiarity with maritime industry.</p>'),
        q('ep-q10', '<p>Where changes in staffing or timing were necessary, did you take appropriate actions to ensure that additional resources were made available to the team? (CAS 220.27)</p>', undefined, 'NA', '<p>No changes in staffing or timing were necessary during the engagement.</p>'),
        q('ep-q11', '<p>Have you utilized the resources assigned or made available to the engagement team appropriately, given the nature and circumstances of the audit engagement? (CAS 220.28)</p>', undefined, 'Yes'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-4',
      title: 'Engagement Performance',
      questions: [
        q('ep-q12', '<p>When planning and performing the engagement, was information obtained in the engagement acceptance and continuance process taken into account?</p>', undefined, 'Yes'),
        q('ep-q13', '<p>Were you sufficiently involved throughout the engagement to ensure that the audit procedures were:</p>', [
          q('ep-q13a', '<p>Planned and performed in accordance with the firm\'s policies and professional standards, and any applicable legal and regulatory requirements? (CAS 220.30(a))</p>', undefined, 'Yes'),
          q('ep-q13b', '<p>Appropriate given the nature and circumstances of the engagement, including significant judgments made and conclusions reached? (CAS 220.30(b), 40(a))</p>', undefined, 'Yes'),
        ]),
        q('ep-q14', '<p>Did you perform a timely review of audit evidence at appropriate stages in the audit, including documentation related to:</p>', [
          q('ep-q14a', '<p>Significant matters? (CAS 220.31(a))</p>', undefined, 'Yes', '<p>Significant matters reviewed: revenue cutoff AJE, vessel impairment assessment, and related party disclosures. Review documented with partner sign-off dates.</p>'),
          q('ep-q14b', '<p>Significant judgments, including those related to difficult or contentious matters? (CAS 220.31(b))</p>', undefined, 'Yes', '<p>Vessel impairment assessment (key judgment) reviewed by partner. Conclusion that no impairment exists supported by management appraisal and market data review.</p>'),
          q('ep-q14c', '<p>Significant risks and the results of the audit response?</p>', undefined, 'Yes'),
          q('ep-q14d', '<p>Other matters that, in your judgment, are relevant to fulfilling your role as the engagement partner? (CAS 220.31(c))</p>', undefined, 'Yes'),
          q('ep-q14e', '<p>The draft F/S? (CAS 220.33)</p>', undefined, 'Yes', '<p>Draft financial statements reviewed by partner on April 30, 2024. AJEs confirmed as reflected. Disclosures reviewed for adequacy and completeness.</p>'),
          q('ep-q14f', '<p>The proposed auditor\'s report? (CAS 220.33)</p>', undefined, 'Yes', '<p>Proposed unmodified audit report reviewed by partner on May 1, 2024. Wording confirmed as appropriate per CAS 700.</p>'),
          q('ep-q14g', '<p>Any formal written communications to management/TCWG, including deficiencies in internal control or potential key audit matters, or to regulatory authorities? (CAS 220.34)</p>', undefined, 'Yes', '<p>TCWG final communication letter reviewed by partner. Management letter (minor control observation) reviewed and approved. No regulatory communications required.</p>', 'W/P Ref: AC-04'),
        ]),
        q('ep-q15', '<p>Did you take responsibility for the engagement team undertaking any consultations on the engagement?</p>', [
          q('ep-q15a', '<p>The engagement team has undertaken appropriate consultation during the engagement?</p>', undefined, 'NA', '<p>No formal consultations required during this engagement.</p>'),
          q('ep-q15b', '<p>The nature and scope of, and conclusions resulting from, such consultations are agreed with the party consulted?</p>', undefined, 'NA'),
          q('ep-q15c', '<p>Conclusions agreed to have been implemented?</p>', undefined, 'NA'),
        ]),
        q('ep-q16', '<p>Where the proposed auditor\'s report is modified, did you ensure that the wording is appropriate and in accordance with professional standards?</p>', [
          q('ep-q16a', '<p>There is sufficient documentation and audit evidence to support the modification?</p>', undefined, 'NA', '<p>Audit opinion is unmodified. Not applicable.</p>'),
          q('ep-q16b', '<p>Where applicable, firm consultation policies for modified opinions were followed?</p>', undefined, 'NA'),
        ]),
        q('ep-q17', '<p>Where differences of opinion arose within the engagement team, or between EQR reviewers or other firm members, were:</p>', [
          q('ep-q17a', '<p>The differences of opinion addressed and resolved in accordance with the firm\'s policies? (CAS 220.37)</p>', undefined, 'NA', '<p>No differences of opinion arose within the engagement team during this engagement.</p>'),
          q('ep-q17b', '<p>The conclusions reached adequately documented and implemented prior to the date of the audit report? (CAS 220.38)</p>', undefined, 'NA'),
        ]),
        q('ep-q18', '<p>Where the results of firm monitoring or external inspections could have affected this engagement, were they taken into consideration when planning and performing the engagement? (CAS 220.39)</p>', undefined, 'Yes', '<p>Firm inspection results from prior year reviewed. No findings applicable to this engagement or client type identified.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-5',
      title: 'Engagement Quality Reviewer',
      questions: [
        q('ep-q19', '<p>Where an engagement quality review is required, are you satisfied that: (CAS 220.36)</p>', [
          q('ep-q19a', '<p>An engagement quality reviewer (EQR) has been appointed?</p>', undefined, 'NA', '<p>EQCR not required for this engagement. Shipping Line Inc. does not meet the firm\'s EQCR threshold criteria.</p>'),
          q('ep-q19b', '<p>The engagement team and you have cooperated with the EQR?</p>', undefined, 'NA'),
          q('ep-q19c', '<p>Significant matters and significant judgements arising during the audit have been discussed with the EQR?</p>', undefined, 'NA'),
          q('ep-q19d', '<p>The EQR has been completed before the date of the auditor\'s report?</p>', undefined, 'NA'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ep-6',
      title: 'Overall Evaluation and Conclusions',
      questions: [
        q('ep-q20', '<p>Based on my review of audit documentation and discussions with the engagement team, I take ultimate responsibility and am satisfied that:</p>', [
          q('ep-q20a', '<p>The audit was conducted in accordance with Canadian Auditing Standards. (CAS 220.9)</p>', undefined, 'Yes'),
          q('ep-q20b', '<p>I have an understanding of the relevant ethical requirements, including those related to independence, that are applicable given the nature and circumstances of the audit engagement. (CAS 220.16)</p>', undefined, 'Yes'),
          q('ep-q20c', '<p>Relevant ethical requirements, including those related to independence, have been fulfilled. (CAS 220.20-21)</p>', undefined, 'Yes'),
          q('ep-q20d', '<p>I have directed and supervised the engagement team and the review of their work. (CAS 220.29)</p>', undefined, 'Yes'),
          q('ep-q20e', '<p>I have reviewed the changes made to the original overall audit strategy and audit plan. (CAS 300.11)</p>', undefined, 'Yes', '<p>No material changes to the audit strategy were required. Minor expansion of revenue cutoff testing was reviewed and approved by the partner.</p>'),
          q('ep-q20f', '<p>Significant judgments made and conclusions reached by the engagement team are appropriate given the nature and circumstances of the engagement. (CAS 220.40(a))</p>', undefined, 'Yes', '<p>Partner concurs with all significant judgments: no vessel impairment, voyage completion revenue recognition policy appropriate, related party terms assessed as arm\'s length.</p>'),
          q('ep-q20g', '<p>The nature and circumstances of the audit engagement, including any changes, and the firm\'s policies or procedures have been taken into account to manage and achieve audit quality. (CAS 220.40(b))</p>', undefined, 'Yes'),
          q('ep-q20h', '<p>No restrictions in scope were imposed on us. (CAS 700.17(b))</p>', undefined, 'Yes', '<p>Management imposed no restrictions on the scope of the audit. Full access to all requested records, personnel, and information was provided.</p>'),
          q('ep-q20i', '<p>The audit evidence obtained is sufficient, appropriate and adequately documented to provide a basis for our audit opinion, including the F/S and disclosures. (CAS 220.32)</p>', undefined, 'Yes'),
          q('ep-q20j', '<p>The F/S are presented fairly, in all material respects, in accordance with the applicable financial reporting framework. (CAS 700.16)</p>', undefined, 'Yes', '<p>Partner confirms the March 31, 2024 financial statements of Shipping Line Inc. are presented fairly in all material respects in accordance with ASPE.</p>'),
          q('ep-q20k', '<p>The auditor\'s report is appropriately worded.</p>', undefined, 'Yes', '<p>Unmodified audit report reviewed and confirmed as appropriately worded per CAS 700. Report dated May 2, 2024 and signed by J. Williams, CPA.</p>'),
        ]),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-engagement-partner-audit-completion',
    title: 'Quality Control Review (EP)',
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
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-ar305-1',
      title: '1. Audit Reporting',
      questions: [
        q('ar305-q1', '<p>Has the checklist in Appendix A been reviewed to ensure the auditor\'s report addresses the requirements of CAS 700.20–48?</p><p><em>Note: If an auditor\'s report template (that has been created in accordance with CAS 700) is used as a starting point when drafting the auditor\'s report, completing the checklist in Appendix A is not necessary. However, it is recommended to review it to ensure all required details are captured.</em></p>', undefined, 'Yes', '<p>Appendix A checklist reviewed. Standard audit report template used as starting point. All required CAS 700 elements confirmed as included in the unmodified audit report for Shipping Line Inc.</p>', 'W/P Ref: AR-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-2',
      title: '2. Modifications to the Opinion',
      questions: [
        q('ar305-q2', '<p>Are any of the following applicable which may result in a modified opinion:</p>', [
          q('ar305-q2a', '<p>An inability to meet any relevant CAS objectives or requirements? (CAS 200.24)</p>', undefined, 'No'),
          q('ar305-q2b', '<p>Conflicts between financial reporting standards and legal or regulatory requirements? (CAS 210.18)</p>', undefined, 'No'),
          q('ar305-q2c', '<p>Non-compliance with laws and regulations or limitations on obtaining sufficient appropriate audit evidence regarding non-compliance? (CAS 250.21, 26–28)</p>', undefined, 'No'),
          q('ar305-q2d', '<p>An inability to obtain sufficient appropriate audit evidence for any relevant assertions/SCOTABDs? (CAS 330.27)</p>', undefined, 'No'),
          q('ar305-q2e', '<p>An inability to obtain sufficient appropriate audit evidence regarding services provided by a service organization? (CAS 402.20)</p>', undefined, 'NA'),
          q('ar305-q2f', '<p>An inability to attend a physical inventory count or obtain sufficient appropriate audit evidence about the existence and condition of inventory? (CAS 501.7)</p>', undefined, 'No', '<p>Fuel and supplies inventory observation completed February 2024. No attendance issues encountered.</p>'),
          q('ar305-q2g', '<p>An inability to obtain sufficient appropriate audit evidence about litigation and claims from alternative procedures performed because management refused to provide access to the entity\'s external legal counsel or a response was not received/appropriate? (CAS 501.11)</p>', undefined, 'No', '<p>Legal letter received from external counsel confirming no material litigation or claims as of March 31, 2024.</p>'),
          q('ar305-q2h', '<p>Management\'s refusal to send confirmation requests or lack of sufficient response to confirmation requests? (CAS 505.9, 13)</p>', undefined, 'No', '<p>Management did not refuse to send any confirmations. All 10 AR/AP confirmations received with responses.</p>'),
          q('ar305-q2i', '<p>In an initial audit engagement: (CAS 510.10–13)</p>', [
            q('ar305-q2i-i', '<p>An inability to obtain sufficient appropriate audit evidence regarding opening balances?</p>', undefined, 'NA', '<p>Recurring engagement — not an initial audit. Prior year working papers reviewed.</p>'),
            q('ar305-q2i-ii', '<p>Misstatements in opening balances that materially affect the current period F/S and have not been appropriately accounted for or adequately presented or disclosed?</p>', undefined, 'NA'),
            q('ar305-q2i-iii', '<p>Accounting policies incorrectly applied in opening balances, or changes in accounting policies incorrectly accounted for, presented or disclosed?</p>', undefined, 'NA'),
            q('ar305-q2i-iv', '<p>A predecessor auditor\'s modification to the opinion that remains relevant and material to the current period\'s F/S?</p>', undefined, 'NA'),
          ]),
          q('ar305-q2j', '<p>An inability to obtain sufficient appropriate audit evidence regarding accounting estimates? (CAS 540.34)</p>', undefined, 'No', '<p>Sufficient evidence obtained for all significant estimates including vessel depreciation and allowance for doubtful accounts.</p>'),
          q('ar305-q2k', '<p>Management does not amend the F/S when facts become known after the date of the auditor\'s report but before the F/S are issued or the auditor\'s report has been provided to the entity? (CAS 560.13(a))</p>', undefined, 'No'),
          q('ar305-q2l', '<p>Going concern: (CAS 570.21, 23(a), 24; 700.29)</p>', [
            q('ar305-q2l-i', '<p>Inappropriate use of the going concern basis?</p>', undefined, 'No', '<p>Going concern basis is appropriate. No going concern issues identified.</p>'),
            q('ar305-q2l-ii', '<p>Inadequate financial statement disclosure about a material uncertainty that may cast significant doubt on the entity\'s ability to continue as a going concern?</p>', undefined, 'No'),
            q('ar305-q2l-iii', '<p>Management\'s unwillingness to make or extend a going concern assessment?</p>', undefined, 'No'),
          ]),
          q('ar305-q2m', '<p>Unreliable written representations from management or lack of willingness to provide requested written representations? (CAS 580.20)</p>', undefined, 'No', '<p>Management representation letter received and signed by CEO and CFO on April 25, 2024. All representations assessed as reliable and consistent with audit evidence.</p>'),
          q('ar305-q2n', '<p>In a group audit: uncorrected misstatements, restrictions imposed by group management or other circumstances resulting in the inability to obtain sufficient appropriate audit evidence? (CAS 600.21(b)(ii), 52)</p>', undefined, 'NA', '<p>Not a group audit. Single entity — Shipping Line Inc.</p>'),
          q('ar305-q2o', '<p>F/S do not achieve fair presentation (and are prepared in accordance with a fair presentation framework)? (CAS 700.18)</p>', undefined, 'No', '<p>Financial statements achieve fair presentation in accordance with ASPE.</p>'),
          q('ar305-q2p', '<p>Management-imposed limitation of scope resulting in the inability to obtain sufficient appropriate audit evidence? (CAS 705.13)</p>', undefined, 'No'),
        ]),
        q('ar305-q3', '<p>If a modified opinion is required due to circumstances applicable in procedure 2 above, or if either of the below circumstances apply, has Form 306 been completed to ensure the auditor\'s report appropriately reflects the modified opinion?</p><p>• Based on the audit evidence obtained, the F/S as a whole are not free from material misstatement; or</p><p>• Sufficient appropriate audit evidence cannot be obtained to conclude that the F/S as a whole are free from material misstatement. (CAS 705.6)</p>', undefined, 'NA', '<p>No modified opinion required. An unmodified opinion is issued. Form 306 not applicable.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-3',
      title: '3. Emphasis of Matter & Other Matter',
      questions: [
        q('ar305-q4', '<p>If there is a need to draw attention to a matter presented/disclosed that is fundamental to the users\' understanding of the F/S, has a section with the heading "Emphasis of Matter" been added to the auditor\'s report:</p>', [
          q('ar305-q4a', '<p>Including a clear reference to the matter being emphasized, and where the relevant disclosures fully describing the matter can be found in the F/S?</p>', undefined, 'NA', '<p>No Emphasis of Matter paragraph required.</p>'),
          q('ar305-q4b', '<p>Indicating that the auditor\'s opinion is not modified in respect of the matter emphasized?</p>', undefined, 'NA'),
        ]),
        q('ar305-q5', '<p>If there is a need to draw attention to a matter relevant to the users\' understanding of the audit, the auditor\'s responsibilities or the auditor\'s report, has a section with the heading "Other Matter" been added to the auditor\'s report? (CAS 706.10–11)</p>', undefined, 'NA', '<p>No Other Matter paragraph required in the audit report.</p>'),
        q('ar305-q6', '<p>If an "Emphasis of Matter" and/or "Other Matter" section is expected to be included in the auditor\'s report, has the expected wording of the section(s) been communicated with TCWG? (CAS 706.12)</p>', undefined, 'NA'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-4',
      title: '4. Comparative Information — Corresponding Figures',
      questions: [
        q('ar305-q7', '<p>Have one of the following approaches to comparative information been selected:</p>', [
          q('ar305-q7a', '<p>Corresponding figures (auditor\'s opinion on the F/S refers to the current period only)?</p>', undefined, 'Yes', '<p>Corresponding figures approach adopted. The audit opinion refers to the current period (year ended March 31, 2024) only.</p>'),
          q('ar305-q7b', '<p>Comparative F/S (auditor\'s opinion refers to each period for which F/S are presented)?</p>', undefined, 'No'),
        ]),
        q('ar305-q8', '<p>Does the comparative information agree with amounts and other disclosures presented in the prior period (or restated, if appropriate)? (CAS 710.7(a))</p>', undefined, 'Yes', '<p>Comparative figures agreed to the prior year audit file. No restatements required.</p>'),
        q('ar305-q9', '<p>Does the comparative information consistently reflect the accounting policies applied in the current period? If there have been changes in accounting policies, have those changes been properly accounted for and adequately presented and disclosed? (CAS 710.7(b))</p>', undefined, 'Yes', '<p>No changes in accounting policies from prior year. Comparative figures reflect consistent application of ASPE.</p>'),
        q('ar305-q10', '<p>Does the opinion in the auditor\'s report only refer to the current period (not corresponding figures), unless:</p>', [
          q('ar305-q10a', '<p>A modified opinion was issued in the prior period and the matter that gave rise to the modification is unresolved?</p>', undefined, 'No', '<p>Unmodified opinion issued in prior year. No unresolved prior year modifications.</p>'),
          q('ar305-q10b', '<p>A material misstatement is discovered in the prior period F/S on which an unmodified opinion was previously issued?</p>', undefined, 'No'),
          q('ar305-q10c', '<p>The prior period F/S were not audited?</p>', undefined, 'No', '<p>Prior period financial statements were audited by the same firm. Unmodified opinion issued.</p>'),
        ]),
        q('ar305-q11', '<p>If a modified opinion was issued in the prior period and the matter is unresolved, does the Basis for Opinion section of the auditor\'s report either:</p>', [
          q('ar305-q11a', '<p>Refer to both the current period\'s figures and the corresponding figures in the description of the matter giving rise to the modification?</p>', undefined, 'NA'),
          q('ar305-q11b', '<p>Explain that the audit opinion has been modified because of the effects or possible effects of the unresolved matter on the comparability of the current period\'s figures and the corresponding figures?</p>', undefined, 'NA'),
        ]),
        q('ar305-q12', '<p>If a material misstatement was discovered in the prior period F/S on which an unmodified opinion was previously issued, and the corresponding figures have not been properly restated or adequate disclosures made, has a qualified or adverse opinion been expressed on the current period F/S, modified with respect to the corresponding figures? (CAS 710.12)</p>', undefined, 'NA'),
        q('ar305-q13', '<p>If the prior period F/S were not audited, has an "Other Matter" section been included in the auditor\'s report, stating that the corresponding figures are unaudited? (CAS 710.14)</p>', undefined, 'NA', '<p>Prior period financial statements were audited.</p>'),
        q('ar305-q14', '<p>If the prior period F/S were audited by a predecessor auditor, has an "Other Matter" section been included in the auditor\'s report, stating:</p>', [
          q('ar305-q14a', '<p>That the F/S of the prior period were audited by a predecessor auditor?</p>', undefined, 'NA', '<p>Prior period audited by same firm. No predecessor auditor.</p>'),
          q('ar305-q14b', '<p>The type of opinion expressed by the predecessor auditor and, if the opinion was modified, the reasons for the modification?</p>', undefined, 'NA'),
          q('ar305-q14c', '<p>The date of the predecessor auditor\'s report?</p>', undefined, 'NA'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-5',
      title: '5. Comparative Information — Comparative F/S',
      questions: [
        q('ar305-q15', '<p>Does the comparative information agree with amounts and other disclosures presented in the prior period (or restated, if appropriate)? (CAS 710.7(a))</p>', undefined, 'NA', '<p>Corresponding figures approach adopted — sections 5 (Comparative F/S) not applicable.</p>'),
        q('ar305-q16', '<p>Does the comparative information consistently reflect the accounting policies applied in the current period? If there have been changes in accounting policies, have those changes been properly accounted for and adequately presented and disclosed? (CAS 710.7(b))</p>', undefined, 'NA'),
        q('ar305-q17', '<p>Does the opinion in the auditor\'s report refer to each period for which F/S are presented (and on which an audit opinion is expressed)? (CAS 710.15)</p>', undefined, 'NA'),
        q('ar305-q18', '<p>If the opinion on the prior period F/S differs from the opinion previously expressed, has an "Other Matter" section been included in the auditor\'s report that discloses the substantive reasons for the different opinion? (CAS 710.16)</p>', undefined, 'NA'),
        q('ar305-q19', '<p>If the prior period F/S were audited by a predecessor auditor, has an "Other Matter" section been included in the auditor\'s report, stating:</p>', [
          q('ar305-q19a', '<p>That the F/S of the prior period were audited by a predecessor auditor?</p>', undefined, 'NA'),
          q('ar305-q19b', '<p>The type of opinion expressed by the predecessor auditor and, if the opinion was modified, the reasons for the modification?</p>', undefined, 'NA'),
          q('ar305-q19c', '<p>The date of the predecessor auditor\'s report?</p>', undefined, 'NA'),
        ]),
        q('ar305-q20', '<p>If the prior period F/S were audited by a predecessor auditor (upon which an unmodified opinion was expressed), and the audit team discovers a material misstatement that affects the prior period F/S:</p>', [
          q('ar305-q20a', '<p>Has the misstatement been communicated with the appropriate level of management and TCWG, requesting that the predecessor auditor be informed?</p>', undefined, 'NA'),
          q('ar305-q20b', '<p>If the prior period F/S are amended and the predecessor auditor issues a new auditor\'s report on the prior period F/S, has the current auditor\'s report been amended to only report on the current period?</p>', undefined, 'NA'),
        ]),
        q('ar305-q21', '<p>If the prior period F/S were not audited, has an "Other Matter" section been included in the auditor\'s report, stating that the comparative F/S are unaudited? (CAS 710.19)</p>', undefined, 'NA'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-6',
      title: '6. Use of Auditor\'s Expert',
      questions: [
        q('ar305-q22', '<p>If the auditor\'s report refers to the work of an auditor\'s expert, does the report indicate that the reference does not reduce the auditor\'s responsibility for the opinion? (CAS 620.14–15)</p><p><em>Note: The auditor\'s report should not refer to the work of an auditor\'s expert unless required by law or regulation, or the auditor\'s report contains a modified opinion and the work of the auditor\'s expert is relevant to explain the nature of the modification.</em></p>', undefined, 'NA', '<p>No auditor\'s expert used. Audit report does not refer to any expert work.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-7',
      title: '7. Key Audit Matters',
      questions: [
        q('ar305-q23', '<p>If the engagement is for a listed entity (or the engagement partner determines it is appropriate), has a "Key Audit Matters" section been included in the auditor\'s report? (CAS 701.5, 13)</p>', undefined, 'NA', '<p>Shipping Line Inc. is not a listed entity and the engagement partner did not determine it is appropriate to include Key Audit Matters in this engagement.</p>'),
        q('ar305-q24', '<p>If Key Audit Matters are to be communicated, have the following been addressed:</p>', [
          q('ar305-q24a', '<p>Matters communicated with TCWG, significant risks, and significant auditor judgments considered?</p>', undefined, 'NA'),
          q('ar305-q24b', '<p>Each key audit matter described with reference to the related disclosure(s) in the F/S?</p>', undefined, 'NA'),
          q('ar305-q24c', '<p>Why the matter was considered to be one of most significance and how the matter was addressed in the audit?</p>', undefined, 'NA'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-8',
      title: '8. Going Concern',
      questions: [
        q('ar305-q25', '<p>If a material uncertainty related to going concern has been adequately disclosed in the F/S, has a section with the heading "Material Uncertainty Related to Going Concern" been included in the auditor\'s report? (CAS 570.22)</p>', undefined, 'NA', '<p>No material uncertainty related to going concern exists. Section not included in the audit report.</p>'),
        q('ar305-q26', '<p>If no material uncertainty exists but close-call events or conditions have been identified, has the adequacy of F/S disclosures been evaluated and has a determination been made whether to include an Emphasis of Matter paragraph? (CAS 570.25)</p>', undefined, 'NA', '<p>No close-call going concern events or conditions identified.</p>'),
        q('ar305-q27', '<p>If the going concern basis of accounting is used inappropriately, has the opinion been modified? (CAS 570.21)</p>', undefined, 'NA', '<p>Going concern basis is appropriate. No modification required.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-9',
      title: '9. Group Audit',
      questions: [
        q('ar305-q28', '<p>If a group audit, has the auditor\'s report been appropriately worded in accordance with CAS 600? (CAS 600.50–52)</p>', undefined, 'NA', '<p>Not a group audit. Single entity — Shipping Line Inc.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-10',
      title: '10. Other Reporting Responsibilities',
      questions: [
        q('ar305-q29', '<p>If other reporting responsibilities (in addition to the auditor\'s responsibilities under the CASs) are addressed in the auditor\'s report, have these other reporting responsibilities been:</p>', [
          q('ar305-q29a', '<p>Included in a separate section in the report with a heading titled "Report on Other Legal and Regulatory Requirements" (or as appropriate)?</p>', undefined, 'NA', '<p>No other reporting responsibilities applicable to this engagement.</p>'),
          q('ar305-q29b', '<p>If presented in the same section, clearly differentiated from the reporting required by the CASs?</p>', undefined, 'NA'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-11',
      title: '11. Auditor\'s Report Prescribed by Law or Regulation',
      questions: [
        q('ar305-q30', '<p>If law or regulation of a specific jurisdiction requires the use of a specific layout or wording of the auditor\'s report, has CAS 700.50 been reviewed to ensure the minimum required elements have been included in the report? (CAS 700.50)</p>', undefined, 'NA', '<p>No specific jurisdiction layout requirements apply to this engagement.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-12',
      title: '12. Auditing Standards of a Specific Jurisdiction',
      questions: [
        q('ar305-q31', '<p>If the audit has been conducted in accordance with the CASs but is also required to be conducted in accordance with the auditing standards of a specific jurisdiction:</p>', [
          q('ar305-q31a', '<p>Has an evaluation been completed to ensure there is no conflict between the requirements?</p>', undefined, 'NA', '<p>Audit conducted solely in accordance with Canadian Auditing Standards (CAS). No dual-standard requirements.</p>'),
          q('ar305-q31b', '<p>Does the auditor\'s report include, at a minimum, all elements listed in CAS 700.50?</p>', undefined, 'NA'),
          q('ar305-q31c', '<p>If the auditor\'s report refers to both the national auditing standards and Canadian GAAS, does the report identify the jurisdiction of origin?</p>', undefined, 'NA'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-13',
      title: '13. Auditor\'s Report Date',
      questions: [
        q('ar305-q32', '<p>Is the auditor\'s report dated no earlier than the date on which sufficient appropriate audit evidence has been obtained, including evidence that:</p>', [
          q('ar305-q32a', '<p>All the statements and disclosures that comprise the F/S have been prepared?</p>', undefined, 'Yes', '<p>All financial statements and disclosures confirmed as complete as at May 2, 2024 (date of audit report). Management signed representation letter on April 25, 2024.</p>'),
          q('ar305-q32b', '<p>Those with the recognized authority have asserted that they have taken responsibility for those F/S?</p>', undefined, 'Yes', '<p>CEO and CFO of Shipping Line Inc. signed and approved the financial statements on May 2, 2024.</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-ar305-14',
      title: '14. Supplementary Information & Other Information',
      questions: [
        q('ar305-q33', '<p>If supplementary information is presented with the F/S, complete Form 313 and update the auditor\'s report as required. (CAS 700.53–54)</p>', undefined, 'NA', '<p>No supplementary information presented with the financial statements.</p>'),
        q('ar305-q34', '<p>If other information is included in the entity\'s annual report, complete Form 313 and update the auditor\'s report as required. (CAS 700.32)</p>', undefined, 'NA', '<p>Shipping Line Inc. does not publish a formal annual report with other information. Audit report covers the financial statements only.</p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-auditors-report',
    title: 'Independent Auditor\'s Report',
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
    title: 'Modified Opinion',
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
    title: 'Supplementary and Other Information',
    description: 'Checklist for documenting audit procedures related to supplementary information presented with the audited financial statements and other information included in an entity\'s annual report.',
    objective: 'To document the audit procedures required in relation to supplementary information presented with the audited financial statements (CAS 700.53–54) and other information included in an entity\'s annual report (CAS 720.25(a)).',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Checklist — Management Representations (314) template
export const generateManagementRepresentationsChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-mr314-1',
      title: '1. General Requirements',
      questions: [
        q('mr314-q1', '<p>Is the letter addressed to the auditor? (CAS 580.15)</p>', undefined, 'Yes', '<p>Management representation letter is addressed to [Firm Name] — confirmed as properly addressed to the auditor.</p>'),
        q('mr314-q2', '<p>Is the letter dated on or before the date of the auditor\'s report? (CAS 580.14)</p><p><em>Note: The date should not be after the date of the audit report, but can be before, but as near as practicable as possible. If the representation letter is not dated the same as the audit report, documentation should be included to explain the situation, or obtaining a new representation letter should be considered.</em></p>', undefined, 'Yes', '<p>Management representation letter dated April 25, 2024, which is before the audit report date of May 2, 2024. Difference of 7 days documented as acceptable — same fieldwork completion date.</p>'),
        q('mr314-q3', '<p>Have any written representations that support other audit evidence relevant to the F/S or one or more specific assertions in the F/S been obtained? (CAS 580.13)</p>', undefined, 'Yes', '<p>Specific representations obtained regarding: vessel useful lives, voyage completion method application, completeness of related party disclosures, and adequacy of allowance for doubtful accounts.</p>'),
        q('mr314-q4', '<p>Have representations that relate to all periods and F/S referred to in the auditor\'s opinion and report been obtained? (CAS 580.14; 710.9)</p>', undefined, 'Yes', '<p>Representations cover the year ended March 31, 2024 and comparative information for the year ended March 31, 2023.</p>'),
        q('mr314-q5', '<p>Has a summary of uncorrected misstatements been included in, or attached to, the management representation letter? (CAS 450.14)</p>', undefined, 'Yes', '<p>Schedule of uncorrected misstatements (projected misstatements of $30K total) attached to the representation letter. Management acknowledged these are immaterial.</p>', 'W/P Ref: MIS-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-2',
      title: '2. Management\'s Responsibilities',
      questions: [
        q('mr314-q6', '<p>Have the required written management representations been obtained from management with the appropriate responsibilities for the F/S and knowledge of the matters concerned stating that management:</p>', [
          q('mr314-q6a', '<p>Has fulfilled its responsibility for the preparation of the F/S in accordance with the AFRF, including, where relevant, their fair presentation, as set out in the terms of the audit engagement?</p>', undefined, 'Yes'),
          q('mr314-q6b', '<p>Has provided all relevant information and access as agreed in the terms of the audit engagement?</p>', undefined, 'Yes'),
          q('mr314-q6c', '<p>Has recorded and reflected all transactions in the F/S? (CAS 580.9–12)</p>', undefined, 'Yes'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-3',
      title: '3. Representations Required by Other CASs',
      questions: [
        q('mr314-q7', '<p><strong>Fraud</strong> — Have the required written management representations been obtained from management and, where appropriate, TCWG that they:</p>', [
          q('mr314-q7a', '<p>Acknowledge their responsibility for the design, implementation and maintenance of internal control to prevent and detect fraud?</p>', undefined, 'Yes'),
          q('mr314-q7b', '<p>Have disclosed the results of management\'s assessment of the risk that the F/S may be materially misstated as a result of fraud?</p>', undefined, 'Yes'),
          q('mr314-q7c', '<p>Have disclosed their knowledge of fraud, or suspected fraud, affecting the entity involving: management; employees who have significant roles in internal control; or others where the fraud could have a material effect on the F/S?</p>', undefined, 'Yes', '<p>Management confirmed no fraud or suspected fraud. Representation obtained.</p>'),
          q('mr314-q7d', '<p>Have disclosed their knowledge of any allegations of fraud, or suspected fraud, affecting the entity\'s F/S communicated by employees, former employees, analysts, regulators or others? (CAS 240.40)</p>', undefined, 'Yes', '<p>Management confirmed no allegations of fraud received from any parties. Representation obtained.</p>'),
        ]),
        q('mr314-q8', '<p><strong>Non-compliance with laws and regulations</strong> — Have disclosed all known instances of non-compliance or suspected non-compliance with laws and regulations whose effects should be considered when preparing F/S? (CAS 250.17)</p>', undefined, 'Yes', '<p>Management confirmed no known non-compliance with applicable laws and regulations, including Transport Canada maritime regulations and environmental requirements.</p>'),
        q('mr314-q9', '<p><strong>Litigation and claims</strong> — Have disclosed all known actual or possible litigation and claims whose effects should be considered when preparing the F/S and they have been accounted for and disclosed in accordance with the AFRF? (CAS 501.12)</p>', undefined, 'Yes', '<p>Management confirmed no material litigation or claims. Corroborated by legal letter from external counsel. No provisions required.</p>', 'W/P Ref: LEG-01'),
        q('mr314-q10', '<p><strong>Related parties</strong> — Have the required representations been obtained that management:</p>', [
          q('mr314-q10a', '<p>Has disclosed the identity of the entity\'s related parties and all the related party relationships and transactions of which they are aware?</p>', undefined, 'Yes', '<p>Related parties confirmed as: majority shareholder (individual), management services company, and vessel charter company. All relationships and transactions disclosed.</p>', 'W/P Ref: RPT-01'),
          q('mr314-q10b', '<p>Has appropriately accounted for and disclosed such relationships and transactions in accordance with the requirements of the framework? (CAS 550.26)</p>', undefined, 'Yes'),
        ]),
        q('mr314-q11', '<p><strong>Accounting estimates</strong> — Have used methods, significant assumptions and data in the accounting estimates and the related disclosures that are appropriate to achieve recognition, measurement or disclosure in accordance with the AFRF? (CAS 540.37)</p>', undefined, 'Yes', '<p>Representation obtained that methods and assumptions used for vessel depreciation, allowance for doubtful accounts, and accrued voyage revenue are appropriate and consistent with ASPE.</p>'),
        q('mr314-q12', '<p><strong>Uncorrected misstatements</strong> — Believe the effects of uncorrected misstatements are immaterial, individually and in aggregate, to the F/S as a whole? (CAS 450.14)</p>', undefined, 'Yes', '<p>Management representation obtained. Projected misstatements of $30K confirmed as immaterial, individually and in aggregate, to the financial statements.</p>'),
        q('mr314-q13', '<p><strong>Subsequent events</strong> — Have adjusted or disclosed all events occurring subsequent to the date of the F/S that require adjustment or disclosure per the AFRF? (CAS 560.9)</p>', undefined, 'Yes', '<p>Management confirmed that no events occurring after March 31, 2024 require adjustment or disclosure in the financial statements.</p>'),
        q('mr314-q14', '<p><strong>Going concern</strong> — Have the required representations been obtained that management:</p>', [
          q('mr314-q14a', '<p>Confirms the use of the going concern basis of accounting in the preparation of the F/S is appropriate?</p>', undefined, 'Yes'),
          q('mr314-q14b', '<p>Has used a method, significant assumptions and data in their assessment of going concern and any related disclosures that is appropriate in the context of the AFRF?</p>', undefined, 'Yes'),
          q('mr314-q14c', '<p>In the assessment of going concern, has reflected all events or conditions that may cast significant doubt on the entity\'s ability to continue as a going concern?</p>', undefined, 'Yes', '<p>Management confirmed no events or conditions that cast significant doubt on the entity\'s ability to continue as a going concern for at least 12 months from the audit report date.</p>'),
          q('mr314-q14d', '<p>Has disclosed any events or conditions identified above to the audit team?</p>', undefined, 'Yes'),
          q('mr314-q14e', '<p>Has adequately disclosed all matters relevant to going concern in the F/S? (CAS 570.39–40)</p>', undefined, 'Yes', '<p>No going concern disclosure required as no significant doubt exists.</p>'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-4',
      title: '4. Comparative Information',
      questions: [
        q('mr314-q15', '<p>Have specific written representations regarding any restatement made to correct a material misstatement in prior period F/S that affect the comparative information been obtained? (CAS 710.9)</p>', undefined, 'NA', '<p>No restatements of prior period financial statements required.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-5',
      title: '5. Other Information',
      questions: [
        q('mr314-q16', '<p>As noted on Form 313, if some or all of the other information will not be available until after the date of the auditor\'s report, has management been requested to provide a written representation that the final version will be provided when available, and prior to its issuance by the entity? (CAS 720.13(c))</p>', undefined, 'NA', '<p>No other information (annual report, etc.) issued with the financial statements. Not applicable.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-6',
      title: '6. Concerns About Management or Written Representations',
      questions: [
        q('mr314-q17', '<p>Are there any concerns about the competence, integrity, ethical values or diligence of management, or about its commitment to or enforcement of them? If so, has the effect that such concerns may have on the reliability of representations (oral or written) and audit evidence in general been determined? (CAS 580.16)</p>', undefined, 'No', '<p>No concerns identified regarding management competence, integrity, or ethical values. Management was cooperative and forthcoming throughout the audit.</p>'),
        q('mr314-q18', '<p>Are any written representations inconsistent with other audit evidence? If so, have audit procedures been performed to attempt to resolve the matter? (CAS 580.17)</p><p><em>Note: If the matter remains unresolved, the audit team should reconsider the assessment of the competence, integrity, ethical values or diligence of management, and determine the effect on the reliability of representations and audit evidence in general.</em></p>', undefined, 'No', '<p>No inconsistencies identified between written representations and other audit evidence. All representations are consistent with evidence obtained during the audit.</p>'),
        q('mr314-q19', '<p>If management has not provided all requested written representations:</p>', [
          q('mr314-q19a', '<p>Has the matter been discussed with management?</p>', undefined, 'NA', '<p>Management provided all requested written representations. No items refused.</p>'),
          q('mr314-q19b', '<p>Has the integrity of management and the effect on the reliability of representations and audit evidence been assessed?</p>', undefined, 'NA'),
          q('mr314-q19c', '<p>Have appropriate actions been taken, including determining the possible effect on the audit opinion? (CAS 580.19)</p>', undefined, 'NA'),
        ]),
      ],
      isExpanded: true
    },
    {
      id: 'section-mr314-7',
      title: '7. Audit Opinion',
      questions: [
        q('mr314-q20', '<p>If the written representations are determined not to be reliable, has the possible effect on the opinion in the auditor\'s report been determined in accordance with CAS 705 (use Form 306 if the opinion is modified)? (CAS 580.18)</p>', undefined, 'NA', '<p>Written representations assessed as reliable and consistent with audit evidence. No modifications required.</p>'),
        q('mr314-q21', '<p>Has the opinion on the F/S been disclaimed in accordance with CAS 705 (use Form 306) if:</p>', [
          q('mr314-q21a', '<p>There is sufficient doubt about the integrity of management such that the written representations required by procedure 6 are not reliable?</p>', undefined, 'NA', '<p>No doubt about management integrity. Unmodified opinion issued.</p>'),
          q('mr314-q21b', '<p>Management does not provide the written representations required by procedure 6? (CAS 580.20)</p>', undefined, 'NA', '<p>Management provided all required representations.</p>'),
        ]),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-management-representations',
    title: 'Management Representation Letter',
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
        q('aud-ind-1a', '<p>Has the firm\'s independence compliance system been reviewed to confirm that accepting this engagement does not contravene any firm-level independence policies under CSQM 1?</p>', undefined, 'Yes', '<p>Firm independence compliance system reviewed. Accepting AUD-SL-Mar312024 does not contravene any CSQM 1 firm-level independence policies.</p>', 'W/P Ref: IND-01'),
        q('aud-ind-1b', '<p>Has a conflict-of-interest check been performed using the firm\'s client database (including all related entities, subsidiaries, and affiliated parties)?</p>', undefined, 'Yes', '<p>Conflict-of-interest check completed April 3, 2024. No conflicts identified with Shipping Line Inc. or its related entities.</p>'),
        q('aud-ind-1c', '<p>Are there any independence issues identified from other assurance or non-assurance services provided by the firm to this client or a related party?</p>', undefined, 'No', '<p>No other assurance or non-assurance services provided by the firm to this client or related parties that would create independence issues.</p>'),
        la('aud-ind-1-exp', '<p><strong>Additional Explanation</strong></p>', 'CSQM 1 firm-level independence review completed. No issues identified.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s2',
      title: '2. Network Firm Independence',
      questions: [
        q('aud-ind-2a', '<p>Is the firm part of a network as defined in the CPA Canada Code of Professional Conduct?</p>', undefined, 'No', '<p>The firm is not part of a network. Network firm independence requirements are not applicable.</p>'),
        q('aud-ind-2b', '<p>If yes, have independence requirements been extended to all network firms for this engagement?</p>', undefined, 'NA', '<p>Not applicable — firm is not part of a network.</p>'),
        q('aud-ind-2c', '<p>Have inquiries been made of all network offices to identify any threats to independence with respect to this client?</p>', undefined, 'NA', '<p>Not applicable — firm is not part of a network.</p>'),
        la('aud-ind-2-exp', '<p><strong>Additional Explanation</strong></p>', 'Firm is a standalone practice. Network independence requirements not applicable.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s3',
      title: '3. Financial Interests in the Client',
      note: 'CPA Canada Code of Professional Conduct — Rule 204.4',
      questions: [
        q('aud-ind-3a', '<p>Do any members of the engagement team (or their immediate family members) hold direct financial interests in the client?</p>', undefined, 'No', '<p>Confirmed through team independence declarations dated April 5, 2024. No direct financial interests in Shipping Line Inc.</p>'),
        q('aud-ind-3b', '<p>Do any members of the engagement team (or their immediate family members) hold indirect financial interests (through mutual funds, investment funds, or pension funds) in the client that are material to their net worth?</p>', undefined, 'No', '<p>No material indirect financial interests. Shipping Line Inc. is a private company.</p>'),
        q('aud-ind-3c', '<p>Does the firm hold any financial interest in the client?</p>', undefined, 'No'),
        q('aud-ind-3d', '<p>Have all identified financial interest threats been evaluated and appropriate safeguards applied (or the individual removed from the engagement team)?</p>', undefined, 'Yes', '<p>No financial interest threats identified. All team members confirmed independence.</p>'),
        la('aud-ind-3-exp', '<p><strong>Additional Explanation — describe interests identified and safeguards applied</strong></p>', 'No financial interests identified. Independence declarations on file for J. Williams (EP), S. Chen (Manager), and two staff seniors.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s4',
      title: '4. Employment and Business Relationships',
      questions: [
        q('aud-ind-4a', '<p>Has any member of the engagement team recently been employed by the client in a key management position (within the past two years)?</p>', undefined, 'No'),
        q('aud-ind-4b', '<p>Is there any employment negotiation or actual employment offer from the client to a member of the engagement team currently underway?</p>', undefined, 'No'),
        q('aud-ind-4c', '<p>Are there any close business relationships between members of the engagement team (or their immediate family) and the client or its management?</p>', undefined, 'No'),
        q('aud-ind-4d', '<p>Do any engagement team members serve on the board of directors or in any governance capacity of the client?</p>', undefined, 'No'),
        la('aud-ind-4-exp', '<p><strong>Additional Explanation</strong></p>', 'No employment or business relationship issues identified for any engagement team member.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s5',
      title: '5. Family and Personal Relationships',
      questions: [
        q('aud-ind-5a', '<p>Does any member of the engagement team have an immediate family member who is a director, officer, or employee of the client in a position to exert significant influence over the financial statements?</p>', undefined, 'No'),
        q('aud-ind-5b', '<p>Does any member of the engagement team have a close personal relationship with a member of client management or TCWG that could create a familiarity or intimidation threat?</p>', undefined, 'No'),
        la('aud-ind-5-exp', '<p><strong>Additional Explanation</strong></p>', 'No family or personal relationship threats identified.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s6',
      title: '6. Non-Assurance Services (Self-Review Threat)',
      note: 'CAS 220.16 — The engagement partner shall remain alert throughout the audit for evidence of non-compliance with relevant ethical requirements.',
      questions: [
        q('aud-ind-6a', '<p>Does the firm provide bookkeeping, accounting, or financial statement preparation services to the client?</p>', undefined, 'No', '<p>The firm does not provide bookkeeping or accounting services. Management prepares financial statements using Sage 300.</p>'),
        q('aud-ind-6b', '<p>Does the firm provide internal audit services to the client?</p>', undefined, 'No'),
        q('aud-ind-6c', '<p>Does the firm provide valuation services, appraisals, or fairness opinions that are material to the financial statements?</p>', undefined, 'No'),
        q('aud-ind-6d', '<p>Does the firm provide IT systems design or implementation services for systems that generate information forming part of the financial statements?</p>', undefined, 'No'),
        q('aud-ind-6e', '<p>Does the firm provide legal services, HR or payroll services, or corporate finance advisory services that could create a management participation or advocacy threat?</p>', undefined, 'No'),
        q('aud-ind-6f', '<p>For all non-assurance services identified above: have safeguards been applied that reduce the self-review threat to an acceptable level (e.g., separate teams, independent review)?</p>', undefined, 'NA', '<p>Not applicable — no non-assurance services are provided to this client.</p>'),
        la('aud-ind-6-exp', '<p><strong>Describe non-assurance services provided and safeguards applied</strong></p>', 'No non-assurance services provided to Shipping Line Inc. by the firm. Audit is the sole engagement.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s7',
      title: '7. Fees, Gifts, and Hospitality',
      questions: [
        q('aud-ind-7a', '<p>Are audit fees overdue from prior periods? If yes, has this been evaluated as a self-interest threat?</p>', undefined, 'NA', '<p>Not applicable — first year of engagement. No prior period fees outstanding.</p>'),
        q('aud-ind-7b', '<p>Do fees from this client (or client group) exceed 15% of total firm revenues? If yes, have appropriate safeguards (e.g., pre-issuance review by external party) been applied?</p>', undefined, 'No', '<p>Fees from Shipping Line Inc. represent approximately 2% of total firm revenues. No economic dependence on this client.</p>'),
        q('aud-ind-7c', '<p>Are any fee arrangements contingent on the outcome of the engagement or a transaction (e.g., success fees)?</p>', undefined, 'No', '<p>Fee arrangement is based on standard hourly rates. No contingency or success fee arrangements in place.</p>'),
        q('aud-ind-7d', '<p>Have any gifts or hospitality been received from the client that are more than clearly insignificant in value?</p>', undefined, 'No'),
        la('aud-ind-7-exp', '<p><strong>Additional Explanation</strong></p>', 'No fee or hospitality independence issues identified.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s8',
      title: '8. Long Association (Familiarity Threat)',
      note: 'CAS 220 / CSQM 1 — Particularly relevant for listed entities and public interest entities.',
      questions: [
        q('aud-ind-8a', '<p>Has the engagement partner been involved with this client for 7 or more consecutive years?</p>', undefined, 'No', '<p>First year of the engagement. Partner rotation requirements do not yet apply.</p>'),
        q('aud-ind-8b', '<p>Has the key audit partner rotation requirement been met (where applicable under CSQM 1 or regulatory requirements)?</p>', undefined, 'NA', '<p>Not applicable — first year of engagement. Rotation requirements do not apply.</p>'),
        q('aud-ind-8c', '<p>Has the Senior Manager on the file been involved for an extended period (5+ years) without rotation?</p>', undefined, 'No', '<p>First year of engagement for S. Chen as Manager. No long association threat.</p>'),
        q('aud-ind-8d', '<p>Have any safeguards been applied to address familiarity threat arising from long association (e.g., independent partner review, EQC review)?</p>', undefined, 'NA', '<p>Not applicable — no long association threat exists in year one of the engagement.</p>'),
        la('aud-ind-8-exp', '<p><strong>Additional Explanation</strong></p>', 'Long association/familiarity threat not applicable — first year of engagement for all team members.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s9',
      title: '9. Independence Declarations — Engagement Team',
      questions: [
        q('aud-ind-9a', '<p>Has each member of the engagement team completed and signed the firm\'s annual independence declaration for the current year?</p>', undefined, 'Yes', '<p>All team members completed annual independence declarations for fiscal year 2024. Declarations on file.</p>', 'W/P Ref: IND-03'),
        q('aud-ind-9b', '<p>Has each member of the engagement team confirmed independence with respect to this specific client (client-specific independence confirmation)?</p>', undefined, 'Yes', '<p>Client-specific independence confirmations obtained from all team members on April 5, 2024.</p>', 'W/P Ref: IND-04'),
        q('aud-ind-9c', '<p>Has the Engagement Quality Control Reviewer (EQCR), if applicable, confirmed independence with respect to this client?</p>', undefined, 'NA', '<p>EQCR not required for this low-risk private company engagement per firm criteria.</p>'),
        la('aud-ind-9-exp', '<p><strong>List all engagement team members and their confirmation dates</strong></p>', 'J. Williams, CPA (EP) — April 5, 2024; S. Chen, CPA (Manager) — April 5, 2024; Staff Senior 1 — April 5, 2024; Staff Senior 2 — April 5, 2024.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-ind-s10',
      title: '10. Conclusion',
      questions: [
        q('aud-ind-conc1', '<p>Based on the assessment above, I am satisfied that the firm and all members of the engagement team are independent of the client and that no independence threats exist that have not been adequately addressed by safeguards.</p>', undefined, 'Yes', '<p>J. Williams, CPA confirms independence. All sections reviewed. No threats or prohibitions identified.</p>', 'W/P Ref: IND-05'),
        q('aud-ind-conc2', '<p>Any identified independence matters have been communicated to the appropriate level within the firm (e.g., Risk Management Partner, Ethics Partner) and have been resolved satisfactorily.</p>', undefined, 'NA', '<p>Not applicable — no independence matters were identified requiring escalation.</p>'),
        { id: 'aud-ind-ep', text: '<p><strong>Engagement Partner</strong></p>', answerType: 'long-answer' as const, options: [], required: true, answer: 'J. Williams, CPA' },
        { id: 'aud-ind-ep-date', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: true, answer: '2024-04-25' },
        { id: 'aud-ind-prepared', text: '<p><strong>Prepared by</strong></p>', answerType: 'long-answer' as const, options: [], required: false, answer: 'S. Chen, CPA' },
        { id: 'aud-ind-prepdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: false, answer: '2024-04-14' },
        { id: 'aud-ind-reviewed', text: '<p><strong>Reviewed by (EQCR)</strong></p>', answerType: 'long-answer' as const, options: [], required: false, answer: 'N/A - EQCR not required' },
        { id: 'aud-ind-revdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: false, answer: '' },
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-independence',
    title: 'Independence & Ethical Requirements',
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
  const q = (id: string, text: string, sub?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, ...(explanation ? { explanation } : {}), ...(reference ? { reference } : {}), ...(sub ? { subQuestions: sub } : {})
  });
  const la = (id: string, text: string, answer = ''): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer
  });

  const sections: Section[] = [
    {
      id: 'aud-aml-s1',
      title: '1. Applicability Determination',
      note: 'Public accountants in Canada are reporting entities under PCMLTFA when providing specific services.',
      questions: [
        q('aud-aml-1a', '<p>Is the firm a reporting entity under the Proceeds of Crime (Money Laundering) and Terrorist Financing Act (PCMLTFA) for this engagement?</p>', undefined, 'Yes', '<p>The firm is a reporting entity under PCMLTFA when providing accounting services. This audit engagement for Shipping Line Inc. falls within the scope of PCMLTFA reporting obligations.</p>', 'W/P Ref: AML-01'),
        q('aud-aml-1b', '<p>Is the client a federally or provincially regulated financial institution, or otherwise exempt from FINTRAC reporting obligations?</p>', undefined, 'No', '<p>Shipping Line Inc. is a marine freight and logistics company, not a regulated financial institution. FINTRAC obligations apply in full.</p>'),
        la('aud-aml-1-exp', '<p><strong>Additional Explanation</strong></p>', 'PCMLTFA applicability confirmed. AML compliance procedures required for this engagement.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s2',
      title: '2. Client Identification and Verification (PCMLTFA s. 9.1)',
      questions: [
        q('aud-aml-2a', '<p>Has the client\'s legal name been verified using acceptable identification documents or a reliable independent source?</p>', undefined, 'Yes', '<p>Legal name "Shipping Line Inc." verified against Ontario corporate registry records on April 3, 2024.</p>', 'W/P Ref: AML-02'),
        q('aud-aml-2b', '<p>If the client is a corporation: has a certificate of corporate status (or equivalent) been obtained and reviewed to confirm legal existence, registered name, and address?</p>', undefined, 'Yes', '<p>Certificate of Corporate Status obtained from Ontario Business Registry on April 3, 2024. Confirmed active, registered address: 123 Harbour Drive, Halifax, NS.</p>'),
        q('aud-aml-2c', '<p>If the client is a trust, partnership, or other entity: has the applicable governing document (trust deed, partnership agreement) been reviewed?</p>', undefined, 'NA', '<p>Not applicable — Shipping Line Inc. is a corporation, not a trust or partnership.</p>'),
        q('aud-aml-2d', '<p>Has the identity of the individual(s) authorizing the engagement on behalf of the client been verified?</p>', undefined, 'Yes', '<p>CEO (R. Morrison) identity verified via government-issued photo ID (Ontario driver license) on April 5, 2024.</p>'),
        la('aud-aml-2-exp', '<p><strong>Describe identification documents obtained and verification method used</strong></p>', 'Ontario Corporate Registry certificate obtained. CEO identity verified via driver license. CFO identity verified via passport. Documents retained in file.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s3',
      title: '3. Beneficial Ownership Identification (PCMLTFA Reg. 11.1)',
      questions: [
        q('aud-aml-3a', '<p>Have all individuals who own or control, directly or indirectly, 25% or more of the client entity been identified?</p>', undefined, 'Yes', '<p>Beneficial ownership identified: R. Morrison (55% — CEO/founder) and M. Chen (45% — silent partner). Both exceed the 25% threshold.</p>', 'W/P Ref: AML-03'),
        q('aud-aml-3b', '<p>Have the identities of all beneficial owners been verified using reliable and independent sources?</p>', undefined, 'Yes', '<p>R. Morrison verified via Ontario driver license. M. Chen verified via Canadian passport. Both verified April 5, 2024.</p>'),
        q('aud-aml-3c', '<p>Where ownership is through a chain of entities, has the chain been traced to identify the ultimate beneficial owner(s)?</p>', undefined, 'NA', '<p>Not applicable — ownership is held directly by two individuals. No chain of entities.</p>'),
        q('aud-aml-3d', '<p>Has the information regarding beneficial ownership been documented in the working papers?</p>', undefined, 'Yes'),
        la('aud-aml-3-exp', '<p><strong>List beneficial owners (≥25%) and verification method</strong></p>', 'R. Morrison — 55% — verified via ON driver license (April 5, 2024); M. Chen — 45% — verified via Canadian passport (April 5, 2024).'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s4',
      title: '4. Politically Exposed Persons (PEP) and Heads of International Organizations (HIO)',
      note: 'PCMLTFA Regulations — accountants must make reasonable measures to determine PEP/HIO status.',
      questions: [
        q('aud-aml-4a', '<p>Have reasonable measures been taken to determine whether the client, beneficial owner(s), or controlling party is a Politically Exposed Domestic Person (PEDP)?</p>', undefined, 'Yes', '<p>PEP screening performed using commercial database (April 5, 2024). No PEP matches identified for R. Morrison or M. Chen.</p>', 'W/P Ref: AML-04'),
        q('aud-aml-4b', '<p>Have reasonable measures been taken to determine whether the client is a Politically Exposed Foreign Person (PEFP) or Head of an International Organization (HIO)?</p>', undefined, 'Yes', '<p>PEFP and HIO screening completed April 5, 2024. No matches identified. Both beneficial owners are Canadian citizens with no foreign political affiliations.</p>'),
        q('aud-aml-4c', '<p>If a PEP or HIO has been identified: has senior management approval been obtained and enhanced due diligence applied?</p>', undefined, 'NA', '<p>Not applicable — no PEPs or HIOs identified.</p>'),
        la('aud-aml-4-exp', '<p><strong>Document PEP/HIO screening results and source used</strong></p>', 'PEP/HIO screening performed via Equifax commercial database on April 5, 2024. No matches for R. Morrison or M. Chen. Screening results on file.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s5',
      title: '5. Sanctions Screening',
      questions: [
        q('aud-aml-5a', '<p>Has the client and its beneficial owner(s) been screened against the OSFI Consolidated Canadian Autonomous Sanctions List?</p>', undefined, 'Yes', '<p>OSFI sanctions list screening performed April 5, 2024. No matches for Shipping Line Inc., R. Morrison, or M. Chen.</p>', 'W/P Ref: AML-05'),
        q('aud-aml-5b', '<p>Has the client and its beneficial owner(s) been screened against the United Nations Security Council (UNSC) consolidated sanctions list?</p>', undefined, 'Yes', '<p>UNSC consolidated sanctions list screening performed April 5, 2024. No matches identified.</p>'),
        q('aud-aml-5c', '<p>Are there any matches to sanctions lists? If yes, has the engagement been declined and the matter escalated to the firm\'s Risk Management Partner?</p>', undefined, 'No', '<p>No matches found on any sanctions list. Engagement may proceed.</p>'),
        la('aud-aml-5-exp', '<p><strong>Document screening method, date performed, and results</strong></p>', 'OSFI and UNSC sanctions screening performed April 5, 2024 via Equifax database. No matches on any sanctions list. Results documented and retained.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s6',
      title: '6. Risk Assessment (FINTRAC Risk-Based Approach)',
      questions: [
        q('aud-aml-6a', '<p>Has a risk assessment been completed for this client, considering: industry/sector risk, geographic risk, client risk factors, and the nature of transactions?</p>', undefined, 'Yes', '<p>ML/TF risk assessment completed April 5, 2024. Marine freight industry presents moderate inherent risk due to international transactions, but client operates primarily in Canada/US with no high-risk jurisdictions.</p>', 'W/P Ref: AML-06'),
        q('aud-aml-6b', '<p>Is the source of the client\'s funds/revenue consistent with the stated business purpose?</p>', undefined, 'Yes', '<p>Revenue of ~$12.5M CAD is consistent with marine freight and logistics operations. Revenue sources (freight contracts, voyage-based billings) are well-documented and consistent with stated business purpose.</p>'),
        q('aud-aml-6c', '<p>Is the client operating in a high-risk jurisdiction (as identified by FATF or FINTRAC guidance)?</p>', undefined, 'No', '<p>Operations confined to Canada and US east coast routes. Neither Canada nor the US is a FATF high-risk or monitored jurisdiction.</p>'),
        la('aud-aml-6-rating', '<p><strong>Overall ML/TF risk rating: Low / Medium / High</strong></p>', 'Low'),
        la('aud-aml-6-rationale', '<p><strong>Rationale for risk rating</strong></p>', 'Low risk: Canadian operations only, no high-risk jurisdictions, legitimate revenue sources consistent with stated business, no PEPs or adverse screening results, cooperative management with known ownership structure.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s7',
      title: '7. Enhanced Due Diligence (High-Risk Clients)',
      note: 'Required for PEPs, HIOs, clients in high-risk jurisdictions, and clients assessed as high risk.',
      questions: [
        q('aud-aml-7a', '<p>Has Enhanced Due Diligence (EDD) been applied where required?</p>', undefined, 'NA', '<p>Not applicable — client assessed as Low risk. EDD not required.</p>'),
        q('aud-aml-7b', '<p>For EDD: Has additional information been obtained regarding the source of funds/wealth and nature of business activities?</p>', undefined, 'NA', '<p>Not applicable — EDD not required for low-risk client.</p>'),
        q('aud-aml-7c', '<p>For EDD: Has senior management approval been documented for accepting or continuing the engagement?</p>', undefined, 'NA', '<p>Not applicable — EDD not required for low-risk client.</p>'),
        la('aud-aml-7-exp', '<p><strong>Describe EDD measures applied</strong></p>', 'EDD not required. Client rated Low risk based on standard due diligence procedures.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s8',
      title: '8. Record-Keeping and STR Obligations',
      questions: [
        q('aud-aml-8a', '<p>Have all client identification and verification records been retained in the file (minimum 5-year retention under PCMLTFA s. 6)?</p>', undefined, 'Yes', '<p>All AML client identification and verification records retained in client file. 5-year retention flagged in file management system.</p>', 'W/P Ref: AML-07'),
        q('aud-aml-8b', '<p>Have any transactions been identified that give rise to reasonable grounds to suspect money laundering or terrorist financing?</p>', undefined, 'No', '<p>No transactions identified during audit planning or fieldwork that give rise to suspicion of money laundering or terrorist financing.</p>'),
        q('aud-aml-8c', '<p>If yes: has a Suspicious Transaction Report (STR) been filed with FINTRAC and escalated to the firm\'s Compliance Officer?</p>', undefined, 'NA', '<p>Not applicable — no suspicious transactions identified.</p>'),
        la('aud-aml-8-exp', '<p><strong>Document any STR considerations or filings</strong></p>', 'No suspicious transactions identified. No STR required. AML file complete and retained per PCMLTFA 5-year requirement.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-aml-s9',
      title: '9. Conclusion',
      questions: [
        q('aud-aml-conc1', '<p>All required AML/ATF procedures under PCMLTFA and FINTRAC guidance have been performed and documented for this engagement.</p>', undefined, 'Yes', '<p>All PCMLTFA and FINTRAC required procedures completed. Client identification, beneficial ownership, PEP/HIO screening, sanctions screening, and risk assessment all performed and documented.</p>', 'W/P Ref: AML-08'),
        q('aud-aml-conc2', '<p>No suspicious transactions or unresolved high-risk indicators have been identified that would preclude acceptance or continuance of this engagement.</p>', undefined, 'Yes', '<p>No suspicious transactions, STRs, high-risk indicators, or unresolved matters identified. Engagement may proceed.</p>'),
        { id: 'aud-aml-ep', text: '<p><strong>Engagement Partner / CAMLO</strong></p>', answerType: 'long-answer' as const, options: [], required: true, answer: 'J. Williams, CPA' },
        { id: 'aud-aml-epdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: true, answer: '2024-04-25' },
        { id: 'aud-aml-prepared', text: '<p><strong>Prepared by</strong></p>', answerType: 'long-answer' as const, options: [], required: false, answer: 'S. Chen, CPA' },
        { id: 'aud-aml-prepdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: false, answer: '2024-04-14' },
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
  const q = (id: string, text: string, answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference
  });
  const la = (id: string, text: string, answer = ''): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer
  });

  const sections: Section[] = [
    {
      id: 'aud-mat-s1',
      title: '1. Benchmark Selection and Justification (CAS 320.A3–A6)',
      note: 'Select the benchmark most appropriate to the financial statements taken as a whole, considering the nature and circumstances of the entity and the primary users of the financial statements.',
      questions: [
        la('aud-mat-1-primary', '<p><strong>Primary benchmark selected</strong> (e.g., profit before tax, total revenues, total assets, total expenses, net assets)</p>', 'Total revenues ($12,500,000)'),
        la('aud-mat-1-justification', '<p><strong>Justification for selected benchmark</strong> — explain why this benchmark is appropriate for the primary users of the financial statements:</p>', 'Total revenues selected as the primary benchmark as Shipping Line Inc. is a service entity with relatively stable revenues. Profit before tax was considered but is more volatile due to fuel cost fluctuations. Revenue is the measure most relevant to the primary users (bank lenders and shareholders) for assessing the entity\'s performance and scale.'),
        q('aud-mat-1a', '<p>Is the benchmark consistently applied from the prior year? If not, has the change been documented and approved?</p>', 'Yes', 'Revenue has been used as the benchmark consistently since the prior year. No change to the benchmark selection.'),
        q('aud-mat-1b', '<p>Is profit/income volatile or subject to unusual one-time items? If yes, has an adjusted or normalized figure been used?</p>', 'Yes', 'Profit before tax is somewhat volatile due to fluctuating fuel costs and USD exchange rate movements. Revenue was selected as a more stable benchmark. No one-time items requiring normalization identified this year.'),
        la('aud-mat-1-adj', '<p><strong>Describe any adjustments made to normalize the benchmark (e.g., excluding one-time items, averaging)</strong></p>', 'No adjustments required. Revenue of $12,500,000 is used without normalization.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s2',
      title: '2. Overall Materiality (CAS 320.10)',
      questions: [
        la('aud-mat-2-benchmark-value', '<p><strong>Benchmark figure — $ amount</strong></p>', '$12,500,000'),
        la('aud-mat-2-percentage', '<p><strong>Percentage applied to benchmark</strong> (e.g., 5% of PBT, 0.5%–1% of revenues, 1%–2% of total assets)</p>', '1% of total revenues'),
        la('aud-mat-2-overall', '<p><strong>Overall materiality — calculated amount ($)</strong></p>', '$125,000'),
        q('aud-mat-2a', '<p>Is overall materiality consistent with the prior year? If not, has the change been documented and the impact on audit scope assessed?</p>', 'Yes', 'Overall materiality of $125,000 (1% of revenue) is consistent with the prior year approach. Prior year materiality was $112,000 (1% of $11.2M revenue); increase is proportional to revenue growth.'),
        la('aud-mat-2-prior', '<p><strong>Prior year overall materiality ($) — for reference</strong></p>', '$112,000'),
        la('aud-mat-2-rationale', '<p><strong>Additional rationale for overall materiality determination</strong></p>', '1% of revenues is appropriate for a private maritime freight company where bank lenders and shareholders are the primary users. The 1% rate reflects the relatively stable revenue base and the significant asset concentration in vessels.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s3',
      title: '3. Performance Materiality (CAS 320.11)',
      note: 'Performance materiality reduces the risk that the aggregate of uncorrected and undetected misstatements exceeds overall materiality. Typically set at 50–75% of overall materiality.',
      questions: [
        la('aud-mat-3-percentage', '<p><strong>Performance materiality percentage applied to overall materiality (e.g., 75%)</strong></p>', '70%'),
        la('aud-mat-3-amount', '<p><strong>Performance materiality — calculated amount ($)</strong></p>', '$87,500 (70% of $125,000)'),
        la('aud-mat-3-rationale', '<p><strong>Rationale for the percentage selected</strong> — consider prior year uncorrected misstatements, audit risk assessment, and complexity of the entity:</p>', '70% selected (slightly below the upper end of the 50-75% range) to provide a reasonable buffer given the identified revenue cut-off and vessel impairment risks. Prior year had three immaterial corrected misstatements totalling $18K, which supports a slightly conservative performance materiality.'),
        q('aud-mat-3a', '<p>Were there significant uncorrected misstatements in the prior year that support a lower performance materiality?</p>', 'No', 'No uncorrected misstatements in the prior year. Three misstatements totalling $18K were corrected by management. This is not significant enough to require a lower performance materiality.'),
        q('aud-mat-3b', '<p>Are there higher inherent risk areas (e.g., complex transactions, estimates) that support a lower performance materiality?</p>', 'Yes', 'Revenue recognition cut-off and vessel impairment assessment are higher inherent risk areas. These support setting performance materiality at 70% rather than the upper end of 75%.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s4',
      title: '4. Clearly Trivial Threshold (CAS 450.A2)',
      note: 'Misstatements below the clearly trivial threshold are not accumulated. Typically set at 3–5% of overall materiality.',
      questions: [
        la('aud-mat-4-percentage', '<p><strong>Clearly trivial percentage applied to overall materiality (e.g., 5%)</strong></p>', '5%'),
        la('aud-mat-4-amount', '<p><strong>Clearly trivial threshold — calculated amount ($)</strong></p>', '$6,250 (5% of $125,000)'),
        la('aud-mat-4-rationale', '<p><strong>Rationale for clearly trivial threshold</strong></p>', '5% of overall materiality is standard for this engagement. Misstatements below $6,250 will not be accumulated as clearly trivial.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s5',
      title: '5. Specific Materiality for Sensitive Areas (CAS 320.A13)',
      note: 'Specific materiality may be set for particular classes of transactions, account balances, or disclosures where misstatements of lesser amounts could reasonably be expected to influence user decisions.',
      questions: [
        q('aud-mat-5a', '<p>Are there account balances, transactions, or disclosures for which a lower specific materiality is appropriate (e.g., related party transactions, regulatory thresholds, executive compensation)?</p>', 'Yes', 'Related-party transactions (head office lease with Patel Holdings Inc.) will be subject to a lower specific materiality of $25,000 given the disclosure requirements and sensitivity of related-party transactions for users.'),
        la('aud-mat-5-areas', '<p><strong>Identify specific materiality areas and amounts:</strong></p><p>Area 1: _______________ Amount: $_______________</p><p>Area 2: _______________ Amount: $_______________</p><p>Area 3: _______________ Amount: $_______________</p>', 'Area 1: Related-party transactions — Amount: $25,000\nArea 2: Management compensation disclosures — Amount: $25,000\nArea 3: N/A'),
        la('aud-mat-5-rationale', '<p><strong>Rationale for specific materiality determinations</strong></p>', 'Lower specific materiality of $25,000 for related-party transactions to ensure complete and accurate disclosure as required under ASPE Section 3840. Same threshold applied to management compensation for consistency.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s6',
      title: '6. Materiality Summary',
      questions: [
        la('aud-mat-6-summary', '<p><strong>Complete the materiality summary:</strong></p><p>Benchmark selected: _______________</p><p>Benchmark amount: $_______________</p><p>Overall Materiality: $_______________</p><p>Performance Materiality: $_______________ (___% of OM)</p><p>Clearly Trivial Threshold: $_______________ (___% of OM)</p>', 'Benchmark selected: Total revenues\nBenchmark amount: $12,500,000\nOverall Materiality: $125,000\nPerformance Materiality: $87,500 (70% of OM)\nClearly Trivial Threshold: $6,250 (5% of OM)'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s7',
      title: '7. Revision of Materiality During the Audit (CAS 320.12–14)',
      questions: [
        q('aud-mat-7a', '<p>Has materiality been revised during the audit due to new information or significant changes in circumstances?</p>', 'No', 'No revision to materiality required during the audit. Final revenues were consistent with planning estimates.'),
        q('aud-mat-7b', '<p>If revised downward: has the impact on the nature, timing, and extent of audit procedures been reassessed?</p>', 'NA', 'Not applicable — materiality was not revised during the audit.'),
        la('aud-mat-7-detail', '<p><strong>If revised: document the reason for revision, new amounts, and impact on audit procedures</strong></p>', 'Not applicable — no revision to materiality.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-mat-s8',
      title: '8. Sign-Off',
      questions: [
        q('aud-mat-conc1', '<p>I am satisfied that the materiality amounts determined above are appropriate for this engagement based on the entity\'s financial profile, risk assessment, and the needs of the primary users.</p>', 'Yes'),
        { id: 'aud-mat-ep', text: '<p><strong>Engagement Partner</strong></p>', answerType: 'long-answer' as const, options: [], required: true, answer: 'J. Williams, CPA' },
        { id: 'aud-mat-epdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: true, answer: '2024-04-10' },
        { id: 'aud-mat-prepared', text: '<p><strong>Prepared by</strong></p>', answerType: 'long-answer' as const, options: [], required: false, answer: 'S. Chen, CPA' },
        { id: 'aud-mat-prepdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: false, answer: '2024-04-10' },
        { id: 'aud-mat-reviewed', text: '<p><strong>Reviewed by</strong></p>', answerType: 'long-answer' as const, options: [], required: false, answer: 'J. Williams, CPA' },
        { id: 'aud-mat-revdate', text: '<p><strong>Date</strong></p>', answerType: 'date' as const, options: [], required: false, answer: '2024-04-10' },
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-materiality',
    title: 'Materiality',
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
  const la = (id: string, text: string, answer = ''): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer
  });
  const q = (id: string, text: string, answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'], required: false, answer,
    ...(explanation ? { explanation } : {}), ...(reference ? { reference } : {})
  });

  const sections: Section[] = [
    {
      id: 'aud-el-header',
      title: 'Letter Header',
      questions: [
        la('aud-el-date', '<p><strong>Date of Letter</strong></p>', 'April 5, 2024'),
        la('aud-el-addressee', '<p><strong>Addressed To</strong> (name and title of management representative or TCWG)</p>', 'Mr. Robert Morrison, Chief Executive Officer'),
        la('aud-el-entity', '<p><strong>Entity Name</strong></p>', 'Shipping Line Inc.'),
        la('aud-el-address', '<p><strong>Entity Address</strong></p>', '123 Harbour Drive, Halifax, Nova Scotia, B3J 1A1'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-s1',
      title: '1. Objective and Scope of the Audit (CAS 210.10(a))',
      questions: [
        la('aud-el-1-period', '<p><strong>Audit period:</strong> Financial statements for the year ended _______________</p>', 'March 31, 2024'),
        la('aud-el-1-framework', '<p><strong>Applicable financial reporting framework</strong> (e.g., ASPE, IFRS, Public Sector Accounting Standards)</p>', 'Accounting Standards for Private Enterprises (ASPE)'),
        la('aud-el-1-scope', '<p><strong>Scope of the audit:</strong></p><p>We will audit the financial statements of [Entity Name] which comprise the statement of financial position as at [Year End], and the statements of income, retained earnings, and cash flows for the year then ended, and notes to the financial statements. Our audit will be conducted in accordance with Canadian Auditing Standards (CAS).</p>', 'We will audit the financial statements of Shipping Line Inc. which comprise the statement of financial position as at March 31, 2024, and the statements of income, retained earnings, and cash flows for the year then ended, and notes to the financial statements. Our audit will be conducted in accordance with Canadian Auditing Standards (CAS).'),
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
        la('aud-el-6-fees', '<p><strong>Fee arrangement:</strong></p><p>Our fees for the audit services will be based on [time spent at our standard hourly rates / a fixed fee of $___________]. We will provide an estimate before commencing work and will advise you promptly if we believe the estimate will be exceeded. Out-of-pocket expenses will be billed separately.</p>', 'Our fees for the audit services will be based on time spent at our standard hourly rates, with an estimated total fee of $28,500 to $32,000 for the year ended March 31, 2024. We will advise you promptly if we believe the estimate will be exceeded. Out-of-pocket expenses (travel, courier, etc.) will be billed separately.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-s7',
      title: '7. Other Services and Matters',
      questions: [
        q('aud-el-7a', '<p>Is this engagement subject to an Engagement Quality Control Review (EQCR)?</p>', 'No', '<p>EQCR not required. Engagement assessed as Low Risk. Private company with no public interest considerations.</p>'),
        la('aud-el-7-other', '<p><strong>Other services / other matters to address</strong> (e.g., tax returns, use of specialists, component auditors, predecessor auditor, restriction on use of the report):</p>', 'Predecessor auditor contacted — no concerns raised. No component auditors required. No specialists required. Report intended for management and RBC (banking covenant purposes). No restriction on general use.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-el-closing',
      title: '8. Signatures and Agreement',
      questions: [
        la('aud-el-close', '<p><strong>Closing paragraph:</strong></p><p>Please sign and return the attached copy of this letter to indicate your acknowledgement of, and agreement with, the arrangements for our audit of the financial statements including our respective responsibilities.</p>'),
        la('aud-el-firm', '<p><strong>Firm name and engagement partner signature</strong></p>', 'Williams Chen & Associates LLP — J. Williams, CPA, CA — Engagement Partner'),
        la('aud-el-firmdate', '<p><strong>Date</strong></p>', 'April 5, 2024'),
        la('aud-el-mgmt', '<p><strong>Acknowledged and agreed on behalf of [Entity Name]</strong></p><p>Name: _______________ Title: _______________</p>', 'Robert Morrison — Chief Executive Officer — Shipping Line Inc.'),
        la('aud-el-mgmtdate', '<p><strong>Date acknowledged by management</strong></p>', 'April 5, 2024'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-engagement-letter',
    title: 'Engagement Letter',
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
  const la = (id: string, text: string, answer = ''): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer
  });
  const q = (id: string, text: string, answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'], required: false, answer, explanation, reference
  });

  const sections: Section[] = [
    {
      id: 'aud-tcwg-pl-header',
      title: 'Letter Header',
      questions: [
        la('tcwg-pl-date', '<p><strong>Date of Communication</strong></p>', 'February 28, 2024'),
        la('tcwg-pl-addressee', '<p><strong>Addressed To</strong> (Those Charged with Governance — Board of Directors / Audit Committee)</p>', 'Board of Directors, Shipping Line Inc.'),
        la('tcwg-pl-entity', '<p><strong>Entity Name</strong></p>', 'Shipping Line Inc.'),
        la('tcwg-pl-period', '<p><strong>Audit period — financial statements for the year ended:</strong></p>', 'March 31, 2024'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s1',
      title: '1. Purpose of Communication (CAS 260.14)',
      questions: [
        la('tcwg-pl-1-purpose', '<p><strong>Purpose statement:</strong></p><p>CAS 260 requires us to communicate with those charged with governance our overall audit approach and strategy before the audit begins. This letter fulfills that requirement and is intended to provide transparency about our planned audit scope, timing, and focus areas.</p>', 'Confirmed — letter issued February 28, 2024 to the Board of Directors.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s2',
      title: '2. Our Responsibilities as Auditors',
      questions: [
        la('tcwg-pl-2-resp', '<p><strong>Our responsibilities:</strong></p><p>Our objective is to obtain reasonable assurance about whether the financial statements are free from material misstatement, whether due to fraud or error, and to issue an auditor\'s report that includes our opinion. Reasonable assurance is a high level of assurance, but is not a guarantee that an audit conducted in accordance with CASs will always detect a material misstatement when it exists. Our audit opinion is not a guarantee of the accuracy or completeness of the financial statements.</p>', 'Auditor responsibilities confirmed per standard CAS language.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s3',
      title: '3. Overall Audit Approach and Engagement Team',
      questions: [
        la('tcwg-pl-3-approach', '<p><strong>Audit approach:</strong></p><p>Our audit approach is [risk-based / substantive / combined]. We will obtain an understanding of the entity and its environment, identify and assess risks of material misstatement, and design and perform audit procedures responsive to those risks.</p>', 'Primarily substantive risk-based approach. We will obtain an understanding of Shipping Line Inc. and its maritime freight operations, identify and assess risks of material misstatement, and design audit procedures responsive to those risks — particularly around revenue recognition and vessel carrying values.'),
        la('tcwg-pl-3-team', '<p><strong>Engagement team:</strong></p><p>Engagement Partner: _______________</p><p>Senior Manager / Manager: _______________</p><p>Staff: _______________</p><p>EQCR (if applicable): _______________</p>', 'Engagement Partner: J. Williams, CPA\nEngagement Manager: S. Chen, CPA\nSenior Auditor: [TBD]\nStaff Auditor: [TBD]\nEQCR: Not applicable for this engagement'),
        la('tcwg-pl-3-timeline', '<p><strong>Planned timeline:</strong></p><p>Interim procedures: _______________</p><p>Year-end fieldwork: _______________</p><p>Expected report issuance: _______________</p>', 'Interim procedures: None planned\nYear-end fieldwork: April 14–25, 2024\nExpected report issuance: May 31, 2024'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s4',
      title: '4. Significant Audit Focus Areas',
      questions: [
        la('tcwg-pl-4-focus', '<p><strong>Key areas of audit focus identified during planning:</strong></p><p>1. _______________</p><p>2. _______________</p><p>3. _______________</p><p>4. _______________</p>', '1. Revenue recognition — voyage completion cut-off for freight revenue at March 31, 2024\n2. Vessel impairment assessment — fleet PP&E of $8.2M representing 45% of total assets\n3. Foreign currency transactions — USD-denominated freight revenue and receivables\n4. Management override of controls — journal entry testing and accounting estimates'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s5',
      title: '5. Materiality',
      questions: [
        la('tcwg-pl-5-mat', '<p><strong>Materiality for planning purposes:</strong></p><p>Overall materiality: $_______________</p><p>Performance materiality: $_______________</p><p>Clearly trivial threshold: $_______________</p><p>Benchmark: _______________</p>', 'Overall materiality: $125,000\nPerformance materiality: $87,500\nClearly trivial threshold: $6,250\nBenchmark: 1% of total revenues ($12,500,000)'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s6',
      title: '6. Fraud Risk Inquiries (CAS 240.20)',
      questions: [
        la('tcwg-pl-6-fraud', '<p><strong>CAS 240 requires us to inquire of TCWG regarding:</strong></p><p>(a) Your assessment of the risk that the financial statements may be materially misstated due to fraud;</p><p>(b) Your knowledge of any actual, suspected, or alleged fraud affecting the entity;</p><p>(c) The procedures management performs to prevent and detect fraud.</p>', 'CAS 240 fraud inquiries communicated to TCWG in this letter. Responses from TCWG to be documented in the fraud risk assessment working paper.'),
        q('tcwg-pl-6-fraud-q', '<p>Are you aware of any fraud or suspected fraud that we should know about?</p>', 'No', 'TCWG confirmed no knowledge of actual, suspected, or alleged fraud affecting the entity. Documented in the TCWG planning communication signed by the board chair.'),
        la('tcwg-pl-6-fraud-exp', '<p><strong>TCWG response regarding fraud risk</strong></p>', 'TCWG (Board of Directors) confirmed no awareness of fraud or suspected fraud. Management anti-fraud controls include separation of duties in AP and payroll, dual authorization for payments, and quarterly board review of financial results. No fraud risk factors identified at the TCWG level.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-s7',
      title: '7. Going Concern and Independence',
      questions: [
        q('tcwg-pl-7-gc', '<p>Are you aware of any events or conditions that may cast significant doubt on the entity\'s ability to continue as a going concern?</p>', 'No', 'TCWG confirmed no awareness of events or conditions casting doubt on the entity\'s ability to continue as a going concern. Banking covenants are being met with comfortable headroom.'),
        la('tcwg-pl-7-gc-exp', '<p><strong>TCWG response regarding going concern</strong></p>', 'TCWG confirmed no going concern concerns. The entity has positive operating cash flows, meets all banking covenants, and has sufficient liquidity. Management projects continued profitable operations for the foreseeable future.'),
        la('tcwg-pl-8-ind', '<p><strong>Independence confirmation:</strong></p><p>We confirm that we are independent of the entity in accordance with the CPA Canada Code of Professional Conduct. We are not aware of any relationships or interests that may reasonably be thought to bear on our independence.</p>', 'Independence confirmed. No relationships, interests, or threats to independence have been identified. The engagement firm is independent of Shipping Line Inc. in accordance with the CPA Canada Code of Professional Conduct.'),
        la('tcwg-pl-8-ind-matters', '<p><strong>Independence matters to disclose to TCWG (if any)</strong></p>', 'None. No independence matters require disclosure to TCWG.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-pl-closing',
      title: '8. Closing',
      questions: [
        la('tcwg-pl-closing', '<p>We welcome the opportunity to discuss our audit approach and focus areas. Please contact [Engagement Partner] at [phone/email] if you require further information prior to the commencement of our audit.</p>', 'We welcome the opportunity to discuss our audit approach and focus areas. Please contact J. Williams, CPA at (604) 555-0100 or j.williams@auditfirm.ca if you require further information prior to the commencement of our audit fieldwork on April 14, 2024.'),
        la('tcwg-pl-firm', '<p><strong>Firm name and engagement partner signature</strong></p>', '[Audit Firm Name]\nJ. Williams, CPA — Engagement Partner'),
        la('tcwg-pl-firmdate', '<p><strong>Date</strong></p>', 'February 28, 2024'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-tcwg-planning',
    title: 'TCWG Communication — Planning',
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
  const la = (id: string, text: string, answer = ''): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer
  });
  const q = (id: string, text: string, answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'], required: false, answer, explanation, reference
  });

  const sections: Section[] = [
    {
      id: 'aud-tcwg-fin-header',
      title: 'Letter Header',
      questions: [
        la('tcwg-fin-date', '<p><strong>Date of Communication</strong></p>', 'May 2, 2024'),
        la('tcwg-fin-addressee', '<p><strong>Addressed To</strong> (Those Charged with Governance)</p>', 'Board of Directors, Shipping Line Inc.'),
        la('tcwg-fin-entity', '<p><strong>Entity Name</strong></p>', 'Shipping Line Inc.'),
        la('tcwg-fin-period', '<p><strong>Audit period:</strong></p>', 'Year ended March 31, 2024'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-s1',
      title: '1. Audit Opinion',
      questions: [
        la('tcwg-fin-1-opinion', '<p><strong>Audit opinion issued:</strong></p><p>We have issued an [unmodified / qualified / adverse / disclaimer of] opinion on the financial statements of [Entity Name] for the year ended [date].</p>', 'We have issued an unmodified opinion on the financial statements of Shipping Line Inc. for the year ended March 31, 2024, confirming that the financial statements present fairly, in all material respects, in accordance with ASPE.'),
        q('tcwg-fin-1-modified', '<p>If modified: has the nature and reason for the modification been communicated to TCWG?</p>', 'NA', '<p>Unmodified opinion issued. No modification to communicate.</p>'),
        la('tcwg-fin-1-kem', '<p><strong>Key audit matters (if applicable):</strong></p>', 'Not applicable — Shipping Line Inc. is not a listed entity. Key audit matters are not included in the auditor report.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-s2',
      title: '2. Significant Accounting Policies and Estimates (CAS 260.14(b))',
      questions: [
        la('tcwg-fin-2-policies', '<p><strong>Significant accounting policies applied:</strong></p><p>1. _______________</p><p>2. _______________</p><p>3. _______________</p>', '1. Revenue recognition: Freight revenue recognized upon voyage completion (ASPE 3400). 2. Vessels: Recorded at cost less accumulated depreciation; straight-line over 20-25 year useful lives (ASPE 3061). 3. Foreign currency: USD transactions translated at transaction-date rates; year-end monetary balances at closing rate (ASPE 1651).'),
        q('tcwg-fin-2-policies-q', '<p>Are all significant accounting policies appropriate and consistently applied?</p>', 'Yes', '<p>All significant accounting policies (voyage completion revenue recognition, straight-line vessel depreciation, foreign currency translation) assessed as appropriate and consistently applied per ASPE.</p>'),
        la('tcwg-fin-2-estimates', '<p><strong>Significant accounting estimates requiring significant judgment:</strong></p><p>1. _______________</p><p>2. _______________</p>', '1. Vessel useful lives and residual values (significant judgment in depreciation rates — assessed as reasonable). 2. Allowance for doubtful accounts ($85K at March 31, 2024 — assessed as appropriate based on aging and collection history).'),
        la('tcwg-fin-2-changes', '<p><strong>Changes in accounting policies or estimates during the year (if any):</strong></p>', 'No changes in accounting policies or estimates during the year ended March 31, 2024.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-s3',
      title: '3. Significant Audit Findings (CAS 260.14(c))',
      questions: [
        la('tcwg-fin-3-findings', '<p><strong>Significant audit findings and observations:</strong></p><p>1. _______________</p><p>2. _______________</p><p>3. _______________</p>', '1. Revenue cutoff (AJE-001, $45K): One voyage invoice recorded as revenue in March 2024 related to a voyage not completed at year-end. Corrected by management. 2. Depreciation correction (AJE-002, $12K): Depreciation on a vessel component was incorrectly calculated. Corrected by management. 3. Deferred revenue reclassification (AJE-003, $28K): Deferred revenue was misclassified as accounts payable. Reclassified by management.'),
        la('tcwg-fin-3-uncorrected', '<p><strong>Uncorrected misstatements (management has determined these are immaterial):</strong></p>', 'Projected uncorrected misstatements of approximately $30K in aggregate (revenue $18K, expenses $12K). Management has determined these are immaterial to the financial statements, individually and in aggregate. The audit team concurs with this assessment.'),
        la('tcwg-fin-3-corrected', '<p><strong>Corrected misstatements that were individually significant:</strong></p>', 'AJE-001 ($45K revenue cutoff), AJE-002 ($12K depreciation correction), AJE-003 ($28K deferred revenue reclassification). Total corrections: $85K. All corrected in the final financial statements.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-s4',
      title: '4. Internal Control and Fraud (CAS 265 / CAS 240)',
      questions: [
        q('tcwg-fin-4-deficiencies', '<p>Were any significant deficiencies or material weaknesses in internal control identified during the audit?</p>', 'No', '<p>No significant deficiencies or material weaknesses identified. One minor observation (isolated AP three-way match deviation) communicated as a recommendation in the management letter.</p>'),
        la('tcwg-fin-4-ic-detail', '<p><strong>Description of significant deficiencies / material weaknesses and management\'s response:</strong></p>', 'No significant deficiencies or material weaknesses identified. Minor observation: one isolated instance of an accounts payable invoice processed without completing the three-way match control (1 of 25 samples tested). Recommendation: reinforce staff training on AP procedures. Management agreed to implement additional training.'),
        q('tcwg-fin-4-fraud', '<p>Were any indicators of fraud identified during the audit requiring communication to TCWG?</p>', 'No', '<p>No indicators of fraud identified during the audit of Shipping Line Inc. for the year ended March 31, 2024.</p>'),
        la('tcwg-fin-4-fraud-detail', '<p><strong>Fraud matters to communicate (if any)</strong></p>', 'Not applicable — no fraud indicators identified during the audit.'),
        q('tcwg-fin-4-gc', '<p>Were any going concern events or conditions identified during the audit?</p>', 'No', '<p>No going concern events or conditions identified. Entity has positive net income of $847K, adequate working capital, and an established credit facility with availability.</p>'),
        la('tcwg-fin-4-gc-detail', '<p><strong>Going concern matters (if any)</strong></p>', 'Not applicable — no going concern issues identified.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-s5',
      title: '5. Independence Confirmation (CAS 260.14(e))',
      questions: [
        la('tcwg-fin-5-ind', '<p><strong>Independence confirmation:</strong></p><p>We confirm that as of the date of this communication, we are independent of the entity in accordance with ethical requirements relevant to our audit in Canada.</p>', 'We confirm that as of May 2, 2024, we are independent of Shipping Line Inc. in accordance with the ethical requirements relevant to our audit in Canada, including the CPA Canada Code of Professional Conduct.'),
        la('tcwg-fin-5-ind-matters', '<p><strong>Independence matters identified during the audit (if any):</strong></p>', 'No independence matters identified during the audit.'),
      ],
      isExpanded: true
    },
    {
      id: 'aud-tcwg-fin-closing',
      title: '6. Closing',
      questions: [
        la('tcwg-fin-closing', '<p>We thank you for your cooperation during the audit. Please contact [Engagement Partner] at [phone/email] with any questions or comments.</p>', 'We thank the management and Board of Shipping Line Inc. for their cooperation and assistance during the audit for the year ended March 31, 2024. Please contact J. Williams, CPA (Engagement Partner) with any questions or comments.'),
        la('tcwg-fin-firm', '<p><strong>Firm name and engagement partner signature</strong></p>', '[Firm Name], Chartered Professional Accountants — J. Williams, CPA, Engagement Partner'),
        la('tcwg-fin-firmdate', '<p><strong>Date</strong></p>', 'May 2, 2024'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-tcwg-final',
    title: 'TCWG Communication — Completion',
    description: 'Post-audit communication with those charged with governance — CAS 260.',
    objective: `Objective: To communicate with TCWG the results of the audit, significant findings, and other matters arising from the audit.

Reference: CAS 260 — Communication with Those Charged with Governance.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// ─── Report template helpers ──────────────────────────────────────────────────

/** Renders a placeholder chip for variable fields in report templates. */
function chip(label: string): string {
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-md border border-primary/40 text-primary bg-primary/5 text-xs font-medium mx-0.5">${label}</span>`;
}

function makeReportChecklist(id: string, title: string, description: string, html: string): Checklist {
  return {
    id,
    title,
    description,
    objective: '',
    sections: [
      {
        id: `${id}-section`,
        title,
        isExpanded: true,
        questions: [
          {
            id: `${id}-body`,
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
}

// ── Compilation ───────────────────────────────────────────────────────────────

export const generateCompilationEngagementReport = (): Checklist =>
  makeReportChecklist('grpt-1-1', 'Compilation Engagement Report', 'CSRS 4200 Compilation Engagement Report', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">COMPILATION ENGAGEMENT REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Management of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4">
      We have compiled the accompanying financial information of ${chip('Entity Name')} for the period ended
      ${chip('Period End Date')}, which comprises the balance sheet as at ${chip('Period End Date')} and the statement of
      income and retained earnings for the period then ended, and a summary of significant accounting policies and other
      explanatory information.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Management's Responsibility</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation of this financial information in accordance with
      ${chip('Applicable Financial Reporting Framework')}, and for such internal control as management determines
      is necessary to enable the preparation of financial information that is free from material misstatement, whether
      due to fraud or error.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Practitioner's Responsibility</p>
    <p class="text-sm text-foreground mt-2">
      Our responsibility is to compile this financial information based on information provided by management. We
      conducted our compilation engagement in accordance with <strong>Canadian Standard on Related Services (CSRS) 4200,
      Compilation Engagements</strong>.
    </p>
    <p class="text-sm text-foreground mt-4">
      A compilation engagement is substantially less in scope than an audit or review engagement conducted in accordance
      with Canadian Auditing Standards or Canadian Standards on Review Engagements, and consequently does not enable us
      to obtain assurance that we would become aware of all significant matters that might be identified in such
      engagements. Accordingly, we do not express an audit opinion or a review conclusion on this financial information.
    </p>
    <p class="text-sm text-foreground mt-4">
      The financial information and the notes thereto are not intended to, nor do they, provide disclosure necessary for
      a fair presentation in accordance with ${chip('Applicable Financial Reporting Framework')}.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground mt-1">${chip('City, Province')}</p>
    <p class="text-sm text-foreground mt-1">${chip('Date of Report')}</p>
  `);

// ── Review ─────────────────────────────────────────────────────────────────────

export const generateReviewUnqualifiedASPE = (): Checklist =>
  makeReportChecklist('grpt-2-1', 'Review — Unqualified Report (ASPE)', 'CSRE 2400 Unqualified Review Conclusion — ASPE', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT PRACTITIONER'S REVIEW ENGAGEMENT REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Shareholders (or Board of Directors) of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Conclusion</p>
    <p class="text-sm text-foreground mt-2">
      Based on our review, nothing has come to our attention that causes us to believe that the accompanying financial
      statements of <strong>${chip('Entity Name')}</strong> for the year ended <strong>${chip('Year End Date')}</strong> are not prepared,
      in all material respects, in accordance with <strong>Accounting Standards for Private Enterprises (ASPE)</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Conclusion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our review in accordance with <strong>Canadian Standard on Review Engagements (CSRE) 2400,
      Engagements to Review Historical Financial Statements</strong>. Our responsibilities under that standard are
      further described in the Practitioner's Responsibilities section of our report.
    </p>
    <p class="text-sm text-foreground mt-2">
      We are independent of the entity in accordance with the ethical requirements that are relevant to our review of the
      financial statements in Canada, and we have fulfilled our other ethical responsibilities in accordance with these
      requirements.
    </p>
    <p class="text-sm text-foreground mt-2">
      We believe that the evidence we have obtained is sufficient and appropriate to provide a basis for our conclusion.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Management's Responsibility for the Financial Statements</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of these financial statements in accordance
      with ASPE, and for such internal control as management determines is necessary to enable the preparation of
      financial statements that are free from material misstatement, whether due to fraud or error.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Practitioner's Responsibilities for the Review of the Financial Statements</p>
    <p class="text-sm text-foreground mt-2">
      Our responsibility is to express a conclusion on the accompanying financial statements based on our review. CSRE
      2400 requires us to conclude whether anything has come to our attention that causes us to believe that the
      financial statements are not prepared, in all material respects, in accordance with ASPE.
    </p>
    <p class="text-sm text-foreground mt-2">
      A review engagement is substantially less in scope than an audit conducted in accordance with Canadian Auditing
      Standards. Consequently, it does not enable us to obtain assurance that we would become aware of all significant
      matters that might be identified in an audit. Accordingly, we do not express an audit opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateReviewModifiedASPE = (): Checklist =>
  makeReportChecklist('grpt-2-2', 'Review — Modified Report (ASPE)', 'CSRE 2400 Modified Review Conclusion — ASPE', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT PRACTITIONER'S REVIEW ENGAGEMENT REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Shareholders (or Board of Directors) of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Modified Conclusion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the matter(s) giving rise to the modification. For example: The financial statements do not include a
      provision for income taxes in respect of [matter], which is not in accordance with ASPE. Had provision been made,
      net income would have been decreased by $[X], and the related income taxes payable would have been increased by
      $[X].]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Modified Conclusion</p>
    <p class="text-sm text-foreground mt-2">
      Based on our review, except for the matter described in the Basis for Modified Conclusion paragraph, nothing has
      come to our attention that causes us to believe that the accompanying financial statements of
      <strong>${chip('Entity Name')}</strong> for the year ended <strong>${chip('Year End Date')}</strong> are not prepared, in all
      material respects, in accordance with <strong>Accounting Standards for Private Enterprises (ASPE)</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Management's Responsibility for the Financial Statements</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of these financial statements in accordance with ASPE.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Practitioner's Responsibilities</p>
    <p class="text-sm text-foreground mt-2">
      Our responsibility is to express a conclusion on the accompanying financial statements based on our review
      conducted in accordance with <strong>CSRE 2400</strong>. A review engagement is substantially less in scope than
      an audit and does not enable us to express an audit opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateReviewUnqualifiedASNPO = (): Checklist =>
  makeReportChecklist('grpt-2-3', 'Review — Unqualified Report (ASNPO)', 'CSRE 2400 Unqualified Review Conclusion — ASNPO', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT PRACTITIONER'S REVIEW ENGAGEMENT REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Members (or Board of Directors) of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Conclusion</p>
    <p class="text-sm text-foreground mt-2">
      Based on our review, nothing has come to our attention that causes us to believe that the accompanying financial
      statements of <strong>${chip('Entity Name')}</strong> for the year ended <strong>${chip('Year End Date')}</strong> are not prepared,
      in all material respects, in accordance with <strong>Accounting Standards for Not-for-Profit Organizations
      (ASNPO)</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Conclusion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our review in accordance with <strong>CSRE 2400, Engagements to Review Historical Financial
      Statements</strong>. We are independent of the entity in accordance with applicable ethical requirements and have
      fulfilled our other ethical responsibilities. We believe that the evidence obtained is sufficient and appropriate
      to provide a basis for our conclusion.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Management's Responsibility</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of these financial statements in accordance
      with ASNPO, and for such internal control as management determines is necessary.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Practitioner's Responsibilities</p>
    <p class="text-sm text-foreground mt-2">
      A review engagement is substantially less in scope than an audit. Accordingly, we do not express an audit opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateReviewModifiedASNPO = (): Checklist =>
  makeReportChecklist('grpt-2-4', 'Review — Modified Report (ASNPO)', 'CSRE 2400 Modified Review Conclusion — ASNPO', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT PRACTITIONER'S REVIEW ENGAGEMENT REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Members (or Board of Directors) of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Modified Conclusion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the matter(s) giving rise to the modification.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Modified Conclusion</p>
    <p class="text-sm text-foreground mt-2">
      Based on our review, except for the matter described above, nothing has come to our attention that causes us to
      believe that the accompanying financial statements of <strong>${chip('Entity Name')}</strong> for the year ended
      <strong>${chip('Year End Date')}</strong> are not prepared, in all material respects, in accordance with
      <strong>ASNPO</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Management's Responsibility</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of these financial statements in accordance with ASNPO.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Practitioner's Responsibilities</p>
    <p class="text-sm text-foreground mt-2">
      Our review was conducted in accordance with <strong>CSRE 2400</strong>. A review engagement is substantially less
      in scope than an audit. Accordingly, we do not express an audit opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateReviewSpecialPurposeUnqualified = (): Checklist =>
  makeReportChecklist('grpt-2-5', 'Review — Special Purpose Unqualified Report', 'CSRE 2400 Special Purpose Unqualified Review Conclusion', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT PRACTITIONER'S REVIEW ENGAGEMENT REPORT</p>
    <p class="text-sm text-foreground mt-4 text-center italic">Special Purpose Financial Statements</p>
    <p class="text-sm text-foreground mt-6">To ${chip('Intended Users')} of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Conclusion</p>
    <p class="text-sm text-foreground mt-2">
      Based on our review, nothing has come to our attention that causes us to believe that the accompanying special
      purpose financial statements of <strong>${chip('Entity Name')}</strong> for the year ended <strong>${chip('Year End Date')}</strong>
      are not prepared, in all material respects, in accordance with <strong>${chip('Special Purpose Framework')}</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Emphasis of Matter — Basis of Accounting</p>
    <p class="text-sm text-foreground mt-2">
      Without modifying our conclusion, we draw attention to Note [X] to the financial statements, which describes the
      basis of accounting. The financial statements are prepared to comply with [special purpose framework] and, as a
      result, the financial statements may not be suitable for another purpose.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Management's Responsibility</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation of these special purpose financial statements in accordance with
      ${chip('Special Purpose Framework')}.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Practitioner's Responsibilities</p>
    <p class="text-sm text-foreground mt-2">
      Our review was conducted in accordance with <strong>CSRE 2400</strong>. A review engagement is substantially less
      in scope than an audit. Accordingly, we do not express an audit opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateReviewSpecialPurposeModified = (): Checklist =>
  makeReportChecklist('grpt-2-6', 'Review — Special Purpose Modified Report', 'CSRE 2400 Special Purpose Modified Review Conclusion', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT PRACTITIONER'S REVIEW ENGAGEMENT REPORT</p>
    <p class="text-sm text-foreground mt-4 text-center italic">Special Purpose Financial Statements</p>
    <p class="text-sm text-foreground mt-6">To ${chip('Intended Users')} of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Modified Conclusion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the matter(s) giving rise to the modification.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Modified Conclusion</p>
    <p class="text-sm text-foreground mt-2">
      Based on our review, except for the matter described above, nothing has come to our attention that causes us to
      believe that the accompanying special purpose financial statements of <strong>${chip('Entity Name')}</strong> for the year
      ended <strong>${chip('Year End Date')}</strong> are not prepared, in all material respects, in accordance with
      <strong>${chip('Special Purpose Framework')}</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Emphasis of Matter — Basis of Accounting</p>
    <p class="text-sm text-foreground mt-2">
      Without modifying our conclusion, we draw attention to Note [X] to the financial statements, which describes the
      basis of accounting. The financial statements are prepared to comply with [special purpose framework] and, as a
      result, the financial statements may not be suitable for another purpose.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Management's Responsibility</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation of these special purpose financial statements in accordance with ${chip('Special Purpose Framework')}.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Practitioner's Responsibilities</p>
    <p class="text-sm text-foreground mt-2">
      Our review was conducted in accordance with <strong>CSRE 2400</strong>. A review engagement is substantially less
      in scope than an audit. Accordingly, we do not express an audit opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

// ── Audit — Canada ─────────────────────────────────────────────────────────────

export const generateAuditUnqualifiedASPE = (): Checklist =>
  makeReportChecklist('grpt-ca-1', "Unqualified Auditor's Report (ASPE)", "CAS Unqualified Auditor's Report — ASPE", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We have audited the financial statements of <strong>${chip('Entity Name')}</strong> (the Entity), which comprise the
      balance sheet as at <strong>${chip('Year End Date')}</strong>, and the statements of income and retained earnings and cash
      flows for the year then ended, and notes to the financial statements, including a summary of significant
      accounting policies.
    </p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, the accompanying financial statements present fairly, in all material respects, the financial
      position of the Entity as at ${chip('Year End Date')}, and its financial performance and its cash flows for the year then
      ended in accordance with <strong>Accounting Standards for Private Enterprises (ASPE)</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>Canadian Auditing Standards (CAS)</strong>. Our
      responsibilities under those standards are further described in the Auditor's Responsibilities for the Audit of
      the Financial Statements section of our report. We are independent of the Entity in accordance with the ethical
      requirements that are relevant to our audit of the financial statements in Canada, and we have fulfilled our
      other ethical responsibilities in accordance with these requirements. We believe that the audit evidence we have
      obtained is sufficient and appropriate to provide a basis for our opinion.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Responsibilities of Management and Those Charged with Governance for the Financial Statements</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of the financial statements in accordance
      with ASPE, and for such internal control as management determines is necessary to enable the preparation of
      financial statements that are free from material misstatement, whether due to fraud or error.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Auditor's Responsibilities for the Audit of the Financial Statements</p>
    <p class="text-sm text-foreground mt-2">
      Our objectives are to obtain reasonable assurance about whether the financial statements as a whole are free from
      material misstatement, whether due to fraud or error, and to issue an auditor's report that includes our opinion.
      Reasonable assurance is a high level of assurance, but is not a guarantee that an audit conducted in accordance
      with CAS will always detect a material misstatement when it exists.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateAuditUnqualifiedASNPO = (): Checklist =>
  makeReportChecklist('grpt-ca-2', "Unqualified Auditor's Report (ASNPO)", "CAS Unqualified Auditor's Report — ASNPO", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Members (or Board of Directors) of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We have audited the financial statements of <strong>${chip('Entity Name')}</strong> (the Organization), which comprise
      the statement of financial position as at <strong>${chip('Year End Date')}</strong>, and the statements of operations,
      changes in net assets and cash flows for the year then ended, and notes to the financial statements, including a
      summary of significant accounting policies.
    </p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, the accompanying financial statements present fairly, in all material respects, the financial
      position of the Organization as at ${chip('Year End Date')}, and its results of operations and its cash flows for the year
      then ended in accordance with <strong>Accounting Standards for Not-for-Profit Organizations (ASNPO)</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>Canadian Auditing Standards (CAS)</strong>. We are independent
      of the Organization in accordance with the ethical requirements that are relevant to our audit in Canada, and we
      have fulfilled our other ethical responsibilities. We believe that the audit evidence we have obtained is
      sufficient and appropriate to provide a basis for our opinion.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Responsibilities of Management and Those Charged with Governance</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of the financial statements in accordance with
      ASNPO, and for such internal control as management determines is necessary.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Auditor's Responsibilities</p>
    <p class="text-sm text-foreground mt-2">
      Our objectives are to obtain reasonable assurance that the financial statements are free from material
      misstatement and to issue an auditor's report including our opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateAuditQualifiedMaterialMisstatement = (): Checklist =>
  makeReportChecklist('grpt-ca-3', 'Qualified Opinion — Material Misstatement', "CAS Qualified Auditor's Report — Material Misstatement", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Qualified Opinion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the matter(s) giving rise to the qualification. For example: The Entity has not recognized a provision
      for [matter] amounting to approximately $[X]. In our opinion, a provision should have been made in accordance with
      ASPE Section [X]. Had the provision been recognized, net income for the year would have decreased by $[X], the
      provision balance would have increased by $[X], and retained earnings would have decreased by $[X].]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Qualified Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, except for the effects of the matter described in the Basis for Qualified Opinion paragraph, the
      accompanying financial statements present fairly, in all material respects, the financial position of
      <strong>${chip('Entity Name')}</strong> as at <strong>${chip('Year End Date')}</strong>, and its financial performance and cash
      flows for the year then ended in accordance with <strong>ASPE</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>Canadian Auditing Standards (CAS)</strong>. We are independent
      of the Entity and have fulfilled our ethical responsibilities. We believe the audit evidence obtained is sufficient
      and appropriate to provide a basis for our qualified opinion.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Responsibilities of Management</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of the financial statements in accordance with ASPE.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateAuditQualifiedInsufficientEvidence = (): Checklist =>
  makeReportChecklist('grpt-ca-4', 'Qualified Opinion — Insufficient Evidence', "CAS Qualified Auditor's Report — Scope Limitation", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Qualified Opinion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the scope limitation. For example: The Entity's accounting records for [specific area] were not
      available to us. Consequently, we were unable to determine whether any adjustments were necessary in respect of
      recorded or unrecorded [items], which could affect the financial statements as at ${chip('Year End Date')}.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Qualified Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, except for the possible effects of the matter described in the Basis for Qualified Opinion
      paragraph, the accompanying financial statements present fairly, in all material respects, the financial position
      of <strong>${chip('Entity Name')}</strong> as at <strong>${chip('Year End Date')}</strong>, and its financial performance and cash
      flows for the year then ended in accordance with <strong>ASPE</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      Except as described in the Basis for Qualified Opinion paragraph, we conducted our audit in accordance with
      <strong>Canadian Auditing Standards (CAS)</strong>. We are independent and have fulfilled our ethical
      responsibilities. We believe the audit evidence obtained is sufficient and appropriate to provide a basis for our
      qualified opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateAuditAdverseOpinion = (): Checklist =>
  makeReportChecklist('grpt-ca-5', 'Adverse Opinion', "CAS Adverse Opinion Auditor's Report", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Adverse Opinion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the matter(s) giving rise to the adverse opinion. For example: As described in Note [X], the Entity
      has not consolidated subsidiary [Subsidiary Name] because management believes consolidation is not required. In
      our opinion, the subsidiary should be consolidated in accordance with ASPE Section 1590. The effects of this
      departure from ASPE on the financial statements have not been determined. If the subsidiary were consolidated,
      many elements of the financial statements would be materially affected.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Adverse Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, because of the significance of the matter discussed in the Basis for Adverse Opinion paragraph,
      the accompanying financial statements <strong>do not</strong> present fairly, in all material respects, the
      financial position of <strong>${chip('Entity Name')}</strong> as at <strong>${chip('Year End Date')}</strong>, and its financial
      performance and cash flows for the year then ended in accordance with <strong>ASPE</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>Canadian Auditing Standards (CAS)</strong>. We are independent
      of the Entity and have fulfilled our ethical responsibilities.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateAuditDisclaimerOfOpinion = (): Checklist =>
  makeReportChecklist('grpt-ca-6', 'Disclaimer of Opinion', "CAS Disclaimer of Opinion Auditor's Report", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Disclaimer of Opinion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the scope limitation(s). For example: We were not able to obtain sufficient appropriate audit evidence
      about [specific matters] because of [describe circumstances]. Consequently, we were unable to determine whether
      any adjustments to the financial statements were necessary.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Disclaimer of Opinion</p>
    <p class="text-sm text-foreground mt-2">
      Because of the significance of the matter described in the Basis for Disclaimer of Opinion paragraph, we have
      not been able to obtain sufficient appropriate audit evidence to provide a basis for an audit opinion. Accordingly,
      <strong>we do not express an opinion on the financial statements</strong> of <strong>${chip('Entity Name')}</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Responsibilities of Management</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of the financial statements in accordance with ASPE.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Auditor's Responsibilities</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our engagement in accordance with <strong>Canadian Auditing Standards (CAS)</strong>. We are
      independent of the Entity and have fulfilled our ethical responsibilities. However, because of the matter
      described above, we were not able to obtain sufficient audit evidence to provide a basis for an opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateAuditEmphasisOfMatter = (): Checklist =>
  makeReportChecklist('grpt-ca-7', "Auditor's Report — Emphasis of Matter", "CAS Auditor's Report with Emphasis of Matter Paragraph", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, the accompanying financial statements present fairly, in all material respects, the financial
      position of <strong>${chip('Entity Name')}</strong> as at <strong>${chip('Year End Date')}</strong>, and its financial performance
      and cash flows for the year then ended in accordance with <strong>ASPE</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>Canadian Auditing Standards (CAS)</strong>. We are independent
      of the Entity and have fulfilled our ethical responsibilities. We believe the audit evidence obtained is sufficient
      and appropriate to provide a basis for our opinion.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Emphasis of Matter</p>
    <p class="text-sm text-foreground mt-2">
      Without modifying our opinion, we draw attention to Note [X] in the financial statements, which describes
      [describe the matter giving rise to the emphasis of matter paragraph, e.g., significant uncertainty about the
      Entity's ability to continue as a going concern, or the restatement of prior year amounts]. Our opinion is not
      modified in respect of this matter.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Responsibilities of Management</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of the financial statements in accordance with ASPE.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateAuditOtherMatterParagraph = (): Checklist =>
  makeReportChecklist('grpt-ca-8', "Auditor's Report — Other Matter Paragraph", "CAS Auditor's Report with Other Matter Paragraph", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, the accompanying financial statements present fairly, in all material respects, the financial
      position of <strong>${chip('Entity Name')}</strong> as at <strong>${chip('Year End Date')}</strong>, and its financial performance
      and cash flows for the year then ended in accordance with <strong>ASPE</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>Canadian Auditing Standards (CAS)</strong>. We are independent
      of the Entity and have fulfilled our ethical responsibilities. We believe the audit evidence obtained is sufficient
      and appropriate to provide a basis for our opinion.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Other Matter</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the other matter. For example: The financial statements for the year ended [Prior Year End Date] were
      audited by another auditor who expressed an unmodified opinion on those statements on [Date of Prior Report].
      OR: This report is intended solely for the information and use of [specify users] and is not intended to be and
      should not be used by anyone other than these specified parties.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Responsibilities of Management</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of the financial statements in accordance with ASPE.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Licensed Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, Province')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

// ── Audit — United States ──────────────────────────────────────────────────────

export const generateUSAuditFairPresentation = (): Checklist =>
  makeReportChecklist('grpt-us-1', "Auditor's Report — Fair Presentation Framework (AU-C 700)", 'GAAS Unqualified Opinion — Fair Presentation Framework', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Board of Directors and Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We have audited the financial statements of <strong>${chip('Entity Name')}</strong>, which comprise the balance sheets as
      of <strong>${chip('Year End Date')}</strong>, and the related statements of income, changes in stockholders' equity, and
      cash flows for the year then ended, and the related notes to the financial statements.
    </p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, the accompanying financial statements present fairly, in all material respects, the financial
      position of ${chip('Entity Name')} as of ${chip('Year End Date')}, and the results of its operations and its cash flows for the
      year then ended in accordance with <strong>accounting principles generally accepted in the United States of
      America (US GAAP)</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>auditing standards generally accepted in the United States of
      America (GAAS)</strong>. Our responsibilities under those standards are further described in the Auditor's
      Responsibilities section. We are required to be independent of ${chip('Entity Name')} and to meet our other ethical
      responsibilities in accordance with the relevant ethical requirements relating to our audit. We believe that the
      audit evidence we have obtained is sufficient and appropriate to provide a basis for our audit opinion.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Responsibilities of Management for the Financial Statements</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of the financial statements in accordance
      with US GAAP, and for the design, implementation, and maintenance of internal control relevant to the preparation
      and fair presentation of financial statements that are free from material misstatement, whether due to fraud or error.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Auditor's Responsibilities for the Audit of the Financial Statements</p>
    <p class="text-sm text-foreground mt-2">
      Our objectives are to obtain reasonable assurance about whether the financial statements as a whole are free from
      material misstatement and to issue an auditor's report that includes our opinion. Reasonable assurance is a high
      level of assurance but is not absolute assurance and therefore is not a guarantee that an audit conducted in
      accordance with GAAS will always detect a material misstatement when it exists.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Certified Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, State')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateUSAuditComplianceFramework = (): Checklist =>
  makeReportChecklist('grpt-us-2', "Auditor's Report — Compliance Framework (AU-C 800)", 'GAAS Unqualified Opinion — Compliance (Special Purpose) Framework', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-4 text-center italic">Special Purpose Financial Statements</p>
    <p class="text-sm text-foreground mt-6">To the Board of Directors of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We have audited the special purpose financial statements of <strong>${chip('Entity Name')}</strong>, which comprise the
      balance sheet as of <strong>${chip('Year End Date')}</strong>, and the related statements of income and cash flows for the
      year then ended, prepared in accordance with <strong>[Special Purpose Framework, e.g., cash basis of accounting,
      tax-basis, regulatory basis]</strong>.
    </p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, the accompanying financial statements are prepared, in all material respects, in accordance with
      <strong>${chip('Special Purpose Framework')}</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Emphasis of Matter — Basis of Accounting</p>
    <p class="text-sm text-foreground mt-2">
      We draw attention to Note [X] to the financial statements, which describes the basis of accounting. The financial
      statements are prepared on the [describe basis], which is a basis of accounting other than accounting principles
      generally accepted in the United States of America, to [describe the purpose]. As a result, the financial
      statements may not be suitable for another purpose. Our opinion is not modified with respect to this matter.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>GAAS</strong>. We are independent of the Entity and have met
      our other ethical responsibilities. We believe the audit evidence obtained is sufficient and appropriate.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Certified Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, State')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateUSQualifiedMaterialFair = (): Checklist =>
  makeReportChecklist('grpt-us-3', 'Qualified Opinion — Material Misstatement (Fair Presentation)', 'GAAS Qualified Opinion — Material Misstatement, Fair Presentation Framework', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Board of Directors and Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Qualified Opinion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the matter giving rise to the qualification. For example: The Entity carries its investments in
      [securities] at cost, which constitutes a departure from US GAAP. Under US GAAP, these investments are required
      to be measured at fair value. The effects of this departure on the financial statements as of ${chip('Year End Date')}
      have not been determined.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Qualified Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, except for the effects of the matter described in the Basis for Qualified Opinion paragraph, the
      accompanying financial statements present fairly, in all material respects, the financial position of
      <strong>${chip('Entity Name')}</strong> as of <strong>${chip('Year End Date')}</strong>, and the results of its operations and its
      cash flows for the year then ended in accordance with <strong>US GAAP</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>GAAS</strong>. We are independent of the Entity and have met
      our other ethical responsibilities. We believe the audit evidence obtained is sufficient and appropriate to
      provide a basis for our qualified opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Certified Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, State')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateUSQualifiedMaterialCompliance = (): Checklist =>
  makeReportChecklist('grpt-us-4', 'Qualified Opinion — Material Misstatement (Compliance)', 'GAAS Qualified Opinion — Material Misstatement, Compliance Framework', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-4 text-center italic">Special Purpose Financial Statements</p>
    <p class="text-sm text-foreground mt-6">To the Board of Directors of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Qualified Opinion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the matter giving rise to the qualification in the context of the compliance framework.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Qualified Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, except for the effects of the matter described in the Basis for Qualified Opinion paragraph, the
      accompanying financial statements are prepared, in all material respects, in accordance with
      <strong>${chip('Special Purpose Compliance Framework')}</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Emphasis of Matter — Basis of Accounting</p>
    <p class="text-sm text-foreground mt-2">
      We draw attention to Note [X] to the financial statements describing the basis of accounting. The financial
      statements may not be suitable for another purpose. Our opinion is not modified with respect to this matter.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>GAAS</strong>. We are independent and have met our ethical
      responsibilities. We believe the audit evidence obtained is sufficient and appropriate.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Certified Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, State')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateUSQualifiedInsufficientEvidence = (): Checklist =>
  makeReportChecklist('grpt-us-5', 'Qualified Opinion — Insufficient Evidence', 'GAAS Qualified Opinion — Scope Limitation', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Board of Directors and Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Qualified Opinion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the scope limitation. For example: The Entity's records relating to [specific area] were not made
      available to us. As a result, we were unable to perform procedures that we considered necessary, and we were
      unable to determine whether adjustments to [the affected financial statement line items] were necessary.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Qualified Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, except for the possible effects of the matter described in the Basis for Qualified Opinion
      paragraph, the accompanying financial statements present fairly, in all material respects, the financial position
      of <strong>${chip('Entity Name')}</strong> as of <strong>${chip('Year End Date')}</strong>, and the results of its operations and
      cash flows for the year then ended in accordance with <strong>US GAAP</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      Except as described above, we conducted our audit in accordance with <strong>GAAS</strong>. We are independent of
      the Entity and have met our ethical responsibilities. We believe the audit evidence obtained is sufficient and
      appropriate to provide a basis for our qualified opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Certified Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, State')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateUSAdverseOpinion = (): Checklist =>
  makeReportChecklist('grpt-us-6', 'Adverse Opinion', "GAAS Adverse Opinion Auditor's Report", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Board of Directors and Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Adverse Opinion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the matter(s) giving rise to the adverse opinion. For example: The Entity has not consolidated its
      subsidiaries as required by US GAAP. If these subsidiaries were consolidated, the effects on assets, liabilities,
      revenues, and expenses would be pervasive and material to the financial statements. Management has determined not
      to consolidate these subsidiaries on the basis that [explain management's rationale].]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Adverse Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, because of the significance of the matter described in the Basis for Adverse Opinion paragraph,
      the accompanying financial statements <strong>do not</strong> present fairly the financial position of
      <strong>${chip('Entity Name')}</strong> as of <strong>${chip('Year End Date')}</strong>, or the results of its operations and its
      cash flows for the year then ended, in accordance with <strong>US GAAP</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>GAAS</strong>. We are independent of the Entity and have met
      our ethical responsibilities.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Certified Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, State')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateUSDisclaimerOfOpinion = (): Checklist =>
  makeReportChecklist('grpt-us-7', 'Disclaimer of Opinion', "GAAS Disclaimer of Opinion Auditor's Report", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Board of Directors and Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Disclaimer of Opinion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the matter(s) causing the disclaimer. For example: We were engaged to audit the accompanying financial
      statements, but we were not able to obtain sufficient appropriate evidence about [specific matters] because
      [describe circumstances]. Consequently, we were unable to determine the effects on the financial statements.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Disclaimer of Opinion</p>
    <p class="text-sm text-foreground mt-2">
      Because of the significance of the matter described in the Basis for Disclaimer of Opinion paragraph, we have
      not been able to obtain sufficient appropriate evidence to provide a basis for an audit opinion. Accordingly,
      <strong>we do not express an opinion</strong> on the accompanying financial statements of
      <strong>${chip('Entity Name')}</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Responsibilities of Management</p>
    <p class="text-sm text-foreground mt-2">
      Management is responsible for the preparation and fair presentation of the financial statements in accordance with US GAAP.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Auditor's Responsibilities</p>
    <p class="text-sm text-foreground mt-2">
      We were engaged to conduct our audit in accordance with <strong>GAAS</strong>. We are required to be independent
      of the Entity and to meet our other ethical responsibilities. However, because of the matter described above, we
      were not able to obtain sufficient appropriate evidence to provide a basis for an audit opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Certified Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, State')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateUSKeyAuditMatters = (): Checklist =>
  makeReportChecklist('grpt-us-8', "Auditor's Report with Key Audit Matters and Emphasis of Matter", "GAAS Auditor's Report — Key Audit Matters + Emphasis of Matter", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Board of Directors and Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, the accompanying financial statements present fairly, in all material respects, the financial
      position of <strong>${chip('Entity Name')}</strong> as of <strong>${chip('Year End Date')}</strong>, and the results of its
      operations and cash flows for the year then ended in accordance with <strong>US GAAP</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>GAAS</strong>. We are independent of the Entity and have met
      our other ethical responsibilities. We believe the audit evidence obtained is sufficient and appropriate.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Critical Audit Matter</p>
    <p class="text-sm text-foreground mt-2">
      The critical audit matter communicated below is a matter arising from the current period audit of the financial
      statements that was communicated or required to be communicated to the audit committee and that: (1) relates to
      accounts or disclosures that are material to the financial statements and (2) involved our especially challenging,
      subjective, or complex judgment.
    </p>
    <p class="text-sm text-foreground mt-2 italic">[Name of Critical Audit Matter]</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the critical audit matter, including: a description of the principal considerations that led us to
      determine this was a critical audit matter; how the critical audit matter was addressed in the audit; and a
      reference to the relevant financial statement accounts or disclosures.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Emphasis of Matter</p>
    <p class="text-sm text-foreground mt-2">
      As discussed in Note [X] to the financial statements, [describe the matter requiring emphasis, e.g., the Entity
      adopted ASC [Topic] during the current year / there is a significant uncertainty regarding the Entity's ability
      to continue as a going concern]. Our opinion is not modified with respect to this matter.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Certified Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, State')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

export const generateUSQualifiedWithEmphasis = (): Checklist =>
  makeReportChecklist('grpt-us-9', 'Qualified Opinion with Emphasis of Matter', "GAAS Qualified Auditor's Report with Emphasis of Matter", `
    <p class="text-sm text-foreground font-semibold text-center mt-2">INDEPENDENT AUDITOR'S REPORT</p>
    <p class="text-sm text-foreground mt-6">To the Board of Directors and Shareholders of ${chip('Entity Name')}:</p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Qualified Opinion</p>
    <p class="text-sm text-muted-foreground italic mt-2 border-l-2 border-muted pl-3">
      [Describe the matter giving rise to the qualification.]
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Qualified Opinion</p>
    <p class="text-sm text-foreground mt-2">
      In our opinion, except for the effects of the matter described in the Basis for Qualified Opinion paragraph, the
      accompanying financial statements present fairly, in all material respects, the financial position of
      <strong>${chip('Entity Name')}</strong> as of <strong>${chip('Year End Date')}</strong>, and the results of its operations and cash
      flows for the year then ended in accordance with <strong>US GAAP</strong>.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Emphasis of Matter</p>
    <p class="text-sm text-foreground mt-2">
      Without further modifying our opinion, we draw attention to Note [X] in the financial statements, which describes
      [describe the matter requiring emphasis, e.g., a restatement of comparative information / a significant
      uncertainty]. Our opinion is not modified with respect to this matter.
    </p>
    <p class="text-sm text-foreground mt-4 font-semibold">Basis for Opinion</p>
    <p class="text-sm text-foreground mt-2">
      We conducted our audit in accordance with <strong>GAAS</strong>. We are independent of the Entity and have met
      our other ethical responsibilities. We believe the audit evidence obtained is sufficient and appropriate to
      provide a basis for our qualified opinion.
    </p>
    <p class="text-sm text-foreground mt-8">${chip('Firm Name')}</p>
    <p class="text-sm text-foreground">Certified Public Accountants</p>
    <p class="text-sm text-foreground">${chip('City, State')}</p>
    <p class="text-sm text-foreground">${chip('Date of Report')}</p>
  `);

// ─── Letter template helpers ──────────────────────────────────────────────────

function makeLetterChecklist(id: string, title: string, description: string, html: string): Checklist {
  return {
    id,
    title,
    description,
    objective: '',
    sections: [
      {
        id: `${id}-section`,
        title,
        isExpanded: true,
        questions: [
          {
            id: `${id}-body`,
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
}

// ── Review Letters ─────────────────────────────────────────────────────────────

export const generateReviewEngagementLetterMaster = (): Checklist =>
  makeLetterChecklist('glt-2-1', 'Engagement Letter Review — Master (Corp)', 'CSRE 2400 Review Engagement Letter — Master Corporate', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Contact Name')}<br/>${chip('Entity Name')}<br/>${chip('Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Contact Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      We are pleased to confirm our acceptance of the engagement to review the financial statements of
      <strong>${chip('Entity Name')}</strong> for the year ended <strong>${chip('Year End Date')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Objective and Scope</p>
    <p class="mt-2 text-sm text-foreground">
      The objective of our review engagement is to enable us to express a conclusion on whether anything has
      come to our attention that causes us to believe that the financial statements are not prepared, in all
      material respects, in accordance with <strong>${chip('Applicable Financial Reporting Framework')}</strong>. Our
      review will be conducted in accordance with <strong>Canadian Standard on Review Engagements (CSRE) 2400,
      Engagements to Review Historical Financial Statements</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground">
      A review engagement is substantially less in scope than an audit conducted in accordance with Canadian
      Auditing Standards and, consequently, does not enable us to obtain assurance that we would become aware
      of all significant matters that might be identified in an audit.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Management's Responsibilities</p>
    <p class="mt-2 text-sm text-foreground">
      Management is responsible for the preparation and fair presentation of these financial statements in
      accordance with ${chip('Applicable Financial Reporting Framework')}, and for such internal control as
      management determines is necessary to enable the preparation of financial statements that are free from
      material misstatement, whether due to fraud or error.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Our Fees</p>
    <p class="mt-2 text-sm text-foreground">
      Our fees for this engagement will be ${chip('Fee Amount or Basis')}.
    </p>
    <p class="mt-4 text-sm text-foreground">
      If the contents of this letter are in accordance with your understanding of the terms of this engagement,
      please sign the enclosed copy and return it to us.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

export const generateReviewManagementRepresentationLetter = (): Checklist =>
  makeLetterChecklist('glt-2-2', 'Management Representation Letter Review (Corp)', 'CSRE 2400 Management Representation Letter — Corporate Review', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Firm Name')}<br/>${chip('Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Engagement Partner')},</p>
    <p class="mt-4 text-sm text-foreground">
      This representation letter is provided in connection with your review of the financial statements of
      <strong>${chip('Entity Name')}</strong> for the year ended <strong>${chip('Year End Date')}</strong> for the purpose of
      expressing a conclusion on whether anything has come to your attention that causes you to believe that
      the financial statements are not prepared, in all material respects, in accordance with
      <strong>${chip('Applicable Financial Reporting Framework')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We confirm that, to the best of our knowledge and belief, having made such inquiries as we considered
      necessary for the purpose of appropriately informing ourselves:
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Financial Statements</p>
    <p class="mt-2 text-sm text-foreground">
      1. We have fulfilled our responsibilities, as set out in the terms of the review engagement letter dated
      ${chip('Engagement Letter Date')}, for the preparation and fair presentation of the financial statements
      in accordance with ${chip('Applicable Financial Reporting Framework')}.
    </p>
    <p class="mt-2 text-sm text-foreground">
      2. We acknowledge our responsibility for the design, implementation, and maintenance of internal control
      relevant to the preparation of financial statements that are free from material misstatement, whether
      due to fraud or error.
    </p>
    <p class="mt-2 text-sm text-foreground">
      3. Significant assumptions used by us in making accounting estimates, including those measured at fair
      value, are reasonable.
    </p>
    <p class="mt-2 text-sm text-foreground">
      4. We have disclosed to you all known actual or possible litigation and claims whose effects should be
      considered when preparing the financial statements.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Authorized Signatory')}<br/>${chip('Title')}<br/>${chip('Entity Name')}</p>
  `);

export const generateReviewFindingsLetter = (): Checklist =>
  makeLetterChecklist('glt-2-3', 'Review Findings Letter (Corp)', 'CSRE 2400 Review Findings Communication — Corporate', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Contact Name')}<br/>${chip('Entity Name')}<br/>${chip('Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Contact Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      We have completed our review of the financial statements of <strong>${chip('Entity Name')}</strong> for the year ended
      <strong>${chip('Year End Date')}</strong> in accordance with <strong>CSRE 2400</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Review Findings</p>
    <p class="mt-2 text-sm text-foreground">
      During the course of our review, the following matters came to our attention:
    </p>
    <p class="mt-3 text-sm text-foreground">${chip('Finding 1 Description')}</p>
    <p class="mt-3 text-sm text-foreground">${chip('Finding 2 Description')}</p>
    <p class="mt-4 text-sm text-foreground">
      These findings do not modify our review conclusion. We bring these matters to management's attention
      for information purposes and recommend that appropriate corrective actions be considered.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We would be pleased to discuss these findings at your convenience.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

export const generateLetterToPredecessor = (): Checklist =>
  makeLetterChecklist('glt-2-4', 'Letter to a Predecessor (Corp)', 'Communication to Predecessor Practitioner', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Predecessor Firm Name')}<br/>${chip('Predecessor Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Predecessor Engagement Partner')},</p>
    <p class="mt-4 text-sm text-foreground">
      We have been advised by <strong>${chip('Entity Name')}</strong> that they intend to appoint us as their practitioner
      for the year ended <strong>${chip('Year End Date')}</strong>. Before accepting this appointment, professional
      standards require us to communicate with the predecessor practitioner.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We would appreciate your response to the following inquiries:
    </p>
    <p class="mt-3 text-sm text-foreground">
      1. Are there any professional reasons why we should not accept this engagement?
    </p>
    <p class="mt-3 text-sm text-foreground">
      2. Are there any matters of which we should be aware that have a bearing on the integrity of management?
    </p>
    <p class="mt-3 text-sm text-foreground">
      3. Are there any fees outstanding from prior engagements?
    </p>
    <p class="mt-3 text-sm text-foreground">
      4. Are there any matters that are currently in dispute or unresolved?
    </p>
    <p class="mt-4 text-sm text-foreground">
      Please indicate your response by completing and returning the enclosed copy of this letter at your
      earliest convenience.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

export const generateLetterToSuccessor = (): Checklist =>
  makeLetterChecklist('glt-2-5', 'Letter to a Successor (Corp)', 'Response to Successor Practitioner Inquiry', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Successor Firm Name')}<br/>${chip('Successor Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Successor Engagement Partner')},</p>
    <p class="mt-4 text-sm text-foreground">
      Thank you for your letter dated ${chip('Inquiry Date')} regarding your proposed appointment as practitioner
      for <strong>${chip('Entity Name')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground">
      In response to your inquiries, we advise as follows:
    </p>
    <p class="mt-3 text-sm text-foreground">
      1. We are not aware of any professional reasons why you should not accept this engagement.
    </p>
    <p class="mt-3 text-sm text-foreground">
      2. We are not aware of any matters bearing on the integrity of management that you should know about.
    </p>
    <p class="mt-3 text-sm text-foreground">
      3. There are ${chip('no / outstanding')} fees from prior engagements.
    </p>
    <p class="mt-3 text-sm text-foreground">
      4. There are ${chip('no / the following')} matters currently in dispute or unresolved: ${chip('Details or N/A')}.
    </p>
    <p class="mt-4 text-sm text-foreground">
      Please note that this response is provided solely for your information in connection with the above
      engagement and should not be used for any other purpose.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

export const generateRequestForManagementAssistance = (): Checklist =>
  makeLetterChecklist('glt-2-6', 'Request for Management Assistance (Corp)', 'Request for Management Assistance in Review Engagement', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Contact Name')}<br/>${chip('Entity Name')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Contact Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      In connection with our review of the financial statements of <strong>${chip('Entity Name')}</strong> for the year ended
      <strong>${chip('Year End Date')}</strong>, we require management's assistance in providing the following information
      and documentation:
    </p>
    <p class="mt-3 text-sm text-foreground">1. ${chip('Document / Information Request 1')}</p>
    <p class="mt-3 text-sm text-foreground">2. ${chip('Document / Information Request 2')}</p>
    <p class="mt-3 text-sm text-foreground">3. ${chip('Document / Information Request 3')}</p>
    <p class="mt-4 text-sm text-foreground">
      We would appreciate receiving the above information by <strong>${chip('Deadline Date')}</strong>. If you have any
      questions or require clarification, please do not hesitate to contact us.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
  `);

// ── Tax Letters ────────────────────────────────────────────────────────────────

export const generateTaxEngagementLetter = (): Checklist =>
  makeLetterChecklist('glt-3-1', 'Tax Engagement Letter', 'Tax Engagement Letter — Corporate', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Contact Name')}<br/>${chip('Entity Name')}<br/>${chip('Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Contact Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      We are pleased to confirm our engagement to provide tax services to <strong>${chip('Entity Name')}</strong> for the
      taxation year ended <strong>${chip('Taxation Year End')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Scope of Services</p>
    <p class="mt-2 text-sm text-foreground">
      The services to be provided include:
    </p>
    <p class="mt-2 text-sm text-foreground">• Preparation of the corporate income tax return (T2) for the year ended ${chip('Taxation Year End')};</p>
    <p class="mt-2 text-sm text-foreground">• ${chip('Additional Tax Services, if any')}.</p>
    <p class="mt-4 text-sm text-foreground font-semibold">Management's Responsibilities</p>
    <p class="mt-2 text-sm text-foreground">
      Management is responsible for providing us with complete and accurate information, maintaining adequate
      records, making all management decisions, and ensuring compliance with all applicable tax legislation.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Our Fees</p>
    <p class="mt-2 text-sm text-foreground">
      Our fees for these services will be ${chip('Fee Amount or Basis')}.
    </p>
    <p class="mt-4 text-sm text-foreground">
      If the contents of this letter are in accordance with your understanding, please sign and return the
      enclosed copy to confirm your acceptance.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

// ── Additional Letters ─────────────────────────────────────────────────────────

export const generateClosingCoverLetter = (): Checklist =>
  makeLetterChecklist('glt-4-1', 'Closing Cover Letter', 'Closing Cover Letter — transmitting financial statements', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Contact Name')}<br/>${chip('Entity Name')}<br/>${chip('Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Contact Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      Please find enclosed the financial statements of <strong>${chip('Entity Name')}</strong> for the year ended
      <strong>${chip('Year End Date')}</strong>, together with our ${chip('Compilation Report / Review Report / Auditor\'s Report')}.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We draw your attention to the following matters:
    </p>
    <p class="mt-3 text-sm text-foreground">${chip('Key Matter 1 — or delete if none')}</p>
    <p class="mt-3 text-sm text-foreground">${chip('Key Matter 2 — or delete if none')}</p>
    <p class="mt-4 text-sm text-foreground">
      If you have any questions regarding the enclosed financial statements, please do not hesitate to
      contact us at your convenience.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

export const generateLetterToLawyerLongForm = (): Checklist =>
  makeLetterChecklist('glt-4-2', 'Letter to Lawyer (Long Form)', 'Inquiry to Legal Counsel — Long Form', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Lawyer Name')}<br/>${chip('Law Firm Name')}<br/>${chip('Law Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Lawyer Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      We are engaged to ${chip('audit / review / compile')} the financial statements of
      <strong>${chip('Entity Name')}</strong> as at <strong>${chip('Year End Date')}</strong>. In connection with this
      engagement, management has authorized us to make this inquiry of you.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Scope of Inquiry</p>
    <p class="mt-2 text-sm text-foreground">
      Please provide us with information regarding all litigation, claims, and assessments to which the entity
      is a party as at ${chip('Year End Date')}, and through the date of your response, that you are aware of.
      For each matter, please indicate:
    </p>
    <p class="mt-2 text-sm text-foreground">a. A description of the nature of the matter;</p>
    <p class="mt-2 text-sm text-foreground">b. The current status of the matter;</p>
    <p class="mt-2 text-sm text-foreground">c. Your assessment of the likelihood of an unfavourable outcome (probable, possible, or remote);</p>
    <p class="mt-2 text-sm text-foreground">d. An estimate of the potential amount of loss, or range of loss, if the outcome is expected to be unfavourable.</p>
    <p class="mt-4 text-sm text-foreground">
      Please also advise if there are any matters, other than those identified above, that in your opinion
      should be disclosed in the financial statements.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We would appreciate your response by <strong>${chip('Response Deadline')}</strong>.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
  `);

export const generateLetterToLawyerShortForm = (): Checklist =>
  makeLetterChecklist('glt-4-3', 'Letter to Lawyer (Short Form)', 'Inquiry to Legal Counsel — Short Form', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Lawyer Name')}<br/>${chip('Law Firm Name')}<br/>${chip('Law Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Lawyer Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      We are engaged to ${chip('audit / review / compile')} the financial statements of
      <strong>${chip('Entity Name')}</strong> as at <strong>${chip('Year End Date')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground">
      Please confirm whether, as at ${chip('Year End Date')} and through the date of your response, you are
      aware of any litigation, claims, or assessments involving the entity, other than those already reflected
      in the financial statements or disclosed to us by management.
    </p>
    <p class="mt-4 text-sm text-foreground">
      If there are no such matters, please sign and return the enclosed copy of this letter. If there are
      matters, please provide the details described below.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We would appreciate your response by <strong>${chip('Response Deadline')}</strong>.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
  `);

export const generateLetterToPredecessorAccountant = (): Checklist =>
  makeLetterChecklist('glt-4-4', 'Letter to Predecessor Accountant', 'Communication to Predecessor Accountant', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Predecessor Firm Name')}<br/>${chip('Predecessor Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Predecessor Engagement Partner')},</p>
    <p class="mt-4 text-sm text-foreground">
      We have been engaged to perform ${chip('compilation / review / audit')} services for
      <strong>${chip('Entity Name')}</strong> for the year ended <strong>${chip('Year End Date')}</strong>. Prior to
      accepting this engagement, we wish to communicate with you as the predecessor practitioner.
    </p>
    <p class="mt-4 text-sm text-foreground">
      With the authorization of management, we request your response to the following:
    </p>
    <p class="mt-3 text-sm text-foreground">
      1. Are there any professional reasons, in your view, that would preclude us from accepting this engagement?
    </p>
    <p class="mt-3 text-sm text-foreground">
      2. Are there any matters relating to the integrity of management or significant disagreements that we
      should be aware of?
    </p>
    <p class="mt-3 text-sm text-foreground">
      3. Were there any unresolved accounting, auditing, or reporting matters at the end of your engagement?
    </p>
    <p class="mt-4 text-sm text-foreground">
      We would appreciate your prompt response.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

export const generateLetterToSuccessorAccountant = (): Checklist =>
  makeLetterChecklist('glt-4-5', 'Letter to Successor Accountant', 'Response to Successor Accountant Inquiry', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Successor Firm Name')}<br/>${chip('Successor Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Successor Engagement Partner')},</p>
    <p class="mt-4 text-sm text-foreground">
      We acknowledge receipt of your letter dated ${chip('Inquiry Date')} regarding the proposed engagement
      for <strong>${chip('Entity Name')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground">
      In response to your inquiries, we confirm as follows:
    </p>
    <p class="mt-3 text-sm text-foreground">
      1. We are not aware of any professional reasons that would preclude your acceptance of this engagement.
    </p>
    <p class="mt-3 text-sm text-foreground">
      2. We are not aware of matters relating to management's integrity that you should know about.
    </p>
    <p class="mt-3 text-sm text-foreground">
      3. ${chip('There were no unresolved matters / The following matters were unresolved:')} ${chip('Details or N/A')}.
    </p>
    <p class="mt-4 text-sm text-foreground">
      This response is provided solely for your information and should not be relied upon for any other purpose.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

// ── Audit Letters — Canada ─────────────────────────────────────────────────────

export const generateAuditEngagementLetterCASASPE = (): Checklist =>
  makeLetterChecklist('glt-ca-1', 'Audit Engagement Letter (CAS/ASPE)', 'CAS Audit Engagement Letter — ASPE Framework', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Contact Name')}<br/>${chip('Entity Name')}<br/>${chip('Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Contact Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      We are pleased to confirm our acceptance of the engagement to audit the financial statements of
      <strong>${chip('Entity Name')}</strong> for the year ended <strong>${chip('Year End Date')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Objective and Scope of the Audit</p>
    <p class="mt-2 text-sm text-foreground">
      The objective of our audit is to obtain reasonable assurance about whether the financial statements as a
      whole are free from material misstatement, whether due to fraud or error, and to issue an auditor's
      report that includes our opinion. Our audit will be conducted in accordance with <strong>Canadian Auditing
      Standards (CAS)</strong>. Those standards require that we comply with ethical requirements and plan and perform
      the audit to obtain reasonable assurance.
    </p>
    <p class="mt-4 text-sm text-foreground">
      The financial statements will be prepared in accordance with <strong>Accounting Standards for Private
      Enterprises (ASPE)</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Management's Responsibilities</p>
    <p class="mt-2 text-sm text-foreground">
      Management is responsible for the preparation and fair presentation of the financial statements in
      accordance with ASPE, and for such internal control as management determines is necessary to enable the
      preparation of financial statements that are free from material misstatement, whether due to fraud or error.
    </p>
    <p class="mt-2 text-sm text-foreground">
      Management is also responsible for providing us with:
    </p>
    <p class="mt-2 text-sm text-foreground">a. Access to all information of which management is aware that is relevant to the preparation of the financial statements;</p>
    <p class="mt-2 text-sm text-foreground">b. Additional information that we may request for the purpose of the audit; and</p>
    <p class="mt-2 text-sm text-foreground">c. Unrestricted access to persons within the entity from whom we determine it necessary to obtain audit evidence.</p>
    <p class="mt-4 text-sm text-foreground font-semibold">Auditor's Responsibilities</p>
    <p class="mt-2 text-sm text-foreground">
      Our responsibilities are to obtain reasonable assurance about whether the financial statements as a whole
      are free from material misstatement, whether due to fraud or error. Because of the inherent limitations of
      an audit, there is an unavoidable risk that some material misstatements may not be detected, even though
      the audit is properly planned and performed in accordance with CAS.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Other Relevant Information</p>
    <p class="mt-2 text-sm text-foreground">
      Our fees will be based on ${chip('Fee Basis')}. We will provide you with an estimate of our fees prior
      to completing the engagement.
    </p>
    <p class="mt-4 text-sm text-foreground">
      Please sign and return the attached copy of this letter to confirm your agreement with the terms of
      our engagement.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

export const generateAuditEngagementLetterCASASNPO = (): Checklist =>
  makeLetterChecklist('glt-ca-2', 'Audit Engagement Letter (CAS/ASNPO)', 'CAS Audit Engagement Letter — ASNPO Framework', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Contact Name')}<br/>${chip('Entity Name')}<br/>${chip('Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Contact Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      We are pleased to confirm our acceptance of the engagement to audit the financial statements of
      <strong>${chip('Entity Name')}</strong> for the year ended <strong>${chip('Year End Date')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Objective and Scope of the Audit</p>
    <p class="mt-2 text-sm text-foreground">
      Our audit will be conducted in accordance with <strong>Canadian Auditing Standards (CAS)</strong>. The objective
      of our audit is to obtain reasonable assurance about whether the financial statements are free from
      material misstatement and to issue an auditor's report.
    </p>
    <p class="mt-4 text-sm text-foreground">
      The financial statements will be prepared in accordance with <strong>Accounting Standards for Not-for-Profit
      Organizations (ASNPO)</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Governance's and Management's Responsibilities</p>
    <p class="mt-2 text-sm text-foreground">
      Those charged with governance and management are responsible for the preparation and fair presentation
      of the financial statements in accordance with ASNPO, and for such internal control as they determine
      is necessary to enable the preparation of financial statements that are free from material misstatement,
      whether due to fraud or error.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Auditor's Responsibilities</p>
    <p class="mt-2 text-sm text-foreground">
      Our responsibilities are to obtain reasonable assurance about whether the financial statements as a whole
      are free from material misstatement, whether due to fraud or error, and to issue an auditor's report.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Fees</p>
    <p class="mt-2 text-sm text-foreground">
      Our fees will be based on ${chip('Fee Basis')}.
    </p>
    <p class="mt-4 text-sm text-foreground">
      Please sign and return the enclosed copy to confirm your agreement.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

export const generateManagementRepLetterCAS580 = (): Checklist =>
  makeLetterChecklist('glt-ca-3', 'Management Representation Letter (CAS 580)', 'CAS 580 Management Representation Letter', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Firm Name')}<br/>${chip('Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Engagement Partner')},</p>
    <p class="mt-4 text-sm text-foreground">
      This representation letter is provided in connection with your audit of the financial statements of
      <strong>${chip('Entity Name')}</strong> for the year ended <strong>${chip('Year End Date')}</strong>, for the purpose of
      expressing an opinion on whether the financial statements are presented fairly, in all material respects,
      in accordance with <strong>${chip('Applicable Financial Reporting Framework')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We confirm that, to the best of our knowledge and belief:
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Financial Statements</p>
    <p class="mt-2 text-sm text-foreground">
      1. We have fulfilled our responsibilities, as set out in the terms of the audit engagement letter, for the
      preparation and fair presentation of the financial statements in accordance with
      ${chip('Applicable Financial Reporting Framework')}.
    </p>
    <p class="mt-2 text-sm text-foreground">
      2. Significant assumptions used by us in making accounting estimates are reasonable.
    </p>
    <p class="mt-2 text-sm text-foreground">
      3. Related party relationships and transactions have been appropriately accounted for and disclosed.
    </p>
    <p class="mt-2 text-sm text-foreground">
      4. All events subsequent to the date of the financial statements and for which accounting standards require
      adjustment or disclosure have been adjusted or disclosed.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Information Provided</p>
    <p class="mt-2 text-sm text-foreground">
      5. We have provided you with all information relevant to the preparation of the financial statements, access
      to all information of which we are aware that is relevant to the preparation of the financial statements,
      and unrestricted access to all persons within the entity.
    </p>
    <p class="mt-2 text-sm text-foreground">
      6. All transactions have been recorded in the accounting records and are reflected in the financial statements.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Fraud</p>
    <p class="mt-2 text-sm text-foreground">
      7. We have disclosed to you: (a) the results of our assessment of the risk that the financial statements may
      be materially misstated as a result of fraud; (b) our knowledge of fraud or suspected fraud involving
      management, employees with significant roles in internal control, or others where the fraud could have a
      material effect on the financial statements; and (c) our knowledge of any allegations of fraud or suspected
      fraud affecting the entity's financial statements.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Litigation and Claims</p>
    <p class="mt-2 text-sm text-foreground">
      8. We have disclosed to you all known actual or possible litigation and claims whose effects should be
      considered when preparing the financial statements, and we have appropriately accounted for and disclosed
      such matters in accordance with ${chip('Applicable Financial Reporting Framework')}.
    </p>
    <p class="mt-6 text-sm text-foreground">
      <strong>${chip('Authorized Signatory (CEO/CFO)')}</strong><br/>
      ${chip('Title')}<br/>
      ${chip('Entity Name')}<br/>
      ${chip('Date')}
    </p>
  `);

export const generateCommunicationTCWGPlanning = (): Checklist =>
  makeLetterChecklist('glt-ca-4', 'Communication with Those Charged with Governance — Planning (CAS 260)', 'CAS 260 Planning Communication to Those Charged with Governance', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">COMMUNICATION WITH THOSE CHARGED WITH GOVERNANCE — PLANNING</p>
    <p class="mt-4 text-sm text-foreground">
      To the Board of Directors (or Audit Committee) of <strong>${chip('Entity Name')}</strong>:
    </p>
    <p class="mt-4 text-sm text-foreground">
      In accordance with <strong>Canadian Auditing Standard (CAS) 260</strong>, we are providing you with an
      overview of the planned scope and timing of our audit for the year ended <strong>${chip('Year End Date')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Overview of the Planned Audit Scope</p>
    <p class="mt-2 text-sm text-foreground">
      Our audit will be conducted in accordance with Canadian Auditing Standards. We have planned our audit
      based on our preliminary assessment of the entity's control environment and risk of material misstatement.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Significant Risks Identified</p>
    <p class="mt-2 text-sm text-foreground">
      Based on our preliminary risk assessment, we have identified the following significant risks that require
      special audit consideration:
    </p>
    <p class="mt-2 text-sm text-foreground">• ${chip('Significant Risk 1')}</p>
    <p class="mt-2 text-sm text-foreground">• ${chip('Significant Risk 2')}</p>
    <p class="mt-4 text-sm text-foreground font-semibold">Materiality</p>
    <p class="mt-2 text-sm text-foreground">
      We have determined overall materiality for the financial statements as a whole to be
      <strong>${chip('Materiality Amount')}</strong>. Performance materiality has been set at
      <strong>${chip('Performance Materiality Amount')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Audit Timeline</p>
    <p class="mt-2 text-sm text-foreground">
      Fieldwork is planned to commence on <strong>${chip('Fieldwork Start Date')}</strong> and we anticipate
      completing the audit by <strong>${chip('Expected Completion Date')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Engagement Team</p>
    <p class="mt-2 text-sm text-foreground">
      The engagement partner is <strong>${chip('Engagement Partner')}</strong>. The engagement manager is
      <strong>${chip('Engagement Manager')}</strong>.
    </p>
    <p class="mt-6 text-sm text-foreground">Respectfully submitted,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('Date')}</p>
  `);

export const generateCommunicationTCWGFinal = (): Checklist =>
  makeLetterChecklist('glt-ca-5', 'Communication with Those Charged with Governance — Final (CAS 260)', 'CAS 260 Final Communication to Those Charged with Governance', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">COMMUNICATION WITH THOSE CHARGED WITH GOVERNANCE — FINAL</p>
    <p class="mt-4 text-sm text-foreground">
      To the Board of Directors (or Audit Committee) of <strong>${chip('Entity Name')}</strong>:
    </p>
    <p class="mt-4 text-sm text-foreground">
      In accordance with <strong>Canadian Auditing Standard (CAS) 260</strong>, we are providing you with
      the results of our audit of the financial statements for the year ended <strong>${chip('Year End Date')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Our Responsibilities</p>
    <p class="mt-2 text-sm text-foreground">
      Our responsibility was to plan and perform an audit designed to obtain reasonable assurance about
      whether the financial statements are free from material misstatement and to issue an auditor's report.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Significant Findings from the Audit</p>
    <p class="mt-2 text-sm text-foreground">
      We are required to communicate the following significant findings arising from the audit:
    </p>
    <p class="mt-2 text-sm text-foreground">
      <strong>Significant accounting policies:</strong> ${chip('Summary of significant accounting policies or "No changes from prior year"')}
    </p>
    <p class="mt-2 text-sm text-foreground">
      <strong>Significant accounting estimates:</strong> ${chip('Key estimates subject to significant judgment')}
    </p>
    <p class="mt-2 text-sm text-foreground">
      <strong>Significant difficulties encountered:</strong> ${chip('None / Describe difficulties')}
    </p>
    <p class="mt-2 text-sm text-foreground">
      <strong>Significant matters discussed with management:</strong> ${chip('Describe or "None"')}
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Uncorrected Misstatements</p>
    <p class="mt-2 text-sm text-foreground">
      ${chip('There were no uncorrected misstatements / The following uncorrected misstatements are noted:')}
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Independence</p>
    <p class="mt-2 text-sm text-foreground">
      We confirm that we are independent with respect to <strong>${chip('Entity Name')}</strong> within the meaning of
      the relevant rules and related interpretations prescribed by the relevant professional bodies in Canada.
    </p>
    <p class="mt-6 text-sm text-foreground">Respectfully submitted,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('Date')}</p>
  `);

export const generateInquiryToLegalCounselCA = (): Checklist =>
  makeLetterChecklist('glt-ca-6', "Inquiry to Legal Counsel (Lawyer's Letter)", "CAS — Inquiry to Legal Counsel (Lawyer's Letter)", `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Lawyer Name')}<br/>${chip('Law Firm Name')}<br/>${chip('Law Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Lawyer Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      We are the auditors of <strong>${chip('Entity Name')}</strong> and are currently conducting an audit of the financial
      statements as at <strong>${chip('Year End Date')}</strong>. Management has authorized us to make this inquiry.
    </p>
    <p class="mt-4 text-sm text-foreground">
      In connection with the preparation of the financial statements, we request that you provide us with the
      following information:
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">1. Litigation, Claims, and Assessments</p>
    <p class="mt-2 text-sm text-foreground">
      Please provide a list of all litigation, claims, and assessments as at ${chip('Year End Date')} to which
      the entity is a party, to which your attention has been directed in the course of providing legal
      services during the period from ${chip('Period Start Date')} to ${chip('Year End Date')}. For each such
      matter, please provide:
    </p>
    <p class="mt-2 text-sm text-foreground">a. A description of the nature of the matter and the issues involved;</p>
    <p class="mt-2 text-sm text-foreground">b. The current status;</p>
    <p class="mt-2 text-sm text-foreground">c. Your assessment of the likely outcome and, if estimable, the amount of potential loss or range of loss;</p>
    <p class="mt-2 text-sm text-foreground">d. The extent to which a loss, if any, would be covered by insurance.</p>
    <p class="mt-4 text-sm text-foreground font-semibold">2. Unasserted Claims</p>
    <p class="mt-2 text-sm text-foreground">
      Please advise us of any unasserted claims or assessments you consider to be probable of assertion that,
      if asserted, would have at least a reasonable possibility of an unfavourable outcome.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">3. Completeness Confirmation</p>
    <p class="mt-2 text-sm text-foreground">
      Please confirm that the list of matters provided is complete, or advise us accordingly.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We would appreciate your response by <strong>${chip('Response Deadline')}</strong>.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

export const generateCommunicationToPredecessorAuditorCA = (): Checklist =>
  makeLetterChecklist('glt-ca-7', 'Communication to Predecessor Auditor', 'CAS — Communication to Predecessor Auditor', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Predecessor Firm Name')}<br/>${chip('Predecessor Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Predecessor Engagement Partner')},</p>
    <p class="mt-4 text-sm text-foreground">
      We have been engaged to audit the financial statements of <strong>${chip('Entity Name')}</strong> for the year ended
      <strong>${chip('Year End Date')}</strong>. In accordance with <strong>CAS 510, Initial Audit Engagements — Opening
      Balances</strong>, we are required to communicate with the predecessor auditor.
    </p>
    <p class="mt-4 text-sm text-foreground">
      Management has authorized us to communicate with you. We request your assistance with the following:
    </p>
    <p class="mt-3 text-sm text-foreground">
      1. Please advise us if you are aware of any professional reasons why we should not accept this appointment.
    </p>
    <p class="mt-3 text-sm text-foreground">
      2. Please advise us of any matters bearing on the integrity of management.
    </p>
    <p class="mt-3 text-sm text-foreground">
      3. Please advise us of any significant disagreements with management regarding accounting principles,
      the application of auditing standards, or similarly significant matters.
    </p>
    <p class="mt-3 text-sm text-foreground">
      4. Please advise whether you would permit us to review your audit working papers for the prior year.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We would appreciate your prompt response.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
  `);

export const generateLetterToManagementSignificantDeficienciesCA = (): Checklist =>
  makeLetterChecklist('glt-ca-8', 'Letter to Management — Significant Deficiencies (CAS 265)', 'CAS 265 Communication of Significant Deficiencies to Management', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">COMMUNICATION OF SIGNIFICANT DEFICIENCIES IN INTERNAL CONTROL</p>
    <p class="mt-4 text-sm text-foreground">
      To the Management of <strong>${chip('Entity Name')}</strong>:
    </p>
    <p class="mt-4 text-sm text-foreground">
      In planning and performing our audit of the financial statements of <strong>${chip('Entity Name')}</strong> for the
      year ended <strong>${chip('Year End Date')}</strong> in accordance with <strong>Canadian Auditing Standards</strong>, we
      considered the entity's internal control over financial reporting as a basis for designing our audit
      procedures for the purpose of expressing our opinion on the financial statements, but not for the purpose
      of expressing an opinion on the effectiveness of internal control.
    </p>
    <p class="mt-4 text-sm text-foreground">
      In connection with our audit, we have identified the following significant deficiencies in internal
      control that we are required to communicate to management and, where applicable, to those charged with
      governance in accordance with <strong>CAS 265, Communicating Deficiencies in Internal Control</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Significant Deficiencies</p>
    <p class="mt-2 text-sm text-foreground font-semibold">Deficiency 1: ${chip('Deficiency Title')}</p>
    <p class="mt-1 text-sm text-foreground"><em>Observation:</em> ${chip('Describe the deficiency observed')}</p>
    <p class="mt-1 text-sm text-foreground"><em>Risk:</em> ${chip('Describe the risk posed by this deficiency')}</p>
    <p class="mt-1 text-sm text-foreground"><em>Recommendation:</em> ${chip('Describe recommended corrective action')}</p>
    <p class="mt-4 text-sm text-foreground">
      This communication is intended solely for the information and use of management and those charged with
      governance of <strong>${chip('Entity Name')}</strong> and is not intended to be and should not be used by anyone
      other than these specified parties.
    </p>
    <p class="mt-6 text-sm text-foreground">Yours truly,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, Province')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('Date')}</p>
  `);

// ── Audit Letters — United States ──────────────────────────────────────────────

export const generateAuditEngagementLetterGAASUSGAAP = (): Checklist =>
  makeLetterChecklist('glt-us-1', 'Audit Engagement Letter (GAAS/US GAAP)', 'GAAS Audit Engagement Letter — US GAAP Framework', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Contact Name')}<br/>${chip('Entity Name')}<br/>${chip('Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Contact Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      We are pleased to confirm our acceptance of the engagement to audit the financial statements of
      <strong>${chip('Entity Name')}</strong> as of and for the year ended <strong>${chip('Year End Date')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Objective and Scope of the Audit</p>
    <p class="mt-2 text-sm text-foreground">
      Our audit will be conducted in accordance with <strong>auditing standards generally accepted in the United
      States of America (GAAS)</strong>, as established by the Auditing Standards Board of the American Institute of
      Certified Public Accountants. Our objective is to obtain reasonable assurance about whether the financial
      statements are free from material misstatement and to express an opinion.
    </p>
    <p class="mt-4 text-sm text-foreground">
      The financial statements are to be prepared in accordance with <strong>accounting principles generally accepted
      in the United States of America (US GAAP)</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Management's Responsibilities</p>
    <p class="mt-2 text-sm text-foreground">
      Management is responsible for (1) the preparation and fair presentation of these financial statements in
      accordance with US GAAP; (2) the design, implementation, and maintenance of internal control relevant to
      the preparation of financial statements that are free from material misstatement, whether due to fraud or
      error; and (3) providing us with all information and access necessary to perform our audit.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Auditor's Responsibilities</p>
    <p class="mt-2 text-sm text-foreground">
      Our responsibility is to express an opinion on the financial statements based on our audit conducted in
      accordance with GAAS. GAAS requires that we plan and perform the audit to obtain reasonable assurance
      about whether the financial statements are free from material misstatement.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Fees</p>
    <p class="mt-2 text-sm text-foreground">
      Our fees will be based on ${chip('Fee Basis')}.
    </p>
    <p class="mt-4 text-sm text-foreground">
      Please sign and return the enclosed copy of this letter to confirm your agreement with the terms
      described herein.
    </p>
    <p class="mt-6 text-sm text-foreground">Very truly yours,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, State')}</p>
  `);

export const generateManagementRepLetterAUC580 = (): Checklist =>
  makeLetterChecklist('glt-us-2', 'Management Representation Letter (AU-C 580)', 'AU-C 580 Written Representations Letter', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Firm Name')}<br/>${chip('Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Engagement Partner')},</p>
    <p class="mt-4 text-sm text-foreground">
      This representation letter is provided in connection with your audit of the financial statements of
      <strong>${chip('Entity Name')}</strong> as of and for the year ended <strong>${chip('Year End Date')}</strong>, for the
      purpose of expressing an opinion on whether the financial statements are presented fairly, in all material
      respects, in accordance with <strong>accounting principles generally accepted in the United States of America
      (US GAAP)</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground">
      We confirm that, to the best of our knowledge and belief, having made such inquiries as we considered
      necessary for the purpose of appropriately informing ourselves:
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Financial Statements</p>
    <p class="mt-2 text-sm text-foreground">
      1. We have fulfilled our responsibilities, as set out in the terms of the audit engagement letter, for
      the preparation and fair presentation of the financial statements in conformity with US GAAP.
    </p>
    <p class="mt-2 text-sm text-foreground">
      2. We acknowledge our responsibility for the design, implementation, and maintenance of internal controls
      relevant to the preparation of financial statements that are free from material misstatement, whether
      due to fraud or error.
    </p>
    <p class="mt-2 text-sm text-foreground">
      3. We believe the effects of any uncorrected misstatements are immaterial, both individually and in the
      aggregate, to the financial statements as a whole. A schedule of uncorrected misstatements is attached.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Fraud</p>
    <p class="mt-2 text-sm text-foreground">
      4. We have disclosed to you the results of our assessment of the risk that the financial statements may be
      materially misstated as a result of fraud.
    </p>
    <p class="mt-2 text-sm text-foreground">
      5. We have no knowledge of any fraud or suspected fraud affecting the entity involving management,
      employees with significant roles in internal control, or others where the fraud could have a material
      effect on the financial statements.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Litigation and Claims</p>
    <p class="mt-2 text-sm text-foreground">
      6. We have disclosed to you all known actual or possible litigation and claims whose effects should be
      considered when preparing the financial statements, and have appropriately accounted for and disclosed
      such matters.
    </p>
    <p class="mt-6 text-sm text-foreground">
      <strong>${chip('Authorized Signatory (CEO/CFO)')}</strong><br/>
      ${chip('Title')}<br/>
      ${chip('Entity Name')}<br/>
      ${chip('Date')}
    </p>
  `);

export const generateCommunicationTCWGPlanningUS = (): Checklist =>
  makeLetterChecklist('glt-us-3', 'Communication with Those Charged with Governance — Planning (AU-C 260)', 'AU-C 260 Planning Communication to Those Charged with Governance', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">COMMUNICATION WITH THOSE CHARGED WITH GOVERNANCE — PLANNING</p>
    <p class="mt-4 text-sm text-foreground">
      To the Board of Directors (or Audit Committee) of <strong>${chip('Entity Name')}</strong>:
    </p>
    <p class="mt-4 text-sm text-foreground">
      In accordance with <strong>AU-C Section 260</strong>, we are providing an overview of the planned scope and
      timing of our audit of the financial statements for the year ended <strong>${chip('Year End Date')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Overview of the Planned Audit Scope</p>
    <p class="mt-2 text-sm text-foreground">
      Our audit will be conducted in accordance with auditing standards generally accepted in the United States
      of America. We have planned our audit based on our risk assessment of the entity.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Significant Risks</p>
    <p class="mt-2 text-sm text-foreground">
      We have identified the following risks of material misstatement requiring special audit consideration:
    </p>
    <p class="mt-2 text-sm text-foreground">• ${chip('Significant Risk 1')}</p>
    <p class="mt-2 text-sm text-foreground">• ${chip('Significant Risk 2')}</p>
    <p class="mt-4 text-sm text-foreground font-semibold">Materiality</p>
    <p class="mt-2 text-sm text-foreground">
      Overall materiality: <strong>${chip('Materiality Amount')}</strong>. Performance materiality:
      <strong>${chip('Performance Materiality Amount')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Timeline</p>
    <p class="mt-2 text-sm text-foreground">
      Fieldwork is scheduled to begin <strong>${chip('Fieldwork Start Date')}</strong> with completion expected by
      <strong>${chip('Expected Completion Date')}</strong>.
    </p>
    <p class="mt-6 text-sm text-foreground">Respectfully submitted,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, State')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('Date')}</p>
  `);

export const generateCommunicationTCWGFinalUS = (): Checklist =>
  makeLetterChecklist('glt-us-4', 'Communication with Those Charged with Governance — Final (AU-C 260)', 'AU-C 260 Final Communication to Those Charged with Governance', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">COMMUNICATION WITH THOSE CHARGED WITH GOVERNANCE — FINAL</p>
    <p class="mt-4 text-sm text-foreground">
      To the Board of Directors (or Audit Committee) of <strong>${chip('Entity Name')}</strong>:
    </p>
    <p class="mt-4 text-sm text-foreground">
      In accordance with <strong>AU-C Section 260</strong>, we are providing the following communication regarding
      the results of our audit of the financial statements for the year ended <strong>${chip('Year End Date')}</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Significant Findings</p>
    <p class="mt-2 text-sm text-foreground">
      <strong>Significant accounting policies:</strong> ${chip('Summary or "No changes noted"')}
    </p>
    <p class="mt-2 text-sm text-foreground">
      <strong>Significant accounting estimates:</strong> ${chip('Key judgments or areas of estimation uncertainty')}
    </p>
    <p class="mt-2 text-sm text-foreground">
      <strong>Significant difficulties:</strong> ${chip('None / Describe')}
    </p>
    <p class="mt-2 text-sm text-foreground">
      <strong>Uncorrected misstatements:</strong> ${chip('None / See Schedule A')}
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Independence</p>
    <p class="mt-2 text-sm text-foreground">
      We confirm that we are independent with respect to <strong>${chip('Entity Name')}</strong> in accordance with
      relevant ethical requirements regarding independence.
    </p>
    <p class="mt-6 text-sm text-foreground">Respectfully submitted,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, State')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('Date')}</p>
  `);

export const generateInquiryToLegalCounselUS = (): Checklist =>
  makeLetterChecklist('glt-us-5', 'Inquiry to Legal Counsel', 'GAAS — Inquiry to Legal Counsel', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Attorney Name')}<br/>${chip('Law Firm Name')}<br/>${chip('Law Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Attorney Name')},</p>
    <p class="mt-4 text-sm text-foreground">
      We are auditors for <strong>${chip('Entity Name')}</strong> and are engaged in an audit of the financial statements
      as of <strong>${chip('Year End Date')}</strong>. Management has authorized this inquiry.
    </p>
    <p class="mt-4 text-sm text-foreground">
      In connection with the preparation of financial statements in conformity with US GAAP, management has
      described the following loss contingencies as of <strong>${chip('Year End Date')}</strong>. Please furnish us with
      the information requested below concerning each of these loss contingencies.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Pending or Threatened Litigation and Claims</p>
    <p class="mt-2 text-sm text-foreground">
      Management's description: ${chip('List of matters or "See attached management schedule"')}
    </p>
    <p class="mt-4 text-sm text-foreground">
      For each matter, please advise us:
    </p>
    <p class="mt-2 text-sm text-foreground">a. A description and the current status;</p>
    <p class="mt-2 text-sm text-foreground">b. The likelihood of an unfavourable outcome (probable, reasonably possible, or remote);</p>
    <p class="mt-2 text-sm text-foreground">c. An estimate of the amount or range of potential loss;</p>
    <p class="mt-2 text-sm text-foreground">d. Whether the list represents a complete list of such matters, or whether there are matters known to you that should be added.</p>
    <p class="mt-4 text-sm text-foreground">
      Please respond by <strong>${chip('Response Deadline')}</strong>.
    </p>
    <p class="mt-6 text-sm text-foreground">Very truly yours,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, State')}</p>
  `);

export const generateLetterToManagementSignificantDeficienciesUS = (): Checklist =>
  makeLetterChecklist('glt-us-6', 'Letter to Management — Significant Deficiencies (AU-C 265)', 'AU-C 265 Communication of Significant Deficiencies to Management', `
    <p class="text-sm text-foreground font-semibold text-center mt-2">COMMUNICATION OF SIGNIFICANT DEFICIENCIES AND MATERIAL WEAKNESSES IN INTERNAL CONTROL</p>
    <p class="mt-4 text-sm text-foreground">
      To Management of <strong>${chip('Entity Name')}</strong>:
    </p>
    <p class="mt-4 text-sm text-foreground">
      In planning and performing our audit of the financial statements of <strong>${chip('Entity Name')}</strong> as of
      and for the year ended <strong>${chip('Year End Date')}</strong> in accordance with auditing standards generally
      accepted in the United States of America, we considered the entity's internal control over financial
      reporting (ICFR) as a basis for designing our audit procedures.
    </p>
    <p class="mt-4 text-sm text-foreground">
      In connection with our audit, we noted the following matter(s) involving the entity's internal control
      that we consider to be a significant deficiency as defined under <strong>AU-C Section 265</strong>.
    </p>
    <p class="mt-4 text-sm text-foreground font-semibold">Significant Deficiency: ${chip('Deficiency Title')}</p>
    <p class="mt-2 text-sm text-foreground"><em>Condition:</em> ${chip('Describe the condition observed')}</p>
    <p class="mt-2 text-sm text-foreground"><em>Criteria:</em> ${chip('Relevant control standard or policy')}</p>
    <p class="mt-2 text-sm text-foreground"><em>Cause:</em> ${chip('Root cause of the deficiency')}</p>
    <p class="mt-2 text-sm text-foreground"><em>Effect:</em> ${chip('Potential effect on financial reporting')}</p>
    <p class="mt-2 text-sm text-foreground"><em>Recommendation:</em> ${chip('Suggested corrective action')}</p>
    <p class="mt-4 text-sm text-foreground">
      This communication is intended solely for the information and use of management and those charged with
      governance of <strong>${chip('Entity Name')}</strong> and is not intended to be and should not be used by anyone
      other than these specified parties.
    </p>
    <p class="mt-6 text-sm text-foreground">Very truly yours,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, State')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('Date')}</p>
  `);

export const generateCommunicationToPredecessorAuditorUS = (): Checklist =>
  makeLetterChecklist('glt-us-7', 'Communication to Predecessor Auditor (AU-C 210)', 'AU-C 210 — Communication to Predecessor Auditor', `
    <p class="text-sm text-foreground">${chip('Date')}</p>
    <p class="mt-6 text-sm text-foreground">${chip('Predecessor Firm Name')}<br/>${chip('Predecessor Firm Address')}</p>
    <p class="mt-6 text-sm text-foreground">Dear ${chip('Predecessor Engagement Partner')},</p>
    <p class="mt-4 text-sm text-foreground">
      We have been engaged to audit the financial statements of <strong>${chip('Entity Name')}</strong> as of and for the
      year ended <strong>${chip('Year End Date')}</strong>. In accordance with <strong>AU-C Section 210</strong>, we are
      required to communicate with the predecessor auditor prior to accepting this engagement.
    </p>
    <p class="mt-4 text-sm text-foreground">
      With the permission of management, we respectfully request your responses to the following:
    </p>
    <p class="mt-3 text-sm text-foreground">
      1. Are there any matters that you believe we should consider before accepting this engagement?
    </p>
    <p class="mt-3 text-sm text-foreground">
      2. Were there any significant disagreements with management concerning accounting principles, the scope of
      the audit, or other significant matters?
    </p>
    <p class="mt-3 text-sm text-foreground">
      3. Were there any fraud risk factors or instances of fraud identified during your engagement?
    </p>
    <p class="mt-3 text-sm text-foreground">
      4. Would you permit us to review your working papers for the prior year, specifically relating to opening
      balances and significant accounting matters?
    </p>
    <p class="mt-4 text-sm text-foreground">
      We appreciate your cooperation and look forward to your response.
    </p>
    <p class="mt-6 text-sm text-foreground">Very truly yours,</p>
    <p class="mt-4 text-sm text-foreground">${chip('Firm Name')}</p>
    <p class="mt-1 text-sm text-foreground">${chip('City, State')}</p>
  `);

// ── Audit Worksheet – Withdrawal (Canada) ────────────────────────────────────
export const generateAuditWorksheetWithdrawalCA = (): Checklist => {
  const sections: Section[] = [
    {
      id: 's-wdca-1',
      title: 'Document Reasoning and Conclusions',
      isExpanded: true,
      questions: [
        {
          id: 'q-wdca-1',
          text: '<p><strong>1.</strong> Document the reason for your withdrawal, the actions taken and discussions with management, including any of the following situations:</p>',
          answerType: 'none',
          required: false,
          subQuestions: [
            { id: 'q-wdca-1a', text: '<p>a. Reasonable assurance cannot be obtained (such as a failure to achieve an objective in a relevant CAS) and: i. A qualified opinion in the auditor\'s report is insufficient. ii. The auditor did not disclaim an opinion. (CAS 200.12)</p>', answerType: 'none', required: false },
            { id: 'q-wdca-1b', text: '<p>b. Where there has been a change in the terms of the engagement that the auditor does not agree with, and the auditor is not permitted by management to continue with the original audit engagement. (CAS 210.17(a))</p>', answerType: 'none', required: false },
            { id: 'q-wdca-1c', text: '<p>c. Appropriate actions could not be taken to eliminate or reduce threats to independence. (CAS 220.C11(Cc))</p>', answerType: 'none', required: false },
            { id: 'q-wdca-1d', text: '<p>d. An exceptional circumstance exists as a result of a misstatement resulting from fraud or suspected fraud. The auditor is therefore unable to continue performing the audit. (CAS 240.39, A55)</p>', answerType: 'none', required: false },
            { id: 'q-wdca-1e', text: '<p>e. Identified or suspected non-compliance with laws or regulations, which: i. Have not been remediated by management or TCWG. ii. Raises questions about the integrity of management or TCWG. (CAS 250.A25)</p>', answerType: 'none', required: false },
            { id: 'q-wdca-1f', text: '<p>f. Two-way communication between the auditor and TCWG is inadequate and cannot be resolved. (CAS 260.A53)</p>', answerType: 'none', required: false },
            { id: 'q-wdca-1g', text: '<p>g. There is a significant risk of management misrepresentation in the financial statements. An audit cannot be continued when there are concerns about the competence, integrity, ethical values or diligence of management. (CAS 580.A24)</p>', answerType: 'none', required: false },
            { id: 'q-wdca-1h', text: '<p>h. The auditor\'s understanding and evaluation of the control environment and other components of the entity\'s system of internal control raises doubts about the auditor\'s ability to obtain sufficient and appropriate audit evidence. (CAS 315.A198)</p>', answerType: 'none', required: false },
            { id: 'q-wdca-1i', text: '<p>i. In a group engagement, the group engagement partner concludes that: i. It will not be possible for the group engagement team to obtain sufficient appropriate audit evidence due to restrictions imposed by group management. ii. The possible effect will result in a disclaimer of opinion on the group financial statements. (CAS 600.13)</p>', answerType: 'none', required: false },
            { id: 'q-wdca-1j', text: '<p>j. The possible effects on the financial statements of undetected misstatements, if any, could be both material and pervasive. As a result, a qualification of the audit opinion would be inadequate to communicate the gravity of the situation. (CAS 705.13(b))</p>', answerType: 'none', required: false },
            { id: 'q-wdca-1k', text: '<p>k. A material misstatement exists in other information obtained prior to the date of the auditor\'s report. This misstatement remains uncorrected after communicating with those charged with governance. (CAS 720.18)</p>', answerType: 'none', required: false },
          ],
        },
        {
          id: 'q-wdca-2',
          text: '<p><strong>2.</strong> Document whether the firm is permitted to withdraw from the engagement based on:</p>',
          answerType: 'none',
          required: false,
          subQuestions: [
            { id: 'q-wdca-2a', text: '<p>a. The applicable provincial Code of Professional Conduct / Code of Ethics.</p>', answerType: 'none', required: false },
            { id: 'q-wdca-2b', text: '<p>b. The firm\'s quality control policies and procedures.</p>', answerType: 'none', required: false },
          ],
        },
        {
          id: 'q-wdca-3',
          text: '<p><strong>3.</strong> Communicate the reason(s) for withdrawing from the engagement. Include a copy of the communication in the working papers along with management\'s response, if any.</p>',
          answerType: 'none',
          required: false,
        },
      ],
    },
  ];
  return {
    id: 'audit-worksheet-withdrawal-ca',
    title: 'Withdrawal (Canada)',
    objective: 'To document situations where withdrawal from an audit engagement is the appropriate conclusion. WARNING: Withdrawal from an audit engagement is not always possible. Prior to withdrawal: 1. Refer to your provincial Code of Professional Conduct / Code of Ethics to ensure that withdrawal is permitted. 2. Consider obtaining advice from your lawyer and insurance company.',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Procedure',
      col3Editable: false,
      col4Label: 'PSC? (Y/N)',
      col4Options: ['Y', 'N', 'N/A'],
      col5Label: 'Document the reasoning, discussions and conclusions reached',
    },
  };
};

// ── Audit Worksheet – Notes on Significant Audit Decisions (Canada) ──────────
export const generateAuditWorksheetSignificantDecisionsCA = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-sdca-1',
      title: 'Notes on Significant Audit Decisions',
      isExpanded: true,
      questions: [
        row('q-sdca-r1'), row('q-sdca-r2'), row('q-sdca-r3'), row('q-sdca-r4'), row('q-sdca-r5'),
        row('q-sdca-r6'), row('q-sdca-r7'), row('q-sdca-r8'), row('q-sdca-r9'), row('q-sdca-r10'),
      ],
    },
    {
      id: 's-sdca-conc',
      title: 'Conclusion',
      isExpanded: true,
      questions: [row('q-sdca-conc')],
    },
  ];
  return {
    id: 'audit-worksheet-significant-decisions-ca',
    title: 'Notes on Significant Audit Decisions (Canada)',
    objective: 'To document the nature of and basis for significant audit decisions made during the engagement, including the basis for professional judgments. (CAS 230)',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Significant decision or matter',
      col3Editable: true,
      col4Label: 'Disposition',
      col4Options: ['Concluded', 'Referred', 'Pending'],
      col5Label: 'Basis for decision and conclusion reached',
    },
  };
};

// ── Audit Worksheet – Key Audit Matters (Canada – CAS 701) ───────────────────
export const generateAuditWorksheetKeyAuditMattersCA = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-kamca-1',
      title: 'Key Audit Matters',
      isExpanded: true,
      questions: [
        row('q-kamca-r1'), row('q-kamca-r2'), row('q-kamca-r3'), row('q-kamca-r4'),
        row('q-kamca-r5'), row('q-kamca-r6'), row('q-kamca-r7'), row('q-kamca-r8'),
      ],
    },
    {
      id: 's-kamca-conc',
      title: 'Conclusion',
      isExpanded: true,
      questions: [row('q-kamca-conc')],
    },
  ];
  return {
    id: 'audit-worksheet-key-audit-matters-ca',
    title: 'Key Audit Matters (Canada – CAS 701)',
    objective: "To document key audit matters that the auditor decides (or is required) to communicate in the auditor's report in accordance with CAS 701. Key audit matters are selected from matters communicated to those charged with governance. Remember to communicate each key audit matter selected for inclusion in the audit report with those charged with governance.",
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Description of the key audit matter',
      col3Editable: true,
      col4Label: 'Significance',
      col4Options: ['Highest', 'Significant', 'Moderate', 'Not a KAM'],
      col5Label: 'Manner addressed in the audit',
    },
  };
};

// ── Audit Worksheet – Audit Findings and Matters for Discussion (Canada) ─────
export const generateAuditWorksheetFindingsCA = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-findca-1',
      title: 'Audit Findings',
      isExpanded: true,
      questions: [
        row('q-findca-r1'), row('q-findca-r2'), row('q-findca-r3'), row('q-findca-r4'),
        row('q-findca-r5'), row('q-findca-r6'), row('q-findca-r7'), row('q-findca-r8'),
        row('q-findca-r9'), row('q-findca-r10'), row('q-findca-r11'), row('q-findca-r12'),
      ],
    },
    {
      id: 's-findca-conc',
      title: 'Conclusion',
      isExpanded: true,
      questions: [row('q-findca-conc')],
    },
  ];
  return {
    id: 'audit-worksheet-findings-ca',
    title: 'Audit Findings and Matters for Discussion (Canada)',
    objective: 'To record audit findings (matters identified during the audit as a result of performing audit procedures) and how they were resolved. (Refer to Vol. 1, Ch. 35, Two-Way Communication, and Vol. 2, Ch. 18, Step 8 — Perform Planned Procedures, for further guidance.)',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Audit finding (such as possible bias in an estimate)',
      col3Editable: true,
      col4Label: 'Status',
      col4Options: ['Open', 'Resolved', 'Not applicable'],
      col5Label: 'Suggested resolution / Actual resolution reached and the reasoning',
    },
  };
};

// ── Audit Worksheet – Summary of Identified Misstatements (Canada) ────────────
export const generateAuditWorksheetSummaryMisstatementsCA = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-smca-a',
      title: 'A — Proposed Adjustments (Identified by Auditor)',
      isExpanded: true,
      questions: [
        row('q-smca-a1'), row('q-smca-a2'), row('q-smca-a3'), row('q-smca-a4'),
        row('q-smca-a5'), row('q-smca-a6'), row('q-smca-a7'), row('q-smca-a8'),
      ],
    },
    {
      id: 's-smca-b',
      title: 'B — Evaluation of Misstatements',
      isExpanded: true,
      questions: [
        {
          id: 'q-smca-ev1',
          text: '<p>Revise the overall materiality for any new information obtained and describe the new information. Consider changes in financial statement users, operations and financial results.</p>',
          answerType: 'none',
          required: false,
        },
        row('q-smca-ev2'),
      ],
    },
    {
      id: 's-smca-conc',
      title: 'Conclusion',
      isExpanded: true,
      questions: [
        {
          id: 'q-smca-conc1',
          text: '<p>The uncorrected identified misstatements are not material, either individually or in the aggregate, to the financial statements.</p>',
          answerType: 'none',
          required: false,
        },
        row('q-smca-conc2'),
      ],
    },
  ];
  return {
    id: 'audit-worksheet-summary-misstatements-ca',
    title: 'Summary of Identified Misstatements (Canada)',
    objective: 'To accumulate identified misstatements and evaluate their effect on the audit and the financial statements. (CAS 450)',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Description of misstatement (nature, cause, account affected)',
      col3Editable: true,
      col4Label: 'Corrected?',
      col4Options: ['Yes', 'No', 'Partial'],
      col5Label: 'Effect on Assets / Liabilities / Pre-tax Income / Equity',
    },
  };
};

// ── Audit Worksheet – Matters Communicated to Management and TCWG (Canada) ───
export const generateAuditWorksheetMattersCommunicatedCA = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-commca-1',
      title: 'Matters to be Communicated',
      isExpanded: true,
      questions: [
        row('q-commca-r1'), row('q-commca-r2'), row('q-commca-r3'), row('q-commca-r4'), row('q-commca-r5'),
        row('q-commca-r6'), row('q-commca-r7'), row('q-commca-r8'), row('q-commca-r9'), row('q-commca-r10'),
      ],
    },
    {
      id: 's-commca-conc',
      title: 'Conclusion',
      isExpanded: true,
      questions: [row('q-commca-conc')],
    },
  ];
  return {
    id: 'audit-worksheet-matters-communicated-ca',
    title: 'Matters Communicated to Management and TCWG (Canada)',
    objective: 'To document significant matters arising from the audit that are to be communicated to management and those charged with governance in accordance with CAS 260 and CAS 265.',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Matter to be communicated',
      col3Editable: true,
      col4Label: 'Communicated?',
      col4Options: ['Yes — Management', 'Yes — TCWG', 'Yes — Both', 'No', 'N/A'],
      col5Label: 'Management / TCWG response',
    },
  };
};

// ── Audit Worksheet – Matters for Future Consideration (Canada) ───────────────
export const generateAuditWorksheetFutureConsiderationCA = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-futca-1',
      title: 'Matters for Future Consideration',
      isExpanded: true,
      questions: [
        row('q-futca-r1'), row('q-futca-r2'), row('q-futca-r3'), row('q-futca-r4'), row('q-futca-r5'),
        row('q-futca-r6'), row('q-futca-r7'), row('q-futca-r8'), row('q-futca-r9'), row('q-futca-r10'),
      ],
    },
  ];
  return {
    id: 'audit-worksheet-future-consideration-ca',
    title: 'Matters for Future Consideration (Canada)',
    objective: 'To document matters arising from the current period audit that require consideration in planning and conducting future audit engagements.',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Matter for future consideration',
      col3Editable: true,
      col4Label: 'Priority',
      col4Options: ['High', 'Medium', 'Low'],
      col5Label: 'Action required and timeline',
    },
  };
};

// ── Audit Worksheet – Documenting Consultation (Canada) ──────────────────────
export const generateAuditWorksheetDocumentingConsultationCA = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-consca-1',
      title: 'Consultations',
      isExpanded: true,
      questions: [
        row('q-consca-r1'), row('q-consca-r2'), row('q-consca-r3'), row('q-consca-r4'), row('q-consca-r5'),
        row('q-consca-r6'), row('q-consca-r7'), row('q-consca-r8'), row('q-consca-r9'), row('q-consca-r10'),
      ],
    },
  ];
  return {
    id: 'audit-worksheet-documenting-consultation-ca',
    title: 'Documenting Consultation (Canada)',
    objective: 'To document the nature of significant consultations undertaken during the audit engagement and the conclusions reached. (CAS 220, CAS 230)',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Issue or question for consultation',
      col3Editable: true,
      col4Label: 'Status',
      col4Options: ['Resolved', 'Pending', 'Escalated'],
      col5Label: 'Person / source consulted and conclusion reached',
    },
  };
};

// ── Audit Worksheet – Withdrawal (United States) ─────────────────────────────
export const generateAuditWorksheetWithdrawalUS = (): Checklist => {
  const sections: Section[] = [
    {
      id: 's-wdus-1',
      title: 'Document Reasoning and Conclusions',
      isExpanded: true,
      questions: [
        {
          id: 'q-wdus-1',
          text: '<p><strong>1.</strong> Document the reason for your withdrawal, the actions taken and discussions with management, including any of the following situations:</p>',
          answerType: 'none',
          required: false,
          subQuestions: [
            { id: 'q-wdus-1a', text: '<p>a. Reasonable assurance cannot be obtained (such as a failure to achieve an objective in a relevant AU-C) and: i. A qualified opinion in the auditor\'s report is insufficient. ii. The auditor did not disclaim an opinion. (AU-C 200)</p>', answerType: 'none', required: false },
            { id: 'q-wdus-1b', text: '<p>b. Where there has been a change in the terms of the engagement that the auditor does not agree with, and the auditor is not permitted by management to continue with the original audit engagement. (AU-C 210)</p>', answerType: 'none', required: false },
            { id: 'q-wdus-1c', text: '<p>c. Appropriate actions could not be taken to eliminate or reduce threats to independence. (AU-C 220)</p>', answerType: 'none', required: false },
            { id: 'q-wdus-1d', text: '<p>d. An exceptional circumstance exists as a result of a misstatement resulting from fraud or suspected fraud. The auditor is therefore unable to continue performing the audit. (AU-C 240.39, A55)</p>', answerType: 'none', required: false },
            { id: 'q-wdus-1e', text: '<p>e. Identified or suspected non-compliance with laws or regulations, which: i. Have not been remediated by management or TCWG. ii. Raises questions about the integrity of management or TCWG. (AU-C 250.A25)</p>', answerType: 'none', required: false },
            { id: 'q-wdus-1f', text: '<p>f. Two-way communication between the auditor and TCWG is inadequate and cannot be resolved. (AU-C 260.A53)</p>', answerType: 'none', required: false },
            { id: 'q-wdus-1g', text: '<p>g. There is a significant risk of management misrepresentation in the financial statements. An audit cannot be continued when there are concerns about the competence, integrity, ethical values or diligence of management. (AU-C 580.A24)</p>', answerType: 'none', required: false },
            { id: 'q-wdus-1h', text: '<p>h. The auditor\'s understanding and evaluation of the control environment and other components of the entity\'s system of internal control raises doubts about the auditor\'s ability to obtain sufficient and appropriate audit evidence. (AU-C 315)</p>', answerType: 'none', required: false },
            { id: 'q-wdus-1i', text: '<p>i. In a group engagement, the group engagement partner concludes that: i. It will not be possible for the group engagement team to obtain sufficient appropriate audit evidence due to restrictions imposed by group management. ii. The possible effect will result in a disclaimer of opinion on the group financial statements. (AU-C 600)</p>', answerType: 'none', required: false },
            { id: 'q-wdus-1j', text: '<p>j. The possible effects on the financial statements of undetected misstatements, if any, could be both material and pervasive. As a result, a qualification of the audit opinion would be inadequate to communicate the gravity of the situation. (AU-C 705.13(b))</p>', answerType: 'none', required: false },
            { id: 'q-wdus-1k', text: '<p>k. A material misstatement exists in other information obtained prior to the date of the auditor\'s report. This misstatement remains uncorrected after communicating with those charged with governance. (AU-C 720)</p>', answerType: 'none', required: false },
          ],
        },
        {
          id: 'q-wdus-2',
          text: '<p><strong>2.</strong> Document whether the firm is permitted to withdraw from the engagement based on:</p>',
          answerType: 'none',
          required: false,
          subQuestions: [
            { id: 'q-wdus-2a', text: '<p>a. The applicable Code of Professional Conduct (AICPA ET).</p>', answerType: 'none', required: false },
            { id: 'q-wdus-2b', text: '<p>b. The firm\'s quality control policies and procedures.</p>', answerType: 'none', required: false },
          ],
        },
        {
          id: 'q-wdus-3',
          text: '<p><strong>3.</strong> Communicate the reason(s) for withdrawing from the engagement. Include a copy of the communication in the working papers along with management\'s response, if any.</p>',
          answerType: 'none',
          required: false,
        },
      ],
    },
  ];
  return {
    id: 'audit-worksheet-withdrawal-us',
    title: 'Withdrawal (United States)',
    objective: 'To document situations where withdrawal from an audit engagement is the appropriate conclusion. WARNING: Withdrawal from an audit engagement is not always possible. Prior to withdrawal: 1. Refer to your applicable Code of Professional Conduct (AICPA ET) to ensure that withdrawal is permitted. 2. Consider obtaining advice from your lawyer and insurance company.',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Procedure',
      col3Editable: false,
      col4Label: 'PSC? (Y/N)',
      col4Options: ['Y', 'N', 'N/A'],
      col5Label: 'Document the reasoning, discussions and conclusions reached',
    },
  };
};

// ── Audit Worksheet – Notes on Significant Audit Decisions (United States) ───
export const generateAuditWorksheetSignificantDecisionsUS = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-sdus-1',
      title: 'Notes on Significant Audit Decisions',
      isExpanded: true,
      questions: [
        row('q-sdus-r1'), row('q-sdus-r2'), row('q-sdus-r3'), row('q-sdus-r4'), row('q-sdus-r5'),
        row('q-sdus-r6'), row('q-sdus-r7'), row('q-sdus-r8'), row('q-sdus-r9'), row('q-sdus-r10'),
      ],
    },
    {
      id: 's-sdus-conc',
      title: 'Conclusion',
      isExpanded: true,
      questions: [row('q-sdus-conc')],
    },
  ];
  return {
    id: 'audit-worksheet-significant-decisions-us',
    title: 'Notes on Significant Audit Decisions (United States)',
    objective: 'To document the nature of and basis for significant audit decisions made during the engagement. (AU-C 230)',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Significant decision or matter',
      col3Editable: true,
      col4Label: 'Disposition',
      col4Options: ['Concluded', 'Referred', 'Pending'],
      col5Label: 'Basis for decision and conclusion reached',
    },
  };
};

// ── Audit Worksheet – Key Audit Matters (United States – AU-C 701) ────────────
export const generateAuditWorksheetKeyAuditMattersUS = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-kamus-1',
      title: 'Key Audit Matters',
      isExpanded: true,
      questions: [
        row('q-kamus-r1'), row('q-kamus-r2'), row('q-kamus-r3'), row('q-kamus-r4'),
        row('q-kamus-r5'), row('q-kamus-r6'), row('q-kamus-r7'), row('q-kamus-r8'),
      ],
    },
    {
      id: 's-kamus-conc',
      title: 'Conclusion',
      isExpanded: true,
      questions: [row('q-kamus-conc')],
    },
  ];
  return {
    id: 'audit-worksheet-key-audit-matters-us',
    title: 'Key Audit Matters (United States – AU-C 701)',
    objective: "To document key audit matters that the auditor decides (or is required) to communicate in the auditor's report in accordance with AU-C 701. Key audit matters are selected from matters communicated to those charged with governance. Remember to communicate each key audit matter selected for inclusion in the audit report with those charged with governance.",
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Description of the key audit matter',
      col3Editable: true,
      col4Label: 'Significance',
      col4Options: ['Highest', 'Significant', 'Moderate', 'Not a KAM'],
      col5Label: 'Manner addressed in the audit',
    },
  };
};

// ── Audit Worksheet – Audit Findings and Matters for Discussion (United States)
export const generateAuditWorksheetFindingsUS = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-findus-1',
      title: 'Audit Findings',
      isExpanded: true,
      questions: [
        row('q-findus-r1'), row('q-findus-r2'), row('q-findus-r3'), row('q-findus-r4'),
        row('q-findus-r5'), row('q-findus-r6'), row('q-findus-r7'), row('q-findus-r8'),
        row('q-findus-r9'), row('q-findus-r10'), row('q-findus-r11'), row('q-findus-r12'),
      ],
    },
    {
      id: 's-findus-conc',
      title: 'Conclusion',
      isExpanded: true,
      questions: [row('q-findus-conc')],
    },
  ];
  return {
    id: 'audit-worksheet-findings-us',
    title: 'Audit Findings and Matters for Discussion (United States)',
    objective: 'To record audit findings (matters identified during the audit as a result of performing audit procedures) and how they were resolved. (Refer to AU-C 260 and AU-C 265 for further guidance.)',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Audit finding (such as possible bias in an estimate)',
      col3Editable: true,
      col4Label: 'Status',
      col4Options: ['Open', 'Resolved', 'Not applicable'],
      col5Label: 'Suggested resolution / Actual resolution reached and the reasoning',
    },
  };
};

// ── Audit Worksheet – Accumulation of Identified Misstatements (United States)
export const generateAuditWorksheetAIMUS = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-aimus-proposed',
      title: 'Proposed Adjustments',
      questions: [
        { id: 'q-aimus-pa-1', text: '<p>Description of misstatement #1 (nature, account affected, financial statement line affected):</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-aimus-pa-2', text: '<p>Quantitative amount of misstatement #1 (debit/credit):</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-aimus-pa-3', text: '<p>Is misstatement #1 above the planning or performance materiality threshold?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aimus-pa-4', text: '<p>Has management agreed to correct misstatement #1?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aimus-pa-5', text: '<p>Description of misstatement #2 (nature, account affected, financial statement line affected):</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-aimus-pa-6', text: '<p>Quantitative amount of misstatement #2 (debit/credit):</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-aimus-pa-7', text: '<p>Is misstatement #2 above the planning or performance materiality threshold?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aimus-pa-8', text: '<p>Has management agreed to correct misstatement #2?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aimus-pa-9', text: '<p>List any additional proposed adjustments with descriptions, amounts, and management responses:</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
      ],
      isExpanded: true
    },
    {
      id: 'section-aimus-evaluation',
      title: 'Evaluation of Misstatements',
      questions: [
        { id: 'q-aimus-ev-1', text: '<p>Have all uncorrected misstatements been accumulated to assess whether, individually or in combination, they are material (AU-C 450.10)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aimus-ev-2', text: '<p>Has the qualitative impact of each uncorrected misstatement been assessed (e.g., effect on key ratios, compliance with debt covenants, management compensation, AU-C 450.A18)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aimus-ev-3', text: '<p>Have uncorrected misstatements been communicated to management and TCWG in accordance with AU-C 450.12 and AU-C 260?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aimus-ev-4', text: '<p>Has management been requested to correct all identified misstatements?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aimus-ev-5', text: '<p>If management refuses to correct misstatements, document their rationale and the auditor\'s assessment (AU-C 450.13):</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
        { id: 'q-aimus-ev-6', text: '<p>Document total uncorrected misstatements and their relationship to materiality:</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
      ],
      isExpanded: true
    },
    {
      id: 'section-aimus-conclusion',
      title: 'Conclusion',
      questions: [
        { id: 'q-aimus-concl-1', text: '<p>Are the remaining uncorrected misstatements, individually and in aggregate, immaterial to the financial statements?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aimus-concl-2', text: '<p>Does the accumulation of misstatements affect the audit opinion (AU-C 700)?</p>', answerType: 'yes-no-na', options: ['Yes', 'No', 'NA'], required: false, answer: '' },
        { id: 'q-aimus-concl-3', text: '<p>Provide overall conclusion on identified misstatements and the effect on the audit opinion:</p>', answerType: 'long-answer', options: [], required: false, answer: '' },
      ],
      isExpanded: true
    }
  ];
  return {
    id: 'audit-worksheet-aim-us',
    title: 'Accumulation of Identified Misstatements (United States)',
    objective: `This worksheet accumulates and evaluates all misstatements identified during the audit in accordance with AU-C 450.\n• Documentation of proposed adjustments (description, amount, account affected)\n• Qualitative and quantitative assessment of misstatements (AU-C 450)\n• Management's response to proposed adjustments\n• Effect of uncorrected misstatements on the audit opinion (AU-C 700)`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// ── Audit Worksheet – Matters Communicated to Management and TCWG (United States)
export const generateAuditWorksheetMattersCommunicatedUS = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-commus-1',
      title: 'Matters to be Communicated',
      isExpanded: true,
      questions: [
        row('q-commus-r1'), row('q-commus-r2'), row('q-commus-r3'), row('q-commus-r4'), row('q-commus-r5'),
        row('q-commus-r6'), row('q-commus-r7'), row('q-commus-r8'), row('q-commus-r9'), row('q-commus-r10'),
      ],
    },
    {
      id: 's-commus-conc',
      title: 'Conclusion',
      isExpanded: true,
      questions: [row('q-commus-conc')],
    },
  ];
  return {
    id: 'audit-worksheet-matters-communicated-us',
    title: 'Matters Communicated to Management and TCWG (United States)',
    objective: 'To document significant matters arising from the audit that are to be communicated to management and those charged with governance in accordance with AU-C 260 and AU-C 265.',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Matter to be communicated',
      col3Editable: true,
      col4Label: 'Communicated?',
      col4Options: ['Yes — Management', 'Yes — TCWG', 'Yes — Both', 'No', 'N/A'],
      col5Label: 'Management / TCWG response',
    },
  };
};

// ── Audit Worksheet – Matters for Future Consideration (United States) ────────
export const generateAuditWorksheetFutureConsiderationUS = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-futus-1',
      title: 'Matters for Future Consideration',
      isExpanded: true,
      questions: [
        row('q-futus-r1'), row('q-futus-r2'), row('q-futus-r3'), row('q-futus-r4'), row('q-futus-r5'),
        row('q-futus-r6'), row('q-futus-r7'), row('q-futus-r8'), row('q-futus-r9'), row('q-futus-r10'),
      ],
    },
  ];
  return {
    id: 'audit-worksheet-future-consideration-us',
    title: 'Matters for Future Consideration (United States)',
    objective: 'To document matters arising from the current period audit that require consideration in planning and conducting future audit engagements.',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Matter for future consideration',
      col3Editable: true,
      col4Label: 'Priority',
      col4Options: ['High', 'Medium', 'Low'],
      col5Label: 'Action required and timeline',
    },
  };
};

// ── Audit Worksheet – Documenting Consultation (United States) ────────────────
export const generateAuditWorksheetDocumentingConsultationUS = (): Checklist => {
  const row = (id: string): Question => ({ id, text: '', answerType: 'none', required: false, answer: '', explanation: '', reference: '' });
  const sections: Section[] = [
    {
      id: 's-consus-1',
      title: 'Consultations',
      isExpanded: true,
      questions: [
        row('q-consus-r1'), row('q-consus-r2'), row('q-consus-r3'), row('q-consus-r4'), row('q-consus-r5'),
        row('q-consus-r6'), row('q-consus-r7'), row('q-consus-r8'), row('q-consus-r9'), row('q-consus-r10'),
      ],
    },
  ];
  return {
    id: 'audit-worksheet-documenting-consultation-us',
    title: 'Documenting Consultation (United States)',
    objective: 'To document the nature of significant consultations undertaken during the audit engagement and the conclusions reached. (AU-C 220, AU-C 230)',
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
    worksheetConfig: {
      col3Label: 'Issue or question for consultation',
      col3Editable: true,
      col4Label: 'Status',
      col4Options: ['Resolved', 'Pending', 'Escalated'],
      col5Label: 'Person / source consulted and conclusion reached',
    },
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
    case 'global-4-7':
      return generateAuditWorksheetWithdrawalCA();
    case 'global-4-8':
      return generateAuditWorksheetSignificantDecisionsCA();
    case 'global-4-9':
      return generateAuditWorksheetKeyAuditMattersCA();
    case 'global-4-10':
      return generateAuditWorksheetFindingsCA();
    case 'global-4-11':
      return generateAuditWorksheetSummaryMisstatementsCA();
    case 'global-4-12':
      return generateAuditWorksheetMattersCommunicatedCA();
    case 'global-4-13':
      return generateAuditWorksheetFutureConsiderationCA();
    case 'global-4-14':
      return generateAuditWorksheetDocumentingConsultationCA();
    case 'global-us-4-1':
      return generateAuditWorksheetWithdrawalUS();
    case 'global-us-4-2':
      return generateAuditWorksheetSignificantDecisionsUS();
    case 'global-us-4-3':
      return generateAuditWorksheetKeyAuditMattersUS();
    case 'global-us-4-4':
      return generateAuditWorksheetFindingsUS();
    case 'global-us-4-5':
      return generateAuditWorksheetAIMUS();
    case 'global-us-4-6':
      return generateAuditWorksheetMattersCommunicatedUS();
    case 'global-us-4-7':
      return generateAuditWorksheetFutureConsiderationUS();
    case 'global-us-4-8':
      return generateAuditWorksheetDocumentingConsultationUS();
    case 'client-acceptance-2026':
    case 'global-template-client-acceptance-2026':
    case 'global-5-1':
      return generateClientAcceptanceContinuance2026Checklist();
    // ── Global Reports ──────────────────────────────────────────────────────
    case 'grpt-1-1': return generateCompilationEngagementReport();
    case 'grpt-2-1': return generateReviewUnqualifiedASPE();
    case 'grpt-2-2': return generateReviewModifiedASPE();
    case 'grpt-2-3': return generateReviewUnqualifiedASNPO();
    case 'grpt-2-4': return generateReviewModifiedASNPO();
    case 'grpt-2-5': return generateReviewSpecialPurposeUnqualified();
    case 'grpt-2-6': return generateReviewSpecialPurposeModified();
    case 'grpt-ca-1': return generateAuditUnqualifiedASPE();
    case 'grpt-ca-2': return generateAuditUnqualifiedASNPO();
    case 'grpt-ca-3': return generateAuditQualifiedMaterialMisstatement();
    case 'grpt-ca-4': return generateAuditQualifiedInsufficientEvidence();
    case 'grpt-ca-5': return generateAuditAdverseOpinion();
    case 'grpt-ca-6': return generateAuditDisclaimerOfOpinion();
    case 'grpt-ca-7': return generateAuditEmphasisOfMatter();
    case 'grpt-ca-8': return generateAuditOtherMatterParagraph();
    case 'grpt-us-1': return generateUSAuditFairPresentation();
    case 'grpt-us-2': return generateUSAuditComplianceFramework();
    case 'grpt-us-3': return generateUSQualifiedMaterialFair();
    case 'grpt-us-4': return generateUSQualifiedMaterialCompliance();
    case 'grpt-us-5': return generateUSQualifiedInsufficientEvidence();
    case 'grpt-us-6': return generateUSAdverseOpinion();
    case 'grpt-us-7': return generateUSDisclaimerOfOpinion();
    case 'grpt-us-8': return generateUSKeyAuditMatters();
    case 'grpt-us-9': return generateUSQualifiedWithEmphasis();
    // ── Global Letters ──────────────────────────────────────────────────────
    case 'glt-1-1': return generateEngagementLetterChecklist();
    case 'glt-1-2': return generateManagementResponsibilityChecklist();
    case 'glt-2-1': return generateReviewEngagementLetterMaster();
    case 'glt-2-2': return generateReviewManagementRepresentationLetter();
    case 'glt-2-3': return generateReviewFindingsLetter();
    case 'glt-2-4': return generateLetterToPredecessor();
    case 'glt-2-5': return generateLetterToSuccessor();
    case 'glt-2-6': return generateRequestForManagementAssistance();
    case 'glt-3-1': return generateTaxEngagementLetter();
    case 'glt-4-1': return generateClosingCoverLetter();
    case 'glt-4-2': return generateLetterToLawyerLongForm();
    case 'glt-4-3': return generateLetterToLawyerShortForm();
    case 'glt-4-4': return generateLetterToPredecessorAccountant();
    case 'glt-4-5': return generateLetterToSuccessorAccountant();
    case 'glt-ca-1': return generateAuditEngagementLetterCASASPE();
    case 'glt-ca-2': return generateAuditEngagementLetterCASASNPO();
    case 'glt-ca-3': return generateManagementRepLetterCAS580();
    case 'glt-ca-4': return generateCommunicationTCWGPlanning();
    case 'glt-ca-5': return generateCommunicationTCWGFinal();
    case 'glt-ca-6': return generateInquiryToLegalCounselCA();
    case 'glt-ca-7': return generateCommunicationToPredecessorAuditorCA();
    case 'glt-ca-8': return generateLetterToManagementSignificantDeficienciesCA();
    case 'glt-us-1': return generateAuditEngagementLetterGAASUSGAAP();
    case 'glt-us-2': return generateManagementRepLetterAUC580();
    case 'glt-us-3': return generateCommunicationTCWGPlanningUS();
    case 'glt-us-4': return generateCommunicationTCWGFinalUS();
    case 'glt-us-5': return generateInquiryToLegalCounselUS();
    case 'glt-us-6': return generateLetterToManagementSignificantDeficienciesUS();
    case 'glt-us-7': return generateCommunicationToPredecessorAuditorUS();
    default:
      return null;
  }
};

// ── CAS Audit Checklist Templates ──────────────────────────────────────────

export const generateEngagementScopeChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-scope-1',
      title: '1. Scope Definition',
      questions: [
        q('scope-q1a', '<p>Has the legal name and nature of the entity been confirmed and documented (incorporated company, partnership, NPO, etc.)?</p>', undefined, 'Yes', '<p>Confirmed legal name as Shipping Line Inc., incorporated under the Canada Business Corporations Act. Entity is a private company engaged in maritime freight and logistics.</p>', 'W/P Ref: PL-01'),
        q('scope-q1b', '<p>Has the financial reporting period been confirmed with management (fiscal year-end, comparative period)?</p>', undefined, 'Yes', '<p>Fiscal year-end confirmed as March 31, 2024 with comparative period March 31, 2023, per the engagement letter dated February 2024.</p>', 'W/P Ref: PL-01'),
        q('scope-q1c', '<p>Has the applicable financial reporting framework been identified and agreed with management (ASPE, IFRS, ASNPO, etc.)?</p>', undefined, 'Yes', '<p>ASPE confirmed as the applicable financial reporting framework, consistent with prior year.</p>', 'W/P Ref: PL-02'),
        q('scope-q1d', '<p>Is the audit objective clearly defined — expression of an opinion on whether the financial statements present fairly in all material respects in accordance with the identified framework?</p>', undefined, 'Yes', '<p>Audit objective documented in the engagement letter and communicated to the engagement team for the year ended March 31, 2024.</p>', 'W/P Ref: PL-01'),
        q('scope-q1e', '<p>Have the components of the entity included in scope been identified (subsidiaries, divisions, branches, joint arrangements)?</p>', undefined, 'Yes', '<p>Shipping Line Inc. operates as a single legal entity with no subsidiaries or joint arrangements. All operations are included within scope.</p>', 'W/P Ref: PL-02'),
        q('scope-q1f', '<p>Have any component auditors been identified, and has the group engagement team obtained sufficient understanding of their work?</p>', undefined, 'NA', '<p>Not applicable — Shipping Line Inc. is a single entity with no components requiring audit procedures by other auditors.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scope-2',
      title: '2. Exclusions & Limitations',
      questions: [
        q('scope-q2a', '<p>Have any scope restrictions been identified and documented in the engagement letter?</p>', undefined, 'No', '<p>No scope restrictions identified or imposed by management. Full access to all books, records, and personnel was confirmed in the engagement letter.</p>'),
        q('scope-q2b', '<p>Has management agreed in writing to the scope of the engagement and any limitations thereon?</p>', undefined, 'Yes', '<p>Management executed the engagement letter on February 20, 2024, confirming agreement with the scope and terms of the audit engagement.</p>', 'W/P Ref: PL-01'),
        q('scope-q2c', '<p>Have the implications of any scope restrictions on the form of the auditor\'s report been considered (potential qualification or disclaimer)?</p>', undefined, 'NA', '<p>No scope restrictions identified; not applicable.</p>'),
        q('scope-q2d', '<p>Are there any regulatory, contractual or legal constraints on the audit scope that need to be reflected in the engagement terms?</p>', undefined, 'No', '<p>No regulatory or contractual constraints on audit scope identified that would restrict access or procedures.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scope-3',
      title: '3. Reporting Requirements',
      questions: [
        q('scope-q3a', '<p>Has the form and content of the auditor\'s report been discussed and agreed with management/TCWG (CAS 700 standard report, other reporting requirements)?</p>', undefined, 'Yes', '<p>Standard CAS 700 unmodified audit report form discussed and agreed with management. No special reporting requirements identified.</p>', 'W/P Ref: PL-01'),
        q('scope-q3b', '<p>Are there any special-purpose reporting requirements (regulatory filings, lender requirements, grant reporting) that will affect the form of the report?</p>', undefined, 'Yes', '<p>RBC requires audited financial statements as a condition of the entity\'s credit facility. The standard audit report satisfies this requirement.</p>', 'W/P Ref: PL-02'),
        q('scope-q3c', '<p>Have the reporting deadlines been agreed with management and built into the engagement timeline?</p>', undefined, 'Yes', '<p>Fieldwork scheduled April 14–25, 2024. Final signed report targeted by May 31, 2024 to meet lender covenant reporting deadline.</p>', 'W/P Ref: PL-03'),
        q('scope-q3d', '<p>If the entity has reporting obligations under securities legislation or other regulations, have the specific requirements of those obligations been considered?</p>', undefined, 'NA', '<p>Shipping Line Inc. is a private company with no securities legislation reporting obligations.</p>'),
        q('scope-q3e', '<p>Has the need for any supplementary information (e.g., schedule of expenditures of federal awards, other required supplementary information) been identified?</p>', undefined, 'No', '<p>No supplementary schedules required. The entity does not receive federal awards or grants requiring separate reporting.</p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-engagement-scope',
    title: 'Engagement Scope',
    description: 'Documents the defined scope of the audit engagement including entity coverage, reporting period, applicable framework, and agreed reporting requirements.',
    objective: `Under CAS 300 and CAS 315, the auditor must clearly define the scope of the audit engagement prior to commencing fieldwork. This checklist ensures that the entity, reporting period, applicable framework, and any scope restrictions are agreed with management and documented in the engagement file.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generatePreliminaryAnalyticalProceduresChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-pap-1',
      title: '1. Revenue & Income Analysis',
      questions: [
        q('pap-q1a', '<p>Has total revenue for the current period been compared to the prior period and budget? Document the percentage change and explanations for variances exceeding 10%.</p>', undefined, 'Yes', '<p>Revenue of $12.5M CAD compared to prior year $11.2M, an increase of 11.6%. Increase attributed to new freight contracts and higher container volumes on Pacific routes per management discussion.</p>', 'W/P Ref: PAP-01'),
        q('pap-q1b', '<p>Have revenue streams been disaggregated by product/service line or geography to identify unusual concentration or shifts?</p>', undefined, 'Yes', '<p>Revenue disaggregated by freight type (container, bulk, chartering) and by trade route. No unusual concentration or shifts identified beyond expected volume growth.</p>', 'W/P Ref: PAP-01'),
        q('pap-q1c', '<p>Has other income (interest income, gain on disposal, government subsidies) been compared to prior year and assessed for unusual items?</p>', undefined, 'Yes', '<p>Other income is minimal and consistent with prior year. No unusual items identified outside the ordinary course of business.</p>', 'W/P Ref: PAP-02'),
        q('pap-q1d', '<p>For entities with seasonal revenue patterns, has performance been assessed against expected seasonal trends?</p>', undefined, 'Yes', '<p>Shipping activity shows Q3 (Oct–Dec) peak and Q1 (Apr–Jun) trough, consistent with prior years and maritime freight industry patterns.</p>', 'W/P Ref: PAP-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-pap-2',
      title: '2. Balance Sheet Ratios',
      questions: [
        q('pap-q2a', '<p>Has the current ratio (current assets / current liabilities) been calculated and compared to prior year? Is the trend consistent with expectations?</p>', undefined, 'Yes', '<p>Current ratio of 1.42 compared to prior year 1.38 — trend is stable and consistent with the entity\'s working capital management practices.</p>', 'W/P Ref: PAP-02'),
        q('pap-q2b', '<p>Has the debt-to-equity ratio been calculated and compared to prior year? Are changes consistent with known financing activity?</p>', undefined, 'Yes', '<p>Debt-to-equity ratio of 1.61 (total assets $18.2M, long-term debt $4.8M) is consistent with the capital-intensive nature of the maritime shipping industry and unchanged from prior year.</p>', 'W/P Ref: PAP-02'),
        q('pap-q2c', '<p>Has the change in working capital been analyzed and explained (cash, receivables, inventory, payables movements)?</p>', undefined, 'Yes', '<p>Working capital changes are consistent with revenue growth. AR increase of $320K aligns with higher Q4 freight billings. AP increase of $185K reflects higher fuel and port costs.</p>', 'W/P Ref: PAP-02'),
        q('pap-q2d', '<p>Have significant balance sheet changes (>15% or material dollar amounts) been identified and explanations obtained from management?</p>', undefined, 'Yes', '<p>Vessel PP&E of $8.2M represents a significant balance; change from prior year is consistent with depreciation schedule and dry-dock maintenance capitalization. All variances >15% have been discussed with management.</p>', 'W/P Ref: PAP-02'),
        q('pap-q2e', '<p>Has the accounts receivable days outstanding (DSO) been calculated and compared to prior year and industry norms?</p>', undefined, 'Yes', '<p>DSO calculated at 61 days, consistent with prior year 59 days. Marginally above 60-day industry norm; no material collectibility concerns identified.</p>', 'W/P Ref: PAP-03'),
        q('pap-q2f', '<p>Has inventory turnover been calculated and compared to prior year? Are changes consistent with business operations?</p>', undefined, 'NA', '<p>Not applicable — Shipping Line Inc. is a service entity and does not carry inventory.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-pap-3',
      title: '3. Profitability Trends',
      questions: [
        q('pap-q3a', '<p>Has the gross margin percentage been calculated for the current and prior period? Are changes consistent with management\'s explanation of business conditions?</p>', undefined, 'Yes', '<p>Gross margin of 18.4% compared to prior year 17.9%. Marginal improvement attributed to higher freight rates partially offset by increased fuel costs. Management\'s explanation is consistent with industry trends.</p>', 'W/P Ref: PAP-03'),
        q('pap-q3b', '<p>Has the operating margin (EBIT / revenue) been calculated and compared to prior year? Are expense trends consistent with revenue trends?</p>', undefined, 'Yes', '<p>Operating margin of 8.1% (prior year 7.6%). Expense growth of 10.8% is slightly below revenue growth of 11.6%, resulting in modest margin improvement consistent with operating leverage.</p>', 'W/P Ref: PAP-03'),
        q('pap-q3c', '<p>Have significant changes in specific expense categories (e.g., payroll, cost of goods sold, professional fees) been investigated and explained?</p>', undefined, 'Yes', '<p>Payroll costs increased 8.2% due to headcount additions (94 employees, up from 89). Fuel costs increased 14.3% consistent with higher voyage volumes and bunker price increases. All significant variances discussed with management and explanations are reasonable.</p>', 'W/P Ref: PAP-03'),
        q('pap-q3d', '<p>Is the EBITDA trend consistent with management\'s narrative about business performance?</p>', undefined, 'Yes', '<p>EBITDA of approximately $2.1M is consistent with management\'s narrative of volume-driven growth and controlled costs. Trend is positive and supports the net income of $847K after depreciation on the vessel fleet.</p>', 'W/P Ref: PAP-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-pap-4',
      title: '4. Unusual Fluctuations',
      questions: [
        q('pap-q4a', '<p>Have all fluctuations exceeding the preliminary materiality threshold been identified and explanations documented?</p>', undefined, 'Yes', '<p>All fluctuations exceeding overall materiality of $125K have been identified and explanations obtained from management. Deferred revenue reclassification of $28K and accrued revenue cutoff of $45K were identified as areas requiring further audit procedures.</p>', 'W/P Ref: PAP-04'),
        q('pap-q4b', '<p>Have any balances that are unexpectedly zero or nil been investigated (e.g., no interest expense despite known debt)?</p>', undefined, 'Yes', '<p>Interest expense confirmed as present and consistent with the long-term debt balance of $4.8M and market interest rates. No unexpectedly nil balances identified.</p>', 'W/P Ref: PAP-04'),
        q('pap-q4c', '<p>Have any new account balances that did not exist in the prior period been identified and assessed for risk?</p>', undefined, 'Yes', '<p>A deferred revenue account was identified as new this period, arising from freight advances on multi-voyage contracts. This has been assessed as an area requiring focused audit procedures given revenue recognition risk.</p>', 'W/P Ref: PAP-04'),
        q('pap-q4d', '<p>Based on the preliminary analytical procedures, have areas requiring increased audit attention been identified and incorporated into the audit plan?</p>', undefined, 'Yes', '<p>Increased audit attention identified for: (1) revenue recognition and voyage cut-off, (2) vessel impairment assessment, and (3) USD-denominated transactions and foreign currency translation. These have been incorporated into the audit plan.</p>', 'W/P Ref: RA-01'),
        q('pap-q4e', '<p>Have the preliminary analytics been discussed with the engagement team and key findings documented in the risk assessment?</p>', undefined, 'Yes', '<p>Engagement team meeting held April 8, 2024 to discuss preliminary analytics. Key findings documented in the risk assessment working paper and audit strategy memorandum.</p>', 'W/P Ref: PAP-04'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-preliminary-analytical-procedures',
    title: 'Preliminary Analytical Procedures',
    description: 'Documents analytical procedures performed during the planning phase to develop expectations and identify unusual fluctuations requiring audit attention.',
    objective: `CAS 315 and CAS 520 require the auditor to perform analytical procedures as risk assessment procedures during planning. These procedures help the auditor develop an understanding of the entity's financial results and identify areas of significant audit risk where the actual results deviate materially from expectations.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateAuditStrategyMemorandumChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-asm-1',
      title: '1. Engagement Characteristics',
      questions: [
        q('asm-q1a', '<p>Has the entity type been documented (public, private, NPO, government) along with the applicable financial reporting framework?</p>', undefined, 'Yes', '<p>Shipping Line Inc. documented as a private company applying ASPE. Entity is engaged in marine freight and logistics with year-end March 31, 2024.</p>', 'W/P Ref: ASM-01'),
        q('asm-q1b', '<p>Have the reporting deadlines (draft financial statements, board approval, filing deadline) been confirmed and documented?</p>', undefined, 'Yes', '<p>Draft financial statements to management by May 10, 2024. Final signed report by May 31, 2024 to meet bank covenant deadline. Confirmed with management and documented in engagement timeline.</p>', 'W/P Ref: PL-03'),
        q('asm-q1c', '<p>Has the prior year audit file been reviewed to identify carry-forward issues, prior year adjustments, and significant accounting estimates?</p>', undefined, 'Yes', '<p>Prior year file reviewed. No carry-forward issues noted. Prior year adjustments were immaterial. Significant estimates include useful lives of vessels and allowance for doubtful accounts.</p>', 'W/P Ref: ASM-01'),
        q('asm-q1d', '<p>Have changes in the entity\'s business, operations or environment since the prior period been assessed for their impact on the audit?</p>', undefined, 'Yes', '<p>Two new freight contracts commenced during the year. USD-denominated revenue has increased, heightening foreign currency translation risk. Both changes have been assessed for audit impact.</p>', 'W/P Ref: ASM-01'),
        q('asm-q1e', '<p>Have new accounting standards effective for the current period been identified and assessed for their impact on the financial statements?</p>', undefined, 'Yes', '<p>No new ASPE standards effective for the year ended March 31, 2024 that have a material impact on Shipping Line Inc.\'s financial statements.</p>', 'W/P Ref: ASM-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-asm-2',
      title: '2. Audit Approach',
      questions: [
        q('asm-q2a', '<p>Has the overall audit approach been determined — primarily substantive, or combined (reliance on controls + substantive procedures)?</p>', undefined, 'Yes', '<p>Primarily substantive approach adopted given the entity\'s limited formal control structure and size. Some reliance on controls for payroll and cash disbursements where controls were assessed as effective.</p>', 'W/P Ref: ASM-02'),
        q('asm-q2b', '<p>Have the key audit areas (significant accounts and disclosures, significant risks) been identified and the planned audit approach for each documented?</p>', undefined, 'Yes', '<p>Key audit areas identified: revenue recognition (voyage cut-off), vessel PP&E and impairment ($8.2M), AR ($2.1M), long-term debt ($4.8M), and foreign currency transactions. Planned approach documented in the audit program.</p>', 'W/P Ref: ASM-02'),
        q('asm-q2c', '<p>Has the extent to which IT-assisted audit techniques (CAATs, data analytics) will be used been determined?</p>', undefined, 'Yes', '<p>Data analytics will be used to test completeness of voyage revenue through analysis of freight billing records against voyage completion data. Standard substantive procedures for remaining areas.</p>', 'W/P Ref: ASM-02'),
        q('asm-q2d', '<p>Has the use of work of internal auditors, management\'s experts or component auditors been assessed and the planned approach documented?</p>', undefined, 'NA', '<p>The entity has no internal audit function. No management\'s experts or component auditors are used. Not applicable.</p>'),
        q('asm-q2e', '<p>Has materiality (overall, performance materiality, and clearly trivial threshold) been set and documented in the strategy memorandum?</p>', undefined, 'Yes', '<p>Overall materiality $125,000 (1% of revenue $12.5M). Performance materiality $87,500 (70% of OM). Clearly trivial threshold $6,250 (5% of OM). All documented in the Materiality working paper.</p>', 'W/P Ref: MAT-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-asm-3',
      title: '3. Staffing & Resource Allocation',
      questions: [
        q('asm-q3a', '<p>Has the engagement partner been identified and their responsibility for the overall engagement quality confirmed?</p>', undefined, 'Yes', '<p>Engagement partner J. Williams, CPA identified and confirmed as responsible for overall engagement quality. Partner has prior experience with maritime logistics clients.</p>', 'W/P Ref: ASM-03'),
        q('asm-q3b', '<p>Has the engagement manager been assigned and their responsibility for day-to-day supervision confirmed?</p>', undefined, 'Yes', '<p>Engagement manager S. Chen, CPA assigned with responsibility for day-to-day supervision and review. Manager has five years of experience in audit engagements.</p>', 'W/P Ref: ASM-03'),
        q('asm-q3c', '<p>Has the engagement team (seniors, staff) been assigned with appropriate competence and experience for the engagement?</p>', undefined, 'Yes', '<p>Two senior auditors and one staff auditor assigned. Team composition reviewed by the engagement partner and assessed as appropriate for the complexity and risk profile of the engagement.</p>', 'W/P Ref: ASM-03'),
        q('asm-q3d', '<p>Has the need for specialists (e.g., IT, valuation, actuarial) been identified and arrangements made?</p>', undefined, 'No', '<p>No specialists required for this engagement. Vessel valuations are performed using management\'s internal assessment supported by market data, which will be reviewed as part of standard audit procedures.</p>'),
        q('asm-q3e', '<p>Has an engagement quality reviewer been assigned if required under the firm\'s quality management policies?</p>', undefined, 'NA', '<p>Engagement quality review not required for this engagement under the firm\'s quality management policies given the entity\'s risk profile and size.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-asm-4',
      title: '4. Communication Plan',
      questions: [
        q('asm-q4a', '<p>Have the planned communications with those charged with governance (TCWG) been identified — planning communication, matters during the audit, final communication?</p>', undefined, 'Yes', '<p>TCWG planning communication issued February 28, 2024. Final communication to TCWG planned upon completion of fieldwork prior to report issuance. Board of directors serves as TCWG.</p>', 'W/P Ref: TCWG-01'),
        q('asm-q4b', '<p>Have the dates for interim fieldwork and final fieldwork been confirmed with management and the engagement team?</p>', undefined, 'Yes', '<p>No interim fieldwork planned for this engagement. Year-end fieldwork confirmed April 14–25, 2024 with management. Engagement team notified and availability confirmed.</p>', 'W/P Ref: PL-03'),
        q('asm-q4c', '<p>Has the approach for communicating significant audit findings and significant difficulties encountered during the audit been established?</p>', undefined, 'Yes', '<p>Significant findings will be communicated verbally to the engagement manager and partner as encountered, and documented in working papers. Formal written communication to management at the conclusion of fieldwork.</p>', 'W/P Ref: ASM-04'),
        q('asm-q4d', '<p>Where the entity has related parties or component entities, has the communication approach with component auditors been established?</p>', undefined, 'NA', '<p>No component auditors involved. Not applicable.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-asm-5',
      title: '5. Significant Risks Identified at Planning Stage',
      questions: [
        q('asm-q5a', '<p>Have significant risks identified during planning (CAS 315) been documented in the strategy memorandum and linked to planned audit responses?</p>', undefined, 'Yes', '<p>Three significant risks identified: (1) revenue recognition — voyage completion cut-off, (2) vessel impairment assessment ($8.2M), and (3) foreign currency translation (USD transactions). Each linked to specific audit responses in the audit program.</p>', 'W/P Ref: RA-01'),
        q('asm-q5b', '<p>Has the presumed fraud risk related to revenue recognition been addressed, or has the rebuttal of this presumption been documented with supporting rationale?</p>', undefined, 'Yes', '<p>Revenue recognition identified as a significant risk (not rebutted). Specific procedures designed to address voyage cut-off and completeness of freight revenue recorded at March 31, 2024.</p>', 'W/P Ref: RA-02'),
        q('asm-q5c', '<p>Has the risk of management override of controls been identified as a significant risk and planned responses documented?</p>', undefined, 'Yes', '<p>Risk of management override identified as a significant risk per CAS 240. Planned responses include journal entry testing, review of accounting estimates for bias, and evaluation of significant unusual transactions.</p>', 'W/P Ref: RA-02'),
        q('asm-q5d', '<p>Have any other entity-specific or industry-specific significant risks been identified and incorporated into the audit strategy?</p>', undefined, 'Yes', '<p>Vessel impairment risk identified as entity-specific given the $8.2M carrying value representing 45% of total assets. Industry risk of fluctuating freight rates and fuel costs also considered. Both incorporated into audit strategy.</p>', 'W/P Ref: RA-01'),
        q('asm-q5e', '<p>Has the audit strategy memorandum been reviewed and approved by the engagement partner prior to commencement of fieldwork?</p>', undefined, 'Yes', '<p>Audit strategy memorandum reviewed and approved by engagement partner J. Williams, CPA on April 10, 2024, prior to commencement of fieldwork on April 14, 2024.</p>', 'W/P Ref: ASM-05'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-strategy-memorandum',
    title: 'Audit Strategy Memorandum',
    description: 'Documents the overall audit strategy including engagement characteristics, audit approach, staffing, communication plan, and significant risks identified at the planning stage.',
    objective: `CAS 300 requires the auditor to establish an overall audit strategy that sets the scope, timing, and direction of the audit. This checklist ensures the audit strategy memorandum addresses all required elements and has been approved by the engagement partner before fieldwork commences.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateStaffingTimeBudgetChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-stb-1',
      title: '1. Engagement Team',
      questions: [
        q('stb-q1a', '<p>Has the engagement partner been identified and their availability confirmed for the planned fieldwork and reporting dates?</p>', undefined, 'Yes', '<p>J. Williams, CPA confirmed available for fieldwork review April 21–25 and for report sign-off by May 31, 2024.</p>', 'W/P Ref: STB-01'),
        q('stb-q1b', '<p>Has the engagement manager been assigned? Do they have sufficient experience with this type of entity and industry?</p>', undefined, 'Yes', '<p>S. Chen, CPA assigned as engagement manager. Manager has previous experience with transportation and logistics clients and has worked on this engagement for two prior years.</p>', 'W/P Ref: STB-01'),
        q('stb-q1c', '<p>Has a senior auditor been assigned with responsibility for day-to-day file management and supervision of staff?</p>', undefined, 'Yes', '<p>Senior auditor assigned with day-to-day file management responsibility. Senior has three years of audit experience and is familiar with the entity from the prior year engagement.</p>', 'W/P Ref: STB-01'),
        q('stb-q1d', '<p>Have staff auditors been assigned with appropriate skills for the planned procedures (e.g., IT skills for data analytics, language skills for foreign entities)?</p>', undefined, 'Yes', '<p>One staff auditor assigned with data analytics capability for voyage revenue testing. No language skill requirements identified as all entity records are maintained in English.</p>', 'W/P Ref: STB-01'),
        q('stb-q1e', '<p>Has the engagement quality control reviewer (EQCR) been identified and their availability confirmed for the planned completion date?</p>', undefined, 'NA', '<p>EQCR not required for this engagement under the firm\'s quality management policies.</p>'),
        q('stb-q1f', '<p>Have required specialists (e.g., IT auditors, valuation specialists, actuaries) been identified and engaged?</p>', undefined, 'NA', '<p>No specialists required for this engagement. See audit strategy memorandum for rationale.</p>', 'W/P Ref: ASM-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-stb-2',
      title: '2. Time Budget by Phase',
      questions: [
        q('stb-q2a', '<p>Has a budget been prepared for the planning phase (risk assessment procedures, materiality determination, audit strategy and plan)?</p>', undefined, 'Yes', '<p>Planning phase budget of 22 hours: risk assessment 8 hrs, materiality and strategy 6 hrs, audit program preparation 8 hrs. Consistent with prior year planning hours.</p>', 'W/P Ref: STB-02'),
        q('stb-q2b', '<p>Has a budget been prepared for the fieldwork phase by major area (revenue, expenses, balance sheet sections)?</p>', undefined, 'Yes', '<p>Fieldwork budget of 118 hours: Revenue/AR 28 hrs, PP&E/vessels 22 hrs, Long-term debt 12 hrs, Payroll 15 hrs, Cash/AP 18 hrs, Other balance sheet 14 hrs, Disclosures 9 hrs. Total reflects increased scope for revenue recognition risk.</p>', 'W/P Ref: STB-02'),
        q('stb-q2c', '<p>Has a budget been prepared for the completion phase (subsequent events, going concern, management representations, final review)?</p>', undefined, 'Yes', '<p>Completion phase budget of 20 hours: subsequent events 4 hrs, going concern 2 hrs, management rep letter 3 hrs, partner review 8 hrs, report issuance 3 hrs.</p>', 'W/P Ref: STB-02'),
        q('stb-q2d', '<p>Has the total budgeted time been compared to the prior year actual time? Are significant variances explained by changes in scope, risk or complexity?</p>', undefined, 'Yes', '<p>Total budget of 160 hours compares to 148 hours actual in prior year. Increase of 12 hours is attributable to additional procedures planned for revenue recognition risk and USD foreign currency transactions.</p>', 'W/P Ref: STB-02'),
        q('stb-q2e', '<p>Has the budget been reviewed and approved by the engagement partner or manager?</p>', undefined, 'Yes', '<p>Budget reviewed and approved by engagement partner J. Williams, CPA on April 10, 2024.</p>', 'W/P Ref: STB-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-stb-3',
      title: '3. Key Dates',
      questions: [
        q('stb-q3a', '<p>Has the planning start date been confirmed and communicated to the engagement team?</p>', undefined, 'Yes', '<p>Planning commenced March 25, 2024. All engagement team members notified via internal scheduling system.</p>', 'W/P Ref: STB-03'),
        q('stb-q3b', '<p>Have the interim fieldwork dates (if applicable) been confirmed with the client and communicated to the team?</p>', undefined, 'NA', '<p>No interim fieldwork planned for this engagement. Substantive procedures will be performed entirely at year-end.</p>'),
        q('stb-q3c', '<p>Have the year-end / final fieldwork dates been confirmed with the client (access to books, management availability)?</p>', undefined, 'Yes', '<p>Year-end fieldwork confirmed April 14–25, 2024. CFO and Controller confirmed availability. Trial balance and supporting schedules to be provided by management by April 11, 2024.</p>', 'W/P Ref: STB-03'),
        q('stb-q3d', '<p>Has the target date for delivery of the draft management letter / findings been communicated to management?</p>', undefined, 'Yes', '<p>Draft management letter with findings to be delivered by May 3, 2024. Management has 7 days to respond before issuance of final signed report.</p>', 'W/P Ref: STB-03'),
        q('stb-q3e', '<p>Has the date for delivery of the final signed auditor\'s report been agreed with management and TCWG?</p>', undefined, 'Yes', '<p>Final signed auditor\'s report agreed for delivery by May 31, 2024, satisfying the bank covenant reporting deadline. Confirmed in writing with management on March 28, 2024.</p>', 'W/P Ref: STB-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-stb-4',
      title: '4. Budget vs Actual Tracking',
      questions: [
        q('stb-q4a', '<p>Has a mechanism been established to track actual time against the budget by team member and audit area?</p>', undefined, 'Yes', '<p>Time tracking through the firm\'s practice management system. Weekly time reports reviewed by the engagement manager against the budget during fieldwork.</p>', 'W/P Ref: STB-04'),
        q('stb-q4b', '<p>Have budget overruns been identified and discussed with the engagement manager/partner during the engagement?</p>', undefined, 'Yes', '<p>Minor overrun of 6 hours identified in vessel PP&E procedures due to additional time required to assess dry-dock capitalization policies. Discussed with engagement manager on April 22, 2024 and approved as necessary additional scope.</p>', 'W/P Ref: STB-04'),
        q('stb-q4c', '<p>Has the final actual time been compared to budget at the completion of the engagement and variances documented?</p>', undefined, 'Yes', '<p>Final actual time of 166 hours compared to budget of 160 hours. Net overrun of 6 hours (3.8%) documented and attributable to vessel dry-dock assessment. Within acceptable range.</p>', 'W/P Ref: STB-04'),
        q('stb-q4d', '<p>Have lessons learned regarding time budget accuracy been documented for use in future engagements?</p>', undefined, 'Yes', '<p>Lessons learned documented: increase vessel PP&E budget by 5 hours in future years to reflect dry-dock assessment procedures. Noted in engagement file for next year\'s planning.</p>', 'W/P Ref: STB-04'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-staffing-time-budget',
    title: 'Staffing & Time Budget',
    description: 'Documents the engagement team composition, time budget by phase, key engagement dates, and budget versus actual tracking.',
    objective: `CAS 300 and CAS 220 require the engagement partner to ensure that the engagement team collectively has the competence and capabilities to perform the audit and that adequate resources are assigned. This checklist documents the staffing plan, time budget, and key dates for the engagement.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateRiskAssessmentProceduresChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-rap-1',
      title: '1. Inquiry of Management',
      questions: [
        q('rap-q1a', '<p>Have inquiries been made of management regarding the entity\'s business model, revenue sources, major customers and suppliers?</p>', undefined, 'Yes', '<p>Inquiries performed with CFO and CEO on April 14, 2024. Shipping Line Inc. operates maritime freight and logistics services with key customers across North American and Pacific trade routes.</p>', 'W/P Ref: RA-01'),
        q('rap-q1b', '<p>Have inquiries been made regarding significant changes in the industry, regulatory environment or competitive landscape?</p>', undefined, 'Yes', '<p>Management noted increased fuel surcharge regulations and port fee adjustments effective Q4 FY2024; no material impact on financial reporting identified.</p>', 'W/P Ref: RA-01'),
        q('rap-q1c', '<p>Have inquiries been made regarding related party relationships and transactions?</p>', undefined, 'Yes', '<p>Management confirmed no significant related party transactions beyond director compensation disclosed in the financial statements.</p>', 'W/P Ref: RA-02'),
        q('rap-q1d', '<p>Have inquiries been made regarding the entity\'s use of estimates and judgments in the financial statements?</p>', undefined, 'Yes', '<p>Key estimates identified: vessel depreciation useful lives, allowance for doubtful accounts, and revenue cutoff for voyages in progress at year-end.</p>', 'W/P Ref: RA-01'),
        q('rap-q1e', '<p>Have inquiries been made of others within the entity (e.g., internal audit, legal, operations) beyond management to obtain a broader understanding?</p>', undefined, 'Yes', '<p>Inquiries also made with the operations manager and the accounts receivable clerk to corroborate management representations.</p>', 'W/P Ref: RA-01'),
        q('rap-q1f', '<p>Have inquiries been made regarding any known or suspected fraud or irregularities?</p>', undefined, 'Yes', '<p>Management confirmed no known or suspected fraud or irregularities during the year. Responses were consistent across all individuals interviewed.</p>', 'W/P Ref: RA-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rap-2',
      title: '2. Analytical Procedures',
      questions: [
        q('rap-q2a', '<p>Have preliminary analytical procedures been performed by comparing current period financial data to prior period?</p>', undefined, 'Yes', '<p>Revenue increased 8.3% year-over-year to $12.5M CAD; gross margin held at approximately 34%, consistent with prior year performance.</p>', 'W/P Ref: RA-04'),
        q('rap-q2b', '<p>Have financial ratios been calculated and compared to prior period and industry benchmarks?</p>', undefined, 'Yes', '<p>Current ratio, debt-to-equity, and EBITDA margin computed and compared to marine freight industry benchmarks; no material anomalies identified.</p>', 'W/P Ref: RA-04'),
        q('rap-q2c', '<p>Have unexpected relationships in the financial data been identified for further investigation?</p>', undefined, 'Yes', '<p>A higher-than-expected increase in deferred revenue at year-end was identified and flagged for further investigation; addressed in revenue cutoff testing.</p>', 'W/P Ref: RA-04'),
        q('rap-q2d', '<p>Have the results of preliminary analytical procedures been used to identify accounts and transactions at higher risk of material misstatement?</p>', undefined, 'Yes', '<p>Preliminary analytics identified revenue recognition (voyage completion cutoff), vessel PP&E impairment, and USD-denominated accounts as higher-risk areas.</p>', 'W/P Ref: RA-04'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rap-3',
      title: '3. Observation & Inspection',
      questions: [
        q('rap-q3a', '<p>Has a tour of the entity\'s premises been performed to gain an understanding of operations, physical controls, and business activities?</p>', undefined, 'Yes', '<p>Office and operations facility toured on April 14, 2024; physical access controls, filing systems, and IT infrastructure observed.</p>', 'W/P Ref: RA-05'),
        q('rap-q3b', '<p>Have key documents been reviewed (organization charts, board minutes, strategic plans, budgets, prior year financial statements)?</p>', undefined, 'Yes', '<p>Board minutes for April 2023 through March 2024 reviewed; organization chart and FY2024 budget obtained and filed.</p>', 'W/P Ref: RA-05'),
        q('rap-q3c', '<p>Have significant contracts and agreements (loan agreements, major customer contracts, lease agreements) been reviewed?</p>', undefined, 'Yes', '<p>Reviewed long-term debt agreements ($4.8M CAD), three major freight charter agreements, and vessel operating lease terms.</p>', 'W/P Ref: RA-05'),
        q('rap-q3d', '<p>Has the entity\'s chart of accounts and accounting policies been reviewed for changes from the prior period?</p>', undefined, 'Yes', '<p>No changes to chart of accounts or significant accounting policies from the prior year; depreciation method and useful lives remain consistent.</p>', 'W/P Ref: RA-05'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rap-4',
      title: '4. Information from Acceptance/Continuance',
      questions: [
        q('rap-q4a', '<p>Have findings from the engagement acceptance or continuance process been incorporated into the risk assessment?</p>', undefined, 'Yes', '<p>Continuance assessment completed; no significant independence or integrity concerns identified. Client risk rating confirmed as moderate.</p>', 'W/P Ref: RA-06'),
        q('rap-q4b', '<p>For new engagements, has information obtained from the predecessor auditor been reviewed and relevant findings incorporated?</p>', undefined, 'NA', '<p>Not applicable — continuing engagement. Prior year audit files reviewed directly.</p>'),
        q('rap-q4c', '<p>Have prior year audit findings, misstatements, and significant difficulties been reviewed and their implications for the current period assessed?</p>', undefined, 'Yes', '<p>Prior year working papers reviewed; one prior year passed adjustment related to accrued revenue considered in planning current year revenue cutoff procedures.</p>', 'W/P Ref: RA-06'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rap-5',
      title: '5. Other Procedures',
      questions: [
        q('rap-q5a', '<p>Have board and committee minutes been reviewed for the period to identify significant decisions, commitments, or events?</p>', undefined, 'Yes', '<p>All board minutes from April 2023 to March 2024 reviewed; noted approval of a vessel drydock expenditure of $380K and renewal of the operating credit facility.</p>', 'W/P Ref: RA-07'),
        q('rap-q5b', '<p>Have regulatory filings and correspondence been reviewed for compliance issues or enforcement actions?</p>', undefined, 'Yes', '<p>Transport Canada and port authority filings reviewed; no enforcement actions or compliance issues noted during the year.</p>', 'W/P Ref: RA-07'),
        q('rap-q5c', '<p>Have publicly available information sources (news, industry reports, regulatory databases) been reviewed for information about the entity?</p>', undefined, 'Yes', '<p>Industry publications and public records reviewed; no adverse findings regarding Shipping Line Inc. Marine freight sector showed moderate growth consistent with client results.</p>'),
        q('rap-q5d', '<p>Has the engagement team discussion (brainstorming) regarding fraud risks and significant risks been completed and documented?</p>', undefined, 'Yes', '<p>Team brainstorming session held April 14, 2024 with engagement manager S. Chen and senior staff; key risks and fraud risks identified and documented.</p>', 'W/P Ref: RA-03'),
        q('rap-q5e', '<p>Have the results of all risk assessment procedures been aggregated and used to identify and assess risks of material misstatement at the financial statement and assertion levels?</p>', undefined, 'Yes', '<p>Risk assessment results consolidated into the RMM matrix; three significant risks identified: revenue recognition cutoff, vessel impairment, and foreign currency translation.</p>', 'W/P Ref: RA-08'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-risk-assessment-procedures',
    title: 'Risk Assessment Procedures',
    description: 'Documents the risk assessment procedures performed to obtain an understanding of the entity and its environment, including internal control.',
    objective: `CAS 315 requires the auditor to perform risk assessment procedures to provide a basis for the identification and assessment of risks of material misstatement at the financial statement and assertion levels. This checklist documents all risk assessment procedures performed, including inquiry, analytical procedures, observation and inspection.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateITGeneralControlsChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-itgc-1',
      title: '1. Access Controls',
      questions: [
        q('itgc-q1a', '<p>Has the entity\'s user access management process been documented (how access is provisioned, modified, and revoked for joiners, movers, and leavers)?</p>', undefined, 'Yes', '<p>User access management process documented; new hire and termination procedures reviewed with IT coordinator on April 15, 2024.</p>', 'W/P Ref: IC-01'),
        q('itgc-q1b', '<p>Has the entity performed a periodic user access review to verify that access rights are appropriate and that terminated employees have been removed?</p>', undefined, 'Yes', '<p>Annual user access review completed in February 2024; no terminated employees with active access identified.</p>', 'W/P Ref: IC-01'),
        q('itgc-q1c', '<p>Is privileged access (administrator, super-user) restricted to authorized IT personnel and subject to enhanced monitoring?</p>', undefined, 'Yes', '<p>Administrator access limited to two IT staff members; activity logging confirmed active on accounting and payroll systems.</p>', 'W/P Ref: IC-01'),
        q('itgc-q1d', '<p>Do password policies enforce minimum complexity, length, expiry, and account lockout after failed attempts?</p>', undefined, 'Yes', '<p>Password policy reviewed; minimum 12 characters, 90-day expiry, and lockout after five failed attempts enforced via Active Directory.</p>', 'W/P Ref: IC-01'),
        q('itgc-q1e', '<p>Is multi-factor authentication (MFA) required for remote access and privileged accounts?</p>', undefined, 'Yes', '<p>MFA enforced for all remote access via VPN and for administrator accounts; confirmed via IT policy documentation.</p>', 'W/P Ref: IC-01'),
        q('itgc-q1f', '<p>Are generic and shared user accounts prohibited or, if unavoidable, subject to compensating controls?</p>', undefined, 'Yes', '<p>No generic or shared accounts identified; all system access is individual and tied to named employees.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-itgc-2',
      title: '2. Change Management',
      questions: [
        q('itgc-q2a', '<p>Is there a formal change management process for software and system changes (development, testing, approval, implementation)?</p>', undefined, 'Yes', '<p>Formal change management policy documented; all system changes require a change request ticket with manager approval prior to implementation.</p>', 'W/P Ref: IC-02'),
        q('itgc-q2b', '<p>Are all changes to production systems subject to documented testing and user acceptance testing (UAT) before deployment?</p>', undefined, 'Yes', '<p>UAT sign-off required for all significant changes; three system changes during FY2024 reviewed and all had documented UAT approval.</p>', 'W/P Ref: IC-02'),
        q('itgc-q2c', '<p>Is authorization for production changes documented and segregated from development (developers cannot deploy directly to production)?</p>', undefined, 'Yes', '<p>IT manager authorization required for all production deployments; development staff do not have direct production access.</p>', 'W/P Ref: IC-02'),
        q('itgc-q2d', '<p>Is a change log or audit trail maintained for all production changes, and is it reviewed periodically?</p>', undefined, 'Yes', '<p>Change log maintained in the IT ticketing system; IT manager reviews log monthly for completeness and unauthorized changes.</p>', 'W/P Ref: IC-02'),
        q('itgc-q2e', '<p>Is there a process for emergency changes that maintains appropriate documentation and after-the-fact approval?</p>', undefined, 'Yes', '<p>Emergency change procedure documented; one emergency patch applied during the year with appropriate after-the-fact approval and documentation.</p>', 'W/P Ref: IC-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-itgc-3',
      title: '3. IT Operations',
      questions: [
        q('itgc-q3a', '<p>Is there a documented backup and recovery policy covering frequency of backups, retention periods, and off-site or cloud storage?</p>', undefined, 'Yes', '<p>Backup policy requires daily incremental and weekly full backups; data replicated to cloud storage (Azure) with 90-day retention.</p>', 'W/P Ref: IC-03'),
        q('itgc-q3b', '<p>Are backups tested periodically to confirm that data can be restored successfully?</p>', undefined, 'Yes', '<p>Quarterly backup restoration tests performed; most recent test completed January 2024 with successful recovery confirmed.</p>', 'W/P Ref: IC-03'),
        q('itgc-q3c', '<p>Are scheduled jobs and batch processes monitored, with failures promptly investigated and resolved?</p>', undefined, 'Yes', '<p>Automated monitoring alerts configured for all scheduled batch jobs; IT coordinator reviews daily exception reports.</p>', 'W/P Ref: IC-03'),
        q('itgc-q3d', '<p>Is there an incident management process for IT outages and security incidents, with documentation and root cause analysis?</p>', undefined, 'Yes', '<p>Incident management process in place; two minor outages during FY2024 were documented and resolved within SLA timeframes.</p>', 'W/P Ref: IC-03'),
        q('itgc-q3e', '<p>Is there a disaster recovery / business continuity plan that has been tested?</p>', undefined, 'Yes', '<p>Business continuity plan updated in September 2023; tabletop exercise completed with management; no significant gaps identified.</p>', 'W/P Ref: IC-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-itgc-4',
      title: '4. IT Risk Assessment',
      questions: [
        q('itgc-q4a', '<p>Have the key IT systems that directly support financial reporting (ERP, accounting system, payroll system) been identified?</p>', undefined, 'Yes', '<p>Key financial systems identified: Sage 300 (accounting/ERP), ADP (payroll), and vessel management system with ERP interface.</p>', 'W/P Ref: IC-04'),
        q('itgc-q4b', '<p>Have data integrity risks (completeness and accuracy of data transferred between systems, interfaces, spreadsheets) been assessed?</p>', undefined, 'Yes', '<p>Interface between vessel management system and Sage 300 assessed; automated reconciliation report reviewed daily by accounting staff.</p>', 'W/P Ref: IC-04'),
        q('itgc-q4c', '<p>Have cybersecurity risks (ransomware, data breaches, phishing) and the entity\'s controls to mitigate them been assessed?</p>', undefined, 'Yes', '<p>Cybersecurity risks assessed; entity has endpoint protection, email filtering, and completed phishing awareness training for all staff in November 2023.</p>', 'W/P Ref: IC-04'),
        q('itgc-q4d', '<p>Has the entity\'s use of cloud services and third-party service providers (SaaS, outsourced IT) been considered, including review of SOC 1 / SOC 2 reports where available?</p>', undefined, 'Yes', '<p>ADP SOC 1 Type II report reviewed; no exceptions noted relevant to payroll processing controls. Azure cloud services assessed via Microsoft compliance documentation.</p>', 'W/P Ref: IC-04'),
        q('itgc-q4e', '<p>Based on the ITGC assessment, has the overall IT control environment been assessed as effective, and has the conclusion been incorporated into the risk assessment?</p>', undefined, 'Yes', '<p>ITGC environment assessed as effective overall; no significant deficiencies identified. Conclusion incorporated into assertion-level RMM assessment.</p>', 'W/P Ref: IC-04'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-it-general-controls',
    title: 'IT General Controls (ITGC)',
    description: 'Documents the assessment of IT general controls including access controls, change management, IT operations, and IT risk assessment.',
    objective: `CAS 315 requires the auditor to obtain an understanding of the entity\'s IT environment and IT general controls as part of the risk assessment. This checklist documents the assessment of ITGCs that affect the reliability of information produced by the entity\'s IT systems used in the financial reporting process.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateFraudRiskAssessmentChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-fra-1',
      title: '1. Fraud Risk Factors',
      questions: [
        q('fra-q1a', '<p>Have incentive/pressure fraud risk factors been assessed (e.g., financial pressure on management or the entity, compensation tied to financial results, significant personal guarantees)?</p>', undefined, 'Yes', '<p>No significant incentive or pressure factors identified; management compensation is salary-based with no material performance bonuses tied to financial results.</p>', 'W/P Ref: FR-01'),
        q('fra-q1b', '<p>Have opportunity fraud risk factors been assessed (e.g., weak controls, significant related party transactions, complex transactions, management override of controls)?</p>', undefined, 'Yes', '<p>Control environment assessed as adequate; segregation of duties exists in key cycles. No significant related party transactions noted beyond normal director compensation.</p>', 'W/P Ref: FR-01'),
        q('fra-q1c', '<p>Have rationalization/attitude fraud risk factors been assessed (e.g., poor ethical culture, management history of misrepresentations, aggressive application of accounting policies)?</p>', undefined, 'Yes', '<p>Tone at the top assessed as strong; no prior history of misrepresentations. Accounting policies applied conservatively and consistently with prior year.</p>', 'W/P Ref: FR-01'),
        q('fra-q1d', '<p>Have the fraud risk factors been considered in aggregate and in combination to assess the overall fraud risk for the engagement?</p>', undefined, 'Yes', '<p>Fraud triangle factors considered in aggregate; overall fraud risk assessed as low to moderate, consistent with prior year assessment.</p>', 'W/P Ref: FR-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-fra-2',
      title: '2. Inquiries of Management',
      questions: [
        q('fra-q2a', '<p>Has management been asked whether they are aware of any actual, suspected or alleged fraud within the entity?</p>', undefined, 'Yes', '<p>CEO and CFO both confirmed no actual, suspected, or alleged fraud within Shipping Line Inc. during the year ended March 31, 2024.</p>', 'W/P Ref: FR-02'),
        q('fra-q2b', '<p>Has management been asked to describe their own fraud risk assessment process and the results of that assessment?</p>', undefined, 'Yes', '<p>Management performs an informal annual risk assessment; no fraud risks were identified by management for FY2024.</p>', 'W/P Ref: FR-02'),
        q('fra-q2c', '<p>Has management been asked about the programs and controls they have in place to prevent and detect fraud (e.g., whistleblower hotline, internal audit, anti-fraud policies)?</p>', undefined, 'Yes', '<p>Entity has a code of conduct policy and direct reporting line to the board for concerns; no formal whistleblower hotline given size of entity.</p>', 'W/P Ref: FR-02'),
        q('fra-q2d', '<p>Have inquiries been made of the internal audit function (if applicable) regarding any fraud-related findings or concerns?</p>', undefined, 'NA', '<p>Not applicable — entity does not have a formal internal audit function given its size (94 employees).</p>'),
        q('fra-q2e', '<p>Have inquiries been made of TCWG regarding their oversight of management\'s fraud risk assessment and their knowledge of any fraud or allegations of fraud?</p>', undefined, 'Yes', '<p>Board of directors confirmed no knowledge of fraud or allegations of fraud; oversight of management fraud risk assessment discussed at April 2024 board meeting.</p>', 'W/P Ref: FR-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-fra-3',
      title: '3. Presumed Fraud Risks',
      questions: [
        q('fra-q3a', '<p>Has the presumed fraud risk related to revenue recognition been considered? If the presumption has been rebutted, is the rationale documented with sufficient specificity?</p>', undefined, 'Yes', '<p>Revenue recognition fraud risk presumption maintained; not rebutted. Revenue recognition (voyage completion cutoff) identified as a significant risk requiring specific audit procedures. See W/P Ref: RV-01.</p>', 'W/P Ref: FR-03'),
        q('fra-q3b', '<p>Has the risk of management override of controls been identified as a significant risk in all audits (this risk cannot be rebutted)?</p>', undefined, 'Yes', '<p>Management override risk identified as a significant risk and cannot be rebutted per CAS 240. Journal entry testing and estimate review procedures planned accordingly.</p>', 'W/P Ref: FR-03'),
        q('fra-q3c', '<p>Have journal entries and other adjustments been identified as an area requiring specific audit procedures given the management override risk?</p>', undefined, 'Yes', '<p>Journal entry testing planned; selection criteria includes all entries above $25,000, all reversing entries, and all entries posted outside normal business hours.</p>', 'W/P Ref: FR-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-fra-4',
      title: '4. Significant Fraud Risk Factors Identified',
      questions: [
        q('fra-q4a', '<p>Have all fraud risks identified during the assessment been documented, including the type of risk (fraudulent financial reporting vs. misappropriation of assets) and the assertion affected?</p>', undefined, 'Yes', '<p>Two significant fraud risks documented: (1) revenue recognition cutoff — fraudulent financial reporting, completeness/cutoff assertion; (2) management override — all assertions.</p>', 'W/P Ref: FR-04'),
        q('fra-q4b', '<p>Has each identified fraud risk been evaluated to determine whether it constitutes a significant risk requiring specific audit responses?</p>', undefined, 'Yes', '<p>Both identified fraud risks classified as significant risks; specific audit responses documented in the audit plan and significant risks register.</p>', 'W/P Ref: FR-04'),
        q('fra-q4c', '<p>Has the engagement team brainstorming discussion specifically addressed fraud risks, and have the results been documented?</p>', undefined, 'Yes', '<p>Fraud risk brainstorming completed April 14, 2024; attended by partner J. Williams, manager S. Chen, and senior associates. Results documented in engagement files.</p>', 'W/P Ref: FR-04'),
      ],
      isExpanded: true
    },
    {
      id: 'section-fra-5',
      title: '5. Planned Responses to Identified Fraud Risks',
      questions: [
        q('fra-q5a', '<p>Have overall responses to the assessed fraud risks been planned (e.g., assigning experienced staff, increasing unpredictability of procedures, heightened professional skepticism)?</p>', undefined, 'Yes', '<p>Senior staff assigned to revenue cutoff and vessel impairment testing; unpredictable elements incorporated including unannounced cut-off observation and varying sample selection methods.</p>', 'W/P Ref: FR-05'),
        q('fra-q5b', '<p>Have specific substantive procedures been planned for each significant fraud risk identified?</p>', undefined, 'Yes', '<p>Specific procedures planned: revenue cutoff testing around March 31, 2024 (voyage completion documentation); expanded journal entry testing for management override risk.</p>', 'W/P Ref: FR-05'),
        q('fra-q5c', '<p>Have journal entry testing procedures been planned to address the risk of management override (selection criteria for testing documented)?</p>', undefined, 'Yes', '<p>Journal entry selection criteria documented; all entries above $25K, all manual entries posted by management, and all unusual entries near year-end selected for testing.</p>', 'W/P Ref: FR-05'),
        q('fra-q5d', '<p>Have procedures been planned to review significant accounting estimates for management bias?</p>', undefined, 'Yes', '<p>Review of vessel depreciation estimates, allowance for doubtful accounts, and accrued voyage revenue planned; retrospective review of prior year estimates to be performed.</p>', 'W/P Ref: FR-05'),
        q('fra-q5e', '<p>Have procedures been planned to test unusual or significant transactions identified during the engagement?</p>', undefined, 'Yes', '<p>No unusual or significant one-off transactions identified during planning; procedures include review of large and unusual journal entries as part of management override testing.</p>'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-fraud-risk-assessment',
    title: 'Fraud Risk Assessment',
    description: 'Documents the fraud risk assessment performed in accordance with CAS 240, including identification of fraud risk factors, inquiries of management, presumed risks, and planned responses.',
    objective: `CAS 240 requires the auditor to identify and assess risks of material misstatement due to fraud and to design and implement appropriate responses to those risks. This checklist documents the fraud risk assessment process including consideration of the fraud triangle, management inquiries, the two presumed fraud risks, and planned audit responses.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateSignificantRisksRegisterChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-srr-1',
      title: '1. Identification of Significant Risks',
      questions: [
        q('srr-q1a', '<p>Have all significant risks been identified and documented with a description of the risk and the specific assertion(s) affected (existence, completeness, accuracy, valuation, cutoff, classification, presentation)?</p>', undefined, 'Yes', '<p>Three significant risks identified and documented: (1) revenue recognition cutoff — completeness/cutoff; (2) vessel impairment — valuation; (3) foreign currency translation — accuracy/valuation.</p>', 'W/P Ref: SR-01'),
        q('srr-q1b', '<p>Has the account balance, class of transactions or disclosure affected by each significant risk been identified?</p>', undefined, 'Yes', '<p>Affected accounts identified: Revenue ($12.5M) and deferred revenue for risk 1; Vessels PP&E ($8.2M) for risk 2; USD-denominated AR/AP balances for risk 3.</p>', 'W/P Ref: SR-01'),
        q('srr-q1c', '<p>Have the sources of each significant risk been documented (industry factors, entity-specific factors, nature of the account, complexity of accounting)?</p>', undefined, 'Yes', '<p>Sources documented: marine shipping revenue recognition requires judgment on voyage completion percentage; vessel impairment involves significant estimates; USD transactions expose entity to exchange rate risk.</p>', 'W/P Ref: SR-01'),
        q('srr-q1d', '<p>Has the significant risk register been reviewed by the engagement manager and partner to confirm completeness?</p>', undefined, 'Yes', '<p>Register reviewed and approved by manager S. Chen and partner J. Williams on April 15, 2024 prior to commencement of fieldwork.</p>', 'W/P Ref: SR-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-srr-2',
      title: '2. Inherent Risk Assessment',
      questions: [
        q('srr-q2a', '<p>For each significant risk, has the likelihood of material misstatement been assessed (high/medium/low) considering the susceptibility of the account to error or manipulation?</p>', undefined, 'Yes', '<p>Revenue recognition cutoff: high likelihood (management judgment on voyage completion). Vessel impairment: medium likelihood. Foreign currency: medium likelihood based on volume of USD transactions.</p>', 'W/P Ref: SR-02'),
        q('srr-q2b', '<p>For each significant risk, has the magnitude of potential misstatement been assessed in relation to overall and performance materiality?</p>', undefined, 'Yes', '<p>Revenue risk magnitude assessed as high (potential misstatement could exceed overall materiality of $125K). Vessel impairment and FX risks assessed as medium magnitude.</p>', 'W/P Ref: SR-02'),
        q('srr-q2c', '<p>Has the inherent risk level (combination of likelihood and magnitude) been determined for each significant risk?</p>', undefined, 'Yes', '<p>Inherent risk assessed as: revenue cutoff — high; vessel impairment — high (significant estimation); foreign currency — medium.</p>', 'W/P Ref: SR-02'),
        q('srr-q2d', '<p>Have risks involving significant judgment, estimation uncertainty, or complex transactions been specifically identified as having higher inherent risk?</p>', undefined, 'Yes', '<p>Vessel impairment assessment involves significant management judgment regarding recoverable amount and vessel useful economic lives; assessed as higher inherent risk accordingly.</p>', 'W/P Ref: SR-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-srr-3',
      title: '3. Control Environment Assessment',
      questions: [
        q('srr-q3a', '<p>Have the relevant controls that address each significant risk been identified?</p>', undefined, 'Yes', '<p>Relevant controls identified for each significant risk; documented in SCOT — Revenue Cycle and SCOT — Capital Assets working papers.</p>', 'W/P Ref: SR-03'),
        q('srr-q3b', '<p>Has the design adequacy of the relevant controls been assessed — are the controls capable of preventing or detecting material misstatement if operating effectively?</p>', undefined, 'Yes', '<p>Design of revenue cutoff controls (voyage completion checklists, CFO review of revenue accruals) assessed as adequate. Vessel impairment review controls assessed as adequate.</p>', 'W/P Ref: SR-03'),
        q('srr-q3c', '<p>Has the implementation of the relevant controls been confirmed (evidence that controls exist and are in use)?</p>', undefined, 'Yes', '<p>Implementation confirmed through observation and inquiry; voyage completion documentation and year-end revenue accrual review evidenced in client files.</p>', 'W/P Ref: SR-03'),
        q('srr-q3d', '<p>For significant risks where control reliance is planned, has the operating effectiveness of controls been planned for testing?</p>', undefined, 'Yes', '<p>Substantive-only approach adopted for all three significant risks per CAS 330 requirements; no reliance on controls for these risks.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-srr-4',
      title: '4. Audit Response',
      questions: [
        q('srr-q4a', '<p>For each significant risk, have the nature of planned audit procedures been documented (inspection, confirmation, recalculation, substantive analytical procedures, etc.)?</p>', undefined, 'Yes', '<p>Procedures documented: revenue — inspection of voyage logs and cut-off testing; vessel impairment — inspection of impairment model and independent valuation assessment; FX — recalculation of year-end translation.</p>', 'W/P Ref: SR-04'),
        q('srr-q4b', '<p>For each significant risk, has the timing of planned procedures been determined (interim vs. year-end)?</p>', undefined, 'Yes', '<p>All significant risk procedures planned at year-end (April 14-25, 2024 fieldwork); no interim procedures planned for significant risks given risk profile.</p>', 'W/P Ref: SR-04'),
        q('srr-q4c', '<p>For each significant risk, has the extent of planned procedures been determined (sample sizes, coverage ratios)?</p>', undefined, 'Yes', '<p>Sample sizes documented: revenue cutoff — 25 voyages around year-end; journal entries — 100% of entries above $25K; vessel impairment — all three vessels assessed individually.</p>', 'W/P Ref: SR-04'),
        q('srr-q4d', '<p>For significant risks, has CAS 330 been considered regarding the requirement for substantive procedures regardless of the assessed level of control risk?</p>', undefined, 'Yes', '<p>CAS 330 requirements considered; substantive procedures planned for all significant risks regardless of control environment assessment.</p>', 'W/P Ref: SR-04'),
        q('srr-q4e', '<p>Have the planned responses to each significant risk been linked to specific working paper references in the audit plan?</p>', undefined, 'Yes', '<p>All planned responses linked to working paper references: revenue cutoff to RV-02, vessel impairment to FA-03, foreign currency to FX-01.</p>', 'W/P Ref: SR-04'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-significant-risks-register',
    title: 'Significant Risks Register',
    description: 'Documents the identification, assessment, and planned audit responses for each significant risk identified during the risk assessment.',
    objective: `CAS 315 requires the auditor to identify and assess risks of material misstatement that, in the auditor\'s judgment, require special audit consideration. This register documents each significant risk, the inherent risk assessment, the relevant controls, and the planned audit responses.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateRMMChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-rmm-1',
      title: '1. Financial Statement Level RMM',
      questions: [
        q('rmm-q1a', '<p>Has the overall RMM at the financial statement level been assessed, considering the control environment and any pervasive risks that affect many assertions across the financial statements?</p>', undefined, 'Yes', '<p>Financial statement level RMM assessed as moderate; control environment is generally adequate with no pervasive weaknesses identified across Shipping Line Inc.\'s operations.</p>', 'W/P Ref: RM-01'),
        q('rmm-q1b', '<p>Have pervasive risks (risks that are not confined to a single account or assertion) been identified and documented?</p>', undefined, 'Yes', '<p>Management override of controls identified as a pervasive risk affecting all assertions; foreign currency risk also identified as potentially pervasive given USD-denominated transactions across multiple account lines.</p>', 'W/P Ref: RM-01'),
        q('rmm-q1c', '<p>Has the integrity and ethical values of management been considered in the overall RMM assessment?</p>', undefined, 'Yes', '<p>Management integrity assessed as high; no prior history of misrepresentations, and tone at the top assessed as strong through inquiries and observation.</p>', 'W/P Ref: RM-01'),
        q('rmm-q1d', '<p>Have any going concern risks or management bias in accounting estimates been incorporated into the financial statement level RMM assessment?</p>', undefined, 'Yes', '<p>No going concern indicators identified. Management bias risk considered in the context of vessel impairment estimates and revenue accruals; no evidence of systematic bias detected.</p>', 'W/P Ref: RM-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rmm-2',
      title: '2. Assertion Level RMM by Account',
      questions: [
        q('rmm-q2a', '<p>For each significant account and class of transactions, have RMMs been assessed at the assertion level (existence/occurrence, completeness, accuracy/valuation, cutoff, classification)?</p>', undefined, 'Yes', '<p>Assertion-level RMM assessed for all significant accounts: revenue, AR, vessels/PP&E, AP, long-term debt, payroll, and cash. RMM matrix completed and filed.</p>', 'W/P Ref: RM-02'),
        q('rmm-q2b', '<p>Has the RMM for revenue (including revenue recognition) been assessed at each relevant assertion level?</p>', undefined, 'Yes', '<p>Revenue RMM: occurrence — low; completeness — medium; cutoff — high (voyage completion at year-end); accuracy — medium. Significant risk identified for cutoff assertion.</p>', 'W/P Ref: RM-02'),
        q('rmm-q2c', '<p>Has the RMM for accounts requiring significant estimates (e.g., allowance for doubtful accounts, inventory obsolescence, asset impairment) been assessed as higher due to estimation uncertainty?</p>', undefined, 'Yes', '<p>Vessel impairment and allowance for doubtful accounts assessed as high RMM at the valuation assertion due to significant management estimation and judgment involved.</p>', 'W/P Ref: RM-02'),
        q('rmm-q2d', '<p>Has the RMM for accounts susceptible to misappropriation (e.g., cash, payroll) been assessed?</p>', undefined, 'Yes', '<p>Cash and payroll assessed for misappropriation risk; control environment for both assessed as adequate with appropriate segregation of duties in place.</p>', 'W/P Ref: RM-02'),
        q('rmm-q2e', '<p>Has the RMM assessment been documented in a manner that clearly links each risk to the relevant assertion, account and planned audit procedures?</p>', undefined, 'Yes', '<p>RMM matrix documented with cross-references to planned audit procedures for each significant account and assertion; reviewed by engagement manager.</p>', 'W/P Ref: RM-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rmm-3',
      title: '3. Control Risk Assessment',
      questions: [
        q('rmm-q3a', '<p>Has the control risk been assessed for each significant account based on the understanding of the design and implementation of relevant controls?</p>', undefined, 'Yes', '<p>Control risk assessed for all significant accounts; moderate control risk for revenue, AP, and payroll cycles based on documented controls; higher control risk for vessel impairment (no formal internal review process).</p>', 'W/P Ref: RM-03'),
        q('rmm-q3b', '<p>Where it is planned to rely on controls to reduce the extent of substantive testing, have tests of controls been planned to assess operating effectiveness?</p>', undefined, 'Yes', '<p>Limited control reliance planned for AP three-way match and payroll authorization controls; tests of controls planned for these two areas to support reduced substantive testing.</p>', 'W/P Ref: RM-03'),
        q('rmm-q3c', '<p>Where control risk has been assessed as high (or where it is not efficient to rely on controls), has the audit plan been adjusted to increase substantive testing?</p>', undefined, 'Yes', '<p>Substantive-only approach applied to revenue cutoff, vessel impairment, and foreign currency; expanded substantive procedures planned to compensate for higher control risk in these areas.</p>', 'W/P Ref: RM-03'),
        q('rmm-q3d', '<p>Has the impact of IT controls on the overall control risk assessment been considered?</p>', undefined, 'Yes', '<p>ITGC assessed as effective; positive impact on control risk assessment for automated controls in AP matching and payroll processing. ITGC conclusions documented in IC-04.</p>', 'W/P Ref: RM-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rmm-4',
      title: '4. Residual Risk',
      questions: [
        q('rmm-q4a', '<p>Based on the assessed RMM (inherent risk × control risk), has the required detection risk been determined for each significant account and assertion?</p>', undefined, 'Yes', '<p>Detection risk determined for each significant account; low detection risk required for revenue cutoff and vessel impairment (high RMM); moderate detection risk for remaining accounts.</p>', 'W/P Ref: RM-04'),
        q('rmm-q4b', '<p>Has the nature, timing, and extent of substantive procedures been designed to achieve the required detection risk?</p>', undefined, 'Yes', '<p>Substantive procedures designed to achieve required detection risk; expanded sample sizes, year-end timing, and more persuasive procedures (inspection over analytical) applied to high-RMM accounts.</p>', 'W/P Ref: RM-04'),
        q('rmm-q4c', '<p>For accounts with high assessed RMM, have more extensive, persuasive or unpredictable substantive procedures been planned?</p>', undefined, 'Yes', '<p>Revenue cutoff: 25 voyages tested with inspection of underlying documentation. Vessel impairment: individual assessment of all three vessels including review of management\'s impairment model.</p>', 'W/P Ref: RM-04'),
        q('rmm-q4d', '<p>Has the RMM assessment and the resulting audit plan been reviewed and approved by the engagement manager and partner?</p>', undefined, 'Yes', '<p>RMM assessment and audit plan reviewed and approved by manager S. Chen and partner J. Williams on April 15, 2024.</p>', 'W/P Ref: RM-04'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-rmm',
    title: 'Risk of Material Misstatement (RMM)',
    description: 'Documents the assessment of the risk of material misstatement at both the financial statement level and the assertion level for significant accounts and disclosures.',
    objective: `CAS 315 requires the auditor to identify and assess the risks of material misstatement at the financial statement level and at the assertion level for classes of transactions, account balances, and disclosures. This checklist documents the RMM assessment, control risk evaluation, and the detection risk requirements that drive the design of substantive audit procedures.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateOverallAuditResponseChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-oar-1',
      title: '1. Overall Responses to Pervasive Risks',
      questions: [
        q('oar-q1a', '<p>Have overall responses to financial statement level risks been documented, addressing the need for heightened professional skepticism throughout the engagement?</p>', undefined, 'Yes', '<p>Overall audit responses documented in the audit plan addressing revenue recognition (voyage completion), vessel impairment, and USD foreign currency exposure. Heightened skepticism applied throughout fieldwork.</p>', 'W/P Ref: RA-01'),
        q('oar-q1b', '<p>Have more experienced or specialized staff been assigned to areas of higher risk?</p>', undefined, 'Yes', '<p>S. Chen (engagement manager) personally directed testing of vessel PP&E ($8.2M) and revenue cutoff given their significance and complexity within the maritime freight industry.</p>', 'W/P Ref: RA-01'),
        q('oar-q1c', '<p>Has increased supervision of team members been planned for high-risk areas?</p>', undefined, 'Yes', '<p>Increased supervision documented for revenue recognition and vessel impairment testing, with daily manager check-ins scheduled throughout fieldwork April 14–25, 2024.</p>'),
        q('oar-q1d', '<p>Has the use of specialists been considered and arranged for areas requiring specialized knowledge?</p>', undefined, 'NA', '<p>No external specialists required. Vessel valuations relied on management-obtained appraisals which were evaluated for reasonableness by the engagement team.</p>'),
        q('oar-q1e', '<p>Has the need for increased emphasis on professional skepticism been communicated to all engagement team members in the planning meeting?</p>', undefined, 'Yes', '<p>Communicated at team planning meeting held April 7, 2024 (minutes on file). Specific emphasis placed on revenue recognition and management estimates for vessel impairment.</p>', 'W/P Ref: PL-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-oar-2',
      title: '2. Unpredictability of Audit Procedures',
      questions: [
        q('oar-q2a', '<p>Have measures been incorporated to introduce unpredictability in the selection of audit procedures (different from those expected or used in prior years)?</p>', undefined, 'Yes', '<p>Expanded AR confirmation scope to include smaller balances not confirmed in prior year; added unannounced review of voyage completion documentation at port operations office.</p>', 'W/P Ref: PL-02'),
        q('oar-q2b', '<p>Has the timing of some procedures been varied (e.g., performing inventory observation at an unannounced date, confirming accounts at a date other than year-end)?</p>', undefined, 'Yes', '<p>AR confirmations sent at March 31 (year-end). Fuel and supplies inventory observation performed at an interim date (February 2024) on an unannounced basis.</p>'),
        q('oar-q2c', '<p>Have some procedures been performed at locations not previously visited or selected on an unexpected basis?</p>', undefined, 'Yes', '<p>Vessel operations records reviewed at the port facility in addition to head office — not done in prior year engagement.</p>'),
        q('oar-q2d', '<p>Have the elements of unpredictability been documented in the audit plan with the rationale for how they address the risk of management override?</p>', undefined, 'Yes', '<p>Unpredictability measures documented in the audit plan under the management override risk response, per CAS 330.A43.</p>', 'W/P Ref: PL-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-oar-3',
      title: '3. Response to Significant Risks',
      questions: [
        q('oar-q3a', '<p>For each significant risk identified in the risk assessment, has a specific audit response been documented (nature, timing, and extent of procedures)?</p>', undefined, 'Yes', '<p>Three significant risks identified: (1) revenue recognition — voyage completion, (2) vessel impairment ($8.2M PP&E), (3) USD foreign currency transactions. Specific NTE of procedures documented for each.</p>', 'W/P Ref: RA-04'),
        q('oar-q3b', '<p>For significant risks involving significant estimates, have procedures been planned to test the reasonableness of the estimate, including the data and assumptions used?</p>', undefined, 'Yes', '<p>Vessel depreciation and impairment assessment tested by evaluating management assumptions against Baltic Dry Index data and comparable vessel market transactions.</p>', 'W/P Ref: PPE-01'),
        q('oar-q3c', '<p>For significant risks involving complex transactions, have procedures been planned to obtain sufficient understanding of the terms and accounting treatment?</p>', undefined, 'Yes', '<p>All voyage contracts reviewed for terms and completion status at March 31, 2024 to confirm appropriate revenue recognition under the voyage completion method per ASPE 3400.</p>', 'W/P Ref: REV-01'),
        q('oar-q3d', '<p>Have substantive procedures been planned for all significant risks, regardless of the assessed level of control risk (as required by CAS 330)?</p>', undefined, 'Yes', '<p>Substantive tests of details performed for all three significant risk areas regardless of control reliance, in compliance with CAS 330.21.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-oar-4',
      title: '4. Response to Management Override Risk',
      questions: [
        q('oar-q4a', '<p>Has journal entry testing been planned to address the risk of management override, including the criteria for selecting journal entries for testing?</p>', undefined, 'Yes', '<p>Journal entry testing planned for all entries above $10,000, all manual year-end entries, and a random sample of routine entries. Criteria documented in the JE testing plan.</p>', 'W/P Ref: JE-01'),
        q('oar-q4b', '<p>Have procedures been planned to review accounting estimates for possible management bias?</p>', undefined, 'Yes', '<p>Significant estimates (vessel depreciation, allowance for doubtful accounts, accrued voyage revenue) reviewed for indicators of management bias by comparing to prior year trends and external benchmarks.</p>'),
        q('oar-q4c', '<p>Have procedures been planned to evaluate the business rationale for unusual or significant transactions identified during the engagement?</p>', undefined, 'Yes', '<p>No unusual or non-routine significant transactions identified during the audit. Procedure completed with no exceptions noted.</p>'),
        q('oar-q4d', '<p>Have year-end and post year-end journal entries been specifically included in the scope of journal entry testing?</p>', undefined, 'Yes', '<p>All manual journal entries in March 2024 and April 2024 (through report date May 2024) specifically included in JE testing scope.</p>', 'W/P Ref: JE-01'),
        q('oar-q4e', '<p>Has the overall audit response been reviewed and approved by the engagement partner prior to commencement of fieldwork?</p>', undefined, 'Yes', '<p>Engagement partner J. Williams reviewed and approved the overall audit response on April 12, 2024, prior to commencement of fieldwork on April 14, 2024.</p>', 'W/P Ref: PL-01'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-overall-audit-response',
    title: 'Overall Audit Response',
    description: 'Documents the overall audit responses to assessed risks of material misstatement, including responses to pervasive risks, unpredictability measures, responses to significant risks, and procedures to address management override.',
    objective: `CAS 330 requires the auditor to design and implement overall responses to address the assessed risks of material misstatement at the financial statement level, and to design and perform further audit procedures whose nature, timing, and extent are responsive to the assessed risks at the assertion level. This checklist documents the planned overall audit responses.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateTestOfControlsChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-toc-1',
      title: '1. Controls Selected for Testing',
      questions: [
        q('toc-q1a', '<p>Have the controls selected for testing been documented with a clear description of each control, the control objective, and the assertion(s) addressed?</p>', undefined, 'Yes', '<p>Four controls selected: invoice authorization, AP three-way match, bank reconciliation approval, and payroll approval — each documented with control objective and assertion(s) addressed.</p>', 'W/P Ref: TOC-01'),
        q('toc-q1b', '<p>Has the frequency of each control been documented (daily, weekly, monthly, annually) as this determines the appropriate sample size?</p>', undefined, 'Yes', '<p>Frequencies documented: invoice authorization and AP three-way match (per transaction); bank reconciliation (monthly); payroll approval (bi-weekly). Sample sizes determined accordingly.</p>', 'W/P Ref: TOC-01'),
        q('toc-q1c', '<p>Has the sampling approach been determined for each control (e.g., random selection, haphazard selection) and the sample size calculated using an appropriate methodology?</p>', undefined, 'Yes', '<p>Random sampling used for all controls. Sample sizes: 25 for transaction-level controls, 6 for monthly controls, 12 for bi-weekly controls — consistent with CAS 530.</p>', 'W/P Ref: TOC-02'),
        q('toc-q1d', '<p>For IT application controls, has the evidence of the control\'s operation been identified (e.g., system logs, exception reports)?</p>', undefined, 'NA', '<p>No IT application controls selected for reliance. All controls tested are manual controls.</p>'),
        q('toc-q1e', '<p>For manual controls, has the evidence of the control\'s operation been identified (e.g., signatures, approvals, reconciliations)?</p>', undefined, 'Yes', '<p>Evidence identified: authorized signatures on voyage invoices, stamped AP three-way match documents, signed monthly bank reconciliations, approved payroll registers.</p>', 'W/P Ref: TOC-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-toc-2',
      title: '2. Test Performance',
      questions: [
        q('toc-q2a', '<p>Has the design effectiveness of each selected control been tested (is the control capable of preventing or detecting material misstatement)?</p>', undefined, 'Yes', '<p>Design effectiveness confirmed for all four controls through walkthroughs conducted during fieldwork April 14–17, 2024. All controls appropriately designed to address identified assertions.</p>', 'W/P Ref: TOC-03'),
        q('toc-q2b', '<p>Has the implementation of each selected control been tested (evidence that the control exists and has been put into operation)?</p>', undefined, 'Yes', '<p>Implementation confirmed through observation and inspection of evidence for all four controls during walkthrough.</p>', 'W/P Ref: TOC-03'),
        q('toc-q2c', '<p>Has the operating effectiveness of each selected control been tested by examining evidence that the control operated consistently throughout the period?</p>', undefined, 'Yes', '<p>Operating effectiveness tested through sample examination. One minor deviation noted in AP three-way match (1/25 samples); all other controls had 0% deviation rate. Results in TOC-04.</p>', 'W/P Ref: TOC-04'),
        q('toc-q2d', '<p>Where reliance on controls from an interim period is planned to cover the full period, have additional procedures been planned to cover the period between interim and year-end?</p>', undefined, 'NA', '<p>Control testing performed on a full-year basis using year-round samples. No roll-forward procedures required.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-toc-3',
      title: '3. Results & Deviations',
      questions: [
        q('toc-q3a', '<p>Have all deviations from the prescribed control been identified, investigated, and documented?</p>', undefined, 'Yes', '<p>One deviation identified in AP three-way match (1/25 samples). Investigated and determined to be an isolated clerical error with no financial statement impact. Documented in TOC-04.</p>', 'W/P Ref: TOC-04'),
        q('toc-q3b', '<p>Has the deviation rate been calculated and compared to the tolerable rate of deviation?</p>', undefined, 'Yes', '<p>Deviation rate of 4% (1/25) for AP three-way match is below the tolerable rate of 10%. All other controls had 0% deviation rates.</p>', 'W/P Ref: TOC-04'),
        q('toc-q3c', '<p>Where the deviation rate exceeds the tolerable rate, has the impact on the planned reliance on controls been assessed?</p>', undefined, 'NA', '<p>No controls exceeded the tolerable deviation rate. Planned reliance maintained for all four controls.</p>'),
        q('toc-q3d', '<p>Have the deviations been evaluated to determine whether they are indicative of fraud or error beyond the control testing scope?</p>', undefined, 'Yes', '<p>The single AP three-way match deviation evaluated and determined to be an isolated data entry error, not indicative of fraud or systemic control failure.</p>'),
        q('toc-q3e', '<p>Have deviations been communicated to management and TCWG where required (significant deficiencies or material weaknesses)?</p>', undefined, 'Yes', '<p>The isolated AP deviation communicated to management as a minor observation in the management letter. Not elevated to significant deficiency given isolated nature and below-tolerable rate.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-toc-4',
      title: '4. Conclusion on Control Reliance',
      questions: [
        q('toc-q4a', '<p>Has a conclusion been reached for each control tested regarding whether it was operating effectively throughout the period?</p>', undefined, 'Yes', '<p>Conclusion documented: all four controls assessed as operating effectively throughout the year ended March 31, 2024, supporting planned reliance.</p>', 'W/P Ref: TOC-05'),
        q('toc-q4b', '<p>Has the impact of control testing results on the nature, timing, and extent of planned substantive procedures been assessed and documented?</p>', undefined, 'Yes', '<p>Control reliance maintained as planned. Substantive procedures adjusted accordingly — reduced AP sample sizes given effective three-way match control.</p>', 'W/P Ref: TOC-05'),
        q('toc-q4c', '<p>Where controls have been assessed as not operating effectively, has the audit plan been updated to increase substantive testing?</p>', undefined, 'NA', '<p>All controls assessed as operating effectively. No changes to substantive testing required.</p>'),
        q('toc-q4d', '<p>Has the overall conclusion on control reliance been reviewed and approved by the engagement manager/partner?</p>', undefined, 'Yes', '<p>Overall conclusion on control reliance reviewed and approved by S. Chen (engagement manager) on April 22, 2024.</p>', 'W/P Ref: TOC-05'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-test-of-controls',
    title: 'Test of Controls',
    description: 'Documents the tests of controls performed, including controls selected, test approach, results, deviations, and conclusions on control reliance.',
    objective: `CAS 330 requires the auditor, when the audit approach relies on the operating effectiveness of controls, to test those controls. This checklist documents the test of controls work performed, including the evaluation of deviations and the impact on the planned substantive procedures.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateSubstantiveAnalyticalProceduresChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-sap-1',
      title: '1. Objective & Assertion',
      questions: [
        q('sap-q1a', '<p>Has the objective of each substantive analytical procedure been documented — which account balance or class of transactions is being tested?</p>', undefined, 'Yes', '<p>SAP objectives documented for: (1) freight revenue by route, (2) vessel operating expenses, (3) crew payroll. Each objective and target account documented in the audit plan.</p>', 'W/P Ref: SAP-01'),
        q('sap-q1b', '<p>Has the specific assertion(s) being addressed by each procedure been identified (completeness, existence, accuracy, valuation, cutoff)?</p>', undefined, 'Yes', '<p>Assertions identified for each SAP: revenue SAP addresses completeness and accuracy; operating expenses SAP addresses completeness and cutoff; payroll SAP addresses accuracy and valuation.</p>'),,
        q('sap-q1c', '<p>Has the suitability of using substantive analytical procedures for the identified assertion been assessed, considering the availability of reliable data and the predictability of the relationship?</p>', undefined, 'Yes', '<p>Suitability assessed. Revenue SAP uses voyage records (highly predictable relationship). Payroll SAP uses headcount and rate data (reliable). Both assessed as appropriate for substantive reliance.</p>', 'W/P Ref: SAP-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-sap-2',
      title: '2. Expectation Development',
      questions: [
        q('sap-q2a', '<p>Has an independent expectation been developed for the account balance or transaction class being tested?</p>', undefined, 'Yes', '<p>Independent expectations developed for all three SAPs. Revenue expectation based on voyage count × average freight rate; payroll expectation based on headcount × average salary.</p>', 'W/P Ref: SAP-02'),
        q('sap-q2b', '<p>Has the basis for the expectation been documented (prior year balance, budget, regression analysis, industry data, related accounts)?</p>', undefined, 'Yes', '<p>Basis documented: revenue expectation uses voyage logs and prior year rates adjusted for freight market movements; operating expense expectation uses prior year adjusted for known cost changes.</p>', 'W/P Ref: SAP-02'),
        q('sap-q2c', '<p>Is the data used to develop the expectation reliable — has its source and accuracy been considered?</p>', undefined, 'Yes', '<p>Data reliability assessed: voyage logs and port records obtained directly from operations system; payroll rates confirmed against signed employment contracts. Sources considered reliable.</p>'),
        q('sap-q2d', '<p>Is the expectation sufficiently precise to detect a misstatement that, individually or in aggregate, could be material?</p>', undefined, 'Yes', '<p>Expectation precision assessed as sufficient. Revenue expectation precision estimated at ±$95K, which is below performance materiality of $87.5K. Threshold set accordingly.</p>', 'W/P Ref: SAP-02'),
        q('sap-q2e', '<p>Has the expectation been developed independently of the recorded amount (i.e., not derived from the recorded amount itself)?</p>', undefined, 'Yes', '<p>All expectations developed from operational data sources (voyage logs, headcount records) prior to comparing to the recorded amounts in the general ledger.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-sap-3',
      title: '3. Acceptable Threshold',
      questions: [
        q('sap-q3a', '<p>Has the acceptable amount of unexplained difference (threshold) been established, having regard to performance materiality?</p>', undefined, 'Yes', '<p>Threshold established at $75,000 for revenue SAP and $60,000 for expense SAPs — both below performance materiality of $87,500 — to provide the required level of assurance.</p>', 'W/P Ref: SAP-03'),
        q('sap-q3b', '<p>Is the threshold sufficiently small that if the difference between actual and expected does not exceed it, the auditor can conclude with the desired level of assurance?</p>', undefined, 'Yes', '<p>Thresholds set below performance materiality. If unexplained differences do not exceed these thresholds, sufficient assurance can be drawn at the planned level of reliance.</p>'),
        q('sap-q3c', '<p>Has the relationship between the threshold and performance materiality been documented?</p>', undefined, 'Yes', '<p>Documented: thresholds set at 60–86% of performance materiality ($87,500) to ensure unexplained differences below threshold are not material to the financial statements.</p>', 'W/P Ref: SAP-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-sap-4',
      title: '4. Results & Explanation',
      questions: [
        q('sap-q4a', '<p>Has the actual recorded amount been compared to the developed expectation and the unexplained difference calculated?</p>', undefined, 'Yes', '<p>Comparisons completed. Revenue: recorded $12.5M vs. expectation $12.35M (difference $150K). Operating expenses: recorded $8.2M vs. expectation $8.15M (difference $50K). Details in SAP-04.</p>', 'W/P Ref: SAP-04'),
        q('sap-q4b', '<p>Where the unexplained difference exceeds the threshold, have explanations been sought from management?</p>', undefined, 'Yes', '<p>Revenue difference of $150K exceeded threshold of $75K. Management explained $120K relates to three new freight contracts signed in Q4 not in prior year. Corroborated with contract documentation.</p>', 'W/P Ref: SAP-04'),
        q('sap-q4c', '<p>Have management\'s explanations been corroborated with audit evidence?</p>', undefined, 'Yes', '<p>Management explanations corroborated: new contracts reviewed, corresponding voyage logs confirmed, remaining unexplained difference of $30K is below threshold and assessed as not material.</p>', 'W/P Ref: SAP-04'),
        q('sap-q4d', '<p>Where management\'s explanations are not satisfactory or cannot be corroborated, have additional or alternative substantive procedures been performed?</p>', undefined, 'NA', '<p>Management explanations for all SAP differences were satisfactory and corroborated with audit evidence. No additional procedures required.</p>'),
        q('sap-q4e', '<p>Has a conclusion been documented stating whether the substantive analytical procedure provides sufficient appropriate evidence for the relevant assertion?</p>', undefined, 'Yes', '<p>Conclusions documented for all three SAPs: all provide sufficient appropriate evidence for the relevant assertions. Revenue completeness and accuracy, operating expense completeness, and payroll accuracy assertions supported.</p>', 'W/P Ref: SAP-05'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-substantive-analytical-procedures',
    title: 'Substantive Analytical Procedures',
    description: 'Documents the substantive analytical procedures performed, including expectation development, acceptable threshold, comparison of actual to expected, and investigation of differences.',
    objective: `CAS 330 and CAS 520 require that when substantive analytical procedures are used as the primary source of evidence for an assertion, they must be sufficiently precise to provide the required level of assurance. This checklist documents the design and results of substantive analytical procedures performed.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateTestOfDetailsRevenueChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-rev-1',
      title: '1. Revenue Recognition Policy',
      questions: [
        q('rev-q1a', '<p>Has the entity\'s revenue recognition policy been obtained and reviewed for compliance with the applicable framework (IFRS 15, ASPE Section 3400)?</p>', undefined, 'Yes', '<p>Revenue recognition policy reviewed and confirmed compliant with ASPE Section 3400. Shipping Line Inc. recognizes freight revenue upon voyage completion, which is appropriate for the maritime freight industry.</p>', 'W/P Ref: REV-01'),
        q('rev-q1b', '<p>Have the entity\'s performance obligations been identified and assessed to confirm that revenue is recognized when (or as) each obligation is satisfied?</p>', undefined, 'Yes', '<p>Single performance obligation identified per freight contract: delivery of cargo to destination port. Revenue recognized at voyage completion, which aligns with when the obligation is satisfied.</p>', 'W/P Ref: REV-01'),
        q('rev-q1c', '<p>For long-term contracts or arrangements, has the method for measuring progress toward completion been assessed for reasonableness?</p>', undefined, 'NA', '<p>No long-term contracts identified. All voyage contracts are short-duration (typically 15–45 days) with revenue recognized at completion. Percentage-of-completion method not applicable.</p>'),
        q('rev-q1d', '<p>Have variable consideration, contract modifications, or significant financing components been identified and assessed for appropriate accounting treatment?</p>', undefined, 'Yes', '<p>Demurrage charges (variable consideration) identified. Management records demurrage when earned and estimable. Three contracts reviewed for demurrage — amounts recorded are reasonable and supportable.</p>', 'W/P Ref: REV-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rev-2',
      title: '2. Completeness Testing',
      questions: [
        q('rev-q2a', '<p>Have procedures been performed to confirm that all revenue earned during the period has been recorded (e.g., tracing from shipping/delivery records or service completion documentation to invoices to the GL)?</p>', undefined, 'Yes', '<p>Traced 25 voyage completion certificates to freight invoices to GL postings. All sampled voyages completed before March 31 were recorded in the correct period. No completeness exceptions noted.</p>', 'W/P Ref: REV-03'),
        q('rev-q2b', '<p>Has the completeness of the revenue population been tested (e.g., sequence test of invoice numbers, reconciliation of total invoices to GL)?</p>', undefined, 'Yes', '<p>Invoice sequence test performed — no gaps in invoice sequence identified. Total invoices per billing system reconciled to revenue per GL with no unexplained differences.</p>', 'W/P Ref: REV-03'),
        q('rev-q2c', '<p>Has unearned revenue (deferred revenue) been reviewed for transactions that should have been recognized in the current period?</p>', undefined, 'Yes', '<p>Deferred revenue balance of $28K reviewed and adjusted per AJE (deferred revenue reclassification). Remaining balance confirmed as relates to voyages in progress at March 31, 2024.</p>', 'W/P Ref: REV-04'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rev-3',
      title: '3. Cutoff Testing',
      questions: [
        q('rev-q3a', '<p>Have the last 15 invoices issued before year-end been tested for proper period (was revenue recognized in the correct period)?</p>', undefined, 'Yes', '<p>Last 15 invoices (dated March 15–31, 2024) tested. 14 of 15 correctly recorded in FY2024. One invoice ($45K) identified as cutoff error — voyage not yet complete at March 31. Adjusted per AJE-001.</p>', 'W/P Ref: REV-05'),
        q('rev-q3b', '<p>Have the first 15 invoices issued after year-end been tested to confirm that revenue has not been prematurely recognized?</p>', undefined, 'Yes', '<p>First 15 invoices after March 31, 2024 reviewed. All invoices relate to voyages completed after year-end and were correctly recorded in April 2024. No premature recognition identified.</p>', 'W/P Ref: REV-05'),
        q('rev-q3c', '<p>Has the billing cut-off been reconciled to the shipping/service completion cut-off to confirm alignment with the revenue recognition policy?</p>', undefined, 'Yes', '<p>Billing cut-off reconciled to voyage completion records. The $45K cutoff misstatement identified and corrected via AJE-001. After adjustment, billing and completion cut-offs are aligned.</p>', 'W/P Ref: REV-05'),
        q('rev-q3d', '<p>For entities with significant year-end transactions, have any unusually large transactions immediately before or after year-end been investigated?</p>', undefined, 'Yes', '<p>Three large invoices (>$250K) near year-end investigated. All confirmed as legitimate completed voyages with supporting documentation including cargo manifests and port arrival certificates.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rev-4',
      title: '4. Existence/Occurrence',
      questions: [
        q('rev-q4a', '<p>Has a sample of recorded revenue transactions been selected and agreed to underlying support (invoices, contracts, delivery/acceptance documentation)?</p>', undefined, 'Yes', '<p>Sample of 30 revenue transactions selected (monetary unit sampling). All 30 agreed to freight invoices, voyage contracts, and vessel arrival certificates. No exceptions noted.</p>', 'W/P Ref: REV-06'),
        q('rev-q4b', '<p>Have the sampled transactions been tested to confirm that goods were delivered or services rendered to the customer?</p>', undefined, 'Yes', '<p>All 30 sampled voyages confirmed as completed via port arrival certificates and signed cargo delivery receipts. Revenue recognized only upon voyage completion in all cases.</p>', 'W/P Ref: REV-06'),
        q('rev-q4c', '<p>Have any large, unusual or non-routine revenue transactions been specifically tested for existence and proper accounting?</p>', undefined, 'Yes', '<p>Five transactions over $500K specifically tested. All confirmed as routine freight contracts with appropriate documentation. No unusual or non-routine transactions identified.</p>'),
        q('rev-q4d', '<p>Have credit notes issued after year-end been reviewed to identify potential reversal of improperly recognized revenue?</p>', undefined, 'Yes', '<p>Credit notes issued April 1–30, 2024 reviewed. Total of $18K in credit notes, all relating to cargo claims for damages — appropriately excluded from revenue recognition testing scope.</p>', 'W/P Ref: REV-07'),
      ],
      isExpanded: true
    },
    {
      id: 'section-rev-5',
      title: '5. Related Party Revenue',
      questions: [
        q('rev-q5a', '<p>Have related party revenue transactions been identified and listed?</p>', undefined, 'Yes', '<p>Related party inquiry performed. One related party revenue transaction identified: freight services to a company owned by the majority shareholder totaling $185K for the year.</p>', 'W/P Ref: RPT-01'),
        q('rev-q5b', '<p>Has the pricing of related party revenue transactions been assessed for arm\'s length terms?</p>', undefined, 'Yes', '<p>Related party freight rates compared to rates charged to arm\'s-length customers for similar routes and cargo types. Rates assessed as consistent with market terms — no adjustments required.</p>', 'W/P Ref: RPT-01'),
        q('rev-q5c', '<p>Have related party revenue transactions been confirmed as appropriately disclosed in the financial statements?</p>', undefined, 'Yes', '<p>Related party revenue of $185K disclosed in Note 12 of the financial statements. Disclosure reviewed and confirmed as adequate under ASPE Section 3840.</p>', 'W/P Ref: RPT-02'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-test-of-details-revenue',
    title: 'Test of Details — Revenue',
    description: 'Documents the tests of details performed on revenue, including revenue recognition policy review, completeness testing, cutoff testing, existence/occurrence testing, and related party revenue.',
    objective: `CAS 330 and CAS 240 require the auditor to design and perform substantive tests of details for revenue, which represents a high-risk area in most audits. This checklist documents the test of details procedures for revenue, addressing the key assertions of completeness, existence/occurrence, accuracy/valuation, and cutoff.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateTestOfDetailsExpensesChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-exp-1',
      title: '1. Completeness (Search for Unrecorded Liabilities)',
      questions: [
        q('exp-q1a', '<p>Have disbursements made after the reporting date (typically 30-45 days post year-end) been reviewed to identify liabilities that should have been recorded at year-end?</p>', undefined, 'Yes', '<p>Reviewed disbursements from April 1 to May 15, 2024. Identified $38K in port dues and $22K in fuel charges relating to services received before March 31 not yet accrued. Adjustments recorded by management.</p>', 'W/P Ref: EXP-01'),
        q('exp-q1b', '<p>Have unpaid vendor invoices received after year-end for services/goods received before year-end been identified and tested for proper accrual?</p>', undefined, 'Yes', '<p>Vendor invoices received April 1–30 reviewed. Three invoices totaling $60K related to pre-year-end services — management confirmed all three were included in year-end accruals per AP subledger.</p>', 'W/P Ref: EXP-01'),
        q('exp-q1c', '<p>Have accounts payable confirmations or vendor statements been obtained and reconciled to the general ledger?</p>', undefined, 'Yes', '<p>Confirmations sent to 10 major vendors representing 72% of AP balance ($1.0M of $1.4M). All confirmations received with no exceptions. Vendor statements for remaining balance reconciled to GL with no differences.</p>', 'W/P Ref: EXP-02'),
        q('exp-q1d', '<p>Have recurring accruals (e.g., payroll accruals, utilities, professional fees) been assessed for completeness by comparing to prior year and current period activity?</p>', undefined, 'Yes', '<p>Recurring accruals compared to prior year. Year-end payroll accrual of $142K (prior year $138K) — consistent with 3% wage increase. Port dues accrual of $95K consistent with Q4 voyage schedule.</p>', 'W/P Ref: EXP-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-exp-2',
      title: '2. Cutoff Testing',
      questions: [
        q('exp-q2a', '<p>Have the last 15 vendor invoices recorded before year-end been tested to confirm that the related expense is attributable to the current period?</p>', undefined, 'Yes', '<p>Last 15 vendor invoices (recorded March 15–31, 2024) tested. All 15 confirmed as relating to services received in the current period. No cutoff exceptions noted.</p>', 'W/P Ref: EXP-04'),
        q('exp-q2b', '<p>Have the first 15 vendor invoices recorded after year-end been reviewed to identify any that should have been accrued at year-end?</p>', undefined, 'Yes', '<p>First 15 vendor invoices recorded April 1–15, 2024 reviewed. Two invoices relating to March services were identified and compared to year-end accruals — confirmed as properly accrued at March 31.</p>', 'W/P Ref: EXP-04'),
        q('exp-q2c', '<p>Have prepaid expenses at year-end been tested to confirm that the deferred portion is properly excluded from current period expense?</p>', undefined, 'Yes', '<p>Prepaid expenses balance of $215K tested. Major items include vessel insurance ($148K, 14-month policy) and port facility lease prepayments ($67K). Both confirmed as properly deferred and excluded from current year expense.</p>', 'W/P Ref: EXP-05'),
      ],
      isExpanded: true
    },
    {
      id: 'section-exp-3',
      title: '3. Classification',
      questions: [
        q('exp-q3a', '<p>Have significant expenditures been reviewed to confirm proper classification between capital expenditures (assets) and operating expenses?</p>', undefined, 'Yes', '<p>Vessel maintenance expenditures reviewed against capitalization policy (>$10,000 per item with useful life >1 year). $185K of dry-dock maintenance confirmed as properly capitalized to vessel assets.</p>', 'W/P Ref: EXP-06'),
        q('exp-q3b', '<p>Have repairs and maintenance expenses been reviewed for items that should be capitalized under the entity\'s capitalization policy?</p>', undefined, 'Yes', '<p>Repairs and maintenance expense of $320K reviewed. All items confirmed as routine maintenance not extending vessel useful life — appropriate classification as operating expense per ASPE Section 3061.</p>', 'W/P Ref: EXP-06'),
        q('exp-q3c', '<p>Have expenses been assessed for proper classification within the income statement (e.g., cost of goods sold vs. operating expenses)?</p>', undefined, 'Yes', '<p>Expense classification reviewed: vessel operating costs (fuel, crew wages, port dues) appropriately classified as cost of services; general and administrative expenses properly separated. Depreciation correction AJE ($12K) recorded.</p>', 'W/P Ref: EXP-07'),
        q('exp-q3d', '<p>Have expenses with disclosure requirements (e.g., related party transactions, compensation of key management personnel) been identified and confirmed as properly disclosed?</p>', undefined, 'Yes', '<p>Key management compensation ($680K total) and related party management fees ($125K) identified and confirmed as disclosed in Notes 11 and 12 respectively.</p>', 'W/P Ref: RPT-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-exp-4',
      title: '4. Authorization',
      questions: [
        q('exp-q4a', '<p>Have the sampled expense transactions been tested to confirm that they were approved in accordance with the entity\'s authorization policy?</p>', undefined, 'Yes', '<p>Sample of 25 expense transactions tested for authorization. All 25 bore appropriate approval signatures per the entity\'s authorization matrix (>$5K requires controller approval; >$50K requires CFO approval).</p>', 'W/P Ref: EXP-08'),
        q('exp-q4b', '<p>Have any transactions that appear to circumvent normal authorization processes been identified and investigated?</p>', undefined, 'No', '<p>No transactions identified that circumvented normal authorization processes during the audit.</p>'),
        q('exp-q4c', '<p>Have expenses relating to personal, non-business items been considered in the testing?</p>', undefined, 'Yes', '<p>Employee expense reimbursements ($48K) reviewed. No personal or non-business items identified. All claims supported by receipts and business purpose documentation.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-exp-5',
      title: '5. Related Party Expenses',
      questions: [
        q('exp-q5a', '<p>Have related party expense transactions been identified and listed?</p>', undefined, 'Yes', '<p>Related party expense transactions identified: management fees of $125K paid to a company controlled by the majority shareholder, and vessel charter fees of $240K paid to a related entity.</p>', 'W/P Ref: RPT-01'),
        q('exp-q5b', '<p>Has the pricing of related party expense transactions been assessed for arm\'s length terms?</p>', undefined, 'Yes', '<p>Management fees compared to market rates for similar management services — assessed as reasonable. Charter fees compared to market charter rates per industry publications — assessed as consistent with arm\'s-length rates.</p>', 'W/P Ref: RPT-01'),
        q('exp-q5c', '<p>Have related party expense transactions been confirmed as appropriately disclosed in the financial statements?</p>', undefined, 'Yes', '<p>Related party expenses disclosed in Note 12 of the financial statements, including amounts, nature of relationship, and terms. Disclosure reviewed as adequate per ASPE Section 3840.</p>', 'W/P Ref: RPT-02'),
        q('exp-q5d', '<p>Have management fees, consulting fees, or other charges from related parties been tested for reasonableness and supported by underlying agreements?</p>', undefined, 'Yes', '<p>Management fee agreement reviewed — specifies $125K annual fee for strategic oversight services. Vessel charter agreement reviewed — confirms $240K annual charter rate. Both agreements are executed and on file.</p>', 'W/P Ref: RPT-01'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-test-of-details-expenses',
    title: 'Test of Details — Expenses',
    description: 'Documents the tests of details performed on expenses, including search for unrecorded liabilities, cutoff testing, classification, authorization, and related party expenses.',
    objective: `CAS 330 requires the auditor to design and perform substantive tests of details for expenses, addressing key assertions including completeness (search for unrecorded liabilities), cutoff, classification, and authorization. This checklist documents the test of details procedures for the expenses area.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateAuditProceduresSummaryChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-aps-1',
      title: '1. Summary of Procedures Performed',
      questions: [
        q('aps-q1a', '<p>Has a summary of all significant audit procedures performed been prepared, organized by account or assertion, with a reference to the supporting working paper?</p>', undefined, 'Yes', '<p>Audit procedures summary prepared and organized by financial statement area (Revenue, PP&E, Debt, Payroll, etc.) with W/P references. All significant procedures documented with conclusions at assertion level.</p>', 'W/P Ref: SUM-01'),
        q('aps-q1b', '<p>Has the procedure type been identified for each area (test of controls, substantive analytical procedures, test of details, dual-purpose test)?</p>', undefined, 'Yes', '<p>Procedure type identified for each area: TOC for payroll and AP; SAP for revenue and operating expenses; TOD for revenue cutoff, PP&E, and long-term debt. Documented in SUM-01.</p>', 'W/P Ref: SUM-01'),
        q('aps-q1c', '<p>Has the timing of each significant procedure been documented (interim or year-end)?</p>', undefined, 'Yes', '<p>Timing documented: interim procedures (January–March 2024): TOC, SAP, inventory observation. Year-end procedures (April 14–25, 2024): revenue cutoff, balance sheet substantive, management representations.</p>'),,
        q('aps-q1d', '<p>Has the conclusion reached for each area been documented at the assertion level?</p>', undefined, 'Yes', '<p>Assertion-level conclusions documented for all significant areas. All areas concluded as supported by sufficient appropriate audit evidence. No outstanding conclusion gaps.</p>', 'W/P Ref: SUM-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-aps-2',
      title: '2. Misstatements Identified',
      questions: [
        q('aps-q2a', '<p>Have all factual misstatements (misstatements about which there is no doubt) been identified and documented?</p>', undefined, 'Yes', '<p>Three factual misstatements identified and documented in the misstatement summary: (1) revenue cutoff $45K, (2) depreciation correction $12K, (3) deferred revenue reclassification $28K. All corrected by management.</p>', 'W/P Ref: MIS-01'),
        q('aps-q2b', '<p>Have all judgmental misstatements (differences arising from judgments concerning accounting estimates or the application of accounting policies) been documented?</p>', undefined, 'Yes', '<p>No judgmental misstatements identified. Management\'s accounting estimates (vessel depreciation, allowance for doubtful accounts) assessed as reasonable within acceptable ranges.</p>', 'W/P Ref: MIS-01'),
        q('aps-q2c', '<p>Have projected misstatements (the auditor\'s best estimate of misstatements in populations from which samples were drawn) been calculated and documented?</p>', undefined, 'Yes', '<p>Projected misstatements calculated for all sampled populations. Total projected misstatement of $18K (revenue) and $12K (expenses) — both well below performance materiality of $87,500.</p>', 'W/P Ref: MIS-01'),
        q('aps-q2d', '<p>Has the aggregate of all identified misstatements (factual + judgmental + projected) been compared to performance materiality?</p>', undefined, 'Yes', '<p>All three AJEs ($85K total) were corrected by management. Aggregate of remaining projected misstatements ($30K) is below performance materiality of $87,500. Concluded as not material in aggregate.</p>', 'W/P Ref: MIS-02'),
        q('aps-q2e', '<p>Have the identified misstatements been communicated to management and has management\'s response been documented?</p>', undefined, 'Yes', '<p>All misstatements communicated to management during fieldwork. Management agreed to record all three AJEs. Management confirmation of corrections obtained in representation letter.</p>', 'W/P Ref: MIS-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-aps-3',
      title: '3. Outstanding Items',
      questions: [
        q('aps-q3a', '<p>Have all outstanding items requiring follow-up or response from management been listed and tracked?</p>', undefined, 'Yes', '<p>Outstanding items tracker maintained throughout fieldwork. All items resolved as at April 25, 2024 (end of fieldwork). No items remain outstanding at date of report.</p>', 'W/P Ref: SUM-03'),
        q('aps-q3b', '<p>Have any items that remain unresolved as of the completion of fieldwork been escalated to the engagement manager/partner?</p>', undefined, 'No', '<p>No items remained unresolved at completion of fieldwork. All outstanding items were resolved by April 25, 2024.</p>'),
        q('aps-q3c', '<p>Have any areas where the auditor was unable to obtain sufficient appropriate evidence been documented, and has the impact on the audit opinion been assessed?</p>', undefined, 'No', '<p>No areas identified where the auditor was unable to obtain sufficient appropriate evidence. All planned procedures were completed and evidence obtained.</p>'),
        q('aps-q3d', '<p>Have all management representation letter items been identified and agreed with the draft representation letter?</p>', undefined, 'Yes', '<p>Management representation letter items compiled and agreed to the signed representation letter dated April 25, 2024. All required CAS representations included and signed by CEO and CFO.</p>', 'W/P Ref: MRL-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-aps-4',
      title: '4. Overall Conclusion',
      questions: [
        q('aps-q4a', '<p>Has the engagement manager/partner concluded that sufficient appropriate audit evidence has been obtained to support the audit opinion?</p>', undefined, 'Yes', '<p>S. Chen (engagement manager) concluded on April 25, 2024 that sufficient appropriate audit evidence has been obtained to support an unmodified audit opinion on Shipping Line Inc.\'s March 31, 2024 financial statements.</p>', 'W/P Ref: SUM-04'),
        q('aps-q4b', '<p>Has the audit file been reviewed by the engagement manager to confirm that all required procedures have been performed and documented?</p>', undefined, 'Yes', '<p>S. Chen completed engagement manager review of all working papers. Sign-off completed April 28, 2024. All procedures confirmed as performed and documented per CAS requirements.</p>', 'W/P Ref: SUM-04'),
        q('aps-q4c', '<p>Has the engagement partner performed the final review of the audit file and concurred with the proposed audit opinion?</p>', undefined, 'Yes', '<p>J. Williams (engagement partner) completed final file review and concurred with the proposed unmodified audit opinion. Partner sign-off completed May 2, 2024.</p>', 'W/P Ref: SUM-04'),
        q('aps-q4d', '<p>Where an EQCR is required, has the quality reviewer completed their review and documented their concurrence with the significant judgments and proposed opinion?</p>', undefined, 'NA', '<p>EQCR not required for this engagement as Shipping Line Inc. is not a listed entity and does not meet the firm\'s EQCR threshold criteria.</p>'),
        q('aps-q4e', '<p>Has the subsequent events review been completed and any events requiring adjustment or disclosure addressed?</p>', undefined, 'Yes', '<p>Subsequent events review completed through May 2, 2024 (date of audit report). No events identified requiring adjustment to or disclosure in the March 31, 2024 financial statements.</p>', 'W/P Ref: SE-01'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-audit-procedures-summary',
    title: 'Audit Procedures Summary',
    description: 'Summarizes all significant audit procedures performed, misstatements identified, outstanding items, and the overall conclusion on whether sufficient appropriate evidence has been obtained.',
    objective: `CAS 330 and CAS 450 require the auditor to evaluate whether the audit evidence obtained is sufficient and appropriate to reduce audit risk to an acceptably low level. This summary checklist confirms that all planned procedures have been performed, identifies all misstatements, and documents the engagement team\'s conclusion on the audit.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const generateUnderstandingEntityIndustryEnvironmentChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });

  const sections: Section[] = [
    {
      id: 'section-uei-1',
      title: '1. Industry Conditions & External Environment',
      questions: [
        q('uei-q1a', '<p>Has the auditor obtained an understanding of the significant industry trends, competitive conditions, and cyclical or seasonal factors affecting the entity?</p>', undefined, 'Yes', '<p>Marine freight industry is experiencing post-pandemic normalization with freight rates moderating from 2022 highs. Seasonal peaks in Q3 (holiday season) and Q1 troughs are characteristic of the trans-Pacific trade lane. Competitive conditions are stable with the entity holding established long-term contracts.</p>', 'W/P Ref: UEI-01'),
        q('uei-q1b', '<p>Are there significant technological changes in the industry that could affect the entity\'s products, services, or processes?</p>', undefined, 'Yes', '<p>Digitization of shipping documentation and e-Bill of Lading adoption are ongoing industry trends. Shipping Line Inc. has adopted digital freight management software during the year; impact on internal controls has been assessed.</p>', 'W/P Ref: UEI-01'),
        q('uei-q1c', '<p>Has the auditor considered the impact of supply chain disruptions, commodity price changes, or other macroeconomic factors on the entity?</p>', undefined, 'Yes', '<p>Bunker fuel price increases of approximately 12% year-over-year have been considered. Management has partially mitigated this through fuel surcharge clauses in freight contracts. No material supply chain disruptions specific to the entity were identified.</p>', 'W/P Ref: UEI-01'),
        q('uei-q1d', '<p>Are there significant changes in customer demand, market share, or competitive dynamics that could affect the entity\'s financial performance?</p>', undefined, 'Yes', '<p>Demand for container freight on Pacific routes is growing. The entity has secured two new freight contracts during the year, contributing to revenue growth of 11.6%. No adverse changes in customer demand or market share identified.</p>', 'W/P Ref: UEI-01'),
        q('uei-q1e', '<p>Has the auditor considered the entity\'s position within its industry (e.g., market leader, niche player, declining market)?</p>', undefined, 'Yes', '<p>Shipping Line Inc. is a niche player in the Canadian maritime freight market, operating a small but established fleet. The entity competes on service reliability and established customer relationships rather than scale.</p>', 'W/P Ref: UEI-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-uei-2',
      title: '2. Regulatory & Legal Framework',
      questions: [
        q('uei-q2a', '<p>Has the auditor obtained an understanding of the regulatory framework applicable to the entity and the industry (e.g., environmental regulations, industry-specific regulations, licensing requirements)?</p>', undefined, 'Yes', '<p>Entity is subject to Transport Canada marine regulations, the Canada Shipping Act 2001, and MARPOL environmental regulations for vessel emissions and waste management. All required operating licenses are current. Compliance has been confirmed with management.</p>', 'W/P Ref: UEI-02'),
        q('uei-q2b', '<p>Are there any significant regulatory changes pending or recently enacted that could affect the entity\'s operations, financial reporting, or compliance obligations?</p>', undefined, 'Yes', '<p>IMO 2023 CII (Carbon Intensity Indicator) regulations require vessel efficiency ratings. Shipping Line Inc.\'s vessels have been assessed; no immediate capital expenditure required for compliance. Regulatory impact on financial statements considered and assessed as immaterial for the current year.</p>', 'W/P Ref: UEI-02'),
        q('uei-q2c', '<p>Has the auditor reviewed significant contracts, agreements, or litigation that could have a material impact on the financial statements?</p>', undefined, 'Yes', '<p>Two new freight contracts and the bank credit facility agreement reviewed. No pending or threatened litigation identified per management representation and review of legal correspondence.</p>', 'W/P Ref: UEI-02'),
        q('uei-q2d', '<p>Are there any significant tax law changes (federal, provincial/state, or international) that could affect the entity\'s tax positions or disclosures?</p>', undefined, 'No', '<p>No significant federal or provincial tax law changes identified that would materially affect Shipping Line Inc.\'s tax positions or disclosures for the year ended March 31, 2024.</p>'),
        q('uei-q2e', '<p>Has management identified and documented its compliance with applicable laws and regulations material to the financial statements?</p>', undefined, 'Yes', '<p>Management has confirmed compliance with all applicable laws and regulations. No instances of non-compliance identified during the audit that could have a material impact on the financial statements.</p>', 'W/P Ref: UEI-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-uei-3',
      title: '3. Entity\'s Business Model, Strategy & Objectives',
      questions: [
        q('uei-q3a', '<p>Has the auditor obtained an understanding of the entity\'s key products and services, principal markets, and major customers and suppliers?</p>', undefined, 'Yes', '<p>Entity provides container and bulk maritime freight services primarily on trans-Pacific routes. Key customers include three major importers representing approximately 58% of revenue. Key suppliers are bunker fuel providers and port authorities.</p>', 'W/P Ref: UEI-03'),
        q('uei-q3b', '<p>Are there significant changes in the entity\'s business model, strategy, or key relationships compared to the prior year?</p>', undefined, 'Yes', '<p>Two new freight contracts entered during the year represent a modest expansion. No fundamental changes to the entity\'s business model or strategy. Key customer and supplier relationships are stable.</p>', 'W/P Ref: UEI-03'),
        q('uei-q3c', '<p>Has the auditor considered the entity\'s key performance indicators (KPIs) and how management monitors performance against its objectives?</p>', undefined, 'Yes', '<p>Management monitors revenue per voyage, fleet utilization rate, and on-time delivery performance. Monthly management accounts are prepared and reviewed against budget. KPIs are consistent with industry norms for a maritime freight operator.</p>', 'W/P Ref: UEI-03'),
        q('uei-q3d', '<p>Are there significant business risks arising from the entity\'s strategic objectives (e.g., expansion, new product lines, geographic diversification)?</p>', undefined, 'No', '<p>No significant expansion or diversification strategy in place. The entity\'s growth is organic through incremental contract wins. Business risk profile is stable and consistent with prior year.</p>'),
        q('uei-q3e', '<p>Has the auditor considered the entity\'s reliance on key individuals, intellectual property, or proprietary technology?</p>', undefined, 'Yes', '<p>The entity is reliant on the CEO (founder) and two experienced vessel captains. Key person risk has been noted but no succession planning documentation exists. This is a qualitative risk noted but assessed as not material to the financial statements.</p>', 'W/P Ref: UEI-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-uei-4',
      title: '4. Accounting Policies & Financial Reporting Framework',
      questions: [
        q('uei-q4a', '<p>Has the auditor obtained an understanding of the entity\'s significant accounting policies and whether they are appropriate and consistent with the applicable financial reporting framework (e.g., ASPE, IFRS)?</p>', undefined, 'Yes', '<p>Significant accounting policies reviewed: revenue recognized upon voyage completion, vessels depreciated on a straight-line basis over useful lives of 20–25 years, and USD transactions translated at rates prevailing at transaction date. All policies are appropriate under ASPE and consistent with the prior year.</p>', 'W/P Ref: UEI-04'),
        q('uei-q4b', '<p>Are there any significant changes in accounting policies or estimates from the prior year? If so, are the reasons for the changes appropriate?</p>', undefined, 'No', '<p>No significant changes in accounting policies or estimates from the prior year. Consistent application of ASPE policies confirmed.</p>'),
        q('uei-q4c', '<p>Has the auditor considered the entity\'s use of significant accounting estimates and whether the estimation process is reasonable and consistent?</p>', undefined, 'Yes', '<p>Key estimates include: (1) useful lives and residual values of vessels, (2) allowance for doubtful accounts on AR, and (3) accrued revenue for voyages in progress at year-end. Each estimate has been assessed for reasonableness as part of the audit.</p>', 'W/P Ref: UEI-04'),
        q('uei-q4d', '<p>Are there complex transactions or areas requiring significant management judgment (e.g., revenue recognition, asset impairment, business combinations)?</p>', undefined, 'Yes', '<p>Revenue recognition at voyage completion requires judgment regarding percentage of completion for voyages in progress at March 31, 2024. Vessel impairment assessment requires judgment on recoverable amounts. Both areas have been identified as significant risks and addressed in the audit program.</p>', 'W/P Ref: RA-01'),
        q('uei-q4e', '<p>Has the auditor considered industry-specific accounting requirements and whether the entity is applying them appropriately?</p>', undefined, 'Yes', '<p>Maritime industry-specific considerations include voyage accounting (percentage of completion for multi-leg voyages), dry-dock cost capitalization, and vessel impairment indicators. Management\'s application of these policies has been reviewed and is assessed as appropriate.</p>', 'W/P Ref: UEI-04'),
      ],
      isExpanded: true
    },
    {
      id: 'section-uei-5',
      title: '5. Measurement & Review of Financial Performance',
      questions: [
        q('uei-q5a', '<p>Has the auditor reviewed and understood the entity\'s budgeting process and how actual results are compared to budget/forecast?</p>', undefined, 'Yes', '<p>Annual budget prepared by the CFO and approved by the board in April each year. Monthly actual versus budget variance reports are reviewed by management. Budgeting process is considered reasonable and effective for monitoring performance.</p>', 'W/P Ref: UEI-05'),
        q('uei-q5b', '<p>Are there financial performance measures or covenants (e.g., banking covenants, regulatory capital requirements) that management is under pressure to meet?</p>', undefined, 'Yes', '<p>The RBC credit facility contains a debt service coverage ratio covenant and minimum tangible net worth covenant. Management monitors these ratios quarterly. Both covenants were met as at March 31, 2024. This has been identified as a fraud risk factor and considered in the risk assessment.</p>', 'W/P Ref: RA-02'),
        q('uei-q5c', '<p>Has the auditor considered whether management\'s performance targets or compensation arrangements create incentives for earnings management or fraudulent financial reporting?</p>', undefined, 'Yes', '<p>Management compensation is not directly tied to financial reporting metrics. Banking covenant compliance creates some pressure; however, the entity has comfortable headroom in its covenants (DSCR of 1.42 versus 1.20 minimum). Incentive-based fraud risk assessed as low.</p>', 'W/P Ref: RA-02'),
        q('uei-q5d', '<p>Has the auditor performed preliminary analytical procedures to identify unusual fluctuations in financial data compared to industry benchmarks or prior periods?</p>', undefined, 'Yes', '<p>Preliminary analytical procedures performed and documented in PAP working paper. Revenue growth of 11.6%, gross margin improvement from 17.9% to 18.4%, and DSO of 61 days all assessed as reasonable and consistent with industry benchmarks.</p>', 'W/P Ref: PAP-01'),
        q('uei-q5e', '<p>Based on the understanding obtained, has the auditor identified any significant risks arising from the entity\'s industry and environment that require specific audit attention?</p>', undefined, 'Yes', '<p>Three significant risks identified from industry and environment understanding: (1) revenue recognition — voyage cut-off risk inherent in maritime freight accounting, (2) vessel impairment given significant asset concentration ($8.2M, 45% of total assets), and (3) foreign currency risk from USD-denominated freight contracts. All incorporated into the audit strategy.</p>', 'W/P Ref: RA-01'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-uei',
    title: 'Understanding the Entity — Industry & Environment',
    description: 'Documents the auditor\'s understanding of the entity\'s industry conditions, regulatory framework, business model, accounting policies, and financial performance measurement, as required by CAS 315.',
    objective: `CAS 315 requires the auditor to obtain an understanding of the entity and its environment sufficient to identify and assess the risks of material misstatement. This checklist covers the external factors — industry conditions, regulatory environment, and the entity\'s strategic position — that influence the nature of the entity and the risks it faces. This understanding informs the auditor\'s risk assessment and the design of further audit procedures.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// ─── Understanding Internal Controls ────────────────────────────────────────
export const generateUnderstandingInternalControlsChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });
  const sections: Section[] = [
    {
      id: 'section-uic-1',
      title: '1. Control Environment',
      questions: [
        q('uic-q1a', '<p>Has the auditor assessed management\'s commitment to integrity and ethical values (e.g., code of conduct, tone at the top)?</p>', undefined, 'Yes', '<p>Code of conduct reviewed; tone at the top assessed as strong through inquiries with CEO and CFO. No ethical violations or disciplinary actions noted during the year.</p>', 'W/P Ref: IC-10'),
        q('uic-q1b', '<p>Has the auditor documented the entity\'s organizational structure, including lines of authority and responsibility?</p>', undefined, 'Yes', '<p>Organizational chart obtained and filed; clear reporting lines documented from operations through CFO to CEO and Board of Directors.</p>', 'W/P Ref: IC-10'),
        q('uic-q1c', '<p>Has the auditor considered whether HR policies (hiring, training, performance evaluation, compensation) support the control environment?</p>', undefined, 'Yes', '<p>HR policies reviewed; background checks performed for finance staff, annual performance reviews conducted, and compensation structure assessed as appropriate for entity size.</p>', 'W/P Ref: IC-10'),
        q('uic-q1d', '<p>Has the auditor assessed the oversight responsibilities exercised by those charged with governance (TCWG), including the audit committee?</p>', undefined, 'Yes', '<p>Board of directors meets quarterly; financial statements reviewed at each meeting. No formal audit committee given entity size; full board performs oversight function.</p>', 'W/P Ref: IC-10'),
        q('uic-q1e', '<p>Has the auditor considered management\'s philosophy and operating style (e.g., attitude toward risk, financial reporting, and internal control)?</p>', undefined, 'Yes', '<p>Management\'s philosophy assessed as conservative; accounting policies applied consistently and management demonstrated appropriate deference to auditor guidance on complex accounting matters.</p>', 'W/P Ref: IC-10'),
      ],
      isExpanded: true
    },
    {
      id: 'section-uic-2',
      title: '2. Entity\'s Risk Assessment Process',
      questions: [
        q('uic-q2a', '<p>Has the auditor documented how management identifies and responds to business risks relevant to financial reporting?</p>', undefined, 'Yes', '<p>Management performs an annual informal risk assessment; key risks identified include fuel price volatility, regulatory compliance, and vessel maintenance. Process documented in working papers.</p>', 'W/P Ref: IC-11'),
        q('uic-q2b', '<p>Has the auditor considered whether management identifies and responds to significant changes in the risk environment (e.g., new products, regulatory changes, IT changes)?</p>', undefined, 'Yes', '<p>Management identified new port authority reporting requirements effective January 2024 and updated procedures accordingly; no new financial reporting risks from IT changes during the year.</p>', 'W/P Ref: IC-11'),
        q('uic-q2c', '<p>Has the auditor evaluated whether management\'s risk assessment process addresses fraud risk?</p>', undefined, 'Yes', '<p>Management\'s risk assessment process addresses fraud risk informally; no formal fraud risk register maintained, but management demonstrated awareness of key fraud risks in their operations.</p>', 'W/P Ref: IC-11'),
        q('uic-q2d', '<p>Where management has identified risks but determined that controls are not necessary, has the auditor documented management\'s rationale?</p>', undefined, 'Yes', '<p>No instances where management identified risks without implementing controls; all identified risks have corresponding control activities in place.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-uic-3',
      title: '3. Information System & Communication',
      questions: [
        q('uic-q3a', '<p>Has the auditor documented the entity\'s key accounting system(s) and how transactions are initiated, recorded, processed, and reported?</p>', undefined, 'Yes', '<p>Sage 300 ERP used as primary accounting system; transaction flow documented from initiation (voyage booking) through invoicing, GL posting, and financial reporting.</p>', 'W/P Ref: IC-12'),
        q('uic-q3b', '<p>Has the auditor understood the IT environment, including key applications, databases, and interfaces relevant to financial reporting?</p>', undefined, 'Yes', '<p>IT environment documented: Sage 300 (accounting), ADP (payroll), vessel management system (operations); automated interface between vessel system and Sage 300 documented and assessed.</p>', 'W/P Ref: IC-12'),
        q('uic-q3c', '<p>Has the auditor documented the financial reporting process, including the steps used to prepare the financial statements and related disclosures?</p>', undefined, 'Yes', '<p>Period-end close process documented; CFO prepares trial balance from Sage 300, reviews with controller, and prepares financial statements with supporting schedules for board presentation.</p>', 'W/P Ref: IC-12'),
        q('uic-q3d', '<p>Has the auditor documented controls over journal entries, including authorization of non-standard entries?</p>', undefined, 'Yes', '<p>All journal entries require CFO authorization; system-generated entries automatically posted; manual entries require paper support and management sign-off before posting.</p>', 'W/P Ref: IC-12'),
        q('uic-q3e', '<p>Has the auditor understood period-end close procedures, including how management reviews and adjusts the trial balance?</p>', undefined, 'Yes', '<p>Month-end close takes 5 business days; CFO reviews all account balances against budget; unusual variances investigated and documented before financial statements finalized.</p>', 'W/P Ref: IC-12'),
      ],
      isExpanded: true
    },
    {
      id: 'section-uic-4',
      title: '4. Control Activities',
      questions: [
        q('uic-q4a', '<p>Has the auditor documented authorization controls over significant transactions and events?</p>', undefined, 'Yes', '<p>Authorization matrix documented: purchases over $10K require VP Operations approval; purchases over $50K require CEO approval; payroll changes require HR and CFO sign-off.</p>', 'W/P Ref: IC-13'),
        q('uic-q4b', '<p>Has the auditor documented key reconciliation controls (e.g., sub-ledger to GL, bank reconciliations)?</p>', undefined, 'Yes', '<p>Bank reconciliations prepared monthly by controller and reviewed by CFO; AR sub-ledger reconciled to GL monthly; AP sub-ledger reconciled before each payment run.</p>', 'W/P Ref: IC-13'),
        q('uic-q4c', '<p>Has the auditor assessed whether there is adequate segregation of duties over key financial reporting processes?</p>', undefined, 'Yes', '<p>Segregation of duties assessed as adequate given entity size (94 employees); separate individuals handle AP processing, payment authorization, and bank reconciliation.</p>', 'W/P Ref: IC-13'),
        q('uic-q4d', '<p>Has the auditor documented physical controls over assets (e.g., restricted access to inventory, cash, and fixed assets)?</p>', undefined, 'Yes', '<p>Vessels access restricted to authorized crew and maintenance personnel; office cash maintained in locked safe with dual access; IT server room access card-controlled with log maintained.</p>', 'W/P Ref: IC-13'),
        q('uic-q4e', '<p>Has the auditor documented IT application controls relevant to financial reporting (e.g., automated validations, edit checks)?</p>', undefined, 'Yes', '<p>Sage 300 application controls documented: mandatory fields on invoice entry, automated GL coding based on vendor master, duplicate payment prevention edit checks active.</p>', 'W/P Ref: IC-13'),
      ],
      isExpanded: true
    },
    {
      id: 'section-uic-5',
      title: '5. Monitoring of Controls',
      questions: [
        q('uic-q5a', '<p>Has the auditor considered whether the entity has an internal audit function and, if so, understood its scope and activities?</p>', undefined, 'NA', '<p>No internal audit function; entity size (94 employees, $12.5M revenue) does not warrant a formal internal audit function. External audit provides primary independent oversight.</p>'),
        q('uic-q5b', '<p>Has the auditor documented management\'s ongoing and periodic monitoring activities (e.g., dashboards, exception reports, management reviews)?</p>', undefined, 'Yes', '<p>Monthly management reporting package reviewed by CEO and CFO; includes budget-to-actual variance analysis, AR aging, key performance indicators, and exception reports from Sage 300.</p>', 'W/P Ref: IC-14'),
        q('uic-q5c', '<p>Has the auditor considered whether control deficiencies identified during monitoring are communicated and corrected in a timely manner?</p>', undefined, 'Yes', '<p>Management confirmed that control deficiencies are reported to the CFO and remediated within 30 days; no significant deficiencies identified during the current year monitoring activities.</p>', 'W/P Ref: IC-14'),
        q('uic-q5d', '<p>Has the auditor documented any external oversight (e.g., regulatory examinations, external quality reviews) and considered its relevance to the audit?</p>', undefined, 'Yes', '<p>Transport Canada conducted a routine vessel safety inspection in October 2023; no findings impacting financial reporting. No other external regulatory examinations during the year.</p>', 'W/P Ref: IC-14'),
      ],
      isExpanded: true
    },
  ];
  return {
    id: 'global-template-uic',
    title: 'Understanding Internal Controls',
    description: 'Documents the auditor\'s understanding of the five components of internal control relevant to the audit, per CAS 315.',
    objective: `CAS 315 requires the auditor to obtain an understanding of internal control relevant to the audit. This checklist covers the five components of internal control — Control Environment, Risk Assessment Process, Information System & Communication, Control Activities, and Monitoring — and documents the nature, extent, and results of the auditor's understanding procedures. This understanding informs decisions about the nature, timing, and extent of further audit procedures.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// ─── SCOT — Revenue Cycle ───────────────────────────────────────────────────
export const generateSCOTRevenueCycleChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });
  const sections: Section[] = [
    {
      id: 'section-scot-rev-1',
      title: '1. Revenue Process Overview',
      questions: [
        q('scot-rev-q1a', '<p>Has the auditor documented the entity\'s key revenue streams (e.g., product sales, service revenue, subscriptions, licensing)?</p>', undefined, 'Yes', '<p>Revenue streams documented: freight services (voyage-based, ~92% of revenue) and ancillary logistics services (vessel chartering and port agency, ~8%). Total revenue $12.5M CAD for FY2024.</p>', 'W/P Ref: RV-01'),
        q('scot-rev-q1b', '<p>Has the auditor documented the entity\'s revenue recognition policy and assessed its compliance with the applicable financial reporting framework?</p>', undefined, 'Yes', '<p>Revenue recognized upon voyage completion per ASPE Section 3400; policy assessed as compliant. Voyages in progress at year-end recognized on a percentage-of-completion basis.</p>', 'W/P Ref: RV-01'),
        q('scot-rev-q1c', '<p>Has the auditor identified significant estimates and judgments involved in revenue recognition (e.g., variable consideration, percentage of completion, multiple-element arrangements)?</p>', undefined, 'Yes', '<p>Significant judgment identified in estimating voyage completion percentage at March 31, 2024; 7 voyages were in progress at year-end with total accrued revenue of approximately $340K.</p>', 'W/P Ref: RV-01'),
        q('scot-rev-q1d', '<p>Has the auditor identified and documented related party revenue transactions?</p>', undefined, 'Yes', '<p>No related party revenue transactions identified; all revenue earned from third-party freight customers at arm\'s length.</p>', 'W/P Ref: RV-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-rev-2',
      title: '2. Order to Invoice Controls',
      questions: [
        q('scot-rev-q2a', '<p>Are customer orders authorized by an appropriate level of management before fulfilment?</p>', undefined, 'Yes', '<p>Freight bookings require Operations Manager authorization before vessel assignment; charter agreements require VP Operations and CEO sign-off.</p>', 'W/P Ref: RV-02'),
        q('scot-rev-q2b', '<p>Is credit approval obtained for new customers and periodically reviewed for existing customers before goods or services are provided on credit?</p>', undefined, 'Yes', '<p>Credit limits established by CFO for all credit customers; new customer credit approval documented. Annual review of existing customer limits performed in January 2024.</p>', 'W/P Ref: RV-02'),
        q('scot-rev-q2c', '<p>Are shipping/delivery documents or service completion records generated and reconciled to invoices?</p>', undefined, 'Yes', '<p>Vessel voyage completion certificates generated for each completed voyage; reconciled to invoices by accounts receivable clerk before posting. Exceptions reviewed by controller.</p>', 'W/P Ref: RV-02'),
        q('scot-rev-q2d', '<p>Are controls in place to ensure invoices are generated for all goods shipped or services rendered?</p>', undefined, 'Yes', '<p>Voyage completion report automatically triggers invoice generation in Sage 300; open voyages report reviewed weekly to identify any completions without corresponding invoices.</p>', 'W/P Ref: RV-02'),
        q('scot-rev-q2e', '<p>Are prices and quantities on invoices verified against approved price lists and customer purchase orders?</p>', undefined, 'Yes', '<p>Invoice rates verified against signed freight agreements before finalization; any variance from contracted rates requires CFO approval before invoicing.</p>', 'W/P Ref: RV-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-rev-3',
      title: '3. Accounts Receivable & Collection Controls',
      questions: [
        q('scot-rev-q3a', '<p>Is the AR sub-ledger regularly reconciled to the general ledger, with reconciling items investigated and resolved promptly?</p>', undefined, 'Yes', '<p>AR sub-ledger reconciled to Sage 300 GL monthly; no reconciling items outstanding at March 31, 2024. Reconciliation reviewed and signed off by controller.</p>', 'W/P Ref: RV-03'),
        q('scot-rev-q3b', '<p>Are collection procedures documented, including escalation processes for overdue accounts?</p>', undefined, 'Yes', '<p>Collection policy documented: 30-day payment terms; reminder at 45 days; formal demand at 60 days; escalation to management at 90 days. No accounts in dispute at year-end.</p>', 'W/P Ref: RV-03'),
        q('scot-rev-q3c', '<p>Are write-offs of uncollectible accounts authorized by an appropriate level of management?</p>', undefined, 'Yes', '<p>Bad debt write-offs require CFO approval for amounts under $10K and CEO approval for amounts above $10K; one write-off of $8.5K approved by CFO during FY2024.</p>', 'W/P Ref: RV-03'),
        q('scot-rev-q3d', '<p>Is there a formal dispute resolution process for customer invoice disputes, and are disputed amounts tracked?</p>', undefined, 'Yes', '<p>Dispute tracking maintained in Sage 300 using dispute flag on invoices; no material invoice disputes outstanding at March 31, 2024.</p>', 'W/P Ref: RV-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-rev-4',
      title: '4. Cash Receipts Controls',
      questions: [
        q('scot-rev-q4a', '<p>Are duties segregated between employees who handle cash receipts and those who record receipts in the accounting system?</p>', undefined, 'Yes', '<p>Cash receipts processed by accounts receivable clerk; recording in Sage 300 performed by controller; segregation adequate given two-person finance team for receipts processing.</p>', 'W/P Ref: RV-04'),
        q('scot-rev-q4b', '<p>Are cash receipts deposited daily (or on a timely basis) and reconciled to remittance advices?</p>', undefined, 'Yes', '<p>Substantially all receipts received by EFT directly to bank; manual cheques deposited same day received. Deposits reconciled to remittance advices and posted to AR by following business day.</p>', 'W/P Ref: RV-04'),
        q('scot-rev-q4c', '<p>Where applicable, are lockbox or EFT controls in place to minimize manual handling of cash and ensure complete capture of receipts?</p>', undefined, 'Yes', '<p>Approximately 95% of customer payments received via EFT; bank notifies controller daily of receipts. Minimal manual cash handling reduces misappropriation risk.</p>', 'W/P Ref: RV-04'),
        q('scot-rev-q4d', '<p>Is there a control to ensure receipts are applied to the correct customer account and invoice?</p>', undefined, 'Yes', '<p>Remittance advices matched to open invoices by accounts receivable clerk; unapplied cash reviewed weekly by controller; no unapplied cash outstanding at year-end.</p>', 'W/P Ref: RV-04'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-rev-5',
      title: '5. IT Controls over Revenue',
      questions: [
        q('scot-rev-q5a', '<p>Are system access controls in place to restrict who can create, modify, or delete customer accounts, pricing, and invoices?</p>', undefined, 'Yes', '<p>Sage 300 access controls restrict customer master file changes to controller and above; invoice creation restricted to AR clerk and controller; pricing changes restricted to CFO.</p>', 'W/P Ref: RV-05'),
        q('scot-rev-q5b', '<p>Are there automated controls in the billing system (e.g., edit checks, duplicate invoice prevention, mandatory fields) to ensure completeness and accuracy of invoicing?</p>', undefined, 'Yes', '<p>Sage 300 enforces mandatory fields on invoice creation; duplicate invoice prevention active based on customer and invoice number combination; system-generated sequential invoice numbering.</p>', 'W/P Ref: RV-05'),
        q('scot-rev-q5c', '<p>Is the interface between the order management/billing system and the general ledger automated and reconciled, with exception reports reviewed?</p>', undefined, 'Yes', '<p>Automated interface between vessel management system and Sage 300 posts voyage completions daily; daily exception report reviewed by controller for unmatched or failed postings.</p>', 'W/P Ref: RV-05'),
      ],
      isExpanded: true
    },
  ];
  return {
    id: 'global-template-scot-rev',
    title: 'SCOT — Revenue Cycle',
    description: 'System and Control Overview Template for the Revenue Cycle, documenting controls over revenue recognition, accounts receivable, and cash receipts.',
    objective: `CAS 315 requires the auditor to obtain an understanding of the entity's significant transaction cycles and the controls over those cycles. This SCOT documents the auditor's understanding of the Revenue Cycle — from customer order through cash receipt — including the key controls over completeness, accuracy, and cut-off of revenue and accounts receivable. This understanding informs risk assessment and the design of further audit procedures.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// ─── SCOT — Expenditure Cycle ───────────────────────────────────────────────
export const generateSCOTExpenditureCycleChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });
  const sections: Section[] = [
    {
      id: 'section-scot-exp-1',
      title: '1. Procurement Process Overview',
      questions: [
        q('scot-exp-q1a', '<p>Has the auditor documented the entity\'s purchasing policy, including approval authorities and procurement procedures?</p>', undefined, 'Yes', '<p>Purchasing policy documented; approval limits established at $10K (Operations Manager), $50K (VP Operations), and above $50K (CEO). Purchases restricted to approved vendors for operational supplies.</p>', 'W/P Ref: AP-01'),
        q('scot-exp-q1b', '<p>Does the entity maintain an approved vendor list, and are purchases restricted to approved vendors?</p>', undefined, 'Yes', '<p>Approved vendor list maintained for fuel suppliers, port services, and vessel maintenance contractors; new vendor additions require CFO and VP Operations approval.</p>', 'W/P Ref: AP-01'),
        q('scot-exp-q1c', '<p>Has the auditor documented the entity\'s policy for distinguishing capital expenditures from operating expenditures?</p>', undefined, 'Yes', '<p>Capitalization policy documented: expenditures over $5,000 with useful life greater than one year capitalized; routine maintenance expensed. Policy consistently applied during FY2024.</p>', 'W/P Ref: AP-01'),
        q('scot-exp-q1d', '<p>Has the auditor identified and documented related party purchase transactions?</p>', undefined, 'Yes', '<p>No related party purchase transactions identified; all significant suppliers are arm\'s length third parties.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-exp-2',
      title: '2. Purchase Order & Receiving Controls',
      questions: [
        q('scot-exp-q2a', '<p>Are purchase requisitions required for all non-routine purchases, and are they authorized before a purchase order is issued?</p>', undefined, 'Yes', '<p>Purchase requisitions required for all non-routine items above $1,000; requisitions reviewed and approved by department head before PO issuance.</p>', 'W/P Ref: AP-02'),
        q('scot-exp-q2b', '<p>Are purchase order approval limits defined and enforced, with higher-value purchases requiring senior authorization?</p>', undefined, 'Yes', '<p>PO approval limits defined and enforced in Sage 300; system prevents PO issuance without appropriate authorization level based on amount.</p>', 'W/P Ref: AP-02'),
        q('scot-exp-q2c', '<p>Is a three-way match (PO, receiving report, and vendor invoice) performed before payment is approved?</p>', undefined, 'Yes', '<p>Three-way match performed for all purchase transactions above $1,000; AP clerk matches PO, receiving report, and vendor invoice before payment approval.</p>', 'W/P Ref: AP-02'),
        q('scot-exp-q2d', '<p>Are receiving reports prepared for all goods received, and are they reviewed for accuracy before being matched to invoices?</p>', undefined, 'Yes', '<p>Receiving reports prepared by operations staff for all goods received; quantity and condition verified before sign-off and submission to AP for matching.</p>', 'W/P Ref: AP-02'),
        q('scot-exp-q2e', '<p>Is there a process to accrue for goods received but not yet invoiced at period end?</p>', undefined, 'Yes', '<p>Accrued AP process performed at March 31, 2024; open receiving reports without matching invoices identified and accrued. Total GRIB accrual at year-end: $87K.</p>', 'W/P Ref: AP-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-exp-3',
      title: '3. Accounts Payable Controls',
      questions: [
        q('scot-exp-q3a', '<p>Is the AP sub-ledger regularly reconciled to the general ledger, with reconciling items investigated and resolved promptly?</p>', undefined, 'Yes', '<p>AP sub-ledger reconciled to Sage 300 GL at each month-end; no reconciling items outstanding at March 31, 2024. Reconciliation reviewed by controller.</p>', 'W/P Ref: AP-03'),
        q('scot-exp-q3b', '<p>Are invoices reviewed, coded to the correct GL account, and approved by an appropriate employee before payment?</p>', undefined, 'Yes', '<p>All invoices reviewed and GL-coded by AP clerk; approved by department manager before payment processing. Invoices above $10K require additional CFO approval.</p>', 'W/P Ref: AP-03'),
        q('scot-exp-q3c', '<p>Are vendor statements periodically reconciled to the AP sub-ledger to identify unrecorded liabilities or disputes?</p>', undefined, 'Yes', '<p>Top 10 vendor statements reconciled quarterly; reconciliation performed for March 31, 2024 with no unrecorded liabilities identified.</p>', 'W/P Ref: AP-03'),
        q('scot-exp-q3d', '<p>Are controls in place to prevent duplicate payments (e.g., system checks for duplicate invoice numbers, vendor and amounts)?</p>', undefined, 'Yes', '<p>Sage 300 AP module has automated duplicate invoice detection based on vendor number and invoice number combination; warning generated for potential duplicates requiring override authorization.</p>', 'W/P Ref: AP-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-exp-4',
      title: '4. Cash Disbursement Controls',
      questions: [
        q('scot-exp-q4a', '<p>Are cheque or EFT disbursements authorized according to defined approval limits, with dual authorization for large payments?</p>', undefined, 'Yes', '<p>EFT payments below $25K authorized by CFO; payments above $25K require dual authorization from CFO and CEO. No cheques issued for amounts above $5K.</p>', 'W/P Ref: AP-04'),
        q('scot-exp-q4b', '<p>Are duties segregated between employees who authorize payments and those who process or record disbursements?</p>', undefined, 'Yes', '<p>AP clerk processes disbursements in Sage 300; CFO authorizes EFT releases in online banking; controller records disbursements in GL. Adequate segregation maintained.</p>', 'W/P Ref: AP-04'),
        q('scot-exp-q4c', '<p>Are bank reconciliations prepared regularly by someone independent of the disbursement process, and reviewed by a senior employee?</p>', undefined, 'Yes', '<p>Controller prepares monthly bank reconciliation; reviewed and signed off by CFO. Controller does not have access to online banking disbursement authorization.</p>', 'W/P Ref: AP-04'),
        q('scot-exp-q4d', '<p>Are voided cheques controlled and accounted for to prevent unauthorized use?</p>', undefined, 'Yes', '<p>Voided cheques maintained in numerical sequence in locked storage; voided cheque log reconciled to Sage 300 void register monthly by controller.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-exp-5',
      title: '5. IT Controls over Expenditures',
      questions: [
        q('scot-exp-q5a', '<p>Are system access controls in place to restrict who can set up or modify vendor master file data (e.g., banking details, addresses)?</p>', undefined, 'Yes', '<p>Vendor master file changes restricted to controller and CFO in Sage 300; banking detail changes require CFO authorization and are logged in the system audit trail.</p>', 'W/P Ref: AP-05'),
        q('scot-exp-q5b', '<p>Are there automated matching controls (e.g., system-enforced three-way match) in the AP module to prevent processing of unmatched invoices?</p>', undefined, 'Yes', '<p>Sage 300 AP module enforces three-way match for PO-based invoices; non-PO invoices require manual approval workflow before payment can be processed.</p>', 'W/P Ref: AP-05'),
        q('scot-exp-q5c', '<p>Is the interface between the AP module and the general ledger automated and reconciled, with exception reports reviewed regularly?</p>', undefined, 'Yes', '<p>AP to GL interface is automated within Sage 300 integrated system; AP and GL are the same database, eliminating interface risk. Month-end AP aging report reconciled to GL balance by controller.</p>', 'W/P Ref: AP-05'),
      ],
      isExpanded: true
    },
  ];
  return {
    id: 'global-template-scot-exp',
    title: 'SCOT — Expenditure Cycle',
    description: 'System and Control Overview Template for the Expenditure Cycle, documenting controls over purchasing, accounts payable, and cash disbursements.',
    objective: `CAS 315 requires the auditor to obtain an understanding of the entity's significant transaction cycles and the controls over those cycles. This SCOT documents the auditor's understanding of the Expenditure Cycle — from purchase requisition through cash disbursement — including the key controls over completeness, accuracy, and cut-off of expenses and accounts payable. This understanding informs risk assessment and the design of further audit procedures.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// ─── SCOT — Payroll Cycle ───────────────────────────────────────────────────
export const generateSCOTPayrollCycleChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });
  const sections: Section[] = [
    {
      id: 'section-scot-pay-1',
      title: '1. Payroll Process Overview',
      questions: [
        q('scot-pay-q1a', '<p>Has the auditor documented the payroll system(s) used (e.g., in-house software, outsourced provider) and assessed their relevance to the audit?</p>', undefined, 'Yes', '<p>Payroll outsourced to ADP for all 94 employees; ADP processes bi-weekly payroll and remits source deductions. Relevance to audit assessed as significant given payroll represents approximately 38% of total expenses.</p>', 'W/P Ref: PY-01'),
        q('scot-pay-q1b', '<p>Has the auditor documented payroll frequency (weekly, bi-weekly, semi-monthly, monthly) and the number of employees by type (salaried, hourly, commission)?</p>', undefined, 'Yes', '<p>Payroll processed bi-weekly; 94 employees comprising 28 salaried (management/admin) and 66 hourly (vessel crew and operations). No commission-based employees.</p>', 'W/P Ref: PY-01'),
        q('scot-pay-q1c', '<p>Has the auditor documented how HR data (new hires, terminations, rate changes) interfaces with the payroll system?</p>', undefined, 'Yes', '<p>HR data changes entered directly into ADP by HR manager; controller reviews ADP master file change report bi-weekly before payroll approval.</p>', 'W/P Ref: PY-01'),
        q('scot-pay-q1d', '<p>If payroll is outsourced, has the auditor considered the relevance of controls at the outsourced provider and whether a SOC 1 report is available?</p>', undefined, 'Yes', '<p>ADP SOC 1 Type II report (SSAE 18) obtained and reviewed; no exceptions noted relevant to payroll processing, tax calculations, or direct deposit controls.</p>', 'W/P Ref: PY-01'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-pay-2',
      title: '2. Employee Master File Controls',
      questions: [
        q('scot-pay-q2a', '<p>Are new employee additions and terminations authorized by HR and reflected in the payroll system in a timely manner?</p>', undefined, 'Yes', '<p>New hire authorization requires signed offer letter and HR manager approval in ADP before first payroll. Terminations flagged in ADP on last day of employment; final pay calculated by ADP within standard process.</p>', 'W/P Ref: PY-02'),
        q('scot-pay-q2b', '<p>Are pay rate changes (raises, bonuses, commissions) authorized by management before being entered in the payroll system?</p>', undefined, 'Yes', '<p>Salary changes require written authorization from department manager and CEO; change forms reviewed by controller before HR enters in ADP. Annual increases approved by board in March 2024.</p>', 'W/P Ref: PY-02'),
        q('scot-pay-q2c', '<p>Are duties segregated between HR (who authorizes employee data changes) and payroll (who processes payroll)?</p>', undefined, 'Yes', '<p>HR manager authorizes employee data in ADP; controller approves payroll runs; CFO releases EFT payments. Adequate three-way segregation of duties maintained.</p>', 'W/P Ref: PY-02'),
        q('scot-pay-q2d', '<p>Is the employee master file periodically reviewed for terminated employees, duplicate entries, or other anomalies (i.e., ghost employee risk)?</p>', undefined, 'Yes', '<p>Annual employee master file review performed in February 2024; active employee list reconciled to HR records; no ghost employees or duplicate entries identified.</p>', 'W/P Ref: PY-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-pay-3',
      title: '3. Time & Attendance Controls',
      questions: [
        q('scot-pay-q3a', '<p>Has the auditor documented the time recording system (automated timekeeping vs. manual timesheets) and its integration with payroll?</p>', undefined, 'Yes', '<p>Vessel crew record time via digital log integrated with ADP; office and management staff record time on bi-weekly electronic timesheets submitted to supervisors for approval.</p>', 'W/P Ref: PY-03'),
        q('scot-pay-q3b', '<p>Is overtime authorized by supervisors before or immediately after it is incurred?</p>', undefined, 'Yes', '<p>Overtime pre-authorization required for office staff; vessel crew overtime approved by captain and reviewed by Operations Manager before payroll submission.</p>', 'W/P Ref: PY-03'),
        q('scot-pay-q3c', '<p>Are exception reports generated and reviewed for unusual time entries (e.g., excessive hours, entries on holidays)?</p>', undefined, 'Yes', '<p>ADP generates exception report flagging overtime above 20 hours per pay period and holiday entries; controller reviews exception report each pay cycle.</p>', 'W/P Ref: PY-03'),
        q('scot-pay-q3d', '<p>Is time data independently reviewed and approved by supervisors before submission to payroll?</p>', undefined, 'Yes', '<p>All timesheets require supervisor electronic approval in ADP before payroll processing; unapproved timesheets are blocked from payroll calculation by the system.</p>', 'W/P Ref: PY-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-pay-4',
      title: '4. Payroll Processing & Disbursement Controls',
      questions: [
        q('scot-pay-q4a', '<p>Is the payroll calculation reviewed for reasonableness (e.g., comparison to prior period) before final approval?</p>', undefined, 'Yes', '<p>Controller reviews ADP payroll register against prior period before approval; variances above 5% investigated and resolved. Gross pay comparison documented in payroll sign-off checklist.</p>', 'W/P Ref: PY-04'),
        q('scot-pay-q4b', '<p>Is payroll approved by management before funds are disbursed?</p>', undefined, 'Yes', '<p>Controller approves payroll register; CFO releases EFT payment to ADP for direct deposit processing. Dual approval required before any funds disbursed.</p>', 'W/P Ref: PY-04'),
        q('scot-pay-q4c', '<p>Are controls in place over direct deposit setups and changes to employee banking details to prevent unauthorized alterations?</p>', undefined, 'Yes', '<p>Employee banking detail changes require employee-signed authorization form and HR manager verification in ADP; ADP sends email confirmation of banking changes to employee\'s personal email on file.</p>', 'W/P Ref: PY-04'),
        q('scot-pay-q4d', '<p>Is the payroll bank account reconciled regularly, and are reconciling items investigated and resolved promptly?</p>', undefined, 'Yes', '<p>Payroll bank account (dedicated ADP funding account) reconciled bi-weekly by controller after each payroll; no reconciling items outstanding at year-end.</p>', 'W/P Ref: PY-04'),
        q('scot-pay-q4e', '<p>Is there a procedure for handling unclaimed wages or returned direct deposit payments?</p>', undefined, 'Yes', '<p>Returned direct deposits held in payroll bank account pending re-issue; returned amounts reviewed by HR manager and re-issued after banking information verified. No material unclaimed wages at year-end.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-scot-pay-5',
      title: '5. Payroll Tax & Statutory Compliance',
      questions: [
        q('scot-pay-q5a', '<p>Are source deduction calculations (CPP, EI, and income tax) reviewed for accuracy, and are calculations reconciled to payroll records?</p>', undefined, 'Yes', '<p>ADP calculates CPP, EI, and income tax deductions; controller reconciles ADP tax summary to CRA remittance amounts quarterly. No discrepancies noted for FY2024.</p>', 'W/P Ref: PY-05'),
        q('scot-pay-q5b', '<p>Are source deductions and employer contributions remitted to the CRA on a timely basis to avoid penalties and interest?</p>', undefined, 'Yes', '<p>ADP remits source deductions electronically to CRA on the 15th of each month; no late remittances or penalties incurred during FY2024. Remittance confirmations filed.</p>', 'W/P Ref: PY-05'),
        q('scot-pay-q5c', '<p>Are year-end T4/T4A slips prepared and reconciled to payroll records and the general ledger before filing?</p>', undefined, 'Yes', '<p>T4 slips prepared by ADP and reconciled by controller to payroll GL account and CRA remittances before February 28, 2024 filing deadline. No material discrepancies identified.</p>', 'W/P Ref: PY-05'),
      ],
      isExpanded: true
    },
  ];
  return {
    id: 'global-template-scot-pay',
    title: 'SCOT — Payroll Cycle',
    description: 'System and Control Overview Template for the Payroll Cycle, documenting controls over payroll processing, authorization, and disbursement.',
    objective: `CAS 315 requires the auditor to obtain an understanding of the entity's significant transaction cycles and the controls over those cycles. This SCOT documents the auditor's understanding of the Payroll Cycle — from employee master file maintenance through payroll tax compliance — including the key controls over completeness, accuracy, and authorization of payroll. This understanding informs risk assessment and the design of further audit procedures.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// ─── Accumulation of Identified Misstatements ───────────────────────────────
export const generateAccumulationOfMisstatementsChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });
  const sections: Section[] = [
    {
      id: 'section-aim-1',
      title: '1. Factual Misstatements',
      questions: [
        q('aim-q1a', '<p>Have all factual misstatements (i.e., misstatements about which there is no doubt, such as arithmetic errors or posting errors) been identified and documented?</p>', undefined, 'Yes', '<p>Three factual misstatements identified: (1) revenue cutoff AJE-001 $45K, (2) depreciation correction AJE-002 $12K, (3) deferred revenue reclassification AJE-003 $28K. All documented in the misstatement summary.</p>', 'W/P Ref: MIS-01'),
        q('aim-q1b', '<p>Has management been informed of factual misstatements and given an opportunity to correct them?</p>', undefined, 'Yes', '<p>All three AJEs communicated to management during fieldwork (April 14–25, 2024). Management was given the opportunity and agreed to record all corrections in the final financial statements.</p>'),
        q('aim-q1c', '<p>Have agreed corrections from management been reflected in the financial statements or working papers?</p>', undefined, 'Yes', '<p>All three corrections confirmed as recorded in the final financial statements. Working papers updated to reflect corrected balances.</p>', 'W/P Ref: MIS-01'),
        q('aim-q1d', '<p>Have uncorrected factual misstatements been documented separately for evaluation against materiality?</p>', undefined, 'NA', '<p>All factual misstatements were corrected by management. No uncorrected factual misstatements remain.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-aim-2',
      title: '2. Judgmental Misstatements',
      questions: [
        q('aim-q2a', '<p>Have judgmental misstatements arising from differences in management\'s accounting estimates or policies been identified and documented?</p>', undefined, 'Yes', '<p>No judgmental misstatements identified. Audit team formed independent point estimates for vessel depreciation and allowance for doubtful accounts — both within a reasonable range of management\'s estimates.</p>', 'W/P Ref: MIS-01'),
        q('aim-q2b', '<p>Has the auditor formed an independent best estimate (or range) for significant accounting estimates to compare with management\'s estimates?</p>', undefined, 'Yes', '<p>Independent estimate developed for vessel depreciation (25-year life vs management 22-year — difference immaterial) and allowance for doubtful accounts ($82K vs management $85K — within acceptable range).</p>', 'W/P Ref: MIS-02'),
        q('aim-q2c', '<p>Has the reasonableness of management\'s estimates been assessed, including the assumptions and methods used?</p>', undefined, 'Yes', '<p>Management estimates assessed as reasonable. Vessel useful lives corroborated with industry data and appraisal. Allowance for doubtful accounts methodology (90-day aging threshold) assessed as consistent with historical collection patterns.</p>'),
        q('aim-q2d', '<p>Where a range is used to evaluate an estimate, has the auditor ensured management\'s point estimate falls within a reasonable range?</p>', undefined, 'Yes', '<p>Management\'s point estimate for allowance for doubtful accounts ($85K) falls within the auditor\'s reasonable range of $75K–$100K. No adjustment required.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-aim-3',
      title: '3. Projected Misstatements',
      questions: [
        q('aim-q3a', '<p>Have misstatements identified in audit samples been projected to the full population using an appropriate projection method?</p>', undefined, 'Yes', '<p>Proportional projection method applied to revenue and expense samples. Projected misstatements: revenue $18K, operating expenses $12K. Total projected $30K.</p>', 'W/P Ref: MIS-03'),
        q('aim-q3b', '<p>Has the basis for projection (e.g., proportional, mean per unit) been documented and applied consistently?</p>', undefined, 'Yes', '<p>Proportional projection basis documented and applied consistently to all sampled populations. Projection calculations documented in MIS-03.</p>'),
        q('aim-q3c', '<p>Has sampling risk been considered when evaluating whether projected misstatements are material?</p>', undefined, 'Yes', '<p>Sampling risk considered. Projected misstatements of $30K are well below performance materiality of $87,500 even after considering upward bias due to sampling risk.</p>'),
        q('aim-q3d', '<p>Have projected misstatements been included in the accumulation schedule for comparison against performance materiality?</p>', undefined, 'Yes', '<p>Projected misstatements included in the misstatement accumulation schedule. Total uncorrected (projected only) = $30K vs. performance materiality $87,500.</p>', 'W/P Ref: MIS-03'),
      ],
      isExpanded: true
    },
    {
      id: 'section-aim-4',
      title: '4. Evaluation of Uncorrected Misstatements',
      questions: [
        q('aim-q4a', '<p>Has the aggregate of uncorrected misstatements (factual, judgmental, and projected) been compared to performance materiality?</p>', undefined, 'Yes', '<p>Aggregate: factual uncorrected $0 (all corrected), judgmental $0 (estimates within range), projected $30K. Total $30K < performance materiality $87,500. Concluded as not material.</p>', 'W/P Ref: MIS-04'),
        q('aim-q4b', '<p>Have qualitative factors been considered in evaluating the significance of uncorrected misstatements (e.g., misstatements that affect compliance with covenants, trends, or key ratios)?</p>', undefined, 'Yes', '<p>Qualitative factors assessed. Projected misstatements of $30K do not affect any key ratios, debt covenants, or other sensitive metrics. No qualitative factors elevate significance beyond quantitative assessment.</p>'),
        q('aim-q4c', '<p>Has the impact of prior period uncorrected misstatements been considered using the appropriate method (iron curtain or rollover)?</p>', undefined, 'Yes', '<p>No uncorrected misstatements from prior year carried forward. Iron curtain and rollover methods produce same result ($0 prior year impact).</p>'),
        q('aim-q4d', '<p>Has the auditor concluded whether uncorrected misstatements, individually or in aggregate, are material to the financial statements?</p>', undefined, 'Yes', '<p>Concluded that uncorrected projected misstatements of $30K are not material to the March 31, 2024 financial statements, individually or in aggregate. Opinion is unmodified.</p>', 'W/P Ref: MIS-04'),
        q('aim-q4e', '<p>If aggregate uncorrected misstatements approach performance materiality, has the auditor considered whether additional procedures are needed?</p>', undefined, 'NA', '<p>Aggregate uncorrected misstatements of $30K represent 34% of performance materiality — do not approach the threshold. No additional procedures required.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-aim-5',
      title: '5. Communication to Management & TCWG',
      questions: [
        q('aim-q5a', '<p>Have all identified misstatements (corrected and uncorrected) been communicated to management on a timely basis?</p>', undefined, 'Yes', '<p>All three AJEs communicated to management during fieldwork. Projected misstatements communicated at conclusion of fieldwork on April 25, 2024. Timely communication maintained throughout the audit.</p>'),
        q('aim-q5b', '<p>Has management\'s response to each uncorrected misstatement been documented, including the reasons management has given for not correcting?</p>', undefined, 'Yes', '<p>Management advised that projected misstatements of $30K are not cost-effective to specifically identify and correct, and are immaterial. Response documented in MIS-04.</p>', 'W/P Ref: MIS-04'),
        q('aim-q5c', '<p>Has written representation been obtained from management acknowledging that uncorrected misstatements are not material (individually or in aggregate) to the financial statements?</p>', undefined, 'Yes', '<p>Written representation obtained in the management representation letter, paragraph 8, confirming that uncorrected misstatements are immaterial individually and in aggregate. Signed April 25, 2024.</p>', 'W/P Ref: MRL-01'),
      ],
      isExpanded: true
    },
  ];
  return {
    id: 'global-template-aim',
    title: 'Accumulation of Identified Misstatements',
    description: 'Documents the accumulation, evaluation, and communication of all misstatements identified during the audit, per CAS 450.',
    objective: `CAS 450 requires the auditor to accumulate all misstatements identified during the audit (other than those that are clearly trivial), evaluate their effect, and communicate them to management and TCWG. This checklist documents the three types of misstatements — factual, judgmental, and projected — and the auditor's evaluation of whether uncorrected misstatements are material to the financial statements, individually or in aggregate.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// ─── Final Analytical Review ────────────────────────────────────────────────
export const generateFinalAnalyticalReviewChecklist = (): Checklist => {
  const q = (id: string, text: string, subQuestions?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(subQuestions ? { subQuestions } : {})
  });
  const sections: Section[] = [
    {
      id: 'section-far-1',
      title: '1. Overall Financial Statement Review',
      questions: [
        q('far-q1a', '<p>Has the auditor compared the current year financial statements to the prior year financial statements and identified unusual or unexpected changes?</p>', undefined, 'Yes', '<p>Current year financial statements compared to prior year. Key changes identified: revenue increase of $840K (7.2%), gross margin improvement of 0.8%, long-term debt reduction of $450K. All changes investigated.</p>', 'W/P Ref: FAR-01'),
        q('far-q1b', '<p>Have all unusual or unexpected relationships identified in the overall review been investigated and explained to the auditor\'s satisfaction?</p>', undefined, 'Yes', '<p>Revenue increase explained by three new freight contracts in Q4 2024 ($120K) and general freight rate improvement in Atlantic Canada routes ($720K). Explanations corroborated with contract documentation and rate schedules.</p>', 'W/P Ref: FAR-02'),
        q('far-q1c', '<p>Are the overall financial statements consistent with the auditor\'s knowledge of the entity and its environment?</p>', undefined, 'Yes', '<p>Financial statements are consistent with the auditor\'s understanding of Shipping Line Inc.\'s operations, the maritime freight industry conditions for fiscal 2024, and the entity\'s growth trajectory.</p>'),
        q('far-q1d', '<p>Have significant changes from interim financial statements to year-end been identified and explained?</p>', undefined, 'Yes', '<p>Q3 to year-end changes identified: Revenue increased $2.1M in Q4 (seasonal freight peak). Three revenue AJEs recorded at year-end. All changes explained and consistent with operations.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-far-2',
      title: '2. Income Statement Analytics',
      questions: [
        q('far-q2a', '<p>Has the auditor analyzed revenue trends and obtained explanations for significant fluctuations compared to prior year and budget?</p>', undefined, 'Yes', '<p>Revenue of $12.5M (prior year $11.66M, budget $12.2M). $300K favorable to budget explained by stronger Q4 freight rates. Revenue trend consistent with maritime industry recovery in fiscal 2024.</p>', 'W/P Ref: FAR-03'),
        q('far-q2b', '<p>Has the gross margin percentage been compared to prior year and budget, with significant variances investigated?</p>', undefined, 'Yes', '<p>Gross margin of 32.1% (prior year 31.3%, budget 31.5%). Improvement of 0.8pp from prior year explained by higher freight rates partially offset by increased fuel costs. Margin improvement assessed as reasonable.</p>', 'W/P Ref: FAR-03'),
        q('far-q2c', '<p>Have significant expense fluctuations (e.g., unusual increases or decreases in operating expenses) been investigated and explained?</p>', undefined, 'Yes', '<p>Fuel expenses increased $320K (18%) consistent with higher voyage activity and moderate fuel price increases. Crew costs increased $190K (8%) consistent with wage increases and higher voyage count. No unusual expense fluctuations.</p>'),
        q('far-q2d', '<p>Are interest and financing costs consistent with the entity\'s debt level and applicable interest rates?</p>', undefined, 'Yes', '<p>Interest expense of $248K consistent with average long-term debt balance of $5.05M at an average rate of approximately 4.9%. Recalculated and agreed to loan agreements.</p>', 'W/P Ref: FAR-04'),
        q('far-q2e', '<p>Is the income tax provision (current and deferred) consistent with the pre-tax income and applicable tax rates?</p>', undefined, 'Yes', '<p>Income tax provision of $412K consistent with pre-tax income of $1.26M at effective rate of 32.7% (combined federal/provincial rate for maritime freight company). Reviewed and agreed.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-far-3',
      title: '3. Balance Sheet Analytics',
      questions: [
        q('far-q3a', '<p>Are changes in working capital (accounts receivable, inventory, accounts payable) reasonable given the entity\'s operating activity?</p>', undefined, 'Yes', '<p>AR increase of $185K consistent with revenue growth. DSO of 61 days (prior year 59 days) — reasonable for maritime freight. AP increase of $95K consistent with increased operating activity. Working capital changes assessed as reasonable.</p>', 'W/P Ref: FAR-05'),
        q('far-q3b', '<p>Have significant changes in asset balances (capital additions, disposals, impairments) been investigated and explained?</p>', undefined, 'Yes', '<p>Capital additions of $650K: $465K dry-dock improvements (two vessels), $185K capitalized. Net decrease in vessel net book value of $820K due to depreciation of $1.47M offset by additions of $650K. No impairments identified.</p>', 'W/P Ref: FAR-05'),
        q('far-q3c', '<p>Are debt levels and terms consistent with loan agreements and debt covenants reviewed during the audit?</p>', undefined, 'Yes', '<p>Long-term debt of $4.8M consistent with opening balance of $5.25M less $450K repayments. Terms agree to loan agreements reviewed. Debt covenants (debt service coverage, working capital ratio) confirmed as met at March 31, 2024.</p>', 'W/P Ref: FAR-05'),
        q('far-q3d', '<p>Do changes in equity accounts (net income, distributions, share issuances) reconcile with the statement of changes in equity?</p>', undefined, 'Yes', '<p>Equity roll-forward confirmed: opening $4.82M + net income $847K - dividends $250K = closing $5.42M. Agreed to statement of changes in equity. No unexplained changes.</p>'),
        q('far-q3e', '<p>Have related party balances been identified, appropriately disclosed, and are the amounts consistent with documented transactions?</p>', undefined, 'Yes', '<p>Related party balances (management fee payable $15K, charter payable $35K) confirmed as consistent with documented transactions and appropriately disclosed in Note 12.</p>', 'W/P Ref: RPT-02'),
      ],
      isExpanded: true
    },
    {
      id: 'section-far-4',
      title: '4. Ratio Analysis',
      questions: [
        q('far-q4a', '<p>Are the current ratio and quick ratio reasonable and consistent with prior periods and industry norms?</p>', undefined, 'Yes', '<p>Current ratio of 1.85 (prior year 1.72) and quick ratio of 1.48 (prior year 1.38) — both above 1.0 and consistent with positive trend. Adequate liquidity for maritime freight operations.</p>', 'W/P Ref: FAR-06'),
        q('far-q4b', '<p>Is the debt-to-equity ratio within any applicable covenant limits and consistent with the entity\'s financing strategy?</p>', undefined, 'Yes', '<p>Debt-to-equity ratio of 0.89:1 (prior year 1.09:1). Covenant maximum is 2.0:1 — significantly within limit. Reduction reflects strong earnings and debt repayments during fiscal 2024.</p>'),
        q('far-q4c', '<p>Are days sales outstanding (DSO) and inventory turnover consistent with industry norms and prior periods?</p>', undefined, 'Yes', '<p>DSO of 61 days is consistent with prior year (59 days) and industry norms for maritime freight (typically 45–75 days). Fuel and supplies inventory turnover consistent with voyage frequency.</p>'),
        q('far-q4d', '<p>Are return on assets and return on equity consistent with prior periods and the entity\'s performance expectations?</p>', undefined, 'Yes', '<p>ROA of 4.7% (prior year 3.9%) and ROE of 16.6% (prior year 14.2%) — both improved from prior year reflecting stronger freight rates and operating leverage. Consistent with performance expectations.</p>'),
      ],
      isExpanded: true
    },
    {
      id: 'section-far-5',
      title: '5. Overall Conclusion',
      questions: [
        q('far-q5a', '<p>Have all significant fluctuations and unexpected relationships identified during final analytical procedures been investigated and adequately explained?</p>', undefined, 'Yes', '<p>All significant fluctuations investigated and explained. Revenue increase (new contracts + rate improvement), margin improvement (rate vs. cost mix), debt reduction (scheduled repayments) — all corroborated with evidence.</p>', 'W/P Ref: FAR-07'),
        q('far-q5b', '<p>Have the final analytical procedures identified any new risks of material misstatement not previously identified, and if so, have additional procedures been performed?</p>', undefined, 'No', '<p>No new risks of material misstatement identified during final analytical procedures. All fluctuations explained without requiring additional procedures.</p>'),
        q('far-q5c', '<p>Overall, are the financial statements consistent with the auditor\'s understanding of the entity and its environment, and do they present fairly in all material respects?</p>', undefined, 'Yes', '<p>Final analytical review confirms the financial statements are consistent with the auditor\'s understanding of Shipping Line Inc., its maritime freight operations, and the economic environment for fiscal 2024. Unmodified opinion supported.</p>', 'W/P Ref: FAR-07'),
      ],
      isExpanded: true
    },
  ];
  return {
    id: 'global-template-far',
    title: 'Final Analytical Review',
    description: 'Documents the analytical procedures performed near the end of the audit to form an overall conclusion on whether the financial statements are consistent with the auditor\'s understanding of the entity, per CAS 520.',
    objective: `CAS 520 requires the auditor to design and perform analytical procedures near the end of the audit to assist in forming an overall conclusion about whether the financial statements are consistent with the auditor's understanding of the entity. This checklist documents the final analytical procedures performed, the explanations obtained for significant fluctuations, and the auditor's overall conclusion on the financial statements.`,
    sections,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Going Concern — Initial Assessment (Risk Assessment phase, CAS 570)
export const generateGoingConcernInitialAssessmentChecklist = (): Checklist => {
  const q = (id: string, text: string, sub?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(sub ? { subQuestions: sub } : {})
  });
  const la = (id: string, text: string, answer = ''): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer
  });

  const sections: Section[] = [
    {
      id: 'gc-init-s1',
      title: '1. Identification of Adverse Events and Conditions',
      questions: [
        q('gc-init-1a', '<p><strong>Financial indicators:</strong></p>', [
          q('gc-init-1a-i', '<p>Net liability or net current liability position.</p>', undefined, 'No', '<p>Shipping Line Inc. has a positive net asset position; total assets of $18.2M exceed total liabilities of $7.1M. Current assets of $3.4M exceed current liabilities of $2.1M.</p>'),
          q('gc-init-1a-ii', '<p>Fixed-term borrowings approaching maturity without realistic prospects of renewal or repayment, or excessive reliance on short-term borrowings to finance long-term assets.</p>', undefined, 'No', '<p>Long-term debt of $4.8M matures in 2027; management has confirmed the credit facility is in good standing and renewal discussions are not yet required.</p>'),
          q('gc-init-1a-iii', '<p>Indications of withdrawal of financial support by creditors.</p>', undefined, 'No'),
          q('gc-init-1a-iv', '<p>Negative operating cash flows indicated by historical or prospective financial statements.</p>', undefined, 'No', '<p>Operating cash flows were positive at approximately $1.4M for FY2024; FY2025 budget projects continued positive operating cash flows.</p>'),
          q('gc-init-1a-v', '<p>Adverse key financial ratios.</p>', undefined, 'No', '<p>Key ratios assessed: current ratio 1.6x, debt-to-equity 0.64x, interest coverage 4.2x — all within acceptable ranges for the marine shipping industry.</p>'),
          q('gc-init-1a-vi', '<p>Substantial operating losses or significant deterioration in the value of assets used to generate cash flows.</p>', undefined, 'No', '<p>Net income of $847K recorded for FY2024; no vessel impairment indicators identified during the risk assessment phase.</p>'),
          q('gc-init-1a-vii', '<p>Arrears or discontinuance of dividends.</p>', undefined, 'NA', '<p>Not applicable — entity does not pay dividends; retained earnings reinvested in vessel operations.</p>'),
          q('gc-init-1a-viii', '<p>Inability to pay creditors on due dates.</p>', undefined, 'No', '<p>AP aging reviewed; no past-due amounts identified and suppliers confirmed payment on normal terms during management inquiries.</p>'),
          q('gc-init-1a-ix', '<p>Inability to comply with the terms of loan agreements.</p>', undefined, 'No', '<p>Debt covenants reviewed; entity is in compliance with all loan agreement terms. DSCR of 2.1x exceeds minimum covenant of 1.25x.</p>'),
          q('gc-init-1a-x', '<p>Change from credit to cash-on-delivery transactions with suppliers.</p>', undefined, 'No'),
          q('gc-init-1a-xi', '<p>Inability to obtain financing for essential new product development or other essential investments.</p>', undefined, 'No', '<p>Operating credit facility renewed in November 2023 at existing terms; management has no immediate capital financing requirements beyond existing facilities.</p>'),
        ]),
        q('gc-init-1b', '<p><strong>Operating indicators:</strong></p>', [
          q('gc-init-1b-i', '<p>Management intentions to liquidate the entity or to cease operations.</p>', undefined, 'No', '<p>No indications of management intentions to liquidate or cease operations; FY2025 budget prepared and approved by board in March 2024.</p>'),
          q('gc-init-1b-ii', '<p>Loss of key management without replacement.</p>', undefined, 'No', '<p>Senior management team stable; CEO and CFO both in position for more than five years with no planned departures.</p>'),
          q('gc-init-1b-iii', '<p>Loss of a major market, key customer(s), franchise, license, or principal supplier(s).</p>', undefined, 'No', '<p>Three major freight customers account for approximately 68% of revenue; all contracts renewed for FY2025. No customer losses identified during planning.</p>'),
          q('gc-init-1b-iv', '<p>Labour difficulties.</p>', undefined, 'No', '<p>No labour disputes or union actions during the year; collective agreement renewed in January 2024 for a three-year term.</p>'),
          q('gc-init-1b-v', '<p>Shortages of important supplies.</p>', undefined, 'No', '<p>Fuel supply contracts in place with two major suppliers; no supply shortages or disruptions noted during the year.</p>'),
          q('gc-init-1b-vi', '<p>Emergence of a highly successful competitor.</p>', undefined, 'No', '<p>Competitive landscape reviewed; no new competitors identified as posing a material threat to Shipping Line Inc.\'s market position in its operating routes.</p>'),
        ]),
        q('gc-init-1c', '<p><strong>Other indicators:</strong></p>', [
          q('gc-init-1c-i', '<p>Non-compliance with capital or other statutory requirements.</p>', undefined, 'No', '<p>Transport Canada vessel safety certificates current; no statutory compliance issues identified during the year.</p>'),
          q('gc-init-1c-ii', '<p>Pending legal or regulatory proceedings against the entity that may, if successful, result in claims that the entity is unlikely to be able to satisfy.</p>', undefined, 'No', '<p>Management and legal counsel confirmed no pending legal proceedings against the entity as of April 2024.</p>'),
          q('gc-init-1c-iii', '<p>Changes in law or regulation or government policy expected to adversely affect the entity.</p>', undefined, 'No', '<p>New port authority reporting requirements noted but do not have a material financial impact. No other adverse regulatory changes anticipated.</p>'),
          q('gc-init-1c-iv', '<p>Uninsured or underinsured catastrophes when they occur.</p>', undefined, 'No', '<p>Insurance coverage reviewed; all three vessels fully insured for hull and machinery, protection and indemnity. Coverage assessed as adequate relative to asset values.</p>'),
        ]),
        la('gc-init-1-notes', '<p><strong>Notes — describe any adverse events or conditions identified above:</strong></p>', 'No adverse events or conditions were identified during the going concern initial assessment for Shipping Line Inc. (year-end March 31, 2024). The entity is financially sound with positive operating cash flows, adequate liquidity, and compliance with all debt covenants. No indicators of going concern issues were identified from financial, operating, or other perspectives.'),
      ],
      isExpanded: true
    },
    {
      id: 'gc-init-s2',
      title: '2. Inquiry of Management',
      questions: [
        q('gc-init-2a', '<p>Have you inquired of management whether they are aware of events or conditions beyond the period of management\'s assessment that may cast significant doubt on the entity\'s ability to continue as a going concern? (CAS 570.17)</p>', undefined, 'Yes', '<p>CFO and CEO both confirmed no awareness of events or conditions that may cast significant doubt on the entity\'s ability to continue as a going concern for at least 12 months from the date of the auditor\'s report.</p>', 'W/P Ref: GC-01'),
        q('gc-init-2b', '<p>Has management performed a going concern assessment for the current period? If so, obtain and review it.</p>', undefined, 'Yes', '<p>Management prepared a going concern assessment letter confirming the going concern basis is appropriate for at least 12 months from the auditor\'s report date; reviewed and filed at GC-02.</p>', 'W/P Ref: GC-02'),
        q('gc-init-2c', '<p>Does management\'s assessment cover a period of at least 12 months from the expected date of the auditor\'s report? (CAS 570.13)</p>', undefined, 'Yes', '<p>Management\'s assessment covers the period to June 30, 2025 (14 months from the expected auditor\'s report date of April 30, 2024), satisfying the CAS 570.13 requirement.</p>', 'W/P Ref: GC-02'),
        la('gc-init-2-notes', '<p><strong>Notes — summarize management\'s assessment and conclusions:</strong></p>', 'Management\'s going concern assessment concluded that Shipping Line Inc. will continue as a going concern for at least 12 months from the auditor\'s report date. The assessment noted: (1) positive operating cash flows of $1.4M in FY2024; (2) an approved FY2025 budget projecting continued profitability; (3) the operating credit facility renewed until November 2026; and (4) full compliance with all debt covenants. The auditor concurs with management\'s assessment.'),
      ],
      isExpanded: true
    },
    {
      id: 'gc-init-s3',
      title: '3. Preliminary Conclusion',
      questions: [
        q('gc-init-3a', '<p>Based on the above, does significant doubt exist about the entity\'s ability to continue as a going concern?</p>', undefined, 'No', '<p>No significant doubt exists. All financial, operating, and other indicators reviewed are positive; no adverse events or conditions were identified during the initial assessment.</p>', 'W/P Ref: GC-03'),
        q('gc-init-3b', '<p>If significant doubt exists, have additional audit procedures been planned to evaluate management\'s response (to be performed and documented in the Going Concern — Final Assessment form)?</p>', undefined, 'NA', '<p>Not applicable — no significant doubt identified; additional going concern procedures are not required beyond standard completion procedures.</p>'),
        la('gc-init-3-notes', '<p><strong>Preliminary conclusion and planned additional procedures:</strong></p>', 'Preliminary conclusion: Going concern basis of accounting is appropriate for Shipping Line Inc. for the year ended March 31, 2024. No significant doubt indicators identified. No additional going concern procedures required beyond the standard confirmation of no subsequent events affecting this conclusion at the completion stage.'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-gc-initial',
    title: 'Going Concern — Initial Assessment',
    description: 'Documents the initial assessment of going concern indicators identified during the risk assessment phase of the audit, per CAS 570.',
    objective: `CAS 570 requires the auditor to obtain sufficient appropriate audit evidence about whether management has appropriately applied the going concern basis of accounting. This checklist documents the initial identification of events and conditions that may cast significant doubt on the entity's ability to continue as a going concern, identified during the risk assessment phase.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Going Concern — Final Assessment (Completion phase, CAS 570)
export const generateGoingConcernFinalAssessmentChecklist = (): Checklist => {
  const q = (id: string, text: string, sub?: Question[], answer = '', explanation = '', reference = ''): Question => ({
    id, text, answerType: 'yes-no-na' as const, options: ['Yes', 'No', 'NA'],
    required: false, answer, explanation, reference, ...(sub ? { subQuestions: sub } : {})
  });
  const la = (id: string, text: string, answer = ''): Question => ({
    id, text, answerType: 'long-answer' as const, options: [], required: false, answer
  });

  const sections: Section[] = [
    {
      id: 'gc-final-s1',
      title: '1. Summary of Events and Conditions Identified',
      questions: [
        q('gc-final-1a', '<p>Have all adverse events and conditions identified during the audit (including those in the initial going concern assessment) been summarized and considered in this final assessment?</p>', undefined, 'Yes', '<p>No adverse events or conditions were identified during the initial or final going concern assessment for Shipping Line Inc. The entity has positive net income ($847K), adequate working capital (current ratio 1.85:1), and no signs of financial distress.</p>', 'W/P Ref: GC-01'),
        la('gc-final-1-notes', '<p><strong>Summarize all adverse events and conditions identified during the audit:</strong></p>', 'No adverse events or conditions were identified during the audit of Shipping Line Inc. for the year ended March 31, 2024. The entity is financially stable with positive net income, adequate working capital, no covenant breaches, and no indicators of financial distress.'),
      ],
      isExpanded: true
    },
    {
      id: 'gc-final-s2',
      title: '2. Evaluation of Management\'s Plans',
      questions: [
        q('gc-final-2a', '<p>Has management prepared a detailed action plan? Obtain and document a copy.</p>', undefined, 'NA', '<p>No adverse going concern events identified. Management action plan not required.</p>'),
        q('gc-final-2b', '<p><strong>Management plans to dispose of assets:</strong></p>', [
          q('gc-final-2b-i', '<p>Are there restrictions on the entity\'s ability to sell the assets?</p>', undefined, 'NA'),
          q('gc-final-2b-ii', '<p>Has the effect of planned disposal on remaining operations been assessed?</p>', undefined, 'NA'),
          q('gc-final-2b-iii', '<p>Are cash flow reports or forecasts available and reviewed?</p>', undefined, 'NA'),
        ]),
        q('gc-final-2c', '<p><strong>Management plans to borrow money or restructure debt:</strong></p>', [
          q('gc-final-2c-i', '<p>Has the availability of debt financing and capacity to borrow been assessed?</p>', undefined, 'NA'),
          q('gc-final-2c-ii', '<p>Does the entity have sufficient collateral to obtain new financing?</p>', undefined, 'NA'),
          q('gc-final-2c-iii', '<p>Has the impact of new financing on operations and cash flows been assessed?</p>', undefined, 'NA'),
        ]),
        q('gc-final-2d', '<p><strong>Management plans to reduce or delay expenditures:</strong></p>', [
          q('gc-final-2d-i', '<p>Has the feasibility of proposed cost reductions been reviewed?</p>', undefined, 'NA'),
          q('gc-final-2d-ii', '<p>Has the impact of cost reductions on ongoing operations been assessed?</p>', undefined, 'NA'),
        ]),
        q('gc-final-2e', '<p><strong>Management plans to obtain additional capital contributions:</strong></p>', [
          q('gc-final-2e-i', '<p>Has the likelihood of obtaining new financing within required time frames been reviewed?</p>', undefined, 'NA'),
          q('gc-final-2e-ii', '<p>Has the effect on existing shareholders been assessed?</p>', undefined, 'NA'),
        ]),
        q('gc-final-2f', '<p>Where management has prepared a cash flow or earnings forecast, has it been evaluated for consistency with other known information about the entity and for reasonableness of assumptions?</p>', undefined, 'NA', '<p>Management did not prepare a specific going concern forecast as no adverse conditions were identified. Regular management budgets reviewed during the audit are consistent with continued profitability.</p>'),
        la('gc-final-2-notes', '<p><strong>Notes — evaluation of management\'s plans:</strong></p>', 'No management mitigation plans required as no going concern risks were identified. Management is executing its standard business plan for fiscal 2025 including two new vessel charter contracts and continued scheduled debt repayments.'),
      ],
      isExpanded: true
    },
    {
      id: 'gc-final-s3',
      title: '3. Additional Audit Procedures',
      questions: [
        q('gc-final-3a', '<p>Has sufficient appropriate audit evidence been obtained to evaluate management\'s going concern assessment and their plans to mitigate identified risks? (CAS 570.16–19)</p>', undefined, 'Yes', '<p>Sufficient evidence obtained: reviewed management\'s going concern assessment (April 25, 2024), analyzed financial ratios and trends, reviewed credit facility terms and availability, confirmed debt covenant compliance.</p>', 'W/P Ref: GC-02'),
        q('gc-final-3b', '<p>Have any subsequent events that are relevant to the going concern assessment been considered? (CAS 570.24)</p>', undefined, 'Yes', '<p>Subsequent events review through May 2, 2024 identified no events relevant to the going concern assessment.</p>'),
        la('gc-final-3-notes', '<p><strong>Notes — additional procedures performed and evidence obtained:</strong></p>', 'Additional procedures: (1) Reviewed management going concern assessment covering 12 months from audit report date (to May 2025). (2) Analyzed debt covenant compliance at March 31, 2024 — all covenants met. (3) Confirmed credit facility availability of $2.5M with Royal Bank. (4) Subsequent events review through May 2, 2024 — no adverse events identified.'),
      ],
      isExpanded: true
    },
    {
      id: 'gc-final-s4',
      title: '4. Final Conclusion',
      questions: [
        q('gc-final-4a', '<p>Based on all audit procedures performed, is the going concern basis of accounting appropriate?</p>', undefined, 'Yes', '<p>Going concern basis confirmed as appropriate. Shipping Line Inc. has positive net income of $847K, working capital of $1.82M, debt covenants met, and an established credit facility with $2.5M availability.</p>', 'W/P Ref: GC-03'),
        q('gc-final-4b', '<p>If significant doubt exists but the going concern basis is appropriate, is adequate disclosure made in the financial statements about the material uncertainty?</p>', undefined, 'NA', '<p>No significant doubt exists. Material uncertainty disclosure not required.</p>'),
        q('gc-final-4c', '<p>If the going concern basis is inappropriate, has the auditor\'s report been modified accordingly?</p>', undefined, 'NA', '<p>Going concern basis is appropriate. No modification to the audit report required.</p>'),
        q('gc-final-4d', '<p>Have written representations been obtained from management regarding their plans and the feasibility of those plans? (CAS 580)</p>', undefined, 'Yes', '<p>Management representation obtained confirming use of going concern basis is appropriate and that no events or conditions cast significant doubt on the entity\'s ability to continue as a going concern.</p>', 'W/P Ref: MRL-01'),
        q('gc-final-4e', '<p>Have TCWG been informed of going concern matters as required by CAS 260?</p>', undefined, 'Yes', '<p>TCWG informed in the final communication letter that no going concern issues were identified during the audit.</p>', 'W/P Ref: AC-04'),
        la('gc-final-4-notes', '<p><strong>Final conclusion on going concern:</strong></p>', 'Final conclusion: The going concern basis of accounting is appropriate for the preparation of Shipping Line Inc.\'s financial statements for the year ended March 31, 2024. No material uncertainty related to going concern exists. An unmodified audit opinion is issued without a going concern paragraph.'),
      ],
      isExpanded: true
    },
    {
      id: 'gc-final-s5',
      title: '5. Financial Statement Presentation and Disclosure',
      questions: [
        q('gc-final-5a', '<p>Do the financial statements adequately disclose going concern issues, including the nature of the events/conditions and management\'s plans to address them?</p>', undefined, 'NA', '<p>No going concern issues exist requiring disclosure in the financial statements.</p>'),
        q('gc-final-5b', '<p>If a material uncertainty exists, does the auditor\'s report include an appropriate "Material Uncertainty Related to Going Concern" paragraph?</p>', undefined, 'NA', '<p>No material uncertainty related to going concern exists. This paragraph is not included in the audit report.</p>'),
        la('gc-final-5-notes', '<p><strong>Notes on disclosure adequacy:</strong></p>', 'No going concern disclosures required. The financial statements appropriately use the going concern basis without any qualifications or special disclosures.'),
      ],
      isExpanded: true
    },
  ];

  return {
    id: 'global-template-gc-final',
    title: 'Going Concern — Final Assessment',
    description: 'Documents the final going concern assessment performed at the completion stage of the audit, including evaluation of management\'s plans and the auditor\'s final conclusion, per CAS 570.',
    objective: `CAS 570 requires the auditor to conclude on the appropriateness of management's use of the going concern basis of accounting. This checklist documents the final evaluation of management's plans to address identified going concern risks, the auditor's final conclusion, and the adequacy of financial statement disclosure.`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
