"use client";

import React, { useState, useEffect, useRef } from "react";

interface Ticket {
  id: number;
  room: string;
  category: string;
  request: string;
  priority: "NORMAL" | "URGENT";
  status: string;
  time: string;
  timestamp?: string;
}

export default function StaffDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousTicketCountRef = useRef(0);

  // Synthétiseur audio natif (Web Audio API) façon carillon d'hôtel
  const playHotelChime = (isUrgent: boolean) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();

      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      if (isUrgent) {
        // Double bip aigu pour urgence
        playTone(880, 0, 0.25);
        playTone(1174, 0.15, 0.4);
      } else {
        // Carillon mélodieux 2 notes (Sol -> Do)
        playTone(587.33, 0, 0.4);
        playTone(880, 0.25, 0.6);
      }
    } catch {
      // Ignorer si le navigateur bloque l'autoplay audio
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/tickets`);
      if (res.ok) {
        const data = await res.json();
        const newTickets: Ticket[] = data.tickets || [];

        // Si de nouveaux tickets sont arrivés, déclencher l'alerte sonore
        if (newTickets.length > previousTicketCountRef.current && previousTicketCountRef.current > 0) {
          const newest = newTickets[0];
          playHotelChime(newest?.priority === "URGENT");
        }
        previousTicketCountRef.current = newTickets.length;
        setTickets(newTickets);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Kenzi Tower - Console Réception & Étage</h1>
            <p className="text-sm text-slate-400">Centre d'alerte et suivi en direct</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bouton activer/couper le son */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playHotelChime(false);
              }}
              className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer flex items-center gap-1.5 ${
                soundEnabled
                  ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }`}
            >
              <span>{soundEnabled ? "🔔 Son activé" : "🔕 Son muet"}</span>
            </button>

            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sync (3s)
            </span>
          </div>
        </header>

        {tickets.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            Aucune demande de service pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((t) => {
              const isUrgent = t.priority === "URGENT";
              return (
                <div
                  key={t.id}
                  className={`border rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg transition ${
                    isUrgent
                      ? "bg-red-950/20 border-red-500/50 shadow-red-900/10"
                      : "bg-slate-900 border-slate-800 shadow-slate-950"
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-base font-bold text-white bg-slate-800 px-3 py-0.5 rounded border border-slate-700">
                        Chambre {t.room}
                      </span>

                      {isUrgent && (
                        <span className="text-xs text-red-400 font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 animate-pulse">
                          🚨 PRIORITÉ HAUTE
                        </span>
                      )}

                      <span className="text-xs text-amber-400 font-medium px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                        {t.category}
                      </span>
                      <span className="text-xs text-slate-500">{t.time}</span>
                    </div>

                    <p className="text-slate-200 text-sm italic">« {t.request} »</p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <span
                      className={`text-xs px-3 py-1 rounded font-medium ${
                        t.status === "En attente"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : t.status === "En cours"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {t.status}
                    </span>

                    {t.status === "En attente" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(t.id, "En cours")}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition cursor-pointer"
                      >
                        Prendre en charge
                      </button>
                    )}

                    {t.status === "En cours" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(t.id, "Traité")}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded transition cursor-pointer"
                      >
                        Terminer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}