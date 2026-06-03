import React, { useState } from 'react';
import { PERMISSION_GROUPS, ALL_PERMISSIONS } from '../useAdmin';

export default function UserDetailModal({ user, onSave, onClose }) {
  const [role, setRole] = useState(user.role);
  const [permissions, setPermissions] = useState([...user.permissions]);
  const [plan, setPlan] = useState(user.plan);

  const togglePerm = (perm) => {
    setPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const toggleAllGroup = (perms) => {
    const allSet = perms.every(p => permissions.includes(p));
    if (allSet) setPermissions(prev => prev.filter(p => !perms.includes(p)));
    else setPermissions(prev => [...new Set([...prev, ...perms])]);
  };

  return (
    <div className="space-y-6">
      {/* User info */}
      <div className="flex items-center gap-3 p-4 rounded-[4px] bg-cream border border-rule">
        <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-cream text-sm font-bold shrink-0">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <p className="font-sans text-[14px] font-bold text-ink">{user.name}</p>
          <p className="font-mono text-[10px] text-muted">{user.email}</p>
        </div>
        <div className="ml-auto font-mono text-[9px] text-muted">Joined {user.joined}</div>
      </div>

      {/* Role */}
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-2">Role</label>
        <div className="flex gap-2">
          {['USER', 'MODERATOR'].map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              disabled={user.role === 'ADMIN'}
              className={`flex-1 cursor-pointer py-2 rounded-[4px] font-mono text-[10px] uppercase tracking-widest border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                role === r ? 'bg-ink text-cream border-ink' : 'bg-cream text-muted border-rule hover:text-ink'
              }`}
            >
              {r === 'USER' ? '👤 User' : '🛡️ Moderator'}
            </button>
          ))}
        </div>
        {user.role === 'ADMIN' && (
          <p className="font-mono text-[9px] text-muted mt-1">Admin role cannot be changed.</p>
        )}
      </div>

      {/* Plan override */}
      <div>
        <label className="font-mono text-[10px] uppercase tracking-widest text-muted block mb-2">Plan Override</label>
        <div className="flex gap-2">
          {['FREE', 'PRO', 'TEAM'].map(p => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`flex-1 cursor-pointer py-2 rounded-[4px] font-mono text-[10px] uppercase tracking-widest border transition-all ${
                plan === p ? 'bg-ink text-cream border-ink' : 'bg-cream text-muted border-rule hover:text-ink'
              }`}
            >
              {p === 'PRO' ? '⚡ Pro' : p === 'TEAM' ? '🏢 Team' : '🆓 Free'}
            </button>
          ))}
        </div>
      </div>

      {/* Permissions — only shown for moderators */}
      {role === 'MODERATOR' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted">Permissions</label>
            <div className="flex gap-2">
              <button onClick={() => setPermissions(ALL_PERMISSIONS)} className="font-mono cursor-pointer text-[9px] text-muted hover:text-ink uppercase tracking-widest transition-all">Grant All</button>
              <span className="text-muted/40">·</span>
              <button onClick={() => setPermissions([])} className="font-mono cursor-pointer text-[9px] text-muted hover:text-brand-red uppercase tracking-widest transition-all">Revoke All</button>
            </div>
          </div>

          <div className="space-y-3 border border-rule rounded-[4px] p-4 bg-cream/50">
            {PERMISSION_GROUPS.map(({ group, perms }) => (
              <div key={group}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-muted">{group}</span>
                  <button
                    onClick={() => toggleAllGroup(perms)}
                    className="font-mono cursor-pointer text-[8px] text-muted/60 hover:text-ink transition-all uppercase tracking-widest"
                  >
                    {perms.every(p => permissions.includes(p)) ? 'Deselect all' : 'Select all'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {perms.map(perm => {
                    const label = perm.split(':')[1];
                    const isOn = permissions.includes(perm);
                    return (
                      <button
                        key={perm}
                        onClick={() => togglePerm(perm)}
                        className={`px-2.5 cursor-pointer py-1 rounded-[4px] font-mono text-[10px] uppercase tracking-widest border transition-all ${
                          isOn ? 'bg-ink text-cream border-ink' : 'bg-white text-muted border-rule hover:text-ink'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save */}
      <div className="flex gap-2">
        <button
          onClick={() => onSave({ role, permissions: role === 'MODERATOR' ? permissions : [], plan })}
          className="flex-1 cursor-pointer bg-ink text-cream rounded-[4px] py-2 text-[13px] font-semibold hover:bg-ink/90 transition-all"
        >
          Save Changes
        </button>
        <button onClick={onClose} className="px-4 py-2 cursor-pointer rounded-[4px] border border-rule text-muted hover:text-ink text-[13px] transition-all">Cancel</button>
      </div>
    </div>
  );
}
