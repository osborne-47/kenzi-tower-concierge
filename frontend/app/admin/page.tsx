"use client";

import React, { useState } from "react";

interface HotelConfig {
  id: string;
  name: string;
  city: string;
  logo: string;
  roomCount: number;
  themeColor: string;
}

const DEFAULT_HOTELS: HotelConfig[] = [
  {
    id: "kenzi-tower",
    name: "Kenzi Tower Hotel",
    city: "Casablanca",
    logo: "",
    roomCount: 237,
    themeColor: "#c5a880",
  },
  {
    id: "royal-mansour",
    name: "Royal Mansour",
    city: "Marrakech",
    logo: "",
    roomCount: 53,
    themeColor: "#d4af37",
  },
  {
    id: "la-mamounia",
    name: "La Mamounia",
    city: "Marrakech",
    logo: "",
    roomCount: 209,
    themeColor: "#b89758",
  },
];

export default function AdminHotelPanel() {
  const [hotels, setHotels] = useState<HotelConfig[]>(DEFAULT_HOTELS);
  const [selectedHotel, setSelectedHotel] = useState<HotelConfig>(DEFAULT_HOTELS[0]);

  const [name, setName] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [roomCount, setRoomCount] = useState<number>(60);
  const [themeColor, setThemeColor] = useState("#d4af37");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [copiedRoom, setCopiedRoom] = useState<number | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Veuillez sélectionner une image au format PNG, JPEG ou WebP.");
    }
  };

  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newHotel: HotelConfig = {
      id: slug || `hotel-${Date.now()}`,
      name,
      city,
      logo: logoPreview,
      roomCount: Number(roomCount),
      themeColor,
    };

    setHotels([newHotel, ...hotels]);
    setSelectedHotel(newHotel);
    setName("");
    setRoomCount(60);
    setLogoPreview("");
  };

  const handleeleteHotel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = hotels.filter((h) => h.id !== id);
    setHotels(remaining);
    if (selectedHotel?.id === id && remaining.length > 0) {
      setSelectedHotel(remaining[0]);
    }
  };

  const copyRoomLink = (roomNum: number) => {
    const url = `${window.location.origin}/?hotel=${selectedHotel.id}&room=${roomNum}`;
    navigator.clipboard.writeText(url);
    setCopiedRoom(roomNum);
    setTimeout(() => setCopiedRoom(null), 1800);
  };

  const totalSuites = hotels.reduce((acc, h) => acc + h.roomCount, 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0b0e14", color: "#e2e8f0", fontFamily: "system-ui, -apple-system, sans-serif", padding: "32px 24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(212,175,55,0.2)", paddingBottom: "24px", marginBottom: "32px" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#d4af37", fontWeight: 700, marginBottom: "6px" }}>
              Architecture Concierge Multi-Hôtels
            </div>
            <h1 style={{ fontSize: "28px", margin: 0, fontWeight: 700, letterSpacing: "-0.5px", color: "#ffffff" }}>
              Console d'Administration
            </h1>
          </div>
          <span style={{ fontSize: "12px", background: "rgba(212,175,55,0.12)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "999px", padding: "6px 14px", fontWeight: 600 }}>
            ● Production Live
          </span>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "36px" }}>
          <div style={{ backgroundrgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Hôtels Connectés</div>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "#fff", marginTop: "8px" }}>{hotels.length}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Suites Déployées</div>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "#d4af37", marginTop: "8px" }}>{totalSuites}</d          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Concierge IA</div>
            <div style={{ fontSize: "32px", fontWeight: 700, color: "#4ade80", marginTop: "8px" }}>Actif</div>
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 420px) 1fr", gap: "32px", alignItems: "start", marginBottom: "40px" }}>
          <section style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: "16px", padding: "28px" }}>
            <h2 style={{ fontSize: "18px", margin: "0 0 20px 0", color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#d4af37" }}>✦</span> Ajouter un Établissement
            </h2>
            <form onSubmit={handleCreateHotel} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>Nom de l'Hôtel</label>
                <input
                  type="text"
                  placeholder="ex: Four Seasons Casablanc                 value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#fff", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>Ville</label>
                  <input
                    type="text"
                    placeholder="Casablanca"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#fff", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight 600, color: "#cbd5e1", marginBottom: "6px" }}>Nb Chambres</label>
                  <input
                    type="number"
                    min="1"
                    max="1500"
                    value={roomCount}
                    onChange={(e) => setRoomCount(Number(e.target.value))}
                    required
                    style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: "#fff", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>Logo (.PNG)</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleLogoUpload}
                  style={{ width: "100%", fontSize: "12px", color: "#94a3b8" }}
                />
                {logoPreview && (
                  <div style={{ marginTop: "10px", padding: "10px", background: "#05070a", borderRadius: "8px", border: "1px dashed rgba(212,175,55,0.4)", textAlign: "center" }}>
                    <img src={logoPreview} alt="Aperçu" style={{ maxHeight: "50px", maxWidth: "100%", objectFit: "contain" }} />
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "8px",
                  padding: "14px",
                  background: "linear-gradient(135deg, #d4af37 0%, #aa8417 100%)",
                  color: "#0b0e14",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                 fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Générer l'Hôtel & les Suites
              </button>
            </form>
          </section>

          <section>
            <h2 style={{ fontSize: "18px", margin: "0 0 20px 0", color: "#fff" }}>
              Établissements ({hotels.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {hotels.map((hotel) => {
                const isSelected = selectedHotel?.id === hotel.id;
                return (
                  <div
                    key={hotel.id}
                    onClick={() => setSelectedHotel(hotel)}
                    style={{
                      background: isSelected ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.02)",
                      border: isSelected ? "1px solid #d4af37" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      padding: "18px 2,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#d4af37", overflow: "hidden" }}>
                        {hotel.logo ? (
                          <img src={hotel.logo} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        ) : (
                          hotel.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "16px", color: isSelected ? "#fff" : "#cbd5e1" }}>{hotel.name}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{hotel.city} • {hotel.roomCount} suites</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button
                        onClick={(e) => handleDeleteHotel(hotel.id, e)}
                        style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "14px" }}
                      >
                        ✕
                      </button>
                      <span style={{ fontSize: "12px", color: "#d4af37", fontWeight: 600 }}>Sélectionner &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </          </section>
        </div>

        {selectedHotel && (
          <section style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "28px" }}>
            <h3 style={{ fontSize: "20px", margin: "0 0 6px 0", color: "#fff" }}>
              Accès Suites & Chambres — {selectedHotel.name}
            </h3>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#94a3b8" }}>
              Liens uniques de la chambre 1 à {selectedHotel.roomCount} :
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", maxHeight: "360px", overflowY: "auto" }}>
              {Array.from({ length: selectedHotel.roomCount }, (_, > i + 1).map((roomNum) => (
                <div
                  key={roomNum}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: "13px", color: "#e2e8f0" }}>Chambre {roomNum}</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => copyRoomLink(roomNum)}
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        background: copiedRoom === roomNum ? "#16a34a" : "rgba(255,255,255,0.08)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {copiedRoom === roomNum ? "Copié" : "Copier"}
                    </button>
                    <a
                      href={`/?hotel=${selectedHotel.id}&room=${roomNum}`}
                      target="_blank"
                     rel="noreferrer"
                      style={{
                        padding: "4px 8px",
                        fontSize: "11px",
                        background: "rgba(212,175,55,0.2)",
                        color: "#d4af37",
                        textDecoration: "none",
                        borderRadius: "4px",
                        fontWeight: 600,
                      }}
                    >
                      ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
