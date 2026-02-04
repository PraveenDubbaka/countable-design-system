import { Checklist, Section, Question } from '@/types/checklist';

// Client Acceptance and Continuance template data
export const generateClientAcceptanceContinuanceChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-quality-mgmt',
      title: 'Quality Management & Risk Assessment',
      questions: [
        {
          id: 'cac-q1',
          text: '<p>Determine whether accepting this engagement would contravene any of the firm\'s quality management policies.</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'N/A'],
          required: true,
          answer: ''
        },
        {
          id: 'cac-q2',
          text: `<p><strong>New Clients</strong></p>
<ol type="a">
<li>Indicate who in the firm has knowledge about the prospective client and whether they recommend that this entity be accepted as a new client.</li>
<li>Contact the predecessor practitioner to inquire about any reasons the engagement should not be accepted. If no response is received, explain what alternative procedures were performed.</li>
</ol>
<p><strong>All Clients</strong></p>
<ol type="a" start="3">
<li>Make inquiries and perform web searches for any new or emerging engagement risks that would impact the decision to accept or continue with this engagement.</li>
<li>Consider any risk factors identified from other sources.</li>
<li>Based on preliminary understanding, is there any indication that the financial information will be misleading?</li>
<li>Does management understand the limited nature of the engagement?</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'N/A'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'cac-q2-sub1',
              text: '<p>Are there any concerns about management integrity?</p>',
              answerType: 'yes-no',
              options: ['Yes', 'No'],
              required: false,
              answer: ''
            },
            {
              id: 'cac-q2-sub2',
              text: '<p>Has the client been involved in any litigation or regulatory actions?</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'N/A'],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'cac-q3',
          text: '<p>Does the firm have the competence, capabilities, and resources to perform the engagement?</p>',
          answerType: 'yes-no',
          options: ['Yes', 'No'],
          required: true,
          answer: ''
        },
        {
          id: 'cac-q4',
          text: '<p>Are there any potential conflicts of interest that need to be addressed?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'N/A'],
          required: true,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-independence',
      title: 'Independence & Ethics',
      questions: [
        {
          id: 'cac-q5',
          text: '<p>Have independence requirements been evaluated for all team members?</p>',
          answerType: 'yes-no',
          options: ['Yes', 'No'],
          required: true,
          answer: ''
        },
        {
          id: 'cac-q6',
          text: '<p>Are there any financial interests, business relationships, or other circumstances that could impair independence?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'N/A'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'cac-q6-sub1',
              text: '<p>If yes, have appropriate safeguards been applied?</p>',
              answerType: 'yes-no-na',
              options: ['Yes', 'No', 'N/A'],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'cac-q7',
          text: '<p>Have all engagement team members confirmed their independence?</p>',
          answerType: 'yes-no',
          options: ['Yes', 'No'],
          required: true,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-engagement-terms',
      title: 'Engagement Terms & Documentation',
      questions: [
        {
          id: 'cac-q8',
          text: '<p>Has an engagement letter been prepared or updated?</p>',
          answerType: 'yes-no',
          options: ['Yes', 'No'],
          required: true,
          answer: ''
        },
        {
          id: 'cac-q9',
          text: '<p>Does the engagement letter include all required elements per professional standards?</p>',
          answerType: 'yes-no',
          options: ['Yes', 'No'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'cac-q9-sub1',
              text: '<p>Objective and scope of engagement</p>',
              answerType: 'yes-no',
              options: ['Yes', 'No'],
              required: false,
              answer: ''
            },
            {
              id: 'cac-q9-sub2',
              text: '<p>Responsibilities of the practitioner</p>',
              answerType: 'yes-no',
              options: ['Yes', 'No'],
              required: false,
              answer: ''
            },
            {
              id: 'cac-q9-sub3',
              text: '<p>Responsibilities of management</p>',
              answerType: 'yes-no',
              options: ['Yes', 'No'],
              required: false,
              answer: ''
            },
            {
              id: 'cac-q9-sub4',
              text: '<p>Limitations of the engagement</p>',
              answerType: 'yes-no',
              options: ['Yes', 'No'],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'cac-q10',
          text: '<p>Has the engagement letter been signed by both parties?</p>',
          answerType: 'yes-no',
          options: ['Yes', 'No'],
          required: true,
          answer: ''
        },
        {
          id: 'cac-q10a',
          text: '<p>Date engagement letter was signed:</p>',
          answerType: 'date',
          options: [],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-approval',
      title: 'Approval & Authorization',
      questions: [
        {
          id: 'cac-q11',
          text: '<p>Has appropriate approval been obtained to accept/continue the engagement?</p>',
          answerType: 'yes-no',
          options: ['Yes', 'No'],
          required: true,
          answer: ''
        },
        {
          id: 'cac-q12',
          text: '<p>Engagement Partner approval:</p>',
          answerType: 'long-answer',
          options: [],
          required: true,
          answer: ''
        },
        {
          id: 'cac-q13',
          text: '<p>Date of approval:</p>',
          answerType: 'date',
          options: [],
          required: true,
          answer: ''
        },
        {
          id: 'cac-q14',
          text: '<p>Additional notes or comments:</p>',
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
    id: 'global-template-client-acceptance',
    title: 'Client Acceptance and Continuance',
    description: 'A comprehensive checklist for evaluating new client acceptance and continuing client relationships.',
    objective: `This checklist ensures proper evaluation of:
• Quality management and risk factors
• Independence and ethical considerations
• Engagement terms and documentation
• Proper approval and authorization processes`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Independence template data (based on screenshot)
export const generateIndependenceChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-independence',
      title: 'Independence Assessment',
      questions: [
        {
          id: 'ind-q1',
          text: `<p><strong>Are there any significant "threats" to independence that should be disclosed?</strong></p>
<ol type="a">
<li>Self-interest.</li>
<li>Self-review.</li>
<li>Advocacy.</li>
<li>Familiarity.</li>
<li>Intimidation.</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'ind-q1-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'ind-q2',
          text: `<p><strong>Do any of the following conditions apply to the firm or any staff member who will be performing the engagement?</strong> (One yes or no) and then comment section to add details. Also capability to add document references as needed.</p>
<ol type="a">
<li>Having a financial interest in a client.</li>
<li>Loans and guarantees to/from client.</li>
<li>Close business relationships with client.</li>
<li>Family and personal relationships with client.</li>
<li>Recent employment with client serving as officer, director or company secretary of client.</li>
<li>Acceptance of significant gifts or hospitality from client.</li>
<li>Fee quote that is considerably less than the previous accountant (charitable work excluded).</li>
<li>Other: Making key decisions on behalf of a client, significant journal entries or adjustments without client approval.</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'ind-q2-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'ind-q3',
          text: '<p><strong>Have we identified any impairment of independence under the Code of Professional Conduct / Code of Ethics?</strong> (If yes, it should be disclosed in the compilation engagement report.)</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'ind-q3-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'ind-q4',
          text: `<p><strong>Where a prohibition exists or where safeguards will not reduce a threat to an acceptable level, have we disclosed the activity, interest or relationship that impairs our independence?</strong></p>
<p><em>(Note: The nature and extent of lack of independence are required disclosures in the compilation engagement report.)</em></p>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'ind-q4-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
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
    id: 'global-template-independence',
    title: 'Independence',
    description: 'Evaluate independence requirements and identify potential threats.',
    objective: `This checklist ensures proper evaluation of:
• Threats to independence (self-interest, self-review, advocacy, familiarity, intimidation)
• Conditions that may impair independence
• Required disclosures for any independence impairments`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Knowledge of Client Business template data (based on screenshot)
export const generateKnowledgeOfClientBusinessChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-general-info',
      title: 'General Information',
      questions: [
        {
          id: 'kcb-q1',
          text: '<p><strong>Type of entity</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: true,
          answer: ''
        },
        {
          id: 'kcb-q2',
          text: '<p><strong>Jurisdiction of incorporation/status date</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q3',
          text: '<p><strong>Changes to structure/ownership, investments, including any related groups</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q4',
          text: '<p><strong>Governance And Key Management</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q5',
          text: '<p><strong>Key advisors to the entity (e.g., legal and bank)</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q6',
          text: `<p><strong>Users of the FI including any third-party users:</strong></p>`,
          answerType: 'multiple-choice',
          options: ['Management', 'Shareholders', 'Directors', 'Others', 'Regulators', 'Related parties', 'All of the above'],
          required: false,
          answer: '',
          subQuestions: [
            {
              id: 'kcb-q6-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-business-ops',
      title: 'Business And Operations',
      questions: [
        {
          id: 'kcb-q7',
          text: '<p><strong>The industry and the nature of the entity\'s operations</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q8',
          text: '<p><strong>The entity\'s products and/or services</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q9',
          text: '<p><strong>The size of the entity (turnover, revenue, assets or number of employees)</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q10',
          text: '<p><strong>Joint/financing arrangements</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q11',
          text: '<p><strong>Significant changes from prior period</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-accounting-system',
      title: 'Accounting System And Records',
      questions: [
        {
          id: 'kcb-q12',
          text: '<p><strong>Who prepares the information/prepares the accounting records?</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q13',
          text: '<p><strong>Primary accounting software used:</strong></p>',
          answerType: 'multiple-choice',
          options: ['Manual/none', 'QuickBooks online', 'Xero/Zoho', 'PC Based Desktop, or spreadsheet-style excel'],
          required: false,
          answer: '',
          subQuestions: [
            {
              id: 'kcb-q13-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'kcb-q14',
          text: `<p><strong>Describe how the entity processes transactions for the preparation of items.</strong> Consider:</p>
<ul>
<li>Cash management services (e.g., invoices, cash and debit cards)</li>
<li>Non-cash activities are identified, classified and accumulated.</li>
<li>Any concerns with or used in relation to the above or accounting software</li>
</ul>`,
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q15',
          text: '<p><strong>Revenue</strong> (describe e.g., how the financial information is compiled and summarized, costs recorded, etc.)</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q16',
          text: '<p><strong>Revenues, receivables, receipts</strong> (e.g., sources of revenue and nature of receivables)</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q17',
          text: '<p><strong>Purchases, payments, payables</strong> (e.g., major suppliers and liabilities)</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q18',
          text: '<p><strong>Payroll</strong> (e.g., number of employees, how it operated applicant tax, bonuses)</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q19',
          text: '<p><strong>Other transactions</strong> (e.g., investments, insurance, inventory, fixed property, is an existing process)</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q20',
          text: '<p><strong>Describe the period end adjustments expected to be made to the FI on behalf of the entity.</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'kcb-q21',
          text: '<p><strong>Describe any matters that required adjustments in prior periods.</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-bank-reconciling',
      title: 'Bank Reconciling',
      questions: [
        {
          id: 'kcb-q22',
          text: '<p><strong>Check the management\'s final basis of accounting and, where applicable, accounting policies used to recognize and measure specific items in the FI.</strong></p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-taxes',
      title: 'Taxes Of The Entity',
      questions: [
        {
          id: 'kcb-q23',
          text: '<p><strong>Discuss in general the manner in which the FI intended will be read understanding the entity</strong> (e.g., financial institutions understand the nature of business, foreign customers or transactions, discard whether party transactions and complete the balance)</p>',
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
    id: 'global-template-knowledge-client-business',
    title: 'Knowledge of client business',
    description: 'Document understanding of the client\'s business, operations, and accounting systems.',
    objective: `This checklist captures essential knowledge about:
• General entity information and structure
• Business operations and industry
• Accounting systems and records
• Bank reconciliation processes
• Tax considerations`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Planning template data (based on screenshot)
export const generatePlanningChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-planning',
      title: 'Planning',
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
          text: '<p><strong>Any additional comments or thoughts for planning</strong> (To provide space for team to write comments)</p>',
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
    description: 'Document planning considerations and discussions for the engagement.',
    objective: `This checklist documents:
• Materiality thresholds for the engagement
• Client discussions throughout the year
• Additional planning notes and comments`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Withdrawal template data (based on screenshot)
export const generateWithdrawalChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-withdrawal-reason',
      title: 'Reason for Withdrawal',
      questions: [
        {
          id: 'wd-q1',
          text: `<p><strong>Identify which of the following situations is the reason for your withdrawal; and document the reasoning, actions taken and discussions with management</strong></p>`,
          answerType: 'multiple-choice',
          options: [
            'I. Management has not provided the records, documents, explanations or other information needed to prepare the FI.',
            'II. A correction is necessary, and management has not provided the additional or corrected information necessary to ensure the FI does not appear misleading.',
            'III. New Information has become known after engagement acceptance that, if known at the date of the compilation engagement report, would have been cause for the engagement not to have been accepted or continued.'
          ],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'wd-q1-sub1',
              text: '<p>a. Inappropriate use by management of the firm name.</p>',
              answerType: 'yes-no',
              options: ['Yes', 'No'],
              required: false,
              answer: ''
            },
            {
              id: 'wd-q1-sub2',
              text: `<p>b. Significant misrepresentations made by management to:</p>
<ul>
<li>Our partners or staff</li>
<li>Third parties about the work performed by our firm</li>
</ul>`,
              answerType: 'yes-no',
              options: ['Yes', 'No'],
              required: false,
              answer: ''
            },
            {
              id: 'wd-q1-sub3',
              text: '<p>c. Disagreements over billing.</p>',
              answerType: 'yes-no',
              options: ['Yes', 'No'],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'wd-q2',
          text: '<p><strong>Additional Explanation</strong></p>',
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
    id: 'global-template-withdrawal',
    title: 'Withdrawal',
    description: 'Document the reason for withdrawal from an engagement.',
    objective: `This checklist documents the circumstances and reasoning for withdrawing from an engagement, including:
• Situations that led to withdrawal
• Actions taken and discussions with management
• Additional explanations and documentation`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Completion template data (based on screenshot)
export const generateCompletionChecklist = (): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-completion',
      title: 'Completion',
      questions: [
        {
          id: 'comp-q1',
          text: `<p><strong>Change in intended use</strong> – Has there been a change in the intended use of the FI? If so, discuss with management whether the intended basis of accounting applied is appropriate.</p>
<p><em>Note: Consider obtaining a revised engagement letter. (See Form Client acceptance and continuance.)</em></p>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q1-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q2',
          text: `<p><strong>Prepare the FI</strong></p>
<ol type="a">
<li>Has the FI been prepared in accordance with the acknowledged basis of accounting documented on Form Knowledge of client business?</li>
<li>Does the FI disclose the basis of accounting used, and where applicable, accounting policies used to recognize and measure specific items?</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q2-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q3',
          text: `<p><strong>Significant judgments made</strong>, where assistance was provided to management in making significant judgments, have those judgments been discussed with management (and documented) to ensure they</p>
<ol type="a">
<li>Understand the impact of the judgments on the FI?</li>
<li>Accept responsibility for the FI?</li>
</ol>
<p>Consider:</p>
<ul>
<li>Determination of the basis of accounting.</li>
<li>Selection/application of accounting policies.</li>
<li>Estimates required (e.g., allowances for doubtful accounts, inventory obsolescence, accounts payable and accruals).</li>
</ul>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q3-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q4',
          text: `<p><strong>When completed:</strong></p>
<p>Determine whether any matters exist that would cause the FI to appear misleading.</p>
<ol type="a">
<li>Read the FI, taking into consideration knowledge of the entity and the basis of accounting applied.</li>
<li>Determine whether any matters exist that would cause the FI to appear misleading.</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q4-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q5',
          text: `<p><strong>When matters exist that cause the FI to appear misleading:</strong></p>
<ol type="a">
<li>Document such matter(s).</li>
<li>Discuss with management and request additional or corrected information.</li>
<li>Indicate and document how each matter was resolved.</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q5-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q6',
          text: '<p><strong>Reconciliation to accounting records</strong> – Have the accounting records been reconciled to the final FI, including any adjusting journal entries or other amendments that the practitioner has agreed with management?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q6-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q7',
          text: `<p><strong>Acknowledgement of responsibility</strong> – Has acknowledgement been obtained from management or those charged with governance, as appropriate, that they have taken responsibility for the final version of the FI, including the basis of accounting?</p>
<ol type="a">
<li>A signature on the final version of the FI.</li>
<li>A written communication (paper or electronic form).</li>
<li>An oral acknowledgement documented in the working paper file.</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q7-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
              required: false,
              answer: ''
            }
          ]
        },
        {
          id: 'comp-q8',
          text: `<p><strong>Compilation engagement report</strong></p>
<p>Has the compilation engagement report been:</p>
<ul>
<li>Appropriately worded, including any disclosure of impairment of independence in accordance with the provincial Code of Professional Conduct / Code of Ethics?</li>
<li>Dated when the compilation has been completed in compliance with CSRS 4200?</li>
<li>Included as documentation in the working papers?</li>
</ul>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: '',
          subQuestions: [
            {
              id: 'comp-q8-sub1',
              text: '<p>Additional Explanation</p>',
              answerType: 'long-answer',
              options: [],
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
    description: 'Final completion checklist for the engagement.',
    objective: `This checklist ensures proper completion of the engagement:
• Change in intended use assessment
• FI preparation verification
• Significant judgments documentation
• Misleading matters identification
• Reconciliation to accounting records
• Acknowledgement of responsibility
• Compilation engagement report review`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Map of global template IDs to their generator functions
export const GLOBAL_TEMPLATE_GENERATORS: Record<string, () => Checklist> = {
  'global-1-1': generateClientAcceptanceContinuanceChecklist,
  'global-1-2': generateIndependenceChecklist,
  'global-1-3': generateKnowledgeOfClientBusinessChecklist,
  'global-1-4': generatePlanningChecklist,
  'global-1-5': generateWithdrawalChecklist,
  'global-1-6': generateCompletionChecklist,
};

// Get a global template checklist by ID
export const getGlobalTemplateChecklist = (templateId: string): Checklist | null => {
  const generator = GLOBAL_TEMPLATE_GENERATORS[templateId];
  return generator ? generator() : null;
};
