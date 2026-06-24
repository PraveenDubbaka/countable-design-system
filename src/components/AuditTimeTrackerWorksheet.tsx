import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Play, Square, Trash2, Zap, AlertTriangle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTimeEntries, fmtElapsed, RoleKey, ROLE_LABELS, CURRENT_USER, TimeEntry } from "@/lib/useTimeEntries";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

// ── Constants ────────────────────────────────────────────────────────────────

const ROLE_KEYS: RoleKey[] = ["partner", "manager", "senior", "assistant", "eqcr", "specialist", "admin"];

const INDUSTRY_ROLE_PCT: Record<RoleKey, number> = {
  partner: 12, manager: 18, senior: 27, assistant: 30,
  eqcr: 8, specialist: 3, admin: 2, other: 0,
};

const SECTIONS = [
  { key: "general",     label: "General / Planning",    pct: 15 },
  { key: "risk-assess", label: "Risk Assessment",        pct: 25 },
  { key: "risk-resp",   label: "Risk Response",          pct: 48 },
  { key: "reporting",   label: "Reporting / Completion", pct: 12 },
];

const DEFAULT_RATES: Partial<Record<RoleKey, string>> = {
  partner: "350", manager: "250", senior: "175", assistant: "125",
  eqcr: "300", specialist: "200", admin: "75",
};

const TASKS: Record<string, { id: string; label: string }[]> = {
  general: [
    { id: "g1", label: "Overall strategy and planning" },
    { id: "g2", label: "Supervision and review" },
    { id: "g3", label: "Client communication" },
    { id: "g4", label: "Meetings and coordination" },
    { id: "g5", label: "Reports and documentation" },
    { id: "g6", label: "Administration" },
    { id: "g7", label: "Travel" },
  ],
  "risk-assess": [
    { id: "ra1", label: "F/S analysis and planning" },
    { id: "ra2", label: "Planning risk assessment procedures" },
    { id: "ra3", label: "Performing risk assessment procedures" },
    { id: "ra4", label: "Assessing results" },
  ],
  "risk-resp": [
    { id: "rr1",  label: "Overall responses to risks" },
    { id: "rr2",  label: "Fraud risk procedures" },
    { id: "rr3",  label: "Cash and bank" },
    { id: "rr4",  label: "Accounts receivable" },
    { id: "rr5",  label: "Inventory" },
    { id: "rr6",  label: "Property, plant & equipment" },
    { id: "rr7",  label: "Intangible assets" },
    { id: "rr8",  label: "Long-term debt" },
    { id: "rr9",  label: "Accounts payable" },
    { id: "rr10", label: "Income taxes" },
    { id: "rr11", label: "Contingencies" },
    { id: "rr12", label: "Shareholders' equity" },
    { id: "rr13", label: "Related party transactions" },
    { id: "rr14", label: "Revenue" },
    { id: "rr15", label: "Cost of goods sold" },
    { id: "rr16", label: "Payroll" },
    { id: "rr17", label: "Operating expenses" },
    { id: "rr18", label: "Other income / expense" },
    { id: "rr19", label: "Other substantive procedures" },
    { id: "rr20", label: "Completion procedures" },
  ],
  reporting: [
    { id: "rep1", label: "Financial statement review" },
    { id: "rep2", label: "EQCR review" },
    { id: "rep3", label: "Final partner review" },
    { id: "rep4", label: "Management representation letter" },
    { id: "rep5", label: "File completion and archiving" },
  ],
};

const ALL_TASKS = Object.values(TASKS).flat();

// ── Helpers ──────────────────────────────────────────────────────────────────

const num    = (s: string | undefined | null) => parseFloat(s ?? "") || 0;
const fmtH   = (v: number) => (v % 1 === 0 ? `${v}` : v.toFixed(1));
const fmt$   = (v: number) =>
  v.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const round4 = (v: number) => Math.round(v * 4) / 4;

// ── Types ────────────────────────────────────────────────────────────────────

