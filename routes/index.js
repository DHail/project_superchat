const express = require("express");
let router = express.Router();
let chat = require("../lib/chat");

const index = io => {
  router.get("/", (req, res) => {
    if (!req.cookies.username) {
      res.redirect("/login");
    } else {
      const username = req.cookies.username;
      chat.allRoomsAndAuthors().then(rooms => {
        res.render("index", { username, rooms });
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

  router.post("/logout", (req, res) => {
    if (req.cookies.username) {
      res.clearCookie('username');
    } 
    res.redirect("/");
  });

  router.get('/seed', (req, res) => {
    chat.seed().then( () => {
      res.redirect('/');
    })
  });

  router.post("/newRoom", (req, res) => {
    const roomName = req.body.name;
    const author = req.cookies.username;
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

    client.on("click room", roomName => {
      chat.messagesForRoom(roomName).then(messages => {
        client.emit("open room", messages);
      });
    });

    client.on('submit new room', (roomName, author) => {
      chat.createMessage(
        roomName,
        author,
        `This room was created by ${author}.`,
        Date.now()
      );
      chat.messagesForRoom(roomName).then(messages => {
        client.emit("open room", messages);
      });
      io.emit('add new room', roomName);
    });

    client.on('new message', (roomName, author, text) => {
      chat.createMessage(
        roomName,
        author,
        text,
        Date.now()
      );
      io.emit("created message", roomName, author, text);
    });

  });

  return router;
};

module.exports = index;
