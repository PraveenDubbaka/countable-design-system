import type { Checklist } from "@/types/checklist";

export interface TOCSection {
  id: string;
  title: string;
  total: number;
  completed: number;
}

export interface TOCSnapshot {
  checklistId: string;
  checklistTitle: string;
  sections: TOCSection[];
}

let snapshot: TOCSnapshot | null = null;
const listeners = new Set<(s: TOCSnapshot | null) => void>();

const isAnswered = (a?: string) => {
  if (a === undefined || a === null) return false;
  const s = String(a).trim();
  return s.length > 0;
};

export const computeTOCFromChecklist = (checklist: Checklist | null | undefined): TOCSnapshot | null => {
  if (!checklist) return null;
  const sections: TOCSection[] = (checklist.sections || []).map((s) => {
    let total = 0;
    let completed = 0;
    const walk = (qs: any[]) => {
      qs.forEach((q) => {
        if (q?.answerType && q.answerType !== "none") {
          total += 1;
          if (isAnswered(q.answer)) completed += 1;
        }
        if (q?.subQuestions?.length) walk(q.subQuestions);
      });
    };
    walk(s.questions || []);
    return { id: s.id, title: s.title, total, completed };
  });
  return {
    checklistId: checklist.id,
    checklistTitle: checklist.title,
    sections,
  };
};

export const publishChecklistTOC = (checklist: Checklist | null | undefined) => {
  snapshot = computeTOCFromChecklist(checklist);
  listeners.forEach((fn) => fn(snapshot));
};

export const clearChecklistTOC = () => {
  snapshot = null;
  listeners.forEach((fn) => fn(null));
};

export const getChecklistTOC = () => snapshot;

export const subscribeChecklistTOC = (fn: (s: TOCSnapshot | null) => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const scrollToSection = (sectionId: string) => {
  const el = document.getElementById(`checklist-section-${sectionId}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("ring-2", "ring-primary/40");
    setTimeout(() => el.classList.remove("ring-2", "ring-primary/40"), 1200);
  }
};
