const PRIMARY = [
  {
    icon: '🎨',
    title: 'Visual Flow Designer',
    desc: 'Drag-and-drop canvas for building pipelines. Add nodes, connect edges, configure each step inline — no code or YAML required for standard pipelines.',
  },
  {
    icon: '✏️',
    title: 'Transform Editor + AI Assist',
    desc: 'Full-featured code editor for custom data transforms in an isolated sandbox. Guided field-mapping mode for non-developers. AI Assist streams code suggestions in real time.',
  },
  {
    icon: '📊',
    title: 'Run Observability',
    desc: 'Per-node execution timeline, input/output record inspection, and delivery status polling — all surfaced in a single run detail view.',
  },
];

const SECONDARY = [
  {
    icon: '📬',
    title: 'Dead Letter Queue',
    desc: 'Failed records surfaced with full context. Operators can Requeue, Replay, or Resolve individual entries without touching the pipeline config.',
  },
  {
    icon: '⚡',
    title: 'Reference Data Cache',
    desc: 'Market rates, FX spots, and frequently accessed data are cached and refreshed on a configurable schedule — ensuring pipelines run against consistent, low-latency data.',
  },
  {
    icon: '🔌',
    title: 'Connector Setup Wizard',
    desc: 'Schema-driven connector configuration forms. Credential sets stored to an encrypted secrets store — the UI never stores or echoes secret values.',
  },
];

function FeatureCard({ icon, title, desc, variant }) {
  return (
    <div className={`ux-card ux-card--${variant}`}>
      <span className="ux-card-icon">{icon}</span>
      <h3 className="ux-card-title">{title}</h3>
      <p className="ux-card-desc">{desc}</p>
    </div>
  );
}

export default function UXSection() {
  return (
    <div className="slide slide--deep">
      <div className="slide-inner slide-inner--wide">
        <div className="section-label">USER EXPERIENCE</div>
        <h2 className="section-title">Intuitive operator UI — no engineering required</h2>
        <div className="ux-grid ux-grid--primary">
          {PRIMARY.map((f) => <FeatureCard key={f.title} {...f} variant="primary" />)}
        </div>
        <div className="ux-grid ux-grid--secondary">
          {SECONDARY.map((f) => <FeatureCard key={f.title} {...f} variant="secondary" />)}
        </div>
      </div>
    </div>
  );
}
