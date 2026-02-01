import { useState } from "react";
import { X, Sparkles, Mic, Send, Hash, Download, Globe, AtSign, FolderOpen, Link2, ChevronDown, ChevronLeft, FileText, BarChart2, TrendingUp, ListChecks, Layers, Sun, Lock, Settings, MessageSquare, HelpCircle, Cog, History, LayoutDashboard, Wrench, Search, Filter, Plus, Clock, Building2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AskLukaOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Luka overlay sidebar icons
const lukaSidebarItems = [
  { icon: History, label: "History", active: false },
  { icon: MessageSquare, label: "Chat", active: true },
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Wrench, label: "Tools", active: false },
];

// Workspace data matching screenshot
const workspaceData = [
  { name: "Test Company Inc.", id: "ABC-2824-2089", date: "Dec 2024", status: "Not Started", progress: 0, starred: true, time: "13m ago", statusIcon: Clock, selected: true },
  { name: "XYZ Holdings Ltd", id: "XYZ-HOLD-2824", date: "Dec 2024", status: "Not Started", progress: 25, starred: false, time: "2h ago", statusIcon: Clock },
  { name: "Smith & Associates", id: "SMITH-2824", date: "Nov 2024", status: "Complete", progress: 100, starred: true, time: "1d ago", statusIcon: CheckCircle2 },
  { name: "TechStart Inc", id: "TECH-2824", date: "Dec 2024", status: "Blocked", progress: 45, starred: false, time: "5h ago", statusIcon: AlertCircle },
  { name: "Global Imports Co", id: "GLOBAL-2824", date: "Dec 2024", status: "In Progress", progress: 80, starred: false, time: "3h ago", statusIcon: Loader2 },
];

