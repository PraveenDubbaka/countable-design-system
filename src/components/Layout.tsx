import { Sidebar } from '@/components/Sidebar';

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
        {/* Full-height content area without top header */}
        <main className="app-main flex-1 overflow-auto bg-background text-foreground rounded-tl-2xl rounded-bl-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
