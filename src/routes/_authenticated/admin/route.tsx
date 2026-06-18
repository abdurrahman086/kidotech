import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Inbox, Sparkles, Layers, Briefcase, Users, MessageSquareQuote,
  GitBranch, HelpCircle, Settings, LogOut, ShieldAlert, Menu, X,
} from "lucide-react";
import kidotechLogo from "@/assets/kidotech.png";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/messages", label: "Inbox", icon: Inbox },
  { to: "/admin/hero", label: "Hero", icon: Sparkles },
  { to: "/admin/services", label: "Services", icon: Layers },
  { to: "/admin/projects", label: "Projects", icon: Briefcase },
  { to: "/admin/partners", label: "Partners", icon: Users },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/process", label: "Process", icon: GitBranch },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const { data: roleCheck, isLoading } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return { admin: false, email: null as string | null };
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.user.id);
      if (error) throw error;
      return { admin: (data ?? []).some((r) => r.role === "admin"), email: u.user.email ?? null, userId: u.user.id };
    },
  });

  useEffect(() => { setOpen(false); }, [pathname]);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isLoading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground text-sm">Loading…</div>;
  }

  if (!roleCheck?.admin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-6">
        <div className="max-w-md text-center rounded-2xl border border-border bg-card p-8">
          <ShieldAlert className="h-10 w-10 mx-auto text-primary" />
          <h1 className="mt-4 text-xl font-bold">Akses ditolak</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Akun Anda ({roleCheck?.email}) belum memiliki role admin. Minta admin untuk memberikan akses.
          </p>
          {roleCheck?.userId && (
            <p className="mt-3 text-xs text-muted-foreground break-all">
              User ID: <code className="font-mono">{roleCheck.userId}</code>
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to="/" className="btn-ghost">Ke beranda</Link>
            <button onClick={signOut} className="btn-primary">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className={"lg:sticky lg:top-0 lg:h-screen border-r border-border bg-card flex flex-col " + (open ? "fixed inset-y-0 left-0 z-50 w-[260px]" : "hidden lg:flex")}>
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          <Link to="/" className="flex items-center gap-2 font-display font-bold">
            <img src={kidotechLogo} alt="KidoTech" className="inline-block h-7 w-7" />
            KidoTech
          </Link>
          <button className="lg:hidden h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to) && (item.to !== "/admin" || pathname === "/admin");
            return (
              <Link key={item.to} to={item.to}
                className={"flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition " + (active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{roleCheck.email}</div>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-foreground/40 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 h-14 px-4 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur">
          <button onClick={() => setOpen(true)} className="h-9 w-9 grid place-items-center rounded-lg border border-border"><Menu className="h-4 w-4" /></button>
          <span className="font-semibold">Admin</span>
          <span className="w-9" />
        </header>
        <main className="flex-1 p-5 md:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
