import { useState, useEffect } from 'react'
import './PlayerInfoPanel.css'
import currencyRuby from '../assets/images/currency_ruby.png'
import currencyShield from '../assets/images/currency_shield.png'

function PlayerInfoPanel({ diamonds, shields, progression, onLevelUp }) {
  // Обработка level up - хуки должны быть до раннего return
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

  const { level, experience, experienceToNextLevel, vipLevel, vipPoints, vipPointsToNextLevel } = progression

  const levelProgress = experienceToNextLevel > 0 ? (experience / experienceToNextLevel) * 100 : 100
  const vipProgress = vipPointsToNextLevel > 0 ? (vipPoints / vipPointsToNextLevel) * 100 : 100

  return (
    <div className="player-info-panel">
      <div className="player-info-main">
        {/* Валюта */}
        <div className="player-currency">
          <div className="currency-item">
            <img 
              src={currencyRuby} 
              alt="Рубины" 
              className="currency-icon"
            />
            <span className="currency-value">{diamonds}</span>
          </div>
          <div className="currency-item">
            <img 
              src={currencyShield} 
              alt="Щиты" 
              className="currency-icon"
            />
            <span className="currency-value">{shields}</span>
          </div>
        </div>

        {/* Уровень */}
        <div className="player-level-section">
          <div className="level-header">
            <span className="level-label">УРОВЕНЬ</span>
            <span className="level-value">LVL {level}</span>
          </div>
          <div className="level-progress-bar">
            <div 
              className="level-progress-fill"
              style={{ width: `${levelProgress}%` }}
            >
              <span className="level-progress-text">
                {experience} / {experienceToNextLevel} EXP
              </span>
            </div>
          </div>
        </div>

        {/* VIP */}
        {vipLevel > 0 && (
          <div className="player-vip-section">
            <div className="vip-header">
              <span className="vip-label">VIP</span>
              <span className="vip-value">LVL {vipLevel}</span>
            </div>
            <div className="vip-progress-bar">
              <div 
                className="vip-progress-fill"
                style={{ width: `${vipProgress}%` }}
              >
                <span className="vip-progress-text">
                  {vipPoints} / {vipPointsToNextLevel} VIP
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showLevelUp && levelUpData && (
        <div className="level-up-notification">
          <div className="level-up-content">
            <h3>ПОВЫШЕНИЕ УРОВНЯ!</h3>
            <p>Новый уровень: {levelUpData.level}</p>
            {levelUpData.rewards && (
              <div className="level-up-bonuses">
                {levelUpData.rewards.diamonds > 0 && (
                  <p>💎 {levelUpData.rewards.diamonds} Кристаллов</p>
                )}
                {levelUpData.rewards.freeSpins > 0 && (
                  <p>🎁 {levelUpData.rewards.freeSpins} Бесплатных спинов</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayerInfoPanel

