import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchBlogPosts, type BlogPostRow } from "@/lib/cms";
import { CrudTable, FormActions, Modal, StatusPill } from "./crud-table";
import { Checkbox, Field, TextArea, TextInput } from "./field-inputs";

type Draft = Omit<BlogPostRow, "id"> & { id?: string };
const empty: Draft = { slug: "", title: "", category: "", post_date: "", read_time: "5 min", excerpt: "", content: "", sort_order: 0, published: true };

export function BlogPostsEditor() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["admin", "blog_posts"], queryFn: () => fetchBlogPosts(true) });
  const [editing, setEditing] = useState<Draft | null>(null);

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      if (d.id) { const { error } = await supabase.from("blog_posts").update(d).eq("id", d.id); if (error) throw error; }
      else { const { id: _d, ...rest } = d; const { error } = await supabase.from("blog_posts").insert(rest); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Post saved"); qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] }); qc.invalidateQueries({ queryKey: ["blog_posts"] }); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("blog_posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] }); qc.invalidateQueries({ queryKey: ["blog_posts"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <CrudTable
        title="Blog posts" rows={data} isLoading={isLoading} newLabel="New post"
        onNew={() => setEditing({ ...empty, sort_order: (data.at(-1)?.sort_order ?? 0) + 1 })}
        onEdit={(r) => setEditing(r)} onDelete={(r) => del.mutate(r.id)}
        columns={[
          { header: "Title", cell: (r) => <div><div className="font-semibold">{r.title}</div><div className="text-xs text-muted-foreground">/{r.slug}</div></div> },
          { header: "Category", cell: (r) => r.category },
          { header: "Date", cell: (r) => r.post_date },
          { header: "Read", cell: (r) => r.read_time },
          { header: "Status", cell: (r) => <StatusPill published={r.published} /> },
        ]}
      />
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit post" : "New post"}>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title"><TextInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required /></Field>
              <Field label="Slug"><TextInput value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required /></Field>
              <Field label="Category"><TextInput value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field>
              <Field label="Date"><TextInput value={editing.post_date} onChange={(e) => setEditing({ ...editing, post_date: e.target.value })} placeholder="Jul 2, 2026" /></Field>
              <Field label="Read time"><TextInput value={editing.read_time} onChange={(e) => setEditing({ ...editing, read_time: e.target.value })} /></Field>
              <Field label="Sort order"><TextInput type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Excerpt"><TextArea rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></Field>
            <Field label="Content (optional, markdown/plain)"><TextArea rows={6} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></Field>
            <Checkbox label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            <FormActions onCancel={() => setEditing(null)} submitting={save.isPending} />
          </form>
        )}
      </Modal>
    </>
  );
}