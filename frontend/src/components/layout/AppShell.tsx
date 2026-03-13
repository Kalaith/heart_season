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
  const loginUrl = useAuthStore((state) => state.loginUrl);

  return (
    <div className="min-h-screen px-4 py-6 text-[#34182f]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#9b516d]">Heart Season</p>
              <h1 className="text-4xl font-semibold">Villa politics, romance math, shared rounds.</h1>
            </div>
            <nav className="flex flex-wrap gap-2 text-sm">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 ${isActive ? 'bg-[#34182f] text-white' : 'bg-white/80 text-[#6f3552]'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
          {loginUrl ? (
            <p className="mt-4 rounded-xl bg-[#fff0f4] px-4 py-3 text-sm">
              Authentication required. Use the shared login: <a className="underline" href={loginUrl}>{loginUrl}</a>
            </p>
          ) : null}
        </header>
        {children}
      </div>
    </div>
  );
};
