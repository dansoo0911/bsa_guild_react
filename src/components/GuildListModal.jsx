import { useState, useMemo } from 'react'
import { getAvatarByIndex } from '../utils/imageUtils'
import './GuildListModal.css'
import CreateGuildModal from './CreateGuildModal'

// Моковые данные гильдий для демонстрации
const generateMockGuilds = () => {
  const guildNames = [
    'Легенды Асгарда', 'Тени Дракона', 'Орден Света', 'Братство Стали',
    'Хранители Тайн', 'Воины Бури', 'Мастера Меча', 'Стражи Севера',
    'Гильдия Теней', 'Рыцари Чести', 'Дети Огня', 'Владыки Льда',
    'Бессмертные', 'Странники', 'Защитники', 'Охотники'
  ]
  
  const leaderNames = [
    'Thunder_Lord', 'Shadow_Master', 'Light_Bringer', 'Steel_Commander',
    'Keeper_Of_Secrets', 'Storm_Warrior', 'Sword_Master', 'North_Guardian',
    'Shadow_Guild_Leader', 'Honor_Knight', 'Fire_Child', 'Ice_Lord',
    'Immortal_One', 'Wanderer', 'Protector', 'Hunter_Elite'
  ]
  
  const now = Date.now()
  const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000)
  
  // Создаем массив индексов и перемешиваем его для случайного выбора 8 гильдий с лидерами
  const indices = Array.from({ length: guildNames.length }, (_, i) => i)
  // Перемешиваем массив
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  // Берем первые 8 индексов (50% от 16)
  const leaderIndices = new Set(indices.slice(0, Math.floor(guildNames.length / 2)))
  
  return guildNames.map((name, index) => {
    const members = Math.floor(Math.random() * 50) + 20
    const maxMembers = Math.floor(Math.random() * 30) + 80
    const hasFreeSlots = members < maxMembers
    // 50% гильдий показывают лидера (8 из 16)
    const showLeader = leaderIndices.has(index)
    
    return {
      id: index + 1,
      name,
      level: Math.floor(Math.random() * 50) + 20,
      members,
      maxMembers,
      totalMerits: Math.floor(Math.random() * 500000) + 100000,
      description: `Мощная гильдия ${name}, стремящаяся к величию и славе.`,
      isOpen: Math.random() > 0.3, // 70% гильдий открыты для вступления
      hasFreeSlots,
      createdAt: oneMonthAgo + Math.random() * (now - oneMonthAgo), // Случайная дата в последний месяц (timestamp)
      avatar: getAvatarByIndex(index % 10), // Циклическое использование аватаров
      showLeaderInList: showLeader, // Настройка отображения лидера
      leader: showLeader ? {
        name: leaderNames[index] || `Leader_${index + 1}`,
        avatar: getAvatarByIndex((index + 5) % 10), // Разные аватары для лидеров
        level: Math.floor(Math.random() * 30) + 50
      } : null,
      requirements: Math.random() > 0.5 ? {
        minLevel: Math.floor(Math.random() * 20) + 10,
        minMerits: Math.floor(Math.random() * 10000) + 5000
      } : null
    }
  })
}

