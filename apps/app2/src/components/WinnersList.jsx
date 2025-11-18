import './WinnersList.css'
import { GAME_SYMBOLS } from '../utils/imageUtils'

function WinnersList({ winners }) {
  return (
    <div className="winners-list">
      <h2 className="winners-title">ПОСЛЕДНИЕ ВЫИГРЫШИ</h2>
      <div className="winners-items">
        {winners.map((winner, index) => {
          const isItem = winner.itemType && GAME_SYMBOLS[winner.itemType]
          const itemImage = isItem ? GAME_SYMBOLS[winner.itemType].getRandomImage() : null
          const itemName = isItem ? GAME_SYMBOLS[winner.itemType].name : null

          const uniqueKey = winner.itemType 
            ? `winner-${index}-${winner.itemType}-${winner.quantity || 1}`
            : `winner-${index}-${winner.icon || 'default'}-${winner.amount || 0}`

          const avatarLetter = winner.name ? winner.name.charAt(0).toUpperCase() : 'P'

          return (
            <div key={uniqueKey} className="winner-item">
              <div className="winner-avatar">
                {winner.avatar ? (
                  <img src={winner.avatar} alt={winner.name} />
                ) : (
                  <span className="winner-avatar-initial">{avatarLetter}</span>
                )}
              </div>
              <div className="winner-info">
                <div className="winner-name">{winner.name}</div>
                <div className="winner-description">
                  {isItem ? 'Получил награду' : 'Крупный выигрыш'}
                </div>
              </div>
              <div className="winner-prize">
                {isItem ? (
                  <div className="winner-prize-item">
                    <img 
                      src={itemImage} 
                      alt={itemName}
                      className="winner-item-image"
                    />
                    <div className="winner-prize-details">
                      <div className="winner-item-name">{itemName}</div>
                      {winner.quantity > 1 && (
                        <div className="winner-item-quantity">x{winner.quantity}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="winner-amount">
                    {winner.icon} {winner.amount?.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WinnersList

