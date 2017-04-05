const express = require('express');
let router = express.Router();
let chat = require('../lib/chatRoom')

const index = (io) => {

  router.get('/', (req, res) => {
    
  	chat.createRoom("Axe Talk");

  	// redisClient.hset("Axe talk", )

  	// redisClient.hgetall("uniqueID", (err, results) => {
   //      console.log(results);
   //    });
    res.render('index');
  });



  return router;
};

module.exports = index;
