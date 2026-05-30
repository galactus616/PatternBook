import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, User, Flame } from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";
import { useSocket } from "../../features/auth/SocketContext";
import { useDashboard } from "../../features/dashboard/useDashboard";
import AvatarDisplay from "../ui/AvatarDisplay";
import NotificationBell from "./NotificationBell";
import SearchDropdown from "./SearchDropdown";

const Header = () => {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const { data: stats } = useDashboard(new Date().getFullYear());
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const flatResultsRef = useRef([]);

  const currentStreak = stats?.overall?.currentStreak || 0;

  // Listen for global ⌘K or Ctrl+K shortcut to focus input
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  const handleSelect = (item) => {
    if (!item) return;

    setQuery("");
    setIsFocused(false);
    inputRef.current?.blur();

    if (item.type === "topic") {
      navigate(`/problems?topic=${item.name.toLowerCase()}`);
    } else if (item.type === "pattern") {
      navigate(`/problems?topic=${item.topic.toLowerCase()}&pattern=${encodeURIComponent(item.name)}`);
    } else if (item.type === "problem") {
      const topicName = item.topic?.name || "arrays";
      navigate(`/problems?topic=${topicName.toLowerCase()}&problemId=${item.id}`);
    }
  };

  const handleKeyDown = (e) => {
    const flatResults = flatResultsRef.current;
    if (!flatResults || flatResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(flatResults[selectedIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <header className="h-[58px] bg-cream/80 backdrop-blur-md border-b border-rule flex items-center justify-between px-8 sticky top-0 z-100">
      {/* Search / Context */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-ink transition-colors" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search patterns or problems... (⌘K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // short delay to let click actions run
              setTimeout(() => setIsFocused(false), 150);
            }}
            onKeyDown={handleKeyDown}
            className="bg-cream-dark/50 border border-rule/50 rounded-[4px] pl-10 pr-4 py-1.5 text-[12px] w-[320px] focus:outline-none focus:border-ink focus:bg-white transition-all placeholder:text-muted/60"
          />
          {isFocused && (
            <SearchDropdown
              query={query}
              onClose={() => setIsFocused(false)}
              onSelect={handleSelect}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
              flatResultsRef={flatResultsRef}
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-5">
        {/* Community Pulse - Refined Style */}
        <div className="flex items-center gap-2 px-3 py-1 border border-rule/60 rounded-[4px] bg-faint/30">
          <span className="w-1.5 h-1.5 rounded-full bg-online"></span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-ink font-bold flex items-center gap-1.5">
            Live <span className="opacity-40 text-[10px] font-normal">[{onlineUsers?.length?.toString().padStart(2, '0') || '00'}]</span>
          </span>
        </div>

        {/* Streak Flame */}
        {currentStreak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-red/5 border border-brand-red/20 rounded-full group relative cursor-help">
            <Flame size={16} className="text-brand-red fill-brand-red animate-pulse" />
            <span className="font-mono text-[11px] font-bold text-brand-red">{currentStreak}</span>

            <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-48 p-2 bg-ink text-cream text-[9px] normal-case rounded-[4px] z-50 shadow-xl leading-relaxed text-center">
              Your <span className="text-brand-red font-bold">{currentStreak} day streak</span> is active! Next day resets at 5:30 AM.
            </div>
          </div>
        )}

        <NotificationBell />

        <div className="h-8 w-px bg-rule mx-1" />

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-bold text-ink leading-none mb-1">{user?.name || "Developer"}</p>
            <p className={`font-mono text-[9px] uppercase tracking-wider ${user?.plan === "PRO" || user?.plan === "TEAM"
                ? "text-lime-dark"
                : "text-muted"
              }`}>
              {user?.plan === "PRO" ? "Pro Member" : user?.plan === "TEAM" ? "Team Member" : "Free Plan"}
            </p>
          </div>
          <div className={`w-9 h-9 rounded-full bg-white flex items-center justify-center border overflow-hidden cursor-pointer transition-colors shadow-sm ${(user?.plan === "PRO" || user?.plan === "TEAM") ? "border-2 border-ink" : "border-ink hover:border-brand-red"}`}>
            <AvatarDisplay user={user} size={36} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
