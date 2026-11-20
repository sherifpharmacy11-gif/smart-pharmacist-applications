import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Disclaimer, Kicker, Panel } from "@/components/bits";
import { Shell } from "@/components/shell";
import { DRUGS, searchDrugs } from "@/data/drugs";
import { CATEGORIES } from "@/data/types";
import { SHEETS } from "@/data/knowledge";
import { usePharmacy } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [q, setQ] = useState("");
  const custom = usePharmacy((s) => s.custom);
  const snaps = usePharmacy((s) => s.snaps);
  const all = useMemo(() => [...custom, ...DRUGS], [custom]);
  const hits = q.trim() ? searchDrugs(q, all).slice(0, 6) : [];
  const conflicts = DRUGS.filter((d) => d.conflict).length;
  const highRisk = DRUGS.filter((d) => d.highRisk).length;

  return (
    <Shell>
      <div className="space-y-6">
        <header className="max-w-3xl">
          <Kicker>Formulary from the attached sheets</Kicker>
          <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">Smart Pharmacist</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">
            تمت قراءة ١٩ لوحة جرعات وتحويلها إلى سجلات يمكن البحث فيها وحسابها. Where two sheets print
            different numbers, both are kept and labeled.
          </p>
        </header>

        <div className="relative max-w-2xl">
          <label className="sr-only" htmlFor="desk-search">
            Search drugs
          </label>
          <input
            id="desk-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a drug, class, or mnemonic"
            className="min-h-12 w-full rounded-lg border border-line bg-card px-4 text-ink"
          />
          {q.trim() ? (
            <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-line bg-card">
              {hits.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted">Nothing in the formulary matches that.</p>
              ) : (
                hits.map((d) => (
                  <Link
                    key={d.id}
                    to="/drug/$drugId"
                    params={{ drugId: d.id }}
                    className="block border-b border-line px-4 py-3 last:border-b-0"
                  >
                    <span className="block font-semibold">{d.name}</span>
                    <span className="text-sm text-muted">{d.subclass}</span>
                  </Link>
                ))
              )}
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat n={String(DRUGS.length)} label="Structured records" />
          <Stat n={String(highRisk)} label="Marked high-risk" />
          <Stat n={String(conflicts)} label="Sheets that disagree" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <Jump to="/calculate" title="Calculate a dose" text="Weight, clearance, volume, and the sheet maximum." emphasis />
          <Jump to="/emergency" title="Emergency board" text="Arrest, anaphylaxis, status, and overdose — separated." />
          <Jump to="/reference" title="Where sheets differ" text="Penicillin, furosemide, Fried’s rule, ibuprofen, and the rest." />
        </div>

        <Panel>
          <Kicker>Browse by class</Kicker>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link
                  to="/formulary"
                  hash={c.id}
                  className="flex items-center justify-between rounded-lg border border-line px-3 py-3"
                >
                  <span>
                    <span className="block font-semibold">{c.label}</span>
                    <span className="text-sm text-muted">{c.blurb}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-teal" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        {snaps.length > 0 ? (
          <Panel>
            <Kicker>Saved checks</Kicker>
            <ul className="mt-3 space-y-2">
              {snaps.slice(0, 4).map((s) => (
                <li key={s.id} className="text-sm">
                  <span className="font-semibold">{s.drugName}</span>
                  <span className="text-muted"> — {s.summary}</span>
                </li>
              ))}
            </ul>
          </Panel>
        ) : null}

        <Panel>
          <Kicker>What was read</Kicker>
          <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {SHEETS.map((s) => (
              <li key={s} className="text-sm text-ink">
                {s}
              </li>
            ))}
          </ul>
        </Panel>
        <Disclaimer />
      </div>
    </Shell>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-lg border border-line bg-card px-4 py-3">
      <p className="font-display text-3xl text-ink">{n}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

function Jump({
  to,
  title,
  text,
  emphasis = false,
}: {
  to: "/calculate" | "/emergency" | "/reference";
  title: string;
  text: string;
  emphasis?: boolean;
}) {
  return (
    <Link
      to={to}
      className={
        emphasis
          ? "rounded-lg border border-teal bg-teal px-4 py-4 text-on-teal"
          : "rounded-lg border border-line bg-card px-4 py-4 text-ink"
      }
    >
      <span className="block font-display text-2xl">{title}</span>
      <span className={emphasis ? "mt-1 block text-sm opacity-90" : "mt-1 block text-sm text-muted"}>{text}</span>
    </Link>
  );
}
