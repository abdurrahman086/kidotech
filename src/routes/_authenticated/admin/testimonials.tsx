import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: () => (
    <ResourceManager
      config={{
        table: "testimonials",
        title: "Testimonials",
        description: "Testimoni klien yang tampil di halaman utama.",
        orderBy: { column: "sort_order" },
        defaultValues: { is_active: true, sort_order: 0, rating: 5 },
        fields: [
          { name: "author_name", label: "Nama", type: "text", required: true, maxLength: 100 },
          { name: "author_role", label: "Jabatan", type: "text", maxLength: 100 },
          { name: "company", label: "Perusahaan", type: "text", maxLength: 100 },
          { name: "quote", label: "Quote", type: "textarea", required: true, maxLength: 500, rows: 4 },
          { name: "avatar_url", label: "URL avatar (opsional)", type: "url" },
          { name: "rating", label: "Rating (1-5)", type: "number" },
          { name: "sort_order", label: "Urutan", type: "number" },
          { name: "is_active", label: "Tampilkan", type: "boolean" },
        ],
        columns: [
          { name: "author_name", label: "Nama" },
          { name: "company", label: "Perusahaan" },
          { name: "rating", label: "Rating" },
        ],
      }}
    />
  ),
});
