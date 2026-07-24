import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchSiteSettings, type SiteSettings } from "@/lib/cms";
import { Field, TextArea, TextInput } from "./field-inputs";

export function SiteSettingsEditor() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["site_settings"], queryFn: fetchSiteSettings });
  const [form, setForm] = useState<SiteSettings>({ phone: "", email: "", address: "", office_hours: "" });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async (values: SiteSettings) => {
      const { error } = await supabase.from("site_settings").update(values).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Site info updated");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); save.mutate(form); }}
      className="max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">Site info</h2>
        <p className="text-sm text-muted-foreground">Contact details shown in the header, footer and contact page.</p>
      </div>
      <Field label="Phone">
        <TextInput value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </Field>
      <Field label="Email">
        <TextInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Field>
      <Field label="Address">
        <TextArea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </Field>
      <Field label="Office hours">
        <TextArea rows={2} value={form.office_hours} onChange={(e) => setForm({ ...form, office_hours: e.target.value })} />
      </Field>
      <div className="flex justify-end">
        <button type="submit" disabled={save.isPending} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {save.isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}