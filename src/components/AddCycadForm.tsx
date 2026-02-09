import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { CycadItem } from "@/lib/types";

const cycadSchema = z.object({
  species: z.string().trim().min(1, "Species name is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(1000),
  age: z.string().trim().max(50).optional(),
  height: z.string().trim().max(50).optional(),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
});

interface AddCycadFormProps {
  collectorId: string;
  onAdd: (item: CycadItem) => void;
}

const AddCycadForm = ({ collectorId, onAdd }: AddCycadFormProps) => {
  const [species, setSpecies] = useState("");
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [condition, setCondition] = useState<CycadItem["condition"]>("Good");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = cycadSchema.safeParse({ species, description, age: age || undefined, height: height || undefined, condition });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const item: CycadItem = {
      id: crypto.randomUUID(),
      collectorId,
      species: result.data.species,
      description: result.data.description,
      age: result.data.age,
      height: result.data.height,
      condition: result.data.condition,
      dateAdded: new Date().toISOString(),
    };

    onAdd(item);
    toast({ title: "Cycad added!", description: `${item.species} has been added to your collection.` });
    setSpecies("");
    setDescription("");
    setAge("");
    setHeight("");
    setCondition("Good");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="species">Species *</Label>
        <Input
          id="species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="e.g. Encephalartos horridus"
          className={errors.species ? "border-destructive" : ""}
        />
        {errors.species && <p className="text-sm text-destructive">{errors.species}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your cycad..."
          rows={3}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="age">Estimated Age</Label>
          <Input id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 15 years" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 1.2m" />
        </div>
        <div className="space-y-2">
          <Label>Condition</Label>
          <Select value={condition} onValueChange={(v) => setCondition(v as CycadItem["condition"])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-md"
      >
        Add to Collection
      </button>
    </form>
  );
};

export default AddCycadForm;
