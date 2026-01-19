import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, LayoutTemplate, Folder, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ContentType } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { GenerationScope } from '@/types/checklist';

// Template folder structure
const templateFolders = [
  {
    id: 'compilation',
    name: 'Compilation',
    templates: [
      'Client Acceptance and Continuance',
      'Independence',
      'Knowledge of client business',
      'Planning',
      'Withdrawal',
      'Completion',
    ],
  },
  {
    id: 'review',
    name: 'Review',
    templates: [
      'New engagement acceptance',
      'Existing engagement continuance',
      'Understanding the entity - Basics',
      'Understanding the entity - Systems',
      'Engagement Planning',
      'Completion',
      'Subsequent events',
      'Withdrawal',
      'ASPE - General - Disclosure checklist',
      'ASPE - Income taxes - Disclosure checklist',
      'ASPE - Leases - Disclosure checklist',
      'ASPE - Goodwill and intangible assets - Disclosure checklist',
      'ASPE - Employee future benefits - Disclosure checklist',
      'ASPE - Supplementary - Disclosure checklist',
    ],
  },
  {
    id: 'tax',
    name: 'Tax',
    templates: [
      'Completion',
    ],
  },
];

interface LocationState {
  contentType?: ContentType;
}

interface CreationOptionProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  badge?: { text: string; variant: 'recommended' | 'new' };
  onClick: () => void;
}

function CreationOption({ icon, iconBg, title, description, badge, onClick }: CreationOptionProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-lg transition-all duration-200 text-left h-full"
    >
      <div className={`w-full aspect-[4/3] rounded-lg mb-4 flex items-center justify-center ${iconBg}`}>
        <div className="transition-transform duration-500 group-hover:rotate-[360deg]">
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {badge && (
        <span className={`mt-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg w-fit ${
          badge.variant === 'recommended' 
            ? 'bg-pink-100 text-pink-600' 
            : 'bg-teal-100 text-teal-600'
        }`}>
          {badge.variant === 'recommended' && <span className="text-pink-500">★</span>}
          {badge.text}
        </span>
      )}
    </button>
  );
}

const contentTypeLabels: Record<ContentType, string> = {
  checklists: 'Checklist',
  reports: 'Report',
  letters: 'Letter',
  notes: 'Notes to Financial Statements',
};

