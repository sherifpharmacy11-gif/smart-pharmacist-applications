export function parseDosingNote(raw: string): { name: string; dose: string; max?: string; notes?: string } | null {
  const lines = raw
    .split(/\n/)
    .map((l) => l.replace(/^[\s•*\-\d.)]+/, "").trim())
    .filter(Boolean);
  if (!lines.length) return null;
  const name = lines[0].slice(0, 80);
  if (name.length < 2) return null;
  const doseLine = lines.find((l) => /dose/i.test(l));
  const maxLine = lines.find((l) => /^max/i.test(l) || /maximum/i.test(l));
  const dose = (doseLine ?? lines[1] ?? "").replace(/^dose\s*:\s*/i, "");
  if (!dose) return null;
  const notes = lines
    .slice(1)
    .filter((l) => l !== doseLine && l !== maxLine)
    .join("\n");
  return {
    name,
    dose,
    max: maxLine?.replace(/^max(imum)?[^:]*:\s*/i, ""),
    notes: notes || undefined,
  };
}
