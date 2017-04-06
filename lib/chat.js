const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient();

// const appName = "SUPERCHAT";
const d = "+++";

const chat = () => {

  function createMessage(room, author, text) {
    redisClient.lpush(`${room}${d}messages`, text);
    redisClient.lpush(`${room}${d}authors`, author);
    redisClient.sadd(`${room}${d}uniqueAuthors`, author);
    redisClient.sadd('rooms', room);
  }

  function newMember(room, author) {
    return redisClient.sadd(`${room}${d}uniqueAuthors`, author);
  }

  async function allRoomsAndAuthors() {
    const rooms = await redisClient.smembersAsync('rooms');
    let roomsAndAuthors = rooms.map(roomAuthorCount);
    return Promise.all(roomsAndAuthors);
  }

  async function roomAuthorCount(roomName) {
    let authorCount = await getAuthorsForRoom(roomName);
    authorCount = authorCount.length;
    return { roomName, authorCount };
  }

  async function getAuthorsForRoom(room) {
    return await redisClient.smembersAsync(`${room}${d}uniqueAuthors`);
  }

  async function messagesForRoom(roomName) {
    let messages = [];
    let texts = await redisClient.lrangeAsync(`${roomName}${d}messages`, 0, -1);
    let authors = await redisClient.lrangeAsync(`${roomName}${d}authors`, 0, -1);
    for( let i = texts.length - 1; i >= 0; i-- ) {
      messages.push( { 'author': authors[i], 'text': texts[i] } );
    }
    return messages;
  }




  // function createMessage(room, author, text, time) {
  //   redisClient.setnx(`${appName}${d}${room}${d}${author}${d}${time}`, text);
  // }
  //
  // async function allRoomsAndAuthors() {
  //   const roomKeys = await redisClient.keysAsync(`${appName}${d}*`);
  //   const uniqueRooms = _getUnique(roomKeys, 1);
  //   const results = uniqueRooms.map(getAuthorCountForRoom);
  //   return Promise.all(results);
  // }
  //
  // async function getAuthorCountForRoom(roomName) {
  //   const authorKeys = await redisClient.keysAsync(
  //     `${appName}${d}${roomName}*`
  //   );
  //   const authorCount = _getUnique(authorKeys, 2).length;
  //   return { roomName, authorCount };
  // }
  //
  // async function messagesForRoom(room) {
  //   const messageKeys = await redisClient.keysAsync(`${appName}${d}${room}*`);
  //   const allMessages = messageKeys.map(_getMessage);
  //   return Promise.all(allMessages);
  // }
  //
  // async function _getMessage(messageKey) {
  //   const text = await redisClient.getAsync(messageKey);
  //   const author = messageKey.split(`${d}`)[2];
  //   return { author, text };
  // }

  async function seed() {
    redisClient.flushallAsync();

    createMessage(
      "Vikings",
      "Jerry",
      "Anyone want to talk about shieldmaidens?",
      Date.now()
    );
    createMessage(
      "Vikings",
      "Dave",
      "I will strike down our enemies.",
      Date.now()
    );
    createMessage(
      "Axe Talk",
      "Barry",
      "Hey my name's Barry, anyone wanna chat?",
      Date.now()
    );
    createMessage(
      "Sword Talk",
      "Larry",
      "Pretty, pretty, pretty, pretty good.",
      Date.now()
    );
  }

  // function _getUnique(array, index) {
  //   array = array.map(el => {
  //     return el.split(`${d}`)[index];
  //   });
  //   let found = {};
  //   let results = [];
  //   for (let i = 0; i < array.length; i++) {
  //     if (!found[array[i]]) {
  //       found[array[i]] = true;
  //       results.push(array[i]);
  //     }
  //   }
  //   return results;
  // }

  return {
    createMessage,
    newMember,
    allRoomsAndAuthors,
    messagesForRoom,
    seed
  };
};

module.exports = chat();
