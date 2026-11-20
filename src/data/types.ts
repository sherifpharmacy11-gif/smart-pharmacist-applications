export type CategoryId =
  | "emergency"
  | "antibiotics"
  | "antifungals"
  | "tuberculosis"
  | "analgesics"
  | "gastrointestinal"
  | "cardiovascular"
  | "diuretics"
  | "antidiabetics"
  | "anticoagulants"
  | "respiratory"
  | "allergy"
  | "psychiatric"
  | "antiepileptics"
  | "custom";

export type WeightRule = {
  minPerKg: number;
  maxPerKg: number;
  unit: "mg" | "mcg" | "g" | "units" | "mL";
  basis: "dose" | "day";
  divided?: number;
  maxTotal?: number;
  note?: string;
};

export type InfusionRule = {
  bolusPerKg?: number;
  bolusUnit?: string;
  ratePerKgPerHour?: number;
  rateUnit?: string;
  note: string;
};

export type DoseContext = {
  id: string;
  label: string;
  detail: string;
  weight?: WeightRule;
  infusion?: InfusionRule;
};

export type Drug = {
  id: string;
  name: string;
  aliases?: string[];
  category: CategoryId;
  subclass: string;
  dose: string;
  pediatric?: string;
  max?: string;
  route?: string;
  frequency?: string;
  indications?: string[];
  monitoring?: string;
  adverse?: string;
  renal?: string;
  hepatic?: string;
  notes?: string;
  mnemonic?: string;
  conflict?: string;
  highRisk?: boolean;
  weight?: WeightRule;
  infusion?: InfusionRule;
  contexts?: DoseContext[];
  source: string;
};

export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: "emergency", label: "Emergency", blurb: "Arrest, anaphylaxis, status, overdose" },
  { id: "antibiotics", label: "Antibiotics", blurb: "Penicillins, macrolides, aminoglycosides" },
  { id: "antifungals", label: "Antifungals", blurb: "Polyenes, azoles, allylamines" },
  { id: "tuberculosis", label: "Tuberculosis", blurb: "HRZE and second-line drugs" },
  { id: "analgesics", label: "Pain & fever", blurb: "Paracetamol, ibuprofen, diclofenac" },
  { id: "gastrointestinal", label: "Gastrointestinal", blurb: "Acid, motility, gut, spasm" },
  { id: "cardiovascular", label: "Cardiovascular", blurb: "Pressure, angina, failure, lipids" },
  { id: "diuretics", label: "Diuretics", blurb: "Loop, thiazide, potassium-sparing" },
  { id: "antidiabetics", label: "Antidiabetics", blurb: "Oral agents, GLP-1, insulin" },
  { id: "anticoagulants", label: "Clotting", blurb: "Anticoagulants, antiplatelets, reversal" },
  { id: "respiratory", label: "Respiratory", blurb: "Bronchodilators, steroids, cough" },
  { id: "allergy", label: "Allergy", blurb: "Antihistamines and adjuncts" },
  { id: "psychiatric", label: "Psychiatric", blurb: "Antipsychotics, antidepressants, sleep" },
  { id: "antiepileptics", label: "Antiepileptics", blurb: "Older, newer, and status drugs" },
];

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? "Custom record";
}
