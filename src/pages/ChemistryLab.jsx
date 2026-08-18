import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Droplets, Flame, RotateCcw, Sparkles } from 'lucide-react'
import { chemicals, reactions } from '../data/chemicals'

export default function ChemistryLab() {
  const [beaker, setBeaker] = useState([])
  const [reactionResult, setReactionResult] = useState(null)
  const [bubbles, setBubbles] = useState([])
  const [solutionColor, setSolutionColor] = useState('transparent')
  const [currentPH, setCurrentPH] = useState(7)
  const [temperature, setTemperature] = useState(25)
  const [isReacting, setIsReacting] = useState(false)
  const [showIndicator, setShowIndicator] = useState(false)

  const addChemical = (chemical) => {
    if (beaker.length >= 2) return
    if (beaker.find((c) => c.id === chemical.id)) return
    setBeaker((prev) => [...prev, chemical])
    setReactionResult(null)
  }

  const checkReaction = useCallback(() => {
    if (beaker.length < 2) return

    const ids = beaker.map((c) => c.id).sort()
    const reaction = reactions.find((r) => {
      const rIds = r.reactants.sort()
      return rIds[0] === ids[0] && rIds[1] === ids[1]
    })

    setIsReacting(true)

    setTimeout(() => {
      if (reaction) {
        setReactionResult(reaction)
        if (reaction.bubbles) {
          const newBubbles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: 30 + Math.random() * 40,
            size: 4 + Math.random() * 8,
            delay: Math.random() * 2,
          }))
          setBubbles(newBubbles)
        }
        setSolutionColor(reaction.color)

        const ph1 = beaker[0].pH
        const ph2 = beaker[1].pH
        setCurrentPH(Math.round(((ph1 + ph2) / 2) * 10) / 10)

        if (reaction.heat) {
          setTemperature((prev) => Math.min(prev + 15 + Math.random() * 10, 95))
        }
      } else {
        setReactionResult({
          name: 'No Reaction',
          description: 'These chemicals do not react with each other',
          observation: 'No visible change observed',
          bubbles: false,
          precipitate: false,
          heat: false,
        })
        const mixColor = beaker[0].color
        setSolutionColor(mixColor)
        setCurrentPH(Math.round(((beaker[0].pH + beaker[1].pH) / 2) * 10) / 10)
      }
      setIsReacting(false)
    }, 1500)
  }, [beaker])

  const resetBeaker = () => {
    setBeaker([])
    setReactionResult(null)
    setBubbles([])
    setSolutionColor('transparent')
    setCurrentPH(7)
    setTemperature(25)
    setShowIndicator(false)
  }

  const getPHColor = (ph) => {
    if (ph < 3) return '#ef4444'
    if (ph < 6) return '#f59e0b'
    if (ph <= 8) return '#22c55e'
    if (ph <= 11) return '#3b82f6'
    return '#8b5cf6'
  }

  return (
    <div>
      <div className="page-header">
        <h1>Chemistry Lab</h1>
        <p>Mix chemicals, observe reactions, and explore molecular interactions</p>
      </div>

      <div className="simulation-area">
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
          {/* Chemical shelf */}
          <div>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 500 }}>
              Chemical Shelf
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {chemicals.map((chem) => (
                <button
                  key={chem.id}
                  className="chemical-btn"
                  onClick={() => addChemical(chem)}
                  disabled={beaker.length >= 2 || beaker.find((c) => c.id === chem.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.6rem 0.8rem',
                    background: beaker.find((c) => c.id === chem.id)
                      ? 'rgba(99, 102, 241, 0.15)'
                      : 'var(--bg-primary)',
                    border: `1px solid ${beaker.find((c) => c.id === chem.id) ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    opacity: beaker.length >= 2 && !beaker.find((c) => c.id === chem.id) ? 0.4 : 1,
                    transition: 'all 0.2s',
                    cursor: beaker.length >= 2 && !beaker.find((c) => c.id === chem.id) ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: chem.color,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{chem.formula}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chem.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Beaker visualization */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="beaker-container" style={{ position: 'relative', width: 220, height: 280 }}>
              {/* Beaker outline */}
              <svg width="220" height="280" viewBox="0 0 220 280">
                <path
                  d="M 40 20 L 40 200 Q 40 260 110 260 Q 180 260 180 200 L 180 20"
                  fill="none"
                  stroke="rgba(148,163,184,0.3)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Solution fill */}
                {solutionColor !== 'transparent' && (
                  <path
                    d="M 44 100 L 44 200 Q 44 256 110 256 Q 176 256 176 200 L 176 100 Z"
                    fill={solutionColor}
                    opacity="0.6"
                  >
                    <animate
                      attributeName="d"
                      values="M 44 100 L 44 200 Q 44 256 110 256 Q 176 256 176 200 L 176 100 Z;
                              M 44 105 L 44 200 Q 44 256 110 256 Q 176 256 176 200 L 176 95 Z;
                              M 44 100 L 44 200 Q 44 256 110 256 Q 176 256 176 200 L 176 100 Z"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                )}
                {/* Bubbles */}
                {bubbles.map((b) => (
                  <circle
                    key={b.id}
                    cx={b.x + 30}
                    r={b.size}
                    fill="rgba(255,255,255,0.4)"
                  >
                    <animate
                      attributeName="cy"
                      from="240"
                      to="80"
                      dur={`${1.5 + b.delay}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur={`${1.5 + b.delay}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}
                {/* Measurement lines */}
                {[100, 140, 180, 220].map((y, i) => (
                  <g key={y}>
                    <line x1="42" y1={y} x2="55" y2={y} stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
                    <text x="58" y={y + 4} fill="rgba(148,163,184,0.4)" fontSize="10">
                      {(4 - i) * 100}ml
                    </text>
                  </g>
                ))}
              </svg>

              {/* Chemicals in beaker */}
              <div
                style={{
                  position: 'absolute',
                  top: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '0.5rem',
                }}
              >
                <AnimatePresence>
                  {beaker.map((chem) => (
                    <motion.div
                      key={chem.id}
                      initial={{ scale: 0, y: -20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      style={{
                        background: chem.color,
                        padding: '0.3rem 0.6rem',
                        borderRadius: 8,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#000',
                      }}
                    >
                      {chem.formula}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Reacting animation */}
              {isReacting && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.2, 1], opacity: [0, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,158,11,0.4), transparent)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>

            {/* Controls */}
            <div className="controls" style={{ justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={checkReaction}
                disabled={beaker.length < 2 || isReacting}
                style={{ opacity: beaker.length < 2 ? 0.5 : 1 }}
              >
                <FlaskConical size={16} />
                {isReacting ? 'Reacting...' : 'Mix Chemicals'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowIndicator(!showIndicator)}
              >
                <Droplets size={16} />
                pH Indicator
              </button>
              <button className="btn btn-danger" onClick={resetBeaker}>
                <RotateCcw size={16} />
                Reset
              </button>
            </div>

            {/* Meters */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>pH Level</div>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    border: `3px solid ${getPHColor(currentPH)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: getPHColor(currentPH),
                    background: `${getPHColor(currentPH)}15`,
                  }}
                >
                  {currentPH}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Temperature</div>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    border: `3px solid ${temperature > 50 ? '#ef4444' : temperature > 35 ? '#f59e0b' : '#3b82f6'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: temperature > 50 ? '#ef4444' : temperature > 35 ? '#f59e0b' : '#3b82f6',
                    background: `${temperature > 50 ? '#ef4444' : temperature > 35 ? '#f59e0b' : '#3b82f6'}15`,
                  }}
                >
                  {temperature}°
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* pH Scale */}
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ marginTop: '1.5rem' }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>pH Scale</div>
            <div style={{ display: 'flex', height: 30, borderRadius: 8, overflow: 'hidden' }}>
              {Array.from({ length: 14 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: getPHColor(i + 1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: i < 4 || i > 10 ? '#fff' : '#000',
                    opacity: Math.abs(currentPH - (i + 1)) < 1.5 ? 1 : 0.4,
                    transition: 'opacity 0.3s',
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              <span>Acidic</span>
              <span>Neutral</span>
              <span>Basic</span>
            </div>
          </motion.div>
        )}

        {/* Reaction result */}
        <AnimatePresence>
          {reactionResult && (
            <motion.div
              className="result-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h3>
                <Sparkles size={18} style={{ color: 'var(--chemistry)' }} />
                {reactionResult.name}
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                {reactionResult.description}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {reactionResult.bubbles && (
                  <span className="badge badge-chemistry">
                    <Droplets size={12} /> Gas Produced
                  </span>
                )}
                {reactionResult.heat && (
                  <span className="badge" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                    <Flame size={12} /> Exothermic
                  </span>
                )}
                {reactionResult.precipitate && (
                  <span className="badge badge-physics">
                    Precipitate Formed
                  </span>
                )}
              </div>
              <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <strong>Observation:</strong> {reactionResult.observation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
