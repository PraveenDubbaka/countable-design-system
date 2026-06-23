import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTimeEntries, ROLE_TO_TB_ROW, type RoleKey } from '@/lib/useTimeEntries';

interface BudgetRow {
  id: string;
  label: string;
  priorHrs: string;
  priorDollar: string;
  budgetHrs: string;
  budgetDollar: string;
}

const makeRow = (id: string, label: string, overrides: Partial<BudgetRow> = {}): BudgetRow => ({
  id, label, priorHrs: '', priorDollar: '', budgetHrs: '', budgetDollar: '', ...overrides,
});

const CA_SECTIONS = [
  {
    id: 'general', title: 'General',
    rows: [
      makeRow('g1', 'Overall strategy and planning'),
      makeRow('g2', 'Supervision and review'),
      makeRow('g3', 'Audit team communication'),
      makeRow('g4', 'Client meetings'),
      makeRow('g5', 'Financial statement reports and communications'),
      makeRow('g6', 'Administration'),
      makeRow('g7', 'Travel and out of pocket'),
    ]
  },
  {
    id: 'risk-assess', title: 'Risk Assessment',
    rows: [
      makeRow('ra1', 'Financial statement analysis'),
      makeRow('ra2', 'Planning risk assessment procedures'),
      makeRow('ra3', 'Performing risk assessment procedures'),
      makeRow('ra4', 'Assessing results'),
    ]
  },
  {
    id: 'risk-resp', title: 'Risk Response',
    rows: [
      makeRow('rr1',  'Planning risk response procedures'),
      makeRow('rr2',  'Overall response and fraud risk'),
      makeRow('rr3',  'Cash and investments'),
      makeRow('rr4',  'Accounts receivable'),
      makeRow('rr5',  'Inventory'),
      makeRow('rr6',  'Inventory observations'),
      makeRow('rr7',  'Long-term investments'),
      makeRow('rr8',  'Property, plant and equipment'),
      makeRow('rr9',  'Intangibles and goodwill'),
      makeRow('rr10', 'Bank debt and notes payable'),
      makeRow('rr11', 'Accounts payable and accruals'),
      makeRow('rr12', 'Income taxes'),
      makeRow('rr13', 'Contingencies / subsequent events'),
      makeRow('rr14', 'Share capital and retained earnings'),
      makeRow('rr15', 'Related parties'),
      makeRow('rr16', 'Sales'),
      makeRow('rr17', 'Cost of sales'),
      makeRow('rr18', 'Payroll'),
      makeRow('rr19', 'Operating expenses'),
      makeRow('rr20', 'Other (specify)'),
    ]
  },
  {
    id: 'team', title: 'Budget by Team Member',
    rows: [
      makeRow('t1', 'Senior(s)'),
      makeRow('t2', 'Assistant(s)'),
      makeRow('t3', 'Manager / Supervisor'),
      makeRow('t4', 'Partner'),
      makeRow('t5', 'Tax review'),
      makeRow('t6', 'EQCR / EQR'),
      makeRow('t7', 'Other'),
    ]
  },
];

const US_SECTIONS = CA_SECTIONS.map(s => ({
  ...s,
  rows: s.rows.map(r => ({ ...r, label: r.label.replace('EQCR', 'EQR') })),
}));

const EDITABLE_FIELDS: (keyof BudgetRow)[] = ['priorHrs', 'priorDollar', 'budgetHrs', 'budgetDollar'];
const COL_HEADERS = ['Prior Hrs', 'Prior $', 'Budget Hrs', 'Budget $', 'Actual Hrs', 'Actual $'];

const parseNum = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
const sumField = (rows: BudgetRow[], field: keyof BudgetRow) => {
  const t = rows.reduce((a, r) => a + parseNum(r[field] as string), 0);
  return t > 0 ? t.toFixed(1) : '';
};
const fmtNum = (n: number) => n > 0 ? n.toFixed(1) : '';

// Role keys that map to each "Budget by Team Member" row
const TB_ROW_TO_ROLES: Record<string, RoleKey[]> = Object.entries(ROLE_TO_TB_ROW).reduce(
  (acc, [role, rowId]) => {
    if (!acc[rowId]) acc[rowId] = [];
    acc[rowId].push(role as RoleKey);
    return acc;
  },
  {} as Record<string, RoleKey[]>
);

