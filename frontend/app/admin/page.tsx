"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Sparkles,
  KeyRound,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Trash2,
  Search,
  Upload,
  Layers,
  ShieldCheck,
  Smartphone,
  Send,
  X,
  Hotel,
  Compass,
  Sliders,
  BedDouble,
  BarChart3,
  Flame,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface HotelEntity {
  id: string;
  name: string;
  city: string;
  roomCount: number;
  logo: string;
  accentColor: string;
  createdAt: string;
  activeGuests: number;
}

const DEFAULT_HOTELS: HotelEntity[] = [
  {
    id: "kenzi-tower-casablanca",
    name: "Kenzi Tower Hotel",
    city: "Casablanca, Twin Center",
    roomCount: 237,
    logo: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=150&auto=format&fit=crop&q=80",
    accentColor: "#d4af37",
    createdAt: "10 Octobre 2026",
    activeGuests: 184,
  },
  {
    id: "royal-mansour-marrakech",
    name: "Royal Mansour",
    city: "Marrakech, Hivernage",
    roomCount: 53,
    logo: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=150&auto=format&fit=crop&q=80",
    accentColor: "#c5a059",
    createdAt: "04 Octobre 2026",
    activeGuests: 49,
  },
  {
    id: "la-mamounia-marrakech",
    name: "La Mamounia Palace",
    city: "Marrakech, Medina",
    roomCount: 209,
    logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&auto=format&fit=crop&q=80",
    accentColor: "#e6c770",
    createdAt: "01 Octobre 2026",
    activeGuests: 198,
  },
];

