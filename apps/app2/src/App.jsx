import { useState, useEffect, useRef } from 'react'
import './App.css'
import './styles/enhancedAnimations.css'
import JackpotHeader from './components/JackpotHeader'
import WinnersList from './components/WinnersList'
import GamePanel from './components/GamePanel'
import DragonProgress from './components/DragonProgress'
import GameStats from './components/GameStats'
import PrizeModal from './components/PrizeModal'
import PlayerInfoPanel from './components/PlayerInfoPanel'
import UnifiedInventoryPanel from './components/UnifiedInventoryPanel'
import AchievementNotification from './components/AchievementNotification'
import ItemWinNotification from './components/ItemWinNotification'
import { PlayerProgression } from './systems/PlayerProgression'
import { AchievementSystem, ACHIEVEMENTS } from './systems/AchievementSystem'
import { ComboSystem } from './systems/ComboSystem'
import { InventorySystem } from './systems/InventorySystem'
import { CasinoInventorySystem } from './systems/CasinoInventorySystem'
import ParticleBackground from './components/ParticleBackground'

const avatarImports = import.meta.glob('./assets/images/avatar/*.png', {
  eager: true,
  import: 'default'
})
const AVATAR_IMAGES = Object.values(avatarImports)

const getRandomAvatar = () => {
  if (!AVATAR_IMAGES.length) return null
  return AVATAR_IMAGES[Math.floor(Math.random() * AVATAR_IMAGES.length)]
}

