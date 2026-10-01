import { cn } from "@/lib/utils";

type GlobalLibraryType =
  | "engagements"
  | "checklists"
  | "worksheets"
  | "reports"
  | "letters"
  | "notes";

interface GlobalFoldersNavProps {
  type: GlobalLibraryType;
  dark?: boolean;
}

export function GlobalFoldersNav({ type, dark }: GlobalFoldersNavProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-2",
        dark ? "text-white" : "text-foreground"
      )}
    >
      <p
        className={cn(
          "text-xs px-2 py-4 text-center",
          dark ? "text-white/50" : "text-muted-foreground"
        )}
      >
        Global library ({type})
      </p>
    </div>
  );
}
