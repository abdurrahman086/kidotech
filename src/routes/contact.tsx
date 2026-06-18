import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight, Clock, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { landingQueryOptions } from "@/lib/cms";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const ease = [0.22, 1, 0.36, 1] as const;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontak — KidoTech" },
      { name: "description", content: "Hubungi tim KidoTech untuk konsultasi project website, IoT, troubleshooting, dan managed services." },
      { property: "og:title", content: "Kontak — KidoTech" },
      { property: "og:description", content: "Konsultasi gratis untuk project teknologi Anda." },
    ],
  }),
  loader: ({ context }) => { context.queryClient.ensureQueryData(landingQueryOptions); },
  component: ContactPage,
});

function ContactPage() {
  const { data } = useSuspenseQuery(landingQueryOptions);
  const contact = data.settings.contact ?? {};
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      const { error } = await supabase.from("messages").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => { setSent(true); setForm({ name: "", email: "", subject: "", message: "" }); },
    onError: (e: Error) => setError(e.message),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.length > 100 || form.email.length > 255 || form.message.length > 2000) {
      setError("Input terlalu panjang"); return;
    }
    mutation.mutate(form);
  };

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
          Kontak
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="mt-3 text-4xl md:text-6xl font-bold max-w-3xl mx-auto"
        >
          Mari diskusikan <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>project Anda</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-5 text-muted-foreground max-w-xl mx-auto"
        >
          Tim kami akan menghubungi Anda dalam 1 hari kerja untuk diskusi awal yang tidak mengikat.
        </motion.p>
      </section>

      <section className="container-page pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.08 }}
          className="grid lg:grid-cols-[1fr_1.4fr] gap-8"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease }}
            className="space-y-4"
          >
            {contact.email && (
              <InfoCard icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
            )}
            {contact.phone && (
              <InfoCard icon={Phone} label="Telepon" value={contact.phone} href={`tel:${contact.phone.replace(/\s/g, "")}`} />
            )}
            {contact.address && (
              <InfoCard icon={MapPin} label="Alamat" value={contact.address} />
            )}
            <InfoCard icon={Clock} label="Jam Operasional" value="Senin–Jumat, 09:00–18:00 WIB" />
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nama" value={form.name} maxLength={100} onChange={(v) => setForm({ ...form, name: v })} required />
              <Field label="Email" type="email" maxLength={255} value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            </div>
            <Field label="Subject" maxLength={200} value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
            <div>
              <label className="text-sm font-medium">Pesan <span className="text-primary">*</span></label>
              <textarea required maxLength={2000} rows={6} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
            </div>
            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full disabled:opacity-60">
              {mutation.isPending ? "Mengirim…" : "Kirim pesan"} <ArrowRight className="h-4 w-4" />
            </button>
            {sent && <p className="text-sm text-primary font-medium flex items-center gap-2"><MessageCircle className="h-4 w-4" /> Terima kasih — kami akan menghubungi Anda segera.</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </motion.form>
        </motion.div>
      </section>

      <SiteFooter brandName={data.settings.brand?.name ?? "KidoTech"} settings={data.settings} />
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href?: string }) {
  const inner = (
    <div className="rounded-2xl border border-border bg-card p-5 flex items-start gap-4 hover:border-primary/40 transition">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">{label}</div>
        <div className="mt-1 font-medium break-words">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

function Field({ label, value, onChange, type = "text", required, maxLength }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; maxLength?: number }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}{required && <span className="text-primary"> *</span>}</label>
      <input type={type} required={required} maxLength={maxLength} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
    </div>
  );
}
