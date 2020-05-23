var kalix = {
   
};

_redis = require("./_redis");

var user = { user: "hello" };
_redis.setValue("hello", user);
var value;
_redis.getValue("hello",value);
console.log(value);

module.exports = kalix;
