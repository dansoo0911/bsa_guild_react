import { useState, useEffect, useMemo } from 'react'
import './GamePanel.css'
import ParticleEffect from './ParticleEffect'
import { GAME_SYMBOLS, getSymbolKeys, getRandomSymbol } from '../utils/imageUtils'
import currencyRuby from '../assets/images/currency_ruby.png'
import currencyShield from '../assets/images/currency_shield.png'
import infoIcon from '../assets/images/free-icon-info-151776.png'

function GamePanel({ 
  diamonds, 
  shields, 
  onPlay, 
  levelBonuses, 
  selectedCurrency: externalSelectedCurrency, 
  onCurrencyChange, 
  freeSpins = 0, 
  onFreeSpinUsed,
  infoPanelVisible,
  onInfoPanelChange
}) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState([null, null, null])
  const [lastWin, setLastWin] = useState(0)
  const [showParticles, setShowParticles] = useState(false)
  const [particleType, setParticleType] = useState('win')
  const [winStreak, setWinStreak] = useState(0)
  // Используем внешнюю валюту если передана, иначе локальную
  const [internalCurrency, setInternalCurrency] = useState('diamonds')
  const selectedCurrency = externalSelectedCurrency !== undefined ? externalSelectedCurrency : internalCurrency
  const [slotStates, setSlotStates] = useState([
    { isSpinning: false, currentSymbol: null, finalSymbol: null, isSlowing: false },
    { isSpinning: false, currentSymbol: null, finalSymbol: null, isSlowing: false },
    { isSpinning: false, currentSymbol: null, finalSymbol: null, isSlowing: false }
  ])
  const [animationTimers, setAnimationTimers] = useState([])
  const [finalResult, setFinalResult] = useState(null)
  const [currentFreeSpinUsed, setCurrentFreeSpinUsed] = useState(false)
  const [internalInfoPanel, setInternalInfoPanel] = useState(false)
  const isInfoControlled = typeof infoPanelVisible === 'boolean' && typeof onInfoPanelChange === 'function'
  const infoPanelActive = isInfoControlled ? infoPanelVisible : internalInfoPanel
  const updateInfoPanel = (value) => {
    if (isInfoControlled) {
      onInfoPanelChange(value)
    } else {
      setInternalInfoPanel(value)
    }
  }

  // Стоимость игры в зависимости от валюты
  const gameCost = {
    diamonds: 2,
    shields: 20
  }

  // Получаем ключи символов
  const symbolKeys = useMemo(() => getSymbolKeys(), [])

  const canPlay = ((selectedCurrency === 'diamonds' ? diamonds >= gameCost.diamonds : shields >= gameCost.shields) || freeSpins > 0) && !spinning

  const spin = () => {
    if (!canPlay) return

    // Используем бесплатный спин только если нет валюты
    const hasEnoughCurrency = selectedCurrency === 'diamonds' ? diamonds >= gameCost.diamonds : shields >= gameCost.shields
    const willUseFreeSpin = freeSpins > 0 && !hasEnoughCurrency
    
    setCurrentFreeSpinUsed(willUseFreeSpin)
    
    if (willUseFreeSpin && onFreeSpinUsed) {
      onFreeSpinUsed()
    }

    setSpinning(true)
    setResult([null, null, null])
    setLastWin(0)

    // Генерируем финальные символы
    const generatedResult = [
      symbolKeys[Math.floor(Math.random() * symbolKeys.length)],
      symbolKeys[Math.floor(Math.random() * symbolKeys.length)],
      symbolKeys[Math.floor(Math.random() * symbolKeys.length)]
    ]
    
    setFinalResult(generatedResult)

    // Запускаем анимацию для каждого слота с задержкой
    const baseDuration = 2500 // Базовая длительность анимации
    const stopDelays = [0, 400, 800] // Задержки остановки для каждого слота
    const timers = []

    setSlotStates([
      { isSpinning: true, currentSymbol: null, finalSymbol: generatedResult[0], isSlowing: false },
      { isSpinning: true, currentSymbol: null, finalSymbol: generatedResult[1], isSlowing: false },
      { isSpinning: true, currentSymbol: null, finalSymbol: generatedResult[2], isSlowing: false }
    ])

    // Функция завершения игры
    const finishGame = (result, usedFreeSpin = false) => {
      setSpinning(false)
      
      // Вычисляем выигрыш
      const winResult = calculateWin(result)
      const win = winResult.win
      const winType = winResult.winType
      const winItem = winResult.winItem
      
      setLastWin(win)
      
      // Определяем тип эффекта
      let effectType = 'win'
      if (winType === 'triple') {
        effectType = 'jackpot'
      } else if (winType === 'double') {
        effectType = 'big-win'
      } else if (win > 0) {
        effectType = 'win'
      }
      
      // Проверяем на большой выигрыш (3 или 2 одинаковых)
      const isBigWin = winType === 'triple' || winType === 'double'
      
      if (win > 0 || winType === 'triple' || winType === 'double') {
        setWinStreak(prev => prev + 1)
        setParticleType(effectType)
        setShowParticles(true)
      } else {
        setWinStreak(0)
      }
      
      onPlay({
        symbols: result,
        symbol: result[1],
        win: win,
        isBigWin: isBigWin,
        currency: selectedCurrency,
        cost: gameCost[selectedCurrency],
        winType: winType,
        winItem: winItem,
        currencySymbol: currencySymbol,
        usedFreeSpin: usedFreeSpin
      })
    }

    // Анимация для каждого слота с замедлением
    const animateSlot = (slotIndex, stopDelay) => {
      const startTime = Date.now()
      const duration = baseDuration + stopDelay
      const slowDownStart = duration * 0.7 // Начинаем замедление на 70% прогресса
      
      // Добавляем класс замедления через некоторое время
      const slowDownTimer = setTimeout(() => {
        setSlotStates(prev => {
          const newStates = [...prev]
          newStates[slotIndex] = {
            ...newStates[slotIndex],
            isSlowing: true
          }
          return newStates
        })
      }, slowDownStart)
      timers.push(slowDownTimer)
      
      // Останавливаем слот в нужное время
      const stopTimer = setTimeout(() => {
        setSlotStates(prev => {
          const newStates = [...prev]
          newStates[slotIndex] = {
            isSpinning: false,
            currentSymbol: generatedResult[slotIndex],
            finalSymbol: generatedResult[slotIndex],
            isSlowing: false
          }
          return newStates
        })
        
        // Обновляем результат
        setResult(prev => {
          const newResult = [...prev]
          newResult[slotIndex] = generatedResult[slotIndex]
          return newResult
        })

        // Если это последний слот, завершаем спин
        if (slotIndex === 2) {
          setTimeout(() => {
            finishGame(generatedResult, willUseFreeSpin)
          }, 500)
        }
      }, duration)
      timers.push(stopTimer)
    }

    // Запускаем анимацию для всех слотов
    stopDelays.forEach((delay, index) => {
      const startTimer = setTimeout(() => animateSlot(index, delay), delay)
      timers.push(startTimer)
    })
    
    setAnimationTimers(timers)
  }

  // Функция пропуска анимации
  const skipAnimation = () => {
    if (!spinning || !finalResult) return
    
    // Очищаем все таймеры
    animationTimers.forEach(timer => clearTimeout(timer))
    setAnimationTimers([])
    
    // Немедленно останавливаем все слоты
    setSlotStates([
      { isSpinning: false, currentSymbol: finalResult[0], finalSymbol: finalResult[0], isSlowing: false },
      { isSpinning: false, currentSymbol: finalResult[1], finalSymbol: finalResult[1], isSlowing: false },
      { isSpinning: false, currentSymbol: finalResult[2], finalSymbol: finalResult[2], isSlowing: false }
    ])
    
    setResult(finalResult)
    
    // Завершаем игру
    setTimeout(() => {
      const winResult = calculateWin(finalResult)
      const win = winResult.win
      const winType = winResult.winType
      const winItem = winResult.winItem
      const currencySymbol = winResult.currencySymbol
      
      setLastWin(win)
      
      let effectType = 'win'
      if (winType === 'triple') {
        effectType = 'jackpot'
      } else if (winType === 'double') {
        effectType = 'big-win'
      } else if (winType === 'currency') {
        effectType = 'big-win'
      } else if (win > 0) {
        effectType = 'win'
      }
      
      const isBigWin = winType === 'triple' || winType === 'double'
      
      if (win > 0 || winType === 'triple' || winType === 'double' || winType === 'currency') {
        setWinStreak(prev => prev + 1)
        setParticleType(effectType)
        setShowParticles(true)
      } else {
        setWinStreak(0)
      }
      
      setSpinning(false)
      
      onPlay({
        symbols: finalResult,
        symbol: finalResult[1],
        win: win,
        isBigWin: isBigWin,
        currency: selectedCurrency,
        cost: gameCost[selectedCurrency],
        winType: winType,
        winItem: winItem,
        currencySymbol: currencySymbol,
        usedFreeSpin: currentFreeSpinUsed
      })
      
      setCurrentFreeSpinUsed(false)
    }, 100)
  }

  const calculateWin = (symbols) => {
    let baseWin = 0
    let winType = 'none' // 'triple', 'double', 'single', 'none'
    let winItem = null
    
    console.log('calculateWin - symbols:', symbols)
    
    // Все три одинаковые
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      // Если это валюта - даем валюту, иначе предмет
      if (symbols[0] === 'ruby' || symbols[0] === 'shield') {
        winType = 'currency'
        const multipliers = {
          ruby: 200, // Кристаллы
          shield: 150 // Щиты
        }
        baseWin = Math.floor(Math.random() * multipliers[symbols[0]]) + multipliers[symbols[0]]
      } else {
        winType = 'triple'
        winItem = symbols[0] // Предмет выигран
        console.log('✅ TRIPLE WIN! Item:', winItem)
        // Предметы не дают валюту, только предмет
        baseWin = 0
      }
    }
    // Две одинаковые
    else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
      // Определяем какой символ совпадает
      let sameSymbol = null
      if (symbols[0] === symbols[1]) {
        sameSymbol = symbols[0]
      } else if (symbols[1] === symbols[2]) {
        sameSymbol = symbols[1]
      } else if (symbols[0] === symbols[2]) {
        sameSymbol = symbols[0]
      }
      
      // Если это валюта - даем валюту, иначе предмет
      if (sameSymbol === 'ruby' || sameSymbol === 'shield') {
        winType = 'currency'
        const multipliers = {
          ruby: 100, // Кристаллы
          shield: 80 // Щиты
        }
        baseWin = Math.floor(Math.random() * multipliers[sameSymbol]) + multipliers[sameSymbol]
      } else {
        winType = 'double'
        winItem = sameSymbol // Предмет выигран
        console.log('✅ DOUBLE WIN! Item:', winItem, 'Symbols:', symbols)
        // Предметы не дают валюту, только предмет
        baseWin = 0
      }
    }
    // Валютные символы (рубины или щиты) - дают валюту
    else if (symbols[0] === 'ruby' || symbols[0] === 'shield') {
      winType = 'currency'
      const multipliers = {
        ruby: 50, // Кристаллы
        shield: 30 // Щиты
      }
      baseWin = Math.floor(Math.random() * multipliers[symbols[0]]) + multipliers[symbols[0]]
    }
    // Один особый символ в первом барабане - ВАЛЮТА (маленький выигрыш)
    else if (symbols[0] === 'rosh' || symbols[0] === 'bless' || symbols[0] === 'treasure') {
      winType = 'single'
      const multipliers = {
        rosh: 50,
        treasure: 30,
        bless: 25
      }
      baseWin = Math.floor(Math.random() * multipliers[symbols[0]]) + multipliers[symbols[0]]
    }
    // Нет совпадений - маленький выигрыш или проигрыш
    else {
      baseWin = Math.random() > 0.4 ? Math.floor(Math.random() * 20) : 0
    }

    // Применяем бонусы уровня только к валюте
    let finalWin = baseWin
    if (levelBonuses && baseWin > 0) {
      finalWin = Math.floor(finalWin * levelBonuses.winMultiplier)
    }

    // Определяем currencySymbol для валютных выигрышей
    let currencySymbol = null
    if (winType === 'currency') {
      // Если все три одинаковые валютные символы
      if (symbols[0] === symbols[1] && symbols[1] === symbols[2] && (symbols[0] === 'ruby' || symbols[0] === 'shield')) {
        currencySymbol = symbols[0]
      }
      // Если два одинаковые валютные символы
      else if ((symbols[0] === symbols[1] && (symbols[0] === 'ruby' || symbols[0] === 'shield')) ||
               (symbols[1] === symbols[2] && (symbols[1] === 'ruby' || symbols[1] === 'shield')) ||
               (symbols[0] === symbols[2] && (symbols[0] === 'ruby' || symbols[0] === 'shield'))) {
        if (symbols[0] === symbols[1] && (symbols[0] === 'ruby' || symbols[0] === 'shield')) {
          currencySymbol = symbols[0]
        } else if (symbols[1] === symbols[2] && (symbols[1] === 'ruby' || symbols[1] === 'shield')) {
          currencySymbol = symbols[1]
        } else if (symbols[0] === symbols[2] && (symbols[0] === 'ruby' || symbols[0] === 'shield')) {
          currencySymbol = symbols[0]
        }
      }
      // Если один валютный символ в первом барабане
      else if (symbols[0] === 'ruby' || symbols[0] === 'shield') {
        currencySymbol = symbols[0]
      }
    }

    return {
      win: finalWin,
      winType,
      winItem,
      currencySymbol
    }
  }

  useEffect(() => {
    if (showParticles) {
      const timer = setTimeout(() => {
        setShowParticles(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showParticles])

  return (
    <div className="game-panel">
      <ParticleEffect type={particleType} active={showParticles} />
      
      <div className="game-symbols">
        {slotStates.map((slotState, index) => {
          const displaySymbol = slotState.currentSymbol || slotState.finalSymbol || result[index]
          const isWin = result[0] === result[1] && result[1] === result[2] && result[0] === displaySymbol && !slotState.isSpinning
          
          return (
            <div 
              key={`slot-${index}-${slotState.finalSymbol || 'empty'}-${slotState.isSpinning ? 'spinning' : 'stopped'}`} 
              className={`symbol-slot ${slotState.isSpinning ? 'spinning' : ''} ${slotState.isSlowing ? 'slowing' : ''} ${isWin ? 'win' : ''} slot-${index}`}
            >
              {slotState.isSpinning ? (
                <div className="symbol-reel">
                  {/* Создаем несколько копий символов для бесконечной прокрутки */}
                  {[...Array(6)].map((_, reelIndex) => 
                    symbolKeys.map((symbolKey, i) => {
                      const symbol = GAME_SYMBOLS[symbolKey]
                      return (
                        <div 
                          key={`slot-${index}-reel-${reelIndex}-symbol-${i}-${symbolKey}`}
                          className="symbol-reel-item"
                          style={{ 
                            color: symbol.color,
                            top: `${(reelIndex * symbolKeys.length + i) * 100}%`
                          }}
                        >
                          <img 
                            src={symbol.getRandomImage()} 
                            alt={symbol.name}
                            className="symbol-image"
                          />
                        </div>
                      )
                    })
                  )}
                </div>
              ) : displaySymbol ? (
                <div 
                  className="symbol"
                  style={{ color: GAME_SYMBOLS[displaySymbol]?.color || '#fff' }}
                >
                  <img 
                    src={GAME_SYMBOLS[displaySymbol]?.getRandomImage()} 
                    alt={GAME_SYMBOLS[displaySymbol]?.name || 'Symbol'}
                    className="symbol-image"
                  />
                  <span className="symbol-name">{GAME_SYMBOLS[displaySymbol]?.name || displaySymbol}</span>
                </div>
              ) : (
                <div className="symbol-placeholder">?</div>
              )}
            </div>
          )
        })}
      </div>

      <div className="game-flames"></div>

      <div className="game-bottom-bar">
        <div className="bottom-left">
          <div className="info-and-currency">
            <div
              className="info-button-wrapper"
              onMouseEnter={() => updateInfoPanel(true)}
              onMouseLeave={() => updateInfoPanel(false)}
            >
              <button 
                className={`info-button ${infoPanelActive ? 'active' : ''}`}
                onClick={() => updateInfoPanel(!infoPanelActive)}
                aria-label="Информация"
              >
                <img src={infoIcon} alt="Info" />
              </button>
              {!isInfoControlled && infoPanelActive && (
                <div className="info-panel">
                  <h4>Правила Dragon Jackpot</h4>
                  <ul>
                    <li>Выбирай валюту (кристаллы или щиты) — стоимость указана на кнопке.</li>
                    <li>3 одинаковых предмета → эксклюзивная награда в казино-инвентаре.</li>
                    <li>2 одинаковых предмета → предмет среднего уровня.</li>
                    <li>Спец-символ в первом барабане → мгновенный валютный бонус.</li>
                    <li>Выигранные предметы можно забрать в инвентарь или обменять на бесплатные спины.</li>
                  </ul>
                  <p className="info-panel-tip">5% от каждой ставки пополняет общий джекпот.</p>
                </div>
              )}
            </div>
            <div className="currency-control">
              <div className="currency-control-left">
                <span className="currency-compact-label">Валюта</span>
                <div className="currency-compact-buttons">
                <button
                    className={`currency-compact-button ${selectedCurrency === 'diamonds' ? 'active' : ''}`}
                    onClick={() => {
                      if (onCurrencyChange) {
                        onCurrencyChange('diamonds')
                      } else {
                        setInternalCurrency('diamonds')
                      }
                    }}
                    disabled={spinning}
                  >
                    <img src={currencyRuby} alt="Рубины" />
                  <div className="currency-button-info">
                    <span className="currency-cost">{gameCost.diamonds} / спин</span>
                  </div>
                  </button>
                  <button
                    className={`currency-compact-button ${selectedCurrency === 'shields' ? 'active' : ''}`}
                    onClick={() => {
                      if (onCurrencyChange) {
                        onCurrencyChange('shields')
                      } else {
                        setInternalCurrency('shields')
                      }
                    }}
                    disabled={spinning}
                  >
                    <img src={currencyShield} alt="Щиты" />
                  <div className="currency-button-info">
                    <span className="currency-cost">{gameCost.shields} / спин</span>
                  </div>
                  </button>
                </div>
              </div>
            </div>
            {freeSpins > 0 && (
              <div className="free-spins-indicator compact">
                🎁 {freeSpins}
              </div>
            )}
          </div>
          {freeSpins > 0 && infoPanelActive && (
            <div className="free-spins-note">
              Бесплатные спины автоматически тратятся при нехватке валюты.
            </div>
          )}
          {!isInfoControlled && infoPanelActive && (
            <div className="info-panel">
              <p>Дважды одинаковые символы — награда предметом.</p>
              <p>Тройной матч — эксклюзивный дроп.</p>
              <p>Валюта в барабане приносит моментальные бонусы.</p>
            </div>
          )}
        </div>

        <div className="bottom-right">
          {spinning ? (
            <button 
              className="skip-button full"
              onClick={skipAnimation}
            >
              ⏩ Пропустить
            </button>
          ) : (
            <button 
              className={`play-button ${!canPlay ? 'disabled' : ''} ${freeSpins > 0 ? 'free-spin-available' : ''}`}
              onClick={spin}
              disabled={!canPlay}
            >
              {freeSpins > 0 ? `ИГРАТЬ (${freeSpins} 🎁)` : 'ИГРАТЬ'}
            </button>
          )}
        </div>
      </div>

      {lastWin > 0 && (
        <div className={`win-message ${lastWin >= 5000 ? 'big-win' : lastWin >= 2000 ? 'medium-win' : ''}`}>
          {lastWin >= 5000 ? '🎉' : lastWin >= 2000 ? '🎊' : '🎁'} 
          Вы выиграли: {lastWin.toLocaleString()}!
        </div>
      )}
    </div>
  )
}

export default GamePanel

