import { useState, useRef, useEffect } from "react";
import { Copy, Download, FolderOpen, RefreshCw, FileText, Sheet } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LukaResponseActionsProps {
  className?: string;
}

/* Expandable action button – icon-only by default, expands on hover to show label */
function ActionButton({
  icon,
  label,
  onClick,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <button
        onClick={onClick}
        className={cn(
          "h-9 flex items-center justify-center rounded-lg border border-border/60 bg-background",
          "transition-all duration-200 ease-in-out overflow-hidden",
          "hover:bg-muted/60 hover:border-border hover:shadow-sm",
          "active:scale-[0.97]",
          hovered ? "px-3 gap-2" : "px-0 w-9 gap-0"
        )}
      >
        <span className="shrink-0 flex items-center justify-center text-muted-foreground">{icon}</span>
        <span
          className={cn(
            "grid transition-[grid-template-columns,opacity] duration-200 ease-in-out overflow-hidden",
            hovered ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"
          )}
        >
          <span className="overflow-hidden whitespace-nowrap text-xs font-medium text-muted-foreground">
            {label}
          </span>
        </span>
      </button>
      {children && hovered && children}
    </div>
  );
}

/* Download dropdown */
function DownloadButton() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(true);
  };

  const handleLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setHovered(false);
      setOpen(false);
    }, 150);
  };

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div className="relative" ref={ref} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "h-9 flex items-center justify-center rounded-lg border border-border/60 bg-background",
          "transition-all duration-200 ease-in-out overflow-hidden",
          "hover:bg-muted/60 hover:border-border hover:shadow-sm",
          "active:scale-[0.97]",
          hovered ? "px-3 gap-2" : "px-0 w-9 gap-0"
        )}
      >
        <span className="shrink-0 flex items-center justify-center text-muted-foreground">
          <Download size={16} strokeWidth={2} />
        </span>
        <span
          className={cn(
            "grid transition-[grid-template-columns,opacity] duration-200 ease-in-out overflow-hidden",
            hovered ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"
          )}
        >
          <span className="overflow-hidden whitespace-nowrap text-xs font-medium text-muted-foreground">
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
            <FileText size={15} className="text-red-500" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => { toast.success("Downloading as Excel..."); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors"
          >
            <Sheet size={15} className="text-green-600" />
            <span>Excel</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function LukaResponseActions({ className }: LukaResponseActionsProps) {
  return (
    <div className={cn("flex items-center gap-2 pt-3", className)}>
      {/* Copy Text */}
      <ActionButton
        icon={<Copy size={16} strokeWidth={2} />}
        label="Copy Text"
        onClick={() => toast.success("Copied to clipboard")}
      />

      {/* Download */}
      <DownloadButton />

      {/* Save to Engagement */}
      <ActionButton
        icon={<FolderOpen size={16} strokeWidth={2} />}
        label="Save to Engagement"
        onClick={() => toast.success("Saved to engagement")}
      />

      {/* Rerun */}
      <ActionButton
        icon={<RefreshCw size={16} strokeWidth={2} />}
        label="Rerun"
        onClick={() => toast.info("Rerunning...")}
      />
    </div>
  );
}
