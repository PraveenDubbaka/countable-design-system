import { Bell, ChevronDown, ArrowLeft, Sparkles, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface HeaderProps {
  title?: string;
  showActions?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Header({ title, showActions = true, showBackButton = false, onBack }: HeaderProps) {
  return (
    <TooltipProvider>
      <header className="h-14 bg-primary flex items-center justify-between px-6 shadow-md relative z-20">
        {/* Left side - back button and title */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          {title && (
            <h1 className="text-lg font-semibold text-primary-foreground">{title}</h1>
          )}
        </div>

        {/* Right side - Actions matching screenshot */}
        <div className="flex items-center gap-2">
          {/* Ask Luka input section */}
          <div className="flex items-center bg-primary-foreground/10 rounded-full overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5">
              <Sparkles className="h-4 w-4 text-primary-foreground/70" />
              <Input 
                type="text"
                placeholder="Type here..."
                className="bg-transparent border-none h-7 w-32 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
            </div>
            <Button 
              size="sm" 
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 px-4 h-8 gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ask Luka
            </Button>
          </div>

          {/* Clock icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>History</TooltipContent>
          </Tooltip>

          {/* Phone icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600">
                <Phone className="h-5 w-5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Call</TooltipContent>
          </Tooltip>
          
          {/* Bell with notification badge */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-primary-foreground/10">
                <Bell className="h-5 w-5 text-primary-foreground" />
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center font-medium">23</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          {/* User avatar with name and dropdown */}
          <div className="flex items-center gap-2 ml-1 cursor-pointer hover:bg-primary-foreground/10 px-2 py-1.5 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold">
              JD
            </div>
            <span className="text-primary-foreground text-sm font-medium">John Doe</span>
            <ChevronDown className="h-4 w-4 text-primary-foreground/70" />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
