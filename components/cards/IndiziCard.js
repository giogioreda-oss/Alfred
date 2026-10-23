"use client";

import { useEffect, useState } from "react";

// Lista "Indizi": voci di testo libere, scritte e modificate direttamente dal
// docente. Si aggiunge, si spunta come fatta, si modifica il testo cliccandoci
// sopra, si elimina. Nessuna logica automatica: è una lista sua.
export default function IndiziCard() {
  const [indizi, setIndizi] = useState(null);
  const [testo, setTesto] = useState("");
  const [modificaId, setModificaId] = useState(null);
  const [modificaTesto, setModificaTesto] = useState("");

  function load() {
    fetch("/api/indizi")
      .then((r) => r.json())
      .then((d) => setIndizi(d.indizi || []))
      .catch(() => setIndizi([]));
  }

  useEffect(load, []);

  async function aggiungi(e) {
    e.preventDefault();
    if (!testo.trim()) return;
    const res = await fetch("/api/indizi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testo: testo.trim() }),
    });
    const json = await res.json();
    if (res.ok) {
      setIndizi(json.indizi);
      setTesto("");
    }
  }

  async function alterna(id, fatto) {
    const res = await fetch(`/api/indizi/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fatto: !fatto }),
    });
    const json = await res.json();
    if (res.ok) setIndizi(json.indizi);
  }

  function apriModifica(voce) {
    setModificaId(voce.id);
    setModificaTesto(voce.testo);
  }

  async function salvaModifica(id) {
    const nuovoTesto = modificaTesto.trim();
    setModificaId(null);
    if (!nuovoTesto) return;
    const res = await fetch(`/api/indizi/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testo: nuovoTesto }),
    });
    const json = await res.json();
    if (res.ok) setIndizi(json.indizi);
  }

  async function elimina(id) {
    const res = await fetch(`/api/indizi/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok) setIndizi(json.indizi);
  }

  if (indizi === null) {
    return (
      <section id="section-indizi" className="card span-2">
        <h3>Indizi</h3>
      </section>
    );
  }

  return (
    <section id="section-indizi" className="card span-2">
      <h3>Indizi</h3>
      <form onSubmit={aggiungi} className="scuola-todo-form">
        <input type="text" value={testo} onChange={(e) => setTesto(e.target.value)} placeholder="Scrivi un indizio" />
        <button type="submit">Aggiungi</button>
      </form>
      <div className="scuola-todo-list">
        {indizi.length === 0 && <p className="review-hint">Nessun indizio, per ora.</p>}
        {indizi.map((v) => (
          <div key={v.id} className={`scuola-todo-item${v.fatto ? " fatto" : ""}`}>
            <input type="checkbox" checked={v.fatto} onChange={() => alterna(v.id, v.fatto)} />
            {modificaId === v.id ? (
              <input
                type="text"
                autoFocus
                value={modificaTesto}
                onChange={(e) => setModificaTesto(e.target.value)}
                onBlur={() => salvaModifica(v.id)}
                onKeyDown={(e) => e.key === "Enter" && salvaModifica(v.id)}
              />
            ) : (
              <span style={{ cursor: "pointer" }} onClick={() => apriModifica(v)} title="Clicca per modificare">
                {v.testo}
              </span>
            )}
            <button type="button" className="scuola-todo-elimina" onClick={() => elimina(v.id)} aria-label="Elimina">✕</button>
          </div>
        ))}
      </div>
    </section>
  );
}
