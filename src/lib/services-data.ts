export interface ServicePlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

export interface Service {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  outcomes: string[];
  plans: ServicePlan[];
  faqs: { q: string; a: string }[];
}

export const services: Service[] = [
  {
    slug: "social-media-management",
    title: "Social Media Management",
    tagline: "Grow your audience with strategy, content, and community.",
    description:
      "Full-service social media strategy, content production, community management, and paid growth across Instagram, Facebook, LinkedIn, TikTok and X.",
    outcomes: [
      "Content calendar & brand voice",
      "Design & short-form video production",
      "Community moderation & DMs",
      "Paid ads & reporting dashboards",
    ],
    plans: [
      { name: "Basic", price: "$450", period: "/month", features: ["2 platforms", "12 posts / month", "Monthly report", "Community replies (business hours)"] },
      { name: "Pro", price: "$950", period: "/month", highlighted: true, features: ["4 platforms", "24 posts + 6 reels", "Weekly analytics", "$300 ad management", "Dedicated strategist"] },
      { name: "Premium", price: "$1,850", period: "/month", features: ["All platforms", "Daily content + shorts", "24/7 community desk", "$1,000 ad management", "Quarterly brand workshops"] },
    ],
    faqs: [
      { q: "Do you cover ad spend?", a: "Ad budgets are billed separately. Each plan includes a management allowance shown above." },
      { q: "Which industries do you work with?", a: "SMBs, fintech, education, hospitality, and public-sector clients across Afghanistan and the region." },
    ],
  },
  {
    slug: "website-app-development",
    title: "Website & App Development",
    tagline: "Modern web and mobile products that scale.",
    description:
      "Design and engineering for marketing sites, SaaS dashboards, e-commerce and cross-platform mobile apps — shipped in weeks, not quarters.",
    outcomes: [
      "UX research & prototypes",
      "Full-stack web development",
      "iOS & Android apps",
      "DevOps, hosting & maintenance",
    ],
    plans: [
      { name: "Basic", price: "$1,800", period: "one-time", features: ["Up to 6-page marketing site", "Responsive & SEO ready", "CMS wiring", "30-day support"] },
      { name: "Pro", price: "$5,900", period: "one-time", highlighted: true, features: ["Custom web app / portal", "Auth + payments", "Admin dashboard", "90-day support"] },
      { name: "Premium", price: "From $14,000", period: "project", features: ["SaaS or mobile product", "iOS + Android", "Dedicated squad (design + eng)", "12-month SLA"] },
    ],
    faqs: [
      { q: "What stack do you use?", a: "React / TypeScript / Next / TanStack on the frontend, Node & Supabase on the backend, React Native for mobile." },
      { q: "Do you sign IP transfer?", a: "Yes — all source code and IP transfer to the client on final payment." },
    ],
  },
  {
    slug: "call-center",
    title: "Call Center",
    tagline: "Multilingual inbound & outbound support built for the region.",
    description:
      "Trained agents supporting Dari, Pashto, English and Arabic — sales, customer support, appointment setting and CX operations.",
    outcomes: ["Inbound support desk", "Outbound sales campaigns", "CRM integration", "QA & recorded call reviews"],
    plans: [
      { name: "Basic", price: "$6", period: "/hour / agent", features: ["Business-hours coverage", "Up to 2 agents", "Shared queue", "Monthly reports"] },
      { name: "Pro", price: "$1,200", period: "/agent / month", highlighted: true, features: ["Dedicated agent (160h)", "CRM & scripts", "Weekly QA", "Bilingual coverage"] },
      { name: "Premium", price: "Custom", period: "SLA", features: ["24/7 multi-agent desk", "Supervisor + QA lead", "Custom SLAs", "Integrations & reporting"] },
    ],
    faqs: [
      { q: "Which languages are supported?", a: "Dari, Pashto, English and Arabic as standard. Other languages on request." },
      { q: "Where are agents based?", a: "Our primary operations center is in Kabul, with remote agents across the region." },
    ],
  },
  {
    slug: "financial-management",
    title: "Financial Management",
    tagline: "Bookkeeping, reporting and CFO advisory for growing companies.",
    description:
      "Get finance operations off your plate — bookkeeping, monthly close, payroll, tax readiness and fractional CFO strategy.",
    outcomes: ["Bookkeeping & reconciliations", "Monthly management reports", "Payroll & compliance", "Fractional CFO advisory"],
    plans: [
      { name: "Basic", price: "$350", period: "/month", features: ["Up to 100 transactions", "Monthly reconciliation", "P&L + balance sheet", "Email support"] },
      { name: "Pro", price: "$850", period: "/month", highlighted: true, features: ["Up to 500 transactions", "Payroll (10 staff)", "Cashflow dashboard", "Quarterly review"] },
      { name: "Premium", price: "$2,400", period: "/month", features: ["Unlimited transactions", "Fractional CFO", "Board-ready reporting", "Fundraising support"] },
    ],
    faqs: [
      { q: "Do you work with QuickBooks / Xero?", a: "Yes — plus Zoho Books and custom stacks. We migrate at no extra cost." },
      { q: "Is my data secure?", a: "All records are stored encrypted with role-based access and audit logs." },
    ],
  },
  {
    slug: "hr-coaching",
    title: "HR Coaching",
    tagline: "Build a team that performs — hiring, culture, and people ops.",
    description:
      "From org design to recruiting playbooks, performance reviews and leadership coaching — practical HR support for lean teams.",
    outcomes: ["Recruiting & onboarding", "Performance & OKRs", "Handbooks & policy", "Leadership 1:1 coaching"],
    plans: [
      { name: "Basic", price: "$300", period: "/month", features: ["Handbook & policies", "2 hiring templates", "Monthly office hour"] },
      { name: "Pro", price: "$750", period: "/month", highlighted: true, features: ["End-to-end recruiting (2 roles)", "Performance framework", "Bi-weekly coaching"] },
      { name: "Premium", price: "$1,900", period: "/month", features: ["Fractional Head of People", "Unlimited roles", "Leadership offsite (1/yr)"] },
    ],
    faqs: [
      { q: "Do you help with visas & relocation?", a: "Yes, for regional and international placements we coordinate with legal partners." },
      { q: "Team-size fit?", a: "Best fit for 5–150 person teams." },
    ],
  },
  {
    slug: "training-center",
    title: "Training Center",
    tagline: "Practical corporate & professional training programs.",
    description:
      "Live and hybrid programs in leadership, sales, digital skills, English, and technical tracks — delivered in Kabul and online.",
    outcomes: ["Corporate workshops", "Cohort programs", "Certification prep", "Custom curriculum design"],
    plans: [
      { name: "Basic", price: "$120", period: "/seat", features: ["Public workshop seat", "Digital certificate", "Recording access (30 days)"] },
      { name: "Pro", price: "$2,400", period: "/cohort", highlighted: true, features: ["Private cohort (up to 15)", "4-week program", "Live + async sessions"] },
      { name: "Premium", price: "Custom", period: "engagement", features: ["Bespoke curriculum", "On-site delivery", "Multi-track certification"] },
    ],
    faqs: [
      { q: "Are certificates recognized?", a: "All programs include ACG certification; select tracks map to international partner credentials." },
      { q: "Languages of delivery?", a: "Dari, Pashto and English." },
    ],
  },
  {
    slug: "startup-mentorship-incubator",
    title: "Startup Mentorship & Incubator",
    tagline: "From idea to funded startup — mentors, workspace, and capital access.",
    description:
      "A structured 12-week incubator with weekly mentorship, workspace, investor intros and pilot-customer access.",
    outcomes: ["Weekly 1:1 mentorship", "Workspace in Kabul HQ", "Demo Day & investor intros", "Legal & finance setup"],
    plans: [
      { name: "Basic", price: "$0", period: "equity-only", features: ["Application-based", "Group mentorship", "Community access"] },
      { name: "Pro", price: "$1,500", period: "/founder", highlighted: true, features: ["12-week program", "Workspace + mentorship", "Investor prep + Demo Day"] },
      { name: "Premium", price: "Custom", period: "cohort", features: ["Corporate innovation cohort", "Custom vertical", "Follow-on investment track"] },
    ],
    faqs: [
      { q: "Do you take equity?", a: "The Basic track is equity-only (up to 5%). Paid tracks are fee-based, no mandatory equity." },
      { q: "Who can apply?", a: "Founders based in Afghanistan or the region building tech-enabled businesses." },
    ],
  },
  {
    slug: "investment-platform",
    title: "Investment Platform",
    tagline: "Connect vetted startups and SMEs with capital.",
    description:
      "ACG Invest matches accredited investors with pre-screened opportunities across our portfolio, with due diligence and syndication support.",
    outcomes: ["Deal flow access", "Due diligence packs", "Syndicate formation", "Post-investment reporting"],
    plans: [
      { name: "Basic", price: "$0", period: "member", features: ["Monthly deal digest", "Public research reports"] },
      { name: "Pro", price: "$2,000", period: "/year", highlighted: true, features: ["Full deal room access", "Quarterly investor calls", "Syndicate invites"] },
      { name: "Premium", price: "Custom", period: "LP", features: ["Fund LP access", "Co-invest rights", "Portfolio reporting"] },
    ],
    faqs: [
      { q: "Is this a regulated fund?", a: "Deals are structured per jurisdiction; accredited-investor verification is required for Pro and Premium." },
      { q: "Minimum ticket size?", a: "Typically $10,000 for syndicates, higher for LP allocations." },
    ],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);