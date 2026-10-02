import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  load,
  isInFirmLibrary,
  type TemplateTypeId,
} from "@/lib/firmTemplateLibrary";
import { getGlobalItems } from "@/lib/globalTemplateCatalog";
import { AddToFirmDialog } from "@/components/templates/AddToFirmDialog";

interface Props {
  globalId: string;
}

export function GlobalTemplateHeader({ globalId }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type") as TemplateTypeId | null;
  const gfolder = searchParams.get("gfolder");

  const [lib, setLib] = useState(() => load());
  const [addOpen, setAddOpen] = useState(false);

  const allItems = typeParam ? getGlobalItems(typeParam) : getGlobalItems("all");
  const item = allItems.find(i => i.id === globalId);
  const alreadyAdded = isInFirmLibrary(lib, globalId);

  if (!item) return null;

  const engagementType = item.engagementType;
  const framework = item.framework;
  const region = item.region;

  return (
    <div className="border-b border-border bg-background px-6 py-4 space-y-3">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
        <button
          className="hover:text-foreground transition-colors"
          onClick={() => navigate(typeParam ? `/templates?type=${typeParam}&library=global` : "/templates?library=global")}
        >
          Global Library
        </button>
        {engagementType && engagementType !== "Other" && (
          <>
            <span className="text-muted-foreground/50">/</span>
            <button
              className="hover:text-foreground transition-colors"
              onClick={() => navigate(
                typeParam
                  ? `/templates?type=${typeParam}&library=global${gfolder ? `&gfolder=${gfolder}` : ""}`
                  : `/templates?library=global${gfolder ? `&gfolder=${gfolder}` : ""}`
              )}
            >
              {engagementType}
            </button>
          </>
        )}
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground font-medium">{item.name}</span>
      </nav>

      {/* Title row */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-foreground leading-tight truncate">{item.name}</h1>
          {item.subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{item.subtitle}</p>
          )}

          {/* Chips */}
          <div className="flex items-center gap-2 flex-wrap mt-2">
            {region !== "Both" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                {region === "CA" ? "🇨🇦 Canada" : "🇺🇸 United States"}
              </span>
            )}
            {framework !== "Any" && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                {framework}
              </span>
            )}
            {engagementType && engagementType !== "Other" && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                {engagementType}
              </span>
            )}
          </div>
        </div>

        {/* Add to firm button */}
        <div className="flex-shrink-0">
          {alreadyAdded ? (
            <Button size="sm" variant="outline" disabled>
              <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
              Already added
            </Button>
          ) : (
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add to firm
            </Button>
          )}
        </div>
      </div>

      <AddToFirmDialog
        items={[item]}
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdded={() => {
          setLib(load());
          setAddOpen(false);
        }}
      />
    </div>
  );
}
