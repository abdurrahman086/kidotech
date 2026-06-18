import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/_authenticated/admin/process")({
  component: () => (
    <ResourceManager
      config={{
        table: "process_steps",
        title: "Process Steps",
        description: "Tahapan proses kerja yang tampil di halaman utama.",
        orderBy: { column: "step_number" },
        defaultValues: { is_active: true, step_number: 1 },
        fields: [
          { name: "step_number", label: "Nomor step", type: "number", required: true },
          { name: "title", label: "Judul", type: "text", required: true, maxLength: 100 },
          { name: "description", label: "Deskripsi", type: "textarea", required: true, maxLength: 400 },
          { name: "icon", label: "Icon (MessageSquare, PenTool, Code2, Rocket, dst)", type: "text" },
          { name: "is_active", label: "Tampilkan", type: "boolean" },
        ],
        columns: [
          { name: "step_number", label: "#" },
          { name: "title", label: "Judul" },
        ],
      }}
    />
  ),
});
