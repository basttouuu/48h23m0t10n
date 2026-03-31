import './GameOverScreen.css';
import { useEffect } from 'react';
import axios from 'axios';

/** Affiche l'écran de fin de jeu, avec le score et les indices pour passer à la suite. */
export default function GameOverScreen({ score, won, onRestart, playerName }) {
  useEffect(() => {
    if (won) {
      localStorage.setItem('part1_completed', 'true');
    }
    
    if (playerName) {
      axios
        .post('https://48h-plateforme.vercel.app/api/save-score', { playerName, score })
        .catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`screen end-screen ${won ? 'end-win' : 'end-lose'}`}>
      <div className="end-glow" />
      <div className="end-content">
        {won ? (
          <>
            <div className="end-emoji">🏆</div>
            <h1 className="end-title win-title">VICTOIRE !</h1>
            <p className="end-subtitle">Mario a passé toutes les portes !</p>
          </>
        ) : (
          <>
            <div className="end-emoji boss-caught">💀</div>
            <h1 className="end-title lose-title">GAME OVER</h1>
            <p className="end-subtitle">Le Boss a rattrapé Mario...</p>
          </>
        )}
        <div className="final-score-box">
          <div className="final-score-label">SCORE FINAL</div>
          <div className="final-score-value">{score}</div>
          <div className="final-score-stars">
            {score >= 800 ? '⭐⭐⭐' : score >= 400 ? '⭐⭐' : '⭐'}
          </div>
          {playerName && <p className="score-user">Bravo {playerName} !</p>}
        </div>
        <button className="cta-btn" onClick={onRestart}>🔄 REJOUER</button>
      </div>
      
      <div className="secret-hint">
        Indice : Il faut aller sur le site "Koopa Corp" pour accéder au réseau secret de la partie 2...
      </div>
    </div>
  );
}
