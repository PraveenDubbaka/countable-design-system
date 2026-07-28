import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckSquare, Square, CheckCircle2 } from "lucide-react";
import { CURRENT_USER } from "@/lib/useTimeEntries";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { WorksheetLayout, WorksheetHeader } from "@/components/audit/WorksheetShell";
import { useEngagementContext } from "@/hooks/useEngagementContext";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SignoffState {
  [itemKey: string]: {
    preparer: boolean;
    reviewer: boolean;
  };
}

interface SignoffsData {
  signoffs: SignoffState;
}

// ── Section / item definitions matching the CA audit engagement tree ──────────

interface SignoffItem {
  code?: string;
  label: string;
  icon: "checklist" | "worksheet" | "letter" | "book" | "doc" | "folder" | "completion";
}

interface SignoffSection {
  key: string;
  title: string;
  items: SignoffItem[];
}

const SIGNOFF_SECTIONS: SignoffSection[] = [
  {
    key: "co",
    title: "Client Onboarding",
    items: [
      { code: "408", label: "Initial Audit Engagements", icon: "checklist" },
      { code: "410", label: "New/Existing Engagement — Acceptance/Continuance", icon: "checklist" },
      { code: "AL1.1", label: "Engagement Letter", icon: "letter" },
    ],
  },
  {
    key: "pl",
    title: "Planning",
    items: [
      { code: "420", label: "Materiality", icon: "worksheet" },
      { code: "428", label: "Auditor's Expert", icon: "worksheet" },
      { code: "430", label: "Overall Audit Strategy", icon: "worksheet" },
      { code: "436", label: "Team Planning Discussions", icon: "worksheet" },
      { code: "450", label: "Time Tracker", icon: "worksheet" },
    ],
  },
  {
    key: "ra-gi",
    title: "Risk Assessment — Gather Information",
    items: [
      { code: "500", label: "Observation & Inspection", icon: "checklist" },
      { code: "501-A", label: "Preliminary Analytical Procedures", icon: "worksheet" },
      { code: "501-B", label: "Preliminary Analytical Procedures", icon: "checklist" },
      { code: "505", label: "Mgmt Inquiries", icon: "checklist" },
      { code: "507", label: "Governance Minutes", icon: "worksheet" },
      { code: "510", label: "Entity Understanding", icon: "worksheet" },
      { code: "511", label: "IT Environment", icon: "worksheet" },
      { code: "514", label: "Prior Period Estimates", icon: "worksheet" },
    ],
  },
  {
    key: "ra-ir",
    title: "Risk Assessment — Identify Risk",
    items: [
      { code: "506", label: "Fraud", icon: "checklist" },
      { code: "513", label: "Accounting Estimates", icon: "worksheet" },
      { code: "515", label: "Related Parties", icon: "worksheet" },
      { code: "525", label: "Going Concern", icon: "checklist" },
      { code: "530", label: "Entity Level — Risks and Controls", icon: "checklist" },
      { code: "580", label: "Revenue Recognition", icon: "worksheet" },
      { code: "520", label: "Risk Register", icon: "worksheet" },
      { code: "590", label: "Engagement Scoping", icon: "worksheet" },
    ],
  },
  {
    key: "ra-pr",
    title: "Risk Assessment — Populate Responses",
    items: [
      { code: "535", label: "Info System", icon: "worksheet" },
      { code: "540", label: "Control Design", icon: "worksheet" },
      { code: "550", label: "Control Activities", icon: "worksheet" },
      { code: "551", label: "General IT Controls", icon: "worksheet" },
      { code: "575", label: "Control Deficiencies", icon: "worksheet" },
    ],
  },
  {
    key: "rp",
    title: "Response to Assessed Risks",
    items: [
      { code: "605", label: "Risk Responses", icon: "worksheet" },
      { code: "610", label: "Sampling — Tests of Details", icon: "worksheet" },
      { code: "625", label: "Going Concern", icon: "worksheet" },
      { code: "630", label: "Confirmations", icon: "worksheet" },
      { code: "635", label: "Accounting Estimates", icon: "worksheet" },
      { code: "645", label: "Litigation, Claims and Non-Compliance", icon: "worksheet" },
      { code: "650", label: "Subsequent Events", icon: "worksheet" },
      { code: "655", label: "Final Analytics", icon: "worksheet" },
      { code: "666", label: "Related Parties", icon: "worksheet" },
      { code: "670", label: "Use of Journal Entries", icon: "worksheet" },
      { code: "680", label: "ASPE Supplementary Audit Procedures", icon: "worksheet" },
    ],
  },
  {
    key: "do",
    title: "Documents",
    items: [
      { code: "SHA", label: "Shareholders Agreements", icon: "folder" },
      { code: "REN", label: "Rental/Lease Agreements", icon: "folder" },
      { code: "INC", label: "Incorporation Documents", icon: "folder" },
      { code: "BAN", label: "Banking Agreements", icon: "folder" },
      { code: "CMA", label: "Contracts & Material Agreements", icon: "folder" },
      { code: "CMB", label: "Corporate Minute Book", icon: "folder" },
      { code: "RCF", label: "Regulatory & Compliance Filings", icon: "folder" },
    ],
  },
  {
    key: "tb",
    title: "Trial Balance & Adjusting Entries",
    items: [
      { label: "Trial Balance & Adjusting Entries", icon: "worksheet" },
    ],
  },
  {
    key: "pr",
    title: "Procedures",
    items: [
      { code: "A", label: "Cash and cash equivalents", icon: "book" },
      { code: "B", label: "Accounts receivable", icon: "book" },
      { code: "C", label: "Inventories", icon: "book" },
      { code: "D", label: "Short-term investments", icon: "book" },
      { code: "E", label: "Loans and notes receivable", icon: "book" },
      { code: "I", label: "Other current assets", icon: "book" },
      { code: "H", label: "Property, plant and equipment", icon: "book" },
      { code: "K", label: "Long-term investments", icon: "book" },
      { code: "BB", label: "Accounts payable", icon: "book" },
      { code: "CC", label: "Taxes payable", icon: "book" },
      { code: "DD", label: "Short-term debt", icon: "book" },
      { code: "JJ", label: "Other long-term liabilities", icon: "book" },
      { code: "KK", label: "Long-term debt", icon: "book" },
      { code: "TT", label: "Equity", icon: "book" },
      { code: "20", label: "Revenue", icon: "book" },
      { code: "30", label: "Cost of sales", icon: "book" },
      { code: "40", label: "Expenses", icon: "book" },
      { code: "80", label: "Other expenses (income)", icon: "book" },
    ],
  },
  {
    key: "fs",
    title: "Financial Statements",
    items: [
      { label: "Cover Page", icon: "doc" },
      { label: "Table of Contents", icon: "doc" },
      { label: "Independent Auditor's Report", icon: "checklist" },
      { label: "Balance Sheet", icon: "doc" },
      { label: "Statement of Income (Loss) and Retained Earnings (Deficit)", icon: "doc" },
      { label: "Statement of Cash Flows", icon: "doc" },
      { label: "Statement of Changes in Equity", icon: "doc" },
      { label: "Notes to Financial Statements", icon: "doc" },
    ],
  },
  {
    key: "so",
    title: "Completion & Signoffs",
    items: [
      { code: "AIM", label: "Accumulation of Identified Misstatements", icon: "completion" },
      { code: "650", label: "Subsequent Events", icon: "worksheet" },
      { code: "314", label: "Management Representations", icon: "checklist" },
      { code: "305", label: "Auditor's Report", icon: "checklist" },
      { code: "306", label: "Modified Opinion", icon: "checklist" },
      { code: "310", label: "Audit Completion", icon: "checklist" },
      { code: "311", label: "Withdrawal", icon: "worksheet" },
      { code: "312", label: "Engagement Partner", icon: "checklist" },
      { code: "313", label: "Supplementary Info", icon: "checklist" },
      { code: "320", label: "Significant Decisions", icon: "worksheet" },
      { code: "325", label: "Key Audit Matters", icon: "worksheet" },
      { code: "330", label: "Findings & Discussion", icon: "worksheet" },
      { code: "335", label: "Identified Misstatements", icon: "worksheet" },
      { code: "340", label: "Mgmt & TCWG Matters", icon: "worksheet" },
      { code: "370", label: "Future Considerations", icon: "worksheet" },
      { code: "375", label: "Consultation", icon: "worksheet" },
      { code: "CM", label: "Completion", icon: "completion" },
      { code: "DC", label: "Disclosure", icon: "checklist" },
    ],
  },
];

