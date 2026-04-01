import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Clock,
  BookOpen,
  Hash,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  ChevronRight,
  Sparkles,
  Save,
  Link2,
  CheckSquare,
} from 'lucide-react';
import axios from 'axios';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  isPinned: boolean;
}

const INITIAL_NOTES: Note[] = [
  {
    id: '1',
    title: 'DSA Revision Plan — Week 1',
    content: `## Week 1: Arrays & Hashing\n\n### Goals\n- [ ] Complete Neetcode 150 arrays section\n- [ ] Solve 3 medium-level problems daily\n- [x] Revise two-pointer technique\n- [x] Watch Striver's SDE sheet video on arrays\n\n### Key Patterns\n- **Sliding Window**: Use for subarray problems with constraints\n- **Two Pointer**: Sort + converge for pair/triplet problems\n- **Prefix Sum**: Running totals for range queries\n\n### Notes\n> The most important thing is recognizing the pattern. Once you see it, the code writes itself.\n\n\`\`\`python\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target-n], i]\n        seen[n] = i\n\`\`\``,
    tags: ['DSA', 'Revision', 'Arrays'],
    updatedAt: '2026-06-25T10:30:00Z',
    isPinned: true,
  },
  {
    id: '2',
    title: 'System Design Interview Notes',
    content: `## System Design Fundamentals\n\n### Load Balancing\n- Round Robin, Least Connections, IP Hash\n- Layer 4 vs Layer 7 load balancing\n\n### Caching Strategies\n1. **Write-through**: Write to cache + DB simultaneously\n2. **Write-behind**: Write to cache, async to DB\n3. **Cache-aside**: App checks cache first, then DB\n\n### Database Sharding\n- Horizontal vs Vertical partitioning\n- Consistent hashing for distribution\n\n> Always start with requirements → estimations → high-level design → deep dive`,
    tags: ['System Design', 'Interview'],
    updatedAt: '2026-06-24T15:00:00Z',
    isPinned: false,
  },
  {
    id: '3',
    title: 'React Performance Optimization',
    content: `## React Performance Tips\n\n- Use \`React.memo\` for pure components\n- \`useMemo\` for expensive computations\n- \`useCallback\` for stable function references\n- Virtualize long lists with \`react-window\`\n- Code-split with \`React.lazy\` + \`Suspense\`\n\n### Profiling\n- Use React DevTools Profiler\n- Check for unnecessary re-renders\n- Monitor bundle size with webpack-bundle-analyzer`,
    tags: ['React', 'Performance', 'Frontend'],
    updatedAt: '2026-06-23T08:00:00Z',
    isPinned: false,
  },
];

