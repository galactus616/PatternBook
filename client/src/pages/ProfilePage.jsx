import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Trophy, Flame, Target, Calendar, Zap,
  Shield, BookOpen, Star, Award, Code2, TrendingUp, ArrowLeft,
  Copy, Check, UserPlus, UserCheck, Clock, Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPublicProfile } from '../features/profile/profile.api';
import { sendFriendRequest, acceptFriendRequest } from '../features/friends/friends.api';
import ProfileHeatmap from '../features/profile/ProfileHeatmap';
import { useAuth } from '../features/auth/useAuth';
import AvatarDisplay from '../components/ui/AvatarDisplay';
import { useToastStore } from '../store/useToastStore';

// ─── Rank config ──────────────────────────────────────────────────────────────
const RANK_CONFIG = {
  Architect: { color: 'text-brand-red', bg: 'bg-brand-red/8', border: 'border-brand-red/20', icon: Star },
  Grandmaster: { color: 'text-accent', bg: 'bg-accent/8', border: 'border-accent/20', icon: Star },
  Specialist: { color: 'text-lime-dark', bg: 'bg-lime/10', border: 'border-lime/20', icon: TrendingUp },
  Apprentice: { color: 'text-ink', bg: 'bg-ink/5', border: 'border-ink/10', icon: BookOpen },
  Novice: { color: 'text-muted', bg: 'bg-rule/20', border: 'border-rule/30', icon: Shield },
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color = 'text-ink' }) => (
  <div className="flex flex-col p-5 bg-white border border-rule/50 rounded-[6px] hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center gap-2 mb-3">
      <Icon size={13} className={`${color} opacity-60`} />
      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted">{label}</p>
    </div>
    <p className={`font-serif text-[30px] font-black leading-none ${color}`}>{value}</p>
    {sub && <p className="font-mono text-[8px] text-muted/50 uppercase tracking-wider mt-2">{sub}</p>}
  </div>
);

// ─── Mastery ring ─────────────────────────────────────────────────────────────
const MasteryRing = ({ percentage }) => {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * percentage) / 100;
  return (
    <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#c8c2b4" strokeWidth="7" strokeOpacity="0.2" />
        <circle cx="56" cy="56" r={r} fill="none" stroke="#d63a2f" strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="butt"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-[24px] font-black text-ink leading-none">{percentage}</span>
        <span className="font-mono text-[7px] uppercase tracking-widest text-muted mt-1">Mastery %</span>
      </div>
    </div>
  );
};

// ─── Difficulty bar ───────────────────────────────────────────────────────────
const DiffBar = ({ label, count, colorClass, barClass }) => (
  <div className="flex items-center gap-3">
    <span className={`font-mono text-[8px] uppercase tracking-widest w-14 ${colorClass}`}>{label}</span>
    <div className="flex-1 h-1 bg-rule/15 rounded-full overflow-hidden">
      <div className={`h-full ${barClass} transition-all duration-700 ease-out`} style={{ width: `${Math.min(100, count * 2.5)}%` }} />
    </div>
    <span className="font-mono text-[10px] font-bold text-ink w-5 text-right">{count}</span>
  </div>
);

