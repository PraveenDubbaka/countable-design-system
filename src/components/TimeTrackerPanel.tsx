import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Eye } from 'lucide-react';
import { fmtElapsed, CURRENT_USER, type TimeEntry, useTimeEntries, type RoleKey } from '@/lib/useTimeEntries';

const BILLABLE_CATEGORIES = [
  'Client Onboarding', 'Documents', 'Trial Balance & Adj. Entries',
  'Procedures', 'Financial Statements', 'Completion & Signoffs',
  'Admin', 'Client meeting', 'Internal meeting', 'Miscellaneous',
];
const NON_BILLABLE_CATEGORIES = [
  'Admin', 'Client meeting', 'Internal meeting',
  'Business development', 'Education & learning', 'Miscellaneous',
];

// ── Add Manual Entry Modal ─────────────────────────────────────────────────

function AddManualEntryModal({
  open,
  onClose,
  engagementId,
  clientName,
  addEntry,
}: {
  open: boolean;
  onClose: () => void;
  engagementId: string;
  clientName: string;
  addEntry: (e: TimeEntry) => void;
}) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryType, setEntryType] = useState<'Billable' | 'Non Billable'>('Billable');
  const [category, setCategory] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');

  const categories = entryType === 'Billable' ? BILLABLE_CATEGORIES : NON_BILLABLE_CATEGORIES;

  function calcDuration() {
    if (!startTime || !endTime) return 0;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
  }

  function handleAdd() {
    const hrs = calcDuration();
    if (!category || hrs <= 0) return;
    addEntry({
      id: `manual-${Date.now()}`,
      date,
      roleKey: CURRENT_USER.roleKey as RoleKey,
      tbRowId: 'g4',
      tbSection: 'general',
      hours: hrs,
      description: notes || category,
      entryType,
      category,
    });
    onClose();
    setNotes(''); setCategory(''); setStartTime(''); setEndTime('');
  }

  const durationHrs = calcDuration();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Add Manual Time Entry</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Date *</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-8 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Entry Type *</label>
            <Select value={entryType} onValueChange={(v: 'Billable' | 'Non Billable') => { setEntryType(v); setCategory(''); }}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Billable">Billable</SelectItem>
                <SelectItem value="Non Billable">Non Billable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Team Member *</label>
            <Input value={CURRENT_USER.name} disabled className="h-8 text-sm bg-muted" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Client Name</label>
            <Input value={clientName} disabled className="h-8 text-sm bg-muted" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Engagement ID</label>
            <Input value={engagementId} disabled className="h-8 text-sm bg-muted" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Category *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Start Time *</label>
            <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="h-8 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">End Time *</label>
            <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="h-8 text-sm" />
          </div>
          {durationHrs > 0 && (
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Duration</label>
              <div className="h-8 px-3 flex items-center bg-muted rounded-md text-sm">
                {durationHrs.toFixed(2)}h ({Math.floor(durationHrs * 60)} min)
              </div>
            </div>
          )}
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes *</label>
            <Textarea
              placeholder="Add details…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="text-sm resize-none"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleAdd} disabled={!category || durationHrs <= 0}
            className="bg-[#1C63A6] hover:bg-[#1a5a9e] text-white">
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Time Tracker Window (entries list dialog) ──────────────────────────────

