import { useState, useRef, useEffect, useCallback } from "react";
import { Copy, Download, FolderOpen, RefreshCw, FileText, Sheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LukaResponseActionsProps {
  className?: string;
}

/* Expandable action button – expands smoothly, stays expanded until sibling is hovered or click outside */
function ActionButton({
  icon,
  label,
  onClick,
  expanded,
  onHover,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  expanded: boolean;
  onHover: () => void;
}) {
  return (
    <button
      onMouseEnter={onHover}
      onClick={onClick}
      className={cn(
        "h-9 flex items-center justify-center rounded-lg border border-border/60 bg-background",
        "transition-all duration-300 ease-emphasized overflow-hidden",
        "hover:bg-muted/60 hover:border-border hover:shadow-sm",
        "active:scale-[0.97]",
        expanded ? "px-3 gap-2" : "px-0 w-9 gap-0"
      )}
    >
      <span className="shrink-0 flex items-center justify-center text-muted-foreground">{icon}</span>
      <span
        className={cn(
          "grid overflow-hidden",
          "transition-[grid-template-columns] duration-300 ease-emphasized",
          expanded ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
        )}
      >
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap text-xs font-medium text-muted-foreground",
            "transition-opacity duration-200 ease-emphasized",
            expanded ? "opacity-100 delay-75" : "opacity-0"
          )}
        >
          {label}
        </span>
      </span>
    </button>
  );
}

/* Download button with dropdown */
function DownloadButton({
  expanded,
  onHover,
}: {
  expanded: boolean;
  onHover: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onMouseEnter={onHover}
        onClick={() => setOpen(!open)}
        className={cn(
          "h-9 flex items-center justify-center rounded-lg border border-border/60 bg-background",
          "transition-all duration-300 ease-emphasized overflow-hidden",
          "hover:bg-muted/60 hover:border-border hover:shadow-sm",
          "active:scale-[0.97]",
          expanded ? "px-3 gap-2" : "px-0 w-9 gap-0"
        )}
      >
        <span className="shrink-0 flex items-center justify-center text-muted-foreground">
          <Download size={16} strokeWidth={2} />
        </span>
        <span
          className={cn(
            "grid overflow-hidden",
            "transition-[grid-template-columns] duration-300 ease-emphasized",
            expanded ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
          )}
        >
          <span
            className={cn(
              "overflow-hidden whitespace-nowrap text-xs font-medium text-muted-foreground",
              "transition-opacity duration-200 ease-emphasized",
              expanded ? "opacity-100 delay-75" : "opacity-0"
            )}
          >
            Download
          </span>
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 min-w-[140px] rounded-lg border border-border bg-background shadow-elevation-2 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => { toast.success("Downloading as PDF..."); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors"
          >
            <FileText size={15} className="text-destructive" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => { toast.success("Downloading as Excel..."); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors"
          >
            <Sheet size={15} className="text-primary" />
            <span>Excel</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function LukaResponseActions({ className }: LukaResponseActionsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside → collapse all
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hover = useCallback((id: string) => () => setActiveId(id), []);

  return (
    <div ref={containerRef} className={cn("flex items-center gap-2 pt-3", className)}>
      <ActionButton
        icon={<Copy size={16} strokeWidth={2} />}
        label="Copy Text"
        expanded={activeId === "copy"}
        onHover={hover("copy")}
        onClick={() => toast.success("Copied to clipboard")}
      />

      <DownloadButton
        expanded={activeId === "download"}
        onHover={hover("download")}
      />

      <ActionButton
        icon={<FolderOpen size={16} strokeWidth={2} />}
        label="Save to Engagement"
        expanded={activeId === "save"}
        onHover={hover("save")}
        onClick={() => toast.success("Saved to engagement")}
      />

      <ActionButton
        icon={<RefreshCw size={16} strokeWidth={2} />}
        label="Rerun"
        expanded={activeId === "rerun"}
        onHover={hover("rerun")}
        onClick={() => toast.info("Rerunning...")}
      />
    </div>
  );
}