// ── Item icon SVG ─────────────────────────────────────────────────────────────

function ItemIcon({ type }: { type: SignoffItem["icon"] }) {
  if (type === "completion") {
    return (
      <svg width="14" height="14" viewBox="0 0 20 16" fill="none" className="flex-shrink-0 opacity-60">
        <path d="M0 12.3646V1.53735C0.069 1.47453 0.068 1.37949 0.096 1.29849C0.347 0.578184 0.824 0.133935 1.55 0.0454982C2.255 -0.0416986 2.965 0.0231824 3.672 0.012851C4.241 0.00417266 4.725 0.219479 5.105 0.674059C5.262 0.887712 5.368 1.12864 5.464 1.3799C5.782 2.20806 6.366 2.62201 7.213 2.62173C8.533 2.62338 9.852 2.62338 11.171 2.62173C11.294 2.62173 11.418 2.61429 11.541 2.61016H11.871H15.97C16.392 2.61016 16.781 2.71926 17.12 2.99407C17.627 3.40733 17.831 3.9644 17.83 4.63304C17.824 7.13861 17.83 9.64418 17.83 12.1497C17.83 12.2183 17.822 12.2865 17.818 12.3564C17.734 12.3588 17.649 12.3634 17.565 12.3634C11.71 12.3648 5.855 12.3652 0 12.3646Z" fill="hsl(var(--primary))"/>
        <path d="M17.565 12.365H0L0 14.4726C0.11 14.6735 0.139 14.909 0.262 15.107C0.566 15.5991 0.979 15.8876 1.536 15.9682C1.849 16.0136 2.156 15.9946 2.469 15.9946C7.667 15.9963 12.866 15.9971 18.065 15.9971C18.102 15.9971 18.14 15.9975 18.178 15.9975C18.346 15.9993 18.521 16.0012 18.72 15.9546C19.217 15.8355 19.561 15.5175 19.727 15.0097C19.924 14.4097 19.832 13.8434 19.458 13.3682C19.146 12.9732 18.704 12.7612 18.178 12.7612C18.022 12.7612 17.794 12.7612 17.565 12.365Z" fill="hsl(var(--primary)/0.4)"/>
      </svg>
    );
  }
  if (type === "book") {
    return (
      <svg width="14" height="14" viewBox="0 0 576 512" fill="currentColor" className="flex-shrink-0 opacity-50 text-muted-foreground">
        <path d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5V78.6c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8V454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5V83.8c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 37.6c-3.3 2.6-5 6.8-5 11V456c0 11.4 11.7 19.3 22.4 15.5z"/>
      </svg>
    );
  }
  if (type === "letter") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-50 text-muted-foreground">
        <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    );
  }
  if (type === "doc") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-50 text-muted-foreground">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      </svg>
    );
  }
  if (type === "folder") {
    return (
      <svg width="14" height="14" viewBox="0 0 576 512" fill="currentColor" className="flex-shrink-0 opacity-50 text-muted-foreground">
        <path d="M88.7 223.8L0 375.8V96C0 60.7 28.7 32 64 32H181.5c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7H416c35.3 0 64 28.7 64 64v32H144c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224H544c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480H32c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2.1-32.1l112-192z"/>
      </svg>
    );
  }
  // default: worksheet / checklist
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-50 text-muted-foreground">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>
    </svg>
  );
}

