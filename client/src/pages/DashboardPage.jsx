import React from 'react'
import { useAuth } from '../features/auth/useAuth'
import { Clock, CheckCircle, Zap } from 'lucide-react'

const DashboardPage = () => {
  const { user } = useAuth();

  const summaries = [
    { label: "Mastery Score", val: "740", icon: Zap, color: "text-lime-dark bg-lime" },
    { label: "Solved Today", val: "4", icon: CheckCircle, color: "text-brand-red bg-brand-red/10" },
    { label: "Study Time", val: "1.2h", icon: Clock, color: "text-ink bg-faint" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2">Welcome back</p>
        <h1 className="font-serif text-[42px] font-black text-ink leading-none">
          Morning, <em className="text-brand-red italic">{user?.name?.split(' ')[0] || "Developer"}</em>.
        </h1>
        <p className="text-muted mt-4 max-w-[500px] leading-relaxed">
          You're 12 problems away from mastering the <span className="text-ink font-bold underline decoration-lime decoration-2 underline-offset-4">Sliding Window</span> pattern. Ready to push?
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaries.map((s) => (
          <div key={s.label} className="p-8 bg-white border border-rule rounded-[4px] shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-6 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-1">{s.label}</p>
            <h3 className="font-serif text-[32px] font-black text-ink">{s.val}</h3>
            <div className="mt-4 h-1 w-full bg-cream rounded-full overflow-hidden">
              <div className="h-full bg-ink w-2/3 group-hover:w-3/4 transition-all duration-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <div className="border-t border-rule pt-10">
        <h2 className="font-serif text-[24px] font-black text-ink mb-6">Continue Practicing</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-6 bg-cream-dark/30 border border-rule rounded-[4px] flex items-center justify-between hover:border-ink transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-lime" />
              <div>
                <p className="text-[14px] font-bold text-ink">Longest Substring Without Repeating Characters</p>
                <p className="font-mono text-[10px] text-muted uppercase mt-0.5">Pattern: Sliding Window · Medium</p>
              </div>
            </div>
            <span className="text-[12px] font-bold text-muted group-hover:text-ink transition-colors">Resume →</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage