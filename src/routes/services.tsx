import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { landingQueryOptions } from "@/lib/cms";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Icon } from "@/components/icon";

const ease = [0.22, 1, 0.36, 1] as const;

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Layanan & Produk — KidoTech" },
      { name: "description", content: "Layanan KidoTech: pengembangan website & web app, project IoT, IT troubleshooting, dan managed services." },
      { property: "og:title", content: "Layanan & Produk — KidoTech" },
      { property: "og:description", content: "Pengembangan website, IoT, troubleshooting, dan managed IT services." },
    ],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(landingQueryOptions); },
  component: ServicesPage,
});

const BENEFITS = [
  "Konsultasi awal gratis & no-obligation",
  "Estimasi timeline transparan",
  "Code review & dokumentasi lengkap",
  "Garansi & support pasca peluncuran",
];

function ServicesPage() {
  const { data } = useSuspenseQuery(landingQueryOptions);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader brandName={data.settings.brand?.name ?? "KidoTech"} />
      <section className="container-page pt-16 md:pt-24 pb-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="text-xs font-semibold tracking-[0.25em] text-primary uppercase"
        >
          Layanan & Produk
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="mt-3 text-4xl md:text-6xl font-bold max-w-3xl mx-auto"
        >
          Layanan teknologi yang membuat bisnis Anda <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>tumbuh</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-5 text-muted-foreground max-w-xl mx-auto"
        >
          Dari pembuatan website, project IoT, hingga managed IT services — satu mitra untuk semua kebutuhan teknologi Anda.
        </motion.p>
      </section>

      <section className="container-page py-12">
        <div className="space-y-5">
          {data.services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              className={"rounded-3xl border border-border bg-card p-6 md:p-10 grid md:grid-cols-[auto_1fr_auto] gap-6 items-center " + (i % 2 ? "md:flex-row-reverse" : "")}
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary shrink-0">
                <Icon name={s.icon} className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold tracking-[0.25em] text-muted-foreground uppercase">Layanan 0{i + 1}</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold">{s.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
              <Link to="/contact" className="btn-primary self-start md:self-center">
                Konsultasi <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="container-page py-16"
      >
        <div className="rounded-3xl border border-border bg-secondary/40 p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Mengapa memilih KidoTech?</h2>
            <p className="mt-3 text-muted-foreground">Kami fokus pada outcome bisnis, bukan sekadar deliverable teknis.</p>
          </div>
          <ul className="space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="grid place-items-center h-6 w-6 rounded-full bg-primary text-primary-foreground shrink-0"><Check className="h-3.5 w-3.5" /></span>
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      <SiteFooter brandName={data.settings.brand?.name ?? "KidoTech"} settings={data.settings} />
    </div>
  );
}
