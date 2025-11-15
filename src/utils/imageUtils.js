// Утилита для работы с изображениями
// Используем import.meta.glob для Vite

// Получаем все изображения аватарок
const avatarModules = import.meta.glob('../assets/images/avatar/*.png', { eager: true })
const avatarPaths = Object.keys(avatarModules).map(path => avatarModules[path].default || avatarModules[path])

// Получаем все изображения предметов
const itemModules = import.meta.glob('../assets/images/items/*.png', { eager: true })
const itemPaths = Object.keys(itemModules).map(path => itemModules[path].default || itemModules[path])

// Получаем все изображения героев
const heroModules = import.meta.glob('../assets/images/heroes/*.png', { eager: true })
const heroPaths = Object.keys(heroModules).map(path => heroModules[path].default || heroModules[path])

// Функция для получения случайного изображения аватарки
export function getRandomAvatar() {
  return avatarPaths[Math.floor(Math.random() * avatarPaths.length)]
}

// Функция для получения случайного изображения предмета
export function getRandomItem() {
  return itemPaths[Math.floor(Math.random() * itemPaths.length)]
}

// Функция для получения случайного изображения героя
export function getRandomHero() {
  return heroPaths[Math.floor(Math.random() * heroPaths.length)]
}

// Функция для получения всех изображений аватарок
export function getAllAvatars() {
  return avatarPaths
}

// Функция для получения всех изображений предметов
export function getAllItems() {
  return itemPaths
}

// Функция для получения всех изображений героев
export function getAllHeroes() {
  return heroPaths
}

// Функция для получения изображения аватарки по индексу (для стабильности)
export function getAvatarByIndex(index) {
  return avatarPaths[index % avatarPaths.length]
}

// Функция для получения изображения предмета по индексу
export function getItemByIndex(index) {
  return itemPaths[index % itemPaths.length]
}

// Функция для получения изображения героя по индексу
export function getHeroByIndex(index) {
  return heroPaths[index % heroPaths.length]
}

// Изображения валют
import shieldImage from '../assets/images/currency_shield.png'
import rubyImage from '../assets/images/currency_ruby.png'
import gpImage from '../assets/images/currency_gp.png'
import expImage from '../assets/images/currency_exp.png'
import meritsImage from '../assets/images/merits_icon.png'

export function getShieldImage() {
  return shieldImage
}

export function getRubyImage() {
  return rubyImage
}

export function getGPImage() {
  return gpImage
}

export function getExpImage() {
  return expImage
}

export function getMeritsImage() {
  return meritsImage
}

