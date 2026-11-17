import { generateEngagementLetterChecklist } from "@/lib/globalTemplates";
import { LETTER_MARGIN_LABELS, LETTER_MARGIN_PX, normalizeLetterMargin, type LetterMargin } from "@/lib/letterMargins";

export type TemplateMargin = LetterMargin;
export const TEMPLATE_MARGIN_LABELS = LETTER_MARGIN_LABELS;
export const TEMPLATE_MARGIN_PX = LETTER_MARGIN_PX;
export const LETTER_TEMPLATE_NAME = "Engagement Letter Compilation - Master (Corp)";
export const LETTER_TEMPLATE_KEY = "letter-template-glt-1-1";
export const LETTER_FIELDS = [
  "Date Picker",
  "Date",
  "Engagement Letter Date",
  "Entity Name",
  "Addresse - Management",
  "Addresse - Board of directors",
  "Addresse - Shareholders",
  "Year end date (CY)",
  "Year end date (PY)",
  "Note X",
  "Client City",
  "City",
  "Province",
  "Complete address",
  "Street Address",
  "Firm address",
  "Postal Code",
  "First Name",
  "Last Name",
  "Balance Sheet",
  "Statement of income and Retained Earnings",
  "Firm Name",
  "Firm Signature",
  "Client Signature",
  "Client Signed Date",
  "Partner Name",
];
const SOURCE_FIELDS = [
  "Firm Name",
  "Firm Address",
  "Entity Name",
  "Complete address",
  "Date",
  "First Name",
  "Period Ended",
  "Intended Users",
  "Intended Purpose",
  "Preparer Name",
  "Client Signature",
  "Client Signed Date",
];
export const LETTER_SECTION_NAMES = [
  "Header",
  "The Objective and Scope of the Compilation",
  "Intended Use of the Compiled Financial Information",
  "The Firm's Responsibilities",
  "Reporting",
  "Confidentiality",
  "Communications",
  "Use of Information",
  "Ownership (Optional)",
  "File Inspections (Optional)",
  "Accounting Advice (Optional)",
  "Other Services (Optional)",
  "Governing Legislation",
  "Dispute Resolution (Optional)",
  "Indemnity (Optional)",
];
export interface LetterTemplateSection {
  id: string;
  name: string;
  html: string;
  enabled?: boolean;
}
export interface LetterTemplateDraft {
  margin: TemplateMargin;
  sections: LetterTemplateSection[];
}

export function fieldHtml(name: string) {
  return `<span class="template-field" contenteditable="false">${name}</span>`;
}
export function createLetterTemplate(): LetterTemplateDraft {
  const source = generateEngagementLetterChecklist().sections[0]?.questions[0]?.text ?? "";
  const paragraphs = source.match(/<p\b[^>]*>[\s\S]*?<\/p>/g) ?? [];
  const fields = (html: string) =>
    SOURCE_FIELDS.reduce((text, field) => text.split(field).join(fieldHtml(field)), html);
  const content = [
    `<p>${fieldHtml("Firm Name")}<br/>${fieldHtml("Firm Address")}</p><p>${fieldHtml("Date")}</p>${fields(paragraphs.slice(1, 4).join(""))}`,
    fields(paragraphs[4] ?? ""),
    fields(paragraphs[5] ?? ""),
    fields(paragraphs[6] ?? ""),
    fields(paragraphs.slice(7).join("")),
  ];
  return {
    margin: "default",
    sections: LETTER_SECTION_NAMES.map((name, i) => ({ id: `letter-section-${i}`, name, html: content[i] ?? "" })),
  };
}
export function loadLetterTemplate(): LetterTemplateDraft {
  const initial = createLetterTemplate();
  try {
    const raw = localStorage.getItem(LETTER_TEMPLATE_KEY);
    if (!raw) return initial;
    const saved = JSON.parse(raw);
    if (!["default", "narrow", "wide", "1in", "2in"].includes(saved.margin) || !Array.isArray(saved.sections))
      return initial;
    if (
      !saved.sections.every(
        (s: LetterTemplateSection) =>
          typeof s.id === "string" && typeof s.name === "string" && typeof s.html === "string",
      )
    )
      return initial;
    return { margin: normalizeLetterMargin(saved.margin, saved.marginVersion !== 2), sections: saved.sections };
  } catch {
    return initial;
  }
}
export function saveLetterTemplate(
  draft: LetterTemplateDraft,
  readOnly: boolean,
  fail = false,
  key = LETTER_TEMPLATE_KEY,
) {
  if (readOnly) throw new Error("Read-only template");
  if (fail) throw new Error("Save failed");
  localStorage.setItem(key, JSON.stringify({ ...draft, marginVersion: 2 }));
}
export function letterTemplateChanged(draft: LetterTemplateDraft, saved: LetterTemplateDraft) {
  return JSON.stringify(draft) !== JSON.stringify(saved);
}
export function letterMarginChanged(draft: LetterTemplateDraft, saved: LetterTemplateDraft) {
  return draft.margin !== saved.margin;
}
export function cancelLetterTemplate(saved: LetterTemplateDraft): LetterTemplateDraft {
  return structuredClone(saved);
}
