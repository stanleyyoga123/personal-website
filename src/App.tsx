import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DialogBox } from './components/DialogBox';
import { HUD } from './components/HUD';
import { MobilePad } from './components/MobilePad';
import { QuickView } from './components/QuickView';
import { World } from './components/World';
import { getScript, type ScriptId } from './content/scripts';
import { coins, interactableFrom, questPlaces, type Place, type Point } from './game/map';
import { useGame } from './game/useGame';
import { loadProgress, saveProgress } from './lib/storage';

type View = 'game' | 'resume';

function initialView(): View {
  return new URLSearchParams(window.location.search).get('view') === 'resume' ? 'resume' : 'game';
}

function useCoarsePointer() {
  const query = '(pointer: coarse)';
  const [coarse, setCoarse] = useState(() => window.matchMedia?.(query).matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = () => setCoarse(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return coarse;
}

export default function App() {
  const saved = useMemo(() => loadProgress(), []);
  const [view, setView] = useState<View>(initialView);
  const [visited, setVisited] = useState(() => new Set(saved.visited));
  const [collected, setCollected] = useState(() => new Set(saved.coins));
  const [dialog, setDialog] = useState<ScriptId | null>(() => (saved.introSeen ? null : 'intro'));
  const [introSeen, setIntroSeen] = useState(saved.introSeen);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const questCelebrated = useRef(questPlaces.every((p) => saved.visited.includes(p.id)));
  const coarse = useCoarsePointer();

  const openPlace = useCallback((place: Place) => {
    setDialog(place.id);
    if (place.quest) setVisited((v) => (v.has(place.id) ? v : new Set(v).add(place.id)));
  }, []);

  const collectedRef = useRef(collected);
  useEffect(() => {
    collectedRef.current = collected;
  }, [collected]);

  // Collect GPU credits by stepping on them.
  const onStep = useCallback((pos: Point) => {
    const coin = coins.find((c) => c.x === pos.x && c.y === pos.y);
    const have = collectedRef.current;
    if (!coin || have.has(coin.id)) return;
    const next = new Set(have).add(coin.id);
    collectedRef.current = next;
    setCollected(next);
    setToast({ id: Date.now(), text: `⚡ GPU credit ${next.size}/${coins.length}: ${coin.fact}` });
  }, []);

  const game = useGame({ paused: dialog !== null || view !== 'game', onArrive: openPlace, onStep });
  const active = interactableFrom(game.pos, game.facing);

  useEffect(() => {
    saveProgress({ visited: [...visited], coins: [...collected], introSeen });
  }, [visited, collected, introSeen]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const closeDialog = useCallback(() => {
    if (dialog === 'intro') setIntroSeen(true);
    const allVisited = questPlaces.every((p) => visited.has(p.id));
    if (allVisited && !questCelebrated.current && dialog !== 'questDone') {
      questCelebrated.current = true;
      setDialog('questDone');
      return;
    }
    setDialog(null);
  }, [dialog, visited]);

  const interact = useCallback(() => {
    if (active) openPlace(active);
  }, [active, openPlace]);

  useEffect(() => {
    if (view !== 'game' || dialog) return;
    const onKey = (e: KeyboardEvent) => {
      const onControl = e.target instanceof HTMLElement && e.target.closest('button, a');
      if (e.code === 'KeyE' || ((e.code === 'Space' || e.code === 'Enter') && !onControl)) {
        e.preventDefault();
        if (!e.repeat) interact();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, dialog, interact]);

  const switchView = (next: View) => {
    setView(next);
    const url = new URL(window.location.href);
    if (next === 'resume') url.searchParams.set('view', 'resume');
    else url.searchParams.delete('view');
    window.history.replaceState(null, '', url);
  };

  const reset = () => {
    setVisited(new Set());
    setCollected(new Set());
    questCelebrated.current = false;
  };

  if (view === 'resume') return <QuickView onBack={() => switchView('game')} />;

  return (
    <div className="game">
      <HUD
        visited={visited}
        collected={collected}
        onGoTo={(p) => game.walkTo(p.door, p)}
        onQuickView={() => switchView('resume')}
        onReset={reset}
      />
      <World
        pos={game.pos}
        facing={game.facing}
        step={game.step}
        active={dialog ? undefined : active}
        visited={visited}
        collected={collected}
        onPlaceClick={(p) => game.walkTo(p.door, p)}
        onTileClick={(p: Point) => game.walkTo(p)}
      />

      {!coarse && (
        <p className="hint" aria-hidden="true">
          <kbd>WASD</kbd>/<kbd>↑↓←→</kbd> move · <kbd>E</kbd> interact · or click anywhere
        </p>
      )}
      {coarse && !dialog && <MobilePad onPress={game.press} onAction={interact} />}

      {toast && (
        <div className="toast" key={toast.id} role="status">
          {toast.text}
        </div>
      )}

      {dialog && <DialogBox key={dialog} script={getScript(dialog)} onClose={closeDialog} />}
    </div>
  );
}
