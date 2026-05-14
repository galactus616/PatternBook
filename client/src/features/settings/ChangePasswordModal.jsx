import React, { useState } from "react";
import { KeyRound, X, Loader2, Eye, EyeOff } from "lucide-react";
import { useUpdateProfile } from "./useSettings";
import { useToastStore } from "../../store/useToastStore";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { addToast } = useToastStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    updateProfile(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          handleClose();
          addToast("Password changed successfully", "success");
        },
        onError: (err) => {
          setPasswordError(err.response?.data?.message || err.message || "Current password is incorrect.");
        },
      }
    );
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-ink/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={handleClose} 
      />
      
      <div className="relative w-full max-w-[400px] bg-cream grain border border-rule shadow-2xl rounded-[8px] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-ink py-6 px-8 text-center relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-cream/50 hover:text-cream cursor-pointer p-1"
          >
            <X size={18} />
          </button>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-lime/10 border border-lime/20 mb-3">
            <KeyRound size={24} className="text-lime" />
          </div>
          
          <h4 className="font-serif text-[24px] font-black text-cream leading-tight mb-1">Security</h4>
          <p className="font-mono text-[9px] text-cream/60 uppercase tracking-widest">Update your credentials</p>
        </div>

        <div className="p-6">
          {passwordError && (
            <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-[11px] p-2.5 rounded-[4px] font-sans font-bold mb-4 animate-in slide-in-from-top-1 leading-tight">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white border border-rule px-4 py-2.5 pr-10 rounded-[4px] font-sans text-[14px] text-ink focus:border-ink transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer transition-colors"
                >
                  {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-rule px-4 py-2.5 pr-10 rounded-[4px] font-sans text-[14px] text-ink focus:border-ink transition-all outline-none"
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-muted font-bold mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-rule px-4 py-2.5 pr-10 rounded-[4px] font-sans text-[14px] text-ink focus:border-ink transition-all outline-none"
                    placeholder="Repeat password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-white text-ink border border-rule font-sans text-[12px] font-bold py-2.5 rounded-[4px] hover:bg-cream-dark transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-ink text-cream font-sans text-[12px] font-bold py-2.5 rounded-[4px] hover:bg-ink-light transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                {isPending ? "Updating..." : "Save Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
