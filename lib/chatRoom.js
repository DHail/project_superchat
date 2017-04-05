const redis = require('redis');
const redisClient = redis.createClient();

const d = '+++'

const chat = {};

chat.createMessage = (room, author, text, time) => {
  redisClient.set(`SUPERCHAT${d}${room}${d}${author}${d}${time}`, text);

  // redisClient.keys("*", (err, results) => {
  //       console.log(results);
  //     });

  // redisClient.flushall();
};

chat.roomsAuthors = () => {
	//Get all unique rooms
	var uniqueRooms = [];
	redisClient.keys("*", (err, results) => {
		allRooms = results.forEach( (el) => {
			room = el.split("+++")[1];
			if (!uniqueRooms.includes(room)) {
				uniqueRooms.push(room);
			}
		});
	console.log(uniqueRooms);
	});
	//get authors for each room

}

module.exports = chat;
