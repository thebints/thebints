import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { cn } from "@/lib/utils";
import bintsLogo from "@/assets/bints-logo.png";
import { toast } from "sonner";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: "speedometer-outline", end: true },
  { to: "/admin/popups", label: "Popups", icon: "megaphone-outline" },
  { to: "/admin/events", label: "Events", icon: "calendar-outline" },
  { to: "/admin/applications", label: "Applications", icon: "document-text-outline" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const verify = async (uid: string | undefined) => {
      if (!uid) { if (mounted) { setChecking(false); navigate("/admin/auth", { replace: true }); } return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
      if (!mounted) return;
      if (data) { setAuthorized(true); setChecking(false); }
      else { setChecking(false); toast.error("Not authorised."); await supabase.auth.signOut(); navigate("/admin/auth", { replace: true }); }
    };

    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      verify(session?.user?.id);
    });
    supabase.auth.getSession().then(({ data }) => verify(data.session?.user?.id));

    return () => { mounted = false; sub.data.subscription.unsubscribe(); };
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/auth", { replace: true });
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading admin…</div>
      </div>
    );
  }
  if (!authorized) return null;

  return (
    <div className="min-h-screen flex bg-secondary/30">
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col">
        <div className="p-5 border-b border-primary-foreground/10">
          <Link to="/" className="flex items-center gap-2">
            <img src={bintsLogo} alt="" className="h-10 w-auto brightness-0 invert" />
          </Link>
          <div className="text-[10px] uppercase tracking-[0.25em] text-accent mt-3 font-semibold">Admin Console</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-colors",
                  isActive ? "bg-accent text-accent-foreground font-medium" : "text-primary-foreground/80 hover:bg-primary-glow hover:text-primary-foreground",
                )
              }
            >
              <Ion name={n.icon} className="text-lg" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-primary-foreground/10 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-primary-foreground/70 hover:text-accent">
            <Ion name="globe-outline" className="text-lg" /> View site
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-primary-foreground/70 hover:text-accent">
            <Ion name="log-out-outline" className="text-lg" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="p-6 lg:p-10 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
