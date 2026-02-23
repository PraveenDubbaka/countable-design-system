import React, { useCallback, useState } from "react";
import { Layout } from "@/components/Layout";
import { Copy, Download, Plus, Trash2, Search, Bell, Settings, ChevronRight, Mail, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, InputFilled } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

/* ─── data ─── */
interface Token { css: string; label: string; hsl: string; hex: string; }

const core: Token[] = [
  { css: "--background", label: "Background", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--foreground", label: "Foreground", hsl: "213 50% 15%", hex: "#132640" },
  { css: "--primary", label: "Primary", hsl: "207 71% 38%", hex: "#1C63A6" },
  { css: "--primary-foreground", label: "Primary FG", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--secondary", label: "Secondary", hsl: "210 30% 90%", hex: "#DDE4EB" },
  { css: "--secondary-foreground", label: "Secondary FG", hsl: "210 30% 15%", hex: "#1B2430" },
  { css: "--muted", label: "Muted", hsl: "210 40% 96%", hex: "#EFF3F8" },
  { css: "--muted-foreground", label: "Muted FG", hsl: "213 50% 15%", hex: "#132640" },
  { css: "--accent", label: "Accent (Tertiary)", hsl: "213 76% 19%", hex: "#0A3159" },
  { css: "--accent-foreground", label: "Accent FG", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--destructive", label: "Destructive", hsl: "0 75% 42%", hex: "#BB1B1B" },
  { css: "--destructive-foreground", label: "Destructive FG", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--border", label: "Border", hsl: "210 30% 82%", hex: "#C3CDD9" },
  { css: "--ring", label: "Ring", hsl: "207 71% 38%", hex: "#1C63A6" },
  { css: "--card", label: "Card", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--popover", label: "Popover", hsl: "0 0% 100%", hex: "#FFFFFF" },
];

const darkCore: Token[] = [
  { css: "--background", label: "Background", hsl: "220 25% 8%", hex: "#121720" },
  { css: "--foreground", label: "Foreground", hsl: "220 15% 90%", hex: "#E2E5EA" },
  { css: "--primary", label: "Primary", hsl: "207 80% 70%", hex: "#70B8F0" },
  { css: "--primary-foreground", label: "Primary FG", hsl: "207 80% 20%", hex: "#0A3B5C" },
  { css: "--secondary", label: "Secondary", hsl: "210 25% 25%", hex: "#303B48" },
  { css: "--secondary-foreground", label: "Secondary FG", hsl: "210 30% 90%", hex: "#DDE4EB" },
  { css: "--muted", label: "Muted", hsl: "220 20% 18%", hex: "#262D38" },
  { css: "--muted-foreground", label: "Muted FG", hsl: "220 15% 70%", hex: "#A8AEB6" },
  { css: "--accent", label: "Accent (Tertiary)", hsl: "213 60% 75%", hex: "#8FBDE6" },
  { css: "--destructive", label: "Destructive", hsl: "0 85% 75%", hex: "#F09090" },
  { css: "--border", label: "Border", hsl: "220 15% 30%", hex: "#434B57" },
  { css: "--card", label: "Card", hsl: "220 25% 10%", hex: "#161D28" },
  { css: "--popover", label: "Popover", hsl: "220 25% 13%", hex: "#1C2430" },
];

const brand: Token[] = [
  { css: "--countable-blue", label: "Countable Blue", hsl: "207 71% 38%", hex: "#1C63A6" },
  { css: "--countable-blue-light", label: "Countable Blue Light", hsl: "207 78% 55%", hex: "#3B94D9" },
  { css: "--countable-blue-dark", label: "Countable Blue Dark", hsl: "207 78% 28%", hex: "#0F4A7F" },
  { css: "--countable-teal", label: "Countable Teal", hsl: "180 50% 45%", hex: "#39ADAD" },
  { css: "--countable-navy", label: "Countable Navy", hsl: "213 76% 19%", hex: "#0A3159" },
];

const m3Palette: Token[] = [
  { css: "--m3-primary", label: "M3 Primary", hsl: "207 71% 38%", hex: "#1C63A6" },
  { css: "--m3-on-primary", label: "M3 On Primary", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--m3-primary-container", label: "M3 Primary Container", hsl: "207 78% 90%", hex: "#D4ECFC" },
  { css: "--m3-on-primary-container", label: "M3 On Primary Container", hsl: "207 80% 20%", hex: "#0A3B5C" },
  { css: "--m3-secondary", label: "M3 Secondary", hsl: "210 25% 40%", hex: "#4D6070" },
  { css: "--m3-on-secondary", label: "M3 On Secondary", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--m3-secondary-container", label: "M3 Secondary Container", hsl: "210 30% 90%", hex: "#DDE4EB" },
  { css: "--m3-tertiary", label: "M3 Tertiary", hsl: "213 76% 19%", hex: "#0A3159" },
  { css: "--m3-on-tertiary", label: "M3 On Tertiary", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--m3-tertiary-container", label: "M3 Tertiary Container", hsl: "213 60% 85%", hex: "#B5D0EC" },
  { css: "--m3-error", label: "M3 Error", hsl: "0 75% 42%", hex: "#BB1B1B" },
  { css: "--m3-error-container", label: "M3 Error Container", hsl: "0 85% 92%", hex: "#FCDADA" },
];

const surfaces: Token[] = [
  { css: "--m3-surface", label: "Surface", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--m3-surface-variant", label: "Surface Variant", hsl: "210 40% 96%", hex: "#EFF3F8" },
  { css: "--m3-surface-container-lowest", label: "Container Lowest", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--m3-surface-container-low", label: "Container Low", hsl: "210 50% 98%", hex: "#F5F8FC" },
  { css: "--m3-surface-container", label: "Container", hsl: "210 45% 96%", hex: "#EEF3F9" },
  { css: "--m3-surface-container-high", label: "Container High", hsl: "210 40% 94%", hex: "#E7ECF2" },
  { css: "--m3-surface-container-highest", label: "Container Highest", hsl: "210 35% 92%", hex: "#E0E6ED" },
];

const sidebar: Token[] = [
  { css: "--sidebar-bg", label: "Sidebar BG", hsl: "213 76% 19%", hex: "#0A3159" },
  { css: "--sidebar-foreground", label: "Sidebar FG", hsl: "0 0% 100%", hex: "#FFFFFF" },
  { css: "--sidebar-muted", label: "Sidebar Muted", hsl: "213 60% 28%", hex: "#1B4472" },
  { css: "--sidebar-accent", label: "Sidebar Accent", hsl: "207 71% 38%", hex: "#1C63A6" },
];

const borders: Token[] = [
  { css: "--border-dark-blue", label: "Border Dark Blue", hsl: "213 60% 30%", hex: "#1E4B7A" },
  { css: "--border-light", label: "Border Light", hsl: "210 20% 85%", hex: "#D2D8DE" },
  { css: "--border-subtle", label: "Border Subtle", hsl: "210 15% 75%", hex: "#B5BCC3" },
  { css: "--border-focus", label: "Border Focus", hsl: "207 71% 45%", hex: "#2272BD" },
  { css: "--border-lighter", label: "Border Lighter", hsl: "210 20% 90%", hex: "#E0E5EA" },
  { css: "--border-category", label: "Border Category", hsl: "210 22% 82%", hex: "#C5CDD5" },
];

const tooltipTokens: Token[] = [
  { css: "--tooltip-bg", label: "Tooltip BG", hsl: "210 45% 96%", hex: "#EEF3F9" },
  { css: "--tooltip-foreground", label: "Tooltip FG", hsl: "213 50% 20%", hex: "#1A3350" },
  { css: "--tooltip-border", label: "Tooltip Border", hsl: "210 35% 85%", hex: "#CDD6DF" },
];

const dropzone: Token[] = [
  { css: "--dropzone-bg", label: "Dropzone BG", hsl: "207 78% 98%", hex: "#F5FAFF" },
  { css: "--dropzone-border", label: "Dropzone Border", hsl: "207 78% 70%", hex: "#6DB8F0" },
  { css: "--dropzone-hover", label: "Dropzone Hover", hsl: "207 78% 95%", hex: "#E8F4FF" },
];

const glowGlass: Token[] = [
  { css: "--glow-primary", label: "Glow Primary", hsl: "207 71% 38% / 0.15", hex: "—" },
  { css: "--glow-primary-strong", label: "Glow Primary Strong", hsl: "207 71% 38% / 0.25", hex: "—" },
  { css: "--glow-accent", label: "Glow Accent", hsl: "213 76% 19% / 0.15", hex: "—" },
];

const hardcoded: Token[] = [
  { css: "#f1f1f3", label: "Panel Surface", hsl: "240 5% 95%", hex: "#F1F1F3" },
  { css: "#dcdfe4", label: "Input Border", hsl: "220 12% 87%", hex: "#DCDFE4" },
  { css: "#101828", label: "Strong Text", hsl: "220 26% 12%", hex: "#101828" },
];

const radii = [
  { token: "--radius-xs", value: "6px", usage: "Tiny corners" },
  { token: "--radius-sm", value: "10px", usage: "Inputs / form elements" },
  { token: "--radius-md", value: "12px", usage: "Cards / dropdowns" },
  { token: "--radius-button", value: "12px", usage: "Buttons" },
  { token: "--radius-lg", value: "20px", usage: "Main cockpit layout" },
  { token: "--radius-xl", value: "24px", usage: "Large panels" },
  { token: "--radius-full", value: "9999px", usage: "Pills / circles" },
];

const elevations = [
  { name: "Elevation 1", token: "--elevation-1", desc: "Subtle lift (cards)" },
  { name: "Elevation 2", token: "--elevation-2", desc: "Moderate lift (dropdowns)" },
  { name: "Elevation 3", token: "--elevation-3", desc: "Prominent (menus)" },
  { name: "Elevation 4", token: "--elevation-4", desc: "Strong (dialogs)" },
  { name: "Elevation 5", token: "--elevation-5", desc: "Max (tooltips / FAB)" },
];

const typography = [
  { name: "Display Large", size: "60px", weight: "700", tracking: "-0.03em" },
  { name: "Display Medium", size: "48px", weight: "700", tracking: "-0.025em" },
  { name: "Display Small", size: "40px", weight: "600", tracking: "-0.02em" },
  { name: "Headline Large", size: "34px", weight: "600", tracking: "-0.015em" },
  { name: "Headline Med", size: "30px", weight: "600", tracking: "-0.01em" },
  { name: "Headline Small", size: "26px", weight: "600", tracking: "0" },
  { name: "Title Large", size: "24px", weight: "600", tracking: "0" },
  { name: "Title Medium", size: "18px", weight: "600", tracking: "0.01em" },
  { name: "Title Small", size: "16px", weight: "600", tracking: "0.01em" },
  { name: "Body Large", size: "17px", weight: "400", tracking: "0.015em" },
  { name: "Body Medium", size: "15px", weight: "400", tracking: "0.01em" },
  { name: "Body Small", size: "13px", weight: "400", tracking: "0.02em" },
  { name: "Label Large", size: "15px", weight: "500", tracking: "0.02em" },
  { name: "Label Medium", size: "13px", weight: "500", tracking: "0.03em" },
  { name: "Label Small", size: "12px", weight: "500", tracking: "0.04em" },
  { name: "Financial", size: "14px", weight: "400", tracking: "0" },
];

const spacing = [
  { token: "--spacing-xs", value: "8px (0.5rem)" },
  { token: "--spacing-sm", value: "12px (0.75rem)" },
  { token: "--spacing-md", value: "16px (1rem)" },
  { token: "--spacing-lg", value: "24px (1.5rem)" },
  { token: "--spacing-xl", value: "32px (2rem)" },
  { token: "--spacing-2xl", value: "40px (2.5rem)" },
  { token: "--spacing-3xl", value: "48px (3rem)" },
];

const stateLayer = [
  { name: "Hover", token: "--state-hover", value: "0.08 (8%)" },
  { name: "Focus", token: "--state-focus", value: "0.12 (12%)" },
  { name: "Pressed", token: "--state-pressed", value: "0.12 (12%)" },
  { name: "Dragged", token: "--state-dragged", value: "0.16 (16%)" },
];

const motionEasing = [
  { name: "Emphasized", value: "cubic-bezier(0.2, 0, 0, 1)", usage: "Default transitions" },
  { name: "Emphasized Decelerate", value: "cubic-bezier(0.05, 0.7, 0.1, 1)", usage: "Enter animations" },
  { name: "Emphasized Accelerate", value: "cubic-bezier(0.3, 0, 0.8, 0.15)", usage: "Exit animations" },
  { name: "Standard", value: "cubic-bezier(0.2, 0, 0, 1)", usage: "Simple transitions" },
];

const motionDurations = [
  { name: "Short 1–4", value: "50–200ms", usage: "Micro-interactions, ripples" },
  { name: "Medium 1–4", value: "250–400ms", usage: "Standard transitions, expand/collapse" },
  { name: "Long 1–4", value: "450–600ms", usage: "Complex transitions, page changes" },
  { name: "Extra Long 1–4", value: "700–1000ms", usage: "Full-page transitions, onboarding" },
];

/* ─── components ─── */
function Swatch({ token }: { token: Token }) {
  const copy = () => { navigator.clipboard.writeText(token.css); toast({ title: "Copied", description: token.css }); };
  const isGlow = token.hex === "—";
  return (
    <button onClick={copy} className="group flex items-center gap-3 rounded-md p-2 text-left hover:bg-muted transition-colors w-full">
      <div
        className="h-10 w-10 shrink-0 rounded-md border border-border"
        style={isGlow ? { background: "hsl(var(--background))", boxShadow: `0 0 20px hsl(${token.hsl})` } : { background: `hsl(${token.hsl})` }}
      />
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

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-3 scroll-mt-24">
      <h3 className="text-title-md text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function ColorGrid({ tokens }: { tokens: Token[] }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-muted rounded-lg p-1">{tokens.map(t => <Swatch key={t.css + t.label} token={t} />)}</div>;
}

function SampleCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <h4 className="text-title-sm text-foreground">{title}</h4>
      {children}
    </div>
  );
}

/* ─── table of contents ─── */
const tocItems = [
  { id: "semantic-light", label: "Semantic (Light)" },
  { id: "semantic-dark", label: "Semantic (Dark)" },
  { id: "brand", label: "Brand" },
  { id: "m3-palette", label: "M3 Palette" },
  { id: "surfaces", label: "Surfaces" },
  { id: "sidebar", label: "Sidebar" },
  { id: "borders", label: "Borders" },
  { id: "tooltips", label: "Tooltips" },
  { id: "dropzone", label: "Dropzone" },
  { id: "glow-glass", label: "Glow & Glass" },
  { id: "hardcoded", label: "Hardcoded Values" },
  { id: "state-layers", label: "State Layers" },
  { id: "radius", label: "Border Radius" },
  { id: "elevation", label: "Elevation" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "motion", label: "Motion & Easing" },
  { id: "components", label: "Component Samples" },
];

export default function DesignSystem() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);

  const handleDownload = useCallback(() => {
    const payload = {
      meta: { generatedAt: new Date().toISOString(), font: "Inter", baseFontSize: "15px" },
      semanticColors: {
        light: Object.fromEntries(core.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
        dark: Object.fromEntries(darkCore.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      },
      brandColors: Object.fromEntries(brand.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      m3Palette: Object.fromEntries(m3Palette.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      surfaces: Object.fromEntries(surfaces.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      sidebar: Object.fromEntries(sidebar.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      borders: Object.fromEntries(borders.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      tooltips: Object.fromEntries(tooltipTokens.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      dropzone: Object.fromEntries(dropzone.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      glowGlass: Object.fromEntries(glowGlass.map(t => [t.css, { hsl: t.hsl, label: t.label }])),
      hardcodedValues: Object.fromEntries(hardcoded.map(t => [t.css, { hsl: t.hsl, hex: t.hex, label: t.label }])),
      stateLayers: Object.fromEntries(stateLayer.map(s => [s.token, { name: s.name, value: s.value }])),
      borderRadius: Object.fromEntries(radii.map(r => [r.token, { value: r.value, usage: r.usage }])),
      elevation: Object.fromEntries(elevations.map(e => [e.token, { name: e.name, desc: e.desc }])),
      typography,
      spacing: Object.fromEntries(spacing.map(s => [s.token, s.value])),
      motion: { easing: motionEasing, durations: motionDurations },
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
      <div className="p-6 space-y-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-headline-sm text-foreground">Design System</h1>
            <p className="text-body-sm text-muted-foreground mt-1">Complete token reference, specs &amp; live component samples for developer handoff.</p>
          </div>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" /> Download JSON
          </Button>
        </div>

        {/* Table of Contents */}
        <div className="flex flex-wrap gap-2">
          {tocItems.map(item => (
            <a key={item.id} href={`#${item.id}`} className="text-label-sm px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
              {item.label}
            </a>
          ))}
        </div>

        {/* ════════════════════════════════════════════
            COLOR TOKENS
        ════════════════════════════════════════════ */}

        <Section title="Semantic Colors — Light Mode" id="semantic-light">
          <ColorGrid tokens={core} />
        </Section>

        <Section title="Semantic Colors — Dark Mode" id="semantic-dark">
          <ColorGrid tokens={darkCore} />
        </Section>

        <Section title="Brand Colors" id="brand">
          <ColorGrid tokens={brand} />
        </Section>

        <Section title="Material 3 Palette" id="m3-palette">
          <ColorGrid tokens={m3Palette} />
        </Section>

        <Section title="Surface Containers" id="surfaces">
          <ColorGrid tokens={surfaces} />
        </Section>

        <Section title="Sidebar" id="sidebar">
          <ColorGrid tokens={sidebar} />
        </Section>

        <Section title="Border Tokens" id="borders">
          <ColorGrid tokens={borders} />
        </Section>

        <Section title="Tooltip Tokens" id="tooltips">
          <ColorGrid tokens={tooltipTokens} />
        </Section>

        <Section title="Dropzone Tokens" id="dropzone">
          <ColorGrid tokens={dropzone} />
        </Section>

        <Section title="Glow & Glass Effects" id="glow-glass">
          <ColorGrid tokens={glowGlass} />
          <div className="mt-3 p-4 rounded-xl bg-muted text-body-sm space-y-1">
            <p><span className="font-mono font-medium">--glass-bg</span> — hsl(var(--m3-surface) / 0.8) + backdrop-blur-xl</p>
            <p><span className="font-mono font-medium">--glass-border</span> — hsl(var(--m3-outline-variant) / 0.5)</p>
            <p><span className="font-mono font-medium">--ai-gradient</span> — linear-gradient(135deg, primary → navy)</p>
            <p><span className="font-mono font-medium">--ai-glow</span> — 0 0 20px hsl(207 71% 38% / 0.3)</p>
          </div>
        </Section>

        <Section title="Hardcoded Values" id="hardcoded">
          <ColorGrid tokens={hardcoded} />
        </Section>

        {/* ════════════════════════════════════════════
            STATE LAYERS
        ════════════════════════════════════════════ */}

        <Section title="M3 State Layer Opacities" id="state-layers">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stateLayer.map(s => (
              <div key={s.token} className="p-4 rounded-xl bg-muted text-center space-y-2">
                <div className="h-12 w-12 mx-auto rounded-full bg-primary flex items-center justify-center" style={{ opacity: parseFloat(s.value) }}>
                  <div className="h-8 w-8 rounded-full bg-primary" />
                </div>
                <p className="text-label-md font-medium">{s.name}</p>
                <p className="text-label-sm text-muted-foreground font-mono">{s.value}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ════════════════════════════════════════════
            LAYOUT SYSTEM
        ════════════════════════════════════════════ */}

        <Section title="Border Radius" id="radius">
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

        <Section title="Elevation System" id="elevation">
          <div className="flex flex-wrap gap-6">
            {elevations.map(e => (
              <div key={e.token} className="h-20 w-28 rounded-lg bg-card flex flex-col items-center justify-center" style={{ boxShadow: `var(${e.token})` }}>
                <p className="text-label-md font-medium">{e.name}</p>
                <p className="text-label-sm text-muted-foreground">{e.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typography Scale" id="typography">
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

        <Section title="Spacing Scale" id="spacing">
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

        {/* ════════════════════════════════════════════
            MOTION & EASING
        ════════════════════════════════════════════ */}

        <Section title="Motion & Easing System" id="motion">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-5 space-y-3">
              <h4 className="text-title-sm font-medium">Easing Curves</h4>
              {motionEasing.map(e => (
                <div key={e.name} className="space-y-0.5">
                  <p className="text-body-sm font-medium">{e.name}</p>
                  <p className="text-label-sm text-muted-foreground font-mono">{e.value}</p>
                  <p className="text-label-sm text-muted-foreground">{e.usage}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border p-5 space-y-3">
              <h4 className="text-title-sm font-medium">Duration Tokens</h4>
              {motionDurations.map(d => (
                <div key={d.name} className="space-y-0.5">
                  <p className="text-body-sm font-medium">{d.name}</p>
                  <p className="text-label-sm text-muted-foreground font-mono">{d.value}</p>
                  <p className="text-label-sm text-muted-foreground">{d.usage}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 p-4 rounded-xl bg-muted text-body-sm space-y-1">
            <p className="font-medium">Keyframe Animations</p>
            <p className="font-mono text-label-sm text-muted-foreground">fade-in · slide-up · scale-in · pop-out · pop-in · pulse-glow · button-press · lift-shadow · glow-pulse · highlight-pulse · swing · m3-ripple · m3-checkmark-in</p>
          </div>
        </Section>

        {/* ════════════════════════════════════════════
            COMPONENT SAMPLES
        ════════════════════════════════════════════ */}

        <div id="components" className="scroll-mt-24">
          <h2 className="text-headline-sm text-foreground mb-6">Live Component Samples</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Buttons */}
            <SampleCard title="Buttons">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="elevated">Elevated</Button>
                  <Button variant="tonal">Tonal</Button>
                  <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Plus className="h-4 w-4" /></Button>
                  <Button size="icon-sm" variant="ghost"><Search className="h-4 w-4" /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button disabled>Disabled</Button>
                  <Button variant="default" className="gap-2"><Mail className="h-4 w-4" /> With Icon</Button>
                </div>
              </div>
              <p className="text-label-sm text-muted-foreground mt-2">
                h-9 (36px) · 10px radius · pop-out hover (scale 1.02) · press (scale 0.98)
              </p>
            </SampleCard>

            {/* Inputs */}
            <SampleCard title="Inputs">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Outlined (Default)</Label>
                  <Input placeholder="Enter text..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Filled Variant</Label>
                  <InputFilled placeholder="Enter text..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Error State</Label>
                  <Input error placeholder="Invalid input" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Disabled</Label>
                  <Input disabled placeholder="Disabled" />
                </div>
              </div>
              <p className="text-label-sm text-muted-foreground mt-2">
                h-9 · 10px radius · #dcdfe4 border · double-border focus (2px blue outline + 2px offset)
              </p>
            </SampleCard>

            {/* Textarea */}
            <SampleCard title="Textarea">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Default</Label>
                  <Textarea placeholder="Write a description..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Error</Label>
                  <Textarea error placeholder="Error state" />
                </div>
              </div>
              <p className="text-label-sm text-muted-foreground mt-2">
                min-h 140px · same border/focus system as Input
              </p>
            </SampleCard>

            {/* Select */}
            <SampleCard title="Select">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Default Select</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose option..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opt1">Option One</SelectItem>
                      <SelectItem value="opt2">Option Two</SelectItem>
                      <SelectItem value="opt3">Option Three</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Error State</Label>
                  <Select>
                    <SelectTrigger error>
                      <SelectValue placeholder="Required" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Item A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-label-sm text-muted-foreground mt-2">
                Trigger: h-9 · 10px radius · same focus · Dropdown: 10px radius matching trigger
              </p>
            </SampleCard>

            {/* Badges */}
            <SampleCard title="Badges">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="new">New</Badge>
                <Badge variant="completed">Completed</Badge>
                <Badge variant="accepted">Accepted</Badge>
                <Badge variant="inProgress">In Progress</Badge>
                <Badge variant="inviteNow">Invite Now</Badge>
                <Badge variant="processing">Processing</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="pending">Pending</Badge>
                <Badge variant="inviteSent">Invite Sent</Badge>
                <Badge variant="gathering">Gathering</Badge>
                <Badge variant="review">Review</Badge>
                <Badge variant="notStarted">Not Started</Badge>
                <Badge variant="archived">Archived</Badge>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="recommended">Recommended</Badge>
                <Badge variant="feature">Feature</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="success">Success</Badge>
              </div>
              <p className="text-label-sm text-muted-foreground mt-2">
                Pill shape · px-3 py-1 · soft BG + matching border + bold text
              </p>
            </SampleCard>

            {/* Checkbox & Switch */}
            <SampleCard title="Checkbox & Switch">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox checked={checkboxChecked} onCheckedChange={(v) => setCheckboxChecked(!!v)} />
                  <Label className="text-sm">Checkbox {checkboxChecked ? "(Checked)" : "(Unchecked)"}</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox checked={true} disabled />
                  <Label className="text-sm opacity-50">Disabled Checked</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox indeterminate checked="indeterminate" />
                  <Label className="text-sm">Indeterminate</Label>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center gap-3">
                  <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                  <Label className="text-sm">Switch {switchOn ? "On" : "Off"}</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch disabled />
                  <Label className="text-sm opacity-50">Disabled</Label>
                </div>
              </div>
              <p className="text-label-sm text-muted-foreground mt-2">
                Checkbox: 18px · M3 ripple + checkmark animations · Switch: h-6 w-11
              </p>
            </SampleCard>

            {/* Tabs */}
            <SampleCard title="Tabs">
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">Overview</TabsTrigger>
                  <TabsTrigger value="tab2">Details</TabsTrigger>
                  <TabsTrigger value="tab3">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="p-3 text-body-sm">Overview content goes here.</TabsContent>
                <TabsContent value="tab2" className="p-3 text-body-sm">Details content goes here.</TabsContent>
                <TabsContent value="tab3" className="p-3 text-body-sm">Settings content goes here.</TabsContent>
              </Tabs>
              <p className="text-label-sm text-muted-foreground mt-2">
                h-10 · muted BG · active tab: white bg + shadow
              </p>
            </SampleCard>

            {/* Tooltip */}
            <SampleCard title="Tooltip">
              <div className="flex flex-wrap gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon"><Bell className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent>Notifications</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon"><Settings className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon"><Star className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Multi-line tooltip</p>
                      <p className="text-label-sm opacity-70">With secondary text</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-label-sm text-muted-foreground mt-2">
                Blue-tinted bg (hsl 210 45% 96%) · rounded-xl · px-4 py-2.5 · zoom-in-95 animation
              </p>
            </SampleCard>

            {/* Popover */}
            <SampleCard title="Popover">
              <div className="flex gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-3">
                      <h4 className="text-title-sm font-medium">Popover Title</h4>
                      <p className="text-body-sm text-muted-foreground">This is a popover with custom content. It supports any React children.</p>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Quick Input</Label>
                        <Input placeholder="Type here..." />
                      </div>
                      <Button size="sm" className="w-full">Confirm</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-label-sm text-muted-foreground mt-2">
                rounded-xl · 2px dark-blue border · inner light shadow · zoom-in-95 animation
              </p>
            </SampleCard>

            {/* Dialog */}
            <SampleCard title="Dialog (Modal)">
              <div className="flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sample Dialog</DialogTitle>
                      <DialogDescription>This is a sample dialog demonstrating the design system modal pattern.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Name</Label>
                        <Input placeholder="Enter name..." />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Description</Label>
                        <Textarea placeholder="Enter description..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>Are you sure you want to delete this item? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive"><Trash2 className="h-4 w-4" /> Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-label-sm text-muted-foreground mt-2">
                Overlay: bg-black/80 · Content: rounded-lg · zoom-in/out-95 · slide animations
              </p>
            </SampleCard>

            {/* Form Layout Pattern */}
            <SampleCard title="Form Pattern (Labels + Fields)">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Client Name</Label>
                  <Input placeholder="Enter client name..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Email</Label>
                    <Input type="email" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Phone</Label>
                    <Input type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Notes</Label>
                  <Textarea placeholder="Additional notes..." />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </div>
              </div>
              <p className="text-label-sm text-muted-foreground mt-2">
                Labels: text-xs medium · above field · external position · consistent gap-1.5
              </p>
            </SampleCard>

            {/* Card Elevation Samples */}
            <SampleCard title="Card & Elevation Samples">
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5].map(level => (
                  <div key={level} className="rounded-xl bg-card p-4 text-center" style={{ boxShadow: `var(--elevation-${level})` }}>
                    <p className="text-label-md font-medium">E{level}</p>
                  </div>
                ))}
                <div className="rounded-xl p-4 text-center border border-border bg-card" style={{ backdropFilter: "blur(16px)", background: "var(--glass-bg)" }}>
                  <p className="text-label-md font-medium">Glass</p>
                </div>
              </div>
            </SampleCard>

          </div>
        </div>

      </div>
    </Layout>
  );
}