const redis = require('redis');
const redisClient = redis.createClient();

const chat = {};

chat.createRoom = name => {
  redisClient.hmset([name, "test keys 1", "test val 1", "test keys 2", "test val 2"], function (err, res) {});
};

module.exports = chat;
