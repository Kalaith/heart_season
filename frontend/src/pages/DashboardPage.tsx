import type { FC } from 'react';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';

export const DashboardPage: FC = () => {
  useBootstrapData();
  const seasonState = useGameStore((state) => state.seasonState);
  const message = useUiStore((state) => state.message);

  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
      <Panel title="Current Round">
        {seasonState ? (
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9b516d]">{seasonState.season.name}</p>
            <h3 className="text-3xl font-semibold">{seasonState.current_round.event_name}</h3>
            <p>{seasonState.current_round.event_type} event. Lock time: {seasonState.current_round.locks_at}</p>
          </div>
        ) : (
          <p>{message ?? 'Loading season state...'}</p>
        )}
      </Panel>
      <Panel title="Reputation">
        {seasonState?.player_reputation ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p>Public Image: {seasonState.player_reputation.public_image}</p>
            <p>Drama: {seasonState.player_reputation.drama}</p>
            <p>Elegance: {seasonState.player_reputation.elegance}</p>
            <p>Sincerity: {seasonState.player_reputation.sincerity}</p>
          </div>
        ) : (
          <p>Reputation will appear here once authenticated.</p>
        )}
      </Panel>
      <Panel title="Featured Cast">
        <div className="grid gap-3 md:grid-cols-2">
          {seasonState?.featured_cast.map((character) => (
            <article key={character.id} className="rounded-2xl bg-[#fff6f8] p-4">
              <h3 className="text-xl font-semibold">{character.name}</h3>
              <p className="text-sm uppercase tracking-[0.2em] text-[#9b516d]">{character.archetype}</p>
              <p className="mt-2 text-sm">{character.bio}</p>
            </article>
          ))}
        </div>
      </Panel>
      <Panel title="Rumor Feed">
        <div className="space-y-2 text-sm">
          {seasonState?.recent_rumors.length ? (
            seasonState.recent_rumors.map((rumor) => (
              <p key={rumor.id} className="rounded-xl bg-[#fff0f4] px-3 py-2">{rumor.rumor_text}</p>
            ))
          ) : (
            <p>No rumors yet. That will not last.</p>
          )}
        </div>
      </Panel>
    </div>
  );
};
