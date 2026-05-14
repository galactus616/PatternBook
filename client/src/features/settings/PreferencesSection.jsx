import React, { useState } from "react";
import { SlidersHorizontal, Sun, Eye, Target, Flame, Keyboard } from "lucide-react";
import { useTopics } from "../problems/useProblems";

const DAILY_GOALS = [
  { value: 1, label: "1 problem / day" },
  { value: 2, label: "2 problems / day" },
  { value: 3, label: "3 problems / day" },
  { value: 5, label: "5 problems / day" },
];

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`w-12 h-6 rounded-full transition-all duration-200 cursor-pointer relative shrink-0 ${
      enabled ? "bg-ink" : "bg-rule"
    }`}
  >
    <div className={`absolute top-1 w-4 h-4 rounded-full bg-cream transition-all duration-200 ${
      enabled ? "left-7" : "left-1"
    }`} />
  </button>
);

const PreferencesSection = () => {
  const { data: topics } = useTopics();
  const [grainEnabled, setGrainEnabled] = useState(() => !document.body.classList.contains("no-grain"));
  const [reduceMotion, setReduceMotion] = useState(false);
  const [defaultTopic, setDefaultTopic] = useState(() => localStorage.getItem("defaultTopic") || "Arrays");
  const [dailyGoal, setDailyGoal] = useState(() => parseInt(localStorage.getItem("dailyGoal") || "2", 10));
  const [streakReminder, setStreakReminder] = useState(() => localStorage.getItem("streakReminder") !== "false");

  const handleGrainToggle = () => {
    const next = !grainEnabled;
    setGrainEnabled(next);
    if (next) {
      document.body.classList.remove("no-grain");
    } else {
      document.body.classList.add("no-grain");
    }
  };

  const handleMotionToggle = () => {
    const next = !reduceMotion;
    setReduceMotion(next);
    if (next) {
      document.documentElement.style.setProperty("--animate-marquee", "none");
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.style.removeProperty("--animate-marquee");
      document.documentElement.classList.remove("reduce-motion");
    }
  };

  const handleDefaultTopic = (topic) => {
    setDefaultTopic(topic);
    localStorage.setItem("defaultTopic", topic);
  };

  const handleDailyGoal = (goal) => {
    setDailyGoal(goal);
    localStorage.setItem("dailyGoal", String(goal));
  };

  const handleStreakReminder = () => {
    const next = !streakReminder;
    setStreakReminder(next);
    localStorage.setItem("streakReminder", String(next));
  };

  return (
    <div className="bg-white border border-rule rounded-[4px] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-rule bg-faint/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={16} className="text-ink" />
          <h3 className="font-serif text-[18px] font-black text-ink">Preferences</h3>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Learning & Display</p>
      </div>

      <div className="p-6 space-y-7">
        {/* ── Learning Preferences ── */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Learning</p>
          <div className="space-y-4">
            {/* Default Topic */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center border border-rule">
                  <Target size={14} className="text-ink" />
                </div>
                <div>
                  <p className="font-sans text-[13px] font-bold text-ink">Default Topic</p>
                  <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                    Opens first when you visit Problems
                  </p>
                </div>
              </div>
              <select
                value={defaultTopic}
                onChange={(e) => handleDefaultTopic(e.target.value)}
                className="bg-white border border-rule px-3 py-2 rounded-[4px] font-sans text-[12px] text-ink focus:border-ink outline-none cursor-pointer max-w-[180px]"
              >
                {topics?.map((topic) => (
                  <option key={topic.id || topic.name} value={topic.name}>{topic.name}</option>
                ))}
                {!topics?.length && <option value="Arrays">Arrays</option>}
              </select>
            </div>

            <div className="h-px bg-rule/50" />

            {/* Daily Goal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center border border-rule">
                  <Flame size={14} className="text-brand-red" />
                </div>
                <div>
                  <p className="font-sans text-[13px] font-bold text-ink">Daily Goal</p>
                  <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                    Problems per day to maintain streak
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                {DAILY_GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => handleDailyGoal(g.value)}
                    className={`font-mono text-[10px] px-2.5 py-1.5 rounded-[2px] border tracking-wider transition-all cursor-pointer ${
                      dailyGoal === g.value
                        ? "bg-ink text-cream border-ink"
                        : "bg-white text-muted border-rule hover:border-ink hover:text-ink"
                    }`}
                  >
                    {g.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-rule/50" />

            {/* Streak Reminder */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center border border-rule">
                  <Flame size={14} className="text-ink" />
                </div>
                <div>
                  <p className="font-sans text-[13px] font-bold text-ink">Streak Reminders</p>
                  <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                    Get notified before your streak resets
                  </p>
                </div>
              </div>
              <Toggle enabled={streakReminder} onToggle={handleStreakReminder} />
            </div>
          </div>
        </div>

        <div className="h-px bg-rule/50" />

        {/* ── Display Preferences ── */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Display</p>
          <div className="space-y-4">
            {/* Grain Texture */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center border border-rule">
                  <Sun size={14} className="text-ink" />
                </div>
                <div>
                  <p className="font-sans text-[13px] font-bold text-ink">Grain Texture Overlay</p>
                  <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                    Subtle paper-like noise on background
                  </p>
                </div>
              </div>
              <Toggle enabled={grainEnabled} onToggle={handleGrainToggle} />
            </div>

            <div className="h-px bg-rule/50" />

            {/* Reduce Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center border border-rule">
                  <Eye size={14} className="text-ink" />
                </div>
                <div>
                  <p className="font-sans text-[13px] font-bold text-ink">Reduce Motion</p>
                  <p className="font-mono text-[9px] text-muted uppercase tracking-wider mt-0.5">
                    Disable animations and pulse effects
                  </p>
                </div>
              </div>
              <Toggle enabled={reduceMotion} onToggle={handleMotionToggle} />
            </div>
          </div>
        </div>

        <div className="h-px bg-rule/50" />

        {/* ── Keyboard Shortcuts ── */}
        <div className="bg-cream-dark/50 border border-rule/50 p-4 rounded-[4px]">
          <div className="flex items-center gap-2 mb-3">
            <Keyboard size={14} className="text-ink" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink font-bold">Keyboard Shortcuts</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {[
              { keys: "⌘ K", action: "Search patterns" },
              { keys: "⌘ /", action: "Toggle filters" },
              { keys: "1–4", action: "Set problem status" },
              { keys: "E", action: "Expand hint drawer" },
            ].map(({ keys, action }) => (
              <div key={keys} className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted">{action}</span>
                <kbd className="font-mono text-[9px] bg-white border border-rule px-1.5 py-0.5 rounded-[2px] text-ink">{keys}</kbd>
              </div>
            ))}
          </div>
          <p className="font-mono text-[8px] text-faint uppercase tracking-wider mt-3">
            Shortcuts available on the Problems page
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;