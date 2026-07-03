import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENT_USER } from "@/lib/useTimeEntries";
import type { Checklist } from "@/types/checklist";

interface SignOffRecord {
  preparerName: string;
  preparerRole: string;
  signedAt: string; // ISO
  contentHash: string;
}

const storageKey = (id: string) => `checklist-signoff:${id}`;

// Lightweight stable hash of the checklist content (sections + questions text/values).
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

export function ChecklistSignOff({ checklist }: { checklist: Checklist }) {
  const [record, setRecord] = useState<SignOffRecord | null>(null);
  const [draftName, setDraftName] = useState<string>(CURRENT_USER.name);
  const [draftDate, setDraftDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const currentHash = useMemo(() => hashChecklist(checklist), [checklist]);

  // Load persisted signoff for this checklist
  useEffect(() => {
    if (!checklist.id) return;
    try {
      const raw = localStorage.getItem(storageKey(checklist.id));
      const parsed = raw ? (JSON.parse(raw) as SignOffRecord) : null;
      setRecord(parsed);
      if (parsed) {
        setDraftName(parsed.preparerName);
        setDraftDate(parsed.signedAt.slice(0, 10));
      } else {
        setDraftName(CURRENT_USER.name);
        setDraftDate(new Date().toISOString().slice(0, 10));
      }
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
    // Use draftDate at current time-of-day so display keeps time context
    const chosen = new Date(draftDate);
    if (isNaN(chosen.getTime())) return;
    const now = new Date();
    chosen.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);
    persist({
      preparerName: draftName.trim() || CURRENT_USER.name,
      preparerRole: "Preparer",
      signedAt: chosen.toISOString(),
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

  return (
    <div
      className="dv-section rounded-[8px] border-[0.5px] overflow-hidden bg-card"
      style={{ borderColor: "var(--dv-separator)" }}
    >
      {/* Section header — matches checklist section header pattern */}
      <div
        className="dv-section-header flex items-center gap-2 pl-[38px] pr-4 py-0 relative border-b"
        style={{ borderColor: "var(--dv-separator)", height: "48px", minHeight: "48px" }}
      >
        <span className="text-sm font-semibold text-foreground">Sign Off</span>
        {isSigned && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Signed {formatDate(record!.signedAt)}
          </span>
        )}
      </div>

      {/* Disclaimer */}
      <div
        className="px-[38px] py-3 border-b"
        style={{ borderColor: "var(--dv-separator)" }}
      >
        <p className="text-xs text-muted-foreground leading-relaxed">
          By signing off below, you are agreeing to this statement that you have reviewed all the
          relevant associated working papers and cleared all your queries and documented the matters
          appropriately that may cause the financial statements and note disclosures, if applicable,
          to be false and/or misleading.
        </p>
      </div>

      {/* Stale warning */}
      {isStale && (
        <div
          className="mx-[38px] mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
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

      {/* Signoff body */}
      <div className="px-[38px] py-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div className="space-y-1.5">
            <Label className="text-xs text-foreground">Preparer Name</Label>
            <Input
              value={isSigned ? record!.preparerName : draftName}
              onChange={(e) => setDraftName(e.target.value)}
              disabled={isSigned}
              placeholder="Enter preparer name"
              className="h-9 bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-foreground">Date</Label>
            <Input
              type="date"
              value={isSigned ? record!.signedAt.slice(0, 10) : draftDate}
              onChange={(e) => setDraftDate(e.target.value)}
              disabled={isSigned}
              className="h-9 bg-background w-fit"
            />
          </div>
        </div>

        <div className="pt-1 flex items-center gap-3">
          {!isSigned ? (
            <Button
              size="sm"
              onClick={handleSignOff}
              className="h-8"
              disabled={!draftName.trim() || !draftDate}
            >
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
  );
}
