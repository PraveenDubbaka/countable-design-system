import { Bell, ChevronDown, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import lukaAiIcon from '@/assets/luka-ai-icon.png';

interface HeaderProps {
  title?: string;
  showActions?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Header({ title, showActions = true, showBackButton = false, onBack }: HeaderProps) {
  return (
    <header className="h-14 bg-card flex items-center justify-between px-6 shadow-sm">
      {/* Left side - back button and title */}
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-[#1C63A6] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        {title && (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}
      </div>

      {/* Right side - Actions matching screenshot */}
      <div className="flex items-center gap-3">
        {/* Luka AI icon */}
        <Button size="icon" variant="ghost" className="relative h-9 w-9 p-0">
          <img src={lukaAiIcon} alt="Luka AI" className="w-7 h-7 rounded-full object-cover" />
        </Button>
        
        {/* Bell with notification badge */}
        <Button size="icon" variant="ghost" className="relative h-9 w-9">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center font-medium">2</span>
        </Button>

        {/* User avatar with dropdown */}
        <div className="flex items-center gap-1 ml-1 cursor-pointer hover:bg-muted px-2 py-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
