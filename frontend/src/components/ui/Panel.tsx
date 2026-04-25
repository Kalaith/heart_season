import type { FC, ReactNode } from 'react';

export const Panel: FC<{ title: string; children: ReactNode; kicker?: string }> = ({
  title,
  children,
  kicker,
}) => (
  <section className="relative overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/82 p-5 shadow-[0_28px_80px_rgba(105,39,72,0.12)] backdrop-blur md:p-6">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dd7c9f]/70 to-transparent" />
    {kicker ? (
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b45f81]">
        {kicker}
      </p>
    ) : null}
    <h2 className='mb-4 font-["Georgia","Times_New_Roman",serif] text-[1.7rem] leading-none text-[#431d33] md:text-[1.9rem]'>
      {title}
    </h2>
    {children}
  </section>
);
