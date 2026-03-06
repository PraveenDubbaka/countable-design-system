import { useState } from "react";
import { X, Mic, Plus, Hash, Search, Settings, MessageCircle, Minus, Send, Zap, FolderOpen, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface AskLukaOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export function AskLukaOverlay({ open, onOpenChange }: AskLukaOverlayProps) {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"threads" | "workspaces">("threads");
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [viewMode, setViewMode] = useState<"full" | "half">("full");

  if (!open) return null;

  return (
    <>
      {/* Backdrop for half mode - allows seeing page behind */}
      {viewMode === "half" && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 bg-background overflow-hidden",
          "animate-in slide-in-from-top duration-300 ease-out",
          viewMode === "full"
            ? "left-14 rounded-tl-[1.25rem] rounded-bl-[1.25rem]"
            : "left-[45%] rounded-tl-[1.25rem] rounded-bl-[1.25rem] shadow-[-8px_0_30px_-10px_hsl(var(--primary)/0.15)] border-l border-border"
        )}>
      
      <div className="flex h-full">
        {/* Left Sidebar */}
        <aside className="w-[260px] border-r border-border flex flex-col bg-background">
          {/* Logo + Tabs */}
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="26" viewBox="0 0 23 26" fill="none">
              <path d="M14.7852 10.1758H20.5852C21.0627 10.2128 22.4952 10.3791 22.8679 11.1001C23.1474 11.6362 22.8446 12.3663 22.1342 12.9486C17.2775 16.9508 12.4325 20.9622 7.57591 24.9644C7.15663 25.0753 6.88876 25.0753 6.77229 24.9644C6.53936 24.7518 6.86546 24.1418 7.7739 23.1158C11.2679 19.7237 14.7619 16.3408 18.2559 12.9486L8.30964 10.1758H14.7735H14.7852Z" fill="url(#paint0_linear_34_10)" />
              <path d="M8.1918 14.8718H2.38763C1.90978 14.8348 0.476215 14.6684 0.103256 13.9475C-0.176463 13.4114 0.126566 12.6812 0.837519 12.0989C5.68599 8.08751 10.5461 4.08535 15.3946 0.0831858C15.8142 -0.0277286 16.0822 -0.0277286 16.1988 0.0831858C16.4319 0.295772 16.1055 0.905801 15.1964 1.93176C11.6999 5.32389 8.20346 8.70678 4.70697 12.0989L14.6603 14.8718H8.1918Z" fill="url(#paint1_linear_34_10)" />
              <defs>
                <linearGradient id="paint0_linear_34_10" x1="10.544" y1="12.8935" x2="13.5519" y2="22.6018" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#9747FF" /><stop offset="1" stopColor="#1C63A6" />
                </linearGradient>
                <linearGradient id="paint1_linear_34_10" x1="15.4787" y1="-2.01052e-07" x2="9.64532" y2="31.4017" gradientUnits="userSpaceOnUse">
                  <stop offset="0.165297" stopColor="#9747FF" /><stop offset="0.783358" stopColor="#1C63A6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="16" viewBox="0 0 80 20" fill="none">
                <path d="M0.601562 0.683594H4.31641V15.7422H14.9688V19H0.601562V0.683594ZM17.8867 0.683594H21.6016V10.7734C21.6016 11.6016 21.7148 12.3398 21.9414 12.9883C22.168 13.6289 22.5039 14.1719 22.9492 14.6172C23.4023 15.0625 23.9609 15.4023 24.625 15.6367C25.2891 15.8633 26.0625 15.9766 26.9453 15.9766C27.8203 15.9766 28.5898 15.8633 29.2539 15.6367C29.9258 15.4023 30.4844 15.0625 30.9297 14.6172C31.3828 14.1719 31.7227 13.6289 31.9492 12.9883C32.1758 12.3398 32.2891 11.6016 32.2891 10.7734V0.683594H36.0039V11.2188C36.0039 12.4219 35.8008 13.5156 35.3945 14.5C34.9883 15.4844 34.3984 16.3281 33.625 17.0312C32.8516 17.7344 31.9023 18.2773 30.7773 18.6602C29.6602 19.043 28.3828 19.2344 26.9453 19.2344C25.5078 19.2344 24.2266 19.043 23.1016 18.6602C21.9844 18.2773 21.0391 17.7344 20.2656 17.0312C19.4922 16.3281 18.9023 15.4844 18.4961 14.5C18.0898 13.5156 17.8867 12.4219 17.8867 11.2188V0.683594ZM40.5391 0.683594H44.2539V10.1641L53.9219 0.683594H58.6797L49.6562 9.42578L58.6797 19H53.7344L46.9844 12.0156L44.2539 14.6523V19H40.5391V0.683594ZM66.7539 0.683594H70.6914L79.5508 19H75.6484L74.1836 15.918H63.4844L62.0664 19H58.1523L66.7539 0.683594ZM72.7188 12.8594L68.7578 4.53906L64.9023 12.8594H72.7188Z" fill="url(#paint0_linear_26_3)" />
                <defs>
                  <linearGradient id="paint0_linear_26_3" x1="-2" y1="10" x2="80" y2="10" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9747FF" /><stop offset="1" stopColor="#1C63A6" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Tabs */}
              <div className="flex items-center gap-1 mt-1">
                <button
                  onClick={() => setActiveTab("threads")}
                  className={cn(
                    "text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-colors",
                    activeTab === "threads"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}>
                  Threads
                </button>
                <button
                  onClick={() => setActiveTab("workspaces")}
                  className={cn(
                    "text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-colors",
                    activeTab === "workspaces"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}>
                  Workspaces
                </button>
              </div>
            </div>
          </div>

          {/* Search + New Thread */}
          <div className="px-3 pb-3 pt-1 flex items-center gap-2">
            <div className="relative flex items-center h-9 flex-1 rounded-[10px] border border-[#dcdfe4] dark:border-[hsl(220_15%_30%)] bg-white dark:bg-card hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)] transition-all duration-200 input-double-border">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search"
                className="h-full w-full bg-transparent pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none border-none" />
            </div>
            <Button size="icon" className="h-9 w-9 shrink-0 rounded-[10px] bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Pinned Section */}
          <div className="px-4 pb-1 pt-1">
            <span className="text-xs font-semibold text-primary">Pinned</span>
          </div>
          <ScrollArea className="flex-1 px-1">
            <div className="pb-2">
              {pinnedThreads.map((thread) => (
                <button
                  key={thread.id}
                  className="w-full flex items-center px-3 py-1.5 text-left hover:bg-muted/60 rounded-lg transition-colors">
                  <span className="text-sm text-foreground truncate">{thread.name}</span>
                </button>
              ))}
            </div>

            {/* Recent Section */}
            <div className="px-3 pb-1 pt-2">
              <span className="text-xs font-semibold text-primary">Recent</span>
            </div>
            <div className="pb-2">
              {recentThreads.map((thread) => (
                <button
                  key={thread.id}
                  className="w-full flex items-center px-3 py-1.5 text-left hover:bg-muted/60 rounded-lg transition-colors">
                  <span className="text-sm text-foreground truncate">{thread.name}</span>
                </button>
              ))}
            </div>

            {/* Show More */}
            <div className="px-3 pb-3">
              <button
                onClick={() => setShowAllRecent(!showAllRecent)}
                className="text-xs font-semibold text-primary hover:underline">
                Show More
              </button>
            </div>
          </ScrollArea>

          {/* Settings at bottom */}
          <div className="px-3 pb-3 pt-2">
            <button className="w-full flex items-center px-3 py-2 hover:bg-muted/60 transition-colors bg-primary/10 rounded-md gap-0">
              <Settings className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary mx-[8px]">Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-background">
          {/* Top right controls */}
          <div className="h-12 px-4 flex items-center justify-end gap-1">
            <TooltipProvider delayDuration={200}>
              {/* Half-screen mode */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", viewMode === "half" && "bg-muted")}
                    onClick={() => setViewMode("half")}>
                    <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="18" rx="2" />
                      <line x1="12" y1="3" x2="12" y2="21" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Half Mode</p></TooltipContent>
              </Tooltip>
              {/* Full-screen mode */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-8 w-8", viewMode === "full" && "bg-muted")}
                    onClick={() => setViewMode("full")}>
                    <Maximize2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Full Mode</p></TooltipContent>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onOpenChange(false)}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p>Close</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Center welcome content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Lightning bolt icon */}
            <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-full border-2 border-primary/30">
              <Zap className="h-7 w-7 text-primary/60" />
            </div>

            <h1 className="text-2xl font-semibold text-foreground mb-8 text-center">
              How can I help you today?
            </h1>

            {/* Suggestion chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {suggestions.map((s) => (
                <button
                  key={s}
                  className="px-4 py-2 rounded-[10px] border border-border bg-background text-sm text-foreground hover:bg-muted/60 transition-colors">
                  {s}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="w-full max-w-[700px]">
              <div className="border border-[#dcdfe4] dark:border-[hsl(220_15%_30%)] rounded-[10px] overflow-hidden bg-background hover:border-[hsl(210_25%_75%)] dark:hover:border-[hsl(220_15%_40%)] transition-all duration-200 input-double-border">
                {/* Input field */}
                <div className="px-4 pt-3 pb-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type # for prompts or just ask anything..."
                    className="w-full bg-transparent h-9 text-foreground placeholder:text-muted-foreground/70 outline-none border-none text-sm" />
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
                    {/* Model badge */}
                    <div className="flex items-center gap-1.5 px-3 h-9 rounded-[10px] border border-border bg-background text-sm text-foreground">
                      <span className="text-amber-500">✨</span>
                      <span className="text-sm font-medium">Gemini 3 Flash</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-[10px]">
                      <Mic className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground">
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
