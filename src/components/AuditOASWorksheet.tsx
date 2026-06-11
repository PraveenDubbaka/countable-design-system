import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, AlertTriangle, Plus, Trash2, Sparkles, X, Check } from "lucide-react";
import { toast } from "sonner";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { loadEngagements, getEngagementMeta } from "@/store/engagementsStore";

// ── Types ──────────────────────────────────────────────────────────────────────

interface AuditArea { key: string; checked: boolean; notes: string; }
interface TeamMember { id: string; role: string; name: string; experience: string; }
interface SignOff { id: string; name: string; role: string; initials: string; date: string; }

// ── Constants ──────────────────────────────────────────────────────────────────

const AUDIT_AREA_LABELS: Record<string, string> = {
  "material-areas":    "Material financial statement areas and disclosures",
  "operational":       "Major operational or control changes during the period",
  "standards-changes": "Impact of changes in accounting standards",
  "past-matters":      "Matters raised from past experience (prior-year findings)",
  "significant-risks": "Significant risks and going-concern uncertainties",
  "experts":           "Use of auditor's experts",
  "service-orgs":      "Use of service organization reports (SOC 1 / SOC 2)",
  "component-auditors":"Use of component auditors",
  "group-auditor":     "Coordination of work with a group auditor",
  "subsidiaries":      "Need for stand-alone audited financial statements of subsidiaries",
  "key-matters":       "Key audit matters (where applicable)",
};

const AREA_KEYS = Object.keys(AUDIT_AREA_LABELS);

const TEAM_ROLES = [
  "Engagement Partner",
  "Manager",
  "Senior Auditor",
  "Staff Auditor / Assistant",
  "EQCR (Quality Reviewer)",
  "Tax Reviewer",
  "Subject Matter Expert (SME)",
  "Other",
];

// ── Mock seed data ─────────────────────────────────────────────────────────────

const CA_SEED = {
  entity:              "Shipping Line Inc.",
  period:              "March 31, 2024",
  framework:           "Canadian Accounting Standards for Private Enterprises (ASPE) — CPA Canada Handbook Part II",
  industryNotes:       "Marine freight and shipping — Transport Canada regulations, cross-border customs compliance",
  reportingDeadline:   "Draft FS to management by May 31, 2024. Final report by June 14, 2024.",
  teamPlanningNotes:   "Planning meeting held April 8, 2024. Attendees: J. Patel (Partner), A. Nguyen (Manager), T. Brown (Senior), D. Kim (Staff), P. Singh (CFO), C. Okafor (Controller).",
  fieldworkStart:      "2024-04-08",
  fieldworkEnd:        "2024-05-10",
  fileReviewNotes:     "Manager review: ongoing. Partner review: May 15, 2024. EQCR: May 17, 2024.",
  managementMeetings:  "Interim: April 10, 2024. Completion: May 20, 2024.",
  otherTiming:         "",
  checkedAreas:        ["material-areas", "operational", "standards-changes", "past-matters", "significant-risks"],
  budgetFee:           "31,000",
  budgetHours:         "195",
  budgetNotes:         "See Form 450 for detailed time budget.",
  auditStrategy:       "Audit plan documented in Forms 500-590. TCWG planning communication: Letter AL3.1 sent April 9, 2024.",
  subsequentChanges:   "",
  teamMembers: [
    { id: "t1", role: "Engagement Partner",      name: "J. Patel, CPA",                   experience: "15 years experience" },
    { id: "t2", role: "Manager",                 name: "A. Nguyen, CPA",                  experience: "7 years experience" },
    { id: "t3", role: "Senior Auditor",          name: "T. Brown",                        experience: "3 years experience" },
    { id: "t4", role: "Staff Auditor / Assistant",name: "D. Kim",                         experience: "1 year experience" },
    { id: "t5", role: "EQCR (Quality Reviewer)", name: "S. Lavoie, CPA",                 experience: "Independent reviewer" },
  ],
  signOffs: [
    { id: "s1", name: "A. Nguyen",  role: "Prepared by",   initials: "AN", date: "2024-04-09" },
    { id: "s2", name: "J. Patel",   role: "Reviewed by",   initials: "JP", date: "2024-04-10" },
  ],
};

