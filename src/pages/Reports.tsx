import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { Reveal } from "@/components/site/Reveal";

interface ReportRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  report_date: string;
  file_url: string;
  file_size_bytes: number | null;
  cover_image_url: string | null;
}

const fmtSize = (b: number | null) => {
  if (!b) return "";
  const mb = b / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;
};

const Reports = () => {
  const [items, setItems] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("impact_reports").select("*").eq("published", true).order("report_date", { ascending: false });
      setItems((data as ReportRow[]) || []);
      setLoading(false);
    })();
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))];
  const visible = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <SiteLayout>
      <section className="bg-primary text-primary-foreground">
        <div className="container py-20 md:py-28 max-w-5xl">
          <div className="eyebrow text-accent">Media & Resources</div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3">Impact Reports</h1>
          <p className="mt-5 text-primary-foreground/80 text-lg max-w-2xl">Download our published reports — programme outcomes, financial summaries, and impact stories.</p>
          <div className="gold-bar mt-6" />
        </div>
      </section>

      <section className="bg-background">
        <div className="container py-16 md:py-24 max-w-6xl">
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((c) => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`text-xs uppercase tracking-wider px-3 py-2 border transition ${filter === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-ink-soft hover:border-accent"}`}>
                  {c}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading reports…</p>
          ) : visible.length === 0 ? (
            <div className="text-center py-20">
              <Ion name="document-text-outline" className="text-5xl text-muted-foreground" />
              <p className="mt-4 text-ink-soft">No reports available yet. Please check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((r, i) => (
                <Reveal key={r.id} delay={i * 80}>
                  <article className="bg-card border border-border h-full flex flex-col group hover:border-accent transition-colors overflow-hidden">
                    {r.cover_image_url ? (
                      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                        <img src={r.cover_image_url} alt={r.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        {r.category && (
                          <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-background/95 text-primary px-2 py-1">{r.category}</span>
                        )}
                      </div>
                    ) : null}
                    <div className="p-6 flex-1 flex flex-col">
                      {!r.cover_image_url && (
                        <div className="flex items-start justify-between">
                          <div className="h-14 w-12 bg-accent/10 text-accent flex items-center justify-center">
                            <Ion name="document-text-outline" className="text-2xl" />
                          </div>
                          {r.category && <span className="text-[10px] uppercase tracking-wider bg-secondary text-ink-soft px-2 py-1">{r.category}</span>}
                        </div>
                      )}
                      <h3 className={`font-display text-xl font-bold text-primary leading-tight ${r.cover_image_url ? "" : "mt-5"}`}>{r.title}</h3>
                      {r.description && <p className="text-sm text-ink-soft mt-3 leading-relaxed line-clamp-3">{r.description}</p>}
                      <div className="mt-auto pt-5 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
                        <span>{new Date(r.report_date).toLocaleDateString(undefined, { year: "numeric", month: "short" })}</span>
                        {r.file_size_bytes && <span>PDF · {fmtSize(r.file_size_bytes)}</span>}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <a href={r.file_url} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary-glow transition">
                          <Ion name="eye-outline" /> View
                        </a>
                        <a href={r.file_url} download className="inline-flex items-center justify-center gap-2 border border-border px-4 py-2.5 text-sm font-medium text-ink-soft hover:border-accent hover:text-accent transition">
                          <Ion name="download-outline" />
                        </a>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Reports;
