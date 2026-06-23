import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Info, Play, Square, Plus, Trash2, Clock, TrendingUp, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTimeEntries, ROLE_LABELS, ROLE_TO_TB_ROW, type RoleKey, type TimeEntry } from '@/lib/useTimeEntries';

// ── TB row definitions (mirrors AuditTimeBudgetWorksheet) ────────────────────
const TB_ROWS: Array<{ id: string; label: string; section: string }> = [
  { id: 'g1',  section: 'general',    label: 'Overall strategy and planning' },
  { id: 'g2',  section: 'general',    label: 'Supervision and review' },
  { id: 'g3',  section: 'general',    label: 'Audit team communication' },
  { id: 'g4',  section: 'general',    label: 'Client meetings' },
  { id: 'g5',  section: 'general',    label: 'Financial statement reports and communications' },
  { id: 'g6',  section: 'general',    label: 'Administration' },
  { id: 'g7',  section: 'general',    label: 'Travel and out of pocket' },
  { id: 'ra1', section: 'risk-assess', label: 'Financial statement analysis' },
  { id: 'ra2', section: 'risk-assess', label: 'Planning risk assessment procedures' },
  { id: 'ra3', section: 'risk-assess', label: 'Performing risk assessment procedures' },
  { id: 'ra4', section: 'risk-assess', label: 'Assessing results' },
  { id: 'rr1', section: 'risk-resp',  label: 'Planning risk response procedures' },
  { id: 'rr2', section: 'risk-resp',  label: 'Overall response and fraud risk' },
  { id: 'rr3', section: 'risk-resp',  label: 'Cash and investments' },
  { id: 'rr4', section: 'risk-resp',  label: 'Accounts receivable' },
  { id: 'rr5', section: 'risk-resp',  label: 'Inventory' },
  { id: 'rr6', section: 'risk-resp',  label: 'Inventory observations' },
  { id: 'rr7', section: 'risk-resp',  label: 'Long-term investments' },
  { id: 'rr8', section: 'risk-resp',  label: 'Property, plant and equipment' },
  { id: 'rr9', section: 'risk-resp',  label: 'Intangibles and goodwill' },
  { id: 'rr10',section: 'risk-resp',  label: 'Bank debt and notes payable' },
  { id: 'rr11',section: 'risk-resp',  label: 'Accounts payable and accruals' },
  { id: 'rr12',section: 'risk-resp',  label: 'Income taxes' },
  { id: 'rr13',section: 'risk-resp',  label: 'Contingencies / subsequent events' },
  { id: 'rr14',section: 'risk-resp',  label: 'Share capital and retained earnings' },
  { id: 'rr15',section: 'risk-resp',  label: 'Related parties' },
  { id: 'rr16',section: 'risk-resp',  label: 'Sales' },
  { id: 'rr17',section: 'risk-resp',  label: 'Cost of sales' },
  { id: 'rr18',section: 'risk-resp',  label: 'Payroll' },
  { id: 'rr19',section: 'risk-resp',  label: 'Operating expenses' },
  { id: 'rr20',section: 'risk-resp',  label: 'Other' },
];

const SECTION_LABELS: Record<string, string> = {
  'general':    'General',
  'risk-assess':'Risk Assessment',
  'risk-resp':  'Risk Response',
};

const SECTION_ORDER = ['general', 'risk-assess', 'risk-resp'];

const fmtSecs = (s: number) => {
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${h}:${m}:${sec}`;
};

// ── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ actual, budget, label }: { actual: number; budget: number; label: string }) {
  const pct = budget > 0 ? Math.min((actual / budget) * 100, 100) : 0;
  const over = budget > 0 && actual > budget;
  const warn = budget > 0 && actual / budget > 0.8 && actual <= budget;
  const color = over ? 'bg-destructive' : warn ? 'bg-amber-400' : 'bg-primary';
  const textColor = over ? 'text-destructive' : warn ? 'text-amber-600' : 'text-primary';
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground w-36 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs tabular-nums font-medium w-20 text-right shrink-0 ${textColor}`}>
        {actual.toFixed(1)} / {budget > 0 ? `${budget.toFixed(1)} h` : '—'}
      </span>
      {over && <span className="text-xs text-destructive font-semibold shrink-0">+{(actual - budget).toFixed(1)}h over</span>}
    </div>
  );
}

