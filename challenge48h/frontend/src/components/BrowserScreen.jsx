import './BrowserScreen.css';
import { useState } from 'react';
import { FAKE_RESULTS, REAL_RESULTS, shuffle } from '../data/searchResults';

/** Composant simulant un navigateur web contenant le moteur de recherche et l'accès aux mini-jeux. */
export default function BrowserScreen({ onEnterGame, onEnterPartie2, onEnterPartie3, onClose }) {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [urlBar, setUrlBar] = useState('koopa://newtab');
  const [activeSite, setActiveSite] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  /** Gère la soumission du formulaire de recherche et filtre les résultats selon la progression. */
  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const part1Done = localStorage.getItem('part1_completed') === 'true';
    const part2Done = localStorage.getItem('barrier10') === 'unlocked';

    const availableRealResults = REAL_RESULTS.filter(r => {
      if (r.action === 'partie2' && !part1Done) return false;
      if (r.action === 'partie3' && !part2Done) return false;
      return true;
    });

    const mixed = shuffle([...availableRealResults, ...FAKE_RESULTS]);
    setResults(mixed);
    setSearched(true);
    setActiveSite(null);
    setCurrentPage(1);
    setUrlBar(`koopasearch.biz/search?q=${encodeURIComponent(query)}`);
  };

  /** Redirige vers le bon jeu ou site web factice en fonction du résultat cliqué. */
  const handleResultClick = (result, e) => {
    e.preventDefault();
    if (result.action === 'enter_game') {
      onEnterGame();
      return;
    }
    if (result.action === 'partie2') {
      onEnterPartie2();
      return;
    }
    if (result.action === 'partie3') {
      onEnterPartie3();
      return;
    }
    
    const template = result.template || 'qcm-javascript.html';
    
    setActiveSite(`/sites_aleatoires/templates/${template}`);
    setUrlBar(`http://${result.url}`);
  };

  /** Permet de naviger en arrière via l'historique de recherche actif. */
  const handleBack = () => {
    if (activeSite) {
      setActiveSite(null);
      setUrlBar(`koopasearch.biz/search?q=${encodeURIComponent(query)}`);
    } else if (searched) {
      setSearched(false);
      setQuery('');
      setUrlBar('koopa://newtab');
    }
  };

  /** Réinitialise complètement le navigateur web aux paramètres par défaut (nouvel onglet). */
  const handleReset = () => {
    setSearched(false);
    setActiveSite(null);
    setQuery('');
    setCurrentPage(1);
    setUrlBar('koopa://newtab');
  };

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const currentResults = results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  return (
    <div className="browser-window">
      {/* Titlebar */}
      <div className="browser-titlebar">
        <div className="browser-dots">
          <span className="dot dot-red" onClick={onClose} style={{ cursor: 'pointer' }} title="Fermer" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="browser-tabs">
          <div className="browser-tab active">
            <span className="tab-favicon">🔍</span>
            <span className="tab-title">
              {searched ? `${query} - KoopaSearch` : 'Nouvel onglet'}
            </span>
            <span className="tab-close">×</span>
          </div>
          <div className="browser-tab inactive">
            <span className="tab-favicon">🎮</span>
            <span className="tab-title">Mario Quiz Adventure</span>
            <span className="tab-close">×</span>
          </div>
          <button className="tab-new">+</button>
        </div>
      </div>

      {/* Navbar */}
      <div className="browser-navbar">
        <div className="nav-btns">
          <button className="nav-btn" disabled={!searched && !activeSite} onClick={handleBack}>←</button>
          <button className="nav-btn" disabled>→</button>
          <button className="nav-btn" onClick={handleReset}>↻</button>
        </div>
        <div className="browser-urlbar">
          <span className="url-lock">🔒</span>
          <span className="url-text">{urlBar}</span>
        </div>
        <button className="nav-btn nav-menu">⋮</button>
      </div>



      {/* Content */}
      <div className="browser-content">
        {!searched ? (
          <div className="search-home">
            <div className="search-logo">
              <span className="search-logo-k">K</span>
              <span className="search-logo-o">o</span>
              <span className="search-logo-o2">o</span>
              <span className="search-logo-p">p</span>
              <span className="search-logo-a">a</span>
              <span className="search-logo-s">S</span>
              <span className="search-logo-e">e</span>
              <span className="search-logo-ar">a</span>
              <span className="search-logo-rc">r</span>
              <span className="search-logo-ch">c</span>
              <span className="search-logo-h2">h</span>
            </div>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-input-wrap">
                <span className="search-icon">🔍</span>
                <input
                  className="search-input"
                  type="text"
                  placeholder="Rechercher ou saisir une URL"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="search-btns">
                <button type="submit" className="search-btn-main">Recherche KoopaSearch</button>
              </div>
            </form>
            <div className="search-langs">
              KoopaSearch proposé en : <a href="#">Français</a> · <a href="#">English</a> · <a href="#">Italiano</a>
            </div>
          </div>
        ) : activeSite ? (
          <iframe 
            src={activeSite} 
            title="Random Site" 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', background: '#fff', display: 'block' }} 
          />
        ) : (
          <div className="search-results-page">
            <div className="results-header">
              <form className="results-search-bar" onSubmit={handleSearch}>
                <div className="search-input-wrap small">
                  <span className="search-icon">🔍</span>
                  <input
                    className="search-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </form>
              <div className="results-tabs-nav">
                <span className="rtab active">Tout</span>
                <span className="rtab">Images</span>
                <span className="rtab">Vidéos</span>
                <span className="rtab">Actualités</span>
                <span className="rtab">Cartes</span>
              </div>
            </div>

            <div className="results-meta">Environ 1 420 000 000 résultats (0,47 secondes)</div>

            <div className="results-list">
              {currentResults.map((r, i) => (
                <div key={i} className="result-item">
                  <div className="result-url">{r.url}</div>
                  <a
                    className="result-title"
                    href="#"
                    onClick={(e) => handleResultClick(r, e)}
                  >
                    {r.title}
                  </a>
                  <div className="result-desc">{r.desc}</div>
                </div>
              ))}
            </div>

            <div className="results-footer-nav">
              <span className="footer-logo-small">KoopaSearch</span>
              <div className="footer-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <span 
                    key={n} 
                    className={`fpage ${n === currentPage ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentPage(n);
                      const el = document.querySelector('.browser-content');
                      if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
