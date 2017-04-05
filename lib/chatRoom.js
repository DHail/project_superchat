const redis = require('redis');
const redisClient = redis.createClient();

const chat = {};

chat.createRoom = name => {
  redisClient.hmset(name, {});
};

uniqueID = redisClient.keys("*", (err, results) => {}).length;
name + "-" + uniqueID

Axe-talk-5

chat.createMessage = name => {
  redisClient.hmset(name,
  {
  	author: "joe",
  	time: Date.now(),
  	message: "This is a very interesting message"

  });
  redisClient.keys("*", (err, results) => {
  	console.log(results);
  });
};

module.exports = chat;
