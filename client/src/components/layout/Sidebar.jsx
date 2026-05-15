import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  Trophy,
  Settings,
  BookOpen,
  Target,
  Zap,
  ChevronRight,
  Users
} from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";
import { usePaymentStore } from "../../store/usePaymentStore";
import AvatarDisplay from "../ui/AvatarDisplay";


const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, disabled: false },
    { name: "Problems", path: "/problems", icon: Database, disabled: false },
    { name: "Roadmap", path: "/roadmap", icon: Target, disabled: true },
    { name: "Leaderboard", path: "/leaderboard", icon: Trophy, disabled: true },
    { name: "Friends", path: "/friends", icon: Users, disabled: false },
    { name: "Resources", path: "/resources", icon: BookOpen, disabled: true },
    { name: "Settings", path: "/settings", icon: Settings, disabled: false },
  ];

  return (
    <aside className="w-[280px] h-screen bg-cream border-r border-rule flex flex-col sticky top-0 overflow-hidden">
      {/* Logo */}
      <div className="h-[58px] border-b border-rule flex items-center px-8 shrink-0">
        <div className="font-serif text-[20px] font-black tracking-tight select-none flex items-center gap-1.5">
          <span>Pattern<em className="text-brand-red italic">Book</em></span>
          <span className="font-mono text-[7px] border border-brand-red/30 text-brand-red px-1 py-0.5 rounded-[2px] tracking-widest uppercase leading-none -translate-y-1.5 opacity-80">Beta</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
        <div className="px-4 mb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Main Menu</p>
        </div>
        {navItems.map((item) => {
          const isItemActive = (path) => {
            if (item.path === "/friends") {
              return path.startsWith("/friends") || path.startsWith("/u/");
            }
            return path === item.path;
          };

          return (
            <NavLink
              key={item.name}
              to={item.disabled ? "#" : item.path}
              onClick={(e) => { if (item.disabled) e.preventDefault(); }}
              className={({ isActive }) => {
                const active = isItemActive(window.location.pathname);
                return `
                  group flex items-center gap-3 px-4 py-3 rounded-[4px] transition-all duration-200
                  ${item.disabled
                    ? "opacity-40 cursor-not-allowed text-muted grayscale"
                    : active
                      ? "bg-ink text-cream shadow-lg shadow-ink/10"
                      : "text-muted hover:text-ink hover:bg-cream-dark cursor-pointer"}
                `;
              }}
            >
              {({ isActive }) => {
                const active = isItemActive(window.location.pathname);
                return (
                  <>
                    <item.icon size={18} className={active && !item.disabled ? "text-lime" : ""} />
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
                );
              }}
            </NavLink>
          );
        })}
      </nav>

      {/* Upgrade CTA (for FREE plan users) */}
      {user?.plan !== "PRO" && user?.plan !== "TEAM" && (
        <div className="px-4 pb-3">
          <button
            onClick={() => usePaymentStore.getState().openCheckout("PRO")}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-lime text-lime-dark rounded-[4px] font-sans text-[12px] font-bold tracking-wide hover:bg-lime-light transition-all duration-200 cursor-pointer"
          >
            ⚡ Upgrade to Pro
          </button>
        </div>
      )}

      {/* Profile Card — replaces Sign Out at bottom */}
      <div className="border-t border-rule p-4">
        <NavLink
          to="/profile"
          className={({ isActive }) => `
            w-full flex items-center gap-3 p-3 rounded-[6px] transition-all duration-200 cursor-pointer group
            ${isActive ? "bg-ink/6 border border-rule/60" : "hover:bg-cream-dark border border-transparent hover:border-rule/40"}
          `}
        >
          {({ isActive }) => (
            <>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-rule/40 shrink-0 bg-white flex items-center justify-center">
                <AvatarDisplay user={user} size={36} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-sans text-[12px] font-bold text-ink truncate leading-tight">
                    {user?.name?.split(" ")[0] || "Seeker"}
                  </p>
                  {(user?.plan === "PRO" || user?.plan === "TEAM") && (
                    <span className="flex items-center gap-0.5 bg-ink text-lime font-mono text-[6px] px-1 py-0.5 rounded-[2px] uppercase tracking-wider shrink-0">
                      <Zap size={7} /> Pro
                    </span>
                  )}
                </div>
                <p className="font-mono text-[8px] text-muted/60 uppercase tracking-widest mt-0.5 truncate">
                  {user?.username ? `@${user.username}` : "View Profile"}
                </p>
              </div>
              <ChevronRight size={13} className={`text-muted/40 shrink-0 transition-all duration-200 ${isActive ? "text-ink/60" : "group-hover:text-ink/60 group-hover:translate-x-0.5"}`} />
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;



