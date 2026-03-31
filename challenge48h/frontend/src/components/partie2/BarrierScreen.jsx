import { useState, useEffect, useRef } from 'react';
import './Firewall.css';

const BARRIERS = [
  { num: 1,  password: 'html_is_easy',       hint: '💡 Les fondations structurales de cette page cachent un message invisible à l\'œil nu...', title: 'Barrière 1', subtitle: 'Authentification système',        label: 'Mot de passe :',       btn: 'Accéder' },
  { num: 2,  password: 'js_console_pw',      hint: '💡 L\'environnement d\'exécution garde en mémoire "globale" une sauvegarde précieuse.', title: 'Barrière 2', subtitle: 'Variables globales JS', label: 'Mot de passe :',       btn: 'Accéder' },
  { num: 3,  password: 'css_master',         hint: '💡 La clé est affichée, mais son style dicte de ne pas la montrer (display)...', title: 'Barrière 3', subtitle: 'Pare-feu réseau',              label: 'Clé de chiffrement :', btn: 'Déverrouiller' },
  { num: 4,  password: 'local_storage_key',  hint: '💡 Le navigateur retient toujours localement les jetons et clés d\'administration.', title: 'Barrière 4', subtitle: 'Stockage local',              label: 'Mot de passe :',       btn: 'Accéder' },
  { num: 5,  password: 'cookie_monster_pw',  hint: '💡 Une petite miette de données, laissée par le serveur, permet de maintenir ta session.', title: 'Barrière 5', subtitle: 'Session sécurisée',             label: 'Mot de passe :',       btn: 'Accéder' },
  { num: 6,  password: 'base64_decode',      hint: '💡 L\'encodage n\'est pas du chiffrement. Il utilise juste une base de 64 caractères.', title: 'Barrière 6', subtitle: 'Déboguer le système',          label: 'Mot de passe :',       btn: 'Accéder' },
  { num: 7,  password: 'hidden_value_pw',    hint: '💡 Un champ de texte occulte (hidden) détient l\'accès au système, cherche dans l\'arborescence.', title: 'Barrière 7', subtitle: 'Gestion de version contrôlée',  label: 'Mot de passe :',       btn: 'Accéder' },
  { num: 8,  password: 'network_tab_pw',     hint: '💡 Dans l\'ombre, une transmission de données a fuité dès ton arrivée sur la page.', title: 'Barrière 8', subtitle: 'Analyse réseau',               label: 'Mot de passe :',       btn: 'Accéder' },
  { num: 9,  password: 'console_log_pw',     hint: '💡 Le système a hurlé une erreur à la figure de l\'administrateur. L\'as-tu lue ?', title: 'Barrière 9', subtitle: 'Débogage avancé',              label: 'Mot de passe :',       btn: 'Accéder' },
  { num: 10, password: 'call_me_pw',         hint: '💡 La fonction d\'obtention du drapeau "getFlag" n\'attend qu\'une chose : que tu l\'invoques.', title: 'Barrière 10', subtitle: 'Exécution de fonction',          label: 'Mot de passe :',       btn: 'Accéder' },
];