function TimeTrackerWindow({
  open,
  onClose,
  engagementId,
  clientName,
}: {
  open: boolean;
  onClose: () => void;
  engagementId: string;
  clientName: string;
}) {
  const { entries, removeEntry, addEntry } = useTimeEntries(engagementId);
  const [showAddModal, setShowAddModal] = useState(false);

  const grouped = entries.reduce<Record<string, TimeEntry[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  const dateLabel = (d: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (d === today) return 'Today';
    if (d === yesterday) return 'Yesterday';
    return new Date(d).toLocaleDateString('en-CA', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col p-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <h2 className="text-base font-semibold">Time Tracker</h2>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-xs"
              onClick={() => setShowAddModal(true)}>
              <Plus className="h-3.5 w-3.5" />
              Manual Time Entry
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            {sortedDates.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                Time has not yet been logged
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/80">
                  <tr>
                    {['Client Name', 'Engagement ID', 'Category', 'Type', 'Billable', 'Duration', 'Notes', 'Actions'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedDates.map(date => (
                    <>
                      <tr key={`group-${date}`} className="bg-amber-50/60">
                        <td colSpan={8} className="px-3 py-1.5">
                          <span className="text-xs font-semibold text-amber-800">
                            📅 {dateLabel(date)} ({grouped[date].length})
                          </span>
                        </td>
                      </tr>
                      {grouped[date].map(entry => (
                        <tr key={entry.id} className="border-b border-border hover:bg-muted/30">
                          <td className="px-3 py-2 text-xs">{clientName}</td>
                          <td className="px-3 py-2 text-xs text-primary">{engagementId}</td>
                          <td className="px-3 py-2 text-xs">{entry.category ?? entry.tbSection}</td>
                          <td className="px-3 py-2">
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded
                              ${entry.entryType === 'Non Billable'
                                ? 'bg-orange-100 text-orange-700'
                                : 'text-muted-foreground'}`}>
                              {entry.entryType === 'Non Billable' ? 'Idle' : 'Automatic'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs">
                            {entry.entryType !== 'Non Billable' ? 'Billable' : 'Non Billable'}
                          </td>
                          <td className="px-3 py-2 text-xs font-mono">{entry.hours.toFixed(2)}h</td>
                          <td className="px-3 py-2 text-xs text-muted-foreground max-w-[200px] truncate">
                            {entry.description}
                          </td>
                          <td className="px-3 py-2">
                            <button onClick={() => removeEntry(entry.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-5 py-2.5 border-t border-border bg-muted/30">
            <p className="text-[10px] text-muted-foreground">
              Note: All outstanding accumulated time will be automatically logged at 11:59 PM
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <AddManualEntryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        engagementId={engagementId}
        clientName={clientName}
        addEntry={addEntry}
      />
    </>
  );
}

// ── Main Panel ─────────────────────────────────────────────────────────────

export interface TimeTrackerPanelProps {
  open: boolean;
  onClose: () => void;
  engagementId: string;
  engagementLabel: string;
  clientName: string;
  activeSec: number;
  idleSec: number;
  onLogTime: () => void;
}

export function TimeTrackerPanel({
  open,
  onClose,
  engagementId,
  clientName,
  activeSec,
  idleSec,
  onLogTime,
}: TimeTrackerPanelProps) {
  const [showWindow, setShowWindow] = useState(false);
  const { entries } = useTimeEntries(engagementId);
  const totalHrs = entries.reduce((a, e) => a + e.hours, 0);

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="w-[420px] p-0 flex flex-col">
          <SheetHeader className="px-5 py-4 border-b border-border">
            <SheetTitle className="text-sm font-semibold">Active Time Tracking</SheetTitle>
            <p className="text-xs text-muted-foreground">{engagementId} · {clientName}</p>
          </SheetHeader>

          {/* Active engagement row */}
          <div className="px-5 py-4 border-b border-border">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 items-center text-xs">
              <span className="font-medium text-foreground">{clientName}</span>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-muted-foreground mb-0.5">ACTIVE TIME</span>
                <span className="font-mono font-semibold text-red-600 text-sm">{fmtElapsed(activeSec)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-muted-foreground mb-0.5">IDLE TIME</span>
                <span className="font-mono text-sm text-muted-foreground">{fmtElapsed(idleSec)}</span>
              </div>
              <Button size="sm" onClick={onLogTime}
                className="h-7 text-xs bg-[#1C63A6] hover:bg-[#1a5a9e] text-white">
                Log Time
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="px-5 py-3 border-b border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Total logged today</span>
              <span className="font-semibold">{totalHrs.toFixed(2)}h</span>
            </div>
          </div>

          {/* View Time Tracker button */}
          <div className="px-5 py-4">
            <Button variant="outline" className="w-full gap-2 text-sm h-9"
              onClick={() => setShowWindow(true)}>
              <Eye className="h-4 w-4" />
              View Time Tracker ({entries.length})
            </Button>
          </div>

          {/* Log All button */}
          <div className="px-5 mt-auto pb-5">
            <p className="text-[10px] text-muted-foreground mb-3 text-center">
              Note: All outstanding accumulated time will be automatically logged at 11:59 PM
            </p>
            <Button variant="outline" className="w-full text-sm h-9" onClick={onLogTime}>
              Log All
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <TimeTrackerWindow
        open={showWindow}
        onClose={() => setShowWindow(false)}
        engagementId={engagementId}
        clientName={clientName}
      />
    </>
  );
}
