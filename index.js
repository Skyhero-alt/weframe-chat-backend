const io = require("socket.io")(process.env.PORT || 9999, {
  cors: {
    origin: "*",
    // allowedHeaders: ["my-custom-header"],
  },
});

let users = [];

const adduser = (userId, socketId) => {
  !users.some((users) => users.userId == userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId != socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId == userId);
};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("adduser", (userId) => {
    adduser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
