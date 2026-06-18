import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Mail, Trash2, CheckCircle2, Circle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: MessagesInbox,
});

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

function MessagesInbox() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  const toggleRead = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("messages").update({ is_read: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "messages"] }); setSelected(null); },
  });

  const list = (data ?? []).filter((m) => filter === "all" || !m.is_read);
  const current = list.find((m) => m.id === selected) ?? list[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">Pesan dari form kontak publik.</p>
        </div>
        <div className="inline-flex rounded-full border border-border bg-card p-1 text-sm">
          <button onClick={() => setFilter("all")} className={"px-4 py-1.5 rounded-full font-medium " + (filter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>Semua</button>
          <button onClick={() => setFilter("unread")} className={"px-4 py-1.5 rounded-full font-medium " + (filter === "unread" ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>Belum dibaca</button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /></div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          <Mail className="h-10 w-10 mx-auto mb-3 opacity-50" />
          Belum ada pesan.
        </div>
      ) : (
        <div className="grid lg:grid-cols-[360px_1fr] gap-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border max-h-[70vh] overflow-y-auto">
            {list.map((m) => {
              const active = (current?.id ?? selected) === m.id;
              return (
                <button key={m.id} onClick={() => setSelected(m.id)}
                  className={"w-full text-left px-4 py-3 hover:bg-secondary/60 transition " + (active ? "bg-secondary" : "")}>
                  <div className="flex items-center gap-2">
                    {m.is_read ? <Circle className="h-3 w-3 text-muted-foreground" /> : <span className="h-2 w-2 rounded-full bg-primary inline-block" />}
                    <span className={"truncate font-medium " + (m.is_read ? "text-muted-foreground" : "")}>{m.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground shrink-0">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground truncate">{m.subject || m.message}</div>
                </button>
              );
            })}
          </div>

          {current && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{current.subject || "(Tanpa subject)"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Dari <strong className="text-foreground">{current.name}</strong> · <a href={`mailto:${current.email}`} className="text-primary hover:underline">{current.email}</a>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(current.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleRead.mutate({ id: current.id, value: !current.is_read })}
                    className="h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary" title={current.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}>
                    {current.is_read ? <Circle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </button>
                  <button onClick={() => { if (confirm("Hapus pesan ini?")) remove.mutate(current.id); }}
                    className="h-9 w-9 grid place-items-center rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <hr className="my-5 border-border" />
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{current.message}</p>
              <div className="mt-6">
                <a href={`mailto:${current.email}?subject=Re: ${encodeURIComponent(current.subject || "Pesan Anda")}`}
                  className="btn-primary">Balas via email</a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
