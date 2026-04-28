import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Ion } from "@/components/Ion";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Application {
  id: string;
  application_type: "volunteer" | "mentor";
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  area_of_interest: string | null;
  experience: string | null;
  message: string | null;
  created_at: string;
}

const AdminApplications = () => {
  const [items, setItems] = useState<Application[]>([]);
  const [filter, setFilter] = useState<"all" | "volunteer" | "mentor">("all");
  const [open, setOpen] = useState<Application | null>(null);

  const load = async () => {
    const { data, error } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    if (error) { toast.error(error.message); return; }
    setItems((data as Application[]) || []);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => items.filter((i) => filter === "all" || i.application_type === filter),
    [items, filter],
  );

  const remove = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setOpen(null);
    load();
  };

  const exportPdf = () => {
    if (filtered.length === 0) { toast.error("No applications to export"); return; }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(16);
    doc.text("The Bints Foundation — Applications", 40, 40);
    doc.setFontSize(10);
    doc.setTextColor(120);
    const label = filter === "all" ? "All applications" : `${filter[0].toUpperCase()}${filter.slice(1)} applications`;
    doc.text(`${label} · Generated ${new Date().toLocaleString()} · ${filtered.length} record(s)`, 40, 58);

    autoTable(doc, {
      startY: 80,
      head: [["Date", "Type", "Full Name", "Email", "Phone", "Location", "Area of Interest", "Message"]],
      body: filtered.map((a) => [
        new Date(a.created_at).toLocaleDateString(),
        a.application_type,
        a.full_name,
        a.email,
        a.phone || "—",
        a.location || "—",
        a.area_of_interest || "—",
        (a.message || "").slice(0, 200),
      ]),
      styles: { fontSize: 8, cellPadding: 4, valign: "top" },
      headStyles: { fillColor: [30, 41, 59], textColor: 255 },
      columnStyles: { 7: { cellWidth: 220 } },
    });

    doc.save(`bints-applications-${filter}-${Date.now()}.pdf`);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow text-accent">Inbox</div>
          <h1 className="font-display text-3xl font-bold text-primary mt-1">Applications</h1>
          <p className="text-sm text-muted-foreground mt-2">All Volunteer and Mentorship applications submitted from the website.</p>
        </div>
        <button onClick={exportPdf} className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 transition">
          <Ion name="download-outline" /> Export to PDF
        </button>
      </div>
      <div className="gold-bar mt-4" />

      <div className="mt-6 inline-flex border border-border bg-card">
        {(["all", "volunteer", "mentor"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition ${filter === k ? "bg-primary text-primary-foreground" : "text-ink-soft hover:bg-secondary"}`}
          >
            {k === "all" ? `All (${items.length})` : `${k} (${items.filter((i) => i.application_type === k).length})`}
          </button>
        ))}
      </div>

      <div className="mt-6 bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Full Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-right px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No applications yet.</td></tr>
            ) : filtered.map((a) => (
              <tr key={a.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-4 py-3 text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${a.application_type === "mentor" ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"}`}>
                    {a.application_type}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-primary">{a.full_name}</td>
                <td className="px-4 py-3 text-ink-soft">{a.email}</td>
                <td className="px-4 py-3 text-ink-soft">{a.phone || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setOpen(a)} className="text-xs text-primary hover:text-accent inline-flex items-center gap-1">
                    <Ion name="eye-outline" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(null)} />
          <div className="relative w-full max-w-lg bg-background border border-border shadow-soft p-6 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-3 top-3 h-9 w-9 inline-flex items-center justify-center text-primary hover:text-accent">
              <Ion name="close-outline" className="text-xl" />
            </button>
            <div className="eyebrow text-accent">{open.application_type} application</div>
            <h2 className="font-display text-xl font-bold text-primary mt-1">{open.full_name}</h2>
            <div className="gold-bar mt-3" />
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Email" value={open.email} />
              <Row label="Phone" value={open.phone} />
              <Row label="Location" value={open.location} />
              <Row label="Area of Interest" value={open.area_of_interest} />
              <Row label="Experience" value={open.experience} />
              <Row label="Submitted" value={new Date(open.created_at).toLocaleString()} />
              {open.message && (
                <div>
                  <dt className="eyebrow">Message</dt>
                  <dd className="mt-1 text-ink-soft whitespace-pre-line bg-secondary/50 p-3 border border-border">{open.message}</dd>
                </div>
              )}
            </dl>
            <div className="mt-6 flex gap-2">
              <a href={`mailto:${open.email}`} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-medium hover:bg-primary-glow">
                <Ion name="mail-outline" /> Reply
              </a>
              <button onClick={() => remove(open.id)} className="inline-flex items-center gap-2 border border-destructive/40 text-destructive px-4 py-2.5 text-xs font-medium hover:bg-destructive hover:text-destructive-foreground">
                <Ion name="trash-outline" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string | null }) => (
  <div className="flex gap-3">
    <dt className="eyebrow w-32 shrink-0">{label}</dt>
    <dd className="text-ink-soft">{value || "—"}</dd>
  </div>
);

export default AdminApplications;
