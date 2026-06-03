import React from 'react';
import { useAuth } from '../auth/useAuth';
import { Trophy, Flame, Zap, Target, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

function getRank(count) {
  if (count >= 200) return { name: 'Grandmaster', color: 'text-brand-red' };
  if (count >= 100) return { name: 'Expert',      color: 'text-accent' };
  if (count >= 50)  return { name: 'Specialist',  color: 'text-lime-dark' };
  if (count >= 20)  return { name: 'Apprentice',  color: 'text-ink' };
  return               { name: 'Novice',       color: 'text-muted' };
}

// SVG ring
function Ring({ pct }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * pct) / 100;
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#e8e4dd" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r}
          fill="none" stroke="#e63946"
          strokeWidth="8" strokeLinecap="butt"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-[18px] font-black text-ink leading-none">{pct}%</span>
        <span className="font-mono text-[7px] uppercase tracking-widest text-muted mt-0.5">mastery</span>
      </div>
    </div>
  );
}

const DashboardHero = ({ stats }) => {
  const { user } = useAuth();
  const mastery  = stats?.overall?.masteryPercentage || 0;
  const solved   = stats?.overall?.solvedCount || 0;
  const attempted = stats?.overall?.attemptedCount || 0;
  const streak   = stats?.overall?.currentStreak || 0;
  const best     = stats?.overall?.longestStreak || 0;
  const rank     = getRank(solved);

  const vitals = [
    { label: 'Solved',    val: solved,    icon: Target,   color: 'text-ink' },
    { label: 'Attempted', val: attempted, icon: BookOpen, color: 'text-muted' },
    { label: 'Streak',    val: `${streak}d`, icon: Flame, color: streak > 0 ? 'text-brand-red' : 'text-muted' },
    { label: 'Best',      val: `${best}d`,   icon: Trophy, color: 'text-muted' },
  ];

  return (
    <div className="border border-rule rounded-[4px] bg-white overflow-hidden shadow-sm">
      
      {/* ── Top: greeting + name ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] border-b border-rule">
        
        {/* Left */}
        <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-rule">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-3">
            Good {getGreeting()}
          </p>
          <h1 className="font-serif text-[52px] font-black text-ink leading-[0.95] tracking-tight mb-5">
            {user?.name?.split(' ')[0] || 'Seeker'}<em className="text-brand-red not-italic">.</em>
          </h1>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-[4px] bg-cream-dark border border-rule font-bold ${rank.color}`}>
              {rank.name}
            </span>
            {(user?.plan === 'PRO' || user?.plan === 'TEAM') && (
              <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-[4px] bg-ink text-lime border border-ink">
                <Zap size={9} className="inline mr-1" />
                Pro Member
              </span>
            )}
            <Link
              to="/problems"
              className="font-mono text-[10px] uppercase tracking-widest text-muted hover:text-ink transition-colors"
            >
              Continue practicing →
            </Link>
          </div>
        </div>

        {/* Right: ring + streak */}
        <div className="flex items-center gap-8 px-10 py-8">
          <Ring pct={mastery} />
          <div className="hidden md:flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Flame size={18} className={streak > 0 ? 'text-brand-red fill-brand-red/20' : 'text-muted'} />
              <span className="font-serif text-[32px] font-black text-ink leading-none">{streak}</span>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted">day streak</p>
            {best > 0 && (
              <p className="font-mono text-[8px] text-muted/60 mt-1">
                best: {best} days
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom: vitals ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y divide-rule md:divide-y-0">
        {vitals.map(({ label, val, icon: Icon, color }) => (
          <div key={label} className="px-7 py-5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-[4px] bg-cream-dark border border-rule flex items-center justify-center shrink-0">
              <Icon size={15} className={color} />
            </div>
            <div>
              <p className="font-serif text-[24px] font-black text-ink leading-none">{val}</p>
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHero;
