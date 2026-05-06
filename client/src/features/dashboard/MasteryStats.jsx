import React from 'react';
import { BarChart3, ShieldCheck, Zap } from 'lucide-react';

const MasteryStats = ({ stats }) => {
  const diffs = stats?.difficultyStats || {};
  
  const statCards = [
    { 
      label: "Easy Mastery", 
      value: diffs.EASY?.solved || 0, 
      total: diffs.EASY?.total || 0,
      color: "bg-lime/10 border-lime/30 text-lime-dark",
      barColor: "bg-lime-dark"
    },
    { 
      label: "Med Challenge", 
      value: diffs.MEDIUM?.solved || 0, 
      total: diffs.MEDIUM?.total || 0,
      color: "bg-accent/10 border-accent/30 text-accent",
      barColor: "bg-accent"
    },
    { 
      label: "Hard Trials", 
      value: diffs.HARD?.solved || 0, 
      total: diffs.HARD?.total || 0,
      color: "bg-brand-red/10 border-brand-red/30 text-brand-red",
      barColor: "bg-brand-red"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {statCards.map((stat, i) => (
        <div key={i} className={`p-6 border rounded-[4px] shadow-sm relative overflow-hidden bg-white`}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{stat.label}</p>
            <div className={`px-2 py-0.5 rounded-[2px] font-mono text-[9px] font-bold ${stat.color}`}>
              {stat.value}/{stat.total}
            </div>
          </div>
          
          <div className="flex items-end gap-2 mb-4">
            <h3 className="font-serif text-[32px] font-black text-ink leading-none">
              {stat.total > 0 ? Math.round((stat.value / stat.total) * 100) : 0}%
            </h3>
          </div>

          <div className="h-1.5 w-full bg-rule/20 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${stat.barColor}`} 
              style={{ width: `${stat.total > 0 ? (stat.value / stat.total) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MasteryStats;
