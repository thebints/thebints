import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { toast } from "sonner";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  event_date: string;
  location: string | null;
  image_url: string | null;
  registration_url: string | null;
  published: boolean;
}

const empty = { title: "", description: "", category: "Workshop", event_date: "", location: "", image_url: "", registration_url: "", published: true };
const CATEGORIES = ["Workshop", "Fundraiser", "Conference", "Outreach", "Mentorship", "Webinar", "Community"];

const AdminEvents = () => {
  const [items, setItems] = useState<EventRow[]>([]);
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setItems((data as EventRow[]) || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.event_date) { toast.error("Title and date are required"); return; }
    setBusy(true);
    const { error } = await supabase.from("events").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category || null,
      event_date: new Date(form.event_date).toISOString(),
      location: form.location.trim() || null,
      image_url: form.image_url.trim() || null,
      registration_url: form.registration_url.trim() || null,
      published: form.published,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Event created");
    setForm(empty);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    load();
  };

  return (
    <div>
      <div className="eyebrow text-accent">Manage</div>
      <h1 className="font-display text-3xl font-bold text-primary mt-1">Events</h1>
      <p className="text-sm text-muted-foreground mt-2">Create and manage events shown on the public Events page.</p>
      <div className="gold-bar mt-4" />

      <form onSubmit={submit} className="mt-8 bg-card border border-border p-6 grid sm:grid-cols-2 gap-4">
        <h2 className="sm:col-span-2 font-display text-lg font-bold text-primary">New Event</h2>
        <Field label="Title *">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Date & time *">
          <input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Location">
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Cover image URL" full>
          <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" className={inputCls} />
        </Field>
        <Field label="Description" full>
          <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Registration URL" full>
          <input value={form.registration_url} onChange={(e) => setForm({ ...form, registration_url: e.target.value })} placeholder="https://…" className={inputCls} />
        </Field>
        <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published
        </label>
        <div className="sm:col-span-2">
          <button disabled={busy} type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition disabled:opacity-60">
            <Ion name="add-outline" /> {busy ? "Creating…" : "Create Event"}
          </button>
        </div>
      </form>

      <h2 className="font-display text-lg font-bold text-primary mt-10">Existing Events</h2>
      <div className="mt-4 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
        {items.map((e) => (
          <div key={e.id} className="bg-card border border-border p-4 flex items-start gap-4">
            {e.image_url && <img src={e.image_url} alt="" className="h-16 w-24 object-cover rounded-sm" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-primary">{e.title}</h3>
                {e.category && <span className="text-[10px] uppercase tracking-wider bg-accent/20 text-accent px-2 py-0.5">{e.category}</span>}
                {!e.published && <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5">Draft</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(e.event_date).toLocaleString()} {e.location && `· ${e.location}`}
              </p>
            </div>
            <button onClick={() => remove(e.id)} className="h-9 px-3 text-xs border border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground inline-flex items-center gap-1.5 shrink-0">
              <Ion name="trash-outline" /> Delete
            </button>
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

export default AdminEvents;
