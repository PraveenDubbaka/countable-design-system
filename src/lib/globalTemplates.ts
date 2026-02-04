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

// Map of global template IDs to their generator functions
export const GLOBAL_TEMPLATE_GENERATORS: Record<string, () => Checklist> = {
  'global-1-1': generateClientAcceptanceContinuanceChecklist,
  'global-1-5': generateWithdrawalChecklist,
};

// Get a global template checklist by ID
export const getGlobalTemplateChecklist = (templateId: string): Checklist | null => {
  const generator = GLOBAL_TEMPLATE_GENERATORS[templateId];
  return generator ? generator() : null;
};
