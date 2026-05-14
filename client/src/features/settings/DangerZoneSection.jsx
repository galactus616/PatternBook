import React, { useState } from "react";
import { AlertTriangle, Download, RotateCcw, Trash2, Loader2, X, FileDown, Archive, Database } from "lucide-react";
import { useExportData, useResetProgress, useDeleteAccount } from "./useSettings";

const DangerZoneSection = () => {
  const { mutate: exportData, isPending: exporting } = useExportData();
  const { mutate: resetProgress, isPending: resetting } = useResetProgress();
  const { mutate: deleteAccount, isPending: deleting } = useDeleteAccount();

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [exportDone, setExportDone] = useState(false);

  const handleExport = () => {
    exportData(undefined, {
      onSuccess: (res) => {
        const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement("a");
        a.href = url;
        a.download = `patternbook-export-${new Date().toISOString().slice(0, 10)}.json`;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setExportDone(true);
        setTimeout(() => setExportDone(false), 3000);
      },
    });
  };

  const handleReset = () => {
    resetProgress(undefined, {
      onSuccess: () => {
        setShowResetConfirm(false);
        setConfirmText("");
      },
    });
  };

  const handleDelete = () => {
    if (confirmText !== "DELETE") return;
    deleteAccount(undefined);
  };

  return (
    <div className="bg-white border border-brand-red/20 rounded-[4px] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-brand-red/15 bg-brand-red/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle size={16} className="text-brand-red" />
          <h3 className="font-serif text-[18px] font-black text-ink">Danger Zone</h3>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-brand-red/50">Irreversible Actions</p>
      </div>

      <div className="p-6 space-y-5">
        {/* ── Export Data (non-destructive, but lives here for data management) ── */}
        <div className="flex items-center justify-between p-4 border border-rule/50 rounded-[4px] bg-cream-dark/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-rule">
              <FileDown size={16} className="text-ink" />
            </div>
            <div>
              <p className="font-sans text-[13px] font-bold text-ink">Export Your Data</p>
              <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                Download all progress, notes, and activity as JSON
              </p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 border border-rule bg-white text-ink font-sans text-[11px] font-bold rounded-[4px] tracking-wide hover:border-ink transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {exporting ? <Loader2 size={13} className="animate-spin" /> : exportDone ? <Archive size={13} className="text-lime-dark" /> : <Download size={13} />}
            {exporting ? "Exporting..." : exportDone ? "Downloaded!" : "Export Data"}
          </button>
        </div>

        <div className="h-px bg-rule/50" />

        {/* ── Reset Progress ── */}
        <div className="flex items-center justify-between p-4 border border-brand-red/10 rounded-[4px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-red/5 flex items-center justify-center border border-brand-red/15">
              <RotateCcw size={16} className="text-brand-red" />
            </div>
            <div>
              <p className="font-sans text-[13px] font-bold text-brand-red">Reset All Progress</p>
              <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                Erase mastery data, streak, and all problem statuses
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-brand-red/25 bg-brand-red/5 text-brand-red font-sans text-[11px] font-bold rounded-[4px] tracking-wide hover:bg-brand-red/10 hover:border-brand-red/50 transition-all cursor-pointer shrink-0"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>

        {/* ── Delete Account ── */}
        <div className="flex items-center justify-between p-4 border border-brand-red/20 rounded-[4px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-red/10 flex items-center justify-center border border-brand-red/20">
              <Trash2 size={16} className="text-brand-red" />
            </div>
            <div>
              <p className="font-sans text-[13px] font-bold text-brand-red">Delete Account</p>
              <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                Permanently remove your account and all data
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-brand-red bg-brand-red text-white font-sans text-[11px] font-bold rounded-[4px] tracking-wide hover:bg-brand-red/90 transition-all cursor-pointer shrink-0"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* ── Reset Confirmation Modal ── */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => { setShowResetConfirm(false); setConfirmText(""); }} />
          <div className="relative w-full max-w-[400px] bg-cream grain border border-rule shadow-2xl rounded-[8px] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8">
              <button onClick={() => { setShowResetConfirm(false); setConfirmText(""); }} className="absolute top-4 right-4 p-1 hover:bg-faint rounded-full transition-colors cursor-pointer text-muted hover:text-ink">
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center mb-5">
                <Database size={22} className="text-brand-red" />
              </div>

              <h4 className="font-serif text-[24px] font-black text-ink leading-tight mb-2">Reset all progress?</h4>
              <p className="text-[13px] text-muted leading-relaxed mb-5">
                This will permanently erase everything you've built:
              </p>

              <div className="space-y-2 mb-6">
                {[
                  "All mastery scores and difficulty progress",
                  "Your current and longest streak",
                  "Every problem status (Not Started → Mastered)",
                  "All personal notes on problems",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[12px] text-ink">
                    <div className="w-1 h-1 rounded-full bg-brand-red shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="bg-brand-red/5 border border-brand-red/10 p-3 rounded-[4px] mb-5">
                <p className="font-mono text-[9px] text-brand-red uppercase tracking-wider text-center">
                  This action cannot be undone. There is no undo.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowResetConfirm(false); setConfirmText(""); }}
                  className="flex-1 bg-white border border-rule text-ink font-sans text-[12px] font-bold py-3 rounded-[4px] tracking-wide hover:bg-faint transition-all cursor-pointer"
                >
                  Keep my progress
                </button>
                <button
                  onClick={handleReset}
                  disabled={resetting}
                  className="flex-1 bg-brand-red text-white border-none font-sans text-[12px] font-bold py-3 rounded-[4px] tracking-wide hover:bg-brand-red/90 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {resetting ? <Loader2 size={14} className="animate-spin" /> : null}
                  {resetting ? "Resetting..." : "Erase everything"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => { setShowDeleteConfirm(false); setConfirmText(""); }} />
          <div className="relative w-full max-w-[440px] bg-cream grain border border-rule shadow-2xl rounded-[8px] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8">
              <button onClick={() => { setShowDeleteConfirm(false); setConfirmText(""); }} className="absolute top-4 right-4 p-1 hover:bg-faint rounded-full transition-colors cursor-pointer text-muted hover:text-ink">
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center mb-5">
                <Trash2 size={22} className="text-brand-red" />
              </div>

              <h4 className="font-serif text-[24px] font-black text-ink leading-tight mb-2">Delete your account?</h4>
              <p className="text-[13px] text-muted leading-relaxed mb-5">
                Your entire PatternBook identity will be permanently removed:
              </p>

              <div className="space-y-2 mb-5">
                {[
                  "Profile, name, and email",
                  "All progress, notes, and mastery data",
                  "Streak history and activity log",
                  "Payment history and subscription",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[12px] text-ink">
                    <div className="w-1 h-1 rounded-full bg-brand-red shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">
                  Type <span className="text-brand-red font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-white border border-rule px-4 py-3 rounded-[4px] font-mono text-[14px] text-ink uppercase tracking-widest focus:border-brand-red focus:bg-white transition-all outline-none placeholder:text-faint"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setConfirmText(""); }}
                  className="flex-1 bg-white border border-rule text-ink font-sans text-[12px] font-bold py-3 rounded-[4px] tracking-wide hover:bg-faint transition-all cursor-pointer"
                >
                  Keep my account
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting || confirmText !== "DELETE"}
                  className="flex-1 bg-brand-red text-white border-none font-sans text-[12px] font-bold py-3 rounded-[4px] tracking-wide hover:bg-brand-red/90 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : null}
                  {deleting ? "Deleting..." : "Permanently delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerZoneSection;