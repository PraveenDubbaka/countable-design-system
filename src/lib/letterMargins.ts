export type LetterMargin = "default" | "narrow" | "wide";
// Left and right page margin at 96 px per inch (CPT-18673: letters are normally 1 inch left and right).
export const LETTER_MARGIN_PX: Record<LetterMargin, number> = { default: 96, narrow: 48, wide: 144 };
export const LETTER_MARGIN_LABELS: Record<LetterMargin, string> = {
  default: "Default (1 in)",
  narrow: "Narrow (0.5 in)",
  wide: "Wide (1.5 in)",
};

// Normalize legacy selections to the corresponding supported margin presets.
export function normalizeLetterMargin(value: unknown, legacy = false): LetterMargin {
  if (value === "1in") return "default";
  if (value === "2in") return "wide";
  if (value === "default" && legacy) return "narrow";
  if (value === "narrow" || value === "wide") return value;
  return "default";
}
