import type { FC } from 'react';
import { Panel } from '../components/ui/Panel';
import { useBootstrapData } from '../hooks/useBootstrapData';
import { useGameStore } from '../stores/gameStore';

export const ProfilePage: FC = () => {
  useBootstrapData();
  const reputation = useGameStore(state => state.reputation);
  const stats = reputation
    ? [
        { label: 'Public Image', value: reputation.public_image, tone: 'bg-[#fff6f8] text-[#4b1f39]' },
        { label: 'Drama', value: reputation.drama, tone: 'bg-[#fff0f4] text-[#4b1f39]' },
        { label: 'Elegance', value: reputation.elegance, tone: 'bg-[#fff7ea] text-[#59401f]' },
        { label: 'Sincerity', value: reputation.sincerity, tone: 'bg-[#f8f1ff] text-[#4d3362]' },
        { label: 'Reliability', value: reputation.reliability, tone: 'bg-[#eef8f5] text-[#2d5a4f]' },
        { label: 'Scandal', value: reputation.scandal, tone: 'bg-[#34182f] text-white' },
      ]
    : [];

  return (
    <Panel title="Profile">
      {reputation ? (
        <div className="space-y-5">
          <div className="rounded-[1.5rem] bg-[#fff6f8] px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#b56a86]">Current Label</p>
            <p className="mt-2 text-2xl font-semibold text-[#4b1f39]">
              {reputation.dominant_label ?? 'Unreadable'}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stats.map(stat => (
              <div key={stat.label} className={`rounded-[1.5rem] px-4 py-4 ${stat.tone}`}>
                <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm leading-7 text-[#6f4b5e]">
          Reputation data will appear once the API responds.
        </p>
      )}
    </Panel>
  );
};
