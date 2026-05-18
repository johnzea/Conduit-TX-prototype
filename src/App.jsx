import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import HeroSection        from './sections/HeroSection';
import ProblemSection     from './sections/ProblemSection';
import SolutionSection    from './sections/SolutionSection';
import ArchitectureSection from './sections/ArchitectureSection';
import SecuritySection    from './sections/SecuritySection';
import FlowEngineSection  from './sections/FlowEngineSection';
import UXSection          from './sections/UXSection';
import ComparisonSection  from './sections/ComparisonSection';
import CTASection         from './sections/CTASection';

const SECTIONS = [
  { id: 'hero',         label: 'Home' },
  { id: 'problem',      label: 'Problem' },
  { id: 'solution',     label: 'Solution' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'security',     label: 'Security' },
  { id: 'flow-engine',  label: 'Flow Engine' },
  { id: 'ux',           label: 'UX' },
  { id: 'comparison',   label: 'Why Conduit TX' },
  { id: 'cta',          label: 'Get Started' },
];

export default function App() {
  const [active, setActive] = useState(0);
  const navigating = useRef(false);

  const goTo = useCallback((idx) => {
    setActive(Math.max(0, Math.min(SECTIONS.length - 1, idx)));
  }, []);

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    const onWheel = (e) => {
      if (navigating.current) return;
      navigating.current = true;
      if (e.deltaY > 0) goNext(); else goPrev();
      setTimeout(() => { navigating.current = false; }, 800);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [goNext, goPrev]);

  const touchStart = useRef(null);
  useEffect(() => {
    const onTouchStart = (e) => { touchStart.current = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (touchStart.current === null) return;
      const diff = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 40) { diff > 0 ? goNext() : goPrev(); }
      touchStart.current = null;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [goNext, goPrev]);

  const slides = [
    <HeroSection        key="hero"    onNext={goNext} />,
    <ProblemSection     key="problem" />,
    <SolutionSection    key="solution" />,
    <ArchitectureSection key="arch" />,
    <SecuritySection    key="security" />,
    <FlowEngineSection  key="flow" />,
    <UXSection          key="ux" />,
    <ComparisonSection  key="comparison" />,
    <CTASection         key="cta" />,
  ];

  return (
    <div className="deck">
      <div className="deck-viewport">
        <div
          className="deck-track"
          style={{ transform: `translateY(-${active * 100}dvh)` }}
        >
          {slides}
        </div>
      </div>

      <nav className="nav-dots" aria-label="Slide navigation">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={`nav-dot${i === active ? ' nav-dot--active' : ''}`}
            onClick={() => goTo(i)}
            title={s.label}
            aria-label={`Go to ${s.label}`}
          />
        ))}
      </nav>

      {active > 0 && (
        <button className="deck-arrow deck-arrow--up" onClick={goPrev} aria-label="Previous slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
      {active < SECTIONS.length - 1 && (
        <button className="deck-arrow deck-arrow--down" onClick={goNext} aria-label="Next slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      <div className="slide-counter">{active + 1} / {SECTIONS.length}</div>
    </div>
  );
}
