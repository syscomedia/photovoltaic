"use client";

/** Ligne électrique de transition entre sections — un pulse la parcourt en continu. */
export default function Surge() {
  return (
    <div className="surge" aria-hidden="true">
      <span className="surge-line" />
      <span className="surge-pulse" />
    </div>
  );
}
