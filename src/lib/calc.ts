import type { DoseContext, Drug, InfusionRule, WeightRule } from "@/data/types";

export type Sex = "female" | "male";
export type Hepatic = "none" | "A" | "B" | "C";

export type Patient = {
  weightKg: string;
  heightCm: string;
  ageYears: string;
  ageMonths: string;
  sex: Sex;
  scr: string;
  hepatic: Hepatic;
};

export const emptyPatient: Patient = {
  weightKg: "",
  heightCm: "",
  ageYears: "",
  ageMonths: "",
  sex: "male",
  scr: "",
  hepatic: "none",
};

export type Flag = { tone: "info" | "warn" | "stop"; text: string };
export type Line = { label: string; value: string };

export type CalcResult = {
  ageYears: number | null;
  ageLabel: string | null;
  bsa: number | null;
  crcl: number | null;
  band: { label: string; hint: string } | null;
  lines: Line[];
  flags: Flag[];
};

export function num(value: string): number | null {
  const t = value.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function fmt(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  const d = abs >= 100 ? 0 : abs >= 10 ? 1 : digits;
  const f = 10 ** d;
  const r = Math.round(n * f) / f;
  return String(r);
}

export function cockcroft(age: number, weight: number, scr: number, sex: Sex): number {
  const base = ((140 - age) * weight) / (72 * scr);
  return sex === "female" ? base * 0.85 : base;
}

export function mosteller(cm: number, kg: number): number {
  return Math.sqrt((cm * kg) / 3600);
}

export function clark(weightKg: number, adultMg: number): number {
  return (weightKg / 150) * adultMg;
}

export function young(ageYears: number, adultMg: number): number {
  return (ageYears / (ageYears + 12)) * adultMg;
}

export function friedYears(ageYears: number, adultMg: number): number {
  return (ageYears / 150) * adultMg;
}

export function friedMonths(ageMonths: number, adultMg: number): number {
  return (ageMonths / 150) * adultMg;
}

export function renalBand(cl: number): { label: string; hint: string } {
  if (cl >= 90) return { label: "Normal", hint: "≥ 90 mL/min. Usually no change." };
  if (cl >= 60) return { label: "Mild impairment", hint: "60–89. Usually no change." };
  if (cl >= 30) return { label: "Moderate impairment", hint: "30–59. Lower the dose or lengthen the interval." };
  if (cl >= 15) return { label: "Severe impairment", hint: "15–29. Lower the dose and lengthen the interval." };
  return { label: "ESRD / dialysis range", hint: "Under 15. Avoid, or give a reduced dose after dialysis." };
}

export function ageLabel(years: number): string {
  if (years < 1 / 12) return "Neonate";
  if (years < 1) return "Infant";
  if (years < 12) return "Child";
  if (years < 18) return "Adolescent";
  if (years >= 65) return "Older adult";
  return "Adult";
}

function weightLine(rule: WeightRule, kg: number, times: number | null): { lines: Line[]; flags: Flag[] } {
  const lines: Line[] = [];
  const flags: Flag[] = [];
  const min = rule.minPerKg * kg;
  const max = rule.maxPerKg * kg;
  const unit = rule.unit;
  if (rule.basis === "dose") {
    lines.push({ label: "Per dose", value: `${fmt(min)}–${fmt(max)} ${unit}` });
    if (times) {
      const dayMax = max * times;
      lines.push({ label: `If given ${times}× daily`, value: `${fmt(min * times)}–${fmt(dayMax)} ${unit}/day` });
      if (rule.maxTotal != null && dayMax > rule.maxTotal) {
        flags.push({
          tone: "stop",
          text: `That schedule can pass the sheet maximum of ${fmt(rule.maxTotal)} ${unit}/day.`,
        });
      }
    }
    if (rule.maxTotal != null && max > rule.maxTotal) {
      flags.push({
        tone: "stop",
        text: `A single dose at the top of the range exceeds ${fmt(rule.maxTotal)} ${unit}. Cap it.`,
      });
    }
  } else {
    lines.push({ label: "Daily total", value: `${fmt(min)}–${fmt(max)} ${unit}/day` });
    if (rule.divided) {
      lines.push({
        label: `Split into ${rule.divided}`,
        value: `${fmt(min / rule.divided)}–${fmt(max / rule.divided)} ${unit} each`,
      });
    }
    if (rule.maxTotal != null && max > rule.maxTotal) {
      flags.push({
        tone: "warn",
        text: `Calculated top (${fmt(max)} ${unit}/day) is above the sheet maximum of ${fmt(rule.maxTotal)} ${unit}/day. Use the maximum.`,
      });
    }
  }
  if (rule.note) flags.push({ tone: "info", text: rule.note });
  return { lines, flags };
}

function infusionLine(rule: InfusionRule, kg: number): Line[] {
  const lines: Line[] = [];
  if (rule.bolusPerKg != null) {
    lines.push({
      label: "Bolus",
      value: `${fmt(rule.bolusPerKg * kg)} ${rule.bolusUnit ?? ""}`.trim(),
    });
  }
  if (rule.ratePerKgPerHour != null) {
    lines.push({
      label: "Infusion",
      value: `${fmt(rule.ratePerKgPerHour * kg)} ${rule.rateUnit ?? "per hour"}`.trim(),
    });
  }
  lines.push({ label: "How to read it", value: rule.note });
  return lines;
}

function fondaparinux(kg: number): string {
  if (kg < 50) return "5 mg subcutaneous once daily (under 50 kg).";
  if (kg <= 100) return "7.5 mg subcutaneous once daily (50–100 kg).";
  return "10 mg subcutaneous once daily (over 100 kg).";
}

export function activeRule(drug: Drug, contextId: string): { weight?: WeightRule; infusion?: InfusionRule; detail?: string } {
  const ctx: DoseContext | undefined = drug.contexts?.find((c) => c.id === contextId) ?? drug.contexts?.[0];
  if (ctx) return { weight: ctx.weight ?? drug.weight, infusion: ctx.infusion ?? drug.infusion, detail: ctx.detail };
  return { weight: drug.weight, infusion: drug.infusion, detail: drug.dose };
}

export function compute(input: {
  drug: Drug | null;
  patient: Patient;
  contextId: string;
  timesPerDay: string;
  concentration: string;
  prepareMg: string;
  adultDose: string;
  intendedMg: string;
  intendedTimes: string;
}): CalcResult {
  const flags: Flag[] = [];
  const lines: Line[] = [];
  const kg = num(input.patient.weightKg);
  const cm = num(input.patient.heightCm);
  const scr = num(input.patient.scr);
  const yearsDirect = num(input.patient.ageYears);
  const months = num(input.patient.ageMonths);
  const years = yearsDirect ?? (months != null ? months / 12 : null);
  const times = num(input.timesPerDay);
  const bsa = kg && cm ? mosteller(cm, kg) : null;
  let crcl: number | null = null;
  if (years && kg && scr) {
    if (years >= 140) flags.push({ tone: "stop", text: "Age must be under 140 for Cockcroft–Gault." });
    else crcl = cockcroft(years, kg, scr, input.patient.sex);
  }
  const band = crcl != null ? renalBand(crcl) : null;

  if (input.drug) {
    const rule = activeRule(input.drug, input.contextId);
    if (rule.detail) lines.push({ label: "Sheet text for this context", value: rule.detail });
    if (kg && rule.weight) {
      const w = weightLine(rule.weight, kg, times);
      lines.push(...w.lines);
      flags.push(...w.flags);
    } else if (rule.weight) {
      flags.push({ tone: "info", text: "Enter weight to turn the mg/kg line into a dose." });
    }
    if (kg && rule.infusion) lines.push(...infusionLine(rule.infusion, kg));
    else if (rule.infusion) flags.push({ tone: "info", text: "Enter weight to calculate the infusion." });

    if (input.drug.id === "fondaparinux" && kg) {
      lines.push({ label: "Treatment band", value: fondaparinux(kg) });
    }
    if (input.drug.id === "enoxaparin" && input.contextId === "treatment" && crcl != null && crcl < 30) {
      flags.push({
        tone: "stop",
        text: "CrCl is under 30. The renal sheet changes enoxaparin treatment to 1 mg/kg once daily, not every 12 hours.",
      });
    }
    if (input.drug.id === "metformin" && crcl != null) {
      if (crcl < 30) {
        flags.push({
          tone: "stop",
          text: "Under 30: the sheet contraindicates metformin when eGFR is under 30. This figure is Cockcroft–Gault, not eGFR — confirm with eGFR before acting.",
        });
      } else if (crcl < 45) {
        flags.push({
          tone: "warn",
          text: "30–45 range: sheet maximum for metformin is 1000 mg/day if eGFR is in that band.",
        });
      }
    }
    if (input.drug.id === "paracetamol") {
      if (years != null && years >= 12 && kg && rule.weight) {
        const single = rule.weight.maxPerKg * kg;
        if (single > 1000) {
          flags.push({
            tone: "warn",
            text: "Weight-based paracetamol for this adult can exceed the 500–1000 mg single dose on the pain sheet. Do not go above 1 g per dose or 4 g/day unless a protocol says otherwise.",
          });
        }
      }
      if (input.patient.hepatic === "C") {
        flags.push({ tone: "stop", text: "Child-Pugh C: paracetamol maximum on the hepatic sheet is 2 g/day." });
      }
    }
    if (input.drug.id === "ibuprofen" && years != null && years < 1) {
      flags.push({
        tone: "warn",
        text: "Under 1 year, the pain sheet prints 50 mg/kg/day in 3 doses. That conflicts with 5–10 mg/kg per dose and with the 30 mg/kg/day maximum. The calculator is using the 5–10 mg/kg dose, not the infant row.",
      });
    }
    if ((input.drug.id === "ibuprofen" || input.drug.id === "diclofenac") && crcl != null && crcl < 30) {
      flags.push({ tone: "stop", text: "NSAID sheet: avoid if eGFR is under 30. Confirm with eGFR; this number is creatinine clearance." });
    }
    if (input.drug.renal) flags.push({ tone: band && crcl != null && crcl < 60 ? "warn" : "info", text: input.drug.renal });
    if (input.drug.hepatic && input.patient.hepatic !== "none") {
      const severe = input.patient.hepatic === "B" || input.patient.hepatic === "C";
      flags.push({ tone: severe ? "warn" : "info", text: input.drug.hepatic });
    }
    if (input.drug.highRisk) {
      flags.push({ tone: "warn", text: "High-risk on the study sheets. Double-check the order, the route, and the monitoring." });
    }
    if (years != null && years >= 65) {
      flags.push({ tone: "info", text: "Older adult: the introduction sheet says clearance falls and sensitivity rises, so start low." });
    }
  }

  const conc = num(input.concentration);
  const prepare = num(input.prepareMg);
  if (conc && prepare) {
    lines.push({ label: "Volume to draw", value: `${fmt(prepare / conc, 2)} mL  (${fmt(prepare)} mg ÷ ${fmt(conc)} mg/mL)` });
  }

  const adult = num(input.adultDose);
  if (adult) {
    if (kg) lines.push({ label: "Clark (kg/150 × adult)", value: `${fmt(clark(kg, adult))} mg` });
    if (years) {
      lines.push({ label: "Young", value: `${fmt(young(years, adult))} mg` });
      lines.push({ label: "Fried as printed (years)", value: `${fmt(friedYears(years, adult))} mg` });
    }
    const m = months ?? (years != null ? years * 12 : null);
    if (m != null) lines.push({ label: "Classical Fried (months)", value: `${fmt(friedMonths(m, adult))} mg` });
  }

  const intended = num(input.intendedMg);
  const intendedTimes = num(input.intendedTimes);
  if (input.drug && intended) {
    const rule = activeRule(input.drug, input.contextId).weight;
    if (kg && rule) {
      const lo = rule.minPerKg * kg;
      const hi = rule.maxPerKg * kg;
      const compare = rule.basis === "day" && intendedTimes ? intended * intendedTimes : intended;
      const loC = rule.basis === "day" ? lo : lo;
      const hiC = rule.basis === "day" ? hi : hi;
      if (compare < loC * 0.98) flags.push({ tone: "warn", text: "Intended amount is below the calculated sheet range." });
      else if (compare > hiC * 1.02) flags.push({ tone: "stop", text: "Intended amount is above the calculated sheet range." });
      else flags.push({ tone: "info", text: "Intended amount sits inside the calculated sheet range." });
    }
    if (input.drug.max && intendedTimes) {
      lines.push({
        label: "Intended daily total",
        value: `${fmt(intended * intendedTimes)} × check against: ${input.drug.max}`,
      });
    }
  }

  return {
    ageYears: years,
    ageLabel: years != null ? ageLabel(years) : null,
    bsa,
    crcl,
    band,
    lines,
    flags,
  };
}

export function dilution(c1: number, v1: number, c2: number): number | null {
  if (c2 <= 0) return null;
  return (c1 * v1) / c2;
}
