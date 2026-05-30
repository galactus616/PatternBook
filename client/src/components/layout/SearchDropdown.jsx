import React, { useEffect, useRef } from "react";
import { BookOpen, Sparkles, Code2, Search, X } from "lucide-react";
import { useProblems, useTopics } from "../../features/problems/useProblems";

const SearchDropdown = ({ query, onClose, onSelect, selectedIndex, setSelectedIndex, flatResultsRef }) => {
  const containerRef = useRef(null);

  // Fetch problems and topics globally for client-side search indexing
  const { data: allProblems = [] } = useProblems({});
  const { data: topics = [] } = useTopics();

  // Extract unique patterns dynamically
  const patterns = React.useMemo(() => {
    const patternMap = {};
    allProblems.forEach((p) => {
      if (p.pattern?.name) {
        if (!patternMap[p.pattern.name]) {
          patternMap[p.pattern.name] = {
            name: p.pattern.name,
            topic: p.topic?.name || "arrays",
            count: 0,
          };
        }
        patternMap[p.pattern.name].count++;
      }
    });
    return Object.values(patternMap);
  }, [allProblems]);

  // Real-time filtering and category grouping
  const filteredResults = React.useMemo(() => {
    if (!query.trim()) return { topics: [], patterns: [], problems: [] };

    const q = query.toLowerCase().trim();

    const matchedTopics = topics
      .filter((t) => t.name.toLowerCase().includes(q))
      .map((t) => ({ ...t, type: "topic" }));

    const matchedPatterns = patterns
      .filter((p) => p.name.toLowerCase().includes(q))
      .map((p) => ({ ...p, type: "pattern" }));

    const matchedProblems = allProblems
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(q)) ||
          p.pattern?.name?.toLowerCase().includes(q)
      )
      .map((p) => ({ ...p, type: "problem" }))
      .slice(0, 5); // Limit problems for floating space

    return {
      topics: matchedTopics,
      patterns: matchedPatterns,
      problems: matchedProblems,
    };
  }, [query, topics, patterns, allProblems]);

  // Flat array of matches for easy keyboard indexes mapping
  const flatResults = React.useMemo(() => {
    return [
      ...filteredResults.topics,
      ...filteredResults.patterns,
      ...filteredResults.problems,
    ];
  }, [filteredResults]);

  // Keep parent reference updated for keyboard handlers
  useEffect(() => {
    flatResultsRef.current = flatResults;
  }, [flatResults, flatResultsRef]);

  // Scroll active item into view inside the dropdown
  useEffect(() => {
    const container = containerRef.current;
    const activeItem = container?.querySelector(".search-dropdown-item-active");
    if (activeItem && container) {
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      const elemTop = activeItem.offsetTop;
      const elemBottom = elemTop + activeItem.clientHeight;

      if (elemTop < containerTop) {
        container.scrollTop = elemTop;
      } else if (elemBottom > containerBottom) {
        container.scrollTop = elemBottom - container.clientHeight;
      }
    }
  }, [selectedIndex]);

  // Reset index on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, setSelectedIndex]);

  if (!query.trim()) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute top-full left-0 mt-1.5 w-[360px] bg-white border border-rule shadow-2xl rounded-[4px] overflow-hidden z-[200] max-h-[380px] overflow-y-auto p-2 space-y-4 animate-in slide-in-from-top-2 duration-150"
    >
      {flatResults.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center space-y-2 select-none">
          <div className="w-8 h-8 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red opacity-80">
            <X size={14} />
          </div>
          <div className="space-y-0.5">
            <p className="font-serif text-[13px] font-black text-ink">No Matches</p>
            <p className="font-sans text-[10px] text-muted">Try searching another phrase</p>
          </div>
        </div>
      ) : (
        <>
          {/* Topics Category */}
          {filteredResults.topics.length > 0 && (
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted px-2.5 mb-1 select-none">Topics</p>
              <div className="space-y-px">
                {filteredResults.topics.map((t) => {
                  const idx = flatResults.indexOf(t);
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={`topic-${t.id}`}
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent input blur
                        onSelect(t);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`
                        flex items-center gap-2.5 px-2.5 py-1.5 rounded-[3px] cursor-pointer transition-colors
                        ${isSelected ? "bg-ink text-cream search-dropdown-item-active" : "hover:bg-cream-dark/30 text-ink"}
                      `}
                    >
                      <BookOpen size={12} className={isSelected ? "text-lime" : "text-muted"} />
                      <span className="font-sans text-[12px] font-bold flex-1">{t.name}</span>
                      <span className="font-mono text-[8px] uppercase tracking-wider opacity-60">Domain</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Patterns Category */}
          {filteredResults.patterns.length > 0 && (
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted px-2.5 mb-1 select-none">Patterns</p>
              <div className="space-y-px">
                {filteredResults.patterns.map((p) => {
                  const idx = flatResults.indexOf(p);
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={`pattern-${p.name}`}
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent input blur
                        onSelect(p);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`
                        flex items-center gap-2.5 px-2.5 py-1.5 rounded-[3px] cursor-pointer transition-colors
                        ${isSelected ? "bg-ink text-cream search-dropdown-item-active" : "hover:bg-cream-dark/30 text-ink"}
                      `}
                    >
                      <Sparkles size={12} className={isSelected ? "text-lime" : "text-accent"} />
                      <div className="flex-1 flex items-baseline gap-1.5 min-w-0">
                        <span className="font-sans text-[12px] font-bold truncate">{p.name}</span>
                        <span className={`font-mono text-[7px] uppercase tracking-wider truncate ${isSelected ? 'text-cream/50' : 'text-muted/65'}`}>
                          in {p.topic}
                        </span>
                      </div>
                      <span className={`font-mono text-[8px] px-1 py-0.2 rounded-[1.5px] shrink-0 ${isSelected ? 'bg-cream/10 text-cream' : 'bg-faint text-muted'}`}>
                        {p.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Problems Category */}
          {filteredResults.problems.length > 0 && (
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted px-2.5 mb-1 select-none">Problems</p>
              <div className="space-y-px">
                {filteredResults.problems.map((prob) => {
                  const idx = flatResults.indexOf(prob);
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={`problem-${prob.id}`}
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent input blur
                        onSelect(prob);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`
                        flex items-center gap-2.5 px-2.5 py-2 rounded-[3px] cursor-pointer transition-colors
                        ${isSelected ? "bg-ink text-cream search-dropdown-item-active" : "hover:bg-cream-dark/30 text-ink"}
                      `}
                    >
                      <Code2 size={12} className={isSelected ? "text-lime" : "text-muted"} />
                      <div className="flex-1 flex flex-col min-w-0">
                        <span className="font-sans text-[12px] font-bold leading-none truncate">{prob.title}</span>
                        <span className={`font-mono text-[7px] uppercase tracking-widest mt-1 truncate ${isSelected ? 'text-cream/45' : 'text-muted/60'}`}>
                          {prob.pattern?.name || "General"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {prob.isPro && (
                          <span className={`font-mono text-[7px] tracking-wider uppercase px-0.5 rounded-[1px] ${isSelected ? 'bg-lime text-ink' : 'bg-ink text-lime'}`}>
                            Pro
                          </span>
                        )}
                        <span className={`
                          font-mono text-[7px] font-black tracking-widest uppercase px-1 rounded-[1.5px] border
                          ${prob.difficulty === 'EASY' ? 'bg-lime/10 text-lime-dark border-lime/30' :
                            prob.difficulty === 'MEDIUM' ? 'bg-accent/10 text-accent border-accent/30' :
                            'bg-brand-red/10 text-brand-red border-brand-red/30'}
                        `}>
                          {prob.difficulty.slice(0, 3)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchDropdown;
