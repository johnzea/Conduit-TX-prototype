const TIERS = [
  {
    label: 'Client',
    title: 'React SPA + REST API Clients',
    desc: 'Operator dashboard, flow designer, run observability, connector configuration wizard',
    color: 'var(--teal)',
  },
  {
    label: 'API',
    title: 'REST API Backend · 17 Modules · Token-Based Auth',
    desc: 'Authenticated endpoints for all platform operations. Per-tenant scope enforced on every request.',
    color: 'var(--blue)',
  },
  {
    label: 'Data',
    title: 'Postgres · Valkey · Vault',
    desc: 'Postgres for metadata, audit log, and scheduling · Valkey cache for reference data and task queues · Vault secrets store with per-tenant encryption keys for sensitive fields at rest',
    color: 'var(--amber)',
  },
  {
    label: 'Workers',
    title: 'Celery Worker Pool · Beat Scheduler · DAG Flow Runner',
    desc: 'Per-tenant queues · exponential retry · dead-letter queue · isolated credential paths per tenant',
    color: 'var(--green)',
  },
  {
    label: 'Ops',
    title: 'Task Monitor · Structured Logs · Metrics · Errors',
    desc: 'Live task visibility, structured logs, and metrics/error reporting across every worker and API request',
    color: 'var(--red)',
  },
  {
    label: 'Connectors',
    title: 'Source & Destination Connectors',
    desc: 'Auto-discovered plugin architecture. 8 source connectors + 2 destination connectors. Short-lived access tokens.',
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
