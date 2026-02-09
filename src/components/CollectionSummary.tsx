import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { BarChart3 } from "lucide-react";
import type { CycadItem } from "@/lib/types";

const parseCurrency = (val?: string): number => {
  if (!val) return 0;
  const num = parseFloat(val.replace(/[^0-9.,]/g, "").replace(",", ""));
  return isNaN(num) ? 0 : num;
};

const formatCurrency = (val: number): string =>
  val > 0 ? `R${val.toLocaleString("en-ZA", { minimumFractionDigits: 0 })}` : "—";

const CollectionSummary = ({ items }: { items: CycadItem[] }) => {
  const totalPurchase = items.reduce((sum, i) => sum + parseCurrency(i.purchasePrice), 0);
  const totalValue = items.reduce((sum, i) => sum + parseCurrency(i.value), 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 py-16">
        <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="text-lg text-muted-foreground">No cycads to summarise yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Plants</p>
          <p className="text-2xl font-bold text-foreground">{items.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">Genera</p>
          <p className="text-2xl font-bold text-foreground">{new Set(items.map((i) => i.genus)).size}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Purchase</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalPurchase)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(totalValue)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Genus</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Date Obtained</TableHead>
              <TableHead>Obtained At</TableHead>
              <TableHead className="text-right">Purchase Price</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Permit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...items]
              .sort((a, b) => a.genus.localeCompare(b.genus) || a.species.localeCompare(b.species))
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.genus}</TableCell>
                  <TableCell>{item.species}</TableCell>
                  <TableCell>{item.dateObtained ? new Date(item.dateObtained).toLocaleDateString() : "—"}</TableCell>
                  <TableCell>{item.obtainedAt || "—"}</TableCell>
                  <TableCell className="text-right">{item.purchasePrice || "—"}</TableCell>
                  <TableCell className="text-right">{item.value || "—"}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.permit === "Yes"
                          ? "bg-primary/20 text-primary"
                          : item.permit === "No"
                          ? "bg-destructive/20 text-destructive"
                          : item.permit === "In process"
                          ? "bg-accent/20 text-accent-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {item.permit}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="font-semibold">
                Totals
              </TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(totalPurchase)}</TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(totalValue)}</TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default CollectionSummary;
