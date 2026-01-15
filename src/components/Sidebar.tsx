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

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Building/office grid icon */}
    <rect x="3" y="3" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 7h14M3 11h14M3 15h14M7 3v14M11 3v14" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ContactIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Person with inbox */}
    <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 17c0-3 2.5-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const InboxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Inbox/tray icon */}
    <path d="M3 10l2-6h10l2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10v5a1 1 0 001 1h12a1 1 0 001-1v-5H13l-1 2H8l-1-2H3z" stroke="currentColor" strokeWidth="1.5"/>
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
  { icon: AnalyticsIcon, label: 'Analytics', active: true },
  { icon: BuildingIcon, label: 'Organization' },
  { icon: ContactIcon, label: 'Contacts' },
  { icon: InboxIcon, label: 'Inbox' },
  { icon: FileIcon, label: 'Templates' },
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
