import { io } from "socket.io-client";
import type { SocketWithEvents } from "./Types/socketTypes";

// Create the socket connection
const socket: SocketWithEvents = io("http://localhost:3000", {
  transports: ["websocket"], // Optional: Defines the transport protocol
});

// Example of emitting an event to the server
function registerUser(userId: string) {
  socket.emit("register", userId);
}

// Example of listening to events from the server
socket.on("force-logout", (data) => {
  console.log(data.message);  // Show the logout message
});

socket.on("broadcast", (data) => {
  console.log(data.message);  // Broadcast message from admin
});

export { socket, registerUser };
