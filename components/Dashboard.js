"use client";

import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import CaptureBar from "./CaptureBar";
import HomeScreen from "./screens/HomeScreen";
import ScuolaScreen from "./screens/ScuolaScreen";
import SaluteScreen from "./screens/SaluteScreen";
import FinanzeScreen from "./screens/FinanzeScreen";
import ReviewScreen from "./screens/ReviewScreen";
import IndiziScreen from "./screens/IndiziScreen";
import PosizioneScreen from "./screens/PosizioneScreen";
import ImpostazioniScreen from "./screens/ImpostazioniScreen";

export default function Dashboard() {
  const [active, setActive] = useState("home");

  // Il collegamento Google Calendar passa da un redirect del server (vedi
  // app/api/google-calendar/callback): torna qui con
  // ?schermata=home&googleCalendar=connesso (o "negato"/"errore"). Si legge
  // una sola volta all'avvio e si pulisce subito l'URL.
  const [googleCalendarEsito, setGoogleCalendarEsito] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const schermata = params.get("schermata");
    const googleCalendar = params.get("googleCalendar");
    if (schermata) setActive(schermata);
    if (googleCalendar) setGoogleCalendarEsito(googleCalendar);
    if (schermata || googleCalendar) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  return (
    <>
      <TopBar active={active} onChange={setActive} />
      <div className="app">
        {active === "home" && <HomeScreen googleCalendarEsito={googleCalendarEsito} />}
        {active === "scuola" && <ScuolaScreen />}
        {active === "salute" && <SaluteScreen />}
        {active === "finanze" && <FinanzeScreen />}
        {active === "review" && <ReviewScreen />}
        {active === "indizi" && <IndiziScreen />}
        {active === "posizione" && <PosizioneScreen />}
        {active === "impostazioni" && <ImpostazioniScreen />}
      </div>
      <CaptureBar />
    </>
  );
}
