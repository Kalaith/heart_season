import type { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/plan', label: 'Plan' },
  { to: '/results', label: 'Results' },
  { to: '/history', label: 'History' },
  { to: '/cast', label: 'Cast' },
  { to: '/profile', label: 'Profile' },
];

export const AppShell: FC<{ children: ReactNode }> = ({ children }) => {
  const loginUrl = useAuthStore(state => state.loginUrl);

  return (
    <div className="min-h-screen overflow-x-hidden px-4 py-6 text-[#34182f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="relative mb-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/76 px-6 py-7 shadow-[0_24px_80px_rgba(108,41,73,0.16)] backdrop-blur md:px-8">
          <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-[#ffd1dd]/70 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-8 h-48 w-48 rounded-full bg-[#ffe9b9]/55 blur-3xl" />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.45em] text-[#9b516d]">Heart Season</p>
                <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
                  Romance under surveillance, strategy in silk gloves.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6c4257] md:text-base">
                  Build chemistry, dodge scandal, and survive each shared episode with your image
                  intact long enough to find something real.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-[#6c4257] sm:w-fit">
                <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#b56a86]">Format</p>
                  <p className="mt-1 font-medium text-[#4b1f39]">Shared async rounds</p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#b56a86]">Pressure</p>
                  <p className="mt-1 font-medium text-[#4b1f39]">Rumors, rivals, recouplings</p>
                </div>
              </div>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm">
              {links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    [
                      'rounded-full border px-4 py-2.5 transition-colors',
                      isActive
                        ? 'border-[#34182f] bg-[#34182f] text-white shadow-[0_12px_25px_rgba(52,24,47,0.24)]'
                        : 'border-white/70 bg-white/80 text-[#6f3552] hover:border-[#d9a2b7] hover:bg-[#fff5f8]',
                    ].join(' ')
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
          {loginUrl ? (
            <p className="relative mt-6 rounded-2xl border border-[#f2c7d5] bg-[#fff0f4] px-4 py-3 text-sm leading-6 text-[#6b2d4d]">
              Authentication required. Use the shared login:{' '}
              <a className="font-medium underline decoration-[#d97197] underline-offset-4" href={loginUrl}>
                {loginUrl}
              </a>
            </p>
          ) : null}
        </header>
        <main className="pb-8">{children}</main>
      </div>
    </div>
  );
};
