// Partner package export (P14 — "FS package and client package" / the confidentiality problem).
//
// A columnar capital statement shows every partner what every other partner earned and withdrew.
// The Full package (to the partnership) shows every holder's column; the Partner package (to one
// individual) shows only that holder's own column plus the Total — never another holder's figures.
//
// Scope note: the Balance Sheet/Income Statement/Notes pages elsewhere in the FS folder are still
// static placeholder content (one demo company, not wired to each engagement's real client/TB
// data — see FSPageViewer.tsx/BalanceSheetPreview.tsx), so bundling them here would show the wrong
// company for every engagement. This export covers the one real, entity-aware, per-holder
// statement — the Capital Statement — which is also the actual source of the confidentiality
// problem the packages exist to solve.
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { buildCapitalStatement, toPublicEntities, type CapitalStatementData, type PublicCapitalEntity } from "@/lib/capitalStatement";
import { getEntityLabels, type EntityKind, type EntityLabels } from "@/lib/entityLabels";
import { loadParticipants } from "@/store/participantsStore";
import { loadPWWorksheet } from "@/store/partnershipWorksheetStore";
import { appendPartnerPackageLogEntries, type PartnerPackageLogEntry } from "@/store/partnerPackageLogStore";

const fmt = (n: number) => {
 if (Math.abs(n) < 0.005) return "0.00";
 const abs = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
 return n < 0 ? `(${abs})` : abs;
};

