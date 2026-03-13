import type { FC } from 'react';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';

export const HistoryPage: FC = () => {
  useBootstrapData();
  const history = useGameStore((state) => state.history);

  return (
    <Panel title="Episode History">
      <div className="space-y-3">
        {history.map((round) => (
          <article key={round.id} className="rounded-2xl bg-[#fff6f8] p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9b516d]">Round {round.round_number}</p>
            <h3 className="text-xl font-semibold">{round.event_name}</h3>
            <p>{round.event_type} • {round.status}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
};
