const redis = require("redis");
const client = redis.createClient();
var _redis = {
  setValue: function(key, value) {
    client.set(key, JSON.stringify(value), (err, res) => {
      console.log(res);
    });
  },
  getValue: function(key,value) {
    client.get(key, (err, res) => {
      value=res;
    });
  },
};

module.exports = _redis;
