import React, { useState, useMemo, useRef } from 'react';
import { useAdmin } from '../../features/admin/useAdmin';
import { Layers, Search, Plus, Pencil, Trash2, ArrowUpRight, ChevronDown, Code2, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';
import PatternForm from '../../features/admin/components/PatternForm';
import ConfirmDelete from '../../features/admin/components/ConfirmDelete';

// ─── Difficulty config — uses only brand tokens ───────────────────────────────

const DIFF = {
  EASY:   { dot: 'bg-lime',      text: 'text-lime-dark',  bg: 'bg-lime/10 border-lime/30'           },
  MEDIUM: { dot: 'bg-accent',    text: 'text-orange-700', bg: 'bg-accent/10 border-accent/30'       },
  HARD:   { dot: 'bg-brand-red', text: 'text-brand-red',  bg: 'bg-brand-red/10 border-brand-red/20' },
};

function DiffBadge({ difficulty }) {
  const d = DIFF[difficulty] ?? DIFF.MEDIUM;
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded-lg uppercase tracking-wider border ${d.bg} ${d.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${d.dot}`} />
      {difficulty}
    </span>
  );
}

// ─── Pattern Row ──────────────────────────────────────────────────────────────

function PatternRow({ pattern, index, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream/70 transition-colors group/row border-b border-rule/30 last:border-0">
      <span className="font-mono text-[10px] text-muted/40 w-5 shrink-0 text-right select-none">{index + 1}</span>

      <div className="w-5 h-5 rounded-md bg-ink/5 border border-rule/60 flex items-center justify-center shrink-0">
        <Code2 size={9} className="text-muted" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-sans text-[13px] font-semibold text-ink truncate leading-tight">{pattern.name}</p>
        <code className="font-mono text-[9px] text-muted/50">/{pattern.slug}</code>
      </div>

      <DiffBadge difficulty={pattern.difficulty} />

      <div className="flex items-center gap-1 shrink-0 w-14 justify-end">
        <span className="font-mono text-[13px] font-bold text-ink">{pattern.problemCount ?? 0}</span>
        <span className="font-mono text-[9px] text-muted/50">prob</span>
      </div>

      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover/row:opacity-100 transition-all duration-150">
        <button
          onClick={() => onEdit(pattern)}
          className="p-1.5 cursor-pointer rounded-lg text-muted hover:text-ink hover:bg-cream-dark transition-all"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={() => onDelete(pattern)}
          className="p-1.5 cursor-pointer rounded-lg text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Topic Group ──────────────────────────────────────────────────────────────

function TopicGroup({ topicName, patterns, onEdit, onDelete, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  const counts = useMemo(() => ({
    easy:   patterns.filter(p => p.difficulty === 'EASY').length,
    medium: patterns.filter(p => p.difficulty === 'MEDIUM').length,
    hard:   patterns.filter(p => p.difficulty === 'HARD').length,
  }), [patterns]);

  const totalProblems = patterns.reduce((s, p) => s + (p.problemCount ?? 0), 0);

  return (
    <div className="bg-white border border-rule rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">

      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 bg-cream/50 hover:bg-cream transition-colors cursor-pointer border-b border-rule/50"
      >
        {/* Icon */}
        <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center shrink-0">
          <Layers size={15} className="text-lime" />
        </div>

        {/* Name */}
        <div className="flex-1 text-left min-w-0">
          <p className="font-sans text-[14px] font-bold text-ink truncate">{topicName}</p>
          <p className="font-mono text-[9px] text-muted uppercase tracking-widest mt-0.5">
            {totalProblems} problems linked
          </p>
        </div>

        {/* Diff counts */}
        <div className="hidden sm:flex items-center gap-1.5">
          {counts.easy   > 0 && <span className="font-mono text-[9px] text-lime-dark bg-lime/10 border border-lime/30 px-2 py-0.5 rounded-lg">{counts.easy}E</span>}
          {counts.medium > 0 && <span className="font-mono text-[9px] text-orange-700 bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-lg">{counts.medium}M</span>}
          {counts.hard   > 0 && <span className="font-mono text-[9px] text-brand-red bg-brand-red/8 border border-brand-red/20 px-2 py-0.5 rounded-lg">{counts.hard}H</span>}
        </div>

        {/* Count + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted border border-rule px-2.5 py-1 rounded-lg bg-white">
            {patterns.length} patterns
          </span>
          <div className={`w-6 h-6 rounded-lg bg-ink/5 border border-rule/60 flex items-center justify-center transition-transform duration-200 ${open ? '' : '-rotate-90'}`}>
            <ChevronDown size={12} className="text-muted" />
          </div>
        </div>
      </button>

      {/* Pattern rows */}
      {open && (
        <div>
          {/* Column labels */}
          <div className="flex items-center gap-4 px-5 py-2 bg-cream/20 border-b border-rule/30">
            <span className="w-5 shrink-0" />
            <span className="w-5 shrink-0" />
            <span className="flex-1 font-mono text-[8px] uppercase tracking-widest text-muted/50">Pattern</span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-muted/50 w-20">Difficulty</span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-muted/50 w-14 text-right">Problems</span>
            <span className="w-14 shrink-0" />
          </div>

          {patterns.map((p, i) => (
            <PatternRow
              key={p.id}
              pattern={p}
              index={i}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Topic Pills Scroller ─────────────────────────────────────────────────────

function TopicPillsScroller({ topics, active, onChange }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [topics]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300); 
    }
  };

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Left button */}
      <button 
        onClick={() => scroll('left')} 
        disabled={!canScrollLeft}
        className="p-1.5 bg-white border border-rule rounded-full shadow-sm text-ink hover:bg-cream transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        <ChevronLeft size={14} />
      </button>

      <div 
        ref={scrollRef} 
        onScroll={checkScroll}
        className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 hide-scrollbar" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <button
          onClick={() => onChange('ALL')}
          className={`shrink-0 px-3.5 py-1.5 cursor-pointer rounded-xl font-mono text-[10px] uppercase tracking-widest border transition-all
            ${active === 'ALL'
              ? 'bg-ink text-cream border-ink'
              : 'bg-white border-rule text-muted hover:border-ink/40 hover:text-ink'}`}
        >
          All Topics
        </button>
        {topics.map(t => (
          <button
            key={t}
            onClick={() => onChange(active === t ? 'ALL' : t)}
            className={`shrink-0 px-3.5 py-1.5 cursor-pointer rounded-xl font-mono text-[10px] uppercase tracking-widest border transition-all
              ${active === t
                ? 'bg-ink text-cream border-ink'
                : 'bg-white border-rule text-muted hover:border-ink/40 hover:text-ink'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Right button */}
      <button 
        onClick={() => scroll('right')} 
        disabled={!canScrollRight}
        className="p-1.5 bg-white border border-rule rounded-full shadow-sm text-ink hover:bg-cream transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-rule rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center mb-4">
        <Layers size={24} className="text-lime" />
      </div>
      <h3 className="font-serif text-[22px] font-black text-ink mb-1">No patterns found</h3>
      <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-6">Try a different filter or create a new one</p>
      <button
        onClick={onAdd}
        className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-ink/90 transition-all"
      >
        <Plus size={14} /> Create Pattern
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Patterns() {
  const { topics, patterns, addPattern, updatePattern, deletePattern } = useAdmin();
  const [search, setSearch]           = useState('');
  const [diffFilter, setDiffFilter]   = useState('ALL');
  const [topicFilter, setTopicFilter] = useState('ALL');
  const [modal, setModal]             = useState(null);

  const closeModal = () => setModal(null);

  const handleSave = (form) => {
    if (modal.type === 'add') addPattern(form);
    else updatePattern(modal.pattern.id, form);
    closeModal();
  };

  const uniqueTopics = useMemo(() =>
    [...new Set(patterns.map(p => p.topic).filter(Boolean))].sort()
  , [patterns]);

  const filtered = useMemo(() => patterns.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.topic ?? '').toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    const matchDiff   = diffFilter === 'ALL' || p.difficulty === diffFilter;
    const matchTopic  = topicFilter === 'ALL' || (p.topic ?? '') === topicFilter;
    return matchSearch && matchDiff && matchTopic;
  }), [patterns, search, diffFilter, topicFilter]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach(p => {
      const key = p.topic || 'Uncategorised';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const easyTotal   = patterns.filter(p => p.difficulty === 'EASY').length;
  const mediumTotal = patterns.filter(p => p.difficulty === 'MEDIUM').length;
  const hardTotal   = patterns.filter(p => p.difficulty === 'HARD').length;

  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Content Management</p>
          </div>
          <h1 className="font-serif text-[36px] font-black text-ink leading-none mb-2">Patterns</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-sans text-[13px] text-muted">
              <span className="font-bold text-ink">{patterns.length}</span> patterns across{' '}
              <span className="font-bold text-ink">{uniqueTopics.length}</span> topics
            </p>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] text-lime-dark bg-lime/10 border border-lime/30 px-2 py-0.5 rounded-lg">{easyTotal} easy</span>
              <span className="font-mono text-[9px] text-orange-700 bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-lg">{mediumTotal} medium</span>
              <span className="font-mono text-[9px] text-brand-red bg-brand-red/8 border border-brand-red/20 px-2 py-0.5 rounded-lg">{hardTotal} hard</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setModal({ type: 'add' })}
          className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-5 py-3 rounded-xl text-[13px] font-semibold hover:bg-ink/90 transition-all shadow-sm hover:shadow-md group"
        >
          <Plus size={15} />
          New Pattern
          <ArrowUpRight size={12} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </button>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="space-y-3 mb-7">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative group flex-1 min-w-[220px] max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/50 group-focus-within:text-ink transition-colors" />
            <input
              type="text"
              placeholder="Search name, slug or topic…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-rule rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-ink/40 focus:shadow-sm transition-all placeholder:text-muted/40"
            />
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-1 p-1 bg-white border border-rule rounded-xl">
            {[
              { key: 'ALL',    label: 'All',    active: 'bg-ink text-cream'                  },
              { key: 'EASY',   label: 'Easy',   active: 'bg-lime text-lime-dark'              },
              { key: 'MEDIUM', label: 'Medium', active: 'bg-accent text-white'                },
              { key: 'HARD',   label: 'Hard',   active: 'bg-brand-red text-white'             },
            ].map(({ key, label, active }) => (
              <button
                key={key}
                onClick={() => setDiffFilter(key)}
                className={`px-3.5 py-1.5 cursor-pointer rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all
                  ${diffFilter === key ? `${active} shadow-sm` : 'text-muted hover:text-ink'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="font-mono text-[10px] text-muted uppercase tracking-widest ml-auto">
            {filtered.length} / {patterns.length}
          </span>
        </div>

        {/* Topic pills — scrollable with arrow buttons */}
        {uniqueTopics.length > 0 && (
          <TopicPillsScroller
            topics={uniqueTopics}
            active={topicFilter}
            onChange={setTopicFilter}
          />
        )}
      </div>

      {/* ── Grouped Sections ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        {grouped.length > 0
          ? grouped.map(([topicName, pats]) => (
              <TopicGroup
                key={topicName}
                topicName={topicName}
                patterns={pats}
                defaultOpen={grouped.length <= 4}
                onEdit={p => setModal({ type: 'edit', pattern: p })}
                onDelete={p => setModal({ type: 'delete', pattern: p })}
              />
            ))
          : <EmptyState onAdd={() => setModal({ type: 'add' })} />
        }
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {modal?.type === 'add' && (
        <AdminModal title="New Pattern" onClose={closeModal}>
          <PatternForm topics={topics} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'edit' && (
        <AdminModal title="Edit Pattern" onClose={closeModal}>
          <PatternForm initial={modal.pattern} topics={topics} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'delete' && (
        <AdminModal title="Delete Pattern" onClose={closeModal}>
          <ConfirmDelete name={modal.pattern.name} onConfirm={() => { deletePattern(modal.pattern.id); closeModal(); }} onCancel={closeModal} />
        </AdminModal>
      )}
    </div>
  );
}
