import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, Prose, SectionHeader, CtaBand } from "@/components/site/Editorial";
import { ReactNode } from "react";

interface ContentPageProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  body: ReactNode;
  cta?: {
    title: ReactNode;
    body?: ReactNode;
    primary: { label: string; to: string; icon?: string };
    secondary?: { label: string; to: string; icon?: string };
  };
}

export const ContentPage = ({ eyebrow, title, intro, image, body, cta }: ContentPageProps) => (
  <SiteLayout>
    <PageHero eyebrow={eyebrow} title={title} intro={intro} image={image} imageAlt={typeof title === "string" ? title : eyebrow} />
    <section className="container py-20">
      <div className="grid lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3">
          <div className="sticky top-28">
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
