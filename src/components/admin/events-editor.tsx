import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchEvents, type EventRow } from "@/lib/cms";
import { CrudTable, FormActions, Modal, StatusPill } from "./crud-table";
import { Checkbox, Field, TextArea, TextInput } from "./field-inputs";

type Draft = Omit<EventRow, "id"> & { id?: string };
const empty: Draft = { title: "", event_date: "", location: "", tag: "Public", description: "", is_featured: false, ticket_tiers: [], sort_order: 0, published: true };

export function EventsEditor() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin", "events"], queryFn: () => fetchEvents(true) });
  const [editing, setEditing] = useState<Draft | null>(null);

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      if (d.id) { const { error } = await supabase.from("events").update(d).eq("id", d.id); if (error) throw error; }
      else { const { id: _d, ...rest } = d; const { error } = await supabase.from("events").insert(rest); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Event saved"); qc.invalidateQueries({ queryKey: ["admin", "events"] }); qc.invalidateQueries({ queryKey: ["events"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("events").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "events"] }); qc.invalidateQueries({ queryKey: ["events"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <CrudTable
        title="Events" rows={data} isLoading={isLoading} newLabel="New event"
        onNew={() => setEditing({ ...empty, sort_order: (data.at(-1)?.sort_order ?? 0) + 1 })}
        onEdit={(r) => setEditing(r)} onDelete={(r) => del.mutate(r.id)}
        columns={[
          { header: "Title", cell: (r) => <div className="font-semibold">{r.title}{r.is_featured && <span className="ml-2 rounded-full bg-brand-orange/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand-orange">Featured</span>}</div> },
          { header: "Date", cell: (r) => r.event_date },
          { header: "Location", cell: (r) => r.location },
          { header: "Status", cell: (r) => <StatusPill published={r.published} /> },
        ]}
      />
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit event" : "New event"}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }} className="space-y-4">
            <Field label="Title"><TextInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Date"><TextInput value={editing.event_date} onChange={(e) => setEditing({ ...editing, event_date: e.target.value })} placeholder="e.g. March 14, 2026" /></Field>
              <Field label="Location"><TextInput value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></Field>
              <Field label="Tag"><TextInput value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></Field>
              <Field label="Sort order"><TextInput type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Description"><TextArea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Field label='Ticket tiers (JSON)' hint='[{"name":"General","price":"$149"}]'>
              <TextArea rows={4} value={JSON.stringify(editing.ticket_tiers, null, 2)} onChange={(e) => { try { setEditing({ ...editing, ticket_tiers: JSON.parse(e.target.value) }); } catch {} }} />
            </Field>
            <div className="flex gap-4">
              <Checkbox label="Featured" checked={editing.is_featured} onChange={(v) => setEditing({ ...editing, is_featured: v })} />
              <Checkbox label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            </div>
            <FormActions onCancel={() => setEditing(null)} submitting={save.isPending} />
          </form>
        )}
      </Modal>
    </>
  );
}