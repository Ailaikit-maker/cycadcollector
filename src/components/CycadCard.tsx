import { Leaf } from "lucide-react";
import type { CycadItem } from "@/lib/types";

const conditionColor: Record<CycadItem["condition"], string> = {
  Excellent: "bg-primary/20 text-primary",
  Good: "bg-accent/20 text-accent-foreground",
  Fair: "bg-secondary text-secondary-foreground",
  Poor: "bg-destructive/20 text-destructive",
};

const CycadCard = ({ item, onDelete }: { item: CycadItem; onDelete: (id: string) => void }) => {
  return (
    <div className="group rounded-xl border bg-card p-5 transition-all hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-card-foreground">{item.species}</h3>
        </div>
        <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${conditionColor[item.condition]}`}>
          {item.condition}
        </span>
      </div>
      <p className="mb-3 text-sm text-muted-foreground">{item.description}</p>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {item.age && <span>Age: {item.age}</span>}
        {item.height && <span>Height: {item.height}</span>}
        <span>Added: {new Date(item.dateAdded).toLocaleDateString()}</span>
      </div>
      <button
        onClick={() => onDelete(item.id)}
        className="mt-3 text-xs text-destructive opacity-0 transition-opacity group-hover:opacity-100"
      >
        Remove
      </button>
    </div>
  );
};

export default CycadCard;
