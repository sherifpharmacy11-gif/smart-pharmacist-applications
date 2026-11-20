import type { Drug } from "./types";
import { acuteDrugs } from "./drugs-acute";
import { infectDrugs } from "./drugs-infect";
import { medicineDrugs } from "./drugs-medicine";
import { neuroDrugs } from "./drugs-neuro";
import { systemsDrugs } from "./drugs-systems";

export const DRUGS: Drug[] = [
  ...acuteDrugs,
  ...infectDrugs,
  ...medicineDrugs,
  ...systemsDrugs,
  ...neuroDrugs,
];

const byId = new Map(DRUGS.map((d) => [d.id, d]));

export function getBuiltInDrug(id: string): Drug | undefined {
  return byId.get(id);
}

export function norm(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9./+\s-]/g, " ").replace(/\s+/g, " ").trim();
}

export function searchDrugs(query: string, list: Drug[]): Drug[] {
  const n = norm(query);
  if (!n) return list;
  const parts = n.split(" ").filter(Boolean);
  return list.filter((d) => {
    const hay = norm(
      [
        d.name,
        d.subclass,
        d.category,
        d.dose,
        d.pediatric ?? "",
        d.max ?? "",
        d.mnemonic ?? "",
        d.notes ?? "",
        d.renal ?? "",
        d.hepatic ?? "",
        ...(d.aliases ?? []),
        ...(d.indications ?? []),
        ...(d.contexts?.map((c) => `${c.label} ${c.detail}`) ?? []),
      ].join(" "),
    );
    return parts.every((p) => hay.includes(p));
  });
}
