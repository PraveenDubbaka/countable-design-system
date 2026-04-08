import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown, Landmark, FileText, Triangle, FileSpreadsheet, PencilLine, Settings2, Download, FileType, Share2, Save, RefreshCw, Trash2, Building2, Calendar, Check, AlertTriangle, Loader2, History, Upload, FileUp, Bell, Plus } from "lucide-react";
import { ExpandableIconButton } from "@/components/ui/expandable-icon-button";
import { ChecklistIcon } from "@/components/icons/ChecklistIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { MondayBoardView } from "@/components/MondayBoardView";
import { FloatingActionBar } from "@/components/FloatingActionBar";
import { EngagementRightPanel } from "@/components/EngagementRightPanel";
import { Checklist, Question } from "@/types/checklist";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { subscribeToChecklistSync, dispatchChecklistSync } from "@/lib/checklistSync";
import { toast } from "sonner";
import { ShareWithClientDialog } from "@/components/ShareWithClientDialog";
import { ClientResponseDialog } from "@/components/ClientResponseDialog";
import { useClientResponses } from "@/hooks/useClientResponses";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DeleteChecklistDialog } from "@/components/DeleteChecklistDialog";
import { AddChecklistSheet } from "@/components/AddChecklistSheet";

// Sample engagement data matching the engagements page
const engagementsData: Record<string, {
  id: string;
  client: string;
  type: string;
  yearEnd: string;
  status: string;
  checklistId?: string;
}> = {
  "COM-CON-Dec312024": {
    id: "COM-CON-Dec312024",
    client: "Shipping Line Inc.",
    type: "Compilation (COM)",
    yearEnd: "Dec 31, 2024",
    status: "In Progress"
  },
  "COM-PSP-Dec312023": {
    id: "COM-PSP-Dec312023",
    client: "Source 40",
    type: "Compilation (COM)",
    yearEnd: "Dec 31, 2023",
    status: "In Progress"
  },
  "COM-QB-Dec312025": {
    id: "COM-QB-Dec312025",
    client: "qb 40.1",
    type: "Compilation (COM)",
    yearEnd: "Dec 31, 2025",
    status: "In Progress"
  },
  "AUD-SL-Mar312024": {
    id: "AUD-SL-Mar312024",
    client: "Shipping Line Inc.",
    type: "Audit (AUD)",
    yearEnd: "Mar 31, 2024",
    status: "In Progress"
  },
  "REV-SL-Jun302024": {
    id: "REV-SL-Jun302024",
    client: "Shipping Line Inc.",
    type: "Review (REV)",
    yearEnd: "Jun 30, 2024",
    status: "In Progress"
  },
  "COM-S40-Jun302024": {
    id: "COM-S40-Jun302024",
    client: "Source 40",
    type: "Compilation (COM)",
    yearEnd: "Jun 30, 2024",
    status: "In Progress"
  }
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
  sections: [{
    id: "section-1",
    title: "Client acceptance and continuance",
    isExpanded: true,
    questions: [{
      id: "q1",
      text: "5. Independence",
      answerType: "yes-no-na",
      options: ["Yes", "No", "Not Applicable"],
      required: true,
      explanation: "",
      subQuestions: []
    }, {
      id: "q2",
      text: "6. Engagement quality review\nAre there any circumstances that would require this engagement to be subject to an engagement quality review?\nIf so, has a reviewer been appointed?",
      answerType: "yes-no-na",
      options: ["Yes", "No", "Not Applicable"],
      required: true,
      explanation: "",
      subQuestions: []
    }, {
      id: "q3",
      text: "7. Anti-money laundering procedures",
      answerType: "yes-no-na",
      options: ["Yes", "No", "Not Applicable"],
      required: true,
      explanation: "",
      subQuestions: []
    }, {
      id: "q4",
      text: "8. Engagement letter\nHas an engagement letter been signed by both parties?",
      answerType: "yes-no-na",
      options: ["Yes", "No", "Not Applicable"],
      required: true,
      explanation: "",
      subQuestions: []
    }]
  }],
  createdAt: new Date(),
  updatedAt: new Date()
};

