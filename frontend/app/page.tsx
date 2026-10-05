"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Language = "fr" | "en" | "ar";

interface Message {
  role: "user" | "concierge";
  content: string;
}

const UI_TEXTS = {
  fr: {
    welcome: (room: string) =>
      `Bienvenue au Kenzi Tower Hotel. Je suis votre Concierge Virtuel pour la Suite ${room}. Comment puis-je vous accompagner durant votre séjour à Casablanca ?`,
    placeholder: "Posez une question ou demandez un service...",
    send: "Envoyer",
    thinking: "Le Concierge vous répond...",
    error: "Une difficulté technique temporaire est survenue. Veuillez contacter la réception au 0.",
    badgeSuite: "Suite",
    quick: [
      { label: "📶 Wi-Fi", prompt: "Quel est le mot de passe Wi-Fi ?" },
      { label: "🍸 Sky 28", prompt: "Quels sont les horaires du bar Sky 28 ?" },
      { label: "🛎️ Serviettes", prompt: "Pouvez-vous m'apporter des serviettes supplémentaires en chambre ?" },
      { label: "🍽️ Al Mounia", prompt: "Recommandez-moi un restaurant traditionnel marocain réputé." },
    ],
  },
  en: {
    welcome: (room: string) =>
      `Welcome to the Kenzi Tower Hotel. I am your Virtual Concierge for Suite ${room}. How may I assist you during your stay in Casablanca?`,
    placeholder: "Ask a question or request a service...",
    send: "Send",
    thinking: "The Concierge is typing...",
    error: "A temporary technical issue occurred. Please dial 0 for front desk assistance.",
    badgeSuite: "Suite",
    quick: [
      { label: "📶 Wi-Fi", prompt: "What is the guest Wi-Fi network and password?" },
      { label: "🍸 Sky 28", prompt: "What are the opening hours of Sky 28 bar?" },
      { label: "🛎️ Fresh Towels", prompt: "Could you please send extra fresh towels to my room?" },
      { label: "🍽️ Dining", prompt: "Could you recommend a top traditional Moroccan restaurant?" },
    ],
  },
  ar: {
    welcome: (room: string) =>
      `مرحباً بكم في فندق كينزي تاور. أنا بوابكم الافتراضي للجناح ${room}. كيف يمكنني خدمتكم خلال إقامتكم في الدار البيضاء؟`,
    placeholder: "اكتب استفسارك أو طلبك هنا...",
    send: "إرسال",
    thinking: "البواب الافتراضي يقوم بالرد...",
    error: "حدث عطل فني مؤقت. يرجى الاتصال بمكتب الاستقبال عبر الرقم 0.",
    badgeSuite: "جناح",
    quick: [
      { label: "📶 واي فاي", prompt: "ما هي تفاصيل شبكة الواي فاي بالفندق؟" },
      { label: "🍸 سكاي 28", prompt: "ما هي أوقات عمل صالة سكاي 28؟" },
      { label: "🛎️ مناشف", prompt: "هل يمكنكم إرسال مناشف إضافية إلى الجناح من فضلكم؟" },
      { label: "🍽️ مطعم مغربي", prompt: "اقترح علي مطعماً مغربياً تقليدياً راقياً في الدار البيضاء." },
    ],
  },
};

function ConciergeChat() {
  const searchParams = useSearchParams();
  const roomNumber = searchParams.get("room") || "304";
  const [lang, setLang] = useState<Language>("fr");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "concierge",
      content: UI_TEXTS.fr.welcome(roomNumber),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = UI_TEXTS[lang];
  const isRtl = lang === "ar";

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    // Met à jour le message d'accueil si aucune conversation n'est engagée
    if (messages.length === 1 && messages[0].role === "concierge") {
      setMessages([{ role: "concierge", content: UI_TEXTS[newLang].welcome(roomNumber) }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (textToSend?: string) => {
    const message = textToSend || input;
    if (!message.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_message: message,
          room_number: roomNumber,
        }),
      });

      if (!res.ok) throw new Error("Erreur");
      const data = await res.json();
      setMessages([...newMessages, { role: "concierge", content: data.reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "concierge",
          content: t.error,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans"
    >
      {/* En-tête avec Sélecteur de Langue */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center z-10">
        <div>
          <h1 className="text-xl font-bold tracking-wide text-amber-400">KENZI TOWER HOTEL</h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Twin Center • Casablanca</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sélecteur FR / EN / AR */}
          <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            {(["fr", "en", "ar"] as Language[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleLanguageChange(item)}
                className={`px-2.5 py-1 rounded font-medium transition cursor-pointer ${
                  lang === item
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>

          <span className="text-xs bg-amber-500/10 text-amber-400 font-semibold px-3 py-1 rounded-full border border-amber-500/20 whitespace-nowrap">
            {t.badgeSuite} {roomNumber}
          </span>
        </div>
      </header>

      {/* Raccourcis multilingues */}
      <div className="bg-slate-900/40 border-b border-slate-800/60 px-6 py-2.5 flex gap-2 overflow-x-auto text-xs no-scrollbar">
        {t.quick.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(btn.prompt)}
            className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 whitespace-nowrap transition cursor-pointer"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Liste des messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                m.role === "user"
                  ? "bg-amber-600 text-white rounded-br-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
              }`}
            >
              {m.role === "concierge" && (
                <div className="text-[10px] uppercase font-semibold text-amber-400 mb-1 tracking-wider">
                  Concierge Kenzi
                </div>
              )}
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none p-4 text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              {t.thinking}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Formulaire de saisie */}
      <footer className="bg-slate-900/90 border-t border-slate-800 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="max-w-4xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-semibold px-6 py-3 rounded-xl text-sm transition cursor-pointer"
          >
            {t.send}
          </button>
        </form>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-6">Chargement...</div>}>
      <ConciergeChat />
    </Suspense>
  );
}