import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";

const Filters = ({ filters, setFilters, patterns = [] }) => {
  const difficulties = ["EASY", "MEDIUM", "HARD"];
  const priorities = ["MUST_DO", "GOOD", "OPTIONAL"];
  const [patternOpen, setPatternOpen] = useState(false);
  const patternRef = useRef(null);

  useEffect(() => {
    if (!patternOpen) return;
    const handler = (e) => {
      if (patternRef.current && !patternRef.current.contains(e.target)) setPatternOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [patternOpen]);

  const hasActive = filters.difficulty || filters.priority || filters.pattern;

  return (
    <div className="flex items-center gap-3 lg:gap-4 w-max">
      {/* Difficulty Group */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted/50 w-7">Diff</span>
        <div className="flex items-center bg-white border border-rule/60 rounded-[2px] p-[2px]">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setFilters({ ...filters, difficulty: filters.difficulty === diff ? "" : diff })}
              className={`
                px-2 py-1 rounded-[1px] font-mono text-[9px] font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer
                ${filters.difficulty === diff
                  ? "bg-ink text-cream"
                  : "text-muted hover:text-ink hover:bg-ink/4"}
              `}
            >
              {diff.charAt(0)}
            </button>
          ))}
        </div>
      </div>

      <div className="w-px h-3 bg-rule/50" />

      {/* Priority Group */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted/50 w-6">Pri</span>
        <div className="flex items-center bg-white border border-rule/60 rounded-[2px] p-[2px]">
          {priorities.map((prio) => (
            <button
              key={prio}
              onClick={() => setFilters({ ...filters, priority: filters.priority === prio ? "" : prio })}
              className={`
                px-2 py-1 rounded-[1px] font-mono text-[9px] font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer
                ${filters.priority === prio
                  ? "bg-brand-red text-white"
                  : "text-muted hover:text-ink hover:bg-ink/4"}
              `}
            >
              {prio === "MUST_DO" ? "Must" : prio === "GOOD" ? "Good" : "Opt"}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Dropdown */}
      <div className="flex items-center">
        <div className="w-px h-3 bg-rule/50" />
        <div className="relative ml-3 lg:ml-4" ref={patternRef}>
          <button
            onClick={() => patterns.length > 0 && setPatternOpen(!patternOpen)}
            disabled={patterns.length === 0}
            className={`
              flex items-center justify-between px-2.5 py-1.5 w-[130px] rounded-[2px] font-mono text-[9px] font-bold uppercase tracking-wider transition-colors duration-150 border
              ${patterns.length === 0 
                ? "bg-cream text-muted/40 border-rule/40 cursor-not-allowed" 
                : filters.pattern
                  ? "bg-ink text-lime border-ink cursor-pointer"
                  : "bg-white text-muted border-rule/60 hover:border-ink hover:text-ink cursor-pointer"}
            `}
          >
            <span className="truncate text-left flex-1 pr-1">
              {filters.pattern || "Pattern"}
            </span>
            <ChevronDown size={10} className={`shrink-0 transition-transform duration-150 ${patternOpen ? "rotate-180" : ""}`} />
          </button>

          {patternOpen && patterns.length > 0 && (
            <div className="absolute top-full left-0 md:right-0 md:left-auto mt-1 w-52 bg-white border border-rule/80 shadow-lg rounded-[2px] z-50 py-1 max-h-[260px] overflow-y-auto no-scrollbar">
              <button
                 onClick={() => {
                   setFilters({ ...filters, pattern: "" });
                   setPatternOpen(false);
                 }}
                 className={`
                   w-full text-left px-3 py-1.5 font-mono text-[9px] tracking-wider transition-colors cursor-pointer
                   ${!filters.pattern ? "bg-ink/4 text-ink font-bold" : "text-muted hover:text-ink hover:bg-cream-dark"}
                 `}
              >
                ALL PATTERNS
              </button>
              <div className="h-px w-full bg-rule/30 my-1" />
              {patterns.map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => {
                    setFilters({ ...filters, pattern: filters.pattern === pattern ? "" : pattern });
                    setPatternOpen(false);
                  }}
                  className={`
                    w-full text-left px-3 py-1.5 font-mono text-[9px] tracking-wider transition-colors cursor-pointer flex items-center justify-between
                    ${filters.pattern === pattern
                      ? "bg-ink/4 text-ink font-bold"
                      : "text-muted hover:text-ink hover:bg-cream-dark"}
                  `}
                >
                  <span className="truncate">{pattern}</span>
                  {filters.pattern === pattern && <span className="w-1 h-1 rounded-full bg-lime shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reset (Always visible, functionally disabled when inactive) */}
      <div className="flex items-center">
        <div className="w-px h-3 bg-rule/50 mx-3 lg:mx-4" />
        <button
          onClick={() => hasActive && setFilters({ topic: filters.topic, difficulty: "", priority: "", pattern: "" })}
          disabled={!hasActive}
          className={`
            flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider transition-colors duration-150
            ${hasActive 
              ? "text-muted hover:text-brand-red cursor-pointer" 
              : "text-muted/30 cursor-not-allowed"}
          `}
        >
          <RotateCcw size={10} />
          Clear
        </button>
      </div>
    </div>
  );
};

export default Filters