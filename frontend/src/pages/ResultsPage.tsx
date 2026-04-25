import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';
import { formatDeltaLabel, getDeltaTone, parseOutcomeData } from '../utils/gamePresentation';

export const ResultsPage: FC = () => {
  useBootstrapData();
  const result = useGameStore(state => state.latestResult);
  const outcome = result ? parseOutcomeData(result.structured_outcome_json) : null;
  const relationshipChanges = outcome
    ? Object.entries(outcome.relationship_deltas).filter(([, value]) => value !== 0)
    : [];
  const reputationChanges = outcome
    ? Object.entries(outcome.reputation_deltas).filter(
        ([key, value]) => key !== 'dominant_label' && typeof value === 'number' && value !== 0,
      ) as Array<[string, number]>
    : [];

  if (!result) {
    return (
      <Panel title="Latest Scene" kicker="No Episode Yet">
        <div className="space-y-4">
          <p className="max-w-2xl text-base leading-8 text-[#65455a]">
            The villa is holding its breath. Your first real scene lands when the current episode
            resolves.
          </p>
          <Link
            to="/plan"
            className="inline-flex rounded-full bg-[#361321] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(54,19,33,0.28)] transition hover:bg-[#4b1b2e]"
          >
            Plan My Move
          </Link>
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[2rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,250,246,0.96),rgba(255,238,243,0.92)_58%,rgba(246,214,224,0.92))] p-6 shadow-[0_28px_90px_rgba(93,31,62,0.16)] md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b26182]">
          Latest Scene
        </p>
        <h2 className='mt-3 font-["Georgia","Times_New_Roman",serif] text-4xl leading-tight text-[#331423] md:text-5xl'>
          What happened when the villa finally moved.
        </h2>
        <p className="mt-5 max-w-4xl text-lg leading-9 text-[#452032]">{result.scene_text}</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel title="What Shifted" kicker="Immediate Fallout">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {relationshipChanges.length ? (
                relationshipChanges.map(([key, value]) => (
                  <div key={key} className="rounded-[1.5rem] bg-[#fff5f8] px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                      {formatDeltaLabel(key)}
                    </p>
                    <p className={`mt-2 text-2xl font-semibold ${getDeltaTone(value)}`}>
                      {value > 0 ? '+' : ''}
                      {value}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] bg-[#fff5f8] px-4 py-4 text-sm leading-7 text-[#6b4558] md:col-span-2">
                  No visible relationship shifts were recorded from this episode.
                </div>
              )}
            </div>
            <div className="rounded-[1.5rem] bg-[#fff8ed] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bc8b47]">
                Reputation Movement
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {reputationChanges.length ? (
                  reputationChanges.map(([key, value]) => (
                    <span
                      key={key}
                      className="rounded-full bg-white px-3 py-2 text-sm font-medium text-[#53371d]"
                    >
                      {formatDeltaLabel(key)} {value > 0 ? '+' : ''}
                      {value}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-white px-3 py-2 text-sm font-medium text-[#53371d]">
                    Public perception held steady.
                  </span>
                )}
              </div>
            </div>
            {outcome?.rumor_text ? (
              <div className="rounded-[1.5rem] bg-[#f7eef4] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9d6b88]">
                  Rumor That Escaped
                </p>
                <p className="mt-2 text-sm leading-7 text-[#65455a]">{outcome.rumor_text}</p>
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel title="Villa Fallout" kicker="Who Heard About It">
          <div className="space-y-3">
            <div className="rounded-[1.5rem] bg-[#fff0f4] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                Public Recap
              </p>
              <p className="mt-2 text-sm leading-8 text-[#5f3148]">
                {result.public_recap_text ?? 'Your story has not hit the public feed yet.'}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#fff7f9] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                Private Notes
              </p>
              <p className="mt-2 text-sm leading-8 text-[#5f3148]">
                {result.private_notes_text ?? 'The villa is still deciding what your scene really meant.'}
              </p>
            </div>
            <Link
              to="/plan"
              className="inline-flex rounded-full bg-[#361321] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(54,19,33,0.28)] transition hover:bg-[#4b1b2e]"
            >
              Plan Next Episode
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
};
