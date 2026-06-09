import React, { useState } from 'react';

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
  id, label, priorHrs: '', priorDollar: '', budgetHrs: '', budgetDollar: '', actualHrs: '', actualDollar: '', ...overrides
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
  }
];

// For US, same rows but EQCR → EQR
const US_SECTIONS = CA_SECTIONS.map(s => ({
  ...s,
  rows: s.rows.map(r => ({ ...r, label: r.label.replace('EQCR', 'EQR') }))
}));

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
    rows: s.rows.map(r => ({ ...r }))
  }));
  const [sections, setSections] = useState(initialSections);
  const [chargeOutRate, setChargeOutRate] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [preparedDate, setPreparedDate] = useState('');
  const [reviewedBy, setReviewedBy] = useState('');
  const [reviewedDate, setReviewedDate] = useState('');

  const updateCell = (sectionIdx: number, rowIdx: number, field: keyof BudgetRow, value: string) => {
    setSections(prev => prev.map((s, si) => si !== sectionIdx ? s : {
      ...s,
      rows: s.rows.map((r, ri) => ri !== rowIdx ? r : { ...r, [field]: value })
    }));
  };

  const allRows = sections.flatMap(s => s.rows);
  const grandTotal = (field: keyof BudgetRow) => sumField(allRows, field);

  const inputCls = "w-full bg-transparent text-right text-xs px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary/30 rounded";
  const thCls = "px-2 py-2 text-xs font-semibold text-muted-foreground text-right border-b border-border";
  const tdCls = "px-1 py-0.5 border-b border-border/50";
  const totalCls = "px-2 py-1 text-xs font-semibold text-right border-t-2 border-primary/20";

  const standard = isUS ? 'AU-C 300' : 'CAS 300';

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-2">
        <h2 className="text-base font-semibold">Worksheet — Time Budget (Form 450)</h2>
        <p className="text-xs text-muted-foreground">Objective: To compare estimated time and costs to the prior period and actual to complete the audit. ({standard})</p>
      </div>

      {/* Average charge-out rate */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium w-48">Average charge-out rate</span>
          <div className="flex gap-6">
            {['Prior', 'Budget', 'Actual'].map(col => (
              <div key={col} className="flex flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{col}</span>
                <input
                  className="w-24 border border-border rounded px-2 py-1 text-xs text-right"
                  placeholder="0.00"
                  value={chargeOutRate}
                  onChange={e => setChargeOutRate(e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      {sections.map((section, si) => (
        <div key={section.id} className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2 bg-muted/30 border-b border-border">
            <span className="text-sm font-semibold">{section.title}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/20">
                  <th className="px-4 py-2 text-xs font-semibold text-left border-b border-border">Description</th>
                  <th className={thCls}>Prior Hrs</th>
                  <th className={thCls}>Prior $</th>
                  <th className={thCls}>Budget Hrs</th>
                  <th className={thCls}>Budget $</th>
                  <th className={thCls}>Actual Hrs</th>
                  <th className={thCls}>Actual $</th>
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, ri) => (
                  <tr key={row.id} className="hover:bg-muted/10">
                    <td className="px-4 py-1 text-sm border-b border-border/50">{row.label}</td>
                    {(['priorHrs', 'priorDollar', 'budgetHrs', 'budgetDollar', 'actualHrs', 'actualDollar'] as (keyof BudgetRow)[]).map(field => (
                      <td key={field} className={tdCls}>
                        <input
                          className={inputCls}
                          placeholder="—"
                          value={row[field] as string}
                          onChange={e => updateCell(si, ri, field, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Section total */}
                <tr className="bg-muted/20">
                  <td className="px-4 py-1 text-xs font-semibold border-t border-border">Subtotal</td>
                  {(['priorHrs', 'priorDollar', 'budgetHrs', 'budgetDollar', 'actualHrs', 'actualDollar'] as (keyof BudgetRow)[]).map(field => (
                    <td key={field} className={totalCls}>{sumField(section.rows, field) || '—'}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Grand Total */}
      <div className="bg-card rounded-lg border border-primary/20 overflow-hidden">
        <table className="w-full text-xs">
          <tbody>
            <tr className="bg-primary/5">
              <td className="px-4 py-2 text-sm font-bold">Total</td>
              {(['priorHrs', 'priorDollar', 'budgetHrs', 'budgetDollar', 'actualHrs', 'actualDollar'] as (keyof BudgetRow)[]).map(field => (
                <td key={field} className="px-2 py-2 text-sm font-bold text-right border-l border-border/50">
                  {grandTotal(field) || '—'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sign-off */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="grid grid-cols-2 gap-4">
          {([
            ['Prepared by', preparedBy, setPreparedBy],
            ['Date', preparedDate, setPreparedDate],
            ['Reviewed by', reviewedBy, setReviewedBy],
            ['Date', reviewedDate, setReviewedDate],
          ] as [string, string, React.Dispatch<React.SetStateAction<string>>][]).map(([label, value, setter]) => (
            <div key={label} className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">{label}</label>
              <input
                className="border border-border rounded px-2 py-1 text-sm"
                value={value}
                onChange={e => setter(e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
