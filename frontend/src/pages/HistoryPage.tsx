import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';
import { formatEpisodeTime } from '../utils/gamePresentation';

export const HistoryPage: FC = () => {
  useBootstrapData();
  const history = useGameStore(state => state.history);

  return (
    <Panel title="Episode Archive" kicker="Season Recap">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <p className="max-w-3xl text-sm leading-7 text-[#6b4558]">
          Think of this as the season's highlight reel. Every episode leaves a social bruise, a
          romantic opening, or a public mess behind it.
        </p>
        <Link
          to="/results"
          className="inline-flex rounded-full bg-[#361321] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(54,19,33,0.28)] transition hover:bg-[#4b1b2e]"
        >
          Revisit Latest Scene
        </Link>
      </div>
      <div className="mt-5 space-y-4">
        {history.length ? (
          history.map(round => (
            <article
              key={round.id}
              className="rounded-[1.8rem] border border-[#f0d5de] bg-[linear-gradient(135deg,#fff8fa,#fff2f5)] p-5 shadow-[0_14px_36px_rgba(110,43,76,0.08)]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                    Episode {round.round_number}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#431d33]">{round.event_name}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6b4558]">
                    {round.event_type} episode. The room was in a {round.status} state.
                  </p>
                </div>
                <div className="rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a5771]">
                  {round.status}
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[1.3rem] bg-white px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b26182]">
                    Opened
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#5d3148]">{formatEpisodeTime(round.opens_at)}</p>
                </div>
                <div className="rounded-[1.3rem] bg-white px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b26182]">
                    Locked
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#5d3148]">{formatEpisodeTime(round.locks_at)}</p>
                </div>
                <div className="rounded-[1.3rem] bg-white px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b26182]">
                    Resolved
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#5d3148]">
                    {round.resolved_at ? formatEpisodeTime(round.resolved_at) : 'Still pending'}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.8rem] bg-[#fff7f9] p-6 text-sm leading-7 text-[#6b4558]">
            No episodes have landed yet. Once the season starts moving, this becomes your running
            archive of highs, heartbreaks, and public mistakes.
          </div>
        )}
      </div>
    </Panel>
  );
};
