// Tiny pixel-art frames (10 x 13). Each character maps to a palette colour; '.' is transparent.
export const PALETTE: Record<string, string> = {
  h: '#2b1d14', // hair
  s: '#f2c39b', // skin
  e: '#1a1a1a', // eyes
  c: '#2bb3a3', // shirt
  d: '#1d8578', // shirt shade
  p: '#2c3e66', // pants
  b: '#222222', // shoes
  g: '#e8e8e8', // glasses glint
};

const head = {
  down: ['...hhhh...', '..hhhhhh..', '.hhhhhhhh.', '.hssssssh.', '.sesssses.', '.ssssssss.', '..ssssss..'],
  up: ['...hhhh...', '..hhhhhh..', '.hhhhhhhh.', '.hhhhhhhh.', '.hhhhhhhh.', '.shhhhhhs.', '..ssssss..'],
  side: ['...hhhh...', '..hhhhhh..', '.hhhhhhhh.', '.hhhsssss.', '.hhsssses.', '.hhssssss.', '..sssss...'],
};

const torso = {
  front: ['.cccccccc.', 'sccdccdccs', '.cccccccc.'],
  side: ['..cccccc..', '..cccccs..', '..cccccc..'],
};

const legs = {
  stand: ['..pppppp..', '..pp..pp..', '..bb..bb..'],
  stepA: ['..pppppp..', '..pp..pp..', '..bb...bb.'],
  stepB: ['..pppppp..', '..pp..pp..', '.bb...bb..'],
  sideStand: ['..pppppp..', '...pp.pp..', '...bb.bb..'],
  sideStep: ['..pppppp..', '..pp...pp.', '.bb.....bb'],
};

export type FrameKey = 'down' | 'up' | 'side';

export function frame(dir: FrameKey, step: 0 | 1 | 2): string[] {
  if (dir === 'side') return [...head.side, ...torso.side, ...(step === 0 ? legs.sideStand : legs.sideStep)];
  const l = step === 0 ? legs.stand : step === 1 ? legs.stepA : legs.stepB;
  return [...head[dir], ...torso.front, ...l];
}
