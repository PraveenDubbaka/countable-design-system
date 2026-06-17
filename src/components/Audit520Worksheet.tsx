import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface RiskRow {
  id: string;
  riskArea: string;
  description: string;
  likelihood: string;
  impact: string;
  inherentRisk: string;
  existingControls: string;
  residualRisk: string;
  auditResponse: string;
  wpRef: string;
}

interface Data520 {
  entityName: string;
  periodEnd: string;
  rows: RiskRow[];
  conclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const LIKELIHOOD_OPTIONS = ['High', 'Medium', 'Low'];
const IMPACT_OPTIONS = ['High', 'Medium', 'Low'];
const RISK_OPTIONS = ['High', 'Moderate', 'Low', 'Significant'];

function newRow(): RiskRow {
  return {
    id: Math.random().toString(36).slice(2),
    riskArea: '', description: '', likelihood: '', impact: '',
    inherentRisk: '', existingControls: '', residualRisk: '', auditResponse: '', wpRef: '',
  };
}

function buildDefault(): Data520 {
  return {
    entityName: '', periodEnd: '',
    rows: [newRow(), newRow(), newRow(), newRow()],
    conclusion: '',
    preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '',
    concluded: false, concludedOn: '',
  };
}

export function Audit520Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-520-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const [data, setData] = useState<Data520>(() => {
    const saved = readJsonFromLocalStorage<Data520>(storageKey);
    return saved ?? buildDefault();
  });

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  function updateRow(id: string, field: keyof RiskRow, value: string) {
    setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, [field]: value } : r) }));
  }
  function addRow() { setData(d => ({ ...d, rows: [...d.rows, newRow()] })); }
  function removeRow(id: string) { setData(d => ({ ...d, rows: d.rows.filter(r => r.id !== id) })); }

  const tdCls = "border border-border px-2 py-1.5 text-xs align-top";
  const thCls = "border border-border bg-muted px-2 py-1.5 text-xs font-medium text-left align-middle";

  const riskColor = (v: string) => v === 'High' || v === 'Significant' ? 'text-red-600' : v === 'Moderate' || v === 'Medium' ? 'text-amber-600' : v === 'Low' ? 'text-green-600' : '';

  return (
    <div className="p-4 space-y-4 text-sm">
      {/* Objective */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objective</p>
        <p className="text-sm text-foreground">
          Document identified business and operating risks specific to the entity, assess their likelihood and impact,
          evaluate existing controls, and determine the residual risk and planned audit response.
        </p>
      </div>

      {/* Header fields */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Entity Name</label>
            <Input disabled={locked} value={data.entityName} onChange={e => setData(d => ({ ...d, entityName: e.target.value }))}
              className="h-7 text-xs" placeholder="Entity name" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Period End Date</label>
            <Input disabled={locked} type="date" value={data.periodEnd} onChange={e => setData(d => ({ ...d, periodEnd: e.target.value }))}
              className="h-7 text-xs" />
          </div>
        </div>
      </div>

      {/* Risk Register table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Risk Register — Entity Specific (Business / Operating)</h3>
          {!locked && (
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={addRow}>
              <Plus className="h-3 w-3" /> Add Risk
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className={thCls} style={{ width: 120 }}>Risk Area</th>
                <th className={thCls}>Risk Description</th>
                <th className={thCls} style={{ width: 80 }}>Likelihood</th>
                <th className={thCls} style={{ width: 80 }}>Impact</th>
                <th className={thCls} style={{ width: 90 }}>Inherent Risk</th>
                <th className={thCls}>Existing Controls</th>
                <th className={thCls} style={{ width: 90 }}>Residual Risk</th>
                <th className={thCls}>Audit Response</th>
                <th className={thCls} style={{ width: 70 }}>WP Ref</th>
                {!locked && <th className={thCls} style={{ width: 32 }}></th>}
              </tr>
            </thead>
            <tbody>
              {data.rows.map(row => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.riskArea} onChange={e => updateRow(row.id, 'riskArea', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="e.g. Revenue recognition" />
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.description} onChange={e => updateRow(row.id, 'description', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Describe the risk" />
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.likelihood} onValueChange={v => updateRow(row.id, 'likelihood', v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {LIKELIHOOD_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.impact} onValueChange={v => updateRow(row.id, 'impact', v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {IMPACT_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.inherentRisk} onValueChange={v => updateRow(row.id, 'inherentRisk', v)}>
                      <SelectTrigger className={`h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent ${riskColor(row.inherentRisk)}`}>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {RISK_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.existingControls} onChange={e => updateRow(row.id, 'existingControls', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Describe controls" />
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.residualRisk} onValueChange={v => updateRow(row.id, 'residualRisk', v)}>
                      <SelectTrigger className={`h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent ${riskColor(row.residualRisk)}`}>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {RISK_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.auditResponse} onChange={e => updateRow(row.id, 'auditResponse', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Audit procedures planned" />
                  </td>
                  <td className={tdCls}>
                    <Input disabled={locked} value={row.wpRef} onChange={e => updateRow(row.id, 'wpRef', e.target.value)}
                      className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="WP ref" />
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
          placeholder="Summarize the overall risk profile and how identified risks have been addressed in the audit plan." />
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
