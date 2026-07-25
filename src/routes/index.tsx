import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, TrendingUp, Users2, Globe2, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { services } from "@/lib/services-data";
const logo = { url: "/images/acg-logo.jpg" };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ariana Coach Group — Coaching, Consulting & Innovation" },
      {
        name: "description",
        content:
          "ACG empowers businesses across Afghanistan and the region with coaching, consulting, training, and investment. Book a free consulting session.",
      },
      { property: "og:title", content: "Ariana Coach Group — Coaching, Consulting & Innovation" },
      {
        property: "og:description",
        content: "Grow your business with ACG — coaching, consulting, training, incubation and investment.",
      },
      { property: "og:url", content: "/" },
    ],
  }),
  component: Index,
});

const stats = [
  { value: "500+", label: "Clients supported" },
  { value: "80+", label: "Startups incubated" },
  { value: "12", label: "Cities served" },
  { value: "$8M+", label: "Capital facilitated" },
];

const testimonials = [
  {
    quote:
      "ACG helped us restructure operations and launch our app in under 90 days. Their team feels like part of ours.",
    author: "Nasrin H.",
    role: "Founder, Herat Handmade",
  },
  {
    quote:
      "The Kabul CEO Conference is the most valuable business event in the region — every year we come back with real deals.",
    author: "Farid A.",
    role: "CEO, Silk Route Logistics",
  },
  {
    quote:
      "Their financial management team gave us the reports we needed to close our first international round.",
    author: "Layla K.",
    role: "COO, PayBridge",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-gradient text-white">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "48px 48px, 64px 64px" }} />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
              Ariana Coach Group
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Empowering Businesses <br />
              Through <span className="text-brand-orange">Coaching</span>, Consulting <br className="hidden md:block" />
              &amp; Innovation
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              From startup incubation to enterprise consulting — ACG is the operating partner for
              ambitious teams across Afghanistan and the region.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-elegant transition-transform hover:scale-[1.03]"
              >
                Book a Free Consulting Session <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                Explore Services
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-8 rounded-full bg-brand-orange/20 blur-3xl" />
            <div className="relative flex h-72 w-72 items-center justify-center rounded-3xl bg-white/95 p-8 shadow-elegant md:h-96 md:w-96">
              <img src={logo.url} alt="Ariana Coach Group" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-white/10 bg-white/[0.03] backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4 md:px-8">
            {stats.map((s) => (
              <div key={s.label} className="animate-fade-in">
                <div className="text-3xl font-bold tracking-tight text-white md:text-4xl">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand-orange">What we do</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Eight services, one partner</h2>
          </div>
          <Link to="/services" className="hidden text-sm font-semibold text-secondary hover:underline md:inline">
            View all services →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-base font-semibold text-foreground">{s.title}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.tagline}</div>
              <div className="mt-4 text-xs font-semibold text-brand-orange opacity-0 transition-opacity group-hover:opacity-100">
                Learn more →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="bg-muted/50 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:px-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-brand-orange">Why ACG</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              A local operator with regional reach
            </h2>
            <p className="mt-5 text-muted-foreground">
              We're not a distant advisor. Our teams work alongside yours — in Kabul, remotely, and
              across the region — to ship results, not slide decks.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              { icon: Users2, title: "Multilingual teams", text: "Dari, Pashto, English & Arabic across every service." },
              { icon: Globe2, title: "Regional network", text: "Investors, partners and talent across South & Central Asia." },
              { icon: CheckCircle2, title: "Outcome-based", text: "Scoped engagements with measurable KPIs, not open-ended retainers." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-soft">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{f.title}</div>
                  <div className="text-sm text-muted-foreground">{f.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="text-xs uppercase tracking-[0.2em] text-brand-orange">Testimonials</div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Trusted by teams building the future</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.author} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <blockquote className="text-[15px] leading-relaxed text-foreground">"{t.quote}"</blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="text-sm font-semibold">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CLIENT LOGOS */}
      <section className="border-y border-border bg-muted/40 py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Working with leading organizations
          </div>
          <div className="mt-6 grid grid-cols-2 items-center gap-8 opacity-70 md:grid-cols-6">
            {["AKFED", "USAID", "MOEC", "Roshan", "AWCC", "UNDP"].map((n) => (
              <div key={n} className="text-center text-lg font-bold tracking-widest text-muted-foreground">
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
        <div className="overflow-hidden rounded-3xl bg-hero-gradient p-10 text-white md:p-16">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h3 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to grow your business?</h3>
              <p className="mt-4 max-w-xl text-white/75">
                Book a free 30-minute consulting session — we'll map your top 3 opportunities and how ACG can help.
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
      </section>

      <SiteFooter />
    </div>
  );
}
