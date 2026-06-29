// Shared UI building blocks for Response-to-Risk worksheets (605/610/625/630/635/645)
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { EngagementContext } from "@/lib/engagementContext";
import type { Risk520Row } from "@/lib/audit520Bridge";

const RISK_TONE: Record<string, string> = {
  High: "bg-red-50 text-red-700 border-red-200",
  Moderate: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function WorksheetHeader({
  ctx,
  formNo,
  title,
  standard,
  overallRisk,
  objective,
}: {
  ctx: EngagementContext;
  formNo: string;
  title: string;
  standard: string;
  overallRisk?: "High" | "Moderate" | "Low";
  objective: string;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Form {formNo} · {standard}</p>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Chip label="Entity" value={ctx.entityName} />
            <Chip label="Period end" value={ctx.periodEndDisplay} />
            <Chip label="Framework" value={ctx.framework.split(" — ")[0]} />
            {overallRisk && (
              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[11px] font-medium ${RISK_TONE[overallRisk]}`}>
                <span className="opacity-70">FS-level risk</span> · {overallRisk}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-primary/15 bg-primary/[0.04] px-4 py-2.5 flex items-start gap-2">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-[11px] font-semibold text-primary uppercase tracking-wide mt-0.5">Objective</span>
        <p className="text-xs text-foreground/80 leading-relaxed flex-1">{objective}</p>
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/60 border border-border text-[11px]">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

export function LinkedRisksCard({ risks, emptyHint }: { risks: Risk520Row[]; emptyHint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold">Linked risks from Form 520</h3>
        <span className="text-[11px] text-muted-foreground">Auto-populated · editable in Form 520</span>
      </div>
      {risks.length === 0 ? (
        <p className="px-4 py-3 text-xs text-muted-foreground">
          {emptyHint ?? "No matching risks identified in Form 520. Update Form 520 to flow risks through."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted/60">
                <th className="text-left px-3 py-2 font-medium border-b border-border w-[70px]">W/P</th>
                <th className="text-left px-3 py-2 font-medium border-b border-border w-[130px]">FS area</th>
                <th className="text-left px-3 py-2 font-medium border-b border-border">RMM identified</th>
                <th className="text-left px-3 py-2 font-medium border-b border-border w-[80px]">Fraud</th>
                <th className="text-left px-3 py-2 font-medium border-b border-border w-[60px]">IR</th>
                <th className="text-left px-3 py-2 font-medium border-b border-border w-[80px]">Sig. risk</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-3 py-2 font-mono text-[11px] whitespace-nowrap text-foreground/70">{r.ref}</td>
                  <td className="px-3 py-2">{r.scotabd ?? <span className="text-muted-foreground">FS-level</span>}</td>
                  <td className="px-3 py-2 leading-snug">{r.rmmIdentified}</td>
                  <td className="px-3 py-2">{r.fraudRisk === "Y" ? <span className="text-red-700 font-medium">Yes</span> : "—"}</td>
                  <td className="px-3 py-2 font-medium">{r.inherentRisk || "—"}</td>
                  <td className="px-3 py-2">{r.significantRisk === "Y" ? <span className="text-red-700 font-medium">Yes</span> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Procedure row (used by 605/625/635/645) ───────────────────────────────────
export interface ProcRow {
  id: string;
  procedure: string;        // pre-seeded label (read-only)
  psa?: string;             // e.g. "C (AV E)"
  wpRef: string;
  psc: "Y" | "N" | "N/A" | "";
  initials: string;
  comments: string;
}

export function ProcedureTable({
  sections,
  locked,
  onChange,
}: {
  sections: { title: string; rows: ProcRow[] }[];
  locked: boolean;
  onChange: (sectionIdx: number, rowId: string, field: keyof ProcRow, value: string) => void;
}) {
  const td = "border-b border-border px-2.5 py-2 text-xs align-top";
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted/60">
              <th className="text-left px-2.5 py-2 font-medium border-b border-border w-[34px]">#</th>
              <th className="text-left px-2.5 py-2 font-medium border-b border-border">Procedure</th>
              <th className="text-left px-2.5 py-2 font-medium border-b border-border w-[70px]">P&amp;SA</th>
              <th className="text-left px-2.5 py-2 font-medium border-b border-border w-[120px]">W/P ref.</th>
              <th className="text-left px-2.5 py-2 font-medium border-b border-border w-[70px]">PSC</th>
              <th className="text-left px-2.5 py-2 font-medium border-b border-border w-[80px]">Initials</th>
              <th className="text-left px-2.5 py-2 font-medium border-b border-border w-[260px]">Comments / exceptions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s, si) => (
              <FragmentRows key={si} title={s.title} rows={s.rows} sectionIdx={si} td={td} locked={locked} onChange={onChange} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentRows({ title, rows, sectionIdx, td, locked, onChange }: {
  title: string; rows: ProcRow[]; sectionIdx: number; td: string; locked: boolean;
  onChange: (sectionIdx: number, rowId: string, field: keyof ProcRow, value: string) => void;
}) {
  let n = 0;
  return (
    <>
      <tr className="bg-primary/5">
        <td colSpan={7} className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary border-b border-border">{title}</td>
      </tr>
      {rows.map(r => {
        n += 1;
        return (
          <tr key={r.id} className="hover:bg-muted/30">
            <td className={`${td} text-muted-foreground font-medium`}>{n}</td>
            <td className={td}>
              <span className="block whitespace-pre-wrap leading-snug">{r.procedure}</span>
            </td>
            <td className={`${td} font-mono text-[11px] whitespace-nowrap`}>{r.psa || "—"}</td>
            <td className={td}>
              <Input disabled={locked} value={r.wpRef} onChange={e => onChange(sectionIdx, r.id, "wpRef", e.target.value)}
                className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="—" />
            </td>
            <td className={td}>
              <Select disabled={locked} value={r.psc} onValueChange={v => onChange(sectionIdx, r.id, "psc", v)}>
                <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y" className="text-xs">Y</SelectItem>
                  <SelectItem value="N" className="text-xs">N</SelectItem>
                  <SelectItem value="N/A" className="text-xs">N/A</SelectItem>
                </SelectContent>
              </Select>
            </td>
            <td className={td}>
              <Input disabled={locked} value={r.initials} onChange={e => onChange(sectionIdx, r.id, "initials", e.target.value)}
                className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="—" />
            </td>
            <td className={td}>
              <Textarea disabled={locked} value={r.comments} onChange={e => onChange(sectionIdx, r.id, "comments", e.target.value)}
                className="min-h-[52px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="—" />
            </td>
          </tr>
        );
      })}
    </>
  );
}

// ─── Sign-off + Conclude ───────────────────────────────────────────────────────
export interface SignOffData {
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
}

export function SignOffCard({ data, locked, onChange }: {
  data: SignOffData; locked: boolean;
  onChange: (k: keyof SignOffData, v: string) => void;
}) {
  const cells: [keyof SignOffData, keyof SignOffData, string][] = [
    ["preparedBy", "preparedDate", "Prepared by"],
    ["reviewedBy", "reviewedDate", "Reviewed by"],
  ];
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <h3 className="text-sm font-semibold mb-3">Sign-off</h3>
      <div className="grid grid-cols-2 gap-3">
        {cells.map(([nk, dk, label]) => (
          <div key={nk} className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <div className="flex gap-2">
              <Input disabled={locked} value={data[nk]} onChange={e => onChange(nk, e.target.value)} className="h-8 text-xs flex-1" placeholder="Name / initials" />
              <Input disabled={locked} type="date" value={data[dk]} onChange={e => onChange(dk, e.target.value)} className="h-8 text-xs w-36" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConcludeBar({ concluded, concludedOn, onConclude }: {
  concluded: boolean; concludedOn: string; onConclude: () => void;
}) {
  if (concluded) {
    return <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800 font-medium">Worksheet concluded on {concludedOn}.</div>;
  }
  return (
    <div className="flex justify-end">
      <Button size="sm" onClick={onConclude}>Conclude worksheet</Button>
    </div>
  );
}

export function makeProcRow(procedure: string, psa = ""): ProcRow {
  return { id: Math.random().toString(36).slice(2, 9), procedure, psa, wpRef: "", psc: "", initials: "", comments: "" };
}
