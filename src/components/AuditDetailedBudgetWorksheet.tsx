import { Dispatch, SetStateAction, useState } from 'react';
import { Info, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AuditDetailedBudgetWorksheetProps {
  isUS?: boolean;
}

interface StaffRow { id: string; role: string; hours: string; rate: string; }
interface TimeRow  { id: string; task: string; hours: string; }

const makeStaff = (id: string, role: string, hours = '', rate = ''): StaffRow => ({ id, role, hours, rate });
const makeTime  = (id: string, task: string, hours = ''): TimeRow => ({ id, task, hours });

const parseNum = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
const fmtAmt   = (n: number) => n > 0 ? `$${n.toFixed(2)}` : '—';
const fmtHrs   = (n: number) => n > 0 ? n.toFixed(1) : '—';

export function AuditDetailedBudgetWorksheet({ isUS = false }: AuditDetailedBudgetWorksheetProps) {
  const EQCR = isUS ? 'EQR' : 'EQCR';

  const [fieldRows,     setFieldRows]     = useState<StaffRow[]>([makeStaff('f1', 'Senior'), makeStaff('f2', 'Assistant(s)')]);
  const [specialistRows,setSpecialistRows]= useState<StaffRow[]>([makeStaff('sp1', '')]);
  const [mgmtRows,      setMgmtRows]      = useState<StaffRow[]>([makeStaff('m1', 'Partner / Practitioner'), makeStaff('m2', 'Manager'), makeStaff('m3', `Quality control (${EQCR})`)]);
  const [adminRows,     setAdminRows]     = useState<StaffRow[]>([makeStaff('a1', 'Typing, proofreading, checking, printing, photocopying'), makeStaff('a2', 'Travel and out-of-pocket expenses'), makeStaff('a3', 'Other')]);
  const [proposedFee,   setProposedFee]   = useState('');
  const [staffComments, setStaffComments] = useState('');

  const [raRows,  setRaRows]  = useState<TimeRow[]>([makeTime('ra1', 'Pre-engagement'), makeTime('ra2', 'Risk assessment procedures')]);
  const [rrRows,  setRrRows]  = useState<TimeRow[]>([
    makeTime('rr1',  'Overall responses'),
    makeTime('rr2',  'Detailed audit plans'),
    makeTime('rr3',  'Client meetings'),
    makeTime('rr4',  'Pre-period end procedures (inventory observation, confirmations, etc.)'),
    makeTime('rr5',  'Cash and short-term investments'),
    makeTime('rr6',  'Accounts receivable'),
    makeTime('rr7',  'Inventory'),
    makeTime('rr8',  'Long-term investments'),
    makeTime('rr9',  'Property, plant and equipment'),
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

  const [conclusion,  setConclusion]  = useState('');
  const [concluded,   setConcluded]   = useState(false);

  // Calculations
  const calcAmt    = (r: StaffRow) => parseNum(r.hours) * parseNum(r.rate);
  const subAmt     = (rows: StaffRow[]) => rows.reduce((a, r) => a + calcAmt(r), 0);
  const subHrs     = (rows: TimeRow[])  => rows.reduce((a, r) => a + parseNum(r.hours), 0);
  const totalAmt   = subAmt(fieldRows) + subAmt(specialistRows) + subAmt(mgmtRows) + subAmt(adminRows);
  const variance   = totalAmt - parseNum(proposedFee);
  const totalHrs   = subHrs(raRows) + subHrs(rrRows) + subHrs(repRows);

  const updateStaff = (setter: Dispatch<SetStateAction<StaffRow[]>>, idx: number, field: keyof StaffRow, val: string) =>
    setter(prev => prev.map((r, i) => i !== idx ? r : { ...r, [field]: val }));
  const updateTime  = (setter: Dispatch<SetStateAction<TimeRow[]>>, idx: number, val: string) =>
    setter(prev => prev.map((r, i) => i !== idx ? r : { ...r, hours: val }));
  const addStaff    = (setter: Dispatch<SetStateAction<StaffRow[]>>) =>
    setter(prev => [...prev, makeStaff(`s-${Date.now()}`, '')]);
  const removeStaff = (setter: Dispatch<SetStateAction<StaffRow[]>>, id: string) =>
    setter(prev => prev.filter(r => r.id !== id));

  // ── Sub-components ─────────────────────────────────────────────────────────

  const StaffSection = ({
    title, rows, setter, roleEditable = true, showAdd = true, showRemove = true,
  }: {
    title: string; rows: StaffRow[];
    setter?: Dispatch<SetStateAction<StaffRow[]>>;
    roleEditable?: boolean; showAdd?: boolean; showRemove?: boolean;
  }) => (
    <>
      {/* Sub-section header */}
      <tr className="bg-muted/40 border-y border-border">
        <td className="px-4 py-2 text-xs font-semibold text-foreground" colSpan={5}>{title}</td>
      </tr>
      {rows.map((row, i) => (
        <tr key={row.id} className="hover:bg-muted/50 transition-colors border-b border-border/50">
          <td className="px-4 py-2.5 align-top">
            {roleEditable && setter
              ? <Input className="h-8 text-sm" placeholder="Role" value={row.role} onChange={e => updateStaff(setter, i, 'role', e.target.value)} />
              : <span className="text-sm">{row.role}</span>}
          </td>
          <td className="px-4 py-2.5 align-top w-28">
            {setter
              ? <Input className="h-8 text-sm tabular-nums text-right" placeholder="0.0" value={row.hours} onChange={e => updateStaff(setter, i, 'hours', e.target.value)} />
              : <span className="text-sm text-right block">{row.hours}</span>}
          </td>
          <td className="px-4 py-2.5 align-top w-28">
            {setter
              ? <Input className="h-8 text-sm tabular-nums text-right" placeholder="0.00" value={row.rate} onChange={e => updateStaff(setter, i, 'rate', e.target.value)} />
              : <span className="text-sm text-right block">{row.rate}</span>}
          </td>
          <td className="px-4 py-2.5 align-top w-32 text-sm tabular-nums text-right text-muted-foreground">
            {fmtAmt(calcAmt(row))}
          </td>
          <td className="px-2 py-2.5 align-top text-center w-10">
            {showRemove && setter && (
              <button onClick={() => removeStaff(setter, row.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </td>
        </tr>
      ))}
      {showAdd && setter && (
        <tr className="border-b border-border/30">
          <td colSpan={5} className="px-4 py-2">
            <button onClick={() => addStaff(setter)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <Plus className="h-4 w-4" />Add Row
            </button>
          </td>
        </tr>
      )}
      {/* Sub-section subtotal */}
      <tr className="bg-muted/30 border-t border-border">
        <td className="px-4 py-2 text-xs font-semibold text-foreground">Subtotal</td>
        <td className="px-4 py-2 text-sm tabular-nums text-right font-semibold">{fmtHrs(rows.reduce((a, r) => a + parseNum(r.hours), 0))}</td>
        <td className="px-4 py-2" />
        <td className="px-4 py-2 text-sm tabular-nums text-right font-semibold">{fmtAmt(subAmt(rows))}</td>
        <td className="px-2 py-2" />
      </tr>
    </>
  );

  const TimeSection = ({
    title, rows, setter, showAdd = false,
  }: {
    title: string; rows: TimeRow[];
    setter: Dispatch<SetStateAction<TimeRow[]>>;
    showAdd?: boolean;
  }) => (
    <>
      <tr className="bg-muted/40 border-y border-border">
        <td className="px-4 py-2 text-xs font-semibold text-foreground" colSpan={2}>{title}</td>
      </tr>
      {rows.map((row, i) => (
        <tr key={row.id} className="hover:bg-muted/50 transition-colors border-b border-border/50">
          <td className="px-4 py-2.5 align-top text-sm">{row.task}</td>
          <td className="px-4 py-2.5 align-top w-28">
            <Input className="h-8 text-sm tabular-nums text-right" placeholder="0.0" value={row.hours} onChange={e => updateTime(setter, i, e.target.value)} />
          </td>
        </tr>
      ))}
      {showAdd && (
        <tr className="border-b border-border/30">
          <td colSpan={2} className="px-4 py-2">
            <button onClick={() => setter(prev => [...prev, makeTime(`t-${Date.now()}`, '')])} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <Plus className="h-4 w-4" />Add Row
            </button>
          </td>
        </tr>
      )}
      <tr className="bg-muted/30 border-t border-border">
        <td className="px-4 py-2 text-xs font-semibold text-foreground">Subtotal</td>
        <td className="px-4 py-2 text-sm tabular-nums text-right font-semibold">{fmtHrs(subHrs(rows))}</td>
      </tr>
    </>
  );

  const standard = isUS ? 'AU-C 300' : 'CAS 300';

  return (
    <div className="flex flex-col h-full">

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Document the detailed staff resources and time budget for the engagement, and compare against the proposed fee. ({standard})
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* Staff Resources */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Staff Resources</span>
              <span title="Enter hours and charge-out rate per role. Amount = Hours × Rate.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider w-28">Hours</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider w-28">Rate ($/hr)</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider w-32">Amount</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  <StaffSection title="Audit team (field work)"      rows={fieldRows}      setter={setFieldRows}      roleEditable={false} />
                  <StaffSection title="Specialists (specify role)"   rows={specialistRows} setter={setSpecialistRows} />
                  <StaffSection title="Audit management"             rows={mgmtRows}       setter={setMgmtRows}       roleEditable={false} showAdd={false} showRemove={false} />
                  <StaffSection title="Administration"               rows={adminRows}      setter={setAdminRows}      roleEditable={false} showAdd={false} showRemove={false} />
                  {/* Grand total */}
                  <tr className="bg-primary/5 border-t-2 border-primary/20">
                    <td className="px-4 py-3 text-sm font-bold text-foreground" colSpan={3}>Total</td>
                    <td className="px-4 py-3 text-sm font-bold tabular-nums text-right">{fmtAmt(totalAmt)}</td>
                    <td className="px-2 py-3" />
                  </tr>
                  <tr className="border-t border-border/50">
                    <td className="px-4 py-2.5 text-sm font-medium text-foreground" colSpan={3}>Proposed fee</td>
                    <td className="px-4 py-2.5 w-32">
                      <Input className="h-8 text-sm tabular-nums text-right" placeholder="0.00" value={proposedFee} onChange={e => setProposedFee(e.target.value)} />
                    </td>
                    <td className="px-2 py-2.5" />
                  </tr>
                  <tr className="bg-muted/20 border-t border-border/50">
                    <td className="px-4 py-2.5 text-sm font-medium text-foreground" colSpan={3}>Variance</td>
                    <td className={`px-4 py-2.5 text-sm tabular-nums text-right font-semibold ${variance > 0 ? 'text-emerald-600' : variance < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {proposedFee ? fmtAmt(variance) : '—'}
                    </td>
                    <td className="px-2 py-2.5" />
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-border">
              <label className="text-xs font-medium text-muted-foreground block mb-2">Comments and explanations for variances</label>
              <Textarea className="min-h-[72px] text-sm resize-none" placeholder="Enter comments…" value={staffComments} onChange={e => setStaffComments(e.target.value)} />
            </div>
          </div>

          {/* Detailed Time Budget */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Detailed Time Budget</span>
              <span title="Estimate hours by task area across all phases of the engagement.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Task</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-foreground uppercase tracking-wider w-28">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  <TimeSection title="Risk Assessment"             rows={raRows}  setter={setRaRows} />
                  <TimeSection title="Response to Assessed Risks"  rows={rrRows}  setter={setRrRows}  showAdd />
                  <TimeSection title="Reporting"                   rows={repRows} setter={setRepRows} />
                  {/* Total */}
                  <tr className="bg-primary/5 border-t-2 border-primary/20">
                    <td className="px-4 py-3 text-sm font-bold text-foreground">Total budget</td>
                    <td className="px-4 py-3 text-sm font-bold tabular-nums text-right">{fmtHrs(totalHrs)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-border">
              <label className="text-xs font-medium text-muted-foreground block mb-2">Comments (over/under budget reasons)</label>
              <Textarea className="min-h-[72px] text-sm resize-none" placeholder="Enter comments…" value={timeComments} onChange={e => setTimeComments(e.target.value)} />
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Conclusion</span>
            </div>
            <div className="px-6 py-5">
              <Textarea
                value={conclusion}
                onChange={e => setConclusion(e.target.value)}
                placeholder="Document any conclusions or variances noted in the detailed budget…"
                className="min-h-[72px] text-sm resize-none bg-background"
              />
            </div>
          </div>

          {/* Conclude button — bottom right */}
          <div className="flex justify-end">
            <Button
              onClick={() => { setConcluded(true); toast.success('Detailed budget worksheet concluded'); }}
              disabled={concluded}
            >
              {concluded ? 'Worksheet concluded' : 'Conclude worksheet'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
