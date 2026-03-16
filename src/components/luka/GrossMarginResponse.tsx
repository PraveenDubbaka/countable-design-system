import { useState } from "react";
import { cn } from "@/lib/utils";
import { Zap, ChevronDown, LayoutGrid, BarChart3 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

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

const cols = ["Account Name ↓", "CY", "CY (%)", "PY1", "PY1 (%)", "PY2", "PY2 (%)", "CY vs PY1 (%)"];

function LukaIcon({ size = 16 }: { size?: number }) {
  return <Zap className="text-white" size={size} fill="white" strokeWidth={0} />;
}

/* ── Table section component ── */
function TableSection({
  title,
  rows,
  totals,
  visible,
}: {
  title: string;
  rows: typeof revenueRows;
  totals: typeof revenueTotals & { cyPct?: string; py1Pct?: string; py2Pct?: string };
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div className="border border-[hsl(210_25%_82%)] rounded-lg overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-300">
      <div className="px-4 py-3 bg-[hsl(210_40%_96%)]">
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[hsl(210_25%_82%)] bg-[hsl(210_40%_96%)]">
              {cols.map((c) => (
                <th key={c} className={cn("px-4 py-2.5 font-medium text-muted-foreground whitespace-nowrap", c === "Account Name ↓" ? "text-left" : "text-right")}>
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
                <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{r.cyPct}</td>
                <td className="px-4 py-2.5 text-right text-foreground tabular-nums">{r.py1}</td>
                <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{r.py1Pct}</td>
                <td className="px-4 py-2.5 text-right text-foreground tabular-nums">{r.py2}</td>
                <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{r.py2Pct}</td>
                <td className="px-4 py-2.5 text-right text-primary font-medium tabular-nums">{r.vs}</td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="bg-muted/30 font-semibold">
              <td className="px-4 py-2.5 text-foreground">{totals.name}</td>
              <td className="px-4 py-2.5 text-right text-foreground tabular-nums">{totals.cy}</td>
              <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{totals.cyPct ?? ""}</td>
              <td className="px-4 py-2.5 text-right text-foreground tabular-nums">{totals.py1}</td>
              <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{totals.py1Pct ?? ""}</td>
              <td className="px-4 py-2.5 text-right text-foreground tabular-nums">{totals.py2}</td>
              <td className="px-4 py-2.5 text-right text-muted-foreground tabular-nums">{totals.py2Pct ?? ""}</td>
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

  return (
    <div className="space-y-4 w-full">
      {/* Intro text */}
      {revealStep >= 0 && (
        <p className="text-sm text-foreground animate-in fade-in duration-300">
          Showing the Gross Margin Analysis with graphical presentation option:
        </p>
      )}

      {/* Period tabs + controls */}
      {revealStep >= 1 && (
        <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-1 duration-300">
          <div className="flex items-center gap-0">
            {(["annual", "quarterly", "monthly"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPeriodTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize",
                  periodTab === tab
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border text-sm text-foreground">
              <span className="text-xs text-muted-foreground">Select Comparison View*</span>
              <span className="font-medium">CY vs PY1 vs PY2</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
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
      <TableSection
        title="Revenue Accounts"
        rows={revenueRows}
        totals={revenueTotals}
        visible={revealStep >= 2}
      />

      {/* Cost of Sales Accounts */}
      <TableSection
        title="Cost of Sales Accounts"
        rows={cosRows}
        totals={cosTotals}
        visible={revealStep >= 3}
      />

      {/* Gross Margin Summary */}
      <TableSection
        title="Gross Margin Summary"
        rows={marginRows}
        totals={marginTotals}
        visible={revealStep >= 4}
      />

      {/* Luka Summary */}
      {revealStep >= 5 && (
        <div className="border border-border rounded-lg bg-muted/20 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(265_80%_55%)] flex items-center justify-center">
              <LukaIcon size={12} />
            </div>
            <span className="text-sm font-semibold text-foreground">Luka Summary</span>
          </div>

          <p className="text-sm text-foreground leading-relaxed">{summaryText}</p>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Key Drivers:</p>
            <ul className="space-y-2 text-sm text-foreground leading-relaxed list-disc pl-5">
              {keyDrivers.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Seasonality:</p>
            <ul className="space-y-2 text-sm text-foreground leading-relaxed list-disc pl-5">
              {seasonality.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Outlook:</p>
            <ul className="space-y-2 text-sm text-foreground leading-relaxed list-disc pl-5">
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
