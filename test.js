const format = require('string-format')
format.extend (String.prototype, {})
var a = "Hello {0} {1}!".format("world","hello");
console.log(a)
