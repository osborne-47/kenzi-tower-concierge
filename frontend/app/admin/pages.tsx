"use client";

import React, { useState } from "react";
import QRCode from "qrcode";

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

  // Handle Logo Upload (Converts PNG to Data URL for instant preview & persistence)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/png") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PNG file.");
    }
  };

  // Create Hotel
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

    setHotels([...hotels, newHotel]);
    setName("");
    setRoomCount(50);
    setLogoPreview("");
    setSelectedHotel(newHotel);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1 style={{ borderBottom: "2px solid #eaeaea", paddingBottom: "12px" }}>
        Hotel Multi-Tenant Administration
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginTop: "24px" }}>
        {/* Form Panel */}
        <section style={{ background: "#f9f9f9", padding: "24px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
          <h2>Add New Hotel</h2>
          <form onSubmit={handleCreateHotel} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Hotel Name:</label>
              <input
                type="text"
                placeholder="e.g. Kenzi Tower Hotel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Total Rooms:</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={roomCount}
                onChange={(e) => setRoomCount(Number(e.target.value))}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Hotel Logo (.PNG):</label>
              <input
                type="file"
                accept="image/png"
                onChange={handleLogoUpload}
                style={{ width: "100%" }}
              />
              {logoPreview && (
                <div style={{ marginTop: "10px" }}>
                  <img src={logoPreview} alt="Logo preview" style={{ maxHeight: "60px", objectFit: "contain" }} />
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
              Generate Hotel
            </button>
          </form>
        </section>

        {/* Existing Hotels & Generation Panel */}
        <section>
          <h2>Configured Hotels ({hotels.length})</h2>
          {hotels.length === 0 ? (
            <p style={{ color: "#777" }}>No hotels added yet. Use the form to generate one.</p>
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
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {hotel.logo && <img src={hotel.logo} alt={hotel.name} style={{ width: "36px", height: "36px", objectFit: "contain" }} />}
                    <div>
                      <strong>{hotel.name}</strong>
                      <div style={{ fontSize: "12px", color: "#666" }}>{hotel.roomCount} Rooms</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", color: "#0070f3" }}>View Rooms &rarr;</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Room Directory & Links Preview */}
      {selectedHotel && (
        <section style={{ marginTop: "40px", borderTop: "2px solid #eaeaea", paddingTop: "24px" }}>
          <h2>Room Access Links — {selectedHotel.name}</h2>
          <p style={{ color: "#666" }}>
            Shareable concierge links generated for rooms 1 to {selectedHotel.roomCount}:
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "10px",
              maxHeight: "300px",
              overflowY: "auto",
              padding: "10px",
              background: "#fafafa",
              borderRadius: "8px",
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
                }}
              >
                <span>Room {roomNum}</span>
                <span style={{ color: "#0070f3" }}>Open &nearr;</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}