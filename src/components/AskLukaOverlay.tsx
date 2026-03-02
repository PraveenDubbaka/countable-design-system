import { useState } from "react";
import { X, Mic, Plus, Hash, AtSign, Search, Settings, Sparkles, MessageCircle, ExternalLink, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import lukaLogo from "@/assets/luka-logo.png";

interface AskLukaOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const recentThreads = [
  { id: 1, name: "testing without TB- Ritesh", icon: "pin" },
  { id: 2, name: "testing-1 QBO", icon: "pin" },
  { id: 3, name: "quick test", icon: "pin" },
  { id: 4, name: "Trial Balance by GIFI", icon: "chat" },
  { id: 5, name: "Checklist Upload", icon: "chat" },
  { id: 6, name: "Checklist Upload", icon: "chat" },
  { id: 7, name: "Emerging Trends in Mod...", icon: "chat" },
  { id: 8, name: "Checklist Upload", icon: "chat" },
  { id: 9, name: "Preparing an Investment ...", icon: "chat" },
  { id: 10, name: "Checklist Upload", icon: "chat" },
  { id: 11, name: "Capital Asset Amortizatio...", icon: "chat" },
];

export function AskLukaOverlay({ open, onOpenChange }: AskLukaOverlayProps) {
  const [message, setMessage] = useState("");

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed top-0 right-0 bottom-0 left-14 z-50 bg-background",
        "animate-in slide-in-from-top duration-300 ease-out"
      )}
    >
      <div className="flex h-full">
        {/* Left Sidebar */}
        <aside className="w-[220px] border-r border-border flex flex-col bg-background">
          {/* Logo */}
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-base font-bold tracking-tight text-foreground">LUKA</span>
          </div>

          {/* New Thread Button */}
          <div className="px-3 pb-3">
            <Button className="w-full h-9 gap-2 rounded-[10px] bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm">
              <Plus className="h-4 w-4" />
              New Thread
            </Button>
          </div>

          {/* Search */}
          <div className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="h-9 pl-9 input-double-border text-sm"
              />
            </div>
          </div>

          {/* Recents Label */}
          <div className="px-4 pb-2">
            <span className="text-xs font-semibold text-foreground">Recents</span>
          </div>

          {/* Thread List */}
          <ScrollArea className="flex-1 px-1">
            {recentThreads.map((thread) => (
              <button
                key={thread.id}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-muted/60 rounded-lg transition-colors"
              >
                {thread.icon === "pin" ? (
                  <svg className="h-4 w-4 text-muted-foreground flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 1v6M5 3.5h6l-1 4H6l-1-4zM8 9.5v5M5.5 14.5h5" />
                  </svg>
                ) : (
                  <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className="text-sm text-foreground truncate">{thread.name}</span>
              </button>
            ))}
          </ScrollArea>

          {/* Settings at bottom */}
          <div className="px-1 pb-3 pt-2">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-muted/60 rounded-lg transition-colors bg-primary/10">
              <Settings className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-background">
          {/* Top right controls */}
          <div className="h-12 px-4 flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Minus className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Center welcome content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <h1 className="text-xl font-medium text-muted-foreground mb-8 text-center">
              Hey! <span className="text-foreground font-semibold">CAN Angular</span>, welcome to the world of light speed engagements
            </h1>

            {/* Chat Input */}
            <div className="w-full max-w-[700px]">
              <div className="border border-border rounded-xl overflow-hidden bg-background">
                {/* Input field */}
                <div className="px-4 pt-3 pb-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything or Select Engagement"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
                  />
                </div>

                {/* Bottom toolbar */}
                <div className="px-3 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-border">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-border">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border-2 border-primary/40 bg-primary/5">
                      <AtSign className="h-4 w-4 text-primary" />
                    </Button>
                  </div>

                  <Button
                    size="icon"
                    className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-[#7A31D8] hover:opacity-90"
                  >
                    <Mic className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
