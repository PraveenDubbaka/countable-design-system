import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Plus, 
  FolderOpen, 
  Building2, 
  FileText, 
  Triangle, 
  ClipboardList, 
  FileCheck, 
  CheckSquare,
  Landmark,
  FileSpreadsheet,
  PencilLine,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MondayBoardView } from "@/components/MondayBoardView";
import { Checklist, Section, Question } from "@/types/checklist";

// Sample engagement data matching the engagements page
const engagementsData: Record<string, { id: string; client: string; type: string; yearEnd: string; status: string }> = {
  "COM-CON-Dec312024": { id: "COM-CON-Dec312024", client: "Shipping Line Inc.", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", status: "In Progress" },
  "COM-PSP-Dec312023": { id: "COM-PSP-Dec312023", client: "Source 40", type: "Compilation (COM)", yearEnd: "Dec 31, 2023", status: "In Progress" },
  "COM-QB-Dec312025": { id: "COM-QB-Dec312025", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Dec 31, 2025", status: "In Progress" },
};

// Sidebar menu items matching the screenshot
const sidebarMenuItems = [
  { id: "co", code: "CO", label: "Client Onboarding", icon: Building2, hasPlus: false, isExpanded: false },
  { id: "do", code: "DO", label: "Documents", icon: FileText, hasPlus: true, isExpanded: false },
  { id: "tb", code: "TB", label: "Trial Balance & Adj. Entri...", icon: FileSpreadsheet, hasPlus: false, isExpanded: false },
  { id: "pr", code: "PR", label: "Procedures", icon: ClipboardList, hasPlus: false, isExpanded: false },
  { id: "fs", code: "FS", label: "Financial Statements", icon: FileCheck, hasPlus: true, isExpanded: false },
  { id: "so", code: "SO", label: "Completion & Signoffs", icon: CheckSquare, hasPlus: false, isExpanded: true },
];

// Sample checklist for preview mode
const sampleChecklist: Checklist = {
  id: "engagement-checklist",
  title: "Client acceptance and continuance",
  description: "Engagement quality review checklist",
  sections: [
    {
      id: "section-1",
      title: "Client acceptance and continuance",
      isExpanded: true,
      questions: [
        {
          id: "q1",
          text: "5. Independence",
          answerType: "yes-no-na",
          options: ["Yes", "No", "Not Applicable"],
          required: true,
          explanation: "",
          subQuestions: [],
        },
        {
          id: "q2",
          text: "6. Engagement quality review\nAre there any circumstances that would require this engagement to be subject to an engagement quality review?\nIf so, has a reviewer been appointed?",
          answerType: "yes-no-na",
          options: ["Yes", "No", "Not Applicable"],
          required: true,
          explanation: "",
          subQuestions: [],
        },
        {
          id: "q3",
          text: "7. Anti-money laundering procedures",
          answerType: "yes-no-na",
          options: ["Yes", "No", "Not Applicable"],
          required: true,
          explanation: "",
          subQuestions: [],
        },
        {
          id: "q4",
          text: "8. Engagement letter\nHas an engagement letter been signed by both parties?",
          answerType: "yes-no-na",
          options: ["Yes", "No", "Not Applicable"],
          required: true,
          explanation: "",
          subQuestions: [],
        },
      ],
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Header action buttons
const headerActions = [
  { id: "bank", label: "Connect Bank", icon: Landmark },
  { id: "docs", label: "Source Docs", icon: FileText },
  { id: "tb", label: "TB Check", icon: Triangle },
  { id: "adj", label: "Adj. Entries", icon: PencilLine },
  { id: "workbook", label: "Workbook", icon: FileSpreadsheet },
];

export default function EngagementDetail() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("so");
  const [checklist, setChecklist] = useState<Checklist>(sampleChecklist);
  const [expandedMenuItems, setExpandedMenuItems] = useState<Set<string>>(new Set(["so"]));

  const engagement = engagementId ? engagementsData[engagementId] : null;
  const displayId = engagementId || "Unknown";
  const clientName = engagement?.client || "Unknown Client";
  const status = engagement?.status || "In Progress";

  const toggleMenuItem = (itemId: string) => {
    setExpandedMenuItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
    setSelectedSection(itemId);
  };

  const handleChecklistUpdate = (updatedChecklist: Checklist) => {
    setChecklist(updatedChecklist);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className={`flex flex-col border-r border-border bg-white transition-all duration-300 ${sidebarCollapsed ? "w-12" : "w-64"}`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Engagements</span>
              <button className="p-1 hover:bg-muted rounded text-muted-foreground">
                <CheckSquare className="h-4 w-4" />
              </button>
              <span className="text-muted-foreground text-sm">Signoffs</span>
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-muted rounded text-muted-foreground"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm bg-muted/50"
              />
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {sidebarMenuItems.map((item) => {
            const isExpanded = expandedMenuItems.has(item.id);
            const isSelected = selectedSection === item.id;
            
            return (
              <div key={item.id} className="mb-0.5">
                <button
                  onClick={() => toggleMenuItem(item.id)}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded text-sm transition-colors ${
                    isSelected ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <ChevronRight className={`h-3 w-3 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  <FolderOpen className="h-4 w-4 text-amber-500" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-semibold text-primary">{item.code}</span>
                      <span className="flex-1 text-left truncate text-foreground">{item.label}</span>
                      {item.hasPlus && (
                        <Plus className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
          {/* Left side - Breadcrumb */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary text-primary-foreground font-semibold px-2 py-0.5">
              COM
            </Badge>
            <span className="text-foreground font-medium">{clientName}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-1">
              <span className="text-foreground">{displayId}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 text-xs">
              {status}
            </Badge>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2">
            {headerActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-medium"
              >
                <action.icon className="h-3.5 w-3.5 mr-1.5" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content Area - Preview Mode Checklist */}
        <div className="flex-1 overflow-auto bg-[#F5F8FA] p-6">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-primary">
              {checklist.title}
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" className="h-8">
                Save
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Replace
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Delete
              </Button>
            </div>
          </div>

          {/* Monday Board View in Preview Mode */}
          <div className="bg-white rounded-lg shadow-sm">
            <MondayBoardView
              checklist={checklist}
              onUpdate={handleChecklistUpdate}
              isPreviewMode={true}
              isCompactMode={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
