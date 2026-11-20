import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Disclaimer, Kicker, Panel, Pill } from "@/components/bits";
import { Shell } from "@/components/shell";
import { DRUGS } from "@/data/drugs";
import {
  ASTHMA_PEF,
  FDC,
  FORMULAS,
  HEPATIC_BANDS,
  HEPATIC_ROWS,
  MNEMONICS,
  RENAL_BANDS,
  RENAL_ROWS,
  ROUTES,
  SHEETS,
  TB_REGIMENS,
  TOXICITY,
} from "@/data/knowledge";

export const Route = createFileRoute("/reference")({ component: ReferencePage });

const TABS = ["Review", "Renal", "Hepatic", "Formulas", "Memory"] as const;
type Tab = (typeof TABS)[number];

function ReferencePage() {
  const [tab, setTab] = useState<Tab>("Review");
  const conflicts = DRUGS.filter((d) => d.conflict);

  return (
    <Shell>
      <div className="space-y-5">
        <header>
          <Kicker>Reference</Kicker>
          <h1 className="mt-1 font-display text-4xl">How the sheets were read</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Same drug, different card, different number. The review keeps both instead of inventing a compromise.
          </p>
        </header>
        <div className="flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <Pill key={t} active={tab === t} onClick={() => setTab(t)}>
              {t}
            </Pill>
          ))}
        </div>

        {tab === "Review" ? (
          <div className="space-y-3">
            {conflicts.map((d) => (
              <Panel key={d.id}>
                <Link to="/drug/$drugId" params={{ drugId: d.id }} className="font-display text-2xl text-ink">
                  {d.name}
                </Link>
                <p className="mt-2 text-sm">{d.conflict}</p>
              </Panel>
            ))}
            <Panel>
              <Kicker>Fried’s rule</Kicker>
              <p className="mt-2 text-sm">
                The introduction sheet prints Fried as age in years ÷ 150 × adult dose. Classical Fried uses age in
                months. The calculator offers both and names which one you are looking at. Clark is printed as weight
                in kg ÷ 150; the milligram answer multiplies that fraction by the adult dose you enter.
              </p>
            </Panel>
            <Panel>
              <Kicker>Magnesium is three drugs in one box</Kicker>
              <p className="mt-2 text-sm">
                Torsades 2 g over 1–2 min, severe asthma 2 g over 20 min, and eclampsia 4 g then 1–2 g/h are all
                printed. They are separate contexts, not a range.
              </p>
            </Panel>
            <Panel>
              <Kicker>Sources</Kicker>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2 text-sm">
                {SHEETS.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Panel>
          </div>
        ) : null}

        {tab === "Renal" ? (
          <div className="space-y-3">
            <Panel>
              <p className="text-sm">
                CrCl (mL/min) = ((140 − age) × weight kg) ÷ (72 × creatinine mg/dL) × 0.85 if female. Bands below are
                the sheet’s eGFR cut-points. The calculator stages Cockcroft–Gault with those cut-points and says so.
              </p>
              <table className="mt-4 w-full text-left text-sm">
                <tbody>
                  {RENAL_BANDS.map((r) => (
                    <tr key={r.label} className="border-t border-line">
                      <th className="py-2 pr-3 font-semibold">{r.label}</th>
                      <td className="py-2 pr-3">{r.range}</td>
                      <td className="py-2 text-muted">{r.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Table rows={RENAL_ROWS} a="Drug" b="Printed adjustment" />
          </div>
        ) : null}

        {tab === "Hepatic" ? (
          <div className="space-y-3">
            <Panel>
              <table className="w-full text-left text-sm">
                <tbody>
                  {HEPATIC_BANDS.map((r) => (
                    <tr key={r.label} className="border-t border-line">
                      <th className="py-2 pr-3 font-semibold">{r.label}</th>
                      <td className="py-2 pr-3">{r.score}</td>
                      <td className="py-2 text-muted">{r.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Table rows={HEPATIC_ROWS} a="Drug" b="Printed adjustment" />
            <Panel>
              <Kicker>Watch for toxicity</Kicker>
              <ul className="mt-2 space-y-2 text-sm">
                {TOXICITY.map(([k, v]) => (
                  <li key={k}>
                    <span className="font-semibold">{k}. </span>
                    {v}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        ) : null}

        {tab === "Formulas" ? (
          <div className="space-y-3">
            {FORMULAS.map((f) => (
              <Panel key={f.name}>
                <h2 className="font-display text-2xl">{f.name}</h2>
                <p className="mt-2 text-sm font-semibold">{f.expr}</p>
                <p className="mt-1 text-sm text-muted">{f.note}</p>
              </Panel>
            ))}
            <Panel>
              <Kicker>Routes and onset, as printed</Kicker>
              <table className="mt-3 w-full text-left text-sm">
                <tbody>
                  {ROUTES.map(([route, onset, bio]) => (
                    <tr key={route} className="border-t border-line">
                      <th className="py-2 pr-3 font-semibold">{route}</th>
                      <td className="py-2 pr-3">{onset}</td>
                      <td className="py-2 text-muted">{bio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel>
              <Kicker>Loading and maintenance</Kicker>
              <p className="mt-2 text-sm">
                Loading dose = Vd × desired plasma concentration. Maintenance = clearance × desired plasma
                concentration. The sheets print the formulas and do not give Vd or clearance per drug, so those are
                not calculated here.
              </p>
            </Panel>
          </div>
        ) : null}

        {tab === "Memory" ? (
          <div className="space-y-3">
            {MNEMONICS.map((m) => (
              <Panel key={m.code}>
                <h2 className="font-display text-2xl">{m.code}</h2>
                <p className="mt-2 text-sm">{m.text}</p>
              </Panel>
            ))}
            <Panel>
              <Kicker>Tuberculosis regimens</Kicker>
              {TB_REGIMENS.map((r) => (
                <div key={r.title} className="mt-3">
                  <p className="font-semibold">{r.title}</p>
                  <ul className="mt-1 text-sm text-muted">
                    {r.lines.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="mt-3 text-sm">Fixed-dose tablets printed: {FDC.join(" · ")}.</p>
            </Panel>
            <Panel>
              <Kicker>Asthma PEF</Kicker>
              <ul className="mt-2 text-sm">
                {ASTHMA_PEF.map(([a, b]) => (
                  <li key={a}>
                    {a}: {b}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        ) : null}
        <Disclaimer />
      </div>
    </Shell>
  );
}

function Table({ rows, a, b }: { rows: string[][]; a: string; b: string }) {
  return (
    <Panel className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-muted">
            <th className="pb-2 pr-3 font-semibold">{a}</th>
            <th className="pb-2 font-semibold">{b}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-line">
              <th className="py-2 pr-3 font-semibold">{r[0]}</th>
              <td className="py-2">{r[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
