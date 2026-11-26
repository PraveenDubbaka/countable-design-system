// Renders the active guided tour's spotlight highlight + step instructions on top of the REAL app
// screens (no mock/separate prototype) so a PO can click through an actual use case end to end.
// Mounted once in App.tsx, inside the router, as a sibling of <Routes>.
//
// The instruction panel is DOCKED to a fixed spot on screen (bottom-center) rather than positioned
// relative to the target element. Earlier versions tried to float the panel next to the highlight,
// but that made the panel — and with it, the only "click here" cue — disappear whenever the target
// was off-screen, mid-scroll, or in an awkward spot where the two would overlap. Docking it removes
// that failure mode entirely: the instructions are always in the same place, always visible, and
// the spotlight ring + bouncing badge on the target itself are a secondary, best-effort local cue.
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, MousePointerClick, SearchX, X } from "lucide-react";
import { useTour } from "@/store/tourStore";

const PANEL_WIDTH = 380;
const PANEL_MARGIN = 20;

const CLICK_BADGE_WIDTH = 96;
const CLICK_BADGE_HEIGHT = 26;

function boxesOverlap(a: { top: number; left: number; width: number; height: number }, b: { top: number; left: number; width: number; height: number }): boolean {
  return a.left < b.left + b.width && a.left + a.width > b.left && a.top < b.top + b.height && a.top + a.height > b.top;
}

/** The docked panel's own box, in pixels, so the click-badge placement can steer clear of it. */
function panelBox(panelHeight: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return { top: vh - PANEL_MARGIN - panelHeight, left: (vw - PANEL_WIDTH) / 2, width: PANEL_WIDTH, height: panelHeight };
}

// Prefers sitting just above the target (closest to a user's natural "look down, then click"
// path), but steps aside — below, then left/right of the ring — whenever the docked panel would
// otherwise cover it (mainly when the target itself sits low on the screen).
function clickBadgeStyle(rect: DOMRect, panel: { top: number; left: number; width: number; height: number }) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const centerX = Math.min(Math.max(rect.left + rect.width / 2, CLICK_BADGE_WIDTH / 2 + 8), vw - CLICK_BADGE_WIDTH / 2 - 8);
  const centerY = Math.min(Math.max(rect.top + rect.height / 2, CLICK_BADGE_HEIGHT / 2 + 8), vh - CLICK_BADGE_HEIGHT / 2 - 8);

  const candidates = [
    {
      box: { top: rect.top - 14 - CLICK_BADGE_HEIGHT, left: centerX - CLICK_BADGE_WIDTH / 2, width: CLICK_BADGE_WIDTH, height: CLICK_BADGE_HEIGHT },
      style: { top: rect.top - 14, left: centerX, transform: "translate(-50%, -100%)", animation: "tour-bounce-up 1.2s ease-in-out infinite" },
    },
    {
      box: { top: rect.bottom + 14, left: centerX - CLICK_BADGE_WIDTH / 2, width: CLICK_BADGE_WIDTH, height: CLICK_BADGE_HEIGHT },
      style: { top: rect.bottom + 14, left: centerX, transform: "translate(-50%, 0)", animation: "tour-bounce-down 1.2s ease-in-out infinite" },
    },
    {
      box: { top: centerY - CLICK_BADGE_HEIGHT / 2, left: rect.right + 10, width: CLICK_BADGE_WIDTH, height: CLICK_BADGE_HEIGHT },
      style: { top: centerY, left: rect.right + 10, transform: "translate(0, -50%)", animation: "tour-bounce-right 1.2s ease-in-out infinite" },
    },
    {
      box: { top: centerY - CLICK_BADGE_HEIGHT / 2, left: rect.left - 10 - CLICK_BADGE_WIDTH, width: CLICK_BADGE_WIDTH, height: CLICK_BADGE_HEIGHT },
      style: { top: centerY, left: rect.left - 10, transform: "translate(-100%, -50%)", animation: "tour-bounce-left 1.2s ease-in-out infinite" },
    },
  ];

  const clear = candidates.find(c => c.box.top >= 4 && c.box.left >= 4 && c.box.top + c.box.height <= vh - 4 && c.box.left + c.box.width <= vw - 4 && !boxesOverlap(c.box, panel));
  // The badge's own z-index already guarantees it's visible even in the fallback case.
  return (clear ?? candidates[0]).style;
}

