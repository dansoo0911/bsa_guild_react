import { useState, useEffect, useRef } from 'react'
import { guildConfig } from '../config/guildConfig'
import { generatePlayers } from '../utils/generatePlayers'
import { getAvatarByIndex } from '../utils/imageUtils'
import { discordEmojis, discordEmojisMap } from '../config/discordEmojis'
import { rolePermissions } from '../config/roleColorTemplates'
import './GuildChat.css'

function GuildChat({ onClose }) {
  const messagesEndRef = useRef(null)
  const emojiPanelRef = useRef(null)
  const [showEmojiPanel, setShowEmojiPanel] = useState(false)
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      author: 'Player1', 
      authorRole: 'Глава',
      authorAvatar: getAvatarByIndex(0),
      text: 'Привет всем! Добро пожаловать в гильдию!', 
      time: '12:30',
      isOnline: true
    },
    { 
      id: 2, 
      author: 'Player2', 
      authorRole: 'Заместитель',
      authorAvatar: getAvatarByIndex(1),
      text: 'Кто готов к рейду? Нужно 5 человек.', 
      time: '12:32',
      isOnline: true
    },
    { 
      id: 3, 
      author: 'Player3', 
      authorRole: 'Ветеран',
      authorAvatar: getAvatarByIndex(2),
      text: 'Я готов! Можем начать через 10 минут.', 
      time: '12:33',
      isOnline: false
    },
    {
      id: 4,
      author: 'Player4',
      authorRole: 'Новобранец',
      authorAvatar: getAvatarByIndex(3),
      text: 'Это мой первый рейд, буду рад присоединиться!',
      time: '12:35',
      isOnline: true
    },
    {
      id: 5,
      author: 'Система',
      authorRole: 'Система',
      authorAvatar: null,
      text: 'скрафтил Меч Пламени (Легендарный)',
      time: '12:40',
      isOnline: false,
      isSystem: true,
      playerName: 'Storm_Warrior',
      playerAvatar: getAvatarByIndex(0),
      eventType: 'item_crafted'
    },
    {
      id: 6,
      author: 'Система',
      authorRole: 'Система',
      authorAvatar: null,
      text: 'улучшил Посох Льда с уровня 5 до уровня 6',
      time: '12:42',
      isOnline: false,
      isSystem: true,
      playerName: 'Ice_Mage',
      playerAvatar: getAvatarByIndex(1),
      eventType: 'item_upgraded'
    },
    {
      id: 7,
      author: 'Система',
      authorRole: 'Система',
      authorAvatar: null,
      text: 'впервые прошел уровень 42 - Логово Дракона',
      time: '12:45',
      isOnline: false,
      isSystem: true,
      playerName: 'Fire_Dragon',
      playerAvatar: getAvatarByIndex(2),
      eventType: 'level_completed'
    },
    {
      id: 8,
      author: 'Система',
      authorRole: 'Система',
      authorAvatar: null,
      text: 'скрафтил Щит Защитника (Эпический)',
      time: '13:00',
      isOnline: false,
      isSystem: true,
      playerName: 'Deputy_Player',
      playerAvatar: getAvatarByIndex(1),
      eventType: 'item_crafted'
    },
    {
      id: 9,
      author: 'Система',
      authorRole: 'Система',
      authorAvatar: null,
      text: 'улучшил Кольцо Власти с уровня 10 до уровня 11',
      time: '13:15',
      isOnline: false,
      isSystem: true,
      playerName: 'Player_Leader',
      playerAvatar: getAvatarByIndex(0),
      eventType: 'item_upgraded'
    },
    {
      id: 10,
      author: 'Система',
      authorRole: 'Система',
      authorAvatar: null,
      text: 'впервые прошел уровень 35 - Подземелье Теней',
      time: '13:30',
      isOnline: false,
      isSystem: true,
      playerName: 'Active_Player',
      playerAvatar: getAvatarByIndex(3),
      eventType: 'level_completed'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [hoveredMessageId, setHoveredMessageId] = useState(null)
  const players = generatePlayers()
  const currentPlayer = players.find(p => p.name === guildConfig.myName) || players[0]
  
  // Проверка прав на удаление сообщений
  const canDeleteMessages = () => {
    const currentRole = guildConfig.myRole
    // Глава и Заместитель имеют все права, включая удаление сообщений
    if (currentRole === 'Глава' || currentRole === 'Заместитель') {
      return true
    }
    // Для других ролей нужно проверить права из настроек
    // Здесь можно добавить проверку через конфигурацию ролей
    return false
  }
  
  const hasDeletePermission = canDeleteMessages()

  // Автоскролл при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        author: currentPlayer.name,
        authorRole: guildConfig.myRole,
        authorAvatar: currentPlayer.avatar,
        text: newMessage,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isOnline: true
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Вы уверены, что хотите удалить это сообщение?')) {
      setMessages(messages.filter(m => m.id !== messageId))
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Глава':
        return '#FF0000'
      case 'Заместитель':
        return '#FF69B4'
      case 'Ветеран':
        return '#8A2BE2'
      case 'Новобранец':
        return '#4169E1'
      case 'Система':
        return '#FFD700'
      default:
        return '#B8C5D1'
    }
  }

  // Популярные эмодзи для чата
  const emojiCategories = [
    {
      name: 'Смайлики',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏']
    },
    {
      name: 'Эмоции',
      emojis: ['😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴']
    },
    {
      name: 'Жесты',
      emojis: ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿']
    },
    {
      name: 'Discord эмодзи',
      emojis: discordEmojis.length > 0 ? discordEmojis : [
        // Если нет настроенных эмодзи, показываем подсказку
        { type: 'placeholder', text: 'Добавьте эмодзи в config/discordEmojis.js' }
      ]
    },
    {
      name: 'Предметы',
      emojis: ['🎮', '🎯', '🎲', '🃏', '🀄', '🎴', '🎨', '🖼️', '🎭', '🎪', '🎬', '🎤', '🎧', '🎵', '🎶', '🎸', '🎹', '🥁', '🎺', '🎷', '🎻', '🎧', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾']
    },
    {
      name: 'Символы',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈']
    }
  ]

  const handleEmojiClick = (emoji) => {
    if (typeof emoji === 'object' && emoji.type === 'discord') {
      // Discord эмодзи в формате <:name:id>
      setNewMessage(prev => prev + `<:${emoji.name}:${emoji.id}>`)
    } else {
      // Обычный Unicode эмодзи
      setNewMessage(prev => prev + emoji)
    }
    setShowEmojiPanel(false)
  }

  // Функция для рендеринга текста с поддержкой Discord эмодзи
  const renderMessageText = (text) => {
    // Паттерн для Discord эмодзи: <:name:id> или <a:name:id> (анимированные)
    const discordEmojiPattern = /<a?:(\w+):(\d+)>/g
    const discordEmojiShortPattern = /:(\w+):/g

    let result = []
    let lastIndex = 0
    let match

    // Обработка полного формата <:name:id>
    const fullMatches = []
    while ((match = discordEmojiPattern.exec(text)) !== null) {
      fullMatches.push({
        index: match.index,
        length: match[0].length,
        name: match[1],
        id: match[2]
      })
    }

    // Обработка короткого формата :name:
    const shortMatches = []
    const tempText = text
    while ((match = discordEmojiShortPattern.exec(tempText)) !== null) {
      // Проверяем, не является ли это частью полного формата
      const isPartOfFull = fullMatches.some(fm => 
        match.index >= fm.index && match.index < fm.index + fm.length
      )
      if (!isPartOfFull) {
        shortMatches.push({
          index: match.index,
          length: match[0].length,
          name: match[1]
        })
      }
    }

    // Объединяем все совпадения
    const allMatches = [
      ...fullMatches.map(m => ({ ...m, type: 'full' })),
      ...shortMatches.map(m => ({ ...m, type: 'short' }))
    ].sort((a, b) => a.index - b.index)

    // Строим результат
    allMatches.forEach(match => {
      // Добавляем текст до эмодзи
      if (match.index > lastIndex) {
        result.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        )
      }

      // Добавляем эмодзи
      let emojiId = match.id
      let emojiName = match.name

      if (match.type === 'short') {
        // Ищем в словаре кастомных Discord эмодзи
        const customEmoji = discordEmojisMap[emojiName.toLowerCase()]
        if (customEmoji) {
          emojiId = customEmoji.id
          emojiName = customEmoji.name
        } else {
          // Если не найдено, оставляем как текст
          result.push(
            <span key={`emoji-${match.index}`}>
              {text.substring(match.index, match.index + match.length)}
            </span>
          )
          lastIndex = match.index + match.length
          return
        }
      }

      // Определяем формат (PNG или GIF для анимированных)
      // Проверяем, был ли это анимированный эмодзи в исходном тексте
      const isAnimated = text.substring(match.index - 2, match.index) === '<a'
      const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? 'gif' : 'png'}`
      
      result.push(
        <img
          key={`emoji-${match.index}`}
          src={emojiUrl}
          alt={emojiName}
          className="discord-emoji"
          title={emojiName}
          onError={(e) => {
            // Если изображение не загрузилось, показываем текст
            e.target.style.display = 'none'
            const textNode = document.createTextNode(`:${emojiName}:`)
            e.target.parentNode.insertBefore(textNode, e.target)
          }}
        />
      )

      lastIndex = match.index + match.length
    })

    // Добавляем оставшийся текст
    if (lastIndex < text.length) {
      result.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex)}
        </span>
      )
    }

    return result.length > 0 ? result : text
  }

  // Закрытие панели эмодзи при клике вне её
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPanelRef.current && !emojiPanelRef.current.contains(event.target)) {
        // Проверяем, что клик не по кнопке эмодзи
        if (!event.target.closest('.chat-emoji-btn')) {
          setShowEmojiPanel(false)
        }
      }
    }

    if (showEmojiPanel) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPanel])

  return (
    <div className="guild-chat-aaa">
      <div className="chat-header-aaa">
        <div className="chat-header-content">
          <div className="chat-title-section">
            <div className="chat-icon-header">💬</div>
            <div>
              <div className="chat-title-aaa">Чат гильдии</div>
              <div className="chat-subtitle-aaa">Активных: {messages.filter(m => m.isOnline).length}</div>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="chat-action-btn chat-close-btn" onClick={onClose} title="Закрыть чат">
              ✕
            </button>
          </div>
        </div>
      </div>
      
      <div className="chat-messages-aaa">
        {messages.map((message, index) => {
          const isCurrentUser = message.author === currentPlayer.name
          // Упрощенная логика разделителя даты (всегда показываем для первого сообщения)
          const showDateSeparator = index === 0
          
          return (
            <div key={message.id}>
              {showDateSeparator && (
                <div className="chat-date-separator">
                  <span>{new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                </div>
              )}
              <div 
                className={`chat-message-aaa ${isCurrentUser ? 'own-message' : ''} ${message.isSystem ? 'system-message' : ''}`}
                onMouseEnter={() => !message.isSystem && setHoveredMessageId(message.id)}
                onMouseLeave={() => !message.isSystem && setHoveredMessageId(null)}
              >
                <div className="message-avatar-container">
                  {message.isSystem ? (
                    message.playerAvatar ? (
                      <img src={message.playerAvatar} alt={message.playerName} className="message-avatar-img" />
                    ) : (
                      <div className="message-avatar-placeholder">
                        👤
                      </div>
                    )
                  ) : (
                    <>
                      {message.authorAvatar && typeof message.authorAvatar === 'string' ? (
                        <img src={message.authorAvatar} alt={message.author} className="message-avatar-img" />
                      ) : (
                        <div className="message-avatar-placeholder">
                          👤
                        </div>
                      )}
                      {message.isOnline && <div className="message-online-indicator"></div>}
                    </>
                  )}
                </div>
                <div className="message-content-aaa">
                  {message.isSystem ? (
                    <div className="message-header-aaa">
                      <span 
                        className="message-author-aaa" 
                        style={{ color: getRoleColor('Система') }}
                      >
                        {message.playerName}
                      </span>
                      <span className="message-time-aaa">{message.time}</span>
                    </div>
                  ) : (
                    <div className="message-header-aaa">
                      <span 
                        className="message-author-aaa" 
                        style={{ color: getRoleColor(message.authorRole) }}
                      >
                        {message.author}
                      </span>
                      <span className="message-role-badge" style={{ 
                        backgroundColor: getRoleColor(message.authorRole) + '20',
                        borderColor: getRoleColor(message.authorRole) + '60',
                        color: getRoleColor(message.authorRole)
                      }}>
                        {message.authorRole}
                      </span>
                      <span className="message-time-aaa">{message.time}</span>
                      {hasDeletePermission && hoveredMessageId === message.id && (
                        <button
                          className="message-delete-btn"
                          onClick={() => handleDeleteMessage(message.id)}
                          title="Удалить сообщение"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}
                  <div className={`message-text-aaa ${message.isSystem ? 'system-message-text' : ''}`}>
                    {renderMessageText(message.text)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-form-aaa" onSubmit={handleSendMessage}>
        <div className="chat-input-container">
        <input
          type="text"
            className="chat-input-aaa"
            placeholder="Напишите сообщение..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
            maxLength={500}
        />
          <div className="chat-input-actions">
            <div className="emoji-picker-wrapper" ref={emojiPanelRef}>
              <button 
                type="button" 
                className={`chat-emoji-btn ${showEmojiPanel ? 'active' : ''}`}
                onClick={() => setShowEmojiPanel(!showEmojiPanel)}
                title="Эмодзи"
              >
                😊
              </button>
              {showEmojiPanel && (
                <div className="emoji-panel">
                  <div className="emoji-panel-header">
                    <span className="emoji-panel-title">Выберите эмодзи</span>
                    <button 
                      className="emoji-panel-close"
                      onClick={() => setShowEmojiPanel(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="emoji-panel-content">
                    {emojiCategories.map((category, catIndex) => (
                      <div key={catIndex} className="emoji-category">
                        <div className="emoji-category-title">{category.name}</div>
                        <div className="emoji-grid">
                          {category.emojis.map((emoji, emojiIndex) => {
                            if (typeof emoji === 'object' && emoji.type === 'discord') {
                              // Discord эмодзи
                              return (
                                <button
                                  key={emojiIndex}
                                  className="emoji-item discord-emoji-item"
                                  onClick={() => handleEmojiClick(emoji)}
                                  title={emoji.name}
                                >
                                  <img
                                    src={`https://cdn.discordapp.com/emojis/${emoji.id}.png`}
                                    alt={emoji.name}
                                    className="discord-emoji-preview"
                                    onError={(e) => {
                                      // Пробуем GIF, если PNG не загрузился
                                      if (!e.target.src.endsWith('.gif')) {
                                        e.target.src = `https://cdn.discordapp.com/emojis/${emoji.id}.gif`
                                      } else {
                                        e.target.style.display = 'none'
                                        e.target.parentElement.textContent = `:${emoji.name}:`
                                      }
                                    }}
                                  />
                                </button>
                              )
                            } else if (typeof emoji === 'object' && emoji.type === 'placeholder') {
                              // Плейсхолдер, если нет эмодзи
                              return (
                                <div
                                  key={emojiIndex}
                                  className="emoji-placeholder"
                                  title="Добавьте Discord эмодзи в config/discordEmojis.js"
                                >
                                  <span className="placeholder-text">+</span>
                                </div>
                              )
                            } else {
                              // Обычный Unicode эмодзи
                              return (
                                <button
                                  key={emojiIndex}
                                  className="emoji-item"
                                  onClick={() => handleEmojiClick(emoji)}
                                  title={emoji}
                                >
                                  {emoji}
                                </button>
                              )
                            }
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button type="submit" className="chat-send-button-aaa" disabled={!newMessage.trim()}>
              <span className="send-icon">➤</span>
        </button>
          </div>
        </div>
        <div className="chat-input-footer">
          <span className="char-count">{newMessage.length}/500</span>
        </div>
      </form>
    </div>
  )
}

export default GuildChat

