import type { FC, ReactNode } from 'react';

export const Panel: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <section className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-md backdrop-blur">
    <h2 className="mb-4 text-lg font-semibold">{title}</h2>
    {children}
  </section>
);
