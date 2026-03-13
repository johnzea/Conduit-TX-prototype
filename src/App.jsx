import { useState } from 'react'
import './App.css'

// ── Data ──────────────────────────────────────────────────────────────────────

const PROVIDERS = [
  { id: 1, name: 'Bloomberg Terminal', short: 'BBG',  type: 'Market Data',  category: 'market-data', status: 'connected',   latency: '12ms',  uptime: '99.98%', requestsToday: 142304 },
  { id: 2, name: 'Refinitiv Elektron', short: 'LSEG', type: 'Market Data',  category: 'market-data', status: 'connected',   latency: '18ms',  uptime: '99.95%', requestsToday: 98421  },
  { id: 3, name: 'JPMorgan ACCESS',    short: 'JPM',  type: 'Banking',      category: 'bank',        status: 'connected',   latency: '45ms',  uptime: '99.99%', requestsToday: 3201   },
  { id: 4, name: 'Goldman Sachs TxB', short: 'GS',   type: 'Banking',      category: 'bank',        status: 'degraded',    latency: '210ms', uptime: '98.2%',  requestsToday: 1892   },
  { id: 5, name: 'CME Group API',     short: 'CME',  type: 'Exchange',     category: 'exchange',    status: 'connected',   latency: '8ms',   uptime: '99.97%', requestsToday: 56780  },
  { id: 6, name: 'ICE Data Services', short: 'ICE',  type: 'Exchange',     category: 'exchange',    status: 'connected',   latency: '11ms',  uptime: '99.96%', requestsToday: 34120  },
  { id: 7, name: 'Kyriba',            short: 'KYR',  type: 'Treasury WS',  category: 'treasury',    status: 'connected',   latency: '55ms',  uptime: '99.9%',  requestsToday: 8421   },
  { id: 8, name: 'ION Treasury',      short: 'ION',  type: 'Treasury WS',  category: 'treasury',    status: 'connected',   latency: '62ms',  uptime: '99.88%', requestsToday: 6103   },
  { id: 9, name: 'FIS Quantum',       short: 'FIS',  type: 'Treasury WS',  category: 'treasury',    status: 'maintenance', latency: '--',    uptime: '97.1%',  requestsToday: 0      },
]

const WORKFLOWS = [
  { id: 'WF-001', name: 'FX Rate Synchronisation',      source: 'Bloomberg Terminal', dest: 'Kyriba',         schedule: 'Every 5 min',      status: 'active',   lastRun: '2 min ago',  nextRun: 'in 3 min',       jobsToday: 288,  errorRate: '0.0%',  transforms: ['FX Normalise', 'Rate Mapping']    },
  { id: 'WF-002', name: 'Cash Position Reconciliation', source: 'JPMorgan ACCESS',    dest: 'ION Treasury',   schedule: '08:00/12:00/16:00', status: 'active',   lastRun: '2h ago',     nextRun: 'in 1h 45m',      jobsToday: 6,    errorRate: '0.0%',  transforms: ['Balance Agg.', 'Position Calc']   },
  { id: 'WF-003', name: 'Real-Time Market Feed',        source: 'Refinitiv Elektron', dest: 'FIS Quantum',    schedule: 'Streaming',        status: 'paused',   lastRun: '4h ago',     nextRun: '--',             jobsToday: 0,    errorRate: '0.0%',  transforms: ['Tick Normalise', 'FIXML Map']     },
  { id: 'WF-004', name: 'Trade Confirmation Ingestion', source: 'CME Group API',      dest: 'Kyriba',         schedule: 'Event-driven',     status: 'active',   lastRun: '8 min ago',  nextRun: 'On-trade',       jobsToday: 1204, errorRate: '0.08%', transforms: ['Parse Confirm', 'Trade Enrich']   },
  { id: 'WF-005', name: 'Overnight FX Settlements',     source: 'Goldman Sachs TxB',  dest: 'ION Treasury',   schedule: '22:00 Mon–Fri',    status: 'degraded', lastRun: 'yesterday',  nextRun: 'in 14h 12m',     jobsToday: 1,    errorRate: '12.4%', transforms: ['Batch Netting', 'SWIFT MT202']    },
  { id: 'WF-006', name: 'Interest Rate Curve Update',   source: 'ICE Data Services',  dest: 'Kyriba',         schedule: '07:00 Mon–Fri',    status: 'active',   lastRun: '6h ago',     nextRun: 'tomorrow 07:00', jobsToday: 1,    errorRate: '0.0%',  transforms: ['Curve Extract', 'Tenor Map']      },
]

