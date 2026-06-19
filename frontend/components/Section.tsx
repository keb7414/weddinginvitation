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
  soft = false,
}: {
  en?: string;
  ko?: string;
  soft?: boolean;
}) {
  return (
    <div className="mb-8 text-center">
      {en && (
        <p className="mb-1 font-script text-xl leading-none text-point">{en}</p>
      )}
      {ko && (
        <h2
          className={
            soft
              ? "text-sm tracking-[0.1em] text-point"
              : "text-lg tracking-[0.2em] text-ink"
          }
        >
          {ko}
        </h2>
      )}
      {!soft && <div className="mx-auto mt-4 h-px w-10 bg-point/50" />}
    </div>
  );
}