function App() {
  // Игровые системы
  const progressionRef = useRef(new PlayerProgression())
  const achievementRef = useRef(new AchievementSystem())
  const comboRef = useRef(new ComboSystem())
  const inventoryRef = useRef(new InventorySystem())
  const casinoInventoryRef = useRef(new CasinoInventorySystem())

  const [jackpot, setJackpot] = useState(125430)
  const [diamonds, setDiamonds] = useState(100)
  const [shields, setShields] = useState(500)
  const [mainPrizeProgress, setMainPrizeProgress] = useState(85)
  const [artifactProgress, setArtifactProgress] = useState(34)
  const [gameHistory, setGameHistory] = useState([])
  const [totalGames, setTotalGames] = useState(0)
  const [totalWins, setTotalWins] = useState(0)
  const [biggestWin, setBiggestWin] = useState(0)
  const [maxWinStreak, setMaxWinStreak] = useState(0)
  const [currentWinStreak, setCurrentWinStreak] = useState(0)
  const [jackpotWins, setJackpotWins] = useState(0)
  const [perfectMatches, setPerfectMatches] = useState(0)
  const [maxJackpot, setMaxJackpot] = useState(125430)
  
  const [showMainPrizeModal, setShowMainPrizeModal] = useState(false)
  const [showArtifactModal, setShowArtifactModal] = useState(false)
  const [newAchievement, setNewAchievement] = useState(null)
  const [itemWinNotification, setItemWinNotification] = useState(null)
  const [levelUpData, setLevelUpData] = useState(null)
  const [progressionState, setProgressionState] = useState(null)
  const [comboState, setComboState] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState('diamonds')
  const [inventoryUpdate, setInventoryUpdate] = useState(0) // Для обновления UI инвентаря
  const [casinoInventoryUpdate, setCasinoInventoryUpdate] = useState(0) // Для обновления UI инвентаря казино
  const [freeSpins, setFreeSpins] = useState(0) // Бесплатные спины
  const [showInfoOverlay, setShowInfoOverlay] = useState(false)
  
  const addWinnerAvatar = (entry) => ({
    avatar: getRandomAvatar(),
    ...entry
  })

  const [winners, setWinners] = useState(() => [
    { name: 'Magnus', icon: '💎', amount: 12500 },
    { name: 'Aurelius', icon: '🛡️', amount: 8900 },
    { name: 'Stormlight', icon: '📜', amount: 6700 },
    { name: 'Ravenna', icon: '📜', amount: 5400 },
  ].map(addWinnerAvatar))

  // Инициализация систем
  useEffect(() => {
    // Загрузка сохраненных данных
    const savedProgression = localStorage.getItem('playerProgression')
    const savedAchievements = localStorage.getItem('achievements')
    const savedCombo = localStorage.getItem('combo')
    const savedInventory = localStorage.getItem('inventory')
    const savedCasinoInventory = localStorage.getItem('casinoInventory')
    const savedFreeSpins = localStorage.getItem('freeSpins')
    
    if (savedProgression) {
      progressionRef.current.load(JSON.parse(savedProgression))
    }
    if (savedAchievements) {
      achievementRef.current.load(JSON.parse(savedAchievements))
    }
    if (savedCombo) {
      comboRef.current.load(JSON.parse(savedCombo))
    }
    if (savedInventory) {
      inventoryRef.current.load(JSON.parse(savedInventory))
    }
    if (savedCasinoInventory) {
      casinoInventoryRef.current.load(JSON.parse(savedCasinoInventory))
    }
    if (savedFreeSpins) {
      setFreeSpins(parseInt(savedFreeSpins) || 0)
    }

    // Обновление состояния прогрессии
    updateProgressionState()
    updateComboState()
  }, [])

  // Обновление состояния прогрессии
  const updateProgressionState = () => {
    const prog = progressionRef.current
    setProgressionState({
      level: prog.level,
      experience: prog.experience,
      experienceToNextLevel: prog.experienceToNextLevel
    })
  }

  // Обновление состояния комбо
  const updateComboState = () => {
    setComboState(comboRef.current.getComboState())
  }

  // Сохранение данных
  useEffect(() => {
    localStorage.setItem('playerProgression', JSON.stringify(progressionRef.current.save()))
    localStorage.setItem('achievements', JSON.stringify(achievementRef.current.save()))
    localStorage.setItem('combo', JSON.stringify(comboRef.current.save()))
    localStorage.setItem('inventory', JSON.stringify(inventoryRef.current.save()))
    localStorage.setItem('casinoInventory', JSON.stringify(casinoInventoryRef.current.save()))
    localStorage.setItem('freeSpins', freeSpins.toString())
  }, [progressionState, comboState, freeSpins])

  // Увеличиваем джекпот каждые 5 секунд (симуляция)
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 10) + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePlay = (result) => {
    setTotalGames(prev => prev + 1)
    
    // Обновляем джекпот (5% от ставки идет в банк)
    const betAmount = result.cost || (result.currency === 'diamonds' ? 2 : 20)
    const jackpotIncrease = Math.floor(betAmount * 0.05)
    setJackpot(prev => {
      const newJackpot = prev + jackpotIncrease
      setMaxJackpot(prevMax => Math.max(prevMax, newJackpot))
      return newJackpot
    })

    // Система комбо
    if (result.win > 0) {
      const comboResult = comboRef.current.processWin(result.win)
      updateComboState()
      
      // Применяем бонус комбо к выигрышу
      if (comboResult.bonusWin > 0) {
        result.win += comboResult.bonusWin
      }
    } else {
      comboRef.current.processLoss()
      updateComboState()
    }

    // Обработка выигрыша предмета (должна быть вне условия result.win > 0, т.к. предметы дают win = 0)
    console.log('Processing win result:', result)
    if ((result.winType === 'triple' || result.winType === 'double') && result.winItem) {
      // 3 или 2 одинаковых = ПРЕДМЕТ в инвентарь казино
      const itemType = result.winItem
      console.log('✅ WIN DETECTED! Adding item to casino inventory:', itemType, 'winType:', result.winType)
      
      if (casinoInventoryRef.current && itemType) {
        const added = casinoInventoryRef.current.addItem(itemType, 1)
        console.log('addItem returned:', added)
        setCasinoInventoryUpdate(prev => prev + 1)
        const totalItems = casinoInventoryRef.current.getTotalItemsCount()
        const allItems = casinoInventoryRef.current.getAllItems()
        console.log('Item added. Total items:', totalItems, 'All items:', allItems)
        
        // Показываем уведомление о выигрыше предмета
        const notificationData = {
          itemType: itemType,
          quantity: 1
        }
        console.log('Setting itemWinNotification:', notificationData)
        setItemWinNotification(notificationData)
        console.log('Notification state set! itemType:', itemType)
      } else {
        console.error('❌ Cannot add item - casinoInventoryRef:', casinoInventoryRef.current, 'itemType:', itemType)
      }
      
      // Добавляем в лучшие выигрыши
        setWinners(prev => [
          addWinnerAvatar({ 
            name: 'Player', 
            itemType: itemType,
            quantity: 1,
            amount: 0,
            currency: selectedCurrency
          }),
          ...prev.slice(0, 3)
        ])
      
      // Для предметов тоже считаем это выигрышем
      setTotalWins(prev => prev + 1)
      setCurrentWinStreak(prev => {
        const newStreak = prev + 1
        setMaxWinStreak(prevMax => Math.max(prevMax, newStreak))
        return newStreak
      })
      
      // Проверка на идеальное совпадение
      if (result.isBigWin) {
        setPerfectMatches(prev => prev + 1)
      }
      
      // Система прогрессии - добавляем опыт за выигрыш предмета
      const progression = progressionRef.current
      const bonuses = progression.getLevelBonuses()
      const baseExp = progression.getExperienceForGame(100, betAmount, result.isBigWin) // Даем опыт как за выигрыш 100
      const expWithBonus = Math.floor(baseExp * bonuses.experienceMultiplier)
      const levelUpResult = progression.addExperience(expWithBonus)
      
      if (levelUpResult.leveledUp) {
        setLevelUpData(levelUpResult)
        
        // Выдаем награды за повышение уровня
        if (levelUpResult.rewards) {
          if (levelUpResult.rewards.diamonds > 0) {
            setDiamonds(prev => prev + levelUpResult.rewards.diamonds)
          }
          if (levelUpResult.rewards.freeSpins > 0) {
            setFreeSpins(prev => prev + levelUpResult.rewards.freeSpins)
          }
        }
      }
      
      updateProgressionState()
    }
    
    if (result.win > 0) {
      setTotalWins(prev => prev + 1)
      setBiggestWin(prev => Math.max(prev, result.win))
      setCurrentWinStreak(prev => {
        const newStreak = prev + 1
        setMaxWinStreak(prevMax => Math.max(prevMax, newStreak))
        return newStreak
      })

      // Проверка на джекпот
      if (result.win >= 10000) {
        setJackpotWins(prev => prev + 1)
      }

      // Проверка на идеальное совпадение
      if (result.isBigWin) {
        setPerfectMatches(prev => prev + 1)
      }

      // Система прогрессии - добавляем опыт
      const progression = progressionRef.current
      const bonuses = progression.getLevelBonuses()
      
      const baseExp = progression.getExperienceForGame(result.win, betAmount, result.isBigWin)
      const expWithBonus = Math.floor(baseExp * bonuses.experienceMultiplier)
      const levelUpResult = progression.addExperience(expWithBonus)
      
      if (levelUpResult.leveledUp) {
        setLevelUpData(levelUpResult)
        
        // Выдаем награды за повышение уровня
        if (levelUpResult.rewards) {
          if (levelUpResult.rewards.diamonds > 0) {
            setDiamonds(prev => prev + levelUpResult.rewards.diamonds)
          }
          if (levelUpResult.rewards.freeSpins > 0) {
            setFreeSpins(prev => prev + levelUpResult.rewards.freeSpins)
          }
        }
      }
      
      updateProgressionState()

      // Проверка достижений
      const stats = {
        totalGames,
        totalWins: totalWins + 1,
        biggestWin: Math.max(biggestWin, result.win),
        maxWinStreak,
        jackpotWins,
        perfectMatches: result.isBigWin ? perfectMatches + 1 : perfectMatches,
        maxJackpot,
        consecutiveDays: 0
      }
      
      const newAchievements = achievementRef.current.checkAchievements(stats)
      if (newAchievements.length > 0) {
        setNewAchievement(newAchievements[0])
        const rewards = achievementRef.current.claimRewards()
        setDiamonds(prev => prev + rewards.diamonds)
        setShields(prev => prev + rewards.shields)
      }
      
      if (result.win > 0) {
        // Обработка валютных символов (рубины или щиты) в первом барабане
        if (result.winType === 'currency' && result.currencySymbol) {
          const currencyAmount = result.win
          if (result.currencySymbol === 'ruby') {
            setDiamonds(prev => prev + currencyAmount)
            console.log('✅ Currency win - added', currencyAmount, 'diamonds')
          } else if (result.currencySymbol === 'shield') {
            setShields(prev => prev + currencyAmount)
            console.log('✅ Currency win - added', currencyAmount, 'shields')
          }
        }
        // 1 особый в первом = ВАЛЮТА (обычная валюта)
        else {
          const currencyAmount = Math.floor(result.win / (selectedCurrency === 'diamonds' ? 100 : 50))
          
          if (currencyAmount > 0) {
            if (selectedCurrency === 'diamonds') {
              setDiamonds(prev => prev + currencyAmount)
            } else {
              setShields(prev => prev + currencyAmount)
            }
          }
        }
        
        // Добавляем в лучшие выигрыши только если достаточно большой
        if (result.win >= 1000) {
          setWinners(prev => [
            addWinnerAvatar({ 
              name: 'Player', 
              icon: selectedCurrency === 'diamonds' ? '💎' : '🛡️',
              amount: result.win 
            }),
            ...prev.slice(0, 3)
          ])
        }
      }

      // Обновляем прогресс (больше прогресс за большие выигрыши)
      const progressIncrease = result.isBigWin ? 2 : 0.5
      setMainPrizeProgress(prev => {
        const newProgress = Math.min(100, prev + progressIncrease)
        if (newProgress >= 100 && prev < 100) {
          // Эффект при достижении 100%
          setTimeout(() => {
            setShowMainPrizeModal(true)
            setMainPrizeProgress(0) // Сброс для следующего цикла
          }, 500)
        }
        return newProgress
      })
      
      const artifactIncrease = result.isBigWin ? 1.5 : 0.3
      setArtifactProgress(prev => {
        const newProgress = Math.min(100, prev + artifactIncrease)
        if (newProgress >= 100 && prev < 100) {
          setTimeout(() => {
            setShowArtifactModal(true)
            setArtifactProgress(0)
          }, 500)
        }
        return newProgress
      })
    }

    // Добавляем в историю
    setGameHistory(prev => [
      {
        id: Date.now(),
        symbols: result.symbols,
        win: result.win,
        timestamp: new Date()
      },
      ...prev.slice(0, 9) // Храним последние 10 игр
    ])

    // Обновляем валюту (списываем ставку только если не использован бесплатный спин)
    const currency = result.currency || 'diamonds'
    const cost = result.cost || (currency === 'diamonds' ? 2 : 20)
    const usedFreeSpin = result.usedFreeSpin || false
    
    // Списываем только стоимость игры, если не использован бесплатный спин
    if (!usedFreeSpin) {
      if (currency === 'diamonds') {
        setDiamonds(prev => Math.max(0, prev - cost))
      } else {
        setShields(prev => Math.max(0, prev - cost))
      }
    }
    
    // Валюта уже обработана выше для маленьких выигрышей

    // Сбрасываем серию при проигрыше
    if (result.win === 0) {
      setCurrentWinStreak(0)
    }
  }


  // Обработка обмена предмета (из инвентаря игрока)
  const handleItemExchange = (itemType, currency, quantity) => {
    const exchangeResult = inventoryRef.current.exchangeItem(itemType, currency, quantity)
    
    if (exchangeResult) {
      if (currency === 'diamonds') {
        setDiamonds(prev => prev + exchangeResult.amount)
      } else {
        setShields(prev => prev + exchangeResult.amount)
      }
      
      // Обновляем инвентарь в UI
      setInventoryUpdate(prev => prev + 1)
    }
  }

  // Забрать предмет из инвентаря казино
  const handleClaimCasinoItem = (itemType, quantity) => {
    const claimed = casinoInventoryRef.current.claimItem(itemType, quantity)
    
    if (claimed) {
      // Добавляем в инвентарь игрока
      inventoryRef.current.addItem(claimed.type, claimed.quantity)
      setCasinoInventoryUpdate(prev => prev + 1)
      setInventoryUpdate(prev => prev + 1)
    }
  }

  // Обменять предмет из казино на бесплатные спины
  const handleExchangeForFreeSpins = (itemType, quantity) => {
    const exchangeResult = casinoInventoryRef.current.exchangeForFreeSpins(itemType, quantity)
    
    if (exchangeResult) {
      setFreeSpins(prev => prev + exchangeResult.spins)
      setCasinoInventoryUpdate(prev => prev + 1)
    }
  }

  return (
    <div className="app">
      <ParticleBackground />
      
      <PlayerInfoPanel
        diamonds={diamonds}
        shields={shields}
        progression={progressionState}
        onLevelUp={levelUpData}
      />
      
      <JackpotHeader jackpot={jackpot} />
      
      {showInfoOverlay && (
        <div className="global-info-overlay" onClick={() => setShowInfoOverlay(false)}>
          <div className="global-info-panel" onClick={(e) => e.stopPropagation()}>
            <button className="global-info-close" onClick={() => setShowInfoOverlay(false)}>×</button>
            <h3>Правила Dragon Jackpot</h3>
            <div className="global-info-content">
              <p>1. Выбирай валюту (кристаллы или щиты) – стоимость указана на кнопке.</p>
              <p>2. Три одинаковых предмета = элитный дроп в казино-инвентарь.</p>
              <p>3. Два одинаковых предмета = предмет среднего уровня.</p>
              <p>4. Спец-символ в первом барабане = мгновенный валютный бонус.</p>
              <p>5. Предметы можно забрать в инвентарь или обменять на бесплатные спины.</p>
              <p>6. 5% от каждой ставки пополняет общий джекпот.</p>
            </div>
          </div>
        </div>
      )}

      <div className="game-container">
        <WinnersList winners={winners} />
        
        <GamePanel 
          diamonds={diamonds}
          shields={shields}
          onPlay={handlePlay}
          levelBonuses={progressionState ? progressionRef.current.getLevelBonuses() : null}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
          freeSpins={freeSpins}
          onFreeSpinUsed={() => setFreeSpins(prev => Math.max(0, prev - 1))}
          infoPanelVisible={showInfoOverlay}
          onInfoPanelChange={setShowInfoOverlay}
        />
        
        <DragonProgress 
          mainPrizeProgress={mainPrizeProgress}
          artifactProgress={artifactProgress}
        />
      </div>

      <UnifiedInventoryPanel
        key={casinoInventoryUpdate}
        casinoInventory={casinoInventoryRef.current}
        playerInventory={inventoryRef.current}
        onClaimItem={handleClaimCasinoItem}
        onExchangeForSpins={handleExchangeForFreeSpins}
        onExchange={handleItemExchange}
        freeSpins={freeSpins}
        selectedCurrency={selectedCurrency}
      />

      <GameStats 
        totalGames={totalGames}
        totalWins={totalWins}
        biggestWin={biggestWin}
        gameHistory={gameHistory}
      />
      
      <AchievementNotification
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
      
      {itemWinNotification && (
        <ItemWinNotification
          itemType={itemWinNotification.itemType}
          quantity={itemWinNotification.quantity || 1}
          onClose={() => {
            console.log('Closing notification')
            setItemWinNotification(null)
          }}
        />
      )}
      
      <PrizeModal 
        type="main" 
        isOpen={showMainPrizeModal} 
        onClose={() => setShowMainPrizeModal(false)} 
      />
      
      <PrizeModal 
        type="artifact" 
        isOpen={showArtifactModal} 
        onClose={() => setShowArtifactModal(false)} 
      />
    </div>
  )
}

export default App
