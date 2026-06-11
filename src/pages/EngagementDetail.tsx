import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown, Landmark, FileText, Triangle, FileSpreadsheet, PencilLine, Pencil, Settings2, Download, FileType, Share2, Save, RefreshCw, Trash2, Building2, Calendar, Check, AlertTriangle, Loader2, History, Upload, FileUp, Bell, Plus, X } from "lucide-react";
import { ExpandableIconButton } from "@/components/ui/expandable-icon-button";
import { ChecklistIcon } from "@/components/icons/ChecklistIcon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { DocumentView } from "@/components/DocumentView";
import { LetterView } from "@/components/LetterView";
import { AuditMaterialityWorksheet } from "@/components/AuditMaterialityWorksheet";
import { AuditScopeWorksheet } from "@/components/AuditScopeWorksheet";
import { AuditPAPWorksheet } from "@/components/AuditPAPWorksheet";
import { AuditTimeBudgetWorksheet } from "@/components/AuditTimeBudgetWorksheet";
import { AuditDetailedBudgetWorksheet } from "@/components/AuditDetailedBudgetWorksheet";
import { AuditMgmtRequestsWorksheet } from "@/components/AuditMgmtRequestsWorksheet";
import { FloatingActionBar } from "@/components/FloatingActionBar";
import { EngagementRightPanel } from "@/components/EngagementRightPanel";
import { Checklist, Question } from "@/types/checklist";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { subscribeToChecklistSync, dispatchChecklistSync } from "@/lib/checklistSync";
import { toast } from "sonner";
import { ShareWithClientDialog } from "@/components/ShareWithClientDialog";
import { ClientResponseDialog } from "@/components/ClientResponseDialog";
import { useClientResponses } from "@/hooks/useClientResponses";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DeleteChecklistDialog } from "@/components/DeleteChecklistDialog";
import { AddChecklistSheet } from "@/components/AddChecklistSheet";
import { AuditASMImportBanner } from "@/components/AuditASMImportBanner";
import { useSecondaryPanel } from "@/hooks/useSecondaryPanel";
import {
  generateClientAcceptanceContinuanceChecklist,
  generateIndependenceChecklist,
  generateKnowledgeOfClientBusinessChecklist,
  generateUnderstandingEntityIndustryEnvironmentChecklist,
  generatePlanningChecklist,
  generateEngagementLetterChecklist,
  generateManagementResponsibilityChecklist,
  generateNewEngagementAcceptanceChecklist,
  generateExistingEngagementContinuanceChecklist,
  generateForm408InitialAuditEngagements,
  generateForm410AcceptanceContinuance,
  generateUnderstandingEntityBasicsChecklist,
  generateUnderstandingEntitySystemsChecklist,
  generateEngagementPlanningChecklist,
  generateSubsequentEventsChecklist,
  generateWorksheetGoingConcernChecklist,
  generateReviewCompletionChecklist,
  generateSpecificCircumstancesChecklist,
  generateWorksheetAccountingEstimatesChecklist,
  generateUnderstandingInternalControlsChecklist,
  generateSCOTRevenueCycleChecklist,
  generateSCOTExpenditureCycleChecklist,
  generateSCOTPayrollCycleChecklist,
  generateAccumulationOfMisstatementsChecklist,
  generateFinalAnalyticalReviewChecklist,
  generateAuditCompletionChecklist,
  generateEngagementPartnerAuditCompletionChecklist,
  generateAuditorsReportChecklist,
  generateManagementRepresentationsChecklist,
  generateAuditIndependenceChecklist,
  generateAMLComplianceChecklist,
  generateAuditMaterialityChecklist,
  generateAuditEngagementLetterChecklist,
  generateTCWGPlanningCommunicationChecklist,
  generateTCWGFinalCommunicationChecklist,
  generateEngagementScopeChecklist,
  generatePreliminaryAnalyticalProceduresChecklist,
  generateAuditStrategyMemorandumChecklist,
  generateStaffingTimeBudgetChecklist,
  generateRiskAssessmentProceduresChecklist,
  generateITGeneralControlsChecklist,
  generateFraudRiskAssessmentChecklist,
  generateSignificantRisksRegisterChecklist,
  generateRMMChecklist,
  generateOverallAuditResponseChecklist,
  generateTestOfControlsChecklist,
  generateSubstantiveAnalyticalProceduresChecklist,
  generateTestOfDetailsRevenueChecklist,
  generateTestOfDetailsExpensesChecklist,
  generateAuditProceduresSummaryChecklist,
  generateGoingConcernInitialAssessmentChecklist,
  generateGoingConcernFinalAssessmentChecklist,
  generateAuditEngagementLetterGAASUSGAAP,
  generateManagementRepLetterAUC580,
  generateCommunicationTCWGPlanningUS,
  generateCommunicationTCWGFinalUS,
  generateUSAuditFairPresentation,
  generateUSNewEngagementAcceptanceChecklist,
  generateUSExistingEngagementContinuanceChecklist,
  generateUSAuditIndependenceChecklist,
  generateUSAMLComplianceChecklist,
  generateUSForm408InitialAuditEngagements,
  generateUSForm410AcceptanceContinuance,
  generateUSUnderstandingEntityBasicsChecklist,
  generateUSUnderstandingEntitySystemsChecklist,
  generateUSUnderstandingEntityIndustryChecklist,
  generateUSEngagementPlanningChecklist,
  generateUSAuditMaterialityChecklist,
  generateUSEngagementScopeChecklist,
  generateUSPreliminaryAnalyticalProceduresChecklist,
  generateUSAuditStrategyMemorandumChecklist,
  generateUSStaffingTimeBudgetChecklist,
  generateUSRiskAssessmentProceduresChecklist,
  generateUSUnderstandingInternalControlsChecklist,
  generateUSITGeneralControlsChecklist,
  generateUSFraudRiskAssessmentChecklist,
  generateUSSignificantRisksRegisterChecklist,
  generateUSRMMChecklist,
  generateUSSCOTRevenueCycleChecklist,
  generateUSSCOTExpenditureCycleChecklist,
  generateUSSCOTPayrollCycleChecklist,
  generateUSGoingConcernInitialAssessmentChecklist,
  generateUSOverallAuditResponseChecklist,
  generateUSTestOfControlsChecklist,
  generateUSSubstantiveAnalyticalProceduresChecklist,
  generateUSTestOfDetailsRevenueChecklist,
  generateUSTestOfDetailsExpensesChecklist,
  generateUSIndependentAuditorsReportChecklist,
  generateUSAccumulationOfMisstatementsChecklist,
  generateUSFinalAnalyticalReviewChecklist,
  generateUSSubsequentEventsChecklist,
  generateUSGoingConcernFinalAssessmentChecklist,
  generateUSAuditCompletionChecklist,
  generateUSQualityControlReviewChecklist,
  generateInquiryToLegalCounselUS,
  generateCommunicationToPredecessorAuditorUS,
  generateLetterToManagementSignificantDeficienciesUS,
  generateAuditWorksheetSignificantDecisionsUS,
  generateAuditWorksheetKeyAuditMattersUS,
  generateAuditWorksheetFindingsUS,
  generateAuditWorksheetMattersCommunicatedUS,
  generateAuditWorksheetFutureConsiderationUS,
  generateAuditWorksheetDocumentingConsultationUS,
  generateAuditWorksheetWithdrawalUS,
  generateUSJournalEntryTestingLog,
  generateUSRelatedPartyTransactionsWorksheet,
  generateUSGoodwillImpairmentAssessment,
  generateSelectingAuditorExpertChecklist,
  generateUSSelectingAuditorExpertChecklist,
} from "@/lib/globalTemplates";

