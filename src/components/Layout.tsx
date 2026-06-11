import { Sidebar } from '@/components/Sidebar';
import { GlobalHeader } from '@/components/GlobalHeader';


interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  headerContent?: React.ReactNode;
  showActions?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  hideSidebar?: boolean;
}

export function Layout({ children, title, headerContent, showActions = false, showBackButton = false, onBack, hideSidebar = false }: LayoutProps) {
  return (
    <div className="flex h-screen" style={{ background: `
      radial-gradient(ellipse 260px 400px at 2% 95%,   rgba(120,86,200,0.65) 0%, transparent 100%),
      radial-gradient(ellipse 260px 400px at 26% 76%,  rgba(120,86,200,0.55) 0%, transparent 100%),
      radial-gradient(ellipse 440px 620px at 74% 38%,  rgba(120,86,200,0.50) 0%, transparent 100%),
      radial-gradient(ellipse 680px 380px at 96%  7%,  rgba(120,86,200,0.65) 0%, transparent 100%),
      #0C2D55
    `.replace(/\n\s*/g, ' ') }}>
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
          <main className="app-main flex-1 overflow-auto text-foreground rounded-xl bg-background shadow-[0_4px_24px_rgba(0,0,0,0.35)] mb-1 mr-1">
            {children}
          </main>
          <div id="right-panel-portal" className="flex shrink-0 h-full pb-1" />
        </div>
      </div>
    </div>
  );
}
