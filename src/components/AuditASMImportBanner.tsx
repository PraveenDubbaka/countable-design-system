import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, X, Check, ChevronRight, Users, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Checklist } from '@/types/checklist';

interface AuditASMImportBannerProps {
  checklist: Checklist | null;
  onUpdate: (updated: Checklist) => void;
  isUS?: boolean;
}

const CA_IMPORT_DATA = {
  engagementName: 'Shipping Line Inc. — Mar 31, 2024',
  meetingDate: 'April 14, 2024',
  meetingTime: '9:00 AM',
  attendeeCount: 6,
  fields: {
    'asm-q2-2': 'Planning meeting held April 14, 2024 at 9:00 AM. Attendees: J. Williams (Partner), S. Chen (Manager), A. Kumar (Senior), T. Nguyen (Staff), R. Patel (CFO — Shipping Line Inc.), M. Singh (Controller — Shipping Line Inc.). Discussed key audit areas, risk factors, and engagement timeline.',
    'asm-q4-1': 'J. Williams, CPA — Engagement Partner. 18 years experience.',
    'asm-q4-2': 'S. Chen, CPA — Engagement Manager. 9 years experience.',
    'asm-q4-3': 'A. Kumar — Senior Associate. 4 years experience.',
    'asm-q4-4': 'T. Nguyen — Staff Associate. 1 year experience.',
    'asm-q3-2': 'Two new freight contracts commenced Q3 2024. USD revenue exposure increased (~35% of revenue). New crew management software implemented Q2 2024.',
  },
};

const US_IMPORT_DATA = {
  engagementName: 'Harbor Freight Logistics LLC — Dec 31, 2024',
  meetingDate: 'January 15, 2025',
  meetingTime: '10:00 AM',
  attendeeCount: 6,
  fields: {
    'us-asm-q2-2': 'Planning meeting held January 15, 2025 at 10:00 AM. Attendees: M. Thompson (Partner), L. Garcia (Manager), Senior 1 (Revenue/AR), Senior 2 (Expenses/ASC 842), J. Reyes (CFO — Harbor Freight Logistics LLC), K. Park (Controller — Harbor Freight Logistics LLC). Discussed key audit areas, ASC 842 adoption, risk factors, and engagement timeline.',
    'us-asm-q4-1': 'M. Thompson, CPA — Engagement Partner. 20 years experience.',
    'us-asm-q4-2': 'L. Garcia, CPA — Engagement Manager. 10 years experience.',
    'us-asm-q4-3': 'Senior 1 (Revenue/AR) and Senior 2 (Expenses/ASC 842). 3+ years experience each.',
    'us-asm-q4-4': 'Staff 1 (AP/Cash) and Staff 2 (Fixed assets/Other).',
    'us-asm-q3-2': 'ASC 842 adopted for new finance leases Q1 2024. LoadMaster Pro billing system upgraded Q2 2024. Expansion to 3 additional states (10 to 12 states) Q3 2024.',
  },
};

type Step = 1 | 2 | 3 | 4;