interface BudgetPlan {
  totalHrs: string;
  proposedFee: string;
  byRole: Partial<Record<RoleKey, string>>;
  priorByRole: Partial<Record<RoleKey, string>>;
  bySection: Partial<Record<string, string>>;
}

// ── Component ────────────────────────────────────────────────────────────────

export function AuditTimeTrackerWorksheet() {
  const { engagementId = "default" } = useParams<{ engagementId: string }>();
  const ratesKey  = `audit-team-rates-${engagementId}`;
  const budgetKey = `audit-time-budget-${engagementId}`;

  const { entries, addEntry, removeEntry, hrsForRole, hrsForSection } = useTimeEntries(engagementId);

  // ── Rates ─────────────────────────────────────────────────────────────────
  const [rates, setRates] = useState<Partial<Record<RoleKey, string>>>(() => {
    const saved = readJsonFromLocalStorage<Partial<Record<RoleKey, string>>>(ratesKey, {});
    return (saved && Object.keys(saved).length > 0) ? saved : { ...DEFAULT_RATES };
  });

  // ── Budget plan ───────────────────────────────────────────────────────────
  const emptyBudget = (): BudgetPlan => ({
    totalHrs: "", proposedFee: "",
    byRole: Object.fromEntries(ROLE_KEYS.map(r => [r, ""])),
    priorByRole: Object.fromEntries(ROLE_KEYS.map(r => [r, ""])),
    bySection: Object.fromEntries(SECTIONS.map(s => [s.key, ""])),
  });

  const [budget, setBudget] = useState<BudgetPlan>(() =>
    readJsonFromLocalStorage<BudgetPlan | null>(budgetKey, null) ?? emptyBudget()
  );

  // ── Log form ──────────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const [logDate, setLogDate]       = useState(today);
  const [logRole, setLogRole]       = useState<RoleKey>(CURRENT_USER.roleKey);
  const [logSection, setLogSection] = useState("general");
  const [logTask, setLogTask]       = useState("g1");
  const [logHours, setLogHours]     = useState("");
  const [logDesc, setLogDesc]       = useState("");

  useEffect(() => {
    const first = TASKS[logSection]?.[0];
    if (first) setLogTask(first.id);
  }, [logSection]);

  // ── Manual timer ─────────────────────────────────────────────────────────
  const [timerSec, setTimerSec]         = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(false);

  const toggleTimer = () => {
    if (activeRef.current) {
      clearInterval(timerRef.current!);
      activeRef.current = false;
      setTimerRunning(false);
      const hrs = timerSec / 3600;
      if (hrs > 0) setLogHours(round4(hrs).toString());
    } else {
      setTimerSec(0);
      activeRef.current = true;
      setTimerRunning(true);
      timerRef.current = setInterval(() => {
        if (document.visibilityState === "visible") setTimerSec(s => s + 1);
      }, 1000);
    }
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ── Persist ───────────────────────────────────────────────────────────────
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    writeJsonToLocalStorage(ratesKey, rates);
  }, [rates, ratesKey]);

  useEffect(() => {
    const t = setTimeout(() => writeJsonToLocalStorage(budgetKey, budget), 400);
    return () => clearTimeout(t);
  }, [budget, budgetKey]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalActualHrs = useMemo(() => entries.reduce((s, e) => s + e.hours, 0), [entries]);

  const actualsByRole = useMemo(() => {
    const m: Partial<Record<RoleKey, number>> = {};
    for (const e of entries) m[e.roleKey] = (m[e.roleKey] ?? 0) + e.hours;
    return m;
  }, [entries]);

  const actualsBySection = useMemo(() => {
    const m: Record<string, number> = {};
    for (const e of entries) m[e.tbSection] = (m[e.tbSection] ?? 0) + e.hours;
    return m;
  }, [entries]);

  const totalBudgetHrs = useMemo(
    () => ROLE_KEYS.reduce((s, r) => s + num(budget.byRole[r]), 0),
    [budget.byRole]
  );

  const totalBudgetCost = useMemo(
    () => ROLE_KEYS.reduce((s, r) => s + num(budget.byRole[r]) * num(rates[r]), 0),
    [budget.byRole, rates]
  );

  const totalActualCost = useMemo(
    () => ROLE_KEYS.reduce((s, r) => s + (actualsByRole[r] ?? 0) * num(rates[r]), 0),
    [actualsByRole, rates]
  );

  const blendedRate = useMemo(() => {
    let cost = 0, hrs = 0;
    ROLE_KEYS.forEach(r => { const h = num(budget.byRole[r]); cost += h * num(rates[r]); hrs += h; });
    return hrs > 0 ? cost / hrs : 0;
  }, [budget.byRole, rates]);

  const varHrs     = totalBudgetHrs - totalActualHrs;
  const overBudget = totalBudgetHrs > 0 && varHrs < 0;
  const ratesMissing = ROLE_KEYS.slice(0, 5).some(r => !num(rates[r]));

  // ── Handlers ──────────────────────────────────────────────────────────────

  const applyStandards = () => {
    const total = num(budget.totalHrs);
    if (!total) return;
    const byRole: Partial<Record<RoleKey, string>> = {};
    ROLE_KEYS.forEach(r => { byRole[r] = String(round4(total * INDUSTRY_ROLE_PCT[r] / 100)); });
    const bySection: Partial<Record<string, string>> = {};
    SECTIONS.forEach(s => { bySection[s.key] = String(round4(total * s.pct / 100)); });
    setBudget(b => ({ ...b, byRole, bySection }));
  };

  const loadPriorYear = () => {
    const byRole: Partial<Record<RoleKey, string>> = {};
    ROLE_KEYS.forEach(r => { byRole[r] = budget.priorByRole[r] ?? ""; });
    setBudget(b => ({ ...b, byRole }));
  };

  const saveAsPriorYear = () => {
    const priorByRole: Partial<Record<RoleKey, string>> = {};
    ROLE_KEYS.forEach(r => { priorByRole[r] = budget.byRole[r] ?? ""; });
    setBudget(b => ({ ...b, priorByRole }));
  };

  const logTime = () => {
    const hrs = parseFloat(logHours);
    if (!hrs || hrs <= 0) return;
    addEntry({
      id: `e-${Date.now()}`,
      date: logDate, roleKey: logRole,
      tbRowId: logTask, tbSection: logSection,
      hours: hrs, description: logDesc,
    } as TimeEntry);
    setLogHours(""); setLogDesc("");
  };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">

      {/* Objective */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Track actual time against budgeted hours by role and section. Budget is auto-populated
          from CAS industry standards and fully editable. Blended rate, cost variance, and fee
          position are computed automatically from engagement hourly rates.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-5">

          {/* ── KPI strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Budget Hours", value: totalBudgetHrs > 0 ? fmtH(totalBudgetHrs) : "—",
                sub: "total budgeted", color: "" },
              { label: "Actual Hours", value: fmtH(totalActualHrs),
                sub: `${entries.length} entries`, color: "" },
              { label: "Variance",
                value: totalBudgetHrs > 0 ? (varHrs >= 0 ? "+" : "") + fmtH(varHrs) + " h" : "—",
                sub: overBudget ? "over budget" : totalBudgetHrs > 0 ? "remaining" : "no budget set",
                color: overBudget ? "text-red-600 dark:text-red-400" : totalBudgetHrs > 0 ? "text-green-600 dark:text-green-400" : "" },
              { label: "Blended Rate", value: blendedRate > 0 ? fmt$(blendedRate) + "/hr" : "—",
                sub: "weighted avg by role", color: "" },
            ].map(k => (
              <div key={k.label} className="bg-card border border-border rounded-lg px-4 py-3">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">{k.label}</p>
                <p className={`text-xl font-bold ${k.color || "text-foreground"}`}>{k.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Rates + Budget Planning */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
            <div className="px-5 py-3 border-b border-border flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Rates &amp; Budget Planning</span>
              <div className="ml-auto flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={loadPriorYear}
                  title="Load prior year hours as starting budget"
                  disabled={!ROLE_KEYS.some(r => budget.priorByRole[r])}>
                  ↩ Load Prior Year
                </Button>
                <Button variant="outline" size="sm" onClick={saveAsPriorYear}
                  title="Save current budget as prior year baseline"
                  disabled={!ROLE_KEYS.some(r => budget.byRole[r])}>
                  Save as Prior Year
                </Button>
              </div>
            </div>

            {ratesMissing && (
              <div className="mx-5 mt-4 flex items-center gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Some rates are missing. Set team rates at engagement creation, or edit them directly in the table below.
                </p>
              </div>
            )}

            {/* Total hours + fee + apply */}
            <div className="px-5 pt-4 pb-3 flex flex-wrap items-end gap-4 border-b border-border/60">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Total Budget Hours</p>
                <Input value={budget.totalHrs}
                  onChange={e => setBudget(b => ({ ...b, totalHrs: e.target.value }))}
                  placeholder="e.g. 150" className="h-8 w-32 text-sm" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Proposed Fee ($)</p>
                <Input value={budget.proposedFee}
                  onChange={e => setBudget(b => ({ ...b, proposedFee: e.target.value }))}
                  placeholder="e.g. 25000" className="h-8 w-36 text-sm" />
              </div>
              <Button size="sm" onClick={applyStandards} disabled={!num(budget.totalHrs)} className="gap-1.5">
                <Zap className="h-3.5 w-3.5" />Apply Industry Standards
              </Button>
              <div className="ml-auto text-right shrink-0">
                <p className="text-[11px] text-muted-foreground">Total Budget Cost</p>
                <p className="text-lg font-bold">{totalBudgetCost > 0 ? fmt$(totalBudgetCost) : "—"}</p>
                {num(budget.proposedFee) > 0 && totalBudgetCost > 0 && (
                  <p className={`text-xs font-medium ${num(budget.proposedFee) >= totalBudgetCost ? "text-green-600" : "text-red-500"}`}>
                    vs. fee: {(num(budget.proposedFee) >= totalBudgetCost ? "+" : "") + fmt$(num(budget.proposedFee) - totalBudgetCost)}
                  </p>
                )}
              </div>
            </div>

            {/* Role budget table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted text-[11px] font-semibold uppercase tracking-wider text-foreground border-b border-border">
                    <th className="px-5 py-2 text-left">Role</th>
                    <th className="px-3 py-2 text-center w-14">Std %</th>
                    <th className="px-3 py-2 text-right w-28">Rate ($/hr)</th>
                    <th className="px-3 py-2 text-right w-28">Budget Hrs</th>
                    <th className="px-3 py-2 text-right w-28">Budget $</th>
                    <th className="px-3 py-2 text-right w-24">Prior Hrs</th>
                    <th className="px-3 py-2 text-right w-24">Actual Hrs</th>
                    <th className="px-3 py-2 text-right w-24">Var Hrs</th>
                    <th className="px-3 py-2 text-right w-24">Actual $</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ROLE_KEYS.map(rk => {
                    const bh   = num(budget.byRole[rk]);
                    const ah   = actualsByRole[rk] ?? 0;
                    const rate = num(rates[rk]);
                    const varH = bh - ah;
                    return (
                      <tr key={rk} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-1.5 font-medium text-foreground">{ROLE_LABELS[rk]}</td>
                        <td className="px-3 py-1.5 text-center text-xs text-muted-foreground">{INDUSTRY_ROLE_PCT[rk]}%</td>
                        <td className="px-3 py-1.5 text-right">
                          <Input value={rates[rk] ?? ""}
                            onChange={e => setRates(r => ({ ...r, [rk]: e.target.value }))}
                            className="h-6 text-sm text-right border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent w-20 ml-auto"
                            placeholder="0" />
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <Input value={budget.byRole[rk] ?? ""}
                            onChange={e => setBudget(b => ({ ...b, byRole: { ...b.byRole, [rk]: e.target.value } }))}
                            className="h-6 text-sm text-right border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent w-20 ml-auto"
                            placeholder="0" />
                        </td>
                        <td className="px-3 py-1.5 text-right text-xs text-muted-foreground">
                          {bh > 0 && rate > 0 ? fmt$(bh * rate) : "—"}
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <Input value={budget.priorByRole[rk] ?? ""}
                            onChange={e => setBudget(b => ({ ...b, priorByRole: { ...b.priorByRole, [rk]: e.target.value } }))}
                            className="h-6 text-sm text-right border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent w-16 ml-auto text-muted-foreground"
                            placeholder="—" />
                        </td>
                        <td className="px-3 py-1.5 text-right font-medium">{ah > 0 ? fmtH(ah) : "—"}</td>
                        <td className={`px-3 py-1.5 text-right font-semibold ${varH < 0 ? "text-red-600 dark:text-red-400" : varH > 0 && bh > 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                          {bh > 0 ? (varH >= 0 ? "+" : "") + fmtH(varH) : "—"}
                        </td>
                        <td className="px-3 py-1.5 text-right text-xs text-muted-foreground">
                          {ah > 0 && rate > 0 ? fmt$(ah * rate) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50 border-t-2 border-border font-semibold text-sm">
                    <td className="px-5 py-2 text-foreground">Total</td>
                    <td className="px-3 py-2 text-center text-xs text-muted-foreground">100%</td>
                    <td className="px-3 py-2 text-right text-xs text-muted-foreground">
                      {blendedRate > 0 ? `${fmt$(blendedRate)} blended` : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">{totalBudgetHrs > 0 ? fmtH(totalBudgetHrs) : "—"}</td>
                    <td className="px-3 py-2 text-right text-xs">{totalBudgetCost > 0 ? fmt$(totalBudgetCost) : "—"}</td>
                    <td className="px-3 py-2" />
                    <td className="px-3 py-2 text-right">{totalActualHrs > 0 ? fmtH(totalActualHrs) : "—"}</td>
                    <td className={`px-3 py-2 text-right ${overBudget ? "text-red-600" : totalBudgetHrs > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                      {totalBudgetHrs > 0 ? (varHrs >= 0 ? "+" : "") + fmtH(varHrs) : "—"}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">{totalActualCost > 0 ? fmt$(totalActualCost) : "—"}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Section Budget vs Actual */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
            <div className="px-5 py-3 border-b border-border">
              <span className="text-sm font-semibold">Budget vs Actual — By Section</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted text-[11px] font-semibold uppercase tracking-wider text-foreground border-b border-border">
                    <th className="px-5 py-2 text-left">Section</th>
                    <th className="px-3 py-2 text-center w-14">Std %</th>
                    <th className="px-3 py-2 text-right w-28">Budget Hrs</th>
                    <th className="px-3 py-2 text-right w-24">Actual Hrs</th>
                    <th className="px-3 py-2 text-right w-24">Variance</th>
                    <th className="px-5 py-2 text-left">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {SECTIONS.map(sec => {
                    const bh   = num(budget.bySection[sec.key]);
                    const ah   = actualsBySection[sec.key] ?? 0;
                    const varH = bh - ah;
                    const pct  = bh > 0 ? Math.min(100, (ah / bh) * 100) : 0;
                    const over = bh > 0 && ah > bh;
                    return (
                      <tr key={sec.key} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-2 font-medium">{sec.label}</td>
                        <td className="px-3 py-2 text-center text-xs text-muted-foreground">{sec.pct}%</td>
                        <td className="px-3 py-2 text-right">
                          <Input value={budget.bySection[sec.key] ?? ""}
                            onChange={e => setBudget(b => ({ ...b, bySection: { ...b.bySection, [sec.key]: e.target.value } }))}
                            className="h-6 text-sm text-right border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent w-16 ml-auto"
                            placeholder="0" />
                        </td>
                        <td className="px-3 py-2 text-right font-medium">{ah > 0 ? fmtH(ah) : "—"}</td>
                        <td className={`px-3 py-2 text-right font-semibold ${varH < 0 ? "text-red-600 dark:text-red-400" : varH > 0 && bh > 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                          {bh > 0 ? (varH >= 0 ? "+" : "") + fmtH(varH) : "—"}
                        </td>
                        <td className="px-5 py-2">
                          {bh > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${over ? "bg-red-500" : "bg-primary"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className={`text-xs font-medium w-9 shrink-0 text-right ${over ? "text-red-500" : "text-muted-foreground"}`}>
                                {Math.round(pct)}%
                              </span>
                            </div>
                          ) : <span className="text-xs text-muted-foreground">Set budget hrs to track</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Timer + Log Time */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
            <div className="px-5 py-3 border-b border-border flex items-center gap-4">
              <span className="text-sm font-semibold">Log Time</span>
              <div className="ml-auto flex items-center gap-3">
                {timerRunning && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Recording
                  </span>
                )}
                <span className="font-mono text-base font-semibold tabular-nums text-foreground">{fmtElapsed(timerSec)}</span>
                <Button variant={timerRunning ? "destructive" : "outline"} size="sm" onClick={toggleTimer} className="gap-1.5">
                  {timerRunning ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {timerRunning ? "Stop & Fill" : "Start Timer"}
                </Button>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Date</p>
                  <Input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} className="h-8 text-sm" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Role</p>
                  <Select value={logRole} onValueChange={v => setLogRole(v as RoleKey)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROLE_KEYS.map(r => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Section</p>
                  <Select value={logSection} onValueChange={setLogSection}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Task</p>
                  <Select value={logTask} onValueChange={setLogTask}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(TASKS[logSection] ?? []).map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Hours</p>
                  <Input type="number" step="0.25" min="0" value={logHours}
                    onChange={e => setLogHours(e.target.value)} placeholder="0.0" className="h-8 text-sm" />
                </div>
                <div className="flex flex-col justify-end">
                  <Button onClick={logTime} disabled={!logHours || parseFloat(logHours) <= 0} className="h-8 w-full">
                    + Log Time
                  </Button>
                </div>
              </div>
              <Input value={logDesc} onChange={e => setLogDesc(e.target.value)}
                placeholder="Brief description of work performed (optional)…" className="h-8 text-sm" />
            </div>
          </div>

          {/* ── Time Log */}
          <div className="bg-card border border-border rounded-lg overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold">Time Log</span>
              <span className="text-xs text-muted-foreground">
                {entries.length} entries · {fmtH(totalActualHrs)} h · {totalActualCost > 0 ? fmt$(totalActualCost) : "—"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted text-[11px] font-semibold uppercase tracking-wider text-foreground border-b border-border">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Section › Task</th>
                    <th className="px-4 py-2 text-right w-16">Hours</th>
                    <th className="px-4 py-2 text-right w-24">Cost</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {entries.slice(0, 60).map(e => {
                    const task    = ALL_TASKS.find(t => t.id === e.tbRowId)?.label ?? e.tbRowId;
                    const section = SECTIONS.find(s => s.key === e.tbSection)?.label ?? e.tbSection;
                    const cost    = e.hours * num(rates[e.roleKey]);
                    return (
                      <tr key={e.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-1.5 text-xs text-muted-foreground">{e.date}</td>
                        <td className="px-4 py-1.5">{ROLE_LABELS[e.roleKey]}</td>
                        <td className="px-4 py-1.5 text-xs text-muted-foreground">{section} › {task}</td>
                        <td className="px-4 py-1.5 text-right font-medium">{fmtH(e.hours)}</td>
                        <td className="px-4 py-1.5 text-right text-xs text-muted-foreground">{cost > 0 ? fmt$(cost) : "—"}</td>
                        <td className="px-4 py-1.5 text-xs text-muted-foreground max-w-[200px] truncate">{e.description || "—"}</td>
                        <td className="px-4 py-1.5 text-right">
                          <button onClick={() => removeEntry(e.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {entries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No time entries yet. Log your first entry above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
