import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // 1. Les états (la mémoire de ton jeu)
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  // 2. Récupérer les questions du Backend au chargement
  useEffect(() => {
    axios.get('http://localhost:3001/api/questions')
      .then(res => {
        setQuestions(res.data);
      })
      .catch(err => {
        console.error("Erreur de connexion au backend :", err);
        setMessage("Erreur : Le backend est-il lancé ?");
      });
  }, []);

  // 3. Logique quand on clique sur une réponse
  const handleAnswer = (selectedOption) => {
    const currentQ = questions[currentIndex];

    if (selectedOption === currentQ.solution) {
      // Bonne réponse
      setScore(prev => prev + 100);
      // On calcule l'avancement (ex: 5 questions = 20% par question)
      const step = 100 / questions.length;
      setProgress(prev => Math.min(prev + step, 100));
      setMessage("Bien joué ! ✅");
    } else {
      // Mauvaise réponse
      setMessage(`Faux ! La réponse était : ${currentQ.solution} ❌`);
    }

    // Attendre un peu avant de passer à la suite pour lire le message
    setTimeout(() => {
      setMessage("");
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  // 4. Affichage
  if (questions.length === 0) return <div className="loader">{message || "Chargement..."}</div>;

  const q = questions[currentIndex];

  return (
    <div className="game-wrapper">
      <div className="stats-bar">
        <span>Score: <b>{score}</b></span>
        <span>Question: <b>{currentIndex + 1} / {questions.length}</b></span>
      </div>

      {/* La piste de course */}
      <div className="track">
        <div className="mario" style={{ left: `${progress}%` }}>🏃‍♂️</div>
        <div className="finish-line">🏁</div>
      </div>

      <div className="feedback-message">{message}</div>

      {!gameOver ? (
        <div className="quiz-card">
          <h2 className="question-text">{q.content}</h2>
          <div className="options-grid">
            {[q.option_a, q.option_b, q.option_c, q.option_d].map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleAnswer(opt)} 
                className="btn-option"
                disabled={message !== ""} // Désactive pendant le message
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="victory-screen">
          <h1>🏆 COURSE TERMINÉE !</h1>
          <p>Bravo, tu as fini avec un score de {score}.</p>
          <button onClick={() => window.location.reload()} className="btn-restart">Rejouer</button>
        </div>
      )}
    </div>
  );
}

export default App;