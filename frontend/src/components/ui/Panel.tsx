import type { FC, ReactNode } from 'react';

export const Panel: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <section className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/82 p-5 shadow-[0_20px_60px_rgba(93,36,66,0.12)] backdrop-blur">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d97197]/60 to-transparent" />
    <h2 className="mb-4 text-lg font-semibold tracking-[0.08em] text-[#4b1f39]">{title}</h2>
    {children}
  </section>
);
