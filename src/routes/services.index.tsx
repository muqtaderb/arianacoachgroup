import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { services } from "@/lib/services-data";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Ariana Coach Group" },
      {
        name: "description",
        content:
          "Eight ACG services: social media, web & app development, call center, financial management, HR coaching, training, incubation, and investment.",
      },
      { property: "og:title", content: "Services — Ariana Coach Group" },
      { property: "og:description", content: "Explore all ACG services and pricing plans." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <PageShell
      eyebrow="Our Services"
      title="Everything you need to grow"
      intro="Eight practice areas, one partner. Every service has Basic, Pro, and Premium plans — pick a tier or talk to us about a custom scope."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.slug}
            to="/services/$slug"
            params={{ slug: s.slug }}
            className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="text-xs uppercase tracking-widest text-brand-orange">Service</div>
            <h3 className="mt-2 text-xl font-bold tracking-tight">{s.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.tagline}</p>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="text-muted-foreground">From {s.plans[0].price}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}