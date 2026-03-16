import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Zap, ChevronDown, LayoutGrid, BarChart3, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

/* ── Static data matching the reference image ── */

const revenueRows = [
  { name: "Product", cy: "4,800.00", cyPct: "63.4", py1: "4,250.00", py1Pct: "63.3", py2: "3,700.00", py2Pct: "63.8", vs: "+12.9" },
  { name: "Services", cy: "1,950.00", cyPct: "25.8", py1: "1,720.00", py1Pct: "25.6", py2: "1,480.00", py2Pct: "25.5", vs: "+13.4" },
  { name: "Licenses", cy: "820.00", cyPct: "10.8", py1: "740.00", py1Pct: "11.0", py2: "620.00", py2Pct: "10.7", vs: "+10.8" },
];
const revenueTotals = { name: "Total Revenue", cy: "7,570.00", py1: "6,710.00", py2: "5,800.00", vs: "+12.8" };

const cosRows = [
  { name: "Cost of goods sold", cy: "2,650.00", cyPct: "35.0", py1: "2,400.00", py1Pct: "35.8", py2: "2,150.00", py2Pct: "37.1", vs: "+10.4" },
  { name: "Direct labour", cy: "780.00", cyPct: "10.3", py1: "720.00", py1Pct: "10.7", py2: "660.00", py2Pct: "11.4", vs: "+8.3" },
  { name: "Manufacturing OH", cy: "430.00", cyPct: "5.7", py1: "390.00", py1Pct: "5.8", py2: "350.00", py2Pct: "6.0", vs: "+10.3" },
];
const cosTotals = { name: "Total COS", cy: "3,860.00", py1: "3,510.00", py2: "3,160.00", vs: "+10.0" };

const marginRows = [
  { name: "Total Revenue", cy: "7,570.00", cyPct: "-", py1: "6,710.00", py1Pct: "-", py2: "5,800.00", py2Pct: "-", vs: "+12.9" },
  { name: "Cost of Sales", cy: "3,860.00", cyPct: "-", py1: "3,510.00", py1Pct: "-", py2: "3,160.00", py2Pct: "-", vs: "+13.4" },
];
const marginTotals = { name: "Gross Margin", cy: "3,710.00", cyPct: "49.0", py1: "3,200.00", py1Pct: "47.7", py2: "2,640.00", py2Pct: "45.5", vs: "+15.9" };

type ComparisonView = "cy-py1-py2" | "cy-py1";

const colsFull = ["Account Name ↓", "CY", "CY (%)", "PY1", "PY1 (%)", "PY2", "PY2 (%)", "CY vs PY1 (%)"];
const colsNoPy2 = ["Account Name ↓", "CY", "CY (%)", "PY1", "PY1 (%)", "CY vs PY1 (%)"];

function LukaIcon({ size = 16 }: { size?: number }) {
  return <Zap className="text-white" size={size} fill="white" strokeWidth={0} />;
}

