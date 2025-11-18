import { useState, useMemo } from 'react'
import TopNav from './components/TopNav'
import GuildPanel from './components/GuildPanel'
import PlayersTable from './components/PlayersTable'
import TalentsTab from './components/TalentsTab'
import SpeedrunTab from './components/SpeedrunTab'
import QuestsTab from './components/QuestsTab'
import ShopTab from './components/ShopTab'
import GuildChat from './components/GuildChat'
import { generatePlayers, guildConfig } from './utils/generatePlayers'
import { getMeritsImage } from './utils/imageUtils'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('main')
  const [chatVisible, setChatVisible] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(3) // Количество непрочитанных сообщений
  const [currentPlayerRole, setCurrentPlayerRole] = useState(guildConfig.myRole)
  const [guildCrystals, setGuildCrystals] = useState(guildConfig.guild.crystals || 0)
  const [playerCrystals, setPlayerCrystals] = useState(50) // Кристаллы игрока
  const [showBestPlace, setShowBestPlace] = useState(guildConfig.speedrun?.showBestPlace ?? true)
  
  // Генерируем игроков согласно конфигурации гильдии
  const players = useMemo(() => generatePlayers(), [])
  const totalMembers = guildConfig.totalMembers // Общее количество участников в гильдии
  const displayedMembers = players.length // Количество отображаемых участников

  const toggleChat = () => {
    setChatVisible(!chatVisible)
    if (!chatVisible) {
      // При открытии чата сбрасываем счетчик непрочитанных
      setUnreadMessages(0)
    }
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <TopNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          chatVisible={chatVisible}
          onToggleChat={toggleChat}
          unreadMessages={unreadMessages}
          onRoleChange={(newRole) => {
            setCurrentPlayerRole(newRole)
            guildConfig.myRole = newRole
          }}
          onCrystalsChange={(newCrystals) => {
            setGuildCrystals(newCrystals)
            guildConfig.guild.crystals = newCrystals
          }}
          guildCrystals={guildCrystals}
          onSpeedrunActiveChange={(speedrunConfig) => {
            // Обновляем конфигурацию спидрана
            guildConfig.speedrun = speedrunConfig
          }}
          onShowBestPlaceChange={(show) => {
            setShowBestPlace(show)
            guildConfig.speedrun = guildConfig.speedrun || {}
            guildConfig.speedrun.showBestPlace = show
          }}
        />
        {activeTab === 'main' ? (
          <div className="main-content">
            <div className="left-panel">
              <GuildPanel 
                guildName={guildConfig.guild.name} 
                guildLevel={guildConfig.guild.level} 
                displayedCount={displayedMembers}
                totalCount={totalMembers}
                pendingRequests={5}
                players={players}
                currentExp={guildConfig.guild.currentExp}
                expToNextLevel={guildConfig.guild.expToNextLevel}
                guildPoints={guildConfig.guild.points}
                guildDescription={guildConfig.guild.description}
                playerCrystals={playerCrystals}
                onPlayerCrystalsChange={setPlayerCrystals}
              />
              {(() => {
                const myPlayer = players.find(p => p.name === guildConfig.myName) || players[0]
                if (!myPlayer) return null
                
                const playerAvatar = typeof myPlayer.avatar === 'string' 
                  ? (myPlayer.avatar.startsWith('/') || myPlayer.avatar.startsWith('http') 
                      ? myPlayer.avatar 
                      : null)
                  : myPlayer.avatar
                
                return (
                  <div className="player-info">
                    <div className="player-avatar-small">
                      {playerAvatar ? (
                        <img src={playerAvatar} alt={myPlayer.name} className="player-avatar-image-small" />
                      ) : (
                        <div className="player-avatar-placeholder">{typeof myPlayer.avatar === 'string' ? myPlayer.avatar : '?'}</div>
                      )}
                    </div>
                    <div className="player-details">
                      <div className="player-name-small">{myPlayer.name}</div>
                      <div className={`player-role-small role-${currentPlayerRole.toLowerCase()}`}>
                        {currentPlayerRole}
                      </div>
                      <div className="player-merits-small">
                        <img src={getMeritsImage()} alt="Заслуги" className="player-merits-icon-small" />
                        <span className="player-merits-value">{myPlayer.points.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
            <div className="right-panel">
              <PlayersTable 
                players={players}
                displayedCount={displayedMembers}
                totalCount={totalMembers}
                currentPlayerRole={currentPlayerRole}
              />
            </div>
          </div>
        ) : activeTab === 'talents' ? (
          <TalentsTab />
        ) : activeTab === 'speedrun' ? (
          <SpeedrunTab showBestPlace={showBestPlace} />
        ) : activeTab === 'quests' ? (
          <QuestsTab />
        ) : activeTab === 'shop' ? (
          <ShopTab guildCrystals={guildCrystals} onCrystalsChange={setGuildCrystals} />
        ) : null}
      </div>
      
      {/* Чат */}
      <div className="chat-section">
        {chatVisible && <GuildChat onClose={toggleChat} />}
      </div>
    </div>
  )
}

export default App
