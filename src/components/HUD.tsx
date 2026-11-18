import { useState } from 'react';
import { profile } from '../data/resume';
import { coins, questPlaces, type Place } from '../game/map';

interface Props {
  visited: Set<string>;
  collected: Set<number>;
  onGoTo: (place: Place) => void;
  onQuickView: () => void;
  onReset: () => void;
}

export function HUD({ visited, collected, onGoTo, onQuickView, onReset }: Props) {
  const [open, setOpen] = useState(false);
  const done = questPlaces.filter((p) => visited.has(p.id)).length;
  const pct = Math.round((done / questPlaces.length) * 100);

  return (
    <header className="hud">
      <div className="badge">
        <div className="avatar" aria-hidden="true">
          S
        </div>
        <div>
          <h1>{profile.shortName}</h1>
          <p>Lv. 3 · {profile.title}</p>
          <div className="xp" role="progressbar" aria-label="Places visited" aria-valuenow={done} aria-valuemin={0} aria-valuemax={questPlaces.length}>
            <span style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="hud-right">
        <span className="pill" title="GPU credits collected">
          ⚡ {collected.size}/{coins.length}
        </span>
        <div className="quest-wrap">
          <button className="pill btn-pill" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            📜 Quests {done}/{questPlaces.length}
          </button>
          {open && (
            <div className="quest-panel">
              <p className="quest-title">Visit every place</p>
              <ul>
                {questPlaces.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        setOpen(false);
                        onGoTo(p);
                      }}
                    >
                      <span className={visited.has(p.id) ? 'tick on' : 'tick'}>{visited.has(p.id) ? '✓' : ''}</span>
                      <span aria-hidden="true">{p.icon}</span> {p.name}
                      <span className="go">go ▸</span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="reset"
                onClick={() => {
                  setOpen(false);
                  onReset();
                }}
              >
                Reset progress
              </button>
            </div>
          )}
        </div>
        <button className="pill btn-pill primary" onClick={onQuickView}>
          📄 Quick view
        </button>
      </div>
    </header>
  );
}
