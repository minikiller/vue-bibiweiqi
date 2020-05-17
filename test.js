var dict = { 0: { gameid: "a" }, 1: { gameid: "a" }, 2: { gameid: "c" } };
var _list=[]
for (var key in dict) {
    if (dict[key].gameid == "a")
       _list.push(key)
}
for (x of _list) {
    console.log(x);
}
_list.forEach((item) => {
    console.log(item);
});