const QUEUE = [
  { id: 'JOB-8821', workflow: 'FX Rate Synchronisation',      status: 'processing', started: '12s ago',    duration: '--',    records: 142 },
  { id: 'JOB-8820', workflow: 'Trade Confirmation Ingestion', status: 'completed',  started: '2 min ago',  duration: '1.2s',  records: 14  },
  { id: 'JOB-8819', workflow: 'FX Rate Synchronisation',      status: 'completed',  started: '7 min ago',  duration: '0.9s',  records: 142 },
  { id: 'JOB-8818', workflow: 'Trade Confirmation Ingestion', status: 'completed',  started: '9 min ago',  duration: '2.1s',  records: 8   },
  { id: 'JOB-8817', workflow: 'Overnight FX Settlements',     status: 'failed',     started: '22 min ago', duration: '45.2s', records: 0   },
  { id: 'JOB-8816', workflow: 'Cash Position Reconciliation', status: 'completed',  started: '2h ago',     duration: '4.8s',  records: 312 },
  { id: 'JOB-8815', workflow: 'Interest Rate Curve Update',   status: 'completed',  started: '6h ago',     duration: '3.2s',  records: 89  },
  { id: 'JOB-8814', workflow: 'Trade Confirmation Ingestion', status: 'completed',  started: '6h 12m ago', duration: '1.8s',  records: 23  },
]

const SCHEDULED = [
  { id: 'SCH-001', workflow: 'FX Rate Synchronisation',      cron: '*/5 * * * *',       label: 'Every 5 minutes',               nextRun: 'in 3 min',       enabled: true, runsToday: 288, failures: 0 },
  { id: 'SCH-002', workflow: 'Cash Position Reconciliation', cron: '0 8,12,16 * * 1-5', label: '08:00, 12:00, 16:00 (Mon–Fri)', nextRun: 'in 1h 45m',      enabled: true, runsToday: 6,   failures: 0 },
  { id: 'SCH-003', workflow: 'Overnight FX Settlements',     cron: '0 22 * * 1-5',      label: '22:00 (Mon–Fri)',               nextRun: 'in 14h 12m',     enabled: true, runsToday: 1,   failures: 1 },
  { id: 'SCH-004', workflow: 'Interest Rate Curve Update',   cron: '0 7 * * 1-5',       label: '07:00 (Mon–Fri)',               nextRun: 'tomorrow 07:00', enabled: true, runsToday: 1,   failures: 0 },
]

const ACTIVITY = [
  { id: 1,  time: '14:32:08', type: 'success', msg: 'WF-001 completed — 142 FX rates delivered to Kyriba' },
  { id: 2,  time: '14:31:55', type: 'info',    msg: 'WF-004 inbound event — EUR/USD 5M notional, CME trade confirmation' },
  { id: 3,  time: '14:30:12', type: 'error',   msg: 'WF-005 retry 3/3 failed — Goldman Sachs TxB timeout after 45s' },
  { id: 4,  time: '14:27:08', type: 'success', msg: 'WF-001 completed — 142 FX rates delivered to Kyriba' },
  { id: 5,  time: '14:22:08', type: 'success', msg: 'WF-001 completed — 142 FX rates delivered to Kyriba' },
  { id: 6,  time: '14:17:22', type: 'info',    msg: 'WF-004 inbound event — GBP/USD 2.5M notional, CME trade confirmation' },
  { id: 7,  time: '14:10:00', type: 'success', msg: 'WF-002 completed — 312 positions reconciled to ION Treasury' },
  { id: 8,  time: '13:45:02', type: 'warning', msg: 'Alert — Goldman Sachs TxB latency elevated (avg 210ms, threshold 150ms)' },
  { id: 9,  time: '12:10:01', type: 'success', msg: 'WF-002 completed — 309 positions reconciled to ION Treasury' },
  { id: 10, time: '08:00:04', type: 'success', msg: 'WF-002 completed — 301 positions reconciled to ION Treasury' },
  { id: 11, time: '07:00:02', type: 'success', msg: 'WF-006 completed — 89 rate curve tenors delivered to Kyriba' },
]

