import { Link, useRouterState } from "@tanstack/react-router";
import { AlertTriangle, BookOpen, Calculator, Home, Library } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { usePharmacy } from "@/lib/store";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/", label: "Desk", icon: Home },
  { to: "/formulary", label: "Formulary", icon: Library },
  { to: "/calculate", label: "Calculate", icon: Calculator },
  { to: "/emergency", label: "Emergency", icon: AlertTriangle },
  { to: "/reference", label: "Reference", icon: BookOpen },
] as const;

function Brand() {
  return (
    <Link to="/" className="block">
      <span className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal text-on-teal">
          <span className="relative block h-4 w-4">
            <span className="absolute inset-x-0 top-1.5 h-1 bg-on-teal" />
            <span className="absolute inset-y-0 left-1.5 w-1 bg-on-teal" />
          </span>
        </span>
        <span>
          <span className="block font-display text-lg leading-none text-ink">Smart Pharmacist</span>
          <span className="text-xs text-muted">Dose & clinical calculator</span>
        </span>
      </span>
    </Link>
  );
}

function NavLinks({ onDark = false }: { onDark?: boolean }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold",
              active ? "bg-teal text-on-teal" : onDark ? "text-ink" : "text-ink",
              !active && "hover:bg-paper-2",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  useEffect(() => {
    void usePharmacy.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto flex w-full max-w-6xl">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-8 border-r border-line bg-card px-4 py-6 md:flex">
          <Brand />
          <NavLinks />
          <p className="mt-auto text-xs leading-relaxed text-muted">
            19 study sheets, read into one formulary. For learning and checking — not for unsupervised prescribing.
          </p>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-line bg-card px-4 py-3 md:hidden">
            <Brand />
          </header>
          <div className="px-4 py-5 pb-28 sm:px-6 md:pb-10">{children}</div>
        </div>
      </div>
      <nav className="dock fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-card md:hidden">
        {NAV.map((item) => (
          <MobileItem key={item.to} to={item.to} label={item.label} icon={item.icon} />
        ))}
      </nav>
    </div>
  );
}

function MobileItem({
  to,
  label,
  icon: Icon,
}: {
  to: (typeof NAV)[number]["to"];
  label: string;
  icon: (typeof NAV)[number]["icon"];
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = to === "/" ? path === "/" : path.startsWith(to);
  return (
    <Link
      to={to}
      className={cn(
        "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-semibold",
        active ? "text-teal" : "text-muted",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label === "Formulary" ? "Drugs" : label === "Reference" ? "Review" : label === "Calculate" ? "Dose" : label}
    </Link>
  );
}
