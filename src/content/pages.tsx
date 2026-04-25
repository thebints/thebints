import { ReactNode } from "react";

export interface PageContent {
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  body: ReactNode;
  cta?: {
    title: ReactNode;
    body?: string;
    primary: { label: string; to: string; icon?: string };
    secondary?: { label: string; to: string; icon?: string };
  };
}

import girlEducation from "@/assets/girl-education.jpg";
import womenEnterprise from "@/assets/women-enterprise.jpg";
import housingImg from "@/assets/housing.jpg";
import welfareImg from "@/assets/welfare.jpg";
import mentorshipImg from "@/assets/mentorship.jpg";
import leadershipImg from "@/assets/leadership.jpg";
import founderPortrait from "@/assets/founder-portrait.jpg";

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="space-y-3 not-prose">
    {items.map((i) => (
      <li key={i} className="flex gap-3 text-ink-soft">
        <span className="mt-2 h-1.5 w-1.5 bg-accent shrink-0 rounded-full" />
        <span className="leading-relaxed">{i}</span>
      </li>
    ))}
  </ul>
);

const Heading = ({ children }: { children: ReactNode }) => (
  <h2 className="font-display text-primary text-2xl md:text-3xl font-bold tracking-tight mt-12 first:mt-0">{children}</h2>
);

const standardCta = (focus = "this programme") => ({
  title: <>Walk with us in {focus}.</>,
  body: "Your partnership multiplies our reach. Donate, volunteer, or join our network of mentors and corporate partners.",
  primary: { label: "Donate", to: "/donate", icon: "heart" },
  secondary: { label: "Become a Partner", to: "/get-involved/partner", icon: "git-merge-outline" },
});

