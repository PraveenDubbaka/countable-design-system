import { useState, useEffect, useMemo } from "react";
import { Search, X, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  type TemplateTypeId,
  type Framework,
  getActiveOfficeId,
  getOffices,
  readLibrary,
  isInFirmLibrary,
} from "@/lib/firmTemplateLibrary";
import {
  getGlobalItems,
  type GlobalItem,
  type GlobalEngType,
  type EntityType,
} from "@/lib/globalTemplateCatalog";
import {
  TYPE_META,
  TypeSelect,
  ViewToggle,
  Pagination,
  type ViewMode,
  type PageSize,
} from "./WorkspaceShared";
import { AddToFirmDialog } from "./AddToFirmDialog";

interface Props {
  type: TemplateTypeId | "all";
  gfolder: string | null;
  onTypeChange: (v: TemplateTypeId | "all") => void;
  onBackToFirm: () => void;
}

const REGIONS = [
  { value: "all", label: "All regions" },
  { value: "CA", label: "🇨🇦 Canada" },
  { value: "US", label: "🇺🇸 United States" },
] as const;

const FRAMEWORKS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All frameworks" },
  { value: "ASPE", label: "ASPE" },
  { value: "ASNPO", label: "ASNPO" },
  { value: "IFRS", label: "IFRS" },
  { value: "US GAAP", label: "US GAAP" },
  { value: "Tax basis", label: "Tax basis" },
  { value: "Any", label: "Any" },
];

const ENTITY_TYPES: Array<{ value: string; label: string }> = [
  { value: "all", label: "All entities" },
  { value: "Corporation", label: "Corporation" },
  { value: "Partnership", label: "Partnership" },
  { value: "Not-for-profit", label: "Not-for-profit" },
  { value: "Trust", label: "Trust" },
  { value: "Sole proprietorship", label: "Sole proprietorship" },
  { value: "LLC", label: "LLC" },
  { value: "Any", label: "Any" },
];

function defaultRegion(): "CA" | "US" | "all" {
  const offices = getOffices();
  const activeId = getActiveOfficeId();
  const active = offices.find(o => o.id === activeId);
  if (active?.region === "ca") return "CA";
  if (active?.region === "us") return "US";
  return "all";
}

function InFirmChip() {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
      In firm library
    </span>
  );
}

function SuggestedChip() {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand/10 text-brand border border-brand/20">
      Suggested
    </span>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
      {label}
    </span>
  );
}

function GlobalItemCard({
  item,
  selected,
  onToggle,
  inFirm,
  onAdd,
}: {
  item: GlobalItem;
  selected: boolean;
  onToggle: () => void;
  inFirm: boolean;
  onAdd: () => void;
}) {
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "relative group rounded-xl border border-border bg-card p-4 flex flex-col gap-3 transition-shadow hover:shadow-md cursor-default",
        selected && "ring-2 ring-primary border-primary"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          className="mt-0.5 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={cn("h-4 w-4 flex-shrink-0", meta.color)} />
            <p className="text-sm font-semibold truncate text-foreground">{item.name}</p>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{item.subtitle}</p>
          <div className="flex flex-wrap gap-1">
            {item.suggested && <SuggestedChip />}
            {inFirm && <InFirmChip />}
            {item.framework !== "Any" && <Chip label={item.framework} />}
            {item.entityType !== "Any" && <Chip label={item.entityType} />}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-1 border-t border-border">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={onAdd}
          disabled={inFirm}
        >
          {inFirm ? "Already added" : "Add to firm"}
        </Button>
      </div>
    </div>
  );
}

function GlobalItemRow({
  item,
  selected,
  onToggle,
  inFirm,
  onAdd,
}: {
  item: GlobalItem;
  selected: boolean;
  onToggle: () => void;
  inFirm: boolean;
  onAdd: () => void;
}) {
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors",
        selected && "bg-primary/5"
      )}
    >
      <Checkbox checked={selected} onCheckedChange={onToggle} className="flex-shrink-0" />
      <Icon className={cn("h-4 w-4 flex-shrink-0", meta.color)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
      </div>
      <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
        {item.suggested && <SuggestedChip />}
        {inFirm && <InFirmChip />}
        {item.framework !== "Any" && <Chip label={item.framework} />}
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs flex-shrink-0"
        onClick={onAdd}
        disabled={inFirm}
      >
        {inFirm ? "Already added" : "Add to firm"}
      </Button>
    </div>
  );
}

