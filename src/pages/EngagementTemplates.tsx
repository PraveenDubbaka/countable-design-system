import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Plus, LayoutGrid, FileText, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/Layout";
import {
  allTemplateViews,
  categoryConfig,
  type TemplateSection,
  type CategoryType,
} from "@/lib/engagementTemplatesData";
import { ChecklistIcon } from "@/components/icons/ChecklistIcon";
import { LetterIcon } from "@/components/icons/LetterIcon";
import { FolderSolidIcon } from "@/components/icons/FolderIcons";
import { SmartLayoutIcon } from "@/components/icons/SmartLayoutIcon";

const categoryIcons: Record<CategoryType, React.ReactNode> = {
  checklist: <ChecklistIcon className="w-3.5 h-3.5 [&_path]:stroke-current" />,
  worksheet: <SmartLayoutIcon className="w-3.5 h-3.5" />,
  letter: <LetterIcon className="w-3.5 h-3.5 [&_path]:stroke-current" />,
  folder: <FolderSolidIcon className="w-3.5 h-3.5" />,
  module: <LayoutGrid className="w-3.5 h-3.5" />,
  "financial-statement": <FileText className="w-3.5 h-3.5" />,
  report: <ClipboardList className="w-3.5 h-3.5" />,
};

// ── Category Badge ──
function CategoryBadge({ category }: { category: string }) {
  const cfg = categoryConfig[category as keyof typeof categoryConfig];
  if (!cfg) return null;
  const icon = categoryIcons[category as CategoryType];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border-[1.5px] whitespace-nowrap", cfg.className)}>
      {icon} {cfg.label}
    </span>
  );
}

// ── Section Block ──
function SectionBlock({ section }: { section: TemplateSection }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="flex items-center justify-between w-full px-6 py-3.5 hover:bg-muted/30 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[15px] font-bold text-foreground">{section.name}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open ? "rotate-0" : "-rotate-90")} />
      </button>
      {open && (
        <div className="overflow-hidden">
          <table className="w-full border-collapse table-fixed">
            <colgroup>
              <col style={{ width: '40%' }} />
              <col style={{ width: '60%' }} />
            </colgroup>
            <thead>
              <tr className="border-t border-border">
                <th className="px-6 py-2.5 text-sm font-semibold text-foreground bg-muted/30 border-b border-border text-left">Section</th>
                <th className="px-6 py-2.5 text-sm font-semibold text-foreground bg-muted/30 border-b border-border text-left">Mapped template</th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={i} className="hover:bg-muted/20">
                  <td className="px-6 py-3.5 border-b border-border/40 text-sm text-foreground">{row.section}</td>
                  <td className="px-6 py-3.5 border-b border-border/40 text-sm text-foreground">{row.mappedTemplate}</td>
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
function StandardsBanner({ banner }: { banner: NonNullable<(typeof allTemplateViews)[string]["standardsBanner"]> }) {
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

// ── Main Page ──
export default function EngagementTemplates() {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("template") || "rev2400";

  const activeView = allTemplateViews[selectedId];

  return (
    <Layout>
      <div className="flex h-full overflow-hidden bg-background">
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
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
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
