import { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GenerationScope } from '@/types/checklist';

interface DropZoneProps {
  onGenerate: (prompt: string, scope: GenerationScope, file?: File) => void;
}

export function DropZone({ onGenerate }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [scope, setScope] = useState<GenerationScope>('standard');
  const [showScopeMenu, setShowScopeMenu] = useState(false);
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

  const scopeLabels: Record<GenerationScope, string> = {
    concise: 'Concise',
    standard: 'Standard',
    detailed: 'Detailed'
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">AI-Powered Checklist Generation</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create Your Checklist
        </h1>
        <p className="text-muted-foreground">
          Drop a document or describe the checklist you need
        </p>
      </div>

      <div
        className={`dropzone ${isDragging ? 'border-primary bg-accent/50' : ''}`}
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

      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted-foreground">or describe your needs</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Textarea
        placeholder="Generate the full independence checklist as per CSRS 4200 requirements for compilation..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[120px] resize-none text-base"
      />

      <div className="mt-6 flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setShowScopeMenu(!showScopeMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card hover:bg-muted transition-colors"
          >
            <span className="text-sm text-muted-foreground">Generation Scope:</span>
            <span className="text-sm font-medium">{scopeLabels[scope]}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          
          {showScopeMenu && (
            <div className="absolute top-full left-0 mt-2 bg-card border rounded-lg shadow-lg p-1 z-10 animate-scale-in">
              {(Object.keys(scopeLabels) as GenerationScope[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setScope(s);
                    setShowScopeMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                    scope === s 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  {scopeLabels[s]}
                </button>
              ))}
            </div>
          )}
        </div>

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
