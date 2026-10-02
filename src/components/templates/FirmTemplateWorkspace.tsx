import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FolderOpen, FileText, ChevronRight, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  type TemplateTypeId,
  type FirmTemplate,
  type Library,
  getActiveOfficeId,
  linkedCount as calcLinkedCount,
  isDefault as calcIsDefault,
  folderPath,
  load,
  renameTemplate,
  moveTemplate,
  duplicateTemplate,
  deleteTemplate,
  setStatus,
  setDefault,
  clearDefault,
  setAvailability,
} from "@/lib/firmTemplateLibrary";
import { useEngagements } from "@/store/EngagementsContext";
import {
  TYPE_META,
  StatusChip,
  LinkChip,
  DefaultBadge,
  OfficeTag,
  TemplateThumbnail,
  TemplateActionsMenu,
  TypeSelect,
  OfficeSelect,
  ViewToggle,
  Pagination,
  RenameDialog,
  MoveToFolderDialog,
  AvailabilityDialog,
  DeleteBlockedDialog,
  DeleteConfirmDialog,
  relativeTime,
  goTo,
  type ViewMode,
  type PageSize,
} from "./WorkspaceShared";

interface Props {
  type: TemplateTypeId | "all";
  folderId: string | null;
  onTypeChange: (v: TemplateTypeId | "all") => void;
  onFolderChange: (id: string | null) => void;
  onOpenGlobal: () => void;
}

