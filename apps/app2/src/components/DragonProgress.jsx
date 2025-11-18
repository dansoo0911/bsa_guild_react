import './DragonProgress.css'

function DragonProgress({ mainPrizeProgress, artifactProgress }) {
  const isNearMainPrize = mainPrizeProgress >= 90
  const isNearArtifact = artifactProgress >= 90
  
  return (
    <div className="dragon-progress">
      <div className={`dragon-container ${isNearMainPrize || isNearArtifact ? 'excited' : ''}`}>
        <div className="dragon-head">
          <div className="dragon-scales"></div>
          <div className="dragon-eyes">
            <div className="dragon-eye left"></div>
            <div className="dragon-eye right"></div>
          </div>
          <div className="dragon-horns">
            <div className="horn left-horn"></div>
            <div className="horn right-horn"></div>
          </div>
          <div className="dragon-mane"></div>
          <div className="dragon-flames">
            <div className="flame flame-1"></div>
            <div className="flame flame-2"></div>
            <div className="flame flame-3"></div>
          </div>
        </div>
      </div>

      <div className="progress-bars">
        <div className="progress-item">
          <div className="progress-label">до выпадения главного приза</div>
          <div className="progress-bar-container main-prize">
            <div 
              className="progress-bar-fill"
              style={{ width: `${mainPrizeProgress}%` }}
            >
              <div className="progress-value">{Math.round(mainPrizeProgress)}%</div>
              <div className="progress-flames"></div>
            </div>
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-label">до выпадения артефакта</div>
          <div className="progress-bar-container artifact">
            <div 
              className="progress-bar-fill"
              style={{ width: `${artifactProgress}%` }}
            >
              <div className="progress-value">{Math.round(artifactProgress)}%</div>
              <div className="progress-shield-icon">🛡️</div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-icon">
        <span>i</span>
      </div>
    </div>
  )
}

export default DragonProgress

