const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", (event) => {
  console.log("WebSocket connected!");
  socket.send("Hello, server!");
});

socket.addEventListener("message", (event) => {
  console.log(`Received message: ${event.data}`);
  // TODO: Füge den empfangenen Nachrichteninhalt zum Chatfenster hinzu
  const chatMessages = document.querySelector(".chat-messages");
  const newMessage = document.createElement("li");
  newMessage.textContent = event.data;
  chatMessages.appendChild(newMessage);
});

socket.addEventListener("close", (event) => {
  console.log("WebSocket closed.");
});

socket.addEventListener("error", (event) => {
  console.error("WebSocket error:", event);
});

// TODO: Event-Handler für das Texteingabefeld und den Senden-Button
const textarea = document.querySelector("textarea");
const sendButton = document.querySelector("button");

sendButton.addEventListener("click", () => {
  const message = textarea.value;
  socket.send(message);
  textarea.value = ""; // Leere das Texteingabefeld nach dem Senden
});
