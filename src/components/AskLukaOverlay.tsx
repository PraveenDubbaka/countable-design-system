import { useState, useRef, useCallback, useEffect } from "react";
import { LukaAttachMenu, AttachedFilesBar, useAttachedFiles } from "@/components/luka/LukaAttachMenu";
import { VoiceRecordingOverlay } from "@/components/luka/VoiceRecordingOverlay";
import { X, Mic, Plus, Search, MessageSquare, Minus, Send, Inbox, Maximize2, ChevronLeft, ChevronRight, Clock, PanelLeftClose, MoreHorizontal, Zap, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PromptPicker } from "@/components/luka/PromptPicker";
import { LukaThinkingMessage } from "@/components/luka/LukaThinkingMessage";
import { GrossMarginResponse } from "@/components/luka/GrossMarginResponse";
import { TrialBalanceGIFIResponse } from "@/components/luka/TrialBalanceGIFIResponse";
import { LukaResponseActions } from "@/components/luka/LukaResponseActions";

interface FillSummary {
  filledCount: number;
  totalCount: number;
  skippedItems: Array<{ sectionTitle: string; questionText: string }>;
}

export interface AllTemplateSummary {
  templates: Array<{ name: string; filledCount: number; totalCount: number; section?: string }>;
  totalFilled: number;
  totalFields: number;
  engagementLabel?: string;
}

interface AskLukaOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
  autoFillMode?: boolean;
  checklistLabel?: string;
  engagementLabel?: string;
  autoFillSources?: string[];
  onAutoFillConfirmed?: () => void;
  onAutoFillAll?: () => void;
  summaryMode?: boolean;
  fillSummary?: FillSummary;
  allTemplateSummary?: AllTemplateSummary;
}

const statusColors = ["bg-green-500", "bg-green-500", "bg-amber-500", "bg-green-500", "bg-green-500", "bg-green-500", "bg-purple-500", "bg-purple-500", "bg-amber-500", "bg-green-500", "bg-purple-500"];

const pinnedThreads = [
  { id: 1, name: "Emerging Trends in Accounting" },
  { id: 2, name: "Capital Asset Amortization" },
  { id: 3, name: "Generate Variance Analysis" },
  { id: 4, name: "Details on the report" },
  { id: 5, name: "Summarise uploaded report" },
  { id: 6, name: "Run Client Heath Check" },
  { id: 7, name: "Generate Trial Balance" },
  { id: 8, name: "Aged AR Analysis" },
  { id: 9, name: "General Ledger Analysis" },
  { id: 10, name: "Account Reconciliation" },
  { id: 11, name: "Notes Generator" },
];

const recentThreads = [
  { id: 12, name: "Emerging Trends in Accounting" },
  { id: 13, name: "Capital Asset Amortization" },
  { id: 14, name: "Generate Variance Analysis" },
  { id: 15, name: "Details on the report" },
  { id: 16, name: "Summarise uploaded report" },
  { id: 17, name: "Run Client Heath Check" },
  { id: 18, name: "Generate Trial Balance" },
  { id: 19, name: "Aged AR Analysis" },
];

const suggestions = [
  "#Variance Analysis",
  "#Account Reconciliation",
  "#Bank Reconciliation",
  "#Capital Asset Amortization",
];

/* Simple Luka flash icon using Lucide Zap */
function LukaIcon({ size = 20 }: { size?: number }) {
  return <Zap className="text-white" size={size} fill="white" strokeWidth={0} />;
}

const RELATED_TEMPLATES = [
  "Management Representation Letter",
  "Risk Assessment Summary",
  "Audit Planning Memo",
];

