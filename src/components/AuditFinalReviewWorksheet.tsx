import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckSquare, Square, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENT_USER } from "@/lib/useTimeEntries";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { WorksheetLayout, WorksheetHeader } from "@/components/audit/WorksheetShell";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { getEngagementMeta } from "@/store/engagementsStore";

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

// ── Simple checkbox component ─────────────────────────────────────────────────

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

interface StatusBadge {
  label: string;
  variant: "resolved" | "completed" | "pending";
}

function Badge({ label, variant }: StatusBadge) {
  const cls =
    variant === "resolved"
      ? "bg-green-50 text-green-700 border border-green-200"
      : variant === "completed"
      ? "bg-blue-50 text-blue-700 border border-blue-200"
      : "bg-amber-50 text-amber-700 border border-amber-200";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${cls}`}>{label}</span>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AuditFinalReviewWorksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const storageKey = `audit-fr-final-review-${engagementId ?? "default"}`;
  const meta = getEngagementMeta(engagementId ?? "");

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

  function signAll() {
    const all: CheckState = {};
    [
      "co", "pl", "ra", "rp", "do", "tb",
      "pr-assets", "pr-liab", "pr-equity", "pr-rev", "pr-exp",
      "fs", "so-aim", "so-se",
      "issues", "comments", "docs-req", "completion",
      "client-signoff",
    ].forEach(k => { all[k] = true; });
    setData(d => ({ ...d, checks: all }));
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
                <td className="px-4 py-3 text-sm text-foreground border-b border-border border-r border-border/40">{meta.type}</td>
                <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase border-b border-border bg-muted/10 w-[160px]">Accounting Standards</td>
                <td className="px-4 py-3 text-sm text-foreground border-b border-border">Canadian Auditing Standards (CAS)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase bg-muted/10 border-b border-border">Year End Date</td>
                <td className="px-4 py-3 text-sm text-foreground border-b border-border border-r border-border/40">{meta.yearEnd}</td>
                <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase bg-muted/10 border-b border-border">Legal Entity Name</td>
                <td className="px-4 py-3 text-sm text-foreground border-b border-border border-r border-border/40">{meta.client}</td>
                <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase bg-muted/10 border-b border-border">Engagement Status</td>
                <td className="px-4 py-3 text-sm text-foreground border-b border-border">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">{meta.status}</span>
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
            <div className="font-semibold">{meta.client}</div>
            <div className="text-muted-foreground text-xs mt-0.5">Client</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
          <div className={SEC_HEAD}>Team Info</div>
          <div className="px-4 py-3 text-sm text-foreground">
            <div className="font-semibold">{meta.team || "View Assignees"}</div>
            <div className="text-muted-foreground text-xs mt-0.5">Engagement Team</div>
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
              <th className={TH + " w-64"}>Team</th>
            </tr>
          </thead>
          <tbody>
            {/* Master SignOff All row */}
            <tr className="border-b border-border bg-muted/10">
              <td className={TD + " font-medium"} />
              <td className={TD + " text-center"} />
              <td className={TD}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0">
                      {(CURRENT_USER.name || "U").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-[12px]">
                      <div className="font-semibold text-foreground">{CURRENT_USER.name}</div>
                      <div className="text-muted-foreground">Preparer</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={signAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-fit"
                  >
                    <CheckSquare className="h-3 w-3" />
                    Signoff All
                  </button>
                </div>
              </td>
            </tr>

            {/* Client Onboarding */}
            <tr className="border-b border-border">
              <td className={SEC_HEAD} colSpan={3}>Client Onboarding Checklist</td>
            </tr>
            {[
              { key: "co-new-accept", label: "New engagement acceptance" },
              { key: "co-exist-cont", label: "Existing engagement continuance" },
              { key: "co-eng-letter", label: "Engagement Letter" },
            ].map(item => (
              <tr key={item.key} className="border-b border-border/50 hover:bg-muted/5">
                <td className={TD + " pl-8"}>
                  <div className="flex items-center gap-2">
                    <Cb checked={!!data.checks[item.key]} onChange={() => toggleCheck(item.key)} />
                    <span>{item.label}</span>
                  </div>
                </td>
                <td className={TD + " text-center"}>
                  <Cb checked={!!data.checks[item.key + "-done"]} onChange={() => toggleCheck(item.key + "-done")} />
                </td>
                <td className={TD} />
              </tr>
            ))}

            {/* Planning */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>Planning</td>
              <td className={TD + " text-center"}>
                <Cb checked={!!data.checks["pl"]} onChange={() => toggleCheck("pl")} />
              </td>
              <td className={TD}>
                <Cb checked={!!data.checks["pl-team"]} onChange={() => toggleCheck("pl-team")} />
              </td>
            </tr>

            {/* Trial Balance */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>Trial Balance & Adj Entries</td>
              <td className={TD + " text-center"}>
                <Cb checked={!!data.checks["tb"]} onChange={() => toggleCheck("tb")} />
              </td>
              <td className={TD}>
                <Cb checked={!!data.checks["tb-team"]} onChange={() => toggleCheck("tb-team")} />
              </td>
            </tr>

            {/* Procedures */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>Procedures</td>
              <td className={TD + " text-center"}>
                <Cb checked={!!data.checks["pr"]} onChange={() => toggleCheck("pr")} />
              </td>
              <td className={TD}>
                <Cb checked={!!data.checks["pr-team"]} onChange={() => toggleCheck("pr-team")} />
              </td>
            </tr>

            {/* Completion and Signoffs */}
            <tr className="border-b border-border">
              <td className={SEC_HEAD} colSpan={3}>Completion and Signoffs</td>
            </tr>
            {[
              { key: "so-aim", label: "Accumulation of Identified Misstatements (AIM)" },
              { key: "so-se", label: "Subsequent events" },
            ].map(item => (
              <tr key={item.key} className="border-b border-border/50 hover:bg-muted/5">
                <td className={TD + " pl-8"}>
                  <div className="flex items-center gap-2">
                    <Cb checked={!!data.checks[item.key]} onChange={() => toggleCheck(item.key)} />
                    <span>{item.label}</span>
                  </div>
                </td>
                <td className={TD + " text-center"}>
                  <Cb checked={!!data.checks[item.key + "-done"]} onChange={() => toggleCheck(item.key + "-done")} />
                </td>
                <td className={TD} />
              </tr>
            ))}

            {/* Issues */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>
                <div className="flex items-center gap-2">
                  Issues
                  <Badge label="Resolved" variant="resolved" />
                </div>
              </td>
              <td className={TD + " text-center"}>
                <Cb checked={!!data.checks["issues"]} onChange={() => toggleCheck("issues")} />
              </td>
              <td className={TD}>
                <Cb checked={!!data.checks["issues-team"]} onChange={() => toggleCheck("issues-team")} />
              </td>
            </tr>

            {/* Comments */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>
                <div className="flex items-center gap-2">
                  Comments
                  <Badge label="Resolved" variant="resolved" />
                </div>
              </td>
              <td className={TD + " text-center"}>
                <Cb checked={!!data.checks["comments"]} onChange={() => toggleCheck("comments")} />
              </td>
              <td className={TD}>
                <Cb checked={!!data.checks["comments-team"]} onChange={() => toggleCheck("comments-team")} />
              </td>
            </tr>

            {/* Documents Request List */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>
                <div className="flex items-center gap-2">
                  Documents Request List
                  <Badge label="Completed" variant="completed" />
                </div>
              </td>
              <td className={TD + " text-center"}>
                <Cb checked={!!data.checks["docs-req"]} onChange={() => toggleCheck("docs-req")} />
              </td>
              <td className={TD}>
                <Cb checked={!!data.checks["docs-req-team"]} onChange={() => toggleCheck("docs-req-team")} />
              </td>
            </tr>

            {/* Completion */}
            <tr className="border-b border-border hover:bg-muted/5">
              <td className={TD + " font-medium"}>Completion</td>
              <td className={TD + " text-center"}>
                <Cb checked={!!data.checks["completion"]} onChange={() => toggleCheck("completion")} />
              </td>
              <td className={TD}>
                <Cb checked={!!data.checks["completion-team"]} onChange={() => toggleCheck("completion-team")} />
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
              <td className={TD}>
                <div className="flex flex-col gap-2">
                  <Cb checked={!!data.checks["client-signoff"]} onChange={() => toggleCheck("client-signoff")} />
                  <Cb checked={!!data.checks["client-signoff-team"]} onChange={() => toggleCheck("client-signoff-team")} />
                </div>
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
            <div className="flex items-center gap-3 p-3 rounded-md bg-green-50 border border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <div className="text-sm font-semibold text-green-800">{CURRENT_USER.name}</div>
                <div className="text-xs text-green-700">
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
                className="ml-auto text-xs text-green-700 underline hover:text-green-900"
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
              <button
                type="button"
                onClick={performFinalSignoff}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-fit"
              >
                <CheckSquare className="h-4 w-4" />
                Signoff
              </button>
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
                  <SelectItem value="R. Chandra">R. Chandra</SelectItem>
                  <SelectItem value="S. Whitfield">S. Whitfield</SelectItem>
                  <SelectItem value="D. Okonkwo">D. Okonkwo</SelectItem>
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
                className="h-8 text-xs"
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
                className="h-8 text-xs"
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
            { label: "Finalize Report", disabled: !data.finalSignoffDone },
            { label: "Create Package", disabled: !data.packagerAssigned },
            { label: "Roll Forward Template", disabled: false },
            { label: "Complete & Archive", disabled: !data.finalSignoffDone },
            { label: "Export Data", disabled: false },
          ].map(action => (
            <button
              key={action.label}
              type="button"
              disabled={action.disabled}
              className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                action.disabled
                  ? "border-border text-muted-foreground/50 bg-muted/20 cursor-not-allowed"
                  : "border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
        {!data.finalSignoffDone && (
          <div className="flex items-center gap-2 px-4 py-2 text-xs text-amber-700 border-t border-border bg-amber-50/50">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            Complete the Final Completion Signoff to enable Finalize Report and Complete & Archive.
          </div>
        )}
      </div>
    </WorksheetLayout>
  );
}
