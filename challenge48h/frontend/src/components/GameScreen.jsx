import './GameScreen.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import marioImg from '../assets/mario.png';
import villainImg from '../assets/villain_boss.png';
import doorImg from '../assets/door.png';
import TimerBar from './TimerBar';
import GameOverScreen from './GameOverScreen';
import {
  TOTAL_LIVES,
  QUESTION_TIME,
  VILLAIN_WRONG_ADVANCE,
  VILLAIN_SOLUTION_ADVANCE,
  MARIO_START,
  VILLAIN_START,
} from '../constants/game';

export default function GameScreen({ questions, playerName, onBack }) {
  const totalQ = questions.length;
  const marioStep = 75 / totalQ;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(TOTAL_LIVES);
  const [marioPos, setMarioPos] = useState(MARIO_START);
  const [villainPos, setVillainPos] = useState(VILLAIN_START);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [timerActive, setTimerActive] = useState(true);

  const [feedback, setFeedback] = useState(null);
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

  const checkDeath = useCallback((newVillain, newMario, newLives) => {
    if (newVillain >= newMario - 5 || newLives <= 0) {
      setIsDying(true);
      setTimerActive(false);
      setTimeout(() => setGameState('LOSE'), 1500);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!timerActive || feedback || showSolution || isDying) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, timerActive, feedback, showSolution]); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = useCallback(() => {
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
    setTimeLeft(QUESTION_TIME);
    setTimerActive(true);
    if (currentIndex < totalQ - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setGameState('WIN');
    }
  }, [currentIndex, totalQ]);

  const handleCorrect = useCallback(() => {
    setTimerActive(false);
    const bonus = Math.floor(timeLeft * 3);
    setScore((s) => s + 100 + bonus);
    setFeedback('correct');
    setDoorOpen(true);
    setMarioPos((p) => p + marioStep);

    clearTimeout(feedbackRef.current);
    feedbackRef.current = setTimeout(() => {
      setDoorOpen(false);
      goNext();
    }, 1600);
  }, [timeLeft, marioStep, goNext]);

  const handleWrong = useCallback(
    (reason = 'wrong') => {
      setTimerActive(false);
      setFeedback(reason);
      setMarioShake(true);
      setVillainShake(true);
      setIsDamage(true);

      setVillainPos((prev) => {
        const next = prev + VILLAIN_WRONG_ADVANCE;
        setMarioPos((mario) => {
          const newLives = lives - 1;
          setLives(newLives);
          if (!checkDeath(next, mario, newLives)) {
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
    },
    [lives, checkDeath]
  );

  const handleTimeout = useCallback(() => {
    handleWrong('timeout');
  }, [handleWrong]);

  const handleAnswer = (opt) => {
    if (feedback || showSolution) return;
    if (opt === q.solution) handleCorrect();
    else handleWrong('wrong');
  };

  const handleHint = () => {
    if (showHint || lives <= 0 || feedback) return;
    setTimerActive(false);
    setShowHint(true);
    const newLives = lives - 1;
    setLives(newLives);
    if (newLives <= 0) setGameState('LOSE');
    setTimeout(() => setTimerActive(true), 100);
  };

  const handleSolution = () => {
    if (showSolution || feedback) return;
    setTimerActive(false);
    setShowSolution(true);
    const newLives = lives - 1;
    setLives(newLives);
    setVillainPos((prev) => {
      const next = prev + VILLAIN_SOLUTION_ADVANCE;
      setMarioPos((mario) => {
        checkDeath(next, mario, newLives);
        return mario;
      });
      return next;
    });
  };

  if (gameState === 'WIN')
    return <GameOverScreen score={score} won={true} onRestart={() => window.location.reload()} playerName={playerName} />;
  if (gameState === 'LOSE')
    return <GameOverScreen score={score} won={false} onRestart={() => window.location.reload()} playerName={playerName} />;

  const options = [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean);
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className={`game-wrapper ${isDamage ? 'damage-shake damage-flash' : ''} ${isDying ? 'death-fade' : ''}`}>
      <button className="back-nav-btn" onClick={onBack}>
        &lt; Retour Navigateur
      </button>

      {/* HUD */}
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
              <span
                key={i}
                className={`heart-icon ${i < lives ? 'heart-filled' : 'heart-empty'} ${isDamage && i === lives ? 'heart-break' : ''}`}
              >
                {i < lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          {playerName && <span className="hud-user">👤 {playerName}</span>}
        </div>
      </div>

      <TimerBar timeLeft={timeLeft} total={QUESTION_TIME} />

      {/* Track */}
      <div className={`track-area ${isDying ? 'track-dim' : ''}`}>
        <div className="track-sky" />
        <div className="track-mountains" />
        <div className="track-ground" />

        <div
          className={`villain-container ${villainShake ? 'villain-shake' : ''} ${isDying ? 'villain-laugh' : ''}`}
          style={{ left: `${villainPos}%`, zIndex: isDying ? 10 : 3 }}
        >
          <div className="villain-label">⚡ BOSS</div>
          <img src={villainImg} alt="Boss" className="villain-sprite" />
        </div>

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

        <div className={`door-container ${doorOpen ? 'door-open' : ''}`}>
          <img src={doorImg} alt="Porte" className="door-sprite" />
          {doorOpen && <div className="door-glow-effect" />}
        </div>
      </div>

      {/* Quiz card */}
      <div className={`quiz-card ${feedback === 'correct' ? 'card-correct' : ''} ${(feedback === 'wrong' || feedback === 'timeout') ? 'card-wrong' : ''}`}>
        <div className="question-header">
          <div className="question-badge">Q{currentIndex + 1}</div>
          <div className="question-category">QUIZ</div>
          {showHint && <div className="hint-active-badge">💡 Indice actif</div>}
        </div>

        <div className="question-text">{q.content}</div>

        <div className="options-grid">
          {options.map((opt, i) => {
            let cls = '';
            if (showSolution && opt === q.solution) cls = 'opt-solution';
            else if (showSolution) cls = 'opt-faded';
            else if (feedback === 'correct' && opt === q.solution) cls = 'opt-correct';

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

        {showHint && !showSolution && (
          <div className="hint-box">
            <div className="hint-label">💡 INDICE</div>
            <div className="hint-text">{q.hint || 'Réfléchis bien à la logique de la question...'}</div>
          </div>
        )}

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

      {/* Feedback popups */}
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
