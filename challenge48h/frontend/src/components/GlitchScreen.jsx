import { useEffect } from 'react';
import './GlitchScreen.css';

/** Affiche une transition choc (jumpscare / glitch) avant de passer à la Partie 3. */
export default function GlitchScreen({ onComplete }) {
  useEffect(() => {
    // Après 3 secondes de glitch, on passe à l'écran suivant
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="glitch-screen">
      <div className="matrix-overlay" />
      <h1 className="glitch-text">INTRUSION DETECTED</h1>
      <h1 className="glitch-text" style={{ marginTop: '1rem', color: 'red' }}>SYSTEM COMPROMISED</h1>
      <div className="glitch-sub">Redirection vers le Cœur du Réseau (Partie 3)...</div>
      
      {/* Simulation lignes de commande */}
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '0.8rem', opacity: 0.5 }}>
        <div>&gt; rm -rf /var/logs/*</div>
        <div>&gt; bypass_firewall.sh --force</div>
        <div>&gt; executing root privilege escalation...</div>
        <div>&gt; ACCESS GRANTED</div>
      </div>
    </div>
  );
}
