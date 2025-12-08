"use strict";
// src/game/gameLoop.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGameLoop = startGameLoop;
const FINISH_DISTANCE = 20;
// tuning valori
const MAX_VELOCITY = 8;
const ACCELERATION = 1.4;
const WRONG_TAP_PENALTY = 2.0;
const INACTIVITY_PENALTY = 0.8;
function startGameLoop(io, gameState) {
    setInterval(() => {
        for (const roomId in gameState.rooms) {
            const room = gameState.rooms[roomId];
            if (!room)
                continue;
            const players = room.players;
            if (!players)
                continue;
            for (const playerId in players) {
                const player = players[playerId];
                if (!player)
                    continue;
                // 1. Calcolo velocità
                if (player.lastTap === null) {
                    player.velocity -= INACTIVITY_PENALTY;
                }
                else if (player.prevTap !== null &&
                    player.lastTap !== player.prevTap) {
                    player.velocity += ACCELERATION;
                }
                else if (player.prevTap === player.lastTap) {
                    player.velocity -= WRONG_TAP_PENALTY;
                }
                // clamp
                if (player.velocity < 0)
                    player.velocity = 0;
                if (player.velocity > MAX_VELOCITY)
                    player.velocity = MAX_VELOCITY;
                // 2. Aggiorno posizione
                player.position += player.velocity * 0.1;
                // 3. Salvo per tick successivo
                if (player.lastTap !== null) {
                    player.prevTap = player.lastTap;
                }
                // 4. Fine gara
                if (player.position >= FINISH_DISTANCE) {
                    io.to(roomId).emit("race_end", { winner: player.id });
                    delete gameState.rooms[roomId];
                    break;
                }
            }
            // 5. Invia stato aggiornato
            io.to(roomId).emit("state_update", room);
        }
    }, 1000 / 20);
}
//# sourceMappingURL=gameLoop.js.map