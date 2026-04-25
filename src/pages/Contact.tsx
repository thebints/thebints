import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, InfoCard, SectionHeader } from "@/components/site/Editorial";
import { Ion } from "@/components/Ion";
import { toast } from "sonner";
import donateHero from "@/assets/donate-hero.jpg";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent. We'll respond within two business days.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title={<>Let's talk about<br />what's possible.</>}
        intro="Partnerships, media, programme enquiries, or simply to say hello — we read every message."
        image={donateHero}
        imageAlt="Community of women walking together"
      />

      <section className="container py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <SectionHeader eyebrow="Send a Message" title={<>The Foundation listens.</>} />
            <form onSubmit={handleSubmit} className="mt-10 grid sm:grid-cols-2 gap-4">
              <input required placeholder="Full name" className="border border-border bg-card px-4 py-3.5 text-sm focus:border-accent outline-none" />
              <input required type="email" placeholder="Email address" className="border border-border bg-card px-4 py-3.5 text-sm focus:border-accent outline-none" />
              <input placeholder="Organisation (optional)" className="sm:col-span-2 border border-border bg-card px-4 py-3.5 text-sm focus:border-accent outline-none" />
              <select className="sm:col-span-2 border border-border bg-card px-4 py-3.5 text-sm focus:border-accent outline-none">
                <option>I'd like to discuss…</option>
                <option>Partnership / sponsorship</option>
                <option>Media or press</option>
                <option>Programme enquiry</option>
                <option>Volunteering</option>
                <option>Other</option>
              </select>
              <textarea required rows={6} placeholder="Your message" className="sm:col-span-2 border border-border bg-card px-4 py-3.5 text-sm focus:border-accent outline-none" />
              <div className="sm:col-span-2">
                <button type="submit" className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-4 text-sm font-medium hover:bg-primary-glow transition">
                  <Ion name="paper-plane-outline" /> Send Message
                  <Ion name="arrow-forward-outline" className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>

          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-primary text-primary-foreground p-8">
              <div className="eyebrow text-accent">Reach the Foundation</div>
              <div className="gold-bar mt-3" />
              <ul className="mt-6 space-y-5 text-sm">
                <li className="flex gap-3">
                  <Ion name="location-outline" className="text-accent text-xl shrink-0 mt-0.5" />
                  <div>
                    <div className="text-primary-foreground/60 text-[11px] uppercase tracking-widest">Office</div>
                    <div className="mt-1 leading-relaxed">Plot 636, David Jemibewon Crescent,<br />Behind Eterna Filling Station,<br />Apo-Gudu, Abuja, Nigeria</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Ion name="call-outline" className="text-accent text-xl shrink-0 mt-0.5" />
                  <div>
                    <div className="text-primary-foreground/60 text-[11px] uppercase tracking-widest">Phone</div>
                    <div className="mt-1">+234 903 000 0000</div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Ion name="globe-outline" className="text-accent text-xl shrink-0 mt-0.5" />
                  <div>
                    <div className="text-primary-foreground/60 text-[11px] uppercase tracking-widest">Web</div>
                    <div className="mt-1">www.thebintsfoundation.com</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoCard icon="time-outline" title="Office Hours">
                Mon – Fri · 9:00 to 17:00 WAT
              </InfoCard>
              <InfoCard icon="logo-instagram" title="Follow Along">
                Instagram · Facebook · LinkedIn
              </InfoCard>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Contact;
