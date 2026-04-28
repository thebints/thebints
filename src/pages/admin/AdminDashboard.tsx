import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";

const Card = ({ icon, label, value, to }: { icon: string; label: string; value: number | string; to: string }) => (
  <Link to={to} className="group bg-card border border-border p-6 hover:shadow-soft transition flex items-start justify-between">
    <div>
      <div className="eyebrow text-accent">{label}</div>
      <div className="font-display text-4xl font-bold text-primary mt-2">{value}</div>
    </div>
    <div className="h-12 w-12 rounded-sm bg-gradient-to-br from-accent/20 to-accent/5 ring-1 ring-accent/40 text-accent flex items-center justify-center group-hover:from-accent group-hover:to-accent group-hover:text-accent-foreground transition">
      <Ion name={icon} className="text-2xl" />
    </div>
  </Link>
);

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ popups: 0, events: 0, applications: 0 });

  useEffect(() => {
    (async () => {
      const [p, e, a] = await Promise.all([
        supabase.from("popups").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("applications").select("id", { count: "exact", head: true }),
      ]);
      setCounts({ popups: p.count || 0, events: e.count || 0, applications: a.count || 0 });
    })();
  }, []);

  return (
    <div>
      <div className="eyebrow text-accent">Welcome</div>
      <h1 className="font-display text-3xl font-bold text-primary mt-1">Admin Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-2">Manage announcements, events and applications.</p>
      <div className="gold-bar mt-4" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <Card icon="megaphone-outline" label="Popups" value={counts.popups} to="/admin/popups" />
        <Card icon="calendar-outline" label="Events" value={counts.events} to="/admin/events" />
        <Card icon="document-text-outline" label="Applications" value={counts.applications} to="/admin/applications" />
      </div>
    </div>
  );
};

export default AdminDashboard;