const formatMarkdown = (text: string): string => {
  let html = text;
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-slate-100 dark:bg-zinc-900 p-3 rounded-lg text-xs font-mono overflow-x-auto my-2 border border-slate-200 dark:border-zinc-800"><code>$2</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-xs font-mono text-brand-accent">$1</code>');
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-sm font-bold mt-4 mb-1.5 text-slate-800 dark:text-zinc-200">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-base font-bold mt-5 mb-2 text-slate-900 dark:text-white">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-lg font-bold mt-6 mb-2 text-slate-900 dark:text-white">$1</h1>');
  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800 dark:text-zinc-200">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Blockquotes
  html = html.replace(/^> (.*$)/gm, '<blockquote class="border-l-3 border-brand-primary/40 pl-3 py-1 my-2 text-sm text-slate-500 dark:text-zinc-400 italic bg-brand-primary/5 rounded-r-lg">$1</blockquote>');
  // Checkboxes
  html = html.replace(/^- \[x\] (.*$)/gm, '<div class="flex items-center gap-2 my-1"><span class="w-4 h-4 rounded border-2 border-brand-success bg-brand-success/20 flex items-center justify-center text-brand-success text-[10px]">✓</span><span class="text-sm text-slate-500 dark:text-zinc-400 line-through">$1</span></div>');
  html = html.replace(/^- \[ \] (.*$)/gm, '<div class="flex items-center gap-2 my-1"><span class="w-4 h-4 rounded border-2 border-slate-300 dark:border-zinc-700"></span><span class="text-sm text-slate-700 dark:text-zinc-300">$1</span></div>');
  // Ordered list
  html = html.replace(/^\d+\. (.*$)/gm, '<li class="text-sm text-slate-600 dark:text-zinc-400 ml-4 list-decimal my-0.5">$1</li>');
  // Unordered list
  html = html.replace(/^- (.*$)/gm, '<li class="text-sm text-slate-600 dark:text-zinc-400 ml-4 list-disc my-0.5">$1</li>');
  // Paragraphs (double newlines)
  html = html.replace(/\n\n/g, '<div class="my-2"></div>');
  html = html.replace(/\n/g, '<br/>');
  return html;
};
const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/notes');
        if (response.data && response.data.notes) {
          const mapped: Note[] = response.data.notes.map((n: any) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            tags: n.category ? [n.category] : [],
            updatedAt: n.updatedAt,
            isPinned: false
          }));
          setNotes(mapped);
          if (mapped.length > 0) {
            setSelectedId(mapped[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      }
    };
    fetchNotes();
  }, []);

  const selectedNote = notes.find((n) => n.id === selectedId);

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const createNote = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/notes', {
        title: 'Untitled Note',
        content: '## Start writing here...\n\nUse Markdown syntax for formatting.',
        category: 'general'
      });
      if (response.data && response.data.note) {
        const n = response.data.note;
        const newNote: Note = {
          id: n.id,
          title: n.title,
          content: n.content,
          tags: n.category ? [n.category] : [],
          updatedAt: n.updatedAt,
          isPinned: false
        };
        setNotes([newNote, ...notes]);
        setSelectedId(newNote.id);
        setIsEditing(true);
        setEditTitle(newNote.title);
        setEditContent(newNote.content);
        setEditTags(newNote.tags.join(', '));
      }
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const startEdit = (note: Note) => {
    setIsEditing(true);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
  };

  const saveNote = async () => {
    if (!selectedId) return;
    const tagArray = editTags.split(',').map((t) => t.trim()).filter(Boolean);
    const category = tagArray[0] || 'general';

    try {
      const response = await axios.put(`http://localhost:5001/api/notes/${selectedId}`, {
        title: editTitle || 'Untitled',
        content: editContent,
        category
      });
      if (response.data && response.data.note) {
        const updatedNote = response.data.note;
        setNotes((prev) =>
          prev.map((n) =>
            n.id === selectedId
              ? {
                  ...n,
                  title: updatedNote.title,
                  content: updatedNote.content,
                  tags: updatedNote.category ? [updatedNote.category] : [],
                  updatedAt: updatedNote.updatedAt,
                }
              : n
          )
        );
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/notes/${id}`);
      const updatedNotes = notes.filter((n) => n.id !== id);
      setNotes(updatedNotes);
      if (selectedId === id) {
        setSelectedId(updatedNotes[0]?.id || null);
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    setEditContent((prev) => prev + `\n${prefix}${suffix}`);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-brand-primary" />
            Study Notes
          </h1>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Markdown-powered notes for study plans, interview prep, and more.</p>
        </div>
        <button
          onClick={createNote}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-semibold hover:bg-brand-primary/90 transition-all shadow-sm shadow-brand-primary/20"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
        {/* Left: Notes List */}
        <div className="w-72 shrink-0 flex flex-col gap-3 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-bg-cardDark text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary/40"
            />
          </div>

          {/* Note Cards */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNotes.map((note) => (
              <motion.button
                key={note.id}
                onClick={() => {
                  setSelectedId(note.id);
                  setIsEditing(false);
                }}
                whileHover={{ x: 2 }}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                  selectedId === note.id
                    ? 'border-brand-primary/30 bg-brand-primary/5 dark:bg-brand-primary/10'
                    : 'border-slate-200/60 dark:border-zinc-800/60 bg-white dark:bg-bg-cardDark hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate flex-1">{note.title}</p>
                  {note.isPinned && <span className="text-[10px]">📌</span>}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1 line-clamp-2">{note.content.replace(/[#*>`\[\]]/g, '').slice(0, 80)}...</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-2.5 w-2.5 text-slate-300" />
                  <span className="text-[10px] text-slate-400">{timeAgo(note.updatedAt)}</span>
                  {note.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Note Editor/Viewer */}
        <div className="flex-1 min-w-0 flex flex-col rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 bg-white dark:bg-bg-cardDark overflow-hidden">
          {selectedNote ? (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 dark:border-zinc-900">
                <div className="flex items-center gap-1">
                  {isEditing ? (
                    <>
                      <button onClick={() => insertMarkdown('# ')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors" title="Heading 1"><Heading1 className="h-4 w-4" /></button>
                      <button onClick={() => insertMarkdown('## ')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors" title="Heading 2"><Heading2 className="h-4 w-4" /></button>
                      <div className="w-px h-5 bg-slate-200 dark:bg-zinc-800 mx-1" />
                      <button onClick={() => insertMarkdown('**', '**')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors" title="Bold"><Bold className="h-4 w-4" /></button>
                      <button onClick={() => insertMarkdown('*', '*')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors" title="Italic"><Italic className="h-4 w-4" /></button>
                      <div className="w-px h-5 bg-slate-200 dark:bg-zinc-800 mx-1" />
                      <button onClick={() => insertMarkdown('- ')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors" title="Bullet List"><List className="h-4 w-4" /></button>
                      <button onClick={() => insertMarkdown('1. ')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors" title="Numbered List"><ListOrdered className="h-4 w-4" /></button>
                      <button onClick={() => insertMarkdown('- [ ] ')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors" title="Checklist"><CheckSquare className="h-4 w-4" /></button>
                      <div className="w-px h-5 bg-slate-200 dark:bg-zinc-800 mx-1" />
                      <button onClick={() => insertMarkdown('> ')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors" title="Quote"><Quote className="h-4 w-4" /></button>
                      <button onClick={() => insertMarkdown('```\n', '\n```')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors" title="Code Block"><Code className="h-4 w-4" /></button>
                      <button onClick={() => insertMarkdown('[', '](url)')} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors" title="Link"><Link2 className="h-4 w-4" /></button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FileText className="h-4 w-4" />
                      <span>Preview Mode</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={saveNote}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:bg-brand-primary/90 transition-all"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(selectedNote)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:bg-brand-primary/90 transition-all"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-brand-danger transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Note title..."
                      className="w-full text-xl font-bold bg-transparent border-0 outline-none text-slate-900 dark:text-white placeholder-slate-300"
                    />
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-slate-400" />
                      <input
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="Tags (comma separated)"
                        className="flex-1 text-xs bg-transparent border-0 outline-none text-slate-500 dark:text-zinc-400 placeholder-slate-300"
                      />
                    </div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full min-h-[400px] text-sm bg-transparent border-0 outline-none resize-none text-slate-700 dark:text-zinc-300 font-mono leading-relaxed"
                      placeholder="Write in markdown..."
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedNote.title}</h1>
                    <div className="flex items-center gap-2 mb-4">
                      {selectedNote.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-semibold border border-brand-primary/20">
                          {tag}
                        </span>
                      ))}
                      <span className="text-[10px] text-slate-400">
                        Updated {timeAgo(selectedNote.updatedAt)}
                      </span>
                    </div>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(selectedNote.content) }}
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <BookOpen className="h-12 w-12 text-slate-200 dark:text-zinc-800 mx-auto" />
                <p className="text-sm text-slate-400">Select a note or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;
