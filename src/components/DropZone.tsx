import { useState, useRef } from 'react';
import { Sparkles, FileText, Upload, LayoutTemplate, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GenerationScope } from '@/types/checklist';

interface DropZoneProps {
  onGenerate: (prompt: string, scope: GenerationScope, file?: File) => void;
}

type CreationMode = 'generate' | 'paste' | 'import' | 'template' | null;

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
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {badge && (
        <span className={`mt-3 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full w-fit ${
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

export function DropZone({ onGenerate }: DropZoneProps) {
  const [mode, setMode] = useState<CreationMode>(null);
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [scope, setScope] = useState<GenerationScope>('standard');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleGenerate = () => {
    if (prompt.trim() || file) {
      onGenerate(prompt, scope, file || undefined);
    }
  };

  const handleBack = () => {
    setMode(null);
    setPrompt('');
    setFile(null);
  };

  // Mode-specific content
  if (mode) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <span>←</span>
          <span>Back to options</span>
        </button>

        {mode === 'generate' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Generate with AI</h2>
            <p className="text-muted-foreground mb-6">Create a checklist from a simple prompt</p>
            <Textarea
              placeholder="Generate the full independence checklist as per CSRS 4200 requirements for compilation..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[160px] resize-none text-base mb-4"
              autoFocus
            />
          </div>
        )}

        {mode === 'paste' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Paste in Text</h2>
            <p className="text-muted-foreground mb-6">Create from notes, an outline, or existing content</p>
            <Textarea
              placeholder="Paste your existing checklist content, notes, or outline here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[200px] resize-none text-base mb-4"
              autoFocus
            />
          </div>
        )}

        {mode === 'import' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Import File or URL</h2>
            <p className="text-muted-foreground mb-6">Enhance existing docs, presentations, or webpages</p>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="ml-4"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Drop your document here</p>
                    <p className="text-sm text-muted-foreground">
                      PDF, Word, or text files supported
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="my-4 flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">or paste a URL</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <Textarea
              placeholder="https://example.com/document"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[60px] resize-none text-base"
            />
          </div>
        )}

        {mode === 'template' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Generate from Template</h2>
            <p className="text-muted-foreground mb-6">Fill in and customize a structured template</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {['Client Acceptance', 'Independence Review', 'Engagement Letter', 'Quality Control'].map((template) => (
                <button
                  key={template}
                  onClick={() => setPrompt(`Generate a ${template} checklist`)}
                  className={`p-4 border rounded-lg text-left hover:border-primary/50 transition-colors ${
                    prompt.includes(template) ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <LayoutTemplate className="h-5 w-5 text-primary mb-2" />
                  <p className="font-medium text-sm">{template}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as GenerationScope)}
            className="px-4 py-2 rounded-lg border bg-card text-sm"
          >
            <option value="concise">Concise</option>
            <option value="standard">Standard</option>
            <option value="detailed">Detailed</option>
          </select>

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() && !file}
            className="ai-button !px-6 !py-5"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Checklist
          </Button>
        </div>
      </div>
    );
  }

  // Main selection view
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create with AI
        </h1>
        <p className="text-muted-foreground text-lg">
          How would you like to get started?
        </p>
      </div>

      {/* Creation Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CreationOption
          icon={<Sparkles className="h-10 w-10 text-white" />}
          iconBg="bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400"
          title="Generate"
          description="Create from a one-line prompt in a few seconds"
          badge={{ text: 'RECOMMENDED', variant: 'recommended' }}
          onClick={() => setMode('generate')}
        />
        
        <CreationOption
          icon={<MessageSquare className="h-10 w-10 text-white" />}
          iconBg="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400"
          title="Paste in text"
          description="Create from notes, an outline, or existing content"
          onClick={() => setMode('paste')}
        />
        
        <CreationOption
          icon={<Upload className="h-10 w-10 text-primary" />}
          iconBg="bg-gradient-to-br from-sky-200 via-teal-100 to-green-200"
          title="Import file or URL"
          description="Enhance existing docs, presentations, or webpages"
          onClick={() => setMode('import')}
        />
        
        <CreationOption
          icon={<LayoutTemplate className="h-10 w-10 text-white" />}
          iconBg="bg-gradient-to-br from-teal-400 via-emerald-400 to-green-400"
          title="Generate from template"
          description="Fill in and customize a structured template"
          badge={{ text: 'NEW', variant: 'new' }}
          onClick={() => setMode('template')}
        />
      </div>
    </div>
  );
}
