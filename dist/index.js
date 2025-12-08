"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// installazione librerie
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const gameLoop_1 = require("./game/gameLoop");
// creo una player queue
const playerQueue = [];
const gameState = {
    rooms: {},
};
// inizializzazione app express
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // accetta richieste da qualunque dispositivo
app.get("/", (req, res) => {
    res.send("Game server started.");
});
const server = http_1.default.createServer(app); // crea server basato su express
// crea server WebSocket (realtime)
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // serve per far funzionare col telefono
    },
});
// gestione eventi connessione
io.on("connection", (socket) => {
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
        const playerState1 = {
            id: player1.id,
            position: 0,
            roomId: roomId,
            lastTap: null,
            velocity: 0,
            prevTap: null,
        };
        const playerState2 = {
            id: player2.id,
            position: 0,
            roomId: roomId,
            lastTap: null,
            velocity: 0,
            prevTap: null,
        };
        const roomState = {
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
    socket.on("tap", (data) => {
        const roomId = socket.roomId;
        if (!roomId)
            return;
        const room = gameState.rooms[roomId];
        if (!room)
            return;
        const player = room.players[socket.id];
        if (!player)
            return;
        player.lastTap = data.side; // <-- fondamentale
    });
    socket.on("disconnect", () => {
        console.log("Player disconnesso", socket.id);
    });
});
const PORT = 3000;
(0, gameLoop_1.startGameLoop)(io, gameState);
server.listen(PORT, () => {
    console.log(`🔥 Game server in ascolto su http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map