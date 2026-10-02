import { readJsonFromLocalStorage, writeJsonToLocalStorage } from "@/lib/safeJson";
import { getEngagementMeta } from "@/store/engagementsStore";
import { engPickerTreeUS, getEngPickerTemplateView } from "@/lib/globalTemplateTrees";
import { TEMPLATE_CONFIG, templateViewToMyTemplate, type MyEngagementTemplate, type TreeItem } from "@/lib/engagementTemplatesData";
import { getGlobalTemplateChecklist } from "@/lib/globalTemplates";
import { getGlobalItems } from "@/lib/globalTemplateCatalog";

export type TemplateTypeId =
  | "engagements"
  | "financial-statements"
  | "letters"
  | "checklists"
  | "reports"
  | "notes"
  | "worksheets";

export type EngagementType = "Audit" | "Review" | "Compilation" | "Tax" | "Any";
export type Framework = "ASPE" | "ASNPO" | "IFRS" | "US GAAP" | "Tax basis" | "Any";

export interface Office {
  id: string;
  name: string;
  city: string;
  region: "ca" | "us";
}

const DEFAULT_OFFICES: Office[] = [
  { id: "firm-ca-1", name: "Maple Grove Accounting PC", city: "Toronto, ON", region: "ca" },
  { id: "firm-us-1", name: "Maple Grove Accounting PC", city: "New York, NY", region: "us" },
];

export function getOffices(): Office[] {
  try {
    const raw = readJsonFromLocalStorage<Office[]>("firmProfiles", []);
    if (raw && raw.length > 0) return raw;
  } catch { /* ignore */ }
  return DEFAULT_OFFICES;
}

export function getActiveOfficeId(): string {
  try {
    return localStorage.getItem("activeFirmId") ?? "firm-ca-1";
  } catch {
    return "firm-ca-1";
  }
}

export function officeForJurisdiction(jurisdiction: "CA" | "US"): Office {
  const offices = getOffices();
  const region = jurisdiction === "CA" ? "ca" : "us";
  return offices.find(o => o.region === region) ?? DEFAULT_OFFICES[jurisdiction === "CA" ? 0 : 1];
}

export interface Folder {
  id: string;
  name: string;
  type: TemplateTypeId;
  parentId: string | null;
}

export type NavTarget = { to: string; state?: Record<string, unknown> } | null;

export interface FirmTemplate {
  id: string;
  name: string;
  subtitle: string;
  type: TemplateTypeId;
  folderId: string | null;
  engagementType: EngagementType;
  framework: Framework;
  standards?: string;
  cornerTag: string;
  tags: string[];
  status: "published" | "draft";
  jurisdiction: "CA" | "US";
  ownerOfficeId: string;
  availableOfficeIds: string[];
  linkedSeed: number;
  updatedAt: string;
  source: { kind: "seed" | "engagement" | "checklist" | "global"; refId: string };
  nav: NavTarget;
  globalId?: string;
}

export interface Library {
  folders: Folder[];
  templates: FirmTemplate[];
  defaults: Record<string, string>;
}

const STORAGE_KEY = "firmTemplateLibrary_v1";

function dispatch() {
  window.dispatchEvent(new CustomEvent("firmTemplateLibraryChanged"));
}

export function readLibrary(): Library {
  return readJsonFromLocalStorage<Library>(STORAGE_KEY, { folders: [], templates: [], defaults: {} });
}

function writeLibrary(lib: Library) {
  writeJsonToLocalStorage(STORAGE_KEY, lib);
  dispatch();
}

function buildUSLeafIds(items: TreeItem[]): Set<string> {
  const out = new Set<string>();
  const walk = (nodes: TreeItem[]) => {
    for (const n of nodes) {
      if (n.type === "folder") walk(n.children ?? []);
      else out.add(n.id);
    }
  };
  walk(items);
  return out;
}
const US_ENG_LEAF_IDS = buildUSLeafIds(engPickerTreeUS);

function thirteenDaysAgo(): string {
  return new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString();
}

function seedFolders(): Folder[] {
  return [
    // engagements
    { id: "sf-eng-audit", name: "Audit Engagements", type: "engagements", parentId: null },
    { id: "sf-eng-comp", name: "Compilation Engagements", type: "engagements", parentId: null },
    { id: "sf-eng-review", name: "Review Engagements", type: "engagements", parentId: null },
    // financial-statements
    { id: "sf-fs-aspe", name: "ASPE Financial Statements", type: "financial-statements", parentId: null },
    { id: "sf-fs-ifrs", name: "IFRS Financial Statements", type: "financial-statements", parentId: null },
    { id: "sf-fs-usgaap", name: "US GAAP Financial Statements", type: "financial-statements", parentId: null },
    { id: "sf-fs-taxbasis", name: "Tax-Basis Financial Statements", type: "financial-statements", parentId: null },
    // letters
    { id: "sf-let-eng", name: "Engagement Letters", type: "letters", parentId: null },
    { id: "sf-let-rep", name: "Representation Letters", type: "letters", parentId: null },
    // reports
    { id: "sf-rpt-aud", name: "Auditor's Reports", type: "reports", parentId: null },
    { id: "sf-rpt-rev", name: "Review & Compilation Reports", type: "reports", parentId: null },
    // worksheets
    { id: "sf-ws-planning", name: "Planning", type: "worksheets", parentId: null },
    { id: "sf-ws-completion", name: "Completion", type: "worksheets", parentId: null },
    // notes
    { id: "sf-nt-policies", name: "Accounting Policies", type: "notes", parentId: null },
    { id: "sf-nt-disclosures", name: "Disclosures", type: "notes", parentId: null },
  ];
}

