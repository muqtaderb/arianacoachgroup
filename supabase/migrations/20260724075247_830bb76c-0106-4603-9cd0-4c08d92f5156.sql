
-- Role enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-grant admin to the designated email on signup / email confirmation
CREATE OR REPLACE FUNCTION public.grant_admin_for_designated_email()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'qataepezhwak@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE FUNCTION public.grant_admin_for_designated_email();
CREATE TRIGGER on_auth_user_confirmed_grant_admin
AFTER UPDATE OF email_confirmed_at ON auth.users FOR EACH ROW
WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_for_designated_email();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Site settings (single row)
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  office_hours text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage site_settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.site_settings (id, phone, email, address, office_hours) VALUES
  (1, '+93 793 535 228', 'support@arianacoach.com', 'Kabul Intercontinental, Bagh-e-balaa, Kabul — Afghanistan', 'Sat–Thu · 09:00 – 18:00 (AFT) · Friday closed');

-- Services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  outcomes jsonb NOT NULL DEFAULT '[]'::jsonb,
  plans jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published services" ON public.services FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins read all services" ON public.services FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage services" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.services (slug, title, tagline, description, outcomes, plans, faqs, sort_order) VALUES
('social-media-management','Social Media Management','Grow your audience with strategy, content, and community.','Full-service social media strategy, content production, community management, and paid growth across Instagram, Facebook, LinkedIn, TikTok and X.',
'["Content calendar & brand voice","Design & short-form video production","Community moderation & DMs","Paid ads & reporting dashboards"]',
'[{"name":"Basic","price":"$450","period":"/month","features":["2 platforms","12 posts / month","Monthly report","Community replies (business hours)"]},{"name":"Pro","price":"$950","period":"/month","highlighted":true,"features":["4 platforms","24 posts + 6 reels","Weekly analytics","$300 ad management","Dedicated strategist"]},{"name":"Premium","price":"$1,850","period":"/month","features":["All platforms","Daily content + shorts","24/7 community desk","$1,000 ad management","Quarterly brand workshops"]}]',
'[{"q":"Do you cover ad spend?","a":"Ad budgets are billed separately. Each plan includes a management allowance shown above."},{"q":"Which industries do you work with?","a":"SMBs, fintech, education, hospitality, and public-sector clients across Afghanistan and the region."}]',1),
('website-app-development','Website & App Development','Modern web and mobile products that scale.','Design and engineering for marketing sites, SaaS dashboards, e-commerce and cross-platform mobile apps — shipped in weeks, not quarters.',
'["UX research & prototypes","Full-stack web development","iOS & Android apps","DevOps, hosting & maintenance"]',
'[{"name":"Basic","price":"$1,800","period":"one-time","features":["Up to 6-page marketing site","Responsive & SEO ready","CMS wiring","30-day support"]},{"name":"Pro","price":"$5,900","period":"one-time","highlighted":true,"features":["Custom web app / portal","Auth + payments","Admin dashboard","90-day support"]},{"name":"Premium","price":"From $14,000","period":"project","features":["SaaS or mobile product","iOS + Android","Dedicated squad (design + eng)","12-month SLA"]}]',
'[{"q":"What stack do you use?","a":"React / TypeScript / Next / TanStack on the frontend, Node & Supabase on the backend, React Native for mobile."},{"q":"Do you sign IP transfer?","a":"Yes — all source code and IP transfer to the client on final payment."}]',2),
('call-center','Call Center','Multilingual inbound & outbound support built for the region.','Trained agents supporting Dari, Pashto, English and Arabic — sales, customer support, appointment setting and CX operations.',
'["Inbound support desk","Outbound sales campaigns","CRM integration","QA & recorded call reviews"]',
'[{"name":"Basic","price":"$6","period":"/hour / agent","features":["Business-hours coverage","Up to 2 agents","Shared queue","Monthly reports"]},{"name":"Pro","price":"$1,200","period":"/agent / month","highlighted":true,"features":["Dedicated agent (160h)","CRM & scripts","Weekly QA","Bilingual coverage"]},{"name":"Premium","price":"Custom","period":"SLA","features":["24/7 multi-agent desk","Supervisor + QA lead","Custom SLAs","Integrations & reporting"]}]',
'[{"q":"Which languages are supported?","a":"Dari, Pashto, English and Arabic as standard. Other languages on request."},{"q":"Where are agents based?","a":"Our primary operations center is in Kabul, with remote agents across the region."}]',3),
('financial-management','Financial Management','Bookkeeping, reporting and CFO advisory for growing companies.','Get finance operations off your plate — bookkeeping, monthly close, payroll, tax readiness and fractional CFO strategy.',
'["Bookkeeping & reconciliations","Monthly management reports","Payroll & compliance","Fractional CFO advisory"]',
'[{"name":"Basic","price":"$350","period":"/month","features":["Up to 100 transactions","Monthly reconciliation","P&L + balance sheet","Email support"]},{"name":"Pro","price":"$850","period":"/month","highlighted":true,"features":["Up to 500 transactions","Payroll (10 staff)","Cashflow dashboard","Quarterly review"]},{"name":"Premium","price":"$2,400","period":"/month","features":["Unlimited transactions","Fractional CFO","Board-ready reporting","Fundraising support"]}]',
'[{"q":"Do you work with QuickBooks / Xero?","a":"Yes — plus Zoho Books and custom stacks. We migrate at no extra cost."},{"q":"Is my data secure?","a":"All records are stored encrypted with role-based access and audit logs."}]',4),
('hr-coaching','HR Coaching','Build a team that performs — hiring, culture, and people ops.','From org design to recruiting playbooks, performance reviews and leadership coaching — practical HR support for lean teams.',
'["Recruiting & onboarding","Performance & OKRs","Handbooks & policy","Leadership 1:1 coaching"]',
'[{"name":"Basic","price":"$300","period":"/month","features":["Handbook & policies","2 hiring templates","Monthly office hour"]},{"name":"Pro","price":"$750","period":"/month","highlighted":true,"features":["End-to-end recruiting (2 roles)","Performance framework","Bi-weekly coaching"]},{"name":"Premium","price":"$1,900","period":"/month","features":["Fractional Head of People","Unlimited roles","Leadership offsite (1/yr)"]}]',
'[{"q":"Do you help with visas & relocation?","a":"Yes, for regional and international placements we coordinate with legal partners."},{"q":"Team-size fit?","a":"Best fit for 5–150 person teams."}]',5),
('training-center','Training Center','Practical corporate & professional training programs.','Live and hybrid programs in leadership, sales, digital skills, English, and technical tracks — delivered in Kabul and online.',
'["Corporate workshops","Cohort programs","Certification prep","Custom curriculum design"]',
'[{"name":"Basic","price":"$120","period":"/seat","features":["Public workshop seat","Digital certificate","Recording access (30 days)"]},{"name":"Pro","price":"$2,400","period":"/cohort","highlighted":true,"features":["Private cohort (up to 15)","4-week program","Live + async sessions"]},{"name":"Premium","price":"Custom","period":"engagement","features":["Bespoke curriculum","On-site delivery","Multi-track certification"]}]',
'[{"q":"Are certificates recognized?","a":"All programs include ACG certification; select tracks map to international partner credentials."},{"q":"Languages of delivery?","a":"Dari, Pashto and English."}]',6),
('startup-mentorship-incubator','Startup Mentorship & Incubator','From idea to funded startup — mentors, workspace, and capital access.','A structured 12-week incubator with weekly mentorship, workspace, investor intros and pilot-customer access.',
'["Weekly 1:1 mentorship","Workspace in Kabul HQ","Demo Day & investor intros","Legal & finance setup"]',
'[{"name":"Basic","price":"$0","period":"equity-only","features":["Application-based","Group mentorship","Community access"]},{"name":"Pro","price":"$1,500","period":"/founder","highlighted":true,"features":["12-week program","Workspace + mentorship","Investor prep + Demo Day"]},{"name":"Premium","price":"Custom","period":"cohort","features":["Corporate innovation cohort","Custom vertical","Follow-on investment track"]}]',
'[{"q":"Do you take equity?","a":"The Basic track is equity-only (up to 5%). Paid tracks are fee-based, no mandatory equity."},{"q":"Who can apply?","a":"Founders based in Afghanistan or the region building tech-enabled businesses."}]',7),
('investment-platform','Investment Platform','Connect vetted startups and SMEs with capital.','ACG Invest matches accredited investors with pre-screened opportunities across our portfolio, with due diligence and syndication support.',
'["Deal flow access","Due diligence packs","Syndicate formation","Post-investment reporting"]',
'[{"name":"Basic","price":"$0","period":"member","features":["Monthly deal digest","Public research reports"]},{"name":"Pro","price":"$2,000","period":"/year","highlighted":true,"features":["Full deal room access","Quarterly investor calls","Syndicate invites"]},{"name":"Premium","price":"Custom","period":"LP","features":["Fund LP access","Co-invest rights","Portfolio reporting"]}]',
'[{"q":"Is this a regulated fund?","a":"Deals are structured per jurisdiction; accredited-investor verification is required for Pro and Premium."},{"q":"Minimum ticket size?","a":"Typically $10,000 for syndicates, higher for LP allocations."}]',8);

-- Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_date text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT 'Public',
  description text NOT NULL DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  ticket_tiers jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon, authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published events" ON public.events FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins read all events" ON public.events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage events" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.events (title,event_date,location,tag,description,is_featured,ticket_tiers,sort_order) VALUES
('Kabul CEO Conference 2026','March 14–15, 2026','Intercontinental Hotel, Kabul','Flagship','Two days of keynotes, panels and 1:1 meetings with the region''s top founders, CEOs and investors. Get your ticket early — last year sold out in 6 weeks.',true,
'[{"name":"General Admission","price":"$149"},{"name":"Executive Pass","price":"$449"},{"name":"VIP + Investor Lounge","price":"$1,200"}]',1),
('Founders'' Roundtable','Feb 8, 2026','ACG HQ Kabul','Invite-only','Monthly closed-door session for founders raising seed to Series A.',false,'[]',2),
('Women in Business Summit','April 22, 2026','Herat','Public','A one-day summit spotlighting women entrepreneurs across Afghanistan.',false,'[]',3);

-- Courses
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  track text NOT NULL DEFAULT '',
  weeks integer NOT NULL DEFAULT 4,
  level text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published courses" ON public.courses FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins read all courses" ON public.courses FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage courses" ON public.courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.courses (title,track,weeks,level,price,sort_order) VALUES
