import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronRight, ChevronLeft, Search, Plus, Expand, Trash2, Folder, Headphones, Check, FileText, FileBarChart, StickyNote, Table, Copy, Pencil, FolderInput, MoreVertical, GripVertical, X, Save, Files } from "lucide-react";
import { templateTree, allTemplateViews, type TreeItem } from "@/lib/engagementTemplatesData";
import { FolderSolidIcon, FolderPlusIcon, FolderMinusIcon } from "@/components/icons/FolderIcons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import lukaLogo from "@/assets/luka-logo.png";
import { BulkAddToMyTemplatesDialog } from "@/components/BulkAddToMyTemplatesDialog";
import {
  getGlobalTemplateChecklist,
  generateClientAcceptanceContinuanceChecklist,
  generateIndependenceChecklist,
  generateKnowledgeOfClientBusinessChecklist,
  generatePlanningChecklist,
  generateEngagementLetterChecklist,
  generateManagementResponsibilityChecklist,
} from "@/lib/globalTemplates";
import { readJsonFromLocalStorage, removeLocalStorageKey, writeJsonToLocalStorage } from "@/lib/safeJson";
import { cn } from "@/lib/utils";
import { LetterIcon } from "@/components/icons/LetterIcon";
import { ChecklistIcon } from "@/components/icons/ChecklistIcon";
import { CompletionIcon } from "@/components/icons/CompletionIcon";
import { WordDocIcon } from "@/components/icons/WordDocIcon";
import { BookIcon } from "@/components/icons/BookIcon";
import { WorksheetIcon } from "@/components/icons/WorksheetIcon";
import { SignoffsOverlay } from "@/components/SignoffsOverlay";
import signoffCheckAllIcon from "@/assets/signoff-check-all.png";
import signoffUncheckAllIcon from "@/assets/signoff-uncheck-all.png";
import { useSecondaryPanel } from "@/hooks/useSecondaryPanel";
interface Template {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: Template[];
  isExpanded?: boolean;
}
export interface SavedChecklist {
  id: string;
  name: string;
  folderId: string;
  folderName: string;
  data?: any; // Full checklist data for editing
}
const initialTemplates: Template[] = [{
  id: "1",
  name: "Before Release V22Comp",
  type: "folder",
  children: []
}, {
  id: "2",
  name: "Before Release V22 Revi...",
  type: "folder",
  children: []
}, {
  id: "3",
  name: "Carissa_13208",
  type: "folder",
  children: []
}, {
  id: "4",
  name: "carisa 37.3",
  type: "folder",
  children: []
}, {
  id: "5",
  name: "Compilation Checklists",
  type: "folder",
  isExpanded: true,
  children: []
}, {
  id: "6",
  name: "release 38 before",
  type: "folder",
  children: []
}, {
  id: "7",
  name: "Review Checklists",
  type: "folder",
  children: []
}, {
  id: "8",
  name: "Tax Release",
  type: "folder",
  children: []
}];

// Global Templates data structure for "master" tab
interface GlobalTemplate {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: GlobalTemplate[];
  isExpanded?: boolean;
}

const initialGlobalTemplates: GlobalTemplate[] = [
  {
    id: "global-1",
    name: "Compilation",
    type: "folder",
    isExpanded: true,
    children: [
      { id: "global-1-1", name: "Client Acceptance and Continuance", type: "file" },
      { id: "global-1-2", name: "Independence", type: "file" },
      { id: "global-1-3", name: "Knowledge of the Business", type: "file" },
      { id: "global-1-4", name: "Planning", type: "file" },
      { id: "global-1-5", name: "Withdrawal", type: "file" },
      { id: "global-1-6", name: "Completion", type: "file" },
    ]
  },
  {
    id: "global-2",
    name: "Review",
    type: "folder",
    isExpanded: false,
    children: [
      { id: "global-2-1", name: "New engagement acceptance", type: "file" },
      { id: "global-2-2", name: "Existing engagement continuance", type: "file" },
      { id: "global-2-3", name: "Understanding the entity - Basics", type: "file" },
      { id: "global-2-4", name: "Engagement Planning", type: "file" },
      { id: "global-2-5", name: "Completion", type: "file" },
      { id: "global-2-6", name: "Subsequent events", type: "file" },
      { id: "global-2-7", name: "Withdrawal", type: "file" },
      { id: "global-2-8", name: "Understanding the entity - Systems", type: "file" },
      { id: "global-2-9", name: "ASPE - General - Disclosure checklist", type: "file" },
      { id: "global-2-10", name: "ASPE - Income taxes - Disclosure checklist", type: "file" },
      { id: "global-2-11", name: "ASPE - Leases - Disclosure checklist", type: "file" },
      { id: "global-2-12", name: "ASPE - Goodwill and intangible assets - Disclosure checklist", type: "file" },
      { id: "global-2-13", name: "ASPE - Employee future benefits - Disclosure checklist", type: "file" },
      { id: "global-2-14", name: "ASPE - Supplementary - Disclosure checklist", type: "file" },
      { id: "global-2-15", name: "ASPE - Agriculture - Disclosure checklist", type: "file" },
      { id: "global-2-16", name: "Specific Circumstances", type: "file" },
    ]
  },
  {
    id: "global-3",
    name: "Tax",
    type: "folder",
    isExpanded: false,
    children: [
      { id: "global-3-1", name: "Completion", type: "file" },
    ]
  },
  {
    id: "global-4",
    name: "Audit",
    type: "folder",
    isExpanded: false,
    children: [
      {
        id: "global-4-ca",
        name: "Canada",
        type: "folder",
        isExpanded: false,
        children: [
          { id: "global-4-1", name: "Checklist — Audit Completion", type: "file" },
          { id: "global-4-2", name: "Engagement Partner Checklist — Audit Completion", type: "file" },
          { id: "global-4-3", name: "Checklist — Auditor's Report", type: "file" },
          { id: "global-4-4", name: "Checklist — Modified Opinion", type: "file" },
          { id: "global-4-5", name: "Checklist — Supplementary and Other Information", type: "file" },
          { id: "global-4-6", name: "Checklist — Management Representations", type: "file" },
        ]
      },
      {
        id: "global-4-us",
        name: "United States",
        type: "folder",
        isExpanded: false,
        children: [
          {
            id: "global-4-us-1",
            name: "Pre-Engagement",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "global-4-us-1-1", name: "Assessing Acceptability of Financial Reporting Framework", type: "file" },
              { id: "global-4-us-1-2", name: "Audit Team Competency Matrix", type: "file" },
              { id: "global-4-us-1-3", name: "Auditor's Declaration — Code of Ethics", type: "file" },
              { id: "global-4-us-1-4", name: "Declaration of Conflict of Interest", type: "file" },
              { id: "global-4-us-1-5", name: "Declaration of NO Conflict of Interest", type: "file" },
              { id: "global-4-us-1-6", name: "Assessment of Ethical Threats and Safeguards", type: "file" },
              { id: "global-4-us-1-7", name: "Audit Engagement Letter", type: "file" },
            ]
          },
          {
            id: "global-4-us-2",
            name: "Audit Planning",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "global-4-us-2-1", name: "Understanding the Entity and Its Environment", type: "file" },
              { id: "global-4-us-2-2", name: "Determining Materiality", type: "file" },
              { id: "global-4-us-2-3", name: "Overall Audit Strategy and Audit Plan", type: "file" },
              { id: "global-4-us-2-4", name: "Direct Assistance — Internal Auditors Agreement", type: "file" },
            ]
          },
          {
            id: "global-4-us-3",
            name: "Completion & Review",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "global-4-us-3-1", name: "Evaluating Misstatements", type: "file" },
              { id: "global-4-us-3-2", name: "Analytical Procedures — End of Audit", type: "file" },
              { id: "global-4-us-3-3", name: "Management Representation Letter", type: "file" },
            ]
          },
          {
            id: "global-4-us-4",
            name: "Reporting",
            type: "folder",
            isExpanded: false,
            children: [
              { id: "global-4-us-4-1", name: "Auditor's Report — Fair Presentation Framework", type: "file" },
              { id: "global-4-us-4-2", name: "Auditor's Report — Compliance Framework", type: "file" },
              { id: "global-4-us-4-3", name: "Qualified Opinion — Material Misstatement (Fair Presentation)", type: "file" },
              { id: "global-4-us-4-4", name: "Qualified Opinion — Material Misstatement (Compliance)", type: "file" },
              { id: "global-4-us-4-5", name: "Qualified Opinion — Insufficient Evidence", type: "file" },
              { id: "global-4-us-4-6", name: "Adverse Opinion", type: "file" },
              { id: "global-4-us-4-7", name: "Disclaimer of Opinion", type: "file" },
              { id: "global-4-us-4-8", name: "Auditor's Report with Key Audit Matters and Emphasis of Matter", type: "file" },
              { id: "global-4-us-4-9", name: "Qualified Opinion with Emphasis of Matter", type: "file" },
            ]
          },
        ]
      },
    ]
  },
  {
    id: "global-5",
    name: "Compilation 2026",
    type: "folder",
    isExpanded: false,
    children: [
      { id: "global-5-1", name: "Client Acceptance and Continuance", type: "file" },
    ]
  }
];

// Global Worksheets data structure — shown when "Worksheets" is selected in the dropdown
const initialGlobalWorksheets: GlobalTemplate[] = [
  {
    id: "gws-review",
    name: "Review",
    type: "folder",
    isExpanded: true,
    children: [
      { id: "global-2-17", name: "Worksheet — Accounting Estimates (including Fair Values)", type: "file" },
      { id: "global-2-18", name: "Worksheet — Going Concern", type: "file" },
    ]
  },
  {
    id: "gws-audit",
    name: "Audit",
    type: "folder",
    isExpanded: true,
    children: [
      {
        id: "gws-audit-ca",
        name: "Canada",
        type: "folder",
        isExpanded: true,
        children: [
          { id: "global-4-7",  name: "Worksheet — Withdrawal", type: "file" },
          { id: "global-4-8",  name: "Worksheet — Notes on Significant Audit Decisions", type: "file" },
          { id: "global-4-9",  name: "Worksheet — Key Audit Matters", type: "file" },
          { id: "global-4-10", name: "Worksheet — Audit Findings and Matters for Discussion", type: "file" },
          { id: "global-4-11", name: "Summary of Identified Misstatements", type: "file" },
          { id: "global-4-12", name: "Worksheet — Matters to be Communicated to Management and TCWG", type: "file" },
          { id: "global-4-13", name: "Worksheet — Matters for Future Consideration", type: "file" },
          { id: "global-4-14", name: "Worksheet — Documenting Consultation", type: "file" },
        ]
      },
      {
        id: "gws-audit-us",
        name: "United States",
        type: "folder",
        isExpanded: true,
        children: [
          { id: "global-us-4-1", name: "Worksheet — Withdrawal", type: "file" },
          { id: "global-us-4-2", name: "Worksheet — Notes on Significant Audit Decisions", type: "file" },
          { id: "global-us-4-3", name: "Worksheet — Key Audit Matters (AU-C 701)", type: "file" },
          { id: "global-us-4-4", name: "Worksheet — Audit Findings and Matters for Discussion", type: "file" },
          { id: "global-us-4-5", name: "Accumulation of Identified Misstatements (AIM)", type: "file" },
          { id: "global-us-4-6", name: "Worksheet — Matters to be Communicated to Those Charged with Governance (AU-C 260)", type: "file" },
          { id: "global-us-4-7", name: "Worksheet — Matters for Future Consideration", type: "file" },
          { id: "global-us-4-8", name: "Worksheet — Documenting Consultation", type: "file" },
        ]
      },
    ]
  },
];

// Icon components matching the screenshot
const AnalyticsIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bar chart icon */}
    <rect x="3" y="10" width="3" height="7" rx="0.5" fill="currentColor" />
    <rect x="8.5" y="6" width="3" height="11" rx="0.5" fill="currentColor" />
    <rect x="14" y="3" width="3" height="14" rx="0.5" fill="currentColor" />
  </svg>;
