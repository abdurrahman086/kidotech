import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/_authenticated/admin/projects")({
  component: () => (
    <ResourceManager
      config={{
        table: "projects",
        title: "Projects / Portfolio",
        description: "Kelola showcase project untuk halaman portfolio.",
        orderBy: { column: "sort_order" },
        defaultValues: { is_active: true, is_featured: false, sort_order: 0 },
        fields: [
          { name: "title", label: "Judul project", type: "text", required: true, maxLength: 150 },
          { name: "slug", label: "Slug (URL friendly)", type: "text", maxLength: 100 },
          { name: "client", label: "Nama klien", type: "text", maxLength: 100 },
          { name: "category", label: "Kategori (IoT / Web App / Data / dst)", type: "text", maxLength: 50 },
          { name: "summary", label: "Ringkasan", type: "textarea", maxLength: 300, rows: 2 },
          { name: "description", label: "Deskripsi lengkap", type: "textarea", maxLength: 2000, rows: 5 },
          { name: "cover_url", label: "URL cover image", type: "url" },
          { name: "project_url", label: "URL project (opsional)", type: "url" },
          { name: "tags", label: "Tags", type: "tags" },
          { name: "sort_order", label: "Urutan", type: "number" },
          { name: "is_featured", label: "Featured (tampil di home)", type: "boolean" },
          { name: "is_active", label: "Tampilkan di website", type: "boolean" },
        ],
        columns: [
          { name: "title", label: "Judul" },
          { name: "category", label: "Kategori" },
          { name: "client", label: "Klien" },
        ],
      }}
    />
  ),
});
