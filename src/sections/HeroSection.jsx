export default function HeroSection({ onNext }) {
  return (
    <div className="slide slide--hero">
      <div className="slide-inner">
        <div className="hero-eyebrow">API Factory Platform</div>
        <h1 className="hero-title">Conduit<span className="hero-tx">·TX</span></h1>
        <p className="hero-tagline">Configure. Connect. Deliver.</p>
        <p className="hero-sub">
          Enterprise treasury data integration — built for multi-tenant SaaS deployment,
          production-grade from day one.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">7</span>
            <span className="hero-stat-label">Pre-Built Connectors</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">14</span>
            <span className="hero-stat-label">REST API Modules</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-num">∞</span>
            <span className="hero-stat-label">Flow Pipelines</span>
          </div>
        </div>
        <div className="hero-badge">Preview Edition · May 2026</div>
        <button className="hero-cta" onClick={onNext} aria-label="Next slide">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    </div>
  );
}
