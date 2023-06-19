const socket = new WebSocket("ws://localhost:3000");
const usersSet = new Set();

  // variable to set username
let username = "";

socket.addEventListener("open", (event) => {
  console.log("WebSocket connected!");
});

socket.addEventListener("message", (event) => {
  // variable to connect username with message and timestamp
  const data = JSON.parse(event.data);
  const { username, message, timestamp } = data;

  // converts timestamp to german time format
  const options = { hour: "numeric", minute: "numeric" };
  const time = new Date(timestamp).toLocaleTimeString("de-DE", options);

  // adds message to chat-message list, formated as followed:
  // avater contains first username character in a circle, timestamp in german time format
  // username in bold font, chat message on new line
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

  // prints message to console if connection is closed
socket.addEventListener("close", (event) => {
  console.log("WebSocket closed.");
});

  // prints message to console if an error occurs
socket.addEventListener("error", (event) => {
  console.error("WebSocket error:", event);
});

  // variables for textarea and username input button
const textarea = document.querySelector("textarea");
const usernameInput = document.querySelector("#username-input");

  // eventlistener to call sendMessage Function if enter key is pressed
textarea.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

  // function to send message
function sendMessage() {
  const message = textarea.value.trim();
  // if message is not empty, send message and clear textarea
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

  // function to change username
usernameInput.addEventListener("change", (event) => {
  username = event.target.value;
});

  // function to show popup overlay with username input field and button
function showPopup() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "flex";
}

  // function to join the chatroom
function joinChat() {
  const newUsername = document.getElementById("username-input").value.trim();
  if (newUsername !== "") {
    // sends a message to chat participants
    const message = newUsername + " ist dem Chat beigetreten!";
    socket.send(message);

    // updates participant list
    const usersElement = document.getElementById("users");
    const userElement = document.createElement("li");
    userElement.innerHTML = newUsername;
    usersElement.appendChild(userElement);

    // hides popup overlay (username & confirm button)
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";

    // set username
    username = newUsername;
  }
}