function GuildListModal({ isOpen, onClose, currentGuildName, showLeaderInList = false, players = [], playerCrystals = 0, onPlayerCrystalsChange }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('merits') // merits, level, recent
  const [filterFreeSlots, setFilterFreeSlots] = useState(false)
  const [guilds] = useState(generateMockGuilds())
  const [showCreateGuildModal, setShowCreateGuildModal] = useState(false)

  const handleCreateGuild = () => {
    setShowCreateGuildModal(true)
  }

  const handleGuildCreated = (guildName) => {
    // Вычитаем кристаллы при создании гильдии
    const creationCost = 50
    if (onPlayerCrystalsChange && playerCrystals >= creationCost) {
      onPlayerCrystalsChange(playerCrystals - creationCost)
    }
    // TODO: Обработка создания гильдии на сервере
    alert(`Гильдия "${guildName}" успешно создана!`)
    setShowCreateGuildModal(false)
  }
  
  // Находим лидера текущей гильдии
  const currentGuildLeader = useMemo(() => {
    if (!showLeaderInList || !currentGuildName) return null
    const leader = players.find(p => p.role === 'Глава' || p.role === 'Глава гильдии')
    return leader ? {
      name: leader.name,
      avatar: leader.avatar
    } : null
  }, [showLeaderInList, currentGuildName, players])
  
  // Получаем лидера для гильдии (для текущей - из пропсов, для других - из данных гильдии)
  const getGuildLeader = (guild) => {
    if (guild.name === currentGuildName && currentGuildLeader) {
      return currentGuildLeader
    }
    return guild.leader
  }

  const filteredAndSortedGuilds = useMemo(() => {
    let filtered = guilds.filter(guild => {
      const matchesSearch = guild.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFreeSlots = !filterFreeSlots || guild.hasFreeSlots
      return matchesSearch && matchesFreeSlots
    })

    // Сортировка в зависимости от типа фильтра
    filtered.sort((a, b) => {
      switch (filterType) {
        case 'merits':
          // Топ по заслугам
          return b.totalMerits - a.totalMerits
        case 'level':
          // Топ по уровню
          return b.level - a.level
        case 'recent':
          // Недавно созданные
          return b.createdAt - a.createdAt
        default:
          return b.totalMerits - a.totalMerits
      }
    })

    return filtered
  }, [guilds, searchQuery, filterType, filterFreeSlots])

  const handleJoinGuild = (guild) => {
    if (!guild.isOpen) {
      alert(`${guild.name} не принимает новых участников`)
      return
    }
    
    if (guild.requirements) {
      const requirementsText = [
        guild.requirements.minLevel && `Минимальный уровень: ${guild.requirements.minLevel}`,
        guild.requirements.minMerits && `Минимальные заслуги: ${guild.requirements.minMerits.toLocaleString()}`
      ].filter(Boolean).join('\n')
      
      if (window.confirm(`Присоединиться к ${guild.name}?\n\nТребования:\n${requirementsText}`)) {
        alert(`Заявка на вступление в ${guild.name} отправлена!`)
      }
    } else {
      if (window.confirm(`Присоединиться к ${guild.name}?`)) {
        alert(`Заявка на вступление в ${guild.name} отправлена!`)
      }
    }
  }

  const getRankBadge = (index) => {
    if (index === 0) return { emoji: '🥇', color: '#FFD700' }
    if (index === 1) return { emoji: '🥈', color: '#C0C0C0' }
    if (index === 2) return { emoji: '🥉', color: '#CD7F32' }
    return { emoji: `${index + 1}`, color: '#8A9BA8' }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay guild-list-overlay" onClick={onClose}>
      <div className="guild-list-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header guild-list-header">
          <div className="guild-list-title-section">
            <h2 className="modal-title guild-list-title">🏰 Список гильдий</h2>
            <p className="guild-list-subtitle">Рейтинг и поиск гильдий для присоединения</p>
          </div>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>

        <div className="guild-list-controls">
          <div className="guild-search-container">
            <input
              type="text"
              className="guild-search-input"
              placeholder="🔍 Поиск по названию гильдии..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="guild-filters">
            <select
              className="guild-sort-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="merits">⭐ Топ по заслугам</option>
              <option value="level">⬆️ Топ по уровню</option>
              <option value="recent">🆕 Недавно созданные</option>
            </select>
            
            <label className="guild-filter-checkbox">
              <input
                type="checkbox"
                checked={filterFreeSlots}
                onChange={(e) => setFilterFreeSlots(e.target.checked)}
              />
              <span>Есть свободные места</span>
            </label>
          </div>
        </div>

        <div className="modal-body guild-list-body">
          <div className="guild-list-container">
            {filteredAndSortedGuilds.length === 0 ? (
              <div className="guild-list-empty">
                <div className="empty-icon">🔍</div>
                <p>Гильдии не найдены</p>
                <p className="empty-hint">Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <div className="guild-list-grid">
                {filteredAndSortedGuilds.map((guild, index) => {
                  const rank = getRankBadge(index)
                  const isCurrentGuild = guild.name === currentGuildName
                  
                  return (
                    <div
                      key={guild.id}
                      className={`guild-card ${isCurrentGuild ? 'current-guild' : ''} ${!guild.isOpen ? 'closed-guild' : ''}`}
                    >
                      <div className="guild-card-header">
                        <div className="guild-card-avatar-wrapper">
                          <div className="guild-card-avatar">
                            {guild.avatar && typeof guild.avatar === 'string' && 
                             (guild.avatar.startsWith('/') || guild.avatar.startsWith('http')) ? (
                              <img src={guild.avatar} alt={guild.name} className="guild-card-avatar-image" />
                            ) : (
                              <div className="guild-card-avatar-placeholder">
                                {guild.name.charAt(0)}
                              </div>
                            )}
                            <div className="guild-card-avatar-glow"></div>
                          </div>
                          <div className="guild-card-rank-badge" style={{ color: rank.color }}>
                            {rank.emoji}
                          </div>
                        </div>
                        <div className="guild-card-title">
                          <h3 className="guild-card-name">{guild.name}</h3>
                          {isCurrentGuild && (
                            <span className="current-guild-badge">Ваша гильдия</span>
                          )}
                          {!guild.isOpen && (
                            <span className="closed-guild-badge">🔒 Закрыта</span>
                          )}
                        </div>
                      </div>

                      <div className="guild-card-main-info">
                        <div className="guild-info-section">
                          <div className="guild-info-item">
                            <div className="info-item-header">
                              <span className="info-icon">⬆️</span>
                              <span className="info-label">Уровень</span>
                            </div>
                            <div className="info-item-value">{guild.level}</div>
                          </div>
                          
                          <div className="guild-info-item">
                            <div className="info-item-header">
                              <span className="info-icon">👥</span>
                              <span className="info-label">Участники</span>
                            </div>
                            <div className="info-item-value">
                              {guild.members}<span className="info-separator">/</span>{guild.maxMembers}
                            </div>
                          </div>
                          
                          <div className="guild-info-item">
                            <div className="info-item-header">
                              <span className="info-icon">⭐</span>
                              <span className="info-label">Заслуги</span>
                            </div>
                            <div className="info-item-value">{guild.totalMerits.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      {guild.description && (
                        <div className="guild-description-section">
                          <div className="description-header">
                            <span className="description-icon">📜</span>
                            <span className="description-title">Описание</span>
                          </div>
                          <p className="guild-card-description">{guild.description}</p>
                        </div>
                      )}

                      {/* Отображение лидера гильдии (если настройка включена) */}
                      {(() => {
                        // Определяем, нужно ли показывать лидера и откуда брать данные
                        let leaderData = null
                        
                        if (isCurrentGuild) {
                          // Для текущей гильдии используем лидера из пропсов
                          if (showLeaderInList && currentGuildLeader && currentGuildLeader.name) {
                            leaderData = currentGuildLeader
                          }
                        } else {
                          // Для других гильдий используем лидера из данных гильдии
                          // Проверяем, что настройка включена и лидер существует
                          if (guild.showLeaderInList === true && guild.leader && guild.leader.name) {
                            leaderData = guild.leader
                          }
                        }
                        
                        // Отображаем лидера, если данные есть
                        if (!leaderData || !leaderData.name) {
                          return null
                        }
                        
                        // Получаем путь к аватару (может быть строкой или объектом модуля)
                        const avatarSrc = leaderData.avatar
                        let avatarUrl = null
                        
                        if (avatarSrc) {
                          if (typeof avatarSrc === 'string') {
                            avatarUrl = avatarSrc
                          } else if (typeof avatarSrc === 'object' && avatarSrc !== null) {
                            // Если это объект модуля (из import.meta.glob)
                            avatarUrl = avatarSrc.default || avatarSrc
                          }
                        }
                        
                        return (
                          <div className="guild-leader-section">
                            <div className="leader-header">
                              <span className="leader-icon">👑</span>
                              <span className="leader-title">Лидер гильдии</span>
                            </div>
                            <div className="leader-info">
                              <div className="leader-avatar-wrapper">
                                {avatarUrl ? (
                                  <img 
                                    src={avatarUrl} 
                                    alt={leaderData.name} 
                                    className="leader-avatar-image"
                                  />
                                ) : (
                                  <div className="leader-avatar-placeholder">
                                    {leaderData.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="leader-details">
                                <div className="leader-name">{leaderData.name}</div>
                              </div>
                            </div>
                          </div>
                        )
                      })()}

                      <div className="guild-card-footer">
                        {isCurrentGuild ? (
                          <button className="guild-action-button current-guild-button" disabled>
                            Вы уже в этой гильдии
                          </button>
                        ) : (
                          <button
                            className={`guild-action-button join-button ${!guild.isOpen ? 'disabled' : ''}`}
                            onClick={() => handleJoinGuild(guild)}
                            disabled={!guild.isOpen}
                          >
                            {guild.isOpen ? 'Подать заявку' : 'Гильдия закрыта'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer guild-list-footer">
          <div className="guild-list-info">
            Найдено гильдий: <strong>{filteredAndSortedGuilds.length}</strong>
          </div>
          <div className="guild-list-footer-buttons">
            <button className="modal-button modal-button-create" onClick={handleCreateGuild}>
              <span className="button-icon">➕</span>
              Создать гильдию
            </button>
          </div>
        </div>
      </div>
      
      <CreateGuildModal
        isOpen={showCreateGuildModal}
        onClose={() => setShowCreateGuildModal(false)}
        onCreateGuild={handleGuildCreated}
        playerCrystals={playerCrystals}
        currentGuildName={currentGuildName}
      />
    </div>
  )
}

export default GuildListModal

