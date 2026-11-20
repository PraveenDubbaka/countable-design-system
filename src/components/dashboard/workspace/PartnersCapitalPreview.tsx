import EditableTitleBlock from "./EditableTitleBlock";
import EditableTableControls from "./EditableTableControls";
import { useStatementOverlays } from "./StatementImageOverlays";
import { useLayoutSettings, getFontFamily, getBodyPadding, getCompressionScale, formatValue } from "./LayoutSettingsContext";

interface PartnersCapitalPreviewProps {
 isEditMode?: boolean;
 onContentChanged?: (hasChanges: boolean) => void;
}

// Statement of Partners' Capital (P4) — template level, placeholder partner columns.
// A real, data-driven matrix keyed to actual Participants and the Partners' Capital worksheet
// is explicitly later work (P8/P9); this gives the template a real, clickable page in the
// meantime, matching the column-placeholder approach P9 itself describes for the template level.
// Beginning balances sum to the Balance Sheet's prior-year Partners' capital (4,267,340); the
// income allocation sums to the Income Statement's Net income (837,900); drawings sum to 350,000
// (the same total the corporation template shows as "Dividends declared"); closing balances
// therefore tie to the Balance Sheet's current-year Partners' capital (4,755,240) — a 50/30/20
// placeholder split across the three sample partners.
const ROWS: { label: string; values: [string, string, string]; bold?: boolean; isTotal?: boolean }[] = [
 { label: "Balance, beginning of year", values: ["2,500,000", "1,267,340", "500,000"], bold: true },
 { label: "Contributions", values: ["-", "-", "-"] },
 { label: "Allocation of net income", values: ["418,950", "251,370", "167,580"] },
 { label: "Drawings", values: ["(175,000)", "(105,000)", "(70,000)"] },
];

const PartnersCapitalPreview = ({ isEditMode = false, onContentChanged }: PartnersCapitalPreviewProps) => {
 const { settings } = useLayoutSettings();
 const { pageRef, renderOverlays } = useStatementOverlays(isEditMode);
 const fontFamily = getFontFamily(settings);
 const bodyPadding = getBodyPadding(settings);
 const scale = getCompressionScale(settings);
 const baseFontSize = 15 * scale;
 const fv = (val: string, isFirst?: boolean, isTotal?: boolean) => formatValue(val, settings, isFirst, isTotal);

 const showHeader = settings.headerFooterEnabled && settings.headerScope !== "none";
 const showFooter = settings.headerFooterEnabled && settings.footerScope !== "none";

 const cellStyle = "px-2 py-[3px] text-right whitespace-nowrap";
 const labelStyle = "px-2 py-[3px] text-left";
 const borderBottom = "border-b border-black";
 const thickBorderBottom = "border-b-2 border-black";
 const thickBorderTop = "border-t-2 border-black";

 const rowTotal = (values: string[]) => {
 const sum = values.reduce((acc, v) => acc + (v === "-" ? 0 : Number(v.replace(/[(),]/g, "")) * (v.startsWith("(") ? -1 : 1)), 0);
 const abs = Math.abs(sum).toLocaleString("en-US");
 return sum < 0 ? `(${abs})` : abs;
 };
 const closing = ["partner-1", "partner-2", "partner-3"].map((_, i) =>
 ROWS.reduce((acc, r) => acc + (r.values[i] === "-" ? 0 : Number(r.values[i].replace(/[(),]/g, "")) * (r.values[i].startsWith("(") ? -1 : 1)), 0)
 );

 let firstDataRow = true;
 const fvRow = (val: string, isTotal?: boolean) => {
 const isFirst = firstDataRow && val !== "-" && val !== "";
 if (isFirst) firstDataRow = false;
 return val === "-" ? "-" : fv(val, isFirst, isTotal);
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
 entityName="Northline Precision Manufacturing Inc."
 pageName="Statement of Partners' Capital"
 dateLabel="For the year ended December 31, 2025"
 />

 <EditableTableControls isEditMode={isEditMode}>
 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: baseFontSize }}>
 <thead>
 <tr>
 <th className={`${thickBorderTop} ${thickBorderBottom}`} style={{ width: "28%", textAlign: "left", padding: "4px 2px" }}></th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "18%", fontWeight: 700 }}>Partner 1</th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "18%", fontWeight: 700 }}>Partner 2</th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "18%", fontWeight: 700 }}>Partner 3</th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "18%", fontWeight: 700 }}>Total</th>
 </tr>
 </thead>
 <tbody>
 {ROWS.map((r, i) => (
 <tr key={i}>
 <td className={labelStyle} style={{ fontWeight: r.bold ? 700 : 400, paddingTop: i === 0 ? 8 : undefined }}>{r.label}</td>
 {r.values.map((v, ci) => (
 <td key={ci} className={cellStyle} style={{ fontWeight: r.bold ? 700 : 400 }}>{fvRow(v)}</td>
 ))}
 <td className={cellStyle} style={{ fontWeight: r.bold ? 700 : 400 }}>{r.values.every(v => v === "-") ? "-" : fv(rowTotal(r.values), false, false)}</td>
 </tr>
 ))}

 <tr><td style={{ height: 8 }}></td><td></td><td></td><td></td><td></td></tr>

 <tr>
 <td className={`${labelStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>Balance, end of year</td>
 {closing.map((v, i) => (
 <td key={i} className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>{fv(v.toLocaleString("en-US"), false, true)}</td>
 ))}
 <td className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>{fv(closing.reduce((a, b) => a + b, 0).toLocaleString("en-US"), false, true)}</td>
 </tr>
 </tbody>
 </table>
 </EditableTableControls>
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

export default PartnersCapitalPreview;
