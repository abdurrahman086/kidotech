import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import kidotechLogo from "@/assets/kidotech.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader({ brandName = "KidoTech" }: { brandName?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60 relative">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold shrink-0">
          <img src={kidotechLogo} alt="KidoTech" className="inline-block h-7 w-7" />
          <span className="truncate">{brandName}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "transition hover:text-foreground " +
                  (active ? "text-foreground" : "text-muted-foreground")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/contact" className="btn-primary text-sm !py-2 !px-4">Get Started</Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute left-0 right-0 top-full border-t border-border/40 bg-background/80 backdrop-blur-2xl">
          <nav className="container-page py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
