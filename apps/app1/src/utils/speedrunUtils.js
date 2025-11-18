/**
 * Утилиты для работы со спидраном
 * Спидран активен каждую неделю с пятницы 00:00 по воскресенье 23:59:59
 */

/**
 * Получает дату начала следующей пятницы (00:00:00)
 */
export function getNextFridayStart() {
  const now = new Date()
  const currentDay = now.getDay() // 0 = воскресенье, 5 = пятница, 6 = суббота
  const daysUntilFriday = currentDay <= 5 ? (5 - currentDay) : (12 - currentDay)
  
  const nextFriday = new Date(now)
  nextFriday.setDate(now.getDate() + daysUntilFriday)
  nextFriday.setHours(0, 0, 0, 0)
  
  return nextFriday
}

/**
 * Получает дату начала текущей пятницы (00:00:00)
 */
export function getCurrentFridayStart() {
  const now = new Date()
  const currentDay = now.getDay()
  const daysSinceFriday = currentDay >= 5 ? (currentDay - 5) : (currentDay + 2)
  
  const currentFriday = new Date(now)
  currentFriday.setDate(now.getDate() - daysSinceFriday)
  currentFriday.setHours(0, 0, 0, 0)
  
  return currentFriday
}

/**
 * Получает дату окончания текущего воскресенья (23:59:59)
 */
export function getCurrentSundayEnd() {
  const fridayStart = getCurrentFridayStart()
  const sundayEnd = new Date(fridayStart)
  sundayEnd.setDate(fridayStart.getDate() + 2) // Пятница + 2 дня = воскресенье
  sundayEnd.setHours(23, 59, 59, 999)
  
  return sundayEnd
}

/**
 * Проверяет, активен ли спидран сейчас (автоматически, без учета ручного переопределения)
 */
export function isSpeedrunActiveAuto() {
  const now = new Date()
  const fridayStart = getCurrentFridayStart()
  const sundayEnd = getCurrentSundayEnd()
  
  return now >= fridayStart && now <= sundayEnd
}

/**
 * Проверяет, активен ли спидран с учетом ручного переопределения
 * @param {Object} speedrunConfig - Конфигурация спидрана из guildConfig
 */
export function isSpeedrunActive(speedrunConfig) {
  // Если есть ручное переопределение, используем его
  if (speedrunConfig && speedrunConfig.manualOverride) {
    return speedrunConfig.isActive === true
  }
  
  // Иначе используем автоматическую логику (пятница-воскресенье)
  return isSpeedrunActiveAuto()
}

/**
 * Получает время до начала следующего периода спидрана
 */
export function getTimeUntilNextSpeedrun() {
  const now = new Date()
  const fridayStart = getCurrentFridayStart()
  const sundayEnd = getCurrentSundayEnd()
  
  // Если сейчас активен спидран, возвращаем время до его окончания
  if (now >= fridayStart && now <= sundayEnd) {
    return sundayEnd
  }
  
  // Иначе возвращаем время до следующей пятницы
  return getNextFridayStart()
}

