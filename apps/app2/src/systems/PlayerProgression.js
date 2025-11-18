// Система прогрессии игрока - AAA уровень
export class PlayerProgression {
  constructor() {
    this.level = 1
    this.experience = 0
    this.experienceToNextLevel = 100
    this.totalExperience = 0
    this.vipLevel = 0
    this.vipPoints = 0
    this.vipPointsToNext = 1000
  }

  // Получить опыт за игру
  getExperienceForGame(win, betAmount, isBigWin) {
    let exp = Math.floor(betAmount * 0.5) // Базовый опыт от ставки
    
    if (win > 0) {
      exp += Math.floor(win * 0.1) // Опыт от выигрыша
    }
    
    if (isBigWin) {
      exp *= 2 // Удвоение за большой выигрыш
    }
    
    return Math.max(1, exp)
  }

  // Добавить опыт
  addExperience(amount) {
    this.experience += amount
    this.totalExperience += amount
    
    let leveledUp = false
    let newLevel = this.level
    let rewards = null
    
    while (this.experience >= this.experienceToNextLevel) {
      this.experience -= this.experienceToNextLevel
      this.level++
      newLevel = this.level
      this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.2)
      leveledUp = true
      
      // Вычисляем награды за повышение уровня
      // Каждый уровень дает больше наград
      const baseDiamonds = 50
      const baseFreeSpins = 2
      const diamondsReward = baseDiamonds + (this.level * 10)
      const freeSpinsReward = baseFreeSpins + Math.floor(this.level / 5)
      
      // Чередуем награды: четные уровни - кристаллы, нечетные - бесплатные спины
      if (this.level % 2 === 0) {
        rewards = {
          diamonds: diamondsReward,
          freeSpins: 0
        }
      } else {
        rewards = {
          diamonds: 0,
          freeSpins: freeSpinsReward
        }
      }
    }
    
    return { 
      leveledUp, 
      level: newLevel, 
      experience: this.experience, 
      experienceToNext: this.experienceToNextLevel,
      rewards: rewards
    }
  }

  // Добавить VIP очки
  addVIPPoints(amount) {
    this.vipPoints += amount
    
    let vipLeveledUp = false
    while (this.vipPoints >= this.vipPointsToNext) {
      this.vipPoints -= this.vipPointsToNext
      this.vipLevel++
      this.vipPointsToNext = Math.floor(this.vipPointsToNext * 1.5)
      vipLeveledUp = true
    }
    
    return { vipLeveledUp, vipLevel: this.vipLevel, vipPoints: this.vipPoints, vipPointsToNext: this.vipPointsToNext }
  }

  // Получить бонусы уровня
  getLevelBonuses() {
    return {
      experienceMultiplier: 1 + (this.level * 0.05), // +5% опыта за уровень
      winMultiplier: 1 + (this.level * 0.02), // +2% к выигрышам за уровень
      dailyBonusMultiplier: 1 + (this.level * 0.1) // +10% к ежедневным бонусам
    }
  }

  // Получить VIP бонусы
  getVIPBonuses() {
    const vipMultipliers = [0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.4, 1.5, 1.6, 2.0]
    const multiplier = vipMultipliers[Math.min(this.vipLevel, vipMultipliers.length - 1)] || 1
    
    return {
      winMultiplier: multiplier,
      jackpotChance: this.vipLevel * 0.01, // +1% шанс джекпота за VIP уровень
      freeSpins: Math.floor(this.vipLevel / 3), // Бесплатные спины
      dailyBonus: this.vipLevel * 50 // Дополнительный ежедневный бонус
    }
  }

  // Сохранить прогресс
  save() {
    return {
      level: this.level,
      experience: this.experience,
      experienceToNextLevel: this.experienceToNextLevel,
      totalExperience: this.totalExperience,
      vipLevel: this.vipLevel,
      vipPoints: this.vipPoints,
      vipPointsToNext: this.vipPointsToNext
    }
  }

  // Загрузить прогресс
  load(data) {
    if (data) {
      this.level = data.level || 1
      this.experience = data.experience || 0
      this.experienceToNextLevel = data.experienceToNextLevel || 100
      this.totalExperience = data.totalExperience || 0
      this.vipLevel = data.vipLevel || 0
      this.vipPoints = data.vipPoints || 0
      this.vipPointsToNext = data.vipPointsToNext || 1000
    }
  }
}

