import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchCourses, type CourseRow } from "@/lib/cms";
import { CrudTable, FormActions, Modal, StatusPill } from "./crud-table";
import { Checkbox, Field, TextInput } from "./field-inputs";

type Draft = Omit<CourseRow, "id"> & { id?: string };
const empty: Draft = { title: "", track: "", weeks: 4, level: "", price: "", sort_order: 0, published: true };

export function CoursesEditor() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin", "courses"], queryFn: () => fetchCourses(true) });
  const [editing, setEditing] = useState<Draft | null>(null);

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      if (d.id) { const { error } = await supabase.from("courses").update(d).eq("id", d.id); if (error) throw error; }
      else { const { id: _d, ...rest } = d; const { error } = await supabase.from("courses").insert(rest); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Course saved"); qc.invalidateQueries({ queryKey: ["admin", "courses"] }); qc.invalidateQueries({ queryKey: ["courses"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("courses").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "courses"] }); qc.invalidateQueries({ queryKey: ["courses"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <CrudTable
        title="Courses" rows={data} isLoading={isLoading} newLabel="New course"
        onNew={() => setEditing({ ...empty, sort_order: (data.at(-1)?.sort_order ?? 0) + 1 })}
        onEdit={(r) => setEditing(r)} onDelete={(r) => del.mutate(r.id)}
        columns={[
          { header: "Title", cell: (r) => <div className="font-semibold">{r.title}</div> },
          { header: "Track", cell: (r) => r.track },
          { header: "Weeks", cell: (r) => r.weeks },
          { header: "Price", cell: (r) => r.price },
          { header: "Status", cell: (r) => <StatusPill published={r.published} /> },
        ]}
      />
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit course" : "New course"}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }} className="space-y-4">
            <Field label="Title"><TextInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Track"><TextInput value={editing.track} onChange={(e) => setEditing({ ...editing, track: e.target.value })} /></Field>
              <Field label="Level"><TextInput value={editing.level} onChange={(e) => setEditing({ ...editing, level: e.target.value })} /></Field>
              <Field label="Weeks"><TextInput type="number" value={editing.weeks} onChange={(e) => setEditing({ ...editing, weeks: Number(e.target.value) })} /></Field>
              <Field label="Price"><TextInput value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></Field>
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