// Sample engagement data matching the engagements page
const engagementsData: Record<string, {
  id: string;
  client: string;
  type: string;
  yearEnd: string;
  status: string;
  checklistId?: string;
}> = {
  "COM-CON-Dec312024": {
    id: "COM-CON-Dec312024",
    client: "Shipping Line Inc.",
    type: "Compilation (COM)",
    yearEnd: "Dec 31, 2024",
    status: "In Progress"
  },
  "COM-PSP-Dec312023": {
    id: "COM-PSP-Dec312023",
    client: "Source 40",
    type: "Compilation (COM)",
    yearEnd: "Dec 31, 2023",
    status: "In Progress"
  },
  "COM-QB-Dec312025": {
    id: "COM-QB-Dec312025",
    client: "qb 40.1",
    type: "Compilation (COM)",
    yearEnd: "Dec 31, 2025",
    status: "In Progress"
  },
  "AUD-SL-Mar312024": {
    id: "AUD-SL-Mar312024",
    client: "Shipping Line Inc.",
    type: "Audit (AUD)",
    yearEnd: "Mar 31, 2024",
    status: "In Progress"
  },
  "REV-SL-Jun302024": {
    id: "REV-SL-Jun302024",
    client: "Shipping Line Inc.",
    type: "Review (REV)",
    yearEnd: "Jun 30, 2024",
    status: "In Progress"
  },
  "COM-S40-Jun302024": {
    id: "COM-S40-Jun302024",
    client: "Source 40",
    type: "Compilation (COM)",
    yearEnd: "Jun 30, 2024",
    status: "In Progress"
  },
  "AUD-US-Dec312024": {
    id: "AUD-US-Dec312024",
    client: "Harbor Freight Logistics LLC",
    type: "Audit (GAAS/US)",
    yearEnd: "Dec 31, 2024",
    status: "In Progress"
  },
};

// Get unique clients from engagements
const getUniqueClients = () => {
  const clients = new Set<string>();
  Object.values(engagementsData).forEach(e => clients.add(e.client));
  return Array.from(clients);
};

// Get engagements for a specific client
const getEngagementsForClient = (clientName: string) => {
  return Object.values(engagementsData).filter(e => e.client === clientName);
};

// Fallback checklist when no saved checklist exists — uses the latest global template library
const fallbackChecklist: Checklist = generateClientAcceptanceContinuanceChecklist();

// Default Compilation-folder checklists seeded into the engagement on first load
const COMPILATION_FOLDER_ID = "5";
const COMPILATION_FOLDER_NAME = "Compilation Checklists";
const buildDefaultCompilationChecklists = () => {
  const items = [
    { generator: generateClientAcceptanceContinuanceChecklist, id: "default-compilation-cac" },
    { generator: generateIndependenceChecklist, id: "default-compilation-independence" },
    { generator: generateKnowledgeOfClientBusinessChecklist, id: "default-compilation-kcb" },
    { generator: generatePlanningChecklist, id: "default-compilation-planning" },
    { generator: generateEngagementLetterChecklist, id: "default-compilation-el" },
    { generator: generateManagementResponsibilityChecklist, id: "default-compilation-mr" },
  ];
  return items.map(({ generator, id }) => {
    const data = generator();
    return {
      id,
      name: data.title,
      folderId: COMPILATION_FOLDER_ID,
      folderName: COMPILATION_FOLDER_NAME,
      data,
    };
  });
};

const AUDIT_FOLDER_ID = "6";
const AUDIT_FOLDER_NAME = "Audit Checklists";
const buildDefaultAuditChecklists = () => {
  const items = [
    // Client Onboarding
    { generator: generateForm408InitialAuditEngagements, id: "default-audit-form-408" },
    { generator: generateForm410AcceptanceContinuance, id: "default-audit-form-410" },
    { generator: generateNewEngagementAcceptanceChecklist, id: "default-audit-new-accept" },
    { generator: generateExistingEngagementContinuanceChecklist, id: "default-audit-exist-cont" },
    { generator: generateAuditIndependenceChecklist, id: "default-audit-ind" },
    { generator: generateAuditEngagementLetterChecklist, id: "default-audit-el" },
    { generator: generateAMLComplianceChecklist, id: "default-audit-aml" },
    // Planning
    { generator: generateUnderstandingEntityBasicsChecklist, id: "default-audit-ueb" },
    { generator: generateUnderstandingEntitySystemsChecklist, id: "default-audit-ues" },
    { generator: generateUnderstandingEntityIndustryEnvironmentChecklist, id: "default-audit-uei" },
    { generator: generateEngagementPlanningChecklist, id: "default-audit-plan" },
    { generator: generateAuditMaterialityChecklist, id: "default-audit-mat" },
    { generator: generateSelectingAuditorExpertChecklist, id: "default-audit-sae" },
    { generator: generateTCWGPlanningCommunicationChecklist, id: "default-audit-tcwg-pl" },
    { generator: generateEngagementScopeChecklist, id: "default-audit-scope" },
    { generator: generatePreliminaryAnalyticalProceduresChecklist, id: "default-audit-pap" },
    { generator: generateAuditStrategyMemorandumChecklist, id: "default-audit-asm" },
    { generator: generateStaffingTimeBudgetChecklist, id: "default-audit-stb" },
    // Risk Assessment
    { generator: generateRiskAssessmentProceduresChecklist, id: "default-audit-ra-rap" },
    { generator: generateUnderstandingInternalControlsChecklist, id: "default-audit-ra-ic" },
    { generator: generateITGeneralControlsChecklist, id: "default-audit-ra-itgc" },
    { generator: generateFraudRiskAssessmentChecklist, id: "default-audit-ra-fraud" },
    { generator: generateSignificantRisksRegisterChecklist, id: "default-audit-ra-srr" },
    { generator: generateRMMChecklist, id: "default-audit-ra-rmm" },
    { generator: generateSCOTRevenueCycleChecklist, id: "default-audit-ra-scot-rev" },
    { generator: generateSCOTExpenditureCycleChecklist, id: "default-audit-ra-scot-exp" },
    { generator: generateSCOTPayrollCycleChecklist, id: "default-audit-ra-scot-pay" },
    { generator: generateGoingConcernInitialAssessmentChecklist, id: "default-audit-ra-gc" },
    { generator: generateOverallAuditResponseChecklist, id: "default-audit-rp-oar" },
    { generator: generateTestOfControlsChecklist, id: "default-audit-rp-toc" },
    { generator: generateSubstantiveAnalyticalProceduresChecklist, id: "default-audit-rp-sap" },
    { generator: generateTestOfDetailsRevenueChecklist, id: "default-audit-rp-tod-rev" },
    { generator: generateTestOfDetailsExpensesChecklist, id: "default-audit-rp-tod-exp" },
    { generator: generateAuditProceduresSummaryChecklist, id: "default-audit-rp-aps" },
    // Financial Statements
    { generator: generateAuditorsReportChecklist, id: "default-audit-ar" },
    // Completion & Signoffs
    { generator: generateAccumulationOfMisstatementsChecklist, id: "default-audit-so-aim" },
    { generator: generateFinalAnalyticalReviewChecklist, id: "default-audit-so-far" },
    { generator: generateSubsequentEventsChecklist, id: "default-audit-subseq" },
    { generator: generateGoingConcernFinalAssessmentChecklist, id: "default-audit-wgc-final" },
    { generator: generateManagementRepresentationsChecklist, id: "default-audit-mr" },
    { generator: generateTCWGFinalCommunicationChecklist, id: "default-audit-tcwg-fin" },
    { generator: generateAuditCompletionChecklist, id: "default-audit-comp" },
    { generator: generateEngagementPartnerAuditCompletionChecklist, id: "default-audit-ep" },
  ];
  return items.map(({ generator, id }) => {
    const data = generator();
    return {
      id,
      name: data.title,
      folderId: AUDIT_FOLDER_ID,
      folderName: AUDIT_FOLDER_NAME,
      data,
    };
  });
};

