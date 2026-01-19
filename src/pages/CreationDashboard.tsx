import { useLocation, useNavigate } from 'react-router-dom';
import { Upload, FileStack } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ContentType } from '@/components/Sidebar';
import lukaAiIcon from '@/assets/luka-ai-icon.png';

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
              <svg width="32" height="35" viewBox="0 0 106 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M67.6005 46.5271H94.1202C96.3035 46.6961 102.854 47.4569 104.558 50.7532C105.836 53.2044 104.451 56.5431 101.203 59.2055C78.9965 77.5048 56.8436 95.8463 34.6374 114.145C32.7203 114.653 31.4955 114.653 30.963 114.145C29.8979 113.173 31.389 110.384 35.5427 105.693C51.5184 90.1832 67.494 74.7155 83.4697 59.2055L37.9923 46.5271H67.5473H67.6005Z" fill="#FEFEFE"/>
                <path d="M37.4557 67.9987H10.917C8.73214 67.8297 2.17742 67.069 0.472123 63.7726C-0.806847 61.3214 0.578704 57.9828 3.82942 55.3203C25.9982 36.9788 48.2203 18.6796 70.3892 0.380353C72.3076 -0.126784 73.5333 -0.126784 74.0662 0.380353C75.132 1.35237 73.6399 4.14163 69.4832 8.83265C53.4961 24.3426 37.509 39.8103 21.5218 55.3203L67.0319 67.9987H37.4557Z" fill="#FEFEFE"/>
              </svg>
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
