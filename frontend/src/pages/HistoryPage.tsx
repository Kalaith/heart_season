import type { FC } from 'react';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';

export const HistoryPage: FC = () => {
  useBootstrapData();
  const history = useGameStore(state => state.history);

  return (
    <Panel title="Episode History">
      <div className="mb-5 max-w-2xl text-sm leading-7 text-[#6f4b5e]">
        Every round leaves a public record. Some entries read like romance. Others read like the
        first chapter of a disaster.
      </div>
      <div className="space-y-3">
        {history.map(round => (
          <article key={round.id} className="rounded-[1.5rem] border border-[#f5d6df] bg-[#fff6f8] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#b56a86]">
                  Round {round.round_number}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#4b1f39]">{round.event_name}</h3>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#8f6280]">
                {round.status}
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#6f4b5e]">{round.event_type}</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5d3148] sm:grid-cols-2">
              <div className="rounded-2xl bg-white/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#b56a86]">Opened</p>
                <p className="mt-1">{round.opens_at}</p>
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#b56a86]">Resolved</p>
                <p className="mt-1">{round.resolved_at ?? 'Still pending'}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
};
