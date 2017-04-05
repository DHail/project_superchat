const express = require("express");
let router = express.Router();
let chat = require("../lib/chatRoom");

const index = io => {
  router.get("/", (req, res) => {
    if (!req.cookies.username) {
      res.redirect("/login");
    } else {
      chat.allRoomsAuthors().then(rooms => {
        res.render("index", { rooms });
      });
    }
  });

  router.get("/login", (req, res) => {
    if (req.cookies.username) {
      res.redirect("/");
    } else {
      res.render("login");
    }
  });

  router.post("/newRoom", (req, res) => {
    const roomName = req.body.name;
    const author = "jon";
    chat.createMessage(
      roomName,
      author,
      `This room was created by ${author}.`,
      Date.now()
    );
    res.redirect("/");
  });

  router.post("/login", (req, res) => {
    let username = req.body.username;
    res.cookie("username", username);
    res.redirect("/");
  });

  io.on("connection", client => {

    client.on("openRoom", roomName => {
      chat.getRoomMessages(roomName).then(messages => {
        client.emit("displayRoom", messages);
      });
    });

    client.on('newRoom', data => {
      let roomName = data.roomName;
      let author = data.userName;
      chat.createMessage(
        roomName,
        author,
        `This room was created by ${author}.`,
        Date.now()
      );
      chat.getRoomMessages(roomName).then(messages => {
        client.emit("displayRoom", messages);
      });
    });

    client.on('newMessage', data => {
      let roomName = data.roomName;
      let author = data.userName;
      let message = data.message;
      chat.createMessage(
        roomName,
        author,
        message,
        Date.now()
      );
        io.emit("brandNewMessage", {author, message});
    });

  });

  return router;
};

module.exports = index;