const GlassesIcon = () => <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.8332 16.5V14.8333C17.8332 13.2801 16.7709 11.9751 15.3332 11.605M12.4165 1.7423C13.6381 2.23679 14.4998 3.43443 14.4998 4.83333C14.4998 6.23224 13.6381 7.42988 12.4165 7.92437M13.6665 16.5C13.6665 14.9469 13.6665 14.1703 13.4128 13.5577C13.0745 12.741 12.4255 12.092 11.6088 11.7537C10.9962 11.5 10.2196 11.5 8.6665 11.5H6.1665C4.61337 11.5 3.8368 11.5 3.22423 11.7537C2.40747 12.092 1.75855 12.741 1.42024 13.5577C1.1665 14.1703 1.1665 14.9469 1.1665 16.5M10.7498 4.83333C10.7498 6.67428 9.25745 8.16667 7.4165 8.16667C5.57555 8.16667 4.08317 6.67428 4.08317 4.83333C4.08317 2.99238 5.57555 1.5 7.4165 1.5C9.25745 1.5 10.7498 2.99238 10.7498 4.83333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const ChatIcon = () => <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.3332 8.16667H14.3332C15.2666 8.16667 15.7333 8.16667 16.0898 8.34832C16.4034 8.50811 16.6584 8.76308 16.8182 9.07668C16.9998 9.4332 16.9998 9.89991 16.9998 10.8333V16.5M10.3332 16.5V4.16667C10.3332 3.23325 10.3332 2.76654 10.1515 2.41002C9.99173 2.09641 9.73676 1.84144 9.42316 1.68166C9.06664 1.5 8.59993 1.5 7.6665 1.5H4.6665C3.73308 1.5 3.26637 1.5 2.90985 1.68166C2.59625 1.84144 2.34128 2.09641 2.18149 2.41002C1.99984 2.76654 1.99984 3.23325 1.99984 4.16667V16.5M17.8332 16.5H1.1665M4.9165 4.83333H7.4165M4.9165 8.16667H7.4165M4.9165 11.5H7.4165" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const BriefcaseIcon = () => <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.58317 7.99992H4.40148C4.97248 7.99992 5.49448 8.32253 5.74984 8.83325C6.0052 9.34397 6.52719 9.66659 7.0982 9.66659H11.9015C12.4725 9.66659 12.9945 9.34397 13.2498 8.83325C13.5052 8.32253 14.0272 7.99992 14.5982 7.99992H17.4165M6.97197 1.33325H12.0277C12.9251 1.33325 13.3738 1.33325 13.7699 1.46989C14.1202 1.59072 14.4393 1.78792 14.704 2.04721C15.0034 2.34042 15.2041 2.74175 15.6054 3.5444L17.4109 7.15534C17.5684 7.47032 17.6471 7.62782 17.7027 7.79287C17.752 7.93946 17.7876 8.09031 17.809 8.24347C17.8332 8.41594 17.8332 8.59202 17.8332 8.94419V10.6666C17.8332 12.0667 17.8332 12.7668 17.5607 13.3016C17.321 13.772 16.9386 14.1544 16.4681 14.3941C15.9334 14.6666 15.2333 14.6666 13.8332 14.6666H5.1665C3.76637 14.6666 3.06631 14.6666 2.53153 14.3941C2.06112 14.1544 1.67867 13.772 1.43899 13.3016C1.1665 12.7668 1.1665 12.0667 1.1665 10.6666V8.94419C1.1665 8.59202 1.1665 8.41594 1.19065 8.24347C1.21209 8.09031 1.2477 7.93946 1.29702 7.79287C1.35255 7.62782 1.4313 7.47032 1.5888 7.15534L3.39426 3.5444C3.79559 2.74174 3.99626 2.34042 4.29562 2.04721C4.56036 1.78792 4.87943 1.59072 5.22974 1.46989C5.62588 1.33325 6.07458 1.33325 6.97197 1.33325Z" stroke="#5599D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
const FileIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Document/file icon */}
    <path d="M5 2h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>;
const navItems = [{
  icon: AnalyticsIcon,
  label: "Dashboard",
  route: "/dashboard"
}, {
  icon: GlassesIcon,
  label: "Team",
  route: "/teams"
}, {
  icon: ChatIcon,
  label: "Clients",
  route: "/clients"
}, {
  icon: ({ className }: { className?: string }) => <svg className={className} width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.08317 8.00016H4.90148C5.47248 8.00016 5.99448 8.32277 6.24984 8.8335C6.5052 9.34422 7.02719 9.66683 7.5982 9.66683H12.4015C12.9725 9.66683 13.4945 9.34422 13.7498 8.8335C14.0052 8.32277 14.5272 8.00016 15.0982 8.00016H17.9165M7.47197 1.3335H12.5277C13.4251 1.3335 13.8738 1.3335 14.2699 1.47013C14.6202 1.59096 14.9393 1.78816 15.204 2.04745C15.5034 2.34066 15.7041 2.742 16.1054 3.54464L17.9109 7.15558C18.0684 7.47057 18.1471 7.62806 18.2027 7.79312C18.252 7.9397 18.2876 8.09055 18.309 8.24372C18.3332 8.41618 18.3332 8.59227 18.3332 8.94443V10.6668C18.3332 12.067 18.3332 12.767 18.0607 13.3018C17.821 13.7722 17.4386 14.1547 16.9681 14.3943C16.4334 14.6668 15.7333 14.6668 14.3332 14.6668H5.6665C4.26637 14.6668 3.56631 14.6668 3.03153 14.3943C2.56112 14.1547 2.17867 13.7722 1.93899 13.3018C1.6665 12.767 1.6665 12.067 1.6665 10.6668V8.94443C1.6665 8.59227 1.6665 8.41618 1.69065 8.24372C1.71209 8.09055 1.7477 7.9397 1.79702 7.79312C1.85255 7.62806 1.9313 7.47057 2.0888 7.15558L3.89426 3.54464C4.29559 2.74199 4.49626 2.34066 4.79562 2.04745C5.06036 1.78816 5.37943 1.59096 5.72974 1.47013C6.12588 1.3335 6.57458 1.3335 7.47197 1.3335Z" stroke="#5599D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  label: "Engagements",
  route: "/engagements"
}, {
  icon: FileIcon,
  label: "Templates",
  route: "/create"
}, {
  icon: ({ className }: { className?: string }) => <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="14.5" cy="14.5" r="3.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
  label: "Design System",
  route: "/design-system"
}];

// Luka Logo Component
const LukaLogo = () => <img src={lukaLogo} alt="Luka" className="w-7 h-7 object-contain" />;

// Dropdown menu items with colored icons
const EngagementDropdownIcon = ({ className }: { className?: string }) => <svg className={className} width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.08317 8.00016H4.90148C5.47248 8.00016 5.99448 8.32277 6.24984 8.8335C6.5052 9.34422 7.02719 9.66683 7.5982 9.66683H12.4015C12.9725 9.66683 13.4945 9.34422 13.7498 8.8335C14.0052 8.32277 14.5272 8.00016 15.0982 8.00016H17.9165M7.47197 1.3335H12.5277C13.4251 1.3335 13.8738 1.3335 14.2699 1.47013C14.6202 1.59096 14.9393 1.78816 15.204 2.04745C15.5034 2.34066 15.7041 2.742 16.1054 3.54464L17.9109 7.15558C18.0684 7.47057 18.1471 7.62806 18.2027 7.79312C18.252 7.9397 18.2876 8.09055 18.309 8.24372C18.3332 8.41618 18.3332 8.59227 18.3332 8.94443V10.6668C18.3332 12.067 18.3332 12.767 18.0607 13.3018C17.821 13.7722 17.4386 14.1547 16.9681 14.3943C16.4334 14.6668 15.7333 14.6668 14.3332 14.6668H5.6665C4.26637 14.6668 3.56631 14.6668 3.03153 14.3943C2.56112 14.1547 2.17867 13.7722 1.93899 13.3018C1.6665 12.767 1.6665 12.067 1.6665 10.6668V8.94443C1.6665 8.59227 1.6665 8.41618 1.69065 8.24372C1.71209 8.09055 1.7477 7.9397 1.79702 7.79312C1.85255 7.62806 1.9313 7.47057 2.0888 7.15558L3.89426 3.54464C4.29559 2.74199 4.49626 2.34066 4.79562 2.04745C5.06036 1.78816 5.37943 1.59096 5.72974 1.47013C6.12588 1.3335 6.57458 1.3335 7.47197 1.3335Z" stroke="#5599D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const dropdownItems = [{
  id: "engagements",
  label: "Engagements",
  icon: EngagementDropdownIcon,
  color: "text-blue-500",
  showCreator: false
}, {
  id: "letters",
  label: "Letters",
  icon: FileText,
  color: "text-purple-500",
  showCreator: true
}, {
  id: "checklists",
  label: "Checklists",
  icon: ChecklistIcon,
  color: "text-orange-500",
  showCreator: true
}, {
  id: "reports",
  label: "Reports",
  icon: FileBarChart,
  color: "text-green-500",
  showCreator: true
}, {
  id: "notes",
  label: "Notes to Financial Statements",
  icon: StickyNote,
  color: "text-yellow-500",
  showCreator: true
}, {
  id: "worksheets",
  label: "Worksheets",
  icon: Table,
  color: "text-blue-400",
  showCreator: false
}];
export type ContentType = "letters" | "checklists" | "reports" | "notes";

