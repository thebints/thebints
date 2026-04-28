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
}
interface PhotoRow {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

const MAX_PHOTOS = 12;
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
  const photoInputRef = useRef<HTMLInputElement>(null);

  const loadProjects = async () => {
    const { data } = await supabase.from("gallery_projects").select("*").order("project_date", { ascending: false });
    setProjects((data as ProjectRow[]) || []);
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
    setBusy(true);
    try {
      let cover: string | null = null;
      if (coverFile) cover = await uploadImage(coverFile);
      const { data, error } = await supabase.from("gallery_projects").insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        cover_image_url: cover,
        project_date: form.project_date,
        published: form.published,
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
    // Cleanup storage
    const { data: ph } = await supabase.from("gallery_photos").select("image_url").eq("project_id", p.id);
    for (const row of (ph || []) as { image_url: string }[]) await removeStored(row.image_url);
    if (p.cover_image_url) await removeStored(p.cover_image_url);
    const { error } = await supabase.from("gallery_projects").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    if (activeId === p.id) setActiveId(null);
    toast.success("Project deleted");
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
    if (activeId) loadPhotos(activeId);
  };

  const active = projects.find((p) => p.id === activeId) || null;

  return (
    <div>
      <div className="eyebrow text-accent">Manage</div>
      <h1 className="font-display text-3xl font-bold text-primary mt-1">Gallery</h1>
      <p className="text-sm text-muted-foreground mt-2">Create gallery projects and upload between 1 and 12 photos per project.</p>
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
            <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published
            </label>
            <div className="sm:col-span-2">
              <button disabled={busy} type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition disabled:opacity-60">
                <Ion name="add-outline" /> {busy ? "Creating…" : "Create Project"}
              </button>
            </div>
          </form>

          <h2 className="font-display text-lg font-bold text-primary mt-10">Existing Projects</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.length === 0 && <p className="text-sm text-muted-foreground">None yet.</p>}
            {projects.map((p) => (
              <div key={p.id} className="bg-card border border-border overflow-hidden flex flex-col">
                {p.cover_image_url ? (
                  <img src={p.cover_image_url} alt="" className="aspect-[4/3] object-cover" />
                ) : (
                  <div className="aspect-[4/3] bg-secondary flex items-center justify-center text-muted-foreground"><Ion name="images-outline" className="text-3xl" /></div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-primary truncate">{p.title}</h3>
                    {!p.published && <span className="text-[10px] uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5">Draft</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(p.project_date).toLocaleDateString()}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setActiveId(p.id)} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 inline-flex items-center gap-1 hover:bg-primary-glow"><Ion name="images-outline" /> Photos</button>
                    <button onClick={() => removeProject(p)} className="text-xs text-destructive hover:underline inline-flex items-center gap-1 ml-auto"><Ion name="trash-outline" /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
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
                <p className="text-xs text-muted-foreground mt-1">{photos.length} / {MAX_PHOTOS} photos</p>
              </div>
              <label className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium cursor-pointer ${photos.length >= MAX_PHOTOS || photoBusy ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-accent text-accent-foreground hover:opacity-90"}`}>
                <Ion name="cloud-upload-outline" />
                {photoBusy ? "Uploading…" : "Add photos"}
                <input ref={photoInputRef} type="file" accept="image/*" multiple disabled={photos.length >= MAX_PHOTOS || photoBusy} onChange={(e) => addPhotos(e.target.files)} className="hidden" />
              </label>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No photos yet — add up to {MAX_PHOTOS}.</p>}
              {photos.map((ph) => (
                <div key={ph.id} className="relative group">
                  <img src={ph.image_url} alt={ph.caption || ""} className="aspect-square w-full object-cover" />
                  <button onClick={() => removePhoto(ph)} className="absolute top-1.5 right-1.5 bg-background/90 text-destructive border border-destructive/30 p-1.5 opacity-0 group-hover:opacity-100 transition">
                    <Ion name="trash-outline" className="text-sm" />
                  </button>
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
