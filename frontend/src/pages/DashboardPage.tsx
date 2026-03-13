import type { FC } from 'react';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';

export const DashboardPage: FC = () => {
  useBootstrapData();
  const seasonState = useGameStore(state => state.seasonState);
  const message = useUiStore(state => state.message);
  const reputation = seasonState?.player_reputation;
  const topStats = reputation
    ? [
        { label: 'Public Image', value: reputation.public_image },
        { label: 'Drama', value: reputation.drama },
        { label: 'Elegance', value: reputation.elegance },
        { label: 'Sincerity', value: reputation.sincerity },
      ]
    : [];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
      <Panel title="Current Round">
        {seasonState ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#9b516d]">
              <span className="rounded-full bg-[#fff0f4] px-3 py-1">{seasonState.season.name}</span>
              <span className="rounded-full bg-[#fff7ea] px-3 py-1">{seasonState.season.theme}</span>
              <span className="rounded-full bg-[#f7edf5] px-3 py-1">{seasonState.season.status}</span>
            </div>
            <div>
              <h3 className="text-3xl font-semibold leading-tight text-[#401a31] md:text-4xl">
                {seasonState.current_round.event_name}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6f4b5e] md:text-base">
                {seasonState.current_round.event_type} episode. Plans lock at{' '}
                {seasonState.current_round.locks_at}.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#fff6f8] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#b56a86]">Round</p>
                <p className="mt-2 text-2xl font-semibold text-[#4b1f39]">
                  {seasonState.current_round.round_number}
                </p>
              </div>
              <div className="rounded-2xl bg-[#fff7ea] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#b58443]">Status</p>
                <p className="mt-2 text-lg font-semibold capitalize text-[#59401f]">
                  {seasonState.current_round.status}
                </p>
              </div>
              <div className="rounded-2xl bg-[#f7edf5] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#8f6280]">Open Window</p>
                <p className="mt-2 text-sm font-medium leading-6 text-[#58364a]">
                  {seasonState.current_round.opens_at}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-7 text-[#6f4b5e]">{message ?? 'Loading season state...'}</p>
        )}
      </Panel>
      <Panel title="Reputation">
        {reputation ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            {topStats.map(stat => (
              <div key={stat.label} className="rounded-2xl bg-[#fff6f8] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#b56a86]">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#4b1f39]">{stat.value}</p>
              </div>
            ))}
            <div className="col-span-2 rounded-2xl bg-[#34182f] px-4 py-4 text-white">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#f3c2d4]">Current Label</p>
              <p className="mt-2 text-lg font-semibold">{reputation.dominant_label ?? 'Unreadable'}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-7 text-[#6f4b5e]">Reputation will appear here once authenticated.</p>
        )}
      </Panel>
      <Panel title="Featured Cast">
        <div className="grid gap-3 md:grid-cols-2">
          {seasonState?.featured_cast.map(character => (
            <article key={character.id} className="rounded-[1.5rem] border border-[#f5d6df] bg-[#fff6f8] p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#b56a86]">
                {character.archetype}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[#4b1f39]">{character.name}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6f4b5e]">{character.bio}</p>
            </article>
          ))}
        </div>
      </Panel>
      <Panel title="Rumor Feed">
        <div className="space-y-3 text-sm">
          {seasonState?.recent_rumors.length ? (
            seasonState.recent_rumors.map(rumor => (
              <article key={rumor.id} className="rounded-2xl border border-[#f4cfdb] bg-[#fff0f4] px-4 py-4">
                <p className="leading-7 text-[#5d2f46]">{rumor.rumor_text}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#b56a86]">
                  {rumor.created_at}
                </p>
              </article>
            ))
          ) : (
            <p className="text-sm leading-7 text-[#6f4b5e]">No rumors yet. That will not last.</p>
          )}
        </div>
      </Panel>
    </div>
  );
};
