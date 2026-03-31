import React, { useState, useEffect, useRef } from 'react';
import './Partie3.css';
import { QUESTIONS, PART3_MS } from './partie3-questions';
import SurvivalGame from './SurvivalGame';

/** Composant principal gérant la boucle du jeu final (Partie 3). */
export default function Partie3Screen({ onBack }) {
  // states
  const [view, setView] = useState(() => {
    return localStorage.getItem('erreur404.firstLaunchSeen') === '1' ? 'intro' : 'firstLaunch';
  });
  
  // HUD
  const [clockBadge, setClockBadge] = useState('UTC ...');
  const [detections, setDetections] = useState('—');
  
  // Game state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [countdownSec, setCountdownSec] = useState(8 * 60 + 30);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [PlatformEnded, setPlatformEnded] = useState(false);
  const [platformWon, setPlatformWon] = useState(false);
  
  // Timer for question
  const [timerWidth, setTimerWidth] = useState('100%');
  const [timerTransition, setTimerTransition] = useState('none');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [selectedAns, setSelectedAns] = useState(null);
  
  const questionTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const questionDeadlineRef = useRef(0);

  // ambient HUD
  useEffect(() => {
    const formatUtcHms = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`;
    };
    
    const tick = () => {
      setClockBadge(formatUtcHms());
      const n = 1800 + Math.floor(Math.random() * 7200);
      setDetections(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f'));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /** Récupère les variables de thème basées sur le niveau actuel de la partie 3. */
  const getThemeVars = () => {
    if (view === 'part3') return { theme: 'part3', title: 'root@epsILON-core', sub: 'privilege escalation — active', path: '/var/epsilon/mainframe/exfil' };
    if (view === 'firstLaunch') return { theme: 'first-launch', title: 'XCOM // PRIME', sub: 'operation boot — primary channel', path: '/bridge/init' };
    if (view === 'platformHard') return { theme: 'platform-hard', title: 'kernel: IDS_FLOOD', sub: 'defense subroutine — locked', path: '/sys/net/parefeu/aggressive' };
    if (view === 'ending') return { theme: 'ending', title: '[ session closed ]', sub: 'clean disconnect — no trace', path: '~/outbox — done' };
    return { theme: 'intro', title: 'entropyNet://client', sub: 'handshake — awaiting payload', path: '~/epsilon/phase3' };
  };
  
  const themeVars = getThemeVars();

  /** Réinitialise l'état du tutoriel d'accueil (first launch). */
  const resetFirstLaunch = () => {
    localStorage.removeItem('erreur404.firstLaunchSeen');
    setView('firstLaunch');
  };

  /** Valide l'étape de l'accueil et passe au menu de lancement. */
  const handleLaunchContinue = () => {
    localStorage.setItem('erreur404.firstLaunchSeen', '1');
    setView('intro');
  };
  
  /** Initialise et lance la série de questions de la Partie 3. */
  const startGame = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setQuestionIndex(0);
    setCountdownSec(8 * 60 + 30);
    setView('part3');
    renderQuestion(0);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdownSec((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  /** Stoppe net le minuteur de la question en cours. */
  const endQuestionTimer = () => {
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    questionTimerRef.current = null;
  };
  
  /** Prépare et rend la question demandée tout en lançant la barre de progression temporelle. */
  const renderQuestion = (index) => {
    endQuestionTimer();
    const q = QUESTIONS[index];
    if (!q) {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      setView('ending');
      return;
    }
    
    setBtnDisabled(false);
    setSelectedAns(null);
    setShowFeedback(false);
    
    questionDeadlineRef.current = Date.now() + PART3_MS;
    setTimerTransition('none');
    setTimerWidth('100%');
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimerTransition(`width ${PART3_MS}ms linear`);
        setTimerWidth('0%');
      });
    });
    
    questionTimerRef.current = setInterval(() => {
      if (Date.now() >= questionDeadlineRef.current) {
        endQuestionTimer();
        failByTimeout();
      }
    }, 200);
  };

  /** Traite le cas où le joueur n'a pas répondu à temps, menant à la phase de survie. */
  const failByTimeout = () => {
    setBtnDisabled(true);
    setShowFeedback(true);
    setFeedbackMsg('Temps écoulé — le pare-feu te repère.');
    setTimeout(() => {
      startPlatformHard();
    }, 900);
  };

  /** Evalue la réponse soumise, déclenche la victoire ou la défaite de la question. */
  const handleAnswer = (i) => {
    endQuestionTimer();
    setBtnDisabled(true);
    setSelectedAns(i);
    
    const q = QUESTIONS[questionIndex];
    const isCorrect = i === q.correct;
    
    if (!isCorrect) {
      setShowFeedback(true);
      setFeedbackMsg('Erreur — isolation pare-feu.');
      setTimeout(() => startPlatformHard(), 700);
      return;
    }
    
    setTimeout(() => {
      setQuestionIndex(questionIndex + 1);
      renderQuestion(questionIndex + 1);
    }, 400);
  };
  
  /** Lance le mini-jeu de survie après une erreur ou l'épuisement du temps. */
  const startPlatformHard = () => {
    setView('platformHard');
    setPlatformEnded(false);
    setPlatformWon(false);
  };

  /** Formate une durée en secondes en HH:MM:SS. */
  const formatClock = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
  };

  return (
    <div className={`p3-root ${themeVars.theme === 'first-launch' ? 'is-first-launch' : ''}`}>
      <div className="map-bg" aria-hidden="true">
        <div className="map-bg__raster"></div>
        <div className="map-bg__shade"></div>
      </div>
      <div className="hud-grid-bg" aria-hidden="true"></div>
      <div className="hud-radar-sweep" aria-hidden="true"></div>

      <div className="p3-app" data-theme={themeVars.theme}>
        <aside className="hud-panel hud-panel--stats" aria-label="Statistiques holistiques">
          <button className="btn btn-ghost" onClick={onBack} style={{marginBottom: '1rem'}}>&lt; Retour Navigateur</button>
          <div className="hud-panel__title">STATISTIQUES</div>
          <div className="hud-stat">
            <span className="hud-stat__label">Détections / s</span>
            <span className="hud-stat__value hud-stat__value--pulse">{detections}</span>
          </div>
          <div className="hud-stat">
            <span className="hud-stat__label">Région</span>
            <span className="hud-stat__value">EU-SOUTH</span>
          </div>
          <div className="hud-stat">
            <span className="hud-stat__label">OAS</span>
            <span className="hud-stat__bar"><span className="hud-stat__bar-fill" style={{ width: '72%' }}></span></span>
          </div>
          <div className="hud-stat">
            <span className="hud-stat__label">Web AV</span>
            <span className="hud-stat__bar hud-stat__bar--warn"><span className="hud-stat__bar-fill" style={{ width: '41%' }}></span></span>
          </div>
          <div className="hud-stat">
            <span className="hud-stat__label">Ransomware</span>
            <span className="hud-stat__bar hud-stat__bar--danger"><span className="hud-stat__bar-fill" style={{ width: '88%' }}></span></span>
          </div>
          <p className="hud-panel__foot">Détections : indicateurs décoratifs.</p>
          <div className="hud-mini-map" aria-hidden="true">
            <div className="hud-mini-map__grid"></div>
            <div className="hud-mini-map__crosshair"></div>
          </div>
        </aside>

        <div className="dashboard-column">
          <header className="topbar terminal-chrome">
            <div className="topbar-window-btns" aria-hidden="true">
              <span className="win-dot win-dot--close"></span>
              <span className="win-dot win-dot--min"></span>
              <span className="win-dot win-dot--max"></span>
            </div>
            <div className="brand">
              <span className="brand-mark" aria-hidden="true">█</span>
              <div>
                <div className="brand-title">{themeVars.title}</div>
                <div className="brand-subtitle">{themeVars.sub}</div>
              </div>
            </div>
            <div className="topbar-actions">
              <span className="clock-badge">{clockBadge}</span>
              <button type="button" className="btn btn-ghost" onClick={resetFirstLaunch}>[ reset ]</button>
            </div>
          </header>

          <main className="main-stage">
            <div className="terminal-window">
              <div className="terminal-window__title">
                <span className="terminal-window__path">{themeVars.path}</span>
                <span className="terminal-window__hint">— INSERT MODE</span>
              </div>
              <div className="terminal-window__body">
                {view === 'firstLaunch' && (
                  <section className="view view-first-launch">
                    <p className="term-line"><span className="term-prompt">COMMAND</span><span className="term-colon">:</span><span className="term-path">/bridge</span>$ uplink --init</p>
                    <div className="intro-card">
                      <p className="intro-kicker">[ XCOM // PRIME ]</p>
                      <h1 className="intro-title">
                        OPERATION <span className="intro-title__accent">NIGHT SHARD</span>
                      </h1>
                      <p className="intro-lead">
                        La fenêtre d&apos;intrusion est ouverte. Une IA de défense verrouille le <strong>mainframe</strong> en cycles courts.
                      </p>
                      <p className="intro-lead intro-lead--dim">
                        Objectif : extraire les journaux cibles. Échec QCM ou timeout -&gt; contre-mesure pare-feu.
                      </p>
                      <button type="button" className="btn btn-primary btn-lg" onClick={handleLaunchContinue}>
                        &gt; confirmer mission
                      </button>
                    </div>
                  </section>
                )}

                {view === 'intro' && (
                  <section className="view view-intro">
                    <p className="term-line"><span className="term-prompt">root@entropy</span><span className="term-colon">:</span><span className="term-path">~</span>$ ./briefing.sh</p>
                    <div className="intro-card">
                      <p className="intro-kicker">[ PROJET E.P.S.I.L.O.N. ]</p>
                      <h1 className="intro-title">PHASE_03 — <span className="intro-title__accent">MAINFRAME</span></h1>
                      <p className="intro-lead">
                        Connexion établie après saut du pare-feu. Cible : <strong>base centrale</strong>. Objectif :
                        <strong>exfiltration logs</strong> → relais anonyme (DGSI).
                      </p>
                      <p className="intro-lead intro-lead--dim">
                        Boss phase : QCM niveau 4, chrono serré à chaque question. Une erreur ou un timeout, et le
                        pare-feu te reprend.
                      </p>
                      <button type="button" className="btn btn-primary btn-lg" onClick={startGame}>
                        &gt; lancer infiltration_mainframe
                      </button>
                    </div>
                  </section>
                )}

                {view === 'part3' && QUESTIONS[questionIndex] && (
                  <section className="view view-core">
                    <div className="countdown-banner">
                      <span className="countdown-banner__label">Fenêtre avant effacement régional</span>
                      <span className="countdown-big">{formatClock(countdownSec)}</span>
                    </div>
                    <div className="part-header">
                      <span className="part-pill part-pill--core">MODULE // EXTRACTION</span>
                      <h2 className="part-title">Requête privilège — niveau 4</h2>
                      <p className="part-desc">
                        Réponse requise sous délai système. Erreur ou timeout → sous-routine PARE_FEU_AGRESSIF.
                      </p>
                    </div>
                    <div className="timer-bar">
                      <span className="timer-bar__label">TTL session question</span>
                      <div className="timer-track">
                        <div className="timer-fill" style={{ width: timerWidth, transition: timerTransition }}></div>
                      </div>
                    </div>
                    <div className="qcm-card qcm-card--core">
                      <p className="qcm-label"><span className="prompt">&gt;&gt;</span> QUERY</p>
                      <p className="qcm-text">{QUESTIONS[questionIndex].text}</p>
                      <div className="qcm-options">
                        {QUESTIONS[questionIndex].options.map((opt, idx) => {
                          const isCorrect = idx === QUESTIONS[questionIndex].correct;
                          let btnClass = "opt-btn";
                          if (btnDisabled) {
                            if (isCorrect) btnClass += " correct";
                            else if (idx === selectedAns) btnClass += " wrong";
                          }
                          return (
                            <button
                              key={idx}
                              type="button"
                              className={btnClass}
                              disabled={btnDisabled}
                              onClick={() => handleAnswer(idx)}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {showFeedback && (
                        <p className="qcm-feedback bad">{feedbackMsg}</p>
                      )}
                    </div>
                  </section>
                )}

                {view === 'platformHard' && (
                  <section className="view view-platform view-platform--hard">
                    <p className="term-line term-line--warn"><span className="term-prompt">WARN</span> pare-feu.mode=NERVOUS</p>
                    <div className="platform-header">
                      <h2 className="platform-title">Sous-système défensif — surcharge</h2>
                      <p className="platform-desc">Maintenir la session <strong>10,0 s</strong>. Éviter projectiles &amp; pics.</p>
                      <p className="platform-keys">[ ← / → ] déplacement · [ SPACE ] propulsion verticale</p>
                    </div>
                    
                    {!PlatformEnded && (
                      <SurvivalGame onDone={(won) => {
                         setPlatformEnded(true);
                         setPlatformWon(won);
                      }} />
                    )}
                    
                    {PlatformEnded && (
                      <div className="platform-actions" style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                        {!platformWon && (
                          <button type="button" className="btn btn-primary" onClick={startPlatformHard}>
                            Réexécuter module boss
                          </button>
                        )}
                        {platformWon && (
                          <button type="button" className="btn btn-primary" onClick={() => { setView('part3'); renderQuestion(questionIndex); }}>
                            Retour requête
                          </button>
                        )}
                      </div>
                    )}
                  </section>
                )}

                {view === 'ending' && (
                  <section className="view view-ending">
                    <p className="term-line term-line--ok"><span className="term-prompt">OK</span> exfiltration terminée</p>
                    <div className="ending-card">
                      <h2 className="ending-title">[ MAINFRAME COMPROMIS ]</h2>
                      <p className="ending-text">
                        Archive signée. Canaux : DGSI (anonyme).
                      </p>
                      <p className="ending-joke">
                        État du monde : <span className="ending-ok">STABLE</span><br />
                        <strong>Ton partiel : toujours pas révisé.</strong>
                      </p>
                      <button type="button" className="btn btn-primary" onClick={() => { setView('intro'); }}>&gt; nouvelle session</button>
                    </div>
                  </section>
                )}

              </div>
            </div>
          </main>
        </div>

        <aside className="hud-panel hud-panel--layers" aria-label="Couches d’analyse">
          <div className="hud-panel__title">COUCHES</div>
          <ul className="hud-layers">
            <li className="hud-layer hud-layer--on"><span className="hud-layer__dot"></span> conflits</li>
            <li className="hud-layer hud-layer--on"><span className="hud-layer__dot"></span> hotspots</li>
            <li className="hud-layer hud-layer--on"><span className="hud-layer__dot"></span> outages</li>
            <li className="hud-layer"><span className="hud-layer__dot hud-layer__dot--off"></span> sanctions</li>
            <li className="hud-layer hud-layer--on"><span className="hud-layer__dot"></span> trafic log</li>
          </ul>
          <div className="hud-table-wrap">
            <div className="hud-table__caption">Viewport (synthèse)</div>
            <table className="hud-table">
              <thead>
                <tr>
                  <th scope="col">Param</th>
                  <th scope="col">Valeur</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>lat</td><td>2.0486</td></tr>
                <tr><td>lon</td><td>0.0000</td></tr>
                <tr><td>zoom</td><td>1.00</td></tr>
                <tr><td>view</td><td>global</td></tr>
                <tr><td>timeRange</td><td>7d</td></tr>
              </tbody>
            </table>
          </div>
          <div className="hud-table-wrap">
            <div className="hud-table__caption">Couches actives</div>
            <table className="hud-table hud-table--compact">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Layer</th>
                  <th scope="col">État</th>
                </tr>
              </thead>
              <tbody>
                {['conflicts', 'bases', 'hotspots', 'nuclear', 'sanctions', 'weather', 'economic', 'waterways', 'outages', 'military', 'natural'].map((layer, i) => (
                  <tr key={layer}>
                    <td>{i + 1}</td>
                    <td>{layer}</td>
                    <td><span className="hud-tag-on">ON</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </div>
      <div className="scanlines" aria-hidden="true"></div>
      <div className="vignette" aria-hidden="true"></div>
    </div>
  );
}