export function AuditTimeBudgetWorksheet({ isUS = false }: { isUS?: boolean }) {
  const { engagementId = 'default' } = useParams<{ engagementId: string }>();
  const { hrsForRow, hrsForRole, hrsForSection } = useTimeEntries(engagementId);

  const initialSections = (isUS ? US_SECTIONS : CA_SECTIONS).map(s => ({
    ...s, rows: s.rows.map(r => ({ ...r })),
  }));
  const [sections, setSections] = useState(initialSections);
  const [priorRate,   setPriorRate]   = useState('');
  const [budgetRate,  setBudgetRate]  = useState('');
  const [actualRate,  setActualRate]  = useState('');
  const [conclusion,  setConclusion]  = useState('');
  const [concluded,   setConcluded]   = useState(false);

  const updateCell = (si: number, ri: number, field: keyof BudgetRow, value: string) =>
    setSections(prev => prev.map((s, i) => i !== si ? s : {
      ...s, rows: s.rows.map((r, j) => j !== ri ? r : { ...r, [field]: value }),
    }));

  // Compute actual hrs for a row (task rows use tbRowId; team rows aggregate by role)
  const getActualHrs = (sectionId: string, rowId: string): number => {
    if (sectionId === 'team') {
      const roles = TB_ROW_TO_ROLES[rowId] ?? [];
      return roles.reduce((a, role) => a + hrsForRole(role), 0);
    }
    return hrsForRow(rowId);
  };

  const getActualDollar = (sectionId: string, rowId: string): number => {
    const rate = parseNum(actualRate);
    return rate > 0 ? getActualHrs(sectionId, rowId) * rate : 0;
  };

  const allRows = sections.flatMap(s => s.rows);
  const grandBudgetHrs = () => sumField(allRows, 'budgetHrs');
  const grandPriorHrs  = () => sumField(allRows, 'priorHrs');
  const grandActualHrs = () => {
    const t = sections.reduce((a, s) => a + s.rows.reduce((b, r) => b + getActualHrs(s.id, r.id), 0), 0);
    return t > 0 ? t.toFixed(1) : '';
  };
  const grandActualDollar = () => {
    const t = sections.reduce((a, s) => a + s.rows.reduce((b, r) => b + getActualDollar(s.id, r.id), 0), 0);
    return t > 0 ? t.toFixed(1) : '';
  };

  const standard = isUS ? 'AU-C 300' : 'CAS 300';

  return (
    <div className="flex flex-col h-full">

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Compare estimated time and costs to the prior period and track actuals to complete the audit. ({standard})
          {' '}<span className="text-primary font-medium">Actual columns update automatically from the Time Tracker.</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* Average charge-out rate */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Average Charge-Out Rate</span>
              <span title="Enter the average charge-out rate ($/hr). Actual $ is computed from tracker hours × Actual rate.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center gap-8">
                {([['Prior', priorRate, setPriorRate], ['Budget', budgetRate, setBudgetRate], ['Actual', actualRate, setActualRate]] as const).map(([label, value, setter]) => (
                  <div key={label as string} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">{label as string} ($/hr)</label>
                    <Input className="h-8 text-sm w-28 tabular-nums text-right" placeholder="0.00"
                      value={value as string} onChange={e => (setter as (v: string) => void)(e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Budget sections */}
          {sections.map((section, si) => {
            const sectionActualHrs = section.rows.reduce((a, r) => a + getActualHrs(section.id, r.id), 0);
            const sectionBudgetHrs = parseNum(sumField(section.rows, 'budgetHrs'));
            const pct = sectionBudgetHrs > 0 ? Math.min((sectionActualHrs / sectionBudgetHrs) * 100, 100) : 0;
            const over = sectionBudgetHrs > 0 && sectionActualHrs > sectionBudgetHrs;
            const warn = sectionBudgetHrs > 0 && sectionActualHrs / sectionBudgetHrs > 0.8 && !over;
            const barColor = over ? 'bg-destructive' : warn ? 'bg-amber-400' : 'bg-primary';
            const statusBadge = over
              ? <span className="text-xs font-semibold text-destructive">{(sectionActualHrs - sectionBudgetHrs).toFixed(1)}h over budget</span>
              : warn
              ? <span className="text-xs font-semibold text-amber-600">{Math.round(pct)}% of budget used</span>
              : sectionBudgetHrs > 0
              ? <span className="text-xs text-muted-foreground">{Math.round(pct)}% of budget used</span>
              : null;

            return (
              <div key={section.id} className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
                <div className="px-6 py-3.5 bg-card border-b border-border flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">{section.title}</span>
                  {sectionActualHrs > 0 && (
                    <div className="flex items-center gap-3 flex-1 max-w-xs">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                      {statusBadge}
                    </div>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-muted border-b border-border">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Description</th>
                        {COL_HEADERS.map((h, hi) => (
                          <th key={h} className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${hi >= 4 ? 'text-primary' : 'text-foreground'}`}>
                            {h}{hi >= 4 && <span className="ml-1 text-[10px] font-normal opacity-60">auto</span>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {section.rows.map((row, ri) => {
                        const actualHrs = getActualHrs(section.id, row.id);
                        const actualDollar = getActualDollar(section.id, row.id);
                        return (
                          <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                            <td className="px-4 py-2.5 align-top text-sm text-foreground">{row.label}</td>
                            {EDITABLE_FIELDS.map(field => (
                              <td key={field} className="px-4 py-2.5 align-top w-24">
                                <Input className="h-8 text-sm tabular-nums text-right" placeholder="—"
                                  value={row[field] as string}
                                  onChange={e => updateCell(si, ri, field, e.target.value)} />
                              </td>
                            ))}
                            {/* Actual Hrs — from tracker */}
                            <td className="px-4 py-2.5 align-top w-24">
                              <div className={`h-8 flex items-center justify-end px-3 text-sm tabular-nums font-medium rounded-[10px] ${actualHrs > 0 ? 'bg-primary/5 text-primary' : 'text-muted-foreground'}`}>
                                {fmtNum(actualHrs) || '—'}
                              </div>
                            </td>
                            {/* Actual $ — from tracker × rate */}
                            <td className="px-4 py-2.5 align-top w-24">
                              <div className={`h-8 flex items-center justify-end px-3 text-sm tabular-nums font-medium rounded-[10px] ${actualDollar > 0 ? 'bg-primary/5 text-primary' : 'text-muted-foreground'}`}>
                                {actualDollar > 0 ? actualDollar.toFixed(0) : '—'}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {/* Subtotal */}
                      <tr className="bg-muted/30 border-t border-border font-semibold">
                        <td className="px-4 py-2 text-xs font-semibold text-foreground">Subtotal</td>
                        {EDITABLE_FIELDS.map(field => (
                          <td key={field} className="px-4 py-2 text-sm tabular-nums text-foreground text-right">
                            {sumField(section.rows, field) || '—'}
                          </td>
                        ))}
                        <td className="px-4 py-2 text-sm tabular-nums text-right font-semibold text-primary">
                          {fmtNum(sectionActualHrs) || '—'}
                        </td>
                        <td className="px-4 py-2 text-sm tabular-nums text-right font-semibold text-primary">
                          {sectionActualHrs > 0 && parseNum(actualRate) > 0
                            ? (sectionActualHrs * parseNum(actualRate)).toFixed(0)
                            : '—'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Grand Total */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="bg-primary/5 border-b border-border">
                    <td className="px-4 py-3 text-sm font-bold text-foreground">Grand Total</td>
                    <td className="px-4 py-3 text-sm font-bold tabular-nums text-foreground text-right w-24">{grandPriorHrs() || '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold tabular-nums text-foreground text-right w-24">{sumField(allRows, 'priorDollar') || '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold tabular-nums text-foreground text-right w-24">{grandBudgetHrs() || '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold tabular-nums text-foreground text-right w-24">{sumField(allRows, 'budgetDollar') || '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary text-right w-24">{grandActualHrs() || '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold tabular-nums text-primary text-right w-24">{grandActualDollar() || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 border-b border-border">
              <span className="text-sm font-semibold text-foreground">Conclusion</span>
            </div>
            <div className="px-6 py-5">
              <Textarea value={conclusion} onChange={e => setConclusion(e.target.value)}
                placeholder="Document any conclusions or variances noted in the time budget…"
                className="min-h-[72px] text-sm resize-none bg-background" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => { setConcluded(true); toast.success('Time budget worksheet concluded'); }} disabled={concluded}>
              {concluded ? 'Worksheet concluded' : 'Conclude worksheet'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
