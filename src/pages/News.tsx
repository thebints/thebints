import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { Reveal } from "@/components/site/Reveal";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
}

const News = () => {
  const [items, setItems] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("news_posts")
        .select("id,title,slug,excerpt,category,cover_image_url,author_name,published_at")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false });
      setItems((data as PostRow[]) || []);
      setLoading(false);
    })();
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))];
  const visible = filter === "All" ? items : items.filter((i) => i.category === filter);

  const featured = visible[0];
  const rest = visible.slice(1);

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 md:py-28 max-w-5xl">
          <div className="eyebrow text-accent">Media & Resources</div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3">News & Stories</h1>
          <p className="mt-5 text-primary-foreground/80 text-lg max-w-2xl">Updates from the field, programme news and reflections from the women and girls we serve.</p>
          <div className="gold-bar mt-6" />
        </div>
      </section>

      <section className="bg-background">
        <div className="container py-16 md:py-24 max-w-6xl">
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`text-xs uppercase tracking-wider px-3 py-2 border transition ${filter === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-ink-soft hover:border-accent"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading stories…</p>
          ) : visible.length === 0 ? (
            <div className="text-center py-20">
              <Ion name="newspaper-outline" className="text-5xl text-muted-foreground" />
              <p className="mt-4 text-ink-soft">No stories yet. Please check back soon.</p>
            </div>
          ) : (
            <>
              {featured && (
                <Reveal>
                  <Link to={`/media/news/${featured.slug}`} className="group block bg-card border border-border overflow-hidden hover:border-accent transition-colors mb-10">
                    <div className="grid md:grid-cols-2">
                      <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-secondary">
                        {featured.cover_image_url ? (
                          <img src={featured.cover_image_url} alt={featured.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full min-h-[280px] flex items-center justify-center text-muted-foreground"><Ion name="newspaper-outline" className="text-5xl" /></div>
                        )}
                      </div>
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        <div className="text-[11px] uppercase tracking-widest text-accent">{featured.category || "Featured"}</div>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mt-3 leading-tight">{featured.title}</h2>
                        {featured.excerpt && <p className="mt-4 text-ink-soft leading-relaxed line-clamp-3">{featured.excerpt}</p>}
                        <div className="mt-5 text-xs text-muted-foreground">
                          {featured.published_at && new Date(featured.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                          {featured.author_name && ` · ${featured.author_name}`}
                        </div>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                          Read story <Ion name="arrow-forward-outline" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )}

              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((p, i) => (
                    <Reveal key={p.id} delay={i * 70}>
                      <Link to={`/media/news/${p.slug}`} className="group block border border-border bg-card h-full hover:border-accent transition-colors">
                        <div className="aspect-[16/10] overflow-hidden bg-secondary">
                          {p.cover_image_url ? (
                            <img src={p.cover_image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Ion name="newspaper-outline" className="text-4xl" /></div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="text-[11px] uppercase tracking-widest text-accent">{p.category || "Story"}</div>
                          <h3 className="mt-2 font-semibold text-primary text-lg leading-tight">{p.title}</h3>
                          {p.excerpt && <p className="mt-2 text-sm text-ink-soft line-clamp-3">{p.excerpt}</p>}
                          <div className="mt-4 text-xs text-muted-foreground">
                            {p.published_at && new Date(p.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                            {p.author_name && ` · ${p.author_name}`}
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default News;
