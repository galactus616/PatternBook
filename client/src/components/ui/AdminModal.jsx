import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Shared modal wrapper used across all admin pages.
 * Same design tokens as the dashboard (cream/ink/border-rule).
 */
export default function AdminModal({ title, onClose, children, width = 'max-w-lg' }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`relative bg-cream border border-rule rounded-[4px] shadow-2xl w-full ${width} mx-4 max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rule shrink-0">
          <h2 className="font-serif text-[18px] font-black text-ink">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 cursor-pointer rounded-[4px] flex items-center justify-center text-muted hover:text-ink hover:bg-cream-dark transition-all"
          >
            <X size={15} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
