import type { FC } from 'react';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';

export const ProfilePage: FC = () => {
  useBootstrapData();
  const reputation = useGameStore((state) => state.reputation);

  return (
    <Panel title="Profile">
      {reputation ? (
        <div className="grid gap-3 md:grid-cols-2">
          <p>Public Image: {reputation.public_image}</p>
          <p>Drama: {reputation.drama}</p>
          <p>Elegance: {reputation.elegance}</p>
          <p>Sincerity: {reputation.sincerity}</p>
          <p>Reliability: {reputation.reliability}</p>
          <p>Scandal: {reputation.scandal}</p>
          <p className="md:col-span-2">Current Label: {reputation.dominant_label ?? 'Unreadable'}</p>
        </div>
      ) : (
        <p>Reputation data will appear once the API responds.</p>
      )}
    </Panel>
  );
};
