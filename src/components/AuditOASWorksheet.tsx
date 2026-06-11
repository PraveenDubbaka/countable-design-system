import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, X, Plus, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { loadEngagements, getEngagementMeta } from "@/store/engagementsStore";

// ── Types ──────────────────────────────────────────────────────────────────────

interface RowState { response: string; wpRef: string; initials: string; date: string; }
interface AreaRow extends RowState { relevant: boolean; }
interface TeamRow { id: string; role: string; name: string; experience: string; wpRef: string; initials: string; date: string; }
interface SignOff { id: string; name: string; role: string; initials: string; date: string; }

// ── Constants ──────────────────────────────────────────────────────────────────

const TEAM_ROLES = [
  "Engagement Partner", "Manager", "Senior Auditor", "Staff Auditor / Assistant",
  "EQCR (Quality Reviewer)", "Tax Reviewer", "Subject Matter Expert (SME)", "Other",
];

const S2_LABELS = [
  "Entity's reporting deadlines (if any).",
  "Team planning discussions.",
  "Planned fieldwork start / end.",
  "File reviews (including EQCR).",
  "Meetings with management and TCWG.",
  "Other (specify).",
];

const S3_LABELS = [
  "Material financial statement areas and disclosures.",
  "Major operational or control changes during the period.",
  "Impact of changes in accounting standards.",
  "Matters raised from past experience (prior-year findings).",
  "Significant risks and going-concern uncertainties.",
  "Use of auditor's experts.",
  "Use of service organization reports.",
  "Use of component auditors.",
  "Coordination of work with a group auditor.",
  "Need for stand-alone audited financial statements of subsidiaries.",
  "Key audit matters (where applicable).",
];

// ── Mock seed data ─────────────────────────────────────────────────────────────

function emptyRow(): RowState { return { response: "", wpRef: "", initials: "", date: "" }; }
function seedRow(response: string): RowState { return { response, wpRef: "", initials: "", date: "" }; }
function areaRow(relevant: boolean, response = ""): AreaRow { return { relevant, response, wpRef: "", initials: "", date: "" }; }

let _uid = 0;
const uid = () => `r${++_uid}`;

const CA_SEED = {
  entity: "Shipping Line Inc.",
  period: "March 31, 2024",
  framework: "Canadian Accounting Standards for Private Enterprises (ASPE) — CPA Canada Handbook Part II",
  s1: [
    seedRow("Canadian Accounting Standards for Private Enterprises (ASPE) — CPA Canada Handbook Part II"),
    seedRow("Marine freight and shipping — Transport Canada regulations, cross-border customs compliance"),
  ],
  s2: [
    seedRow("Draft FS to management by May 31, 2024. Final report by June 14, 2024."),
    seedRow("Planning meeting held April 8, 2024. Attendees: J. Patel (Partner), A. Nguyen (Manager), T. Brown (Senior), D. Kim (Staff), P. Singh (CFO), C. Okafor (Controller)."),
    seedRow("April 8 – May 10, 2024"),
    seedRow("Manager review: ongoing. Partner review: May 15, 2024. EQCR: May 17, 2024."),
    seedRow("Interim: April 10, 2024. Completion: May 20, 2024."),
    emptyRow(),
  ],
  s3: [
    areaRow(true,  "Revenue $12.6M, PP&E $4.2M, Long-term Debt $3.1M, AR $1.8M. See Form 590."),
    areaRow(true,  "New vessel charter agreement ($2.1M), refinanced credit facility, fleet expansion (2 vessels added)."),
    areaRow(true,  "No new ASPE standards effective for this period. Review ASPE 3065 for new lease terms."),
    areaRow(true,  "Prior year: minor AR cut-off adjustment ($42K). Management addressed through improved invoicing."),
    areaRow(true,  "Revenue recognition (ASPE 3400) — significant risk. Management override — presumed risk (CAS 240). Going concern — monitor leverage. See Form 540."),
    areaRow(false, "N/A"),
    areaRow(false, "N/A"),
    areaRow(false, "N/A — single entity"),
    areaRow(false, "N/A"),
    areaRow(false, "N/A"),
    areaRow(false, "N/A — private company audit, ASPE. Not applicable."),
  ],
  teamRows: [
    { id: "t1", role: "Engagement Partner",       name: "J. Patel, CPA",   experience: "15 years experience", wpRef: "", initials: "", date: "" },
    { id: "t2", role: "Manager",                  name: "A. Nguyen, CPA",  experience: "7 years experience",  wpRef: "", initials: "", date: "" },
    { id: "t3", role: "Senior Auditor",           name: "T. Brown",        experience: "3 years experience",  wpRef: "", initials: "", date: "" },
    { id: "t4", role: "Staff Auditor / Assistant",name: "D. Kim",          experience: "1 year experience",   wpRef: "", initials: "", date: "" },
    { id: "t5", role: "EQCR (Quality Reviewer)",  name: "S. Lavoie, CPA", experience: "Independent reviewer", wpRef: "", initials: "", date: "" },
  ] as TeamRow[],
  s5: seedRow("Budgeted fee: $31,000. Estimated hours: 195. See Form 450 for detailed time budget."),
  s6: seedRow("Audit plan documented in Forms 500-590. TCWG planning communication: Letter AL3.1 sent April 9, 2024."),
  subseq: emptyRow(),
  signOffs: [
    { id: "so1", name: "A. Nguyen",  role: "Prepared by",  initials: "AN", date: "2024-04-09" },
    { id: "so2", name: "J. Patel",   role: "Reviewed by",  initials: "JP", date: "2024-04-10" },
  ] as SignOff[],
};

