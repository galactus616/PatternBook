import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users, UserPlus, UserMinus, Check, X, Search,
  Loader2, MessageSquare, Clock, MoreVertical,
  Wifi, WifiOff, Sparkles, BookOpen
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getFriends, getPendingRequests, searchUsers,
  sendFriendRequest, acceptFriendRequest, removeFriendship
} from "../features/friends/friends.api";
import { useToastStore } from "../store/useToastStore";
import { useAuth } from "../features/auth/useAuth";
import { useSocket } from "../features/auth/SocketContext";
import AvatarDisplay from "../components/ui/AvatarDisplay";

const formatLastOnline = (dateStr) => {
  if (!dateStr) return "offline";
  
  const date = new Date(dateStr);
  const now = new Date();
  
  const isSameDay = (d1, d2) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (isSameDay(date, now)) return `Today at ${timeStr}`;
  if (isSameDay(date, yesterday)) return `Yesterday at ${timeStr}`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ─── Friend Card ───────────────────────────────────────────────────────────────
const FriendCard = ({ friend, isOnline, onMenu, activeMenuId, showConfirmUnfriend, setShowConfirmUnfriend, onRemove }) => {
  const online = isOnline(friend.id);
  const isMenuOpen = activeMenuId === friend.id;

  return (
    <div className="bg-white border border-rule/50 rounded-[8px] p-4 flex items-center justify-between hover:shadow-sm hover:border-rule transition-all duration-200 group">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-rule/30 overflow-hidden bg-cream flex items-center justify-center">
            <AvatarDisplay user={friend} size={48} />
          </div>
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white z-10 ${online ? "bg-online" : "bg-rule"}`} />
        </div>
        <div className="truncate">
          <Link
            to={`/u/${friend.username || friend.id}`}
            className="font-sans text-[14px] font-bold text-ink hover:text-brand-red transition-colors truncate block"
          >
            {friend.name}
          </Link>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="font-mono text-[10px] text-muted lowercase tracking-wide truncate">@{friend.username}</p>
            <span className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-[2px] font-bold ${online ? "bg-online/10 text-online" : "bg-rule/30 text-muted"}`}>
              {online ? "online" : formatLastOnline(friend.lastActiveDate)}
            </span>
          </div>
        </div>
      </div>
      <div className="relative shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onMenu(friend.id); }}
          className="p-2 text-muted hover:text-ink hover:bg-cream-dark/50 rounded-full transition-all cursor-pointer"
        >
          <MoreVertical size={15} />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-1 w-44 bg-white border border-rule/50 rounded-[6px] shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
            {!showConfirmUnfriend ? (
              <>
                <Link
                  to={`/u/${friend.username || friend.id}`}
                  className="w-full text-left px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted hover:text-ink hover:bg-cream transition-colors flex items-center gap-2"
                >
                  <Users size={12} /> Profile
                </Link>
                <button
                  onClick={() => {}}
                  className="w-full text-left px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted hover:text-ink hover:bg-cream transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={12} /> Message
                </button>
                <div className="border-t border-rule/30 my-1" />
                <button
                  onClick={(e) => { e.stopPropagation(); setShowConfirmUnfriend(true); }}
                  className="w-full text-left px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-brand-red hover:bg-brand-red/5 transition-colors flex items-center gap-2 cursor-pointer font-bold"
                >
                  <UserMinus size={12} /> Unfriend
                </button>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <p className="font-mono text-[9px] uppercase tracking-wider text-ink font-bold">Remove {friend.name}?</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(friend.friendshipId || friend.id); }}
                    className="flex-1 bg-brand-red text-white py-1.5 rounded-[3px] font-mono text-[9px] font-black uppercase hover:bg-brand-red/90 transition-all cursor-pointer text-center"
                  >
                    Yes
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowConfirmUnfriend(false); }}
                    className="flex-1 bg-cream-dark text-muted py-1.5 rounded-[3px] font-mono text-[9px] font-black uppercase hover:bg-cream-dark/80 transition-all cursor-pointer text-center"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const FriendsPage = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { onlineUsers } = useSocket();
  const { user: authUser } = useAuth();

  const isOnline = (userId) => onlineUsers?.includes(userId);

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showConfirmUnfriend, setShowConfirmUnfriend] = useState(false);

  useEffect(() => {
    const handleOutsideClick = () => { setActiveMenuId(null); setShowConfirmUnfriend(false); };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const setSearchQuery = (q) => q ? setSearchParams({ q }, { replace: true }) : setSearchParams({}, { replace: true });

  // ── Queries ──────────────────────────────────────────────────────────────────
  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({ queryKey: ["friends"], queryFn: getFriends });
  const { data: pendingRequests = [], isLoading: isLoadingPending } = useQuery({ queryKey: ["pendingRequests"], queryFn: getPendingRequests });
  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["userSearch", searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  const onlineFriendsCount = friends?.filter(f => isOnline(f.id)).length || 0;

  // ── Mutations ────────────────────────────────────────────────────────────────
  const sendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (_, receiverIdentifier) => {
      queryClient.setQueryData(["userSearch", searchQuery], old =>
        old?.map(u => (u.id === receiverIdentifier || u.username === receiverIdentifier) ? { ...u, friendshipStatus: "PENDING_SENT" } : u)
      );
      addToast("Friend request sent", "success");
    },
    onError: (err) => addToast(err.response?.data?.message || "Failed to send request", "error"),
  });

  const acceptRequestMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: (_, requestId) => {
      const pending = queryClient.getQueryData(["pendingRequests"]);
      const accepted = pending?.find(r => r.id === requestId);
      if (accepted) {
        queryClient.setQueryData(["pendingRequests"], old => old.filter(r => r.id !== requestId));
        queryClient.setQueryData(["friends"], old => [...(old || []), accepted.sender]);
      }
      addToast("Friend request accepted!", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
    },
  });

  const removeFriendshipMutation = useMutation({
    mutationFn: removeFriendship,
    onSuccess: (_, requestId) => {
      const wasFriend = queryClient.getQueryData(["friends"])?.some(f => f.friendshipId === requestId || f.id === requestId);
      queryClient.setQueryData(["friends"], old => old?.filter(f => f.id !== requestId && f.friendshipId !== requestId));
      queryClient.setQueryData(["pendingRequests"], old => old?.filter(r => r.id !== requestId));
      addToast(wasFriend ? "Friend removed" : "Request cancelled", "success");
      setActiveMenuId(null);
      setShowConfirmUnfriend(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
    },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 pt-8 pb-14 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Social</p>
          <h1 className="font-serif text-[36px] md:text-[44px] font-black text-ink leading-none flex items-center gap-3">
            <Users size={32} className="text-brand-red shrink-0" strokeWidth={2.5} />
            Your <span className="text-brand-red">Circle.</span>
          </h1>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mt-2">
            Connect · Compete · Grow together
          </p>
        </div>
      </div>

      {/* ── Stats Strip ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Friends", value: friends?.length || 0, color: "text-ink" },
          { icon: Wifi, label: "Online Now", value: onlineFriendsCount, color: "text-online" },
          { icon: Clock, label: "Pending", value: pendingRequests?.length || 0, color: "text-brand-red" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white border border-rule/50 rounded-[6px] p-4 flex items-center gap-4 shadow-xs hover:shadow-sm hover:border-rule transition-all duration-200">
            <div className="w-9 h-9 rounded-[4px] bg-cream-dark/60 flex items-center justify-center shrink-0">
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className={`font-mono text-[18px] font-black leading-none ${color}`}>{value}</p>
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Search + Friends ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Search */}
          <div className="bg-white border border-rule/50 rounded-[8px] shadow-xs overflow-hidden">
            <div className="border-b border-rule/40 px-5 py-4 bg-faint/20 flex items-center gap-2">
              <Search size={14} className="text-muted" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-bold">Find Seekers</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  type="text"
                  placeholder="Search by @username or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cream-dark/30 border border-rule/60 px-11 py-3 rounded-[6px] font-sans text-[14px] text-ink placeholder:text-muted/60 focus:outline-none focus:border-ink focus:bg-white transition-all"
                />
                {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-muted" size={16} />}
              </div>

              {/* Search Results */}
              {searchQuery.length >= 2 && searchResults && (
                <div className="border border-rule/40 rounded-[6px] divide-y divide-rule/30 overflow-hidden">
                  {searchResults.length === 0 ? (
                    <div className="py-10 text-center">
                      <WifiOff size={24} className="mx-auto text-muted/30 mb-2" />
                      <p className="font-mono text-[10px] text-muted uppercase tracking-wider">No seekers found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    searchResults.map((user) => (
                      <div key={user.id} className="px-4 py-3 flex items-center justify-between hover:bg-cream/40 transition-colors">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full border border-rule/30 overflow-hidden bg-cream">
                              <AvatarDisplay user={user} size={40} />
                            </div>
                            {isOnline(user.id) && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-online border-2 border-white rounded-full" />}
                          </div>
                          <div className="truncate">
                            <Link to={`/u/${user.username || user.id}`} className="font-sans text-[13px] font-bold text-ink hover:text-brand-red transition-colors truncate block">
                              {user.name}
                            </Link>
                            <p className="font-mono text-[10px] text-muted lowercase">@{user.username}</p>
                          </div>
                        </div>
                        <div className="shrink-0 ml-2">
                          {user.friendshipStatus === "NONE" ? (
                            <button
                              onClick={() => sendRequestMutation.mutate(user.username || user.id)}
                              disabled={sendRequestMutation.isPending}
                              className="flex items-center gap-1.5 bg-ink text-cream px-3 py-1.5 rounded-[4px] font-mono text-[10px] uppercase font-bold hover:bg-ink-light transition-all disabled:opacity-50 cursor-pointer"
                            >
                              {sendRequestMutation.isPending ? <Loader2 size={11} className="animate-spin" /> : <UserPlus size={11} />}
                              Add
                            </button>
                          ) : user.friendshipStatus === "PENDING_SENT" ? (
                            <div className="flex items-center gap-1.5 bg-cream-dark border border-rule px-3 py-1.5 rounded-[4px] text-muted font-mono text-[10px] uppercase">
                              <Clock size={11} /> Sent
                            </div>
                          ) : user.friendshipStatus === "PENDING_RECEIVED" ? (
                            <button
                              onClick={() => acceptRequestMutation.mutate(user.friendshipId)}
                              className="flex items-center gap-1.5 bg-ink text-cream px-3 py-1.5 rounded-[4px] font-mono text-[10px] uppercase font-bold hover:bg-ink-light transition-all cursor-pointer"
                            >
                              <Check size={11} /> Accept
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-online/10 border border-online/20 px-3 py-1.5 rounded-[4px] text-online font-mono text-[10px] font-bold uppercase">
                              <Check size={11} /> Friends
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {searchQuery.length < 2 && searchQuery.length > 0 && (
                <p className="font-mono text-[10px] text-muted uppercase tracking-wider text-center py-2">
                  Type at least 2 characters to search
                </p>
              )}
            </div>
          </div>

          {/* Friends List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[22px] font-black text-ink flex items-center gap-2">
                Friends
                {isLoadingFriends && <Loader2 size={16} className="animate-spin text-muted" />}
              </h2>
              {friends?.length > 0 && (
                <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                  {onlineFriendsCount} online
                </span>
              )}
            </div>

            {isLoadingFriends ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white border border-rule/40 rounded-[8px] p-4 flex items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-cream-dark shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-cream-dark rounded w-24" />
                      <div className="h-2.5 bg-cream-dark rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : friends?.length === 0 ? (
              <div className="py-16 border-2 border-dashed border-rule/40 rounded-[8px] text-center bg-faint/10">
                <Users size={32} className="mx-auto text-muted/20 mb-3" />
                <p className="font-sans text-[15px] font-bold text-muted">No friends yet</p>
                <p className="font-mono text-[10px] text-muted/50 mt-1.5 uppercase tracking-widest">Search above to find other seekers</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {friends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    isOnline={isOnline}
                    onMenu={(id) => {
                      if (activeMenuId === id) { setActiveMenuId(null); setShowConfirmUnfriend(false); }
                      else { setActiveMenuId(id); setShowConfirmUnfriend(false); }
                    }}
                    activeMenuId={activeMenuId}
                    showConfirmUnfriend={showConfirmUnfriend}
                    setShowConfirmUnfriend={setShowConfirmUnfriend}
                    onRemove={(id) => removeFriendshipMutation.mutate(id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Pending + Tip ──────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Pending Requests */}
          <div className="bg-white border border-rule/50 rounded-[8px] shadow-xs overflow-hidden">
            <div className="border-b border-rule/40 px-5 py-4 bg-faint/20 flex items-center justify-between rounded-t-[8px]">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-muted" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-bold">Requests</span>
              </div>
              {pendingRequests?.length > 0 && (
                <span className="bg-brand-red text-white font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </div>

            <div className="divide-y divide-rule/30">
              {isLoadingPending ? (
                <div className="p-6 space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-cream-dark shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-cream-dark rounded w-20" />
                        <div className="h-2 bg-cream-dark rounded w-14" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : pendingRequests?.length === 0 ? (
                <div className="py-10 text-center">
                  <Sparkles size={20} className="mx-auto text-muted/20 mb-2" />
                  <p className="font-mono text-[10px] text-muted uppercase tracking-wider">All caught up!</p>
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div key={req.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-rule/30 overflow-hidden bg-cream shrink-0">
                        <AvatarDisplay user={req.sender} size={40} />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <Link
                          to={`/u/${req.sender.username || req.sender.id}`}
                          className="font-sans text-[13px] font-bold text-ink hover:text-brand-red transition-colors truncate block"
                        >
                          {req.sender.name}
                        </Link>
                        <p className="font-mono text-[10px] text-muted lowercase">@{req.sender.username}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptRequestMutation.mutate(req.id)}
                        disabled={acceptRequestMutation.isPending}
                        className="flex-1 bg-ink text-cream py-2 rounded-[4px] font-mono text-[10px] font-black uppercase hover:bg-ink-light transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {acceptRequestMutation.isPending ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                        Accept
                      </button>
                      <button
                        onClick={() => removeFriendshipMutation.mutate(req.id)}
                        disabled={removeFriendshipMutation.isPending}
                        className="px-3 py-2 border border-rule text-muted hover:text-brand-red hover:border-brand-red/30 hover:bg-brand-red/5 rounded-[4px] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {removeFriendshipMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Motivational Banner */}
          <div className="relative overflow-hidden bg-ink rounded-[8px] p-5 border border-ink shadow-md">
            <div className="absolute right-0 top-0 w-32 h-full opacity-5 pointer-events-none">
              <Users size={120} className="text-cream absolute -right-4 -top-4" />
            </div>
            <div className="relative z-10 flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-[4px] bg-lime/10 border border-lime/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={14} className="text-lime" />
              </div>
              <div>
                <p className="font-serif text-[16px] font-black text-cream leading-snug">
                  Did you know?
                </p>
                <p className="font-mono text-[9px] text-cream/50 uppercase tracking-widest mt-1">
                  Friends help you grow faster
                </p>
              </div>
            </div>
            <p className="font-sans text-[12px] text-cream/70 leading-relaxed mb-4 relative z-10">
              Adding friends lets you track their progress on the leaderboard and celebrate milestones together.
            </p>
            <Link
              to="/leaderboard?scope=friends"
              className="relative z-10 flex items-center gap-2 bg-lime text-lime-dark hover:bg-lime-light transition-all px-4 py-2 rounded-[6px] font-mono text-[10px] uppercase font-black tracking-wider w-full justify-center cursor-pointer shadow-sm"
            >
              <BookOpen size={11} />
              View Friends Leaderboard
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
