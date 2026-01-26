import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  ChevronDown, 
  Landmark,
  FileText,
  Triangle,
  FileSpreadsheet,
  PencilLine,
  Settings2,
  Download,
  FileType,
  Share2,
  Save,
  RefreshCw,
  Trash2,
  Building2,
  Calendar,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Layout } from "@/components/Layout";
import { MondayBoardView } from "@/components/MondayBoardView";
import { FloatingActionBar } from "@/components/FloatingActionBar";
import { Checklist } from "@/types/checklist";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { subscribeToChecklistSync, dispatchChecklistSync } from "@/lib/checklistSync";
import { toast } from "sonner";
import { ShareWithClientDialog } from "@/components/ShareWithClientDialog";

// Sample engagement data matching the engagements page
const engagementsData: Record<string, { id: string; client: string; type: string; yearEnd: string; status: string; checklistId?: string }> = {
  "COM-CON-Dec312024": { id: "COM-CON-Dec312024", client: "Shipping Line Inc.", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", status: "In Progress" },
  "COM-PSP-Dec312023": { id: "COM-PSP-Dec312023", client: "Source 40", type: "Compilation (COM)", yearEnd: "Dec 31, 2023", status: "In Progress" },
  "COM-QB-Dec312025": { id: "COM-QB-Dec312025", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Dec 31, 2025", status: "In Progress" },
  "AUD-SL-Mar312024": { id: "AUD-SL-Mar312024", client: "Shipping Line Inc.", type: "Audit (AUD)", yearEnd: "Mar 31, 2024", status: "Completed" },
  "REV-SL-Jun302024": { id: "REV-SL-Jun302024", client: "Shipping Line Inc.", type: "Review (REV)", yearEnd: "Jun 30, 2024", status: "In Progress" },
  "COM-S40-Jun302024": { id: "COM-S40-Jun302024", client: "Source 40", type: "Compilation (COM)", yearEnd: "Jun 30, 2024", status: "Not Started" },
};

// Get unique clients from engagements
const getUniqueClients = () => {
  const clients = new Set<string>();
  Object.values(engagementsData).forEach(e => clients.add(e.client));
  return Array.from(clients);
};

// Get engagements for a specific client
const getEngagementsForClient = (clientName: string) => {
  return Object.values(engagementsData).filter(e => e.client === clientName);
};

// Fallback checklist when no saved checklist exists
const fallbackChecklist: Checklist = {
  id: "engagement-checklist",
  title: "Client acceptance and continuance",
  description: "Engagement quality review checklist",
  sections: [
    {
      id: "section-1",
      title: "Client acceptance and continuance",
      isExpanded: true,
      questions: [
        {
          id: "q1",
          text: "5. Independence",
          answerType: "yes-no-na",
          options: ["Yes", "No", "Not Applicable"],
          required: true,
          explanation: "",
          subQuestions: [],
        },
        {
          id: "q2",
          text: "6. Engagement quality review\nAre there any circumstances that would require this engagement to be subject to an engagement quality review?\nIf so, has a reviewer been appointed?",
          answerType: "yes-no-na",
          options: ["Yes", "No", "Not Applicable"],
          required: true,
          explanation: "",
          subQuestions: [],
        },
        {
          id: "q3",
          text: "7. Anti-money laundering procedures",
          answerType: "yes-no-na",
          options: ["Yes", "No", "Not Applicable"],
          required: true,
          explanation: "",
          subQuestions: [],
        },
        {
          id: "q4",
          text: "8. Engagement letter\nHas an engagement letter been signed by both parties?",
          answerType: "yes-no-na",
          options: ["Yes", "No", "Not Applicable"],
          required: true,
          explanation: "",
          subQuestions: [],
        },
      ],
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Header action buttons
const headerActions = [
  { id: "bank", label: "Connect Bank", icon: Landmark },
  { id: "docs", label: "Source Docs", icon: FileText },
  { id: "tb", label: "TB Check", icon: Triangle },
  { id: "adj", label: "Adj. Entries", icon: PencilLine },
  { id: "workbook", label: "Workbook", icon: FileSpreadsheet },
];

export default function EngagementDetail() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [objectiveExpanded, setObjectiveExpanded] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const engagement = engagementId ? engagementsData[engagementId] : null;
  const displayId = engagementId || "Unknown";
  const clientName = engagement?.client || "Unknown Client";
  const status = engagement?.status || "In Progress";

  // Get unique clients and current client's engagements
  const uniqueClients = useMemo(() => getUniqueClients(), []);
  const clientEngagements = useMemo(() => getEngagementsForClient(clientName), [clientName]);

  // Handle client change
  const handleClientChange = (newClient: string) => {
    const clientEngs = getEngagementsForClient(newClient);
    if (clientEngs.length > 0) {
      // Navigate to the first engagement of the selected client
      navigate(`/engagements/${clientEngs[0].id}`);
    }
  };

  // Handle engagement change
  const handleEngagementChange = (newEngagementId: string) => {
    navigate(`/engagements/${newEngagementId}`);
  };

  // Load checklist from localStorage - use first saved checklist or fallback
  useEffect(() => {
    const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
    
    if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
      // Use the first saved checklist's data
      const firstChecklist = savedChecklists[0];
      if (firstChecklist?.data) {
        setChecklist(firstChecklist.data);
        return;
      }
    }
    
    // Fallback to sample checklist if no saved checklists exist
    setChecklist(fallbackChecklist);
  }, [engagementId]);

  // Listen for real-time sync events from templates page (same tab)
  useEffect(() => {
    const unsubscribe = subscribeToChecklistSync((payload) => {
      // Update checklist when sync event is received
      if (payload.data) {
        setChecklist(payload.data);
      }
    });

    return unsubscribe;
  }, []);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'savedChecklists') {
        const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
        if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
          const firstChecklist = savedChecklists[0];
          if (firstChecklist?.data) {
            setChecklist(firstChecklist.data);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleChecklistUpdate = (updatedChecklist: Checklist) => {
    setChecklist(updatedChecklist);
    // In preview mode, we also save changes back to localStorage and dispatch sync
    const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
    if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
      const checklistId = savedChecklists[0]?.id;
      const updated = savedChecklists.map((c: any, index: number) => 
        index === 0 ? { ...c, data: updatedChecklist } : c
      );
      writeJsonToLocalStorage('savedChecklists', updated);
      // Dispatch sync event for real-time updates
      if (checklistId) {
        dispatchChecklistSync(checklistId, updatedChecklist);
      }
    }
  };

  const handleSave = () => {
    if (checklist) {
      const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
      if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
        const checklistId = savedChecklists[0]?.id;
        const updated = savedChecklists.map((c: any, index: number) => 
          index === 0 ? { ...c, data: checklist } : c
        );
        writeJsonToLocalStorage('savedChecklists', updated);
        // Dispatch sync event for real-time updates
        if (checklistId) {
          dispatchChecklistSync(checklistId, checklist);
        }
      }
      toast.success('Checklist saved');
    }
  };

  // Floating action bar handlers
  const allSectionsCollapsed = useMemo(() => {
    if (!checklist) return false;
    return checklist.sections.every(s => !s.isExpanded);
  }, [checklist]);

  const allQuestionsCollapsed = useMemo(() => {
    if (!checklist) return false;
    return checklist.sections.every(s => 
      s.questions.every(q => !q.isExpanded)
    );
  }, [checklist]);

  const handleCollapseSections = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({ ...s, isExpanded: false }))
    };
    setChecklist(updated);
  };

  const handleExpandSections = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({ ...s, isExpanded: true }))
    };
    setChecklist(updated);
  };

  const handleCollapseQuestions = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({
        ...s,
        questions: s.questions.map(q => ({ ...q, isExpanded: false }))
      }))
    };
    setChecklist(updated);
  };

  const handleExpandQuestions = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({
        ...s,
        questions: s.questions.map(q => ({ ...q, isExpanded: true }))
      }))
    };
    setChecklist(updated);
  };

  const handleToggleCompactMode = () => {
    setIsCompactMode(!isCompactMode);
  };

  const handleBulkDelete = () => {
    // No-op in preview mode
  };

  const handleAddCategory = () => {
    // No-op in preview mode
  };

  if (!checklist) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading checklist...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Top Header Bar with breadcrumb and actions */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-card via-card to-secondary/20">
          {/* Left side - Interactive Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Client Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Client</span>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{clientName}</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-card border shadow-lg z-50">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Select Client</div>
                <DropdownMenuSeparator />
                {uniqueClients.map((client) => (
                  <DropdownMenuItem 
                    key={client}
                    onClick={() => handleClientChange(client)}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                    <span className="flex-1">{client}</span>
                    {client === clientName && (
                      <Check className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            {/* Engagement Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Engagement</span>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors font-mono">{displayId}</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 bg-card border shadow-lg z-50">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Engagements for {clientName}
                </div>
                <DropdownMenuSeparator />
                {clientEngagements.map((eng) => (
                  <DropdownMenuItem 
                    key={eng.id}
                    onClick={() => handleEngagementChange(eng.id)}
                    className="flex items-center gap-3 cursor-pointer group py-2"
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-mono text-sm font-medium truncate">{eng.id}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{eng.yearEnd}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{eng.type}</span>
                      </div>
                    </div>
                    {eng.id === displayId && (
                      <Check className="h-4 w-4 text-primary group-hover:text-primary-foreground flex-shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Badge */}
            <span 
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                status === 'Completed' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : status === 'Not Started'
                  ? 'bg-slate-100 text-slate-600'
                  : status === 'New'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-sky-50 text-sky-700'
              }`}
            >
              {status}
            </span>
          </div>

          {/* Right side - Tools dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium">
                <Settings2 className="h-3.5 w-3.5 mr-1.5" />
                Tools
                <ChevronDown className="h-3 w-3 ml-1.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border shadow-lg z-50">
              {headerActions.map((action) => (
                <DropdownMenuItem key={action.id} className="flex items-center gap-2 cursor-pointer group">
                  <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span>{action.label}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer group">
                  <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-data-[state=open]:text-foreground transition-colors" />
                  <span>Export Checklist</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-card border shadow-lg z-50">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => toast.info('Exporting as PDF...')}
                  >
                    <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => toast.info('Exporting as Word...')}
                  >
                    <FileType className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>Word</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span>Share with Client</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content Area - Preview Mode Checklist */}
        <div className="flex-1 overflow-auto bg-white">
          {/* Section Title - Sticky Header */}
          <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 flex items-center justify-between border-b border-border/50">
            <h1 className="text-xl font-semibold text-primary">
              {checklist.title}
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
                Replace
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6">
            {/* Objective Section */}
            <div className="mb-6 bg-white rounded-lg overflow-hidden shadow-md border-t border-black/10">
            <button 
              onClick={() => setObjectiveExpanded(!objectiveExpanded)}
              className="w-full flex items-center gap-2 bg-[#F5F8FA] px-4 py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-[#E8EDF2]"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${objectiveExpanded ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">Objective</span>
            </button>
            
            {objectiveExpanded && (
              <div className="bg-white p-4">
                {checklist.objective ? (
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {checklist.objective}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No objective defined
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Monday Board View in Preview Mode */}
          <div className="bg-white rounded-lg shadow-sm">
            <MondayBoardView
              checklist={checklist}
              onUpdate={handleChecklistUpdate}
              isPreviewMode={true}
              isCompactMode={isCompactMode}
              selectedQuestions={selectedQuestions}
              onSelectionChange={setSelectedQuestions}
            />
          </div>
          </div>
        </div>

        {/* Floating Action Bar for Preview Mode */}
        <FloatingActionBar
          checklist={checklist}
          onUpdate={handleChecklistUpdate}
          onCollapseSections={handleCollapseSections}
          onExpandSections={handleExpandSections}
          onCollapseQuestions={handleCollapseQuestions}
          onExpandQuestions={handleExpandQuestions}
          allSectionsCollapsed={allSectionsCollapsed}
          allQuestionsCollapsed={allQuestionsCollapsed}
          isCompactMode={isCompactMode}
          onToggleCompactMode={handleToggleCompactMode}
          selectedQuestions={selectedQuestions}
          onBulkDelete={handleBulkDelete}
          onAddCategory={handleAddCategory}
          isPreviewMode={true}
        />

        {/* Share with Client Dialog */}
        <ShareWithClientDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          checklistName={checklist?.title}
        />
      </div>
    </Layout>
  );
}
