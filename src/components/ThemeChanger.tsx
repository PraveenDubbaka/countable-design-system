import { useState } from "react";
import { Palette, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorTheme {
  id: string;
  name: string;
  preview: string;
  variables: Record<string, string>;
}

const themes: ColorTheme[] = [
  {
    id: "default-blue",
    name: "Countable Blue",
    preview: "#0A3159",
    variables: {
      "--sidebar-bg": "213 76% 19%",
      "--sidebar-muted": "213 60% 28%",
      "--sidebar-accent": "207 71% 38%",
      "--m3-primary": "207 71% 38%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "207 78% 90%",
      "--m3-on-primary-container": "207 80% 20%",
      "--m3-secondary": "210 25% 40%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "210 30% 90%",
      "--m3-on-secondary-container": "210 30% 15%",
      "--m3-tertiary": "213 76% 19%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "213 60% 85%",
      "--m3-on-tertiary-container": "213 70% 15%",
      "--m3-surface-variant": "210 40% 96%",
      "--m3-on-surface-variant": "213 50% 15%",
      "--m3-surface-container-low": "210 50% 98%",
      "--m3-surface-container": "210 45% 96%",
      "--m3-surface-container-high": "210 40% 94%",
      "--m3-surface-container-highest": "210 35% 92%",
      "--m3-outline": "210 25% 55%",
      "--m3-outline-variant": "210 30% 82%",
      "--link": "209 100% 29%",
      "--countable-navy": "213 76% 19%",
      "--countable-blue": "207 71% 38%",
      "--countable-blue-light": "207 78% 55%",
      "--countable-blue-dark": "207 78% 28%",
    },
  },
  {
    id: "teal",
    name: "Ocean Teal",
    preview: "#0D4F4F",
    variables: {
      "--sidebar-bg": "180 70% 18%",
      "--sidebar-muted": "180 55% 28%",
      "--sidebar-accent": "175 65% 38%",
      "--m3-primary": "175 65% 38%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "175 70% 90%",
      "--m3-on-primary-container": "175 70% 20%",
      "--m3-secondary": "180 25% 40%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "180 30% 90%",
      "--m3-on-secondary-container": "180 30% 15%",
      "--m3-tertiary": "180 70% 18%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "180 55% 85%",
      "--m3-on-tertiary-container": "180 60% 15%",
      "--m3-surface-variant": "178 35% 96%",
      "--m3-on-surface-variant": "180 45% 15%",
      "--m3-surface-container-low": "178 45% 98%",
      "--m3-surface-container": "178 40% 96%",
      "--m3-surface-container-high": "178 35% 94%",
      "--m3-surface-container-highest": "178 30% 92%",
      "--m3-outline": "178 25% 55%",
      "--m3-outline-variant": "178 30% 82%",
      "--link": "175 100% 25%",
      "--countable-navy": "180 70% 18%",
      "--countable-blue": "175 65% 38%",
      "--countable-blue-light": "175 70% 55%",
      "--countable-blue-dark": "175 70% 28%",
    },
  },
  {
    id: "indigo",
    name: "Deep Indigo",
    preview: "#2D1B69",
    variables: {
      "--sidebar-bg": "260 60% 22%",
      "--sidebar-muted": "260 45% 32%",
      "--sidebar-accent": "255 55% 45%",
      "--m3-primary": "255 55% 45%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "255 65% 90%",
      "--m3-on-primary-container": "255 60% 22%",
      "--m3-secondary": "260 25% 42%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "258 30% 90%",
      "--m3-on-secondary-container": "258 30% 15%",
      "--m3-tertiary": "260 60% 22%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "260 50% 85%",
      "--m3-on-tertiary-container": "260 55% 15%",
      "--m3-surface-variant": "258 35% 96%",
      "--m3-on-surface-variant": "260 45% 15%",
      "--m3-surface-container-low": "258 45% 98%",
      "--m3-surface-container": "258 40% 96%",
      "--m3-surface-container-high": "258 35% 94%",
      "--m3-surface-container-highest": "258 30% 92%",
      "--m3-outline": "258 25% 55%",
      "--m3-outline-variant": "258 28% 82%",
      "--link": "255 80% 35%",
      "--countable-navy": "260 60% 22%",
      "--countable-blue": "255 55% 45%",
      "--countable-blue-light": "255 60% 58%",
      "--countable-blue-dark": "255 60% 30%",
    },
  },
  {
    id: "emerald",
    name: "Forest Green",
    preview: "#1A4D2E",
    variables: {
      "--sidebar-bg": "150 50% 20%",
      "--sidebar-muted": "150 40% 30%",
      "--sidebar-accent": "152 50% 36%",
      "--m3-primary": "152 50% 36%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "150 55% 90%",
      "--m3-on-primary-container": "150 55% 18%",
      "--m3-secondary": "148 25% 40%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "148 30% 90%",
      "--m3-on-secondary-container": "148 30% 15%",
      "--m3-tertiary": "150 50% 20%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "150 45% 85%",
      "--m3-on-tertiary-container": "150 50% 15%",
      "--m3-surface-variant": "148 35% 96%",
      "--m3-on-surface-variant": "150 45% 15%",
      "--m3-surface-container-low": "148 45% 98%",
      "--m3-surface-container": "148 40% 96%",
      "--m3-surface-container-high": "148 35% 94%",
      "--m3-surface-container-highest": "148 30% 92%",
      "--m3-outline": "148 22% 55%",
      "--m3-outline-variant": "148 28% 82%",
      "--link": "152 80% 25%",
      "--countable-navy": "150 50% 20%",
      "--countable-blue": "152 50% 36%",
      "--countable-blue-light": "152 55% 50%",
      "--countable-blue-dark": "152 55% 25%",
    },
  },
  {
    id: "slate",
    name: "Graphite",
    preview: "#2C3440",
    variables: {
      "--sidebar-bg": "215 20% 21%",
      "--sidebar-muted": "215 18% 30%",
      "--sidebar-accent": "215 25% 42%",
      "--m3-primary": "215 25% 42%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "215 30% 90%",
      "--m3-on-primary-container": "215 25% 20%",
      "--m3-secondary": "215 18% 42%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "215 20% 90%",
      "--m3-on-secondary-container": "215 20% 15%",
      "--m3-tertiary": "215 20% 21%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "215 22% 85%",
      "--m3-on-tertiary-container": "215 22% 15%",
      "--m3-surface-variant": "215 18% 96%",
      "--m3-on-surface-variant": "215 20% 15%",
      "--m3-surface-container-low": "215 22% 98%",
      "--m3-surface-container": "215 18% 96%",
      "--m3-surface-container-high": "215 16% 94%",
      "--m3-surface-container-highest": "215 14% 92%",
      "--m3-outline": "215 15% 55%",
      "--m3-outline-variant": "215 18% 82%",
      "--link": "215 40% 32%",
      "--countable-navy": "215 20% 21%",
      "--countable-blue": "215 25% 42%",
      "--countable-blue-light": "215 28% 55%",
      "--countable-blue-dark": "215 25% 28%",
    },
  },
  {
    id: "wine",
    name: "Burgundy",
    preview: "#4A1942",
    variables: {
      "--sidebar-bg": "310 50% 19%",
      "--sidebar-muted": "310 40% 28%",
      "--sidebar-accent": "310 45% 40%",
      "--m3-primary": "310 45% 40%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "310 50% 90%",
      "--m3-on-primary-container": "310 50% 20%",
      "--m3-secondary": "308 25% 42%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "308 28% 90%",
      "--m3-on-secondary-container": "308 28% 15%",
      "--m3-tertiary": "310 50% 19%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "310 40% 85%",
      "--m3-on-tertiary-container": "310 45% 15%",
      "--m3-surface-variant": "308 30% 96%",
      "--m3-on-surface-variant": "310 40% 15%",
      "--m3-surface-container-low": "308 40% 98%",
      "--m3-surface-container": "308 35% 96%",
      "--m3-surface-container-high": "308 30% 94%",
      "--m3-surface-container-highest": "308 25% 92%",
      "--m3-outline": "308 22% 55%",
      "--m3-outline-variant": "308 25% 82%",
      "--link": "310 70% 30%",
      "--countable-navy": "310 50% 19%",
      "--countable-blue": "310 45% 40%",
      "--countable-blue-light": "310 50% 55%",
      "--countable-blue-dark": "310 50% 28%",
    },
  },
  {
    id: "amber",
    name: "Warm Amber",
    preview: "#5C3D11",
    variables: {
      "--sidebar-bg": "30 70% 21%",
      "--sidebar-muted": "30 55% 30%",
      "--sidebar-accent": "30 65% 40%",
      "--m3-primary": "30 65% 40%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "30 70% 90%",
      "--m3-on-primary-container": "30 70% 20%",
      "--m3-secondary": "28 30% 42%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "28 35% 90%",
      "--m3-on-secondary-container": "28 35% 15%",
      "--m3-tertiary": "30 70% 21%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "30 55% 85%",
      "--m3-on-tertiary-container": "30 60% 15%",
      "--m3-surface-variant": "28 35% 96%",
      "--m3-on-surface-variant": "30 50% 15%",
      "--m3-surface-container-low": "28 45% 98%",
      "--m3-surface-container": "28 40% 96%",
      "--m3-surface-container-high": "28 35% 94%",
      "--m3-surface-container-highest": "28 28% 92%",
      "--m3-outline": "28 22% 55%",
      "--m3-outline-variant": "28 28% 82%",
      "--link": "30 90% 28%",
      "--countable-navy": "30 70% 21%",
      "--countable-blue": "30 65% 40%",
      "--countable-blue-light": "30 70% 55%",
      "--countable-blue-dark": "30 70% 28%",
    },
  },
  {
    id: "rose",
    name: "Coral Rose",
    preview: "#8B2252",
    variables: {
      "--sidebar-bg": "335 60% 22%",
      "--sidebar-muted": "335 48% 32%",
      "--sidebar-accent": "340 55% 45%",
      "--m3-primary": "340 55% 45%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "340 60% 90%",
      "--m3-on-primary-container": "340 55% 22%",
      "--m3-secondary": "338 28% 42%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "338 30% 90%",
      "--m3-on-secondary-container": "338 30% 15%",
      "--m3-tertiary": "335 60% 22%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "335 50% 85%",
      "--m3-on-tertiary-container": "335 55% 15%",
      "--m3-surface-variant": "338 30% 96%",
      "--m3-on-surface-variant": "335 45% 15%",
      "--m3-surface-container-low": "338 40% 98%",
      "--m3-surface-container": "338 35% 96%",
      "--m3-surface-container-high": "338 30% 94%",
      "--m3-surface-container-highest": "338 25% 92%",
      "--m3-outline": "338 22% 55%",
      "--m3-outline-variant": "338 25% 82%",
      "--link": "340 75% 32%",
      "--countable-navy": "335 60% 22%",
      "--countable-blue": "340 55% 45%",
      "--countable-blue-light": "340 60% 58%",
      "--countable-blue-dark": "340 60% 30%",
    },
  },
];

const THEME_STORAGE_KEY = "luka-color-theme";

function getStoredTheme(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(THEME_STORAGE_KEY) || "default-blue";
  }
  return "default-blue";
}

