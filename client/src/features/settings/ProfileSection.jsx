import React, { useState } from "react";
import { User, Loader2, Camera, CheckCircle2, Lock, Mail, KeyRound, Globe } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { useUpdateProfile } from "./useSettings";

const ProfileSection = () => {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isGoogleUser = user?.provider === "GOOGLE";

  const handleSave = () => {
    if (!name.trim()) return;
    updateProfile({ name: name.trim() }, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const handleChangePassword = (e) => {
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
          setShowPasswordModal(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: () => setPasswordError("Current password is incorrect."),
      }
    );
  };

  return (
    <div className="bg-white border border-rule rounded-[4px] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-rule bg-faint/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User size={16} className="text-ink" />
          <h3 className="font-serif text-[18px] font-black text-ink">Profile</h3>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Account Details</p>
      </div>

      <div className="p-6 space-y-7">
        {/* ── Avatar Row ── */}
        <div className="flex items-center gap-5">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-ink flex items-center justify-center border-2 border-rule overflow-hidden">
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-cream" />
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-ink/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} className="text-cream" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-sans text-[16px] font-bold text-ink leading-tight">{user?.name || "Developer"}</p>
            <p className="font-mono text-[11px] text-muted mt-1">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {isGoogleUser ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-rule rounded-[2px]">
                  <svg className="w-3 h-3" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted">Google</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-faint border border-rule rounded-[2px]">
                  <Mail size={10} className="text-muted" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted">Email</span>
                </span>
              )}
              <span className="font-mono text-[8px] text-faint">·</span>
              <span className="font-mono text-[9px] text-muted">
                Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-rule/50" />

        {/* ── Editable Fields ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink focus:border-ink focus:bg-white transition-all outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Email Address</label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full bg-faint/30 border border-rule/50 px-4 py-3 rounded-[4px] font-sans text-[14px] text-muted cursor-not-allowed"
              />
              <Lock size={12} className="text-faint shrink-0" />
            </div>
          </div>
        </div>

        {/* Save Row */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isPending || name === user?.name}
            className="bg-ink text-cream font-sans text-[12px] font-bold py-2.5 px-6 rounded-[4px] tracking-wide hover:bg-ink-light transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {saved && <CheckCircle2 size={14} className="text-lime" />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
          {name !== user?.name && !saved && (
            <span className="font-mono text-[9px] text-brand-red uppercase tracking-wider">Unsaved changes</span>
          )}
        </div>

        <div className="h-px bg-rule/50" />

        {/* ── Security Sub-section ── */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Security</p>
          <div className="space-y-4">
            {/* Connected Account */}
            <div className="flex items-center justify-between p-4 bg-cream-dark/50 border border-rule/50 rounded-[4px]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-rule">
                  {isGoogleUser ? <Globe size={14} className="text-ink" /> : <Mail size={14} className="text-ink" />}
                </div>
                <div>
                  <p className="font-sans text-[13px] font-bold text-ink">Connected Account</p>
                  <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                    {isGoogleUser ? "Google SSO — password managed by Google" : "Email & Password authentication"}
                  </p>
                </div>
              </div>
              <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-[2px] ${
                isGoogleUser ? 'bg-cream text-ink' : 'bg-faint text-muted'
              }`}>
                {isGoogleUser ? 'Google' : 'Email'}
              </span>
            </div>

            {/* Change Password — only for email users */}
            {!isGoogleUser && (
              <div className="flex items-center justify-between p-4 bg-cream-dark/50 border border-rule/50 rounded-[4px]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-rule">
                    <KeyRound size={14} className="text-ink" />
                  </div>
                  <div>
                    <p className="font-sans text-[13px] font-bold text-ink">Password</p>
                    <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                      Last changed · minimum 8 characters
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="font-mono text-[10px] uppercase tracking-wider text-ink hover:text-brand-red transition-colors cursor-pointer bg-transparent border border-rule px-3 py-1.5 rounded-[4px] hover:border-brand-red"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Change Password Modal ── */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
          <div className="relative w-full max-w-[400px] bg-cream grain border border-rule shadow-2xl rounded-[8px] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center">
                  <KeyRound size={18} className="text-cream" />
                </div>
                <div>
                  <h4 className="font-serif text-[22px] font-black text-ink leading-tight">Change Password</h4>
                  <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">Update your credentials</p>
                </div>
              </div>

              {passwordError && (
                <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-[12px] p-3 rounded-[4px] font-sans mb-4">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink focus:border-ink focus:bg-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink focus:border-ink focus:bg-white transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-muted mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/50 border border-rule px-4 py-3 rounded-[4px] font-sans text-[14px] text-ink focus:border-ink focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowPasswordModal(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setPasswordError(""); }}
                    className="flex-1 bg-white border border-rule text-ink font-sans text-[12px] font-bold py-3 rounded-[4px] tracking-wide hover:bg-faint transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-ink text-cream border-none font-sans text-[12px] font-bold py-3 rounded-[4px] tracking-wide hover:bg-ink-light transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                    {isPending ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;