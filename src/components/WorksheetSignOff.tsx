import { ChecklistSignOff } from "@/components/ChecklistSignOff";
import type { Checklist } from "@/types/checklist";

/**
 * Standard sign-off block for worksheets. Wraps ChecklistSignOff so every
 * worksheet gets the same four-role Preparer / Partner / Quality Reviewer /
 * Admin-Tax Reviewer UI as regular checklists. Storage is isolated per
 * worksheet via a synthetic checklist id.
 */
export function WorksheetSignOff({
  worksheetKey,
  engagementId = "default",
  isEngagementMode = true,
  isPreviewMode = false,
}: {
  worksheetKey: string;
  engagementId?: string;
  isEngagementMode?: boolean;
  isPreviewMode?: boolean;
}) {
  const id = `worksheet:${engagementId}:${worksheetKey}`;
  const pseudoChecklist = { id } as unknown as Checklist;
  return (
    <ChecklistSignOff
      checklist={pseudoChecklist}
      isEngagementMode={isEngagementMode}
      isPreviewMode={isPreviewMode}
    />
  );
}
