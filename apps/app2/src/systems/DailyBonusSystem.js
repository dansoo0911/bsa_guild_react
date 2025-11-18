// Система ежедневных бонусов - AAA уровень
export class DailyBonusSystem {
  constructor() {
    this.lastClaimDate = null
    this.consecutiveDays = 0
    this.bonusDay = 1
  }

  // Проверить доступность бонуса
  canClaimBonus() {
    if (!this.lastClaimDate) return true
    
    const now = new Date()
    const lastClaim = new Date(this.lastClaimDate)
    const daysDiff = Math.floor((now - lastClaim) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 0) return false // Уже забрали сегодня
    if (daysDiff === 1) return true // Следующий день
    return false // Пропустили день - сброс серии
  }

  // Получить ежедневный бонус
  claimDailyBonus(level = 1, vipLevel = 0) {
    if (!this.canClaimBonus()) return null
    
    const now = new Date()
    const lastClaim = new Date(this.lastClaimDate || 0)
    const daysDiff = Math.floor((now - lastClaim) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 1) {
      this.consecutiveDays++
    } else if (daysDiff > 1) {
      this.consecutiveDays = 1 // Сброс серии
      this.bonusDay = 1
    } else {
      this.consecutiveDays = 1
    }
    
    // Бонусы по дням (увеличиваются)
    const baseBonuses = [
      { diamonds: 10, shields: 50 },
      { diamonds: 15, shields: 75 },
      { diamonds: 20, shields: 100 },
      { diamonds: 30, shields: 150 },
      { diamonds: 50, shields: 250 },
      { diamonds: 75, shields: 375 },
      { diamonds: 100, shields: 500, bonus: 'jackpot_chance' } // 7-й день - особый бонус
    ]
    
    const dayIndex = Math.min(this.consecutiveDays - 1, baseBonuses.length - 1)
    const baseBonus = baseBonuses[dayIndex] || baseBonuses[baseBonuses.length - 1]
    
    // Множители от уровня и VIP
    const levelMultiplier = 1 + (level * 0.1)
    const vipMultiplier = 1 + (vipLevel * 0.2)
    
    const bonus = {
      diamonds: Math.floor(baseBonus.diamonds * levelMultiplier * vipMultiplier),
      shields: Math.floor(baseBonus.shields * levelMultiplier * vipMultiplier),
      day: this.consecutiveDays,
      specialBonus: baseBonus.bonus
    }
    
    this.lastClaimDate = now.toISOString()
    this.bonusDay = this.consecutiveDays
    
    return bonus
  }

  // Получить информацию о следующем бонусе
  getNextBonusInfo(level = 1, vipLevel = 0) {
    const baseBonuses = [
      { diamonds: 10, shields: 50 },
      { diamonds: 15, shields: 75 },
      { diamonds: 20, shields: 100 },
      { diamonds: 30, shields: 150 },
      { diamonds: 50, shields: 250 },
      { diamonds: 75, shields: 375 },
      { diamonds: 100, shields: 500, bonus: 'jackpot_chance' }
    ]
    
    const nextDay = this.consecutiveDays + 1
    const dayIndex = Math.min(nextDay - 1, baseBonuses.length - 1)
    const baseBonus = baseBonuses[dayIndex] || baseBonuses[baseBonuses.length - 1]
    
    const levelMultiplier = 1 + (level * 0.1)
    const vipMultiplier = 1 + (vipLevel * 0.2)
    
    return {
      day: nextDay,
      diamonds: Math.floor(baseBonus.diamonds * levelMultiplier * vipMultiplier),
      shields: Math.floor(baseBonus.shields * levelMultiplier * vipMultiplier),
      specialBonus: baseBonus.bonus
    }
  }

  // Сохранить
  save() {
    return {
      lastClaimDate: this.lastClaimDate,
      consecutiveDays: this.consecutiveDays,
      bonusDay: this.bonusDay
    }
  }

  // Загрузить
  load(data) {
    if (data) {
      this.lastClaimDate = data.lastClaimDate
      this.consecutiveDays = data.consecutiveDays || 0
      this.bonusDay = data.bonusDay || 1
    }
  }
}

