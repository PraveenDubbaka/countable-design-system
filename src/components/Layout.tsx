import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showActions?: boolean;
}

export function Layout({ children, title = "Countable AI Checklist Generator", showActions = false }: LayoutProps) {
  return (
    <div className="flex h-screen bg-sidebar">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Curved corner container for header and main content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background rounded-tl-[20px]">
          <Header 
            title={title} 
            showActions={showActions}
          />
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
