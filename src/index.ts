// installazione librerie
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { Game } from "./types/game";
import { RoomState } from "./types/room";
import { PlayerState } from "./types/player";
import { PlayerSocket } from "./types/socket";
import { startGameLoop } from "./game/gameLoop";

// creo una player queue
const playerQueue: PlayerSocket[] = [];
const gameState: Game = {
  rooms: {},
};

// inizializzazione app express
const app = express();
app.use(cors()); // accetta richieste da qualunque dispositivo

app.get("/", (req, res) => {
  res.send("Game server started.");
});

const server = http.createServer(app); // crea server basato su express

// crea server WebSocket (realtime)
const io = new Server(server, {
  cors: {
    origin: "*", // serve per far funzionare col telefono
  },
});

// gestione eventi connessione
io.on("connection", (socket: PlayerSocket) => {
  console.log("Nuovo player connesso", socket.id);

  playerQueue.push(socket);
  console.log("Players in queue:", playerQueue.length);

  // se ci sono due giocatori crea una room
  if (playerQueue.length >= 2) {
    const player1 = playerQueue.shift();
    const player2 = playerQueue.shift();

    if (!player1 || !player2) {
      console.error("Errore nel prendere i giocatori dalla coda");
      return;
    }

    const roomId = `room-${player1.id}-${player2.id}`;

    const playerState1: PlayerState = {
      id: player1.id,
      position: 0,
      roomId: roomId,
      lastTap: null
    };
    const playerState2: PlayerState = {
      id: player2.id,
      position: 0,
      roomId: roomId,
      lastTap: null
    };
    const roomState: RoomState = {
      players: {
        [player1.id]: playerState1,
        [player2.id]: playerState2,
      },
      id: roomId,
    };

    gameState.rooms[roomId] = roomState;

    player1.roomId = roomId;
    player2.roomId = roomId;

    // i due player entrano nella room
    player1.join(roomId);
    player2.join(roomId);

    console.log(`🎮 Match creato: ${roomId}`);

    // avviso al client
    io.to(roomId).emit("match_start", {
      roomId,
      players: [player1.id, player2.id],
    });
  }

  socket.on("disconnect", () => {
    console.log("Player disconnesso", socket.id);
  });
});

const PORT = 3000;
startGameLoop(io, gameState);
server.listen(PORT, () => {
  console.log(`🔥 Game server in ascolto su http://localhost:${PORT}`);
});
