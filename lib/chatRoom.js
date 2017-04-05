const redis = require('redis');
const redisClient = redis.createClient();

const d = '+++'

const chat = {};

chat.createMessage = (room, author, text, time) => {
  redisClient.set(`SUPERCHAT${d}${room}${d}${author}${d}${time}`, text);
 // redisClient.flushall();
};

chat.roomsAuthors = () => {
	//Get all unique rooms and author counts
  return new Promise(resolve => {
    redisClient.keys(`SUPERCHAT${d}*`, (err1, roomResults) => {
      var uniqueRooms = [];
      var results = [];
      roomResults.forEach( (roomResult) => {
        var uniqueAuthors = [];
        var roomName = roomResult.split("+++")[1];

        if (!uniqueRooms.includes(roomName)) {
          uniqueRooms.push(roomName);
          redisClient.keys(`SUPERCHAT${d}${roomName}${d}*`, (err2, authorResults) => {
            // console.log(authorResults);
            authorResults.forEach((authorResult) => {
              var author = authorResult.split("+++")[2];
              // console.log(author);
              if (!uniqueAuthors.includes(author)) {
              	uniqueAuthors.push(author);
              };
              console.log(uniqueAuthors);
            });
            let numAuthors = uniqueAuthors.length;
            let room = { name: roomName, authorCount: numAuthors };
            results.push(room);
          });
        }
      });
      resolve(results);
    });
  })
}

module.exports = chat;
