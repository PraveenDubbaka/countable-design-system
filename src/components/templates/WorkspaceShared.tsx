import { useNavigate } from "react-router-dom";
import { Star, Link, Link2Off, MoreVertical, Eye, Copy, Pencil, FolderInput, Building2, BookOpen, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  type FirmTemplate,
  type Folder,
  type TemplateTypeId,
  type NavTarget,
  type Library,
  getOffices,
  linkedCount as calcLinkedCount,
  defaultKey,
  isDefault as calcIsDefault,
  folderPath,
} from "@/lib/firmTemplateLibrary";
import { dropdownItems } from "@/components/Sidebar";
import { useState } from "react";

// ── TYPE_META ─────────────────────────────────────────────────────────────────

export const TYPE_META: Record<TemplateTypeId, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  accent: string;
}> = {
  engagements: {
    label: "Engagements",
    icon: dropdownItems[0].icon,
    color: dropdownItems[0].color,
    accent: "#1C63A6",
  },
  "financial-statements": {
    label: "Financial Statements",
    icon: dropdownItems[1].icon,
    color: dropdownItems[1].color,
    accent: "#10b981",
  },
  letters: {
    label: "Letters",
    icon: dropdownItems[2].icon,
    color: dropdownItems[2].color,
    accent: "#a855f7",
  },
  checklists: {
    label: "Checklists",
    icon: dropdownItems[3].icon,
    color: dropdownItems[3].color,
    accent: "#f97316",
  },
  reports: {
    label: "Reports",
    icon: dropdownItems[4].icon,
    color: dropdownItems[4].color,
    accent: "#be185d",
  },
  notes: {
    label: "Notes to Financial Statements",
    icon: dropdownItems[5].icon,
    color: dropdownItems[5].color,
    accent: "#eab308",
  },
  worksheets: {
    label: "Worksheets",
    icon: dropdownItems[6].icon,
    color: dropdownItems[6].color,
    accent: "#60a5fa",
  },
};

// ── HELPERS ───────────────────────────────────────────────────────────────────

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const mos = Math.floor(days / 30);
  if (mos < 12) return `${mos} month${mos === 1 ? "" : "s"} ago`;
  const yrs = Math.floor(mos / 12);
  return `${yrs} year${yrs === 1 ? "" : "s"} ago`;
}

export function goTo(navigate: ReturnType<typeof useNavigate>, nav: NavTarget) {
  if (!nav) return;
  navigate(nav.to, { state: nav.state ? { ...nav.state, timestamp: Date.now() } : undefined });
}

// ── CHIPS ─────────────────────────────────────────────────────────────────────

export function StatusChip({ status }: { status: "published" | "draft" }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
      Draft
    </span>
  );
}

export function LinkChip({ linked }: { linked: number }) {
  return linked > 0 ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
      <Link className="h-2.5 w-2.5 flex-shrink-0" />
      {linked} engagement{linked === 1 ? "" : "s"}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
      <Link2Off className="h-2.5 w-2.5 flex-shrink-0" />
      Not linked
    </span>
  );
}

export function DefaultBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800">
      <Star className="h-2.5 w-2.5 flex-shrink-0 fill-current" />
      Default
    </span>
  );
}

export function OfficeTag({ officeId }: { officeId: string }) {
  const offices = getOffices();
  const office = offices.find(o => o.id === officeId);
  if (!office) return null;
  const flag = office.region === "ca" ? "🇨🇦" : "🇺🇸";
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      {flag} {office.city}
    </span>
  );
}

// ── THUMBNAIL ─────────────────────────────────────────────────────────────────

export function TemplateThumbnail({
  type,
  cornerTag,
  className,
}: {
  type: TemplateTypeId;
  cornerTag?: string;
  className?: string;
}) {
  const accent = TYPE_META[type].accent;
  const isTable = type === "financial-statements" || type === "worksheets";

  return (
    <div className={cn("relative rounded-lg overflow-hidden bg-muted/40 border border-border", className)}>
      <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
      <div className="p-3 space-y-1.5">
        {isTable ? (
          <>
            <div className="grid grid-cols-3 gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-2 rounded-sm bg-muted-foreground/20" />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-2 rounded-sm bg-muted-foreground/10" />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="h-2 w-3/4 rounded-sm bg-muted-foreground/25" />
            {[...Array(4)].map((_, i) => (
              <div key={i} className={cn("h-1.5 rounded-sm bg-muted-foreground/15", i === 2 ? "w-1/2" : "w-full")} />
            ))}
          </>
        )}
      </div>
      {cornerTag && (
        <div
          className="absolute top-2 right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded text-white"
          style={{ backgroundColor: accent }}
        >
          {cornerTag}
        </div>
      )}
    </div>
  );
}

