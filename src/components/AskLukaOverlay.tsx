import { useState } from "react";
import { X, Sparkles, Mic, Send, Hash, Download, Globe, AtSign, FolderOpen, Link2, ChevronDown, FileText, BarChart2, TrendingUp, ListChecks, Layers, Sun, Unlock, Settings, MessageSquare, HelpCircle, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AskLukaOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
    { label: "Prior Year Files", icon: FolderOpen, color: "bg-amber-500 text-white" },
    { label: "Firm Knowledge Base", icon: FileText, color: "bg-emerald-600 text-white" },
  ];

  const bottomIcons = [
    { icon: Hash, label: "Tags" },
    { icon: Download, label: "Download" },
    { icon: Globe, label: "Web" },
    { icon: AtSign, label: "Mention" },
    { icon: FolderOpen, label: "Files" },
    { icon: Link2, label: "Link" },
  ];

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-background",
        "animate-in slide-in-from-top duration-300 ease-out"
      )}
    >
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-border">
        {/* Left - Logo and title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[#7A31D8] flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold">Luka</h1>
            <p className="text-xs text-muted-foreground">Workspaces</p>
          </div>
        </div>

        {/* Right - Controls */}
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" className="gap-2 rounded-full bg-primary hover:bg-primary/90">
            <Sparkles className="h-4 w-4" />
            Autonomous
            <ChevronDown className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Sparkles className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-[9px] text-white flex items-center justify-center font-medium">2</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Cog className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <aside className="w-80 border-r border-border flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Workspaces</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronDown className="h-4 w-4 rotate-180" />
            </Button>
          </div>
          
          <div className="p-4">
            <Input 
              placeholder="Search by name, ID, member..." 
              className="h-10 rounded-xl"
            />
          </div>

          <div className="px-4 pb-3 flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <span className="text-amber-500">★</span>
              Starred (2)
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="sm" className="gap-2 rounded-full ml-auto bg-primary hover:bg-primary/90">
              <span>+</span>
              New
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4">
            {/* Sample workspace cards */}
            {[
              { name: "Test Company Inc.", id: "ABC-2824-2089", date: "Dec 2024", status: "Not Started", progress: 0, starred: true, time: "Just now" },
              { name: "XYZ Holdings Ltd", id: "XYZ-HOLD-2825", date: "Dec 2024", status: "Not Started", progress: 25, starred: false, time: "2h ago" },
              { name: "Smith & Associates", id: "SMITH-2824", date: "Nov 2024", status: "Complete", progress: 100, starred: true, time: "1d ago" },
              { name: "TechStart Inc", id: "TECH-2824", date: "Dec 2024", status: "Blocked", progress: 45, starred: false, time: "5h ago" },
            ].map((workspace, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-4 rounded-xl border mb-3 cursor-pointer transition-colors",
                  idx === 0 ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{workspace.name}</span>
                      {workspace.starred && <span className="text-amber-500">★</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 rounded-md bg-muted/80">
                        {workspace.id}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{workspace.date}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={cn(
                        "text-xs font-medium",
                        workspace.status === "Complete" ? "text-emerald-600" :
                        workspace.status === "Blocked" ? "text-destructive" :
                        "text-amber-600"
                      )}>
                        {workspace.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{workspace.progress}%</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          workspace.status === "Complete" ? "bg-emerald-500" :
                          workspace.status === "Blocked" ? "bg-destructive" :
                          "bg-primary"
                        )}
                        style={{ width: `${workspace.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-end mt-2 text-xs text-muted-foreground">
                      <span>⏱ {workspace.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="h-12 px-6 flex items-center justify-end gap-3 border-b border-border">
            <Button variant="ghost" size="sm" className="gap-2">
              <Unlock className="h-4 w-4" />
              Unlock
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Sun className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FolderOpen className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat content */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              {/* AI Message */}
              <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-[#7A31D8] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 bg-muted/50 rounded-2xl p-4">
                  <p className="text-sm">
                    👋 Hi! I'm ready to prepare <strong>Test Company Inc.</strong> for compilation.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Let's get started — I'll guide you through setup, then handle the rest autonomously.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="rounded-full gap-2">
                      <Sparkles className="h-4 w-4" />
                      Let's begin
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full gap-2">
                      <Settings className="h-4 w-4" />
                      Configure settings first
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="border-t border-border p-4">
            <div className="max-w-3xl mx-auto">
              {/* Prompt icons */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-muted-foreground">Prompts:</span>
                <div className="flex gap-1">
                  {promptIcons.map((item, idx) => (
                    <Button key={idx} variant="ghost" size="icon" className="h-8 w-8">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Active tags */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-muted-foreground">Active:</span>
                <div className="flex gap-2">
                  {activeTags.map((tag, idx) => (
                    <Badge key={idx} className={cn("gap-1.5 pr-1", tag.color)}>
                      <tag.icon className="h-3 w-3" />
                      {tag.label}
                      <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 hover:bg-white/20 rounded-full p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  <Badge variant="outline" className="text-muted-foreground">
                    +1 more
                  </Badge>
                </div>
              </div>

              {/* Input field */}
              <div className="relative flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                  <span className="text-xl">+</span>
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask Luka anything..."
                    className="h-12 pr-24 rounded-full border-2"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mic className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-[#7A31D8]"
                    >
                      <Send className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bottom toolbar */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Gemini 3
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 rounded-full">
                    <FileText className="h-4 w-4" />
                    Default
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  {bottomIcons.map((item, idx) => (
                    <Button key={idx} variant="ghost" size="icon" className="h-8 w-8 relative">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      {idx === 4 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[9px] text-white flex items-center justify-center font-medium">2</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
