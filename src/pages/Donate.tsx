import { useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Eyebrow, SectionHeader, InfoCard } from "@/components/site/Editorial";
import { Ion } from "@/components/Ion";
import donateHero from "@/assets/donate-hero.jpg";
import { toast } from "sonner";

const tiers = [
  { amount: 5000, label: "₦5,000", impact: "Provides a Dignity Kit for one girl", icon: "gift-outline" },
  { amount: 25000, label: "₦25,000", impact: "Sponsors a girl's term of school supplies", icon: "school-outline" },
  { amount: 100000, label: "₦100,000", impact: "Funds vocational skills training for one woman", icon: "construct-outline" },
  { amount: 500000, label: "₦500,000", impact: "Seeds an enterprise grant for a woman entrepreneur", icon: "trending-up-outline" },
];

const programmes = [
  "Where it's needed most",
  "Women Empowerment",
  "Girl-Child Education",
  "Skills for Dignity",
  "Mentorship Circle",
  "Welfare & Care Outreach",
  "Enterprise Support Scheme",
  "Back-to-School Project",
  "Dignity Kit Project",
  "Widows Support Programme",
  "Housing & Social Housing Initiative",
];

const Donate = () => {
  const [tier, setTier] = useState<number>(25000);
  const [custom, setCustom] = useState("");
  const [programme, setProgramme] = useState(programmes[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you. Our partnerships team will be in touch shortly.");
  };

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={donateHero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        </div>
        <div className="container relative py-24 md:py-32 text-primary-foreground">
          <Eyebrow className="text-accent">Donate</Eyebrow>
          <h1 className="display-serif-feel text-5xl md:text-7xl mt-6 max-w-3xl">
            Your gift restores<br />dignity.
          </h1>
          <p className="mt-6 max-w-xl text-primary-foreground/85 text-lg leading-relaxed">
            Every contribution to The Bints Foundation funds structured, accountable programmes that empower women and girls to live with confidence and economic independence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#give" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3.5 text-sm font-medium hover:opacity-90">
              <Ion name="heart" /> Give Now <Ion name="arrow-down-outline" />
            </a>
            <Link to="/media/reports" className="inline-flex items-center gap-2 border border-primary-foreground/40 px-6 py-3.5 text-sm font-medium hover:border-accent hover:text-accent transition">
              <Ion name="stats-chart-outline" /> See our impact
            </Link>
          </div>
        </div>
        <div className="h-px bg-gold opacity-70" />
      </section>

      {/* GIVE FORM */}
      <section id="give" className="container py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <SectionHeader eyebrow="Choose Your Gift" title={<>Pick a tier that<br />reflects your heart.</>} />
            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              <div className="grid sm:grid-cols-2 gap-3">
                {tiers.map((t) => (
                  <button
                    type="button"
                    key={t.amount}
                    onClick={() => { setTier(t.amount); setCustom(""); }}
                    className={`group text-left p-5 border transition-all ${
                      tier === t.amount && !custom
                        ? "border-accent bg-accent-soft/40 shadow-soft"
                        : "border-border hover:border-accent/60 bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Ion name={t.icon} className="text-accent text-xl" />
                      <Ion name={tier === t.amount && !custom ? "checkmark-circle" : "ellipse-outline"} className="text-accent text-lg" />
                    </div>
                    <div className="mt-4 font-display text-primary text-2xl font-bold">{t.label}</div>
                    <div className="mt-1 text-xs text-ink-soft leading-snug">{t.impact}</div>
                  </button>
                ))}
              </div>

              <div>
                <label className="eyebrow block mb-2">Or enter a custom amount</label>
                <div className="flex border border-border focus-within:border-accent">
                  <span className="px-4 flex items-center bg-secondary text-primary font-medium">₦</span>
                  <input
                    type="number"
                    min={500}
                    step={500}
                    placeholder="Custom amount"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    className="flex-1 bg-transparent px-4 py-3.5 outline-none text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow block mb-2">Designate to a programme</label>
                <select
                  value={programme}
                  onChange={(e) => setProgramme(e.target.value)}
                  className="w-full border border-border bg-card px-4 py-3.5 text-sm text-primary focus:border-accent outline-none"
                >
                  {programmes.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <input required placeholder="Full name" className="border border-border bg-card px-4 py-3.5 text-sm focus:border-accent outline-none" />
                <input required type="email" placeholder="Email address" className="border border-border bg-card px-4 py-3.5 text-sm focus:border-accent outline-none" />
              </div>
              <textarea rows={3} placeholder="A note for our team (optional)" className="w-full border border-border bg-card px-4 py-3.5 text-sm focus:border-accent outline-none" />

              <button
                type="submit"
                className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-4 text-sm font-medium tracking-wide hover:bg-primary-glow transition w-full sm:w-auto justify-center"
              >
                <Ion name="heart" className="text-accent" />
                Pledge {custom ? `₦${Number(custom).toLocaleString()}` : `₦${tier.toLocaleString()}`}
                <Ion name="arrow-forward-outline" className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-xs text-ink-soft">
                After you pledge, our partnerships team will reach out with bank transfer details and a receipt.
              </p>
            </form>
          </div>

          {/* SIDEBAR — Bank details */}
          <aside className="lg:col-span-5">
            <div className="bg-primary text-primary-foreground p-8 editorial-shadow">
              <Eyebrow className="text-accent">Direct Bank Transfer</Eyebrow>
              <h3 className="font-display font-bold text-2xl mt-4">Give directly to the Foundation</h3>
              <div className="gold-bar mt-4" />
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-primary-foreground/60 text-xs uppercase tracking-widest">Account Name</dt>
                  <dd className="mt-1 font-medium">The Bints Foundation</dd>
                </div>
                <div>
                  <dt className="text-primary-foreground/60 text-xs uppercase tracking-widest">Bank</dt>
                  <dd className="mt-1 font-medium">To be confirmed by Foundation</dd>
                </div>
                <div>
                  <dt className="text-primary-foreground/60 text-xs uppercase tracking-widest">Account Number</dt>
                  <dd className="mt-1 font-medium tracking-widest">— — — — — — — — — —</dd>
                </div>
                <div>
                  <dt className="text-primary-foreground/60 text-xs uppercase tracking-widest">Reference</dt>
                  <dd className="mt-1 font-medium">Donor name + Programme</dd>
                </div>
              </dl>
              <div className="mt-8 pt-6 border-t border-primary-foreground/15 text-xs text-primary-foreground/70 leading-relaxed">
                Corporate, foundation and grant partnerships are warmly welcomed. For sponsorship of an entire programme, please use the form or contact us directly.
              </div>
              <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-accent text-sm hover:underline">
                <Ion name="mail-outline" /> partnerships@thebintsfoundation.com
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <InfoCard icon="shield-checkmark-outline" title="Accountable">
                Transparent reporting and monitoring on every programme.
              </InfoCard>
              <InfoCard icon="eye-outline" title="Visible">
                Donors receive impact updates from the field.
              </InfoCard>
            </div>
          </aside>
        </div>
      </section>

      {/* WAYS TO GIVE */}
      <section className="bg-bone border-y border-border">
        <div className="container py-20">
          <SectionHeader
            eyebrow="More Ways to Give"
            align="center"
            title={<>Beyond a single gift.</>}
            intro="There are many ways to walk alongside the women and girls we serve."
          />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <InfoCard icon="repeat-outline" title="Monthly Giving">
              Become a sustaining partner with a recurring monthly contribution.
            </InfoCard>
            <InfoCard icon="business-outline" title="Corporate Sponsorship">
              Sponsor a programme or co-design an initiative aligned with your CSR goals.
            </InfoCard>
            <InfoCard icon="cube-outline" title="In-Kind Donations">
              Books, school supplies, dignity essentials, equipment and professional services.
            </InfoCard>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Donate;
