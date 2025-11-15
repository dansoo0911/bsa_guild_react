import { useState, useEffect } from 'react'
import { guildConfig } from '../config/guildConfig'
import { isSpeedrunActiveAuto } from '../utils/speedrunUtils'
import './DevSettingsPanel.css'

function DevSettingsPanel({ onRoleChange, onCrystalsChange, guildCrystals, onSpeedrunActiveChange, onShowBestPlaceChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentRole, setCurrentRole] = useState(guildConfig.myRole)
  const [crystalsInput, setCrystalsInput] = useState(guildCrystals || 0)
  const [speedrunIsActive, setSpeedrunIsActive] = useState(
    guildConfig.speedrun?.isActive ?? isSpeedrunActiveAuto()
  )
  const [showBestPlace, setShowBestPlace] = useState(
    guildConfig.speedrun?.showBestPlace ?? true
  )

  // Синхронизируем input с внешним значением
  useEffect(() => {
    setCrystalsInput(guildCrystals || 0)
  }, [guildCrystals])
  
  const availableRoles = ['Глава', 'Заместитель', 'Ветеран', 'Новобранец']

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole)
    if (onRoleChange) {
      onRoleChange(newRole)
    }
    // Обновляем конфигурацию
    guildConfig.myRole = newRole
  }

  const handleCrystalsChange = (newCrystals) => {
    const crystals = Math.max(0, parseInt(newCrystals) || 0)
    setCrystalsInput(crystals)
    if (onCrystalsChange) {
      onCrystalsChange(crystals)
    }
  }

  const handleSpeedrunActiveToggle = (active) => {
    setSpeedrunIsActive(active)
    guildConfig.speedrun = guildConfig.speedrun || {}
    guildConfig.speedrun.isActive = active
    guildConfig.speedrun.manualOverride = true // Всегда ручное управление
    
    if (onSpeedrunActiveChange) {
      onSpeedrunActiveChange(guildConfig.speedrun)
    }
  }

  const handleShowBestPlaceToggle = (show) => {
    setShowBestPlace(show)
    guildConfig.speedrun = guildConfig.speedrun || {}
    guildConfig.speedrun.showBestPlace = show
    
    if (onShowBestPlaceChange) {
      onShowBestPlaceChange(show)
    }
  }

  // Синхронизируем состояние с конфигурацией
  useEffect(() => {
    if (guildConfig.speedrun) {
      setSpeedrunIsActive(guildConfig.speedrun.isActive ?? isSpeedrunActiveAuto())
      setShowBestPlace(guildConfig.speedrun.showBestPlace ?? true)
      // Всегда устанавливаем ручное управление
      guildConfig.speedrun.manualOverride = true
    }
  }, [])

  return (
    <div className={`dev-settings-panel ${isExpanded ? 'expanded' : ''}`}>
      <div 
        className="dev-settings-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="dev-settings-title">
          <span className="dev-settings-icon">⚙️</span>
          <span className="dev-settings-label">Технические настройки</span>
        </div>
        <div className="dev-settings-toggle">
          {isExpanded ? '▲' : '▼'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="dev-settings-content">
          <div className="dev-settings-section">
            <div className="dev-section-title">Роль в гильдии</div>
            <div className="dev-role-selector">
              {availableRoles.map((role) => (
                <button
                  key={role}
                  className={`dev-role-btn ${currentRole === role ? 'active' : ''}`}
                  onClick={() => handleRoleChange(role)}
                >
                  {role}
                </button>
              ))}
            </div>
            <div className="dev-current-role">
              <span className="dev-current-label">Текущая роль:</span>
              <span className={`dev-current-value role-${currentRole.toLowerCase()}`}>
                {currentRole}
              </span>
            </div>
          </div>
          
          <div className="dev-settings-section">
            <div className="dev-section-title">Кристаллы гильдии</div>
            <div className="dev-crystals-control">
              <input
                type="number"
                className="dev-crystals-input"
                min="0"
                value={crystalsInput}
                onChange={(e) => setCrystalsInput(Math.max(0, parseInt(e.target.value) || 0))}
                onBlur={(e) => handleCrystalsChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCrystalsChange(crystalsInput)
                    e.target.blur()
                  }
                }}
              />
              <button
                className="dev-crystals-apply"
                onClick={() => handleCrystalsChange(crystalsInput)}
              >
                Применить
              </button>
            </div>
            <div className="dev-current-value-display">
              <span className="dev-current-label">Текущее значение:</span>
              <span className="dev-current-value">{guildCrystals || 0}</span>
            </div>
          </div>

          <div className="dev-settings-section">
            <div className="dev-section-title">Спидран</div>
            <div className="dev-speedrun-control">
              <div className="dev-speedrun-row">
                <span className="dev-speedrun-label">Спидран активен:</span>
                <label className="dev-toggle-switch">
                  <input
                    type="checkbox"
                    checked={speedrunIsActive}
                    onChange={(e) => handleSpeedrunActiveToggle(e.target.checked)}
                  />
                  <span className="dev-toggle-slider"></span>
                </label>
              </div>
              <div className="dev-speedrun-row">
                <span className="dev-speedrun-label">Лучшее место в спидране:</span>
                <label className="dev-toggle-switch">
                  <input
                    type="checkbox"
                    checked={showBestPlace}
                    onChange={(e) => handleShowBestPlaceToggle(e.target.checked)}
                  />
                  <span className="dev-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DevSettingsPanel

