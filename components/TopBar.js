"use client";

import { useEffect, useState } from "react";

const SCREENS = [
  { id: "home", label: "Home" },
  { id: "scuola", label: "Scuola" },
  { id: "salute", label: "Salute" },
  { id: "finanze", label: "Finanze" },
];

const SCREENS_DOPO_SVAGO = [
  { id: "indizi", label: "Indizi" },
  { id: "review", label: "Review" },
];

// Scala di colori della fiamma: più la serie di giorni consecutivi è lunga, più
// si "accende" — dal bianco spento (0 giorni), passando per gli azzurri e il
// blu, fino al viola per una serie molto lunga.
function coloreFiamma(streak) {
  if (streak <= 0) return "#e4e7ec"; // spenta, quasi bianca
  if (streak <= 2) return "#bcd9f5"; // azzurro chiarissimo
  if (streak <= 6) return "#7ab3ea"; // azzurro
  if (streak <= 13) return "#4a86d8"; // blu
  if (streak <= 29) return "#3a5fc4"; // blu intenso
  return "#7a4ac4"; // viola: la serie più lunga
}

// Saluto, ora e serie di giorni consecutivi vivono qui, nella barra in alto —
// non più in una card a parte nella Home: niente riquadro, solo testo a fianco.
// Al posto del logo "PersonalOS" c'è la fiamma animata con il numero di giorni
// di fila dentro: cambia colore da sola via via che la serie si allunga.
export default function TopBar({ active, onChange }) {
  const [now, setNow] = useState(null);
  const [profilo, setProfilo] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/operator")
      .then((r) => r.json())
      .then(setProfilo)
      .catch(() => setProfilo(null));
  }, []);

  const saluto = now
    ? now.getHours() < 6
      ? "Buonanotte"
      : now.getHours() < 13
      ? "Buongiorno"
      : now.getHours() < 18
      ? "Buon pomeriggio"
      : "Buonasera"
    : "";
  const ora = now ? now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "--:--";
  const streak = profilo?.streak ?? 0;

  return (
    <div id="topbar">
      <div className="app topbar-inner">
        <div
          className="topbar-fiamma"
          style={{ background: coloreFiamma(streak) }}
          title={`${streak} ${streak === 1 ? "giorno di fila" : "giorni di fila"}`}
        >
          <span className="topbar-fiamma-num">{streak}</span>
        </div>

        {profilo && now && (
          <div className="topbar-saluto">
            <span className="topbar-saluto-testo">{saluto}, signore</span>
            <span className="topbar-ora">{ora}</span>
            <span className="topbar-sfera" aria-hidden="true" />
          </div>
        )}

        <nav>
          {SCREENS.map((s) => (
            <button
              key={s.id}
              className={active === s.id ? "active" : ""}
              onClick={() => onChange(s.id)}
            >
              {s.label}
            </button>
          ))}

          {SCREENS_DOPO_SVAGO.map((s) => (
            <button
              key={s.id}
              className={active === s.id ? "active" : ""}
              onClick={() => onChange(s.id)}
            >
              {s.label}
            </button>
          ))}

          <button
            type="button"
            className={`topbar-impostazioni ${active === "impostazioni" ? "active" : ""}`}
            onClick={() => onChange("impostazioni")}
            title="Impostazioni"
            aria-label="Impostazioni"
          >
            ⚙
          </button>
        </nav>
      </div>
    </div>
  );
}
