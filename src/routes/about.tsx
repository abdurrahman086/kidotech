import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Users, Target, Heart, Zap } from "lucide-react";
import { landingQueryOptions } from "@/lib/cms";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const ease = [0.22, 1, 0.36, 1] as const;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — KidoTech" },
      { name: "description", content: "KidoTech adalah tim engineering yang membangun produk digital, IoT, dan infrastruktur untuk bisnis modern." },
      { property: "og:title", content: "Tentang Kami — KidoTech" },
      { property: "og:description", content: "Tim engineering KidoTech: visi, misi, dan nilai yang membedakan kami." },
    ],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(landingQueryOptions); },
  component: AboutPage,
});

const VALUES = [
  { icon: Target, title: "Outcome-Oriented", body: "Kami mengukur kesuksesan dari dampak bisnis, bukan baris kode." },
  { icon: Heart, title: "Transparan", body: "Komunikasi terbuka, timeline jelas, dan tidak ada kejutan di tengah jalan." },
  { icon: Zap, title: "Iterasi Cepat", body: "Rilis demo mingguan agar Anda selalu melihat progress nyata." },
  { icon: Users, title: "Partner Jangka Panjang", body: "Kami tidak menghilang setelah project rilis — support berkelanjutan." },
];

const STATS = [
  { value: "50+", label: "Project diselesaikan" },
  { value: "30+", label: "Klien aktif" },
  { value: "99.9%", label: "Uptime managed services" },
  { value: "< 24j", label: "Response time" },
];

function AboutPage() {
  const { data } = useSuspenseQuery(landingQueryOptions);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader brandName={data.settings.brand?.name ?? "KidoTech"} />

      <section className="container-page pt-16 md:pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="max-w-3xl"
        >
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">Tentang Kami</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold">
            Tim engineering yang <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>membangun masa depan</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            KidoTech berdiri dengan satu misi: menjadi mitra teknologi yang dapat diandalkan bagi bisnis dan organisasi di Indonesia.
            Kami percaya teknologi yang baik adalah teknologi yang menyelesaikan masalah nyata.
          </p>
        </motion.div>
      </section>

      <section className="container-page py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease }}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
                {s.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container-page py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.25em] text-primary uppercase">Nilai kami</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-bold">Cara kami bekerja</h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {VALUES.map((v) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="container-page py-16"
      >
        <div className="rounded-3xl p-10 md:p-14 text-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <h2 className="text-3xl md:text-4xl font-bold">Mari bekerja sama</h2>
          <p className="mt-3 text-primary-foreground/85 max-w-xl mx-auto">
            Ceritakan kebutuhan Anda — kami siap membantu menemukan solusi yang tepat.
          </p>
          <Link to="/contact" className="mt-7 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 font-semibold hover:bg-background/90 transition">
            Mulai percakapan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.section>

      <SiteFooter brandName={data.settings.brand?.name ?? "KidoTech"} settings={data.settings} />
    </div>
  );
}
