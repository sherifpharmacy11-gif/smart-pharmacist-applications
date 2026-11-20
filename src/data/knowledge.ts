export const SHEETS = [
  "Introduction to drug dosage",
  "Emergency drugs",
  "Antibiotics",
  "Antifungals",
  "Antitubercular drugs",
  "Pain and fever",
  "Gastrointestinal drugs",
  "Cardiovascular drugs",
  "Diuretics",
  "Antidiabetic drugs",
  "Anticoagulants and antiplatelets",
  "Respiratory drugs",
  "Antiallergic drugs",
  "Psychiatric drugs",
  "Antiepileptic drugs",
  "High-risk drugs",
  "Renal and hepatic adjustments",
  "One-shot dose revision",
  "High-yield dose mnemonics",
] as const;

export const RENAL_BANDS = [
  { label: "Normal", range: "≥ 90 mL/min", action: "No routine change" },
  { label: "Mild", range: "60–89", action: "Usually no change" },
  { label: "Moderate", range: "30–59", action: "Lower the dose or lengthen the interval" },
  { label: "Severe", range: "15–29", action: "Lower the dose and lengthen the interval" },
  { label: "ESRD / dialysis", range: "< 15", action: "Avoid, or give a reduced dose after dialysis" },
];

export const RENAL_ROWS = [
  ["Penicillin G", "No adjustment"],
  ["Amoxicillin", "CrCl 10–30: 250–500 mg every 12 h. CrCl < 10: every 24 h"],
  ["Vancomycin", "Dose by level. Lengthen the interval if CrCl is low"],
  ["Aminoglycosides", "Longer interval, or dose by level"],
  ["NSAIDs", "Avoid if eGFR < 30"],
  ["Digoxin", "Lower the dose. Monitor the level"],
  ["Allopurinol", "CrCl < 30: lower to 100 mg/day. Usual dose is not printed"],
  ["Ciprofloxacin", "CrCl 30–50: 250–500 mg every 12 h. CrCl < 30: every 24 h"],
  ["Metformin", "eGFR 30–45: max 1000 mg/day. eGFR < 30: contraindicated"],
  ["Enoxaparin", "CrCl < 30: 1 mg/kg once daily instead of every 12 h"],
  ["Gabapentin", "CrCl 15–29: 200–700 mg/day in divided doses"],
];

export const HEPATIC_BANDS = [
  { label: "Mild · Child-Pugh A", score: "5–6", action: "Usually no change. Well compensated" },
  { label: "Moderate · Child-Pugh B", score: "7–9", action: "Lower the dose 25–50%, or lengthen the interval" },
  { label: "Severe · Child-Pugh C", score: "10–15", action: "Lower the dose 50–75%, or avoid" },
];

export const HEPATIC_ROWS = [
  ["Paracetamol", "Child-Pugh C: max 2 g/day (usual max printed as 3–4 g, and 4 g on the pain sheet)"],
  ["Statins (atorvastatin named)", "Start low. Avoid high doses in severe disease"],
  ["Benzodiazepines", "Lower the dose or lengthen the interval"],
  ["Diazepam", "Lower the dose or lengthen the interval. Half-life is prolonged"],
  ["Phenytoin", "About 25–50% lower in class B and C"],
  ["Warfarin", "Lower the dose. Monitor INR"],
  ["Metronidazole", "Lower considerably in severe disease"],
];

export const FORMULAS = [
  {
    name: "Weight dose",
    expr: "Dose (mg) = required dose (mg/kg) × weight (kg)",
    note: "Printed on the introduction sheet.",
  },
  {
    name: "Volume to give",
    expr: "Volume (mL) = dose required ÷ concentration",
    note: "Concentration must use the same mass unit as the dose.",
  },
  {
    name: "Percent concentration",
    expr: "Concentration (%) = amount of drug (g) ÷ volume (mL) × 100",
    note: "Printed on the introduction sheet.",
  },
  {
    name: "Dilution",
    expr: "C1 × V1 = C2 × V2",
    note: "C1 initial concentration, V1 initial volume, C2 desired, V2 final volume.",
  },
  {
    name: "Infusion rate",
    expr: "Rate = volume (mL) ÷ time (h)",
    note: "Printed on the one-shot sheet. Convert to mL/min yourself if the pump asks for it.",
  },
  {
    name: "Cockcroft–Gault",
    expr: "CrCl = ((140 − age) × weight kg) ÷ (72 × SCr mg/dL) × 0.85 if female",
    note: "This is creatinine clearance, not eGFR. The sheet says use eGFR or CrCl, and only prints this formula.",
  },
  {
    name: "BSA dose",
    expr: "Dose = dose (mg/m²) × BSA (m²)",
    note: "The sheet does not print a BSA equation. Mosteller is used here: √(height cm × weight kg ÷ 3600), and it is labeled as such.",
  },
  {
    name: "Clark",
    expr: "(weight kg ÷ 150) × adult dose",
    note: "The introduction sheet prints weight (kg) / 150. The adult-dose multiplier is required for a milligram answer and is assumed here. Classical Clark uses pounds.",
  },
  {
    name: "Young",
    expr: "(age in years ÷ (age + 12)) × adult dose",
    note: "As printed.",
  },
  {
    name: "Fried, as printed",
    expr: "(age in years ÷ 150) × adult dose",
    note: "The sheet says years. Classical Fried uses age in months. Both are available, and they are labeled.",
  },
];

