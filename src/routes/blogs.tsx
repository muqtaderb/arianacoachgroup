import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/blogs")({
  head: () => ({
    meta: [
      { title: "Blog — Insights from Ariana Coach Group" },
      { name: "description", content: "Insights on business, technology, and entrepreneurship across Afghanistan and the region — from the ACG team." },
      { property: "og:title", content: "Blog — Insights from Ariana Coach Group" },
      { property: "og:description", content: "Ideas, playbooks and stories from ACG's advisors and founders." },
      { property: "og:url", content: "/blogs" },
    ],
    links: [{ rel: "canonical", href: "/blogs" }],
  }),
  component: BlogsPage,
});

const posts = [
  { title: "Why Kabul is the next SME startup hub", category: "Insights", date: "Jul 2, 2026", read: "6 min", excerpt: "A look at the tailwinds — talent, digital infra, and regional trade — reshaping business in Afghanistan." },
  { title: "How we ran the largest founder event in the region", category: "Events", date: "Jun 18, 2026", read: "8 min", excerpt: "Behind the scenes of the Kabul CEO Conference and the lessons for anyone building community." },
  { title: "A playbook for hiring bilingual support agents", category: "Operations", date: "Jun 4, 2026", read: "5 min", excerpt: "The exact interview loop and scripts we use for our call center hires." },
  { title: "Fractional CFO 101 for early-stage founders", category: "Finance", date: "May 22, 2026", read: "7 min", excerpt: "When to hire one, what to expect, and the numbers you should be tracking." },
  { title: "React or Next? Our stack choice for client apps", category: "Engineering", date: "May 9, 2026", read: "10 min", excerpt: "A pragmatic take on framework selection for regional clients." },
  { title: "Investing in Afghanistan: what the deal room looks like", category: "Investment", date: "Apr 28, 2026", read: "9 min", excerpt: "The kinds of companies raising through ACG Invest and what LPs are asking about." },
];

function BlogsPage() {
  return (
    <PageShell
      eyebrow="Blog"
      title="Ideas, playbooks and stories"
      intro="Notes from the ACG team — advisors, founders and operators working with businesses across the region."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.title} className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary/10 px-2.5 py-1 font-semibold uppercase tracking-widest text-secondary">
                {p.category}
              </span>
              <span>{p.read} read</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold leading-snug group-hover:text-secondary">{p.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
            <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">{p.date}</div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}