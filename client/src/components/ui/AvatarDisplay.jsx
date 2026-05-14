import React from 'react';
import Avvvatars from 'avvvatars-react';
import Avatar from 'boring-avatars';
import { User } from 'lucide-react';

const AvatarDisplay = ({ user, size = 32, className = '' }) => {
  if (!user) {
    return (
      <div className={`flex items-center justify-center bg-faint rounded-full ${className}`} style={{ width: size, height: size }}>
        <User size={size / 2} className="text-muted" />
      </div>
    );
  }

  const picture = user.picture || `avvatar:${user.id || user.email || 'seeker'}`;

  // 1. HTTP URLs (Google, etc.)
  if (picture.startsWith('http')) {
    return (
      <img 
        src={picture} 
        alt={user.name || "Avatar"} 
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  // 2. DiceBear API (Adventurer, etc.)
  if (picture.startsWith('dicebear:')) {
    const parts = picture.split(':');
    const style = parts[1] || 'adventurer';
    const seed = parts[2] || 'seeker';
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear&backgroundColor=b8fb3c,ffffff,ea4335`;
    
    return (
      <img 
        src={url} 
        alt="Avatar" 
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  // 3. Boring Avatars
  if (picture.startsWith('boring:')) {
    const parts = picture.split(':');
    const style = parts[1] || 'marble';
    const seed = parts[2] || 'seeker';
    return (
      <div className={`flex items-center justify-center overflow-hidden ${className}`}>
        <Avatar
          size={size}
          name={seed}
          variant={style}
          colors={['#141414', '#F5F5F0', '#EA4335', '#B8FB3C', '#707070']}
        />
      </div>
    );
  }

  // 4. Avvatar (Shapes)
  if (picture.startsWith('avvatar:')) {
    const seed = picture.replace('avvatar:', '');
    return (
      <div className={`flex items-center justify-center w-full h-full ${className}`}>
        <Avvvatars value={seed} style="shape" size={size} />
      </div>
    );
  }

  // Fallback
  return <User size={size / 2} className="text-cream" />;
};

export default AvatarDisplay;
