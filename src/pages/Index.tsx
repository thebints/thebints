import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Eyebrow, SectionHeader, NumberedItem, CtaBand } from "@/components/site/Editorial";
import { Ion } from "@/components/Ion";
import heroPortrait from "@/assets/hero-portrait.jpg";
import girlEducation from "@/assets/girl-education.jpg";
import womenEnterprise from "@/assets/women-enterprise.jpg";
import mentorshipImg from "@/assets/mentorship.jpg";
import housingImg from "@/assets/housing.jpg";
import welfareImg from "@/assets/welfare.jpg";
import founderPortrait from "@/assets/founder-portrait.jpg";
import leadershipImg from "@/assets/leadership.jpg";
import womenIct from "@/assets/women-ict.jpg";
import womenSkills from "@/assets/women-skills.jpg";
import womenTailoring from "@/assets/women-tailoring.jpg";

const focusAreas = [
  {
    index: "01",
    icon: "briefcase-outline",
    title: "Women's Economic Empowerment",
    body: "Supporting women to build, grow and sustain businesses through training, opportunities and enterprise development.",
    href: "/focus/economic-empowerment",
  },
  {
    index: "02",
    icon: "school-outline",
    title: "Girl-Child Education & Mentorship",
    body: "Educational support, mentorship and leadership guidance for girls and young women.",
    href: "/focus/education",
  },
  {
    index: "03",
    icon: "home-outline",
    title: "Asset Ownership & Social Housing",
    body: "Land and housing access through structured, dignity-led ownership pathways for low and middle-income women.",
    href: "/focus/housing",
  },
  {
    index: "04",
    icon: "heart-outline",
    title: "Welfare, Care & Humanitarian Support",
    body: "Structured support for vulnerable women and girls during times of need and crisis.",
    href: "/focus/welfare",
  },
  {
    index: "05",
    icon: "ribbon-outline",
    title: "Leadership & Personal Development",
    body: "Equipping women and girls with leadership skills, confidence and capacity for personal and professional growth.",
    href: "/focus/leadership",
  },
];

const programmes = [
  { name: "Bints Women Empowerment Programme", icon: "sparkles-outline", to: "/programmes/women-empowerment" },
  { name: "Girl-Child Education Support Initiative", icon: "school-outline", to: "/programmes/girl-child-education" },
  { name: "Skills for Dignity Programme", icon: "construct-outline", to: "/programmes/skills-for-dignity" },
  { name: "Mentorship Circle", icon: "people-circle-outline", to: "/programmes/mentorship-circle" },
  { name: "Welfare and Care Outreach", icon: "hand-left-outline", to: "/programmes/welfare-care" },
  { name: "Enterprise Support Scheme", icon: "trending-up-outline", to: "/programmes/enterprise-support" },
  { name: "Back-to-School Project", icon: "bag-outline", to: "/programmes/back-to-school" },
  { name: "Dignity Kit Project", icon: "gift-outline", to: "/programmes/dignity-kit" },
  { name: "Widows Support Programme", icon: "rose-outline", to: "/programmes/widows-support" },
  { name: "Housing & Social Housing Initiative", icon: "business-outline", to: "/programmes/housing-initiative" },
];

const bints = [
  { letter: "B", word: "Benevolence", body: "We serve with compassion and a genuine desire to uplift women and girls." },
  { letter: "I", word: "Integrity", body: "We uphold transparency, honesty and accountability in all our actions." },
  { letter: "N", word: "Nurture", body: "We support continuous growth, development and empowerment." },
  { letter: "T", word: "Transformation", body: "We are committed to creating lasting and measurable change." },
  { letter: "S", word: "Sustainability", body: "We design solutions that deliver long-term impact." },
];

