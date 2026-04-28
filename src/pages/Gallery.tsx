import { useEffect, useState, useCallback } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { Reveal } from "@/components/site/Reveal";

interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  project_date: string;
}
interface PhotoRow {
  id: string;
  image_url: string;
  caption: string | null;
}

const Gallery = () => {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<ProjectRow | null>(null);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("gallery_projects")
        .select("*, gallery_photos(count)")
        .eq("published", true)
        .order("project_date", { ascending: false });
      // Hide projects without at least 1 photo
      const filtered = ((data as any[]) || [])
        .filter((p) => (p.gallery_photos?.[0]?.count ?? 0) >= 1)
        .map(({ gallery_photos: _gp, ...rest }) => rest as ProjectRow);
      setProjects(filtered);
      setLoading(false);
    })();
  }, []);

  const openProject = async (p: ProjectRow) => {
    setActive(p);
    setLoadingPhotos(true);
    setPhotos([]);
    const { data } = await supabase.from("gallery_photos").select("id, image_url, caption").eq("project_id", p.id).order("sort_order", { ascending: true });
    setPhotos((data as PhotoRow[]) || []);
    setLoadingPhotos(false);
  };

  const closeProject = () => {
    setActive(null);
    setPhotos([]);
    setLightboxIndex(null);
  };

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const next = useCallback(() => setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length)), [photos.length]);
  const prev = useCallback(() => setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, next, prev]);

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 md:py-28 max-w-5xl">
          <div className="eyebrow text-accent">Media & Resources</div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3">Gallery</h1>
          <p className="mt-5 text-primary-foreground/80 text-lg max-w-2xl">Moments from our programmes, outreaches and community events.</p>
          <div className="gold-bar mt-6" />
        </div>
      </section>

      <section className="bg-background">
        <div className="container py-16 md:py-24 max-w-6xl">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading gallery…</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <Ion name="images-outline" className="text-5xl text-muted-foreground" />
              <p className="mt-4 text-ink-soft">No gallery projects yet. Please check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <article className="group bg-card border border-border overflow-hidden flex flex-col h-full hover:border-accent transition-colors">
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Ion name="images-outline" className="text-4xl" /></div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-[10px] uppercase tracking-wider text-accent">{new Date(p.project_date).toLocaleDateString(undefined, { year: "numeric", month: "short" })}</p>
                      <h3 className="font-display text-xl font-bold text-primary mt-2 leading-tight">{p.title}</h3>
                      {p.description && <p className="text-sm text-ink-soft mt-2 line-clamp-2">{p.description}</p>}
                      <button onClick={() => openProject(p)} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all self-start">
                        View Project <Ion name="arrow-forward-outline" />
                      </button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Viewer */}
      {active && (
        <div className="fixed inset-0 z-[100] bg-background overflow-y-auto">
          <div className="sticky top-0 z-10 bg-primary text-primary-foreground">
            <div className="container py-5 flex items-center justify-between gap-4 max-w-6xl">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-accent">{new Date(active.project_date).toLocaleDateString(undefined, { year: "numeric", month: "long" })}</p>
                <h2 className="font-display text-xl md:text-2xl font-bold truncate">{active.title}</h2>
              </div>
              <button onClick={closeProject} className="inline-flex items-center gap-2 border border-primary-foreground/30 px-4 py-2 text-sm hover:bg-primary-foreground/10 transition shrink-0">
                <Ion name="close-outline" /> Close
              </button>
            </div>
          </div>

          <div className="container py-10 md:py-14 max-w-6xl">
            {active.description && <p className="text-ink-soft max-w-3xl mb-8">{active.description}</p>}
            {loadingPhotos ? (
              <p className="text-sm text-muted-foreground">Loading photos…</p>
            ) : photos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No photos in this project.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {photos.map((ph, i) => (
                  <button key={ph.id} onClick={() => setLightboxIndex(i)} className="group relative aspect-square overflow-hidden bg-secondary">
                    <img src={ph.image_url} alt={ph.caption || ""} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors flex items-center justify-center">
                      <Ion name="expand-outline" className="text-primary-foreground text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox / Slideshow */}
      {active && lightboxIndex !== null && photos[lightboxIndex] && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} aria-label="Close" className="absolute top-5 right-5 text-white/80 hover:text-white p-2">
            <Ion name="close-outline" className="text-3xl" />
          </button>
          <div className="absolute top-5 left-5 text-white/70 text-sm tracking-wider">
            {lightboxIndex + 1} / {photos.length}
          </div>
          {photos.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-3 md:left-6 text-white/80 hover:text-white p-3 bg-white/5 hover:bg-white/15 transition">
                <Ion name="chevron-back-outline" className="text-3xl" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-3 md:right-6 text-white/80 hover:text-white p-3 bg-white/5 hover:bg-white/15 transition">
                <Ion name="chevron-forward-outline" className="text-3xl" />
              </button>
            </>
          )}
          <figure className="max-w-[95vw] max-h-[88vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img loading="lazy" decoding="async" src={photos[lightboxIndex].image_url} alt={photos[lightboxIndex].caption || ""} className="max-w-[95vw] max-h-[82vh] object-contain" />
            {photos[lightboxIndex].caption && (
              <figcaption className="mt-4 text-white/80 text-sm text-center max-w-2xl">{photos[lightboxIndex].caption}</figcaption>
            )}
          </figure>
        </div>
      )}
    </SiteLayout>
  );
};

export default Gallery;
