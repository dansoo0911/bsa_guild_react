import { useState, useMemo } from 'react'
import { guildConfig } from '../config/guildConfig'
import { getRubyImage, getGPImage } from '../utils/imageUtils'
import './ShopTab.css'

function ShopTab({ guildCrystals: propGuildCrystals, onCrystalsChange }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState(null) // Выбранная валюта для покупки
  const [playerCrystals, setPlayerCrystals] = useState(50) // Кристаллы игрока
  const guildCrystals = propGuildCrystals !== undefined ? propGuildCrystals : (guildConfig.guild.crystals || 0)
  const currentGuildPoints = guildConfig.guild.points || 125000
  const currentGuildLevel = guildConfig.guild.level || 76
  const currentMaxMembers = guildConfig.totalMembers || 105

  // Генерация товаров магазина
  const generateShopItems = () => {
    const allItems = [
      // Услуги и улучшения
      {
        id: 'service_0',
        name: 'Быстрый старт',
        description: 'Повысит уровень гильдии до 10 и даст 100,000 GP',
        category: 'services',
        price: 1000, // Только за кристаллы
        priceGP: 0,
        icon: '⚡',
        rarity: 'legendary',
        stock: guildConfig.guild.quickStartPurchased ? 0 : 1, // Можно купить только один раз
        discount: 0,
        givesGP: 100000,
        setsLevel: 10
      },
      {
        id: 'service_1',
        name: 'Покупка GP за кристаллы',
        description: 'Купите 10,000 GP за кристаллы',
        category: 'services',
        price: 100,
        priceGP: 0,
        icon: '💎',
        rarity: 'rare',
        stock: -1,
        discount: 0,
        givesGP: 10000
      },
      {
        id: 'service_2',
        name: 'Роль гильдии',
        description: 'Создайте новую роль в гильдии',
        category: 'services',
        price: 500, // 500 кристаллов = 50,000 GP через обмен, но за GP стоит 55,000 (на 10% дороже)
        priceGP: 55000, // Делаем немного дороже, чтобы покупка за кристаллы была выгоднее
        icon: '👑',
        rarity: 'epic',
        stock: -1,
        discount: 0
      },
      {
        id: 'service_4',
        name: 'Загрузка картинки гильдии',
        description: 'Разблокируйте возможность загрузить свою картинку гильдии',
        category: 'services',
        price: 200, // 200 кристаллов = 20,000 GP через обмен, но за GP стоит 22,000 (на 10% дороже)
        priceGP: 22000, // Делаем немного дороже, чтобы покупка за кристаллы была выгоднее
        icon: '🖼️',
        rarity: 'rare',
        stock: 1,
        discount: 0
      },
      {
        id: 'service_5',
        name: 'Роль в Discord',
        description: 'Создайте роль в Discord и примените её для всех членов гильдии. Требуется 100 уровень гильдии',
        category: 'services',
        price: 1000,
        priceGP: 200000,
        icon: '💬',
        rarity: 'legendary',
        stock: -1,
        discount: 0,
        requiredLevel: 100
      },
      {
        id: 'service_7',
        name: 'Слот для участников',
        description: 'Увеличьте максимальное количество участников гильдии на 1. Разблокируется 1 каждые 2 уровня',
        category: 'services',
        price: 300,
        priceGP: 100000,
        icon: '👥',
        rarity: 'epic',
        stock: -1,
        discount: 0,
        unlocksAtLevel: Math.floor(currentGuildLevel / 2) * 2 + 2
      },
      {
        id: 'service_9',
        name: 'Отображение тега гильдии',
        description: 'Разблокируйте возможность отображать тег гильдии над головой персонажа',
        category: 'services',
        price: 150, // 150 кристаллов = 15,000 GP через обмен, но за GP стоит 16,500 (на 10% дороже)
        priceGP: 16500, // Делаем немного дороже, чтобы покупка за кристаллы была выгоднее
        icon: '🏷️',
        rarity: 'rare',
        stock: 1,
        discount: 0
      },
      {
        id: 'service_10',
        name: 'Отображение титула',
        description: 'Разблокируйте возможность отображать титул над головой персонажа. Требуется 75 уровень гильдии',
        category: 'services',
        price: 400, // 400 кристаллов = 40,000 GP через обмен, но за GP стоит 44,000 (на 10% дороже)
        priceGP: 44000, // Делаем немного дороже, чтобы покупка за кристаллы была выгоднее
        icon: '👑',
        rarity: 'epic',
        stock: 1,
        discount: 0,
        requiredLevel: 75
      }
    ]

    return allItems
  }

  const allItems = useMemo(() => generateShopItems(), [currentGuildLevel])

  const filteredItems = useMemo(() => {
    return allItems
  }, [allItems])

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return '#8A9BA8'
      case 'rare':
        return '#64B5F6'
      case 'epic':
        return '#BA68C8'
      case 'legendary':
        return '#FFD700'
      default:
        return '#8A9BA8'
    }
  }

  const getRarityName = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'Обычный'
      case 'rare':
        return 'Редкий'
      case 'epic':
        return 'Эпический'
      case 'legendary':
        return 'Легендарный'
      default:
        return 'Обычный'
    }
  }

  const handlePurchase = (item, currency = null) => {
    // Проверка уровня гильдии для некоторых товаров
    if (item.requiredLevel && currentGuildLevel < item.requiredLevel) {
      alert(`Требуется ${item.requiredLevel} уровень гильдии! Текущий уровень: ${currentGuildLevel}`)
      return
    }
    
    if (item.unlocksAtLevel && currentGuildLevel < item.unlocksAtLevel) {
      alert(`Этот товар разблокируется на ${item.unlocksAtLevel} уровне гильдии! Текущий уровень: ${currentGuildLevel}`)
      return
    }

    // Определяем валюту покупки
    const useCrystals = currency === 'crystals' || (currency === null && item.price > 0 && item.priceGP === 0)
    const useGP = currency === 'GP' || (currency === null && item.priceGP > 0 && item.price === 0)
    
    // Если у товара есть оба варианта, но валюта не выбрана - показываем ошибку
    if (item.price > 0 && item.priceGP > 0 && !currency) {
      alert('Выберите валюту для покупки')
      return
    }

    if (useCrystals && item.price > 0) {
      const price = item.price || 0
      if (guildCrystals < price) {
        alert(`Недостаточно кристаллов! Нужно: ${price}, у гильдии: ${guildCrystals}`)
        return
      }
      // Покупка за кристаллы
      const newCrystals = guildCrystals - price
      guildConfig.guild.crystals = newCrystals
      if (onCrystalsChange) {
        onCrystalsChange(newCrystals)
      }
      
      // Уменьшаем stock для товаров с ограниченным количеством
      if (item.stock > 0) {
        item.stock -= 1
      }
      
      // Обработка специальных товаров
      if (item.setsLevel) {
        // Устанавливаем уровень гильдии
        guildConfig.guild.level = item.setsLevel
        guildConfig.guild.currentExp = 0
        guildConfig.guild.expToNextLevel = 1000 // Примерное значение для следующего уровня
        // Сохраняем флаг покупки "Быстрый старт"
        if (item.id === 'service_0') {
          guildConfig.guild.quickStartPurchased = true
        }
      }
      if (item.givesGP) {
        guildConfig.guild.points += item.givesGP
        if (item.setsLevel) {
          alert(`Покупка: ${item.name}. Уровень гильдии установлен на ${item.setsLevel}. Получено ${item.givesGP.toLocaleString()} GP`)
        } else {
          alert(`Покупка: ${item.name}. Получено ${item.givesGP.toLocaleString()} GP`)
        }
      } else if (!item.setsLevel) {
        alert(`Покупка: ${item.name} за ${price} кристаллов`)
      }
    } else if (useGP && item.priceGP > 0) {
      // Покупка за GP
      const price = item.priceGP || 0
      if (currentGuildPoints < price) {
        alert(`Недостаточно GP! Нужно: ${price.toLocaleString()}, у гильдии: ${currentGuildPoints.toLocaleString()}`)
        return
      }
      guildConfig.guild.points -= price
      
      // Уменьшаем stock для товаров с ограниченным количеством
      if (item.stock > 0) {
        item.stock -= 1
      }
      
      alert(`Покупка: ${item.name} за ${price.toLocaleString()} GP`)
    } else {
      alert('Недостаточно средств для покупки')
    }
  }

  const handleDonateCrystals = () => {
    if (playerCrystals <= 0) {
      alert('У вас нет кристаллов для пожертвования')
      return
    }
    
    // Пожертвование всех кристаллов игрока
    const donatedAmount = playerCrystals
    setPlayerCrystals(0)
    const newCrystals = guildCrystals + donatedAmount
    guildConfig.guild.crystals = newCrystals
    if (onCrystalsChange) {
      onCrystalsChange(newCrystals)
    }
    alert(`Пожертвовано ${donatedAmount} кристаллов в фонд гильдии!`)
  }

  return (
    <div className="main-content shop-container">
      <div className="shop-content">
        {/* Заголовок и баланс */}
        <div className="shop-header">
          <div className="shop-title-section">
            <h1 className="shop-main-title">🏪 Магазин гильдии</h1>
            <p className="shop-subtitle">Покупайте товары за очки гильдии (GP) и кристаллы</p>
          </div>
          <div className="shop-balances">
            <div className="shop-balance shop-balance-crystals">
              <img src={getRubyImage()} alt="Кристаллы" className="balance-crystal-icon" />
              <div className="balance-info">
                <div className="balance-label">Кристаллы гильдии</div>
                <div className="balance-value">{guildCrystals.toLocaleString()}</div>
              </div>
              <button
                className="donate-button-compact"
                onClick={handleDonateCrystals}
                disabled={playerCrystals <= 0}
                title={`Пожертвовать все кристаллы (${playerCrystals})`}
              >
                Пожертвовать
              </button>
            </div>
            <div className="shop-balance">
              <img src={getGPImage()} alt="GP" className="balance-icon-image" />
              <div className="balance-info">
                <div className="balance-label">Баланс гильдии</div>
                <div className="balance-value">{currentGuildPoints.toLocaleString()} GP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Сетка товаров */}
        <div className="shop-items-grid">
          {filteredItems.map(item => {
            const hasCrystalsPrice = item.price > 0
            const hasGPPrice = item.priceGP > 0
            const canAffordCrystals = hasCrystalsPrice && guildCrystals >= item.price
            const canAffordGP = hasGPPrice && currentGuildPoints >= item.priceGP
            const canAfford = canAffordCrystals || canAffordGP
            const isOutOfStock = item.stock === 0
            const isLevelLocked = (item.requiredLevel && currentGuildLevel < item.requiredLevel) ||
                                  (item.unlocksAtLevel && currentGuildLevel < item.unlocksAtLevel)

            return (
              <div
                key={item.id}
                className={`shop-item-card rarity-${item.rarity} ${!canAfford ? 'insufficient-funds' : ''} ${isOutOfStock ? 'out-of-stock' : ''} ${isLevelLocked ? 'level-locked' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                {item.discount > 0 && (
                  <div className="item-discount-badge">-{item.discount}%</div>
                )}
                <div className="item-icon">{item.icon}</div>
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                </div>
                <div className="item-footer">
                  <div className="item-price-section">
                    {hasCrystalsPrice && hasGPPrice ? (
                      <>
                        <div className="item-price-dual">
                          <div className="item-price-option">
                            <img src={getRubyImage()} alt="Кристаллы" className="price-crystal-icon" />
                            <span>{item.price.toLocaleString()}</span>
                          </div>
                          <span className="price-separator">или</span>
                          <div className="item-price-option">
                            <span>{item.priceGP.toLocaleString()} GP</span>
                          </div>
                        </div>
                      </>
                    ) : hasCrystalsPrice ? (
                      <div className="item-price">
                        <img src={getRubyImage()} alt="Кристаллы" className="price-crystal-icon" />
                        <span>{item.price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="item-price">
                        <span>{item.priceGP.toLocaleString()} GP</span>
                      </div>
                    )}
                    {item.requiredLevel && (
                      <div className="item-level-requirement">
                        Требуется: {item.requiredLevel} уровень
                      </div>
                    )}
                    {item.unlocksAtLevel && (
                      <div className="item-level-requirement">
                        Разблокируется: {item.unlocksAtLevel} уровень
                      </div>
                    )}
                  </div>
                  {item.stock !== -1 && (
                    <div className="item-stock">
                      Осталось: {item.stock}
                    </div>
                  )}
                  <button
                    className={`item-buy-button ${!canAfford || isOutOfStock || isLevelLocked ? 'disabled' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (canAfford && !isOutOfStock && !isLevelLocked) {
                        if (hasCrystalsPrice && hasGPPrice) {
                          setSelectedItem(item)
                          setSelectedCurrency(null)
                        } else {
                          handlePurchase(item)
                        }
                      }
                    }}
                    disabled={!canAfford || isOutOfStock || isLevelLocked}
                  >
                    {isOutOfStock ? 'Нет в наличии' : 
                     isLevelLocked ? 'Заблокировано' :
                     !canAfford ? 'Недостаточно средств' : 
                     'Купить'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Модальное окно с деталями товара */}
      {selectedItem && (
        <div className="item-modal-overlay" onClick={() => {
          setSelectedItem(null)
          setSelectedCurrency(null)
        }}>
          <div className="item-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => {
              setSelectedItem(null)
              setSelectedCurrency(null)
            }}>×</button>
            <div className={`modal-item-icon rarity-${selectedItem.rarity}`}>
              {selectedItem.icon}
            </div>
            <h2 className="modal-item-name">{selectedItem.name}</h2>
            <p className="modal-item-description">{selectedItem.description}</p>
            <div className="modal-item-details">
              <div className="modal-detail-row">
                <span className="detail-label">Цена:</span>
                <div className="detail-value">
                  {selectedItem.price > 0 && selectedItem.priceGP > 0 ? (
                    <div className="modal-price-dual">
                      <div 
                        className={`modal-price-option ${selectedCurrency === 'crystals' ? 'selected' : ''} ${guildCrystals >= selectedItem.price ? '' : 'insufficient'}`}
                        onClick={() => guildCrystals >= selectedItem.price && setSelectedCurrency('crystals')}
                        style={{ cursor: guildCrystals >= selectedItem.price ? 'pointer' : 'not-allowed' }}
                      >
                        <img src={getRubyImage()} alt="Кристаллы" className="price-crystal-icon" />
                        <span>{selectedItem.price.toLocaleString()}</span>
                        {guildCrystals < selectedItem.price && <span className="insufficient-badge">Недостаточно</span>}
                      </div>
                      <span className="price-separator">или</span>
                      <div 
                        className={`modal-price-option ${selectedCurrency === 'GP' ? 'selected' : ''} ${currentGuildPoints >= selectedItem.priceGP ? '' : 'insufficient'}`}
                        onClick={() => currentGuildPoints >= selectedItem.priceGP && setSelectedCurrency('GP')}
                        style={{ cursor: currentGuildPoints >= selectedItem.priceGP ? 'pointer' : 'not-allowed' }}
                      >
                        <span>{selectedItem.priceGP.toLocaleString()} GP</span>
                        {currentGuildPoints < selectedItem.priceGP && <span className="insufficient-badge">Недостаточно</span>}
                      </div>
                    </div>
                  ) : selectedItem.price > 0 ? (
                    <div className="modal-price-single">
                      <img src={getRubyImage()} alt="Кристаллы" className="price-crystal-icon" />
                      <span>{(selectedItem.price || 0).toLocaleString()}</span>
                    </div>
                  ) : (
                    <div className="modal-price-single">
                      <span>{(selectedItem.priceGP || 0).toLocaleString()} GP</span>
                    </div>
                  )}
                </div>
              </div>
              {selectedItem.requiredLevel && (
                <div className="modal-detail-row">
                  <span className="detail-label">Требуется уровень:</span>
                  <span className="detail-value">{selectedItem.requiredLevel}</span>
                </div>
              )}
              {selectedItem.unlocksAtLevel && (
                <div className="modal-detail-row">
                  <span className="detail-label">Разблокируется:</span>
                  <span className="detail-value">{selectedItem.unlocksAtLevel} уровень</span>
                </div>
              )}
              {selectedItem.stock !== -1 && (
                <div className="modal-detail-row">
                  <span className="detail-label">В наличии:</span>
                  <span className="detail-value">{selectedItem.stock} шт.</span>
                </div>
              )}
            </div>
            {selectedItem.price > 0 && selectedItem.priceGP > 0 && (
              <div className="modal-currency-selector">
                <button
                  className={`currency-select-btn ${selectedCurrency === 'crystals' ? 'active' : ''} ${guildCrystals < selectedItem.price ? 'insufficient' : ''}`}
                  onClick={() => setSelectedCurrency('crystals')}
                >
                  <img src={getRubyImage()} alt="Кристаллы" className="price-crystal-icon" />
                  <span>{selectedItem.price.toLocaleString()}</span>
                </button>
                <button
                  className={`currency-select-btn ${selectedCurrency === 'GP' ? 'active' : ''} ${currentGuildPoints < selectedItem.priceGP ? 'insufficient' : ''}`}
                  onClick={() => setSelectedCurrency('GP')}
                >
                  <span>{selectedItem.priceGP.toLocaleString()} GP</span>
                </button>
              </div>
            )}
            <button
              className={`modal-buy-button ${
                (selectedItem.price > 0 && selectedItem.priceGP > 0 && !selectedCurrency) ||
                (selectedCurrency === 'crystals' && guildCrystals < (selectedItem.price || 0)) ||
                (selectedCurrency === 'GP' && currentGuildPoints < (selectedItem.priceGP || 0)) ||
                (!selectedCurrency && selectedItem.price > 0 && guildCrystals < (selectedItem.price || 0)) ||
                (!selectedCurrency && selectedItem.priceGP > 0 && currentGuildPoints < (selectedItem.priceGP || 0)) ||
                selectedItem.stock === 0 ||
                (selectedItem.requiredLevel && currentGuildLevel < selectedItem.requiredLevel) ||
                (selectedItem.unlocksAtLevel && currentGuildLevel < selectedItem.unlocksAtLevel)
                  ? 'disabled' : ''}`}
              onClick={() => {
                handlePurchase(selectedItem, selectedCurrency)
                setSelectedItem(null)
                setSelectedCurrency(null)
              }}
              disabled={
                (selectedItem.price > 0 && selectedItem.priceGP > 0 && !selectedCurrency) ||
                (selectedCurrency === 'crystals' && guildCrystals < (selectedItem.price || 0)) ||
                (selectedCurrency === 'GP' && currentGuildPoints < (selectedItem.priceGP || 0)) ||
                (!selectedCurrency && selectedItem.price > 0 && guildCrystals < (selectedItem.price || 0)) ||
                (!selectedCurrency && selectedItem.priceGP > 0 && currentGuildPoints < (selectedItem.priceGP || 0)) ||
                selectedItem.stock === 0 ||
                (selectedItem.requiredLevel && currentGuildLevel < selectedItem.requiredLevel) ||
                (selectedItem.unlocksAtLevel && currentGuildLevel < selectedItem.unlocksAtLevel)
              }
            >
              {selectedItem.stock === 0 ? 'Нет в наличии' : 
               (selectedItem.requiredLevel && currentGuildLevel < selectedItem.requiredLevel) ? `Требуется ${selectedItem.requiredLevel} уровень` :
               (selectedItem.unlocksAtLevel && currentGuildLevel < selectedItem.unlocksAtLevel) ? `Разблокируется на ${selectedItem.unlocksAtLevel} уровне` :
               (selectedItem.price > 0 && selectedItem.priceGP > 0 && !selectedCurrency) ? 'Выберите валюту' :
               (selectedCurrency === 'crystals' || (selectedItem.price > 0 && selectedItem.priceGP === 0)) 
                 ? (guildCrystals < (selectedItem.price || 0) ? 'Недостаточно кристаллов' : `Купить за ${(selectedItem.price || 0).toLocaleString()}`)
                 : (currentGuildPoints < (selectedItem.priceGP || 0) ? 'Недостаточно GP' : `Купить за ${(selectedItem.priceGP || 0).toLocaleString()} GP`)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopTab

