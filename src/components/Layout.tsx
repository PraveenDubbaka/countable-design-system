import { Sidebar } from '@/components/Sidebar';
import { GlobalHeader } from '@/components/GlobalHeader';
import { ThemeChanger } from '@/components/ThemeChanger';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showActions?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Layout({ children, title, showActions = false, showBackButton = false, onBack }: LayoutProps) {
  return (
    <div className="flex h-screen bg-sidebar-bg">
      <Sidebar 
        pageTitle={title}
        showBackButton={showBackButton}
        onBack={onBack}
      />
      
      <div className="layout-content flex-1 flex flex-col overflow-hidden">
        {/* Global Header - spans full width from sidebar curve to right end */}
        <div className="header-wrapper rounded-tl-2xl overflow-hidden bg-background">
          <GlobalHeader title={title} />
        </div>
        
        {/* Content area with portal target for secondary panels */}
        <div className="content-wrapper flex flex-1 overflow-hidden rounded-bl-2xl bg-background">
          <div id="sidebar-secondary-portal" className="flex shrink-0 h-full" />
          <main className="app-main flex-1 overflow-auto text-foreground">
            {children}
          </main>
        </div>
      </div>

      <ThemeChanger />
    </div>
  );
}
