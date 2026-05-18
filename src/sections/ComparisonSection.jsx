const ROWS = [
  { cap: 'Treasury connector library', ctxTX: '✓  7 pre-built',       etl: 'Build yourself', scripts: 'Build yourself' },
  { cap: 'Native TMS delivery format',  ctxTX: '✓  Native, async-polled', etl: 'Not applicable',  scripts: 'Ad hoc' },
  { cap: 'Multi-tenant SaaS',           ctxTX: '✓  Full isolation',    etl: 'Limited',        scripts: 'None' },
  { cap: 'Credential security',         ctxTX: '✓  Encrypted store, zero-log', etl: 'Env vars / DB', scripts: 'Config files' },
  { cap: 'Audit trail',                 ctxTX: '✓  Append-only log',   etl: 'Partial',        scripts: 'None' },
  { cap: 'Visual flow builder',         ctxTX: '✓  DAG canvas + AI',   etl: 'Varies',         scripts: 'None' },
  { cap: 'Time-to-first-pipeline',      ctxTX: '✓  Minutes',           etl: 'Days–weeks',     scripts: 'Weeks–months' },
];

export default function ComparisonSection() {
  return (
    <div className="slide slide--mid">
      <div className="slide-inner slide-inner--wide">
        <div className="section-label">WHY CONDUIT TX</div>
        <h2 className="section-title">Purpose-built for treasury —<br />not a general-purpose ETL tool</h2>
        <div className="comparison-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="col-cap">Capability</th>
                <th className="col-ctx">Conduit TX</th>
                <th className="col-other">Generic ETL</th>
                <th className="col-other">Custom Scripts</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.cap}>
                  <td className="col-cap">{r.cap}</td>
                  <td className="col-ctx">{r.ctxTX}</td>
                  <td className="col-other">{r.etl}</td>
                  <td className="col-other">{r.scripts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
