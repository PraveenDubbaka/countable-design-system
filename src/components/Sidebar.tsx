import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Building2, 
  MessageSquare, 
  FileText, 
  Headphones,
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  Expand,
  Trash2,
  Folder,
  File
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Template {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: Template[];
  isExpanded?: boolean;
}

const initialTemplates: Template[] = [
  {
    id: '1',
    name: 'DEF Compilation',
    type: 'folder',
    isExpanded: true,
    children: [
      { id: '1-1', name: 'Client Acceptance and C...', type: 'file' },
      { id: '1-2', name: 'Independence', type: 'file' },
      { id: '1-3', name: 'Knowledge of client busi...', type: 'file' },
      { id: '1-4', name: 'Planning', type: 'file' },
      { id: '1-5', name: 'Withdrawal', type: 'file' },
      { id: '1-6', name: 'Completion', type: 'file' },
    ]
  },
  {
    id: '2',
    name: 'DEF Review',
    type: 'folder',
    children: []
  },
  {
    id: '3',
    name: 'DEF Tax',
    type: 'folder',
    children: []
  }
];

const navItems = [
  { icon: BarChart3, label: 'Dashboard' },
  { icon: Users, label: 'Clients' },
  { icon: Building2, label: 'Firm' },
  { icon: MessageSquare, label: 'Messages' },
  { icon: FileText, label: 'Documents', active: true },
  { icon: Headphones, label: 'Support' },
];

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
          depth > 0 ? 'ml-4' : ''
        }`}
        onClick={() => template.type === 'folder' && toggleFolder(template.id)}
      >
        {template.type === 'folder' ? (
          <>
            {template.isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <Folder className="h-4 w-4 text-primary" />
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className="h-4 w-4 text-primary" />
          </>
        )}
        <span className="truncate flex-1">{template.name}</span>
      </div>
      {template.type === 'folder' && template.isExpanded && template.children?.map(child => 
        renderTemplate(child, depth + 1)
      )}
    </div>
  );

  return (
    <div className="flex h-screen">
      {/* Icon sidebar */}
      <div className="sidebar-nav w-16 flex flex-col items-center py-4 gap-2">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-4">
          <span className="text-primary-foreground font-bold text-lg">C</span>
        </div>
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`sidebar-item !p-3 !rounded-xl ${item.active ? 'active' : ''}`}
          >
            <item.icon className="h-5 w-5" />
          </div>
        ))}
      </div>

      {/* Templates panel */}
      <div className="w-56 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-primary text-lg">Templates</h2>
          <div className="mt-3 relative">
            <select className="w-full px-3 py-2 bg-background border rounded-lg text-sm appearance-none pr-8">
              <option>Checklists</option>
              <option>Forms</option>
              <option>Reports</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
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
                className="pl-8 h-8 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Expand className="h-4 w-4" />
            </Button>
            <Button size="icon" className="h-8 w-8 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
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
