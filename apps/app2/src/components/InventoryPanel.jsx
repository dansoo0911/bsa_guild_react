import { useState } from 'react'
import './InventoryPanel.css'
import { GAME_SYMBOLS } from '../utils/imageUtils'
import { getItemExchangeValue } from '../systems/InventorySystem'
import currencyRuby from '../assets/images/currency_ruby.png'
import currencyShield from '../assets/images/currency_shield.png'

function InventoryPanel({ inventory, onExchange, selectedCurrency }) {
  const [expanded, setExpanded] = useState(false)

  const items = inventory.getAllItems()

  if (items.length === 0) {
    return (
      <div className="inventory-panel">
        <button 
          className="inventory-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="inventory-icon">🎒</span>
          <span className="inventory-label">Инвентарь</span>
          <span className="inventory-count">0</span>
        </button>
        {expanded && (
          <div className="inventory-content">
            <p className="inventory-empty">Инвентарь пуст</p>
          </div>
        )}
      </div>
    )
  }

  const totalItems = items.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="inventory-panel">
      <button 
        className="inventory-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="inventory-icon">🎒</span>
        <span className="inventory-label">Инвентарь</span>
        <span className="inventory-count">{totalItems}</span>
      </button>
      
      {expanded && (
        <div className="inventory-content">
          <div className="inventory-header">
            <h3>Ваши предметы</h3>
            <p className="inventory-hint">Нажмите на предмет для обмена</p>
          </div>
          
          <div className="inventory-items">
            {items.map((item) => {
              const exchangeValue = getItemExchangeValue(item.type, selectedCurrency)
              const totalExchangeValue = exchangeValue * item.count
              
              return (
                <div 
                  key={item.type}
                  className="inventory-item"
                  onClick={() => onExchange(item.type, selectedCurrency, item.count)}
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
                    <div className="item-exchange">
                      <img 
                        src={selectedCurrency === 'diamonds' ? currencyRuby : currencyShield}
                        alt={selectedCurrency === 'diamonds' ? 'Рубины' : 'Щиты'}
                        className="exchange-icon"
                      />
                      <span className="exchange-value">
                        {totalExchangeValue} за обмен
                      </span>
                    </div>
                    <div className="item-hint">Нажмите для обмена</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryPanel

