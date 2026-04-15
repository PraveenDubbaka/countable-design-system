import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ChecklistBuilder } from '@/components/ChecklistBuilder';
import { Checklist, GenerationScope, Section, Question } from '@/types/checklist';
import { RichTextToolbarProvider } from '@/contexts/RichTextToolbarContext';
import { UnsavedChangesDialog } from '@/components/UnsavedChangesDialog';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from '@/lib/safeJson';
import { dispatchChecklistSync } from '@/lib/checklistSync';
import { getGlobalTemplateChecklist } from '@/lib/globalTemplates';

const generateClientMeetingChecklist = (prompt: string): Checklist => {
  const sections: Section[] = [
    {
      id: 'section-meeting-info',
      title: 'Meeting Information',
      questions: [
        {
          id: 'q-client-name',
          text: '<p><strong>Client Name</strong></p><p>Enter the full name of the client.</p>',
          answerType: 'long-answer',
          options: [],
          required: true,
          answer: ''
        },
        {
          id: 'q-client-position',
          text: '<p><strong>Client Position</strong></p><p>Enter the client\'s job title or position within their organization.</p>',
          answerType: 'long-answer',
          options: [],
          required: true,
          answer: ''
        },
        {
          id: 'q-meeting-date',
          text: '<p><strong>Meeting Date</strong></p><p>Select the date of the client meeting.</p>',
          answerType: 'date',
          options: [],
          required: true,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-pre-meeting',
      title: 'Pre-Meeting Preparation',
      questions: [
        {
          id: 'q-agenda-prepared',
          text: '<p>Has the meeting agenda been prepared and shared with the client?</p>',
          answerType: 'yes-no',
          options: ['Yes', 'No'],
          required: true,
          answer: ''
        },
        {
          id: 'q-documents-reviewed',
          text: '<p>Have all relevant client documents been reviewed prior to the meeting?</p>',
          answerType: 'yes-no',
          options: ['Yes', 'No'],
          required: true,
          answer: ''
        },
        {
          id: 'q-previous-notes',
          text: '<p>Have notes from previous meetings been reviewed?</p>',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-meeting-topics',
      title: 'Meeting Discussion Topics',
      questions: [
        {
          id: 'q-primary-objectives',
          text: '<p><strong>Primary Meeting Objectives</strong></p><p>List the main objectives to be discussed during this meeting.</p>',
          answerType: 'long-answer',
          options: [],
          required: true,
          answer: ''
        },
        {
          id: 'q-client-concerns',
          text: '<p><strong>Client Concerns or Questions</strong></p><p>Document any concerns or questions raised by the client.</p>',
          answerType: 'long-answer',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'q-action-items',
          text: '<p><strong>Action Items</strong></p><p>List action items that need to be addressed following the meeting.</p>',
          answerType: 'long-answer',
          options: [],
          required: true,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-follow-up',
      title: 'Post-Meeting Follow-Up',
      questions: [
        {
          id: 'q-follow-up-required',
          text: '<p>Is a follow-up meeting required?</p>',
          answerType: 'yes-no',
          options: ['Yes', 'No'],
          required: true,
          answer: ''
        },
        {
          id: 'q-follow-up-date',
          text: '<p><strong>Proposed Follow-Up Date</strong></p><p>If applicable, enter the proposed date for the next meeting.</p>',
          answerType: 'date',
          options: [],
          required: false,
          answer: ''
        },
        {
          id: 'q-meeting-notes',
          text: '<p><strong>Additional Meeting Notes</strong></p><p>Capture any additional notes or observations from the meeting.</p>',
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
    id: 'checklist-client-meeting',
    title: 'Client Meeting Checklist',
    description: prompt,
    objective: `This checklist is designed to help you prepare for, conduct, and follow up on client meetings effectively. Use it to:
• Capture essential client information
• Prepare thoroughly before each meeting
• Document key discussion points and action items
• Plan appropriate follow-up activities`,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const generateMockChecklist = (prompt: string, scope: GenerationScope, checklistName?: string): Checklist => {
  // Check if this is a Client Meeting Checklist prompt
  const isClientMeetingPrompt = prompt.toLowerCase().includes('client meeting checklist') || 
                                 prompt.toLowerCase().includes('client meeting') && prompt.toLowerCase().includes('checklist');
  
  if (isClientMeetingPrompt) {
    return generateClientMeetingChecklist(prompt);
  }

  // Questions matching the screenshot - each in its own block/section
  const sections: Section[] = [
    {
      id: 'section-1',
      title: 'Quality Management & Risk Assessment',
      questions: [
        {
          id: 'q1',
          text: 'Determine whether accepting this engagement would contravene any of the firm\'s quality management policies.',
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        },
        {
          id: 'q2',
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
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-2',
      title: 'Financial Information & Basis of Accounting',
      questions: [
        {
          id: 'q3',
          text: `<p>Inquire to management about:</p>
<ol type="a">
<li>Intended use of the FI.</li>
<li>Whether the FI is intended to be used by a third party.</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        },
        {
          id: 'q4',
          text: `<p>Discuss the expected basis of accounting with management and obtain management's acknowledgement that it is appropriate in the circumstances:</p>
<ol type="a">
<li>A written communication (e.g., paper or electronic).</li>
<li>An oral communication documented in the working paper file.</li>
</ol>
<p><em>Note: Use of a general purpose framework is considered rare (such as ASPE). In such cases, consideration should be given to whether an audit or review engagement would be more appropriate.</em></p>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        }
      ],
      isExpanded: true
    },
    {
      id: 'section-3',
      title: 'Third-Party Use & Quality Review',
      questions: [
        {
          id: 'q5',
          text: `<p>If the FI is intended to be used by a third party, inquire of management about:</p>
<ol type="a">
<li>The ability of the third party to request and obtain additional information.</li>
<li>Whether the third party agrees with the basis of accounting.</li>
</ol>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        },
        {
          id: 'q6',
          text: `<p>Are there any circumstances that would require this engagement to be subject to an engagement quality review?</p>
<p>If so, has a reviewer been appointed?</p>`,
          answerType: 'yes-no-na',
          options: ['Yes', 'No', 'Not Applicable'],
          required: true,
          answer: ''
        }
      ],
      isExpanded: true
    }
  ];

  const defaultObjective = `Basis of accounting:
When assisting management in developing an appropriate basis of accounting, take into account the following:
  • The nature of the entity
  • The intended use of the compiled financial information (such as for third parties)
  • Whether there are any specific financial reporting requirements under applicable law, regulation, or contractional provisions with third parties
  • Through the terms of their lending agreements, financial institutions usually have the ability to request and obtain additional information about the compiled financial information. Such terms would be sufficient to meet the criteria to accept the engagement.`;

  return {
    id: 'checklist-1',
    title: checklistName || 'Engagement Acceptance Checklist',
    description: prompt,
    objective: defaultObjective,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

type GenerateNavState = {
  generate?: {
    prompt: string;
    scope: GenerationScope;
    cardSize?: string;
    checklistName?: string;
    savedChecklistId?: string;
  };
  checklistId?: string;
  globalTemplateId?: string; // For loading global template previews
  timestamp?: number; // Used to force re-render when clicking same route
  clearContent?: boolean; // Used to clear content area (e.g., for Engagements)
};

// Helper to update checklist data in localStorage and dispatch sync event
const updateChecklistInStorage = (checklistId: string, checklistData: Checklist) => {
  const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
  const updated = Array.isArray(savedChecklists)
    ? savedChecklists.map((c: any) => (c?.id === checklistId ? { ...c, data: checklistData } : c))
    : [];
  writeJsonToLocalStorage('savedChecklists', updated);
  
  // Dispatch sync event for real-time updates
  dispatchChecklistSync(checklistId, checklistData);
};

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentChecklistId, setCurrentChecklistId] = useState<string | null>(null);
  const [isGlobalTemplatePreview, setIsGlobalTemplatePreview] = useState(false);
  const [isSavedTemplate, setIsSavedTemplate] = useState(false);

  const handleGenerate = async (prompt: string, scope: GenerationScope, savedChecklistId?: string, checklistName?: string) => {
    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const generated = generateMockChecklist(prompt, scope, checklistName);
    setChecklist(generated);
    setIsGenerating(false);

    // Save the generated checklist data to localStorage if we have a savedChecklistId
    if (savedChecklistId) {
      setCurrentChecklistId(savedChecklistId);
      updateChecklistInStorage(savedChecklistId, generated);
    }
  };

  // If the user came from /generate or clicked a saved checklist, handle it
  useEffect(() => {
    const navState = location.state as GenerateNavState | null;
    const gen = navState?.generate;
    const checklistId = navState?.checklistId;
    const globalTemplateId = navState?.globalTemplateId;
    const clearContent = navState?.clearContent;

    // Clear the navigation state so we don't regenerate on refresh/back.
    // IMPORTANT: Do NOT clear state for global template previews; we rely on it
    // to keep `isGlobalTemplatePreview` true (otherwise the UI falls back to Edit).
    const shouldClearNavState =
      !!navState && !globalTemplateId && (!!gen || !!checklistId || !!clearContent);
    if (shouldClearNavState) {
      navigate('/builder', { replace: true, state: null });
    }

    // Clear content when Engagements or similar non-creator is selected
    if (clearContent) {
      setChecklist(null);
      setCurrentChecklistId(null);
      setIsGlobalTemplatePreview(false);
      setIsSavedTemplate(false);
      return;
    }

    // Load global template by ID (user clicked on a global template)
    if (globalTemplateId) {
      const templateChecklist = getGlobalTemplateChecklist(globalTemplateId);
      if (templateChecklist) {
        setChecklist(templateChecklist);
        setCurrentChecklistId(null);
        setIsGlobalTemplatePreview(true);
        setIsSavedTemplate(false);
        return;
      }
    }

    // Reset global template preview flag for other cases
    if (!globalTemplateId) {
      setIsGlobalTemplatePreview(false);
    }

    // Load saved checklist by ID (user clicked on existing checklist)
    if (checklistId) {
      setCurrentChecklistId(checklistId);
      const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
      const found = Array.isArray(savedChecklists)
        ? savedChecklists.find((c: any) => c?.id === checklistId)
        : null;
      if (found?.data) {
        setChecklist(found.data);
        setIsSavedTemplate(true); // Mark as saved template for preview mode
        return;
      }
    }

    if (!gen?.prompt) return;

    void handleGenerate(gen.prompt, gen.scope ?? 'standard', gen.savedChecklistId, gen.checklistName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, navigate]);

  const handleChecklistUpdate = (updated: Checklist) => {
    setChecklist(updated);
    // Sync changes in real-time to engagement page
    if (currentChecklistId) {
      updateChecklistInStorage(currentChecklistId, updated);
    }
  };

  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const handleBack = () => {
    if (checklist) {
      setShowUnsavedDialog(true);
    } else {
      // No checklist, just go back
      navigate(-1);
    }
  };

  const handleSaveChanges = () => {
    toast.success('Changes saved successfully');
    // Keep the checklist open after saving
  };

  const handleDiscardChanges = () => {
    setChecklist(null);
    toast.info('Changes discarded');
  };

  const handleDirectSave = () => {
    if (checklist && currentChecklistId) {
      updateChecklistInStorage(currentChecklistId, checklist);
    }
    toast.success('Checklist saved');
  };

  return (
    <RichTextToolbarProvider>
      <Layout 
        title="Templates"
        showActions={!!checklist}
        showBackButton={!!checklist}
        onBack={handleBack}
      >

        {isGenerating ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center animate-pulse">
              <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                <svg className="w-8 h-8 text-primary-foreground animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-foreground">Generating your checklist...</p>
              <p className="text-sm text-muted-foreground mt-1">AI is analyzing your requirements</p>
            </div>
          </div>
        ) : checklist ? (
          <ChecklistBuilder 
            checklist={checklist} 
            onUpdate={handleChecklistUpdate}
            onSave={handleDirectSave}
            initialPreviewMode={isGlobalTemplatePreview || isSavedTemplate}
            isGlobalTemplate={isGlobalTemplatePreview}
            isSavedTemplate={isSavedTemplate}
          />
        ) : null}

        {/* Unsaved Changes Dialog - shown when clicking Back */}
        <UnsavedChangesDialog
          open={showUnsavedDialog}
          onOpenChange={setShowUnsavedDialog}
          onSave={handleSaveChanges}
          onDiscard={handleDiscardChanges}
        />
      </Layout>
    </RichTextToolbarProvider>
  );
}
