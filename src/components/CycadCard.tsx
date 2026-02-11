import { useState } from "react";
import { Leaf, FileText, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditCycadDialog from "@/components/EditCycadDialog";
import type { CycadItem } from "@/lib/types";

const permitColor: Record<string, string> = {
  Yes: "bg-primary/20 text-primary",
  No: "bg-destructive/20 text-destructive",
  "Not required": "bg-secondary text-secondary-foreground",
  "In process": "bg-accent/20 text-accent-foreground",
};

const CycadCard = ({
  item,
  onDelete,
  onEdit,
}: {
  item: CycadItem;
  onDelete: (id: string) => void;
  onEdit: (updated: CycadItem) => void;
}) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
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

        {item.permitFile && (
          <a
            href={item.permitFile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <FileText className="h-3.5 w-3.5" />
            {item.permitFile.name}
          </a>
        )}

        <div className="mt-1 flex gap-3">
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-1 text-xs text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this cycad?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove <strong>{item.genus} {item.species}</strong> from your collection.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <EditCycadDialog item={item} open={editOpen} onOpenChange={setEditOpen} onSave={onEdit} />
    </>
  );
};

export default CycadCard;
