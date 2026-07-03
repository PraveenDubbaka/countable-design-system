import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, MessageSquare, MoreHorizontal, ChevronDown, ChevronRight, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CURRENT_USER } from "@/lib/useTimeEntries";
import type { Checklist } from "@/types/checklist";

interface SignOffRecord {
  preparerName: string;
  signedAt: string; // ISO
  contentHash: string;
}

interface SignOffState {
  isExpanded: boolean;
  note?: string;
  record: SignOffRecord | null;
}

const stateKey = (id: string) => `checklist-signoff-v2:${id}`;

const DISCLAIMER =
  "By signing off below, you are agreeing to this statement that you have reviewed all the relevant associated working papers and cleared all your queries and documented the matters appropriately that may cause the financial statements and note disclosures, if applicable, to be false and/or misleading.";

function hashChecklist(c: Checklist): string {
  try {
    const shape = c.sections.map((s) => ({
      t: s.title,
      q: (s.questions ?? []).map((q: any) => ({
        t: q?.text ?? "",
        r: q?.answer ?? "",
        e: q?.explanation ?? "",
      })),
    }));
    const str = JSON.stringify(shape);
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return String(h);
  } catch {
    return "";
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function formatDateShort(iso: string): string {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
}

// Column widths mirror standard checklist 3-col signature layout
const COL_DATE = 25;
const COL_NAME = 50;
const COL_ACTION = 25;

const Separator = () => (
  <div
    className="shrink-0 w-px self-stretch pointer-events-none"
    style={{ backgroundColor: "var(--dv-separator)" }}
  />
);

export function ChecklistSignOff({ checklist }: { checklist: Checklist }) {
  const key = useMemo(() => stateKey(checklist.id), [checklist.id]);
  const currentHash = useMemo(() => hashChecklist(checklist), [checklist]);
  const [state, setState] = useState<SignOffState>({ isExpanded: true, record: null });
  const [menuOpen, setMenuOpen] = useState(false);

  // Load
  useEffect(() => {
    if (!checklist.id) return;
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
      else setState({ isExpanded: true, record: null });
    } catch {
      setState({ isExpanded: true, record: null });
    }
  }, [checklist.id, key]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [state, key]);

  const patch = (partial: Partial<SignOffState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const record = state.record;
  const isStale = !!record && record.contentHash !== currentHash;
  const isSigned = !!record && !isStale;

  const handleSignOff = () => {
    patch({
      record: {
        preparerName: CURRENT_USER.name,
        signedAt: new Date().toISOString(),
        contentHash: currentHash,
      },
    });
  };

  const handleUnsign = () => {
    if (window.confirm("You are about to remove the sign off. Continue?")) {
      patch({ record: null });
    }
  };

  return (
    <div
      id={`signoff-section-${checklist.id}`}
      className="dv-section rounded-[8px] border-[0.5px] overflow-hidden bg-card group/section"
      style={{ borderColor: "var(--dv-separator)" }}
    >
      {/* ── Section header — matches DocumentSectionBlock pattern ── */}
      <div
        className="dv-section-header flex items-center gap-2 pl-[38px] pr-4 py-0 relative border-b"
        style={{ borderColor: "var(--dv-separator)", height: "48px", minHeight: "48px" }}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => patch({ isExpanded: !state.isExpanded })}
          className="dv-collapse-btn absolute left-4 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted transition-colors z-10"
        >
          {state.isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Title */}
        <h3 className="dv-section-title text-sm font-semibold text-category-title flex-1 pl-[6px]">
          Sign Off
        </h3>

        {/* Stamp (inline in header) */}
        {isSigned && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Signed {formatDate(record!.signedAt)} by {record!.preparerName}
          </span>
        )}

        {/* Add note */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors shrink-0 ${
                state.note ? "text-primary hover:bg-primary/10" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <MessageSquare className="h-3 w-3" />
              {state.note ? "Edit note" : "Add note"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="end" side="bottom">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Section Note</label>
              <textarea
                className="w-full min-h-[80px] text-sm rounded-md border border-input bg-background px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                placeholder="Add a note for this section..."
                defaultValue={state.note || ""}
                onBlur={(e) => patch({ note: e.target.value || undefined })}
              />
              {state.note && (
                <button
                  className="text-xs text-destructive hover:underline"
                  onClick={() => patch({ note: undefined })}
                >
                  Remove note
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Kebab */}
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center justify-center w-7 h-7 rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              title="Section options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" side="bottom" sideOffset={4} className="w-56 p-2 bg-popover border-border shadow-xl z-50">
            <button
              onClick={() => {
                if (window.confirm("Reset sign off? This will clear signature data.")) {
                  patch({ record: null });
                }
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Reset sign off
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {state.isExpanded && (
        <>
          {isStale && (
            <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-[38px] py-2 text-xs text-amber-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="font-medium">Checklist has been updated. </span>
                <span>Please resign to confirm the latest changes.</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs text-amber-900 hover:bg-amber-100"
                onClick={() => patch({ record: null })}
              >
                Reset sign off
              </Button>
            </div>
          )}

          {/* ── Disclaimer row — full width, wrapping text ── */}
          <div className="dv-question border-b" style={{ borderColor: "var(--dv-separator)" }}>
            <div className="pl-[37px] pr-4 py-3">
              <p className="text-sm text-foreground leading-relaxed break-words whitespace-normal">
                {DISCLAIMER}
              </p>
            </div>
          </div>

          {/* ── Signature row — 3 columns: Date · Preparer Name · Sign Off ── */}
          <div className="dv-question">
            <div className="relative flex items-stretch">
              <div className="pl-[37px] pr-4 flex-1 min-w-0 flex items-stretch">
                {/* Date (disabled, auto-populated) */}
                <div className="flex items-center px-2 py-2" style={{ flex: `0 0 ${COL_DATE}%` }}>
                  <Input
                    value={isSigned ? formatDateShort(record!.signedAt) : ""}
                    disabled
                    readOnly
                    type="date"
                    placeholder="yyyy-mm-dd"
                    className="h-9 bg-background text-sm w-full disabled:opacity-100 disabled:cursor-not-allowed"
                  />
                </div>

                <Separator />

                {/* Preparer Name (disabled, auto-populated) */}
                <div className="flex items-center px-2 py-2" style={{ flex: `0 0 ${COL_NAME}%` }}>
                  <Input
                    value={isSigned ? record!.preparerName : ""}
                    disabled
                    readOnly
                    placeholder="Preparer Name"
                    className="h-9 bg-background text-sm w-full disabled:opacity-100 disabled:cursor-not-allowed"
                  />
                </div>

                <Separator />

                {/* Sign Off button */}
                <div className="flex items-center justify-center px-2 py-2" style={{ flex: `0 0 ${COL_ACTION}%` }}>
                  {!isSigned ? (
                    <Button size="sm" onClick={handleSignOff} className="h-9 w-full">
                      Sign Off
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleUnsign}
                      className="h-9 w-full inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Signed
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
