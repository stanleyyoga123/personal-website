import { useEffect, useRef, useState } from 'react';
import type { DialogScript } from '../content/scripts';
import { plain } from '../lib/text';
import { Rich } from './Rich';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

interface Props {
  script: DialogScript;
  onClose: () => void;
}

export function DialogBox({ script, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const page = script.pages[index];
  const text = page.say ? plain(page.say) : '';
  const [typed, setTyped] = useState(() => (reducedMotion() ? text.length : 0));
  const done = typed >= text.length;
  const last = index === script.pages.length - 1;
  const boxRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => setTyped((t) => Math.min(text.length, t + 2)), 18);
    return () => window.clearInterval(id);
  }, [done, text]);

  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true });
  }, [index]);

  const advance = () => {
    if (!done) {
      setTyped(text.length);
      return;
    }
    if (last) {
      onClose();
      return;
    }
    const nextPage = script.pages[index + 1];
    setIndex(index + 1);
    setTyped(reducedMotion() ? (nextPage.say ? plain(nextPage.say).length : 0) : 0);
  };

  const back = () => {
    if (index === 0) return;
    setIndex(index - 1);
    const prevPage = script.pages[index - 1];
    setTyped(prevPage.say ? plain(prevPage.say).length : 0);
  };

  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.code === 'Tab' && boxRef.current) {
        const focusables = boxRef.current.querySelectorAll<HTMLElement>('button, a[href]');
        if (!focusables.length) return;
        const first = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      const onControl = e.target instanceof HTMLElement && e.target.closest('button, a');
      if (e.code === 'KeyE' || ((e.code === 'Space' || e.code === 'Enter') && !onControl)) {
        e.preventDefault();
        if (!e.repeat) advanceRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onClick={(e) => e.target === e.currentTarget && advance()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" ref={boxRef}>
        <header className="dialog-head">
          <span className="dialog-icon" aria-hidden="true">
            {script.icon}
          </span>
          <h2 id="dialog-title">{script.title}</h2>
          <button className="dialog-close" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </header>
        <div className="dialog-content" key={index}>
          {page.speaker && <p className="speaker">{page.speaker}</p>}
          {page.say && (
            <p className="say" aria-live="polite">
              {done ? <Rich text={page.say} /> : text.slice(0, typed)}
              {!done && <span className="caret" aria-hidden="true" />}
            </p>
          )}
          {done && page.body && <div className="dialog-body">{page.body}</div>}
        </div>
        <footer className="dialog-foot">
          <span className="pager" aria-label={`Page ${index + 1} of ${script.pages.length}`}>
            {script.pages.map((_, i) => (
              <i key={i} className={i === index ? 'on' : ''} />
            ))}
          </span>
          {index > 0 && (
            <button className="btn ghost" onClick={back}>
              ◀ Back
            </button>
          )}
          <button className="btn" ref={nextRef} onClick={advance}>
            {!done ? 'Skip ▶▶' : last ? 'Close ✕' : 'Next ▶'}
          </button>
        </footer>
      </div>
    </div>
  );
}
