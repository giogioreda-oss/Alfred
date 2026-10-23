"use client";

import { useEffect, useState } from "react";

// Mostra una mappa centrata sulla posizione attuale del browser. Non serve
// nessuna chiave API: usa la geolocalizzazione del dispositivo e una mappa
// incorporata di Google Maps (lo stesso meccanismo pubblico usato dal link
// "Apri su Google Maps" in Calendario).
export default function PosizioneCard() {
  const [stato, setStato] = useState("in-corso"); // in-corso | ok | negato | non-supportato
  const [coord, setCoord] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStato("non-supportato");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoord({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStato("ok");
      },
      () => setStato("negato"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <section id="section-posizione" className="card span-4">
      <h3>Posizione</h3>

      {stato === "in-corso" && <p className="review-hint">Rilevamento della posizione in corso…</p>}
      {stato === "non-supportato" && (
        <p className="review-hint">Il browser non supporta la geolocalizzazione.</p>
      )}
      {stato === "negato" && (
        <p className="review-hint">
          Permesso di geolocalizzazione negato. Consenti l'accesso alla posizione dal browser per vedere la mappa.
        </p>
      )}

      {stato === "ok" && coord && (
        <>
          <div className="posizione-mappa">
            <iframe
              title="Mappa posizione attuale"
              src={`https://maps.google.com/maps?q=${coord.lat},${coord.lng}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            className="posizione-link"
            href={`https://www.google.com/maps/search/?api=1&query=${coord.lat},${coord.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            Apri su Google Maps ↗
          </a>
        </>
      )}
    </section>
  );
}
