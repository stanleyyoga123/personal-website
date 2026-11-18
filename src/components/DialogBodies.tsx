import { useState } from 'react';
import { profile, projects, skills, type Link } from '../data/resume';
import { Rich } from './Rich';

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="bullets">
      {items.map((b, i) => (
        <li key={i} style={{ animationDelay: `${i * 120}ms` }}>
          <Rich text={b} />
        </li>
      ))}
    </ul>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <ul className="chips">
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export function LinkRow({ links }: { links: Link[] }) {
  return (
    <p className="link-row">
      {links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
          {l.label} ↗
        </a>
      ))}
    </p>
  );
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <ul className="stats">
      {items.map((s) => (
        <li key={s.label}>
          <b>{s.value}</b>
          <span>{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProjectPicker() {
  const [active, setActive] = useState(0);
  const p = projects[active];
  return (
    <div className="picker">
      <div className="picker-tabs" role="tablist" aria-label="Projects">
        {projects.map((proj, i) => (
          <button
            key={proj.name}
            role="tab"
            aria-selected={i === active}
            className={i === active ? 'on' : ''}
            onClick={() => setActive(i)}
          >
            {proj.name}
          </button>
        ))}
      </div>
      <div className="picker-panel" role="tabpanel" key={p.name}>
        <Chips items={p.stack} />
        <Bullets items={p.bullets} />
        <LinkRow links={[p.link]} />
      </div>
    </div>
  );
}

export function SkillsInventory() {
  return (
    <div className="inventory">
      {skills.map((g) => (
        <section key={g.name}>
          <h4>{g.name}</h4>
          <Chips items={g.items} />
        </section>
      ))}
    </div>
  );
}

export function ContactCard() {
  return (
    <ul className="contact">
      <li>
        <span aria-hidden="true">✉️</span>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </li>
      <li>
        <span aria-hidden="true">💼</span>
        <a href={profile.linkedin.href} target="_blank" rel="noreferrer">
          {profile.linkedin.label}
        </a>
      </li>
      <li>
        <span aria-hidden="true">🐙</span>
        <a href={profile.github.href} target="_blank" rel="noreferrer">
          {profile.github.label}
        </a>
      </li>
    </ul>
  );
}