// ─── Pattern badge ────────────────────────────────────────────────────────────
const PatternBadge = ({ name, solved, index }) => (
  <div className={`flex items-center justify-between px-3 py-2 rounded-[4px] border transition-all ${index === 0 ? 'bg-brand-red/5 border-brand-red/20' : 'bg-white/50 border-rule/30 hover:border-rule/60'
    }`}>
    <div className="flex items-center gap-2">
      {index === 0 && <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />}
      <span className={`font-sans text-[11px] font-bold truncate max-w-[130px] ${index === 0 ? 'text-brand-red' : 'text-ink'}`}>{name}</span>
    </div>
    <span className="font-mono text-[9px] font-bold text-muted">{solved}✓</span>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const ProfileSkeleton = ({ embedded }) => (
  <div className={`animate-pulse ${embedded ? 'p-8' : 'min-h-screen bg-cream p-8'}`}>
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-5">
        <div className="w-24 h-24 rounded-full bg-rule/30" />
        <div className="space-y-2">
          <div className="h-7 w-48 bg-rule/30 rounded" />
          <div className="h-4 w-28 bg-rule/20 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-rule/20 rounded-[6px]" />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-52 bg-rule/20 rounded-[6px]" />)}
      </div>
    </div>
  </div>
);

// ─── Not Found ────────────────────────────────────────────────────────────────
const ProfileNotFound = ({ embedded }) => (
  <div className={`flex flex-col items-center justify-center gap-6 text-center ${embedded ? 'py-24' : 'min-h-screen bg-cream'}`}>
    <div className="w-16 h-16 rounded-full bg-brand-red/8 flex items-center justify-center">
      <Shield size={28} className="text-brand-red opacity-30" />
    </div>
    <div>
      <h2 className="font-serif text-[28px] font-black text-ink mb-2">Profile Not Found</h2>
      <p className="font-mono text-[10px] text-muted uppercase tracking-widest">This seeker doesn't exist</p>
    </div>
    <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-ink text-cream font-mono text-[10px] uppercase tracking-widest rounded-[4px] hover:bg-ink/80 transition-all">
      <ArrowLeft size={12} /> Dashboard
    </Link>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const ProfilePage = ({ isPublic = false }) => {
  const { userId: paramUserId } = useParams();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const userId = isPublic ? paramUserId : authUser?.id;

  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['public-profile', userId],
    queryFn: () => fetchPublicProfile(userId),
    enabled: !!userId,
    retry: false,
  });

  const sendRequestMutation = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      // Manual update for instant swap AFTER success
      queryClient.setQueryData(['public-profile', userId], old => ({
        ...old,
        friendshipStatus: 'PENDING_SENT'
      }));
      addToast("Friend request sent", "success");
    },
    onError: (err) => {
      addToast(err.response?.data?.message || "Failed to send request", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries(['public-profile', userId]);
    }
  });

  const acceptRequestMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      // Manual update for instant swap AFTER success
      queryClient.setQueryData(['public-profile', userId], old => ({
        ...old,
        friendshipStatus: 'FRIEND'
      }));
      addToast("Friend request accepted", "success");
    },
    onError: () => {
      addToast("Failed to accept request", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries(['public-profile', userId]);
    }
  });

  const [animateRing, setAnimateRing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const identifier = profile?.username || profile?.id;
    navigator.clipboard.writeText(`${window.location.origin}/u/${identifier}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  useEffect(() => {
    if (profile) setTimeout(() => setAnimateRing(true), 200);
  }, [profile]);

  const embedded = !isPublic;

  if (isLoading) return <ProfileSkeleton embedded={embedded} />;
  if (isError || !profile) return <ProfileNotFound embedded={embedded} />;

  const rankConfig = RANK_CONFIG[profile.rank] || RANK_CONFIG['Novice'];
  const joinedYear = new Date(profile.joinedDate).getFullYear();

  const content = (
    <div className={`space-y-8 ${embedded ? 'max-w-4xl mx-auto px-8 py-8' : 'max-w-4xl mx-auto px-6 py-10'}`}>

      {isPublic && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted hover:text-ink transition-colors font-mono text-[11px] uppercase tracking-widest cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Community
        </button>
      )}

      {/* ── Profile Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center shrink-0">
            <AvatarDisplay user={profile} size={96} />
          </div>
          <div>
            <h1 className="font-serif text-[30px] font-black text-ink leading-none">
              {profile.name || 'Anonymous Seeker'}
            </h1>
            {profile.username && (
              <p className="font-mono text-[11px] text-muted mt-1 lowercase tracking-wide">@{profile.username}</p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-widest px-2 py-1 rounded-[3px] border ${rankConfig.bg} ${rankConfig.border} ${rankConfig.color}`}>
                <Award size={9} /> {profile.rank}
              </span>
              {(profile.plan === 'PRO' || profile.plan === 'TEAM') && (
                <span className="flex items-center gap-1 bg-ink text-lime font-mono text-[8px] px-2 py-1 rounded-[2px] uppercase tracking-widest">
                  <Zap size={9} /> Pro
                </span>
              )}
              <span className="font-mono text-[8px] text-muted/50 uppercase tracking-widest">
                Joined {joinedYear}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {profile.friendshipStatus !== 'SELF' && profile.friendshipStatus !== 'NONE' && (
          <div className="flex items-center gap-3">
            {profile.friendshipStatus === 'FRIEND' && (
              <div className="flex items-center gap-2 bg-faint border border-rule px-4 py-2 rounded-[4px] text-ink font-mono text-[12px] font-bold">
                <UserCheck size={16} className="text-lime-dark" />
                Friends
              </div>
            )}
            {profile.friendshipStatus === 'PENDING_SENT' && (
              <div className="flex items-center gap-2 bg-white border border-rule px-4 py-2 rounded-[4px] text-muted font-mono text-[12px] uppercase tracking-wider">
                <Clock size={16} />
                Request Sent
              </div>
            )}
            {profile.friendshipStatus === 'PENDING_RECEIVED' && (
              <button
                onClick={() => acceptRequestMutation.mutate(profile.requestId)}
                disabled={acceptRequestMutation.isPending}
                className="flex items-center gap-2 bg-ink text-cream px-6 py-2.5 rounded-[4px] font-mono text-[12px] font-black uppercase hover:bg-ink-light transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {acceptRequestMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                Accept Request
              </button>
            )}
          </div>
        )}

        {profile.friendshipStatus === 'NONE' && authUser && (
          <button
            onClick={() => sendRequestMutation.mutate(profile.username || profile.id)}
            disabled={sendRequestMutation.isPending}
            className="flex items-center gap-2 bg-ink text-cream px-6 py-2.5 rounded-[4px] font-mono text-[12px] font-black uppercase hover:bg-ink-light transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            {sendRequestMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            Add Friend
          </button>
        )}

        <MasteryRing percentage={animateRing ? (profile.stats?.masteryPercentage || 0) : 0} />
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Code2} label="Solved" value={profile.stats?.solvedCount || 0} sub="Problems mastered" color="text-ink" />
        <StatCard icon={Flame} label="Streak" value={`${profile.currentStreak}d`} sub="Current streak" color="text-brand-red" />
        <StatCard icon={Trophy} label="Best Streak" value={`${profile.longestStreak}d`} sub="All-time record" color="text-accent" />
        <StatCard icon={Calendar} label="Active" value={profile.monthsActive} sub={`Since ${joinedYear}`} color="text-muted" />
      </div>

      {/* ── 3-Col Main ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Difficulty Breakdown */}
        <div className="bg-white border border-rule/50 rounded-[6px] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-[15px] font-black text-ink">Difficulty</h3>
            <Target size={13} className="text-muted/40" />
          </div>
          <div className="space-y-4">
            <DiffBar label="Easy" count={profile.stats?.difficultyStats?.EASY || 0} colorClass="text-lime-dark" barClass="bg-lime-dark" />
            <DiffBar label="Medium" count={profile.stats?.difficultyStats?.MEDIUM || 0} colorClass="text-accent" barClass="bg-accent" />
            <DiffBar label="Hard" count={profile.stats?.difficultyStats?.HARD || 0} colorClass="text-brand-red" barClass="bg-brand-red" />
          </div>
          <div className="mt-5 pt-4 border-t border-rule/30">
            <div className="h-1.5 w-full bg-rule/10 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-lime-dark via-accent to-brand-red"
                style={{ width: `${profile.stats?.masteryPercentage || 0}%`, transition: 'width 1.2s ease-out' }} />
            </div>
            <p className="font-mono text-[8px] text-muted/50 uppercase tracking-widest mt-2 text-right">
              {profile.stats?.masteryPercentage || 0}% total mastery
            </p>
          </div>
        </div>

        {/* Top Patterns */}
        <div className="bg-white border border-rule/50 rounded-[6px] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-[15px] font-black text-ink">Top Patterns</h3>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
          </div>
          {profile.topPatterns?.length > 0 ? (
            <div className="space-y-2">
              {profile.topPatterns.map((p, i) => (
                <PatternBadge key={p.name} name={p.name} solved={p.solved} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen size={22} className="text-muted/20 mb-3" />
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted/40">No patterns mastered yet</p>
            </div>
          )}
        </div>

        {/* Streak visual */}
        <div className="bg-white border border-rule/50 rounded-[6px] p-5 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-[15px] font-black text-ink">Streak</h3>
            <Flame size={13} className="text-brand-red" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-5">
            <div className="text-center">
              <div className="relative inline-block">
                <span className="font-serif text-[64px] font-black text-ink leading-none">{profile.currentStreak}</span>
                <Flame size={18} className="absolute -top-1 -right-5 text-brand-red fill-brand-red animate-pulse" />
              </div>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted mt-1">Day streak</p>
            </div>
            <div className="w-full h-px bg-rule/30" />
            <div className="w-full flex items-center justify-around">
              <div className="text-center">
                <p className="font-serif text-[22px] font-black text-muted">{profile.longestStreak}</p>
                <p className="font-mono text-[7px] uppercase tracking-widest text-muted/50">Best</p>
              </div>
              <div className="w-px h-8 bg-rule/30" />
              <div className="text-center">
                <p className="font-serif text-[22px] font-black text-muted">{profile.monthsActive}</p>
                <p className="font-mono text-[7px] uppercase tracking-widest text-muted/50">Months</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Heatmap ────────────────────────────────────────────── */}
      <div className="bg-white border border-rule/50 rounded-[6px] p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-serif text-[15px] font-black text-ink">Consistency Log</h3>
            <p className="font-mono text-[8px] text-muted/40 uppercase tracking-widest mt-1">{new Date().getFullYear()}</p>
          </div>
          <span className="font-mono text-[8px] text-muted/30 uppercase tracking-widest italic">365 days</span>
        </div>
        <ProfileHeatmap data={profile.heatmapData} />
      </div>

      {/* Public share link — only in embedded mode */}
      {embedded && (
        <div className="flex items-center justify-between px-4 py-3 bg-cream-dark/40 border border-rule/30 rounded-[4px]">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Public Profile Link</p>
            <p className="font-mono text-[10px] text-ink mt-0.5 font-bold">
              {window.location.origin}/u/{profile.username || profile.id}
            </p>
          </div>
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-[3px] transition-all duration-200 cursor-pointer ${copied
              ? 'bg-lime-dark text-cream'
              : 'bg-ink text-cream hover:bg-ink/80'
              }`}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );

  // Standalone public page gets its own header chrome
  if (isPublic) {
    return (
      <div className="min-h-screen bg-cream grain font-sans">
        {content}
      </div>
    );
  }

  // Embedded in DashboardLayout — just the content
  return content;
};

export default ProfilePage;
