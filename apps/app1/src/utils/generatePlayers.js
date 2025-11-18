// Генерация данных игроков на основе конфигурации гильдии
import { guildConfig } from '../config/guildConfig'
import { getAvatarByIndex } from './imageUtils'

const firstNames = [
  'Alex', 'Max', 'Sam', 'Chris', 'Jordan', 'Taylor', 'Morgan', 'Casey',
  'Dragon', 'Shadow', 'Blade', 'Storm', 'Fire', 'Ice', 'Thunder', 'Night',
  'Dark', 'Light', 'Star', 'Moon', 'Wolf', 'Eagle', 'Tiger', 'Lion',
  'Knight', 'Warrior', 'Mage', 'Rogue', 'Hunter', 'Paladin', 'Wizard', 'Assassin'
]

const lastNames = [
  'Slayer', 'Destroyer', 'Master', 'Champion', 'Legend', 'Hero', 'Warrior', 'Guardian',
  'Hunter', 'Ranger', 'Mage', 'Wizard', 'Knight', 'Paladin', 'Rogue', 'Assassin',
  'Storm', 'Fire', 'Ice', 'Shadow', 'Light', 'Dark', 'Dragon', 'Phoenix',
  'Blade', 'Sword', 'Shield', 'Bow', 'Axe', 'Spear', 'Hammer', 'Dagger'
]

const statuses = ['играет', '1 день назад', '2 дня назад', '3 дня назад', '4 дня назад', '5 дней назад', '6 дней назад', '7 дней назад']

let avatarIndex = 0

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomPlayer(role) {
  const firstName = getRandomElement(firstNames)
  const lastName = getRandomElement(lastNames)
  const name = `${firstName}_${lastName}`
  const level = getRandomInt(1, 150)
  const points = getRandomInt(100, 50000)
  const avatar = getAvatarByIndex(avatarIndex++)
  const status = getRandomElement(statuses)

  return {
    level,
    avatar,
    name,
    role,
    points,
    status
  }
}

export function generatePlayers() {
  const players = []
  const roles = guildConfig.roles
  
  // Генерируем участников согласно распределению ролей
  // 1 Глава (пользователь)
  players.push({
    level: getRandomInt(100, 150),
    avatar: getAvatarByIndex(avatarIndex++),
    name: guildConfig.myName,
    role: 'Глава',
    points: getRandomInt(40000, 50000),
    status: 'играет'
  })
  
  // 4 Заместитель
  for (let i = 0; i < roles['Заместитель']; i++) {
    players.push(generateRandomPlayer('Заместитель'))
  }
  
  // 25 Ветеран
  for (let i = 0; i < roles['Ветеран']; i++) {
    players.push(generateRandomPlayer('Ветеран'))
  }
  
  // 75 Новобранец
  for (let i = 0; i < roles['Новобранец']; i++) {
    players.push(generateRandomPlayer('Новобранец'))
  }
  
  // Сортируем по очкам (от большего к меньшему)
  return players.sort((a, b) => b.points - a.points)
}

// Экспортируем конфиг для использования в других компонентах
export { guildConfig }


