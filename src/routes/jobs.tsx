import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, MapPin } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Careers — Ariana Coach Group" },
      { name: "description", content: "Join ACG. Open roles across consulting, technology, operations and content — Kabul-based and remote." },
      { property: "og:title", content: "Careers — Ariana Coach Group" },
      { property: "og:description", content: "Open positions at ACG." },
      { property: "og:url", content: "/jobs" },
    ],
    links: [{ rel: "canonical", href: "/jobs" }],
  }),
  component: JobsPage,
});

const jobs = [
  { title: "Senior Business Consultant", team: "Consulting", location: "Kabul", type: "Full-time" },
  { title: "Full-Stack Engineer (React / Node)", team: "Product", location: "Remote", type: "Full-time" },
  { title: "Social Media Producer (Dari / Pashto)", team: "Marketing", location: "Kabul", type: "Full-time" },
  { title: "Call Center Agent — Arabic", team: "Operations", location: "Kabul", type: "Full-time" },
  { title: "HR Coach", team: "People", location: "Hybrid", type: "Contract" },
  { title: "Investment Analyst", team: "ACG Invest", location: "Kabul", type: "Full-time" },
];

function JobsPage() {
  return (
    <PageShell
      eyebrow="Careers"
      title="Build with a team backing the region"
      intro="We're hiring across consulting, technology and operations. Join a team shipping real outcomes for real clients."
    >
      <div className="rounded-2xl border border-border bg-card">
        {jobs.map((j, i) => (
          <div
            key={j.title}
            className={`flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between ${
              i !== jobs.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div>
              <div className="text-lg font-semibold">{j.title}</div>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {j.team}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {j.location}</span>
                <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-secondary">{j.type}</span>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground md:w-auto"
            >
              Apply
            </Link>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Don't see your role? <Link to="/contact" className="text-secondary underline">Send us your CV</Link> — we're always meeting talented people.
      </p>
    </PageShell>
  );
}