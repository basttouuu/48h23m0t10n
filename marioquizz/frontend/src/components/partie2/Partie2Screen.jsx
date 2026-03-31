import { useState } from 'react';
import SpamScreen from './SpamScreen';
import HubScreen from './HubScreen';
import BarrierScreen from './BarrierScreen';

// view: 'SPAM' | 'HUB' | number (1-10)
export default function Partie2Screen({ onBack }) {
  const [view, setView] = useState('SPAM');

  if (view === 'SPAM') {
    return <SpamScreen onAccessFirewall={() => setView('HUB')} />;
  }

  if (view === 'HUB') {
    return <HubScreen onSelectBarrier={(n) => setView(n)} />;
  }

  if (typeof view === 'number') {
    return (
      <BarrierScreen
        barrierNum={view}
        onBack={() => setView('HUB')}
        onNext={(n) => setView(n)}
      />
    );
  }

  return null;
}
