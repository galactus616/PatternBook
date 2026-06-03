import React, { useState, useMemo } from 'react';
import { useAdmin } from '../../features/admin/useAdmin';
import { Search, ShieldCheck, ShieldAlert, User, ChevronRight, Crown, ArrowUpRight } from 'lucide-react';
import AdminModal from '../../components/ui/AdminModal';

import UserDetailModal from '../../features/admin/components/UserDetailModal';

const ROLE_BADGE = {
  ADMIN:     { text: 'text-brand-red', bg: 'bg-brand-red/10 border-brand-red/20', icon: Crown,       label: 'Admin' },
  MODERATOR: { text: 'text-accent',    bg: 'bg-accent/10 border-accent/30',       icon: ShieldAlert, label: 'Moderator' },
  USER:      { text: 'text-muted',     bg: 'bg-cream-dark border-rule',           icon: User,        label: 'User' },
};

function PlanBadge({ plan }) {
  const styles = {
    PRO:  'bg-lime/10 text-lime-dark border-lime/30',
    TEAM: 'bg-accent/10 text-orange-700 border-accent/30',
    FREE: 'bg-cream-dark text-muted border-rule',
  };
  return (
    <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-lg border ${styles[plan] || styles.FREE}`}>
      {plan}
    </span>
  );
}

export default function Users() {
  const { users, updateUser } = useAdmin();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = useMemo(() => users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  }), [users, search, roleFilter]);

  const handleSave = (changes) => {
    updateUser(selectedUser.id, changes);
    setSelectedUser(null);
  };

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const modCount   = users.filter(u => u.role === 'MODERATOR').length;

  return (
    <div className="max-w-[1280px] mx-auto px-8 pt-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted">Management</p>
          </div>
          <h1 className="font-serif text-[36px] font-black text-ink leading-none mb-2">Users</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-sans text-[13px] text-muted">
              <span className="font-bold text-ink">{users.length}</span> registered members
            </p>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] text-brand-red bg-brand-red/10 border border-brand-red/20 px-2 py-0.5 rounded-lg">{adminCount} admins</span>
              <span className="font-mono text-[9px] text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-lg">{modCount} moderators</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="space-y-3 mb-7">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative group flex-1 min-w-[220px] max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/50 group-focus-within:text-ink transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full bg-white border border-rule rounded-xl pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-ink/40 focus:shadow-sm transition-all placeholder:text-muted/40" 
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-rule rounded-xl">
            {[
              { key: 'ALL', label: 'All', active: 'bg-ink text-cream' },
              { key: 'ADMIN', label: 'Admin', active: 'bg-brand-red text-white' },
              { key: 'MODERATOR', label: 'Moderator', active: 'bg-accent text-white' },
              { key: 'USER', label: 'User', active: 'bg-cream-dark border-rule text-muted' },
            ].map(({ key, label, active }) => (
              <button
                key={key}
                onClick={() => setRoleFilter(key)}
                className={`px-3.5 py-1.5 cursor-pointer rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all
                  ${roleFilter === key ? `${active} shadow-sm` : 'text-muted hover:text-ink'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="font-mono text-[10px] text-muted uppercase tracking-widest ml-auto">
            {filtered.length} / {users.length}
          </span>
        </div>
      </div>

      {/* ── Data Table ───────────────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="bg-white border border-rule rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/40 border-b border-rule">
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-[280px]">User</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Role</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Plan</th>
                <th className="text-left px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70">Joined</th>
                <th className="text-right px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-24">Solved</th>
                <th className="text-right px-5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted/70 w-28">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/40">
              {filtered.map((u) => {
                const badge = ROLE_BADGE[u.role] ?? ROLE_BADGE.USER;
                const RoleIcon = badge.icon;
                return (
                  <tr key={u.id} className="hover:bg-cream/60 transition-colors group/row">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ink text-cream flex items-center justify-center text-[13px] font-bold shrink-0">
                          {u.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-sans text-[13px] font-bold text-ink truncate">{u.name}</p>
                          <p className="font-mono text-[10px] text-muted truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded-lg uppercase tracking-wider border ${badge.bg} ${badge.text}`}>
                          <RoleIcon size={10} />
                          {badge.label}
                        </span>
                        {u.permissions.length > 0 && u.role === 'MODERATOR' && (
                          <span className="font-mono text-[9px] text-muted/60 ml-0.5">
                            {u.permissions.length} perms
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <PlanBadge plan={u.plan} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-[11px] text-muted">{u.joined}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono text-[14px] font-black text-ink">{u.solvedCount}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="flex items-center justify-end gap-1 ml-auto px-3 py-1.5 rounded-lg border border-rule/60 text-muted hover:text-ink hover:border-ink hover:bg-cream text-[10px] font-mono uppercase tracking-widest transition-all opacity-0 group-hover/row:opacity-100"
                      >
                        Manage <ChevronRight size={12} className="-mr-0.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-rule rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center mb-4">
            <User size={24} className="text-muted" />
          </div>
          <h3 className="font-serif text-[22px] font-black text-ink mb-1">No users found</h3>
          <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-6">There are no users matching this filter</p>
        </div>
      )}

      {selectedUser && (
        <AdminModal title={`Manage User`} onClose={() => setSelectedUser(null)} width="max-w-xl">
          <UserDetailModal user={selectedUser} onSave={handleSave} onClose={() => setSelectedUser(null)} />
        </AdminModal>
      )}
    </div>
  );
}
