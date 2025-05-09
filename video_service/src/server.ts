// // import express from "express";
// // import http from "http";
// // import cors from "cors";
// // import { Server } from "socket.io";

// // const app = express();
// // app.use(cors());

// // const server = http.createServer(app);

// // const io = new Server(server, {
// //   cors: {
// //     origin: "http://localhost:3000", // frontend URL (React/Vite server)
// //     methods: ["GET", "POST"],
// //   },
// // });

// // io.on("connection", (socket) => {
// //   console.log("User connected:", socket.id);

// //   socket.on("join-room", ({ roomId }: { roomId: string }) => {
// //     socket.join(roomId);
// //     socket.to(roomId).emit("ready", { to: socket.id });
// //   });

// //   socket.on("offer", ({ offer, to }: { offer: RTCSessionDescriptionInit; to: string }) => {
// //     io.to(to).emit("offer", { offer, from: socket.id });
// //   });

// //   socket.on("answer", ({ answer, to }: { answer: RTCSessionDescriptionInit; to: string }) => {
// //     io.to(to).emit("answer", { answer });
// //   });

// //   socket.on("ice-candidate", ({ candidate, to }: { candidate: RTCIceCandidateInit; to: string }) => {
// //     io.to(to).emit("ice-candidate", { candidate });
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("User disconnected:", socket.id);
// //   });

// //   socket.on("reject-call", ({ to }) => {
// //     io.to(to).emit("call-rejected");
// //   });
  
// // });

// // server.listen(5006, () => {
// //   console.log("Video signaling server running on http://localhost:5006");
// // });



// import express from "express";
// import http from "http";
// import cors from "cors";
// import { Server } from "socket.io";

// const app = express();
// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // frontend URL (React/Vite server)
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join-room", ({ roomId }) => {
//     socket.join(roomId);
//     socket.to(roomId).emit("ready", { to: socket.id });
//   });

//   socket.on("offer", ({ offer, to }) => {
//     io.to(to).emit("offer", { offer, from: socket.id });
//   });

//   socket.on("answer", ({ answer, to }) => {
//     io.to(to).emit("answer", { answer });
//   });

//   socket.on("ice-candidate", ({ candidate, to }) => {
//     io.to(to).emit("ice-candidate", { candidate });
//   });

//   socket.on("reject-call", ({ to }) => {
//     io.to(to).emit("call-rejected");
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// server.listen(5006, () => {
//   console.log("Video signaling server running on http://localhost:5006");
// });





// import express from "express";
// import http from "http";
// import cors from "cors";
// import { Server } from "socket.io";

// const app = express();
// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// // Store user info: socket ID -> { name, roomId }
// const users: { [socketId: string]: { name: string; roomId: string } } = {};

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join-room", ({ roomId, name }: { roomId: string; name: string }) => {
//     users[socket.id] = { name, roomId };
//     socket.join(roomId);
//     console.log(`User ${name} (${socket.id}) joined room ${roomId}`);
//     socket.to(roomId).emit("ready", { to: socket.id });
//   });

//   socket.on("offer", ({ offer, to, displayName }: { offer: RTCSessionDescriptionInit; to: string; displayName: string }) => {
//     io.to(to).emit("offer", { offer, from: socket.id, displayName });
//   });

//   socket.on("answer", ({ answer, to, displayName }: { answer: RTCSessionDescriptionInit; to: string; displayName: string }) => {
//     io.to(to).emit("answer", { answer, displayName });
//   });

//   socket.on("ice-candidate", ({ candidate, to }: { candidate: RTCIceCandidateInit; to: string }) => {
//     io.to(to).emit("ice-candidate", { candidate });
//   });

//   socket.on("reject-call", ({ to }: { to: string }) => {
//     io.to(to).emit("call-rejected");
//   });

//   socket.on("end-call", ({ to }: { to: string }) => {
//     io.to(to).emit("end-call");
//   });

//   socket.on("display-name-change", ({ name, to }: { name: string; to: string }) => {
//     if (users[socket.id]) {
//       users[socket.id].name = name;
//       io.to(to).emit("display-name-change", { name });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//     delete users[socket.id];
//   });
// });

// server.listen(5006, () => {
//   console.log("Video signaling server running on http://localhost:5006");
// });



import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

interface User {
  id: string;
  name: string;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Set to your frontend origin in production
    methods: ["GET", "POST"],
  },
});

let users: Record<string, User> = {};

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ name }: { name: string }) => {
    users[socket.id] = { id: socket.id, name };
    io.emit("users-list", Object.values(users));
  });

  socket.on("offer", ({ offer, to }: { offer: RTCSessionDescriptionInit; to: string }) => {
    io.to(to).emit("offer", { offer, from: socket.id });
  });

  socket.on("answer", ({ answer, to }: { answer: RTCSessionDescriptionInit; to: string }) => {
    io.to(to).emit("answer", { answer, from: socket.id });
  });

  socket.on("ice-candidate", ({ candidate, to }: { candidate: RTCIceCandidateInit; to: string }) => {
    io.to(to).emit("ice-candidate", { candidate, from: socket.id });
  });

  socket.on("end-call", ({ to }: { to: string }) => {
    if (to) {
      io.to(to).emit("end-call");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
    io.emit("users-list", Object.values(users));
  });
});

server.listen(5006, () => {
  console.log("Server running on http://localhost:5006");
});
