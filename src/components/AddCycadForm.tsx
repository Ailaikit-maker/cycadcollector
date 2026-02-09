import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { GENERA, type CycadItem, type Genus, type Sex, type PermitStatus } from "@/lib/types";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const cycadSchema = z.object({
  genus: z.string().min(1, "Genus is required"),
  species: z.string().trim().min(1, "Species is required").max(200),
  dateObtained: z.date().optional(),
  obtainedAt: z.string().trim().max(200).optional(),
  height: z.string().trim().max(50).optional(),
  diameter: z.string().trim().max(50).optional(),
  sex: z.enum(["Male", "Female", "Unknown"]),
  purchasePrice: z.string().trim().max(50).optional(),
  value: z.string().trim().max(50).optional(),
  permit: z.enum(["Yes", "No", "Not required", "In process"]),
});

interface AddCycadFormProps {
  collectorId: string;
  onAdd: (item: CycadItem) => void;
}

const AddCycadForm = ({ collectorId, onAdd }: AddCycadFormProps) => {
  const [genus, setGenus] = useState<Genus>("Encephalartos");
  const [species, setSpecies] = useState("");
  const [dateObtained, setDateObtained] = useState<Date | undefined>();
  const [obtainedAt, setObtainedAt] = useState("");
  const [height, setHeight] = useState("");
  const [diameter, setDiameter] = useState("");
  const [sex, setSex] = useState<Sex>("Unknown");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [value, setValue] = useState("");
  const [permit, setPermit] = useState<PermitStatus>("Not required");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = cycadSchema.safeParse({
      genus,
      species,
      dateObtained: dateObtained || undefined,
      obtainedAt: obtainedAt || undefined,
      height: height || undefined,
      diameter: diameter || undefined,
      sex,
      purchasePrice: purchasePrice || undefined,
      value: value || undefined,
      permit,
    });

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
      genus: result.data.genus as Genus,
      species: result.data.species,
      dateObtained: result.data.dateObtained?.toISOString(),
      obtainedAt: result.data.obtainedAt,
      height: result.data.height,
      diameter: result.data.diameter,
      sex: result.data.sex,
      purchasePrice: result.data.purchasePrice,
      value: result.data.value,
      permit: result.data.permit,
      dateAdded: new Date().toISOString(),
    };

    onAdd(item);
    toast({ title: "Cycad added!", description: `${item.genus} ${item.species} has been added to your collection.` });
    setSpecies("");
    setDateObtained(undefined);
    setObtainedAt("");
    setHeight("");
    setDiameter("");
    setSex("Unknown");
    setPurchasePrice("");
    setValue("");
    setPermit("Not required");
  };

  const formFields = (
    <div className="mt-4 space-y-4">
      {/* Species */}
      <div className="space-y-2">
        <Label htmlFor="species">Species *</Label>
        <Input
          id="species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="e.g. horridus"
          className={errors.species ? "border-destructive" : ""}
        />
        {errors.species && <p className="text-sm text-destructive">{errors.species}</p>}
      </div>

      {/* Date obtained & Obtained at */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Date Obtained</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dateObtained && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateObtained ? format(dateObtained, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateObtained}
                onSelect={setDateObtained}
                disabled={(date) => date > new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="obtainedAt">Obtained At</Label>
          <Input
            id="obtainedAt"
            value={obtainedAt}
            onChange={(e) => setObtainedAt(e.target.value)}
            placeholder="e.g. Kirstenbosch Gardens"
          />
        </div>
      </div>

      {/* Height & Diameter */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="height">Height</Label>
          <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 1.2m" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="diameter">Diameter</Label>
          <Input id="diameter" value={diameter} onChange={(e) => setDiameter(e.target.value)} placeholder="e.g. 0.8m" />
        </div>
      </div>

      {/* Sex */}
      <div className="space-y-2">
        <Label>Sex</Label>
        <RadioGroup value={sex} onValueChange={(v) => setSex(v as Sex)} className="flex gap-4">
          {(["Male", "Female", "Unknown"] as const).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <RadioGroupItem value={s} id={`sex-${s}`} />
              <Label htmlFor={`sex-${s}`} className="cursor-pointer font-normal">{s}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Purchase price & Value */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input
            id="purchasePrice"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            placeholder="e.g. R5,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Value</Label>
          <Input id="value" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. R12,000" />
        </div>
      </div>

      {/* Permit */}
      <div className="space-y-2">
        <Label>Permit</Label>
        <Select value={permit} onValueChange={(v) => setPermit(v as PermitStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Not required">Not required</SelectItem>
            <SelectItem value="In process">In process</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-md"
      >
        Add to Collection
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Label className="mb-2 block text-base font-semibold">Select Genus *</Label>
      {errors.genus && <p className="mb-2 text-sm text-destructive">{errors.genus}</p>}
      <Tabs value={genus} onValueChange={(v) => setGenus(v as Genus)}>
        <TabsList className="flex h-auto flex-wrap gap-1">
          {GENERA.map((g) => (
            <TabsTrigger key={g} value={g} className="text-xs sm:text-sm">
              {g}
            </TabsTrigger>
          ))}
        </TabsList>
        {GENERA.map((g) => (
          <TabsContent key={g} value={g}>
            {formFields}
          </TabsContent>
        ))}
      </Tabs>
    </form>
  );
};

export default AddCycadForm;