export function FirmTemplateWorkspace({ type, folderId, onTypeChange, onFolderChange, onOpenGlobal }: Props) {
  const navigate = useNavigate();
  const { engagements } = useEngagements();
  const [lib, setLib] = useState<Library>(() => load());

  // Filters
  const [search, setSearch] = useState("");
  const [officeFilter, setOfficeFilter] = useState<string | "all">(() => getActiveOfficeId());
  const [statusFilter, setStatusFilter] = useState<"any" | "published" | "draft">("any");
  const [linkFilter, setLinkFilter] = useState<"any" | "linked" | "not-linked">("any");
  const [sort, setSort] = useState<"az" | "za" | "recent">("az");

  // View
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try { return (localStorage.getItem("templatesViewMode") as ViewMode) ?? "grid"; } catch { return "grid"; }
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(20);

  // Dialog state
  const [renameTarget, setRenameTarget] = useState<FirmTemplate | null>(null);
  const [moveTarget, setMoveTarget] = useState<FirmTemplate | null>(null);
  const [availabilityTarget, setAvailabilityTarget] = useState<FirmTemplate | null>(null);
  const [deleteBlockedTarget, setDeleteBlockedTarget] = useState<{ t: FirmTemplate; linked: number } | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<FirmTemplate | null>(null);

  function refresh() { setLib(load()); }

  useEffect(() => {
    const onChanged = () => refresh();
    const onFirmSwitched = () => { setOfficeFilter(getActiveOfficeId()); refresh(); };
    window.addEventListener("firmTemplateLibraryChanged", onChanged);
    window.addEventListener("firmSwitched", onFirmSwitched);
    window.addEventListener("engagementTemplateSaved", onChanged);
    window.addEventListener("checklistSaved", onChanged);
    return () => {
      window.removeEventListener("firmTemplateLibraryChanged", onChanged);
      window.removeEventListener("firmSwitched", onFirmSwitched);
      window.removeEventListener("engagementTemplateSaved", onChanged);
      window.removeEventListener("checklistSaved", onChanged);
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [type, folderId, search, officeFilter, statusFilter, linkFilter, sort]);

  function saveViewMode(v: ViewMode) {
    setViewMode(v);
    try { localStorage.setItem("templatesViewMode", v); } catch { /* ignore */ }
  }

  // Breadcrumb
  const crumbs = folderId ? folderPath(lib, folderId) : [];

  // Templates pool
  const typeTemplates = type === "all"
    ? lib.templates
    : lib.templates.filter(t => t.type === type);

  // Apply filters (folder scope: direct members only)
  const filtered = useMemo(() => {
    let list = folderId
      ? typeTemplates.filter(t => t.folderId === folderId)
      : typeTemplates;

    if (officeFilter !== "all") {
      list = list.filter(t => t.availableOfficeIds.includes(officeFilter));
    }
    if (statusFilter !== "any") {
      list = list.filter(t => t.status === statusFilter);
    }
    if (linkFilter !== "any") {
      list = list.filter(t => {
        const lc = calcLinkedCount(t, engagements);
        return linkFilter === "linked" ? lc > 0 : lc === 0;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        (t.folderId && lib.folders.find(f => f.id === t.folderId)?.name.toLowerCase().includes(q)) ||
        (t.standards ?? "").toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return list;
  }, [typeTemplates, folderId, officeFilter, statusFilter, linkFilter, search, sort, engagements, lib]);

  const pagedTemplates = filtered.slice((page - 1) * pageSize, page * pageSize);
  const hasFilters = search || officeFilter !== getActiveOfficeId() || statusFilter !== "any" || linkFilter !== "any";

  function clearAll() {
    setSearch("");
    setStatusFilter("any");
    setLinkFilter("any");
    setSort("az");
    setPage(1);
  }

  function handleDelete(t: FirmTemplate) {
    const lc = calcLinkedCount(t, engagements);
    if (lc > 0) setDeleteBlockedTarget({ t, linked: lc });
    else setDeleteConfirmTarget(t);
  }

  const typeLabel = type === "all" ? "All templates" : TYPE_META[type].label;
  const showCreate = type !== "all" && ["letters", "checklists", "reports", "notes"].includes(type);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FolderOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground truncate">My Firm Template Workspace</h2>
            <p className="text-xs text-muted-foreground">Build and manage your firm's templates.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <TypeSelect value={type} onChange={v => onTypeChange(v)} />
          <Button variant="outline" size="sm" className="gap-1.5 h-8" onClick={onOpenGlobal}>
            <FileText className="h-3.5 w-3.5" />
            Browse Global Library
          </Button>
          {showCreate && (
            <Button size="sm" className="gap-1.5 h-8 bg-[#1C63A6] hover:bg-[#1a5a9e] text-white" onClick={() => navigate("/create", { state: { contentType: type } })}>
              <Plus className="h-3.5 w-3.5" />
              Create
            </Button>
          )}
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-border flex-shrink-0 flex-wrap">
        <div className="relative flex-1 min-w-36 max-w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8 h-8 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <OfficeSelect value={officeFilter} onChange={setOfficeFilter} />
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={linkFilter} onValueChange={v => setLinkFilter(v as typeof linkFilter)}>
          <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any engagement</SelectItem>
            <SelectItem value="linked">Linked</SelectItem>
            <SelectItem value="not-linked">Not linked</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={v => setSort(v as typeof sort)}>
          <SelectTrigger className="w-40 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="az">Name (A–Z)</SelectItem>
            <SelectItem value="za">Name (Z–A)</SelectItem>
            <SelectItem value="recent">Recently updated</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearAll}>Clear all</Button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <ViewToggle value={viewMode} onChange={saveViewMode} />
        </div>
      </div>

      {/* Count + breadcrumb + pagination */}
      <div className="flex items-center gap-3 px-6 py-2 border-b border-border flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-1 text-sm text-muted-foreground flex-1 min-w-0">
          {crumbs.length > 0 ? (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">All templates</span>
              {crumbs.map(crumb => (
                <span key={crumb.id} className="flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                  <span className="text-foreground font-medium">{crumb.name}</span>
                </span>
              ))}
              <button
                className="ml-1 p-0.5 hover:bg-muted rounded"
                onClick={() => onFolderChange(null)}
                title="Clear folder filter"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <span>
              <span className="font-medium text-foreground">{typeLabel}</span>
              <span className="mx-1">·</span>
              {filtered.length} template{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Pagination
          total={filtered.length}
          page={page}
          pageSize={pageSize}
          onPage={setPage}
          onPageSize={ps => { setPageSize(ps); setPage(1); }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {pagedTemplates.length === 0 && filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            {hasFilters ? (
              <>
                <p className="text-base font-medium text-foreground">No templates match your filters</p>
                <Button variant="outline" size="sm" onClick={clearAll}>Clear all</Button>
              </>
            ) : folderId ? (
              <>
                {lib.folders.some(f => f.parentId === folderId) ? (
                  <p className="text-base font-medium text-foreground">
                    No templates in {crumbs[crumbs.length - 1]?.name ?? "this folder"}. Open a subfolder in the left menu to see its templates.
                  </p>
                ) : (
                  <>
                    <p className="text-base font-medium text-foreground">
                      No templates in {crumbs[crumbs.length - 1]?.name ?? "this folder"}
                    </p>
                    <Button variant="outline" size="sm" onClick={onOpenGlobal}>Browse Global Library</Button>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="text-base font-medium text-foreground">
                  No {typeLabel} available yet
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onOpenGlobal}>Browse Global Library</Button>
                  {showCreate && (
                    <Button size="sm" className="bg-[#1C63A6] hover:bg-[#1a5a9e] text-white" onClick={() => navigate("/create", { state: { contentType: type } })}>
                      Create
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pagedTemplates.map(t => {
              const linked = calcLinkedCount(t, engagements);
              const isDefaultNow = calcIsDefault(lib, t);
              const tPath = folderPath(lib, t.folderId);
              const folderLabel = tPath.length > 0 ? tPath.map(f => f.name).join(" / ") : "Root";
              const tMeta = TYPE_META[t.type];

              return (
                <div key={t.id} className="rounded-xl border border-border bg-card flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                  <TemplateThumbnail type={t.type} cornerTag={t.cornerTag} className="m-3 mb-2 h-28" />
                  <div className="px-4 pb-2 flex-1 space-y-1.5">
                    <div className="flex items-start gap-1 justify-between">
                      <p className="text-sm font-semibold text-foreground leading-snug flex-1 min-w-0">{t.name}</p>
                      {isDefaultNow && <DefaultBadge />}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{t.subtitle}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      <StatusChip status={t.status} />
                      <LinkChip linked={linked} />
                    </div>
                    {t.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border mr-1">
                        {tag}
                      </span>
                    ))}
                    {t.standards && (
                      <p className="text-[10px] text-muted-foreground/70 pt-1">{t.standards}</p>
                    )}
                    <OfficeTag officeId={t.ownerOfficeId} />
                    {type === "all" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-border text-muted-foreground gap-1">
                        <tMeta.icon className={cn("h-3 w-3", tMeta.color)} />
                        {tMeta.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-border mt-auto">
                    <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">{folderLabel} · {relativeTime(t.updatedAt)}</span>
                    <div className="flex items-center gap-1">
                      <TemplateActionsMenu
                        template={t}
                        lib={lib}
                        engagements={engagements}
                        onRename={() => setRenameTarget(t)}
                        onMoveToFolder={() => setMoveTarget(t)}
                        onAvailability={() => setAvailabilityTarget(t)}
                        onDuplicate={() => { duplicateTemplate(t.id); refresh(); toast.success("Template duplicated"); }}
                        onPublish={() => { setStatus(t.id, "published"); refresh(); toast.success("Template published"); }}
                        onUnpublish={() => { setStatus(t.id, "draft"); refresh(); toast.success("Template unpublished"); }}
                        onSetDefault={() => { setDefault(t.id); refresh(); }}
                        onClearDefault={() => { clearDefault(t.id); refresh(); }}
                        onDelete={() => handleDelete(t)}
                      />
                      <Button
                        size="sm"
                        className="h-7 px-2.5 text-xs bg-[#1C63A6] hover:bg-[#1a5a9e] text-white"
                        disabled={!t.nav}
                        onClick={() => goTo(navigate, t.nav)}
                        title={!t.nav ? "Viewer not available in the prototype yet" : undefined}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            {pagedTemplates.map((t, i) => {
              const linked = calcLinkedCount(t, engagements);
              const isDefaultNow = calcIsDefault(lib, t);
              const tPath = folderPath(lib, t.folderId);
              const folderLabel = tPath.length > 0 ? tPath.map(f => f.name).join(" / ") : "Root";
              const tMeta = TYPE_META[t.type];
              const Icon = tMeta.icon;

              return (
                <div
                  key={t.id}
                  className={cn(
                    "flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-muted/40 transition-colors",
                    i > 0 && "border-t border-border",
                    !t.nav && "opacity-70 cursor-default"
                  )}
                  onClick={() => goTo(navigate, t.nav)}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", tMeta.color)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                      {isDefaultNow && <DefaultBadge />}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{folderLabel} · {t.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <OfficeTag officeId={t.ownerOfficeId} />
                    <StatusChip status={t.status} />
                    <LinkChip linked={linked} />
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">{relativeTime(t.updatedAt)}</span>
                    <TemplateActionsMenu
                      template={t}
                      lib={lib}
                      engagements={engagements}
                      onRename={() => setRenameTarget(t)}
                      onMoveToFolder={() => setMoveTarget(t)}
                      onAvailability={() => setAvailabilityTarget(t)}
                      onDuplicate={() => { duplicateTemplate(t.id); refresh(); toast.success("Template duplicated"); }}
                      onPublish={() => { setStatus(t.id, "published"); refresh(); toast.success("Template published"); }}
                      onUnpublish={() => { setStatus(t.id, "draft"); refresh(); toast.success("Template unpublished"); }}
                      onSetDefault={() => { setDefault(t.id); refresh(); }}
                      onClearDefault={() => { clearDefault(t.id); refresh(); }}
                      onDelete={() => handleDelete(t)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialogs */}
      {renameTarget && (
        <RenameDialog
          open={!!renameTarget}
          onOpenChange={v => !v && setRenameTarget(null)}
          currentName={renameTarget.name}
          onSave={name => { renameTemplate(renameTarget.id, name); refresh(); toast.success("Renamed"); setRenameTarget(null); }}
        />
      )}
      {moveTarget && (
        <MoveToFolderDialog
          open={!!moveTarget}
          onOpenChange={v => !v && setMoveTarget(null)}
          lib={lib}
          template={moveTarget}
          onMove={fid => { moveTemplate(moveTarget.id, fid); refresh(); toast.success("Moved"); setMoveTarget(null); }}
        />
      )}
      {availabilityTarget && (
        <AvailabilityDialog
          open={!!availabilityTarget}
          onOpenChange={v => !v && setAvailabilityTarget(null)}
          template={availabilityTarget}
          onSave={ids => { setAvailability(availabilityTarget.id, ids); refresh(); toast.success("Availability updated"); setAvailabilityTarget(null); }}
        />
      )}
      {deleteBlockedTarget && (
        <DeleteBlockedDialog
          open={!!deleteBlockedTarget}
          onOpenChange={v => !v && setDeleteBlockedTarget(null)}
          name={deleteBlockedTarget.t.name}
          linked={deleteBlockedTarget.linked}
          canUnpublish={deleteBlockedTarget.t.status === "published"}
          onUnpublish={() => { setStatus(deleteBlockedTarget.t.id, "draft"); refresh(); toast.success("Template unpublished"); }}
        />
      )}
      {deleteConfirmTarget && (
        <DeleteConfirmDialog
          open={!!deleteConfirmTarget}
          onOpenChange={v => !v && setDeleteConfirmTarget(null)}
          name={deleteConfirmTarget.name}
          onDelete={() => { deleteTemplate(deleteConfirmTarget.id, engagements); refresh(); toast.success("Template deleted"); setDeleteConfirmTarget(null); }}
        />
      )}
    </div>
  );
}
