import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

type Brand = { name: string; tagline: string };
type Contact = { email: string; phone: string; address: string };
type Social = { twitter: string; linkedin: string; github: string };

function SettingsPage() {
  const qc = useQueryClient();
  const [brand, setBrand] = useState<Brand>({ name: "", tagline: "" });
  const [contact, setContact] = useState<Contact>({ email: "", phone: "", address: "" });
  const [social, setSocial] = useState<Social>({ twitter: "", linkedin: "", github: "" });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!data) return;
    for (const row of data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const v = row.value as any;
      if (row.key === "brand") setBrand({ name: v?.name ?? "", tagline: v?.tagline ?? "" });
      if (row.key === "contact") setContact({ email: v?.email ?? "", phone: v?.phone ?? "", address: v?.address ?? "" });
      if (row.key === "social") setSocial({ twitter: v?.twitter ?? "", linkedin: v?.linkedin ?? "", github: v?.github ?? "" });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = [
        { key: "brand", value: brand },
        { key: "contact", value: contact },
        { key: "social", value: social },
      ];
      const { error } = await supabase.from("site_settings").upsert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      setSaved(true); setTimeout(() => setSaved(false), 2500);
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["landing"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  if (isLoading) return <div className="text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings Global</h1>
        <p className="text-sm text-muted-foreground mt-1">Brand, kontak, dan tautan media sosial.</p>
      </div>

      <Section title="Brand">
        <Field label="Nama brand" value={brand.name} onChange={(v) => setBrand({ ...brand, name: v })} />
        <Field label="Tagline" value={brand.tagline} onChange={(v) => setBrand({ ...brand, tagline: v })} />
      </Section>

      <Section title="Kontak">
        <Field label="Email" type="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} />
        <Field label="Telepon" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} />
        <Field label="Alamat" value={contact.address} onChange={(v) => setContact({ ...contact, address: v })} />
      </Section>

      <Section title="Sosial Media">
        <Field label="Twitter URL" value={social.twitter} onChange={(v) => setSocial({ ...social, twitter: v })} />
        <Field label="LinkedIn URL" value={social.linkedin} onChange={(v) => setSocial({ ...social, linkedin: v })} />
        <Field label="GitHub URL" value={social.github} onChange={(v) => setSocial({ ...social, github: v })} />
      </Section>

      <div className="flex items-center gap-3">
        <button onClick={() => { setError(null); save.mutate(); }} disabled={save.isPending} className="btn-primary">
          {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Simpan</>}
        </button>
        {saved && <span className="text-sm text-primary font-medium">Tersimpan ✓</span>}
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}
