import { useState, useEffect } from 'react'
import './AchievementNotification.css'

function AchievementNotification({ achievement, onClose }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (achievement) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(() => onClose && onClose(), 500)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!show || !achievement) return null

  return (
    <div className="achievement-notification">
      <div className="achievement-content">
        <div className="achievement-icon">{achievement.icon}</div>
        <div className="achievement-info">
          <div className="achievement-title">ДОСТИЖЕНИЕ РАЗБЛОКИРОВАНО!</div>
          <div className="achievement-name">{achievement.name}</div>
          <div className="achievement-description">{achievement.description}</div>
          <div className="achievement-rewards">
            {achievement.reward.diamonds > 0 && (
              <span className="reward-item">💎 {achievement.reward.diamonds}</span>
            )}
            {achievement.reward.shields > 0 && (
              <span className="reward-item">🛡️ {achievement.reward.shields}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementNotification

