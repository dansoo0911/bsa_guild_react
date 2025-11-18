import { useState } from 'react'
import './GameStats.css'

function GameStats({ totalGames, totalWins, biggestWin, gameHistory }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0

  return (
    <>
      <button className="stats-toggle" onClick={() => setIsOpen(!isOpen)}>
        📊 Статистика
      </button>
      
      {isOpen && (
        <div className="stats-modal">
          <div className="stats-content">
            <button className="stats-close" onClick={() => setIsOpen(false)}>×</button>
            <h2>Статистика игр</h2>
            
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">Всего игр</div>
                <div className="stat-value">{totalGames}</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-label">Побед</div>
                <div className="stat-value">{totalWins}</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-label">Процент побед</div>
                <div className="stat-value">{winRate}%</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-label">Лучший выигрыш</div>
                <div className="stat-value highlight">{biggestWin.toLocaleString()}</div>
              </div>
            </div>

            {gameHistory.length > 0 && (
              <div className="history-section">
                <h3>История игр</h3>
                <div className="history-list">
                  {gameHistory.map(game => (
                    <div key={game.id} className="history-item">
                      <div className="history-symbols">
                        {game.symbols.map((symbol, idx) => (
                          <span key={idx} className="history-symbol">
                            {symbol === 'diamond' ? '💎' : symbol === 'scroll' ? '📜' : '🛡️'}
                          </span>
                        ))}
                      </div>
                      <div className={`history-win ${game.win > 0 ? 'win' : 'loss'}`}>
                        {game.win > 0 ? `+${game.win.toLocaleString()}` : '0'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default GameStats

