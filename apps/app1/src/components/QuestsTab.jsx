import { useState, useMemo } from 'react'
import { guildConfig } from '../utils/generatePlayers'
import { getShieldImage, getRubyImage, getGPImage, getExpImage } from '../utils/imageUtils'
import './QuestsTab.css'

function QuestsTab() {
  const [activeQuestType, setActiveQuestType] = useState('daily') // daily, weekly, guild
  const currentGuildName = guildConfig.guild.name
  
  // Валюты игрока (в реальной игре это будет из состояния игрока)
  const [playerShields, setPlayerShields] = useState(150) // Щитки игрока
  const [playerCrystals, setPlayerCrystals] = useState(50) // Кристаллы игрока
  
  // Состояние пожертвований для заданий
  const [donationProgress, setDonationProgress] = useState({
    shields: 0, // Ежедневное персональное задание
    crystalsWeekly: 0, // Еженедельное персональное задание
    crystalsGuild: 0 // Общегильдийское задание
  })

  // Генерация заданий (используем donationProgress из состояния)
  const { dailyQuests, weeklyQuests, guildQuests } = useMemo(() => {
    const shieldsDonated = donationProgress.shields
    const crystalsWeeklyDonated = donationProgress.crystalsWeekly
    const crystalsGuildDonated = donationProgress.crystalsGuild
    
    // Ежедневные задания
    const dailyQuests = [
      {
        id: 'daily_1',
        title: 'Убить 10 боссов',
        description: 'Одолейте 10 боссов в игре',
        progress: 7,
        target: 10,
        reward: { points: 500, exp: 50, gp: 100 },
        icon: '⚔️',
        type: 'daily',
        completed: false,
        expiresIn: '23:45:12'
      },
      {
        id: 'daily_2',
        title: 'Убить 5 нейтральных боссов',
        description: 'Одолейте 5 нейтральных боссов на карте',
        progress: 3,
        target: 5,
        reward: { points: 400, exp: 40, gp: 80 },
        icon: '👹',
        type: 'daily',
        completed: false,
        expiresIn: '23:45:12'
      },
      {
        id: 'daily_3',
        title: 'Убить 200 крипов',
        description: 'Уничтожьте 200 крипов',
        progress: 134,
        target: 200,
        reward: { points: 300, exp: 30, gp: 75 },
        icon: '🦠',
        type: 'daily',
        completed: false,
        expiresIn: '23:45:12'
      },
      {
        id: 'daily_4',
        title: 'Потратить 5000 запчастей',
        description: 'Потратьте 5000 запчастей на улучшения',
        progress: 3200,
        target: 5000,
        reward: { points: 350, exp: 35, gp: 70 },
        icon: '🔧',
        type: 'daily',
        completed: false,
        expiresIn: '23:45:12'
      },
      {
        id: 'daily_5',
        title: 'Сыграть в 3 игры',
        description: 'Завершите 3 игры',
        progress: 2,
        target: 3,
        reward: { points: 450, exp: 45, gp: 90 },
        icon: '🎮',
        type: 'daily',
        completed: false,
        expiresIn: '23:45:12'
      },
      {
        id: 'daily_6',
        title: 'Потратить 50,000 золота',
        description: 'Потратьте 50,000 золота',
        progress: 32500,
        target: 50000,
        reward: { points: 400, exp: 40, gp: 85 },
        icon: '💰',
        type: 'daily',
        completed: false,
        expiresIn: '23:45:12'
      },
      {
        id: 'daily_donation_shields',
        title: 'Пожертвовать щитки',
        description: 'Пожертвуйте 100 щитков в фонд гильдии. Щитки сгорят, но вы получите награду.',
        progress: 0,
        target: 1,
        reward: { points: 500, exp: 50, gp: 100 },
        icon: '🛡️',
        type: 'daily',
        questType: 'donation', // Специальный тип задания
        donation: {
          shields: { required: 100, donated: shieldsDonated },
          crystals: { required: 0, donated: 0 }
        },
        completed: false,
        expiresIn: '23:45:12'
      }
    ]

    // Недельные задания
    const weeklyQuests = [
      {
        id: 'weekly_1',
        title: 'Убить 50 боссов',
        description: 'Одолейте 50 боссов за неделю',
        progress: 32,
        target: 50,
        reward: { points: 5000, exp: 500, gp: 1000 },
        icon: '⚔️',
        type: 'weekly',
        completed: false,
        expiresIn: '5 дней 12:30:45'
      },
      {
        id: 'weekly_2',
        title: 'Убить 20 нейтральных боссов',
        description: 'Одолейте 20 нейтральных боссов за неделю',
        progress: 14,
        target: 20,
        reward: { points: 4000, exp: 400, gp: 800 },
        icon: '👹',
        type: 'weekly',
        completed: false,
        expiresIn: '5 дней 12:30:45'
      },
      {
        id: 'weekly_3',
        title: 'Убить 1500 крипов',
        description: 'Уничтожьте 1500 крипов за неделю',
        progress: 987,
        target: 1500,
        reward: { points: 3500, exp: 350, gp: 700 },
        icon: '🦠',
        type: 'weekly',
        completed: false,
        expiresIn: '5 дней 12:30:45'
      },
      {
        id: 'weekly_4',
        title: 'Убить 3 рошана',
        description: 'Одолейте 3 рошана за неделю',
        progress: 1,
        target: 3,
        reward: { points: 6000, exp: 600, gp: 1200 },
        icon: '👑',
        type: 'weekly',
        completed: false,
        expiresIn: '5 дней 12:30:45'
      },
      {
        id: 'weekly_5',
        title: 'Разобрать 15 предметов экипировки',
        description: 'Разберите 15 предметов экипировки',
        progress: 9,
        target: 15,
        reward: { points: 4500, exp: 450, gp: 900 },
        icon: '🔨',
        type: 'weekly',
        completed: false,
        expiresIn: '5 дней 12:30:45'
      },
      {
        id: 'weekly_6',
        title: 'Пройти 20 игр',
        description: 'Завершите 20 игр с победой',
        progress: 13,
        target: 20,
        reward: { points: 5500, exp: 550, gp: 1100 },
        icon: '🏆',
        type: 'weekly',
        completed: false,
        expiresIn: '5 дней 12:30:45'
      },
      {
        id: 'weekly_7',
        title: 'Сыграть в 30 игр',
        description: 'Примите участие в 30 играх',
        progress: 21,
        target: 30,
        reward: { points: 4000, exp: 400, gp: 800 },
        icon: '🎮',
        type: 'weekly',
        completed: false,
        expiresIn: '5 дней 12:30:45'
      },
      {
        id: 'weekly_8',
        title: 'Потратить 500,000 золота',
        description: 'Потратьте 500,000 золота за неделю',
        progress: 325000,
        target: 500000,
        reward: { points: 5000, exp: 500, gp: 1000 },
        icon: '💰',
        type: 'weekly',
        completed: false,
        expiresIn: '5 дней 12:30:45'
      },
      {
        id: 'weekly_9',
        title: 'Потратить 50,000 запчастей',
        description: 'Потратьте 50,000 запчастей на улучшения',
        progress: 32100,
        target: 50000,
        reward: { points: 4500, exp: 450, gp: 900 },
        icon: '🔧',
        type: 'weekly',
        completed: false,
        expiresIn: '5 дней 12:30:45'
      },
      {
        id: 'weekly_donation_crystals',
        title: 'Пожертвовать кристаллы',
        description: 'Пожертвуйте 50 кристаллов в фонд гильдии. Кристаллы попадут на счет гильдии и могут быть использованы для покупок.',
        progress: 0,
        target: 1,
        reward: { points: 3000, exp: 300, gp: 600 },
        icon: '💎',
        type: 'weekly',
        questType: 'donation', // Специальный тип задания
        donation: {
          shields: { required: 0, donated: 0 },
          crystals: { required: 50, donated: crystalsWeeklyDonated }
        },
        completed: false,
        expiresIn: '5 дней 12:30:45'
      }
    ]

    // Общегильдийские задания
    const guildQuests = [
      {
        id: 'guild_donation_crystals',
        title: 'Пожертвование кристаллов',
        description: 'Пожертвуйте 20 кристаллов в фонд гильдии. Кристаллы попадут на счет гильдии и могут быть использованы для покупок.',
        progress: crystalsGuildDonated,
        target: 20,
        reward: { points: 5000, exp: 500, gp: 1000 },
        icon: '💎',
        type: 'guild',
        completed: false,
        expiresIn: '7 дней 00:00:00',
        contributors: crystalsGuildDonated > 0 ? Math.ceil(crystalsGuildDonated / 20) : 0
      },
      {
        id: 'guild_1',
        title: 'Гильдия: Убить 500 боссов',
        description: 'Вся гильдия должна одолеть 500 боссов',
        progress: 342,
        target: 500,
        reward: { points: 10000, exp: 1000, gp: 2000 },
        icon: '⚔️',
        type: 'guild',
        completed: false,
        expiresIn: '3 дня 18:20:10',
        contributors: 23
      },
      {
        id: 'guild_2',
        title: 'Гильдия: Убить 100 нейтральных боссов',
        description: 'Вся гильдия должна одолеть 100 нейтральных боссов',
        progress: 67,
        target: 100,
        reward: { points: 8000, exp: 800, gp: 1600 },
        icon: '👹',
        type: 'guild',
        completed: false,
        expiresIn: '3 дня 18:20:10',
        contributors: 18
      },
      {
        id: 'guild_3',
        title: 'Гильдия: Убить 10,000 крипов',
        description: 'Вся гильдия должна уничтожить 10,000 крипов',
        progress: 7234,
        target: 10000,
        reward: { points: 12000, exp: 1200, gp: 2400 },
        icon: '🦠',
        type: 'guild',
        completed: false,
        expiresIn: '3 дня 18:20:10',
        contributors: 32
      },
      {
        id: 'guild_4',
        title: 'Гильдия: Убить 10 рошанов',
        description: 'Вся гильдия должна одолеть 10 рошанов',
        progress: 6,
        target: 10,
        reward: { points: 15000, exp: 1500, gp: 3000 },
        icon: '👑',
        type: 'guild',
        completed: false,
        expiresIn: '3 дня 18:20:10',
        contributors: 12
      },
      {
        id: 'guild_5',
        title: 'Гильдия: Разобрать 200 предметов',
        description: 'Вся гильдия должна разобрать 200 предметов экипировки',
        progress: 134,
        target: 200,
        reward: { points: 10000, exp: 1000, gp: 2000 },
        icon: '🔨',
        type: 'guild',
        completed: false,
        expiresIn: '3 дня 18:20:10',
        contributors: 28
      },
      {
        id: 'guild_6',
        title: 'Гильдия: Пройти 500 игр',
        description: 'Вся гильдия должна выиграть 500 игр',
        progress: 342,
        target: 500,
        reward: { points: 15000, exp: 1500, gp: 3000 },
        icon: '🏆',
        type: 'guild',
        completed: false,
        expiresIn: '3 дня 18:20:10',
        contributors: 45
      },
      {
        id: 'guild_7',
        title: 'Гильдия: Сыграть в 1000 игр',
        description: 'Вся гильдия должна принять участие в 1000 играх',
        progress: 675,
        target: 1000,
        reward: { points: 12000, exp: 1200, gp: 2400 },
        icon: '🎮',
        type: 'guild',
        completed: false,
        expiresIn: '3 дня 18:20:10',
        contributors: 52
      },
      {
        id: 'guild_8',
        title: 'Гильдия: Потратить 10,000,000 золота',
        description: 'Вся гильдия должна потратить 10,000,000 золота',
        progress: 6750000,
        target: 10000000,
        reward: { points: 15000, exp: 1500, gp: 3000 },
        icon: '💰',
        type: 'guild',
        completed: false,
        expiresIn: '3 дня 18:20:10',
        contributors: 38
      },
      {
        id: 'guild_9',
        title: 'Гильдия: Потратить 1,000,000 запчастей',
        description: 'Вся гильдия должна потратить 1,000,000 запчастей',
        progress: 675000,
        target: 1000000,
        reward: { points: 13000, exp: 1300, gp: 2600 },
        icon: '🔧',
        type: 'guild',
        completed: false,
        expiresIn: '3 дня 18:20:10',
        contributors: 41
      }
    ]

    return { dailyQuests, weeklyQuests, guildQuests }
  }, [donationProgress])

  const getCompletedCount = (quests) => {
    if (!quests || !Array.isArray(quests)) return 0
    return quests.filter(q => q && (q.completed || (q.progress !== undefined && q.target !== undefined && q.progress >= q.target))).length
  }

  const dailyCompleted = useMemo(() => getCompletedCount(dailyQuests), [dailyQuests])
  const weeklyCompleted = useMemo(() => getCompletedCount(weeklyQuests), [weeklyQuests])
  const guildCompleted = useMemo(() => getCompletedCount(guildQuests), [guildQuests])

  // Проверка невыполненных заданий на трату кристаллов и щитков
  const hasUncompletedDonationQuest = useMemo(() => {
    // Проверка ежедневного задания на щитки
    const dailyShieldsQuest = dailyQuests.find(q => q.id === 'daily_donation_shields')
    const dailyShieldsIncomplete = dailyShieldsQuest && 
      dailyShieldsQuest.questType === 'donation' &&
      dailyShieldsQuest.donation?.shields &&
      (dailyShieldsQuest.donation.shields.donated || 0) < (dailyShieldsQuest.donation.shields.required || 0)

    // Проверка еженедельного задания на кристаллы
    const weeklyCrystalsQuest = weeklyQuests.find(q => q.id === 'weekly_donation_crystals')
    const weeklyCrystalsIncomplete = weeklyCrystalsQuest && 
      weeklyCrystalsQuest.questType === 'donation' &&
      weeklyCrystalsQuest.donation?.crystals &&
      (weeklyCrystalsQuest.donation.crystals.donated || 0) < (weeklyCrystalsQuest.donation.crystals.required || 0)

    return {
      daily: dailyShieldsIncomplete || false,
      weekly: weeklyCrystalsIncomplete || false
    }
  }, [dailyQuests, weeklyQuests])

  const activeQuests = useMemo(() => {
    let quests = []
    switch (activeQuestType) {
      case 'daily':
        quests = dailyQuests || []
        break
      case 'weekly':
        quests = weeklyQuests || []
        break
      case 'guild':
        quests = guildQuests || []
        break
      default:
        return []
    }
    
    // Сортируем: задания на пожертвование (questType === 'donation') идут первыми
    return [...quests].sort((a, b) => {
      const aIsDonation = a?.questType === 'donation' ? 0 : 1
      const bIsDonation = b?.questType === 'donation' ? 0 : 1
      return aIsDonation - bIsDonation
    })
  }, [activeQuestType, dailyQuests, weeklyQuests, guildQuests])

  // Обработка пожертвования
  const handleDonation = (quest) => {
    if (!quest || quest.questType !== 'donation' || !quest.donation) return

    const requiredShields = quest.donation.shields?.required || 0
    const requiredCrystals = quest.donation.crystals?.required || 0
    const donatedShields = quest.donation.shields?.donated || 0
    const donatedCrystals = quest.donation.crystals?.donated || 0

    const needShields = requiredShields - donatedShields
    const needCrystals = requiredCrystals - donatedCrystals

    // Проверка достаточности валюты
    const hasEnoughShields = needShields === 0 || playerShields >= needShields
    const hasEnoughCrystals = needCrystals === 0 || playerCrystals >= needCrystals

    if (hasEnoughShields && hasEnoughCrystals) {
      // Пожертвование успешно
      let newShieldsDonated = donatedShields
      let newCrystalsDonated = donatedCrystals

      // Обработка щитков (только для персонального задания)
      if (needShields > 0) {
        newShieldsDonated = donatedShields + needShields
        // Щитки сгорают
        setPlayerShields(playerShields - needShields)
        setDonationProgress(prev => ({
          ...prev,
          shields: newShieldsDonated
        }))
      }

      // Обработка кристаллов (для еженедельного персонального и общегильдийского заданий)
      if (needCrystals > 0) {
        newCrystalsDonated = donatedCrystals + needCrystals
        // Кристаллы попадают на счет гильдии
        guildConfig.guild.crystals += needCrystals
        setPlayerCrystals(playerCrystals - needCrystals)
        
        // Обновляем правильное состояние в зависимости от типа задания
        if (quest.type === 'weekly') {
          // Еженедельное персональное задание
          setDonationProgress(prev => ({
            ...prev,
            crystalsWeekly: newCrystalsDonated
          }))
        } else if (quest.type === 'guild') {
          // Общегильдийское задание
          setDonationProgress(prev => ({
            ...prev,
            crystalsGuild: newCrystalsDonated
          }))
        }
      }

      // Если задание выполнено, начисляем награду
      const isShieldsComplete = newShieldsDonated >= requiredShields
      const isCrystalsComplete = newCrystalsDonated >= requiredCrystals
      const isQuestComplete = (requiredShields === 0 || isShieldsComplete) && 
                              (requiredCrystals === 0 || isCrystalsComplete)

      if (isQuestComplete) {
        if (quest.type === 'guild') {
          // Общегильдийское задание - награда идет гильдии
          const rewardGp = quest.reward?.gp || 0
          guildConfig.guild.points += rewardGp
          alert(`Пожертвование выполнено! Гильдия получила ${rewardGp} GP. Кристаллы добавлены на счет гильдии.`)
        } else {
          // Персональное задание - награда идет игроку
          const rewardPoints = quest.reward?.points || 0
          const rewardExp = quest.reward?.exp || 0
          const rewardGp = quest.reward?.gp || 0
          alert(`Пожертвование выполнено! Вы получили награду: ${rewardPoints} очков, ${rewardExp} опыта, ${rewardGp} GP.`)
        }
      } else {
        if (needShields > 0) {
          alert(`Щитки пожертвованы! Осталось: ${requiredShields - newShieldsDonated} щитков.`)
        }
        if (needCrystals > 0) {
          alert(`Кристаллы пожертвованы! Осталось: ${requiredCrystals - newCrystalsDonated} кристаллов. Кристаллы добавлены на счет гильдии.`)
        }
      }
    } else {
      const missingShields = Math.max(0, needShields - playerShields)
      const missingCrystals = Math.max(0, needCrystals - playerCrystals)
      let errorMsg = 'Недостаточно валюты!'
      if (missingShields > 0) {
        errorMsg += ` Нужно: ${needShields} щитков (у вас ${playerShields})`
      }
      if (missingCrystals > 0) {
        errorMsg += ` Нужно: ${needCrystals} кристаллов (у вас ${playerCrystals})`
      }
      alert(errorMsg)
    }
  }

  return (
    <div className="main-content quests-container">
      <div className="quests-content">
        {/* Заголовок и фильтры */}
        <div className="quests-header">
          <div className="quests-title-section">
            <h1 className="quests-main-title">📋 Задания гильдии</h1>
            <p className="quests-subtitle">Выполняйте задания для получения наград и развития гильдии</p>
          </div>
        </div>

        {/* Переключатель типов заданий */}
        <div className="quest-type-selector">
          <button
            className={`quest-type-button ${activeQuestType === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveQuestType('daily')}
          >
            <span className="quest-type-icon">📅</span>
            <span className="quest-type-label">Ежедневные</span>
            <span className="quest-type-count">{dailyCompleted}/{dailyQuests?.length || 0}</span>
            {hasUncompletedDonationQuest.daily && (
              <span className="quest-notification-badge" title="Невыполненное задание на трату щитков">!</span>
            )}
          </button>
          <button
            className={`quest-type-button ${activeQuestType === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveQuestType('weekly')}
          >
            <span className="quest-type-icon">📆</span>
            <span className="quest-type-label">Недельные</span>
            <span className="quest-type-count">{weeklyCompleted}/{weeklyQuests?.length || 0}</span>
            {hasUncompletedDonationQuest.weekly && (
              <span className="quest-notification-badge" title="Невыполненное задание на трату кристаллов">!</span>
            )}
          </button>
          <button
            className={`quest-type-button ${activeQuestType === 'guild' ? 'active' : ''}`}
            onClick={() => setActiveQuestType('guild')}
          >
            <span className="quest-type-icon">🏛️</span>
            <span className="quest-type-label">Общегильдийские</span>
            <span className="quest-type-count">{guildCompleted}/{guildQuests?.length || 0}</span>
          </button>
        </div>

        {/* Список заданий */}
        <div className="quests-list">
          {activeQuests && Array.isArray(activeQuests) && activeQuests.length > 0 ? (
            activeQuests.map(quest => {
            const isDonationQuest = quest.questType === 'donation'
            
            let progressPercent = 0
            let isCompleted = false

            if (isDonationQuest && quest.donation) {
              // Расчет прогресса для задания на пожертвование
              const shieldsRequired = quest.donation.shields?.required || 0
              const crystalsRequired = quest.donation.crystals?.required || 0
              
              let shieldsProgress = 0
              let crystalsProgress = 0
              
              if (shieldsRequired > 0) {
                shieldsProgress = quest.donation.shields.donated / shieldsRequired
              }
              if (crystalsRequired > 0) {
                crystalsProgress = quest.donation.crystals.donated / crystalsRequired
              }
              
              // Если есть оба типа, берем среднее, иначе берем тот, который есть
              if (shieldsRequired > 0 && crystalsRequired > 0) {
                progressPercent = Math.min((shieldsProgress + crystalsProgress) / 2 * 100, 100)
              } else if (shieldsRequired > 0) {
                progressPercent = Math.min(shieldsProgress * 100, 100)
              } else if (crystalsRequired > 0) {
                progressPercent = Math.min(crystalsProgress * 100, 100)
              }
              
              isCompleted = (shieldsRequired === 0 || (quest.donation.shields?.donated || 0) >= shieldsRequired) &&
                          (crystalsRequired === 0 || (quest.donation.crystals?.donated || 0) >= crystalsRequired)
            } else {
              const questProgress = quest.progress || 0
              const questTarget = quest.target || 1
              progressPercent = Math.min((questProgress / questTarget) * 100, 100)
              isCompleted = quest.completed || questProgress >= questTarget
            }

            // Проверка возможности пожертвования
            const needShields = isDonationQuest && quest.donation ? 
              (quest.donation.shields?.required || 0) - (quest.donation.shields?.donated || 0) : 0
            const needCrystals = isDonationQuest && quest.donation ? 
              (quest.donation.crystals?.required || 0) - (quest.donation.crystals?.donated || 0) : 0
            const canDonate = isDonationQuest && !isCompleted &&
              (needShields === 0 || playerShields >= needShields) &&
              (needCrystals === 0 || playerCrystals >= needCrystals)

            return (
              <div
                key={quest.id}
                className={`quest-card ${isCompleted ? 'completed' : ''} quest-type-${quest.type} ${isDonationQuest ? 'quest-donation' : ''}`}
              >
                <div className="quest-card-header">
                  <div className="quest-icon">{quest.icon}</div>
                  <div className="quest-title-section">
                    <h3 className="quest-title">{quest.title}</h3>
                    <p className="quest-description">{quest.description}</p>
                  </div>
                  {isCompleted && (
                    <div className="quest-completed-badge">✓ Выполнено</div>
                  )}
                </div>

                {isDonationQuest && quest.donation ? (
                  <div className="quest-donation-section">
                    <div className="donation-progress-info">
                      <div className="donation-currency-group">
                        {quest.donation.shields?.required > 0 && (
                          <div className="donation-currency-item">
                            <img src={getShieldImage()} alt="Щитки" className="donation-icon-image" />
                            <span className="donation-progress-text">
                              {quest.donation.shields?.donated || 0} / {quest.donation.shields?.required || 0}
                            </span>
                            <span className="donation-balance-mini">({playerShields})</span>
                          </div>
                        )}
                        {quest.donation.crystals?.required > 0 && (
                          <div className="donation-currency-item">
                            <img src={getRubyImage()} alt="Кристаллы" className="donation-icon-image" />
                            <span className="donation-progress-text">
                              {quest.donation.crystals?.donated || 0} / {quest.donation.crystals?.required || 0}
                            </span>
                            <span className="donation-balance-mini">({playerCrystals})</span>
                          </div>
                        )}
                      </div>
                      <button
                        className={`donation-button-compact ${canDonate ? '' : 'disabled'}`}
                        onClick={() => handleDonation(quest)}
                        disabled={!canDonate || isCompleted}
                      >
                        {isCompleted ? '✓' : canDonate ? 'Пожертвовать' : 'Недостаточно'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="quest-progress-section">
                      <div className="quest-progress-info">
                        <span className="quest-progress-text">
                          {(quest.progress || 0).toLocaleString()} / {(quest.target || 0).toLocaleString()}
                        </span>
                        <span className="quest-progress-percent">{Math.floor(progressPercent)}%</span>
                      </div>
                      <div className="quest-progress-bar-container">
                        <div
                          className={`quest-progress-bar ${isCompleted ? 'completed' : ''}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {quest.type === 'guild' && quest.contributors !== undefined && (
                      <div className="quest-contributors">
                        <span className="contributors-icon">👥</span>
                        <span className="contributors-text">
                          Участников: {quest.contributors}
                        </span>
                      </div>
                    )}
                  </>
                )}

                <div className="quest-footer">
                  <div className="quest-rewards">
                    {(quest.reward?.gp || 0) > 0 && (
                      <div className="quest-reward-item">
                        <img src={getGPImage()} alt="GP" className="reward-icon-image" />
                        <span className="reward-value">{(quest.reward?.gp || 0).toLocaleString()} GP</span>
                      </div>
                    )}
                    {(quest.reward?.exp || 0) > 0 && (
                      <div className="quest-reward-item">
                        <img src={getExpImage()} alt="Опыт гильдии" className="reward-icon-image" />
                        <span className="reward-value">{(quest.reward?.exp || 0).toLocaleString()} опыта гильдии</span>
                      </div>
                    )}
                  </div>
                  <div className="quest-expires">
                    <span className="expires-icon">⏰</span>
                    <span className="expires-text">Осталось: {quest.expiresIn || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )
            })
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#8A9BA8' }}>
              <p>Задания не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestsTab

