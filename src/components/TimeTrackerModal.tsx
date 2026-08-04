import { useState, Fragment } from 'react';
import { X, Minus, Maximize2, Plus, Pencil, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  loadTrackerEntries,
  saveTrackerEntries,
  BILLABLE_CATEGORIES,
  NON_BILLABLE_CATEGORIES,
  DEMO_CLIENTS,
  calcDuration,
  fmtTime12,
  type TrackerEntry,
} from '@/lib/trackerEntries';

const CURRENT_USER = { name: 'Praveen D.', role: 'Manager' };

// ── Entry form (Add / Edit) ────────────────────────────────────────────────

interface EntryFormProps {
  initial?: TrackerEntry;
  onClose: () => void;
  onSave: (entry: TrackerEntry) => void;
}

function EntryForm({ initial, onClose, onSave }: EntryFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const isEdit = !!initial;

  function parseTime24(t: string) {
    if (!t) return { h: '', m: '', ap: 'AM' as 'AM' | 'PM' };
    const [hStr, mStr] = t.split(':');
    const hNum = parseInt(hStr) || 0;
    return {
      h: (hNum % 12 || 12).toString().padStart(2, '0'),
      m: mStr ?? '00',
      ap: (hNum >= 12 ? 'PM' : 'AM') as 'AM' | 'PM',
    };
  }

  const ps = parseTime24(initial?.startTime ?? '');
  const pe = parseTime24(initial?.endTime ?? '');

  const [date, setDate] = useState(initial?.date ?? today);
  const [entryType, setEntryType] = useState<'Billable' | 'Non Billable'>(
    initial ? (initial.billable ? 'Billable' : 'Non Billable') : 'Billable'
  );
  const [clientName, setClientName] = useState(initial?.clientName ?? '');
  const [engId, setEngId] = useState(initial?.engagementId ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [sH, setSH] = useState(ps.h);
  const [sM, setSM] = useState(ps.m);
  const [sAp, setSAp] = useState<'AM' | 'PM'>(ps.ap);
  const [eH, setEH] = useState(pe.h);
  const [eM, setEM] = useState(pe.m);
  const [eAp, setEAp] = useState<'AM' | 'PM'>(pe.ap);
  const [notes, setNotes] = useState(initial?.notes ?? '');

  // Edit mode: duration fields derived from existing times
  const existingDur = isEdit && initial ? calcDuration(initial.startTime, initial.endTime) : '00h:00m:00s';
  const [durH, setDurH] = useState(existingDur.split('h:')[0] ?? '00');
  const [durM, setDurM] = useState(existingDur.split('h:')[1]?.split('m:')[0] ?? '00');

  const cats = entryType === 'Billable' ? BILLABLE_CATEGORIES : NON_BILLABLE_CATEGORIES;
  const clientList = Object.keys(DEMO_CLIENTS);
  const engList = clientName ? (DEMO_CLIENTS[clientName] ?? []) : [];

  function to24(h: string, m: string, ap: 'AM' | 'PM'): string {
    let n = parseInt(h) || 0;
    if (ap === 'PM' && n !== 12) n += 12;
    if (ap === 'AM' && n === 12) n = 0;
    return `${n.toString().padStart(2, '0')}:${(m || '00').padStart(2, '0')}`;
  }

  const start24 = to24(sH, sM, sAp);
  const end24 = to24(eH, eM, eAp);
  const duration = sH && eH ? calcDuration(start24, end24) : '00h:00m:00s';

  function handleSave() {
    let startTime = isEdit ? (initial?.startTime ?? start24) : start24;
    let endTime = isEdit ? (initial?.endTime ?? end24) : end24;

    if (isEdit && initial) {
      // Rebuild end time from existing start + edited duration
      const [sh, sm] = initial.startTime.split(':').map(Number);
      const totalMin = parseInt(durH) * 60 + parseInt(durM);
      const endMin = sh * 60 + sm + totalMin;
      endTime = `${Math.floor(endMin / 60 % 24).toString().padStart(2, '0')}:${(endMin % 60).toString().padStart(2, '0')}`;
    }

    onSave({
      id: initial?.id ?? `tm-${Date.now()}`,
      date,
      clientName,
      engagementId: engId,
      category,
      type: isEdit ? (initial?.type ?? 'Manual') : 'Manual',
      billable: entryType === 'Billable',
      startTime,
      endTime,
      notes,
      isIdle: isEdit ? initial?.isIdle : undefined,
    });
  }

  const fieldCls = "border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-blue-500";
  const labelCls = "text-xs font-medium text-gray-600 mb-1 block";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-[580px] max-w-[95vw] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Automatic Time Entry' : 'Add Manual Time Entry'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className={labelCls}>Date <span className="text-red-500">*</span></label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className={fieldCls} />
            </div>

            {/* Entry Type */}
            <div>
              <label className={labelCls}>Entry Type <span className="text-red-500">*</span></label>
              <select value={entryType} onChange={e => { setEntryType(e.target.value as 'Billable' | 'Non Billable'); setCategory(''); }} className={fieldCls}>
                <option value="Billable">Billable</option>
                <option value="Non Billable">Non Billable</option>
              </select>
            </div>

            {/* Team Member */}
            <div>
              <label className={labelCls}>Team Member <span className="text-red-500">*</span></label>
              <input type="text" value={`${CURRENT_USER.name} (${CURRENT_USER.role})`} disabled
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed w-full" />
            </div>

            {/* Client Name */}
            <div>
              <label className={labelCls}>Client Name</label>
              <select value={clientName} onChange={e => { setClientName(e.target.value); setEngId(''); }} className={fieldCls}>
                <option value="">Select</option>
                {clientList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Engagement ID */}
            <div>
              <label className={labelCls}>Engagement ID</label>
              <select value={engId} onChange={e => setEngId(e.target.value)}
                disabled={!clientName || isEdit}
                className={`${fieldCls} disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`}>
                <option value="">Select</option>
                {engList.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className={labelCls}>Category <span className="text-red-500">*</span></label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={fieldCls}>
                <option value="">Select</option>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Start + End (Add) or Duration (Edit) */}
            {isEdit ? (
              <div className="col-span-2">
                <label className={labelCls}>Duration <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-2">
                  <input type="text" value={durH} maxLength={2} placeholder="00"
                    onChange={e => setDurH(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-sm text-gray-500">h :</span>
                  <input type="text" value={durM} maxLength={2} placeholder="05"
                    onChange={e => setDurM(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    className="w-14 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <span className="text-sm text-gray-500">m : 00 s</span>
                </div>
              </div>
            ) : (
              <>
                {/* Start Time */}
                <div>
                  <label className={labelCls}>Start Time <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-1">
                    <input type="text" value={sH} maxLength={2} placeholder="hh"
                      onChange={e => setSH(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      className="w-12 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <span className="text-gray-400 text-sm">:</span>
                    <input type="text" value={sM} maxLength={2} placeholder="mm"
                      onChange={e => setSM(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      className="w-12 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <select value={sAp} onChange={e => setSAp(e.target.value as 'AM' | 'PM')}
                      className="border border-gray-300 rounded-lg px-2 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>AM</option><option>PM</option>
                    </select>
                  </div>
                </div>

                {/* End Time */}
                <div>
                  <label className={labelCls}>End Time <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-1">
                    <input type="text" value={eH} maxLength={2} placeholder="hh"
                      onChange={e => setEH(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      className="w-12 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <span className="text-gray-400 text-sm">:</span>
                    <input type="text" value={eM} maxLength={2} placeholder="mm"
                      onChange={e => setEM(e.target.value.replace(/\D/g, '').slice(0, 2))}
                      className="w-12 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    <select value={eAp} onChange={e => setEAp(e.target.value as 'AM' | 'PM')}
                      className="border border-gray-300 rounded-lg px-2 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>AM</option><option>PM</option>
                    </select>
                  </div>
                </div>

                {/* Duration display */}
                <div className="col-span-2">
                  <label className={labelCls}>Duration</label>
                  <p className="text-sm font-semibold text-gray-900 font-mono">{duration}</p>
                </div>
              </>
            )}

            {/* Notes */}
            <div className="col-span-2">
              <label className={labelCls}>Notes <span className="text-red-500">*</span></label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add details"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none bg-white text-gray-900 w-full focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="min-w-[90px]">Cancel</Button>
          <Button onClick={handleSave} className="min-w-[90px] text-white" style={{ background: '#1C63A6' }}>
            {isEdit ? 'Update' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main floating window ───────────────────────────────────────────────────

export function TimeTrackerModal({ onClose }: { onClose: () => void }) {
  const [entries, setEntries] = useState<TrackerEntry[]>(() => loadTrackerEntries());
  const [minimized, setMinimized] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editEntry, setEditEntry] = useState<TrackerEntry | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [successMsg, setSuccessMsg] = useState(false);

  const grouped = entries.reduce<Record<string, TrackerEntry[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});
  const dateGroups = Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));

  function dateLabel(d: string, count: number) {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (d === today) return `Today (${count})`;
    if (d === yesterday) return `Yesterday (${count})`;
    const parts = new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' });
    return `${parts} (${count})`;
  }

  function handleSave(entry: TrackerEntry) {
    const current = loadTrackerEntries();
    const idx = current.findIndex(e => e.id === entry.id);
    const next = idx >= 0
      ? current.map((e, i) => i === idx ? entry : e)
      : [entry, ...current];
    saveTrackerEntries(next);
    setEntries(next);
    setShowAdd(false);
    setEditEntry(null);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  }

  function handleDelete(id: string) {
    const next = entries.filter(e => e.id !== id);
    saveTrackerEntries(next);
    setEntries(next);
  }

  function toggleCollapse(d: string) {
    setCollapsed(prev => {
      const n = new Set(prev);
      n.has(d) ? n.delete(d) : n.add(d);
      return n;
    });
  }

  const COLS = ['CLIENT NAME', 'ENGAGEMENT ID', 'CATEGORY', 'TYPE', 'BILLABLE', 'START TIME', 'END TIME', 'DURATION', 'NOTES', 'ACTIONS'];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[149] bg-black/40" />

      {/* Window */}
      <div
        className="fixed inset-x-4 top-14 z-[150] mx-auto max-w-[1100px] rounded-xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: 'calc(100vh - 72px)' }}
      >
        {/* Window chrome — Countable dark blue */}
        <div className="flex items-center px-4 py-2.5 shrink-0" style={{ background: '#0C2D55' }}>
          <div className="flex items-center gap-2 flex-1">
            <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
              <circle cx="13" cy="13" r="13" fill="rgba(255,255,255,0.18)" />
              <text x="13" y="18.5" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="sans-serif">C</text>
            </svg>
            <span className="text-white text-sm font-semibold tracking-wide">Countable</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setMinimized(v => !v)}
              className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Minimize">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Maximize">
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button onClick={onClose}
              className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Close">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="flex flex-col flex-1 overflow-hidden bg-white">
            {/* Sub-header */}
            <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-200 shrink-0">
              <h1 className="text-lg font-bold text-gray-900 flex-1">Time Tracker</h1>
              {successMsg && (
                <div className="flex items-center gap-2 bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg animate-in fade-in duration-200 shrink-0">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  The activity has been added to your time tracker
                </div>
              )}
            </div>

            {/* Actions bar */}
            <div className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-200 shrink-0">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm border-dashed" onClick={() => setShowAdd(true)}>
                <Plus className="h-4 w-4" />
                Manual Time Entry
              </Button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs border-collapse" style={{ minWidth: '960px' }}>
                <thead>
                  <tr className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
                    <th className="w-9 px-3 py-2.5">
                      <input type="checkbox" className="h-3.5 w-3.5 rounded cursor-pointer" />
                    </th>
                    {COLS.map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap text-[11px]">
                        {h}
                        {['CLIENT NAME', 'ENGAGEMENT ID', 'CATEGORY', 'TYPE', 'BILLABLE'].includes(h) && (
                          <span className="ml-1 opacity-40">⇅</span>
                        )}
                        {h === 'ACTIONS' && <span className="ml-1 opacity-40">↕</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-20 text-gray-400 text-sm">
                        Time has not yet been logged
                      </td>
                    </tr>
                  ) : (
                    dateGroups.map(([date, grp]) => (
                      <Fragment key={date}>
                        {/* Group header */}
                        <tr className="bg-gray-50/80">
                          <td colSpan={11} className="px-4 py-2">
                            <button onClick={() => toggleCollapse(date)}
                              className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900">
                              <span className="text-sm">📅</span>
                              {dateLabel(date, grp.length)}
                              {collapsed.has(date)
                                ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                                : <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
                              }
                            </button>
                          </td>
                        </tr>

                        {/* Entry rows */}
                        {!collapsed.has(date) && grp.map(entry => (
                          <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                            <td className="px-3 py-2.5 w-9">
                              <input type="checkbox" className="h-3.5 w-3.5 rounded cursor-pointer" />
                            </td>
                            <td className="px-3 py-2.5 text-sm text-gray-900 whitespace-nowrap">{entry.clientName}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <span className="font-mono text-[11px] text-gray-500">{entry.engagementId}</span>
                            </td>
                            <td className="px-3 py-2.5 text-sm text-gray-700 whitespace-nowrap">{entry.category}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm text-gray-700">{entry.type}</span>
                                {entry.isIdle && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-500 text-white">Idle</span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              {entry.billable
                                ? <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">Billable</span>
                                : <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">Non Billable</span>
                              }
                            </td>
                            <td className="px-3 py-2.5 text-sm text-gray-700 whitespace-nowrap">{fmtTime12(entry.startTime)}</td>
                            <td className="px-3 py-2.5 text-sm text-gray-700 whitespace-nowrap">{fmtTime12(entry.endTime)}</td>
                            <td className="px-3 py-2.5 whitespace-nowrap">
                              <span className="font-mono text-xs text-gray-700">{calcDuration(entry.startTime, entry.endTime)}</span>
                            </td>
                            <td className="px-3 py-2.5 max-w-[200px]">
                              <span className="text-sm text-gray-600 truncate block">{entry.notes || '—'}</span>
                            </td>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-2">
                                <button onClick={() => setEditEntry(entry)}
                                  className="text-gray-400 hover:text-gray-700 transition-colors" title="Edit">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => handleDelete(entry.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <button className="text-gray-400 hover:text-green-600 transition-colors" title="Approve">
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAdd && <EntryForm onClose={() => setShowAdd(false)} onSave={handleSave} />}
      {editEntry && <EntryForm initial={editEntry} onClose={() => setEditEntry(null)} onSave={handleSave} />}
    </>
  );
}
