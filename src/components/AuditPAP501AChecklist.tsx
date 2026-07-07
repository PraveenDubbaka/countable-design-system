import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Info, Paperclip } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { RefButton, type RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

// ── Data ────────────────────────────────────────────────────────────────────────

type Response = "Yes" | "No" | "NA" | null;

interface RowState {
  response: Response;
  explanation: string;
  wpRef: RefDoc[];
}

interface PAP501AData {
  rows: Record<string, RowState>;
}

const PART_A_ROWS: { id: string; num: string; text: string; sub?: boolean }[] = [
  { id: "pa-1", num: "1", text: "Obtain a copy of the most recent financial results/trial balance and relevant information (financial and non-financial) available from the entity." },
  { id: "pa-2", num: "2", text: "Ensure that the information obtained is reliable and adequate for the purposes of performing analytical procedures." },
  { id: "pa-3", num: "3", text: "Review the information obtained, and identify any:" },
  { id: "pa-3a", num: "3a", text: "Inconsistencies with our understanding of the entity.", sub: true },
  { id: "pa-3b", num: "3b", text: "Negative trends, or other unusual relationships, including those related to revenue accounts.", sub: true },
  { id: "pa-3c", num: "3c", text: "Potential fraud.", sub: true },
  { id: "pa-4", num: "4", text: "Inquire of management about the reasons for any:" },
  { id: "pa-4a", num: "4a", text: "Inconsistencies, fluctuations and unexpected relationships.", sub: true },
  { id: "pa-4b", num: "4b", text: "Unusual transactions/events or other material misstatements.", sub: true },
  { id: "pa-5", num: "5", text: "Assess whether the explanations from management indicate the possible existence of the following:" },
  { id: "pa-5a", num: "5a", text: "Unusual transactions/events or other material misstatements that require a specific audit response.", sub: true },
  { id: "pa-5b", num: "5b", text: "Fraud.", sub: true },
];

function emptyRow(): RowState {
  return { response: null, explanation: "", wpRef: [] };
}

function buildDefault(): PAP501AData {
  const rows: Record<string, RowState> = {};
  PART_A_ROWS.forEach(r => { rows[r.id] = emptyRow(); });
  return { rows };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AuditPAP501AChecklist({ isUS = false }: { isUS?: boolean }) {
  const storageKey = `audit-pap501a-data-${isUS ? "us" : "ca"}`;

  const [data, setData] = useState<PAP501AData>(() => {
    const saved = readJsonFromLocalStorage<PAP501AData | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    return { rows: { ...def.rows, ...(saved.rows ?? {}) } };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 500);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const [objectiveOpen, setObjectiveOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(true);

  const setRow = (id: string, patch: Partial<RowState>) =>
    setData(d => ({ ...d, rows: { ...d.rows, [id]: { ...d.rows[id], ...patch } } }));

  const ResponseButton = ({ id, label, value }: { id: string; label: string; value: "Yes" | "No" | "NA" }) => {
    const active = data.rows[id]?.response === value;
    return (
      <motion.button
        type="button"
        onClick={() => setRow(id, { response: active ? null : value })}
        className="px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors"
        style={{
          background: active ? "hsl(var(--primary))" : "hsl(var(--muted))",
          color: active ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
          border: active ? "1px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {label}
      </motion.button>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Identify relationships (for possible use in substantive analytical procedures), risks, inconsistencies, unusual transactions and events, and other matters that may indicate risks of material misstatement.
          <span className="text-muted-foreground/70"> (Form 501 · Part A)</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
        <div className="space-y-4">
          {/* Objective accordion */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              type="button"
              onClick={() => setObjectiveOpen(!objectiveOpen)}
              className="w-full flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-foreground cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <ChevronDown size={16} className="text-muted-foreground transition-transform" style={{ transform: objectiveOpen ? "rotate(0deg)" : "rotate(-90deg)" }} />
              Objective
            </button>
            {objectiveOpen && (
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                Use this form to perform preliminary analytical procedures as noted on Form 510. Use Parts A and B (Form 501 — Parts B &amp; C) together to identify relationships, risks, inconsistencies, unusual transactions and events, and other matters that may indicate risks of material misstatement.
              </div>
            )}
          </div>

          {/* Section: Part A procedures */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ background: "hsl(var(--primary))" }} />
                <button type="button" onClick={() => setSectionOpen(!sectionOpen)} className="flex items-center gap-2 cursor-pointer">
                  <ChevronDown size={16} className="text-muted-foreground transition-transform" style={{ transform: sectionOpen ? "rotate(0deg)" : "rotate(-90deg)" }} />
                  <span className="text-sm font-semibold text-foreground">Part A — Preliminary analytical procedures</span>
                </button>
              </div>
              <span className="text-xs text-muted-foreground">{PART_A_ROWS.length} Questions</span>
            </div>

            {sectionOpen && (
              <div>
                {/* Header */}
                <div className="grid border-t border-border px-5 py-2.5" style={{ gridTemplateColumns: "56px 1fr 200px 240px 140px" }}>
                  <div className="text-xs font-medium text-muted-foreground">#</div>
                  <div className="text-xs font-medium text-muted-foreground">Procedure</div>
                  <div className="text-xs font-medium text-muted-foreground">Response</div>
                  <div className="text-xs font-medium text-muted-foreground">Exceptions / findings</div>
                  <div className="text-xs font-medium text-muted-foreground">W/P Ref.</div>
                </div>

                {PART_A_ROWS.map((r) => {
                  const row = data.rows[r.id] ?? emptyRow();
                  return (
                    <div
                      key={r.id}
                      className={`grid border-t border-border px-5 py-3.5 hover:bg-accent/30 transition-colors ${r.sub ? "bg-muted/[0.15]" : ""}`}
                      style={{ gridTemplateColumns: "56px 1fr 200px 240px 140px", alignItems: "flex-start" }}
                    >
                      <div className={`text-sm font-medium ${r.sub ? "text-muted-foreground pl-6" : "text-foreground"}`}>{r.num}</div>
                      <div className={`text-sm pr-4 ${r.sub ? "text-foreground/90" : "text-foreground"}`}>{r.text}</div>

                      <div className="flex items-center gap-1.5">
                        <ResponseButton id={r.id} label="Yes" value="Yes" />
                        <ResponseButton id={r.id} label="No" value="No" />
                        <ResponseButton id={r.id} label="NA" value="NA" />
                      </div>

                      <div>
                        <Textarea
                          value={row.explanation}
                          onChange={(e) => setRow(r.id, { explanation: e.target.value })}
                          placeholder="Additional explanation"
                          className="min-h-[44px] text-sm resize-none"
                        />
                      </div>

                      <div>
                        <RefButton
                          reference={row.wpRef}
                          onAttach={(doc) => setRow(r.id, { wpRef: [...row.wpRef, doc] })}
                          onRemove={(i) => setRow(r.id, { wpRef: row.wpRef.filter((_, idx) => idx !== i) })}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
