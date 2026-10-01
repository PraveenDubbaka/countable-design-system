import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChecklistIcon } from "@/components/icons/ChecklistIcon";
import {
  load,
  isDefault,
  folderPath,
  getActiveOfficeId,
  getOffices,
  resolveBaseTemplateId,
  type FirmTemplate,
  type Library,
} from "@/lib/firmTemplateLibrary";

export function TemplatePickerPanel({
  open,
  onClose,
  onSelect,
  suggestedFirmTemplateId,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (baseId: string, name: string, firmTemplate: FirmTemplate) => void;
  suggestedFirmTemplateId?: string;
  engagementTypeLabel?: string;
  standards?: string;
}) {
  const navigate = useNavigate();
  const [lib, setLib] = useState<Library>(() => load());
  const [search, setSearch] = useState("");
  const suggestedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onLibChange() { setLib(load()); }
    function onFirmSwitched() { setLib(load()); }
    window.addEventListener("firmTemplateLibraryChanged", onLibChange);
    window.addEventListener("firmSwitched", onFirmSwitched);
    return () => {
      window.removeEventListener("firmTemplateLibraryChanged", onLibChange);
      window.removeEventListener("firmSwitched", onFirmSwitched);
    };
  }, []);

  useEffect(() => {
    if (open && suggestedRef.current) {
      suggestedRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [open, suggestedFirmTemplateId]);

  const activeOfficeId = getActiveOfficeId();
  const offices = getOffices();
  const activeOffice = offices.find(o => o.id === activeOfficeId);
  const officeCity = activeOffice?.city ?? "your office";

  const q = search.toLowerCase();

  const pickable = lib.templates
    .filter(t => {
      if (t.type !== "engagements" || t.status !== "published" || !t.availableOfficeIds.includes(activeOfficeId)) return false;
      if (q && !t.name.toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) => {
      const pathA = folderPath(lib, a.folderId).map(f => f.name).join(" / ") || "Root";
      const pathB = folderPath(lib, b.folderId).map(f => f.name).join(" / ") || "Root";
      if (pathA !== pathB) return pathA.localeCompare(pathB);
      return a.name.localeCompare(b.name);
    });

  const groups: { header: string; templates: FirmTemplate[] }[] = [];
  const seen = new Map<string, FirmTemplate[]>();
  for (const t of pickable) {
    const header = folderPath(lib, t.folderId).map(f => f.name).join(" / ") || "Root";
    if (!seen.has(header)) {
      const arr: FirmTemplate[] = [];
      seen.set(header, arr);
      groups.push({ header, templates: arr });
    }
    seen.get(header)!.push(t);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-background border-l border-border shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="font-semibold text-foreground">Select Engagement template</span>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 py-2 border-b border-border/40">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" className="pl-8 h-7 text-sm" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {pickable.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
            <p className="text-sm text-muted-foreground">
              No published firm templates available to {officeCity}.
            </p>
            <button
              type="button"
              onClick={() => { navigate("/templates?type=engagements&library=global"); onClose(); }}
              className="text-sm text-primary hover:underline font-medium"
            >
              Open Global Library
            </button>
          </div>
        ) : (
          groups.map(group => (
            <div key={group.header}>
              <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {group.header}
              </div>
              {group.templates.map(t => {
                const isSuggested = t.id === suggestedFirmTemplateId;
                const isDefaultTemplate = isDefault(lib, t);
                return (
                  <div
                    key={t.id}
                    ref={isSuggested ? suggestedRef : undefined}
                    className={cn(
                      "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-primary/10 text-sm select-none",
                      isSuggested && "bg-primary/5"
                    )}
                    onClick={() => { onSelect(resolveBaseTemplateId(t) ?? "", t.name, t); onClose(); }}
                  >
                    <ChecklistIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate flex-1">{t.name}</span>
                    {t.framework !== "Any" && (
                      <span className="shrink-0 text-[10px] text-muted-foreground">{t.framework}</span>
                    )}
                    {isDefaultTemplate && (
                      <Star className="h-3 w-3 shrink-0 text-amber-500" />
                    )}
                    {isSuggested && (
                      <span className="shrink-0 rounded-full bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 font-medium">
                        Firm default
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
