import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { SiteSettingsEditor } from "@/components/admin/site-settings-editor";
import { ServicesEditor } from "@/components/admin/services-editor";
import { EventsEditor } from "@/components/admin/events-editor";
import { CoursesEditor } from "@/components/admin/courses-editor";
import { JobsEditor } from "@/components/admin/jobs-editor";
import { BlogPostsEditor } from "@/components/admin/blog-posts-editor";
import logo from "@/assets/acg-logo.jpg.asset.json";

const TABS = [
  { id: "settings", label: "Site info" },
  { id: "services", label: "Services" },
  { id: "events", label: "Events" },
  { id: "courses", label: "Courses" },
  { id: "jobs", label: "Jobs" },
  { id: "blogs", label: "Blog" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Ariana Coach Group" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState<TabId>("settings");
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <img src={logo.url} alt="ACG" className="h-9 w-9 rounded-md object-contain" />
            <div>
              <div className="text-sm font-bold">ACG Admin</div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Content Manager</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> View site
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2 md:px-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {tab === "settings" && <SiteSettingsEditor />}
        {tab === "services" && <ServicesEditor />}
        {tab === "events" && <EventsEditor />}
        {tab === "courses" && <CoursesEditor />}
        {tab === "jobs" && <JobsEditor />}
        {tab === "blogs" && <BlogPostsEditor />}
      </main>
    </div>
  );
}