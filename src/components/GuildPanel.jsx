import { useState, useEffect, useMemo } from 'react'
import { getMeritsImage } from '../utils/imageUtils'
import './GuildPanel.css'
import GuildSettingsModal from './GuildSettingsModal'
import MembersModal from './MembersModal'
import RequestsModal from './RequestsModal'

function GuildPanel({ guildName = "Guild Name", guildLevel = 76, displayedCount = 0, totalCount = 0, pendingRequests = 0, onGuildUpdate, players = [], currentExp = 0, expToNextLevel = 1000, guildPoints = 0, guildDescription = '' }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [showRequests, setShowRequests] = useState(false)
  const [currentGuildName, setCurrentGuildName] = useState(guildName)
  const [description, setDescription] = useState(guildDescription || 'Добро пожаловать в нашу гильдию! Мы активное сообщество игроков, стремящихся к достижению великих целей вместе. Присоединяйтесь к нам и станьте частью легендарной команды!')
  const [membersList, setMembersList] = useState(players)

  // Вычисляем статистику гильдии
  const guildStats = useMemo(() => {
    const onlineCount = players.filter(p => p.status === 'играет').length
    const activeLast24h = players.filter(p => p.status === 'играет' || p.status === '1 день назад').length
    // Общие заслуги = сумма всех заслуг всех игроков (опыт + GP, которые они принесли)
    const totalMerits = players.reduce((sum, p) => sum + (p.points || 0), 0)
    const avgMerits = players.length > 0 ? Math.round(totalMerits / players.length) : 0
    
    return {
      onlineCount,
      activeLast24h,
      totalMerits,
      avgMerits
    }
  }, [players])

  useEffect(() => {
    setMembersList(players)
  }, [players])

  const handleLeaveGuild = () => {
    if (showConfirm) {
      // Здесь будет логика выхода из гильдии
      alert('Вы покинули гильдию')
      setShowConfirm(false)
    } else {
      setShowConfirm(true)
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  const handleViewGuildsList = () => {
    // Здесь будет логика открытия списка гильдий
    alert('Открыть список гильдий')
  }

  const handleAcceptMembers = () => {
    setShowRequests(true)
  }

  const handleCloseRequests = () => {
    setShowRequests(false)
  }

  const handleGuildSettings = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  const handleViewMembers = () => {
    setShowMembers(true)
  }

  const handleCloseMembers = () => {
    setShowMembers(false)
  }

  const handleKickMember = (playerName) => {
    setMembersList(membersList.filter(player => player.name !== playerName))
    alert(`${playerName} был выгнан из гильдии`)
  }

  const handleRoleChange = (playerName, newRole) => {
    setMembersList(membersList.map(player => 
      player.name === playerName ? { ...player, role: newRole } : player
    ))
    alert(`Роль ${playerName} изменена на ${newRole}`)
  }

  const handleSaveSettings = (settings) => {
    setCurrentGuildName(settings.name)
    setDescription(settings.description || '')
    if (onGuildUpdate) {
      onGuildUpdate(settings)
    }
    setShowSettings(false)
  }

  useEffect(() => {
    if (guildDescription) {
      setDescription(guildDescription)
    }
  }, [guildDescription])

  return (
    <div className="guild-panel">
      <div className="guild-header">
        <div className="guild-avatar-wrapper">
        <div className="guild-avatar">
          <div className="avatar-placeholder">IMG</div>
            <div className="avatar-glow"></div>
          </div>
          <div className="avatar-level-badge">{guildLevel}</div>
        </div>
        <div className="guild-info">
          <div className="guild-title-section">
          <div className="guild-name">{currentGuildName}</div>
            <div className="guild-level-badge">Уровень {guildLevel}</div>
          </div>
          
          <div className="guild-exp-bar-container">
            <div className="guild-exp-header">
              <span className="exp-label">ОПЫТ ДО УРОВНЯ {guildLevel + 1}</span>
              <span className="exp-percent">{Math.round((currentExp / expToNextLevel) * 100)}%</span>
            </div>
            <div className="guild-exp-bar">
              <div 
                className="guild-exp-bar-fill" 
                style={{ width: `${Math.min((currentExp / expToNextLevel) * 100, 100)}%` }}
              >
                <div className="exp-bar-shine"></div>
              </div>
              <div className="exp-bar-particles"></div>
            </div>
            <div className="guild-exp-text">
              <span className="exp-current">{currentExp.toLocaleString()}</span>
              <span className="exp-separator"> / </span>
              <span className="exp-required">{expToNextLevel.toLocaleString()}</span>
              <span className="exp-remaining"> ({(expToNextLevel - currentExp).toLocaleString()} осталось)</span>
            </div>
          </div>
          
          <div className="guild-points">
            <div className="guild-points-icon-wrapper">
              <img src={getMeritsImage()} alt="Заслуги" className="guild-points-icon-image" />
              <div className="points-icon-glow"></div>
            </div>
            <div className="guild-points-content">
              <span className="guild-points-label">ОБЩИЕ ЗАСЛУГИ</span>
              <span className="guild-points-value">{guildStats.totalMerits.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Описание гильдии */}
      {description && (
        <div className="guild-description-block">
          <div className="guild-description-header">
            <span className="description-icon">📜</span>
            <span className="description-title">О гильдии</span>
          </div>
          <div className="guild-description-text">
            {description}
          </div>
        </div>
      )}

      {/* Статистика гильдии */}
      <div className="guild-stats">
        <div className="stat-item stat-online">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">👥</div>
            {guildStats.onlineCount > 0 && <div className="stat-pulse"></div>}
            <div className="stat-icon-glow stat-glow-green"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{guildStats.onlineCount}</div>
            <div className="stat-label">ОНЛАЙН</div>
            <div className="stat-hint">из {totalCount}</div>
          </div>
        </div>
        <div className="stat-item stat-active">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">⚡</div>
            <div className="stat-icon-glow stat-glow-orange"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{guildStats.activeLast24h}</div>
            <div className="stat-label">АКТИВ (24Ч)</div>
            <div className="stat-hint">{Math.round((guildStats.activeLast24h / totalCount) * 100)}% гильдии</div>
          </div>
        </div>
        <div className="stat-item stat-points">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">⭐</div>
            <div className="stat-icon-glow stat-glow-gold"></div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{guildStats.avgMerits.toLocaleString()}</div>
            <div className="stat-label">СРЕД. ЗАСЛУГИ</div>
            <div className="stat-hint">на участника</div>
          </div>
        </div>
      </div>

      <div className="guild-actions">
        <button className="guild-action-button view-guilds-button" onClick={handleViewGuildsList}>
          <span className="button-icon">🏰</span>
          <span className="button-text">Список гильдий</span>
        </button>
        <button className={`guild-action-button accept-members-button ${pendingRequests > 0 ? 'has-requests' : ''}`} onClick={handleAcceptMembers}>
          <span className="button-icon">📨</span>
          <span className="button-text">Заявки</span>
          {pendingRequests > 0 && (
            <span className="requests-indicator">{pendingRequests}</span>
          )}
        </button>
        <button className="guild-action-button guild-settings-button" onClick={handleGuildSettings}>
          <span className="button-icon">⚙️</span>
          <span className="button-text">Настройки</span>
        </button>
        {!showConfirm ? (
          <button className="guild-action-button leave-guild-button" onClick={handleLeaveGuild}>
            <span className="button-icon">🚪</span>
            <span className="button-text">Покинуть гильдию</span>
          </button>
        ) : (
          <div className="confirm-leave">
            <div className="confirm-message">Вы уверены?</div>
            <div className="confirm-buttons">
              <button className="confirm-button" onClick={handleLeaveGuild}>
                Да
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Нет
              </button>
            </div>
          </div>
        )}
      </div>
      <GuildSettingsModal 
        isOpen={showSettings} 
        onClose={handleCloseSettings}
        guildName={currentGuildName}
        guildDescription={description}
        onSave={handleSaveSettings}
      />
      <MembersModal
        isOpen={showMembers}
        onClose={handleCloseMembers}
        players={membersList}
        onKickMember={handleKickMember}
        onRoleChange={handleRoleChange}
      />
      <RequestsModal
        isOpen={showRequests}
        onClose={handleCloseRequests}
        requests={[]}
      />
    </div>
  )
}

export default GuildPanel

