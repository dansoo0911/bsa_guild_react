import { useState, useEffect } from 'react'
import './ComboIndicator.css'

function ComboIndicator({ comboState }) {
  const [show, setShow] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (comboState && comboState.combo > 0) {
      setShow(true)
      setPulse(true)
      setTimeout(() => setPulse(false), 500)
    } else {
      setTimeout(() => setShow(false), 500)
    }
  }, [comboState])

  if (!show || !comboState || comboState.combo === 0) return null

  return (
    <div className={`combo-indicator ${pulse ? 'pulse' : ''}`}>
      <div className="combo-header">
        <span className="combo-label">КОМБО</span>
        <span className="combo-count">x{comboState.combo}</span>
      </div>
      <div className="combo-multiplier">
        <span className="multiplier-label">Мультипликатор</span>
        <span className="multiplier-value">{comboState.multiplier.toFixed(2)}x</span>
      </div>
      {comboState.timeRemaining > 0 && (
        <div className="combo-timer">
          <div 
            className="combo-timer-bar"
            style={{ width: `${(comboState.timeRemaining / 5000) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default ComboIndicator