('Leadership & Management Foundations','Leadership',6,'Manager','$320',1),
('Digital Marketing & Social Media','Digital',4,'Beginner–Intermediate','$220',2),
('Financial Literacy for Founders','Finance',4,'Founder','$260',3),
('Modern Web Development (React)','Tech',10,'Intermediate','$540',4),
('Sales & Business Development','Sales',5,'All levels','$280',5),
('Business English Mastery','Language',8,'B1 → C1','$380',6),
('Data & AI for Business','Tech',6,'Manager','$420',7),
('Project Management (Agile)','Ops',5,'PM / Lead','$310',8);

-- Jobs
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  team text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  employment_type text NOT NULL DEFAULT 'Full-time',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published jobs" ON public.jobs FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins read all jobs" ON public.jobs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage jobs" ON public.jobs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER jobs_updated BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.jobs (title,team,location,employment_type,sort_order) VALUES
('Senior Business Consultant','Consulting','Kabul','Full-time',1),
('Full-Stack Engineer (React / Node)','Product','Remote','Full-time',2),
('Social Media Producer (Dari / Pashto)','Marketing','Kabul','Full-time',3),
('Call Center Agent — Arabic','Operations','Kabul','Full-time',4),
('HR Coach','People','Hybrid','Contract',5),
('Investment Analyst','ACG Invest','Kabul','Full-time',6);

-- Blog posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT '',
  post_date text NOT NULL DEFAULT '',
  read_time text NOT NULL DEFAULT '5 min',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published blog_posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins read all blog_posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage blog_posts" ON public.blog_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER blog_posts_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.blog_posts (slug,title,category,post_date,read_time,excerpt,sort_order) VALUES
('kabul-sme-hub','Why Kabul is the next SME startup hub','Insights','Jul 2, 2026','6 min','A look at the tailwinds — talent, digital infra, and regional trade — reshaping business in Afghanistan.',1),
('largest-founder-event','How we ran the largest founder event in the region','Events','Jun 18, 2026','8 min','Behind the scenes of the Kabul CEO Conference and the lessons for anyone building community.',2),
('bilingual-support-agents','A playbook for hiring bilingual support agents','Operations','Jun 4, 2026','5 min','The exact interview loop and scripts we use for our call center hires.',3),
('fractional-cfo-101','Fractional CFO 101 for early-stage founders','Finance','May 22, 2026','7 min','When to hire one, what to expect, and the numbers you should be tracking.',4),
('react-or-next','React or Next? Our stack choice for client apps','Engineering','May 9, 2026','10 min','A pragmatic take on framework selection for regional clients.',5),
('afghanistan-deal-room','Investing in Afghanistan: what the deal room looks like','Investment','Apr 28, 2026','9 min','The kinds of companies raising through ACG Invest and what LPs are asking about.',6);
