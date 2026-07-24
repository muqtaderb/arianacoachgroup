import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Book a Free Consulting Session | ACG" },
      { name: "description", content: "Book a free 30-minute consulting session with the ACG team, or send us a message about your project." },
      { property: "og:title", content: "Contact — Book a Free Consulting Session | ACG" },
      { property: "og:description", content: "Get in touch with Ariana Coach Group." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell
      eyebrow="Contact"
      title="Book a free consulting session"
      intro="Tell us a little about your project. We'll reply within one business day to schedule a 30-minute call."
    >
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-2xl border border-border bg-card p-8 shadow-soft"
        >
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-secondary" />
              <div className="text-xl font-semibold">Thanks — we'll be in touch</div>
              <p className="max-w-sm text-sm text-muted-foreground">
                Your message has been queued. One of our advisors will reply within one business day.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full name" name="name" required />
                <Field label="Work email" name="email" type="email" required />
                <Field label="Company" name="company" />
                <Field label="Phone (optional)" name="phone" type="tel" />
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">Which service are you interested in?</label>
                <select className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option>General consultation</option>
                  <option>Social Media Management</option>
                  <option>Website & App Development</option>
                  <option>Call Center</option>
                  <option>Financial Management</option>
                  <option>HR Coaching</option>
                  <option>Training Center</option>
                  <option>Startup Incubator</option>
                  <option>Investment Platform</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">Tell us about your project</label>
                <textarea
                  rows={5}
                  required
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="What are you working on and where do you need help?"
                />
              </div>
              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-gradient px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-elegant transition-transform hover:scale-[1.01]"
              >
                <Calendar className="h-4 w-4" /> Book a Free Session
              </button>
            </>
          )}
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="text-xs uppercase tracking-widest text-brand-orange">Reach us directly</div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-secondary" /> support@arianacoach.com</div>
              <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-secondary" /> +93 793 535 228</div>
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" /> Kabul Intercontinental, Bagh-e-balaa, Kabul — Afghanistan</div>
            </div>
          </div>
          <div className="rounded-2xl bg-hero-gradient p-6 text-white shadow-elegant">
            <div className="text-xs uppercase tracking-widest text-brand-orange">Office hours</div>
            <div className="mt-3 text-sm text-white/80">
              Sat–Thu · 09:00 – 18:00 (AFT)<br />
              Friday · closed
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">{label}{required && <span className="text-brand-orange"> *</span>}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
      />
    </div>
  );
}