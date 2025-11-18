import { useEffect, useRef } from 'react'
import './ParticleBackground.css'

function ParticleBackground() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles = []
    const particleCount = 30

    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = `${Math.random() * 100}%`
      particle.style.animationDelay = `${Math.random() * 15}s`
      particle.style.animationDuration = `${10 + Math.random() * 10}s`
      container.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
    }
  }, [])

  return <div ref={containerRef} className="particle-bg" />
}

export default ParticleBackground