const US_SEED = {
  entity:              "Harbor Freight Logistics LLC",
  period:              "December 31, 2024",
  framework:           "US GAAP — Financial Accounting Standards Board (FASB) Accounting Standards Codification (ASC)",
  industryNotes:       "Freight logistics and warehousing — DOT/FMCSA regulations, multi-state operations",
  reportingDeadline:   "Draft FS to management by February 28, 2025. Final report by March 15, 2025.",
  teamPlanningNotes:   "Planning meeting held January 20, 2025. Attendees: M. Thompson (Partner), L. Garcia (Manager), K. Patel (Senior), J. Chen (Staff), R. Morrison (CFO), S. Williams (Controller).",
  fieldworkStart:      "2025-01-20",
  fieldworkEnd:        "2025-02-07",
  fileReviewNotes:     "Manager review: ongoing. Partner review: February 10, 2025. EQCR: February 12, 2025.",
  managementMeetings:  "Interim: January 22, 2025. Completion: February 14, 2025.",
  otherTiming:         "",
  checkedAreas:        ["material-areas", "operational", "standards-changes", "past-matters", "significant-risks", "experts", "service-orgs"],
  budgetFee:           "42,500",
  budgetHours:         "280",
  budgetNotes:         "See Form 450 for detailed time budget.",
  auditStrategy:       "Audit plan documented in Forms 500-590. TCWG planning communication: Letter AL3.1 sent January 22, 2025.",
  subsequentChanges:   "",
  teamMembers: [
    { id: "t1", role: "Engagement Partner",      name: "M. Thompson, CPA",               experience: "18 years experience" },
    { id: "t2", role: "Manager",                 name: "L. Garcia, CPA",                 experience: "9 years experience" },
    { id: "t3", role: "Senior Auditor",          name: "K. Patel",                       experience: "4 years experience" },
    { id: "t4", role: "Staff Auditor / Assistant",name: "J. Chen",                       experience: "1 year experience" },
    { id: "t5", role: "Subject Matter Expert (SME)", name: "Summit Valuation Group",     experience: "Goodwill impairment" },
    { id: "t6", role: "EQCR (Quality Reviewer)", name: "D. Anderson, CPA",              experience: "Independent reviewer" },
  ],
  signOffs: [
    { id: "s1", name: "L. Garcia",   role: "Prepared by",  initials: "LG", date: "2025-01-21" },
    { id: "s2", name: "M. Thompson", role: "Reviewed by",  initials: "MT", date: "2025-01-22" },
  ],
};

let _uid = 0;
const uid = () => `r${++_uid}-${Date.now().toString(36)}`;

// ── Wrapper — keys inner component so variant-switch re-initialises state ──────

export function AuditOASWorksheet({ isUS }: { isUS?: boolean }) {
  return <WorksheetInner key={isUS ? "us" : "ca"} isUS={!!isUS} />;
}

// ── Inner component ────────────────────────────────────────────────────────────