export function AuditASMImportBanner({ checklist, onUpdate, isUS = false }: AuditASMImportBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('Reading transcript...');
  const [imported, setImported] = useState(false);
  const [importedDate, setImportedDate] = useState<string>('');

  const data = isUS ? US_IMPORT_DATA : CA_IMPORT_DATA;

  const openModal = () => {
    setStep(1);
    setProgress(0);
    setProgressLabel('Reading transcript...');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Step 1: auto advance after 1.5s
  useEffect(() => {
    if (!isModalOpen || step !== 1) return;
    const t = setTimeout(() => setStep(2), 1500);
    return () => clearTimeout(t);
  }, [isModalOpen, step]);

  // Step 2: animate progress bar over 2.5s then advance
  useEffect(() => {
    if (!isModalOpen || step !== 2) return;

    const labels = [
      { at: 0, label: 'Reading transcript...' },
      { at: 40, label: 'Extracting attendees...' },
      { at: 75, label: 'Identifying key points...' },
    ];

    let start: number | null = null;
    const duration = 2500;
    let raf: number;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(Math.round(pct));

      for (let i = labels.length - 1; i >= 0; i--) {
        if (pct >= labels[i].at) {
          setProgressLabel(labels[i].label);
          break;
        }
      }

      if (pct < 100) {
        raf = requestAnimationFrame(animate);
      } else {
        setStep(3);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isModalOpen, step]);

  const handleConfirmImport = () => {
    if (!checklist) return;

    const updatedSections = checklist.sections.map(section => ({
      ...section,
      questions: section.questions.map(question => {
        const newExplanation = data.fields[question.id as keyof typeof data.fields];
        if (newExplanation !== undefined) {
          return {
            ...question,
            answer: 'Yes',
            explanation: newExplanation,
          };
        }
        return question;
      }),
    }));

    onUpdate({ ...checklist, sections: updatedSections, updatedAt: new Date() });

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
    setImportedDate(dateStr);
    setImported(true);
    setIsModalOpen(false);
    toast.success('Meeting notes imported. Review the pre-populated fields before saving.');
  };

  const fieldLabels: Record<string, string> = isUS ? {
    'us-asm-q2-2': '2.2 Team planning discussions',
    'us-asm-q4-1': '4.1 Partner',
    'us-asm-q4-2': '4.2 Manager',
    'us-asm-q4-3': '4.3 Senior',
    'us-asm-q4-4': '4.4 Assistant',
    'us-asm-q3-2': '3.2 Key changes',
  } : {
    'asm-q2-2': '2.2 Team planning discussions',
    'asm-q4-1': '4.1 Partner',
    'asm-q4-2': '4.2 Manager',
    'asm-q4-3': '4.3 Senior',
    'asm-q4-4': '4.4 Assistant',
    'asm-q3-2': '3.2 Key changes',
  };

  return (
    <>
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1C63A6]/5 to-[#7A31D8]/5 border border-[#1C63A6]/20 rounded-lg px-4 py-3 flex items-center gap-3 mb-4">
        <Sparkles className="h-4 w-4 text-[#1C63A6] flex-shrink-0" />
        <span className="text-sm text-foreground flex-1">
          AI can import your Team Planning Discussion meeting notes
        </span>
        {imported ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
            <Check className="h-3 w-3" />
            Imported from meeting — {importedDate}
          </div>
        ) : (
          <button
            onClick={openModal}
            className="bg-gradient-to-r from-[#1C63A6] to-[#7A31D8] text-white text-xs font-medium px-3 py-1.5 rounded-full gap-1.5 flex items-center hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-3 w-3" />
            Import Meeting Notes
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="bg-white dark:bg-card rounded-2xl shadow-2xl w-[520px] max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1C63A6] to-[#7A31D8] flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">Luka AI — Meeting Import</span>
              </div>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step 1: Connecting */}
            {step === 1 && (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-12">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[#1C63A6] animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Connecting to Google Calendar...</p>
                  <p className="text-xs text-muted-foreground mt-1">Retrieving meetings for this engagement...</p>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <span className="w-2 h-2 rounded-full bg-[#1C63A6] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#1C63A6] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#1C63A6] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* Step 2: Analyzing */}
            {step === 2 && (
              <div className="flex flex-col items-center justify-center gap-5 px-6 py-12">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1C63A6]/10 to-[#7A31D8]/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-[#7A31D8] animate-spin" style={{ animationDuration: '2s' }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Luka AI is analyzing your meeting notes...</p>
                  <p className="text-xs text-muted-foreground mt-1.5">{progressLabel}</p>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1C63A6] to-[#7A31D8] rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{progress}%</p>
              </div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
              <div className="flex flex-col overflow-hidden">
                <div className="px-6 pt-5 pb-4">
                  <h3 className="text-sm font-semibold text-foreground">Meeting notes found</h3>
                  {/* Meeting card */}
                  <div className="mt-3 border border-border rounded-xl p-4 bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-4 w-4 text-[#1C63A6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">Team Planning Discussion — {data.engagementName}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{data.meetingDate} at {data.meetingTime}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{data.attendeeCount} attendees</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Summary chips */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      `${data.attendeeCount} attendees identified`,
                      'Partner & Manager roles assigned',
                      'Fieldwork dates documented',
                      '3 key changes noted',
                      '5 risk areas discussed',
                      'Planned procedures listed',
                    ].map((label) => (
                      <div key={label} className="flex items-center gap-2 text-xs text-foreground">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="h-2.5 w-2.5 text-emerald-600" />
                        </span>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 px-6 py-4 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1" onClick={closeModal}>Cancel</Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-[#1C63A6] to-[#7A31D8] text-white hover:opacity-90"
                    onClick={() => setStep(4)}
                  >
                    Review Draft <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Review Draft */}
            {step === 4 && (
              <div className="flex flex-col overflow-hidden">
                <div className="px-6 pt-5 pb-2">
                  <h3 className="text-sm font-semibold text-foreground">Review draft import</h3>
                  <p className="text-xs text-muted-foreground mt-1">The following fields will be pre-populated. Review before confirming.</p>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-3 mt-3">
                  {Object.entries(data.fields).map(([id, value]) => (
                    <div key={id} className="rounded-xl border border-border bg-muted/20 p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">{fieldLabels[id] ?? id}</span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 px-6 py-4 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleConfirmImport}
                  >
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Confirm &amp; Import
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
