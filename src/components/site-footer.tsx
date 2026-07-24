import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { services } from "@/lib/services-data";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand-navy-deep text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <div className="text-lg font-bold text-white">Ariana Coach Group</div>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Empowering businesses across Afghanistan and the region through coaching,
            consulting and innovation.
          </p>
          <div className="mt-6 space-y-2 text-sm text-white/70">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-orange" /> Kabul, Afghanistan</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-orange" /> hello@arianacoachgroup.com</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-orange" /> +93 700 000 000</div>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wider text-white">Services</div>
          <ul className="mt-4 space-y-2 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="text-white/70 hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wider text-white">Company</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="text-white/70 hover:text-white">About</Link></li>
            <li><Link to="/events" className="text-white/70 hover:text-white">Events</Link></li>
            <li><Link to="/courses" className="text-white/70 hover:text-white">Courses</Link></li>
            <li><Link to="/jobs" className="text-white/70 hover:text-white">Careers</Link></li>
            <li><Link to="/blogs" className="text-white/70 hover:text-white">Blog</Link></li>
            <li><Link to="/contact" className="text-white/70 hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-wider text-white">Get started</div>
          <p className="mt-4 text-sm text-white/70">
            Book a free 30-minute consulting session with one of our advisors.
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-accent-gradient px-5 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            Book Free Session
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-white/50 md:flex-row md:px-8">
          <div>© {new Date().getFullYear()} Ariana Coach Group. All rights reserved.</div>
          <div>Coaching · Consulting · Innovation</div>
        </div>
      </div>
    </footer>
  );
}