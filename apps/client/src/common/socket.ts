import { io } from "socket.io-client";

const url =
  process.env.NODE_ENV === "production" ? "PROD_LINK" : "http://localhost:3000";

export const socket = io(url);
