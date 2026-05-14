import React from 'react';
import { BarChart3, ShieldCheck, Zap } from 'lucide-react';

const MasteryStats = ({ stats }) => {
  const diffs = stats?.difficultyStats || {};
  
  const statCards = [
    { 
      label: "Easy Mastery", 
      value: diffs.EASY?.solved || 0, 
      total: diffs.EASY?.total || 0,
      icon: ShieldCheck,
      theme: "lime",
      bg: "from-lime/5 to-transparent",
      accent: "text-lime-dark",
      bar: "bg-lime-dark"
    },
    { 
      label: "Med Challenge", 
      value: diffs.MEDIUM?.solved || 0, 
      total: diffs.MEDIUM?.total || 0,
      icon: Zap,
      theme: "accent",
      bg: "from-accent/5 to-transparent",
      accent: "text-accent",
      bar: "bg-accent"
    },
    { 
      label: "Hard Trials", 
      value: diffs.HARD?.solved || 0, 
      total: diffs.HARD?.total || 0,
      icon: BarChart3,
      theme: "brand-red",
      bg: "from-brand-red/5 to-transparent",
      accent: "text-brand-red",
      bar: "bg-brand-red"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat, i) => {
        const percentage = stat.total > 0 ? Math.round((stat.value / stat.total) * 100) : 0;
        return (
          <div key={i} className={`group relative p-6 bg-white border border-rule rounded-[4px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}>
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-[4px] bg-white border border-rule shadow-sm ${stat.accent}`}>
                    <stat.icon size={14} />
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted font-bold">{stat.label}</p>
                </div>
                <span className="font-mono text-[9px] text-muted/60">{stat.value} / {stat.total}</span>
              </div>
              
              <div className="flex items-baseline gap-2 mb-6">
                <h3 className="font-serif text-[48px] font-black text-ink leading-none tracking-tight">
                  {percentage}<span className="text-[18px] opacity-20 ml-1">%</span>
                </h3>
              </div>

              <div className="space-y-2">
                <div className="h-1.5 w-full bg-rule/10 rounded-[1px] overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${stat.bar}`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                   <p className="font-mono text-[7px] uppercase tracking-widest text-muted/50">Completion</p>
                   <p className={`font-mono text-[7px] font-bold uppercase tracking-widest ${stat.accent}`}>
                     {stat.total - stat.value} Problems Left
                   </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MasteryStats;
