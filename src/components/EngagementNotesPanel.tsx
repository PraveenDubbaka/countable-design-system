import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, StickyNote, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoteEditor, createEmptyNote } from './NoteEditor';
import type { Note } from './NoteEditor';
import { readJsonFromLocalStorage, writeJsonToLocalStorage } from '@/lib/safeJson';

function storageKey(engagementId: string) {
  return `engagement-notes-${engagementId}`;
}

function formatRelative(iso: string) {
  try {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback((updated: Note[]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      writeJsonToLocalStorage(storageKey(eid), updated);
    }, 400);
  }, [eid]);

  useEffect(() => {
    if (linkedSection && notes.length === 0) {
      const n = createEmptyNote(linkedSection);
      setNotes([n]);
      setActiveId(n.id);
      persist([n]);
      onLinkedSectionClear?.();
    } else if (linkedSection) {
      const n = createEmptyNote(linkedSection);
      const next = [...notes, n];
      setNotes(next);
      setActiveId(n.id);
      persist(next);
      onLinkedSectionClear?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedSection]);

  useEffect(() => {
    if (notes.length > 0 && !activeId) {
      setActiveId(notes[0].id);
    }
  }, [notes, activeId]);

  const addNote = () => {
    const n = createEmptyNote();
    const next = [...notes, n];
    setNotes(next);
    setActiveId(n.id);
    persist(next);
  };

  const deleteNote = (id: string) => {
    const next = notes.filter(n => n.id !== id);
    setNotes(next);
    persist(next);
    if (activeId === id) {
      setActiveId(next[next.length - 1]?.id ?? null);
    }
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

  const activeNote = notes.find(n => n.id === activeId) ?? null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Note list */}
      <div className="w-40 shrink-0 flex flex-col border-r border-border overflow-hidden">
        <div className="flex items-center gap-1 px-3 py-2.5 border-b border-border">
          <span className="text-xs font-semibold text-foreground flex-1">Notes</span>
          <button
            onClick={addNote}
            title="New note"
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 px-3 text-center">
              <StickyNote className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-[11px] text-muted-foreground leading-snug">No notes yet. Click + to create one.</p>
            </div>
          ) : (
            notes.map(note => (
              <button
                key={note.id}
                onClick={() => setActiveId(note.id)}
                className={cn(
                  'w-full text-left px-3 py-2 group flex flex-col gap-0.5 transition-colors',
                  activeId === note.id ? 'bg-primary/10' : 'hover:bg-muted',
                )}
              >
                <div className="flex items-center gap-1">
                  <span className={cn(
                    'flex-1 text-[11px] font-medium truncate',
                    activeId === note.id ? 'text-primary' : 'text-foreground',
                  )}>
                    {note.title || 'Untitled'}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 transition-all"
                    title="Delete note"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </div>
                <span className="text-[10px] text-muted-foreground truncate">
                  {note.linkedSection ? `${note.linkedSection} · ` : ''}{formatRelative(note.modifiedAt)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeNote ? (
          <>
            <div className="px-4 py-2.5 border-b border-border shrink-0">
              <input
                value={activeNote.title}
                onChange={e => updateTitle(activeNote.id, e.target.value)}
                placeholder="Untitled"
                className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/50"
              />
              {activeNote.linkedSection && (
                <p className="text-[10px] text-muted-foreground mt-0.5">Linked: {activeNote.linkedSection}</p>
              )}
            </div>
            <NoteEditor note={activeNote} onChange={updateNote} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <StickyNote className="h-8 w-8 text-muted-foreground/30" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No note selected</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">Create a note using the + button</p>
            </div>
            <button
              onClick={addNote}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
