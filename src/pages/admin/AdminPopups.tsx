import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { toast } from "sonner";

interface Popup {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

const empty = { title: "", body: "", image_url: "", link_url: "", link_label: "", active: true };

const AdminPopups = () => {
  const [items, setItems] = useState<Popup[]>([]);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("popups").select("*").order("created_at", { ascending: false });
    setItems((data as Popup[]) || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setBusy(true);
    const { error } = await supabase.from("popups").insert({
      title: form.title.trim(),
      body: form.body.trim() || null,
      image_url: form.image_url.trim() || null,
      link_url: form.link_url.trim() || null,
      link_label: form.link_label.trim() || null,
      active: form.active,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Popup created");
    setForm(empty);
    load();
  };

  const toggle = async (p: Popup) => {
    const { error } = await supabase.from("popups").update({ active: !p.active }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this popup?")) return;
    const { error } = await supabase.from("popups").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="eyebrow text-accent">Manage</div>
      <h1 className="font-display text-3xl font-bold text-primary mt-1">Popup Announcements</h1>
      <p className="text-sm text-muted-foreground mt-2">Create flyers shown to all website visitors. Latest active popup appears once per session.</p>
      <div className="gold-bar mt-4" />

      <form onSubmit={submit} className="mt-8 bg-card border border-border p-6 grid sm:grid-cols-2 gap-4">
        <h2 className="sm:col-span-2 font-display text-lg font-bold text-primary">New Popup</h2>
        <Field label="Title *">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Image URL">
          <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" className={inputCls} />
        </Field>
        <Field label="Body" full>
          <textarea rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Link URL">
          <input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="/donate or https://…" className={inputCls} />
        </Field>
        <Field label="Link Label">
          <input value={form.link_label} onChange={(e) => setForm({ ...form, link_label: e.target.value })} placeholder="Learn more" className={inputCls} />
        </Field>
        <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Active (visible on the site)
        </label>
        <div className="sm:col-span-2">
          <button disabled={busy} type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition disabled:opacity-60">
            <Ion name="add-outline" /> {busy ? "Creating…" : "Create Popup"}
          </button>
        </div>
      </form>

      <h2 className="font-display text-lg font-bold text-primary mt-10">Existing Popups</h2>
      <div className="mt-4 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
        {items.map((p) => (
          <div key={p.id} className="bg-card border border-border p-4 flex items-start gap-4">
            {p.image_url && <img src={p.image_url} alt="" className="h-16 w-24 object-cover rounded-sm" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-primary">{p.title}</h3>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${p.active ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                  {p.active ? "Active" : "Hidden"}
                </span>
              </div>
              {p.body && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.body}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggle(p)} className="h-9 px-3 text-xs border border-border hover:bg-secondary inline-flex items-center gap-1.5">
                <Ion name={p.active ? "eye-off-outline" : "eye-outline"} /> {p.active ? "Hide" : "Show"}
              </button>
              <button onClick={() => remove(p.id)} className="h-9 px-3 text-xs border border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground inline-flex items-center gap-1.5">
                <Ion name="trash-outline" /> Delete
              </button>
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

export default AdminPopups;
