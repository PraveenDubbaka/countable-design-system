import { useState } from "react";
import { Bell, User, Sparkles, Moon, Sun, Zap, UserCircle, Building2, Settings, CreditCard, Monitor, Gift, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useThemeContext } from "@/contexts/ThemeContext";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AskLukaOverlay } from "@/components/AskLukaOverlay";

export function GlobalHeader() {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [askLukaQuery, setAskLukaQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [askLukaOpen, setAskLukaOpen] = useState(false);

  return (
    <>
      <header className="h-14 flex items-center justify-between px-6 bg-background border-b border-border">
        {/* Left side - Page title or breadcrumb can go here */}
        <div className="flex-1" />

        {/* Right side - Ask Luka, Credits, Theme, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Ask Luka AI Search - styled like screenshot */}
          <div className="flex items-center bg-[hsl(213_50%_25%)] dark:bg-[hsl(213_40%_20%)] rounded-full pl-4 pr-1.5 py-1.5 gap-2 min-w-[320px]">
            <Zap className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <Input 
              type="text"
              placeholder="Type here.."
              value={askLukaQuery}
              onChange={(e) => setAskLukaQuery(e.target.value)}
              className="border-0 bg-transparent h-7 text-sm text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 flex-1"
            />
            <Button 
              className="h-8 px-4 rounded-full bg-gradient-to-r from-[#1C63A6] to-[#7A31D8] hover:from-[#1a5a96] hover:to-[#6a2bc2] text-white text-sm font-medium gap-1.5 shadow-md"
              onClick={() => setAskLukaOpen(true)}
            >
              <Sparkles className="h-4 w-4 animate-[spin_3s_linear_infinite]" />
              Ask Luka
            </Button>
          </div>

          {/* AI Credits */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="flex items-center justify-center w-9 h-9 cursor-pointer rounded-xl hover:bg-muted transition-colors"
                style={{ borderRadius: '12px' }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7A31D8] to-[#1C63A6] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">L</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Luka AI Credits</TooltipContent>
          </Tooltip>

          {/* Theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer hover:bg-muted transition-colors"
                style={{ borderRadius: '12px' }}
                onClick={toggleTheme}
              >
                <div className="relative w-5 h-5">
                  <Sun className={`h-5 w-5 text-amber-400 absolute transition-all duration-500 ${
                    isDarkMode 
                      ? 'rotate-0 scale-100 opacity-100' 
                      : 'rotate-90 scale-0 opacity-0'
                  }`} />
                  <Moon className={`h-5 w-5 text-muted-foreground absolute transition-all duration-500 ${
                    isDarkMode 
                      ? '-rotate-90 scale-0 opacity-0' 
                      : 'rotate-0 scale-100 opacity-100'
                  }`} />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</TooltipContent>
          </Tooltip>

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer hover:bg-muted transition-colors relative"
                style={{ borderRadius: '12px' }}
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-[9px] text-white flex items-center justify-center font-medium">2</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div 
                className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer hover:bg-muted transition-colors"
                style={{ borderRadius: '12px' }}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="gap-3 py-3 cursor-pointer">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
                <span>My Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3 cursor-pointer">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <span>Firm Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="gap-3 py-3 cursor-pointer"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3 cursor-pointer">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3 cursor-pointer">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <span>Apps & Integrations</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-3 py-3 cursor-pointer">
                <Gift className="h-5 w-5 text-muted-foreground" />
                <span>What's New</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3 cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Settings Panel */}
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Ask Luka Overlay */}
      <AskLukaOverlay open={askLukaOpen} onOpenChange={setAskLukaOpen} />
    </>
  );
}
