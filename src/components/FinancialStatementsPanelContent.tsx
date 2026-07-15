import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  RecursiveMenuItem,
  myTemplatesByEntity,
  myCanadaTemplatesByEntity,
  globalTemplatesByEntity,
  US_ENTITY_TYPES,
  CA_ENTITY_TYPES,
} from "@/components/dashboard/templates/TemplateSidebarMenu";
import { cn } from "@/lib/utils";

interface Props {
  isCollapsed?: boolean;
  hasDarkSecondary?: boolean;
}

const COUNTRIES = ["US", "Canada"];

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

  const toggleFolder = (code: string) => {
    setExpandedFolders((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
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

  const activeData = activeTab === "my" ? myData : globalData;

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

      {/* Country picker */}
      <div className="px-3 pb-2 relative">
        <button
          onClick={() => { setCountryOpen(v => !v); setEntityOpen(false); }}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm flex items-center justify-between border mb-2 shadow-sm",
            hasDarkSecondary
              ? "bg-white/10 border-white/20 text-white"
              : "bg-card/80 border-border text-foreground"
          )}
        >
          <span>{selectedCountry}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {countryOpen && (
          <div className={cn(
            "absolute left-3 right-3 z-50 rounded-lg border shadow-lg overflow-hidden",
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
                }}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Entity type picker */}
        <button
          onClick={() => { setEntityOpen(v => !v); setCountryOpen(false); }}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm flex items-center justify-between border shadow-sm",
            hasDarkSecondary
              ? "bg-white/10 border-white/20 text-white"
              : "bg-card/80 border-border text-foreground"
          )}
        >
          <span className="truncate">{selectedEntityType}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 ml-1">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {entityOpen && (
          <div className={cn(
            "absolute left-3 right-3 z-50 rounded-lg border shadow-lg overflow-hidden max-h-48 overflow-y-auto",
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

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className={cn("absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4", hasDarkSecondary ? "text-white/50" : "text-muted-foreground")} />
          <Input
            placeholder="Search"
            className={cn("pl-8 h-8 text-sm border-0 shadow-sm", hasDarkSecondary ? "bg-white/10 text-white placeholder:text-white/40" : "bg-card/80")}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
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
