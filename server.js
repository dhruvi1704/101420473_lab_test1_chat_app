const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const GroupMessage = require("./models/GroupMessage");
const PrivateMessage = require("./models/PrivateMessage");
const cors = require("cors");
require("dotenv").config();
const users = {};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500", 
    methods: ["GET", "POST"],
  },
});
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("view")); 
app.use("/auth", require("./routes/auth")); 
app.use("/", require("./routes/chat")); 

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Socket.io logic
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("message", async (data) => {
    const newMessage = new GroupMessage({
      from_user: data.user,
      room: data.room,
      message: data.message,
    });
    await newMessage.save();
    io.to(data.room).emit("message", data);
  });

  socket.on("privateMessage", async (data) => {
    const newMessage = new PrivateMessage({
      from_user: data.from_user,
      to_user: data.to_user,
      message: data.message,
    });
    await newMessage.save();
    io.to(data.to_user).emit("privateMessage", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.to(data.room).emit("typing", `${data.user} is typing...`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (username) => {
    users[username] = socket.id;
    console.log(`User registered: ${username} with socket ID: ${socket.id}`);
  });

  // Listen for typing events
  socket.on("typing", ({ to_user, from_user }) => {
    const recipientSocketId = users[to_user];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("displayTyping", { user: from_user });
    }
  });

  // Stop typing event
  socket.on("stopTyping", ({ to_user }) => {
    const recipientSocketId = users[to_user];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("stopTyping");
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    for (const username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// Group Message Route
app.post("/messages/group", async (req, res) => {
  try {
    const { from_user, room, message } = req.body;
    const newMessage = new GroupMessage({ from_user, room, message });
    await newMessage.save();
    res.status(201).json({ message: "Message saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Private Message Route
app.post("/messages/private", async (req, res) => {
  try {
    const { from_user, to_user, message } = req.body;
    const newMessage = new PrivateMessage({ from_user, to_user, message });
    await newMessage.save();
    res.status(201).json({ message: "Message saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
