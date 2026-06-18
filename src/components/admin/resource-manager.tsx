import { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff } from "lucide-react";

export type FieldDef =
  | { name: string; label: string; type: "text" | "url" | "email"; required?: boolean; maxLength?: number }
  | { name: string; label: string; type: "textarea"; required?: boolean; rows?: number; maxLength?: number }
  | { name: string; label: string; type: "number"; required?: boolean }
  | { name: string; label: string; type: "boolean" }
  | { name: string; label: string; type: "tags" }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[] };

export type ColumnDef = {
  name: string;
  label: string;
  render?: (row: Record<string, unknown>) => ReactNode;
};

export type ResourceConfig = {
  table: string;
  title: string;
  description?: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  orderBy?: { column: string; ascending?: boolean };
  defaultValues?: Record<string, unknown>;
};

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [creating, setCreating] = useState(false);

  const query = useQuery({
    queryKey: ["admin", config.table],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const q = (supabase.from(config.table as any) as any).select("*");
      if (config.orderBy) q.order(config.orderBy.column, { ascending: config.orderBy.ascending ?? true });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from(config.table as any) as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", config.table] }); qc.invalidateQueries({ queryKey: ["landing"] }); },
  });

  const toggleActiveMut = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from(config.table as any) as any).update({ is_active: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", config.table] }); qc.invalidateQueries({ queryKey: ["landing"] }); },
  });

  const onDelete = (id: string) => {
    if (!confirm("Hapus item ini? Tindakan ini tidak bisa dibatalkan.")) return;
    deleteMut.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{config.title}</h1>
          {config.description && <p className="text-sm text-muted-foreground mt-1">{config.description}</p>}
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Tambah baru
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {config.columns.map((c) => <th key={c.name} className="text-left px-4 py-3 font-semibold">{c.label}</th>)}
                <th className="text-right px-4 py-3 font-semibold w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {query.isLoading && (
                <tr><td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /></td></tr>
              )}
              {query.data && query.data.length === 0 && (
                <tr><td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">Belum ada data. Klik "Tambah baru" untuk memulai.</td></tr>
              )}
              {query.data?.map((row) => (
                <tr key={row.id as string} className="border-t border-border hover:bg-secondary/30">
                  {config.columns.map((c) => (
                    <td key={c.name} className="px-4 py-3 align-top">{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.name] ?? "—")}</td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {"is_active" in row && (
                        <button onClick={() => toggleActiveMut.mutate({ id: row.id as string, value: !row.is_active })}
                          title={row.is_active ? "Nonaktifkan" : "Aktifkan"}
                          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
                          {row.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        </button>
                      )}
                      <button onClick={() => setEditing(row as Record<string, unknown>)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => onDelete(row.id as string)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(creating || editing) && (
        <ResourceForm
          config={config}
          initial={editing ?? config.defaultValues ?? {}}
          onClose={() => { setCreating(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function ResourceForm({ config, initial, onClose }: { config: ResourceConfig; initial: Record<string, unknown>; onClose: () => void }) {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = { ...initial };
    config.fields.forEach((f) => {
      if (init[f.name] === undefined) {
        if (f.type === "boolean") init[f.name] = true;
        else if (f.type === "tags") init[f.name] = [];
        else if (f.type === "number") init[f.name] = 0;
        else init[f.name] = "";
      }
      if (f.type === "tags" && Array.isArray(init[f.name])) {
        // ok
      }
    });
    return init;
  });
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!initial.id;

  const save = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {};
      config.fields.forEach((f) => {
        let v = values[f.name];
        if (f.type === "number") v = Number(v);
        if (f.type === "tags" && typeof v === "string") {
          v = (v as string).split(",").map((s) => s.trim()).filter(Boolean);
        }
        payload[f.name] = v === "" ? null : v;
      });
      if (isEdit) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from(config.table as any) as any).update(payload).eq("id", initial.id as string);
        if (error) throw error;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from(config.table as any) as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", config.table] });
      qc.invalidateQueries({ queryKey: ["landing"] });
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-background border border-border rounded-2xl w-full max-w-2xl my-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-semibold">{isEdit ? "Edit" : "Tambah"} {config.title}</h2>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setError(null); save.mutate(); }}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          {config.fields.map((f) => {
            const v = values[f.name];
            if (f.type === "textarea") {
              return (
                <div key={f.name}>
                  <label className="text-sm font-medium">{f.label}{f.required && <span className="text-primary"> *</span>}</label>
                  <textarea rows={f.rows ?? 4} required={f.required} maxLength={f.maxLength}
                    value={(v as string) ?? ""}
                    onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
              );
            }
            if (f.type === "boolean") {
              return (
                <label key={f.name} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={!!v} onChange={(e) => setValues({ ...values, [f.name]: e.target.checked })} className="h-4 w-4 rounded border-input" />
                  <span className="text-sm font-medium">{f.label}</span>
                </label>
              );
            }
            if (f.type === "select") {
              return (
                <div key={f.name}>
                  <label className="text-sm font-medium">{f.label}</label>
                  <select value={(v as string) ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm">
                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              );
            }
            if (f.type === "tags") {
              const display = Array.isArray(v) ? (v as string[]).join(", ") : (v as string) ?? "";
              return (
                <div key={f.name}>
                  <label className="text-sm font-medium">{f.label}</label>
                  <input type="text" value={display}
                    onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                    placeholder="Pisahkan dengan koma"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm" />
                  <p className="mt-1 text-xs text-muted-foreground">Pisahkan dengan koma. Contoh: React, Supabase, IoT</p>
                </div>
              );
            }
            return (
              <div key={f.name}>
                <label className="text-sm font-medium">{f.label}{f.required && <span className="text-primary"> *</span>}</label>
                <input type={f.type} required={f.required}
                  maxLength={"maxLength" in f ? f.maxLength : undefined}
                  value={(v as string | number) ?? ""}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            );
          })}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">Batal</button>
            <button type="submit" disabled={save.isPending} className="btn-primary">
              {save.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
