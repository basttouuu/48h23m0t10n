import { useState } from 'react';
import SpamScreen from './SpamScreen';
import HubScreen from './HubScreen';
import BarrierScreen from './BarrierScreen';

// view: 'SPAM' | 'HUB' | number (1-10)
export default function Partie2Screen({ onBack }) {
  const [view, setView] = useState('SPAM');

  const backButton = (
    <button
      onClick={onBack}
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        zIndex: 99999,
        padding: '0.5rem 1rem',
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.3)',
        cursor: 'pointer',
        fontFamily: 'monospace',
        borderRadius: '4px'
      }}
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
