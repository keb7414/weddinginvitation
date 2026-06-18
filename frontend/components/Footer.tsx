import { wedding } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-sand px-7 py-10 text-center">
      <p className="text-sm tracking-[0.15em] text-ink">
        {wedding.groom.name} <span className="text-point">·</span> {wedding.bride.name}
      </p>
      <p className="mt-3 text-[11px] text-muted">
        {wedding.date.year}. {String(wedding.date.month).padStart(2, "0")}.{" "}
        {String(wedding.date.day).padStart(2, "0")}
      </p>
      <p className="mt-6 text-[10px] tracking-wider text-muted/70">
        Mobile Wedding Invitation
      </p>
    </footer>
  );
}
