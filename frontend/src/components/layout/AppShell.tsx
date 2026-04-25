import type { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const links = [
  { to: '/', label: 'Tonight' },
  { to: '/plan', label: 'Plan' },
  { to: '/results', label: 'Latest Scene' },
  { to: '/history', label: 'Archive' },
  { to: '/cast', label: 'Cast' },
  { to: '/profile', label: 'Profile' },
];

export const AppShell: FC<{ children: ReactNode }> = ({ children }) => {
  const loginUrl = useAuthStore(state => state.loginUrl);

  return (
    <div className="min-h-screen overflow-x-hidden px-4 py-5 text-[#34182f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="relative mb-6 overflow-hidden rounded-[2.3rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,249,245,0.95),rgba(255,231,237,0.88)_60%,rgba(246,212,223,0.9))] px-6 py-6 shadow-[0_30px_100px_rgba(103,32,67,0.18)] backdrop-blur md:px-8 md:py-8">
          <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-[#ffcfdc]/80 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-5 h-52 w-52 rounded-full bg-[#ffefbf]/70 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#aa5778]">
                  Heart Season
                </p>
                <h1 className='mt-3 max-w-3xl font-["Georgia","Times_New_Roman",serif] text-4xl leading-tight text-[#331423] md:text-6xl'>
                  Enter the episode knowing exactly who you want, what you want, and what it might cost.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6c4457] md:text-base">
                  A shared romance simulation about chemistry, image, gossip, and the dangerous art
                  of making a move in public.
                </p>
              </div>
              <nav className="flex flex-wrap gap-2.5 text-sm">
                {links.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      [
                        'rounded-full border px-4 py-2.5 font-medium transition-all',
                        isActive
                          ? 'border-[#371523] bg-[#371523] text-white shadow-[0_14px_30px_rgba(55,21,35,0.26)]'
                          : 'border-white/80 bg-white/82 text-[#6a3752] hover:border-[#d99ab2] hover:bg-[#fff7f9]',
                      ].join(' ')
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-[1.7rem] border border-white/70 bg-white/74 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b26182]">
                  Core Loop
                </p>
                <p className="mt-2 text-sm leading-7 text-[#5f3248]">
                  Pick a direction, lock it in, then read how the villa twists it.
                </p>
              </div>
              <div className="rounded-[1.7rem] border border-white/70 bg-white/74 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b26182]">
                  Shared Pressure
                </p>
                <p className="mt-2 text-sm leading-7 text-[#5f3248]">
                  Other players are chasing hearts, starting rumors, and shifting the room around you.
                </p>
              </div>
            </div>
          </div>
          {loginUrl ? (
            <div className="relative mt-6 rounded-[1.5rem] border border-[#f0c6d6] bg-white/70 px-4 py-4 text-sm leading-7 text-[#6a3450]">
              Authentication required. Use the shared login:{' '}
              <a className="font-semibold underline decoration-[#d97197] underline-offset-4" href={loginUrl}>
                {loginUrl}
              </a>
            </div>
          ) : null}
        </header>
        <main className="pb-10">{children}</main>
      </div>
    </div>
  );
};
