import { useState } from "react";
import { Search, Bell, User, Sparkles, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useThemeContext } from "@/contexts/ThemeContext";

export function GlobalHeader() {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [askLukaQuery, setAskLukaQuery] = useState("");

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-background border-b border-border">
      {/* Left side - Page title or breadcrumb can go here */}
      <div className="flex-1" />

      {/* Right side - Ask Luka, Credits, Theme, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Ask Luka AI Search */}
        <div className="flex items-center bg-muted rounded-xl px-3 py-2 gap-2 min-w-[200px]">
          <Sparkles className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input 
            type="text"
            placeholder="Ask Luka..."
            value={askLukaQuery}
            onChange={(e) => setAskLukaQuery(e.target.value)}
            className="border-0 bg-transparent h-6 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
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

        {/* User Profile */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer hover:bg-muted transition-colors"
              style={{ borderRadius: '12px' }}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>Profile</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
