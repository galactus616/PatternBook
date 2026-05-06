import { Search, Bell, User, Flame } from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";
import { useDashboard } from "../../features/dashboard/useDashboard";

const Header = () => {
  const { user } = useAuth();
  const { data: stats } = useDashboard();

  const currentStreak = stats?.overall?.currentStreak || 0;

  return (
    <header className="h-[58px] bg-cream/80 backdrop-blur-md border-b border-rule flex items-center justify-between px-8 sticky top-0 z-100">
      {/* Search / Context */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" />
          <input 
            type="text" 
            placeholder="Search patterns or problems... (⌘K)"
            className="bg-cream-dark/50 border border-rule/50 rounded-[4px] pl-10 pr-4 py-1.5 text-[12px] w-[320px] focus:outline-none focus:border-ink focus:bg-white transition-all placeholder:text-muted/60"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5">
        {/* Streak Flame */}
        {currentStreak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-red/5 border border-brand-red/20 rounded-full group relative cursor-help">
            <Flame size={16} className="text-brand-red fill-brand-red animate-pulse" />
            <span className="font-mono text-[11px] font-bold text-brand-red">{currentStreak}</span>
            
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-48 p-2 bg-ink text-cream text-[9px] normal-case rounded-[4px] z-50 shadow-xl leading-relaxed text-center">
              Your <span className="text-brand-red font-bold">{currentStreak} day streak</span> is active! Next day resets at 5:30 AM.
            </div>
          </div>
        )}

        <button className="p-2 text-muted hover:text-ink hover:bg-cream-dark rounded-full transition-all cursor-pointer relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-red rounded-full border border-cream" />
        </button>

        <div className="h-8 w-px bg-rule mx-1" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-bold text-ink leading-none mb-1">{user?.name || "Developer"}</p>
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted">Pro Member</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center border border-rule overflow-hidden cursor-pointer hover:border-brand-red transition-colors">
            <User size={20} className="text-cream" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
