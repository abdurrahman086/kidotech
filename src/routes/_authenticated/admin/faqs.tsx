import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/resource-manager";

export const Route = createFileRoute("/_authenticated/admin/faqs")({
  component: () => (
    <ResourceManager
      config={{
        table: "faqs",
        title: "FAQs",
        description: "Pertanyaan yang sering ditanyakan untuk section FAQ.",
        orderBy: { column: "sort_order" },
        defaultValues: { is_active: true, sort_order: 0 },
        fields: [
          { name: "question", label: "Pertanyaan", type: "text", required: true, maxLength: 300 },
          { name: "answer", label: "Jawaban", type: "textarea", required: true, maxLength: 2000, rows: 5 },
          { name: "category", label: "Kategori (opsional)", type: "text", maxLength: 50 },
          { name: "sort_order", label: "Urutan", type: "number" },
          { name: "is_active", label: "Tampilkan", type: "boolean" },
        ],
        columns: [
          { name: "question", label: "Pertanyaan" },
          { name: "sort_order", label: "Urutan" },
        ],
      }}
    />
  ),
});
