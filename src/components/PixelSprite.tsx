import { PALETTE } from '../game/sprites';

interface Props {
  rows: string[];
  className?: string;
}

/** Renders a palette-string pixel frame as crisp SVG rects. */
export function PixelSprite({ rows, className }: Props) {
  const w = rows[0].length;
  const h = rows.length;
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          ch === '.' ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={PALETTE[ch]} />,
        ),
      )}
    </svg>
  );
}
