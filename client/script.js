const socket = new WebSocket("ws://localhost:3000");

let username = ""; // Variable zur Speicherung des Benutzernamens

socket.addEventListener("open", (event) => {
  console.log("WebSocket connected!");
});

socket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  const { username, message, timestamp } = data;

  // Zeitstempel in lokaler deutschen Zeit konvertieren
  const options = { hour: "numeric", minute: "numeric" };
  const time = new Date(timestamp).toLocaleTimeString("de-DE", options);

  // Füge die empfangene Nachricht zum Chatfenster hinzu
  const chatMessages = document.querySelector(".chat-messages");
  const newMessage = document.createElement("li");
  newMessage.innerHTML = `
    <div class="flex space-x-2 pl-2 pt-2">
      <div class="flex-shrink-0">
        <div class="h-10 w-10 rounded-full bg-indigo-400 flex items-center justify-center font-bold text-white">
          ${username.charAt(0)}
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex items-baseline space-x-2">
          <div class="font-bold">${username}</div>
          <div class="text-sm text-gray-400">${time}</div>
        </div>
        <div class="text-sm text-gray-500">${message}</div>
      </div>
    </div>
  `;
  chatMessages.appendChild(newMessage);
});

socket.addEventListener("close", (event) => {
  console.log("WebSocket closed.");
});

socket.addEventListener("error", (event) => {
  console.error("WebSocket error:", event);
});

// Event-Handler für das Texteingabefeld und den Senden-Button
const textarea = document.querySelector("textarea");
const usernameInput = document.querySelector("#username-input");

textarea.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const message = textarea.value.trim();
  if (message !== "") {
    const data = {
      username: username,
      message: message,
      timestamp: new Date().getTime()
    };
    socket.send(JSON.stringify(data));
    textarea.value = "";
  }
}

usernameInput.addEventListener("change", (event) => {
  username = event.target.value;
});
