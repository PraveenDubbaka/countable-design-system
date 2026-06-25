import { useState } from "react";
import { Plus, ChevronRight, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LetterIcon } from "@/components/icons/LetterIcon";

interface LetterTemplate {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: LetterTemplate[];
  isExpanded?: boolean;
}

const LETTER_TEMPLATES: LetterTemplate[] = [
  { id: "glt-compilation", name: "Compilation", type: "folder", isExpanded: true, children: [
    { id: "glt-1-1", name: "Engagement Letter — Compilation (Corp)", type: "file" },
    { id: "glt-1-2", name: "Management Responsibility & Acknowledgement CSRS 4200 (Corp)", type: "file" },
  ]},
  { id: "glt-review", name: "Review", type: "folder", isExpanded: false, children: [
    { id: "glt-2-1", name: "Engagement Letter Review — Master (Corp)", type: "file" },
    { id: "glt-2-2", name: "Management Representation Letter Review (Corp)", type: "file" },
    { id: "glt-2-3", name: "Review Findings Letter (Corp)", type: "file" },
    { id: "glt-2-4", name: "Letter to a Predecessor (Corp)", type: "file" },
    { id: "glt-2-5", name: "Letter to a Successor (Corp)", type: "file" },
    { id: "glt-2-6", name: "Request for Management Assistance (Corp)", type: "file" },
  ]},
  { id: "glt-tax", name: "Tax", type: "folder", isExpanded: false, children: [
    { id: "glt-3-1", name: "Tax Engagement Letter", type: "file" },
  ]},
  { id: "glt-additional", name: "Additional Letters", type: "folder", isExpanded: false, children: [
    { id: "glt-4-1", name: "Closing Cover Letter", type: "file" },
    { id: "glt-4-2", name: "Letter to Lawyer (Long Form)", type: "file" },
    { id: "glt-4-3", name: "Letter to Lawyer (Short Form)", type: "file" },
    { id: "glt-4-4", name: "Letter to Predecessor Accountant", type: "file" },
    { id: "glt-4-5", name: "Letter to Successor Accountant", type: "file" },
  ]},
  { id: "glt-audit", name: "Audit", type: "folder", isExpanded: true, children: [
    { id: "glt-audit-ca", name: "Canada", type: "folder", isExpanded: true, children: [
      { id: "glt-ca-1", name: "Audit Engagement Letter (CAS/ASPE)", type: "file" },
      { id: "glt-ca-2", name: "Audit Engagement Letter (CAS/ASNPO)", type: "file" },
      { id: "glt-ca-3", name: "Management Representation Letter (CAS 580)", type: "file" },
      { id: "glt-ca-4", name: "Communication with Those Charged with Governance — Planning (CAS 260)", type: "file" },
      { id: "glt-ca-5", name: "Communication with Those Charged with Governance — Final (CAS 260)", type: "file" },
      { id: "glt-ca-6", name: "Inquiry to Legal Counsel (Lawyer's Letter)", type: "file" },
      { id: "glt-ca-7", name: "Communication to Predecessor Auditor", type: "file" },
      { id: "glt-ca-8", name: "Letter to Management — Significant Deficiencies (CAS 265)", type: "file" },
      { id: "glt-ca-9", name: "Letter to a predecessor accounting firm", type: "file" },
    ]},
    { id: "glt-audit-us", name: "United States", type: "folder", isExpanded: false, children: [
      { id: "glt-us-1", name: "Audit Engagement Letter (GAAS/US GAAP)", type: "file" },
      { id: "glt-us-2", name: "Management Representation Letter (AU-C 580)", type: "file" },
      { id: "glt-us-3", name: "Communication with Those Charged with Governance — Planning (AU-C 260)", type: "file" },
      { id: "glt-us-4", name: "Communication with Those Charged with Governance — Final (AU-C 260)", type: "file" },
      { id: "glt-us-5", name: "Inquiry to Legal Counsel", type: "file" },
      { id: "glt-us-6", name: "Letter to Management — Significant Deficiencies (AU-C 265)", type: "file" },
      { id: "glt-us-7", name: "Communication to Predecessor Auditor (AU-C 210)", type: "file" },
    ]},
  ]},
];

interface TemplateTreeNodeProps {
  node: LetterTemplate;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (name: string) => void;
}

