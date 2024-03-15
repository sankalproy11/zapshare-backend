const socketIO = require("socket.io");

function setupWebSocket(server) {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    console.log(`New WebSocket client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`WebSocket client disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = setupWebSocket;
