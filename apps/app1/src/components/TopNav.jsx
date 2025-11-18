import DevSettingsPanel from './DevSettingsPanel'
import './TopNav.css'

function TopNav({ activeTab, onTabChange, chatVisible, onToggleChat, unreadMessages, onRoleChange, onCrystalsChange, guildCrystals, onSpeedrunActiveChange, onShowBestPlaceChange }) {
  const tabs = [
    { id: 'main', label: 'Main', icon: '🏠' },
    { id: 'talents', label: 'Таланты', icon: '⭐' },
    { id: 'speedrun', label: 'Спидран', icon: '⚡' },
    { id: 'quests', label: 'Задания', icon: '📋' },
    { id: 'shop', label: 'Магазин', icon: '🏪' }
  ]

  return (
    <div className="top-nav">
      <div className="nav-tabs">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="nav-tab-icon">{tab.icon}</span>
            <span className="nav-tab-label">{tab.label}</span>
            <span className="nav-tab-indicator"></span>
          </button>
        ))}
      </div>
      <div className="top-nav-right">
          <DevSettingsPanel 
            onRoleChange={onRoleChange}
            onCrystalsChange={onCrystalsChange}
            guildCrystals={guildCrystals}
            onSpeedrunActiveChange={onSpeedrunActiveChange}
            onShowBestPlaceChange={onShowBestPlaceChange}
          />
        {!chatVisible && (
          <button 
            className="chat-toggle-button-nav" 
            onClick={onToggleChat}
            title="Открыть чат гильдии"
          >
            <span className="chat-icon-nav">💬</span>
            {unreadMessages > 0 && (
              <span className="chat-badge-nav">{unreadMessages}</span>
        )}
      </button>
        )}
      </div>
    </div>
  )
}

export default TopNav

