// Система инвентаря казино - предметы выигрываются и хранятся здесь
import { GAME_SYMBOLS } from '../utils/imageUtils'
import { ITEM_VALUES, getItemValue, getItemExchangeValue } from './InventorySystem'

export class CasinoInventorySystem {
  constructor() {
    this.items = {
      scroll: 0,
      treasure: 0,
      bless: 0,
      rosh: 0,
      spellBuff: 0
    }
  }

  // Добавить предмет в инвентарь казино
  addItem(itemType, quantity = 1) {
    if (this.items.hasOwnProperty(itemType)) {
      this.items[itemType] += quantity
      return true
    }
    return false
  }

  // Забрать предмет из казино (переместить в инвентарь игрока)
  claimItem(itemType, quantity = 1) {
    if (this.items.hasOwnProperty(itemType) && this.items[itemType] >= quantity) {
      this.items[itemType] -= quantity
      return { type: itemType, quantity }
    }
    return null
  }

  // Обменять предмет на бесплатные спины
  exchangeForFreeSpins(itemType, quantity = 1) {
    if (this.items.hasOwnProperty(itemType) && this.items[itemType] >= quantity) {
      this.items[itemType] -= quantity
      
      // Стоимость предмета определяет количество бесплатных спинов
      const itemValue = getItemValue(itemType, 'diamonds')
      const spinsPerItem = Math.max(1, Math.floor(itemValue / 10)) // 1 спин за каждые 10 единиц стоимости
      
      return {
        spins: spinsPerItem * quantity,
        itemType,
        quantity
      }
    }
    return null
  }

  // Получить количество предмета
  getItemCount(itemType) {
    return this.items[itemType] || 0
  }

  // Получить все предметы в инвентаре казино
  getAllItems() {
    return Object.entries(this.items)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({
        type,
        count,
        name: GAME_SYMBOLS[type]?.name || type,
        image: GAME_SYMBOLS[type]?.getRandomImage(),
        value: getItemValue(type, 'diamonds'),
        exchangeValue: getItemExchangeValue(type, 'diamonds'),
        freeSpinsValue: Math.max(1, Math.floor(getItemValue(type, 'diamonds') / 10))
      }))
  }

  // Получить общее количество предметов
  getTotalItemsCount() {
    return Object.values(this.items).reduce((sum, count) => sum + count, 0)
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

