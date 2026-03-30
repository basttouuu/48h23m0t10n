import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import marioImg from './assets/mario.jpg';
import villainGif from './assets/villain.gif';
import doorImg from './assets/door.png';
import './App.css';

// ⚠️ Remplace par ton Client ID Google OAuth
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

const TOTAL_LIVES = 3;
const QUESTION_TIME = 30; // secondes par question
const VILLAIN_WRONG_ADVANCE = 10;   // % d'avance si mauvaise réponse
const VILLAIN_SOLUTION_ADVANCE = 18; // % d'avance si solution utilisée
const MARIO_START = 8;
const VILLAIN_START = -18;
const MARIO_STEP = 70 / 5; // sera recalculé selon nombre de questions

/* ─────────────────────────────────────────────
   COMPOSANT: Barre de timer
───────────────────────────────────────────── */
function TimerBar({ timeLeft, total }) {
  const pct = (timeLeft / total) * 100;
  const color = timeLeft <= 8 ? 'var(--neon-red)' : timeLeft <= 15 ? 'var(--neon-yellow)' : 'var(--neon-green)';
  return (
    <div className="timer-wrap">
      <div className="timer-icon" style={{ color }}>⏱</div>
      <div className="timer-track">
        <div
          className="timer-fill"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
      <div className="timer-count" style={{ color }}>{timeLeft}s</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ÉCRAN D'ACCUEIL
───────────────────────────────────────────── */
function StartScreen({ onStart, user, onLogin, onLogout }) {
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

        {/* Auth Google */}
        <div className="auth-section">
          {user ? (
            <div className="user-badge">
              {user.picture && <img src={user.picture} alt="avatar" className="user-avatar" />}
              <div className="user-info">
                <span className="user-name">👋 {user.name}</span>
                <button className="logout-btn" onClick={onLogout}>Déconnexion</button>
              </div>
            </div>
          ) : (
            <div className="google-login-wrap">
              <p className="login-hint">Connecte-toi pour sauvegarder ton score !</p>
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={onLogin}
                  onError={() => console.log('Échec de la connexion Google')}
                  useOneTap
                  theme="filled_black"
                  shape="rectangular"
                  size="large"
                  text="signin_with"
                  locale="fr"
                />
              </GoogleOAuthProvider>
            </div>
          )}
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

/* ─────────────────────────────────────────────
   ÉCRAN DE FIN
───────────────────────────────────────────── */
function GameOverScreen({ score, won, onRestart, user }) {
  useEffect(() => {
    // Sauvegarde automatique du score si connecté avec Google
    if (user?.googleId) {
      axios.post('http://localhost:3001/api/save-score', {
        googleId: user.googleId,
        score,
      }).catch(() => { /* silencieux si backend indisponible */ });
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
          {user && <p className="score-user">Joué en tant que {user.name}</p>}
        </div>
        <button className="cta-btn" onClick={onRestart}>🔄 REJOUER</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ÉCRAN DE JEU (PRINCIPAL)
───────────────────────────────────────────── */
function GameScreen({ questions, user }) {
  const totalQ = questions.length;
  const marioStep = 75 / totalQ;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [marioPos, setMarioPos] = useState(MARIO_START);
  const [villainPos, setVillainPos] = useState(VILLAIN_START);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [timerActive, setTimerActive] = useState(true);

  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | 'timeout'
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [villainShake, setVillainShake] = useState(false);
  const [marioShake, setMarioShake] = useState(false);
  const [gameState, setGameState] = useState('PLAYING');
  const [isDying, setIsDying] = useState(false);
  const [isDamage, setIsDamage] = useState(false);

  const feedbackRef = useRef(null);
  const timerRef = useRef(null);

  const q = questions[currentIndex];

  /* ── Vérif fin de partie ── */
  const checkDeath = useCallback((newVillain, newMario, newLives) => {
    if (newVillain >= newMario - 5 || newLives <= 0) {
      setIsDying(true);
      setTimerActive(false);
      // Attend que l'animation de mort se joue avant d'afficher Game Over
      setTimeout(() => setGameState('LOSE'), 1500);
      return true;
    }
    return false;
  }, []);

  /* ── Timer ── */
  useEffect(() => {
    if (!timerActive || feedback || showSolution || isDying) return;
    if (timeLeft <= 0) {
      // Time's up → mauvaise réponse automatique
      handleTimeout();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, timerActive, feedback, showSolution]);

  /* ── Passage à la question suivante ── */
  const goNext = useCallback(() => {
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
    setTimeLeft(QUESTION_TIME);
    setTimerActive(true);
    if (currentIndex < totalQ - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setGameState('WIN');
    }
  }, [currentIndex, totalQ]);

  /* ── Bonne réponse ── */
  const handleCorrect = useCallback(() => {
    setTimerActive(false);
    const bonus = Math.floor(timeLeft * 3);
    setScore(s => s + 100 + bonus);
    setFeedback('correct');
    setDoorOpen(true);
    setMarioPos(p => p + marioStep);

    clearTimeout(feedbackRef.current);
    feedbackRef.current = setTimeout(() => {
      setDoorOpen(false);
      goNext();
    }, 1600);
  }, [timeLeft, marioStep, goNext]);

  /* ── Mauvaise réponse ── */
  const handleWrong = useCallback((reason = 'wrong') => {
    setTimerActive(false);
    setFeedback(reason);
    setMarioShake(true);
    setVillainShake(true);
    setIsDamage(true);

    setVillainPos(prev => {
      const next = prev + VILLAIN_WRONG_ADVANCE;
      setMarioPos(mario => {
        const newLives = lives - 1;
        setLives(newLives);
        if (!checkDeath(next, mario, newLives)) {
          // Reprend le timer après la pénalité
          setTimeout(() => {
            setFeedback(null);
            setMarioShake(false);
            setVillainShake(false);
            setIsDamage(false);
            setTimerActive(true);
          }, 1200);
        }
        return mario;
      });
      return next;
    });
  }, [lives, checkDeath]);

  /* ── Timeout ── */
  const handleTimeout = useCallback(() => {
    handleWrong('timeout');
  }, [handleWrong]);

  /* ── Click sur une option ── */
  const handleAnswer = (opt) => {
    if (feedback || showSolution) return;
    if (opt === q.solution) {
      handleCorrect();
    } else {
      handleWrong('wrong');
    }
  };

  /* ── Indice ── */
  const handleHint = () => {
    if (showHint || lives <= 0 || feedback) return;
    setTimerActive(false);
    setShowHint(true);
    const newLives = lives - 1;
    setLives(newLives);
    if (newLives <= 0) setGameState('LOSE');
    // Pause le timer pendant 5 secondes puis reprend
    setTimeout(() => setTimerActive(true), 100);
  };

  /* ── Voir la solution ── */
  const handleSolution = () => {
    if (showSolution || feedback) return;
    setTimerActive(false);
    setShowSolution(true);
    const newLives = lives - 1;
    setLives(newLives);
    setVillainPos(prev => {
      const next = prev + VILLAIN_SOLUTION_ADVANCE;
      setMarioPos(mario => {
        checkDeath(next, mario, newLives);
        return mario;
      });
      return next;
    });
  };

  if (gameState === 'WIN') return <GameOverScreen score={score} won={true} onRestart={() => window.location.reload()} user={user} />;
  if (gameState === 'LOSE') return <GameOverScreen score={score} won={false} onRestart={() => window.location.reload()} user={user} />;

  const options = [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean);

  return (
    <div className={`game-wrapper ${isDamage ? 'damage-shake damage-flash' : ''} ${isDying ? 'death-fade' : ''}`}>
      {/* ── HUD ── */}
      <div className="hud">
        <div className="hud-left">
          <div className="hud-score">
            <span className="hud-label">SCORE</span>
            <span className="hud-value">{score}</span>
          </div>
          <div className="hud-world">
            <span className="hud-label">NIVEAU</span>
            <span className="hud-value">{currentIndex + 1}/{totalQ}</span>
          </div>
        </div>
        <div className="hud-center">
          <div className="hud-title">MARIO QUIZ</div>
        </div>
        <div className="hud-right">
          <div className="hud-lives">
            {Array.from({ length: TOTAL_LIVES }).map((_, i) => (
              <span key={i} className={`heart-icon ${i < lives ? 'heart-filled' : 'heart-empty'} ${isDamage && i === lives ? 'heart-break' : ''}`}>
                {i < lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          {user && <span className="hud-user">👤 {user.name.split(' ')[0]}</span>}
        </div>
      </div>

      {/* ── TIMER ── */}
      <TimerBar timeLeft={timeLeft} total={QUESTION_TIME} />

      {/* ── PISTE DE COURSE ── */}
      <div className={`track-area ${isDying ? 'track-dim' : ''}`}>
        <div className="track-sky" />
        <div className="track-mountains" />
        <div className="track-ground" />

        {/* Villain (Goomba) */}
        <div
          className={`villain-container ${villainShake ? 'villain-shake' : ''} ${isDying ? 'villain-laugh' : ''}`}
          style={{ left: `${villainPos}%`, zIndex: isDying ? 10 : 3 }}
        >
          <div className="villain-label">⚡ BOSS</div>
          <img src={villainGif} alt="Boss" className="villain-sprite" />
        </div>

        {/* Mario */}
        <div
          className={`mario-container ${marioShake ? 'mario-shake' : ''} ${isDying ? 'mario-death' : ''}`}
          style={{ left: `${marioPos}%`, zIndex: isDying ? 11 : 3 }}
        >
          <div className="mario-label">🌟 MARIO</div>
          <img
            src={marioImg}
            alt="Mario"
            className={`mario-sprite ${feedback === 'correct' ? 'mario-jump' : isDying ? 'mario-dead-sprite' : 'mario-run'} ${isDamage ? 'mario-blink' : ''}`}
          />
        </div>

        {/* Porte */}
        <div className={`door-container ${doorOpen ? 'door-open' : ''}`}>
          <img src={doorImg} alt="Porte" className="door-sprite" />
          {doorOpen && <div className="door-glow-effect" />}
        </div>
      </div>

      {/* ── CARTE QUESTION ── */}
      <div className={`quiz-card ${feedback === 'correct' ? 'card-correct' : ''} ${(feedback === 'wrong' || feedback === 'timeout') ? 'card-wrong' : ''}`}>
        <div className="question-header">
          <div className="question-badge">Q{currentIndex + 1}</div>
          <div className="question-category">QUIZ</div>
          {showHint && <div className="hint-active-badge">💡 Indice actif</div>}
        </div>

        <div className="question-text">{q.content}</div>

        <div className="options-grid">
          {options.map((opt, i) => {
            const letters = ['A', 'B', 'C', 'D'];
            let cls = '';
            if (showSolution && opt === q.solution) cls = 'opt-solution';
            else if (showSolution) cls = 'opt-faded';
            else if ((feedback === 'correct') && opt === q.solution) cls = 'opt-correct';

            return (
              <button
                key={i}
                className={`opt-btn ${cls}`}
                onClick={() => handleAnswer(opt)}
                disabled={!!feedback || showSolution}
              >
                <span className="opt-letter">{letters[i]}</span>
                <span className="opt-text">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Indice box */}
        {showHint && !showSolution && (
          <div className="hint-box">
            <div className="hint-label">💡 INDICE</div>
            <div className="hint-text">{q.hint || "Réfléchis bien à la logique de la question..."}</div>
          </div>
        )}

        {/* Solution box */}
        {showSolution && (
          <div className="solution-box">
            <div className="solution-label">✅ SOLUTION</div>
            <div className="solution-text">{q.solution}</div>
            {q.explanation && <div className="solution-explanation">{q.explanation}</div>}
            <button className="cta-btn cta-small" onClick={goNext}>
              Question suivante →
            </button>
          </div>
        )}

        {/* Boutons d'action */}
        {!showSolution && (
          <div className="action-row">
            <button
              className={`action-btn hint-btn ${showHint ? 'action-used' : ''}`}
              onClick={handleHint}
              disabled={showHint || lives <= 0 || !!feedback}
            >
              💡 Indice {!showHint && <span className="cost-badge">-1 ❤️</span>}
            </button>
            <button
              className="action-btn solution-btn"
              onClick={handleSolution}
              disabled={!!feedback || showSolution}
            >
              👁️ Solution <span className="cost-badge danger">⚡ Boss avance</span>
            </button>
          </div>
        )}
      </div>

      {/* ── FEEDBACK POPUP ── */}
      {feedback === 'correct' && (
        <div className="feedback-popup feedback-correct">
          <span>🎉 EXCELLENT !</span>
          <span className="feedback-points">+{100 + Math.floor(timeLeft * 3)} pts</span>
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="feedback-popup feedback-wrong">
          <span>❌ RATÉ !</span>
          <span className="feedback-sub">Le Boss se rapproche !</span>
        </div>
      )}
      {feedback === 'timeout' && (
        <div className="feedback-popup feedback-timeout">
          <span>⏱ TEMPS ÉCOULÉ !</span>
          <span className="feedback-sub">Le Boss avance !</span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   APP PRINCIPALE
───────────────────────────────────────────── */
function App() {
  const [gameState, setGameState] = useState('START');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/questions')
      .then(res => { setQuestions(res.data); setLoading(false); })
      .catch(() => {
        setQuestions([
          { id:1, content:'Quelle est la capitale de la France ?', option_a:'Berlin', option_b:'Madrid', option_c:'Paris', option_d:'Rome', solution:'Paris', hint:'C\'est la ville de la Tour Eiffel.', explanation:'Paris est la capitale et plus grande ville de France.' },
          { id:2, content:'Combien font 2 + 2 × 2 ?', option_a:'8', option_b:'6', option_c:'4', option_d:'16', solution:'6', hint:'Priorité : multiplication avant addition.', explanation:'2 + (2×2) = 2 + 4 = 6' },
          { id:3, content:'Quel langage stylise les pages web ?', option_a:'HTML', option_b:'Python', option_c:'CSS', option_d:'Java', solution:'CSS', hint:'Il gère couleurs, mise en page et polices.', explanation:'CSS = Cascading Style Sheets.' },
          { id:4, content:'Qui a peint la Joconde ?', option_a:'Van Gogh', option_b:'Picasso', option_c:'Michel-Ange', option_d:'Léonard de Vinci', solution:'Léonard de Vinci', hint:'Génie de la Renaissance, aussi inventeur.', explanation:'Léonard de Vinci l\'a peinte au début du XVIe siècle.' },
          { id:5, content:'Quelle planète est la plus proche du soleil ?', option_a:'Venus', option_b:'Terre', option_c:'Mars', option_d:'Mercure', solution:'Mercure', hint:'Pas la plus chaude, mais bien la plus proche.', explanation:'Mercure est la 1ère planète du système solaire.' },
        ]);
        setLoading(false);
      });
  }, []);

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // Décoder le JWT Google (payload base64)
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      setUser({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      });
      
      // Envoyer au backend
      await axios.post('http://localhost:3001/api/auth/google', {
        credential: credentialResponse.credential
      }).catch(() => { /* backend optionnel */ });
    } catch (e) {
      console.error('Erreur décodage token Google', e);
    }
  };

  if (loading) {
    return (
      <div className="screen loading-screen">
        <div className="loading-spinner" />
        <div className="loading-text">Chargement...</div>
      </div>
    );
  }

  if (gameState === 'START') {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <StartScreen
          onStart={() => setGameState('PLAYING')}
          user={user}
          onLogin={handleGoogleLogin}
          onLogout={() => setUser(null)}
        />
      </GoogleOAuthProvider>
    );
  }

  if (gameState === 'PLAYING') return <GameScreen questions={questions} user={user} />;
  return null;
}

export default App;