// ── DIALOGS ───────────────────────────────────────────────────────────────────

export function RenameDialog({
  open,
  onOpenChange,
  currentName,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currentName: string;
  onSave: (name: string) => void;
}) {
  const [value, setValue] = useState(currentName);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rename template</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label>Name</Label>
          <Input value={value} onChange={e => setValue(e.target.value)} autoFocus />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!value.trim()} onClick={() => { onSave(value.trim()); onOpenChange(false); }}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MoveToFolderDialog({
  open,
  onOpenChange,
  lib,
  template,
  onMove,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lib: Library;
  template: FirmTemplate;
  onMove: (folderId: string | null) => void;
}) {
  const [selected, setSelected] = useState<string | null>(template.folderId);
  const folders = lib.folders.filter(f => f.type === template.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Move to folder</DialogTitle>
          <DialogDescription>Choose a destination folder for this template.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-48 rounded-md border p-2 my-2">
          <div className="space-y-1">
            <button
              type="button"
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                selected === null ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
              onClick={() => setSelected(null)}
            >
              Root
            </button>
            {folders.map(f => (
              <button
                key={f.id}
                type="button"
                disabled={f.id === template.folderId}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  selected === f.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  f.id === template.folderId && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => setSelected(f.id)}
              >
                {f.name}
              </button>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onMove(selected); onOpenChange(false); }}>Move</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AvailabilityDialog({
  open,
  onOpenChange,
  template,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  template: FirmTemplate;
  onSave: (officeIds: string[]) => void;
}) {
  const offices = getOffices();
  const [selected, setSelected] = useState<Set<string>>(new Set(template.availableOfficeIds));

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Office availability</DialogTitle>
          <DialogDescription>Choose which offices can use this template.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {offices.map(o => (
            <label key={o.id} className="flex items-center gap-3 cursor-pointer py-1">
              <Checkbox
                checked={selected.has(o.id)}
                onCheckedChange={() => toggle(o.id)}
              />
              <span className="text-sm">{o.region === "ca" ? "🇨🇦" : "🇺🇸"} {o.city} — {o.name}</span>
            </label>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={selected.size === 0} onClick={() => { onSave([...selected]); onOpenChange(false); }}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteBlockedDialog({
  open,
  onOpenChange,
  name,
  linked,
  onUnpublish,
  canUnpublish,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  name: string;
  linked: number;
  onUnpublish?: () => void;
  canUnpublish?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>This template is in use</DialogTitle>
          <DialogDescription>
            {name} is linked to {linked} engagement{linked === 1 ? "" : "s"}. Deleting it isn't allowed.
            Unpublish it to stop new engagements from using it. Existing engagements keep their copy.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {canUnpublish && onUnpublish && (
            <Button variant="secondary" onClick={() => { onUnpublish(); onOpenChange(false); }}>
              Unpublish
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  name,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  name: string;
  onDelete: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete template</DialogTitle>
          <DialogDescription>
            Delete <strong>{name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onDelete(); onOpenChange(false); }}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NewFolderDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (name: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) setValue(""); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label>Folder name</Label>
          <Input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="e.g. Audit Engagements"
            autoFocus
            onKeyDown={e => { if (e.key === "Enter" && value.trim()) { onCreate(value.trim()); onOpenChange(false); setValue(""); } }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!value.trim()} onClick={() => { onCreate(value.trim()); onOpenChange(false); setValue(""); }}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── ACTIONS MENU ──────────────────────────────────────────────────────────────

export interface TemplateActionsMenuProps {
  template: FirmTemplate;
  lib: Library;
  engagements: { templateId?: string }[];
  onRename: () => void;
  onMoveToFolder: () => void;
  onAvailability: () => void;
  onDuplicate: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
  onSetDefault: () => void;
  onClearDefault: () => void;
  onDelete: () => void;
}

export function TemplateActionsMenu({
  template,
  lib,
  engagements,
  onRename,
  onMoveToFolder,
  onAvailability,
  onDuplicate,
  onPublish,
  onUnpublish,
  onSetDefault,
  onClearDefault,
  onDelete,
}: TemplateActionsMenuProps) {
  const navigate = useNavigate();
  const isDefaultNow = calcIsDefault(lib, template);
  const linked = calcLinkedCount(template, engagements);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={e => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                disabled={!template.nav}
                onClick={e => { e.stopPropagation(); goTo(navigate, template.nav); }}
              >
                <Eye className="h-4 w-4 text-primary" /> View
              </DropdownMenuItem>
            </span>
          </TooltipTrigger>
          {!template.nav && (
            <TooltipContent>Viewer not available in the prototype yet</TooltipContent>
          )}
        </Tooltip>
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); onDuplicate(); }}>
          <Copy className="h-4 w-4 text-primary" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); onRename(); }}>
          <Pencil className="h-4 w-4 text-primary" /> Rename
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); onMoveToFolder(); }}>
          <FolderInput className="h-4 w-4 text-primary" /> Move to folder
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); onAvailability(); }}>
          <Building2 className="h-4 w-4 text-primary" /> Office availability
        </DropdownMenuItem>
        {template.status === "published" ? (
          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); onUnpublish(); }}>
            <BookOpen className="h-4 w-4 text-muted-foreground" /> Unpublish
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); onPublish(); }}>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Publish
          </DropdownMenuItem>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                disabled={template.status === "draft"}
                onClick={e => {
                  e.stopPropagation();
                  if (isDefaultNow) {
                    onClearDefault();
                    toast.success("Default removed");
                  } else {
                    onSetDefault();
                    const key = defaultKey(template);
                    const [, et, fw] = key.split("|");
                    toast.success(`Set as default for ${et} · ${fw}`);
                  }
                }}
              >
                <Star className="h-4 w-4 text-yellow-500" />
                {isDefaultNow ? "Remove default" : "Set as default"}
              </DropdownMenuItem>
            </span>
          </TooltipTrigger>
          {template.status === "draft" && (
            <TooltipContent>Publish this template first</TooltipContent>
          )}
        </Tooltip>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
          onClick={e => { e.stopPropagation(); onDelete(); }}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── VIEW TOGGLE ───────────────────────────────────────────────────────────────

