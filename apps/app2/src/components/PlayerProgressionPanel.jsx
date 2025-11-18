import { useState, useEffect } from 'react'
import './PlayerProgressionPanel.css'
import currencyRuby from '../assets/images/currency_ruby.png'

function PlayerProgressionPanel({ progression, onLevelUp }) {
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpData, setLevelUpData] = useState(null)

  useEffect(() => {
    if (onLevelUp && onLevelUp.leveledUp) {
      setLevelUpData(onLevelUp)
      setShowLevelUp(true)
      setTimeout(() => setShowLevelUp(false), 3000)
    }
  }, [onLevelUp])

  if (!progression) return null

  const levelProgress = (progression.experience / progression.experienceToNextLevel) * 100

  return (
    <>
      <div className="progression-panel">
        <div className="progression-item">
          <div className="progression-header">
            <span className="progression-label">Уровень</span>
            <span className="progression-value">LVL {progression.level}</span>
          </div>
          <div className="progression-bar">
            <div 
              className="progression-fill level-fill"
              style={{ width: `${levelProgress}%` }}
            >
              <span className="progression-text">
                {progression.experience} / {progression.experienceToNextLevel} EXP
              </span>
            </div>
          </div>
        </div>
      </div>

      {showLevelUp && levelUpData && (
        <div className="level-up-modal">
          <div className="level-up-content">
            <div className="level-up-icon">🎉</div>
            <h2>УРОВЕНЬ ПОВЫШЕН!</h2>
            <p className="level-up-level">Уровень {levelUpData.level}</p>
            <div className="level-up-rewards">
              <div className="reward-title">Ваши награды:</div>
              {levelUpData.rewards && (
                <>
                  {levelUpData.rewards.diamonds > 0 && (
                    <div className="reward-item">
                      <span className="reward-icon">💎</span>
                      <span className="reward-text">{levelUpData.rewards.diamonds} Кристаллов</span>
                    </div>
                  )}
                  {levelUpData.rewards.freeSpins > 0 && (
                    <div className="reward-item">
                      <span className="reward-icon">🎁</span>
                      <span className="reward-text">{levelUpData.rewards.freeSpins} Бесплатных спинов</span>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="level-up-bonuses">
              <div className="bonus-item">
                <span>+{(levelUpData.level * 5)}% к опыту</span>
              </div>
              <div className="bonus-item">
                <span>+{(levelUpData.level * 2)}% к выигрышам</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlayerProgressionPanel

