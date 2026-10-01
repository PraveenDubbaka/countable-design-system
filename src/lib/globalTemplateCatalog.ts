import { type TemplateTypeId, type Framework, type NavTarget } from "@/lib/firmTemplateLibrary";
import {
  initialGlobalTemplates,
  initialGlobalWorksheets,
  initialGlobalLetters,
  initialGlobalReports,
  engPickerTreeCA,
  engPickerTreeUS,
  getEngPickerTemplateView,
  type GlobalTemplate,
} from "@/lib/globalTemplateTrees";
import { globalTemplatesByEntity } from "@/components/dashboard/templates/TemplateSidebarMenu";
import { type TreeItem } from "@/lib/engagementTemplatesData";

export type GlobalEngType = "Audit" | "Review" | "Compilation" | "Tax" | "Other";
export type EntityType =
  | "Corporation"
  | "Partnership"
  | "Not-for-profit"
  | "Trust"
  | "Sole proprietorship"
  | "LLC"
  | "Any";

export interface GlobalItem {
  id: string;
  name: string;
  subtitle: string;
  type: TemplateTypeId;
  engagementType: GlobalEngType;
  framework: Framework;
  region: "CA" | "US" | "Both";
  entityType: EntityType;
  suggested: boolean;
  nav: NavTarget;
}

const ENG_TYPE_ORDER: GlobalEngType[] = ["Audit", "Review", "Compilation", "Tax", "Other"];

function toEngType(folderName: string): GlobalEngType {
  const n = folderName.toLowerCase();
  if (n.startsWith("compilation")) return "Compilation";
  if (n.startsWith("review")) return "Review";
  if (n.startsWith("audit")) return "Audit";
  if (n.startsWith("tax")) return "Tax";
  return "Other";
}

function getRegion(id: string, name: string, ancestorNames: string[]): "CA" | "US" | "Both" {
  if (ancestorNames.includes("Canada")) return "CA";
  if (ancestorNames.includes("United States")) return "US";
  const lid = id.toLowerCase();
  if (lid.startsWith("gca-") || lid.startsWith("glt-ca-") || lid.startsWith("grpt-ca-")) return "CA";
  if (lid.startsWith("gus-") || lid.startsWith("glt-us-") || lid.startsWith("grpt-us-")) return "US";
  if (/T2/.test(name)) return "CA";
  if (/Form 1120|1065/.test(name)) return "US";
  return "Both";
}

function getFramework(name: string, isFS = false): Framework {
  const n = name.toLowerCase();
  if (n.includes("income tax basis") || n.includes("tax basis")) return "Tax basis";
  if (n.includes("asnpo")) return "ASNPO";
  if (n.includes("aspe")) return "ASPE";
  if (n.includes("ifrs")) return "IFRS";
  if (n.includes("us gaap")) return "US GAAP";
  if (isFS && n.includes("gaap")) return "US GAAP";
  return "Any";
}

function refineRegion(
  region: "CA" | "US" | "Both",
  framework: Framework,
  name: string,
  ancestorNames: string[]
): "CA" | "US" | "Both" {
  if (region !== "Both") return region;
  if (framework === "ASPE" || framework === "ASNPO") return "CA";
  if (framework === "US GAAP") return "US";
  const all = [name, ...ancestorNames].join(" ");
  if (/CSRS|CSRE|CAS |CPA Canada/i.test(all)) return "CA";
  if (/SSARS|AR-C|AU-C|AICPA|PCAOB/i.test(all)) return "US";
  return "Both";
}

function getEntityType(name: string): EntityType {
  const n = name.toLowerCase();
  if (
    n.includes("(corp)") ||
    n.includes("corporation") ||
    n.includes("c-corporation") ||
    n.includes("s-corporation") ||
    /\b1120\b/.test(n)
  )
    return "Corporation";
  if (n.includes("partnership") || /\b1065\b/.test(n)) return "Partnership";
  if (n.includes("asnpo") || n.includes("nfp") || n.includes("npo") || n.includes("not-for-profit"))
    return "Not-for-profit";
  if (n.includes("trust")) return "Trust";
  if (n.includes("sole proprietor")) return "Sole proprietorship";
  if (n.includes("llc")) return "LLC";
  return "Any";
}

function fsEntityType(entityKey: string): EntityType {
  if (["Corporations", "C-Corp", "S-Corp"].includes(entityKey)) return "Corporation";
  if (["Partnership", "Partnerships"].includes(entityKey)) return "Partnership";
  if (entityKey.startsWith("LLC")) return "LLC";
  if (entityKey === "Sole Proprietorship") return "Sole proprietorship";
  if (["Trust", "Trusts"].includes(entityKey)) return "Trust";
  if (entityKey === "NFPs") return "Not-for-profit";
  return "Any";
}

