import { Bell, Zap, ChevronDown, User, Trash2, Copy, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
  showActions?: boolean;
}

export function Header({ title = "Client Acceptance and Continuance", showActions = true }: HeaderProps) {
  return (
    <header className="h-14 bg-card flex items-center justify-between px-6 relative">
      {/* Left side - Collapse toggle */}
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {showActions && (
          <>
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground border-border hover:text-destructive hover:border-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground border-border hover:text-primary hover:border-primary">
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
            <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </>
        )}

        <div className="h-6 w-px bg-border mx-2" />

        {/* Notifications and User */}
        <Button size="icon" variant="ghost" className="relative h-9 w-9">
          <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <Zap className="h-3 w-3 text-white" />
          </div>
        </Button>
        
        <Button size="icon" variant="ghost" className="relative h-9 w-9">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </Button>

        <div className="flex items-center gap-2 ml-1 cursor-pointer hover:bg-muted px-3 py-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
