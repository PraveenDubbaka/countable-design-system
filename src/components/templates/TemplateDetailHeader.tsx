import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Check, X, MoreVertical, Copy, FolderInput, Building2, BookOpen, CheckCircle2, Star, Trash2, AlertTriangle } from "lucide-react";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  load,
  renameTemplate,
  moveTemplate,
  duplicateTemplate,
  deleteTemplate,
  setStatus,
  setAvailability,
  setDefault,
  clearDefault,
  folderPath,
  defaultKey,
  isDefault as calcIsDefault,
  linkedCount as calcLinkedCount,
  type FirmTemplate,
  type Library,
} from "@/lib/firmTemplateLibrary";
import { useEngagements } from "@/store/EngagementsContext";
import {
  StatusChip,
  DefaultBadge,
  LinkChip,
  OfficeTag,
  RenameDialog,
  MoveToFolderDialog,
  AvailabilityDialog,
  DeleteBlockedDialog,
  DeleteConfirmDialog,
  TYPE_META,
  goTo,
} from "@/components/templates/WorkspaceShared";

interface Props {
  firmTemplateId: string;
  canEdit?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function TemplateDetailHeader({
  firmTemplateId,
  canEdit,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: Props) {
  const navigate = useNavigate();
  const { engagements } = useEngagements();
  const [lib, setLib] = useState<Library>(() => load());
  const [template, setTemplate] = useState<FirmTemplate | null>(null);

  const [renameOpen, setRenameOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [availOpen, setAvailOpen] = useState(false);
  const [deleteBlockedOpen, setDeleteBlockedOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editWarnOpen, setEditWarnOpen] = useState(false);

  const [inlineEditing, setInlineEditing] = useState(false);
  const [inlineName, setInlineName] = useState("");

  const reload = useCallback(() => {
    const l = load();
    setLib(l);
    const t = l.templates.find(t => t.id === firmTemplateId) ?? null;
    setTemplate(t);
  }, [firmTemplateId]);

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener("firmTemplateLibraryChanged", handler);
    return () => window.removeEventListener("firmTemplateLibraryChanged", handler);
  }, [reload]);

  if (!template) return null;

  const linked = calcLinkedCount(template, engagements);
  const isDefaultNow = calcIsDefault(lib, template);
  const path = folderPath(lib, template.folderId);
  const typeMeta = TYPE_META[template.type];

  const handleDelete = () => {
    const result = deleteTemplate(firmTemplateId, engagements);
    if ("blocked" in result) {
      setDeleteBlockedOpen(true);
      return;
    }
    navigate(`/templates?type=${template.type}${template.folderId ? `&folder=${template.folderId}` : ""}`);
  };

  const handleDuplicate = () => {
    const result = duplicateTemplate(firmTemplateId);
    const copies = result.templates.filter(t => t.name.startsWith(template.name) && t.id !== firmTemplateId);
    const copy = copies[copies.length - 1];
    if (copy?.nav) {
      goTo(navigate, copy.nav, { ft: copy.id });
    }
  };

  const handlePublish = () => {
    setStatus(firmTemplateId, "published");
    reload();
    toast.success("Template published");
  };

  const handleUnpublish = () => {
    setStatus(firmTemplateId, "draft");
    reload();
    toast.success("Template unpublished");
  };

  const handleSetDefault = () => {
    setDefault(firmTemplateId);
    reload();
    const [, et, fw] = defaultKey(template).split("|");
    toast.success(`Set as default for ${et} · ${fw}`);
  };

  const handleClearDefault = () => {
    clearDefault(firmTemplateId);
    reload();
    toast.success("Default removed");
  };

  const startInlineEdit = () => {
    setInlineName(template.name);
    setInlineEditing(true);
  };

  const saveInlineName = () => {
    if (inlineName.trim() && inlineName.trim() !== template.name) {
      renameTemplate(firmTemplateId, inlineName.trim());
      reload();
    }
    setInlineEditing(false);
  };

  const cancelInlineName = () => {
    setInlineEditing(false);
    setInlineName(template.name);
  };

  const handleEditClick = () => {
    if (template.status === "published" && linked > 0) {
      setEditWarnOpen(true);
      return;
    }
    onEdit?.();
  };

  return (
    <div className="border-b border-border bg-background px-6 py-4 space-y-3">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
        <button
          className="hover:text-foreground transition-colors"
          onClick={() => navigate(`/templates?type=${template.type}`)}
        >
          Templates
        </button>
        {path.map(folder => (
          <>
            <span key={`sep-${folder.id}`} className="text-muted-foreground/50">/</span>
            <button
              key={folder.id}
              className="hover:text-foreground transition-colors"
              onClick={() => navigate(`/templates?type=${template.type}&folder=${folder.id}`)}
            >
              {folder.name}
            </button>
          </>
        ))}
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground font-medium">{template.name}</span>
      </nav>

      {/* Title row */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {inlineEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={inlineName}
                onChange={e => setInlineName(e.target.value)}
                className="h-8 text-lg font-semibold max-w-md"
                autoFocus
                onKeyDown={e => {
                  if (e.key === "Enter") saveInlineName();
                  if (e.key === "Escape") cancelInlineName();
                }}
              />
              <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600" onClick={saveInlineName}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={cancelInlineName}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground leading-tight truncate">{template.name}</h1>
              <button
                className="opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                onClick={startInlineEdit}
                aria-label="Rename"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Chips */}
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <StatusChip status={template.status} />
            {isDefaultNow && <DefaultBadge />}
            <LinkChip linked={linked} />
            {(template.engagementType !== "Any" || template.framework !== "Any") && (
              <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border", typeMeta.color)}>
                {[
                  template.engagementType !== "Any" ? template.engagementType : null,
                  template.framework !== "Any" ? template.framework : null,
                ].filter(Boolean).join(" · ")}
              </span>
            )}
            {template.availableOfficeIds.map(id => (
              <OfficeTag key={id} officeId={id} />
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {canEdit && (
            isEditing ? (
              <>
                <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button size="sm" onClick={onSave}>Save</Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={handleEditClick}>
                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                Edit
              </Button>
            )
          )}

          {template.status === "draft" ? (
            <Button size="sm" onClick={handlePublish} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              Publish
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={handleUnpublish}>
              <BookOpen className="h-3.5 w-3.5 mr-1.5" />
              Unpublish
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-max">
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={handleDuplicate}>
                <Copy className="h-4 w-4 text-primary" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setMoveOpen(true)}>
                <FolderInput className="h-4 w-4 text-primary" /> Move to folder
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setAvailOpen(true)}>
                <Building2 className="h-4 w-4 text-primary" /> Office availability
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                disabled={template.status === "draft"}
                onClick={() => isDefaultNow ? handleClearDefault() : handleSetDefault()}
              >
                <Star className={cn("h-4 w-4", isDefaultNow ? "text-yellow-500 fill-current" : "text-muted-foreground")} />
                {isDefaultNow ? "Remove default" : "Set as default"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                onClick={() => {
                  if (linked > 0) {
                    setDeleteBlockedOpen(true);
                  } else {
                    setDeleteConfirmOpen(true);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Dialogs */}
      <RenameDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        currentName={template.name}
        onSave={name => { renameTemplate(firmTemplateId, name); reload(); }}
      />
      <MoveToFolderDialog
        open={moveOpen}
        onOpenChange={setMoveOpen}
        lib={lib}
        template={template}
        onMove={folderId => {
          moveTemplate(firmTemplateId, folderId);
          reload();
          navigate(`/templates?type=${template.type}${folderId ? `&folder=${folderId}` : ""}`);
        }}
      />
      <AvailabilityDialog
        open={availOpen}
        onOpenChange={setAvailOpen}
        template={template}
        onSave={ids => { setAvailability(firmTemplateId, ids); reload(); }}
      />
      <DeleteBlockedDialog
        open={deleteBlockedOpen}
        onOpenChange={setDeleteBlockedOpen}
        name={template.name}
        linked={linked}
        canUnpublish={template.status === "published"}
        onUnpublish={() => { setStatus(firmTemplateId, "draft"); reload(); }}
      />
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        name={template.name}
        onDelete={handleDelete}
      />

      {/* Published+linked edit warning */}
      <Dialog open={editWarnOpen} onOpenChange={setEditWarnOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Template in use
            </DialogTitle>
            <DialogDescription>
              This template is linked to {linked} engagement{linked === 1 ? "" : "s"}. Editing it will affect those engagements.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditWarnOpen(false)}>Cancel</Button>
            <Button onClick={() => { setEditWarnOpen(false); onEdit?.(); }}>Edit anyway</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
