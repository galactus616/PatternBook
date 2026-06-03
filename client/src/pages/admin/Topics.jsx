import React, { useState } from 'react';
import { useAuth } from '../../features/auth/useAuth';
import { useAdmin, hasPermission, PERMISSIONS } from '../../features/admin/useAdmin';
import { BookOpen, Search, Plus, Pencil, Trash2, Hash, ArrowUpRight, Layers, GripVertical } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';
import TopicForm from '../../features/admin/components/TopicForm';
import ConfirmDelete from '../../features/admin/components/ConfirmDelete';

// ─── Topic Card ───────────────────────────────────────────────────────────────

function TopicCard({ topic, index, onEdit, onDelete, canEdit, canDelete }) {
  const maxProblems = 30;
  const barPct = Math.min(100, Math.round(((topic.problemCount ?? 0) / maxProblems) * 100));

  // Brand-only palette: ink / lime / brand-red / accent / muted variants
  const palettes = [
    { ring: 'border-rule',         icon: 'bg-ink text-lime',            bar: 'bg-ink'        },
    { ring: 'border-lime/50',      icon: 'bg-lime/15 text-lime-dark',   bar: 'bg-lime'       },
    { ring: 'border-brand-red/25', icon: 'bg-brand-red/8 text-brand-red', bar: 'bg-brand-red'},
    { ring: 'border-accent/30',    icon: 'bg-accent/10 text-orange-700', bar: 'bg-accent'    },
    { ring: 'border-rule',         icon: 'bg-cream-dark text-muted',    bar: 'bg-muted'      },
    { ring: 'border-ink/20',       icon: 'bg-ink/8 text-ink',           bar: 'bg-ink/40'     },
  ];
  const { ring, icon, bar } = palettes[index % palettes.length];

  return (
    <div className={`group relative bg-white border ${ring} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4`}>
      {/* drag handle (visual only) */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity cursor-grab">
        <GripVertical size={14} className="text-muted" />
      </div>

      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${icon}`}>
            <BookOpen size={15} />
          </div>
          <div>
            <p className="font-sans text-[14px] font-bold text-ink leading-tight">{topic.name}</p>
            <code className="font-mono text-[10px] text-muted/70">{topic.slug}</code>
          </div>
        </div>

        {/* Action buttons — always visible on card */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canEdit && (
            <button
              onClick={() => onEdit(topic)}
              className="p-1.5 cursor-pointer rounded-lg text-muted hover:text-ink hover:bg-cream-dark transition-all"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(topic)}
              className="p-1.5 cursor-pointer rounded-lg text-muted hover:text-brand-red hover:bg-brand-red/5 transition-all"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-center">
        <div>
          <p className="font-serif text-[22px] font-black text-ink leading-none">{topic.problemCount ?? 0}</p>
          <p className="font-mono text-[8px] uppercase tracking-widest text-muted mt-0.5">problems</p>
        </div>
        <div className="w-px h-8 bg-rule/60" />
        <div>
          <div className="flex items-center gap-1">
            <Hash size={11} className="text-muted" />
            <p className="font-mono text-[13px] font-bold text-ink">{topic.order ?? '—'}</p>
          </div>
          <p className="font-mono text-[8px] uppercase tracking-widest text-muted mt-0.5">order</p>
        </div>
        <div className="flex-1">
          <div className="h-1.5 bg-cream-dark rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-700 ${bar}`}
              style={{ width: `${barPct}%` }}
            />
          </div>
          <p className="font-mono text-[8px] text-muted/60 mt-1 text-right">{barPct}% capacity</p>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream border border-rule flex items-center justify-center mb-4">
        <BookOpen size={24} className="text-muted" />
      </div>
      <h3 className="font-serif text-[20px] font-black text-ink mb-1">No topics yet</h3>
      <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-6">Create your first topic to get started</p>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-ink/90 transition-all shadow-sm"
        >
          <Plus size={14} /> Create Topic
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Topics() {
  const { user } = useAuth();
  const { topics, addTopic, updateTopic, deleteTopic } = useAdmin();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const canAdd = hasPermission(user?.role, user?.permissions, PERMISSIONS.TOPICS_CREATE);
  const canEdit = hasPermission(user?.role, user?.permissions, PERMISSIONS.TOPICS_EDIT);
  const canDelete = hasPermission(user?.role, user?.permissions, PERMISSIONS.TOPICS_DELETE);

  const filtered = topics.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => setModal(null);

  const handleSave = (form) => {
    if (modal.type === 'add') {
      addTopic({ name: form.name, slug: form.slug, order: Number(form.order) || topics.length + 1 });
    } else {
      updateTopic(modal.topic.id, { name: form.name, slug: form.slug, order: Number(form.order) });
    }
    closeModal();
  };

  const handleDelete = () => {
    deleteTopic(modal.topic.id);
    closeModal();
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Content Management</p>
          </div>
          <h1 className="font-serif text-[36px] font-black text-ink leading-none mb-2">Topics</h1>
          <div className="flex items-center gap-4">
            <p className="font-sans text-[13px] text-muted">
              <span className="font-bold text-ink">{topics.length}</span> topics · <span className="font-bold text-ink">{topics.reduce((s, t) => s + (t.problemCount ?? 0), 0)}</span> problems linked
            </p>
          </div>
        </div>

        {canAdd && (
          <button
            onClick={() => setModal({ type: 'add' })}
            className="flex items-center cursor-pointer gap-2 bg-ink text-cream px-5 py-3 rounded-xl text-[13px] font-semibold hover:bg-ink/90 transition-all shadow-sm hover:shadow-md group"
          >
            <Plus size={15} />
            New Topic
            <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>
        )}
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="relative group flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" />
          <input
            type="text"
            placeholder="Search by name or slug…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-rule rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-ink focus:shadow-sm transition-all placeholder:text-muted/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
            {filtered.length} of {topics.length}
          </span>
          {/* Summary chips */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-lime/10 border border-lime/30 rounded-lg">
              <Layers size={11} className="text-lime-dark" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-lime-dark">
                {topics.length} topics
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Card Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0
          ? filtered.map((t, i) => (
              <TopicCard
                key={t.id}
                topic={t}
                index={i}
                canEdit={canEdit}
                canDelete={canDelete}
                onEdit={topic => setModal({ type: 'edit', topic })}
                onDelete={topic => setModal({ type: 'delete', topic })}
              />
            ))
          : <EmptyState onAdd={canAdd ? () => setModal({ type: 'add' }) : null} />
        }
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {modal?.type === 'add' && (
        <AdminModal title="New Topic" onClose={closeModal}>
          <TopicForm onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'edit' && (
        <AdminModal title="Edit Topic" onClose={closeModal}>
          <TopicForm initial={modal.topic} onSave={handleSave} onCancel={closeModal} />
        </AdminModal>
      )}
      {modal?.type === 'delete' && (
        <AdminModal title="Delete Topic" onClose={closeModal}>
          <ConfirmDelete name={modal.topic.name} onConfirm={handleDelete} onCancel={closeModal} />
        </AdminModal>
      )}
    </div>
  );
}
