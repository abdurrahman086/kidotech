import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/_authenticated/admin/hero")({
  component: () => (
    <ResourceManager
      config={{
        table: "hero_sections",
        title: "Hero Sections",
        description: "Konfigurasi tampilan hero di halaman utama. Hero aktif dengan urutan terkecil yang akan tampil.",
        orderBy: { column: "sort_order" },
        defaultValues: { is_active: true, sort_order: 0 },
        fields: [
          { name: "title", label: "Judul", type: "text", required: true, maxLength: 150 },
          { name: "highlight", label: "Highlight (kata berwarna)", type: "text", maxLength: 50 },
          { name: "subtitle", label: "Subtitle", type: "textarea", maxLength: 400, rows: 3 },
          { name: "cta_label", label: "Label tombol CTA", type: "text", maxLength: 50 },
          { name: "cta_url", label: "URL CTA", type: "text", maxLength: 200 },
          { name: "image_url", label: "URL gambar hero (kosongkan = default)", type: "url" },
          { name: "sort_order", label: "Urutan", type: "number" },
          { name: "is_active", label: "Aktif", type: "boolean" },
        ],
        columns: [
          { name: "title", label: "Judul" },
          { name: "highlight", label: "Highlight" },
          { name: "sort_order", label: "Urutan" },
        ],
      }}
    />
  ),
});
