import { useState, useEffect } from 'react'
import './DailyBonusModal.css'
import currencyRuby from '../assets/images/currency_ruby.png'
import currencyShield from '../assets/images/currency_shield.png'

function DailyBonusModal({ isOpen, onClose, bonus, onClaim, nextBonus }) {
  const [claimed, setClaimed] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (isOpen && bonus) {
      setAnimating(true)
      setTimeout(() => setAnimating(false), 1000)
    }
  }, [isOpen, bonus])

  if (!isOpen) return null

  const handleClaim = () => {
    if (onClaim && !claimed) {
      onClaim()
      setClaimed(true)
      setTimeout(() => {
        onClose()
        setClaimed(false)
      }, 2000)
    }
  }

  return (
    <div className="daily-bonus-overlay" onClick={onClose}>
      <div className="daily-bonus-modal" onClick={(e) => e.stopPropagation()}>
        <button className="daily-bonus-close" onClick={onClose}>×</button>
        
        <div className="daily-bonus-header">
          <h2>Ежедневный бонус</h2>
          <p className="daily-bonus-day">День {bonus?.day || nextBonus?.day || 1}</p>
        </div>

        {bonus && !claimed ? (
          <div className={`daily-bonus-content ${animating ? 'animating' : ''}`}>
            <div className="daily-bonus-rewards">
              <div className="daily-bonus-reward">
                <img src={currencyRuby} alt="Рубины" className="reward-icon" />
                <span className="reward-amount">{bonus.diamonds}</span>
              </div>
              <div className="daily-bonus-reward">
                <img src={currencyShield} alt="Щиты" className="reward-icon" />
                <span className="reward-amount">{bonus.shields}</span>
              </div>
            </div>

            {bonus.specialBonus && (
              <div className="daily-bonus-special">
                <span className="special-icon">⭐</span>
                <span>Особый бонус: Увеличенный шанс джекпота!</span>
              </div>
            )}

            <button className="daily-bonus-claim" onClick={handleClaim}>
              Забрать награду
            </button>
          </div>
        ) : claimed ? (
          <div className="daily-bonus-claimed">
            <div className="claimed-icon">✓</div>
            <p>Награда получена!</p>
          </div>
        ) : (
          <div className="daily-bonus-preview">
            <p>Следующий бонус:</p>
            {nextBonus && (
              <div className="daily-bonus-rewards">
                <div className="daily-bonus-reward">
                  <img src={currencyRuby} alt="Рубины" className="reward-icon" />
                  <span className="reward-amount">{nextBonus.diamonds}</span>
                </div>
                <div className="daily-bonus-reward">
                  <img src={currencyShield} alt="Щиты" className="reward-icon" />
                  <span className="reward-amount">{nextBonus.shields}</span>
                </div>
              </div>
            )}
            <button className="daily-bonus-close-btn" onClick={onClose}>
              Закрыть
            </button>
          </div>
        )}

        {nextBonus && bonus && (
          <div className="daily-bonus-streak">
            Серия дней: {bonus.day} {bonus.day === 7 ? '🔥' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyBonusModal

