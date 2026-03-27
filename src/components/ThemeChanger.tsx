import { useState } from "react";
import { Palette, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorTheme {
  id: string;
  name: string;
  preview: [string, string]; // [sidebar color, primary color] for dual swatch
  variables: Record<string, string>;
}

const themes: ColorTheme[] = [
  {
    id: "default-navy",
    name: "Navy Core",
    preview: ["#0A3159", "#1C63A6"],
    variables: {
      "--sidebar-bg": "213 76% 19%",
      "--sidebar-muted": "213 60% 28%",
      "--sidebar-accent": "207 71% 38%",
      "--m3-primary": "207 71% 38%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "213 90% 90%",
      "--m3-on-primary-container": "207 80% 20%",
      "--m3-secondary": "213 75% 27%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "222 100% 93%",
      "--m3-on-secondary-container": "213 76% 19%",
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
      "--countable-blue-light": "207 65% 48%",
      "--countable-blue-dark": "207 90% 24%",
      "--sidebar-secondary-bg": "240 3% 94%",
    },
  },
  {
    id: "midnight-navy",
    name: "Midnight",
    preview: ["#061E38", "#1C63A6"],
    variables: {
      "--sidebar-bg": "213 78% 12%",
      "--sidebar-muted": "213 65% 20%",
      "--sidebar-accent": "207 71% 38%",
      "--m3-primary": "207 71% 38%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "213 90% 90%",
      "--m3-on-primary-container": "207 80% 20%",
      "--m3-secondary": "213 76% 19%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "222 100% 93%",
      "--m3-on-secondary-container": "213 78% 12%",
      "--m3-tertiary": "213 78% 12%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "213 60% 85%",
      "--m3-on-tertiary-container": "213 70% 10%",
      "--m3-surface-variant": "210 40% 96%",
      "--m3-on-surface-variant": "213 55% 12%",
      "--m3-surface-container-low": "210 50% 98%",
      "--m3-surface-container": "210 45% 96%",
      "--m3-surface-container-high": "210 40% 94%",
      "--m3-surface-container-highest": "210 35% 92%",
      "--m3-outline": "210 25% 55%",
      "--m3-outline-variant": "210 30% 82%",
      "--link": "209 100% 29%",
      "--countable-navy": "213 78% 12%",
      "--countable-blue": "207 71% 38%",
      "--countable-blue-light": "207 65% 48%",
      "--countable-blue-dark": "207 90% 24%",
      "--sidebar-secondary-bg": "213 20% 92%",
    },
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    preview: ["#03274D", "#2A7BCB"],
    variables: {
      "--sidebar-bg": "210 90% 15%",
      "--sidebar-muted": "210 70% 24%",
      "--sidebar-accent": "207 65% 48%",
      "--m3-primary": "207 65% 48%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "207 80% 90%",
      "--m3-on-primary-container": "210 80% 18%",
      "--m3-secondary": "210 75% 30%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "207 70% 92%",
      "--m3-on-secondary-container": "210 80% 14%",
      "--m3-tertiary": "210 90% 15%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "207 60% 86%",
      "--m3-on-tertiary-container": "210 75% 12%",
      "--m3-surface-variant": "207 38% 96%",
      "--m3-on-surface-variant": "210 55% 14%",
      "--m3-surface-container-low": "207 48% 98%",
      "--m3-surface-container": "207 42% 96%",
      "--m3-surface-container-high": "207 38% 94%",
      "--m3-surface-container-highest": "207 32% 92%",
      "--m3-outline": "207 25% 55%",
      "--m3-outline-variant": "207 30% 82%",
      "--link": "207 80% 32%",
      "--countable-navy": "210 90% 15%",
      "--countable-blue": "207 65% 48%",
      "--countable-blue-light": "207 70% 58%",
      "--countable-blue-dark": "207 71% 38%",
      "--sidebar-secondary-bg": "207 25% 93%",
    },
  },
  {
    id: "clarity-blue",
    name: "Clarity Blue",
    preview: ["#10427A", "#2A7BCB"],
    variables: {
      "--sidebar-bg": "213 75% 27%",
      "--sidebar-muted": "213 60% 36%",
      "--sidebar-accent": "207 65% 48%",
      "--m3-primary": "207 65% 48%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "213 90% 90%",
      "--m3-on-primary-container": "213 75% 22%",
      "--m3-secondary": "207 71% 38%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "222 100% 93%",
      "--m3-on-secondary-container": "213 75% 19%",
      "--m3-tertiary": "213 75% 27%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "210 70% 86%",
      "--m3-on-tertiary-container": "213 70% 16%",
      "--m3-surface-variant": "210 42% 96%",
      "--m3-on-surface-variant": "213 50% 15%",
      "--m3-surface-container-low": "210 50% 98%",
      "--m3-surface-container": "210 45% 96%",
      "--m3-surface-container-high": "210 40% 94%",
      "--m3-surface-container-highest": "210 35% 92%",
      "--m3-outline": "210 25% 55%",
      "--m3-outline-variant": "210 30% 82%",
      "--link": "207 65% 36%",
      "--countable-navy": "213 75% 27%",
      "--countable-blue": "207 65% 48%",
      "--countable-blue-light": "207 70% 58%",
      "--countable-blue-dark": "207 71% 38%",
      "--sidebar-secondary-bg": "210 35% 94%",
    },
  },
  {
    id: "charcoal-blue",
    name: "Charcoal",
    preview: ["#1A2A3A", "#3379C9"],
    variables: {
      "--sidebar-bg": "210 38% 16%",
      "--sidebar-muted": "210 30% 25%",
      "--sidebar-accent": "210 56% 49%",
      "--m3-primary": "210 56% 49%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "210 70% 90%",
      "--m3-on-primary-container": "210 45% 20%",
      "--m3-secondary": "213 50% 30%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "210 50% 92%",
      "--m3-on-secondary-container": "210 35% 14%",
      "--m3-tertiary": "210 38% 16%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "210 40% 85%",
      "--m3-on-tertiary-container": "210 35% 12%",
      "--m3-surface-variant": "210 30% 96%",
      "--m3-on-surface-variant": "210 35% 15%",
      "--m3-surface-container-low": "210 35% 98%",
      "--m3-surface-container": "210 30% 96%",
      "--m3-surface-container-high": "210 28% 94%",
      "--m3-surface-container-highest": "210 22% 92%",
      "--m3-outline": "210 20% 52%",
      "--m3-outline-variant": "210 22% 82%",
      "--link": "210 56% 38%",
      "--countable-navy": "210 38% 16%",
      "--countable-blue": "210 56% 49%",
      "--countable-blue-light": "210 60% 58%",
      "--countable-blue-dark": "210 56% 35%",
      "--sidebar-secondary-bg": "210 18% 93%",
    },
  },
  {
    id: "deep-blue",
    name: "Deep Blue",
    preview: ["#074075", "#1C63A6"],
    variables: {
      "--sidebar-bg": "207 90% 24%",
      "--sidebar-muted": "207 75% 32%",
      "--sidebar-accent": "207 71% 38%",
      "--m3-primary": "207 71% 38%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "213 90% 90%",
      "--m3-on-primary-container": "207 90% 18%",
      "--m3-secondary": "213 76% 19%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "210 60% 90%",
      "--m3-on-secondary-container": "207 85% 16%",
      "--m3-tertiary": "207 90% 24%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "207 70% 86%",
      "--m3-on-tertiary-container": "207 85% 14%",
      "--m3-surface-variant": "207 38% 96%",
      "--m3-on-surface-variant": "207 55% 15%",
      "--m3-surface-container-low": "207 48% 98%",
      "--m3-surface-container": "207 42% 96%",
      "--m3-surface-container-high": "207 38% 94%",
      "--m3-surface-container-highest": "207 32% 92%",
      "--m3-outline": "207 25% 55%",
      "--m3-outline-variant": "207 30% 82%",
      "--link": "207 90% 24%",
      "--countable-navy": "207 90% 24%",
      "--countable-blue": "207 71% 38%",
      "--countable-blue-light": "207 65% 48%",
      "--countable-blue-dark": "207 90% 24%",
      "--sidebar-secondary-bg": "207 30% 94%",
    },
  },
  {
    id: "momentum",
    name: "Momentum",
    preview: ["#0A3159", "#3379C9"],
    variables: {
      "--sidebar-bg": "213 76% 19%",
      "--sidebar-muted": "213 60% 28%",
      "--sidebar-accent": "210 56% 49%",
      "--m3-primary": "210 56% 49%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "210 70% 90%",
      "--m3-on-primary-container": "210 60% 22%",
      "--m3-secondary": "207 71% 38%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "222 100% 93%",
      "--m3-on-secondary-container": "213 70% 18%",
      "--m3-tertiary": "213 76% 19%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "210 55% 85%",
      "--m3-on-tertiary-container": "210 55% 15%",
      "--m3-surface-variant": "210 40% 96%",
      "--m3-on-surface-variant": "213 50% 15%",
      "--m3-surface-container-low": "210 50% 98%",
      "--m3-surface-container": "210 45% 96%",
      "--m3-surface-container-high": "210 40% 94%",
      "--m3-surface-container-highest": "210 35% 92%",
      "--m3-outline": "210 25% 55%",
      "--m3-outline-variant": "210 30% 82%",
      "--link": "210 56% 38%",
      "--countable-navy": "213 76% 19%",
      "--countable-blue": "210 56% 49%",
      "--countable-blue-light": "210 60% 58%",
      "--countable-blue-dark": "210 56% 35%",
      "--sidebar-secondary-bg": "210 30% 94%",
    },
  },
  {
    id: "slate-steel",
    name: "Slate Steel",
    preview: ["#0F1C2E", "#4A8FD4"],
    variables: {
      "--sidebar-bg": "215 50% 12%",
      "--sidebar-muted": "215 40% 20%",
      "--sidebar-accent": "210 60% 55%",
      "--m3-primary": "210 60% 55%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "210 65% 90%",
      "--m3-on-primary-container": "215 50% 18%",
      "--m3-secondary": "215 45% 28%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "210 50% 92%",
      "--m3-on-secondary-container": "215 45% 14%",
      "--m3-tertiary": "215 50% 12%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "210 45% 86%",
      "--m3-on-tertiary-container": "215 45% 10%",
      "--m3-surface-variant": "215 28% 96%",
      "--m3-on-surface-variant": "215 40% 15%",
      "--m3-surface-container-low": "215 35% 98%",
      "--m3-surface-container": "215 30% 96%",
      "--m3-surface-container-high": "215 25% 94%",
      "--m3-surface-container-highest": "215 20% 92%",
      "--m3-outline": "215 18% 52%",
      "--m3-outline-variant": "215 22% 82%",
      "--link": "210 60% 40%",
      "--countable-navy": "215 50% 12%",
      "--countable-blue": "210 60% 55%",
      "--countable-blue-light": "210 65% 62%",
      "--countable-blue-dark": "210 55% 40%",
      "--sidebar-secondary-bg": "215 15% 93%",
    },
  },
  {
    id: "strategic-purple",
    name: "Purple Blend",
    preview: ["#241450", "#8A5BD9"],
    variables: {
      "--sidebar-bg": "260 60% 20%",
      "--sidebar-muted": "260 48% 30%",
      "--sidebar-accent": "263 62% 60%",
      "--m3-primary": "263 62% 60%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "281 65% 92%",
      "--m3-on-primary-container": "263 55% 25%",
      "--m3-secondary": "210 56% 49%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "263 50% 92%",
      "--m3-on-secondary-container": "263 50% 18%",
      "--m3-tertiary": "260 60% 20%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "263 50% 86%",
      "--m3-on-tertiary-container": "263 50% 16%",
      "--m3-surface-variant": "263 30% 96%",
      "--m3-on-surface-variant": "263 40% 18%",
      "--m3-surface-container-low": "263 40% 98%",
      "--m3-surface-container": "263 35% 96%",
      "--m3-surface-container-high": "263 30% 94%",
      "--m3-surface-container-highest": "263 25% 92%",
      "--m3-outline": "263 22% 55%",
      "--m3-outline-variant": "263 25% 82%",
      "--link": "263 62% 45%",
      "--countable-navy": "260 60% 20%",
      "--countable-blue": "263 62% 60%",
      "--countable-blue-light": "263 65% 70%",
      "--countable-blue-dark": "263 60% 40%",
      "--sidebar-secondary-bg": "263 20% 94%",
    },
  },
  {
    id: "deep-indigo",
    name: "Deep Indigo",
    preview: ["#1A1040", "#6366F1"],
    variables: {
      "--sidebar-bg": "250 60% 16%",
      "--sidebar-muted": "250 48% 25%",
      "--sidebar-accent": "239 84% 67%",
      "--m3-primary": "239 84% 67%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "240 80% 92%",
      "--m3-on-primary-container": "250 55% 22%",
      "--m3-secondary": "250 50% 35%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "240 60% 92%",
      "--m3-on-secondary-container": "250 50% 16%",
      "--m3-tertiary": "250 60% 16%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "240 55% 88%",
      "--m3-on-tertiary-container": "250 55% 14%",
      "--m3-surface-variant": "245 30% 96%",
      "--m3-on-surface-variant": "250 40% 16%",
      "--m3-surface-container-low": "245 38% 98%",
      "--m3-surface-container": "245 32% 96%",
      "--m3-surface-container-high": "245 28% 94%",
      "--m3-surface-container-highest": "245 22% 92%",
      "--m3-outline": "245 20% 52%",
      "--m3-outline-variant": "245 24% 82%",
      "--link": "239 84% 50%",
      "--countable-navy": "250 60% 16%",
      "--countable-blue": "239 84% 67%",
      "--countable-blue-light": "239 85% 74%",
      "--countable-blue-dark": "239 75% 50%",
      "--sidebar-secondary-bg": "245 18% 94%",
    },
  },
  {
    id: "teal-dark",
    name: "Dark Teal",
    preview: ["#0A2E2E", "#1A9E8F"],
    variables: {
      "--sidebar-bg": "180 55% 11%",
      "--sidebar-muted": "180 42% 19%",
      "--sidebar-accent": "174 70% 36%",
      "--m3-primary": "174 70% 36%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "174 60% 90%",
      "--m3-on-primary-container": "180 55% 16%",
      "--m3-secondary": "180 50% 22%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "174 50% 90%",
      "--m3-on-secondary-container": "180 50% 12%",
      "--m3-tertiary": "180 55% 11%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "174 45% 86%",
      "--m3-on-tertiary-container": "180 50% 10%",
      "--m3-surface-variant": "174 30% 96%",
      "--m3-on-surface-variant": "180 40% 14%",
      "--m3-surface-container-low": "174 38% 98%",
      "--m3-surface-container": "174 32% 96%",
      "--m3-surface-container-high": "174 28% 94%",
      "--m3-surface-container-highest": "174 22% 92%",
      "--m3-outline": "174 20% 52%",
      "--m3-outline-variant": "174 24% 82%",
      "--link": "174 70% 28%",
      "--countable-navy": "180 55% 11%",
      "--countable-blue": "174 70% 36%",
      "--countable-blue-light": "174 65% 46%",
      "--countable-blue-dark": "174 70% 26%",
      "--sidebar-secondary-bg": "174 18% 93%",
    },
  },
  {
    id: "gold-accent",
    name: "Gold Accent",
    preview: ["#0A2040", "#C99A2B"],
    variables: {
      "--sidebar-bg": "213 65% 14%",
      "--sidebar-muted": "213 55% 22%",
      "--sidebar-accent": "40 66% 47%",
      "--m3-primary": "40 66% 47%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "44 100% 88%",
      "--m3-on-primary-container": "40 70% 20%",
      "--m3-secondary": "207 71% 38%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "222 100% 93%",
      "--m3-on-secondary-container": "213 70% 18%",
      "--m3-tertiary": "213 65% 14%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "38 90% 88%",
      "--m3-on-tertiary-container": "40 65% 15%",
      "--m3-surface-variant": "38 30% 96%",
      "--m3-on-surface-variant": "213 50% 15%",
      "--m3-surface-container-low": "38 40% 98%",
      "--m3-surface-container": "38 35% 96%",
      "--m3-surface-container-high": "38 30% 94%",
      "--m3-surface-container-highest": "38 25% 92%",
      "--m3-outline": "38 20% 55%",
      "--m3-outline-variant": "38 25% 82%",
      "--link": "40 70% 35%",
      "--countable-navy": "213 65% 14%",
      "--countable-blue": "40 66% 47%",
      "--countable-blue-light": "40 70% 58%",
      "--countable-blue-dark": "40 65% 35%",
      "--sidebar-secondary-bg": "38 22% 93%",
    },
  },
  {
    id: "pastel-frost",
    name: "Frost Pastel",
    preview: ["#0A3159", "#2A7BCB"],
    variables: {
      "--sidebar-bg": "213 76% 19%",
      "--sidebar-muted": "213 60% 28%",
      "--sidebar-accent": "207 65% 48%",
      "--m3-primary": "207 65% 48%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "213 90% 92%",
      "--m3-on-primary-container": "207 80% 22%",
      "--m3-secondary": "281 40% 55%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "281 65% 92%",
      "--m3-on-secondary-container": "281 50% 20%",
      "--m3-tertiary": "44 80% 50%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "44 100% 88%",
      "--m3-on-tertiary-container": "44 80% 22%",
      "--m3-surface-variant": "213 45% 97%",
      "--m3-on-surface-variant": "213 50% 15%",
      "--m3-surface-container-low": "213 55% 98%",
      "--m3-surface-container": "213 48% 97%",
      "--m3-surface-container-high": "213 42% 95%",
      "--m3-surface-container-highest": "213 38% 93%",
      "--m3-outline": "213 22% 58%",
      "--m3-outline-variant": "213 28% 84%",
      "--link": "207 65% 36%",
      "--countable-navy": "213 76% 19%",
      "--countable-blue": "207 65% 48%",
      "--countable-blue-light": "207 70% 58%",
      "--countable-blue-dark": "207 71% 38%",
      "--sidebar-secondary-bg": "213 30% 94%",
    },
  },
  {
    id: "soft-lavender",
    name: "Soft Lavender",
    preview: ["#2A1555", "#B88FE8"],
    variables: {
      "--sidebar-bg": "263 58% 21%",
      "--sidebar-muted": "263 45% 30%",
      "--sidebar-accent": "270 55% 68%",
      "--m3-primary": "270 55% 68%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "281 65% 93%",
      "--m3-on-primary-container": "263 50% 22%",
      "--m3-secondary": "213 50% 45%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "270 50% 93%",
      "--m3-on-secondary-container": "270 45% 18%",
      "--m3-tertiary": "263 58% 21%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "270 50% 88%",
      "--m3-on-tertiary-container": "270 50% 16%",
      "--m3-surface-variant": "270 28% 97%",
      "--m3-on-surface-variant": "263 38% 18%",
      "--m3-surface-container-low": "270 38% 98%",
      "--m3-surface-container": "270 32% 97%",
      "--m3-surface-container-high": "270 28% 95%",
      "--m3-surface-container-highest": "270 22% 93%",
      "--m3-outline": "270 20% 58%",
      "--m3-outline-variant": "270 22% 84%",
      "--link": "263 55% 40%",
      "--countable-navy": "263 58% 21%",
      "--countable-blue": "270 55% 68%",
      "--countable-blue-light": "270 60% 75%",
      "--countable-blue-dark": "270 50% 50%",
      "--sidebar-secondary-bg": "270 18% 93%",
    },
  },
  {
    id: "gradient-deep-navy",
    name: "Deep Gradient",
    preview: ["#10427A", "#0A3159"],
    variables: {
      "--sidebar-bg": "213 80% 27%",
      "--sidebar-gradient": "linear-gradient(180deg, #10427A 0%, #0A3159 100%)",
      "--sidebar-muted": "213 70% 34%",
      "--sidebar-accent": "207 71% 38%",
      "--m3-primary": "213 80% 27%",
      "--m3-on-primary": "0 0% 100%",
      "--m3-primary-container": "213 85% 88%",
      "--m3-on-primary-container": "213 80% 18%",
      "--m3-secondary": "213 76% 19%",
      "--m3-on-secondary": "0 0% 100%",
      "--m3-secondary-container": "213 70% 91%",
      "--m3-on-secondary-container": "213 76% 14%",
      "--m3-tertiary": "213 76% 19%",
      "--m3-on-tertiary": "0 0% 100%",
      "--m3-tertiary-container": "213 55% 86%",
      "--m3-on-tertiary-container": "213 70% 12%",
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
      "--countable-blue": "213 80% 27%",
      "--countable-blue-light": "207 65% 48%",
      "--countable-blue-dark": "213 80% 20%",
      "--sidebar-secondary-bg": "213 25% 92%",
    },
  },
];

const THEME_STORAGE_KEY = "luka-color-theme";

function getStoredTheme(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(THEME_STORAGE_KEY) || "default-navy";
  }
  return "default-navy";
}

