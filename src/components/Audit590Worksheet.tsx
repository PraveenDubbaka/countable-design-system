import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

interface ScopeRow {
  id: string;
  class: string;
  accountBalance: string;
  assertions: string;
  riskLevel: string;
  inScope: string;
  scopeJustification: string;
  approach: string;
  materiality: string;
  wpRef: string;
}

interface Data590 {
  entityName: string; periodEnd: string; auditFramework: string;
  overallMateriality: string; performanceMateriality: string;
  rows: ScopeRow[];
  conclusion: string;
  preparedBy: string; preparedDate: string;
  reviewedBy: string; reviewedDate: string;
  concluded: boolean; concludedOn: string;
}

const RISK_OPTIONS = ['High', 'Moderate', 'Low', 'Significant'];
const SCOPE_OPTIONS = ['In scope', 'Out of scope', 'Limited scope'];
const APPROACH_OPTIONS = [
  'Substantive — Test of details',
  'Substantive — Analytical procedures',
  'Combined — Controls + substantive',
  'Controls reliance only',
  'Inquiry only',
];

const ASSERTION_OPTIONS = [
  'Existence/Occurrence', 'Completeness', 'Rights & Obligations',
  'Accuracy/Valuation', 'Cut-off', 'Classification', 'Presentation & Disclosure',
];

function newRow(): ScopeRow {
  return {
    id: Math.random().toString(36).slice(2),
    class: '', accountBalance: '', assertions: '', riskLevel: '',
    inScope: '', scopeJustification: '', approach: '', materiality: '', wpRef: '',
  };
}

const DEFAULT_CLASSES = [
  'Revenue', 'Cost of Sales', 'Operating Expenses', 'Payroll & Benefits',
  'Cash & Bank', 'Accounts Receivable', 'Inventory', 'Property, Plant & Equipment',
  'Accounts Payable', 'Debt & Financing', 'Equity',
];

function buildDefault(): Data590 {
  return {
    entityName: '', periodEnd: '', auditFramework: 'ASPE',
    overallMateriality: '', performanceMateriality: '',
    rows: DEFAULT_CLASSES.map(c => ({ ...newRow(), class: c })),
    conclusion: '',
    preparedBy: '', preparedDate: '', reviewedBy: '', reviewedDate: '',
    concluded: false, concludedOn: '',
  };
}

