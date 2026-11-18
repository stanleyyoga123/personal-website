import type { PointerEvent } from 'react';
import type { Dir } from '../game/map';

interface Props {
  onPress: (dir: Dir, down: boolean) => void;
  onAction: () => void;
}

const ARROWS: { dir: Dir; label: string }[] = [
  { dir: 'up', label: '▲' },
  { dir: 'left', label: '◀' },
  { dir: 'right', label: '▶' },
  { dir: 'down', label: '▼' },
];

export function MobilePad({ onPress, onAction }: Props) {
  const bind = (dir: Dir) => ({
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      onPress(dir, true);
    },
    onPointerUp: () => onPress(dir, false),
    onPointerCancel: () => onPress(dir, false),
    onLostPointerCapture: () => onPress(dir, false),
  });

  return (
    <div className="pad" aria-label="Touch controls">
      <div className="dpad">
        {ARROWS.map((a) => (
          <button key={a.dir} className={`d-${a.dir}`} aria-label={`Move ${a.dir}`} {...bind(a.dir)}>
            {a.label}
          </button>
        ))}
      </div>
      <button className="a-btn" aria-label="Interact" onClick={onAction}>
        A
      </button>
    </div>
  );
}
