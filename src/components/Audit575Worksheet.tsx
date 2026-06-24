import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface DeficiencyRow {
  id: string;
  deficiencyDescription: string;
  area: string;
  classification: string;
  potentialImpact: string;
  rootCause: string;
  mgmtResponse: string;
  remediationDate: string;
  auditImplications: string;
  wpRef: string;
}

interface Data575 {
  rows: DeficiencyRow[];
  overallConclusion: string;
  communicationDate: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const CLASSIFICATION_OPTIONS = [
  'Significant deficiency',
  'Material weakness',
  'Control deficiency',
  'Observation (not a deficiency)',
];

function newRow(): DeficiencyRow {
  return {
    id: Math.random().toString(36).slice(2),
    deficiencyDescription: '', area: '', classification: '', potentialImpact: '',
    rootCause: '', mgmtResponse: '', remediationDate: '', auditImplications: '', wpRef: '',
  };
}

function buildDefault(): Data575 {
  return {
    rows: [newRow(), newRow()],
    overallConclusion: '', communicationDate: '',
    preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '',
    concluded: false, concludedOn: '',
  };
}

const classificationColor = (c: string) =>
  c === 'Material weakness' ? 'text-red-600' :
  c === 'Significant deficiency' ? 'text-amber-600' :
  c === 'Control deficiency' ? 'text-yellow-600' : '';

export function Audit575Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-575-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const [data, setData] = useState<Data575>(() => {
    const saved = readJsonFromLocalStorage<Data575>(storageKey, buildDefault());
    return saved ?? buildDefault();
  });

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  function updateRow(id: string, field: keyof DeficiencyRow, value: string) {
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
          Document internal control deficiencies identified during the audit, classify them by severity,
          assess their potential impact on the financial statements, and record management's response.
          Significant deficiencies and material weaknesses must be communicated to those charged with governance.
        </p>
      </div>

      {/* Classification guide */}
      <div className="rounded-lg border border-border bg-muted/30 px-4 py-2.5">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">Classification Reference:</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div><span className="font-medium text-red-600">Material weakness:</span> One or more deficiencies such that there is a reasonable possibility of material misstatement not being prevented or detected on a timely basis.</div>
          <div><span className="font-medium text-amber-600">Significant deficiency:</span> A deficiency, or combination of deficiencies, that is less severe than a material weakness yet important enough to merit TCWG attention.</div>
          <div><span className="font-medium text-yellow-600">Control deficiency:</span> A deficiency in the design or operation of a control that does not rise to the level of a significant deficiency.</div>
        </div>
      </div>

      {/* Deficiencies table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Internal Control Deficiencies Identified</h3>
          {!locked && (
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={addRow}>
              <Plus className="h-3 w-3" /> Add Deficiency
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className={thCls}>Deficiency Description</th>
                <th className={thCls} style={{ width: 110 }}>Area / Process</th>
                <th className={thCls} style={{ width: 130 }}>Classification</th>
                <th className={thCls}>Potential Impact</th>
                <th className={thCls}>Root Cause</th>
                <th className={thCls}>Management Response</th>
                <th className={thCls} style={{ width: 100 }}>Target Remediation</th>
                <th className={thCls}>Audit Implications</th>
                <th className={thCls} style={{ width: 70 }}>WP Ref</th>
                {!locked && <th className={thCls} style={{ width: 32 }}></th>}
              </tr>
            </thead>
            <tbody>
              {data.rows.map(row => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.deficiencyDescription} onChange={e => updateRow(row.id, 'deficiencyDescription', e.target.value)}
                      className="min-h-[72px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Describe the deficiency" />
                  </td>
                  <td className={tdCls}>
                    <Input disabled={locked} value={row.area} onChange={e => updateRow(row.id, 'area', e.target.value)}
                      className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="e.g. Payroll" />
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.classification} onValueChange={v => updateRow(row.id, 'classification', v)}>
                      <SelectTrigger className={`h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent ${classificationColor(row.classification)}`}>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSIFICATION_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.potentialImpact} onChange={e => updateRow(row.id, 'potentialImpact', e.target.value)}
                      className="min-h-[72px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Financial statement impact" />
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.rootCause} onChange={e => updateRow(row.id, 'rootCause', e.target.value)}
                      className="min-h-[72px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Underlying cause" />
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.mgmtResponse} onChange={e => updateRow(row.id, 'mgmtResponse', e.target.value)}
                      className="min-h-[72px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Management's planned response" />
                  </td>
                  <td className={tdCls}>
                    <Input disabled={locked} type="date" value={row.remediationDate} onChange={e => updateRow(row.id, 'remediationDate', e.target.value)}
                      className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" />
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.auditImplications} onChange={e => updateRow(row.id, 'auditImplications', e.target.value)}
                      className="min-h-[72px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Impact on audit approach" />
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

      {/* Communication and conclusion */}
      <div className="rounded-lg border border-border bg-card px-4 py-3 space-y-3">
        <h3 className="text-sm font-semibold">Communication & Conclusion</h3>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Date communicated to management / TCWG</label>
          <Input disabled={locked} type="date" value={data.communicationDate}
            onChange={e => setData(d => ({ ...d, communicationDate: e.target.value }))}
            className="h-7 text-xs w-40" />
        </div>
        <Textarea disabled={locked} value={data.overallConclusion}
          onChange={e => setData(d => ({ ...d, overallConclusion: e.target.value }))}
          className="text-xs min-h-[80px]"
          placeholder="Summarize overall conclusion on internal control deficiencies and their impact on the audit." />
      </div>

      {/* Sign-off */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <h3 className="text-sm font-semibold mb-3">Sign-off</h3>
        <div className="grid grid-cols-2 gap-3">
          {[['Prepared by', 'preparedBy', 'preparedDate'], ['Reviewed by', 'reviewedBy', 'reviewedDate']].map(([label, nameKey, dateKey]) => (
            <div key={nameKey} className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <div className="flex gap-2">
                <Input disabled={locked} value={(data as unknown as Record<string, string>)[nameKey]} onChange={e => setData(d => ({ ...d, [nameKey]: e.target.value }))}
                  className="h-7 text-xs flex-1" placeholder="Name" />
                <Input disabled={locked} type="date" value={(data as unknown as Record<string, string>)[dateKey]} onChange={e => setData(d => ({ ...d, [dateKey]: e.target.value }))}
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
