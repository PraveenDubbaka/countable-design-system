import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { type TemplateTypeId } from "@/lib/firmTemplateLibrary";
import { FirmTemplateWorkspace } from "@/components/templates/FirmTemplateWorkspace";
import { GlobalLibraryWorkspace } from "@/components/templates/GlobalLibraryWorkspace";

export function TemplatesWorkspace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = ((searchParams.get("type") ?? localStorage.getItem("selectedDropdown") ?? "engagements") as TemplateTypeId | "all");
  const library = searchParams.get("library");
  const folderId = searchParams.get("folder") ?? null;
  const gfolder = searchParams.get("gfolder") ?? null;

  function handleTypeChange(v: TemplateTypeId | "all") {
    setSearchParams(p => { p.set("type", v); p.delete("folder"); p.delete("gfolder"); return p; });
    if (v !== "all") {
      localStorage.setItem("selectedDropdown", v);
      window.dispatchEvent(new CustomEvent("templates-type-change", { detail: v }));
    }
  }

  function handleFolderChange(id: string | null) {
    setSearchParams(p => { id ? p.set("folder", id) : p.delete("folder"); return p; });
  }

  function handleOpenGlobal() {
    setSearchParams(p => { p.set("library", "global"); p.delete("folder"); return p; });
  }

  function handleBackToFirm() {
    setSearchParams(p => { p.delete("library"); p.delete("gfolder"); return p; });
  }

  if (library === "global") {
    return (
      <Layout title="Templates">
        <GlobalLibraryWorkspace
          type={type}
          gfolder={gfolder}
          onTypeChange={handleTypeChange}
          onBackToFirm={handleBackToFirm}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Templates">
      <div className="flex-1 overflow-y-auto h-full overflow-hidden">
        <FirmTemplateWorkspace
          type={type}
          folderId={folderId}
          onTypeChange={handleTypeChange}
          onFolderChange={handleFolderChange}
          onOpenGlobal={handleOpenGlobal}
        />
      </div>
    </Layout>
  );
}
