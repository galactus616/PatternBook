import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Layers, Network, Code2,
  Users, BarChart3, ChevronRight, ShieldCheck,
  LogOut, CreditCard, Tag,
} from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth';
import AvatarDisplay from '../ui/AvatarDisplay';

const navItems = [
  { name: 'Dashboard', path: '/admin',            icon: LayoutDashboard, end: true },
  { name: 'Topics',    path: '/admin/topics',      icon: BookOpen   },
  { name: 'Patterns',  path: '/admin/patterns',    icon: Layers     },
  { name: 'Sub-Patterns', path: '/admin/sub-patterns', icon: Network },
  { name: 'Problems',  path: '/admin/problems',    icon: Code2      },
  { name: 'Users',     path: '/admin/users',       icon: Users      },
  { name: 'Payments',  path: '/admin/payments',    icon: CreditCard },
  { name: 'Coupons',   path: '/admin/coupons',     icon: Tag        },
];

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="w-[280px] h-screen bg-cream border-r border-rule flex flex-col sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="h-[58px] border-b border-rule flex items-center px-8 shrink-0 gap-2">
        <div className="font-serif text-[20px] font-black tracking-tight select-none flex items-center gap-1.5">
          <span>Pattern<em className="text-brand-red italic">Book</em></span>
        </div>
        <span className="ml-1 flex items-center gap-1 font-mono text-[7px] border border-brand-red/40 text-brand-red px-1.5 py-0.5 rounded-[2px] tracking-widest uppercase leading-none opacity-90">
          <ShieldCheck size={8} />
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-4 space-y-0.5 overflow-y-auto">
        <div className="px-4 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Admin Panel</p>
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `
              group flex items-center gap-3 px-4 py-2.5 rounded-[4px] transition-all duration-200 cursor-pointer
              ${isActive
                ? 'bg-ink text-cream shadow-lg shadow-ink/10'
                : 'text-muted hover:text-ink hover:bg-cream-dark'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={16} className={isActive ? 'text-lime' : ''} />
                <span className="font-sans text-[13px] font-semibold tracking-wide flex-1">{item.name}</span>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-1 h-1 rounded-full bg-brand-red" />
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-4 pb-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[4px] text-muted hover:text-ink hover:bg-cream-dark transition-all duration-200 cursor-pointer text-[13px] font-semibold font-sans"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Profile card */}
      <div className="border-t border-rule p-4">
        <div className="w-full flex items-center gap-3 p-3 rounded-[6px] border border-transparent hover:bg-cream-dark hover:border-rule/40 transition-all duration-200 cursor-pointer group">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-rule/40 shrink-0 bg-white flex items-center justify-center">
            <AvatarDisplay user={user} size={36} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-sans text-[12px] font-bold text-ink truncate leading-tight">
                {user?.name?.split(' ')[0] || 'Admin'}
              </p>
              <span className="flex items-center gap-0.5 bg-brand-red/10 text-brand-red font-mono text-[6px] px-1 py-0.5 rounded-[2px] uppercase tracking-wider shrink-0 border border-brand-red/20">
                <ShieldCheck size={7} />
                Admin
              </span>
            </div>
            <p className="font-mono text-[8px] text-muted/60 uppercase tracking-widest mt-0.5 truncate">
              {user?.email ?? 'admin@patternbook.io'}
            </p>
          </div>
          <ChevronRight size={13} className="text-muted/40 shrink-0 group-hover:text-ink/60 group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
