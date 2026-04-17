import { io } from "socket.io-client";

export const socket = io("https://auction-backend-gt06.onrender.com", {
  transports: ["websocket"],
});