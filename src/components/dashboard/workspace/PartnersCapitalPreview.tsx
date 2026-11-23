import CapitalStatementPage from "./CapitalStatementPage";

interface PartnersCapitalPreviewProps {
 engagementId: string;
 /** Unused — Partnerships have no trust-variant concept; accepted so FSPageViewer can assign
 * PartnersCapitalPreview/TrustCapitalPreview to one variable with a shared prop type. */
 trustVariant?: "unit" | "other";
 clientName: string;
 yearEnd: string;
 isEditMode?: boolean;
 onContentChanged?: (hasChanges: boolean) => void;
}

const PartnersCapitalPreview = ({ trustVariant: _trustVariant, ...props }: PartnersCapitalPreviewProps) => (
 <CapitalStatementPage {...props} entityType="Partnership" />
);

export default PartnersCapitalPreview;
