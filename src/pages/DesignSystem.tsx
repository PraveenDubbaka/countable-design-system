import React, { useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

/* ─── helpers ─── */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/* ─── data ─── */
interface Token { css: string; label: string; hsl: string; hex: string; }

const core: Token[] = [
  { css: "--background",           label: "Background",          hsl: "0 0% 100%",      hex: "#FFFFFF" },
  { css: "--foreground",           label: "Foreground",          hsl: "213 50% 15%",    hex: "#132640" },
  { css: "--primary",              label: "Primary",             hsl: "207 71% 38%",    hex: "#1C63A6" },
  { css: "--primary-foreground",   label: "Primary FG",          hsl: "0 0% 100%",      hex: "#FFFFFF" },
  { css: "--secondary",            label: "Secondary",           hsl: "210 30% 90%",    hex: "#DDE4EB" },
  { css: "--secondary-foreground", label: "Secondary FG",        hsl: "210 30% 15%",    hex: "#1B2430" },
  { css: "--muted",                label: "Muted",               hsl: "210 40% 96%",    hex: "#EFF3F8" },
  { css: "--muted-foreground",     label: "Muted FG",            hsl: "213 50% 15%",    hex: "#132640" },
  { css: "--accent",               label: "Accent (Tertiary)",   hsl: "213 76% 19%",    hex: "#0A3159" },
  { css: "--accent-foreground",    label: "Accent FG",           hsl: "0 0% 100%",      hex: "#FFFFFF" },
  { css: "--destructive",          label: "Destructive",         hsl: "0 75% 42%",      hex: "#BB1B1B" },
  { css: "--destructive-foreground",label: "Destructive FG",     hsl: "0 0% 100%",      hex: "#FFFFFF" },
  { css: "--border",               label: "Border",              hsl: "210 30% 82%",    hex: "#C3CDD9" },
  { css: "--ring",                 label: "Ring",                hsl: "207 71% 38%",    hex: "#1C63A6" },
  { css: "--card",                 label: "Card",                hsl: "0 0% 100%",      hex: "#FFFFFF" },
  { css: "--popover",              label: "Popover",             hsl: "0 0% 100%",      hex: "#FFFFFF" },
];

const brand: Token[] = [
  { css: "--countable-blue",       label: "Countable Blue",      hsl: "207 71% 38%",    hex: "#1C63A6" },
  { css: "--countable-blue-light", label: "Countable Blue Light", hsl: "207 78% 55%",   hex: "#3B94D9" },
  { css: "--countable-blue-dark",  label: "Countable Blue Dark", hsl: "207 78% 28%",    hex: "#0F4A7F" },
  { css: "--countable-teal",       label: "Countable Teal",      hsl: "180 50% 45%",    hex: "#39ADAD" },
  { css: "--countable-navy",       label: "Countable Navy",      hsl: "213 76% 19%",    hex: "#0A3159" },
];

const surfaces: Token[] = [
  { css: "--m3-surface",                   label: "Surface",              hsl: "0 0% 100%",    hex: "#FFFFFF" },
  { css: "--m3-surface-variant",           label: "Surface Variant",      hsl: "210 40% 96%",  hex: "#EFF3F8" },
  { css: "--m3-surface-container-lowest",  label: "Container Lowest",     hsl: "0 0% 100%",    hex: "#FFFFFF" },
  { css: "--m3-surface-container-low",     label: "Container Low",        hsl: "210 50% 98%",  hex: "#F5F8FC" },
  { css: "--m3-surface-container",         label: "Container",            hsl: "210 45% 96%",  hex: "#EEF3F9" },
  { css: "--m3-surface-container-high",    label: "Container High",       hsl: "210 40% 94%",  hex: "#E7ECF2" },
  { css: "--m3-surface-container-highest", label: "Container Highest",    hsl: "210 35% 92%",  hex: "#E0E6ED" },
];

const sidebar: Token[] = [
  { css: "--sidebar-bg",         label: "Sidebar BG",         hsl: "213 76% 19%",  hex: "#0A3159" },
  { css: "--sidebar-foreground", label: "Sidebar FG",         hsl: "0 0% 100%",    hex: "#FFFFFF" },
  { css: "--sidebar-muted",      label: "Sidebar Muted",      hsl: "213 60% 28%",  hex: "#1B4472" },
  { css: "--sidebar-accent",     label: "Sidebar Accent",     hsl: "207 71% 38%",  hex: "#1C63A6" },
];

const borders: Token[] = [
  { css: "--border-dark-blue", label: "Border Dark Blue",  hsl: "213 60% 30%",  hex: "#1E4B7A" },
  { css: "--border-light",     label: "Border Light",      hsl: "210 20% 85%",  hex: "#D2D8DE" },
  { css: "--border-subtle",    label: "Border Subtle",     hsl: "210 15% 75%",  hex: "#B5BCC3" },
  { css: "--border-focus",     label: "Border Focus",      hsl: "207 71% 45%",  hex: "#2272BD" },
  { css: "--border-lighter",   label: "Border Lighter",    hsl: "210 20% 90%",  hex: "#E0E5EA" },
  { css: "--border-category",  label: "Border Category",   hsl: "210 22% 82%",  hex: "#C5CDD5" },
];

const tooltipTokens: Token[] = [
  { css: "--tooltip-bg",         label: "Tooltip BG",         hsl: "210 45% 96%",  hex: "#EEF3F9" },
  { css: "--tooltip-foreground", label: "Tooltip FG",         hsl: "213 50% 20%",  hex: "#1A3350" },
  { css: "--tooltip-border",     label: "Tooltip Border",     hsl: "210 35% 85%",  hex: "#CDD6DF" },
];

const radii = [
  { token: "--radius-xs",     value: "6px",     usage: "Tiny corners" },
  { token: "--radius-sm",     value: "10px",    usage: "Inputs / form elements" },
  { token: "--radius-md",     value: "12px",    usage: "Cards / dropdowns" },
  { token: "--radius-button", value: "12px",    usage: "Buttons" },
  { token: "--radius-lg",     value: "20px",    usage: "Main cockpit layout" },
  { token: "--radius-xl",     value: "24px",    usage: "Large panels" },
  { token: "--radius-full",   value: "9999px",  usage: "Pills / circles" },
];

const elevations = [
  { name: "Elevation 1", token: "--elevation-1", desc: "Subtle lift (cards)" },
  { name: "Elevation 2", token: "--elevation-2", desc: "Moderate lift (dropdowns)" },
  { name: "Elevation 3", token: "--elevation-3", desc: "Prominent (menus)" },
  { name: "Elevation 4", token: "--elevation-4", desc: "Strong (dialogs)" },
  { name: "Elevation 5", token: "--elevation-5", desc: "Max (tooltips / FAB)" },
];

const typography = [
  { name: "Display Large",  size: "60px", weight: "700", tracking: "-0.03em" },
  { name: "Display Medium", size: "48px", weight: "700", tracking: "-0.025em" },
  { name: "Display Small",  size: "40px", weight: "600", tracking: "-0.02em" },
  { name: "Headline Large", size: "34px", weight: "600", tracking: "-0.015em" },
  { name: "Headline Med",   size: "30px", weight: "600", tracking: "-0.01em" },
  { name: "Headline Small", size: "26px", weight: "600", tracking: "0" },
  { name: "Title Large",    size: "24px", weight: "600", tracking: "0" },
  { name: "Title Medium",   size: "18px", weight: "600", tracking: "0.01em" },
  { name: "Title Small",    size: "16px", weight: "600", tracking: "0.01em" },
  { name: "Body Large",     size: "17px", weight: "400", tracking: "0.015em" },
  { name: "Body Medium",    size: "15px", weight: "400", tracking: "0.01em" },
  { name: "Body Small",     size: "13px", weight: "400", tracking: "0.02em" },
  { name: "Label Large",    size: "15px", weight: "500", tracking: "0.02em" },
  { name: "Label Medium",   size: "13px", weight: "500", tracking: "0.03em" },
  { name: "Label Small",    size: "12px", weight: "500", tracking: "0.04em" },
];

const spacing = [
  { token: "--spacing-xs",  value: "8px (0.5rem)" },
  { token: "--spacing-sm",  value: "12px (0.75rem)" },
  { token: "--spacing-md",  value: "16px (1rem)" },
  { token: "--spacing-lg",  value: "24px (1.5rem)" },
  { token: "--spacing-xl",  value: "32px (2rem)" },
  { token: "--spacing-2xl", value: "40px (2.5rem)" },
  { token: "--spacing-3xl", value: "48px (3rem)" },
];

/* ─── components ─── */
function Swatch({ token }: { token: Token }) {
  const copy = () => { navigator.clipboard.writeText(token.css); toast({ title: "Copied", description: token.css }); };
  return (
    <button onClick={copy} className="group flex items-center gap-3 rounded-md p-2 text-left hover:bg-muted transition-colors w-full">
      <div className="h-10 w-10 shrink-0 rounded-md border border-border" style={{ background: `hsl(${token.hsl})` }} />
      <div className="min-w-0 flex-1">
        <p className="text-body-sm font-medium truncate">{token.label}</p>
        <p className="text-label-sm text-muted-foreground font-mono">{token.css}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-label-sm font-mono">{token.hex}</p>
        <p className="text-label-sm text-muted-foreground font-mono">{token.hsl}</p>
      </div>
      <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-title-md text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function ColorGrid({ tokens }: { tokens: Token[] }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-muted rounded-lg p-1">{tokens.map(t => <Swatch key={t.css} token={t} />)}</div>;
}

export default function DesignSystem() {
  const handleDownload = useCallback(() => {
    const payload = {
      meta: { generatedAt: new Date().toISOString(), font: "Inter", baseFontSize: "15px" },
      semanticColors: Object.fromEntries(core.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      brandColors: Object.fromEntries(brand.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      surfaces: Object.fromEntries(surfaces.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      sidebar: Object.fromEntries(sidebar.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      borders: Object.fromEntries(borders.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      tooltips: Object.fromEntries(tooltipTokens.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      borderRadius: Object.fromEntries(radii.map(r => [r.token, { value: r.value, usage: r.usage }])),
      elevation: Object.fromEntries(elevations.map(e => [e.token, { name: e.name, desc: e.desc }])),
      typography: typography,
      spacing: Object.fromEntries(spacing.map(s => [s.token, s.value])),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "design-system-tokens.json"; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "design-system-tokens.json" });
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-headline-sm text-foreground">Design System</h1>
            <p className="text-body-sm text-muted-foreground mt-1">All tokens, colors, typography, spacing &amp; elevation specs.</p>
          </div>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" /> Download JSON
          </Button>
        </div>

        {/* Semantic Colors */}
        <Section title="Semantic Colors (Light Mode)">
          <ColorGrid tokens={core} />
        </Section>

        {/* Brand */}
        <Section title="Brand Colors">
          <ColorGrid tokens={brand} />
        </Section>

        {/* Surfaces */}
        <Section title="Surface Containers">
          <ColorGrid tokens={surfaces} />
        </Section>

        {/* Sidebar */}
        <Section title="Sidebar">
          <ColorGrid tokens={sidebar} />
        </Section>

        {/* Borders */}
        <Section title="Border Tokens">
          <ColorGrid tokens={borders} />
        </Section>

        {/* Tooltips */}
        <Section title="Tooltip Tokens">
          <ColorGrid tokens={tooltipTokens} />
        </Section>

        {/* Border Radius */}
        <Section title="Border Radius">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {radii.map(r => (
              <div key={r.token} className="flex items-center gap-3 p-3 rounded-md bg-muted">
                <div className="h-10 w-10 border-2 border-primary" style={{ borderRadius: r.value }} />
                <div>
                  <p className="text-body-sm font-medium font-mono">{r.token}</p>
                  <p className="text-label-sm text-muted-foreground">{r.value} — {r.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Elevation */}
        <Section title="Elevation System">
          <div className="flex flex-wrap gap-6">
            {elevations.map(e => (
              <div key={e.token} className="h-20 w-28 rounded-lg bg-card flex flex-col items-center justify-center" style={{ boxShadow: `var(${e.token})` }}>
                <p className="text-label-md font-medium">{e.name}</p>
                <p className="text-label-sm text-muted-foreground">{e.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography Scale">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-body-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Size</th>
                  <th className="text-left p-3 font-medium">Weight</th>
                  <th className="text-left p-3 font-medium">Tracking</th>
                  <th className="text-left p-3 font-medium">Preview</th>
                </tr>
              </thead>
              <tbody>
                {typography.map(t => (
                  <tr key={t.name} className="border-t border-border">
                    <td className="p-3 font-mono text-label-sm">{t.name}</td>
                    <td className="p-3">{t.size}</td>
                    <td className="p-3">{t.weight}</td>
                    <td className="p-3">{t.tracking}</td>
                    <td className="p-3"><span style={{ fontSize: t.size, fontWeight: Number(t.weight), letterSpacing: t.tracking }}>Ag</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Spacing */}
        <Section title="Spacing Scale">
          <div className="space-y-2">
            {spacing.map(s => (
              <div key={s.token} className="flex items-center gap-4">
                <span className="w-32 text-label-sm font-mono shrink-0">{s.token}</span>
                <div className="h-4 bg-primary rounded-xs" style={{ width: s.value.split("(")[0].trim() }} />
                <span className="text-label-sm text-muted-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </Layout>
  );
}
