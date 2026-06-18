import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/_authenticated/admin/partners")({
  component: () => (
    <ResourceManager
      config={{
        table: "partners",
        title: "Partners",
        description: "Logo perusahaan mitra di section Trusted By.",
        orderBy: { column: "sort_order" },
        defaultValues: { is_active: true, sort_order: 0 },
        fields: [
          { name: "name", label: "Nama", type: "text", required: true, maxLength: 100 },
          { name: "logo_url", label: "URL logo", type: "url" },
          { name: "website_url", label: "URL website (opsional)", type: "url" },
          { name: "sort_order", label: "Urutan", type: "number" },
          { name: "is_active", label: "Tampilkan", type: "boolean" },
        ],
        columns: [
          { name: "name", label: "Nama" },
          { name: "sort_order", label: "Urutan" },
        ],
      }}
    />
  ),
});
