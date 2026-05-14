import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className="pointer-events-auto bg-ink text-cream border border-rule px-4 py-3 rounded-[4px] shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 fade-in duration-300 min-w-[280px]"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={16} className="text-lime shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-brand-red shrink-0" />
          )}
          <p className="font-sans text-[13px] font-bold tracking-wide flex-1">{toast.message}</p>
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-muted hover:text-cream transition-colors cursor-pointer shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
