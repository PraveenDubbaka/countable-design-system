import EditableTitleBlock from "./EditableTitleBlock";
import EditableTableControls from "./EditableTableControls";
import { useStatementOverlays } from "./StatementImageOverlays";
import { useLayoutSettings, getFontFamily, getBodyPadding, getCompressionScale, formatValue } from "./LayoutSettingsContext";
import { loadParticipants } from "@/store/participantsStore";
import { loadPWWorksheet } from "@/store/partnershipWorksheetStore";
import { getEngagementMeta } from "@/store/engagementsStore";
import { getEntityLabels, type EntityKind } from "@/lib/entityLabels";
import { buildCapitalStatement, type CapitalRow } from "@/lib/capitalStatement";

interface CapitalStatementPageProps {
 engagementId: string;
 entityType: EntityKind;
 /** Only meaningful when entityType === "Trust" — see entityLabels.ts. */
 trustVariant?: "unit" | "other";
 clientName: string;
 yearEnd: string;
 isEditMode?: boolean;
 onContentChanged?: (hasChanges: boolean) => void;
}

type RowKey = "opening" | "contributions" | "ni" | "drawings" | "adjustments";

const numStr = (n: number) => {
 const abs = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
 return n < 0 ? `(${abs})` : abs;
};

const rowVal = (r: CapitalRow, key: RowKey) =>
 key === "drawings" ? -r.drawings : key === "ni" ? r.niAllocated : r[key];

