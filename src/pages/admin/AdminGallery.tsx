import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { toast } from "sonner";

interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  project_date: string;
  published: boolean;
  photo_count?: number;
}
interface PhotoRow {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

const MAX_PHOTOS = 12;
const MIN_PHOTOS = 1;
const emptyProject = { title: "", description: "", project_date: new Date().toISOString().slice(0, 10), published: true };

const uploadImage = async (file: File): Promise<string> => {
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed");
  if (file.size > 8 * 1024 * 1024) throw new Error("Max image size is 8 MB");
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("gallery").upload(path, file, { contentType: file.type, cacheControl: "3600" });
  if (error) throw error;
  return supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;
};

const removeStored = async (url: string) => {
  try {
    const u = new URL(url);
    const i = u.pathname.indexOf("/gallery/");
    if (i >= 0) {
      const path = decodeURIComponent(u.pathname.slice(i + "/gallery/".length));
      await supabase.storage.from("gallery").remove([path]);
    }
  } catch { /* ignore */ }
};

const AdminGallery = () => {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [form, setForm] = useState(emptyProject);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const loadProjects = async () => {
    const { data } = await supabase
      .from("gallery_projects")
      .select("*, gallery_photos(count)")
      .order("project_date", { ascending: false });
    const rows = (data as any[] | null)?.map((r) => ({
      ...r,
      photo_count: r.gallery_photos?.[0]?.count ?? 0,
    })) as ProjectRow[] | undefined;
    setProjects(rows || []);
  };
  const loadPhotos = async (projectId: string) => {
    const { data } = await supabase.from("gallery_photos").select("*").eq("project_id", projectId).order("sort_order", { ascending: true });
    setPhotos((data as PhotoRow[]) || []);
  };

  useEffect(() => { loadProjects(); }, []);
  useEffect(() => { if (activeId) loadPhotos(activeId); else setPhotos([]); }, [activeId]);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    // Enforce min: cannot create as Published with 0 photos
    if (form.published) {
      toast.message("Project saved as Draft until you add at least 1 photo.");
    }
    setBusy(true);
    try {
      let cover: string | null = null;
      if (coverFile) cover = await uploadImage(coverFile);
      const { data, error } = await supabase.from("gallery_projects").insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        cover_image_url: cover,
        project_date: form.project_date,
        published: false, // always start as draft until photos exist
      }).select().single();
      if (error) throw error;
      toast.success("Project created");
      setForm(emptyProject);
      setCoverFile(null);
      await loadProjects();
      setActiveId((data as ProjectRow).id);
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    } finally {
      setBusy(false);
    }
  };

  const removeProject = async (p: ProjectRow) => {
    if (!confirm(`Delete project "${p.title}" and all its photos?`)) return;
    const { data: ph } = await supabase.from("gallery_photos").select("image_url").eq("project_id", p.id);
    for (const row of (ph || []) as { image_url: string }[]) await removeStored(row.image_url);
    if (p.cover_image_url) await removeStored(p.cover_image_url);
    const { error } = await supabase.from("gallery_projects").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    if (activeId === p.id) setActiveId(null);
    toast.success("Project deleted");
    loadProjects();
  };

  const togglePublish = async (p: ProjectRow) => {
    const count = p.photo_count ?? 0;
    if (!p.published && count < MIN_PHOTOS) {
      toast.error(`Add at least ${MIN_PHOTOS} photo before publishing.`);
      return;
    }
    const { error } = await supabase.from("gallery_projects").update({ published: !p.published }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    toast.success(p.published ? "Unpublished" : "Published");
    loadProjects();
  };

  const addPhotos = async (files: FileList | null) => {
    if (!activeId || !files || files.length === 0) return;
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) { toast.error(`Limit of ${MAX_PHOTOS} photos reached`); return; }
    const queue = Array.from(files).slice(0, remaining);
    if (files.length > remaining) toast.message(`Only adding ${remaining} of ${files.length} (max ${MAX_PHOTOS}).`);
    setPhotoBusy(true);
    try {
      let order = photos.length;
      for (const f of queue) {
        const url = await uploadImage(f);
        const { error } = await supabase.from("gallery_photos").insert({
          project_id: activeId, image_url: url, sort_order: order++,
        });
        if (error) {
          await removeStored(url);
          throw error;
        }
      }
      toast.success(`${queue.length} photo${queue.length > 1 ? "s" : ""} added`);
      await loadPhotos(activeId);
      await loadProjects();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setPhotoBusy(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  };

  const removePhoto = async (photo: PhotoRow) => {
    if (!confirm("Remove this photo?")) return;
    await removeStored(photo.image_url);
    const { error } = await supabase.from("gallery_photos").delete().eq("id", photo.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Photo removed");
    if (activeId) {
      await loadPhotos(activeId);
      await loadProjects();
      // If we just dropped below the minimum, auto-unpublish
      const remaining = photos.length - 1;
      if (active && active.published && remaining < MIN_PHOTOS) {
        await supabase.from("gallery_projects").update({ published: false }).eq("id", active.id);
        toast.message("Project unpublished — minimum 1 photo required.");
        await loadProjects();
      }
    }
  };

  const persistOrder = async (newPhotos: PhotoRow[]) => {
    setPhotos(newPhotos.map((p, i) => ({ ...p, sort_order: i })));
    // Persist sequentially to avoid race conditions
    try {
      for (let i = 0; i < newPhotos.length; i++) {
        const ph = newPhotos[i];
        if (ph.sort_order === i) continue;
        await supabase.from("gallery_photos").update({ sort_order: i }).eq("id", ph.id);
      }
    } catch (e: any) {
      toast.error("Failed to save order");
    }
  };

  const movePhoto = (id: string, dir: -1 | 1) => {
    const idx = photos.findIndex((p) => p.id === id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= photos.length) return;
    const next = [...photos];
    [next[idx], next[target]] = [next[target], next[idx]];
    persistOrder(next);
  };

  const onDragStart = (id: string) => setDragId(id);
  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== dragOverId) setDragOverId(id);
  };
  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    const from = photos.findIndex((p) => p.id === dragId);
    const to = photos.findIndex((p) => p.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setDragId(null);
    setDragOverId(null);
    persistOrder(next);
  };

  const active = projects.find((p) => p.id === activeId) || null;
  const belowMin = photos.length < MIN_PHOTOS;

  return (
    <div>
      <div className="eyebrow text-accent">Manage</div>
      <h1 className="font-display text-3xl font-bold text-primary mt-1">Gallery</h1>
      <p className="text-sm text-muted-foreground mt-2">Create gallery projects and upload between {MIN_PHOTOS} and {MAX_PHOTOS} photos per project. Drag to reorder.</p>
      <div className="gold-bar mt-4" />

      {!active && (
        <>
          <form onSubmit={createProject} className="mt-8 bg-card border border-border p-6 grid sm:grid-cols-2 gap-4">
            <h2 className="sm:col-span-2 font-display text-lg font-bold text-primary">New Gallery Project</h2>
            <Field label="Title *">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Date">
              <input type="date" value={form.project_date} onChange={(e) => setForm({ ...form, project_date: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Description" full>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Cover image (optional)" full>
              <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className={inputCls} />
            </Field>
            <p className="sm:col-span-2 text-xs text-muted-foreground bg-secondary/50 border border-border p-3">
              <Ion name="information-circle-outline" className="inline align-text-bottom mr-1" />
              New projects start as <strong>Draft</strong>. Add at least {MIN_PHOTOS} photo, then publish from the project page.
            </p>
            <div className="sm:col-span-2">
              <button disabled={busy} type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition disabled:opacity-60">
                <Ion name="add-outline" /> {busy ? "Creating…" : "Create Project"}
              </button>
            </div>
          </form>

          <h2 className="font-display text-lg font-bold text-primary mt-10">Existing Projects</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
            {projects.map((p) => {
              const count = p.photo_count ?? 0;
              const canPublish = count >= MIN_PHOTOS;
              return (
                <div key={p.id} className="bg-card border border-border overflow-hidden flex flex-col">
                  {p.cover_image_url ? (
                    <img src={p.cover_image_url} alt="" className="aspect-[4/3] object-cover" />
                  ) : (
                    <div className="aspect-[4/3] bg-secondary flex items-center justify-center text-muted-foreground"><Ion name="images-outline" className="text-3xl" /></div>
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-primary truncate">{p.title}</h3>
                      {p.published ? (
                        <span className="text-[10px] uppercase tracking-wider bg-accent/20 text-accent px-2 py-0.5">Live</span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5">Draft</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(p.project_date).toLocaleDateString()} · {count}/{MAX_PHOTOS} photos
                    </p>
                    {!canPublish && (
                      <p className="text-[11px] text-amber-700 mt-1 inline-flex items-center gap-1">
                        <Ion name="alert-circle-outline" /> Needs {MIN_PHOTOS - count} more photo to publish
                      </p>
                    )}
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <button onClick={() => setActiveId(p.id)} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 inline-flex items-center gap-1 hover:bg-primary-glow"><Ion name="images-outline" /> Photos</button>
                      <button
                        onClick={() => togglePublish(p)}
                        disabled={!canPublish && !p.published}
                        className="text-xs border border-border px-3 py-1.5 inline-flex items-center gap-1 hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Ion name={p.published ? "eye-off-outline" : "eye-outline"} />
                        {p.published ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => removeProject(p)} className="text-xs text-destructive hover:underline inline-flex items-center gap-1 ml-auto"><Ion name="trash-outline" /> Delete</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {active && (
        <div className="mt-8">
          <button onClick={() => setActiveId(null)} className="text-sm text-accent hover:underline inline-flex items-center gap-1">
            <Ion name="arrow-back-outline" /> Back to projects
          </button>
          <div className="mt-4 bg-card border border-border p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary">{active.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">{photos.length} / {MAX_PHOTOS} photos · drag tiles or use the arrows to reorder</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublish(active)}
                  disabled={belowMin && !active.published}
                  className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-sm font-medium hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ion name={active.published ? "eye-off-outline" : "eye-outline"} />
                  {active.published ? "Unpublish" : "Publish"}
                </button>
                <label className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium cursor-pointer ${photos.length >= MAX_PHOTOS || photoBusy ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-accent text-accent-foreground hover:opacity-90"}`}>
                  <Ion name="cloud-upload-outline" />
                  {photoBusy ? "Uploading…" : "Add photos"}
                  <input ref={photoInputRef} type="file" accept="image/*" multiple disabled={photos.length >= MAX_PHOTOS || photoBusy} onChange={(e) => addPhotos(e.target.files)} className="hidden" />
                </label>
              </div>
            </div>

            {belowMin && (
              <div className="mt-4 border border-amber-300 bg-amber-50 text-amber-900 text-sm p-3 inline-flex items-start gap-2">
                <Ion name="alert-circle-outline" className="mt-0.5" />
                <span>This project has no photos yet. Add at least <strong>{MIN_PHOTOS} photo</strong> before it can be published or viewed by visitors.</span>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No photos yet — add up to {MAX_PHOTOS}.</p>}
              {photos.map((ph, i) => (
                <div
                  key={ph.id}
                  draggable
                  onDragStart={() => onDragStart(ph.id)}
                  onDragOver={(e) => onDragOver(e, ph.id)}
                  onDrop={() => onDrop(ph.id)}
                  onDragEnd={() => { setDragId(null); setDragOverId(null); }}
                  className={`relative group border ${dragOverId === ph.id ? "border-accent ring-2 ring-accent/40" : "border-transparent"} ${dragId === ph.id ? "opacity-50" : ""} cursor-grab active:cursor-grabbing`}
                >
                  <img src={ph.image_url} alt={ph.caption || ""} className="aspect-square w-full object-cover pointer-events-none" />
                  <div className="absolute top-1.5 left-1.5 bg-background/90 text-primary text-[11px] font-semibold px-1.5 py-0.5">
                    {i + 1}
                  </div>
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button title="Move up" onClick={() => movePhoto(ph.id, -1)} disabled={i === 0} className="bg-background/90 border border-border p-1 disabled:opacity-40 hover:border-accent">
                      <Ion name="chevron-up-outline" className="text-sm" />
                    </button>
                    <button title="Move down" onClick={() => movePhoto(ph.id, 1)} disabled={i === photos.length - 1} className="bg-background/90 border border-border p-1 disabled:opacity-40 hover:border-accent">
                      <Ion name="chevron-down-outline" className="text-sm" />
                    </button>
                    <button title="Remove" onClick={() => removePhoto(ph)} className="bg-background/90 text-destructive border border-destructive/30 p-1 hover:bg-destructive hover:text-destructive-foreground">
                      <Ion name="trash-outline" className="text-sm" />
                    </button>
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 bg-background/80 text-ink-soft p-1 opacity-0 group-hover:opacity-100 transition">
                    <Ion name="reorder-three-outline" className="text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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

export default AdminGallery;