/** Affiche et gère le piratage d'une barrière individuelle de la partie 2. */
export default function BarrierScreen({ barrierNum, onBack, onNext }) {
  const config = BARRIERS[barrierNum - 1];
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [attempts, setAttempts] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const commentContainerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    setInputValue('');
    setMessage({ text: '', type: '' });
    setAttempts(0);
    setElapsed(0);
    setHintVisible(false);
    startTimeRef.current = Date.now();
  }, [barrierNum]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [barrierNum]);

  // Barrier-specific side effects (the "flaws")
  useEffect(() => {
    if (barrierNum === 1 && commentContainerRef.current) {
      // Insert real HTML comment node so it shows up in DevTools
      const comment = document.createComment(' Le mot de passe de la barrière 1 est: html_is_easy ');
      commentContainerRef.current.insertBefore(comment, commentContainerRef.current.firstChild);
    }
    if (barrierNum === 2) {
      window.backup_password = 'js_console_pw';
    }
    if (barrierNum === 4) {
      localStorage.setItem('adminToken', 'local_storage_key');
    }
    if (barrierNum === 5) {
      document.cookie = 'session_token=cookie_monster_pw; path=/';
    }
    if (barrierNum === 8) {
      fetch('data:application/json,{"token":"network_tab_pw"}').catch(() => {});
    }
    if (barrierNum === 9) {
      // eslint-disable-next-line no-console
      console.error('ATTENTION ERREUR SYSTEME: Le mot de passe de secours est console_log_pw');
    }
    if (barrierNum === 10) {
      window.getFlag = function () { return 'call_me_pw'; };
    }
    return () => {
      if (barrierNum === 2)  delete window.backup_password;
      if (barrierNum === 10) delete window.getFlag;
    };
  }, [barrierNum]);

  /** Vérifie la solution soumise par l'utilisateur pour débloquer la barrière. */
  const checkPassword = () => {
    const input = inputValue.trim().toLowerCase();
    if (input === config.password) {
      setMessage({ text: 'Accès confirmé !', type: 'success' });
      localStorage.setItem('barrier' + barrierNum, 'unlocked');
      setTimeout(() => {
        if (barrierNum === 10) onBack();
        else onNext(barrierNum + 1);
      }, 1000);
    } else {
      setMessage({ text: '✗ Mot de passe incorrect', type: 'error' });
      setAttempts(a => a + 1);
    }
  };

  const progress = (barrierNum / 10) * 100 + '%';

  return (
    <div className="fw-screen" ref={commentContainerRef}>
      <div className="fw-container">
        <div className="fw-header">
          <div className="fw-header-info">
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>
          <button className="fw-back-btn" onClick={onBack}>← Accueil</button>
        </div>

        <div className="fw-card">
          <h2 className="fw-card-title">Accès Restreint</h2>
          <p className="fw-card-desc">Entrez vos identifiants pour accéder au système.</p>

          <div className="fw-progress-bar">
            <div className="fw-progress-fill" style={{ width: progress }} />
          </div>

          {message.text && (
            <div className={`fw-message show ${message.type}`}>{message.text}</div>
          )}

          {/* Barrier 3: hidden password div (visible in DevTools) */}
          {barrierNum === 3 && (
            <div className="secret-pass" id="secret-pass">Mot de passe: css_master</div>
          )}

          {/* Barrier 6: Base64 hint inline */}
          {barrierNum === 6 && (
            <p className="fw-inline-hint">Indice : YmFzZTY0X2RlY29kZQ==</p>
          )}

          {/* Barrier 7: hidden input (visible in DevTools) */}
          {barrierNum === 7 && (
            <input type="hidden" id="hidden_admin_key" value="hidden_value_pw" readOnly />
          )}

          <div className="fw-input-group">
            <label htmlFor="pw-input">{config.label}</label>
            <input
              id="pw-input"
              type="password"
              className="fw-input"
              autoComplete="off"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
            />
          </div>

          <div className="fw-btn-group">
            <button className="fw-btn fw-btn-primary" onClick={checkPassword}>{config.btn}</button>
            <button className="fw-btn" onClick={() => setHintVisible(v => !v)}>Aide</button>
          </div>

          <div className="fw-info-grid">
            <div className="fw-info-item">
              <div className="fw-info-label">Tentatives</div>
              <div className="fw-info-value">{attempts}/5</div>
            </div>
            <div className="fw-info-item">
              <div className="fw-info-label">Durée</div>
              <div className="fw-info-value">{elapsed}s</div>
            </div>
          </div>

          <div className={`fw-hint-display ${hintVisible ? 'show' : ''}`}>
            {config.hint}
          </div>
        </div>
      </div>
    </div>
  );
}
