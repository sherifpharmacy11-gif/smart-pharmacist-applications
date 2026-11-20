import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Btn, Disclaimer, Field, Flags, Kicker, Panel, Select, TextInput } from "@/components/bits";
import { Shell } from "@/components/shell";
import { DRUGS, searchDrugs } from "@/data/drugs";
import { compute, dilution, emptyPatient, fmt, type Patient } from "@/lib/calc";
import { usePharmacy } from "@/lib/store";

export const Route = createFileRoute("/calculate")({
  validateSearch: (search: Record<string, unknown>): { drug?: string } => ({
    drug: typeof search.drug === "string" ? search.drug : undefined,
  }),
  component: CalculatePage,
});

function CalculatePage() {
  const search = Route.useSearch();
  const custom = usePharmacy((s) => s.custom);
  const all = useMemo(() => [...custom, ...DRUGS], [custom]);
  const [patient, setPatient] = useState<Patient>(emptyPatient);
  const [drugId, setDrugId] = useState(search.drug ?? "");
  const [contextId, setContextId] = useState("");
  const [query, setQuery] = useState("");
  const [times, setTimes] = useState("");
  const [conc, setConc] = useState("");
  const [prepare, setPrepare] = useState("");
  const [adult, setAdult] = useState("");
  const [intended, setIntended] = useState("");
  const [intendedTimes, setIntendedTimes] = useState("");
  const [c1, setC1] = useState("");
  const [v1, setV1] = useState("");
  const [c2, setC2] = useState("");
  const saveSnap = usePharmacy((s) => s.saveSnap);

  const drug = all.find((d) => d.id === drugId) ?? null;

  useEffect(() => {
    if (search.drug) setDrugId(search.drug);
  }, [search.drug]);

  useEffect(() => {
    setContextId(drug?.contexts?.[0]?.id ?? "");
  }, [drug]);

  const hits = query.trim() ? searchDrugs(query, all).slice(0, 6) : [];
  const result = compute({
    drug,
    patient,
    contextId,
    timesPerDay: times,
    concentration: conc,
    prepareMg: prepare,
    adultDose: adult,
    intendedMg: intended,
    intendedTimes,
  });

  const v2 = numOrNull(c1) && numOrNull(v1) && numOrNull(c2) ? dilution(numOrNull(c1)!, numOrNull(v1)!, numOrNull(c2)!) : null;

  function set<K extends keyof Patient>(key: K, value: Patient[K]) {
    setPatient((p) => ({ ...p, [key]: value }));
  }

  function save() {
    if (!drug) return;
    const summary = result.lines[1]?.value ?? result.lines[0]?.value ?? drug.dose;
    saveSnap({
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      drugId: drug.id,
      drugName: drug.name,
      summary: summary.slice(0, 180),
    });
  }

  return (
    <Shell>
      <div className="space-y-5">
        <header>
          <Kicker>Calculator</Kicker>
          <h1 className="mt-1 font-display text-4xl">Check a dose</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Numbers come from the transcribed sheets. Cockcroft–Gault is clearance, not eGFR. Pediatric rules that the
            introduction sheet printed oddly are labeled.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <h2 className="font-display text-2xl">Patient</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Weight (kg)">
                <TextInput inputMode="decimal" value={patient.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
              </Field>
              <Field label="Height (cm)" hint="Only for BSA">
                <TextInput inputMode="decimal" value={patient.heightCm} onChange={(e) => set("heightCm", e.target.value)} />
              </Field>
              <Field label="Age (years)">
                <TextInput inputMode="decimal" value={patient.ageYears} onChange={(e) => set("ageYears", e.target.value)} />
              </Field>
              <Field label="Or age (months)" hint="Used if years is empty">
                <TextInput inputMode="decimal" value={patient.ageMonths} onChange={(e) => set("ageMonths", e.target.value)} />
              </Field>
              <Field label="Sex (Cockcroft–Gault)">
                <Select value={patient.sex} onChange={(e) => set("sex", e.target.value as Patient["sex"])}>
                  <option value="male">Male</option>
                  <option value="female">Female × 0.85</option>
                </Select>
              </Field>
              <Field label="Serum creatinine (mg/dL)">
                <TextInput inputMode="decimal" value={patient.scr} onChange={(e) => set("scr", e.target.value)} />
              </Field>
              <Field label="Hepatic class">
                <Select value={patient.hepatic} onChange={(e) => set("hepatic", e.target.value as Patient["hepatic"])}>
                  <option value="none">Not assessed</option>
                  <option value="A">Child-Pugh A</option>
                  <option value="B">Child-Pugh B</option>
                  <option value="C">Child-Pugh C</option>
                </Select>
              </Field>
            </div>
          </Panel>

          <Panel>
            <h2 className="font-display text-2xl">Drug</h2>
            <div className="mt-3 space-y-3">
              <Field label="Find">
                <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Gentamicin, warfarin, HRZE…" />
              </Field>
              {hits.length > 0 ? (
                <ul className="overflow-hidden rounded-lg border border-line">
                  {hits.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        className="block min-h-11 w-full px-3 py-2 text-left text-sm"
                        onClick={() => {
                          setDrugId(d.id);
                          setQuery("");
                        }}
                      >
                        <span className="font-semibold">{d.name}</span>
                        <span className="text-muted"> · {d.subclass}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <Field label="Selected record">
                <Select value={drugId} onChange={(e) => setDrugId(e.target.value)}>
                  <option value="">Choose a drug</option>
                  {all.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </Field>
              {drug?.contexts?.length ? (
                <Field label="Which printed regimen">
                  <Select value={contextId} onChange={(e) => setContextId(e.target.value)}>
                    {drug.contexts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Doses per day" hint="For daily-total checks">
                  <TextInput inputMode="decimal" value={times} onChange={(e) => setTimes(e.target.value)} />
                </Field>
                <Field label="Adult dose (mg)" hint="Clark, Young, Fried">
                  <TextInput inputMode="decimal" value={adult} onChange={(e) => setAdult(e.target.value)} />
                </Field>
              </div>
            </div>
          </Panel>
        </div>

        <Panel>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Kicker>Result</Kicker>
              <h2 className="font-display text-3xl">{drug ? drug.name : "No drug selected"}</h2>
            </div>
            {drug ? (
              <Link to="/drug/$drugId" params={{ drugId: drug.id }} className="text-sm font-semibold text-teal">
                Open the monograph
              </Link>
            ) : null}
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <Metric label="Age band" value={result.ageLabel ?? "—"} />
            <Metric label="BSA (Mosteller)" value={result.bsa ? `${fmt(result.bsa, 2)} m²` : "—"} />
            <Metric
              label="CrCl (Cockcroft–Gault)"
              value={result.crcl ? `${fmt(result.crcl)} mL/min` : "—"}
            />
          </dl>
          {result.band ? <p className="mt-3 text-sm text-muted">{result.band.label}. {result.band.hint}</p> : null}
          {result.lines.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {result.lines.map((l) => (
                <li key={l.label}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{l.label}</p>
                  <p className="text-base">{l.value}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">Enter a weight, or pick a drug that has a fixed dose only — the sheet text still shows above once a context exists.</p>
          )}
          <div className="mt-4">
            <Flags flags={result.flags} />
          </div>
          <div className="mt-4">
            <Btn type="button" variant="ghost" onClick={save} disabled={!drug}>
              Save this check
            </Btn>
          </div>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <h2 className="font-display text-2xl">Volume</h2>
            <p className="mt-1 text-sm text-muted">Volume (mL) = dose ÷ concentration.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Dose to prepare (mg)">
                <TextInput inputMode="decimal" value={prepare} onChange={(e) => setPrepare(e.target.value)} />
              </Field>
              <Field label="Concentration (mg/mL)">
                <TextInput inputMode="decimal" value={conc} onChange={(e) => setConc(e.target.value)} />
              </Field>
              <Field label="Intended dose (mg)" hint="Compared with the calculated range">
                <TextInput inputMode="decimal" value={intended} onChange={(e) => setIntended(e.target.value)} />
              </Field>
              <Field label="Intended times/day">
                <TextInput inputMode="decimal" value={intendedTimes} onChange={(e) => setIntendedTimes(e.target.value)} />
              </Field>
            </div>
          </Panel>
          <Panel>
            <h2 className="font-display text-2xl">Dilution</h2>
            <p className="mt-1 text-sm text-muted">C1 × V1 = C2 × V2. Solves for final volume.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Field label="C1">
                <TextInput inputMode="decimal" value={c1} onChange={(e) => setC1(e.target.value)} />
              </Field>
              <Field label="V1">
                <TextInput inputMode="decimal" value={v1} onChange={(e) => setV1(e.target.value)} />
              </Field>
              <Field label="C2">
                <TextInput inputMode="decimal" value={c2} onChange={(e) => setC2(e.target.value)} />
              </Field>
            </div>
            <p className="mt-3 text-sm">{v2 != null ? `V2 = ${fmt(v2, 2)} (same volume unit as V1)` : "Enter C1, V1, and C2."}</p>
          </Panel>
        </div>
        <Saved />
        <Disclaimer />
      </div>
    </Shell>
  );
}

function numOrNull(v: string): number | null {
  const n = Number(v);
  return v.trim() && Number.isFinite(n) && n > 0 ? n : null;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper px-3 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 font-display text-2xl">{value}</dd>
    </div>
  );
}

function Saved() {
  const snaps = usePharmacy((s) => s.snaps);
  const remove = usePharmacy((s) => s.removeSnap);
  if (!snaps.length) return null;
  return (
    <Panel>
      <Kicker>Saved on this device</Kicker>
      <ul className="mt-3 space-y-2">
        {snaps.map((s) => (
          <li key={s.id} className="flex items-start justify-between gap-3 text-sm">
            <span>
              <span className="font-semibold">{s.drugName}</span>
              <span className="text-muted"> — {s.summary}</span>
            </span>
            <button type="button" className="text-teal" onClick={() => remove(s.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
