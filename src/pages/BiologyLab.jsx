import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Dna, Microscope, RotateCcw, ZoomIn, Info } from 'lucide-react'
import { cellTypes, microscopeSlides } from '../data/biology'

export default function BiologyLab() {
  const [activeTab, setActiveTab] = useState('cell')

  return (
    <div>
      <div className="page-header">
        <h1>Biology Lab</h1>
        <p>Explore cells, DNA, and life under the microscope</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', padding: '0 2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { id: 'cell', label: 'Cell Explorer', icon: <Eye size={16} /> },
          { id: 'dna', label: 'DNA Builder', icon: <Dna size={16} /> },
          { id: 'microscope', label: 'Microscope', icon: <Microscope size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1rem', borderRadius: 10,
              background: activeTab === tab.id ? 'rgba(34,197,94,0.15)' : 'var(--bg-card)',
              border: `1px solid ${activeTab === tab.id ? 'var(--biology)' : 'var(--border)'}`,
              color: activeTab === tab.id ? 'var(--biology)' : 'var(--text-secondary)',
              fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="simulation-area">
        {activeTab === 'cell' && <CellExplorer />}
        {activeTab === 'dna' && <DNABuilder />}
        {activeTab === 'microscope' && <VirtualMicroscope />}
      </div>
    </div>
  )
}

function CellExplorer() {
  const [cellType, setCellType] = useState('animal')
  const [selectedOrganelle, setSelectedOrganelle] = useState(null)
  const [hoveredOrganelle, setHoveredOrganelle] = useState(null)
  const canvasRef = useRef(null)
  const cell = cellTypes.find((c) => c.id === cellType)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, 600, 400)

    const cx = 300
    const cy = 200

    // Cell membrane/wall
    if (cellType === 'plant') {
      // Cell wall
      ctx.strokeStyle = '#a3e635'
      ctx.lineWidth = 6
      ctx.beginPath()
      roundRect(ctx, cx - 160, cy - 120, 320, 240, 20)
      ctx.stroke()
    }

    // Cell membrane
    ctx.strokeStyle = cellType === 'plant' ? '#22c55e' : '#94a3b8'
    ctx.lineWidth = 3
    ctx.beginPath()
    roundRect(ctx, cx - 145, cy - 105, 290, 210, cellType === 'plant' ? 8 : 100)
    ctx.stroke()

    // Fill cell
    ctx.fillStyle = cellType === 'plant' ? 'rgba(34,197,94,0.05)' : 'rgba(148,163,184,0.05)'
    ctx.beginPath()
    roundRect(ctx, cx - 145, cy - 105, 290, 210, cellType === 'plant' ? 8 : 100)
    ctx.fill()

    // Draw organelles
    const positions = [
      { x: cx - 40, y: cy - 10 },
      { x: cx + 80, y: cy - 30 },
      { x: cx - 100, y: cy + 40 },
      { x: cx + 50, y: cy + 50 },
      { x: cx - 60, y: cy - 60 },
      { x: cx + 100, y: cy + 10 },
      { x: cx - 20, y: cy + 60 },
    ]

    cell.organelles.forEach((org, i) => {
      if (org.id === 'membrane' || org.id === 'cellwall') return
      const pos = positions[i % positions.length]
      const isHovered = hoveredOrganelle === org.id
      const isSelected = selectedOrganelle === org.id
      const size = org.size * (isHovered || isSelected ? 1.2 : 1)

      ctx.beginPath()
      if (org.id === 'nucleus') {
        ctx.ellipse(pos.x, pos.y, size, size * 0.85, 0, 0, Math.PI * 2)
      } else if (org.id === 'er') {
        ctx.ellipse(pos.x, pos.y, size * 1.2, size * 0.5, 0.3, 0, Math.PI * 2)
      } else if (org.id === 'vacuole') {
        ctx.ellipse(pos.x, pos.y, size * 1.5, size, 0, 0, Math.PI * 2)
      } else {
        ctx.arc(pos.x, pos.y, size / 2, 0, Math.PI * 2)
      }
      ctx.fillStyle = org.color + (isHovered || isSelected ? 'cc' : '66')
      ctx.fill()
      ctx.strokeStyle = org.color
      ctx.lineWidth = isSelected ? 3 : 1.5
      ctx.stroke()

      // Label
      if (isHovered || isSelected) {
        ctx.font = '11px Inter'
        ctx.fillStyle = '#e2e8f0'
        ctx.textAlign = 'center'
        ctx.fillText(org.name, pos.x, pos.y - size / 2 - 8)
      }
    })
  }, [cellType, selectedOrganelle, hoveredOrganelle, cell])

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{ width: '100%', maxWidth: 600, background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border)', cursor: 'crosshair' }}
            onMouseMove={(ev) => {
              const rect = ev.target.getBoundingClientRect()
              const scaleX = 600 / rect.width
              const x = (ev.clientX - rect.left) * scaleX
              const y = (ev.clientY - rect.top) * scaleX
              const cx = 300, cy = 200
              let found = null
              cell.organelles.forEach((org, i) => {
                if (org.id === 'membrane' || org.id === 'cellwall') return
                const positions = [
                  { x: cx - 40, y: cy - 10 }, { x: cx + 80, y: cy - 30 },
                  { x: cx - 100, y: cy + 40 }, { x: cx + 50, y: cy + 50 },
                  { x: cx - 60, y: cy - 60 }, { x: cx + 100, y: cy + 10 },
                  { x: cx - 20, y: cy + 60 },
                ]
                const pos = positions[i % positions.length]
                const dist = Math.hypot(x - pos.x, y - pos.y)
                if (dist < org.size) found = org.id
              })
              setHoveredOrganelle(found)
            }}
            onClick={() => {
              if (hoveredOrganelle) setSelectedOrganelle(hoveredOrganelle)
            }}
          />
        </div>
        <div style={{ width: 240 }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {cellTypes.map((ct) => (
              <button
                key={ct.id}
                onClick={() => { setCellType(ct.id); setSelectedOrganelle(null); }}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: 8,
                  background: cellType === ct.id ? 'rgba(34,197,94,0.15)' : 'var(--bg-primary)',
                  border: `1px solid ${cellType === ct.id ? 'var(--biology)' : 'var(--border)'}`,
                  color: cellType === ct.id ? 'var(--biology)' : 'var(--text-secondary)',
                  fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.2s',
                }}
              >
                {ct.name}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Click organelles to learn more
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 280, overflowY: 'auto' }}>
            {cell.organelles.map((org) => (
              <button
                key={org.id}
                onClick={() => setSelectedOrganelle(org.id === selectedOrganelle ? null : org.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.5rem 0.6rem', borderRadius: 8,
                  background: selectedOrganelle === org.id ? `${org.color}20` : 'transparent',
                  border: `1px solid ${selectedOrganelle === org.id ? org.color : 'transparent'}`,
                  color: 'var(--text-primary)', fontSize: '0.8rem', textAlign: 'left',
                  transition: 'all 0.2s', width: '100%',
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: 3, background: org.color, flexShrink: 0 }} />
                <span style={{ fontWeight: 500 }}>{org.name}</span>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {selectedOrganelle && (() => {
              const org = cell.organelles.find((o) => o.id === selectedOrganelle)
              if (!org) return null
              return (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: '1rem', padding: '0.75rem', borderRadius: 8,
                    background: `${org.color}10`, border: `1px solid ${org.color}40`,
                  }}
                >
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: org.color, marginBottom: '0.3rem' }}>{org.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{org.description}</div>
                </motion.div>
              )
            })()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function DNABuilder() {
  const [sequence, setSequence] = useState(['A', 'T', 'G', 'C', 'A', 'G', 'T', 'A'])
  const [animating, setAnimating] = useState(false)

  const baseColors = { A: '#ef4444', T: '#3b82f6', G: '#22c55e', C: '#f59e0b' }
  const pairMap = { A: 'T', T: 'A', G: 'C', C: 'G' }

  const addBase = (base) => {
    if (sequence.length >= 16) return
    setAnimating(true)
    setTimeout(() => {
      setSequence((prev) => [...prev, base])
      setAnimating(false)
    }, 300)
  }

  const removeBase = () => {
    setSequence((prev) => prev.slice(0, -1))
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <svg width="600" height="350" viewBox="0 0 600 350" style={{ width: '100%', maxWidth: 600, background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border)' }}>
            {/* Title */}
            <text x="300" y="25" fill="var(--text-secondary)" textAnchor="middle" fontSize="12" fontWeight="500">DNA Double Helix</text>

            {/* Draw DNA strand */}
            {sequence.map((base, i) => {
              const x = 40 + i * 35
              const y1 = 80 + Math.sin(i * 0.8) * 30
              const y2 = 270 + Math.sin(i * 0.8 + Math.PI) * 30
              const pair = pairMap[base]
              const isLast = i === sequence.length - 1

              return (
                <g key={i} opacity={animating && isLast ? 0.5 : 1}>
                  {/* Connecting rung */}
                  <line x1={x} y1={y1} x2={x} y2={y2} stroke="rgba(148,163,184,0.2)" strokeWidth="2" />

                  {/* Base pair glow */}
                  {isLast && (
                    <line x1={x} y1={y1} x2={x} y2={y2} stroke={baseColors[base]} strokeWidth="4" opacity="0.3">
                      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1s" repeatCount="indefinite" />
                    </line>
                  )}

                  {/* Top base */}
                  <circle cx={x} cy={y1} r={12} fill={baseColors[base]} opacity={0.8}>
                    {isLast && <animate attributeName="r" values="12;14;12" dur="1.5s" repeatCount="indefinite" />}
                  </circle>
                  <text x={x} y={y1 + 4} fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">{base}</text>

                  {/* Bottom base (complement) */}
                  <circle cx={x} cy={y2} r={12} fill={baseColors[pair]} opacity={0.8} />
                  <text x={x} y={y2 + 4} fill="white" textAnchor="middle" fontSize="10" fontWeight="bold">{pair}</text>

                  {/* Backbone connections */}
                  {i > 0 && (
                    <>
                      <line
                        x1={x - 35} y1={80 + Math.sin((i - 1) * 0.8) * 30}
                        x2={x} y2={y1}
                        stroke="rgba(99,102,241,0.5)" strokeWidth="3"
                      />
                      <line
                        x1={x - 35} y1={270 + Math.sin((i - 1) * 0.8 + Math.PI) * 30}
                        x2={x} y2={y2}
                        stroke="rgba(99,102,241,0.5)" strokeWidth="3"
                      />
                    </>
                  )}
                </g>
              )
            })}

            {/* Legend */}
            <g transform="translate(20, 320)">
              {Object.entries(baseColors).map(([base, color], i) => (
                <g key={base} transform={`translate(${i * 70}, 0)`}>
                  <circle cx={8} cy={8} r={6} fill={color} />
                  <text x={20} y={12} fill="var(--text-secondary)" fontSize="10">
                    {base === 'A' ? 'Adenine' : base === 'T' ? 'Thymine' : base === 'G' ? 'Guanine' : 'Cytosine'}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        <div style={{ width: 220 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--biology)' }}>
            Add DNA Bases
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
            {Object.entries(baseColors).map(([base, color]) => (
              <button
                key={base}
                onClick={() => addBase(base)}
                disabled={sequence.length >= 16}
                style={{
                  padding: '0.8rem', borderRadius: 10,
                  background: `${color}20`, border: `2px solid ${color}60`,
                  color: color, fontSize: '1.2rem', fontWeight: 700,
                  opacity: sequence.length >= 16 ? 0.4 : 1,
                  transition: 'all 0.2s',
                }}
              >
                {base}
                <div style={{ fontSize: '0.6rem', fontWeight: 400, marginTop: '0.2rem' }}>
                  {base === 'A' ? 'Adenine' : base === 'T' ? 'Thymine' : base === 'G' ? 'Guanine' : 'Cytosine'}
                </div>
              </button>
            ))}
          </div>

          <button className="btn btn-secondary" onClick={removeBase} disabled={sequence.length === 0} style={{ width: '100%', marginBottom: '0.75rem' }}>
            <RotateCcw size={14} /> Remove Last
          </button>

          <div className="result-panel" style={{ marginTop: '0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Sequence Length</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--biology)' }}>{sequence.length} base pairs</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Sequence: {sequence.join(' → ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VirtualMicroscope() {
  const [slide, setSlide] = useState(microscopeSlides[0])
  const [magnification, setMagnification] = useState(100)
  const [focus, setFocus] = useState(50)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = 400
    const h = 400

    ctx.clearRect(0, 0, w, h)

    // Microscope circle
    ctx.save()
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, 180, 0, Math.PI * 2)
    ctx.clip()

    // Background - slightly out of focus based on focus slider
    const blur = Math.abs(50 - focus) / 50

    if (slide.id === 'onion') {
      // Plant cells - rectangular
      const cols = Math.floor(magnification / 30)
      const rows = Math.floor(magnification / 40)
      const cellW = 360 / cols
      const cellH = 360 / rows
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = 20 + c * cellW
          const y = 20 + r * cellH
          ctx.strokeStyle = `rgba(34,197,94,${0.6 - blur * 0.4})`
          ctx.lineWidth = 1.5
          ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4)
          // Nucleus
          ctx.beginPath()
          ctx.arc(x + cellW / 2, y + cellH / 2, 5 - blur * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(139,92,246,${0.7 - blur * 0.5})`
          ctx.fill()
        }
      }
    } else if (slide.id === 'blood') {
      // Red blood cells
      const count = Math.floor(magnification / 8)
      for (let i = 0; i < count; i++) {
        const x = 30 + Math.random() * 340
        const y = 30 + Math.random() * 340
        const r = 6 + Math.random() * 4 - blur * 3
        ctx.beginPath()
        ctx.arc(x, y, Math.max(r, 2), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(239,68,68,${0.6 - blur * 0.4})`
        ctx.fill()
        ctx.strokeStyle = `rgba(239,68,68,${0.8 - blur * 0.5})`
        ctx.lineWidth = 1
        ctx.stroke()
        // White blood cells (fewer)
        if (i % 15 === 0) {
          ctx.beginPath()
          ctx.arc(x + 10, y - 5, 8 - blur * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(148,163,184,${0.5 - blur * 0.3})`
          ctx.fill()
        }
      }
    } else if (slide.id === 'leaf') {
      // Leaf cross-section
      const layers = ['rgba(34,197,94,0.3)', 'rgba(34,197,94,0.5)', 'rgba(34,197,94,0.4)', 'rgba(22,101,52,0.4)']
      layers.forEach((color, i) => {
        ctx.fillStyle = color
        ctx.fillRect(20, 40 + i * 80 - blur * 10, 360, 70)
        // Cells in each layer
        for (let j = 0; j < 8; j++) {
          ctx.beginPath()
          ctx.arc(50 + j * 45, 75 + i * 80 - blur * 10, 10 - blur * 3, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(34,197,94,${0.7 - blur * 0.5})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })
    } else {
      // Bacteria
      const count = Math.floor(magnification / 5)
      for (let i = 0; i < count; i++) {
        const x = 30 + Math.random() * 340
        const y = 30 + Math.random() * 340
        const angle = Math.random() * Math.PI * 2
        const len = 8 + Math.random() * 12 - blur * 5
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        ctx.fillStyle = `rgba(245,158,11,${0.6 - blur * 0.4})`
        ctx.beginPath()
        ctx.ellipse(0, 0, Math.max(len, 3), 3 - blur, 0, 0, Math.PI * 2)
        ctx.fill()
        // Flagella
        ctx.beginPath()
        ctx.moveTo(len, 0)
        ctx.quadraticCurveTo(len + 8, -5, len + 15, 2)
        ctx.strokeStyle = `rgba(245,158,11,${0.4 - blur * 0.3})`
        ctx.lineWidth = 0.8
        ctx.stroke()
        ctx.restore()
      }
    }

    ctx.restore()

    // Microscope vignette
    const grad = ctx.createRadialGradient(w / 2, h / 2, 120, w / 2, h / 2, 200)
    grad.addColorStop(0, 'transparent')
    grad.addColorStop(1, 'rgba(0,0,0,0.8)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // Crosshair
    ctx.strokeStyle = 'rgba(148,163,184,0.3)'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(w / 2, h / 2 - 20)
    ctx.lineTo(w / 2, h / 2 + 20)
    ctx.moveTo(w / 2 - 20, h / 2)
    ctx.lineTo(w / 2 + 20, h / 2)
    ctx.stroke()
    ctx.setLineDash([])
  }, [slide, magnification, focus])

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              style={{
                width: 400, height: 400,
                borderRadius: '50%',
                border: '3px solid var(--border)',
                background: '#0a0a14',
              }}
            />
            <div style={{
              position: 'absolute', top: -8, left: -8, right: -8, bottom: -8,
              borderRadius: '50%',
              border: '6px solid #1e293b',
              pointerEvents: 'none',
            }} />
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            {slide.name} — {slide.magnification}
          </div>
        </div>

        <div style={{ width: 240 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--biology)' }}>Slide Selection</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
            {microscopeSlides.map((s) => (
              <button
                key={s.id}
                onClick={() => setSlide(s)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.6rem 0.8rem', borderRadius: 8,
                  background: slide.id === s.id ? 'rgba(34,197,94,0.15)' : 'var(--bg-primary)',
                  border: `1px solid ${slide.id === s.id ? 'var(--biology)' : 'var(--border)'}`,
                  color: slide.id === s.id ? 'var(--biology)' : 'var(--text-primary)',
                  fontSize: '0.85rem', fontWeight: 500, textAlign: 'left', width: '100%',
                  transition: 'all 0.2s',
                }}
              >
                <span>{s.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.magnification}</span>
              </button>
            ))}
          </div>

          <div className="control-group" style={{ marginBottom: '1rem' }}>
            <label><ZoomIn size={14} style={{ verticalAlign: 'middle' }} /> Magnification: {magnification}x</label>
            <input
              type="range"
              min="50"
              max="400"
              step="50"
              value={magnification}
              onChange={(e) => setMagnification(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--biology)' }}
            />
          </div>

          <div className="control-group" style={{ marginBottom: '1rem' }}>
            <label><Eye size={14} style={{ verticalAlign: 'middle' }} /> Focus: {focus}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={focus}
              onChange={(e) => setFocus(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--biology)' }}
            />
          </div>

          <div className="result-panel">
            <h3><Info size={16} style={{ color: 'var(--biology)' }} /> About</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {slide.id === 'onion' && 'Onion epidermis cells show clear cell walls, nuclei, and rectangular shapes typical of plant cells.'}
              {slide.id === 'blood' && 'Blood smear shows biconcave red blood cells (erythrocytes) and occasional white blood cells.'}
              {slide.id === 'leaf' && 'Leaf cross-section reveals palisade mesophyll, spongy mesophyll, and vascular bundles.'}
              {slide.id === 'bacteria' && 'E. coli are rod-shaped bacteria with flagella for movement. They are prokaryotes without a nucleus.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}
