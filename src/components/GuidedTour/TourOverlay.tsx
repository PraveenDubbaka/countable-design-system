// Renders the active guided tour's spotlight highlight + step tooltip on top of the REAL app
// screens (no mock/separate prototype) so a PO can click through an actual use case end to end.
// Mounted once in App.tsx, inside the router, as a sibling of <Routes>.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, MousePointerClick, X } from "lucide-react";
import { useTour } from "@/store/tourStore";

const TOOLTIP_WIDTH = 320;
const GAP = 14;

const EST_HEIGHT = 190;

function fitsViewport(top: number, left: number, vw: number, vh: number): boolean {
  return top >= 8 && left >= 8 && top + EST_HEIGHT <= vh - 8 && left + TOOLTIP_WIDTH <= vw - 8;
}

function overlapsRect(top: number, left: number, rect: DOMRect): boolean {
  return left < rect.right && left + TOOLTIP_WIDTH > rect.left && top < rect.bottom && top + EST_HEIGHT > rect.top;
}

const CLICK_BADGE_WIDTH = 96;
const CLICK_BADGE_HEIGHT = 26;

function boxesOverlap(a: { top: number; left: number; width: number; height: number }, b: { top: number; left: number; width: number; height: number }): boolean {
  return a.left < b.left + b.width && a.left + a.width > b.left && a.top < b.top + b.height && a.top + a.height > b.top;
}

// Prefers sitting just above the target (closest to a user's natural "look down, then click"
// path), but steps aside — below, then left/right of the ring — whenever the tooltip itself (which
// can land on any side, including a far corner when nothing fits cleanly) would otherwise cover it.
function clickBadgeStyle(rect: DOMRect, tooltipBox: { top: number; left: number }): CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tooltip = { ...tooltipBox, width: TOOLTIP_WIDTH, height: EST_HEIGHT };
  const centerX = Math.min(Math.max(rect.left + rect.width / 2, CLICK_BADGE_WIDTH / 2 + 8), vw - CLICK_BADGE_WIDTH / 2 - 8);
  const centerY = Math.min(Math.max(rect.top + rect.height / 2, CLICK_BADGE_HEIGHT / 2 + 8), vh - CLICK_BADGE_HEIGHT / 2 - 8);

  const candidates: { box: { top: number; left: number; width: number; height: number }; style: CSSProperties }[] = [
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

  const clear = candidates.find(c => c.box.top >= 4 && c.box.left >= 4 && c.box.top + c.box.height <= vh - 4 && c.box.left + c.box.width <= vw - 4 && !boxesOverlap(c.box, tooltip));
  // z-index already guarantees visibility even in the fallback case, so a plain "above" default is fine.
  return (clear ?? candidates[0]).style;
}

// The tooltip must never cover the element it's pointing at — a click meant for the highlighted
// control would land on the (non-interactive) tooltip card instead and silently do nothing. So
// this tries every side, in the caller's preferred order first, and only accepts a position that
// both fits the viewport AND doesn't overlap the target; if nothing qualifies (a very large target
// on a small viewport) it falls back to a fixed viewport corner, away from the target entirely.
function clampTooltipStyle(rect: DOMRect, placement: "top" | "bottom" | "left" | "right" | undefined): CSSProperties {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const candidates: Record<string, { top: number; left: number }> = {
    right: { top: rect.top, left: rect.right + GAP },
    left: { top: rect.top, left: rect.left - TOOLTIP_WIDTH - GAP },
    bottom: { top: rect.bottom + GAP, left: rect.left },
    top: { top: rect.top - EST_HEIGHT - GAP, left: rect.left },
  };
  const order = [placement ?? "right", "right", "left", "bottom", "top"].filter((v, i, a) => a.indexOf(v) === i);

  for (const key of order) {
    const c = candidates[key as keyof typeof candidates];
    if (c && fitsViewport(c.top, c.left, vw, vh) && !overlapsRect(c.top, c.left, rect)) {
      return { top: c.top, left: c.left, width: TOOLTIP_WIDTH };
    }
  }
  // Nothing clean fits — park in whichever viewport corner is farthest from the target's center,
  // so it never sits on top of it.
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const top = cy < vh / 2 ? vh - EST_HEIGHT - 16 : 16;
  const left = cx < vw / 2 ? vw - TOOLTIP_WIDTH - 16 : 16;
  return { top, left, width: TOOLTIP_WIDTH };
}

export function TourOverlay() {
  const { activeTour, stepIndex, exitTour, nextStep, prevStep } = useTour();
  const navigate = useNavigate();
  const location = useLocation();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const targetRef = useRef<Element | null>(null);

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
        el.scrollIntoView({ block: "center", behavior: "smooth" });
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
  const tooltipStyle = rect ? clampTooltipStyle(rect, step.placement) : null;

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
      {/* A badge glued to the highlighted control itself — independent of where the tooltip ends
          up (it can land far away when the overlap-avoidance logic falls back to a corner), so
          there's always an unmistakable "click here" cue right at the thing to click. */}
      {rect && tooltipStyle && step.advance !== "next" && (
        <div
          className="fixed z-[10000] flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1 shadow-lg whitespace-nowrap"
          style={{ pointerEvents: "none", ...clickBadgeStyle(rect, tooltipStyle as { top: number; left: number }) }}
        >
          <MousePointerClick className="h-3 w-3" />
          Click here
        </div>
      )}
      {rect && tooltipStyle && (
        <div
          className="fixed z-[9999] bg-card border border-border rounded-xl shadow-2xl p-4"
          style={tooltipStyle}
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
              className="text-xs text-muted-foreground disabled:opacity-30 flex items-center gap-1 hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
            {step.advance === "next" ? (
              <button
                onClick={nextStep}
                className="text-xs font-medium text-primary-foreground bg-primary px-3 py-1.5 rounded-lg flex items-center gap-1 hover:opacity-90"
              >
                {stepNum === total ? "Finish" : "Next"} <ArrowRight className="h-3 w-3" />
              </button>
            ) : (
              <span className="text-xs text-primary-foreground font-medium flex items-center gap-1.5 bg-primary rounded-full px-2.5 py-1">
                <MousePointerClick className="h-3.5 w-3.5" />
                Click the highlighted spot
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
      )}
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
