import { useState } from "react";
import { cn } from "@/lib/utils";
import { LukaIcon } from "@/components/LukaIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Clock, Database } from "lucide-react";

interface WorkPaperAction {
  label: string;
  description: string;
  estimatedTime: string;
  source: string;
}

interface ProcData {
  sources: string[];
  procedureType: string;
  actions: WorkPaperAction[];
}

interface LukaWorkPaperPanelProps {
  worksheetId: string;
  procData: ProcData;
  lukaState: "idle" | "loading" | "done";
  selectedIds: Set<number>;
  onSelectionChange: (ids: Set<number>) => void;
  onInitiate: () => void;
}

export function LukaWorkPaperPanel({
  procData,
  lukaState,
  selectedIds,
  onSelectionChange,
  onInitiate,
}: LukaWorkPaperPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const allSelected = selectedIds.size === procData.actions.length;

  function toggleAll() {
    onSelectionChange(
      allSelected ? new Set() : new Set(procData.actions.map((_, i) => i))
    );
  }

  function toggleOne(idx: number) {
    const next = new Set(selectedIds);
    next.has(idx) ? next.delete(idx) : next.add(idx);
    onSelectionChange(next);
  }

  if (lukaState === "loading") {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 border-b border-violet-200 animate-pulse">
        <LukaIcon size={13} bare inverted className="text-violet-700 shrink-0" />
        <span className="text-xs font-medium text-violet-700">
          Luka is preparing {selectedIds.size} work paper{selectedIds.size !== 1 ? "s" : ""} from connected sources…
        </span>
      </div>
    );
  }

  if (lukaState === "done") {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 border-b border-violet-200">
        <LukaIcon size={13} bare inverted className="text-violet-700 shrink-0" />
        <span className="text-xs font-medium text-violet-700">
          Luka has prepared {selectedIds.size} work paper{selectedIds.size !== 1 ? "s" : ""} — review before proceeding.
        </span>
        <span className="ml-auto text-[10px] text-violet-600 font-semibold bg-violet-100 px-2 py-0.5 rounded-full">
          ✓ Ready
        </span>
      </div>
    );
  }

  if (!expanded) {
    return (
      <div className="flex items-center justify-between px-4 py-2.5 bg-violet-50 border-b border-violet-200">
        <div className="flex items-center gap-2">
          <LukaIcon size={13} bare inverted className="text-violet-700 shrink-0" />
          <span className="text-xs font-medium text-violet-700">
            Luka can initiate{" "}
            <span className="font-semibold">
              {procData.actions.length} work paper{procData.actions.length !== 1 ? "s" : ""}
            </span>
            {" "}for this procedure
            <span className="ml-1.5 text-violet-400 font-normal">· {procData.procedureType}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setExpanded(true);
            onSelectionChange(new Set(procData.actions.map((_, i) => i)));
          }}
          className="inline-flex items-center gap-1 bg-white border border-violet-300 text-violet-700
                     text-[11px] font-medium rounded px-2.5 py-0.5 hover:bg-violet-50 transition-colors shrink-0"
        >
          <LukaIcon size={11} bare inverted />
          <span>Select work papers</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-violet-50 border-b border-violet-200">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-violet-100">
        <div className="flex items-center gap-2">
          <LukaIcon size={13} bare inverted className="text-violet-700 shrink-0" />
          <span className="text-xs font-semibold text-violet-700">Luka — Available Work Papers</span>
          <span className="text-[10px] text-violet-400">· {procData.procedureType}</span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-violet-400 hover:text-violet-600 transition-colors"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-violet-100">
        <Database className="h-3 w-3 text-violet-400 shrink-0" />
        <span className="text-[10px] text-violet-500 font-medium">Sources:</span>
        {procData.sources.map((s, i) => (
          <span key={i} className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2.5 px-4 py-2 border-b border-violet-100">
        <Checkbox
          id="luka-select-all"
          checked={allSelected}
          onCheckedChange={toggleAll}
          className="border-violet-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
        />
        <label
          htmlFor="luka-select-all"
          className="text-[11px] font-medium text-violet-600 cursor-pointer select-none"
        >
          Select all ({procData.actions.length})
        </label>
      </div>

      <div className="divide-y divide-violet-100">
        {procData.actions.map((action, idx) => (
          <div
            key={idx}
            onClick={() => toggleOne(idx)}
            className={cn(
              "flex items-start gap-2.5 px-4 py-2.5 cursor-pointer hover:bg-violet-100/60 transition-colors",
              selectedIds.has(idx) && "bg-violet-100/40"
            )}
          >
            <Checkbox
              id={`luka-wp-${idx}`}
              checked={selectedIds.has(idx)}
              onCheckedChange={() => toggleOne(idx)}
              onClick={e => e.stopPropagation()}
              className="mt-0.5 border-violet-300 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground leading-snug">{action.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{action.description}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] text-violet-500">
                  <Clock className="h-2.5 w-2.5" />{action.estimatedTime}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-violet-500">
                  <Database className="h-2.5 w-2.5" />{action.source}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 border-t border-violet-200 bg-violet-50/80">
        <p className="text-[10px] text-violet-400">
          {selectedIds.size === 0
            ? "Select work papers above to initiate"
            : `${selectedIds.size} of ${procData.actions.length} selected — Luka will draft, you review and confirm`}
        </p>
        <Button
          size="sm"
          disabled={selectedIds.size === 0}
          onClick={() => { setExpanded(false); onInitiate(); }}
          className="h-7 px-3 text-xs bg-[#1C63A6] hover:bg-[#1a5a9e] text-white disabled:opacity-40"
        >
          <LukaIcon size={11} bare className="mr-1.5 text-white" />
          Initiate selected
        </Button>
      </div>
    </div>
  );
}