const sanitizeFileNamePart = (s: string) => s.replace(/[\\/:*?"<>|]/g, "-").trim();

export interface CapitalStatementPdfOptions {
 client: string;
 yearEnd: string;
 /** "all" is the Full package (every holder's own column, to the partnership). A participant id
 * is a Partner package: only that participant's column, plus the Total — every other holder's
 * figures are structurally absent from the document, not just hidden in the UI. */
 visibility: "all" | string;
}

/** Builds the capital-statement PDF itself. Takes only `PublicCapitalEntity[]` — never
 * `CapitalRow[]`/`Participant[]` — so a sensitive field (tax identifier, admission/retirement
 * date) can't reach the renderer even by accident; see capitalStatement.ts's PublicCapitalEntity. */
function buildCapitalStatementDoc(entities: PublicCapitalEntity[], totals: CapitalStatementData["totals"], labels: EntityLabels, opts: CapitalStatementPdfOptions): jsPDF {
 const doc = new jsPDF({ unit: "pt", format: "a4" });
 const pageWidth = doc.internal.pageSize.getWidth();
 const margin = 40;

 const visibleEntities = opts.visibility === "all" ? entities : entities.filter(e => e.id === opts.visibility);
 const isPartnerCopy = opts.visibility !== "all";

 doc.setFillColor(28, 99, 166);
 doc.rect(0, 0, pageWidth, 64, "F");
 doc.setTextColor(255, 255, 255);
 doc.setFont("helvetica", "bold");
 doc.setFontSize(16);
 doc.text(opts.client, margin, 30);
 doc.setFont("helvetica", "normal");
 doc.setFontSize(11);
 doc.text(labels.statementTitle, margin, 48);

 doc.setTextColor(20, 20, 20);
 let cursorY = 84;
 doc.setFontSize(10);
 doc.text(`For the year ended ${opts.yearEnd}`, margin, cursorY);
 cursorY += 16;

 if (isPartnerCopy) {
 doc.setFont("helvetica", "bold");
 doc.text(`Prepared for: ${visibleEntities[0]?.name ?? labels.holder}`, margin, cursorY);
 doc.setFont("helvetica", "normal");
 cursorY += 16;
 }

 type RowKey = "opening" | "contributions" | "ni" | "drawings" | "adjustments";
 const hasAdj = Math.abs(totals.adjustments) > 0.005;
 const rowDefs: { label: string; key: RowKey }[] = [
 { label: "Balance, beginning of year", key: "opening" },
 { label: labels.contributions, key: "contributions" },
 { label: "Net income allocated", key: "ni" },
 { label: labels.drawings, key: "drawings" },
 ...(hasAdj ? [{ label: "Adjustments", key: "adjustments" as const }] : []),
 ];
 const val = (o: { opening: number; contributions: number; ni: number; drawings: number; adjustments: number }, k: RowKey) =>
 k === "drawings" ? -o.drawings : o[k];

 const head = [["", ...visibleEntities.map(e => e.name), "Total"]];
 const body: string[][] = rowDefs.map(r => [
 r.label,
 ...visibleEntities.map(e => fmt(val(e, r.key))),
 fmt(val(totals, r.key)),
 ]);
 body.push([
 "Balance, end of year",
 ...visibleEntities.map(e => fmt(e.closing)),
 fmt(totals.closing),
 ]);
 const totalRowIndex = body.length - 1;

 autoTable(doc, {
 startY: cursorY,
 head,
 body,
 theme: "grid",
 margin: { left: margin, right: margin },
 styles: { font: "helvetica", fontSize: 9, cellPadding: 6, textColor: [30, 30, 40], halign: "right" },
 headStyles: { fillColor: [240, 244, 250], textColor: [28, 99, 166], fontStyle: "bold", halign: "right" },
 columnStyles: { 0: { halign: "left", fontStyle: "bold" } },
 didParseCell: (hookData) => {
 if (hookData.section === "body" && hookData.row.index === totalRowIndex) {
 hookData.cell.styles.fontStyle = "bold";
 hookData.cell.styles.fillColor = [240, 244, 250];
 }
 },
 });

 const totalPages = doc.getNumberOfPages();
 for (let i = 1; i <= totalPages; i++) {
 doc.setPage(i);
 const ph = doc.internal.pageSize.getHeight();
 doc.setDrawColor(220, 224, 230);
 doc.line(margin, ph - 28, pageWidth - margin, ph - 28);
 doc.setFont("helvetica", "normal");
 doc.setFontSize(8);
 doc.setTextColor(130, 130, 140);
 doc.text("CONFIDENTIAL", margin, ph - 14);
 doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, ph - 14, { align: "right" });
 }

 return doc;
}

export interface GeneratePartnerPackagesResult {
 fileCount: number;
}

/** Batch-generates the Full package (one PDF, every holder's column) plus one Partner package per
 * holder (Total + their own column only), zips them, and downloads the zip — the P14 "one action,
 * one file per partner, delivered as a zip" requirement. Also appends a generation-log entry per
 * file (src/store/partnerPackageLogStore.ts): there's no send/email pipeline in this prototype, so
 * "delivered to whom and when" is recorded as "generated for whom and when". */
export async function generatePartnerPackages(
 engagementId: string,
 entityType: EntityKind,
 client: string,
 yearEnd: string,
 trustVariant: "unit" | "other" = "other",
): Promise<GeneratePartnerPackagesResult> {
 const participants = loadParticipants(engagementId);
 const worksheet = loadPWWorksheet(engagementId);
 const labels = getEntityLabels(entityType, trustVariant);
 const data = buildCapitalStatement(engagementId, entityType, participants, worksheet, trustVariant);
 const entities = toPublicEntities(data.rows);

 if (entities.length === 0) {
 throw new Error(`No ${labels.holders.toLowerCase()} recorded yet — add them on the engagement's ${labels.worksheetName} worksheet before generating packages.`);
 }

 const zip = new JSZip();
 const logEntries: PartnerPackageLogEntry[] = [];
 const now = new Date().toISOString();
 const clientPart = sanitizeFileNamePart(client);
 const yearPart = sanitizeFileNamePart(yearEnd);

 const fullDoc = buildCapitalStatementDoc(entities, data.totals, labels, { client, yearEnd, visibility: "all" });
 const fullFileName = `${clientPart} — ${yearPart} — Full package.pdf`;
 zip.file(fullFileName, fullDoc.output("blob"));
 logEntries.push({ id: `${now}-full`, engagementId, generatedAt: now, packageType: "full", fileName: fullFileName });

 entities.forEach(entity => {
 const partnerDoc = buildCapitalStatementDoc(entities, data.totals, labels, { client, yearEnd, visibility: entity.id ?? entity.name });
 const fileName = `${clientPart} — ${yearPart} — ${sanitizeFileNamePart(entity.name)}.pdf`;
 zip.file(fileName, partnerDoc.output("blob"));
 logEntries.push({
 id: `${now}-${entity.id ?? entity.name}`,
 engagementId,
 generatedAt: now,
 packageType: "partner",
 participantId: entity.id,
 participantName: entity.name,
 fileName,
 });
 });

 const blob = await zip.generateAsync({ type: "blob" });
 saveAs(blob, `${clientPart} — ${yearPart} — Partner packages.zip`);

 appendPartnerPackageLogEntries(engagementId, logEntries);
 return { fileCount: logEntries.length };
}
