import { useState } from 'react'
import './MembersModal.css'

const roles = ['Глава', 'Заместитель', 'Ветеран', 'Новобранец']

function MembersModal({ isOpen, onClose, players = [], onKickMember, onRoleChange }) {
  const [editingRole, setEditingRole] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')

  if (!isOpen) return null

  const handleEditRole = (player) => {
    setEditingRole(player.name)
    setSelectedRole(player.role)
  }

  const handleSaveRole = (playerName) => {
    if (selectedRole && onRoleChange) {
      onRoleChange(playerName, selectedRole)
    }
    setEditingRole(null)
    setSelectedRole('')
  }

  const handleCancelEdit = () => {
    setEditingRole(null)
    setSelectedRole('')
  }

  const handleKick = (playerName) => {
    if (window.confirm(`Вы уверены, что хотите выгнать ${playerName} из гильдии?`)) {
      if (onKickMember) {
        onKickMember(playerName)
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content members-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Участники гильдии</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body members-modal-body">
          <div className="members-table-container">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Lvl.</th>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Points</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr key={index}>
                    <td>{player.level}</td>
                    <td>
                      <div className="player-avatar">{player.avatar}</div>
                    </td>
                    <td>{player.name}</td>
                    <td>
                      {editingRole === player.name ? (
                        <div className="role-edit-container">
                          <select
                            className="role-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                          <button
                            className="role-save-button"
                            onClick={() => handleSaveRole(player.name)}
                          >
                            ✓
                          </button>
                          <button
                            className="role-cancel-button"
                            onClick={handleCancelEdit}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="role-display-container">
                          <span className={`player-role role-${player.role.toLowerCase()}`}>
                            {player.role}
                          </span>
                          <button
                            className="role-edit-button"
                            onClick={() => handleEditRole(player)}
                            title="Изменить роль"
                          >
                            ✎
                          </button>
                        </div>
                      )}
                    </td>
                    <td>{player.points}</td>
                    <td>
                      <span className={`player-status ${player.status === 'играет' ? 'status-online' : 'status-offline'}`}>
                        {player.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="kick-button"
                        onClick={() => handleKick(player.name)}
                        title="Выгнать из гильдии"
                      >
                        Выгнать
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-button modal-button-cancel" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  )
}

export default MembersModal





