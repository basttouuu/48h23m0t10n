import './StartScreen.css';
import marioImg from '../assets/mario.jpg';
import villainGif from '../assets/villain.gif';
import { QUESTION_TIME } from '../constants/game';

export default function StartScreen({ onStart, playerName, setPlayerName }) {
  return (
    <div className="screen start-screen">
      <div className="start-glow-ring" />
      <div className="start-content">
        <div className="start-logo">
          <span className="logo-mario">MARIO</span>
          <span className="logo-quiz">QUIZ</span>
          <span className="logo-adventure">ADVENTURE</span>
        </div>
        <p className="start-subtitle">Réponds avant que le BOSS ne rattrape Mario !</p>

        <div className="auth-section">
          <div className="pseudo-input-wrap">
            <label htmlFor="pseudo">TON PSEUDO POUR LE CLASSEMENT :</label>
            <input
              type="text"
              id="pseudo"
              placeholder="Ex: MarioMaster99"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="pseudo-input"
            />
          </div>
        </div>

        <div className="start-characters">
          <div className="char-wrap">
            <img src={marioImg} alt="Mario" className="start-mario" />
            <span className="char-label mario-char">MARIO</span>
          </div>
          <div className="start-vs">VS</div>
          <div className="char-wrap">
            <img src={villainGif} alt="Goomba Boss" className="start-villain" />
            <span className="char-label boss-char">BOSS</span>
          </div>
        </div>

        <button className="cta-btn" onClick={onStart}>
          <span className="cta-icon">▶</span>
          LANCER LA PARTIE
        </button>

        <div className="start-rules">
          <div className="rule-item">⏱ {QUESTION_TIME}s par question</div>
          <div className="rule-item">❌ Erreur = Boss avance</div>
          <div className="rule-item">💡 Indice = -1 ❤️</div>
          <div className="rule-item">🏁 Bonne réponse = porte ouverte</div>
        </div>
      </div>
    </div>
  );
}
