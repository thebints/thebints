import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Ion } from "@/components/Ion";
import { cn } from "@/lib/utils";
import bintsLogo from "@/assets/bints-logo.png";

interface SubItem {
  label: string;
  to: string;
  icon: string;
  blurb: string;
}
interface MenuItem {
  label: string;
  to?: string;
  icon: string;
  children?: SubItem[];
}

export const NAV: MenuItem[] = [
  { label: "Home", to: "/", icon: "home-outline" },
  {
    label: "About Us",
    icon: "information-circle-outline",
    children: [
      { label: "Founder's Message", to: "/about/founder", icon: "create-outline", blurb: "A letter from Hajia Binta Ibrahim, our founder." },
      { label: "Vision & Mission", to: "/about/vision-mission", icon: "telescope-outline", blurb: "The compass that guides our work." },
      { label: "Core Values — BINTS", to: "/about/values", icon: "diamond-outline", blurb: "Benevolence. Integrity. Nurture. Transformation. Sustainability." },
      { label: "Governance & Leadership", to: "/about/governance", icon: "library-outline", blurb: "Our framework for accountability and trust." },
      { label: "Background", to: "/about/background", icon: "book-outline", blurb: "The gap we exist to close." },
    ],
  },
  {
    label: "Our Focus",
    icon: "compass-outline",
    children: [
      { label: "Women's Economic Empowerment", to: "/focus/economic-empowerment", icon: "briefcase-outline", blurb: "Enterprise, training, and pathways to capital." },
      { label: "Girl-Child Education & Mentorship", to: "/focus/education", icon: "school-outline", blurb: "Schooling, mentorship and confidence for young women." },
      { label: "Asset Ownership & Social Housing", to: "/focus/housing", icon: "home-outline", blurb: "Land, housing and dignity-led ownership models." },
      { label: "Welfare & Humanitarian Care", to: "/focus/welfare", icon: "heart-outline", blurb: "Structured support in moments of need." },
      { label: "Leadership & Personal Development", to: "/focus/leadership", icon: "ribbon-outline", blurb: "Equipping women to lead in every room." },
    ],
  },
  {
    label: "Programmes",
    icon: "albums-outline",
    children: [
      { label: "Women Empowerment Programme", to: "/programmes/women-empowerment", icon: "sparkles-outline", blurb: "Our flagship empowerment track." },
      { label: "Girl-Child Education Support", to: "/programmes/girl-child-education", icon: "school-outline", blurb: "Scholarships and learning support." },
      { label: "Skills for Dignity", to: "/programmes/skills-for-dignity", icon: "construct-outline", blurb: "Vocational skills with market value." },
      { label: "Mentorship Circle", to: "/programmes/mentorship-circle", icon: "people-circle-outline", blurb: "Structured mentorship for women & girls." },
      { label: "Welfare & Care Outreach", to: "/programmes/welfare-care", icon: "hand-left-outline", blurb: "Direct support to vulnerable families." },
      { label: "Enterprise Support Scheme", to: "/programmes/enterprise-support", icon: "trending-up-outline", blurb: "Tools and capital for women in business." },
      { label: "Back-to-School Project", to: "/programmes/back-to-school", icon: "bag-outline", blurb: "Returning girls to the classroom." },
      { label: "Dignity Kit Project", to: "/programmes/dignity-kit", icon: "gift-outline", blurb: "Hygiene and dignity essentials." },
      { label: "Widows Support Programme", to: "/programmes/widows-support", icon: "rose-outline", blurb: "Standing with widows with care and structure." },
      { label: "Housing & Social Housing Initiative", to: "/programmes/housing-initiative", icon: "business-outline", blurb: "Affordable, cooperative and installment-based housing." },
    ],
  },
  {
    label: "Get Involved",
    icon: "hand-right-outline",
    children: [
      { label: "Partner With Us", to: "/get-involved/partner", icon: "git-merge-outline", blurb: "For corporates, agencies and foundations." },
      { label: "Volunteer", to: "/get-involved/volunteer", icon: "people-outline", blurb: "Lend your skills, time and presence." },
      { label: "Mentorship Circle", to: "/get-involved/mentor", icon: "person-add-outline", blurb: "Become a mentor in our circle." },
      { label: "Concerned Sisters Forum", to: "/get-involved/csf", icon: "flower-outline", blurb: "Our grassroots community network." },
      { label: "Apply for Support", to: "/get-involved/apply", icon: "document-text-outline", blurb: "If you or someone you know needs help." },
    ],
  },
  {
    label: "Media & Contact",
    icon: "newspaper-outline",
    children: [
      { label: "News & Stories", to: "/media/news", icon: "reader-outline", blurb: "Updates from the field." },
      { label: "Gallery", to: "/media/gallery", icon: "images-outline", blurb: "Moments from our programmes." },
      { label: "Impact Reports", to: "/media/reports", icon: "stats-chart-outline", blurb: "Transparent reporting and outcomes." },
      { label: "Contact", to: "/contact", icon: "mail-outline", blurb: "Apo-Gudu, Abuja — let's talk." },
    ],
  },
];

