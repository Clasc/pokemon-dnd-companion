export function totalXpForLevel(level: number): number {
  return level * level * level;
}

export function xpToNextLevel(level: number): number {
  return 3 * level * level + 3 * level + 1;
}

export function xpRemaining(level: number, xpSinceLevelUp: number): number {
  return Math.max(0, xpToNextLevel(level) - xpSinceLevelUp);
}