// Statement of Partners'/Unitholders'/Trust Capital — the FS-folder "eq" page for Partnership and
// Trust engagements. Shares its data (real participants + worksheet overrides, reconciled to the
// TB) with the Workbook's capital-statement screen via src/lib/capitalStatement.ts, so the two
// never drift apart; only the page chrome (header/footer, layout settings, draft watermark) is
// specific to this "printed FS page" context and stays separate from Workbook.tsx's preview pane.
const CapitalStatementPage = ({ engagementId, entityType, trustVariant = "other", clientName, yearEnd, isEditMode = false, onContentChanged }: CapitalStatementPageProps) => {
 const { settings } = useLayoutSettings();
 const { pageRef, renderOverlays } = useStatementOverlays(isEditMode);
 const fontFamily = getFontFamily(settings);
 const bodyPadding = getBodyPadding(settings);
 const scale = getCompressionScale(settings);
 const baseFontSize = 15 * scale;
 const fv = (val: string, isFirst?: boolean, isTotal?: boolean) => formatValue(val, settings, isFirst, isTotal);

 const labels = getEntityLabels(entityType, trustVariant);
 const participants = loadParticipants(engagementId);
 const worksheet = loadPWWorksheet(engagementId);
 const data = buildCapitalStatement(engagementId, entityType, participants, worksheet, trustVariant);
 const hasAdj = Math.abs(data.totals.adjustments) > 0.005;
 // Set at Create Engagement time (doc section 4 item 1) but never enforced until now: when
 // restricted/partner-only, this printed page shows only the Total column — no per-holder
 // breakdown — the same way Workbook.tsx's capital-statement preview disables its "Each holder"
 // view. A real per-partner "my account only" view is the Partner package PDF export instead.
 const capitalVisibility = getEngagementMeta(engagementId).capitalVisibility ?? "open";
 const visibilityRestricted = capitalVisibility !== "open";
 const visibleRows = visibilityRestricted ? [] : data.rows;

 const showHeader = settings.headerFooterEnabled && settings.headerScope !== "none";
 const showFooter = settings.headerFooterEnabled && settings.footerScope !== "none";

 const cellStyle = "px-2 py-[3px] text-right whitespace-nowrap";
 const labelStyle = "px-2 py-[3px] text-left";
 const thickBorderBottom = "border-b-2 border-black";
 const thickBorderTop = "border-t-2 border-black";

 const rows: { label: string; key: RowKey; indent?: boolean }[] = [
 { label: "Balance, beginning of year", key: "opening" },
 { label: labels.contributions, key: "contributions", indent: true },
 { label: "Net income allocated for the year", key: "ni", indent: true },
 { label: labels.drawings, key: "drawings", indent: true },
 ...(hasAdj ? [{ label: "Adjustments", key: "adjustments" as const, indent: true }] : []),
 ];

 let firstCell = true;
 const fvCell = (n: number) => {
 const isFirst = firstCell;
 firstCell = false;
 return fv(numStr(n), isFirst, false);
 };

 return (
 <div className="flex-1 flex items-center justify-center p-6 bg-muted/30">
 <div
 ref={pageRef}
 data-fs-page
 className="bg-white rounded-sm border border-border"
 style={{
 width: "842px",
 minHeight: "1191px",
 boxShadow: "0 4px 24px hsl(220 20% 10% / 0.08), 0 1px 4px hsl(220 20% 10% / 0.04)",
 position: "relative",
 overflow: "hidden",
 display: "flex",
 flexDirection: "column",
 fontFamily,
 }}
 >
 {renderOverlays("background")}
 {showHeader && (
 <div style={{ background: "hsl(220 15% 96%)", padding: bodyPadding, textAlign: "center", fontSize: 14 * scale, color: "#5a5a6e" }}>
 Header will come here
 </div>
 )}

 <div style={{ flex: 1, padding: bodyPadding, fontSize: baseFontSize, color: "#1a1a1a", position: "relative" }}>
 <EditableTitleBlock
 isEditMode={isEditMode}
 onContentChanged={onContentChanged}
 entityName={clientName}
 pageName={labels.statementTitle}
 dateLabel={`For the year ended ${yearEnd}`}
 />

 {data.rows.length === 0 ? (
 <p style={{ textAlign: "center", color: "#5a5a6e", fontSize: 13 * scale, padding: "32px 0" }}>
 No {labels.holders.toLowerCase()} recorded yet — add them on the engagement's {labels.worksheetName} worksheet.
 </p>
 ) : (
 <EditableTableControls isEditMode={isEditMode}>
 <div style={{ overflowX: "auto" }}>
 {visibilityRestricted && (
 <p style={{ fontSize: 11 * scale, color: "#5a5a6e", marginBottom: 6 }}>
 Capital visibility is set to {capitalVisibility === "partnerOnly" ? "Partner-only" : "Restricted"} for this engagement — individual {labels.holders.toLowerCase()} figures are not shown on this page.
 </p>
 )}
 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: baseFontSize }}>
 <thead>
 <tr>
 <th className={`${thickBorderTop} ${thickBorderBottom}`} style={{ textAlign: "left", padding: "4px 2px" }}></th>
 {visibleRows.map(r => (
 <th key={r.participant.id} className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700, minWidth: 90 }}>
 {r.participant.name || labels.holder}
 </th>
 ))}
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700, minWidth: 90 }}>Total</th>
 </tr>
 </thead>
 <tbody>
 {rows.map((row, i) => (
 <tr key={row.key}>
 <td className={labelStyle} style={{ fontWeight: i === 0 ? 700 : 400, paddingLeft: row.indent ? 16 : undefined, paddingTop: i === 0 ? 8 : undefined }}>{row.label}</td>
 {visibleRows.map(r => (
 <td key={r.participant.id} className={cellStyle} style={{ fontWeight: i === 0 ? 700 : 400 }}>{fvCell(rowVal(r, row.key))}</td>
 ))}
 <td className={cellStyle} style={{ fontWeight: i === 0 ? 700 : 400 }}>{fvCell(row.key === "drawings" ? -data.totals.drawings : row.key === "ni" ? data.totals.ni : data.totals[row.key])}</td>
 </tr>
 ))}

 <tr><td style={{ height: 8 }}></td>{visibleRows.map(r => <td key={r.participant.id}></td>)}<td></td></tr>

 <tr>
 <td className={`${labelStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>Balance, end of year</td>
 {visibleRows.map(r => (
 <td key={r.participant.id} className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>{fv(numStr(r.closing), false, true)}</td>
 ))}
 <td className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>{fv(numStr(data.totals.closing), false, true)}</td>
 </tr>
 </tbody>
 </table>
 </div>
 </EditableTableControls>
 )}
 </div>

 <div style={{ padding: `12px ${bodyPadding.split(" ")[1] || "48px"} 20px`, textAlign: "center", fontSize: 12 * scale, color: "#5a5a6e" }}>
 See accompanying notes to financial information
 </div>
 {showFooter && (
 <div style={{ background: "hsl(220 15% 96%)", padding: bodyPadding, textAlign: "center", fontSize: 14 * scale, color: "#5a5a6e" }}>
 Footer will come here
 </div>
 )}
 {renderOverlays("foreground")}

 <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-45deg)", fontSize: 64, fontWeight: 700, color: "rgba(0,0,0,0.07)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", letterSpacing: 6 }}>
 DRAFT UNDER DISCUSSION
 </div>
 </div>
 </div>
 );
};

export default CapitalStatementPage;