export function Audit590Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const storageKey = `audit-590-data-${engagementId ?? 'default'}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const [data, setData] = useState<Data590>(() => {
    const saved = readJsonFromLocalStorage<Data590>(storageKey);
    return saved ?? buildDefault();
  });

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  function updateRow(id: string, field: keyof ScopeRow, value: string) {
    setData(d => ({ ...d, rows: d.rows.map(r => r.id === id ? { ...r, [field]: value } : r) }));
  }
  function addRow() { setData(d => ({ ...d, rows: [...d.rows, newRow()] })); }
  function removeRow(id: string) { setData(d => ({ ...d, rows: d.rows.filter(r => r.id !== id) })); }

  const tdCls = "border border-border px-2 py-1.5 text-xs align-top";
  const thCls = "border border-border bg-muted px-2 py-1.5 text-xs font-medium text-left align-middle whitespace-nowrap";

  const riskColor = (v: string) => v === 'High' || v === 'Significant' ? 'text-red-600' : v === 'Moderate' ? 'text-amber-600' : v === 'Low' ? 'text-green-600' : '';
  const scopeColor = (v: string) => v === 'Out of scope' ? 'text-muted-foreground' : v === 'Limited scope' ? 'text-amber-600' : '';

  return (
    <div className="p-4 space-y-4 text-sm">
      {/* Objective */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objective</p>
        <p className="text-sm text-foreground">
          Define the scope of the audit by identifying significant classes of transactions, account balances,
          and disclosure components. For each, specify the relevant assertions, assess risk, determine whether
          it falls within scope, and document the planned audit approach.
        </p>
      </div>

      {/* Header fields */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <div className="grid grid-cols-3 gap-3 mb-3">
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
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Financial Reporting Framework</label>
            <Select disabled={locked} value={data.auditFramework} onValueChange={v => setData(d => ({ ...d, auditFramework: v }))}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['ASPE', 'IFRS', 'GAAP (US)', 'ASNPO', 'PSAS'].map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Overall Materiality ($)</label>
            <Input disabled={locked} value={data.overallMateriality} onChange={e => setData(d => ({ ...d, overallMateriality: e.target.value }))}
              className="h-7 text-xs" placeholder="e.g. 125,000" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Performance Materiality ($)</label>
            <Input disabled={locked} value={data.performanceMateriality} onChange={e => setData(d => ({ ...d, performanceMateriality: e.target.value }))}
              className="h-7 text-xs" placeholder="e.g. 87,500" />
          </div>
        </div>
      </div>

      {/* Scoping table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Classes of Transactions, Account Balances and Disclosures</h3>
          {!locked && (
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={addRow}>
              <Plus className="h-3 w-3" /> Add Item
            </Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className={thCls} style={{ width: 130 }}>Class / Area</th>
                <th className={thCls} style={{ width: 110 }}>Account / Balance</th>
                <th className={thCls}>Relevant Assertions</th>
                <th className={thCls} style={{ width: 90 }}>Risk Level</th>
                <th className={thCls} style={{ width: 110 }}>In Scope?</th>
                <th className={thCls}>Scope Justification</th>
                <th className={thCls}>Audit Approach</th>
                <th className={thCls} style={{ width: 90 }}>Materiality ($)</th>
                <th className={thCls} style={{ width: 70 }}>WP Ref</th>
                {!locked && <th className={thCls} style={{ width: 32 }}></th>}
              </tr>
            </thead>
            <tbody>
              {data.rows.map(row => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  <td className={tdCls}>
                    <Input disabled={locked} value={row.class} onChange={e => updateRow(row.id, 'class', e.target.value)}
                      className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent font-medium" placeholder="Class" />
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.accountBalance} onChange={e => updateRow(row.id, 'accountBalance', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Account names" />
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.assertions} onValueChange={v => updateRow(row.id, 'assertions', v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSERTION_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                        <SelectItem value="Multiple" className="text-xs">Multiple (see notes)</SelectItem>
                      </SelectContent>
                    </Select>
                    {row.assertions === 'Multiple (see notes)' && (
                      <Textarea disabled={locked} value={row.assertions} onChange={e => updateRow(row.id, 'assertions', e.target.value)}
                        className="mt-1 min-h-[40px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" />
                    )}
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.riskLevel} onValueChange={v => updateRow(row.id, 'riskLevel', v)}>
                      <SelectTrigger className={`h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent ${riskColor(row.riskLevel)}`}>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {RISK_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.inScope} onValueChange={v => updateRow(row.id, 'inScope', v)}>
                      <SelectTrigger className={`h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent ${scopeColor(row.inScope)}`}>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {SCOPE_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Textarea disabled={locked} value={row.scopeJustification} onChange={e => updateRow(row.id, 'scopeJustification', e.target.value)}
                      className="min-h-[56px] text-xs resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent"
                      placeholder="Justification for scope decision" />
                  </td>
                  <td className={tdCls}>
                    <Select disabled={locked} value={row.approach} onValueChange={v => updateRow(row.id, 'approach', v)}>
                      <SelectTrigger className="h-7 text-xs border-0 shadow-none focus:ring-0 px-0 bg-transparent">
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {APPROACH_OPTIONS.map(o => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className={tdCls}>
                    <Input disabled={locked} value={row.materiality} onChange={e => updateRow(row.id, 'materiality', e.target.value)}
                      className="h-7 text-xs border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent" placeholder="$ amount" />
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
          placeholder="Summarize the engagement scope, confirming the significant classes of transactions and account balances in scope, and the overall audit approach." />
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
