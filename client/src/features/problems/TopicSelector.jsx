import React, { useState, useRef, useEffect } from "react";
import { useTopics } from "./useProblems";
import Skeleton from "../../components/ui/Skeleton";
import { ChevronDown, BookOpen } from "lucide-react";

const TopicSelector = ({ selectedTopic, onSelectTopic }) => {
  const { data: topics, isLoading } = useTopics();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  if (isLoading) {
    return <Skeleton className="h-8 w-36 rounded-[2px]" />;
  }

  const currentTopicName = topics?.find(
    t => t.slug === selectedTopic || t.name.toLowerCase() === selectedTopic?.toLowerCase()
  )?.name || "Select Topic";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-white border border-rule hover:border-ink transition-colors cursor-pointer"
      >
        <BookOpen size={13} className="text-muted" />
        <span className="font-sans text-[13px] font-bold text-ink whitespace-nowrap">
          {currentTopicName}
        </span>
        <ChevronDown size={13} className={`text-muted transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-rule/80 shadow-lg rounded-[2px] z-50 py-1 max-h-[320px] overflow-y-auto no-scrollbar">
          <div className="px-3 py-2 border-b border-rule/30 mb-1">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted">All Topics</p>
          </div>
          {topics?.map((topic) => {
            const isActive = selectedTopic === topic.slug || selectedTopic?.toLowerCase() === topic.name.toLowerCase();
            return (
              <button
                key={topic.slug}
                onClick={() => {
                  onSelectTopic(topic.slug);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-3 py-2 font-sans text-[13px] transition-colors cursor-pointer flex items-center justify-between
                  ${isActive
                    ? "bg-ink/[0.04] text-ink font-bold"
                    : "text-muted hover:text-ink hover:bg-cream-dark"}
                `}
              >
                <span>{topic.name}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopicSelector;