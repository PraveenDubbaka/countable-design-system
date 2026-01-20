import { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, MicOff, RefreshCw, Minimize2, Wand2, FileText, PenLine, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useVoiceToText } from '@/hooks/useVoiceToText';
import { cn } from '@/lib/utils';

interface AIOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const aiOptions: AIOption[] = [
  {
    id: 'replace-we',
    label: "Replace 'We' with 'I'",
    icon: <RefreshCw className="h-4 w-4" />,
    description: "Change first person plural to singular"
  },
  {
    id: 'shorter',
    label: 'Make Shorter',
    icon: <Minimize2 className="h-4 w-4" />,
    description: "Condense the text while keeping meaning"
  },
  {
    id: 'improve',
    label: 'Improve Writing',
    icon: <Wand2 className="h-4 w-4" />,
    description: "Enhance grammar and clarity"
  },
  {
    id: 'summarize',
    label: 'Generate Summary',
    icon: <FileText className="h-4 w-4" />,
    description: "Create a brief summary"
  },
  {
    id: 'draft',
    label: 'Generate Draft Answer',
    icon: <PenLine className="h-4 w-4" />,
    description: "Start fresh with AI-generated content"
  }
];

interface AITextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
}

export function AITextarea({ 
  value, 
  onChange, 
  placeholder = "Enter your detailed answer...", 
  disabled = false,
  className,
  minHeight = "80px"
}: AITextareaProps) {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, transcript, toggleListening, isSupported, error } = useVoiceToText({
    onResult: (result) => {
      // Append transcribed text to current value
      const newValue = value ? `${value} ${result}` : result;
      onChange(newValue);
    },
    continuous: true,
    language: 'en-US'
  });

  // Update value with interim transcript while listening
  useEffect(() => {
    if (isListening && transcript) {
      // Show interim transcript - will be replaced by final result
    }
  }, [transcript, isListening]);

  const handleAIOptionClick = async (optionId: string) => {
    setSelectedOption(optionId);
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));

    let result = value;
    switch (optionId) {
      case 'replace-we':
        result = value.replace(/\bWe\b/g, 'I').replace(/\bwe\b/g, 'I').replace(/\bour\b/g, 'my').replace(/\bOur\b/g, 'My');
        break;
      case 'shorter':
        const sentences = value.split('.');
        result = sentences.slice(0, Math.max(1, Math.ceil(sentences.length / 2))).join('.').trim();
        if (result && !result.endsWith('.')) result += '.';
        break;
      case 'improve':
        result = value.charAt(0).toUpperCase() + value.slice(1);
        if (result && !result.endsWith('.')) result += '.';
        break;
      case 'summarize':
        result = value.length > 100 ? 'Summary: ' + value.substring(0, 100) + '...' : value;
        break;
      case 'draft':
        result = 'Based on the requirements, I have verified compliance with all applicable standards and documented the necessary procedures.';
        break;
    }

    onChange(result);
    setIsProcessing(false);
    setSelectedOption(null);
    setIsAIOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled || isListening}
        className={cn(
          "pr-16 resize-none text-sm bg-gray-50 border-gray-300 text-gray-700 rounded-md",
          isListening && "border-primary ring-1 ring-primary",
          disabled && "opacity-60"
        )}
        style={{ minHeight }}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Action buttons - positioned bottom right */}
      {!disabled && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {/* AI Button with Popover */}
          <Popover open={isAIOpen} onOpenChange={setIsAIOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAIOpen(!isAIOpen);
                }}
                className={cn(
                  "p-1.5 rounded-md transition-all hover:bg-gray-200",
                  isAIOpen ? "bg-gray-200 text-primary" : "text-gray-500 hover:text-gray-700"
                )}
                title="AI Assistant"
              >
                <Sparkles className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-72 p-2" 
              align="end" 
              side="top"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 px-3 py-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Wand2 className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-medium text-sm">AI Assistant</span>
              </div>

              <div className="space-y-1">
                {aiOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAIOptionClick(option.id)}
                    disabled={isProcessing}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                      selectedOption === option.id
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100",
                      isProcessing && selectedOption !== option.id && "opacity-50"
                    )}
                  >
                    <div className={cn(
                      "text-gray-500",
                      selectedOption === option.id && "text-blue-600"
                    )}>
                      {isProcessing && selectedOption === option.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        option.icon
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{option.label}</p>
                      <p className="text-xs text-gray-500 truncate">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Voice to Text Button */}
          {isSupported && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleListening();
              }}
              className={cn(
                "p-1.5 rounded-md transition-all",
                isListening 
                  ? "bg-red-100 text-red-600 animate-pulse" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
              )}
              title={isListening ? "Stop recording" : "Voice to text"}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Listening indicator */}
      {isListening && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 text-xs text-primary">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Listening...
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
