// Система комбо и мультипликаторов - AAA уровень
export class ComboSystem {
  constructor() {
    this.currentCombo = 0
    this.maxCombo = 0
    this.comboMultiplier = 1.0
    this.lastWinTime = null
    this.comboTimeout = 5000 // 5 секунд для поддержания комбо
  }

  // Обработать выигрыш для комбо
  processWin(winAmount) {
    const now = Date.now()
    
    if (this.lastWinTime && (now - this.lastWinTime) < this.comboTimeout) {
      // Продолжаем комбо
      this.currentCombo++
    } else {
      // Начинаем новое комбо
      this.currentCombo = 1
    }
    
    this.lastWinTime = now
    
    // Обновляем максимальное комбо
    if (this.currentCombo > this.maxCombo) {
      this.maxCombo = this.currentCombo
    }
    
    // Вычисляем мультипликатор комбо
    this.comboMultiplier = this.calculateComboMultiplier(this.currentCombo)
    
    return {
      combo: this.currentCombo,
      multiplier: this.comboMultiplier,
      bonusWin: Math.floor(winAmount * (this.comboMultiplier - 1))
    }
  }

  // Вычислить мультипликатор комбо
  calculateComboMultiplier(combo) {
    if (combo <= 1) return 1.0
    if (combo <= 3) return 1.1 + (combo - 1) * 0.05 // 1.1, 1.15, 1.2
    if (combo <= 5) return 1.2 + (combo - 3) * 0.1 // 1.3, 1.4
    if (combo <= 10) return 1.4 + (combo - 5) * 0.15 // 1.55, 1.7, 1.85, 2.0, 2.15
    return 2.15 + (combo - 10) * 0.1 // +0.1 за каждое комбо после 10
  }

  // Обработать проигрыш
  processLoss() {
    // Сбрасываем комбо через таймаут
    setTimeout(() => {
      if (Date.now() - this.lastWinTime >= this.comboTimeout) {
        this.currentCombo = 0
        this.comboMultiplier = 1.0
      }
    }, this.comboTimeout)
  }

  // Получить текущее состояние комбо
  getComboState() {
    const now = Date.now()
    const isActive = this.lastWinTime && (now - this.lastWinTime) < this.comboTimeout
    
    return {
      combo: isActive ? this.currentCombo : 0,
      multiplier: isActive ? this.comboMultiplier : 1.0,
      timeRemaining: isActive ? Math.max(0, this.comboTimeout - (now - this.lastWinTime)) : 0,
      maxCombo: this.maxCombo
    }
  }

  // Сбросить комбо
  reset() {
    this.currentCombo = 0
    this.comboMultiplier = 1.0
    this.lastWinTime = null
  }

  // Сохранить
  save() {
    return {
      currentCombo: this.currentCombo,
      maxCombo: this.maxCombo,
      comboMultiplier: this.comboMultiplier,
      lastWinTime: this.lastWinTime
    }
  }

  // Загрузить
  load(data) {
    if (data) {
      this.currentCombo = data.currentCombo || 0
      this.maxCombo = data.maxCombo || 0
      this.comboMultiplier = data.comboMultiplier || 1.0
      this.lastWinTime = data.lastWinTime
    }
  }
}

