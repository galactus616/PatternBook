import React from "react";
import { ChevronDown, Filter } from "lucide-react";

const Filters = ({ filters, setFilters }) => {
  const difficulties = ["EASY", "MEDIUM", "HARD"];
  const priorities = ["MUST_DO", "GOOD", "OPTIONAL"];

  return (
    <div className="flex flex-wrap items-center gap-4 py-4 border-y border-rule/50 my-6">
      <div className="flex items-center gap-2 text-muted mr-2">
        <Filter size={14} />
        <span className="font-mono text-[10px] uppercase tracking-widest">Quick Filters</span>
      </div>

      {/* Difficulty */}
      <div className="flex gap-2">
        {difficulties.map((diff) => (
          <button
            key={diff}
            onClick={() => setFilters({ ...filters, difficulty: filters.difficulty === diff ? "" : diff })}
            className={`
              px-3 py-1 rounded-[2px] border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer
              ${filters.difficulty === diff
                ? "bg-ink text-cream border-ink"
                : "bg-transparent text-muted border-rule hover:border-ink hover:text-ink"}
            `}
          >
            {diff}
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-rule mx-2" />

      {/* Priority */}
      <div className="flex gap-2">
        {priorities.map((prio) => (
          <button
            key={prio}
            onClick={() => setFilters({ ...filters, priority: filters.priority === prio ? "" : prio })}
            className={`
              px-3 py-1 rounded-[2px] border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer
              ${filters.priority === prio
                ? "bg-brand-red text-white border-brand-red shadow-sm"
                : "bg-transparent text-muted border-rule hover:border-ink hover:text-ink"}
            `}
          >
            {prio.replace("_", " ")}
          </button>
        ))}
      </div>

      <button 
        onClick={() => setFilters({ topic: filters.topic, difficulty: "", priority: "", pattern: "" })}
        className="ml-auto font-mono text-[9px] uppercase tracking-wider text-muted hover:text-brand-red transition-colors cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default Filters;
