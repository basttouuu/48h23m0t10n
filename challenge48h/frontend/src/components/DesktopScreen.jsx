import { useState, useEffect } from 'react';
import './DesktopScreen.css';

/** Affiche un faux bureau d'ordinateur servant de menu principal. */
export default function DesktopScreen({ onLaunchBrowser, onLaunchMail, onLaunchPartie3 }) {
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    // Fait clignoter les deux points de l'heure
    const interval = setInterval(() => {
      setShowColon(v => !v);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const part2Done = localStorage.getItem('barrier10') === 'unlocked';

  const handleConfidential = () => {
    if (!part2Done) {
      alert("ACCÈS REFUSÉ : Le pare-feu EPSILON bloque l'ouverture de ce dossier.");
    } else {
      onLaunchPartie3();
    }
  };

  const handleTrash = () => {
    alert("La corbeille est vide. Enfin... c'est ce que vous croyez.");
  };

  return (
    <div className="desktop-screen">
      <div className="desktop-icons">
        <div className="desktop-icon" onClick={handleTrash}>
          <span className="icon-img">🗑️</span>
          <span className="icon-label">Corbeille</span>
        </div>

        <div className="desktop-icon" onClick={onLaunchBrowser}>
          <span className="icon-img">🌐</span>
          <span className="icon-label">Firefox_Dev</span>
        </div>
        
        <div className="desktop-icon" onClick={onLaunchMail}>
          <span className="icon-img">📧</span>
          <span className="icon-label">Webmail_Etu</span>
        </div>

        <div className="desktop-icon" onClick={() => alert("Erreur d'exécution : la licence VS Code a expiré. Impossible de coder.")}>
          <span className="icon-img">💻</span>
          <span className="icon-label">VS Code</span>
        </div>

        <div className="desktop-icon" onClick={() => alert("L'archive 'TP_Reseau_Final_V2_VRAIMENTFINI(3).zip' est corrompue.")}>
          <span className="icon-img">📁</span>
          <span className="icon-label">TP_Final.zip</span>
        </div>

        <div className="desktop-icon" onClick={handleConfidential}>
          <span className="icon-img">⚙️</span>
          <span className="icon-label">launch_root.sh</span>
        </div>
      </div>

      <div className="taskbar">
        <button className="start-btn">🐧 Linux Mint DE</button>
        <div className="clock">23<span style={{ visibility: showColon ? 'visible' : 'hidden' }}>:</span>58</div>
      </div>
    </div>
  );
}