/* ── Comparison View Dropdown ── */
function ComparisonDropdown({
  value,
  onChange,
}: {
  value: ComparisonView;
  onChange: (v: ComparisonView) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const label = value === "cy-py1-py2" ? "CY vs PY1 vs PY2" : "CY vs PY1";
  const options: { key: ComparisonView; label: string }[] = [
    { key: "cy-py1-py2", label: "CY vs PY1 vs PY2" },
    { key: "cy-py1", label: "CY vs PY1" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative flex items-center gap-2 h-10 pl-3 pr-2.5 rounded-[10px] border text-base transition-all duration-200",
          "bg-white border-[#dcdfe4] hover:border-[#074075]",
          "dark:bg-card dark:border-[hsl(220_15%_30%)] dark:hover:border-[#074075]",
          open && "border-[#074075] ring-2 ring-[#074075]/15"
        )}
      >
        {/* Floating label */}
        <span className="absolute -top-2.5 left-2.5 px-1 bg-white dark:bg-card text-[11px] text-muted-foreground whitespace-nowrap leading-none">
          Select Comparison View*
        </span>
        <span className="font-medium text-foreground whitespace-nowrap">{label}</span>
        <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform duration-200 text-[#074075]", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[220px] rounded-[10px] border border-[#074075] bg-popover shadow-lg animate-in fade-in zoom-in-95 duration-150">
          <div className="p-1.5">
            {options.map((opt) => (
              <button
                key={opt.key}
                onClick={() => { onChange(opt.key); setOpen(false); }}
                className={cn(
                  "flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                  "hover:bg-primary/[0.08] hover:scale-[1.01]",
                  value === opt.key && "bg-primary/[0.06] font-medium"
                )}
              >
                <span className="text-foreground">{opt.label}</span>
                {value === opt.key && (
                  <Check className="h-4 w-4 shrink-0" style={{ color: "#074075" }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Table section component ── */
function TableSection({
  title,
  rows,
  totals,
  visible,
  showPy2,
}: {
  title: string;
  rows: typeof revenueRows;
  totals: typeof revenueTotals & { cyPct?: string; py1Pct?: string; py2Pct?: string };
  visible: boolean;
  showPy2: boolean;
}) {
  if (!visible) return null;
  const cols = showPy2 ? colsFull : colsNoPy2;

  return (
    <div className="border border-[hsl(210_25%_82%)] rounded-lg overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-300 min-w-0">
      <div className="px-4 py-3 bg-[hsl(210_40%_96%)]">
        <span className="text-base font-semibold text-foreground">{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-[hsl(210_25%_82%)] bg-[hsl(210_40%_96%)]">
              {cols.map((c) => (
                <th key={c} className={cn("px-4 py-2.5 font-medium text-[#101D28] whitespace-nowrap", c === "Account Name ↓" ? "text-left" : "text-right")}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b border-[hsl(210_25%_82%)]/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2.5 text-foreground">{r.name}</td>
                <td className="px-4 py-2.5 text-right text-foreground tabular-nums">{r.cy}</td>
                <td className="px-4 py-2.5 text-right text-black tabular-nums">{r.cyPct}</td>
                <td className="px-4 py-2.5 text-right text-foreground tabular-nums">{r.py1}</td>
                <td className="px-4 py-2.5 text-right text-black tabular-nums">{r.py1Pct}</td>
                {showPy2 && <td className="px-4 py-2.5 text-right text-foreground tabular-nums">{r.py2}</td>}
                {showPy2 && <td className="px-4 py-2.5 text-right text-black tabular-nums">{r.py2Pct}</td>}
                <td className="px-4 py-2.5 text-right text-primary font-medium tabular-nums">{r.vs}</td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="bg-muted/30 font-semibold">
              <td className="px-4 py-2.5 text-black">{totals.name}</td>
              <td className="px-4 py-2.5 text-right text-black tabular-nums">{totals.cy}</td>
              <td className="px-4 py-2.5 text-right text-black tabular-nums">{totals.cyPct ?? ""}</td>
              <td className="px-4 py-2.5 text-right text-black tabular-nums">{totals.py1}</td>
              <td className="px-4 py-2.5 text-right text-black tabular-nums">{totals.py1Pct ?? ""}</td>
              {showPy2 && <td className="px-4 py-2.5 text-right text-black tabular-nums">{totals.py2}</td>}
              {showPy2 && <td className="px-4 py-2.5 text-right text-black tabular-nums">{totals.py2Pct ?? ""}</td>}
              <td className="px-4 py-2.5 text-right text-primary font-semibold tabular-nums">{totals.vs}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Luka Summary ── */
const summaryText = `Gross margin has demonstrated a consistent upward trajectory over the three-year period, improving from 45.5% in PY2 to 47.7% in PY1 and reaching 49.0% in the current year — a cumulative improvement of +350 basis points.`;

const keyDrivers = [
  "Revenue growth outpaced COGS growth across all three years. CY revenue grew +12.8% vs PY1, while COGS increased only +10.0%, creating favorable margin expansion.",
  "Product revenue remains the dominant contributor at 63.4% of total revenue, growing +12.9% YoY. This high-margin segment continues to drive overall margin improvement.",
  "Direct labour costs as a percentage of revenue declined from 11.4% (PY2) to 10.3% (CY), suggesting improved operational efficiency and potentially better automation or workforce utilization.",
  "Manufacturing overhead has remained well-controlled at 5.7% of revenue in CY, down from 6.0% in PY2, indicating effective cost management in production processes.",
];

const seasonality = [
  "Q2 and Q3 consistently deliver the strongest margins (50.0% and 50.5% in CY), while Q4 shows mild seasonal pressure at 47.0%. Monthly trends reveal slight softness in January–February, with peak performance in July–August.",
];

const outlook = [
  "The positive margin trend is sustainable if revenue mix continues to favor product sales and operational efficiencies in labour and overhead are maintained. Key risk factors include potential input cost inflation and capacity constraints during peak quarters.",
];

/* ── Main component with progressive reveal ── */

export interface GrossMarginResponseProps {
  /** 0-5 controls how many sections are visible (progressive) */
  revealStep: number;
}

export function GrossMarginResponse({ revealStep }: GrossMarginResponseProps) {
  const [periodTab, setPeriodTab] = useState<"annual" | "quarterly" | "monthly">("annual");
  const [comparison, setComparison] = useState<ComparisonView>("cy-py1-py2");
  const showPy2 = comparison === "cy-py1-py2";

  return (
    <div className="space-y-4 w-full min-w-0">
      {/* Intro text */}
      {revealStep >= 0 && (
        <p className="text-base text-foreground animate-in fade-in duration-300">
          Showing the Gross Margin Analysis with graphical presentation option:
        </p>
      )}

      {/* Period tabs + controls */}
      {revealStep >= 1 && (
        <div className="flex items-center justify-between flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-1 duration-300">
          {/* Tabs – underline style matching uploaded image */}
          <div className="flex items-center border border-border rounded-[10px] overflow-hidden">
            {(["annual", "quarterly", "monthly"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPeriodTab(tab)}
                className={cn(
                  "px-5 py-2 text-base font-medium transition-all duration-200 capitalize relative",
                  "hover:bg-muted/40",
                  periodTab === tab
                    ? "text-foreground font-semibold bg-muted/30"
                    : "text-muted-foreground"
                )}
              >
                {tab}
                {/* Active underline */}
                {periodTab === tab && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-foreground rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ComparisonDropdown value={comparison} onChange={setComparison} />
            <div className="flex items-center gap-1 ml-2">
              <button className="p-1.5 rounded hover:bg-muted/50 transition-colors">
                <LayoutGrid className="h-4 w-4 text-muted-foreground" />
              </button>
              <Switch className="data-[state=checked]:bg-primary" />
              <button className="p-1.5 rounded hover:bg-muted/50 transition-colors">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Accounts */}
      <TableSection title="Revenue Accounts" rows={revenueRows} totals={revenueTotals} visible={revealStep >= 2} showPy2={showPy2} />

      {/* Cost of Sales Accounts */}
      <TableSection title="Cost of Sales Accounts" rows={cosRows} totals={cosTotals} visible={revealStep >= 3} showPy2={showPy2} />

      {/* Gross Margin Summary */}
      <TableSection title="Gross Margin Summary" rows={marginRows} totals={marginTotals} visible={revealStep >= 4} showPy2={showPy2} />

      {/* Luka Summary */}
      {revealStep >= 5 && (
        <div className="border border-border rounded-lg bg-muted/20 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(265_80%_55%)] flex items-center justify-center">
              <LukaIcon size={12} />
            </div>
            <span className="text-base font-semibold text-foreground">Luka Summary</span>
          </div>

          <p className="text-base text-foreground leading-relaxed">{summaryText}</p>

          <div>
            <p className="text-base font-semibold text-foreground mb-2">Key Drivers:</p>
            <ul className="space-y-2 text-base text-foreground leading-relaxed list-disc pl-5">
              {keyDrivers.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-base font-semibold text-foreground mb-2">Seasonality:</p>
            <ul className="space-y-2 text-base text-foreground leading-relaxed list-disc pl-5">
              {seasonality.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-base font-semibold text-foreground mb-2">Outlook:</p>
            <ul className="space-y-2 text-base text-foreground leading-relaxed list-disc pl-5">
              {outlook.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
