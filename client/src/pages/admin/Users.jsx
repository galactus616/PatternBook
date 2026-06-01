import React, { useState } from 'react';
import { useAdmin, PERMISSION_GROUPS, ALL_PERMISSIONS } from '../../hooks/useAdmin';
import { Search, ShieldCheck, ShieldAlert, User, ChevronRight, X, Crown } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';

const ROLE_BADGE = {
  ADMIN:     { cls: 'bg-brand-red/10 text-brand-red border border-brand-red/20',   icon: Crown,       label: 'Admin'       },
  MODERATOR: { cls: 'bg-accent/10 text-accent border border-accent/30',             icon: ShieldAlert, label: 'Moderator'   },
  USER:      { cls: 'bg-cream text-muted border border-rule',                        icon: User,        label: 'User'        },
};

function UserDetailModal({ user, onSave, onClose }) {
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

export default function Users() {
  const { users, updateUser } = useAdmin();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSave = (changes) => {
    updateUser(selectedUser.id, changes);
    setSelectedUser(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 pb-10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Management</p>
        </div>
        <h1 className="font-serif text-[28px] font-black text-ink">Users</h1>
        <p className="text-muted text-sm mt-1">{users.length} registered members</p>
      </div>

      <div className="bg-white border border-rule rounded-[4px] shadow-sm">
        <div className="p-6 border-b border-rule flex items-center gap-4 flex-wrap">
          <div className="relative group flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="bg-cream-dark/50 border border-rule/50 rounded-[4px] pl-9 pr-4 py-1.5 text-[12px] w-full focus:outline-none focus:border-ink focus:bg-white transition-all placeholder:text-muted/60" />
          </div>
          <div className="flex gap-1">
            {['ALL', 'ADMIN', 'MODERATOR', 'USER'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 cursor-pointer rounded-[4px] font-mono text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${roleFilter === r ? 'bg-ink text-cream' : 'bg-cream text-muted border border-rule hover:text-ink'}`}>
                {r === 'ALL' ? 'All' : r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest">{filtered.length} results</p>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule">
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">User</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Email</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Role</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Plan</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Joined</th>
              <th className="text-right px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Solved</th>
              <th className="text-right px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Manage</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const badge = ROLE_BADGE[u.role] ?? ROLE_BADGE.USER;
              const RoleIcon = badge.icon;
              return (
                <tr key={u.id} className="border-b border-rule/60 last:border-0 hover:bg-cream/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-cream text-[13px] font-bold shrink-0">
                        {u.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-sans text-[13px] font-semibold text-ink">{u.name}</p>
                        {u.permissions.length > 0 && u.role === 'MODERATOR' && (
                          <p className="font-mono text-[9px] text-muted/60">{u.permissions.length} permissions</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-muted">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-[4px] uppercase tracking-wider ${badge.cls}`}>
                      <RoleIcon size={10} />{badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${u.plan === 'PRO' ? 'text-lime-dark font-bold' : u.plan === 'TEAM' ? 'text-accent font-bold' : 'text-muted'}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px] text-muted">{u.joined}</td>
                  <td className="px-6 py-4 text-right font-mono text-[13px] font-bold text-ink">{u.solvedCount}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="flex items-center cursor-pointer gap-1 ml-auto px-3 py-1.5 rounded-[4px] border border-rule text-muted hover:text-ink hover:border-ink text-[11px] font-mono uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100"
                    >
                      Manage <ChevronRight size={11} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-12 text-center"><p className="font-mono text-[11px] text-muted uppercase tracking-widest">No users found</p></td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <AdminModal title={`Manage — ${selectedUser.name}`} onClose={() => setSelectedUser(null)} width="max-w-lg">
          <UserDetailModal user={selectedUser} onSave={handleSave} onClose={() => setSelectedUser(null)} />
        </AdminModal>
      )}
    </div>
  );
}
