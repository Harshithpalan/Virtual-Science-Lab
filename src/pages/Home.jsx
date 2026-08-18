import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FlaskConical, Atom, Leaf, Brain, ArrowRight, Beaker, Zap, Dna, Sparkles } from 'lucide-react'

const labs = [
  {
    path: '/chemistry',
    title: 'Chemistry Lab',
    description: 'Mix chemicals, observe reactions, test pH levels, and learn about molecular interactions',
    icon: FlaskConical,
    color: '#f59e0b',
    features: ['Mix Chemicals', 'Observe Reactions', 'pH Testing', 'Indicator Experiments'],
  },
  {
    path: '/physics',
    title: 'Physics Lab',
    description: 'Explore mechanics, electricity, waves, and optics through interactive simulations',
    icon: Atom,
    color: '#3b82f6',
    features: ['Forces & Motion', 'Electric Circuits', 'Wave Interference', 'Light Refraction'],
  },
  {
    path: '/biology',
    title: 'Biology Lab',
    description: 'Examine cells, explore DNA, use virtual microscopes, and study living organisms',
    icon: Leaf,
    color: '#22c55e',
    features: ['Cell Explorer', 'DNA Builder', 'Virtual Microscope', 'Organelle Study'],
  },
  {
    path: '/ai',
    title: 'AI Lab Assistant',
    description: 'Get AI-powered guidance, predictions, and analysis for all your experiments',
    icon: Brain,
    color: '#8b5cf6',
    features: ['Lab Assistant Chat', 'Experiment Predictions', 'Result Analysis', 'Smart Guidance'],
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <div className="home">
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>AI-Powered Experiments</span>
        </div>
        <h1>
          Welcome to the<br />
          <span className="gradient-text">Virtual Science Lab</span>
        </h1>
        <p>
          Explore chemistry, physics, and biology through interactive simulations.
          Get real-time AI guidance and predictions for every experiment.
        </p>
      </motion.div>

      <motion.div
        className="lab-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {labs.map((lab) => {
          const Icon = lab.icon
          return (
            <motion.div key={lab.path} variants={item}>
              <Link to={lab.path} className="lab-card" style={{ '--accent-color': lab.color }}>
                <div className="lab-card-header">
                  <div className="lab-icon" style={{ background: `${lab.color}20`, color: lab.color }}>
                    <Icon size={28} />
                  </div>
                  <ArrowRight size={18} className="arrow" />
                </div>
                <h3>{lab.title}</h3>
                <p>{lab.description}</p>
                <div className="lab-features">
                  {lab.features.map((f) => (
                    <span key={f} className="feature-tag" style={{ borderColor: `${lab.color}40` }}>
                      {f}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        className="stats-bar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="stat">
          <Beaker size={20} />
          <div>
            <span className="stat-num">8+</span>
            <span className="stat-label">Chemical Reactions</span>
          </div>
        </div>
        <div className="stat">
          <Zap size={20} />
          <div>
            <span className="stat-num">6+</span>
            <span className="stat-label">Physics Simulations</span>
          </div>
        </div>
        <div className="stat">
          <Dna size={20} />
          <div>
            <span className="stat-num">4+</span>
            <span className="stat-label">Biology Explorations</span>
          </div>
        </div>
        <div className="stat">
          <Sparkles size={20} />
          <div>
            <span className="stat-num">AI</span>
            <span className="stat-label">Powered Analysis</span>
          </div>
        </div>
      </motion.div>

      <style>{`
        .home {
          min-height: calc(100vh - 70px);
        }
        .hero {
          text-align: center;
          padding: 4rem 2rem 3rem;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          color: #a78bfa;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }
        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }
        .gradient-text {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero p {
          color: var(--text-secondary);
          font-size: 1.15rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .lab-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 0 2rem 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .lab-card {
          display: block;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }
        .lab-card:hover {
          border-color: var(--accent-color);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }
        .lab-card:hover .arrow {
          transform: translateX(4px);
          opacity: 1;
        }
        .lab-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .lab-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .arrow {
          color: var(--text-muted);
          opacity: 0;
          transition: all 0.3s ease;
        }
        .lab-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .lab-card p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .lab-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .feature-tag {
          font-size: 0.75rem;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          border: 1px solid;
          color: var(--text-secondary);
          background: rgba(255,255,255,0.03);
        }
        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 3rem;
          padding: 2rem;
          max-width: 900px;
          margin: 0 auto 3rem;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          margin-left: auto;
          margin-right: auto;
          margin-left: 2rem;
          margin-right: 2rem;
        }
        .stat {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-secondary);
        }
        .stat div {
          display: flex;
          flex-direction: column;
        }
        .stat-num {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--accent-light);
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        @media (max-width: 768px) {
          .hero h1 { font-size: 2.2rem; }
          .lab-grid { grid-template-columns: 1fr; padding: 0 1rem 2rem; }
          .stats-bar { flex-wrap: wrap; gap: 1.5rem; padding: 1.5rem; margin: 0 1rem 2rem; }
        }
      `}</style>
    </div>
  )
}
