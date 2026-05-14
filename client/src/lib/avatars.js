export const AVATAR_STYLES = [
  {
    id: "geometric",
    name: "Geometric",
    provider: "avvatar",
    isPro: false,
    description: "Sharp vector shapes"
  },
  {
    id: "beam",
    name: "Beam",
    provider: "boring",
    isPro: true,
    description: "Modern gradient flows"
  },
  {
    id: "adventurer",
    name: "Adventurer",
    provider: "dicebear",
    isPro: true,
    description: "Detailed characters"
  },
  {
    id: "adventurer-neutral",
    name: "Adventurer Neutral",
    provider: "dicebear",
    isPro: true,
    description: "Clean character busts"
  }
];

export const getAvatarUrl = (provider, style, seed) => {
  if (provider === "avvatar") return `avvatar:${seed}`;
  if (provider === "boring") return `boring:${style}:${seed}`;
  if (provider === "dicebear") return `dicebear:${style}:${seed}`;
  return seed;
};