import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";

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
  published_at: string | null;
}

// Render plain-text body with paragraph breaks and auto-linked URLs
const renderContent = (text: string) => {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const urlRe = /(https?:\/\/[^\s]+)/g;
  return paragraphs.map((p, i) => {
    const parts = p.split(urlRe);
    return (
      <p key={i} className="mb-5 leading-relaxed text-ink-soft">
        {parts.map((part, j) =>
          urlRe.test(part) ? (
            <a key={j} href={part} target="_blank" rel="noreferrer" className="text-accent underline underline-offset-2 hover:no-underline break-words">{part}</a>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </p>
    );
  });
};

const NewsPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<PostRow[]>([]);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("news_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setPost((data as PostRow) || null);
      setLoading(false);

      if (data) {
        const { data: rel } = await supabase
          .from("news_posts")
          .select("id,title,slug,excerpt,category,cover_image_url,author_name,published_at,content,tags")
          .eq("published", true)
          .neq("id", (data as PostRow).id)
          .order("published_at", { ascending: false, nullsFirst: false })
          .limit(3);
        setRelated((rel as PostRow[]) || []);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="container py-32 text-center text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout>
        <div className="container py-32 text-center max-w-xl">
          <Ion name="alert-circle-outline" className="text-5xl text-muted-foreground" />
          <h1 className="font-display text-3xl font-bold text-primary mt-4">Story not found</h1>
          <p className="mt-3 text-ink-soft">This story may have been moved or unpublished.</p>
          <Link to="/media/news" className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm">
            <Ion name="arrow-back-outline" /> Back to News & Stories
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article>
        <header className="bg-primary text-primary-foreground">
          <div className="container py-16 md:py-24 max-w-4xl">
            <Link to="/media/news" className="text-xs uppercase tracking-wider text-accent inline-flex items-center gap-1 hover:gap-2 transition-all">
              <Ion name="arrow-back-outline" /> News & Stories
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-widest">
              {post.category && <span className="bg-accent/20 text-accent px-2.5 py-1">{post.category}</span>}
              {post.published_at && (
                <span className="text-primary-foreground/70">
                  {new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
              {post.author_name && <span className="text-primary-foreground/70">By {post.author_name}</span>}
            </div>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-5 leading-tight">{post.title}</h1>
            {post.excerpt && <p className="mt-6 text-primary-foreground/80 text-lg leading-relaxed max-w-3xl">{post.excerpt}</p>}
            <div className="gold-bar mt-8" />
          </div>
        </header>

        {post.cover_image_url && (
          <div className="bg-background">
            <div className="container max-w-5xl -mt-8 md:-mt-12">
              <img loading="lazy" decoding="async" src={post.cover_image_url} alt={post.title} className="w-full aspect-[16/9] object-cover border border-border shadow-2xl" />
            </div>
          </div>
        )}

        <section className="bg-background">
          <div className="container py-12 md:py-20 max-w-3xl">
            {post.content?.trim() ? (
              <div className="text-base md:text-lg">{renderContent(post.content)}</div>
            ) : (
              <p className="text-ink-soft italic">Full story coming soon.</p>
            )}

            {post.tags?.length > 0 && (
              <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="text-xs text-ink-soft border border-border px-2.5 py-1">#{t}</span>
                ))}
              </div>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="bg-secondary/40 border-t border-border">
            <div className="container py-16 max-w-6xl">
              <div className="eyebrow text-accent">More stories</div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mt-2">Continue reading</h2>
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                {related.map((p) => (
                  <Link key={p.id} to={`/media/news/${p.slug}`} className="group block border border-border bg-card h-full hover:border-accent transition-colors">
                    <div className="aspect-[16/10] overflow-hidden bg-secondary">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground"><Ion name="newspaper-outline" className="text-3xl" /></div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-[11px] uppercase tracking-widest text-accent">{p.category || "Story"}</div>
                      <h3 className="mt-2 font-semibold text-primary leading-tight">{p.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </SiteLayout>
  );
};

export default NewsPost;
