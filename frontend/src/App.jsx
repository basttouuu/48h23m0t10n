import { useState, useEffect } from 'react';
import axios from 'axios';
import marioImg from './assets/mario.jpg';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('START'); 
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' ou 'wrong'

  useEffect(() => {
    axios.get('http://localhost:3001/api/questions')
      .then(res => setQuestions(res.data))
      .catch(err => console.error("Le backend est-il lancé sur le port 3001 ?", err));
  }, []);

  const handleAnswer = (option) => {
    if (feedback) return; // Empêche de cliquer plusieurs fois

    const isCorrect = option === questions[currentIndex].solution;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      if (isCorrect) setScore(s => s + 100);
      
      setFeedback(null);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameState('GAMEOVER');
      }
    }, 1200);
  };

  if (gameState === 'START') {
    return (
      <div className="screen start-screen">
        <h1 className="pixel-title">MARIO QUIZZ ADVENTURE</h1>
        <button className="pixel-btn main-btn" onClick={() => setGameState('PLAYING')}>
          START GAME
        </button>
      </div>
    );
  }

  if (gameState === 'GAMEOVER') {
    return (
      <div className="screen end-screen">
        <h1 className="pixel-title">COURSE FINIE !</h1>
        <div className="final-score">SCORE: {score}</div>
        <button className="pixel-btn main-btn" onClick={() => window.location.reload()}>
          REJOUER
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];
  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="game-wrapper">
      {/* HUD (Infos du haut) */}
      <div className="hud">
        <div>COINS: {score}</div>
        <div>WORLD 1-{currentIndex + 1}</div>
      </div>

      {/* PISTE DE COURSE */}
      <div className="track-area">
        <div className="track-bg"></div>
        <div className="mario-container" style={{ left: `${progress}%` }}>
          <img src={marioImg} alt="Mario" className="mario-sprite" />
        </div>
        <div className="finish-flag">🏁</div>
      </div>

      {/* CARTE DE QUESTION */}
      <div className="quiz-card">
        <div className="question-bubble">
          <p>{q.content}</p>
        </div>

        <div className="options-grid">
          {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, i) => (
            <button 
              key={i} 
              className={`pixel-btn opt-btn ${feedback && opt === q.solution ? 'is-correct' : ''} ${feedback && opt !== q.solution ? 'is-disabled' : ''}`}
              onClick={() => handleAnswer(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      
      {feedback && (
        <div className={`feedback-popup ${feedback}`}>
          {feedback === 'correct' ? 'BIEN JOUÉ !' : 'DOMMAGE !'}
        </div>
      )}
    </div>
  );
}

export default App;