import React from 'react';
import { useAuth } from '../auth/useAuth';
import { Trophy, Target, Zap } from 'lucide-react';

const DashboardHero = ({ stats }) => {
  const { user } = useAuth();

  const masteryPercentage = stats?.overall?.masteryPercentage || 0;

  // Dynamic rank based on solved problems
  const getRank = (count) => {
    if (count >= 50) return { name: "Grandmaster", color: "text-brand-red" };
    if (count >= 20) return { name: "Specialist", color: "text-accent" };
    return { name: "Novice", color: "text-muted" };
  };

  const rank = getRank(stats?.overall?.solvedCount || 0);

  return (
    <div className="relative mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {(user?.plan === "PRO" || user?.plan === "TEAM") ? (
              <span className="px-2 py-1 bg-ink text-cream font-mono text-[10px] uppercase tracking-widest rounded-[2px] flex items-center gap-1.5 border border-cream/10">
                <Zap size={10} className="text-cream" />
                Pro Member
              </span>
            ) : (
              <span className="px-2 py-1 bg-ink text-lime font-mono text-[10px] uppercase tracking-widest rounded-[2px]">
                Active Session
              </span>
            )}
            <div className="flex items-center gap-1.5 text-ink font-mono text-[10px] uppercase tracking-widest group relative">
              <Zap size={12} className="text-brand-red fill-brand-red animate-pulse" />
              Day {stats?.overall?.currentStreak || 0} Streak

              {/* 5:30 AM Boundary Info */}
              <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-56 p-2 bg-ink text-cream text-[9px] normal-case rounded-[4px] z-50 shadow-xl leading-relaxed">
                Our "day" ends at <span className="font-mono text-lime font-bold">5:30 AM</span>.<br/> Solve or attempt a problem daily to keep your Streak alive!
              </div>
            </div>
            {stats?.overall?.longestStreak > 0 && (
              <div className="flex items-center gap-1.5 text-muted font-mono text-[10px] uppercase tracking-widest border-l border-rule pl-3">
                <Trophy size={10} className="text-muted" />
                Best: {stats?.overall?.longestStreak}
              </div>
            )}
          </div>

          <h1 className="font-serif text-[48px] font-black text-ink leading-[1.1]">
            Welcome back, <br />
            <em className="text-brand-red italic">{user?.name?.split(' ')[0] || "Seeker"}</em>.
          </h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy size={16} className={rank.color} />
              <p className="font-mono text-[12px] uppercase tracking-tight font-bold text-ink">
                Rank: <span className={rank.color}>{rank.name}</span>
              </p>
            </div>
            <div className="w-px h-4 bg-rule" />
            <div className="flex items-center gap-2 text-muted">
              <Target size={16} />
              <p className="font-mono text-[12px] uppercase tracking-tight font-bold">
                {stats?.overall?.solvedCount || 0} Problems Mastered
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Disk */}
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              className="fill-none stroke-rule/20 stroke-[8px]"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              className="fill-none stroke-brand-red stroke-[8px] transition-all duration-1000 ease-out"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * masteryPercentage) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-serif text-[28px] font-black text-ink leading-none">{masteryPercentage}%</span>
            <span className="font-mono text-[8px] uppercase tracking-widest text-muted mt-1">Mastery</span>
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute -bottom-6 left-0 w-full h-px bg-rule/50" />
    </div>
  );
};

export default DashboardHero;
