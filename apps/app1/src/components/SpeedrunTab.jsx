import { useState, useMemo, useEffect } from 'react'
import { guildConfig } from '../config/guildConfig'
import { getItemByIndex, getHeroByIndex, getAvatarByIndex, getShieldImage, getGPImage, getExpImage } from '../utils/imageUtils'
import { isSpeedrunActive, getTimeUntilNextSpeedrun, getCurrentSundayEnd } from '../utils/speedrunUtils'
import './SpeedrunTab.css'

// Функция для получения картинки гильдии по имени
const getGuildImage = (guildName) => {
  // Используем индекс на основе имени гильдии для получения картинки
  // Можно использовать аватары игроков как заглушку для гильдий
  const guildNames = ['Guild Name', 'Elite Guild', 'Speed Runners', 'Warriors Guild', 'Dark Knights', 'Light Bringers']
  const index = guildNames.indexOf(guildName)
  if (index >= 0) {
    return getAvatarByIndex(index % 10) // Используем аватары с циклическим индексом
  }
  // Если гильдия не найдена, используем первый аватар
  return getAvatarByIndex(0)
}

function SpeedrunTab({ showBestPlace = true }) {
  const [openCategory, setOpenCategory] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const currentGuildName = guildConfig.guild.name

  // Таймер до окончания/начала спидрана
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const speedrunActive = isSpeedrunActive(guildConfig.speedrun)
      
      let targetTime
      if (speedrunActive) {
        // Если спидран активен, показываем время до окончания (воскресенье 23:59:59)
        targetTime = getCurrentSundayEnd()
      } else {
        // Если неактивен, показываем время до начала следующего периода (пятница 00:00:00)
        targetTime = getTimeUntilNextSpeedrun()
      }

      const diff = targetTime - now

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining({ days, hours, minutes, seconds, isActive: speedrunActive })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  // Награды за топ-1, топ-2, топ-3 в зависимости от сложности
  const getRewardsByDifficulty = (difficulty) => {
    const baseGP = difficulty * 250
    const baseGuildExp = difficulty * 25
    
    return {
      top1: { gp: baseGP, guildExp: baseGuildExp, medal: '🥇' },
      top2: { gp: Math.floor(baseGP * 0.6), guildExp: Math.floor(baseGuildExp * 0.6), medal: '🥈' },
      top3: { gp: Math.floor(baseGP * 0.4), guildExp: Math.floor(baseGuildExp * 0.4), medal: '🥉' }
    }
  }

  // Генерируем данные для всех сложностей от 10 до 20
  const generateSpeedrunRecords = () => {
    let heroIndex = 0
    let itemIndex = 0
    let avatarIndex = 0
    
    const generatePlayerRecord = (playerName, guildName) => {
      const heroImage = getHeroByIndex(heroIndex++)
      const items = Array.from({ length: 6 }, () => getItemByIndex(itemIndex++))
      const playerAvatar = getAvatarByIndex(avatarIndex++)
      return {
        player: playerName,
        heroImage,
        playerAvatar,
        items,
        time: `${String(Math.floor(Math.random() * 15) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        points: Math.floor(Math.random() * 2000) + 3000,
        guildName
      }
    }

    const guilds = ['Guild Name', 'Elite Guild', 'Speed Runners', 'Warriors Guild', 'Dark Knights', 'Light Bringers']
    const difficulties = Array.from({ length: 11 }, (_, i) => 10 + i) // 10-20
    const currentGuild = currentGuildName
    
    const allRecords = []

    // Генерируем записи для всех сложностей
    difficulties.forEach(difficulty => {
      const topGuild = guilds[Math.floor(Math.random() * guilds.length)]
      const records = []
      
      // Генерируем записи для разных гильдий
      for (let i = 0; i < 20; i++) {
        const guild = guilds[Math.floor(Math.random() * guilds.length)]
        records.push(generatePlayerRecord(`Player${i + 1}`, guild))
      }
      
      // Сортируем по времени
      records.sort((a, b) => {
        const timeA = a.time.split(':').map(Number)
        const timeB = b.time.split(':').map(Number)
        const totalA = timeA[0] * 3600 + timeA[1] * 60 + timeA[2]
        const totalB = timeB[0] * 3600 + timeB[1] * 60 + timeB[2]
        return totalA - totalB
      })
      
      allRecords.push({
        id: `difficulty${difficulty}`,
        name: `Сложность ${difficulty}`,
        difficulty,
        guildName: topGuild,
        guildImage: 'IMG',
        completedDate: new Date().toLocaleDateString('ru-RU'),
        records
        })
    })
    
    return allRecords
  }

  const allSpeedrunRecords = useMemo(() => generateSpeedrunRecords(), [currentGuildName])

  // Группируем записи по гильдиям и находим позиции
  const getGuildPositions = (records) => {
    const guildTeams = {}
    
    records.forEach(record => {
      const guildName = record.guildName
      if (!guildTeams[guildName]) {
        guildTeams[guildName] = []
      }
      guildTeams[guildName].push(record)
    })

    // Для каждой гильдии находим лучшее время команды
    const guildBestTimes = Object.keys(guildTeams).map(guildName => {
      const teamRecords = guildTeams[guildName]
      const sorted = [...teamRecords].sort((a, b) => {
      const timeA = a.time.split(':').map(Number)
      const timeB = b.time.split(':').map(Number)
        const totalA = timeA[0] * 3600 + timeA[1] * 60 + timeA[2]
        const totalB = timeB[0] * 3600 + timeB[1] * 60 + timeB[2]
        return totalA - totalB
      })
      const teamSize = Math.min(3 + Math.floor(Math.random() * 3), sorted.length)
      const team = sorted.slice(0, teamSize)
      const bestTime = team[0].time
      
      const totalTime = team.reduce((sum, player) => {
        const timeParts = player.time.split(':').map(Number)
        return sum + (timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2])
      }, 0)
      
      return {
        guildName,
        bestTime,
        totalTime,
        team
      }
    })

    // Сортируем гильдии по лучшему времени
    guildBestTimes.sort((a, b) => {
      const timeA = a.bestTime.split(':').map(Number)
      const timeB = b.bestTime.split(':').map(Number)
      const totalA = timeA[0] * 3600 + timeA[1] * 60 + timeA[2]
      const totalB = timeB[0] * 3600 + timeB[1] * 60 + timeB[2]
      return totalA - totalB
    })

    return guildBestTimes
  }

  // Определяем текущее место гильдии в категории
  const getCurrentGuildPosition = (category) => {
    const positions = getGuildPositions(category.records)
    const currentGuildIndex = positions.findIndex(p => p.guildName === currentGuildName)
    
    if (currentGuildIndex === -1) {
      return null // Гильдия не участвует в этой сложности
    }

    return {
      position: currentGuildIndex + 1, // Позиция (1-based)
      bestTime: positions[currentGuildIndex].bestTime,
      team: positions[currentGuildIndex].team
    }
  }

  // Определяем награды для всех категорий (топ-1, топ-2, топ-3)
  const speedrunCategories = useMemo(() => {
    const sortedCategories = [...allSpeedrunRecords].sort((a, b) => b.difficulty - a.difficulty)
    
    // Храним наилучшие результаты для каждой гильдии по каждой категории награды
    const guildBestRewards = {
      top1: {}, // { guildName: { difficulty, reward } }
      top2: {},
      top3: {}
    }

    const processedCategories = []

    for (const category of sortedCategories) {
      const positions = getGuildPositions(category.records)
      const rewards = getRewardsByDifficulty(category.difficulty)
      
      const categoryRewards = {
        top1: null,
        top2: null,
        top3: null
      }

      // Обрабатываем топ-1, топ-2, топ-3
      for (let rank = 0; rank < Math.min(3, positions.length); rank++) {
        const position = positions[rank]
        const guildName = position.guildName
        const rewardType = rank === 0 ? 'top1' : rank === 1 ? 'top2' : 'top3'
        
        // Проверяем, есть ли у гильдии уже награда в более высокой сложности
        const currentBest = guildBestRewards[rewardType][guildName]
        if (!currentBest || currentBest.difficulty < category.difficulty) {
          // Эта гильдия получает награду
          guildBestRewards[rewardType][guildName] = {
            difficulty: category.difficulty,
            reward: rewards[rewardType]
          }
          categoryRewards[rewardType] = {
            guild: guildName,
            reward: rewards[rewardType],
            team: position.team,
            originalRank: rank
          }
        } else {
          // Ищем следующую гильдию, которая еще не получила награду в более высокой сложности
          let found = false
          for (let nextRank = rank + 1; nextRank < positions.length; nextRank++) {
            const nextPosition = positions[nextRank]
            const nextGuildName = nextPosition.guildName
            const nextBest = guildBestRewards[rewardType][nextGuildName]
            
            if (!nextBest || nextBest.difficulty < category.difficulty) {
              guildBestRewards[rewardType][nextGuildName] = {
                difficulty: category.difficulty,
                reward: rewards[rewardType]
              }
              categoryRewards[rewardType] = {
                guild: nextGuildName,
                reward: rewards[rewardType],
                team: nextPosition.team,
                originalRank: rank
              }
              found = true
              break
            }
          }
          // Если не нашли подходящую гильдию, награда не выдается
          if (!found) {
            categoryRewards[rewardType] = null
          }
        }
      }

      processedCategories.push({
        ...category,
        rewards: categoryRewards
      })
    }

    // Возвращаем в исходном порядке
    return allSpeedrunRecords.map(cat => {
      const processed = processedCategories.find(p => p.id === cat.id)
      return processed || { ...cat, rewards: { top1: null, top2: null, top3: null } }
    })
  }, [allSpeedrunRecords])

  // Определяем лучшее топ место гильдии в текущем спидране
  const currentGuildTopPlace = useMemo(() => {
    let bestPlace = null
    
    speedrunCategories.forEach(category => {
      const rewards = category.rewards
      const difficulty = category.difficulty
      
      // Проверяем топ-1, топ-2, топ-3
      if (rewards.top1 && rewards.top1.guild === currentGuildName) {
        if (!bestPlace || bestPlace.difficulty < difficulty || (bestPlace.difficulty === difficulty && bestPlace.rank > 1)) {
          bestPlace = {
            rank: 1,
            difficulty,
            reward: rewards.top1.reward,
            bestTime: getGuildPositions(category.records)[0]?.bestTime,
            team: rewards.top1.team || [],
            categoryName: category.name
          }
        }
      } else if (rewards.top2 && rewards.top2.guild === currentGuildName) {
        if (!bestPlace || bestPlace.difficulty < difficulty || (bestPlace.difficulty === difficulty && bestPlace.rank > 2)) {
          bestPlace = {
            rank: 2,
            difficulty,
            reward: rewards.top2.reward,
            bestTime: getGuildPositions(category.records)[1]?.bestTime,
            team: rewards.top2.team || [],
            categoryName: category.name
          }
        }
      } else if (rewards.top3 && rewards.top3.guild === currentGuildName) {
        if (!bestPlace || bestPlace.difficulty < difficulty || (bestPlace.difficulty === difficulty && bestPlace.rank > 3)) {
          bestPlace = {
            rank: 3,
            difficulty,
            reward: rewards.top3.reward,
            bestTime: getGuildPositions(category.records)[2]?.bestTime,
            team: rewards.top3.team || [],
            categoryName: category.name
          }
        }
      }
    })
    
    return bestPlace
  }, [speedrunCategories, currentGuildName])

  // История наград текущей гильдии (группируем по сложности и считаем количество)
  const guildRewardHistory = useMemo(() => {
    const history = {
      top1: {},
      top2: {},
      top3: {}
    }

    speedrunCategories.forEach(category => {
      ['top1', 'top2', 'top3'].forEach(rewardType => {
        const reward = category.rewards[rewardType]
        if (reward && reward.guild === currentGuildName) {
          const difficulty = category.difficulty
          if (!history[rewardType][difficulty]) {
            history[rewardType][difficulty] = {
              difficulty,
              count: 0,
              reward: reward.reward,
              dates: []
            }
          }
          history[rewardType][difficulty].count++
          history[rewardType][difficulty].dates.push(category.completedDate)
        }
      })
    })

    // Преобразуем объекты в массивы и сортируем по сложности (от высокой к низкой)
    const result = {
      top1: Object.values(history.top1).sort((a, b) => b.difficulty - a.difficulty),
      top2: Object.values(history.top2).sort((a, b) => b.difficulty - a.difficulty),
      top3: Object.values(history.top3).sort((a, b) => b.difficulty - a.difficulty)
    }

    return result
  }, [speedrunCategories, currentGuildName])

  // Детальная история получения топ мест (каждый случай отдельно)
  const detailedTopHistory = useMemo(() => {
    const history = []

    speedrunCategories.forEach(category => {
      ['top1', 'top2', 'top3'].forEach(rewardType => {
        const reward = category.rewards[rewardType]
        if (reward && reward.guild === currentGuildName) {
          history.push({
            id: `${category.id}_${rewardType}`,
            rank: rewardType === 'top1' ? 1 : rewardType === 'top2' ? 2 : 3,
            rankType: rewardType,
            difficulty: category.difficulty,
            date: category.completedDate,
            reward: reward.reward,
            team: reward.team || [],
            categoryName: category.name
          })
        }
      })
    })

    // Сортируем по дате (от новых к старым), затем по сложности (от высокой к низкой)
    history.sort((a, b) => {
      const dateA = new Date(a.date.split('.').reverse().join('-'))
      const dateB = new Date(b.date.split('.').reverse().join('-'))
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime()
      }
      if (b.difficulty !== a.difficulty) {
        return b.difficulty - a.difficulty
      }
      return a.rank - b.rank
    })

    return history
  }, [speedrunCategories, currentGuildName])

  // Статистика по призовым местам
  const prizeStatistics = useMemo(() => {
    const stats = {
      top1: { count: 0, totalGP: 0, totalGuildExp: 0, maxDifficulty: 0 },
      top2: { count: 0, totalGP: 0, totalGuildExp: 0, maxDifficulty: 0 },
      top3: { count: 0, totalGP: 0, totalGuildExp: 0, maxDifficulty: 0 },
      total: { count: 0, totalGP: 0, totalGuildExp: 0 }
    }

    detailedTopHistory.forEach(entry => {
      const stat = stats[entry.rankType]
      stat.count++
      stat.totalGP += entry.reward.gp || 0
      stat.totalGuildExp += entry.reward.guildExp || 0
      if (entry.difficulty > stat.maxDifficulty) {
        stat.maxDifficulty = entry.difficulty
      }
      
      stats.total.count++
      stats.total.totalGP += entry.reward.gp || 0
      stats.total.totalGuildExp += entry.reward.guildExp || 0
    })

    return stats
  }, [detailedTopHistory])

  // Топ 3 команды по заработанным очкам из наград (когда спидран неактивен)
  // Каждая гильдия может получить только одну награду - наилучшее призовое место
  const topTeamsByPoints = useMemo(() => {
    try {
      if (!speedrunCategories || !Array.isArray(speedrunCategories) || speedrunCategories.length === 0) {
        return []
      }
      
      const guildBestRewards = {}
      
      // Проходим по всем категориям и находим лучшую награду для каждой гильдии
      for (const category of speedrunCategories) {
        if (!category || !category.rewards || typeof category.rewards !== 'object') {
          continue
        }
        
        const difficulty = category.difficulty || 0
        
        // Получаем позиции гильдий для этой категории, чтобы узнать лучшее время
        const positions = getGuildPositions(category.records)
        
        // Проверяем топ-1, топ-2, топ-3 (в порядке приоритета)
        const rewardTypes = ['top1', 'top2', 'top3']
        for (const rewardType of rewardTypes) {
          const reward = category.rewards[rewardType]
          if (reward && reward.guild) {
            const guildName = reward.guild
            const rank = rewardType === 'top1' ? 1 : rewardType === 'top2' ? 2 : 3
            
            // Находим позицию гильдии для получения времени
            const guildPosition = positions.find(p => p.guildName === guildName)
            const bestTime = guildPosition?.bestTime || (reward.team && reward.team.length > 0 ? reward.team[0].time : '--:--:--')
            
            // Если у гильдии еще нет награды, или эта награда лучше
            if (!guildBestRewards[guildName]) {
              guildBestRewards[guildName] = {
                guildName,
                guildImage: getGuildImage(guildName),
                rank,
                rankType: rewardType,
                difficulty,
                gp: reward.reward.gp || 0,
                guildExp: reward.reward.guildExp || 0,
                team: reward.team || [],
                categoryName: category.name,
                bestTime: bestTime
              }
            } else {
              const currentBest = guildBestRewards[guildName]
              // Обновляем, если новая награда лучше:
              // 1. Более высокая сложность
              // 2. При равной сложности - лучшее место (меньший rank)
              const isBetter = difficulty > currentBest.difficulty ||
                              (difficulty === currentBest.difficulty && rank < currentBest.rank)
              
              if (isBetter) {
                guildBestRewards[guildName] = {
                  guildName,
                  guildImage: getGuildImage(guildName),
                  rank,
                  rankType: rewardType,
                  difficulty,
                  gp: reward.reward.gp || 0,
                  guildExp: reward.reward.guildExp || 0,
                  team: reward.team || [],
                  categoryName: category.name,
                  bestTime: bestTime
                }
              }
            }
          }
        }
      }
      
      // Сортируем по GP из лучшей награды и берем топ 3
      const sortedGuilds = Object.values(guildBestRewards)
        .sort((a, b) => {
          // Сначала по GP
          if (b.gp !== a.gp) {
            return b.gp - a.gp
          }
          // При равных GP - по сложности
          if (b.difficulty !== a.difficulty) {
            return b.difficulty - a.difficulty
          }
          // При равной сложности - по месту (лучше место = меньше rank)
          return a.rank - b.rank
        })
        .slice(0, 3)
      
      return sortedGuilds.map((guild, index) => ({
        ...guild,
        position: index + 1,
        medal: index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉',
        totalGP: guild.gp, // GP из одной награды
        totalGuildExp: guild.guildExp, // Опыт гильдии из одной награды
        bestDifficulty: guild.difficulty,
        bestRank: guild.rank,
        bestRankType: guild.rankType,
        bestTime: guild.bestTime || '--:--:--', // Время из лучшей награды
        rewards: [guild], // Массив с одной наградой для совместимости
        guildImage: guild.guildImage || getGuildImage(guild.guildName) // Убеждаемся, что картинка есть
      }))
    } catch (error) {
      console.error('Error calculating top teams by points:', error)
      return []
    }
  }, [speedrunCategories])
  
  // Проверяем, активен ли спидран
  const speedrunActive = useMemo(() => {
    return isSpeedrunActive(guildConfig.speedrun)
  }, [])

  const toggleCategory = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId)
  }

  const getTeamForCategory = (category, rewardType) => {
    const reward = category.rewards[rewardType]
    if (reward && reward.team) {
      return reward.team
    }
    return []
  }

  return (
    <div className="main-content speedrun-container">
      <div className="speedrun-content">
        {/* Текущее топ место гильдии (когда спидран активен) */}
        {speedrunActive && (
          <div className="current-guild-top-place-section">
            {showBestPlace && currentGuildTopPlace ? (
            <div className={`current-top-place-card current-top-place-rank-${currentGuildTopPlace.rank}`}>
              <div className="current-top-place-header">
                <div className="current-top-place-title">
                  <span className="current-top-place-medal">
                    {currentGuildTopPlace.rank === 1 ? '🥇' : currentGuildTopPlace.rank === 2 ? '🥈' : '🥉'}
                  </span>
                  <div className="current-top-place-info">
                    <span className="current-top-place-label">Ваше лучшее место в спидране</span>
                    <span className="current-top-place-rank-text">
                      Топ-{currentGuildTopPlace.rank} место
                    </span>
                  </div>
                </div>
                <div className="current-top-place-difficulty">
                  <span className="current-top-place-difficulty-label">Сложность</span>
                  <span className="current-top-place-difficulty-value">{currentGuildTopPlace.difficulty}</span>
                </div>
              </div>
              
              <div className="current-top-place-content">
                <div className="current-top-place-rewards">
                  {currentGuildTopPlace.reward.gp > 0 && (
                    <div className="current-top-place-reward-item">
                      <img src={getGPImage()} alt="GP" className="current-top-place-reward-icon-image" />
                      <span className="current-top-place-reward-value">{currentGuildTopPlace.reward.gp.toLocaleString()} GP</span>
                    </div>
                  )}
                  {currentGuildTopPlace.reward.guildExp > 0 && (
                    <div className="current-top-place-reward-item">
                      <img src={getExpImage()} alt="Опыт гильдии" className="current-top-place-reward-icon-image" />
                      <span className="current-top-place-reward-value">{currentGuildTopPlace.reward.guildExp.toLocaleString()} опыта гильдии</span>
                    </div>
                  )}
                  <div className="current-top-place-reward-item">
                    <span className="current-top-place-reward-icon">⏱</span>
                    <span className="current-top-place-reward-value">{currentGuildTopPlace.bestTime || '--:--:--'}</span>
                  </div>
                </div>
                
                {currentGuildTopPlace.team && currentGuildTopPlace.team.length > 0 && (
                  <div className="current-top-place-team">
                    <span className="current-top-place-team-label">Команда:</span>
                    <div className="current-top-place-team-members">
                      {currentGuildTopPlace.team.slice(0, 5).map((player, index) => (
                        <div key={index} className="current-top-place-team-member">
                          {player.playerAvatar && (
                            <img 
                              src={player.playerAvatar} 
                              alt={player.player} 
                              className="current-top-place-member-avatar" 
                            />
                          )}
                          <span className="current-top-place-member-name">{player.player}</span>
                        </div>
                      ))}
                      {currentGuildTopPlace.team.length > 5 && (
                        <span className="current-top-place-team-more">+{currentGuildTopPlace.team.length - 5}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="current-top-place-empty">
              <div className="current-top-place-empty-icon">📊</div>
              <div className="current-top-place-empty-text">
                {showBestPlace ? 'Топ место не занято' : 'Лучшего места нет'}
              </div>
              <div className="current-top-place-empty-hint">
                {showBestPlace ? 'Участвуйте в спидранах, чтобы занять призовое место' : 'Лучшее место в спидране отключено в настройках'}
              </div>
            </div>
          )}
          </div>
        )}

        {/* Топ 3 команды по очкам из наград предыдущего спидрана (когда спидран неактивен) */}
        {!speedrunActive && topTeamsByPoints.length > 0 && (
          <div className="top-teams-by-points-section">
            <div className="top-teams-title">🏆 Топ 3 команды по заработанным очкам в предыдущем спидране</div>
            <div className="top-teams-grid">
              {topTeamsByPoints.map((team) => (
                <div key={team.guildName} className={`top-team-card top-team-rank-${team.position}`}>
                  <div className="top-team-header">
                    <div className="top-team-medal">{team.medal}</div>
                    {team.guildImage && (
                      <div className="top-team-guild-image">
                        <img 
                          src={team.guildImage} 
                          alt={team.guildName} 
                          className="top-team-guild-avatar" 
                        />
                      </div>
                    )}
                    <div className="top-team-info">
                      <div className="top-team-name">{team.guildName}</div>
                      <div className="top-team-rank-text">Место #{team.position} по очкам</div>
                    </div>
                  </div>
                  <div className="top-team-stats">
                    <div className="top-team-stat">
                      <span className="top-team-stat-icon">🎯</span>
                      <span className="top-team-stat-value">{team.bestDifficulty}</span>
                      <span className="top-team-stat-label">сложность</span>
                    </div>
                    <div className="top-team-stat">
                      <span className="top-team-stat-icon">🏆</span>
                      <span className="top-team-stat-value">
                        {team.bestRank === 1 ? 'Топ-1' : team.bestRank === 2 ? 'Топ-2' : 'Топ-3'}
                      </span>
                      <span className="top-team-stat-label">место</span>
                    </div>
                    <div className="top-team-stat">
                      <span className="top-team-stat-icon">⏱️</span>
                      <span className="top-team-stat-value">{team.bestTime || '--:--:--'}</span>
                      <span className="top-team-stat-label">время</span>
                    </div>
                  </div>
                  
                  {/* Участники команды из лучшей награды */}
                  {team.team && team.team.length > 0 && (
                    <div className="top-team-members">
                      <div className="top-team-members-label">Команда (лучший результат):</div>
                      <div className="top-team-members-list">
                        {team.team.slice(0, 5).map((player, index) => (
                          <div key={index} className="top-team-member">
                            {player.playerAvatar && (
                              <img 
                                src={player.playerAvatar} 
                                alt={player.player} 
                                className="top-team-member-avatar" 
                              />
                            )}
                            <span className="top-team-member-name">{player.player}</span>
                          </div>
                        ))}
                        {team.team.length > 5 && (
                          <span className="top-team-members-more">+{team.team.length - 5}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {timeRemaining && (
          <div className="speedrun-header-section">
            <div className="speedrun-timer">
              <div className="timer-icon">⏱️</div>
              <div className="timer-content">
                <div className="timer-label">
                  {timeRemaining.isActive 
                    ? 'До окончания приема спидран' 
                    : 'До начала следующего спидрана'}
                </div>
                <div className="timer-values">
                  <div className="timer-block">
                    <span className="timer-number">{timeRemaining.days}</span>
                    <span className="timer-unit">дней</span>
                  </div>
                  <span className="timer-separator">:</span>
                  <div className="timer-block">
                    <span className="timer-number">{String(timeRemaining.hours).padStart(2, '0')}</span>
                    <span className="timer-unit">часов</span>
                  </div>
                  <span className="timer-separator">:</span>
                  <div className="timer-block">
                    <span className="timer-number">{String(timeRemaining.minutes).padStart(2, '0')}</span>
                    <span className="timer-unit">минут</span>
                  </div>
                  <span className="timer-separator">:</span>
                  <div className="timer-block">
                    <span className="timer-number">{String(timeRemaining.seconds).padStart(2, '0')}</span>
                    <span className="timer-unit">секунд</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Статистика и история призовых мест */}
        {detailedTopHistory.length > 0 && (
          <>
            {/* Статистика по призовым местам */}
            <div className="prize-statistics-section">
              <div className="prize-statistics-title">🏆 Статистика призовых мест</div>
              <div className="prize-statistics-grid">
                <div className="prize-stat-card prize-stat-gold">
                  <div className="prize-stat-header">
                    <span className="prize-stat-icon">🥇</span>
                    <span className="prize-stat-label">Топ-1 места</span>
                  </div>
                  <div className="prize-stat-value">{prizeStatistics.top1.count}</div>
                  <div className="prize-stat-details">
                    <div className="prize-stat-detail">
                      <span className="detail-label">Макс. сложность:</span>
                      <span className="detail-value">{prizeStatistics.top1.maxDifficulty || '-'}</span>
                    </div>
                    <div className="prize-stat-detail">
                      <span className="detail-label">Всего GP:</span>
                      <span className="detail-value">{prizeStatistics.top1.totalGP.toLocaleString()}</span>
                    </div>
                    <div className="prize-stat-detail">
                      <span className="detail-label">Всего опыта гильдии:</span>
                      <span className="detail-value">{prizeStatistics.top1.totalGuildExp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="prize-stat-card prize-stat-silver">
                  <div className="prize-stat-header">
                    <span className="prize-stat-icon">🥈</span>
                    <span className="prize-stat-label">Топ-2 места</span>
                  </div>
                  <div className="prize-stat-value">{prizeStatistics.top2.count}</div>
                  <div className="prize-stat-details">
                    <div className="prize-stat-detail">
                      <span className="detail-label">Макс. сложность:</span>
                      <span className="detail-value">{prizeStatistics.top2.maxDifficulty || '-'}</span>
                    </div>
                    <div className="prize-stat-detail">
                      <span className="detail-label">Всего GP:</span>
                      <span className="detail-value">{prizeStatistics.top2.totalGP.toLocaleString()}</span>
                    </div>
                    <div className="prize-stat-detail">
                      <span className="detail-label">Всего опыта гильдии:</span>
                      <span className="detail-value">{prizeStatistics.top2.totalGuildExp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="prize-stat-card prize-stat-bronze">
                  <div className="prize-stat-header">
                    <span className="prize-stat-icon">🥉</span>
                    <span className="prize-stat-label">Топ-3 места</span>
                  </div>
                  <div className="prize-stat-value">{prizeStatistics.top3.count}</div>
                  <div className="prize-stat-details">
                    <div className="prize-stat-detail">
                      <span className="detail-label">Макс. сложность:</span>
                      <span className="detail-value">{prizeStatistics.top3.maxDifficulty || '-'}</span>
                    </div>
                    <div className="prize-stat-detail">
                      <span className="detail-label">Всего GP:</span>
                      <span className="detail-value">{prizeStatistics.top3.totalGP.toLocaleString()}</span>
                    </div>
                    <div className="prize-stat-detail">
                      <span className="detail-label">Всего опыта гильдии:</span>
                      <span className="detail-value">{prizeStatistics.top3.totalGuildExp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="prize-stat-card prize-stat-total">
                  <div className="prize-stat-header">
                    <span className="prize-stat-icon">⭐</span>
                    <span className="prize-stat-label">Всего призовых мест</span>
                  </div>
                  <div className="prize-stat-value">{prizeStatistics.total.count}</div>
                  <div className="prize-stat-details">
                    <div className="prize-stat-detail">
                      <span className="detail-label">Всего GP:</span>
                      <span className="detail-value">{prizeStatistics.total.totalGP.toLocaleString()}</span>
                    </div>
                    <div className="prize-stat-detail">
                      <span className="detail-label">Всего опыта гильдии:</span>
                      <span className="detail-value">{prizeStatistics.total.totalGuildExp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Блок со сложностями отображается только когда спидран активен */}
        {speedrunActive && (
          <div className="difficulties-section">
            <div className="difficulties-section-header">
              <h2 className="difficulties-section-title">Сложности</h2>
              <div className="speedrun-warning">
                <div className="warning-icon">⚠️</div>
                <div className="warning-text">
                  <strong>Важно:</strong> Спидран засчитывается только если все члены команды состоят в одной гильдии
                </div>
              </div>
            </div>
            <div className="speedrun-categories-aaa">
          {speedrunCategories.map((category) => {
                const rewards = category.rewards
                const hasAnyReward = rewards.top1 || rewards.top2 || rewards.top3
                const bestTime = getGuildPositions(category.records)[0]?.bestTime || '--:--:--'
                const currentGuildPos = getCurrentGuildPosition(category)
                
                // Получаем картинки гильдий для отображения
                const guildImages = []
                if (rewards.top1) {
                  guildImages.push({ guild: rewards.top1.guild, rank: 1 })
                }
                if (rewards.top2) {
                  guildImages.push({ guild: rewards.top2.guild, rank: 2 })
                }
                if (rewards.top3) {
                  guildImages.push({ guild: rewards.top3.guild, rank: 3 })
                }
            
            return (
              <div 
                key={category.id} 
                    className={`difficulty-card-aaa ${openCategory === category.id ? 'is-expanded-aaa' : ''}`}
              >
                <div 
                  className="difficulty-header-aaa"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="difficulty-badge-aaa">
                    <span className="difficulty-value-aaa">{category.difficulty}</span>
                  </div>
                  
                  <div className="difficulty-info-aaa">
                    {guildImages.length > 0 && (
                      <div className="difficulty-guild-images-aaa">
                        {guildImages.map((item, idx) => (
                          <img
                            key={idx}
                            src={getGuildImage(item.guild)}
                            alt={item.guild}
                            className="difficulty-guild-image-aaa"
                            title={`${item.guild} - Топ-${item.rank}`}
                          />
                        ))}
                      </div>
                    )}
                    <span className="best-time-aaa">{bestTime}</span>
                      </div>
                  
                  <div className={`expand-icon-aaa ${openCategory === category.id ? 'expanded-aaa' : ''}`}>
                    {openCategory === category.id ? '▲' : '▼'}
                  </div>
                </div>
                {openCategory === category.id && (
                  <div className="difficulty-content-aaa">
                    {/* Топ-1 */}
                    {rewards.top1 && (
                      <div className="prize-block-aaa prize-gold-aaa">
                        <div className="prize-header-aaa">
                          <div className="prize-title-aaa">
                            <span className="prize-medal-aaa">🥇</span>
                            <span className="prize-name-aaa">Топ-1</span>
                            <div className="prize-guild-wrapper-aaa">
                              {getGuildImage(rewards.top1.guild) && (
                                <img 
                                  src={getGuildImage(rewards.top1.guild)} 
                                  alt={rewards.top1.guild} 
                                  className="prize-guild-image-aaa" 
                                />
                              )}
                              <span className={`prize-guild-aaa ${rewards.top1.guild === currentGuildName ? 'is-current-aaa' : ''}`}>
                                {rewards.top1.guild === currentGuildName ? 'Ваша гильдия' : rewards.top1.guild}
                              </span>
                            </div>
                          </div>
                          <div className="prize-stats-aaa">
                            {rewards.top1.reward.gp > 0 && (
                              <span className="prize-stat-aaa">
                                <img src={getGPImage()} alt="GP" className="prize-stat-icon-image" />
                                {rewards.top1.reward.gp.toLocaleString()} GP
                              </span>
                            )}
                            {rewards.top1.reward.guildExp > 0 && (
                              <span className="prize-stat-aaa">
                                <img src={getExpImage()} alt="Опыт гильдии" className="prize-stat-icon-image" />
                                {rewards.top1.reward.guildExp.toLocaleString()} опыта
                              </span>
                            )}
                            <span className="prize-time-aaa">⏱ {getGuildPositions(category.records)[0]?.bestTime || '--:--:--'}</span>
                          </div>
                        </div>
                        <div className="prize-players-aaa">
                          {getTeamForCategory(category, 'top1').map((player, playerIndex) => (
                            <div key={playerIndex} className="player-row-aaa">
                              <div className="player-hero-aaa">
                                {typeof player.heroImage === 'string' ? (
                                  player.heroImage.startsWith('/') || player.heroImage.startsWith('http') ? (
                                    <img src={player.heroImage} alt={player.player} className="hero-img-aaa" />
                                  ) : (
                                    <span>{player.heroImage}</span>
                                  )
                                ) : (
                                  <img src={player.heroImage} alt={player.player} className="hero-img-aaa" />
                                )}
                              </div>
                              <div className="player-main-aaa">
                                {player.playerAvatar && (
                                  <img 
                                    src={player.playerAvatar} 
                                    alt={player.player} 
                                    className="player-avatar-aaa" 
                                  />
                                )}
                                <span className="player-name-aaa">{player.player}</span>
                              </div>
                              <div className="player-items-aaa">
                                {player.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="item-mini-aaa">
                                    {typeof item === 'string' ? (
                                      item.startsWith('/') || item.startsWith('http') ? (
                                        <img src={item} alt={`Item ${itemIndex + 1}`} className="item-img-aaa" />
                                      ) : (
                                        <span>{item}</span>
                                      )
                                    ) : (
                                      <img src={item} alt={`Item ${itemIndex + 1}`} className="item-img-aaa" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Топ-2 */}
                    {rewards.top2 && (
                      <div className="prize-block-aaa prize-silver-aaa">
                        <div className="prize-header-aaa">
                          <div className="prize-title-aaa">
                            <span className="prize-medal-aaa">🥈</span>
                            <span className="prize-name-aaa">Топ-2</span>
                            <div className="prize-guild-wrapper-aaa">
                              {getGuildImage(rewards.top2.guild) && (
                                <img 
                                  src={getGuildImage(rewards.top2.guild)} 
                                  alt={rewards.top2.guild} 
                                  className="prize-guild-image-aaa" 
                                />
                              )}
                              <span className={`prize-guild-aaa ${rewards.top2.guild === currentGuildName ? 'is-current-aaa' : ''}`}>
                                {rewards.top2.guild === currentGuildName ? 'Ваша гильдия' : rewards.top2.guild}
                              </span>
                            </div>
                          </div>
                          <div className="prize-stats-aaa">
                            {rewards.top2.reward.gp > 0 && (
                              <span className="prize-stat-aaa">
                                <img src={getGPImage()} alt="GP" className="prize-stat-icon-image" />
                                {rewards.top2.reward.gp.toLocaleString()} GP
                              </span>
                            )}
                            {rewards.top2.reward.guildExp > 0 && (
                              <span className="prize-stat-aaa">
                                <img src={getExpImage()} alt="Опыт гильдии" className="prize-stat-icon-image" />
                                {rewards.top2.reward.guildExp.toLocaleString()} опыта
                              </span>
                            )}
                            <span className="prize-time-aaa">⏱ {getGuildPositions(category.records)[1]?.bestTime || '--:--:--'}</span>
                          </div>
                        </div>
                        <div className="prize-players-aaa">
                          {getTeamForCategory(category, 'top2').map((player, playerIndex) => (
                            <div key={playerIndex} className="player-row-aaa">
                              <div className="player-hero-aaa">
                                {typeof player.heroImage === 'string' ? (
                                  player.heroImage.startsWith('/') || player.heroImage.startsWith('http') ? (
                                    <img src={player.heroImage} alt={player.player} className="hero-img-aaa" />
                                  ) : (
                                    <span>{player.heroImage}</span>
                                  )
                                ) : (
                                  <img src={player.heroImage} alt={player.player} className="hero-img-aaa" />
                                )}
                              </div>
                              <div className="player-main-aaa">
                                {player.playerAvatar && (
                                  <img 
                                    src={player.playerAvatar} 
                                    alt={player.player} 
                                    className="player-avatar-aaa" 
                                  />
                                )}
                                <span className="player-name-aaa">{player.player}</span>
                              </div>
                              <div className="player-items-aaa">
                                {player.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="item-mini-aaa">
                                    {typeof item === 'string' ? (
                                      item.startsWith('/') || item.startsWith('http') ? (
                                        <img src={item} alt={`Item ${itemIndex + 1}`} className="item-img-aaa" />
                                      ) : (
                                        <span>{item}</span>
                                      )
                                    ) : (
                                      <img src={item} alt={`Item ${itemIndex + 1}`} className="item-img-aaa" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Топ-3 */}
                    {rewards.top3 && (
                      <div className="prize-block-aaa prize-bronze-aaa">
                        <div className="prize-header-aaa">
                          <div className="prize-title-aaa">
                            <span className="prize-medal-aaa">🥉</span>
                            <span className="prize-name-aaa">Топ-3</span>
                            <div className="prize-guild-wrapper-aaa">
                              {getGuildImage(rewards.top3.guild) && (
                                <img 
                                  src={getGuildImage(rewards.top3.guild)} 
                                  alt={rewards.top3.guild} 
                                  className="prize-guild-image-aaa" 
                                />
                              )}
                              <span className={`prize-guild-aaa ${rewards.top3.guild === currentGuildName ? 'is-current-aaa' : ''}`}>
                                {rewards.top3.guild === currentGuildName ? 'Ваша гильдия' : rewards.top3.guild}
                              </span>
                            </div>
                          </div>
                          <div className="prize-stats-aaa">
                            {rewards.top3.reward.gp > 0 && (
                              <span className="prize-stat-aaa">
                                <img src={getGPImage()} alt="GP" className="prize-stat-icon-image" />
                                {rewards.top3.reward.gp.toLocaleString()} GP
                              </span>
                            )}
                            {rewards.top3.reward.guildExp > 0 && (
                              <span className="prize-stat-aaa">
                                <img src={getExpImage()} alt="Опыт гильдии" className="prize-stat-icon-image" />
                                {rewards.top3.reward.guildExp.toLocaleString()} опыта
                              </span>
                            )}
                            <span className="prize-time-aaa">⏱ {getGuildPositions(category.records)[2]?.bestTime || '--:--:--'}</span>
                          </div>
                        </div>
                        <div className="prize-players-aaa">
                          {getTeamForCategory(category, 'top3').map((player, playerIndex) => (
                            <div key={playerIndex} className="player-row-aaa">
                              <div className="player-hero-aaa">
                                {typeof player.heroImage === 'string' ? (
                                  player.heroImage.startsWith('/') || player.heroImage.startsWith('http') ? (
                                    <img src={player.heroImage} alt={player.player} className="hero-img-aaa" />
                                  ) : (
                                    <span>{player.heroImage}</span>
                                  )
                                ) : (
                                  <img src={player.heroImage} alt={player.player} className="hero-img-aaa" />
                                )}
                              </div>
                              <div className="player-main-aaa">
                                {player.playerAvatar && (
                                  <img 
                                    src={player.playerAvatar} 
                                    alt={player.player} 
                                    className="player-avatar-aaa" 
                                  />
                                )}
                                <span className="player-name-aaa">{player.player}</span>
                              </div>
                              <div className="player-items-aaa">
                                      {player.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="item-mini-aaa">
                                    {typeof item === 'string' ? (
                                      item.startsWith('/') || item.startsWith('http') ? (
                                        <img src={item} alt={`Item ${itemIndex + 1}`} className="item-img-aaa" />
                                      ) : (
                                        <span>{item}</span>
                                      )
                                    ) : (
                                      <img src={item} alt={`Item ${itemIndex + 1}`} className="item-img-aaa" />
                                    )}
                </div>
                                      ))}
                                    </div>
                                  </div>
                          ))}
                                </div>
                      </div>
                    )}

                    {!hasAnyReward && (
                      <div className="no-prizes-aaa">
                        <span className="no-prizes-icon-aaa">ℹ️</span>
                        <span className="no-prizes-text-aaa">Награды недоступны</span>
                    </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpeedrunTab
