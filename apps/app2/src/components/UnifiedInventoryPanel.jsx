import { useState, useEffect } from 'react'
import './UnifiedInventoryPanel.css'
import { GAME_SYMBOLS } from '../utils/imageUtils'
import { getItemExchangeValue } from '../systems/InventorySystem'
import currencyRuby from '../assets/images/currency_ruby.png'
import currencyShield from '../assets/images/currency_shield.png'

function UnifiedInventoryPanel({ 
  casinoInventory, 
  playerInventory, 
  onClaimItem, 
  onExchangeForSpins, 
  onExchange,
  freeSpins,
  selectedCurrency 
}) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('casino') // 'casino' или 'player'

  const casinoItems = casinoInventory ? casinoInventory.getAllItems() : []
  const playerItems = playerInventory ? playerInventory.getAllItems() : []
  const totalCasinoItems = casinoInventory ? casinoInventory.getTotalItemsCount() : 0
  const totalPlayerItems = playerItems.reduce((sum, item) => sum + item.count, 0)
  
  // Отладка - пересчитываем при изменении инвентаря
  useEffect(() => {
    if (casinoInventory) {
      const items = casinoInventory.getAllItems()
      const total = casinoInventory.getTotalItemsCount()
      if (items.length > 0 || total > 0) {
        console.log('UnifiedInventoryPanel - Casino items:', items, 'Total:', total)
      }
    }
  }, [totalCasinoItems])

  return (
    <div className="unified-inventory-panel">
      <button 
        className="unified-inventory-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="unified-inventory-icon">🎰</span>
        <span className="unified-inventory-label">Награды казино</span>
        <span className="unified-inventory-count">{totalCasinoItems}</span>
        {freeSpins > 0 && (
          <span className="free-spins-badge">🎁 {freeSpins}</span>
        )}
      </button>
      
      {expanded && (
        <div className="unified-inventory-content">
          {/* Табы */}
          <div className="inventory-tabs">
            <button
              className={`inventory-tab ${activeTab === 'casino' ? 'active' : ''}`}
              onClick={() => setActiveTab('casino')}
            >
              Награды казино ({totalCasinoItems})
            </button>
            <button
              className={`inventory-tab ${activeTab === 'player' ? 'active' : ''}`}
              onClick={() => setActiveTab('player')}
            >
              Мой инвентарь ({totalPlayerItems})
            </button>
          </div>

          {/* Контент казино */}
          {activeTab === 'casino' && (
            <div className="inventory-tab-content">
              {casinoItems.length === 0 ? (
                <div className="inventory-empty">
                  <p>Инвентарь казино пуст</p>
                  <p className="inventory-hint">Выиграйте предметы в игре!</p>
                </div>
              ) : (
                <>
                  <div className="inventory-header">
                    <h3>Ваши выигрыши</h3>
                    <p className="inventory-hint">
                      Заберите предметы или обменяйте на бесплатные спины
                    </p>
                  </div>
                  <div className="inventory-items">
                    {casinoItems.map((item) => {
                      const symbol = GAME_SYMBOLS[item.type]
                      if (!symbol) return null

                      return (
                        <div key={item.type} className="inventory-item">
                          <div className="item-image-container">
                            <img 
                              src={symbol.getRandomImage()} 
                              alt={symbol.name}
                              className="item-image"
                            />
                            {item.count > 1 && (
                              <span className="item-quantity">{item.count}</span>
                            )}
                          </div>
                          <div className="item-info">
                            <div className="item-name">{symbol.name}</div>
                            <div className="item-actions">
                              <button
                                className="action-button claim-button"
                                onClick={() => onClaimItem(item.type, 1)}
                              >
                                Забрать
                              </button>
                              <button
                                className="action-button exchange-button"
                                onClick={() => onExchangeForSpins(item.type, 1)}
                              >
                                Обменять на спины
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {freeSpins > 0 && (
                    <div className="free-spins-info">
                      <span className="free-spins-icon">🎁</span>
                      <span>Бесплатные спины: {freeSpins}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Контент игрока */}
          {activeTab === 'player' && (
            <div className="inventory-tab-content">
              {playerItems.length === 0 ? (
                <div className="inventory-empty">
                  <p>Инвентарь пуст</p>
                  <p className="inventory-hint">Заберите предметы из казино</p>
                </div>
              ) : (
                <>
                  <div className="inventory-header">
                    <h3>Ваши предметы</h3>
                    <p className="inventory-hint">Нажмите на предмет для обмена</p>
                  </div>
                  <div className="inventory-items">
                    {playerItems.map((item) => {
                      const symbol = GAME_SYMBOLS[item.type]
                      if (!symbol) return null

                      const exchangeValue = getItemExchangeValue(item.type, selectedCurrency)
                      const currencyIcon = selectedCurrency === 'diamonds' ? currencyRuby : currencyShield

                      return (
                        <div key={item.type} className="inventory-item">
                          <div className="item-image-container">
                            <img 
                              src={symbol.getRandomImage()} 
                              alt={symbol.name}
                              className="item-image"
                            />
                            {item.count > 1 && (
                              <span className="item-quantity">{item.count}</span>
                            )}
                          </div>
                          <div className="item-info">
                            <div className="item-name">{symbol.name}</div>
                            <div className="item-exchange-value">
                              <img src={currencyIcon} alt={selectedCurrency} className="exchange-currency-icon" />
                              <span>{exchangeValue} за 1 шт.</span>
                            </div>
                            <button
                              className="action-button exchange-button"
                              onClick={() => onExchange(item.type, selectedCurrency, 1)}
                            >
                              Обменять
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UnifiedInventoryPanel

