import type { LetterTemplateSection } from "@/lib/letterTemplate";

export const LETTER_PANEL_SECTION_NAMES = ["Subject", "The Objective and Scope of the Compilation", "Intended Use of the Compiled Financial Information", "The Firm's Responsibilities", "Reporting", "Confidentiality", "Communications", "Use of Information", "Ownership (Optional)", "File Inspections (Optional)", "Accounting Advice (Optional)", "Other Services (Optional)", "Governing Legislation (Optional)", "Dispute Resolution (Optional)", "Indemnity (Optional)", "Limitation of Liability (Optional)", "Time Frames (Optional)", "Fees at Regular Billing Rates (Optional)", "Estimated Fees (Optional)", "Retainer (Optional)", "Billing (Optional)", "Costs of Responding to Government or Legal Processes (Optional)", "Termination (Optional)", "Survival of Terms (Optional)", "Confidentiality Relating to Third-Party Agreements (Optional)", "Communications (Optional)", "Conclusion", "Signature"];

export function letterPanelSectionName(name: string) {
  return name === "Header" ? "Subject" : name === "Governing Legislation" ? "Governing Legislation (Optional)" : name;
}

// Catalog-only entries stay out of the document until explicitly edited.
export function letterPanelSections(sections: LetterTemplateSection[]): LetterTemplateSection[] {
  const catalog = LETTER_PANEL_SECTION_NAMES.map((name, index) => sections.find(section => letterPanelSectionName(section.name) === name) ?? { id: `letter-panel-section-${index}`, name, html: "" });
  return [...catalog, ...sections.filter(section => !LETTER_PANEL_SECTION_NAMES.includes(letterPanelSectionName(section.name)))];
}