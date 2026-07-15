import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import TemplatePreview from "@/components/dashboard/templates/TemplatePreview";

export default function FinancialStatementTemplates() {
  const [searchParams] = useSearchParams();
  const template = searchParams.get("template");
  const isMyTemplates = searchParams.get("source") === "my";

  return (
    <Layout>
      <TemplatePreview
        selectedTemplate={template ? decodeURIComponent(template) : null}
        isMyTemplates={isMyTemplates}
      />
    </Layout>
  );
}
