import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';
import {
  getReputationSummary,
  getRomanceStyleSummary,
  getScandalSummary,
  getSocialStandingSummary,
} from '../utils/gamePresentation';

export const ProfilePage: FC = () => {
  useBootstrapData();
  const reputation = useGameStore(state => state.reputation);

  if (!reputation) {
    return (
      <Panel title="Profile" kicker="Villa Identity">
        <p className="max-w-2xl text-sm leading-7 text-[#6b4558]">
          Your public identity takes shape once the villa starts reacting to you. One clean episode
          can make you admired. One messy one can make you unforgettable for the wrong reasons.
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[2rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,249,245,0.96),rgba(255,236,241,0.92)_58%,rgba(246,214,224,0.92))] p-6 shadow-[0_28px_90px_rgba(93,31,62,0.15)] md:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b26182]">
          Villa Identity
        </p>
        <h2 className='mt-3 font-["Georgia","Times_New_Roman",serif] text-4xl leading-tight text-[#331423] md:text-5xl'>
          {reputation.dominant_label ?? 'Keeping Them Guessing'}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#664154]">
          This is the shape your story is taking in public. It is not permanent, but people are
          already starting to believe it.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Reputation" kicker="How You Read">
          <div className="space-y-3">
            <div className="rounded-[1.4rem] bg-[#fff5f8] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                Public Image
              </p>
              <p className="mt-2 text-xl font-semibold text-[#431d33]">{getReputationSummary(reputation)}</p>
              <p className="mt-2 text-sm text-[#6b4558]">Score: {reputation.public_image}</p>
            </div>
            <div className="rounded-[1.4rem] bg-[#f7eef4] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9d6b88]">
                Social Standing
              </p>
              <p className="mt-2 text-xl font-semibold text-[#48243a]">{getSocialStandingSummary(reputation)}</p>
              <p className="mt-2 text-sm text-[#65455a]">Reliability score: {reputation.reliability}</p>
            </div>
          </div>
        </Panel>

        <Panel title="Romance Style" kicker="How You Tend to Play">
          <div className="space-y-3">
            <div className="rounded-[1.4rem] bg-[#fff8ed] px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#bc8b47]">
                Style
              </p>
              <p className="mt-2 text-xl font-semibold text-[#53371d]">{getRomanceStyleSummary(reputation)}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.4rem] bg-white px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                  Elegance
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#431d33]">{reputation.elegance}</p>
              </div>
              <div className="rounded-[1.4rem] bg-white px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                  Sincerity
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#431d33]">{reputation.sincerity}</p>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Scandal Heat" kicker="How Risky Your Story Feels">
          <div className="space-y-3">
            <div className="rounded-[1.4rem] bg-[#361321] px-4 py-4 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f5c5d5]">
                Current Heat
              </p>
              <p className="mt-2 text-xl font-semibold">{getScandalSummary(reputation)}</p>
              <p className="mt-2 text-sm text-[#f0d7df]">Scandal score: {reputation.scandal}</p>
            </div>
            <div className="rounded-[1.4rem] bg-[#fff0f4] px-4 py-4">
              <p className="text-sm leading-7 text-[#5d3148]">
                Drama score: {reputation.drama}. If this keeps climbing, the villa starts watching
                you even when you are not trying to perform.
              </p>
            </div>
          </div>
        </Panel>

        <Panel title="Next Move" kicker="Use This Wisely">
          <div className="space-y-4">
            <p className="text-sm leading-7 text-[#6b4558]">
              Your profile tells you what kind of player the villa thinks you are. If you want to
              reinforce that, lean into it. If you want to break it, tonight is the place to do it.
            </p>
            <Link
              to="/plan"
              className="inline-flex rounded-full bg-[#361321] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(54,19,33,0.28)] transition hover:bg-[#4b1b2e]"
            >
              Shape Tonight's Read
            </Link>
          </div>
        </Panel>
      </div>
    </div>
  );
};
