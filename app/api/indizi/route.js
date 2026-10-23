import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { readState, updateState } from "@/lib/store";

export const dynamic = "force-dynamic";

function ordina(lista) {
  return lista.slice().sort((a, b) => (a.dataCreazione < b.dataCreazione ? -1 : 1));
}

// Lista "Indizi": voci semplici che il docente scrive e modifica da solo,
// senza alcuna logica automatica dietro (niente scadenze, niente fasce).
export async function GET() {
  const state = await readState();
  return NextResponse.json({ indizi: ordina(state.indizi || []) });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const testo = typeof body?.testo === "string" ? body.testo.trim().slice(0, 300) : "";
  if (!testo) return NextResponse.json({ error: "Testo mancante" }, { status: 400 });
  const voce = { id: randomUUID(), testo, fatto: false, dataCreazione: new Date().toISOString() };
  const state = await updateState((s) => {
    if (!Array.isArray(s.indizi)) s.indizi = [];
    s.indizi.push(voce);
    return s;
  });
  return NextResponse.json({ indizi: ordina(state.indizi) }, { status: 201 });
}
