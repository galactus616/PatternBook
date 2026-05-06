import React, { useState } from "react";
import { ExternalLink, CheckCircle2, Circle, Clock, Eye, ChevronDown, Target } from "lucide-react";
import Skeleton from "../../components/ui/Skeleton";
import { useUpdateProgress } from "./useProblems";

const ProblemsTable = ({ problems, isLoading }) => {
  const { mutate: updateStatus } = useUpdateProgress();
  const [revealedHints, setRevealedHints] = useState({});
  const [activeMenu, setActiveMenu] = useState(null); // Track which problem's menu is open

  const toggleHint = (id) => {
    setRevealedHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const statuses = [
    { id: 'NOT_STARTED', label: 'Not Started', icon: Circle, color: 'text-muted' },
    { id: 'ATTEMPTED', label: 'Attempting', icon: Clock, color: 'text-accent' },
    { id: 'SOLVED_WITH_HELP', label: 'Solved (Help)', icon: CheckCircle2, color: 'text-brand-red' },
    { id: 'SOLVED_INDEPENDENTLY', label: 'Mastered', icon: CheckCircle2, color: 'text-lime-dark' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-12">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!problems?.length) {
    return (
      <div className="py-20 text-center border border-dashed border-rule rounded-[4px]">
        <p className="font-serif text-[24px] text-muted italic">No problems found matching these criteria.</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted/60 mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  const groupedProblems = problems.reduce((acc, prob) => {
    const patternName = prob.pattern?.name || "Uncategorized";
    if (!acc[patternName]) acc[patternName] = [];
    acc[patternName].push(prob);
    return acc;
  }, {});

  return (
    <div className="space-y-16">
      {Object.entries(groupedProblems).map(([patternName, items], index) => (
        <section key={patternName} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-end gap-4 mb-6 border-b-2 border-ink pb-4">
            <span className="font-mono text-[14px] font-bold text-muted">{(index + 1).toString().padStart(2, '0')}</span>
            <h2 className="font-serif text-[32px] font-black text-ink leading-none">{patternName}</h2>
            <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-lime/20 rounded-full">
              <span className="font-mono text-[10px] font-bold text-lime-dark uppercase tracking-tight">
                {items.filter(p => p.progress?.[0]?.status === 'SOLVED_INDEPENDENTLY').length}/{items.length} Mastered
              </span>
            </div>
          </div>

          {/* Problem List */}
          <div className="space-y-px bg-rule border border-rule rounded-[4px] shadow-sm">
            {items.map((prob) => {
              const currentStatus = prob.progress?.[0]?.status || 'NOT_STARTED';
              const statusObj = statuses.find(s => s.id === currentStatus) || statuses[0];

              return (
                <React.Fragment key={prob.id}>
                  <div
                    className={`
                      grid grid-cols-[auto_1fr_auto_auto] items-center gap-6 p-5 bg-white hover:bg-cream-dark/30 transition-colors group relative
                      ${activeMenu === prob.id ? 'z-50' : 'z-10'}
                    `}
                  >
                    {/* Status Interaction - Dropdown Style */}
                    <div className="relative z-20">
                      <button
                        className={`cursor-pointer transition-transform hover:scale-110 flex items-center gap-1 ${statusObj.color}`}
                        onClick={() => setActiveMenu(activeMenu === prob.id ? null : prob.id)}
                      >
                        <statusObj.icon size={22} className={currentStatus === 'SOLVED_INDEPENDENTLY' ? 'fill-lime' : ''} />
                        <ChevronDown size={12} className={`opacity-0 group-hover:opacity-40 transition-opacity ${activeMenu === prob.id ? 'opacity-100 rotate-180' : ''}`} />
                      </button>

                      {/* Status Popover */}
                      {activeMenu === prob.id && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setActiveMenu(null)} />
                          <div className="absolute top-full left-0 mt-2 w-48 bg-ink border border-ink shadow-2xl rounded-[4px] z-40 overflow-hidden animate-in zoom-in-95 duration-100 origin-top-left">
                            <div className="p-2 border-b border-white/10">
                              <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Update Status</p>
                            </div>
                            {statuses.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => {
                                  updateStatus({ problemId: prob.id, status: s.id });
                                  setActiveMenu(null);
                                }}
                                className={`
                                w-full flex items-center gap-3 px-4 py-3 font-sans text-[12px] font-semibold transition-colors cursor-pointer
                                ${currentStatus === s.id ? 'bg-white/10 text-lime' : 'text-cream hover:bg-white/5'}
                              `}
                              >
                                <s.icon size={16} className={currentStatus === s.id ? 'text-lime' : 'text-muted'} />
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-sans text-[15px] font-bold text-ink group-hover:text-brand-red transition-colors">
                          {prob.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        {/* High Contrast Difficulty Badge */}
                        <div className={`
                        flex items-center gap-2 px-2 py-0.5 rounded-[2px] border font-mono text-[9px] font-black tracking-[0.1em]
                        ${prob.difficulty === 'EASY' ? 'bg-lime/10 text-lime-dark border-lime/30' :
                            prob.difficulty === 'MEDIUM' ? 'bg-accent/10 text-accent border-accent/30' :
                              'bg-brand-red/10 text-brand-red border-brand-red/30'}
                      `}>
                          <div className="flex gap-0.5">
                            <div className={`w-1.5 h-1.5 rounded-[1px] ${prob.difficulty === 'EASY' || prob.difficulty === 'MEDIUM' || prob.difficulty === 'HARD' ? 'bg-current' : 'bg-rule'}`} />
                            <div className={`w-1.5 h-1.5 rounded-[1px] ${prob.difficulty === 'MEDIUM' || prob.difficulty === 'HARD' ? 'bg-current' : 'bg-rule'}`} />
                            <div className={`w-1.5 h-1.5 rounded-[1px] ${prob.difficulty === 'HARD' ? 'bg-current' : 'bg-rule'}`} />
                          </div>
                          {prob.difficulty}
                        </div>

                        <div className="w-1 h-1 rounded-full bg-rule/50" />
                        <span className="font-mono text-[9px] text-muted uppercase tracking-widest flex items-center gap-1">
                          <Clock size={10} /> 15-20 min
                        </span>
                      </div>
                    </div>

                    {/* Priority Tag */}
                    <div className={`
                    px-2.5 py-1 rounded-[2px] font-mono text-[9px] font-bold uppercase tracking-widest
                    ${prob.priority === 'MUST_DO' ? 'bg-brand-red text-white' : 'bg-faint text-muted'}
                  `}>
                      {prob.priority.replace('_', ' ')}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      {/* Hint Toggle */}
                      {prob.subPattern && (
                        <button
                          onClick={() => toggleHint(prob.id)}
                          className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer border
                          ${revealedHints[prob.id]
                              ? 'bg-ink text-lime border-ink'
                              : 'bg-white text-muted border-rule hover:border-ink hover:text-ink'}
                        `}
                        >
                          <Eye size={12} />
                          {revealedHints[prob.id] ? "Hide Hint" : "Show Hint"}
                        </button>
                      )}

                      <a
                        href={prob.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-muted hover:text-ink hover:bg-rule/30 rounded-[4px] transition-all"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>

                  {/* Expandable Hint Drawer */}
                  {revealedHints[prob.id] && (
                    <div className="bg-faint/50 border-x border-b border-rule/50 p-6 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex gap-6 max-w-4xl">
                        <div className="shrink-0 pt-1">
                          <div className="w-8 h-8 rounded-full bg-ink/5 flex items-center justify-center text-ink/30 font-serif italic text-xl">i</div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted mb-2">Pattern Strategy</p>
                            <span className="px-2 py-1 bg-ink text-lime font-mono text-[11px] uppercase tracking-wider rounded-[2px]">
                              {prob.subPattern.name}
                            </span>
                          </div>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted mb-2">Conceptual Hint</p>
                            <p className="font-sans text-[14px] leading-relaxed text-ink/80 italic border-l-2 border-brand-red pl-4">
                              Consider the spatial relationship of the elements. Can you solve this in-place by maintaining a "boundary" pointer that tracks the position of processed elements while the other pointer scans the array?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProblemsTable;
