import { useState, useMemo } from 'react'
import './TalentsTab.css'
import currencyRuby from '../assets/images/currency_ruby.png'
import { guildConfig } from '../config/guildConfig'

/**
 * Компонент вкладки "Таланты гильдии" - AAA уровень
 * 
 * Концепция: таланты - пассивные постоянные бонусы, работающие все одновременно.
 * Прокачка за очки гильдии (GP) и донатную валюту (кристаллы).
 * Максимальный уровень таланта ограничен уровнем гильдии.
 */
function TalentsTab() {
  // Состояние выбранного таланта для отображения деталей
  const [selectedTalent, setSelectedTalent] = useState('bossGold')
  // Поиск талантов
  const [searchQuery, setSearchQuery] = useState('')
  // Tooltip для талантов
  const [hoveredTalent, setHoveredTalent] = useState(null)
  // Фильтр по доступности
  const [filterByAvailability, setFilterByAvailability] = useState('all') // 'all', 'available', 'maxed', 'locked'
  // Сортировка
  const [sortBy, setSortBy] = useState('default') // 'default', 'level', 'cost', 'efficiency', 'name'
  
  // Получаем данные гильдии из конфига
  const [guildInfo, setGuildInfo] = useState({
    level: guildConfig.guild.level,
    currentXP: guildConfig.guild.currentExp,
    requiredXP: guildConfig.guild.expToNextLevel,
    guildPoints: guildConfig.guild.points
  })

  // Состояние уровней талантов (в реальном приложении загружается с сервера)
  const [talentLevels, setTalentLevels] = useState({
    bossGold: 0,
    bossExp: 0,
    equipmentChance: 0,
    attributesPerLevel: 0,
    doubleBuffChance: 0,
    forgeEnhanceChance: 0,
    buybackDiscount: 0,
    startingAegis: 0,
    guildPower: 0 // Эндо-талант
  })

  // Состояние премиум-валюты (кристаллы) - в реальном приложении загружается с сервера
  const [premiumCurrency, setPremiumCurrency] = useState(500)
  // Анимация улучшения
  const [upgradeAnimation, setUpgradeAnimation] = useState(null)
  // Информация о накоплении GP (в реальном приложении загружается с сервера)
  const [gpContributionInfo, setGpContributionInfo] = useState({
    totalMembers: guildConfig.totalMembers,
    activeMembers: 45, // Активные игроки за последние 7 дней
    weeklyGpGain: 15000, // GP получено за неделю
    dailyGpGain: 2143 // Средний GP в день
  })

  /**
   * Вычисляет максимальный уровень таланта на основе уровня гильдии
   * Правило: максимальный уровень = уровень гильдии / 2 (округление вниз)
   * Для эндо-талантов ограничение не применяется
   */
  const getMaxTalentLevel = (talent) => {
    if (talent.isEndless) {
      return Infinity // Эндо-талант без ограничений
    }
    return Math.floor(guildInfo.level / 2)
  }

  /**
   * Вычисляет требуемый уровень гильдии для следующего уровня таланта
   */
  const getRequiredGuildLevel = (talent, nextLevel) => {
    if (talent.isEndless) {
      // Для эндо-талантов требование растёт быстрее
      return Math.ceil(nextLevel / 2) * 2
    }
    return talent.requiredGuildLevels[nextLevel - 1] || 0
  }

  /**
   * Получает описание бонуса для уровня
   */
  const getBonusDescription = (talent, level) => {
    if (level === 0) return 'Нет бонуса'
    
    if (talent.isEndless) {
      // Эндо-талант: маленький процентный бонус (улучшено для баланса)
      const bonus = (level * 0.05).toFixed(1)
      return `+${bonus}% ко всем бонусам гильдии`
    }
    
    const bonusValue = talent.bonusValues[level - 1]
    return `+${bonusValue}${talent.bonusUnit}`
  }

  /**
   * Вычисляет время до накопления нужного количества GP (в днях)
   */
  const getDaysToAfford = (costGP) => {
    if (gpContributionInfo.dailyGpGain === 0) return Infinity
    return Math.ceil(costGP / gpContributionInfo.dailyGpGain)
  }

  /**
   * Получает стоимость улучшения в GP
   */
  const getUpgradeCostGP = (talent, level) => {
    if (talent.isEndless) {
      // Эндо-талант: экспоненциальный рост стоимости (сбалансировано)
      // Базовая стоимость 1000, множитель 1.5
      return Math.floor(1000 * Math.pow(1.5, level))
    }
    return talent.upgradeCostsGP[level] || 0
  }

  /**
   * Получает стоимость улучшения в кристаллах
   */
  const getUpgradeCostPremium = (talent, level) => {
    if (talent.isEndless) {
      // Эндо-талант: экспоненциальный рост стоимости (сбалансировано)
      // Базовая стоимость 50, множитель 1.3 (более медленный рост)
      return Math.floor(50 * Math.pow(1.3, level))
    }
    return talent.upgradeCostsPremium[level] || 0
  }

  /**
   * Вычисляет эффективность таланта (бонус на единицу стоимости)
   */
  const getTalentEfficiency = (talent, level) => {
    if (level === 0) return 0
    const costGP = getUpgradeCostGP(talent, level - 1)
    if (costGP === 0) return Infinity
    
    if (talent.isEndless) {
      const bonus = level * 0.05
      return bonus / costGP
    }
    
    const bonusValue = talent.bonusValues[level - 1] || 0
    return bonusValue / costGP
  }

  // Определение всех талантов (должно быть до использования в useMemo)
  const talents = [
    { 
      id: 'bossGold', 
      name: 'Золото за убийство босса', 
      icon: '💰', 
      description: 'Дополнительное золото за убийство босса',
      fullDescription: 'При смерти босса вы получаете дополнительное золото. Каждый уровень увеличивает количество получаемого золота.',
      maxLevel: 10,
      isEndless: false,
      bonusValues: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      upgradeCostsGP: [50, 100, 150, 250, 350, 450, 600, 800, 1100, 1400],
      upgradeCostsPremium: [10, 15, 20, 30, 40, 50, 50, 50, 50, 50],
      requiredGuildLevels: [0, 5, 10, 15, 20, 30, 40, 50, 60, 70],
      bonusUnit: ' золота'
    },
    { 
      id: 'bossExp', 
      name: 'Опыта за убийство босса', 
      icon: '⭐', 
      description: 'Дополнительный опыт за убийство босса',
      fullDescription: 'При смерти босса вы получаете дополнительный опыт. Каждый уровень увеличивает количество получаемого опыта.',
      maxLevel: 10,
      isEndless: false,
      bonusValues: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      upgradeCostsGP: [50, 100, 150, 250, 350, 450, 600, 800, 1100, 1400],
      upgradeCostsPremium: [10, 15, 20, 30, 40, 50, 50, 50, 50, 50],
      requiredGuildLevels: [0, 5, 10, 15, 20, 30, 40, 50, 60, 70],
      bonusUnit: ' опыта'
    },
    { 
      id: 'equipmentChance', 
      name: 'Шанс получения экипировки', 
      icon: '🎒', 
      description: 'Увеличивает шанс получения экипировки',
      fullDescription: 'Увеличивает шанс получения экипировки при убийстве врагов. Каждый уровень увеличивает шанс на определенный процент.',
      maxLevel: 10,
      isEndless: false,
      bonusValues: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      upgradeCostsGP: [50, 100, 150, 250, 350, 450, 600, 800, 1100, 1400],
      upgradeCostsPremium: [10, 15, 20, 30, 40, 50, 50, 50, 50, 50],
      requiredGuildLevels: [0, 5, 10, 15, 20, 30, 40, 50, 60, 70],
      bonusUnit: '%'
    },
    { 
      id: 'attributesPerLevel', 
      name: 'К каждому атрибуту за уровень', 
      icon: '⚡', 
      description: 'Дополнительные атрибуты за каждый уровень',
      fullDescription: 'При получении уровня вы получаете дополнительные атрибуты ко всем характеристикам. Каждый уровень таланта увеличивает количество получаемых атрибутов.',
      maxLevel: 10,
      isEndless: false,
      bonusValues: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      upgradeCostsGP: [50, 100, 150, 250, 350, 450, 600, 800, 1100, 1400],
      upgradeCostsPremium: [10, 15, 20, 30, 40, 50, 50, 50, 50, 50],
      requiredGuildLevels: [0, 5, 10, 15, 20, 30, 40, 50, 60, 70],
      bonusUnit: ' атрибутов'
    },
    { 
      id: 'doubleBuffChance', 
      name: 'Шанс получить х2 усиленный выбор бафа за убийство босса', 
      icon: '🔥', 
      description: 'Шанс получить двойной усиленный баф при убийстве босса',
      fullDescription: 'При убийстве босса есть шанс получить двойной усиленный выбор бафа. Каждый уровень увеличивает этот шанс.',
      maxLevel: 10,
      isEndless: false,
      bonusValues: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      upgradeCostsGP: [50, 100, 150, 250, 350, 450, 600, 800, 1100, 1400],
      upgradeCostsPremium: [10, 15, 20, 30, 40, 50, 50, 50, 50, 50],
      requiredGuildLevels: [0, 5, 10, 15, 20, 30, 40, 50, 60, 70],
      bonusUnit: '%'
    },
    { 
      id: 'forgeEnhanceChance', 
      name: 'Шанс усиления предмета в кузнице', 
      icon: '🔨', 
      description: 'Увеличивает шанс успешного усиления предмета в кузнице',
      fullDescription: 'Увеличивает шанс успешного усиления предмета при работе в кузнице. Каждый уровень увеличивает вероятность успешного улучшения.',
      maxLevel: 10,
      isEndless: false,
      bonusValues: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
      upgradeCostsGP: [50, 100, 150, 250, 350, 450, 600, 800, 1100, 1400],
      upgradeCostsPremium: [10, 15, 20, 30, 40, 50, 50, 50, 50, 50],
      requiredGuildLevels: [0, 5, 10, 15, 20, 30, 40, 50, 60, 70],
      bonusUnit: '%'
    },
    { 
      id: 'buybackDiscount', 
      name: 'Уменьшение стоимости байбека', 
      icon: '💎', 
      description: 'Снижает стоимость выкупа предметов',
      fullDescription: 'Уменьшает стоимость выкупа (байбека) предметов. Каждый уровень снижает стоимость на определенный процент.',
      maxLevel: 10,
      isEndless: false,
      bonusValues: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
      upgradeCostsGP: [50, 100, 150, 250, 350, 450, 600, 800, 1100, 1400],
      upgradeCostsPremium: [10, 15, 20, 30, 40, 50, 50, 50, 50, 50],
      requiredGuildLevels: [0, 5, 10, 15, 20, 30, 40, 50, 60, 70],
      bonusUnit: '%'
    },
    { 
      id: 'startingAegis', 
      name: 'Получение аегиста в начале игры', 
      icon: '🛡️', 
      description: 'Начальный аегист при старте игры',
      fullDescription: 'При начале игры вы получаете определенное количество аегистов. Каждый уровень увеличивает количество получаемых аегистов в начале игры.',
      maxLevel: 10,
      isEndless: false,
      bonusValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      upgradeCostsGP: [50, 100, 150, 250, 350, 450, 600, 800, 1100, 1400],
      upgradeCostsPremium: [10, 15, 20, 30, 40, 50, 50, 50, 50, 50],
      requiredGuildLevels: [0, 5, 10, 15, 20, 30, 40, 50, 60, 70],
      bonusUnit: ' аегистов'
    },
    // Эндо-талант для бесконечной прокачки
    {
      id: 'guildPower',
      name: 'Мощь гильдии',
      icon: '🌟',
      description: 'Увеличивает все бонусы гильдии',
      fullDescription: 'Эндо-талант без максимального уровня. Каждый уровень увеличивает все бонусы гильдии на небольшой процент. Стоимость улучшения быстро растёт.',
      maxLevel: Infinity,
      isEndless: true,
      bonusValues: [], // Не используется для эндо-таланта
      upgradeCostsGP: [], // Вычисляется динамически
      upgradeCostsPremium: [], // Вычисляется динамически
      requiredGuildLevels: [],
      bonusUnit: '%'
    }
  ]

  /**
   * Проверяет, достигнута ли максимальная прокачка всех обычных талантов
   */
  const areAllRegularTalentsMaxed = useMemo(() => {
    const regularTalents = talents.filter(t => !t.isEndless)
    return regularTalents.every(talent => {
      const level = talentLevels[talent.id] || 0
      const maxLevel = getMaxTalentLevel(talent)
      return level >= maxLevel
    })
  }, [talentLevels, guildInfo.level])

  /**
   * Получает приоритет таланта для рекомендаций
   */
  const getTalentPriority = (talent) => {
    const level = talentLevels[talent.id] || 0
    const maxLevel = getMaxTalentLevel(talent)
    const progress = maxLevel === Infinity ? 0 : (level / maxLevel) * 100
    
    // Эндо-талант имеет низкий приоритет, пока не прокачаны все остальные
    if (talent.isEndless) {
      return areAllRegularTalentsMaxed ? 1 : 10
    }
    
    // Приоритет основан на прогрессе (чем меньше прогресс, тем выше приоритет)
    return progress < 50 ? 1 : progress < 80 ? 2 : 3
  }

  /**
   * Получает рекомендуемые таланты для улучшения
   */
  const getRecommendedTalents = useMemo(() => {
    return talents
      .filter(talent => {
        const level = talentLevels[talent.id] || 0
        const maxLevel = getMaxTalentLevel(talent)
        const costGP = getUpgradeCostGP(talent, level)
        return level < maxLevel && guildInfo.guildPoints >= costGP
      })
      .sort((a, b) => getTalentPriority(a) - getTalentPriority(b))
      .slice(0, 3)
  }, [talentLevels, guildInfo.level, guildInfo.guildPoints, areAllRegularTalentsMaxed])

  // Фильтрация и сортировка талантов
  const filteredTalents = useMemo(() => {
    let result = [...talents]
    
    // Фильтр по поисковому запросу
    if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
      result = result.filter(talent => 
      talent.name.toLowerCase().includes(query) ||
      talent.description.toLowerCase().includes(query)
    )
    }
    
    // Фильтр по доступности
    if (filterByAvailability !== 'all') {
      result = result.filter(talent => {
        const level = talentLevels[talent.id] || 0
        const maxLevel = getMaxTalentLevel(talent)
        const costGP = getUpgradeCostGP(talent, level)
        
        switch (filterByAvailability) {
          case 'available':
            return level < maxLevel && guildInfo.guildPoints >= costGP
          case 'maxed':
            return level >= maxLevel && !talent.isEndless
          case 'locked':
            return level < maxLevel && (guildInfo.guildPoints < costGP || guildInfo.level < getRequiredGuildLevel(talent, level + 1))
          default:
            return true
        }
      })
    }
    
    // Сортировка
    switch (sortBy) {
      case 'level':
        result.sort((a, b) => {
          const levelA = talentLevels[a.id] || 0
          const levelB = talentLevels[b.id] || 0
          return levelB - levelA
        })
        break
      case 'cost':
        result.sort((a, b) => {
          const levelA = talentLevels[a.id] || 0
          const levelB = talentLevels[b.id] || 0
          const costA = getUpgradeCostGP(a, levelA)
          const costB = getUpgradeCostGP(b, levelB)
          return costA - costB
        })
        break
      case 'efficiency':
        result.sort((a, b) => {
          const levelA = talentLevels[a.id] || 0
          const levelB = talentLevels[b.id] || 0
          const effA = getTalentEfficiency(a, levelA + 1)
          const effB = getTalentEfficiency(b, levelB + 1)
          return effB - effA
        })
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'priority':
        result.sort((a, b) => getTalentPriority(a) - getTalentPriority(b))
        break
      default:
        // По умолчанию: сначала рекомендуемые, потом по имени
        result.sort((a, b) => {
          const aRecommended = getRecommendedTalents.some(t => t.id === a.id)
          const bRecommended = getRecommendedTalents.some(t => t.id === b.id)
          if (aRecommended && !bRecommended) return -1
          if (!aRecommended && bRecommended) return 1
          return a.name.localeCompare(b.name)
        })
    }
    
    return result
  }, [searchQuery, talents, filterByAvailability, sortBy, talentLevels, guildInfo.level, guildInfo.guildPoints, getRecommendedTalents])

  /**
   * Вычисляет общий прогресс талантов
   */
  const getTotalTalentProgress = useMemo(() => {
    const regularTalents = talents.filter(t => !t.isEndless)
    let totalLevels = 0
    let totalMaxLevels = 0
    
    regularTalents.forEach(talent => {
      const level = talentLevels[talent.id] || 0
      const maxLevel = getMaxTalentLevel(talent)
      totalLevels += level
      totalMaxLevels += maxLevel
    })
    
    return {
      current: totalLevels,
      max: totalMaxLevels,
      percentage: totalMaxLevels > 0 ? Math.round((totalLevels / totalMaxLevels) * 100) : 0
    }
  }, [talentLevels, guildInfo.level, talents])

  // Выбранный талант для отображения деталей
  const selectedTalentData = talents.find(t => t.id === selectedTalent) || talents[0]
  const currentLevel = talentLevels[selectedTalent] || 0
  const effectiveMaxLevel = getMaxTalentLevel(selectedTalentData)
  const nextLevel = currentLevel + 1
  const requiredGuildLevel = getRequiredGuildLevel(selectedTalentData, nextLevel)
  const costGP = getUpgradeCostGP(selectedTalentData, currentLevel)
  
  // Проверка возможности улучшения (только GP)
  const hasEnoughGP = guildInfo.guildPoints >= costGP
  const isGuildLevelSufficient = guildInfo.level >= requiredGuildLevel
  const canUpgrade = currentLevel < effectiveMaxLevel && 
                     isGuildLevelSufficient &&
                     hasEnoughGP

  /**
   * Обработчик улучшения таланта
   * TODO: Заменить на реальный запрос к серверу
   */
  const handleUpgrade = () => {
    if (!canUpgrade || !hasEnoughGP) return
    
    if (guildInfo.guildPoints < costGP) {
      // Перенаправляем в магазин гильдии
      handleOpenGuildShop()
      return
    }

    // TODO: Отправить запрос на сервер для улучшения таланта
    // В реальном приложении здесь будет API-вызов
    
    // Обновляем локальное состояние (в реальном приложении это сделает сервер)
    setTalentLevels({
      ...talentLevels,
      [selectedTalent]: currentLevel + 1
    })

      // В реальном приложении GP обновляется на сервере
      // Здесь только для демонстрации
      setGuildInfo({
        ...guildInfo,
        guildPoints: guildInfo.guildPoints - costGP
      })

    // Анимация улучшения
    setUpgradeAnimation(selectedTalent)
    setTimeout(() => setUpgradeAnimation(null), 1000)
  }

  /**
   * Обработчик открытия магазина гильдии для покупки GP
   * TODO: Реализовать открытие магазина гильдии
   */
  const handleOpenGuildShop = () => {
    // TODO: Открыть окно магазина гильдии для покупки GP
    alert('TODO: Открыть магазин гильдии для покупки очков гильдии (GP)')
  }

  // Вычисляем следующий лимит уровня талантов
  const nextLevelCap = Math.floor((guildInfo.level + 1) / 2)
  
  // Проверяем, можно ли улучшить эндо-талант
  const canUpgradeEndlessTalent = () => {
    const endlessTalent = talents.find(t => t.isEndless)
    if (!endlessTalent) return false
    const level = talentLevels[endlessTalent.id] || 0
    const costGP = getUpgradeCostGP(endlessTalent, level)
    return guildInfo.guildPoints >= costGP
  }

  return (
    <div className="talents-tab-container">
      {/* Основной контент: две колонки */}
      <div className="talents-main-content-aaa">
        {/* Левая колонка - список талантов */}
        <div className="talents-left-column-aaa">
          {/* Верхняя панель с информацией о гильдии - упрощенная */}
          <div className="guild-info-panel-aaa">
            <div className="guild-info-simple-aaa">
              <div className="guild-info-main-aaa">
                <div className="guild-level-simple-aaa">
                  <span className="guild-level-label-aaa">Уровень гильдии:</span>
                  <span className="guild-level-value-aaa">{guildInfo.level}</span>
                  <span className="guild-level-hint-aaa" title="Максимальный уровень таланта = Уровень гильдии ÷ 2">
                    (Макс. талант: {Math.floor(guildInfo.level / 2)})
                  </span>
                </div>
                <div className="guild-gp-simple-aaa">
                  <span className="guild-gp-label-aaa">Очки гильдии:</span>
                  <span className="guild-gp-value-aaa">{guildInfo.guildPoints.toLocaleString()}</span>
                  <span className="guild-gp-hint-aaa" title={`Накопление: ${gpContributionInfo.dailyGpGain.toLocaleString()} GP/день (${gpContributionInfo.weeklyGpGain.toLocaleString()}/неделю)`}>
                    💰
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Поиск и фильтры - AAA стиль */}
          <div className="talent-search-container-aaa">
            <span className="search-icon-aaa">🔍</span>
            <input
              type="text"
              className="talent-search-input-aaa"
              placeholder="ПОИСК ТАЛАНТА"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Фильтры и сортировка */}
          <div className="talent-filters-container-aaa">
            <div className="filter-group-aaa">
              <label className="filter-label-aaa">Фильтр:</label>
              <select 
                className="filter-select-aaa"
                value={filterByAvailability}
                onChange={(e) => setFilterByAvailability(e.target.value)}
              >
                <option value="all">Все</option>
                <option value="available">Доступные</option>
                <option value="maxed">Максимальные</option>
                <option value="locked">Заблокированные</option>
              </select>
            </div>
            <div className="filter-group-aaa">
              <label className="filter-label-aaa">Сортировка:</label>
              <select 
                className="filter-select-aaa"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">По умолчанию</option>
                <option value="priority">По приоритету</option>
                <option value="level">По уровню</option>
                <option value="cost">По стоимости</option>
                <option value="efficiency">По эффективности</option>
                <option value="name">По имени</option>
              </select>
            </div>
          </div>

          {/* Список талантов */}
          <div className="talents-list-container-aaa">
            {filteredTalents.map((talent) => {
              const level = talentLevels[talent.id] || 0
              const maxLevel = getMaxTalentLevel(talent)
              const isSelected = selectedTalent === talent.id
              const progress = maxLevel === Infinity ? 0 : (level / maxLevel) * 100
              const isUpgrading = upgradeAnimation === talent.id
              
              // Определяем статус таланта для визуального отображения
              const canUpgradeTalent = level < maxLevel && 
                                       guildInfo.guildPoints >= getUpgradeCostGP(talent, level) &&
                                       guildInfo.level >= getRequiredGuildLevel(talent, level + 1)
              const isLocked = level < maxLevel && guildInfo.level < getRequiredGuildLevel(talent, level + 1)
              const isMaxed = !talent.isEndless && level >= maxLevel
              
              return (
                <div
                  key={talent.id}
                  data-talent-id={talent.id}
                  className={`talent-card-aaa ${isSelected ? 'selected' : ''} ${isUpgrading ? 'upgrading' : ''} ${talent.isEndless ? 'endless-talent' : ''} ${areAllRegularTalentsMaxed && talent.isEndless ? 'recommended' : ''} ${canUpgradeTalent ? 'can-upgrade' : ''} ${isLocked ? 'locked' : ''} ${isMaxed ? 'maxed' : ''}`}
                  onClick={() => setSelectedTalent(talent.id)}
                  onMouseEnter={() => setHoveredTalent(talent.id)}
                  onMouseLeave={() => setHoveredTalent(null)}
                >
                  {/* Визуальный индикатор статуса */}
                  <div className={`talent-status-indicator-aaa ${canUpgradeTalent ? 'status-available' : isLocked ? 'status-locked' : isMaxed ? 'status-maxed' : 'status-default'}`}></div>
                  
                  {/* Иконка таланта */}
                  <div className="talent-card-icon-aaa">
                    <span className="talent-icon-symbol-aaa">{talent.icon}</span>
                    <div className="talent-icon-glow"></div>
                    {/* Бейдж уровня на иконке */}
                    {level > 0 && (
                      <div className="talent-icon-level-badge-aaa">
                        {level}
                      </div>
                    )}
                  </div>
                  
                  {/* Основная информация */}
                  <div className="talent-card-info-aaa">
                    {/* Заголовок с названием и бейджами */}
                    <div className="talent-card-header-aaa">
                      <div className="talent-card-name-aaa">
                        {talent.name}
                        {talent.isEndless && <span className="endless-badge">∞</span>}
                        {areAllRegularTalentsMaxed && talent.isEndless && (
                          <span className="recommended-badge" title="Рекомендуется для траты лишних очков">⭐</span>
                        )}
                        {getRecommendedTalents.some(t => t.id === talent.id) && !talent.isEndless && (
                          <span className="priority-badge" title="Рекомендуется к улучшению">🔥</span>
                        )}
                      </div>
                      <div className="talent-card-level-badge-aaa">
                        {talent.isEndless ? `Lv.${level} ∞` : `Lv.${level}/${maxLevel}`}
                        {!talent.isEndless && level >= maxLevel && (
                          <span className="max-level-badge">MAX</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Текущий бонус */}
                    <div className="talent-card-bonus-aaa">
                      <span className="bonus-label-aaa">Текущий:</span>
                      <span className="bonus-value-aaa">{getBonusDescription(talent, level)}</span>
                    </div>
                    
                    {/* Следующий бонус (если можно улучшить) */}
                    {level < maxLevel && (
                      <div className="talent-card-next-bonus-aaa">
                        <span className="bonus-label-aaa">Следующий:</span>
                        <span className="bonus-value-aaa highlight">{getBonusDescription(talent, level + 1)}</span>
                      </div>
                    )}
                    
                    {/* Прогресс-бар */}
                    {!talent.isEndless && level < maxLevel && (
                      <div className="talent-card-progress-aaa">
                        <div className="talent-progress-bar-aaa">
                          <div 
                            className="talent-progress-fill-aaa" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text-aaa">{Math.round(progress)}%</span>
                      </div>
                    )}
                    
                    {/* Стоимость и доступность */}
                    {level < maxLevel && (
                      <div className="talent-card-cost-section-aaa">
                        <div className={`talent-cost-info-aaa ${guildInfo.guildPoints >= getUpgradeCostGP(talent, level) ? 'available' : 'insufficient'} ${isLocked ? 'locked' : ''}`}>
                          <span className="cost-icon-aaa">💰</span>
                          <span className="cost-value-aaa">{getUpgradeCostGP(talent, level).toLocaleString()} GP</span>
                          {isLocked ? (
                            <span className="cost-status-aaa locked" title={`Требуется уровень гильдии ${getRequiredGuildLevel(talent, level + 1)}`}>🔒</span>
                          ) : guildInfo.guildPoints >= getUpgradeCostGP(talent, level) ? (
                            <span className="cost-status-aaa available">✓</span>
                          ) : (
                            <span className="cost-status-aaa insufficient">✗</span>
                          )}
                        </div>
                        {level > 0 && !isLocked && (
                          <div className="talent-efficiency-mini-aaa">
                            <span className="efficiency-label-mini">Эфф.:</span>
                            <span className="efficiency-value-mini">{getTalentEfficiency(talent, level + 1).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {hoveredTalent === talent.id && (
                    <div className="talent-tooltip-aaa">
                      <div className="tooltip-title">
                        {talent.name}
                        {talent.isEndless && <span className="tooltip-endless-badge">Эндо-талант</span>}
                      </div>
                      <div className="tooltip-description">{talent.fullDescription}</div>
                      <div className="tooltip-stats">
                        <div className="tooltip-stat-row">
                          <span>Текущий уровень:</span>
                          <span className="tooltip-stat-value">{level}{talent.isEndless ? ' (∞)' : `/${maxLevel}`}</span>
                        </div>
                        {level < maxLevel && (
                          <>
                            <div className="tooltip-stat-row">
                              <span>Следующий бонус:</span>
                              <span className="tooltip-stat-value highlight">{getBonusDescription(talent, level + 1)}</span>
                            </div>
                            <div className="tooltip-stat-row">
                              <span>Стоимость:</span>
                              <span className="tooltip-stat-value">{getUpgradeCostGP(talent, level).toLocaleString()} GP</span>
                            </div>
                            {level > 0 && (
                              <div className="tooltip-stat-row">
                                <span>Эффективность:</span>
                                <span className="tooltip-stat-value efficiency">{getTalentEfficiency(talent, level + 1).toFixed(3)}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {talent.isEndless && areAllRegularTalentsMaxed && (
                        <div className="tooltip-hint">
                          💡 Этот талант можно улучшать бесконечно, используя накопленные очки гильдии
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Правая колонка - детали таланта - AAA стиль */}
        <div className="talents-right-column-aaa">
          {/* Блок 1: Заголовок таланта с описанием */}
          <div className="talent-detail-header-aaa">
            <div className="talent-detail-icon-large-aaa">
              <span className="talent-detail-icon-symbol-aaa">{selectedTalentData.icon}</span>
              <div className="talent-icon-background-glow"></div>
            </div>
            <div className="talent-detail-title-section-aaa">
            <div className="talent-detail-name-aaa">{selectedTalentData.name.toUpperCase()}</div>
              <div className="talent-detail-description-aaa">{selectedTalentData.fullDescription}</div>
            </div>
          </div>

          {/* Блок 2: Прогрессия таланта - визуальное сравнение До/После */}
          {currentLevel < effectiveMaxLevel ? (
            <div className="talent-progression-block-aaa">
              <div className="progression-header-aaa">
                <span className="progression-title-aaa">ПРОГРЕССИЯ</span>
                <span className="progression-level-badge-aaa">
                  {currentLevel}{selectedTalentData.isEndless ? ' → ∞' : ` → ${nextLevel}/${effectiveMaxLevel}`}
                </span>
              </div>
              
              {/* Визуальное сравнение До/После */}
              <div className="comparison-container-aaa">
                {/* Текущее состояние */}
                <div className="comparison-side-aaa current-side-aaa">
                  <div className="comparison-label-aaa">ТЕКУЩЕЕ</div>
                  <div className="comparison-level-aaa">Уровень {currentLevel}</div>
                  <div className="comparison-bonus-aaa">
                    {getBonusDescription(selectedTalentData, currentLevel)}
                  </div>
                </div>
                
                {/* Стрелка перехода */}
                <div className="comparison-arrow-aaa">
                  <div className="arrow-line-aaa"></div>
                  <div className="arrow-head-aaa">→</div>
                </div>
                
                {/* Следующее состояние */}
                <div className="comparison-side-aaa next-side-aaa">
                  <div className="comparison-label-aaa">СЛЕДУЮЩЕЕ</div>
                  <div className="comparison-level-aaa">Уровень {nextLevel}</div>
                  <div className="comparison-bonus-aaa highlight-bonus-aaa">
                {getBonusDescription(selectedTalentData, nextLevel)}
                  </div>
                </div>
              </div>

              {/* Прогресс-бар уровня */}
              {!selectedTalentData.isEndless && effectiveMaxLevel > 0 && (
                <div className="talent-level-progress-container-aaa">
                  <div className="talent-level-progress-bar-aaa">
                    <div 
                      className="talent-level-progress-fill-aaa" 
                      style={{ width: `${Math.min((currentLevel / effectiveMaxLevel) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="talent-level-progress-info-aaa">
                    <span className="progress-current-aaa">{currentLevel}</span>
                    <span className="progress-separator-aaa">/</span>
                    <span className="progress-max-aaa">{effectiveMaxLevel}</span>
                    <span className="progress-percent-aaa">
                      ({Math.round((currentLevel / effectiveMaxLevel) * 100)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="talent-progression-block-aaa maxed-progression-aaa">
              <div className="max-level-content-aaa">
                <div className="max-level-icon-aaa">⭐</div>
                <div className="max-level-text-main-aaa">
                {selectedTalentData.isEndless 
                  ? 'Эндо-талант можно улучшать бесконечно'
                    : 'Достигнут максимальный уровень'}
                </div>
                {!selectedTalentData.isEndless && (
                  <div className="max-level-hint-aaa">
                    Повысьте уровень гильдии для дальнейшего улучшения
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Блок 3: Требования (компактно) */}
          {currentLevel < effectiveMaxLevel && !selectedTalentData.isEndless && (
            <div className={`talent-requirement-compact-aaa ${isGuildLevelSufficient ? 'requirement-met' : 'requirement-locked'}`}>
              <span className="requirement-icon-aaa">{isGuildLevelSufficient ? '✓' : '🔒'}</span>
              <div className="requirement-info-aaa">
                <span className="requirement-label-compact-aaa">Требуется уровень гильдии:</span>
                <span className={`requirement-value-compact-aaa ${isGuildLevelSufficient ? 'met' : 'locked'}`}>
                  {requiredGuildLevel} {!isGuildLevelSufficient && `(Текущий: ${guildInfo.level})`}
                </span>
              </div>
            </div>
          )}

          {/* Блок 4: Информация о недостатке GP и магазин (только если не хватает) */}
          {currentLevel < effectiveMaxLevel && !hasEnoughGP && (
            <div className="talent-insufficient-gp-block-aaa">
              <div className="cost-insufficient-info-aaa">
                <span className="insufficient-icon-aaa">⚠️</span>
                <span className="insufficient-text-aaa">
                  Недостаточно GP. Требуется: <strong>{costGP.toLocaleString()}</strong>, имеется: <strong>{guildInfo.guildPoints.toLocaleString()}</strong>
                </span>
              </div>
              
              {/* Время до накопления */}
              <div className="cost-time-compact-aaa">
                <span className="time-icon-compact-aaa">⏱</span>
                <span className="time-text-compact-aaa">
                  GP накопится через: {getDaysToAfford(costGP - guildInfo.guildPoints)} {getDaysToAfford(costGP - guildInfo.guildPoints) === 1 ? 'день' : 'дней'}
                </span>
              </div>

              {/* Кнопка перехода в магазин гильдии */}
              <button 
                className="guild-shop-button-aaa"
                onClick={handleOpenGuildShop}
                title="Перейти в магазин гильдии для покупки GP"
              >
                <span className="shop-button-icon-aaa">🛒</span>
                <span className="shop-button-text-aaa">ПЕРЕЙТИ В МАГАЗИН ГИЛЬДИИ</span>
              </button>
            </div>
          )}

          {/* Блок 5: Кнопка действия - AAA стиль */}
          {currentLevel < effectiveMaxLevel && (
          <div className="talent-detail-actions-aaa">
            <button
                className={`talent-upgrade-button-aaa ${!canUpgrade ? 'disabled' : ''} ${currentLevel === 0 ? 'learn-button' : 'upgrade-button'}`}
                onClick={handleUpgrade}
              disabled={!canUpgrade || !hasEnoughGP}
              title={!canUpgrade ? 
                (currentLevel >= effectiveMaxLevel ? 'Достигнут максимальный уровень' : 
                 !isGuildLevelSufficient ? `Требуется уровень гильдии ${requiredGuildLevel}` :
                   'Недостаточно GP') : 
                  (currentLevel === 0 ? `Изучить талант за ${costGP.toLocaleString()} GP` : `Улучшить талант за ${costGP.toLocaleString()} GP`)}
            >
              <span className="button-glow"></span>
                <span className="button-icon-aaa">
                  {currentLevel === 0 ? '📖' : '⬆'}
                </span>
                <span className="button-text">
                  {currentLevel === 0 ? 'ИЗУЧИТЬ ТАЛАНТ' : 'УЛУЧШИТЬ ТАЛАНТ'}
                </span>
                <span className="button-cost-aaa">
                  {hasEnoughGP 
                    ? `${costGP.toLocaleString()} GP`
                    : 'Недостаточно GP'
                  }
                </span>
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TalentsTab
