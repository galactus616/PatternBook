import React from 'react';
import { TriangleAlert } from 'lucide-react';

export default function ConfirmDelete({ name, onConfirm, onCancel }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4 p-4 rounded-xl bg-brand-red/5 border border-brand-red/20">
        <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0 mt-0.5">
          <TriangleAlert size={16} className="text-brand-red" />
        </div>
        <div>
          <p className="font-sans text-[14px] font-bold text-ink mb-1">Are you sure?</p>
          <p className="text-[13px] text-muted leading-relaxed">
            You're about to permanently delete <strong className="text-ink">"{name}"</strong>. This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 cursor-pointer bg-brand-red text-white rounded-xl py-2.5 text-[13px] font-semibold hover:bg-brand-red/90 transition-all shadow-sm"
        >
          Yes, Delete
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 cursor-pointer rounded-xl border border-rule text-muted hover:text-ink hover:border-ink/30 text-[13px] transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
