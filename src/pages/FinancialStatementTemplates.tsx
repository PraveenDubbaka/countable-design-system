import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import TemplatePreview from "@/components/dashboard/templates/TemplatePreview";
import { TemplateDetailHeader } from "@/components/templates/TemplateDetailHeader";
import { GlobalTemplateHeader } from "@/components/templates/GlobalTemplateHeader";

const dispatchEditMode = (active: boolean) =>
 window.dispatchEvent(new CustomEvent("fs-template-edit-mode", { detail: { active } }));

export default function FinancialStatementTemplates() {
 const [searchParams] = useSearchParams();
 const template = searchParams.get("template");
 const isMyTemplates = searchParams.get("source") === "my";
 const ftParam = searchParams.get("ft");
 const gtParam = searchParams.get("gt");

 return (
 <Layout title="Templates">
 <div className="flex flex-col h-full overflow-hidden">
 {ftParam && <TemplateDetailHeader firmTemplateId={ftParam} />}
 {gtParam && <GlobalTemplateHeader globalId={gtParam} />}
 <div className="flex-1 min-h-0">
 <TemplatePreview
 selectedTemplate={template ? decodeURIComponent(template) : null}
 isMyTemplates={isMyTemplates}
 onCollapseSidebar={dispatchEditMode}
 hideOwnActions={!!ftParam || !!gtParam}
 />
 </div>
 </div>
 </Layout>
 );
}