export function AskLukaOverlay({ open, onOpenChange, initialQuery, autoFillMode, checklistLabel, engagementLabel, autoFillSources, onAutoFillConfirmed, onAutoFillAll, summaryMode, fillSummary, allTemplateSummary }: AskLukaOverlayProps) {
  const [message, setMessage] = useState("");
  const [analysisPhase, setAnalysisPhase] = useState<"idle" | "analyzing" | "ready">("idle");

  useEffect(() => {
    if (open && initialQuery) {
      setMessage(initialQuery);
    }
  }, [open, initialQuery]);

  useEffect(() => {
    if (open && autoFillMode) {
      setAnalysisPhase("analyzing");
      const t = window.setTimeout(() => setAnalysisPhase("ready"), 2200);
      return () => window.clearTimeout(t);
    } else {
      setAnalysisPhase("idle");
    }
  }, [open, autoFillMode]);
  const [activeTab, setActiveTab] = useState<"threads" | "workspaces">("threads");
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [viewMode, setViewMode] = useState<"full" | "half">("half");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [showPromptPicker, setShowPromptPicker] = useState(false);
  const [hashFilter, setHashFilter] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [richResponseType, setRichResponseType] = useState<"gross-margin" | "tb-gifi" | null>(null);
  const [revealStep, setRevealStep] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<number | null>(null);
  const revealRef = useRef<number | null>(null);
  const { files: attachedFiles, addFiles, removeFile, clearAll: clearFiles } = useAttachedFiles();
  const [voiceOpen, setVoiceOpen] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMessage(val);

    // Check if # is typed — open prompt picker
    const hashIdx = val.lastIndexOf("#");
    if (hashIdx !== -1) {
      setShowPromptPicker(true);
      setHashFilter(val.slice(hashIdx + 1));
    } else {
      setShowPromptPicker(false);
      setHashFilter("");
    }
  }, []);

  const handlePromptSelect = useCallback((promptLabel: string) => {
    setShowPromptPicker(false);
    setHashFilter("");
    setMessage("");
    setSentMessage(promptLabel);
    setIsThinking(true);
    setAiResponse(null);
    setDisplayedResponse("");
    setIsStreaming(false);
    setRichResponseType(null);
    setRevealStep(-1);
    if (streamRef.current) clearTimeout(streamRef.current);
    if (revealRef.current) clearTimeout(revealRef.current);

    const isGrossMargin = promptLabel.toLowerCase().includes("gross profit margin");
    const isTbGifi = promptLabel.toLowerCase().includes("trial balance by gifi");

    // Simulate thinking then reveal
    setTimeout(() => {
      setIsThinking(false);

      if (isGrossMargin || isTbGifi) {
        setRichResponseType(isGrossMargin ? "gross-margin" : "tb-gifi");
        setAiResponse("__rich__");
        let step = 0;
        const reveal = () => {
          setRevealStep(step);
          step++;
          if (step <= 5) {
            revealRef.current = window.setTimeout(reveal, 600);
          }
        };
        reveal();
      } else {
        const fullResponse = `Here's an overview of **${promptLabel}** with key insights and analysis.\n\nThis covers the essential metrics, trends, and recommendations based on your current financial data. The analysis includes year-over-year comparisons and highlights areas that may require attention.`;
        setAiResponse(fullResponse);
        setIsStreaming(true);
        let idx = 0;
        const stream = () => {
          if (idx < fullResponse.length) {
            const chunkSize = Math.floor(Math.random() * 3) + 1;
            idx = Math.min(idx + chunkSize, fullResponse.length);
            setDisplayedResponse(fullResponse.slice(0, idx));
            streamRef.current = window.setTimeout(stream, 15 + Math.random() * 25);
          } else {
            setIsStreaming(false);
          }
        };
        stream();
      }
    }, 2500);
  }, []);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    const msg = message.trim();
    setMessage("");
    setShowPromptPicker(false);
    setSentMessage(msg);
    setIsThinking(true);
    setAiResponse(null);
    setDisplayedResponse("");
    setIsStreaming(false);
    if (streamRef.current) clearTimeout(streamRef.current);

    const fullResponse = `Here's my response to "${msg}". This analysis covers the key aspects and provides actionable insights based on the available data.`;

    setTimeout(() => {
      setIsThinking(false);
      setAiResponse(fullResponse);
      setIsStreaming(true);
      let idx = 0;
      const stream = () => {
        if (idx < fullResponse.length) {
          const chunkSize = Math.floor(Math.random() * 3) + 1;
          idx = Math.min(idx + chunkSize, fullResponse.length);
          setDisplayedResponse(fullResponse.slice(0, idx));
          streamRef.current = window.setTimeout(stream, 15 + Math.random() * 25);
        } else {
          setIsStreaming(false);
        }
      };
      stream();
    }, 2500);
  }, [message]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showPromptPicker && message.trim()) {
      e.preventDefault();
      handleSend();
    }
  }, [showPromptPicker, message, handleSend]);

  if (!open) return null;

  const allThreads = [...pinnedThreads, ...recentThreads];

  return (
    <>
      {/* Backdrop for half mode */}
      {viewMode === "half" && (
        <div className="fixed inset-0 z-40" onClick={() => onOpenChange(false)} />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 bg-background dark:bg-card overflow-hidden",
          "animate-in slide-in-from-right-5 fade-in zoom-in-[0.97] duration-400 ease-out",
          viewMode === "full"
            ? "left-14 rounded-tl-[1.25rem] rounded-bl-[1.25rem]"
            : "left-[45%] rounded-tl-[1.25rem] rounded-bl-[1.25rem] shadow-[-8px_0_30px_-10px_hsl(var(--primary)/0.15)] border-l border-border"
        )}
      >
        <div className="flex h-full min-w-0 w-full">
          {/* ===== LEFT SIDEBAR ===== */}
          <aside
            className={cn(
              "relative border-r border-border flex flex-col bg-background dark:bg-card transition-all duration-300 ease-in-out",
              sidebarExpanded ? "w-[260px]" : "w-[60px]"
            )}
            onMouseEnter={() => setSidebarHovered(true)}
            onMouseLeave={() => setSidebarHovered(false)}
          >
            {/* Collapse/Expand toggle */}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className={cn(
                "absolute -right-3 top-[50px] z-20 w-6 h-6 rounded-full border border-border bg-background dark:bg-card shadow-sm flex items-center justify-center transition-opacity duration-200 hover:bg-muted",
                sidebarHovered ? "opacity-100" : "opacity-0"
              )}
            >
              {sidebarExpanded ? (
                <ChevronLeft className="h-3 w-3 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              )}
            </button>

            <TooltipProvider delayDuration={100}>
              {sidebarExpanded ? (
                /* ===== EXPANDED VIEW ===== */
                <>
                  {/* Header: Luka icon + name */}
                  <div className="px-4 pt-4 pb-3 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(265_80%_55%)] flex items-center justify-center shrink-0">
                        <LukaIcon size={18} />
                      </div>
                      <span className="text-lg font-bold text-foreground">Luka</span>
                    </div>

                    {/* Tabs: Threads / Workspaces */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setActiveTab("threads")}
                        className={cn(
                          "flex-1 h-8 rounded-[8px] text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
                          activeTab === "threads"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 dark:bg-muted/30 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Threads
                      </button>
                      <button
                        onClick={() => setActiveTab("workspaces")}
                        className={cn(
                          "flex-1 h-8 rounded-[8px] text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
                          activeTab === "workspaces"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/60 dark:bg-muted/30 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <Building2 className="h-3.5 w-3.5" />
                        Workspaces
                      </button>
                    </div>
                  </div>

                  {/* Search + New Thread */}
                  <div className="px-3 pb-3 pt-1 flex items-center gap-2">
                    <div className="relative flex items-center h-9 flex-1 rounded-[10px] border border-border bg-background dark:bg-muted/20 hover:border-primary/30 transition-all duration-200 input-double-border">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        placeholder="Search"
                        className="h-full w-full bg-transparent pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none border-none"
                      />
                    </div>
                    <Button size="icon" className="h-9 w-9 shrink-0 rounded-[10px] bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Thread lists */}
                  <ScrollArea className="flex-1 px-1">
                    {/* Pinned */}
                    <div className="px-3 pb-1 pt-1">
                      <span className="text-xs font-semibold text-muted-foreground">Pinned</span>
                    </div>
                    <div className="pb-2">
                      {pinnedThreads.map((thread) => (
                        <button
                          key={thread.id}
                          className="w-full flex items-center px-4 py-2 text-left hover:bg-muted/60 dark:hover:bg-muted/30 rounded-lg transition-colors"
                        >
                          <span className="text-sm text-foreground truncate">{thread.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Recent */}
                    <div className="px-3 pb-1 pt-2">
                      <span className="text-xs font-semibold text-muted-foreground">Recent</span>
                    </div>
                    <div className="pb-2">
                      {recentThreads.map((thread) => (
                        <button
                          key={thread.id}
                          className="w-full flex items-center px-4 py-2 text-left hover:bg-muted/60 dark:hover:bg-muted/30 rounded-lg transition-colors"
                        >
                          <span className="text-sm text-foreground truncate">{thread.name}</span>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Show More - sticky at bottom */}
                  <div className="px-4 py-3 border-t border-border">
                    <button
                      onClick={() => setShowAllRecent(!showAllRecent)}
                      className="text-sm font-semibold text-link hover:underline"
                    >
                      {showAllRecent ? "Show Less" : "Show More"}
                    </button>
                  </div>
                </>
              ) : (
                /* ===== COLLAPSED ICON VIEW ===== */
                <>
                  {/* New thread button */}
                  <div className="flex justify-center pt-3 pb-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" className="h-10 w-10 rounded-[10px] bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right"><p>New Thread</p></TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Tab icons */}
                  <div className="flex flex-col items-center gap-1 py-2 mx-2 border-t border-b border-border">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setActiveTab("threads")}
                          className={cn("h-10 w-10 rounded-[10px] flex items-center justify-center transition-colors", activeTab === "threads" ? "bg-primary/15 hover:bg-primary/25" : "hover:bg-muted/60")}
                        >
                          <MessageSquare className={cn("h-5 w-5", activeTab === "threads" ? "text-primary" : "text-muted-foreground")} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right"><p>Threads</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setActiveTab("workspaces")}
                          className={cn("h-10 w-10 rounded-[10px] flex items-center justify-center transition-colors", activeTab === "workspaces" ? "bg-primary/15 hover:bg-primary/25" : "hover:bg-muted/60")}
                        >
                          <Building2 className={cn("h-5 w-5", activeTab === "workspaces" ? "text-primary" : "text-muted-foreground")} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right"><p>Workspaces</p></TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Thread icons */}
                  <ScrollArea className="flex-1 py-1">
                    <div className="flex flex-col items-center gap-0.5">
                      {allThreads.map((thread, i) => (
                        <Tooltip key={thread.id}>
                          <TooltipTrigger asChild>
                            <button className="h-9 w-10 flex items-center justify-center rounded-lg hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors relative">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <div className={cn("absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-background dark:border-card", statusColors[i % statusColors.length])} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right"><p>{thread.name}</p></TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Show More + Clock at bottom */}
                  <div className="flex flex-col items-center gap-1 pb-3 pt-2 border-t border-border mx-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="h-9 w-10 flex items-center justify-center rounded-lg hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right"><p>Recent</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setShowAllRecent(!showAllRecent)}
                          className="h-10 w-10 rounded-[10px] flex items-center justify-center transition-colors bg-primary/10 hover:bg-primary/15"
                        >
                          <MoreHorizontal className="h-5 w-5 text-primary" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right"><p>{showAllRecent ? "Show Less" : "Show More"}</p></TooltipContent>
                    </Tooltip>
                  </div>
                </>
              )}
            </TooltipProvider>
          </aside>

          {/* ===== MAIN CONTENT AREA ===== */}
          <main className={cn("flex-1 min-w-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out", (isThinking || aiResponse) ? "bg-background" : "bg-gradient-to-b from-[hsl(210_60%_97%)] via-[hsl(260_40%_96%)] to-[hsl(300_30%_96%)] dark:from-[hsl(220_20%_12%)] dark:via-[hsl(260_15%_14%)] dark:to-[hsl(280_10%_13%)]")}>
            {/* Top right controls */}
            <div className="h-12 px-4 flex items-center justify-end gap-1">
              <TooltipProvider delayDuration={200}>
                {/* Sidebar toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSidebarExpanded(!sidebarExpanded)}
                    >
                      <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>Toggle Sidebar</p></TooltipContent>
                </Tooltip>
                {/* Full-screen mode */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8", viewMode === "full" && "bg-muted")}
                      onClick={() => setViewMode(viewMode === "full" ? "half" : "full")}
                    >
                      <Maximize2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>{viewMode === "full" ? "Half Mode" : "Full Mode"}</p></TooltipContent>
                </Tooltip>
                {/* Minimize */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>Minimize</p></TooltipContent>
                </Tooltip>
                {/* Close */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>Close</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
              {/* Messages area or welcome */}
              <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
                {allTemplateSummary ? (
                  /* All-templates post-fill summary */
                  <div className="flex flex-col items-center px-6 pt-6 pb-6 min-h-[60vh]">
                    <div className="mb-3 flex items-center justify-center w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#8649F1] to-[#2355A4]">
                      <LukaIcon size={22} />
                    </div>
                    {allTemplateSummary.engagementLabel && (
                      <p className="text-xs font-medium text-muted-foreground mb-1 text-center tracking-wide uppercase">{allTemplateSummary.engagementLabel}</p>
                    )}
                    <h2 className="text-lg font-semibold text-foreground mb-1 text-center">All Templates Auto-filled</h2>
                    <p className="text-sm text-muted-foreground text-center mb-4 max-w-[320px]">
                      Luka filled <span className="font-semibold text-foreground">{allTemplateSummary.totalFilled}</span> of <span className="font-semibold text-foreground">{allTemplateSummary.totalFields}</span> fields across <span className="font-semibold text-foreground">{allTemplateSummary.templates.length}</span> template{allTemplateSummary.templates.length !== 1 ? 's' : ''} ({Math.round(allTemplateSummary.totalFilled / Math.max(allTemplateSummary.totalFields, 1) * 100)}%).
                    </p>

                    {/* Overall progress bar */}
                    <div className="w-full max-w-[320px] h-2 rounded-full bg-muted mb-4 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8649F1] to-[#2355A4] transition-all"
                        style={{ width: `${Math.round(allTemplateSummary.totalFilled / Math.max(allTemplateSummary.totalFields, 1) * 100)}%` }}
                      />
                    </div>

                    {/* Per-template breakdown — grouped by section */}
                    <div className="w-full max-w-[340px] rounded-[10px] border border-border bg-muted/30 px-4 py-3 mb-5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Template breakdown</p>
                      <ScrollArea className="max-h-[340px]">
                        <div className="space-y-3 pr-1">
                          {(() => {
                            const SECTION_LABELS: Record<string, string> = {
                              CO: 'Client Onboarding', PL: 'Planning', DO: 'Documents',
                              TB: 'Trial Balance & Adjusting Entries', RA: 'Risk Assessment',
                              RP: 'Response to Assessed Risks', PR: 'Procedures',
                              FS: 'Financial Statements', SO: 'Completion & Signoffs',
                            };
                            const SECTION_ORDER = ['CO','PL','DO','TB','RA','RP','PR','FS','SO'];
                            const grouped: Record<string, typeof allTemplateSummary.templates> = {};
                            const ungrouped: typeof allTemplateSummary.templates = [];
                            for (const t of allTemplateSummary.templates) {
                              if (t.section) { (grouped[t.section] = grouped[t.section] || []).push(t); }
                              else { ungrouped.push(t); }
                            }
                            const sections = SECTION_ORDER.filter(s => grouped[s]);
                            return (
                              <>
                                {sections.map(code => (
                                  <div key={code}>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <span className="text-[10px] font-bold text-muted-foreground font-mono">{code}</span>
                                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{SECTION_LABELS[code]}</span>
                                    </div>
                                    <div className="pl-3 space-y-1 border-l border-border/60">
                                      {grouped[code].map((t, i) => (
                                        <div key={i} className="flex items-start gap-2 py-0.5">
                                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                          <span className="text-sm text-foreground flex-1 min-w-0 break-words leading-snug">{t.name}</span>
                                          <span className="text-xs text-muted-foreground shrink-0 tabular-nums">{t.filledCount}/{t.totalCount}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                                {ungrouped.map((t, i) => (
                                  <div key={`ung-${i}`} className="flex items-start gap-2 py-0.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-sm text-foreground flex-1 min-w-0 break-words leading-snug">{t.name}</span>
                                    <span className="text-xs text-muted-foreground shrink-0 tabular-nums">{t.filledCount}/{t.totalCount}</span>
                                  </div>
                                ))}
                              </>
                            );
                          })()}
                        </div>
                      </ScrollArea>
                    </div>

                    <button
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center gap-2 h-10 px-5 rounded-[10px] text-sm font-semibold text-white bg-gradient-to-br from-[#8649F1] to-[#2355A4] hover:opacity-90 transition-opacity shadow-md"
                    >
                      Back to checklist
                    </button>
                  </div>
                ) : summaryMode && fillSummary ? (
                  /* Post auto-fill summary view */
                  <div className="flex flex-col items-center px-8 pt-8 pb-6 min-h-[60vh]">
                    <div className="mb-4 flex items-center justify-center w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#8649F1] to-[#2355A4]">
                      <LukaIcon size={22} />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-1 text-center">Auto-fill Complete</h2>
                    <p className="text-sm text-muted-foreground text-center mb-5 max-w-[320px]">
                      Luka filled <span className="font-semibold text-foreground">{fillSummary.filledCount}</span> of <span className="font-semibold text-foreground">{fillSummary.totalCount}</span> fields ({Math.round(fillSummary.filledCount / Math.max(fillSummary.totalCount, 1) * 100)}%).
                    </p>

                    {/* Progress bar */}
                    <div className="w-full max-w-[320px] h-2 rounded-full bg-muted mb-5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8649F1] to-[#2355A4] transition-all"
                        style={{ width: `${Math.round(fillSummary.filledCount / Math.max(fillSummary.totalCount, 1) * 100)}%` }}
                      />
                    </div>

                    {/* Filled confirmation */}
                    <div className="w-full max-w-[320px] rounded-[10px] border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 px-4 py-3 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                        <span className="text-sm font-semibold text-green-700 dark:text-green-400">{fillSummary.filledCount} fields auto-filled by Luka</span>
                      </div>
                      <p className="text-xs text-green-700/70 dark:text-green-400/70 pl-6">Responses populated from Xero data and prior year files with citations.</p>
                    </div>

                    {/* Needs review */}
                    {fillSummary.skippedItems.length > 0 && (
                      <div className="w-full max-w-[320px] rounded-[10px] border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-amber-500 text-base">△</span>
                          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{fillSummary.skippedItems.length} items need your review</span>
                        </div>
                        <ScrollArea className="max-h-[200px]">
                          <div className="space-y-2">
                            {fillSummary.skippedItems.map((item, i) => (
                              <div key={i} className="pl-1">
                                <p className="text-xs font-medium text-amber-700/80 dark:text-amber-400/80">{item.sectionTitle}</p>
                                <p className="text-xs text-amber-700/60 dark:text-amber-400/60 truncate">{item.questionText || '(question)'}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    <button
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center gap-2 h-10 px-5 rounded-[10px] text-sm font-semibold text-white bg-gradient-to-br from-[#8649F1] to-[#2355A4] hover:opacity-90 transition-opacity shadow-md"
                    >
                      Back to checklist
                    </button>
                  </div>
                ) : autoFillMode ? (
                  /* Auto-fill analysis view */
                  <div className="flex-1 flex flex-col items-center justify-center px-8 min-h-[60vh]">
                    {analysisPhase === "analyzing" ? (
                      <>
                        <div className="mb-6 relative flex items-center justify-center w-20 h-20">
                          <div className="absolute -inset-4 luka-ambient-glow" />
                          <div className="relative flex items-center justify-center w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#8649F1] to-[#2355A4] z-10 luka-thinking-spin">
                            <LukaIcon size={24} />
                          </div>
                        </div>
                        <h2 className="text-lg font-semibold text-foreground mb-2 text-center">
                          Analyzing your {checklistLabel || "checklist"}…
                        </h2>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 luka-dot luka-dot-1" />
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 luka-dot luka-dot-2" />
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 luka-dot luka-dot-3" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="mb-5 flex items-center justify-center w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[#8649F1] to-[#2355A4]">
                          <LukaIcon size={22} />
                        </div>
                        {engagementLabel && (
                          <p className="text-xs font-medium text-muted-foreground mb-1 text-center tracking-wide uppercase">{engagementLabel}</p>
                        )}
                        <h2 className="text-lg font-semibold text-foreground mb-1 text-center">
                          {checklistLabel || "checklist"}
                        </h2>
                        <p className="text-sm text-muted-foreground text-center mb-5 max-w-[340px]">
                          Luka analyzed {(autoFillSources ?? []).length} connected source{(autoFillSources ?? []).length !== 1 ? "s" : ""} and found responses for <span className="font-semibold text-foreground">{Math.min(90, 60 + (autoFillSources ?? []).length * 10)}%</span> of fields.
                        </p>

                        {/* Sources */}
                        <div className="w-full max-w-[320px] rounded-[10px] border border-border bg-muted/30 px-4 py-3 mb-5 space-y-2">
                          {(autoFillSources ?? []).map(src => (
                            <div key={src} className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                              <span className="text-sm text-foreground">{src}</span>
                            </div>
                          ))}
                        </div>

                        {/* Related templates */}
                        <div className="w-full max-w-[320px] mb-6">
                          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Also fill related templates</p>
                          <div className="flex flex-wrap gap-2">
                            {RELATED_TEMPLATES.map(t => (
                              <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-border bg-background text-muted-foreground">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col items-center gap-2.5 w-full max-w-[320px]">
                          <button
                            onClick={() => { onAutoFillConfirmed?.(); onOpenChange(false); }}
                            className="w-full inline-flex items-center justify-center gap-2 h-10 px-5 rounded-[10px] text-sm font-semibold text-white bg-gradient-to-br from-[#8649F1] to-[#2355A4] hover:opacity-90 transition-opacity shadow-md"
                          >
                            <Zap className="h-4 w-4 text-white fill-white" strokeWidth={0} />
                            Auto-fill this checklist
                          </button>
                          <button
                            onClick={() => { onAutoFillAll?.(); }}
                            className="w-full inline-flex items-center justify-center gap-2 h-10 px-5 rounded-[10px] text-sm font-semibold border border-primary/40 text-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
                          >
                            <Zap className="h-4 w-4 shrink-0" />
                            Auto-fill all templates
                          </button>
                        </div>

                        <p className="text-xs text-muted-foreground mt-3 text-center max-w-[300px]">
                          Luka fills each field one by one with citations. Items requiring judgment stay flagged.
                        </p>
                      </>
                    )}
                  </div>
                ) : !sentMessage ? (
                  /* Welcome state */
                  <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-[60vh]">
                    {/* Luka logo icon */}
                    <div className="mb-8 relative flex items-center justify-center w-24 h-24">
                      <div className="absolute -inset-4 luka-ambient-glow" />
                      <div className="absolute inset-0 luka-ambient-orb opacity-20" />
                      <div className="relative flex items-center justify-center w-[52px] h-[52px] rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(265_80%_55%)] backdrop-blur-sm z-10 shadow-[0_0_30px_rgba(151,71,255,0.12)]">
                        <LukaIcon size={24} />
                      </div>
                    </div>

                    <h1 className="text-2xl font-semibold text-foreground mb-8 text-center">
                      How can I help you today?
                    </h1>

                    {/* Suggestion chips */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => handlePromptSelect(s.replace("#", ""))}
                          className="px-4 py-2 rounded-[10px] border border-border bg-background dark:bg-card text-sm text-foreground hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Chat messages */
                  <div className="px-6 py-4 space-y-4 min-w-0 max-w-full overflow-hidden">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%] px-4 py-3 rounded-[12px] bg-primary text-primary-foreground text-base">
                        {sentMessage}
                      </div>
                    </div>

                    {/* Unified Luka response container — icon stays in place */}
                    {(isThinking || aiResponse) && (
                      <div className="flex items-start gap-3 min-w-0 max-w-full">
                        <div className={cn(
                          "w-9 h-9 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(265_80%_55%)] flex items-center justify-center shrink-0",
                          isThinking && "luka-thinking-spin"
                        )}>
                          <LukaIcon size={16} />
                        </div>
                        <div className="flex-1 pt-1.5 min-h-[28px] min-w-0 overflow-x-auto">
                          {isThinking ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground luka-thinking-text">
                                Thinking
                              </span>
                              <span className="flex gap-0.5">
                                <span className="w-1 h-1 rounded-full bg-primary/60 luka-dot luka-dot-1" />
                                <span className="w-1 h-1 rounded-full bg-primary/60 luka-dot luka-dot-2" />
                                <span className="w-1 h-1 rounded-full bg-primary/60 luka-dot luka-dot-3" />
                              </span>
                            </div>
                          ) : richResponseType === "gross-margin" ? (
                            <>
                              <GrossMarginResponse revealStep={revealStep} />
                              {revealStep >= 5 && <LukaResponseActions />}
                            </>
                          ) : richResponseType === "tb-gifi" ? (
                            <>
                              <TrialBalanceGIFIResponse revealStep={revealStep} />
                              {revealStep >= 5 && <LukaResponseActions />}
                            </>
                          ) : (
                            <>
                              <div className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                                {displayedResponse}
                                {isStreaming && (
                                  <span className="inline-block w-0.5 h-4 bg-primary/70 ml-0.5 align-middle luka-thinking-text" />
                                )}
                              </div>
                              {!isStreaming && aiResponse && <LukaResponseActions />}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Chat Input - pinned to bottom; hidden in auto-fill and summary modes */}
              {!autoFillMode && !summaryMode && <div className={cn("pb-6 pt-2", viewMode === "full" ? "px-12" : "px-6")}>
                <div className={cn("w-full mx-auto relative", viewMode === "full" ? "max-w-none" : "max-w-[700px]")}>
                  {/* Prompt Picker */}
                  <PromptPicker
                    open={showPromptPicker}
                    filter={hashFilter}
                    onSelect={handlePromptSelect}
                    onClose={() => { setShowPromptPicker(false); setHashFilter(""); }}
                  />

                  <div className="border border-border rounded-[12px] overflow-visible bg-background dark:bg-card hover:border-primary/30 transition-all duration-200 luka-gradient-border relative">
                    {/* Attached files bar */}
                    <AttachedFilesBar files={attachedFiles} onRemove={removeFile} onClearAll={clearFiles} />

                    <div className="px-4 pt-3 pb-2">
                      {/* Render input with blue # styling */}
                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={message}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Type # for prompts or just ask anything..."
                          className={cn(
                            "w-full bg-transparent h-9 placeholder:text-muted-foreground/70 outline-none border-none text-sm",
                            message.includes("#") ? "text-primary font-medium" : "text-foreground"
                          )}
                        />
                      </div>
                    </div>

                    {/* Bottom toolbar */}
                    <div className="px-3 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <LukaAttachMenu onFilesAdded={addFiles} />
                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-[10px]">
                          <Inbox className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <div className="flex items-center gap-1.5 px-3 h-9 rounded-[10px] border border-border bg-background dark:bg-muted/20 text-sm text-foreground">
                          <span className="text-amber-500">✨</span>
                          <span className="text-sm font-medium">Gemini 3 Flash</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[10px]" onClick={() => setVoiceOpen(true)}>
                          <Mic className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          size="icon"
                          className={cn(
                            "h-9 w-9 rounded-full transition-all duration-200",
                            message.trim()
                              ? "bg-gradient-to-br from-[#8649F1] to-[#2355A4] hover:opacity-90 text-white shadow-md"
                              : "bg-muted hover:bg-muted/80 text-muted-foreground"
                          )}
                          onClick={handleSend}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Voice Recording Overlay */}
                  <VoiceRecordingOverlay
                    open={voiceOpen}
                    onClose={() => setVoiceOpen(false)}
                    onComplete={(text) => setMessage((prev) => (prev ? prev + " " + text : text))}
                  />
                </div>
              </div>}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
