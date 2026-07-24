import { supabase } from "@/integrations/supabase/client";

export interface ServicePlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

export interface ServiceFaq { q: string; a: string }

export interface ServiceRow {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  outcomes: string[];
  plans: ServicePlan[];
  faqs: ServiceFaq[];
  sort_order: number;
  published: boolean;
}

export interface EventRow {
  id: string;
  title: string;
  event_date: string;
  location: string;
  tag: string;
  description: string;
  is_featured: boolean;
  ticket_tiers: { name: string; price: string }[];
  sort_order: number;
  published: boolean;
}

export interface CourseRow {
  id: string;
  title: string;
  track: string;
  weeks: number;
  level: string;
  price: string;
  sort_order: number;
  published: boolean;
}

export interface JobRow {
  id: string;
  title: string;
  team: string;
  location: string;
  employment_type: string;
  description: string;
  sort_order: number;
  published: boolean;
}

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  post_date: string;
  read_time: string;
  excerpt: string;
  content: string;
  sort_order: number;
  published: boolean;
}

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  office_hours: string;
}

function normalizeJsonArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  return [];
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("site_settings").select("phone,email,address,office_hours").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data ?? { phone: "", email: "", address: "", office_hours: "" };
}

export async function fetchServices(includeUnpublished = false): Promise<ServiceRow[]> {
  let q = supabase.from("services").select("*").order("sort_order");
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    outcomes: normalizeJsonArray<string>(r.outcomes),
    plans: normalizeJsonArray<ServicePlan>(r.plans),
    faqs: normalizeJsonArray<ServiceFaq>(r.faqs),
  })) as ServiceRow[];
}

export async function fetchServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const { data, error } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    ...data,
    outcomes: normalizeJsonArray<string>(data.outcomes),
    plans: normalizeJsonArray<ServicePlan>(data.plans),
    faqs: normalizeJsonArray<ServiceFaq>(data.faqs),
  } as ServiceRow;
}

export async function fetchEvents(includeUnpublished = false): Promise<EventRow[]> {
  let q = supabase.from("events").select("*").order("sort_order");
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((r) => ({
    ...r,
    ticket_tiers: normalizeJsonArray<{ name: string; price: string }>(r.ticket_tiers),
  })) as EventRow[];
}

export async function fetchCourses(includeUnpublished = false): Promise<CourseRow[]> {
  let q = supabase.from("courses").select("*").order("sort_order");
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as CourseRow[];
}

export async function fetchJobs(includeUnpublished = false): Promise<JobRow[]> {
  let q = supabase.from("jobs").select("*").order("sort_order");
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as JobRow[];
}

export async function fetchBlogPosts(includeUnpublished = false): Promise<BlogPostRow[]> {
  let q = supabase.from("blog_posts").select("*").order("sort_order");
  if (!includeUnpublished) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as BlogPostRow[];
}