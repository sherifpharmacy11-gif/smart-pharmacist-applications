import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Trash2 } from "lucide-react";
import { Btn, Disclaimer, Kicker, Panel } from "@/components/bits";
import { Shell } from "@/components/shell";
import { getBuiltInDrug } from "@/data/drugs";
import { categoryLabel } from "@/data/types";
import { usePharmacy } from "@/lib/store";
import { useEffect } from "react";

export const Route = createFileRoute("/drug/$drugId")({ component: DrugPage });

function DrugPage() {
  const { drugId } = Route.useParams();
  const custom = usePharmacy((s) => s.custom);
  const drug = getBuiltInDrug(drugId) ?? custom.find((d) => d.id === drugId);
  const fav = usePharmacy((s) => s.favorites.includes(drugId));
  const toggle = usePharmacy((s) => s.toggleFavorite);
  const remove = usePharmacy((s) => s.removeCustom);
  const touch = usePharmacy((s) => s.touchRecent);

  useEffect(() => {
    if (drug) touch(drug.id);
  }, [drug, touch]);

  if (!drug) {
    return (
      <Shell>
        <Panel>
          <h1 className="font-display text-3xl">Record not found</h1>
          <p className="mt-2 text-sm text-muted">That drug is not in the formulary on this device.</p>
          <Link to="/formulary" className="mt-4 inline-block font-semibold text-teal">
            Back to the formulary
          </Link>
        </Panel>
      </Shell>
    );
  }

  const rows = [
    ["Dose", drug.dose],
    ["Pediatric", drug.pediatric],
    ["Maximum", drug.max],
    ["Route", drug.route],
    ["Frequency", drug.frequency],
    ["Monitoring", drug.monitoring],
    ["Adverse effects", drug.adverse],
    ["Renal", drug.renal],
    ["Hepatic", drug.hepatic],
    ["Mnemonic", drug.mnemonic],
    ["Notes", drug.notes],
  ].filter(([, v]) => v);

  return (
    <Shell>
      <div className="space-y-4">
        <header className="flex items-start justify-between gap-3">
          <div>
            <Kicker>{categoryLabel(drug.category)} · {drug.subclass}</Kicker>
            <h1 className="mt-1 font-display text-4xl">{drug.name}</h1>
            {drug.aliases?.length ? <p className="mt-1 text-sm text-muted">Also called {drug.aliases.join(", ")}</p> : null}
          </div>
          <button
            type="button"
            aria-pressed={fav}
            onClick={() => toggle(drug.id)}
            className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-card"
          >
            <Star className={fav ? "h-4 w-4 fill-teal text-teal" : "h-4 w-4 text-ink"} aria-hidden />
            <span className="sr-only">Favorite</span>
          </button>
        </header>
        {drug.highRisk ? (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
            High-risk record. Small dose errors on this list cause serious harm.
          </p>
        ) : null}
        {drug.conflict ? (
          <Panel className="bg-amber-soft">
            <Kicker>Sheets disagree</Kicker>
            <p className="mt-2 text-sm text-ink">{drug.conflict}</p>
          </Panel>
        ) : null}
        <Panel>
          <dl className="space-y-4">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{k}</dt>
                <dd className="mt-1 text-base text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          {drug.indications?.length ? (
            <p className="mt-4 text-sm text-muted">Uses on the sheet: {drug.indications.join(" · ")}</p>
          ) : null}
          {drug.contexts?.length ? (
            <ul className="mt-4 space-y-3 border-t border-line pt-4">
              {drug.contexts.map((c) => (
                <li key={c.id}>
                  <p className="font-semibold">{c.label}</p>
                  <p className="text-sm text-muted">{c.detail}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
        <p className="text-xs text-muted">Source sheets: {drug.source}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/calculate"
            search={{ drug: drug.id }}
            className="inline-flex min-h-11 items-center rounded-lg bg-teal px-4 text-sm font-semibold text-on-teal"
          >
            Calculate this dose
          </Link>
          {drug.category === "custom" ? (
            <Btn type="button" variant="danger" onClick={() => remove(drug.id)}>
              <Trash2 className="h-4 w-4" aria-hidden /> Remove
            </Btn>
          ) : null}
        </div>
        <Disclaimer />
      </div>
    </Shell>
  );
}
