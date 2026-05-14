import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import TopicSelector from '../features/problems/TopicSelector';
import Filters from '../features/problems/Filters';
import ProblemsTable from '../features/problems/ProblemsTable';
import { useProblems } from '../features/problems/useProblems';

const ProblemsPage = () => {
  const [filters, setFilters] = useState({
    topic: localStorage.getItem("defaultTopic")?.toLowerCase() || "arrays",
    difficulty: "",
    priority: "",
    pattern: ""
  });

  const { data: allProblems, isLoading } = useProblems({ topic: filters.topic });

  // Extract unique pattern names from loaded problems
  const patterns = React.useMemo(() => {
    if (!allProblems) return [];
    const set = new Set();
    allProblems.forEach(p => { if (p.pattern?.name) set.add(p.pattern.name); });
    return [...set].sort();
  }, [allProblems]);

  // Frontend Filtering Logic
  const problems = React.useMemo(() => {
    if (!allProblems) return [];
    
    return allProblems.filter(prob => {
      const matchDifficulty = !filters.difficulty || prob.difficulty === filters.difficulty;
      const matchPriority = !filters.priority || prob.priority === filters.priority;
      const matchPattern = !filters.pattern || prob.pattern?.name === filters.pattern;
      return matchDifficulty && matchPriority && matchPattern;
    });
  }, [allProblems, filters.difficulty, filters.priority, filters.pattern]);

  // Mastery stats for current topic
  const mastered = allProblems?.filter(p => p.progress?.[0]?.status === 'SOLVED_INDEPENDENTLY').length || 0;
  const total = allProblems?.length || 0;
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div className="pb-10">
      {/* Title & Stats */}
      <div className="max-w-[1200px] mx-auto pt-8 px-8 mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Catalog</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 className="font-serif text-[32px] md:text-[40px] font-black text-ink leading-none">
            The <em className="text-brand-red italic">Mastery</em> Track.
          </h1>
          <div className="md:text-right flex items-center md:block gap-4">
            <div className="flex items-center gap-2 md:justify-end mb-1">
              <CheckCircle2 size={16} className="text-lime-dark" />
              <span className="font-mono text-[16px] md:text-[24px] font-bold text-ink leading-none">{mastered}/{total}</span>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-muted hidden md:block">Mastered in {filters.topic}</p>
          </div>
        </div>
      </div>

      {/* Sticky Header Full Width */}
      <div className="sticky top-0 z-50 w-full bg-cream/95 backdrop-blur-sm border-y border-rule shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-8 py-2.5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <TopicSelector
            selectedTopic={filters.topic}
            onSelectTopic={(topic) => setFilters({ ...filters, topic, pattern: "" })}
          />
          <div className="w-full md:w-auto flex md:justify-end">
            <Filters filters={filters} setFilters={setFilters} patterns={patterns} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-8 pt-6 min-w-0">
        {/* Context line: active pattern */}
        {filters.pattern && (
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted/40">Filtered to</span>
            <span className="px-2 py-[2px] rounded-[2px] bg-ink text-lime font-mono text-[9px] font-bold uppercase tracking-wider">
              {filters.pattern}
            </span>
            <span className="font-mono text-[9px] text-muted/40">
              — {problems?.length || 0} problem{problems?.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <ProblemsTable problems={problems} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ProblemsPage;