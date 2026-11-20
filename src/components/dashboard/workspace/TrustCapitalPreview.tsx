import EditableTitleBlock from "./EditableTitleBlock";
import EditableTableControls from "./EditableTableControls";
import { useStatementOverlays } from "./StatementImageOverlays";
import { useLayoutSettings, getFontFamily, getBodyPadding, getCompressionScale, formatValue } from "./LayoutSettingsContext";

interface TrustCapitalPreviewProps {
 isEditMode?: boolean;
 onContentChanged?: (hasChanges: boolean) => void;
}

// Statement of Changes in Trust Net Assets (P4). Row/column structure follows the existing
// Templates-gallery reference (TemplateTrustCapitalPreview.tsx) — the closest real prior art for
// this statement in the codebase — adapted to the real engagement workspace's page chrome.
const TrustCapitalPreview = ({ isEditMode = false, onContentChanged }: TrustCapitalPreviewProps) => {
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

 let firstDataRow = true;
 const fvRow = (val: string, isTotal?: boolean) => {
 const isFirst = firstDataRow && val !== "-" && val !== "";
 if (isFirst) firstDataRow = false;
 return fv(val, isFirst, isTotal);
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
 pageName="Statement of Changes in Trust Net Assets"
 dateLabel="For the year ended December 31, 2025"
 />

 <EditableTableControls isEditMode={isEditMode}>
 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: baseFontSize }}>
 <thead>
 <tr>
 <th className={`${thickBorderTop} ${thickBorderBottom}`} style={{ width: "40%", textAlign: "left", padding: "4px 2px" }}></th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "20%", fontWeight: 700 }}>Capital<br />Contributed</th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "20%", fontWeight: 700 }}>Accumulated<br />Income</th>
 <th className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ width: "20%", fontWeight: 700 }}>Total Trust<br />Net Assets</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td className={labelStyle} style={{ fontWeight: 700, paddingTop: 8 }}>Balance, beginning of year</td>
 <td className={cellStyle} style={{ fontWeight: 700 }}>{fvRow("1,000")}</td>
 <td className={cellStyle} style={{ fontWeight: 700 }}>{fvRow("4,266,340")}</td>
 <td className={cellStyle} style={{ fontWeight: 700 }}>{fv("4,267,340", false, true)}</td>
 </tr>

 <tr><td style={{ height: 6 }}></td><td></td><td></td><td></td></tr>

 <tr>
 <td className={labelStyle} style={{ paddingLeft: 16 }}>Contributions</td>
 <td className={cellStyle}>-</td>
 <td className={cellStyle}>-</td>
 <td className={cellStyle}>-</td>
 </tr>
 <tr>
 <td className={`${labelStyle} ${borderBottom}`} style={{ paddingLeft: 16 }}>Income allocated for the year</td>
 <td className={`${cellStyle} ${borderBottom}`}>-</td>
 <td className={`${cellStyle} ${borderBottom}`}>{fvRow("837,900")}</td>
 <td className={`${cellStyle} ${borderBottom}`}>{fv("837,900", false, false)}</td>
 </tr>

 <tr><td style={{ height: 6 }}></td><td></td><td></td><td></td></tr>

 <tr>
 <td className={`${labelStyle} ${borderBottom}`} style={{ paddingLeft: 16 }}>Distributions to beneficiaries</td>
 <td className={`${cellStyle} ${borderBottom}`}>-</td>
 <td className={`${cellStyle} ${borderBottom}`}>{fvRow("(350,000)")}</td>
 <td className={`${cellStyle} ${borderBottom}`}>{fv("(350,000)", false, false)}</td>
 </tr>

 <tr><td style={{ height: 8 }}></td><td></td><td></td><td></td></tr>

 <tr>
 <td className={`${labelStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>Balance, end of year</td>
 <td className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>{fv("1,000", false, true)}</td>
 <td className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>{fv("4,754,240", false, true)}</td>
 <td className={`${cellStyle} ${thickBorderTop} ${thickBorderBottom}`} style={{ fontWeight: 700 }}>{fv("4,755,240", false, true)}</td>
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

export default TrustCapitalPreview;
