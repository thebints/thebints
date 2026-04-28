import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { toast } from "sonner";

interface ReportRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  report_date: string;
  file_url: string;
  file_size_bytes: number | null;
  cover_image_url: string | null;
  published: boolean;
}

const CATEGORIES = ["Annual Report", "Programme Report", "Financial Report", "Impact Brief", "Newsletter", "Case Study"];
const empty = { title: "", description: "", category: CATEGORIES[0], report_date: new Date().toISOString().slice(0, 10), published: true };

const fmtSize = (b: number | null) => {
  if (!b) return "";
  const mb = b / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;
};

const AdminReports = () => {
  const [items, setItems] = useState<ReportRow[]>([]);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("impact_reports").select("*").order("report_date", { ascending: false });
    setItems((data as ReportRow[]) || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!file) { toast.error("Please choose a PDF file"); return; }
    if (file.type !== "application/pdf") { toast.error("Only PDF files are allowed"); return; }
    if (file.size > 25 * 1024 * 1024) { toast.error("Max file size is 25 MB"); return; }

    setBusy(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("impact-reports").upload(path, file, {
        contentType: "application/pdf",
        cacheControl: "3600",
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("impact-reports").getPublicUrl(path);

      const { error } = await supabase.from("impact_reports").insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        category: form.category,
        report_date: form.report_date,
        file_url: pub.publicUrl,
        file_size_bytes: file.size,
        published: form.published,
      });
      if (error) throw error;

      toast.success("Report uploaded");
      setForm(empty);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (r: ReportRow) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    // Best-effort storage cleanup
    try {
      const url = new URL(r.file_url);
      const idx = url.pathname.indexOf("/impact-reports/");
      if (idx >= 0) {
        const path = decodeURIComponent(url.pathname.slice(idx + "/impact-reports/".length));
        await supabase.storage.from("impact-reports").remove([path]);
      }
    } catch { /* ignore */ }
    const { error } = await supabase.from("impact_reports").delete().eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="eyebrow text-accent">Manage</div>
      <h1 className="font-display text-3xl font-bold text-primary mt-1">Impact Reports</h1>
      <p className="text-sm text-muted-foreground mt-2">Upload PDF reports for visitors to view and download from the website.</p>
      <div className="gold-bar mt-4" />

      <form onSubmit={submit} className="mt-8 bg-card border border-border p-6 grid sm:grid-cols-2 gap-4">
        <h2 className="sm:col-span-2 font-display text-lg font-bold text-primary">New Report</h2>
        <Field label="Title *">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Report date *">
          <input type="date" value={form.report_date} onChange={(e) => setForm({ ...form, report_date: e.target.value })} className={inputCls} />
        </Field>
        <Field label="PDF file *">
          <input ref={fileRef} type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className={inputCls} />
          {file && <p className="text-xs text-muted-foreground mt-1">{file.name} · {fmtSize(file.size)}</p>}
        </Field>
        <Field label="Description" full>
          <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
        </Field>
        <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>
        <div className="sm:col-span-2">
          <button disabled={busy} type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition disabled:opacity-60">
            <Ion name="cloud-upload-outline" /> {busy ? "Uploading…" : "Upload Report"}
          </button>
        </div>
      </form>

      <h2 className="font-display text-lg font-bold text-primary mt-10">Existing Reports</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
        {items.map((r) => (
          <div key={r.id} className="bg-card border border-border p-4 flex items-start gap-3">
            <div className="h-12 w-10 bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <Ion name="document-text-outline" className="text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-primary truncate">{r.title}</h3>
                {r.category && <span className="text-[10px] uppercase tracking-wider bg-accent/20 text-accent px-2 py-0.5">{r.category}</span>}
                {!r.published && <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5">Draft</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(r.report_date).toLocaleDateString()} · {fmtSize(r.file_size_bytes)}
              </p>
              <div className="mt-2 flex gap-2">
                <a href={r.file_url} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline inline-flex items-center gap-1"><Ion name="eye-outline" /> View</a>
                <button onClick={() => remove(r)} className="text-xs text-destructive hover:underline inline-flex items-center gap-1"><Ion name="trash-outline" /> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const inputCls = "w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-accent outline-none";
const Field = ({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <label className="eyebrow block mb-1.5">{label}</label>
    {children}
  </div>
);

export default AdminReports;
