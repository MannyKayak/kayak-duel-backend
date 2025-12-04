# 🛶 Kayak Duel – Multiplayer Game Backend

Backend real-time per un gioco mobile 1vs1 sviluppato con **Node.js**, **TypeScript** e **Socket.IO**.  
Il gameplay si basa su tap alternati (sinistra/destra) per far avanzare il proprio atleta:  
chi raggiunge per primo il traguardo di 100 metri vince la gara.

---

## 🚀 Tecnologie utilizzate

- Node.js
- TypeScript
- Express
- Socket.IO
- ts-node-dev

---

## 📁 Struttura del progetto

src/
index.ts # Server principale: Express, Socket.IO, matchmaking
game/
gameLoop.ts # Ciclo di gioco (20 tick/s): posizione, velocità, vittoria
types/
player.ts # Definizione PlayerState & tipi correlati
room.ts # Modello della room
game.ts # Stato del gioco globale
socket.ts # Estensione del tipo Socket.IO per player
bot-runner.js # Bot automatici per testare la gara

---

## 🧠 Logica del gioco (MVP)

Il giocatore avanza tappando alternativamente **L → R → L → R**.  
Il server interpreta i tap e aggiorna velocità e posizione.

### Regole principali:

- Alternanza corretta → **accelera**
- Tap uguale al precedente → **decelera**
- Nessun tap in un tick → **decelerazione leggera**
- Velocità sempre limitata tra 0 e max
- Posizione aggiornata 20 volte al secondo
- Gara vinta quando `position ≥ 100`

---

## 🔄 Game Loop

Il game loop gira a **20 tick al secondo** e:

1. legge gli input
2. calcola accelerazione/decelerazione
3. aggiorna la posizione
4. emette `state_update` ai client
5. controlla se c'è un vincitore
6. elimina la room conclusa

---

## 🧪 Testing con Bot

La repo contiene un bot che simula due giocatori automatici per testare il gameplay.

Avvio bot:

node bot-runner.js

I bot:

- si connettono automaticamente
- alternano tap L/R
- generano occasionali errori o inattività
- stampano velocità e posizione
- mostrano il vincitore

---

## ▶️ Avvio del backend

Installazione:

yarn install

Avvio sviluppo:

yarn dev

Build:
yarn build

Produzione:

yarn start

---

## 📡 Eventi Socket.IO

### Client → Server

```js
socket.emit("tap", { side: "L" | "R" });
Server → Client

match_start

state_update

race_end

🧩 Matchmaking

Il server gestisce automaticamente una coda.
Quando due giocatori entrano:

crea una room

inizializza lo stato del match

invia match_start

il game loop prende controllo

🛠 Parametri di Tuning (MVP)

FINISH_DISTANCE = 100
MAX_VELOCITY = 8
ACCELERATION = 1.4
WRONG_TAP_PENALTY = 2.0
INACTIVITY_PENALTY = 0.8

🗺️ Roadmap
🌱 MVP Base

- Server Express + Socket.IO
- Matchmaking automatico (1vs1)
- Game loop server-authoritative
- Input tap e gestione movimento
- Fine gara + evento race_end
-🚧 Miglioramenti futuri
- Riconoscimento ritmo dei tap (combo e boost)
- Power-up e bonus temporanei
- Lag compensation avanzata
- Reconnect in partita
- API REST per statistiche giocatore
- Ranking system / MMR
- Storico partite
- Modalità spettatore
- Dashboard admin
- Supporto tornei
- Logging & metrics
- Test automatici (Jest)

🤝 Contributi

Ogni contributo è benvenuto!
Apri una issue o una pull request.

📄 Licenza

MIT License.

🛶 Kayak Duel

Il primo sprint in kayak giocato a colpi di tap!
```
