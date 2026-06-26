import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Bold, Italic, Underline, Strikethrough, ChevronDown, List, ListOrdered, CheckSquare, Minus, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

// ── Types ──────────────────────────────────────────────────────────────────────

type BlockType = 'text' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'checklist' | 'divider';

interface NoteBlock {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
}

interface NoteData {
  id: string;
  title: string;
  blocks: NoteBlock[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function fmtDate(iso: string) {
  try { return format(new Date(iso), "MMM d, yyyy, HH:mm"); }
  catch { return iso; }
}

const BLOCK_TYPE_LABEL: Record<BlockType, string> = {
  text: 'Normal text', h1: 'Heading 1', h2: 'Heading 2', h3: 'Heading 3',
  ul: 'Bullet list', ol: 'Numbered list', checklist: 'Checklist', divider: 'Divider',
};

const BLOCK_COMMANDS: { type: BlockType; shortLabel: string }[] = [
  { type: 'text',      shortLabel: 'Text'    },
  { type: 'h1',        shortLabel: 'H1'      },
  { type: 'h2',        shortLabel: 'H2'      },
  { type: 'h3',        shortLabel: 'H3'      },
  { type: 'ul',        shortLabel: '• List'  },
  { type: 'ol',        shortLabel: '1. List' },
  { type: 'checklist', shortLabel: '☐ Check' },
  { type: 'divider',   shortLabel: '---'     },
];

// ── BlockEditor ────────────────────────────────────────────────────────────────

interface BlockEditorProps {
  block: NoteBlock;
  olIndex: number;           // 1-based index for ol items
  isFirst: boolean;
  onContentChange: (id: string, html: string) => void;
  onKeyDown: (e: React.KeyboardEvent, block: NoteBlock) => void;
  onFocus: (id: string) => void;
  onAddAfter: (id: string) => void;
  onToggleCheck: (id: string) => void;
  showSlashMenu: boolean;
  onSlashSelect: (type: BlockType) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
}

const BlockEditor = React.memo(function BlockEditor({
  block, olIndex, isFirst,
  onContentChange, onKeyDown, onFocus, onAddAfter, onToggleCheck,
  showSlashMenu, onSlashSelect, registerRef,
}: BlockEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Set initial innerHTML once on mount (uncontrolled pattern)
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = block.content;
    registerRef(block.id, ref.current);
    return () => registerRef(block.id, null);
  }, []); // eslint-disable-line

  if (block.type === 'divider') {
    return <div className="py-3"><hr className="border-border" /></div>;
  }

  const editable = (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={
        isFirst && !block.content
          ? "Type '/' to add a block, or start writing..."
          : block.type === 'ul' || block.type === 'ol' ? 'List item'
          : block.type === 'checklist' ? 'To-do'
          : ''
      }
      className={cn(
        "outline-none min-h-[1.5rem] break-words w-full",
        block.type === 'h1' && "text-[1.75rem] font-bold leading-tight",
        block.type === 'h2' && "text-2xl font-semibold leading-tight",
        block.type === 'h3' && "text-xl font-medium leading-snug",
        (block.type === 'text' || block.type === 'ul' || block.type === 'ol' || block.type === 'checklist') && "text-[0.9rem] leading-relaxed",
        block.type === 'checklist' && block.checked && "line-through text-muted-foreground",
        "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30 empty:before:pointer-events-none",
      )}
      onFocus={() => onFocus(block.id)}
      onInput={e => onContentChange(block.id, (e.target as HTMLDivElement).innerHTML)}
      onKeyDown={e => onKeyDown(e, block)}
    />
  );

  return (
    <div className="group/block flex items-start gap-1.5 py-[2px] relative">
      {/* Gutter add-block button */}
      <button
        className="opacity-0 group-hover/block:opacity-100 flex-shrink-0 w-5 h-5 mt-[3px] rounded flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:bg-muted transition-all"
        onClick={() => onAddAfter(block.id)}
        tabIndex={-1}
      >
        <Plus className="h-3 w-3" />
      </button>

      {/* Checklist checkbox */}
      {block.type === 'checklist' && (
        <input
          type="checkbox"
          checked={!!block.checked}
          onChange={() => onToggleCheck(block.id)}
          className="mt-[5px] h-3.5 w-3.5 flex-shrink-0 rounded accent-primary cursor-pointer"
        />
      )}

      {/* Bullet */}
      {block.type === 'ul' && (
        <span className="flex-shrink-0 text-foreground mt-[2px] text-base leading-relaxed select-none">•</span>
      )}

      {/* OL number */}
      {block.type === 'ol' && (
        <span className="flex-shrink-0 text-foreground mt-[2px] text-[0.9rem] leading-relaxed select-none min-w-[1.4em] text-right">{olIndex}.</span>
      )}

      <div className="flex-1 relative">
        {editable}

        {/* Slash command palette */}
        {showSlashMenu && (
          <div className="absolute left-0 top-full mt-1 z-50 w-48 bg-popover border border-border rounded-lg shadow-xl py-1 overflow-hidden">
            {BLOCK_COMMANDS.map(cmd => (
              <button
                key={cmd.type}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-muted transition-colors text-foreground text-left"
                onMouseDown={e => { e.preventDefault(); onSlashSelect(cmd.type); }}
              >
                <span className="text-[11px] text-muted-foreground font-mono w-10 flex-shrink-0">{cmd.shortLabel}</span>
                <span>{BLOCK_TYPE_LABEL[cmd.type]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

// ── NotesSlidePanel ────────────────────────────────────────────────────────────

interface NotesSlidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string | null;
  noteName: string;
  engId: string;
}

export function NotesSlidePanel({ open, onOpenChange, noteId, noteName, engId }: NotesSlidePanelProps) {
  const storageKey = noteId ? `engagement-note-content-${engId}-${noteId}` : null;

  const [note, setNote] = useState<NoteData | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [slashMenuBlockId, setSlashMenuBlockId] = useState<string | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) blockRefs.current.set(id, el);
    else blockRefs.current.delete(id);
  }, []);

  // Load / init note when panel opens
  useEffect(() => {
    if (!open || !storageKey || !noteId) return;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as NoteData;
        setNote(parsed);
        setTimeout(() => {
          if (titleRef.current) titleRef.current.innerHTML = parsed.title;
        }, 40);
        return;
      } catch { /* fall through */ }
    }
    const now = new Date().toISOString();
    const initial: NoteData = {
      id: noteId,
      title: noteName,
      blocks: [{ id: genId(), type: 'text', content: '' }],
      createdAt: now,
      createdBy: 'praveend@countable.co',
      updatedAt: now,
    };
    setNote(initial);
    localStorage.setItem(storageKey, JSON.stringify(initial));
    setTimeout(() => {
      if (titleRef.current) titleRef.current.innerHTML = noteName;
    }, 40);
  }, [open, noteId]); // eslint-disable-line

  const persist = useCallback((data: NoteData) => {
    if (!storageKey) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }, 400);
  }, [storageKey]);

  const updateBlockContent = useCallback((blockId: string, html: string) => {
    setNote(prev => {
      if (!prev) return prev;
      const updated = { ...prev, blocks: prev.blocks.map(b => b.id === blockId ? { ...b, content: html } : b), updatedAt: new Date().toISOString() };
      persist(updated);
      return updated;
    });
  }, [persist]);

  const addBlock = useCallback((afterId: string, type: BlockType = 'text') => {
    const newId = genId();
    setNote(prev => {
      if (!prev) return prev;
      const idx = prev.blocks.findIndex(b => b.id === afterId);
      const blocks = [...prev.blocks];
      blocks.splice(idx + 1, 0, { id: newId, type, content: '' });
      const updated = { ...prev, blocks, updatedAt: new Date().toISOString() };
      persist(updated);
      return updated;
    });
    setTimeout(() => blockRefs.current.get(newId)?.focus(), 50);
    return newId;
  }, [persist]);

  const removeBlock = useCallback((blockId: string) => {
    setNote(prev => {
      if (!prev || prev.blocks.length <= 1) return prev;
      const idx = prev.blocks.findIndex(b => b.id === blockId);
      const blocks = prev.blocks.filter(b => b.id !== blockId);
      const updated = { ...prev, blocks, updatedAt: new Date().toISOString() };
      persist(updated);
      if (idx > 0) setTimeout(() => blockRefs.current.get(prev.blocks[idx - 1].id)?.focus(), 30);
      return updated;
    });
  }, [persist]);

  const changeBlockType = useCallback((blockId: string, type: BlockType) => {
    setNote(prev => {
      if (!prev) return prev;
      const clean = prev.blocks.find(b => b.id === blockId)?.content.replace(/^\/\S*/, '') ?? '';
      const updated = { ...prev, blocks: prev.blocks.map(b => b.id === blockId ? { ...b, type, content: clean } : b), updatedAt: new Date().toISOString() };
      persist(updated);
      setTimeout(() => {
        const el = blockRefs.current.get(blockId);
        if (el) { el.innerHTML = clean; el.focus(); }
      }, 30);
      return updated;
    });
    setSlashMenuBlockId(null);
  }, [persist]);

  const toggleCheck = useCallback((blockId: string) => {
    setNote(prev => {
      if (!prev) return prev;
      const updated = { ...prev, blocks: prev.blocks.map(b => b.id === blockId ? { ...b, checked: !b.checked } : b), updatedAt: new Date().toISOString() };
      persist(updated);
      return updated;
    });
  }, [persist]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, block: NoteBlock) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setSlashMenuBlockId(null);
      addBlock(block.id);
    } else if (e.key === 'Backspace') {
      const el = blockRefs.current.get(block.id);
      if (el && !el.textContent) {
        e.preventDefault();
        setSlashMenuBlockId(null);
        if (block.type !== 'text') changeBlockType(block.id, 'text');
        else removeBlock(block.id);
      }
    } else if (e.key === '/') {
      const el = blockRefs.current.get(block.id);
      if (el && !el.textContent) setTimeout(() => setSlashMenuBlockId(block.id), 0);
    } else if (e.key === 'Escape') {
      setSlashMenuBlockId(null);
    }
  }, [addBlock, removeBlock, changeBlockType]);

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setNote(prev => {
        if (!prev) return prev;
        const firstId = prev.blocks[0]?.id;
        if (firstId) setTimeout(() => blockRefs.current.get(firstId)?.focus(), 10);
        return prev;
      });
    }
  };

  const handleTitleBlur = () => {
    const newTitle = titleRef.current?.textContent?.trim() || noteName;
    setNote(prev => {
      if (!prev) return prev;
      const updated = { ...prev, title: newTitle, updatedAt: new Date().toISOString() };
      persist(updated);
      return updated;
    });
  };

  const handleFormat = (cmd: string) => document.execCommand(cmd, false);

  const activeBlock = note?.blocks.find(b => b.id === activeBlockId);

  // Compute 1-based OL indices
  const olIndices = (blocks: NoteBlock[]) => {
    const map: Record<string, number> = {};
    let count = 0;
    for (const b of blocks) {
      if (b.type === 'ol') map[b.id] = ++count;
      else count = 0;
    }
    return map;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpenChange(false)}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 z-50 h-full bg-background border-l border-border flex flex-col shadow-2xl overflow-hidden"
            style={{ width: 580, maxWidth: '98vw' }}
            initial={{ x: '100%', opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.6 }}
            transition={{ type: 'spring', damping: 32, stiffness: 280, mass: 0.85 }}
            onClick={() => slashMenuBlockId && setSlashMenuBlockId(null)}
          >
            {/* ── Toolbar ── */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border bg-background flex-shrink-0">
              <div className="flex items-center gap-0.5 flex-1">
                {/* Block type picker */}
                {activeBlock && activeBlock.type !== 'divider' ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 text-xs font-medium px-2 h-7 rounded hover:bg-muted transition-colors text-foreground min-w-[7.5rem] justify-between">
                        <span>{BLOCK_TYPE_LABEL[activeBlock.type]}</span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                      {BLOCK_COMMANDS.filter(c => c.type !== 'divider').map(cmd => (
                        <DropdownMenuItem key={cmd.type} className="text-xs" onClick={() => activeBlockId && changeBlockType(activeBlockId, cmd.type)}>
                          {BLOCK_TYPE_LABEL[cmd.type]}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span className="text-xs text-muted-foreground px-2 h-7 flex items-center min-w-[7.5rem]">Normal text</span>
                )}

                <div className="w-px h-4 bg-border mx-0.5" />

                {(['bold','italic','underline','strikeThrough'] as const).map((cmd, i) => {
                  const Icon = [Bold, Italic, Underline, Strikethrough][i];
                  return (
                    <button key={cmd} onClick={() => handleFormat(cmd)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <Icon className="h-3.5 w-3.5" />
                    </button>
                  );
                })}
              </div>

              <button onClick={() => onOpenChange(false)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-1">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Scrollable content ── */}
            <div className="flex-1 overflow-y-auto">
              {note && (() => {
                const olMap = olIndices(note.blocks);
                return (
                  <div className="max-w-[520px] mx-auto px-8 pt-10 pb-24">
                    {/* Title */}
                    <div
                      ref={titleRef}
                      contentEditable
                      suppressContentEditableWarning
                      className="text-[2rem] font-bold leading-tight text-foreground outline-none mb-3 empty:before:content-['Untitled'] empty:before:text-muted-foreground/25 empty:before:pointer-events-none break-words"
                      onBlur={handleTitleBlur}
                      onKeyDown={handleTitleKeyDown}
                    />

                    {/* Meta */}
                    <div className="flex flex-col gap-1.5 mb-8 pb-6 border-b border-border/50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground flex-shrink-0">P</div>
                        <span>Creator</span>
                        <span className="font-medium text-foreground">{note.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-4 pl-7 text-xs text-muted-foreground">
                        <span>Created <span className="text-foreground">{fmtDate(note.createdAt)}</span></span>
                        <span>Last updated <span className="text-foreground">{fmtDate(note.updatedAt)}</span></span>
                      </div>
                    </div>

                    {/* Blocks */}
                    <div>
                      {note.blocks.map((block, idx) => (
                        <BlockEditor
                          key={block.id}
                          block={block}
                          olIndex={olMap[block.id] ?? 0}
                          isFirst={idx === 0}
                          onContentChange={updateBlockContent}
                          onKeyDown={handleKeyDown}
                          onFocus={setActiveBlockId}
                          onAddAfter={addBlock}
                          onToggleCheck={toggleCheck}
                          showSlashMenu={slashMenuBlockId === block.id}
                          onSlashSelect={type => changeBlockType(block.id, type)}
                          registerRef={registerRef}
                        />
                      ))}
                    </div>

                    {/* Click-to-focus dead area */}
                    <div
                      className="mt-2 min-h-[80px] cursor-text"
                      onClick={e => {
                        e.stopPropagation();
                        const last = note.blocks[note.blocks.length - 1];
                        if (last && last.type !== 'divider') blockRefs.current.get(last.id)?.focus();
                        else if (last) addBlock(last.id);
                      }}
                    />
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
