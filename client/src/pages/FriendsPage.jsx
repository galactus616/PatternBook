import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  UserPlus,
  UserMinus,
  Check,
  X,
  Search,
  Loader2,
  ExternalLink,
  MessageSquare,
  Clock,
  MoreVertical
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getFriends,
  getPendingRequests,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendship
} from "../features/friends/friends.api";
import { useToastStore } from "../store/useToastStore";
import { useAuth } from "../features/auth/useAuth";
import { useSocket } from "../features/auth/SocketContext";
import AvatarDisplay from "../components/ui/AvatarDisplay";

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { socket, onlineUsers } = useSocket();
  const { user: authUser } = useAuth();
  
  const isOnline = (userId) => onlineUsers?.includes(userId);

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showConfirmUnfriend, setShowConfirmUnfriend] = useState(false);

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveMenuId(null);
      setShowConfirmUnfriend(false);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const setSearchQuery = (query) => {
    if (query) {
      setSearchParams({ q: query }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  // Queries
  const { data: friends, isLoading: isLoadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const { data: pendingRequests, isLoading: isLoadingPending } = useQuery({
    queryKey: ["pendingRequests"],
    queryFn: getPendingRequests,
  });

  const { data: searchResults, isFetching: isSearching } = useQuery({
    queryKey: ["userSearch", searchQuery],
    queryFn: () => searchUsers(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  // Mutations
  const sendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (data, receiverIdentifier) => {
      // Manual update of search results for instant swap AFTER success
      queryClient.setQueryData(["userSearch", searchQuery], old =>
        old?.map(u => (u.id === receiverIdentifier || u.username === receiverIdentifier)
          ? { ...u, friendshipStatus: "PENDING_SENT" }
          : u
        )
      );
      addToast("Friend request sent", "success");
    },
    onError: (err) => {
      addToast(err.response?.data?.message || "Failed to send request", "error");
    }
  });

  const acceptRequestMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: (data, requestId) => {
      // Find the request being accepted
      const pending = queryClient.getQueryData(["pendingRequests"]);
      const acceptedReq = pending?.find(r => r.id === requestId);

      if (acceptedReq) {
        // Remove from pending
        queryClient.setQueryData(["pendingRequests"], old => old.filter(r => r.id !== requestId));
        // Add to friends
        queryClient.setQueryData(["friends"], old => [...(old || []), acceptedReq.sender]);
      }

      addToast("Friend request accepted", "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
    }
  });

  const removeFriendshipMutation = useMutation({
    mutationFn: removeFriendship,
    onSuccess: (data, requestId) => {
      // Check if they were an active friend
      const activeFriends = queryClient.getQueryData(["friends"]);
      const wasFriend = activeFriends?.some(f => f.friendshipId === requestId || f.id === requestId);

      // Manual remove for instant swap
      queryClient.setQueryData(["friends"], old => old?.filter(f => f.id !== requestId && f.friendshipId !== requestId));
      queryClient.setQueryData(["pendingRequests"], old => old?.filter(r => r.id !== requestId));
      
      if (wasFriend) {
        addToast("Friend removed", "success");
      } else {
        addToast("Request cancelled", "success");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
    }
  });



  return (
    <div className="max-w-5xl mx-auto px-8 py-10 space-y-10 animate-in fade-in duration-500">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[36px] font-black text-ink leading-tight">Community</h1>
          <p className="font-mono text-[12px] text-muted uppercase tracking-widest mt-1">Connect with other seekers</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-rule px-4 py-2 rounded-[4px]">
            <p className="font-mono text-[10px] uppercase text-muted leading-none">Friends</p>
            <p className="font-serif text-[18px] font-black text-ink mt-1">{friends?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Main Column: Friends List & Search ──────────────── */}
        <div className="lg:col-span-2 space-y-10">

          {/* Search Section */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="text"
                placeholder="Find someone by @username or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-rule px-12 py-4 rounded-[4px] font-sans text-[16px] text-ink focus:border-ink transition-all outline-none shadow-sm"
              />
              {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-muted" size={18} />}
            </div>

            {/* Search Results Dropdown-style */}
            {searchQuery.length >= 2 && searchResults && (
              <div className="bg-white border border-rule/50 rounded-[6px] divide-y divide-rule/30 shadow-md overflow-hidden">
                {searchResults.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="font-mono text-[11px] text-muted uppercase tracking-wider">No seekers found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  searchResults.map((user) => (
                    <div key={user.id} className="p-3.5 flex items-center justify-between hover:bg-cream/20 transition-colors">
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 rounded-full border border-rule/30 overflow-hidden bg-cream flex items-center justify-center">
                            <AvatarDisplay user={user} size={44} />
                          </div>
                          {isOnline(user.id) && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-online border-2 border-white rounded-full z-10 shadow-sm" />
                          )}
                        </div>
                        <div className="truncate">
                          <Link 
                            to={`/u/${user.username || user.id}`}
                            className="font-sans text-[14px] font-bold text-ink hover:text-brand-red transition-colors truncate block"
                          >
                            {user.name}
                          </Link>
                          <p className="font-mono text-[10px] text-muted lowercase tracking-wide truncate">@{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Link 
                          to={`/u/${user.username || user.id}`} 
                          className="p-2 text-muted hover:text-ink hover:bg-cream rounded-full transition-all cursor-pointer"
                          title="View Profile"
                        >
                          <Users size={15} />
                        </Link>

                        {user.friendshipStatus === "NONE" ? (
                          <button
                            onClick={() => sendRequestMutation.mutate(user.username || user.id)}
                            disabled={sendRequestMutation.isPending}
                            className="flex items-center gap-1.5 bg-ink text-cream px-3 py-1.5 rounded-[4px] font-mono text-[10px] uppercase font-bold hover:bg-ink-light transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {sendRequestMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={12} />}
                            Add
                          </button>
                        ) : user.friendshipStatus === "PENDING_SENT" ? (
                          <div className="flex items-center gap-1.5 bg-cream/80 border border-rule px-3 py-1.5 rounded-[4px] text-muted font-mono text-[10px] uppercase tracking-wider">
                            <Clock size={12} />
                            Sent
                          </div>
                        ) : user.friendshipStatus === "PENDING_RECEIVED" ? (
                          <button
                            onClick={() => acceptRequestMutation.mutate(user.friendshipId)}
                            className="flex items-center gap-1.5 bg-ink text-cream px-3 py-1.5 rounded-[4px] font-mono text-[10px] uppercase font-bold hover:bg-ink-light transition-all cursor-pointer"
                          >
                            <Check size={12} />
                            Accept
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-cream/80 border border-rule px-3 py-1.5 rounded-[4px] text-muted font-mono text-[10px] font-bold uppercase">
                            <Check size={12} className="text-lime-dark" />
                            Friends
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Friends List */}
          <div className="space-y-6">
            <h3 className="font-serif text-[24px] font-black text-ink flex items-center gap-3">
              Your Friends
              {isLoadingFriends && <Loader2 size={18} className="animate-spin text-muted" />}
            </h3>

            {friends?.length === 0 ? (
              <div className="p-12 border-2 border-dashed border-rule/50 rounded-[6px] text-center bg-faint/10">
                <Users size={28} className="mx-auto text-muted/30 mb-3" />
                <p className="font-sans text-[15px] text-muted font-bold">Your friends list is empty.</p>
                <p className="font-mono text-[10px] text-muted/50 mt-1 uppercase tracking-widest">Search above to find and add other seekers</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends?.map((friend) => (
                  <div 
                    key={friend.id} 
                    className="bg-white border border-rule/50 p-4 rounded-[6px] flex items-center justify-between hover:shadow-xs hover:border-rule transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full border border-rule/30 overflow-hidden bg-cream flex items-center justify-center">
                          <AvatarDisplay user={friend} size={48} />
                        </div>
                        {isOnline(friend.id) && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-online border-2 border-white rounded-full z-10 shadow-sm" />
                        )}
                      </div>
                      <div className="truncate">
                        <Link 
                          to={`/u/${friend.username || friend.id}`} 
                          className="font-sans text-[14px] font-bold text-ink hover:text-brand-red transition-colors truncate block"
                        >
                          {friend.name}
                        </Link>
                        <p className="font-mono text-[10px] text-muted lowercase tracking-wide truncate">@{friend.username}</p>
                      </div>
                    </div>
                    <div className="relative shrink-0">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeMenuId === friend.id) {
                            setActiveMenuId(null);
                            setShowConfirmUnfriend(false);
                          } else {
                            setActiveMenuId(friend.id);
                            setShowConfirmUnfriend(false);
                          }
                        }}
                        className="p-2 text-muted hover:text-ink hover:bg-cream rounded-full transition-all cursor-pointer"
                        title="More Options"
                      >
                        <MoreVertical size={15} />
                      </button>

                      {activeMenuId === friend.id && (
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-rule/50 rounded-[4px] shadow-lg py-1 z-20 animate-in fade-in slide-in-from-top-1 duration-150">
                          {!showConfirmUnfriend ? (
                            <>
                              <Link 
                                to={`/u/${friend.username || friend.id}`}
                                className="w-full text-left px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted hover:text-ink hover:bg-cream transition-colors flex items-center gap-2"
                              >
                                <Users size={12} />
                                Profile
                              </Link>
                              <button 
                                onClick={() => addToast("Messaging feature coming soon!", "info")}
                                className="w-full text-left px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted hover:text-ink hover:bg-cream transition-colors flex items-center gap-2 cursor-pointer"
                              >
                                <MessageSquare size={12} />
                                Message
                              </button>
                              <div className="border-t border-rule/30 my-1" />
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowConfirmUnfriend(true);
                                }}
                                className="w-full text-left px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-brand-red hover:bg-brand-red/5 transition-colors flex items-center gap-2 cursor-pointer font-bold"
                              >
                                <UserMinus size={12} />
                                Unfriend
                              </button>
                            </>
                          ) : (
                            <div className="px-3 py-2 space-y-2">
                              <p className="font-mono text-[9px] uppercase tracking-wider text-ink font-bold leading-tight">Unfriend {friend.name}?</p>
                              <div className="flex gap-1.5">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFriendshipMutation.mutate(friend.friendshipId || friend.id);
                                    setActiveMenuId(null);
                                    setShowConfirmUnfriend(false);
                                  }}
                                  className="flex-1 bg-brand-red text-cream py-1 rounded-[3px] font-mono text-[9px] font-black uppercase hover:bg-brand-red/90 transition-all cursor-pointer text-center"
                                >
                                  Yes
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowConfirmUnfriend(false);
                                  }}
                                  className="flex-1 bg-cream-dark text-muted py-1 rounded-[3px] font-mono text-[9px] font-black uppercase hover:bg-cream-dark/80 transition-all cursor-pointer text-center"
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
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ── Sidebar Column: Pending Requests & Activity ──────── */}
        <div className="space-y-10">

          {/* Pending Requests */}
          <div className="bg-white border border-rule/50 rounded-[6px] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-rule bg-faint/30 flex items-center justify-between">
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Requests
              </h4>
              {pendingRequests?.length > 0 && (
                <span className="bg-brand-red text-white font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">{pendingRequests.length}</span>
              )}
            </div>

            <div className="p-2 divide-y divide-rule/30">
              {pendingRequests?.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="font-mono text-[10px] text-muted uppercase tracking-wider">No pending requests</p>
                </div>
              ) : (
                pendingRequests?.map((req) => (
                  <div key={req.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-rule/30 overflow-hidden bg-cream shrink-0">
                        <AvatarDisplay user={req.sender} size={40} />
                      </div>
                      <div className="overflow-hidden">
                        <Link 
                          to={`/u/${req.sender.username || req.sender.id}`}
                          className="font-sans text-[13px] font-bold text-ink hover:text-brand-red transition-colors truncate block"
                        >
                          {req.sender.name}
                        </Link>
                        <p className="font-mono text-[10px] text-muted lowercase truncate">@{req.sender.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => acceptRequestMutation.mutate(req.id)}
                        disabled={acceptRequestMutation.isPending}
                        className="flex-1 bg-ink text-cream py-1.5 rounded-[4px] font-mono text-[10px] font-black uppercase hover:bg-ink-light transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {acceptRequestMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                        Accept
                      </button>
                      <button
                        onClick={() => removeFriendshipMutation.mutate(req.id)}
                        disabled={removeFriendshipMutation.isPending}
                        className="p-1.5 border border-rule text-muted hover:text-brand-red hover:bg-brand-red/5 rounded-[4px] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {removeFriendshipMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Social Tip */}
          <div className="p-6 border-2 border-dashed border-rule rounded-[4px] bg-cream/20">
            <p className="font-serif text-[18px] font-black text-ink mb-2">Did you know?</p>
            <p className="font-sans text-[13px] text-muted leading-relaxed">
              Adding friends allows you to track their progress in the global leaderboard and see when they reach new mastery milestones.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FriendsPage;
