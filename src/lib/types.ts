export interface Collector {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

export const GENERA = [
  "Bowenia",
  "Ceratozamia",
  "Cycas",
  "Dioon",
  "Encephalartos",
  "Lepidozamia",
  "Macrozamia",
  "Microcycas",
  "Stangeria",
  "Zamia",
  "Chigua",
] as const;

export type Genus = (typeof GENERA)[number];

export type Sex = "Male" | "Female" | "Unknown";
export type PermitStatus = "Yes" | "No" | "Not required" | "In process";

export interface CycadItem {
  id: string;
  collectorId: string;
  genus: Genus;
  species: string;
  dateObtained?: string;
  obtainedAt?: string;
  height?: string;
  diameter?: string;
  sex: Sex;
  purchasePrice?: string;
  value?: string;
  permit: PermitStatus;
  permitFile?: { name: string; url: string };
  dateAdded: string;
}
