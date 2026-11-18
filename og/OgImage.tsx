import './og.css';
import { World } from '../src/components/World';
import { profile } from '../src/data/resume';

const noop = () => {};

export function OgImage() {
  return (
    <div className="og game">
      <World
        pos={{ x: 15, y: 6 }}
        facing="down"
        step={0}
        visited={new Set()}
        collected={new Set()}
        onPlaceClick={noop}
        onTileClick={noop}
      />
      <div className="og-shade" />
      <section className="og-card">
        <p className="og-kicker">▶ Press start to explore</p>
        <h1>{profile.name}</h1>
        <p className="og-role">{profile.title}</p>
        <p className="og-place">{profile.location}</p>
        <p className="og-url">stanleyyoga.com</p>
      </section>
    </div>
  );
}
