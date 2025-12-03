const { io } = require("socket.io-client");

// CONFIG DEL BOT
const TAP_INTERVAL = 120; // millisecondi tra un tap e l’altro
const ERROR_PROBABILITY = 0.05; // 5% tappo lo stesso lato
const INACTIVITY_PROB = 0.02; // 2% salto un tap
const TAP_SIDES = ["L", "R"];

// FUNZIONE PER CREARE UN BOT
function createBot(name) {
  const socket = io("http://localhost:3000", {
    transports: ["websocket"],
  });

  let lastTap = null;
  let nextTapSide = "L";

  socket.on("connect", () => {
    console.log(`🤖 ${name} connesso con id: ${socket.id}`);
  });

  socket.on("match_start", (data) => {
    console.log(`🏁 ${name} match start! Room = ${data.roomId}`);
    startTappingLoop();
  });

  socket.on("state_update", (state) => {
    const me = state.players[socket.id];
    if (me) {
      console.log(
        `📍 ${name} pos=${me.position.toFixed(2)} vel=${me.velocity.toFixed(2)}`
      );
    }
  });

  socket.on("race_end", (res) => {
    if (res.winner === socket.id) {
      console.log(`🏆 ${name} HA VINTO LA GARA !!!`);
    } else {
      console.log(`❌ ${name} ha perso la gara.`);
    }
  });

  function startTappingLoop() {
    setInterval(() => {
      // 1) Simula inattività
      if (Math.random() < INACTIVITY_PROB) {
        // non faccio nulla → il server vedrà lastTap=null → decelerazione
        return;
      }

      // 2) Simula errore: tap uguale al precedente
      if (Math.random() < ERROR_PROBABILITY && lastTap !== null) {
        socket.emit("tap", { side: lastTap });
        return;
      }

      // 3) Alternanza normale
      nextTapSide = nextTapSide === "L" ? "R" : "L";
      lastTap = nextTapSide;

      socket.emit("tap", { side: nextTapSide });
    }, TAP_INTERVAL);
  }

  return socket;
}

// CREA 2 BOT CHE SI SFIDANO
createBot("Bot1");
createBot("Bot2");
