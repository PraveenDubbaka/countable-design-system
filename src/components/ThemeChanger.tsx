import { useState } from "react";
import { Palette, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorTheme {
  id: string;
  name: string;
  preview: string; // hex for the swatch
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
      "--m3-primary-container": "207 78% 90%",
      "--m3-on-primary-container": "207 80% 20%",
      "--m3-tertiary": "213 76% 19%",
      "--m3-tertiary-container": "213 60% 85%",
      "--countable-navy": "213 76% 19%",
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
      "--m3-primary-container": "175 70% 90%",
      "--m3-on-primary-container": "175 70% 20%",
      "--m3-tertiary": "180 70% 18%",
      "--m3-tertiary-container": "180 55% 85%",
      "--countable-navy": "180 70% 18%",
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
      "--m3-primary-container": "255 65% 90%",
      "--m3-on-primary-container": "255 60% 22%",
      "--m3-tertiary": "260 60% 22%",
      "--m3-tertiary-container": "260 50% 85%",
      "--countable-navy": "260 60% 22%",
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
      "--m3-primary-container": "150 55% 90%",
      "--m3-on-primary-container": "150 55% 18%",
      "--m3-tertiary": "150 50% 20%",
      "--m3-tertiary-container": "150 45% 85%",
      "--countable-navy": "150 50% 20%",
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
      "--m3-primary-container": "215 30% 90%",
      "--m3-on-primary-container": "215 25% 20%",
      "--m3-tertiary": "215 20% 21%",
      "--m3-tertiary-container": "215 22% 85%",
      "--countable-navy": "215 20% 21%",
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
      "--m3-primary-container": "310 50% 90%",
      "--m3-on-primary-container": "310 50% 20%",
      "--m3-tertiary": "310 50% 19%",
      "--m3-tertiary-container": "310 40% 85%",
      "--countable-navy": "310 50% 19%",
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
      "--m3-primary-container": "30 70% 90%",
      "--m3-on-primary-container": "30 70% 20%",
      "--m3-tertiary": "30 70% 21%",
      "--m3-tertiary-container": "30 55% 85%",
      "--countable-navy": "30 70% 21%",
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
      "--m3-primary-container": "340 60% 90%",
      "--m3-on-primary-container": "340 55% 22%",
      "--m3-tertiary": "335 60% 22%",
      "--m3-tertiary-container": "335 50% 85%",
      "--countable-navy": "335 60% 22%",
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

export function ThemeChanger() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    const stored = getStoredTheme();
    // Apply stored theme on mount
    const theme = themes.find((t) => t.id === stored);
    if (theme && theme.id !== "default-blue") {
      applyTheme(theme);
    }
    return stored;
  });

  const handleThemeSelect = (theme: ColorTheme) => {
    setActiveTheme(theme.id);
    applyTheme(theme);
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
