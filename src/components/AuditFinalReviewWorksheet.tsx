import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckSquare, Square, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENT_USER } from "@/lib/useTimeEntries";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { WorksheetLayout, WorksheetHeader } from "@/components/audit/WorksheetShell";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { loadEngagements } from "@/store/engagementsStore";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CheckState {
  [key: string]: boolean;
}

interface FinalReviewData {
  checks: CheckState;
  clientSignoffDate: string;
  clientSignoffNote: string;
  finalSignoffDone: boolean;
  finalSignoffAt: string;
  packagerName: string;
  packagerInstructions: string;
  packagerDueDate: string;
  packagerAssigned: boolean;
}

function buildDefault(): FinalReviewData {
  return {
    checks: {},
    clientSignoffDate: "",
    clientSignoffNote: "",
    finalSignoffDone: false,
    finalSignoffAt: "",
    packagerName: "",
    packagerInstructions: "",
    packagerDueDate: "",
    packagerAssigned: false,
  };
}

// ── Team roles ────────────────────────────────────────────────────────────────

const ROLE_CONFIG = [
  { key: "preparer", label: "Preparer",            roleMatch: "Senior Auditor",     color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"     },
  { key: "partner",  label: "Partner",              roleMatch: "Engagement Partner", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
  { key: "qcr",      label: "Quality Reviewer",     roleMatch: "EQCR",              color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
  { key: "admin",    label: "Admin / Tax Reviewer", roleMatch: "Manager",            color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"     },
];

function initials(name: string): string {
  return name.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

function getTeamMember(team: { role: string; name: string }[], roleMatch: string): string {
  return team.find(m => m.role.includes(roleMatch))?.name ?? roleMatch;
}

// ── Simple checkbox for checklist sub-items ───────────────────────────────────

function Cb({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className="flex items-center justify-center w-5 h-5 rounded border border-border bg-background hover:border-primary/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      aria-checked={checked}
      role="checkbox"
    >
      {checked ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4 text-muted-foreground/40" />}
    </button>
  );
}

// ── Row helpers ────────────────────────────────────────────────────────────────

const TH = "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/20";
const TD = "px-4 py-2.5 text-sm text-foreground border-b border-border";
const SEC_HEAD = "px-4 py-2 bg-muted/30 border-b border-border text-sm font-semibold text-foreground";

// ── Multi-role team cell ──────────────────────────────────────────────────────

interface MultiRoleCellProps {
  sectionKey: string;
  checks: CheckState;
  toggle: (key: string) => void;
  team: { role: string; name: string }[];
  showSignoffBtn?: boolean;
  onSignoff?: () => void;
}

function MultiRoleCell({ sectionKey, checks, toggle, team, showSignoffBtn, onSignoff }: MultiRoleCellProps) {
  const signedCount = ROLE_CONFIG.filter(r => checks[`${sectionKey}-${r.key}`]).length;
  const allDone = signedCount === ROLE_CONFIG.length;

  return (
    <div className="space-y-0.5">
      {showSignoffBtn && (
        <div className="mb-1.5">
          <Button
            size="sm"
            variant={allDone ? "outline" : "default"}
            onClick={onSignoff}
            className={allDone ? "border-green-400 text-green-700 hover:bg-green-50 dark:text-green-400 dark:border-green-600" : ""}
          >
            {allDone && <CheckCircle2 className="h-4 w-4" />}
            {allDone ? "Signed off" : "Signoff section"}
          </Button>
        </div>
      )}
      <div className="divide-y divide-border/40">
        {ROLE_CONFIG.map(role => {
          const memberName = getTeamMember(team, role.roleMatch);
          const signed = checks[`${sectionKey}-${role.key}`] ?? false;
          return (
            <div key={role.key} className="flex items-center gap-2 py-1">
              <span className={`h-6 w-6 rounded-full text-[10px] font-semibold flex-shrink-0 inline-flex items-center justify-center ${role.color}`}>
                {initials(memberName)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground leading-tight truncate">{memberName}</div>
                <div className="text-[10px] text-muted-foreground leading-tight">{role.label}</div>
              </div>
              {signed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <Button
                  size="sm"
                  className="h-6 px-2 text-[11px] flex-shrink-0"
                  onClick={() => toggle(`${sectionKey}-${role.key}`)}
                >
                  Sign Off
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionDoneIndicator({ sectionKey, checks }: { sectionKey: string; checks: CheckState }) {
  const signedCount = ROLE_CONFIG.filter(r => checks[`${sectionKey}-${r.key}`]).length;
  if (signedCount === ROLE_CONFIG.length) return <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />;
  if (signedCount > 0) return <span className="text-[11px] font-semibold text-primary">{signedCount}/{ROLE_CONFIG.length}</span>;
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AuditFinalReviewWorksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const storageKey = `audit-fr-final-review-${engagementId ?? "default"}`;

  const engRec = loadEngagements().find(e => e.id === (engagementId ?? "")) ?? null;

  const [data, setData] = useState<FinalReviewData>(
    () => readJsonFromLocalStorage<FinalReviewData>(storageKey, buildDefault()) ?? buildDefault()
  );

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  function upd<K extends keyof FinalReviewData>(key: K, val: FinalReviewData[K]) {
    setData(d => ({ ...d, [key]: val }));
  }

  function toggleCheck(key: string) {
    setData(d => ({ ...d, checks: { ...d.checks, [key]: !d.checks[key] } }));
  }

  function signSection(sectionKey: string) {
    setData(d => {
      const next = { ...d.checks };
      ROLE_CONFIG.forEach(r => { next[`${sectionKey}-${r.key}`] = true; });
      return { ...d, checks: next };
    });
  }

  function signAll() {
    setData(d => {
      const next = { ...d.checks };
      const sections = ["pl", "ra", "rp", "tb", "pr", "issues", "comments", "docs-req", "completion", "client-signoff"];
      sections.forEach(s => {
        ROLE_CONFIG.forEach(r => { next[`${s}-${r.key}`] = true; });
      });
      return { ...d, checks: next };
    });
  }

  function performFinalSignoff() {
    upd("finalSignoffDone", true);
    upd("finalSignoffAt", new Date().toISOString());
  }

  return (
    <WorksheetLayout
      heading="Canada > Completion & Signoffs"
      objective="Final review of the audit engagement — confirm all sections are complete, obtain final signoff, and prepare the engagement package for archiving."
      standard="CAS 220"
    >
      <WorksheetHeader
        ctx={ctx}
        formNo="FR"
        title="Final Review"
        standard="CAS 220"
        overallRisk={undefined}
      />

      {/* ── Engagement Info ────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
        <div className="px-4 py-2.5 bg-muted/20 border-b border-border">
          <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Engagement Info</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <tbody>
              <tr>
                <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase border-b border-border bg-muted/10 w-[160px]">Engagement ID</td>
                <td className="px-4 py-3 text-sm text-foreground border-b border-border border-r border-border/40">{engagementId ?? "—"}</td>
                <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase border-b border-border bg-muted/10 w-[140px]">Engagement Type</td>
                <td className="px-4 py-3 text-sm text-foreground border-b border-border border-r border-border/40">{engRec?.type ?? "—"}</td>
                <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase border-b border-border bg-muted/10 w-[160px]">Accounting Standards</td>
                <td className="px-4 py-3 text-sm text-foreground border-b border-border">Canadian Auditing Standards (CAS)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase bg-muted/10 border-b border-border">Year End Date</td>
                <td className="px-4 py-3 text-sm text-foreground border-b border-border border-r border-border/40">{engRec?.yearEnd ?? ctx.periodEndDisplay ?? "—"}</td>
                <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase bg-muted/10 border-b border-border">Legal Entity Name</td>
                <td className="px-4 py-3 text-sm text-foreground border-b border-border border-r border-border/40">{engRec?.client ?? ctx.entityName ?? "—"}</td>
                <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase bg-muted/10 border-b border-border">Engagement Status</td>
                <td className="px-4 py-3 border-b border-border">
                  {engRec ? (
                    <Badge variant={engRec.statusVariant as Parameters<typeof Badge>[0]["variant"]}>{engRec.status}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Team Info ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
          <div className={SEC_HEAD}>Client Team Info</div>
          <div className="px-4 py-3 text-sm text-foreground">
            <div className="font-semibold">{engRec?.client ?? ctx.entityName ?? "—"}</div>
            <div className="text-muted-foreground text-xs mt-0.5">Client</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
          <div className={SEC_HEAD}>Team Info</div>
          <div className="px-4 py-3 space-y-1.5">
            {ctx.team.length > 0 ? ctx.team.map(member => (
              <div key={member.role} className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary/10 text-[10px] font-semibold inline-flex items-center justify-center text-primary flex-shrink-0">
                  {initials(member.name)}
                </span>
                <div>
                  <div className="text-xs font-medium text-foreground leading-tight">{member.name}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{member.role}</div>
                </div>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground">No team members assigned</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Final Review type ──────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
        <div className={SEC_HEAD}>Final Review *</div>
        <div className="px-4 py-3">
          <Select defaultValue="audit-cas">
            <SelectTrigger className="h-9 text-sm w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="audit-cas">Audit (CAS)</SelectItem>
              <SelectItem value="audit-us">Audit (GAAS)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── File Completion Checklist ─────────────────────────────────── */}
      <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={TH}>File Completion Checklist</th>
              <th className={TH + " w-16 text-center"}>Done</th>
              <th className={TH + " w-80"}>Team</th>
            </tr>
          </thead>
          <tbody>
            {/* Master SignOff All row */}
            <tr className="border-b border-border bg-muted/10">
              <td className={TD + " font-semibold"}>Signoffs Master Sheet</td>
              <td className={TD + " text-center"} />
              <td className={TD}>
                <Button size="sm" onClick={signAll}>
                  <CheckCircle2 className="h-4 w-4" />
                  Signoff All
                </Button>
              </td>
            </tr>

            {/* Client Onboarding — sub-item checklist */}
            <tr className="border-b border-border">
              <td className={SEC_HEAD} colSpan={3}>Client Onboarding Checklist</td>
            </tr>
            {[
              { key: "co-new-accept",  label: "New engagement acceptance" },
              { key: "co-exist-cont",  label: "Existing engagement continuance" },
              { key: "co-eng-letter",  label: "Engagement Letter" },
            ].map(item => (
              <tr key={item.key} className="border-b border-border/50 hover:bg-muted/5">
                <td className={TD + " pl-8"}>
                  <div className="flex items-center gap-2">
                    <Cb checked={!!data.checks[item.key]} onChange={() => toggleCheck(item.key)} />
                    <span>{item.label}</span>
                  </div>
                </td>
                <td className={TD + " text-center"}>
                  {data.checks[item.key] && <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />}
                </td>
                <td className={TD} />
              </tr>
            ))}

            {/* Planning */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>Planning</td>
              <td className={TD + " text-center"}>
                <SectionDoneIndicator sectionKey="pl" checks={data.checks} />
              </td>
              <td className={TD + " py-1.5"}>
                <MultiRoleCell sectionKey="pl" checks={data.checks} toggle={toggleCheck} team={ctx.team} showSignoffBtn onSignoff={() => signSection("pl")} />
              </td>
            </tr>

            {/* Risk Assessment */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>Risk Assessment</td>
              <td className={TD + " text-center"}>
                <SectionDoneIndicator sectionKey="ra" checks={data.checks} />
              </td>
              <td className={TD + " py-1.5"}>
                <MultiRoleCell sectionKey="ra" checks={data.checks} toggle={toggleCheck} team={ctx.team} showSignoffBtn onSignoff={() => signSection("ra")} />
              </td>
            </tr>

            {/* Response to Assessed Risks */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>Response to Assessed Risks</td>
              <td className={TD + " text-center"}>
                <SectionDoneIndicator sectionKey="rp" checks={data.checks} />
              </td>
              <td className={TD + " py-1.5"}>
                <MultiRoleCell sectionKey="rp" checks={data.checks} toggle={toggleCheck} team={ctx.team} showSignoffBtn onSignoff={() => signSection("rp")} />
              </td>
            </tr>

            {/* Trial Balance */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>Trial Balance & Adj Entries</td>
              <td className={TD + " text-center"}>
                <SectionDoneIndicator sectionKey="tb" checks={data.checks} />
              </td>
              <td className={TD + " py-1.5"}>
                <MultiRoleCell sectionKey="tb" checks={data.checks} toggle={toggleCheck} team={ctx.team} showSignoffBtn onSignoff={() => signSection("tb")} />
              </td>
            </tr>

            {/* Procedures */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>Procedures</td>
              <td className={TD + " text-center"}>
                <SectionDoneIndicator sectionKey="pr" checks={data.checks} />
              </td>
              <td className={TD + " py-1.5"}>
                <MultiRoleCell sectionKey="pr" checks={data.checks} toggle={toggleCheck} team={ctx.team} showSignoffBtn onSignoff={() => signSection("pr")} />
              </td>
            </tr>

            {/* Completion and Signoffs sub-section */}
            <tr className="border-b border-border">
              <td className={SEC_HEAD} colSpan={3}>Completion and Signoffs</td>
            </tr>
            {[
              { key: "so-aim", label: "Accumulation of Identified Misstatements (AIM)" },
              { key: "so-se",  label: "Subsequent events" },
            ].map(item => (
              <tr key={item.key} className="border-b border-border/50 hover:bg-muted/5">
                <td className={TD + " pl-8"}>
                  <div className="flex items-center gap-2">
                    <Cb checked={!!data.checks[item.key]} onChange={() => toggleCheck(item.key)} />
                    <span>{item.label}</span>
                  </div>
                </td>
                <td className={TD + " text-center"}>
                  {data.checks[item.key] && <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />}
                </td>
                <td className={TD} />
              </tr>
            ))}

            {/* Issues */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>
                <div className="flex items-center gap-2">
                  Issues
                  <Badge variant="success">Resolved</Badge>
                </div>
              </td>
              <td className={TD + " text-center"}>
                <SectionDoneIndicator sectionKey="issues" checks={data.checks} />
              </td>
              <td className={TD + " py-1.5"}>
                <MultiRoleCell sectionKey="issues" checks={data.checks} toggle={toggleCheck} team={ctx.team} showSignoffBtn onSignoff={() => signSection("issues")} />
              </td>
            </tr>

            {/* Comments */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>
                <div className="flex items-center gap-2">
                  Comments
                  <Badge variant="success">Resolved</Badge>
                </div>
              </td>
              <td className={TD + " text-center"}>
                <SectionDoneIndicator sectionKey="comments" checks={data.checks} />
              </td>
              <td className={TD + " py-1.5"}>
                <MultiRoleCell sectionKey="comments" checks={data.checks} toggle={toggleCheck} team={ctx.team} showSignoffBtn onSignoff={() => signSection("comments")} />
              </td>
            </tr>

            {/* Documents Request List */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>
                <div className="flex items-center gap-2">
                  Documents Request List
                  <Badge variant="completed">Completed</Badge>
                </div>
              </td>
              <td className={TD + " text-center"}>
                <SectionDoneIndicator sectionKey="docs-req" checks={data.checks} />
              </td>
              <td className={TD + " py-1.5"}>
                <MultiRoleCell sectionKey="docs-req" checks={data.checks} toggle={toggleCheck} team={ctx.team} showSignoffBtn onSignoff={() => signSection("docs-req")} />
              </td>
            </tr>

            {/* Completion */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>Completion</td>
              <td className={TD + " text-center"}>
                <SectionDoneIndicator sectionKey="completion" checks={data.checks} />
              </td>
              <td className={TD + " py-1.5"}>
                <MultiRoleCell sectionKey="completion" checks={data.checks} toggle={toggleCheck} team={ctx.team} showSignoffBtn onSignoff={() => signSection("completion")} />
              </td>
            </tr>

            {/* Client Signoff */}
            <tr className="border-b border-border">
              <td className={SEC_HEAD} colSpan={3}>Client Signoff</td>
            </tr>
            <tr className="border-b border-border">
              <td className={TD} colSpan={2}>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Client Signoff Date (MM/DD/YYYY) *
                    </label>
                    <Input
                      type="date"
                      value={data.clientSignoffDate}
                      onChange={e => upd("clientSignoffDate", e.target.value)}
                      className="h-9 text-sm max-w-[220px]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Note</label>
                    <Textarea
                      value={data.clientSignoffNote}
                      onChange={e => upd("clientSignoffNote", e.target.value)}
                      placeholder="Add a note..."
                      className="min-h-[72px] text-sm resize-none max-w-md"
                    />
                  </div>
                </div>
              </td>
              <td className={TD + " py-1.5"}>
                <MultiRoleCell sectionKey="client-signoff" checks={data.checks} toggle={toggleCheck} team={ctx.team} showSignoffBtn onSignoff={() => signSection("client-signoff")} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Sign Off Disclaimer ────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
        <div className={SEC_HEAD}>Sign Off Disclaimer</div>
        <div className="px-4 py-3 text-sm text-foreground leading-relaxed">
          <p>
            By signing off below, you are agreeing to this statement that you have reviewed all the relevant
            associated working papers and cleared all your queries and documented the matters appropriately
            that may cause the financial statements and note disclosures, if applicable, to be false and/or
            misleading.
          </p>
        </div>
      </div>

      {/* ── Final Completion Signoff ───────────────────────────────────── */}
      <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
        <div className={SEC_HEAD}>Final Completion Signoff</div>
        <div className="px-4 py-4">
          {data.finalSignoffDone ? (
            <div className="flex items-center gap-3 p-3 rounded-md bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-green-800 dark:text-green-300">{CURRENT_USER.name}</div>
                <div className="text-xs text-green-700 dark:text-green-400">
                  Final signoff completed{" "}
                  {data.finalSignoffAt
                    ? new Date(data.finalSignoffAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
              <button
                type="button"
                onClick={() => { upd("finalSignoffDone", false); upd("finalSignoffAt", ""); }}
                className="ml-auto text-xs text-green-700 underline hover:text-green-900 dark:text-green-400"
              >
                Undo
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground flex-shrink-0">
                  {(CURRENT_USER.name || "U").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{CURRENT_USER.name}</div>
                  <div className="text-xs text-muted-foreground">Preparer</div>
                </div>
              </div>
              <Button onClick={performFinalSignoff}>
                <CheckSquare className="h-4 w-4" />
                Signoff
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Assign Packager ────────────────────────────────────────────── */}
      {!data.packagerAssigned ? (
        <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
          <div className={SEC_HEAD}>Assign Packager</div>
          <div className="px-4 py-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Assign team member *</label>
              <Select value={data.packagerName} onValueChange={v => upd("packagerName", v)}>
                <SelectTrigger className="h-9 text-sm w-64">
                  <SelectValue placeholder="Select Packager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CURRENT_USER.name}>{CURRENT_USER.name}</SelectItem>
                  {ctx.team.map(m => (
                    m.name !== CURRENT_USER.name && (
                      <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Instructions for final package (if applicable) *
              </label>
              <Textarea
                value={data.packagerInstructions}
                onChange={e => upd("packagerInstructions", e.target.value)}
                placeholder="Add Instructions here"
                className="min-h-[80px] text-sm resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Due date for packaging (MM/DD/YYYY) *
              </label>
              <Input
                type="date"
                value={data.packagerDueDate}
                onChange={e => upd("packagerDueDate", e.target.value)}
                className="h-9 text-sm max-w-[220px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  upd("packagerName", "");
                  upd("packagerInstructions", "");
                  upd("packagerDueDate", "");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => upd("packagerAssigned", true)}
                disabled={!data.packagerName || !data.packagerDueDate}
              >
                Assign
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
          <div className={SEC_HEAD}>Packager Assigned</div>
          <div className="px-4 py-3 text-sm text-foreground flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>Assigned to <strong>{data.packagerName}</strong> · Due {data.packagerDueDate || "—"}</span>
            <button
              type="button"
              onClick={() => upd("packagerAssigned", false)}
              className="ml-auto text-xs text-muted-foreground underline hover:text-foreground"
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {/* ── Final actions ──────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
        <div className={SEC_HEAD}>Actions</div>
        <div className="px-4 py-3 flex flex-wrap gap-2">
          {[
            { label: "Finalize Report",       disabled: !data.finalSignoffDone },
            { label: "Create Package",         disabled: !data.packagerAssigned },
            { label: "Roll Forward Template",  disabled: false                  },
            { label: "Complete & Archive",     disabled: !data.finalSignoffDone },
            { label: "Export Data",            disabled: false                  },
          ].map(action => (
            <Button
              key={action.label}
              variant={action.disabled ? "outline" : "default"}
              size="sm"
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
        </div>
        {!data.finalSignoffDone && (
          <div className="flex items-center gap-2 px-4 py-2 text-xs text-amber-700 border-t border-border bg-amber-50/50 dark:bg-amber-900/20 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            Complete the Final Completion Signoff to enable Finalize Report and Complete &amp; Archive.
          </div>
        )}
      </div>
    </WorksheetLayout>
  );
}
