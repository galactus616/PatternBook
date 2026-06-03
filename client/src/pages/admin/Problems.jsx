import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../features/admin/useAdmin';
import { Search, Plus, Pencil, Trash2, Code2, Lock, ArrowUpRight } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';

import ProblemForm from '../../features/admin/components/ProblemForm';
import ConfirmDelete from '../../features/admin/components/ConfirmDelete';

// ─── Difficulty Badge ─────────────────────────────────────────────────────────

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

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-rule rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center mb-4">
        <Code2 size={24} className="text-lime" />
      </div>
      <h3 className="font-serif text-[22px] font-black text-ink mb-1">No problems found</h3>
      <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-6">Try a different filter or add a new one</p>
      <button
        onClick={onAdd}
        className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-ink/90 transition-all"
      >
        <Plus size={14} /> Add Problem
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Problems() {
  const { topics, patterns, subPatterns, problems, addProblem, updateProblem, deleteProblem } = useAdmin();
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('ALL');
  const [modal, setModal] = useState(null);

  const filtered = useMemo(() => problems.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.topic ?? '').toLowerCase().includes(q);
    const matchDiff = diffFilter === 'ALL' || p.difficulty === diffFilter;
    return matchSearch && matchDiff;
  }), [problems, search, diffFilter]);

  const closeModal = () => setModal(null);
  
  const handleSave = (form) => {
    if (modal.type === 'add') addProblem(form);
    else updateProblem(modal.problem.id, form);
    closeModal();
  };

  const easyTotal   = problems.filter(p => p.difficulty === 'EASY').length;
  const mediumTotal = problems.filter(p => p.difficulty === 'MEDIUM').length;
  const hardTotal   = problems.filter(p => p.difficulty === 'HARD').length;

  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Content Management</p>
          </div>
          <h1 className="font-serif text-[36px] font-black text-ink leading-none mb-2">Problems</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-sans text-[13px] text-muted">
              <span className="font-bold text-ink">{problems.length}</span> problems in the system
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
          New Problem
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
              placeholder="Search by title or topic..." 
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
            {filtered.length} / {problems.length}
          </span>
        </div>
      </div>

      {/* ── Data Table ───────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="bg-white border border-rule rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm table-fixed min-w-[900px]">
            <thead>
              <tr className="bg-cream/40 border-b border-rule">
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-12">#</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Problem</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-40">Topic</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-28">Difficulty</th>
                <th className="text-center px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-16">Pro</th>
                <th className="text-right px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-24">Solves</th>
                <th className="text-right px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/40">
              {filtered.map((p, i) => (
                <tr key={p.id} className="hover:bg-cream/60 transition-colors group/row">
                  <td className="px-5 py-4 font-mono text-[10px] text-muted/40">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-ink/5 border border-rule/60 flex items-center justify-center shrink-0">
                        <Code2 size={12} className="text-muted" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans text-[13px] font-bold text-ink truncate leading-tight">{p.title}</p>
                        <code className="font-mono text-[9px] text-muted/50 truncate block">/{p.slug}</code>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[12px] font-medium text-muted/80">{p.topic}</td>
                  <td className="px-5 py-4">
                    <DiffBadge difficulty={p.difficulty} />
                  </td>
                  <td className="px-5 py-4 text-center">
                    {p.isPro && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-ink text-lime border border-ink/10" title="PRO only">
                        <Lock size={10} />
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-mono text-[13px] font-bold text-ink">{p.solved?.toLocaleString() ?? 0}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <button onClick={() => setModal({ type: 'edit', problem: p })} className="p-1.5 cursor-pointer rounded-lg text-muted hover:text-ink hover:bg-cream-dark transition-all" title="Edit">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setModal({ type: 'delete', problem: p })} className="p-1.5 cursor-pointer rounded-lg text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState onAdd={() => setModal({ type: 'add' })} />
      )}

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {modal?.type === 'add' && (
        <AdminModal title="New Problem" onClose={closeModal} width="max-w-4xl">
          <ProblemForm topics={topics} patterns={patterns} subPatterns={subPatterns} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'edit' && (
        <AdminModal title="Edit Problem" onClose={closeModal} width="max-w-4xl">
          <ProblemForm initial={modal.problem} topics={topics} patterns={patterns} subPatterns={subPatterns} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'delete' && (
        <AdminModal title="Delete Problem" onClose={closeModal}>
          <ConfirmDelete name={modal.problem.title} onConfirm={() => { deleteProblem(modal.problem.id); closeModal(); }} onCancel={closeModal} />
        </AdminModal>
      )}
    </div>
  );
}
