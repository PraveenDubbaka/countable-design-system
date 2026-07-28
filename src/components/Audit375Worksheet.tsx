import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { RefButton, type RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { useEngagementContext } from "@/hooks/useEngagementContext";
import { WorksheetLayout, WorksheetHeader, ConcludeBar, type SignOffData } from "@/components/audit/WorksheetShell";

type RefField = RefDoc[];

interface SignOff375 extends SignOffData {
  approvedBy: string;
  approvedDate: string;
}

interface Data375 {
  personsConsulted: string;
  engagementLetterDate: string;
  engagementLetterWpRef: RefField;
  consultationDates: string;
  natureDescription: string;
  natureWpRef: RefField;
  standardsDescription: string;
  standardsWpRef: RefField;
  workPerformed: string;
  workPerformedWpRef: RefField;
  conclusion: string;
  conclusionWpRef: RefField;
  signOff: SignOff375;
  concluded: boolean;
  concludedOn: string;
}

function buildDefault(): Data375 {
  return {
    personsConsulted: "",
    engagementLetterDate: "",
    engagementLetterWpRef: [],
    consultationDates: "",
    natureDescription: "",
    natureWpRef: [],
    standardsDescription: "",
    standardsWpRef: [],
    workPerformed: "",
    workPerformedWpRef: [],
    conclusion: "",
    conclusionWpRef: [],
    signOff: { preparedBy: "", preparedDate: "", reviewedBy: "", reviewedDate: "", approvedBy: "", approvedDate: "" },
    concluded: false,
    concludedOn: "",
  };
}

const CARD = "bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden";
const SECTION_HEAD = "px-5 py-2.5 bg-foreground text-background text-sm font-semibold uppercase tracking-wider";
const TH = "px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border";
const TD = "px-4 py-2.5 text-sm text-foreground border-b border-border align-top";

interface SectionProps {
  heading: string;
  subheading?: string;
  content: string;
  wpRef: RefField;
  locked: boolean;
  placeholder: string;
  onChange: (v: string) => void;
  onAttach: (doc: RefDoc) => void;
  onRemove: (i: number) => void;
}

function Section({ heading, subheading, content, wpRef, locked, placeholder, onChange, onAttach, onRemove }: SectionProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className={SECTION_HEAD + " w-auto text-left"}>{heading}{subheading && <span className="block font-normal normal-case tracking-normal text-xs mt-0.5 text-background/70">{subheading}</span>}</th>
          <th className={SECTION_HEAD + " w-28 text-center"}>W/P Ref.</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={TD}>
            <Textarea
              disabled={locked}
              value={content}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[120px] text-sm resize-none"
            />
          </td>
          <td className={TD + " w-28 text-center"}>
            <RefButton
              reference={wpRef}
              onAttach={onAttach}
              onRemove={onRemove}
              disabled={locked}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function Audit375Worksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const storageKey = `audit-375-data-${engagementId ?? "default"}`;
  const [data, setData] = useState<Data375>(
    () => readJsonFromLocalStorage<Data375>(storageKey, buildDefault()) ?? buildDefault(),
  );

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  const locked = data.concluded;

  function upd<K extends keyof Data375>(key: K, val: Data375[K]) {
    setData(d => ({ ...d, [key]: val }));
  }

  return (
    <WorksheetLayout
      heading="Canada > Completion & Signoffs"
      objective="To document the nature of the consultation, key issues identified, and conclusion or outcome."
      standard={`${ctx.standardPrefix} 220`}
    >
      <WorksheetHeader
        ctx={ctx}
        formNo="375"
        title="Documenting Consultation"
        standard={`${ctx.standardPrefix} 220`}
        overallRisk={undefined}
      />

      {/* ── Note ────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-md border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 text-sm">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
        <div className="space-y-1">
          <p className="font-semibold">Notes:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Use a separate worksheet for each consultation.</li>
            <li>Record details of the work performed in the relevant section of the engagement file. Only provide a summary on this worksheet.</li>
          </ul>
        </div>
      </div>

      {/* ── Consultation Info ─────────────────────────────────────────── */}
      <div className={CARD}>
        <div className="px-5 py-3 border-b border-border">
          <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Consultation details</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className={TH + " w-[220px]"}>Field</th>
                <th className={TH}>Value</th>
                <th className={TH + " w-28 text-center"}>W/P Ref.</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-muted/20">
                <td className={TD + " font-medium"}>Persons consulted</td>
                <td className={TD}>
                  <Textarea
                    disabled={locked}
                    value={data.personsConsulted}
                    onChange={e => upd("personsConsulted", e.target.value)}
                    placeholder="Name(s) and role(s) of person(s) consulted…"
                    className="min-h-[56px] text-sm resize-none"
                  />
                </td>
                <td className={TD + " w-28"} />
              </tr>
              <tr className="hover:bg-muted/20">
                <td className={TD + " font-medium text-sm"}>
                  <span>Date of engagement letter</span>
                  <span className="block font-normal text-xs text-muted-foreground mt-0.5">(if consultant is external to the Firm)</span>
                </td>
                <td className={TD}>
                  <Input
                    disabled={locked}
                    type="date"
                    value={data.engagementLetterDate}
                    onChange={e => upd("engagementLetterDate", e.target.value)}
                    className="h-9 text-sm max-w-[200px]"
                  />
                </td>
                <td className={TD + " w-28 text-center"}>
                  <RefButton
                    reference={data.engagementLetterWpRef}
                    onAttach={doc => upd("engagementLetterWpRef", [...data.engagementLetterWpRef, doc])}
                    onRemove={i => upd("engagementLetterWpRef", data.engagementLetterWpRef.filter((_, i2) => i2 !== i))}
                    disabled={locked}
                  />
                </td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className={TD + " font-medium"}>Date(s) of consultation</td>
                <td className={TD}>
                  <Input
                    disabled={locked}
                    value={data.consultationDates}
                    onChange={e => upd("consultationDates", e.target.value)}
                    placeholder="e.g. 2025-03-14, 2025-03-21"
                    className="h-9 text-sm"
                  />
                </td>
                <td className={TD + " w-28"} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Nature of consultation ────────────────────────────────────── */}
      <div className={CARD}>
        <Section
          heading="Describe the need for and the nature of the consultation."
          content={data.natureDescription}
          wpRef={data.natureWpRef}
          locked={locked}
          placeholder="Describe why the consultation was needed and its nature…"
          onChange={v => upd("natureDescription", v)}
          onAttach={doc => upd("natureWpRef", [...data.natureWpRef, doc])}
          onRemove={i => upd("natureWpRef", data.natureWpRef.filter((_, i2) => i2 !== i))}
        />
      </div>

      {/* ── Standards & work performed ───────────────────────────────── */}
      <div className={CARD}>
        <Section
          heading="Document the relevant accounting or auditing standards being addressed."
          content={data.standardsDescription}
          wpRef={data.standardsWpRef}
          locked={locked}
          placeholder="Cite the relevant CAS, ASPE, or other standards…"
          onChange={v => upd("standardsDescription", v)}
          onAttach={doc => upd("standardsWpRef", [...data.standardsWpRef, doc])}
          onRemove={i => upd("standardsWpRef", data.standardsWpRef.filter((_, i2) => i2 !== i))}
        />
        <Section
          heading="Document the work performed, including issues raised, analysis and discussions."
          subheading="Also document possible alternatives for how the transaction/disclosure could have been accounted for."
          content={data.workPerformed}
          wpRef={data.workPerformedWpRef}
          locked={locked}
          placeholder="Summarize issues raised, analysis, discussions, and alternative accounting treatments considered…"
          onChange={v => upd("workPerformed", v)}
          onAttach={doc => upd("workPerformedWpRef", [...data.workPerformedWpRef, doc])}
          onRemove={i => upd("workPerformedWpRef", data.workPerformedWpRef.filter((_, i2) => i2 !== i))}
        />
      </div>

      {/* ── Conclusion ───────────────────────────────────────────────── */}
      <div className={CARD}>
        <Section
          heading="Document the conclusion or outcome."
          content={data.conclusion}
          wpRef={data.conclusionWpRef}
          locked={locked}
          placeholder="State the agreed conclusion or outcome of the consultation…"
          onChange={v => upd("conclusion", v)}
          onAttach={doc => upd("conclusionWpRef", [...data.conclusionWpRef, doc])}
          onRemove={i => upd("conclusionWpRef", data.conclusionWpRef.filter((_, i2) => i2 !== i))}
        />
      </div>

      {/* ── Extended sign-off (includes Approved by) ─────────────────── */}
      <div className={CARD}>
        <div className="px-5 py-3 border-b border-border">
          <span className="text-sm font-semibold text-foreground uppercase tracking-wider">Sign-off</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <tbody>
              <tr className="bg-muted/40">
                <td className={TD + " w-[130px] font-medium"}>Prepared by</td>
                <td className={TD}>
                  <Input disabled={locked} value={data.signOff.preparedBy} onChange={e => upd("signOff", { ...data.signOff, preparedBy: e.target.value })} placeholder="Name" className="h-8 text-sm" />
                </td>
                <td className={TD + " w-20 font-medium"}>Date</td>
                <td className={TD}>
                  <Input disabled={locked} type="date" value={data.signOff.preparedDate} onChange={e => upd("signOff", { ...data.signOff, preparedDate: e.target.value })} className="h-8 text-sm" />
                </td>
                <td className={TD + " w-[130px] font-medium"}>Reviewed by</td>
                <td className={TD}>
                  <Input disabled={locked} value={data.signOff.reviewedBy} onChange={e => upd("signOff", { ...data.signOff, reviewedBy: e.target.value })} placeholder="Name" className="h-8 text-sm" />
                </td>
                <td className={TD + " w-20 font-medium"}>Date</td>
                <td className={TD}>
                  <Input disabled={locked} type="date" value={data.signOff.reviewedDate} onChange={e => upd("signOff", { ...data.signOff, reviewedDate: e.target.value })} className="h-8 text-sm" />
                </td>
              </tr>
              <tr>
                <td className={TD + " font-medium"}>Approved by</td>
                <td className={TD}>
                  <Input disabled={locked} value={(data.signOff as SignOff375).approvedBy} onChange={e => upd("signOff", { ...data.signOff, approvedBy: e.target.value })} placeholder="Engagement partner / practitioner" className="h-8 text-sm" />
                </td>
                <td className={TD + " font-medium"}>Date</td>
                <td className={TD}>
                  <Input disabled={locked} type="date" value={(data.signOff as SignOff375).approvedDate} onChange={e => upd("signOff", { ...data.signOff, approvedDate: e.target.value })} className="h-8 text-sm" />
                </td>
                <td colSpan={4} className={TD + " text-xs text-muted-foreground italic"}>Engagement partner / practitioner</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ConcludeBar
        worksheetKey="audit-375"
        engagementId={engagementId}
        concluded={data.concluded}
        concludedOn={data.concludedOn}
        onConclude={() => {
          const u = { ...data, concluded: true, concludedOn: new Date().toISOString() };
          setData(u); writeJsonToLocalStorage(storageKey, u);
        }}
        onReopen={() => {
          const u = { ...data, concluded: false, concludedOn: "" };
          setData(u); writeJsonToLocalStorage(storageKey, u);
        }}
      />
    </WorksheetLayout>
  );
}
