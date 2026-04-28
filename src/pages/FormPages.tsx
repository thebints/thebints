import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero, InfoCard, SectionHeader } from "@/components/site/Editorial";
import { Ion } from "@/components/Ion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import teamCelebration from "@/assets/team-celebration.jpg";
import leadershipSkills from "@/assets/leadership-skills.jpg";
import welfareDistribution from "@/assets/welfare-distribution.jpg";

interface FormPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  fields: Array<{ name: string; label: string; type?: string; placeholder?: string; full?: boolean; textarea?: boolean }>;
  submitLabel: string;
  successMsg: string;
  sidebar: { title: string; cards: Array<{ icon: string; title: string; body: string }> };
  applicationType?: "volunteer" | "mentor" | "partner";
}

const FormPage = ({ eyebrow, title, intro, image, fields, submitLabel, successMsg, sidebar, applicationType }: FormPageProps) => {
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (applicationType) {
      setSubmitting(true);
      const fd = new FormData(form);
      const get = (k: string) => (fd.get(k) as string | null)?.toString().trim() || null;
      const full_name = get("name") || "";
      const email = get("email") || "";
      if (!full_name || !email) { setSubmitting(false); toast.error("Name and email are required."); return; }
      const message = [
        get("skills") && `Skills: ${get("skills")}`,
        get("availability") && `Availability: ${get("availability")}`,
        get("profession") && `Profession: ${get("profession")}`,
        get("years") && `Years: ${get("years")}`,
        get("expertise") && `Expertise: ${get("expertise")}`,
        get("preference") && `Preference: ${get("preference")}`,
        get("organization") && `Organization: ${get("organization")}`,
        get("role") && `Role: ${get("role")}`,
        get("website") && `Website: ${get("website")}`,
        get("partnership_type") && `Partnership Type: ${get("partnership_type")}`,
        get("note") && `Note: ${get("note")}`,
      ].filter(Boolean).join("\n");
      const { error } = await supabase.from("applications").insert({
        application_type: applicationType,
        full_name,
        email,
        phone: get("phone"),
        location: get("city") || get("country"),
        area_of_interest: get("expertise") || get("skills") || get("partnership_type"),
        experience: get("years") || get("profession") || get("organization"),
        message,
      });
      setSubmitting(false);
      if (error) { toast.error("Could not submit. Please try again."); return; }
    }
    toast.success(successMsg);
    form.reset();
  };
  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={title} intro={intro} image={image} imageAlt={title} />
      <section className="container py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <SectionHeader eyebrow="Tell Us About You" title={<>The form.</>} />
            <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((f) => {
                const inputCls = "w-full border border-border bg-card px-4 py-3.5 text-sm focus:border-accent outline-none";
                return (
                  <div key={f.name} className={f.full || f.textarea ? "sm:col-span-2" : ""}>
                    <label className="eyebrow block mb-2">{f.label}</label>
                    {f.textarea ? (
                      <textarea required name={f.name} rows={5} placeholder={f.placeholder} className={inputCls} />
                    ) : (
                      <input required name={f.name} type={f.type || "text"} placeholder={f.placeholder} className={inputCls} />
                    )}
                  </div>
                );
              })}
              <div className="sm:col-span-2">
                <button type="submit" disabled={submitting} className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-4 text-sm font-medium tracking-wide hover:bg-primary-glow transition disabled:opacity-60">
                  <Ion name="paper-plane-outline" />
                  {submitting ? "Submitting…" : submitLabel}
                  <Ion name="arrow-forward-outline" className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </div>
          <aside className="lg:col-span-5">
            <div className="eyebrow">{sidebar.title}</div>
            <div className="gold-bar mt-3" />
            <div className="mt-6 space-y-4">
              {sidebar.cards.map((c) => <InfoCard key={c.title} icon={c.icon} title={c.title}>{c.body}</InfoCard>)}
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
};

export const Volunteer = () => (
  <FormPage
    applicationType="volunteer"
    eyebrow="Get Involved"
    title="Volunteer"
    intro="Lend your time, skills and presence to programmes that change lives."
    image={teamCelebration}
    fields={[
      { name: "name", label: "Full name" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone" },
      { name: "city", label: "City" },
      { name: "skills", label: "Skills you'd like to offer", full: true },
      { name: "availability", label: "Availability", placeholder: "Weekends, evenings, etc.", full: true },
      { name: "note", label: "Why you want to volunteer", textarea: true },
    ]}
    submitLabel="Submit Application"
    successMsg="Thank you. Our volunteer team will be in touch."
    sidebar={{
      title: "What to expect",
      cards: [
        { icon: "calendar-outline", title: "Onboarding", body: "We'll invite you to an orientation session and match your skills to current needs." },
        { icon: "shield-checkmark-outline", title: "Safe & structured", body: "All volunteers operate under our safeguarding and accountability framework." },
        { icon: "ribbon-outline", title: "Recognition", body: "Your contribution is acknowledged and celebrated as part of our community." },
      ],
    }}
  />
);

export const Mentor = () => (
  <FormPage
    applicationType="mentor"
    eyebrow="Get Involved"
    title="Become a Mentor"
    intro="Share what you know with a woman or girl who needs your wisdom, your network and your time."
    image={leadershipSkills}
    fields={[
      { name: "name", label: "Full name" },
      { name: "email", label: "Email", type: "email" },
      { name: "profession", label: "Profession" },
      { name: "years", label: "Years of experience" },
      { name: "expertise", label: "Areas of expertise", full: true },
      { name: "preference", label: "Mentee preference", placeholder: "e.g. women in early-stage business, girls in school", full: true },
      { name: "note", label: "What drew you to mentorship", textarea: true },
    ]}
    submitLabel="Apply to Mentor"
    successMsg="Thank you. The Mentorship Circle team will reach out shortly."
    sidebar={{
      title: "The Mentorship Circle",
      cards: [
        { icon: "people-circle-outline", title: "Curated matching", body: "We thoughtfully pair mentors and mentees to ensure value on both sides." },
        { icon: "infinite-outline", title: "Quarterly cadence", body: "Group circles plus one-on-one sessions across the year." },
        { icon: "trophy-outline", title: "Real outcomes", body: "We track progress and celebrate milestones together." },
      ],
    }}
  />
);

export const Apply = () => (
  <FormPage
    eyebrow="Get Involved"
    title="Apply for Support"
    intro="If you or a woman or girl you know would benefit from our programmes, please share a little about your situation."
    image={welfareDistribution}
    fields={[
      { name: "name", label: "Your full name" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone" },
      { name: "location", label: "Location" },
      { name: "programme", label: "Which programme is most relevant?", placeholder: "e.g. Back-to-School, Enterprise Support", full: true },
      { name: "story", label: "Tell us about the need", textarea: true },
    ]}
    submitLabel="Submit Application"
    successMsg="Thank you. Our team treats every application with care and confidentiality."
    sidebar={{
      title: "How we respond",
      cards: [
        { icon: "lock-closed-outline", title: "Confidential", body: "Every application is handled with discretion and respect." },
        { icon: "time-outline", title: "Within 14 days", body: "We aim to respond to applications within two weeks." },
        { icon: "heart-outline", title: "With dignity", body: "We listen first. Support is offered with structure, not pity." },
      ],
    }}
  />
);