// ── Cell key ──────────────────────────────────────────────────────────────────

function cellKey(sectionKey: string, itemIdx: number) {
  return `${sectionKey}::${itemIdx}`;
}

// ── Checkbox ──────────────────────────────────────────────────────────────────

function Cb({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className="flex items-center justify-center w-5 h-5 rounded border border-border bg-background hover:border-primary/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-checked={checked}
      role="checkbox"
    >
      {checked ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4 text-muted-foreground/50" />}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AuditSOSignoffsWorksheet() {
  const { engagementId } = useParams<{ engagementId: string }>();
  const ctx = useEngagementContext();
  const storageKey = `audit-so-signoffs-${engagementId ?? "default"}`;

  const [data, setData] = useState<SignoffsData>(
    () => readJsonFromLocalStorage<SignoffsData>(storageKey, { signoffs: {} }) ?? { signoffs: {} }
  );

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 450);
  }, [data, storageKey]);

  function toggle(sectionKey: string, itemIdx: number, role: "preparer" | "reviewer") {
    const k = cellKey(sectionKey, itemIdx);
    setData(d => {
      const prev = d.signoffs[k] ?? { preparer: false, reviewer: false };
      return { ...d, signoffs: { ...d.signoffs, [k]: { ...prev, [role]: !prev[role] } } };
    });
  }

  function signSection(section: SignoffSection, role: "preparer" | "reviewer") {
    setData(d => {
      const next = { ...d.signoffs };
      section.items.forEach((_, idx) => {
        const k = cellKey(section.key, idx);
        const prev = next[k] ?? { preparer: false, reviewer: false };
        next[k] = { ...prev, [role]: true };
      });
      return { ...d, signoffs: next };
    });
  }

  function signAll() {
    setData(d => {
      const next = { ...d.signoffs };
      SIGNOFF_SECTIONS.forEach(section => {
        section.items.forEach((_, idx) => {
          const k = cellKey(section.key, idx);
          next[k] = { preparer: true, reviewer: true };
        });
      });
      return { ...d, signoffs: next };
    });
  }

  // Overall progress
  let totalItems = 0;
  let totalDone = 0;
  SIGNOFF_SECTIONS.forEach(s => {
    s.items.forEach((_, idx) => {
      totalItems++;
      const cell = data.signoffs[cellKey(s.key, idx)];
      if (cell?.preparer && cell?.reviewer) totalDone++;
    });
  });

  return (
    <WorksheetLayout
      heading="Canada > Completion & Signoffs"
      objective="File completion signoffs — confirm all working papers have been reviewed and all items are complete before issuing the auditor's report."
      standard="CAS 220"
    >
      <WorksheetHeader
        ctx={ctx}
        formNo="SO"
        title="Signoffs"
        standard="CAS 220"
        overallRisk={undefined}
      />

      {/* ── Master sheet ─────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-md overflow-hidden shadow-[0_2px_8px_hsl(213_40%_20%/0.06)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                File Completion Checklist
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider w-20">Done</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-72">Team</th>
            </tr>
          </thead>
          <tbody>
            {/* Master row */}
            <tr className="border-b border-border bg-muted/20">
              <td className="px-4 py-3 text-sm font-semibold text-foreground">Signoffs Master Sheet</td>
              <td className="px-4 py-2 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[11px] font-semibold text-primary">{totalDone}/{totalItems}</span>
                  {totalDone === totalItems && totalItems > 0 && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground flex-shrink-0">
                      {(CURRENT_USER.name || "U").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-[12px]">
                      <div className="font-semibold text-foreground">{CURRENT_USER.name || "Current User"}</div>
                      <div className="text-muted-foreground">Preparer</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={signAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-fit"
                  >
                    <CheckSquare className="h-3 w-3" />
                    SignOff All
                  </button>
                </div>
              </td>
            </tr>

            {/* Sections */}
            {SIGNOFF_SECTIONS.map(section => {
              let sectionPrep = 0;
              let sectionRev = 0;
              section.items.forEach((_, idx) => {
                const cell = data.signoffs[cellKey(section.key, idx)];
                if (cell?.preparer) sectionPrep++;
                if (cell?.reviewer) sectionRev++;
              });
              const sectionAllDone = sectionPrep === section.items.length && sectionRev === section.items.length;

              return (
                <>
                  {/* Section header row */}
                  <tr key={`${section.key}-hdr`} className="border-b border-border bg-muted/10">
                    <td className="px-4 py-2 text-sm font-semibold text-foreground">
                      {section.title}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className="text-[11px] text-muted-foreground">{sectionPrep}/{section.items.length}</span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => signSection(section, "preparer")}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          sectionAllDone
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {sectionAllDone ? <CheckCircle2 className="h-3 w-3" /> : <CheckSquare className="h-3 w-3" />}
                        {sectionAllDone ? "Signed off" : "Signoff section"}
                      </button>
                    </td>
                  </tr>

                  {/* Item rows */}
                  {section.items.map((item, idx) => {
                    const k = cellKey(section.key, idx);
                    const cell = data.signoffs[k] ?? { preparer: false, reviewer: false };
                    return (
                      <tr key={k} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-2">
                          <div className="flex items-center gap-2">
                            <ItemIcon type={item.icon} />
                            {item.code && (
                              <span className="text-[11px] font-semibold text-primary flex-shrink-0">{item.code}</span>
                            )}
                            <span className="text-sm text-foreground">{item.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex justify-center">
                            <Cb
                              checked={cell.preparer}
                              onChange={() => toggle(section.key, idx, "preparer")}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            <Cb
                              checked={cell.reviewer}
                              onChange={() => toggle(section.key, idx, "reviewer")}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </WorksheetLayout>
  );
}
