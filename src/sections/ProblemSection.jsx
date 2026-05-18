const PROBLEMS = [
  {
    icon: '🔗',
    title: 'Point-to-Point Sprawl',
    desc: 'Every bank, TMS, and data provider requires custom code. One-off scripts multiply across teams with no governance.',
  },
  {
    icon: '🔑',
    title: 'Credential Risk',
    desc: 'API keys and secrets scattered across config files, spreadsheets, and CI variables — with no audit trail.',
  },
  {
    icon: '📉',
    title: 'Zero Observability',
    desc: 'When a file fails to post or a rate feed goes stale, finance teams find out hours later — from the wrong number in a report.',
  },
  {
    icon: '♻️',
    title: 'No Reusability',
    desc: 'Each new connector is built from scratch. There is no shared framework, no schema registry, no standardized error handling.',
  },
];

export default function ProblemSection() {
  return (
    <div className="slide slide--mid">
      <div className="slide-inner">
        <div className="section-label">THE PROBLEM</div>
        <h2 className="section-title">Treasury teams are drowning in<br />integration complexity</h2>
        <div className="problem-grid">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="problem-card">
              <span className="problem-icon">{p.icon}</span>
              <h3 className="problem-card-title">{p.title}</h3>
              <p className="problem-card-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
