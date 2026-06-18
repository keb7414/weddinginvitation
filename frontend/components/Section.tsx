import { ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`reveal px-7 py-14 ${className}`}>
      {children}
    </section>
  );
}

export function SectionTitle({
  en,
  ko,
}: {
  en?: string;
  ko: string;
}) {
  return (
    <div className="mb-8 text-center">
      {en && (
        <p className="mb-2 text-xs tracking-[0.3em] text-point uppercase">{en}</p>
      )}
      <h2 className="text-lg tracking-[0.2em] text-ink">{ko}</h2>
      <div className="mx-auto mt-4 h-px w-10 bg-point/50" />
    </div>
  );
}
