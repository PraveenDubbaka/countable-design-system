import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, Files, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  RecursiveMenuItem,
  myTemplatesByEntity,
  myCanadaTemplatesByEntity,
  globalTemplatesByEntity,
  US_ENTITY_TYPES,
  CA_ENTITY_TYPES,
  type MenuItem,
} from "@/components/dashboard/templates/TemplateSidebarMenu";
import { cn } from "@/lib/utils";

interface Props {
  isCollapsed?: boolean;
  hasDarkSecondary?: boolean;
}

const COUNTRIES = ["US", "Canada"];

function getAllFolderCodes(items: MenuItem[]): string[] {
  const codes: string[] = [];
  for (const item of items) {
    if (item.type === "folder" && item.children && item.children.length > 0) {
      codes.push(item.code || item.label);
    }
  }
  return codes;
}

export function FinancialStatementsPanelContent({ isCollapsed, hasDarkSecondary }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"my" | "global">("my");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [selectedEntityType, setSelectedEntityType] = useState("C-Corp");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["COMP", "GCOMP"]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [entityOpen, setEntityOpen] = useState(false);
  const [selectedGlobal, setSelectedGlobal] = useState<Set<string>>(new Set());

  const entityTypes = selectedCountry === "US" ? US_ENTITY_TYPES : CA_ENTITY_TYPES;

  const currentMyTemplates =
    selectedCountry === "US" ? myTemplatesByEntity : myCanadaTemplatesByEntity;

  const entityKey =
    selectedEntityType === "Trust"
      ? "Trusts"
      : selectedEntityType === "Partnership" && selectedCountry !== "US"
      ? "Partnerships"
      : selectedEntityType;

  const myData = currentMyTemplates[selectedEntityType] ?? [];
  const globalData = globalTemplatesByEntity[entityKey] ?? globalTemplatesByEntity["C-Corp"] ?? [];
  const activeData = activeTab === "my" ? myData : globalData;

  const allFolderCodes = getAllFolderCodes(activeData);
  const allExpanded = allFolderCodes.length > 0 && allFolderCodes.every(c => expandedFolders.includes(c));

  const handleExpandCollapseAll = () => {
    if (allExpanded) {
      setExpandedFolders(prev => prev.filter(c => !allFolderCodes.includes(c)));
    } else {
      setExpandedFolders(prev => [...new Set([...prev, ...allFolderCodes])]);
    }
  };

  const toggleFolder = (code: string) => {
    setExpandedFolders(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSelectItem = (label: string) => {
    setSelectedItem(label);
    navigate(`/financial-statement-templates?template=${encodeURIComponent(label)}`);
  };

  if (isCollapsed) return null;

  const tabClass = (tab: "my" | "global") =>
    `flex-1 py-2 px-1 text-sm font-medium transition-all text-center whitespace-nowrap border-b-[3px] ${
      activeTab === tab
        ? hasDarkSecondary
          ? "text-white border-white"
          : "text-primary border-primary"
        : (hasDarkSecondary
            ? "text-white/50 hover:text-white/80"
            : "text-muted-foreground hover:text-foreground") + " border-transparent"
    }`;

  const expandIcon = (
    <svg width="15" height="15" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      {allExpanded ? (
        <path d="M9.72214 6.94412L14.5833 2.08301M14.5833 2.08301H10.4166M14.5833 2.08301V6.24967M6.94436 9.7219L2.08325 14.583M2.08325 14.583H6.24992M2.08325 14.583L2.08325 10.4163"
          stroke={hasDarkSecondary ? "white" : "#074075"} strokeWidth="1.38889" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M2.08325 6.94412L2.08325 2.08301M2.08325 2.08301L6.24992 2.08301M2.08325 2.08301L6.94436 6.94412M14.5833 9.7219L14.5833 14.583M14.5833 14.583L10.4166 14.583M14.5833 14.583L9.72214 9.7219"
          stroke={hasDarkSecondary ? "white" : "#074075"} strokeWidth="1.38889" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );

  return (
    <>
      {/* Tabs */}
      <div
        className="flex mb-2"
        style={{
          borderBottom: hasDarkSecondary
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid hsl(var(--border))",
        }}
      >
        <button onClick={() => setActiveTab("my")} className={tabClass("my")}>
          My Templates
        </button>
        <button onClick={() => setActiveTab("global")} className={tabClass("global")}>
          Global Templates
        </button>
      </div>

      {/* Country + entity compact pickers */}
      <div className="px-3 pb-2 flex gap-2 relative">
        {/* Country */}
        <div className="relative flex-1">
          <button
            onClick={() => { setCountryOpen(v => !v); setEntityOpen(false); }}
            className={cn(
              "w-full px-2.5 py-1.5 rounded-lg text-sm flex items-center justify-between border shadow-sm",
              hasDarkSecondary
                ? "bg-white/10 border-white/20 text-white"
                : "bg-card/80 border-border text-foreground"
            )}
          >
            <span className="truncate">{selectedCountry}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 ml-1 text-muted-foreground" />
          </button>
          {countryOpen && (
            <div className={cn(
              "absolute left-0 right-0 z-50 mt-1 rounded-lg border shadow-lg overflow-hidden",
              hasDarkSecondary ? "bg-[#1a2a3a] border-white/20" : "bg-card border-border"
            )}>
              {COUNTRIES.map(c => (
                <button
                  key={c}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left transition-colors",
                    hasDarkSecondary ? "hover:bg-white/10 text-white" : "hover:bg-muted text-foreground",
                    c === selectedCountry && (hasDarkSecondary ? "bg-white/15" : "bg-primary/5 text-primary")
                  )}
                  onClick={() => {
                    setSelectedCountry(c);
                    setSelectedEntityType(c === "US" ? "C-Corp" : "Corporations");
                    setCountryOpen(false);
                    setExpandedFolders(["COMP", "GCOMP"]);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Entity type */}
        <div className="relative flex-[2]">
          <button
            onClick={() => { setEntityOpen(v => !v); setCountryOpen(false); }}
            className={cn(
              "w-full px-2.5 py-1.5 rounded-lg text-sm flex items-center justify-between border shadow-sm",
              hasDarkSecondary
                ? "bg-white/10 border-white/20 text-white"
                : "bg-card/80 border-border text-foreground"
            )}
          >
            <span className="truncate">{selectedEntityType}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 ml-1 text-muted-foreground" />
          </button>
          {entityOpen && (
            <div className={cn(
              "absolute left-0 right-0 z-50 mt-1 rounded-lg border shadow-lg overflow-hidden max-h-48 overflow-y-auto",
              hasDarkSecondary ? "bg-[#1a2a3a] border-white/20" : "bg-card border-border"
            )}>
              {entityTypes.map(e => (
                <button
                  key={e}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left transition-colors",
                    hasDarkSecondary ? "hover:bg-white/10 text-white" : "hover:bg-muted text-foreground",
                    e === selectedEntityType && (hasDarkSecondary ? "bg-white/15" : "bg-primary/5 text-primary")
                  )}
                  onClick={() => {
                    setSelectedEntityType(e);
                    setEntityOpen(false);
                    setExpandedFolders(["COMP", "GCOMP"]);
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar: search + expand/collapse + action buttons */}
      <div className="p-3 pt-0 pb-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className={cn("absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4", hasDarkSecondary ? "text-white/50" : "text-muted-foreground")} />
            <Input
              placeholder="Search"
              className={cn("pl-8 h-8 text-sm border-0 shadow-sm", hasDarkSecondary ? "bg-white/10 text-white placeholder:text-white/40" : "bg-card/80")}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Expand / Collapse All */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn("h-8 w-8 rounded-md flex items-center justify-center transition-colors flex-shrink-0", hasDarkSecondary ? "bg-white/10 hover:bg-white/20" : "bg-primary/10 hover:bg-primary/20")}
                onClick={handleExpandCollapseAll}
              >
                {expandIcon}
              </button>
            </TooltipTrigger>
            <TooltipContent>{allExpanded ? "Collapse All" : "Expand All"}</TooltipContent>
          </Tooltip>

          {activeTab === "my" && (
            <>
              <Button size="icon" className="h-8 w-8 bg-[#1C63A6] hover:bg-[#1a5a9e] shadow-sm flex-shrink-0">
                <Plus className="h-4 w-4 text-primary-foreground icon-plus" />
              </Button>
              <Button size="icon" variant="secondary" className="h-8 w-8 text-destructive hover:text-destructive focus-visible:text-destructive flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}

          {activeTab === "global" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="h-8 w-8 bg-[#1C63A6] hover:bg-[#1a5a9e] shadow-sm flex-shrink-0"
                  disabled={selectedGlobal.size === 0}
                  onClick={() => {
                    setSelectedGlobal(new Set());
                  }}
                >
                  <Files className="h-4 w-4 text-primary-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {selectedGlobal.size > 0
                  ? `Add ${selectedGlobal.size} selected to My Templates`
                  : "Select templates to add"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Template tree */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {activeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 gap-2 text-center px-4">
            <p className={cn("text-sm", hasDarkSecondary ? "text-white/50" : "text-muted-foreground")}>
              No templates for this selection
            </p>
          </div>
        ) : (
          activeData.map((item, idx) => (
            <RecursiveMenuItem
              key={(item.code || item.label) + idx}
              item={item}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
              depth={0}
              searchQuery={searchQuery}
            />
          ))
        )}
      </div>
    </>
  );
}