interface SidebarProps {
  pageTitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Sidebar({ pageTitle, showBackButton, onBack }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [globalTemplates, setGlobalTemplates] = useState<GlobalTemplate[]>(initialGlobalTemplates);
  const [globalWorksheets, setGlobalWorksheets] = useState<GlobalTemplate[]>(initialGlobalWorksheets);
  const [activeTab, setActiveTab] = useState<"firm" | "master">("firm");
  const [searchQuery, setSearchQuery] = useState("");
  const { isCollapsed: isTemplatesPanelCollapsed, setIsCollapsed: setIsTemplatesPanelCollapsed } = useSecondaryPanel();
  const [selectedGlobalTemplate, setSelectedGlobalTemplate] = useState<string | null>("global-1-1");

  // Engagement Templates tree state
  const [engTemplateExpandedFolders, setEngTemplateExpandedFolders] = useState<Set<string>>(
    () => new Set(["compilation", "review", "audit"])
  );
  const engTemplateSelectedId = searchParams.get("template") || "comp4200";
  const [engTemplateSearchQuery, setEngTemplateSearchQuery] = useState("");

  const toggleEngTemplateFolder = useCallback((id: string) => {
    setEngTemplateExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectEngTemplate = useCallback((id: string) => {
    setSearchParams({ template: id }, { replace: true });
  }, [setSearchParams]);
  
  // Multi-select state for Global Templates
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [bulkAddDialogOpen, setBulkAddDialogOpen] = useState(false);

  // Multi-select state for Engagement Templates tree
  const [selectedEngTemplates, setSelectedEngTemplates] = useState<Set<string>>(new Set());
  const [engBulkAddDialogOpen, setEngBulkAddDialogOpen] = useState(false);
  const [engActiveTab, setEngActiveTab] = useState<"my" | "global">("global");
  const [myEngagementTemplates, setMyEngagementTemplates] = useState<import("@/lib/engagementTemplatesData").MyEngagementTemplate[]>(() =>
    readJsonFromLocalStorage("myEngagementTemplates", [])
  );
  const [engMyFolderExpanded, setEngMyFolderExpanded] = useState<Set<string>>(new Set());

  const handleEngTemplateCheckbox = (id: string, checked: boolean) => {
    setSelectedEngTemplates(prev => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const getAllEngFileIds = (items: TreeItem[]): string[] =>
    items.flatMap(item =>
      item.type === "folder" ? getAllEngFileIds(item.children ?? []) : [item.id]
    );

  const getAllEngFolderIds = (items: TreeItem[]): string[] =>
    items.flatMap(item =>
      item.type === "folder"
        ? [item.id, ...getAllEngFolderIds(item.children ?? [])]
        : []
    );

  // Returns the IDs of all ancestor folders for a given file ID
  const findAncestorFolderIds = (items: TreeItem[], targetId: string, ancestors: string[] = []): string[] | null => {
    for (const item of items) {
      if (item.id === targetId) return ancestors;
      if (item.type === "folder" && item.children) {
        const result = findAncestorFolderIds(item.children, targetId, [...ancestors, item.id]);
        if (result !== null) return result;
      }
    }
    return null;
  };

  // Auto-expand ancestor folders whenever the selected template changes
  useEffect(() => {
    if (!engTemplateSelectedId) return;
    const ancestors = findAncestorFolderIds(templateTree, engTemplateSelectedId);
    if (ancestors && ancestors.length > 0) {
      setEngTemplateExpandedFolders(prev => {
        const next = new Set(prev);
        ancestors.forEach(id => next.add(id));
        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engTemplateSelectedId]);

  const allEngFolderIds = getAllEngFolderIds(templateTree);
  const allEngExpanded = allEngFolderIds.every(id => engTemplateExpandedFolders.has(id));

  const handleEngExpandCollapseAll = () => {
    if (allEngExpanded) {
      setEngTemplateExpandedFolders(new Set());
    } else {
      setEngTemplateExpandedFolders(new Set(allEngFolderIds));
    }
  };

  const handleEngFolderCheckbox = (item: TreeItem, checked: boolean) => {
    const childIds = getAllEngFileIds(item.children ?? []);
    setSelectedEngTemplates(prev => {
      const next = new Set(prev);
      childIds.forEach(id => checked ? next.add(id) : next.delete(id));
      return next;
    });
  };

  const isEngFolderChecked = (item: TreeItem): boolean => {
    const ids = getAllEngFileIds(item.children ?? []);
    return ids.length > 0 && ids.every(id => selectedEngTemplates.has(id));
  };

  const isEngFolderIndeterminate = (item: TreeItem): boolean => {
    const ids = getAllEngFileIds(item.children ?? []);
    const count = ids.filter(id => selectedEngTemplates.has(id)).length;
    return count > 0 && count < ids.length;
  };

  // Resizable panel state
  const [panelWidth, setPanelWidth] = useState(() => {
    const stored = localStorage.getItem("sidebarPanelWidth");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 200 && parsed <= 500) {
        return parsed;
      }
    }
    return 300;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isResizeHovering, setIsResizeHovering] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Save panel width to localStorage
  useEffect(() => {
    if (!isTemplatesPanelCollapsed) {
      localStorage.setItem("sidebarPanelWidth", String(panelWidth));
    }
  }, [panelWidth, isTemplatesPanelCollapsed]);

  // Resize handlers
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing && panelRef.current) {
        const panelRect = panelRef.current.getBoundingClientRect();
        const newWidth = e.clientX - panelRect.left;
        
        if (newWidth >= 200 && newWidth <= 500) {
          setPanelWidth(newWidth);
        } else if (newWidth < 200) {
          setPanelWidth(200);
        } else if (newWidth > 500) {
          setPanelWidth(500);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, resize, stopResizing]);

  // Persist dropdown selection in localStorage
  const [selectedDropdown, setSelectedDropdown] = useState(() => {
    const stored = localStorage.getItem("selectedDropdown");
    return stored || "engagements";
  });

  // Sync selection to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedDropdown", selectedDropdown);
  }, [selectedDropdown]);

  // Restore selection from navigation state if contentType is passed
  useEffect(() => {
    const navState = location.state as {
      contentType?: string;
    } | null;
    if (navState?.contentType) {
      setSelectedDropdown(navState.contentType);
    }
  }, [location.state]);
  const [savedChecklists, setSavedChecklists] = useState<SavedChecklist[]>([]);

  // Context menu state
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<SavedChecklist | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [selectedMoveFolder, setSelectedMoveFolder] = useState("");

  // Load saved checklists on mount and listen for new saves
  useEffect(() => {
    const seedDefaultCompilationChecklists = (): SavedChecklist[] => {
      const items: { id: string; generator: () => any }[] = [
        { id: "default-compilation-cac", generator: generateClientAcceptanceContinuanceChecklist },
        { id: "default-compilation-independence", generator: generateIndependenceChecklist },
        { id: "default-compilation-kcb", generator: generateKnowledgeOfClientBusinessChecklist },
        { id: "default-compilation-planning", generator: generatePlanningChecklist },
        { id: "default-compilation-el", generator: generateEngagementLetterChecklist },
        { id: "default-compilation-mr", generator: generateManagementResponsibilityChecklist },
      ];
      const seeded: SavedChecklist[] = items.map(({ id, generator }) => {
        const data = generator();
        return {
          id,
          name: data.title,
          folderId: "5",
          folderName: "Compilation Checklists",
          data,
        };
      });
      writeJsonToLocalStorage("savedChecklists", seeded);
      return seeded;
    };

    const loadSavedChecklists = () => {
      const parsed = readJsonFromLocalStorage<unknown>("savedChecklists", []);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setSavedChecklists(parsed as SavedChecklist[]);
      } else if (Array.isArray(parsed)) {
        // Empty list — seed Compilation defaults so the user sees them on first load.
        setSavedChecklists(seedDefaultCompilationChecklists());
      } else {
        // Reset corrupted legacy value so it can't crash future loads.
        removeLocalStorageKey("savedChecklists");
        setSavedChecklists(seedDefaultCompilationChecklists());
      }
    };
    loadSavedChecklists();
    const handleChecklistSaved = (event: CustomEvent<SavedChecklist>) => {
      setSavedChecklists(prev => prev.some(c => c.id === event.detail.id) ? prev : [...prev, event.detail]);
    };
    window.addEventListener("checklistSaved", handleChecklistSaved as EventListener);

    const handleEngTemplateSaved = () => {
      const updated = readJsonFromLocalStorage<import("@/lib/engagementTemplatesData").MyEngagementTemplate[]>("myEngagementTemplates", []);
      setMyEngagementTemplates(updated);
      setEngActiveTab("my");
    };
    window.addEventListener("engagementTemplateSaved", handleEngTemplateSaved);

    return () => {
      window.removeEventListener("checklistSaved", handleChecklistSaved as EventListener);
      window.removeEventListener("engagementTemplateSaved", handleEngTemplateSaved);
    };
  }, []);

  // Sync to localStorage whenever savedChecklists changes
  useEffect(() => {
    if (savedChecklists.length > 0) {
      writeJsonToLocalStorage("savedChecklists", savedChecklists);
    }
  }, [savedChecklists]);
  const handleDropdownSelect = (itemId: string) => {
    // Write synchronously BEFORE any navigation so that if the Sidebar
    // remounts on the new page it reads the correct value from localStorage.
    localStorage.setItem("selectedDropdown", itemId);
    setSelectedDropdown(itemId);
    if (itemId === "engagements") {
      // Navigate to engagement templates and auto-select the first template
      // (comp4200) so the content area immediately shows something useful.
      const firstTemplate = "comp4200";
      if (location.pathname !== "/engagement-templates") {
        navigate(`/engagement-templates?template=${firstTemplate}`);
      } else {
        // Already on the page — just update the search param to select first item.
        setSearchParams({ template: firstTemplate }, { replace: true });
      }
      // Expand the compilation folder so the selected item is visible in the tree.
      setEngTemplateExpandedFolders(prev => new Set([...prev, "compilation"]));
    }
    // All other options (checklists, worksheets, letters, reports, notes)
    // just update the dropdown state — the sidebar panel reacts automatically.
  };
  const toggleFolder = (id: string) => {
    setTemplates(prev => prev.map(t => t.id === id ? {
      ...t,
      isExpanded: !t.isExpanded
    } : t));
  };

  // Toggle global template folder (supports nested folders)
  const toggleGlobalFolder = (id: string) => {
    const toggle = (items: GlobalTemplate[]): GlobalTemplate[] =>
      items.map(t => t.id === id
        ? { ...t, isExpanded: !t.isExpanded }
        : t.children
          ? { ...t, children: toggle(t.children) }
          : t
      );
    setGlobalTemplates(prev => toggle(prev));
  };

  // Toggle global worksheet folder (mirrors toggleGlobalFolder but for worksheets state)
  const toggleGlobalWorksheet = (id: string) => {
    const toggle = (items: GlobalTemplate[]): GlobalTemplate[] =>
      items.map(t => t.id === id
        ? { ...t, isExpanded: !t.isExpanded }
        : t.children
          ? { ...t, children: toggle(t.children) }
          : t
      );
    setGlobalWorksheets(prev => toggle(prev));
  };

  // Get all child template IDs from a folder
  const getChildTemplateIds = (folder: GlobalTemplate): string[] => {
    if (!folder.children) return [];
    return folder.children.filter(c => c.type === 'file').map(c => c.id);
  };

  // Handle template checkbox change
  const handleTemplateCheckboxChange = (templateId: string, checked: boolean) => {
    setSelectedTemplates(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(templateId);
      } else {
        newSet.delete(templateId);
      }
      return newSet;
    });
  };

  // Handle folder checkbox change (selects all children)
  const handleFolderCheckboxChange = (folder: GlobalTemplate, checked: boolean) => {
    const childIds = getChildTemplateIds(folder);
    
    if (checked) {
      // Unselect any previously selected folder's children
      if (selectedFolder && selectedFolder !== folder.id) {
        const prevFolder = globalTemplates.find(t => t.id === selectedFolder);
        if (prevFolder) {
          const prevChildIds = getChildTemplateIds(prevFolder);
          setSelectedTemplates(prev => {
            const newSet = new Set(prev);
            prevChildIds.forEach(id => newSet.delete(id));
            childIds.forEach(id => newSet.add(id));
            return newSet;
          });
        } else {
          setSelectedTemplates(prev => {
            const newSet = new Set(prev);
            childIds.forEach(id => newSet.add(id));
            return newSet;
          });
        }
      } else {
        setSelectedTemplates(prev => {
          const newSet = new Set(prev);
          childIds.forEach(id => newSet.add(id));
          return newSet;
        });
      }
      setSelectedFolder(folder.id);
    } else {
      setSelectedTemplates(prev => {
        const newSet = new Set(prev);
        childIds.forEach(id => newSet.delete(id));
        return newSet;
      });
      setSelectedFolder(null);
    }
  };

  // Check if a folder is fully selected
  const isFolderSelected = (folder: GlobalTemplate): boolean => {
    const childIds = getChildTemplateIds(folder);
    if (childIds.length === 0) return false;
    return childIds.every(id => selectedTemplates.has(id));
  };

  // Check if folder selection is disabled (another folder is selected)
  const isFolderDisabled = (folderId: string): boolean => {
    return selectedFolder !== null && selectedFolder !== folderId;
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedTemplates(new Set());
    setSelectedFolder(null);
  };

  // Get selected template details for the dialog
  const getSelectedTemplateDetails = (): { id: string; name: string }[] => {
    return Array.from(selectedTemplates).map(id => {
      // Find the template name from globalTemplates
      for (const folder of globalTemplates) {
        if (folder.children) {
          const child = folder.children.find(c => c.id === id);
          if (child) {
            return { id: child.id, name: child.name };
          }
        }
      }
      return { id, name: id };
    });
  };

  // Render global template item with checkbox.
  // onToggle overrides the default toggleGlobalFolder — pass toggleGlobalWorksheet for the worksheets panel.
  const renderGlobalTemplate = (template: GlobalTemplate, depth = 0, onToggle?: (id: string) => void) => {
    const hasChildren = template.children && template.children.length > 0;
    const isSelected = selectedGlobalTemplate === template.id;
    const isTemplateChecked = selectedTemplates.has(template.id);
    const isFolderChecked = template.type === "folder" && isFolderSelected(template);
    const folderDisabled = template.type === "folder" && isFolderDisabled(template.id);
    const isWorksheetItem = template.type === "file" && (
      template.name.startsWith("Worksheet") || template.name.startsWith("Summary of Identified")
    );
    
    return (
      <div key={template.id}>
        <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-sm",
            isSelected && template.type === "file" ? "bg-primary/10 text-primary" : "hover:bg-muted",
            folderDisabled && "opacity-50"
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {/* Checkbox */}
          <Checkbox
            checked={template.type === "folder" ? isFolderChecked : isTemplateChecked}
            disabled={folderDisabled}
            onCheckedChange={(checked) => {
              if (template.type === "folder") {
                handleFolderCheckboxChange(template, !!checked);
              } else {
                handleTemplateCheckboxChange(template.id, !!checked);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 flex-shrink-0"
          />
          
          {template.type === "folder" ? (
            <>
              <div
                className="flex items-center gap-1 flex-1 min-w-0"
                onClick={() => (onToggle ?? toggleGlobalFolder)(template.id)}
              >
                {hasChildren ? (
                  template.isExpanded
                    ? <FolderMinusIcon className="h-4 w-4 text-primary flex-shrink-0" />
                    : <FolderPlusIcon className="h-4 w-4 text-primary flex-shrink-0" />
                ) : (
                  <FolderSolidIcon className="h-4 w-4 text-primary flex-shrink-0" />
                )}
                <span className="truncate flex-1 font-semibold">{template.name}</span>
              </div>
            </>
          ) : (
            <div
              className="flex items-center gap-2 flex-1 min-w-0"
              onClick={() => {
                setSelectedGlobalTemplate(template.id);
                // Navigate to builder with global template ID for preview
                navigate("/builder", {
                  state: {
                    globalTemplateId: template.id,
                    timestamp: Date.now()
                  }
                });
              }}
            >
              {isWorksheetItem
                ? <WorksheetIcon className="h-4 w-4 flex-shrink-0" />
                : <ChecklistIcon className="h-4 w-4 flex-shrink-0" />}
              <span className={cn(
                "truncate flex-1",
                isSelected ? "font-semibold" : ""
              )}>
                {template.name}
              </span>
            </div>
          )}
        </div>
        {template.type === "folder" && template.isExpanded && template.children && (
          <div>
            {template.children.map(child => renderGlobalTemplate(child, depth + 1, onToggle))}
          </div>
        )}
      </div>
    );
  };

  // ── Engagement Template Tree Node (for sidebar) ──
  const renderEngTemplateTreeNode = (item: TreeItem, depth: number): React.ReactNode => {
    const isExpanded = engTemplateExpandedFolders.has(item.id);

    if (item.type === "folder") {
      const folderChecked = isEngFolderChecked(item);
      const folderIndeterminate = isEngFolderIndeterminate(item);
      return (
        <div key={item.id}>
          <div
            className={cn(
              "flex items-center gap-2 w-full py-1.5 px-2 text-sm hover:bg-primary/10 cursor-pointer select-none rounded-[8px]",
              hasDarkSecondary ? "text-white" : "text-black dark:text-white"
            )}
            style={{ paddingLeft: `${depth * 18 + 8}px` }}
          >
            <Checkbox
              checked={folderIndeterminate ? "indeterminate" : folderChecked}
              onCheckedChange={(checked) => handleEngFolderCheckbox(item, !!checked)}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 flex-shrink-0"
            />
            <div
              className="flex items-center gap-1.5 flex-1 min-w-0 font-semibold"
              onClick={() => toggleEngTemplateFolder(item.id)}
            >
              {isExpanded ? (
                <FolderMinusIcon className="h-4 w-4 text-primary flex-shrink-0" />
              ) : (
                <FolderPlusIcon className="h-4 w-4 text-primary flex-shrink-0" />
              )}
              <span className="flex-1 text-left truncate">{item.label}</span>
            </div>
          </div>
          {isExpanded && item.children?.map((child) => renderEngTemplateTreeNode(child, depth + 1))}
        </div>
      );
    }

    // File leaf
    const isSelected = engTemplateSelectedId === item.id;
    const isChecked = selectedEngTemplates.has(item.id);
    return (
      <div
        key={item.id}
        className={cn(
          "flex items-center gap-2 w-full py-1.5 px-2 text-sm hover:bg-primary/10 cursor-pointer select-none rounded-[8px] font-medium",
          isSelected
            ? (hasDarkSecondary ? "bg-white/15 text-white" : "bg-primary/10 text-primary ring-1 ring-primary/25")
            : (hasDarkSecondary ? "text-white/80" : "text-black dark:text-white")
        )}
        style={{ paddingLeft: `${depth * 18 + 8}px` }}
      >
        <Checkbox
          checked={isChecked}
          onCheckedChange={(checked) => handleEngTemplateCheckbox(item.id, !!checked)}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 flex-shrink-0"
        />
        <div
          className="flex items-center gap-1.5 flex-1 min-w-0"
          onClick={() => selectEngTemplate(item.id)}
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.08317 8.00016H4.90148C5.47248 8.00016 5.99448 8.32277 6.24984 8.8335C6.5052 9.34422 7.02719 9.66683 7.5982 9.66683H12.4015C12.9725 9.66683 13.4945 9.34422 13.7498 8.8335C14.0052 8.32277 14.5272 8.00016 15.0982 8.00016H17.9165M7.47197 1.3335H12.5277C13.4251 1.3335 13.8738 1.3335 14.2699 1.47013C14.6202 1.59096 14.9393 1.78816 15.204 2.04745C15.5034 2.34066 15.7041 2.742 16.1054 3.54464L17.9109 7.15558C18.0684 7.47057 18.1471 7.62806 18.2027 7.79312C18.252 7.9397 18.2876 8.09055 18.309 8.24372C18.3332 8.41618 18.3332 8.59227 18.3332 8.94443V10.6668C18.3332 12.067 18.3332 12.767 18.0607 13.3018C17.821 13.7722 17.4386 14.1547 16.9681 14.3943C16.4334 14.6668 15.7333 14.6668 14.3332 14.6668H5.6665C4.26637 14.6668 3.56631 14.6668 3.03153 14.3943C2.56112 14.1547 2.17867 13.7722 1.93899 13.3018C1.6665 12.767 1.6665 12.067 1.6665 10.6668V8.94443C1.6665 8.59227 1.6665 8.41618 1.69065 8.24372C1.71209 8.09055 1.7477 7.9397 1.79702 7.79312C1.85255 7.62806 1.9313 7.47057 2.0888 7.15558L3.89426 3.54464C4.29559 2.74199 4.49626 2.34066 4.79562 2.04745C5.06036 1.78816 5.37943 1.59096 5.72974 1.47013C6.12588 1.3335 6.57458 1.3335 7.47197 1.3335Z" stroke="#5599D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="flex-1 text-left truncate">{item.label}</span>
        </div>
      </div>
    );
  };

  // Checklist actions
  const handleDuplicate = (checklist: SavedChecklist) => {
    const newChecklist: SavedChecklist = {
      ...checklist,
      id: `checklist-${Date.now()}`,
      name: `${checklist.name} (Copy)`
    };
    setSavedChecklists(prev => [...prev, newChecklist]);
  };
  const handleDelete = (checklistId: string) => {
    setSavedChecklists(prev => prev.filter(c => c.id !== checklistId));
    const remaining = savedChecklists.filter(c => c.id !== checklistId);
    writeJsonToLocalStorage("savedChecklists", remaining);
  };
  const handleRenameStart = (checklist: SavedChecklist) => {
    setSelectedChecklist(checklist);
    setRenameValue(checklist.name);
    setRenameDialogOpen(true);
  };
  const handleRenameConfirm = () => {
    if (selectedChecklist && renameValue.trim()) {
      setSavedChecklists(prev => prev.map(c => c.id === selectedChecklist.id ? {
        ...c,
        name: renameValue.trim()
      } : c));
      setRenameDialogOpen(false);
      setSelectedChecklist(null);
    }
  };
  const handleMoveStart = (checklist: SavedChecklist) => {
    setSelectedChecklist(checklist);
    setSelectedMoveFolder(checklist.folderId);
    setMoveDialogOpen(true);
  };
  const handleMoveConfirm = () => {
    if (selectedChecklist && selectedMoveFolder) {
      const targetFolder = templates.find(t => t.id === selectedMoveFolder);
      if (targetFolder) {
        setSavedChecklists(prev => prev.map(c => c.id === selectedChecklist.id ? {
          ...c,
          folderId: selectedMoveFolder,
          folderName: targetFolder.name
        } : c));
      }
      setMoveDialogOpen(false);
      setSelectedChecklist(null);
    }
  };

  // Get checklists for a specific folder
  const getChecklistsForFolder = (folderId: string) => {
    return savedChecklists.filter(c => c.folderId === folderId);
  };
  const renderTemplate = (template: Template, depth = 0) => {
    const folderChecklists = template.type === "folder" ? getChecklistsForFolder(template.id) : [];
    const hasChildren = template.children && template.children.length > 0 || folderChecklists.length > 0;
    return <div key={template.id}>
        <div className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted transition-colors text-sm ${depth > 0 ? "ml-6" : ""}`} onClick={() => template.type === "folder" && toggleFolder(template.id)}>
          <Checkbox className="h-4 w-4" />
          {template.type === "folder" ? <>
               <span className="relative flex-shrink-0 w-4 h-4 flex items-center justify-center">
                 {hasChildren ? (
                   template.isExpanded
                     ? <FolderMinusIcon className="h-4 w-4 text-primary" />
                     : <FolderPlusIcon className="h-4 w-4 text-primary" />
                 ) : (
                   <FolderSolidIcon className="h-4 w-4 text-primary" />
                 )}
               </span>
            </> : <>
              <span className="w-4 flex-shrink-0" />
              <ChecklistIcon className="h-4 w-4 flex-shrink-0" />
            </>}
          <span className="truncate flex-1 text-foreground font-semibold">{template.name}</span>
          {folderChecklists.length > 0 && <span className="text-xs text-muted-foreground">{folderChecklists.length}</span>}
        </div>
        {template.type === "folder" && template.isExpanded && <>
            {/* Render saved checklists */}
            {folderChecklists.map(checklist => <div key={checklist.id} className="group flex items-center gap-2 py-1.5 px-2 pl-8 rounded-md cursor-pointer hover:bg-muted transition-colors text-sm" onClick={() => {
          // Navigate to builder with saved checklist ID
          navigate("/builder", {
            state: {
              checklistId: checklist.id,
              timestamp: Date.now()
            }
          });
        }}>
                <Checkbox className="h-4 w-4" onClick={e => e.stopPropagation()} />
                <ChecklistIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate flex-1 text-foreground font-semibold">{checklist.name}</span>

                {/* Context Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted-foreground/10 rounded transition-opacity">
                      <MoreVertical className="h-3.5 w-3.5 text-muted-foreground icon-more" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 bg-card border shadow-sm">
                    <DropdownMenuItem onClick={e => {
                e.stopPropagation();
                handleDuplicate(checklist);
              }} className="gap-2 cursor-pointer">
                      <Copy className="h-4 w-4 text-primary icon-copy" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={e => {
                e.stopPropagation();
                handleDelete(checklist.id);
              }} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4 icon-trash" />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={e => {
                e.stopPropagation();
                handleRenameStart(checklist);
              }} className="gap-2 cursor-pointer">
                      <Pencil className="h-4 w-4 text-primary icon-edit" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={e => {
                e.stopPropagation();
                handleMoveStart(checklist);
              }} className="gap-2 cursor-pointer">
                      <FolderInput className="h-4 w-4 text-primary icon-folder" />
                      Move to different folder
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>)}
            {/* Render child folders/templates */}
            {template.children?.map(child => renderTemplate(child, depth + 1))}
          </>}
      </div>;
  };
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["co"]));
  const [allSectionsExpanded, setAllSectionsExpanded] = useState(false);
  const [showSignoffs, setShowSignoffs] = useState(false);
  const [signoffsMode, setSignoffsMode] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [signoffChecks, setSignoffChecks] = useState<Record<string, { p1: boolean; p2: boolean }>>({});
  const allNodeIdsRef = useRef<string[]>([]);
  const [hasDarkSecondary, setHasDarkSecondary] = useState(false);

  const toggleAllSignoffs = (pid: "p1" | "p2") => {
    const ids = allNodeIdsRef.current;
    if (ids.length === 0) return;
    const allChecked = ids.every(id => !!signoffChecks[id]?.[pid]);
    setSignoffChecks(prev => {
      const next = { ...prev };
      ids.forEach(id => {
        const cur = next[id] ?? { p1: false, p2: false };
        next[id] = { ...cur, [pid]: !allChecked };
      });
      return next;
    });
  };

  const isAllSignoffsChecked = (pid: "p1" | "p2") => {
    const ids = allNodeIdsRef.current;
    return ids.length > 0 && ids.every(id => !!signoffChecks[id]?.[pid]);
  };

  // All parent IDs in the engagement tree (used to expand all)
  const allParentIds = [
    "co", "do", "pr", "pr-assets", "pr-ca", "pr-ppe",
    "pr-liab", "pr-cl", "pr-ltl", "pr-equity", "pr-sc",
    "pr-rev", "pr-rev-sub", "pr-exp", "pr-opex",
    "fs", "fs-docs", "so"
  ];

  const enterSignoffsMode = () => {
    setSignoffsMode(true);
    setExpandedSections(new Set(allParentIds));
    setAllSectionsExpanded(true);
  };
  const exitSignoffsMode = () => setSignoffsMode(false);


  useEffect(() => {
    const checkGradient = () => {
      const val = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-secondary-gradient').trim();
      setHasDarkSecondary(!!val && val !== 'none');
    };
    checkGradient();
    const observer = new MutationObserver(checkGradient);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  // Portal target for secondary panels (rendered below the global header in Layout)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.getElementById('sidebar-secondary-portal');
    setPortalTarget(el);
  }, []);
  
  // Determine if a secondary panel is visible and expanded (for dark mode gradient)
  const isOnEngagementDetail = location.pathname.startsWith("/engagements/") && location.pathname !== "/engagements/create";
  const isOnTemplatesPage = location.pathname !== "/dashboard" && location.pathname !== "/clients" && location.pathname !== "/engagements" && location.pathname !== "/teams" && location.pathname !== "/design-system" && !location.pathname.startsWith("/engagements/");
  const hasSecondaryPanelExpanded = (isOnEngagementDetail || isOnTemplatesPage) && !isTemplatesPanelCollapsed;
  
  return <div className={`flex h-screen relative group/sidebar`} style={{ background: 'var(--sidebar-gradient, hsl(var(--sidebar-bg)))' }}>
      {/* Icon sidebar - dark navy with curved corner, expands on click only */}
      <div className={`sidebar-nav relative flex flex-col py-4 gap-2 transition-all duration-300 ease-in-out ${isNavExpanded ? "w-56 items-start px-3" : "w-14 items-center group/sidebar-collapsed"}`}>
        {/* Luka Logo / Sidebar toggle */}
        <div className={`h-10 mb-4 flex items-center ${isNavExpanded ? "px-2 w-full justify-between" : "justify-center w-full cursor-pointer"}`} onClick={() => !isNavExpanded && setIsNavExpanded(true)} title={!isNavExpanded ? "Expand sidebar" : undefined}>
          {isNavExpanded ? (
            <>
              <svg width="140" height="19" viewBox="0 0 234 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.53909 28.2869C3.03402 25.659 0 20.7708 0 15.1701C0 6.79591 6.79591 0 15.1778 0C23.5597 0 30.3556 6.79591 30.3556 15.1778C30.3556 17.9743 29.5434 20.4184 28.218 22.6709L24.2645 20.3801C25.1456 18.8477 25.6436 17.0702 25.6436 15.1778C25.6436 9.40088 20.9547 4.71193 15.1778 4.71193C9.40088 4.71193 4.71193 9.40088 4.71193 15.1778C4.71193 19.0086 6.77292 22.3644 9.84525 24.1879L7.53909 28.2946V28.2869Z" fill="white" />
              <path d="M34.3629 2.82739C38.8679 5.45535 41.9019 10.3435 41.9019 15.9442C41.9019 24.3261 35.106 31.122 26.7242 31.122C18.3423 31.122 11.5464 24.3261 11.5464 15.9442C11.5464 13.1477 12.3585 10.7036 13.684 8.45106L17.6374 10.7419C16.7563 12.2742 16.2583 14.0517 16.2583 15.9442C16.2583 21.7211 20.9473 26.41 26.7242 26.41C32.5011 26.41 37.19 21.7211 37.19 15.9442C37.19 12.1133 35.129 8.75753 32.0567 6.93405L34.3629 2.82739Z" fill="white" />
              <path d="M65.7268 17.9589L70.7146 21.2611C68.9677 23.7281 66.0486 25.2835 62.6162 25.2835C56.9848 25.2835 52.7173 21.1002 52.7173 15.5455C52.7173 9.99076 56.9848 5.83813 62.6162 5.83813C66.0486 5.83813 68.9754 7.39346 70.7146 9.83753L65.7268 13.1397C65.0296 12.228 63.9263 11.6917 62.6162 11.6917C60.3866 11.6917 58.7547 13.3006 58.7547 15.5531C58.7547 17.8057 60.3943 19.4146 62.6162 19.4146C63.934 19.4146 65.0296 18.8783 65.7268 17.9666V17.9589Z" fill="white" />
              <path d="M93.0561 15.5455C93.0561 21.1002 88.7885 25.2835 83.1572 25.2835C77.5259 25.2835 73.2583 21.1002 73.2583 15.5455C73.2583 9.99076 77.5259 5.83813 83.1572 5.83813C88.7885 5.83813 93.0561 10.0214 93.0561 15.5455ZM87.0187 15.5455C87.0187 13.2929 85.3791 11.684 83.1572 11.684C80.9353 11.684 79.2957 13.2929 79.2957 15.5455C79.2957 17.798 80.9353 19.407 83.1572 19.407C85.3791 19.407 87.0187 17.8287 87.0187 15.5455Z" fill="white" />
              <path d="M114.853 6.15991V17.346C114.853 22.9237 111.39 25.2835 106.295 25.2835C101.2 25.2835 97.7373 22.9237 97.7373 17.346V6.15991H103.744V16.7024C103.744 18.4492 104.656 19.4146 106.295 19.4146C107.935 19.4146 108.816 18.4492 108.816 16.7024V6.15991H114.853Z" fill="white" />
              <path d="M137.593 6.15991V24.931H132.146L126.246 15.4382V24.931H120.209V6.15991H125.656L131.556 15.6527V6.15991H137.593Z" fill="white" />
              <path d="M156.954 11.684H152.556V24.931H146.518V11.684H142.144V6.15991H156.946V11.684H156.954Z" fill="white" />
              <path d="M171.435 22.0349H166.125L165.32 24.931H158.831L165.106 6.15991H172.454L178.728 24.931H172.239L171.435 22.0349ZM170.278 17.8516L168.776 12.4042L167.274 17.8516H170.278Z" fill="white" />
              <path d="M198.625 19.384C198.625 23.2225 196.021 24.9387 190.849 24.9387H182.75V6.15991H190.129C195.308 6.15991 197.936 7.6616 197.936 11.2319C197.936 13.1091 197.047 14.3196 195.599 15.0398V15.0934C197.476 15.8443 198.633 17.2157 198.633 19.384H198.625ZM188.78 10.5041V13.3772H189.884C191.14 13.3772 191.814 12.9175 191.814 11.9292C191.814 10.9408 191.14 10.5041 189.884 10.5041H188.78ZM192.534 18.9013C192.534 17.9129 191.837 17.4532 190.604 17.4532H188.78V20.38H190.604C191.837 20.38 192.534 19.8973 192.534 18.9013Z" fill="white" />
              <path d="M216.218 19.4069V24.931H203.185V6.15991H209.222V19.4069H216.225H216.218Z" fill="white" />
              <path d="M234 19.8896V24.931H220.776V6.15991H233.755V11.2013H226.806V13.2929H232.897V17.6371H226.806V19.8896H233.992H234Z" fill="white" />
            </svg>
              <button
                onClick={(e) => { e.stopPropagation(); setIsNavExpanded(false); }}
                aria-label="Collapse sidebar"
                className="w-7 h-7 rounded-md flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" className="shrink-0" aria-hidden="true">
                  <path fill="currentColor" d="M20.25 7c0-.69-.56-1.25-1.25-1.25H9.75v12.5H19c.69 0 1.25-.56 1.25-1.25zM3.75 17c0 .69.56 1.25 1.25 1.25h3.25V5.75H5c-.69 0-1.25.56-1.25 1.25zm18 0A2.75 2.75 0 0 1 19 19.75H5A2.75 2.75 0 0 1 2.25 17V7A2.75 2.75 0 0 1 5 4.25h14A2.75 2.75 0 0 1 21.75 7z"></path>
                </svg>
              </button>
            </>
          ) : (
            <div className="relative w-10 h-10 flex items-center justify-center">
              <img src={lukaLogo} alt="Luka" className="w-7 h-7 object-contain transition-opacity duration-200 group-hover/sidebar-collapsed:opacity-0" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20" className="absolute shrink-0 text-white opacity-0 group-hover/sidebar-collapsed:opacity-100 transition-opacity duration-200" aria-hidden="true">
                <path fill="currentColor" d="M20.25 7c0-.69-.56-1.25-1.25-1.25H9.75v12.5H19c.69 0 1.25-.56 1.25-1.25zM3.75 17c0 .69.56 1.25 1.25 1.25h3.25V5.75H5c-.69 0-1.25.56-1.25 1.25zm18 0A2.75 2.75 0 0 1 19 19.75H5A2.75 2.75 0 0 1 2.25 17V7A2.75 2.75 0 0 1 5 4.25h14A2.75 2.75 0 0 1 21.75 7z"></path>
              </svg>
            </div>
          )}
        </div>

        {/* Nav items */}
        {navItems.map((item, index) => {
        const isActive = item.route ? location.pathname === item.route : false;
        return <div key={index} className={`sidebar-item ${isActive ? "active" : ""} ${isNavExpanded ? "w-full justify-start gap-3 px-3" : ""} ${item.route ? "cursor-pointer" : ""}`} title={!isNavExpanded ? item.label : undefined} onClick={() => item.route && navigate(item.route)}>
              <item.icon />
              {isNavExpanded && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </div>;
      })}

        {/* Spacer */}
        <div className="flex-1" />




        {/* Support */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`sidebar-item cursor-pointer ${isNavExpanded ? "w-full justify-start gap-3 px-3" : ""}`}>
              <Headphones className="h-5 w-5 icon-bounce" />
              {isNavExpanded && <span className="text-sm font-medium">Support</span>}
            </div>
          </TooltipTrigger>
          {!isNavExpanded && <TooltipContent side="right">Support</TooltipContent>}
        </Tooltip>



      </div>

      {/* Engagement Sections panel - portalled below the global header */}
      {portalTarget && location.pathname.startsWith("/engagements/") && location.pathname !== "/engagements/create" && createPortal(<>
          <div 
            ref={panelRef}
            style={{ width: isTemplatesPanelCollapsed ? 0 : (signoffsMode ? Math.max(panelWidth, 440) : panelWidth) }}
            className={cn(
              `flex flex-col relative z-40 transition-all group/templates sidebar-secondary-panel ${hasDarkSecondary ? 'sidebar-dark-theme' : ''}`,
              isTemplatesPanelCollapsed 
                ? "overflow-hidden shadow-none bg-transparent" 
                : "shadow-md border-r border-[#DDE1E9] dark:border-border",
              isResizing && "transition-none"
            )}
          >
            {signoffsMode && !isTemplatesPanelCollapsed && (
              <div className="pointer-events-none absolute top-0 bottom-0 w-px bg-border/60 z-10" style={{ right: "104px" }} />
            )}
            <div className={`p-3 ${isTemplatesPanelCollapsed ? "hidden" : ""}`}>
              <div className="flex gap-2 items-start">
                <div className={cn("relative transition-all duration-300 ease-in-out", isSearchFocused ? "flex-1" : "flex-1")}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground icon-search" />
                  <Input
                    placeholder="Search"
                    className="pl-9 h-9 text-sm"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
                <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0 bg-primary/10 hover:bg-primary/20"
                  onClick={() => {
                    // All parent node IDs that have children
                    const allParentIds = [
                      "co", "do", "pr", "pr-assets", "pr-ca", "pr-ppe",
                      "pr-liab", "pr-cl", "pr-ltl", "pr-equity", "pr-sc",
                      "pr-rev", "pr-rev-sub", "pr-exp", "pr-opex",
                      "fs", "fs-docs", "so"
                    ];
                    if (allSectionsExpanded) {
                      setExpandedSections(new Set());
                    } else {
                      setExpandedSections(new Set(allParentIds));
                    }
                    setAllSectionsExpanded(!allSectionsExpanded);
                  }}
                >
                  <svg className="text-foreground" width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {allSectionsExpanded ? (
                      <path d="M6.94436 9.7219L2.08325 14.583M2.08325 14.583H6.24992M2.08325 14.583V10.4163M9.72214 6.94412L14.5833 2.08301M14.5833 2.08301H10.4166M14.5833 2.08301V6.24967" stroke="currentColor" strokeWidth="1.38889" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M9.72214 6.94412L14.5833 2.08301M14.5833 2.08301H10.4166M14.5833 2.08301V6.24967M6.94436 9.7219L2.08325 14.583M2.08325 14.583H6.24992M2.08325 14.583L2.08325 10.4163" stroke="currentColor" strokeWidth="1.38889" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => (signoffsMode ? exitSignoffsMode() : enterSignoffsMode())}
                  aria-label={signoffsMode ? "Close Signoffs" : "Open Signoffs"}
                  title="Signoffs"
                  className={cn(
                    "h-9 shrink-0 gap-1 text-xs font-medium text-foreground transition-all duration-300 ease-in-out overflow-hidden",
                    isSearchFocused ? "w-9 px-0 justify-center" : "px-2",
                    signoffsMode ? "bg-primary/30 hover:bg-primary/40" : "bg-primary/10 hover:bg-primary/20"
                  )}
                >
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <span
                    className={cn(
                      "whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden",
                      isSearchFocused ? "max-w-0 opacity-0 ml-0" : "max-w-[80px] opacity-100"
                    )}
                  >
                    Signoffs
                  </span>
                </Button>
                {/* Signoffs preparer chips - inline beside the Signoffs button when active */}
                {signoffsMode && (
                  <div className="flex items-start gap-2 pl-3 ml-auto">
                    {[
                      { id: "p1", initials: "CA", label: "Preparer", color: "bg-purple-500" },
                      { id: "p2", initials: "JD", label: "Reviewer", color: "bg-sky-500" },
                    ].map(p => (
                      <div key={p.id} className="w-9 flex flex-col items-center gap-1">
                        <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white", p.color)}>
                          {p.initials}
                        </div>
                        <span className="text-[9px] text-muted-foreground leading-tight whitespace-nowrap">{p.label}</span>
                        <button
                          type="button"
                          onClick={() => toggleAllSignoffs(p.id as "p1" | "p2")}
                          aria-label={isAllSignoffsChecked(p.id as "p1" | "p2") ? `Uncheck all ${p.label} signoffs` : `Check all ${p.label} signoffs`}
                          className="h-6 w-6 rounded-md flex items-center justify-center hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={isAllSignoffsChecked(p.id as "p1" | "p2") ? signoffUncheckAllIcon : signoffCheckAllIcon}
                            alt=""
                            className="h-6 w-6"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto scrollbar-hide p-2 pt-0 ${signoffsMode ? "pr-3" : ""} ${isTemplatesPanelCollapsed ? "hidden" : ""}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Engagement Sections - recursive tree */}
              {(() => {
                type SectionNode = {
                  id: string;
                  code?: string;
                  label: string;
                  icon?: "checklist" | "letter" | "folder" | "doc" | "completion" | "book";
                  hasPlus?: boolean;
                  route?: string;
                  children?: SectionNode[];
                };

                const engId = location.pathname.split("/engagements/")[1]?.split("/")[0];
                const isAuditEngagement = engId?.startsWith("AUD-");

                const auditEngagementTree: SectionNode[] = [
                  {
                    id: "aud-dep-reg",
                    label: "Dependency Register",
                    icon: "checklist",
                    route: "dependency-register",
                  },
                  {
                    id: "aud-co", code: "CO", label: "Client Onboarding", icon: "folder",
                    children: [
                      { id: "aud-new-accept", code: "NA", label: "New engagement acceptance", icon: "checklist", route: "checklist/aud-new-accept" },
                      { id: "aud-exist-cont", code: "EC", label: "Existing engagement continuance", icon: "checklist", route: "checklist/aud-exist-cont" },
                      { id: "aud-ind", code: "IND", label: "Independence & Ethical Requirements", icon: "checklist", route: "checklist/aud-ind" },
                      { id: "aud-el", code: "EL", label: "Engagement Letter", icon: "letter", route: "checklist/aud-el" },
                      { id: "aud-aml", code: "AML", label: "Anti-Money Laundering (AML) Compliance", icon: "checklist", route: "checklist/aud-aml" },
                    ]
                  },
                  {
                    id: "aud-pl-sec", code: "PL", label: "Planning", icon: "folder",
                    children: [
                      { id: "aud-ueb", code: "UEB", label: "Understanding the entity — Basics", icon: "checklist", route: "checklist/aud-ueb" },
                      { id: "aud-ues", code: "UES", label: "Understanding the entity — Systems & Controls", icon: "checklist", route: "checklist/aud-ues" },
                      { id: "aud-uei", code: "UEI", label: "Understanding the entity — Industry & Environment", icon: "checklist", route: "checklist/aud-uei" },
                      { id: "aud-mat", code: "MAT", label: "Materiality", icon: "checklist", route: "checklist/aud-mat" },
                      { id: "aud-scope", code: "SC", label: "Engagement Scope", icon: "checklist" },
                      { id: "aud-pap", code: "PAP", label: "Preliminary Analytical Procedures", icon: "checklist" },
                      { id: "aud-asm", code: "ASM", label: "Audit Strategy Memorandum", icon: "checklist" },
                      { id: "aud-plan", code: "EP", label: "Engagement Planning", icon: "checklist", route: "checklist/aud-plan" },
                      { id: "aud-stb", code: "STB", label: "Staffing & Time Budget", icon: "checklist" },
                      { id: "aud-tcwg-pl", code: "TCWG", label: "Communication with Those Charged with Governance", icon: "letter", route: "checklist/aud-tcwg-pl" },
                    ]
                  },
                  {
                    id: "aud-do", code: "DO", label: "Documents", icon: "folder", hasPlus: true,
                    children: [
                      { id: "aud-do-sha", code: "SHA", label: "Shareholders Agreements", icon: "folder" },
                      { id: "aud-do-ren", code: "REN", label: "Rental/Lease Agreements", icon: "folder" },
                      { id: "aud-do-inc", code: "INC", label: "Incorporation Documents", icon: "folder" },
                      { id: "aud-do-ban", code: "BAN", label: "Banking Agreements", icon: "folder" },
                      { id: "aud-do-cma", code: "CMA", label: "Contracts & Material Agreements", icon: "folder" },
                      { id: "aud-do-cmb", code: "CMB", label: "Corporate Minute Book", icon: "folder" },
                      { id: "aud-do-rcf", code: "RCF", label: "Regulatory & Compliance Filings", icon: "folder" },
                    ]
                  },
                  {
                    id: "aud-tb", code: "TB", label: "Trial Balance & Adjusting Entries", icon: "folder",
                    children: [
                      { id: "aud-tb-tb", code: "TB", label: "Trial Balance & Adjusting Entries", icon: "worksheet", route: "trial-balance" },
                      { id: "aud-tb-aje", code: "AJE", label: "Audit Adjustments & Reclassifications", icon: "worksheet" },
                    ]
                  },
                  {
                    id: "aud-ra-sec", code: "RA", label: "Risk Assessment (500)", icon: "folder",
                    children: [
                      { id: "aud-ra-rap", code: "RAP", label: "Risk Assessment Procedures", icon: "checklist", route: "checklist/aud-ra-rap" },
                      { id: "aud-ra-ic", code: "IC", label: "Understanding Internal Controls", icon: "checklist", route: "checklist/aud-ra-ic" },
                      { id: "aud-ra-itgc", code: "ITGC", label: "IT General Controls (ITGC)", icon: "checklist" },
                      { id: "aud-ra-fraud", code: "FRA", label: "Fraud Risk Assessment (CAS 240)", icon: "checklist", route: "checklist/aud-ra-fraud" },
                      { id: "aud-ra-srr", code: "SRR", label: "Significant Risks Register", icon: "checklist", route: "checklist/aud-ra-srr" },
                      { id: "aud-ra-rmm", code: "RMM", label: "Risk of Material Misstatement (RMM)", icon: "checklist", route: "checklist/aud-ra-rmm" },
                      { id: "aud-ra-scot-rev", code: "S1", label: "SCOT — Revenue Cycle", icon: "checklist", route: "checklist/aud-ra-scot-rev" },
                      { id: "aud-ra-scot-exp", code: "S2", label: "SCOT — Expenditure Cycle", icon: "checklist", route: "checklist/aud-ra-scot-exp" },
                      { id: "aud-ra-scot-pay", code: "S3", label: "SCOT — Payroll Cycle", icon: "checklist", route: "checklist/aud-ra-scot-pay" },
                      { id: "aud-ra-gc", code: "GC", label: "Going Concern (Initial Assessment)", icon: "checklist", route: "checklist/aud-ra-gc" },
                    ]
                  },
                  {
                    id: "aud-rp-sec", code: "RP", label: "Response to Assessed Risks (600)", icon: "folder",
                    children: [
                      { id: "aud-rp-oar", code: "OAR", label: "Overall Audit Response", icon: "checklist", route: "checklist/aud-rp-oar" },
                      { id: "aud-rp-toc", code: "TOC", label: "Test of Controls", icon: "checklist" },
                      { id: "aud-rp-sap", code: "SAP", label: "Substantive Analytical Procedures", icon: "checklist" },
                      { id: "aud-rp-tod-rev", code: "TR", label: "Test of Details — Revenue", icon: "checklist" },
                      { id: "aud-rp-tod-exp", code: "TE", label: "Test of Details — Expenses", icon: "checklist" },
                      { id: "aud-rp-aps", code: "APS", label: "Audit Procedures Summary", icon: "checklist" },
                    ]
                  },
                  {
                    id: "aud-wp-a", code: "WP", label: "Working Papers — Assets (A–Z)", icon: "folder",
                    children: [
                      { id: "aud-wp-a-a", code: "A", label: "Cash & Bank Reconciliation", icon: "book" },
                      { id: "aud-wp-a-b", code: "B", label: "Accounts Receivable & Confirmations", icon: "book" },
                      { id: "aud-wp-a-c", code: "C", label: "Inventory & Observation", icon: "book" },
                      { id: "aud-wp-a-d", code: "D", label: "Prepaid Expenses", icon: "book" },
                      { id: "aud-wp-a-e", code: "E", label: "Other Current Assets", icon: "book" },
                      { id: "aud-wp-a-f", code: "F", label: "Long-Term Assets / PP&E Roll-forward", icon: "book" },
                      { id: "aud-wp-a-g", code: "G", label: "Intangibles & Goodwill", icon: "book" },
                      { id: "aud-wp-a-h", code: "H", label: "Investments", icon: "book" },
                    ]
                  },
                  {
                    id: "aud-wp-l", code: "WP", label: "Working Papers — Liabilities & Equity (AA–ZZ)", icon: "folder",
                    children: [
                      { id: "aud-wp-l-aa", code: "AA", label: "Accounts Payable & Accrued Liabilities", icon: "book" },
                      { id: "aud-wp-l-bb", code: "BB", label: "Long-Term Debt & Covenant Compliance", icon: "book" },
                      { id: "aud-wp-l-cc", code: "CC", label: "Deferred Revenue", icon: "book" },
                      { id: "aud-wp-l-dd", code: "DD", label: "Income Taxes & Deferred Tax", icon: "book" },
                      { id: "aud-wp-l-ee", code: "EE", label: "Other Liabilities & Provisions", icon: "book" },
                      { id: "aud-wp-l-ff", code: "FF", label: "Share Capital & Equity Roll-forward", icon: "book" },
                      { id: "aud-wp-l-gg", code: "GG", label: "Related Party Transactions", icon: "book" },
                    ]
                  },
                  {
                    id: "aud-wp-i", code: "WP", label: "Working Papers — Income Statement (700–760)", icon: "folder",
                    children: [
                      { id: "aud-wp-i-700", code: "700", label: "Revenue Testing", icon: "book" },
                      { id: "aud-wp-i-710", code: "710", label: "Cost of Sales / COGS", icon: "book" },
                      { id: "aud-wp-i-720", code: "720", label: "Payroll & Benefits", icon: "book" },
                      { id: "aud-wp-i-730", code: "730", label: "Operating Expenses", icon: "book" },
                      { id: "aud-wp-i-740", code: "740", label: "Depreciation & Amortization", icon: "book" },
                      { id: "aud-wp-i-750", code: "750", label: "Interest & Finance Costs", icon: "book" },
                      { id: "aud-wp-i-760", code: "760", label: "Other Income & Gains", icon: "book" },
                    ]
                  },
                  {
                    id: "aud-fs", code: "FS", label: "Financial Statements", icon: "folder", hasPlus: true,
                    children: [
                      {
                        id: "aud-fs-docs", label: "Financial Statement Docs", icon: "folder",
                        children: [
                          { id: "aud-fs-cover", label: "Cover Page", icon: "doc" },
                          { id: "aud-fs-toc", label: "Table of Contents", icon: "doc" },
                          { id: "aud-fs-iar", label: "Independent Auditor's Report", icon: "checklist", route: "checklist/aud-ar" },
                          { id: "aud-fs-bs", label: "Balance Sheet", icon: "doc" },
                          { id: "aud-fs-is", label: "Statement of Income (Loss) and Retained Earnings (Deficit)", icon: "doc" },
                          { id: "aud-fs-cf", label: "Statement of Cash Flows", icon: "doc" },
                          { id: "aud-fs-eq", label: "Statement of Changes in Equity", icon: "doc" },
                          { id: "aud-fs-notes", label: "Notes to Financial Statements", icon: "doc" },
                        ]
                      },
                    ]
                  },
                  {
                    id: "aud-so", code: "SO", label: "Completion & Signoffs (300)", icon: "folder",
                    children: [
                      { id: "aud-so-aim", code: "AIM", label: "Accumulation of Identified Misstatements", icon: "checklist", route: "checklist/aud-so-aim" },
                      { id: "aud-so-far", code: "FAR", label: "Final Analytical Review", icon: "checklist", route: "checklist/aud-so-far" },
                      { id: "aud-subseq", code: "SE", label: "Subsequent Events", icon: "checklist", route: "checklist/aud-subseq" },
                      { id: "aud-wgc-final", code: "GC", label: "Going Concern (Final Assessment)", icon: "checklist", route: "checklist/aud-wgc-final" },
                      { id: "aud-mr", code: "MR", label: "Management Representation Letter", icon: "checklist", route: "checklist/aud-mr" },
                      { id: "aud-tcwg-fin", code: "TCWG", label: "Communication with Those Charged with Governance", icon: "letter", route: "checklist/aud-tcwg-fin" },
                      { id: "aud-comp", code: "CM", label: "Completion Checklist", icon: "completion", route: "checklist/aud-comp" },
                      { id: "aud-disc", code: "DC", label: "Disclosure Checklist", icon: "checklist", route: "checklist/aud-disc" },
                      { id: "aud-ep", code: "QCR", label: "Quality Control Review", icon: "completion", route: "checklist/aud-ep" },
                      { id: "aud-so-sign", code: "SO", label: "Signoffs", icon: "completion" },
                      { id: "aud-so-fr", code: "FR", label: "Final Review", icon: "completion" },
                      { id: "aud-so-alf", code: "ALF", label: "Archive & Lock File", icon: "completion" },
                    ]
                  },
                ];

                const engagementTree: SectionNode[] = [
                  {
                    id: "co", code: "CO", label: "Client Onboarding", icon: "folder",
                    children: [
                      { id: "co-ca", code: "CA", label: "Client acceptance and continuance", icon: "checklist", route: "checklist/co-ca" },
                      { id: "co-ind", code: "IND", label: "Independence", icon: "checklist", route: "checklist/co-ind" },
                      { id: "co-kcb", code: "KCB", label: "Knowledge of client business", icon: "checklist", route: "checklist/co-kcb" },
                      { id: "co-pl", code: "PL", label: "Planning", icon: "checklist", route: "checklist/co-pl" },
                      { id: "co-el", code: "EL", label: "Engagement Letter", icon: "letter", route: "checklist/co-el" },
                      { id: "co-mr", code: "MR", label: "Management responsibility and acknowledgement", icon: "letter", route: "checklist/co-mr" },
                    ]
                  },
                  {
                    id: "do", code: "DO", label: "Documents", icon: "folder", hasPlus: true,
                    children: [
                      { id: "do-sha", code: "SHA", label: "Shareholders Agreements", icon: "folder" },
                      { id: "do-ren", code: "REN", label: "Rental/Lease Agreements", icon: "folder" },
                      { id: "do-inc", code: "INC", label: "Incorporation Documents", icon: "folder" },
                      { id: "do-ban", code: "BAN", label: "Banking Agreements", icon: "folder" },
                    ]
                  },
                  {
                    id: "tb", code: "TB", label: "Trial Balance & Adj. Entries", icon: "worksheet", route: "trial-balance"
                  },
                  {
                    id: "pr", code: "PR", label: "Procedures", icon: "folder",
                    children: [
                      {
                        id: "pr-assets", label: "Assets", icon: "folder",
                        children: [
                          {
                            id: "pr-ca", label: "Current assets", icon: "folder",
                            children: [
                              { id: "pr-ca-a", code: "A", label: "Cash and cash equivalents", icon: "book", route: "procedure/pr-ca-a" },
                              { id: "pr-ca-b", code: "B", label: "Accounts receivable", icon: "book" },
                              { id: "pr-ca-c", code: "C", label: "Inventories", icon: "book" },
                              { id: "pr-ca-d", code: "D", label: "Short-term investments", icon: "book" },
                              { id: "pr-ca-i", code: "I", label: "Other current assets", icon: "book" },
                            ]
                          },
                          {
                            id: "pr-ppe", label: "Property, plant and equipment", icon: "folder",
                            children: [
                              { id: "pr-ppe-h", code: "H", label: "Property, plant and equipment", icon: "book" },
                            ]
                          },
                        ]
                      },
                      {
                        id: "pr-liab", label: "Liabilities", icon: "folder",
                        children: [
                          {
                            id: "pr-cl", label: "Current liabilities", icon: "folder",
                            children: [
                              { id: "pr-cl-aa", code: "AA", label: "Bank overdraft", icon: "book" },
                              { id: "pr-cl-bb", code: "BB", label: "Accounts payable", icon: "book" },
                              { id: "pr-cl-dd", code: "DD", label: "Short-term debt", icon: "book" },
                              { id: "pr-cl-ee", code: "EE", label: "Deferred income", icon: "book" },
                            ]
                          },
                          {
                            id: "pr-ltl", label: "Long-term liabilities", icon: "folder",
                            children: [
                              { id: "pr-ltl-jj", code: "JJ", label: "Other long-term liabilities", icon: "book" },
                            ]
                          },
                        ]
                      },
                      {
                        id: "pr-equity", label: "Equity", icon: "folder",
                        children: [
                          {
                            id: "pr-sc", label: "Share capital", icon: "folder",
                            children: [
                              { id: "pr-sc-tt", code: "TT", label: "Equity", icon: "book" },
                            ]
                          },
                        ]
                      },
                      {
                        id: "pr-rev", label: "Revenue", icon: "folder",
                        children: [
                          {
                            id: "pr-rev-sub", label: "Revenue", icon: "folder",
                            children: [
                              { id: "pr-rev-20", code: "20", label: "Revenue", icon: "book" },
                            ]
                          },
                        ]
                      },
                      {
                        id: "pr-exp", label: "Expenses", icon: "folder",
                        children: [
                          {
                            id: "pr-opex", label: "Operating expenses", icon: "folder",
                            children: [
                              { id: "pr-opex-40", code: "40", label: "Operating expenses", icon: "book" },
                            ]
                          },
                        ]
                      },
                    ]
                  },
                  {
                    id: "fs", code: "FS", label: "Financial Statements", icon: "folder", hasPlus: true,
                    children: [
                      {
                        id: "fs-docs", code: "FS", label: "Financial Statements Docs", icon: "folder",
                        children: [
                          { id: "fs-cover", label: "Cover Page", icon: "doc" },
                          { id: "fs-toc", label: "Table of Contents", icon: "doc" },
                          { id: "fs-comp", label: "Compilation report", icon: "doc" },
                          { id: "fs-bs", label: "Balance Sheet", icon: "doc" },
                          { id: "fs-is", label: "Statement of Income and Retained Earnings", icon: "doc" },
                          { id: "fs-cf", label: "Statement of Cash Flows", icon: "doc" },
                        ]
                      },
                    ]
                  },
                  {
                    id: "so", code: "SO", label: "Completion & Signoffs", icon: "folder",
                    children: [
                      { id: "so-cm", code: "CM", label: "Completion", icon: "completion" },
                      { id: "so-so", code: "SO", label: "Signoffs", icon: "completion" },
                    ]
                  },
                ];

                const renderIcon = (icon?: string) => {
                  if (icon === "letter") return <LetterIcon className="h-4 w-4 flex-shrink-0" />;
                  if (icon === "checklist") return <ChecklistIcon className="h-4 w-4 flex-shrink-0" />;
                  if (icon === "completion") return <CompletionIcon className="h-4 w-4 flex-shrink-0" />;
                  if (icon === "doc") return <WordDocIcon className="h-4 w-4 flex-shrink-0" />;
                  if (icon === "worksheet") return <WorksheetIcon className="h-4 w-4 flex-shrink-0" />;
                  if (icon === "book") return <BookIcon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#778599' }} />;
                  return <FolderSolidIcon className="h-4 w-4 text-primary flex-shrink-0" />;
                };

                const renderNode = (node: SectionNode, depth: number = 0): React.ReactNode => {
                  const hasChildren = node.children && node.children.length > 0;
                  const isOpen = expandedSections.has(node.id);
                  const isLeaf = !hasChildren;
                  const currentSubPath = engId ? location.pathname.replace(`/engagements/${engId}/`, '').replace(`/engagements/${engId}`, '') : '';
                  const defaultRoute = isAuditEngagement ? 'checklist/aud-new-accept' : 'checklist/co-ca';
                  const isActive = node.route
                    ? (currentSubPath === node.route || (currentSubPath === '' && node.route === defaultRoute))
                    : false;

                  return (
                    <div key={node.id}>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 py-1.5 px-2 rounded-[8px] cursor-pointer hover:bg-primary/10 transition-colors text-sm",
                          isActive && "bg-primary/10 ring-1 ring-primary/25"
                        )}
                        style={{ paddingLeft: `${depth * 16 + 8}px` }}
                        onClick={() => {
                          if (node.route) {
                            if (engId) {
                              navigate(`/engagements/${engId}/${node.route}`);
                            }
                          } else if (hasChildren) {
                            setExpandedSections(prev => {
                              const next = new Set(prev);
                              if (next.has(node.id)) next.delete(node.id);
                              else next.add(node.id);
                              return next;
                            });
                          }
                        }}
                      >
                        {isLeaf ? (
                          <>
                            {depth > 0 && <span className="w-3.5 flex-shrink-0" />}
                            {renderIcon(node.icon)}
                          </>
                        ) : (
                          <span className="relative flex-shrink-0 w-4 h-4 flex items-center justify-center">
                            {isOpen
                              ? <FolderMinusIcon className="h-4 w-4 text-primary" />
                              : <FolderPlusIcon className="h-4 w-4 text-primary" />}
                          </span>
                        )}
                        {node.code && <span className="font-semibold text-primary">{node.code}</span>}
                        <span className={cn("truncate flex-1 text-black dark:text-white", isLeaf ? "font-medium" : "font-semibold")}>{node.label}</span>
                        {node.hasPlus && <Plus className="h-4 w-4 text-muted-foreground hover:text-foreground flex-shrink-0" />}
                        {signoffsMode && (
                          <div className="flex items-center gap-2 ml-4 -mr-2 pl-3 flex-shrink-0 self-stretch" onClick={(e) => e.stopPropagation()}>
                            {(["p1", "p2"] as const).map(pid => (
                              <div key={pid} className="w-9 flex items-center justify-center">
                                <Checkbox
                                  checked={!!signoffChecks[node.id]?.[pid]}
                                  onCheckedChange={(v) =>
                                    setSignoffChecks(prev => ({
                                      ...prev,
                                      [node.id]: { p1: !!prev[node.id]?.p1, p2: !!prev[node.id]?.p2, [pid]: !!v },
                                    }))
                                  }
                                  className="h-4 w-4 rounded border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {isOpen && hasChildren && (
                        <div>
                          {node.children!.map(child => renderNode(child, depth + 1))}
                        </div>
                      )}
                    </div>
                  );
                };

                // Collect all node IDs for the "select all" signoff toggles
                const collectIds = (nodes: SectionNode[]): string[] =>
                  nodes.flatMap(n => [n.id, ...(n.children ? collectIds(n.children) : [])]);
                const activeTree = isAuditEngagement ? auditEngagementTree : engagementTree;
                allNodeIdsRef.current = collectIds(activeTree);

                return activeTree.map(node => renderNode(node, 0));
              })()}
            </div>

            {/* Resize handle */}
            {!isTemplatesPanelCollapsed && (
              <div
                className={cn(
                  "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize z-30 transition-all duration-150",
                  isResizing
                    ? "bg-primary"
                    : isResizeHovering
                    ? "bg-border"
                    : "bg-transparent hover:bg-border"
                )}
                onMouseDown={startResizing}
                onMouseEnter={() => setIsResizeHovering(true)}
                onMouseLeave={() => !isResizing && setIsResizeHovering(false)}
              >
                <div className="absolute -left-1 -right-1 top-0 bottom-0" />
              </div>
            )}

          </div>
        </>, portalTarget)}

      {/* Templates panel - portalled below the global header */}
      {portalTarget && location.pathname !== "/dashboard" && location.pathname !== "/clients" && location.pathname !== "/teams" && location.pathname !== "/engagements" && !location.pathname.startsWith("/engagements/") && createPortal(<>
          <div 
            ref={panelRef}
            style={{ width: isTemplatesPanelCollapsed ? 0 : panelWidth }}
            className={cn(
              `flex flex-col relative z-40 transition-all group/templates sidebar-secondary-panel ${hasDarkSecondary ? 'sidebar-dark-theme' : ''}`,
              isTemplatesPanelCollapsed 
                ? "overflow-hidden shadow-none bg-transparent border-r-0" 
                : "shadow-md bg-[#f1f1f3] dark:from-muted dark:to-card border-r border-border",
              isResizing && "transition-none"
            )}
          >
            <div className={`p-4 ${isTemplatesPanelCollapsed ? "hidden" : ""}`}>
              <DropdownMenu>
                <DropdownMenuTrigger className={cn("w-full px-3 py-2 rounded-lg text-sm flex items-center justify-between focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors shadow-sm border", hasDarkSecondary ? "bg-white/10 border-white/20 text-white" : "bg-card/80 border-border text-foreground")}>
                  <div className="flex items-center gap-2">
                    {(() => {
                  const selected = dropdownItems.find(item => item.id === selectedDropdown);
                  if (selected) {
                    const IconComponent = selected.icon;
                    return <>
                            <IconComponent className={`h-4 w-4 ${selected.color}`} />
                            <span>{selected.label}</span>
                          </>;
                  }
                  return <span>Select...</span>;
                })()}
                  </div>
                  <ChevronDown className={cn("h-4 w-4", hasDarkSecondary ? "text-white/60" : "text-muted-foreground")} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-auto min-w-[240px] whitespace-nowrap">
                  {dropdownItems.map(item => <DropdownMenuItem key={item.id} onClick={() => handleDropdownSelect(item.id)} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span>{item.label}</span>
                      </div>
                      {selectedDropdown === item.id && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Engagement Templates tree view */}
            {selectedDropdown === "engagements" ? (
              <>
                <div className={`flex mb-2 ${isTemplatesPanelCollapsed ? "hidden" : ""}`} style={{
                  borderBottom: hasDarkSecondary ? "1px solid rgba(255,255,255,0.15)" : "1px solid hsl(var(--border))"
                }}>
                  <button onClick={() => setEngActiveTab("my")} className={`flex-1 py-2 px-1 text-sm font-medium transition-all text-center whitespace-nowrap border-b-[3px] ${engActiveTab === "my" ? (hasDarkSecondary ? "text-white border-white" : "text-primary border-primary") : (hasDarkSecondary ? "text-white/50 hover:text-white/80" : "text-muted-foreground hover:text-foreground") + " border-transparent"}`}>
                    My Templates
                  </button>
                  <button onClick={() => setEngActiveTab("global")} className={`flex-1 py-2 px-1 text-sm font-medium transition-all text-center whitespace-nowrap border-b-[3px] ${engActiveTab === "global" ? (hasDarkSecondary ? "text-white border-white" : "text-primary border-primary") : (hasDarkSecondary ? "text-white/50 hover:text-white/80" : "text-muted-foreground hover:text-foreground") + " border-transparent"}`}>
                    Global Templates
                  </button>
                </div>

                {engActiveTab === "global" ? (
                  <>
                    <div className={`p-3 pt-1 ${isTemplatesPanelCollapsed ? "hidden" : ""}`}>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className={cn("absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4", hasDarkSecondary ? "text-white/50" : "text-muted-foreground")} />
                          <Input placeholder="Search" className={cn("pl-8 h-8 text-sm border-0 shadow-sm", hasDarkSecondary ? "bg-white/10 text-white placeholder:text-white/40" : "bg-card/80")} value={engTemplateSearchQuery} onChange={e => setEngTemplateSearchQuery(e.target.value)} />
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={cn("h-8 w-8 rounded-md flex items-center justify-center transition-colors flex-shrink-0", hasDarkSecondary ? "bg-white/10 hover:bg-white/20" : "bg-primary/10 hover:bg-primary/20")}
                              onClick={handleEngExpandCollapseAll}
                            >
                              {allEngExpanded ? (
                                <svg width="15" height="15" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9.72214 6.94412L14.5833 2.08301M14.5833 2.08301H10.4166M14.5833 2.08301V6.24967M6.94436 9.7219L2.08325 14.583M2.08325 14.583H6.24992M2.08325 14.583L2.08325 10.4163" stroke={hasDarkSecondary ? "white" : "#074075"} strokeWidth="1.38889" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg width="15" height="15" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M2.08325 6.94412L2.08325 2.08301M2.08325 2.08301L6.24992 2.08301M2.08325 2.08301L6.94436 6.94412M14.5833 9.7219L14.5833 14.583M14.5833 14.583L10.4166 14.583M14.5833 14.583L9.72214 9.7219" stroke={hasDarkSecondary ? "white" : "#074075"} strokeWidth="1.38889" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>{allEngExpanded ? "Collapse All" : "Expand All"}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              className="h-8 w-8 bg-primary hover:bg-primary/90 shadow-sm flex-shrink-0"
                              disabled={selectedEngTemplates.size === 0}
                              onClick={() => setEngBulkAddDialogOpen(true)}
                            >
                              <Files className="h-4 w-4 text-primary-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {selectedEngTemplates.size > 0
                              ? `Add ${selectedEngTemplates.size} selected to My Templates`
                              : "Select templates to add"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className={`flex-1 overflow-y-auto p-2 pt-0 ${isTemplatesPanelCollapsed ? "hidden" : ""}`}>
                      {templateTree.map((item) => renderEngTemplateTreeNode(item, 0))}
                    </div>
                  </>
                ) : (
                  /* My Templates tab for engagements */
                  <div className={`flex-1 overflow-y-auto p-2 ${isTemplatesPanelCollapsed ? "hidden" : ""}`}>
                    {myEngagementTemplates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 gap-2 text-center px-4">
                        <p className={cn("text-sm font-medium", hasDarkSecondary ? "text-white/70" : "text-muted-foreground")}>No templates yet</p>
                        <p className={cn("text-xs", hasDarkSecondary ? "text-white/40" : "text-muted-foreground/70")}>Copy from Global Templates to get started</p>
                      </div>
                    ) : (() => {
                      // Group by folder
                      const folders: Record<string, { id: string; name: string; templates: typeof myEngagementTemplates }> = {};
                      myEngagementTemplates.forEach(t => {
                        if (!folders[t.folderId]) folders[t.folderId] = { id: t.folderId, name: t.folderName, templates: [] };
                        folders[t.folderId].templates.push(t);
                      });
                      return Object.values(folders).map(folder => (
                        <div key={folder.id}>
                          <div
                            className={cn("flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50 text-sm font-semibold select-none", hasDarkSecondary ? "text-white" : "text-foreground")}
                            onClick={() => setEngMyFolderExpanded(prev => {
                              const next = new Set(prev);
                              next.has(folder.id) ? next.delete(folder.id) : next.add(folder.id);
                              return next;
                            })}
                          >
                            {engMyFolderExpanded.has(folder.id)
                              ? <FolderMinusIcon className="h-4 w-4 text-primary flex-shrink-0" />
                              : <FolderPlusIcon className="h-4 w-4 text-primary flex-shrink-0" />}
                            <span className="truncate flex-1">{folder.name}</span>
                            <span className={cn("text-xs", hasDarkSecondary ? "text-white/40" : "text-muted-foreground")}>{folder.templates.length}</span>
                          </div>
                          {engMyFolderExpanded.has(folder.id) && folder.templates.map(t => {
                            const isActive = searchParams.get("myTemplate") === t.id;
                            return (
                              <div
                                key={t.id}
                                className={cn(
                                  "flex items-center gap-2 py-1.5 pl-7 pr-2 rounded-md cursor-pointer text-sm ml-1 font-medium select-none",
                                  isActive ? "bg-primary/10 text-primary" : (hasDarkSecondary ? "text-white/80 hover:bg-white/10" : "text-foreground hover:bg-muted/50")
                                )}
                                onClick={() => {
                                  navigate("/engagement-templates");
                                  setSearchParams({ myTemplate: t.id });
                                }}
                              >
                                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 16" fill="none"><path d="M2.08317 8.00016H4.90148C5.47248 8.00016 5.99448 8.32277 6.24984 8.8335C6.5052 9.34422 7.02719 9.66683 7.5982 9.66683H12.4015C12.9725 9.66683 13.4945 9.34422 13.7498 8.8335C14.0052 8.32277 14.5272 8.00016 15.0982 8.00016H17.9165M7.47197 1.3335H12.5277C13.4251 1.3335 13.8738 1.3335 14.2699 1.47013C14.6202 1.59096 14.9393 1.78816 15.204 2.04745C15.5034 2.34066 15.7041 2.742 16.1054 3.54464L17.9109 7.15558C18.0684 7.47057 18.1471 7.62806 18.2027 7.79312C18.252 7.9397 18.2876 8.09055 18.309 8.24372C18.3332 8.41618 18.3332 8.59227 18.3332 8.94443V10.6668C18.3332 12.067 18.3332 12.767 18.0607 13.3018C17.821 13.7722 17.4386 14.1547 16.9681 14.3943C16.4334 14.6668 15.7333 14.6668 14.3332 14.6668H5.6665C4.26637 14.6668 3.56631 14.6668 3.03153 14.3943C2.56112 14.1547 2.17867 13.7722 1.93899 13.3018C1.6665 12.767 1.6665 12.067 1.6665 10.6668V8.94443C1.6665 8.59227 1.6665 8.41618 1.69065 8.24372C1.71209 8.09055 1.7477 7.9397 1.79702 7.79312C1.85255 7.62806 1.9313 7.47057 2.0888 7.15558L3.89426 3.54464C4.29559 2.74199 4.49626 2.34066 4.79562 2.04745C5.06036 1.78816 5.37943 1.59096 5.72974 1.47013C6.12588 1.3335 6.57458 1.3335 7.47197 1.3335Z" stroke="#5599D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                <span className="truncate flex-1">{t.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </>
            ) : selectedDropdown === "checklists" ? (
              <>
                <div className={`flex mb-2 ${isTemplatesPanelCollapsed ? "hidden" : ""}`} style={{
               borderBottom: hasDarkSecondary ? "1px solid rgba(255,255,255,0.15)" : "1px solid hsl(var(--border))"
             }}>
                   <button onClick={() => setActiveTab("firm")} className={`flex-1 py-2 px-1 text-sm font-medium transition-all text-center whitespace-nowrap border-b-[3px] ${activeTab === "firm" ? (hasDarkSecondary ? "text-white border-white" : "text-primary border-primary") : (hasDarkSecondary ? "text-white/50 hover:text-white/80" : "text-muted-foreground hover:text-foreground") + " border-transparent"}`}>
                     My Templates
                   </button>
                   <button onClick={() => setActiveTab("master")} className={`flex-1 py-2 px-1 text-sm font-medium transition-all text-center whitespace-nowrap border-b-[3px] ${activeTab === "master" ? (hasDarkSecondary ? "text-white border-white" : "text-primary border-primary") : (hasDarkSecondary ? "text-white/50 hover:text-white/80" : "text-muted-foreground hover:text-foreground") + " border-transparent"}`}>
                     Global Templates
                   </button>
                 </div>

                <div className={`p-3 pt-1 ${isTemplatesPanelCollapsed ? "hidden" : ""}`}>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className={cn("absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4", hasDarkSecondary ? "text-white/50" : "text-muted-foreground")} />
                       <Input placeholder="Search" className={cn("pl-8 h-8 text-sm border-0 shadow-sm", hasDarkSecondary ? "bg-white/10 text-white placeholder:text-white/40" : "bg-card/80")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    <button className={cn("h-9 w-9 rounded-md flex items-center justify-center transition-colors", hasDarkSecondary ? "bg-white/10 hover:bg-white/20" : "bg-primary/10 hover:bg-primary/20")}>
                       <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M9.72214 6.94412L14.5833 2.08301M14.5833 2.08301H10.4166M14.5833 2.08301V6.24967M6.94436 9.7219L2.08325 14.583M2.08325 14.583H6.24992M2.08325 14.583L2.08325 10.4163" stroke={hasDarkSecondary ? "white" : "#074075"} strokeWidth="1.38889" strokeLinecap="round" strokeLinejoin="round" />
                       </svg>
                     </button>
                    {activeTab === "firm" && (
                      <>
                        <Button size="icon" className="h-9 w-9 bg-primary hover:bg-primary/90 shadow-sm">
                          <Plus className="h-4 w-4 text-primary-foreground icon-plus" />
                        </Button>
                        <Button size="icon" variant="secondary" className={cn("h-9 w-9 text-destructive hover:text-destructive", hasDarkSecondary ? "bg-white/10 hover:bg-white/20 border-0" : "hover:bg-card/50")}>
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </>
                    )}
                    {activeTab === "master" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            className="h-9 w-9 bg-primary hover:bg-primary/90 shadow-sm"
                            disabled={selectedTemplates.size === 0}
                            onClick={() => setBulkAddDialogOpen(true)}
                          >
                            <Files className="h-4 w-4 text-primary-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {selectedTemplates.size > 0
                            ? `Add ${selectedTemplates.size} selected to My Templates`
                            : "Select templates to add"}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>

                <div className={`flex-1 overflow-y-auto p-2 pt-0 ${isTemplatesPanelCollapsed ? "hidden" : ""}`}>
                  {activeTab === "firm" ? (
                    templates.map(template => renderTemplate(template))
                  ) : (
                    globalTemplates.map(template => renderGlobalTemplate(template))
                  )}
                </div>
              </>
            ) : selectedDropdown === "worksheets" ? (
              <>
                <div className={`flex mb-2 ${isTemplatesPanelCollapsed ? "hidden" : ""}`} style={{
                  borderBottom: hasDarkSecondary ? "1px solid rgba(255,255,255,0.15)" : "1px solid hsl(var(--border))"
                }}>
                  <button onClick={() => setActiveTab("firm")} className={`flex-1 py-2 px-1 text-sm font-medium transition-all text-center whitespace-nowrap border-b-[3px] ${activeTab === "firm" ? (hasDarkSecondary ? "text-white border-white" : "text-primary border-primary") : (hasDarkSecondary ? "text-white/50 hover:text-white/80" : "text-muted-foreground hover:text-foreground") + " border-transparent"}`}>
                    My Templates
                  </button>
                  <button onClick={() => setActiveTab("master")} className={`flex-1 py-2 px-1 text-sm font-medium transition-all text-center whitespace-nowrap border-b-[3px] ${activeTab === "master" ? (hasDarkSecondary ? "text-white border-white" : "text-primary border-primary") : (hasDarkSecondary ? "text-white/50 hover:text-white/80" : "text-muted-foreground hover:text-foreground") + " border-transparent"}`}>
                    Global Templates
                  </button>
                </div>

                <div className={`p-3 pt-1 ${isTemplatesPanelCollapsed ? "hidden" : ""}`}>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className={cn("absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4", hasDarkSecondary ? "text-white/50" : "text-muted-foreground")} />
                      <Input placeholder="Search" className={cn("pl-8 h-8 text-sm border-0 shadow-sm", hasDarkSecondary ? "bg-white/10 text-white placeholder:text-white/40" : "bg-card/80")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                    {activeTab === "firm" && (
                      <>
                        <Button size="icon" className="h-9 w-9 bg-primary hover:bg-primary/90 shadow-sm">
                          <Plus className="h-4 w-4 text-primary-foreground icon-plus" />
                        </Button>
                        <Button size="icon" variant="secondary" className={cn("h-9 w-9 text-destructive hover:text-destructive", hasDarkSecondary ? "bg-white/10 hover:bg-white/20 border-0" : "hover:bg-card/50")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className={`flex-1 overflow-y-auto p-2 pt-0 ${isTemplatesPanelCollapsed ? "hidden" : ""}`}>
                  {activeTab === "firm" ? (
                    <div className="flex flex-col items-center justify-center h-32 gap-2 text-center px-4">
                      <p className={cn("text-sm font-medium", hasDarkSecondary ? "text-white/70" : "text-muted-foreground")}>No worksheets yet</p>
                      <p className={cn("text-xs", hasDarkSecondary ? "text-white/40" : "text-muted-foreground/70")}>Copy from Global Templates to get started</p>
                    </div>
                  ) : (
                    globalWorksheets.map(t => renderGlobalTemplate(t, 0, toggleGlobalWorksheet))
                  )}
                </div>
              </>
            ) : (
              /* Empty state for Letters, Reports, Notes */
              <div className={`flex-1 flex flex-col items-center justify-center gap-3 px-4 py-8 text-center ${isTemplatesPanelCollapsed ? "hidden" : ""}`}>
                {(() => {
                  const item = dropdownItems.find(i => i.id === selectedDropdown);
                  if (!item) return null;
                  const Icon = item.icon;
                  return <>
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", hasDarkSecondary ? "bg-white/10" : "bg-muted")}>
                      <Icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-medium", hasDarkSecondary ? "text-white" : "text-foreground")}>
                        No {item.label} yet
                      </p>
                      <p className={cn("text-xs mt-1", hasDarkSecondary ? "text-white/50" : "text-muted-foreground")}>
                        Templates you create will appear here
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="mt-1 h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-white"
                      onClick={() => navigate("/create", { state: { contentType: selectedDropdown } })}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Create {item.label.replace("Notes to Financial Statements", "Notes")}
                    </Button>
                  </>;
                })()}
              </div>
            )}

            {/* Resize handle */}
            {!isTemplatesPanelCollapsed && (
              <div
                className={cn(
                  "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize z-30 transition-all duration-150",
                  isResizing
                    ? "bg-primary"
                    : isResizeHovering
                    ? "bg-border"
                    : "bg-transparent hover:bg-border"
                )}
                onMouseDown={startResizing}
                onMouseEnter={() => setIsResizeHovering(true)}
                onMouseLeave={() => !isResizing && setIsResizeHovering(false)}
              >
                <div className="absolute -left-1 -right-1 top-0 bottom-0" />
              </div>
            )}

          </div>
        </>, portalTarget)}

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Checklist</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input value={renameValue} onChange={e => setRenameValue(e.target.value)} placeholder="Enter new name" className="w-full" autoFocus onKeyDown={e => {
            if (e.key === "Enter") handleRenameConfirm();
          }} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleRenameConfirm} disabled={!renameValue.trim()}>
              <Pencil className="h-4 w-4" />
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move to Folder Dialog */}
      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Move to Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Select a folder to move "{selectedChecklist?.name}" to:
            </p>
            <div className="border rounded-lg p-3 space-y-1 max-h-64 overflow-y-auto bg-background">
              {templates.map(folder => <div key={folder.id} className={`flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer transition-colors ${selectedMoveFolder === folder.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`} onClick={() => setSelectedMoveFolder(folder.id)}>
                  <Folder className={`h-4 w-4 ${selectedMoveFolder === folder.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm truncate flex-1">{folder.name}</span>
                  {selectedMoveFolder === folder.id && <Check className="h-4 w-4 text-primary" />}
                </div>)}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDialogOpen(false)}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleMoveConfirm} disabled={!selectedMoveFolder || selectedMoveFolder === selectedChecklist?.folderId}>
              <FolderInput className="h-4 w-4" />
              Move
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Add to My Templates Dialog */}
      <BulkAddToMyTemplatesDialog
        open={bulkAddDialogOpen}
        onOpenChange={setBulkAddDialogOpen}
        selectedTemplates={getSelectedTemplateDetails()}
        onSuccess={clearSelection}
        getChecklistData={(templateId) => getGlobalTemplateChecklist(templateId)}
      />

      <BulkAddToMyTemplatesDialog
        open={engBulkAddDialogOpen}
        onOpenChange={setEngBulkAddDialogOpen}
        selectedTemplates={Array.from(selectedEngTemplates).map(id => ({
          id,
          name: allTemplateViews[id]?.title || id,
        }))}
        onSuccess={() => setSelectedEngTemplates(new Set())}
        getChecklistData={(templateId) => getGlobalTemplateChecklist(templateId)}
        variant="engagement"
        getTemplateViewData={(templateId) => allTemplateViews[templateId] || null}
      />

      {/* Signoffs Overlay */}
      <SignoffsOverlay
        open={showSignoffs}
        onClose={() => setShowSignoffs(false)}
        anchorLeft={56}
      />
    </div>;
}