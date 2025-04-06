import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
//@ts-ignore
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });
interface Users {
  ws: WebSocket;
  rooms: string[];
  id: string;
}
const users: Users[] = [];

function TokenCheck(token: string): string | null {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (!decoded || !decoded.id) {
    return null;
  }
  return decoded.id;
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const params = new URLSearchParams(url.split("?")[1]);
  const token = params.get("token") || "";
  const userId = TokenCheck(token);
  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    ws,
    rooms: [],
    id: userId,
  });

  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data as unknown as string);
    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.id === userId);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.id === userId);
      if (!user) return;
      user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const { roomId, message }= parsedData;

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(message);
        }
      });

      await prismaClient.chat.create({
        data: {
          roomId:Number(roomId), 
          message,
          userId,
        },
      });
    }
  });
});
