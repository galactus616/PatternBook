import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Trophy,
  Settings,
  LogOut,
  BookOpen,
  Target
} from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, disabled: false },
    { name: "Problems", path: "/problems", icon: Database, disabled: false },
    { name: "Roadmap", path: "/roadmap", icon: Target, disabled: true },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy, disabled: true },
    { name: "Resources", path: "/resources", icon: BookOpen, disabled: true },
    { name: "Settings", path: "/settings", icon: Settings, disabled: true },
  ];

  return (
    <aside className="w-[280px] h-screen bg-cream border-r border-rule flex flex-col sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="h-[58px] border-b border-rule flex items-center px-8 shrink-0">
        <div className="font-serif text-[20px] font-black tracking-tight select-none">
          Pattern<em className="text-brand-red italic">Book</em>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
        <div className="px-4 mb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Main Menu</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.disabled ? "#" : item.path}
            onClick={(e) => {
              if (item.disabled) e.preventDefault();
            }}
            className={({ isActive }) => `
              group flex items-center gap-3 px-4 py-3 rounded-[4px] transition-all duration-200
              ${item.disabled 
                ? "opacity-40 cursor-not-allowed text-muted grayscale" 
                : isActive
                  ? "bg-ink text-cream shadow-lg shadow-ink/10"
                  : "text-muted hover:text-ink hover:bg-cream-dark cursor-pointer"}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={isActive && !item.disabled ? "text-lime" : ""} />
                <span className="font-sans text-[13px] font-semibold tracking-wide flex-1">{item.name}</span>
                
                {item.disabled ? (
                  <span className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 border border-rule/50 rounded-[2px]">
                    Soon
                  </span>
                ) : (
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-1 h-1 rounded-full bg-brand-red" />
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="mt-auto border-t border-rule p-4">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-muted hover:text-brand-red hover:bg-brand-red/5 rounded-[4px] transition-all duration-200 group cursor-pointer"
        >
          <LogOut size={18} />
          <span className="font-sans text-[13px] font-semibold tracking-wide">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
