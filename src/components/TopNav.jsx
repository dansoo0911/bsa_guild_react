import DevSettingsPanel from './DevSettingsPanel'
import './TopNav.css'

function TopNav({ activeTab, onTabChange, chatVisible, onToggleChat, unreadMessages, onRoleChange, onCrystalsChange, guildCrystals, onSpeedrunActiveChange, onShowBestPlaceChange }) {
  return (
    <div className="top-nav">
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'main' ? 'active' : ''}`}
          onClick={() => onTabChange('main')}
        >
          Main
        </button>
        <button 
          className={`nav-tab ${activeTab === 'talents' ? 'active' : ''}`}
          onClick={() => onTabChange('talents')}
        >
          Таланты
        </button>
        <button 
          className={`nav-tab ${activeTab === 'speedrun' ? 'active' : ''}`}
          onClick={() => onTabChange('speedrun')}
        >
          Спидран
        </button>
        <button 
          className={`nav-tab ${activeTab === 'quests' ? 'active' : ''}`}
          onClick={() => onTabChange('quests')}
        >
          Задания
        </button>
        <button 
          className={`nav-tab ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => onTabChange('shop')}
        >
          Магазин
        </button>
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