const Index = () => (
  <SiteLayout>
    {/* HERO */}
    <section className="relative overflow-hidden bg-secondary/40">
      <div className="container relative grid lg:grid-cols-12 gap-10 items-center pt-12 lg:pt-20 pb-20">
        <div className="lg:col-span-7 relative z-10 animate-fade-rise">
          <Eyebrow>The Bints Foundation</Eyebrow>
          <h1 className="display-serif-feel text-primary text-5xl sm:text-6xl lg:text-[5.25rem] mt-6">
            Dignity.<br />
            Opportunity.<br />
            <span className="relative inline-block">
              Sustainable Impact.
              <span className="absolute left-0 -bottom-2 h-[5px] w-[62%] bg-accent" />
            </span>
          </h1>
          <p className="mt-7 text-ink-soft text-lg max-w-xl leading-relaxed">
            A women & girls-focused development organisation building structured, accountable and lasting empowerment across Nigeria — through education, enterprise, mentorship, housing and welfare.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/donate" className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-primary-glow transition">
              <Ion name="heart" className="text-accent text-base" />
              Donate to Empower
              <Ion name="arrow-forward-outline" className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/programmes/women-empowerment" className="inline-flex items-center gap-2 border border-primary/30 text-primary px-7 py-3.5 text-sm font-medium tracking-wide hover:border-accent hover:text-accent transition">
              <Ion name="albums-outline" />
              Our Programmes
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl">
            {[
              { k: "10", l: "Flagship Programmes" },
              { k: "5", l: "Areas of Focus" },
              { k: "1", l: "Mission of Dignity" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-primary text-4xl font-bold">{s.k}</div>
                <div className="mt-1 text-[11px] tracking-[0.18em] uppercase text-ink-soft">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[3/4] overflow-hidden editorial-shadow ring-1 ring-accent/40">
            <img
              src={heroPortrait}
              alt="Portrait of a confident Nigerian woman in burgundy and gold ankara"
              className="h-full w-full object-cover animate-slow-zoom"
              width={1080}
              height={1440}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </div>
          <div className="absolute -left-4 -top-4 h-28 w-28 border-2 border-accent" aria-hidden />
          <div className="absolute -right-4 -bottom-4 hidden md:block bg-primary text-primary-foreground p-5 max-w-[220px]">
            <div className="eyebrow text-accent">Founder</div>
            <p className="mt-2 text-sm leading-snug">Hajia Binta Ibrahim, FCAI ARPA</p>
          </div>
        </div>
      </div>
      <div className="h-px bg-gold opacity-60" />
    </section>

    {/* INTRO + BINTS */}
    <section className="container py-24">
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <Eyebrow>About the Foundation</Eyebrow>
          <h2 className="display-serif-feel text-primary text-4xl md:text-5xl mt-5">
            Empowerment built on dignity, accountability and lasting impact.
          </h2>
          <p className="mt-6 text-ink-soft leading-relaxed">
            The Bints Foundation was established as a structured platform to bridge the gaps that leave many women and girls underserved. We move beyond short-term interventions to design programmes that build capacity, inspire confidence and create pathways for long-term transformation.
          </p>
          <Link to="/about/founder" className="link-gold mt-7 text-sm font-medium">
            Read the founder's message <Ion name="arrow-forward-outline" />
          </Link>
        </div>

        <div className="lg:col-span-7">
          <div className="border border-border bg-card">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div className="eyebrow">Our Core Values</div>
              <div className="font-display text-accent font-bold tracking-[0.4em] text-sm">B · I · N · T · S</div>
            </div>
            <div className="divide-y divide-border">
              {bints.map((v, i) => (
                <div key={v.word} className="grid grid-cols-12 items-baseline gap-4 px-8 py-5 hover:bg-secondary/50 transition-colors">
                  <div className="col-span-1 font-display text-accent font-bold text-3xl">{v.letter}</div>
                  <div className="col-span-3 font-semibold text-primary tracking-tight">{v.word}</div>
                  <div className="col-span-8 text-sm text-ink-soft">{v.body}</div>
                  <div className="col-span-12 text-[10px] tracking-widest text-ink-soft/60 text-right">— {String(i + 1).padStart(2, "0")} —</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* FOCUS AREAS */}
    <section className="bg-bone border-y border-border">
      <div className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <SectionHeader
            eyebrow="Areas of Focus"
            title={<>Five disciplines.<br />One mission of dignity.</>}
            intro="Each focus area is delivered through structured, measurable programmes that promote self-reliance, sustainable livelihoods and long-term security."
          />
          <Link to="/focus/economic-empowerment" className="link-gold text-sm font-medium shrink-0">
            Explore all focus areas <Ion name="arrow-forward-outline" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-x-14 gap-y-2">
          {focusAreas.map((f) => (
            <Link key={f.index} to={f.href} className="block">
              <NumberedItem index={f.index} icon={f.icon} title={f.title}>
                {f.body}
              </NumberedItem>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* FOUNDER */}
    <section className="container py-24">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="aspect-[3/4] overflow-hidden ring-1 ring-accent/40 editorial-shadow">
            <img src={founderPortrait} alt="Hajia Binta Ibrahim, Founder" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="absolute -right-3 -bottom-3 hidden md:block h-32 w-32 border border-accent" aria-hidden />
        </div>
        <div className="lg:col-span-7">
          <Eyebrow>Founder's Message</Eyebrow>
          <blockquote className="mt-6">
            <Ion name="quote" className="text-accent text-5xl" />
            <p className="font-display text-primary text-2xl md:text-3xl leading-tight tracking-tight mt-3">
              "When women are given the right support, opportunities and environment, they do not merely survive — they thrive, and in doing so, they uplift families, communities and society at large."
            </p>
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <div className="gold-bar" />
            <div>
              <div className="font-semibold text-primary">Hajia Binta Ibrahim, FCAI ARPA</div>
              <div className="text-xs uppercase tracking-widest text-ink-soft">Founder, The Bints Foundation</div>
            </div>
          </div>
          <Link to="/about/founder" className="link-gold mt-8 text-sm font-medium">
            Read the full message <Ion name="arrow-forward-outline" />
          </Link>
        </div>
      </div>
    </section>

    {/* PROGRAMMES MOSAIC */}
    <section className="bg-primary text-primary-foreground">
      <div className="container py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow className="text-accent">Flagship Programmes</Eyebrow>
            <h2 className="display-serif-feel text-3xl md:text-5xl mt-5">
              Ten programmes,<br />one promise of impact.
            </h2>
            <p className="mt-6 text-primary-foreground/75 leading-relaxed max-w-md">
              Each programme is designed to deliver measurable impact and contribute to the overall mission of the Foundation — from enterprise support to social housing.
            </p>
            <Link to="/programmes/women-empowerment" className="mt-8 inline-flex items-center gap-2 border border-accent/50 text-accent px-6 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition">
              <Ion name="albums-outline" /> Browse all programmes
            </Link>
          </div>
          <div className="lg:col-span-7">
            <ul className="grid sm:grid-cols-2 gap-px bg-primary-foreground/10">
              {programmes.map((p, i) => (
                <li key={p.name}>
                  <Link to={p.to} className="group flex items-center gap-4 bg-primary px-5 py-5 hover:bg-primary-glow transition-colors">
                    <span className="font-display text-accent/70 text-xs tracking-widest w-8">{String(i + 1).padStart(2, "0")}</span>
                    <Ion name={p.icon} className="text-accent text-xl shrink-0" />
                    <span className="text-sm font-medium tracking-tight flex-1">{p.name}</span>
                    <Ion name="arrow-forward-outline" className="text-primary-foreground/50 group-hover:text-accent transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* IMAGE GRID */}
    <section className="container py-24">
      <SectionHeader
        eyebrow="In the Field"
        title={<>Where dignity meets<br />real life.</>}
      />
      <div className="mt-12 grid grid-cols-12 gap-4 md:gap-6">
        {[
          { src: girlEducation, alt: "Bints Foundation distributing school materials to girls", label: "Education", span: "col-span-12 md:col-span-7 aspect-[16/10]" },
          { src: womenEnterprise, alt: "Women's Economic Empowerment workshop", label: "Enterprise", span: "col-span-12 md:col-span-5 aspect-[4/5]" },
          { src: womenTailoring, alt: "Women in tailoring training", label: "Skills", span: "col-span-6 md:col-span-4 aspect-square" },
          { src: womenIct, alt: "Young women learning ICT skills", label: "ICT", span: "col-span-6 md:col-span-4 aspect-square" },
          { src: welfareImg, alt: "Welfare outreach in the community", label: "Welfare", span: "col-span-12 md:col-span-4 aspect-square" },
          { src: leadershipImg, alt: "Mentor speaking to a circle of young women", label: "Leadership", span: "col-span-12 aspect-[21/9]" },
          { src: mentorshipImg, alt: "Diverse women volunteers", label: "Volunteers", span: "col-span-6 md:col-span-5 aspect-[4/3]" },
          { src: housingImg, alt: "Women reviewing a housing brochure", label: "Housing", span: "col-span-6 md:col-span-4 aspect-[4/3]" },
          { src: womenSkills, alt: "Women learning bead-craft skills", label: "Community", span: "col-span-12 md:col-span-3 aspect-[4/3]" },
        ].map((img) => (
          <figure key={img.label} className={`${img.span} relative overflow-hidden group`}>
            <img src={img.src} alt={img.alt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/0 to-transparent" />
            <figcaption className="absolute bottom-4 left-5 text-primary-foreground">
              <div className="eyebrow text-accent">Bints</div>
              <div className="font-display font-bold text-2xl tracking-tight">{img.label}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>

    <CtaBand
      title={<>Partner with us in restoring dignity to women and girls.</>}
      body="The Foundation welcomes partnerships in grant funding, education, skills, women empowerment, dignity campaigns, mentorship, community outreach and social housing."
      primary={{ label: "Donate Now", to: "/donate", icon: "heart" }}
      secondary={{ label: "Become a Partner", to: "/get-involved/partner", icon: "git-merge-outline" }}
    />
  </SiteLayout>
);

export default Index;
