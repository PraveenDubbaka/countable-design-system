import { useState, useCallback } from "react";
import { ChevronRight, ChevronDown, Search, Plus, FolderOpen, Folder } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import {
  templateTree,
  allTemplateViews,
  categoryConfig,
  type TreeItem,
  type TemplateView,
  type TemplateSection,
} from "@/lib/engagementTemplatesData";

// ── Category Badge ──
function CategoryBadge({ category }: { category: string }) {
  const cfg = categoryConfig[category as keyof typeof categoryConfig];
  if (!cfg) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] text-xs font-medium border whitespace-nowrap", cfg.className)}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ── Section Block ──
function SectionBlock({ section }: { section: TemplateSection }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border">
      <button
        className="flex items-center justify-between w-full px-7 py-3.5 hover:bg-muted/30 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[15px] font-bold text-foreground">{section.name}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", !open && "-rotate-90")} />
      </button>
      {open && (
        <div className="overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-7 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/40 border-b border-border text-left">Section</th>
                <th className="px-7 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/40 border-b border-border text-left">Category</th>
                <th className="px-7 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/40 border-b border-border text-left">Mapped template</th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={i} className="hover:bg-muted/20">
                  <td className="px-7 py-3 border-b border-border/40 text-[13.5px] text-foreground">{row.section}</td>
                  <td className="px-7 py-3 border-b border-border/40"><CategoryBadge category={row.category} /></td>
                  <td className="px-7 py-3 border-b border-border/40 text-[13.5px] text-muted-foreground">{row.mappedTemplate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Standards Banner ──
function StandardsBanner({ banner }: { banner: NonNullable<TemplateView["standardsBanner"]> }) {
  const colorMap = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };
  const badgeMap = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  };
  return (
    <div className={cn("border-b px-7 py-2.5 flex items-center gap-2.5 flex-shrink-0 text-xs", colorMap[banner.color])}>
      <span className="font-semibold">{banner.label}</span>
      <span>{banner.standards}</span>
      <span className={cn("ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full", badgeMap[banner.color])}>
        {banner.badge}
      </span>
    </div>
  );
}

// ── Tree Node ──
function TreeNode({
  item,
  depth,
  selectedId,
  expandedFolders,
  onSelect,
  onToggle,
}: {
  item: TreeItem;
  depth: number;
  selectedId: string;
  expandedFolders: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const isExpanded = expandedFolders.has(item.id);

  // Country header items render as small labels
  if (item.countryHeader) {
    return (
      <div
        className="px-3.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
        style={{ paddingLeft: `${(depth + 1) * 18 + 8}px` }}
      >
        {item.countryHeader}
      </div>
    );
  }

  if (item.type === "folder") {
    return (
      <>
        <button
          className={cn(
            "flex items-center gap-1.5 w-full py-2 px-3.5 text-[13px] text-foreground hover:bg-muted/50 cursor-pointer select-none",
            item.isNew && "font-medium"
          )}
          style={{ paddingLeft: `${depth * 18 + 14}px` }}
          onClick={() => onToggle(item.id)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-amber-500 flex-shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-amber-500 flex-shrink-0" />
          )}
          <span className="flex-1 text-left truncate">{item.label}</span>
          {item.isNew && (
            <span className="bg-[#1a3d6f] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-1">NEW</span>
          )}
        </button>
        {isExpanded && item.children?.map((child) => (
          <TreeNode
            key={child.id}
            item={child}
            depth={depth + 1}
            selectedId={selectedId}
            expandedFolders={expandedFolders}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        ))}
      </>
    );
  }

  // File leaf
  return (
    <button
      className={cn(
        "flex items-center gap-1.5 w-full py-1.5 px-3.5 text-[13px] text-foreground hover:bg-muted/50 cursor-pointer select-none",
        selectedId === item.id && "bg-blue-50 text-blue-900 font-medium"
      )}
      style={{ paddingLeft: `${depth * 18 + 14 + 18}px` }}
      onClick={() => onSelect(item.id)}
    >
      <span className="text-[15px] flex-shrink-0">🖨</span>
      <span className="flex-1 text-left truncate">{item.label}</span>
    </button>
  );
}

// ── Main Page ──
export default function EngagementTemplates() {
  const [selectedId, setSelectedId] = useState("rev2400");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(["review", "audit"])
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFolder = useCallback((id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const activeView = allTemplateViews[selectedId];

  return (
    <Layout>
      <div className="flex h-full overflow-hidden bg-background">
        {/* ── Middle Panel (Tree) ── */}
        <div className="w-[272px] bg-background border-r border-border flex flex-col flex-shrink-0 overflow-hidden">
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <h2 className="text-lg font-bold text-foreground mb-3">Templates</h2>
            <select className="w-full px-2.5 py-2 border border-border rounded-lg text-[13px] font-medium text-foreground bg-background cursor-pointer">
              <option>Engagements</option>
              <option>Tax</option>
              <option>Advisory</option>
            </select>
            <div className="flex mt-3 border-b-2 border-border">
              <button className="text-[13px] font-medium text-muted-foreground pb-2 mr-4 border-b-2 border-transparent mb-[-2px] cursor-pointer">
                My Templates
              </button>
              <button className="text-[13px] font-semibold text-[#1a3d6f] pb-2 mr-4 border-b-2 border-[#1a3d6f] mb-[-2px] cursor-pointer">
                Global Templates
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-1.5 px-2.5 pt-2.5 pb-1.5">
            <div className="flex-1 flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-1.5 bg-muted/30">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                className="border-none bg-transparent text-[13px] text-foreground outline-none flex-1 placeholder:text-muted-foreground"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-y-auto py-1.5">
            {templateTree.map((item) => (
              <TreeNode
                key={item.id}
                item={item}
                depth={0}
                selectedId={selectedId}
                expandedFolders={expandedFolders}
                onSelect={setSelectedId}
                onToggle={toggleFolder}
              />
            ))}
          </div>
        </div>

        {/* ── Right Panel (Template View) ── */}
        <div className="flex-1 bg-background flex flex-col overflow-hidden">
          {activeView ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-4 pb-3.5 border-b border-border flex-shrink-0">
                <div>
                  <h1 className="text-xl font-bold text-[#1a3d6f]">{activeView.title}</h1>
                  {activeView.subtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">{activeView.subtitle}</p>
                  )}
                </div>
                <Button size="sm" className="bg-[#1a3d6f] hover:bg-[#0f2d56] text-white text-[13px] font-semibold">
                  <Plus className="h-4 w-4 mr-1" /> My Templates
                </Button>
              </div>

              {/* Standards banner */}
              {activeView.standardsBanner && <StandardsBanner banner={activeView.standardsBanner} />}

              {/* Sections */}
              <div className="flex-1 overflow-y-auto">
                {activeView.sections.map((section, i) => (
                  <SectionBlock key={i} section={section} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <span className="text-5xl opacity-40">📄</span>
              <span className="text-[15px]">Select a template to view its structure</span>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
