import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Prose, SectionHeader, CtaBand } from "@/components/site/Editorial";
import { Ion } from "@/components/Ion";
import { ReactNode } from "react";

interface ContentPageProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  icon?: string;
  body: ReactNode;
  cta?: {
    title: ReactNode;
    body?: ReactNode;
    primary: { label: string; to: string; icon?: string };
    secondary?: { label: string; to: string; icon?: string };
  };
}

export const ContentPage = ({ eyebrow, title, intro, image, icon, body, cta }: ContentPageProps) => (
  <SiteLayout>
    <PageHero
      eyebrow={eyebrow}
      title={title}
      intro={intro}
      image={image}
      icon={icon}
      imageAlt={typeof title === "string" ? title : eyebrow}
    />
    <section className="container py-20">
      <div className="grid lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3">
          <div className="sticky top-28">
            {icon && (
              <div className="relative h-14 w-14 flex items-center justify-center text-accent mb-5 bg-gradient-to-br from-primary to-primary-glow ring-1 ring-accent/50 rounded-sm overflow-hidden shadow-[0_12px_30px_-12px_hsl(var(--primary)/0.55)]">
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.3),transparent_60%)]" aria-hidden />
                <span className="absolute inset-[3px] ring-1 ring-accent/25 rounded-[2px]" aria-hidden />
                <Ion name={icon} className="relative text-[24px]" />
              </div>
            )}
            <div className="eyebrow">{eyebrow}</div>
            <div className="gold-bar mt-3" />
            <p className="mt-4 text-xs text-ink-soft leading-relaxed">
              The Bints Foundation operates with structure, accountability and measurable outcomes — partnering with public, private and development sectors.
            </p>
          </div>
        </aside>
        <div className="lg:col-span-9">
          <Prose>{body}</Prose>
        </div>
      </div>
    </section>
    {cta && (
      <CtaBand
        title={cta.title}
        body={cta.body}
        primary={cta.primary}
        secondary={cta.secondary}
      />
    )}
  </SiteLayout>
);

export { SectionHeader };

