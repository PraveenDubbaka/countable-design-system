import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AuditDetailedBudgetWorksheetProps {
  isUS?: boolean;
}

interface StaffRow {
  id: string;
  role: string;
  hours: string;
  rate: string;
}

interface TimeRow {
  id: string;
  task: string;
  hours: string;
}

const makeStaff = (id: string, role: string, hours = '', rate = ''): StaffRow => ({ id, role, hours, rate });
const makeTime = (id: string, task: string, hours = ''): TimeRow => ({ id, task, hours });

const parseNum = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
const fmtAmount = (n: number) => n > 0 ? `$${n.toFixed(2)}` : '—';
const fmtHrs = (n: number) => n > 0 ? `${n.toFixed(1)}` : '—';

export function AuditDetailedBudgetWorksheet({ isUS = false }: AuditDetailedBudgetWorksheetProps) {
  const EQCR = isUS ? 'EQR' : 'EQCR';

  const [fieldRows, setFieldRows] = useState<StaffRow[]>([
    makeStaff('f1', 'Senior'),
    makeStaff('f2', 'Assistant(s)'),
  ]);
  const [specialistRows, setSpecialistRows] = useState<StaffRow[]>([
    makeStaff('sp1', ''),
  ]);
  const initialMgmtRows: StaffRow[] = [
    makeStaff('m1', 'Partner / Practitioner'),
    makeStaff('m2', 'Manager'),
    makeStaff('m3', `Quality control (${EQCR})`),
  ];
  const [mgmtEditable, setMgmtEditable] = useState<StaffRow[]>(initialMgmtRows);
  const [adminRows, setAdminRows] = useState<StaffRow[]>([
    makeStaff('a1', 'Typing, proofreading, checking, printing, photocopying'),
    makeStaff('a2', 'Travel and out-of-pocket expenses'),
    makeStaff('a3', 'Other'),
  ]);
  const [proposedFee, setProposedFee] = useState('');
  const [staffComments, setStaffComments] = useState('');

  const [raRows, setRaRows] = useState<TimeRow[]>([
    makeTime('ra1', 'Pre-engagement'),
    makeTime('ra2', 'Risk assessment procedures'),
  ]);
  const [rrRows, setRrRows] = useState<TimeRow[]>([
    makeTime('rr1', 'Overall responses'),
    makeTime('rr2', 'Detailed audit plans'),
    makeTime('rr3', 'Client meetings'),
    makeTime('rr4', 'Pre-period end procedures (inventory observation, confirmations, etc.)'),
    makeTime('rr5', 'Cash and short-term investments'),
    makeTime('rr6', 'Accounts receivable'),
    makeTime('rr7', 'Inventory'),
    makeTime('rr8', 'Long-term investments'),
    makeTime('rr9', 'Property, plant and equipment'),
    makeTime('rr10', 'Intangibles and goodwill'),
    makeTime('rr11', 'Bank indebtedness and notes payable'),
    makeTime('rr12', 'Accounts payable and accrued liabilities'),
    makeTime('rr13', 'Income taxes — current and future'),
    makeTime('rr14', 'Deferred income'),
    makeTime('rr15', 'Long-term debt'),
    makeTime('rr16', 'Contingent liabilities and subsequent events review'),
    makeTime('rr17', 'Equity'),
    makeTime('rr18', 'Related parties'),
    makeTime('rr19', 'Journal entries'),
    makeTime('rr20', 'Sales'),
    makeTime('rr21', 'Cost of sales'),
    makeTime('rr22', 'Payroll and other expenses'),
  ]);
  const [repRows, setRepRows] = useState<TimeRow[]>([
    makeTime('rep1', 'Supervision'),
    makeTime('rep2', 'Detailed review'),
    makeTime('rep3', 'General review'),
    makeTime('rep4', 'Review of financial statements'),
    makeTime('rep5', `Engagement quality control review (${EQCR})`),
    makeTime('rep6', 'Client meetings'),
    makeTime('rep7', 'Communications with management / those charged with governance'),
    makeTime('rep8', 'Secretarial'),
    makeTime('rep9', 'Disbursements'),
  ]);
  const [timeComments, setTimeComments] = useState('');

  // ---- Calculations ----
  const calcAmount = (row: StaffRow) => {
    const h = parseNum(row.hours);
    const r = parseNum(row.rate);
    return h * r;
  };
  const subtotalAmount = (rows: StaffRow[]) => rows.reduce((a, r) => a + calcAmount(r), 0);
  const subtotalHours = (rows: TimeRow[]) => rows.reduce((a, r) => a + parseNum(r.hours), 0);

  const totalStaffAmount = subtotalAmount(fieldRows) + subtotalAmount(specialistRows) +
    subtotalAmount(mgmtEditable) + subtotalAmount(adminRows);
  const variance = totalStaffAmount - parseNum(proposedFee);

  const totalTimeHours = subtotalHours(raRows) + subtotalHours(rrRows) + subtotalHours(repRows);

  // ---- Helpers ----
  const updateStaff = (setter: React.Dispatch<React.SetStateAction<StaffRow[]>>, idx: number, field: keyof StaffRow, val: string) =>
    setter(prev => prev.map((r, i) => i !== idx ? r : { ...r, [field]: val }));
  const updateTime = (setter: React.Dispatch<React.SetStateAction<TimeRow[]>>, idx: number, val: string) =>
    setter(prev => prev.map((r, i) => i !== idx ? r : { ...r, hours: val }));
  const addStaff = (setter: React.Dispatch<React.SetStateAction<StaffRow[]>>) =>
    setter(prev => [...prev, makeStaff(`new-${Date.now()}`, '')]);
  const removeStaff = (setter: React.Dispatch<React.SetStateAction<StaffRow[]>>, id: string) =>
    setter(prev => prev.filter(r => r.id !== id));

  const inp = "w-full bg-transparent text-xs px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary/30 rounded";
  const inpR = inp + " text-right";

  const StaffSection = ({
    title, rows, setter, editable = true, showAdd = true, showRemove = true
  }: {
    title: string; rows: StaffRow[];
    setter?: React.Dispatch<React.SetStateAction<StaffRow[]>>;
    editable?: boolean; showAdd?: boolean; showRemove?: boolean;
  }) => (
    <div className="mb-2">
      <div className="px-4 py-1.5 bg-muted/40 border-y border-border">
        <span className="text-xs font-semibold text-foreground">{title}</span>
      </div>
      {rows.map((row, i) => (
        <div key={row.id} className="flex items-center border-b border-border/50 hover:bg-muted/10">
          <div className="flex-1 px-3 py-1">
            {editable && setter ? (
              <input className={inp} placeholder="Role" value={row.role} onChange={e => updateStaff(setter, i, 'role', e.target.value)} />
            ) : (
              <span className="text-xs">{row.role}</span>
            )}
          </div>
          <div className="w-24 px-3 py-1 border-l border-border/50">
            {setter ? <input className={inpR} placeholder="0.0" value={row.hours} onChange={e => updateStaff(setter, i, 'hours', e.target.value)} /> : <span className="text-xs text-right block">{row.hours}</span>}
          </div>
          <div className="w-24 px-3 py-1 border-l border-border/50">
            {setter ? <input className={inpR} placeholder="0.00" value={row.rate} onChange={e => updateStaff(setter, i, 'rate', e.target.value)} /> : <span className="text-xs text-right block">{row.rate}</span>}
          </div>
          <div className="w-28 px-3 py-1 border-l border-border/50 text-xs text-right text-muted-foreground">
            {fmtAmount(calcAmount(row))}
          </div>
          {showRemove && setter && (
            <button onClick={() => removeStaff(setter, row.id)} className="px-2 text-muted-foreground hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
      {showAdd && setter && (
        <button onClick={() => addStaff(setter)} className="flex items-center gap-1 text-xs text-primary px-4 py-1.5 hover:bg-primary/5">
          <Plus className="h-3 w-3" /> Add row
        </button>
      )}
      <div className="flex items-center bg-muted/20 border-t border-border">
        <div className="flex-1 px-4 py-1 text-xs font-semibold">Subtotal</div>
        <div className="w-24 px-3 py-1 text-xs text-right border-l border-border/50 font-semibold">{fmtHrs(rows.reduce((a, r) => a + parseNum(r.hours), 0)) || '—'}</div>
        <div className="w-24 px-3 py-1 border-l border-border/50" />
        <div className="w-28 px-3 py-1 text-xs text-right border-l border-border/50 font-semibold">{fmtAmount(subtotalAmount(rows)) || '—'}</div>
        {showRemove && <div className="w-8" />}
      </div>
    </div>
  );

  const TimeSection = ({
    title, rows, setter, showAdd = false
  }: {
    title: string; rows: TimeRow[];
    setter: React.Dispatch<React.SetStateAction<TimeRow[]>>;
    showAdd?: boolean;
  }) => (
    <div className="mb-2">
      <div className="px-4 py-1.5 bg-muted/40 border-y border-border">
        <span className="text-xs font-semibold text-foreground">{title}</span>
      </div>
      {rows.map((row, i) => (
        <div key={row.id} className="flex items-center border-b border-border/50 hover:bg-muted/10">
          <div className="flex-1 px-4 py-1 text-xs">{row.task}</div>
          <div className="w-24 px-3 py-1 border-l border-border/50">
            <input className={inpR} placeholder="0.0" value={row.hours} onChange={e => updateTime(setter, i, e.target.value)} />
          </div>
        </div>
      ))}
      {showAdd && (
        <button onClick={() => setter(prev => [...prev, makeTime(`new-${Date.now()}`, '')])} className="flex items-center gap-1 text-xs text-primary px-4 py-1.5 hover:bg-primary/5">
          <Plus className="h-3 w-3" /> Add row
        </button>
      )}
      <div className="flex items-center bg-muted/20 border-t border-border">
        <div className="flex-1 px-4 py-1 text-xs font-semibold">Subtotal</div>
        <div className="w-24 px-3 py-1 text-xs text-right border-l border-border/50 font-semibold">
          {fmtHrs(subtotalHours(rows)) || '—'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h2 className="text-base font-semibold">Worksheet — Detailed Budget (Form 451)</h2>
        <p className="text-xs text-muted-foreground mt-1">Objective: To document the detailed staff resources and time budget for the engagement.</p>
      </div>

      {/* Staff Resources */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center justify-between">
          <span className="text-sm font-semibold">Staff Resources</span>
        </div>
        {/* Column headers */}
        <div className="flex items-center bg-muted/10 border-b border-border">
          <div className="flex-1 px-4 py-2 text-xs font-semibold text-muted-foreground">Role</div>
          <div className="w-24 px-3 py-2 text-xs font-semibold text-muted-foreground text-right border-l border-border/50">Hours</div>
          <div className="w-24 px-3 py-2 text-xs font-semibold text-muted-foreground text-right border-l border-border/50">Rate ($/hr)</div>
          <div className="w-28 px-3 py-2 text-xs font-semibold text-muted-foreground text-right border-l border-border/50">Amount</div>
        </div>
        <StaffSection title="Audit team (field work)" rows={fieldRows} setter={setFieldRows} editable={false} />
        <StaffSection title="Specialists (specify role)" rows={specialistRows} setter={setSpecialistRows} />
        <StaffSection title="Audit management" rows={mgmtEditable} setter={setMgmtEditable} editable={false} showAdd={false} showRemove={false} />
        <StaffSection title="Administration" rows={adminRows} setter={setAdminRows} editable={false} showAdd={false} showRemove={false} />

        {/* Totals */}
        <div className="border-t-2 border-primary/20">
          <div className="flex items-center">
            <div className="flex-1 px-4 py-2 text-sm font-bold">Total</div>
            <div className="w-24 border-l border-border/50" />
            <div className="w-24 border-l border-border/50" />
            <div className="w-28 px-3 py-2 text-sm font-bold text-right border-l border-border/50">{fmtAmount(totalStaffAmount)}</div>
          </div>
          <div className="flex items-center border-t border-border/50">
            <div className="flex-1 px-4 py-1 text-xs font-medium">Proposed fee</div>
            <div className="w-24 border-l border-border/50" />
            <div className="w-24 border-l border-border/50" />
            <div className="w-28 px-3 py-1 border-l border-border/50">
              <input className={inpR} placeholder="0.00" value={proposedFee} onChange={e => setProposedFee(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center border-t border-border/50 bg-muted/10">
            <div className="flex-1 px-4 py-1 text-xs font-medium">Variance</div>
            <div className="w-24 border-l border-border/50" />
            <div className="w-24 border-l border-border/50" />
            <div className={`w-28 px-3 py-1 text-xs text-right font-semibold border-l border-border/50 ${variance > 0 ? 'text-emerald-600' : variance < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {proposedFee ? fmtAmount(variance) : '—'}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border/50">
          <label className="text-xs text-muted-foreground block mb-1">Comments and explanations for variances</label>
          <textarea
            className="w-full border border-border rounded px-3 py-2 text-xs resize-none"
            rows={3}
            value={staffComments}
            onChange={e => setStaffComments(e.target.value)}
            placeholder="Enter comments..."
          />
        </div>
      </div>

      {/* Detailed Time Budget */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center justify-between">
          <span className="text-sm font-semibold">Detailed Time Budget</span>
        </div>
        <div className="flex items-center bg-muted/10 border-b border-border">
          <div className="flex-1 px-4 py-2 text-xs font-semibold text-muted-foreground">Task</div>
          <div className="w-24 px-3 py-2 text-xs font-semibold text-muted-foreground text-right border-l border-border/50">Hours</div>
        </div>
        <TimeSection title="Risk Assessment" rows={raRows} setter={setRaRows} />
        <TimeSection title="Response to Assessed Risks" rows={rrRows} setter={setRrRows} showAdd />
        <TimeSection title="Reporting" rows={repRows} setter={setRepRows} />

        {/* Grand total */}
        <div className="flex items-center border-t-2 border-primary/20 bg-primary/5">
          <div className="flex-1 px-4 py-2 text-sm font-bold">Total budget</div>
          <div className="w-24 px-3 py-2 text-sm font-bold text-right border-l border-border/50">
            {fmtHrs(totalTimeHours) || '—'}
          </div>
        </div>

        <div className="p-4 border-t border-border/50">
          <label className="text-xs text-muted-foreground block mb-1">Comments (over/under budget reasons)</label>
          <textarea
            className="w-full border border-border rounded px-3 py-2 text-xs resize-none"
            rows={3}
            value={timeComments}
            onChange={e => setTimeComments(e.target.value)}
            placeholder="Enter comments..."
          />
        </div>
      </div>
    </div>
  );
}
