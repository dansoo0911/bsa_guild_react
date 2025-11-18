// Система достижений - AAA уровень
export const ACHIEVEMENTS = {
  FIRST_WIN: {
    id: 'first_win',
    name: 'Первая победа',
    description: 'Выиграйте первую игру',
    icon: '🎯',
    reward: { diamonds: 10, shields: 50 },
    condition: (stats) => stats.totalWins >= 1
  },
  BIG_WINNER: {
    id: 'big_winner',
    name: 'Большой выигрыш',
    description: 'Выиграйте 10,000 или больше',
    icon: '💰',
    reward: { diamonds: 100, shields: 500 },
    condition: (stats) => stats.biggestWin >= 10000
  },
  STREAK_MASTER: {
    id: 'streak_master',
    name: 'Мастер серий',
    description: 'Выиграйте 10 игр подряд',
    icon: '🔥',
    reward: { diamonds: 50, shields: 250 },
    condition: (stats) => stats.maxWinStreak >= 10
  },
  JACKPOT_HUNTER: {
    id: 'jackpot_hunter',
    name: 'Охотник за джекпотом',
    description: 'Выиграйте джекпот',
    icon: '🎰',
    reward: { diamonds: 500, shields: 2500 },
    condition: (stats) => stats.jackpotWins >= 1
  },
  VETERAN: {
    id: 'veteran',
    name: 'Ветеран',
    description: 'Сыграйте 1000 игр',
    icon: '🏆',
    reward: { diamonds: 200, shields: 1000 },
    condition: (stats) => stats.totalGames >= 1000
  },
  PERFECT_MATCH: {
    id: 'perfect_match',
    name: 'Идеальное совпадение',
    description: 'Выиграйте с тремя одинаковыми символами 10 раз',
    icon: '✨',
    reward: { diamonds: 150, shields: 750 },
    condition: (stats) => stats.perfectMatches >= 10
  },
  MILLIONAIRE: {
    id: 'millionaire',
    name: 'Миллионер',
    description: 'Накопите 1,000,000 в джекпоте',
    icon: '💎',
    reward: { diamonds: 1000, shields: 5000 },
    condition: (stats) => stats.maxJackpot >= 1000000
  },
  DAILY_PLAYER: {
    id: 'daily_player',
    name: 'Ежедневный игрок',
    description: 'Играйте 7 дней подряд',
    icon: '📅',
    reward: { diamonds: 75, shields: 375 },
    condition: (stats) => stats.consecutiveDays >= 7
  }
}

export class AchievementSystem {
  constructor() {
    this.unlockedAchievements = new Set()
    this.pendingRewards = []
  }

  // Проверить достижения
  checkAchievements(stats) {
    const newAchievements = []
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (!this.unlockedAchievements.has(achievement.id) && achievement.condition(stats)) {
        this.unlockedAchievements.add(achievement.id)
        this.pendingRewards.push(achievement.reward)
        newAchievements.push(achievement)
      }
    })
    
    return newAchievements
  }

  // Получить награды
  claimRewards() {
    const rewards = { diamonds: 0, shields: 0 }
    
    this.pendingRewards.forEach(reward => {
      rewards.diamonds += reward.diamonds || 0
      rewards.shields += reward.shields || 0
    })
    
    this.pendingRewards = []
    return rewards
  }

  // Получить прогресс достижения
  getAchievementProgress(achievementId, stats) {
    const achievement = ACHIEVEMENTS[achievementId]
    if (!achievement) return null
    
    // Упрощенная логика прогресса
    if (achievementId === 'veteran') {
      return { current: stats.totalGames, target: 1000, percentage: Math.min(100, (stats.totalGames / 1000) * 100) }
    }
    if (achievementId === 'streak_master') {
      return { current: stats.maxWinStreak, target: 10, percentage: Math.min(100, (stats.maxWinStreak / 10) * 100) }
    }
    if (achievementId === 'perfect_match') {
      return { current: stats.perfectMatches, target: 10, percentage: Math.min(100, (stats.perfectMatches / 10) * 100) }
    }
    
    return { current: 0, target: 1, percentage: 0 }
  }

  // Сохранить
  save() {
    return {
      unlocked: Array.from(this.unlockedAchievements),
      pendingRewards: this.pendingRewards
    }
  }

  // Загрузить
  load(data) {
    if (data) {
      this.unlockedAchievements = new Set(data.unlocked || [])
      this.pendingRewards = data.pendingRewards || []
    }
  }
}

