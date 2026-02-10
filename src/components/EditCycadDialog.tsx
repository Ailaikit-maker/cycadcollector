import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { GENERA, type CycadItem, type Genus, type Sex, type PermitStatus } from "@/lib/types";

interface EditCycadDialogProps {
  item: CycadItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: CycadItem) => void;
}

const EditCycadDialog = ({ item, open, onOpenChange, onSave }: EditCycadDialogProps) => {
  const [genus, setGenus] = useState<Genus>(item.genus);
  const [species, setSpecies] = useState(item.species);
  const [dateObtained, setDateObtained] = useState<Date | undefined>(
    item.dateObtained ? new Date(item.dateObtained) : undefined
  );
  const [obtainedAt, setObtainedAt] = useState(item.obtainedAt || "");
  const [height, setHeight] = useState(item.height || "");
  const [diameter, setDiameter] = useState(item.diameter || "");
  const [sex, setSex] = useState<Sex>(item.sex);
  const [purchasePrice, setPurchasePrice] = useState(item.purchasePrice || "");
  const [value, setValue] = useState(item.value || "");
  const [permit, setPermit] = useState<PermitStatus>(item.permit);

  const handleSave = () => {
    if (!species.trim()) return;
    onSave({
      ...item,
      genus,
      species: species.trim(),
      dateObtained: dateObtained?.toISOString(),
      obtainedAt: obtainedAt || undefined,
      height: height || undefined,
      diameter: diameter || undefined,
      sex,
      purchasePrice: purchasePrice || undefined,
      value: value || undefined,
      permit,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Cycad</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Genus */}
          <div className="space-y-2">
            <Label>Genus</Label>
            <Select value={genus} onValueChange={(v) => setGenus(v as Genus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {GENERA.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Species */}
          <div className="space-y-2">
            <Label htmlFor="edit-species">Species *</Label>
            <Input id="edit-species" value={species} onChange={(e) => setSpecies(e.target.value)} />
          </div>

          {/* Date obtained & Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Date Obtained</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateObtained && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateObtained ? format(dateObtained, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateObtained} onSelect={setDateObtained} disabled={(d) => d > new Date()} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-obtainedAt">Obtained At</Label>
              <Input id="edit-obtainedAt" value={obtainedAt} onChange={(e) => setObtainedAt(e.target.value)} />
            </div>
          </div>

          {/* Height & Diameter */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-height">Height</Label>
              <Input id="edit-height" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-diameter">Diameter</Label>
              <Input id="edit-diameter" value={diameter} onChange={(e) => setDiameter(e.target.value)} />
            </div>
          </div>

          {/* Sex */}
          <div className="space-y-2">
            <Label>Sex</Label>
            <RadioGroup value={sex} onValueChange={(v) => setSex(v as Sex)} className="flex gap-4">
              {(["Male", "Female", "Unknown"] as const).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <RadioGroupItem value={s} id={`edit-sex-${s}`} />
                  <Label htmlFor={`edit-sex-${s}`} className="cursor-pointer font-normal">{s}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Price & Value */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Purchase Price</Label>
              <Input id="edit-price" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-value">Value</Label>
              <Input id="edit-value" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
          </div>

          {/* Permit */}
          <div className="space-y-2">
            <Label>Permit</Label>
            <Select value={permit} onValueChange={(v) => setPermit(v as PermitStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Not required">Not required</SelectItem>
                <SelectItem value="In process">In process</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!species.trim()}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCycadDialog;
