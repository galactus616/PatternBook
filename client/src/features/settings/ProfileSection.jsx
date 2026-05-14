import React, { useState } from "react";
import { User, Loader2, Camera, CheckCircle2, Lock, Mail, KeyRound, Globe, X, Dices, Crown } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { useUpdateProfile } from "./useSettings";
import { useToastStore } from "../../store/useToastStore";
import AvatarDisplay from "../../components/ui/AvatarDisplay";
import { usePaymentStore } from "../../store/usePaymentStore";
import { AVATAR_STYLES, getAvatarUrl } from "../../lib/avatars";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileSection = () => {
  const { user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { addToast } = useToastStore();
  const { openCheckout } = usePaymentStore();

  const [name, setName] = useState(user?.name || "");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Determine current style from existing picture
  const initialStyle = React.useMemo(() => {
    if (!user?.picture) return AVATAR_STYLES[0];
    if (user.picture.startsWith("boring:")) {
      const styleId = user.picture.split(":")[1];
      return AVATAR_STYLES.find(s => s.id === styleId) || AVATAR_STYLES[0];
    }
    return AVATAR_STYLES[0];
  }, [user?.picture]);

  const [currentStyle, setCurrentStyle] = useState(initialStyle);
  const [randomSeed, setRandomSeed] = useState(() => {
    if (!user?.picture) return user?.email || "seeker";
    if (user.picture.startsWith("boring:")) return user.picture.split(":")[2];
    if (user.picture.startsWith("avvatar:")) return user.picture.split(":")[1];
    return user?.email || "seeker";
  });

  const isGoogleUser = user?.provider === "GOOGLE";
  const isPro = user?.plan === "PRO" || user?.plan === "TEAM";

  const handleSave = () => {
    if (!name.trim()) return;
    updateProfile({ name: name.trim() }, {
      onSuccess: () => {
        addToast("Profile updated successfully", "success");
      },
      onError: (err) => {
        addToast(err.message || "Failed to update profile", "error");
      }
    });
  };

  const handleAvatarChange = () => {
    const newPic = getAvatarUrl(currentStyle.provider, currentStyle.id, randomSeed);

    if (newPic === user?.picture) {
      setShowAvatarModal(false);
      return;
    }

    if (currentStyle.isPro && !isPro) {
      addToast("This style requires a Pro subscription", "error");
      return;
    }

    updateProfile({ picture: newPic }, {
      onSuccess: () => {
        addToast("Profile picture updated", "success");
        setShowAvatarModal(false);
      },
      onError: (err) => {
        addToast(err.message || "Failed to update picture", "error");
      }
    });
  };

  return (
    <>
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
            <div
              className="relative group cursor-pointer shrink-0"
              onClick={() => setShowAvatarModal(true)}
            >
              <div className="w-20 h-20 rounded-full bg-ink flex items-center justify-center border-2 border-ink overflow-hidden">
                <AvatarDisplay user={user} size={80} />
              </div>
              <div className="absolute inset-0 rounded-full bg-ink/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={18} className="text-cream" />
                <span className="text-[8px] text-cream font-mono uppercase tracking-widest mt-1">Change</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-sans text-[16px] font-bold text-ink leading-tight">{user?.name || "Developer"}</p>
              <p className="font-mono text-[11px] text-muted mt-1">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {isGoogleUser ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-rule rounded-[2px]">
                    <svg className="w-3 h-3" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
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
              Save Changes
            </button>
            {name !== user?.name && (
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
                <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-[2px] ${isGoogleUser ? 'bg-cream text-ink' : 'bg-faint text-muted'}`}>
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
      </div>

      {/* ── Avatar Selection Modal ── */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setShowAvatarModal(false)} />
          <div className="relative w-full max-w-[520px] bg-white border border-rule shadow-2xl rounded-[8px] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="px-6 py-4 border-b border-rule flex items-center justify-between bg-faint/30">
              <div className="flex items-center gap-3">
                <Camera size={16} className="text-ink" />
                <h3 className="font-serif text-[18px] font-black text-ink">Choose Avatar</h3>
              </div>
              <button onClick={() => setShowAvatarModal(false)} className="text-muted hover:text-ink cursor-pointer bg-white border border-rule p-1.5 rounded-[4px] hover:bg-cream-dark transition-all">
                <X size={14} />
              </button>
            </div>

            {/* Randomizer Area */}
            <div className="p-8 pb-12 bg-cream/30">
              <div className="flex flex-col md:flex-row gap-8 items-stretch">
                {/* Left: Style Selector */}
                <div className="w-full md:w-[200px] flex flex-col pt-1">
                  <p className="font-mono text-[9px] text-muted uppercase tracking-widest mb-3">Styles</p>
                  <div className="space-y-2 flex-1">
                    {AVATAR_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setCurrentStyle(style)}
                        className={`
                          w-full flex items-center justify-between px-3 py-3 rounded-[4px] border transition-all cursor-pointer group
                          ${currentStyle.id === style.id
                            ? 'bg-ink border-ink text-cream shadow-md'
                            : 'bg-white border-rule text-muted hover:border-ink hover:text-ink'}
                        `}
                      >
                        <span className="font-sans text-[12px] font-bold">{style.name}</span>
                        {style.isPro && (
                          <Crown
                            size={12}
                            className={currentStyle.id === style.id ? "text-lime" : "text-brand-red opacity-50 group-hover:opacity-100"}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Preview & Controls */}
                <div className="flex-1 flex flex-col items-center justify-between pt-1">
                  <div className="flex flex-col items-center">
                    <p className="font-mono text-[9px] text-muted uppercase tracking-widest mb-3 invisible">Preview</p>
                    <div className="relative mb-2">
                      <div className="w-32 h-32 rounded-full bg-white border-2 border-ink flex items-center justify-center overflow-hidden shadow-xl">
                        <AvatarDisplay
                          user={{
                            picture: getAvatarUrl(currentStyle.provider, currentStyle.id, randomSeed)
                          }}
                          size={128}
                        />
                      </div>
                      {currentStyle.isPro && !isPro && (
                        <div className="absolute inset-0 bg-ink/50 rounded-full flex flex-col items-center justify-center backdrop-grayscale-[0.8] backdrop-blur-[1px] group">
                          <div className="bg-lime border-2 border-ink px-3 py-1.5 rounded-[2px] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex items-center gap-2 transform -rotate-2 group-hover:rotate-0 transition-transform">
                            <Lock size={12} strokeWidth={3} className="text-ink" />
                            <span className="font-mono text-[10px] font-black text-ink uppercase tracking-tighter">Pro Locked</span>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => setRandomSeed(Math.random().toString(36).substring(7))}
                        className="absolute -bottom-2 -right-2 bg-white border border-rule text-ink p-2 rounded-full shadow-lg hover:border-ink transition-all cursor-pointer z-10"
                      >
                        <Dices size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="w-full max-w-[300px] space-y-3">
                    {currentStyle.isPro && !isPro ? (
                      <button
                        onClick={() => openCheckout("PRO")}
                        className="w-full bg-lime text-ink border-2 border-ink font-sans text-[13px] font-black py-3 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
                      >
                        <Crown size={14} />
                        Upgrade to Pro
                      </button>
                    ) : (
                      <button
                        onClick={handleAvatarChange}
                        disabled={isPending}
                        className="w-full bg-white text-ink border-2 border-ink font-sans text-[13px] font-black py-3 rounded-[4px] shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all disabled:opacity-40 hover:bg-cream-dark flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                        Save Identity
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </>
  );
};

export default ProfileSection;