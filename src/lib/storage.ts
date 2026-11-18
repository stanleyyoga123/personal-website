const KEY = 'stanley-town-v1';

export interface SavedProgress {
  visited: string[];
  coins: number[];
  introSeen: boolean;
}

const EMPTY: SavedProgress = { visited: [], coins: [], introSeen: false };

export function loadProgress(): SavedProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const data = JSON.parse(raw) as Partial<SavedProgress>;
    return {
      visited: Array.isArray(data.visited) ? data.visited : [],
      coins: Array.isArray(data.coins) ? data.coins : [],
      introSeen: data.introSeen === true,
    };
  } catch {
    return EMPTY;
  }
}

export function saveProgress(progress: SavedProgress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable (private mode, blocked); progress just won't persist.
  }
}
