import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import kidotechLogo from "@/assets/kidotech.png";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — KidoTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null); setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const redirectTo = typeof window !== "undefined" ? window.location.origin + "/admin" : undefined;
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: redirectTo, data: { full_name: name } },
        });
        if (error) throw error;
        setInfo("Akun dibuat. Jika konfirmasi email aktif, periksa inbox Anda — lalu hubungi admin untuk mendapat akses.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 text-primary-foreground relative overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
        <Link to="/" className="font-display text-xl font-bold inline-flex items-center gap-2">
          <img src={kidotechLogo} alt="KidoTech" className="inline-block h-7 w-7 brightness-0 invert" />
          KidoTech
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Control Center untuk seluruh konten website Anda.</h2>
          <p className="mt-4 text-primary-foreground/85 max-w-md">
            Kelola hero, layanan, project, partner, testimoni, FAQ, dan pesan masuk — semuanya di satu tempat.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">© {new Date().getFullYear()} KidoTech</p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 font-display text-lg font-bold mb-8">
            <img src={kidotechLogo} alt="KidoTech" className="inline-block h-7 w-7" />
            KidoTech
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{mode === "signin" ? "Masuk ke Admin" : "Buat akun"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" ? "Akses panel manajemen konten KidoTech." : "Daftar untuk membuat akun. Admin yang akan memberikan akses."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <Field label="Nama lengkap" value={name} onChange={setName} required />
            )}
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required />

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{mode === "signin" ? "Masuk" : "Daftar"} <ArrowRight className="h-4 w-4" /></>}
            </button>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-primary">{info}</p>}
          </form>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            {mode === "signin" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }} className="text-primary font-medium hover:underline">
              {mode === "signin" ? "Daftar" : "Masuk"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}{required && <span className="text-primary"> *</span>}</label>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
    </div>
  );
}
