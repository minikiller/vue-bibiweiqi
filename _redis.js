import Redis from 'ioredis';
import JSONCache from 'redis-json';

const redis = new Redis();

const jsonCache = new JSONCache(redis)

// const user = {
//   name: "test",
//   age: 21,
//   gender: "male"
// }

function setRedis (key,json){
    await jsonCache.set(key, user);
}

function getRedis(key){
    await jsonCache.get(key)
}

export default {
    setRedis,
    getRedis
}
/* client.on("error", function(err) {
  console.log("Error " + err);
});
// client.set("color", "red", redis.print);
// client.get("color", function(err, value) {
//   if (err) throw err;
//   console.log("Got: " + value);
//   client.quit();
// });

user = { Name: "Pradeep", Company: "SCTL", Address: "Mumbai", Location: "RCP" };
client.set("hello", JSON.stringify(user));

str = client.get("hello");

console.log(JSON.parse(str));

// client.hset("pythonDict", user);

// var test = client.hget("pythonDict");
function setList(list, callback) {
  const pipeline = redis.pipeline();
  for (const dict of list) {
    pipeline.rpush("myList", JSON.stringify(dict));
  }
  pipeline.exec(callback);
}

function popList(callback) {
  redis.lpop("mylist", function(error, data) {
    if (error) {
      return callback(error);
    }
    callback(null, JSON.parse(data));
  });
}
 */