import { useSearchParams } from "react-router-dom";
import { type TemplateTypeId } from "@/lib/firmTemplateLibrary";
import { FirmTemplateWorkspace } from "@/components/templates/FirmTemplateWorkspace";

export function TemplatesWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = (searchParams.get("type") as TemplateTypeId | "all") ?? "engagements";
  const folderId = searchParams.get("folder") ?? null;

  function handleTypeChange(v: TemplateTypeId | "all") {
    setSearchParams(p => { p.set("type", v); p.delete("folder"); return p; });
  }

  function handleFolderChange(id: string | null) {
    setSearchParams(p => { id ? p.set("folder", id) : p.delete("folder"); return p; });
  }

  function handleOpenGlobal() {
    window.dispatchEvent(new CustomEvent("open-global-templates"));
  }

  return (
    <div className="h-full overflow-hidden">
      <FirmTemplateWorkspace
        type={type}
        folderId={folderId}
        onTypeChange={handleTypeChange}
        onFolderChange={handleFolderChange}
        onOpenGlobal={handleOpenGlobal}
      />
    </div>
  );
}
