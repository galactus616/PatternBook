import React, { useState } from "react";
import {
  Trophy,
  Zap,
  Search,
  Award,
  Crown,
  Users,
  Globe,
  BookOpen,
  Flame,
  Medal,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import AvatarDisplay from "../components/ui/AvatarDisplay";
import { useLeaderboard } from "../features/leaderboard/useLeaderboard";
import Skeleton from "../components/ui/Skeleton";

// ─── Medal config ──────────────────────────────────────────────────────────────
const MEDAL = {
  1: { color: "#FFB800", bg: "bg-[#FFF9E6]", border: "border-[#FFB800]/30", text: "text-[#FFB800]", label: "Gold" },
  2: { color: "#9CA3AF", bg: "bg-[#F5F5F5]", border: "border-[#9CA3AF]/30", text: "text-[#8A8A8A]", label: "Silver" },
  3: { color: "#CD7F32", bg: "bg-[#FDF0E6]", border: "border-[#CD7F32]/30", text: "text-[#CD7F32]", label: "Bronze" },
};

// ─── Podium Card ───────────────────────────────────────────────────────────────
const PodiumCard = ({ user, rank, authUserId }) => {
  const m = MEDAL[rank];
  const isFirst = rank === 1;
  const isCurrentUser = user.id === authUserId;

  return (
    <div
      className={`flex flex-col items-center group ${isFirst ? "-translate-y-4 z-10" : ""}`}
      style={{ position: "relative" }}
    >
      {/* Crown for 1st */}
      {isFirst && (
        <Crown
          size={24}
          className="mb-1.5 drop-shadow-sm"
          style={{ color: "#FFB800", fill: "#FFB800" }}
        />
      )}

      {/* Avatar */}
      <div className="relative mb-3">
        <div
          className={`rounded-full overflow-hidden bg-cream flex items-center justify-center shadow-md ${
            isFirst
              ? "w-20 h-20 md:w-24 md:h-24 border-4"
              : "w-16 h-16 md:w-20 md:h-20 border-2"
          }`}
          style={{ borderColor: m.color }}
        >
          <AvatarDisplay user={user} size={isFirst ? 96 : 80} />
        </div>
        {/* Rank badge */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center font-mono font-black shadow-md border-2 border-white z-10"
          style={{ backgroundColor: m.color, color: rank === 1 ? "#0e0d0b" : "#fff", fontSize: "11px" }}
        >
          {rank}
        </div>
      </div>

      {/* Name */}
      <div className="text-center mb-3 px-2">
        <Link
          to={isCurrentUser ? "/profile" : `/u/${user.username || user.id}`}
          className="font-serif text-[14px] font-black text-ink block hover:text-brand-red transition-colors truncate max-w-[100px]"
        >
          {user.name.split(" ")[0]}
        </Link>
        <span className="font-mono text-[9px] text-muted lowercase">@{user.username}</span>
      </div>

      {/* Pillar */}
      <div
        className={`w-full rounded-t-[6px] flex flex-col items-center justify-center gap-1.5 p-3 text-center border-x border-t ${m.border} ${m.bg} ${
          isFirst ? "h-36" : "h-24"
        }`}
        style={{ borderTopWidth: isFirst ? 4 : 2, borderTopColor: m.color }}
      >
        <span
          className="font-mono font-black leading-none"
          style={{ fontSize: isFirst ? "18px" : "15px", color: "#0e0d0b" }}
        >
          {user.points.toLocaleString()}
        </span>
        <span className="font-mono text-[7px] uppercase tracking-widest text-muted font-bold">pts</span>
        {user.streak > 0 && (
          <div className="flex items-center gap-0.5 text-brand-red bg-brand-red/8 border border-brand-red/15 px-1.5 py-0.5 rounded-[3px] mt-0.5">
            <Zap size={9} className="fill-brand-red" />
            <span className="font-mono text-[8px] font-black">{user.streak}d</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const LeaderboardPage = () => {
  const { user: authUser } = useAuth();
  const { data, isLoading } = useLeaderboard();
  const [scope, setScope] = useState("global");
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-8 pb-14 space-y-10">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-48 animate-pulse" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>

        {/* Stats Strip Skeleton */}
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-[74px] w-full" />
          <Skeleton className="h-[74px] w-full" />
          <Skeleton className="h-[74px] w-full" />
        </div>

        {/* Podium Skeleton */}
        <div className="bg-white border border-rule/50 rounded-[8px] p-6 space-y-8">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-3 max-w-2xl mx-auto items-end gap-4 pt-4">
            <div className="flex flex-col items-center space-y-3">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-24 w-full rounded-t-[6px]" />
            </div>
            <div className="flex flex-col items-center space-y-3">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-36 w-full rounded-t-[6px]" />
            </div>
            <div className="flex flex-col items-center space-y-3">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-20 w-full rounded-t-[6px]" />
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <div className="bg-white border border-rule/50 rounded-[8px] p-4 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const globalList = data?.globalList || [];
  const friendsList = data?.friendsList || [];
  const stats = data?.stats || {
    global: { totalSeekers: 0, totalPoints: 0, topStreak: 0 },
    friends: { totalSeekers: 0, totalPoints: 0, topStreak: 0 },
  };

  const currentData = scope === "global" ? globalList : friendsList;
  const currentStats = scope === "global" ? stats.global : stats.friends;

  const topThree = currentData.slice(0, 3);

  const allFiltered = searchQuery
    ? currentData.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  // Dynamic user percentile calculation
  const userRankObj = globalList.find((u) => u.id === authUser?.id);
  const totalSeekers = globalList.length;
  const userPercentile = userRankObj && totalSeekers > 0 ? userRankObj.rank / totalSeekers : 1;
  const isTop25 = userPercentile <= 0.25;

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 pt-8 pb-14 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Rankings</p>
          <h1 className="font-serif text-[36px] md:text-[44px] font-black text-ink leading-none flex items-center gap-3">
            <Trophy size={32} className="text-brand-red shrink-0" strokeWidth={2.5} />
            Leader <span className="text-brand-red">Board.</span>
          </h1>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mt-2">
            Solve problems · Climb the ranks
          </p>
        </div>

        {/* Scope toggle */}
        <div className="flex bg-white border border-rule/60 p-1 rounded-[6px] self-start md:self-auto shadow-xs gap-0.5">
          {[
            { key: "global", label: "Global", icon: Globe },
            { key: "friends", label: "Friends", icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                setScope(key);
                setSearchQuery("");
              }}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-wider rounded-[4px] transition-all duration-200 cursor-pointer ${
                scope === key
                  ? "bg-ink text-cream shadow-sm"
                  : "text-muted hover:text-ink hover:bg-cream-dark/50"
              }`}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats Strip ─────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Seekers Ranked", value: currentStats.totalSeekers, color: "text-ink" },
          { icon: Target, label: "Points Earned", value: currentStats.totalPoints.toLocaleString(), color: "text-brand-red" },
          { icon: Flame, label: "Top Streak", value: `${currentStats.topStreak}d`, color: "text-brand-red" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-white border border-rule/50 rounded-[6px] p-4 flex items-center gap-4 shadow-xs hover:shadow-sm hover:border-rule transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-[4px] bg-cream-dark/60 flex items-center justify-center shrink-0">
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className={`font-mono text-[17px] font-black leading-none ${color}`}>{value}</p>
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Scoring Legend ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 bg-cream-dark/20 border border-rule/40 rounded-[6px] font-mono text-[10px] text-muted">
        <span className="uppercase tracking-widest font-black text-ink/80 flex items-center gap-1.5">
          <Award size={12} className="text-brand-red" />
          Scoring Distribution:
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-lime-dark" /> Easy +10 pts
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-accent" /> Medium +20 pts
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-red" /> Hard +30 pts
        </span>
      </div>

      {/* ── Podium ──────────────────────────────────────────── */}
      {!searchQuery && topThree.length > 0 && (
        <div className="bg-white border border-rule/50 rounded-[8px] shadow-sm">
          {/* Podium header */}
          <div className="border-b border-rule/40 px-6 py-4 bg-faint/20 flex items-center gap-2 rounded-t-[8px]">
            <Medal size={14} className="text-muted" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-bold">Top Seekers</span>
          </div>

          <div className="px-6 pt-8 pb-0">
            <div className="grid grid-cols-3 max-w-2xl mx-auto items-end gap-2 md:gap-4">
              {podiumOrder.map((user) => (
                <PodiumCard
                  key={user.id}
                  user={user}
                  rank={user.rank}
                  authUserId={authUser?.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Rankings Table ───────────────────────────────────── */}
      <div className="space-y-4">
        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input
              type="text"
              placeholder="Search seekers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-rule/60 rounded-[6px] text-[13px] font-sans text-ink placeholder:text-muted/60 focus:outline-none focus:border-ink transition-all shadow-xs"
            />
          </div>
          {searchQuery && (
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
              {allFiltered?.length || 0} results
            </span>
          )}
        </div>

        {/* Table card */}
        <div className="bg-white border border-rule/50 rounded-[8px] shadow-sm overflow-hidden">
          {/* Table head */}
          <div className="grid grid-cols-[56px_1fr_100px_160px_90px] items-center border-b border-rule/40 bg-faint/20 px-4 py-3">
            {[
              { label: "Rank", align: "text-center" },
              { label: "Seeker", align: "text-left" },
              { label: "Streak", align: "text-center" },
              { label: "Problems", align: "text-center" },
              { label: "Points", align: "text-right" },
            ].map(({ label, align }) => (
              <div key={label} className={`font-mono text-[9px] uppercase tracking-widest text-muted font-bold ${align}`}>
                {label}
              </div>
            ))}
          </div>

          {/* Table rows */}
          <div className="divide-y divide-rule/30">
            {(searchQuery ? allFiltered : currentData)?.length === 0 ? (
              <div className="py-16 text-center">
                <Trophy size={28} className="mx-auto text-muted/20 mb-3" />
                <p className="font-mono text-[11px] text-muted uppercase tracking-wider">No seekers match your search</p>
              </div>
            ) : (
              (searchQuery ? allFiltered : currentData).map((user) => {
                const isCurrentUser = user.id === authUser?.id;
                const m = MEDAL[user.rank];
                const totalSolved = user.solvedStats.easy + user.solvedStats.medium + user.solvedStats.hard;

                return (
                  <div
                    key={user.id}
                    className={`grid grid-cols-[56px_1fr_100px_160px_90px] items-center px-4 py-3.5 transition-all duration-150 group ${
                      isCurrentUser
                        ? "bg-brand-red/4 border-l-[3px] border-l-brand-red"
                        : "hover:bg-cream/30 border-l-[3px] border-l-transparent"
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex justify-center">
                      {m ? (
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono font-black text-[11px] border ${m.bg} ${m.border} ${m.text}`}
                        >
                          {user.rank}
                        </span>
                      ) : (
                        <span className="font-mono text-[13px] font-bold text-muted">{user.rank}</span>
                      )}
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-rule/30 bg-cream flex items-center justify-center">
                          <AvatarDisplay user={user} size={36} />
                        </div>
                        {isCurrentUser && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                             to={isCurrentUser ? "/profile" : `/u/${user.username || user.id}`}
                            className="font-sans text-[13px] font-bold text-ink hover:text-brand-red transition-colors truncate"
                          >
                            {user.name}
                          </Link>
                          {isCurrentUser && (
                            <span className="font-mono text-[7px] bg-brand-red/10 text-brand-red px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider font-bold shrink-0">
                              You
                            </span>
                          )}
                          {user.plan === "PRO" && (
                            <span className="flex items-center gap-0.5 bg-ink text-lime font-mono text-[6px] px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider shrink-0">
                              <Zap size={7} className="fill-lime" />
                              Pro
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[9px] text-muted lowercase truncate mt-0.5">
                          @{user.username}
                        </p>
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="flex justify-center">
                      {user.streak > 0 ? (
                        <div className="inline-flex items-center gap-1 text-brand-red bg-brand-red/8 px-2 py-1 rounded-[4px] border border-brand-red/15">
                          <Zap size={10} className="fill-brand-red" />
                          <span className="font-mono text-[10px] font-black">{user.streak}d</span>
                        </div>
                      ) : (
                        <span className="font-mono text-[11px] text-muted/40">—</span>
                      )}
                    </div>

                    {/* Problems */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="text-center">
                        <p className="font-mono text-[12px] font-black text-ink leading-none">{totalSolved}</p>
                        <p className="font-mono text-[7px] uppercase tracking-wider text-muted mt-0.5">Total</p>
                      </div>
                      <div className="w-px h-6 bg-rule/40" />
                      <div className="flex items-center gap-1.5 font-mono text-[8px] text-muted uppercase">
                        <span className="flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-lime-dark" />
                          {user.solvedStats.easy}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {user.solvedStats.medium}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                          {user.solvedStats.hard}
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <span className="font-mono text-[14px] font-black text-ink">{user.points.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Motivational Banner ────────────────────────────── */}
      {scope === "global" && userRankObj && (
        <div className="relative overflow-hidden bg-ink rounded-[8px] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-md border border-ink">
          {/* BG decoration */}
          <div className="absolute right-0 top-0 w-64 h-full opacity-5 pointer-events-none">
            <Trophy size={200} className="text-cream absolute -right-8 -top-8" />
          </div>

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-[6px] bg-lime/10 border border-lime/20 flex items-center justify-center shrink-0 mt-0.5">
              <Award size={18} className="text-lime" />
            </div>
            <div>
              <p className="font-serif text-[18px] font-black text-cream leading-snug">
                {isTop25 ? (
                  <>You're in the <em className="text-lime not-italic">Top 25%</em> of Seekers!</>
                ) : (
                  <>Keep climbing the ranks, Seeker!</>
                )}
              </p>
              <p className="font-mono text-[9px] text-cream/50 uppercase tracking-widest mt-1.5">
                {isTop25 ? (
                  "You're doing exceptionally well. Solve more Medium or Hard problems to break into the top tier!"
                ) : (
                  "Consistency is key. Solve problems daily to build your streak and climb higher!"
                )}
              </p>
            </div>
          </div>

          <Link
            to="/problems"
            className="relative z-10 shrink-0 flex items-center gap-2 bg-lime text-lime-dark hover:bg-lime-light transition-all px-5 py-2.5 rounded-[6px] font-mono text-[10px] uppercase font-black tracking-wider cursor-pointer shadow-sm"
          >
            <BookOpen size={13} />
            Solve Problems
          </Link>
        </div>
      )}

    </div>
  );
};

export default LeaderboardPage;