const Wordmark = ({ variant = "light" }: { variant?: "light" | "dark" }) => (
  <Link to="/" className="group inline-flex items-center" aria-label="The Bints Foundation — Home">
    <img
      src={bintsLogo}
      alt="The Bints Foundation"
      width={180}
      height={64}
      className={cn(
        "h-16 md:h-20 lg:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]",
        variant === "dark" && "brightness-0 invert",
      )}
    />
  </Link>
);

const DonateButton = ({ className }: { className?: string }) => (
  <Link
    to="/donate"
    className={cn(
      "group inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium tracking-wide shadow-soft ring-1 ring-accent/40 hover:bg-primary-glow transition-colors",
      className,
    )}
  >
    <Ion name="heart" className="text-accent text-base" />
    <span>Donate</span>
    <Ion name="arrow-forward-outline" className="text-base transition-transform group-hover:translate-x-0.5" />
  </Link>
);

const MegaPanel = ({ items, parentLabel }: { items: SubItem[]; parentLabel: string }) => (
  <div
    className={cn(
      "absolute left-1/2 top-full -translate-x-1/2 pt-5 z-50",
      "invisible opacity-0 translate-y-3 scale-[0.98]",
      "group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100",
      "group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100",
      "transition-all duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
      "origin-top",
    )}
  >
    {/* Floating arrow notch */}
    <div className="absolute left-1/2 -translate-x-1/2 top-[14px] h-3 w-3 rotate-45 bg-background border-l border-t border-border" />
    <div className="relative w-[760px] max-w-[94vw] bg-background/95 backdrop-blur-xl shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.35),0_8px_24px_-12px_hsl(var(--primary)/0.25)] border border-border overflow-hidden rounded-sm">
      {/* Top gold accent */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="grid grid-cols-12">
        {/* Featured intro column */}
        <div className="col-span-4 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/15 blur-2xl" />
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">Explore</div>
            <h4 className="font-display text-2xl font-bold mt-3 leading-tight">{parentLabel}</h4>
            <div className="h-px w-10 bg-accent mt-4" />
            <p className="text-[12px] text-primary-foreground/75 mt-4 leading-relaxed">
              Structured, accountable programmes empowering women and girls across Nigeria.
            </p>
          </div>
          <Link
            to="/donate"
            className="relative mt-6 inline-flex items-center gap-2 text-[12px] font-medium text-accent hover:gap-3 transition-all"
          >
            <Ion name="heart-outline" /> Support our work
            <Ion name="arrow-forward-outline" />
          </Link>
        </div>

        {/* Items grid */}
        <div className="col-span-8 grid grid-cols-2 gap-px bg-border/60">
          {items.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              style={{ transitionDelay: `${60 + i * 35}ms` }}
              className={cn(
                "group/item relative flex items-start gap-3 px-4 py-3.5 bg-background hover:bg-secondary/50",
                "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0",
                "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              )}
            >
              <span className="absolute left-0 top-0 h-full w-[2px] bg-accent scale-y-0 origin-top transition-transform duration-300 group-hover/item:scale-y-100" />
              <div
                className={cn(
                  "shrink-0 h-10 w-10 flex items-center justify-center rounded-sm",
                  "bg-gradient-to-br from-accent/25 to-accent/5 ring-1 ring-accent/40 text-accent",
                  "transition-all duration-300",
                  "group-hover/item:from-accent group-hover/item:to-accent group-hover/item:text-accent-foreground",
                  "group-hover/item:ring-accent group-hover/item:shadow-[0_8px_20px_-8px_hsl(var(--accent)/0.7)]",
                  "group-hover/item:-translate-y-0.5",
                  "[&>ion-icon]:text-[18px] [&>ion-icon]:leading-none",
                )}
              >
                <Ion name={item.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-primary tracking-tight leading-snug transition-transform duration-300 group-hover/item:translate-x-0.5">
                  {item.label}
                </div>
                <div className="text-[11.5px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                  {item.blurb}
                </div>
              </div>
              <Ion
                name="arrow-forward-outline"
                className="shrink-0 mt-1 text-sm text-accent opacity-0 -translate-x-1 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="h-px bg-gold/30" />
    </div>
  </div>
);

export const SiteHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenSub(null);
  }, [location.pathname]);

  return (
    <>
      <div className="bg-primary text-primary-foreground/90">
        <div className="container flex items-center justify-between py-2 text-[11px] tracking-wide">
          <div className="hidden sm:flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5"><Ion name="location-outline" className="text-accent" /> Apo-Gudu, Abuja, Nigeria</span>
            <a href="tel:+2349133035624" className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"><Ion name="call-outline" className="text-accent" /> 0913 303 5624 · 0814 999 0072</a>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="hidden sm:inline">Empowering Women & Girls — Since 2024</span>
            <div className="flex items-center gap-3 text-base">
              <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors"><Ion name="logo-instagram" /></a>
              <a href="#" aria-label="Facebook" className="hover:text-accent transition-colors"><Ion name="logo-facebook" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-accent transition-colors"><Ion name="logo-linkedin" /></a>
            </div>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 w-full bg-background/95 backdrop-blur transition-shadow",
          scrolled ? "shadow-soft" : "border-b border-border",
        )}
      >
        <div className="container flex items-center gap-6 py-4">
          <Wordmark />

          <nav className="hidden lg:flex items-center gap-1 mx-auto" aria-label="Primary">
            {NAV.map((item) => {
              if (!item.children) {
                return (
                  <NavLink
                    key={item.label}
                    to={item.to!}
                    end
                    className={({ isActive }) =>
                      cn(
                        "px-3 py-2 text-[13px] font-medium tracking-wide text-ink-soft hover:text-primary transition-colors relative",
                        isActive && "text-primary",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              }
              return (
                <div key={item.label} className="group relative">
                  <button
                    type="button"
                    className="relative inline-flex items-center gap-1 px-3 py-2 text-[13px] font-medium tracking-wide text-ink-soft hover:text-primary transition-colors group-hover:text-primary"
                  >
                    {item.label}
                    <Ion name="chevron-down-outline" className="text-xs transition-transform duration-300 group-hover:rotate-180 group-hover:text-accent" />
                    <span className="pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] bg-accent scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                  </button>
                  <MegaPanel items={item.children} parentLabel={item.label} />
                </div>
              );
            })}
          </nav>

          <div className="ml-auto lg:ml-0 flex items-center gap-2">
            <DonateButton className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
              className="lg:hidden h-10 w-10 inline-flex items-center justify-center border border-border text-primary"
            >
              <Ion name={mobileOpen ? "close-outline" : "menu-outline"} className="text-2xl" />
            </button>
          </div>
        </div>
        <div className="h-px bg-gold opacity-60" />
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="absolute inset-0 bg-ink/60" onClick={() => setMobileOpen(false)} />
        <aside className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-background overflow-y-auto">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <Wordmark />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="h-9 w-9 inline-flex items-center justify-center text-primary"
            >
              <Ion name="close-outline" className="text-2xl" />
            </button>
          </div>
          <nav className="p-3" aria-label="Mobile primary">
            {NAV.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.label}
                    to={item.to!}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-primary border-b border-border"
                  >
                    <Ion name={item.icon} className="text-lg text-accent" />
                    {item.label}
                  </Link>
                );
              }
              const open = openSub === item.label;
              return (
                <div key={item.label} className="border-b border-border">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-3 px-3 py-3 text-sm font-medium text-primary"
                    onClick={() => setOpenSub(open ? null : item.label)}
                  >
                    <span className="flex items-center gap-3">
                      <Ion name={item.icon} className="text-lg text-accent" />
                      {item.label}
                    </span>
                    <Ion name="chevron-down-outline" className={cn("text-base transition-transform", open && "rotate-180")} />
                  </button>
                  {open && (
                    <div className="pb-3 pl-12 pr-3 space-y-1">
                      {item.children.map((c) => (
                        <Link key={c.to} to={c.to} className="flex items-center gap-2 py-2 text-[13px] text-ink-soft hover:text-primary">
                          <Ion name={c.icon} className="text-sm text-accent" />
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="p-5">
            <DonateButton className="w-full justify-center" />
          </div>
        </aside>
      </div>
    </>
  );
};

export const SiteFooter = () => (
  <footer className="bg-primary text-primary-foreground mt-24">
    <div className="h-px bg-gold opacity-70" />
    <div className="container py-16">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-5">
          <div className="eyebrow text-accent">The Bints Foundation</div>
          <h3 className="font-display text-3xl font-bold leading-tight">
            Dignity. Opportunity.<br />Sustainable Impact.
          </h3>
          <p className="text-primary-foreground/75 text-sm max-w-md leading-relaxed">
            A women & girls-focused development organisation building structured, sustainable empowerment across Nigeria.
          </p>
          <form className="flex max-w-sm border border-accent/40 bg-primary-glow/40">
            <input
              type="email"
              required
              placeholder="Your email for updates"
              className="flex-1 bg-transparent px-4 py-3 text-sm placeholder:text-primary-foreground/50 outline-none"
            />
            <button type="submit" className="bg-accent text-accent-foreground px-4 text-sm font-medium hover:opacity-90">
              Join
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="eyebrow text-accent mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/about/founder" className="hover:text-accent">About</Link></li>
            <li><Link to="/programmes/women-empowerment" className="hover:text-accent">Programmes</Link></li>
            <li><Link to="/get-involved/partner" className="hover:text-accent">Partner</Link></li>
            <li><Link to="/media/reports" className="hover:text-accent">Reports</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <div className="eyebrow text-accent mb-4">Focus</div>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/focus/economic-empowerment" className="hover:text-accent">Empowerment</Link></li>
            <li><Link to="/focus/education" className="hover:text-accent">Education</Link></li>
            <li><Link to="/focus/housing" className="hover:text-accent">Housing</Link></li>
            <li><Link to="/focus/welfare" className="hover:text-accent">Welfare</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="eyebrow text-accent mb-4">Contact</div>
          <address className="not-italic text-sm text-primary-foreground/80 space-y-3 leading-relaxed">
            <p className="flex gap-2.5"><Ion name="location-outline" className="text-accent shrink-0 mt-0.5 text-base" /><span>Plot 636, David Jemibewon Crescent, Behind Eterna Filling Station, Apo-Gudu, Abuja</span></p>
            <p className="flex gap-2.5"><Ion name="call-outline" className="text-accent shrink-0 mt-0.5 text-base" /><span><a href="tel:+2349133035624" className="hover:text-accent transition-colors">0913 303 5624</a><br /><a href="tel:+2348149990072" className="hover:text-accent transition-colors">0814 999 0072</a></span></p>
            <p className="flex gap-2.5"><Ion name="mail-outline" className="text-accent shrink-0 mt-0.5 text-base" /><a href="mailto:support@thebintsfoundation.com" className="hover:text-accent transition-colors break-all">support@thebintsfoundation.com</a></p>
          </address>
        </div>
      </div>

      <div className="gold-rule mt-12" />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-xs text-primary-foreground/60">
        <p>© {new Date().getFullYear()} The Bints Foundation. All rights reserved.</p>
        <p className="tracking-[0.3em] uppercase">Benevolence · Integrity · Nurture · Transformation · Sustainability</p>
      </div>
    </div>
  </footer>
);

export const SiteLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-background">
    <SiteHeader />
    <main className="flex-1">{children}</main>
    <SiteFooter />
  </div>
);
