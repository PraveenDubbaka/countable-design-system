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

type TOCListener = (s: TOCSnapshot | null) => void;

interface TOCStoreState {
  snapshot: TOCSnapshot | null;
  listeners: Set<TOCListener>;
}

const getStore = () => {
  const scope = globalThis as typeof globalThis & {
    __countableChecklistTOCStore?: TOCStoreState;
  };

  if (!scope.__countableChecklistTOCStore) {
    scope.__countableChecklistTOCStore = {
      snapshot: null,
      listeners: new Set<TOCListener>(),
    };
  }

  return scope.__countableChecklistTOCStore;
};

const store = getStore();

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
  store.snapshot = computeTOCFromChecklist(checklist);
  store.listeners.forEach((fn) => fn(store.snapshot));
};

export const clearChecklistTOC = () => {
  store.snapshot = null;
  store.listeners.forEach((fn) => fn(null));
};

export const getChecklistTOC = () => store.snapshot;

export const subscribeChecklistTOC = (fn: TOCListener) => {
  store.listeners.add(fn);
  fn(store.snapshot);
  return () => {
    store.listeners.delete(fn);
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
