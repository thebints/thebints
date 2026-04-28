import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { toast } from "sonner";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string[];
  cover_image_url: string | null;
  author_name: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

const CATEGORIES = ["News", "Story", "Programme Update", "Press Release", "Field Report", "Reflection"];

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: CATEGORIES[0],
  tags: "",
  author_name: "",
  published: false,
  published_at: new Date().toISOString().slice(0, 10),
};

const uploadCover = async (file: File): Promise<string> => {
  if (!file.type.startsWith("image/")) throw new Error("Cover must be an image");
  if (file.size > 6 * 1024 * 1024) throw new Error("Cover must be under 6 MB");
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("news-media").upload(path, file, { contentType: file.type, cacheControl: "3600" });
  if (error) throw error;
  return supabase.storage.from("news-media").getPublicUrl(path).data.publicUrl;
};

const removeStored = async (url: string) => {
  try {
    const u = new URL(url);
    const i = u.pathname.indexOf("/news-media/");
    if (i >= 0) {
      const path = decodeURIComponent(u.pathname.slice(i + "/news-media/".length));
      await supabase.storage.from("news-media").remove([path]);
    }
  } catch { /* ignore */ }
};

const AdminNews = () => {
  const [items, setItems] = useState<PostRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingCover, setExistingCover] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLFormElement>(null);

  const load = async () => {
    const { data } = await supabase.from("news_posts").select("*").order("published_at", { ascending: false, nullsFirst: false });
    setItems((data as PostRow[]) || []);
  };
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setCoverFile(null);
    setEditingId(null);
    setExistingCover(null);
    setSlugTouched(false);
    if (coverRef.current) coverRef.current.value = "";
  };

  const startEdit = (p: PostRow) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || "",
      content: p.content || "",
      category: p.category || CATEGORIES[0],
      tags: p.tags.join(", "),
      author_name: p.author_name || "",
      published: p.published,
      published_at: (p.published_at || new Date().toISOString()).slice(0, 10),
    });
    setExistingCover(p.cover_image_url);
    setCoverFile(null);
    setSlugTouched(true);
    if (coverRef.current) coverRef.current.value = "";
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const slug = (form.slug.trim() || slugify(form.title));
    if (!slug) { toast.error("Slug could not be generated"); return; }
    setBusy(true);
    try {
      let coverUrl: string | null = existingCover;
      if (coverFile) {
        const newUrl = await uploadCover(coverFile);
        if (existingCover) await removeStored(existingCover);
        coverUrl = newUrl;
      }
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = {
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt.trim() || null,
        content: form.content,
        category: form.category || null,
        tags,
        cover_image_url: coverUrl,
        author_name: form.author_name.trim() || null,
        published: form.published,
        published_at: form.published ? new Date(form.published_at).toISOString() : null,
      };
      if (editingId) {
        const { error } = await supabase.from("news_posts").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Post updated");
      } else {
        const { error } = await supabase.from("news_posts").insert(payload);
        if (error) {
          if (error.code === "23505") throw new Error("That slug is already used. Choose a different one.");
          throw error;
        }
        toast.success("Post created");
      }
      resetForm();
      load();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: PostRow) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    if (p.cover_image_url) await removeStored(p.cover_image_url);
    const { error } = await supabase.from("news_posts").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    if (editingId === p.id) resetForm();
    load();
  };

  const togglePublish = async (p: PostRow) => {
    const next = !p.published;
    const { error } = await supabase.from("news_posts").update({
      published: next,
      published_at: next ? (p.published_at || new Date().toISOString()) : null,
    }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    toast.success(next ? "Published" : "Unpublished");
    load();
  };

  return (
    <div>
      <div className="eyebrow text-accent">Manage</div>
      <h1 className="font-display text-3xl font-bold text-primary mt-1">News & Stories</h1>
      <p className="text-sm text-muted-foreground mt-2">Write and publish news posts and stories shown in the public News & Stories grid.</p>
      <div className="gold-bar mt-4" />

      <form ref={formTopRef} onSubmit={submit} className="mt-8 bg-card border border-border p-6 grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-primary">{editingId ? "Edit Post" : "New Post"}</h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
              <Ion name="close-outline" /> Cancel edit
            </button>
          )}
        </div>

        <Field label="Title *">
          <input
            value={form.title}
            onChange={(e) => {
              const v = e.target.value;
              setForm((f) => ({
                ...f,
                title: v,
                slug: slugTouched ? f.slug : slugify(v),
              }));
            }}
            className={inputCls}
            placeholder="Foundation officially launched"
          />
        </Field>
        <Field label="Slug">
          <input
            value={form.slug}
            onChange={(e) => { setSlugTouched(true); setForm({ ...form, slug: slugify(e.target.value) }); }}
            className={inputCls}
            placeholder="foundation-officially-launched"
          />
        </Field>

        <Field label="Category">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Author (optional)">
          <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className={inputCls} />
        </Field>

        <Field label="Tags (comma separated)" full>
          <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} placeholder="mentorship, lagos, launch" />
        </Field>

        <Field label="Cover image (optional)" full>
          <input ref={coverRef} type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className={inputCls} />
          {(coverFile || existingCover) && (
            <div className="mt-2 flex items-center gap-3">
              <img src={coverFile ? URL.createObjectURL(coverFile) : (existingCover || "")} alt="" className="h-16 w-24 object-cover border border-border" />
              {!coverFile && existingCover && (
                <button type="button" onClick={() => setExistingCover(null)} className="text-xs text-destructive hover:underline inline-flex items-center gap-1">
                  <Ion name="trash-outline" /> Remove
                </button>
              )}
            </div>
          )}
        </Field>

        <Field label="Excerpt (short summary)" full>
          <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className={inputCls} placeholder="A new chapter for women & girls empowerment in Nigeria." />
        </Field>

        <Field label="Body content" full>
          <textarea
            rows={12}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className={`${inputCls} font-mono text-sm leading-relaxed`}
            placeholder="Write your article here. Blank lines start new paragraphs."
          />
          <p className="text-[11px] text-muted-foreground mt-1">Plain text with paragraph breaks. URLs become clickable on the public page.</p>
        </Field>

        <Field label="Publish date">
          <input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className={inputCls} />
        </Field>
        <label className="flex items-end gap-2 text-sm pb-2.5">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          Published (visible to visitors)
        </label>

        <div className="sm:col-span-2 flex gap-3">
          <button disabled={busy} type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition disabled:opacity-60">
            <Ion name={editingId ? "save-outline" : "add-outline"} /> {busy ? "Saving…" : editingId ? "Save Changes" : "Create Post"}
          </button>
          {!editingId && (
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 border border-border px-5 py-3 text-sm hover:border-accent hover:text-accent transition">
              Reset
            </button>
          )}
        </div>
      </form>

      <h2 className="font-display text-lg font-bold text-primary mt-10">All Posts</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
        {items.map((p) => (
          <div key={p.id} className={`bg-card border ${editingId === p.id ? "border-accent" : "border-border"} p-4 flex items-start gap-3`}>
            {p.cover_image_url ? (
              <img src={p.cover_image_url} alt="" className="h-20 w-20 object-cover shrink-0" />
            ) : (
              <div className="h-20 w-16 bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Ion name="newspaper-outline" className="text-xl" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-primary truncate">{p.title}</h3>
                {p.category && <span className="text-[10px] uppercase tracking-wider bg-accent/20 text-accent px-2 py-0.5">{p.category}</span>}
                {p.published ? (
                  <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5">Live</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5">Draft</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">/{p.slug}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {p.published_at ? new Date(p.published_at).toLocaleDateString() : "Not published"}
                {p.author_name && ` · ${p.author_name}`}
              </p>
              <div className="mt-2 flex gap-3 flex-wrap">
                <button onClick={() => startEdit(p)} className="text-xs text-accent hover:underline inline-flex items-center gap-1"><Ion name="create-outline" /> Edit</button>
                <button onClick={() => togglePublish(p)} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                  <Ion name={p.published ? "eye-off-outline" : "eye-outline"} /> {p.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => remove(p)} className="text-xs text-destructive hover:underline inline-flex items-center gap-1 ml-auto"><Ion name="trash-outline" /> Delete</button>
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

export default AdminNews;
