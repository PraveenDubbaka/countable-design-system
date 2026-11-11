import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CloudUpload, FileDown, FileQuestion } from "lucide-react";
import { Layout } from "@/components/Layout";

// UI only: choosing or dropping a file shows its name, nothing is read or imported.
export default function UploadTeamMembers() {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null | undefined) => {
    const file = files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <Layout title="Team">
      <div className="flex flex-col h-full overflow-hidden bg-background">

        {/* Sticky header bar */}
        <div className="flex items-center px-6 pt-6 pb-4 flex-shrink-0 border-b border-border/60">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Back to Team"
              onClick={() => navigate("/teams")}
              className="text-link hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-foreground">Upload Existing Member</h2>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-8 pt-4 space-y-4">
          {/* Template links (no action yet) */}
          <div className="flex items-center gap-6">
            <button type="button" className="flex items-center gap-2 text-link font-medium text-sm hover:underline">
              <FileDown className="h-4 w-4" />
              Download Template
            </button>
            <button type="button" className="flex items-center gap-2 text-link font-medium text-sm hover:underline">
              <FileQuestion className="h-4 w-4" />
              How to create template
            </button>
          </div>

          {/* Drop zone */}
          <label
            className={`flex w-full max-w-[560px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border px-6 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-ring ${
              isDragging ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
            }`}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
          >
            <input type="file" className="sr-only" onChange={e => handleFiles(e.target.files)} />
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <CloudUpload className="h-5 w-5 text-foreground" />
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
            </span>
            {fileName && <span className="text-sm font-medium text-foreground break-all">{fileName}</span>}
          </label>
        </div>
      </div>
    </Layout>
  );
}