function applyTheme(theme: ColorTheme) {
  const root = document.documentElement;
  Object.entries(theme.variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  localStorage.setItem(THEME_STORAGE_KEY, theme.id);
}

function clearTheme() {
  const root = document.documentElement;
  // Remove all inline overrides so CSS defaults take over
  themes[0].variables &&
    Object.keys(themes[0].variables).forEach((key) => {
      root.style.removeProperty(key);
    });
}

export function ThemeChanger() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    const stored = getStoredTheme();
    const theme = themes.find((t) => t.id === stored);
    if (theme && theme.id !== "default-blue") {
      applyTheme(theme);
    }
    return stored;
  });

  const handleThemeSelect = (theme: ColorTheme) => {
    if (theme.id === "default-blue") {
      clearTheme();
      localStorage.setItem(THEME_STORAGE_KEY, theme.id);
    } else {
      applyTheme(theme);
    }
    setActiveTheme(theme.id);
  };

  return (
    <div
      className={cn(
        "fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-stretch transition-transform duration-300 ease-emphasized",
        isOpen ? "translate-x-0" : "translate-x-[180px]"
      )}
    >
      {/* Toggle tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-16 rounded-l-lg bg-inverse-surface text-inverse-on-surface shadow-elevation-3 hover:opacity-90 transition-opacity"
        title="Theme Changer"
      >
        {isOpen ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <Palette className="h-4 w-4" />
        )}
      </button>

      {/* Panel */}
      <div className="w-[180px] bg-card border border-border border-r-0 rounded-l-xl shadow-elevation-4 py-4 px-3">
        <h3 className="text-label-sm text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Themes
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme)}
              className={cn(
                "group relative flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all duration-200",
                activeTheme === theme.id
                  ? "border-foreground/30 bg-muted/60"
                  : "border-transparent hover:bg-muted/40"
              )}
              title={theme.name}
            >
              <div
                className="w-8 h-8 rounded-full shadow-sm border border-border/50 flex items-center justify-center"
                style={{ backgroundColor: theme.preview }}
              >
                {activeTheme === theme.id && (
                  <Check className="h-3.5 w-3.5 text-white" />
                )}
              </div>
              <span className="text-[10px] font-medium text-muted-foreground leading-tight text-center">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
