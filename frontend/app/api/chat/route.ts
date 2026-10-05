import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const backendRes = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      throw new Error(`Backend error: ${backendRes.status}`);
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    // Réponse de secours en cas d'indisponibilité du backend
    return NextResponse.json({
      reply: "Bienvenue au Kenzi Tower Hotel ! Le réseau Wi-Fi est 'Kenzi-Guest' (sans mot de passe). Pour le room service ou la réception, composez le 9 depuis votre chambre.",
    });
  }
}
