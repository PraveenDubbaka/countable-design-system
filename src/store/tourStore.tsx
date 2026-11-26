// Lightweight guided-clickthrough-tour state, shared across the whole app so a tour can span
// multiple routes (Dashboard -> Engagement -> Trial Balance -> Workbook, etc). Mounted once at
// the App root; TourOverlay (src/components/GuidedTour/TourOverlay.tsx) reads this context to
// render the spotlight + tooltip and to auto-navigate between each step's route.
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export interface TourStep {
  /** Route (relative to the router basename) this step's target is expected to live on — informational; reached either by a real click on the PREVIOUS step's target, or by `enterRoute` below. */
  route: string;
  /** CSS selector for the element to highlight, e.g. '[data-tour="pw-add-partner"]'. */
  selector: string;
  title: string;
  body: string;
  placement?: "top" | "bottom" | "left" | "right";
  /** "click" (default): advance when the user clicks the highlighted element (the real control — this is the actual clickthrough). "next": show a Next button instead, for the rare step with nothing sensible to click. */
  advance?: "click" | "next";
  /** Only set when there is no realistic same-tab click path to this step's route (e.g. the real
   * control opens a new tab/window in production, or this is a tour's very first step). When set,
   * the overlay navigates here as soon as the step becomes active, instead of waiting for a click. */
  enterRoute?: string;
}

export interface UseCaseTour {
  id: string;
  title: string;
  summary: string;
  /** "new" = start-from-scratch flows, "carry-forward" = continuing-engagement flows, "mapping", "reporting", "lifecycle" */
  category: string;
  steps: TourStep[];
}

interface TourState {
  activeTour: UseCaseTour | null;
  stepIndex: number;
}

interface TourContextValue extends TourState {
  startTour: (tour: UseCaseTour) => void;
  exitTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TourState>({ activeTour: null, stepIndex: 0 });

  const startTour = useCallback((tour: UseCaseTour) => setState({ activeTour: tour, stepIndex: 0 }), []);
  const exitTour = useCallback(() => setState({ activeTour: null, stepIndex: 0 }), []);
  const nextStep = useCallback(() => {
    setState(s => {
      if (!s.activeTour) return s;
      const next = s.stepIndex + 1;
      if (next >= s.activeTour.steps.length) return { activeTour: null, stepIndex: 0 };
      return { ...s, stepIndex: next };
    });
  }, []);
  const prevStep = useCallback(() => {
    setState(s => (s.activeTour ? { ...s, stepIndex: Math.max(0, s.stepIndex - 1) } : s));
  }, []);
  const goToStep = useCallback((index: number) => {
    setState(s => (s.activeTour ? { ...s, stepIndex: Math.min(Math.max(0, index), s.activeTour.steps.length - 1) } : s));
  }, []);

  return (
    <TourContext.Provider value={{ ...state, startTour, exitTour, nextStep, prevStep, goToStep }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within a TourProvider");
  return ctx;
}
