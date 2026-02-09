import { useState, useRef } from "react";
import { Leaf, User, Plus, TreePine, BarChart3 } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import CollectorForm from "@/components/CollectorForm";
import AddCycadForm from "@/components/AddCycadForm";
import CollectionSummary from "@/components/CollectionSummary";
import CycadCard from "@/components/CycadCard";
import type { Collector, CycadItem } from "@/lib/types";

const Index = () => {
  const [collector, setCollector] = useState<Collector | null>(null);
  const [items, setItems] = useState<CycadItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddItem = (item: CycadItem) => {
    setItems((prev) => [item, ...prev]);
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
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
          {collector && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{collector.firstName} {collector.lastName}</span>
            </div>
          )}
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
            <CollectorForm onSubmit={setCollector} existingCollector={collector} />
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
                    <CycadCard key={item.id} item={item} onDelete={handleDeleteItem} />
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
