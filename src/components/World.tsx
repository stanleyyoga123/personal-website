import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { coins, COLS, MAP_ROWS, places, ROWS, type Dir, type Place, type Point } from '../game/map';
import { STEP_MS } from '../game/useGame';
import { Player } from './Player';

interface Props {
  pos: Point;
  facing: Dir;
  step: 0 | 1 | 2;
  active?: Place;
  visited: Set<string>;
  collected: Set<number>;
  onPlaceClick: (place: Place) => void;
  onTileClick: (p: Point) => void;
}

const HUD_SPACE = 76;

const TILE_CLASS: Record<string, string> = { T: 'tree', '~': 'water', '#': 'path', f: 'flowers', '.': 'grass' };

function useViewport() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, size };
}

/** Offset that centres `center` in the view, clamped to the world edges plus padding. */
function camera(view: number, world: number, center: number, padStart = 0, padEnd = 0) {
  const total = world + padStart + padEnd;
  if (total <= view) return (view - world) / 2 + (padStart - padEnd) / 2;
  return Math.min(padStart, Math.max(view - world - padEnd, view / 2 - center));
}

export function World({ pos, facing, step, active, visited, collected, onPlaceClick, onTileClick }: Props) {
  const { ref, size } = useViewport();
  const tile = size.w < 640 ? 40 : 52;
  const worldW = COLS * tile;
  const worldH = ROWS * tile;
  const camX = camera(size.w, worldW, (pos.x + 0.5) * tile);
  const camY = camera(size.h, worldH, (pos.y + 0.5) * tile, HUD_SPACE, 0);

  const handleWorldClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onTileClick({ x: Math.floor((e.clientX - rect.left) / tile), y: Math.floor((e.clientY - rect.top) / tile) });
  };

  return (
    <div className="viewport" ref={ref}>
      <div
        className="world"
        style={
          {
            '--tile': `${tile}px`,
            '--step': `${STEP_MS}ms`,
            width: worldW,
            height: worldH,
            transform: `translate3d(${Math.round(camX)}px, ${Math.round(camY)}px, 0)`,
          } as CSSProperties
        }
        onClick={handleWorldClick}
      >
        <div className="tiles" aria-hidden="true">
          {MAP_ROWS.flatMap((row, y) =>
            [...row].map((ch, x) => (
              <div key={`${x}-${y}`} className={`tile ${TILE_CLASS[ch]} ${(x + y) % 2 ? 'odd' : ''}`}>
                {ch === 'T' && <span className="tree-top" />}
                {ch === 'f' && <span className="flower" />}
              </div>
            )),
          )}
        </div>

        {coins
          .filter((c) => !collected.has(c.id))
          .map((c) => (
            <span key={c.id} className="coin" style={{ left: c.x * tile, top: c.y * tile }} aria-hidden="true">
              ⚡
            </span>
          ))}

        {places.map((p) => (
          <button
            key={p.id}
            className={`place ${p.kind} ${active?.id === p.id ? 'active' : ''} ${visited.has(p.id) ? 'visited' : ''}`}
            style={
              {
                left: p.x * tile,
                top: p.y * tile,
                width: p.w * tile,
                height: p.h * tile,
                zIndex: (p.y + p.h) * 10,
                '--roof': p.roof,
                '--wall': p.wall,
                '--door-x': `${(p.door.x - p.x + 0.5) * tile}px`,
              } as CSSProperties
            }
            onClick={(e) => {
              e.stopPropagation();
              onPlaceClick(p);
            }}
            aria-label={`Walk to ${p.name}`}
          >
            {p.kind === 'building' && (
              <>
                <span className="roof" />
                <span className="wall">
                  <span className="win" />
                  <span className="win" />
                  <span className="door" />
                </span>
                <span className="label">
                  <span aria-hidden="true">{p.icon}</span> {p.name}
                  {visited.has(p.id) && <span className="check" aria-label="visited"> ✓</span>}
                </span>
              </>
            )}
            {p.kind === 'mailbox' && (
              <>
                <span className="mail-box" />
                <span className="mail-post" />
                {!visited.has(p.id) && <span className="mail-flag" />}
                <span className="label small">✉️ Contact</span>
              </>
            )}
            {p.kind === 'sign' && (
              <>
                <span className="sign-board">?</span>
                <span className="sign-post" />
              </>
            )}
          </button>
        ))}

        <Player pos={pos} facing={facing} step={step} tile={tile} prompt={active?.name} />
      </div>
    </div>
  );
}
