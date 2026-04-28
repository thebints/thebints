import { SiteLayout } from "@/components/site/SiteLayout";
import { CtaBand, Eyebrow } from "@/components/site/Editorial";
import { Ion } from "@/components/Ion";
import founderPortrait from "@/assets/founder-portrait.jpg";

const Founder = () => (
  <SiteLayout>
    {/* Editorial hero — portrait-led, responsive crop */}
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-secondary/40 paper-grain" aria-hidden />
      <div className="container relative grid lg:grid-cols-12 gap-10 lg:gap-14 items-center py-16 md:py-24">
        <div className="lg:col-span-6 order-2 lg:order-1 animate-fade-rise">
          <div className="mb-6 inline-flex items-center gap-3">
            <div className="relative h-14 w-14 flex items-center justify-center bg-gradient-to-br from-primary to-primary-glow text-accent shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.6)] ring-1 ring-accent/50 rounded-sm overflow-hidden">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.35),transparent_60%)]" aria-hidden />
              <span className="absolute inset-[3px] ring-1 ring-accent/25 rounded-[2px]" aria-hidden />
              <Ion name="create-outline" className="relative text-[22px]" />
            </div>
            <span className="h-px w-12 bg-gradient-to-r from-accent to-transparent" />
          </div>
          <Eyebrow>Founder's Message</Eyebrow>
          <h1 className="display-serif-feel text-primary text-4xl sm:text-5xl lg:text-6xl mt-5 leading-[1.05]">
            A letter from<br />Hajia Binta Ibrahim.
          </h1>
          <div className="mt-7 gold-bar" />
          <div className="mt-6 text-xs uppercase tracking-widest text-accent">FCAI · ARPA · Founder</div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2 relative">
          <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] overflow-hidden editorial-shadow ring-1 ring-accent/40">
            <img
              src={founderPortrait}
              alt="Hajia Binta Ibrahim, Founder of The Bints Foundation"
              className="absolute inset-0 h-full w-full object-cover object-[60%_top] lg:object-[55%_top]"
              loading="eager"
              width={1080}
              height={1350}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-primary-foreground">
              <div className="eyebrow text-accent">The Founder</div>
              <div className="font-display font-bold text-2xl tracking-tight mt-1">Hajia Binta Ibrahim</div>
            </div>
          </div>
          <div className="absolute -left-3 -top-3 h-24 w-24 border-2 border-accent hidden md:block" aria-hidden />
          <div className="absolute -right-3 -bottom-3 h-24 w-24 border border-accent/60 hidden md:block" aria-hidden />
        </div>
      </div>
    </section>

    <section className="container py-20">
      <div className="grid lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3">
          <div className="sticky top-28">
            <div className="eyebrow">Founder</div>
            <div className="gold-bar mt-3" />
            <p className="mt-4 font-semibold text-primary text-sm">Hajia Binta Ibrahim, FCAI ARPA</p>
            <p className="text-xs text-ink-soft mt-1">Founder, The Bints Foundation</p>
            <a href="/about/governance" className="link-gold mt-6 inline-flex text-xs">Governance & leadership <Ion name="arrow-forward-outline" /></a>
          </div>
        </aside>

        <article className="lg:col-span-9 space-y-6 text-ink-soft text-[16.5px] leading-[1.85]">
          <p className="drop-cap">The Bints Foundation was born out of a deep and enduring commitment to improving the lives of women and girls. Over the years, I have had the privilege of working closely with women across different sectors, listening to their stories, understanding their struggles and celebrating their resilience and successes.</p>

          <p>Through these experiences, one truth has remained clear; <em className="text-primary not-italic font-medium">when women are given the right support, opportunities and environment, they do not merely survive, they thrive,</em> and in doing so, they uplift families, communities and society at large.</p>

          <p>However, I have also seen that many women and girls remain underserved. They lack access to education, mentorship, economic opportunities and structured support systems that can help them grow with dignity and confidence.</p>

          <p>The Bints Foundation has therefore been established as a structured platform to bridge this gap. It is designed to deliver empowerment that is not based on charity alone, but on dignity, accountability and sustainable impact.</p>

          <p>Our goal is not only to provide support but to build capacity, inspire confidence and create pathways for long-term transformation.</p>

          <p>I invite partners, stakeholders and all well-meaning individuals to join us in this journey as we work together to empower women and girls and build a more inclusive and equitable society.</p>

          <div className="pt-8 mt-10 border-t border-border">
            <div className="font-display text-primary text-2xl italic" style={{ fontFamily: "Poppins, cursive" }}>Hajia Binta Ibrahim</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-accent">Founder, The Bints Foundation</div>
            <div className="mt-1 text-xs text-ink-soft">FCAI · ARPA</div>
          </div>
        </article>
      </div>
    </section>

    <CtaBand
      title={<>Join the Founder in this work.</>}
      body="Whether through partnership, volunteering or a single gift — your contribution moves a woman or girl from where she is to where she can be."
      primary={{ label: "Donate", to: "/donate", icon: "heart" }}
      secondary={{ label: "Partner With Us", to: "/get-involved/partner", icon: "git-merge-outline" }}
    />
  </SiteLayout>
);

export default Founder;
