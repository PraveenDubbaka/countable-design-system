import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { MoreVertical, FolderPlus, Layers, FolderInput } from "lucide-react";
import { Star } from "lucide-react";
import { FolderSolidIcon, FolderPlusIcon, FolderMinusIcon } from "@/components/icons/FolderIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type TemplateTypeId,
  type FirmTemplate,
  type Library,
  type Folder,
  getActiveOfficeId,
  linkedCount as calcLinkedCount,
  isDefault as calcIsDefault,
  load,
  createFolder,
  renameFolder,
  deleteFolder,
  moveFolder,
  renameTemplate,
  moveTemplate,
  duplicateTemplate,
  deleteTemplate,
  setStatus,
  setDefault,
  clearDefault,
} from "@/lib/firmTemplateLibrary";
import { useEngagements } from "@/store/EngagementsContext";
import {
  goTo,
  RenameDialog,
  MoveToFolderDialog,
  DeleteBlockedDialog,
  DeleteConfirmDialog,
  NewFolderDialog,
  TemplateActionsMenu,
} from "./WorkspaceShared";

interface Props {
  type: TemplateTypeId;
  search: string;
  dark?: boolean;
}

// Local dialog for moving a folder (MoveToFolderDialog takes FirmTemplate, not Folder)
function MoveFolderDialog({
  open,
  onOpenChange,
  lib,
  folder,
  type,
  onMove,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lib: Library;
  folder: Folder;
  type: TemplateTypeId;
  onMove: (parentId: string | null) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  // Collect all descendant IDs of folder (including itself) to disable
  const disabledIds = new Set<string>();
  disabledIds.add(folder.id);
  const collectDescendants = (id: string) => {
    lib.folders.filter(f => f.parentId === id).forEach(f => {
      disabledIds.add(f.id);
      collectDescendants(f.id);
    });
  };
  collectDescendants(folder.id);

  // Build flat list with depth for rendering
  const allFolders = lib.folders.filter(f => f.type === type);
  const rows: { folder: Folder; depth: number }[] = [];
  const addRows = (parentId: string | null, depth: number) => {
    allFolders.filter(f => f.parentId === parentId).forEach(f => {
      rows.push({ folder: f, depth });
      addRows(f.id, depth + 1);
    });
  };
  addRows(null, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Move folder</DialogTitle>
          <DialogDescription>Choose a destination for "{folder.name}".</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-48 rounded-md border p-2 my-2">
          {/* Root option */}
          <div
            className={cn(
              "flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer text-sm",
              selected === null ? "bg-primary/10 text-primary" : "hover:bg-muted"
            )}
            onClick={() => setSelected(null)}
          >
            <FolderSolidIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>Root (no parent)</span>
          </div>
          {rows.map(({ folder: f, depth }) => {
            const disabled = disabledIds.has(f.id);
            return (
              <div
                key={f.id}
                className={cn(
                  "flex items-center gap-2 py-1.5 px-2 rounded text-sm",
                  disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-muted",
                  selected === f.id && !disabled ? "bg-primary/10 text-primary" : ""
                )}
                style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
                onClick={() => { if (!disabled) setSelected(f.id); }}
              >
                <FolderSolidIcon className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="truncate">{f.name}</span>
              </div>
            );
          })}
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={() => { onMove(selected); onOpenChange(false); }}>Move</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FirmTemplatesTree({ type, search, dark = false }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { engagements } = useEngagements();
  const [lib, setLib] = useState<Library>(() => load());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const folderParam = searchParams.get("folder");
  const onTemplatesPage = location.pathname === "/templates";

  // Dialog state
  const [renameTarget, setRenameTarget] = useState<FirmTemplate | null>(null);
  const [moveTarget, setMoveTarget] = useState<FirmTemplate | null>(null);
  const [deleteBlockedTarget, setDeleteBlockedTarget] = useState<{ t: FirmTemplate; linked: number } | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<FirmTemplate | null>(null);
  const [renameFolderTarget, setRenameFolderTarget] = useState<Folder | null>(null);
  const [moveFolderTarget, setMoveFolderTarget] = useState<Folder | null>(null);
  // undefined = closed; null = root; string = specific parent
  const [newSubfolderParent, setNewSubfolderParent] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const onChanged = () => setLib(load());
    window.addEventListener("firmTemplateLibraryChanged", onChanged);
    window.addEventListener("firmSwitched", onChanged);
    window.addEventListener("engagementTemplateSaved", onChanged);
    window.addEventListener("checklistSaved", onChanged);
    return () => {
      window.removeEventListener("firmTemplateLibraryChanged", onChanged);
      window.removeEventListener("firmSwitched", onChanged);
      window.removeEventListener("engagementTemplateSaved", onChanged);
      window.removeEventListener("checklistSaved", onChanged);
    };
  }, []);

  // Auto-expand ancestors of active folder
  useEffect(() => {
    if (!folderParam) return;
    const toExpand = new Set<string>();
    // Walk ancestors
    let current = lib.folders.find(f => f.id === folderParam);
    while (current?.parentId) {
      toExpand.add(current.parentId);
      current = lib.folders.find(f => f.id === current!.parentId);
    }
    if (toExpand.size > 0) {
      setExpandedFolders(prev => new Set([...prev, ...toExpand]));
    }
  }, [folderParam, lib.folders]);

  const activeOfficeId = getActiveOfficeId();
  const q = search.trim().toLowerCase();

  // Folders for this type
  const allFolders = lib.folders.filter(f => f.type === type);
  const rootFolders = allFolders.filter(f => f.parentId === null);

  // Templates for this type, filtered by office and search
  const allTemplates = lib.templates.filter(t => {
    if (t.type !== type) return false;
    if (!t.availableOfficeIds.includes(activeOfficeId)) return false;
    if (q && !t.name.toLowerCase().includes(q) && !t.subtitle.toLowerCase().includes(q)) return false;
    return true;
  });

  // Auto-expand folders containing search matches
  useEffect(() => {
    if (!q) return;
    const toExpand = new Set<string>();
    allTemplates.forEach(t => {
      if (t.folderId) toExpand.add(t.folderId);
    });
    setExpandedFolders(prev => new Set([...prev, ...toExpand]));
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleFolder(id: string) {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleTemplateClick(t: FirmTemplate) {
    if (!t.nav) return;
    goTo(navigate, t.nav);
  }

  function refresh() { setLib(load()); }

  function handleDuplicate(t: FirmTemplate) {
    duplicateTemplate(t.id);
    refresh();
  }

  function handleDelete(t: FirmTemplate) {
    const lc = calcLinkedCount(t, engagements);
    if (lc > 0) {
      setDeleteBlockedTarget({ t, linked: lc });
    } else {
      setDeleteConfirmTarget(t);
    }
  }

  function handleFolderClick(folder: Folder) {
    if (onTemplatesPage) {
      // Set folder param, keep type; also expand
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set("folder", folder.id);
        return next;
      });
      setExpandedFolders(prev => new Set([...prev, folder.id]));
    } else {
      navigate(`/templates?type=${type}&folder=${folder.id}`);
    }
  }

  // Recursive descendant template count
  function countDescendants(folderId: string): number {
    let count = allTemplates.filter(t => t.folderId === folderId).length;
    allFolders.filter(f => f.parentId === folderId).forEach(f => {
      count += countDescendants(f.id);
    });
    return count;
  }

  function handleDeleteFolder(folder: Folder) {
    const result = deleteFolder(folder.id, engagements);
    if (!("blocked" in result)) {
      // If we deleted the currently-selected folder, clear param
      if (folderParam === folder.id) {
        setSearchParams(prev => {
          const next = new URLSearchParams(prev);
          next.delete("folder");
          return next;
        });
      }
      refresh();
    }
  }

  const textClass = dark ? "text-white/80" : "text-foreground";
  const hoverClass = dark ? "hover:bg-white/10" : "hover:bg-muted/50";
  const activeClass = dark ? "bg-white/10 text-white" : "bg-primary/10 text-primary";

  function renderTemplate(t: FirmTemplate) {
    const isDefaultNow = calcIsDefault(lib, t);

    return (
      <div
        key={t.id}
        className={cn(
          "group flex items-center gap-2 py-1.5 pl-6 pr-1 rounded-md cursor-pointer text-sm select-none",
          t.nav ? hoverClass : "opacity-60 cursor-default",
          textClass
        )}
        onClick={() => handleTemplateClick(t)}
      >
        <span className="truncate flex-1">
          {t.name}
          {t.status === "draft" && (
            <span className={cn("ml-1.5 text-[10px]", dark ? "text-white/40" : "text-muted-foreground")}>Draft</span>
          )}
          {isDefaultNow && (
            <Star className="inline ml-1 h-3 w-3 text-yellow-500 fill-current flex-shrink-0" />
          )}
        </span>
        <div className="opacity-0 group-hover:opacity-100 flex-shrink-0">
          <TemplateActionsMenu
            template={t}
            lib={lib}
            engagements={engagements}
            onRename={() => setRenameTarget(t)}
            onMoveToFolder={() => setMoveTarget(t)}
            onAvailability={() => { /* simplified for tree */ }}
            onDuplicate={() => handleDuplicate(t)}
            onPublish={() => { setStatus(t.id, "published"); refresh(); }}
            onUnpublish={() => { setStatus(t.id, "draft"); refresh(); }}
            onSetDefault={() => { setDefault(t.id); refresh(); }}
            onClearDefault={() => { clearDefault(t.id); refresh(); }}
            onDelete={() => handleDelete(t)}
          />
        </div>
      </div>
    );
  }

  function renderFolder(folder: Folder) {
    const isExpanded = expandedFolders.has(folder.id);
    const isActive = folderParam === folder.id;
    const childFolders = allFolders.filter(f => f.parentId === folder.id);
    const folderTemplates = allTemplates.filter(t => t.folderId === folder.id);
    const count = countDescendants(folder.id);
    const folderTextClass = isActive ? (dark ? "text-white" : "text-primary") : (dark ? "text-white" : "text-foreground");
    const folderBgClass = isActive ? activeClass : "";

    return (
      <div key={folder.id}>
        <div
          className={cn("group flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer text-sm font-semibold select-none", isActive ? folderBgClass : hoverClass, folderTextClass)}
          onClick={() => handleFolderClick(folder)}
        >
          {/* Expand/collapse icon — own element to stop propagation */}
          <span
            className="flex-shrink-0"
            onClick={e => { e.stopPropagation(); toggleFolder(folder.id); }}
          >
            {isExpanded
              ? <FolderMinusIcon className="h-4 w-4 text-primary" />
              : <FolderPlusIcon className="h-4 w-4 text-primary" />
            }
          </span>
          <FolderSolidIcon className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="truncate flex-1">{folder.name}</span>
          <span className={cn("text-xs group-hover:hidden", dark ? "text-white/40" : "text-muted-foreground")}>
            {count}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted-foreground/10 rounded transition-opacity flex-shrink-0">
                <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); setNewSubfolderParent(folder.id); }}>
                <FolderPlus className="h-4 w-4 text-primary" /> New subfolder
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); setRenameFolderTarget(folder); }}>
                <span className="h-4 w-4 text-primary text-base leading-none">✏</span> Rename
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={e => { e.stopPropagation(); setMoveFolderTarget(folder); }}>
                <FolderInput className="h-4 w-4 text-primary" /> Move to…
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                onClick={e => { e.stopPropagation(); handleDeleteFolder(folder); }}
              >
                <span className="h-4 w-4 text-destructive text-base leading-none">🗑</span> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isExpanded && (
          <div className="ml-1">
            {childFolders.map(renderFolder)}
            {folderTemplates.map(renderTemplate)}
          </div>
        )}
      </div>
    );
  }

  const rootTemplates = allTemplates.filter(t => !t.folderId);
  const hasAny = allTemplates.length > 0 || rootFolders.length > 0;
  const hasNoFolders = rootFolders.length === 0;

  return (
    <>
      {/* All templates row */}
      <div
        className={cn(
          "group flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer text-sm font-semibold select-none mb-0.5",
          !folderParam ? activeClass : hoverClass,
          !folderParam ? (dark ? "text-white" : "text-primary") : (dark ? "text-white" : "text-foreground")
        )}
        onClick={() => {
          setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.delete("folder");
            return next;
          });
        }}
      >
        <Layers className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1">All templates</span>
        {hasNoFolders && (
          <button
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted-foreground/10 rounded transition-opacity flex-shrink-0"
            onClick={e => { e.stopPropagation(); setNewSubfolderParent(null); }}
            title="New folder"
          >
            <FolderPlus className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {!hasAny ? (
        <div className="flex flex-col items-center justify-center h-24 gap-2 text-center px-4">
          <p className={cn("text-sm font-medium", dark ? "text-white/70" : "text-muted-foreground")}>No templates yet</p>
          <p className={cn("text-xs", dark ? "text-white/40" : "text-muted-foreground/70")}>Copy from Global Templates to get started</p>
          <button
            className={cn("text-xs font-medium mt-1", dark ? "text-white/60 hover:text-white/90" : "text-primary hover:underline")}
            onClick={() => setNewSubfolderParent(null)}
          >
            New folder
          </button>
        </div>
      ) : q && allTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-24 gap-1 text-center px-4">
          <p className={cn("text-sm", dark ? "text-white/50" : "text-muted-foreground")}>No results for &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {rootFolders.map(renderFolder)}
          {rootTemplates.map(renderTemplate)}
        </div>
      )}

      {/* Rename template dialog */}
      {renameTarget && (
        <RenameDialog
          open={!!renameTarget}
          onOpenChange={v => !v && setRenameTarget(null)}
          currentName={renameTarget.name}
          onSave={name => { renameTemplate(renameTarget.id, name); refresh(); setRenameTarget(null); }}
        />
      )}

      {/* Move template dialog */}
      {moveTarget && (
        <MoveToFolderDialog
          open={!!moveTarget}
          onOpenChange={v => !v && setMoveTarget(null)}
          lib={lib}
          template={moveTarget}
          onMove={fid => { moveTemplate(moveTarget.id, fid); refresh(); setMoveTarget(null); }}
        />
      )}

      {/* Delete blocked */}
      {deleteBlockedTarget && (
        <DeleteBlockedDialog
          open={!!deleteBlockedTarget}
          onOpenChange={v => !v && setDeleteBlockedTarget(null)}
          name={deleteBlockedTarget.t.name}
          linked={deleteBlockedTarget.linked}
          canUnpublish={deleteBlockedTarget.t.status === "published"}
          onUnpublish={() => { setStatus(deleteBlockedTarget.t.id, "draft"); refresh(); }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirmTarget && (
        <DeleteConfirmDialog
          open={!!deleteConfirmTarget}
          onOpenChange={v => !v && setDeleteConfirmTarget(null)}
          name={deleteConfirmTarget.name}
          onDelete={() => { deleteTemplate(deleteConfirmTarget.id, engagements); refresh(); setDeleteConfirmTarget(null); }}
        />
      )}

      {/* Rename folder */}
      {renameFolderTarget && (
        <RenameDialog
          open={!!renameFolderTarget}
          onOpenChange={v => !v && setRenameFolderTarget(null)}
          currentName={renameFolderTarget.name}
          onSave={name => { renameFolder(renameFolderTarget.id, name); refresh(); setRenameFolderTarget(null); }}
        />
      )}

      {/* Move folder */}
      {moveFolderTarget && (
        <MoveFolderDialog
          open={!!moveFolderTarget}
          onOpenChange={v => !v && setMoveFolderTarget(null)}
          lib={lib}
          folder={moveFolderTarget}
          type={type}
          onMove={parentId => { moveFolder(moveFolderTarget.id, parentId); refresh(); setMoveFolderTarget(null); }}
        />
      )}

      {/* New subfolder — undefined=closed, null=root, string=specific parent */}
      <NewFolderDialog
        open={newSubfolderParent !== undefined}
        onOpenChange={v => !v && setNewSubfolderParent(undefined)}
        onCreate={name => {
          if (newSubfolderParent !== undefined) {
            createFolder(type, name, newSubfolderParent);
            refresh();
          }
        }}
      />
    </>
  );
}