// Custom TB Check icon component
const TBCheckIcon = ({
  className
}: {
  className?: string;
}) => <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.84228 5.33609V8.00276M7.84228 10.6694H7.84895M6.91916 1.93057L1.43591 11.4017C1.13177 11.927 0.979701 12.1896 1.00218 12.4052C1.02178 12.5933 1.12029 12.7641 1.2732 12.8753C1.4485 13.0028 1.75201 13.0028 2.35903 13.0028H13.3255C13.9326 13.0028 14.2361 13.0028 14.4114 12.8753C14.5643 12.7641 14.6628 12.5933 14.6824 12.4052C14.7049 12.1896 14.5528 11.927 14.2487 11.4017L8.76541 1.93057C8.46236 1.40713 8.31084 1.14541 8.11315 1.05751C7.94071 0.980831 7.74386 0.980831 7.57142 1.05751C7.37373 1.14541 7.22221 1.40713 6.91916 1.93057Z" stroke="#F04438" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

// Header action buttons
const headerActions = [{
  id: "bank",
  label: "Connect Bank",
  icon: Landmark
}, {
  id: "docs",
  label: "Source Docs",
  icon: FileText
}, {
  id: "tb",
  label: "TB Check",
  icon: TBCheckIcon
}, {
  id: "adj",
  label: "Adj. Entries",
  icon: PencilLine
}, {
  id: "workbook",
  label: "Workbook",
  icon: FileSpreadsheet
}];
export default function EngagementDetail() {
  const {
    engagementId
  } = useParams<{
    engagementId: string;
  }>();
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [objectiveExpanded, setObjectiveExpanded] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [pendingEngagementId, setPendingEngagementId] = useState<string | null>(null);
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [pendingClient, setPendingClient] = useState<string | null>(null);
  const [showClientSwitchDialog, setShowClientSwitchDialog] = useState(false);
  const [selectedClientEngagement, setSelectedClientEngagement] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddChecklistSheet, setShowAddChecklistSheet] = useState(false);
  const [clipboardResponses, setClipboardResponses] = useState<{ checklistTitle: string; responses: Record<string, { answer: string; explanation?: string }> } | null>(null);
  const [showClipboardPrompt, setShowClipboardPrompt] = useState(false);

  // Client responses hook
  const clientResponses = useClientResponses(checklist);
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
    const unsubscribe = subscribeToChecklistSync(payload => {
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
      const updated = savedChecklists.map((c: any, index: number) => index === 0 ? {
        ...c,
        data: updatedChecklist
      } : c);
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
        const updated = savedChecklists.map((c: any, index: number) => index === 0 ? {
          ...c,
          data: checklist
        } : c);
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
    return checklist.sections.every(s => s.questions.every(q => !q.isExpanded));
  }, [checklist]);
  const handleCollapseSections = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({
        ...s,
        isExpanded: false
      }))
    };
    setChecklist(updated);
  };
  const handleExpandSections = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({
        ...s,
        isExpanded: true
      }))
    };
    setChecklist(updated);
  };
  const handleCollapseQuestions = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({
        ...s,
        questions: s.questions.map(q => ({
          ...q,
          isExpanded: false
        }))
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
        questions: s.questions.map(q => ({
          ...q,
          isExpanded: true
        }))
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

  // Delete checklist - save responses to clipboard first
  const handleDeleteChecklist = () => {
    if (!checklist) return;
    // Save current responses to clipboard
    const responses: Record<string, { answer: string; explanation?: string }> = {};
    checklist.sections.forEach(s => {
      const collectAnswers = (questions: Question[]) => {
        questions.forEach(q => {
          if (q.answer) {
            responses[q.id] = { answer: q.answer, explanation: q.explanation };
          }
          if (q.subQuestions) collectAnswers(q.subQuestions);
        });
      };
      collectAnswers(s.questions);
    });
    const hasResponses = Object.keys(responses).length > 0;
    if (hasResponses) {
      setClipboardResponses({ checklistTitle: checklist.title, responses });
    }
    setChecklist(null);
    toast.success('Checklist deleted');
  };

  // Add checklist from picker
  const handleAddChecklist = (saved: { id: string; name: string; data?: any }) => {
    if (saved.data) {
      setChecklist(saved.data);
      setShowAddChecklistSheet(false);
      // Check if clipboard has responses for same checklist title
      if (clipboardResponses && clipboardResponses.checklistTitle === saved.data.title) {
        setShowClipboardPrompt(true);
      }
    }
  };

  // Apply clipboard responses
  const applyClipboardResponses = () => {
    if (!checklist || !clipboardResponses) return;
    const applyToQuestions = (questions: Question[]): Question[] =>
      questions.map(q => {
        const saved = clipboardResponses.responses[q.id];
        return {
          ...q,
          ...(saved ? { answer: saved.answer, explanation: saved.explanation } : {}),
          subQuestions: q.subQuestions ? applyToQuestions(q.subQuestions) : q.subQuestions,
        };
      });
    const updated: Checklist = {
      ...checklist,
      sections: checklist.sections.map(s => ({ ...s, questions: applyToQuestions(s.questions) })),
    };
    setChecklist(updated);
    setClipboardResponses(null);
    setShowClipboardPrompt(false);
    toast.success('Previous responses restored');
  };

  // Handle share button click - show response dialog if has responses, otherwise show share dialog
  const handleShareButtonClick = () => {
    if (clientResponses.hasResponses) {
      setShowResponseDialog(true);
    } else {
      setShowShareDialog(true);
    }
  };

  // Handle share confirmation - trigger client response simulation
  const handleShareConfirm = () => {
    clientResponses.shareWithClient();
    toast.success("Checklist shared with client. Waiting for responses...");
  };

  // Update a specific question's answer and optional explanation using functional state update
  const updateQuestionAnswer = useCallback((questionId: string, answer: string, explanation?: string) => {
    setChecklist(prev => {
      if (!prev) return prev;
      const updateQuestion = (questions: Question[]): Question[] => {
        return questions.map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              answer,
              ...(explanation ? {
                explanation
              } : {})
            };
          }
          if (q.subQuestions) {
            return {
              ...q,
              subQuestions: updateQuestion(q.subQuestions)
            };
          }
          return q;
        });
      };
      return {
        ...prev,
        sections: prev.sections.map(s => ({
          ...s,
          questions: updateQuestion(s.questions)
        }))
      };
    });
  }, []);

  // Handle accepting selected client responses
  const handleAcceptSelectedResponses = (questionIds: string[]) => {
    const selectedResponses = clientResponses.responses.filter(r =>
      questionIds.includes(r.questionId)
    );
    if (selectedResponses.length === 0) return;

    clientResponses.applyFilteredResponses(
      questionIds,
      (questionId, answer, explanation) => updateQuestionAnswer(questionId, answer, explanation),
      () => {
        toast.success(
          questionIds.length === clientResponses.responses.length
            ? "All client responses have been accepted!"
            : `${questionIds.length} response(s) accepted!`
        );
      }
    );
  };
  // No early return — empty state shown inline when checklist is null
  return <Layout>
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
                {uniqueClients.map(client => <DropdownMenuItem key={client} onClick={() => handleClientChange(client)} className="flex items-center gap-2 cursor-pointer group">
                    <Building2 className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                    <span className="flex-1">{client}</span>
                    {client === clientName && <Check className="h-4 w-4 text-primary group-hover:text-primary-foreground" />}
                  </DropdownMenuItem>)}
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
                {clientEngagements.map(eng => <DropdownMenuItem key={eng.id} onClick={() => handleEngagementChange(eng.id)} className="flex items-center gap-3 cursor-pointer group py-2">
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-mono text-sm font-medium truncate">{eng.id}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Calendar className="h-3 w-3 text-muted-foreground group-hover:text-white transition-colors" />
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{eng.yearEnd}</span>
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">•</span>
                        <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{eng.type}</span>
                      </div>
                    </div>
                    {eng.id === displayId && <Check className="h-4 w-4 text-primary group-hover:text-primary-foreground flex-shrink-0" />}
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Badge */}
            <Badge variant={status === 'Completed' || status === 'New' ? 'completed' : status === 'Not Started' ? 'notStarted' : 'inProgress'} className="ml-2 whitespace-nowrap">
              {status}
            </Badge>
          </div>

          {/* Right side - Tool buttons */}
          <TooltipProvider>
            <div className="flex items-center gap-1">
              {headerActions.map(action => (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    <Button variant="secondary" size="icon-sm" className="h-8 w-8">
                      <action.icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto bg-card">
          {checklist ? (
            <>
            {/* Action Buttons - Sticky Header with Title */}
            <div className="sticky top-0 z-10 bg-card px-4 py-2 flex flex-col border-b border-border/50">
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-foreground truncate text-lg">
                  Client acceptance and continuance
                </h1>
                <div className="flex items-center gap-2">
                  <ExpandableIconButton
                    variant="default"
                    icon={<Save className="h-4 w-4" />}
                    label="Save"
                    onClick={handleSave}
                  />

                  {/* Export Checklist */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <ExpandableIconButton
                        variant="outline"
                        icon={<Download className="h-4 w-4" />}
                        label="Export"
                        className="bg-card hover:bg-muted"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border shadow-lg z-50 w-40">
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer group" onClick={() => toast.info('Exporting as PDF...')}>
                        <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span>PDF</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer group" onClick={() => toast.info('Exporting as Word...')}>
                        <FileType className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span>Word</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Share with Client */}
                  <div className="relative">
                    <ExpandableIconButton
                      variant="outline"
                      icon={<Share2 className="h-4 w-4" />}
                      label={clientResponses.hasResponses ? 'Responses!' : 'Share'}
                      className={`bg-card hover:bg-muted ${clientResponses.hasResponses ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                      onClick={handleShareButtonClick}
                    />
                    {clientResponses.hasResponses && <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 pointer-events-none">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-primary items-center justify-center">
                          <Bell className="h-3 w-3 text-primary-foreground" />
                        </span>
                      </span>}
                  </div>

                  <ExpandableIconButton
                    variant="outline"
                    icon={<svg className="h-4 w-4" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M620.544 137.6c103.936 10.432 187.328 72.96 205.12 180.224h-60.16l97.088 144.448 97.152-144.448h-67.008c-17.792-144.448-127.168-238.336-265.344-251.712-19.136-1.536-36.864 14.848-36.864 35.712 1.28 17.92 13.568 34.24 30.016 35.776z m-150.4-73.024H132.416c-19.136 0-34.176 16.384-34.176 37.248v321.728c0 20.864 15.04 37.248 34.176 37.248h337.728c19.136 0 34.176-16.384 34.176-37.248V101.824c0-20.864-15.04-37.248-34.176-37.248z m-32.832 324.736H165.248V136.064h272.128v253.248h-0.064zM404.48 883.84c-116.224-10.432-205.12-87.872-209.216-216h64.256L162.496 523.392l-97.088 144.448h64.256c2.688 165.376 118.912 272.576 268.032 287.488 19.136 1.472 36.928-14.912 36.928-35.776a35.648 35.648 0 0 0-30.144-35.712z m489.6-323.264H556.288c-19.2 0-34.176 16.448-34.176 37.248v323.264c0 20.8 14.976 37.184 34.176 37.184h337.728c19.136 0 34.112-16.384 34.112-37.184V597.824c0.064-20.8-16.32-37.248-34.048-37.248z m-32.896 324.736H589.12V633.536h272.064v251.776z" />
                    </svg>}
                    label="Replace"
                    className="bg-card hover:bg-muted"
                  />

                  <ExpandableIconButton
                    variant="outline"
                    icon={<Trash2 className="h-4 w-4" />}
                    label="Delete"
                    className="bg-card hover:bg-muted text-destructive hover:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-4">
              {/* Clipboard prompt banner - above objective */}
              {showClipboardPrompt && clipboardResponses && (
                <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-amber-50 rounded-lg border border-amber-300 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <History className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-amber-900 flex-1">Previous responses available for this checklist</span>
                  <Button size="sm" variant="default" className="h-8 text-xs" onClick={applyClipboardResponses}>
                    Add Previous responses
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setShowClipboardPrompt(false); setClipboardResponses(null); }}>
                    Dismiss
                  </Button>
                </div>
              )}
              <div className="mb-6 bg-card rounded-lg overflow-hidden shadow-md border border-border">
                <button onClick={() => setObjectiveExpanded(!objectiveExpanded)} className="w-full flex items-center gap-2 bg-muted px-4 py-3 text-muted-foreground hover:text-foreground transition-colors border-b border-border">
                  <ChevronDown className={`h-4 w-4 transition-transform ${objectiveExpanded ? 'rotate-180' : ''}`} />
                  <span className="text-sm font-medium">Objective</span>
                </button>
                {objectiveExpanded && <div className="bg-card p-4">
                    {checklist.objective ? <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {checklist.objective}
                      </p> : <p className="text-sm text-muted-foreground italic">
                        No objective defined
                      </p>}
                  </div>}
              </div>

              {/* Monday Board View in Preview Mode */}
              {isLoading ? <div className="bg-card rounded-lg shadow-sm p-12 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Loading engagement checklist...</p>
                    <p className="text-xs text-muted-foreground mt-1">Please wait while we fetch the data</p>
                  </div>
                </div> : <div className="bg-card rounded-lg shadow-sm">
                  <MondayBoardView checklist={checklist} onUpdate={handleChecklistUpdate} isPreviewMode={false} isCompactMode={isCompactMode} selectedQuestions={selectedQuestions} onSelectionChange={setSelectedQuestions} isEngagementMode={true} applyingQuestionId={clientResponses.applyingQuestionId} />
                </div>}
            </div>
            </>
          ) : (
            /* Empty State - No checklist */
            <>
              <div className="sticky top-0 z-10 bg-card px-4 py-2 flex items-center justify-between border-b border-border/50">
                <h1 className="font-semibold text-foreground truncate text-lg">
                  Client acceptance and continuance
                </h1>
                <Button className="h-9 gap-2" onClick={() => setShowAddChecklistSheet(true)}>
                  <Plus className="h-4 w-4" />
                  Checklist
                </Button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center py-32">
                {/* Shield illustration placeholder */}
                <div className="w-28 h-28 mb-6 relative">
                  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <circle cx="60" cy="60" r="50" fill="hsl(var(--primary) / 0.08)" />
                    <path d="M60 25L85 38V58C85 74 74 88 60 93C46 88 35 74 35 58V38L60 25Z" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="2" />
                    <circle cx="60" cy="58" r="12" fill="hsl(var(--primary) / 0.25)" />
                    <path d="M55 58L59 62L66 54" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="40" cy="35" r="3" fill="hsl(var(--primary) / 0.2)" />
                    <circle cx="85" cy="45" r="4" fill="hsl(var(--primary) / 0.15)" />
                    <circle cx="38" cy="75" r="3" fill="hsl(var(--primary) / 0.2)" />
                    <circle cx="82" cy="72" r="2.5" fill="hsl(var(--primary) / 0.2)" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No checklist available</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Currently there is no checklist available.<br />Please add a checklist
                </p>
              </div>
            </>
          )}
          </div>

          {/* Floating Action Bar for Preview Mode - Inside content area */}
          {checklist && <FloatingActionBar checklist={checklist} onUpdate={handleChecklistUpdate} onCollapseSections={handleCollapseSections} onExpandSections={handleExpandSections} onCollapseQuestions={handleCollapseQuestions} onExpandQuestions={handleExpandQuestions} allSectionsCollapsed={allSectionsCollapsed} allQuestionsCollapsed={allQuestionsCollapsed} isCompactMode={isCompactMode} onToggleCompactMode={handleToggleCompactMode} selectedQuestions={selectedQuestions} onBulkDelete={handleBulkDelete} onAddCategory={handleAddCategory} isPreviewMode={true} />}
        </div>

        {/* Right Panel or Add Checklist Sheet */}
        {showAddChecklistSheet ? (
          <AddChecklistSheet open={showAddChecklistSheet} onClose={() => setShowAddChecklistSheet(false)} onSelect={handleAddChecklist} />
        ) : (
          <EngagementRightPanel />
        )}

        {/* Delete Checklist Confirmation */}
        <DeleteChecklistDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDeleteChecklist} />

        {/* Share with Client Dialog */}
        <ShareWithClientDialog open={showShareDialog} onOpenChange={setShowShareDialog} checklistName={checklist?.title} onConfirm={handleShareConfirm} />

        {/* Client Response Dialog */}
        <ClientResponseDialog open={showResponseDialog} onOpenChange={setShowResponseDialog} totalQuestions={clientResponses.totalQuestions} answeredQuestions={clientResponses.answeredQuestions} responses={clientResponses.responses} onAcceptSelected={handleAcceptSelectedResponses} isApplying={clientResponses.isApplyingResponses} checklist={checklist} />

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
                <Button variant="outline" onClick={cancelEngagementSwitch} className="flex-1 h-10">
                  No
                </Button>
                <Button onClick={confirmEngagementSwitch} className="flex-1 h-10 bg-primary hover:bg-primary/90">
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
                {pendingClientEngagements.map(eng => <button key={eng.id} onClick={() => setSelectedClientEngagement(eng.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedClientEngagement === eng.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-muted/50'}`}>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-mono text-sm font-medium truncate">{eng.id}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{eng.yearEnd}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{eng.type}</span>
                      </div>
                    </div>
                    {selectedClientEngagement === eng.id && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                  </button>)}
              </div>
              
              {/* Action Buttons */}
              <DialogFooter className="flex flex-row gap-3 w-full sm:justify-center pt-2">
                <Button variant="outline" onClick={cancelClientSwitch} className="flex-1 h-10">
                  No
                </Button>
                <Button onClick={confirmClientSwitch} disabled={!selectedClientEngagement} className="flex-1 h-10 bg-primary hover:bg-primary/90">
                  Yes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>;
}