import { useEffect, useState } from 'react'
import './ItemWinNotification.css'
import { GAME_SYMBOLS } from '../utils/imageUtils'

function ItemWinNotification({ itemType, quantity, onClose }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    console.log('ItemWinNotification useEffect - itemType:', itemType, 'quantity:', quantity)
    if (itemType) {
      console.log('✅ Showing notification for item:', itemType)
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(() => {
          if (onClose) onClose()
        }, 500)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      console.log('❌ No itemType, hiding notification')
      setShow(false)
    }
  }, [itemType, quantity, onClose])

  console.log('ItemWinNotification render - show:', show, 'itemType:', itemType)
  
  if (!show || !itemType) {
    console.log('❌ Not showing notification - show:', show, 'itemType:', itemType)
    return null
  }

  const symbol = GAME_SYMBOLS[itemType]
  if (!symbol) {
    console.error('❌ Symbol not found for itemType:', itemType, 'Available:', Object.keys(GAME_SYMBOLS))
    return null
  }
  
  console.log('✅ Rendering notification for:', symbol.name)

  const itemImage = symbol.getRandomImage()
  const itemName = symbol.name

  return (
    <div className="item-win-notification">
      <div className="notification-content">
        <div className="notification-icon-container">
          <img 
            src={itemImage} 
            alt={itemName}
            className="notification-item-image"
          />
          <div className="notification-glow" />
        </div>
        <div className="notification-text">
          <h2 className="notification-title">ПОБЕДА!</h2>
          <p className="notification-item-name">{itemName}</p>
          {quantity > 1 && (
            <p className="notification-quantity">x{quantity}</p>
          )}
          <p className="notification-message">Предмет добавлен в награды казино!</p>
        </div>
      </div>
    </div>
  )
}

export default ItemWinNotification

