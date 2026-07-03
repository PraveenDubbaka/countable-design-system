import { useEffect, useMemo, useState } from "react";
import { DocumentSectionBlock } from "@/components/DocumentView";
import type { Checklist, Section, NumberingFormat } from "@/types/checklist";

const storageKey = (id: string) => `checklist-signoff-section:${id}`;

const DISCLAIMER =
  "By signing off below, you are agreeing to this statement that you have reviewed all the relevant associated working papers and cleared all your queries and documented the matters appropriately that may cause the financial statements and note disclosures, if applicable, to be false and/or misleading.";

/** Build the default sign-off section. Users can then edit it via the standard
 *  checklist builder (edit text, add/remove columns, add rows, etc). */
function buildDefaultSignOffSection(checklistId: string): Section {
  const now = Date.now();
  return {
    id: `signoff-section-${checklistId}`,
    title: "Sign Off",
    isExpanded: true,
    questions: [
      // Disclaimer paragraph (single-column text block)
      {
        id: `signoff-disclaimer-${now}`,
        text: "",
        answerType: "none",
        required: false,
        columnLayout: {
          columns: 1,
          cells: [
            {
              id: `cell-disclaimer-${now}`,
              content: DISCLAIMER,
              blockType: "text",
            },
          ],
        },
      },
      // Signature row: Date · Preparer Name · Sign-off
      {
        id: `signoff-row-${now}`,
        text: "",
        answerType: "none",
        required: false,
        columnLayout: {
          columns: 3,
          cells: [
            { id: `cell-date-${now}`, content: "", placeholder: "Date", blockType: "date" },
            { id: `cell-name-${now}`, content: "", placeholder: "Preparer Name", blockType: "free-text" },
            { id: `cell-signoff-${now}`, content: "", placeholder: "Sign Off", blockType: "free-text" },
          ],
        },
      },
    ],
  };
}

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
  const [section, setSection] = useState<Section | null>(null);

  // Load or initialize on mount / checklist change
  useEffect(() => {
    if (!checklist.id) return;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        setSection(JSON.parse(raw) as Section);
        return;
      }
    } catch {
      /* fall through */
    }
    setSection(buildDefaultSignOffSection(checklist.id));
  }, [checklist.id, key]);

  // Persist edits
  useEffect(() => {
    if (!section) return;
    try {
      localStorage.setItem(key, JSON.stringify(section));
    } catch {
      /* noop */
    }
  }, [section, key]);

  if (!section) return null;

  const handleAddItem = () => {
    const newQ = {
      id: `q-${Date.now()}`,
      text: "",
      answerType: "long-answer" as const,
      required: false,
    };
    setSection({ ...section, questions: [...section.questions, newQ] });
  };

  // Reset the sign-off section back to defaults (delete = reset here)
  const handleReset = () => {
    if (window.confirm("Reset the Sign Off section to its default layout?")) {
      const fresh = buildDefaultSignOffSection(checklist.id);
      setSection(fresh);
    }
  };

  return (
    <DocumentSectionBlock
      section={section}
      sectionIndex={0}
      onUpdate={(s) => setSection(s)}
      onDelete={handleReset}
      onAddItem={handleAddItem}
      onAddCategoryAtPosition={() => {
        /* Sign-off is a singleton section; no-op */
      }}
      isPreviewMode={isPreviewMode}
      isEngagementMode={isEngagementMode}
      numberingFormat={numberingFormat}
      showNumbering={showNumbering}
      onNumberingFormatChange={() => {}}
      onShowNumberingChange={() => {}}
    />
  );
}
