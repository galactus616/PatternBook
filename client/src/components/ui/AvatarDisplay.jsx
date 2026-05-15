import React from 'react';
import Avvvatars from 'avvvatars-react';
import Avatar from 'boring-avatars';
import { User } from 'lucide-react';

/**
 * AvatarDisplay — Canonical avatar renderer for the entire platform.
 *
 * Supports:
 *   - HTTP URLs          (Google, uploaded photos)
 *   - dicebear:<style>:<seed>   (DiceBear API)
 *   - boring:<style>:<seed>     (Boring Avatars)
 *   - avvatar:<seed>            (Avvvatars shapes)
 *
 * Props:
 *   user       — object with { picture, name, id, email }
 *   size       — pixel size (used for libraries that need explicit px value)
 *   className  — extra classes applied to the outermost element
 *   wrapperClassName — classes for the container div (for round clipping, borders, etc.)
 */
const AvatarDisplay = ({ user, size = 32, className = '', wrapperClassName = '' }) => {
  if (!user) {
    return (
      <div
        className={`flex items-center justify-center bg-faint rounded-full ${wrapperClassName}`}
        style={{ width: size, height: size }}
      >
        <User size={size / 2} className="text-muted" />
      </div>
    );
  }

  const picture = user.picture || `avvatar:${user.id || user.email || 'seeker'}`;

  // 1. HTTP URL — Google OAuth photo or any direct URL
  if (picture.startsWith('http')) {
    return (
      <img
        src={picture}
        alt={user.name || 'Avatar'}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  // 2. DiceBear API  (dicebear:<style>:<seed>)
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

  // 3. Boring Avatars  (boring:<style>:<seed>)
  if (picture.startsWith('boring:')) {
    const parts = picture.split(':');
    const style = parts[1] || 'marble';
    const seed = parts[2] || 'seeker';
    return (
      <div className={`flex items-center justify-center overflow-hidden ${wrapperClassName} ${className}`}>
        <Avatar
          size={size}
          name={seed}
          variant={style}
          colors={['#141414', '#F5F5F0', '#EA4335', '#B8FB3C', '#707070']}
        />
      </div>
    );
  }

  // 4. Avvvatars shapes  (avvatar:<seed>)
  if (picture.startsWith('avvatar:')) {
    const seed = picture.replace('avvatar:', '');
    return (
      <div className={`flex items-center justify-center w-full h-full ${className}`}>
        <Avvvatars value={seed} style="shape" size={size} />
      </div>
    );
  }

  // Fallback — unknown format
  return <User size={size / 2} className="text-cream" />;
};

export default AvatarDisplay;
