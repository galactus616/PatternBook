import React from 'react';
import { Users, UserPlus, Key, LogOut, User } from 'lucide-react';
import { useAuth } from '../auth/useAuth';

const TeamSection = () => {
  const { user } = useAuth();
  
  // Since we haven't implemented backend for teams yet,
  // we check if they are explicitly on a TEAM plan.
  const isTeamPlan = user?.plan === 'TEAM';
  
  // Simulated Team Data for UI representation
  const team = isTeamPlan ? {
    name: "Alpha Hackers",
    inviteCode: "ALPH-982X",
    role: "OWNER", // Can toggle to "MEMBER" to see other view
    members: [
      { id: 1, name: user?.name || "John Doe", email: user?.email || "john@example.com", role: "OWNER" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "MEMBER" },
    ]
  } : null;

  return (
    <div className="bg-white border border-rule rounded-[4px] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-rule bg-faint/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={16} className="text-ink" />
          <h3 className="font-serif text-[18px] font-black text-ink">Team Management</h3>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted">Collaborative Learning</p>
      </div>

      <div className="p-6 space-y-7">
        {!isTeamPlan ? (
          <div className="text-center py-12 px-6 border border-dashed border-rule/50 rounded-[4px] bg-cream-dark/20">
            <div className="w-16 h-16 rounded-full bg-white border border-rule flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Users size={24} className="text-ink" />
            </div>
            <h4 className="font-serif text-[20px] font-black text-ink leading-tight mb-2">Build Together</h4>
            <p className="font-sans text-[13px] text-muted max-w-[300px] mx-auto mb-6">
              Upgrade to the Team Plan to invite friends, track each other's progress, and share private team notes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-ink text-cream font-sans text-[12px] font-bold py-2.5 px-6 rounded-[4px] tracking-wide hover:bg-ink-light transition-all cursor-pointer">
                Upgrade to Team Plan
              </button>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted font-bold">OR</span>
              <button className="bg-white border border-rule text-ink font-sans text-[12px] font-bold py-2.5 px-6 rounded-[4px] tracking-wide hover:bg-faint transition-all cursor-pointer">
                Join Existing Team
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Team Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-rule p-5 rounded-[4px] bg-white gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-ink text-lime flex items-center justify-center font-serif text-[20px] font-black shrink-0">
                  {team.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif text-[20px] font-black text-ink leading-tight">{team.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-[2px] bg-faint border border-rule text-muted font-bold">
                      {team.role}
                    </span>
                    <span className="font-mono text-[10px] text-muted">{team.members.length} Members</span>
                  </div>
                </div>
              </div>
              {team.role === 'OWNER' && (
                <div className="sm:text-right">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1 font-bold">Invite Code</p>
                  <div className="flex items-center gap-2 bg-faint border border-rule px-3 py-1.5 rounded-[4px] w-max">
                    <Key size={12} className="text-ink" />
                    <span className="font-mono text-[13px] text-ink font-bold tracking-widest">{team.inviteCode}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-rule/50" />

            {/* Members List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted font-bold">Team Roster</p>
                {team.role === 'OWNER' && (
                  <button className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-ink hover:text-brand-red font-bold transition-colors cursor-pointer bg-white border border-rule px-2 py-1 rounded-[2px] hover:border-brand-red">
                    <UserPlus size={12} /> Invite Member
                  </button>
                )}
              </div>
              
              <div className="border border-rule rounded-[4px] divide-y divide-rule/50 overflow-hidden">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-white hover:bg-cream-dark/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-faint border border-rule flex items-center justify-center">
                        <User size={14} className="text-muted" />
                      </div>
                      <div>
                        <p className="font-sans text-[13px] font-bold text-ink">
                          {member.name} {member.id === 1 && "(You)"}
                        </p>
                        <p className="font-mono text-[10px] text-muted">{member.email}</p>
                      </div>
                    </div>
                    {member.role === 'OWNER' ? (
                      <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-[2px] bg-ink text-cream font-bold">Owner</span>
                    ) : (
                      team.role === 'OWNER' ? (
                        <button className="font-mono text-[10px] uppercase tracking-widest text-brand-red font-bold hover:underline cursor-pointer">
                          Remove
                        </button>
                      ) : (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-[2px] bg-faint border border-rule text-muted">Member</span>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Team */}
            {team.role === 'MEMBER' && (
              <div className="mt-8 border border-brand-red/20 bg-brand-red/5 p-4 rounded-[4px] flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-[13px] font-bold text-brand-red leading-tight">Leave Team</h4>
                  <p className="font-mono text-[10px] text-brand-red/70 mt-0.5 uppercase tracking-wider">
                    You will lose access to team notes and tracking.
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-brand-red text-white font-sans text-[11px] font-bold py-2 px-4 rounded-[4px] hover:bg-brand-red/90 transition-all cursor-pointer">
                  <LogOut size={12} /> Leave
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamSection;
