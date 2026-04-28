import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, SectionHeader } from "@/components/site/Editorial";
import { Ion } from "@/components/Ion";
import { supabase } from "@/integrations/supabase/client";
import speakerPodium from "@/assets/speaker-podium.jpg";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  event_date: string;
  location: string | null;
  image_url: string | null;
  registration_url: string | null;
}

const Events = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });
      setEvents((data as EventRow[]) || []);
      setLoading(false);
    })();
  }, []);

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.event_date).getTime() >= now);
  const past = events.filter((e) => new Date(e.event_date).getTime() < now);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Media & Resources"
        title="Events"
        intro="Workshops, fundraisers, conferences and community gatherings — convened to advance dignity, opportunity and sustainable impact."
        image={speakerPodium}
        imageAlt="Speaker at a Bints Foundation event"
      />

      <section className="container py-20">
        <SectionHeader eyebrow="What's Next" title={<>Upcoming events.</>} />
        <div className="mt-10">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading events…</p>
          ) : upcoming.length === 0 ? (
            <div className="border border-dashed border-border p-10 text-center">
              <Ion name="calendar-outline" className="text-3xl text-accent" />
              <p className="mt-3 text-sm text-muted-foreground">No upcoming events right now. Check back soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((e) => <EventCard key={e.id} ev={e} />)}
            </div>
          )}
        </div>

        {past.length > 0 && (
          <div className="mt-20">
            <SectionHeader eyebrow="Archive" title={<>Past events.</>} />
            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90">
              {past.map((e) => <EventCard key={e.id} ev={e} past />)}
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

const EventCard = ({ ev, past }: { ev: EventRow; past?: boolean }) => {
  const date = new Date(ev.event_date);
  const dateStr = date.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const timeStr = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return (
    <article className="group bg-card border border-border overflow-hidden flex flex-col hover:shadow-soft transition-shadow">
      <div className="aspect-[16/10] bg-muted overflow-hidden relative">
        {ev.image_url ? (
          <img src={ev.image_url} alt={ev.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-glow text-accent">
            <Ion name="calendar-outline" className="text-5xl" />
          </div>
        )}
        {ev.category && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 font-semibold">
            {ev.category}
          </span>
        )}
        {past && (
          <span className="absolute top-3 right-3 bg-ink/70 text-primary-foreground text-[10px] uppercase tracking-[0.2em] px-2.5 py-1">Past</span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-[11px] text-accent uppercase tracking-wider font-semibold">
          <Ion name="calendar-outline" /> {dateStr} · {timeStr}
        </div>
        <h3 className="font-display text-lg font-bold text-primary mt-2 leading-snug">{ev.title}</h3>
        {ev.location && (
          <p className="text-xs text-muted-foreground mt-1.5 inline-flex items-center gap-1.5">
            <Ion name="location-outline" /> {ev.location}
          </p>
        )}
        {ev.description && <p className="text-sm text-ink-soft mt-3 line-clamp-3 leading-relaxed">{ev.description}</p>}
        {ev.registration_url && !past && (
          <a
            href={ev.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors self-start"
          >
            Register <Ion name="arrow-forward-outline" />
          </a>
        )}
      </div>
    </article>
  );
};

export default Events;
