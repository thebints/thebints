import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { Link, useNavigate } from "react-router-dom";
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
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

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
      setTimeout(() => setOpen(true), 600);
    })();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => {
    if (popup) sessionStorage.setItem(SESSION_KEY, popup.id);
    setOpen(false);
  };

  if (!popup) return null;

  const isExternal = popup.link_url?.startsWith("http");
  const hasLink = !!popup.link_url;

  const handleImageClick = () => {
    if (!hasLink) return;
    if (isExternal) {
      window.open(popup.link_url!, "_blank", "noopener,noreferrer");
    } else {
      navigate(popup.link_url!);
    }
    close();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 transition-all duration-500",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
      role="dialog"
      aria-modal="true"
      aria-label={popup.title}
    >
      {/* Backdrop with radial glow */}
      <div
        className={cn(
          "absolute inset-0 bg-ink/80 backdrop-blur-md transition-opacity duration-700",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.18), transparent 60%)",
        }}
      />

      {/* Floating image - no container */}
      <div
        className={cn(
          "relative inline-flex flex-col items-center max-h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-6",
        )}
      >
        {popup.image_url && (
          <div className="relative group">
            {/* glow halo */}
            <div
              aria-hidden
              className={cn(
                "absolute -inset-3 sm:-inset-5 rounded-2xl blur-2xl transition-opacity duration-700",
                open ? "opacity-70" : "opacity-0",
              )}
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--accent) / 0.55), hsl(var(--primary) / 0.45))",
              }}
            />
            {/* shimmer placeholder */}
            {!imgLoaded && (
              <div className="absolute inset-0 rounded-lg bg-muted animate-pulse" />
            )}
            <img
              src={popup.image_url}
              alt={popup.title}
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onClick={handleImageClick}
              className={cn(
                "relative block max-w-[92vw] sm:max-w-[80vw] md:max-w-[640px] max-h-[82vh] w-auto h-auto object-contain rounded-lg shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.6)] transition-all duration-500",
                hasLink && "cursor-pointer group-hover:scale-[1.015]",
                imgLoaded ? "opacity-100" : "opacity-0",
              )}
            />
            {/* subtle accent ring */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-lg ring-1 ring-accent/20 pointer-events-none"
            />
          </div>
        )}

        {/* Close button - floating, premium */}
        <button
          onClick={close}
          aria-label="Close announcement"
          className={cn(
            "absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-10 h-10 w-10 sm:h-11 sm:w-11 inline-flex items-center justify-center bg-background text-primary rounded-full shadow-lg ring-1 ring-border hover:bg-accent hover:text-accent-foreground hover:rotate-90 hover:scale-110 transition-all duration-300",
          )}
        >
          <Ion name="close-outline" className="text-xl" />
        </button>

        {/* Optional title + CTA below image, minimal */}
        {(popup.title || hasLink) && (
          <div
            className={cn(
              "mt-5 flex flex-col items-center text-center transition-all duration-700 delay-200",
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
            )}
          >
            {popup.title && (
              <h3 className="font-display text-base sm:text-lg font-semibold text-background drop-shadow-md">
                {popup.title}
              </h3>
            )}
            {hasLink && (
              <div className="mt-3">
                {isExternal ? (
                  <a
                    href={popup.link_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 text-sm font-medium rounded-full hover:bg-accent/90 hover:gap-3 transition-all duration-300 shadow-lg"
                  >
                    {popup.link_label || "Learn more"}
                    <Ion name="arrow-forward-outline" />
                  </a>
                ) : (
                  <Link
                    to={popup.link_url!}
                    onClick={close}
                    className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 text-sm font-medium rounded-full hover:bg-accent/90 hover:gap-3 transition-all duration-300 shadow-lg"
                  >
                    {popup.link_label || "Learn more"}
                    <Ion name="arrow-forward-outline" />
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
