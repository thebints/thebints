import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { toast } from "sonner";
import bintsLogo from "@/assets/bints-logo.png";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back.");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-background rounded-sm overflow-hidden shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.6)]">
        <div className="h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="p-8">
          <div className="flex justify-center">
            <img src={bintsLogo} alt="The Bints Foundation" className="h-16 w-auto" />
          </div>
          <h1 className="font-display text-2xl font-bold text-primary text-center mt-4">Admin Sign In</h1>
          <p className="text-xs text-muted-foreground text-center mt-1">Restricted area for foundation administrators.</p>
          <div className="gold-bar mx-auto mt-4" />
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="eyebrow block mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-card px-4 py-3 text-sm focus:border-accent outline-none"
                placeholder="admin@thebintsfoundation.com"
              />
            </div>
            <div>
              <label className="eyebrow block mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border bg-card px-4 py-3 text-sm focus:border-accent outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3.5 text-sm font-medium hover:bg-primary-glow transition disabled:opacity-60"
            >
              <Ion name="log-in-outline" />
              {busy ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
