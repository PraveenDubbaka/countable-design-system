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
{ id: 11, name: "Capital Asset Amortizatio...", icon: "chat" }];


export function AskLukaOverlay({ open, onOpenChange }: AskLukaOverlayProps) {
  const [message, setMessage] = useState("");

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed top-0 right-0 bottom-0 left-14 z-50 bg-background",
        "animate-in slide-in-from-top duration-300 ease-out"
      )}>
      
      <div className="flex h-full">
        {/* Left Sidebar */}
        <aside className="w-[220px] border-r border-border flex flex-col bg-background">
          {/* Logo */}
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="20" viewBox="0 0 80 20" fill="none">
              <path d="M0.601562 0.683594H4.31641V15.7422H14.9688V19H0.601562V0.683594ZM17.8867 0.683594H21.6016V10.7734C21.6016 11.6016 21.7148 12.3398 21.9414 12.9883C22.168 13.6289 22.5039 14.1719 22.9492 14.6172C23.4023 15.0625 23.9609 15.4023 24.625 15.6367C25.2891 15.8633 26.0625 15.9766 26.9453 15.9766C27.8203 15.9766 28.5898 15.8633 29.2539 15.6367C29.9258 15.4023 30.4844 15.0625 30.9297 14.6172C31.3828 14.1719 31.7227 13.6289 31.9492 12.9883C32.1758 12.3398 32.2891 11.6016 32.2891 10.7734V0.683594H36.0039V11.2188C36.0039 12.4219 35.8008 13.5156 35.3945 14.5C34.9883 15.4844 34.3984 16.3281 33.625 17.0312C32.8516 17.7344 31.9023 18.2773 30.7773 18.6602C29.6602 19.043 28.3828 19.2344 26.9453 19.2344C25.5078 19.2344 24.2266 19.043 23.1016 18.6602C21.9844 18.2773 21.0391 17.7344 20.2656 17.0312C19.4922 16.3281 18.9023 15.4844 18.4961 14.5C18.0898 13.5156 17.8867 12.4219 17.8867 11.2188V0.683594ZM40.5391 0.683594H44.2539V10.1641L53.9219 0.683594H58.6797L49.6562 9.42578L58.6797 19H53.7344L46.9844 12.0156L44.2539 14.6523V19H40.5391V0.683594ZM66.7539 0.683594H70.6914L79.5508 19H75.6484L74.1836 15.918H63.4844L62.0664 19H58.1523L66.7539 0.683594ZM72.7188 12.8594L68.7578 4.53906L64.9023 12.8594H72.7188Z" fill="url(#paint0_linear_26_3)" />
              <defs>
                <linearGradient id="paint0_linear_26_3" x1="-2" y1="10" x2="80" y2="10" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#9747FF" /><stop offset="1" stopColor="#1C63A6" />
                </linearGradient>
              </defs>
            </svg>
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
                className="h-9 pl-9 input-double-border text-sm" />
              
            </div>
          </div>

          {/* Recents Label */}
          <div className="px-4 pb-2">
            <span className="text-xs font-semibold text-foreground">Recents</span>
          </div>

          {/* Thread List */}
          <ScrollArea className="flex-1 px-1">
            {recentThreads.map((thread) =>
            <button
              key={thread.id}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-muted/60 rounded-lg transition-colors">
              
                {thread.icon === "pin" ?
              <svg className="h-4 w-4 text-muted-foreground flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 1v6M5 3.5h6l-1 4H6l-1-4zM8 9.5v5M5.5 14.5h5" />
                  </svg> :

              <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              }
                <span className="text-sm text-foreground truncate">{thread.name}</span>
              </button>
            )}
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
              onClick={() => onOpenChange(false)}>
              
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Center welcome content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <h1 className="text-xl font-medium text-muted-foreground mb-8 text-center">
              Hey! <span className="text-foreground font-semibold">Countable</span>, welcome to the world of light speed engagements
            </h1>

            {/* Chat Input */}
            <div className="w-full max-w-[700px]">
              <div className="border border-[#dcdfe4] dark:border-[hsl(220_15%_30%)] rounded-[10px] overflow-hidden bg-background">
                {/* Input field */}
                <div className="px-4 pt-3 pb-2">
                  <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything or Select Engagement"
                    className="border-0 shadow-none focus:ring-0 focus:outline-none h-9 px-0 rounded-none" />
                </div>

                {/* Bottom toolbar */}
                <div className="px-3 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-[10px]">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-[10px]">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-[10px] border-2 border-primary/40 bg-primary/5">
                      <AtSign className="h-4 w-4 text-primary" />
                    </Button>
                  </div>

                  <Button
                    size="icon"
                    className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-[hsl(270_100%_58%)] hover:opacity-90">
                    <Mic className="h-4 w-4 text-primary-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>);

}