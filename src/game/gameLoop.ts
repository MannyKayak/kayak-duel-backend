// src/game/gameLoop.ts

import { Server } from "socket.io";
import { Game } from "../types/game";
import { RoomState } from "../types/room";

const FINISH_DISTANCE = 100;

// tuning valori
const MAX_VELOCITY = 8;
const ACCELERATION = 1.4;
const WRONG_TAP_PENALTY = 2.0;
const INACTIVITY_PENALTY = 0.8;

export function startGameLoop(io: Server, gameState: Game) {
  setInterval(() => {
    for (const roomId in gameState.rooms) {
      const room: RoomState = gameState.rooms[roomId];
      const players = room.players;

      for (const playerId in players) {
        const player = players[playerId];

        // 1. Calcolo velocità
        if (player.lastTap === null) {
          // inattività
          player.velocity -= INACTIVITY_PENALTY;
        } else if (
          player.prevTap !== null &&
          player.lastTap !== player.prevTap
        ) {
          // alternanza → accelera
          player.velocity += ACCELERATION;
        } else if (player.prevTap === player.lastTap) {
          // tap sbagliato → decelera
          player.velocity -= WRONG_TAP_PENALTY;
        }

        // clamp
        if (player.velocity < 0) player.velocity = 0;
        if (player.velocity > MAX_VELOCITY) player.velocity = MAX_VELOCITY;

        // 2. Aggiorno posizione
        player.position += player.velocity * 0.1;

        // 3. Salvo per tick successivo
        player.prevTap = player.lastTap;
        player.lastTap = null;

        // 4. Fine gara
        if (player.position >= FINISH_DISTANCE) {
          io.to(roomId).emit("race_end", { winner: player.id });

          delete gameState.rooms[roomId];
          break;
        }
      }

      // 5. Invia nuovo stato a giocatori
      io.to(roomId).emit("state_update", room);
    }
  }, 1000 / 20); // 20 tick al secondo
}
