import { useState, useRef, useCallback } from "react";
import { X, Mic, Plus, Search, MessageCircle, Minus, Send, FolderOpen, Maximize2, ChevronLeft, ChevronRight, Clock, PanelLeftClose, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PromptPicker } from "@/components/luka/PromptPicker";
import { LukaThinkingMessage } from "@/components/luka/LukaThinkingMessage";

interface AskLukaOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

/* Luka bolt icon SVG as a reusable element */
function LukaBoltIcon({ size = 24 }: { size?: number }) {
  const h = Math.round(size * (26 / 23));
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={h} viewBox="0 0 23 26" fill="none">
      <path d="M14.7852 10.1758H20.5852C21.0627 10.2128 22.4952 10.3791 22.8679 11.1001C23.1474 11.6362 22.8446 12.3663 22.1342 12.9486C17.2775 16.9508 12.4325 20.9622 7.57591 24.9644C7.15663 25.0753 6.88876 25.0753 6.77229 24.9644C6.53936 24.7518 6.86546 24.1418 7.7739 23.1158C11.2679 19.7237 14.7619 16.3408 18.2559 12.9486L8.30964 10.1758H14.7735H14.7852Z" fill="url(#bolt_g1)" />
      <path d="M8.1918 14.8718H2.38763C1.90978 14.8348 0.476215 14.6684 0.103256 13.9475C-0.176463 13.4114 0.126566 12.6812 0.837519 12.0989C5.68599 8.08751 10.5461 4.08535 15.3946 0.0831858C15.8142 -0.0277286 16.0822 -0.0277286 16.1988 0.0831858C16.4319 0.295772 16.1055 0.905801 15.1964 1.93176C11.6999 5.32389 8.20346 8.70678 4.70697 12.0989L14.6603 14.8718H8.1918Z" fill="url(#bolt_g2)" />
      <defs>
        <linearGradient id="bolt_g1" x1="10.544" y1="12.8935" x2="13.5519" y2="22.6018" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9747FF" /><stop offset="1" stopColor="#1C63A6" />
        </linearGradient>
        <linearGradient id="bolt_g2" x1="15.4787" y1="0" x2="9.64532" y2="31.4017" gradientUnits="userSpaceOnUse">
          <stop offset="0.165" stopColor="#9747FF" /><stop offset="0.783" stopColor="#1C63A6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AskLukaOverlay({ open, onOpenChange }: AskLukaOverlayProps) {
  const [message, setMessage] = useState("");
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
  const inputRef = useRef<HTMLInputElement>(null);

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

    // Simulate AI response after delay
    setTimeout(() => {
      setIsThinking(false);
      setAiResponse(`Here's an overview of **${promptLabel}** with key insights and analysis. This is a simulated response demonstrating the thinking animation flow.`);
    }, 3000);
  }, []);

  const handleSend = useCallback(() => {
    if (!message.trim()) return;
    const msg = message.trim();
    setMessage("");
    setShowPromptPicker(false);
    setSentMessage(msg);
    setIsThinking(true);
    setAiResponse(null);

    setTimeout(() => {
      setIsThinking(false);
      setAiResponse(`Here's my response to "${msg}". This is a simulated response.`);
    }, 3000);
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
          "animate-in slide-in-from-top duration-300 ease-out",
          viewMode === "full"
            ? "left-14 rounded-tl-[1.25rem] rounded-bl-[1.25rem]"
            : "left-[45%] rounded-tl-[1.25rem] rounded-bl-[1.25rem] shadow-[-8px_0_30px_-10px_hsl(var(--primary)/0.15)] border-l border-border"
        )}
      >
        <div className="flex h-full">
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
                        <LukaBoltIcon size={18} />
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
                        <MessageCircle className="h-3.5 w-3.5" />
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
                        <FolderOpen className="h-3.5 w-3.5" />
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
                      className="text-sm font-semibold text-primary hover:underline"
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
                          <MessageCircle className={cn("h-5 w-5", activeTab === "threads" ? "text-primary" : "text-muted-foreground")} />
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
                          <FolderOpen className={cn("h-5 w-5", activeTab === "workspaces" ? "text-primary" : "text-muted-foreground")} />
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
                              <MessageCircle className="h-4 w-4 text-muted-foreground" />
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
          <main className="flex-1 flex flex-col bg-gradient-to-b from-[hsl(210_60%_97%)] via-[hsl(260_40%_96%)] to-[hsl(300_30%_96%)] dark:from-[hsl(220_20%_12%)] dark:via-[hsl(260_15%_14%)] dark:to-[hsl(280_10%_13%)]">
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

            {/* Center welcome content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {/* Luka logo icon */}
              <div className="mb-8 relative flex items-center justify-center w-24 h-24">
                <div className="absolute -inset-4 luka-ambient-glow" />
                <div className="absolute inset-0 luka-ambient-orb opacity-20" />
                <div className="relative flex items-center justify-center w-[52px] h-[52px] rounded-full bg-background/90 dark:bg-card/90 backdrop-blur-sm z-10 shadow-[0_0_30px_rgba(151,71,255,0.12)]">
                  <LukaBoltIcon size={24} />
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
                    className="px-4 py-2 rounded-[10px] border border-border bg-background dark:bg-card text-sm text-foreground hover:bg-muted/60 dark:hover:bg-muted/30 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="w-full max-w-[700px]">
                <div className="border border-border rounded-[10px] overflow-visible bg-background dark:bg-card hover:border-primary/30 transition-all duration-200 luka-gradient-border relative">
                  <div className="px-4 pt-3 pb-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type # for prompts or just ask anything..."
                      className="w-full bg-transparent h-9 text-foreground placeholder:text-muted-foreground/70 outline-none border-none text-sm"
                    />
                  </div>

                  {/* Bottom toolbar */}
                  <div className="px-3 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-[10px]">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-[10px]">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <div className="flex items-center gap-1.5 px-3 h-9 rounded-[10px] border border-border bg-background dark:bg-muted/20 text-sm text-foreground">
                        <span className="text-amber-500">✨</span>
                        <span className="text-sm font-medium">Gemini 3 Flash</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[10px]">
                        <Mic className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button size="icon" className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
