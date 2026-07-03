import { useEffect, useMemo, useState } from "react";
import { DocumentSectionBlock } from "@/components/DocumentView";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { Checklist, Section, NumberingFormat } from "@/types/checklist";

const storageKey = (id: string) => `checklist-signoff-section:${id}`;
const stampKey = (id: string) => `checklist-signoff-stamp:${id}`;

const DISCLAIMER =
  "By signing off below, you are confirming that you have reviewed this working paper, cleared all outstanding queries, and appropriately documented any matters that could otherwise cause the financial statements and note disclosures to be false and/or misleading.";

type SignStamp = { preparerName: string; signedAt: string } | null;

function buildDefaultSignOffSection(checklistId: string): Section {
  const now = Date.now();
  return {
    id: `signoff-section-${checklistId}`,
    title: "Sign Off",
    isExpanded: true,
    questions: [
      {
        id: `signoff-disclaimer-${now}`,
        text: "",
        answerType: "none",
        required: false,
        columnLayout: {
          columns: 1,
          cells: [
            { id: `cell-disclaimer-${now}`, content: DISCLAIMER, blockType: "text" },
          ],
        },
      },
      {
        id: `signoff-row-${now}`,
        text: "",
        answerType: "none",
        required: false,
        columnLayout: {
          columns: 1,
          cells: [
            { id: `cell-signoff-${now}`, content: "", blockType: "signoff" },
          ],
        },
      },

    ],
  };
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
};

export function ChecklistSignOff({
  checklist,
  isPreviewMode = false,
  isEngagementMode = false,
  numberingFormat = "number",
  showNumbering = false,
}: {
  checklist: Checklist;
  isPreviewMode?: boolean;
  isEngagementMode?: boolean;
  numberingFormat?: NumberingFormat;
  showNumbering?: boolean;
}) {
  const key = useMemo(() => storageKey(checklist.id), [checklist.id]);
  const skey = useMemo(() => stampKey(checklist.id), [checklist.id]);
  const [section, setSection] = useState<Section | null>(null);
  const [stamp, setStamp] = useState<SignStamp>(null);

  useEffect(() => {
    if (!checklist.id) return;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as Section;
        // Migrate old disclaimer text to current wording
        const updated = {
          ...parsed,
          questions: parsed.questions.map((q) => {
            if (!q.columnLayout) return q;
            const cells = q.columnLayout.cells.map((c) =>
              c.blockType === 'text' && c.content !== DISCLAIMER && c.content.startsWith('By signing off below')
                ? { ...c, content: DISCLAIMER }
                : c
            );
            return { ...q, columnLayout: { ...q.columnLayout, cells } };
          }),
        };
        setSection(updated);
      } else {
        setSection(buildDefaultSignOffSection(checklist.id));
      }
    } catch {
      setSection(buildDefaultSignOffSection(checklist.id));
    }
    try {
      const rawStamp = localStorage.getItem(skey);
      setStamp(rawStamp ? (JSON.parse(rawStamp) as SignStamp) : null);
    } catch { setStamp(null); }
  }, [checklist.id, key, skey]);

  useEffect(() => {
    if (!section) return;
    try { localStorage.setItem(key, JSON.stringify(section)); } catch { /* noop */ }
  }, [section, key]);

  if (!section) return null;

  const handleAddItem = () => {
    setSection({
      ...section,
      questions: [
        ...section.questions,
        { id: `q-${Date.now()}`, text: "", answerType: "long-answer" as const, required: false },
      ],
    });
  };

  const handleReset = () => {
    if (window.confirm("Reset the Sign Off section to its default layout?")) {
      setSection(buildDefaultSignOffSection(checklist.id));
      localStorage.removeItem(skey);
      setStamp(null);
    }
  };

  const handleSignOff = () => {
    // Auto-fill Date + Preparer Name into the last row's cells (positions 0 and 1)
    const signedAt = new Date().toISOString();
    const preparerName = "Current User"; // TODO: wire to auth context
    const questions = [...section.questions];
    const rowIdx = questions.length - 1;
    const row = questions[rowIdx];
    if (row?.columnLayout) {
      const cells = [...row.columnLayout.cells];
      if (cells[0]) cells[0] = { ...cells[0], content: preparerName };
      if (cells[1]) cells[1] = { ...cells[1], content: signedAt.slice(0, 10) };

      questions[rowIdx] = { ...row, columnLayout: { ...row.columnLayout, cells } };
      setSection({ ...section, questions });
    }
    const newStamp = { preparerName, signedAt };
    setStamp(newStamp);
    try { localStorage.setItem(skey, JSON.stringify(newStamp)); } catch { /* noop */ }
  };

  const handleUnsign = () => {
    localStorage.removeItem(skey);
    setStamp(null);
  };

  return (
    <div className="space-y-3">
      <DocumentSectionBlock
        section={section}
        sectionIndex={0}
        onUpdate={(s) => setSection(s)}
        onDelete={handleReset}
        onAddItem={handleAddItem}
        onAddCategoryAtPosition={() => { /* singleton */ }}
        isPreviewMode={isPreviewMode || isEngagementMode}
        isEngagementMode={isEngagementMode}
        numberingFormat={numberingFormat}
        showNumbering={showNumbering}
        onNumberingFormatChange={() => {}}
        onShowNumberingChange={() => {}}
      />

    </div>
  );
}
