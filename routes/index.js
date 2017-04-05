const express = require('express');
let router = express.Router();
let chat = require('../lib/chatRoom')

const index = (io) => {

  router.get('/', (req, res) => {
  	chat.createMessage("Axe Talk 2", "dave", "This is a message", Date.now());
    chat.allRoomsAuthors().then(rooms => {
      console.log(rooms);
      res.render('index', { rooms });
    });
  });

  router.post('/newRoom', (req, res) => {
    const roomName = req.body.name;
    const author = "jon";
    chat.createMessage(roomName, author, `This room was created by ${author}.`, Date.now());
    res.redirect('/');
  });

  router.post('/', (req, res) => {
    chat.createMessage("Axe Talk 1", "jon", "This is a message", Date.now());
  });


  return router;
};

module.exports = index;
