import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Plus, Trash2, AlertTriangle } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { formatCurrency, type RevenueStreamSeed } from "@/lib/engagementContext";
import { AutoFillBanner } from "@/components/AutoFillBanner";

// ── Types ──────────────────────────────────────────────────────────────────────

type Rating = "Low" | "Moderate" | "High" | "";
type YN = "Y" | "N" | "NA" | "";
type YSN = "Y" | "S" | "N" | "";
type Assertion = "C" | "AV" | "E" | "P";

interface RevenueStream {
  id: string;
  name: string;
  description: string;
  assertions: Assertion[];        // applicable assertions
  likelihood: Rating;             // fraud likelihood
  magnitude: Rating;              // fraud magnitude
  inherentRisk: Rating;           // overall IR
  significantRisk: YN;            // treated as significant risk?
  rationale: string;
  wpRef: RefDoc[];
}

interface ProcedureRow {
  id: string;
  title: string;
  guidance: string;
  psa: string;                    // P&SA reference (e.g. CAS 240)
  wpRef: RefDoc[];
  psc: YN;
  exceptions: string;
}

interface Data580 {
  accountBalance: string;
  performanceMateriality: string;
  streams: RevenueStream[];
  procedures: ProcedureRow[];
  fraudRiskIdentified: YN;        // overall presumption rebutted?
  rebuttalRationale: string;      // if N — why presumption rebutted
  overallConclusion: YSN;
  conclusionRationale: string;
  notes: string;
  concluded: boolean;
  concludedOn: string;
}

// ── Reference data ─────────────────────────────────────────────────────────────

const RATINGS: Rating[] = ["Low", "Moderate", "High"];
const ASSERTION_OPTIONS: { value: Assertion; label: string }[] = [
  { value: "C",  label: "C — Completeness" },
  { value: "AV", label: "AV — Accuracy / Valuation" },
  { value: "E",  label: "E — Existence" },
  { value: "P",  label: "P — Presentation" },
];

const ratingBadge = (r: Rating): string => {
  switch (r) {
    case "High":     return "bg-red-50 text-red-700 border-red-200";
    case "Moderate": return "bg-amber-50 text-amber-700 border-amber-200";
    case "Low":      return "bg-green-50 text-green-700 border-green-200";
    default:         return "";
  }
};

