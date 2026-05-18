const TIERS = [
  {
    label: 'Client',
    title: 'React SPA + REST API Clients',
    desc: 'Operator dashboard, flow designer, run observability, connector configuration wizard',
    color: 'var(--teal)',
  },
  {
    label: 'API',
    title: 'REST API Backend · 14 Modules · Token-Based Auth',
    desc: 'Authenticated endpoints for all platform operations. Per-tenant scope enforced on every request.',
    color: 'var(--blue)',
  },
  {
    label: 'Data',
    title: 'Metadata · Audit · Scheduling · Ref-Data Cache',
    desc: 'Relational DB for metadata and audit log · In-memory cache for reference data · Encrypted secrets store',
    color: 'var(--amber)',
  },
  {
    label: 'Workers',
    title: 'Async Worker Pool · Beat Scheduler · DAG Flow Runner',
    desc: 'Per-tenant queues · exponential retry · dead-letter queue · isolated credential paths per tenant',
    color: 'var(--green)',
  },
  {
    label: 'Connectors',
    title: 'Source & Destination Connectors',
    desc: 'Auto-discovered plugin architecture. 7 source connectors + TMS destination. Short-lived access tokens.',
    color: 'var(--blue)',
  },
];

export default function ArchitectureSection() {
  return (
    <div className="slide slide--mid">
      <div className="slide-inner slide-inner--wide">
        <div className="section-label">ARCHITECTURE</div>
        <h2 className="section-title">Production-grade, cloud-native stack</h2>
        <div className="arch-callout">Containerized · Multi-stage build · Zero known CVEs</div>
        <div className="arch-stack">
          {TIERS.map((tier, i) => (
            <div key={tier.label} className="arch-tier">
              <div className="arch-tier-label" style={{ color: tier.color }}>{tier.label}</div>
              <div className="arch-tier-body">
                <div className="arch-tier-title">{tier.title}</div>
                <div className="arch-tier-desc">{tier.desc}</div>
              </div>
              {i < TIERS.length - 1 && <div className="arch-arrow">▼</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
