import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;
import {
  ArrowRight, Star, ChevronDown, Check,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { landingQueryOptions } from "@/lib/cms";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Icon } from "@/components/icon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KidoTech — Bridging Innovation and Connectivity" },
      { name: "description", content: "KidoTech: Pengembangan website, project IoT, troubleshooting, dan managed IT services. Mitra teknologi untuk skala bisnis Anda." },
      { property: "og:title", content: "KidoTech — Bridging Innovation and Connectivity" },
      { property: "og:description", content: "Website, IoT, troubleshooting, dan managed services dari tim engineering yang berpengalaman." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(landingQueryOptions);
  },
  component: LandingPage,
});

function LandingPage() {
  const { data } = useSuspenseQuery(landingQueryOptions);
  const brandName = data.settings.brand?.name ?? "KidoTech";
  const featured = data.projects.filter((p) => p.is_featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader brandName={brandName} />
      <Hero hero={data.hero} />
      <TrustedBy partners={data.partners} />
      <Services services={data.services} />
      <Process steps={data.process} />
      {featured.length > 0 && <PortfolioPreview projects={featured} />}
      <Testimonials testimonials={data.testimonials} />
      {data.faqs.length > 0 && <FaqSection faqs={data.faqs} />}
      <ContactCta />
      <ContactForm />
      <SiteFooter brandName={brandName} settings={data.settings} />
    </div>
  );
}

function Hero({ hero }: { hero: { title: string; highlight: string | null; subtitle: string | null; cta_label: string | null; cta_url: string | null; image_url: string | null } | null }) {
  if (!hero) return null;
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="container-page relative pt-14 pb-20 md:pt-20 md:pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground mb-6"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Tim engineering siap melayani project Anda
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] max-w-4xl mx-auto"
        >
          {hero.title}{" "}
          {hero.highlight && (
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
              {hero.highlight}
            </span>
          )}
        </motion.h1>
        {hero.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {hero.subtitle}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a href={hero.cta_url || "#contact"} className="btn-primary">
            {hero.cta_label || "Get Started"} <ArrowRight className="h-4 w-4" />
          </a>
          <Link to="/services" className="btn-ghost">Lihat Layanan</Link>
        </motion.div>
      </div>
    </section>
  );
}

function TrustedBy({ partners }: { partners: { id: string; name: string; logo_url: string | null }[] }) {
  if (partners.length === 0) return null;
  return (
    <section className="border-y border-border/60 bg-secondary/40">
      <div className="container-page py-10 md:py-12">
        <p className="text-center text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase">
          Dipercaya oleh
        </p>
        <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center">
          {partners.map((p) => (
            <div key={p.id} className="flex items-center justify-center opacity-70 hover:opacity-100 transition">
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="h-7 md:h-8 w-auto object-contain" loading="lazy" />
              ) : (
                <span className="font-display font-semibold">{p.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services({ services }: { services: { id: string; icon: string | null; title: string; description: string }[] }) {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">Apa yang kami kerjakan</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">
            Solusi teknologi <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>end-to-end</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Dari ide hingga rilis production — kami dampingi setiap tahapan dengan engineering berkualitas.
          </p>
        </div>
        <div className="mt-12 md:mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ steps }: { steps: { id: string; step_number: number; title: string; description: string; icon: string | null }[] }) {
  if (steps.length === 0) return null;
  return (
    <section className="py-20 md:py-24 bg-secondary/40 border-y border-border/60">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">Cara kami bekerja</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">Proses yang transparan</h2>
        </div>
        <div className="mt-12 md:mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.45, ease, delay: i * 0.07 }}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon name={s.icon} className="h-5 w-5" />
                </div>
                <span className="font-display text-3xl font-bold text-muted-foreground/30">0{s.step_number}</span>
              </div>
              <h3 className="mt-5 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioPreview({ projects }: { projects: { id: string; title: string; client: string | null; category: string | null; summary: string | null; cover_url: string | null; tags: string[] | null }[] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">Project terbaru</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold">Hasil yang berbicara</h2>
          </div>
          <Link to="/portfolio" className="btn-ghost self-start md:self-auto">
            Lihat semua project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {projects.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition"
            >
              {p.cover_url && (
                <div className="aspect-[16/10] overflow-hidden bg-secondary">
                  <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                </div>
              )}
              <div className="p-5">
                <div className="text-xs text-muted-foreground font-medium">{p.category} · {p.client}</div>
                <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ testimonials }: { testimonials: { id: string; author_name: string; author_role: string | null; company: string | null; quote: string; rating: number | null }[] }) {
  if (testimonials.length === 0) return null;
  return (
    <section className="py-20 md:py-24 bg-secondary/40 border-y border-border/60">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">Apa kata klien</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">Dipercaya tim yang membangun</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5 md:gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-card p-7 flex flex-col"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              {t.rating != null && (
                <div className="flex gap-0.5 text-primary mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              )}
              <blockquote className="text-foreground/90 leading-relaxed">"{t.quote}"</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border">
                <div className="font-semibold">{t.author_name}</div>
                <div className="text-sm text-muted-foreground">
                  {[t.author_role, t.company].filter(Boolean).join(" · ")}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  return (
    <section className="py-20 md:py-28">
      <div className="container-page grid lg:grid-cols-[1fr_1.5fr] gap-12">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">FAQ</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">Pertanyaan yang sering ditanyakan</h2>
          <p className="mt-4 text-muted-foreground">
            Belum menemukan jawabannya? <Link to="/contact" className="text-primary font-medium hover:underline">Hubungi tim kami</Link>.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((f) => {
            const isOpen = open === f.id;
            return (
              <div key={f.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium">{f.question}</span>
                  <ChevronDown className={"h-4 w-4 shrink-0 transition " + (isOpen ? "rotate-180" : "")} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section className="py-16">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <h2 className="text-3xl md:text-5xl font-bold max-w-2xl mx-auto">Siap memulai project teknologi Anda?</h2>
          <p className="mt-4 text-primary-foreground/85 max-w-xl mx-auto">
            Mari diskusi 30 menit gratis untuk memetakan kebutuhan dan solusi terbaik bagi bisnis Anda.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 font-semibold hover:bg-background/90 transition">
              Jadwalkan konsultasi <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 font-semibold hover:bg-primary-foreground/10 transition">
              Lihat portfolio
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/85">
            <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Konsultasi gratis</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Garansi project</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Response &lt; 24 jam</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      const { error } = await supabase.from("messages").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    },
    onError: (e: Error) => setError(e.message),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.length > 100 || form.email.length > 255 || form.message.length > 2000) {
      setError("Input terlalu panjang");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <section id="contact" className="py-16 md:py-20">
      <div className="container-page max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">Kirim pesan</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Mulai percakapan</h2>
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nama" value={form.name} maxLength={100} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Email" type="email" maxLength={255} value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          </div>
          <Field label="Subject" maxLength={200} value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
          <div>
            <label className="text-sm font-medium">Pesan <span className="text-primary">*</span></label>
            <textarea
              required maxLength={2000} rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
          <button type="submit" disabled={mutation.isPending} className="btn-primary w-full disabled:opacity-60">
            {mutation.isPending ? "Mengirim…" : "Kirim pesan"} <ArrowRight className="h-4 w-4" />
          </button>
          {sent && <p className="text-sm text-primary font-medium">Terima kasih — kami akan menghubungi Anda segera.</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", required, maxLength }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; maxLength?: number }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}{required && <span className="text-primary"> *</span>}</label>
      <input
        type={type}
        required={required}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
      />
    </div>
  );
}
