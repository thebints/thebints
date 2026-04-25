import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Eyebrow } from "@/components/site/Editorial";
import { Ion } from "@/components/Ion";

const NotFound = () => (
  <SiteLayout>
    <section className="container py-32 text-center">
      <Eyebrow className="justify-center">Error 404</Eyebrow>
      <h1 className="display-serif-feel text-primary text-7xl md:text-9xl mt-6">Lost.</h1>
      <p className="mt-6 max-w-md mx-auto text-ink-soft leading-relaxed">
        The page you're looking for has wandered off. Let's get you back to work that matters.
      </p>
      <div className="mt-10 flex justify-center gap-3">
        <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-sm hover:bg-primary-glow transition">
          <Ion name="home-outline" /> Return Home
        </Link>
        <Link to="/donate" className="inline-flex items-center gap-2 border border-primary/30 px-6 py-3.5 text-sm text-primary hover:border-accent hover:text-accent transition">
          <Ion name="heart" /> Donate
        </Link>
      </div>
    </section>
  </SiteLayout>
);

export default NotFound;
