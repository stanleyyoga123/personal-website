import { useEffect } from 'react';
import { aiLevate, education, profile, projects, publication, skills, summary, tiket, type Job } from '../data/resume';
import { Rich } from './Rich';

function JobBlock({ job }: { job: Job }) {
  return (
    <article className="qv-item">
      <div className="qv-row">
        <h3>{job.company}</h3>
        <span>{job.location}</span>
      </div>
      <div className="qv-row sub">
        <em>{job.role}</em>
        <em>{job.dates}</em>
      </div>
      <ul>
        {job.bullets.map((b, i) => (
          <li key={i}>
            <Rich text={b} />
          </li>
        ))}
      </ul>
      {job.links?.map((l) => (
        <a key={l.href} className="qv-link" href={l.href} target="_blank" rel="noreferrer">
          {l.label} ↗
        </a>
      ))}
    </article>
  );
}

export function QuickView({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="qv">
      <div className="qv-bar">
        <button className="qv-back" onClick={onBack}>
          🎮 Back to the game
        </button>
      </div>
      <main className="qv-page">
        <header className="qv-head">
          <h1>{profile.name}</h1>
          <p className="qv-title">
            {profile.title} · {profile.location}
          </p>
          <p className="qv-contact">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.linkedin.href} target="_blank" rel="noreferrer">
              {profile.linkedin.label}
            </a>
            <a href={profile.github.href} target="_blank" rel="noreferrer">
              {profile.github.label}
            </a>
          </p>
        </header>

        <section>
          <h2>Summary</h2>
          <ul>
            {summary.map((s, i) => (
              <li key={i}>
                <Rich text={s} />
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Experience</h2>
          <JobBlock job={aiLevate} />
          <JobBlock job={tiket} />
        </section>

        <section>
          <h2>Projects</h2>
          {projects.map((p) => (
            <article className="qv-item" key={p.name}>
              <div className="qv-row">
                <h3>{p.name}</h3>
                <a href={p.link.href} target="_blank" rel="noreferrer">
                  {p.link.label} ↗
                </a>
              </div>
              <p className="qv-stack">{p.stack.join(' · ')}</p>
              <ul>
                {p.bullets.map((b, i) => (
                  <li key={i}>
                    <Rich text={b} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section>
          <h2>Skills</h2>
          <dl className="qv-skills">
            {skills.map((g) => (
              <div key={g.name}>
                <dt>{g.name}</dt>
                <dd>{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>Education</h2>
          {education.map((s) => (
            <article className="qv-item" key={s.name}>
              <div className="qv-row">
                <h3>{s.name}</h3>
                <span>{s.location}</span>
              </div>
              <div className="qv-row sub">
                <em>{s.degree}</em>
                <em>{s.dates}</em>
              </div>
              <p>{s.note}</p>
            </article>
          ))}
        </section>

        <section>
          <h2>Publication</h2>
          <article className="qv-item">
            <h3>{publication.title}</h3>
            <div className="qv-row sub">
              <em>{publication.venue}</em>
              <span>
                {publication.links.map((l) => (
                  <a key={l.href} className="qv-link inline" href={l.href} target="_blank" rel="noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </span>
            </div>
            <p>{publication.note}</p>
          </article>
        </section>
      </main>
    </div>
  );
}
