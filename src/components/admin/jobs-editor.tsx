import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchJobs, type JobRow } from "@/lib/cms";
import { CrudTable, FormActions, Modal, StatusPill } from "./crud-table";
import { Checkbox, Field, TextArea, TextInput } from "./field-inputs";

type Draft = Omit<JobRow, "id"> & { id?: string };
const empty: Draft = { title: "", team: "", location: "", employment_type: "Full-time", description: "", sort_order: 0, published: true };

export function JobsEditor() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin", "jobs"], queryFn: () => fetchJobs(true) });
  const [editing, setEditing] = useState<Draft | null>(null);

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      if (d.id) { const { error } = await supabase.from("jobs").update(d).eq("id", d.id); if (error) throw error; }
      else { const { id: _d, ...rest } = d; const { error } = await supabase.from("jobs").insert(rest); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Job saved"); qc.invalidateQueries({ queryKey: ["admin", "jobs"] }); qc.invalidateQueries({ queryKey: ["jobs"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("jobs").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "jobs"] }); qc.invalidateQueries({ queryKey: ["jobs"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <CrudTable
        title="Jobs" rows={data} isLoading={isLoading} newLabel="New job"
        onNew={() => setEditing({ ...empty, sort_order: (data.at(-1)?.sort_order ?? 0) + 1 })}
        onEdit={(r) => setEditing(r)} onDelete={(r) => del.mutate(r.id)}
        columns={[
          { header: "Title", cell: (r) => <div className="font-semibold">{r.title}</div> },
          { header: "Team", cell: (r) => r.team },
          { header: "Location", cell: (r) => r.location },
          { header: "Type", cell: (r) => r.employment_type },
          { header: "Status", cell: (r) => <StatusPill published={r.published} /> },
        ]}
      />
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit job" : "New job"}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }} className="space-y-4">
            <Field label="Title"><TextInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Team"><TextInput value={editing.team} onChange={(e) => setEditing({ ...editing, team: e.target.value })} /></Field>
              <Field label="Location"><TextInput value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></Field>
              <Field label="Type"><TextInput value={editing.employment_type} onChange={(e) => setEditing({ ...editing, employment_type: e.target.value })} /></Field>
              <Field label="Sort order"><TextInput type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Description (optional)"><TextArea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Checkbox label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            <FormActions onCancel={() => setEditing(null)} submitting={save.isPending} />
          </form>
        )}
      </Modal>
    </>
  );
}