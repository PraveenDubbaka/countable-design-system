import { useState } from 'react';
import { 
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  Expand,
  Trash2,
  Folder,
  Headphones,
  LogOut
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import lukaLogo from '@/assets/luka-logo.png';

interface Template {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: Template[];
  isExpanded?: boolean;
}

const initialTemplates: Template[] = [
  { id: '1', name: 'Before Release V22Comp', type: 'folder', children: [] },
  { id: '2', name: 'Before Release V22 Revi...', type: 'folder', children: [] },
  { id: '3', name: 'Carissa_13208', type: 'folder', children: [] },
  { id: '4', name: 'carisa 37.3', type: 'folder', children: [] },
  { id: '5', name: 'Compilation Checklists', type: 'folder', children: [] },
  { id: '6', name: 'release 38 before', type: 'folder', children: [] },
  { id: '7', name: 'Review Checklists', type: 'folder', children: [] },
  { id: '8', name: 'Tax Release', type: 'folder', children: [] },
];

// Icon components matching the screenshot
const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bar chart icon */}
    <rect x="3" y="10" width="3" height="7" rx="0.5" fill="currentColor"/>
    <rect x="8.5" y="6" width="3" height="11" rx="0.5" fill="currentColor"/>
    <rect x="14" y="3" width="3" height="14" rx="0.5" fill="currentColor"/>
  </svg>
);

const GlassesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Glasses/spectacles icon */}
    <circle cx="5.5" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="14.5" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2 11V9M18 11V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.3332 8.16667H14.3332C15.2666 8.16667 15.7333 8.16667 16.0898 8.34832C16.4034 8.50811 16.6584 8.76308 16.8182 9.07668C16.9998 9.4332 16.9998 9.89991 16.9998 10.8333V16.5M10.3332 16.5V4.16667C10.3332 3.23325 10.3332 2.76654 10.1515 2.41002C9.99173 2.09641 9.73676 1.84144 9.42316 1.68166C9.06664 1.5 8.59993 1.5 7.6665 1.5H4.6665C3.73308 1.5 3.26637 1.5 2.90985 1.68166C2.59625 1.84144 2.34128 2.09641 2.18149 2.41002C1.99984 2.76654 1.99984 3.23325 1.99984 4.16667V16.5M17.8332 16.5H1.1665M4.9165 4.83333H7.4165M4.9165 8.16667H7.4165M4.9165 11.5H7.4165" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BriefcaseIcon = () => (
  <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.58317 7.99992H4.40148C4.97248 7.99992 5.49448 8.32253 5.74984 8.83325C6.0052 9.34397 6.52719 9.66659 7.0982 9.66659H11.9015C12.4725 9.66659 12.9945 9.34397 13.2498 8.83325C13.5052 8.32253 14.0272 7.99992 14.5982 7.99992H17.4165M6.97197 1.33325H12.0277C12.9251 1.33325 13.3738 1.33325 13.7699 1.46989C14.1202 1.59072 14.4393 1.78792 14.704 2.04721C15.0034 2.34042 15.2041 2.74175 15.6054 3.5444L17.4109 7.15534C17.5684 7.47032 17.6471 7.62782 17.7027 7.79287C17.752 7.93946 17.7876 8.09031 17.809 8.24347C17.8332 8.41594 17.8332 8.59202 17.8332 8.94419V10.6666C17.8332 12.0667 17.8332 12.7668 17.5607 13.3016C17.321 13.772 16.9386 14.1544 16.4681 14.3941C15.9334 14.6666 15.2333 14.6666 13.8332 14.6666H5.1665C3.76637 14.6666 3.06631 14.6666 2.53153 14.3941C2.06112 14.1544 1.67867 13.772 1.43899 13.3016C1.1665 12.7668 1.1665 12.0667 1.1665 10.6666V8.94419C1.1665 8.59202 1.1665 8.41594 1.19065 8.24347C1.21209 8.09031 1.2477 7.93946 1.29702 7.79287C1.35255 7.62782 1.4313 7.47032 1.5888 7.15534L3.39426 3.5444C3.79559 2.74174 3.99626 2.34042 4.29562 2.04721C4.56036 1.78792 4.87943 1.59072 5.22974 1.46989C5.62588 1.33325 6.07458 1.33325 6.97197 1.33325Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Document/file icon */}
    <path d="M5 2h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

const navItems = [
  { icon: AnalyticsIcon, label: 'Analytics' },
  { icon: GlassesIcon, label: 'Review' },
  { icon: ChatIcon, label: 'Messages' },
  { icon: BriefcaseIcon, label: 'Engagements' },
  { icon: FileIcon, label: 'Templates', active: true },
];

// Luka Logo Component
const LukaLogo = () => (
  <img src={lukaLogo} alt="Luka" className="w-7 h-7 object-contain" />
);

export function Sidebar() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [activeTab, setActiveTab] = useState<'firm' | 'master'>('firm');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFolder = (id: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, isExpanded: !t.isExpanded } : t
    ));
  };

  const renderTemplate = (template: Template, depth = 0) => (
    <div key={template.id}>
      <div 
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted transition-colors text-sm ${
          depth > 0 ? 'ml-6' : ''
        }`}
        onClick={() => template.type === 'folder' && toggleFolder(template.id)}
      >
        <Checkbox className="h-4 w-4 border-border" />
        {template.type === 'folder' ? (
          <>
            {template.isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <Folder className="h-4 w-4 text-primary flex-shrink-0" />
          </>
        ) : (
          <>
            <span className="w-4 flex-shrink-0" />
            <Folder className="h-4 w-4 text-primary flex-shrink-0" />
          </>
        )}
        <span className="truncate flex-1 text-foreground">{template.name}</span>
      </div>
      {template.type === 'folder' && template.isExpanded && template.children?.map(child => 
        renderTemplate(child, depth + 1)
      )}
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Icon sidebar - dark navy with curved corner */}
      <div className="sidebar-nav w-14 flex flex-col items-center py-4 gap-2 rounded-tr-[20px]">
        {/* Luka Logo */}
        <div className="w-10 h-10 mb-4 flex items-center justify-center">
          <LukaLogo />
        </div>
        
        {/* Nav items */}
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`sidebar-item ${item.active ? 'active' : ''}`}
            title={item.label}
          >
            <item.icon />
          </div>
        ))}
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Bottom icons */}
        <div className="sidebar-item" title="Support">
          <Headphones className="h-5 w-5" />
        </div>
        <div className="sidebar-item" title="Logout">
          <LogOut className="h-5 w-5" />
        </div>
      </div>

      {/* Templates panel */}
      <div className="w-60 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-primary text-lg">Templates</h2>
          <div className="mt-3 relative">
            <select className="w-full px-3 py-2 bg-background border rounded-lg text-sm appearance-none pr-8 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
              <option>Checklists</option>
              <option>Forms</option>
              <option>Reports</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('firm')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'firm' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Firm Templates
          </button>
          <button
            onClick={() => setActiveTab('master')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'master' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Master Library
          </button>
        </div>

        <div className="p-3 border-b">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search" 
                className="pl-8 h-8 text-sm bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Expand className="h-4 w-4" />
            </Button>
            <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 text-primary-foreground" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {templates.map(template => renderTemplate(template))}
        </div>
      </div>
    </div>
  );
}
