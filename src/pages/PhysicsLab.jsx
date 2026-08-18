import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, Zap, Atom } from 'lucide-react'

const simulations = [
  {
    id: 'projectile',
    name: 'Projectile Motion',
    icon: '🎯',
    description: 'Launch objects at different angles and observe parabolic trajectories',
  },
  {
    id: 'pendulum',
    name: 'Simple Pendulum',
    icon: '🔔',
    description: 'Explore how length and gravity affect pendulum period',
  },
  {
    id: 'circuit',
    name: 'Electric Circuit',
    icon: '⚡',
    description: 'Build circuits with resistors and measure voltage/current',
  },
  {
    id: 'wave',
    name: 'Wave Interference',
    icon: '🌊',
    description: 'Visualize constructive and destructive wave patterns',
  },
]

export default function PhysicsLab() {
  const [activeSim, setActiveSim] = useState('projectile')
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div>
      <div className="page-header">
        <h1>Physics Lab</h1>
        <p>Explore mechanics, electricity, and waves through interactive simulations</p>
      </div>

      {/* Sim selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', padding: '0 2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {simulations.map((sim) => (
          <button
            key={sim.id}
            onClick={() => { setActiveSim(sim.id); setIsRunning(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              background: activeSim === sim.id ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
              border: `1px solid ${activeSim === sim.id ? 'var(--physics)' : 'var(--border)'}`,
              borderRadius: 10,
              color: activeSim === sim.id ? 'var(--physics)' : 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            <span>{sim.icon}</span>
            {sim.name}
          </button>
        ))}
      </div>

      <div className="simulation-area">
        {activeSim === 'projectile' && <ProjectileSim isRunning={isRunning} setIsRunning={setIsRunning} />}
        {activeSim === 'pendulum' && <PendulumSim isRunning={isRunning} setIsRunning={setIsRunning} />}
        {activeSim === 'circuit' && <CircuitSim />}
        {activeSim === 'wave' && <WaveSim isRunning={isRunning} setIsRunning={setIsRunning} />}
      </div>
    </div>
  )
}

function ProjectileSim({ isRunning, setIsRunning }) {
  const canvasRef = useRef(null)
  const [angle, setAngle] = useState(45)
  const [velocity, setVelocity] = useState(50)
  const [trail, setTrail] = useState([])
  const animRef = useRef(null)
  const projRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 })

  const launch = useCallback(() => {
    const rad = (angle * Math.PI) / 180
    projRef.current = {
      x: 50,
      y: 350,
      vx: velocity * Math.cos(rad),
      vy: -velocity * Math.sin(rad),
    }
    setTrail([])
    setIsRunning(true)
  }, [angle, velocity, setIsRunning])

  useEffect(() => {
    if (!isRunning) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const g = 0.5

    const animate = () => {
      const p = projRef.current
      p.vy += g
      p.x += p.vx
      p.y += p.vy

      if (p.y >= 350) {
        setIsRunning(false)
        return
      }

      setTrail((prev) => [...prev.slice(-200), { x: p.x, y: p.y }])

      ctx.clearRect(0, 0, 600, 400)

      // Ground
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 360, 600, 40)
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      for (let i = 0; i < 600; i += 50) {
        ctx.beginPath()
        ctx.moveTo(i, 360)
        ctx.lineTo(i, 400)
        ctx.stroke()
      }

      // Grid
      ctx.strokeStyle = 'rgba(100,116,139,0.1)'
      for (let y = 0; y < 360; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(600, y)
        ctx.stroke()
      }

      // Trail
      if (trail.length > 1) {
        ctx.beginPath()
        ctx.moveTo(trail[0].x, trail[0].y)
        trail.forEach((pt) => ctx.lineTo(pt.x, pt.y))
        ctx.strokeStyle = 'rgba(59,130,246,0.4)'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Projectile
      ctx.beginPath()
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = '#3b82f6'
      ctx.fill()
      ctx.strokeStyle = '#60a5fa'
      ctx.lineWidth = 2
      ctx.stroke()

      // Glow
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20)
      grad.addColorStop(0, 'rgba(59,130,246,0.3)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(p.x - 20, p.y - 20, 40, 40)

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isRunning, trail, setIsRunning])

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{ width: '100%', maxWidth: 600, background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border)' }}
          />
        </div>
        <div style={{ width: 220 }}>
          <div className="control-group" style={{ marginBottom: '1rem' }}>
            <label>Angle: {angle}°</label>
            <input
              type="range"
              min="5"
              max="85"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--physics)' }}
            />
          </div>
          <div className="control-group" style={{ marginBottom: '1rem' }}>
            <label>Velocity: {velocity} m/s</label>
            <input
              type="range"
              min="10"
              max="100"
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--physics)' }}
            />
          </div>
          <button className="btn btn-primary" onClick={launch} disabled={isRunning} style={{ width: '100%' }}>
            <Play size={16} /> Launch
          </button>
        </div>
      </div>

      <div className="result-panel" style={{ marginTop: '1.5rem' }}>
        <h3><Zap size={18} style={{ color: 'var(--physics)' }} /> Physics Info</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Projectile motion follows a parabolic path due to gravity. The horizontal velocity remains constant
          while the vertical velocity changes at 9.8 m/s². Maximum range occurs at 45° with equal initial
          horizontal and vertical velocities.
        </p>
      </div>
    </div>
  )
}

function PendulumSim({ isRunning, setIsRunning }) {
  const canvasRef = useRef(null)
  const [length, setLength] = useState(150)
  const [gravity, setGravity] = useState(9.8)
  const animRef = useRef(null)
  const pendRef = useRef({ angle: Math.PI / 4, angVel: 0 })

  useEffect(() => {
    if (!isRunning) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const animate = () => {
      const p = pendRef.current
      const angAcc = (-gravity / length) * Math.sin(p.angle)
      p.angVel += angAcc
      p.angVel *= 0.999
      p.angle += p.angVel

      const pivotX = 300
      const pivotY = 50
      const bobX = pivotX + length * Math.sin(p.angle)
      const bobY = pivotY + length * Math.cos(p.angle)

      ctx.clearRect(0, 0, 600, 400)

      // Pivot support
      ctx.fillStyle = '#475569'
      ctx.fillRect(250, 30, 100, 20)

      // String
      ctx.beginPath()
      ctx.moveTo(pivotX, pivotY)
      ctx.lineTo(bobX, bobY)
      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 2
      ctx.stroke()

      // Bob
      ctx.beginPath()
      ctx.arc(bobX, bobY, 18, 0, Math.PI * 2)
      const grad = ctx.createRadialGradient(bobX - 4, bobY - 4, 0, bobX, bobY, 18)
      grad.addColorStop(0, '#60a5fa')
      grad.addColorStop(1, '#2563eb')
      ctx.fillStyle = grad
      ctx.fill()

      // Glow
      const glow = ctx.createRadialGradient(bobX, bobY, 0, bobX, bobY, 30)
      glow.addColorStop(0, 'rgba(59,130,246,0.2)')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(bobX - 30, bobY - 30, 60, 60)

      // Trail
      ctx.beginPath()
      ctx.arc(bobX, bobY + 80, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(59,130,246,0.3)'
      ctx.fill()

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isRunning, length, gravity])

  const period = (2 * Math.PI * Math.sqrt(length / gravity / 50)).toFixed(2)

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{ width: '100%', maxWidth: 600, background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border)' }}
          />
        </div>
        <div style={{ width: 220 }}>
          <div className="control-group" style={{ marginBottom: '1rem' }}>
            <label>Length: {length}px</label>
            <input
              type="range"
              min="50"
              max="300"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--physics)' }}
            />
          </div>
          <div className="control-group" style={{ marginBottom: '1rem' }}>
            <label>Gravity: {gravity} m/s²</label>
            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={gravity}
              onChange={(e) => setGravity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--physics)' }}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { pendRef.current = { angle: Math.PI / 4, angVel: 0 }; setIsRunning(true); }}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            <Play size={16} /> Start
          </button>
          <button className="btn btn-secondary" onClick={() => setIsRunning(false)} style={{ width: '100%' }}>
            <Pause size={16} /> Stop
          </button>
        </div>
      </div>

      <div className="result-panel" style={{ marginTop: '1.5rem' }}>
        <h3><Atom size={18} style={{ color: 'var(--physics)' }} /> Pendulum Data</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Period</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--physics)' }}>{period}s</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Length</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{(length / 50).toFixed(1)}m</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gravity</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{gravity} m/s²</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CircuitSim() {
  const [resistance, setResistance] = useState(100)
  const [voltage, setVoltage] = useState(9)
  const [ledOn, setLedOn] = useState(true)
  const current = (voltage / resistance * 1000).toFixed(1)

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <svg width="600" height="400" viewBox="0 0 600 400" style={{ width: '100%', maxWidth: 600, background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border)' }}>
            {/* Battery */}
            <rect x="50" y="150" width="60" height="100" fill="none" stroke="#f59e0b" strokeWidth="3" rx="4" />
            <rect x="60" y="140" width="40" height="10" fill="#f59e0b" rx="2" />
            <text x="80" y="205" fill="#f59e0b" textAnchor="middle" fontSize="14" fontWeight="bold">{voltage}V</text>
            <text x="80" y="220" fill="#94a3b8" textAnchor="middle" fontSize="10">Battery</text>

            {/* Wires */}
            <path d="M 110 170 L 200 170" stroke="#60a5fa" strokeWidth="3" fill="none" />
            <path d="M 200 170 L 200 100 L 400 100 L 400 170" stroke="#60a5fa" strokeWidth="3" fill="none" />
            <path d="M 400 230 L 400 300 L 200 300 L 200 230" stroke="#60a5fa" strokeWidth="3" fill="none" />
            <path d="M 200 230 L 110 230" stroke="#60a5fa" strokeWidth="3" fill="none" />

            {/* Current arrows */}
            {ledOn && [160, 300, 440].map((x, i) => (
              <g key={i}>
                <polygon points={`${x},165 ${x + 8},170 ${x},175`} fill="#facc15">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                </polygon>
              </g>
            ))}

            {/* Resistor */}
            <path d="M 230 100 L 240 85 L 260 115 L 280 85 L 300 115 L 320 85 L 340 115 L 350 100" stroke="#a78bfa" strokeWidth="3" fill="none" />
            <text x="290" y="80" fill="#a78bfa" textAnchor="middle" fontSize="12">{resistance}Ω</text>

            {/* LED */}
            <polygon points="385,170 415,170 400,200" fill={ledOn ? '#ef4444' : '#475569'} opacity={ledOn ? 1 : 0.3}>
              {ledOn && <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />}
            </polygon>
            <line x1="385" y1="200" x2="415" y2="200" stroke={ledOn ? '#ef4444' : '#475569'} strokeWidth="2" opacity={ledOn ? 1 : 0.3} />
            {ledOn && (
              <circle cx="400" cy="185" r="25" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="1">
                <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <text x="400" y="220" fill="#94a3b8" textAnchor="middle" fontSize="10">LED</text>

            {/* Ammeter */}
            <circle cx="500" cy="250" r="25" fill="var(--bg-card)" stroke="#22c55e" strokeWidth="2" />
            <text x="500" y="254" fill="#22c55e" textAnchor="middle" fontSize="11" fontWeight="bold">{current}mA</text>
            <text x="500" y="290" fill="#94a3b8" textAnchor="middle" fontSize="10">Ammeter</text>
            <path d="M 400 300 L 475 300 L 475 250" stroke="#22c55e" strokeWidth="2" fill="none" strokeDasharray="5,5" />
          </svg>
        </div>

        <div style={{ width: 220 }}>
          <div className="control-group" style={{ marginBottom: '1rem' }}>
            <label>Voltage: {voltage}V</label>
            <input
              type="range"
              min="1"
              max="24"
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--physics)' }}
            />
          </div>
          <div className="control-group" style={{ marginBottom: '1rem' }}>
            <label>Resistance: {resistance}Ω</label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={resistance}
              onChange={(e) => setResistance(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--physics)' }}
            />
          </div>
          <button
            className={`btn ${ledOn ? 'btn-danger' : 'btn-success'}`}
            onClick={() => setLedOn(!ledOn)}
            style={{ width: '100%' }}
          >
            <Zap size={16} /> {ledOn ? 'Turn Off LED' : 'Turn On LED'}
          </button>
        </div>
      </div>

      <div className="result-panel" style={{ marginTop: '1.5rem' }}>
        <h3><Zap size={18} style={{ color: 'var(--physics)' }} /> Circuit Analysis</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
          {[
            { label: 'Voltage', value: `${voltage}V`, color: '#f59e0b' },
            { label: 'Current', value: `${current}mA`, color: '#22c55e' },
            { label: 'Resistance', value: `${resistance}Ω`, color: '#a78bfa' },
            { label: 'Power', value: `${(voltage * current / 1000).toFixed(2)}W`, color: '#3b82f6' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WaveSim({ isRunning, setIsRunning }) {
  const canvasRef = useRef(null)
  const [freq1, setFreq1] = useState(2)
  const [freq2, setFreq2] = useState(2)
  const [amp1, setAmp1] = useState(30)
  const [amp2, setAmp2] = useState(30)
  const animRef = useRef(null)
  const timeRef = useRef(0)

  useEffect(() => {
    if (!isRunning) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const animate = () => {
      timeRef.current += 0.05
      const t = timeRef.current
      ctx.clearRect(0, 0, 600, 400)

      // Background grid
      ctx.strokeStyle = 'rgba(100,116,139,0.1)'
      ctx.lineWidth = 1
      for (let y = 0; y < 400; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(600, y)
        ctx.stroke()
      }

      // Wave 1
      ctx.beginPath()
      for (let x = 0; x < 600; x++) {
        const y = 100 + amp1 * Math.sin((x * freq1 * 0.02) + t * 3)
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Wave 2
      ctx.beginPath()
      for (let x = 0; x < 600; x++) {
        const y = 200 + amp2 * Math.sin((x * freq2 * 0.02) + t * 3 + Math.PI)
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Combined wave
      ctx.beginPath()
      for (let x = 0; x < 600; x++) {
        const y1 = amp1 * Math.sin((x * freq1 * 0.02) + t * 3)
        const y2 = amp2 * Math.sin((x * freq2 * 0.02) + t * 3 + Math.PI)
        const y = 320 + y1 + y2
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 3
      ctx.stroke()

      // Labels
      ctx.font = '12px Inter'
      ctx.fillStyle = '#3b82f6'
      ctx.fillText('Wave 1', 10, 70)
      ctx.fillStyle = '#ef4444'
      ctx.fillText('Wave 2', 10, 180)
      ctx.fillStyle = '#22c55e'
      ctx.fillText('Combined (Superposition)', 10, 290)

      animRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isRunning, freq1, freq2, amp1, amp2])

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{ width: '100%', maxWidth: 600, background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border)' }}
          />
        </div>
        <div style={{ width: 220 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#3b82f6' }}>Wave 1</div>
          <div className="control-group" style={{ marginBottom: '0.75rem' }}>
            <label>Frequency: {freq1} Hz</label>
            <input type="range" min="0.5" max="5" step="0.5" value={freq1} onChange={(e) => setFreq1(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
          </div>
          <div className="control-group" style={{ marginBottom: '1rem' }}>
            <label>Amplitude: {amp1}</label>
            <input type="range" min="5" max="50" value={amp1} onChange={(e) => setAmp1(Number(e.target.value))} style={{ width: '100%', accentColor: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: '#ef4444' }}>Wave 2</div>
          <div className="control-group" style={{ marginBottom: '0.75rem' }}>
            <label>Frequency: {freq2} Hz</label>
            <input type="range" min="0.5" max="5" step="0.5" value={freq2} onChange={(e) => setFreq2(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
          </div>
          <div className="control-group" style={{ marginBottom: '1rem' }}>
            <label>Amplitude: {amp2}</label>
            <input type="range" min="5" max="50" value={amp2} onChange={(e) => setAmp2(Number(e.target.value))} style={{ width: '100%', accentColor: '#ef4444' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary" onClick={() => setIsRunning(true)} style={{ flex: 1 }}>
              <Play size={14} />
            </button>
            <button className="btn btn-secondary" onClick={() => setIsRunning(false)} style={{ flex: 1 }}>
              <Pause size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
