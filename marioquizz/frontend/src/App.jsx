import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import BrowserScreen from './components/BrowserScreen';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import Partie2Screen from './components/partie2/Partie2Screen';
import Partie3Screen from './components/partie3/Partie3Screen';

const BACKEND_URL = 'https://48h-plateforme.vercel.app';

const FALLBACK_QUESTIONS = [
  {
    id: 1,
    content: '⚠️ Erreur de connexion au serveur !',
    option_a: 'Vérifie DATABASE_URL sur Vercel',
    option_b: 'Redéploie le backend',
    option_c: 'Check tes logs Vercel',
    option_d: 'Relance le push git',
    solution: 'Check tes logs Vercel',
    hint: "Le site n'arrive pas à parler au serveur.",
    explanation: "Si tu vois ça, c'est que l'API n'a pas répondu.",
  },
  {
    id: 2,
    content: 'Quelle est la capitale de la France ?',
    option_a: 'Berlin',
    option_b: 'Madrid',
    option_c: 'Paris',
    option_d: 'Rome',
    solution: 'Paris',
    hint: "C'est la ville de la Tour Eiffel.",
    explanation: 'Paris est la capitale et plus grande ville de France.',
  },
  {
    id: 3,
    content: 'Combien font 2 + 2 × 2 ?',
    option_a: '8',
    option_b: '6',
    option_c: '4',
    option_d: '16',
    solution: '6',
    hint: 'Priorité : multiplication avant addition.',
    explanation: '2 + (2×2) = 2 + 4 = 6',
  },
];

export default function App() {
  const [gameState, setGameState] = useState('BROWSER');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/questions`)
      .then((res) => setQuestions(res.data))
      .catch(() => setQuestions(FALLBACK_QUESTIONS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="screen loading-screen">
        <div className="loading-spinner" />
        <div className="loading-text">Chargement...</div>
      </div>
    );
  }

  if (gameState === 'PARTIE2') {
    return <Partie2Screen onBack={() => setGameState('BROWSER')} />;
  }

  if (gameState === 'PARTIE3') {
    return <Partie3Screen onBack={() => setGameState('BROWSER')} />;
  }

  if (gameState === 'BROWSER') {
    return (
      <BrowserScreen 
        onEnterGame={() => setGameState('START')} 
        onEnterPartie2={() => setGameState('PARTIE2')} 
        onEnterPartie3={() => setGameState('PARTIE3')} 
      />
    );
  }

  if (gameState === 'START') {
    return (
      <StartScreen
        playerName={playerName}
        setPlayerName={setPlayerName}
        onStart={() => {
          if (!playerName.trim()) {
            alert('Entre un pseudo pour commencer !');
            return;
          }
          setGameState('PLAYING');
        }}
      />
    );
  }

  if (gameState === 'PLAYING') {
    return <GameScreen questions={questions} playerName={playerName} />;
  }

  return null;
}
