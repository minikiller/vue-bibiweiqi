## qucik start

```
git clone https://github.com/minikiller/vue-bibiweiqi
npm install
npm run start
node app.js
```

install redis

```
git clone https://github.com/minikiller/flask-app
pip install -r requirements.txt
python api.py
```

access https://localhost:8080

### TODO i18n vue

### Sass

- npm install -D sass-loader sass

```
<style lang="scss">
$color: red;
</style>
```

### pass params

```
{ path: "/play/:game_id", component: PlayPage , props: true },
```

```
<router-link :to="{path:'/play/'+data.id}">
                <b-button variant="primary">进入房间</b-button>
              </router-link>
```

### websocket

```
// send to current request socket client
socket.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients, include sender
io.sockets.emit('message', "this is a test");

// sending to all clients in 'game' room(channel), include sender
io.sockets.in('game').emit('message', 'cool game');

// sending to individual socketid
io.sockets.connected(socketid).emit('message', 'for your eyes only');
```

### vuex

```
  computed: {
    ...mapState({
      account: state => state.account,
      games: state => state.games
    })
  },
  methods: {
    ...mapMutations("games", ["addUser", "deleteUser"])
  },
```

### route

```
<router-link :to="{path:'/play/'+data.id}">
  <b-button variant="primary">进入房间</b-button>
</router-link>
```

```
{ path: "/play/:game_id", component: PlayPage , props: true },
```

### fomat string

```
const format = require('string-format')
format.extend (String.prototype, {})
var a = "Hello {0} {1}!".format("world","hello");
console.log(a)
```

### confict with vee-validate and b-table

refer to: https://github.com/bootstrap-vue/bootstrap-vue/issues/1270

```
Vue.use(VeeValidate, {
  inject: true,
  fieldsBagName: 'veeFields'
});
```

### dialog

```
  this.$bvModal.msgBoxConfirm('Please confirm that you want to delete everything.', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            this.boxTwo = value
          })
          .catch(err => {
            // An error occurred
          })
      }
```

### clear redis all key

```
redis-cli flushall
```

### print a object

```
var inspect = require('util').inspect;
console.log(inspect(response))
```

### base64 image

https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
https://github.com/dankogai/js-base64

### webpack

https://medium.com/js-dojo/how-to-configure-webpack-4-with-vuejs-a-complete-guide-209e943c4772

https://vuejsdevelopers.com/2017/06/18/vue-js-boost-your-app-with-webpack/

https://segmentfault.com/a/1190000016309142

https://cdnjs.com/

### flask deploy 
gunicorn -w 4 --certfile=cert.pem --keyfile=privkey.pem --bind 0.0.0.0:5000 api:app
### fontawsome

### watch vuex module variant

```
watch: {
    "$store.state.games.connected"(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);

      // Do whatever makes sense now
      if (newValue === true) {
        this.$store.commit("alert/success", "连接服务器成功！");
      } else {
        this.$store.commit("alert/error", "连接服务器失败，请重新登陆！");
      }
    }
  },
```

### nodejs log

https://www.digitalocean.com/community/tutorials/how-to-use-winston-to-log-node-js-applications

### normal js call vuex state and mutations
refer to https://stackoverflow.com/questions/41534412/how-to-get-vuex-state-from-a-javascript-file-instead-of-a-vue-component
```
import { store } from "../_store/index.js";

export function testing() {
  // store.state.games.BL = 90;
  store.commit("games/setBL", 180);
  alert(store.state.games.BL);
}
```

### another example for go ai
https://github.com/sanderland/katrain#install
