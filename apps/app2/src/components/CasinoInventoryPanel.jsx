import { useState } from 'react'
import './CasinoInventoryPanel.css'
import { GAME_SYMBOLS } from '../utils/imageUtils'
import currencyRuby from '../assets/images/currency_ruby.png'
import currencyShield from '../assets/images/currency_shield.png'

function CasinoInventoryPanel({ casinoInventory, playerInventory, onClaimItem, onExchangeForSpins, freeSpins }) {
  const [expanded, setExpanded] = useState(false)
  const [selectedAction, setSelectedAction] = useState(null) // 'claim' или 'exchange'

  const items = casinoInventory.getAllItems()
  const totalItems = casinoInventory.getTotalItemsCount()

  if (items.length === 0) {
    return (
      <div className="casino-inventory-panel">
        <button 
          className="casino-inventory-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="casino-inventory-icon">🎰</span>
          <span className="casino-inventory-label">Инвентарь казино</span>
          <span className="casino-inventory-count">0</span>
        </button>
        {expanded && (
          <div className="casino-inventory-content">
            <p className="casino-inventory-empty">Инвентарь казино пуст</p>
            <p className="casino-inventory-hint">Выиграйте предметы в игре!</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="casino-inventory-panel">
      <button 
        className="casino-inventory-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="casino-inventory-icon">🎰</span>
        <span className="casino-inventory-label">Инвентарь казино</span>
        <span className="casino-inventory-count">{totalItems}</span>
        {freeSpins > 0 && (
          <span className="free-spins-badge">🎁 {freeSpins}</span>
        )}
      </button>
      
      {expanded && (
        <div className="casino-inventory-content">
          <div className="casino-inventory-header">
            <h3>Ваши выигрыши</h3>
            <p className="casino-inventory-subtitle">Заберите предметы или обменяйте на бесплатные спины</p>
            {freeSpins > 0 && (
              <div className="free-spins-display">
                <span className="free-spins-icon">🎁</span>
                <span className="free-spins-text">Бесплатных спинов: {freeSpins}</span>
              </div>
            )}
          </div>

          <div className="action-selector">
            <button
              className={`action-button ${selectedAction === 'claim' ? 'active' : ''}`}
              onClick={() => setSelectedAction('claim')}
            >
              Забрать
            </button>
            <button
              className={`action-button ${selectedAction === 'exchange' ? 'active' : ''}`}
              onClick={() => setSelectedAction('exchange')}
            >
              Обменять на спины
            </button>
          </div>
          
          <div className="casino-inventory-items">
            {items.map((item) => (
              <div 
                key={item.type}
                className="casino-inventory-item"
              >
                <div className="item-image-container">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="item-image"
                  />
                  <span className="item-count">{item.count}x</span>
                </div>
                
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-details">
                    {selectedAction === 'claim' ? (
                      <div className="action-info claim-info">
                        <span>Забрать в инвентарь</span>
                      </div>
                    ) : selectedAction === 'exchange' ? (
                      <div className="action-info exchange-info">
                        <span className="spins-value">
                          🎁 {item.freeSpinsValue * item.count} спинов
                        </span>
                      </div>
                    ) : (
                      <div className="action-info">
                        <span>Выберите действие</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedAction && (
                    <button
                      className={`item-action-button ${selectedAction === 'claim' ? 'claim-button' : 'exchange-button'}`}
                      onClick={() => {
                        if (selectedAction === 'claim') {
                          onClaimItem(item.type, item.count)
                        } else {
                          onExchangeForSpins(item.type, item.count)
                        }
                      }}
                    >
                      {selectedAction === 'claim' ? 'Забрать' : 'Обменять'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CasinoInventoryPanel

