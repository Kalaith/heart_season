import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentSubmission } from '../api/services/submissions';
import { resolveCurrentRoundNow } from '../api/services/rounds';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';
import { useUiStore } from '../stores/uiStore';
import {
  formatEpisodeTime,
  getCountdownLabel,
  getReputationSummary,
  getRomanceStyleSummary,
  getScandalSummary,
  getSocialStandingSummary,
} from '../utils/gamePresentation';

export const DashboardPage: FC = () => {
  const refreshData = useBootstrapData();
  const seasonState = useGameStore(state => state.seasonState);
  const message = useUiStore(state => state.message);
  const setMessage = useUiStore(state => state.setMessage);
  const [isResolvingNow, setIsResolvingNow] = useState(false);
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);

  useEffect(() => {
    const loadSubmission = async (): Promise<void> => {
      try {
        const submission = await fetchCurrentSubmission();
        setHasPlan(submission !== null);
      } catch {
        setHasPlan(null);
      }
    };

    void loadSubmission();
  }, [seasonState?.current_round.id]);

  const resolveNow = async (): Promise<void> => {
    setIsResolvingNow(true);
    try {
      await resolveCurrentRoundNow();
      await refreshData();
      setMessage('Round resolved immediately for testing.');
      setHasPlan(false);
    } catch {
      setMessage('Unable to resolve the current round right now.');
    } finally {
      setIsResolvingNow(false);
    }
  };

  const villaFeed = useMemo(() => {
    if (!seasonState) {
      return [];
    }

    const featuredNames = seasonState.featured_cast.slice(0, 3).map(character => character.name);

    return [
      seasonState.recent_rumors[0]?.rumor_text ?? 'No one has slipped yet, but the villa is waiting for a crack.',
      featuredNames.length
        ? `${featuredNames[0]} and ${featuredNames[1] ?? featuredNames[0]} are drawing the room's attention.`
        : 'The villa cast is still warming up.',
      seasonState.player_reputation.dominant_label
        ? `Your current villa read is ${seasonState.player_reputation.dominant_label}. People are starting to file you under it.`
        : 'Your public identity is still forming. Tonight can change that fast.',
    ];
  }, [seasonState]);

  if (!seasonState) {
    return (
      <Panel title="Tonight" kicker="Current Episode">
        <p className="max-w-2xl text-sm leading-7 text-[#6f4b5e]">
          {message ?? 'The villa is getting camera-ready. Pulling in the current episode now.'}
        </p>
      </Panel>
    );
  }

  const primaryActionHref = hasPlan ? '/results' : '/plan';
  const primaryActionLabel = hasPlan ? 'Review My Last Scene' : 'Plan My Move';
  const primaryActionHint = hasPlan
    ? 'Your plan is in. Use the time left to watch the room and wait for fallout.'
    : 'You have not locked anything in yet. That is the only thing that matters right now.';

  const reputation = seasonState.player_reputation;
  const currentRound = seasonState.current_round;

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,249,245,0.96),rgba(255,231,237,0.9)_56%,rgba(245,211,223,0.94))] p-6 shadow-[0_30px_100px_rgba(94,31,62,0.18)] md:p-8">
        <div className="pointer-events-none absolute -left-8 bottom-0 h-44 w-44 rounded-full bg-[#ffd2de]/80 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#fff0c7]/80 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/76 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#af5f80]">
                Tonight's Episode
              </span>
              <span className="rounded-full bg-[#3a1726] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-white">
                {currentRound.status === 'open' ? 'Open now' : currentRound.status}
              </span>
            </div>
            <div>
              <h2 className='font-["Georgia","Times_New_Roman",serif] text-4xl leading-tight text-[#331423] md:text-6xl'>
                {currentRound.event_name}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-8 text-[#664154]">
                {currentRound.event_type} episode. The room is soft, public, and very easy to misread.
                One strong move can open a romance. One sloppy move can become villa gossip before the
                night is over.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] bg-white/80 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                  Time Remaining
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#441a30]">
                  {getCountdownLabel(currentRound.locks_at)}
                </p>
                <p className="mt-1 text-sm text-[#7a5768]">{formatEpisodeTime(currentRound.locks_at)}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/80 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                  Your Status
                </p>
                <p className="mt-2 text-xl font-semibold text-[#441a30]">
                  {hasPlan ? 'Plan locked in' : 'Plan not submitted'}
                </p>
                <p className="mt-1 text-sm text-[#7a5768]">{primaryActionHint}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/80 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                  Recommended Next
                </p>
                <p className="mt-2 text-xl font-semibold text-[#441a30]">{primaryActionLabel}</p>
                <p className="mt-1 text-sm text-[#7a5768]">
                  {hasPlan ? 'Watch the villa and prepare for fallout.' : 'Guide your heroine before the doors close.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={primaryActionHref}
                className="rounded-full bg-[#361321] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(54,19,33,0.28)] transition hover:bg-[#4b1b2e]"
              >
                {primaryActionLabel}
              </Link>
              <button
                className="rounded-full border border-[#d8a0b4] bg-white/75 px-5 py-3 text-sm font-medium text-[#7a3555] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => void resolveNow()}
                disabled={isResolvingNow || currentRound.status !== 'open'}
              >
                {isResolvingNow ? 'Resolving...' : 'Resolve Now'}
              </button>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#aa5b7d]">
                Test control
              </p>
            </div>
          </div>
          <aside className="rounded-[1.8rem] border border-white/70 bg-white/72 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#b26182]">
              Villa Feed
            </p>
            <div className="mt-4 space-y-3">
              {villaFeed.map(item => (
                <article key={item} className="rounded-[1.4rem] bg-[#fff5f7] px-4 py-4">
                  <p className="text-sm leading-7 text-[#5f3148]">{item}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr_0.9fr]">
        <Panel title="Your Position" kicker="How the Villa Sees You">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] bg-[#fff5f8] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                  Reputation
                </p>
                <p className="mt-2 text-xl font-semibold text-[#441a30]">
                  {getReputationSummary(reputation)}
                </p>
              </div>
              <div className="rounded-[1.4rem] bg-[#fff8ed] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bc8b47]">
                  Scandal Heat
                </p>
                <p className="mt-2 text-xl font-semibold text-[#53371d]">
                  {getScandalSummary(reputation)}
                </p>
              </div>
            </div>
            <div className="rounded-[1.4rem] bg-[#f8eff5] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9d6b88]">
                Romance Style
              </p>
              <p className="mt-2 text-base font-semibold text-[#48243a]">
                {getRomanceStyleSummary(reputation)}
              </p>
              <p className="mt-1 text-sm leading-7 text-[#6c4658]">
                Social standing: {getSocialStandingSummary(reputation)}.
              </p>
            </div>
          </div>
        </Panel>

        <Panel title="Most Relevant Hearts" kicker="Who Matters Tonight">
          <div className="grid gap-3 md:grid-cols-2">
            {seasonState.featured_cast.length ? (
              seasonState.featured_cast.slice(0, 4).map(character => (
                <article
                  key={character.id}
                  className="rounded-[1.45rem] border border-[#f1d2dc] bg-[#fff7f9] p-4"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                    {character.archetype}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#441a30]">{character.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6e495c]">{character.bio}</p>
                </article>
              ))
            ) : (
              <div className="rounded-[1.45rem] bg-[#fff7f9] p-5 text-sm leading-7 text-[#6e495c] md:col-span-2">
                The villa cast is still settling in. Once they appear, this panel will surface the
                people most likely to complicate your night.
              </div>
            )}
          </div>
        </Panel>

        <Panel title="What to Watch" kicker="Shared World Pressure">
          <div className="space-y-3">
            <article className="rounded-[1.4rem] bg-[#fff0f4] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                Trending Pairing
              </p>
              <p className="mt-2 text-base font-semibold text-[#441a30]">
                {seasonState.featured_cast[0]
                  ? `${seasonState.featured_cast[0].name} is drawing the room's attention`
                  : 'The room is still deciding who to watch'}
              </p>
            </article>
            <article className="rounded-[1.4rem] bg-[#fff8ed] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bc8b47]">
                Social Alert
              </p>
              <p className="mt-2 text-sm leading-7 text-[#6c4b31]">
                Public scenes carry more risk than private ones tonight. If you want sincerity, move
                carefully. If you want headlines, this is a good room for it.
              </p>
            </article>
            {message ? (
              <article className="rounded-[1.4rem] bg-[#f7eef4] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9d6b88]">
                  House Note
                </p>
                <p className="mt-2 text-sm leading-7 text-[#65455a]">{message}</p>
              </article>
            ) : null}
          </div>
        </Panel>
      </div>
    </div>
  );
};