import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "grid" | "list";

export function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="flex items-center border border-border rounded-lg overflow-hidden">
      <button
        className={cn("h-8 w-8 flex items-center justify-center transition-colors", value === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
        onClick={() => onChange("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        className={cn("h-8 w-8 flex items-center justify-center transition-colors", value === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
        onClick={() => onChange("list")}
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── PAGINATION ────────────────────────────────────────────────────────────────

export type PageSize = 20 | 50 | 100;

export function Pagination({
  total,
  page,
  pageSize,
  onPage,
  onPageSize,
}: {
  total: number;
  page: number;
  pageSize: PageSize;
  onPage: (p: number) => void;
  onPageSize: (ps: PageSize) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="whitespace-nowrap">{total === 0 ? "0 results" : `${start}–${end} of ${total}`}</span>
      <div className="flex items-center gap-1">
        {([20, 50, 100] as PageSize[]).map(ps => (
          <button
            key={ps}
            className={cn(
              "px-2 py-0.5 rounded text-xs transition-colors",
              pageSize === ps ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            )}
            onClick={() => { onPageSize(ps); onPage(1); }}
          >
            {ps}
          </button>
        ))}
        <span className="text-muted-foreground/50">|</span>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          ‹
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          ›
        </Button>
      </div>
    </div>
  );
}

// ── TYPE SELECT ───────────────────────────────────────────────────────────────

import { Inbox } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TypeSelect({
  value,
  onChange,
}: {
  value: TemplateTypeId | "all";
  onChange: (v: TemplateTypeId | "all") => void;
}) {
  return (
    <Select value={value} onValueChange={v => onChange(v as TemplateTypeId | "all")}>
      <SelectTrigger className="w-44 h-8 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <span className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-muted-foreground" />
            All templates
          </span>
        </SelectItem>
        {(Object.keys(TYPE_META) as TemplateTypeId[]).map(id => {
          const meta = TYPE_META[id];
          const Icon = meta.icon;
          return (
            <SelectItem key={id} value={id}>
              <span className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", meta.color)} />
                {meta.label}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

// ── OFFICE SELECT ─────────────────────────────────────────────────────────────

export function OfficeSelect({
  value,
  onChange,
}: {
  value: string | "all";
  onChange: (v: string | "all") => void;
}) {
  const offices = getOffices();
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-36 h-8 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All offices</SelectItem>
        {offices.map(o => (
          <SelectItem key={o.id} value={o.id}>
            {o.region === "ca" ? "🇨🇦" : "🇺🇸"} {o.city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Re-export folderPath for convenience
export { folderPath };
