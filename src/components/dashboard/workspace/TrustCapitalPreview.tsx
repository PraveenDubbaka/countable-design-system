import CapitalStatementPage from "./CapitalStatementPage";

interface TrustCapitalPreviewProps {
 engagementId: string;
 trustVariant?: "unit" | "other";
 clientName: string;
 yearEnd: string;
 isEditMode?: boolean;
 onContentChanged?: (hasChanges: boolean) => void;
}

const TrustCapitalPreview = (props: TrustCapitalPreviewProps) => (
 <CapitalStatementPage {...props} entityType="Trust" />
);

export default TrustCapitalPreview;
