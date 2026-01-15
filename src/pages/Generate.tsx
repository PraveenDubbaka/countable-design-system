import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Table, 
  FileText, 
  StickyNote,
  Shuffle,
  ArrowLeft,
  Sparkles,
  ClipboardList,
  Calculator,
  Mail,
  FileEdit
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

type ContentType = 'checklist' | 'worksheet' | 'letter' | 'note';
type DetailLevel = 'concise' | 'standard' | 'detailed';

interface ExamplePrompt {
  icon: React.ReactNode;
  iconBg: string;
  text: string;
}

const promptsByType: Record<ContentType, ExamplePrompt[]> = {
  checklist: [
    {
      icon: <ClipboardList className="h-5 w-5 text-primary" />,
      iconBg: 'bg-primary/10',
      text: 'Generate a full Independence checklist for a compilation engagement under CSRS 4200'
    },
    {
      icon: <CheckSquare className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-100',
      text: 'Create a client acceptance and continuance checklist for audit engagements'
    },
    {
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-100',
      text: 'Build a year-end financial statement disclosure checklist'
    },
    {
      icon: <ClipboardList className="h-5 w-5 text-violet-600" />,
      iconBg: 'bg-violet-100',
      text: 'Create a payroll compliance checklist for Canadian SMEs'
    },
    {
      icon: <CheckSquare className="h-5 w-5 text-amber-600" />,
      iconBg: 'bg-amber-100',
      text: 'Generate a tax filing preparation checklist for corporate returns'
    },
    {
      icon: <FileText className="h-5 w-5 text-rose-600" />,
      iconBg: 'bg-rose-100',
      text: 'Create an internal controls assessment checklist for SOX compliance'
    },
  ],
  worksheet: [
    {
      icon: <Calculator className="h-5 w-5 text-primary" />,
      iconBg: 'bg-primary/10',
      text: 'Generate a materiality calculation worksheet for audit planning'
    },
    {
      icon: <Table className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-100',
      text: 'Create a depreciation worksheet with adjustable assumptions'
    },
    {
      icon: <Calculator className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-100',
      text: 'Build a loan amortization worksheet with monthly breakdown'
    },
    {
      icon: <Table className="h-5 w-5 text-violet-600" />,
      iconBg: 'bg-violet-100',
      text: 'Create a working trial balance worksheet with adjustments'
    },
    {
      icon: <Calculator className="h-5 w-5 text-amber-600" />,
      iconBg: 'bg-amber-100',
      text: 'Generate a revenue recognition analysis worksheet'
    },
    {
      icon: <Table className="h-5 w-5 text-rose-600" />,
      iconBg: 'bg-rose-100',
      text: 'Build a bank reconciliation worksheet template'
    },
  ],
  letter: [
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      iconBg: 'bg-primary/10',
      text: 'Generate an engagement letter for a compilation engagement'
    },
    {
      icon: <FileEdit className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-100',
      text: 'Create a management representation letter'
    },
    {
      icon: <Mail className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-100',
      text: 'Draft a client communication letter regarding independence'
    },
    {
      icon: <FileEdit className="h-5 w-5 text-violet-600" />,
      iconBg: 'bg-violet-100',
      text: 'Generate a confirmation letter for accounts receivable'
    },
    {
      icon: <Mail className="h-5 w-5 text-amber-600" />,
      iconBg: 'bg-amber-100',
      text: 'Create a fee arrangement letter for advisory services'
    },
    {
      icon: <FileEdit className="h-5 w-5 text-rose-600" />,
      iconBg: 'bg-rose-100',
      text: 'Draft an audit findings communication letter'
    },
  ],
  note: [
    {
      icon: <StickyNote className="h-5 w-5 text-primary" />,
      iconBg: 'bg-primary/10',
      text: 'Create a professional audit note documenting independence considerations'
    },
    {
      icon: <FileText className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-100',
      text: 'Generate a file note summarizing risk assessment discussions'
    },
    {
      icon: <StickyNote className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-100',
      text: 'Write an internal note explaining accounting policy decisions'
    },
    {
      icon: <FileText className="h-5 w-5 text-violet-600" />,
      iconBg: 'bg-violet-100',
      text: 'Create a memo documenting significant estimates and judgments'
    },
    {
      icon: <StickyNote className="h-5 w-5 text-amber-600" />,
      iconBg: 'bg-amber-100',
      text: 'Generate a note on related party transaction analysis'
    },
    {
      icon: <FileText className="h-5 w-5 text-rose-600" />,
      iconBg: 'bg-rose-100',
      text: 'Write a working paper note for substantive testing procedures'
    },
  ],
};

