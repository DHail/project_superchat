const redis = require("redis");
const redisClient = redis.createClient();

const appName = 'SUPERCHAT';
const d = "+++";

const chat = () => {
  
  function createMessage(room, author, text, time) {
    redisClient.set(`${appName}${d}${room}${d}${author}${d}${time}`, text);
    // redisClient.flushall();
  }

  function allRoomsAuthors() {
    //Get all unique rooms and author counts
    return new Promise(resolve => {
      let results = [];
      redisClient.keys(`${appName}${d}*`, (err1, allKeys) => {
        const roomNames = _unique(allKeys, 1);
        roomNames.forEach(roomName => {
          redisClient.keys(`${appName}${d}${roomName}*`, (err2, roomKeys) => {
            const authorCount = _unique(roomKeys, 2).length;
            const result = { roomName, authorCount };
            results.push(result);
          });
        });
      });
      resolve(results);
    });
  }


  function _unique(array, index) {
    array = array.map(el => {
      return el.split(`${d}`)[index];
    });
    let found = {};
    let results = [];
    for (let i = 0; i < array.length; i++) {
      if (!found[array[i]]) {
        found[array[i]] = true;
        results.push(array[i]);
      }
    }
    return results;
  }

  return {
    createMessage,
    allRoomsAuthors
  };
};

function getRoomMessages(roomName) {
	redisClient.keys(`${appName}${d}${roomName}*`, (err2, results) => {
	    var allMessages = results.map( (el) => {
	    	return redisClient.get('el');
	    });
	  });
}

module.exports = chat();
