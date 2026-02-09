import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { Collector } from "@/lib/types";

const collectorSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  address: z.string().trim().max(500).optional(),
});

interface CollectorFormProps {
  onSubmit: (collector: Collector) => void;
  existingCollector?: Collector | null;
}

const CollectorForm = ({ onSubmit, existingCollector }: CollectorFormProps) => {
  const [firstName, setFirstName] = useState(existingCollector?.firstName ?? "");
  const [lastName, setLastName] = useState(existingCollector?.lastName ?? "");
  const [email, setEmail] = useState(existingCollector?.email ?? "");
  const [address, setAddress] = useState(existingCollector?.address ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = collectorSchema.safeParse({ firstName, lastName, email, address: address || undefined });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const collector: Collector = {
      id: existingCollector?.id ?? crypto.randomUUID(),
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email,
      address: result.data.address,
    };

    onSubmit(collector);
    toast({
      title: existingCollector ? "Profile updated" : "Welcome aboard!",
      description: `${collector.firstName}, your collector profile has been ${existingCollector ? "updated" : "created"}.`,
    });

    if (!existingCollector) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setAddress("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            className={errors.firstName ? "border-destructive" : ""}
          />
          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
            className={errors.lastName ? "border-destructive" : ""}
          />
          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address <span className="text-muted-foreground">(optional)</span></Label>
        <Textarea
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          rows={2}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-md"
      >
        {existingCollector ? "Update Profile" : "Register as Collector"}
      </button>
    </form>
  );
};

export default CollectorForm;
