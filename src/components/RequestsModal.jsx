import { useState } from 'react'
import { getAvatarByIndex, getMeritsImage } from '../utils/imageUtils'
import './RequestsModal.css'

function RequestsModal({ isOpen, onClose, requests = [] }) {
  const [selectedRequest, setSelectedRequest] = useState(null)

  if (!isOpen) return null

  // Моковые данные для демонстрации, если заявок нет
  const displayRequests = requests.length > 0 ? requests : [
    {
      id: 1,
      playerName: 'Storm_Warrior',
      level: 87,
      avatar: getAvatarByIndex(0),
      role: 'Новобранец',
      merits: 45230,
      message: 'Хочу присоединиться к вашей гильдии! Опытный игрок, активен каждый день.',
      appliedAt: '2 часа назад'
    },
    {
      id: 2,
      playerName: 'Ice_Mage',
      level: 92,
      avatar: getAvatarByIndex(1),
      role: 'Ветеран',
      merits: 67890,
      message: 'Ищу активную гильдию для совместных рейдов и развития.',
      appliedAt: '5 часов назад'
    },
    {
      id: 3,
      playerName: 'Fire_Dragon',
      level: 105,
      avatar: getAvatarByIndex(2),
      role: 'Новобранец',
      merits: 89120,
      message: 'Готов вносить вклад в развитие гильдии!',
      appliedAt: '1 день назад'
    }
  ]

  const handleAccept = (requestId) => {
    alert(`Заявка от ${displayRequests.find(r => r.id === requestId)?.playerName} принята!`)
    // Здесь будет логика принятия заявки
  }

  const handleReject = (requestId) => {
    if (window.confirm(`Отклонить заявку от ${displayRequests.find(r => r.id === requestId)?.playerName}?`)) {
      alert('Заявка отклонена')
      // Здесь будет логика отклонения заявки
    }
  }

  return (
    <div className="requests-modal-overlay" onClick={onClose}>
      <div className="requests-modal" onClick={(e) => e.stopPropagation()}>
        <div className="requests-modal-header">
          <div className="requests-modal-title">
            <span className="requests-modal-icon">📨</span>
            <span className="requests-modal-title-text">Заявки в гильдию</span>
            {displayRequests.length > 0 && (
              <span className="requests-count-badge">{displayRequests.length}</span>
            )}
          </div>
          <button className="requests-modal-close" onClick={onClose}>×</button>
        </div>

        <div className="requests-modal-content">
          {displayRequests.length === 0 ? (
            <div className="requests-empty">
              <div className="requests-empty-icon">📭</div>
              <div className="requests-empty-text">Нет новых заявок</div>
            </div>
          ) : (
            <div className="requests-list">
              {displayRequests.map((request) => (
                <div 
                  key={request.id} 
                  className={`request-card ${selectedRequest === request.id ? 'selected' : ''}`}
                  onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                >
                  <div className="request-card-header">
                    <div className="request-player-info">
                      <div className="request-avatar">
                        {typeof request.avatar === 'string' && (request.avatar.startsWith('/') || request.avatar.startsWith('http')) ? (
                          <img src={request.avatar} alt={request.playerName} className="request-avatar-image" />
                        ) : (
                          <div className="request-avatar-placeholder">
                            {typeof request.avatar === 'string' ? request.avatar : '?'}
                          </div>
                        )}
                      </div>
                      <div className="request-player-details">
                        <div className="request-player-name">{request.playerName}</div>
                        <div className="request-player-meta">
                          <span className="request-level">Уровень {request.level}</span>
                          <span className="request-separator">•</span>
                          <span className="request-time">{request.appliedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="request-actions">
                      <button 
                        className="request-action-btn request-accept-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAccept(request.id)
                        }}
                        title="Принять"
                      >
                        ✓
                      </button>
                      <button 
                        className="request-action-btn request-reject-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReject(request.id)
                        }}
                        title="Отклонить"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  {selectedRequest === request.id && (
                    <div className="request-card-details">
                      <div className="request-detail-row">
                        <span className="request-detail-label">Роль:</span>
                        <span className="request-detail-value request-role">{request.role}</span>
                      </div>
                      <div className="request-detail-row">
                        <span className="request-detail-label">Заслуги:</span>
                        <div className="request-merits-wrapper">
                          <img src={getMeritsImage()} alt="Заслуги" className="request-merits-icon" />
                          <span className="request-detail-value request-merits">{request.merits.toLocaleString()}</span>
                        </div>
                      </div>
                      {request.message && (
                        <div className="request-message">
                          <div className="request-message-label">Сообщение:</div>
                          <div className="request-message-text">{request.message}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestsModal

