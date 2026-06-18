import {
  Network, Cloud, Shield, ShieldCheck, Cpu, Code2, LineChart, Wrench,
  MessageSquare, PenTool, Rocket, Sparkles, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Network, Cloud, Shield, ShieldCheck, Cpu, Code2, LineChart, Wrench,
  MessageSquare, PenTool, Rocket, Sparkles,
};

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const Cmp = (name && ICONS[name]) || Sparkles;
  return <Cmp className={className} />;
}
