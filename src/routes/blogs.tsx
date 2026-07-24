import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPosts } from "@/lib/cms";

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

function BlogsPage() {
  const { data: posts = [] } = useQuery({ queryKey: ["blog_posts"], queryFn: () => fetchBlogPosts() });
  return (
    <PageShell
      eyebrow="Blog"
      title="Ideas, playbooks and stories"
      intro="Notes from the ACG team — advisors, founders and operators working with businesses across the region."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <article key={p.id} className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary/10 px-2.5 py-1 font-semibold uppercase tracking-widest text-secondary">
                {p.category}
              </span>
              <span>{p.read_time} read</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold leading-snug group-hover:text-secondary">{p.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
            <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">{p.post_date}</div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}