const HOURLY = [
  { hour: '07:00', calls: 18200 },
  { hour: '08:00', calls: 44800 },
  { hour: '09:00', calls: 61900 },
  { hour: '10:00', calls: 71200 },
  { hour: '11:00', calls: 57800 },
  { hour: '12:00', calls: 48300 },
  { hour: '13:00', calls: 51900 },
  { hour: '14:00', calls: 38100 },
]

// ── Utilities ─────────────────────────────────────────────────────────────────

function fmtNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(n >= 100000 ? 0 : 1) + 'k'
  return String(n)
}

// ── Shared Components ─────────────────────────────────────────────────────────

function StatusDot({ status }) {
  return <span className={`dot dot-${status}`} />
}

function Badge({ status }) {
  const labels = {
    connected: 'Connected', degraded: 'Degraded', maintenance: 'Maintenance',
    active: 'Active', paused: 'Paused', processing: 'Processing',
    completed: 'Completed', failed: 'Failed',
  }
  return <span className={`badge badge-${status}`}>{labels[status] || status}</span>
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div className="env-badge">PRODUCTION</div>
    </div>
  )
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="logo">
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <circle cx="7" cy="15" r="5.5" fill="#3b82f6" />
        <circle cx="23" cy="7" r="4" fill="#0ea5e9" />
        <circle cx="23" cy="23" r="4" fill="#0ea5e9" />
        <line x1="12.2" y1="12.8" x2="19.2" y2="8.6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12.2" y1="17.2" x2="19.2" y2="21.4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="logo-text">
        <span className="logo-name">CONDUIT</span><span className="logo-tx">·TX</span>
      </div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar({ active, onNav, onLogout, user }) {
  const alerts = WORKFLOWS.filter(w => w.status === 'degraded').length

  const nav = [
    { id: 'dashboard', label: 'Dashboard',      d: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z' },
    { id: 'providers', label: 'API Connections', d: 'M18 5a3 3 0 11-6 0 3 3 0 016 0zM9 12a3 3 0 11-6 0 3 3 0 016 0zm9 7a3 3 0 11-6 0 3 3 0 016 0zM9 12h3m3-7l-3 5m3 7l-3-5' },
    { id: 'workflows', label: 'Workflows',       d: 'M5 12a2 2 0 100-4 2 2 0 000 4zm7-4a2 2 0 100-4 2 2 0 000 4zm7 4a2 2 0 100-4 2 2 0 000 4zM7 10l3 1m4 0l3-1' },
    { id: 'queue',     label: 'Job Queue',       d: 'M4 6h16M4 10h16M4 14h16M4 18h10' },
    { id: 'scheduler', label: 'Scheduler',       d: 'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 5v5l3.5 3.5' },
    { id: 'activity',  label: 'Activity Log',    d: 'M4 6h16M4 10h16M4 14h10M4 18h14' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Logo />
        <div className="sidebar-tagline">Treasury API Platform</div>
      </div>
      <nav className="sidebar-nav">
        {nav.map(item => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? 'nav-item--active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <svg className="nav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.d} />
            </svg>
            <span className="nav-label">{item.label}</span>
            {item.id === 'workflows' && alerts > 0 && (
              <span className="nav-alert">{alerts}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="system-status">
          <StatusDot status={alerts > 0 ? 'degraded' : 'connected'} />
          <span>{alerts > 0 ? `${alerts} workflow alert` : 'All systems operational'}</span>
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">{user.name[0]}</div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Sign out">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function ThroughputChart() {
  const max = Math.max(...HOURLY.map(d => d.calls))
  return (
    <div className="chart-wrap">
      <div className="bar-chart">
        {HOURLY.map((d, i) => (
          <div key={i} className="bar-col">
            <div className="bar-track">
              <div
                className={`bar-fill ${i === HOURLY.length - 1 ? 'bar-fill--current' : ''}`}
                style={{ height: `${(d.calls / max) * 100}%` }}
              />
            </div>
            <span className="bar-label">{d.hour}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Dashboard() {
  const totalCalls = HOURLY.reduce((s, d) => s + d.calls, 0)
  const activeWf = WORKFLOWS.filter(w => w.status === 'active').length
  const totalJobs = WORKFLOWS.reduce((s, w) => s + w.jobsToday, 0)
  const alerts = WORKFLOWS.filter(w => w.status === 'degraded').length

  return (
    <div className="page">
      <PageHeader title="Dashboard" subtitle="Real-time overview of your treasury API operations" />

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{fmtNum(totalCalls)}</div>
            <div className="kpi-label">API Calls Today</div>
            <div className="kpi-delta kpi-delta--up">↑ 12.4% vs yesterday</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--teal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{activeWf} <span className="kpi-denom">/ {WORKFLOWS.length}</span></div>
            <div className="kpi-label">Active Workflows</div>
            <div className="kpi-delta kpi-delta--warn">1 degraded · 1 paused</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{fmtNum(totalJobs)}</div>
            <div className="kpi-label">Jobs Processed</div>
            <div className="kpi-delta kpi-delta--up">avg 2.1s per job</div>
          </div>
        </div>
        <div className="kpi-card">
          <div className={`kpi-icon ${alerts > 0 ? 'kpi-icon--red' : 'kpi-icon--green'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <div className="kpi-body">
            <div className="kpi-value">{alerts}</div>
            <div className="kpi-label">Active Alerts</div>
            <div className={`kpi-delta ${alerts > 0 ? 'kpi-delta--err' : 'kpi-delta--up'}`}>
              {alerts > 0 ? 'GS TxB latency elevated' : 'No issues detected'}
            </div>
          </div>
        </div>
      </div>

      <div className="dash-row">
        <div className="card">
          <div className="card-header">
            <h3>API Throughput — Today</h3>
            <span className="card-meta">calls / hour</span>
          </div>
          <ThroughputChart />
        </div>
        <div className="card">
          <div className="card-header"><h3>Provider Health</h3></div>
          <div className="provider-health-grid">
            {PROVIDERS.map(p => (
              <div key={p.id} className={`ph-item ph-item--${p.status}`} title={`${p.name} — ${p.status} — ${p.latency}`}>
                <div className="ph-abbr">{p.short}</div>
                <StatusDot status={p.status} />
              </div>
            ))}
          </div>
          <div className="provider-legend">
            <span><StatusDot status="connected" /> Connected</span>
            <span><StatusDot status="degraded" /> Degraded</span>
            <span><StatusDot status="maintenance" /> Maint.</span>
          </div>
        </div>
      </div>

      <div className="dash-row">
        <div className="card">
          <div className="card-header"><h3>Workflow Status</h3></div>
          <table className="data-table">
            <thead>
              <tr><th>Workflow</th><th>Route</th><th>Status</th><th>Last Run</th><th>Jobs Today</th></tr>
            </thead>
            <tbody>
              {WORKFLOWS.map(wf => (
                <tr key={wf.id} className={wf.status === 'degraded' ? 'row-warn' : ''}>
                  <td><span className="tag">{wf.id}</span> {wf.name}</td>
                  <td className="route-cell muted">{wf.source} <span className="arrow">→</span> {wf.dest}</td>
                  <td><Badge status={wf.status} /></td>
                  <td className="muted">{wf.lastRun}</td>
                  <td>{wf.jobsToday.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-header"><h3>Recent Activity</h3></div>
          <div className="activity-list">
            {ACTIVITY.slice(0, 6).map(ev => (
              <div key={ev.id} className={`activity-item activity-item--${ev.type}`}>
                <span className="activity-dot" />
                <div className="activity-body">
                  <span className="activity-time">{ev.time}</span>
                  <span className="activity-msg">{ev.msg}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Providers ─────────────────────────────────────────────────────────────────

function Providers() {
  const [filter, setFilter] = useState('all')
  const cats = ['all', 'market-data', 'bank', 'exchange', 'treasury']
  const labels = { all: 'All', 'market-data': 'Market Data', bank: 'Banking', exchange: 'Exchange', treasury: 'Treasury WS' }
  const visible = filter === 'all' ? PROVIDERS : PROVIDERS.filter(p => p.category === filter)

  return (
    <div className="page">
      <PageHeader title="API Connections" subtitle="Connected third-party providers and their operational health" />
      <div className="filter-bar">
        {cats.map(c => (
          <button key={c} className={`filter-btn ${filter === c ? 'filter-btn--active' : ''}`} onClick={() => setFilter(c)}>
            {labels[c]}
          </button>
        ))}
      </div>
      <div className="provider-grid">
        {visible.map(p => (
          <div key={p.id} className={`provider-card provider-card--${p.status}`}>
            <div className="provider-card-header">
              <div className="provider-avatar">{p.short}</div>
              <div className="provider-name-block">
                <div className="provider-name">{p.name}</div>
                <div className="provider-type">{p.type}</div>
              </div>
              <Badge status={p.status} />
            </div>
            <div className="provider-stats">
              <div className="pstat">
                <span className="pstat-val">{fmtNum(p.requestsToday)}</span>
                <span className="pstat-label">calls today</span>
              </div>
              <div className="pstat">
                <span className={`pstat-val ${p.status === 'degraded' ? 'text-warn' : ''}`}>{p.latency}</span>
                <span className="pstat-label">latency</span>
              </div>
              <div className="pstat">
                <span className={`pstat-val ${parseFloat(p.uptime) < 99 ? 'text-warn' : ''}`}>{p.uptime}</span>
                <span className="pstat-label">uptime</span>
              </div>
            </div>
            <div className="provider-endpoint">
              <span className="endpoint-label">REST</span>
              <span className="endpoint-url">api.conduit-tx.io/v1/{p.short.toLowerCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Workflow Canvas (Node-RED style) ──────────────────────────────────────────

const CAT_COLORS = {
  'market-data': { bg: 'rgba(14,165,233,0.14)', border: 'rgba(14,165,233,0.45)', accent: '#0ea5e9' },
  'bank':        { bg: 'rgba(139,92,246,0.14)', border: 'rgba(139,92,246,0.45)', accent: '#8b5cf6' },
  'exchange':    { bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.45)', accent: '#f59e0b' },
  'treasury':    { bg: 'rgba(16,185,129,0.14)', border: 'rgba(16,185,129,0.45)', accent: '#10b981' },
}

const STATUS_DOT_COLORS = {
  active: '#10b981', degraded: '#f59e0b', paused: '#475569', maintenance: '#64748b',
}

const WIRE_COLORS = {
  active: 'rgba(59,130,246,0.8)', degraded: 'rgba(245,158,11,0.8)',
  paused: 'rgba(71,85,105,0.4)', maintenance: 'rgba(71,85,105,0.3)',
}

function FlowCanvas() {
  // Layout constants
  const W = 680
  const ROW_H = 72
  const NODE_H = 38
  const H = WORKFLOWS.length * ROW_H + 36

  // Column x positions and widths
  const SRC_X = 16,  SRC_W = 126
  const CT_X  = 192, CT_W  = 270   // conduit-tx dashed container
  const T1_X  = 198, T1_W  = 102
  const T2_X  = 356, T2_W  = 100
  const DST_X = 522, DST_W = 126

  const nodeTop = (i) => 24 + i * ROW_H
  const nodeCY  = (i) => nodeTop(i) + NODE_H / 2  // vertical center

  // Cubic bezier wire: same y, gentle S-curve
  const wire = (x1, y, x2) => {
    const d = (x2 - x1) * 0.45
    return `M ${x1} ${y} C ${x1 + d} ${y} ${x2 - d} ${y} ${x2} ${y}`
  }

  return (
    <div className="flow-canvas-wrap">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="flow-svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="rgba(255,255,255,0.07)" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width={W} height={H} fill="#0d1b2e" rx="10" />
        <rect width={W} height={H} fill="url(#dots)" rx="10" />

        {/* Watermark */}
        <text x={W / 2} y={H / 2 + 16} textAnchor="middle" fill="rgba(59,130,246,0.035)"
          fontSize="52" fontWeight="800" letterSpacing="0.1em" fontFamily="system-ui, sans-serif">
          CONDUIT·TX
        </text>

        {/* Column labels */}
        {[
          [SRC_X + SRC_W / 2, 'SOURCE'],
          [CT_X + CT_W / 2,   'CONDUIT·TX'],
          [DST_X + DST_W / 2, 'DESTINATION'],
        ].map(([x, label]) => (
          <text key={label} x={x} y={14} textAnchor="middle" fill="rgba(148,163,184,0.35)"
            fontSize="7.5" letterSpacing="0.12em" fontFamily="system-ui, sans-serif" fontWeight="600">
            {label}
          </text>
        ))}

        {WORKFLOWS.map((wf, i) => {
          const top = nodeTop(i)
          const cy = nodeCY(i)
          const src = PROVIDERS.find(p => p.name === wf.source)
          const dst = PROVIDERS.find(p => p.name === wf.dest)
          const sc = CAT_COLORS[src?.category] || CAT_COLORS['market-data']
          const dc = CAT_COLORS[dst?.category] || CAT_COLORS['treasury']
          const wc = WIRE_COLORS[wf.status] || WIRE_COLORS.paused
          const sdot = STATUS_DOT_COLORS[wf.status]
          const [t1, t2] = wf.transforms

          // Port x positions
          const srcR = SRC_X + SRC_W
          const t1L  = T1_X
          const t1R  = T1_X + T1_W
          const t2L  = T2_X
          const t2R  = T2_X + T2_W
          const dstL = DST_X

          return (
            <g key={wf.id}>
              {/* Row divider */}
              {i > 0 && (
                <line x1="12" y1={top} x2={W - 12} y2={top} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              )}

              {/* Conduit-TX dashed container */}
              <rect
                x={CT_X} y={top + 1} width={CT_W} height={NODE_H + 6}
                rx="5" fill="rgba(59,130,246,0.04)"
                stroke="rgba(59,130,246,0.18)" strokeWidth="1" strokeDasharray="5 3"
              />

              {/* Internal T1→T2 wire (inside conduit-tx) */}
              <path d={wire(t1R, cy, t2L)} stroke="rgba(59,130,246,0.28)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* External wires */}
              <path d={wire(srcR, cy, t1L)} stroke={wc} strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d={wire(t2R, cy, dstL)} stroke={wc} strokeWidth="1.8" fill="none" strokeLinecap="round" />

              {/* ── Source node ── */}
              <rect x={SRC_X} y={top + 4} width={SRC_W} height={NODE_H} rx="4" fill={sc.bg} stroke={sc.border} strokeWidth="1" />
              {/* Left accent bar */}
              <rect x={SRC_X} y={top + 4} width={4} height={NODE_H} rx="2" fill={sc.accent} />
              {/* Status dot */}
              <circle cx={SRC_X + SRC_W - 8} cy={top + 12} r="4" fill={sdot} />
              {/* Text */}
              <text x={SRC_X + 12} y={top + 19} fill="white" fontSize="10.5" fontWeight="700" fontFamily="system-ui, sans-serif">{src?.short}</text>
              <text x={SRC_X + 12} y={top + 32} fill="rgba(255,255,255,0.45)" fontSize="8.5" fontFamily="system-ui, sans-serif">{src?.type}</text>
              {/* Right port */}
              <circle cx={srcR} cy={cy} r="4.5" fill="#0d1b2e" stroke={sc.accent} strokeWidth="1.5" />

              {/* ── Transform 1 node ── */}
              <rect x={T1_X} y={top + 4} width={T1_W} height={NODE_H} rx="4" fill="rgba(15,32,64,0.95)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
              <rect x={T1_X} y={top + 4} width={4} height={NODE_H} rx="2" fill="#3b82f6" />
              <text x={T1_X + 12} y={top + 26} fill="rgba(255,255,255,0.88)" fontSize="10" fontFamily="system-ui, sans-serif">{t1}</text>
              <circle cx={t1L} cy={cy} r="4" fill="#0d1b2e" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx={t1R} cy={cy} r="4" fill="#0d1b2e" stroke="#3b82f6" strokeWidth="1.5" />

              {/* ── Transform 2 node ── */}
              <rect x={T2_X} y={top + 4} width={T2_W} height={NODE_H} rx="4" fill="rgba(15,32,64,0.95)" stroke="rgba(59,130,246,0.3)" strokeWidth="1" />
              <rect x={T2_X} y={top + 4} width={4} height={NODE_H} rx="2" fill="#3b82f6" />
              <text x={T2_X + 12} y={top + 26} fill="rgba(255,255,255,0.88)" fontSize="10" fontFamily="system-ui, sans-serif">{t2}</text>
              <circle cx={t2L} cy={cy} r="4" fill="#0d1b2e" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx={t2R} cy={cy} r="4" fill="#0d1b2e" stroke="#3b82f6" strokeWidth="1.5" />

              {/* ── Destination node ── */}
              <rect x={DST_X} y={top + 4} width={DST_W} height={NODE_H} rx="4" fill={dc.bg} stroke={dc.border} strokeWidth="1" />
              <rect x={DST_X} y={top + 4} width={4} height={NODE_H} rx="2" fill={dc.accent} />
              <text x={DST_X + 12} y={top + 19} fill="white" fontSize="10.5" fontWeight="700" fontFamily="system-ui, sans-serif">{dst?.short}</text>
              <text x={DST_X + 12} y={top + 32} fill="rgba(255,255,255,0.45)" fontSize="8.5" fontFamily="system-ui, sans-serif">{dst?.type}</text>
              <circle cx={dstL} cy={cy} r="4.5" fill="#0d1b2e" stroke={dc.accent} strokeWidth="1.5" />
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flow-legend">
        {Object.entries(CAT_COLORS).map(([cat, c]) => (
          <span key={cat} className="flow-legend-item">
            <span className="flow-legend-dot" style={{ background: c.accent }} />
            {cat === 'market-data' ? 'Market Data' : cat === 'treasury' ? 'Treasury WS' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </span>
        ))}
        <span className="flow-legend-sep" />
        {Object.entries(WIRE_COLORS).map(([s, c]) => (
          <span key={s} className="flow-legend-item">
            <span className="flow-legend-line" style={{ background: c.replace(/[\d.]+\)$/, '1)') }} />
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Workflows ─────────────────────────────────────────────────────────────────

function Workflows() {
  return (
    <div className="page">
      <PageHeader title="Workflows" subtitle="API translation and delivery pipelines between providers and treasury workstations" />
      <FlowCanvas />
      <div className="card">
        <div className="card-header"><h3>Workflow Details</h3></div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Workflow</th><th>Trigger</th>
              <th>Status</th><th>Last Run</th><th>Next Run</th>
              <th>Jobs Today</th><th>Error Rate</th>
            </tr>
          </thead>
          <tbody>
            {WORKFLOWS.map(wf => (
              <tr key={wf.id} className={wf.status === 'degraded' ? 'row-warn' : ''}>
                <td><span className="tag">{wf.id}</span></td>
                <td><strong>{wf.name}</strong><br /><span className="muted" style={{ fontSize: 11 }}>{wf.source} → {wf.dest}</span></td>
                <td className="muted">{wf.schedule}</td>
                <td><Badge status={wf.status} /></td>
                <td className="muted">{wf.lastRun}</td>
                <td className="muted">{wf.nextRun}</td>
                <td>{wf.jobsToday.toLocaleString()}</td>
                <td className={parseFloat(wf.errorRate) > 1 ? 'text-err' : ''}>{wf.errorRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Queue ─────────────────────────────────────────────────────────────────────

function Queue() {
  return (
    <div className="page">
      <PageHeader title="Job Queue" subtitle="Real-time execution queue for all workflow jobs" />
      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Job ID</th><th>Workflow</th><th>Status</th><th>Started</th><th>Duration</th><th>Records</th></tr>
          </thead>
          <tbody>
            {QUEUE.map(job => (
              <tr key={job.id}>
                <td><span className="tag">{job.id}</span></td>
                <td>{job.workflow}</td>
                <td><Badge status={job.status} /></td>
                <td className="muted">{job.started}</td>
                <td className="muted">{job.duration}</td>
                <td className={job.status === 'failed' ? 'text-err' : ''}>{job.status === 'failed' ? '—' : job.records.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Scheduler ─────────────────────────────────────────────────────────────────

function Scheduler() {
  return (
    <div className="page">
      <PageHeader title="Scheduler" subtitle="Cron-based schedule configuration for recurring workflow jobs" />
      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Workflow</th><th>Cron</th><th>Schedule</th><th>Next Run</th><th>Runs Today</th><th>Failures</th><th>State</th></tr>
          </thead>
          <tbody>
            {SCHEDULED.map(s => (
              <tr key={s.id} className={s.failures > 0 ? 'row-warn' : ''}>
                <td><span className="tag">{s.id}</span></td>
                <td>{s.workflow}</td>
                <td><code className="cron-code">{s.cron}</code></td>
                <td className="muted">{s.label}</td>
                <td className="muted">{s.nextRun}</td>
                <td>{s.runsToday}</td>
                <td className={s.failures > 0 ? 'text-err' : 'muted'}>{s.failures}</td>
                <td><span className={`toggle toggle--${s.enabled ? 'on' : 'off'}`}>{s.enabled ? 'Enabled' : 'Disabled'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Activity Log ──────────────────────────────────────────────────────────────

function ActivityLog() {
  return (
    <div className="page">
      <PageHeader title="Activity Log" subtitle="Timestamped event stream for all workflow and provider activity" />
      <div className="card">
        <div className="log-list">
          {ACTIVITY.map(ev => (
            <div key={ev.id} className={`log-entry log-entry--${ev.type}`}>
              <span className="log-dot" />
              <span className="log-time">{ev.time}</span>
              <span className={`log-type log-type--${ev.type}`}>{ev.type.toUpperCase()}</span>
              <span className="log-msg">{ev.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Login ─────────────────────────────────────────────────────────────────────

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (email === 'demo@conduit-tx.io' && password === 'demo123') {
      onLogin({ email, name: 'Sarah Chen', role: 'Head of Treasury Ops' })
    } else {
      setError('Invalid credentials — use the demo credentials below')
    }
  }

  return (
    <div className="login-shell">
      <div className="login-hero">
        <Logo />
        <h2 className="login-hero-title">The intelligent API layer for treasury operations</h2>
        <p className="login-hero-sub">
          Connect your treasury workstation to banks, exchanges, and market data providers through a single unified integration platform.
        </p>
        <div className="login-features">
          {[
            ['⇆', 'REST API translation & normalisation'],
            ['⟳', 'Scheduled & event-driven workflows'],
            ['◈', 'Real-time monitoring & alerting'],
            ['⚡', 'Queue management & job scheduling'],
          ].map(([icon, text]) => (
            <div key={text} className="login-feature">
              <span className="login-feature-icon">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="login-providers">
          {['Bloomberg', 'Refinitiv', 'JPMorgan', 'Goldman Sachs', 'CME Group', 'ICE', 'Kyriba', 'ION Treasury', 'FIS'].map(p => (
            <span key={p} className="login-provider-pill">{p}</span>
          ))}
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-card">
          <div className="login-card-logo-mark">
            <svg width="36" height="36" viewBox="0 0 30 30" fill="none">
              <circle cx="7" cy="15" r="5.5" fill="#3b82f6" />
              <circle cx="23" cy="7" r="4" fill="#0ea5e9" />
              <circle cx="23" cy="23" r="4" fill="#0ea5e9" />
              <line x1="12.2" y1="12.8" x2="19.2" y2="8.6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="12.2" y1="17.2" x2="19.2" y2="21.4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="login-card-title">Sign in to Conduit·TX</h3>
          <p className="login-card-sub">Treasury Operations Platform</p>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label>Work Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="login-btn">Sign in →</button>
          </form>
          <div className="demo-hint">
            <strong>Demo credentials</strong>
            <span>demo@conduit-tx.io / demo123</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

const VIEWS = {
  dashboard: Dashboard, providers: Providers, workflows: Workflows,
  queue: Queue, scheduler: Scheduler, activity: ActivityLog,
}

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('dashboard')

  if (!user) return <Login onLogin={setUser} />

  const View = VIEWS[page]

  return (
    <div className="app-shell">
      <Sidebar active={page} onNav={setPage} onLogout={() => setUser(null)} user={user} />
      <main className="main-pane"><View /></main>
    </div>
  )
}