const placeholdersByType: Record<ContentType, string> = {
  checklist: "Describe the checklist you want to generate (e.g., 'Generate the full Independence checklist as per CSRS 4200 for compilation').",
  worksheet: "Describe the worksheet you want to generate (e.g., 'Create a materiality calculation worksheet for a mid-size audit client').",
  letter: "Describe the letter you want to generate (e.g., 'Draft an engagement letter for compilation services').",
  note: "Describe the note you want to generate (e.g., 'Create a file note documenting independence considerations').",
};

export default function Generate() {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState<ContentType>('checklist');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('standard');
  const [cardSize, setCardSize] = useState('default');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedPrompts, setDisplayedPrompts] = useState<ExamplePrompt[]>(promptsByType.checklist);

  const contentTypes = [
    { id: 'checklist', icon: CheckSquare, label: 'Checklist' },
    { id: 'worksheet', icon: Table, label: 'Worksheet' },
    { id: 'letter', icon: FileText, label: 'Letter' },
    { id: 'note', icon: StickyNote, label: 'Note' },
  ];

  const handleTypeChange = (type: ContentType) => {
    setContentType(type);
    setDisplayedPrompts(promptsByType[type]);
  };

  const handleShuffle = () => {
    const currentPrompts = promptsByType[contentType];
    const shuffled = [...currentPrompts].sort(() => Math.random() - 0.5);
    setDisplayedPrompts(shuffled);
  };

  const handlePromptClick = (text: string) => {
    setPrompt(text);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate content');
      return;
    }

    if (contentType !== 'checklist') {
      toast.error('Only Checklist generation is available in this prototype');
      return;
    }

    setIsGenerating(true);

    // Hand off to the home page generator (mock generation lives there)
    navigate('/', {
      state: {
        generate: {
          prompt,
          scope: detailLevel,
          cardSize,
        },
      },
    });
  };

  return (
    <Layout title="Generate">
      <div className="min-h-full bg-gradient-to-r from-[#ECD4F6] to-[#CFE1FC]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-foreground mb-3 italic tracking-tight">Generate</h1>
            <p className="text-muted-foreground text-lg">What would you like to create today?</p>
          </div>

          {/* Content Type Tabs */}
          <div className="flex justify-center gap-2 mb-6">
            {contentTypes.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => handleTypeChange(id as ContentType)}
                className={`flex flex-col items-center gap-2 px-8 py-4 rounded-xl border-2 transition-all min-w-[100px] ${
                  contentType === id
                    ? 'border-primary bg-white text-primary shadow-sm'
                    : 'border-transparent bg-white/60 text-muted-foreground hover:bg-white/80 hover:border-border'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Options Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {/* Detail Level Chips */}
            <div className="flex items-center gap-1 bg-white/80 rounded-full p-1 border border-border">
              {(['concise', 'standard', 'detailed'] as DetailLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDetailLevel(level)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                    detailLevel === level
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Card Size Select */}
            <Select value={cardSize} onValueChange={setCardSize}>
              <SelectTrigger className="w-36 bg-white/80 border-border rounded-full">
                <span className="text-sm mr-2">⟨⟩</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  <div className="flex items-center justify-between w-full">
                    <span>Default</span>
                    <span className="text-muted-foreground text-xs ml-4">Fluid</span>
                  </div>
                </SelectItem>
                <SelectItem value="traditional">
                  <div className="flex items-center justify-between w-full">
                    <span>Traditional</span>
                    <span className="text-muted-foreground text-xs ml-4">16:9</span>
                  </div>
                </SelectItem>
                <SelectItem value="tall">
                  <div className="flex items-center justify-between w-full">
                    <span>Tall</span>
                    <span className="text-muted-foreground text-xs ml-4">4:3</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholdersByType[contentType]}
              className="w-full min-h-[80px] py-4 px-5 text-base bg-white border-border rounded-xl focus:ring-2 focus:ring-primary/20 resize-none"
              rows={2}
            />
          </div>

          {/* Generate Button */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              {/* Animated border shine - only on hover */}
              <span className="absolute inset-0 rounded-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="absolute inset-[-2px] rounded-xl bg-gradient-to-r from-[#3379C9] via-white to-[#8A5BD9]" />
                <span className="absolute inset-[-2px] rounded-xl overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </span>
              </span>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="relative px-8 py-4 text-base font-medium text-white rounded-xl shadow-md bg-gradient-to-r from-[#3379C9] to-[#8A5BD9] disabled:opacity-50 disabled:cursor-not-allowed"
              >
              <span className="relative flex items-center justify-center">
                {isGenerating ? (
                  <>
                    <svg className="h-5 w-5 mr-2 animate-pulse" viewBox="0 0 19 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.8719 9.99219H16.5288C16.9122 10.0285 18.0624 10.1918 18.3617 10.8997C18.5861 11.426 18.343 12.143 17.7726 12.7147C13.8731 16.6442 9.9829 20.5827 6.0834 24.5122C5.74675 24.6211 5.53167 24.6211 5.43816 24.5122C5.25113 24.3035 5.51297 23.7045 6.24237 22.6972C9.04777 19.3667 11.8532 16.0452 14.6586 12.7147L6.67254 9.99219H11.8625H11.8719Z" fill="white"/>
                      <path d="M6.57738 14.6017H1.91708C1.5334 14.5654 0.382364 14.402 0.0829068 13.6942C-0.141686 13.1678 0.101623 12.4509 0.672462 11.8792C4.5654 7.94062 8.4677 4.01115 12.3606 0.081675C12.6975 -0.027225 12.9128 -0.027225 13.0063 0.081675C13.1935 0.2904 12.9315 0.88935 12.2015 1.89667C9.39414 5.2272 6.58673 8.54865 3.77933 11.8792L11.7711 14.6017H6.57738Z" fill="white"/>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 19 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.8719 9.99219H16.5288C16.9122 10.0285 18.0624 10.1918 18.3617 10.8997C18.5861 11.426 18.343 12.143 17.7726 12.7147C13.8731 16.6442 9.9829 20.5827 6.0834 24.5122C5.74675 24.6211 5.53167 24.6211 5.43816 24.5122C5.25113 24.3035 5.51297 23.7045 6.24237 22.6972C9.04777 19.3667 11.8532 16.0452 14.6586 12.7147L6.67254 9.99219H11.8625H11.8719Z" fill="white"/>
                      <path d="M6.57738 14.6017H1.91708C1.5334 14.5654 0.382364 14.402 0.0829068 13.6942C-0.141686 13.1678 0.101623 12.4509 0.672462 11.8792C4.5654 7.94062 8.4677 4.01115 12.3606 0.081675C12.6975 -0.027225 12.9128 -0.027225 13.0063 0.081675C13.1935 0.2904 12.9315 0.88935 12.2015 1.89667C9.39414 5.2272 6.58673 8.54865 3.77933 11.8792L11.7711 14.6017H6.57738Z" fill="white"/>
                    </svg>
                    Generate
                  </>
                )}
              </span>
            </button>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px bg-border flex-1 max-w-[120px]" />
              <span className="text-muted-foreground text-sm font-medium">Example prompts</span>
              <div className="h-px bg-border flex-1 max-w-[120px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedPrompts.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(item.text)}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all text-left group"
                >
                  <div className={`p-2.5 rounded-lg ${item.iconBg} shrink-0`}>
                    {item.icon}
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                    {item.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Shuffle Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleShuffle}
              className="rounded-full px-6 bg-white hover:bg-white/90"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
