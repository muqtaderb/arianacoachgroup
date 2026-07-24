import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getService, services, type ServicePlan } from "@/lib/services-data";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Service not found — ACG" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const s = loaderData.service;
    return {
      meta: [
        { title: `${s.title} — Ariana Coach Group` },
        { name: "description", content: s.tagline },
        { property: "og:title", content: `${s.title} — Ariana Coach Group` },
        { property: "og:description", content: s.tagline },
        { property: "og:url", content: `/services/${s.slug}` },
        { property: "og:type", content: "product" },
      ],
      links: [{ rel: "canonical", href: `/services/${s.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Service not found</h1>
        <p className="mt-3 text-muted-foreground">
          The service you're looking for doesn't exist.
        </p>
        <Link to="/services" className="mt-6 inline-flex text-secondary underline">
          View all services
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-full bg-primary px-5 py-2 text-primary-foreground">
          Try again
        </button>
      </div>
      <SiteFooter />
    </div>
  ),
  component: ServicePage,
});

function ServicePage() {
  const { service } = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-hero-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <Link to="/services" className="text-xs uppercase tracking-widest text-white/60 hover:text-white">
            ← All services
          </Link>
          <div className="mt-4 text-xs uppercase tracking-[0.22em] text-brand-orange">Service</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{service.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">{service.tagline}</p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-elegant"
            >
              Request an inquiry <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        {/* Overview */}
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
            <p className="mt-4 text-muted-foreground">{service.description}</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/40 p-6">
            <div className="text-xs uppercase tracking-widest text-brand-orange">What's included</div>
            <ul className="mt-4 space-y-3">
              {service.outcomes.map((o: string) => (
                <li key={o} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Choose a plan</h2>
          <p className="mt-2 text-muted-foreground">All plans include email support and a 30-day satisfaction guarantee.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {service.plans.map((plan: ServicePlan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-7 ${
                  plan.highlighted
                    ? "border-secondary bg-card shadow-elegant"
                    : "border-border bg-card shadow-soft"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-gradient px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent-foreground">
                    Most popular
                  </div>
                )}
                <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  {plan.name}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3 border-t border-border pt-6">
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                    plan.highlighted
                      ? "bg-accent-gradient text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-xs uppercase tracking-widest text-brand-orange">FAQ</div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">Common questions</h2>
            <p className="mt-3 text-muted-foreground">
              Still curious? <Link to="/contact" className="text-secondary underline">Talk to an advisor</Link>.
            </p>
          </div>
          <div className="space-y-4">
            {service.faqs.map((f: { q: string; a: string }) => (
              <details key={f.q} className="group rounded-xl border border-border bg-card p-5">
                <summary className="cursor-pointer list-none text-base font-semibold">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Related */}
        <div className="mt-20 rounded-3xl bg-hero-gradient p-10 text-white md:p-14">
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h3 className="text-2xl font-bold md:text-3xl">Not sure which plan fits?</h3>
              <p className="mt-3 text-white/75">
                Book a free 30-minute session and we'll recommend the right scope.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-elegant"
              >
                Book a Free Session <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Other services */}
        <div className="mt-16">
          <div className="text-xs uppercase tracking-widest text-brand-orange">Other services</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {services.filter((s) => s.slug !== service.slug).map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:border-secondary hover:text-foreground"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}