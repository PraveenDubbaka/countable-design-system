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
    <div className="flex h-screen" style={{ background: 'linear-gradient(150deg, #071d3e 0%, #0d2d5e 45%, #1351a0 100%)' }}>
      <Sidebar
        pageTitle={title}
        showBackButton={showBackButton}
        onBack={onBack}
      />

      <div className="layout-content flex-1 flex flex-col overflow-hidden">
        {/* Global Header - transparent so gradient shows through */}
        <div className="header-wrapper overflow-hidden">
          <GlobalHeader title={title} headerContent={headerContent} />
        </div>

        {/* Content area: transparent flex row — each card floats on gradient */}
        <div className="content-wrapper flex flex-1 overflow-hidden">
          <div id="sidebar-secondary-portal" className="flex shrink-0 h-full" />
          <main className="app-main flex-1 overflow-auto text-foreground rounded-xl bg-background shadow-[0_4px_24px_rgba(0,0,0,0.35)] mb-2 mr-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
