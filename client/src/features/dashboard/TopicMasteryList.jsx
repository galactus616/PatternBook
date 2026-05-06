import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopicMasteryList = ({ topics = [] }) => {
  return (
    <div className="bg-white border border-rule rounded-[4px] shadow-sm overflow-hidden h-full">
      <div className="px-6 py-4 border-b border-rule bg-faint/30 flex items-center justify-between">
        <h3 className="font-serif text-[18px] font-black text-ink">Topic Progress</h3>
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted">By Category</p>
      </div>

      <div className="p-6 space-y-6">
        {topics.map((topic, i) => (
          <div key={topic.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Link 
                to={`/problems?topic=${topic.name}`}
                className="font-sans text-[13px] font-bold text-ink hover:text-brand-red transition-colors flex items-center gap-1"
              >
                {topic.name} <ChevronRight size={14} />
              </Link>
              <span className="font-mono text-[10px] text-muted">
                {topic.solvedProblems}/{topic.totalProblems}
              </span>
            </div>
            <div className="h-1.5 w-full bg-rule/10 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-ink transition-all duration-700`} 
                style={{ width: `${topic.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicMasteryList;
