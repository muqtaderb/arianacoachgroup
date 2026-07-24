import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          {eyebrow && (
            <div className="text-xs uppercase tracking-[0.22em] text-brand-orange">{eyebrow}</div>
          )}
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl text-lg text-white/75">{intro}</p>}
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-4 py-16 md:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}