import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Send, Lightbulb, TrendingUp, BarChart3, Sparkles, Bot, User, ChevronRight } from 'lucide-react'

const aiResponses = {
  greeting: "Hello! I'm your AI Lab Assistant. I can help you with:\n\n- **Experiment guidance** - Step-by-step instructions\n- **Predictions** - What will happen in a reaction\n- **Analysis** - Understanding your results\n\nWhat would you like to explore?",
  
  chemistry: {
    'hcl + naoh': "🔬 **Neutralization Reaction**\n\nWhen HCl (acid) mixes with NaOH (base):\n\n1. The H⁺ from HCl combines with OH⁻ from NaOH\n2. This forms H₂O (water)\n3. Na⁺ and Cl⁻ remain as NaCl (table salt)\n\n**Prediction:** The solution will heat up (exothermic) and reach pH 7 (neutral).\n\n**Observation:** You should notice temperature increase and the pH indicator will turn green/neutral.",
    
    'hcl + nahco3': "🧪 **Acid + Bicarbonate Reaction**\n\nThis produces **CO₂ gas** (bubbling/fizzing):\n\nHCl + NaHCO₃ → NaCl + H₂O + CO₂↑\n\n**Prediction:** Vigorous bubbling as carbon dioxide is released. The solution temperature may decrease slightly.\n\n**Safety Note:** This is the same reaction used in baking — vinegar + baking soda!",
    
    'h2so4 + naoh': "⚗️ **Strong Acid + Strong Base**\n\nH₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O\n\n**Prediction:** Very exothermic! Temperature can rise significantly. Handle with care in a real lab.\n\n**Key Concept:** Sulfuric acid is diprotic (donates 2 H⁺), so it needs twice as much NaOH for complete neutralization.",
    
    default: "🔍 **Chemical Analysis**\n\nI can help you understand this reaction! Here's what I know:\n\n- Check if the reactants are an acid, base, or salt\n- Determine if it's a neutralization, decomposition, or synthesis\n- Predict products based on chemical rules\n- Estimate temperature changes\n\nTry mixing different chemicals in the lab and ask me about the results!",
  },
  
  physics: {
    projectile: "🎯 **Projectile Motion Analysis**\n\n**Key Principles:**\n- Horizontal velocity is constant (no air resistance)\n- Vertical motion affected by gravity (g = 9.8 m/s²)\n- Path is a parabola\n\n**Optimal Launch:** 45° gives maximum range\n\n**Formula:**\n- Range = v²sin(2θ)/g\n- Max Height = v²sin²(θ)/(2g)\n\n**Prediction:** At 45°, the projectile will travel the farthest distance.",
    
    pendulum: "🔔 **Simple Pendulum Physics**\n\n**Period Formula:** T = 2π√(L/g)\n\n**Key Insights:**\n- Period depends ONLY on length and gravity\n- Mass doesn't affect the period!\n- Small angle approximation works for angles < 15°\n\n**Prediction:** Doubling the length increases period by √2 ≈ 1.41x",
    
    circuit: "⚡ **Circuit Analysis (Ohm's Law)**\n\n**V = IR**\n- V = Voltage (Volts)\n- I = Current (Amps)\n- R = Resistance (Ohms)\n\n**Power:** P = VI = I²R = V²/R\n\n**Prediction:** Increasing voltage increases current proportionally (for fixed resistance).",
    
    default: "🔬 **Physics Simulation Help**\n\nI can explain:\n- Forces and Newton's Laws\n- Energy conservation\n- Wave phenomena\n- Electromagnetic theory\n\nSelect a simulation and I'll provide detailed analysis!",
  },
  
  biology: {
    cell: "🧬 **Cell Biology Overview**\n\n**Animal vs Plant Cells:**\n| Feature | Animal | Plant |\n|---------|--------|-------|\n| Cell Wall | No | Yes |\n| Chloroplasts | No | Yes |\n| Central Vacuole | No | Large |\n| Shape | Irregular | Rectangular |\n\n**Key Organelles:**\n- **Nucleus:** DNA storage, control center\n- **Mitochondria:** ATP production (cellular respiration)\n- **Ribosomes:** Protein synthesis\n- **ER:** Protein/lipid transport",
    
    dna: "🧬 **DNA Structure**\n\n**Double Helix:**\n- Two complementary strands\n- A pairs with T (2 hydrogen bonds)\n- G pairs with C (3 hydrogen bonds)\n\n**Key Facts:**\n- Humans have ~3 billion base pairs\n- Only 1.5% codes for proteins\n- DNA replication is semi-conservative\n\n**Central Dogma:** DNA → RNA → Protein",
    
    default: "🔬 **Biology Lab Assistant**\n\nI can help with:\n- Cell structure and function\n- Genetics and DNA\n- Microscopy techniques\n- Biological processes\n\nExplore the Cell Explorer or DNA Builder and ask me questions!",
  },
}