function WorksheetInner({ isUS }: { isUS: boolean }) {
  const { engagementId = "" } = useParams<{ engagementId: string }>();
  const storageKey = `audit-oas-data-${engagementId || (isUS ? "us" : "ca")}`;

  // Read engagement meta for auto-population
  const engMeta = engagementId ? getEngagementMeta(engagementId) : null;
  const engList = loadEngagements();
  const engRecord = engList.find(e => e.id === engagementId);

  const seed = isUS ? US_SEED : CA_SEED;
  const saved = readJsonFromLocalStorage<Record<string, unknown>>(storageKey, {});

  function getSaved<T>(key: string, fallback: T): T {
    return (key in saved ? saved[key] : fallback) as T;
  }

  // ── Header ──────────────────────────────────────────────────────────────────
  const [entity, setEntity] = useState<string>(
    getSaved("entity", engRecord?.client ?? seed.entity)
  );
  const [period, setPeriod] = useState<string>(
    getSaved("period", engRecord?.yearEnd ?? seed.period)
  );

  // ── Section 1: Reporting Requirements ───────────────────────────────────────
  const autoFramework = engMeta?.accountingFramework
    ? `${engMeta.accountingFramework}${engMeta.accountingStandards ? ` — ${engMeta.accountingStandards}` : ""}`
    : "";
  const [framework, setFramework] = useState<string>(
    getSaved("framework", autoFramework || seed.framework)
  );
  const [industryNotes, setIndustryNotes] = useState<string>(
    getSaved("industryNotes", (engMeta?.industry ? `${engMeta.industry} — ` : "") || seed.industryNotes)
  );

  // ── Section 2: Timing ───────────────────────────────────────────────────────
  const [reportingDeadline, setReportingDeadline] = useState<string>(
    getSaved("reportingDeadline", seed.reportingDeadline)
  );
  const [teamPlanningNotes, setTeamPlanningNotes] = useState<string>(
    getSaved("teamPlanningNotes", seed.teamPlanningNotes)
  );
  const [fieldworkStart, setFieldworkStart] = useState<string>(
    getSaved("fieldworkStart", seed.fieldworkStart)
  );
  const [fieldworkEnd, setFieldworkEnd] = useState<string>(
    getSaved("fieldworkEnd", seed.fieldworkEnd)
  );
  const [fileReviewNotes, setFileReviewNotes] = useState<string>(
    getSaved("fileReviewNotes", seed.fileReviewNotes)
  );
  const [managementMeetings, setManagementMeetings] = useState<string>(
    getSaved("managementMeetings", seed.managementMeetings)
  );
  const [otherTiming, setOtherTiming] = useState<string>(
    getSaved("otherTiming", seed.otherTiming)
  );

  // ── Section 3: Key Audit Areas ───────────────────────────────────────────────
  const savedAreas = getSaved<AuditArea[] | null>("auditAreas", null);
  const [auditAreas, setAuditAreas] = useState<AuditArea[]>(
    savedAreas ?? AREA_KEYS.map(key => ({
      key,
      checked: seed.checkedAreas.includes(key),
      notes: "",
    }))
  );

  // ── Section 4: Audit Team ────────────────────────────────────────────────────
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    getSaved("teamMembers", seed.teamMembers)
  );

  // ── Section 5: Budget ────────────────────────────────────────────────────────
  const [budgetFee, setBudgetFee] = useState<string>(
    getSaved("budgetFee", engMeta?.budget ? parseFloat(engMeta.budget).toLocaleString() : seed.budgetFee)
  );
  const [budgetHours, setBudgetHours] = useState<string>(
    getSaved("budgetHours", seed.budgetHours)
  );
  const [budgetNotes, setBudgetNotes] = useState<string>(
    getSaved("budgetNotes", seed.budgetNotes)
  );

  // ── Section 6: Audit Strategy ────────────────────────────────────────────────
  const [auditStrategy, setAuditStrategy] = useState<string>(
    getSaved("auditStrategy", seed.auditStrategy)
  );

  // ── Section 7: Subsequent Changes ───────────────────────────────────────────
  const [subsequentChanges, setSubsequentChanges] = useState<string>(
    getSaved("subsequentChanges", seed.subsequentChanges)
  );

  // ── Sign-offs + conclusion ───────────────────────────────────────────────────
  const [signOffs, setSignOffs] = useState<SignOff[]>(
    getSaved("signOffs", seed.signOffs)
  );
  const [conclusion, setConclusion] = useState<string>(
    getSaved("conclusion", "")
  );
  const [concluded, setConcluded] = useState<boolean>(
    getSaved("concluded", false)
  );
  const [concludedBy, setConcludedBy] = useState<string>(
    getSaved("concludedBy", "")
  );
  const [concludedOn, setConcludedOn] = useState<string>(
    getSaved("concludedOn", "")
  );

  // ── Import Meeting Notes modal ───────────────────────────────────────────────
  const [importStep, setImportStep] = useState(0);
  const [meetingImported, setMeetingImported] = useState(
    getSaved("meetingImported", false)
  );

  // ── Debounced persistence ────────────────────────────────────────────────────
  const firstRender = useRef(true);
  const snapshot = {
    entity, period, framework, industryNotes,
    reportingDeadline, teamPlanningNotes, fieldworkStart, fieldworkEnd,
    fileReviewNotes, managementMeetings, otherTiming,
    auditAreas, teamMembers,
    budgetFee, budgetHours, budgetNotes,
    auditStrategy, subsequentChanges,
    signOffs, conclusion, concluded, concludedBy, concludedOn,
    meetingImported,
  };
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, snapshotRef.current), 450);
    return () => clearTimeout(t);
  }, [
    entity, period, framework, industryNotes,
    reportingDeadline, teamPlanningNotes, fieldworkStart, fieldworkEnd,
    fileReviewNotes, managementMeetings, otherTiming,
    auditAreas, teamMembers,
    budgetFee, budgetHours, budgetNotes,
    auditStrategy, subsequentChanges,
    signOffs, conclusion, concluded, concludedBy, concludedOn,
    meetingImported, storageKey,
  ]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function toggleArea(key: string) {
    setAuditAreas(prev => prev.map(a => a.key === key ? { ...a, checked: !a.checked } : a));
  }
  function setAreaNotes(key: string, notes: string) {
    setAuditAreas(prev => prev.map(a => a.key === key ? { ...a, notes } : a));
  }

  function addTeamMember() {
    setTeamMembers(prev => [...prev, { id: uid(), role: TEAM_ROLES[0], name: "", experience: "" }]);
  }
  function removeTeamMember(id: string) {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  }
  function updateTeamMember(id: string, field: keyof TeamMember, value: string) {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  }

  function addSignOff() {
    setSignOffs(prev => [...prev, { id: uid(), name: "", role: "Reviewed by", initials: "", date: "" }]);
  }
  function removeSignOff(id: string) {
    setSignOffs(prev => prev.filter(s => s.id !== id));
  }
  function updateSignOff(id: string, field: keyof SignOff, value: string) {
    setSignOffs(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }

  function handleConclude() {
    const today = new Date().toLocaleDateString("en-CA");
    const by = signOffs.find(s => s.role === "Prepared by")?.name || signOffs[0]?.name || "Auditor";
    setConcluded(true);
    setConcludedBy(by);
    setConcludedOn(today);
    writeJsonToLocalStorage(storageKey, { ...snapshotRef.current, concluded: true, concludedBy: by, concludedOn: today });
    toast.success("Overall Audit Strategy concluded.");
  }

  function handleConfirmImport() {
    setImportStep(0);
    setMeetingImported(true);
    setTeamPlanningNotes(seed.teamPlanningNotes);
    setTeamMembers(seed.teamMembers);
    toast.success("Meeting notes imported. Team planning discussion and audit team sections populated.");
  }

  // ── Derived ──────────────────────────────────────────────────────────────────
  const checkedCount = auditAreas.filter(a => a.checked).length;
  const s1Done = framework.trim() !== "";
  const s2Done = reportingDeadline.trim() !== "" && fieldworkStart !== "";
  const s3Done = checkedCount > 0;
  const s4Done = teamMembers.length > 0;
  const s5Done = budgetFee.trim() !== "";
  const s6Done = auditStrategy.trim() !== "";

  const inputCls = "h-9 text-sm";
  const cardShell = "bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden";
  const cardHeader = "px-6 py-3.5 bg-card border-b border-border flex items-center gap-3";
  const cardBody = "px-6 py-5";

  return (
    <div className="flex flex-col h-full">

      {/* Import Meeting Notes modal */}
      {importStep > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

            {importStep === 1 && (
              <div className="p-8 flex flex-col items-center gap-5 text-center">
                <div className="text-4xl">🗓️</div>
                <p className="text-base font-semibold text-foreground">Connecting to Google Calendar...</p>
                <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-muted-foreground">Retrieving planning meetings for {entity}...</p>
              </div>
            )}

            {importStep === 2 && (
              <div className="p-8 flex flex-col items-center gap-5 text-center">
                <div className="text-4xl">✨</div>
                <p className="text-base font-semibold text-foreground">Luka AI is analyzing your meeting notes...</p>
                <ImportProgressBar />
                <p className="text-sm text-muted-foreground">Reading transcript… Extracting attendees… Mapping team roles…</p>
              </div>
            )}

            {importStep === 3 && (
              <div>
                <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
                  <p className="text-base font-semibold text-foreground">Draft Content Found</p>
                  <button onClick={() => setImportStep(0)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-1">
                    <p className="text-sm font-medium text-foreground">📅 Meeting found</p>
                    <p className="text-sm text-muted-foreground">"Audit Planning Discussion — {entity}"</p>
                    <p className="text-xs text-muted-foreground">{isUS ? "Jan 20, 2025, 2:00 PM" : "Apr 8, 2024, 10:00 AM"}</p>
                  </div>
                  <div className="space-y-2">
                    {["6 Attendees identified", "Team planning discussion text extracted", "Audit team roles populated", "4 firm members + 2 client representatives"].map(item => (
                      <div key={item} className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800 dark:text-green-400">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 pb-6 flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setImportStep(0)}>Cancel</Button>
                  <Button onClick={() => setImportStep(4)}>Review Draft</Button>
                </div>
              </div>
            )}

            {importStep === 4 && (
              <div>
                <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
                  <p className="text-base font-semibold text-foreground">Review Draft</p>
                  <button onClick={() => setImportStep(0)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                </div>
                <div className="px-6 py-5 max-h-72 overflow-y-auto space-y-3">
                  <div className="rounded-md border border-border overflow-hidden">
                    <div className="px-3 py-2 bg-muted border-b border-border"><p className="text-xs font-semibold text-foreground uppercase tracking-wider">Team Planning Discussion</p></div>
                    <div className="px-3 py-2 space-y-1">
                      <div className="flex gap-2 text-sm"><span className="text-muted-foreground w-28 shrink-0">Meeting date:</span><span className="text-foreground">{isUS ? "January 20, 2025" : "April 8, 2024"}</span></div>
                      <div className="flex gap-2 text-sm"><span className="text-muted-foreground w-28 shrink-0">Attendees:</span><span className="text-foreground">{isUS ? "M. Thompson, L. Garcia, K. Patel, J. Chen, R. Morrison, S. Williams" : "J. Patel, A. Nguyen, T. Brown, D. Kim, P. Singh, C. Okafor"}</span></div>
                    </div>
                  </div>
                  <div className="rounded-md border border-border overflow-hidden">
                    <div className="px-3 py-2 bg-muted border-b border-border"><p className="text-xs font-semibold text-foreground uppercase tracking-wider">Audit Team Members</p></div>
                    <div className="px-3 py-2 space-y-1">
                      {seed.teamMembers.map(m => (
                        <div key={m.id} className="flex gap-2 text-sm"><span className="text-muted-foreground w-28 shrink-0">{m.role.split("(")[0].trim()}:</span><span className="text-foreground">{m.name} — {m.experience}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6 flex gap-3 justify-end border-t border-border pt-4">
                  <Button variant="outline" onClick={() => setImportStep(3)}>← Back</Button>
                  <Button onClick={handleConfirmImport} className="bg-green-600 hover:bg-green-700 text-white">
                    <Check className="h-4 w-4 mr-1" /> Confirm &amp; Import
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ImportStepController importStep={importStep} setImportStep={setImportStep} />

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6">

          {/* Concluded banner */}
          {concluded && (
            <div className="mb-5 flex items-center gap-3 px-5 py-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span className="text-sm font-medium text-green-800 dark:text-green-400">
                Concluded by {concludedBy} on {concludedOn} — this worksheet is read-only.
              </span>
            </div>
          )}

          {/* Objective bar */}
          <div className="mb-5 px-6 py-2.5 border border-border rounded-md bg-primary/[0.03] flex items-start gap-3">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              To document the scope, timing and direction of the audit as a guide for the development of the audit plan. This worksheet documents the overall audit strategy in accordance with {isUS ? "AU-C 300" : "CAS 300"}.
            </p>
          </div>

          {/* Header fields */}
          <div className={`${cardShell} mb-5`}>
            <div className={`${cardHeader}`}>
              <span className="text-sm font-semibold text-foreground">Engagement Details</span>
              {engRecord && <Badge variant="secondary" className="text-xs">{engRecord.type}</Badge>}
            </div>
            <div className={`${cardBody} grid grid-cols-2 gap-4`}>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Entity</label>
                <Input className={inputCls} value={entity} onChange={e => setEntity(e.target.value)} disabled={concluded} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Period Ended</label>
                <Input className={inputCls} value={period} onChange={e => setPeriod(e.target.value)} disabled={concluded} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">

            {/* ── Section 1: Reporting Requirements ── */}
            <div className={cardShell}>
              <div className={cardHeader}>
                <span className="text-sm font-semibold text-foreground">1. Reporting Requirements</span>
                <Badge variant={s1Done ? "success" : "secondary"}>{s1Done ? "Complete" : "Pending"}</Badge>
              </div>
              <div className={`${cardBody} flex flex-col gap-4`}>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground">Financial Reporting Framework</label>
                    {autoFramework && !getSaved("framework", null) && (
                      <Badge variant="secondary" className="text-xs">Auto-populated</Badge>
                    )}
                  </div>
                  <Input
                    className={inputCls}
                    value={framework}
                    onChange={e => setFramework(e.target.value)}
                    placeholder="e.g. ASPE — CPA Canada Handbook Part II"
                    disabled={concluded}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Industry-Specific or Specialized Requirements</label>
                  <Textarea
                    className="text-sm resize-none min-h-[72px]"
                    value={industryNotes}
                    onChange={e => setIndustryNotes(e.target.value)}
                    placeholder="Describe any industry-specific regulatory or specialized reporting requirements…"
                    disabled={concluded}
                  />
                </div>
              </div>
            </div>

            {/* ── Section 2: Timing ── */}
            <div className={cardShell}>
              <div className={cardHeader}>
                <span className="text-sm font-semibold text-foreground">2. Timing</span>
                <Badge variant={s2Done ? "success" : "secondary"}>{s2Done ? "Complete" : "Pending"}</Badge>
              </div>
              <div className={`${cardBody} grid grid-cols-2 gap-4`}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Entity's Reporting Deadlines</label>
                  <Textarea
                    className="text-sm resize-none min-h-[64px]"
                    value={reportingDeadline}
                    onChange={e => setReportingDeadline(e.target.value)}
                    placeholder="Draft FS to management by…"
                    disabled={concluded}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground">Team Planning Discussions</label>
                    {!concluded && (
                      meetingImported
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"><Check className="h-3 w-3" /> Imported</span>
                        : <button
                            onClick={() => setImportStep(1)}
                            className="h-7 px-2.5 rounded-full bg-gradient-to-r from-[#1C63A6] to-[#7A31D8] hover:from-[#1a5a96] hover:to-[#6a2bc2] text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
                          >
                            <Sparkles className="h-3 w-3" />
                            Import Meeting Notes
                          </button>
                    )}
                  </div>
                  <Textarea
                    className="text-sm resize-none min-h-[64px]"
                    value={teamPlanningNotes}
                    onChange={e => setTeamPlanningNotes(e.target.value)}
                    placeholder="Planning meeting date, attendees…"
                    disabled={concluded}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Planned Fieldwork Start</label>
                  <Input
                    className={inputCls}
                    type="date"
                    value={fieldworkStart}
                    onChange={e => setFieldworkStart(e.target.value)}
                    disabled={concluded}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Planned Fieldwork End</label>
                  <Input
                    className={inputCls}
                    type="date"
                    value={fieldworkEnd}
                    onChange={e => setFieldworkEnd(e.target.value)}
                    disabled={concluded}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">File Reviews (including EQCR)</label>
                  <Textarea
                    className="text-sm resize-none min-h-[64px]"
                    value={fileReviewNotes}
                    onChange={e => setFileReviewNotes(e.target.value)}
                    placeholder="Manager review: …  Partner review: …  EQCR: …"
                    disabled={concluded}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Meetings with Management and TCWG</label>
                  <Textarea
                    className="text-sm resize-none min-h-[64px]"
                    value={managementMeetings}
                    onChange={e => setManagementMeetings(e.target.value)}
                    placeholder="Interim: …  Completion: …"
                    disabled={concluded}
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Other Timing Matters</label>
                  <Textarea
                    className="text-sm resize-none min-h-[56px]"
                    value={otherTiming}
                    onChange={e => setOtherTiming(e.target.value)}
                    placeholder="Any other timing considerations…"
                    disabled={concluded}
                  />
                </div>
              </div>
            </div>

            {/* ── Section 3: Key Audit Areas ── */}
            <div className={cardShell}>
              <div className={cardHeader}>
                <span className="text-sm font-semibold text-foreground">3. Key Audit Areas</span>
                <Badge variant={s3Done ? "success" : "secondary"}>{checkedCount} of {AREA_KEYS.length} selected</Badge>
                <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  Informed by Form 590 (Risk Assessment)
                </span>
              </div>
              <div className={`${cardBody} flex flex-col gap-3`}>
                {auditAreas.map(area => (
                  <div key={area.key}>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={area.checked}
                        onCheckedChange={() => !concluded && toggleArea(area.key)}
                        className="mt-0.5"
                        disabled={concluded}
                      />
                      <div className="flex-1">
                        <span className={`text-sm ${area.checked ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {AUDIT_AREA_LABELS[area.key]}
                        </span>
                        {area.checked && (
                          <Input
                            className="h-8 text-xs mt-1.5"
                            placeholder="Notes (optional)…"
                            value={area.notes}
                            onChange={e => setAreaNotes(area.key, e.target.value)}
                            disabled={concluded}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section 4: Audit Team ── */}
            <div className={cardShell}>
              <div className={cardHeader}>
                <span className="text-sm font-semibold text-foreground">4. Audit Team</span>
                <Badge variant={s4Done ? "success" : "secondary"}>{teamMembers.length} member{teamMembers.length !== 1 ? "s" : ""}</Badge>
              </div>
              <div className={cardBody}>
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground uppercase tracking-wider w-52">Role</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground uppercase tracking-wider">Name</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground uppercase tracking-wider">Experience / Notes</th>
                        {!concluded && <th className="w-10 px-4 py-2.5" />}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {teamMembers.map(m => (
                        <tr key={m.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-2 min-w-[200px]">
                            <Select value={m.role} onValueChange={v => updateTeamMember(m.id, "role", v)} disabled={concluded}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TEAM_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2 min-w-[160px]">
                            <Input className="h-8 text-xs" value={m.name} onChange={e => updateTeamMember(m.id, "name", e.target.value)} placeholder="Full name, credentials" disabled={concluded} />
                          </td>
                          <td className="px-4 py-2 min-w-[200px]">
                            <Input className="h-8 text-xs" value={m.experience} onChange={e => updateTeamMember(m.id, "experience", e.target.value)} placeholder="Years of experience, specialization" disabled={concluded} />
                          </td>
                          {!concluded && (
                            <td className="px-4 py-2">
                              <button onClick={() => removeTeamMember(m.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!concluded && (
                  <button
                    onClick={addTeamMember}
                    className="mt-3 inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-md border border-dashed border-border hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add team member
                  </button>
                )}
              </div>
            </div>

            {/* ── Section 5: Budget ── */}
            <div className={cardShell}>
              <div className={cardHeader}>
                <span className="text-sm font-semibold text-foreground">5. Budget</span>
                <Badge variant={s5Done ? "success" : "secondary"}>{s5Done ? "Complete" : "Pending"}</Badge>
                {engMeta?.budget && <Badge variant="secondary" className="text-xs">Auto-populated from engagement</Badge>}
              </div>
              <div className={`${cardBody} grid grid-cols-3 gap-4`}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Budgeted Fee ($)</label>
                  <Input className={inputCls} value={budgetFee} onChange={e => setBudgetFee(e.target.value)} placeholder="0.00" disabled={concluded} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Estimated Hours</label>
                  <Input className={inputCls} value={budgetHours} onChange={e => setBudgetHours(e.target.value)} placeholder="0" disabled={concluded} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Form 450 Reference</label>
                  <div className="h-9 flex items-center text-sm text-muted-foreground px-1">Detailed time budget — Form 450</div>
                </div>
                <div className="col-span-3 flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Budget Notes</label>
                  <Textarea className="text-sm resize-none min-h-[56px]" value={budgetNotes} onChange={e => setBudgetNotes(e.target.value)} placeholder="Additional budget notes…" disabled={concluded} />
                </div>
              </div>
            </div>

            {/* ── Section 6: Audit Strategy ── */}
            <div className={cardShell}>
              <div className={cardHeader}>
                <span className="text-sm font-semibold text-foreground">6. Audit Strategy</span>
                <Badge variant={s6Done ? "success" : "secondary"}>{s6Done ? "Complete" : "Pending"}</Badge>
              </div>
              <div className={cardBody}>
                <Textarea
                  className="text-sm resize-none min-h-[96px]"
                  value={auditStrategy}
                  onChange={e => setAuditStrategy(e.target.value)}
                  placeholder="Provide a cross-reference to documents that outline the planned scope and timing of the audit, including communications with management and those charged with governance…"
                  disabled={concluded}
                />
              </div>
            </div>

            {/* ── Subsequent Changes ── */}
            <div className={cardShell}>
              <div className={cardHeader}>
                <span className="text-sm font-semibold text-foreground">Subsequent Changes in Strategy</span>
              </div>
              <div className={cardBody}>
                <Textarea
                  className="text-sm resize-none min-h-[80px]"
                  value={subsequentChanges}
                  onChange={e => setSubsequentChanges(e.target.value)}
                  placeholder="Outline any significant changes made to the original audit strategy for this period as a result of performing further procedures or obtaining new information…"
                  disabled={concluded}
                />
              </div>
            </div>

            {/* ── Sign-offs + Conclusion + Conclude ── */}
            <div className={cardShell}>
              <div className={cardHeader}>
                <span className="text-sm font-semibold text-foreground">Sign-offs</span>
                <Badge variant="secondary">{signOffs.length} reviewer{signOffs.length !== 1 ? "s" : ""}</Badge>
              </div>
              <div className={cardBody}>
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground uppercase tracking-wider">Name</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground uppercase tracking-wider w-44">Role</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground uppercase tracking-wider w-24">Initials</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-foreground uppercase tracking-wider w-36">Date</th>
                        {!concluded && <th className="w-10 px-4 py-2.5" />}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {signOffs.map(s => (
                        <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-2">
                            <Input className="h-8 text-xs" value={s.name} onChange={e => updateSignOff(s.id, "name", e.target.value)} placeholder="Full name" disabled={concluded} />
                          </td>
                          <td className="px-4 py-2">
                            <Select value={s.role} onValueChange={v => updateSignOff(s.id, "role", v)} disabled={concluded}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {["Prepared by", "Reviewed by", "Approved by", "EQCR", "Partner", "Manager"].map(r => (
                                  <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2">
                            <Input className="h-8 text-xs" value={s.initials} onChange={e => updateSignOff(s.id, "initials", e.target.value)} placeholder="JD" disabled={concluded} />
                          </td>
                          <td className="px-4 py-2">
                            <Input className="h-8 text-xs" type="date" value={s.date} onChange={e => updateSignOff(s.id, "date", e.target.value)} disabled={concluded} />
                          </td>
                          {!concluded && (
                            <td className="px-4 py-2">
                              <button onClick={() => removeSignOff(s.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!concluded && (
                  <button
                    onClick={addSignOff}
                    className="mt-3 inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-md border border-dashed border-border hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add reviewer
                  </button>
                )}

                {/* Conclusion + Conclude */}
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-xs font-medium text-muted-foreground">Conclusion</label>
                    <Textarea
                      className="text-sm resize-none min-h-[72px]"
                      value={conclusion}
                      onChange={e => setConclusion(e.target.value)}
                      placeholder="Summarize the overall audit strategy and confirm that the strategy is appropriate for this engagement…"
                      disabled={concluded}
                    />
                  </div>
                  {!concluded ? (
                    <Button onClick={handleConclude} className="gap-2">
                      <Check className="h-4 w-4" />
                      Conclude Overall Audit Strategy
                    </Button>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md text-sm text-green-800 dark:text-green-400">
                      <Check className="h-4 w-4" />
                      Concluded by {concludedBy} on {concludedOn}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ImportProgressBar() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(100), 50);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#1C63A6] to-[#7A31D8] rounded-full transition-all duration-[2400ms] ease-linear"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function ImportStepController({ importStep, setImportStep }: { importStep: number; setImportStep: (n: number) => void }) {
  useEffect(() => {
    if (importStep === 1) {
      const t = setTimeout(() => setImportStep(2), 1500);
      return () => clearTimeout(t);
    }
    if (importStep === 2) {
      const t = setTimeout(() => setImportStep(3), 2500);
      return () => clearTimeout(t);
    }
  }, [importStep, setImportStep]);
  return null;
}
