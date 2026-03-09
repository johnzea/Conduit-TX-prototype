import { useState } from 'react'
import './App.css'

// Fake credentials
const FAKE_USER = {
  email: 'demo@conduit.com',
  password: 'demo123'
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      onLogin({ email })
    } else {
      setError('Invalid credentials. Try demo@conduit.com / demo123')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="app-name">Conduit-TX</h1>
          <p className="app-tagline">Sign in to your account</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="demo@conduit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="demo123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Sign In</button>
        </form>
        <p className="login-footer">
          Demo credentials: demo@conduit.com / demo123
        </p>
      </div>
    </div>
  )
}

function Home({ user, onLogout }) {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Conduit-TX Dashboard</h1>
        <div className="user-section">
          <span className="user-email">{user.email}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="widgets-grid">
        {/* Stats Widgets */}
        <div className="widget stat-widget">
          <div className="widget-icon">💰</div>
          <div className="widget-content">
            <div className="widget-label">Total Revenue</div>
            <div className="widget-value">$45,231</div>
            <div className="widget-change positive">+12.5% from last month</div>
          </div>
        </div>

        <div className="widget stat-widget">
          <div className="widget-icon">👥</div>
          <div className="widget-content">
            <div className="widget-label">Active Users</div>
            <div className="widget-value">2,345</div>
            <div className="widget-change positive">+8.2% from last month</div>
          </div>
        </div>

        <div className="widget stat-widget">
          <div className="widget-icon">📦</div>
          <div className="widget-content">
            <div className="widget-label">Total Orders</div>
            <div className="widget-value">1,234</div>
            <div className="widget-change negative">-3.1% from last month</div>
          </div>
        </div>

        <div className="widget stat-widget">
          <div className="widget-icon">⚡</div>
          <div className="widget-content">
            <div className="widget-label">System Status</div>
            <div className="widget-value">99.9%</div>
            <div className="widget-change positive">Operational</div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="widget chart-widget">
          <h3 className="widget-title">Monthly Revenue</h3>
          <div className="bar-chart">
            {[
              { month: 'Jan', value: 65 },
              { month: 'Feb', value: 78 },
              { month: 'Mar', value: 45 },
              { month: 'Apr', value: 88 },
              { month: 'May', value: 92 },
              { month: 'Jun', value: 70 }
            ].map(({ month, value }) => (
              <div key={month} className="bar-item">
                <div className="bar-fill" style={{ height: `${value}%` }}>
                  <span className="bar-value">${value}k</span>
                </div>
                <span className="bar-label">{month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="widget chart-widget">
          <h3 className="widget-title">User Growth Trend</h3>
          <svg className="line-chart" viewBox="0 0 300 150" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#1a73e8"
              strokeWidth="3"
              points="0,120 50,100 100,80 150,90 200,60 250,40 300,30"
            />
            <polyline
              fill="rgba(26, 115, 232, 0.1)"
              stroke="none"
              points="0,120 50,100 100,80 150,90 200,60 250,40 300,30 300,150 0,150"
            />
          </svg>
          <div className="chart-legend">
            <span>Jan - Jun 2026</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="widget activity-widget">
          <h3 className="widget-title">Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🔔</div>
              <div className="activity-content">
                <div className="activity-text">New order received</div>
                <div className="activity-time">2 minutes ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <div className="activity-text">Payment processed</div>
                <div className="activity-time">15 minutes ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <div className="activity-text">New user registered</div>
                <div className="activity-time">1 hour ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <div className="activity-text">Report generated</div>
                <div className="activity-time">3 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)

  return user ? (
    <Home user={user} onLogout={() => setUser(null)} />
  ) : (
    <Login onLogin={setUser} />
  )
}
