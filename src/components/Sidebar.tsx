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
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 16c0-2.5 2-4.5 5-4.5s5 2 5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="14" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 11.5c2 0 4 1.5 4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3h7l4 4v10a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 3v4h4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1h-3l-3 3-3-3H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ChecklistIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const navItems = [
  { icon: DashboardIcon, label: 'Dashboard' },
  { icon: UsersIcon, label: 'Clients' },
  { icon: DocumentIcon, label: 'Documents' },
  { icon: ChatIcon, label: 'Messages' },
  { icon: ChecklistIcon, label: 'Checklists', active: true },
];

// Countable Logo SVG
const CountableLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="12" stroke="white" strokeWidth="1.5"/>
    <path 
      d="M14 5C9.029 5 5 9.029 5 14s4.029 9 9 9c1.8 0 3.5-.53 4.9-1.44l-2.4-2.4A5.5 5.5 0 1119.5 14h3.5c0-4.971-4.029-9-9-9z" 
      fill="white"
    />
    <circle cx="14" cy="14" r="3" fill="white"/>
  </svg>
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
        {/* Countable Logo */}
        <div className="w-10 h-10 mb-4 flex items-center justify-center">
          <CountableLogo />
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
