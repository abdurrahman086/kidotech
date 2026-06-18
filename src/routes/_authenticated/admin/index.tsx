import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, Layers, Briefcase, Users, MessageSquareQuote, HelpCircle, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const tables = ["messages", "services", "projects", "partners", "testimonials", "faqs"] as const;
      const counts: Record<string, number> = {};
      await Promise.all(tables.map(async (t) => {
        const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
        counts[t] = count ?? 0;
      }));
      const { count: unread } = await supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false);
      counts["unread"] = unread ?? 0;
      return counts;
    },
  });

  const cards = [
    { to: "/admin/messages", label: "Pesan Masuk", value: stats.data?.messages ?? 0, sub: `${stats.data?.unread ?? 0} belum dibaca`, icon: Inbox },
    { to: "/admin/services", label: "Layanan", value: stats.data?.services ?? 0, icon: Layers },
    { to: "/admin/projects", label: "Projects", value: stats.data?.projects ?? 0, icon: Briefcase },
    { to: "/admin/partners", label: "Partners", value: stats.data?.partners ?? 0, icon: Users },
    { to: "/admin/testimonials", label: "Testimonials", value: stats.data?.testimonials ?? 0, icon: MessageSquareQuote },
    { to: "/admin/faqs", label: "FAQs", value: stats.data?.faqs ?? 0, icon: HelpCircle },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan konten dan aktivitas terkini.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition">
            <div className="flex items-start justify-between">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <c.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
            </div>
            <div className="mt-4 text-3xl font-bold">{stats.isLoading ? "…" : c.value}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
            {c.sub && <div className="mt-2 text-xs text-primary font-medium">{c.sub}</div>}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Tips</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• Gunakan menu di sebelah kiri untuk mengelola tiap section website.</li>
          <li>• Toggle "mata" pada setiap item untuk publish / unpublish secara cepat.</li>
          <li>• Perubahan langsung tercermin di website publik setelah Anda menyimpan.</li>
        </ul>
      </div>
    </div>
  );
}