const US_AUDIT_FOLDER_ID = "7";
const US_AUDIT_FOLDER_NAME = "US Audit Checklists";
const buildDefaultUSAuditChecklists = () => {
  const items = [
    // Client Onboarding & Planning
    { generator: generateUSForm408InitialAuditEngagements, id: "default-us-audit-form-408" },
    { generator: generateUSForm410AcceptanceContinuance, id: "default-us-audit-form-410" },
    { generator: generateUSNewEngagementAcceptanceChecklist, id: "default-us-audit-new-accept" },
    { generator: generateUSExistingEngagementContinuanceChecklist, id: "default-us-audit-exist-cont" },
    { generator: generateUSAuditIndependenceChecklist, id: "default-us-audit-ind" },
    { generator: generateAuditEngagementLetterGAASUSGAAP, id: "default-us-audit-el" },
    { generator: generateUSAMLComplianceChecklist, id: "default-us-audit-aml" },
    { generator: generateUSUnderstandingEntityBasicsChecklist, id: "default-us-audit-ueb" },
    { generator: generateUSUnderstandingEntitySystemsChecklist, id: "default-us-audit-ues" },
    { generator: generateUSUnderstandingEntityIndustryChecklist, id: "default-us-audit-uei" },
    { generator: generateUSEngagementPlanningChecklist, id: "default-us-audit-plan" },
    { generator: generateUSAuditMaterialityChecklist, id: "default-us-audit-mat" },
    { generator: generateUSSelectingAuditorExpertChecklist, id: "default-us-audit-sae" },
    { generator: generateCommunicationTCWGPlanningUS, id: "default-us-audit-tcwg-pl" },
    { generator: generateUSEngagementScopeChecklist, id: "default-us-audit-scope" },
    { generator: generateUSPreliminaryAnalyticalProceduresChecklist, id: "default-us-audit-pap" },
    { generator: generateUSAuditStrategyMemorandumChecklist, id: "default-us-audit-asm" },
    { generator: generateUSStaffingTimeBudgetChecklist, id: "default-us-audit-stb" },
    // Risk Assessment
    { generator: generateUSRiskAssessmentProceduresChecklist, id: "default-us-audit-ra-rap" },
    { generator: generateUSUnderstandingInternalControlsChecklist, id: "default-us-audit-ra-ic" },
    { generator: generateUSITGeneralControlsChecklist, id: "default-us-audit-ra-itgc" },
    { generator: generateUSFraudRiskAssessmentChecklist, id: "default-us-audit-ra-fraud" },
    { generator: generateUSSignificantRisksRegisterChecklist, id: "default-us-audit-ra-srr" },
    { generator: generateUSRMMChecklist, id: "default-us-audit-ra-rmm" },
    { generator: generateUSSCOTRevenueCycleChecklist, id: "default-us-audit-ra-scot-rev" },
    { generator: generateUSSCOTExpenditureCycleChecklist, id: "default-us-audit-ra-scot-exp" },
    { generator: generateUSSCOTPayrollCycleChecklist, id: "default-us-audit-ra-scot-pay" },
    { generator: generateUSGoingConcernInitialAssessmentChecklist, id: "default-us-audit-ra-gc" },
    // Response to Assessed Risks & Financial Statements
    { generator: generateUSOverallAuditResponseChecklist, id: "default-us-audit-rp-oar" },
    { generator: generateUSTestOfControlsChecklist, id: "default-us-audit-rp-toc" },
    { generator: generateUSSubstantiveAnalyticalProceduresChecklist, id: "default-us-audit-rp-sap" },
    { generator: generateUSTestOfDetailsRevenueChecklist, id: "default-us-audit-rp-tod-rev" },
    { generator: generateUSTestOfDetailsExpensesChecklist, id: "default-us-audit-rp-tod-exp" },
    { generator: generateUSIndependentAuditorsReportChecklist, id: "default-us-audit-ar" },
    // Completion & Signoffs
    { generator: generateUSAccumulationOfMisstatementsChecklist, id: "default-us-audit-so-aim" },
    { generator: generateUSFinalAnalyticalReviewChecklist, id: "default-us-audit-so-far" },
    { generator: generateUSSubsequentEventsChecklist, id: "default-us-audit-subseq" },
    { generator: generateUSGoingConcernFinalAssessmentChecklist, id: "default-us-audit-wgc-final" },
    { generator: generateManagementRepLetterAUC580, id: "default-us-audit-mr" },
    { generator: generateCommunicationTCWGFinalUS, id: "default-us-audit-tcwg-fin" },
    { generator: generateUSAuditCompletionChecklist, id: "default-us-audit-comp" },
    { generator: generateUSQualityControlReviewChecklist, id: "default-us-audit-ep" },
    // Letters (exist in globalTemplates but were not seeded)
    { generator: generateInquiryToLegalCounselUS, id: "default-us-audit-legal-inquiry" },
    { generator: generateCommunicationToPredecessorAuditorUS, id: "default-us-audit-predecessor" },
    { generator: generateLetterToManagementSignificantDeficienciesUS, id: "default-us-audit-sig-def" },
    // Completion worksheets (exist in globalTemplates but were not seeded)
    { generator: generateAuditWorksheetSignificantDecisionsUS, id: "default-us-audit-so-sd" },
    { generator: generateAuditWorksheetKeyAuditMattersUS, id: "default-us-audit-so-kam" },
    { generator: generateAuditWorksheetFindingsUS, id: "default-us-audit-so-find" },
    { generator: generateAuditWorksheetMattersCommunicatedUS, id: "default-us-audit-so-mc" },
    { generator: generateAuditWorksheetFutureConsiderationUS, id: "default-us-audit-so-fc" },
    { generator: generateAuditWorksheetDocumentingConsultationUS, id: "default-us-audit-so-dc" },
    { generator: generateAuditWorksheetWithdrawalUS, id: "default-us-audit-so-wd" },
    // Response to Assessed Risks — Procedures Summary (CA equivalent was used; now US-specific)
    { generator: generateAuditProceduresSummaryChecklist, id: "default-us-audit-rp-aps" },
    // New US-specific worksheets
    { generator: generateUSJournalEntryTestingLog, id: "default-us-audit-ra-je" },
    { generator: generateUSRelatedPartyTransactionsWorksheet, id: "default-us-audit-rp-rpt" },
    { generator: generateUSGoodwillImpairmentAssessment, id: "default-us-audit-rp-gwi" },
  ];
  return items.map(({ generator, id }) => {
    const data = generator();
    return {
      id,
      name: data.title,
      folderId: US_AUDIT_FOLDER_ID,
      folderName: US_AUDIT_FOLDER_NAME,
      data,
    };
  });
};

// Custom TB Check icon component
const TBCheckIcon = ({
  className
}: {
  className?: string;
}) => <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.84228 5.33609V8.00276M7.84228 10.6694H7.84895M6.91916 1.93057L1.43591 11.4017C1.13177 11.927 0.979701 12.1896 1.00218 12.4052C1.02178 12.5933 1.12029 12.7641 1.2732 12.8753C1.4485 13.0028 1.75201 13.0028 2.35903 13.0028H13.3255C13.9326 13.0028 14.2361 13.0028 14.4114 12.8753C14.5643 12.7641 14.6628 12.5933 14.6824 12.4052C14.7049 12.1896 14.5528 11.927 14.2487 11.4017L8.76541 1.93057C8.46236 1.40713 8.31084 1.14541 8.11315 1.05751C7.94071 0.980831 7.74386 0.980831 7.57142 1.05751C7.37373 1.14541 7.22221 1.40713 6.91916 1.93057Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

