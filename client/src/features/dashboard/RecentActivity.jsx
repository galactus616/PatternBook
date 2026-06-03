import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_MAP = {
  SOLVED_INDEPENDENTLY: { label: 'Solved',     color: 'text-lime-dark', dot: 'bg-lime-dark' },
  SOLVED_WITH_HELP:     { label: 'With help',  color: 'text-accent',    dot: 'bg-accent' },
  ATTEMPTED:            { label: 'Attempted',  color: 'text-muted',     dot: 'bg-muted/40' },
  REVISED:              { label: 'Revised',    color: 'text-brand-red', dot: 'bg-brand-red' },
};

const RecentActivity = ({ activity = [] }) => {
  return (
    <div className="bg-white border border-rule rounded-[4px] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-rule flex items-center justify-between shrink-0 bg-cream-dark/20">
        <h3 className="font-serif text-[18px] font-black text-ink">Recent Activity</h3>
        <Link to="/problems" className="font-mono text-[9px] uppercase tracking-widest text-muted hover:text-ink transition-colors">
          All problems →
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-rule/50">
        {activity.length > 0 ? (
          activity.map((item, i) => {
            const s = STATUS_MAP[item.status] || STATUS_MAP.ATTEMPTED;
            const date = new Date(item.updatedAt);
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();
            const timeStr = isToday
              ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
              : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <div key={i} className="px-6 py-4 flex items-start gap-3.5">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[13px] font-bold text-ink truncate leading-tight">
                    {item.problem.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`font-mono text-[9px] uppercase tracking-wider ${s.color}`}>{s.label}</span>
                    {item.problem.pattern?.name && (
                      <span className="font-mono text-[9px] text-muted/60">· {item.problem.pattern.name}</span>
                    )}
                  </div>
                </div>
                <span className="font-mono text-[9px] text-muted whitespace-nowrap shrink-0 mt-0.5">{timeStr}</span>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center px-6">
            <Circle size={24} className="text-rule mb-3" />
            <p className="font-sans text-[14px] font-bold text-muted">No activity yet</p>
            <p className="font-mono text-[9px] text-muted/50 mt-1 uppercase tracking-wider">Start solving to see progress</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
