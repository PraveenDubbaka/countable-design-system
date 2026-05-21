import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Send, Clock, MessageSquare, FolderOpen, Search, Plus, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface EngagementRightPanelProps {
  className?: string;
}

const menuItems = [
  { icon: Send, label: 'Send', id: 'send' },
  { icon: Clock, label: 'Timeline', id: 'timeline' },
  { icon: MessageSquare, label: 'Messages', id: 'messages' },
  { icon: FolderOpen, label: 'Folders', id: 'folders' },
];

export function EngagementRightPanel({ className }: EngagementRightPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('folders');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById('right-panel-portal');
    if (el) setPortalTarget(el);
  }, []);

  const panel = (
    <div className={cn("flex mr-1 mb-1 rounded-xl overflow-hidden bg-white dark:bg-card border border-border/50 shadow-md h-full", className)}>
      {/* Icon Bar - Always visible */}
      <div className="w-12 flex flex-col items-center py-3 gap-1 m-1 rounded-lg" style={{ backgroundColor: '#F5F8FF' }}>
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 mb-2 hover:bg-muted"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronRight className="h-4 w-4 text-primary" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-primary" />
          )}
        </Button>

        {/* Menu Icons */}
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 hover:bg-muted",
              activeItem === item.id && "bg-muted text-primary"
            )}
            onClick={() => {
              setActiveItem(item.id);
              if (!isExpanded) setIsExpanded(true);
            }}
          >
            <item.icon className="h-4 w-4 text-primary" />
          </Button>
        ))}
      </div>

      {/* Expanded Content Panel */}
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          isExpanded ? "w-72" : "w-0"
        )}
      >
        {isExpanded && (
          <div className="w-72 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3">
              <h3 className="font-semibold text-sm text-foreground flex-1">Engagement Folders</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7 shrink-0 border-border">
                <Plus className="h-3.5 w-3.5 text-foreground" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Folder Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Choose Engagement Folder <span className="text-destructive">*</span>
                </label>
                <Select defaultValue="client-onboarding">
                  <SelectTrigger className="h-9 text-sm w-full">
                    <SelectValue placeholder="Select folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client-onboarding">Client Onboarding</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="financials">Financials</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Section Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Choose Engagement Section <span className="text-destructive">*</span>
                </label>
                <Select defaultValue="new-section">
                  <SelectTrigger className="h-9 text-sm w-full">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new-section">NewSectionCOM3012251...</SelectItem>
                    <SelectItem value="quality">Quality Management</SelectItem>
                    <SelectItem value="financial">Financial Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Schedule Button — solid dark navy */}
              <Button
                className="w-full justify-center gap-2 h-10 text-xs font-medium bg-[#0C2D55] hover:bg-[#0a2447] text-white border-0"
              >
                <CalendarClock className="h-3.5 w-3.5" />
                Schedule Document Request
              </Button>

              {/* Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full h-8 p-0.5 bg-muted/60 rounded-lg">
                  <TabsTrigger value="all" className="flex-1 text-[11px] h-full px-1 min-w-0 truncate rounded-md">All Requests</TabsTrigger>
                  <TabsTrigger value="available" className="flex-1 text-[11px] h-full px-1 min-w-0 truncate rounded-md">Available</TabsTrigger>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TabsTrigger value="backlog" className="flex-1 text-[11px] h-full px-1 min-w-0 truncate rounded-md">Batch</TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Batch Requests</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  {/* Empty State */}
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-4">
                      <FolderOpen className="h-8 w-8 text-primary/40" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      There are no requests to show up
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="available" className="mt-4">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-4">
                      <FolderOpen className="h-8 w-8 text-primary/40" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No available requests
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="backlog" className="mt-4">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-4">
                      <FolderOpen className="h-8 w-8 text-primary/40" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No backlog items
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!portalTarget) return null;
  return createPortal(panel, portalTarget);
}