const US_SEED = {
  entity: "Harbor Freight Logistics LLC",
  period: "December 31, 2024",
  framework: "US GAAP — Financial Accounting Standards Board (FASB) Accounting Standards Codification (ASC)",
  s1: [
    seedRow("US GAAP — Financial Accounting Standards Board (FASB) Accounting Standards Codification (ASC)"),
    seedRow("Freight logistics and warehousing — DOT/FMCSA regulations, multi-state operations"),
  ],
  s2: [
    seedRow("Draft FS to management by February 28, 2025. Final report by March 15, 2025."),
    seedRow("Planning meeting held January 20, 2025. Attendees: M. Thompson (Partner), L. Garcia (Manager), K. Patel (Senior), J. Chen (Staff), R. Morrison (CFO), S. Williams (Controller)."),
    seedRow("January 20 – February 7, 2025"),
    seedRow("Manager review: ongoing. Partner review: February 10, 2025. EQCR: February 12, 2025."),
    seedRow("Interim: January 22, 2025. Completion: February 14, 2025."),
    emptyRow(),
  ],
  s3: [
    areaRow(true,  "Revenue $18.4M, ROU Assets $2.8M (ASC 842), Goodwill $1.42M, Long-term Debt $4.32M, AR $2.1M. See Form 590."),
    areaRow(true,  "ASC 842 lease adoption (first year), new $5M credit facility, new Controller (S. Williams, July 2024), new AP ERP module."),
    areaRow(true,  "ASC 842 Leases — first-year adoption effective January 1, 2024. Three operating leases capitalized."),
    areaRow(true,  "First-year engagement. No predecessor findings received."),
    areaRow(true,  "Revenue recognition (ASC 606) — significant risk. Management override — presumed risk. Goodwill impairment (ASC 350) — elevated. See Form 540."),
    areaRow(true,  "Valuation specialist for goodwill impairment assessment — Summit Valuation Group."),
    areaRow(true,  "ADP Workforce Now (payroll) — SOC 1 Type II report obtained."),
    areaRow(false, "N/A — single entity"),
    areaRow(false, "N/A"),
    areaRow(false, "N/A"),
    areaRow(false, "N/A — private company audit (AICPA non-issuer). CAMs not required."),
  ],
  teamRows: [
    { id: "t1", role: "Engagement Partner",       name: "M. Thompson, CPA",  experience: "18 years experience",   wpRef: "", initials: "", date: "" },
    { id: "t2", role: "Manager",                  name: "L. Garcia, CPA",    experience: "9 years experience",    wpRef: "", initials: "", date: "" },
    { id: "t3", role: "Senior Auditor",           name: "K. Patel",          experience: "4 years experience",    wpRef: "", initials: "", date: "" },
    { id: "t4", role: "Staff Auditor / Assistant",name: "J. Chen",           experience: "1 year experience",     wpRef: "", initials: "", date: "" },
    { id: "t5", role: "Subject Matter Expert (SME)", name: "Summit Valuation Group", experience: "Goodwill impairment", wpRef: "", initials: "", date: "" },
    { id: "t6", role: "EQCR (Quality Reviewer)",  name: "D. Anderson, CPA",  experience: "Independent reviewer",  wpRef: "", initials: "", date: "" },
  ] as TeamRow[],
  s5: seedRow("Budgeted fee: $42,500. Estimated hours: 280. See Form 450 for detailed time budget."),
  s6: seedRow("Audit plan documented in Forms 500-590. TCWG planning communication: Letter AL3.1 sent January 22, 2025."),
  subseq: emptyRow(),
  signOffs: [
    { id: "so1", name: "L. Garcia",   role: "Prepared by",  initials: "LG", date: "2025-01-21" },
    { id: "so2", name: "M. Thompson", role: "Reviewed by",  initials: "MT", date: "2025-01-22" },
  ] as SignOff[],
};

