"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrGenerator() {
  const [room, setRoom] = useState("1204");
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000");

  const fullUrl = `${baseUrl}/?room=${room}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
        <h1 className="text-xl font-bold text-amber-400 mb-1">Générateur de QR Code Suite</h1>
        <p className="text-xs text-slate-400 mb-6">Kenzi Tower Hotel • Accès Concierge Dédié</p>

        <div className="space-y-4 mb-6 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Numéro de Suite / Chambre
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              URL d'hébergement (ou IP locale)
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl inline-block shadow-inner mb-6 text-slate-950">
          <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-2">
            KENZI TOWER HOTEL
          </p>
          <div className="flex justify-center p-2">
            <QRCodeSVG value={fullUrl} size={180} level="H" />
          </div>
          <p className="text-sm font-black text-slate-900 mt-2">SUITE {room}</p>
          <p className="text-[10px] text-slate-500">Scannez pour ouvrir votre Concierge 24/7</p>
        </div>

        <div>
          <button
            onClick={() => window.print()}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition cursor-pointer"
          >
            Imprimer la carte de chambre
          </button>
        </div>
      </div>
    </div>
  );
}