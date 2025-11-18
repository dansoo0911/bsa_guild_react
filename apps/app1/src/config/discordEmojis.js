/**
 * Конфигурация Discord эмодзи для чата гильдии
 * 
 * Как получить ID эмодзи из Discord:
 * 1. Включите режим разработчика в Discord (Настройки → Расширенные → Режим разработчика)
 * 2. Правой кнопкой мыши на эмодзи → Копировать ID
 * 3. Или используйте формат: <:emoji_name:emoji_id> из сообщения
 * 
 * Формат Discord CDN для эмодзи:
 * - PNG: https://cdn.discordapp.com/emojis/{id}.png
 * - GIF (анимированные): https://cdn.discordapp.com/emojis/{id}.gif
 */

export const discordEmojis = [
  // Примеры (замените на свои реальные эмодзи)
  // { type: 'discord', name: 'pepega', id: '123456789012345678' },
  // { type: 'discord', name: 'poggers', id: '123456789012345679' },
  // { type: 'discord', name: 'monkas', id: '123456789012345680' },
  
  // Добавьте свои Discord эмодзи здесь:
  // { type: 'discord', name: 'название_эмодзи', id: 'ID_эмодзи' },
]

/**
 * Словарь для быстрого поиска эмодзи по имени (для формата :name:)
 * Ключ: имя эмодзи (lowercase)
 * Значение: объект с id и name
 */
export const discordEmojisMap = discordEmojis.reduce((acc, emoji) => {
  acc[emoji.name.toLowerCase()] = {
    id: emoji.id,
    name: emoji.name
  }
  return acc
}, {})

