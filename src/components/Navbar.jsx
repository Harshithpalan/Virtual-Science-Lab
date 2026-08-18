import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FlaskConical, Atom, Leaf, Brain, Home, Menu, X } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/chemistry', label: 'Chemistry', icon: FlaskConical },
  { path: '/physics', label: 'Physics', icon: Atom },
  { path: '/biology', label: 'Biology', icon: Leaf },
  { path: '/ai', label: 'AI Lab', icon: Brain },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <FlaskConical size={22} />
          </div>
          <span>Virtual Science Lab</span>
        </Link>

        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: rgba(15, 15, 26, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          z-index: 1000;
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 1.1rem;
        }
        .brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--accent), var(--accent-light));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .nav-links {
          display: flex;
          gap: 0.5rem;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-card);
        }
        .nav-link.active {
          color: var(--accent-light);
          background: rgba(99, 102, 241, 0.1);
        }
        .mobile-toggle {
          display: none;
          background: none;
          color: var(--text-primary);
          padding: 0.5rem;
        }
        @media (max-width: 768px) {
          .mobile-toggle {
            display: block;
          }
          .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border);
            flex-direction: column;
            padding: 1rem;
            transform: translateY(-100%);
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
          }
          .nav-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: all;
          }
          .nav-container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </nav>
  )
}
