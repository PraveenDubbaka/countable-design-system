import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Info, AlertTriangle } from "lucide-react";
import { RefButton, RefDoc } from "@/components/RefButton";
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

type YN = "Y" | "N" | "";
type RefField = RefDoc[];

interface ITApplication {
  id: string;
  num: number;
  name: string;
  appType: string;
  network: string;
  database: string;
  os: string;
  purpose: string;
  relevant: YN;
}

interface AppDetail {
  automation: string;
  systemReports: string;
  dataInputs: string;
  volumeComplexity: string;
  emergingTech: string;
}

interface ProcessRow {
  psc: string;
  wpRef: RefField;
  response: string;
}

interface TestingCheck {
  automatedSignificant: boolean;
  automatedPlanned: boolean;
  systemReportsRelied: boolean;
  substantiveInsufficient: boolean;
  gitcRelevant: boolean;
}

interface Data511 {
  // Part A
  aGovernance: string;
  aGovernanceWp: RefField;
  aOrgStructure: string;
  aOrgStructureWp: RefField;
  aLawsRegs: string;
  aLawsRegsWp: RefField;

  // Part B
  apps: ITApplication[];
  appDetails: Record<string, AppDetail>;

  // Part C
  cSecurity: ProcessRow;
  cSecurityBreaches: ProcessRow;
  cProgramChanges: ProcessRow;
  cDataConversion: ProcessRow;
  cItOperations: ProcessRow;

