const WebSocket = require("ws");
const redis = require("redis");
let subscriber;
let publisher;

const clients = [];

// Initiate the websocket server
const initializeWebsocketServer = async (server) => {
  const client = redis.createClient({
    socket: {
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || "6379",
    },
  });
  // This is the subscriber part
  subscriber = client.duplicate();
  await subscriber.connect();
  // This is the publisher part
  publisher = client.duplicate();
  await publisher.connect();

  const websocketServer = new WebSocket.Server({ server });
  websocketServer.on("connection", onConnection);
  websocketServer.on("error", console.error);
  await subscriber.subscribe("newMessage", onRedisMessage);
};

// If a new connection is established, the onConnection function is called
const onConnection = (ws) => {
  console.log("New websocket connection");
  ws.on("close", () => onClose(ws));
  ws.on("message", (message) => onClientMessage(ws, message));
  
  // Send the current participant list to the newly connected client
  const usernames = clients.map((client) => client.username);
  ws.send(JSON.stringify({ type: "userList", data: usernames }));

  // Add the newly connected client to the clients array
  clients.push({ socket: ws, username: null });
};


// If a new message is received, the onClientMessage function is called
const onClientMessage = (ws, message) => {
  console.log("Message received: " + message);
  // Send the message to the Redis channel
  publisher.publish("newMessage", message);
};

// If a new message from the Redis channel is received, the onRedisMessage function is called
const onRedisMessage = (channel, message) => {
  console.log("Message received: " + message);
  // Send the message to all connected clients
  clients.forEach((client) => {
    client.socket.send(message);
  });

  // Update the participant list with the usernames of the clients
  const usernames = clients.map((client) => client.username);
  clients.forEach((client) => {
    client.socket.send(JSON.stringify({ type: "userList", data: usernames }));
  });
};

// If a connection is closed, the onClose function is called
const onClose = (ws) => {
  console.log("Websocket connection closed");
  // Remove the client from the clients array
  const index = clients.findIndex((client) => client.socket === ws);
  if (index !== -1) {
    clients.splice(index, 1);
  }
};

module.exports = { initializeWebsocketServer };