export function GlobalLibraryWorkspace({ type, gfolder, onTypeChange, onBackToFirm }: Props) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<"CA" | "US" | "all">(() => defaultRegion());
  const [framework, setFramework] = useState<Framework | "all">("all");
  const [entityType, setEntityType] = useState<EntityType | "all">("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [pageSize] = useState<PageSize>(20);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lib, setLib] = useState(() => readLibrary());
  const [dialogItems, setDialogItems] = useState<GlobalItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sync library on external changes
  useEffect(() => {
    function onLibChange() { setLib(readLibrary()); }
    function onFirmSwitched() {
      setRegion(defaultRegion());
      onLibChange();
    }
    window.addEventListener("firmTemplateLibraryChanged", onLibChange);
    window.addEventListener("firmSwitched", onFirmSwitched);
    return () => {
      window.removeEventListener("firmTemplateLibraryChanged", onLibChange);
      window.removeEventListener("firmSwitched", onFirmSwitched);
    };
  }, []);

  const allItems = useMemo(() => getGlobalItems(type), [type]);

  const filtered = useMemo(() => {
    let items = allItems;
    if (gfolder) items = items.filter(i => i.engagementType === gfolder);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q));
    }
    if (region !== "all") items = items.filter(i => i.region === region || i.region === "Both");
    if (framework !== "all") items = items.filter(i => i.framework === framework);
    if (entityType !== "all") items = items.filter(i => i.entityType === entityType || i.entityType === "Any");
    return items;
  }, [allItems, gfolder, search, region, framework, entityType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const hasFilters = search || region !== "all" || framework !== "all" || entityType !== "all";

  function clearFilters() {
    setSearch("");
    setRegion(defaultRegion());
    setFramework("all");
    setEntityType("all");
    setPage(1);
  }

  function toggleItem(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function openAddDialog(items: GlobalItem[]) {
    setDialogItems(items);
    setDialogOpen(true);
  }

  function handleAdded() {
    setSelected(new Set());
    setLib(readLibrary());
  }

  const selectedItems = filtered.filter(i => selected.has(i.id));
  const selectedNotInFirm = selectedItems.filter(i => !isInFirmLibrary(lib, i.id));

  const gfolderLabel = gfolder ? ` — ${gfolder}` : "";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border px-6 py-4">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground">Global Template Library</h1>
            <p className="text-sm text-muted-foreground">
              Browse and add Countable's pre-built templates to your firm library
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <TypeSelect value={type} onChange={v => { onTypeChange(v); setPage(1); setSelected(new Set()); }} />
            <Button variant="outline" size="sm" onClick={onBackToFirm} className="h-8 text-sm whitespace-nowrap">
              My Firm Templates
            </Button>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-border flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-8 h-8 text-sm"
          />
        </div>

        <Select value={region} onValueChange={v => { setRegion(v as "CA" | "US" | "all"); setPage(1); }}>
          <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {REGIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={framework} onValueChange={v => { setFramework(v as Framework | "all"); setPage(1); }}>
          <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FRAMEWORKS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={entityType} onValueChange={v => { setEntityType(v as EntityType | "all"); setPage(1); }}>
          <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ENTITY_TYPES.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs gap-1">
            <X className="h-3 w-3" /> Clear all
          </Button>
        )}

        <div className="ml-auto">
          <ViewToggle value={view} onChange={setView} />
        </div>
      </div>

      {/* Count + pagination */}
      <div className="flex-shrink-0 px-6 py-2 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtered.length} template{filtered.length !== 1 ? "s" : ""}
          {gfolderLabel}
          {selected.size > 0 && (
            <span className="ml-2 text-primary font-medium">
              · {selected.size} selected
            </span>
          )}
        </span>
        {totalPages > 1 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPage={setPage}
            onPageSize={() => {}}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-center px-6">
            <p className="text-sm text-muted-foreground">No templates match your filters</p>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>Clear filters</Button>
            )}
          </div>
        ) : view === "grid" ? (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map(item => (
              <GlobalItemCard
                key={item.id}
                item={item}
                selected={selected.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                inFirm={isInFirmLibrary(lib, item.id)}
                onAdd={() => openAddDialog([item])}
              />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginated.map(item => (
              <GlobalItemRow
                key={item.id}
                item={item}
                selected={selected.has(item.id)}
                onToggle={() => toggleItem(item.id)}
                inFirm={isInFirmLibrary(lib, item.id)}
                onAdd={() => openAddDialog([item])}
              />
            ))}
          </div>
        )}
      </div>

      {/* Selection sticky bar */}
      {selected.size > 0 && (
        <div className="flex-shrink-0 border-t border-border bg-card px-6 py-3 flex items-center gap-3 shadow-lg">
          <span className="text-sm font-medium text-foreground">
            {selected.size} selected
            {selectedNotInFirm.length < selected.size && (
              <span className="text-muted-foreground font-normal">
                {" "}({selected.size - selectedNotInFirm.length} already in firm library)
              </span>
            )}
          </span>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelected(new Set())}
            className="h-8 text-xs"
          >
            Clear selection
          </Button>
          <Button
            size="sm"
            className="h-8"
            disabled={selectedNotInFirm.length === 0}
            onClick={() => openAddDialog(selectedNotInFirm)}
          >
            Add {selectedNotInFirm.length} to firm library
          </Button>
        </div>
      )}

      <AddToFirmDialog
        items={dialogItems}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdded={handleAdded}
      />
    </div>
  );
}
