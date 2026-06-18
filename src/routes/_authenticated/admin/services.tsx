import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: () => (
    <ResourceManager
      config={{
        table: "services",
        title: "Layanan / Produk",
        description: "Kelola daftar layanan yang tampil di halaman publik.",
        orderBy: { column: "sort_order" },
        defaultValues: { is_active: true, sort_order: 0 },
        fields: [
          { name: "title", label: "Judul", type: "text", required: true, maxLength: 120 },
          { name: "description", label: "Deskripsi", type: "textarea", required: true, maxLength: 500 },
          { name: "icon", label: "Icon (Code2, Cpu, Wrench, ShieldCheck, Network, Cloud, Shield, LineChart)", type: "text" },
          { name: "sort_order", label: "Urutan", type: "number" },
          { name: "is_active", label: "Tampilkan di website", type: "boolean" },
        ],
        columns: [
          { name: "title", label: "Judul" },
          { name: "icon", label: "Icon" },
          { name: "sort_order", label: "Urutan" },
        ],
      }}
    />
  ),
});
