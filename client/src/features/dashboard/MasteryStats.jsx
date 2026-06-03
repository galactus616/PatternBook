import React from 'react';
import { ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const MasteryStats = ({ stats }) => {
  const diffs = stats?.difficultyStats || {};

  const cards = [
    {
      label: 'Easy',
      tag: 'Foundations',
      value: diffs.EASY?.solved || 0,
      total: diffs.EASY?.total || 0,
      icon: ShieldCheck,
      accent: 'text-lime-dark',
      bar: '#4a9c59',
      border: '#4a9c5920',
    },
    {
      label: 'Medium',
      tag: 'Core Patterns',
      value: diffs.MEDIUM?.solved || 0,
      total: diffs.MEDIUM?.total || 0,
      icon: Zap,
      accent: 'text-accent',
      bar: '#e07b39',
      border: '#e07b3920',
    },
    {
      label: 'Hard',
      tag: 'Mastery Trials',
      value: diffs.HARD?.solved || 0,
      total: diffs.HARD?.total || 0,
      icon: BarChart3,
      accent: 'text-brand-red',
      bar: '#e63946',
      border: '#e6394620',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 border border-rule rounded-[4px] overflow-hidden bg-white shadow-sm">
      {cards.map((c, i) => {
        const pct = c.total > 0 ? Math.round((c.value / c.total) * 100) : 0;
        const remaining = c.total - c.value;
        return (
          <div key={i} className={`p-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-rule' : ''}`}>
            {/* Tag + icon row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">{c.tag}</p>
                <p className={`font-serif text-[20px] font-black mt-0.5 ${c.accent}`}>{c.label}</p>
              </div>
              <div className={`w-9 h-9 rounded-[4px] border border-rule bg-cream-dark flex items-center justify-center ${c.accent}`}>
                <c.icon size={15} />
              </div>
            </div>

            {/* Main number */}
            <div className="flex items-baseline gap-1.5 mb-5">
              <span className="font-serif text-[52px] font-black text-ink leading-none tracking-tight">{pct}</span>
              <span className="font-mono text-[16px] text-muted">%</span>
            </div>

            {/* Bar */}
            <div className="h-1.5 w-full bg-rule/20 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: c.bar, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </div>
            <div className="flex justify-between">
              <span className="font-mono text-[8px] text-muted uppercase tracking-widest">{c.value} solved</span>
              <span className="font-mono text-[8px] text-muted uppercase tracking-widest">{remaining} left</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MasteryStats;
