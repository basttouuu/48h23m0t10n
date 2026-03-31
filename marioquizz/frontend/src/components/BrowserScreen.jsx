import './BrowserScreen.css';
import { useState } from 'react';
import { FAKE_RESULTS, REAL_RESULTS, shuffle } from '../data/searchResults';

export default function BrowserScreen({ onEnterGame }) {
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [urlBar, setUrlBar] = useState('koopa://newtab');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const mixed = shuffle([...REAL_RESULTS, ...shuffle(FAKE_RESULTS).slice(0, 6)]);
    setResults(mixed);
    setSearched(true);
    setUrlBar(`koopasearch.biz/search?q=${encodeURIComponent(query)}`);
  };

  const handleResultClick = (result, e) => {
    if (result.real) return;
    e.preventDefault();
  };

  const handleReset = () => {
    setSearched(false);
    setQuery('');
    setUrlBar('koopa://newtab');
  };

  return (
    <div className="browser-window">
      {/* Titlebar */}
      <div className="browser-titlebar">
        <div className="browser-dots">
          <span className="dot dot-red" />
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
          <button className="nav-btn" disabled>←</button>
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
                <button type="button" className="search-btn-secondary" onClick={onEnterGame}>
                  🎮 J&apos;ai de la chance
                </button>
              </div>
            </form>
            <div className="search-langs">
              KoopaSearch proposé en : <a href="#">Français</a> · <a href="#">English</a> · <a href="#">Italiano</a>
            </div>
          </div>
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
              {results.map((r, i) => (
                <div key={i} className={`result-item ${r.real ? 'result-real' : ''}`}>
                  <div className="result-url">{r.url}</div>
                  <a
                    className="result-title"
                    href={r.real ? r.url : '#'}
                    target={r.real ? '_blank' : undefined}
                    rel={r.real ? 'noopener noreferrer' : undefined}
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
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={`fpage ${n === 1 ? 'active' : ''}`}>{n}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
