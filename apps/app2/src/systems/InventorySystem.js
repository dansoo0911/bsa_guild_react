// Система инвентаря - хранение предметов
import { GAME_SYMBOLS } from '../utils/imageUtils'

// Стоимость предметов в валюте
export const ITEM_VALUES = {
  scroll: { diamonds: 50, shields: 500 },
  treasure: { diamonds: 200, shields: 2000 },
  bless: { diamonds: 150, shields: 1500 },
  rosh: { diamonds: 1000, shields: 10000 },
  spellBuff: { diamonds: 75, shields: 750 }
}

// Получить стоимость предмета
export const getItemValue = (itemType, currency = 'diamonds') => {
  return ITEM_VALUES[itemType]?.[currency] || 0
}

// Получить стоимость обмена (50% от стоимости)
export const getItemExchangeValue = (itemType, currency = 'diamonds') => {
  const fullValue = getItemValue(itemType, currency)
  return Math.floor(fullValue * 0.5)
}

export class InventorySystem {
  constructor() {
    this.items = {
      scroll: 0,
      treasure: 0,
      bless: 0,
      rosh: 0,
      spellBuff: 0
    }
  }

  // Добавить предмет
  addItem(itemType, quantity = 1) {
    if (this.items.hasOwnProperty(itemType)) {
      this.items[itemType] += quantity
      return true
    }
    return false
  }

  // Удалить предмет
  removeItem(itemType, quantity = 1) {
    if (this.items.hasOwnProperty(itemType) && this.items[itemType] >= quantity) {
      this.items[itemType] -= quantity
      return true
    }
    return false
  }

  // Получить количество предмета
  getItemCount(itemType) {
    return this.items[itemType] || 0
  }

  // Получить все предметы
  getAllItems() {
    return Object.entries(this.items)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({
        type,
        count,
        name: GAME_SYMBOLS[type]?.name || type,
        image: GAME_SYMBOLS[type]?.getRandomImage(),
        value: getItemValue(type, 'diamonds'),
        exchangeValue: getItemExchangeValue(type, 'diamonds')
      }))
  }

  // Обменять предмет на валюту
  exchangeItem(itemType, currency = 'diamonds', quantity = 1) {
    if (!this.removeItem(itemType, quantity)) {
      return null
    }

    const exchangeValue = getItemExchangeValue(itemType, currency)
    return {
      currency,
      amount: exchangeValue * quantity,
      itemType,
      quantity
    }
  }

  // Получить общую стоимость инвентаря
  getTotalValue(currency = 'diamonds') {
    let total = 0
    Object.entries(this.items).forEach(([type, count]) => {
      total += getItemValue(type, currency) * count
    })
    return total
  }

  // Сохранить
  save() {
    return { items: { ...this.items } }
  }

  // Загрузить
  load(data) {
    if (data && data.items) {
      this.items = { ...this.items, ...data.items }
    }
  }
}

