import React, { useState, useRef } from 'react';
import { Search, Bell, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth';
import AvatarDisplay from '../ui/AvatarDisplay';

const AdminHeader = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  return (
    <header className="h-[58px] bg-cream/80 backdrop-blur-md border-b border-rule flex items-center justify-between px-8 sticky top-0 z-50">
      {/* Left — search */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search admin content... (⌘K)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="bg-cream-dark/50 border border-rule/50 rounded-[4px] pl-10 pr-4 py-1.5 text-[12px] w-[300px] focus:outline-none focus:border-ink focus:bg-white transition-all placeholder:text-muted/60"
          />
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-5">
        {/* Admin badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 border border-brand-red/20 rounded-[4px] bg-brand-red/5">
          <ShieldCheck size={12} className="text-brand-red" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-brand-red font-bold">
            Admin Mode
          </span>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-rule mx-1" />

        {/* User */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-bold text-ink leading-none mb-1">{user?.name || 'Admin'}</p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-brand-red">
              {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role === 'MODERATOR' ? 'Moderator' : 'Admin'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border-2 border-ink overflow-hidden cursor-pointer shadow-sm">
            <AvatarDisplay user={user} size={36} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
