import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FolderSolidIcon } from "@/components/icons/FolderIcons";
import { type TemplateTypeId } from "@/lib/firmTemplateLibrary";
import { getGlobalFolders } from "@/lib/globalTemplateCatalog";

interface GlobalFoldersNavProps {
  type: TemplateTypeId;
  dark?: boolean;
}

export function GlobalFoldersNav({ type, dark }: GlobalFoldersNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const gfolder = searchParams.get("gfolder");

  function goBackToFirm() {
    setSearchParams(p => { p.delete("library"); p.delete("gfolder"); return p; });
  }

  function selectFolder(engType: string | null) {
    if (location.pathname !== "/templates") {
      navigate(`/templates?type=${type}&library=global${engType ? `&gfolder=${encodeURIComponent(engType)}` : ""}`);
      return;
    }
    setSearchParams(p => {
      if (engType) p.set("gfolder", engType);
      else p.delete("gfolder");
      return p;
    });
  }

  const folders = getGlobalFolders(type);

  const headerEl = (
    <div className="py-3 px-2">
      <p className={cn("text-xs font-semibold uppercase tracking-wider mb-2", dark ? "text-white/60" : "text-muted-foreground")}>
        Global Library
      </p>
      <button
        onClick={goBackToFirm}
        className={cn("text-xs flex items-center gap-1 hover:underline", dark ? "text-white/70" : "text-muted-foreground")}
      >
        ← My Firm Templates
      </button>
    </div>
  );

  if (type === "notes" || folders.length === 0) {
    return (
      <div className={cn("flex-1 overflow-y-auto px-2", dark ? "text-white" : "text-foreground")}>
        {headerEl}
        <p className={cn("text-sm text-center py-6 px-2", dark ? "text-white/50" : "text-muted-foreground")}>
          No global Notes to Financial Statements yet
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 overflow-y-auto px-2", dark ? "text-white" : "text-foreground")}>
      {headerEl}

      <button
        onClick={() => selectFolder(null)}
        className={cn(
          "w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors mb-0.5",
          gfolder === null
            ? dark ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
            : dark ? "text-white/80 hover:bg-white/10" : "text-foreground hover:bg-muted"
        )}
      >
        All templates
      </button>

      {folders.map(f => (
        <button
          key={f.engagementType}
          onClick={() => selectFolder(f.engagementType)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors mb-0.5",
            gfolder === f.engagementType
              ? dark ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
              : dark ? "text-white/80 hover:bg-white/10" : "text-foreground hover:bg-muted"
          )}
        >
          <FolderSolidIcon className={cn("h-4 w-4 flex-shrink-0", dark ? "text-white/60" : "text-primary")} />
          <span className="flex-1 text-left">{f.engagementType}</span>
          <span className={cn("text-xs", dark ? "text-white/40" : "text-muted-foreground")}>{f.count}</span>
        </button>
      ))}
    </div>
  );
}
