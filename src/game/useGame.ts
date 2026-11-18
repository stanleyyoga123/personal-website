import { useCallback, useEffect, useRef, useState } from 'react';
import { DELTA, findPath, isWalkable, SPAWN, type Dir, type Place, type Point } from './map';

export const STEP_MS = 150;

const KEY_DIRS: Record<string, Dir> = {
  ArrowUp: 'up',
  KeyW: 'up',
  ArrowDown: 'down',
  KeyS: 'down',
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
};

function dirBetween(a: Point, b: Point): Dir {
  if (b.x > a.x) return 'right';
  if (b.x < a.x) return 'left';
  if (b.y < a.y) return 'up';
  return 'down';
}

interface Options {
  paused: boolean;
  onArrive: (place: Place) => void;
  onStep: (pos: Point) => void;
}

/** Grid movement: held keys/D-pad move one tile per STEP_MS; `walkTo` follows a BFS path. */
export function useGame({ paused, onArrive, onStep }: Options) {
  const [pos, setPos] = useState<Point>(SPAWN);
  const [facing, setFacing] = useState<Dir>('up');
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const posRef = useRef(pos);
  const held = useRef<Dir[]>([]);
  /** Guarantees a quick tap (released before the next frame) still moves one tile. */
  const tapped = useRef<Dir | null>(null);
  const path = useRef<Point[]>([]);
  const target = useRef<Place | null>(null);
  const pausedRef = useRef(paused);
  const arriveRef = useRef(onArrive);
  const stepRef = useRef(onStep);
  const lastMove = useRef(0);
  const stepToggle = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
    arriveRef.current = onArrive;
    stepRef.current = onStep;
  });

  const press = useCallback((dir: Dir, down: boolean) => {
    held.current = held.current.filter((d) => d !== dir);
    if (down) {
      held.current.push(dir);
      tapped.current = dir;
      path.current = [];
      target.current = null;
    }
  }, []);

  const walkTo = useCallback((dest: Point, place?: Place) => {
    const route = findPath(posRef.current, dest);
    if (!route) return;
    path.current = route;
    target.current = place ?? null;
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (pausedRef.current) {
        held.current = [];
        tapped.current = null;
        return;
      }
      if (now - lastMove.current < STEP_MS) return;

      const cur = posRef.current;
      let next: Point | null = null;
      let dir: Dir | null = null;

      if (path.current.length) {
        next = path.current.shift()!;
        dir = dirBetween(cur, next);
      } else if (target.current) {
        const place = target.current;
        target.current = null;
        setFacing('up');
        arriveRef.current(place);
        return;
      } else if (held.current.length || tapped.current) {
        dir = held.current[held.current.length - 1] ?? tapped.current!;
        tapped.current = null;
        const d = DELTA[dir];
        const cand = { x: cur.x + d.x, y: cur.y + d.y };
        if (isWalkable(cand.x, cand.y)) next = cand;
      }

      if (dir) setFacing(dir);
      if (next) {
        posRef.current = next;
        setPos(next);
        stepToggle.current = !stepToggle.current;
        setStep(stepToggle.current ? 1 : 2);
        lastMove.current = now;
        stepRef.current(next);
      } else if (now - lastMove.current > STEP_MS + 60) {
        setStep(0);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const dir = KEY_DIRS[e.code];
      if (!dir || pausedRef.current) return;
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return;
      e.preventDefault();
      if (!e.repeat) press(dir, true);
    };
    const up = (e: KeyboardEvent) => {
      const dir = KEY_DIRS[e.code];
      if (dir) press(dir, false);
    };
    const blur = () => {
      held.current = [];
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [press]);

  return { pos, facing, walking: step !== 0, step, press, walkTo };
}
