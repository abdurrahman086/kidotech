import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export type Hero = {
  id: string;
  title: string;
  highlight: string | null;
  subtitle: string | null;
  cta_label: string | null;
  cta_url: string | null;
  image_url: string | null;
};

export type Service = {
  id: string;
  icon: string | null;
  title: string;
  description: string;
};

export type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number | null;
};

export type Project = {
  id: string;
  title: string;
  slug: string | null;
  client: string | null;
  category: string | null;
  summary: string | null;
  cover_url: string | null;
  project_url: string | null;
  tags: string[] | null;
  is_featured: boolean;
  completed_at: string | null;
};

export type ProcessStep = {
  id: string;
  step_number: number;
  title: string;
  description: string;
  icon: string | null;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
};

export type SiteSettings = {
  brand?: { name?: string; tagline?: string };
  contact?: { email?: string; phone?: string; address?: string };
  social?: { twitter?: string; linkedin?: string; github?: string };
};

export const landingQueryOptions = queryOptions({
  queryKey: ["landing"],
  queryFn: async () => {
    const [settings, hero, services, partners, testimonials, projects, process, faqs] = await Promise.all([
      supabase.from("site_settings").select("key,value"),
      supabase
        .from("hero_sections")
        .select("id,title,highlight,subtitle,cta_label,cta_url,image_url")
        .eq("is_active", true)
        .order("sort_order")
        .limit(1)
        .maybeSingle(),
      supabase
        .from("services")
        .select("id,icon,title,description")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("partners")
        .select("id,name,logo_url,website_url")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("testimonials")
        .select("id,author_name,author_role,company,quote,avatar_url,rating")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("projects")
        .select("id,title,slug,client,category,summary,cover_url,project_url,tags,is_featured,completed_at")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("process_steps")
        .select("id,step_number,title,description,icon")
        .eq("is_active", true)
        .order("step_number"),
      supabase
        .from("faqs")
        .select("id,question,answer,category")
        .eq("is_active", true)
        .order("sort_order"),
    ]);

    const settingsMap: SiteSettings = {};
    for (const row of settings.data ?? []) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (settingsMap as any)[row.key] = row.value;
    }

    return {
      settings: settingsMap,
      hero: (hero.data ?? null) as Hero | null,
      services: (services.data ?? []) as Service[],
      partners: (partners.data ?? []) as Partner[],
      testimonials: (testimonials.data ?? []) as Testimonial[],
      projects: (projects.data ?? []) as Project[],
      process: (process.data ?? []) as ProcessStep[],
      faqs: (faqs.data ?? []) as Faq[],
    };
  },
});
