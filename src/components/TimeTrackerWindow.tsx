import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Pencil, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useTimeEntries, CURRENT_USER,
  type RoleKey, type TimeEntry,
} from '@/lib/useTimeEntries';

const BILLABLE_CATS = [
  'Client Onboarding', 'Documents', 'Trial Balance & Adj. Entries',
  'Procedures', 'Financial Statements', 'Completion & Signoffs',
  'Admin', 'Client meeting', 'Internal meeting', 'Miscellaneous',
];
const NON_BILLABLE_CATS = [
  'Admin', 'Client meeting', 'Internal meeting',
  'Business development', 'Education & learning', 'Miscellaneous',
];

function groupLabel(d: string): string {
  const today = new Date().toISOString().split('T')[0];
  const yest  = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const twod  = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
  if (d === today) return 'Today';
  if (d === yest)  return 'Yesterday';
  if (d === twod)  return new Date(d).toLocaleDateString('en-CA', { weekday: 'long' });
  const diffDays = Math.round((new Date().getTime() - new Date(d).getTime()) / 86400000);
  if (diffDays <= 7) return 'Last Week';
  return 'Last Month';
}

// ── Add Manual Time Entry modal ────────────────────────────────────────────

type ExtendedEntry = TimeEntry & {
  entryType?: string;
  category?: string;
  startTime?: string;
  endTime?: string;
  billable?: boolean;
};

