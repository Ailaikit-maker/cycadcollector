import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileUp, X, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { GENERA, type CycadItem, type Genus, type Sex, type PermitStatus } from "@/lib/types";

interface EditCycadDialogProps {
  item: CycadItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: CycadItem, imageFile?: File) => void;
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
  const [permitFile, setPermitFile] = useState<{ name: string; url: string } | undefined>(item.permitFile);
  const [newPermitFile, setNewPermitFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item.imageUrl || null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!species.trim()) return;
    const updated: CycadItem = {
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
      permitFile: newPermitFile
        ? { name: newPermitFile.name, url: URL.createObjectURL(newPermitFile) }
        : permitFile,
      imageUrl: removeImage ? undefined : (imageFile ? undefined : item.imageUrl),
    };
    onSave(updated, imageFile || undefined);
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

          {/* Cycad Image */}
          <div className="space-y-2">
            <Label>Cycad Image</Label>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="gap-2" onClick={() => imageInputRef.current?.click()}>
                <ImagePlus className="h-4 w-4" />
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); setRemoveImage(true); if (imageInputRef.current) imageInputRef.current.value = ""; }}
                  className="text-sm text-destructive hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 rounded-lg object-cover border" />
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (!file.type.startsWith("image/")) {
                    toast({ title: "Invalid file", description: "Please upload an image.", variant: "destructive" });
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    toast({ title: "File too large", description: "Maximum image size is 5MB.", variant: "destructive" });
                    return;
                  }
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                  setRemoveImage(false);
                }
              }}
            />
          </div>

          {/* Permit File */}
          <div className="space-y-2">
            <Label>Permit File (PDF)</Label>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                <FileUp className="h-4 w-4" />
                {permitFile || newPermitFile ? "Change File" : "Upload PDF"}
              </Button>
              {(newPermitFile || permitFile) && (
                <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-sm">
                  <span className="max-w-[200px] truncate">{newPermitFile?.name || permitFile?.name}</span>
                  <button type="button" onClick={() => { setNewPermitFile(null); setPermitFile(undefined); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-muted-foreground hover:text-destructive">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.type !== "application/pdf") {
                  toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
                  return;
                }
                if (file.size > 10 * 1024 * 1024) {
                  toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
                  return;
                }
                setNewPermitFile(file);
              }
            }} />
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