// Header action buttons
const inlineHeaderActions = [{
  id: "tb",
  label: "TB Check",
  icon: TBCheckIcon
}, {
  id: "adj",
  label: "Adj. Entries",
  icon: PencilLine
}, {
  id: "workbook",
  label: "Workbook",
  icon: FileSpreadsheet
}];

const toolsMenuActions = [{
  id: "bank",
  label: "Connect Bank",
  icon: Landmark
}, {
  id: "docs",
  label: "Source Docs",
  icon: FileText
}];
// Map sidebar nav keys (e.g. "co-ca") to seeded checklist ids.
const NAV_KEY_TO_CHECKLIST_ID: Record<string, string> = {
  // Compilation
  "co-ca": "default-compilation-cac",
  "co-ind": "default-compilation-independence",
  "co-kcb": "default-compilation-kcb",
  "co-pl": "default-compilation-planning",
  "co-el": "default-compilation-el",
  "co-mr": "default-compilation-mr",
  // Audit — Client Onboarding
  "aud-form-408": "default-audit-form-408",
  "aud-form-410": "default-audit-form-410",
  "aud-el": "default-audit-el",
  // Audit — Planning
  "aud-ueb": "default-audit-ueb",
  "aud-ues": "default-audit-ues",
  "aud-uei": "default-audit-uei",
  "aud-plan": "default-audit-plan",
  "aud-mat": "default-audit-mat",
  "aud-sae": "default-audit-sae",
  "aud-tcwg-pl": "default-audit-tcwg-pl",
  "aud-scope": "default-audit-scope",
  "aud-pap": "default-audit-pap",
  "aud-asm": "default-audit-asm",
  "aud-stb": "default-audit-stb",
  // Audit — Risk Assessment
  "aud-ra-rap": "default-audit-ra-rap",
  "aud-ra-ic": "default-audit-ra-ic",
  "aud-ra-itgc": "default-audit-ra-itgc",
  "aud-ra-fraud": "default-audit-ra-fraud",
  "aud-ra-srr": "default-audit-ra-srr",
  "aud-ra-rmm": "default-audit-ra-rmm",
  "aud-ra-scot-rev": "default-audit-ra-scot-rev",
  "aud-ra-scot-exp": "default-audit-ra-scot-exp",
  "aud-ra-scot-pay": "default-audit-ra-scot-pay",
  "aud-ra-gc": "default-audit-ra-gc",
  "aud-rp-oar": "default-audit-rp-oar",
  "aud-rp-toc": "default-audit-rp-toc",
  "aud-rp-sap": "default-audit-rp-sap",
  "aud-rp-tod-rev": "default-audit-rp-tod-rev",
  "aud-rp-tod-exp": "default-audit-rp-tod-exp",
  "aud-rp-aps": "default-audit-rp-aps",
  // Audit — Financial Statements
  "aud-ar": "default-audit-ar",
  // Audit — Completion & Signoffs
  "aud-so-aim": "default-audit-so-aim",
  "aud-so-far": "default-audit-so-far",
  "aud-subseq": "default-audit-subseq",
  "aud-wgc-final": "default-audit-wgc-final",
  "aud-mr": "default-audit-mr",
  "aud-tcwg-fin": "default-audit-tcwg-fin",
  "aud-comp": "default-audit-comp",
  "aud-ep": "default-audit-ep",
  // US Audit (GAAS) — Client Onboarding
  "aud-us-form-408": "default-us-audit-form-408",
  "aud-us-form-410": "default-us-audit-form-410",
  "aud-us-el": "default-us-audit-el",
  // US Audit — Planning
  "aud-us-ueb": "default-us-audit-ueb",
  "aud-us-ues": "default-us-audit-ues",
  "aud-us-uei": "default-us-audit-uei",
  "aud-us-plan": "default-us-audit-plan",
  "aud-us-mat": "default-us-audit-mat",
  "aud-us-sae": "default-us-audit-sae",
  "aud-us-tcwg-pl": "default-us-audit-tcwg-pl",
  "aud-us-scope": "default-us-audit-scope",
  "aud-us-pap": "default-us-audit-pap",
  "aud-us-asm": "default-us-audit-asm",
  "aud-us-stb": "default-us-audit-stb",
  // US Audit — Risk Assessment
  "aud-us-ra-rap": "default-us-audit-ra-rap",
  "aud-us-ra-ic": "default-us-audit-ra-ic",
  "aud-us-ra-itgc": "default-us-audit-ra-itgc",
  "aud-us-ra-fraud": "default-us-audit-ra-fraud",
  "aud-us-ra-srr": "default-us-audit-ra-srr",
  "aud-us-ra-rmm": "default-us-audit-ra-rmm",
  "aud-us-ra-scot-rev": "default-us-audit-ra-scot-rev",
  "aud-us-ra-scot-exp": "default-us-audit-ra-scot-exp",
  "aud-us-ra-scot-pay": "default-us-audit-ra-scot-pay",
  "aud-us-ra-gc": "default-us-audit-ra-gc",
  // US Audit — Response to Assessed Risks
  "aud-us-rp-oar": "default-us-audit-rp-oar",
  "aud-us-rp-toc": "default-us-audit-rp-toc",
  "aud-us-rp-sap": "default-us-audit-rp-sap",
  "aud-us-rp-tod-rev": "default-us-audit-rp-tod-rev",
  "aud-us-rp-tod-exp": "default-us-audit-rp-tod-exp",
  "aud-us-rp-aps": "default-us-audit-rp-aps",
  // US Audit — Financial Statements
  "aud-us-ar": "default-us-audit-ar",
  // US Audit — Completion & Signoffs
  "aud-us-so-aim": "default-us-audit-so-aim",
  "aud-us-so-far": "default-us-audit-so-far",
  "aud-us-subseq": "default-us-audit-subseq",
  "aud-us-wgc-final": "default-us-audit-wgc-final",
  "aud-us-mr": "default-us-audit-mr",
  "aud-us-tcwg-fin": "default-us-audit-tcwg-fin",
  "aud-us-comp": "default-us-audit-comp",
  "aud-us-ep": "default-us-audit-ep",
  // US Audit — Letters wired up
  "aud-us-sig-def": "default-us-audit-sig-def",
  // US Audit — Completion worksheets wired up
  "aud-us-so-sd": "default-us-audit-so-sd",
  "aud-us-so-kam": "default-us-audit-so-kam",
  "aud-us-so-find": "default-us-audit-so-find",
  "aud-us-so-mc": "default-us-audit-so-mc",
  "aud-us-so-fc": "default-us-audit-so-fc",
  "aud-us-so-dc": "default-us-audit-so-dc",
  "aud-us-so-wd": "default-us-audit-so-wd",
  // US Audit — New worksheets
  "aud-us-ra-je": "default-us-audit-ra-je",
  "aud-us-rp-rpt": "default-us-audit-rp-rpt",
  "aud-us-rp-gwi": "default-us-audit-rp-gwi",
};

const LEGACY_COMPILATION_CHECKLIST_IDS = new Set([
  "default-compilation-engagement-letter",
  "default-compilation-mgmt-responsibility",
]);

