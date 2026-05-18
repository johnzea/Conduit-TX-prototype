const STATS = [
  { num: '7',    label: 'Source Connectors' },
  { num: '1',    label: 'Destination (TMS)' },
  { num: '14',   label: 'API Modules' },
  { num: '100%', label: 'Audit Coverage' },
];

const BULLETS = [
  'Preview Edition available now',
  'Custom connector scoping in days',
  'Dedicated tenant onboarding included',
];

export default function CTASection() {
  return (
    <div className="slide slide--hero slide--cta">
      <div className="slide-inner">
        <h2 className="cta-title">Ready to eliminate your<br />integration debt?</h2>
        <div className="cta-stats">
          {STATS.map((s) => (
            <div key={s.label} className="cta-stat">
              <span className="cta-stat-num">{s.num}</span>
              <span className="cta-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <p className="cta-body">
          Conduit TX is production-ready and actively being deployed<br />
          for multi-tenant treasury clients today.
        </p>
        <div className="cta-bullets">
          {BULLETS.map((b) => (
            <div key={b} className="cta-bullet">
              <span className="cta-bullet-check">✓</span>
              <span>{b}</span>
            </div>
          ))}
        </div>
        <div className="cta-domains">
          <a href="https://www.insightfulsolutionsconsulting.com" target="_blank" rel="noreferrer">insightfulsolutionsconsulting.com</a>
          <span className="cta-domain-sep">·</span>
          <a href="https://conduit-tx.com" target="_blank" rel="noreferrer">conduit-tx.com</a>
        </div>
        <div className="cta-footer">Insightful Solutions Consulting LLC · Downers Grove, IL</div>
      </div>
    </div>
  );
}
