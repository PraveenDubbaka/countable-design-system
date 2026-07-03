import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { Checklist, NumberingFormat } from "@/types/checklist";

const stampKey = (id: string) => `checklist-signoff-stamp:${id}`;

const DISCLAIMER =
  "By signing off below, you are agreeing to this statement that you have reviewed all the relevant associated working papers and cleared all your queries and documented the matters appropriately that may cause the financial statements and note disclosures, if applicable, to be false and/or misleading";

type SignEntry = {
  name: string;
  role: string;
  signedAt: string | null;
};

type PersistedStamps = SignEntry[];

const DEFAULT_SIGNEES: SignEntry[] = [
  { name: "Praveen Dubbaka", role: "Preparer", signedAt: null },
];

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export function ChecklistSignOff({
  checklist,
  isPreviewMode = false,
  isEngagementMode: _isEngagementMode = false,
  numberingFormat: _numberingFormat = "number",
  showNumbering: _showNumbering = false,
}: {
  checklist: Checklist;
  isPreviewMode?: boolean;
  isEngagementMode?: boolean;
  numberingFormat?: NumberingFormat;
  showNumbering?: boolean;
}) {
  const skey = useMemo(() => stampKey(checklist.id), [checklist.id]);
  const [entries, setEntries] = useState<SignEntry[]>(DEFAULT_SIGNEES);

  useEffect(() => {
    if (!checklist.id) return;
    try {
      const raw = localStorage.getItem(skey);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedStamps;
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
          return;
        }
      }
    } catch { /* fall through to default */ }
    setEntries(DEFAULT_SIGNEES.map((e) => ({ ...e })));
  }, [checklist.id, skey]);

  const persist = (next: SignEntry[]) => {
    setEntries(next);
    try { localStorage.setItem(skey, JSON.stringify(next)); } catch { /* noop */ }
  };

  const handleSign = (idx: number) => {
    const next = entries.map((e, i) =>
      i === idx ? { ...e, signedAt: new Date().toISOString() } : e
    );
    persist(next);
  };

  const handleUnsign = (idx: number) => {
    const next = entries.map((e, i) =>
      i === idx ? { ...e, signedAt: null } : e
    );
    persist(next);
  };

  return (
    <div className="rounded-lg border border-border bg-card mt-4">
      {/* Disclaimer */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-semibold text-foreground mb-1">Sign Off Disclaimer</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{DISCLAIMER}</p>
      </div>

      {/* Signoff section */}
      <div className="px-5 py-4">
        <p className="text-sm font-semibold text-foreground mb-3">Final Completion Signoff</p>
        <div className="flex flex-wrap gap-3">
          {entries.map((entry, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-background px-4 py-3 min-w-[160px]"
            >
              <p className={`text-sm ${entry.signedAt ? "font-semibold" : ""} text-foreground`}>
                {entry.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{entry.role}</p>

              {entry.signedAt ? (
                <>
                  {!isPreviewMode && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleUnsign(idx)}
                    >
                      Unsign
                    </Button>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="text-xs text-muted-foreground">{formatDate(entry.signedAt)}</span>
                  </div>
                </>
              ) : (
                <Button
                  size="sm"
                  className="mt-2"
                  disabled={isPreviewMode}
                  onClick={() => handleSign(idx)}
                >
                  Signoff
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
