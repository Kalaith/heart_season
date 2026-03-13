import type { FC } from 'react';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';

export const ResultsPage: FC = () => {
  useBootstrapData();
  const result = useGameStore((state) => state.latestResult);

  return (
    <div className="space-y-4">
      <Panel title="Latest Scene">
        <p className="text-lg leading-8">{result?.scene_text ?? 'No resolved round yet.'}</p>
      </Panel>
      <Panel title="Private Notes">
        <p>{result?.private_notes_text ?? 'Private analysis will appear after the first resolution.'}</p>
      </Panel>
      <Panel title="Public Recap">
        <p>{result?.public_recap_text ?? 'The villa has not broadcast your story yet.'}</p>
      </Panel>
    </div>
  );
};
