// Tile legend: T tree, ~ water, # path, f flowers, . grass.
// Buildings are drawn on top of grass and defined separately in `places`.
export const MAP_ROWS = [
  'TTTTTTTTTTTTTTTTTTTTTTTT',
  'T..f....T...f......f...T',
  'T...........T..........T',
  'T......T..............TT',
  'T................T.....T',
  'T...#....#.....#....#..T',
  'T######################T',
  'T.f.....#.....#....~~~~T',
  'T.......#.....#.f..~~~~T',
  'T.......#.....#.....T.TT',
  'T.......#.....#........T',
  'T.......#.....#........T',
  'T######################T',
  'T..f.......f.......f...T',
  'T...T........T......T..T',
  'TTTTTTTTTTTTTTTTTTTTTTTT',
];

export const COLS = MAP_ROWS[0].length;
export const ROWS = MAP_ROWS.length;

export type Tile = 'T' | '~' | '#' | 'f' | '.';
export type Dir = 'up' | 'down' | 'left' | 'right';

export interface Point {
  x: number;
  y: number;
}

export type PlaceId = 'home' | 'tiket' | 'ailevate' | 'lab' | 'forge' | 'uni' | 'library' | 'mailbox' | 'sign';

export interface Place {
  id: PlaceId;
  name: string;
  icon: string;
  kind: 'building' | 'mailbox' | 'sign';
  x: number;
  y: number;
  w: number;
  h: number;
  /** Tile the player stands on to interact (always directly below the place). */
  door: Point;
  /** Counts toward the "visit every building" quest. */
  quest: boolean;
  roof: string;
  wall: string;
}

function place(p: Omit<Place, 'door'> & { doorX?: number }): Place {
  const { doorX, ...rest } = p;
  return { ...rest, door: { x: doorX ?? p.x + Math.floor(p.w / 2), y: p.y + p.h } };
}

export const places: Place[] = [
  place({ id: 'tiket', name: 'tiket.com HQ', icon: '✈️', kind: 'building', x: 2, y: 2, w: 4, h: 3, quest: true, roof: '#1f6fd1', wall: '#f3e9d2' }),
  place({ id: 'ailevate', name: 'AI-Levate', icon: '🤖', kind: 'building', x: 8, y: 2, w: 3, h: 3, quest: true, roof: '#8a4fd8', wall: '#efe6f7' }),
  place({ id: 'lab', name: 'Project Lab', icon: '🧪', kind: 'building', x: 13, y: 2, w: 4, h: 3, doorX: 15, quest: true, roof: '#1aa38c', wall: '#e3f4ee' }),
  place({ id: 'forge', name: 'Skills Forge', icon: '⚒️', kind: 'building', x: 19, y: 2, w: 3, h: 3, quest: true, roof: '#c4542b', wall: '#f2dfcf' }),
  place({ id: 'uni', name: 'University', icon: '🎓', kind: 'building', x: 2, y: 9, w: 5, h: 3, doorX: 4, quest: true, roof: '#24324f', wall: '#e7e2d6' }),
  place({ id: 'home', name: "Stanley's Home", icon: '🏠', kind: 'building', x: 10, y: 9, w: 3, h: 3, quest: true, roof: '#d9473f', wall: '#fbeedc' }),
  place({ id: 'library', name: 'Library', icon: '📚', kind: 'building', x: 16, y: 9, w: 3, h: 3, quest: true, roof: '#7a5230', wall: '#efe2c8' }),
  place({ id: 'mailbox', name: 'Mailbox', icon: '✉️', kind: 'mailbox', x: 21, y: 11, w: 1, h: 1, quest: true, roof: '#d23b3b', wall: '#d23b3b' }),
  place({ id: 'sign', name: 'Town sign', icon: '🪧', kind: 'sign', x: 9, y: 13, w: 1, h: 1, quest: false, roof: '#9b6a3c', wall: '#9b6a3c' }),
];

export const questPlaces = places.filter((p) => p.quest);

export const SPAWN: Point = { x: 11, y: 12 };

export interface Coin extends Point {
  id: number;
  fact: string;
}

export const coins: Coin[] = [
  { id: 0, x: 1, y: 1, fact: "Stanley's FastAPI backends at tiket.com handled 6,000+ requests per minute." },
  { id: 1, x: 22, y: 1, fact: 'He turned Kubeflow releases into a single Jenkins pipeline action.' },
  { id: 2, x: 6, y: 4, fact: '100,000+ images a week went through image-scoring modules he helped build.' },
  { id: 3, x: 11, y: 8, fact: 'IncidentBench runs 69 configured incident scenarios across three microservice apps.' },
  { id: 4, x: 17, y: 7, fact: 'TikTekTo placed third of 60+ teams at the FEIT Hackathon 2025.' },
  { id: 5, x: 21, y: 10, fact: 'First author of a lexical complexity paper at ICAICTA 2022.' },
  { id: 6, x: 1, y: 14, fact: 'Recipient of the UniMelb Engineering and IT Graduate Scholarship.' },
  { id: 7, x: 22, y: 14, fact: 'ESCI Search serves an int8 ONNX cross-encoder on NVIDIA Triton.' },
];

export function tileAt(x: number, y: number): Tile {
  return (MAP_ROWS[y]?.[x] ?? 'T') as Tile;
}

export function placeAt(x: number, y: number): Place | undefined {
  return places.find((p) => x >= p.x && x < p.x + p.w && y >= p.y && y < p.y + p.h);
}

export function isWalkable(x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
  const t = tileAt(x, y);
  if (t === 'T' || t === '~') return false;
  return !placeAt(x, y);
}

export const DELTA: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/** The place the player can interact with: the one they face, or the one whose door they stand on. */
export function interactableFrom(pos: Point, facing: Dir): Place | undefined {
  const d = DELTA[facing];
  return placeAt(pos.x + d.x, pos.y + d.y) ?? places.find((p) => p.door.x === pos.x && p.door.y === pos.y);
}

/** Breadth-first shortest path; returns the steps after `from`, ending at `to`, or null. */
export function findPath(from: Point, to: Point): Point[] | null {
  if (!isWalkable(to.x, to.y)) return null;
  const key = (p: Point) => p.y * COLS + p.x;
  const prev = new Map<number, Point | null>([[key(from), null]]);
  const queue: Point[] = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur.x === to.x && cur.y === to.y) {
      const path: Point[] = [];
      for (let p: Point | null = cur; p && key(p) !== key(from); p = prev.get(key(p)) ?? null) path.unshift(p);
      return path;
    }
    for (const d of Object.values(DELTA)) {
      const n = { x: cur.x + d.x, y: cur.y + d.y };
      if (!prev.has(key(n)) && isWalkable(n.x, n.y)) {
        prev.set(key(n), cur);
        queue.push(n);
      }
    }
  }
  return null;
}
