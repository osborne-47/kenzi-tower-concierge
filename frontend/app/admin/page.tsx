"use client";

import React, { useState } from "react";

interface HotelConfig {
  id: string;
  name: string;
  logo: string;
  roomCount: number;
}

export default function AdminHotelPanel() {
  const [name, setName] = useState("");
  const [roomCount, setRoomCount] = useState<number>(50);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [hotels, setHotels] = useState<HotelConfig[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<HotelConfig | null>(null);

  // Conversion du logo PNG en DataURL pour affichage immédiat
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Veuillez sélectionner un fichier image au format PNG.");
    }
  };

  // Création d'un nouvel établissement
  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newHotel: HotelConfig = {
      id: slug,
      name,
      logo: logoPreview,
      roomCount: Number(roomCount),
    };

    setHotels((prev) => [...prev, newHotel]);
    setName("");
    setRoomCount(50);
    setLogoPreview("");
    setSelectedHotel(newHotel);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1 style={{ borderBottom: "2px solid #eaeaea", paddingBottom: "12px", color: "#111" }}>
        Panneau d'Administration Multi-Hôtels
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginTop: "24px" }}>
        {/* Formulaire d'ajout */}
        <section style={{ background: "#f9f9f9", padding: "24px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
          <h2 style={{ marginTop: 0, fontSize: "18px" }}>Créer un Établissement</h2>
          <form onSubmit={handleCreateHotel} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Nom de l'Hôtel :</label>
              <input
                type="text"
                placeholder="ex: Kenzi Tower Hotel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Nombre de Chambres :</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={roomCount}
                onChange={(e) => setRoomCount(Number(e.target.value))}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Logo (.PNG) :</label>
              <input
                type="file"
                accept="image/png"
                onChange={handleLogoUpload}
                style={{ width: "100%" }}
              />
              {logoPreview && (
                <div style={{ marginTop: "10px", padding: "10px", background: "#fff", borderRadius: "6px", border: "1px dashed #ccc", textAlign: "center" }}>
                  <img src={logoPreview} alt="Aperçu logo" style={{ maxHeight: "60px", maxWidth: "100%", objectFit: "contain" }} />
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                marginTop: "12px",
                padding: "12px",
                background: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Générer l'Hôtel & les Chambres
            </button>
          </form>
        </section>

        {/* Liste des hôtels générés */}
        <section>
          <h2 style={{ marginTop: 0, fontSize: "18px" }}>Hôtels Configurés ({hotels.length})</h2>
          {hotels.length === 0 ? (
            <p style={{ color: "#777" }}>Aucun hôtel configuré pour l'instant. Remplissez le formulaire ci-contre.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  onClick={() => setSelectedHotel(hotel)}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    border: selectedHotel?.id === hotel.id ? "2px solid #0070f3" : "1px solid #ddd",
                    background: selectedHotel?.id === hotel.id ? "#f0f7ff" : "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {hotel.logo ? (
                      <img src={hotel.logo} alt={hotel.name} style={{ width: "36px", height: "36px", objectFit: "contain" }} />
                    ) : (
                      <div style={{ width: "36px", height: "36px", background: "#eee", borderRadius: "4px" }} />
                    )}
                    <div>
                      <strong>{hotel.name}</strong>
                      <div style={{ fontSize: "12px", color: "#666" }}>{hotel.roomCount} Chambres</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "#0070f3", fontWeight: "bold" }}>Voir &rarr;</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Liens d'accès par chambre */}
      {selectedHotel && (
        <section style={{ marginTop: "40px", borderTop: "2px solid #eaeaea", paddingTop: "24px" }}>
          <h2>Liens d'accès Concierge — {selectedHotel.name}</h2>
          <p style={{ color: "#666" }}>
            Accès générés de la chambre 1 à {selectedHotel.roomCount} :
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "10px",
              maxHeight: "320px",
              overflowY: "auto",
              padding: "12px",
              background: "#fafafa",
              borderRadius: "8px",
              border: "1px solid #eee",
            }}
          >
            {Array.from({ length: selectedHotel.roomCount }, (_, i) => i + 1).map((roomNum) => (
              <a
                key={roomNum}
                href={`/?hotel=${selectedHotel.id}&room=${roomNum}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "8px 12px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "13px",
                  textDecoration: "none",
                  color: "#333",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Chambre {roomNum}</span>
                <span style={{ color: "#0070f3", fontSize: "11px" }}>Ouvrir &nearr;</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}