import { useMemo } from 'react';
import { frame } from '../game/sprites';
import type { Dir, Point } from '../game/map';
import { PixelSprite } from './PixelSprite';

interface Props {
  pos: Point;
  facing: Dir;
  step: 0 | 1 | 2;
  tile: number;
  prompt?: string;
}

export function Player({ pos, facing, step, tile, prompt }: Props) {
  const rows = useMemo(() => {
    const key = facing === 'left' || facing === 'right' ? 'side' : facing;
    return frame(key, step);
  }, [facing, step]);

  return (
    <div
      className={`player ${step ? 'walking' : 'idle'}`}
      style={{ transform: `translate3d(${pos.x * tile}px, ${pos.y * tile}px, 0)`, zIndex: prompt ? 900 : pos.y * 10 + 5 }}
    >
      <div className="shadow" />
      <PixelSprite rows={rows} className={`sprite ${facing === 'left' ? 'flip' : ''}`} />
      {prompt && (
        <div className="prompt" role="status">
          <kbd>E</kbd> {prompt}
        </div>
      )}
    </div>
  );
}