export function TourOverlay() {
  const { activeTour, stepIndex, exitTour, nextStep, prevStep } = useTour();
  const navigate = useNavigate();
  const location = useLocation();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const targetRef = useRef<Element | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [panelHeight, setPanelHeight] = useState(220);

  const step = activeTour?.steps[stepIndex] ?? null;

  // Most steps are reached by the user clicking the PREVIOUS step's real, highlighted control —
  // that's the actual clickthrough. `enterRoute` is only set on the handful of steps with no
  // realistic same-tab click path (a tour's very first step, or a control that opens a new tab in
  // production) — for those we navigate programmatically as soon as the step becomes active.
  useEffect(() => {
    if (!step?.enterRoute) return;
    if (location.pathname !== step.enterRoute) {
      navigate(step.enterRoute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Poll for the target element to exist (it may mount async after navigation/data load).
  useEffect(() => {
    setRect(null);
    targetRef.current = null;
    if (!step) return;
    let cancelled = false;
    let raf = 0;
    let attempts = 0;
    const tryFind = () => {
      if (cancelled) return;
      const el = document.querySelector(step.selector);
      if (el) {
        targetRef.current = el;
        setRect(el.getBoundingClientRect());
        el.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      } else if (attempts++ < 400) {
        raf = requestAnimationFrame(tryFind);
      }
    };
    tryFind();
    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
    };
  }, [step?.selector, step?.route]);

  // Keep the highlight glued to the target through scrolling / layout shifts.
  useEffect(() => {
    if (!step) return;
    const update = () => {
      const el = targetRef.current;
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const interval = window.setInterval(update, 250);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      window.clearInterval(interval);
    };
  }, [step]);

  // Track the docked panel's real height so the click-badge placement can steer clear of it.
  useEffect(() => {
    const measure = () => {
      if (panelRef.current) setPanelHeight(panelRef.current.getBoundingClientRect().height);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [step, rect]);

  // Click-to-advance: clicking the real, highlighted control moves the tour forward. Listens on
  // pointerdown rather than click — several Radix primitives (Select, among others) call
  // preventDefault() in their own pointerdown handler specifically to suppress the browser's
  // compatibility click event that would otherwise follow, which would silently swallow a
  // click-based listener here even though the control visibly responded to the press.
  useEffect(() => {
    if (!step || step.advance === "next") return;
    const el = targetRef.current;
    if (!el) return;
    const handler = () => window.setTimeout(() => nextStep(), 150);
    el.addEventListener("pointerdown", handler, { once: true });
    return () => el.removeEventListener("pointerdown", handler);
  }, [step, rect, nextStep]);

  // Esc exits the tour.
  useEffect(() => {
    if (!activeTour) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitTour();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeTour, exitTour]);

  if (!activeTour || !step) return null;

  const stepNum = stepIndex + 1;
  const total = activeTour.steps.length;
  const panel = panelBox(panelHeight);

  return (
    <>
      {rect && (
        <div
          className="fixed z-[9998] rounded-lg"
          style={{
            top: rect.top - 5,
            left: rect.left - 5,
            width: rect.width + 10,
            height: rect.height + 10,
            boxShadow: "0 0 0 3px hsl(var(--primary)), 0 0 0 7px hsl(var(--primary) / 0.35), 0 0 0 9999px rgba(15, 23, 42, 0.45)",
            pointerEvents: "none",
            transition: "top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease",
            animation: "tour-pulse 1.4s ease-in-out infinite",
          }}
        />
      )}
      {/* A badge glued to the highlighted control itself — a secondary, local "click here" cue on
          top of the docked panel below, which is the one guaranteed to always be visible. */}
      {rect && step.advance !== "next" && (
        <div
          className="fixed z-[10000] flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1 shadow-lg whitespace-nowrap"
          style={{ pointerEvents: "none", ...clickBadgeStyle(rect, panel) }}
        >
          <MousePointerClick className="h-3 w-3" />
          Click here
        </div>
      )}
      {/* The instructions, docked to the bottom-center of the screen — always in the same place,
          regardless of where the target is, whether it's found yet, or how the page is scrolled. */}
      <div
        ref={panelRef}
        className="fixed z-[9999] bg-card border border-border rounded-xl shadow-2xl p-4"
        style={{ bottom: PANEL_MARGIN, left: "50%", transform: "translateX(-50%)", width: PANEL_WIDTH }}
      >
        <div className="flex items-center justify-between mb-1.5 gap-2">
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wide truncate">
            {activeTour.title} &middot; Step {stepNum} of {total}
          </span>
          <button onClick={exitTour} className="text-muted-foreground hover:text-foreground shrink-0" aria-label="Exit walkthrough">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <h4 className="text-sm font-semibold text-foreground mb-1 leading-snug">{step.title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{step.body}</p>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={prevStep}
            disabled={stepIndex === 0}
            className="text-xs text-muted-foreground disabled:opacity-30 flex items-center gap-1 hover:text-foreground shrink-0"
          >
            <ArrowLeft className="h-3 w-3" /> Back
          </button>
          {step.advance === "next" ? (
            <button
              onClick={nextStep}
              className="text-xs font-medium text-primary-foreground bg-primary px-3 py-1.5 rounded-lg flex items-center gap-1 hover:opacity-90 shrink-0"
            >
              {stepNum === total ? "Finish" : "Next"} <ArrowRight className="h-3 w-3" />
            </button>
          ) : rect ? (
            <span className="text-xs text-primary-foreground font-medium flex items-center gap-1.5 bg-primary rounded-full px-2.5 py-1 shrink-0">
              <MousePointerClick className="h-3.5 w-3.5" />
              Click the highlighted spot
            </span>
          ) : (
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 shrink-0">
              <SearchX className="h-3.5 w-3.5 animate-pulse" />
              Finding this step on the page&hellip;
            </span>
          )}
        </div>
        <div className="flex gap-1 mt-3">
          {activeTour.steps.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{ backgroundColor: i <= stepIndex ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes tour-pulse {
          0%, 100% { box-shadow: 0 0 0 3px hsl(var(--primary)), 0 0 0 7px hsl(var(--primary) / 0.35), 0 0 0 9999px rgba(15, 23, 42, 0.45); }
          50% { box-shadow: 0 0 0 3px hsl(var(--primary)), 0 0 0 12px hsl(var(--primary) / 0.15), 0 0 0 9999px rgba(15, 23, 42, 0.45); }
        }
        @keyframes tour-bounce-up {
          0%, 100% { transform: translate(-50%, -100%); }
          50% { transform: translate(-50%, calc(-100% - 6px)); }
        }
        @keyframes tour-bounce-down {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, 6px); }
        }
        @keyframes tour-bounce-right {
          0%, 100% { transform: translate(0, -50%); }
          50% { transform: translate(6px, -50%); }
        }
        @keyframes tour-bounce-left {
          0%, 100% { transform: translate(-100%, -50%); }
          50% { transform: translate(calc(-100% - 6px), -50%); }
        }
      `}</style>
    </>
  );
}
