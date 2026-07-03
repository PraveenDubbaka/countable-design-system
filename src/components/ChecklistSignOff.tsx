import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CURRENT_USER } from "@/lib/useTimeEntries";
import type { Checklist } from "@/types/checklist";

interface SignOffRecord {
  preparerName: string;
  signedAt: string; // ISO
  contentHash: string;
}

const storageKey = (id: string) => `checklist-signoff:${id}`;

function hashChecklist(c: Checklist): string {
  try {
    const shape = c.sections.map((s) => ({
      t: s.title,
      q: (s.questions ?? []).map((q: any) => ({
        t: q?.text ?? q?.title ?? "",
        r: q?.response ?? q?.value ?? "",
        e: q?.explanation ?? "",
        sub: (q?.subQuestions ?? []).map((sq: any) => ({
          t: sq?.text ?? "",
          r: sq?.response ?? sq?.value ?? "",
          e: sq?.explanation ?? "",
        })),
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

const DISCLAIMER =
  "By signing off below, you are agreeing to this statement that you have reviewed all the relevant associated working papers and cleared all your queries and documented the matters appropriately that may cause the financial statements and note disclosures, if applicable, to be false and/or misleading.";

export function ChecklistSignOff({ checklist }: { checklist: Checklist }) {
  const [record, setRecord] = useState<SignOffRecord | null>(null);
  const currentHash = useMemo(() => hashChecklist(checklist), [checklist]);

  useEffect(() => {
    if (!checklist.id) return;
    try {
      const raw = localStorage.getItem(storageKey(checklist.id));
      setRecord(raw ? (JSON.parse(raw) as SignOffRecord) : null);
    } catch {
      setRecord(null);
    }
  }, [checklist.id]);

  const persist = (next: SignOffRecord | null) => {
    setRecord(next);
    try {
      if (next) localStorage.setItem(storageKey(checklist.id), JSON.stringify(next));
      else localStorage.removeItem(storageKey(checklist.id));
    } catch {
      /* noop */
    }
  };

  const handleSignOff = () => {
    persist({
      preparerName: CURRENT_USER.name,
      signedAt: new Date().toISOString(),
      contentHash: currentHash,
    });
  };

  const handleUnsign = () => {
    if (window.confirm("You are about to remove the sign off. Continue?")) {
      persist(null);
    }
  };

  const isStale = !!record && record.contentHash !== currentHash;
  const isSigned = !!record && !isStale;

  const dateValue = isSigned ? formatDate(record!.signedAt) : "";
  const nameValue = isSigned ? record!.preparerName : "";

  // Column widths mirror standard 4-column checklist row proportions
  // (question / response / explanation / reference)
  const COL_Q = 34.65;
  const COL_DATE = 15;
  const COL_NAME = 42.35;
  const COL_ACTION = 8;

  const Separator = () => (
    <div
      className="shrink-0 w-px self-stretch pointer-events-none"
      style={{ backgroundColor: "var(--dv-separator)" }}
    />
  );

  return (
    <div
      className="dv-section rounded-[8px] border-[0.5px] overflow-hidden bg-card"
      style={{ borderColor: "var(--dv-separator)" }}
    >
      {/* Section header — matches checklist section header pattern */}
      <div
        className="dv-section-header flex items-center gap-3 pl-[38px] pr-4 py-0 relative border-b"
        style={{ borderColor: "var(--dv-separator)", height: "48px", minHeight: "48px" }}
      >
        <span className="text-sm font-semibold text-foreground">Sign Off</span>
        {isSigned && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Signed {formatDate(record!.signedAt)} by {record!.preparerName}
          </span>
        )}
      </div>

      {isStale && (
        <div
          className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-[38px] py-2 text-xs text-amber-800"
        >
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            <span className="font-medium">Checklist has been updated. </span>
            <span>Please resign to confirm the latest changes.</span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs text-amber-900 hover:bg-amber-100"
            onClick={() => persist(null)}
          >
            Reset sign off
          </Button>
        </div>
      )}

      <div className="dv-question relative">
        <div className="relative flex items-stretch border border-transparent">
          <div className="dv-question-content py-0 pl-[37px] pr-4 flex-1 min-w-0 flex items-stretch">
            {/* Column 1 — Disclaimer (question column) */}
            <div
              className="flex items-center gap-2 min-w-0"
              style={{ flex: `0 0 ${COL_Q}%` }}
            >
              <div className="text-sm text-foreground flex-1 p-1.5 leading-relaxed">
                {DISCLAIMER}
              </div>
            </div>

            <Separator />

            {/* Column 2 — Date */}
            <div
              className="flex items-center px-2 py-2"
              style={{ flex: `0 0 ${COL_DATE}%` }}
            >
              <Input
                value={dateValue}
                disabled
                readOnly
                placeholder=""
                className="h-8 bg-background text-sm w-full"
              />
            </div>

            <Separator />

            {/* Column 3 — Preparer Name */}
            <div
              className="flex items-center px-2 py-2"
              style={{ flex: `0 0 ${COL_NAME}%` }}
            >
              <Input
                value={nameValue}
                disabled
                readOnly
                placeholder=""
                className="h-8 bg-background text-sm w-full"
              />
            </div>

            <Separator />

            {/* Column 4 — Sign Off action */}
            <div
              className="flex items-center justify-center px-2 py-2"
              style={{ flex: `0 0 ${COL_ACTION}%` }}
            >
              {!isSigned ? (
                <Button size="sm" onClick={handleSignOff} className="h-8">
                  Sign Off
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleUnsign}
                  className="h-8"
                >
                  Unsign
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
