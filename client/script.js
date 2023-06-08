const socket = new WebSocket("ws://localhost:3000");
const usersSet = new Set();


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
  const chatMessages = document.querySelector(".chat-messages ul");
  const newMessage = document.createElement("li");
  newMessage.innerHTML = `
  <div class="message">
    <div class="avatar">${username.charAt(0)}</div>
    <div class="message-details">
        <div class="time">${time}</div>
        <div class="username">${username}</div>
      <div class="message-text">${message}</div>
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


function showPopup() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "flex";
}

function joinChat() {
  const newUsername = document.getElementById("username-input").value.trim();
  if (newUsername !== "") {
    // Sende eine Benachrichtigung an die Chat-Teilnehmer
    const message = newUsername + " ist dem Chat beigetreten!";
    socket.send(message);

    // Aktualisiere die Teilnehmerliste
    const usersElement = document.getElementById("users");
    const userElement = document.createElement("li");
    userElement.innerHTML = newUsername;
    usersElement.appendChild(userElement);

    // Verstecke das Anmelde-Popup
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";

    // Setze den aktuellen Benutzernamen
    username = newUsername;
  }
}