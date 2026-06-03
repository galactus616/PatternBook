import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Layers, Network, Code2,
  Users, ShieldCheck, LogOut, CreditCard, Tag,
} from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth';

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

      {/* Bottom: sign out */}
      <div className="border-t border-rule p-4 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-brand-red/70 hover:text-brand-red hover:bg-brand-red/5 border border-transparent hover:border-brand-red/15 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={14} />
          <span className="font-sans text-[13px] font-semibold tracking-wide">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
