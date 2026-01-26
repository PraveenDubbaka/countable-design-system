import { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, Clock, MessageSquare, FolderOpen, Search, Plus, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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

  return (
    <div className={cn("flex h-full", className)}>
      {/* Icon Bar - Always visible */}
      <div className="w-12 bg-card border-l border-border flex flex-col items-center py-3 gap-1">
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 mb-2 hover:bg-muted"
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
          "bg-card border-l border-border transition-all duration-300 overflow-hidden",
          isExpanded ? "w-72" : "w-0"
        )}
      >
        {isExpanded && (
          <div className="w-72 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm text-foreground">Engagement Folders</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* New Request Button */}
              <Button variant="outline" className="w-full justify-center gap-2 h-9">
                <Plus className="h-4 w-4" />
                New Request
              </Button>

              {/* Folder Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Choose Engagement Folder<span className="text-destructive">*</span>
                </label>
                <Select defaultValue="client-onboarding">
                  <SelectTrigger className="h-9 text-sm">
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
                  Choose Engagement Folder<span className="text-destructive">*</span>
                </label>
                <Select defaultValue="new-section">
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new-section">NewSectionCOM3012251...</SelectItem>
                    <SelectItem value="quality">Quality Management</SelectItem>
                    <SelectItem value="financial">Financial Information</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Schedule Button */}
              <Button variant="outline" className="w-full justify-center gap-2 h-9">
                <CalendarClock className="h-4 w-4" />
                Schedule Document Request
              </Button>

              {/* Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full h-9 p-0.5 bg-muted/50">
                  <TabsTrigger value="all" className="flex-1 text-xs h-full">All Requests</TabsTrigger>
                  <TabsTrigger value="available" className="flex-1 text-xs h-full">Available</TabsTrigger>
                  <TabsTrigger value="backlog" className="flex-1 text-xs h-full">Backlog</TabsTrigger>
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
}
