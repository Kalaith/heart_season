import type { FC } from 'react';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';

export const ResultsPage: FC = () => {
  useBootstrapData();
  const result = useGameStore(state => state.latestResult);

  return (
    <div className="space-y-4">
      <Panel title="Latest Scene">
        <p className="text-lg leading-9 text-[#4b1f39]">
          {result?.scene_text ?? 'No resolved round yet.'}
        </p>
      </Panel>
      <Panel title="Private Notes">
        <p className="leading-8 text-[#6f4b5e]">
          {result?.private_notes_text ?? 'Private analysis will appear after the first resolution.'}
        </p>
      </Panel>
      <Panel title="Public Recap">
        <p className="leading-8 text-[#6f4b5e]">
          {result?.public_recap_text ?? 'The villa has not broadcast your story yet.'}
        </p>
      </Panel>
    </div>
  );
};
