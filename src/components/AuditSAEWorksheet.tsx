import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { AddToMyTemplatesDialog } from "@/components/AddToMyTemplatesDialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SAEState {
  expertRequired: "yes" | "no" | "";
  expertiseAreas: string[];
  expertiseOther: string;
  evidenceTypes: string[];
  scopeDescription: string;
  competenceNotes: string;
  objectivityThreat: "yes" | "no" | "";
  objectivityNotes: string;
  subjectToQC: "yes" | "no" | "";
  understandingNotes: string;
  termsChecked: string[];
  writtenAgreement: "yes" | "no" | "";
  wpRef: string;
  conclusion: string;
  preparedBy: string;
  preparedDate: string;
  reviewedBy: string;
  reviewedDate: string;
  concluded: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const EXPERTISE_AREAS = [
  { id: "valuation", label: "Valuation of complex financial instruments, land & buildings, plant & machinery, jewellery, works of art, antiques, intangible assets, business combinations or impaired assets" },
  { id: "actuarial", label: "Actuarial calculation of liabilities (insurance contracts or employee benefit plans)" },
  { id: "oil-gas", label: "Estimation of oil and gas reserves" },
  { id: "environmental", label: "Valuation of environmental liabilities and site clean-up costs" },
  { id: "legal", label: "Interpretation of contracts, laws and regulations" },
  { id: "tax", label: "Analysis of complex or unusual tax compliance issues" },
  { id: "other", label: "Other (specify below)" },
];

const EVIDENCE_TYPES = [
  { id: "understanding", label: "Obtaining an understanding of the entity and its environment, including internal controls" },
  { id: "risk", label: "Identifying and assessing risks of material misstatement" },
  { id: "response", label: "Determining and implementing overall responses to assessed risks" },
  { id: "procedures", label: "Designing and performing further audit procedures to respond to assessed risks" },
  { id: "evaluation", label: "Evaluating the sufficiency and appropriateness of audit evidence in forming an opinion" },
];

const TERMS_CHECKLIST = [
  { id: "nature-scope", label: "Nature, scope and objectives of the expert's work are defined" },
  { id: "roles", label: "Respective roles and responsibilities of the auditor and expert are documented" },
  { id: "communication", label: "Nature, timing and extent of communication (including report form) is agreed" },
  { id: "confidentiality", label: "Expert is required to observe confidentiality requirements" },
];

const STORAGE_KEY = "audit-sae-data";

