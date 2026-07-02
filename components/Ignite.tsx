"use client";

/**
 * Découpe un texte en lettres pour un allumage néon décalé,
 * lettre par lettre, quand le parent reçoit la classe .on
 */
export default function Ignite({ text }: { text: string }) {
  return (
    <span className="ignite-wrap" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="ignite-ch"
          style={{ "--i": i } as React.CSSProperties}
          aria-hidden="true"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}
