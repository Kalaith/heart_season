import type { FC } from 'react';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';

export const CastPage: FC = () => {
  useBootstrapData();
  const cast = useGameStore(state => state.cast);

  return (
    <Panel title="Cast">
      <div className="mb-5 max-w-2xl text-sm leading-7 text-[#6f4b5e]">
        The villa cast is small enough to study and dangerous enough to ruin your week. Learn what
        each person responds to before you gamble a whole episode on the wrong read.
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cast.map(character => (
          <article key={character.id} className="rounded-[1.5rem] border border-[#f5d6df] bg-[#fff6f8] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#b56a86]">
                  {character.archetype}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#4b1f39]">{character.name}</h3>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#8f6280]">
                Read
              </div>
            </div>
            <p className="mt-3 leading-7 text-[#6f4b5e]">{character.bio}</p>
            <div className="mt-4 rounded-2xl bg-white/80 px-4 py-4 text-sm leading-7 text-[#5d3148]">
              Reads best with <span className="font-semibold">{character.preferred_stance}</span>{' '}
              energy and <span className="font-semibold">{character.preferred_image_priority}</span>{' '}
              presentation.
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
};
