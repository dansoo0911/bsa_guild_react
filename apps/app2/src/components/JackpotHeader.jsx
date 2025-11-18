import './JackpotHeader.css'
import currencyRuby from '../assets/images/currency_ruby.png'

function JackpotHeader({ jackpot }) {
  return (
    <div className="jackpot-header">
      <h1 className="jackpot-title">DRAGON JACKPOT</h1>
      <div className="jackpot-amount">
        <img src={currencyRuby} alt="Рубины" className="diamond-icon" />
        <span className="jackpot-value">{jackpot.toLocaleString()}</span>
      </div>
      <p className="jackpot-description">5% от каждой ставки идёт в банк</p>
    </div>
  )
}

export default JackpotHeader

