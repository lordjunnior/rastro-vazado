import { useRef, useState, type ReactNode, type PointerEvent } from 'react';
import './sovereign-suite.css';

export function SuiteHero({ kicker, title, accent, lead, repo, repoLabel, prefix = "INSPIRADO NO CÓDIGO ABERTO DE", note = "CÁLCULO 100% NO SEU APARELHO · NADA SAI DESTA PÁGINA" }: { kicker: string; title: string; accent: string; lead: string; repo: string; repoLabel: string; prefix?: string; note?: string }) {
  return <header className="ss-hero">
    <p className="ss-kicker"><i aria-hidden="true" />{kicker}</p>
    <h1 className="ss-title">{title}<br /><em>{accent}</em></h1>
    <p className="ss-lead">{lead}</p>
    <p className="ss-source">{prefix} <a href={repo} target="_blank" rel="noopener noreferrer">{repoLabel}</a> · {note}</p>
  </header>;
}

export function CopyBox({ value, label = 'COPIAR', dim }: { value: string; label?: string; dim?: boolean }) {
  const [done, setDone] = useState(false);
  return <div className={`ss-code${dim ? ' dim' : ''}`}>
    <button type="button" className="ss-copy" onClick={() => { void navigator.clipboard?.writeText(value).then(() => { setDone(true); setTimeout(() => setDone(false), 1400); }); }}>{done ? 'COPIADO' : label}</button>
    <div style={{ paddingRight: 70 }}>{value}</div>
  </div>;
}

/** Inclinação 3D pelo ponteiro, com CSS nativo (preserve-3d), sem WebGL. */
export function Tilt({ children, max = 8, className = '' }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el || e.pointerType === 'touch') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `rotateY(${(x - .5) * max * 2}deg) rotateX(${(.5 - y) * max * 2}deg)`;
    el.style.setProperty('--gx', `${x * 100}%`); el.style.setProperty('--gy', `${y * 100}%`);
  };
  return <div className="ss-stage"><div ref={ref} className={`ss-tilt ${className}`} onPointerMove={move} onPointerLeave={() => { if (ref.current) ref.current.style.transform = ''; }}>{children}</div></div>;
}

export function Stat({ value, label, tone }: { value: ReactNode; label: string; tone?: 'hot' | 'ember' }) {
  return <div className={`ss-stat${tone ? ` ${tone}` : ''}`}><b>{value}</b><span>{label}</span></div>;
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return <section className="ss-plate ss-faq" aria-label="Perguntas frequentes"><h2>Perguntas diretas</h2>{items.map(i => <details key={i.q}><summary>{i.q}</summary><p>{i.a}</p></details>)}</section>;
}
