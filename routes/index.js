const express = require('express');
let router = express.Router();
let chat = require('../lib/chatRoom');

const index = (io) => {

  router.get('/', (req, res) => {

    

  	if(!req.cookies.username) {
  		res.redirect("/login");
  	} else {
  		var rooms;
	  	chat.createMessage("Axe Talk 2", "Jack", "Blah blah blah", Date.now());
	    chat.allRoomsAuthors().then(allRooms => {
	    	rooms = allRooms;
	      
	      
	    });
	  }
  });

  router.get('/login', (req, res) => {
  	if(req.cookies.username) {
  		res.redirect('/');
  	} else {
  		res.render('login');
  	}
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

  router.post('/login', (req, res) => {
   let username = req.body.username;
    res.cookie('username', username);
    res.redirect('/');
  });

  io.on('connection', client => {

  	client.on("openRoom", (roomName) => {

  		chat.getRoomMessages(roomName).then(messages => {
	      	client.emit("displayRoom", messages)
	      });

	  });

  });


  return router;
};

module.exports = index;