export const MNEMONICS = [
  { code: "HRZE", text: "Hit Rats Zoo Elephants — isoniazid, rifampicin, pyrazinamide, ethambutol." },
  { code: "NICE", text: "Anti-angina: nitrates, ivabradine, calcium channel blockers, beta blockers." },
  { code: "GI DRUG", text: "Gastric acid, improve motility, diarrhea control, regularize bowel, ulcer care, GI comfort." },
  { code: "2-4-6-8, 12", text: "Penicillin G: 2–4 million units IV every 4 hours, up to 24 million units/day." },
  { code: "Gentle once a day", text: "Gentamicin 5–7 mg/kg IV or IM once daily." },
  { code: "15–20 keep in mind", text: "Vancomycin 15–20 mg/kg IV every 8–12 h." },
  { code: "Z-Pak 5 days", text: "Azithromycin 500 mg day 1, then 250 mg on days 2–5." },
  { code: "Atropine: 0.6 repeat", text: "0.6 mg IV every 3–5 min, max 3 mg. The emergency sheet prints 0.5 mg." },
  { code: "6-12-12", text: "Adenosine 6 mg, then 12 mg, then 12 mg IV rapid bolus." },
  { code: "150 then 1 then 0.5", text: "Amiodarone infusion: 150 mg over 10 min, 1 mg/min for 6 h, 0.5 mg/min for 18 h." },
  { code: "40–80 works fast", text: "Furosemide 40–80 mg. Other sheets print 20–40 mg." },
  { code: "5-10-20", text: "Nitroglycerin infusion: 5–10 mcg/min, step up by 5–10, max 200 mcg/min." },
  { code: "15 every 6", text: "Paracetamol 15 mg/kg every 6 h, max 60 mg/kg/day." },
  { code: "10 mg/kg every 8", text: "Ibuprofen mnemonic. Pain sheet max is 30 mg/kg/day; this card says 40." },
  { code: "4 6 8", text: "Dexamethasone 4 mg every 6–8 h, or 0.1–0.3 mg/kg/dose." },
  { code: "4-1-10", text: "Magnesium: 4 g IV over 20 min, then 1–2 g/h. Not the 2 g asthma or torsades bolus." },
  { code: "1–1.5 then infusion", text: "Lidocaine 1–1.5 mg/kg bolus, then 1–4 mg/min." },
];

export const TB_REGIMENS = [
  {
    title: "New, drug-sensitive",
    lines: ["Intensive 2 months: HRZE daily (H + R + Z + E).", "Continuation 4 months: HR daily.", "Total about 6 months."],
  },
  {
    title: "Previously treated, relapse, or failure",
    lines: ["Intensive 6 months: individualized, including second-line drugs.", "Continuation 18 months.", "Total duration 18–20 months."],
  },
];

export const FDC = [
  "HRZE 150/75/400/275 mg",
  "HR 75/150 mg",
  "HRE 75/150/275 mg",
  "HRZ 75/150/400 mg",
];

export const ROUTES = [
  ["IV", "Immediate", "100% bioavailability"],
  ["IM", "10–30 min", "75–100%"],
  ["Oral", "30–60 min", "Variable, 25–90%"],
  ["Sublingual", "5–20 min", "High"],
  ["Rectal", "15–60 min", "Variable"],
  ["Topical", "Variable", "Local effect"],
  ["Inhalation", "Immediate", "High"],
];

export const TOXICITY = [
  ["Kidney", "Oliguria, rising creatinine, edema, hyperkalemia, uremic symptoms"],
  ["Liver", "Jaundice, rising LFTs, coagulopathy, encephalopathy, ascites"],
  ["Anticoagulants", "Bleeding, bruising"],
  ["Insulin", "Hypoglycemia: sweating, tremor, confusion"],
  ["Digoxin", "Nausea, visual change, arrhythmias"],
  ["Aminoglycosides", "Ototoxicity, nephrotoxicity"],
  ["Lithium", "Tremor, confusion, GI upset"],
];

export const ARREST = {
  hs: ["Hypoxia", "Hypovolemia", "Hydrogen ion (acidosis)", "Hypo/hyperkalemia", "Hypothermia"],
  ts: ["Tension pneumothorax", "Tamponade", "Toxins", "Thrombosis (pulmonary)", "Thrombosis (coronary)"],
};

export const ASTHMA_PEF = [
  ["> 80% predicted", "Mild"],
  ["60–80%", "Moderate"],
  ["40–60%", "Severe"],
  ["< 40%", "Life-threatening"],
];