export function AuditTimeTrackerWorksheet() {
  const { engagementId = 'default' } = useParams<{ engagementId: string }>();
  const { entries, addEntry, removeEntry, hrsForRow, hrsForRole, hrsForSection } = useTimeEntries(engagementId);

  // ── Form state ────────────────────────────────────────────────────────────
  const [formDate,    setFormDate]    = useState(() => new Date().toISOString().slice(0, 10));
  const [formRole,    setFormRole]    = useState<RoleKey>('senior');
  const [formSection, setFormSection] = useState('general');
  const [formRowId,   setFormRowId]   = useState('g1');
  const [formHours,   setFormHours]   = useState('');
  const [formDesc,    setFormDesc]    = useState('');

  // ── Timer state ───────────────────────────────────────────────────────────
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSecs,    setTimerSecs]    = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerRunning]);

  const startTimer  = () => { setTimerSecs(0); setTimerRunning(true); };
  const stopAndLog  = () => {
    setTimerRunning(false);
    const hrs = parseFloat((timerSecs / 3600).toFixed(2));
    setFormHours(hrs > 0 ? hrs.toFixed(2) : '');
    toast.success(`Timer stopped: ${fmtSecs(timerSecs)} logged as hours`);
  };

  // Keep formRowId in sync with formSection
  const handleSectionChange = (sec: string) => {
    setFormSection(sec);
    const first = TB_ROWS.find(r => r.section === sec);
    if (first) setFormRowId(first.id);
  };

  const filteredRows = TB_ROWS.filter(r => r.section === formSection);

  const handleLog = () => {
    const hrs = parseFloat(formHours);
    if (!hrs || hrs <= 0) { toast.error('Enter a valid hours value'); return; }
    const row = TB_ROWS.find(r => r.id === formRowId);
    const entry: TimeEntry = {
      id: `te-${Date.now()}`,
      date: formDate,
      roleKey: formRole,
      tbRowId: formRowId,
      tbSection: formSection,
      hours: hrs,
      description: formDesc || (row?.label ?? ''),
    };
    addEntry(entry);
    setFormHours('');
    setFormDesc('');
    toast.success(`${hrs}h logged for ${ROLE_LABELS[formRole]}`);
  };

  // ── Summary data ──────────────────────────────────────────────────────────
  const totalLogged = entries.reduce((a, e) => a + e.hours, 0);
  const roleKeys = (Object.keys(ROLE_LABELS) as RoleKey[]).filter(r => hrsForRole(r) > 0);

  return (
    <div className="flex flex-col h-full">

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Log actual time spent on this engagement by role and task. Entries feed the Actual columns in the Time Budget and Detailed Budget worksheets in real time.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* ── Top summary strip ─────────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Clock, label: 'Total Hours Logged', value: `${totalLogged.toFixed(1)} h`, color: 'text-primary' },
              { icon: Users, label: 'Team Members Active', value: `${roleKeys.length}`, color: 'text-emerald-600' },
              { icon: TrendingUp, label: 'Log Entries', value: `${entries.length}`, color: 'text-amber-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-md px-5 py-4 flex items-center gap-4">
                <Icon className={`h-5 w-5 ${color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Log time card ─────────────────────────────────────────────── */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Log Time</span>
              {/* Timer */}
              <div className="flex items-center gap-3">
                <span className={`text-base font-mono tabular-nums ${timerRunning ? 'text-primary' : 'text-muted-foreground'}`}>
                  {fmtSecs(timerSecs)}
                </span>
                {!timerRunning
                  ? <Button size="sm" variant="outline" onClick={startTimer} className="gap-1.5 h-8">
                      <Play className="h-3.5 w-3.5" /> Start timer
                    </Button>
                  : <Button size="sm" variant="destructive" onClick={stopAndLog} className="gap-1.5 h-8">
                      <Square className="h-3.5 w-3.5" /> Stop &amp; fill
                    </Button>
                }
              </div>
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-2 gap-4 mb-4 sm:grid-cols-3 lg:grid-cols-6">
                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Date</label>
                  <Input type="date" className="h-8 text-sm" value={formDate} onChange={e => setFormDate(e.target.value)} />
                </div>
                {/* Role */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Role</label>
                  <select
                    className="input-double-border h-8 text-sm rounded-[10px] border border-[#dcdfe4] bg-white px-2 text-foreground focus:outline-none"
                    value={formRole}
                    onChange={e => setFormRole(e.target.value as RoleKey)}
                  >
                    {(Object.entries(ROLE_LABELS) as [RoleKey, string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                {/* Section */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Section</label>
                  <select
                    className="input-double-border h-8 text-sm rounded-[10px] border border-[#dcdfe4] bg-white px-2 text-foreground focus:outline-none"
                    value={formSection}
                    onChange={e => handleSectionChange(e.target.value)}
                  >
                    {SECTION_ORDER.map(s => (
                      <option key={s} value={s}>{SECTION_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                {/* Task */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Task</label>
                  <select
                    className="input-double-border h-8 text-sm rounded-[10px] border border-[#dcdfe4] bg-white px-2 text-foreground focus:outline-none"
                    value={formRowId}
                    onChange={e => setFormRowId(e.target.value)}
                  >
                    {filteredRows.map(r => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>
                {/* Hours */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Hours</label>
                  <Input
                    type="number" min="0.25" step="0.25"
                    className="h-8 text-sm tabular-nums text-right"
                    placeholder="0.0"
                    value={formHours}
                    onChange={e => setFormHours(e.target.value)}
                  />
                </div>
              </div>
              {/* Description */}
              <div className="flex gap-3 items-end">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-medium text-muted-foreground">Description (optional)</label>
                  <Input
                    className="h-8 text-sm"
                    placeholder="Brief description of work performed…"
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleLog(); }}
                  />
                </div>
                <Button onClick={handleLog} className="gap-1.5 h-8 shrink-0">
                  <Plus className="h-4 w-4" /> Log Time
                </Button>
              </div>
            </div>
          </div>

          {/* ── Section progress ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
              <div className="px-6 py-3.5 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Hours by Section</span>
              </div>
              <div className="px-6 py-4 space-y-3">
                {SECTION_ORDER.map(sec => (
                  <ProgressBar
                    key={sec}
                    label={SECTION_LABELS[sec]}
                    actual={hrsForSection(sec)}
                    budget={0}
                  />
                ))}
                <div className="pt-2 border-t border-border/50">
                  <ProgressBar label="Total" actual={totalLogged} budget={0} />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
              <div className="px-6 py-3.5 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Hours by Role</span>
              </div>
              <div className="px-6 py-4 space-y-3">
                {(Object.keys(ROLE_LABELS) as RoleKey[]).map(role => {
                  const hrs = hrsForRole(role);
                  if (hrs === 0) return null;
                  return (
                    <div key={role} className="flex items-center gap-3">
                      <span className="text-sm text-foreground w-36 shrink-0">{ROLE_LABELS[role]}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all"
                          style={{ width: totalLogged > 0 ? `${(hrs / totalLogged) * 100}%` : '0%' }} />
                      </div>
                      <span className="text-xs tabular-nums font-medium w-14 text-right shrink-0 text-primary">
                        {hrs.toFixed(1)} h
                      </span>
                    </div>
                  );
                })}
                {roleKeys.length === 0 && (
                  <p className="text-sm text-muted-foreground">No entries yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Log table ────────────────────────────────────────────────── */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Time Log</span>
              <span className="text-xs text-muted-foreground">{entries.length} entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    {['Date', 'Role', 'Section', 'Task', 'Hours', 'Description', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {entries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No time entries yet. Use the form above to log time.
                      </td>
                    </tr>
                  )}
                  {entries.map(e => {
                    const taskLabel = TB_ROWS.find(r => r.id === e.tbRowId)?.label ?? e.tbRowId;
                    return (
                      <tr key={e.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-2.5 text-sm tabular-nums whitespace-nowrap">{e.date}</td>
                        <td className="px-4 py-2.5 text-sm whitespace-nowrap">{ROLE_LABELS[e.roleKey]}</td>
                        <td className="px-4 py-2.5 text-sm whitespace-nowrap">{SECTION_LABELS[e.tbSection] ?? e.tbSection}</td>
                        <td className="px-4 py-2.5 text-sm">{taskLabel}</td>
                        <td className="px-4 py-2.5 text-sm tabular-nums font-medium text-right">{e.hours.toFixed(1)}</td>
                        <td className="px-4 py-2.5 text-sm text-muted-foreground max-w-xs truncate">{e.description}</td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() => { removeEntry(e.id); toast.success('Entry removed'); }}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
