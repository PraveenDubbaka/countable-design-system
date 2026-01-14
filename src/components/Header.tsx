import { Bell, Zap, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="h-14 border-b bg-card flex items-center justify-end px-4 gap-3">
      <Button size="icon" variant="ghost" className="relative">
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Zap className="h-3 w-3 text-primary-foreground" />
        </div>
        <span className="sr-only">AI Credits</span>
      </Button>
      
      <Button size="icon" variant="ghost" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
      </Button>
      
      <Button size="icon" variant="ghost">
        <Bell className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2 ml-2 cursor-pointer hover:bg-muted px-3 py-1.5 rounded-lg transition-colors">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-medium">Asha Counta</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>
    </header>
  );
}
