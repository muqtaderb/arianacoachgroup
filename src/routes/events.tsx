import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin, Ticket, Users2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Kabul CEO Conference & More | ACG" },
      { name: "description", content: "Join the Kabul CEO Conference and other ACG events. Networking, keynotes and workshops for business leaders." },
      { property: "og:title", content: "Events — Kabul CEO Conference & More | ACG" },
      { property: "og:description", content: "Networking and learning events for business leaders across the region." },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: EventsPage,
});

const upcoming = [
  {
    title: "Kabul CEO Conference 2026",
    date: "March 14, 2026",
    location: "Intercontinental Kabul",
    tag: "Flagship",
    description: "The region's largest gathering of founders, CEOs and investors. 40+ speakers, 500+ attendees.",
  },
  {
    title: "Founders' Roundtable",
    date: "Feb 8, 2026",
    location: "ACG HQ Kabul",
    tag: "Invite-only",
    description: "Monthly closed-door session for founders raising seed to Series A.",
  },
  {
    title: "Women in Business Summit",
    date: "April 22, 2026",
    location: "Herat",
    tag: "Public",
    description: "A one-day summit spotlighting women entrepreneurs across Afghanistan.",
  },
];

function EventsPage() {
  return (
    <PageShell
      eyebrow="Events"
      title="Where business leaders meet"
      intro="From the flagship Kabul CEO Conference to invite-only roundtables, ACG events bring together the people building the region's future."
    >
      {/* Featured event */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elegant">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="bg-hero-gradient p-10 text-white md:p-14">
            <div className="text-xs uppercase tracking-[0.22em] text-brand-orange">Flagship Event</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Kabul CEO Conference 2026</h2>
            <p className="mt-4 text-white/75">
              Two days of keynotes, panels and 1:1 meetings with the region's top founders,
              CEOs and investors. Get your ticket early — last year sold out in 6 weeks.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-brand-orange" /> March 14–15, 2026</div>
              <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-brand-orange" /> Intercontinental Hotel, Kabul</div>
              <div className="flex items-center gap-3"><Users2 className="h-4 w-4 text-brand-orange" /> 500+ business leaders</div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 p-10 md:p-14">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Ticket tiers</div>
              <div className="mt-4 space-y-3">
                {[
                  { name: "General Admission", price: "$149" },
                  { name: "Executive Pass", price: "$449" },
                  { name: "VIP + Investor Lounge", price: "$1,200" },
                ].map((t) => (
                  <div key={t.name} className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-lg font-bold text-brand-orange">{t.price}</div>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-gradient px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-elegant"
            >
              <Ticket className="h-4 w-4" /> Register interest
            </Link>
          </div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Upcoming events</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {upcoming.map((e) => (
            <div key={e.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="inline-flex rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-secondary">
                {e.tag}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{e.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-5 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {e.date}</div>
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {e.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}