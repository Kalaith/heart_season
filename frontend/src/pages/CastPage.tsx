import type { FC } from 'react';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';

export const CastPage: FC = () => {
  useBootstrapData();
  const cast = useGameStore((state) => state.cast);

  return (
    <Panel title="Cast">
      <div className="grid gap-4 md:grid-cols-2">
        {cast.map((character) => (
          <article key={character.id} className="rounded-2xl bg-[#fff6f8] p-4">
            <h3 className="text-2xl font-semibold">{character.name}</h3>
            <p className="text-sm uppercase tracking-[0.2em] text-[#9b516d]">{character.archetype}</p>
            <p className="mt-2">{character.bio}</p>
            <p className="mt-3 text-sm">Reads best with {character.preferred_stance} energy and {character.preferred_image_priority} presentation.</p>
          </article>
        ))}
      </div>
    </Panel>
  );
};
