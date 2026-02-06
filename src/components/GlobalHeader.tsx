import { useState } from "react";
import { Bell, User, Sparkles, Moon, Sun, Zap, UserCircle, Building2, Settings, CreditCard, Monitor, Gift, LogOut, Check, Trash2, Search, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useThemeContext } from "@/contexts/ThemeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Input as SearchInput } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AskLukaOverlay } from "@/components/AskLukaOverlay";

export function GlobalHeader({ title }: { title?: string }) {
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [askLukaQuery, setAskLukaQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [askLukaOpen, setAskLukaOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifSearch, setNotifSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([
    { id: '1', sender: 'Cpt Group', initials: 'CG', message: 'New engagement created Cpt Group', read: false, time: '2m ago' },
    { id: '2', sender: 'Cpt Group', initials: 'CG', message: '1 team members added', read: false, time: '5m ago' },
    { id: '3', sender: 'Cpt Group', initials: 'CG', message: 'New engagement created Cpt Group', read: true, time: '1h ago' },
    { id: '4', sender: 'Cpt Group', initials: 'CG', message: '1 team members added', read: true, time: '2h ago' },
    { id: '5', sender: 'Cpt Group', initials: 'CG', message: 'You have been assigned as the packager for Cpt Group', read: true, time: '3h ago' },
    { id: '6', sender: 'Cpt Group', initials: 'CG', message: 'New engagement created Cpt Group', read: true, time: '5h ago' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n =>
    n.message.toLowerCase().includes(notifSearch.toLowerCase()) ||
    n.sender.toLowerCase().includes(notifSearch.toLowerCase())
  );
  return (
    <>
      <header className="h-14 flex items-center justify-between px-6 bg-background border-b border-border">
        {/* Left side - Page title */}
        <div className="flex-1">
          {title && (
            <h1 className="text-xl font-bold" style={{ color: '#0c2d55' }}>{title}</h1>
          )}
        </div>

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
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <div 
                className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer hover:bg-muted transition-colors relative"
                style={{ borderRadius: '12px' }}
              >
                <Bell className={`h-5 w-5 text-muted-foreground ${unreadCount > 0 ? 'animate-[swing_1.5s_ease-in-out_infinite]' : ''}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-[9px] text-white flex items-center justify-center font-medium">{unreadCount}</span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] p-0 bg-card border border-border shadow-xl" style={{ borderRadius: '12px' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} className="scale-75" />
                </div>
              </div>

              {/* Search + Actions */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <SearchInput
                    value={notifSearch}
                    onChange={(e) => setNotifSearch(e.target.value)}
                    placeholder="Search"
                    className="h-8 pl-8 text-xs"
                  />
                </div>
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted rounded-lg transition-colors whitespace-nowrap"
                >
                  <Check className="h-3.5 w-3.5" />
                  Mark All As Read
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete All
                </button>
              </div>

              {/* Notification List */}
              <ScrollArea className="max-h-[360px]">
                {filteredNotifications.length === 0 ? (
                  <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}
                        onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-semibold text-primary">{notif.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{notif.sender}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            <span className="text-primary">Notified you:</span> {notif.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                          <button className="p-1 hover:bg-muted rounded transition-colors" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

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
