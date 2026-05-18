const FLOW = [
  {
    label: 'Source\nConnectors',
    sub: 'Banking · Crypto Custody\nMarket Data · TMS',
    color: 'var(--teal)',
  },
  {
    label: 'Flow\nEngine',
    sub: 'DAG Pipelines\nScheduled or On-Demand',
    color: 'var(--blue)',
  },
  {
    label: 'Transform\n& Enrich',
    sub: 'JS Sandbox\nField Mapping · AI Assist',
    color: 'var(--amber)',
  },
  {
    label: 'Destination\nSystems',
    sub: 'TMS · ERPs\nCustom Endpoints',
    color: 'var(--green)',
  },
];

const BADGES = [
  { title: 'Multi-Tenant', desc: 'Full data isolation per tenant at API, DB, Vault, and queue layers' },
  { title: 'Zero-Trust Security', desc: 'Credentials live only in an encrypted secrets store — never in logs, DB, or task queues' },
  { title: 'Full Auditability', desc: 'Append-only audit log captures every run, credential access, and admin action' },
];

export default function SolutionSection() {
  return (
    <div className="slide slide--deep">
      <div className="slide-inner">
        <div className="section-label">SOLUTION OVERVIEW</div>
        <h2 className="section-title">A configurable API factory for financial data</h2>
        <div className="flow-diagram">
          {FLOW.map((step, i) => (
            <div key={step.label} className="flow-item">
              <div className="flow-box" style={{ borderColor: step.color }}>
                <span className="flow-box-label" style={{ color: step.color }}>
                  {step.label.split('\n').map((line, j) => (
                    <span key={j}>{line}{j === 0 && <br />}</span>
                  ))}
                </span>
                <span className="flow-box-sub">
                  {step.sub.split('\n').map((line, j) => (
                    <span key={j}>{line}{j === 0 && <br />}</span>
                  ))}
                </span>
              </div>
              {i < FLOW.length - 1 && (
                <div className="flow-arrow">▶</div>
              )}
            </div>
          ))}
        </div>
        <div className="solution-badges">
          {BADGES.map((b) => (
            <div key={b.title} className="solution-badge">
              <span className="solution-badge-title">{b.title}</span>
              <span className="solution-badge-desc">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
