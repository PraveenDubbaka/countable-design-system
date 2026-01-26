import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { 
  ChevronRight, 
  ChevronDown, 
  Landmark,
  FileText,
  Triangle,
  FileSpreadsheet,
  PencilLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { MondayBoardView } from "@/components/MondayBoardView";
import { FloatingActionBar } from "@/components/FloatingActionBar";
import { Checklist } from "@/types/checklist";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { toast } from "sonner";

// Sample engagement data matching the engagements page
const engagementsData: Record<string, { id: string; client: string; type: string; yearEnd: string; status: string; checklistId?: string }> = {
  "COM-CON-Dec312024": { id: "COM-CON-Dec312024", client: "Shipping Line Inc.", type: "Compilation (COM)", yearEnd: "Dec 31, 2024", status: "In Progress" },
  "COM-PSP-Dec312023": { id: "COM-PSP-Dec312023", client: "Source 40", type: "Compilation (COM)", yearEnd: "Dec 31, 2023", status: "In Progress" },
  "COM-QB-Dec312025": { id: "COM-QB-Dec312025", client: "qb 40.1", type: "Compilation (COM)", yearEnd: "Dec 31, 2025", status: "In Progress" },
};

// Fallback checklist when no saved checklist exists
const fallbackChecklist: Checklist = {
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
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());

  const engagement = engagementId ? engagementsData[engagementId] : null;
  const displayId = engagementId || "Unknown";
  const clientName = engagement?.client || "Unknown Client";
  const status = engagement?.status || "In Progress";

  // Load checklist from localStorage - use first saved checklist or fallback
  useEffect(() => {
    const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
    
    if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
      // Use the first saved checklist's data
      const firstChecklist = savedChecklists[0];
      if (firstChecklist?.data) {
        setChecklist(firstChecklist.data);
        return;
      }
    }
    
    // Fallback to sample checklist if no saved checklists exist
    setChecklist(fallbackChecklist);
  }, [engagementId]);

  // Listen for storage changes (when templates page saves)
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
    // In preview mode, we also save changes back to localStorage
    const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
    if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
      const updated = savedChecklists.map((c: any, index: number) => 
        index === 0 ? { ...c, data: updatedChecklist } : c
      );
      writeJsonToLocalStorage('savedChecklists', updated);
    }
  };

  const handleSave = () => {
    if (checklist) {
      const savedChecklists = readJsonFromLocalStorage<any[]>('savedChecklists', []);
      if (Array.isArray(savedChecklists) && savedChecklists.length > 0) {
        const updated = savedChecklists.map((c: any, index: number) => 
          index === 0 ? { ...c, data: checklist } : c
        );
        writeJsonToLocalStorage('savedChecklists', updated);
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
    return checklist.sections.every(s => 
      s.questions.every(q => !q.isExpanded)
    );
  }, [checklist]);

  const handleCollapseSections = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({ ...s, isExpanded: false }))
    };
    setChecklist(updated);
  };

  const handleExpandSections = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({ ...s, isExpanded: true }))
    };
    setChecklist(updated);
  };

  const handleCollapseQuestions = () => {
    if (!checklist) return;
    const updated = {
      ...checklist,
      sections: checklist.sections.map(s => ({
        ...s,
        questions: s.questions.map(q => ({ ...q, isExpanded: false }))
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
        questions: s.questions.map(q => ({ ...q, isExpanded: true }))
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

  if (!checklist) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading checklist...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Top Header Bar with breadcrumb and actions */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
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
        <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: "#F5F8FA" }}>
          {/* Section Title */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-primary">
              {checklist.title}
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="default" size="sm" className="h-8" onClick={handleSave}>
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
              isCompactMode={isCompactMode}
              selectedQuestions={selectedQuestions}
              onSelectionChange={setSelectedQuestions}
            />
          </div>
        </div>

        {/* Floating Action Bar for Preview Mode */}
        <FloatingActionBar
          checklist={checklist}
          onUpdate={handleChecklistUpdate}
          onCollapseSections={handleCollapseSections}
          onExpandSections={handleExpandSections}
          onCollapseQuestions={handleCollapseQuestions}
          onExpandQuestions={handleExpandQuestions}
          allSectionsCollapsed={allSectionsCollapsed}
          allQuestionsCollapsed={allQuestionsCollapsed}
          isCompactMode={isCompactMode}
          onToggleCompactMode={handleToggleCompactMode}
          selectedQuestions={selectedQuestions}
          onBulkDelete={handleBulkDelete}
          onAddCategory={handleAddCategory}
          isPreviewMode={true}
        />
      </div>
    </Layout>
  );
}
