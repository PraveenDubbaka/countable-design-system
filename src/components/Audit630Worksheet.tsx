import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { loadRisks520, overallRisk520 } from "@/lib/audit520Bridge";
import {
  WorksheetLayout, WorksheetHeader, LinkedRisksCard, ConcludeBar, type SignOffData,
} from "@/components/audit/WorksheetShell";

interface ConfirmRow {
  id: string;
  area: string;
  wpRef: string;
  type: "Positive" | "Negative" | "";
  nature: string;            // brief description
  itemsSent: string;
  itemsReceived: string;
  amountConfirmed: string;
  exceptions: string;
  psc: "Y" | "N" | "" ;
  initials: string;
}

interface Data630 {
  rows: ConfirmRow[];
  controlSummary: string;
  overallConclusion: string;
  signOff: SignOffData;
  concluded: boolean; concludedOn: string;
}

// Source PEG worksheet 630 standard rows
const DEFAULT_AREAS: { area: string; wpRef: string }[] = [
  { area: "Bank balances or debt", wpRef: "" },
  { area: "Accounts receivable", wpRef: "C.110" },
  { area: "Loans and advances receivable", wpRef: "" },
  { area: "Accounts payable", wpRef: "CC.110" },
  { area: "Estimates", wpRef: "" },
  { area: "Notes payable", wpRef: "" },
  { area: "Long-term debt", wpRef: "" },
  { area: "Legal letter", wpRef: "" },
  { area: "Inventory held by others", wpRef: "" },
];

function blankRow(area = "", wpRef = ""): ConfirmRow {
  return { id: Math.random().toString(36).slice(2), area, wpRef, type: "", nature: "", itemsSent: "", itemsReceived: "", amountConfirmed: "", exceptions: "", psc: "", initials: "" };
}

function buildDefault(): Data630 {
  return {
    rows: DEFAULT_AREAS.map(a => blankRow(a.area, a.wpRef)),
    controlSummary: "Control was maintained over the confirmation process: selection of confirming parties, validation of names / addresses / amounts, sending and receipt of confirmations including follow-ups for non-responses (second requests).",
    overallConclusion: "",
    signOff: { preparedBy: "", preparedDate: "", reviewedBy: "", reviewedDate: "" },
    concluded: false, concludedOn: "",
  };
}

export function Audit630Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const risks = useMemo(() => loadRisks520(engagementId), [engagementId]);
  const overall = useMemo(() => overallRisk520(risks), [risks]);

  const storageKey = `audit-630-data-${engagementId ?? "default"}`;
  const [data, setData] = useState<Data630>(() => readJsonFromLocalStorage<Data630>(storageKey, buildDefault()) ?? buildDefault());

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;
  const upd = (id: string, field: keyof ConfirmRow, value: string) =>
    setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, [field]: value } : r) }));

  const td = "border-b border-border px-2 py-1.5 text-xs align-top";

  return (
    <WorksheetLayout
      objective="Summarise the use of external confirmation procedures, the nature and number of items confirmed, and any exceptions or difficulties encountered."
      standard={`${ctx.standardPrefix} 505`}
    >
      <WorksheetHeader
        ctx={ctx}
        formNo="630"
        title="Summary of External Confirmations"
        standard={`${ctx.standardPrefix} 505`}
        overallRisk={overall}
      />


      <LinkedRisksCard overallRisk={overall}
        risks={risks.filter(r => /receiv|payab|bank|debt|loan|invent|legal|confirm/i.test(`${r.scotabd ?? ""} ${r.rmmIdentified}`))}
        emptyHint="No risks tagged for areas typically requiring confirmation."
      />

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Confirmation register</h3>
          {!locked && <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setData(d => ({ ...d, rows: [...d.rows, blankRow()] }))}><Plus className="h-3 w-3" /> Add area</Button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-muted/60">
              <th className="text-left px-2 py-2 font-medium border-b border-border w-[160px]">Audit area</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border w-[80px]">W/P ref.</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border w-[90px]">Type</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border">Nature &amp; number of items confirmed</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border w-[70px]">Sent</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border w-[80px]">Received</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border w-[110px]">Amount confirmed $</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border">Exceptions / difficulties</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border w-[60px]">PSC</th>
              <th className="text-left px-2 py-2 font-medium border-b border-border w-[70px]">Initials</th>
              {!locked && <th className="border-b border-border w-[32px]"></th>}
            </tr></thead>
            <tbody>
              {data.rows.map(r => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className={td}><Input disabled={locked} value={r.area} onChange={e => upd(r.id, "area", e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" /></td>
                  <td className={`${td} font-mono`}><Input disabled={locked} value={r.wpRef} onChange={e => upd(r.id, "wpRef", e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="—" /></td>
                  <td className={td}>
                    <Select disabled={locked} value={r.type} onValueChange={(v: "Positive" | "Negative") => upd(r.id, "type", v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Positive" className="text-xs">Positive</SelectItem>
                        <SelectItem value="Negative" className="text-xs">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={td}><Textarea disabled={locked} value={r.nature} onChange={e => upd(r.id, "nature", e.target.value)} className="min-h-[48px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="e.g. top 15 customers by balance" /></td>
                  <td className={td}><Input disabled={locked} value={r.itemsSent} onChange={e => upd(r.id, "itemsSent", e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                  <td className={td}><Input disabled={locked} value={r.itemsReceived} onChange={e => upd(r.id, "itemsReceived", e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                  <td className={td}><Input disabled={locked} value={r.amountConfirmed} onChange={e => upd(r.id, "amountConfirmed", e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" /></td>
                  <td className={td}><Textarea disabled={locked} value={r.exceptions} onChange={e => upd(r.id, "exceptions", e.target.value)} className="min-h-[48px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="None / describe" /></td>
                  <td className={td}>
                    <Select disabled={locked} value={r.psc} onValueChange={(v: "Y" | "N") => upd(r.id, "psc", v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent"><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent><SelectItem value="Y" className="text-xs">Y</SelectItem><SelectItem value="N" className="text-xs">N</SelectItem></SelectContent>
                    </Select>
                  </td>
                  <td className={td}><Input disabled={locked} value={r.initials} onChange={e => upd(r.id, "initials", e.target.value)} className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" /></td>
                  {!locked && <td className={td + " text-center"}><button onClick={() => setData(d => ({ ...d, rows: d.rows.filter(x => x.id !== r.id) }))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 text-[11px] text-muted-foreground border-t border-border bg-muted/30">
          Negative confirmations are appropriate only when: RMM is low; other substantive evidence exists; controls are reliable; population is large, small and homogeneous; and a low exception rate is expected.
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Control over the confirmation process</label>
        <Textarea disabled={locked} value={data.controlSummary} onChange={e => setData(d => ({ ...d, controlSummary: e.target.value }))} className="text-xs min-h-[64px]" />
      </div>

      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overall conclusion</label>
        <Textarea disabled={locked} value={data.overallConclusion} onChange={e => setData(d => ({ ...d, overallConclusion: e.target.value }))} className="text-xs min-h-[72px]" placeholder="Conclude on the sufficiency of evidence obtained from external confirmations." />
      </div>

      <ConcludeBar concluded={data.concluded} concludedOn={data.concludedOn}
        onConclude={() => { const u = { ...data, concluded: true, concludedOn: new Date().toISOString().slice(0, 10) }; setData(u); writeJsonToLocalStorage(storageKey, u); }} />
    </WorksheetLayout>
  );
}
