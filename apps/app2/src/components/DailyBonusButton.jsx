import { useState, useEffect } from 'react'
import './DailyBonusButton.css'

function DailyBonusButton({ canClaim, consecutiveDays, onClick }) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (canClaim) {
      const interval = setInterval(() => {
        setPulse(prev => !prev)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [canClaim])

  if (!canClaim) return null

  return (
    <button 
      className={`daily-bonus-button ${pulse ? 'pulse' : ''}`}
      onClick={onClick}
    >
      <span className="bonus-icon">🎁</span>
      <span className="bonus-text">Ежедневный бонус</span>
      {consecutiveDays > 0 && (
        <span className="bonus-streak">День {consecutiveDays}</span>
      )}
    </button>
  )
}

export default DailyBonusButton

