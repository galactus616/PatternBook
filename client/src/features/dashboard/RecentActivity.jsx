import React from 'react';
import { Clock, CheckCircle2, Circle, ExternalLink } from 'lucide-react';

const RecentActivity = ({ activity = [] }) => {
  return (
    <div className="bg-white border border-rule rounded-[4px] shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-rule bg-faint/30 flex items-center justify-between">
        <h3 className="font-serif text-[18px] font-black text-ink">Recent Activity</h3>
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Last 5 actions</p>
      </div>

      <div className="divide-y divide-rule/50">
        {activity.length > 0 ? (
          activity.map((item, i) => (
            <div key={i} className="px-6 py-4 hover:bg-cream-dark/20 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`
                  ${item.status === 'SOLVED_INDEPENDENTLY' ? 'text-lime-dark' : 
                    item.status === 'ATTEMPTED' ? 'text-accent' : 'text-muted'}
                `}>
                  {item.status === 'SOLVED_INDEPENDENTLY' ? <CheckCircle2 size={18} /> : 
                   item.status === 'ATTEMPTED' ? <Clock size={18} /> : <Circle size={18} />}
                </div>
                <div>
                  <h4 className="font-sans text-[14px] font-bold text-ink leading-tight group-hover:text-brand-red transition-colors">
                    {item.problem.title}
                  </h4>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-muted mt-1">
                    {item.problem.pattern?.name} · {item.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <span className="font-mono text-[9px] text-muted whitespace-nowrap">
                {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            </div>
          ))
        ) : (
          <div className="px-6 py-12 text-center text-muted italic font-serif">
            No recent activity. Start solving to see progress!
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
