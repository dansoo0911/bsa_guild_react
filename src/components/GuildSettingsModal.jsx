import { useState, useEffect } from 'react'
import './GuildSettingsModal.css'
import currencyRuby from '../assets/images/currency_ruby.png'
import { roleColorTemplates, rolePermissions } from '../config/roleColorTemplates'

function GuildSettingsModal({ isOpen, onClose, guildName, guildDescription = '', onSave }) {
  const [activeTab, setActiveTab] = useState('guild') // 'guild', 'roles', or 'history'
  const [name, setName] = useState(guildName)
  const [description, setDescription] = useState(guildDescription)
  const [autoAccept, setAutoAccept] = useState(false)
  const [showLeaderInList, setShowLeaderInList] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [nameChanged, setNameChanged] = useState(false)
  
  // Роли
  const [roles, setRoles] = useState([
    { id: 'leader', name: 'Глава', color: 'red', permissions: rolePermissions.map(p => p.id), isDefault: true },
    { id: 'deputy', name: 'Заместитель', color: 'pink', permissions: rolePermissions.map(p => p.id), isDefault: true },
    { id: 'veteran', name: 'Ветеран', color: 'purple', permissions: ['view_guild_balance', 'send_chat_messages'], isDefault: true },
    { id: 'newbie', name: 'Новобранец', color: 'blue', permissions: ['view_guild_balance', 'send_chat_messages'], isDefault: true }
  ])
  const [editingRole, setEditingRole] = useState(null)
  const [customRoles, setCustomRoles] = useState([])
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [selectedTemplateName, setSelectedTemplateName] = useState('')
  
  // Предложенные названия ролей
  const roleNameTemplates = [
    'Офицер',
    'Капитан',
    'Командир',
    'Стратег',
    'Тактик',
    'Воитель',
    'Маг',
    'Лекарь',
    'Разведчик',
    'Защитник',
    'Атакующий',
    'Поддержка',
    'Элита',
    'Мастер',
    'Эксперт',
    'Профессионал',
    'Специалист',
    'Ветеран',
    'Опытный',
    'Новичок'
  ]


  useEffect(() => {
    if (isOpen) {
      setName(guildName)
      setDescription(guildDescription)
      setNameChanged(false)
      setEditingRole(null)
    }
  }, [isOpen, guildName, guildDescription])

  const handleNameChange = (e) => {
    const newName = e.target.value
    setName(newName)
    if (newName !== guildName) {
      setNameChanged(true)
    } else {
      setNameChanged(false)
    }
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
  }

  const handleAutoAcceptChange = (e) => {
    setAutoAccept(e.target.checked)
  }

  const handleShowLeaderChange = (e) => {
    setShowLeaderInList(e.target.checked)
  }

  const handleIsClosedChange = (e) => {
    setIsClosed(e.target.checked)
  }

  const handleSave = () => {
    if (nameChanged) {
      setShowPaymentModal(true)
    } else {
      onSave({
        name: name,
        description: description,
        autoAccept: autoAccept,
        showLeaderInList: showLeaderInList,
        isClosed: isClosed,
        roles: [...roles, ...customRoles]
      })
      onClose()
    }
  }

  const handlePaymentConfirm = () => {
    onSave({
      name: name,
      description: description,
      autoAccept: autoAccept,
      showLeaderInList: showLeaderInList,
      isClosed: isClosed,
      roles: [...roles, ...customRoles]
    })
    setShowPaymentModal(false)
    onClose()
  }

  const handlePaymentCancel = () => {
    setShowPaymentModal(false)
    setName(guildName)
    setNameChanged(false)
  }

  const isRoleEditable = (roleId) => {
    return roleId !== 'leader' && roleId !== 'deputy'
  }

  const handleRoleColorChange = (roleId, colorId) => {
    if (editingRole === roleId && isRoleEditable(roleId)) {
      setRoles(roles.map(r => r.id === roleId ? { ...r, color: colorId } : r))
      setCustomRoles(customRoles.map(r => r.id === roleId ? { ...r, color: colorId } : r))
    }
  }

  const handleRolePermissionToggle = (roleId, permissionId) => {
    if (editingRole === roleId && isRoleEditable(roleId)) {
      const updateRole = (role) => {
        if (role.id === roleId) {
          const hasPermission = role.permissions.includes(permissionId)
          return {
            ...role,
            permissions: hasPermission
              ? role.permissions.filter(p => p !== permissionId)
              : [...role.permissions, permissionId]
          }
        }
        return role
      }
      setRoles(roles.map(updateRole))
      setCustomRoles(customRoles.map(updateRole))
    }
  }

  const handleRoleNameChange = (roleId, newName) => {
    if (editingRole === roleId && isRoleEditable(roleId)) {
      const updateRole = (role) => {
        if (role.id === roleId) {
          return { ...role, name: newName }
        }
        return role
      }
      setRoles(roles.map(updateRole))
      setCustomRoles(customRoles.map(updateRole))
    }
  }

  const handleCreateCustomRole = () => {
    setShowCreateRoleModal(true)
    setNewRoleName('')
    setSelectedTemplateName('')
  }

  const handleCreateRoleConfirm = () => {
    const roleName = selectedTemplateName || newRoleName || 'Новая роль'
    const newRole = {
      id: `custom_${Date.now()}`,
      name: roleName,
      color: 'blue',
      permissions: ['view_guild_balance', 'send_chat_messages'],
      isDefault: false
    }
    setCustomRoles([...customRoles, newRole])
    setEditingRole(newRole.id)
    setShowCreateRoleModal(false)
    setNewRoleName('')
    setSelectedTemplateName('')
  }

  const handleCreateRoleCancel = () => {
    setShowCreateRoleModal(false)
    setNewRoleName('')
    setSelectedTemplateName('')
  }

  const handleTemplateNameSelect = (templateName) => {
    setSelectedTemplateName(templateName)
    setNewRoleName('')
  }


  const handleDeleteCustomRole = (roleId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту роль?')) {
      setCustomRoles(customRoles.filter(r => r.id !== roleId))
      if (editingRole === roleId) {
        setEditingRole(null)
      }
    }
  }

  const getRoleColor = (colorId) => {
    const template = roleColorTemplates.find(t => t.id === colorId)
    return template ? template.color : '#4169E1'
  }

  const getRoleGradient = (colorId) => {
    const template = roleColorTemplates.find(t => t.id === colorId)
    return template ? template.gradient : 'linear-gradient(135deg, #4169E1 0%, #1E40AF 100%)'
  }

  if (!isOpen) return null

  const allRoles = [...roles, ...customRoles]

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content settings-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Настройки гильдии</h2>
            <button className="modal-close-button" onClick={onClose}>×</button>
          </div>
          
          {/* Вкладки */}
          <div className="settings-tabs">
            <button 
              className={`settings-tab ${activeTab === 'guild' ? 'active' : ''}`}
              onClick={() => setActiveTab('guild')}
            >
              Настройки гильдии
            </button>
            <button 
              className={`settings-tab ${activeTab === 'roles' ? 'active' : ''}`}
              onClick={() => setActiveTab('roles')}
            >
              Настройки ролей
            </button>
          </div>

          <div className="modal-body">
            {activeTab === 'guild' && (
              <>
                <div className="settings-section">
                  <h3 className="settings-section-title">Основные настройки</h3>
                  <div className="settings-item">
                    <label className="settings-label">
                      Название гильдии
                      {nameChanged && (
                        <span className="payment-info-inline">
                          <img src={currencyRuby} alt="Рубины" className="currency-icon-small" />
                          <span className="payment-cost">100</span>
                        </span>
                      )}
                    </label>
                    <input 
                      type="text" 
                      className="settings-input" 
                      placeholder="Введите название" 
                      value={name}
                      onChange={handleNameChange}
                    />
                    {nameChanged && (
                      <div className="payment-restriction">
                        <span className="restriction-icon">⏱</span>
                        <span className="restriction-text">Переименование доступно не чаще 1 раза в 7 дней</span>
                      </div>
                    )}
                  </div>
                  <div className="settings-item">
                    <label className="settings-label">Описание гильдии</label>
                    <textarea 
                      className="settings-textarea" 
                      placeholder="Введите описание" 
                      rows="4"
                      value={description}
                      onChange={handleDescriptionChange}
                    ></textarea>
                  </div>
                </div>
                <div className="settings-section">
                  <h3 className="settings-section-title">Права доступа</h3>
                  <div className="settings-item">
                    <label className="settings-checkbox-label">
                      <input 
                        type="checkbox" 
                        className="settings-checkbox" 
                        checked={autoAccept}
                        onChange={handleAutoAcceptChange}
                      />
                      <span>Автоматическое принятие заявок</span>
                    </label>
                  </div>
                  <div className="settings-item">
                    <label className="settings-checkbox-label">
                      <input 
                        type="checkbox" 
                        className="settings-checkbox" 
                        checked={showLeaderInList}
                        onChange={handleShowLeaderChange}
                      />
                      <span>Отображать лидера гильдии в списке гильдий</span>
                    </label>
                  </div>
                  <div className="settings-item">
                    <label className="settings-checkbox-label">
                      <input 
                        type="checkbox" 
                        className="settings-checkbox" 
                        checked={isClosed}
                        onChange={handleIsClosedChange}
                      />
                      <span>Закрытая гильдия</span>
                      <div className="info-icon-wrapper">
                        <span className="info-icon-tooltip" title="При включении этой настройки невозможно будет отправить заявку на вступление в гильдию">ℹ️</span>
                      </div>
                    </label>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'roles' && (
              <div className="settings-section">
                <div className="roles-header">
                  <h3 className="settings-section-title">Управление ролями</h3>
                  <button className="create-role-button" onClick={handleCreateCustomRole}>
                    + Создать роль
                  </button>
                </div>
                
                <div className="roles-list">
                  {allRoles.map((role) => (
                    <div 
                      key={role.id} 
                      className={`role-card ${editingRole === role.id ? 'editing' : ''}`}
                    >
                      <div 
                        className={`role-card-header ${!isRoleEditable(role.id) ? 'role-locked' : ''}`}
                        onClick={() => {
                          if (isRoleEditable(role.id)) {
                            setEditingRole(editingRole === role.id ? null : role.id)
                          }
                        }}
                      >
                        <div className="role-card-info">
                          <div 
                            className="role-color-preview"
                            style={{ background: getRoleGradient(role.color) }}
                          ></div>
                          <div className="role-name-display">
                            {editingRole === role.id && isRoleEditable(role.id) ? (
                              <input
                                type="text"
                                className="role-name-input"
                                value={role.name}
                                onChange={(e) => handleRoleNameChange(role.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span className="role-name-text">{role.name}</span>
                            )}
                            {role.isDefault && <span className="role-default-badge">По умолчанию</span>}
                            {!isRoleEditable(role.id) && <span className="role-locked-badge">🔒 Заблокировано</span>}
                          </div>
                        </div>
                        <div className="role-card-actions">
                          {!role.isDefault && (
                            <button
                              className="role-delete-button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteCustomRole(role.id)
                              }}
                              title="Удалить роль"
                            >
                              ×
                            </button>
                          )}
                          {isRoleEditable(role.id) && (
                            <span className="role-expand-icon">{editingRole === role.id ? '▲' : '▼'}</span>
                          )}
                        </div>
                      </div>
                      
                      {editingRole === role.id && isRoleEditable(role.id) && (
                        <div className="role-card-details">
                          <div className="role-color-section">
                            <label className="role-detail-label">Цвет роли</label>
                            <div className="color-templates-grid">
                              {roleColorTemplates.map((template) => (
                                <button
                                  key={template.id}
                                  className={`color-template ${role.color === template.id ? 'selected' : ''}`}
                                  style={{ background: template.gradient }}
                                  onClick={() => handleRoleColorChange(role.id, template.id)}
                                  title={template.name}
                                >
                                  {role.color === template.id && <span className="color-check">✓</span>}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="role-permissions-section">
                            <label className="role-detail-label">Права доступа</label>
                            <div className="permissions-list">
                              {rolePermissions.map((permission) => {
                                const hasPermission = role.permissions.includes(permission.id)
                                return (
                                  <label key={permission.id} className="permission-item">
                                    <input
                                      type="checkbox"
                                      checked={hasPermission}
                                      onChange={() => handleRolePermissionToggle(role.id, permission.id)}
                                    />
                                    <div className="permission-info">
                                      <span className="permission-name">{permission.name}</span>
                                      <span className="permission-description">{permission.description}</span>
                                    </div>
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button className="modal-button modal-button-cancel" onClick={onClose}>
              Отмена
            </button>
            <button className="modal-button modal-button-save" onClick={handleSave}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
      
      {showPaymentModal && (
        <div className="modal-overlay" onClick={handlePaymentCancel}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Оплата изменения названия</h2>
              <button className="modal-close-button" onClick={handlePaymentCancel}>×</button>
            </div>
            <div className="modal-body">
              <div className="payment-info">
                <p className="payment-text">Изменение названия гильдии стоит:</p>
                <div className="payment-amount-container">
                  <img src={currencyRuby} alt="Рубины" className="currency-icon-large" />
                  <span className="payment-amount">100</span>
                </div>
                <p className="payment-text-small">Новое название: <strong>{name}</strong></p>
                <div className="payment-restriction-block">
                  <span className="restriction-icon">⏱</span>
                  <span className="restriction-text">Переименование доступно не чаще 1 раза в 7 дней</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-button modal-button-cancel" onClick={handlePaymentCancel}>
                Отмена
              </button>
              <button className="modal-button modal-button-save" onClick={handlePaymentConfirm}>
                Оплатить и сохранить
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showCreateRoleModal && (
        <div className="modal-overlay" onClick={handleCreateRoleCancel}>
          <div className="modal-content create-role-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Создание новой роли</h2>
              <button className="modal-close-button" onClick={handleCreateRoleCancel}>×</button>
            </div>
            <div className="modal-body">
              <div className="create-role-content">
                <div className="create-role-section">
                  <label className="role-detail-label">Выберите название из списка</label>
                  <div className="role-name-templates-grid">
                    {roleNameTemplates.map((template) => (
                      <button
                        key={template}
                        className={`role-name-template ${selectedTemplateName === template ? 'selected' : ''}`}
                        onClick={() => handleTemplateNameSelect(template)}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="create-role-section">
                  <label className="role-detail-label">Или введите свое название</label>
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Введите название роли"
                    value={newRoleName}
                    onChange={(e) => {
                      setNewRoleName(e.target.value)
                      setSelectedTemplateName('')
                    }}
                  />
                </div>
                
                {(selectedTemplateName || newRoleName.trim()) && (
                  <div className="create-role-preview">
                    <span className="preview-label">Выбрано:</span>
                    <span className="preview-value">{selectedTemplateName || newRoleName}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-button modal-button-cancel" onClick={handleCreateRoleCancel}>
                Отмена
              </button>
              <button 
                className="modal-button modal-button-save" 
                onClick={handleCreateRoleConfirm}
                disabled={!selectedTemplateName && !newRoleName.trim()}
              >
                Создать роль
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GuildSettingsModal
