const LAYERS = [
  { label: 'API Layer', desc: 'Every request validates the caller belongs to the requested tenant — enforced on every endpoint' },
  { label: 'Database', desc: 'tenant_id foreign key on every table; all queries are scoped — no cross-tenant leakage possible' },
  { label: 'Secrets Store', desc: 'Credential paths isolated per tenant; access tokens scoped to that tenant only' },
  { label: 'Worker Queues', desc: 'Per-tenant routing queues — one tenant\'s heavy workload cannot starve another' },
];

const STEPS = [
  'User submits API key via HTTPS — value never logged or stored in DB',
  'Backend writes the encrypted secret to the secrets store at a tenant-scoped path',
  'Worker job carries only a tenant identifier and connector reference — no secret in task args',
  'Worker obtains a short-lived access token from the secrets store, reads credentials in-memory only',
  'Credentials discarded after task completes — secrets store retains a full audit trail',
];

export default function SecuritySection() {
  return (
    <div className="slide slide--deep">
      <div className="slide-inner slide-inner--wide">
        <div className="section-label">SECURITY &amp; MULTI-TENANCY</div>
        <h2 className="section-title">Enterprise isolation — zero credential exposure</h2>
        <div className="security-cols">
          <div className="security-col">
            <h3 className="security-col-head">Isolation at every layer</h3>
            {LAYERS.map((l, i) => (
              <div key={l.label} className="security-layer">
                <div className="security-layer-num">{i + 1}</div>
                <div>
                  <div className="security-layer-label">{l.label}</div>
                  <div className="security-layer-desc">{l.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="security-divider" />
          <div className="security-col">
            <h3 className="security-col-head">How credentials flow</h3>
            {STEPS.map((step, i) => (
              <div key={i} className="security-step">
                <div className="security-step-num">{i + 1}</div>
                <div className="security-step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