function applyTheme(theme: ColorTheme) {
  const root = document.documentElement;
  // Clear gradient if the new theme doesn't have one
  if (!theme.variables["--sidebar-gradient"]) {
    root.style.removeProperty("--sidebar-gradient");
  }
  Object.entries(theme.variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  localStorage.setItem(THEME_STORAGE_KEY, theme.id);
}

function clearTheme() {
  const root = document.documentElement;
  Object.keys(themes[0].variables).forEach((key) => {
    root.style.removeProperty(key);
  });
}

export function ThemeChanger() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    const stored = getStoredTheme();
    const theme = themes.find((t) => t.id === stored);
    if (theme && theme.id !== "default-navy") {
      applyTheme(theme);
    }
    return stored;
  });

  const handleThemeSelect = (theme: ColorTheme) => {
    if (theme.id === "default-navy") {
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
      <div className="w-[180px] bg-card border border-border border-r-0 rounded-l-xl shadow-elevation-4 py-4 px-3 max-h-[80vh] flex flex-col">
        <h3 className="text-label-sm text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Themes
        </h3>
        <div className="grid grid-cols-2 gap-2 overflow-y-auto flex-1 pr-1">
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
              <div className="relative w-9 h-9 rounded-full overflow-hidden shadow-sm border border-border/50">
                <div
                  className="absolute inset-0 w-1/2 h-full"
                  style={{ backgroundColor: theme.preview[0] }}
                />
                <div
                  className="absolute right-0 top-0 w-1/2 h-full"
                  style={{ backgroundColor: theme.preview[1] }}
                />
                {activeTheme === theme.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Check className="h-3.5 w-3.5 text-white drop-shadow" />
                  </div>
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
