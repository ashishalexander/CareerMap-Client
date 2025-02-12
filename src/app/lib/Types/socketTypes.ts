// socketTypes.ts
import { INotification } from "@/app/user/(AuthenticatedUser)/Notifications/Types/INotification";
import type { Socket } from "socket.io-client";

export interface ServerToClientEvents {
  "force-logout": (data: { message: string }) => void;
  "broadcast": (data: { message: string }) => void;
  "notification:received": (notification: INotification) => void;
  "notification:error": (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  "register": (userId: string) => void; 
  "register-admin": (adminId: string) => void;
  "block-user": (userId: string) => void;
  "broadcast-message": (message: string) => void;
}

// Update the SocketWithEvents type to properly extend Socket
export type SocketWithEvents = Socket<ServerToClientEvents, ClientToServerEvents>;