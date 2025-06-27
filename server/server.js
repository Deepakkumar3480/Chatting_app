import express from "express";
import "dotenv/config";

import cors from "cors";
import http from "http";
import { conncectDB } from "./lib/lib.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

//create express app and http server
const app = express();
//we are using this http server because socket io support this
const server = http.createServer(app);

//initialize socket.io server
export const io = new Server(server, {
  cors: { origin: process.env.FRONTED_URL },
});

//store online users
export const userSocketMap = {}; //{userId:socketId}

//socket.io connection handler
io.on("connection", (socket) => {
  //it is used because token is pass in the client so that userId for verify
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);

  //this means which user get the which socketid
  if (userId) userSocketMap[userId] = socket.id;

  //emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", userId);
    delete userSocketMap[userId];
    io.emit("get Online Users", Object.keys(userSocketMap));
  });
});

//middleware setup

app.use(express.json({ limit: "5mb" }));
app.use(cors());
// const allowedOrigins = [
//   'https://chatting-app-seven-rho.vercel.app',
//   'https://chatting-app-git-main-deepakkumar3480s-projects.vercel.app',
//   'http://localhost:3000'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS not allowed for this origin: ' + origin));
//     }
//   },
//   credentials: true
// }));


app.use("/api/status", (req, res) => {
  res.send("server is live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

app.get('/',(req,res)=>{
  return res.json({message:"welcome to chat app backend"})
})

await conncectDB();

//it only run for the localhost
// if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
// }

//export server for vercel
// export default server;