export default function CreationDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { contentType = 'checklists' } = (location.state as LocationState) || {};
  
  const [mode, setMode] = useState<'import' | 'template' | null>(null);
  const [prompt, setPrompt] = useState('');
  const [scope, setScope] = useState<GenerationScope>('standard');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['compilation']));
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    setPrompt(`Generate a ${templateName} checklist`);
  };

  const label = contentTypeLabels[contentType] || 'Checklist';
  const heading = contentType 
    ? `Create ${label} with LUKA`
    : 'Create with LUKA';

  const handleGenerate = () => {
    navigate('/generate', { state: { contentType } });
  };

  const handleBack = () => {
    setMode(null);
    setPrompt('');
  };

  // Import or Template mode view
  if (mode) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-card border border-border rounded-xl p-8 animate-fade-in">
            <button 
              onClick={handleBack}
              className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
            >
              ← Back
            </button>
            
            {mode === 'import' && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Import file</h2>
                <p className="text-muted-foreground mb-6">Upload a document to generate your {label.toLowerCase()}</p>
                
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="text-muted-foreground">
                    <svg className="h-12 w-12 mx-auto mb-4 text-primary/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <path d="M17 8L12 3L7 8" />
                      <path d="M12 3L12 15" />
                    </svg>
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm">PDF, DOC, DOCX, TXT (max 10MB)</p>
                  </div>
                </div>
              </div>
            )}

            {mode === 'template' && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Generate from Template</h2>
                <p className="text-muted-foreground mb-6">Select a folder and choose a template</p>
                
                <div className="border border-border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                  {templateFolders.map((folder) => (
                    <div key={folder.id}>
                      {/* Folder Header */}
                      <button
                        onClick={() => toggleFolder(folder.id)}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-muted/50 hover:bg-muted transition-colors text-left border-b border-border"
                      >
                        {expandedFolders.has(folder.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Folder className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{folder.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{folder.templates.length}</span>
                      </button>
                      
                      {/* Templates List */}
                      {expandedFolders.has(folder.id) && (
                        <div className="bg-background">
                          {folder.templates.map((template) => (
                            <button
                              key={`${folder.id}-${template}`}
                              onClick={() => handleTemplateSelect(template)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 pl-10 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 ${
                                selectedTemplate === template ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                              }`}
                            >
                              <FileText className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              <span className={`text-sm truncate ${selectedTemplate === template ? 'text-primary font-medium' : 'text-foreground'}`}>
                                {template}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {selectedTemplate && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground">Selected template:</p>
                    <p className="font-medium text-primary">{selectedTemplate}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as GenerationScope)}
                className="px-4 py-2 rounded-lg border bg-card text-sm"
              >
                <option value="standard">Standard</option>
                <option value="detailed">Detailed</option>
              </select>

              <Button
                onClick={() => {
                  if (prompt.trim()) {
                    navigate('/generate', { 
                      state: { 
                        contentType, 
                        mode,
                        prompt,
                        scope
                      } 
                    });
                  }
                }}
                disabled={!prompt.trim()}
                className="ai-button !px-6 !py-5"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate {label}
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Main selection view
  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {heading}
            </h1>
            <p className="text-muted-foreground text-lg">
              How would you like to get started?
            </p>
          </div>

          {/* Creation Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CreationOption
              icon={
                <svg width="48" height="52" viewBox="0 0 186 203" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3379C9"/>
                      <stop offset="100%" stopColor="#8A5BD9"/>
                    </linearGradient>
                  </defs>
                  <path d="M119.717 82.3955H166.681C170.547 82.6949 182.147 84.042 185.165 89.8796C187.428 94.2204 184.976 100.133 179.223 104.848C139.898 137.254 100.668 169.735 61.3425 202.141C57.9476 203.039 55.7786 203.039 54.8355 202.141C52.9494 200.42 55.59 195.48 62.9457 187.173C91.2371 159.706 119.529 132.314 147.82 104.848L67.2837 82.3955H119.623H119.717Z" fill="url(#iconGradient)"/>
                  <path d="M66.3304 120.419H19.333C15.4638 120.12 3.856 118.773 0.836085 112.935C-1.42885 108.594 1.02483 102.682 6.78153 97.9669C46.0404 65.4859 85.3936 33.0797 124.652 0.673569C128.05 -0.224523 130.22 -0.224523 131.164 0.673569C133.052 2.39491 130.409 7.33442 123.048 15.6418C94.7364 43.1084 66.4248 70.5003 38.1131 97.9669L118.707 120.419H66.3304Z" fill="url(#iconGradient)"/>
                </svg>
              }
              iconBg="bg-gradient-to-r from-[#ECD4F6] to-[#CFE1FC]"
              title="Generate"
              description="Create from a one-line prompt in a few seconds"
              badge={{ text: 'RECOMMENDED', variant: 'recommended' }}
              onClick={handleGenerate}
            />
            
            <CreationOption
              icon={
                <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="uploadIconGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3379C9"/>
                      <stop offset="1" stopColor="#8A5BD9"/>
                    </linearGradient>
                  </defs>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="url(#uploadIconGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="url(#uploadIconGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3L12 15" stroke="url(#uploadIconGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              iconBg="bg-gradient-to-r from-[#ECD4F6] to-[#CFE1FC]"
              title="Import file"
              description="Upload a document to generate"
              onClick={() => setMode('import')}
            />
            
            <CreationOption
              icon={
                <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="templateIconGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3379C9"/>
                      <stop offset="1" stopColor="#8A5BD9"/>
                    </linearGradient>
                  </defs>
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="url(#templateIconGradient)" strokeWidth="2"/>
                  <path d="M3 9H21" stroke="url(#templateIconGradient)" strokeWidth="2"/>
                  <path d="M9 21V9" stroke="url(#templateIconGradient)" strokeWidth="2"/>
                </svg>
              }
              iconBg="bg-gradient-to-r from-[#ECD4F6] to-[#CFE1FC]"
              title="Generate from template"
              description="Generate from existing templates"
              badge={{ text: 'NEW', variant: 'new' }}
              onClick={() => setMode('template')}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
