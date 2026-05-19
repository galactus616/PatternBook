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
  Clock
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
      // Manual remove for instant swap
      queryClient.setQueryData(["friends"], old => old?.filter(f => f.id !== requestId && f.friendshipId !== requestId));
      queryClient.setQueryData(["pendingRequests"], old => old?.filter(r => r.id !== requestId));
      addToast("Friendship updated", "success");
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
              <div className="bg-white border border-rule rounded-[4px] divide-y divide-rule shadow-md overflow-hidden">
                {searchResults.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="font-mono text-[12px] text-muted">No users found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  searchResults.map((user) => (
                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-cream/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-full border border-rule overflow-hidden bg-white flex items-center justify-center">
                            <AvatarDisplay user={user} size={48} />
                          </div>
                          {isOnline(user.id) && (
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-online border-2 border-white rounded-full z-10 shadow-sm" />
                          )}
                        </div>
                        <div>
                          <p className="font-sans text-[15px] font-bold text-ink">{user.name}</p>
                          <p className="font-mono text-[11px] text-muted lowercase tracking-wide">@{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/u/${user.username || user.id}`} className="p-2 border border-rule rounded-[4px] hover:bg-cream-dark transition-all cursor-pointer">
                          <ExternalLink size={16} />
                        </Link>

                        {user.friendshipStatus === "NONE" ? (
                          <button
                            onClick={() => sendRequestMutation.mutate(user.username || user.id)}
                            disabled={sendRequestMutation.isPending}
                            className="flex items-center gap-2 bg-ink text-cream px-4 py-2 rounded-[4px] font-mono text-[11px] uppercase font-bold hover:bg-ink-light transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {sendRequestMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                            Add
                          </button>
                        ) : user.friendshipStatus === "PENDING_SENT" ? (
                          <div className="flex items-center gap-2 bg-faint border border-rule px-4 py-2 rounded-[4px] text-muted font-mono text-[11px] uppercase tracking-wider">
                            <Clock size={14} />
                            Sent
                          </div>
                        ) : user.friendshipStatus === "PENDING_RECEIVED" ? (
                          <button
                            onClick={() => acceptRequestMutation.mutate(user.id)}
                            className="flex items-center gap-2 bg-lime text-ink border border-ink px-4 py-2 rounded-[4px] font-mono text-[11px] uppercase font-bold hover:bg-lime-dark transition-all cursor-pointer"
                          >
                            <UserCheck size={14} />
                            Accept
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-faint border border-rule px-4 py-2 rounded-[4px] text-ink font-mono text-[11px] font-bold uppercase">
                            <Check size={14} className="text-lime-dark" />
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
              <div className="p-12 border-2 border-dashed border-rule rounded-[8px] text-center bg-faint/20">
                <Users size={32} className="mx-auto text-rule mb-3" />
                <p className="font-sans text-[15px] text-muted">Your friends list is currently empty.</p>
                <p className="font-mono text-[11px] text-muted mt-1 uppercase tracking-widest">Search above to find and add seekers</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends?.map((friend) => (
                  <div key={friend.id} className="bg-white border border-rule p-5 rounded-[4px] flex items-center justify-between hover:border-ink transition-all group shadow-sm">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-full border border-rule overflow-hidden bg-white flex items-center justify-center">
                          <AvatarDisplay user={friend} size={56} />
                        </div>
                        {isOnline(friend.id) && (
                          <span className="absolute bottom-0 right-0 w-4 h-4 bg-online border-2 border-white rounded-full z-10 shadow-sm animate-pulse" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="font-sans text-[15px] font-bold text-ink truncate group-hover:text-brand-red transition-colors">{friend.name}</p>
                        <p className="font-mono text-[11px] text-muted lowercase tracking-wide truncate">@{friend.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/u/${friend.username || friend.id}`} className="p-2 border border-rule rounded-[4px] hover:bg-cream-dark transition-all cursor-pointer" title="View Profile">
                        <ExternalLink size={16} />
                      </Link>
                      <button className="p-2 border border-rule rounded-[4px] hover:bg-cream-dark transition-all text-muted hover:text-ink cursor-pointer" title="Message">
                        <MessageSquare size={16} />
                      </button>
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
          <div className="bg-white border border-rule rounded-[4px] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-rule bg-faint/30 flex items-center justify-between">
              <h4 className="font-mono text-[12px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Requests
              </h4>
              {pendingRequests?.length > 0 && (
                <span className="bg-brand-red text-white font-mono text-[10px] px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
              )}
            </div>

            <div className="p-2 divide-y divide-rule/50">
              {pendingRequests?.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="font-mono text-[10px] text-muted uppercase tracking-wider">No pending requests</p>
                </div>
              ) : (
                pendingRequests?.map((req) => (
                  <div key={req.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-ink overflow-hidden bg-white shrink-0">
                        <AvatarDisplay user={req.sender} size={40} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-sans text-[13px] font-bold text-ink truncate">{req.sender.name}</p>
                        <p className="font-mono text-[10px] text-muted lowercase truncate">@{req.sender.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => acceptRequestMutation.mutate(req.id)}
                        disabled={acceptRequestMutation.isPending}
                        className="flex-1 bg-ink text-cream border border-ink py-1.5 rounded-[2px] font-mono text-[10px] font-black uppercase hover:bg-ink-light transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {acceptRequestMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                        Accept
                      </button>
                      <button
                        onClick={() => removeFriendshipMutation.mutate(req.id)}
                        disabled={removeFriendshipMutation.isPending}
                        className="p-1.5 border border-rule text-muted hover:text-brand-red hover:border-brand-red rounded-[2px] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {removeFriendshipMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
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
