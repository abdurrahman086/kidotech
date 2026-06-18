import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { landingQueryOptions } from "@/lib/cms";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const ease = [0.22, 1, 0.36, 1] as const;

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — KidoTech" },
      { name: "description", content: "Lihat berbagai project teknologi yang telah dikerjakan KidoTech: web app, IoT, dashboard analytics, dan banyak lagi." },
      { property: "og:title", content: "Portfolio — KidoTech" },
      { property: "og:description", content: "Project-project nyata dari klien KidoTech." },
    ],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(landingQueryOptions); },
  component: PortfolioPage,
});

function PortfolioPage() {
  const { data } = useSuspenseQuery(landingQueryOptions);
  const categories = useMemo(() => {
    const set = new Set<string>();
    data.projects.forEach((p) => p.category && set.add(p.category));
    return ["Semua", ...Array.from(set)];
  }, [data.projects]);
  const [filter, setFilter] = useState("Semua");
  const visible = filter === "Semua" ? data.projects : data.projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader brandName={data.settings.brand?.name ?? "KidoTech"} />

      <section className="container-page pt-16 md:pt-24 pb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="text-xs font-semibold tracking-[0.25em] text-primary uppercase"
        >
          Portfolio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="mt-3 text-4xl md:text-6xl font-bold max-w-3xl mx-auto"
        >
          Project yang <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>berbicara</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-5 text-muted-foreground max-w-xl mx-auto"
        >
          Pilihan project terbaik dari klien lintas industri.
        </motion.p>
      </section>

      <section className="container-page pb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={"px-4 py-2 rounded-full text-sm font-medium transition border " + (filter === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/40")}>
              {c}
            </button>
          ))}
        </motion.div>
      </section>

      <section className="container-page pb-20">
        {visible.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">Belum ada project di kategori ini.</p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.06 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {visible.map((p) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease }}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition flex flex-col"
              >
                {p.cover_url && (
                  <div className="aspect-[16/10] overflow-hidden bg-secondary">
                    <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-xs text-muted-foreground font-medium">{p.category}{p.client && ` · ${p.client}`}</div>
                  <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{p.summary}</p>
                  {p.tags && p.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[10px] font-medium px-2 py-1 rounded-full bg-primary-soft text-primary">{t}</span>
                      ))}
                    </div>
                  )}
                  {p.project_url && (
                    <a href={p.project_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                      Lihat project <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="container-page pb-20"
      >
        <div className="rounded-3xl p-10 md:p-14 text-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <h2 className="text-3xl md:text-4xl font-bold">Project Anda berikutnya?</h2>
          <p className="mt-3 text-primary-foreground/85">Mari kita buat sesuatu yang luar biasa.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 font-semibold hover:bg-background/90 transition">
            Mulai sekarang <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.section>

      <SiteFooter brandName={data.settings.brand?.name ?? "KidoTech"} settings={data.settings} />
    </div>
  );
}
