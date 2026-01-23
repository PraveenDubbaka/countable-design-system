import { useState } from "react";
import { 
  ChevronRight, 
  ChevronDown,
  Search, 
  Plus, 
  Folder, 
  Building2, 
  FileText, 
  ClipboardList, 
  FileCheck, 
  CheckSquare,
  FileSpreadsheet,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Sidebar menu items matching the screenshot
const engagementSections = [
  { id: "co", code: "CO", label: "Client Onboarding", icon: Building2, hasPlus: false },
  { id: "do", code: "DO", label: "Documents", icon: FileText, hasPlus: true },
  { id: "tb", code: "TB", label: "Trial Balance & Adj. Entri...", icon: FileSpreadsheet, hasPlus: false },
  { id: "pr", code: "PR", label: "Procedures", icon: ClipboardList, hasPlus: false },
  { id: "fs", code: "FS", label: "Financial Statements", icon: FileCheck, hasPlus: true },
  { id: "so", code: "SO", label: "Completion & Signoffs", icon: CheckSquare, hasPlus: false },
];

interface EngagementSidebarProps {
  selectedSection: string;
  onSectionSelect: (sectionId: string) => void;
}

export function EngagementSidebar({ selectedSection, onSectionSelect }: EngagementSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["so"]));

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
    onSectionSelect(sectionId);
  };

  return (
    <div className="w-64 bg-sidebar flex flex-col border-r border-border h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <span className="font-semibold text-sidebar-foreground">Engagements</span>
        <CheckSquare className="h-4 w-4 text-sidebar-foreground/70" />
        <span className="text-sm text-sidebar-foreground/70">Signoffs</span>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm bg-muted/30 border-sidebar-border"
          />
        </div>
      </div>

      {/* Sections List - matching template folder styling */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {engagementSections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const isSelected = selectedSection === section.id;

          return (
            <div key={section.id} className="mb-0.5">
              <div
                onClick={() => toggleSection(section.id)}
                className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-sm ${
                  isSelected ? "bg-muted" : "hover:bg-muted/50"
                }`}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <Folder className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="font-semibold text-primary">{section.code}</span>
                <span className="truncate flex-1 text-foreground">{section.label}</span>
                {section.hasPlus && (
                  <Plus className="h-4 w-4 text-muted-foreground hover:text-foreground flex-shrink-0" />
                )}
              </div>
              
              {/* Expanded section content placeholder */}
              {isExpanded && (
                <div className="ml-6 pl-2 border-l border-border">
                  {/* Sub-items would go here */}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
