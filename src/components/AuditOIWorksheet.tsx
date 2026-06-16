import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddToMyTemplatesDialog } from "@/components/AddToMyTemplatesDialog";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";

// ── Sub-components ─────────────────────────────────────────────────────────────

function TdInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-8 text-sm ${className}`}
    />
  );
}

function TdTextarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-h-[120px] text-sm resize-none w-full"
    />
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProcedureRow {
  wpRef: string;
  psc: string;
  comments: string;
}

interface OIData {
  entity: string;
  periodEnded: string;
  proc1: ProcedureRow;
  proc2: ProcedureRow;
  preparedBy: string;
  preparedDate: string;
  reviewedBy: string;
  reviewedDate: string;
}

const DEFAULT: OIData = {
  entity: "",
  periodEnded: "",
  proc1: { wpRef: "", psc: "", comments: "" },
  proc2: { wpRef: "", psc: "", comments: "" },
  preparedBy: "",
  preparedDate: "",
  reviewedBy: "",
  reviewedDate: "",
};

// ── Main component ─────────────────────────────────────────────────────────────

export function AuditOIWorksheet({ isUS = false }: { isUS?: boolean }) {
  const storageKey = `audit-oi-data-${isUS ? "us" : "ca"}`;
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [data, setData] = useState<OIData>(() => {
    const saved = readJsonFromLocalStorage<OIData | null>(storageKey, null);
    return saved ? { ...DEFAULT, ...saved } : DEFAULT;
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const set = (patch: Partial<OIData>) => setData((d) => ({ ...d, ...patch }));
  const setProc = (key: "proc1" | "proc2", patch: Partial<ProcedureRow>) =>
    setData((d) => ({ ...d, [key]: { ...d[key], ...patch } }));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Form 500</p>
          <h1 className="text-xl font-semibold text-foreground">
            Observation and Inspection Procedures
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Risk assessment worksheet</p>
        </div>
        <button
          onClick={() => setShowAddDialog(true)}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors flex-shrink-0 mt-1"
        >
          Add to my templates
        </button>
      </div>

      {/* Entity / Period header */}
      <div className="rounded-lg border border-border bg-card">
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="px-4 py-3 flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground w-24 flex-shrink-0">Entity</span>
            <TdInput value={data.entity} onChange={(v) => set({ entity: v })} placeholder="Entity name" />
          </div>
          <div className="px-4 py-3 flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground w-28 flex-shrink-0">Period ended</span>
            <TdInput value={data.periodEnded} onChange={(v) => set({ periodEnded: v })} placeholder="e.g. March 31, 2024" />
          </div>
        </div>
      </div>

      {/* Objective */}
      <div className="rounded-lg border border-border bg-card px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Objective</p>
        <p className="text-sm text-foreground font-medium leading-relaxed">
          To provide a listing of typical observation and inspection risk assessment procedures that may:
        </p>
        <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-foreground">
          <li>Support, corroborate or contradict other inquiries of management and others.</li>
          <li>Provide information about the entity and its environment.</li>
        </ul>
      </div>

      {/* Notes */}
      <div className="rounded-lg border border-border bg-muted/30 px-5 py-3 space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Note:</span> Use this form in conjunction with Form 510.
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">PSC</span> = Procedure successfully completed.
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">TCWG</span> = Those charged with governance.
        </p>
      </div>

      {/* Procedures table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="bg-muted/50 px-5 py-2.5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Observation and Inspection Procedures
          </p>
        </div>

        {/* Column headers */}
        <div className="grid border-b border-border" style={{ gridTemplateColumns: "1fr 100px 130px 1fr" }}>
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground" />
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-l border-border">W/P ref.</div>
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-l border-border">PSC? (Y/N / Initials)</div>
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-l border-border">Responses / comments</div>
        </div>

        {/* Procedure 1 */}
        <div className="grid border-b border-border" style={{ gridTemplateColumns: "1fr 100px 130px 1fr" }}>
          <div className="px-4 py-4 text-sm text-foreground space-y-3">
            <p className="font-semibold">1. Inspection of key documents</p>
            <p className="text-muted-foreground leading-relaxed">
              Obtain and read key entity documents. Then record or update (on Form 510 or 520) any risk factors identified
              that may require an audit response.
            </p>
            <p className="text-muted-foreground">Indicate what documents were inspected, such as:</p>
            <ol className="space-y-1 text-sm text-foreground" style={{ listStyleType: "lower-alpha", paddingLeft: "1.25rem" }}>
              <li>Business plans, financial budgets and cash flow projections.</li>
              <li>Risk assessments.</li>
              <li>Terms of new financing arrangements.</li>
              <li>Significant contracts and agreements.</li>
              <li>Financial and other reports prepared by management.</li>
              <li>Minutes of directors'/audit committee meetings (refer to Form 507).</li>
              <li>Reports/letters, etc., from regulators or government agencies.</li>
              <li>Tax assessments and correspondence.</li>
              <li>Details of actual/threatened litigation, including correspondence with external legal counsel.</li>
              <li>Policy and procedure manuals.</li>
              <li>Consultant reports on financial or organizational matters.</li>
              <li>
                Communications with staff or TCWG that address organizational changes, views on business
                practices/ethical behaviour, processes for identifying and responding to the risks of fraud, or other
                relevant matters.
              </li>
              <li>Media articles about the entity, its industry and direct competitors.</li>
              <li className="space-y-1">
                <span>Other key documents (possibly identified as a result of inquiries of management and others) (See Form 505):</span>
                <div className="mt-1 space-y-1 pl-1">
                  <div className="border-b border-dashed border-muted-foreground/30 h-5" />
                  <div className="border-b border-dashed border-muted-foreground/30 h-5" />
                  <div className="border-b border-dashed border-muted-foreground/30 h-5" />
                </div>
              </li>
            </ol>
          </div>
          <div className="px-3 py-4 border-l border-border">
            <TdInput value={data.proc1.wpRef} onChange={(v) => setProc("proc1", { wpRef: v })} placeholder="Ref." />
          </div>
          <div className="px-3 py-4 border-l border-border">
            <TdInput value={data.proc1.psc} onChange={(v) => setProc("proc1", { psc: v })} placeholder="Y / N / initials" />
          </div>
          <div className="px-3 py-4 border-l border-border">
            <TdTextarea
              value={data.proc1.comments}
              onChange={(v) => setProc("proc1", { comments: v })}
              placeholder="Enter responses or comments…"
            />
          </div>
        </div>

        {/* Procedure 2 */}
        <div className="grid" style={{ gridTemplateColumns: "1fr 100px 130px 1fr" }}>
          <div className="px-4 py-4 text-sm text-foreground space-y-3">
            <p className="font-semibold">2. Observation of entity operations, premises and plant facilities</p>
            <p className="text-muted-foreground leading-relaxed">
              Visit the entity's premises, walk around the operations and talk with staff. Record or update (on Form 520
              or equivalent) any risk factors identified that may require an audit response. Consider the following:
            </p>
            <ol className="space-y-1 text-sm text-foreground" style={{ listStyleType: "lower-alpha", paddingLeft: "1.25rem" }}>
              <li>Nature of operations.</li>
              <li>How operations are organized and managed.</li>
              <li>Staff and management morale, knowledge and general competency.</li>
              <li>Poor security over fixed assets and inventories (storage and handling).</li>
              <li>Unorganized, obsolete or slow-moving inventory.</li>
              <li>Idle or unused plant and equipment.</li>
              <li>Deficiencies in financial control systems and IT support.</li>
              <li>
                Possible non-compliance with laws or regulations with a financial impact (such as handling of waste and
                toxic materials).
              </li>
              <li>Other (specify).</li>
            </ol>
          </div>
          <div className="px-3 py-4 border-l border-border">
            <TdInput value={data.proc2.wpRef} onChange={(v) => setProc("proc2", { wpRef: v })} placeholder="Ref." />
          </div>
          <div className="px-3 py-4 border-l border-border">
            <TdInput value={data.proc2.psc} onChange={(v) => setProc("proc2", { psc: v })} placeholder="Y / N / initials" />
          </div>
          <div className="px-3 py-4 border-l border-border">
            <TdTextarea
              value={data.proc2.comments}
              onChange={(v) => setProc("proc2", { comments: v })}
              placeholder="Enter responses or comments…"
            />
          </div>
        </div>
      </div>

      {/* Sign-off */}
      <div className="rounded-lg border border-border bg-card">
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-24 flex-shrink-0">Prepared by</span>
              <TdInput value={data.preparedBy} onChange={(v) => set({ preparedBy: v })} placeholder="Name" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-24 flex-shrink-0">Date</span>
              <TdInput value={data.preparedDate} onChange={(v) => set({ preparedDate: v })} placeholder="YYYY-MM-DD" />
            </div>
          </div>
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-28 flex-shrink-0">Reviewed by</span>
              <TdInput value={data.reviewedBy} onChange={(v) => set({ reviewedBy: v })} placeholder="Name" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground w-28 flex-shrink-0">Date</span>
              <TdInput value={data.reviewedDate} onChange={(v) => set({ reviewedDate: v })} placeholder="YYYY-MM-DD" />
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        PEG Forms — Audits © 2022 CPA Canada PEG
      </p>

      <AddToMyTemplatesDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        defaultName="Form 500 — Observation and Inspection Procedures"
      />
    </div>
  );
}