const predictions = [
  { id: 1, title: 'Chemical Reaction Outcome', description: 'Predict what happens when you mix HCl + NaOH', category: 'chemistry', status: 'available' },
  { id: 2, title: 'Projectile Range', description: 'Calculate maximum distance for given angle/velocity', category: 'physics', status: 'available' },
  { id: 3, title: 'Pendulum Period', description: 'Predict oscillation time based on length', category: 'physics', status: 'available' },
  { id: 4, title: 'Circuit Current', description: 'Calculate current flow for any resistor configuration', category: 'physics', status: 'available' },
]

const analyses = [
  { id: 1, title: 'pH Analysis', description: 'Analyze acid-base mixture results and predict final pH', category: 'chemistry' },
  { id: 2, title: 'Energy Analysis', description: 'Calculate kinetic and potential energy in simulations', category: 'physics' },
  { id: 3, title: 'Cell Comparison', description: 'Compare animal and plant cell structures', category: 'biology' },
]

export default function AILab({ messages, setMessages }) {
  const [activeTab, setActiveTab] = useState('chat')
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: aiResponses.greeting }])
    }
  }, [messages.length, setMessages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      let response = ''
      const lower = input.toLowerCase()

      if (lower.includes('hcl') && lower.includes('naoh')) {
        response = aiResponses.chemistry['hcl + naoh']
      } else if (lower.includes('hcl') && lower.includes('nahco3')) {
        response = aiResponses.chemistry['hcl + nahco3']
      } else if (lower.includes('h2so4') && lower.includes('naoh')) {
        response = aiResponses.chemistry['h2so4 + naoh']
      } else if (lower.includes('projectile') || lower.includes('launch') || lower.includes('angle')) {
        response = aiResponses.physics.projectile
      } else if (lower.includes('pendulum') || lower.includes('oscillat')) {
        response = aiResponses.physics.pendulum
      } else if (lower.includes('circuit') || lower.includes('resistor') || lower.includes('voltage')) {
        response = aiResponses.physics.circuit
      } else if (lower.includes('cell') || lower.includes('organelle') || lower.includes('mitochondri')) {
        response = aiResponses.biology.cell
      } else if (lower.includes('dna') || lower.includes('base pair') || lower.includes('helix')) {
        response = aiResponses.biology.dna
      } else if (lower.includes('chem') || lower.includes('reaction') || lower.includes('mix')) {
        response = aiResponses.chemistry.default
      } else if (lower.includes('physic') || lower.includes('force') || lower.includes('motion')) {
        response = aiResponses.physics.default
      } else if (lower.includes('bio') || lower.includes('microscop')) {
        response = aiResponses.biology.default
      } else {
        response = "🤔 I'm not sure about that specific question. Try asking about:\n\n- A specific chemical reaction (e.g., 'What happens when HCl meets NaOH?')\n- Physics concepts (e.g., 'Explain projectile motion')\n- Biology topics (e.g., 'What are mitochondria?')\n\nI'm here to help with your science experiments!"
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }

  const quickQuestions = [
    'What happens when HCl meets NaOH?',
    'Explain projectile motion',
    'What are mitochondria?',
    'How does DNA replication work?',
  ]

  return (
    <div>
      <div className="page-header">
        <h1>AI Lab Assistant</h1>
        <p>Get intelligent guidance, predictions, and analysis for your experiments</p>
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', padding: '0 2rem', marginBottom: '2rem' }}>
        {[
          { id: 'chat', label: 'Chat Assistant', icon: <Brain size={16} /> },
          { id: 'predict', label: 'Predictions', icon: <TrendingUp size={16} /> },
          { id: 'analyze', label: 'Analysis', icon: <BarChart3 size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1rem', borderRadius: 10,
              background: activeTab === tab.id ? 'rgba(139,92,246,0.15)' : 'var(--bg-card)',
              border: `1px solid ${activeTab === tab.id ? 'var(--ai)' : 'var(--border)'}`,
              color: activeTab === tab.id ? 'var(--ai)' : 'var(--text-secondary)',
              fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="simulation-area">
        {activeTab === 'chat' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: 500 }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: msg.role === 'assistant' ? 'rgba(139,92,246,0.2)' : 'rgba(99,102,241,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {msg.role === 'assistant' ? <Bot size={16} style={{ color: 'var(--ai)' }} /> : <User size={16} style={{ color: 'var(--accent)' }} />}
                    </div>
                    <div style={{
                      maxWidth: '70%',
                      padding: '0.75rem 1rem',
                      borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
                      border: `1px solid ${msg.role === 'user' ? 'var(--accent)' : 'var(--border)'}`,
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={16} style={{ color: 'var(--ai)' }} />
                  </div>
                  <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: '12px 12px 12px 2px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: '50%', background: 'var(--ai)',
                          animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    style={{
                      padding: '0.4rem 0.8rem', borderRadius: 20,
                      background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
                      color: '#a78bfa', fontSize: '0.8rem', transition: 'all 0.2s',
                    }}
                  >
                    <Lightbulb size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid var(--border)' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about experiments, reactions, concepts..."
                style={{
                  flex: 1, padding: '0.7rem 1rem', borderRadius: 10,
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '0.9rem',
                }}
              />
              <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim()}>
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'predict' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--ai)', verticalAlign: 'middle' }} /> AI Predictions
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Select an experiment to get AI-powered predictions about outcomes
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {predictions.map((pred) => (
                <motion.div
                  key={pred.id}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    padding: '1.25rem', borderRadius: 12,
                    background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--ai)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className={`badge badge-${pred.category}`}>{pred.category}</span>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.3rem' }}>{pred.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pred.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analyze' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <BarChart3 size={18} style={{ color: 'var(--ai)', verticalAlign: 'middle' }} /> AI Analysis
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Get detailed analysis of your experiment results
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {analyses.map((analysis) => (
                <motion.div
                  key={analysis.id}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    padding: '1.25rem', borderRadius: 12,
                    background: 'var(--bg-primary)', border: '1px solid var(--border)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--ai)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span className={`badge badge-${analysis.category}`}>{analysis.category}</span>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.3rem' }}>{analysis.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{analysis.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Sample analysis */}
            <div className="result-panel" style={{ marginTop: '1.5rem' }}>
              <h3><Brain size={18} style={{ color: 'var(--ai)' }} /> Sample Analysis Report</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Accuracy</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>94.2%</div>
                  <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, marginTop: '0.3rem' }}>
                    <div style={{ width: '94.2%', height: '100%', background: 'var(--success)', borderRadius: 2 }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Confidence</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--ai)' }}>87.5%</div>
                  <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, marginTop: '0.3rem' }}>
                    <div style={{ width: '87.5%', height: '100%', background: 'var(--ai)', borderRadius: 2 }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Data Points</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--physics)' }}>1,247</div>
                  <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, marginTop: '0.3rem' }}>
                    <div style={{ width: '75%', height: '100%', background: 'var(--physics)', borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