// ── Wrapper ────────────────────────────────────────────────────────────────────

export function AuditOASWorksheet({ isUS }: { isUS?: boolean }) {
  return <WorksheetInner key={isUS ? "us" : "ca"} isUS={!!isUS} />;
}

// ── Inner ──────────────────────────────────────────────────────────────────────

function WorksheetInner({ isUS }: { isUS: boolean }) {
  const { engagementId = "" } = useParams<{ engagementId: string }>();
  const storageKey = `audit-oas-data-${engagementId || (isUS ? "us" : "ca")}`;

  const engMeta  = engagementId ? getEngagementMeta(engagementId) : null;
  const engRecord = loadEngagements().find(e => e.id === engagementId);
  const seed = isUS ? US_SEED : CA_SEED;
  const standardRef = isUS ? "(AU-C 300)" : "(CAS 300.7-8)";

  const saved = readJsonFromLocalStorage<Record<string, unknown>>(storageKey, {});
  function get<T>(key: string, fallback: T): T {
    return (key in saved ? saved[key] : fallback) as T;
  }

  // Auto-populate framework from engagement meta if available
  const autoFramework = engMeta?.accountingFramework
    ? `${engMeta.accountingFramework}${engMeta.accountingStandards ? ` — ${engMeta.accountingStandards}` : ""}`
    : "";

  // ── State ──────────────────────────────────────────────────────────────────
  const [entity,    setEntity]    = useState(get("entity",    engRecord?.client ?? seed.entity));
  const [period,    setPeriod]    = useState(get("period",    engRecord?.yearEnd ?? seed.period));

  const makeS1Default = () => {
    const rows = seed.s1.map(r => ({ ...r }));
    if (autoFramework) rows[0].response = autoFramework;
    if (engMeta?.industry) rows[1].response = `${engMeta.industry} — `;
    return rows;
  };
  const [s1, setS1] = useState<RowState[]>(get("s1", makeS1Default()));
  const [s2, setS2] = useState<RowState[]>(get("s2", seed.s2.map(r => ({ ...r }))));
  const [s3, setS3] = useState<AreaRow[]>(get("s3", seed.s3.map(r => ({ ...r }))));
  const [teamRows, setTeamRows] = useState<TeamRow[]>(get("teamRows", seed.teamRows.map(r => ({ ...r }))));

  const makeS5Default = () => {
    const r = { ...seed.s5 };
    if (engMeta?.budget) r.response = `Budgeted fee: $${parseFloat(engMeta.budget).toLocaleString()}. Estimated hours: —. See Form 450.`;
    return r;
  };
  const [s5,     setS5]     = useState<RowState>(get("s5",     makeS5Default()));
  const [s6,     setS6]     = useState<RowState>(get("s6",     { ...seed.s6 }));
  const [subseq, setSubseq] = useState<RowState>(get("subseq", { ...seed.subseq }));

  const [signOffs, setSignOffs] = useState<SignOff[]>(get("signOffs", seed.signOffs.map(s => ({ ...s }))));

  const [meetingImported, setMeetingImported] = useState(get("meetingImported", false));
  const [importStep,      setImportStep]      = useState(0);

  const [concluded,   setConcluded]   = useState(get("concluded",   false));
  const [concludedBy, setConcludedBy] = useState(get("concludedBy", ""));
  const [concludedOn, setConcludedOn] = useState(get("concludedOn", ""));

  const locked = concluded;

  // ── Persistence ────────────────────────────────────────────────────────────
  const firstRender = useRef(true);
  const snap = { entity, period, s1, s2, s3, teamRows, s5, s6, subseq, signOffs, meetingImported, concluded, concludedBy, concludedOn };
  const snapRef = useRef(snap);
  snapRef.current = snap;

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, snapRef.current), 450);
    return () => clearTimeout(t);
  }, [entity, period, s1, s2, s3, teamRows, s5, s6, subseq, signOffs, meetingImported, concluded, concludedBy, concludedOn, storageKey]);

  // ── Row updaters ───────────────────────────────────────────────────────────
  function updRow(setter: React.Dispatch<React.SetStateAction<RowState[]>>, i: number, f: keyof RowState, v: string) {
    setter(prev => { const n = [...prev]; n[i] = { ...n[i], [f]: v }; return n; });
  }
  function updSingle(setter: React.Dispatch<React.SetStateAction<RowState>>, f: keyof RowState, v: string) {
    setter(prev => ({ ...prev, [f]: v }));
  }
  function updTeam(id: string, f: keyof TeamRow, v: string) {
    setTeamRows(prev => prev.map(r => r.id === id ? { ...r, [f]: v } : r));
  }
  function addTeamRow() {
    setTeamRows(prev => [...prev, { id: uid(), role: TEAM_ROLES[0], name: "", experience: "", wpRef: "", initials: "", date: "" }]);
  }
  function removeTeamRow(id: string) {
    setTeamRows(prev => prev.filter(r => r.id !== id));
  }
  function updSignOff(id: string, f: keyof SignOff, v: string) {
    setSignOffs(prev => prev.map(s => s.id === id ? { ...s, [f]: v } : s));
  }
  function addSignOff() {
    setSignOffs(prev => [...prev, { id: uid(), name: "", role: "Reviewed by", initials: "", date: "" }]);
  }
  function removeSignOff(id: string) {
    setSignOffs(prev => prev.filter(s => s.id !== id));
  }

  // ── Conclude ───────────────────────────────────────────────────────────────
  function handleConclude() {
    const today = new Date().toLocaleDateString("en-CA");
    const by = signOffs.find(s => s.role === "Prepared by")?.name || signOffs[0]?.name || "Auditor";
    setConcluded(true); setConcludedBy(by); setConcludedOn(today);
    writeJsonToLocalStorage(storageKey, { ...snapRef.current, concluded: true, concludedBy: by, concludedOn: today });
    toast.success("Overall Audit Strategy concluded.");
  }

  // ── Import Meeting Notes ───────────────────────────────────────────────────
  function handleConfirmImport() {
    setImportStep(0); setMeetingImported(true);
    setS2(prev => { const n = [...prev]; n[1] = { ...n[1], response: seed.s2[1].response }; return n; });
    setTeamRows(seed.teamRows.map(r => ({ ...r })));
    toast.success("Meeting notes imported. Team planning discussion and audit team sections populated.");
  }

  useEffect(() => {
    if (importStep === 1) { const t = setTimeout(() => setImportStep(2), 1500); return () => clearTimeout(t); }
    if (importStep === 2) { const t = setTimeout(() => setImportStep(3), 2500); return () => clearTimeout(t); }
  }, [importStep]);

  // ── Render helpers ─────────────────────────────────────────────────────────

  function SectionHeader({ label }: { label: string }) {
    return (
      <tr className="bg-muted/60">
        <td className="px-3 py-2.5 text-sm font-bold text-foreground" colSpan={5}>{label}</td>
      </tr>
    );
  }

  function SubNote({ text }: { text: string }) {
    return (
      <tr className="bg-muted/20">
        <td className="px-3 py-1" /><td className="px-4 py-1.5 text-xs text-muted-foreground italic" colSpan={4}>{text}</td>
      </tr>
    );
  }

  function DataRow({ num, description, row, onRow, extra, locked: rowLocked }: {
    num: string; description: React.ReactNode;
    row: RowState; onRow: (f: keyof RowState, v: string) => void;
    extra?: React.ReactNode; locked?: boolean;
  }) {
    const dis = rowLocked ?? locked;
    return (
      <tr className="hover:bg-muted/50 transition-colors border-b border-border/40">
        <td className="px-3 py-2.5 text-xs text-muted-foreground font-mono align-top whitespace-nowrap w-10">{num}</td>
        <td className="px-4 py-2.5 text-sm text-foreground align-top">{description}</td>
        <td className="px-3 py-2 align-top w-20">
          <Input className="h-7 text-xs w-16 text-center" value={row.wpRef} onChange={e => onRow("wpRef", e.target.value)} placeholder="—" disabled={dis} />
        </td>
        <td className="px-3 py-2 align-top min-w-[280px]">
          <Textarea className="min-h-[56px] text-sm resize-none" value={row.response} onChange={e => onRow("response", e.target.value)} disabled={dis} />
          {extra && <div className="mt-1.5">{extra}</div>}
        </td>
        <td className="px-3 py-2 align-top w-32">
          <div className="flex flex-col gap-1">
            <Input className="h-6 text-xs" placeholder="Initials" value={row.initials} onChange={e => onRow("initials", e.target.value)} disabled={dis} />
            <Input className="h-6 text-xs" type="date" value={row.date} onChange={e => onRow("date", e.target.value)} disabled={dis} />
          </div>
        </td>
      </tr>
    );
  }

  // ── JSX ────────────────────────────────────────────────────────────────────
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
                    {["6 Attendees identified", "Team planning discussion extracted", "Audit team roles populated"].map(item => (
                      <div key={item} className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                        <Check className="h-4 w-4 text-green-600" /><span className="text-sm text-green-800 dark:text-green-400">{item}</span>
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
                    <div className="px-3 py-2 bg-muted border-b border-border"><p className="text-xs font-semibold text-foreground uppercase tracking-wider">Team Planning Discussion (§2.2)</p></div>
                    <div className="px-3 py-2 space-y-1">
                      <div className="flex gap-2 text-sm"><span className="text-muted-foreground w-28 shrink-0">Date:</span><span className="text-foreground">{isUS ? "January 20, 2025" : "April 8, 2024"}</span></div>
                      <div className="flex gap-2 text-sm"><span className="text-muted-foreground w-28 shrink-0">Attendees:</span><span className="text-foreground">{isUS ? "M. Thompson, L. Garcia, K. Patel, J. Chen, R. Morrison, S. Williams" : "J. Patel, A. Nguyen, T. Brown, D. Kim, P. Singh, C. Okafor"}</span></div>
                    </div>
                  </div>
                  <div className="rounded-md border border-border overflow-hidden">
                    <div className="px-3 py-2 bg-muted border-b border-border"><p className="text-xs font-semibold text-foreground uppercase tracking-wider">Audit Team (§4)</p></div>
                    <div className="px-3 py-2 space-y-1">
                      {seed.teamRows.map(m => (
                        <div key={m.id} className="flex gap-2 text-sm"><span className="text-muted-foreground w-28 shrink-0">{m.role.split(" (")[0]}:</span><span className="text-foreground">{m.name} — {m.experience}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6 flex gap-3 justify-end border-t border-border pt-4">
                  <Button variant="outline" onClick={() => setImportStep(3)}>← Back</Button>
                  <Button onClick={handleConfirmImport} className="bg-green-600 hover:bg-green-700 text-white"><Check className="h-4 w-4 mr-1" />Confirm &amp; Import</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6">

          {/* Concluded banner */}
          {concluded && (
            <div className="mb-5 flex items-center gap-3 px-5 py-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
              <Check className="h-4 w-4 text-green-600 shrink-0" />
              <span className="text-sm font-medium text-green-800 dark:text-green-400">Concluded by {concludedBy} on {concludedOn} — this worksheet is read-only.</span>
            </div>
          )}

          {/* Main card */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">

            {/* Card header */}
            <div className="px-6 py-4 border-b border-border bg-card">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground w-24 shrink-0">Entity:</span>
                  <Input className="h-8 text-sm flex-1" value={entity} onChange={e => setEntity(e.target.value)} disabled={locked} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground w-24 shrink-0">Period ended:</span>
                  <Input className="h-8 text-sm flex-1" value={period} onChange={e => setPeriod(e.target.value)} disabled={locked} />
                </div>
                <div className="col-span-2 flex items-start gap-3">
                  <span className="text-xs font-semibold text-muted-foreground w-24 shrink-0 pt-0.5">Objective:</span>
                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">To document the scope, timing and direction of the audit as a guide for the development of the audit plan.</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">Reference: {standardRef}</span>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-muted/50 rounded text-xs text-muted-foreground">
                <span className="font-semibold">Legend:</span> EQCR = Engagement quality control review. TCWG = Those charged with governance.
                {(autoFramework || engMeta?.budget) && <span className="ml-3 text-primary/70">• Auto-populated from engagement setup</span>}
              </div>
            </div>

            {/* Main table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted border-b border-border">
                    <th className="w-10 px-3 py-2.5 text-left text-xs font-semibold text-foreground uppercase">#</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase">Description</th>
                    <th className="w-20 px-3 py-2.5 text-center text-xs font-semibold text-foreground uppercase">W/P Ref.</th>
                    <th className="w-80 px-3 py-2.5 text-left text-xs font-semibold text-foreground uppercase">Responses and Comments</th>
                    <th className="w-32 px-3 py-2.5 text-center text-xs font-semibold text-foreground uppercase">Initials / Date</th>
                  </tr>
                </thead>
                <tbody>

                  {/* Section 1 */}
                  <SectionHeader label="1. Reporting Requirements" />
                  <DataRow num="1.1" description="The applicable financial reporting framework (such as ASPE or IFRS)." row={s1[0]} onRow={(f,v) => updRow(setS1,0,f,v)} />
                  <DataRow num="1.2" description="Industry-specific or specialized requirements." row={s1[1]} onRow={(f,v) => updRow(setS1,1,f,v)} />

                  {/* Section 2 */}
                  <SectionHeader label="2. Timing" />
                  {S2_LABELS.map((label, i) => (
                    <DataRow
                      key={i} num={`2.${i+1}`} description={label}
                      row={s2[i]} onRow={(f,v) => updRow(setS2,i,f,v)}
                      extra={i === 1 ? (
                        meetingImported
                          ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"><Check className="h-3 w-3" /> Imported</span>
                          : !locked && <button onClick={() => setImportStep(1)} className="h-7 px-2.5 rounded-full bg-gradient-to-r from-[#1C63A6] to-[#7A31D8] text-white text-xs font-medium flex items-center gap-1.5 shadow-sm hover:from-[#1a5a96] hover:to-[#6a2bc2]"><Sparkles className="h-3 w-3" />Import Meeting Notes</button>
                      ) : undefined}
                    />
                  ))}

                  {/* Section 3 */}
                  <SectionHeader label="3. Factors to Consider in the Audit" />
                  <SubNote text="Identify key areas to be addressed in the audit:" />
                  {S3_LABELS.map((label, i) => (
                    <DataRow
                      key={i} num={`3.${i+1}`}
                      description={
                        <div className="flex items-start gap-2.5">
                          <Checkbox
                            checked={s3[i].relevant}
                            onCheckedChange={v => !locked && setS3(prev => prev.map((a,j) => j===i ? { ...a, relevant: !!v } : a))}
                            className="mt-0.5 shrink-0"
                            disabled={locked}
                          />
                          <span className={s3[i].relevant ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                        </div>
                      }
                      row={s3[i]} onRow={(f,v) => setS3(prev => prev.map((a,j) => j===i ? { ...a, [f]: v } : a))}
                    />
                  ))}

                  {/* Section 4 — Audit Team (dynamic) */}
                  <SectionHeader label="4. Audit Team" />
                  <SubNote text="Assign appropriately experienced team members to areas with higher risk of material misstatement." />
                  {teamRows.map((row, i) => (
                    <tr key={row.id} className="hover:bg-muted/50 transition-colors border-b border-border/40">
                      <td className="px-3 py-2.5 text-xs text-muted-foreground font-mono align-top whitespace-nowrap">{`4.${i+1}`}</td>
                      <td className="px-4 py-2 align-top min-w-[180px]">
                        <Select value={row.role} onValueChange={v => updTeam(row.id,"role",v)} disabled={locked}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>{TEAM_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                        </Select>
                      </td>
                      <td className="px-3 py-2 align-top w-20">
                        <Input className="h-7 text-xs w-16 text-center" value={row.wpRef} onChange={e => updTeam(row.id,"wpRef",e.target.value)} placeholder="—" disabled={locked} />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="flex flex-col gap-1">
                          <Input className="h-7 text-xs" placeholder="Name, credentials" value={row.name} onChange={e => updTeam(row.id,"name",e.target.value)} disabled={locked} />
                          <div className="flex gap-1">
                            <Input className="h-7 text-xs flex-1" placeholder="Experience / notes" value={row.experience} onChange={e => updTeam(row.id,"experience",e.target.value)} disabled={locked} />
                            {!locked && <button onClick={() => removeTeamRow(row.id)} className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors rounded shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top w-32">
                        <div className="flex flex-col gap-1">
                          <Input className="h-6 text-xs" placeholder="Initials" value={row.initials} onChange={e => updTeam(row.id,"initials",e.target.value)} disabled={locked} />
                          <Input className="h-6 text-xs" type="date" value={row.date} onChange={e => updTeam(row.id,"date",e.target.value)} disabled={locked} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!locked && (
                    <tr>
                      <td colSpan={5} className="px-4 py-2.5">
                        <button onClick={addTeamRow} className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                          <Plus className="h-3.5 w-3.5" />Add team member
                        </button>
                      </td>
                    </tr>
                  )}

                  {/* Section 5 */}
                  <SectionHeader label="5. Budget" />
                  <DataRow num="5.1" description="Establish the budgeted audit fee and labour hours (Form 450)." row={s5} onRow={(f,v) => updSingle(setS5,f,v)} />

                  {/* Section 6 */}
                  <SectionHeader label="6. Audit Strategy" />
                  <DataRow num="6.1" description="Provide a cross-reference to documents that outline the planned scope and timing of the audit, such as the communication with management and to TCWG." row={s6} onRow={(f,v) => updSingle(setS6,f,v)} />

                  {/* Subsequent Changes */}
                  <tr className="bg-muted">
                    <td className="px-3 py-3 text-sm font-bold text-foreground uppercase tracking-wide" colSpan={5}>Subsequent Changes in Strategy</td>
                  </tr>
                  <DataRow
                    num="" description="Outline any significant changes made to the original audit strategy for this period as a result of performing further procedures or obtaining new information."
                    row={subseq} onRow={(f,v) => updSingle(setSubseq,f,v)}
                  />

                </tbody>
              </table>
            </div>

            {/* Card footer — sign-offs + conclude */}
            <div className="px-6 py-5 border-t border-border bg-muted/20">

              {/* Dynamic sign-offs */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sign-offs</span>
                  {!locked && <button onClick={addSignOff} className="inline-flex items-center gap-1 text-xs text-primary hover:underline"><Plus className="h-3 w-3" />Add reviewer</button>}
                </div>
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="text-left px-4 py-2 text-xs font-semibold text-foreground uppercase tracking-wider">Name</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-foreground uppercase tracking-wider w-36">Role</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-foreground uppercase tracking-wider w-20">Initials</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-foreground uppercase tracking-wider w-36">Date</th>
                        {!locked && <th className="w-8 px-3 py-2" />}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {signOffs.map(s => (
                        <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-1.5"><Input className="h-7 text-xs" value={s.name} onChange={e => updSignOff(s.id,"name",e.target.value)} placeholder="Full name" disabled={locked} /></td>
                          <td className="px-4 py-1.5">
                            <Select value={s.role} onValueChange={v => updSignOff(s.id,"role",v)} disabled={locked}>
                              <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>{["Prepared by","Reviewed by","Approved by","EQCR","Partner","Manager"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-1.5"><Input className="h-7 text-xs" value={s.initials} onChange={e => updSignOff(s.id,"initials",e.target.value)} placeholder="JD" disabled={locked} /></td>
                          <td className="px-4 py-1.5"><Input className="h-7 text-xs" type="date" value={s.date} onChange={e => updSignOff(s.id,"date",e.target.value)} disabled={locked} /></td>
                          {!locked && <td className="px-3 py-1.5"><button onClick={() => removeSignOff(s.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button></td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conclude */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Overall audit strategy — OAS</span>
                {!locked
                  ? <Button onClick={handleConclude}><Check className="h-4 w-4 mr-1.5" />Conclude Worksheet</Button>
                  : <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md text-sm text-green-800 dark:text-green-400"><Check className="h-4 w-4" />Concluded by {concludedBy} on {concludedOn}</div>
                }
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
  useEffect(() => { const t = setTimeout(() => setWidth(100), 50); return () => clearTimeout(t); }, []);
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-[#1C63A6] to-[#7A31D8] rounded-full transition-all duration-[2400ms] ease-linear" style={{ width: `${width}%` }} />
    </div>
  );
}
