import { Sidebar } from '@/components/Sidebar';
import { GlobalHeader } from '@/components/GlobalHeader';


interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  headerContent?: React.ReactNode;
  showActions?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Layout({ children, title, headerContent, showActions = false, showBackButton = false, onBack }: LayoutProps) {
  return (
    <div className="flex h-screen bg-sidebar-bg">
      <Sidebar 
        pageTitle={title}
        showBackButton={showBackButton}
        onBack={onBack}
      />
      
      <div className="layout-content flex-1 flex flex-col overflow-hidden bg-sidebar-bg">
        {/* Global Header - shares sidebar background to blend seamlessly */}
        <div className="header-wrapper overflow-hidden bg-sidebar-bg">
          <GlobalHeader title={title} headerContent={headerContent} />
        </div>
        
        {/* Content area curves at top-left and bottom-left to merge with sidebar */}
        <div className="content-wrapper flex flex-1 overflow-hidden rounded-tl-2xl rounded-bl-2xl bg-background">
          <div id="sidebar-secondary-portal" className="flex shrink-0 h-full" />
          <main className="app-main flex-1 overflow-auto text-foreground">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
