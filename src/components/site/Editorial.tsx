import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Ion } from "@/components/Ion";
import { cn } from "@/lib/utils";

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("eyebrow inline-flex items-center gap-2", className)}>
    <span className="h-px w-8 bg-accent" />
    {children}
  </div>
);

export const SectionHeader = ({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
}) => (
  <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
    <Eyebrow className={cn(align === "center" && "justify-center")}>{eyebrow}</Eyebrow>
    <h2 className="display-serif-feel text-primary text-4xl md:text-5xl mt-4">{title}</h2>
    {intro && <p className="mt-5 text-ink-soft text-base md:text-lg leading-relaxed">{intro}</p>}
  </div>
);

export const PageHero = ({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  imageAlt?: string;
}) => (
  <section className="relative overflow-hidden border-b border-border">
    <div className="absolute inset-0 bg-secondary/40 paper-grain" aria-hidden />
    <div className="container relative grid md:grid-cols-12 gap-10 items-end py-20 md:py-28">
      <div className="md:col-span-7 animate-fade-rise">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="display-serif-feel text-primary text-5xl md:text-6xl lg:text-7xl mt-5">
          {title}
        </h1>
        {intro && <p className="mt-6 text-ink-soft text-lg max-w-xl leading-relaxed">{intro}</p>}
        <div className="mt-7 gold-bar" />
      </div>
      {image && (
        <div className="md:col-span-5 relative">
          <div className="aspect-[4/5] overflow-hidden editorial-shadow ring-1 ring-accent/30">
            <img src={image} alt={imageAlt || ""} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="absolute -bottom-3 -right-3 hidden md:block h-24 w-24 border border-accent" aria-hidden />
        </div>
      )}
    </div>
  </section>
);

export const Prose = ({ children }: { children: ReactNode }) => (
  <div className="prose-editorial space-y-5 text-ink-soft text-[16px] leading-[1.8]">
    {children}
  </div>
);

export const InfoCard = ({ icon, title, children }: { icon: string; title: string; children: ReactNode }) => (
  <article className="group bg-card border border-border p-7 hover:border-accent/60 transition-colors">
    <div className="h-12 w-12 border border-accent/40 flex items-center justify-center text-accent">
      <Ion name={icon} className="text-2xl" />
    </div>
    <h3 className="mt-5 font-semibold text-primary text-lg tracking-tight">{title}</h3>
    <div className="mt-2 text-sm text-ink-soft leading-relaxed">{children}</div>
  </article>
);

export const NumberedItem = ({
  index,
  icon,
  title,
  children,
}: {
  index: string;
  icon: string;
  title: string;
  children: ReactNode;
}) => (
  <article className="group relative pl-14 pr-4 py-7 border-b border-border last:border-b-0">
    <div className="absolute left-0 top-7 font-display text-accent/70 text-sm tracking-widest">{index}</div>
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 border border-accent/40 flex items-center justify-center text-accent shrink-0">
        <Ion name={icon} className="text-xl" />
      </div>
      <h3 className="font-semibold text-primary text-xl tracking-tight">{title}</h3>
    </div>
    <p className="mt-3 text-ink-soft leading-relaxed">{children}</p>
  </article>
);

export const CtaBand = ({
  eyebrow = "Join Us",
  title,
  body,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  primary: { label: string; to: string; icon?: string };
  secondary?: { label: string; to: string; icon?: string };
}) => (
  <section className="relative bg-primary text-primary-foreground overflow-hidden">
    <div className="absolute inset-0 opacity-[0.07] paper-grain" aria-hidden />
    <div className="container relative py-20 grid md:grid-cols-12 gap-10 items-center">
      <div className="md:col-span-8">
        <Eyebrow className="text-accent">{eyebrow}</Eyebrow>
        <h2 className="display-serif-feel text-3xl md:text-5xl mt-4">{title}</h2>
        {body && <p className="mt-5 text-primary-foreground/80 max-w-2xl leading-relaxed">{body}</p>}
      </div>
      <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
        <Link
          to={primary.to}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3.5 text-sm font-medium tracking-wide hover:opacity-90 transition"
        >
          <Ion name={primary.icon || "heart"} className="text-base" />
          {primary.label}
          <Ion name="arrow-forward-outline" className="text-base" />
        </Link>
        {secondary && (
          <Link
            to={secondary.to}
            className="inline-flex items-center gap-2 border border-primary-foreground/30 px-6 py-3.5 text-sm font-medium tracking-wide hover:border-accent hover:text-accent transition"
          >
            <Ion name={secondary.icon || "arrow-forward-outline"} className="text-base" />
            {secondary.label}
          </Link>
        )}
      </div>
    </div>
  </section>
);
