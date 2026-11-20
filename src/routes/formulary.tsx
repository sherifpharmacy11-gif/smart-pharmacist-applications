import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Btn, Disclaimer, Field, Kicker, Panel, Pill, TextInput, Area } from "@/components/bits";
import { Shell } from "@/components/shell";
import { DRUGS, searchDrugs } from "@/data/drugs";
import { CATEGORIES, categoryLabel, type CategoryId, type Drug } from "@/data/types";
import { parseDosingNote } from "@/lib/parse";
import { usePharmacy } from "@/lib/store";

export const Route = createFileRoute("/formulary")({ component: FormularyPage });

function FormularyPage() {
  const hash = useRouterState({ select: (s) => s.location.hash.replace(/^#/, "") });
  const custom = usePharmacy((s) => s.custom);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [highOnly, setHighOnly] = useState(false);
  const [paste, setPaste] = useState("");
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [max, setMax] = useState("");
  const [notes, setNotes] = useState("");
  const addCustom = usePharmacy((s) => s.addCustom);

  useEffect(() => {
    if (CATEGORIES.some((c) => c.id === hash) || hash === "custom") setCat(hash);
  }, [hash]);

  const all = useMemo(() => [...custom, ...DRUGS], [custom]);
  const shown = useMemo(() => {
    let list = all;
    if (cat !== "all") list = list.filter((d) => d.category === cat);
    if (highOnly) list = list.filter((d) => d.highRisk);
    return searchDrugs(q, list);
  }, [all, cat, highOnly, q]);

  function ingest() {
    const parsed = parseDosingNote(paste);
    if (!parsed) return;
    setName(parsed.name);
    setDose(parsed.dose);
    setMax(parsed.max ?? "");
    setNotes(parsed.notes ?? "");
  }

  function saveCustom() {
    if (name.trim().length < 2 || dose.trim().length < 2) return;
    const drug: Drug = {
      id: `custom-${crypto.randomUUID()}`,
      name: name.trim(),
      category: "custom",
      subclass: "Added on this device",
      dose: dose.trim(),
      max: max.trim() || undefined,
      notes: notes.trim() || undefined,
      source: "This device",
    };
    addCustom(drug);
    setName("");
    setDose("");
    setMax("");
    setNotes("");
    setPaste("");
    setCat("custom");
  }

  return (
    <Shell>
      <div className="space-y-5">
        <header>
          <Kicker>Formulary</Kicker>
          <h1 className="mt-1 font-display text-4xl">Drug records</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {shown.length} shown. Illustrated posters were not run through OCR — the doses were read and structured,
            because cartoon labels OCR poorly. You can still paste a dosing note below.
          </p>
        </header>
        <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, indication, mnemonic" aria-label="Filter drugs" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Pill active={cat === "all" && !highOnly} onClick={() => { setCat("all"); setHighOnly(false); }}>
            All
          </Pill>
          <Pill active={highOnly} onClick={() => setHighOnly((v) => !v)}>
            High-risk
          </Pill>
          {CATEGORIES.map((c) => (
            <Pill key={c.id} active={cat === c.id && !highOnly} onClick={() => { setCat(c.id); setHighOnly(false); }}>
              {c.label}
            </Pill>
          ))}
          <Pill active={cat === "custom"} onClick={() => { setCat("custom"); setHighOnly(false); }}>
            On this device
          </Pill>
        </div>
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-card">
          {shown.length === 0 ? (
            <li className="px-4 py-6 text-sm text-muted">No records in this filter.</li>
          ) : (
            shown.map((d) => (
              <li key={d.id}>
                <Link to="/drug/$drugId" params={{ drugId: d.id }} className="block px-4 py-3">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold">{d.name}</span>
                    {d.highRisk ? <span className="text-xs font-semibold text-danger">High-risk</span> : null}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {categoryLabel(d.category as CategoryId)} · {d.subclass}
                  </span>
                  <span className="mt-1 block text-sm text-ink">{d.dose}</span>
                </Link>
              </li>
            ))
          )}
        </ul>

        <Panel>
          <Kicker>Add a record</Kicker>
          <p className="mt-2 text-sm text-muted">
            Paste a short dosing note. The first line becomes the name. A line containing “dose” becomes the dose.
            Nothing is uploaded.
          </p>
          <div className="mt-3 space-y-3">
            <Area value={paste} onChange={(e) => setPaste(e.target.value)} placeholder={"Cetirizine\nDose: 10 mg once daily\nMax: 10 mg/day"} />
            <Btn type="button" variant="ghost" onClick={ingest}>
              Read the note
            </Btn>
            <Field label="Name">
              <TextInput value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Dose">
              <TextInput value={dose} onChange={(e) => setDose(e.target.value)} />
            </Field>
            <Field label="Maximum">
              <TextInput value={max} onChange={(e) => setMax(e.target.value)} />
            </Field>
            <Field label="Notes">
              <Area value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Field>
            <Btn type="button" onClick={saveCustom}>
              Save on this device
            </Btn>
          </div>
        </Panel>
        <Disclaimer />
      </div>
    </Shell>
  );
}
