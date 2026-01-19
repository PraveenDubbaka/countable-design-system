import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Upload, FileStack } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ContentType } from '@/components/Sidebar';

interface LocationState {
  contentType?: ContentType;
}

const contentTypeLabels: Record<ContentType, string> = {
  checklists: 'Checklist',
  reports: 'Report',
  letters: 'Letter',
  notes: 'Note',
};

export default function CreationDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { contentType = 'checklists' } = (location.state as LocationState) || {};

  const label = contentTypeLabels[contentType] || 'Checklist';

  const handleGenerate = () => {
    navigate('/generate', { state: { contentType } });
  };

  const handleUpload = () => {
    // TODO: Implement upload flow
    navigate('/generate', { state: { contentType, mode: 'upload' } });
  };

  const handleFromTemplate = () => {
    // TODO: Implement template selection flow
    navigate('/generate', { state: { contentType, mode: 'template' } });
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#ECD4F6] to-[#CFE1FC] min-h-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Create with LUKA
          </h1>
          <p className="text-muted-foreground">
            Choose how you'd like to create your {label.toLowerCase()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {/* Generate Option */}
          <button
            onClick={handleGenerate}
            className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/50 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3379C9] to-[#8A5BD9] flex items-center justify-center mb-4 group-hover:rotate-[360deg] transition-transform duration-700">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Generate</h3>
            <p className="text-sm text-muted-foreground">
              Describe what you need and let AI create it for you
            </p>
          </button>

          {/* Upload Option */}
          <button
            onClick={handleUpload}
            className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/50 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3379C9] to-[#8A5BD9] flex items-center justify-center mb-4 group-hover:rotate-[360deg] transition-transform duration-700">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload or paste the URL to generate
            </p>
          </button>

          {/* From Template Option */}
          <button
            onClick={handleFromTemplate}
            className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/50 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3379C9] to-[#8A5BD9] flex items-center justify-center mb-4 group-hover:rotate-[360deg] transition-transform duration-700">
              <FileStack className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">From Template</h3>
            <p className="text-sm text-muted-foreground">
              Generate from existing templates
            </p>
          </button>
        </div>
      </div>
    </Layout>
  );
}
