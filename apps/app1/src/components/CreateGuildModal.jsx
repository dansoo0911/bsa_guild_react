import { useState, useEffect } from 'react'
import './CreateGuildModal.css'
import { getRubyImage } from '../utils/imageUtils'

function CreateGuildModal({ isOpen, onClose, onCreateGuild, playerCrystals = 0, currentGuildName = null }) {
  const [guildName, setGuildName] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [validationError, setValidationError] = useState('')
  const creationCost = 50

  // Запрещенные слова для названий гильдий
  const forbiddenWords = ['admin', 'модератор', 'moderator', 'test', 'тест', 'null', 'undefined']

  useEffect(() => {
    if (isOpen) {
      setGuildName('')
      setValidationError('')
      setShowPaymentModal(false)
    }
  }, [isOpen])

  const validateGuildName = (name) => {
    const trimmedName = name.trim()
    
    if (!trimmedName) {
      return 'Введите название гильдии'
    }
    
    if (trimmedName.length < 3) {
      return 'Название должно содержать минимум 3 символа'
    }
    
    if (trimmedName.length > 30) {
      return 'Название не должно превышать 30 символов'
    }
    
    // Проверка на запрещенные слова
    const lowerName = trimmedName.toLowerCase()
    for (const word of forbiddenWords) {
      if (lowerName.includes(word.toLowerCase())) {
        return 'Название содержит запрещенные слова'
      }
    }
    
    // Проверка на специальные символы (разрешаем только буквы, цифры, пробелы и некоторые символы)
    if (!/^[а-яА-ЯёЁa-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
      return 'Название может содержать только буквы, цифры, пробелы, дефисы и подчеркивания'
    }
    
    return ''
  }

  const handleNameChange = (e) => {
    const newName = e.target.value
    setGuildName(newName)
    setValidationError(validateGuildName(newName))
  }

  const handleCreate = () => {
    const error = validateGuildName(guildName)
    if (error) {
      setValidationError(error)
      return
    }

    if (currentGuildName) {
      setValidationError('Вы уже состоите в гильдии. Покиньте текущую гильдию перед созданием новой.')
      return
    }

    if (playerCrystals < creationCost) {
      setValidationError(`Недостаточно кристаллов! У вас: ${playerCrystals}, требуется: ${creationCost}`)
      return
    }

    setShowPaymentModal(true)
  }

  const handlePaymentConfirm = () => {
    if (onCreateGuild) {
      onCreateGuild(guildName.trim())
    }
    setShowPaymentModal(false)
    setGuildName('')
    onClose()
  }

  const handlePaymentCancel = () => {
    setShowPaymentModal(false)
  }

  const handleClose = () => {
    setGuildName('')
    setShowPaymentModal(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content create-guild-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Создание гильдии</h2>
            <button className="modal-close-button" onClick={handleClose}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="create-guild-section">
              <label className="create-guild-label">
                Название гильдии
              </label>
              <input 
                type="text" 
                className="create-guild-input" 
                placeholder="Введите название гильдии" 
                value={guildName}
                onChange={handleNameChange}
                maxLength={30}
              />
              <div className="create-guild-hint">
                {guildName.length}/30 символов
                {guildName.length >= 3 && guildName.length <= 30 && !validationError && (
                  <span className="hint-valid">✓</span>
                )}
              </div>
            </div>

            <div className="create-guild-cost-section">
              <div className="cost-label">Стоимость создания:</div>
              <div className="cost-amount">
                <img src={getRubyImage()} alt="Кристаллы" className="cost-icon" />
                <span className="cost-value">{creationCost}</span>
              </div>
              <div className={`cost-balance ${playerCrystals >= creationCost ? 'sufficient' : 'insufficient'}`}>
                <span className="balance-label">Ваш баланс:</span>
                <span className="balance-value">{playerCrystals}</span>
                {playerCrystals < creationCost && (
                  <span className="balance-warning">Недостаточно кристаллов</span>
                )}
              </div>
            </div>

            {validationError && (
              <div className="validation-error">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{validationError}</span>
              </div>
            )}

            {currentGuildName && (
              <div className="validation-warning">
                <span className="warning-icon">ℹ️</span>
                <span className="warning-text">Вы уже состоите в гильдии "{currentGuildName}". Покиньте текущую гильдию перед созданием новой.</span>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button className="modal-button modal-button-cancel" onClick={handleClose}>
              Отмена
            </button>
            <button 
              className="modal-button modal-button-create" 
              onClick={handleCreate}
              disabled={!guildName.trim() || !!validationError || playerCrystals < creationCost || !!currentGuildName}
              title={
                currentGuildName 
                  ? 'Вы уже состоите в гильдии'
                  : playerCrystals < creationCost 
                    ? `Недостаточно кристаллов (нужно ${creationCost})`
                    : validationError || 'Создать гильдию'
              }
            >
              Создать гильдию
            </button>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="modal-overlay" onClick={handlePaymentCancel}>
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Подтверждение создания гильдии</h2>
              <button className="modal-close-button" onClick={handlePaymentCancel}>×</button>
            </div>
            <div className="modal-body">
              <div className="payment-info">
                <p className="payment-text">Создание гильдии "{guildName.trim()}" стоит:</p>
                <div className="payment-amount-container">
                  <img src={getRubyImage()} alt="Кристаллы" className="currency-icon-large" />
                  <span className="payment-amount">{creationCost}</span>
                </div>
                <div className="payment-balance-info">
                  <div className="balance-before">
                    <span>Ваш баланс:</span>
                    <span className="balance-number">{playerCrystals}</span>
                  </div>
                  <div className="balance-arrow">→</div>
                  <div className="balance-after">
                    <span>После оплаты:</span>
                    <span className="balance-number">{Math.max(0, playerCrystals - creationCost)}</span>
                  </div>
                </div>
                <p className="payment-text-small">Название гильдии: <strong>{guildName.trim()}</strong></p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-button modal-button-cancel" onClick={handlePaymentCancel}>
                Отмена
              </button>
              <button className="modal-button modal-button-save" onClick={handlePaymentConfirm}>
                Оплатить и создать
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CreateGuildModal

