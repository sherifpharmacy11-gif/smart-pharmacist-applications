import { createFileRoute, Link } from "@tanstack/react-router";
import { Disclaimer, Kicker, Panel } from "@/components/bits";
import { Shell } from "@/components/shell";
import { getBuiltInDrug } from "@/data/drugs";
import { ARREST, ASTHMA_PEF } from "@/data/knowledge";

export const Route = createFileRoute("/emergency")({ component: EmergencyPage });

const GROUPS: { title: string; ids: string[] }[] = [
  { title: "Cardiac", ids: ["adrenaline", "amiodarone", "atropine", "adenosine", "lidocaine", "magnesium-sulfate"] },
  { title: "Respiratory", ids: ["salbutamol", "ipratropium", "hydrocortisone", "magnesium-sulfate"] },
  { title: "Other", ids: ["diazepam", "midazolam", "dextrose-25", "naloxone", "flumazenil"] },
];

function EmergencyPage() {
  return (
    <Shell>
      <div className="space-y-5">
        <header>
          <Kicker>Emergency board</Kicker>
          <h1 className="mt-1 font-display text-4xl">Do not mix the doses</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Adrenaline, magnesium, and amiodarone each have more than one printed regimen. Open the record before you
            use a number.
          </p>
        </header>
        <div className="grid gap-4 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <section key={g.title} className="space-y-3">
              <h2 className="font-display text-2xl">{g.title}</h2>
              {g.ids.map((id) => {
                const drug = getBuiltInDrug(id);
                if (!drug) return null;
                const line = drug.contexts?.[0]?.detail ?? drug.dose;
                return (
                  <Link key={`${g.title}-${id}`} to="/drug/$drugId" params={{ drugId: id }} className="block rounded-lg border border-line bg-card p-4">
                    <span className="block font-semibold">{drug.name}</span>
                    <span className="mt-1 block text-sm text-ink">{line}</span>
                    {drug.contexts && drug.contexts.length > 1 ? (
                      <span className="mt-2 block text-xs font-semibold text-danger">
                        {drug.contexts.length} regimens — open before dosing
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </section>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Panel>
            <Kicker>Cardiac arrest — 5 Hs and 5 Ts</Kicker>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <ul className="space-y-1">{ARREST.hs.map((h) => <li key={h}>{h}</li>)}</ul>
              <ul className="space-y-1">{ARREST.ts.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </Panel>
          <Panel>
            <Kicker>Asthma severity by PEF</Kicker>
            <ul className="mt-3 space-y-2 text-sm">
              {ASTHMA_PEF.map(([range, grade]) => (
                <li key={range} className="flex justify-between gap-3 border-b border-line py-2">
                  <span>{range}</span>
                  <span className="font-semibold">{grade}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <Disclaimer />
      </div>
    </Shell>
  );
}