function loadState(): Partial<SAEState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveState(s: SAEState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CardShell({ title, subtitle, children, badge }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
      <div className="px-6 py-3.5 bg-card border-b border-border flex items-center gap-3">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        {badge}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function YesNoPill({ value, onChange, disabled }: {
  value: "yes" | "no" | "";
  onChange: (v: "yes" | "no") => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1.5">
      {(["yes", "no"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize",
            value === opt
              ? opt === "yes"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-destructive/10 text-destructive border-destructive/40"
              : "bg-muted text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function CheckItem({ checked, onChange, label, disabled }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full flex items-start gap-3 px-3.5 py-2.5 rounded-md border text-left transition-colors",
        checked
          ? "bg-primary/5 border-primary/30 text-foreground"
          : "bg-background border-border hover:border-primary/30 hover:bg-muted/40 text-muted-foreground"
      )}
    >
      {checked
        ? <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        : <Circle className="h-4 w-4 mt-0.5 shrink-0 text-border" />}
      <span className="text-sm leading-snug">{label}</span>
    </button>
  );
}

function CompletionDot({ complete }: { complete: boolean }) {
  return (
    <span className={cn(
      "inline-flex h-2 w-2 rounded-full shrink-0",
      complete ? "bg-green-500" : "bg-border"
    )} />
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AuditSAEWorksheet({ isUS }: { isUS?: boolean }) {
  const saved = loadState();

  const [expertRequired, setExpertRequired] = useState<SAEState["expertRequired"]>(saved.expertRequired ?? "");
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>(saved.expertiseAreas ?? []);
  const [expertiseOther, setExpertiseOther] = useState(saved.expertiseOther ?? "");
  const [evidenceTypes, setEvidenceTypes] = useState<string[]>(saved.evidenceTypes ?? []);
  const [scopeDescription, setScopeDescription] = useState(saved.scopeDescription ?? "");
  const [competenceNotes, setCompetenceNotes] = useState(saved.competenceNotes ?? "");
  const [objectivityThreat, setObjectivityThreat] = useState<SAEState["objectivityThreat"]>(saved.objectivityThreat ?? "");
  const [objectivityNotes, setObjectivityNotes] = useState(saved.objectivityNotes ?? "");
  const [subjectToQC, setSubjectToQC] = useState<SAEState["subjectToQC"]>(saved.subjectToQC ?? "");
  const [understandingNotes, setUnderstandingNotes] = useState(saved.understandingNotes ?? "");
  const [termsChecked, setTermsChecked] = useState<string[]>(saved.termsChecked ?? []);
  const [writtenAgreement, setWrittenAgreement] = useState<SAEState["writtenAgreement"]>(saved.writtenAgreement ?? "");
  const [wpRef, setWpRef] = useState(saved.wpRef ?? "");
  const [conclusion, setConclusion] = useState(saved.conclusion ?? "");
  const [preparedBy, setPreparedBy] = useState(saved.preparedBy ?? "");
  const [preparedDate, setPreparedDate] = useState(saved.preparedDate ?? "");
  const [reviewedBy, setReviewedBy] = useState(saved.reviewedBy ?? "");
  const [reviewedDate, setReviewedDate] = useState(saved.reviewedDate ?? "");
  const [concluded, setConcluded] = useState(saved.concluded ?? false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const expertNeeded = expertRequired === "yes";
  const notNeeded = expertRequired === "no";

  function persist(patch: Partial<SAEState> = {}) {
    const current: SAEState = {
      expertRequired, expertiseAreas, expertiseOther, evidenceTypes, scopeDescription,
      competenceNotes, objectivityThreat, objectivityNotes, subjectToQC, understandingNotes,
      termsChecked, writtenAgreement, wpRef, conclusion, preparedBy, preparedDate,
      reviewedBy, reviewedDate, concluded, ...patch,
    };
    saveState(current);
  }

  function toggleArea(id: string) {
    const next = expertiseAreas.includes(id)
      ? expertiseAreas.filter(a => a !== id)
      : [...expertiseAreas, id];
    setExpertiseAreas(next);
    persist({ expertiseAreas: next });
  }

  function toggleEvidence(id: string) {
    const next = evidenceTypes.includes(id)
      ? evidenceTypes.filter(a => a !== id)
      : [...evidenceTypes, id];
    setEvidenceTypes(next);
    persist({ evidenceTypes: next });
  }

  function toggleTerm(id: string) {
    const next = termsChecked.includes(id)
      ? termsChecked.filter(a => a !== id)
      : [...termsChecked, id];
    setTermsChecked(next);
    persist({ termsChecked: next });
  }

  // ── Step completion ───────────────────────────────────────────────────────
  const step1Complete = expertRequired !== "";
  const step2Complete = expertNeeded ? evidenceTypes.length > 0 : true;
  const step3Complete = expertNeeded ? scopeDescription.trim().length > 0 : true;
  const step4Complete = expertNeeded ? (competenceNotes.trim().length > 0 && objectivityThreat !== "" && subjectToQC !== "") : true;
  const step5Complete = expertNeeded ? understandingNotes.trim().length > 0 : true;
  const step6Complete = expertNeeded ? (termsChecked.length === TERMS_CHECKLIST.length && writtenAgreement !== "") : true;
  const allComplete = step1Complete && step2Complete && step3Complete && step4Complete && step5Complete && step6Complete;

  const standardRef = isUS ? "AU-C 620" : "CAS 620";

  return (
    <div className="flex flex-col h-full">

      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Assist in the selection of an auditor's expert, plan the work to be performed, and agree on the terms
          of engagement. Using the work of an auditor's expert does not reduce the auditor's responsibility
          for the audit opinion. ({standardRef})
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-4">

          {/* ── Step 1: Expert Determination ── */}
          <CardShell
            title="Step 1 — Expert Determination"
            subtitle="Is an auditor's expert required for this engagement?"
            badge={<CompletionDot complete={step1Complete} />}
          >
            <div className="space-y-5">
              <YesNoPill
                value={expertRequired}
                onChange={(v) => { setExpertRequired(v); persist({ expertRequired: v }); }}
                disabled={concluded}
              />

              {notNeeded && (
                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    No auditor's expert required. Document rationale in the conclusion below and complete sign-off.
                  </p>
                </div>
              )}

              {expertNeeded && (
                <div className="space-y-2.5">
                  <p className="text-sm font-medium text-foreground">Which area(s) of expertise are required?</p>
                  <div className="space-y-2">
                    {EXPERTISE_AREAS.map(area => (
                      <CheckItem
                        key={area.id}
                        checked={expertiseAreas.includes(area.id)}
                        onChange={() => toggleArea(area.id)}
                        label={area.label}
                        disabled={concluded}
                      />
                    ))}
                  </div>
                  {expertiseAreas.includes("other") && (
                    <Input
                      value={expertiseOther}
                      onChange={e => { setExpertiseOther(e.target.value); persist({ expertiseOther: e.target.value }); }}
                      placeholder="Describe other expertise required…"
                      className="h-9 text-sm mt-1"
                      disabled={concluded}
                    />
                  )}
                </div>
              )}
            </div>
          </CardShell>

          {/* ── Steps 2–6: only shown when expert is required ── */}
          {expertNeeded && (
            <>
              {/* ── Step 2: Nature of Evidence ── */}
              <CardShell
                title="Step 2 — Nature of Evidence"
                subtitle="What type of evidence will be obtained from the expert?"
                badge={<CompletionDot complete={step2Complete} />}
              >
                <div className="space-y-2">
                  {EVIDENCE_TYPES.map(ev => (
                    <CheckItem
                      key={ev.id}
                      checked={evidenceTypes.includes(ev.id)}
                      onChange={() => toggleEvidence(ev.id)}
                      label={ev.label}
                      disabled={concluded}
                    />
                  ))}
                </div>
              </CardShell>

              {/* ── Step 3: Nature, Scope & Objectives ── */}
              <CardShell
                title="Step 3 — Nature, Scope & Objectives"
                subtitle="Describe the exact nature, timing and extent of the expert's work"
                badge={<CompletionDot complete={step3Complete} />}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground bg-muted/50 rounded-md px-4 py-3 border border-border">
                    {[
                      "Nature of the matter to which the expert's work relates",
                      "Risks of material misstatement in that matter",
                      "Significance of the expert's work in the context of the audit",
                      "Auditor's knowledge of the expert from prior engagements",
                    ].map((hint, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-primary/60 mt-0.5">•</span>
                        <span>{hint}</span>
                      </div>
                    ))}
                  </div>
                  <Textarea
                    value={scopeDescription}
                    onChange={e => { setScopeDescription(e.target.value); persist({ scopeDescription: e.target.value }); }}
                    placeholder="Document the nature, timing and extent of procedures to be performed by the expert, covering the considerations above…"
                    className="min-h-[100px] text-sm resize-none bg-background"
                    disabled={concluded}
                  />
                </div>
              </CardShell>

              {/* ── Step 4: Expert Assessment ── */}
              <CardShell
                title="Step 4 — Expert Assessment"
                subtitle="Evaluate competence, capabilities and objectivity"
                badge={<CompletionDot complete={step4Complete} />}
              >
                <div className="space-y-5">
                  {/* Competence */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Competence & capabilities</label>
                    <Textarea
                      value={competenceNotes}
                      onChange={e => { setCompetenceNotes(e.target.value); persist({ competenceNotes: e.target.value }); }}
                      placeholder="Document evaluation of the expert's professional certifications, licensing, membership, experience, and reputation in the relevant field…"
                      className="min-h-[80px] text-sm resize-none bg-background"
                      disabled={concluded}
                    />
                  </div>

                  {/* Objectivity */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Are there any interests or relationships that may create a threat to the expert's objectivity?
                    </label>
                    <YesNoPill
                      value={objectivityThreat}
                      onChange={(v) => { setObjectivityThreat(v); persist({ objectivityThreat: v }); }}
                      disabled={concluded}
                    />
                    {objectivityThreat === "yes" && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        <Textarea
                          value={objectivityNotes}
                          onChange={e => { setObjectivityNotes(e.target.value); persist({ objectivityNotes: e.target.value }); }}
                          placeholder="Describe the threat and how it has been addressed or mitigated…"
                          className="min-h-[72px] text-sm resize-none bg-transparent border-0 p-0 focus-visible:ring-0 text-amber-800 dark:text-amber-200 placeholder:text-amber-500/70 flex-1"
                          disabled={concluded}
                        />
                      </div>
                    )}
                  </div>

                  {/* Quality control */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Is the expert subject to the firm's quality control policies and procedures?
                    </label>
                    <div className="flex items-center gap-3">
                      <YesNoPill
                        value={subjectToQC}
                        onChange={(v) => { setSubjectToQC(v); persist({ subjectToQC: v }); }}
                        disabled={concluded}
                      />
                      {subjectToQC === "no" && (
                        <span className="text-xs text-muted-foreground">External expert — additional procedures may be required to evaluate their work.</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardShell>

              {/* ── Step 5: Auditor's Understanding ── */}
              <CardShell
                title="Step 5 — Auditor's Understanding of the Expert's Field"
                subtitle="Document sufficient understanding to plan and evaluate the expert's work"
                badge={<CompletionDot complete={step5Complete} />}
              >
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded-md px-4 py-3 border border-border space-y-1">
                    <p>Understanding must be sufficient to:</p>
                    <div className="flex items-start gap-1.5 ml-2"><span className="text-primary/60">•</span><span>Determine the nature, scope and objectives of the expert's work for audit purposes</span></div>
                    <div className="flex items-start gap-1.5 ml-2"><span className="text-primary/60">•</span><span>Evaluate the adequacy of the expert's work for our audit conclusions</span></div>
                  </div>
                  <Textarea
                    value={understandingNotes}
                    onChange={e => { setUnderstandingNotes(e.target.value); persist({ understandingNotes: e.target.value }); }}
                    placeholder="Describe the understanding obtained of the relevant field of expertise (e.g. key assumptions, methodologies, standards applicable to the expert's field)…"
                    className="min-h-[100px] text-sm resize-none bg-background"
                    disabled={concluded}
                  />
                </div>
              </CardShell>

              {/* ── Step 6: Terms of Engagement ── */}
              <CardShell
                title="Step 6 — Terms of Engagement"
                subtitle="Confirm a written agreement with the expert covers all required matters"
                badge={<CompletionDot complete={step6Complete} />}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    {TERMS_CHECKLIST.map(term => (
                      <CheckItem
                        key={term.id}
                        checked={termsChecked.includes(term.id)}
                        onChange={() => toggleTerm(term.id)}
                        label={term.label}
                        disabled={concluded}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="text-sm font-medium text-foreground whitespace-nowrap">Written agreement obtained?</label>
                    <YesNoPill
                      value={writtenAgreement}
                      onChange={(v) => { setWrittenAgreement(v); persist({ writtenAgreement: v }); }}
                      disabled={concluded}
                    />
                    <div className="flex items-center gap-2 ml-auto">
                      <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">W/P Ref:</label>
                      <Input
                        value={wpRef}
                        onChange={e => { setWpRef(e.target.value); persist({ wpRef: e.target.value }); }}
                        placeholder="e.g. SAE-01"
                        className="h-8 text-sm w-32"
                        disabled={concluded}
                      />
                    </div>
                  </div>
                </div>
              </CardShell>
            </>
          )}

          {/* ── Conclusion (always shown once Step 1 answered) ── */}
          {expertRequired !== "" && (
            <CardShell title="Conclusion">
              <Textarea
                value={conclusion}
                onChange={e => { setConclusion(e.target.value); persist({ conclusion: e.target.value }); }}
                placeholder={
                  notNeeded
                    ? "Document the rationale for not requiring an auditor's expert on this engagement…"
                    : "Summarise the basis for the selection and any matters arising from the engagement of the expert…"
                }
                className="min-h-[72px] text-sm resize-none bg-background"
                disabled={concluded}
              />
            </CardShell>
          )}

          {/* ── Sign-off ── */}
          {expertRequired !== "" && (
            <div className="bg-card border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
              <div className="px-6 py-4 bg-muted/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Prepared by:</span>
                    <Input
                      className="h-8 text-sm flex-1"
                      value={preparedBy}
                      onChange={e => { setPreparedBy(e.target.value); persist({ preparedBy: e.target.value }); }}
                      placeholder="Name"
                      disabled={concluded}
                    />
                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Date:</span>
                    <Input
                      type="date"
                      className="h-8 text-sm w-36"
                      value={preparedDate}
                      onChange={e => { setPreparedDate(e.target.value); persist({ preparedDate: e.target.value }); }}
                      disabled={concluded}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Reviewed by:</span>
                    <Input
                      className="h-8 text-sm flex-1"
                      value={reviewedBy}
                      onChange={e => { setReviewedBy(e.target.value); persist({ reviewedBy: e.target.value }); }}
                      placeholder="Name"
                      disabled={concluded}
                    />
                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Date:</span>
                    <Input
                      type="date"
                      className="h-8 text-sm w-36"
                      value={reviewedDate}
                      onChange={e => { setReviewedDate(e.target.value); persist({ reviewedDate: e.target.value }); }}
                      disabled={concluded}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Conclude button ── */}
          {expertRequired !== "" && (
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
                Add to My Templates
              </Button>
              <Button
                onClick={() => {
                  setConcluded(true);
                  persist({ concluded: true });
                  toast.success("SAE worksheet concluded");
                }}
                disabled={concluded || !allComplete}
              >
                {concluded ? "Worksheet concluded" : "Conclude worksheet"}
              </Button>
            </div>
          )}

        </div>
      </div>

      <AddToMyTemplatesDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        checklist={{
          title: isUS ? "SAE — Selecting an Auditor's Expert (US)" : "SAE — Selecting an Auditor's Expert",
          sections: [],
          id: isUS ? "sae-us" : "sae-ca",
        }}
      />
    </div>
  );
}
