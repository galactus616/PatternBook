import React from 'react';
import { Link } from 'react-router-dom';

const TopicMasteryList = ({ topics = [] }) => {
  const sorted = [...topics].sort((a, b) => b.percentage - a.percentage);

  const getBarColor = (pct) => {
    if (pct >= 80) return '#4a9c59';
    if (pct >= 50) return '#e07b39';
    return '#e63946';
  };

  return (
    <div className="bg-white border border-rule rounded-[4px] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-rule flex items-center justify-between shrink-0 bg-cream-dark/20">
        <h3 className="font-serif text-[18px] font-black text-ink">Topic Progress</h3>
        <Link to="/problems" className="font-mono text-[9px] uppercase tracking-widest text-muted hover:text-ink transition-colors">
          Explore →
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        {sorted.map((topic) => (
          <div key={topic.id}>
            <div className="flex items-baseline justify-between mb-1.5">
              <Link
                to={`/problems?topic=${topic.name}`}
                className="font-sans text-[12px] font-bold text-ink hover:text-brand-red transition-colors truncate max-w-[60%]"
              >
                {topic.name}
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[9px] text-muted">
                  {topic.solved ?? 0}/{topic.total ?? 0}
                </span>
                <span className="font-mono text-[10px] font-black text-ink w-9 text-right">
                  {topic.percentage}%
                </span>
              </div>
            </div>
            <div className="h-1 w-full bg-rule/20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${topic.percentage}%`,
                  backgroundColor: getBarColor(topic.percentage),
                  transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest text-center py-8">
            No topics yet
          </p>
        )}
      </div>

      <div className="px-5 py-3 border-t border-rule shrink-0 bg-cream-dark/10">
        <p className="font-mono text-[8px] text-muted uppercase tracking-widest text-center">
          {sorted.length} topics · 🟢 ≥80% · 🟠 ≥50% · 🔴 below 50%
        </p>
      </div>
    </div>
  );
};

export default TopicMasteryList;
