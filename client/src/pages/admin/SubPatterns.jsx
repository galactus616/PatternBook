import React, { useState, useMemo, useRef } from 'react';
import { useAuth } from '../../features/auth/useAuth';
import { useAdmin, hasPermission, PERMISSIONS } from '../../features/admin/useAdmin';
import { Network, Search, Plus, Pencil, Trash2, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';
import SubPatternForm from '../../features/admin/components/SubPatternForm';
import ConfirmDelete from '../../features/admin/components/ConfirmDelete';

// ─── Filter Pills Scroller ─────────────────────────────────────────────────────

function PillsScroller({ items, active, onChange }) {
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
  }, [items]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="flex items-center gap-3 w-full">
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
          All Patterns
        </button>
        {items.map(t => (
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

// ─── Sub-Pattern Row ───────────────────────────────────────────────────────────

function SubPatternRow({ subPattern, index, onEdit, onDelete, canEdit, canDelete }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream/70 transition-colors group/row border-b border-rule/30 last:border-0">
      <span className="font-mono text-[10px] text-muted/40 w-5 shrink-0 text-right select-none">{index + 1}</span>

      <div className="w-5 h-5 rounded-md bg-ink/5 border border-rule/60 flex items-center justify-center shrink-0">
        <Share2 size={9} className="text-muted" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-sans text-[13px] font-semibold text-ink truncate leading-tight">{subPattern.name}</p>
        <code className="font-mono text-[9px] text-muted/50">/{subPattern.slug}</code>
      </div>

      <div className="flex items-center gap-1 shrink-0 w-14 justify-end">
        <span className="font-mono text-[13px] font-bold text-ink">{subPattern.problemCount ?? 0}</span>
        <span className="font-mono text-[9px] text-muted/50">prob</span>
      </div>

      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover/row:opacity-100 transition-all duration-150">
        {canEdit && (
          <button
            onClick={() => onEdit(subPattern)}
            className="p-1.5 cursor-pointer rounded-lg text-muted hover:text-ink hover:bg-cream-dark transition-all"
          >
            <Pencil size={12} />
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(subPattern)}
            className="p-1.5 cursor-pointer rounded-lg text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Pattern Group ────────────────────────────────────────────────────────────

function PatternGroup({ patternName, subPatterns, onEdit, onDelete, defaultOpen, canEdit, canDelete }) {
  const [open, setOpen] = useState(defaultOpen);

  const totalProblems = subPatterns.reduce((s, p) => s + (p.problemCount ?? 0), 0);

  return (
    <div className="bg-white border border-rule rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 bg-cream/50 hover:bg-cream transition-colors cursor-pointer border-b border-rule/50"
      >
        <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center shrink-0">
          <Network size={15} className="text-lime" />
        </div>

        <div className="flex-1 text-left min-w-0">
          <p className="font-sans text-[14px] font-bold text-ink truncate">{patternName}</p>
          <p className="font-mono text-[9px] text-muted uppercase tracking-widest mt-0.5">
            {totalProblems} problems linked
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted border border-rule px-2.5 py-1 rounded-lg bg-white">
            {subPatterns.length} variants
          </span>
          <div className={`w-6 h-6 rounded-lg bg-ink/5 border border-rule/60 flex items-center justify-center transition-transform duration-200 ${open ? '' : '-rotate-90'}`}>
            <ChevronDown size={12} className="text-muted" />
          </div>
        </div>
      </button>

      {/* Rows */}
      {open && (
        <div>
          <div className="flex items-center gap-4 px-5 py-2 bg-cream/20 border-b border-rule/30">
            <span className="w-5 shrink-0" />
            <span className="w-5 shrink-0" />
            <span className="flex-1 font-mono text-[8px] uppercase tracking-widest text-muted/50">Sub-Pattern Variant</span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-muted/50 w-14 text-right">Problems</span>
            <span className="w-14 shrink-0" />
          </div>

          {subPatterns.map((sp, i) => (
            <SubPatternRow
              key={sp.id}
              subPattern={sp}
              index={i}
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-rule rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center mb-4">
        <Network size={24} className="text-lime" />
      </div>
      <h3 className="font-serif text-[22px] font-black text-ink mb-1">No sub-patterns found</h3>
      <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-6">Create variants of your main patterns</p>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-ink/90 transition-all"
        >
          <Plus size={14} /> Create Sub-Pattern
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SubPatterns() {
  const { user } = useAuth();
  const { patterns, subPatterns, addSubPattern, updateSubPattern, deleteSubPattern } = useAdmin();
  const [search, setSearch]             = useState('');
  const [patternFilter, setPatternFilter] = useState('ALL');
  const [modal, setModal]               = useState(null);

  const canAdd = hasPermission(user?.role, user?.permissions, PERMISSIONS.SUBPATTERNS_CREATE);
  const canEdit = hasPermission(user?.role, user?.permissions, PERMISSIONS.SUBPATTERNS_EDIT);
  const canDelete = hasPermission(user?.role, user?.permissions, PERMISSIONS.SUBPATTERNS_DELETE);

  const closeModal = () => setModal(null);

  const handleSave = (form) => {
    if (modal.type === 'add') addSubPattern(form);
    else updateSubPattern(modal.subPattern.id, form);
    closeModal();
  };

  const uniquePatterns = useMemo(() =>
    [...new Set(subPatterns.map(sp => sp.pattern).filter(Boolean))].sort()
  , [subPatterns]);

  const filtered = useMemo(() => subPatterns.filter(sp => {
    const q = search.toLowerCase();
    const matchSearch = !q || sp.name.toLowerCase().includes(q) || (sp.pattern ?? '').toLowerCase().includes(q) || sp.slug.toLowerCase().includes(q);
    const matchPattern = patternFilter === 'ALL' || (sp.pattern ?? '') === patternFilter;
    return matchSearch && matchPattern;
  }), [subPatterns, search, patternFilter]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach(sp => {
      const key = sp.pattern || 'Uncategorised';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(sp);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Content Management</p>
          </div>
          <h1 className="font-serif text-[36px] font-black text-ink leading-none mb-2">Sub-Patterns</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-sans text-[13px] text-muted">
              <span className="font-bold text-ink">{subPatterns.length}</span> sub-patterns across{' '}
              <span className="font-bold text-ink">{uniquePatterns.length}</span> parent patterns
            </p>
          </div>
        </div>

        {canAdd && (
          <button
            onClick={() => setModal({ type: 'add' })}
            className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-5 py-3 rounded-xl text-[13px] font-semibold hover:bg-ink/90 transition-all shadow-sm hover:shadow-md group"
          >
            <Plus size={15} />
            New Sub-Pattern
            <ArrowUpRight size={12} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>
        )}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="space-y-3 mb-7">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative group flex-1 min-w-[220px] max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/50 group-focus-within:text-ink transition-colors" />
            <input
              type="text"
              placeholder="Search name, slug or parent pattern…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-rule rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-ink/40 focus:shadow-sm transition-all placeholder:text-muted/40"
            />
          </div>

          <span className="font-mono text-[10px] text-muted uppercase tracking-widest ml-auto">
            {filtered.length} / {subPatterns.length}
          </span>
        </div>

        {uniquePatterns.length > 0 && (
          <PillsScroller
            items={uniquePatterns}
            active={patternFilter}
            onChange={setPatternFilter}
          />
        )}
      </div>

      {/* ── Grouped Sections ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        {grouped.length > 0
          ? grouped.map(([patternName, subs]) => (
              <PatternGroup
                key={patternName}
                patternName={patternName}
                subPatterns={subs}
                defaultOpen={grouped.length <= 4}
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={sp => setModal({ type: 'edit', subPattern: sp })}
                onDelete={sp => setModal({ type: 'delete', subPattern: sp })}
              />
            ))
          : <EmptyState onAdd={canAdd ? () => setModal({ type: 'add' }) : null} />
        }
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {modal?.type === 'add' && (
        <AdminModal title="New Sub-Pattern" onClose={closeModal}>
          <SubPatternForm patterns={patterns} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'edit' && (
        <AdminModal title="Edit Sub-Pattern" onClose={closeModal}>
          <SubPatternForm initial={modal.subPattern} patterns={patterns} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'delete' && (
        <AdminModal title="Delete Sub-Pattern" onClose={closeModal}>
          <ConfirmDelete name={modal.subPattern.name} onConfirm={() => { deleteSubPattern(modal.subPattern.id); closeModal(); }} onCancel={closeModal} />
        </AdminModal>
      )}
    </div>
  );
}
