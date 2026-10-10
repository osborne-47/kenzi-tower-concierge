import os
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Kenzi Tower Concierge API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tickets_db = []

class ChatRequest(BaseModel):
    hotel_name: str = "Kenzi Tower Hotel"
    guest_message: str
    room_number: str = "304"

class TicketStatusUpdate(BaseModel):
    status: str

SYSTEM_PROMPT = """
Tu es le Concierge Virtuel d'élite du prestigieux Kenzi Tower Hotel au Twin Center à Casablanca.
Ton ton est courtois, raffiné et digne d'un établissement 5 étoiles.
Tu réponds dans la langue du client (Français, Anglais, Arabe/Darija).

Informations clés :
- Wi-Fi : Réseau 'Kenzi-Guest', accès direct gratuit.
- Sky 28 : Bar panoramique au 28ème étage, 17h à 01h.
- Sensori Spa : 2ème étage, 09h à 21h.
- Réception & Room Service : Touche 0 ou 9.
"""

def detect_service_request(message: str, room: str):
    msg = message.lower()
    service_type = None
    priority = "NORMAL"
    
    # Mots-clés d'urgence
    if any(w in msg for w in ["fuite", "inondation", "panne", "bloque", "bloqué", "urgent", "malade", "docteur", "medecin", "secours", "emergency", "leak", "broken"]):
        service_type = "Maintenance Urgente / Sécurité"
        priority = "URGENT"
    elif any(w in msg for w in ["climatisation", "clim", "chauffage", "chaud", "froid", "ac", "air conditioning"]):
        service_type = "Technique / Climatisation"
        priority = "URGENT"
    elif any(w in msg for w in ["serviette", "towel", "oreiller", "pillow", "couverture", "blanket", "savon", "shampoing"]):
        service_type = "Gouvernante / Linge"
    elif any(w in msg for w in ["taxi", "aeroport", "airport", "bagage", "valise", "luggage", "chauffeur"]):
        service_type = "Conciergerie / Transport"
    elif any(w in msg for w in ["cafe", "petit dejeuner", "breakfast", "manger", "eau", "bouteille", "room service", "dinner"]):
        service_type = "Room Service"
    elif any(w in msg for w in ["reveil", "wake"]):
        service_type = "Réception / Réveil"

    if service_type:
        tickets_db.insert(0, {
            "id": len(tickets_db) + 1,
            "room": room,
            "category": service_type,
            "request": message,
            "priority": priority,
            "status": "En attente",
            "time": datetime.now().strftime("%H:%M"),
            "timestamp": datetime.now().isoformat(),
        })

def get_fallback_reply(message: str) -> str:
    msg = message.lower()
    if "wifi" in msg:
        return "Le réseau Wi-Fi est 'Kenzi-Guest' (accès direct sans mot de passe)."
    elif any(w in msg for w in ["tagine", "restaurant", "manger"]):
        return "Nous vous recommandons Al Mounia pour la cuisine marocaine traditionnelle ou Le Cabestan face à l'Atlantique."
    elif any(w in msg for w in ["sky 28", "bar"]):
        return "Le Sky 28 vous accueille au 28ème étage dès 17h00 avec une vue panoramique sur Casablanca."
    elif any(w in msg for w in ["serviette", "towel"]):
        return "Votre demande de linge supplémentaire a bien été transmise à la gouvernante d'étage."
    elif any(w in msg for w in ["fuite", "clim", "panne", "urgent"]):
        return "Votre signalement est pris en compte en priorité absolue. Notre équipe technique se rend immédiatement dans votre suite."
    return "Bienvenue au Kenzi Tower Hotel. Je reste à votre service pour tout besoin durant votre séjour."

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    detect_service_request(req.guest_message, req.room_number)
    
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key.startswith("votre_"):
        return {"reply": get_fallback_reply(req.guest_message)}
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"[Chambre {req.room_number}] : {req.guest_message}"}
            ],
            temperature=0.7,
            max_tokens=250,
        )
        return {"reply": response.choices[0].message.content}
    except Exception as e:
        print("Erreur LLM:", e)
        return {"reply": get_fallback_reply(req.guest_message)}

@app.get("/api/tickets")
async def get_tickets():
    return {"tickets": tickets_db}

@app.patch("/api/tickets/{ticket_id}")
async def update_ticket(ticket_id: int, update: TicketStatusUpdate):
    for t in tickets_db:
        if t["id"] == ticket_id:
            t["status"] = update.status
            return {"success": True, "ticket": t}
    return {"success": False, "error": "Not found"}