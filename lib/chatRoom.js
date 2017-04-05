const redis = require('redis');
const redisClient = redis.createClient();

const d = '+++'

const chat = {};

chat.createMessage = room, author, text, time => {
  redisClient.set(`SUPERCHAT${d}${room}${d}${author}${d}${time}`, text);
};

module.exports = chat;
