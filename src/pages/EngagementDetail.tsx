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
  AlertTriangle,
  Loader2,
  History,
  Upload,
  FileUp,
} from "lucide-react";
import { ChecklistIcon } from "@/components/icons/ChecklistIcon";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { MondayBoardView } from "@/components/MondayBoardView";
import { FloatingActionBar } from "@/components/FloatingActionBar";
import { EngagementRightPanel } from "@/components/EngagementRightPanel";
import { Checklist } from "@/types/checklist";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { subscribeToChecklistSync, dispatchChecklistSync } from "@/lib/checklistSync";
import { toast } from "sonner";
import { ShareWithClientDialog } from "@/components/ShareWithClientDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Sample engagement data matching the engagements page
const engagementsData: Record<string, { id: string; client: string; type: string; yearEnd: string; status: string; checklistId?: string }> = {
  "COM-CON-Dec312024": { id: "COM-CON-Dec312024", client: "Shipping Line Inc.", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", status: "In Progress" },
  "COM-PSP-Dec312023": { id: "COM-PSP-Dec312023", client: "Source 40", type: "Compilation (COM)", yearEnd: "Dec 31, 2023", status: "In Progress" },
  "COM-QB-Dec312025": { id: "COM-QB-Dec312025", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Dec 31, 2025", status: "In Progress" },
  "AUD-SL-Mar312024": { id: "AUD-SL-Mar312024", client: "Shipping Line Inc.", type: "Audit (AUD)", yearEnd: "Mar 31, 2024", status: "In Progress" },
  "REV-SL-Jun302024": { id: "REV-SL-Jun302024", client: "Shipping Line Inc.", type: "Review (REV)", yearEnd: "Jun 30, 2024", status: "In Progress" },
  "COM-S40-Jun302024": { id: "COM-S40-Jun302024", client: "Source 40", type: "Compilation (COM)", yearEnd: "Jun 30, 2024", status: "In Progress" },
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

// Custom TB Check icon component
const TBCheckIcon = ({ className }: { className?: string }) => (
  <svg 
    width="16" 
    height="14" 
    viewBox="0 0 16 14" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M7.84228 5.33609V8.00276M7.84228 10.6694H7.84895M6.91916 1.93057L1.43591 11.4017C1.13177 11.927 0.979701 12.1896 1.00218 12.4052C1.02178 12.5933 1.12029 12.7641 1.2732 12.8753C1.4485 13.0028 1.75201 13.0028 2.35903 13.0028H13.3255C13.9326 13.0028 14.2361 13.0028 14.4114 12.8753C14.5643 12.7641 14.6628 12.5933 14.6824 12.4052C14.7049 12.1896 14.5528 11.927 14.2487 11.4017L8.76541 1.93057C8.46236 1.40713 8.31084 1.14541 8.11315 1.05751C7.94071 0.980831 7.74386 0.980831 7.57142 1.05751C7.37373 1.14541 7.22221 1.40713 6.91916 1.93057Z" 
      stroke="#F04438" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Header action buttons
const headerActions = [
  { id: "bank", label: "Connect Bank", icon: Landmark },
  { id: "docs", label: "Source Docs", icon: FileText },
  { id: "tb", label: "TB Check", icon: TBCheckIcon },
  { id: "adj", label: "Adj. Entries", icon: PencilLine },
  { id: "workbook", label: "Workbook", icon: FileSpreadsheet },
];

export default function EngagementDetail() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [objectiveExpanded, setObjectiveExpanded] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [pendingEngagementId, setPendingEngagementId] = useState<string | null>(null);
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [pendingClient, setPendingClient] = useState<string | null>(null);
  const [showClientSwitchDialog, setShowClientSwitchDialog] = useState(false);
  const [selectedClientEngagement, setSelectedClientEngagement] = useState<string | null>(null);

  const engagement = engagementId ? engagementsData[engagementId] : null;
  const displayId = engagementId || "Unknown";
  const clientName = engagement?.client || "Unknown Client";
  const status = engagement?.status || "In Progress";

  // Get unique clients and current client's engagements
  const uniqueClients = useMemo(() => getUniqueClients(), []);
  const clientEngagements = useMemo(() => getEngagementsForClient(clientName), [clientName]);

  // Handle client change - show dialog with engagements
  const handleClientChange = (newClient: string) => {
    if (newClient !== clientName) {
      const clientEngs = getEngagementsForClient(newClient);
      setPendingClient(newClient);
      // Pre-select the first engagement
      setSelectedClientEngagement(clientEngs.length > 0 ? clientEngs[0].id : null);
      setShowClientSwitchDialog(true);
    }
  };

  // Get engagements for pending client
  const pendingClientEngagements = useMemo(() => {
    return pendingClient ? getEngagementsForClient(pendingClient) : [];
  }, [pendingClient]);

  // Confirm client switch
  const confirmClientSwitch = () => {
    if (selectedClientEngagement) {
      navigate(`/engagements/${selectedClientEngagement}`);
    }
    setShowClientSwitchDialog(false);
    setPendingClient(null);
    setSelectedClientEngagement(null);
  };

  // Cancel client switch
  const cancelClientSwitch = () => {
    setShowClientSwitchDialog(false);
    setPendingClient(null);
    setSelectedClientEngagement(null);
  };

  // Handle engagement change - show confirmation dialog
  const handleEngagementChange = (newEngagementId: string) => {
    if (newEngagementId !== engagementId) {
      setPendingEngagementId(newEngagementId);
      setShowSwitchDialog(true);
    }
  };

  // Confirm engagement switch
  const confirmEngagementSwitch = () => {
    if (pendingEngagementId) {
      navigate(`/engagements/${pendingEngagementId}`);
    }
    setShowSwitchDialog(false);
    setPendingEngagementId(null);
  };

  // Cancel engagement switch
  const cancelEngagementSwitch = () => {
    setShowSwitchDialog(false);
    setPendingEngagementId(null);
  };

  // Load checklist from localStorage - use first saved checklist or fallback
  useEffect(() => {
    // Set loading state when engagement changes
    setIsLoading(true);
    setChecklist(null);
    
    // Simulate loading delay for better UX feedback
    const loadTimer = setTimeout(() => {
      const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
      
      if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
        // Use the first saved checklist's data
        const firstChecklist = savedChecklists[0];
        if (firstChecklist?.data) {
          setChecklist(firstChecklist.data);
          setIsLoading(false);
          return;
        }
      }
      
      // Fallback to sample checklist if no saved checklists exist
      setChecklist(fallbackChecklist);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(loadTimer);
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
      <div className="flex h-full overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Top Header Bar with breadcrumb and actions */}
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-border bg-gradient-to-r from-card via-card to-secondary/20">
          {/* Left side - Interactive Breadcrumb */}
          <div className="flex items-center gap-2">
            {/* Client Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-primary/5 transition-colors">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{clientName}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
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

            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />

            {/* Engagement Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-primary/5 transition-colors">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors font-mono">{displayId}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
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
                        <Calendar className="h-3 w-3 text-muted-foreground group-hover:text-white transition-colors" />
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{eng.yearEnd}</span>
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">•</span>
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{eng.type}</span>
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
            <Badge 
              variant={
                status === 'Completed' || status === 'New'
                  ? 'completed'
                  : status === 'Not Started'
                  ? 'notStarted'
                  : 'inProgress'
              }
              className="ml-2 whitespace-nowrap"
            >
              {status}
            </Badge>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

          {/* Content Area - Preview Mode Checklist */}
          <div className="flex-1 overflow-auto bg-card">
          {/* Action Buttons - Sticky Header with Title */}
          <div className="sticky top-0 z-10 bg-card px-4 py-2 flex items-center justify-between border-b border-border/50">
            <h1 className="text-sm font-semibold text-foreground truncate">
              Checklist: {checklist.title}
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="default" size="icon" className="h-9 w-9" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
              
              {/* Prior Year Responses */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border hover:bg-muted">
                        <History className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Prior Year Responses</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="bg-card border shadow-lg z-50 w-48">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => toast.info('Loading responses from Dec 31, 2023...')}
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>Dec 31, 2023</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => toast.info('Loading responses from Dec 31, 2022...')}
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>Dec 31, 2022</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => toast.info('Loading responses from Dec 31, 2021...')}
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>Dec 31, 2021</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Populate */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border hover:bg-muted">
                        <ChecklistIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Populate</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="bg-card border shadow-lg z-50 w-48">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => toast.info('Upload a file to populate responses...')}
                  >
                    <FileUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>Upload File</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Export Checklist */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border hover:bg-muted">
                        <Download className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Export Checklist</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end" className="bg-card border shadow-lg z-50 w-40">
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
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Share with Client */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border hover:bg-muted" onClick={() => setShowShareDialog(true)}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share with Client</TooltipContent>
              </Tooltip>

              <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border hover:bg-muted">
                <svg className="h-4 w-4" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M620.544 137.6c103.936 10.432 187.328 72.96 205.12 180.224h-60.16l97.088 144.448 97.152-144.448h-67.008c-17.792-144.448-127.168-238.336-265.344-251.712-19.136-1.536-36.864 14.848-36.864 35.712 1.28 17.92 13.568 34.24 30.016 35.776z m-150.4-73.024H132.416c-19.136 0-34.176 16.384-34.176 37.248v321.728c0 20.864 15.04 37.248 34.176 37.248h337.728c19.136 0 34.176-16.384 34.176-37.248V101.824c0-20.864-15.04-37.248-34.176-37.248z m-32.832 324.736H165.248V136.064h272.128v253.248h-0.064zM404.48 883.84c-116.224-10.432-205.12-87.872-209.216-216h64.256L162.496 523.392l-97.088 144.448h64.256c2.688 165.376 118.912 272.576 268.032 287.488 19.136 1.472 36.928-14.912 36.928-35.776a35.648 35.648 0 0 0-30.144-35.712z m489.6-323.264H556.288c-19.2 0-34.176 16.448-34.176 37.248v323.264c0 20.8 14.976 37.184 34.176 37.184h337.728c19.136 0 34.112-16.384 34.112-37.184V597.824c0.064-20.8-16.32-37.248-34.048-37.248z m-32.896 324.736H589.12V633.536h272.064v251.776z" />
                </svg>
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 bg-card border-border hover:bg-muted text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-4">
            {/* Objective Section */}
            <div className="mb-6 bg-card rounded-lg overflow-hidden shadow-md border border-border">
            <button 
              onClick={() => setObjectiveExpanded(!objectiveExpanded)}
              className="w-full flex items-center gap-2 bg-muted px-4 py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${objectiveExpanded ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">Objective</span>
            </button>
            
            {objectiveExpanded && (
              <div className="bg-card p-4">
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
          {isLoading ? (
            <div className="bg-card rounded-lg shadow-sm p-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Loading engagement checklist...</p>
                <p className="text-xs text-muted-foreground mt-1">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg shadow-sm">
              <MondayBoardView
                checklist={checklist}
                onUpdate={handleChecklistUpdate}
                isPreviewMode={false}
                isCompactMode={isCompactMode}
                selectedQuestions={selectedQuestions}
                onSelectionChange={setSelectedQuestions}
                isEngagementMode={true}
              />
            </div>
          )}
            </div>
          </div>

          {/* Floating Action Bar for Preview Mode - Inside content area */}
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
        </div>

        {/* Right Panel - Fixed Position */}
        <EngagementRightPanel />

        {/* Share with Client Dialog */}
        <ShareWithClientDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          checklistName={checklist?.title}
        />

        {/* Switch Engagement Confirmation Dialog */}
        <Dialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
          <DialogContent className="sm:max-w-[400px] bg-white border shadow-xl rounded-2xl p-6">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
            <div className="flex flex-col items-center text-center gap-4">
              {/* Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              
              {/* Title */}
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-lg font-semibold text-foreground">
                  You are switching to another engagement
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Are you sure you want to switch to the selected engagement?
                </DialogDescription>
              </DialogHeader>
              
              {/* Action Buttons */}
              <DialogFooter className="flex flex-row gap-3 w-full sm:justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={cancelEngagementSwitch}
                  className="flex-1 h-10"
                >
                  No
                </Button>
                <Button
                  onClick={confirmEngagementSwitch}
                  className="flex-1 h-10 bg-primary hover:bg-primary/90"
                >
                  Yes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Switch Client Confirmation Dialog */}
        <Dialog open={showClientSwitchDialog} onOpenChange={setShowClientSwitchDialog}>
          <DialogContent className="sm:max-w-[440px] bg-white border shadow-xl rounded-2xl p-6">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
            <div className="flex flex-col items-center text-center gap-4">
              {/* Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              
              {/* Title */}
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-lg font-semibold text-foreground">
                  You are switching to another client
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Select an engagement for {pendingClient} to continue.
                </DialogDescription>
              </DialogHeader>
              
              {/* Engagement List */}
              <div className="w-full border rounded-lg divide-y max-h-48 overflow-y-auto">
                {pendingClientEngagements.map((eng) => (
                  <button
                    key={eng.id}
                    onClick={() => setSelectedClientEngagement(eng.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      selectedClientEngagement === eng.id 
                        ? 'bg-primary/10 border-l-2 border-l-primary' 
                        : 'hover:bg-muted/50'
                    }`}
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
                    {selectedClientEngagement === eng.id && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Action Buttons */}
              <DialogFooter className="flex flex-row gap-3 w-full sm:justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={cancelClientSwitch}
                  className="flex-1 h-10"
                >
                  No
                </Button>
                <Button
                  onClick={confirmClientSwitch}
                  disabled={!selectedClientEngagement}
                  className="flex-1 h-10 bg-primary hover:bg-primary/90"
                >
                  Yes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
