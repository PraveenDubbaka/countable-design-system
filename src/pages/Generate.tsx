import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Presentation, 
  Globe, 
  FileText, 
  Smartphone, 
  Minus, 
  Plus, 
  Shuffle,
  Settings,
  Briefcase,
  Fish,
  BookOpen,
  PenTool,
  Building,
  CloudSun,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ContentType = 'presentation' | 'webpage' | 'document' | 'social';

interface ExamplePrompt {
  icon: React.ReactNode;
  iconBg: string;
  text: string;
}

const allPrompts: ExamplePrompt[] = [
  {
    icon: <Settings className="h-5 w-5 text-blue-500" />,
    iconBg: 'bg-blue-100',
    text: 'Assisting clients in developing and implementing effective sales and marketing strategies'
  },
  {
    icon: <Fish className="h-5 w-5 text-cyan-500" />,
    iconBg: 'bg-cyan-100',
    text: 'Monsters of the deep oceans'
  },
  {
    icon: <BookOpen className="h-5 w-5 text-blue-600" />,
    iconBg: 'bg-blue-100',
    text: 'Book report for "The Joy Luck Club"'
  },
  {
    icon: <PenTool className="h-5 w-5 text-indigo-500" />,
    iconBg: 'bg-indigo-100',
    text: 'Editing and refining creative projects such as videos or artwork'
  },
  {
    icon: <Building className="h-5 w-5 text-emerald-500" />,
    iconBg: 'bg-emerald-100',
    text: 'Pitch deck for [company]'
  },
  {
    icon: <CloudSun className="h-5 w-5 text-orange-500" />,
    iconBg: 'bg-orange-100',
    text: 'Presentation on the history of UFOs for skeptics'
  },
  {
    icon: <Briefcase className="h-5 w-5 text-purple-500" />,
    iconBg: 'bg-purple-100',
    text: 'Quarterly business review presentation'
  },
  {
    icon: <Globe className="h-5 w-5 text-green-500" />,
    iconBg: 'bg-green-100',
    text: 'Travel guide for exploring Japan'
  },
];

export default function Generate() {
  const navigate = useNavigate();
  const [contentType, setContentType] = useState<ContentType>('presentation');
  const [cardCount, setCardCount] = useState(10);
  const [style, setStyle] = useState('classic');
  const [size, setSize] = useState('default');
  const [language, setLanguage] = useState('en-us');
  const [prompt, setPrompt] = useState('');
  const [examplePrompts, setExamplePrompts] = useState<ExamplePrompt[]>(allPrompts.slice(0, 6));

  const contentTypes = [
    { id: 'presentation', icon: Presentation, label: 'Presentation' },
    { id: 'webpage', icon: Globe, label: 'Webpage' },
    { id: 'document', icon: FileText, label: 'Document' },
    { id: 'social', icon: Smartphone, label: 'Social' },
  ];

  const handleShuffle = () => {
    const shuffled = [...allPrompts].sort(() => Math.random() - 0.5);
    setExamplePrompts(shuffled.slice(0, 6));
  };

  const handlePromptClick = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-sky-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 italic">Generate</h1>
          <p className="text-muted-foreground text-lg">What would you like to create today?</p>
        </div>

        {/* Content Type Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          {contentTypes.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setContentType(id as ContentType)}
              className={`flex flex-col items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${
                contentType === id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-white/80 text-muted-foreground hover:border-primary/50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Options Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          {/* Card Counter */}
          <div className="flex items-center gap-1 bg-white/80 rounded-full px-3 py-2 border border-border">
            <button
              onClick={() => setCardCount(Math.max(1, cardCount - 1))}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-3 text-sm font-medium">{cardCount} cards</span>
            <button
              onClick={() => setCardCount(cardCount + 1)}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Style Select */}
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="w-32 bg-white/80 border-border rounded-full">
              <span className="text-lg mr-1">🖼️</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>

          {/* Size Select */}
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="w-32 bg-white/80 border-border rounded-full">
              <span className="text-sm mr-1">⟨⟩</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="expanded">Expanded</SelectItem>
            </SelectContent>
          </Select>

          {/* Language Select */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40 bg-white/80 border-border rounded-full">
              <span className="text-lg mr-1">⌨️</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-us">English (US)</SelectItem>
              <SelectItem value="en-gb">English (UK)</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prompt Input */}
        <div className="mb-8">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you'd like to make"
            className="w-full py-6 px-4 text-base bg-white/90 border-border rounded-xl focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Example Prompts */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-border flex-1 max-w-[100px]" />
            <span className="text-muted-foreground text-sm">Example prompts</span>
            <div className="h-px bg-border flex-1 max-w-[100px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examplePrompts.map((item, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(item.text)}
                className="flex items-start gap-3 p-4 bg-white/80 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all text-left group"
              >
                <div className={`p-2 rounded-lg ${item.iconBg} shrink-0`}>
                  {item.icon}
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.text}
                </p>
                <Plus className="h-4 w-4 text-muted-foreground/50 shrink-0 ml-auto" />
              </button>
            ))}
          </div>
        </div>

        {/* Shuffle Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleShuffle}
            className="rounded-full px-6 bg-white/80 hover:bg-white"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
        </div>
      </div>
    </div>
  );
}
