import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showActions?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Layout({ children, title, showActions = false, showBackButton = false, onBack }: LayoutProps) {
  return (
    <div className="flex h-screen bg-sidebar-bg dark:bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Curved corner container for header and main content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-card rounded-tl-[24px]">
          <Header 
            title={title} 
            showActions={showActions}
            showBackButton={showBackButton}
            onBack={onBack}
          />
          
          <main className="flex-1 overflow-auto bg-background text-foreground">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
