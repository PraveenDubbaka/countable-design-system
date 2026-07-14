import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Send, Clock, MessageSquare, FolderOpen, Search, Plus, CalendarClock, ArrowLeft, Upload, X, Layers } from 'lucide-react';
import { MultipleRequestModal } from './MultipleRequestModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface EngagementRightPanelProps {
  className?: string;
}

type PanelMode = 'folders' | 'doc-request';

interface DocRequestContext {
  folder: string;
  subFolder: string;
}

const menuItems = [
  { icon: Send, label: 'Send', id: 'send' },
  { icon: Clock, label: 'Timeline', id: 'timeline' },
  { icon: MessageSquare, label: 'Messages', id: 'messages' },
  { icon: FolderOpen, label: 'Folders', id: 'folders' },
];

const ENGAGEMENT_FOLDERS = ['Client Onboarding', 'Planning', 'Risk Assessment', 'Procedures', 'Financial Statements', 'Completion & Signoffs'];
const DOC_TYPES = ['General', 'Urgent', 'Internal', 'External'];
const PRIORITIES = ['High', 'Medium', 'Low'];

function DocRequestForm({ context, onBack }: { context: DocRequestContext; onBack: () => void }) {
  const [folder, setFolder] = useState(context.folder || '');
  const [subFolder, setSubFolder] = useState(context.subFolder || '');
  const [type, setType] = useState('General');
  const [recipient, setRecipient] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [docName, setDocName] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValid = folder && recipient.trim() && docName.trim() && dueDate;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...dropped]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const handleSend = () => {
    if (!isValid) return;
    onBack();
  };

  const labelCls = "text-xs font-medium text-foreground block mb-1";
  const requiredMark = <span className="text-destructive ml-0.5">*</span>;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <button type="button" onClick={onBack} className="p-1 hover:bg-muted rounded-md transition-colors">
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <h3 className="text-sm font-semibold text-foreground flex-1">Doc Request</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 gap-1.5 text-[11px] font-medium text-[#0C2D55] border-[#0C2D55]/30"
                onClick={() => setBulkOpen(true)}
              >
                <Layers className="h-3 w-3" />
                Multiple Request
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Raise multiple PBC requests at once</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <MultipleRequestModal open={bulkOpen} onOpenChange={setBulkOpen} />
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
        {/* Engagement Folder */}
        <div>
          <label className={labelCls}>Engagement Folder{requiredMark}</label>
          <Select value={folder} onValueChange={setFolder}>
            <SelectTrigger className="h-9 text-sm w-full">
              <SelectValue placeholder="Select folder" />
            </SelectTrigger>
            <SelectContent>
              {ENGAGEMENT_FOLDERS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Sub Folder */}
        <div>
          <label className={labelCls}>Sub Folder{requiredMark}</label>
          <Input
            value={subFolder}
            onChange={e => setSubFolder(e.target.value)}
            placeholder="Sub folder"
            className="h-9 text-sm"
          />
        </div>

        {/* Type */}
        <div>
          <label className={labelCls}>Type{requiredMark}</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-9 text-sm w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOC_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Recipient */}
        <div>
          <label className={labelCls}>Recipient{requiredMark}</label>
          <Input
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            placeholder="one@gmail.com"
            type="email"
            className="h-9 text-sm"
          />
        </div>

        {/* Priority */}
        <div>
          <label className={labelCls}>Priority{requiredMark}</label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="h-9 text-sm w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Document Name */}
        <div>
          <label className={labelCls}>Document Name{requiredMark}</label>
          <Input
            value={docName}
            onChange={e => setDocName(e.target.value)}
            placeholder="Document name"
            className={cn("h-9 text-sm", !docName && "border-destructive focus-visible:ring-destructive/30")}
          />
        </div>

        {/* Description / Notes */}
        <div>
          <label className={labelCls}>Description/Notes{requiredMark}</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Description/Notes"
            rows={3}
            className={cn(
              "w-full rounded-md border px-3 py-2 text-sm resize-none outline-none transition-colors",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "border-input focus:border-primary focus:ring-1 focus:ring-primary/30",
              !notes && "border-destructive focus:ring-destructive/30"
            )}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className={labelCls}>
            Due Date <span className="text-destructive">**</span>
          </label>
          <div className="relative">
            <Input
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              placeholder="Due date"
              type="date"
              className={cn("h-9 text-sm pr-9", !dueDate && "border-destructive focus-visible:ring-destructive/30")}
            />
          </div>
        </div>

        {/* File Upload */}
        <div
          className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />
          <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-1.5" />
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">Click to upload</span> or drag and drop
          </p>
        </div>

        {/* Uploaded files list */}
        {files.length > 0 && (
          <div className="space-y-1">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-muted rounded px-2 py-1">
                <span className="truncate flex-1">{f.name}</span>
                <button type="button" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} className="ml-2 text-muted-foreground hover:text-destructive">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border shrink-0">
        <Button variant="outline" size="sm" className="flex-1" onClick={onBack}>Cancel</Button>
        <Button size="sm" className="flex-1" disabled={!isValid} onClick={handleSend}>Send Request</Button>
      </div>
    </div>
  );
}

export function EngagementRightPanel({ className }: EngagementRightPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('folders');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [mode, setMode] = useState<PanelMode>('folders');
  const [docRequestCtx, setDocRequestCtx] = useState<DocRequestContext>({ folder: '', subFolder: '' });

  useEffect(() => {
    const el = document.getElementById('right-panel-portal');
    if (el) setPortalTarget(el);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { folder, subFolder } = (e as CustomEvent).detail ?? {};
      setDocRequestCtx({ folder: folder ?? '', subFolder: subFolder ?? '' });
      setMode('doc-request');
      setIsExpanded(true);
    };
    window.addEventListener('raise-doc-request', handler);
    return () => window.removeEventListener('raise-doc-request', handler);
  }, []);


  const panel = (
    <div className={cn("flex mr-1 mb-1 rounded-xl overflow-hidden bg-white dark:bg-card border border-border/50 shadow-md h-full", className)}>
      {/* Icon Bar - Always visible */}
      <div className="w-12 flex flex-col items-center py-3 gap-1 m-1 rounded-lg bg-[#F5F8FF] dark:bg-muted/40">
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
              if (item.id === 'folders') setMode('folders');
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
            {mode === 'doc-request' ? (
              <DocRequestForm
                context={docRequestCtx}
                onBack={() => { setMode('folders'); setActiveItem('folders'); }}
              />
            ) : (
              <>
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

                  <Button
                    className="w-full justify-center gap-2 h-10 text-xs font-medium bg-[#1C63A6] hover:bg-[#1a5a9e] text-white border-0"
                  >
                    <CalendarClock className="h-3.5 w-3.5" />
                    Schedule Document Request
                  </Button>

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
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-4">
                          <FolderOpen className="h-8 w-8 text-primary/40" />
                        </div>
                        <p className="text-sm text-muted-foreground">There are no requests to show up</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="available" className="mt-4">
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-4">
                          <FolderOpen className="h-8 w-8 text-primary/40" />
                        </div>
                        <p className="text-sm text-muted-foreground">No available requests</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="backlog" className="mt-4">
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mb-4">
                          <FolderOpen className="h-8 w-8 text-primary/40" />
                        </div>
                        <p className="text-sm text-muted-foreground">No backlog items</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (!portalTarget) return null;
  return createPortal(panel, portalTarget);
}