function seedTemplates(): FirmTemplate[] {
  const ago = thirteenDaysAgo();
  const caOffice = officeForJurisdiction("CA");
  const usOffice = officeForJurisdiction("US");
  const bothOffices = [caOffice.id, usOffice.id];

  return [
    // ── ENGAGEMENTS ─────────────────────────────────────────────────────────
    {
      id: "seed-eng-audit5101",
      name: "Audit 5101 — Not-for-Profit",
      subtitle: "CAS — Canadian Auditing Standards · ASNPO (Accounting Standards for Not-for-Profit Organizations)",
      type: "engagements",
      folderId: "sf-eng-audit",
      engagementType: "Audit",
      framework: "ASNPO",
      standards: "CAS 200–810 · ASNPO (CPA Canada Handbook Part III) · CAS 700 Auditor's Report",
      cornerTag: "CPA Canada",
      tags: ["Engagement"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 2,
      updatedAt: ago,
      source: { kind: "seed", refId: "audit5101" },
      nav: { to: "/engagement-templates?template=audit5101" },
    },
    {
      id: "seed-eng-audit6100",
      name: "Audit 6100 — Private Corporation",
      subtitle: "United States · GAAS (AU-C Sections) · US GAAP (ASC) · Private Companies",
      type: "engagements",
      folderId: "sf-eng-audit",
      engagementType: "Audit",
      framework: "US GAAP",
      standards: "AICPA AU-C 200–810 · US GAAP / ASC · SAS No. 145 (Risk) · SAS No. 142 (Audit Evidence)",
      cornerTag: "Private / Non-Issuer",
      tags: ["Engagement"],
      status: "draft",
      jurisdiction: "US",
      ownerOfficeId: usOffice.id,
      availableOfficeIds: [usOffice.id],
      linkedSeed: 3,
      updatedAt: ago,
      source: { kind: "seed", refId: "audit6100" },
      nav: { to: "/engagement-templates?template=audit6100" },
    },
    {
      id: "seed-eng-comp4200a",
      name: "Compilation — Small Corporations (CCPC)",
      subtitle: "CSRS 4200 — Compilation Engagement",
      type: "engagements",
      folderId: "sf-eng-comp",
      engagementType: "Compilation",
      framework: "ASPE",
      standards: "CSRS 4200 – Compilation Engagements",
      cornerTag: "CPA Canada",
      tags: ["Engagement"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 0,
      updatedAt: ago,
      source: { kind: "seed", refId: "comp4200" },
      nav: { to: "/engagement-templates?template=comp4200" },
    },
    {
      id: "seed-eng-comp4200b",
      name: "Compilation CSRS 4200 — Firm Standard",
      subtitle: "CSRS 4200 — Compilation Engagement",
      type: "engagements",
      folderId: "sf-eng-comp",
      engagementType: "Compilation",
      framework: "Any",
      standards: "CSRS 4200 – Compilation Engagements",
      cornerTag: "CPA Canada",
      tags: ["Engagement"],
      status: "draft",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 1,
      updatedAt: ago,
      source: { kind: "seed", refId: "comp4200" },
      nav: { to: "/engagement-templates?template=comp4200" },
    },
    {
      id: "seed-eng-rev2400",
      name: "Review 2400 — Firm Standard",
      subtitle: "CSRE 2400 — Review Engagement",
      type: "engagements",
      folderId: "sf-eng-review",
      engagementType: "Review",
      framework: "ASPE",
      standards: "CSRE 2400 – Review Engagements",
      cornerTag: "CPA Canada",
      tags: ["Engagement"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 3,
      updatedAt: ago,
      source: { kind: "seed", refId: "rev2400" },
      nav: { to: "/engagement-templates?template=rev2400" },
    },

    // ── FINANCIAL STATEMENTS ─────────────────────────────────────────────────
    {
      id: "seed-fs-aspe-partner",
      name: "ASPE — Partnership Variant",
      subtitle: "Canada · ASPE",
      type: "financial-statements",
      folderId: "sf-fs-aspe",
      engagementType: "Any",
      framework: "ASPE",
      standards: undefined,
      cornerTag: "FS-1 ASPE",
      tags: ["Financial statements", "ASPE"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 1,
      updatedAt: ago,
      source: { kind: "seed", refId: "fs-aspe-partner" },
      nav: { to: `/financial-statement-templates?template=${encodeURIComponent("Partnership ASPE-Reviewed Financial Statements")}&source=my` },
    },
    {
      id: "seed-fs-aspe-priv",
      name: "ASPE — Private Corporation (Firm Standard)",
      subtitle: "Canada · ASPE",
      type: "financial-statements",
      folderId: "sf-fs-aspe",
      engagementType: "Any",
      framework: "ASPE",
      standards: undefined,
      cornerTag: "FS-1 ASPE",
      tags: ["Financial statements", "ASPE"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 0,
      updatedAt: ago,
      source: { kind: "seed", refId: "fs-aspe-priv" },
      nav: { to: `/financial-statement-templates?template=${encodeURIComponent("Corporations ASPE-Reviewed Financial Statements")}&source=my` },
    },
    {
      id: "seed-fs-ifrs-pub",
      name: "IFRS — Public Corporation",
      subtitle: "Canada · IFRS",
      type: "financial-statements",
      folderId: "sf-fs-ifrs",
      engagementType: "Any",
      framework: "IFRS",
      standards: undefined,
      cornerTag: "FS-2 IFRS",
      tags: ["Financial statements", "IFRS"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 2,
      updatedAt: ago,
      source: { kind: "seed", refId: "fs-ifrs-pub" },
      nav: null,
    },
    {
      id: "seed-fs-usgaap-ccorp",
      name: "US GAAP — C-Corporation (Firm Standard)",
      subtitle: "United States · US GAAP",
      type: "financial-statements",
      folderId: "sf-fs-usgaap",
      engagementType: "Any",
      framework: "US GAAP",
      standards: undefined,
      cornerTag: "FS-5 US GAAP",
      tags: ["Financial statements", "US GAAP"],
      status: "draft",
      jurisdiction: "US",
      ownerOfficeId: usOffice.id,
      availableOfficeIds: bothOffices,
      linkedSeed: 3,
      updatedAt: ago,
      source: { kind: "seed", refId: "fs-usgaap-ccorp" },
      nav: { to: `/financial-statement-templates?template=${encodeURIComponent("C-Corp GAAP-Compiled Financial Statements")}&source=my` },
    },
    {
      id: "seed-fs-taxbasis-pt",
      name: "US Tax Basis — Pass-Through Entities",
      subtitle: "United States · Tax basis",
      type: "financial-statements",
      folderId: "sf-fs-taxbasis",
      engagementType: "Any",
      framework: "Tax basis",
      standards: undefined,
      cornerTag: "FS-7 Tax basis",
      tags: ["Financial statements", "Tax basis"],
      status: "published",
      jurisdiction: "US",
      ownerOfficeId: usOffice.id,
      availableOfficeIds: [usOffice.id],
      linkedSeed: 0,
      updatedAt: ago,
      source: { kind: "seed", refId: "fs-taxbasis-pt" },
      nav: { to: `/financial-statement-templates?template=${encodeURIComponent("Partnership GAAP-Financial Statements — Income Tax Basis")}&source=my` },
    },

    // ── LETTERS ──────────────────────────────────────────────────────────────
    {
      id: "seed-let-ca-1",
      name: "Audit Engagement Letter — Firm Standard",
      subtitle: "Terms of engagement · CAS 210",
      type: "letters",
      folderId: "sf-let-eng",
      engagementType: "Audit",
      framework: "ASPE",
      standards: "CAS 210 – Agreeing the Terms of Audit Engagements",
      cornerTag: "CPA Canada",
      tags: ["Letter"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 4,
      updatedAt: ago,
      source: { kind: "seed", refId: "glt-ca-1" },
      nav: { to: "/builder", state: { globalTemplateId: "glt-ca-1" } },
    },
    {
      id: "seed-let-ca-3",
      name: "Management Representation Letter — Audit",
      subtitle: "Written representations · CAS 580",
      type: "letters",
      folderId: "sf-let-rep",
      engagementType: "Audit",
      framework: "ASPE",
      standards: "CAS 580 – Written Representations",
      cornerTag: "CPA Canada",
      tags: ["Letter"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 3,
      updatedAt: ago,
      source: { kind: "seed", refId: "glt-ca-3" },
      nav: { to: "/builder", state: { globalTemplateId: "glt-ca-3" } },
    },
    {
      id: "seed-let-us-1",
      name: "Audit Engagement Letter — US Private",
      subtitle: "Terms of engagement · AU-C 210",
      type: "letters",
      folderId: "sf-let-eng",
      engagementType: "Audit",
      framework: "US GAAP",
      standards: "AU-C 210 – Terms of Engagement",
      cornerTag: "AICPA",
      tags: ["Letter"],
      status: "draft",
      jurisdiction: "US",
      ownerOfficeId: usOffice.id,
      availableOfficeIds: [usOffice.id],
      linkedSeed: 0,
      updatedAt: ago,
      source: { kind: "seed", refId: "glt-us-1" },
      nav: { to: "/builder", state: { globalTemplateId: "glt-us-1" } },
    },

    // ── REPORTS ───────────────────────────────────────────────────────────────
    {
      id: "seed-rpt-ca-1",
      name: "Independent Auditor's Report — Unmodified (ASPE)",
      subtitle: "Auditor's report · CAS 700",
      type: "reports",
      folderId: "sf-rpt-aud",
      engagementType: "Audit",
      framework: "ASPE",
      standards: "CAS 700 – Forming an Opinion and Reporting",
      cornerTag: "CPA Canada",
      tags: ["Report"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 3,
      updatedAt: ago,
      source: { kind: "seed", refId: "grpt-ca-1" },
      nav: { to: "/builder", state: { globalTemplateId: "grpt-ca-1" } },
    },
    {
      id: "seed-rpt-rev-1",
      name: "Review Engagement Report — Unmodified (ASPE)",
      subtitle: "Practitioner's review report · CSRE 2400",
      type: "reports",
      folderId: "sf-rpt-rev",
      engagementType: "Review",
      framework: "ASPE",
      standards: "CSRE 2400 – Review Engagements",
      cornerTag: "CPA Canada",
      tags: ["Report"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 2,
      updatedAt: ago,
      source: { kind: "seed", refId: "grpt-2-1" },
      nav: { to: "/builder", state: { globalTemplateId: "grpt-2-1" } },
    },
    {
      id: "seed-rpt-comp-1",
      name: "Compilation Engagement Report",
      subtitle: "Compilation report · CSRS 4200",
      type: "reports",
      folderId: "sf-rpt-rev",
      engagementType: "Compilation",
      framework: "Any",
      standards: "CSRS 4200 – Compilation Engagements",
      cornerTag: "CPA Canada",
      tags: ["Report"],
      status: "draft",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 0,
      updatedAt: ago,
      source: { kind: "seed", refId: "grpt-1-1" },
      nav: { to: "/builder", state: { globalTemplateId: "grpt-1-1" } },
    },

    // ── WORKSHEETS ────────────────────────────────────────────────────────────
    {
      id: "seed-ws-mat",
      name: "420 Materiality — Firm Standard",
      subtitle: "Planning materiality · CAS 320",
      type: "worksheets",
      folderId: "sf-ws-planning",
      engagementType: "Audit",
      framework: "Any",
      standards: "CAS 320 – Materiality in Planning and Performing an Audit",
      cornerTag: "CPA Canada",
      tags: ["Worksheet"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 4,
      updatedAt: ago,
      source: { kind: "seed", refId: "gca-ws-mat" },
      nav: { to: "/builder", state: { globalTemplateId: "gca-ws-mat" } },
    },
    {
      id: "seed-ws-520",
      name: "520 Risk Register",
      subtitle: "Identified risks of material misstatement · CAS 315",
      type: "worksheets",
      folderId: "sf-ws-planning",
      engagementType: "Audit",
      framework: "Any",
      standards: "CAS 315 – Identifying and Assessing Risks",
      cornerTag: "CPA Canada",
      tags: ["Worksheet"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 2,
      updatedAt: ago,
      source: { kind: "seed", refId: "gca-ws-520" },
      nav: { to: "/builder", state: { globalTemplateId: "gca-ws-520" } },
    },
    {
      id: "seed-ws-650",
      name: "650 Subsequent Events",
      subtitle: "Completion procedures · CAS 560",
      type: "worksheets",
      folderId: "sf-ws-completion",
      engagementType: "Audit",
      framework: "Any",
      standards: "CAS 560 – Subsequent Events",
      cornerTag: "CPA Canada",
      tags: ["Worksheet"],
      status: "draft",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 0,
      updatedAt: ago,
      source: { kind: "seed", refId: "gca-ws-650" },
      nav: { to: "/builder", state: { globalTemplateId: "gca-ws-650" } },
    },

    // ── NOTES ─────────────────────────────────────────────────────────────────
    {
      id: "seed-nt-aspe-1",
      name: "Significant Accounting Policies — ASPE",
      subtitle: "Disclosure of accounting policies · Section 1505",
      type: "notes",
      folderId: "sf-nt-policies",
      engagementType: "Any",
      framework: "ASPE",
      standards: "ASPE Section 1505 – Disclosure of Accounting Policies",
      cornerTag: "ASPE",
      tags: ["Note"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 3,
      updatedAt: ago,
      source: { kind: "seed", refId: "nt-aspe-1" },
      nav: null,
    },
    {
      id: "seed-nt-aspe-2",
      name: "Related Party Transactions — ASPE",
      subtitle: "Related party disclosures · Section 3840",
      type: "notes",
      folderId: "sf-nt-disclosures",
      engagementType: "Any",
      framework: "ASPE",
      standards: "ASPE Section 3840 – Related Party Transactions",
      cornerTag: "ASPE",
      tags: ["Note"],
      status: "published",
      jurisdiction: "CA",
      ownerOfficeId: caOffice.id,
      availableOfficeIds: [caOffice.id],
      linkedSeed: 1,
      updatedAt: ago,
      source: { kind: "seed", refId: "nt-aspe-2" },
      nav: null,
    },
    {
      id: "seed-nt-usgaap-1",
      name: "Summary of Significant Accounting Policies — US GAAP",
      subtitle: "Accounting policies · ASC 235",
      type: "notes",
      folderId: "sf-nt-policies",
      engagementType: "Any",
      framework: "US GAAP",
      standards: "ASC 235 – Notes to Financial Statements",
      cornerTag: "US GAAP",
      tags: ["Note"],
      status: "draft",
      jurisdiction: "US",
      ownerOfficeId: usOffice.id,
      availableOfficeIds: [usOffice.id],
      linkedSeed: 0,
      updatedAt: ago,
      source: { kind: "seed", refId: "nt-usgaap-1" },
      nav: null,
    },
  ];
}

// ── INIT / SYNC ───────────────────────────────────────────────────────────────

interface EngSource {
  id: string;
  name: string;
  folderId: string;
  folderName: string;
  sourceTemplateId?: string;
  subtitle?: string;
}

interface ChecklistSource {
  id: string;
  name: string;
  folderId: string;
  folderName: string;
  contentType?: string;
  data?: any;
}

const CL_TYPE_TAG_MAP: Record<string, { type: TemplateTypeId; tag: string }> = {
  letters: { type: "letters", tag: "Letter" },
  reports: { type: "reports", tag: "Report" },
  worksheets: { type: "worksheets", tag: "Worksheet" },
  notes: { type: "notes", tag: "Note" },
};

function clLibType(cl: ChecklistSource): TemplateTypeId {
  return CL_TYPE_TAG_MAP[cl.contentType ?? ""]?.type ?? "checklists";
}

function clTags(cl: ChecklistSource): string[] {
  return [CL_TYPE_TAG_MAP[cl.contentType ?? ""]?.tag ?? "Checklist"];
}

function engTypeFromId(sid: string): EngagementType {
  const s = sid.toLowerCase();
  if (s.startsWith("audit")) return "Audit";
  if (s.startsWith("rev")) return "Review";
  if (s.startsWith("comp")) return "Compilation";
  if (s.startsWith("tax")) return "Tax";
  return "Any";
}

function isUSEngSource(sid: string): boolean {
  return US_ENG_LEAF_IDS.has(sid.toLowerCase());
}

function findOrCreateFolder(lib: Library, type: TemplateTypeId, folderName: string): string {
  const existing = lib.folders.find(f => f.type === type && f.name === folderName && f.parentId === null);
  if (existing) return existing.id;
  const id = `sync-folder-${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  lib.folders.push({ id, name: folderName, type, parentId: null });
  return id;
}

export function load(): Library {
  const raw = readLibrary();
  const lib: Library = {
    folders: raw.folders ?? [],
    templates: raw.templates ?? [],
    defaults: raw.defaults ?? {},
  };

  // Seed on first load
  const hasSeedFolders = lib.folders.some(f => f.id.startsWith("sf-"));
  if (!hasSeedFolders) {
    lib.folders = [...seedFolders(), ...lib.folders];
    lib.templates = [...seedTemplates(), ...lib.templates];
  }

  // Repair myEngagementTemplates: rebuild records without a sections array
  {
    const rawEngs = readJsonFromLocalStorage<Array<Record<string, unknown>>>("myEngagementTemplates", []);
    if (rawEngs.some(e => !Array.isArray(e.sections))) {
      const repairedEngs = rawEngs.map(e => {
        if (Array.isArray(e.sections)) return e;
        const sid = String(e.sourceTemplateId ?? "");
        const view = getEngPickerTemplateView(sid);
        const ts = new Date().toISOString();
        const rebuilt: MyEngagementTemplate = view
          ? templateViewToMyTemplate(view, String(e.folderId ?? "root"), String(e.folderName ?? ""), String(e.id ?? `my-eng-${Date.now()}`))
          : { id: String(e.id ?? `my-eng-${Date.now()}`), name: String(e.name ?? ""), folderId: String(e.folderId ?? "root"), folderName: String(e.folderName ?? ""), sections: [], sourceTemplateId: sid, createdAt: String(e.createdAt ?? ts), updatedAt: String(e.updatedAt ?? ts) };
        rebuilt.name = String(e.name ?? "");
        rebuilt.sourceTemplateId = sid;
        return rebuilt;
      });
      writeJsonToLocalStorage("myEngagementTemplates", repairedEngs);
    }
  }

  // Repair stale nav on library engagement templates (state → query param)
  let navRepaired = false;
  for (const t of lib.templates) {
    if (t.source.kind === "engagement" && t.nav && t.nav.to === "/engagement-templates" && !t.nav.to.includes("?")) {
      t.nav = { to: `/engagement-templates?myTemplate=${t.source.refId}` };
      navRepaired = true;
    }
    // Repair seed templates whose nav still uses router state instead of query params
    if (t.nav && t.nav.state && typeof (t.nav.state as Record<string, unknown>).template === "string") {
      const state = t.nav.state as Record<string, unknown>;
      const tpl = encodeURIComponent(String(state.template));
      const src = state.source ? `&source=${state.source}` : "";
      t.nav = { to: `${t.nav.to}?template=${tpl}${src}` };
      navRepaired = true;
    }
  }
  if (navRepaired) writeLibrary(lib);

  // Repair seed template navs: always follow the code definition
  {
    const seedNavMap = new Map<string, NavTarget>(
      seedTemplates().map(s => [s.id, s.nav])
    );
    let seedNavRepaired = false;
    for (const t of lib.templates) {
      if (t.source.kind !== "seed" || !seedNavMap.has(t.id)) continue;
      const canonicalNav = seedNavMap.get(t.id) as NavTarget;
      if (JSON.stringify(t.nav) !== JSON.stringify(canonicalNav)) {
        t.nav = canonicalNav;
        seedNavRepaired = true;
      }
    }
    if (seedNavRepaired) writeLibrary(lib);
  }

  // Repair folder cycles: if a folder's parentId chain revisits a folder, break the cycle
  {
    let cycleRepaired = false;
    for (const folder of lib.folders) {
      const seen = new Set<string>();
      seen.add(folder.id);
      let cur = folder.parentId;
      let broken = false;
      while (cur && !broken) {
        if (seen.has(cur)) {
          // Cycle detected — sever this folder's parentId link
          folder.parentId = null;
          cycleRepaired = true;
          broken = true;
        } else {
          seen.add(cur);
          cur = lib.folders.find(f => f.id === cur)?.parentId ?? null;
        }
      }
    }
    if (cycleRepaired) writeLibrary(lib);
  }

  // Sync engagement templates
  const engSources = readJsonFromLocalStorage<EngSource[]>("myEngagementTemplates", []);
  const engRefIds = new Set(engSources.map(e => e.id));

  // Drop stale engagement templates
  lib.templates = lib.templates.filter(
    t => t.source.kind !== "engagement" || engRefIds.has(t.source.refId)
  );

  // Import new engagement templates
  const existingEngRefIds = new Set(
    lib.templates.filter(t => t.source.kind === "engagement").map(t => t.source.refId)
  );
  for (const eng of engSources) {
    if (existingEngRefIds.has(eng.id)) continue;
    const sid = eng.sourceTemplateId ?? "";
    const jurisdiction: "CA" | "US" = isUSEngSource(sid) ? "US" : "CA";
    const owner = officeForJurisdiction(jurisdiction);
    const folderId = findOrCreateFolder(lib, "engagements", eng.folderName);
    lib.templates.push({
      id: `sync-eng-${eng.id}`,
      name: eng.name,
      subtitle: eng.subtitle ?? "Engagement template",
      type: "engagements",
      folderId,
      engagementType: engTypeFromId(sid),
      framework: "Any",
      cornerTag: "",
      tags: ["Engagement"],
      status: "draft",
      jurisdiction,
      ownerOfficeId: owner.id,
      availableOfficeIds: [owner.id],
      linkedSeed: 0,
      updatedAt: new Date().toISOString(),
      source: { kind: "engagement", refId: eng.id },
      nav: { to: "/engagement-templates", state: { myTemplate: eng.id } },
    });
  }

  // Sync checklists
  const clSources = readJsonFromLocalStorage<ChecklistSource[]>("savedChecklists", []);

  // A7: repair savedChecklists records without data from global catalog
  {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const globalChecklistItems = getGlobalItems("checklists");
    let clRepaired = false;
    for (const cl of clSources) {
      if (cl.data) continue;
      const norm = normalize(cl.name);
      const match = globalChecklistItems.find(item => normalize(item.name) === norm);
      if (match) {
        const data = getGlobalTemplateChecklist(match.id);
        if (data) {
          cl.data = { ...data, id: cl.id, title: cl.name };
          clRepaired = true;
        }
      }
    }
    if (clRepaired) writeJsonToLocalStorage("savedChecklists", clSources);
  }

  const clRefIds = new Set(clSources.map(c => c.id));
  const clSourceMap = new Map(clSources.map(c => [c.id, c]));

  // Drop stale checklist templates
  lib.templates = lib.templates.filter(
    t => t.source.kind !== "checklist" || clRefIds.has(t.source.refId)
  );

  // A8 + A7: update existing checklist templates (type/tags/nav) from current source records
  for (const t of lib.templates) {
    if (t.source.kind !== "checklist") continue;
    const cl = clSourceMap.get(t.source.refId);
    if (!cl) continue;
    const desiredType = clLibType(cl);
    const desiredTags = clTags(cl);
    if (!cl.data && t.nav) t.nav = null;
    if (t.type !== desiredType) {
      t.type = desiredType;
      t.folderId = findOrCreateFolder(lib, desiredType, cl.folderName);
      t.tags = desiredTags;
    }
  }

  // Import new checklists
  const existingClRefIds = new Set(
    lib.templates.filter(t => t.source.kind === "checklist").map(t => t.source.refId)
  );
  for (const cl of clSources) {
    if (existingClRefIds.has(cl.id)) continue;
    const clType = clLibType(cl);
    const jurisdiction: "CA" | "US" = cl.data?.country === "US" ? "US" : "CA";
    const owner = officeForJurisdiction(jurisdiction);
    const folderId = findOrCreateFolder(lib, clType, cl.folderName);
    lib.templates.push({
      id: `sync-cl-${cl.id}`,
      name: cl.name,
      subtitle: clTags(cl)[0],
      type: clType,
      folderId,
      engagementType: "Any",
      framework: "Any",
      cornerTag: "",
      tags: clTags(cl),
      status: "draft",
      jurisdiction,
      ownerOfficeId: owner.id,
      availableOfficeIds: [owner.id],
      linkedSeed: 0,
      updatedAt: new Date().toISOString(),
      source: { kind: "checklist", refId: cl.id },
      nav: cl.data ? { to: "/builder", state: { checklistId: cl.id } } : null,
    });
  }

  writeJsonToLocalStorage(STORAGE_KEY, lib);
  return lib;
}

// ── SELECTORS ────────────────────────────────────────────────────────────────

export function getFolders(lib: Library, type: TemplateTypeId | "all"): Folder[] {
  return type === "all" ? lib.folders : lib.folders.filter(f => f.type === type);
}

export function getTemplates(lib: Library, type: TemplateTypeId | "all"): FirmTemplate[] {
  return type === "all" ? lib.templates : lib.templates.filter(t => t.type === type);
}

export function folderPath(lib: Library, folderId: string | null): Folder[] {
  if (!folderId) return [];
  const path: Folder[] = [];
  let current: Folder | undefined = lib.folders.find(f => f.id === folderId);
  while (current) {
    path.unshift(current);
    current = current.parentId ? lib.folders.find(f => f.id === current!.parentId) : undefined;
  }
  return path;
}

function descendantTemplateCount(lib: Library, folderId: string, visited = new Set<string>()): number {
  if (visited.has(folderId)) return 0; // cycle guard
  visited.add(folderId);
  const childIds = lib.folders.filter(f => f.parentId === folderId).map(f => f.id);
  const direct = lib.templates.filter(t => t.folderId === folderId).length;
  return direct + childIds.reduce((sum, id) => sum + descendantTemplateCount(lib, id, visited), 0);
}

export function defaultKey(t: FirmTemplate): string {
  return `${t.type}|${t.engagementType}|${t.framework}`;
}

export function isDefault(lib: Library, t: FirmTemplate): boolean {
  return lib.defaults[defaultKey(t)] === t.id;
}

export function linkedCount(
  t: FirmTemplate,
  engagements: { id: string }[]
): number {
  return (
    t.linkedSeed +
    engagements.filter(e => {
      const meta = getEngagementMeta(e.id);
      const tid = meta.templateId;
      return tid === t.id || tid === t.source.refId || meta.firmTemplateId === t.id;
    }).length
  );
}

export function toEngagementType(label: string): EngagementType {
  const l = label.toLowerCase();
  if (l.startsWith("audit")) return "Audit";
  if (l.startsWith("review")) return "Review";
  if (l.startsWith("compilation")) return "Compilation";
  if (l.startsWith("t2") || l.includes("1120") || l.startsWith("tax")) return "Tax";
  return "Any";
}

export function toFramework(standards: string): Framework {
  const s = standards.toLowerCase();
  if (s.includes("income tax basis") || s.includes("tax basis")) return "Tax basis";
  if (s.includes("asnpo")) return "ASNPO";
  if (s.includes("aspe")) return "ASPE";
  if (s.includes("ifrs")) return "IFRS";
  if (s.includes("us gaap")) return "US GAAP";
  return "Any";
}

const ENG_PICKER_FALLBACK: Record<string, string> = {
  "comp-us-ssars21": "comp4200",
  "comp-us-arc80": "comp4200",
  "rev-us-ssars21": "rev2400",
  "rev-us-arc90": "rev2400",
  "tax-us-1120": "tax-t2",
  "tax-us-1120s": "tax-t2",
  "tax-us-1065": "tax-t2",
};

export function resolveBaseTemplateId(t: FirmTemplate): string | undefined {
  if (t.source.kind === "seed") {
    const nav = t.nav;
    if (!nav) return undefined;
    // Primary: read template query param from nav.to
    const qs = nav.to.split("?")[1] ?? "";
    const qpTemplate = new URLSearchParams(qs).get("template");
    if (qpTemplate && TEMPLATE_CONFIG[qpTemplate]) return qpTemplate;
    // Fallback: nav.state?.template for any legacy data not yet repaired
    const stateTemplate = typeof (nav.state as Record<string, unknown> | undefined)?.template === "string"
      ? (nav.state as Record<string, unknown>).template as string
      : undefined;
    if (stateTemplate && TEMPLATE_CONFIG[stateTemplate]) return stateTemplate;
    return undefined;
  }
  if (t.source.kind === "engagement") {
    const engs = readJsonFromLocalStorage<EngSource[]>("myEngagementTemplates", []);
    const eng = engs.find(e => e.id === t.source.refId);
    if (!eng) return undefined;
    const sid = eng.sourceTemplateId ?? "";
    if (TEMPLATE_CONFIG[sid]) return sid;
    const fallback = ENG_PICKER_FALLBACK[sid];
    if (fallback && TEMPLATE_CONFIG[fallback]) return fallback;
    return undefined;
  }
  return undefined;
}

export function getPickableEngagementTemplates(officeId: string): FirmTemplate[] {
  const lib = load();
  return lib.templates
    .filter(t =>
      t.type === "engagements" &&
      t.status === "published" &&
      t.availableOfficeIds.includes(officeId)
    )
    .sort((a, b) => {
      const pathA = folderPath(lib, a.folderId).map(f => f.name).join(" / ") || "Root";
      const pathB = folderPath(lib, b.folderId).map(f => f.name).join(" / ") || "Root";
      if (pathA !== pathB) return pathA.localeCompare(pathB);
      return a.name.localeCompare(b.name);
    });
}

export function getEngagementDefault(
  engagementTypeLabel: string,
  standards: string,
  officeId: string
): FirmTemplate | null {
  const lib = load();
  const et = toEngagementType(engagementTypeLabel);
  const fw = toFramework(standards);
  const exactId = lib.defaults[`engagements|${et}|${fw}`];
  const fallbackId = lib.defaults[`engagements|${et}|Any`];
  const pickable = lib.templates.filter(t =>
    t.type === "engagements" &&
    t.status === "published" &&
    t.availableOfficeIds.includes(officeId)
  );
  if (exactId) {
    const found = pickable.find(t => t.id === exactId);
    if (found) return found;
  }
  if (fallbackId) {
    const found = pickable.find(t => t.id === fallbackId);
    if (found) return found;
  }
  return null;
}

// ── ACTIONS ───────────────────────────────────────────────────────────────────

export function createFolder(type: TemplateTypeId, name: string, parentId: string | null): Library {
  const lib = load();
  lib.folders.push({
    id: `folder-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    type,
    parentId,
  });
  writeLibrary(lib);
  return lib;
}

export function renameFolder(id: string, name: string): Library {
  const lib = load();
  const folder = lib.folders.find(f => f.id === id);
  if (folder) folder.name = name;
  writeLibrary(lib);
  return lib;
}

export function moveFolder(id: string, parentId: string | null): Library {
  const lib = load();
  // Cycle check: walk upward from parentId; if we reach id, the move would create a cycle
  if (parentId) {
    let cur: string | null = parentId;
    const seen = new Set<string>();
    while (cur && !seen.has(cur)) {
      if (cur === id) return lib; // target is the folder itself or one of its descendants: no-op
      seen.add(cur);
      cur = lib.folders.find(f => f.id === cur)?.parentId ?? null;
    }
  }
  const folder = lib.folders.find(f => f.id === id);
  if (folder) folder.parentId = parentId;
  writeLibrary(lib);
  return lib;
}

export function deleteFolder(
  id: string,
  engagements: { id: string }[]
): { blocked: true; linked: number } | Library {
  const lib = load();
  const descendantIds = new Set<string>();
  const collect = (fid: string) => {
    if (descendantIds.has(fid)) return; // cycle guard
    descendantIds.add(fid);
    lib.folders.filter(f => f.parentId === fid).forEach(c => collect(c.id));
  };
  collect(id);
  const affected = lib.templates.filter(t => t.folderId && descendantIds.has(t.folderId));
  const totalLinked = affected.reduce((sum, t) => sum + linkedCount(t, engagements), 0);
  if (totalLinked > 0) return { blocked: true, linked: totalLinked };

  // Remove source records for every deleted template
  const deletedIds = new Set(affected.map(t => t.id));
  const engSources = readJsonFromLocalStorage<EngSource[]>("myEngagementTemplates", []);
  const clSources = readJsonFromLocalStorage<ChecklistSource[]>("savedChecklists", []);
  const deletedRefIds = new Set(affected.map(t => t.source.refId));
  writeJsonToLocalStorage(
    "myEngagementTemplates",
    engSources.filter(e => !deletedRefIds.has(e.id))
  );
  writeJsonToLocalStorage(
    "savedChecklists",
    clSources.filter(c => !deletedRefIds.has(c.id))
  );
  // Clear defaults pointing to deleted template ids
  for (const k of Object.keys(lib.defaults)) {
    if (deletedIds.has(lib.defaults[k])) delete lib.defaults[k];
  }

  lib.folders = lib.folders.filter(f => !descendantIds.has(f.id));
  lib.templates = lib.templates.filter(t => !t.folderId || !descendantIds.has(t.folderId));
  writeLibrary(lib);
  return lib;
}

export function renameTemplate(id: string, name: string): Library {
  const lib = load();
  const t = lib.templates.find(t => t.id === id);
  if (!t) { writeLibrary(lib); return lib; }
  t.name = name;
  t.updatedAt = new Date().toISOString();
  // Write-through for engagement/checklist sources
  if (t.source.kind === "engagement") {
    const engs = readJsonFromLocalStorage<EngSource[]>("myEngagementTemplates", []);
    const idx = engs.findIndex(e => e.id === t.source.refId);
    if (idx !== -1) {
      engs[idx] = { ...engs[idx], name };
      writeJsonToLocalStorage("myEngagementTemplates", engs);
    }
  } else if (t.source.kind === "checklist") {
    const cls = readJsonFromLocalStorage<ChecklistSource[]>("savedChecklists", []);
    const idx = cls.findIndex(c => c.id === t.source.refId);
    if (idx !== -1) {
      cls[idx] = { ...cls[idx], name };
      writeJsonToLocalStorage("savedChecklists", cls);
    }
  }
  writeLibrary(lib);
  return lib;
}

export function moveTemplate(id: string, folderId: string | null): Library {
  const lib = load();
  const t = lib.templates.find(t => t.id === id);
  if (!t) { writeLibrary(lib); return lib; }
  // folderId must match type (or be null)
  if (folderId) {
    const folder = lib.folders.find(f => f.id === folderId);
    if (!folder || folder.type !== t.type) { writeLibrary(lib); return lib; }
  }
  t.folderId = folderId;
  t.updatedAt = new Date().toISOString();
  const folderName = folderId ? (lib.folders.find(f => f.id === folderId)?.name ?? "") : "";
  // Write-through folderName
  if (t.source.kind === "engagement") {
    const engs = readJsonFromLocalStorage<EngSource[]>("myEngagementTemplates", []);
    const idx = engs.findIndex(e => e.id === t.source.refId);
    if (idx !== -1) {
      engs[idx] = { ...engs[idx], folderId: folderId ?? "", folderName };
      writeJsonToLocalStorage("myEngagementTemplates", engs);
    }
  } else if (t.source.kind === "checklist") {
    const cls = readJsonFromLocalStorage<ChecklistSource[]>("savedChecklists", []);
    const idx = cls.findIndex(c => c.id === t.source.refId);
    if (idx !== -1) {
      cls[idx] = { ...cls[idx], folderId: folderId ?? "", folderName };
      writeJsonToLocalStorage("savedChecklists", cls);
    }
  }
  writeLibrary(lib);
  return lib;
}

export function duplicateTemplate(id: string): Library {
  const lib = load();
  const src = lib.templates.find(t => t.id === id);
  if (!src) { writeLibrary(lib); return lib; }
  const newId = `dup-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const copy: FirmTemplate = {
    ...src,
    id: newId,
    name: `${src.name} (Copy)`,
    status: "draft",
    linkedSeed: 0,
    ownerOfficeId: getActiveOfficeId(),
    updatedAt: new Date().toISOString(),
    source: { ...src.source },
    nav: src.nav ? { ...src.nav } : null,
  };

  if (src.source.kind === "engagement") {
    const engs = readJsonFromLocalStorage<EngSource[]>("myEngagementTemplates", []);
    const original = engs.find(e => e.id === src.source.refId);
    if (original) {
      const cloneRefId = `eng-clone-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const clone: EngSource = { ...original, id: cloneRefId, name: copy.name };
      engs.push(clone);
      writeJsonToLocalStorage("myEngagementTemplates", engs);
      copy.source = { kind: "engagement", refId: cloneRefId };
      copy.nav = { to: "/engagement-templates", state: { myTemplate: cloneRefId } };
    }
  } else if (src.source.kind === "checklist") {
    const cls = readJsonFromLocalStorage<ChecklistSource[]>("savedChecklists", []);
    const original = cls.find(c => c.id === src.source.refId);
    if (original) {
      const cloneRefId = `cl-clone-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const clone: ChecklistSource = { ...original, id: cloneRefId, name: copy.name };
      cls.push(clone);
      writeJsonToLocalStorage("savedChecklists", cls);
      copy.source = { kind: "checklist", refId: cloneRefId };
      copy.nav = { to: "/builder", state: { checklistId: cloneRefId } };
    }
  }

  lib.templates.push(copy);
  writeLibrary(lib);
  return lib;
}

export function deleteTemplate(
  id: string,
  engagements: { id: string }[]
): { blocked: true } | Library {
  const lib = load();
  const t = lib.templates.find(t => t.id === id);
  if (!t) { writeLibrary(lib); return lib; }
  if (linkedCount(t, engagements) > 0) return { blocked: true };

  lib.templates = lib.templates.filter(t => t.id !== id);
  // Clear defaults pointing to it
  for (const k of Object.keys(lib.defaults)) {
    if (lib.defaults[k] === id) delete lib.defaults[k];
  }
  // Remove source record
  if (t.source.kind === "engagement") {
    const engs = readJsonFromLocalStorage<EngSource[]>("myEngagementTemplates", []);
    writeJsonToLocalStorage("myEngagementTemplates", engs.filter(e => e.id !== t.source.refId));
  } else if (t.source.kind === "checklist") {
    const cls = readJsonFromLocalStorage<ChecklistSource[]>("savedChecklists", []);
    writeJsonToLocalStorage("savedChecklists", cls.filter(c => c.id !== t.source.refId));
  }
  writeLibrary(lib);
  return lib;
}

export function setStatus(id: string, status: "published" | "draft"): Library {
  const lib = load();
  const t = lib.templates.find(t => t.id === id);
  if (t) {
    t.status = status;
    t.updatedAt = new Date().toISOString();
    if (status === "draft") {
      const key = defaultKey(t);
      if (lib.defaults[key] === id) delete lib.defaults[key];
    }
  }
  writeLibrary(lib);
  return lib;
}

export function setAvailability(id: string, officeIds: string[]): Library {
  if (officeIds.length === 0) return load();
  const lib = load();
  const t = lib.templates.find(t => t.id === id);
  if (t) {
    t.availableOfficeIds = officeIds;
    t.updatedAt = new Date().toISOString();
  }
  writeLibrary(lib);
  return lib;
}

export function setDefault(id: string): Library {
  const lib = load();
  const t = lib.templates.find(t => t.id === id);
  if (t && t.status === "published") {
    lib.defaults[defaultKey(t)] = id;
  }
  writeLibrary(lib);
  return lib;
}

export function clearDefault(id: string): Library {
  const lib = load();
  const t = lib.templates.find(t => t.id === id);
  if (t) {
    const key = defaultKey(t);
    if (lib.defaults[key] === id) delete lib.defaults[key];
  }
  writeLibrary(lib);
  return lib;
}

export function getDescendantTemplateCount(lib: Library, folderId: string): number {
  return descendantTemplateCount(lib, folderId);
}

const TYPE_LABEL: Partial<Record<TemplateTypeId, string>> = {
  engagements: "Engagement",
  "financial-statements": "Financial statements",
  letters: "Letter",
  checklists: "Checklist",
  reports: "Report",
  worksheets: "Worksheet",
  notes: "Note",
};

function globalEngTypeToEngagementType(et: string): EngagementType {
  if (et === "Audit" || et === "Review" || et === "Compilation" || et === "Tax") return et;
  return "Any";
}

export function addFromGlobal(
  items: import("@/lib/globalTemplateCatalog").GlobalItem[],
  folderId: string | null,
  officeIds: string[]
): { ok: true; added: number } | { ok: false; duplicates: string[] } {
  if (items.length === 0) return { ok: true, added: 0 };
  const lib = load();
  const type = items[0].type;
  const folderName = folderId ? (lib.folders.find(f => f.id === folderId)?.name ?? "Templates") : "Templates";

  // Duplicate check (case-insensitive) within the target folder
  const existingNames = new Set(
    lib.templates
      .filter(t => t.type === type && t.folderId === folderId)
      .map(t => t.name.toLowerCase())
  );
  const duplicates = items
    .filter(item => existingNames.has(item.name.toLowerCase()))
    .map(item => item.name);
  if (duplicates.length > 0) return { ok: false, duplicates };

  const now = new Date().toISOString();
  const activeOffice = getActiveOfficeId();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const jurisdiction: "CA" | "US" = item.region === "US" ? "US" : "CA";
    const cornerTag = item.region === "CA" ? "CA" : item.region === "US" ? "US" : "CA & US";
    const typeLabel = TYPE_LABEL[item.type] ?? item.type;
    const newId = `global-${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`;

    let source: FirmTemplate["source"];
    let nav: NavTarget;

    if (item.type === "engagements") {
      const refId = `my-eng-${Date.now()}-${i}`;
      const view = getEngPickerTemplateView(item.id);
      const engRecord: MyEngagementTemplate = view
        ? templateViewToMyTemplate(view, folderId ?? "root", folderName, refId)
        : { id: refId, name: item.name, folderId: folderId ?? "root", folderName, sections: [],
            sourceTemplateId: item.id, createdAt: now, updatedAt: now };
      engRecord.name = item.name;
      engRecord.sourceTemplateId = item.id;
      const existing = readJsonFromLocalStorage<MyEngagementTemplate[]>("myEngagementTemplates", []);
      writeJsonToLocalStorage("myEngagementTemplates", [...existing, engRecord]);
      window.dispatchEvent(new CustomEvent("engagementTemplateSaved", { detail: engRecord }));
      source = { kind: "engagement", refId };
      nav = { to: `/engagement-templates?myTemplate=${refId}` };
    } else if (item.type === "checklists") {
      const refId = `checklist-${Date.now()}-${i}`;
      const checklistData = getGlobalTemplateChecklist(item.id);
      const clRecord: ChecklistSource = {
        id: refId,
        name: item.name,
        folderId: folderId ?? "root",
        folderName,
        data: checklistData ? { ...checklistData, id: refId, title: item.name, createdAt: new Date(), updatedAt: new Date() } : undefined,
      };
      const existing = readJsonFromLocalStorage<ChecklistSource[]>("savedChecklists", []);
      writeJsonToLocalStorage("savedChecklists", [...existing, clRecord]);
      window.dispatchEvent(new CustomEvent("checklistSaved", { detail: clRecord }));
      source = { kind: "checklist", refId };
      nav = { to: "/builder", state: { checklistId: refId } };
    } else {
      source = { kind: "global", refId: item.id };
      nav = item.nav;
    }

    lib.templates.push({
      id: newId,
      name: item.name,
      subtitle: item.subtitle,
      type: item.type,
      folderId,
      engagementType: globalEngTypeToEngagementType(item.engagementType),
      framework: item.framework,
      standards: undefined,
      cornerTag,
      tags: [typeLabel],
      status: "draft",
      jurisdiction,
      ownerOfficeId: activeOffice,
      availableOfficeIds: officeIds,
      linkedSeed: 0,
      updatedAt: now,
      source,
      nav,
      globalId: item.id,
    });
  }

  writeLibrary(lib);
  return { ok: true, added: items.length };
}

export function isInFirmLibrary(lib: Library, globalId: string): boolean {
  return lib.templates.some(t => t.globalId === globalId);
}
