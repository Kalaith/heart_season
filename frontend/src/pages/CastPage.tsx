import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';
import {
  getInitials,
  getMomentumLine,
  getPreferenceLine,
  getPortraitGradient,
  getTurnOffLine,
} from '../utils/gamePresentation';

export const CastPage: FC = () => {
  useBootstrapData();
  const cast = useGameStore(state => state.cast);

  return (
    <Panel title="Cast" kicker="Hearts, Rivals, Trouble">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <p className="max-w-3xl text-sm leading-7 text-[#6b4558]">
          Read the room before you walk into it. Each person in the villa responds to a different
          kind of attention, and each one becomes dangerous in a different way.
        </p>
        <Link
          to="/plan"
          className="inline-flex rounded-full bg-[#361321] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(54,19,33,0.28)] transition hover:bg-[#4b1b2e]"
        >
          Choose for Tonight
        </Link>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cast.length ? (
          cast.map(character => (
            <article
              key={character.id}
              className="rounded-[1.7rem] border border-[#f0d5de] bg-[#fff8fa] p-5 shadow-[0_16px_50px_rgba(108,43,74,0.08)]"
            >
              <div className="flex items-start gap-4">
                <div className={`h-24 w-20 shrink-0 overflow-hidden rounded-[1.4rem] bg-gradient-to-br ${getPortraitGradient(character)} p-2 shadow-inner`}>
                  <div className="flex h-full w-full items-end justify-center rounded-[1rem] border border-white/60 bg-white/30 pb-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-base font-semibold text-[#6d3450]">
                      {getInitials(character.name)}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b26182]">
                    {character.archetype}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-[#431d33]">{character.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#6b4558]">{character.bio}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#fff0f4] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a65375]">
                    Prefers {character.preferred_stance}
                  </span>
                  <span className="rounded-full bg-[#fff8ed] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#af7d3d]">
                    Likes {character.preferred_image_priority}
                  </span>
                </div>
                <div className="rounded-[1.3rem] bg-white px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b26182]">
                    Best With
                  </p>
                  <p className="mt-2 leading-7 text-[#5d3148]">{getPreferenceLine(character)}</p>
                </div>
                <div className="rounded-[1.3rem] bg-[#fff3f6] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b26182]">
                    Watch Out For
                  </p>
                  <p className="mt-2 leading-7 text-[#5d3148]">{getTurnOffLine(character)}</p>
                </div>
                <div className="rounded-[1.3rem] bg-[#fff8ed] px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#bc8b47]">
                    Relationship Cue
                  </p>
                  <p className="mt-2 leading-7 text-[#624229]">{getMomentumLine(character)}</p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.7rem] bg-[#fff7f9] p-6 text-sm leading-7 text-[#6b4558] md:col-span-2 xl:col-span-3">
            The villa cast has not appeared yet. Once the season is live, this page becomes the map
            of who wants what and who is most likely to break your night.
          </div>
        )}
      </div>
    </Panel>
  );
};
