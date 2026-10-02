import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { MoreVertical, FolderPlus, Layers, FolderInput } from "lucide-react";
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
  type Library,
  type Folder,
  getActiveOfficeId,
  load,
  createFolder,
  renameFolder,
  deleteFolder,
  moveFolder,
} from "@/lib/firmTemplateLibrary";
import { useEngagements } from "@/store/EngagementsContext";
import {
  RenameDialog,
  NewFolderDialog,
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

  const disabledIds = new Set<string>();
  disabledIds.add(folder.id);
  const collectDescendants = (id: string) => {
    lib.folders.filter(f => f.parentId === id).forEach(f => {
      disabledIds.add(f.id);
      collectDescendants(f.id);
    });
  };
  collectDescendants(folder.id);

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

  // Auto-expand ancestors of the selected folder
  useEffect(() => {
    if (!folderParam) return;
    const toExpand = new Set<string>();
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

  // Templates (office-filtered, no search — used for count badge)
  const allTemplates = lib.templates.filter(t => {
    if (t.type !== type) return false;
    if (!t.availableOfficeIds.includes(activeOfficeId)) return false;
    return true;
  });

  // Search: filter folders by name, also show ancestors of matching folders
  const visibleFolderIds: Set<string> | null = q ? (() => {
    const ids = new Set<string>();
    allFolders.forEach(f => {
      if (f.name.toLowerCase().includes(q)) {
        ids.add(f.id);
        let current = lib.folders.find(x => x.id === f.parentId);
        while (current) {
          ids.add(current.id);
          current = lib.folders.find(x => x.id === current!.parentId);
        }
      }
    });
    return ids;
  })() : null;

  // Auto-expand matching folders and their ancestors when search changes
  useEffect(() => {
    if (!q) return;
    const toExpand = new Set<string>();
    allFolders.forEach(f => {
      if (f.name.toLowerCase().includes(q)) {
        toExpand.add(f.id);
        let current = lib.folders.find(x => x.id === f.parentId);
        while (current) {
          toExpand.add(current.id);
          current = lib.folders.find(x => x.id === current!.parentId);
        }
      }
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

  function refresh() { setLib(load()); }

  function handleFolderClick(folder: Folder) {
    if (folderParam === folder.id) {
      // Already selected — toggle expand/collapse only
      toggleFolder(folder.id);
      return;
    }
    if (onTemplatesPage) {
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

  function handleDeleteFolder(folder: Folder) {
    const result = deleteFolder(folder.id, engagements);
    if (!("blocked" in result)) {
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

  const hoverClass = dark ? "hover:bg-white/10" : "hover:bg-muted/50";
  const activeClass = dark ? "bg-white/10 text-white" : "bg-primary/10 text-primary";

  function renderFolder(folder: Folder) {
    const isExpanded = expandedFolders.has(folder.id);
    const isActive = folderParam === folder.id;
    const childFolders = allFolders.filter(f => f.parentId === folder.id &&
      (visibleFolderIds === null || visibleFolderIds.has(f.id)));
    const directCount = allTemplates.filter(t => t.folderId === folder.id).length;
    const folderTextClass = isActive ? (dark ? "text-white" : "text-primary") : (dark ? "text-white" : "text-foreground");
    const hasSubfolders = allFolders.some(f => f.parentId === folder.id);

    return (
      <div key={folder.id}>
        <div
          className={cn("group flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer text-sm font-semibold select-none", isActive ? activeClass : hoverClass, folderTextClass)}
          onClick={() => handleFolderClick(folder)}
        >
          {/* Expand/collapse icon — only when folder has subfolders */}
          {hasSubfolders ? (
            <span
              className="flex-shrink-0"
              onClick={e => { e.stopPropagation(); toggleFolder(folder.id); }}
            >
              {isExpanded
                ? <FolderMinusIcon className="h-4 w-4 text-primary" />
                : <FolderPlusIcon className="h-4 w-4 text-primary" />
              }
            </span>
          ) : (
            <span className="w-4 flex-shrink-0" />
          )}
          <FolderSolidIcon className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="truncate flex-1">{folder.name}</span>
          <span className={cn("text-xs group-hover:hidden", dark ? "text-white/40" : "text-muted-foreground")}>
            {directCount}
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
        {isExpanded && childFolders.length > 0 && (
          <div className="ml-1">
            {childFolders.map(renderFolder)}
          </div>
        )}
      </div>
    );
  }

  const hasFolders = rootFolders.length > 0;
  const hasNoFolders = !hasFolders;
  const visibleRootFolders = visibleFolderIds !== null
    ? rootFolders.filter(f => visibleFolderIds.has(f.id))
    : rootFolders;
  const noSearchResults = q && visibleFolderIds !== null && visibleFolderIds.size === 0;

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

      {!hasFolders ? (
        <div className="flex flex-col items-center justify-center h-24 gap-2 text-center px-4">
          <p className={cn("text-sm font-medium", dark ? "text-white/70" : "text-muted-foreground")}>No folders yet</p>
          <p className={cn("text-xs", dark ? "text-white/40" : "text-muted-foreground/70")}>Copy from Global Templates to get started</p>
          <button
            className={cn("text-xs font-medium mt-1", dark ? "text-white/60 hover:text-white/90" : "text-primary hover:underline")}
            onClick={() => setNewSubfolderParent(null)}
          >
            New folder
          </button>
        </div>
      ) : noSearchResults ? (
        <div className="flex flex-col items-center justify-center h-24 gap-1 text-center px-4">
          <p className={cn("text-sm", dark ? "text-white/50" : "text-muted-foreground")}>No folders match &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {visibleRootFolders.map(renderFolder)}
        </div>
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
