const express = require('express');
let router = express.Router();
let chat = require('../lib/chatRoom')
const redis = require('redis');
const redisClient = redis.createClient();

const index = (io) => {

  router.get('/', (req, res) => {
    
  	chat.createMessage("Axe Talk 2", "joe", "This is a message", Date.now());



  	



  	// redisClient.hgetall("uniqueID", (err, results) => {
   //      console.log(results);
   //    });
    res.render('index' );
  });



  return router;
};

module.exports = index;
