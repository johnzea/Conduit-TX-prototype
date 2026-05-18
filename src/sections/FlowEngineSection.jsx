const NODE_TYPES = [
  { tag: 'fetch',     color: '#0ea5e9', desc: 'Calls a source connector — appends records to shared pipeline context' },
  { tag: 'transform', color: '#8b5cf6', desc: 'Executes JavaScript in an isolated sandbox runtime or guided field-mapping schema' },
  { tag: 'condition', color: '#f59e0b', desc: 'Routes execution via AND/OR field-level rules — supports branching DAGs' },
  { tag: 'post',      color: '#10b981', desc: 'Delivers records to a destination connector; supports chunked, async-polled output' },
  { tag: 'notify',    color: '#3b82f6', desc: 'Sends in-app or email alerts with template variable interpolation' },
];

const SOURCES = [
  'Crypto Custodian Wallet (balance & positions)',
  'Bank Reporting — Account Balances',
  'Bank Reporting — Transaction History',
  'Treasury Management System (TMS)',
  'Market Data — Rate Benchmarks',
  'Market Data — FX Spot & Historical Rates',
  'Trading Exchange — Account & Settlement Data',
];

const DESTINATIONS = [
  'Treasury Management System (native async delivery, status polling)',
];

export default function FlowEngineSection() {
  return (
    <div className="slide slide--mid">
      <div className="slide-inner slide-inner--wide">
        <div className="section-label">FLOW ENGINE &amp; CONNECTORS</div>
        <h2 className="section-title">Visual DAG pipelines with pluggable connectors</h2>
        <div className="flow-engine-cols">
          <div className="flow-engine-col">
            <h3 className="flow-engine-col-head">Flow Node Types</h3>
            {NODE_TYPES.map((n) => (
              <div key={n.tag} className="node-row">
                <span className="node-tag" style={{ background: n.color + '22', color: n.color, borderColor: n.color + '55' }}>{n.tag}</span>
                <span className="node-desc">{n.desc}</span>
              </div>
            ))}
          </div>
          <div className="flow-engine-col">
            <h3 className="flow-engine-col-head">Connectors at MVP</h3>
            <div className="connector-group-label">SOURCES</div>
            {SOURCES.map((s) => (
              <div key={s} className="connector-item">
                <span className="connector-check">✓</span>
                <span>{s}</span>
              </div>
            ))}
            <div className="connector-group-label" style={{ marginTop: '1rem' }}>DESTINATIONS</div>
            {DESTINATIONS.map((d) => (
              <div key={d} className="connector-item">
                <span className="connector-check">✓</span>
                <span>{d}</span>
              </div>
            ))}
            <div className="connector-plugin-note">
              Plugin architecture — new connectors drop into the registry with zero changes to the core engine.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
