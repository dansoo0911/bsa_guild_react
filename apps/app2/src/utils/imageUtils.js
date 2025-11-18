// Импорт изображений валют
import currencyRuby from '../assets/images/currency_ruby.png'
import currencyShield from '../assets/images/currency_shield.png'

// Импорт изображений предметов
import bless from '../assets/images/items/bless.png'
import rosh from '../assets/images/items/rosh.png'
import scroll1 from '../assets/images/items/scroll_1.png'
import scroll2 from '../assets/images/items/scroll_2.png'
import scroll3 from '../assets/images/items/scroll_3.png'
import scroll4 from '../assets/images/items/scroll_4.png'
import scroll5 from '../assets/images/items/scroll_5.png'
import scroll6 from '../assets/images/items/scroll_6.png'
import spellBuff from '../assets/images/items/spell_buff.png'
import treasure1 from '../assets/images/items/treasure_1.png'
import treasure2 from '../assets/images/items/treasure_2.png'
import treasure3 from '../assets/images/items/treasure_3.png'
import treasure4 from '../assets/images/items/treasure_4.png'
import treasure5 from '../assets/images/items/treasure_5.png'
import treasure6 from '../assets/images/items/treasure_6.png'

// Экспорт валют
export const CURRENCY_IMAGES = {
  ruby: currencyRuby,
  shield: currencyShield
}

// Группировка предметов по типам для игры
export const GAME_SYMBOLS = {
  // Свитки (Scrolls) - средний выигрыш
  scroll: {
    name: 'Свиток',
    color: '#ffd700',
    images: [scroll1, scroll2, scroll3, scroll4, scroll5, scroll6],
    getRandomImage: () => {
      const images = GAME_SYMBOLS.scroll.images
      return images[Math.floor(Math.random() * images.length)]
    }
  },
  // Сокровища (Treasures) - большой выигрыш
  treasure: {
    name: 'Сокровище',
    color: '#ff8c00',
    images: [treasure1, treasure2, treasure3, treasure4, treasure5, treasure6],
    getRandomImage: () => {
      const images = GAME_SYMBOLS.treasure.images
      return images[Math.floor(Math.random() * images.length)]
    }
  },
  // Благословение (Bless) - особый предмет
  bless: {
    name: 'Благословение',
    color: '#00ff00',
    images: [bless],
    getRandomImage: () => bless
  },
  // Рошан (Roshan) - джекпот
  rosh: {
    name: 'Рошан',
    color: '#ff00ff',
    images: [rosh],
    getRandomImage: () => rosh
  },
  // Магический бафф (Spell Buff) - средний выигрыш
  spellBuff: {
    name: 'Магический бафф',
    color: '#0096ff',
    images: [spellBuff],
    getRandomImage: () => spellBuff
  },
  // Кристаллы (Rubies) - валюта
  ruby: {
    name: 'Кристаллы',
    color: '#ff0000',
    images: [currencyRuby],
    getRandomImage: () => currencyRuby,
    isCurrency: true,
    currencyType: 'diamonds'
  },
  // Щиты (Shields) - валюта
  shield: {
    name: 'Щиты',
    color: '#ffd700',
    images: [currencyShield],
    getRandomImage: () => currencyShield,
    isCurrency: true,
    currencyType: 'shields'
  }
}

// Получить случайный символ для игры
export const getRandomSymbol = () => {
  const symbols = Object.keys(GAME_SYMBOLS)
  const randomKey = symbols[Math.floor(Math.random() * symbols.length)]
  return {
    key: randomKey,
    ...GAME_SYMBOLS[randomKey],
    image: GAME_SYMBOLS[randomKey].getRandomImage()
  }
}

// Получить все ключи символов
export const getSymbolKeys = () => Object.keys(GAME_SYMBOLS)

