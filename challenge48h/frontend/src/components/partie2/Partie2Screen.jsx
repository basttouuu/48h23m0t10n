import { useState } from 'react';
import SpamScreen from './SpamScreen';
import HubScreen from './HubScreen';
import BarrierScreen from './BarrierScreen';

// view: 'SPAM' | 'HUB' | number (1-10)
export default function Partie2Screen({ onBack }) {
  const [view, setView] = useState('SPAM');

  const backButton = (
    <button
      className="back-nav-btn"
      onClick={onBack}
    >
      &lt; Retour Navigateur
    </button>
  );

  if (view === 'SPAM') {
    return (
      <>
        {backButton}
        <SpamScreen onAccessFirewall={() => setView('HUB')} />
      </>
    );
  }

  if (view === 'HUB') {
    return (
      <>
        {backButton}
        <HubScreen onSelectBarrier={(n) => setView(n)} />
      </>
    );
  }

  if (typeof view === 'number') {
    return (
      <>
        {backButton}
        <BarrierScreen
          barrierNum={view}
          onBack={() => setView('HUB')}
          onNext={(n) => setView(n)}
        />
      </>
    );
  }

  return null;
}