const DEFAULT_PROCEDURES: Omit<ProcedureRow, "id" | "wpRef" | "psc" | "exceptions">[] = [
  {
    title: "1. Identify revenue streams",
    guidance: "Obtain an understanding of the types of revenue and revenue transactions for the entity.",
    psa: "CAS 315",
  },
  {
    title: "2. Evaluate fraud risk in revenue recognition",
    guidance: "For each revenue stream identified, assess the likelihood and magnitude (inherent risk) that fraud may exist in revenue recognition. Record your results on Form 520.",
    psa: "CAS 240.26",
  },
  {
    title: "3. Conclude on inherent risk",
    guidance: "(a) If a risk of material misstatement due to fraud in revenue recognition has not been identified, document the reasons for that conclusion. (b) If a risk has been identified, document the reasons for the assessment and ensure the risk is treated as a significant risk (Form 520).",
    psa: "CAS 240.27 / .28",
  },
  {
    title: "4. Understand internal controls relevant to the audit",
    guidance: "When a fraud risk in revenue recognition is identified, obtain an understanding of the entity's controls (including control activities) relevant to the identified risk.",
    psa: "CAS 315.21",
  },
  {
    title: "5. Design further audit procedures",
    guidance: "Design and perform further audit procedures to respond to the identified risk. Record risk-specific audit procedures on Form 705.",
    psa: "CAS 330",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function uid(): string { return Math.random().toString(36).slice(2, 9); }

function emptyStream(): RevenueStream {
  return {
    id: uid(), name: "", description: "", assertions: [],
    likelihood: "", magnitude: "", inherentRisk: "",
    significantRisk: "", rationale: "", wpRef: [],
  };
}

function streamFromSeed(s: RevenueStreamSeed): RevenueStream {
  return {
    id: uid(),
    name: s.name,
    description: s.description,
    assertions: [...s.assertions],
    likelihood: s.likelihood,
    magnitude: s.magnitude,
    inherentRisk: s.inherentRisk,
    significantRisk: s.significantRisk,
    rationale: s.rationale,
    wpRef: [],
  };
}

function buildProcedures(): ProcedureRow[] {
  return DEFAULT_PROCEDURES.map(p => ({
    ...p, id: uid(), wpRef: [], psc: "", exceptions: "",
  }));
}

function buildDefault(): Data580 {
  return {
    accountBalance: "",
    performanceMateriality: "",
    streams: [emptyStream()],
    procedures: buildProcedures(),
    fraudRiskIdentified: "",
    rebuttalRationale: "",
    overallConclusion: "",
    conclusionRationale: "",
    notes: "",
    concluded: false, concludedOn: "",
  };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function Audit580Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const storageKey = `audit-580-data-${engagementId ?? "default"}`;
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const [data, setData] = useState<Data580>(() => {
    const saved = readJsonFromLocalStorage<Data580 | null>(storageKey, null);
    const def = buildDefault();
    const seededHeader = {
      accountBalance: "Revenue — all streams (see breakdown below)",
      performanceMateriality: formatCurrency(ctx.performanceMateriality),
    };
    const seededStreams = ctx.revenueStreams.map(streamFromSeed);
    if (!saved) {
      return { ...def, ...seededHeader, streams: seededStreams };
    }
    return {
      ...def, ...saved,
      accountBalance: saved.accountBalance || seededHeader.accountBalance,
      performanceMateriality: saved.performanceMateriality || seededHeader.performanceMateriality,
      streams: saved.streams?.length ? saved.streams : seededStreams,
      procedures: saved.procedures?.length ? saved.procedures : def.procedures,
    };
  });

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  // ── Stream mutators ─────────────────────────────────────────────────────────
  function patchStream(id: string, patch: Partial<RevenueStream>) {
    setData(d => ({ ...d, streams: d.streams.map(s => s.id === id ? { ...s, ...patch } : s) }));
  }
  function toggleAssertion(id: string, a: Assertion) {
    setData(d => ({
      ...d,
      streams: d.streams.map(s => {
        if (s.id !== id) return s;
        const has = s.assertions.includes(a);
        return { ...s, assertions: has ? s.assertions.filter(x => x !== a) : [...s.assertions, a] };
      }),
    }));
  }
  function addStream() { setData(d => ({ ...d, streams: [...d.streams, emptyStream()] })); }
  function removeStream(id: string) {
    setData(d => ({ ...d, streams: d.streams.length > 1 ? d.streams.filter(s => s.id !== id) : d.streams }));
  }

  // ── Procedure mutators ──────────────────────────────────────────────────────
  function patchProcedure(id: string, patch: Partial<ProcedureRow>) {
    setData(d => ({ ...d, procedures: d.procedures.map(p => p.id === id ? { ...p, ...patch } : p) }));
  }

  // ── Summary counts ──────────────────────────────────────────────────────────
  const counts = data.streams.reduce(
    (acc, s) => {
      if (s.inherentRisk === "High") acc.high++;
      else if (s.inherentRisk === "Moderate") acc.mod++;
      else if (s.inherentRisk === "Low") acc.low++;
      if (s.significantRisk === "Y") acc.sig++;
      return acc;
    },
    { high: 0, mod: 0, low: 0, sig: 0 }
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full">
      {/* Objective banner */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-3 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Identify, assess and respond to the presumed risk of material misstatement due to fraud in revenue
          recognition (CAS 240.26). Document each revenue stream, the related fraud risk and inherent risk
          assessment, and the planned audit response.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        <AutoFillBanner
          entityName={ctx.entityName}
          periodEndDisplay={ctx.periodEndDisplay}
          framework={ctx.framework}
          populated="performance materiality, revenue streams (with assertions, likelihood / magnitude and inherent-risk ratings)"
        />

        {/* Engagement context */}
        <div className="bg-card border border-border rounded-md p-5 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Account balance / class of transactions / disclosure</label>
            <Input disabled={locked} value={data.accountBalance}
              onChange={e => setData(d => ({ ...d, accountBalance: e.target.value }))}
              placeholder="e.g. Revenue — Freight services"
              className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Performance materiality ($)</label>
            <Input disabled={locked} value={data.performanceMateriality}
              onChange={e => setData(d => ({ ...d, performanceMateriality: e.target.value }))}
              placeholder="From Form 410"
              className="h-8 text-xs" />
          </div>
        </div>

        {/* Assertions legend */}
        <div className="bg-card border border-border rounded-md p-4">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Assertions</p>
          <div className="grid grid-cols-4 gap-3 text-xs">
            {ASSERTION_OPTIONS.map(a => (
              <div key={a.value} className="rounded-md border border-border bg-muted/30 p-2.5">
                <span className="font-mono font-semibold text-primary mr-1.5">{a.value}</span>
                <span className="text-muted-foreground">{a.label.split("—")[1]?.trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 font-medium">
            High IR streams: <b>{counts.high}</b>
          </span>
          <span className="px-3 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-700 font-medium">
            Moderate IR: <b>{counts.mod}</b>
          </span>
          <span className="px-3 py-1 rounded-md border border-green-200 bg-green-50 text-green-700 font-medium">
            Low IR: <b>{counts.low}</b>
          </span>
          <span className="px-3 py-1 rounded-md border border-primary/20 bg-primary/5 text-primary font-medium">
            Treated as significant risk: <b>{counts.sig}</b>
          </span>
          <span className="px-3 py-1 rounded-md border border-border bg-card text-foreground font-medium">
            Total streams: <b>{data.streams.length}</b>
          </span>
        </div>

        {/* Revenue streams table */}
        <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
          <div className="px-6 py-3.5 bg-card border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Revenue streams &amp; inherent fraud risk</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                One row per stream. Assess likelihood and magnitude of fraud, then conclude on inherent risk and whether the stream is treated as a significant risk on Form 520.
              </p>
            </div>
            {!locked && (
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={addStream}>
                <Plus className="h-3.5 w-3.5" /> Add stream
              </Button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted border-b border-border">
                  <th className="px-3 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-10">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{ minWidth: 180 }}>Revenue stream</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{ minWidth: 220 }}>Description / nature of transaction</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider" style={{ width: 170 }}>Assertions</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{ width: 130 }}>Likelihood</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{ width: 130 }}>Magnitude</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{ width: 130 }}>Inherent risk</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{ width: 130 }}>Significant risk?</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{ minWidth: 200 }}>Rationale</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{ width: 90 }}>W/P ref.</th>
                  {!locked && <th className="px-2 py-3 w-8" />}
                </tr>
              </thead>
              <tbody>
                {data.streams.map((s, i) => (
                  <tr key={s.id} className="hover:bg-muted/50 transition-colors align-top border-b border-border last:border-b-0">
                    <td className="px-3 py-2 text-center font-mono">{i + 1}</td>
                    <td className="px-3 py-2">
                      <Input disabled={locked} value={s.name}
                        onChange={e => patchStream(s.id, { name: e.target.value })}
                        placeholder="e.g. Freight services"
                        className="h-8 text-xs" />
                    </td>
                    <td className="px-3 py-2">
                      <Textarea disabled={locked} value={s.description}
                        onChange={e => patchStream(s.id, { description: e.target.value })}
                        placeholder="Nature, timing, recognition policy…"
                        className="min-h-[60px] text-xs resize-none rounded-[10px]" />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {ASSERTION_OPTIONS.map(a => {
                          const active = s.assertions.includes(a.value);
                          return (
                            <button key={a.value} type="button" disabled={locked}
                              onClick={() => toggleAssertion(s.id, a.value)}
                              className={`px-2 py-0.5 rounded-md border text-[11px] font-mono transition-colors ${
                                active
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-card text-muted-foreground border-border hover:bg-muted"
                              }`}>
                              {a.value}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <Select disabled={locked} value={s.likelihood}
                        onValueChange={v => patchStream(s.id, { likelihood: v as Rating })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          {RATINGS.map(r => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Select disabled={locked} value={s.magnitude}
                        onValueChange={v => patchStream(s.id, { magnitude: v as Rating })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          {RATINGS.map(r => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Select disabled={locked} value={s.inherentRisk}
                        onValueChange={v => patchStream(s.id, { inherentRisk: v as Rating })}>
                        <SelectTrigger className={`h-8 text-xs ${ratingBadge(s.inherentRisk)}`}>
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent>
                          {RATINGS.map(r => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Select disabled={locked} value={s.significantRisk}
                        onValueChange={v => patchStream(s.id, { significantRisk: v as YN })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Y" className="text-xs">Yes</SelectItem>
                          <SelectItem value="N" className="text-xs">No</SelectItem>
                          <SelectItem value="NA" className="text-xs">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Textarea disabled={locked} value={s.rationale}
                        onChange={e => patchStream(s.id, { rationale: e.target.value })}
                        placeholder="Support the assessment…"
                        className="min-h-[60px] text-xs resize-none rounded-[10px]" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <RefButton
                        reference={s.wpRef}
                        onAttach={doc => patchStream(s.id, { wpRef: [...s.wpRef, doc] })}
                        onRemove={idx => patchStream(s.id, { wpRef: s.wpRef.filter((_, i2) => i2 !== idx) })}
                      />
                    </td>
                    {!locked && (
                      <td className="px-2 py-2 text-center">
                        <button onClick={() => removeStream(s.id)} className="text-muted-foreground hover:text-destructive">
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

        {/* Procedures table */}
        <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
          <div className="px-6 py-3.5 bg-card border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Basic procedures</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Complete each step. Document the P&amp;SA reference, W/P reference, whether the procedure was sufficient (PSC) and any exceptions or difficulties encountered.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{ minWidth: 220 }}>Procedure</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{ width: 120 }}>P&amp;SA</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{ width: 90 }}>W/P ref.</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap" style={{ width: 100 }}>PSC (Y/N)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider" style={{ minWidth: 360 }}>Exceptions / difficulties</th>
                </tr>
              </thead>
              <tbody>
                {data.procedures.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50 transition-colors align-top border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-foreground mb-0.5">{p.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{p.guidance}</p>
                    </td>
                    <td className="px-3 py-3">
                      <Input disabled={locked} value={p.psa}
                        onChange={e => patchProcedure(p.id, { psa: e.target.value })}
                        className="h-8 text-xs font-mono" />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <RefButton
                        reference={p.wpRef}
                        onAttach={doc => patchProcedure(p.id, { wpRef: [...p.wpRef, doc] })}
                        onRemove={idx => patchProcedure(p.id, { wpRef: p.wpRef.filter((_, i2) => i2 !== idx) })}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <Select disabled={locked} value={p.psc}
                        onValueChange={v => patchProcedure(p.id, { psc: v as YN })}>
                        <SelectTrigger className="h-8 text-xs w-20"><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Y" className="text-xs">Y</SelectItem>
                          <SelectItem value="N" className="text-xs">N</SelectItem>
                          <SelectItem value="NA" className="text-xs">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-3">
                      <Textarea disabled={locked} value={p.exceptions}
                        onChange={e => patchProcedure(p.id, { exceptions: e.target.value })}
                        placeholder="Summarize exceptions or difficulties encountered…"
                        className="min-h-[56px] text-xs resize-none rounded-[10px]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CAS 240 reminder */}
        <div className="bg-primary/[0.03] border border-primary/15 rounded-md p-4 text-xs text-foreground/85 space-y-1.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-primary" />
            <p className="font-semibold text-foreground">CAS 240 — Rebuttable presumption</p>
          </div>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>The auditor shall, based on the presumption that there are risks of fraud in revenue recognition, evaluate which types of revenue, revenue transactions or assertions give rise to such risks.</li>
            <li>If the presumption is rebutted, document the reasons (CAS 240.47).</li>
            <li>If a risk is identified, treat it as a significant risk and apply additional procedures on Form 705.</li>
          </ul>
        </div>

        {/* Presumption conclusion */}
        <div className="bg-card border border-border rounded-md p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Conclusion on the presumption of fraud risk</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Is a fraud risk in revenue recognition identified?</label>
              <Select disabled={locked} value={data.fraudRiskIdentified}
                onValueChange={v => setData(d => ({ ...d, fraudRiskIdentified: v as YN }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y" className="text-xs">Yes — significant risk recorded on Form 520</SelectItem>
                  <SelectItem value="N" className="text-xs">No — presumption rebutted</SelectItem>
                  <SelectItem value="NA" className="text-xs">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {data.fraudRiskIdentified === "N" ? "Rationale for rebutting the presumption" : "Rationale"}
              </label>
              <Textarea disabled={locked} value={data.rebuttalRationale}
                onChange={e => setData(d => ({ ...d, rebuttalRationale: e.target.value }))}
                placeholder="Document the reasons supporting the conclusion above."
                className="min-h-[60px] text-xs resize-none rounded-[10px]" />
            </div>
          </div>
        </div>

        {/* Overall audit conclusion */}
        <div className="bg-card border border-border rounded-md p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Overall audit conclusion</h3>
          <p className="text-[11px] text-muted-foreground">
            The audit evidence obtained is sufficient and appropriate to reduce the risk of material misstatement due to fraud in revenue recognition to an acceptably low level.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Conclusion</label>
              <Select disabled={locked} value={data.overallConclusion}
                onValueChange={v => setData(d => ({ ...d, overallConclusion: v as YSN }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y" className="text-xs">Y — Sufficient appropriate evidence</SelectItem>
                  <SelectItem value="S" className="text-xs">S — Some matters; addressed by response</SelectItem>
                  <SelectItem value="N" className="text-xs">N — Insufficient — escalation required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Rationale</label>
              <Input disabled={locked} value={data.conclusionRationale}
                onChange={e => setData(d => ({ ...d, conclusionRationale: e.target.value }))}
                placeholder="Briefly support the overall conclusion."
                className="h-8 text-xs" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-md p-5 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Notes</h3>
          <Textarea disabled={locked} value={data.notes}
            onChange={e => setData(d => ({ ...d, notes: e.target.value }))}
            placeholder="Additional observations, cross-references to Forms 520 / 705, follow-ups…"
            className="min-h-[90px] text-sm resize-none rounded-[10px]" />
        </div>

        {locked ? (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2.5 text-xs text-green-800 font-medium">
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
    </div>
  );
}
