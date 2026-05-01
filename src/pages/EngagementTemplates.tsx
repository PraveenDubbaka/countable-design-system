import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/Layout";
import {
  allTemplateViews,
  categoryConfig,
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
