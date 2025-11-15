import { useState } from 'react'
import './GuildHistoryModal.css'

function GuildHistoryModal({ isOpen, onClose }) {
  // История гильдии (публичные данные)
  const [guildHistory] = useState([
    {
      id: 1,
      type: 'currency_spent',
      currency: 'GP',
      amount: 50000,
      player: 'Player_Leader',
      item: 'Роль гильдии',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
    },
    {
      id: 2,
      type: 'role_changed',
      player: 'Storm_Warrior',
      oldRole: 'Новобранец',
      newRole: 'Ветеран',
      changedBy: 'Player_Leader',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 часов назад
    },
    {
      id: 3,
      type: 'member_added',
      player: 'Ice_Mage',
      addedBy: 'Player_Leader',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 день назад
    },
    {
      id: 4,
      type: 'currency_spent',
      currency: 'Кристаллы',
      amount: 200,
      player: 'Deputy_Player',
      item: 'Загрузка картинки гильдии',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 дня назад
    },
    {
      id: 5,
      type: 'member_removed',
      player: 'Old_Member',
      removedBy: 'Player_Leader',
      reason: 'Неактивность',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 дня назад
    },
    {
      id: 6,
      type: 'member_updated',
      player: 'Active_Player',
      changes: ['Уровень: 85 → 87', 'Заслуги: 45000 → 52000'],
      updatedBy: 'System',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 дня назад
    },
    {
      id: 7,
      type: 'role_changed',
      player: 'New_Recruit',
      oldRole: 'Новобранец',
      newRole: 'Офицер',
      changedBy: 'Deputy_Player',
      timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 дней назад
    },
  ])

  const formatHistoryTime = (timestamp) => {
    if (!timestamp) return 'Неизвестно'
    
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now - time
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) {
      return 'Только что'
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'минуту' : diffMins < 5 ? 'минуты' : 'минут'} назад`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'час' : diffHours < 5 ? 'часа' : 'часов'} назад`
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'день' : diffDays < 5 ? 'дня' : 'дней'} назад`
    } else {
      return time.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content guild-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">История гильдии</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="history-section">
            <h3 className="history-section-title">История действий</h3>
            <div className="history-list">
              {guildHistory.length === 0 ? (
                <div className="history-empty">
                  <div className="history-empty-icon">📜</div>
                  <div className="history-empty-text">История пуста</div>
                </div>
              ) : (
                guildHistory.map((event) => (
                  <div key={event.id} className="history-item">
                    <div className="history-item-content">
                      <div className="history-item-header">
                        <span className="history-item-title">
                          {event.type === 'currency_spent' && (
                            <>
                              <strong>{event.player}</strong> потратил{' '}
                              <strong>{event.amount.toLocaleString()} {event.currency}</strong> на{' '}
                              <strong>{event.item}</strong>
                            </>
                          )}
                          {event.type === 'role_changed' && (
                            <>
                              <strong>{event.changedBy}</strong> изменил роль{' '}
                              <strong>{event.player}</strong> с{' '}
                              <span className="history-role-old">{event.oldRole}</span> на{' '}
                              <span className="history-role-new">{event.newRole}</span>
                            </>
                          )}
                          {event.type === 'member_added' && (
                            <>
                              <strong>{event.addedBy}</strong> добавил участника{' '}
                              <strong>{event.player}</strong>
                            </>
                          )}
                          {event.type === 'member_removed' && (
                            <>
                              <strong>{event.removedBy}</strong> исключил участника{' '}
                              <strong>{event.player}</strong>
                              {event.reason && ` (${event.reason})`}
                            </>
                          )}
                              {event.type === 'member_updated' && (
                                <>
                                  <strong>{event.player}</strong> обновлен{' '}
                                  {event.updatedBy !== 'System' && `(${event.updatedBy})`}
                                </>
                              )}
                            </span>
                        <span className="history-item-time">
                          {formatHistoryTime(event.timestamp)}
                        </span>
                      </div>
                      {event.type === 'member_updated' && event.changes && (
                        <div className="history-item-changes">
                          {event.changes.map((change, idx) => (
                            <span key={idx} className="history-change-item">{change}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuildHistoryModal

