// Shared UI building blocks for Response-to-Risk worksheets (605/610/625/630/635/645)
// Design standards aligned with AuditMaterialityWorksheet (cards, objective bar, scroll body).
import { useState, useEffect, useRef } from "react";
import { Info, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefButton, type RefDoc } from "@/components/RefButton";
import type { ReactNode } from "react";
import type { EngagementContext } from "@/lib/engagementContext";
import type { Risk520Row } from "@/lib/audit520Bridge";
import { WorksheetSignOff } from "@/components/WorksheetSignOff";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

export interface ManualRisk {
  id: string;
  fsArea: string;
  rmmIdentified: string;
  wpRef: RefDoc[];
}

interface LinkedRisksPersistedState {
  manualRisks: ManualRisk[];
  riskWpRefs: Record<string, RefDoc[]>;
}

function uid() { return Math.random().toString(36).slice(2, 10); }

const RISK_TONE: Record<string, string> = {
  High: "bg-red-50 text-red-700 border-red-200",
  Moderate: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const CARD = "bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden";
const SECTION_HEADER = "px-6 py-3.5 bg-card border-b border-border flex items-center gap-3";

// ─── Page layout ───────────────────────────────────────────────────────────────
export function WorksheetLayout({
  objective,
  standard,
  children,
}: {
  objective: string;
  standard: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          {objective} <span className="text-muted-foreground/70">({standard})</span>
        </p>
      </div>
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}

// ─── Section wrapper (matches Materiality card chrome) ─────────────────────────
export function WorksheetSection({
  title,
  right,
  children,
  bodyClassName = "p-6",
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
}) {
  return (
    <div className={CARD}>
      <div className={SECTION_HEADER}>
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <div className="flex-1" />
        {right}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

// ─── Header card (entity / period / framework / FS-risk chip) ──────────────────
/** @deprecated Header card removed — entity context lives in the page chrome,
 *  and the FS-level risk badge now renders inside the Linked Risks card header. */
export function WorksheetHeader(_props: {
  ctx: EngagementContext;
  formNo: string;
  title: string;
  standard: string;
  overallRisk?: "High" | "Moderate" | "Low";
  objective?: string;
}) {
  return null;
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 border border-border text-[11px]">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

// ─── Linked Risks card ─────────────────────────────────────────────────────────
export function LinkedRisksCard({
  risks,
  emptyHint,
  overallRisk,
  storageKey,
  locked = false,
}: {
  risks: Risk520Row[];
  emptyHint?: string;
  overallRisk?: "High" | "Moderate" | "Low";
  storageKey?: string;
  locked?: boolean;
}) {
  const defaultState: LinkedRisksPersistedState = { manualRisks: [], riskWpRefs: {} };
  const [state, setState] = useState<LinkedRisksPersistedState>(() =>
    storageKey ? (readJsonFromLocalStorage<LinkedRisksPersistedState>(storageKey, defaultState) ?? defaultState) : defaultState
  );
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<{ fsArea: string; rmmIdentified: string }>({ fsArea: "", rmmIdentified: "" });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!storageKey) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, state), 450);
  }, [state, storageKey]);

  const commitDraft = () => {
    if (!draft.rmmIdentified.trim()) return;
    setState(s => ({
      ...s,
      manualRisks: [...s.manualRisks, { id: uid(), fsArea: draft.fsArea, rmmIdentified: draft.rmmIdentified, wpRef: [] }],
    }));
    setDraft({ fsArea: "", rmmIdentified: "" });
    setAdding(false);
  };

  const removeManual = (id: string) =>
    setState(s => ({ ...s, manualRisks: s.manualRisks.filter(r => r.id !== id) }));

  const hasRows = risks.length > 0 || state.manualRisks.length > 0;
  const td = "px-4 py-2.5 text-xs align-top border-b border-border last:border-b-0";

  return (
    <WorksheetSection
      title="Linked risks from Form 520"
      right={
        <div className="flex items-center gap-2">
          {overallRisk && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${RISK_TONE[overallRisk]}`}>
              <span className="opacity-70">FS-level risk</span> · {overallRisk}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">Form 520</span>
          {!locked && (
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => { setAdding(true); setDraft({ fsArea: "", rmmIdentified: "" }); }}>
              <Plus className="h-3 w-3" /> Add risk
            </Button>
          )}
        </div>
      }
      bodyClassName="p-0"
    >
      {!hasRows && !adding ? (
        <p className="px-6 py-4 text-xs text-muted-foreground">
          {emptyHint ?? "No matching risks identified in Form 520. Update Form 520 to flow risks through."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left px-4 py-2.5 font-medium border-b border-border w-[80px]">W/P</th>
                <th className="text-left px-4 py-2.5 font-medium border-b border-border w-[130px]">FS area</th>
                <th className="text-left px-4 py-2.5 font-medium border-b border-border">RMM identified</th>
                <th className="text-left px-4 py-2.5 font-medium border-b border-border w-[70px]">Fraud</th>
                <th className="text-left px-4 py-2.5 font-medium border-b border-border w-[50px]">IR</th>
                <th className="text-left px-4 py-2.5 font-medium border-b border-border w-[70px]">Sig. risk</th>
                {!locked && <th className="w-[40px] border-b border-border" />}
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={i} className="hover:bg-muted/20">
                  <td className={`${td} font-mono text-[11px] whitespace-nowrap text-foreground/70`}>{r.ref}</td>
                  <td className={td}>{r.scotabd ?? <span className="text-muted-foreground">FS-level</span>}</td>
                  <td className={`${td} leading-snug`}>{r.rmmIdentified}</td>
                  <td className={td}>{r.fraudRisk === "Y" ? <span className="text-red-700 font-medium">Yes</span> : "—"}</td>
                  <td className={`${td} font-medium`}>{r.inherentRisk || "—"}</td>
                  <td className={td}>{r.significantRisk === "Y" ? <span className="text-red-700 font-medium">Yes</span> : "—"}</td>
                  {!locked && <td className={td} />}
                </tr>
              ))}
              {state.manualRisks.map(r => (
                <tr key={r.id} className="hover:bg-muted/20">
                  <td className={`${td} font-mono text-[11px] text-muted-foreground`}>—</td>
                  <td className={td}>{r.fsArea || <span className="text-muted-foreground">—</span>}</td>
                  <td className={`${td} leading-snug`}>{r.rmmIdentified}</td>
                  <td className={td}>—</td>
                  <td className={td}>—</td>
                  <td className={td}>—</td>
                  {!locked && (
                    <td className={`${td} text-center`}>
                      <button onClick={() => removeManual(r.id)} className="p-1 hover:text-destructive text-muted-foreground transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {adding && (
                <tr className="bg-primary/[0.03]">
                  <td className={`${td} font-mono text-[11px] text-muted-foreground`}>—</td>
                  <td className={td}>
                    <Input
                      autoFocus
                      value={draft.fsArea}
                      onChange={e => setDraft(d => ({ ...d, fsArea: e.target.value }))}
                      placeholder="FS area"
                      className="h-7 text-xs"
                    />
                  </td>
                  <td className={td} colSpan={3}>
                    <Input
                      value={draft.rmmIdentified}
                      onChange={e => setDraft(d => ({ ...d, rmmIdentified: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") commitDraft(); if (e.key === "Escape") setAdding(false); }}
                      placeholder="Risk of material misstatement identified…"
                      className="h-7 text-xs"
                    />
                  </td>
                  <td className={td} />
                  <td className={`${td} whitespace-nowrap`}>
                    <div className="flex items-center gap-1">
                      <Button size="sm" className="h-6 text-xs px-2" onClick={commitDraft}>Add</Button>
                      <Button size="sm" variant="ghost" className="h-6 text-xs px-2" onClick={() => setAdding(false)}>Cancel</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </WorksheetSection>
  );
}

// ─── Procedure row (used by 605/625/635/645) ───────────────────────────────────
export interface ProcRow {
  id: string;
  procedure: string;
  psa?: string;
  wpRef: RefDoc[];
  psc: "Y" | "N" | "N/A" | "";
  comments: string;
}

export function ProcedureTable({
  sections,
  locked,
  onChange,
  showPsa = true,
  showNumbers = true,
}: {
  sections: { title: string; rows: ProcRow[] }[];
  locked: boolean;
  onChange: (sectionIdx: number, rowId: string, field: keyof ProcRow, value: string | RefDoc[]) => void;
  showPsa?: boolean;
  showNumbers?: boolean;
}) {
  const td = "border-b border-border px-3 py-2.5 text-xs align-top";
  const colCount = (showNumbers ? 1 : 0) + (showPsa ? 1 : 0) + 4;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-muted/40">
            {showNumbers && <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[40px]">#</th>}
            <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[320px]">Procedure</th>
            {showPsa && <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[80px]">P&amp;SA</th>}
            <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[70px]">PSC</th>
            <th className="text-left px-3 py-2.5 font-medium border-b border-border w-[260px]">Comments / exceptions</th>
            <th className="text-center px-3 py-2.5 font-medium border-b border-border w-[90px]">W/P ref.</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((s, si) => (
            <FragmentRows key={si} title={s.title} rows={s.rows} sectionIdx={si} td={td} locked={locked} onChange={onChange} showPsa={showPsa} showNumbers={showNumbers} colCount={colCount} />
          ))}
        </tbody>
      </table>
    </div>
  );
}


function FragmentRows({ title, rows, sectionIdx, td, locked, onChange, showPsa, showNumbers, colCount }: {
  title: string; rows: ProcRow[]; sectionIdx: number; td: string; locked: boolean;
  onChange: (sectionIdx: number, rowId: string, field: keyof ProcRow, value: string | RefDoc[]) => void;
  showPsa: boolean; showNumbers: boolean; colCount: number;
}) {
  let n = 0;
  return (
    <>
      <tr className="bg-primary/[0.06]">
        <td colSpan={colCount} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-primary border-b border-border">{title}</td>
      </tr>
      {rows.map(r => {
        n += 1;
        return (
          <tr key={r.id} className="hover:bg-muted/20">
            {showNumbers && <td className={`${td} text-muted-foreground font-medium`}>{n}</td>}
            <td className={td}><span className="block whitespace-pre-wrap leading-snug">{r.procedure}</span></td>
            {showPsa && <td className={`${td} font-mono text-[11px] whitespace-nowrap`}>{r.psa || "—"}</td>}
            <td className={td}>
              <Select disabled={locked} value={r.psc} onValueChange={v => onChange(sectionIdx, r.id, "psc", v)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y" className="text-xs">Y</SelectItem>
                  <SelectItem value="N" className="text-xs">N</SelectItem>
                  <SelectItem value="N/A" className="text-xs">N/A</SelectItem>
                </SelectContent>
              </Select>
            </td>
            <td className={td}>
              <Textarea disabled={locked} value={r.comments} onChange={e => onChange(sectionIdx, r.id, "comments", e.target.value)}
                className="min-h-[56px] text-xs resize-none" placeholder="—" />
            </td>
            <td className={`${td} text-center`}>
              <RefButton
                reference={r.wpRef}
                disabled={locked}
                onAttach={doc => onChange(sectionIdx, r.id, "wpRef", [...r.wpRef, doc])}
                onRemove={idx => onChange(sectionIdx, r.id, "wpRef", r.wpRef.filter((_, j) => j !== (idx ?? -1)))}
              />
            </td>
          </tr>
        );
      })}
    </>
  );
}


// ─── Sign-off (kept for backward-compat type only; UI removed per requirements) ─
export interface SignOffData {
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
}
/** @deprecated Sign-off section removed from worksheets per design standards. */
export function SignOffCard(_props: { data: SignOffData; locked: boolean; onChange: (k: keyof SignOffData, v: string) => void }) {
  return null;
}

// ─── Conclude bar ──────────────────────────────────────────────────────────────
export function ConcludeBar({ concluded, concludedOn, onConclude, worksheetKey, engagementId }: {
  concluded: boolean; concludedOn: string; onConclude: () => void;
  worksheetKey?: string; engagementId?: string;
}) {
  const signOff = worksheetKey ? (
    <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
      <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
        <span className="text-sm font-semibold text-foreground">Sign-off</span>
      </div>
      <WorksheetSignOff worksheetKey={worksheetKey} engagementId={engagementId} />
      <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3 bg-muted/20">
        {concluded ? (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-xs text-green-800 font-medium">
            Concluded on {concludedOn}
          </div>
        ) : (
          <Button size="sm" onClick={onConclude}>Conclude worksheet</Button>
        )}
      </div>
    </div>
  ) : concluded ? (
    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-6 py-3 text-xs text-emerald-800 font-medium">Worksheet concluded on {concludedOn}.</div>
  ) : (
    <div className="flex justify-end">
      <Button size="sm" onClick={onConclude}>Conclude worksheet</Button>
    </div>
  );
  return signOff;
}

export function makeProcRow(procedure: string, psa = ""): ProcRow {
  return { id: Math.random().toString(36).slice(2, 9), procedure, psa, wpRef: [], psc: "", comments: "" };
}
