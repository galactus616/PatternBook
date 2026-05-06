import React, { useState } from 'react';
import TopicSelector from '../features/problems/TopicSelector';
import Filters from '../features/problems/Filters';
import ProblemsTable from '../features/problems/ProblemsTable';
import { useProblems } from '../features/problems/useProblems';

const ProblemsPage = () => {
  const [filters, setFilters] = useState({
    topic: "Arrays",
    difficulty: "",
    priority: "",
    pattern: ""
  });

  const { data: allProblems, isLoading } = useProblems({ topic: filters.topic });

  // Frontend Filtering Logic
  const problems = React.useMemo(() => {
    if (!allProblems) return [];
    
    return allProblems.filter(prob => {
      const matchDifficulty = !filters.difficulty || prob.difficulty === filters.difficulty;
      const matchPriority = !filters.priority || prob.priority === filters.priority;
      return matchDifficulty && matchPriority;
    });
  }, [allProblems, filters.difficulty, filters.priority]);

  return (
    <div className="space-y-2">
      {/* Page Title & Stats */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-1">Catalog</p>
          <h1 className="font-serif text-[40px] font-black text-ink leading-none">
            The <em className="text-brand-red italic">Mastery</em> Track.
          </h1>
        </div>
        <div className="text-right">
          <p className="font-mono text-[24px] font-bold text-ink leading-none">{problems?.length || 0}</p>
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted mt-1">Problems in path</p>
        </div>
      </div>

      {/* Topic Selection */}
      <TopicSelector 
        selectedTopic={filters.topic} 
        onSelectTopic={(topic) => setFilters({ ...filters, topic })} 
      />

      {/* Global Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      <div className="mt-8">
        <ProblemsTable problems={problems} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ProblemsPage;

