import { useEffect, useState } from 'react'
import './PrizeModal.css'

function PrizeModal({ type, isOpen, onClose }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShow(true)
    } else {
      setTimeout(() => setShow(false), 500)
    }
  }, [isOpen])

  if (!show) return null

  const isMainPrize = type === 'main'
  const title = isMainPrize ? '🎉 ГЛАВНЫЙ ПРИЗ РАЗБЛОКИРОВАН! 🎉' : '🏆 АРТЕФАКТ РАЗБЛОКИРОВАН! 🏆'
  const description = isMainPrize 
    ? 'Вы получили доступ к главному призу джекпота!' 
    : 'Вы получили легендарный артефакт!'

  return (
    <div className={`prize-modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className={`prize-modal ${isOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="prize-content">
          <div className="prize-icon">
            {isMainPrize ? '🎉' : '🏆'}
          </div>
          <h2 className="prize-title">{title}</h2>
          <p className="prize-description">{description}</p>
          <button className="prize-button" onClick={onClose}>
            Отлично!
          </button>
        </div>
        <div className="prize-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="prize-particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PrizeModal

