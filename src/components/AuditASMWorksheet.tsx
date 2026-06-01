import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

interface AttendeeRow {
  name: string;
  role: string;
  organization: string;
  experience: string;
}

interface TeamRow {
  name: string;
  role: string;
  responsibilities: string;
  areaAssigned: string;
}

interface KeyChangeRow {
  area: string;
  changeDescription: string;
  auditImpact: string;
  riskLevel: string;
}

interface PARRow {
  item: string;
  observation: string;
  thresholdExceeded: string;
  followUpRequired: string;
}

interface RiskRow {
  riskArea: string;
  discussionPoints: string;
  preliminaryAssessment: string;
  plannedResponse: string;
}

interface ProcedureRow {
  area: string;
  approach: string;
  timing: string;
  assignedTo: string;
  wpRef: string;
}

interface ActionRow {
  num: number;
  actionItem: string;
  owner: string;
  dueDate: string;
  status: string;
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface AuditASMWorksheetProps {
  isUS?: boolean;
}

export function AuditASMWorksheet({ isUS = false }: AuditASMWorksheetProps) {
  const clientName = isUS ? "Harbor Freight Logistics LLC" : "Shipping Line Inc.";
  const engagementId = isUS ? "AUD-US-Dec312024" : "AUD-SL-Mar312024";

  // ── Form state ───────────────────────────────────────────────────────────────
  const [meetingDate, setMeetingDate] = useState("January 20, 2025");
  const [location, setLocation] = useState("Conference Room A / Teams");
  const [imported, setImported] = useState(false);
  const [importStep, setImportStep] = useState(0); // 0=closed,1=calendar,2=ai,3=preview,4=review
  const [concluded, setConcluded] = useState(false);
  const [conclusion, setConclusion] = useState(
    isUS
      ? "Based on our planning discussion, I am satisfied that the overall audit strategy adequately addresses the scope, timing, and direction of the audit in accordance with AU-C 300."
      : "Based on our planning discussion, I am satisfied that the overall audit strategy adequately addresses the scope, timing, and direction of the audit in accordance with CAS 300."
  );

  const attendees: AttendeeRow[] = [
    { name: "M. Thompson", role: "Engagement Partner", organization: "Williams & Associates CPA", experience: "18 years" },
    { name: "L. Garcia", role: "Engagement Manager", organization: "Williams & Associates CPA", experience: "9 years" },
    { name: "K. Patel", role: "Senior Associate", organization: "Williams & Associates CPA", experience: "4 years" },
    { name: "J. Chen", role: "Staff Associate", organization: "Williams & Associates CPA", experience: "1 year" },
    { name: "R. Morrison", role: "Chief Financial Officer", organization: clientName, experience: "Client" },
    { name: "S. Williams", role: "Controller", organization: clientName, experience: "Client" },
  ];

  const teamRows: TeamRow[] = [
    { name: "M. Thompson", role: "Engagement Partner", responsibilities: "Overall engagement quality, significant risks, final review", areaAssigned: "All areas" },
    { name: "L. Garcia", role: "Engagement Manager", responsibilities: "Fieldwork coordination, revenue & AR, going concern, report", areaAssigned: "Revenue, AR, Completion" },
    { name: "K. Patel", role: "Senior Associate", responsibilities: "Balance sheet, PP&E, debt, ASC 842 leases, goodwill", areaAssigned: "Assets, Liabilities" },
    { name: "J. Chen", role: "Staff Associate", responsibilities: "Payroll, expenses, AP, journal entry testing", areaAssigned: "Payroll, Expenses" },
  ];

  const keyChanges: KeyChangeRow[] = [
    { area: "ASC 842 Leases", changeDescription: "First-year adoption — 3 operating leases capitalized ($2.8M ROU assets)", auditImpact: "New accounting area requiring specialized procedures", riskLevel: "High" },
    { area: "Credit Facility", changeDescription: "New $5M revolving credit facility drawn to $4.32M at year-end", auditImpact: "Increased leverage, covenant monitoring required", riskLevel: "Medium" },
    { area: "Revenue Growth", changeDescription: "Revenue increased 8.2% ($1.4M) — new customer contracts", auditImpact: "Revenue recognition risk; cut-off testing expanded", riskLevel: "Medium" },
    { area: "IT Systems", changeDescription: "New ERP module for accounts payable", auditImpact: "Change management testing required for AP controls", riskLevel: "Medium" },
    { area: "Personnel Changes", changeDescription: "New Controller (S. Williams) joined July 2024", auditImpact: "Assess transition risk; expanded walkthrough procedures", riskLevel: "Low" },
  ];

  const parRows: PARRow[] = [
    { item: "Revenue", observation: "+8.2% ($1.4M) — consistent with new contracts", thresholdExceeded: "No", followUpRequired: "Document understanding" },
    { item: "Gross Margin", observation: "34.0% vs 33.0% prior year — marginal improvement", thresholdExceeded: "No", followUpRequired: "Understand cost drivers" },
    { item: "Depreciation", observation: "+50% due to ASC 842 ROU asset depreciation", thresholdExceeded: "Yes", followUpRequired: "Verify ASC 842 calculations" },
    { item: "Debt-to-Equity", observation: "2.71x vs 1.00x prior year — covenant risk", thresholdExceeded: "Yes", followUpRequired: "Review covenant terms" },
    { item: "Cash", observation: "+$260K — positive working capital trend", thresholdExceeded: "No", followUpRequired: "Trace to bank confirmations" },
  ];

  const riskRows: RiskRow[] = [
    { riskArea: "Revenue Recognition (ASC 606)", discussionPoints: "Management uses percentage-of-completion for some contracts — judgment involved", preliminaryAssessment: "Significant Risk — High", plannedResponse: "Detailed cut-off testing, review contract terms, test estimates" },
    { riskArea: "Management Override of Controls", discussionPoints: "New CFO, significant transactions in H2", preliminaryAssessment: "Presumed Risk (AU-C 240)", plannedResponse: "Journal entry testing, review unusual entries >$50K" },
    { riskArea: "Goodwill Impairment (ASC 350)", discussionPoints: "No impairment recorded despite sector headwinds", preliminaryAssessment: "Medium Risk", plannedResponse: "Obtain DCF model, challenge key assumptions, consider specialist" },
    { riskArea: "ASC 842 Lease Capitalization", discussionPoints: "Complex calculation, first-year adoption", preliminaryAssessment: "High Risk", plannedResponse: "Reperform calculations, review lease agreements" },
    { riskArea: "Going Concern", discussionPoints: "Elevated leverage but adequate liquidity", preliminaryAssessment: "Low Risk", plannedResponse: "Monitor through completion, review bank covenants" },
  ];

  const procedureRows: ProcedureRow[] = [
    { area: "Revenue", approach: "Test of details + analytical", timing: "Week 1–2 fieldwork", assignedTo: "L. Garcia", wpRef: "WP-Rev-01" },
    { area: "Accounts Receivable", approach: "Confirmations + subsequent receipts", timing: "Week 1", assignedTo: "L. Garcia", wpRef: "WP-AR-01" },
    { area: "PP&E", approach: "Test additions + disposals + depreciation", timing: "Week 2", assignedTo: "K. Patel", wpRef: "WP-PPE-01" },
    { area: "ASC 842 Leases", approach: "Reperform ROU asset & liability calcs", timing: "Week 2", assignedTo: "K. Patel", wpRef: "WP-Lease-01" },
    { area: "Goodwill", approach: "Impairment assessment review", timing: "Week 3", assignedTo: "K. Patel", wpRef: "WP-GW-01" },
    { area: "Debt & Covenants", approach: "Confirmation + agreement review", timing: "Week 1", assignedTo: "K. Patel", wpRef: "WP-Debt-01" },
    { area: "Payroll", approach: "Test of controls + analytical", timing: "Week 2–3", assignedTo: "J. Chen", wpRef: "WP-Pay-01" },
    { area: "AP / Expenses", approach: "Search for unrecorded liabilities", timing: "Week 3", assignedTo: "J. Chen", wpRef: "WP-AP-01" },
    { area: "Journal Entries", approach: isUS ? "AU-C 240 journal entry testing" : "CAS 240 journal entry testing", timing: "Week 1", assignedTo: "L. Garcia", wpRef: "WP-JE-01" },
    { area: "Going Concern", approach: "Final assessment at completion", timing: "Week 4", assignedTo: "M. Thompson", wpRef: "WP-GC-01" },
  ];

  const actionRows: ActionRow[] = [
    { num: 1, actionItem: "Obtain signed engagement letter", owner: "L. Garcia", dueDate: "Jan 15, 2025", status: "✅ Complete" },
    { num: 2, actionItem: "Send bank confirmation requests", owner: "L. Garcia", dueDate: "Jan 21, 2025", status: "✅ Complete" },
    { num: 3, actionItem: "Request AR aging schedule from S. Williams", owner: "K. Patel", dueDate: "Jan 21, 2025", status: "🔄 In Progress" },
    { num: 4, actionItem: "Obtain lease agreements for ASC 842 review", owner: "K. Patel", dueDate: "Jan 22, 2025", status: "🔄 In Progress" },
    { num: 5, actionItem: "Request goodwill impairment DCF model", owner: "K. Patel", dueDate: "Jan 24, 2025", status: "⏳ Pending" },
    { num: 6, actionItem: "Review IT change management for AP module", owner: "J. Chen", dueDate: "Jan 22, 2025", status: "⏳ Pending" },
  ];

  // ── Import flow ───────────────────────────────────────────────────────────────

  const handleOpenImport = () => setImportStep(1);

  useEffect(() => {
    if (importStep === 1) {
      const t = setTimeout(() => setImportStep(2), 1500);
      return () => clearTimeout(t);
    }
    if (importStep === 2) {
      const t = setTimeout(() => setImportStep(3), 2500);
      return () => clearTimeout(t);
    }
  }, [importStep]);

  const handleConfirmImport = () => {
    setImportStep(0);
    setImported(true);
    toast.success("Meeting notes imported successfully. All sections have been populated.");
  };

  const handleCloseModal = () => setImportStep(0);

  // ── Helpers ───────────────────────────────────────────────────────────────────

  const riskBadgeClass = (level: string) => {
    if (level === "High") return "bg-red-100 text-red-700 border border-red-200";
    if (level === "Medium") return "bg-amber-100 text-amber-700 border border-amber-200";
    return "bg-green-100 text-green-700 border border-green-200";
  };

  const standardRef = isUS ? "AU-C 300" : "CAS 300";

  return (
    <div className="flex flex-col h-full">

      {/* ── Sticky Objective Bar ── */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">{standardRef} — Overall Audit Strategy</span>
        <span className="text-xs text-muted-foreground mx-1">|</span>
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Document the overall audit strategy that sets the scope, timing and direction of the audit and guides the development of the audit plan.
        </p>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* ── Card 1: Meeting Information ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Team Planning Discussion</span>
              <span title="Record the details of the planning meeting, attendees, and discussion outcomes.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
              <div className="flex-1" />
              {imported ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  ✅ Imported from meeting notes — January 20, 2025
                </span>
              ) : (
                <button
                  onClick={handleOpenImport}
                  className="h-8 px-3 rounded-full bg-gradient-to-r from-[#1C63A6] to-[#7A31D8] hover:from-[#1a5a96] hover:to-[#6a2bc2] text-white text-xs font-medium gap-1.5 flex items-center shadow-md"
                >
                  <Sparkles className="h-3.5 w-3.5 animate-[spin_3s_linear_infinite]" />
                  Import Meeting Notes
                </button>
              )}
            </div>
            <div className="px-6 py-5 space-y-5">
              {/* 2-col grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Meeting Date</label>
                  <Input
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Location</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Client</label>
                  <div className="h-8 flex items-center px-3 rounded-md border border-border bg-muted/30 text-sm text-foreground">
                    {clientName}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Engagement</label>
                  <div className="h-8 flex items-center px-3 rounded-md border border-border bg-muted/30 text-sm font-mono text-foreground">
                    {engagementId}
                  </div>
                </div>
              </div>

              {/* Attendees table */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Attendees</p>
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b border-border">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Role</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Organization</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Experience</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {attendees.map((a, i) => (
                        <tr key={i} className="hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-2.5 text-sm font-medium text-foreground">{a.name}</td>
                          <td className="px-4 py-2.5 text-sm text-muted-foreground">{a.role}</td>
                          <td className="px-4 py-2.5 text-sm text-muted-foreground">{a.organization}</td>
                          <td className="px-4 py-2.5 text-sm text-muted-foreground">{a.experience}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ── Card 2: Team Responsibilities ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Team Responsibilities</span>
              <span title="Document the responsibilities assigned to each team member for this engagement.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Responsibilities</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Area Assigned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {teamRows.map((r, i) => (
                    <tr key={i} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-2.5 text-sm font-medium text-foreground whitespace-nowrap">{r.name}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{r.role}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{r.responsibilities}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{r.areaAssigned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Card 3: Key Changes from Prior Year ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Key Changes from Prior Year</span>
              <span title="Document significant changes from the prior year and their expected audit impact.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Area</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Change Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Audit Impact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {keyChanges.map((r, i) => (
                    <tr key={i} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-2.5 text-sm font-medium text-foreground whitespace-nowrap">{r.area}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{r.changeDescription}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{r.auditImpact}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${riskBadgeClass(r.riskLevel)}`}>
                          {r.riskLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Card 4: Preliminary Analytical Review Points ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Preliminary Analytical Review Points</span>
              <span title="Summarize the key observations from preliminary analytical procedures and identify areas requiring follow-up.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Observation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Threshold Exceeded</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Follow-up Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {parRows.map((r, i) => (
                    <tr key={i} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-2.5 text-sm font-medium text-foreground whitespace-nowrap">{r.item}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{r.observation}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${r.thresholdExceeded === "Yes" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-muted text-muted-foreground border border-border"}`}>
                          {r.thresholdExceeded}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{r.followUpRequired}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Card 5: Risk Assessment Discussion ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Risk Assessment Discussion</span>
              <span title="Document the preliminary risk assessment and planned audit responses identified during the planning meeting.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Risk Area</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Discussion Points</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Preliminary Assessment</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Planned Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {riskRows.map((r, i) => (
                    <tr key={i} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-2.5 text-sm font-medium text-foreground">{r.riskArea}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{r.discussionPoints}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{r.preliminaryAssessment}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{r.plannedResponse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Card 6: Planned Procedures Summary ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Planned Procedures Summary</span>
              <span title="Summarize the planned audit procedures by area, including timing and team assignment.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Area</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Approach</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Timing</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">W/P Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {procedureRows.map((r, i) => (
                    <tr key={i} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-2.5 text-sm font-medium text-foreground whitespace-nowrap">{r.area}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{r.approach}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{r.timing}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{r.assignedTo}</td>
                      <td className="px-4 py-2.5 text-sm font-mono text-muted-foreground">{r.wpRef}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Card 7: Action Items ── */}
          <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">Action Items</span>
              <span title="Track outstanding action items arising from the planning meeting.">
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-10">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Action Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Owner</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {actionRows.map((r) => (
                    <tr key={r.num} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-2.5 text-sm text-muted-foreground">{r.num}</td>
                      <td className="px-4 py-2.5 text-sm text-foreground">{r.actionItem}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{r.owner}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{r.dueDate}</td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground whitespace-nowrap">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Card 8: Conclusion ── */}
          <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
            <div className="px-6 py-3.5 bg-card border-b border-border">
              <span className="text-sm font-semibold text-foreground">Conclusion</span>
            </div>
            <div className="px-6 py-5">
              <Textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                className="min-h-[72px] text-sm resize-none bg-background"
              />
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => {
                    setConcluded(true);
                    toast.success("Audit strategy memorandum concluded.");
                  }}
                  disabled={concluded}
                >
                  {concluded ? "Worksheet concluded" : "Conclude worksheet"}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Import Meeting Notes Modal ── */}
      {importStep > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

            {/* Step 1: Calendar Connection */}
            {importStep === 1 && (
              <div
                className="p-8 flex flex-col items-center gap-5 text-center"
                style={{ animation: "fadeInUp 0.25s ease" }}
              >
                <div className="text-4xl">🗓️</div>
                <p className="text-base font-semibold text-foreground">Connecting to Google Calendar...</p>
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">Retrieving meetings for {engagementId}...</p>
              </div>
            )}

            {/* Step 2: AI Analysis */}
            {importStep === 2 && (
              <div
                className="p-8 flex flex-col items-center gap-5 text-center"
                style={{ animation: "fadeInUp 0.25s ease" }}
              >
                <div className="text-4xl">✨</div>
                <p className="text-base font-semibold text-foreground">Luka AI is analyzing your meeting notes...</p>
                <ProgressBar />
                <p className="text-sm text-muted-foreground">Reading transcript... Extracting attendees... Identifying key points...</p>
              </div>
            )}

            {/* Step 3: Preview */}
            {importStep === 3 && (
              <div style={{ animation: "fadeInUp 0.25s ease" }}>
                <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
                  <p className="text-base font-semibold text-foreground">Draft Content Found</p>
                  <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-1">
                    <p className="text-sm font-medium text-foreground">📅 Meeting found</p>
                    <p className="text-sm text-muted-foreground">"Audit Planning Discussion — {clientName}"</p>
                    <p className="text-xs text-muted-foreground">Jan 20, 2025, 2:00 PM</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      "6 Attendees identified",
                      "Team responsibilities mapped",
                      "5 Key changes documented",
                      "5 Risk areas identified",
                      "10 Planned procedures listed",
                      "6 Action items captured",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-green-50 border border-green-200">
                        <span className="text-green-600">✅</span>
                        <span className="text-sm text-green-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 pb-6 flex gap-3 justify-end">
                  <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
                  <Button onClick={() => setImportStep(4)}>Review Draft</Button>
                </div>
              </div>
            )}

            {/* Step 4: Review Draft */}
            {importStep === 4 && (
              <div style={{ animation: "fadeInUp 0.25s ease" }}>
                <div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
                  <p className="text-base font-semibold text-foreground">Review Draft</p>
                  <button onClick={handleCloseModal} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-6 py-5 max-h-80 overflow-y-auto space-y-3">
                  <ReviewSection title="Meeting Information">
                    <ReviewField label="Date" value="January 20, 2025" />
                    <ReviewField label="Location" value="Conference Room A / Teams" />
                    <ReviewField label="Attendees" value="6 participants (4 firm, 2 client)" />
                  </ReviewSection>
                  <ReviewSection title="Team Responsibilities">
                    <ReviewField label="Partner" value="M. Thompson — All areas" />
                    <ReviewField label="Manager" value="L. Garcia — Revenue, AR, Completion" />
                    <ReviewField label="Senior" value="K. Patel — Assets, Liabilities" />
                    <ReviewField label="Staff" value="J. Chen — Payroll, Expenses" />
                  </ReviewSection>
                  <ReviewSection title="Key Changes">
                    <ReviewField label="High risk" value="ASC 842 first-year adoption ($2.8M ROU)" />
                    <ReviewField label="Medium risk" value="New $5M credit facility, Revenue +8.2%, ERP module" />
                    <ReviewField label="Low risk" value="New Controller joined July 2024" />
                  </ReviewSection>
                  <ReviewSection title="Risk Assessment">
                    <ReviewField label="Significant" value="Revenue recognition (ASC 606)" />
                    <ReviewField label="Presumed" value="Management override (AU-C 240)" />
                    <ReviewField label="High" value="ASC 842 lease capitalization" />
                  </ReviewSection>
                  <ReviewSection title="Planned Procedures">
                    <ReviewField label="Areas" value="10 audit areas planned (Week 1–4)" />
                    <ReviewField label="W/P Refs" value="WP-Rev-01 through WP-GC-01" />
                  </ReviewSection>
                  <ReviewSection title="Action Items">
                    <ReviewField label="Complete" value="2 items (engagement letter, bank confirmations)" />
                    <ReviewField label="In Progress" value="2 items (AR aging, lease agreements)" />
                    <ReviewField label="Pending" value="2 items (DCF model, IT change management)" />
                  </ReviewSection>
                </div>
                <div className="px-6 pb-6 flex gap-3 justify-end border-t border-border pt-4">
                  <Button variant="outline" onClick={() => setImportStep(3)}>← Back</Button>
                  <Button
                    onClick={handleConfirmImport}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    ✓ Confirm &amp; Import
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ProgressBar() {
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

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="px-3 py-2 bg-muted border-b border-border">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</p>
      </div>
      <div className="px-3 py-2 space-y-1">{children}</div>
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-muted-foreground shrink-0 w-24">{label}:</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
