import React, { useState } from 'react';
import { User, CreditCard, SlidersHorizontal, Shield, Users } from 'lucide-react';
import ProfileSection from '../features/settings/ProfileSection';
import SubscriptionSection from '../features/settings/SubscriptionSection';
import DangerZoneSection from '../features/settings/DangerZoneSection';
import TeamSection from '../features/settings/TeamSection';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'team', label: 'Team', icon: Users, disabled: true },
  { id: 'danger', label: 'Danger Zone', icon: Shield },
];

const SECTION_MAP = {
  profile: ProfileSection,
  subscription: SubscriptionSection,
  team: TeamSection,
  danger: DangerZoneSection,
};

const SettingsPage = () => {
  const [active, setActive] = useState('profile');
  const ActiveSection = SECTION_MAP[active];

  return (
    <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row gap-10 pt-8 pb-10">
      {/* Left: Sticky Vertical Nav */}
      <nav className="w-full md:w-[180px] shrink-0">
        <div className="sticky top-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted mb-3 px-2">Settings</p>
          <div className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => !id.disabled && setActive(id)}
                disabled={id === 'team'}
                className={`
                  w-auto md:w-full flex items-center justify-between px-3 md:px-2 py-[7px] rounded-[3px] font-sans text-[12px] font-medium tracking-wide transition-all duration-150 whitespace-nowrap
                  ${active === id
                    ? id === 'danger'
                      ? 'bg-brand-red/10 text-brand-red border border-brand-red/20'
                      : 'bg-ink/5 text-ink border border-ink/10'
                    : 'text-muted/70 hover:text-ink hover:bg-ink/5 border border-transparent'
                  }
                  ${id === 'team' ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={13} strokeWidth={active === id ? 2.2 : 1.8} />
                  {label}
                </div>
                {id === 'team' && (
                  <span className="font-mono text-[7px] bg-ink/10 px-1 py-0.5 rounded-[1px] ml-2">SOON</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Right: Content */}
      <div className="flex-1 min-w-0 max-w-[680px]" key={active}>
        <ActiveSection />
      </div>
    </div>
  );
};

export default SettingsPage;