export default function LuxuryAdminDashboard() {
  const [hotels, setHotels] = useState<HotelEntity[]>(DEFAULT_HOTELS);
  const [selectedHotel, setSelectedHotel] = useState<HotelEntity>(DEFAULT_HOTELS[0]);
  
  // Form State
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [roomCount, setRoomCount] = useState<number>(120);
  const [accentColor, setAccentColor] = useState("#d4af37");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & Interactivity
  const [roomFilter, setRoomFilter] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Guest Simulator Modal State
  const [previewRoom, setPreviewRoom] = useState<number | null>(null);
  const [simulatorChat, setSimulatorChat] = useState<Array<{ sender: "guest" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Bienvenue dans votre Suite d'Exception. Je suis votre Concierge Privé connecté. En quoi puis-je magnifier votre séjour ce soir ?"
    }
  ]);
  const [simulatorInput, setSimulatorInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Lien d'accès copié dans le presse-papiers !");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("image/png") && !file.type.includes("image/jpeg") && !file.type.includes("image/webp")) {
        showToast("Veuillez importer une image PNG, WebP ou JPEG");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        showToast("Logo de l'établissement chargé avec succès");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const newHotel: HotelEntity = {
        id: slug + "-" + Date.now().toString().slice(-4),
        name: name.trim(),
        city: city.trim() || "Emplacement International",
        roomCount: Number(roomCount),
        logo: logoPreview || "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=150&auto=format&fit=crop&q=80",
        accentColor,
        createdAt: "Aujourd'hui",
        activeGuests: Math.floor(Number(roomCount) * 0.75),
      };

      setHotels((prev) => [newHotel, ...prev]);
      setSelectedHotel(newHotel);
      setName("");
      setCity("");
      setRoomCount(120);
      setLogoPreview("");
      setIsSubmitting(false);
      showToast(`Établissement « ${newHotel.name} » généré avec succès !`);
    }, 600);
  };

  const handleDeleteHotel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hotels.length <= 1) {
      showToast("Impossible de supprimer le dernier établissement.");
      return;
    }
    const filtered = hotels.filter((h) => h.id !== id);
    setHotels(filtered);
    if (selectedHotel.id === id) {
      setSelectedHotel(filtered[0]);
    }
    showToast("Établissement retiré.");
  };

  const handleSimulatorSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatorInput.trim()) return;

    const userText = simulatorInput.trim();
    setSimulatorChat((prev) => [...prev, { sender: "guest", text: userText }]);
    setSimulatorInput("");

    setTimeout(() => {
      let reply = "Votre demande a été enregistrée avec la plus grande attention et transmise à notre majordome.";
      const lower = userText.toLowerCase();
      if (lower.includes("wifi")) {
        reply = `Le Wi-Fi Très Haut Débit de ${selectedHotel.name} est disponible via l'identifiant « Suite-${previewRoom || "Guest"} » sans mot de passe.`;
      } else if (lower.includes("serviette") || lower.includes("towel") || lower.includes("oreiller")) {
        reply = "Le service d'étage acheminera le linge de maison demandé à votre suite dans un délai de 8 minutes.";
      } else if (lower.includes("restaurant") || lower.includes("diner") || lower.includes("cocktail")) {
        reply = "Une table privilégiée peut être réservée pour vous auprès de notre Maître d'Hôtel pour ce soir 20h30.";
      }
      setSimulatorChat((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 800);
  };

  const totalHotels = hotels.length;
  const totalRooms = useMemo(() => hotels.reduce((acc, h) => acc + h.roomCount, 0), [hotels]);
  const totalActiveGuests = useMemo(() => hotels.reduce((acc, h) => acc + h.activeGuests, 0), [hotels]);

  const filteredRoomNumbers = useMemo(() => {
    if (!selectedHotel) return [];
    const rooms = Array.from({ length: selectedHotel.roomCount }, (_, i) => i + 1);
    if (!roomFilter.trim()) return rooms;
    return rooms.filter((r) => r.toString().includes(roomFilter.trim()));
  }, [selectedHotel, roomFilter]);

  return (
    <div className="min-h-screen bg-[#090b0e] text-[#e5e7eb] font-sans selection:bg-[#d4af37]/30 selection:text-[#faeed1] relative overflow-x-hidden">
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-[#d4af37]/5 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[450px] bg-[#c5a059]/5 blur-[180px] pointer-events-none rounded-full" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#181a1f] border border-[#d4af37]/40 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium text-[#f3f4f6] backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {}
      <header className="border-b border-[#22262e] bg-[#0d1015]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#b8972e] to-[#7f631a] p-[1px] shadow-lg shadow-[#d4af37]/10">
              <div className="w-full h-full bg-[#0d1015] rounded-[11px] flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#d4af37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  CONCIERGE AI <span className="text-[#d4af37] font-serif text-sm italic font-normal tracking-wider">Haute Hôtellerie</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase font-semibold rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-[#9ca3af]">Plateforme Centrale d'Orchestration Multi-Établissements</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#14171d] border border-[#262b35] px-3.5 py-1.5 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#d1d5db] font-medium">Cœur IA Opérationnel</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1a1e26] hover:bg-[#252b36] border border-[#2a303c] text-[#d4af37] transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Portail Invité Live
            </a>
          </div>
        </div>

        {/* Global Key Metrics Bar */}
        <div className="max-w-7xl mx-auto px-6 py-3 border-t border-[#1a1e27] grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#151921] border border-[#222733] text-[#d4af37]">
              <Hotel className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#848c9c] uppercase tracking-wider font-semibold">Hôtels Connectés</div>
              <div className="text-lg font-bold text-white tracking-tight">{totalHotels}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#151921] border border-[#222733] text-[#d4af37]">
              <BedDouble className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#848c9c] uppercase tracking-wider font-semibold">Suites Numériques</div>
              <div className="text-lg font-bold text-white tracking-tight">{totalRooms}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#151921] border border-[#222733] text-emerald-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#848c9c] uppercase tracking-wider font-semibold">Clients Actifs</div>
              <div className="text-lg font-bold text-white tracking-tight">{totalActiveGuests}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#151921] border border-[#222733] text-[#d4af37]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#848c9c] uppercase tracking-wider font-semibold">SLA Conciergerie</div>
              <div className="text-lg font-bold text-white tracking-tight">99.98%</div>
            </div>
          </div>
        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Hotel Generation Station */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl bg-[#11141a]/90 border border-[#242934] p-6 shadow-2xl backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    Créer un Nouvel Établissement
                  </h2>
                  <p className="text-xs text-[#848c9c] mt-0.5">
                    Déployez une instance IA personnalisée avec clés numériques
                  </p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]/40 ring-4 ring-[#d4af37]/10" />
              </div>

              <form onSubmit={handleCreateHotel} className="space-y-4">
                {/* Hotel Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#c5cbd6] uppercase tracking-wider mb-2">
                    Nom de l'Hôtel ou Resort *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ex: Four Seasons Casablanca"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-[#161a22] border border-[#292f3d] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-sm text-white px-3.5 py-2.5 rounded-xl outline-none transition placeholder-[#565f70]"
                    />
                  </div>
                </div>

                {/* City & Address */}
                <div>
                  <label className="block text-xs font-semibold text-[#c5cbd6] uppercase tracking-wider mb-2">
                    Ville & Quartier
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ex: Anfa Superieur, Casablanca"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#161a22] border border-[#292f3d] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-sm text-white px-3.5 py-2.5 rounded-xl outline-none transition placeholder-[#565f70]"
                    />
                  </div>
                </div>

                {/* Room Stepper */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#c5cbd6] uppercase tracking-wider mb-2">
                      Nombre de Chambres
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="1"
                        max="1500"
                        value={roomCount}
                        onChange={(e) => setRoomCount(Math.max(1, parseInt(e.target.value) || 1))}
                        required
                        className="w-full bg-[#161a22] border border-[#292f3d] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] text-sm font-semibold text-white px-3.5 py-2.5 rounded-xl outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Accent Brand Palette */}
                  <div>
                    <label className="block text-xs font-semibold text-[#c5cbd6] uppercase tracking-wider mb-2">
                      Couleur d'Accent
                    </label>
                    <div className="flex items-center gap-2 bg-[#161a22] border border-[#292f3d] px-3 py-1.5 rounded-xl">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="text-xs font-mono text-[#a1a8b7] uppercase">{accentColor}</span>
                    </div>
                  </div>
                </div>

                {/* Logo Drag/Drop & Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[#c5cbd6] uppercase tracking-wider mb-2">
                    Blason / Logo (.PNG avec transparence recommandé)
                  </label>
                  <div className="relative border-2 border-dashed border-[#2b3240] hover:border-[#d4af37]/60 rounded-xl p-4 transition-all bg-[#14171f]/50 text-center group cursor-pointer">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleLogoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {logoPreview ? (
                      <div className="flex items-center justify-center gap-4 py-1">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-14 h-14 object-contain rounded-lg p-1 bg-[#1c202a] border border-[#343b4c]"
                        />
                        <div className="text-left">
                          <p className="text-xs font-bold text-white">Logo Prêt</p>
                          <p className="text-[11px] text-[#9ca3af]">Cliquez pour changer d'image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        <Upload className="w-6 h-6 text-[#858e9f] mx-auto mb-1.5 group-hover:text-[#d4af37] transition" />
                        <p className="text-xs text-[#cfd5e1] font-medium">Déposez votre logo PNG ici</p>
                        <p className="text-[10px] text-[#6b7280]">ou parcourez vos fichiers (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9e7d32] p-[1px] shadow-lg shadow-[#d4af37]/10 transition hover:shadow-xl hover:shadow-[#d4af37]/25 active:scale-[0.99] disabled:opacity-50"
                >
                  <div className="w-full h-full bg-[#0e1117] group-hover:bg-transparent rounded-[11px] py-3.5 px-4 flex items-center justify-center gap-2.5 transition-colors">
                    <Sparkles className="w-4 h-4 text-[#d4af37] group-hover:text-black transition-colors" />
                    <span className="text-xs font-bold tracking-wider uppercase text-white group-hover:text-black transition-colors">
                      {isSubmitting ? "Génération des clés..." : "Générer l'Établissement & les Accès"}
                    </span>
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Active Hotels Management Deck */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-[#d4af37]" />
                  Établissements Sous Gestion ({hotels.length})
                </h2>
                <p className="text-xs text-[#848c9c]">Sélectionnez un hôtel pour inspecter et administrer les suites</p>
              </div>
            </div>

            <div className="space-y-3">
              {hotels.map((hotel) => {
                const isSelected = selectedHotel?.id === hotel.id;
                return (
                  <div
                    key={hotel.id}
                    onClick={() => setSelectedHotel(hotel)}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#141821] border-[#d4af37] shadow-xl shadow-[#d4af37]/5"
                        : "bg-[#0f1218]/90 border-[#1f242f] hover:border-[#353d4f] hover:bg-[#12161f]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-[#1a1f29] border border-[#2b3343] p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={hotel.logo}
                            alt={hotel.name}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white group-hover:text-[#faeed1] transition">
                              {hotel.name}
                            </h3>
                            {isSelected && (
                              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                                Actif
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#828b9a] flex items-center gap-1.5 mt-0.5">
                            <Compass className="w-3 h-3 text-[#d4af37]" />
                            {hotel.city}
                          </p>
                        </div>
                      </div>

                      {/* Right Stats & Actions */}
                      <div className="flex items-center gap-5">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs font-semibold text-white">{hotel.roomCount} Chambres</div>
                          <div className="text-[11px] text-emerald-400">{hotel.activeGuests} invités en ligne</div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            title="Supprimer cet hôtel"
                            onClick={(e) => handleDeleteHotel(hotel.id, e)}
                            className="p-2 rounded-lg text-[#666f80] hover:text-rose-400 hover:bg-rose-950/30 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {}
        {selectedHotel && (
          <section className="mt-12 pt-8 border-t border-[#1f242e]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                    Console d'Attribution
                  </span>
                  <h2 className="text-lg font-bold text-white">
                    Clés & QR Codes Concierge — {selectedHotel.name}
                  </h2>
                </div>
                <p className="text-xs text-[#848c9c] mt-1">
                  Chaque suite dispose d'une clé d'accès URL inviolable et d'un QR code dédié au room service et à la conciergerie.
                </p>
              </div>

              {/* Room search filter */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#6c7688] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrer chambre (ex: 204)..."
                    value={roomFilter}
                    onChange={(e) => setRoomFilter(e.target.value)}
                    className="bg-[#12161f] border border-[#242934] focus:border-[#d4af37] rounded-xl text-xs text-white pl-8 pr-3.5 py-2 w-56 outline-none transition placeholder-[#5b6475]"
                  />
                </div>
                <div className="text-xs text-[#858e9f] font-mono px-3 py-2 bg-[#12161f] rounded-xl border border-[#242934]">
                  {filteredRoomNumbers.length} / {selectedHotel.roomCount} suites
                </div>
              </div>
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredRoomNumbers.slice(0, 48).map((roomNumber) => {
                const roomAccessUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/?hotel=${selectedHotel.id}&room=${roomNumber}`;
                const isCopied = copiedId === `room-${roomNumber}`;

                return (
                  <div
                    key={roomNumber}
                    className="group bg-[#11141b] border border-[#1f242f] hover:border-[#d4af37]/60 rounded-xl p-3.5 transition-all hover:bg-[#151923] flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <KeyRound className="w-3 h-3 text-[#d4af37]" />
                        <span className="text-xs font-bold text-white font-mono">
                          Suite {roomNumber}
                        </span>
                      </div>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#1b2029] flex items-center justify-between gap-1">
                      {/* Open Guest Experience Simulator */}
                      <button
                        onClick={() => {
                          setPreviewRoom(roomNumber);
                          setSimulatorChat([
                            {
                              sender: "ai",
                              text: `Bienvenue dans votre Suite ${roomNumber} au ${selectedHotel.name}. Je suis votre Concierge Dédié. Comment puis-je vous assister ?`
                            }
                          ]);
                        }}
                        className="text-[10px] font-semibold text-[#c7cedc] hover:text-[#faeed1] hover:bg-[#1e2430] p-1.5 rounded-md flex items-center gap-1 transition"
                        title="Simuler l'expérience mobile du client"
                      >
                        <Smartphone className="w-3 h-3 text-[#d4af37]" />
                        <span>Tester</span>
                      </button>

                      {/* Copy link */}
                      <button
                        onClick={() => copyToClipboard(roomAccessUrl, `room-${roomNumber}`)}
                        className="p-1.5 rounded-md text-[#858e9f] hover:text-[#faeed1] hover:bg-[#1e2430] transition"
                        title="Copier le lien direct de la suite"
                      >
                        {isCopied ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      {/* Open Direct */}
                      <a
                        href={`/?hotel=${selectedHotel.id}&room=${roomNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md text-[#858e9f] hover:text-[#d4af37] hover:bg-[#1e2430] transition"
                        title="Ouvrir le portail dans un nouvel onglet"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredRoomNumbers.length > 48 && (
              <p className="text-center text-xs text-[#717a8c] mt-4">
                Affichage optimisé des 48 premières suites. Utilisez le champ de recherche pour cibler une chambre spécifique jusqu'à la {selectedHotel.roomCount}.
              </p>
            )}
          </section>
        )}
      </main>

      {}
      {previewRoom !== null && selectedHotel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm rounded-[36px] bg-[#0b0d12] border-4 border-[#252b38] shadow-2xl overflow-hidden flex flex-col h-[650px] animate-in zoom-in-95 duration-200">
            {/* Phone Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1e232e] rounded-full z-20" />

            {/* Top Bar inside Simulator */}
            <div className="pt-8 px-5 pb-3 border-b border-[#1c212c] bg-[#12161f] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedHotel.logo}
                  alt={selectedHotel.name}
                  className="w-8 h-8 rounded-lg object-contain bg-[#1c222e] p-1"
                />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{selectedHotel.name}</h4>
                  <p className="text-[10px] text-[#d4af37] font-mono">Suite {previewRoom} • Concierge Dédié</p>
                </div>
              </div>

              <button
                onClick={() => setPreviewRoom(null)}
                className="w-7 h-7 rounded-full bg-[#1b202c] text-[#9ca3af] hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulator Chat Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0d0f15]">
              {simulatorChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "guest" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === "guest"
                        ? "bg-[#d4af37] text-black font-medium rounded-tr-none shadow-md"
                        : "bg-[#161a23] text-[#e2e8f0] border border-[#242b38] rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-3 py-2 bg-[#12151d] border-t border-[#1e232f] flex gap-2 overflow-x-auto text-[10px]">
              {["Code Wi-Fi ?", "Serviettes supplémentaires", "Réserver une table"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSimulatorInput(suggestion);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#1b202b] text-[#cbd5e1] hover:text-white hover:bg-[#252c3c] whitespace-nowrap border border-[#2a3242] transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSimulatorSend} className="p-3 bg-[#12151d] border-t border-[#1c212c] flex items-center gap-2">
              <input
                type="text"
                placeholder="Message au concierge..."
                value={simulatorInput}
                onChange={(e) => setSimulatorInput(e.target.value)}
                className="flex-1 bg-[#181d27] border border-[#2b3342] text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                className="p-2 bg-[#d4af37] text-black rounded-xl hover:bg-[#e0bc46] transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}