  // Part D
  dComplexity: ProcessRow;
  dFsRisks: ProcessRow;
  dTestingChecks: TestingCheck;
  dTestingResponse: ProcessRow;
  conclusion: string;
  concluded: boolean;
  concludedOn: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const emptyApp = (num: number): ITApplication => ({
  id: uid(), num, name: "", appType: "", network: "", database: "", os: "", purpose: "", relevant: "",
});

const emptyAppDetail = (): AppDetail => ({
  automation: "", systemReports: "", dataInputs: "", volumeComplexity: "", emergingTech: "",
});

const emptyProcess = (): ProcessRow => ({ psc: "", wpRef: [], response: "" });

const emptyChecks = (): TestingCheck => ({
  automatedSignificant: false,
  automatedPlanned: false,
  systemReportsRelied: false,
  substantiveInsufficient: false,
  gitcRelevant: false,
});

function buildDefault(): Data511 {
  return {
    aGovernance: "", aGovernanceWp: [],
    aOrgStructure: "", aOrgStructureWp: [],
    aLawsRegs: "", aLawsRegsWp: [],
    apps: [emptyApp(1)],
    appDetails: {},
    cSecurity: emptyProcess(),
    cSecurityBreaches: emptyProcess(),
    cProgramChanges: emptyProcess(),
    cDataConversion: emptyProcess(),
    cItOperations: emptyProcess(),
    dComplexity: emptyProcess(),
    dFsRisks: emptyProcess(),
    dTestingChecks: emptyChecks(),
    dTestingResponse: emptyProcess(),
    conclusion: "",
    concluded: false,
    concludedOn: "",
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-card text-card-foreground border border-border shadow-[0_2px_8px_hsl(213_40%_20%/0.06)] rounded-md overflow-hidden">
      <div className="px-6 py-3.5 bg-card border-b border-border">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function PartHeader({ letter, title, description }: { letter: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 pb-1">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-primary text-white text-xs font-bold shrink-0 mt-0.5">
        {letter}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function NarrativeRow({ label, bullets, value, wpRef, locked, onChange, onWpChange }: {
  label: string;
  bullets?: string[];
  value: string;
  wpRef: RefField;
  locked: boolean;
  onChange: (v: string) => void;
  onWpChange: (r: RefField) => void;
}) {
  return (
    <tr className="group hover:bg-muted/30 transition-colors align-top">
      <td className="px-5 py-3 text-sm text-foreground w-[38%]">
        <span className="font-medium">{label}</span>
        {bullets && (
          <ul className="mt-1.5 space-y-0.5 list-disc list-inside">
            {bullets.map((b, i) => <li key={i} className="text-xs text-muted-foreground">{b}</li>)}
          </ul>
        )}
      </td>
      <td className="px-4 py-3">
        <Textarea
          disabled={locked}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter response…"
          className="min-h-[72px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
        />
      </td>
      <td className="px-4 py-3 text-center w-[100px]">
        <RefButton
          reference={wpRef}
          onAttach={doc => onWpChange([...wpRef, doc])}
          onRemove={i => onWpChange(wpRef.filter((_, idx) => idx !== i))}
          disabled={locked}
        />
      </td>
    </tr>
  );
}

function ProcessTable({ rows, locked, onChange }: {
  rows: { id: string; label: string; bullets?: string[]; row: ProcessRow }[];
  locked: boolean;
  onChange: (id: string, patch: Partial<ProcessRow>) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted border-b border-border">
            <th className="px-5 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-[36%]">Procedure</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Response / Comments</th>
            <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-28">PSC? (Y/N)</th>
            <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-24">W/P Ref.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map(({ id, label, bullets, row }) => (
            <tr key={id} className="group hover:bg-muted/30 transition-colors align-top">
              <td className="px-5 py-3 text-sm text-foreground">
                <span className="font-medium">{label}</span>
                {bullets && (
                  <ul className="mt-1.5 space-y-0.5 list-disc list-inside">
                    {bullets.map((b, i) => <li key={i} className="text-xs text-muted-foreground">{b}</li>)}
                  </ul>
                )}
              </td>
              <td className="px-4 py-3">
                <Textarea
                  disabled={locked}
                  value={row.response}
                  onChange={e => onChange(id, { response: e.target.value })}
                  placeholder="Enter response…"
                  className="min-h-[64px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                />
              </td>
              <td className="px-4 py-3 w-28">
                <Select value={row.psc} onValueChange={v => onChange(id, { psc: v })} disabled={locked}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">Y</SelectItem>
                    <SelectItem value="N">N</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="px-4 py-3 text-center w-24">
                <RefButton
                  reference={row.wpRef}
                  onAttach={doc => onChange(id, { wpRef: [...row.wpRef, doc] })}
                  onRemove={i => onChange(id, { wpRef: row.wpRef.filter((_, idx) => idx !== i) })}
                  disabled={locked}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function Audit511Worksheet({ isUS = false }: { isUS?: boolean }) {
  const storageKey = `audit-511-data-${isUS ? "us" : "ca"}`;

  const [data, setData] = useState<Data511>(() => {
    const saved = readJsonFromLocalStorage<Data511 | null>(storageKey, null);
    if (!saved) return buildDefault();
    const def = buildDefault();
    return { ...def, ...saved };
  });

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const t = setTimeout(() => writeJsonToLocalStorage(storageKey, data), 600);
    return () => clearTimeout(t);
  }, [data, storageKey]);

  const locked = data.concluded;

  function patch<K extends keyof Data511>(key: K, val: Data511[K]) {
    setData(d => ({ ...d, [key]: val }));
  }

  function patchProcess(key: keyof Data511, partial: Partial<ProcessRow>) {
    setData(d => ({ ...d, [key]: { ...(d[key] as ProcessRow), ...partial } }));
  }

  // App management
  function addApp() {
    const num = data.apps.length + 1;
    const newApp = emptyApp(num);
    setData(d => ({ ...d, apps: [...d.apps, newApp] }));
  }

  function updateApp(idx: number, partial: Partial<ITApplication>) {
    setData(d => {
      const apps = [...d.apps];
      apps[idx] = { ...apps[idx], ...partial };
      return { ...d, apps };
    });
  }

  function deleteApp(idx: number) {
    setData(d => {
      const apps = d.apps.filter((_, i) => i !== idx).map((a, i) => ({ ...a, num: i + 1 }));
      return { ...d, apps };
    });
  }

  function getAppDetail(id: string): AppDetail {
    return data.appDetails[id] ?? emptyAppDetail();
  }

  function updateAppDetail(id: string, partial: Partial<AppDetail>) {
    setData(d => ({
      ...d,
      appDetails: { ...d.appDetails, [id]: { ...getAppDetail(id), ...partial } },
    }));
  }

  // Part C process rows
  const PART_C_KEYS = ["cSecurity", "cSecurityBreaches", "cProgramChanges", "cDataConversion", "cItOperations"] as const;

  function patchPartC(id: string, partial: Partial<ProcessRow>) {
    const key = id as typeof PART_C_KEYS[number];
    patchProcess(key, partial);
  }

  const partCRows: { id: string; label: string; bullets?: string[]; row: ProcessRow }[] = [
    {
      id: "cSecurity",
      label: "1. IT security",
      bullets: [
        "Authentication — unique user IDs and complex passwords.",
        "User access management — how users are added, modified and removed.",
        "Privileged (system administrator) user access management.",
        "Physical access — how IT systems are physically protected.",
        "Security monitoring — firewalls, security logs, periodic access reviews.",
        "Cyber risks — anti-virus, anti-spam, notifications monitored by management.",
      ],
      row: data.cSecurity,
    },
    {
      id: "cSecurityBreaches",
      label: "2. IT security breaches",
      bullets: [
        "Document any breaches or cyber incidents (e.g., ransomware) during the audit year.",
        "Note the impact of any breach on the planned audit approach.",
      ],
      row: data.cSecurityBreaches,
    },
    {
      id: "cProgramChanges",
      label: "3. Program changes",
      bullets: [
        "Frequency and implementation of program changes to key IT systems.",
        "Whether the entity can modify the source code of key financial software.",
        "Nature and extent of modifications made during the period.",
        "Process for upgrading software and converting data (e.g., vendor patches).",
        "Minor/major version upgrades, new releases or platform changes.",
        "Key configurations made to financial applications (e.g., tolerance limits).",
      ],
      row: data.cProgramChanges,
    },
    {
      id: "cDataConversion",
      label: "4. Data conversion",
      bullets: [
        "Document any major data conversions during the year and the risks/impact to the audit.",
      ],
      row: data.cDataConversion,
    },
    {
      id: "cItOperations",
      label: "5. IT operations",
      bullets: [
        "Data backup and recovery — financial data backed up and tested for recovery.",
        "Job scheduling and monitoring — production jobs operate as intended.",
      ],
      row: data.cItOperations,
    },
  ];

  const APP_DETAIL_TOPICS: { key: keyof AppDetail; label: string; bullets?: string[] }[] = [
    {
      key: "automation",
      label: "Automation",
      bullets: [
        "Extent to which management relies on automated controls to ensure completeness and accuracy of financial information.",
        "E.g., does management rely on automated controls within the inventory system to calculate cost of inventory?",
      ],
    },
    {
      key: "systemReports",
      label: "System generated reports",
      bullets: [
        "Extent of the entity's reliance on system generated reports in the processing of information.",
        "If management relies on system-generated reports and the audit team intends to rely on them without testing GITCs, the reports must be substantively tested.",
      ],
    },
    {
      key: "dataInputs",
      label: "Data inputs and system interfaces",
      bullets: [
        "How financial information is recorded (manual data inputs vs. automated inputs).",
        "Number of interfaces between key financial systems and how management monitors them.",
        "Whether anyone has direct access to the financial system database to record, modify or delete data.",
      ],
    },
    {
      key: "volumeComplexity",
      label: "Volume and complexity of data",
      bullets: [
        "Volume and complexity of financial transactions processed in the year.",
        "Whether transactions and source information are stored in paper or digital form.",
        "Greater volume/complexity increases reliance on automated controls.",
      ],
    },
    {
      key: "emergingTech",
      label: "Emerging technologies",
      bullets: [
        "Use or development of emerging technologies affecting the entity's financial reporting processes or internal controls (e.g., blockchain, RPA, AI).",
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Objective bar */}
      <div className="px-6 py-2.5 border-b border-border bg-primary/[0.03] flex items-start gap-2 shrink-0">
        <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <span className="text-xs font-semibold text-primary whitespace-nowrap">Objective:</span>
        <p className="text-xs text-muted-foreground flex-1 leading-relaxed">
          Gain an understanding of the entity's IT environment and assess the overall criticality of IT to the entity and impact on the audit approach. Complete Parts A–C, then Form 535 to document information flows. Identified RAFUIT and GITCs are documented on Form 551.
        </p>
      </div>

      {/* Abbreviations pill row */}
      <div className="px-6 py-2 border-b border-border bg-card shrink-0 flex items-center gap-3 flex-wrap">
        {[
          ["F/S", "Financial statements"],
          ["PSC", "Procedure successfully completed"],
          ["GITC", "General information technology controls"],
          ["RAFUIT", "Risks arising from the use of IT"],
        ].map(([abbr, meaning]) => (
          <span key={abbr} className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">{abbr}</span> = {meaning}
          </span>
        ))}
      </div>

      {/* Single scrollable page */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-6 max-w-6xl">

          {/* ── PART A ─────────────────────────────────────────────────────── */}
          <PartHeader
            letter="A"
            title="IT Governance, Strategy and Structure"
            description="Understand and document the entity's overall IT governance, strategy and structure to identify organizational-level risks relevant to financial reporting."
          />

          <SectionCard title="A. IT Governance, Strategy and Structure">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-[38%]">Document</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Response / Comments</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-foreground uppercase tracking-wider w-[100px]">W/P Ref.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <NarrativeRow
                    label="1. IT governance and strategy"
                    bullets={[
                      "Existence of a formalized IT strategic plan aligned with the entity's business plan.",
                      "How IT risks are identified and managed.",
                      "Existence of formal IT-related policies and procedures (e.g., IT security policy, program change policy).",
                      "Importance of IT to the industry and whether it drives growth and success.",
                    ]}
                    value={data.aGovernance}
                    wpRef={data.aGovernanceWp}
                    locked={locked}
                    onChange={v => patch("aGovernance", v)}
                    onWpChange={r => patch("aGovernanceWp", r)}
                  />
                  <NarrativeRow
                    label="2. IT organizational structure"
                    bullets={[
                      "Number of IT staff, their responsibilities and skill levels.",
                      "Physical location of servers (on-premises, cloud, or combination).",
                      "IT oversight and management — internal or outsourced to a third party?",
                    ]}
                    value={data.aOrgStructure}
                    wpRef={data.aOrgStructureWp}
                    locked={locked}
                    onChange={v => patch("aOrgStructure", v)}
                    onWpChange={r => patch("aOrgStructureWp", r)}
                  />
                  <NarrativeRow
                    label="Laws and regulations"
                    bullets={[
                      "Whether the entity is required to follow data protection legislation.",
                      "Whether there is a direct or indirect effect on the entity's F/S.",
                    ]}
                    value={data.aLawsRegs}
                    wpRef={data.aLawsRegsWp}
                    locked={locked}
                    onChange={v => patch("aLawsRegs", v)}
                    onWpChange={r => patch("aLawsRegsWp", r)}
                  />
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* ── PART B ─────────────────────────────────────────────────────── */}
          <PartHeader
            letter="B"
            title="IT Applications and Underlying Infrastructure"
            description="Identify key financial systems in scope to determine inherent reliance on IT for financial transaction processing and reporting."
          />

          {/* Applications table */}
          <SectionCard title="B1. IT Applications — Infrastructure Overview">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr className="bg-muted border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
                    <th className="px-4 py-2.5 text-center w-10">#</th>
                    <th className="px-4 py-2.5 text-left border-l border-border">Application Name & Type</th>
                    <th className="px-4 py-2.5 text-left border-l border-border">Network</th>
                    <th className="px-4 py-2.5 text-left border-l border-border">Database</th>
                    <th className="px-4 py-2.5 text-left border-l border-border">Operating System</th>
                    <th className="px-4 py-2.5 text-left border-l border-border">Nature & Purpose</th>
                    <th className="px-4 py-2.5 text-center border-l border-border w-32">Relevant to Audit?</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.apps.map((app, i) => (
                    <tr key={app.id} className="group hover:bg-muted/30 transition-colors align-top">
                      <td className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">{app.num}</td>
                      <td className="px-4 py-2 border-l border-border">
                        <Input disabled={locked} value={app.name} onChange={e => updateApp(i, { name: e.target.value })}
                          placeholder="E.g., QuickBooks, SAP…" className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" />
                        <Input disabled={locked} value={app.appType} onChange={e => updateApp(i, { appType: e.target.value })}
                          placeholder="Type (COTS, cloud-based, in-house…)" className="h-7 text-xs border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent text-muted-foreground mt-0.5" />
                      </td>
                      {(["network", "database", "os", "purpose"] as const).map(col => (
                        <td key={col} className="px-4 py-2.5 border-l border-border">
                          <Input disabled={locked} value={app[col]} onChange={e => updateApp(i, { [col]: e.target.value })}
                            placeholder="—" className="h-7 text-sm border-0 shadow-none px-0 focus-visible:ring-0 bg-transparent" />
                        </td>
                      ))}
                      <td className="px-4 py-2.5 border-l border-border w-32">
                        <Select value={app.relevant} onValueChange={v => updateApp(i, { relevant: v as YN })} disabled={locked}>
                          <SelectTrigger className="h-7 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Y">Y</SelectItem>
                            <SelectItem value="N">N</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-2 py-2 text-center w-8">
                        {!locked && (
                          <button onClick={() => deleteApp(i)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 transition-all">
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!locked && (
                <div className="px-4 py-2.5 border-t border-border">
                  <button onClick={addApp} className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                    <Plus className="h-3 w-3" /> Add application
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Per-application detail cards */}
          {data.apps.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                B2. Application Detail — For each application identified above
              </p>
              {data.apps.map(app => {
                const detail = getAppDetail(app.id);
                const appLabel = app.name || `Application ${app.num}`;
                return (
                  <SectionCard
                    key={app.id}
                    title={`${app.num}. ${appLabel}`}
                    subtitle={app.appType || undefined}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted border-b border-border">
                            <th className="px-5 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider w-[32%]">Topic</th>
                            <th className="px-4 py-2.5 text-left text-xs font-semibold text-foreground uppercase tracking-wider">Response / Comments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {APP_DETAIL_TOPICS.map(topic => (
                            <tr key={topic.key} className="group hover:bg-muted/30 transition-colors align-top">
                              <td className="px-5 py-3 text-sm text-foreground">
                                <span className="font-medium">{topic.label}</span>
                                {topic.bullets && (
                                  <ul className="mt-1.5 space-y-0.5 list-disc list-inside">
                                    {topic.bullets.map((b, i) => (
                                      <li key={i} className="text-xs text-muted-foreground">{b}</li>
                                    ))}
                                  </ul>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <Textarea
                                  disabled={locked}
                                  value={detail[topic.key]}
                                  onChange={e => updateAppDetail(app.id, { [topic.key]: e.target.value })}
                                  placeholder="Enter response…"
                                  className="min-h-[64px] text-sm resize-none border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </SectionCard>
                );
              })}
            </div>
          )}

          {/* ── PART C ─────────────────────────────────────────────────────── */}
          <PartHeader
            letter="C"
            title="IT Processes Related to Financial Reporting IT Systems"
            description="Understand the IT processes that manage the environment and operations relevant to information processing. Understanding GITCs helps identify those relevant to applications subject to RAFUIT."
          />

          <SectionCard title="C. IT Processes">
            <ProcessTable
              rows={partCRows}
              locked={locked}
              onChange={patchPartC}
            />
          </SectionCard>

          {/* ── PART D ─────────────────────────────────────────────────────── */}
          <PartHeader
            letter="D"
            title="Evaluation and Overall Conclusion"
            description="Evaluate the impact of the IT environment on the planned audit approach and identify any RAFUIT."
          />

          <SectionCard title="D. Evaluation">
            <ProcessTable
              rows={[
                {
                  id: "dComplexity",
                  label: "Complexity of the IT environment",
                  bullets: [
                    "Extent of customization — COTS with little customization, or custom/complex ERP with source code access?",
                    "Extent of integration — integrated with other applications? Are financial systems web-facing?",
                    "Extent of automation — highly automated paperless processing or complex automated procedures?",
                    "Based on above, evaluate whether an IT expert is required.",
                  ],
                  row: data.dComplexity,
                },
                {
                  id: "dFsRisks",
                  label: "Financial statement level risks",
                  bullets: [
                    "Document any F/S level risks identified from the IT environment information on Form 520.",
                  ],
                  row: data.dFsRisks,
                },
              ]}
              locked={locked}
              onChange={(id, partial) => patchProcess(id as keyof Data511, partial)}
            />
          </SectionCard>

          {/* Testing OE checkboxes */}
          <SectionCard title="D. Testing Operating Effectiveness of Controls">
            <div className="px-5 py-4 space-y-4">
              <p className="text-sm text-foreground font-medium">
                Based on risk assessment procedures and information obtained, check all that apply:
              </p>
              <div className="space-y-3">
                {([
                  ["automatedSignificant", "There are automated controls that address a risk determined to be a significant risk."],
                  ["automatedPlanned", "There are automated controls that management is relying on and that the auditor plans to test."],
                  ["systemReportsRelied", "There are system generated reports on which the auditor intends to rely as audit evidence without testing inputs and outputs."],
                  ["substantiveInsufficient", "There are automated controls addressing risks where substantive procedures alone are not sufficient for audit evidence."],
                  ["gitcRelevant", "There are applications where, using professional judgment, an understanding of the GITCs may be relevant."],
                ] as [keyof TestingCheck, string][]).map(([key, label]) => (
                  <div key={key} className="flex items-start gap-3">
                    <Checkbox
                      id={key}
                      checked={data.dTestingChecks[key]}
                      onCheckedChange={v => patch("dTestingChecks", { ...data.dTestingChecks, [key]: !!v })}
                      disabled={locked}
                      className="mt-0.5 shrink-0"
                    />
                    <label htmlFor={key} className="text-sm text-foreground leading-relaxed cursor-pointer">{label}</label>
                  </div>
                ))}
              </div>

              {(data.dTestingChecks.automatedSignificant ||
                data.dTestingChecks.automatedPlanned ||
                data.dTestingChecks.systemReportsRelied ||
                data.dTestingChecks.substantiveInsufficient ||
                data.dTestingChecks.gitcRelevant) && (
                <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    Identify RAFUIT and the general IT controls that mitigate such risks on <span className="font-semibold">Form 551</span>.
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Response / Comments</p>
                <Textarea
                  disabled={locked}
                  value={data.dTestingResponse.response}
                  onChange={e => patchProcess("dTestingResponse", { response: e.target.value })}
                  placeholder="Document your assessment of testing operating effectiveness of controls…"
                  className="min-h-[80px] text-sm resize-none bg-background"
                />
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">PSC?</p>
                    <Select value={data.dTestingResponse.psc} onValueChange={v => patchProcess("dTestingResponse", { psc: v })} disabled={locked}>
                      <SelectTrigger className="h-8 w-24 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">Y</SelectItem>
                        <SelectItem value="N">N</SelectItem>
                        <SelectItem value="N/A">N/A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">W/P Ref.</p>
                    <RefButton
                      reference={data.dTestingResponse.wpRef}
                      onAttach={doc => patchProcess("dTestingResponse", { wpRef: [...data.dTestingResponse.wpRef, doc] })}
                      onRemove={i => patchProcess("dTestingResponse", { wpRef: data.dTestingResponse.wpRef.filter((_, idx) => idx !== i) })}
                      disabled={locked}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Conclusion */}
          <SectionCard title="Conclusion">
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-muted-foreground">
                Sufficient information has been obtained to understand the IT environment relevant to the preparation of the F/S.
              </p>
              {data.concluded && (
                <div className="rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-800 dark:text-green-300">
                  Concluded on {data.concludedOn}
                </div>
              )}
              <Textarea
                disabled={locked}
                value={data.conclusion}
                onChange={e => patch("conclusion", e.target.value)}
                placeholder="Document your overall conclusion on the IT environment and its impact on the audit approach…"
                className="min-h-[100px] text-sm resize-none bg-background"
              />
              <div className="flex justify-end">
                <Button
                  disabled={locked}
                  onClick={() => {
                    const now = new Date().toISOString().slice(0, 10);
                    setData(d => {
                      const next = { ...d, concluded: true, concludedOn: now };
                      writeJsonToLocalStorage(storageKey, next);
                      return next;
                    });
                  }}
                >
                  Conclude worksheet
                </Button>
              </div>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}
