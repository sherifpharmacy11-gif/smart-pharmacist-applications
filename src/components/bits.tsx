import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import type { Flag } from "@/lib/calc";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("rounded-lg border border-line bg-card p-4 sm:p-5", className)}>{children}</section>;
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-teal">{children}</p>;
}

export function Btn({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-50",
        variant === "primary" && "bg-teal text-on-teal",
        variant === "ghost" && "border border-line bg-card text-ink",
        variant === "danger" && "bg-danger text-on-teal",
        className,
      )}
      {...props}
    />
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

const control = "min-h-11 w-full rounded-lg border border-line bg-card px-3 text-ink";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, props.className)} />;
}

export function Area(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, "min-h-28 py-2", props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(control, props.className)} />;
}

export function Pill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full border px-3 text-sm font-medium",
        active ? "border-teal bg-teal text-on-teal" : "border-line bg-card text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function Flags({ flags }: { flags: Flag[] }) {
  if (!flags.length) return null;
  return (
    <ul className="space-y-2">
      {flags.map((f, i) => (
        <li
          key={`${f.tone}-${i}`}
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            f.tone === "stop" && "bg-danger-soft text-danger",
            f.tone === "warn" && "bg-amber-soft text-amber",
            f.tone === "info" && "bg-teal-soft text-teal",
          )}
        >
          {f.text}
        </li>
      ))}
    </ul>
  );
}

export function Disclaimer() {
  return (
    <p className="text-sm text-muted">
      Educational transcription of the attached study sheets. Not a prescription, protocol, or product label.
      Sheets disagree in places — those disagreements are shown, not averaged. Verify every dose with a current
      formulary and a licensed clinician.
    </p>
  );
}
