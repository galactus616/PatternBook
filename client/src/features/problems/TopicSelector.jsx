import React from "react";
import { useTopics } from "./useProblems";
import Skeleton from "../../components/ui/Skeleton";

const TopicSelector = ({ selectedTopic, onSelectTopic }) => {
  const { data: topics, isLoading } = useTopics();

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-10 w-24 shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-1">
      {topics?.map((topic) => (
        <button
          key={topic}
          onClick={() => onSelectTopic(topic)}
          className={`
            px-6 py-2.5 rounded-[4px] border font-sans text-[13px] font-bold tracking-wide transition-all duration-200 shrink-0 cursor-pointer
            ${selectedTopic === topic
              ? "bg-ink text-lime border-ink shadow-lg shadow-ink/10 scale-[1.02]"
              : "bg-white text-muted border-rule hover:border-ink hover:text-ink hover:bg-cream-dark"}
          `}
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicSelector;
