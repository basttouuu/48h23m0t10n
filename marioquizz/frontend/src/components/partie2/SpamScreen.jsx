import { useState, useEffect, useRef, useCallback } from 'react';
import './SpamScreen.css';

const AD_TEMPLATES = [
  { title: "SOS",     text: "Ton PC mine du Bitcoin pour payer le cafe de Cyril.",           btn: "OKLM" },
  { title: "ALERTE",  text: "Rupture de stock a la cafet !!",                                btn: "PANIQUE TOTALE !" },
  { title: "URGENT",  text: "Ton partiel d'Algorithmie vient d'etre supprime.",              btn: "RESTAURER" },
  { title: "TUTO",    text: "Apprends a centrer une div en 2 jours intensifs sans dormir.", btn: "VOIR LE MIRACLE" },
  { title: "ERREUR",  text: "Stack Overflow a crash. Plus de copier/coller.",               btn: "ABANDONNER LE METIER" },
  { title: "GAGNANT", text: "Tu as gagne un stage non remunere !!",                          btn: "ACCEPTER DIRECT" },
  { title: "VIRUS",   text: "Ton historique de navigation a fuite sur le grand ecran.",      btn: "MOURIR DE HONTE" },
  { title: "SYSTEME", text: "Windows requiert 18 mises a jour.",                             btn: "METTRE A JOUR MAINTENANT" },
];

const MAX_ADS = 45;
let idCounter = 0;

export default function SpamScreen({ onAccessFirewall }) {
  // Store ads in a ref to avoid re-renders during drag, trigger renders via a counter
  const adsRef = useRef([]);
  const [, forceRender] = useState(0);
  const zIndexRef = useRef(100);
  const audioRef = useRef(null);

  const playErrorSound = useCallback(() => {
    try {
      const sound = audioRef.current;
      if (sound) {
        sound.currentTime = 0;
        sound.volume = 0.3;
        sound.play().catch(() => {});
      }
    } catch (_) {}
  }, []);

  const spawnAd = useCallback(() => {
    if (adsRef.current.length >= MAX_ADS) return;
    const tpl = AD_TEMPLATES[Math.floor(Math.random() * AD_TEMPLATES.length)];
    zIndexRef.current += 1;
    adsRef.current = [
      ...adsRef.current,
      {
        id: ++idCounter,
        ...tpl,
        top:    Math.random() * 80 + '%',
        left:   Math.random() * 80 + '%',
        zIndex: zIndexRef.current,
      },
    ];
    forceRender(n => n + 1);
  }, []);

  const removeAd = useCallback((id) => {
    adsRef.current = adsRef.current.filter(a => a.id !== id);
    forceRender(n => n + 1);
  }, []);

  const annoyUser = useCallback(() => {
    playErrorSound();
    for (let i = 0; i < 3; i++) {
      setTimeout(spawnAd, i * 200);
    }
  }, [playErrorSound, spawnAd]);

  const startDrag = useCallback((e, id) => {
    e.preventDefault();
    const card = e.currentTarget.closest('.ad-card');
    if (!card) return;

    zIndexRef.current += 1;
    const newZ = zIndexRef.current;
    card.style.zIndex = newZ;
    // update ref so re-renders preserve z-index
    const ad = adsRef.current.find(a => a.id === id);
    if (ad) ad.zIndex = newZ;

    const rect = card.getBoundingClientRect();
    const shiftX = e.clientX - rect.left;
    const shiftY = e.clientY - rect.top;

    const onMouseMove = (ev) => {
      card.style.left = (ev.clientX - shiftX) + 'px';
      card.style.top  = (ev.clientY - shiftY) + 'px';
    };

    const onMouseUp = () => {
      // Persist dragged position into ref so re-renders keep it
      if (ad) {
        ad.left = card.style.left;
        ad.top  = card.style.top;
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  useEffect(() => {
    // Spawn 15 initial ads with slight stagger
    for (let i = 0; i < 15; i++) {
      setTimeout(spawnAd, i * 80);
    }
    const interval = setInterval(() => {
      spawnAd();
      if (Math.random() > 0.5) playErrorSound();
    }, 1500);
    return () => clearInterval(interval);
  }, [spawnAd, playErrorSound]);

  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget) {
      spawnAd();
      playErrorSound();
    }
  };

  return (
    <div className="spam-page">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <div className="main-warning">
        <marquee scrollAmount="25">
          ⚠️ FÉLICITATIONS ! TU ES LE 1 954 542e VISITEUR ! 🎉 CLIQUE ICI POUR SAUVER TON PARTIEL ! ⚠️
        </marquee>
      </div>

      <main className="spam-container" onClick={handleContainerClick}>
        {/* Secret card – hidden under the chaos */}
        <div className="ad-card secret-ad">
          <div className="ad-header">
            <span>SYSTEM_OVERRIDE</span>
            <span className="close-btn" onClick={(e) => e.stopPropagation()}>X</span>
          </div>
          <div className="ad-body">
            <p>PARAMÈTRES SYSTÈME</p>
            <p className="big-text">ACCÈS ADMINISTRATEUR</p>
            <button
              onClick={(e) => { e.stopPropagation(); onAccessFirewall(); }}
              style={{ background: 'lime', color: 'black', borderColor: 'darkgreen' }}
            >
              LANCER LE FIREWALL
            </button>
          </div>
        </div>

        {/* Dynamic trap ads */}
        {adsRef.current.map(ad => (
          <div
            key={ad.id}
            className="ad-card ad-trap"
            style={{ top: ad.top, left: ad.left, zIndex: ad.zIndex }}
          >
            <div
              className="ad-header"
              onMouseDown={(e) => startDrag(e, ad.id)}
            >
              <span>{ad.title}</span>
              <span
                className="close-btn"
                onClick={(e) => { e.stopPropagation(); removeAd(ad.id); }}
              >
                X
              </span>
            </div>
            <div className="ad-body">
              {ad.text}
              <br />
              <button onClick={(e) => { e.stopPropagation(); annoyUser(); }}>{ad.btn}</button>
            </div>
          </div>
        ))}
      </main>

      <footer className="main-footer">
        <p>Challenge 48h - Partie 2</p>
      </footer>

      <audio
        ref={audioRef}
        src="https://www.myinstants.com/media/sounds/windows-xp-error.mp3"
        preload="auto"
      />
    </div>
  );
}
