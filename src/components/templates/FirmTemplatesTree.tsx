import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MoreVertical, FolderPlus } from "lucide-react";
import { Star } from "lucide-react";
import { FolderSolidIcon, FolderPlusIcon, FolderMinusIcon } from "@/components/icons/FolderIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  TYPE_META,
} from "./WorkspaceShared";

interface Props {
  type: TemplateTypeId;
  search: string;
  dark?: boolean;
}

export function FirmTemplatesTree({ type, search, dark = false }: Props) {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const { engagements } = useEngagements();
  const [lib, setLib] = useState<Library>(() => load());
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Dialog state
  const [renameTarget, setRenameTarget] = useState<FirmTemplate | null>(null);
  const [moveTarget, setMoveTarget] = useState<FirmTemplate | null>(null);
  const [deleteBlockedTarget, setDeleteBlockedTarget] = useState<{ t: FirmTemplate; linked: number } | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<FirmTemplate | null>(null);
  const [renameFolderTarget, setRenameFolderTarget] = useState<Folder | null>(null);
  const [newSubfolderParent, setNewSubfolderParent] = useState<string | null>(null);

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

  function renderTemplate(t: FirmTemplate) {
    const isDefaultNow = calcIsDefault(lib, t);
    const textClass = dark ? "text-white/80" : "text-foreground";
    const hoverClass = dark ? "hover:bg-white/10" : "hover:bg-muted/50";

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
    const folderTemplates = allTemplates.filter(t => t.folderId === folder.id);
    const childFolders = allFolders.filter(f => f.parentId === folder.id);
    const hasContent = folderTemplates.length > 0 || childFolders.length > 0;
    const textClass = dark ? "text-white" : "text-foreground";
    const hoverClass = dark ? "hover:bg-white/10" : "hover:bg-muted/50";

    return (
      <div key={folder.id}>
        <div
          className={cn("group flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer text-sm font-semibold select-none", hoverClass, textClass)}
          onClick={() => toggleFolder(folder.id)}
        >
          {isExpanded
            ? <FolderMinusIcon className="h-4 w-4 text-primary flex-shrink-0" />
            : <FolderPlusIcon className="h-4 w-4 text-primary flex-shrink-0" />
          }
          <FolderSolidIcon className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="truncate flex-1">{folder.name}</span>
          <span className={cn("text-xs group-hover:hidden", dark ? "text-white/40" : "text-muted-foreground")}>
            {folderTemplates.length + childFolders.length}
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
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                onClick={e => {
                  e.stopPropagation();
                  const result = deleteFolder(folder.id, engagements);
                  if ("blocked" in result) {
                    // toast blocked
                  } else {
                    refresh();
                  }
                }}
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

  if (!hasAny) {
    return (
      <div className="flex flex-col items-center justify-center h-24 gap-2 text-center px-4">
        <p className={cn("text-sm font-medium", dark ? "text-white/70" : "text-muted-foreground")}>No templates yet</p>
        <p className={cn("text-xs", dark ? "text-white/40" : "text-muted-foreground/70")}>Copy from Global Templates to get started</p>
      </div>
    );
  }

  if (q && allTemplates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-24 gap-1 text-center px-4">
        <p className={cn("text-sm", dark ? "text-white/50" : "text-muted-foreground")}>No results for &ldquo;{search}&rdquo;</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-0.5">
        {rootFolders.map(renderFolder)}
        {rootTemplates.map(renderTemplate)}
      </div>

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

      {/* New subfolder */}
      <NewFolderDialog
        open={newSubfolderParent !== null}
        onOpenChange={v => !v && setNewSubfolderParent(null)}
        onCreate={name => { if (newSubfolderParent !== null) { createFolder(type, name, newSubfolderParent); refresh(); } }}
      />
    </>
  );
}
