import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DropZone } from '@/components/DropZone';
import { ChecklistBuilder } from '@/components/ChecklistBuilder';
import { Checklist, GenerationScope, Section } from '@/types/checklist';

const generateMockChecklist = (prompt: string, scope: GenerationScope): Checklist => {
  const baseQuestions = [
    {
      id: 'q1',
      text: 'Determine whether accepting this engagement would contravene any of the firm\'s quality management policies',
      answerType: 'yes-no-na' as const,
      required: true,
      answer: ''
    },
    {
      id: 'q2',
      text: 'Have all independence requirements been verified and documented?',
      answerType: 'yes-no-na' as const,
      required: true,
      answer: ''
    }
  ];

  const detailedQuestions = [
    ...baseQuestions,
    {
      id: 'q3',
      text: 'Document the preliminary assessment of engagement risk factors',
      answerType: 'long-answer' as const,
      required: false,
      answer: 'We believe all necessary steps have been completed to comply with the independence requirements.'
    },
    {
      id: 'q4',
      text: 'Identify any potential conflicts of interest',
      answerType: 'yes-no-na' as const,
      required: true,
      answer: '',
      subQuestions: [
        {
          id: 'sq1',
          text: 'Indicate who in the firm has knowledge about the prospective client and whether they recommend that this entity be accepted as a new client.',
          answerType: 'short-answer' as const,
          required: false
        },
        {
          id: 'sq2',
          text: 'Contact the predecessor practitioner to inquire about any reasons the engagement should not be accepted. If no response is received, explain what alternative procedures were performed.',
          answerType: 'long-answer' as const,
          required: false
        }
      ]
    }
  ];

  const riskFactorQuestions = [
    {
      id: 'q5',
      text: 'Does management understand the limited nature of the engagement?',
      answerType: 'yes-no-na' as const,
      required: true,
      answer: '',
      subQuestions: scope === 'detailed' ? [
        {
          id: 'sq3',
          text: 'Make inquiries and perform web searches for any new or emerging engagement risks that would impact the decision to accept or continue with this engagement.',
          answerType: 'long-answer' as const,
          required: false
        },
        {
          id: 'sq4',
          text: 'Consider any risk factors identified from other sources.',
          answerType: 'short-answer' as const,
          required: false
        },
        {
          id: 'sq5',
          text: 'Based on preliminary understanding, is there any indication that the financial information will be misleading?',
          answerType: 'yes-no-na' as const,
          required: true
        }
      ] : undefined
    }
  ];

  const sections: Section[] = [
    {
      id: 'section-1',
      title: 'Quality management',
      questions: scope === 'concise' ? baseQuestions.slice(0, 1) : baseQuestions,
      isExpanded: true
    },
    {
      id: 'section-2',
      title: 'Engagement risk factors',
      questions: scope === 'detailed' ? [...detailedQuestions.slice(2), ...riskFactorQuestions] : riskFactorQuestions,
      isExpanded: true
    }
  ];

  if (scope === 'detailed') {
    sections.push({
      id: 'section-3',
      title: 'Independence verification',
      questions: [
        {
          id: 'q6',
          text: 'Have all team members confirmed their independence in writing?',
          answerType: 'yes-no' as const,
          required: true,
          answer: ''
        },
        {
          id: 'q7',
          text: 'List any relationships that may impair independence',
          answerType: 'long-answer' as const,
          required: false,
          answer: ''
        }
      ],
      isExpanded: true
    });
  }

  return {
    id: 'checklist-1',
    title: 'Client Acceptance and Continuance',
    description: prompt,
    sections,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export default function Index() {
  const [checklist, setChecklist] = useState<Checklist | null>(() => {
    // Start with a pre-generated checklist for demo
    return generateMockChecklist('Client acceptance checklist', 'detailed');
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (prompt: string, scope: GenerationScope, file?: File) => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generated = generateMockChecklist(prompt, scope);
    setChecklist(generated);
    setIsGenerating(false);
  };

  const handleChecklistUpdate = (updated: Checklist) => {
    setChecklist(updated);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={checklist?.title || "Countable AI Checklist Generator"} 
          showActions={!!checklist}
        />
        
        <main className="flex-1 overflow-hidden">
          {isGenerating ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
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
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <DropZone onGenerate={handleGenerate} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}