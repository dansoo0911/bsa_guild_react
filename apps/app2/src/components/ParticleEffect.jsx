import { useEffect, useState } from 'react'
import './ParticleEffect.css'

function ParticleEffect({ type, active }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (!active) {
      setParticles([])
      return
    }

    const newParticles = []
    const count = type === 'win' ? 30 : type === 'jackpot' ? 50 : 20

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const distance = 50 + Math.random() * 30
      newParticles.push({
        id: i,
        x: 50 + Math.cos(angle) * distance,
        y: 50 + Math.sin(angle) * distance,
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 1,
        size: type === 'jackpot' ? 8 + Math.random() * 4 : 4 + Math.random() * 4,
        angle: angle
      })
    }

    setParticles(newParticles)

    const timer = setTimeout(() => {
      setParticles([])
    }, 2000)

    return () => clearTimeout(timer)
  }, [active, type])

  if (!active || particles.length === 0) return null

  return (
    <div className={`particle-container particle-${type}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            '--angle': `${particle.angle}rad`
          }}
        />
      ))}
    </div>
  )
}

export default ParticleEffect

