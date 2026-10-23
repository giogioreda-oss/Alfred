import { NextResponse } from "next/server";
import { updateState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  let trovato = false;
  const state = await updateState((s) => {
    const voce = (s.indizi || []).find((x) => x.id === id);
    if (!voce) return s;
    trovato = true;
    if (typeof body?.testo === "string") voce.testo = body.testo.trim().slice(0, 300);
    if (typeof body?.fatto === "boolean") voce.fatto = body.fatto;
    return s;
  });
  if (!trovato) return NextResponse.json({ error: "Indizio non trovato" }, { status: 404 });
  return NextResponse.json({ indizi: state.indizi });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const state = await updateState((s) => {
    s.indizi = (s.indizi || []).filter((x) => x.id !== id);
    return s;
  });
  return NextResponse.json({ indizi: state.indizi });
}
