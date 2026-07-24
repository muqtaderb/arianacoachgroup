import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ariana Coach Group" },
      { name: "description", content: "ACG is a coaching, consulting and innovation firm supporting businesses across Afghanistan and the region." },
      { property: "og:title", content: "About — Ariana Coach Group" },
      { property: "og:description", content: "Our mission, team and what clients say about working with ACG." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const testimonials = [
  { quote: "ACG helped us restructure operations and launch our app in under 90 days.", author: "Nasrin H.", role: "Founder, Herat Handmade" },
  { quote: "The Kabul CEO Conference is the most valuable business event in the region.", author: "Farid A.", role: "CEO, Silk Route Logistics" },
  { quote: "Their financial team gave us the reports we needed to close our first international round.", author: "Layla K.", role: "COO, PayBridge" },
  { quote: "We hired 12 people through their HR desk in one quarter. Extraordinary bench.", author: "Bilal S.", role: "MD, Aria Retail" },
];

function AboutPage() {
  return (
    <PageShell
      eyebrow="About ACG"
      title="A local operator with regional reach"
      intro="Ariana Coach Group was founded to give ambitious teams across Afghanistan and the region access to the same caliber of advisors, operators and capital that startups in New York or Dubai take for granted."
    >
      <div className="grid gap-10 md:grid-cols-3">
        {[
          { title: "Our mission", text: "Empower every business — from village shop to venture-scale startup — with the tools, talent and capital to grow." },
          { title: "How we work", text: "Scoped engagements with measurable KPIs. Local teams, regional network, global standards." },
          { title: "Where we work", text: "Kabul HQ with teams and partners across Afghanistan, the Gulf, South & Central Asia." },
        ].map((b) => (
          <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="text-xs uppercase tracking-widest text-brand-orange">{b.title}</div>
            <p className="mt-3 text-muted-foreground">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <div className="text-xs uppercase tracking-widest text-brand-orange">Testimonials</div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">In our clients' words</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure key={t.author} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <blockquote className="text-lg leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="text-sm font-semibold">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-20 rounded-3xl bg-hero-gradient p-10 text-white md:p-14">
        <div className="grid gap-8 md:grid-cols-4">
          {[
            { v: "500+", l: "Clients" },
            { v: "80+", l: "Startups incubated" },
            { v: "12", l: "Cities" },
            { v: "$8M+", l: "Capital facilitated" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl font-bold md:text-4xl">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-white/60">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}