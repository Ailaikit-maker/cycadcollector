import { Leaf } from "lucide-react";
import type { CycadItem } from "@/lib/types";

const permitColor: Record<string, string> = {
  Yes: "bg-primary/20 text-primary",
  No: "bg-destructive/20 text-destructive",
  "Not required": "bg-secondary text-secondary-foreground",
  "In process": "bg-accent/20 text-accent-foreground",
};

const CycadCard = ({ item, onDelete }: { item: CycadItem; onDelete: (id: string) => void }) => {
  return (
    <div className="group rounded-xl border bg-card p-5 transition-all hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-card-foreground">
            {item.genus} {item.species}
          </h3>
        </div>
        <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${permitColor[item.permit] || ""}`}>
          Permit: {item.permit}
        </span>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>Sex: {item.sex}</span>
        {item.height && <span>Height: {item.height}</span>}
        {item.diameter && <span>Diameter: {item.diameter}</span>}
        {item.obtainedAt && <span>From: {item.obtainedAt}</span>}
        {item.purchasePrice && <span>Price: {item.purchasePrice}</span>}
        {item.value && <span>Value: {item.value}</span>}
        {item.dateObtained && (
          <span>Obtained: {new Date(item.dateObtained).toLocaleDateString()}</span>
        )}
        <span>Added: {new Date(item.dateAdded).toLocaleDateString()}</span>
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="mt-1 text-xs text-destructive opacity-0 transition-opacity group-hover:opacity-100"
      >
        Remove
      </button>
    </div>
  );
};

export default CycadCard;