function AddManualModal({
  open, onClose, engagementId, clientName, addEntry,
}: {
  open: boolean; onClose: () => void;
  engagementId: string; clientName: string;
  addEntry: (e: TimeEntry) => void;
}) {
  const [date,     setDate]     = useState(new Date().toISOString().split('T')[0]);
  const [type,     setType]     = useState<'Billable' | 'Non Billable'>('Billable');
  const [category, setCategory] = useState('');
  const [start,    setStart]    = useState('');
  const [end,      setEnd]      = useState('');
  const [notes,    setNotes]    = useState('');

  const cats = type === 'Billable' ? BILLABLE_CATS : NON_BILLABLE_CATS;

  const durationHrs = (() => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
  })();

  const durStr = `${String(Math.floor(durationHrs)).padStart(2, '0')}h:`
    + `${String(Math.round((durationHrs % 1) * 60)).padStart(2, '0')}m:00s`;

  function handleAdd() {
    if (!category || durationHrs <= 0) return;
    const entry: ExtendedEntry = {
      id: `manual-${Date.now()}`,
      date,
      roleKey: CURRENT_USER.roleKey as RoleKey,
      tbRowId: 'g4',
      tbSection: 'general',
      hours: durationHrs,
      description: notes || category,
      userName: CURRENT_USER.name,
      entryType: 'Manual',
      category,
      startTime: start,
      endTime: end,
      billable: type === 'Billable',
    };
    addEntry(entry as TimeEntry);
    onClose();
    setNotes(''); setCategory(''); setStart(''); setEnd('');
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <h2 className="text-base font-semibold mb-4">Add Manual Time Entry</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Date *</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="h-8 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Entry Type *</label>
            <Select value={type} onValueChange={(v: 'Billable' | 'Non Billable') => { setType(v); setCategory(''); }}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Billable">Billable</SelectItem>
                <SelectItem value="Non Billable">Non Billable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Team Member *</label>
            <Input value={CURRENT_USER.name} disabled className="h-8 text-sm bg-muted" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Client Name</label>
            <Input value={clientName} disabled className="h-8 text-sm bg-muted" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Engagement ID</label>
            <Input value={engagementId} disabled className="h-8 text-sm bg-muted" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Category *</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>
                {cats.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Start Time *</label>
            <Input type="time" value={start} onChange={e => setStart(e.target.value)} className="h-8 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">End Time *</label>
            <Input type="time" value={end} onChange={e => setEnd(e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground block mb-1">Duration</label>
            <div className="h-8 px-3 flex items-center bg-muted rounded-md text-sm font-mono">{durStr}</div>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground block mb-1">Notes *</label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="text-sm resize-none" placeholder="Add details…" />
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

// ── Main window ────────────────────────────────────────────────────────────

export interface TimeTrackerWindowProps {
  open: boolean; onClose: () => void;
  engagementId: string; clientName: string;
  activeSec: number; idleSec: number;
  onLogTime: () => void;
}

export function TimeTrackerWindow({
  open, onClose, engagementId, clientName, onLogTime,
}: TimeTrackerWindowProps) {
  const { entries, removeEntry, addEntry } = useTimeEntries(engagementId);
  const [addModal,   setAddModal]   = useState(false);
  const [collapsed,  setCollapsed]  = useState<Set<string>>(new Set());
  const [selected,   setSelected]   = useState<Set<string>>(new Set());

  const grouped: Record<string, TimeEntry[]> = {};
  entries.forEach(e => {
    if (!grouped[e.date]) grouped[e.date] = [];
    grouped[e.date].push(e);
  });
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  function toggleCollapse(d: string) {
    setCollapsed(prev => { const n = new Set(prev); n.has(d) ? n.delete(d) : n.add(d); return n; });
  }
  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function entryTypeBadge(e: TimeEntry) {
    const ext = e as ExtendedEntry;
    if (ext.entryType === 'Idle') return <span className="text-[10px] font-medium bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Idle</span>;
    if (ext.entryType === 'Manual') return <span className="text-[10px] text-muted-foreground">Manual</span>;
    return <span className="text-[10px] text-muted-foreground">Automatic</span>;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[1100px] h-[85vh] flex flex-col p-0 gap-0">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
            <h2 className="text-base font-semibold">Time Tracker</h2>
            <div className="flex items-center gap-2">
              {selected.size > 0 && (
                <>
                  <Button size="sm" className="h-7 text-xs bg-[#1C63A6] text-white" onClick={onLogTime}>
                    Submit Time
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30"
                    onClick={() => { selected.forEach(id => removeEntry(id)); setSelected(new Set()); }}>
                    Delete
                  </Button>
                </>
              )}
              <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => setAddModal(true)}>
                <Plus className="h-3.5 w-3.5" />
                Manual Time Entry
              </Button>
            </div>
          </div>

          {/* Table header — exact XD columns */}
          <div className="shrink-0 border-b border-border bg-muted/30">
            <div className="grid gap-2 px-4 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
              style={{ gridTemplateColumns: '20px 1fr 1fr 1fr 90px 90px 80px 80px 90px 70px' }}>
              <Checkbox
                checked={selected.size === entries.length && entries.length > 0}
                onCheckedChange={v => setSelected(v ? new Set(entries.map(e => e.id)) : new Set())}
                className="h-3.5 w-3.5"
              />
              <span>CLIENT NAME</span>
              <span>ENGAGEMENT ID</span>
              <span>CATEGORY</span>
              <span>TYPE</span>
              <span>BILLABLE</span>
              <span>START TIME</span>
              <span>END TIME</span>
              <span>DURATION (HRS)</span>
              <span>ACTIONS</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto">
            {entries.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
                Time has not yet been logged
              </div>
            ) : (
              sortedDates.map(date => {
                const isCollapsed = collapsed.has(date);
                const rows = grouped[date];
                return (
                  <div key={date}>
                    <button
                      onClick={() => toggleCollapse(date)}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-100 hover:bg-amber-100/80 transition-colors"
                    >
                      <Checkbox className="h-3.5 w-3.5 pointer-events-none" />
                      <span className="text-xs font-semibold text-amber-800">
                        {groupLabel(date)} ({rows.length})
                      </span>
                      {isCollapsed
                        ? <ChevronDown className="h-3.5 w-3.5 text-amber-600 ml-auto" />
                        : <ChevronUp   className="h-3.5 w-3.5 text-amber-600 ml-auto" />
                      }
                    </button>

                    {!isCollapsed && rows.map(entry => {
                      const ext = entry as ExtendedEntry;
                      const billable = ext.billable !== false;
                      return (
                        <div
                          key={entry.id}
                          className={cn(
                            'grid gap-2 px-4 py-2.5 border-b border-border text-xs items-center hover:bg-muted/20',
                            selected.has(entry.id) && 'bg-blue-50/50'
                          )}
                          style={{ gridTemplateColumns: '20px 1fr 1fr 1fr 90px 90px 80px 80px 90px 70px' }}
                        >
                          <Checkbox
                            checked={selected.has(entry.id)}
                            onCheckedChange={() => toggleSelect(entry.id)}
                            className="h-3.5 w-3.5"
                          />
                          <span className="font-medium truncate">{clientName}</span>
                          <span className="text-primary truncate">{engagementId}</span>
                          <span className="truncate">{ext.category ?? entry.tbSection}</span>
                          <span>{entryTypeBadge(entry)}</span>
                          <span>{billable ? 'Billable' : 'Non Billable'}</span>
                          <span className="font-mono">{ext.startTime ?? '—'}</span>
                          <span className="font-mono">{ext.endTime ?? '—'}</span>
                          <span className="font-mono">{entry.hours.toFixed(2)}h</span>
                          <div className="flex items-center gap-2">
                            <button className="text-muted-foreground hover:text-foreground">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => removeEntry(entry.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-5 py-2.5 border-t border-border bg-muted/20 shrink-0">
            <p className="text-[10px] text-muted-foreground">
              Note*: All outstanding accumulated time will be automatically logged into the time-tracker at 11:59 PM
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <AddManualModal
        open={addModal}
        onClose={() => setAddModal(false)}
        engagementId={engagementId}
        clientName={clientName}
        addEntry={addEntry}
      />
    </>
  );
}
