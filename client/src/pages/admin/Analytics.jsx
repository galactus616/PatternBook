import React from 'react';
import { useAdmin } from '../../hooks/useAdmin';

const Bar = ({ label, value, max, colorClass, suffix = '' }) => (
  <div className="flex items-center gap-4">
    <p className="font-sans text-[12px] font-semibold text-ink w-48 shrink-0 truncate">{label}</p>
    <div className="flex-1 h-2 bg-cream rounded-full overflow-hidden border border-rule/60">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
        style={{ width: `${Math.round((value / max) * 100)}%` }}
      />
    </div>
    <p className="font-mono text-[11px] font-bold text-ink w-12 text-right shrink-0">
      {value.toLocaleString()}{suffix}
    </p>
  </div>
);

export default function Analytics() {
  const { analytics, problems, topics } = useAdmin();

  const topProblems = [...problems].sort((a, b) => b.solved - a.solved).slice(0, 6);
  const maxSolves = topProblems[0]?.solved ?? 1;

  const sortedTopics = [...topics].sort((a, b) => b.problemCount - a.problemCount).slice(0, 6);
  const maxTopicProblems = sortedTopics[0]?.problemCount ?? 1;

  const diffData = [
    { label: 'Easy',   value: analytics.easyProblems,   pct: Math.round((analytics.easyProblems   / analytics.totalProblems) * 100), color: 'bg-lime',      dotColor: 'bg-lime'      },
    { label: 'Medium', value: analytics.mediumProblems,  pct: Math.round((analytics.mediumProblems  / analytics.totalProblems) * 100), color: 'bg-accent',    dotColor: 'bg-accent'    },
    { label: 'Hard',   value: analytics.hardProblems,    pct: Math.round((analytics.hardProblems    / analytics.totalProblems) * 100), color: 'bg-brand-red', dotColor: 'bg-brand-red' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 pb-10">

      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Insights</p>
        </div>
        <h1 className="font-serif text-[28px] font-black text-ink">Analytics</h1>
        <p className="text-muted text-sm mt-1">Hardcoded snapshot — connect to real API for live metrics</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',    value: analytics.totalUsers    },
          { label: 'Total Problems', value: analytics.totalProblems },
          { label: 'Total Solves',   value: analytics.totalSolves   },
          { label: 'Avg Solves',     value: Math.round(analytics.totalSolves / analytics.totalProblems) },
        ].map(c => (
          <div key={c.label} className="bg-white border border-rule rounded-[4px] p-6 shadow-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">{c.label}</p>
            <p className="font-serif text-[32px] font-black text-ink leading-none">{c.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Difficulty breakdown */}
        <div className="lg:col-span-4 bg-white border border-rule rounded-[4px] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Difficulty Split</p>
          </div>

          {/* Visual bar */}
          <div className="flex rounded-[4px] overflow-hidden h-4 gap-0.5 mb-6">
            {diffData.map(d => (
              <div
                key={d.label}
                className={`${d.color} transition-all duration-700`}
                style={{ width: `${d.pct}%` }}
                title={`${d.label}: ${d.value}`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-4">
            {diffData.map(d => (
              <div key={d.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${d.dotColor}`} />
                  <span className="font-mono text-[11px] text-muted uppercase tracking-wider">{d.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-ink">{d.value}</span>
                  <span className="font-mono text-[9px] text-muted/60">({d.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top topics */}
        <div className="lg:col-span-8 bg-white border border-rule rounded-[4px] p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Top Topics by Problems</p>
          </div>
          <div className="space-y-4">
            {sortedTopics.map(t => (
              <Bar key={t.id} label={t.name} value={t.problemCount} max={maxTopicProblems} colorClass="bg-ink" />
            ))}
          </div>
        </div>
      </div>

      {/* Most solved problems */}
      <div className="bg-white border border-rule rounded-[4px] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Most Solved Problems</p>
          </div>
          <p className="font-mono text-[8px] text-muted/50 uppercase tracking-widest italic">Top 6 by solve count</p>
        </div>
        <div className="space-y-4">
          {topProblems.map(p => (
            <Bar key={p.id} label={p.title} value={p.solved} max={maxSolves} colorClass="bg-brand-red" />
          ))}
        </div>
      </div>

    </div>
  );
}
