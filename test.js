/* var kalix = {
   
};

_redis = require("./_redis");

var user = { user: "hello" };
_redis.setValue("hello", user);
var value;
_redis.getValue("hello",value);
console.log(value);

module.exports = kalix; */

/* var str="<p style='font-weight: bold;'>结果</p ><p>黑方: 0 + 0 = 0</br>白方: 0 + 0 + 7.5 = 7.5</p ><p style='font-weight: bold;'>白胜 7.5 目</p >"
var reg = ">([黑白]胜.*)<"
console.log(str.match(reg)[1]); */
 

function playTime(time) {
  var min = Math.floor(time / 60);
  var sec = Math.round(time) % 60;
  return min + ":" + (sec < 10 ? "0" + sec : sec);
}

console.log(playTime(1000));