export const PAGE_CONTENT: Record<string, PageContent> = {
  // ABOUT
  "/about/vision-mission": {
    eyebrow: "About Us",
    title: "Vision & Mission",
    intro: "The compass that guides every programme, every partnership and every encounter.",
    image: leadershipImg,
    body: (
      <>
        <Heading>Our Vision</Heading>
        <p>To build a society where women and girls are empowered, educated, supported and equipped to live with dignity, confidence and economic independence.</p>
        <Heading>Our Mission</Heading>
        <p>To improve the lives of women and girls through structured empowerment programmes, education support, mentorship, welfare interventions and strategic partnerships that promote sustainable development.</p>
        <Heading>Our Objectives</Heading>
        <Bullets items={[
          "Empower women and girls with skills, knowledge and opportunities that promote self-reliance and sustainable livelihoods.",
          "Support access to education, mentorship and personal development for girls and young women.",
          "Provide structured welfare and social support for vulnerable women, girls and families in need.",
          "Promote women's economic advancement through enterprise support, financial literacy and access to ethical funding opportunities.",
          "Build strategic partnerships that enhance community impact and sustainable development initiatives.",
        ]} />
      </>
    ),
    cta: standardCta("our mission"),
  },

  "/about/values": {
    eyebrow: "About Us",
    title: "Core Values — BINTS",
    intro: "Our work is guided by five values, captured in the acronym that gives the Foundation its name.",
    body: (
      <>
        {[
          { l: "B", n: "Benevolence", b: "We serve with compassion and a genuine desire to uplift women and girls." },
          { l: "I", n: "Integrity", b: "We uphold transparency, honesty and accountability in all our actions." },
          { l: "N", n: "Nurture", b: "We support continuous growth, development and empowerment." },
          { l: "T", n: "Transformation", b: "We are committed to creating lasting and measurable change." },
          { l: "S", n: "Sustainability", b: "We design solutions that deliver long-term impact." },
        ].map((v) => (
          <div key={v.l} className="not-prose grid grid-cols-12 gap-6 items-baseline border-b border-border py-8">
            <div className="col-span-2 md:col-span-1 font-display text-accent font-bold text-5xl md:text-6xl">{v.l}</div>
            <div className="col-span-10 md:col-span-3 font-display text-primary text-xl md:text-2xl font-bold tracking-tight">{v.n}</div>
            <p className="col-span-12 md:col-span-8 text-ink-soft leading-relaxed">{v.b}</p>
          </div>
        ))}
      </>
    ),
    cta: standardCta("our values"),
  },

  "/about/governance": {
    eyebrow: "About Us",
    title: "Governance & Leadership",
    intro: "The Foundation operates with a clear governance framework to ensure accountability and sustainability.",
    body: (
      <>
        <p>Structure is the foundation of trust. Every programme, partnership and pound of impact passes through a defined chain of accountability.</p>
        <Heading>Governance Structure</Heading>
        <Bullets items={[
          "Founder / Chairperson",
          "Board of Trustees",
          "Executive Management",
          "Programme Teams",
          "Finance and Administration",
          "Monitoring and Evaluation",
          "Volunteers and Community Coordinators",
        ]} />
        <Heading>Implementation Approach</Heading>
        <Bullets items={[
          "Needs-based programme design",
          "Community engagement and participation",
          "Partnership-driven execution",
          "Monitoring and evaluation systems",
          "Accountability and transparent reporting",
          "Asset-based empowerment strategies (e.g., housing and land ownership)",
        ]} />
      </>
    ),
    cta: standardCta("our governance"),
  },

  "/about/background": {
    eyebrow: "About Us",
    title: "Background",
    intro: "The gap that called us into being.",
    image: mentorshipImg,
    body: (
      <>
        <p className="drop-cap">Across many communities, women and girls continue to face significant challenges: limited access to quality education and mentorship; economic vulnerability and restricted access to capital; a shortage of structured support systems; exposure to social and welfare challenges; and limited opportunities for personal and leadership development.</p>
        <p>While various initiatives exist, many are either fragmented, unsustained or limited in scope. The Bints Foundation was established to address these gaps by providing a holistic, structured and sustainable approach to empowering women and girls — moving beyond short-term interventions to create lasting impact through well-designed programmes, partnerships and community-based engagement.</p>
        <Heading>The Challenges We Address</Heading>
        <Bullets items={[
          "Limited access to quality education and mentorship",
          "Economic vulnerability and restricted access to capital",
          "Lack of structured support systems",
          "Exposure to social and welfare challenges",
          "Limited opportunities for personal and leadership development",
        ]} />
      </>
    ),
    cta: standardCta("closing the gap"),
  },

  // FOCUS
  "/focus/economic-empowerment": {
    eyebrow: "Our Focus",
    title: "Women's Economic Empowerment",
    intro: "Supporting women to build, grow and sustain businesses through training, opportunities and enterprise development.",
    image: womenEnterprise,
    body: (
      <>
        <p>Economic independence is the bedrock of dignity. The Bints Foundation invests in women across the enterprise lifecycle — from skills and confidence to capital and market access.</p>
        <Heading>What We Do</Heading>
        <Bullets items={[
          "Enterprise development and business training",
          "Financial literacy programmes",
          "Pathways to ethical funding opportunities",
          "Market access and cooperative formation",
          "Mentorship for women business owners",
        ]} />
        <Heading>Related Programmes</Heading>
        <Bullets items={[
          "Bints Women Empowerment Programme",
          "Bints Skills for Dignity Programme",
          "Bints Enterprise Support Scheme",
        ]} />
      </>
    ),
    cta: standardCta("women's economic empowerment"),
  },

  "/focus/education": {
    eyebrow: "Our Focus",
    title: "Girl-Child Education & Mentorship",
    intro: "Educational support, mentorship and leadership guidance for girls and young women.",
    image: girlEducation,
    body: (
      <>
        <p>When a girl stays in school, an entire community changes course. We invest in keeping girls in classrooms and circles of mentorship that build confidence and capability for life.</p>
        <Heading>What We Do</Heading>
        <Bullets items={[
          "Tuition, supplies and back-to-school support",
          "Structured mentorship for girls and young women",
          "Leadership development and life skills",
          "Career guidance and exposure",
        ]} />
        <Heading>Related Programmes</Heading>
        <Bullets items={[
          "Bints Girl-Child Education Support Initiative",
          "Bints Back-to-School Project",
          "Bints Mentorship Circle",
          "Bints Dignity Kit Project",
        ]} />
      </>
    ),
    cta: standardCta("girl-child education"),
  },

  "/focus/housing": {
    eyebrow: "Our Focus",
    title: "Asset Ownership & Social Housing",
    intro: "Land, housing and dignity-led ownership models for low and middle-income women.",
    image: housingImg,
    body: (
      <>
        <p>The Foundation promotes women's access to land and housing through structured initiatives that enable long-term security, dignity and wealth creation. This includes social housing models designed to support low- and middle-income women through affordable, flexible and sustainable ownership pathways. Through strategic partnerships and innovative financing systems, women are empowered not just to earn, but to own.</p>
        <Heading>Key Components</Heading>
        <Bullets items={[
          "Affordable housing schemes for women",
          "Social housing models for low-income earners",
          "Installment-based ownership plans",
          "Cooperative housing systems",
          "Partnerships with developers, government and financial institutions",
          "Property and asset acquisition education",
        ]} />
      </>
    ),
    cta: standardCta("the housing initiative"),
  },

  "/focus/welfare": {
    eyebrow: "Our Focus",
    title: "Welfare, Care & Humanitarian Support",
    intro: "Structured support for vulnerable women and girls during times of need and crisis.",
    image: welfareImg,
    body: (
      <>
        <p>Care, delivered with structure. Our welfare interventions meet women and girls in moments of vulnerability with practical support and lasting follow-through.</p>
        <Heading>What We Do</Heading>
        <Bullets items={[
          "Direct welfare support for vulnerable families",
          "Crisis response and humanitarian outreach",
          "Dignity essentials for girls and women",
          "Standing alongside widows with structured care",
        ]} />
        <Heading>Related Programmes</Heading>
        <Bullets items={[
          "Bints Welfare and Care Outreach",
          "Bints Dignity Kit Project",
          "Bints Widows Support Programme",
        ]} />
      </>
    ),
    cta: standardCta("welfare and care"),
  },

  "/focus/leadership": {
    eyebrow: "Our Focus",
    title: "Leadership & Personal Development",
    intro: "Equipping women and girls with leadership skills, confidence and capacity for personal and professional growth.",
    image: leadershipImg,
    body: (
      <>
        <p>Leadership is not a title — it is a practice. We equip women and girls with the inner confidence and outer capability to lead in homes, communities, businesses and institutions.</p>
        <Heading>What We Do</Heading>
        <Bullets items={[
          "Leadership training and public speaking",
          "Confidence and personal-mastery workshops",
          "Mentorship by women leaders",
          "Exposure to professional and civic platforms",
        ]} />
      </>
    ),
    cta: standardCta("leadership development"),
  },

  // PROGRAMMES
  "/programmes/women-empowerment": {
    eyebrow: "Programme",
    title: "Bints Women Empowerment Programme",
    intro: "Our flagship empowerment track — training, capacity, confidence and access for women across sectors.",
    image: womenEnterprise,
    body: (
      <>
        <p>The Women Empowerment Programme delivers structured training, mentorship and access to opportunity for women seeking self-reliance and growth.</p>
        <Heading>Programme Pillars</Heading>
        <Bullets items={[
          "Skills and capacity building",
          "Mentorship by experienced women leaders",
          "Access to enterprise and financial pathways",
          "Confidence, leadership and personal development",
        ]} />
      </>
    ),
    cta: standardCta("women's empowerment"),
  },

  "/programmes/girl-child-education": {
    eyebrow: "Programme",
    title: "Bints Girl-Child Education Support Initiative",
    intro: "Scholarships, supplies and learning support that keep girls in school and progressing.",
    image: girlEducation,
    body: (
      <>
        <p>We partner with families, schools and community leaders to remove the barriers that interrupt a girl's education — from fees and uniforms to mentorship and life skills.</p>
        <Heading>What We Provide</Heading>
        <Bullets items={[
          "Tuition and school-fee support",
          "Books, uniforms and learning materials",
          "Mentorship and academic guidance",
          "Pathways for transition to higher education",
        ]} />
      </>
    ),
    cta: standardCta("girl-child education"),
  },

  "/programmes/skills-for-dignity": {
    eyebrow: "Programme",
    title: "Bints Skills for Dignity Programme",
    intro: "Vocational and digital skills with real market value — restoring agency through ability.",
    image: womenEnterprise,
    body: (
      <>
        <p>Skills for Dignity prepares women for sustainable livelihoods through training rooted in market demand, professional standards and personal pride.</p>
        <Heading>Skill Tracks</Heading>
        <Bullets items={[
          "Vocational trades (tailoring, catering, beauty, agro-processing)",
          "Digital skills and online enterprise",
          "Financial literacy and business basics",
          "Soft skills and workplace readiness",
        ]} />
      </>
    ),
    cta: standardCta("skills for dignity"),
  },

  "/programmes/mentorship-circle": {
    eyebrow: "Programme",
    title: "Bints Mentorship Circle",
    intro: "Structured mentorship pairing women and girls with leaders who walk their journey with them.",
    image: mentorshipImg,
    body: (
      <>
        <p>The Mentorship Circle is a community of mentors and mentees committed to long-term, structured guidance — not occasional advice.</p>
        <Heading>How It Works</Heading>
        <Bullets items={[
          "Curated mentor-mentee matching",
          "Quarterly group circles and one-on-one sessions",
          "Goal setting, accountability and review",
          "Access to a wider network of women leaders",
        ]} />
      </>
    ),
    cta: standardCta("the Mentorship Circle"),
  },

  "/programmes/welfare-care": {
    eyebrow: "Programme",
    title: "Bints Welfare and Care Outreach",
    intro: "Direct support to vulnerable women, girls and families with structure and follow-through.",
    image: welfareImg,
    body: (
      <>
        <p>Welfare and Care Outreach reaches families in moments of need with food security, essential supplies and connections to longer-term support.</p>
        <Heading>What We Deliver</Heading>
        <Bullets items={[
          "Food and essential support",
          "Health and hygiene assistance",
          "Referral pathways to longer-term care",
          "Crisis intervention",
        ]} />
      </>
    ),
    cta: standardCta("welfare outreach"),
  },

  "/programmes/enterprise-support": {
    eyebrow: "Programme",
    title: "Bints Enterprise Support Scheme",
    intro: "Tools, training and ethical capital for women in business.",
    image: womenEnterprise,
    body: (
      <>
        <p>The Enterprise Support Scheme matches women entrepreneurs with the tools, training and ethical capital they need to grow.</p>
        <Heading>Scheme Components</Heading>
        <Bullets items={[
          "Business diagnostic and growth planning",
          "Equipment and tools support",
          "Pathways to ethical funding",
          "Market linkage and customer access",
        ]} />
      </>
    ),
    cta: standardCta("enterprise support"),
  },

  "/programmes/back-to-school": {
    eyebrow: "Programme",
    title: "Bints Back-to-School Project",
    intro: "Returning out-of-school girls to the classroom — and keeping them there.",
    image: girlEducation,
    body: (
      <>
        <p>The Back-to-School Project identifies out-of-school girls and creates a complete pathway back to learning, working with families, schools and community gatekeepers.</p>
        <Heading>Pathway</Heading>
        <Bullets items={[
          "Identification and family engagement",
          "Enrolment and onboarding support",
          "Materials, uniforms and fees",
          "Ongoing mentorship to ensure retention",
        ]} />
      </>
    ),
    cta: standardCta("Back-to-School"),
  },

  "/programmes/dignity-kit": {
    eyebrow: "Programme",
    title: "Bints Dignity Kit Project",
    intro: "Hygiene and dignity essentials so no girl misses school for what should never be a barrier.",
    image: girlEducation,
    body: (
      <>
        <p>The Dignity Kit Project distributes essential hygiene and dignity items to girls and women — restoring confidence and protecting school attendance.</p>
        <Heading>Each Kit Includes</Heading>
        <Bullets items={[
          "Sanitary supplies",
          "Personal hygiene essentials",
          "Education on menstrual health",
          "Access to follow-up support",
        ]} />
      </>
    ),
    cta: standardCta("the Dignity Kit Project"),
  },

  "/programmes/widows-support": {
    eyebrow: "Programme",
    title: "Bints Widows Support Programme",
    intro: "Standing with widows in seasons of grief, transition and rebuilding.",
    image: welfareImg,
    body: (
      <>
        <p>The Widows Support Programme provides material assistance, emotional support and pathways to economic self-reliance for widows in our communities.</p>
        <Heading>What We Provide</Heading>
        <Bullets items={[
          "Welfare and care support",
          "Skills and enterprise pathways",
          "Community and peer support",
          "Referrals for legal and family support",
        ]} />
      </>
    ),
    cta: standardCta("widows support"),
  },

  "/programmes/housing-initiative": {
    eyebrow: "Flagship Programme",
    title: "Bints Women Housing & Social Housing Initiative",
    intro: "A structured programme designed to support women in acquiring land and housing through flexible, affordable and dignity-driven models.",
    image: housingImg,
    body: (
      <>
        <p>The initiative incorporates social housing frameworks to ensure that even low-income women can access safe and secure housing through installment-based, cooperative and partnership-driven systems.</p>
        <Heading>Key Components</Heading>
        <Bullets items={[
          "Affordable housing schemes for women",
          "Social housing models for low-income earners",
          "Installment-based ownership plans",
          "Cooperative housing systems",
          "Partnerships with developers, government and financial institutions",
          "Property and asset acquisition education",
        ]} />
      </>
    ),
    cta: standardCta("the Housing Initiative"),
  },

  // GET INVOLVED
  "/get-involved/partner": {
    eyebrow: "Get Involved",
    title: "Partner With Us",
    intro: "The Bints Foundation welcomes partnerships across grants, education, skills, women empowerment, dignity, mentorship, community outreach and social housing.",
    image: leadershipImg,
    body: (
      <>
        <p>We partner with public institutions, private organisations, foundations and development agencies to drive measurable, sustainable impact for women and girls.</p>
        <Heading>Partnership Opportunities</Heading>
        <Bullets items={[
          "Grant funding and programme sponsorship",
          "Education support initiatives",
          "Skills acquisition programmes",
          "Women empowerment projects",
          "Health and dignity campaigns",
          "Mentorship and leadership development",
          "Community outreach programmes",
          "Social housing development and affordable housing partnerships",
        ]} />
        <Heading>What Partners Receive</Heading>
        <Bullets items={[
          "Co-designed programme proposals tailored to your goals",
          "Transparent reporting and monitoring frameworks",
          "Visibility, impact storytelling and brand alignment",
          "A direct line to our programme leadership",
        ]} />
      </>
    ),
    cta: {
      title: <>Let's design impact together.</>,
      body: "Reach out and we'll set up an introductory conversation with our partnerships team.",
      primary: { label: "Start a Conversation", to: "/contact", icon: "mail-outline" },
      secondary: { label: "Donate", to: "/donate", icon: "heart" },
    },
  },

  "/get-involved/csf": {
    eyebrow: "Get Involved",
    title: "Concerned Sisters Forum (CSF)",
    intro: "Our strategic community engagement platform reaching women at the grassroots.",
    image: mentorshipImg,
    body: (
      <>
        <p>The Concerned Sisters Forum (CSF) serves as a strategic community engagement platform through which The Bints Foundation reaches and supports women.</p>
        <p>While The Bints Foundation operates as a registered development organisation with its own governance, programmes and partnerships, CSF provides an existing network of organised women who benefit from training, empowerment initiatives and support programmes.</p>
        <p>This relationship enables effective outreach, mobilisation and impact delivery at the grassroots and community levels.</p>
      </>
    ),
    cta: standardCta("our community"),
  },

  // MEDIA
  "/media/news": {
    eyebrow: "Media",
    title: "News & Stories",
    intro: "Updates from the field and reflections from women and girls in our programmes.",
    body: (
      <>
        <div className="not-prose grid md:grid-cols-2 gap-6">
          {[
            { t: "Foundation officially launched", d: "A new chapter for women & girls empowerment in Nigeria.", img: founderPortrait },
            { t: "First Mentorship Circle convened", d: "Twenty mentors meet twenty mentees in our inaugural circle.", img: mentorshipImg },
            { t: "Pilot Dignity Kit distribution", d: "Hundreds of girls receive their first Dignity Kits.", img: girlEducation },
            { t: "Housing Initiative — partner roundtable", d: "Bringing developers and lenders into one room.", img: housingImg },
          ].map((n) => (
            <article key={n.t} className="border border-border bg-card group">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={n.img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-6">
                <div className="text-[11px] uppercase tracking-widest text-accent">News</div>
                <h3 className="mt-2 font-semibold text-primary text-lg leading-tight">{n.t}</h3>
                <p className="mt-2 text-sm text-ink-soft">{n.d}</p>
              </div>
            </article>
          ))}
        </div>
      </>
    ),
  },

  "/media/gallery": {
    eyebrow: "Media",
    title: "Gallery",
    intro: "Moments of dignity, learning and impact from our programmes.",
    body: (
      <div className="not-prose grid grid-cols-2 md:grid-cols-3 gap-3">
        {[girlEducation, womenEnterprise, mentorshipImg, housingImg, welfareImg, leadershipImg, founderPortrait, girlEducation, womenEnterprise].map((src, i) => (
          <figure key={i} className={`overflow-hidden ${i % 5 === 0 ? "row-span-2" : ""}`}>
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </figure>
        ))}
      </div>
    ),
  },

  "/media/reports": {
    eyebrow: "Media",
    title: "Impact Reports",
    intro: "Transparent reporting is part of our commitment. Reports are published as programmes mature.",
    body: (
      <>
        <p>The Foundation is committed to measurable results and tracks the number of women empowered, girls supported educationally, beneficiaries trained, businesses supported, welfare interventions delivered, and overall programme outcomes.</p>
        <Heading>Available Reports</Heading>
        <div className="not-prose space-y-3">
          {[
            { t: "Foundation Profile & Programme Prospectus", year: "2024" },
            { t: "Inaugural Year Impact Snapshot", year: "Coming soon" },
            { t: "Annual Monitoring & Evaluation Report", year: "Coming soon" },
          ].map((r) => (
            <div key={r.t} className="flex items-center justify-between gap-4 border border-border bg-card p-5 hover:border-accent transition">
              <div>
                <div className="font-semibold text-primary">{r.t}</div>
                <div className="text-xs text-ink-soft mt-0.5">{r.year}</div>
              </div>
              <button className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
                Request copy
              </button>
            </div>
          ))}
        </div>
      </>
    ),
  },
};
