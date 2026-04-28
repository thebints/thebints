import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Popup {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
}

const SESSION_KEY = "bints_popup_dismissed_v1";

export const PopupAnnouncement = () => {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(SESSION_KEY);
    (async () => {
      const { data } = await supabase
        .from("popups")
        .select("id,title,body,image_url,link_url,link_label")
        .order("created_at", { ascending: false })
        .limit(1);
      const p = data?.[0];
      if (!p) return;
      if (dismissed === p.id) return;
      setPopup(p as Popup);
      // tiny delay to let the page settle
      setTimeout(() => setOpen(true), 600);
    })();
  }, []);

  const close = () => {
    if (popup) sessionStorage.setItem(SESSION_KEY, popup.id);
    setOpen(false);
  };

  if (!popup) return null;

  const isExternal = popup.link_url?.startsWith("http");

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-500",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={close} />
      <div
        className={cn(
          "relative w-full max-w-lg bg-background shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.5)] rounded-sm overflow-hidden transition-all duration-500",
          open ? "scale-100 translate-y-0" : "scale-95 translate-y-4",
        )}
      >
        <div className="h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent" />
        <button
          onClick={close}
          aria-label="Close announcement"
          className="absolute right-3 top-3 z-10 h-9 w-9 inline-flex items-center justify-center bg-background/80 hover:bg-accent hover:text-accent-foreground rounded-full text-primary transition-colors"
        >
          <Ion name="close-outline" className="text-xl" />
        </button>
        {popup.image_url && (
          <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
            <img loading="lazy" decoding="async" src={popup.image_url} alt={popup.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <div className="eyebrow text-accent">Announcement</div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-primary mt-2 leading-tight">{popup.title}</h3>
          <div className="gold-bar mt-3" />
          {popup.body && (
            <p className="text-sm text-ink-soft mt-4 leading-relaxed whitespace-pre-line">{popup.body}</p>
          )}
          {popup.link_url && (
            <div className="mt-6">
              {isExternal ? (
                <a
                  href={popup.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition"
                >
                  {popup.link_label || "Learn more"}
                  <Ion name="arrow-forward-outline" />
                </a>
              ) : (
                <Link
                  to={popup.link_url}
                  onClick={close}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary-glow transition"
                >
                  {popup.link_label || "Learn more"}
                  <Ion name="arrow-forward-outline" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
