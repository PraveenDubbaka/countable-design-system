import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface ControlRow {
  id: string;
  process: string;
  controlObjective: string;
  controlDescription: string;
  controlType: string;
  frequency: string;
  designAssessment: string;
  implementedYN: string;
  designConclusion: string;
  relyOnControl: string;
  wpRef: string;
}

interface Data540 {
  entityName: string;
  process: string;
  periodEnd: string;
  rows: ControlRow[];
  conclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const CONTROL_TYPE_OPTIONS = ['Preventive', 'Detective', 'Corrective', 'Manual', 'Automated', 'IT-dependent manual'];
const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'Per transaction', 'Ad hoc'];
const DESIGN_OPTIONS = ['Effective', 'Ineffective', 'Partially effective'];
const YN_OPTIONS = ['Yes', 'No'];
const RELY_OPTIONS = ['Yes — plan to test', 'No — substantive only'];

function newRow(): ControlRow {
  return {
    id: Math.random().toString(36).slice(2),
    process: '', controlObjective: '', controlDescription: '', controlType: '',
    frequency: '', designAssessment: '', implementedYN: '', designConclusion: '',
    relyOnControl: '', wpRef: '',
  };
}

function buildDefault(): Data540 {
  return {
    entityName: '', process: '', periodEnd: '',
    rows: [newRow(), newRow(), newRow()],
    conclusion: '',
    preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '',
    concluded: false, concludedOn: '',
  };
}

export function Audit540Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-540-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const [data, setData] = useState<Data540>(() => {
    const saved = readJsonFromLocalStorage<Data540>(storageKey);
    return saved ?? buildDefault();
  });

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  function updateRow(id: string, field: keyof ControlRow, value: string) {
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
          Document relevant controls for the selected process/cycle, evaluate whether they are suitably designed
          to prevent or detect material misstatements, confirm they have been implemented, and determine whether
          to rely on them for audit purposes.
        </p>
      </div>

      {/* Header fields */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Entity Name</label>
            <Input disabled={locked} value={data.entityName} onChange={e => setData(d => ({ ...d, entityName: e.target.value }))}
              className="h-7 text-xs" placeholder="Entity name" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Process / Cycle</label>
            <Input disabled={locked} value={data.process} onChange={e => setData(d => ({ ...d, process: e.target.value }))}
              className="h-7 text-xs" placeholder="e.g. Revenue cycle" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Period End Date</label>
            <Input disabled={locked} type="date" value={data.periodEnd} onChange={e => setData(d => ({ ...d, periodEnd: e.target.value }))}
              className="h-7 text-xs" />
          </div>
        </div>
      </div>

      {/* Control table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Control Design / Implementation Assessment</h3>
          {!locked && (
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={addRow}>
              <Plus className="h-3 w-3" /> Add Control
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className={thCls} style={{ width: 110 }}>Process / Sub-process</th>
                <th className={thCls}>Control Objective</th>
                <th className={thCls}>Control Description</th>
                <th className={thCls} style={{ width: 110 }}>Type</th>
                <th className={thCls} style={{ width: 90 }}>Frequency</th>
                <th className={thCls}>Design Assessment</th>
                <th className={thCls} style={{ width: 80 }}>Implemented?</th>
                <th className={thCls} style={{ width: 110 }}>Design Conclusion</th>
                <th className={thCls} style={{ width: 110 }}>Rely on Control?</th>
                <th className={thCls} style={{ width: 70 }}>WP Ref</th>
                {!locked && <th className={thCls} style={{ width: 32 }}></th>}
              </tr>
            </thead>
            <tbody>
              {data.rows.map(row => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.process} onChange={e => updateRow(row.id, 'process', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Sub-process" />
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.controlObjective} onChange={e => updateRow(row.id, 'controlObjective', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="What the control aims to achieve" />
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.controlDescription} onChange={e => updateRow(row.id, 'controlDescription', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="How the control operates" />
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.controlType} onValueChange={v => updateRow(row.id, 'controlType', v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTROL_TYPE_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.frequency} onValueChange={v => updateRow(row.id, 'frequency', v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCY_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.designAssessment} onChange={e => updateRow(row.id, 'designAssessment', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Auditor's assessment of design" />
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.implementedYN} onValueChange={v => updateRow(row.id, 'implementedYN', v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent">
                        <SelectValue placeholder="Y/N" />
                      </SelectTrigger>
                      <SelectContent>
                        {YN_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.designConclusion} onValueChange={v => updateRow(row.id, 'designConclusion', v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {DESIGN_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.relyOnControl} onValueChange={v => updateRow(row.id, 'relyOnControl', v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELY_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
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
          placeholder="Summarize the overall assessment of control design and implementation for this process/cycle." />
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
