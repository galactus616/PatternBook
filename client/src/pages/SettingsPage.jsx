import React, { useState } from 'react';
import { User, CreditCard, SlidersHorizontal, Shield } from 'lucide-react';
import ProfileSection from '../features/settings/ProfileSection';
import SubscriptionSection from '../features/settings/SubscriptionSection';
import PreferencesSection from '../features/settings/PreferencesSection';
import DangerZoneSection from '../features/settings/DangerZoneSection';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { id: 'danger', label: 'Danger Zone', icon: Shield },
];

const SECTION_MAP = {
  profile: ProfileSection,
  subscription: SubscriptionSection,
  preferences: PreferencesSection,
  danger: DangerZoneSection,
};

const SettingsPage = () => {
  const [active, setActive] = useState('profile');
  const ActiveSection = SECTION_MAP[active];

  return (
    <div className="max-w-[1200px] mx-auto px-8 flex gap-10 pt-8 pb-10">
      {/* Left: Sticky Vertical Nav */}
      <nav className="w-[180px] shrink-0">
        <div className="sticky top-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted mb-3 px-2">Settings</p>
          <div className="space-y-px">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`
                  w-full flex items-center gap-2.5 px-2 py-[7px] rounded-[3px] font-sans text-[12px] font-medium tracking-wide transition-all duration-150 cursor-pointer text-left
                  ${active === id
                    ? id === 'danger'
                      ? 'bg-brand-red/8 text-brand-red'
                      : 'bg-ink/[0.05] text-ink'
                    : 'text-muted/70 hover:text-ink hover:bg-ink/[0.02]'
                  }
                `}
              >
                <Icon size={13} strokeWidth={active === id ? 2.2 : 1.8} />
                {label}
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