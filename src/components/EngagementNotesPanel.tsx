import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, StickyNote, Trash2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoteEditor, createEmptyNote } from './NoteEditor';
import type { Note } from './NoteEditor';
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from '@/lib/safeJson';

function storageKey(engagementId: string) {
  return `engagement-notes-${engagementId}`;
}

function formatRelative(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch { return ''; }
}

interface EngagementNotesPanelProps {
  linkedSection?: string;
  onLinkedSectionClear?: () => void;
}

export function EngagementNotesPanel({ linkedSection, onLinkedSectionClear }: EngagementNotesPanelProps) {
  const { engagementId } = useParams<{ engagementId: string }>();
  const eid = engagementId ?? '';

  const [notes, setNotes] = useState<Note[]>(() =>
    readJsonFromLocalStorage<Note[]>(storageKey(eid), []),
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback((updated: Note[]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      writeJsonToLocalStorage(storageKey(eid), updated);
    }, 400);
  }, [eid]);

  useEffect(() => {
    if (!linkedSection) return;
    const n = createEmptyNote(linkedSection);
    const next = [...notes, n];
    setNotes(next);
    setOpenId(n.id);
    persist(next);
    onLinkedSectionClear?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedSection]);

  const addNote = () => {
    const n = createEmptyNote();
    const next = [...notes, n];
    setNotes(next);
    setOpenId(n.id);
    persist(next);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = notes.filter(n => n.id !== id);
    setNotes(next);
    persist(next);
    if (openId === id) setOpenId(next[next.length - 1]?.id ?? null);
  };

  const updateNote = (updated: Note) => {
    const next = notes.map(n => n.id === updated.id ? updated : n);
    setNotes(next);
    persist(next);
  };

  const updateTitle = (id: string, title: string) => {
    const next = notes.map(n => n.id === id ? { ...n, title, modifiedAt: new Date().toISOString() } : n);
    setNotes(next);
    persist(next);
  };

  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <h3 className="text-sm font-semibold text-foreground flex-1">Notes</h3>
        <button
          onClick={addNote}
          title="New note"
          className="p-1 rounded-md hover:bg-muted transition-colors"
        >
          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Accordion list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
            <StickyNote className="h-7 w-7 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground leading-snug">No notes yet.<br />Click + to create one.</p>
            <button
              onClick={addNote}
              className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3 w-3" /> New Note
            </button>
          </div>
        ) : (
          notes.map(note => {
            const isOpen = openId === note.id;
            return (
              <div key={note.id}>
                {/* Accordion header row */}
                <div
                  className="group flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggle(note.id)}
                >
                  <ChevronRight
                    className={cn(
                      'h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-150',
                      isOpen && 'rotate-90',
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-xs font-medium truncate leading-snug',
                      isOpen ? 'text-primary' : 'text-foreground',
                    )}>
                      {note.title || 'Untitled'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {note.createdBy && (
                        <span
                          className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white shrink-0"
                          style={{ backgroundColor: note.createdBy.color, fontSize: '8px', fontWeight: 700 }}
                          title={note.createdBy.name}
                        >
                          {note.createdBy.initials}
                        </span>
                      )}
                      <p className="text-[10px] text-muted-foreground truncate">
                        {note.linkedSection ? `${note.linkedSection} · ` : ''}{formatRelative(note.modifiedAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={e => deleteNote(note.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 transition-all shrink-0"
                    title="Delete note"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </div>

                {/* Expanded editor */}
                {isOpen && (
                  <div className="border-t border-border/50 bg-muted/20">
                    {/* Editable title */}
                    <div className="px-4 pt-2.5 pb-1">
                      <input
                        value={note.title}
                        onChange={e => updateTitle(note.id, e.target.value)}
                        placeholder="Untitled"
                        onClick={e => e.stopPropagation()}
                        className="w-full bg-transparent text-xs font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
                      />
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {note.createdBy && (
                          <div className="flex items-center gap-1">
                            <span
                              className="inline-flex items-center justify-center w-4 h-4 rounded-full text-white shrink-0"
                              style={{ backgroundColor: note.createdBy.color, fontSize: '8px', fontWeight: 700 }}
                            >
                              {note.createdBy.initials}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{note.createdBy.name}</span>
                          </div>
                        )}
                        {note.linkedSection && (
                          <span className="text-[10px] text-muted-foreground">· ↗ {note.linkedSection}</span>
                        )}
                      </div>
                    </div>
                    <NoteEditor note={note} onChange={updateNote} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
