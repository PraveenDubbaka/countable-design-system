import CoverPagePreview from "@/components/dashboard/workspace/CoverPagePreview";
import TableOfContentsPreview from "@/components/dashboard/workspace/TableOfContentsPreview";
import CompilationReportPreview from "@/components/dashboard/workspace/CompilationReportPreview";
import AuditorReportPreview from "@/components/dashboard/workspace/AuditorReportPreview";
import BalanceSheetPreview from "@/components/dashboard/workspace/BalanceSheetPreview";
import IncomeStatementPreview from "@/components/dashboard/workspace/IncomeStatementPreview";
import PartnersCapitalPreview from "@/components/dashboard/workspace/PartnersCapitalPreview";
import TrustCapitalPreview from "@/components/dashboard/workspace/TrustCapitalPreview";
import CashFlowsPreview from "@/components/dashboard/workspace/CashFlowsPreview";
import NotesPreview from "@/components/dashboard/workspace/NotesPreview";

export type FSPageType = 'cover' | 'toc' | 'bs' | 'is' | 'cf' | 'eq' | 'notes' | 'comp-report' | 'auditor-report';

interface FSPageViewerProps {
 pageType: FSPageType;
 isEditing?: boolean;
 isCompilation?: boolean;
 isUS?: boolean;
 engagementId?: string;
 /** The engagement client's entity type — drives Balance Sheet/Income Statement/Notes content
 * and which page 'eq' renders (Statement of Partners'/Trust Capital for Partnership/Trust,
 * unchanged Income Statement fallback for Corporation and Audit). */
 entityType?: string;
}

const FSPageContent = ({ pageType, isEditing, isCompilation, entityType = "Corporation" }: FSPageViewerProps) => {
 const templateType = isCompilation ? 'compilation' : null;

 switch (pageType) {
 case 'cover':
 return <CoverPagePreview isEditMode={isEditing} templateType={templateType} />;
 case 'toc':
 return <TableOfContentsPreview />;
 case 'comp-report':
 return <CompilationReportPreview isEditMode={isEditing} />;
 case 'auditor-report':
 return <AuditorReportPreview />;
 case 'bs':
 return <BalanceSheetPreview isEditMode={isEditing} entityType={entityType} />;
 case 'is':
 return <IncomeStatementPreview isEditMode={isEditing} entityType={entityType} />;
 case 'eq':
 if (entityType === "Partnership") return <PartnersCapitalPreview isEditMode={isEditing} />;
 if (entityType === "Trust") return <TrustCapitalPreview isEditMode={isEditing} />;
 return <IncomeStatementPreview isEditMode={isEditing} entityType={entityType} />;
 case 'cf':
 return <CashFlowsPreview isEditMode={isEditing} />;
 case 'notes':
 return <NotesPreview isEditMode={isEditing} entityType={entityType} />;
 default:
 return null;
 }
};

const FSPageViewer = (props: FSPageViewerProps) => <FSPageContent {...props} />;

export default FSPageViewer;
