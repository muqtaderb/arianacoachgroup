import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchServices, type ServiceRow } from "@/lib/cms";
import { CrudTable, FormActions, Modal, StatusPill } from "./crud-table";
import { Checkbox, Field, TextArea, TextInput } from "./field-inputs";

type Draft = Omit<ServiceRow, "id"> & { id?: string };

const empty: Draft = {
  slug: "", title: "", tagline: "", description: "",
  outcomes: [], plans: [], faqs: [], sort_order: 0, published: true,
};

export function ServicesEditor() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin", "services"], queryFn: () => fetchServices(true) });
  const [editing, setEditing] = useState<Draft | null>(null);

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = { ...d, outcomes: d.outcomes, plans: d.plans, faqs: d.faqs };
      if (d.id) {
        const { error } = await supabase.from("services").update(payload).eq("id", d.id);
        if (error) throw error;
      } else {
        const { id: _drop, ...rest } = payload;
        const { error } = await supabase.from("services").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Service saved"); qc.invalidateQueries({ queryKey: ["admin", "services"] }); qc.invalidateQueries({ queryKey: ["services"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "services"] }); qc.invalidateQueries({ queryKey: ["services"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <CrudTable
        title="Services"
        description="Each service has its own page at /services/{slug}. Plans, outcomes and FAQs are edited as JSON."
        rows={data}
        isLoading={isLoading}
        onNew={() => setEditing({ ...empty, sort_order: (data.at(-1)?.sort_order ?? 0) + 1 })}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => del.mutate(r.id)}
        newLabel="New service"
        columns={[
          { header: "Title", cell: (r) => <div><div className="font-semibold">{r.title}</div><div className="text-xs text-muted-foreground">/{r.slug}</div></div> },
          { header: "Tagline", cell: (r) => <span className="text-muted-foreground">{r.tagline}</span> },
          { header: "Order", cell: (r) => r.sort_order },
          { header: "Status", cell: (r) => <StatusPill published={r.published} /> },
        ]}
      />
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit service" : "New service"}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title"><TextInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></Field>
              <Field label="Slug" hint="URL path"><TextInput value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required /></Field>
            </div>
            <Field label="Tagline"><TextInput value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></Field>
            <Field label="Description"><TextArea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Field label='Outcomes (JSON array of strings)' hint='Example: ["Item 1","Item 2"]'>
              <TextArea rows={4} value={JSON.stringify(editing.outcomes, null, 2)} onChange={(e) => { try { setEditing({ ...editing, outcomes: JSON.parse(e.target.value) }); } catch { /* keep last valid */ } }} />
            </Field>
            <Field label="Plans (JSON)" hint='[{"name":"Basic","price":"$X","period":"/mo","features":["a","b"],"highlighted":false}]'>
              <TextArea rows={7} value={JSON.stringify(editing.plans, null, 2)} onChange={(e) => { try { setEditing({ ...editing, plans: JSON.parse(e.target.value) }); } catch {} }} />
            </Field>
            <Field label="FAQs (JSON)" hint='[{"q":"Question?","a":"Answer."}]'>
              <TextArea rows={5} value={JSON.stringify(editing.faqs, null, 2)} onChange={(e) => { try { setEditing({ ...editing, faqs: JSON.parse(e.target.value) }); } catch {} }} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Sort order"><TextInput type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></Field>
              <div className="flex items-end"><Checkbox label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} /></div>
            </div>
            <FormActions onCancel={() => setEditing(null)} submitting={save.isPending} />
          </form>
        )}
      </Modal>
    </>
  );
}