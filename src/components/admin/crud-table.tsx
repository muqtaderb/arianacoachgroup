import { useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function CrudTable<T extends { id: string }>({
  title,
  description,
  rows,
  columns,
  isLoading,
  onNew,
  onEdit,
  onDelete,
  newLabel = "New",
  emptyText = "Nothing here yet.",
}: {
  title: string;
  description?: string;
  rows: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onNew: () => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  newLabel?: string;
  emptyText?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border p-5">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-1 rounded-full bg-accent-gradient px-4 py-2 text-sm font-semibold text-accent-foreground"
        >
          <Plus className="h-4 w-4" /> {newLabel}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.header} className={`px-4 py-3 text-left font-semibold ${c.className ?? ""}`}>{c.header}</th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center text-muted-foreground">Loading…</td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center text-muted-foreground">{emptyText}</td></tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                {columns.map((c) => (
                  <td key={c.header} className={`px-4 py-3 align-top ${c.className ?? ""}`}>{c.cell(row)}</td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button onClick={() => onEdit(row)} className="rounded-md p-2 hover:bg-muted" title="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { if (confirm("Delete this item?")) onDelete(row); }} className="rounded-md p-2 text-destructive hover:bg-destructive/10" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-3xl rounded-2xl border border-border bg-card shadow-elegant">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function StatusPill({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest ${published ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function FormActions({ onCancel, submitting }: { onCancel: () => void; submitting?: boolean }) {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <button type="button" onClick={onCancel} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted">Cancel</button>
      <button type="submit" disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
        {submitting ? "Saving…" : "Save"}
      </button>
    </div>
  );
}