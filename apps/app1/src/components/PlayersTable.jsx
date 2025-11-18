import { useState, useMemo } from 'react'
import React from 'react'
import { getMeritsImage } from '../utils/imageUtils'
import './PlayersTable.css'

function PlayersTable({ players = [], displayedCount = 0, totalCount = 0, currentPlayerRole = 'Глава' }) {
  const [sortColumn, setSortColumn] = useState('points')
  const [sortDirection, setSortDirection] = useState('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [groupByRole, setGroupByRole] = useState(false)
  const [hoveredPlayer, setHoveredPlayer] = useState(null)

  // Фильтрация и сортировка
  const filteredAndSortedPlayers = useMemo(() => {
    if (players.length === 0) return []

    let filtered = players.filter(player => {
      const matchesSearch = searchQuery === '' || 
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.role.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesRole = filterRole === 'all' || player.role === filterRole
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'online' && player.status === 'играет') ||
        (filterStatus === 'offline' && player.status !== 'играет')
      
      return matchesSearch && matchesRole && matchesStatus
    })

    const sorted = filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortColumn) {
        case 'level':
          aValue = a.level
          bValue = b.level
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'role':
          aValue = a.role
          bValue = b.role
          break
        case 'points':
          aValue = a.points
          bValue = b.points
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [players, sortColumn, sortDirection, searchQuery, filterRole, filterStatus])

  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(players.map(p => p.role))]
    return roles.sort()
  }, [players])

  const groupedPlayers = useMemo(() => {
    if (!groupByRole) return { all: filteredAndSortedPlayers }
    
    const groups = {}
    filteredAndSortedPlayers.forEach(player => {
      if (!groups[player.role]) {
        groups[player.role] = []
      }
      groups[player.role].push(player)
    })
    
    const roleOrder = ['Глава', 'Заместитель', 'Ветеран', 'Новобранец']
    const sortedGroups = {}
    roleOrder.forEach(role => {
      if (groups[role]) {
        sortedGroups[role] = groups[role]
      }
    })
    
    return sortedGroups
  }, [filteredAndSortedPlayers, groupByRole])

  const roleStats = useMemo(() => {
    const stats = {}
    players.forEach(player => {
      if (!stats[player.role]) {
        stats[player.role] = {
          total: 0,
          online: 0,
          totalPoints: 0
        }
      }
      stats[player.role].total++
      if (player.status === 'играет') {
        stats[player.role].online++
      }
      stats[player.role].totalPoints += player.points
    })
    
    Object.keys(stats).forEach(role => {
      stats[role].avgPoints = Math.round(stats[role].totalPoints / stats[role].total)
      stats[role].onlinePercent = Math.round((stats[role].online / stats[role].total) * 100)
    })
    
    return stats
  }, [players])

  const canManagePlayers = currentPlayerRole === 'Глава' || currentPlayerRole === 'Заместитель'
  const canKickPlayer = (playerRole) => {
    if (currentPlayerRole === 'Глава') return playerRole !== 'Глава'
    if (currentPlayerRole === 'Заместитель') {
      return playerRole !== 'Глава' && playerRole !== 'Заместитель'
    }
    return false
  }

  const handleQuickAction = (action, player) => {
    switch(action) {
      case 'kick':
        if (window.confirm(`Выгнать ${player.name} из гильдии?`)) {
          alert(`${player.name} был выгнан из гильдии`)
        }
        break
      case 'promote':
        alert(`Повысить роль ${player.name}`)
        break
      case 'demote':
        alert(`Понизить роль ${player.name}`)
        break
      case 'message':
        alert(`Отправить сообщение ${player.name}`)
        break
      default:
        break
    }
  }

  const renderPlayerRow = (player, index, groupRole = null) => {
    const isOnline = player.status === 'играет'
    const globalIndex = groupByRole ? null : index
    const isTopPlayer = !groupByRole && globalIndex !== null && globalIndex < 3 && sortColumn === 'points' && sortDirection === 'desc'
    
    return (
      <tr 
        key={`${player.name}-${index}`}
        className={`player-row ${isOnline ? 'row-online' : ''} ${isTopPlayer ? 'row-top-player' : ''} ${groupRole ? `group-${groupRole.toLowerCase()}` : ''}`}
        onMouseEnter={() => setHoveredPlayer(player.name)}
        onMouseLeave={() => setHoveredPlayer(null)}
      >
        <td className="td-level" style={{ width: '70px', minWidth: '70px', maxWidth: '70px', textAlign: 'center', padding: '10px 8px', backgroundColor: 'transparent', display: 'table-cell', visibility: 'visible' }}>
          <span className="level-value" style={{ display: 'inline-block' }}>{player.level}</span>
        </td>
        <td className="td-player" style={{ padding: '10px 14px', display: 'table-cell', visibility: 'visible' }}>
          <div className="player-cell-content">
            <div className="player-avatar-table">
              {typeof player.avatar === 'string' ? (
                player.avatar.startsWith('/') || player.avatar.startsWith('http') ? (
                  <img src={player.avatar} alt={player.name} className="player-avatar-image" />
                ) : (
                  <div className="player-avatar-placeholder-table">{player.avatar}</div>
                )
              ) : (
                <img src={player.avatar} alt={player.name} className="player-avatar-image" />
              )}
            </div>
            <span className="player-name">{player.name}</span>
            {isTopPlayer && <span className="top-badge">🏆</span>}
          </div>
        </td>
        <td className="td-role">
          <span className={`role-badge role-${player.role.toLowerCase()}`}>
            {player.role}
          </span>
        </td>
        <td className="td-points">
          <div className="points-wrapper">
            <img src={getMeritsImage()} alt="Заслуги" className="points-icon-image" />
            <span className="points-text">{player.points.toLocaleString()}</span>
          </div>
        </td>
        <td className="td-status">
          <div className={`status-wrapper ${isOnline ? 'status-online' : 'status-offline'}`}>
            <span className={`status-dot ${isOnline ? 'dot-online' : 'dot-offline'}`}></span>
            <span className="status-text">{player.status}</span>
          </div>
        </td>
        {canManagePlayers && (
          <td className="td-actions">
            <div className={`actions-wrapper ${hoveredPlayer === player.name ? 'visible' : ''}`}>
              {canKickPlayer(player.role) && (
                <button
                  className="action-btn action-kick"
                  onClick={() => handleQuickAction('kick', player)}
                  title="Выгнать из гильдии"
                >
                  🚪
                </button>
              )}
              {player.role !== 'Глава' && player.role !== 'Заместитель' && currentPlayerRole === 'Глава' && (
                <button
                  className="action-btn action-promote"
                  onClick={() => handleQuickAction('promote', player)}
                  title="Повысить роль"
                >
                  ⬆️
                </button>
              )}
              {player.role === 'Заместитель' && currentPlayerRole === 'Глава' && (
                <button
                  className="action-btn action-demote"
                  onClick={() => handleQuickAction('demote', player)}
                  title="Понизить роль"
                >
                  ⬇️
                </button>
              )}
              <button
                className="action-btn action-message"
                onClick={() => handleQuickAction('message', player)}
                title="Отправить сообщение"
              >
                💬
              </button>
            </div>
          </td>
        )}
      </tr>
    )
  }

  return (
    <div className="players-table-container">
      <div className="table-header-section">
        <div className="table-header-info">
          <span className="members-count">
            {filteredAndSortedPlayers.length} из {totalCount} участников
            {searchQuery && ` (поиск: "${searchQuery}")`}
          </span>
        </div>
        
        <div className="table-controls">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по имени или роли..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filters-container">
            <select 
              className="filter-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Все роли</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="online">Онлайн</option>
              <option value="offline">Оффлайн</option>
            </select>

            <select 
              className="filter-select sort-select"
              value={`${sortColumn}-${sortDirection}`}
              onChange={(e) => {
                const [column, direction] = e.target.value.split('-')
                setSortColumn(column)
                setSortDirection(direction)
              }}
            >
              <option value="points-desc">Сортировка: Заслуги (↓)</option>
              <option value="points-asc">Сортировка: Заслуги (↑)</option>
              <option value="level-desc">Сортировка: Уровень (↓)</option>
              <option value="level-asc">Сортировка: Уровень (↑)</option>
              <option value="name-asc">Сортировка: Имя (А-Я)</option>
              <option value="name-desc">Сортировка: Имя (Я-А)</option>
              <option value="role-asc">Сортировка: Роль (А-Я)</option>
              <option value="role-desc">Сортировка: Роль (Я-А)</option>
              <option value="status-asc">Сортировка: Статус (А-Я)</option>
              <option value="status-desc">Сортировка: Статус (Я-А)</option>
            </select>
          </div>

          <div className="view-options">
            <button
              className={`view-toggle ${groupByRole ? 'active' : ''}`}
              onClick={() => setGroupByRole(!groupByRole)}
              title={groupByRole ? 'Отключить группировку' : 'Группировать по ролям'}
            >
              <span className="toggle-icon">{groupByRole ? '📋' : '🔀'}</span>
              <span className="toggle-text">{groupByRole ? 'Группа' : 'Список'}</span>
            </button>
          </div>
        </div>

        {groupByRole && Object.keys(roleStats).length > 0 && (
          <div className="role-stats-section">
            {Object.entries(roleStats).map(([role, stats]) => (
              <div key={role} className="role-stat-card">
                <div className="role-stat-header">
                  <span className="role-stat-name">{role}</span>
                  <span className="role-stat-count">{stats.total} чел.</span>
                </div>
                <div className="role-stat-details">
                  <div className="role-stat-item">
                    <span className="stat-item-icon">👥</span>
                    <span className="stat-item-value">{stats.online}</span>
                    <span className="stat-item-label">онлайн</span>
                  </div>
                  <div className="role-stat-item">
                    <span className="stat-item-icon">⭐</span>
                    <span className="stat-item-value">{stats.avgPoints.toLocaleString()}</span>
                    <span className="stat-item-label">сред. заслуги</span>
                  </div>
                  <div className="role-stat-item">
                    <span className="stat-item-icon">📊</span>
                    <span className="stat-item-value">{stats.onlinePercent}%</span>
                    <span className="stat-item-label">активность</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <table className="players-table">
        <thead>
          <tr>
            <th className="th-level">Уровень</th>
            <th className="th-player">Игрок</th>
            <th className="th-role">Роль</th>
            <th className="th-points">Заслуги</th>
            <th className="th-status">Статус</th>
            {canManagePlayers && (
              <th className="th-actions">Действия</th>
            )}
          </tr>
        </thead>
        <tbody>
          {(() => {
            if (groupByRole) {
              const groups = Object.entries(groupedPlayers)
              if (groups.length === 0) {
                return (
                  <tr>
                    <td colSpan={canManagePlayers ? 6 : 5} className="no-results">
                      <div className="no-results-content">
                        <span className="no-results-icon">🔍</span>
                        <span className="no-results-text">Участники не найдены</span>
                      </div>
                    </td>
                  </tr>
                )
              }
              
              return groups.map(([role, groupPlayers]) => (
                <React.Fragment key={role}>
                  <tr className="role-group-header">
                    <td colSpan={canManagePlayers ? 6 : 5} className="group-header-cell">
                      <div className="group-header-content">
                        <span className="group-role-name">{role}</span>
                        <span className="group-count">{groupPlayers.length} {groupPlayers.length === 1 ? 'участник' : 'участников'}</span>
                        <div className="group-stats-mini">
                          <span className="mini-stat">👥 {groupPlayers.filter(p => p.status === 'играет').length} онлайн</span>
                          <span className="mini-stat">⭐ {Math.round(groupPlayers.reduce((sum, p) => sum + p.points, 0) / groupPlayers.length).toLocaleString()} ср. заслуги</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {groupPlayers.map((player, index) => renderPlayerRow(player, index, role))}
                </React.Fragment>
              ))
            } else {
              if (filteredAndSortedPlayers.length === 0) {
                return (
                  <tr>
                    <td colSpan={canManagePlayers ? 6 : 5} className="no-results">
                      <div className="no-results-content">
                        <span className="no-results-icon">🔍</span>
                        <span className="no-results-text">Участники не найдены</span>
                      </div>
                    </td>
                  </tr>
                )
              }
              return filteredAndSortedPlayers.map((player, index) => renderPlayerRow(player, index))
            }
          })()}
        </tbody>
      </table>
    </div>
  )
}

export default PlayersTable

