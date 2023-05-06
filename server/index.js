const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

let userRooms={// ilgili odalardaki kullanıcı listesini tutan obje  1.odada ahmet ve mehmet va
  1:[{userId:"socketId",username:"kamil"}]
}

const server = http.createServer(app);

const io = new Server(server, {//frontend bölümüde cors hatası almamak için  3000.port a işlem izni ver.
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {//server a bağlanıldığında çalışır.
  console.log(`User Connected with id:${socket.id} `);

  socket.on("join_room", (userJoin) => {
    const { room, username } = userJoin;
    const userId = socket.id; // kullanıcının benzersiz kimliğini al
    if (!userRooms[room]) {
      userRooms[room] = [{ userId, username: username }];
    } else {
      userRooms[room] = [...userRooms[room], { userId, username: username }];
    }
    socket.join(room);//kullanıcını belirtilen odada yer almasını sağlar
    console.log(`User with ID: ${userId} joined room: ${room}`);
    io.emit("user_list", userRooms[room]);
  });

  socket.on("disconnect", () => {
    console.log(`User with ID: ${socket.id} disconnected`);
    const userId = socket.id; // kullanıcının benzersiz kimliğini al
    let userRoom = null;
    for (const room in userRooms) {
      // tüm odaları dolaş
      if (userRooms[room].find((user) => user.userId === userId)) {
        // kullanıcının olduğu odayı bul
        userRoom = room;
        userRooms[userRoom] = userRooms[userRoom].filter((user) => user.userId !== userId); // kullanıcıyı listeden çıkar
        break;
      }
    }
    if (userRoom) {
      io.to(userRoom).emit("user_list", userRooms[userRoom]); // odaya kalan kullanıcıları gönder
    }
  });


  socket.on("send_message", (data) => {//server a gelen mesajı
    socket.to(data.room).emit("messageReturn", data);//frontend de karşılı serverdan gönderiyorum 
  });

});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});