function fsRegion(entityKey: string): "CA" | "US" {
  if (entityKey === "C-Corp" || entityKey === "S-Corp") return "US";
  return "CA";
}

function regionLabel(region: "CA" | "US" | "Both"): string {
  if (region === "CA") return "Canada";
  if (region === "US") return "United States";
  return "CA & US";
}

// Walk engagement picker tree (CA or US)
function walkEngTree(
  items: TreeItem[],
  region: "CA" | "US",
  ancestorEngType: GlobalEngType | null,
  out: GlobalItem[]
): void {
  for (const item of items) {
    if (item.type === "folder") {
      const engType = ancestorEngType ?? toEngType(item.label);
      walkEngTree(item.children ?? [], region, engType, out);
    } else {
      const engType = ancestorEngType ?? "Other";
      const view = getEngPickerTemplateView(item.id);
      const reg = region;
      const regLabel = regionLabel(reg);
      out.push({
        id: item.id,
        name: item.label,
        subtitle: `${engType} · ${regLabel}`,
        type: "engagements",
        engagementType: engType,
        framework: getFramework(item.label),
        region: reg,
        entityType: getEntityType(item.label),
        suggested: item.suggested ?? false,
        nav: { to: `/engagement-templates?template=${view?.id ?? item.id}` },
      });
    }
  }
}

// Walk GlobalTemplate trees (checklists, worksheets, letters, reports)
function walkGlobalTree(
  items: GlobalTemplate[],
  type: TemplateTypeId,
  ancestorNames: string[],
  ancestorEngType: GlobalEngType | null,
  out: GlobalItem[]
): void {
  for (const item of items) {
    if (item.type === "folder") {
      const engType = ancestorEngType ?? toEngType(item.name);
      walkGlobalTree(item.children ?? [], type, [...ancestorNames, item.name], engType, out);
    } else {
      const engType = ancestorEngType ?? "Other";
      const rawRegion = getRegion(item.id, item.name, ancestorNames);
      const framework = getFramework(item.name);
      const region = refineRegion(rawRegion, framework, item.name, ancestorNames);
      const regLabel = regionLabel(region);
      out.push({
        id: item.id,
        name: item.name,
        subtitle: `${engType} · ${regLabel}`,
        type,
        engagementType: engType,
        framework,
        region,
        entityType: getEntityType(item.name),
        suggested: item.suggested ?? false,
        nav: { to: "/builder", state: { globalTemplateId: item.id } },
      });
    }
  }
}

// Walk FS globalTemplatesByEntity
function buildFsItems(): GlobalItem[] {
  const out: GlobalItem[] = [];
  const seen = new Set<string>(); // dedup by label
  for (const [entityKey, folders] of Object.entries(globalTemplatesByEntity)) {
    const region = fsRegion(entityKey);
    const entityType = fsEntityType(entityKey);
    for (const folder of folders) {
      const engType = toEngType(folder.label);
      for (const leaf of folder.children ?? []) {
        const label = leaf.label;
        if (seen.has(label)) continue;
        seen.add(label);
        const regLabel = regionLabel(region);
        out.push({
          id: `fs-${entityKey}-${leaf.code}`,
          name: label,
          subtitle: `${engType} · ${regLabel}`,
          type: "financial-statements",
          engagementType: engType,
          framework: getFramework(label, true),
          region,
          entityType,
          suggested: false,
          nav: { to: `/financial-statement-templates?template=${encodeURIComponent(label)}` },
        });
      }
    }
  }
  return out;
}

function buildAllItems(): GlobalItem[] {
  const out: GlobalItem[] = [];
  walkEngTree(engPickerTreeCA, "CA", null, out);
  walkEngTree(engPickerTreeUS, "US", null, out);
  walkGlobalTree(initialGlobalTemplates, "checklists", [], null, out);
  walkGlobalTree(initialGlobalWorksheets, "worksheets", [], null, out);
  walkGlobalTree(initialGlobalLetters, "letters", [], null, out);
  walkGlobalTree(initialGlobalReports, "reports", [], null, out);
  out.push(...buildFsItems());
  // notes → []
  return out;
}

const ALL_ITEMS = buildAllItems();

export function getGlobalItems(type: TemplateTypeId | "all"): GlobalItem[] {
  if (type === "all") return ALL_ITEMS;
  return ALL_ITEMS.filter(item => item.type === type);
}

export function getGlobalFolders(
  type: TemplateTypeId | "all"
): Array<{ engagementType: GlobalEngType; count: number }> {
  const items = getGlobalItems(type);
  const counts = new Map<GlobalEngType, number>();
  for (const item of items) {
    counts.set(item.engagementType, (counts.get(item.engagementType) ?? 0) + 1);
  }
  return ENG_TYPE_ORDER.filter(et => (counts.get(et) ?? 0) > 0).map(et => ({
    engagementType: et,
    count: counts.get(et) ?? 0,
  }));
}
