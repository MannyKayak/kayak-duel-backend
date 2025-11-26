// installazione librerie
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

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
io.on("connection", (socket) => {
  console.log("Nuovo player connesso", socket.id);

  socket.on("diconnect", () => {
    console.log("Player disconnesso", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🔥 Game server in ascolto su http://localhost:${PORT}`);
});
