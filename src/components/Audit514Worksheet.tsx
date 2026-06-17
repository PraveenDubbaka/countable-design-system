import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface EstimateRow {
  id: string;
  estimateType: string;
  accountBalance: string;
  priorYearAmt: string;
  priorYearMethod: string;
  currentYearAmt: string;
  currentYearMethod: string;
  difference: string;
  assessment: string;
  auditResponse: string;
}

interface Data514 {
  rows: EstimateRow[];
  conclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

function newRow(): EstimateRow {
  return {
    id: Math.random().toString(36).slice(2),
    estimateType: '', accountBalance: '', priorYearAmt: '', priorYearMethod: '',
    currentYearAmt: '', currentYearMethod: '', difference: '', assessment: '', auditResponse: '',
  };
}

function buildDefault(): Data514 {
  return {
    rows: [newRow(), newRow(), newRow()],
    conclusion: '',
    preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '',
    concluded: false, concludedOn: '',
  };
}

const ASSESSMENT_OPTIONS = ['Reasonable', 'Requires explanation', 'Potential misstatement', 'N/A'];

export function Audit514Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-514-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const [data, setData] = useState<Data514>(() => {
    const saved = readJsonFromLocalStorage<Data514>(storageKey);
    return saved ?? buildDefault();
  });

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  function updateRow(id: string, field: keyof EstimateRow, value: string) {
    setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, [field]: value } : r) }));
  }
  function addRow() { setData(d => ({ ...d, rows: [...d.rows, newRow()] })); }
  function removeRow(id: string) { setData(d => ({ ...d, rows: d.rows.filter(r => r.id !== id) })); }

  const tdCls = "border border-border px-2 py-1.5 text-xs align-top";
  const thCls = "border border-border bg-muted px-2 py-1.5 text-xs font-medium text-left align-middle whitespace-nowrap";

  return (
    <div className="p-4 space-y-4 text-sm">
      {/* Objective */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objective</p>
        <p className="text-sm text-foreground">
          Document the outcome of prior period accounting estimates compared to the current year, identify any significant differences,
          and assess whether the differences indicate possible management bias or require audit response.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Prior Period Estimates — Outcome Analysis</h3>
          {!locked && (
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={addRow}>
              <Plus className="h-3 w-3" /> Add Row
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className={thCls} style={{ width: 140 }}>Estimate Type</th>
                <th className={thCls} style={{ width: 110 }}>Account/Balance</th>
                <th className={thCls} style={{ width: 90 }}>Prior Year $</th>
                <th className={thCls} style={{ width: 130 }}>Prior Year Method</th>
                <th className={thCls} style={{ width: 90 }}>Current Year $</th>
                <th className={thCls} style={{ width: 130 }}>Current Year Method</th>
                <th className={thCls} style={{ width: 90 }}>Difference $</th>
                <th className={thCls} style={{ width: 130 }}>Assessment</th>
                <th className={thCls}>Audit Response</th>
                {!locked && <th className={thCls} style={{ width: 32 }}></th>}
              </tr>
            </thead>
            <tbody>
              {data.rows.map(row => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.estimateType} onChange={e => updateRow(row.id, 'estimateType', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="e.g. AR allowance" />
                  </td>
                  <td className={tdCls}>
                    <Input disabled={locked} value={row.accountBalance} onChange={e => updateRow(row.id, 'accountBalance', e.target.value)}
                      className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Account name" />
                  </td>
                  <td className={tdCls}>
                    <Input disabled={locked} value={row.priorYearAmt} onChange={e => updateRow(row.id, 'priorYearAmt', e.target.value)}
                      className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" />
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.priorYearMethod} onChange={e => updateRow(row.id, 'priorYearMethod', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Method used" />
                  </td>
                  <td className={tdCls}>
                    <Input disabled={locked} value={row.currentYearAmt} onChange={e => updateRow(row.id, 'currentYearAmt', e.target.value)}
                      className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" />
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.currentYearMethod} onChange={e => updateRow(row.id, 'currentYearMethod', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Method used" />
                  </td>
                  <td className={tdCls}>
                    <Input disabled={locked} value={row.difference} onChange={e => updateRow(row.id, 'difference', e.target.value)}
                      className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="0" />
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.assessment} onValueChange={v => updateRow(row.id, 'assessment', v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSESSMENT_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.auditResponse} onChange={e => updateRow(row.id, 'auditResponse', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="Response if needed" />
                  </td>
                  {!locked && (
                    <td className={tdCls + " text-center"}>
                      <button onClick={() => removeRow(row.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conclusion */}
      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-2">
        <h3 className="text-sm font-semibold">Conclusion</h3>
        <Textarea disabled={locked} value={data.conclusion}
          onChange={e => setData(d => ({ ...d, conclusion: e.target.value }))}
          className="text-xs min-h-[80px]"
          placeholder="Summarize whether any differences indicate possible management bias and the overall impact on the audit." />
      </div>

      {/* Sign-off */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <h3 className="text-sm font-semibold mb-3">Sign-off</h3>
        <div className="grid grid-cols-2 gap-3">
          {[['Prepared by', 'preparedBy', 'preparedDate'], ['Reviewed by', 'reviewedBy', 'reviewedDate']].map(([label, nameKey, dateKey]) => (
            <div key={nameKey} className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <div className="flex gap-2">
                <Input disabled={locked} value={(data as Record<string, string>)[nameKey]} onChange={e => setData(d => ({ ...d, [nameKey]: e.target.value }))}
                  className="h-7 text-xs flex-1" placeholder="Name" />
                <Input disabled={locked} type="date" value={(data as Record<string, string>)[dateKey]} onChange={e => setData(d => ({ ...d, [dateKey]: e.target.value }))}
                  className="h-7 text-xs w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conclude */}
      {locked ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-800 font-medium">
          Concluded on {data.concludedOn}
        </div>
      ) : (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => {
            const today = new Date().toISOString().slice(0, 10);
            const updated = { ...data, concluded: true, concludedOn: today };
            setData(updated);
            writeJsonToLocalStorage(storageKey, updated);
          }}>
            Conclude Worksheet
          </Button>
        </div>
      )}
    </div>
  );
}