export function AskLukaOverlay({ open, onOpenChange }: AskLukaOverlayProps) {
  const [message, setMessage] = useState("");

  if (!open) return null;

  const promptIcons = [
    { icon: FileText, label: "Documents" },
    { icon: BarChart2, label: "Analytics" },
    { icon: TrendingUp, label: "Trends" },
    { icon: ListChecks, label: "Checklists" },
    { icon: FileText, label: "Reports" },
    { icon: Layers, label: "Layers" },
  ];

  const activeTags = [
    { label: "4 APIs", icon: Sparkles, color: "bg-primary text-primary-foreground" },
    { label: "Prior Year Files", icon: Clock, color: "bg-amber-500 text-white" },
    { label: "Firm Knowledge Base", icon: FileText, color: "bg-emerald-600 text-white" },
  ];

  const bottomIcons = [
    { icon: Hash, label: "Tags", badge: "2" },
    { icon: Download, label: "Download" },
    { icon: Globe, label: "Web" },
    { icon: AtSign, label: "Mention" },
    { icon: FolderOpen, label: "Files", badge: "1" },
    { icon: Link2, label: "Link" },
  ];

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "fixed top-0 right-0 bottom-0 left-14 z-50 bg-background",
          "animate-in slide-in-from-top duration-300 ease-out"
        )}
      >
        <div className="flex h-full">
          {/* Luka-specific icon sidebar */}
          <aside className="w-14 flex flex-col items-center py-4 border-r border-border bg-muted/30">
            {lukaSidebarItems.map((item, idx) => (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-9 w-9 rounded-xl mb-2",
                      item.active && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
            
            {/* Spacer */}
            <div className="flex-1" />
            
            {/* Bottom icons */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl mb-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </aside>

          {/* Main overlay content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-background">
              {/* Left - Logo and title */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[#7A31D8] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold leading-tight">Luka</h1>
                  <p className="text-xs text-muted-foreground">Workspaces</p>
                </div>
              </div>

              {/* Right - Controls */}
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" className="h-9 gap-2 rounded-full bg-primary hover:bg-primary/90 px-4">
                  <Sparkles className="h-4 w-4" />
                  Autonomous
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
                <Button variant="ghost" size="sm" className="h-9 gap-2 px-3">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                  <Sparkles className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-[9px] text-white flex items-center justify-center font-medium">2</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Cog className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
              {/* Workspaces Sidebar */}
              <aside className="w-[340px] border-r border-border flex flex-col bg-background">
                {/* Workspaces Header */}
                <div className="h-12 px-4 flex items-center justify-between border-b border-border">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-sm">Workspaces</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Search */}
                <div className="p-4 pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by name, ID, member..." 
                      className="h-9 pl-9 bg-background border-2 border-[hsl(210_20%_85%)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:border-[hsl(207_71%_38%)] focus:ring-1 focus:ring-[hsl(207_71%_38%/0.3)]"
                      style={{ borderRadius: '12px' }}
                    />
                  </div>
                </div>

                {/* Filter buttons */}
                <div className="px-4 pb-3 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9 gap-2 border-2 border-[hsl(210_20%_85%)]" style={{ borderRadius: '12px' }}>
                    <span className="text-amber-500">★</span>
                    Starred (2)
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 border-2 border-[hsl(210_20%_85%)]" style={{ borderRadius: '12px' }}>
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="h-9 gap-1.5 ml-auto bg-primary hover:bg-primary/90 px-4" style={{ borderRadius: '12px' }}>
                    <Plus className="h-4 w-4" />
                    New
                  </Button>
                </div>

                {/* Workspace list */}
                <ScrollArea className="flex-1 px-4">
                  {workspaceData.map((workspace, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "p-3 rounded-xl border mb-2 cursor-pointer transition-colors",
                        workspace.selected 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : "border-border hover:border-muted-foreground/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{workspace.name}</span>
                            {workspace.starred && <span className="text-amber-500 text-sm">★</span>}
                            <workspace.statusIcon className={cn(
                              "h-4 w-4 ml-auto flex-shrink-0",
                              workspace.status === "Complete" ? "text-emerald-500" :
                              workspace.status === "Blocked" ? "text-destructive" :
                              workspace.status === "In Progress" ? "text-primary" :
                              "text-amber-500"
                            )} />
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 rounded bg-slate-700 text-slate-200 font-normal">
                              {workspace.id}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{workspace.date}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className={cn(
                              "text-xs font-medium",
                              workspace.status === "Complete" ? "text-emerald-600" :
                              workspace.status === "Blocked" ? "text-destructive" :
                              workspace.status === "In Progress" ? "text-primary" :
                              "text-amber-600"
                            )}>
                              {workspace.status}
                            </span>
                            <span className="text-xs text-muted-foreground">{workspace.progress}%</span>
                          </div>
                          <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all",
                                workspace.status === "Complete" ? "bg-emerald-500" :
                                workspace.status === "Blocked" ? "bg-destructive" :
                                workspace.status === "In Progress" ? "bg-primary" :
                                "bg-amber-500"
                              )}
                              style={{ width: `${workspace.progress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-end mt-2 gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{workspace.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </aside>

              {/* Main chat area */}
              <main className="flex-1 flex flex-col bg-[hsl(var(--muted))]">
                {/* Top bar */}
                <div className="h-12 px-6 flex items-center justify-end gap-2 border-b border-border bg-background">
                  <Button variant="ghost" size="sm" className="h-9 gap-2 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Unlock
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>

                {/* Chat content */}
                <ScrollArea className="flex-1 p-6">
                  <div className="max-w-3xl mx-auto">
                    {/* AI Message */}
                    <div className="flex gap-4 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#7A31D8] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 bg-card rounded-2xl p-4 shadow-sm border border-border">
                        <p className="text-sm">
                          👋 Hi! I'm ready to prepare <strong>Test Company Inc.</strong> for compilation.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Let's get started — I'll guide you through setup, then handle the rest autonomously.
                        </p>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="h-9 gap-2 border-2 border-[hsl(210_20%_85%)]" style={{ borderRadius: '12px' }}>
                            <Sparkles className="h-4 w-4" />
                            Let's begin
                          </Button>
                          <Button variant="outline" size="sm" className="h-9 gap-2 border-2 border-[hsl(210_20%_85%)]" style={{ borderRadius: '12px' }}>
                            <Settings className="h-4 w-4" />
                            Configure settings first
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* Input area */}
                <div className="border-t border-border p-4 bg-background">
                  <div className="max-w-3xl mx-auto">
                    {/* Prompt icons */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-muted-foreground">Prompts:</span>
                      <div className="flex gap-0.5">
                        {promptIcons.map((item, idx) => (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{item.label}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>

                    {/* Active tags */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-muted-foreground">Active:</span>
                      <div className="flex gap-2 flex-wrap">
                        {activeTags.map((tag, idx) => (
                          <Badge key={idx} className={cn("h-7 gap-1.5 pr-1.5 pl-2.5 rounded-full text-xs font-medium", tag.color)}>
                            <tag.icon className="h-3.5 w-3.5" />
                            {tag.label}
                            <button className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        <Badge variant="outline" className="h-7 rounded-full text-xs text-muted-foreground border-border">
                          +1 more
                        </Badge>
                      </div>
                    </div>

                    {/* Input field */}
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" className="h-9 w-9 border-2 border-[hsl(210_20%_85%)] flex-shrink-0" style={{ borderRadius: '12px' }}>
                        <Plus className="h-5 w-5" />
                      </Button>
                      <div className="flex-1 relative">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Ask Luka anything..."
                          className="h-11 pr-24 border-2 border-[hsl(210_20%_85%)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] bg-background text-sm focus:border-[hsl(207_71%_38%)] focus:ring-1 focus:ring-[hsl(207_71%_38%/0.3)]"
                          style={{ borderRadius: '12px' }}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-9 w-9" style={{ borderRadius: '12px' }}>
                            <Mic className="h-5 w-5 text-muted-foreground" />
                          </Button>
                          <Button 
                            size="icon" 
                            className="h-9 w-9 bg-gradient-to-r from-primary to-[#7A31D8] hover:opacity-90"
                            style={{ borderRadius: '12px' }}
                          >
                            <Send className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom toolbar */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9 gap-2 border-2 border-[hsl(210_20%_85%)] px-3" style={{ borderRadius: '12px' }}>
                          <Sparkles className="h-4 w-4 text-primary" />
                          Gemini 3
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 gap-2 border-2 border-[hsl(210_20%_85%)] px-3" style={{ borderRadius: '12px' }}>
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          Default
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {bottomIcons.map((item, idx) => (
                          <Tooltip key={idx}>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                                {item.badge && (
                                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[9px] text-white flex items-center justify-center font-medium">
                                    {item.badge}
                                  </span>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{item.label}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
