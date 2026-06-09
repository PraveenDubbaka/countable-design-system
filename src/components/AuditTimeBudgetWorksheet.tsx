import { useState } from 'react';
import { Info, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AuditTimeBudgetWorksheetProps {
  isUS?: boolean;
}

interface BudgetRow {
  id: string;
  label: string;
  priorHrs: string;
  priorDollar: string;
  budgetHrs: string;
  budgetDollar: string;
  actualHrs: string;
  actualDollar: string;
}

const makeRow = (id: string, label: string, overrides: Partial<BudgetRow> = {}): BudgetRow => ({
  id, label, priorHrs: '', priorDollar: '', budgetHrs: '', budgetDollar: '', actualHrs: '', actualDollar: '', ...overrides,
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
      makeRow('rr1', 'Planning risk response procedures'),
      makeRow('rr2', 'Overall response and fraud risk'),
      makeRow('rr3', 'Cash and investments'),
      makeRow('rr4', 'Accounts receivable'),
      makeRow('rr5', 'Inventory'),
      makeRow('rr6', 'Inventory observations'),
      makeRow('rr7', 'Long-term investments'),
      makeRow('rr8', 'Property, plant and equipment'),
      makeRow('rr9', 'Intangibles and goodwill'),
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

const NUMERIC_FIELDS: (keyof BudgetRow)[] = ['priorHrs', 'priorDollar', 'budgetHrs', 'budgetDollar', 'actualHrs', 'actualDollar'];
const COL_HEADERS = ['Prior Hrs', 'Prior $', 'Budget Hrs', 'Budget $', 'Actual Hrs', 'Actual $'];

const sumField = (rows: BudgetRow[], field: keyof BudgetRow) => {
  const total = rows.reduce((acc, row) => {
    const v = parseFloat((row[field] as string).replace(/[^0-9.]/g, '')) || 0;
    return acc + v;
  }, 0);
  return total > 0 ? total.toFixed(1) : '';
};

export function AuditTimeBudgetWorksheet({ isUS = false }: AuditTimeBudgetWorksheetProps) {
  const initialSections = (isUS ? US_SECTIONS : CA_SECTIONS).map(s => ({
    ...s,
    rows: s.rows.map(r => ({ ...r })),
  }));
  const [sections, setSections] = useState(initialSections);
  const [priorRate, setPriorRate] = useState('');
  const [budgetRate, setBudgetRate] = useState('');
  const [actualRate, setActualRate] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [preparedDate, setPreparedDate] = useState('');
  const [reviewedBy, setReviewedBy] = useState('');
  const [reviewedDate, setReviewedDate] = useState('');

  const updateCell = (sectionIdx: number, rowIdx: number, field: keyof BudgetRow, value: string) => {
    setSections(prev => prev.map((s, si) => si !== sectionIdx ? s : {
      ...s,
      rows: s.rows.map((r, ri) => ri !== rowIdx ? r : { ...r, [field]: value }),
    }));
  };

  const allRows = sections.flatMap(s => s.rows);
  const grandTotal = (field: keyof BudgetRow) => sumField(allRows, field);

  const standard = isUS ? 'AU-C 300' : 'CAS 300';

  return (
    <div className="flex flex-col h-full">

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Compare estimated time and costs to the prior period and track actuals to complete the audit. ({standard})
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* Average charge-out rate */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Average Charge-Out Rate</span>
              <span title="Enter the average charge-out rate ($/hr) for Prior, Budget, and Actual columns.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-center gap-8">
                {[
                  ['Prior', priorRate, setPriorRate],
                  ['Budget', budgetRate, setBudgetRate],
                  ['Actual', actualRate, setActualRate],
                ].map(([label, value, setter]) => (
                  <div key={label as string} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-muted-foreground">{label as string} ($/hr)</label>
                    <Input
                      className="h-8 text-sm w-28 tabular-nums text-right"
                      placeholder="0.00"
                      value={value as string}
                      onChange={e => (setter as (v: string) => void)(e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Budget sections */}
          {sections.map((section, si) => (
            <div key={section.id} className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
              <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
                <span className="text-sm font-semibold text-foreground">{section.title}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-muted border-b border-border">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Description</th>
                      {COL_HEADERS.map(h => (
                        <th key={h} className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {section.rows.map((row, ri) => (
                      <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-2.5 align-top text-sm text-foreground">{row.label}</td>
                        {NUMERIC_FIELDS.map(field => (
                          <td key={field} className="px-4 py-2.5 align-top w-24">
                            <Input
                              className="h-8 text-sm tabular-nums text-right"
                              placeholder="—"
                              value={row[field] as string}
                              onChange={e => updateCell(si, ri, field, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Subtotal row */}
                    <tr className="bg-muted/30 border-t border-border font-semibold">
                      <td className="px-4 py-2 text-xs font-semibold text-foreground">Subtotal</td>
                      {NUMERIC_FIELDS.map(field => (
                        <td key={field} className="px-4 py-2 text-sm tabular-nums text-foreground text-right">
                          {sumField(section.rows, field) || '—'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Grand Total */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="bg-primary/5 border-b border-border">
                    <td className="px-4 py-3 text-sm font-bold text-foreground">Grand Total</td>
                    {NUMERIC_FIELDS.map(field => (
                      <td key={field} className="px-4 py-3 text-sm font-bold tabular-nums text-foreground text-right w-24">
                        {grandTotal(field) || '—'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sign-off */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Sign-off</span>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Prepared by</label>
                  <Input value={preparedBy} onChange={e => setPreparedBy(e.target.value)} placeholder="Name" className="h-8 text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Date</label>
                  <Input type="date" value={preparedDate} onChange={e => setPreparedDate(e.target.value)} className="h-8 text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Reviewed by</label>
                  <Input value={reviewedBy} onChange={e => setReviewedBy(e.target.value)} placeholder="Name" className="h-8 text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Date</label>
                  <Input type="date" value={reviewedDate} onChange={e => setReviewedDate(e.target.value)} className="h-8 text-sm" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
