const express = require('express');
let router = express.Router();
let chat = require('../lib/chatRoom')

const index = (io) => {

  router.get('/', (req, res) => {

  	chat.createMessage("Axe Talk 1", "jon", "This is a message", Date.now());
    chat.roomsAuthors().then(rooms => {
      res.render('index', { rooms });
    });
  });



  return router;
};

module.exports = index;