function TemplateTreeNode({ node, depth, expanded, onToggle, onSelect }: TemplateTreeNodeProps) {
  const isOpen = expanded.has(node.id);
  if (node.type === "folder") {
    return (
      <div>
        <div
          className="flex items-center gap-1.5 py-1.5 px-2 rounded-[8px] cursor-pointer hover:bg-muted transition-colors text-sm"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => onToggle(node.id)}
        >
          {isOpen ? <ChevronRight className="h-3.5 w-3.5 text-muted-foreground rotate-90 flex-shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
          <span className="font-medium text-foreground">{node.name}</span>
        </div>
        {isOpen && node.children?.map(child => (
          <TemplateTreeNode key={child.id} node={child} depth={depth + 1} expanded={expanded} onToggle={onToggle} onSelect={onSelect} />
        ))}
      </div>
    );
  }
  return (
    <div
      className="flex items-center gap-1.5 py-1.5 px-2 rounded-[8px] cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors text-sm"
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
      onClick={() => onSelect(node.name)}
    >
      <LetterIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      <span className="truncate">{node.name}</span>
    </div>
  );
}

interface LetterSectionPageProps {
  sectionName: string;
  sectionId: string;
  engagementId: string;
  onLetterCreated?: (templateName: string) => void;
}

export function LetterSectionPage({ sectionName, onLetterCreated }: LetterSectionPageProps) {
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [templateTab, setTemplateTab] = useState<'my' | 'global'>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const s = new Set<string>();
    s.add('glt-compilation');
    s.add('glt-audit');
    s.add('glt-audit-ca');
    return s;
  });

  const handleToggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectTemplate = (name: string) => {
    setShowTemplatePanel(false);
    onLetterCreated?.(name);
  };

  const filterNodes = (nodes: LetterTemplate[], q: string): LetterTemplate[] => {
    if (!q) return nodes;
    return nodes.flatMap(n => {
      if (n.type === 'file' && n.name.toLowerCase().includes(q.toLowerCase())) return [n];
      if (n.type === 'folder' && n.children) {
        const filtered = filterNodes(n.children, q);
        if (filtered.length) return [{ ...n, children: filtered, isExpanded: true }];
      }
      return [];
    });
  };

  const visibleTemplates = filterNodes(LETTER_TEMPLATES, searchQuery);

  return (
    <>
      <div className="flex flex-col items-center justify-center flex-1 py-24 gap-6">
        {/* Illustration */}
        <div className="w-28 h-28 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/5" />
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 relative z-10">
            <circle cx="40" cy="40" r="38" fill="hsl(var(--primary)/0.08)" />
            <rect x="20" y="22" width="40" height="36" rx="3" fill="white" stroke="hsl(var(--primary)/0.3)" strokeWidth="1.5" />
            <line x1="27" y1="32" x2="53" y2="32" stroke="hsl(var(--primary)/0.25)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="27" y1="38" x2="53" y2="38" stroke="hsl(var(--primary)/0.25)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="27" y1="44" x2="44" y2="44" stroke="hsl(var(--primary)/0.25)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-foreground">No Letter Found</p>
          <p className="text-sm text-muted-foreground mt-1">Please add a letter by clicking '+ Letter'<br />button on top right</p>
        </div>
      </div>

      {/* "+ Letter" button — fixed top right of the content area */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5 h-8 px-3 text-xs">
              <Plus className="h-3.5 w-3.5" />
              {sectionName}
              <ChevronRight className="h-3.5 w-3.5 rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2 cursor-pointer text-sm" onClick={() => document.getElementById('letter-upload-input')?.click()}>
              <Upload className="h-4 w-4 text-muted-foreground" />
              Upload a letter
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer text-sm" onClick={() => setShowTemplatePanel(true)}>
              <LetterIcon className="h-4 w-4 text-muted-foreground" />
              Create from template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <input id="letter-upload-input" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { if (e.target.files?.[0]) onLetterCreated?.(e.target.files[0].name); }} />

      {/* Template selector — right slide panel */}
      <Sheet open={showTemplatePanel} onOpenChange={setShowTemplatePanel}>
        <SheetContent side="right" className="w-[420px] sm:w-[480px] p-0 flex flex-col">
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/60">
            <SheetTitle className="text-base">Select letter template</SheetTitle>
          </SheetHeader>

          {/* Tabs */}
          <div className="flex border-b border-border/60">
            <button
              onClick={() => setTemplateTab('my')}
              className={cn("flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors", templateTab === 'my' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
            >
              My Templates
            </button>
            <button
              onClick={() => setTemplateTab('global')}
              className={cn("flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors", templateTab === 'global' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
            >
              Global Templates
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-border/40">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          {/* Template tree */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {templateTab === 'global' ? (
              visibleTemplates.length > 0 ? (
                visibleTemplates.map(node => (
                  <TemplateTreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                    expanded={expanded}
                    onToggle={handleToggle}
                    onSelect={handleSelectTemplate}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm text-muted-foreground">No templates found</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                <LetterIcon className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No personal templates yet</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
