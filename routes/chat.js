const express = require("express");
const router = express.Router();
const User = require("../models/User");
const GroupMessage = require("../models/GroupMessage");
const PrivateMessage = require("../models/PrivateMessage");
const bcrypt = require("bcryptjs");

// for signup
router.post("/auth/signup", async (req, res) => {
  try {
    const { username, firstname, lastname, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      firstname,
      lastname,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// for group chat
router.post("/chat/group", async (req, res) => {
  try {
    const { from_user, room, message } = req.body;

    const newMessage = new GroupMessage({ from_user, room, message });
    await newMessage.save();

    res.json({ message: "Message stored in group chat!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/group-message", async (req, res) => {
  try {
    const { from_user, room, message } = req.body;
    const newMessage = new GroupMessage({ from_user, room, message });
    await newMessage.save();
    res.json({ message: "Group message saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// for private chat
router.post("/private-message", async (req, res) => {
  try {
    const { from_user, to_user, message } = req.body;
    const newMessage = new PrivateMessage({ from_user, to_user, message });
    await newMessage.save();
    res.json({ message: "Private message saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
