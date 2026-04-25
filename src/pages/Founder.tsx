import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, CtaBand } from "@/components/site/Editorial";
import { Ion } from "@/components/Ion";
import founderPortrait from "@/assets/founder-portrait.jpg";

const Founder = () => (
  <SiteLayout>
    <PageHero
      eyebrow="Founder's Message"
      title={<>A letter from<br />Hajia Binta Ibrahim.</>}
      intro="The conviction that gave The Bints Foundation its name and shape."
      image={founderPortrait}
      imageAlt="Hajia Binta Ibrahim, Founder"
    />

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
