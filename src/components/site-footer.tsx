import { Link } from "@tanstack/react-router";
import { Twitter, Linkedin, Github, Mail, Phone, MapPin } from "lucide-react";
import type { SiteSettings } from "@/lib/cms";
import kidotechLogo from "@/assets/kidotech.png";

export function SiteFooter({ brandName = "KidoTech", settings }: { brandName?: string; settings?: SiteSettings }) {
  const contact = settings?.contact ?? {};
  const social = settings?.social ?? {};

  return (
    <footer className="border-t border-border bg-secondary/40 mt-24">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <img src={kidotechLogo} alt="KidoTech" className="inline-block h-7 w-7" />
            {brandName}
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            {settings?.brand?.tagline ??
              "Bridging Innovation and Connectivity. Tim teknologi terpercaya untuk membangun produk digital, IoT, dan infrastruktur Anda."}
          </p>
          <div className="mt-5 flex items-center gap-3">
            {social.twitter && (
              <a href={social.twitter} aria-label="Twitter" className="h-9 w-9 grid place-items-center rounded-full border border-border hover:bg-primary-soft hover:text-primary transition">
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} aria-label="LinkedIn" className="h-9 w-9 grid place-items-center rounded-full border border-border hover:bg-primary-soft hover:text-primary transition">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {social.github && (
              <a href={social.github} aria-label="GitHub" className="h-9 w-9 grid place-items-center rounded-full border border-border hover:bg-primary-soft hover:text-primary transition">
                <Github className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-4">Contact</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {contact.email && <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span className="break-all">{contact.email}</span></li>}
            {contact.phone && <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />{contact.phone}</li>}
            {contact.address && <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />{contact.address}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <p>Built with care for performance & scalability.</p>
        </div>
      </div>
    </footer>
  );
}
