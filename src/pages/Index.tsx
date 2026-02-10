import { useState, useRef, useEffect } from "react";
import { Leaf, User, Plus, TreePine, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/HeroSection";
import CollectorForm from "@/components/CollectorForm";
import AddCycadForm from "@/components/AddCycadForm";
import CollectionSummary from "@/components/CollectionSummary";
import CycadCard from "@/components/CycadCard";
import { toast } from "@/hooks/use-toast";
import type { Collector, CycadItem, Genus, Sex, PermitStatus } from "@/lib/types";

const Index = () => {
  const { user, signOut } = useAuth();
  const [collector, setCollector] = useState<Collector | null>(null);
  const [items, setItems] = useState<CycadItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load collector profile and cycads from database
  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      const { data: profile } = await supabase
        .from("collectors")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile) {
        setCollector({
          id: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name,
          email: profile.email,
          address: profile.address ?? undefined,
        });
      }
      const { data: cycads } = await supabase
        .from("cycad_items")
        .select("*")
        .eq("user_id", user.id)
        .order("date_added", { ascending: false });
      if (cycads) {
        setItems(
          cycads.map((c) => ({
            id: c.id,
            collectorId: c.user_id,
            genus: c.genus as Genus,
            species: c.species,
            dateObtained: c.date_obtained ?? undefined,
            obtainedAt: c.obtained_at ?? undefined,
            height: c.height ?? undefined,
            diameter: c.diameter ?? undefined,
            sex: c.sex as Sex,
            purchasePrice: c.purchase_price ?? undefined,
            value: c.value ?? undefined,
            permit: c.permit as PermitStatus,
            permitFile: c.permit_file_name && c.permit_file_url
              ? { name: c.permit_file_name, url: c.permit_file_url }
              : undefined,
            dateAdded: c.date_added,
          }))
        );
      }
    };
    loadData();
  }, [user]);

  const handleCollectorSubmit = async (c: Collector) => {
    if (!user) return;
    const { error } = await supabase
      .from("collectors")
      .upsert({
        id: collector?.id ?? undefined,
        user_id: user.id,
        first_name: c.firstName,
        last_name: c.lastName,
        email: c.email,
        address: c.address ?? null,
      }, { onConflict: "user_id" });
    if (error) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
      return;
    }
    setCollector(c);
  };

  const handleAddItem = async (item: CycadItem) => {
    if (!user) return;
    const { data, error } = await supabase.from("cycad_items").insert({
      user_id: user.id,
      genus: item.genus,
      species: item.species,
      date_obtained: item.dateObtained ?? null,
      obtained_at: item.obtainedAt ?? null,
      height: item.height ?? null,
      diameter: item.diameter ?? null,
      sex: item.sex,
      purchase_price: item.purchasePrice ?? null,
      value: item.value ?? null,
      permit: item.permit,
      permit_file_name: item.permitFile?.name ?? null,
      permit_file_url: item.permitFile?.url ?? null,
    }).select().single();
    if (error) {
      toast({ title: "Error adding cycad", description: error.message, variant: "destructive" });
      return;
    }
    setItems((prev) => [{
      ...item,
      id: data.id,
      dateAdded: data.date_added,
    }, ...prev]);
    setShowAddForm(false);
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase.from("cycad_items").delete().eq("id", id);
    if (error) {
      toast({ title: "Error removing cycad", description: error.message, variant: "destructive" });
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleEditItem = async (updated: CycadItem) => {
    const { error } = await supabase.from("cycad_items").update({
      genus: updated.genus,
      species: updated.species,
      date_obtained: updated.dateObtained ?? null,
      obtained_at: updated.obtainedAt ?? null,
      height: updated.height ?? null,
      diameter: updated.diameter ?? null,
      sex: updated.sex,
      purchase_price: updated.purchasePrice ?? null,
      value: updated.value ?? null,
      permit: updated.permit,
    }).eq("id", updated.id);
    if (error) {
      toast({ title: "Error updating cycad", description: error.message, variant: "destructive" });
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <TreePine className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">Cycad Collector</span>
          </div>
          <div className="flex items-center gap-4">
            {collector && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{collector.firstName} {collector.lastName}</span>
              </div>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <HeroSection onGetStarted={scrollToForm} />

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Registration */}
        <div ref={formRef} className="mb-16 scroll-mt-24">
          <div className="mb-6 flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">
              {collector ? "Your Profile" : "Register as a Collector"}
            </h2>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
            <CollectorForm onSubmit={handleCollectorSubmit} existingCollector={collector} />
          </div>
        </div>

        {/* Collection */}
        {collector && (
          <>
            <section>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Leaf className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">Your Collection</h2>
                  <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-medium text-primary">
                    {items.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  Add Cycad
                </button>
              </div>

              {showAddForm && (
                <div className="mb-8 rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                  <h3 className="mb-4 font-display text-xl font-semibold text-card-foreground">Add New Cycad</h3>
                  <AddCycadForm collectorId={collector.id} onAdd={handleAddItem} />
                </div>
              )}

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 py-16">
                  <Leaf className="mb-4 h-12 w-12 text-muted-foreground/40" />
                  <p className="text-lg text-muted-foreground">No cycads in your collection yet.</p>
                  <p className="text-sm text-muted-foreground/70">Click "Add Cycad" to start cataloguing.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((item) => (
                    <CycadCard key={item.id} item={item} onDelete={handleDeleteItem} onEdit={handleEditItem} />
                  ))}
                </div>
              )}
            </section>

            {/* Summary */}
            <section className="mt-16">
              <div className="mb-6 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Collection Summary</h2>
              </div>
              <CollectionSummary items={items} />
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Cycad Collector. Preserving living fossils, one collection at a time.</p>
      </footer>
    </div>
  );
};

export default Index;
