import { WebSocketServer } from "ws";
import jwt from 'jsonwebtoken'
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
   const url = request.url;
   if (!url) {
      return;
   }
   
   const params = new URLSearchParams(url.split("?")[1]);
   const token = params.get("token") || ""
   const decoded = jwt.verify(token, "121212");
   if(!decoded){
      return;
   }
   ws.on("message", () => {
      ws.send(token as string);
   });
});
