import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Clock, GraduationCap } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — ACG Training Center" },
      { name: "description", content: "Live and hybrid courses in leadership, digital skills, sales, English and technical tracks. Delivered in Kabul and online." },
      { property: "og:title", content: "Courses — ACG Training Center" },
      { property: "og:description", content: "Practical, cohort-based courses for professionals across the region." },
      { property: "og:url", content: "/courses" },
    ],
    links: [{ rel: "canonical", href: "/courses" }],
  }),
  component: CoursesPage,
});

const courses = [
  { title: "Leadership & Management Foundations", weeks: 6, level: "Manager", price: "$320", track: "Leadership" },
  { title: "Digital Marketing & Social Media", weeks: 4, level: "Beginner–Intermediate", price: "$220", track: "Digital" },
  { title: "Financial Literacy for Founders", weeks: 4, level: "Founder", price: "$260", track: "Finance" },
  { title: "Modern Web Development (React)", weeks: 10, level: "Intermediate", price: "$540", track: "Tech" },
  { title: "Sales & Business Development", weeks: 5, level: "All levels", price: "$280", track: "Sales" },
  { title: "Business English Mastery", weeks: 8, level: "B1 → C1", price: "$380", track: "Language" },
  { title: "Data & AI for Business", weeks: 6, level: "Manager", price: "$420", track: "Tech" },
  { title: "Project Management (Agile)", weeks: 5, level: "PM / Lead", price: "$310", track: "Ops" },
];

function CoursesPage() {
  return (
    <PageShell
      eyebrow="Training Center"
      title="Cohort-based courses that ship real skills"
      intro="Live sessions with expert instructors, project work, and a certificate you can put to work. Programs run in Dari, Pashto and English."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div key={c.title} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
            <div className="flex items-center gap-2">
              <span className="inline-flex rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-secondary">
                {c.track}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {c.weeks} weeks</span>
              <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {c.level}</span>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <div className="text-xl font-bold">{c.price}</div>
              <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">
                Enroll <BookOpen className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}