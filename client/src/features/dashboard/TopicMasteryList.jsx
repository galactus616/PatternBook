import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopicMasteryList = ({ topics = [] }) => {
  return (
    <div className="bg-white border border-rule rounded-[4px] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-rule bg-cream-dark/20 flex items-center justify-between shrink-0">
        <h3 className="font-serif text-[18px] font-black text-ink">Topic Progress</h3>
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Core Path</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {topics.map((topic) => (
            <div key={topic.id} className="group relative">
              <div className="flex items-center justify-between mb-2">
                <Link
                  to={`/problems?topic=${topic.name}`}
                  className="font-sans text-[11px] font-bold text-ink hover:text-brand-red transition-colors flex items-center gap-1.5"
                >
                  <span className="truncate max-w-[100px]">{topic.name}</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                </Link>
                <span className="font-mono text-[8px] text-muted font-bold">
                  {topic.percentage}%
                </span>
              </div>
              
              <div className="relative h-1 w-full bg-rule/10 rounded-[1px] overflow-hidden">
                <div
                  className="h-full bg-ink group-hover:bg-brand-red transition-all duration-700 ease-out"
                  style={{ width: `${topic.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-6 py-3 border-t border-rule bg-faint/30">
        <p className="font-mono text-[8px] text-muted text-center uppercase tracking-widest italic">
          Scroll to view all 16 modules
        </p>
      </div>
    </div>
  );
};

export default TopicMasteryList;