export default function EngagementDetail() {
  const {
    engagementId,
    checklistKey,
  } = useParams<{
    engagementId: string;
    checklistKey?: string;
  }>();
  const navigate = useNavigate();
  const { isCollapsed: isPanelCollapsed, toggle: togglePanel } = useSecondaryPanel();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [objectiveExpanded, setObjectiveExpanded] = useState(false);
  const [isLetterEditing, setIsLetterEditing] = useState(false);
  const letterSaveRef = useRef<(() => void) | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [pendingEngagementId, setPendingEngagementId] = useState<string | null>(null);
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [pendingClient, setPendingClient] = useState<string | null>(null);
  const [showClientSwitchDialog, setShowClientSwitchDialog] = useState(false);
  const [selectedClientEngagement, setSelectedClientEngagement] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddChecklistSheet, setShowAddChecklistSheet] = useState(false);
  const [clipboardResponses, setClipboardResponses] = useState<{ checklistTitle: string; responses: Record<string, { answer: string; explanation?: string }> } | null>(null);
  const [showClipboardPrompt, setShowClipboardPrompt] = useState(false);

  // Client responses hook
  const clientResponses = useClientResponses(checklist);
  const engagement = engagementId ? engagementsData[engagementId] : null;
  const displayId = engagementId || "Unknown";
  const clientName = engagement?.client || "Unknown Client";
  const status = engagement?.status || "In Progress";

  // Get unique clients and current client's engagements
  const uniqueClients = useMemo(() => getUniqueClients(), []);
  const clientEngagements = useMemo(() => getEngagementsForClient(clientName), [clientName]);
  const currentChecklistId = checklistKey ? NAV_KEY_TO_CHECKLIST_ID[checklistKey] : undefined;

  // Handle client change - show dialog with engagements
  const handleClientChange = (newClient: string) => {
    if (newClient !== clientName) {
      const clientEngs = getEngagementsForClient(newClient);
      setPendingClient(newClient);
      // Pre-select the first engagement
      setSelectedClientEngagement(clientEngs.length > 0 ? clientEngs[0].id : null);
      setShowClientSwitchDialog(true);
    }
  };

  // Get engagements for pending client
  const pendingClientEngagements = useMemo(() => {
    return pendingClient ? getEngagementsForClient(pendingClient) : [];
  }, [pendingClient]);

  // Confirm client switch
  const confirmClientSwitch = () => {
    if (selectedClientEngagement) {
      navigate(`/engagements/${selectedClientEngagement}`);
    }
    setShowClientSwitchDialog(false);
    setPendingClient(null);
    setSelectedClientEngagement(null);
  };

  // Cancel client switch
  const cancelClientSwitch = () => {
    setShowClientSwitchDialog(false);
    setPendingClient(null);
    setSelectedClientEngagement(null);
  };

  // Handle engagement change - show confirmation dialog
  const handleEngagementChange = (newEngagementId: string) => {
    if (newEngagementId !== engagementId) {
      setPendingEngagementId(newEngagementId);
      setShowSwitchDialog(true);
    }
  };

  // Confirm engagement switch
  const confirmEngagementSwitch = () => {
    if (pendingEngagementId) {
      navigate(`/engagements/${pendingEngagementId}`);
    }
    setShowSwitchDialog(false);
    setPendingEngagementId(null);
  };

  // Cancel engagement switch
  const cancelEngagementSwitch = () => {
    setShowSwitchDialog(false);
    setPendingEngagementId(null);
  };

  // Load checklist from localStorage - use first saved checklist or fallback
  useEffect(() => {
    // Set loading state when engagement changes
    setIsLoading(true);
    setChecklist(null);

    // One-time migration: clear stale sample checklists saved before the
    // global template library was pulled in, so the engagement reflects the
    // new global checklist content.
    const TEMPLATE_LIBRARY_VERSION = 'v10-audit-specific-generators-2026-05';
    const seenVersion = localStorage.getItem('savedChecklistsLibraryVersion');
    if (seenVersion !== TEMPLATE_LIBRARY_VERSION) {
      try {
        localStorage.removeItem('savedChecklists');
      } catch {}
      localStorage.setItem('savedChecklistsLibraryVersion', TEMPLATE_LIBRARY_VERSION);
    }

    // Simulate loading delay for better UX feedback
    const loadTimer = setTimeout(() => {
      let savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);

      // Seed the engagement with the Compilation folder defaults the first
      // time we load (or after a migration cleared the list).
      if (!Array.isArray(savedChecklists) || savedChecklists.length === 0) {
        const seeded = [...buildDefaultCompilationChecklists(), ...buildDefaultAuditChecklists(), ...buildDefaultUSAuditChecklists()];
        writeJsonToLocalStorage('savedChecklists', seeded);
        savedChecklists = seeded;
        // Notify the sidebar so it picks up the seeded checklists immediately.
        seeded.forEach(item => {
          window.dispatchEvent(new CustomEvent('checklistSaved', { detail: item }));
        });
      } else {
        // Backfill: keep seeded compilation + audit entries current and remove legacy duplicate EL/MR ids.
        const defaults = [...buildDefaultCompilationChecklists(), ...buildDefaultAuditChecklists(), ...buildDefaultUSAuditChecklists()];
        const defaultById = new Map(defaults.map(item => [item.id, item]));
        const existingIds = new Set(savedChecklists.map((c: any) => c?.id));
        const missing = defaults.filter(d => !existingIds.has(d.id));
        const refreshed = savedChecklists
          .filter((c: any) => !LEGACY_COMPILATION_CHECKLIST_IDS.has(c?.id))
          .map((c: any) => defaultById.get(c?.id) ?? c);
        if (missing.length > 0 || refreshed.length !== savedChecklists.length || refreshed.some((item: any, idx: number) => item !== savedChecklists[idx])) {
          savedChecklists = [...refreshed, ...missing];
          writeJsonToLocalStorage('savedChecklists', savedChecklists);
          missing.forEach(item => {
            window.dispatchEvent(new CustomEvent('checklistSaved', { detail: item }));
          });
        }
      }

      if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
        // Pick the requested checklist via route param, else fall back to first.
        const targetId = checklistKey ? NAV_KEY_TO_CHECKLIST_ID[checklistKey] : undefined;
        const requested = targetId
          ? savedChecklists.find((c: any) => c?.id === targetId)
          : undefined;
        const chosen = requested ?? savedChecklists[0];
        if (chosen?.data) {
          setChecklist(chosen.data);
          setIsLoading(false);
          return;
        }
      }

      // Fallback to the new global-template-backed checklist
      setChecklist(fallbackChecklist);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(loadTimer);
  }, [engagementId, checklistKey]);

  // Listen for real-time sync events from templates page (same tab)
  useEffect(() => {
    const unsubscribe = subscribeToChecklistSync(payload => {
      // Update checklist when sync event is received
      if (payload.data) {
        setChecklist(payload.data);
      }
    });
    return unsubscribe;
  }, []);

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'savedChecklists') {
        const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
        if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
          const firstChecklist = savedChecklists[0];
          if (firstChecklist?.data) {
            setChecklist(firstChecklist.data);
          }
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const handleChecklistUpdate = (updatedChecklist: Checklist) => {
    setChecklist(updatedChecklist);
    // In preview mode, we also save changes back to localStorage and dispatch sync
    const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
    if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
      const checklistId = currentChecklistId ?? savedChecklists[0]?.id;
      const updated = savedChecklists.map((c: any, index: number) => (c?.id === checklistId || (!currentChecklistId && index === 0)) ? {
        ...c,
        data: updatedChecklist
      } : c);
      writeJsonToLocalStorage('savedChecklists', updated);
      // Dispatch sync event for real-time updates
      if (checklistId) {
        dispatchChecklistSync(checklistId, updatedChecklist);
      }
    }
  };
  const handleSave = () => {
    if (checklist) {
      const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
      if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
        const checklistId = currentChecklistId ?? savedChecklists[0]?.id;
        const updated = savedChecklists.map((c: any, index: number) => (c?.id === checklistId || (!currentChecklistId && index === 0)) ? {
          ...c,
          data: checklist
        } : c);
        writeJsonToLocalStorage('savedChecklists', updated);
        // Dispatch sync event for real-time updates
        if (checklistId) {
          dispatchChecklistSync(checklistId, checklist);
        }
      }
      toast.success('Checklist saved');
    }
  };

  // Floating action bar handlers
  const allSectionsCollapsed = useMemo(() => {
    if (!checklist) return false;
    return checklist.sections.every(s => !s.isExpanded);
  }, [checklist]);
  const allQuestionsCollapsed = useMemo(() => {
    if (!checklist) return false;
    return checklist.sections.every(s => s.questions.every(q => !q.isExpanded));
  }, [checklist]);
  const handleCollapseSections = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({
        ...s,
        isExpanded: false
      }))
    };
    setChecklist(updated);
  };
  const handleExpandSections = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({
        ...s,
        isExpanded: true
      }))
    };
    setChecklist(updated);
  };
  const handleCollapseQuestions = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({
        ...s,
        questions: s.questions.map(q => ({
          ...q,
          isExpanded: false
        }))
      }))
    };
    setChecklist(updated);
  };
  const handleExpandQuestions = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({
        ...s,
        questions: s.questions.map(q => ({
          ...q,
          isExpanded: true
        }))
      }))
    };
    setChecklist(updated);
  };
  const handleToggleCompactMode = () => {
    setIsCompactMode(!isCompactMode);
  };
  const handleBulkDelete = () => {
    // No-op in preview mode
  };
  const handleAddCategory = () => {
    // No-op in preview mode
  };

  // Delete checklist - save responses to clipboard first
  const handleDeleteChecklist = () => {
    if (!checklist) return;
    // Save current responses to clipboard
    const responses: Record<string, { answer: string; explanation?: string }> = {};
    checklist.sections.forEach(s => {
      const collectAnswers = (questions: Question[]) => {
        questions.forEach(q => {
          if (q.answer) {
            responses[q.id] = { answer: q.answer, explanation: q.explanation };
          }
          if (q.subQuestions) collectAnswers(q.subQuestions);
        });
      };
      collectAnswers(s.questions);
    });
    const hasResponses = Object.keys(responses).length > 0;
    if (hasResponses) {
      setClipboardResponses({ checklistTitle: checklist.title, responses });
    }
    setChecklist(null);
    toast.success('Checklist deleted');
  };

  // Add checklist from picker
  const handleAddChecklist = (saved: { id: string; name: string; data?: any }) => {
    if (saved.data) {
      setChecklist(saved.data);
      setShowAddChecklistSheet(false);
      // Check if clipboard has responses for same checklist title
      if (clipboardResponses && clipboardResponses.checklistTitle === saved.data.title) {
        setShowClipboardPrompt(true);
      }
    }
  };

  // Apply clipboard responses
  const applyClipboardResponses = () => {
    if (!checklist || !clipboardResponses) return;
    const applyToQuestions = (questions: Question[]): Question[] =>
      questions.map(q => {
        const saved = clipboardResponses.responses[q.id];
        return {
          ...q,
          ...(saved ? { answer: saved.answer, explanation: saved.explanation } : {}),
          subQuestions: q.subQuestions ? applyToQuestions(q.subQuestions) : q.subQuestions,
        };
      });
    const updated: Checklist = {
      ...checklist,
      sections: checklist.sections.map(s => ({ ...s, questions: applyToQuestions(s.questions) })),
    };
    setChecklist(updated);
    setClipboardResponses(null);
    setShowClipboardPrompt(false);
    toast.success('Previous responses restored');
  };

  // Handle share button click - show response dialog if has responses, otherwise show share dialog
  const handleShareButtonClick = () => {
    if (clientResponses.hasResponses) {
      setShowResponseDialog(true);
    } else {
      setShowShareDialog(true);
    }
  };

  // Handle share confirmation - trigger client response simulation
  const handleShareConfirm = () => {
    clientResponses.shareWithClient();
    toast.success("Checklist shared with client. Waiting for responses...");
  };

  // Update a specific question's answer and optional explanation using functional state update
  const updateQuestionAnswer = useCallback((questionId: string, answer: string, explanation?: string) => {
    setChecklist(prev => {
      if (!prev) return prev;
      const updateQuestion = (questions: Question[]): Question[] => {
        return questions.map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              answer,
              ...(explanation ? {
                explanation
              } : {})
            };
          }
          if (q.subQuestions) {
            return {
              ...q,
              subQuestions: updateQuestion(q.subQuestions)
            };
          }
          return q;
        });
      };
      return {
        ...prev,
        sections: prev.sections.map(s => ({
          ...s,
          questions: updateQuestion(s.questions)
        }))
      };
    });
  }, []);

  // Handle accepting selected client responses
  const handleAcceptSelectedResponses = (questionIds: string[]) => {
    const selectedResponses = clientResponses.responses.filter(r =>
      questionIds.includes(r.questionId)
    );
    if (selectedResponses.length === 0) return;

    clientResponses.applyFilteredResponses(
      questionIds,
      (questionId, answer, explanation) => updateQuestionAnswer(questionId, answer, explanation),
      () => {
        toast.success(
          questionIds.length === clientResponses.responses.length
            ? "All client responses have been accepted!"
            : `${questionIds.length} response(s) accepted!`
        );
      }
    );
  };
  // No early return — empty state shown inline when checklist is null
  const engagementBreadcrumb = (
    <div className="flex items-center gap-1 whitespace-nowrap flex-shrink-0 text-sidebar-foreground">
      {/* Client Name (read-only) */}
      <div className="flex items-center gap-1.5 px-2 py-1">
        <div className="w-6 h-6 rounded-md bg-sidebar-foreground/12 border border-sidebar-foreground/15 flex items-center justify-center">
          <Building2 className="h-3.5 w-3.5 text-sidebar-foreground" />
        </div>
        <span className="text-sm font-medium text-sidebar-foreground">{clientName}</span>
      </div>

      <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground/60" />

      {/* Engagement Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="group flex items-center gap-1.5 px-2 py-1 rounded-md border border-sidebar-foreground/20 hover:bg-sidebar-foreground/10 transition-colors">
            <div className="w-6 h-6 rounded-md bg-sidebar-foreground/12 border border-sidebar-foreground/15 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-sidebar-foreground" />
            </div>
            <span className="text-sm font-medium text-sidebar-foreground group-hover:text-sidebar-foreground transition-colors font-mono">{displayId}</span>
            <ChevronDown className="h-3 w-3 text-sidebar-foreground/60 group-hover:text-sidebar-foreground transition-colors" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-auto min-w-[18rem] bg-card border shadow-lg z-50 whitespace-nowrap">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Engagements for {clientName}
          </div>
          <DropdownMenuSeparator />
          {clientEngagements.map(eng => <DropdownMenuItem key={eng.id} onClick={() => handleEngagementChange(eng.id)} className="flex items-center gap-3 cursor-pointer group py-2 whitespace-nowrap">
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-mono text-sm font-medium whitespace-nowrap">{eng.id}</span>
                <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
                  <Calendar className="h-3 w-3 text-muted-foreground group-hover:text-white transition-colors" />
                  <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{eng.yearEnd}</span>
                  <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">•</span>
                  <span className="text-xs text-muted-foreground group-hover:text-white transition-colors">{eng.type}</span>
                </div>
              </div>
              {eng.id === displayId && <Check className="h-4 w-4 text-primary group-hover:text-primary-foreground flex-shrink-0" />}
            </DropdownMenuItem>)}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Badge */}
      <Badge variant={status === 'Completed' || status === 'New' ? 'completed' : status === 'Not Started' ? 'notStarted' : 'inProgress'} className="ml-1 whitespace-nowrap">
        {status}
      </Badge>

      {/* Xero Integration Badge */}
      <div className="ml-1 inline-flex items-center justify-center h-7 w-20 px-1 bg-card border border-border rounded-sm gap-1">
        <img src="https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg" alt="Xero" className="h-4" />
        <span className="text-xs font-medium text-foreground">Xero</span>
      </div>
    </div>
  );

  return <Layout title="Engagements" headerContent={engagementBreadcrumb}>
      <div className="flex h-full overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Top Header Bar with title */}
          <div className="sticky top-0 z-10 border-b border-border bg-gradient-to-r from-card via-card to-secondary/20">
            <div className="flex items-center justify-between px-4 py-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={togglePanel}
                  aria-label={isPanelCollapsed ? "Expand sections panel" : "Collapse sections panel"}
                  title={isPanelCollapsed ? "Expand sections panel" : "Collapse sections panel"}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" className="shrink-0" aria-hidden="true">
                    <path fill="currentColor" d="M20.25 7c0-.69-.56-1.25-1.25-1.25H9.75v12.5H19c.69 0 1.25-.56 1.25-1.25zM3.75 17c0 .69.56 1.25 1.25 1.25h3.25V5.75H5c-.69 0-1.25.56-1.25 1.25zm18 0A2.75 2.75 0 0 1 19 19.75H5A2.75 2.75 0 0 1 2.25 17V7A2.75 2.75 0 0 1 5 4.25h14A2.75 2.75 0 0 1 21.75 7z"></path>
                  </svg>
                </button>
                <h1 className="font-semibold text-foreground truncate text-lg">
                  {checklist?.title || 'Client acceptance and continuance'}
                </h1>
              </div>
              <div className="flex items-center gap-1">
                {inlineHeaderActions.map(action => (
                  <ExpandableIconButton
                    key={action.id}
                    variant="secondary"
                    size="sm"
                    icon={<action.icon className="h-4 w-4" />}
                    label={action.label}
                    onClick={
                      action.id === "workbook" && engagementId
                        ? () =>
                            window.open(
                              `${import.meta.env.BASE_URL}engagements/${engagementId}/workbook`,
                              "_blank",
                              "noopener,noreferrer",
                            )
                        : undefined
                    }
                  />
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ExpandableIconButton
                      variant="secondary"
                      size="sm"
                      icon={<Settings2 className="h-4 w-4" />}
                      label={<span className="inline-flex items-center gap-1">Tools<ChevronDown className="h-3 w-3" /></span>}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card border shadow-lg z-50">
                    {toolsMenuActions.map(action => (
                      <DropdownMenuItem key={action.id} className="flex items-center gap-2 cursor-pointer group">
                        <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span>{action.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {/* Action buttons row */}
            <div className="flex items-center justify-end gap-1 px-4 py-1.5 border-t border-border/50">
              {checklist && <>
                {(() => {
                  const isLetter = checklist?.sections?.length > 0 && checklist.sections[0]?.questions?.length > 0 && checklist.sections[0].questions[0]?.answerType === 'none' && !checklist.objective;
                  if (isLetter) {
                    return isLetterEditing ? (
                      <>
                        <ExpandableIconButton variant="secondary" icon={<X className="h-4 w-4" />} label="Cancel" size="sm" onClick={() => setIsLetterEditing(false)} />
                        <ExpandableIconButton variant="default" icon={<Check className="h-4 w-4" />} label="Save" size="sm" onClick={() => { letterSaveRef.current?.(); setIsLetterEditing(false); }} />
                      </>
                    ) : (
                      <ExpandableIconButton variant="secondary" icon={<Pencil className="h-4 w-4" />} label="Edit" size="sm" onClick={() => setIsLetterEditing(true)} />
                    );
                  }
                  return (
                    <ExpandableIconButton variant="default" icon={<Save className="h-4 w-4" />} label="Save" size="sm" onClick={handleSave} />
                  );
                })()}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ExpandableIconButton
                      variant="secondary"
                      size="sm"
                      icon={<Download className="h-4 w-4" />}
                      label="Export"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border shadow-lg z-50 w-40">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer group" onClick={() => toast.info('Exporting as PDF...')}>
                      <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span>PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer group" onClick={() => toast.info('Exporting as Word...')}>
                      <FileType className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span>Word</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="relative">
                  <ExpandableIconButton
                    variant="secondary"
                    size="sm"
                    icon={<Share2 className="h-4 w-4" />}
                    label={clientResponses.hasResponses ? 'Responses!' : 'Share'}
                    className={clientResponses.hasResponses ? 'ring-2 ring-primary ring-offset-2' : undefined}
                    onClick={handleShareButtonClick}
                  />
                  {clientResponses.hasResponses && <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 pointer-events-none">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-primary items-center justify-center">
                        <Bell className="h-3 w-3 text-primary-foreground" />
                      </span>
                    </span>}
                </div>
                <ExpandableIconButton
                  variant="secondary"
                  size="sm"
                  icon={<svg className="h-4 w-4" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M620.544 137.6c103.936 10.432 187.328 72.96 205.12 180.224h-60.16l97.088 144.448 97.152-144.448h-67.008c-17.792-144.448-127.168-238.336-265.344-251.712-19.136-1.536-36.864 14.848-36.864 35.712 1.28 17.92 13.568 34.24 30.016 35.776z m-150.4-73.024H132.416c-19.136 0-34.176 16.384-34.176 37.248v321.728c0 20.864 15.04 37.248 34.176 37.248h337.728c19.136 0 34.176-16.384 34.176-37.248V101.824c0-20.864-15.04-37.248-34.176-37.248z m-32.832 324.736H165.248V136.064h272.128v253.248h-0.064zM404.48 883.84c-116.224-10.432-205.12-87.872-209.216-216h64.256L162.496 523.392l-97.088 144.448h64.256c2.688 165.376 118.912 272.576 268.032 287.488 19.136 1.472 36.928-14.912 36.928-35.776a35.648 35.648 0 0 0-30.144-35.712z m489.6-323.264H556.288c-19.2 0-34.176 16.448-34.176 37.248v323.264c0 20.8 14.976 37.184 34.176 37.184h337.728c19.136 0 34.112-16.384 34.112-37.184V597.824c0.064-20.8-16.32-37.248-34.048-37.248z m-32.896 324.736H589.12V633.536h272.064v251.776z" />
                  </svg>}
                  label="Replace"
                />
                <ExpandableIconButton
                  variant="secondary"
                  size="sm"
                  icon={<Trash2 className="h-4 w-4" />}
                  label="Delete"
                  className="text-destructive hover:text-destructive focus-visible:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                />
              </>}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto bg-card">
          {/* ── Interactive worksheets — rendered directly without checklist state ── */}
          {(checklistKey === 'aud-mat' || checklistKey === 'aud-us-mat') ? (
            <AuditMaterialityWorksheet isUS={checklistKey === 'aud-us-mat'} />
          ) : (checklistKey === 'aud-tb' || checklistKey === 'aud-us-tb') ? (
            <AuditTimeBudgetWorksheet isUS={checklistKey === 'aud-us-tb'} />
          ) : (checklistKey === 'aud-db' || checklistKey === 'aud-us-db') ? (
            <AuditDetailedBudgetWorksheet isUS={checklistKey === 'aud-us-db'} />
          ) : (checklistKey === 'aud-iar' || checklistKey === 'aud-us-iar') ? (
            <AuditMgmtRequestsWorksheet isUS={checklistKey === 'aud-us-iar'} />
          ) : (checklistKey === 'aud-scope' || checklistKey === 'aud-us-scope') ? (
            <AuditScopeWorksheet isUS={checklistKey === 'aud-us-scope'} />
          ) : (checklistKey === 'aud-pap' || checklistKey === 'aud-us-pap') ? (
            <AuditPAPWorksheet isUS={checklistKey === 'aud-us-pap'} />
          ) : checklist ? (
            <div className="p-4">
              {/* ASM import banner */}
              {(checklistKey === 'aud-asm' || checklistKey === 'aud-us-asm') && checklist && (
                <AuditASMImportBanner
                  checklist={checklist}
                  onUpdate={handleChecklistUpdate}
                  isUS={checklistKey === 'aud-us-asm'}
                />
              )}
              {/* Clipboard prompt banner */}
              {showClipboardPrompt && clipboardResponses && (
                <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-amber-50 rounded-lg border border-amber-300 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <History className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-amber-900 flex-1">Previous responses available for this checklist</span>
                  <Button size="sm" variant="default" className="h-8 text-xs" onClick={applyClipboardResponses}>
                    Add Previous responses
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { setShowClipboardPrompt(false); setClipboardResponses(null); }}>
                    Dismiss
                  </Button>
                </div>
              )}
              {/* Latest global checklist document view */}
              {isLoading ? <div className="bg-card rounded-lg shadow-sm p-12 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Loading engagement checklist...</p>
                    <p className="text-xs text-muted-foreground mt-1">Please wait while we fetch the data</p>
                  </div>
                </div> : <div className="bg-background">
                  {(checklist?.sections?.length > 0 && checklist.sections[0]?.questions?.length > 0 && checklist.sections[0].questions[0]?.answerType === 'none' && !checklist.objective) ? (
                    <LetterView
                      checklist={checklist}
                      onUpdate={handleChecklistUpdate}
                      isEditing={isLetterEditing}
                      onEditStart={() => setIsLetterEditing(true)}
                      onSaveEdits={() => setIsLetterEditing(false)}
                      onCancelEdits={() => setIsLetterEditing(false)}
                      saveRef={letterSaveRef}
                    />
                  ) : (
                    <DocumentView
                      checklist={checklist}
                      onUpdate={handleChecklistUpdate}
                      isPreviewMode={false}
                      isCompactMode={isCompactMode}
                      selectedQuestions={selectedQuestions}
                      onSelectionChange={setSelectedQuestions}
                      isEngagementMode={true}
                      applyingQuestionId={clientResponses.applyingQuestionId}
                      objectiveExpanded={objectiveExpanded}
                      onToggleObjective={() => setObjectiveExpanded(prev => !prev)}
                    />
                  )}
                </div>}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-32">
              <div className="w-28 h-28 mb-6 relative">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="60" cy="60" r="50" fill="hsl(var(--primary) / 0.08)" />
                  <path d="M60 25L85 38V58C85 74 74 88 60 93C46 88 35 74 35 58V38L60 25Z" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="2" />
                  <circle cx="60" cy="58" r="12" fill="hsl(var(--primary) / 0.25)" />
                  <path d="M55 58L59 62L66 54" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="40" cy="35" r="3" fill="hsl(var(--primary) / 0.2)" />
                  <circle cx="85" cy="45" r="4" fill="hsl(var(--primary) / 0.15)" />
                  <circle cx="38" cy="75" r="3" fill="hsl(var(--primary) / 0.2)" />
                  <circle cx="82" cy="72" r="2.5" fill="hsl(var(--primary) / 0.2)" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No checklist available</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Currently there is no checklist available.<br />Please add a checklist
              </p>
            </div>
          )}
          </div>

          {/* Floating Action Bar for Preview Mode - Inside content area */}
          {checklist && <FloatingActionBar checklist={checklist} onUpdate={handleChecklistUpdate} onCollapseSections={handleCollapseSections} onExpandSections={handleExpandSections} onCollapseQuestions={handleCollapseQuestions} onExpandQuestions={handleExpandQuestions} allSectionsCollapsed={allSectionsCollapsed} allQuestionsCollapsed={allQuestionsCollapsed} isCompactMode={isCompactMode} onToggleCompactMode={handleToggleCompactMode} selectedQuestions={selectedQuestions} onBulkDelete={handleBulkDelete} onAddCategory={handleAddCategory} isPreviewMode={true} />}
        </div>

        {/* Right Panel or Add Checklist Sheet */}
        {showAddChecklistSheet ? (
          <AddChecklistSheet open={showAddChecklistSheet} onClose={() => setShowAddChecklistSheet(false)} onSelect={handleAddChecklist} />
        ) : (
          <EngagementRightPanel />
        )}

        {/* Delete Checklist Confirmation */}
        <DeleteChecklistDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} onConfirm={handleDeleteChecklist} />

        {/* Share with Client Dialog */}
        <ShareWithClientDialog open={showShareDialog} onOpenChange={setShowShareDialog} checklistName={checklist?.title} onConfirm={handleShareConfirm} />

        {/* Client Response Dialog */}
        <ClientResponseDialog open={showResponseDialog} onOpenChange={setShowResponseDialog} totalQuestions={clientResponses.totalQuestions} answeredQuestions={clientResponses.answeredQuestions} responses={clientResponses.responses} onAcceptSelected={handleAcceptSelectedResponses} isApplying={clientResponses.isApplyingResponses} checklist={checklist} />

        {/* Switch Engagement Confirmation Dialog */}
        <Dialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
          <DialogContent className="sm:max-w-[400px] bg-card border shadow-xl rounded-2xl p-6">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
            <div className="flex flex-col items-center text-center gap-4">
              {/* Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              
              {/* Title */}
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-lg font-semibold text-foreground">
                  You are switching to another engagement
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Are you sure you want to switch to the selected engagement?
                </DialogDescription>
              </DialogHeader>
              
              {/* Action Buttons */}
              <DialogFooter className="flex flex-row gap-3 w-full sm:justify-center pt-2">
                <Button variant="outline" onClick={cancelEngagementSwitch} className="flex-1 h-10">
                  No
                </Button>
                <Button onClick={confirmEngagementSwitch} className="flex-1 h-10 bg-primary hover:bg-primary/90">
                  Yes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Switch Client Confirmation Dialog */}
        <Dialog open={showClientSwitchDialog} onOpenChange={setShowClientSwitchDialog}>
          <DialogContent className="sm:max-w-[440px] bg-card border shadow-xl rounded-2xl p-6">
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
            <div className="flex flex-col items-center text-center gap-4">
              {/* Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              
              {/* Title */}
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-lg font-semibold text-foreground">
                  You are switching to another client
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Select an engagement for {pendingClient} to continue.
                </DialogDescription>
              </DialogHeader>
              
              {/* Engagement List */}
              <div className="w-full border rounded-lg divide-y max-h-48 overflow-y-auto">
                {pendingClientEngagements.map(eng => <button key={eng.id} onClick={() => setSelectedClientEngagement(eng.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedClientEngagement === eng.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-muted/50'}`}>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-mono text-sm font-medium truncate">{eng.id}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{eng.yearEnd}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{eng.type}</span>
                      </div>
                    </div>
                    {selectedClientEngagement === eng.id && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                  </button>)}
              </div>
              
              {/* Action Buttons */}
              <DialogFooter className="flex flex-row gap-3 w-full sm:justify-center pt-2">
                <Button variant="outline" onClick={cancelClientSwitch} className="flex-1 h-10">
                  No
                </Button>
                <Button onClick={confirmClientSwitch} disabled={!selectedClientEngagement} className="flex-1 h-10 bg-primary hover:bg-primary/90">
                  Yes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>;
}