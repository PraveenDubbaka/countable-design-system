import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showActions?: boolean;
}

export function Layout({ children, title = "Countable AI Checklist Generator", showActions = false }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={title} 
          showActions={showActions}
        />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
