import { useState } from 'react';
import './Firewall.css';

const BARRIER_TITLES = [
  'Authentification HTML',
  'Variables Globales JS',
  'CSS Caché (Display None)',
  'Stockage LocalStorage',
  'Données Cookie',
  'Décodage Base64',
  'Formulaire Input Hidden',
  'API Réseau (Fetch)',
  'Erreur Console',
  'Exécution Fonction',
];

export default function HubScreen({ onSelectBarrier }) {
  // Read localStorage each render so status stays fresh
  const [, refresh] = useState(0);

  const barriers = BARRIER_TITLES.map((title, i) => {
    const num = i + 1;
    const unlocked = localStorage.getItem('barrier' + num) === 'unlocked';
    const prevUnlocked = num === 1 || localStorage.getItem('barrier' + (num - 1)) === 'unlocked';
    const accessible = !unlocked && prevUnlocked;
    const locked = !unlocked && !prevUnlocked;

    let statusText = locked ? '🔒 Verrouillée' : unlocked ? '✅ Déverrouillée' : '🔔 Accessible';
    let cardClass = locked ? 'locked' : unlocked ? 'unlocked' : 'accessible';

    return { num, title, unlocked, accessible, locked, statusText, cardClass };
  });

  return (
    <div className="fw-screen">
      <div className="fw-container fw-text-center">
        <h1 className="fw-glitch">EPSILON - Hub</h1>
        <p className="fw-subtitle">Sélectionnez une barrière à pirater</p>

        <div className="fw-grid">
          {barriers.map(({ num, title, statusText, cardClass, locked }) => (
            <div
              key={num}
              className={`fw-barrier-card ${cardClass}`}
              onClick={() => !locked && onSelectBarrier(num)}
              role="button"
              tabIndex={locked ? -1 : 0}
              onKeyDown={(e) => e.key === 'Enter' && !locked && onSelectBarrier(num)}
            >
              <div className="fw-barrier-num">{num}</div>
              <h3>Barrière {num}</h3>
              <p className="fw-barrier-title">{title}</p>
              <div className="fw-barrier-status">{statusText}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
